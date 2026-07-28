from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import asyncio
import sys
import os
_base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(_base)
sys.path.append(os.path.join(_base, 'backend'))

from api.routes import router
from websocket import ConnectionManager
from config.settings import settings
from data.transaction_store import TransactionStore
from scripts.demo_data import generate_demo_transaction
from integrations.arc_connector import ArcConnector
from agents.transaction_monitor import TransactionMonitorAgent
from agents.risk_scorer import RiskScorerAgent
from agents.sanctions_screener import SanctionsScreenerAgent
from agents.cross_chain_intel import CrossChainIntelligenceAgent
from agents.reporting_agent import ReportingAgent
from agents.orchestrator import AgentOrchestrator
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

manager = ConnectionManager()
arc_connector = None
orchestrator = None
agents = {}
store = TransactionStore()

@asynccontextmanager
async def lifespan(app: FastAPI):
    global arc_connector, orchestrator, agents

    logger.info("Starting Cipher Protocol...")

    arc_connector = ArcConnector()

    agents = {
        "monitor": TransactionMonitorAgent(),
        "risk_scorer": RiskScorerAgent(),
        "cross_chain": CrossChainIntelligenceAgent(),
        "sanctions": SanctionsScreenerAgent(),
        "reporting": ReportingAgent()
    }

    orchestrator = AgentOrchestrator(agents)

    router.store = store
    router.orchestrator = orchestrator
    router.manager = manager

    logger.info("All agents initialized")

    logger.info("Seeding demo transactions...")
    await seed_demo_transactions(orchestrator, store, manager)
    logger.info(f"Seeded {len(store.transactions)} demo transactions")

    asyncio.create_task(continuous_transaction_stream(orchestrator, store, manager))

    yield

    logger.info("Shutting down Cipher Protocol...")

async def start_monitoring():
    logger.info("Real block monitoring active — transactions are logged but not displayed on dashboard")
    await arc_connector.monitor_new_blocks(lambda tx: None)

app = FastAPI(
    title="Cipher Protocol API",
    description="Autonomous AML/KYC compliance for Arc blockchain",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://cipher-protocol.vercel.app",
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Cipher Protocol API",
        "status": "operational",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast({"type": "message", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def seed_demo_transactions(orchestrator, store, manager):
    distribution = (
        ["normal"] * 70
        + ["suspicious"] * 18
        + ["sanctioned"] * 6
        + ["cross_chain"] * 6
    )
    random.shuffle(distribution)
    for tx_type in distribution:
        tx = generate_demo_transaction(tx_type)
        if tx_type == "sanctioned":
            orchestrator.agents["sanctions"].add_sanctioned_address("OFAC", tx["to"])
        result = await orchestrator.process_transaction(tx)
        result_data = {
            "risk_score": result.risk_result.get("risk_score", 0),
            "decision": result.final_decision,
            "reasons": result.risk_result.get("reasons", []),
            "final_decision": result.final_decision,
        }
        store.add_transaction(tx, result_data)
        if manager:
            await manager.broadcast_transaction_alert({
                "transaction": tx,
                "result": result_data,
            })

async def continuous_transaction_stream(orchestrator, store, manager):
    await asyncio.sleep(10)
    while True:
        weights = [70, 18, 6, 6]
        tx_type = random.choices(
            ["normal", "suspicious", "sanctioned", "cross_chain"],
            weights=weights
        )[0]
        tx = generate_demo_transaction(tx_type)
        if tx_type == "sanctioned":
            orchestrator.agents["sanctions"].add_sanctioned_address("OFAC", tx["to"])
        result = await orchestrator.process_transaction(tx)
        result_data = {
            "risk_score": result.risk_result.get("risk_score", 0),
            "decision": result.final_decision,
            "reasons": result.risk_result.get("reasons", []),
            "final_decision": result.final_decision,
        }
        store.add_transaction(tx, result_data)
        if manager:
            await manager.broadcast_transaction_alert({
                "transaction": tx,
                "result": result_data,
            })
        await asyncio.sleep(random.uniform(4, 12))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

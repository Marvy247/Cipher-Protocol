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
from integrations.arc_connector import ArcConnector
from agents.transaction_monitor import TransactionMonitorAgent
from agents.risk_scorer import RiskScorerAgent
from agents.sanctions_screener import SanctionsScreenerAgent
from agents.cross_chain_intel import CrossChainIntelligenceAgent
from agents.reporting_agent import ReportingAgent
from agents.orchestrator import AgentOrchestrator
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

manager = ConnectionManager()
arc_connector = None
orchestrator = None
agents = {}

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

    asyncio.create_task(start_monitoring())

    logger.info("All agents initialized")

    yield

    logger.info("Shutting down Cipher Protocol...")

async def start_monitoring():
    async def process_tx(transaction):
        try:
            result = await orchestrator.process_transaction(transaction)
            await manager.broadcast_transaction_alert({
                "transaction": transaction,
                "result": {
                    "risk_score": result.risk_result.get("risk_score", 0),
                    "decision": result.final_decision,
                    "reasons": result.risk_result.get("reasons", [])
                }
            })
        except Exception as e:
            logger.error(f"Error processing transaction: {e}")

    await arc_connector.monitor_new_blocks(process_tx)

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

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

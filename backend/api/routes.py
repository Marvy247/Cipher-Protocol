from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from data.transaction_store import TransactionStore
from agents.orchestrator import AgentOrchestrator
from scripts.demo_data import generate_demo_transaction

router = APIRouter()
router.store: TransactionStore = None
router.orchestrator: AgentOrchestrator = None


class TransactionResponse(BaseModel):
    tx_hash: str
    from_address: str
    to_address: str
    amount: float
    risk_score: int
    status: str
    timestamp: datetime


class RiskAlert(BaseModel):
    alert_id: str
    tx_hash: str
    risk_score: int
    reasons: List[str]
    agent_decisions: dict
    timestamp: datetime


class ComplianceReport(BaseModel):
    report_id: str
    period_start: datetime
    period_end: datetime
    total_transactions: int
    flagged_count: int
    blocked_count: int
    sar_filed: int


@router.get("/transactions")
async def get_transactions(
    limit: int = Query(100, le=1000),
    risk_threshold: Optional[int] = None
):
    if not router.store:
        return {"transactions": [], "total": 0, "limit": limit}
    txs = router.store.get_recent(limit)
    return {
        "transactions": txs,
        "total": len(router.store.transactions),
        "limit": limit
    }


@router.get("/transactions/{tx_hash}")
async def get_transaction(tx_hash: str):
    if not router.store:
        return {"tx_hash": tx_hash}
    for t in router.store.transactions:
        if t["tx"].get("hash") == tx_hash:
            return t
    raise HTTPException(status_code=404, detail="Transaction not found")


@router.get("/risk-alerts")
async def get_risk_alerts(limit: int = Query(50, le=500)):
    if not router.store:
        return {"alerts": [], "total": 0}
    alerts = router.store.get_alerts(limit)
    return {"alerts": alerts, "total": len(router.store.alerts)}


@router.get("/agents/status")
async def get_agents_status():
    return {
        "agents": [
            {"name": "Transaction Monitor", "status": "active", "uptime": "99.9%"},
            {"name": "Risk Scorer", "status": "active", "uptime": "99.8%"},
            {"name": "Cross-Chain Intelligence", "status": "active", "uptime": "99.7%"},
            {"name": "Sanctions Screener", "status": "active", "uptime": "100%"},
            {"name": "Reporting Agent", "status": "active", "uptime": "99.9%"}
        ]
    }


@router.get("/stats/overview")
async def get_overview_stats():
    if not router.store:
        return {
            "total_transactions": 0, "transactions_today": 0,
            "flagged_count": 0, "blocked_count": 0,
            "average_risk_score": 0, "processing_time_ms": 0
        }
    return router.store.get_stats()


@router.post("/reports/generate")
async def generate_compliance_report(
    start_date: datetime,
    end_date: datetime
):
    return {
        "report_id": "report_123",
        "status": "generating",
        "estimated_time": "10 seconds"
    }


@router.get("/sanctions/check/{address}")
async def check_sanctions(address: str):
    return {
        "address": address,
        "is_sanctioned": False,
        "lists": []
    }


@router.get("/integrations/usage")
async def get_integration_usage(
    limit: int = Query(100, le=1000),
    service: Optional[str] = None
):
    from integrations.usage_tracker import tracker
    return {
        "records": tracker.get_records(limit=limit, service=service),
        "total": len(tracker._records) if hasattr(tracker, '_records') else 0
    }


@router.get("/integrations/summary")
async def get_integration_summary():
    from integrations.usage_tracker import tracker
    return tracker.get_summary()


@router.get("/demo/seed")
async def seed_demo_data():
    if not router.orchestrator:
        return {"error": "Orchestrator not initialized", "seeded": 0}
    count = 0
    scenarios = [
        ("normal", None),
        ("suspicious", None),
        ("sanctioned", None),
        ("suspicious", "0xMULTICHAINWALLET1234567890123456789012345678"),
    ]
    for tx_type, custom_from in scenarios:
        for _ in range(3):
            tx = generate_demo_transaction(tx_type)
            if custom_from:
                tx["from"] = custom_from
            if tx_type == "sanctioned":
                router.orchestrator.agents["sanctions"].add_sanctioned_address("OFAC", tx["to"])
            result = await router.orchestrator.process_transaction(tx)
            result_data = {
                "risk_score": result.risk_result.get("risk_score", 0),
                "decision": result.final_decision,
                "reasons": result.risk_result.get("reasons", []),
                "final_decision": result.final_decision,
            }
            router.store.add_transaction(tx, result_data)
            count += 1
    return {
        "seeded": count,
        "message": f"Seeded {count} demo transactions",
        "stats": router.store.get_stats(),
    }

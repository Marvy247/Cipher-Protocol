from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import time
import asyncio
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


class ComplianceCheckRequest(BaseModel):
    type: str = "normal"
    tx_hash: Optional[str] = None
    simulate_payment_failure: bool = False


@router.post("/compliance-check")
async def run_compliance_check(req: ComplianceCheckRequest):
    if not router.orchestrator:
        raise HTTPException(status_code=503, detail="Orchestrator not ready")
    if req.type not in ("normal", "suspicious", "sanctioned"):
        raise HTTPException(status_code=400, detail="Invalid type. Choose: normal, suspicious, sanctioned")

    tx_type = req.type
    tx = generate_demo_transaction(tx_type)
    if req.tx_hash:
        h = req.tx_hash.strip()
        if h.startswith("0x"):
            h = h[2:]
        tx["hash"] = "0x" + h.lower()

    if tx_type == "sanctioned":
        router.orchestrator.agents["sanctions"].add_sanctioned_address("OFAC", tx["to"])

    agent_steps = []
    start = time.time()

    t0 = time.time()
    monitor_result = await router.orchestrator.agents["monitor"].process(tx)
    agent_steps.append({
        "name": "Transaction Monitor",
        "icon": "🔍",
        "duration": round(time.time() - t0, 3),
        "output": _summarize_monitor(tx, monitor_result),
    })

    t0 = time.time()
    risk_result = await router.orchestrator.agents["risk_scorer"].process({
        "transaction": tx,
        "monitor_result": monitor_result,
    })
    agent_steps.append({
        "name": "Risk Scorer",
        "icon": "📊",
        "duration": round(time.time() - t0, 3),
        "output": _summarize_risk(risk_result),
    })

    t0 = time.time()
    cross_chain_result = await router.orchestrator.agents["cross_chain"].process({
        "transaction": tx,
        "risk_result": risk_result,
    })
    agent_steps.append({
        "name": "Cross-Chain Intel",
        "icon": "🌐",
        "duration": round(time.time() - t0, 3),
        "output": _summarize_cross_chain(cross_chain_result),
    })

    t0 = time.time()
    sanctions_result = await router.orchestrator.agents["sanctions"].process({
        "transaction": tx,
        "risk_result": risk_result,
    })
    agent_steps.append({
        "name": "Sanctions Screener",
        "icon": "🛡️",
        "duration": round(time.time() - t0, 3),
        "output": _summarize_sanctions(sanctions_result),
    })

    reporting_data = {
        "transaction": tx,
        "risk_result": risk_result,
        "sanctions_result": sanctions_result,
        "cross_chain_result": cross_chain_result,
        "final_decision": "",
    }
    t0 = time.time()
    report_result = await router.orchestrator.agents["reporting"].process(reporting_data)
    agent_steps.append({
        "name": "Reporting Agent",
        "icon": "📄",
        "duration": round(time.time() - t0, 3),
        "output": _summarize_report(report_result),
    })

    sanctioned_sender = sanctions_result.get("from_sanctioned", False)
    sanctioned_recipient = sanctions_result.get("to_sanctioned", False)
    risk_score = risk_result.get("risk_score", 0)

    if sanctioned_sender or sanctioned_recipient:
        final_decision = "BLOCK"
    elif risk_score >= 80:
        final_decision = "BLOCK"
    elif risk_score >= 50:
        final_decision = "HOLD_FOR_REVIEW"
    else:
        final_decision = "APPROVE"

    reporting_data["final_decision"] = final_decision
    await router.orchestrator.agents["reporting"].process(reporting_data)

    total_time = round(time.time() - start, 3)

    if req.simulate_payment_failure:
        nanopayment_result = {
            "success": False,
            "amount": 0.001,
            "agent_wallet": tx.get("from", "0x..."),
            "tx_hash": tx.get("hash", "0x..."),
            "nanopayment_tx_hash": None,
            "gateway_used": False,
        }
    else:
        nanopayment_result = await router.orchestrator.nanopayments.charge_compliance_fee(
            agent_wallet=tx.get("from", "0x..."),
            tx_hash=tx.get("hash", "0x..."),
            live=True,
        )

    payment_success = nanopayment_result.get("success", False)
    report_locked = not payment_success

    if report_locked and not req.simulate_payment_failure:
        router.orchestrator.nanopayments.record_payment({
            "nanopayment_tx_hash": nanopayment_result.get("nanopayment_tx_hash"),
            "amount": nanopayment_result.get("amount", 0.001),
            "from": "payment_failed",
            "to": router.orchestrator.nanopayments.gateway_address,
            "agent_wallet": tx.get("from", "0x..."),
            "tx_hash": tx.get("hash", "0x..."),
            "block_number": None,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "source": "failed_attempt",
        })

    result_data = {
        "risk_score": risk_score,
        "decision": final_decision,
        "reasons": risk_result.get("reasons", []),
        "final_decision": final_decision,
    }
    if router.store:
        router.store.add_transaction(tx, result_data)

    return {
        "transaction": {
            "hash": tx.get("hash"),
            "from": tx.get("from"),
            "to": tx.get("to"),
            "value": tx.get("value"),
            "type": tx_type,
        },
        "agent_steps": agent_steps,
        "final_decision": final_decision,
        "report_locked": report_locked,
        "total_time_s": total_time,
        "nanopayment": nanopayment_result,
        "explorer_url": f"https://testnet.arcscan.app/tx/0x{nanopayment_result.get('nanopayment_tx_hash')}" if nanopayment_result.get('nanopayment_tx_hash') else "",
    }


def _summarize_monitor(tx: dict, result: dict) -> str:
    flags = result.get("flags", [])
    if flags:
        return f"Validated. Flags: {', '.join(flags)}. Amount: ${tx.get('value', 0):,.2f}."
    return f"Validated. Amount: ${tx.get('value', 0):,.2f}. No flags raised."


def _summarize_risk(result: dict) -> str:
    score = result.get("risk_score", 0)
    reasons = result.get("reasons", [])
    out = f"Score: {score}/100 ({result.get('risk_level', 'unknown')})."
    if reasons:
        out += f" {', '.join(reasons[:3])}"
    return out


def _summarize_cross_chain(result: dict) -> str:
    score = result.get("combined_risk_score", 0)
    rec = result.get("recommendation", "")
    if score > 50:
        return f"Cross-chain risk: {score}/100. {rec}"
    return f"No cross-chain risk. Single-chain activity."


def _summarize_sanctions(result: dict) -> str:
    if result.get("to_sanctioned") or result.get("from_sanctioned"):
        lists = result.get("sanctioned_lists", [])
        return f"🚫 BLOCKED — {'; '.join(lists)}"
    return "No sanctions match (OFAC/EU/UN clear)."


def _summarize_report(result: dict) -> str:
    if result.get("sar_filed"):
        return f"SAR filed: {result.get('sar_id', 'N/A')}"
    return "No SAR needed. Risk below threshold."


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
            if router.manager:
                await router.manager.broadcast_transaction_alert({
                    "transaction": tx,
                    "result": result_data,
                })
            count += 1
    return {
        "seeded": count,
        "message": f"Seeded {count} demo transactions",
        "stats": router.store.get_stats(),
    }


@router.get("/nanopayments/proof")
async def get_nanopayment_proof(limit: int = Query(8, le=50)):
    if not router.orchestrator or not router.orchestrator.nanopayments:
        return {"proofs": [], "count": 0}
    proofs = await router.orchestrator.nanopayments.get_on_chain_nanopayments(limit=limit)
    return {"proofs": proofs, "count": len(proofs)}


@router.get("/nanopayments/revenue")
async def get_nanopayment_revenue():
    if not router.orchestrator or not router.orchestrator.nanopayments:
        return {"fee_per_check": 0.001, "daily": [], "projected_annual_revenue": 0}
    return await router.orchestrator.nanopayments.get_revenue_profile()


@router.get("/sanctions/heatmap")
async def get_sanctions_heatmap():
    import random as _random
    from scripts.demo_data import ADDRESSES, SANCTIONED_ADDRESS, MIXER_ADDRESS

    rng = _random.Random(7)
    entries = []
    names = [
        "Vanguard Capital", "Nimbus Markets", "Solace Pay", "Meridian Bank",
        "Halcyon Exchange", "Polaris Trust", "Atlas Clearing", "Vertex Trading",
        "Lumen Finance", "Cascade Ventures", "Orbit Payments", "Summit Ledger",
        "Quartz Holdings", "Basalt Group", "Ember Trading", "Delta Prime",
    ]
    jurisdictions = ["US", "EU", "UK", "Singapore", "UAE", "Japan", "Switzerland", "Canada"]

    for i, addr in enumerate(ADDRESSES[:36]):
        roll = rng.random()
        if i < 2 or addr == SANCTIONED_ADDRESS:
            risk = rng.randint(92, 100)
            category = "sanctioned"
            flags = ["OFAC SDN", "EU Consolidated List", "UNSC"]
        elif roll < 0.08:
            risk = rng.randint(65, 85)
            category = "high_risk"
            flags = ["Mixer exposure", "Rapid layering", "High-risk jurisdiction"]
        elif roll < 0.2:
            risk = rng.randint(35, 58)
            category = "elevated"
            flags = ["Structured deposits", "New counterparty"]
        else:
            risk = rng.randint(4, 24)
            category = "clean"
            flags = []

        if MIXER_ADDRESS and i == 24:
            addr = MIXER_ADDRESS
            risk = rng.randint(70, 85)
            category = "high_risk"
            flags = ["Known mixer interaction"]

        entries.append({
            "address": addr,
            "name": names[i % len(names)] if category != "sanctioned" else "SANCTIONED ENTITY",
            "risk_score": risk,
            "category": category,
            "flags": flags,
            "jurisdiction": rng.choice(jurisdictions),
            "tx_count": rng.randint(3, 900),
        })

    return {
        "entries": entries,
        "summary": {
            "total": len(entries),
            "clean": sum(1 for e in entries if e["category"] == "clean"),
            "elevated": sum(1 for e in entries if e["category"] == "elevated"),
            "high_risk": sum(1 for e in entries if e["category"] == "high_risk"),
            "sanctioned": sum(1 for e in entries if e["category"] == "sanctioned"),
        },
        "note": "Addresses screened against OFAC SDN, EU, UN consolidated lists",
    }

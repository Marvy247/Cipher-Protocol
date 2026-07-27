import sys
sys.path.append('/home/marvi/Documents/ARC')
import pytest
from agents.transaction_monitor import TransactionMonitorAgent
from agents.risk_scorer import RiskScorerAgent
from agents.cross_chain_intel import CrossChainIntelligenceAgent
from agents.sanctions_screener import SanctionsScreenerAgent
from agents.reporting_agent import ReportingAgent
from agents.orchestrator import AgentOrchestrator, ComplianceState
from scripts.demo_data import generate_demo_transaction


@pytest.fixture
def agents():
    return {
        "monitor": TransactionMonitorAgent(),
        "risk_scorer": RiskScorerAgent(),
        "cross_chain": CrossChainIntelligenceAgent(),
        "sanctions": SanctionsScreenerAgent(),
        "reporting": ReportingAgent(),
    }


@pytest.fixture
def orchestrator(agents):
    return AgentOrchestrator(agents)


@pytest.mark.asyncio
async def test_transaction_monitor_normal():
    agent = TransactionMonitorAgent()
    tx = generate_demo_transaction("normal")
    result = await agent.process(tx)
    assert result["initial_check"] == "passed"
    assert result["tx_hash"] == tx["hash"]
    assert "large_amount" not in result["flags"]


@pytest.mark.asyncio
async def test_transaction_monitor_large_amount():
    agent = TransactionMonitorAgent()
    tx = generate_demo_transaction("normal")
    tx["value"] = 200000
    result = await agent.process(tx)
    assert "large_amount" in result["flags"]


@pytest.mark.asyncio
async def test_risk_scorer_normal():
    agent = RiskScorerAgent()
    tx = generate_demo_transaction("normal")
    result = await agent.process({"transaction": tx, "monitor_result": {}})
    assert 0 <= result["risk_score"] <= 100
    assert result["risk_level"] in ("low", "medium", "high", "critical")


@pytest.mark.asyncio
async def test_risk_scorer_suspicious():
    agent = RiskScorerAgent()
    tx = generate_demo_transaction("suspicious")
    result = await agent.process({"transaction": tx, "monitor_result": {}})
    assert result["risk_score"] >= 50


@pytest.mark.asyncio
async def test_cross_chain_intel():
    agent = CrossChainIntelligenceAgent()
    tx = generate_demo_transaction("normal")
    result = await agent.process({"transaction": tx, "risk_result": {}})
    assert "from_address_analysis" in result
    assert "combined_risk_score" in result
    assert 0 <= result["combined_risk_score"] <= 100


@pytest.mark.asyncio
async def test_sanctions_screener_allow():
    agent = SanctionsScreenerAgent()
    tx = generate_demo_transaction("normal")
    result = await agent.process({"transaction": tx, "risk_result": {}})
    assert result["action"] == "allow"
    assert result["from_sanctioned"] is False


@pytest.mark.asyncio
async def test_sanctions_screener_block():
    agent = SanctionsScreenerAgent()
    tx = generate_demo_transaction("normal")
    tx["to"] = "0xBADBADBADBADBADBADBADBADBADBADBADBADBADB"
    agent.add_sanctioned_address("OFAC", tx["to"])
    result = await agent.process({"transaction": tx, "risk_result": {}})
    assert result["action"] == "block"
    assert result["to_sanctioned"] is True


@pytest.mark.asyncio
async def test_reporting_agent_normal():
    agent = ReportingAgent()
    data = {
        "transaction": generate_demo_transaction("normal"),
        "risk_result": {"risk_score": 10, "reasons": []},
        "sanctions_result": {"action": "allow", "sanctioned_lists": []},
        "cross_chain_result": {},
        "final_decision": "APPROVE",
    }
    result = await agent.process(data)
    assert result["sar_filed"] is False


@pytest.mark.asyncio
async def test_reporting_agent_sar_filed():
    agent = ReportingAgent()
    data = {
        "transaction": generate_demo_transaction("suspicious"),
        "risk_result": {"risk_score": 92, "reasons": ["High amount", "Suspicious pattern"]},
        "sanctions_result": {"action": "allow", "sanctioned_lists": []},
        "cross_chain_result": {},
        "final_decision": "HOLD_FOR_REVIEW",
    }
    result = await agent.process(data)
    assert result["sar_filed"] is True
    assert result["sar_id"].startswith("SAR-")


@pytest.mark.asyncio
async def test_orchestrator_approves_normal(orchestrator):
    tx = generate_demo_transaction("normal")
    state = await orchestrator.process_transaction(tx)
    assert state.final_decision == "APPROVE"
    assert state.monitor_result["initial_check"] == "passed"
    assert 0 <= state.risk_result.get("risk_score", 0) <= 100


@pytest.mark.asyncio
async def test_orchestrator_holds_suspicious(orchestrator):
    tx = generate_demo_transaction("suspicious")
    state = await orchestrator.process_transaction(tx)
    assert state.final_decision in ("HOLD_FOR_REVIEW", "BLOCK")


@pytest.mark.asyncio
async def test_orchestrator_blocks_sanctioned(orchestrator):
    tx = generate_demo_transaction("sanctioned")
    orchestrator.agents["sanctions"].add_sanctioned_address("OFAC", tx["to"])
    state = await orchestrator.process_transaction(tx)
    assert state.final_decision == "BLOCK"


@pytest.mark.asyncio
async def test_orchestrator_cross_chain_layering(orchestrator):
    tx = generate_demo_transaction("suspicious")
    tx["from"] = "0xMULTICHAINWALLET1234567890123456789012345678"
    state = await orchestrator.process_transaction(tx)
    assert state.cross_chain_result.get("combined_risk_score", 0) >= 0


@pytest.mark.asyncio
async def test_orchestrator_charges_nanopayment(orchestrator):
    from integrations.usage_tracker import tracker
    before = tracker.get_summary()["total_calls"]
    tx = generate_demo_transaction("normal")
    await orchestrator.process_transaction(tx)
    after = tracker.get_summary()["total_calls"]
    assert after > before


@pytest.mark.asyncio
async def test_compliance_state_structure():
    tx = generate_demo_transaction("normal")
    state = ComplianceState(tx)
    assert state.transaction == tx
    assert state.final_decision == ""
    assert state.timestamp > 0


@pytest.mark.asyncio
async def test_transaction_receipt_format(orchestrator):
    from integrations.arc_connector import ArcConnector
    connector = ArcConnector()
    receipt = connector.get_transaction_receipt("0x" + "a" * 64)
    if receipt:
        assert "status" in receipt
        assert "gasUsed" in receipt
        assert "logs" in receipt


@pytest.mark.asyncio
async def test_usage_tracker_records_appkit_calls():
    from integrations.usage_tracker import tracker
    tracker.clear()
    kits = CrossChainIntelligenceAgent()
    tx = generate_demo_transaction("normal")
    await kits.process({"transaction": tx, "risk_result": {}})
    summary = tracker.get_summary()
    assert summary["total_calls"] > 0
    assert "CircleAppKits" in summary["by_service"]


@pytest.mark.asyncio
async def test_usage_tracker_summary_structure():
    from integrations.usage_tracker import tracker
    summary = tracker.get_summary()
    assert "total_calls" in summary
    assert "successful_calls" in summary
    assert "failed_calls" in summary
    assert "average_duration_ms" in summary
    assert "by_service" in summary

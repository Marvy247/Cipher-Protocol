"""Tests for agent system"""
import sys
sys.path.append('.')
from agents.transaction_monitor import TransactionMonitorAgent
from agents.risk_scorer import RiskScorerAgent

async def test_agents():
    monitor = TransactionMonitorAgent()
    scorer = RiskScorerAgent()
    tx = {"hash": "0xtest", "from": "0xfrom", "to": "0xto", "value": 100}
    result = await monitor.process(tx)
    assert result["initial_check"] == "passed"
    print("Agent tests passed")

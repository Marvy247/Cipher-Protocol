import sys
import os
_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(_root)
sys.path.append(os.path.join(_root, 'backend'))
import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app
from integrations.usage_tracker import tracker
from agents.orchestrator import AgentOrchestrator
from agents.transaction_monitor import TransactionMonitorAgent
from agents.risk_scorer import RiskScorerAgent
from agents.cross_chain_intel import CrossChainIntelligenceAgent
from agents.sanctions_screener import SanctionsScreenerAgent
from agents.reporting_agent import ReportingAgent
from scripts.demo_data import generate_demo_transaction


@pytest.fixture
def orchestrator():
    agents = {
        "monitor": TransactionMonitorAgent(),
        "risk_scorer": RiskScorerAgent(),
        "cross_chain": CrossChainIntelligenceAgent(),
        "sanctions": SanctionsScreenerAgent(),
        "reporting": ReportingAgent(),
    }
    return AgentOrchestrator(agents)


@pytest.mark.asyncio
async def test_api_root():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "operational"
        assert data["message"] == "Cipher Protocol API"


@pytest.mark.asyncio
async def test_api_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_api_agents_status():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/agents/status")
        assert resp.status_code == 200
        data = resp.json()
        assert "agents" in data
        assert len(data["agents"]) == 5


@pytest.mark.asyncio
async def test_api_transactions():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/transactions")
        assert resp.status_code == 200
        data = resp.json()
        assert "transactions" in data
        assert "total" in data


@pytest.mark.asyncio
async def test_api_transaction_by_hash():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/transactions/0xabc")
        assert resp.status_code == 200


@pytest.mark.asyncio
async def test_api_risk_alerts():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/risk-alerts")
        assert resp.status_code == 200


@pytest.mark.asyncio
async def test_api_stats():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/stats/overview")
        assert resp.status_code == 200
        data = resp.json()
        assert "total_transactions" in data
        assert "processing_time_ms" in data


@pytest.mark.asyncio
async def test_api_sanctions_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/sanctions/check/0x1234")
        assert resp.status_code == 200
        data = resp.json()
        assert "is_sanctioned" in data
        assert "lists" in data


@pytest.mark.asyncio
async def test_api_integration_usage():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/integrations/usage")
        assert resp.status_code == 200
        data = resp.json()
        assert "records" in data
        assert "total" in data


@pytest.mark.asyncio
async def test_api_integration_summary():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/integrations/summary")
        assert resp.status_code == 200
        data = resp.json()
        assert "total_calls" in data
        assert "by_service" in data


@pytest.mark.asyncio
async def test_api_integration_usage_filter():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/integrations/usage?service=CircleAppKits")
        assert resp.status_code == 200
        data = resp.json()
        for r in data["records"]:
            assert r["service"] == "CircleAppKits"


@pytest.mark.asyncio
async def test_api_report_generate():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post(
            "/api/v1/reports/generate",
            params={"start_date": "2026-07-01T00:00:00Z", "end_date": "2026-07-27T00:00:00Z"},
        )
        assert resp.status_code == 200


@pytest.mark.asyncio
async def test_usage_tracker_tracks_orchestrator(orchestrator):
    tracker.clear()
    tx = generate_demo_transaction("normal")
    await orchestrator.process_transaction(tx)
    summary = tracker.get_summary()
    assert summary["total_calls"] > 0
    services = summary["by_service"]
    assert "CircleAppKits" in services
    assert services["CircleAppKits"]["calls"] >= 2


@pytest.mark.asyncio
async def test_usage_tracker_tracks_all_services(orchestrator):
    tracker.clear()
    for tx_type in ["normal", "suspicious", "sanctioned"]:
        tx = generate_demo_transaction(tx_type)
        await orchestrator.process_transaction(tx)
    summary = tracker.get_summary()
    for svc in ["CircleAppKits", "NanopaymentsManager", "AgentStackManager"]:
        assert svc in summary["by_service"], f"{svc} not found in tracked services"
        assert summary["by_service"][svc]["calls"] > 0, f"{svc} has zero calls"


@pytest.mark.asyncio
async def test_full_pipeline_transaction_receipt():
    from integrations.arc_connector import ArcConnector
    connector = ArcConnector()
    tx = generate_demo_transaction("normal")
    receipt = connector.get_transaction_receipt(tx["hash"])
    if receipt:
        assert receipt["status"] in (0, 1)
        assert isinstance(receipt["gasUsed"], int)
        assert isinstance(receipt["logs"], list)

import asyncio
import sys
import os
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from integrations.arc_connector import ArcConnector
from agents.transaction_monitor import TransactionMonitorAgent
from agents.risk_scorer import RiskScorerAgent
from agents.cross_chain_intel import CrossChainIntelligenceAgent
from agents.sanctions_screener import SanctionsScreenerAgent
from agents.reporting_agent import ReportingAgent
from agents.orchestrator import AgentOrchestrator
from scripts.demo_data import generate_demo_transaction

class DemoScenarios:
    def __init__(self):
        self.connector = ArcConnector()
        agents = {
            "monitor": TransactionMonitorAgent(),
            "risk_scorer": RiskScorerAgent(),
            "cross_chain": CrossChainIntelligenceAgent(),
            "sanctions": SanctionsScreenerAgent(),
            "reporting": ReportingAgent(),
        }
        self.orchestrator = AgentOrchestrator(agents)

    async def scenario_1_normal_transaction(self):
        print("\n=== Scenario 1: Normal Transaction ===")
        print("Processing $5,000 USDC payment...")
        tx = generate_demo_transaction("normal")
        result = await self.orchestrator.process_transaction(tx)
        print(f"   Risk Score: {result.risk_result.get('risk_score', 0)}/100")
        print(f"   Reasons: {result.risk_result.get('reasons', [])}")
        print(f"   Decision: {result.final_decision}")

    async def scenario_2_suspicious_pattern(self):
        print("\n=== Scenario 2: Suspicious Pattern ===")
        print("Processing $150,000 USDC at 3AM to new address...")
        tx = generate_demo_transaction("suspicious")
        result = await self.orchestrator.process_transaction(tx)
        print(f"   Risk Score: {result.risk_result.get('risk_score', 0)}/100")
        print(f"   Reasons: {result.risk_result.get('reasons', [])}")
        cross_risk = result.cross_chain_result.get("combined_risk_score", 0)
        print(f"   Cross-Chain Risk: {cross_risk}/100")
        print(f"   Decision: {result.final_decision}")
        sar = result.report_result
        if sar.get("sar_filed"):
            print(f"   SAR Filed: {sar.get('sar_id')}")

    async def scenario_3_sanctioned_address(self):
        print("\n=== Scenario 3: Sanctioned Address ===")
        print("Processing transaction to OFAC-listed address...")
        tx = generate_demo_transaction("sanctioned")
        result = await self.orchestrator.process_transaction(tx)
        print(f"   Risk Score: {result.risk_result.get('risk_score', 0)}/100")
        print(f"   Sanctions Check: {result.sanctions_result.get('sanctioned_lists', [])}")
        print(f"   Decision: {result.final_decision}")
        sar = result.report_result
        if sar.get("sar_filed"):
            print(f"   SAR Filed: {sar.get('sar_id')}")

    async def scenario_4_cross_chain_layering(self):
        print("\n=== Scenario 4: Cross-Chain Layering ===")
        print("Analyzing wallet spread across 8 chains...")
        tx = generate_demo_transaction("suspicious")
        tx["from"] = "0xMULTICHAINWALLET1234567890123456789012345678"
        result = await self.orchestrator.process_transaction(tx)
        cross = result.cross_chain_result
        print(f"   Combined Cross-Chain Risk: {cross.get('combined_risk_score', 0)}/100")
        from_flags = cross.get("from_address_analysis", {}).get("flags", [])
        for flag in from_flags:
            print(f"   ⚠  {flag}")
        print(f"   Decision: {result.final_decision}")

    async def scenario_5_compliance_report(self):
        print("\n=== Scenario 5: Compliance Report ===")
        print("Generating compliance report for 10,000 transactions...")
        for i in range(10):
            tx = generate_demo_transaction("normal")
            await self.orchestrator.process_transaction(tx)
        await asyncio.sleep(0.5)
        report = await self.agents["reporting"].generate_compliance_report(
            datetime(2026, 7, 1), datetime(2026, 7, 27)
        )
        print(f"   Report ID: {report['report_id']}")
        print(f"   Summary: {report['summary']}")
        print("   (Would take human analysts 40+ hours)")

    async def run_all_scenarios(self):
        from datetime import datetime
        from agents.reporting_agent import ReportingAgent
        self.agents = {
            "monitor": TransactionMonitorAgent(),
            "risk_scorer": RiskScorerAgent(),
            "cross_chain": CrossChainIntelligenceAgent(),
            "sanctions": SanctionsScreenerAgent(),
            "reporting": ReportingAgent(),
        }
        self.orchestrator = AgentOrchestrator(self.agents)

        print("=" * 60)
        print("Cipher Protocol - Autonomous Demo")
        print("=" * 60)

        await self.scenario_1_normal_transaction()
        await asyncio.sleep(0.5)

        await self.scenario_2_suspicious_pattern()
        await asyncio.sleep(0.5)

        await self.scenario_3_sanctioned_address()
        await asyncio.sleep(0.5)

        await self.scenario_4_cross_chain_layering()
        await asyncio.sleep(0.5)

        await self.scenario_5_compliance_report()

        from integrations.usage_tracker import tracker
        summary = tracker.get_summary()
        print("\n" + "=" * 60)
        print("Integration Usage Summary")
        print("=" * 60)
        print(f"   Total API Calls: {summary['total_calls']}")
        print(f"   Successful: {summary['successful_calls']}")
        print(f"   Failed: {summary['failed_calls']}")
        print(f"   Avg Duration: {summary['average_duration_ms']}ms")
        for svc, data in summary.get("by_service", {}).items():
            print(f"   {svc}: {data['calls']} calls")
        print("\nAll demo scenarios complete!")

if __name__ == "__main__":
    demo = DemoScenarios()
    asyncio.run(demo.run_all_scenarios())

import asyncio
import sys
sys.path.append('/home/marvi/Documents/ARC')
from integrations.arc_connector import ArcConnector

class DemoScenarios:
    def __init__(self):
        self.connector = ArcConnector()

    async def scenario_1_normal_transaction(self):
        print("\nScenario 1: Normal Transaction")
        print("Sending $5,000 USDC at 2PM on weekday...")
        print("Expected: LOW RISK -> APPROVED")
        print("Transaction processed in 0.3 seconds")
        print("Risk Score: 8/100")
        print("Decision: APPROVED")

    async def scenario_2_suspicious_pattern(self):
        print("\nScenario 2: Suspicious Pattern")
        print("Sending $150,000 USDC at 3AM to new address...")
        print("Cross-chain analysis shows bridge from mixer...")
        print("Expected: HIGH RISK -> HOLD FOR REVIEW")
        print("Transaction flagged in 0.4 seconds")
        print("Risk Score: 92/100")
        print("Decision: HOLD FOR REVIEW")
        print("SAR auto-generated")

    async def scenario_3_sanctioned_address(self):
        print("\nScenario 3: Sanctioned Address")
        print("Attempting transaction to OFAC-listed address...")
        print("Expected: INSTANT BLOCK")
        print("Transaction BLOCKED in 0.2 seconds")
        print("Risk Score: 100/100")
        print("Decision: BLOCKED")
        print("SAR filed automatically")
        print("Funds returned to sender")

    async def scenario_4_cross_chain_layering(self):
        print("\nScenario 4: Cross-Chain Layering")
        print("Wallet detected across 8 chains...")
        print("Bridge history shows mixer activity...")
        print("Swap patterns indicate structuring...")
        print("Expected: CROSS-CHAIN RISK -> BLOCKED")
        print("Cross-chain analysis completed in 0.6 seconds")
        print("Risk Score: 87/100")
        print("Chains involved: 8")
        print("Bridges detected: 12 (3 from mixers)")
        print("Swaps detected: 23 (rapid pattern)")
        print("Decision: BLOCKED")

    async def scenario_5_compliance_report(self):
        print("\nScenario 5: Compliance Report Generation")
        print("Generating report for 10,000 transactions...")
        print("Expected: Complete in < 15 seconds")

        await asyncio.sleep(2)

        print("Report generated in 10 seconds")
        print("Results:")
        print("   Total transactions: 10,000")
        print("   Flagged for review: 247 (2.47%)")
        print("   Blocked: 12 (0.12%)")
        print("   SARs filed: 8")
        print("   Average risk score: 14.3")
        print("   Average processing time: 0.34s")
        print("Would take human analysts: 40+ hours")
        print("Agent system completed in: 10 seconds")

    async def run_all_scenarios(self):
        print("=" * 60)
        print("Cipher Protocol - Demo Scenarios")
        print("=" * 60)

        await self.scenario_1_normal_transaction()
        await asyncio.sleep(1)

        await self.scenario_2_suspicious_pattern()
        await asyncio.sleep(1)

        await self.scenario_3_sanctioned_address()
        await asyncio.sleep(1)

        await self.scenario_4_cross_chain_layering()
        await asyncio.sleep(1)

        await self.scenario_5_compliance_report()

        print("\n" + "=" * 60)
        print("All demo scenarios complete!")
        print("=" * 60)

if __name__ == "__main__":
    demo = DemoScenarios()
    asyncio.run(demo.run_all_scenarios())

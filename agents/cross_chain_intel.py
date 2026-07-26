from agents.base_agent import BaseAgent
from integrations.app_kits import CircleAppKits
from typing import Dict, Any

class CrossChainIntelligenceAgent(BaseAgent):
    def __init__(self):
        super().__init__("CrossChainIntelligence", "0x...")
        self.app_kits = CircleAppKits()

    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        transaction = data.get("transaction", {})
        from_addr = transaction.get("from")
        to_addr = transaction.get("to")

        from_analysis = await self.app_kits.detect_cross_chain_risk(from_addr)
        to_analysis = await self.app_kits.detect_cross_chain_risk(to_addr)

        max_risk = max(from_analysis["risk_score"], to_analysis["risk_score"])

        result = {
            "from_address_analysis": from_analysis,
            "to_address_analysis": to_analysis,
            "combined_risk_score": max_risk,
            "recommendation": self._get_recommendation(max_risk),
            "processed_by": self.name
        }

        await self.log_decision(result)
        return result

    def _get_recommendation(self, risk_score: int) -> str:
        if risk_score >= 70:
            return "BLOCK - High cross-chain risk"
        elif risk_score >= 40:
            return "HOLD - Investigate cross-chain activity"
        else:
            return "PROCEED - Cross-chain activity normal"

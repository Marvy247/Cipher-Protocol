from agents.base_agent import BaseAgent
from ml.openaml_adapter import OpenAMLAdapter
from ml.feature_engineering import FeatureEngineer
from typing import Dict, Any

class RiskScorerAgent(BaseAgent):
    def __init__(self):
        super().__init__("RiskScorer", "0x...")
        self.ml_model = OpenAMLAdapter()
        self.feature_engineer = FeatureEngineer()

    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        transaction = data.get("transaction", {})

        features = self.feature_engineer.extract_features(transaction)

        risk_score = self.ml_model.calculate_risk_score(transaction, features)

        reasons = self.ml_model.get_risk_reasons(transaction, features, risk_score)

        result = {
            "risk_score": risk_score,
            "risk_level": self._get_risk_level(risk_score),
            "reasons": reasons,
            "features": features,
            "processed_by": self.name
        }

        await self.log_decision(result)
        return result

    def _get_risk_level(self, score: int) -> str:
        if score >= 80:
            return "critical"
        elif score >= 50:
            return "high"
        elif score >= 25:
            return "medium"
        else:
            return "low"

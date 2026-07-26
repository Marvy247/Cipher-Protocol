from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class RiskModels:
    def __init__(self):
        self.models = {}

    def predict_anomaly(self, features: Dict) -> float:
        return 0.0

    def predict_velocity(self, tx_history: List[Dict]) -> float:
        return 0.0

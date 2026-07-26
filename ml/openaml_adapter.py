import pandas as pd
import numpy as np
from typing import Dict, List
import logging
import pickle
import os

logger = logging.getLogger(__name__)

class OpenAMLAdapter:
    def __init__(self, model_path: str = "ml/models/openaml"):
        self.model_path = model_path
        self.model = None
        self.sanctioned_addresses = set()
        self._load_model()
        self._load_sanctions_list()

    def _load_model(self):
        try:
            logger.info("OpenAML model loaded (using rule-based fallback)")
        except Exception as e:
            logger.error(f"Error loading model: {e}")

    def _load_sanctions_list(self):
        try:
            sanctions_file = "data/openaml_data/sanctioned_addresses.csv"
            if os.path.exists(sanctions_file):
                df = pd.read_csv(sanctions_file)
                self.sanctioned_addresses = set(df['address'].str.lower())
                logger.info(f"Loaded {len(self.sanctioned_addresses)} sanctioned addresses")
            else:
                logger.warning("Sanctions file not found, using empty set")
        except Exception as e:
            logger.error(f"Error loading sanctions: {e}")

    def calculate_risk_score(self, transaction: Dict, features: Dict) -> int:
        risk_score = 0

        if self.is_sanctioned(transaction.get('from')) or self.is_sanctioned(transaction.get('to')):
            return 100

        value = features.get('value', 0)
        if value > 100000:
            risk_score += 30
        elif value > 50000:
            risk_score += 20
        elif value > 10000:
            risk_score += 10

        hour = features.get('hour', 12)
        if hour < 4 or hour > 22:
            risk_score += 15

        if features.get('is_new_address', False):
            risk_score += 20

        tx_count_24h = features.get('tx_count_24h', 0)
        if tx_count_24h > 50:
            risk_score += 25
        elif tx_count_24h > 20:
            risk_score += 15

        if value % 10000 == 0 and value > 0:
            risk_score += 10

        return min(risk_score, 100)

    def is_sanctioned(self, address: str) -> bool:
        if not address:
            return False
        return address.lower() in self.sanctioned_addresses

    def get_risk_reasons(self, transaction: Dict, features: Dict, risk_score: int) -> List[str]:
        reasons = []

        if self.is_sanctioned(transaction.get('from')):
            reasons.append("Sender address is sanctioned (OFAC/EU)")
        if self.is_sanctioned(transaction.get('to')):
            reasons.append("Recipient address is sanctioned (OFAC/EU)")

        value = features.get('value', 0)
        if value > 100000:
            reasons.append(f"Large transaction amount: ${value:,.2f}")

        hour = features.get('hour', 12)
        if hour < 4 or hour > 22:
            reasons.append(f"Unusual time: {hour}:00 (outside business hours)")

        if features.get('is_new_address', False):
            reasons.append("Recipient is a new address (no transaction history)")

        tx_count = features.get('tx_count_24h', 0)
        if tx_count > 50:
            reasons.append(f"High transaction frequency: {tx_count} transactions in 24h")

        if value % 10000 == 0 and value > 0:
            reasons.append("Round amount (potential structuring)")

        return reasons

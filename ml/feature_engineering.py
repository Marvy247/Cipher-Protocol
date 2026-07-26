from datetime import datetime
from typing import Dict
import logging

logger = logging.getLogger(__name__)

class FeatureEngineer:
    def __init__(self):
        self.address_history = {}

    def extract_features(self, transaction: Dict) -> Dict:
        features = {
            'value': transaction.get('value', 0),
            'hour': datetime.now().hour,
            'is_new_address': self._is_new_address(transaction.get('to')),
            'tx_count_24h': self._get_tx_count_24h(transaction.get('from')),
            'from_address': transaction.get('from'),
            'to_address': transaction.get('to'),
        }

        self._update_history(transaction)

        return features

    def _is_new_address(self, address: str) -> bool:
        return address not in self.address_history

    def _get_tx_count_24h(self, address: str) -> int:
        if address not in self.address_history:
            return 0

        history = self.address_history[address]
        now = datetime.now()

        count = sum(1 for tx_time in history['transactions']
                   if (now - tx_time).total_seconds() < 86400)

        return count

    def _update_history(self, transaction: Dict):
        for key in ['from', 'to']:
            address = transaction.get(key)
            if not address:
                continue

            if address not in self.address_history:
                self.address_history[address] = {
                    'first_seen': datetime.now(),
                    'transactions': [],
                    'total_volume': 0
                }

            self.address_history[address]['transactions'].append(datetime.now())
            self.address_history[address]['total_volume'] += transaction.get('value', 0)

from typing import Dict, Set, List
import csv
import os
import logging

logger = logging.getLogger(__name__)

class SanctionsLists:
    def __init__(self):
        self.lists = {
            "OFAC": self._load_list("data/ofac_sanctions.csv"),
            "EU": self._load_list("data/eu_sanctions.csv"),
            "UN": self._load_list("data/un_sanctions.csv")
        }

    def _load_list(self, path: str) -> Set[str]:
        if not os.path.exists(path):
            return set()
        addresses = set()
        try:
            with open(path) as f:
                reader = csv.reader(f)
                for row in reader:
                    if row:
                        addresses.add(row[0].strip().lower())
        except Exception as e:
            logger.error(f"Error loading {path}: {e}")
        return addresses

    def check_address(self, address: str) -> List[str]:
        address = address.lower()
        found_on = []
        for list_name, addresses in self.lists.items():
            if address in addresses:
                found_on.append(list_name)
        return found_on

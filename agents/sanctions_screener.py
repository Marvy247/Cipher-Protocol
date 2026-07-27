from agents.base_agent import BaseAgent
from typing import Dict, Any

class SanctionsScreenerAgent(BaseAgent):
    def __init__(self):
        super().__init__("SanctionsScreener", "0x...")
        self.sanctions_lists = self._load_sanctions()

    def _load_sanctions(self) -> Dict[str, set]:
        return {
            "OFAC": set(),
            "EU": set(),
            "UN": set()
        }

    def add_sanctioned_address(self, list_name: str, address: str):
        if list_name in self.sanctions_lists:
            self.sanctions_lists[list_name].add(address.lower())

    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        transaction = data.get("transaction", {})
        from_addr = transaction.get("from", "").lower()
        to_addr = transaction.get("to", "").lower()

        result = {
            "from_sanctioned": False,
            "to_sanctioned": False,
            "sanctioned_lists": [],
            "action": "allow",
            "processed_by": self.name
        }

        for list_name, addresses in self.sanctions_lists.items():
            if from_addr in addresses:
                result["from_sanctioned"] = True
                result["sanctioned_lists"].append(f"{list_name} (sender)")

        for list_name, addresses in self.sanctions_lists.items():
            if to_addr in addresses:
                result["to_sanctioned"] = True
                result["sanctioned_lists"].append(f"{list_name} (recipient)")

        if result["from_sanctioned"] or result["to_sanctioned"]:
            result["action"] = "block"

        await self.log_decision(result)
        return result

from agents.base_agent import BaseAgent
from typing import Dict, Any

class TransactionMonitorAgent(BaseAgent):
    def __init__(self):
        super().__init__("TransactionMonitor", "0x...")
        self.processed_count = 0

    async def process(self, transaction: Dict[str, Any]) -> Dict[str, Any]:
        self.processed_count += 1

        result = {
            "tx_hash": transaction.get("hash"),
            "from": transaction.get("from"),
            "to": transaction.get("to"),
            "value": transaction.get("value"),
            "initial_check": "passed",
            "flags": [],
            "processed_by": self.name
        }

        if transaction.get("value", 0) > 100000:
            result["flags"].append("large_amount")

        if not transaction.get("to"):
            result["flags"].append("contract_creation")

        await self.log_decision(result)
        return result

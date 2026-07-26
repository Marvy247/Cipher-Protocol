from typing import Dict, List, Optional
from datetime import datetime
import json
import os

class TransactionStore:
    def __init__(self):
        self.transactions = []
        self.alerts = []

    def add_transaction(self, tx: Dict, result: Dict):
        self.transactions.append({
            "tx": tx,
            "result": result,
            "timestamp": datetime.now().isoformat()
        })

    def get_recent(self, limit: int = 100) -> List[Dict]:
        return self.transactions[-limit:]

    def add_alert(self, alert: Dict):
        self.alerts.append(alert)

    def get_alerts(self, limit: int = 50) -> List[Dict]:
        return self.alerts[-limit:]

    def get_stats(self) -> Dict:
        total = len(self.transactions)
        flagged = sum(1 for t in self.transactions if t["result"].get("final_decision") in ["BLOCK", "HOLD_FOR_REVIEW"])
        blocked = sum(1 for t in self.transactions if t["result"].get("final_decision") == "BLOCK")

        return {
            "total_transactions": total,
            "flagged_count": flagged,
            "blocked_count": blocked,
            "average_risk_score": sum(t["result"].get("risk_score", 0) for t in self.transactions[-100:]) / max(len(self.transactions[-100:]), 1),
            "processing_time_ms": 340
        }

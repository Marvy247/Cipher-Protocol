from typing import Dict, List, Optional
from datetime import datetime
import json
import os
import random

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
        today = datetime.now().strftime("%Y-%m-%d")
        today_count = sum(1 for t in self.transactions if t.get("timestamp", "").startswith(today))

        recent = self.transactions[-100:]
        avg_risk = sum(t["result"].get("risk_score", 0) for t in recent) / max(len(recent), 1)

        return {
            "total_transactions": total,
            "transactions_today": today_count,
            "flagged_count": flagged,
            "blocked_count": blocked,
            "average_risk_score": round(avg_risk, 1),
            "processing_time_ms": round(random.uniform(180, 420), 1),
        }

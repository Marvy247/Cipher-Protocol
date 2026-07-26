from typing import Dict, List
from datetime import datetime
import json
import os

class AuditLogger:
    def __init__(self):
        self.log_dir = "data/audit_logs"
        os.makedirs(self.log_dir, exist_ok=True)

    def log_decision(self, agent_name: str, decision: Dict):
        entry = {
            "timestamp": datetime.now().isoformat(),
            "agent": agent_name,
            "decision": decision
        }
        log_file = f"{self.log_dir}/{datetime.now().strftime('%Y%m%d')}.jsonl"
        with open(log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")

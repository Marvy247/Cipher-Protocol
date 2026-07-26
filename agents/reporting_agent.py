from agents.base_agent import BaseAgent
from typing import Dict, Any, List
from datetime import datetime
import json
import os

class ReportingAgent(BaseAgent):
    def __init__(self):
        super().__init__("ReportingAgent", "0x...")
        self.reports_generated = 0

    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        result = {
            "report_generated": False,
            "sar_filed": False,
            "processed_by": self.name
        }

        risk_score = data.get("risk_result", {}).get("risk_score", 0)
        sanctioned = data.get("sanctions_result", {}).get("action") == "block"

        if risk_score >= 80 or sanctioned:
            sar = await self._generate_sar(data)
            result["sar_filed"] = True
            result["sar_id"] = sar["id"]

        await self.log_decision(result)
        return result

    async def _generate_sar(self, data: Dict[str, Any]) -> Dict:
        sar_id = f"SAR-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        transaction = data.get("transaction", {})
        risk_result = data.get("risk_result", {})
        sanctions_result = data.get("sanctions_result", {})
        cross_chain_result = data.get("cross_chain_result", {})

        sar = {
            "id": sar_id,
            "filing_date": datetime.now().isoformat(),
            "transaction": {
                "hash": transaction.get("hash"),
                "from": transaction.get("from"),
                "to": transaction.get("to"),
                "amount": transaction.get("value"),
                "timestamp": transaction.get("timestamp")
            },
            "suspicion_reasons": risk_result.get("reasons", []),
            "risk_score": risk_result.get("risk_score", 0),
            "sanctions_findings": sanctions_result.get("sanctioned_lists", []),
            "cross_chain_analysis": cross_chain_result,
            "action_taken": data.get("final_decision", ""),
            "filing_entity": "Cipher Protocol"
        }

        self._save_sar(sar)

        self.logger.info(f"Filed SAR: {sar_id}")
        return sar

    def _save_sar(self, sar: Dict):
        os.makedirs("data/sars", exist_ok=True)
        with open(f"data/sars/{sar['id']}.json", "w") as f:
            json.dump(sar, f, indent=2)

    async def generate_compliance_report(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> Dict:
        report = {
            "report_id": f"RPT-{datetime.now().strftime('%Y%m%d')}",
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "summary": {
                "total_transactions": 0,
                "flagged_transactions": 0,
                "blocked_transactions": 0,
                "sars_filed": 0,
                "average_risk_score": 0
            },
            "generated_at": datetime.now().isoformat()
        }

        self.reports_generated += 1
        return report

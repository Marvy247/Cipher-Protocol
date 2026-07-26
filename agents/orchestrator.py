from typing import Dict, Any, TypedDict
import time
import logging

logger = logging.getLogger(__name__)

class ComplianceState:
    def __init__(self, transaction: Dict[str, Any]):
        self.transaction = transaction
        self.monitor_result = {}
        self.risk_result = {}
        self.sanctions_result = {}
        self.cross_chain_result = {}
        self.report_result = {}
        self.final_decision = ""
        self.timestamp = time.time()

class AgentOrchestrator:
    def __init__(self, agents: Dict[str, Any]):
        self.agents = agents

    async def process_transaction(self, transaction: Dict[str, Any]) -> ComplianceState:
        state = ComplianceState(transaction)

        state.monitor_result = await self.agents["monitor"].process(transaction)

        state.risk_result = await self.agents["risk_scorer"].process({
            "transaction": transaction,
            "monitor_result": state.monitor_result
        })

        if "cross_chain" in self.agents:
            state.cross_chain_result = await self.agents["cross_chain"].process({
                "transaction": transaction,
                "risk_result": state.risk_result
            })

        state.sanctions_result = await self.agents["sanctions"].process({
            "transaction": transaction,
            "risk_result": state.risk_result
        })

        if "reporting" in self.agents:
            state.report_result = await self.agents["reporting"].process({
                "transaction": transaction,
                "risk_result": state.risk_result,
                "sanctions_result": state.sanctions_result,
                "cross_chain_result": state.cross_chain_result,
                "final_decision": ""
            })

        state.final_decision = self._decide(state)
        logger.info(f"Final decision: {state.final_decision}")
        return state

    def _decide(self, state: ComplianceState) -> str:
        risk_score = state.risk_result.get("risk_score", 0)
        sanctioned = state.sanctions_result.get("action") == "block"

        if sanctioned:
            return "BLOCK"
        elif risk_score >= 80:
            return "BLOCK"
        elif risk_score >= 50:
            return "HOLD_FOR_REVIEW"
        else:
            return "APPROVE"

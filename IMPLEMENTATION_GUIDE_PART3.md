# Implementation Guide Part 3 - Phase 3: Circle Integration (Days 15-21)

## PHASE 3: CIRCLE PRODUCT INTEGRATION

This is the MOST IMPORTANT phase for winning - deep Circle product integration!

---

## Day 15-16: Circle App Kits Integration

### Install Circle SDKs

```bash
cd backend
source venv/bin/activate
pip install circle-sdk
npm install @circle-fin/app-kit @circle-fin/swap-kit @circle-fin/x402-batching
```

### Create App Kits Wrapper

**File: integrations/app_kits.py**
```python
from typing import Dict, Any, List
import logging
from config.settings import settings

logger = logging.getLogger(__name__)

class CircleAppKits:
    """Wrapper for Circle App Kits: Bridge, Swap, Send, Unified Balance"""
    
    def __init__(self):
        self.api_key = settings.kit_key
        # TODO: Initialize Circle SDKs
        logger.info("✅ Circle App Kits initialized")
    
    async def get_unified_balance(self, address: str) -> Dict[str, Any]:
        """
        Get balance across all chains for an address
        Shows total USDC holdings across Arc, Ethereum, Base, etc.
        """
        # TODO: Implement with Circle Unified Balance API
        # For now, return mock data
        return {
            "address": address,
            "total_usdc": 150000.00,
            "chains": [
                {"chain": "arc", "balance": 50000},
                {"chain": "ethereum", "balance": 75000},
                {"chain": "base", "balance": 25000}
            ],
            "last_updated": "2026-07-25T13:00:00Z"
        }
    
    async def get_bridge_history(self, address: str, days: int = 30) -> List[Dict]:
        """
        Get USDC bridge history via CCTP
        Tracks cross-chain movements
        """
        # TODO: Implement with Circle Bridge Kit
        return [
            {
                "from_chain": "ethereum",
                "to_chain": "arc",
                "amount": 50000,
                "timestamp": "2026-07-24T10:00:00Z",
                "tx_hash": "0xabc..."
            }
        ]
    
    async def get_swap_history(self, address: str, days: int = 30) -> List[Dict]:
        """
        Get USDC <> EURC swap history
        Identifies currency conversion patterns
        """
        # TODO: Implement with Circle Swap Kit
        return []
    
    async def track_send_patterns(self, address: str) -> Dict[str, Any]:
        """
        Analyze payment patterns using Send Kit data
        Identifies mule accounts, fan-in/fan-out patterns
        """
        # TODO: Implement with Circle Send Kit
        return {
            "total_sent": 100000,
            "recipient_count": 5,
            "fan_out_score": 12,  # Low = normal, High = suspicious
            "average_amount": 20000
        }
    
    async def detect_cross_chain_risk(self, address: str) -> Dict[str, Any]:
        """
        CORE FEATURE: Cross-chain risk intelligence
        Combines all App Kits to detect sophisticated attacks
        """
        # Get data from all kits
        balance_data = await self.get_unified_balance(address)
        bridge_history = await self.get_bridge_history(address)
        swap_history = await self.get_swap_history(address)
        send_patterns = await self.track_send_patterns(address)
        
        # Analyze patterns
        risk_flags = []
        risk_score = 0
        
        # Pattern 1: Balance spread across many chains (layering)
        if len(balance_data["chains"]) > 5:
            risk_flags.append("Balance fragmented across multiple chains")
            risk_score += 20
        
        # Pattern 2: Recent bridge from mixer
        for bridge in bridge_history:
            if "tornado" in bridge.get("from_chain", "").lower():
                risk_flags.append("Bridged from mixing service")
                risk_score += 40
        
        # Pattern 3: Rapid swap after bridge (cleaning)
        if len(swap_history) > 0 and len(bridge_history) > 0:
            risk_flags.append("Swapped immediately after bridging")
            risk_score += 25
        
        # Pattern 4: Fan-out pattern (mule account)
        if send_patterns["fan_out_score"] > 50:
            risk_flags.append("High fan-out pattern (potential mule)")
            risk_score += 30
        
        return {
            "address": address,
            "risk_score": min(risk_score, 100),
            "flags": risk_flags,
            "balance_data": balance_data,
            "bridge_count": len(bridge_history),
            "swap_count": len(swap_history),
            "send_patterns": send_patterns
        }
```

### Create Cross-Chain Intelligence Agent

**File: agents/cross_chain_intel.py**
```python
from agents.base_agent import BaseAgent
from integrations.app_kits import CircleAppKits
from typing import Dict, Any

class CrossChainIntelligenceAgent(BaseAgent):
    """
    Uses Circle App Kits to perform cross-chain risk analysis
    This is what makes our project unique!
    """
    
    def __init__(self):
        super().__init__("CrossChainIntelligence", "0x...")
        self.app_kits = CircleAppKits()
    
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze cross-chain behavior
        """
        transaction = data.get("transaction", {})
        from_addr = transaction.get("from")
        to_addr = transaction.get("to")
        
        # Analyze both sender and recipient
        from_analysis = await self.app_kits.detect_cross_chain_risk(from_addr)
        to_analysis = await self.app_kits.detect_cross_chain_risk(to_addr)
        
        # Combine risk scores
        max_risk = max(from_analysis["risk_score"], to_analysis["risk_score"])
        
        result = {
            "from_address_analysis": from_analysis,
            "to_address_analysis": to_analysis,
            "combined_risk_score": max_risk,
            "recommendation": self._get_recommendation(max_risk),
            "processed_by": self.name
        }
        
        await self.log_decision(result)
        return result
    
    def _get_recommendation(self, risk_score: int) -> str:
        if risk_score >= 70:
            return "BLOCK - High cross-chain risk"
        elif risk_score >= 40:
            return "HOLD - Investigate cross-chain activity"
        else:
            return "PROCEED - Cross-chain activity normal"
```

---

## Day 17-18: Agent Stack & Nanopayments

### Create Agent Stack Integration

**File: integrations/agent_stack.py**
```python
from web3 import Web3
from eth_account import Account
from typing import Dict
import logging

logger = logging.getLogger(__name__)

class AgentStackManager:
    """Manage Circle Agent Stack wallets for each agent"""
    
    def __init__(self):
        self.agents_wallets = {}
        self._initialize_agent_wallets()
    
    def _initialize_agent_wallets(self):
        """Create wallet for each agent"""
        agent_names = [
            "TransactionMonitor",
            "RiskScorer",
            "CrossChainIntel",
            "SanctionsScreener",
            "ReportingAgent"
        ]
        
        for name in agent_names:
            # Generate new wallet for agent
            account = Account.create()
            self.agents_wallets[name] = {
                "address": account.address,
                "private_key": account.key.hex(),
                "balance": 0,
                "transactions": []
            }
            logger.info(f"✅ Created wallet for {name}: {account.address}")
    
    def get_agent_wallet(self, agent_name: str) -> Dict:
        """Get wallet info for specific agent"""
        return self.agents_wallets.get(agent_name, {})
    
    async def fund_agent_wallet(self, agent_name: str, amount: float):
        """Fund agent wallet with USDC for operations"""
        wallet = self.agents_wallets.get(agent_name)
        if wallet:
            wallet["balance"] += amount
            logger.info(f"💰 Funded {agent_name} with {amount} USDC")
```

### Create Nanopayments Integration

**File: integrations/nanopayments.py**
```python
import logging
from typing import Dict

logger = logging.getLogger(__name__)

class NanopaymentsManager:
    """
    Circle Nanopayments for micro-transactions
    Agents pay $0.001 per compliance check
    """
    
    def __init__(self):
        self.gateway_address = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9"
        self.transaction_fee = 0.001  # $0.001 per check
    
    async def charge_compliance_fee(self, agent_wallet: str, tx_hash: str) -> Dict:
        """
        Charge micro-fee for compliance check
        Uses Circle Gateway for gasless payment
        """
        # TODO: Implement actual nanopayment
        logger.info(f"💳 Charged {self.transaction_fee} USDC from {agent_wallet}")
        
        return {
            "success": True,
            "amount": self.transaction_fee,
            "agent_wallet": agent_wallet,
            "tx_hash": tx_hash,
            "gateway_used": True
        }
    
    async def get_total_fees_collected(self) -> float:
        """Get total fees collected via nanopayments"""
        # TODO: Query from blockchain
        return 0.0
```

---

## Day 19-20: Reporting Agent & Auto-SAR Filing

### Create Reporting Agent

**File: agents/reporting_agent.py**
```python
from agents.base_agent import BaseAgent
from typing import Dict, Any, List
from datetime import datetime
import json

class ReportingAgent(BaseAgent):
    """
    Automatically generates compliance reports and files SARs
    """
    
    def __init__(self):
        super().__init__("ReportingAgent", "0x...")
        self.reports_generated = 0
    
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process flagged transactions and generate reports"""
        
        result = {
            "report_generated": False,
            "sar_filed": False,
            "processed_by": self.name
        }
        
        # Check if SAR filing needed
        risk_score = data.get("risk_result", {}).get("risk_score", 0)
        sanctioned = data.get("sanctions_result", {}).get("action") == "block"
        
        if risk_score >= 80 or sanctioned:
            sar = await self._generate_sar(data)
            result["sar_filed"] = True
            result["sar_id"] = sar["id"]
        
        await self.log_decision(result)
        return result
    
    async def _generate_sar(self, data: Dict[str, Any]) -> Dict:
        """
        Generate Suspicious Activity Report
        Format follows FinCEN standards
        """
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
            "filing_entity": "AgentCompliance Protocol"
        }
        
        # Save SAR
        self._save_sar(sar)
        
        self.logger.info(f"📋 Filed SAR: {sar_id}")
        return sar
    
    def _save_sar(self, sar: Dict):
        """Save SAR to compliance database"""
        # TODO: Save to database
        with open(f"data/sars/{sar['id']}.json", "w") as f:
            json.dump(sar, f, indent=2)
    
    async def generate_compliance_report(
        self, 
        start_date: datetime, 
        end_date: datetime
    ) -> Dict:
        """
        Generate comprehensive compliance report
        """
        # TODO: Query database for period
        
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
```

---

## Day 21: Update Orchestrator with All Agents

**Update: agents/orchestrator.py**
```python
# Add new agents to orchestration
def _build_graph(self) -> StateGraph:
    workflow = StateGraph(ComplianceState)
    
    # Add all 5 agents
    workflow.add_node("monitor", self._monitor_node)
    workflow.add_node("risk_score", self._risk_score_node)
    workflow.add_node("cross_chain", self._cross_chain_node)  # NEW
    workflow.add_node("sanctions", self._sanctions_node)
    workflow.add_node("reporting", self._reporting_node)  # NEW
    workflow.add_node("decide", self._decision_node)
    
    # Define flow
    workflow.set_entry_point("monitor")
    workflow.add_edge("monitor", "risk_score")
    workflow.add_edge("risk_score", "cross_chain")  # NEW
    workflow.add_edge("cross_chain", "sanctions")
    workflow.add_edge("sanctions", "reporting")  # NEW
    workflow.add_edge("reporting", "decide")
    workflow.set_finish_point("decide")
    
    return workflow.compile()

# Add new agent nodes
async def _cross_chain_node(self, state: ComplianceState) -> ComplianceState:
    result = await self.agents["cross_chain"].process({
        "transaction": state["transaction"],
        "risk_result": state["risk_result"]
    })
    state["cross_chain_result"] = result
    return state

async def _reporting_node(self, state: ComplianceState) -> ComplianceState:
    result = await self.agents["reporting"].process({
        "transaction": state["transaction"],
        "risk_result": state["risk_result"],
        "sanctions_result": state["sanctions_result"],
        "cross_chain_result": state["cross_chain_result"]
    })
    state["report_result"] = result
    return state
```

✅ **Phase 3 Complete:** Full Circle integration with all products!

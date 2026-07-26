# Implementation Guide Part 2 - Days 4-7 and Phase 2

## Day 4-5: Basic Agent System

### Create Base Agent Class

**File: agents/base_agent.py**
```python
from abc import ABC, abstractmethod
from typing import Dict, Any
import logging

class BaseAgent(ABC):
    """Base class for all compliance agents"""
    
    def __init__(self, name: str, wallet_address: str):
        self.name = name
        self.wallet_address = wallet_address
        self.logger = logging.getLogger(f"Agent.{name}")
    
    @abstractmethod
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process data and return result"""
        pass
    
    async def log_decision(self, decision: Dict):
        """Log agent decision for audit trail"""
        self.logger.info(f"{self.name} decision: {decision}")
```

### Create Transaction Monitor Agent

**File: agents/transaction_monitor.py**
```python
from agents.base_agent import BaseAgent
from typing import Dict, Any

class TransactionMonitorAgent(BaseAgent):
    """Monitors Arc transactions in real-time"""
    
    def __init__(self):
        super().__init__("TransactionMonitor", "0x...")
        self.processed_count = 0
    
    async def process(self, transaction: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process incoming transaction
        Returns: Enhanced transaction with initial assessment
        """
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
        
        # Basic checks
        if transaction.get("value", 0) > 100000:
            result["flags"].append("large_amount")
        
        if not transaction.get("to"):
            result["flags"].append("contract_creation")
        
        await self.log_decision(result)
        return result
```

### Create Risk Scorer Agent

**File: agents/risk_scorer.py**
```python
from agents.base_agent import BaseAgent
from ml.openaml_adapter import OpenAMLAdapter
from ml.feature_engineering import FeatureEngineer
from typing import Dict, Any

class RiskScorerAgent(BaseAgent):
    """Scores transaction risk using ML models"""
    
    def __init__(self):
        super().__init__("RiskScorer", "0x...")
        self.ml_model = OpenAMLAdapter()
        self.feature_engineer = FeatureEngineer()
    
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate risk score for transaction
        """
        transaction = data.get("transaction", {})
        
        # Extract features
        features = self.feature_engineer.extract_features(transaction)
        
        # Calculate risk score
        risk_score = self.ml_model.calculate_risk_score(transaction, features)
        
        # Get reasons
        reasons = self.ml_model.get_risk_reasons(transaction, features, risk_score)
        
        result = {
            "risk_score": risk_score,
            "risk_level": self._get_risk_level(risk_score),
            "reasons": reasons,
            "features": features,
            "processed_by": self.name
        }
        
        await self.log_decision(result)
        return result
    
    def _get_risk_level(self, score: int) -> str:
        if score >= 80:
            return "critical"
        elif score >= 50:
            return "high"
        elif score >= 25:
            return "medium"
        else:
            return "low"
```

### Create Sanctions Screener Agent

**File: agents/sanctions_screener.py**
```python
from agents.base_agent import BaseAgent
from typing import Dict, Any

class SanctionsScreenerAgent(BaseAgent):
    """Screens addresses against sanctions lists"""
    
    def __init__(self):
        super().__init__("SanctionsScreener", "0x...")
        self.sanctions_lists = self._load_sanctions()
    
    def _load_sanctions(self) -> Dict[str, set]:
        """Load OFAC, EU, UN sanctions lists"""
        # TODO: Load from data files
        return {
            "OFAC": set(),
            "EU": set(),
            "UN": set()
        }
    
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Check if addresses are sanctioned"""
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
        
        # Check sender
        for list_name, addresses in self.sanctions_lists.items():
            if from_addr in addresses:
                result["from_sanctioned"] = True
                result["sanctioned_lists"].append(f"{list_name} (sender)")
        
        # Check recipient
        for list_name, addresses in self.sanctions_lists.items():
            if to_addr in addresses:
                result["to_sanctioned"] = True
                result["sanctioned_lists"].append(f"{list_name} (recipient)")
        
        # Determine action
        if result["from_sanctioned"] or result["to_sanctioned"]:
            result["action"] = "block"
        
        await self.log_decision(result)
        return result
```

## Day 6-7: Agent Orchestration with LangGraph

### Install LangGraph
```bash
cd backend
source venv/bin/activate
pip install langgraph langchain openai
```

### Create Agent Orchestrator

**File: agents/orchestrator.py**
```python
from langgraph.graph import Graph, StateGraph
from typing import Dict, Any, TypedDict
import logging

logger = logging.getLogger(__name__)

class ComplianceState(TypedDict):
    """State shared between agents"""
    transaction: Dict[str, Any]
    monitor_result: Dict[str, Any]
    risk_result: Dict[str, Any]
    sanctions_result: Dict[str, Any]
    cross_chain_result: Dict[str, Any]
    report_result: Dict[str, Any]
    final_decision: str
    timestamp: float

class AgentOrchestrator:
    """Orchestrates multi-agent compliance checking"""
    
    def __init__(self, agents: Dict[str, Any]):
        self.agents = agents
        self.graph = self._build_graph()
    
    def _build_graph(self) -> StateGraph:
        """Build LangGraph workflow"""
        workflow = StateGraph(ComplianceState)
        
        # Add nodes (agents)
        workflow.add_node("monitor", self._monitor_node)
        workflow.add_node("risk_score", self._risk_score_node)
        workflow.add_node("sanctions", self._sanctions_node)
        workflow.add_node("decide", self._decision_node)
        
        # Define edges (flow)
        workflow.set_entry_point("monitor")
        workflow.add_edge("monitor", "risk_score")
        workflow.add_edge("risk_score", "sanctions")
        workflow.add_edge("sanctions", "decide")
        workflow.set_finish_point("decide")
        
        return workflow.compile()
    
    async def _monitor_node(self, state: ComplianceState) -> ComplianceState:
        """Transaction monitor agent node"""
        result = await self.agents["monitor"].process(state["transaction"])
        state["monitor_result"] = result
        return state
    
    async def _risk_score_node(self, state: ComplianceState) -> ComplianceState:
        """Risk scorer agent node"""
        result = await self.agents["risk_scorer"].process({
            "transaction": state["transaction"],
            "monitor_result": state["monitor_result"]
        })
        state["risk_result"] = result
        return state
    
    async def _sanctions_node(self, state: ComplianceState) -> ComplianceState:
        """Sanctions screener agent node"""
        result = await self.agents["sanctions"].process({
            "transaction": state["transaction"],
            "risk_result": state["risk_result"]
        })
        state["sanctions_result"] = result
        return state
    
    async def _decision_node(self, state: ComplianceState) -> ComplianceState:
        """Final decision node"""
        # Make decision based on all agent results
        risk_score = state["risk_result"]["risk_score"]
        sanctioned = state["sanctions_result"]["action"] == "block"
        
        if sanctioned:
            decision = "BLOCK"
        elif risk_score >= 80:
            decision = "BLOCK"
        elif risk_score >= 50:
            decision = "HOLD_FOR_REVIEW"
        else:
            decision = "APPROVE"
        
        state["final_decision"] = decision
        logger.info(f"Final decision: {decision} (risk: {risk_score})")
        return state
    
    async def process_transaction(self, transaction: Dict[str, Any]) -> ComplianceState:
        """Process transaction through agent pipeline"""
        initial_state: ComplianceState = {
            "transaction": transaction,
            "monitor_result": {},
            "risk_result": {},
            "sanctions_result": {},
            "cross_chain_result": {},
            "report_result": {},
            "final_decision": "",
            "timestamp": time.time()
        }
        
        result = await self.graph.ainvoke(initial_state)
        return result
```

## Connect Everything Together

**Update: backend/main.py**
```python
# Add imports
from agents.transaction_monitor import TransactionMonitorAgent
from agents.risk_scorer import RiskScorerAgent
from agents.sanctions_screener import SanctionsScreenerAgent
from agents.orchestrator import AgentOrchestrator
from integrations.arc_connector import ArcConnector

# Global instances
arc_connector = None
orchestrator = None
agents = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    global arc_connector, orchestrator, agents
    
    logger.info("🚀 Starting AgentCompliance Protocol...")
    
    # Initialize Arc connector
    arc_connector = ArcConnector()
    
    # Initialize agents
    agents = {
        "monitor": TransactionMonitorAgent(),
        "risk_scorer": RiskScorerAgent(),
        "sanctions": SanctionsScreenerAgent()
    }
    
    # Initialize orchestrator
    orchestrator = AgentOrchestrator(agents)
    
    # Start monitoring (in background)
    asyncio.create_task(start_monitoring())
    
    logger.info("✅ All agents initialized")
    
    yield
    
    logger.info("👋 Shutting down AgentCompliance Protocol...")

async def start_monitoring():
    """Start monitoring Arc transactions"""
    async def process_tx(transaction):
        try:
            # Process through agents
            result = await orchestrator.process_transaction(transaction)
            
            # Broadcast to connected clients
            await manager.broadcast_transaction_alert({
                "transaction": transaction,
                "result": result
            })
            
        except Exception as e:
            logger.error(f"Error processing transaction: {e}")
    
    await arc_connector.monitor_new_blocks(process_tx)
```

✅ **Days 4-7 Complete:** Agent system with orchestration working!

from abc import ABC, abstractmethod
from typing import Dict, Any
import logging

class BaseAgent(ABC):
    def __init__(self, name: str, wallet_address: str):
        self.name = name
        self.wallet_address = wallet_address
        self.logger = logging.getLogger(f"Agent.{name}")

    @abstractmethod
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        pass

    async def log_decision(self, decision: Dict):
        self.logger.info(f"{self.name} decision: {decision}")

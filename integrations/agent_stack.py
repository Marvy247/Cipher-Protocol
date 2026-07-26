from web3 import Web3
from eth_account import Account
from typing import Dict
import logging

logger = logging.getLogger(__name__)

class AgentStackManager:
    def __init__(self):
        self.agents_wallets = {}
        self._initialize_agent_wallets()

    def _initialize_agent_wallets(self):
        agent_names = [
            "TransactionMonitor",
            "RiskScorer",
            "CrossChainIntel",
            "SanctionsScreener",
            "ReportingAgent"
        ]

        for name in agent_names:
            account = Account.create()
            self.agents_wallets[name] = {
                "address": account.address,
                "private_key": account.key.hex(),
                "balance": 0,
                "transactions": []
            }
            logger.info(f"Created wallet for {name}: {account.address}")

    def get_agent_wallet(self, agent_name: str) -> Dict:
        return self.agents_wallets.get(agent_name, {})

    async def fund_agent_wallet(self, agent_name: str, amount: float):
        wallet = self.agents_wallets.get(agent_name)
        if wallet:
            wallet["balance"] += amount
            logger.info(f"Funded {agent_name} with {amount} USDC")

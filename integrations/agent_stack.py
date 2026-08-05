from web3 import Web3
from eth_account import Account
from typing import Dict, List
import logging
import os
from integrations.usage_tracker import track

logger = logging.getLogger(__name__)

AGENT_NAMES: List[str] = [
    "TransactionMonitor",
    "RiskScorer",
    "CrossChainIntel",
    "SanctionsScreener",
    "ReportingAgent",
]


def agent_account(agent_name: str) -> Account:
    key = os.getenv("WALLET_PRIVATE_KEY")
    if key:
        return Account.from_key(Web3.keccak(text=f"{key}:{agent_name}").hex())
    return Account.create()


def agent_wallet_addresses() -> Dict[str, str]:
    return {name: agent_account(name).address for name in AGENT_NAMES}


class AgentStackManager:
    def __init__(self):
        self.agents_wallets = {}
        self._initialize_agent_wallets()

    def _initialize_agent_wallets(self):
        for name in AGENT_NAMES:
            account = agent_account(name)
            self.agents_wallets[name] = {
                "address": account.address,
                "private_key": account.key.hex(),
                "balance": 0,
                "transactions": []
            }
            logger.info(f"Created wallet for {name}: {account.address}")

    @track("AgentStackManager")
    def get_agent_wallet(self, agent_name: str) -> Dict:
        return self.agents_wallets.get(agent_name, {})

    @track("AgentStackManager")
    async def fund_agent_wallet(self, agent_name: str, amount: float):
        wallet = self.agents_wallets.get(agent_name)
        if wallet:
            wallet["balance"] += amount
            logger.info(f"Funded {agent_name} with {amount} USDC")

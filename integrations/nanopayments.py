import logging
import os
from typing import Dict
from web3 import Web3
from eth_account import Account
from integrations.usage_tracker import track

logger = logging.getLogger(__name__)

USDC_ADDRESS = "0x3600000000000000000000000000000000000000"
USDC_ABI = [
    {
        "constant": False,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"},
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function",
    },
    {
        "constant": True,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function",
    },
]


class NanopaymentsManager:
    def __init__(self):
        self.gateway_address = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9"
        self.transaction_fee = 0.001
        self._w3 = None
        self._account = None

    def _ensure_web3(self):
        if self._w3 is not None:
            return
        rpc_url = os.getenv("ARC_RPC_URL", "https://rpc.testnet.arc.network")
        private_key = os.getenv("WALLET_PRIVATE_KEY")
        provider = Web3.HTTPProvider(rpc_url, request_kwargs={"timeout": 30})
        self._w3 = Web3(provider)
        if private_key:
            self._account = Account.from_key(private_key)

    @track("NanopaymentsManager")
    async def charge_compliance_fee(self, agent_wallet: str, tx_hash: str, live: bool = False) -> Dict:
        logger.info(f"Charging {self.transaction_fee} USDC from {agent_wallet} for tx {tx_hash}")

        if not live or os.getenv("NANOPAYMENT_LIVE_MODE", "").lower() not in ("true", "1"):
            return {
                "success": True,
                "amount": self.transaction_fee,
                "agent_wallet": agent_wallet,
                "tx_hash": tx_hash,
                "nanopayment_tx_hash": None,
                "gateway_used": False,
            }

        self._ensure_web3()

        nanopayment_tx_hash = None
        onchain_success = False

        if self._w3 and self._w3.is_connected() and self._account:
            try:
                usdc = self._w3.eth.contract(address=USDC_ADDRESS, abi=USDC_ABI)
                balance = usdc.functions.balanceOf(self._account.address).call()
                amount = int(self.transaction_fee * 1_000_000)

                if balance >= amount:
                    gas_price = self._w3.eth.gas_price
                    tx = usdc.functions.transfer(self.gateway_address, amount).build_transaction({
                        "from": self._account.address,
                        "nonce": self._w3.eth.get_transaction_count(self._account.address),
                        "gas": 100000,
                        "gasPrice": gas_price,
                    })

                    signed = self._account.sign_transaction(tx)
                    raw = signed.rawTransaction if hasattr(signed, "rawTransaction") else signed.raw_transaction
                    tx_hash_bytes = self._w3.eth.send_raw_transaction(raw)
                    nanopayment_tx_hash = tx_hash_bytes.hex() if isinstance(tx_hash_bytes, bytes) else tx_hash_bytes

                    receipt = self._w3.eth.wait_for_transaction_receipt(tx_hash_bytes, timeout=60)
                    onchain_success = receipt["status"] == 1

                    if onchain_success:
                        logger.info(f"Nanopayment confirmed: {nanopayment_tx_hash}")
                    else:
                        logger.warning(f"Nanopayment tx reverted: {nanopayment_tx_hash}")
                else:
                    logger.warning(f"Insufficient USDC balance: {balance / 1_000_000:.6f}")
            except Exception as e:
                logger.error(f"Nanopayment failed: {e}")
        else:
            logger.warning("Web3 not available — nanopayment skipped")

        return {
            "success": onchain_success,
            "amount": self.transaction_fee,
            "agent_wallet": agent_wallet,
            "tx_hash": tx_hash,
            "nanopayment_tx_hash": nanopayment_tx_hash,
            "gateway_used": onchain_success,
        }

    @track("NanopaymentsManager")
    async def get_total_fees_collected(self) -> float:
        self._ensure_web3()
        if self._w3 and self._w3.is_connected() and self._account:
            try:
                usdc = self._w3.eth.contract(address=USDC_ADDRESS, abi=USDC_ABI)
                balance = usdc.functions.balanceOf(self.gateway_address).call()
                return balance / 1_000_000
            except Exception as e:
                logger.error(f"Failed to check gateway balance: {e}")
        return 0.0

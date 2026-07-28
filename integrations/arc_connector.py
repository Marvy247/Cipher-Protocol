from web3 import Web3
from eth_account import Account
import logging
import asyncio
from typing import Dict, List, Optional
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.config.settings import settings
from integrations.usage_tracker import track

logger = logging.getLogger(__name__)

class ArcConnector:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(settings.arc_rpc_url))

        try:
            self.account = Account.from_key(settings.wallet_private_key)
        except Exception:
            self.account = Account.create()

        self.USDC_ADDRESS = "0x3600000000000000000000000000000000000000"
        self.EURC_ADDRESS = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a"

        self._verify_connection()

    def _verify_connection(self):
        try:
            block_number = self.w3.eth.block_number
            chain_id = self.w3.eth.chain_id
            logger.info(f"Connected to Arc: Chain ID {chain_id}, Block #{block_number}")

            balance = self.w3.eth.get_balance(self.account.address)
            logger.info(f"Wallet balance: {self.w3.from_wei(balance, 'ether')} ETH")

            return True
        except Exception as e:
            logger.warning(f"Could not connect to Arc RPC: {e} (running in offline mode)")
            return False

    @track("ArcConnector")
    def get_latest_block(self) -> int:
        return self.w3.eth.block_number

    @track("ArcConnector")
    def get_block_transactions(self, block_number: int) -> List[Dict]:
        try:
            block = self.w3.eth.get_block(block_number, full_transactions=True)
            return [self._format_transaction(tx) for tx in block.transactions]
        except Exception as e:
            logger.error(f"Error fetching block {block_number}: {e}")
            return []

    def _format_transaction(self, tx) -> Dict:
        return {
            "hash": tx['hash'].hex(),
            "from": tx['from'],
            "to": tx['to'],
            "value": float(self.w3.from_wei(tx['value'], 'ether')),
            "gas": tx['gas'],
            "gasPrice": tx['gasPrice'],
            "nonce": tx['nonce'],
            "blockNumber": tx['blockNumber'],
            "transactionIndex": tx['transactionIndex']
        }

    @track("ArcConnector")
    def get_transaction_receipt(self, tx_hash: str) -> Optional[Dict]:
        try:
            receipt = self.w3.eth.get_transaction_receipt(tx_hash)
            return {
                "status": receipt['status'],
                "gasUsed": receipt['gasUsed'],
                "logs": receipt['logs']
            }
        except Exception as e:
            logger.error(f"Error fetching receipt for {tx_hash}: {e}")
            return None

    async def monitor_new_blocks(self, callback):
        logger.info("Starting block monitoring...")
        last_block = self.get_latest_block()

        while True:
            try:
                current_block = self.get_latest_block()

                if current_block > last_block:
                    for block_num in range(last_block + 1, current_block + 1):
                        transactions = self.get_block_transactions(block_num)
                        for tx in transactions:
                            await callback(tx)

                    last_block = current_block

                await asyncio.sleep(1)

            except Exception as e:
                logger.error(f"Error in block monitoring: {e}")
                await asyncio.sleep(5)

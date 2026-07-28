"""
Send a real $0.001 USDC nanopayment on Arc Testnet.
Proves the wallet funds are real and on-chain.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from web3 import Web3
from eth_account import Account
from backend.config.settings import settings

USDC_ADDRESS = "0x3600000000000000000000000000000000000000"
GATEWAY_ADDRESS = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9"

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


def main():
    provider = Web3.HTTPProvider(settings.arc_rpc_url, request_kwargs={"timeout": 30})
    w3 = Web3(provider)
    if not w3.is_connected():
        print("Not connected to Arc RPC")
        return

    account = Account.from_key(settings.wallet_private_key)
    sender = account.address
    print(f"Wallet: {sender}")

    usdc = w3.eth.contract(address=USDC_ADDRESS, abi=USDC_ABI)

    balance = usdc.functions.balanceOf(sender).call()
    print(f"USDC balance: {balance / 1_000_000:.6f} USDC")

    if balance < 1000:
        print("Insufficient balance. Get testnet USDC from https://faucet.circle.com")
        return

    amount = 1000
    print(f"Sending {amount / 1_000_000} USDC to {GATEWAY_ADDRESS}...")

    try:
        gas_price = w3.eth.gas_price
    except Exception:
        gas_price = w3.to_wei(1, "gwei")

    tx = usdc.functions.transfer(GATEWAY_ADDRESS, amount).build_transaction({
        "from": sender,
        "nonce": w3.eth.get_transaction_count(sender),
        "gas": 100000,
        "gasPrice": gas_price,
    })

    signed = account.sign_transaction(tx)
    raw = signed.rawTransaction
    tx_hash = w3.eth.send_raw_transaction(raw)
    hex_hash = tx_hash.hex() if isinstance(tx_hash, bytes) else tx_hash

    print(f"\nTransaction sent!")
    print(f"   Tx Hash: {hex_hash}")
    print(f"   Explorer: https://testnet.arcscan.app/tx/{hex_hash}")
    print(f"   Amount: $0.001 USDC")
    print(f"   From: {sender}")
    print(f"   To: {GATEWAY_ADDRESS}")

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
    if receipt["status"] == 1:
        print(f"Confirmed in block {receipt['blockNumber']}")
    else:
        print("Transaction failed")


if __name__ == "__main__":
    main()

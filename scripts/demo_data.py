import asyncio
import json
from datetime import datetime
from typing import Dict

def generate_demo_transaction(tx_type: str = "normal") -> Dict:
    transactions = {
        "normal": {
            "hash": "0x" + "a" * 64,
            "from": "0x1234567890123456789012345678901234567890",
            "to": "0x0987654321098765432109876543210987654321",
            "value": 5000.00,
            "gas": 21000,
            "gasPrice": 1000000000,
            "nonce": 1,
            "blockNumber": 53600000,
            "transactionIndex": 0
        },
        "suspicious": {
            "hash": "0x" + "b" * 64,
            "from": "0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF",
            "to": "0xCAFEBABECAFEBABECAFEBABECAFEBABECAFEBABE",
            "value": 150000.00,
            "gas": 21000,
            "gasPrice": 1000000000,
            "nonce": 1,
            "blockNumber": 53600001,
            "transactionIndex": 0
        },
        "sanctioned": {
            "hash": "0x" + "c" * 64,
            "from": "0x1234567890123456789012345678901234567890",
            "to": "0xBADBADBADBADBADBADBADBADBADBADBADBADBADB",
            "value": 10000.00,
            "gas": 21000,
            "gasPrice": 1000000000,
            "nonce": 2,
            "blockNumber": 53600002,
            "transactionIndex": 0
        }
    }
    return transactions.get(tx_type, transactions["normal"])

if __name__ == "__main__":
    print("Demo transaction data generated")
    for tx_type in ["normal", "suspicious", "sanctioned"]:
        tx = generate_demo_transaction(tx_type)
        print(f"\n{tx_type.upper()}:")
        print(json.dumps(tx, indent=2))

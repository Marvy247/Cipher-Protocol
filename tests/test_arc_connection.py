import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from integrations.arc_connector import ArcConnector

async def test_connection():
    print("Testing Arc Connection...")

    connector = ArcConnector()

    block = connector.get_latest_block()
    print(f"Latest block: {block}")

    txs = connector.get_block_transactions(block)
    print(f"Transactions in block: {len(txs)}")

    if txs:
        print(f"Sample transaction: {txs[0]}")

    print("\nAll tests passed!")

if __name__ == "__main__":
    asyncio.run(test_connection())

from typing import Dict, Any, List
import logging
import sys
sys.path.append('/home/marvi/Documents/ARC')
from backend.config.settings import settings

logger = logging.getLogger(__name__)

class CircleAppKits:
    def __init__(self):
        self.api_key = settings.kit_key
        logger.info("Circle App Kits initialized")

    async def get_unified_balance(self, address: str) -> Dict[str, Any]:
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
        return []

    async def track_send_patterns(self, address: str) -> Dict[str, Any]:
        return {
            "total_sent": 100000,
            "recipient_count": 5,
            "fan_out_score": 12,
            "average_amount": 20000
        }

    async def detect_cross_chain_risk(self, address: str) -> Dict[str, Any]:
        balance_data = await self.get_unified_balance(address)
        bridge_history = await self.get_bridge_history(address)
        swap_history = await self.get_swap_history(address)
        send_patterns = await self.track_send_patterns(address)

        risk_flags = []
        risk_score = 0

        if len(balance_data["chains"]) > 5:
            risk_flags.append("Balance fragmented across multiple chains")
            risk_score += 20

        for bridge in bridge_history:
            if "tornado" in bridge.get("from_chain", "").lower():
                risk_flags.append("Bridged from mixing service")
                risk_score += 40

        if len(swap_history) > 0 and len(bridge_history) > 0:
            risk_flags.append("Swapped immediately after bridging")
            risk_score += 25

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

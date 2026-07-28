import random
import time
from datetime import datetime, timedelta
from typing import Dict

HASHES = [
    "0x" + "".join(random.choices("0123456789abcdef", k=64)) for _ in range(200)
]

ADDRESSES = [
    "0x" + "".join(random.choices("0123456789abcdef", k=40)) for _ in range(50)
]

KNOWN_SENDERS = ADDRESSES[:20]
KNOWN_RECIPIENTS = ADDRESSES[20:40]
MIXER_ADDRESS = "0x" + "".join(random.choices("0123456789abcdef", k=40))
SANCTIONED_ADDRESS = "0x" + "".join(random.choices("0123456789abcdef", k=40))

_last_nonce = {}  # type: ignore


def _realistic_amount(base: float, variance: float = 0.3) -> float:
    jitter = base * random.uniform(-variance, variance)
    val = base + jitter
    return round(max(val, 1.0), 2)


def _random_time(days_back: int = 7) -> str:
    dt = datetime.utcnow() - timedelta(
        days=random.randint(0, days_back),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
    )
    return dt.isoformat() + "Z"


def _next_nonce(sender: str) -> int:
    global _last_nonce
    _last_nonce[sender] = _last_nonce.get(sender, 0) + 1
    return _last_nonce[sender]


def generate_demo_transaction(tx_type: str = "normal") -> Dict:
    sender = random.choice(KNOWN_SENDERS)
    recipient = random.choice(KNOWN_RECIPIENTS)
    block_base = 54098220

    normal_amounts = [random.choice([500, 1200, 2500, 5000, 8200, 15000])]
    suspicious_amounts = [
        round(random.uniform(95000, 250000), 2),
        round(random.uniform(50000, 90000), 2),
    ]
    round_suspicious = [100000, 150000, 200000, 50000, 75000]

    if tx_type == "normal":
        amount = _realistic_amount(normal_amounts[0], 0.15)
        sender = random.choice(KNOWN_SENDERS[:15])
        recipient = random.choice(KNOWN_RECIPIENTS[:15])
        hour = random.randint(7, 20)
        risk_base = random.randint(3, 18)
    elif tx_type == "suspicious":
        sender = random.choice(KNOWN_SENDERS[15:18])
        recipient = random.choice(KNOWN_RECIPIENTS[15:18])
        amount = random.choice(suspicious_amounts + round_suspicious)
        hour = random.choice([1, 2, 3, 22, 23])
        risk_base = random.randint(55, 78)
    elif tx_type == "sanctioned":
        sender = random.choice(KNOWN_SENDERS[:5])
        recipient = SANCTIONED_ADDRESS
        amount = _realistic_amount(random.choice([5000, 10000, 15000]), 0.2)
        hour = random.randint(0, 23)
        risk_base = 100
    elif tx_type == "cross_chain":
        sender = "0xMULTICHAIN" + "".join(random.choices("0123456789abcdef", k=32))
        recipient = random.choice(KNOWN_RECIPIENTS[:10])
        amount = _realistic_amount(random.choice([75000, 120000, 200000]), 0.1)
        hour = random.randint(8, 18)
        risk_base = random.randint(70, 95)
    else:
        amount = _realistic_amount(5000)
        hour = 12
        risk_base = 10

    tx_hash = random.choice(HASHES)
    block_number = block_base + random.randint(0, 500)

    return {
        "hash": tx_hash,
        "from": sender,
        "to": recipient,
        "value": amount,
        "gas": random.choice([21000, 28000, 35000, 42000]),
        "gasPrice": random.randint(500000000, 5000000000),
        "nonce": _next_nonce(sender),
        "blockNumber": block_number,
        "transactionIndex": random.randint(0, 50),
        "timestamp": _random_time(7),
        "risk_score": min(risk_base + random.randint(-3, 8), 100),
    }

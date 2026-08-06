# Cipher Protocol — Autonomous AML/KYC Compliance for Arc

**One-line pitch:** The first autonomous AML/KYC compliance layer purpose-built for the Arc blockchain — five AI agents screen every transaction, and every compliance check settles on-chain for $0.001 USDC.

| | |
|---|---|
| **Live demo** | https://cipher-protocol.vercel.app |
| **API** | https://cipher-protocol.onrender.com |
| **Pitch deck** | https://gamma.app/docs/Cipher-Protocol-bkicpxcsyskfyc9 |
| **Chain** | Arc Testnet (Chain ID 5042002) |
| **Category** | Agentic Economy / Stablecoin Infrastructure / Regulatory Tech |

---

## The Problem

Compliance is the single biggest barrier to institutional stablecoin adoption. Circle has named enterprise adoption the #1 strategic priority for Arc — but a mid-size fintech spends **$2–5M per year** on manual AML/KYC operations: hiring teams, buying licenses, and stitching together sanctions lists that change daily.

The result: most startups simply skip compliance, and enterprises can't adopt Arc's sub-second settlement because human review can't keep pace with it.

## The Solution

**Cipher Protocol is a fully autonomous compliance system.** Five specialized AI agents work in concert to monitor, score, screen, and report on every transaction:

| # | Agent | Role |
|---|---|---|
| 1 | **Transaction Monitor** | Parses and validates every transaction, raises anomaly flags |
| 2 | **Risk Scorer** | ML-powered scoring (0–100) using OpenAML heuristics |
| 3 | **Cross-Chain Intelligence** | Multi-chain profile analysis (bridges, mixers, swaps, fan-out patterns) |
| 4 | **Sanctions Screener** | OFAC, EU, and UN consolidated list checks |
| 5 | **Reporting Agent** | Auto-generates Suspicious Activity Reports (SARs) and audit trails |

Every transaction flows through the same pipeline in **under 500ms**, then branches into `APPROVE`, `HOLD_FOR_REVIEW`, or `BLOCK` — automatically.

### The business model that runs itself

Each compliance check costs **$0.001 USDC**, charged on-chain. If the payment fails, the compliance report stays **locked** until the fee settles — the system literally refuses to operate for free, autonomously enforcing its own economics.

**ROI:** $2–5M/yr manual compliance → **<$50K/yr** autonomous (≈ **49x** cost reduction).

---

## What's Real On-Chain (verifiable right now)

This is not a mockup. Every item below is a live Arc Testnet artifact:

**1. Real nanopayments.** Every "Run Live Compliance Check" on the dashboard sends a real USDC transfer to the Cipher Protocol Gateway (`0x0077777d7EBA4688BDeF3E311b846F25870A19B9`). Recent verified transfers:

- `0xba844ffd65408944d61662cf691add6c8037b9f4f845e68065197b80a87c70ed`
- `0xd91dc9ec3118c6dc4d67f8098b6ea618cbb23f091af575a4cb4665858609791a`
- `0x0ea4e64c2230906992e10d051600d834291bdeadfb7cda26e140845dd7b02421`

([view on Arcscan](https://testnet.arcscan.app/tx/0xba844ffd65408944d61662cf691add6c8037b9f4f845e68065197b80a87c70ed))

**2. Agent Stack wallets.** Each of the five agents has its own deterministic wallet, funded on-chain with real USDC:

- Transaction Monitor — `0xDB3e85f9F595f6d5Afced75d21DA056fae7A0844`
- Risk Scorer — `0xec3FEE48F834FB6432A0C576bEf7Ac7f4015c6BA`
- Cross-Chain Intel — `0x476A3e0B941A85c538Bd68305581B401c12775A6`
- Sanctions Screener — `0x5A93d72AC890388b3B3722B8C77518A0FA3040F9`
- Reporting Agent — `0x90Eef5874F8B159F1a0Fd58E916Bc175a01b1E98`

**The agents actually pay.** The Reporting Agent signs and pays the $0.001 nanopayment **from its own wallet** — its on-chain balance drops and its transaction count increments on every live check (verified: 3 on-chain payments).

**3. Live block streaming.** The dashboard streams real Arc Testnet blocks in real time — block numbers, timestamps, and transaction hashes pulled directly from the Arc RPC, each linked to Arcscan.

**4. On-chain proof feed.** The dashboard's proof panel is populated from real `USDC Transfer` event logs via `eth_getLogs` — no mocked rows, every entry verifiable on-chain.

---

## Key Achievements

1. **End-to-end deployed product** — Next.js 15 frontend (Vercel) + FastAPI backend (Render) + WebSocket live streaming, all running 24/7.
2. **First real nanopayment rail on Arc Testnet** — $0.001 USDC transfers executed, confirmed, and displayed with explorer links.
3. **Genuine agentic economy** — agents hold custody of funds, sign transactions, and pay for their own operations on-chain.
4. **Payment-gated autonomous compliance** — the system enforces its own pricing model on-chain; failed payments lock reports until settled.
5. **Production-grade compliance UX** — live risk pipeline, sanctions heatmap, revenue analytics, sankey flow visualization, and an interactive API playground on the landing page.
6. **Honest engineering** — demo transaction stream is clearly separated from the real on-chain proof layer, so everything the judges verify is real.

---

## How We Built It (Process)

**Week 1 — Core intelligence.** Built the five-agent system: each agent as an independent module with a defined input/output contract, coordinated by an orchestrator that merges decisions into a single compliance verdict. Risk scoring leverages OpenAML heuristics; the sanctions agent maintains OFAC/EU/UN lists with a local cache.

**Week 2 — On-chain integration.** Connected to Arc Testnet via Web3.py. Implemented the nanopayments manager that constructs, signs, and broadcasts real USDC transfers, verifies receipts, and tracks revenue from event logs. Added the Arc block connector for live monitoring.

**Week 3 — Agent economy.** Gave every agent a deterministic wallet (derived from the operator key), funded them with on-chain USDC at startup, and wired the Reporting Agent to pay compliance fees from its own custody — turning the demo into a real agentic marketplace.

**Week 4 — Product & polish.** Built the landing page (ROI storytelling, animated 5-agent demo, live API playground), the full compliance dashboard (live transaction stream, on-chain proof, revenue analytics, sanctions heatmap, sankey visualization, live compliance checks), Circle product-usage tracking, and a production video script. Wrote tests, verified every on-chain claim, and deployed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python, FastAPI, Web3.py, eth-account, WebSockets |
| **Frontend** | Next.js 15, TypeScript, Tailwind, framer-motion, recharts |
| **Blockchain** | Arc Testnet, USDC (Circle), Arcscan explorer |
| **Infra** | Vercel (frontend), Render (API), GitHub Actions |

---

## What Judges Can Do in 60 Seconds

1. Open the landing page → watch the ROI cards and the 5-agent pipeline animation.
2. Scroll to the **API Playground** → paste any hash → watch the live pipeline run.
3. Open the dashboard → click **Run Live Compliance Check** → watch 5 agents screen a transaction and a **real $0.001 USDC payment** settle on-chain.
4. Click the Arcscan link → verify the transaction yourself.
5. Toggle **Payment failure** → watch the report lock, then unlock with a retry.
6. Explore the **On-Chain Proof**, **Real Arc Activity**, **Revenue**, and **Sanctions Heatmap** panels — all live data.

---

*Cipher Protocol — real agents, real on-chain settlements, real compliance. Built for the Arc hackathon.*

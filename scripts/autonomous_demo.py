"""
Autonomous Demo — runs the full 5-agent pipeline continuously
with detailed step-by-step reasoning output for each agent.
"""

import asyncio
import sys
import time
sys.path.append('/home/marvi/Documents/ARC')

from agents.transaction_monitor import TransactionMonitorAgent
from agents.risk_scorer import RiskScorerAgent
from agents.cross_chain_intel import CrossChainIntelligenceAgent
from agents.sanctions_screener import SanctionsScreenerAgent
from agents.reporting_agent import ReportingAgent
from agents.orchestrator import AgentOrchestrator
from scripts.demo_data import generate_demo_transaction
from integrations.usage_tracker import tracker


def colorize(text: str, color: str) -> str:
    colors = {
        "green": "\033[92m",
        "red": "\033[91m",
        "yellow": "\033[93m",
        "blue": "\033[94m",
        "cyan": "\033[96m",
        "magenta": "\033[95m",
        "bold": "\033[1m",
        "dim": "\033[2m",
        "reset": "\033[0m",
    }
    return f"{colors.get(color, '')}{text}{colors['reset']}"


def print_header(text: str):
    width = 70
    print()
    print(colorize("=" * width, "cyan"))
    print(colorize(f"  {text}", "bold"))
    print(colorize("=" * width, "cyan"))


def print_agent(name: str, status: str, details: str = ""):
    icon = {"✅": "green", "⏳": "yellow", "🚫": "red", "ℹ️": "blue"}.get(status[:2], "dim")
    print(f"  {status} {colorize(name, 'bold')}: {colorize(details, 'dim')}")


async def show_agent_reasoning(orchestrator, tx, label: str):
    print_header(f"  Processing: {label}")
    print(f"  TX: {colorize(tx['hash'][:20] + '...', 'dim')}")
    print(f"  From: {colorize(tx['from'][:16] + '...', 'dim')}  →  To: {colorize(tx['to'][:16] + '...', 'dim')}")
    amt = tx.get("value", 0)
    print(f"  Amount: {colorize(f'${amt:,.2f} USDC', 'yellow')}")
    print()

    agent_steps = [
        ("Transaction Monitor", "blue"),
        ("Risk Scorer", "yellow"),
        ("Cross-Chain Intelligence", "magenta"),
        ("Sanctions Screener", "red"),
        ("Reporting Agent", "cyan"),
    ]

    state = orchestrator._new_state(tx)

    state.monitor_result = await orchestrator.agents["monitor"].process(tx)
    flags = state.monitor_result.get("flags", [])
    flag_text = ", ".join(flags) if flags else "None"
    print_agent("Transaction Monitor", "✅", f"Validated. Flags: {flag_text}")

    state.risk_result = await orchestrator.agents["risk_scorer"].process({
        "transaction": tx, "monitor_result": state.monitor_result
    })
    score = state.risk_result.get("risk_score", 0)
    level = state.risk_result.get("risk_level", "unknown")
    reasons = state.risk_result.get("reasons", [])
    reason_text = "; ".join(reasons[:3]) if reasons else "No anomalies"
    print_agent("Risk Scorer", "✅", f"Score: {score}/100 ({level}) — {reason_text}")

    if "cross_chain" in orchestrator.agents:
        state.cross_chain_result = await orchestrator.agents["cross_chain"].process({
            "transaction": tx, "risk_result": state.risk_result
        })
        cc = state.cross_chain_result
        from_analysis = cc.get("from_address_analysis", {})
        to_analysis = cc.get("to_address_analysis", {})
        flags_from = from_analysis.get("flags", [])
        flags_to = to_analysis.get("flags", [])
        all_flags = flags_from + flags_to
        combined = cc.get("combined_risk_score", 0)
        if all_flags:
            for f in all_flags:
                print_agent("Cross-Chain Intel", "⚠️ ", f)
        else:
            print_agent("Cross-Chain Intel", "✅", f"No cross-chain risk. Combined: {combined}/100")

    state.sanctions_result = await orchestrator.agents["sanctions"].process({
        "transaction": tx, "risk_result": state.risk_result
    })
    if state.sanctions_result.get("action") == "block":
        lists = state.sanctions_result.get("sanctioned_lists", [])
        print_agent("Sanctions Screener", "🚫", f"BLOCKED — Matched: {', '.join(lists)}")
    else:
        print_agent("Sanctions Screener", "✅", "No sanctions match")

    final_decision = orchestrator._decide(state)
    state.final_decision = final_decision

    if "reporting" in orchestrator.agents:
        state.report_result = await orchestrator.agents["reporting"].process({
            "transaction": tx, "risk_result": state.risk_result,
            "sanctions_result": state.sanctions_result,
            "cross_chain_result": state.cross_chain_result,
            "final_decision": final_decision,
        })
        if state.report_result.get("sar_filed"):
            print_agent("Reporting Agent", "📄", f"SAR filed: {state.report_result['sar_id']}")
        else:
            print_agent("Reporting Agent", "✅", "No SAR needed (risk below threshold)")

    await orchestrator._charge_compliance_fee(tx, state)

    print()
    if final_decision == "APPROVE":
        status_icon = "✅"
        status_color = "green"
    elif final_decision == "HOLD_FOR_REVIEW":
        status_icon = "⏳"
        status_color = "yellow"
    else:
        status_icon = "🚫"
        status_color = "red"

    print(f"  {colorize('═' * 50, status_color)}")
    print(f"  {status_icon}  {colorize('FINAL DECISION:', 'bold')} {colorize(final_decision, status_color)}")
    print(f"  {colorize('═' * 50, status_color)}")

    await asyncio.sleep(0.3)


async def run_autonomous_demo():
    print()
    print(colorize("  ╔══════════════════════════════════════════════════════╗", "cyan"))
    print(colorize("  ║       CIPHER PROTOCOL — AUTONOMOUS DEMO            ║", "bold"))
    print(colorize("  ║    5 Agents Processing Transactions in Real-Time   ║", "cyan"))
    print(colorize("  ╚══════════════════════════════════════════════════════╝", "cyan"))
    print()
    print(colorize("  Initializing agents...", "dim"))

    agents = {
        "monitor": TransactionMonitorAgent(),
        "risk_scorer": RiskScorerAgent(),
        "cross_chain": CrossChainIntelligenceAgent(),
        "sanctions": SanctionsScreenerAgent(),
        "reporting": ReportingAgent(),
    }
    orchestrator = AgentOrchestrator(agents)

    scenario_txs = [
        ("Normal Payment — $5,000 USDC (business hours, known counterparty)", "normal"),
        ("Suspicious — $150,000 USDC (3AM, new address, mixer bridge)", "suspicious"),
        ("Sanctioned — Transaction to OFAC-listed address", "sanctioned"),
        ("Cross-Chain Layering — Wallet spread across 8 chains, mixer bridge", "suspicious"),
    ]

    for label, tx_type in scenario_txs:
        tx = generate_demo_transaction(tx_type)
        if "Cross-Chain" in label:
            tx["from"] = "0xMULTICHAINWALLET1234567890123456789012345678"
        if "Sanctioned" in label:
            orchestrator.agents["sanctions"].add_sanctioned_address("OFAC", tx["to"])
        await show_agent_reasoning(orchestrator, tx, label)

    print()
    print_header("  GENERATING COMPLIANCE REPORT")
    print(f"  Processing 10 batch transactions for report...")
    for i in range(10):
        tx = generate_demo_transaction("normal")
        await orchestrator.process_transaction(tx)
        print(f"  Processed batch tx {i+1}/10", end="\r")
        await asyncio.sleep(0.05)
    print()
    print_agent("Reporting Agent", "📄", "Compliance report generated for 10 transactions")

    summary = tracker.get_summary()
    print()
    print_header("  INTEGRATION USAGE SUMMARY")
    print(f"  {colorize('Total API Calls:', 'bold')}        {summary['total_calls']}")
    print(f"  {colorize('Successful:', 'bold')}             {summary['successful_calls']}")
    print(f"  {colorize('Avg Duration:', 'bold')}            {summary['average_duration_ms']}ms")
    print()
    for svc, data in summary.get("by_service", {}).items():
        print(f"  {colorize(svc, 'cyan')}: {data['calls']} calls ({data['successful']} ok, {data['failed']} err)")

    print()
    print(colorize("  ╔══════════════════════════════════════════════════════╗", "green"))
    print(colorize("  ║            DEMO COMPLETE — ALL AGENTS ACTIVE        ║", "bold"))
    print(colorize("  ╚══════════════════════════════════════════════════════╝", "green"))
    print()


if __name__ == "__main__":
    asyncio.run(run_autonomous_demo())

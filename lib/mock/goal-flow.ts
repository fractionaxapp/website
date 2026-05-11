export type AgentStepStatus = "idle" | "running" | "done"

export type AgentStep = {
	id: string
	agent: string
	agentLabel: string
	tone: "primary" | "info" | "warning" | "purple" | "rose"
	title: string
	durationMs: number
	thoughts: string[]
	outputs: Array<{ label: string; value: string; accent?: boolean }>
}

export const exampleGoal = "Invest $2,000 into low-risk yield RWAs."

export const altGoals = [
	"Build me $50K of monthly passive income.",
	"Park $10,000 in something safer than treasuries.",
	"Maximize yield with under 10% drawdown risk.",
	"Allocate $25K across real estate in SE Asia.",
]

export const goalSteps: AgentStep[] = [
	{
		id: "intent",
		agent: "MASTER",
		agentLabel: "Master Agent",
		tone: "primary",
		title: "Parsing your intent",
		durationMs: 1400,
		thoughts: [
			"Detected: investment goal · capital deployment",
			"Capital: $2,000 USDC",
			"Risk band: low",
			"Return type: yield-bearing",
			"Asset class: RWA (any)",
			"Decomposing into 5 sub-tasks…",
		],
		outputs: [
			{ label: "Capital", value: "$2,000", accent: true },
			{ label: "Risk", value: "Low" },
			{ label: "Strategy", value: "Yield" },
		],
	},
	{
		id: "source",
		agent: "DEAL.SRC",
		agentLabel: "Deal Sourcing",
		tone: "info",
		title: "Scanning the RWA universe",
		durationMs: 2000,
		thoughts: [
			"Querying primary issuers… 8 indexers, 3 chains",
			"Indexed 1,247 active RWAs across 14 jurisdictions",
			"Applying capital fit (≤ $2,000 min ticket)",
			"Filtering to yield-bearing instruments",
			"Down to 38 candidates",
		],
		outputs: [
			{ label: "Scanned", value: "1,247 RWAs" },
			{ label: "Candidates", value: "38" },
			{ label: "Time", value: "1.8s" },
		],
	},
	{
		id: "underwrite",
		agent: "UNDERWRITE",
		agentLabel: "Underwriting",
		tone: "warning",
		title: "Scoring each candidate",
		durationMs: 2200,
		thoughts: [
			"Loading 36-month cash-flow history per candidate",
			"Stress-testing under +200bp / −15% asset shocks",
			"Computing Sharpe, Sortino, expected APY",
			"Cross-checking issuer credit and counterparty",
			"Top 8 by risk-adjusted yield retained",
		],
		outputs: [
			{ label: "Stress tests", value: "112" },
			{ label: "Top picks", value: "8" },
			{ label: "Median Sharpe", value: "1.42" },
		],
	},
	{
		id: "comply",
		agent: "COMPLIANCE",
		agentLabel: "Compliance",
		tone: "purple",
		title: "Checking eligibility",
		durationMs: 1300,
		thoughts: [
			"Verifying your KYC tier and accreditation",
			"Filtering for your jurisdiction (SG)",
			"Removing 2 candidates with US-only restrictions",
			"Validating subscription docs are signable on-chain",
			"6 candidates approved",
		],
		outputs: [
			{ label: "KYC", value: "Verified" },
			{ label: "Jurisdiction", value: "Singapore" },
			{ label: "Approved", value: "6" },
		],
	},
	{
		id: "portfolio",
		agent: "PORTFOLIO",
		agentLabel: "Portfolio Manager",
		tone: "primary",
		title: "Constructing the allocation",
		durationMs: 1900,
		thoughts: [
			"Optimizing for low-risk yield · 8.0–9.5% target APY",
			"Minimizing single-issuer concentration",
			"Diversifying across geography and asset class",
			"Final mix: 3 assets, blended 8.4% APY",
		],
		outputs: [
			{ label: "Manila Tower REIT III", value: "60%", accent: true },
			{ label: "US Treasuries 2026", value: "25%" },
			{ label: "KL Office REIT IV", value: "15%" },
		],
	},
	{
		id: "execute",
		agent: "EXECUTE",
		agentLabel: "Execution",
		tone: "rose",
		title: "Signing on Solana",
		durationMs: 1800,
		thoughts: [
			"Routing through Jupiter for best USDC execution",
			"Signing 3 atomic transactions",
			"Submitting to mainnet…",
			"Awaiting confirmation",
			"Confirmed in slot 287,394,128 · 2.41s · fee $0.0003",
		],
		outputs: [
			{ label: "Txs", value: "3 of 3" },
			{ label: "Confirm", value: "2.4s" },
			{ label: "Fee", value: "$0.0003" },
		],
	},
	{
		id: "settle",
		agent: "SETTLEMENT",
		agentLabel: "Settlement",
		tone: "info",
		title: "Minting your tokens",
		durationMs: 1100,
		thoughts: [
			"Receiving RWA tokens in your custody wallet",
			"Updating cap table with issuers",
			"Scheduling next yield distribution check",
		],
		outputs: [
			{ label: "Tokens", value: "MTREIT3 · USTB26 · KLOR4" },
			{ label: "Next yield", value: "+14 days" },
		],
	},
]

export type ActiveGoal = {
	prompt: string
	capital: number
	apyBlended: number
	createdAt: string
	allocations: Array<{ name: string; pct: number; apy: number }>
}

export const goalAllocations: ActiveGoal["allocations"] = [
	{ name: "Manila Tower REIT III", pct: 60, apy: 8.4 },
	{ name: "US Treasuries 2026", pct: 25, apy: 4.9 },
	{ name: "KL Office REIT IV", pct: 15, apy: 9.1 },
]

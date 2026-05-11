export type Holding = {
	id: string
	name: string
	category: "Real Estate" | "Private Credit" | "Treasuries" | "Commodities" | "Infrastructure"
	region: string
	allocation: number
	value: number
	change30d: number
	apy: number
	risk: "Low" | "Low-Med" | "Medium" | "Med-High" | "High"
	maturity: string
}

export const holdings: Holding[] = [
	{
		id: "rwa-mt-reit",
		name: "Manila Tower REIT III",
		category: "Real Estate",
		region: "Philippines",
		allocation: 28,
		value: 14820.4,
		change30d: 4.2,
		apy: 8.4,
		risk: "Low-Med",
		maturity: "Open-ended",
	},
	{
		id: "rwa-pc-iii",
		name: "Asia Private Credit III",
		category: "Private Credit",
		region: "Singapore",
		allocation: 22,
		value: 11644.7,
		change30d: 1.8,
		apy: 12.1,
		risk: "Medium",
		maturity: "Mar 2027",
	},
	{
		id: "rwa-ust-26",
		name: "US Treasuries (2026)",
		category: "Treasuries",
		region: "United States",
		allocation: 18,
		value: 9528.1,
		change30d: 0.6,
		apy: 4.9,
		risk: "Low",
		maturity: "Aug 2026",
	},
	{
		id: "rwa-sg-ind",
		name: "SG Industrial Yield Fund",
		category: "Real Estate",
		region: "Singapore",
		allocation: 12,
		value: 6352.0,
		change30d: 3.4,
		apy: 7.2,
		risk: "Low-Med",
		maturity: "Open-ended",
	},
	{
		id: "rwa-cu-warr",
		name: "Copper Warrant Notes",
		category: "Commodities",
		region: "LatAm",
		allocation: 10,
		value: 5293.3,
		change30d: -1.2,
		apy: 9.8,
		risk: "Med-High",
		maturity: "Sep 2026",
	},
	{
		id: "rwa-ph-solar",
		name: "PH Solar Infra Bond",
		category: "Infrastructure",
		region: "Philippines",
		allocation: 6,
		value: 3175.9,
		change30d: 2.1,
		apy: 10.4,
		risk: "Medium",
		maturity: "Jan 2030",
	},
	{
		id: "rwa-my-credit",
		name: "MY SME Credit Pool",
		category: "Private Credit",
		region: "Malaysia",
		allocation: 4,
		value: 2117.3,
		change30d: 0.9,
		apy: 11.6,
		risk: "Med-High",
		maturity: "Jun 2026",
	},
]

export const portfolioTotal = holdings.reduce((s, h) => s + h.value, 0)

export const performance30d = Array.from({ length: 30 }, (_, i) => {
	const day = i + 1
	const noise = Math.sin(i / 3.4) * 80 + Math.cos(i / 5.1) * 60
	return {
		label: `D${day}`,
		value: Math.round(48000 + i * 90 + noise),
	}
})

export const allocationBreakdown = [
	{ label: "Real Estate", value: 40 },
	{ label: "Private Credit", value: 26 },
	{ label: "Treasuries", value: 18 },
	{ label: "Infrastructure", value: 6 },
	{ label: "Commodities", value: 10 },
]

export type ActivityEvent = {
	id: string
	at: string
	kind: "deposit" | "withdraw" | "rebalance" | "yield" | "trade" | "kyc"
	title: string
	subtitle: string
	amount?: string
	agent?: string
}

export const activity: ActivityEvent[] = [
	{
		id: "a1",
		at: "2 minutes ago",
		kind: "rebalance",
		title: "Portfolio rebalance",
		subtitle: "+2% Treasuries, −2% Commodities",
		agent: "PORTFOLIO",
	},
	{
		id: "a2",
		at: "37 minutes ago",
		kind: "yield",
		title: "Yield distribution received",
		subtitle: "Manila Tower REIT III · monthly coupon",
		amount: "+$104.27",
		agent: "SETTLEMENT",
	},
	{
		id: "a3",
		at: "2 hours ago",
		kind: "trade",
		title: "Allocation increased",
		subtitle: "SG Industrial Yield Fund · $250 allocated",
		amount: "−$250.00",
		agent: "EXECUTE",
	},
	{
		id: "a4",
		at: "Yesterday",
		kind: "deposit",
		title: "Deposit settled",
		subtitle: "USDC · Solana mainnet",
		amount: "+$5,000.00",
	},
	{
		id: "a5",
		at: "3 days ago",
		kind: "kyc",
		title: "KYC verification approved",
		subtitle: "Identity and address checks complete",
	},
	{
		id: "a6",
		at: "4 days ago",
		kind: "yield",
		title: "Yield distribution received",
		subtitle: "US Treasuries · semi-annual coupon",
		amount: "+$48.91",
		agent: "SETTLEMENT",
	},
	{
		id: "a7",
		at: "1 week ago",
		kind: "trade",
		title: "Position closed",
		subtitle: "Vietnam Logistics Note · matured",
		amount: "+$1,212.40",
		agent: "EXECUTE",
	},
]

export type AgentRow = {
	id: string
	name: string
	status: "active" | "idle" | "paused"
	model: string
	lastAction: string
	at: string
	tone: "primary" | "info" | "warning" | "muted"
}

export const agents: AgentRow[] = [
	{ id: "deal", name: "Deal Sourcing", model: "claude-rwa-finder-v3", status: "active", lastAction: "Screened 12 RE deals in SE Asia", at: "just now", tone: "info" },
	{ id: "uw", name: "Underwriting", model: "internal/quantum-uw-1", status: "active", lastAction: "Yield model: 8.4% on Manila Tower III", at: "14s ago", tone: "warning" },
	{ id: "pf", name: "Portfolio Manager", model: "claude-pf-mgr-v2", status: "active", lastAction: "Rebalanced +2% Fixed Income", at: "41s ago", tone: "primary" },
	{ id: "comp", name: "Compliance", model: "internal/comp-shield-2", status: "idle", lastAction: "Verified KYC for 3 onboardees", at: "2m ago", tone: "muted" },
	{ id: "exec", name: "Execution", model: "internal/solana-exec-1", status: "active", lastAction: "Routed swap: 250 USDC → SGYIELD", at: "3m ago", tone: "info" },
	{ id: "set", name: "Settlement", model: "internal/atomic-settle", status: "idle", lastAction: "Token transfer complete: $12,400", at: "5m ago", tone: "muted" },
]

export type WalletBalance = {
	asset: "USDC" | "SOL" | "USDT"
	balance: number
	usdValue: number
	chain: string
}

export const walletBalances: WalletBalance[] = [
	{ asset: "USDC", balance: 18430.12, usdValue: 18430.12, chain: "Solana" },
	{ asset: "USDT", balance: 0, usdValue: 0, chain: "Solana" },
	{ asset: "SOL", balance: 4.22, usdValue: 638.84, chain: "Solana" },
]

export type DiscoverAsset = {
	id: string
	name: string
	category: Holding["category"]
	region: string
	apy: number
	tenor: string
	minInvestment: number
	risk: Holding["risk"]
	raised: number
	target: number
	highlights: string[]
}

export const discoverAssets: DiscoverAsset[] = [
	{
		id: "kl-tower-iv",
		name: "KL Tower Office REIT IV",
		category: "Real Estate",
		region: "Malaysia",
		apy: 9.1,
		tenor: "Open-ended",
		minInvestment: 10,
		risk: "Low-Med",
		raised: 4_120_000,
		target: 6_000_000,
		highlights: ["Grade A office", "97% occupancy", "Triple-net lease"],
	},
	{
		id: "id-data-ctr",
		name: "Indonesia Data Center Bond",
		category: "Infrastructure",
		region: "Indonesia",
		apy: 11.2,
		tenor: "5y senior",
		minInvestment: 100,
		risk: "Medium",
		raised: 1_840_000,
		target: 3_500_000,
		highlights: ["Tier-3 facility", "Hyperscaler tenant", "USD-denominated"],
	},
	{
		id: "ph-mfi-pool",
		name: "PH Microfinance Pool II",
		category: "Private Credit",
		region: "Philippines",
		apy: 13.4,
		tenor: "18m amortizing",
		minInvestment: 25,
		risk: "Med-High",
		raised: 612_000,
		target: 1_200_000,
		highlights: ["35k+ borrowers", "Diversified pool", "Insured tranche"],
	},
	{
		id: "sg-warehouse-vi",
		name: "SG Logistics Warehouse VI",
		category: "Real Estate",
		region: "Singapore",
		apy: 7.6,
		tenor: "Open-ended",
		minInvestment: 50,
		risk: "Low-Med",
		raised: 8_500_000,
		target: 10_000_000,
		highlights: ["Last-mile logistics", "Investment grade tenant"],
	},
	{
		id: "us-tbill-26q4",
		name: "US T-Bills 26Q4",
		category: "Treasuries",
		region: "United States",
		apy: 4.7,
		tenor: "13m",
		minInvestment: 10,
		risk: "Low",
		raised: 22_000_000,
		target: 25_000_000,
		highlights: ["Short duration", "Risk-free benchmark"],
	},
	{
		id: "vn-solar-bond",
		name: "Vietnam Solar Project Bond",
		category: "Infrastructure",
		region: "Vietnam",
		apy: 10.8,
		tenor: "7y",
		minInvestment: 100,
		risk: "Medium",
		raised: 2_300_000,
		target: 4_000_000,
		highlights: ["Power purchase agreement", "Government concession"],
	},
]

export const investorDocuments = [
	{ id: "d1", name: "Q1 2026 Statement", type: "Statement", date: "Apr 1, 2026", size: "184 KB" },
	{ id: "d2", name: "2025 Annual Tax Summary", type: "Tax", date: "Feb 12, 2026", size: "212 KB" },
	{ id: "d3", name: "Manila Tower REIT III · Subscription Agreement", type: "Agreement", date: "Jan 8, 2026", size: "640 KB" },
	{ id: "d4", name: "KYC verification certificate", type: "Compliance", date: "Jan 4, 2026", size: "72 KB" },
	{ id: "d5", name: "Risk disclosure acknowledgment", type: "Compliance", date: "Jan 4, 2026", size: "44 KB" },
]

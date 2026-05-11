export type AssetListing = {
	id: string
	name: string
	category: "Real Estate" | "Private Credit" | "Infrastructure" | "Commodities"
	region: string
	status: "live" | "fundraising" | "draft" | "closed" | "in_review"
	target: number
	raised: number
	investors: number
	apyTarget: number
	tenor: string
	created: string
	nextPayout: string | null
}

export const ownerAssets: AssetListing[] = [
	{
		id: "kl-tower-iv",
		name: "KL Tower Office REIT IV",
		category: "Real Estate",
		region: "Malaysia",
		status: "fundraising",
		target: 6_000_000,
		raised: 4_120_000,
		investors: 312,
		apyTarget: 9.1,
		tenor: "Open-ended",
		created: "Mar 4, 2026",
		nextPayout: "Jun 1, 2026",
	},
	{
		id: "kl-tower-iii",
		name: "KL Tower Office REIT III",
		category: "Real Estate",
		region: "Malaysia",
		status: "live",
		target: 4_500_000,
		raised: 4_500_000,
		investors: 511,
		apyTarget: 8.6,
		tenor: "Open-ended",
		created: "Aug 12, 2025",
		nextPayout: "May 18, 2026",
	},
	{
		id: "ph-mfi-pool",
		name: "PH Microfinance Pool II",
		category: "Private Credit",
		region: "Philippines",
		status: "fundraising",
		target: 1_200_000,
		raised: 612_000,
		investors: 88,
		apyTarget: 13.4,
		tenor: "18m amortizing",
		created: "Apr 21, 2026",
		nextPayout: null,
	},
	{
		id: "vn-solar-bond",
		name: "Vietnam Solar Project Bond",
		category: "Infrastructure",
		region: "Vietnam",
		status: "in_review",
		target: 4_000_000,
		raised: 0,
		investors: 0,
		apyTarget: 10.8,
		tenor: "7y",
		created: "May 2, 2026",
		nextPayout: null,
	},
	{
		id: "kl-warehouse-i",
		name: "KL Warehouse I",
		category: "Real Estate",
		region: "Malaysia",
		status: "closed",
		target: 2_000_000,
		raised: 2_000_000,
		investors: 174,
		apyTarget: 7.4,
		tenor: "5y",
		created: "Jan 6, 2024",
		nextPayout: null,
	},
	{
		id: "vn-logi-i",
		name: "Vietnam Logistics Note",
		category: "Private Credit",
		region: "Vietnam",
		status: "closed",
		target: 1_500_000,
		raised: 1_500_000,
		investors: 96,
		apyTarget: 11.2,
		tenor: "12m",
		created: "Apr 2, 2025",
		nextPayout: null,
	},
]

export const ownerKpis = {
	aum: ownerAssets.filter((a) => a.status === "live" || a.status === "fundraising").reduce((s, a) => s + a.raised, 0),
	investors: ownerAssets.reduce((s, a) => s + a.investors, 0),
	liveAssets: ownerAssets.filter((a) => a.status === "live").length,
	fundraising: ownerAssets.filter((a) => a.status === "fundraising").length,
}

export const fundraisingTrend = Array.from({ length: 12 }, (_, i) => {
	const month = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"][i]
	return {
		label: month,
		value: Math.round(280_000 + Math.sin(i / 1.7) * 90_000 + i * 35_000),
	}
})

export const investorBreakdown = [
	{ label: "Retail (<$10K)", value: 62 },
	{ label: "Accredited", value: 28 },
	{ label: "Institutional", value: 10 },
]

export type CapTableEntry = {
	id: string
	investor: string
	wallet: string
	asset: string
	amount: number
	tokens: number
	since: string
	region: string
	tier: "Retail" | "Accredited" | "Institutional"
}

export const capTable: CapTableEntry[] = [
	{ id: "i1", investor: "Northwind Capital", wallet: "5xQ9…vK4", asset: "KL Tower IV", amount: 480_000, tokens: 480_000, since: "Mar 18, 2026", region: "Singapore", tier: "Institutional" },
	{ id: "i2", investor: "Sun Lim", wallet: "8t3R…hJ2", asset: "KL Tower III", amount: 24_000, tokens: 24_000, since: "Sep 4, 2025", region: "Malaysia", tier: "Accredited" },
	{ id: "i3", investor: "Acorn DAO", wallet: "3pAv…mW9", asset: "KL Tower IV", amount: 220_000, tokens: 220_000, since: "Apr 3, 2026", region: "Cayman", tier: "Institutional" },
	{ id: "i4", investor: "Maria de la Cruz", wallet: "9eXm…tQ1", asset: "PH Microfinance II", amount: 1_400, tokens: 1_400, since: "Apr 28, 2026", region: "Philippines", tier: "Retail" },
	{ id: "i5", investor: "Daichi Saito", wallet: "2HnB…sV7", asset: "KL Tower III", amount: 56_000, tokens: 56_000, since: "Oct 12, 2025", region: "Japan", tier: "Accredited" },
	{ id: "i6", investor: "Pegasus Family Office", wallet: "7kLm…oZ3", asset: "KL Tower IV", amount: 800_000, tokens: 800_000, since: "Mar 9, 2026", region: "Hong Kong", tier: "Institutional" },
	{ id: "i7", investor: "Aisyah Rahman", wallet: "4cWp…dE5", asset: "KL Tower III", amount: 8_400, tokens: 8_400, since: "Aug 22, 2025", region: "Malaysia", tier: "Retail" },
	{ id: "i8", investor: "Lin Wei", wallet: "6gDs…rN8", asset: "PH Microfinance II", amount: 12_000, tokens: 12_000, since: "May 1, 2026", region: "Singapore", tier: "Accredited" },
]

export type Payout = {
	id: string
	asset: string
	period: string
	amount: number
	investorCount: number
	status: "scheduled" | "processing" | "settled"
	scheduledFor: string
	settledAt: string | null
}

export const payouts: Payout[] = [
	{ id: "p1", asset: "KL Tower III", period: "May 2026", amount: 32_400, investorCount: 511, status: "scheduled", scheduledFor: "May 18, 2026", settledAt: null },
	{ id: "p2", asset: "KL Tower IV", period: "Jun 2026", amount: 28_900, investorCount: 312, status: "scheduled", scheduledFor: "Jun 1, 2026", settledAt: null },
	{ id: "p3", asset: "KL Tower III", period: "Apr 2026", amount: 31_200, investorCount: 504, status: "settled", scheduledFor: "Apr 18, 2026", settledAt: "Apr 18, 2026" },
	{ id: "p4", asset: "KL Tower III", period: "Mar 2026", amount: 30_870, investorCount: 488, status: "settled", scheduledFor: "Mar 18, 2026", settledAt: "Mar 18, 2026" },
	{ id: "p5", asset: "KL Warehouse I (matured)", period: "Closeout", amount: 184_000, investorCount: 174, status: "settled", scheduledFor: "Feb 6, 2026", settledAt: "Feb 6, 2026" },
]

export const ownerDocuments = [
	{ id: "od1", name: "KL Tower IV — Offering Memorandum", type: "Offering", date: "Mar 4, 2026", size: "2.4 MB" },
	{ id: "od2", name: "KL Tower IV — Property Appraisal Report", type: "Diligence", date: "Mar 1, 2026", size: "5.1 MB" },
	{ id: "od3", name: "KL Tower IV — Asset Manager Agreement", type: "Legal", date: "Mar 4, 2026", size: "880 KB" },
	{ id: "od4", name: "PH Microfinance II — Loan Tape", type: "Diligence", date: "Apr 21, 2026", size: "1.2 MB" },
	{ id: "od5", name: "Q1 2026 Investor Report — KL Tower III", type: "Reporting", date: "Apr 4, 2026", size: "910 KB" },
	{ id: "od6", name: "Vietnam Solar Bond — Concession Letter", type: "Legal", date: "May 2, 2026", size: "320 KB" },
]

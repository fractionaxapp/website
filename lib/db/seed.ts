import { db } from "./index"
import { assets, type NewAsset } from "./schema"
import { sql } from "drizzle-orm"

const SEED_ASSETS: NewAsset[] = [
	{
		slug: "manila-tower-reit-iii",
		name: "Manila Tower REIT III",
		category: "Real Estate",
		region: "Philippines",
		description: "Tokenized Grade-A office REIT in Manila CBD. Long-term triple-net leases with multinational tenants.",
		targetApy: "8.40",
		risk: "Low-Med",
		tenor: "Open-ended",
		minInvestment: "10",
		targetRaise: "5000000",
		currentRaised: "4820000",
		status: "live",
		highlights: ["Grade-A office", "Triple-net lease", "Multinational tenants"],
	},
	{
		slug: "us-treasuries-2026",
		name: "US Treasuries 2026",
		category: "Treasuries",
		region: "United States",
		description: "Short-duration US Treasury bills maturing August 2026. Risk-free benchmark yield.",
		targetApy: "4.90",
		risk: "Low",
		tenor: "Aug 2026",
		minInvestment: "10",
		targetRaise: "25000000",
		currentRaised: "22000000",
		status: "live",
		highlights: ["Short duration", "Risk-free benchmark", "Government-backed"],
	},
	{
		slug: "kl-tower-office-reit-iv",
		name: "KL Tower Office REIT IV",
		category: "Real Estate",
		region: "Malaysia",
		description: "Tokenized Grade A office REIT in Kuala Lumpur. 97% occupancy with multinational tenants.",
		targetApy: "9.10",
		risk: "Low-Med",
		tenor: "Open-ended",
		minInvestment: "10",
		targetRaise: "6000000",
		currentRaised: "4120000",
		status: "fundraising",
		highlights: ["Grade A office", "97% occupancy", "Triple-net lease"],
	},
	{
		slug: "asia-private-credit-iii",
		name: "Asia Private Credit III",
		category: "Private Credit",
		region: "Singapore",
		description: "Diversified senior private credit pool across Southeast Asia. Insured tranche.",
		targetApy: "12.10",
		risk: "Medium",
		tenor: "Mar 2027",
		minInvestment: "100",
		targetRaise: "8000000",
		currentRaised: "6450000",
		status: "fundraising",
		highlights: ["Diversified pool", "Insured tranche", "Senior position"],
	},
	{
		slug: "sg-industrial-yield",
		name: "SG Industrial Yield Fund",
		category: "Real Estate",
		region: "Singapore",
		description: "Last-mile logistics warehouses leased to investment-grade tenants.",
		targetApy: "7.20",
		risk: "Low-Med",
		tenor: "Open-ended",
		minInvestment: "50",
		targetRaise: "10000000",
		currentRaised: "8500000",
		status: "fundraising",
		highlights: ["Last-mile logistics", "Investment grade tenant"],
	},
	{
		slug: "id-data-center-bond",
		name: "Indonesia Data Center Bond",
		category: "Infrastructure",
		region: "Indonesia",
		description: "Senior bond financing a Tier-3 data center leased to a hyperscaler tenant.",
		targetApy: "11.20",
		risk: "Medium",
		tenor: "5y senior",
		minInvestment: "100",
		targetRaise: "3500000",
		currentRaised: "1840000",
		status: "fundraising",
		highlights: ["Tier-3 facility", "Hyperscaler tenant", "USD-denominated"],
	},
	{
		slug: "ph-microfinance-pool-ii",
		name: "PH Microfinance Pool II",
		category: "Private Credit",
		region: "Philippines",
		description: "Pool of 35,000+ microloans to small businesses. Insured tranche structure.",
		targetApy: "13.40",
		risk: "Med-High",
		tenor: "18m amortizing",
		minInvestment: "25",
		targetRaise: "1200000",
		currentRaised: "612000",
		status: "fundraising",
		highlights: ["35k+ borrowers", "Diversified pool", "Insured tranche"],
	},
	{
		slug: "vn-solar-bond",
		name: "Vietnam Solar Project Bond",
		category: "Infrastructure",
		region: "Vietnam",
		description: "Project bond for a utility-scale solar farm with a 20-year power purchase agreement.",
		targetApy: "10.80",
		risk: "Medium",
		tenor: "7y",
		minInvestment: "100",
		targetRaise: "4000000",
		currentRaised: "2300000",
		status: "fundraising",
		highlights: ["Power purchase agreement", "Government concession"],
	},
	{
		slug: "copper-warrant-notes",
		name: "Copper Warrant Notes",
		category: "Commodities",
		region: "LatAm",
		description: "Tokenized warehouse warrants backed by LME-grade copper inventory.",
		targetApy: "9.80",
		risk: "Med-High",
		tenor: "Sep 2026",
		minInvestment: "100",
		targetRaise: "2000000",
		currentRaised: "1100000",
		status: "fundraising",
		highlights: ["LME-grade copper", "Warehouse-backed"],
	},
	{
		slug: "ph-solar-infra-bond",
		name: "PH Solar Infra Bond",
		category: "Infrastructure",
		region: "Philippines",
		description: "Senior infrastructure bond for a rooftop solar portfolio across the Philippines.",
		targetApy: "10.40",
		risk: "Medium",
		tenor: "Jan 2030",
		minInvestment: "50",
		targetRaise: "5000000",
		currentRaised: "3200000",
		status: "fundraising",
		highlights: ["Rooftop portfolio", "Senior secured"],
	},
	{
		slug: "my-sme-credit-pool",
		name: "MY SME Credit Pool",
		category: "Private Credit",
		region: "Malaysia",
		description: "Senior tranche of an SME credit portfolio originated through a regional bank partner.",
		targetApy: "11.60",
		risk: "Med-High",
		tenor: "Jun 2026",
		minInvestment: "50",
		targetRaise: "1500000",
		currentRaised: "900000",
		status: "fundraising",
		highlights: ["Senior tranche", "Bank-originated"],
	},
]

async function main() {
	console.log(`Seeding ${SEED_ASSETS.length} assets…`)
	const existing = await db.execute(sql`SELECT COUNT(*)::int AS n FROM assets`)
	const n = (existing as unknown as { rows: Array<{ n: number }> }).rows?.[0]?.n ?? 0
	if (n > 0) {
		console.log(`Assets table already has ${n} rows. Doing onConflictDoNothing on slug to upsert new entries.`)
	}
	const inserted = await db
		.insert(assets)
		.values(SEED_ASSETS)
		.onConflictDoNothing({ target: assets.slug })
		.returning({ id: assets.id, slug: assets.slug })
	console.log(`Inserted ${inserted.length} new assets.`)
	process.exit(0)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})

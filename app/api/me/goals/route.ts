import { and, desc, eq, inArray } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { assets, goals, holdings, transactions } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth/require-user"

export const runtime = "nodejs"

const bodySchema = z.object({
	prompt: z.string().trim().min(4).max(500),
	capital: z.number().positive().max(10_000_000).optional(),
	allocation: z
		.array(
			z.object({
				slug: z.string(),
				pct: z.number().min(0).max(100),
			}),
		)
		.optional(),
})

const DEFAULT_ALLOCATION = [
	{ slug: "manila-tower-reit-iii", pct: 60 },
	{ slug: "us-treasuries-2026", pct: 25 },
	{ slug: "kl-tower-office-reit-iv", pct: 15 },
]

function parseCapitalFromPrompt(prompt: string): number {
	const m = prompt.match(/\$?([\d,]+)(\.\d+)?\s*(k|K|m|M)?/)
	if (!m) return 2000
	const num = Number(m[1].replace(/,/g, "") + (m[2] ?? ""))
	if (!Number.isFinite(num) || num <= 0) return 2000
	const unit = m[3]?.toLowerCase()
	if (unit === "k") return num * 1000
	if (unit === "m") return num * 1_000_000
	return num
}

export async function GET(request: Request) {
	const auth = await requireUser(request)
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const rows = await db
		.select()
		.from(goals)
		.where(eq(goals.userId, auth.user.id))
		.orderBy(desc(goals.createdAt))

	return Response.json({ ok: true, goals: rows })
}

export async function POST(request: Request) {
	const auth = await requireUser(request)
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const parsed = bodySchema.safeParse(await request.json().catch(() => ({})))
	if (!parsed.success) {
		return Response.json({ ok: false, error: "Invalid input", details: parsed.error.issues }, { status: 400 })
	}

	const prompt = parsed.data.prompt
	const capital = parsed.data.capital ?? parseCapitalFromPrompt(prompt)
	const allocation = parsed.data.allocation ?? DEFAULT_ALLOCATION

	const slugs = allocation.map((a) => a.slug)
	const matched = await db.select().from(assets).where(inArray(assets.slug, slugs))
	if (matched.length === 0) {
		return Response.json({ ok: false, error: "No matching assets" }, { status: 400 })
	}

	const matchedBySlug = new Map(matched.map((a) => [a.slug, a]))
	const totalPct = allocation.reduce(
		(s, a) => s + (matchedBySlug.has(a.slug) ? a.pct : 0),
		0,
	)
	if (totalPct === 0) {
		return Response.json({ ok: false, error: "Invalid allocation" }, { status: 400 })
	}

	const blendedApy =
		matched.reduce((s, asset) => {
			const slot = allocation.find((a) => a.slug === asset.slug)
			if (!slot) return s
			const weight = slot.pct / totalPct
			return s + (Number(asset.targetApy ?? "0") * weight)
		}, 0)

	const [createdGoal] = await db
		.insert(goals)
		.values({
			userId: auth.user.id,
			prompt,
			capital: capital.toFixed(2),
			blendedApy: blendedApy.toFixed(2),
			status: "active",
		})
		.returning()

	const txValues: Array<typeof transactions.$inferInsert> = []
	const holdingsValues: Array<typeof holdings.$inferInsert> = []

	txValues.push({
		userId: auth.user.id,
		kind: "deposit",
		amount: capital.toFixed(2),
		title: "Deposit settled",
		subtitle: "USDC · Solana mainnet",
		agent: "SETTLEMENT",
	})

	for (const slot of allocation) {
		const asset = matchedBySlug.get(slot.slug)
		if (!asset) continue
		const weight = slot.pct / totalPct
		const amount = capital * weight
		const tokens = amount

		holdingsValues.push({
			userId: auth.user.id,
			assetId: asset.id,
			amount: amount.toFixed(2),
			tokens: tokens.toFixed(6),
			goalId: createdGoal.id,
		})

		txValues.push({
			userId: auth.user.id,
			kind: "allocation",
			assetId: asset.id,
			amount: amount.toFixed(2),
			title: `Allocated to ${asset.name}`,
			subtitle: `${slot.pct}% of goal · ${Number(asset.targetApy ?? 0).toFixed(1)}% target APY`,
			agent: "EXECUTE",
		})
	}

	txValues.push({
		userId: auth.user.id,
		kind: "rebalance",
		amount: null,
		title: "Goal mandate active",
		subtitle: `Portfolio Manager is monitoring "${prompt.slice(0, 80)}${prompt.length > 80 ? "…" : ""}"`,
		agent: "PORTFOLIO",
	})

	if (holdingsValues.length > 0) {
		await db
			.insert(holdings)
			.values(holdingsValues)
			.onConflictDoNothing({ target: [holdings.userId, holdings.assetId] })
	}
	if (txValues.length > 0) {
		await db.insert(transactions).values(txValues)
	}

	return Response.json({ ok: true, goal: createdGoal })
}

export async function DELETE(request: Request) {
	const auth = await requireUser(request)
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const url = new URL(request.url)
	const id = Number(url.searchParams.get("id"))
	if (!Number.isFinite(id) || id <= 0) {
		return Response.json({ ok: false, error: "Invalid id" }, { status: 400 })
	}

	await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, auth.user.id)))
	return Response.json({ ok: true })
}

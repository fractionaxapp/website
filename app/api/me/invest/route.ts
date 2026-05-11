import { and, eq, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { assets, holdings, transactions } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth/require-user"

export const runtime = "nodejs"

const bodySchema = z.object({
	slug: z.string().min(1),
	amount: z.number().positive().max(10_000_000),
})

export async function POST(request: Request) {
	const auth = await requireUser(request)
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const parsed = bodySchema.safeParse(await request.json().catch(() => ({})))
	if (!parsed.success) {
		return Response.json({ ok: false, error: "Invalid input", details: parsed.error.issues }, { status: 400 })
	}

	const { slug, amount } = parsed.data
	const [asset] = await db.select().from(assets).where(eq(assets.slug, slug)).limit(1)
	if (!asset) return Response.json({ ok: false, error: "Asset not found" }, { status: 404 })
	if (asset.status !== "live" && asset.status !== "fundraising") {
		return Response.json({ ok: false, error: "Asset is not accepting capital" }, { status: 400 })
	}
	if (asset.ownerId === auth.user.id) {
		return Response.json({ ok: false, error: "Cannot invest in your own asset" }, { status: 400 })
	}

	const min = Number(asset.minInvestment ?? 0)
	if (amount < min) {
		return Response.json({ ok: false, error: `Minimum investment is $${min}` }, { status: 400 })
	}

	const existing = await db
		.select()
		.from(holdings)
		.where(and(eq(holdings.userId, auth.user.id), eq(holdings.assetId, asset.id)))
		.limit(1)

	if (existing.length > 0) {
		const prev = existing[0]
		const newAmount = Number(prev.amount) + amount
		const newTokens = Number(prev.tokens) + amount
		await db
			.update(holdings)
			.set({ amount: newAmount.toFixed(2), tokens: newTokens.toFixed(6), updatedAt: new Date() })
			.where(eq(holdings.id, prev.id))
	} else {
		await db.insert(holdings).values({
			userId: auth.user.id,
			assetId: asset.id,
			amount: amount.toFixed(2),
			tokens: amount.toFixed(6),
		})
	}

	await db
		.update(assets)
		.set({
			currentRaised: sql`${assets.currentRaised} + ${amount.toFixed(2)}`,
			updatedAt: new Date(),
		})
		.where(eq(assets.id, asset.id))

	await db.insert(transactions).values({
		userId: auth.user.id,
		kind: "allocation",
		assetId: asset.id,
		amount: amount.toFixed(2),
		title: `Invested in ${asset.name}`,
		subtitle: `${Number(asset.targetApy ?? 0).toFixed(1)}% target APY · ${asset.tenor ?? "—"}`,
		agent: "EXECUTE",
	})

	return Response.json({ ok: true })
}

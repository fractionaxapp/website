import { and, eq, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { assets, holdings, transactions } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth/require-user"

export const runtime = "nodejs"

const bodySchema = z.object({
	holdingId: z.number().int().positive(),
	amount: z.number().positive().optional(), // omit for "sell all"
})

export async function POST(request: Request) {
	const auth = await requireUser(request)
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const parsed = bodySchema.safeParse(await request.json().catch(() => ({})))
	if (!parsed.success) {
		return Response.json({ ok: false, error: "Invalid input" }, { status: 400 })
	}

	const [h] = await db
		.select()
		.from(holdings)
		.where(and(eq(holdings.id, parsed.data.holdingId), eq(holdings.userId, auth.user.id)))
		.limit(1)
	if (!h) return Response.json({ ok: false, error: "Holding not found" }, { status: 404 })

	const [asset] = await db.select().from(assets).where(eq(assets.id, h.assetId)).limit(1)
	if (!asset) return Response.json({ ok: false, error: "Asset missing" }, { status: 404 })

	const current = Number(h.amount)
	const sellAmount = parsed.data.amount ?? current
	if (sellAmount > current) {
		return Response.json({ ok: false, error: "Amount exceeds position" }, { status: 400 })
	}

	const remaining = current - sellAmount

	if (remaining <= 0.005) {
		await db.delete(holdings).where(eq(holdings.id, h.id))
	} else {
		await db
			.update(holdings)
			.set({
				amount: remaining.toFixed(2),
				tokens: remaining.toFixed(6),
				updatedAt: new Date(),
			})
			.where(eq(holdings.id, h.id))
	}

	await db
		.update(assets)
		.set({
			currentRaised: sql`GREATEST(0, ${assets.currentRaised} - ${sellAmount.toFixed(2)})`,
			updatedAt: new Date(),
		})
		.where(eq(assets.id, asset.id))

	await db.insert(transactions).values({
		userId: auth.user.id,
		kind: "withdraw",
		assetId: asset.id,
		amount: sellAmount.toFixed(2),
		title: `Redeemed from ${asset.name}`,
		subtitle: remaining <= 0.005 ? "Full position closed" : `Partial redemption · ${remaining.toFixed(2)} USD remaining`,
		agent: "SETTLEMENT",
	})

	return Response.json({ ok: true })
}

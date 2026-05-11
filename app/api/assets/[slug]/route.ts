import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { assets, holdings, users } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth/require-user"

export const runtime = "nodejs"

export async function GET(request: Request, ctx: { params: Promise<{ slug: string }> }) {
	const auth = await requireUser(request)
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const { slug } = await ctx.params
	const rows = await db
		.select({
			id: assets.id,
			slug: assets.slug,
			name: assets.name,
			category: assets.category,
			region: assets.region,
			description: assets.description,
			targetApy: assets.targetApy,
			risk: assets.risk,
			tenor: assets.tenor,
			minInvestment: assets.minInvestment,
			targetRaise: assets.targetRaise,
			currentRaised: assets.currentRaised,
			status: assets.status,
			highlights: assets.highlights,
			createdAt: assets.createdAt,
			ownerId: assets.ownerId,
			ownerName: users.displayName,
		})
		.from(assets)
		.leftJoin(users, eq(assets.ownerId, users.id))
		.where(eq(assets.slug, slug))
		.limit(1)

	if (rows.length === 0) {
		return Response.json({ ok: false, error: "Not found" }, { status: 404 })
	}

	const asset = rows[0]
	const myHolding = await db
		.select({ id: holdings.id, amount: holdings.amount, tokens: holdings.tokens })
		.from(holdings)
		.where(and(eq(holdings.assetId, asset.id), eq(holdings.userId, auth.user.id)))
		.limit(1)

	return Response.json({
		ok: true,
		asset,
		myHolding: myHolding[0] ?? null,
	})
}

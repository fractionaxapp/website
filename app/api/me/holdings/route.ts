import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { assets, holdings } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth/require-user"

export const runtime = "nodejs"

export async function GET(request: Request) {
	const auth = await requireUser(request)
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const rows = await db
		.select({
			id: holdings.id,
			amount: holdings.amount,
			tokens: holdings.tokens,
			createdAt: holdings.createdAt,
			goalId: holdings.goalId,
			asset: {
				id: assets.id,
				slug: assets.slug,
				name: assets.name,
				category: assets.category,
				region: assets.region,
				targetApy: assets.targetApy,
				risk: assets.risk,
				tenor: assets.tenor,
				status: assets.status,
			},
		})
		.from(holdings)
		.innerJoin(assets, eq(holdings.assetId, assets.id))
		.where(eq(holdings.userId, auth.user.id))
		.orderBy(desc(holdings.amount))

	return Response.json({ ok: true, holdings: rows })
}

import { desc, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { assets, holdings, users } from "@/lib/db/schema"
import { requireRole } from "@/lib/auth/require-user"

export const runtime = "nodejs"

export async function GET(request: Request) {
	const auth = await requireRole(request, "asset_owner")
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const ownedAssets = await db
		.select({ id: assets.id, name: assets.name })
		.from(assets)
		.where(eq(assets.ownerId, auth.user.id))

	if (ownedAssets.length === 0) {
		return Response.json({ ok: true, investors: [] })
	}

	const rows = await db
		.select({
			holdingId: holdings.id,
			amount: holdings.amount,
			tokens: holdings.tokens,
			createdAt: holdings.createdAt,
			investor: {
				id: users.id,
				displayName: users.displayName,
				email: users.email,
				walletAddress: users.walletAddress,
			},
			asset: {
				id: assets.id,
				name: assets.name,
			},
		})
		.from(holdings)
		.innerJoin(assets, eq(holdings.assetId, assets.id))
		.innerJoin(users, eq(holdings.userId, users.id))
		.where(inArray(holdings.assetId, ownedAssets.map((a) => a.id)))
		.orderBy(desc(holdings.amount))

	return Response.json({ ok: true, investors: rows })
}

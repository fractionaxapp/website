import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { assets, transactions } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth/require-user"

export const runtime = "nodejs"

export async function GET(request: Request) {
	const auth = await requireUser(request)
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const url = new URL(request.url)
	const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200)

	const rows = await db
		.select({
			id: transactions.id,
			kind: transactions.kind,
			amount: transactions.amount,
			title: transactions.title,
			subtitle: transactions.subtitle,
			agent: transactions.agent,
			meta: transactions.meta,
			createdAt: transactions.createdAt,
			asset: {
				id: assets.id,
				slug: assets.slug,
				name: assets.name,
			},
		})
		.from(transactions)
		.leftJoin(assets, eq(transactions.assetId, assets.id))
		.where(eq(transactions.userId, auth.user.id))
		.orderBy(desc(transactions.createdAt))
		.limit(limit)

	return Response.json({ ok: true, transactions: rows })
}

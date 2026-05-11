import { and, desc, eq, ne, or } from "drizzle-orm"
import { db } from "@/lib/db"
import { assets } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth/require-user"

export const runtime = "nodejs"

export async function GET(request: Request) {
	const auth = await requireUser(request)
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const rows = await db
		.select()
		.from(assets)
		.where(
			and(
				or(ne(assets.ownerId, auth.user.id), eq(assets.ownerId, auth.user.id) /* still show user-owned */),
				or(eq(assets.status, "live"), eq(assets.status, "fundraising")),
			),
		)
		.orderBy(desc(assets.currentRaised))

	const investable = rows.filter((r) => r.ownerId !== auth.user.id)
	return Response.json({ ok: true, assets: investable })
}

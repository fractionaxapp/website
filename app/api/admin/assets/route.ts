import { desc, eq, ne } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { assets, users } from "@/lib/db/schema"
import { isAdminAuthenticated } from "@/lib/admin/auth"

export const runtime = "nodejs"

export async function GET() {
	if (!(await isAdminAuthenticated())) {
		return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 })
	}

	const rows = await db
		.select({
			id: assets.id,
			slug: assets.slug,
			name: assets.name,
			category: assets.category,
			region: assets.region,
			status: assets.status,
			targetApy: assets.targetApy,
			targetRaise: assets.targetRaise,
			currentRaised: assets.currentRaised,
			createdAt: assets.createdAt,
			ownerName: users.displayName,
			ownerEmail: users.email,
		})
		.from(assets)
		.leftJoin(users, eq(assets.ownerId, users.id))
		.where(ne(assets.ownerId, 0))
		.orderBy(desc(assets.createdAt))

	return Response.json({ ok: true, assets: rows })
}

const patchSchema = z.object({
	id: z.number().int().positive(),
	status: z.enum(["draft", "in_review", "fundraising", "live", "closed"]),
})

export async function PATCH(request: Request) {
	if (!(await isAdminAuthenticated())) {
		return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 })
	}

	const parsed = patchSchema.safeParse(await request.json().catch(() => ({})))
	if (!parsed.success) {
		return Response.json({ ok: false, error: "Invalid input" }, { status: 400 })
	}

	const [updated] = await db
		.update(assets)
		.set({ status: parsed.data.status, updatedAt: new Date() })
		.where(eq(assets.id, parsed.data.id))
		.returning()

	if (!updated) return Response.json({ ok: false, error: "Not found" }, { status: 404 })
	return Response.json({ ok: true, asset: updated })
}

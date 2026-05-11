import { desc, eq, ne } from "drizzle-orm"
import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin/auth"
import { db } from "@/lib/db"
import { assets, users } from "@/lib/db/schema"
import { AssetsAdmin } from "./assets-admin"

export const dynamic = "force-dynamic"

export default async function AdminAssetsPage() {
	if (!(await isAdminAuthenticated())) {
		redirect("/admin/login")
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

	const serialized = rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))
	return <AssetsAdmin initial={serialized} />
}

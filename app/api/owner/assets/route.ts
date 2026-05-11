import { desc, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { assets } from "@/lib/db/schema"
import { requireRole } from "@/lib/auth/require-user"

export const runtime = "nodejs"

function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 60)
}

const createSchema = z.object({
	name: z.string().trim().min(3).max(255),
	category: z.string().trim().min(1).max(64),
	region: z.string().trim().max(64).optional(),
	description: z.string().trim().max(2000).optional(),
	targetApy: z.number().min(0).max(100).optional(),
	risk: z.enum(["Low", "Low-Med", "Medium", "Med-High", "High"]).optional(),
	tenor: z.string().trim().max(64).optional(),
	minInvestment: z.number().nonnegative().optional(),
	targetRaise: z.number().positive().optional(),
	highlights: z.array(z.string()).max(8).optional(),
})

export async function GET(request: Request) {
	const auth = await requireRole(request, "asset_owner")
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const rows = await db
		.select()
		.from(assets)
		.where(eq(assets.ownerId, auth.user.id))
		.orderBy(desc(assets.createdAt))

	return Response.json({ ok: true, assets: rows })
}

export async function POST(request: Request) {
	const auth = await requireRole(request, "asset_owner")
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const parsed = createSchema.safeParse(await request.json().catch(() => ({})))
	if (!parsed.success) {
		return Response.json({ ok: false, error: "Invalid input", details: parsed.error.issues }, { status: 400 })
	}

	const baseSlug = slugify(parsed.data.name)
	const slug = `${baseSlug}-${Date.now().toString(36)}`

	const [created] = await db
		.insert(assets)
		.values({
			slug,
			name: parsed.data.name,
			category: parsed.data.category,
			region: parsed.data.region ?? null,
			description: parsed.data.description ?? null,
			targetApy: parsed.data.targetApy?.toFixed(2),
			risk: parsed.data.risk ?? null,
			tenor: parsed.data.tenor ?? null,
			minInvestment: (parsed.data.minInvestment ?? 10).toFixed(2),
			targetRaise: parsed.data.targetRaise?.toFixed(2),
			highlights: parsed.data.highlights ?? [],
			status: "in_review",
			ownerId: auth.user.id,
		})
		.returning()

	return Response.json({ ok: true, asset: created })
}

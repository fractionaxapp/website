import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { assets, holdings } from "@/lib/db/schema"
import { requireRole } from "@/lib/auth/require-user"

export const runtime = "nodejs"

const updateSchema = z.object({
	name: z.string().trim().min(3).max(255).optional(),
	category: z.string().trim().min(1).max(64).optional(),
	region: z.string().trim().max(64).nullable().optional(),
	description: z.string().trim().max(2000).nullable().optional(),
	targetApy: z.number().min(0).max(100).nullable().optional(),
	risk: z.enum(["Low", "Low-Med", "Medium", "Med-High", "High"]).nullable().optional(),
	tenor: z.string().trim().max(64).nullable().optional(),
	minInvestment: z.number().nonnegative().optional(),
	targetRaise: z.number().positive().nullable().optional(),
	highlights: z.array(z.string()).max(8).optional(),
})

export async function GET(request: Request, ctx: { params: Promise<{ slug: string }> }) {
	const auth = await requireRole(request, "asset_owner")
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const { slug } = await ctx.params
	const [asset] = await db
		.select()
		.from(assets)
		.where(and(eq(assets.slug, slug), eq(assets.ownerId, auth.user.id)))
		.limit(1)

	if (!asset) return Response.json({ ok: false, error: "Not found" }, { status: 404 })

	const investorRows = await db
		.select({
			id: holdings.id,
			userId: holdings.userId,
			amount: holdings.amount,
			tokens: holdings.tokens,
			createdAt: holdings.createdAt,
		})
		.from(holdings)
		.where(eq(holdings.assetId, asset.id))

	return Response.json({ ok: true, asset, holdings: investorRows })
}

export async function PATCH(request: Request, ctx: { params: Promise<{ slug: string }> }) {
	const auth = await requireRole(request, "asset_owner")
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const parsed = updateSchema.safeParse(await request.json().catch(() => ({})))
	if (!parsed.success) {
		return Response.json({ ok: false, error: "Invalid input", details: parsed.error.issues }, { status: 400 })
	}

	const { slug } = await ctx.params
	const d = parsed.data
	const update: Record<string, unknown> = { updatedAt: new Date() }
	if (d.name !== undefined) update.name = d.name
	if (d.category !== undefined) update.category = d.category
	if (d.region !== undefined) update.region = d.region
	if (d.description !== undefined) update.description = d.description
	if (d.targetApy !== undefined) update.targetApy = d.targetApy == null ? null : d.targetApy.toFixed(2)
	if (d.risk !== undefined) update.risk = d.risk
	if (d.tenor !== undefined) update.tenor = d.tenor
	if (d.minInvestment !== undefined) update.minInvestment = d.minInvestment.toFixed(2)
	if (d.targetRaise !== undefined) update.targetRaise = d.targetRaise == null ? null : d.targetRaise.toFixed(2)
	if (d.highlights !== undefined) update.highlights = d.highlights

	const [updated] = await db
		.update(assets)
		.set(update)
		.where(and(eq(assets.slug, slug), eq(assets.ownerId, auth.user.id)))
		.returning()

	if (!updated) return Response.json({ ok: false, error: "Not found" }, { status: 404 })
	return Response.json({ ok: true, asset: updated })
}

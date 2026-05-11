import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { verifyPrivyToken } from "@/lib/auth/privy"

export const runtime = "nodejs"

const bodySchema = z.object({
	role: z.enum(["investor", "asset_owner"]),
})

export async function POST(request: Request) {
	const auth = request.headers.get("authorization")
	const token = auth?.toLowerCase().startsWith("bearer ") ? auth.slice(7) : null
	if (!token) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 })

	let claims
	try {
		claims = await verifyPrivyToken(token)
	} catch {
		return Response.json({ ok: false, error: "Invalid token" }, { status: 401 })
	}

	const parsed = bodySchema.safeParse(await request.json().catch(() => ({})))
	if (!parsed.success) {
		return Response.json({ ok: false, error: "Invalid role" }, { status: 400 })
	}

	const updated = await db
		.update(users)
		.set({ role: parsed.data.role, updatedAt: new Date() })
		.where(eq(users.privyId, claims.userId))
		.returning()

	if (updated.length === 0) {
		return Response.json({ ok: false, error: "User not found" }, { status: 404 })
	}

	return Response.json({ ok: true, user: updated[0] })
}

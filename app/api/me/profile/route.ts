import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth/require-user"

export const runtime = "nodejs"

const bodySchema = z.object({
	displayName: z.string().trim().min(1).max(120).nullable().optional(),
})

export async function PATCH(request: Request) {
	const auth = await requireUser(request)
	if (!auth.ok) return Response.json({ ok: false, error: auth.error }, { status: auth.status })

	const parsed = bodySchema.safeParse(await request.json().catch(() => ({})))
	if (!parsed.success) {
		return Response.json({ ok: false, error: "Invalid input" }, { status: 400 })
	}

	const update: Record<string, unknown> = { updatedAt: new Date() }
	if (parsed.data.displayName !== undefined) update.displayName = parsed.data.displayName

	const [updated] = await db
		.update(users)
		.set(update)
		.where(eq(users.id, auth.user.id))
		.returning()

	return Response.json({ ok: true, user: updated })
}

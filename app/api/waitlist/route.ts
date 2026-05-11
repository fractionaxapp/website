import { z } from "zod"
import { db } from "@/lib/db"
import { waitlist } from "@/lib/db/schema"

export const runtime = "nodejs"

const bodySchema = z.object({
	email: z.string().trim().toLowerCase().email().max(255),
	source: z.string().trim().max(64).optional(),
})

export async function POST(request: Request) {
	let parsed
	try {
		const json = await request.json()
		parsed = bodySchema.safeParse(json)
	} catch {
		return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
	}

	if (!parsed.success) {
		return Response.json(
			{ ok: false, error: "Invalid input", details: parsed.error.issues },
			{ status: 400 },
		)
	}

	const { email, source } = parsed.data
	const userAgent = request.headers.get("user-agent") ?? null
	const referrer = request.headers.get("referer") ?? null

	try {
		const inserted = await db
			.insert(waitlist)
			.values({ email, source: source ?? null, userAgent, referrer })
			.onConflictDoNothing({ target: waitlist.email })
			.returning({ id: waitlist.id })

		return Response.json({
			ok: true,
			alreadySubscribed: inserted.length === 0,
		})
	} catch (err) {
		console.error("[waitlist] insert failed", err)
		return Response.json(
			{ ok: false, error: "Could not save your email. Please try again." },
			{ status: 500 },
		)
	}
}

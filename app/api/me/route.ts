import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { getPrivyUser, verifyPrivyToken } from "@/lib/auth/privy"

export const runtime = "nodejs"

function bearerToken(req: Request): string | null {
	const auth = req.headers.get("authorization")
	if (!auth) return null
	const [scheme, token] = auth.split(" ")
	if (scheme?.toLowerCase() !== "bearer" || !token) return null
	return token
}

export async function GET(request: Request) {
	const token = bearerToken(request)
	if (!token) {
		return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 })
	}

	let claims
	try {
		claims = await verifyPrivyToken(token)
	} catch {
		return Response.json({ ok: false, error: "Invalid token" }, { status: 401 })
	}

	const privyId = claims.userId

	const existing = await db.select().from(users).where(eq(users.privyId, privyId)).limit(1)

	if (existing.length > 0) {
		return Response.json({ ok: true, user: existing[0] })
	}

	let email: string | null = null
	let walletAddress: string | null = null
	let displayName: string | null = null
	try {
		const privyUser = await getPrivyUser(privyId)
		email = privyUser.email?.address ?? privyUser.google?.email ?? null
		const wallet = privyUser.wallet?.address ?? privyUser.linkedAccounts.find((a) => a.type === "wallet")
		walletAddress = typeof wallet === "string" ? wallet : (wallet as { address?: string } | undefined)?.address ?? null
		displayName = privyUser.google?.name ?? null
	} catch {
		// continue with nulls
	}

	const inserted = await db
		.insert(users)
		.values({ privyId, email, walletAddress, displayName, role: null })
		.returning()

	return Response.json({ ok: true, user: inserted[0] })
}

import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users, type User } from "@/lib/db/schema"
import { verifyPrivyToken } from "@/lib/auth/privy"

export type AuthResult = { ok: true; user: User } | { ok: false; status: number; error: string }

function bearer(request: Request): string | null {
	const h = request.headers.get("authorization")
	if (!h) return null
	const [scheme, token] = h.split(" ")
	if (scheme?.toLowerCase() !== "bearer" || !token) return null
	return token
}

export async function requireUser(request: Request): Promise<AuthResult> {
	const token = bearer(request)
	if (!token) return { ok: false, status: 401, error: "Unauthorized" }

	let claims
	try {
		claims = await verifyPrivyToken(token)
	} catch {
		return { ok: false, status: 401, error: "Invalid token" }
	}

	const rows = await db.select().from(users).where(eq(users.privyId, claims.userId)).limit(1)
	if (rows.length === 0) {
		return { ok: false, status: 404, error: "User not found" }
	}
	return { ok: true, user: rows[0] }
}

export async function requireRole(
	request: Request,
	role: "investor" | "asset_owner",
): Promise<AuthResult> {
	const result = await requireUser(request)
	if (!result.ok) return result
	if (result.user.role !== role) {
		return { ok: false, status: 403, error: `Forbidden: requires ${role}` }
	}
	return result
}

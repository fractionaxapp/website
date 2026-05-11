import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { getPrivyUser, isLikelyEthereumAddress, pickSolanaAddress, verifyPrivyToken } from "@/lib/auth/privy"

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
		const stored = existing[0]
		// Self-heal: if we stored a non-Solana address, replace with the user's
		// Solana wallet from Privy. If no Solana wallet exists, null it out
		// rather than show an EVM address on a Solana product.
		if (isLikelyEthereumAddress(stored.walletAddress)) {
			try {
				const privyUser = await getPrivyUser(privyId)
				const solanaAddr = pickSolanaAddress(privyUser)
				if (solanaAddr !== stored.walletAddress) {
					const [updated] = await db
						.update(users)
						.set({ walletAddress: solanaAddr, updatedAt: new Date() })
						.where(eq(users.privyId, privyId))
						.returning()
					return Response.json({ ok: true, user: updated })
				}
			} catch {
				// fall through with stored row
			}
		}
		return Response.json({ ok: true, user: stored })
	}

	let email: string | null = null
	let walletAddress: string | null = null
	let displayName: string | null = null
	try {
		const privyUser = await getPrivyUser(privyId)
		email = privyUser.email?.address ?? privyUser.google?.email ?? null
		walletAddress = pickSolanaAddress(privyUser)
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

import { PrivyClient, type User as PrivyUser } from "@privy-io/server-auth"

let cached: PrivyClient | null = null

export function getPrivyClient(): PrivyClient {
	if (cached) return cached
	const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
	const appSecret = process.env.PRIVY_APP_SECRET
	if (!appId || !appSecret) {
		throw new Error("NEXT_PUBLIC_PRIVY_APP_ID and PRIVY_APP_SECRET must be set")
	}
	cached = new PrivyClient(appId, appSecret)
	return cached
}

export async function verifyPrivyToken(token: string) {
	const privy = getPrivyClient()
	return privy.verifyAuthToken(token)
}

export async function getPrivyUser(userId: string) {
	const privy = getPrivyClient()
	return privy.getUser(userId)
}

/**
 * Pull the user's Solana wallet from Privy. Prefers external (Phantom/Solflare)
 * over embedded. Falls back to null if no Solana wallet exists.
 */
export function pickSolanaAddress(privyUser: PrivyUser): string | null {
	const walletAccounts = privyUser.linkedAccounts.filter(
		(a): a is Extract<typeof a, { type: "wallet" }> => a.type === "wallet",
	)
	const solanaWallets = walletAccounts.filter(
		(w) => (w as { chainType?: string }).chainType === "solana",
	)
	if (solanaWallets.length === 0) return null
	// Prefer external/connected wallets (Phantom, Solflare) over embedded
	const external = solanaWallets.find(
		(w) => (w as { walletClientType?: string }).walletClientType !== "privy",
	)
	const chosen = external ?? solanaWallets[0]
	return (chosen as { address?: string }).address ?? null
}

export function isLikelyEthereumAddress(addr: string | null | undefined): boolean {
	return typeof addr === "string" && /^0x[a-fA-F0-9]{40}$/.test(addr)
}

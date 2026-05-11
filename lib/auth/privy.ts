import { PrivyClient } from "@privy-io/server-auth"

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

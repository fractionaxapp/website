"use client"

import { usePrivy } from "@privy-io/react-auth"
import { isPrivyConfigured } from "@/components/modules/privy/provider"

type Stub = {
	ready: boolean
	authenticated: boolean
	login: () => void
	logout: () => Promise<void>
	getAccessToken: () => Promise<string | null>
	configured: boolean
}

const STUB: Stub = {
	ready: true,
	authenticated: false,
	login: () => {
		if (typeof window !== "undefined") {
			alert("Authentication is not configured yet. Set NEXT_PUBLIC_PRIVY_APP_ID in .env.local.")
		}
	},
	logout: async () => undefined,
	getAccessToken: async () => null,
	configured: false,
}

// `isPrivyConfigured` is a build-time constant, so the hook branch is stable —
// React will only ever take one of the two paths per environment.
/* eslint-disable react-hooks/rules-of-hooks */
export function useOptionalPrivy(): Stub {
	if (!isPrivyConfigured) return STUB
	const p = usePrivy()
	return {
		ready: p.ready,
		authenticated: p.authenticated,
		login: () => p.login(),
		logout: async () => {
			await p.logout()
		},
		getAccessToken: () => p.getAccessToken(),
		configured: true,
	}
}
/* eslint-enable react-hooks/rules-of-hooks */

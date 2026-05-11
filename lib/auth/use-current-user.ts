"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import type { User as DbUser } from "@/lib/db/schema"

type State =
	| { status: "loading" }
	| { status: "unauthenticated" }
	| { status: "authenticated"; user: DbUser }
	| { status: "error"; error: string }

export function useCurrentUser(): State & { reload: () => void } {
	const { ready, authenticated, getAccessToken, user: privyUser } = usePrivy()
	const [state, setState] = useState<State>({ status: "loading" })
	const [reloadKey, setReloadKey] = useState(0)

	useEffect(() => {
		if (!ready) return
		if (!authenticated) {
			setState({ status: "unauthenticated" })
			return
		}
		let cancelled = false

		async function load() {
			try {
				const token = await getAccessToken()
				if (!token) {
					if (!cancelled) setState({ status: "unauthenticated" })
					return
				}
				const res = await fetch("/api/me", {
					headers: { Authorization: `Bearer ${token}` },
				})
				const data = await res.json()
				if (!res.ok || !data.ok) {
					if (!cancelled) setState({ status: "error", error: data?.error ?? "Failed to load" })
					return
				}
				if (!cancelled) setState({ status: "authenticated", user: data.user })
			} catch (err) {
				if (!cancelled) setState({ status: "error", error: (err as Error).message })
			}
		}
		setState({ status: "loading" })
		load()
		return () => {
			cancelled = true
		}
	}, [ready, authenticated, getAccessToken, reloadKey, privyUser?.id])

	return { ...state, reload: () => setReloadKey((k) => k + 1) }
}

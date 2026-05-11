"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"

export type Fetcher = (path: string, init?: RequestInit) => Promise<Response>

export function useApi() {
	const { getAccessToken, ready, authenticated } = usePrivy()

	const fetcher: Fetcher = async (path, init = {}) => {
		const token = await getAccessToken()
		const headers = new Headers(init.headers)
		if (token) headers.set("Authorization", `Bearer ${token}`)
		if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json")
		return fetch(path, { ...init, headers })
	}

	return { fetcher, ready, authenticated }
}

export function useFetch<T>(path: string | null): {
	data: T | null
	loading: boolean
	error: string | null
	reload: () => void
} {
	const { fetcher, ready, authenticated } = useApi()
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [reloadKey, setReloadKey] = useState(0)

	useEffect(() => {
		if (!path || !ready || !authenticated) {
			setLoading(false)
			return
		}
		let cancelled = false
		setLoading(true)
		setError(null)
		fetcher(path)
			.then((r) => r.json())
			.then((json) => {
				if (cancelled) return
				if (!json.ok) {
					setError(json.error ?? "Failed")
				} else {
					setData(json as T)
				}
			})
			.catch((e) => {
				if (!cancelled) setError((e as Error).message)
			})
			.finally(() => {
				if (!cancelled) setLoading(false)
			})
		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [path, ready, authenticated, reloadKey])

	return { data, loading, error, reload: () => setReloadKey((k) => k + 1) }
}

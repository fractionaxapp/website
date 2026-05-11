"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function LogoutButton() {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	async function logout() {
		setLoading(true)
		try {
			await fetch("/api/admin/logout", { method: "POST" })
			router.replace("/admin/login")
			router.refresh()
		} catch {
			setLoading(false)
		}
	}

	return (
		<button
			type="button"
			onClick={logout}
			disabled={loading}
			className="h-9 rounded-md border border-border/60 px-3 text-xs font-medium hover:bg-card/60 transition-colors disabled:opacity-60"
		>
			{loading ? "Signing out…" : "Sign out"}
		</button>
	)
}

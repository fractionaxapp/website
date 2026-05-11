"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginForm({ nextUrl }: { nextUrl: string }) {
	const router = useRouter()
	const [password, setPassword] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (submitting) return
		setSubmitting(true)
		setError(null)
		try {
			const res = await fetch("/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok || !data.ok) {
				setError(typeof data?.error === "string" ? data.error : "Sign-in failed")
				setSubmitting(false)
				return
			}
			router.replace(nextUrl)
			router.refresh()
		} catch {
			setError("Network error. Please try again.")
			setSubmitting(false)
		}
	}

	return (
		<form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
			<label className="flex flex-col gap-1.5 text-sm">
				<span className="text-muted-foreground text-xs uppercase tracking-wider font-mono">Password</span>
				<input
					type="password"
					required
					autoFocus
					autoComplete="current-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={submitting}
					className="h-11 rounded-md border border-border/60 bg-card/50 px-3 text-sm outline-none focus:border-foreground/40 disabled:opacity-50"
				/>
			</label>
			{error && <div className="text-xs text-destructive">{error}</div>}
			<button
				type="submit"
				disabled={submitting || password.length === 0}
				className="h-11 mt-1 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
			>
				{submitting ? "Signing in…" : "Sign in"}
			</button>
		</form>
	)
}

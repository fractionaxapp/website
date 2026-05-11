"use client"

import { ArrowRight, Building2, Loader2, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { isPrivyConfigured } from "@/components/modules/privy/provider"
import { useCurrentUser } from "@/lib/auth/use-current-user"

type Role = "investor" | "asset_owner"

export default function OnboardingPage() {
	if (!isPrivyConfigured) {
		return (
			<main className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
				<h1 className="font-display text-2xl">Auth not configured</h1>
				<p className="text-sm text-muted-foreground max-w-sm">
					Add <code className="font-mono text-foreground/80">NEXT_PUBLIC_PRIVY_APP_ID</code> and{" "}
					<code className="font-mono text-foreground/80">PRIVY_APP_SECRET</code> to{" "}
					<code className="font-mono text-foreground/80">.env.local</code>.
				</p>
			</main>
		)
	}
	return <OnboardingInner />
}

function OnboardingInner() {
	const router = useRouter()
	const { ready, authenticated, getAccessToken, login } = usePrivy()
	const state = useCurrentUser()
	const [submitting, setSubmitting] = useState<Role | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (state.status === "authenticated" && state.user.role) {
			router.replace(state.user.role === "investor" ? "/app" : "/owner")
		}
	}, [state, router])

	async function choose(role: Role) {
		setError(null)
		setSubmitting(role)
		try {
			const token = await getAccessToken()
			if (!token) throw new Error("No session")
			const res = await fetch("/api/me/role", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ role }),
			})
			const data = await res.json()
			if (!res.ok || !data.ok) throw new Error(data?.error ?? "Failed")
			router.replace(role === "investor" ? "/app" : "/owner")
		} catch (err) {
			setError((err as Error).message)
			setSubmitting(null)
		}
	}

	if (!ready || state.status === "loading") {
		return (
			<main className="min-h-screen flex items-center justify-center">
				<Loader2 className="size-5 animate-spin text-muted-foreground" />
			</main>
		)
	}

	if (!authenticated || state.status === "unauthenticated") {
		return (
			<main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
				<h1 className="font-display text-2xl">Sign in to continue</h1>
				<button
					type="button"
					onClick={() => login()}
					className="h-10 rounded-full bg-foreground text-background px-5 text-sm font-medium hover:opacity-90"
				>
					Sign in
				</button>
			</main>
		)
	}

	return (
		<main className="min-h-screen flex items-center justify-center p-6 lg:p-10">
			<div className="w-full max-w-3xl">
				<div className="text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 backdrop-blur px-3 py-1.5 text-xs">
						<span className="size-1.5 rounded-full bg-primary animate-pulse-soft" />
						<span className="text-muted-foreground">One last step</span>
					</div>
					<h1 className="font-display mt-6 text-4xl lg:text-5xl font-medium tracking-tight">
						How will you use Fractionax?
					</h1>
					<p className="mt-3 text-muted-foreground text-balance">
						Pick the workspace that fits you. You can request access to the other one later.
					</p>
				</div>

				<div className="mt-10 grid sm:grid-cols-2 gap-4">
					<RoleCard
						title="Invest"
						subtitle="I want my AI to put my money to work"
						bullets={[
							"Auto-allocated RWA portfolio",
							"Live agent activity feed",
							"Deposits, withdrawals, and tax docs",
						]}
						icon={<TrendingUp className="size-5" />}
						loading={submitting === "investor"}
						disabled={submitting !== null}
						onClick={() => choose("investor")}
					/>
					<RoleCard
						title="List my assets"
						subtitle="I'm an operator with RWAs to tokenize"
						bullets={[
							"Submit and manage asset listings",
							"Track fundraising and cap table",
							"Distribute payouts on-chain",
						]}
						icon={<Building2 className="size-5" />}
						loading={submitting === "asset_owner"}
						disabled={submitting !== null}
						onClick={() => choose("asset_owner")}
					/>
				</div>

				{error && <div className="mt-6 text-center text-xs text-destructive">{error}</div>}
			</div>
		</main>
	)
}

function RoleCard({
	title,
	subtitle,
	bullets,
	icon,
	loading,
	disabled,
	onClick,
}: {
	title: string
	subtitle: string
	bullets: string[]
	icon: React.ReactNode
	loading: boolean
	disabled: boolean
	onClick: () => void
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className="group relative text-left rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-6 hover:border-foreground/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
		>
			<div className="flex items-start justify-between">
				<div className="inline-flex items-center justify-center size-10 rounded-xl bg-primary/15 text-primary">
					{icon}
				</div>
				<ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
			</div>
			<div className="mt-5">
				<div className="text-lg font-medium">{title}</div>
				<div className="text-sm text-muted-foreground mt-0.5">{subtitle}</div>
			</div>
			<ul className="mt-5 space-y-2">
				{bullets.map((b) => (
					<li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
						<span className="mt-1.5 size-1 rounded-full bg-primary flex-shrink-0" />
						{b}
					</li>
				))}
			</ul>
			{loading && (
				<div className="absolute inset-0 rounded-2xl bg-background/60 backdrop-blur-sm flex items-center justify-center">
					<Loader2 className="size-5 animate-spin text-foreground" />
				</div>
			)}
		</button>
	)
}

"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { isPrivyConfigured } from "@/components/modules/privy/provider"
import { useCurrentUser } from "@/lib/auth/use-current-user"
import type { User as DbUser } from "@/lib/db/schema"
import type { ReactNode } from "react"

type Role = "investor" | "asset_owner"

const HOME_FOR: Record<Role, string> = {
	investor: "/app",
	asset_owner: "/owner",
}

const UserContext = createContext<DbUser | null>(null)

export function useDashboardUser(): DbUser {
	const u = useContext(UserContext)
	if (!u) throw new Error("useDashboardUser must be used inside DashboardGate")
	return u
}

export function DashboardGate({
	role,
	children,
}: {
	role: Role
	children: ReactNode
}) {
	if (!isPrivyConfigured) {
		return <SetupRequired />
	}
	return <DashboardGateInner role={role}>{children}</DashboardGateInner>
}

function SetupRequired() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
			<h1 className="font-display text-2xl">Auth not configured</h1>
			<p className="text-sm text-muted-foreground max-w-sm">
				Add <code className="font-mono text-foreground/80">NEXT_PUBLIC_PRIVY_APP_ID</code> and{" "}
				<code className="font-mono text-foreground/80">PRIVY_APP_SECRET</code> to <code className="font-mono text-foreground/80">.env.local</code>, then restart the dev server.
			</p>
		</div>
	)
}

function DashboardGateInner({
	role,
	children,
}: {
	role: Role
	children: ReactNode
}) {
	const router = useRouter()
	const { ready, authenticated, login } = usePrivy()
	const state = useCurrentUser()

	useEffect(() => {
		if (!ready) return
		if (state.status === "authenticated") {
			if (state.user.role === null) {
				router.replace("/onboarding")
				return
			}
			if (state.user.role !== role) {
				router.replace(HOME_FOR[state.user.role])
			}
		}
	}, [ready, state, role, router])

	if (!ready || state.status === "loading") {
		return <CenterSpinner />
	}

	if (!authenticated || state.status === "unauthenticated") {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
				<h1 className="font-display text-2xl">Sign in to continue</h1>
				<p className="text-sm text-muted-foreground">Connect with Phantom or sign in with email.</p>
				<button
					type="button"
					onClick={() => login()}
					className="h-10 rounded-full bg-foreground text-background px-5 text-sm font-medium hover:opacity-90"
				>
					Sign in
				</button>
			</div>
		)
	}

	if (state.status === "error") {
		return (
			<div className="min-h-screen flex items-center justify-center p-6 text-sm text-destructive">
				{state.error}
			</div>
		)
	}

	if (state.user.role !== role) {
		return <CenterSpinner />
	}

	return <UserContext.Provider value={state.user}>{children}</UserContext.Provider>
}

function CenterSpinner() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<Loader2 className="size-5 animate-spin text-muted-foreground" />
		</div>
	)
}

"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { DashboardGate } from "./gate"
import { investorNav, ownerNav } from "./nav-config"

export function DashboardShell({
	role,
	children,
}: {
	role: "investor" | "asset_owner"
	children: ReactNode
}) {
	const groups = role === "investor" ? investorNav : ownerNav
	return (
		<DashboardGate role={role}>
			<div className="flex min-h-screen bg-background">
				<Sidebar groups={groups} />
				<div className="flex-1 min-w-0 flex flex-col">
					<Topbar />
					<main className="flex-1">{children}</main>
				</div>
			</div>
		</DashboardGate>
	)
}

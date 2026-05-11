"use client"

import type { ReactNode } from "react"
import { Sidebar, type SidebarGroup } from "./sidebar"
import { Topbar } from "./topbar"
import { DashboardGate } from "./gate"

export function DashboardShell({
	role,
	groups,
	sidebarFooter,
	children,
}: {
	role: "investor" | "asset_owner"
	groups: SidebarGroup[]
	sidebarFooter?: ReactNode
	children: ReactNode
}) {
	return (
		<DashboardGate role={role}>
			<div className="flex min-h-screen bg-background">
				<Sidebar groups={groups} footer={sidebarFooter} />
				<div className="flex-1 min-w-0 flex flex-col">
					<Topbar />
					<main className="flex-1">{children}</main>
				</div>
			</div>
		</DashboardGate>
	)
}

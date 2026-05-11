import type { Metadata } from "next"
import type { ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard/shell"

export const metadata: Metadata = {
	title: "Operator · Fractionax",
	robots: { index: false, follow: false },
}

export default function OwnerLayout({ children }: { children: ReactNode }) {
	return <DashboardShell role="asset_owner">{children}</DashboardShell>
}

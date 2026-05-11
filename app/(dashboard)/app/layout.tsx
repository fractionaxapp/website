import type { Metadata } from "next"
import type { ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard/shell"

export const metadata: Metadata = {
	title: "Portfolio · Fractionax",
	robots: { index: false, follow: false },
}

export default function InvestorLayout({ children }: { children: ReactNode }) {
	return <DashboardShell role="investor">{children}</DashboardShell>
}

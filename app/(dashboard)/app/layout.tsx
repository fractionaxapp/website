import {
	Activity,
	Bot,
	Compass,
	FileText,
	LayoutDashboard,
	Settings,
	Wallet,
	Briefcase,
} from "lucide-react"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import type { SidebarGroup } from "@/components/dashboard/sidebar"

export const metadata: Metadata = {
	title: "Portfolio · Fractionax",
	robots: { index: false, follow: false },
}

const groups: SidebarGroup[] = [
	{
		title: "Overview",
		items: [
			{ label: "Portfolio", href: "/app", icon: LayoutDashboard },
			{ label: "Holdings", href: "/app/holdings", icon: Briefcase },
			{ label: "Activity", href: "/app/activity", icon: Activity },
		],
	},
	{
		title: "Grow",
		items: [
			{ label: "Discover", href: "/app/discover", icon: Compass, badge: "New" },
			{ label: "Wallet", href: "/app/wallet", icon: Wallet },
		],
	},
	{
		title: "Workspace",
		items: [
			{ label: "AI Agents", href: "/app/agents", icon: Bot },
			{ label: "Documents", href: "/app/documents", icon: FileText },
			{ label: "Settings", href: "/app/settings", icon: Settings },
		],
	},
]

export default function InvestorLayout({ children }: { children: ReactNode }) {
	return <DashboardShell role="investor" groups={groups}>{children}</DashboardShell>
}

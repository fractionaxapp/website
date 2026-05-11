import {
	Banknote,
	FileText,
	LayoutDashboard,
	Package,
	Settings,
	Sparkles,
	Users,
} from "lucide-react"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import type { SidebarGroup } from "@/components/dashboard/sidebar"

export const metadata: Metadata = {
	title: "Operator · Fractionax",
	robots: { index: false, follow: false },
}

const groups: SidebarGroup[] = [
	{
		title: "Workspace",
		items: [
			{ label: "Overview", href: "/owner", icon: LayoutDashboard },
			{ label: "Assets", href: "/owner/assets", icon: Package },
			{ label: "Fundraising", href: "/owner/fundraising", icon: Sparkles },
		],
	},
	{
		title: "Capital",
		items: [
			{ label: "Investors", href: "/owner/investors", icon: Users },
			{ label: "Payouts", href: "/owner/payouts", icon: Banknote },
		],
	},
	{
		title: "Operate",
		items: [
			{ label: "Documents", href: "/owner/documents", icon: FileText },
			{ label: "Organization", href: "/owner/settings", icon: Settings },
		],
	},
]

export default function OwnerLayout({ children }: { children: ReactNode }) {
	return <DashboardShell role="asset_owner" groups={groups}>{children}</DashboardShell>
}

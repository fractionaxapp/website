"use client"

import {
	Activity,
	Banknote,
	Bot,
	Briefcase,
	Compass,
	FileText,
	LayoutDashboard,
	Package,
	Settings,
	Sparkles,
	Users,
	Wallet,
} from "lucide-react"
import type { SidebarGroup } from "./sidebar"

export const investorNav: SidebarGroup[] = [
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

export const ownerNav: SidebarGroup[] = [
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

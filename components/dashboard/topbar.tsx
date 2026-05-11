"use client"

import { Bell, Command, LogOut, Moon, Search, Settings, Sun, User as UserIcon } from "lucide-react"
import { usePrivy } from "@privy-io/react-auth"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useDashboardUser } from "@/components/dashboard/gate"

export function Topbar() {
	const user = useDashboardUser()
	const { logout } = usePrivy()
	const [menuOpen, setMenuOpen] = useState(false)

	const initials = (user.displayName || user.email || user.walletAddress || "U")
		.replace(/[^A-Za-z0-9]/g, "")
		.slice(0, 2)
		.toUpperCase()

	const label = user.displayName || user.email || (user.walletAddress ? truncate(user.walletAddress) : "Account")

	return (
		<header className="sticky top-0 z-30 h-14 border-b border-border/60 bg-background/80 backdrop-blur flex items-center px-4 lg:px-6 gap-3">
			<div className="flex-1 max-w-md">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search assets, transactions, agents…"
						className="w-full h-9 pl-9 pr-12 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30 placeholder:text-muted-foreground/70"
					/>
					<kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">
						<Command className="size-2.5" />K
					</kbd>
				</div>
			</div>

			<div className="ml-auto flex items-center gap-1">
				<button className="size-9 inline-flex items-center justify-center rounded-md hover:bg-foreground/[0.04] text-muted-foreground hover:text-foreground transition-colors relative">
					<Bell className="size-4" />
					<span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" />
				</button>
				<TopbarThemeToggle />
				<div className="relative">
					<button
						type="button"
						onClick={() => setMenuOpen((v) => !v)}
						onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
						className="flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-md hover:bg-foreground/[0.04] transition-colors"
					>
						<div className="size-7 rounded-md bg-primary/15 text-primary text-xs font-medium inline-flex items-center justify-center">
							{initials}
						</div>
						<span className="text-xs font-medium hidden sm:inline">{label}</span>
					</button>
					{menuOpen && (
						<div className="absolute right-0 top-full mt-1.5 w-56 rounded-lg border border-border/60 bg-popover/95 backdrop-blur shadow-lg overflow-hidden z-40">
							<div className="px-3 py-2.5 border-b border-border/40">
								<div className="text-xs font-medium truncate">{label}</div>
								<div className="text-[10px] text-muted-foreground capitalize mt-0.5">
									{user.role?.replace("_", " ")}
								</div>
							</div>
							<div className="py-1">
								<MenuItem icon={<UserIcon className="size-3.5" />} label="Profile" />
								<MenuItem icon={<Settings className="size-3.5" />} label="Settings" />
							</div>
							<div className="py-1 border-t border-border/40">
								<button
									type="button"
									onMouseDown={(e) => {
										e.preventDefault()
										logout()
									}}
									className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
								>
									<LogOut className="size-3.5" />
									Sign out
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	)
}

function TopbarThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	if (!mounted) return <div className="size-9" />
	const isDark = resolvedTheme === "dark"
	return (
		<button
			type="button"
			aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="size-9 inline-flex items-center justify-center rounded-md hover:bg-foreground/[0.04] text-muted-foreground hover:text-foreground transition-colors"
		>
			{isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
		</button>
	)
}

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
	return (
		<button
			type="button"
			className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
		>
			{icon}
			{label}
		</button>
	)
}

function truncate(s: string) {
	if (s.length <= 12) return s
	return `${s.slice(0, 5)}…${s.slice(-4)}`
}

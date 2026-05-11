"use client"

import { Bell, Check, Command, LogOut, Moon, Search, Settings, Sun, User as UserIcon } from "lucide-react"
import { usePrivy } from "@privy-io/react-auth"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDashboardUser } from "@/components/dashboard/gate"
import { useFetch } from "@/lib/api/client"
import { CommandPalette } from "./command-palette"

type TxRow = {
	id: number
	kind: string
	amount: string | null
	title: string
	subtitle: string | null
	createdAt: string
}

export function Topbar() {
	const user = useDashboardUser()
	const { logout } = usePrivy()
	const router = useRouter()
	const [menuOpen, setMenuOpen] = useState(false)
	const [notifOpen, setNotifOpen] = useState(false)
	const [paletteOpen, setPaletteOpen] = useState(false)

	const notifRes = useFetch<{ ok: true; transactions: TxRow[] }>(notifOpen ? "/api/me/transactions?limit=8" : null)

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault()
				setPaletteOpen(true)
			}
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [])

	const initials = (user.displayName || user.email || user.walletAddress || "U")
		.replace(/[^A-Za-z0-9]/g, "")
		.slice(0, 2)
		.toUpperCase()

	const label = user.displayName || user.email || (user.walletAddress ? truncate(user.walletAddress) : "Account")
	const isInvestor = user.role === "investor"

	return (
		<>
			<header className="sticky top-0 z-30 h-14 border-b border-border/60 bg-background/80 backdrop-blur flex items-center px-4 lg:px-6 gap-3">
				<div className="flex-1 max-w-md">
					<button
						type="button"
						onClick={() => setPaletteOpen(true)}
						className="w-full h-9 pl-3 pr-12 text-sm bg-card/60 border border-border/40 rounded-md outline-none hover:border-foreground/30 transition-colors flex items-center gap-2 text-muted-foreground/70 relative"
					>
						<Search className="size-3.5" />
						<span>Search assets, holdings, activity…</span>
						<kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">
							<Command className="size-2.5" />K
						</kbd>
					</button>
				</div>

				<div className="ml-auto flex items-center gap-1">
					<div className="relative">
						<button
							type="button"
							onClick={() => setNotifOpen((v) => !v)}
							onBlur={() => setTimeout(() => setNotifOpen(false), 200)}
							className="size-9 inline-flex items-center justify-center rounded-md hover:bg-foreground/[0.04] text-muted-foreground hover:text-foreground transition-colors relative"
						>
							<Bell className="size-4" />
							<span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" />
						</button>
						{notifOpen && (
							<div
								className="absolute right-0 top-full mt-1.5 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-border/60 bg-popover/95 backdrop-blur shadow-lg overflow-hidden z-40"
								onMouseDown={(e) => e.preventDefault()}
							>
								<div className="px-3 py-2.5 border-b border-border/40 flex items-center justify-between">
									<span className="text-xs font-medium">Recent activity</span>
									{isInvestor && (
										<Link href="/app/activity" className="text-[10px] text-muted-foreground hover:text-foreground">
											View all
										</Link>
									)}
								</div>
								<div className="max-h-80 overflow-y-auto">
									{notifRes.loading ? (
										<div className="px-3 py-6 text-center text-xs text-muted-foreground">Loading…</div>
									) : (notifRes.data?.transactions.length ?? 0) === 0 ? (
										<div className="px-3 py-6 text-center text-xs text-muted-foreground">No notifications</div>
									) : (
										<ul>
											{notifRes.data?.transactions.map((t) => (
												<li
													key={t.id}
													className="px-3 py-2.5 border-b border-border/30 last:border-0 hover:bg-foreground/[0.04] cursor-pointer"
													onMouseDown={() => isInvestor && router.push("/app/activity")}
												>
													<div className="flex items-start gap-2">
														<span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
														<div className="min-w-0 flex-1">
															<div className="text-xs font-medium truncate">{t.title}</div>
															<div className="text-[10px] text-muted-foreground truncate">{t.subtitle}</div>
															<div className="text-[10px] text-muted-foreground/60 mt-0.5">
																{new Date(t.createdAt).toLocaleString()}
															</div>
														</div>
														{t.amount && (
															<span className="text-[10px] tabular-nums font-medium shrink-0">
																${Number(t.amount).toFixed(2)}
															</span>
														)}
													</div>
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
						)}
					</div>
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
									<MenuLink href={isInvestor ? "/app/settings" : "/owner/settings"} icon={<UserIcon className="size-3.5" />} label="Profile" />
									<MenuLink href={isInvestor ? "/app/settings" : "/owner/settings"} icon={<Settings className="size-3.5" />} label="Settings" />
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

			<CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} role={user.role} />
		</>
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

function MenuLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
	return (
		<Link
			href={href}
			className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
		>
			{icon}
			{label}
		</Link>
	)
}

function truncate(s: string) {
	if (s.length <= 12) return s
	return `${s.slice(0, 5)}…${s.slice(-4)}`
}

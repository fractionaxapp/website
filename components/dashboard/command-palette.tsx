"use client"

import { ArrowRight, Briefcase, Compass, FileText, LayoutDashboard, Loader2, Package, Search, Sparkles, Target, Users, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useFetch } from "@/lib/api/client"

type Asset = { id: number; slug: string; name: string; category: string; region: string | null }
type Holding = { id: number; asset: { slug: string; name: string; category: string } }

type Item = {
	id: string
	label: string
	hint?: string
	href: string
	icon: React.ReactNode
	section: string
}

export function CommandPalette({
	open,
	onClose,
	role,
}: {
	open: boolean
	onClose: () => void
	role: "investor" | "asset_owner" | null
}) {
	const router = useRouter()
	const [query, setQuery] = useState("")
	const [active, setActive] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)

	const assetsRes = useFetch<{ ok: true; assets: Asset[] }>(open ? "/api/assets" : null)
	const holdingsRes = useFetch<{ ok: true; holdings: Holding[] }>(open && role === "investor" ? "/api/me/holdings" : null)

	useEffect(() => {
		if (open) {
			setQuery("")
			setActive(0)
			setTimeout(() => inputRef.current?.focus(), 10)
		}
	}, [open])

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (!open) return
			if (e.key === "Escape") onClose()
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [open, onClose])

	const items = useMemo<Item[]>(() => {
		const investorActions: Item[] = [
			{ id: "nav-app", section: "Navigate", label: "Portfolio", href: "/app", icon: <LayoutDashboard className="size-3.5" /> },
			{ id: "nav-goal", section: "Navigate", label: "New goal", hint: "Set a natural-language mandate", href: "/app/goal", icon: <Target className="size-3.5" /> },
			{ id: "nav-holdings", section: "Navigate", label: "Holdings", href: "/app/holdings", icon: <Briefcase className="size-3.5" /> },
			{ id: "nav-discover", section: "Navigate", label: "Discover", href: "/app/discover", icon: <Compass className="size-3.5" /> },
			{ id: "nav-wallet", section: "Navigate", label: "Wallet", href: "/app/wallet", icon: <Wallet className="size-3.5" /> },
			{ id: "nav-activity", section: "Navigate", label: "Activity", href: "/app/activity", icon: <Sparkles className="size-3.5" /> },
		]
		const ownerActions: Item[] = [
			{ id: "nav-owner", section: "Navigate", label: "Overview", href: "/owner", icon: <LayoutDashboard className="size-3.5" /> },
			{ id: "nav-owner-assets", section: "Navigate", label: "My assets", href: "/owner/assets", icon: <Package className="size-3.5" /> },
			{ id: "nav-owner-new", section: "Navigate", label: "List new asset", href: "/owner/assets/new", icon: <Sparkles className="size-3.5" /> },
			{ id: "nav-owner-investors", section: "Navigate", label: "Investors", href: "/owner/investors", icon: <Users className="size-3.5" /> },
			{ id: "nav-owner-fundraising", section: "Navigate", label: "Fundraising", href: "/owner/fundraising", icon: <FileText className="size-3.5" /> },
		]

		const nav = role === "asset_owner" ? ownerActions : investorActions

		const assets: Item[] = (assetsRes.data?.assets ?? []).map((a) => ({
			id: `asset-${a.id}`,
			section: "Assets",
			label: a.name,
			hint: `${a.category} · ${a.region ?? "—"}`,
			href: role === "asset_owner" ? `/owner/assets/${a.slug}` : `/app/discover/${a.slug}`,
			icon: <Compass className="size-3.5" />,
		}))

		const holdings: Item[] = (holdingsRes.data?.holdings ?? []).map((h) => ({
			id: `holding-${h.id}`,
			section: "Your holdings",
			label: h.asset.name,
			hint: h.asset.category,
			href: `/app/discover/${h.asset.slug}`,
			icon: <Briefcase className="size-3.5" />,
		}))

		const q = query.trim().toLowerCase()
		const filter = (it: Item) =>
			!q ||
			it.label.toLowerCase().includes(q) ||
			(it.hint?.toLowerCase().includes(q) ?? false)

		return [...nav, ...holdings, ...assets].filter(filter)
	}, [query, role, assetsRes.data, holdingsRes.data])

	useEffect(() => {
		if (active >= items.length) setActive(0)
	}, [items.length, active])

	function go(item: Item) {
		router.push(item.href)
		onClose()
	}

	function onKey(e: React.KeyboardEvent) {
		if (e.key === "ArrowDown") {
			e.preventDefault()
			setActive((a) => Math.min(items.length - 1, a + 1))
		} else if (e.key === "ArrowUp") {
			e.preventDefault()
			setActive((a) => Math.max(0, a - 1))
		} else if (e.key === "Enter") {
			e.preventDefault()
			const item = items[active]
			if (item) go(item)
		}
	}

	if (!open) return null

	const groups = items.reduce<Record<string, Item[]>>((acc, it) => {
		;(acc[it.section] ||= []).push(it)
		return acc
	}, {})

	let runningIndex = -1

	return (
		<div
			className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-start justify-center p-4 pt-[10vh]"
			onClick={onClose}
		>
			<div
				className="w-full max-w-xl rounded-xl border border-border/60 bg-popover shadow-2xl overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center gap-3 px-4 h-12 border-b border-border/40">
					<Search className="size-4 text-muted-foreground" />
					<input
						ref={inputRef}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={onKey}
						placeholder="Search assets, holdings, or jump to a page…"
						className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
					/>
					<kbd className="text-[10px] font-mono text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">esc</kbd>
				</div>

				<div className="max-h-[60vh] overflow-y-auto p-1.5">
					{(assetsRes.loading || holdingsRes.loading) && items.length === 0 && (
						<div className="px-3 py-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
							<Loader2 className="size-3.5 animate-spin" /> Loading…
						</div>
					)}
					{!assetsRes.loading && items.length === 0 && (
						<div className="px-3 py-6 text-center text-xs text-muted-foreground">
							No matches for &ldquo;{query}&rdquo;
						</div>
					)}
					{Object.entries(groups).map(([section, list]) => (
						<div key={section} className="mb-1">
							<div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
								{section}
							</div>
							<ul>
								{list.map((item) => {
									runningIndex += 1
									const isActive = runningIndex === active
									return (
										<li key={item.id}>
											<button
												onMouseEnter={() => setActive(runningIndex)}
												onClick={() => go(item)}
												className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-left transition-colors ${
													isActive ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.04]"
												}`}
											>
												<div className="text-muted-foreground">{item.icon}</div>
												<div className="min-w-0 flex-1">
													<div className="text-sm font-medium truncate">{item.label}</div>
													{item.hint && <div className="text-[10px] text-muted-foreground truncate">{item.hint}</div>}
												</div>
												<ArrowRight className="size-3 text-muted-foreground/40" />
											</button>
										</li>
									)
								})}
							</ul>
						</div>
					))}
				</div>

				<div className="border-t border-border/40 px-3 py-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground/70">
					<div className="flex items-center gap-2">
						<span><kbd className="border border-border/60 rounded px-1">↑↓</kbd> navigate</span>
						<span><kbd className="border border-border/60 rounded px-1">↵</kbd> open</span>
					</div>
					<span>{items.length} result{items.length === 1 ? "" : "s"}</span>
				</div>
			</div>
		</div>
	)
}

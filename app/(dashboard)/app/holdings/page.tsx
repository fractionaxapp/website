"use client"

import { ArrowDownToLine, ArrowRight, Filter, Loader2, Search, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, EmptyState, MetricCard, StatusPill } from "@/components/dashboard/primitives"
import { useApi, useFetch } from "@/lib/api/client"

type HoldingRow = {
	id: number
	amount: string
	tokens: string
	createdAt: string
	goalId: number | null
	asset: {
		id: number
		slug: string
		name: string
		category: string
		region: string | null
		targetApy: string | null
		risk: string | null
		tenor: string | null
		status: string
	}
}

const fmtUsdFull = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtUsd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

const CATEGORIES = ["All", "Real Estate", "Private Credit", "Treasuries", "Infrastructure", "Commodities"] as const

export default function HoldingsPage() {
	const { data, loading, reload } = useFetch<{ ok: true; holdings: HoldingRow[] }>("/api/me/holdings")
	const { fetcher } = useApi()
	const [filter, setFilter] = useState<typeof CATEGORIES[number]>("All")
	const [query, setQuery] = useState("")
	const [selected, setSelected] = useState<HoldingRow | null>(null)
	const [sellAmount, setSellAmount] = useState("")
	const [sellSubmitting, setSellSubmitting] = useState(false)
	const [sellError, setSellError] = useState<string | null>(null)

	async function sell(all: boolean) {
		if (!selected) return
		setSellError(null)
		setSellSubmitting(true)
		try {
			const body: Record<string, unknown> = { holdingId: selected.id }
			if (!all) {
				const num = Number(sellAmount.replace(/,/g, ""))
				if (!Number.isFinite(num) || num <= 0) throw new Error("Enter a valid amount")
				body.amount = num
			}
			const res = await fetcher("/api/me/sell", { method: "POST", body: JSON.stringify(body) })
			const json = await res.json()
			if (!res.ok || !json.ok) throw new Error(json?.error ?? "Failed")
			setSelected(null)
			setSellAmount("")
			reload()
		} catch (e) {
			setSellError((e as Error).message)
		} finally {
			setSellSubmitting(false)
		}
	}

	const holdings = data?.holdings ?? []
	const total = holdings.reduce((s, h) => s + Number(h.amount), 0)

	const filtered = holdings.filter((h) => {
		const matchCat = filter === "All" || h.asset.category === filter
		const matchQ = query.length === 0 || h.asset.name.toLowerCase().includes(query.toLowerCase())
		return matchCat && matchQ
	})

	const weightedApy = total > 0
		? holdings.reduce((s, h) => s + Number(h.amount) * Number(h.asset.targetApy ?? "0"), 0) / total
		: 0

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader
				title="Holdings"
				description="Every real-world asset position your AI manages on your behalf."
				actions={
					<button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60">
						<ArrowDownToLine className="size-3.5" /> Export
					</button>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
				<MetricCard label="Positions" value={String(holdings.length)} hint={holdings.length ? `Across ${new Set(holdings.map((h) => h.asset.category)).size} asset classes` : "—"} />
				<MetricCard label="Total Value" value={fmtUsd(total)} />
				<MetricCard label="Weighted APY" value={`${weightedApy.toFixed(2)}%`} hint="Yield-to-maturity blended" />
				<MetricCard label="Avg. Risk" value={holdings.length ? "Low-Med" : "—"} hint="Volatility-adjusted" />
			</div>

			<Card padding="none">
				<div className="flex items-center justify-between p-4 border-b border-border/40 flex-wrap gap-3">
					<div className="flex items-center gap-1.5 flex-wrap">
						{CATEGORIES.map((c) => (
							<button
								key={c}
								onClick={() => setFilter(c)}
								className={`text-xs px-2.5 h-7 rounded-md transition-colors ${
									filter === c
										? "bg-foreground/10 text-foreground"
										: "text-muted-foreground hover:bg-foreground/[0.04]"
								}`}
							>
								{c}
							</button>
						))}
					</div>
					<div className="flex items-center gap-2">
						<div className="relative">
							<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search holdings…"
								className="h-8 pl-8 pr-3 text-xs bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30 w-48"
							/>
						</div>
						<button className="size-8 inline-flex items-center justify-center rounded-md border border-border/60 text-muted-foreground hover:text-foreground">
							<Filter className="size-3.5" />
						</button>
					</div>
				</div>

				{loading ? (
					<div className="p-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<Loader2 className="size-4 animate-spin" /> Loading…
					</div>
				) : holdings.length === 0 ? (
					<EmptyState
						title="No holdings yet"
						description="Set a goal and your AI will deploy capital across RWAs that match it."
						action={
							<a href="/app/goal" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-foreground text-background text-xs font-medium">
								Set a goal
							</a>
						}
					/>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 bg-foreground/[0.02]">
									<th className="px-4 py-2.5 font-normal">Asset</th>
									<th className="px-4 py-2.5 font-normal">Category</th>
									<th className="px-4 py-2.5 font-normal text-right">Allocation</th>
									<th className="px-4 py-2.5 font-normal text-right">Value</th>
									<th className="px-4 py-2.5 font-normal text-right">APY</th>
									<th className="px-4 py-2.5 font-normal text-right">Risk</th>
									<th className="px-4 py-2.5 font-normal text-right">Tenor</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((h) => {
									const pct = total > 0 ? Math.round((Number(h.amount) / total) * 100) : 0
									return (
										<tr
											key={h.id}
											onClick={() => { setSelected(h); setSellAmount(""); setSellError(null) }}
											className="border-t border-border/30 hover:bg-foreground/[0.02] cursor-pointer transition-colors"
										>
											<td className="px-4 py-3.5">
												<div className="text-xs font-medium">{h.asset.name}</div>
												<div className="text-[10px] text-muted-foreground mt-0.5">{h.asset.region ?? "—"}</div>
											</td>
											<td className="px-4 py-3.5">
												<StatusPill tone="muted" dot={false}>{h.asset.category}</StatusPill>
											</td>
											<td className="px-4 py-3.5 text-right tabular-nums text-xs">{pct}%</td>
											<td className="px-4 py-3.5 text-right tabular-nums text-xs font-medium">{fmtUsdFull(Number(h.amount))}</td>
											<td className="px-4 py-3.5 text-right tabular-nums text-xs">{Number(h.asset.targetApy ?? 0).toFixed(1)}%</td>
											<td className="px-4 py-3.5 text-right text-xs text-muted-foreground">{h.asset.risk ?? "—"}</td>
											<td className="px-4 py-3.5 text-right text-xs text-muted-foreground">{h.asset.tenor ?? "—"}</td>
										</tr>
									)
								})}
								{filtered.length === 0 && (
									<tr>
										<td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
											No holdings match this filter.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</Card>

			{selected && (
				<div
					className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
					onClick={() => !sellSubmitting && setSelected(null)}
				>
					<div
						className="w-full max-w-md rounded-2xl border border-border/60 bg-card shadow-2xl p-6"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-start justify-between">
							<div>
								<div className="text-xs font-mono uppercase tracking-wider text-muted-foreground/60">Position</div>
								<div className="text-lg font-medium mt-1">{selected.asset.name}</div>
								<div className="text-xs text-muted-foreground">{selected.asset.category} · {selected.asset.region}</div>
							</div>
							<button onClick={() => setSelected(null)} className="size-7 inline-flex items-center justify-center rounded-md hover:bg-foreground/[0.04] text-muted-foreground">
								<X className="size-4" />
							</button>
						</div>

						<div className="mt-5 rounded-md border border-border/40 bg-background/60 p-3 flex items-center justify-between">
							<div>
								<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Current value</div>
								<div className="text-base font-medium tabular-nums">{fmtUsdFull(Number(selected.amount))}</div>
							</div>
							<div className="text-right">
								<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Yield (target)</div>
								<div className="text-base font-medium tabular-nums text-primary">{Number(selected.asset.targetApy ?? 0).toFixed(1)}%</div>
							</div>
						</div>

						<label className="block mt-4">
							<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Redeem amount (leave empty for all)</span>
							<div className="mt-1.5 flex items-center gap-2 rounded-md border border-border/60 bg-background px-3 h-11 focus-within:border-foreground/40">
								<span className="text-base text-muted-foreground">$</span>
								<input
									type="text"
									inputMode="decimal"
									value={sellAmount}
									onChange={(e) => setSellAmount(e.target.value)}
									placeholder="All"
									className="flex-1 bg-transparent text-base outline-none tabular-nums"
								/>
							</div>
						</label>

						{sellError && <div className="mt-3 text-xs text-destructive">{sellError}</div>}

						<div className="mt-6 flex flex-col gap-2">
							<Link
								href={`/app/discover/${selected.asset.slug}`}
								className="h-10 rounded-md border border-border/60 text-sm font-medium hover:bg-card/60 inline-flex items-center justify-center gap-1.5"
							>
								View asset <ArrowRight className="size-3.5" />
							</Link>
							<div className="grid grid-cols-2 gap-2">
								<button
									disabled={sellSubmitting}
									onClick={() => sell(true)}
									className="h-10 rounded-md border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/5 disabled:opacity-60"
								>
									Redeem all
								</button>
								<button
									disabled={sellSubmitting || !sellAmount}
									onClick={() => sell(false)}
									className="h-10 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
								>
									{sellSubmitting ? <><Loader2 className="size-3.5 animate-spin" /> Working…</> : "Redeem partial"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

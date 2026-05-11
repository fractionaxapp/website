"use client"

import { ArrowDownToLine, Filter, Search } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, MetricCard, StatusPill } from "@/components/dashboard/primitives"
import { holdings, portfolioTotal } from "@/lib/mock/investor"

const fmtUsd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const fmtUsdFull = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 })

const CATEGORIES = ["All", "Real Estate", "Private Credit", "Treasuries", "Infrastructure", "Commodities"] as const

export default function HoldingsPage() {
	const [filter, setFilter] = useState<typeof CATEGORIES[number]>("All")
	const [query, setQuery] = useState("")

	const filtered = holdings.filter((h) => {
		const matchCat = filter === "All" || h.category === filter
		const matchQ = query.length === 0 || h.name.toLowerCase().includes(query.toLowerCase())
		return matchCat && matchQ
	})

	const weightedApy = holdings.reduce((s, h) => s + (h.apy * h.allocation) / 100, 0)
	const ytd = +(holdings.reduce((s, h) => s + h.change30d * h.allocation, 0) / 100).toFixed(2)

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
				<MetricCard label="Positions" value={String(holdings.length)} hint="Across 5 asset classes" />
				<MetricCard label="Total Value" value={fmtUsd(portfolioTotal)} change={{ value: `+${ytd.toFixed(1)}%`, positive: ytd >= 0 }} />
				<MetricCard label="Weighted APY" value={`${weightedApy.toFixed(2)}%`} hint="Yield-to-maturity blended" />
				<MetricCard label="Avg. Risk" value="Low-Med" hint="Volatility-adjusted" />
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

				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 bg-foreground/[0.02]">
								<th className="px-4 py-2.5 font-normal">Asset</th>
								<th className="px-4 py-2.5 font-normal">Category</th>
								<th className="px-4 py-2.5 font-normal text-right">Allocation</th>
								<th className="px-4 py-2.5 font-normal text-right">Value</th>
								<th className="px-4 py-2.5 font-normal text-right">30d</th>
								<th className="px-4 py-2.5 font-normal text-right">APY</th>
								<th className="px-4 py-2.5 font-normal text-right">Risk</th>
								<th className="px-4 py-2.5 font-normal text-right">Maturity</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((h) => (
								<tr key={h.id} className="border-t border-border/30 hover:bg-foreground/[0.02] cursor-pointer transition-colors">
									<td className="px-4 py-3.5">
										<div className="text-xs font-medium">{h.name}</div>
										<div className="text-[10px] text-muted-foreground mt-0.5">{h.region}</div>
									</td>
									<td className="px-4 py-3.5">
										<StatusPill tone="muted" dot={false}>{h.category}</StatusPill>
									</td>
									<td className="px-4 py-3.5 text-right tabular-nums text-xs">{h.allocation}%</td>
									<td className="px-4 py-3.5 text-right tabular-nums text-xs font-medium">{fmtUsdFull(h.value)}</td>
									<td className={`px-4 py-3.5 text-right tabular-nums text-xs ${h.change30d >= 0 ? "text-primary" : "text-destructive"}`}>
										{h.change30d >= 0 ? "+" : ""}{h.change30d.toFixed(2)}%
									</td>
									<td className="px-4 py-3.5 text-right tabular-nums text-xs">{h.apy.toFixed(1)}%</td>
									<td className="px-4 py-3.5 text-right text-xs text-muted-foreground">{h.risk}</td>
									<td className="px-4 py-3.5 text-right text-xs text-muted-foreground">{h.maturity}</td>
								</tr>
							))}
							{filtered.length === 0 && (
								<tr>
									<td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
										No holdings match this filter.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	)
}

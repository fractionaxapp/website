"use client"

import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, MetricCard, StatusPill } from "@/components/dashboard/primitives"
import { ownerAssets, type AssetListing } from "@/lib/mock/owner"

const fmtUsdShort = (n: number) =>
	n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`

const STATUS_TONE: Record<AssetListing["status"], "success" | "info" | "warning" | "muted"> = {
	live: "success",
	fundraising: "info",
	in_review: "warning",
	draft: "muted",
	closed: "muted",
}

const TABS = ["All", "Live", "Fundraising", "In review", "Draft", "Closed"] as const

export default function OwnerAssetsPage() {
	const [tab, setTab] = useState<typeof TABS[number]>("All")
	const [query, setQuery] = useState("")

	const filtered = ownerAssets.filter((a) => {
		const matchTab =
			tab === "All" ||
			(tab === "Live" && a.status === "live") ||
			(tab === "Fundraising" && a.status === "fundraising") ||
			(tab === "In review" && a.status === "in_review") ||
			(tab === "Draft" && a.status === "draft") ||
			(tab === "Closed" && a.status === "closed")
		const matchQ = !query || a.name.toLowerCase().includes(query.toLowerCase())
		return matchTab && matchQ
	})

	const totalRaised = ownerAssets.reduce((s, a) => s + a.raised, 0)
	const totalTarget = ownerAssets.reduce((s, a) => s + a.target, 0)

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader
				title="Assets"
				description="Every RWA listing under your organization."
				actions={
					<Link href="/owner/assets/new" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90">
						<Plus className="size-3.5" /> List asset
					</Link>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
				<MetricCard label="Total assets" value={String(ownerAssets.length)} hint={`${ownerAssets.filter((a) => a.status === "live" || a.status === "fundraising").length} active`} />
				<MetricCard label="Total raised" value={fmtUsdShort(totalRaised)} hint={`of ${fmtUsdShort(totalTarget)} target`} />
				<MetricCard label="Avg. target APY" value={`${(ownerAssets.reduce((s, a) => s + a.apyTarget, 0) / ownerAssets.length).toFixed(1)}%`} />
				<MetricCard label="Investors" value={String(ownerAssets.reduce((s, a) => s + a.investors, 0))} />
			</div>

			<Card padding="none">
				<div className="flex items-center justify-between p-4 border-b border-border/40 flex-wrap gap-3">
					<div className="flex items-center gap-1.5 flex-wrap">
						{TABS.map((t) => (
							<button
								key={t}
								onClick={() => setTab(t)}
								className={`text-xs px-2.5 h-7 rounded-md transition-colors ${
									tab === t
										? "bg-foreground/10 text-foreground"
										: "text-muted-foreground hover:bg-foreground/[0.04]"
								}`}
							>
								{t}
							</button>
						))}
					</div>
					<div className="relative">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search assets…"
							className="h-8 pl-8 pr-3 text-xs bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30 w-56"
						/>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 bg-foreground/[0.02]">
								<th className="px-4 py-2.5 font-normal">Asset</th>
								<th className="px-4 py-2.5 font-normal">Status</th>
								<th className="px-4 py-2.5 font-normal text-right">Raised / Target</th>
								<th className="px-4 py-2.5 font-normal text-right">Investors</th>
								<th className="px-4 py-2.5 font-normal text-right">APY</th>
								<th className="px-4 py-2.5 font-normal text-right">Tenor</th>
								<th className="px-4 py-2.5 font-normal text-right">Created</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((a) => {
								const pct = Math.round((a.raised / a.target) * 100)
								return (
									<tr key={a.id} className="border-t border-border/30 hover:bg-foreground/[0.02] cursor-pointer">
										<td className="px-4 py-3.5">
											<div className="text-xs font-medium">{a.name}</div>
											<div className="text-[10px] text-muted-foreground mt-0.5">{a.category} · {a.region}</div>
										</td>
										<td className="px-4 py-3.5">
											<StatusPill tone={STATUS_TONE[a.status]}>{a.status.replace("_", " ")}</StatusPill>
										</td>
										<td className="px-4 py-3.5 text-right">
											<div className="text-xs tabular-nums font-medium">{fmtUsdShort(a.raised)} / {fmtUsdShort(a.target)}</div>
											<div className="mt-1 h-1 w-32 ml-auto rounded-full bg-border/40 overflow-hidden">
												<div className={`h-full ${pct === 100 ? "bg-muted-foreground/40" : "bg-primary"}`} style={{ width: `${pct}%` }} />
											</div>
										</td>
										<td className="px-4 py-3.5 text-right tabular-nums text-xs">{a.investors}</td>
										<td className="px-4 py-3.5 text-right tabular-nums text-xs">{a.apyTarget.toFixed(1)}%</td>
										<td className="px-4 py-3.5 text-right text-xs text-muted-foreground">{a.tenor}</td>
										<td className="px-4 py-3.5 text-right text-xs text-muted-foreground">{a.created}</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	)
}

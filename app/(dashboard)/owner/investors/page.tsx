"use client"

import { ArrowDownToLine, Mail, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, MetricCard, StatusPill } from "@/components/dashboard/primitives"
import { capTable } from "@/lib/mock/owner"

const fmtUsdFull = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

const TIERS = ["All", "Retail", "Accredited", "Institutional"] as const

export default function InvestorsPage() {
	const [tier, setTier] = useState<typeof TIERS[number]>("All")
	const [query, setQuery] = useState("")

	const filtered = useMemo(
		() =>
			capTable.filter((c) => {
				if (tier !== "All" && c.tier !== tier) return false
				if (query && !c.investor.toLowerCase().includes(query.toLowerCase()) && !c.wallet.includes(query)) return false
				return true
			}),
		[tier, query],
	)

	const totalCommitted = capTable.reduce((s, c) => s + c.amount, 0)

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader
				title="Investors"
				description="Cap table across all of your assets, on-chain and verified."
				actions={
					<>
						<button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60">
							<Mail className="size-3.5" /> Email investors
						</button>
						<button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60">
							<ArrowDownToLine className="size-3.5" /> Export
						</button>
					</>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
				<MetricCard label="Total investors" value={String(capTable.length)} change={{ value: "+3 this week", positive: true }} />
				<MetricCard label="Total committed" value={fmtUsdFull(totalCommitted)} />
				<MetricCard label="Avg ticket" value={fmtUsdFull(Math.round(totalCommitted / capTable.length))} />
				<MetricCard label="Largest holder" value={fmtUsdFull(Math.max(...capTable.map((c) => c.amount)))} hint="Pegasus Family Office" />
			</div>

			<Card padding="none">
				<div className="flex items-center justify-between p-4 border-b border-border/40 flex-wrap gap-3">
					<div className="flex items-center gap-1.5">
						{TIERS.map((t) => (
							<button
								key={t}
								onClick={() => setTier(t)}
								className={`text-xs px-2.5 h-7 rounded-md transition-colors ${
									tier === t
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
							placeholder="Search investor or wallet…"
							className="h-8 pl-8 pr-3 text-xs bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30 w-64"
						/>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 bg-foreground/[0.02]">
								<th className="px-4 py-2.5 font-normal">Investor</th>
								<th className="px-4 py-2.5 font-normal">Wallet</th>
								<th className="px-4 py-2.5 font-normal">Asset</th>
								<th className="px-4 py-2.5 font-normal">Tier</th>
								<th className="px-4 py-2.5 font-normal">Region</th>
								<th className="px-4 py-2.5 font-normal text-right">Tokens</th>
								<th className="px-4 py-2.5 font-normal text-right">Committed</th>
								<th className="px-4 py-2.5 font-normal text-right">Since</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((c) => (
								<tr key={c.id} className="border-t border-border/30 hover:bg-foreground/[0.02]">
									<td className="px-4 py-3.5">
										<div className="flex items-center gap-2">
											<div className="size-7 rounded-md bg-primary/10 text-primary text-[10px] font-medium inline-flex items-center justify-center">
												{c.investor.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
											</div>
											<div className="text-xs font-medium">{c.investor}</div>
										</div>
									</td>
									<td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">{c.wallet}</td>
									<td className="px-4 py-3.5 text-xs">{c.asset}</td>
									<td className="px-4 py-3.5">
										<StatusPill tone={c.tier === "Institutional" ? "info" : c.tier === "Accredited" ? "warning" : "muted"} dot={false}>
											{c.tier}
										</StatusPill>
									</td>
									<td className="px-4 py-3.5 text-xs text-muted-foreground">{c.region}</td>
									<td className="px-4 py-3.5 text-right text-xs tabular-nums">{c.tokens.toLocaleString()}</td>
									<td className="px-4 py-3.5 text-right text-xs tabular-nums font-medium">{fmtUsdFull(c.amount)}</td>
									<td className="px-4 py-3.5 text-right text-xs text-muted-foreground">{c.since}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	)
}

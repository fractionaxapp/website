"use client"

import { ArrowRight, Plus } from "lucide-react"
import Link from "next/link"
import { AreaTrend, Donut } from "@/components/dashboard/charts"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, MetricCard, SectionHeader, StatusPill } from "@/components/dashboard/primitives"
import { fundraisingTrend, investorBreakdown, ownerAssets, ownerKpis } from "@/lib/mock/owner"
import { useDashboardUser } from "@/components/dashboard/gate"

const fmtUsdShort = (n: number) =>
	n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`

export default function OwnerOverviewPage() {
	const user = useDashboardUser()
	const greeting = user.displayName?.split(" ")[0] ?? "operator"

	const live = ownerAssets.filter((a) => a.status === "live" || a.status === "fundraising")

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-8">
			<PageHeader
				title={`Hi, ${greeting}`}
				description="2 fundraises are active, 1 listing is in compliance review, $61.3K in payouts due this month."
				actions={
					<>
						<Link href="/owner/payouts" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60">
							Run payout
						</Link>
						<Link href="/owner/assets/new" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90">
							<Plus className="size-3.5" /> List asset
						</Link>
					</>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
				<MetricCard label="Assets under mgmt" value={fmtUsdShort(ownerKpis.aum)} change={{ value: "+24.6%", positive: true }} hint="Quarter-over-quarter" />
				<MetricCard label="Investors" value={String(ownerKpis.investors)} change={{ value: "+128", positive: true }} hint="vs last quarter" />
				<MetricCard label="Live assets" value={String(ownerKpis.liveAssets)} hint={`${ownerKpis.fundraising} fundraising`} />
				<MetricCard label="Payout next 30d" value="$61.3K" hint="Across 823 wallets" />
			</div>

			<div className="grid lg:grid-cols-3 gap-4">
				<Card className="lg:col-span-2">
					<SectionHeader
						title="Fundraising velocity"
						description="Capital committed per month across all assets"
					/>
					<AreaTrend data={fundraisingTrend} height={260} />
				</Card>
				<Card>
					<SectionHeader title="Investor mix" description="By tier" />
					<Donut data={investorBreakdown} height={200} innerRadius={56} outerRadius={86} />
					<div className="mt-3 grid grid-cols-1 gap-1.5">
						{investorBreakdown.map((row, i) => {
							const colors = ["bg-primary", "bg-blue-500", "bg-amber-500"]
							return (
								<div key={row.label} className="flex items-center justify-between text-xs">
									<div className="flex items-center gap-2">
										<span className={`size-2 rounded ${colors[i]}`} />
										<span className="text-muted-foreground">{row.label}</span>
									</div>
									<span className="tabular-nums font-medium">{row.value}%</span>
								</div>
							)
						})}
					</div>
				</Card>
			</div>

			<Card padding="none">
				<div className="flex items-center justify-between p-4">
					<div>
						<h2 className="text-base font-medium">Active listings</h2>
						<p className="text-xs text-muted-foreground mt-0.5">{live.length} assets receiving capital</p>
					</div>
					<Link href="/owner/assets" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
						View all <ArrowRight className="size-3" />
					</Link>
				</div>
				<div className="overflow-x-auto border-t border-border/40">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 bg-foreground/[0.02]">
								<th className="px-4 py-2.5 font-normal">Asset</th>
								<th className="px-4 py-2.5 font-normal">Status</th>
								<th className="px-4 py-2.5 font-normal text-right">Raised / Target</th>
								<th className="px-4 py-2.5 font-normal text-right">Investors</th>
								<th className="px-4 py-2.5 font-normal text-right">Target APY</th>
								<th className="px-4 py-2.5 font-normal text-right">Next payout</th>
							</tr>
						</thead>
						<tbody>
							{live.map((a) => {
								const pct = Math.round((a.raised / a.target) * 100)
								return (
									<tr key={a.id} className="border-t border-border/30 hover:bg-foreground/[0.02]">
										<td className="px-4 py-3.5">
											<div className="text-xs font-medium">{a.name}</div>
											<div className="text-[10px] text-muted-foreground mt-0.5">{a.category} · {a.region}</div>
										</td>
										<td className="px-4 py-3.5">
											<StatusPill tone={a.status === "live" ? "success" : "info"}>{a.status}</StatusPill>
										</td>
										<td className="px-4 py-3.5 text-right">
											<div className="text-xs tabular-nums font-medium">{fmtUsdShort(a.raised)} / {fmtUsdShort(a.target)}</div>
											<div className="mt-1 h-1 w-32 ml-auto rounded-full bg-border/40 overflow-hidden">
												<div className="h-full bg-primary" style={{ width: `${pct}%` }} />
											</div>
										</td>
										<td className="px-4 py-3.5 text-right tabular-nums text-xs">{a.investors}</td>
										<td className="px-4 py-3.5 text-right tabular-nums text-xs">{a.apyTarget.toFixed(1)}%</td>
										<td className="px-4 py-3.5 text-right text-xs text-muted-foreground">{a.nextPayout ?? "—"}</td>
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

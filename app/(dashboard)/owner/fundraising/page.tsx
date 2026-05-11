"use client"

import { BarSeries } from "@/components/dashboard/charts"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, MetricCard, SectionHeader, StatusPill } from "@/components/dashboard/primitives"
import { fundraisingTrend, ownerAssets } from "@/lib/mock/owner"

const fmtUsdShort = (n: number) =>
	n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`

export default function FundraisingPage() {
	const fundraising = ownerAssets.filter((a) => a.status === "fundraising")
	const totalRaised = fundraising.reduce((s, a) => s + a.raised, 0)
	const totalTarget = fundraising.reduce((s, a) => s + a.target, 0)

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader
				title="Fundraising"
				description="Real-time visibility into your active capital raises."
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
				<MetricCard label="Active raises" value={String(fundraising.length)} />
				<MetricCard label="Total raised" value={fmtUsdShort(totalRaised)} change={{ value: "+18% this month", positive: true }} />
				<MetricCard label="Target raised" value={fmtUsdShort(totalTarget)} hint={`${Math.round((totalRaised / totalTarget) * 100)}% complete`} />
				<MetricCard label="Avg time to fund" value="46 days" hint="From listing to close" />
			</div>

			<Card>
				<SectionHeader title="Capital committed (last 12 months)" description="USD across all open raises" />
				<BarSeries data={fundraisingTrend} height={260} />
			</Card>

			<div className="grid lg:grid-cols-2 gap-4">
				{fundraising.map((a) => {
					const pct = Math.round((a.raised / a.target) * 100)
					return (
						<Card key={a.id}>
							<div className="flex items-start justify-between gap-2">
								<div>
									<div className="text-base font-medium">{a.name}</div>
									<div className="text-xs text-muted-foreground mt-0.5">{a.category} · {a.region}</div>
								</div>
								<StatusPill tone="info">Fundraising</StatusPill>
							</div>

							<div className="mt-5 flex items-end justify-between">
								<div>
									<div className="text-2xl font-medium tabular-nums">{fmtUsdShort(a.raised)}</div>
									<div className="text-xs text-muted-foreground">of {fmtUsdShort(a.target)} target</div>
								</div>
								<div className="text-right">
									<div className="text-base font-medium tabular-nums text-primary">{pct}%</div>
									<div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">complete</div>
								</div>
							</div>

							<div className="mt-3 h-1.5 rounded-full bg-border/40 overflow-hidden">
								<div className="h-full bg-primary" style={{ width: `${pct}%` }} />
							</div>

							<div className="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-border/30">
								<div>
									<div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60">Investors</div>
									<div className="text-sm font-medium tabular-nums mt-0.5">{a.investors}</div>
								</div>
								<div>
									<div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60">Avg ticket</div>
									<div className="text-sm font-medium tabular-nums mt-0.5">{a.investors > 0 ? fmtUsdShort(Math.round(a.raised / a.investors)) : "—"}</div>
								</div>
								<div>
									<div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60">Target APY</div>
									<div className="text-sm font-medium tabular-nums mt-0.5 text-primary">{a.apyTarget.toFixed(1)}%</div>
								</div>
							</div>
						</Card>
					)
				})}
			</div>
		</div>
	)
}

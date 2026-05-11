"use client"

import { Loader2 } from "lucide-react"
import { BarSeries } from "@/components/dashboard/charts"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, EmptyState, MetricCard, SectionHeader, StatusPill } from "@/components/dashboard/primitives"
import { useFetch } from "@/lib/api/client"
import { fundraisingTrend } from "@/lib/mock/owner"

type OwnerAsset = {
	id: number
	slug: string
	name: string
	category: string
	region: string | null
	status: "draft" | "in_review" | "fundraising" | "live" | "closed"
	targetRaise: string | null
	currentRaised: string
	targetApy: string | null
	tenor: string | null
}

type InvestorRow = {
	holdingId: number
	amount: string
	asset: { id: number; name: string }
}

const fmtUsdShort = (n: number) =>
	n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`

export default function FundraisingPage() {
	const assetsRes = useFetch<{ ok: true; assets: OwnerAsset[] }>("/api/owner/assets")
	const investorsRes = useFetch<{ ok: true; investors: InvestorRow[] }>("/api/owner/investors")
	const assets = assetsRes.data?.assets ?? []
	const investors = investorsRes.data?.investors ?? []

	const fundraising = assets.filter((a) => a.status === "fundraising")
	const totalRaised = fundraising.reduce((s, a) => s + Number(a.currentRaised), 0)
	const totalTarget = fundraising.reduce((s, a) => s + Number(a.targetRaise ?? 0), 0)

	const loading = assetsRes.loading || investorsRes.loading

	const investorsByAsset = investors.reduce<Record<number, { count: number; total: number }>>((acc, r) => {
		const slot = acc[r.asset.id] ?? { count: 0, total: 0 }
		slot.count += 1
		slot.total += Number(r.amount)
		acc[r.asset.id] = slot
		return acc
	}, {})

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader
				title="Fundraising"
				description="Real-time visibility into your active capital raises."
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
				<MetricCard label="Active raises" value={String(fundraising.length)} />
				<MetricCard label="Total raised" value={fmtUsdShort(totalRaised)} />
				<MetricCard label="Target raised" value={fmtUsdShort(totalTarget)} hint={totalTarget > 0 ? `${Math.round((totalRaised / totalTarget) * 100)}% complete` : "—"} />
				<MetricCard label="Avg time to fund" value="46 days" hint="From listing to close" />
			</div>

			<Card>
				<SectionHeader title="Capital committed (last 12 months)" description="USD across all open raises" />
				<BarSeries data={fundraisingTrend} height={260} />
			</Card>

			{loading ? (
				<Card className="flex items-center gap-3 text-sm text-muted-foreground">
					<Loader2 className="size-4 animate-spin" /> Loading raises…
				</Card>
			) : fundraising.length === 0 ? (
				<EmptyState
					title="No active raises"
					description="Submit an asset for review. Once approved it will appear here while it's accepting capital."
				/>
			) : (
				<div className="grid lg:grid-cols-2 gap-4">
					{fundraising.map((a) => {
						const target = Number(a.targetRaise ?? 0)
						const raised = Number(a.currentRaised)
						const pct = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0
						const info = investorsByAsset[a.id] ?? { count: 0, total: 0 }
						return (
							<Card key={a.id}>
								<div className="flex items-start justify-between gap-2">
									<div>
										<div className="text-base font-medium">{a.name}</div>
										<div className="text-xs text-muted-foreground mt-0.5">{a.category} · {a.region ?? "—"}</div>
									</div>
									<StatusPill tone="info">Fundraising</StatusPill>
								</div>

								<div className="mt-5 flex items-end justify-between">
									<div>
										<div className="text-2xl font-medium tabular-nums">{fmtUsdShort(raised)}</div>
										<div className="text-xs text-muted-foreground">of {fmtUsdShort(target)} target</div>
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
										<div className="text-sm font-medium tabular-nums mt-0.5">{info.count}</div>
									</div>
									<div>
										<div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60">Avg ticket</div>
										<div className="text-sm font-medium tabular-nums mt-0.5">{info.count > 0 ? fmtUsdShort(Math.round(info.total / info.count)) : "—"}</div>
									</div>
									<div>
										<div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60">Target APY</div>
										<div className="text-sm font-medium tabular-nums mt-0.5 text-primary">{Number(a.targetApy ?? 0).toFixed(1)}%</div>
									</div>
								</div>
							</Card>
						)
					})}
				</div>
			)}
		</div>
	)
}

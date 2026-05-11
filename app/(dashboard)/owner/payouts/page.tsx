"use client"

import { Calendar, Check, Play } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, MetricCard, SectionHeader, StatusPill } from "@/components/dashboard/primitives"
import { payouts, type Payout } from "@/lib/mock/owner"

const fmtUsd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

const STATUS_TONE: Record<Payout["status"], "info" | "warning" | "success"> = {
	scheduled: "info",
	processing: "warning",
	settled: "success",
}

export default function PayoutsPage() {
	const upcoming = payouts.filter((p) => p.status !== "settled")
	const settled = payouts.filter((p) => p.status === "settled")
	const upcomingTotal = upcoming.reduce((s, p) => s + p.amount, 0)

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader
				title="Payouts"
				description="Distribute returns to investors. All payouts settle on Solana in seconds."
				actions={
					<button className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90">
						<Play className="size-3.5" /> Run payout now
					</button>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
				<MetricCard label="Upcoming (30d)" value={fmtUsd(upcomingTotal)} hint={`${upcoming.length} scheduled`} />
				<MetricCard label="Settled (YTD)" value={fmtUsd(settled.reduce((s, p) => s + p.amount, 0))} change={{ value: "+34%", positive: true }} hint="vs. prior year" />
				<MetricCard label="Investors paid (30d)" value="823" hint="Across all assets" />
				<MetricCard label="Avg. settlement time" value="2.4s" hint="On Solana" />
			</div>

			<Card padding="none">
				<div className="p-4 flex items-center justify-between">
					<div>
						<h2 className="text-base font-medium">Upcoming distributions</h2>
						<p className="text-xs text-muted-foreground mt-0.5">Auto-generated from each asset's schedule</p>
					</div>
					<button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60">
						<Calendar className="size-3.5" /> Calendar view
					</button>
				</div>
				<div className="overflow-x-auto border-t border-border/40">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
								<th className="px-4 py-2.5 font-normal">Asset</th>
								<th className="px-4 py-2.5 font-normal">Period</th>
								<th className="px-4 py-2.5 font-normal text-right">Amount</th>
								<th className="px-4 py-2.5 font-normal text-right">Investors</th>
								<th className="px-4 py-2.5 font-normal text-right">Scheduled for</th>
								<th className="px-4 py-2.5 font-normal text-right">Status</th>
								<th className="px-4 py-2.5 font-normal" />
							</tr>
						</thead>
						<tbody>
							{upcoming.map((p) => (
								<tr key={p.id} className="border-t border-border/30">
									<td className="px-4 py-3.5 text-xs font-medium">{p.asset}</td>
									<td className="px-4 py-3.5 text-xs text-muted-foreground">{p.period}</td>
									<td className="px-4 py-3.5 text-right text-xs tabular-nums font-medium">{fmtUsd(p.amount)}</td>
									<td className="px-4 py-3.5 text-right text-xs tabular-nums">{p.investorCount}</td>
									<td className="px-4 py-3.5 text-right text-xs">{p.scheduledFor}</td>
									<td className="px-4 py-3.5 text-right"><StatusPill tone={STATUS_TONE[p.status]}>{p.status}</StatusPill></td>
									<td className="px-4 py-3.5 text-right">
										<button className="text-xs text-muted-foreground hover:text-foreground">Review →</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>

			<Card padding="none">
				<SectionHeader title="History" description="All settled distributions" className="p-4 mb-0" />
				<div className="overflow-x-auto border-t border-border/40">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
								<th className="px-4 py-2.5 font-normal">Asset</th>
								<th className="px-4 py-2.5 font-normal">Period</th>
								<th className="px-4 py-2.5 font-normal text-right">Amount</th>
								<th className="px-4 py-2.5 font-normal text-right">Investors</th>
								<th className="px-4 py-2.5 font-normal text-right">Settled</th>
							</tr>
						</thead>
						<tbody>
							{settled.map((p) => (
								<tr key={p.id} className="border-t border-border/30">
									<td className="px-4 py-3.5 text-xs font-medium">{p.asset}</td>
									<td className="px-4 py-3.5 text-xs text-muted-foreground">{p.period}</td>
									<td className="px-4 py-3.5 text-right text-xs tabular-nums">{fmtUsd(p.amount)}</td>
									<td className="px-4 py-3.5 text-right text-xs tabular-nums">{p.investorCount}</td>
									<td className="px-4 py-3.5 text-right text-xs text-muted-foreground inline-flex items-center justify-end gap-1.5 w-full">
										<Check className="size-3 text-primary" /> {p.settledAt}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	)
}

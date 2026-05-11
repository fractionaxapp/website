"use client"

import { ArrowRight, Loader2, Plus, Sparkles, Target } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { AreaTrend, Donut } from "@/components/dashboard/charts"
import { PageHeader } from "@/components/dashboard/page-header"
import {
	Card,
	DataRow,
	MetricCard,
	SectionHeader,
	StatusPill,
} from "@/components/dashboard/primitives"
import { useDashboardUser } from "@/components/dashboard/gate"
import { useFetch } from "@/lib/api/client"
import { performance30d } from "@/lib/mock/investor"
import type { Goal } from "@/lib/db/schema"

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

type TxRow = {
	id: number
	kind: string
	amount: string | null
	title: string
	subtitle: string | null
	agent: string | null
	createdAt: string
	asset: { id: number; slug: string; name: string } | null
}

const fmtUsd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const fmtUsdFull = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function PortfolioPage() {
	const user = useDashboardUser()
	const greeting = user.displayName?.split(" ")[0] ?? "there"

	const goalsRes = useFetch<{ ok: true; goals: Goal[] }>("/api/me/goals")
	const holdingsRes = useFetch<{ ok: true; holdings: HoldingRow[] }>("/api/me/holdings")
	const txRes = useFetch<{ ok: true; transactions: TxRow[] }>("/api/me/transactions?limit=10")

	const activeGoal = useMemo(() => goalsRes.data?.goals.find((g) => g.status === "active") ?? null, [goalsRes.data])
	const holdings = holdingsRes.data?.holdings ?? []
	const transactions = txRes.data?.transactions ?? []

	const portfolioTotal = holdings.reduce((s, h) => s + Number(h.amount), 0)
	const blendedApy = portfolioTotal > 0
		? holdings.reduce((s, h) => s + Number(h.amount) * Number(h.asset.targetApy ?? "0"), 0) / portfolioTotal
		: 0
	const allocationBreakdown = Object.entries(
		holdings.reduce<Record<string, number>>((acc, h) => {
			acc[h.asset.category] = (acc[h.asset.category] ?? 0) + Number(h.amount)
			return acc
		}, {}),
	).map(([label, value]) => ({ label, value: Math.round((value / portfolioTotal) * 100) || 0 }))

	const loading = goalsRes.loading || holdingsRes.loading || txRes.loading

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-8">
			<PageHeader
				title={`Welcome back, ${greeting}`}
				description={
					activeGoal
						? "Your AI managers are working on your active goal."
						: "Start by telling your agents what you want your money to do."
				}
				actions={
					<>
						<Link href="/app/wallet" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60">
							<Plus className="size-3.5" /> Add funds
						</Link>
						<Link href="/app/goal" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90">
							<Sparkles className="size-3.5" /> New goal
						</Link>
					</>
				}
			/>

			{loading ? (
				<Card className="flex items-center gap-3 text-sm text-muted-foreground">
					<Loader2 className="size-4 animate-spin" />
					Loading your portfolio…
				</Card>
			) : activeGoal ? (
				<Link
					href="/app/goal"
					className="block group relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-transparent p-5 lg:p-6 hover:border-primary/50 transition-colors overflow-hidden"
				>
					<div className="absolute -right-6 -top-6 size-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
					<div className="relative flex items-start gap-4">
						<div className="size-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
							<Target className="size-5" />
						</div>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<span className="text-[10px] font-mono uppercase tracking-wider text-primary">Active goal</span>
								<StatusPill tone="live">running</StatusPill>
							</div>
							<div className="mt-1.5 text-base lg:text-lg font-medium">&ldquo;{activeGoal.prompt}&rdquo;</div>
							<div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
								<MiniStat label="Deployed" value={fmtUsd(Number(activeGoal.capital))} />
								<MiniStat label="Blended APY" value={`${Number(activeGoal.blendedApy ?? 0).toFixed(1)}%`} accent />
								<MiniStat label="Assets" value={String(holdings.length)} />
								<MiniStat label="Since" value={new Date(activeGoal.createdAt).toLocaleDateString()} />
							</div>
						</div>
						<ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
					</div>
				</Link>
			) : (
				<Link
					href="/app/goal"
					className="block group relative rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.06] via-card/40 to-transparent p-6 lg:p-7 hover:border-foreground/30 transition-colors overflow-hidden"
				>
					<div className="absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
					<div className="relative flex items-center gap-5">
						<div className="size-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
							<Sparkles className="size-6" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">Try it</div>
							<div className="mt-1 font-display text-xl lg:text-2xl font-medium tracking-tight">
								What do you want your money to do?
							</div>
							<div className="mt-1 text-sm text-muted-foreground">
								Tell your agents in plain English. They&rsquo;ll source, underwrite, execute, and manage — autonomously.
							</div>
						</div>
						<div className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-md bg-foreground text-background text-sm font-medium group-hover:opacity-90">
							Set a goal <ArrowRight className="size-4" />
						</div>
					</div>
				</Link>
			)}

			{holdings.length > 0 && (
				<>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
						<MetricCard label="Portfolio Value" value={fmtUsdFull(portfolioTotal)} change={{ value: "+18.2% YTD", positive: true }} hint="vs. benchmark +6.4%" />
						<MetricCard label="Blended APY" value={`${blendedApy.toFixed(2)}%`} hint="Weighted by allocation" />
						<MetricCard label="Positions" value={String(holdings.length)} hint="Open" />
						<MetricCard label="Cash Available" value="$18,430.12" hint="USDC · Solana" />
					</div>

					<div className="grid lg:grid-cols-3 gap-4">
						<Card className="lg:col-span-2">
							<SectionHeader title="Portfolio performance" description="30-day total value, USDC equivalent" action={<StatusPill tone="live">Live</StatusPill>} />
							<AreaTrend data={performance30d} height={260} />
						</Card>
						<Card>
							<SectionHeader title="Allocation" description="By asset class" />
							{allocationBreakdown.length > 0 ? (
								<>
									<Donut data={allocationBreakdown} height={200} innerRadius={56} outerRadius={86} />
									<div className="mt-3 grid grid-cols-1 gap-1.5">
										{allocationBreakdown.map((row, i) => {
											const colors = ["bg-primary", "bg-blue-500", "bg-amber-500", "bg-purple-500", "bg-rose-500"]
											return (
												<div key={row.label} className="flex items-center justify-between text-xs">
													<div className="flex items-center gap-2">
														<span className={`size-2 rounded ${colors[i % colors.length]}`} />
														<span className="text-muted-foreground">{row.label}</span>
													</div>
													<span className="tabular-nums font-medium">{row.value}%</span>
												</div>
											)
										})}
									</div>
								</>
							) : (
								<div className="text-xs text-muted-foreground py-6 text-center">No holdings yet.</div>
							)}
						</Card>
					</div>

					<div className="grid lg:grid-cols-3 gap-4">
						<Card className="lg:col-span-2">
							<SectionHeader
								title="Top positions"
								description="Sorted by allocation"
								action={<Link href="/app/holdings" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">View all <ArrowRight className="size-3" /></Link>}
							/>
							<div className="overflow-x-auto -mx-2">
								<table className="w-full text-sm">
									<thead>
										<tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
											<th className="px-2 py-2 font-normal">Asset</th>
											<th className="px-2 py-2 font-normal text-right">Allocation</th>
											<th className="px-2 py-2 font-normal text-right">Value</th>
											<th className="px-2 py-2 font-normal text-right">APY</th>
										</tr>
									</thead>
									<tbody>
										{holdings.slice(0, 5).map((h) => {
											const pct = portfolioTotal > 0 ? Math.round((Number(h.amount) / portfolioTotal) * 100) : 0
											return (
												<tr key={h.id} className="border-t border-border/30">
													<td className="px-2 py-3">
														<div className="text-xs font-medium">{h.asset.name}</div>
														<div className="text-[10px] text-muted-foreground mt-0.5">{h.asset.category} · {h.asset.region}</div>
													</td>
													<td className="px-2 py-3 text-right">
														<div className="flex items-center justify-end gap-2">
															<div className="h-1 w-16 rounded-full bg-border/40 overflow-hidden">
																<div className="h-full bg-primary" style={{ width: `${pct}%` }} />
															</div>
															<span className="text-xs tabular-nums">{pct}%</span>
														</div>
													</td>
													<td className="px-2 py-3 text-xs tabular-nums text-right">{fmtUsdFull(Number(h.amount))}</td>
													<td className="px-2 py-3 text-xs tabular-nums text-right">{Number(h.asset.targetApy ?? 0).toFixed(1)}%</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>
						</Card>

						<Card>
							<SectionHeader
								title="Recent activity"
								action={<Link href="/app/activity" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">View all <ArrowRight className="size-3" /></Link>}
							/>
							{transactions.length === 0 ? (
								<div className="text-xs text-muted-foreground py-6 text-center">No activity yet.</div>
							) : (
								<ul className="space-y-3">
									{transactions.slice(0, 5).map((t) => (
										<li key={t.id} className="flex items-start gap-3">
											<span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
											<div className="min-w-0 flex-1">
												<div className="text-xs font-medium truncate">{t.title}</div>
												<div className="text-[10px] text-muted-foreground truncate">{t.subtitle}</div>
											</div>
											<div className="text-right shrink-0">
												{t.amount && (
													<div className="text-xs tabular-nums font-medium">
														{Number(t.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}
													</div>
												)}
												<div className="text-[10px] text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</div>
											</div>
										</li>
									))}
								</ul>
							)}
						</Card>
					</div>
				</>
			)}

			<Card>
				<SectionHeader title="Account snapshot" />
				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
					<div>
						<DataRow label="KYC" value={<StatusPill tone="success">Verified</StatusPill>} />
						<DataRow label="Tier" value="Accredited" />
					</div>
					<div>
						<DataRow label="Total deposited" value={fmtUsd(portfolioTotal)} mono />
						<DataRow label="Total withdrawn" value={fmtUsd(0)} mono />
					</div>
					<div>
						<DataRow label="Open positions" value={String(holdings.length)} mono />
						<DataRow label="Active goals" value={String(goalsRes.data?.goals.filter((g) => g.status === "active").length ?? 0)} mono />
					</div>
					<div>
						<DataRow label="Member since" value={new Date(user.createdAt).toLocaleDateString()} />
						<DataRow label="Next statement" value="Jul 1, 2026" />
					</div>
				</div>
			</Card>
		</div>
	)
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
	return (
		<div>
			<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</div>
			<div className={`text-sm font-medium tabular-nums mt-0.5 ${accent ? "text-primary" : ""}`}>{value}</div>
		</div>
	)
}

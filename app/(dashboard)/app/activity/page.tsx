"use client"

import { ArrowDownToLine, ArrowDown, ArrowRightLeft, ArrowUpFromLine, Coins, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, MetricCard, StatusPill } from "@/components/dashboard/primitives"
import { activity, type ActivityEvent } from "@/lib/mock/investor"

const KIND_META: Record<ActivityEvent["kind"], { label: string; icon: React.ReactNode; tone: "success" | "info" | "warning" | "muted" }> = {
	deposit: { label: "Deposit", icon: <ArrowDown className="size-3.5" />, tone: "info" },
	withdraw: { label: "Withdraw", icon: <ArrowUpFromLine className="size-3.5" />, tone: "warning" },
	rebalance: { label: "Rebalance", icon: <ArrowRightLeft className="size-3.5" />, tone: "muted" },
	yield: { label: "Yield", icon: <Coins className="size-3.5" />, tone: "success" },
	trade: { label: "Trade", icon: <ArrowRightLeft className="size-3.5" />, tone: "muted" },
	kyc: { label: "Compliance", icon: <ShieldCheck className="size-3.5" />, tone: "info" },
}

const FILTERS = ["All", "Yield", "Trades", "Cash flow", "Compliance"] as const

export default function ActivityPage() {
	const [filter, setFilter] = useState<typeof FILTERS[number]>("All")

	const filtered = activity.filter((a) => {
		if (filter === "All") return true
		if (filter === "Yield") return a.kind === "yield"
		if (filter === "Trades") return a.kind === "trade" || a.kind === "rebalance"
		if (filter === "Cash flow") return a.kind === "deposit" || a.kind === "withdraw"
		if (filter === "Compliance") return a.kind === "kyc"
		return true
	})

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader
				title="Activity"
				description="Every action your AI agents and you have taken on this account."
				actions={
					<button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60">
						<ArrowDownToLine className="size-3.5" /> Export CSV
					</button>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
				<MetricCard label="Events (30d)" value="124" change={{ value: "+18%", positive: true }} hint="Across all agents" />
				<MetricCard label="Yield received (30d)" value="$842.19" change={{ value: "+4.6%", positive: true }} />
				<MetricCard label="Cash flow (30d)" value="+$5,000.00" hint="Net deposits" />
				<MetricCard label="Pending settlements" value="2" hint="$847 expected today" />
			</div>

			<Card padding="none">
				<div className="flex items-center gap-1.5 p-3 border-b border-border/40">
					{FILTERS.map((f) => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`text-xs px-2.5 h-7 rounded-md transition-colors ${
								filter === f
									? "bg-foreground/10 text-foreground"
									: "text-muted-foreground hover:bg-foreground/[0.04]"
							}`}
						>
							{f}
						</button>
					))}
				</div>

				<ul>
					{filtered.map((a) => {
						const meta = KIND_META[a.kind]
						return (
							<li key={a.id} className="flex items-center gap-4 px-4 py-3.5 border-b border-border/30 last:border-0 hover:bg-foreground/[0.02]">
								<div className="size-9 rounded-lg bg-foreground/[0.04] flex items-center justify-center text-muted-foreground shrink-0">
									{meta.icon}
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium truncate">{a.title}</span>
										<StatusPill tone={meta.tone} dot={false}>{meta.label}</StatusPill>
									</div>
									<div className="text-xs text-muted-foreground mt-0.5 truncate">
										{a.subtitle}
										{a.agent && <span className="font-mono ml-2 text-muted-foreground/60">· {a.agent}</span>}
									</div>
								</div>
								<div className="text-right shrink-0">
									{a.amount && (
										<div className={`text-sm font-medium tabular-nums ${a.amount.startsWith("+") ? "text-primary" : ""}`}>
											{a.amount}
										</div>
									)}
									<div className="text-[10px] text-muted-foreground mt-0.5">{a.at}</div>
								</div>
							</li>
						)
					})}
				</ul>
			</Card>
		</div>
	)
}

"use client"

import { ArrowDownToLine, ArrowDown, ArrowRightLeft, ArrowUpFromLine, Coins, Loader2, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, EmptyState, MetricCard, StatusPill } from "@/components/dashboard/primitives"
import { useFetch } from "@/lib/api/client"

type TxRow = {
	id: number
	kind: "deposit" | "withdraw" | "allocation" | "yield" | "rebalance" | "kyc" | "trade"
	amount: string | null
	title: string
	subtitle: string | null
	agent: string | null
	createdAt: string
	asset: { id: number; slug: string; name: string } | null
}

const KIND_META: Record<TxRow["kind"], { label: string; icon: React.ReactNode; tone: "success" | "info" | "warning" | "muted" }> = {
	deposit: { label: "Deposit", icon: <ArrowDown className="size-3.5" />, tone: "info" },
	withdraw: { label: "Withdraw", icon: <ArrowUpFromLine className="size-3.5" />, tone: "warning" },
	rebalance: { label: "Rebalance", icon: <ArrowRightLeft className="size-3.5" />, tone: "muted" },
	yield: { label: "Yield", icon: <Coins className="size-3.5" />, tone: "success" },
	trade: { label: "Trade", icon: <ArrowRightLeft className="size-3.5" />, tone: "muted" },
	allocation: { label: "Allocation", icon: <ArrowRightLeft className="size-3.5" />, tone: "info" },
	kyc: { label: "Compliance", icon: <ShieldCheck className="size-3.5" />, tone: "info" },
}

const FILTERS = ["All", "Yield", "Trades", "Cash flow", "Compliance"] as const

export default function ActivityPage() {
	const { data, loading } = useFetch<{ ok: true; transactions: TxRow[] }>("/api/me/transactions?limit=200")
	const [filter, setFilter] = useState<typeof FILTERS[number]>("All")
	const txs = data?.transactions ?? []

	const filtered = txs.filter((t) => {
		if (filter === "All") return true
		if (filter === "Yield") return t.kind === "yield"
		if (filter === "Trades") return t.kind === "trade" || t.kind === "rebalance" || t.kind === "allocation"
		if (filter === "Cash flow") return t.kind === "deposit" || t.kind === "withdraw"
		if (filter === "Compliance") return t.kind === "kyc"
		return true
	})

	const yield30d = txs
		.filter((t) => t.kind === "yield")
		.reduce((s, t) => s + Number(t.amount ?? 0), 0)
	const cashFlow = txs
		.filter((t) => t.kind === "deposit" || t.kind === "withdraw")
		.reduce((s, t) => s + (t.kind === "deposit" ? Number(t.amount ?? 0) : -Number(t.amount ?? 0)), 0)

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
				<MetricCard label="Events" value={String(txs.length)} hint="All-time" />
				<MetricCard label="Yield received" value={`$${yield30d.toFixed(2)}`} hint="All-time" />
				<MetricCard label="Cash flow" value={`${cashFlow >= 0 ? "+" : ""}$${cashFlow.toFixed(2)}`} hint="Net deposits" />
				<MetricCard label="Pending settlements" value="0" hint="None right now" />
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

				{loading ? (
					<div className="p-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<Loader2 className="size-4 animate-spin" /> Loading…
					</div>
				) : filtered.length === 0 ? (
					<EmptyState title="No activity yet" description="When your agents act, you'll see it here in real time." />
				) : (
					<ul>
						{filtered.map((a) => {
							const meta = KIND_META[a.kind] ?? KIND_META.trade
							const amount = a.amount != null ? Number(a.amount) : null
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
										{amount !== null && (
											<div className={`text-sm font-medium tabular-nums ${a.kind === "deposit" || a.kind === "yield" ? "text-primary" : ""}`}>
												{(a.kind === "withdraw" ? "−" : a.kind === "allocation" ? "−" : "+")}
												${amount.toFixed(2)}
											</div>
										)}
										<div className="text-[10px] text-muted-foreground mt-0.5">{new Date(a.createdAt).toLocaleString()}</div>
									</div>
								</li>
							)
						})}
					</ul>
				)}
			</Card>
		</div>
	)
}

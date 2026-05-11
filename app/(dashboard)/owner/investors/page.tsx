"use client"

import { ArrowDownToLine, Loader2, Mail, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, EmptyState, MetricCard, StatusPill } from "@/components/dashboard/primitives"
import { useFetch } from "@/lib/api/client"

type InvestorRow = {
	holdingId: number
	amount: string
	tokens: string
	createdAt: string
	investor: {
		id: number
		displayName: string | null
		email: string | null
		walletAddress: string | null
	}
	asset: { id: number; name: string }
}

const fmtUsdFull = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

function truncate(s: string | null) {
	if (!s) return "—"
	if (s.length <= 12) return s
	return `${s.slice(0, 5)}…${s.slice(-4)}`
}

export default function InvestorsPage() {
	const { data, loading } = useFetch<{ ok: true; investors: InvestorRow[] }>("/api/owner/investors")
	const [query, setQuery] = useState("")
	const rows = data?.investors ?? []

	const filtered = useMemo(
		() =>
			rows.filter((r) => {
				if (!query) return true
				const haystack = [r.investor.displayName, r.investor.email, r.investor.walletAddress, r.asset.name]
					.filter(Boolean)
					.join(" ")
					.toLowerCase()
				return haystack.includes(query.toLowerCase())
			}),
		[rows, query],
	)

	const totalCommitted = rows.reduce((s, r) => s + Number(r.amount), 0)
	const uniqueInvestors = new Set(rows.map((r) => r.investor.id)).size
	const avg = uniqueInvestors > 0 ? totalCommitted / uniqueInvestors : 0
	const largest = rows.length > 0 ? Math.max(...rows.map((r) => Number(r.amount))) : 0

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
				<MetricCard label="Total investors" value={String(uniqueInvestors)} />
				<MetricCard label="Total committed" value={fmtUsdFull(totalCommitted)} />
				<MetricCard label="Avg ticket" value={fmtUsdFull(avg)} />
				<MetricCard label="Largest holder" value={fmtUsdFull(largest)} />
			</div>

			<Card padding="none">
				<div className="flex items-center justify-between p-4 border-b border-border/40">
					<div className="text-xs text-muted-foreground">{rows.length} holdings across your assets</div>
					<div className="relative">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search investor, wallet, or asset…"
							className="h-8 pl-8 pr-3 text-xs bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30 w-72"
						/>
					</div>
				</div>

				{loading ? (
					<div className="p-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<Loader2 className="size-4 animate-spin" /> Loading…
					</div>
				) : rows.length === 0 ? (
					<EmptyState
						title="No investors yet"
						description="When investors allocate capital to your live assets, they'll appear here."
					/>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 bg-foreground/[0.02]">
									<th className="px-4 py-2.5 font-normal">Investor</th>
									<th className="px-4 py-2.5 font-normal">Wallet</th>
									<th className="px-4 py-2.5 font-normal">Asset</th>
									<th className="px-4 py-2.5 font-normal text-right">Tokens</th>
									<th className="px-4 py-2.5 font-normal text-right">Committed</th>
									<th className="px-4 py-2.5 font-normal text-right">Since</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((r) => {
									const name = r.investor.displayName || r.investor.email || "Anonymous"
									return (
										<tr key={r.holdingId} className="border-t border-border/30 hover:bg-foreground/[0.02]">
											<td className="px-4 py-3.5">
												<div className="flex items-center gap-2">
													<div className="size-7 rounded-md bg-primary/10 text-primary text-[10px] font-medium inline-flex items-center justify-center">
														{name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
													</div>
													<div className="text-xs font-medium">{name}</div>
												</div>
											</td>
											<td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">{truncate(r.investor.walletAddress)}</td>
											<td className="px-4 py-3.5 text-xs">{r.asset.name}</td>
											<td className="px-4 py-3.5 text-right text-xs tabular-nums">{Math.round(Number(r.tokens)).toLocaleString()}</td>
											<td className="px-4 py-3.5 text-right text-xs tabular-nums font-medium">{fmtUsdFull(Number(r.amount))}</td>
											<td className="px-4 py-3.5 text-right text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				)}
			</Card>
		</div>
	)
}

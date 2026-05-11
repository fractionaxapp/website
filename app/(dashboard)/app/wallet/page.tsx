"use client"

import { ArrowDown, ArrowUpFromLine, Copy, ExternalLink, Plus } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, MetricCard, SectionHeader, StatusPill } from "@/components/dashboard/primitives"
import { walletBalances } from "@/lib/mock/investor"
import { useDashboardUser } from "@/components/dashboard/gate"

const fmtUsdFull = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function WalletPage() {
	const user = useDashboardUser()
	const [tab, setTab] = useState<"deposit" | "withdraw">("deposit")
	const [copied, setCopied] = useState(false)
	const total = walletBalances.reduce((s, b) => s + b.usdValue, 0)
	const address = user.walletAddress ?? "—"

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader
				title="Wallet"
				description="Manage cash, deposits, and withdrawals on Solana."
				actions={
					<button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60">
						<ExternalLink className="size-3.5" /> View on explorer
					</button>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
				<MetricCard label="Total balance" value={fmtUsdFull(total)} hint="Across all chains" />
				<MetricCard label="Available cash" value={fmtUsdFull(walletBalances[0].usdValue)} hint="USDC · ready to invest" />
				<MetricCard label="Network fees (30d)" value="$0.84" hint="Solana mainnet" />
			</div>

			<div className="grid lg:grid-cols-3 gap-4">
				<Card className="lg:col-span-2">
					<SectionHeader title="Balances" description="Funds held in your custodial wallet" />
					<div className="overflow-x-auto -mx-2">
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
									<th className="px-2 py-2 font-normal">Asset</th>
									<th className="px-2 py-2 font-normal">Chain</th>
									<th className="px-2 py-2 font-normal text-right">Balance</th>
									<th className="px-2 py-2 font-normal text-right">USD</th>
								</tr>
							</thead>
							<tbody>
								{walletBalances.map((b) => (
									<tr key={b.asset} className="border-t border-border/30">
										<td className="px-2 py-3.5">
											<div className="flex items-center gap-2">
												<div className="size-7 rounded-full bg-primary/10 text-primary text-[10px] font-mono inline-flex items-center justify-center">{b.asset.slice(0, 3)}</div>
												<div>
													<div className="text-xs font-medium">{b.asset}</div>
													<div className="text-[10px] text-muted-foreground">{b.asset === "USDC" ? "USD Coin" : b.asset === "SOL" ? "Solana" : "Tether"}</div>
												</div>
											</div>
										</td>
										<td className="px-2 py-3.5 text-xs text-muted-foreground">{b.chain}</td>
										<td className="px-2 py-3.5 text-right text-xs tabular-nums">{b.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
										<td className="px-2 py-3.5 text-right text-xs tabular-nums font-medium">{fmtUsdFull(b.usdValue)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>

				<Card>
					<div className="flex items-center gap-1 mb-4">
						<button
							onClick={() => setTab("deposit")}
							className={`flex-1 h-8 rounded-md text-xs font-medium transition-colors ${tab === "deposit" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
						>
							<ArrowDown className="size-3.5 inline-block mr-1" /> Deposit
						</button>
						<button
							onClick={() => setTab("withdraw")}
							className={`flex-1 h-8 rounded-md text-xs font-medium transition-colors ${tab === "withdraw" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
						>
							<ArrowUpFromLine className="size-3.5 inline-block mr-1" /> Withdraw
						</button>
					</div>

					{tab === "deposit" ? (
						<div className="space-y-3">
							<div className="text-xs text-muted-foreground">
								Send USDC on Solana to the address below. Funds become available after 1 confirmation.
							</div>
							<div className="rounded-md border border-border/60 bg-card/60 p-3">
								<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Your Solana address</div>
								<div className="mt-1.5 flex items-center gap-2">
									<code className="flex-1 text-xs font-mono break-all">{address}</code>
									<button
										onClick={async () => {
											if (address && address !== "—") {
												await navigator.clipboard.writeText(address)
												setCopied(true)
												setTimeout(() => setCopied(false), 1500)
											}
										}}
										className="size-7 inline-flex items-center justify-center rounded-md hover:bg-foreground/[0.04]"
									>
										<Copy className="size-3" />
									</button>
								</div>
								{copied && <div className="text-[10px] text-primary mt-1">Copied</div>}
							</div>
							<StatusPill tone="info">Network: Solana mainnet · USDC mint</StatusPill>
						</div>
					) : (
						<div className="space-y-3">
							<label className="text-xs">
								<span className="text-muted-foreground text-[10px] uppercase tracking-wider font-mono">Amount (USDC)</span>
								<input type="number" placeholder="0.00" className="mt-1 h-9 w-full px-3 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30" />
							</label>
							<label className="text-xs">
								<span className="text-muted-foreground text-[10px] uppercase tracking-wider font-mono">Destination</span>
								<input type="text" placeholder="Solana address" className="mt-1 h-9 w-full px-3 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30 font-mono" />
							</label>
							<button className="w-full h-9 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 inline-flex items-center justify-center gap-1.5">
								<Plus className="size-3.5" /> Withdraw
							</button>
							<div className="text-[10px] text-muted-foreground">
								Withdrawals settle in &lt; 60 seconds. Network fee ≈ $0.0001.
							</div>
						</div>
					)}
				</Card>
			</div>
		</div>
	)
}

"use client"

import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, Shield, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, DataRow, SectionHeader, StatusPill } from "@/components/dashboard/primitives"
import { useApi, useFetch } from "@/lib/api/client"

type AssetDetail = {
	id: number
	slug: string
	name: string
	category: string
	region: string | null
	description: string | null
	targetApy: string | null
	risk: string | null
	tenor: string | null
	minInvestment: string | null
	targetRaise: string | null
	currentRaised: string
	status: "draft" | "in_review" | "fundraising" | "live" | "closed"
	highlights: string[] | null
	createdAt: string
	ownerName: string | null
}

type MyHolding = { id: number; amount: string; tokens: string } | null

const fmtUsdShort = (n: number) =>
	n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`
const fmtUsd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

export default function AssetDetailPage() {
	const params = useParams<{ slug: string }>()
	const router = useRouter()
	const { fetcher } = useApi()
	const { data, loading, reload } = useFetch<{ ok: true; asset: AssetDetail; myHolding: MyHolding }>(
		params.slug ? `/api/assets/${params.slug}` : null,
	)

	const [investOpen, setInvestOpen] = useState(false)
	const [amount, setAmount] = useState("250")
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	if (loading) {
		return (
			<div className="px-4 lg:px-8 py-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
				<Loader2 className="size-4 animate-spin" /> Loading asset…
			</div>
		)
	}

	if (!data?.asset) {
		return (
			<div className="px-4 lg:px-8 py-10">
				<Link href="/app/discover" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
					<ArrowLeft className="size-3" /> Back to Discover
				</Link>
				<div className="text-sm text-muted-foreground">Asset not found.</div>
			</div>
		)
	}

	const asset = data.asset
	const myHolding = data.myHolding
	const target = Number(asset.targetRaise ?? 0)
	const raised = Number(asset.currentRaised)
	const pct = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0
	const min = Number(asset.minInvestment ?? 0)

	async function invest() {
		setError(null)
		const num = Number(amount.replace(/,/g, ""))
		if (!Number.isFinite(num) || num <= 0) {
			setError("Enter a valid amount")
			return
		}
		if (num < min) {
			setError(`Minimum investment is $${min}`)
			return
		}
		setSubmitting(true)
		try {
			const res = await fetcher("/api/me/invest", {
				method: "POST",
				body: JSON.stringify({ slug: asset.slug, amount: num }),
			})
			const json = await res.json()
			if (!res.ok || !json.ok) throw new Error(json?.error ?? "Failed")
			setSuccess(true)
			setTimeout(() => {
				setInvestOpen(false)
				setSuccess(false)
				reload()
			}, 1400)
		} catch (e) {
			setError((e as Error).message)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<Link href="/app/discover" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
				<ArrowLeft className="size-3" /> Back to Discover
			</Link>

			<PageHeader
				title={asset.name}
				description={asset.description ?? undefined}
				actions={
					<>
						{myHolding && (
							<button
								onClick={() => router.push("/app/holdings")}
								className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60"
							>
								View my position
							</button>
						)}
						<button
							onClick={() => setInvestOpen(true)}
							disabled={asset.status !== "live" && asset.status !== "fundraising"}
							className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
						>
							{myHolding ? "Add to position" : "Invest"} <ArrowRight className="size-3.5" />
						</button>
					</>
				}
			/>

			<div className="flex items-center gap-2 flex-wrap">
				<StatusPill tone={asset.status === "live" ? "success" : "info"}>{asset.status.replace("_", " ")}</StatusPill>
				<span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
					<MapPin className="size-2.5" /> {asset.region ?? "—"}
				</span>
				<span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
					<TrendingUp className="size-2.5" /> {asset.category}
				</span>
				<span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
					<Shield className="size-2.5" /> Risk: {asset.risk ?? "—"}
				</span>
				{asset.ownerName && (
					<span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
						<Sparkles className="size-2.5" /> Operated by {asset.ownerName}
					</span>
				)}
			</div>

			<div className="grid lg:grid-cols-3 gap-4">
				<Card className="lg:col-span-2">
					<SectionHeader title="Fundraising progress" />
					<div className="flex items-end justify-between mb-3">
						<div>
							<div className="text-3xl font-medium tabular-nums">{fmtUsdShort(raised)}</div>
							<div className="text-xs text-muted-foreground">of {fmtUsdShort(target)} target</div>
						</div>
						<div className="text-right">
							<div className="text-2xl font-medium tabular-nums text-primary">{pct}%</div>
							<div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">complete</div>
						</div>
					</div>
					<div className="h-2 rounded-full bg-border/40 overflow-hidden">
						<div className="h-full bg-primary" style={{ width: `${pct}%` }} />
					</div>

					{asset.highlights && asset.highlights.length > 0 && (
						<>
							<SectionHeader title="Highlights" className="mt-8 mb-3" />
							<ul className="grid sm:grid-cols-2 gap-2">
								{asset.highlights.map((h) => (
									<li key={h} className="flex items-start gap-2 text-sm">
										<span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
										<span className="text-foreground/80">{h}</span>
									</li>
								))}
							</ul>
						</>
					)}
				</Card>

				<Card>
					<SectionHeader title="Terms" />
					<DataRow label="Target APY" value={<span className="text-primary tabular-nums">{Number(asset.targetApy ?? 0).toFixed(2)}%</span>} />
					<DataRow label="Tenor" value={asset.tenor ?? "—"} />
					<DataRow label="Risk" value={asset.risk ?? "—"} />
					<DataRow label="Minimum" value={fmtUsd(min)} mono />
					<DataRow label="Settlement" value="USDC · Solana" />
					<DataRow label="Listed" value={new Date(asset.createdAt).toLocaleDateString()} />
				</Card>
			</div>

			{myHolding && (
				<Card>
					<SectionHeader title="Your position" description="Already invested in this asset" />
					<div className="grid sm:grid-cols-3 gap-x-8">
						<DataRow label="Amount" value={fmtUsd(Number(myHolding.amount))} mono />
						<DataRow label="Tokens" value={Number(myHolding.tokens).toLocaleString()} mono />
						<DataRow label="Goal-linked" value={myHolding.id ? "Yes" : "No"} />
					</div>
				</Card>
			)}

			{investOpen && (
				<div
					className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
					onClick={() => !submitting && setInvestOpen(false)}
				>
					<div
						className="w-full max-w-md rounded-2xl border border-border/60 bg-card shadow-2xl p-6"
						onClick={(e) => e.stopPropagation()}
					>
						{success ? (
							<div className="text-center py-6">
								<div className="size-14 rounded-full bg-primary/15 text-primary mx-auto flex items-center justify-center">
									<Check className="size-7" strokeWidth={2.5} />
								</div>
								<div className="mt-5 text-lg font-medium">Allocation confirmed</div>
								<div className="text-sm text-muted-foreground mt-1">
									Your agents are deploying the capital into {asset.name}.
								</div>
							</div>
						) : (
							<>
								<div className="text-xs font-mono uppercase tracking-wider text-muted-foreground/60">Invest in</div>
								<div className="text-lg font-medium mt-1">{asset.name}</div>
								<div className="text-xs text-muted-foreground">{asset.category} · {asset.region}</div>

								<label className="block mt-5">
									<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Amount (USDC)</span>
									<div className="mt-1.5 flex items-center gap-2 rounded-md border border-border/60 bg-background px-3 h-11 focus-within:border-foreground/40">
										<span className="text-base text-muted-foreground">$</span>
										<input
											type="text"
											inputMode="decimal"
											value={amount}
											onChange={(e) => setAmount(e.target.value)}
											autoFocus
											className="flex-1 bg-transparent text-base outline-none tabular-nums"
											placeholder="250"
										/>
									</div>
									<div className="mt-1.5 text-[10px] text-muted-foreground">
										Minimum {fmtUsd(min)} · expected APY {Number(asset.targetApy ?? 0).toFixed(1)}%
									</div>
								</label>

								<div className="mt-3 flex gap-1.5">
									{[100, 500, 1000, 5000].filter((v) => v >= min).map((v) => (
										<button
											key={v}
											onClick={() => setAmount(String(v))}
											className="flex-1 h-7 rounded-md border border-border/60 text-xs text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
										>
											${v.toLocaleString()}
										</button>
									))}
								</div>

								{error && <div className="mt-3 text-xs text-destructive">{error}</div>}

								<div className="mt-6 flex gap-2">
									<button
										disabled={submitting}
										onClick={() => setInvestOpen(false)}
										className="flex-1 h-10 rounded-md border border-border/60 text-sm font-medium hover:bg-card/60 disabled:opacity-60"
									>
										Cancel
									</button>
									<button
										disabled={submitting}
										onClick={invest}
										className="flex-1 h-10 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
									>
										{submitting ? <><Loader2 className="size-3.5 animate-spin" /> Allocating…</> : <>Confirm <ArrowRight className="size-3.5" /></>}
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

"use client"

import { ArrowRight, Filter, Loader2, MapPin, Search, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, EmptyState, StatusPill } from "@/components/dashboard/primitives"
import { useFetch } from "@/lib/api/client"

type Asset = {
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
	status: string
	highlights: string[] | null
}

const fmtUsdShort = (n: number) =>
	n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`

const CATEGORIES = ["All", "Real Estate", "Private Credit", "Treasuries", "Infrastructure", "Commodities"] as const
const RISKS = ["Any", "Low", "Low-Med", "Medium", "Med-High", "High"] as const

export default function DiscoverPage() {
	const { data, loading } = useFetch<{ ok: true; assets: Asset[] }>("/api/assets")
	const [cat, setCat] = useState<typeof CATEGORIES[number]>("All")
	const [risk, setRisk] = useState<typeof RISKS[number]>("Any")
	const [query, setQuery] = useState("")

	const assets = data?.assets ?? []

	const filtered = useMemo(
		() =>
			assets.filter((a) => {
				if (cat !== "All" && a.category !== cat) return false
				if (risk !== "Any" && a.risk !== risk) return false
				if (query && !a.name.toLowerCase().includes(query.toLowerCase())) return false
				return true
			}),
		[assets, cat, risk, query],
	)

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader
				title="Discover"
				description="Curated real-world asset opportunities sourced and underwritten by AI."
				actions={
					<button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60">
						<Filter className="size-3.5" /> Saved searches
					</button>
				}
			/>

			<Card padding="none">
				<div className="p-4 grid sm:grid-cols-3 gap-3 border-b border-border/40">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search opportunities…"
							className="h-9 w-full pl-9 pr-3 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30"
						/>
					</div>
					<select
						value={cat}
						onChange={(e) => setCat(e.target.value as typeof CATEGORIES[number])}
						className="h-9 px-3 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30"
					>
						{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
					</select>
					<select
						value={risk}
						onChange={(e) => setRisk(e.target.value as typeof RISKS[number])}
						className="h-9 px-3 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30"
					>
						{RISKS.map((r) => <option key={r}>{r}</option>)}
					</select>
				</div>

				<div className="p-4 text-xs text-muted-foreground">
					{loading ? "Loading…" : `${filtered.length} opportunit${filtered.length === 1 ? "y" : "ies"} matched`}
				</div>
			</Card>

			{loading ? (
				<Card className="flex items-center gap-3 text-sm text-muted-foreground">
					<Loader2 className="size-4 animate-spin" /> Loading marketplace…
				</Card>
			) : filtered.length === 0 ? (
				<EmptyState
					icon={<TrendingUp className="size-5" />}
					title="No matches"
					description="Try widening your filters or clear search to see all opportunities."
				/>
			) : (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filtered.map((a) => {
						const raised = Number(a.currentRaised)
						const target = Number(a.targetRaise ?? 0)
						const pct = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0
						const highlights = Array.isArray(a.highlights) ? a.highlights : []
						return (
							<Card key={a.id} className="flex flex-col">
								<div className="flex items-start justify-between gap-2">
									<div>
										<div className="text-sm font-medium">{a.name}</div>
										<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
											<MapPin className="size-2.5" /> {a.region ?? "—"}
											<span className="text-border">·</span> {a.category}
										</div>
									</div>
									<StatusPill tone={pct >= 80 ? "warning" : "info"}>{pct}% raised</StatusPill>
								</div>
								<ul className="mt-4 space-y-1.5 min-h-[60px]">
									{highlights.slice(0, 3).map((h) => (
										<li key={h} className="flex items-start gap-2 text-xs text-muted-foreground">
											<span className="mt-1.5 size-1 rounded-full bg-primary shrink-0" /> {h}
										</li>
									))}
								</ul>
								<div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-border/30">
									<KV label="Target APY" value={`${Number(a.targetApy ?? 0).toFixed(1)}%`} accent />
									<KV label="Tenor" value={a.tenor ?? "—"} />
									<KV label="Min." value={`$${Math.round(Number(a.minInvestment ?? 0))}`} />
								</div>
								<div className="mt-3 h-1 rounded-full bg-border/40 overflow-hidden">
									<div className="h-full bg-primary" style={{ width: `${pct}%` }} />
								</div>
								<div className="mt-1 flex justify-between text-[10px] text-muted-foreground font-mono">
									<span>{fmtUsdShort(raised)} raised</span>
									{target > 0 && <span>of {fmtUsdShort(target)}</span>}
								</div>
								<div className="mt-4 flex items-center gap-2">
									<Link
										href={`/app/discover/${a.slug}`}
										className="flex-1 h-9 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 inline-flex items-center justify-center gap-1.5"
									>
										Invest <ArrowRight className="size-3.5" />
									</Link>
									<Link
										href={`/app/discover/${a.slug}`}
										className="h-9 px-3 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60 inline-flex items-center"
									>
										Details
									</Link>
								</div>
							</Card>
						)
					})}
				</div>
			)}
		</div>
	)
}

function KV({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
	return (
		<div>
			<div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</div>
			<div className={`text-sm font-medium tabular-nums mt-0.5 ${accent ? "text-primary" : ""}`}>{value}</div>
		</div>
	)
}

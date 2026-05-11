"use client"

import { Check, Loader2, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Row = {
	id: number
	slug: string
	name: string
	category: string
	region: string | null
	status: "draft" | "in_review" | "fundraising" | "live" | "closed"
	targetApy: string | null
	targetRaise: string | null
	currentRaised: string
	createdAt: string
	ownerName: string | null
	ownerEmail: string | null
}

const TABS = ["Awaiting review", "All listings"] as const

const STATUS_TONE: Record<Row["status"], string> = {
	live: "bg-primary/10 text-primary border-primary/30",
	fundraising: "bg-blue-500/10 text-blue-500 border-blue-500/30",
	in_review: "bg-amber-500/10 text-amber-500 border-amber-500/30",
	draft: "bg-muted text-muted-foreground border-border/60",
	closed: "bg-muted text-muted-foreground border-border/60",
}

const fmtUsdShort = (n: number) =>
	n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`

export function AssetsAdmin({ initial }: { initial: Row[] }) {
	const router = useRouter()
	const [tab, setTab] = useState<typeof TABS[number]>("Awaiting review")
	const [working, setWorking] = useState<number | null>(null)
	const [error, setError] = useState<string | null>(null)

	const filtered = tab === "Awaiting review" ? initial.filter((r) => r.status === "in_review") : initial

	async function updateStatus(id: number, status: Row["status"]) {
		setError(null)
		setWorking(id)
		try {
			const res = await fetch("/api/admin/assets", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status }),
			})
			const json = await res.json()
			if (!res.ok || !json.ok) throw new Error(json?.error ?? "Failed")
			router.refresh()
		} catch (e) {
			setError((e as Error).message)
		} finally {
			setWorking(null)
		}
	}

	return (
		<main className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="font-display text-2xl font-medium">Asset listings</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{initial.filter((r) => r.status === "in_review").length} awaiting review · {initial.length} total
					</p>
				</div>
				<Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground">
					← Back to admin
				</Link>
			</div>

			<div className="mt-6 flex items-center gap-1.5">
				{TABS.map((t) => (
					<button
						key={t}
						onClick={() => setTab(t)}
						className={`text-xs px-3 h-8 rounded-md transition-colors ${
							tab === t ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:bg-foreground/[0.04]"
						}`}
					>
						{t}
					</button>
				))}
			</div>

			{error && <div className="mt-3 text-xs text-destructive">{error}</div>}

			<div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-card/40">
				{filtered.length === 0 ? (
					<div className="p-10 text-center text-sm text-muted-foreground">Nothing here.</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border/60 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
									<th className="px-4 py-3 font-normal">Asset</th>
									<th className="px-4 py-3 font-normal">Owner</th>
									<th className="px-4 py-3 font-normal">Status</th>
									<th className="px-4 py-3 font-normal text-right">APY</th>
									<th className="px-4 py-3 font-normal text-right">Target</th>
									<th className="px-4 py-3 font-normal text-right">Submitted</th>
									<th className="px-4 py-3 font-normal text-right">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((r) => (
									<tr key={r.id} className="border-b border-border/30 last:border-0">
										<td className="px-4 py-3">
											<div className="text-xs font-medium">{r.name}</div>
											<div className="text-[10px] text-muted-foreground mt-0.5">{r.category} · {r.region ?? "—"}</div>
										</td>
										<td className="px-4 py-3 text-xs">
											<div>{r.ownerName ?? "—"}</div>
											<div className="text-[10px] text-muted-foreground">{r.ownerEmail ?? "—"}</div>
										</td>
										<td className="px-4 py-3">
											<span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${STATUS_TONE[r.status]}`}>
												{r.status.replace("_", " ")}
											</span>
										</td>
										<td className="px-4 py-3 text-right tabular-nums text-xs">{Number(r.targetApy ?? 0).toFixed(1)}%</td>
										<td className="px-4 py-3 text-right tabular-nums text-xs">{fmtUsdShort(Number(r.targetRaise ?? 0))}</td>
										<td className="px-4 py-3 text-right text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</td>
										<td className="px-4 py-3 text-right">
											{r.status === "in_review" ? (
												<div className="inline-flex items-center gap-1">
													<button
														disabled={working === r.id}
														onClick={() => updateStatus(r.id, "fundraising")}
														className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-primary text-primary-foreground text-[10px] font-medium hover:opacity-90 disabled:opacity-60"
													>
														{working === r.id ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />} Approve
													</button>
													<button
														disabled={working === r.id}
														onClick={() => updateStatus(r.id, "closed")}
														className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md border border-destructive/40 text-destructive text-[10px] font-medium hover:bg-destructive/5 disabled:opacity-60"
													>
														<X className="size-3" /> Reject
													</button>
												</div>
											) : r.status === "fundraising" ? (
												<button
													disabled={working === r.id}
													onClick={() => updateStatus(r.id, "live")}
													className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md border border-border/60 text-[10px] font-medium hover:bg-card/60 disabled:opacity-60"
												>
													Promote to live
												</button>
											) : (
												<span className="text-[10px] text-muted-foreground">—</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</main>
	)
}

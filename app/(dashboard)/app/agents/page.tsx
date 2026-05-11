"use client"

import { Pause, Play, Power } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, MetricCard, SectionHeader, StatusPill } from "@/components/dashboard/primitives"
import { agents, type AgentRow } from "@/lib/mock/investor"

export default function AgentsPage() {
	const [selected, setSelected] = useState<string | null>(agents[2].id)
	const sel = agents.find((a) => a.id === selected) ?? agents[0]

	const active = agents.filter((a) => a.status === "active").length

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader
				title="AI Agents"
				description="The autonomous workers managing your portfolio. You can pause or hand off any agent."
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
				<MetricCard label="Active agents" value={`${active} / ${agents.length}`} change={{ value: "All healthy", positive: true }} />
				<MetricCard label="Actions (24h)" value="312" hint="Avg 13/hour" />
				<MetricCard label="Decisions reviewed" value="100%" hint="Compliance gate" />
				<MetricCard label="Saved fees (30d)" value="$1,840" hint="vs. broker baseline" />
			</div>

			<div className="grid lg:grid-cols-3 gap-4">
				<Card padding="none" className="lg:col-span-2">
					<SectionHeader title="Roster" className="p-4 mb-0" />
					<ul>
						{agents.map((a) => (
							<li key={a.id}>
								<button
									type="button"
									onClick={() => setSelected(a.id)}
									className={`w-full text-left flex items-center gap-3 px-4 py-3 border-t border-border/30 hover:bg-foreground/[0.02] transition-colors ${selected === a.id ? "bg-foreground/[0.03]" : ""}`}
								>
									<AgentDot tone={a.tone} />
									<div className="min-w-0 flex-1">
										<div className="text-sm font-medium">{a.name}</div>
										<div className="text-[10px] text-muted-foreground truncate">{a.lastAction}</div>
									</div>
									<div className="text-right">
										<StatusPill tone={a.status === "active" ? "success" : a.status === "paused" ? "warning" : "muted"} dot>
											{a.status}
										</StatusPill>
										<div className="text-[10px] text-muted-foreground mt-1">{a.at}</div>
									</div>
								</button>
							</li>
						))}
					</ul>
				</Card>

				<Card>
					<SectionHeader title={sel.name} description={sel.model} />
					<div className="text-xs text-muted-foreground">{sel.lastAction}</div>
					<div className="mt-4 grid grid-cols-2 gap-2">
						<button className="h-8 rounded-md border border-border/60 text-xs inline-flex items-center justify-center gap-1.5 hover:bg-card/60">
							{sel.status === "active" ? <><Pause className="size-3" /> Pause</> : <><Play className="size-3" /> Resume</>}
						</button>
						<button className="h-8 rounded-md border border-destructive/40 text-destructive text-xs inline-flex items-center justify-center gap-1.5 hover:bg-destructive/5">
							<Power className="size-3" /> Hand off
						</button>
					</div>

					<SectionHeader title="Recent decisions" className="mt-6 mb-3" />
					<ul className="space-y-3">
						{[
							"Approved buy: SGYIELD 250 USDC",
							"Skipped opportunity: Low yield, high concentration",
							"Recommended: Reduce Commodities allocation 2%",
							"Auto-applied: Coupon reinvestment",
						].map((d, i) => (
							<li key={i} className="flex items-start gap-2 text-xs">
								<span className="mt-1.5 size-1 rounded-full bg-primary shrink-0" />
								<span className="text-foreground/80">{d}</span>
							</li>
						))}
					</ul>
				</Card>
			</div>
		</div>
	)
}

function AgentDot({ tone }: { tone: AgentRow["tone"] }) {
	const cls =
		tone === "primary" ? "bg-primary" :
		tone === "info" ? "bg-blue-500" :
		tone === "warning" ? "bg-amber-500" :
		"bg-muted-foreground/40"
	return (
		<span className="relative inline-flex size-2 items-center justify-center shrink-0">
			<span className={`absolute inset-0 rounded-full ${cls} opacity-60 animate-pulse`} />
			<span className={`relative size-2 rounded-full ${cls}`} />
		</span>
	)
}

"use client"

import { Download, FileText, Filter, Search } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, EmptyState, StatusPill } from "@/components/dashboard/primitives"
import { investorDocuments } from "@/lib/mock/investor"

const TYPES = ["All", "Statement", "Tax", "Agreement", "Compliance"] as const

export default function DocumentsPage() {
	const [type, setType] = useState<typeof TYPES[number]>("All")
	const [query, setQuery] = useState("")

	const filtered = investorDocuments.filter((d) => {
		if (type !== "All" && d.type !== type) return false
		if (query && !d.name.toLowerCase().includes(query.toLowerCase())) return false
		return true
	})

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader
				title="Documents"
				description="Statements, tax forms, agreements, and compliance certificates."
				actions={
					<button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60">
						<Download className="size-3.5" /> Download all
					</button>
				}
			/>

			<Card padding="none">
				<div className="flex items-center justify-between p-4 border-b border-border/40 flex-wrap gap-3">
					<div className="flex items-center gap-1.5 flex-wrap">
						{TYPES.map((t) => (
							<button
								key={t}
								onClick={() => setType(t)}
								className={`text-xs px-2.5 h-7 rounded-md transition-colors ${
									type === t
										? "bg-foreground/10 text-foreground"
										: "text-muted-foreground hover:bg-foreground/[0.04]"
								}`}
							>
								{t}
							</button>
						))}
					</div>
					<div className="relative">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search documents…"
							className="h-8 pl-8 pr-3 text-xs bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30 w-56"
						/>
					</div>
				</div>

				{filtered.length === 0 ? (
					<EmptyState title="No documents" description="Try widening filters or wait for new statements." icon={<FileText className="size-5" />} />
				) : (
					<ul>
						{filtered.map((d) => (
							<li key={d.id} className="flex items-center gap-4 px-4 py-3.5 border-b border-border/30 last:border-0 hover:bg-foreground/[0.02]">
								<div className="size-9 rounded-lg bg-foreground/[0.04] flex items-center justify-center text-muted-foreground shrink-0">
									<FileText className="size-3.5" />
								</div>
								<div className="min-w-0 flex-1">
									<div className="text-sm font-medium truncate">{d.name}</div>
									<div className="text-[10px] text-muted-foreground mt-0.5">{d.date} · {d.size}</div>
								</div>
								<StatusPill tone="muted" dot={false}>{d.type}</StatusPill>
								<button className="size-8 inline-flex items-center justify-center rounded-md hover:bg-foreground/[0.04] text-muted-foreground hover:text-foreground">
									<Download className="size-3.5" />
								</button>
							</li>
						))}
					</ul>
				)}
			</Card>
		</div>
	)
}

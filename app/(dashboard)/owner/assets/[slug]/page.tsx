"use client"

import { ArrowLeft, Check, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, DataRow, MetricCard, SectionHeader, StatusPill } from "@/components/dashboard/primitives"
import { useApi, useFetch } from "@/lib/api/client"

type Asset = {
	id: number
	slug: string
	name: string
	category: string
	region: string | null
	description: string | null
	status: "draft" | "in_review" | "fundraising" | "live" | "closed"
	targetApy: string | null
	risk: "Low" | "Low-Med" | "Medium" | "Med-High" | "High" | null
	tenor: string | null
	minInvestment: string | null
	targetRaise: string | null
	currentRaised: string
	highlights: string[] | null
	createdAt: string
}

type HoldingRow = {
	id: number
	userId: number
	amount: string
	tokens: string
	createdAt: string
}

const fmtUsdShort = (n: number) =>
	n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`
const fmtUsd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

const STATUS_TONE: Record<Asset["status"], "success" | "info" | "warning" | "muted"> = {
	live: "success",
	fundraising: "info",
	in_review: "warning",
	draft: "muted",
	closed: "muted",
}

export default function OwnerAssetDetailPage() {
	const params = useParams<{ slug: string }>()
	const router = useRouter()
	const { fetcher } = useApi()
	const { data, loading, reload } = useFetch<{ ok: true; asset: Asset; holdings: HoldingRow[] }>(
		params.slug ? `/api/owner/assets/${params.slug}` : null,
	)
	const [editing, setEditing] = useState(false)
	const [form, setForm] = useState<Partial<Asset>>({})
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [saved, setSaved] = useState(false)

	useEffect(() => {
		if (data?.asset && !editing) {
			setForm({
				name: data.asset.name,
				category: data.asset.category,
				region: data.asset.region,
				description: data.asset.description,
				targetApy: data.asset.targetApy,
				risk: data.asset.risk,
				tenor: data.asset.tenor,
				minInvestment: data.asset.minInvestment,
				targetRaise: data.asset.targetRaise,
			})
		}
	}, [data, editing])

	if (loading) {
		return (
			<div className="px-4 lg:px-8 py-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
				<Loader2 className="size-4 animate-spin" /> Loading…
			</div>
		)
	}

	if (!data?.asset) {
		return (
			<div className="px-4 lg:px-8 py-10">
				<Link href="/owner/assets" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
					<ArrowLeft className="size-3" /> Back to assets
				</Link>
				<div className="text-sm text-muted-foreground">Asset not found.</div>
			</div>
		)
	}

	const asset = data.asset
	const investorRows = data.holdings
	const target = Number(asset.targetRaise ?? 0)
	const raised = Number(asset.currentRaised)
	const pct = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0
	const investorCount = new Set(investorRows.map((h) => h.userId)).size
	const avgTicket = investorCount > 0 ? raised / investorCount : 0

	async function save() {
		setError(null)
		setSaving(true)
		try {
			const body: Record<string, unknown> = {}
			if (form.name !== asset.name) body.name = form.name
			if (form.category !== asset.category) body.category = form.category
			if (form.region !== asset.region) body.region = form.region
			if (form.description !== asset.description) body.description = form.description
			if (form.targetApy !== asset.targetApy) body.targetApy = form.targetApy ? Number(form.targetApy) : null
			if (form.risk !== asset.risk) body.risk = form.risk
			if (form.tenor !== asset.tenor) body.tenor = form.tenor
			if (form.minInvestment !== asset.minInvestment) body.minInvestment = Number(form.minInvestment ?? 0)
			if (form.targetRaise !== asset.targetRaise) body.targetRaise = form.targetRaise ? Number(form.targetRaise) : null

			if (Object.keys(body).length === 0) {
				setEditing(false)
				return
			}
			const res = await fetcher(`/api/owner/assets/${asset.slug}`, {
				method: "PATCH",
				body: JSON.stringify(body),
			})
			const json = await res.json()
			if (!res.ok || !json.ok) throw new Error(json?.error ?? "Failed")
			setEditing(false)
			setSaved(true)
			setTimeout(() => setSaved(false), 2000)
			reload()
		} catch (e) {
			setError((e as Error).message)
		} finally {
			setSaving(false)
		}
	}

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<Link href="/owner/assets" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
				<ArrowLeft className="size-3" /> Back to assets
			</Link>

			<PageHeader
				title={asset.name}
				description={asset.description ?? "No description yet."}
				actions={
					editing ? (
						<>
							<button
								onClick={() => { setEditing(false); setError(null) }}
								disabled={saving}
								className="h-9 px-3 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60 disabled:opacity-60"
							>
								Cancel
							</button>
							<button
								onClick={save}
								disabled={saving}
								className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 disabled:opacity-60"
							>
								{saving ? <><Loader2 className="size-3.5 animate-spin" /> Saving…</> : <><Save className="size-3.5" /> Save changes</>}
							</button>
						</>
					) : (
						<>
							{saved && (
								<span className="inline-flex items-center gap-1 text-xs text-primary">
									<Check className="size-3" /> Saved
								</span>
							)}
							<button
								onClick={() => setEditing(true)}
								className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90"
							>
								Edit
							</button>
						</>
					)
				}
			/>

			<div className="flex items-center gap-2 flex-wrap">
				<StatusPill tone={STATUS_TONE[asset.status]}>{asset.status.replace("_", " ")}</StatusPill>
				<span className="text-[10px] text-muted-foreground">{asset.category} · {asset.region}</span>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
				<MetricCard label="Raised" value={fmtUsdShort(raised)} hint={target > 0 ? `of ${fmtUsdShort(target)} target` : "—"} />
				<MetricCard label="Investors" value={String(investorCount)} hint="Unique wallets" />
				<MetricCard label="Avg ticket" value={fmtUsd(avgTicket)} />
				<MetricCard label="Target APY" value={`${Number(asset.targetApy ?? 0).toFixed(1)}%`} change={{ value: "Target", positive: true }} />
			</div>

			<div className="grid lg:grid-cols-3 gap-4">
				<Card className="lg:col-span-2">
					<SectionHeader title="Details" description={editing ? "Update fields and save" : "Read-only view of submitted info"} />
					<div className="grid sm:grid-cols-2 gap-4">
						<Field label="Name" value={form.name ?? ""} onChange={(v) => setForm((f) => ({ ...f, name: v }))} editing={editing} />
						<SelectField label="Category" value={form.category ?? ""} onChange={(v) => setForm((f) => ({ ...f, category: v }))} options={["Real Estate", "Private Credit", "Treasuries", "Infrastructure", "Commodities"]} editing={editing} />
						<SelectField label="Region" value={form.region ?? ""} onChange={(v) => setForm((f) => ({ ...f, region: v }))} options={["Singapore", "Malaysia", "Philippines", "Indonesia", "Vietnam", "United States", "LatAm", "Other"]} editing={editing} />
						<SelectField label="Risk" value={form.risk ?? ""} onChange={(v) => setForm((f) => ({ ...f, risk: v as Asset["risk"] }))} options={["Low", "Low-Med", "Medium", "Med-High", "High"]} editing={editing} />
						<Field label="Target APY (%)" value={form.targetApy ?? ""} onChange={(v) => setForm((f) => ({ ...f, targetApy: v }))} editing={editing} />
						<Field label="Tenor" value={form.tenor ?? ""} onChange={(v) => setForm((f) => ({ ...f, tenor: v }))} editing={editing} />
						<Field label="Min investment" value={form.minInvestment ?? ""} onChange={(v) => setForm((f) => ({ ...f, minInvestment: v }))} editing={editing} />
						<Field label="Target raise" value={form.targetRaise ?? ""} onChange={(v) => setForm((f) => ({ ...f, targetRaise: v }))} editing={editing} />
						<TextAreaField label="Description" value={form.description ?? ""} onChange={(v) => setForm((f) => ({ ...f, description: v }))} editing={editing} />
					</div>
					{error && <div className="mt-3 text-xs text-destructive">{error}</div>}
				</Card>

				<Card>
					<SectionHeader title="Fundraising" description="Progress toward target" />
					<div className="flex items-end justify-between mb-2">
						<div className="text-2xl font-medium tabular-nums">{fmtUsdShort(raised)}</div>
						<div className="text-right text-primary font-medium tabular-nums">{pct}%</div>
					</div>
					<div className="h-2 rounded-full bg-border/40 overflow-hidden">
						<div className="h-full bg-primary" style={{ width: `${pct}%` }} />
					</div>
					<div className="text-[10px] font-mono text-muted-foreground mt-1">of {fmtUsdShort(target)} target</div>

					<SectionHeader title="Recent investors" className="mt-6 mb-2" />
					{investorRows.length === 0 ? (
						<div className="text-xs text-muted-foreground py-2">No investors yet.</div>
					) : (
						<ul className="space-y-2">
							{investorRows.slice(0, 5).map((h) => (
								<li key={h.id} className="flex items-center justify-between text-xs">
									<span className="text-muted-foreground">Wallet #{h.userId}</span>
									<span className="tabular-nums font-medium">{fmtUsd(Number(h.amount))}</span>
								</li>
							))}
						</ul>
					)}
				</Card>
			</div>

			<Card>
				<SectionHeader title="Status & lifecycle" />
				<DataRow label="Status" value={<StatusPill tone={STATUS_TONE[asset.status]}>{asset.status.replace("_", " ")}</StatusPill>} />
				<DataRow label="Created" value={new Date(asset.createdAt).toLocaleString()} />
				<DataRow label="Slug" value={asset.slug} mono />
				<DataRow label="Total positions" value={String(investorRows.length)} mono />
				{asset.status === "in_review" && (
					<div className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
						This asset is awaiting platform review. You'll be notified once it's approved.
					</div>
				)}
			</Card>
		</div>
	)
}

function Field({ label, value, onChange, editing }: { label: string; value: string; onChange: (v: string) => void; editing: boolean }) {
	if (!editing) {
		return (
			<div>
				<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</div>
				<div className="mt-1 text-sm">{value || "—"}</div>
			</div>
		)
	}
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</span>
			<input value={value} onChange={(e) => onChange(e.target.value)} className="h-9 px-3 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30" />
		</label>
	)
}

function SelectField({ label, value, onChange, options, editing }: { label: string; value: string; onChange: (v: string) => void; options: string[]; editing: boolean }) {
	if (!editing) {
		return (
			<div>
				<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</div>
				<div className="mt-1 text-sm">{value || "—"}</div>
			</div>
		)
	}
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</span>
			<select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 px-3 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30">
				{options.map((o) => <option key={o}>{o}</option>)}
			</select>
		</label>
	)
}

function TextAreaField({ label, value, onChange, editing }: { label: string; value: string; onChange: (v: string) => void; editing: boolean }) {
	if (!editing) {
		return (
			<div className="sm:col-span-2">
				<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</div>
				<div className="mt-1 text-sm whitespace-pre-wrap">{value || "—"}</div>
			</div>
		)
	}
	return (
		<label className="flex flex-col gap-1.5 sm:col-span-2">
			<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</span>
			<textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="px-3 py-2 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30 resize-y" />
		</label>
	)
}

"use client"

import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, SectionHeader } from "@/components/dashboard/primitives"
import { useApi } from "@/lib/api/client"

const STEPS = [
	{ id: 1, title: "Asset basics", description: "Name, category, region" },
	{ id: 2, title: "Economics", description: "Target raise, APY, tenor" },
	{ id: 3, title: "Documents", description: "Offering memo, diligence" },
	{ id: 4, title: "Compliance", description: "Restrictions and disclosures" },
	{ id: 5, title: "Review", description: "Submit for AI underwriting" },
] as const

type FormState = {
	name: string
	category: string
	region: string
	description: string
	targetRaise: string
	minInvestment: string
	targetApy: string
	tenor: string
	risk: "Low" | "Low-Med" | "Medium" | "Med-High" | "High"
}

export default function NewAssetPage() {
	const router = useRouter()
	const { fetcher } = useApi()
	const [step, setStep] = useState(1)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [form, setForm] = useState<FormState>({
		name: "",
		category: "Real Estate",
		region: "Singapore",
		description: "",
		targetRaise: "",
		minInvestment: "10",
		targetApy: "",
		tenor: "Open-ended",
		risk: "Low-Med",
	})

	function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm((s) => ({ ...s, [key]: value }))
	}

	async function submit() {
		if (!form.name.trim()) {
			setError("Asset name is required")
			setStep(1)
			return
		}
		setError(null)
		setSubmitting(true)
		try {
			const res = await fetcher("/api/owner/assets", {
				method: "POST",
				body: JSON.stringify({
					name: form.name.trim(),
					category: form.category,
					region: form.region,
					description: form.description || undefined,
					targetRaise: form.targetRaise ? Number(form.targetRaise.replace(/,/g, "")) : undefined,
					minInvestment: form.minInvestment ? Number(form.minInvestment) : undefined,
					targetApy: form.targetApy ? Number(form.targetApy) : undefined,
					tenor: form.tenor || undefined,
					risk: form.risk,
				}),
			})
			const data = await res.json()
			if (!res.ok || !data.ok) {
				throw new Error(data?.error ?? "Failed to submit")
			}
			router.push("/owner/assets")
		} catch (err) {
			setError((err as Error).message)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<div>
				<Link href="/owner/assets" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
					<ArrowLeft className="size-3" /> Back to assets
				</Link>
			</div>

			<PageHeader
				title="List a new asset"
				description="Submit your RWA for AI underwriting. Most reviews complete in 48 hours."
			/>

			<div className="grid lg:grid-cols-[260px_1fr] gap-6">
				<ol className="space-y-1">
					{STEPS.map((s) => {
						const done = s.id < step
						const active = s.id === step
						return (
							<li key={s.id}>
								<button
									onClick={() => setStep(s.id)}
									className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
										active ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.03]"
									}`}
								>
									<div className={`size-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
										done ? "bg-primary text-primary-foreground" :
										active ? "bg-foreground text-background" :
										"bg-foreground/[0.06] text-muted-foreground"
									}`}>
										{done ? <Check className="size-3" /> : s.id}
									</div>
									<div className="min-w-0">
										<div className={`text-xs font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</div>
										<div className="text-[10px] text-muted-foreground mt-0.5">{s.description}</div>
									</div>
								</button>
							</li>
						)
					})}
				</ol>

				<Card>
					{step === 1 && (
						<>
							<SectionHeader title="Asset basics" />
							<div className="grid sm:grid-cols-2 gap-4">
								<TextField label="Asset name" value={form.name} onChange={(v) => setField("name", v)} placeholder="e.g. KL Tower Office REIT V" />
								<SelectField label="Category" value={form.category} onChange={(v) => setField("category", v)} options={["Real Estate", "Private Credit", "Treasuries", "Infrastructure", "Commodities"]} />
								<SelectField label="Region" value={form.region} onChange={(v) => setField("region", v)} options={["Singapore", "Malaysia", "Philippines", "Indonesia", "Vietnam", "United States", "Other"]} />
								<SelectField label="Risk band" value={form.risk} onChange={(v) => setField("risk", v as FormState["risk"])} options={["Low", "Low-Med", "Medium", "Med-High", "High"]} />
								<TextAreaField label="Short description" value={form.description} onChange={(v) => setField("description", v)} placeholder="One paragraph for investor cards" />
							</div>
						</>
					)}

					{step === 2 && (
						<>
							<SectionHeader title="Economics" />
							<div className="grid sm:grid-cols-2 gap-4">
								<TextField label="Target raise (USD)" value={form.targetRaise} onChange={(v) => setField("targetRaise", v)} placeholder="6,000,000" />
								<TextField label="Minimum investment (USD)" value={form.minInvestment} onChange={(v) => setField("minInvestment", v)} placeholder="10" />
								<TextField label="Target APY (%)" value={form.targetApy} onChange={(v) => setField("targetApy", v)} placeholder="9.1" />
								<TextField label="Tenor" value={form.tenor} onChange={(v) => setField("tenor", v)} placeholder="Open-ended or 5y" />
							</div>
						</>
					)}

					{step === 3 && (
						<>
							<SectionHeader title="Documents" description="Drag and drop or browse" />
							<div className="grid sm:grid-cols-2 gap-4">
								{["Offering memorandum", "Property appraisal", "Asset manager agreement", "Audited financials"].map((label) => (
									<div key={label} className="rounded-lg border border-dashed border-border/60 p-5 text-center">
										<Upload className="size-5 mx-auto text-muted-foreground" />
										<div className="text-sm font-medium mt-3">{label}</div>
										<div className="text-[10px] text-muted-foreground mt-1">PDF · max 25 MB</div>
										<button className="mt-3 h-7 px-3 rounded-md bg-foreground/[0.06] text-xs">Upload</button>
									</div>
								))}
							</div>
						</>
					)}

					{step === 4 && (
						<>
							<SectionHeader title="Compliance" description="Tell investors what to expect" />
							<div className="space-y-4">
								<SelectField label="Investor accreditation" options={["Open to retail", "Accredited only", "Institutional only"]} />
								<SelectField label="Geographic restrictions" options={["None", "Excluding US", "Excluding sanctioned jurisdictions", "Custom"]} />
								<TextAreaField label="Risk factors" placeholder="Briefly summarize the top 3 risks" />
								<label className="flex items-start gap-2 text-xs text-muted-foreground">
									<input type="checkbox" className="mt-0.5" />
									I attest that the information above is accurate and the offering complies with applicable law.
								</label>
							</div>
						</>
					)}

					{step === 5 && (
						<>
							<SectionHeader title="Ready to submit" description="Our underwriting agents will review within 48h" />
							<div className="rounded-lg border border-border/60 bg-card/40 p-5">
								<div className="flex items-start gap-3">
									<div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
										<Sparkles className="size-4" />
									</div>
									<div>
										<div className="text-sm font-medium">{form.name || "(Unnamed asset)"}</div>
										<div className="text-xs text-muted-foreground mt-0.5">{form.category} · {form.region} · {form.tenor}</div>
									</div>
								</div>
								<div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-border/30">
									<KV label="Target raise" value={form.targetRaise ? `$${form.targetRaise}` : "—"} />
									<KV label="Target APY" value={form.targetApy ? `${form.targetApy}%` : "—"} />
									<KV label="Risk" value={form.risk} />
								</div>
							</div>
							{error && <div className="mt-3 text-xs text-destructive">{error}</div>}
						</>
					)}

					<div className="mt-8 flex items-center justify-between">
						<button
							disabled={step === 1 || submitting}
							onClick={() => setStep((s) => Math.max(1, s - 1))}
							className="h-9 px-4 rounded-md border border-border/60 text-xs font-medium hover:bg-card/60 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Back
						</button>
						{step < STEPS.length ? (
							<button
								onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
								className="h-9 px-4 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 inline-flex items-center gap-1.5"
							>
								Continue <ArrowRight className="size-3.5" />
							</button>
						) : (
							<button
								onClick={submit}
								disabled={submitting}
								className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 inline-flex items-center gap-1.5 disabled:opacity-60"
							>
								{submitting ? <><Loader2 className="size-3.5 animate-spin" /> Submitting…</> : <>Submit for review <Check className="size-3.5" /></>}
							</button>
						)}
					</div>
				</Card>
			</div>
		</div>
	)
}

function TextField({ label, placeholder, value, onChange }: { label: string; placeholder?: string; value?: string; onChange?: (v: string) => void }) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</span>
			<input type="text" value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className="h-9 px-3 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30" />
		</label>
	)
}

function SelectField({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange?: (v: string) => void }) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</span>
			<select value={value} onChange={(e) => onChange?.(e.target.value)} className="h-9 px-3 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30">
				{options.map((o) => <option key={o}>{o}</option>)}
			</select>
		</label>
	)
}

function TextAreaField({ label, placeholder, value, onChange }: { label: string; placeholder?: string; value?: string; onChange?: (v: string) => void }) {
	return (
		<label className="flex flex-col gap-1.5 sm:col-span-2">
			<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</span>
			<textarea rows={3} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className="px-3 py-2 text-sm bg-card/60 border border-border/40 rounded-md outline-none focus:border-foreground/30 resize-y" />
		</label>
	)
}

function KV({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60">{label}</div>
			<div className="text-sm font-medium mt-0.5">{value}</div>
		</div>
	)
}

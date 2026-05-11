"use client"

import { Bell, Globe, Lock, Shield, User as UserIcon } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, DataRow, SectionHeader, StatusPill } from "@/components/dashboard/primitives"
import { useDashboardUser } from "@/components/dashboard/gate"

const SECTIONS = [
	{ id: "profile", label: "Profile", icon: UserIcon },
	{ id: "kyc", label: "KYC", icon: Shield },
	{ id: "security", label: "Security", icon: Lock },
	{ id: "notifications", label: "Notifications", icon: Bell },
	{ id: "preferences", label: "Preferences", icon: Globe },
] as const

type SectionId = typeof SECTIONS[number]["id"]

export default function SettingsPage() {
	const user = useDashboardUser()
	const [section, setSection] = useState<SectionId>("profile")

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader title="Settings" description="Manage your profile, security, and preferences." />

			<div className="grid lg:grid-cols-[200px_1fr] gap-6">
				<nav className="space-y-1">
					{SECTIONS.map((s) => {
						const Icon = s.icon
						const active = section === s.id
						return (
							<button
								key={s.id}
								onClick={() => setSection(s.id)}
								className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md text-left transition-colors ${
									active
										? "bg-foreground/[0.06] text-foreground"
										: "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
								}`}
							>
								<Icon className="size-4" /> {s.label}
							</button>
						)
					})}
				</nav>

				<div className="space-y-4">
					{section === "profile" && (
						<Card>
							<SectionHeader title="Profile" description="How others see you on Fractionax" />
							<div className="grid sm:grid-cols-2 gap-4">
								<Field label="Display name" value={user.displayName ?? "—"} />
								<Field label="Email" value={user.email ?? "—"} />
								<Field label="Wallet" value={user.walletAddress ?? "—"} mono />
								<Field label="Member since" value={new Date(user.createdAt).toLocaleDateString()} />
							</div>
						</Card>
					)}

					{section === "kyc" && (
						<Card>
							<SectionHeader title="KYC verification" description="Required for funds above $10,000" />
							<DataRow label="Identity" value={<StatusPill tone="success">Verified</StatusPill>} />
							<DataRow label="Address" value={<StatusPill tone="success">Verified</StatusPill>} />
							<DataRow label="Source of funds" value={<StatusPill tone="success">Verified</StatusPill>} />
							<DataRow label="Accreditation" value={<StatusPill tone="pending">Pending review</StatusPill>} />
							<DataRow label="Tax residency" value="Singapore" />
						</Card>
					)}

					{section === "security" && (
						<Card>
							<SectionHeader title="Security" description="Protect your account and assets" />
							<DataRow label="Sign-in method" value="Privy · Phantom wallet" />
							<DataRow label="2-factor authentication" value={<StatusPill tone="success">On</StatusPill>} />
							<DataRow label="Withdraw whitelist" value={<StatusPill tone="muted">Off</StatusPill>} />
							<DataRow label="Active sessions" value="2 devices" />
							<div className="mt-4">
								<button className="h-9 px-4 rounded-md border border-destructive/40 text-destructive text-xs font-medium hover:bg-destructive/5">
									Sign out all sessions
								</button>
							</div>
						</Card>
					)}

					{section === "notifications" && (
						<Card>
							<SectionHeader title="Notifications" description="Pick the events you care about" />
							{[
								{ k: "Yield distributions", c: true },
								{ k: "Rebalance summaries", c: true },
								{ k: "New opportunities matching my preferences", c: true },
								{ k: "Tax & statement reminders", c: false },
								{ k: "Compliance updates", c: true },
							].map((n) => (
								<div key={n.k} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
									<span className="text-sm">{n.k}</span>
									<Toggle defaultOn={n.c} />
								</div>
							))}
						</Card>
					)}

					{section === "preferences" && (
						<Card>
							<SectionHeader title="Preferences" />
							<DataRow label="Display currency" value="USD" />
							<DataRow label="Region" value="Singapore" />
							<DataRow label="Language" value="English" />
							<DataRow label="Theme" value="System" />
						</Card>
					)}
				</div>
			</div>
		</div>
	)
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
	return (
		<div>
			<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 mb-1">{label}</div>
			<div className={`text-sm ${mono ? "font-mono break-all" : ""}`}>{value}</div>
		</div>
	)
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
	const [on, setOn] = useState(defaultOn)
	return (
		<button
			type="button"
			onClick={() => setOn((v) => !v)}
			className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-primary" : "bg-border/60"}`}
			aria-pressed={on}
		>
			<span className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-background shadow transition-transform ${on ? "translate-x-4" : ""}`} />
		</button>
	)
}

"use client"

import { Building2, CreditCard, Lock, Shield, Users } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, DataRow, SectionHeader, StatusPill } from "@/components/dashboard/primitives"
import { useDashboardUser } from "@/components/dashboard/gate"

const SECTIONS = [
	{ id: "org", label: "Organization", icon: Building2 },
	{ id: "team", label: "Team", icon: Users },
	{ id: "kyb", label: "KYB", icon: Shield },
	{ id: "billing", label: "Treasury", icon: CreditCard },
	{ id: "security", label: "Security", icon: Lock },
] as const

type SectionId = typeof SECTIONS[number]["id"]

export default function OwnerSettingsPage() {
	const user = useDashboardUser()
	const [section, setSection] = useState<SectionId>("org")

	return (
		<div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6">
			<PageHeader title="Organization" description="Settings, team, compliance, and treasury." />

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
									active ? "bg-foreground/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
								}`}
							>
								<Icon className="size-4" /> {s.label}
							</button>
						)
					})}
				</nav>

				<div className="space-y-4">
					{section === "org" && (
						<Card>
							<SectionHeader title="Organization" />
							<div className="grid sm:grid-cols-2 gap-4">
								<Field label="Legal name" value="KL Capital Pte. Ltd." />
								<Field label="Trading name" value="KL Capital" />
								<Field label="Jurisdiction" value="Singapore" />
								<Field label="Registration #" value="202418729K" mono />
								<Field label="Primary contact" value={user.email ?? "—"} />
								<Field label="Treasury wallet" value={user.walletAddress ?? "—"} mono />
							</div>
						</Card>
					)}

					{section === "team" && (
						<Card padding="none">
							<SectionHeader title="Team" description="3 members · 1 invite pending" className="p-5 mb-0" />
							<ul className="border-t border-border/40">
								{[
									{ name: "Hua Lin", email: "hua@klcap.io", role: "Owner" },
									{ name: "Faiz Hassan", email: "faiz@klcap.io", role: "Operator" },
									{ name: "Sarah Tan", email: "sarah@klcap.io", role: "Reviewer" },
									{ name: "—", email: "ops@klcap.io", role: "Pending invite" },
								].map((m, i) => (
									<li key={i} className="flex items-center gap-3 px-5 py-3 border-b border-border/30 last:border-0">
										<div className="size-9 rounded-md bg-primary/10 text-primary text-xs font-medium inline-flex items-center justify-center">
											{m.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
										</div>
										<div className="min-w-0 flex-1">
											<div className="text-sm font-medium">{m.name}</div>
											<div className="text-[10px] text-muted-foreground">{m.email}</div>
										</div>
										<StatusPill tone={m.role === "Pending invite" ? "warning" : "muted"} dot={false}>{m.role}</StatusPill>
									</li>
								))}
							</ul>
							<div className="p-4 border-t border-border/40">
								<button className="h-9 px-4 rounded-md bg-foreground text-background text-xs font-medium">Invite member</button>
							</div>
						</Card>
					)}

					{section === "kyb" && (
						<Card>
							<SectionHeader title="KYB verification" />
							<DataRow label="Entity verification" value={<StatusPill tone="success">Verified</StatusPill>} />
							<DataRow label="UBO disclosure" value={<StatusPill tone="success">Complete</StatusPill>} />
							<DataRow label="Source of funds" value={<StatusPill tone="success">Verified</StatusPill>} />
							<DataRow label="Sanctions screening" value={<StatusPill tone="success">Clear</StatusPill>} />
							<DataRow label="Legal opinion" value={<StatusPill tone="pending">Under review</StatusPill>} />
							<DataRow label="Last review" value="Apr 22, 2026" />
						</Card>
					)}

					{section === "billing" && (
						<Card>
							<SectionHeader title="Treasury" description="On-chain accounts that receive raised capital" />
							<DataRow label="Default chain" value="Solana mainnet" />
							<DataRow label="Settlement asset" value="USDC" />
							<DataRow label="Treasury wallet" value="5xQ9hZ…vK4nMz" mono />
							<DataRow label="Multisig signers" value="2 of 3" />
							<DataRow label="Platform fee" value="1.0% of raise" />
						</Card>
					)}

					{section === "security" && (
						<Card>
							<SectionHeader title="Security" />
							<DataRow label="Sign-in method" value="Privy · Phantom wallet" />
							<DataRow label="2-factor authentication" value={<StatusPill tone="success">Required (org)</StatusPill>} />
							<DataRow label="API keys" value="2 active · 1 revoked" />
							<DataRow label="Audit log retention" value="365 days" />
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

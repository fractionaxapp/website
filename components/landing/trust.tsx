"use client"

import { motion } from "framer-motion"
import { Lock, Eye, Wallet, Zap } from "lucide-react"
import { SectionHeader } from "./section-header"

const PILLARS = [
	{
		icon: Lock,
		title: "You own it. Not us.",
		desc: "Every position is held in your wallet — tokenized, transferable, yours. We can't freeze it. You can withdraw any time.",
	},
	{
		icon: Eye,
		title: "Nothing is hidden.",
		desc: "Every agent decision, every fee, every cash flow is on-chain and inspectable. Receipts, not promises.",
	},
	{
		icon: Wallet,
		title: "Real custody.",
		desc: "Assets are held by regulated custodians and originators with multi-sig controls. We don't touch principal.",
	},
	{
		icon: Zap,
		title: "Solana-fast.",
		desc: "Settles in under a second for fractions of a cent. So your AI can move when it matters — without burning your returns on fees.",
	},
]

export function Trust() {
	return (
		<section id="trust" className="relative py-24 lg:py-32">
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10">
				<div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
					<div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
						<SectionHeader
							eyebrow="Trust & safety"
							title={
								<>
									Built so you can{" "}
									<span className="text-muted-foreground">actually sleep at night.</span>
								</>
							}
							description="Autonomous doesn't mean opaque. The same machinery that moves money for institutions runs in the open here — for you."
						/>
						<div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
							<Badge label="SOC 2" sub="Type II" />
							<Badge label="MiCA" sub="EU ready" />
							<Badge label="On-chain" sub="100%" />
						</div>
					</div>

					<div className="lg:col-span-7 space-y-3">
						{PILLARS.map((p, i) => (
							<motion.div
								key={p.title}
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-60px" }}
								transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
								className="group flex gap-5 rounded-2xl border border-border/50 bg-card/30 backdrop-blur p-6 lg:p-7 hover:border-border transition-colors"
							>
								<div className="inline-flex size-11 items-center justify-center rounded-xl border border-border/60 bg-background/50 shrink-0">
									<p.icon className="size-5" />
								</div>
								<div className="flex flex-col">
									<h3 className="font-display text-xl lg:text-2xl mb-2">{p.title}</h3>
									<p className="text-muted-foreground text-balance">{p.desc}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

function Badge({ label, sub }: { label: string; sub: string }) {
	return (
		<div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card/30 backdrop-blur py-3">
			<div className="font-display text-base">{label}</div>
			<div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">{sub}</div>
		</div>
	)
}

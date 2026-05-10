"use client"

import { motion } from "framer-motion"
import { Compass, Microscope, Zap, Gauge } from "lucide-react"
import { SectionHeader } from "./section-header"

const AGENTS = [
	{
		icon: Compass,
		name: "Scout",
		role: "Sourcing",
		desc: "Reads thousands of listings, filings, and originator feeds — surfaces only what fits your goal.",
		bullets: ["Scans 47 sources continuously", "Filters by your risk + horizon", "Never sleeps"],
	},
	{
		icon: Microscope,
		name: "Analyst",
		role: "Underwriting",
		desc: "Models cash flow, stress-tests downside, reads the legal docs — every deal, every time.",
		bullets: ["Cash-flow + scenario modeling", "Counterparty + collateral checks", "Receipts, not vibes"],
	},
	{
		icon: Zap,
		name: "Trader",
		role: "Execution",
		desc: "Settles your allocations on Solana — sub-second finality, fractions of a cent in fees.",
		bullets: ["Atomic on-chain settlement", "Slippage-aware sizing", "Full audit trail"],
	},
	{
		icon: Gauge,
		name: "Manager",
		role: "Portfolio",
		desc: "Watches your portfolio every minute. Rebalances when something drifts, takes profits when it makes sense.",
		bullets: ["Continuous rebalancing", "Tax-aware harvesting", "Stays inside your guardrails"],
	},
]

export function Agents() {
	return (
		<section id="agents" className="relative py-24 lg:py-32 overflow-hidden">
			<div className="absolute inset-0 -z-10">
				<div className="absolute left-1/2 top-1/3 -translate-x-1/2 size-[800px] glow-primary blur-3xl opacity-25" />
			</div>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10">
				<SectionHeader
					eyebrow="Your AI team"
					align="center"
					title={
						<>
							Four agents.
							<br />
							<span className="text-muted-foreground">One job: your money working.</span>
						</>
					}
					description="They specialize, they coordinate, they don't take days off. You see what they did and why — every action, on the record."
					className="mx-auto"
				/>

				<div className="mt-16 lg:mt-24 grid gap-4 lg:grid-cols-4">
					{AGENTS.map((agent, i) => (
						<motion.div
							key={agent.name}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
							className="group relative flex flex-col rounded-3xl border border-border/50 bg-card/30 backdrop-blur p-6 lg:p-7 hover:border-primary/40 transition-colors"
						>
							<div className="flex items-start justify-between mb-12 lg:mb-16">
								<div className="relative">
									<div className="absolute inset-0 glow-primary blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
									<div className="relative inline-flex size-11 items-center justify-center rounded-xl border border-border/60 bg-background/60">
										<agent.icon className="size-5" />
									</div>
								</div>
								<div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
									{agent.role}
								</div>
							</div>

							<h3 className="font-display text-3xl mb-3">{agent.name}</h3>
							<p className="text-sm text-muted-foreground text-balance mb-6">{agent.desc}</p>

							<ul className="space-y-2 mt-auto pt-5 border-t border-border/40">
								{agent.bullets.map((b) => (
									<li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
										<span className="size-1 rounded-full bg-primary shrink-0" />
										{b}
									</li>
								))}
							</ul>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-60px" }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground"
				>
					<span className="size-1.5 rounded-full bg-primary animate-pulse-soft" />
					Every action is signed, on-chain, and visible to you.
				</motion.div>
			</div>
		</section>
	)
}

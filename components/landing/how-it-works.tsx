"use client"

import { motion } from "framer-motion"
import { Target, Sparkles, LineChart } from "lucide-react"
import { SectionHeader } from "./section-header"

const STEPS = [
	{
		num: "01",
		icon: Target,
		title: "Set your goal.",
		desc: "Tell us what you want — steady income, long-term growth, or something in between. Adjust your risk, horizon, and minimums.",
		mock: (
			<div className="space-y-3">
				<div className="flex items-center justify-between text-xs">
					<span className="text-muted-foreground font-mono">GOAL</span>
					<span className="font-medium">Steady income</span>
				</div>
				<div className="h-px bg-border/40" />
				<div className="flex items-center justify-between text-xs">
					<span className="text-muted-foreground font-mono">RISK</span>
					<div className="flex gap-1">
						<span className="h-1.5 w-6 rounded-full bg-primary" />
						<span className="h-1.5 w-6 rounded-full bg-primary/40" />
						<span className="h-1.5 w-6 rounded-full bg-border/60" />
					</div>
				</div>
				<div className="flex items-center justify-between text-xs">
					<span className="text-muted-foreground font-mono">HORIZON</span>
					<span className="font-medium">5+ years</span>
				</div>
				<div className="flex items-center justify-between text-xs">
					<span className="text-muted-foreground font-mono">DEPOSIT</span>
					<span className="font-medium tabular-nums">$25,000</span>
				</div>
			</div>
		),
	},
	{
		num: "02",
		icon: Sparkles,
		title: "AI agents go to work.",
		desc: "Four agents source deals, underwrite them, execute on-chain, and rebalance — every minute, on Solana.",
		mock: (
			<div className="space-y-2.5">
				{[
					{ a: "Scout", t: "Sourced 47 opportunities", c: "primary" },
					{ a: "Analyst", t: "Underwrote 12 · passed 4", c: "primary" },
					{ a: "Trader", t: "Executed $8,250 → 3 deals", c: "primary" },
					{ a: "Manager", t: "Rebalanced — yield +0.4%", c: "primary" },
				].map((s, i) => (
					<div key={i} className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/50 px-2.5 py-2">
						<span className="size-1.5 rounded-full bg-primary animate-pulse-soft" />
						<span className="text-xs font-mono uppercase tracking-wider text-muted-foreground w-14">{s.a}</span>
						<span className="text-xs flex-1 truncate">{s.t}</span>
					</div>
				))}
			</div>
		),
	},
	{
		num: "03",
		icon: LineChart,
		title: "Watch it grow.",
		desc: "See exactly what you own, where the yield comes from, and how it's performing. Withdraw any time.",
		mock: (
			<div className="space-y-3">
				<div className="flex items-baseline justify-between">
					<span className="font-display text-2xl tabular-nums">$27,418</span>
					<span className="text-xs text-primary font-mono">+9.67% YTD</span>
				</div>
				<div className="relative h-16">
					<svg viewBox="0 0 200 60" className="absolute inset-0 size-full" preserveAspectRatio="none">
						<defs>
							<linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="oklch(0.6736 0.1265 172.43)" stopOpacity="0.4" />
								<stop offset="100%" stopColor="oklch(0.6736 0.1265 172.43)" stopOpacity="0" />
							</linearGradient>
						</defs>
						<path
							d="M 0 50 L 20 46 L 40 48 L 60 40 L 80 36 L 100 38 L 120 28 L 140 22 L 160 18 L 180 12 L 200 8 L 200 60 L 0 60 Z"
							fill="url(#chart-fill)"
						/>
						<path
							d="M 0 50 L 20 46 L 40 48 L 60 40 L 80 36 L 100 38 L 120 28 L 140 22 L 160 18 L 180 12 L 200 8"
							fill="none"
							stroke="oklch(0.6736 0.1265 172.43)"
							strokeWidth="1.5"
							strokeLinecap="round"
							vectorEffect="non-scaling-stroke"
						/>
					</svg>
				</div>
				<div className="grid grid-cols-3 gap-2 text-center pt-1">
					<div>
						<div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Yield</div>
						<div className="text-xs font-medium tabular-nums">9.4%</div>
					</div>
					<div>
						<div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Assets</div>
						<div className="text-xs font-medium tabular-nums">14</div>
					</div>
					<div>
						<div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Cash</div>
						<div className="text-xs font-medium tabular-nums">$192</div>
					</div>
				</div>
			</div>
		),
	},
]

export function HowItWorks() {
	return (
		<section id="how" className="relative py-24 lg:py-32">
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10">
				<SectionHeader
					eyebrow="How it works"
					align="center"
					title={<>Three steps. Then nothing.</>}
					description="Setup takes about a minute. After that, your AI doesn't stop."
					className="mx-auto"
				/>

				<div className="mt-16 lg:mt-24 grid gap-6 lg:gap-8 lg:grid-cols-3 relative">
					<div className="hidden lg:block absolute top-32 left-[16%] right-[16%] h-px divider-soft" aria-hidden />
					{STEPS.map((step, i) => (
						<motion.div
							key={step.num}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-80px" }}
							transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
							className="relative flex flex-col"
						>
							<div className="flex items-center gap-4 mb-8">
								<div className="relative inline-flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-card/40 backdrop-blur">
									<step.icon className="size-5" />
								</div>
								<div className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
									Step {step.num}
								</div>
							</div>
							<h3 className="font-display text-2xl lg:text-3xl mb-3 text-balance">{step.title}</h3>
							<p className="text-muted-foreground text-balance mb-6">{step.desc}</p>
							<div className="mt-auto rounded-2xl border border-border/50 bg-card/30 backdrop-blur p-5">
								{step.mock}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}

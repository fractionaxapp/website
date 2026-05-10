"use client"

import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { HeroVisual } from "./hero-visual"

export function Hero() {
	return (
		<section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 overflow-hidden">
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-grid bg-grid-fade opacity-40" />
				<div className="absolute left-1/2 top-32 -translate-x-1/2 size-[800px] glow-primary opacity-60 blur-3xl" />
			</div>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10">
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="flex justify-center"
				>
					<a
						href="#how"
						className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 backdrop-blur px-3 py-1.5 text-xs"
					>
						<span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary px-2 py-0.5 font-mono uppercase tracking-wider text-[10px]">
							New
						</span>
						<span className="text-muted-foreground">
							AI agents are now investing real capital on Solana
						</span>
						<ArrowRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
					</a>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.05, ease: "easeOut" }}
					className="font-display mt-8 lg:mt-10 text-center text-balance text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.92] font-medium"
				>
					Real-world wealth,
					<br className="hidden sm:block" />
					<span className="relative inline-block">
						<span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
							on autopilot.
						</span>
					</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
					className="mx-auto mt-6 lg:mt-8 max-w-2xl text-center text-balance text-base lg:text-lg text-muted-foreground"
				>
					Set a goal. Your AI invests in real estate, private credit, and yield-bearing
					assets — and keeps your portfolio working 24/7. No spreadsheets, no broker calls,
					no late-night dashboards.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
					className="mt-8 lg:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
				>
					<a
						href="#waitlist"
						className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground text-background pl-6 pr-2 text-sm font-medium hover:opacity-90 transition-opacity"
					>
						Start investing
						<span className="inline-flex size-9 items-center justify-center rounded-full bg-background/15">
							<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</span>
					</a>
					<a
						href="#how"
						className="inline-flex h-12 items-center gap-2 rounded-full border border-border/60 bg-card/40 backdrop-blur px-5 text-sm font-medium hover:bg-card/70 transition-colors"
					>
						<Play className="size-3.5" />
						See how it works
						<span className="text-muted-foreground font-mono text-[10px] ml-1">90s</span>
					</a>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
					className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
				>
					<span className="inline-flex items-center gap-1.5">
						<span className="size-1 rounded-full bg-primary" /> No crypto knowledge required
					</span>
					<span className="inline-flex items-center gap-1.5">
						<span className="size-1 rounded-full bg-primary" /> Withdraw anytime
					</span>
					<span className="inline-flex items-center gap-1.5">
						<span className="size-1 rounded-full bg-primary" /> Built on Solana
					</span>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
					className="mt-14 lg:mt-20"
				>
					<HeroVisual />
				</motion.div>
			</div>
		</section>
	)
}

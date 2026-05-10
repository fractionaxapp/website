"use client"

import { motion } from "framer-motion"
import { Building2, Banknote, Factory, TrendingUp, ArrowUpRight } from "lucide-react"
import { SectionHeader } from "./section-header"

const ASSETS = [
	{
		icon: Building2,
		name: "Real estate",
		blurb: "Income-producing properties — rentals, multifamily, commercial.",
		stat: "6 – 12% / yr",
		statLabel: "Target net yield",
		examples: ["Phoenix multifamily", "Lisbon short-term", "Atlanta industrial"],
	},
	{
		icon: Banknote,
		name: "Private credit",
		blurb: "Loans to vetted businesses. Senior-secured, contracted cash flow.",
		stat: "9 – 14% / yr",
		statLabel: "Target net yield",
		examples: ["SMB working capital", "Receivables", "Trade finance"],
	},
	{
		icon: Factory,
		name: "Infrastructure",
		blurb: "Real assets the modern economy runs on — energy, networks, logistics.",
		stat: "7 – 11% / yr",
		statLabel: "Target net yield",
		examples: ["Solar projects", "Fiber networks", "Cold storage"],
	},
	{
		icon: TrendingUp,
		name: "Treasury & yield",
		blurb: "Conservative, liquid yield from on-chain treasuries and money markets.",
		stat: "4 – 6% / yr",
		statLabel: "Target net yield",
		examples: ["T-Bills", "Money markets", "Stablecoin yield"],
	},
]

export function AssetClasses() {
	return (
		<section id="assets" className="relative py-24 lg:py-32">
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10">
				<div className="grid gap-10 lg:grid-cols-2 lg:items-end">
					<SectionHeader
						eyebrow="What you actually own"
						title={
							<>
								Real assets.
								<br />
								<span className="text-muted-foreground">Real cash flow.</span>
							</>
						}
						description="Every position is backed by something tangible — a building, a loan, a solar farm. Tokenized so you can own a slice from $100, sell when you want."
					/>
					<div className="hidden lg:block">
						<div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-3">
							Live coverage
						</div>
						<div className="grid grid-cols-3 gap-3">
							<MiniStat value="$2.5B+" label="Originator pipeline" />
							<MiniStat value="11" label="Jurisdictions" />
							<MiniStat value="24/7" label="Markets" />
						</div>
					</div>
				</div>

				<div className="mt-16 lg:mt-20 grid gap-4 lg:grid-cols-2">
					{ASSETS.map((a, i) => (
						<motion.a
							key={a.name}
							href="#"
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
							className="group relative rounded-3xl border border-border/50 bg-card/30 backdrop-blur p-7 lg:p-9 overflow-hidden hover:border-border transition-colors"
						>
							<div className="absolute -top-24 -right-16 size-[300px] glow-primary blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
							<div className="relative flex flex-col gap-6">
								<div className="flex items-start justify-between">
									<div className="inline-flex size-11 items-center justify-center rounded-xl border border-border/60 bg-background/50">
										<a.icon className="size-5" />
									</div>
									<ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
								</div>

								<div className="flex flex-col gap-2">
									<h3 className="font-display text-2xl lg:text-3xl">{a.name}</h3>
									<p className="text-muted-foreground text-balance">{a.blurb}</p>
								</div>

								<div className="flex items-end justify-between pt-4 border-t border-border/40">
									<div>
										<div className="font-display text-3xl text-primary tabular-nums">{a.stat}</div>
										<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
											{a.statLabel}
										</div>
									</div>
									<div className="hidden sm:flex flex-col gap-1 items-end">
										{a.examples.map((ex) => (
											<span key={ex} className="text-xs text-muted-foreground font-mono">
												{ex}
											</span>
										))}
									</div>
								</div>
							</div>
						</motion.a>
					))}
				</div>
			</div>
		</section>
	)
}

function MiniStat({ value, label }: { value: string; label: string }) {
	return (
		<div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur p-4">
			<div className="font-display text-2xl tabular-nums">{value}</div>
			<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
				{label}
			</div>
		</div>
	)
}

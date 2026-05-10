"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { SectionHeader } from "./section-header"

const OLD = [
	"Hours scrolling listings, decks, and PDFs",
	"Guessing which deals are actually safe",
	"Paperwork, wires, and minimums you can't meet",
	"Rebalancing once a quarter — if you remember",
]

const NEW = [
	"Tell your AI what you want. That's it.",
	"Every deal is underwritten before you see it",
	"Buy a slice of anything, from $100",
	"Your portfolio rebalances itself, every minute",
]

export function TheShift() {
	return (
		<section className="relative py-24 lg:py-32 overflow-hidden">
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10">
				<SectionHeader
					eyebrow="The shift"
					title={
						<>
							Investing used to be a job.{" "}
							<span className="text-muted-foreground">Now it's a goal.</span>
						</>
					}
					description="The old way of getting into real-world assets was operationally heavy and out of reach for most people. Fractionax flips it."
				/>

				<div className="mt-14 lg:mt-20 grid gap-6 lg:grid-cols-2">
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="relative rounded-3xl border border-border/50 bg-card/30 backdrop-blur p-8 lg:p-10"
					>
						<div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-6">
							The old way
						</div>
						<h3 className="font-display text-2xl lg:text-3xl mb-8 text-muted-foreground">
							You, alone, doing all of it.
						</h3>
						<ul className="space-y-4">
							{OLD.map((item, i) => (
								<li key={i} className="flex items-start gap-3 text-muted-foreground">
									<span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full border border-border/60 shrink-0">
										<X className="size-3" />
									</span>
									<span className="line-through decoration-muted-foreground/40">{item}</span>
								</li>
							))}
						</ul>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
						className="relative rounded-3xl border border-primary/30 bg-card/40 backdrop-blur p-8 lg:p-10 overflow-hidden"
					>
						<div className="absolute -top-32 -right-24 size-[420px] glow-primary blur-3xl opacity-50" />
						<div className="relative">
							<div className="flex items-center gap-2 mb-6">
								<div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary">
									With Fractionax
								</div>
								<span className="size-1 rounded-full bg-primary animate-pulse-soft" />
							</div>
							<h3 className="font-display text-2xl lg:text-3xl mb-8">
								AI does the work. You set the direction.
							</h3>
							<ul className="space-y-4">
								{NEW.map((item, i) => (
									<li key={i} className="flex items-start gap-3">
										<span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
											<Check className="size-3" strokeWidth={3} />
										</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}

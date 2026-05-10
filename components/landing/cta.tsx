"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

export function Cta() {
	const [email, setEmail] = useState("")
	const [submitted, setSubmitted] = useState(false)

	return (
		<section id="waitlist" className="relative py-24 lg:py-40 overflow-hidden">
			<div className="absolute inset-0 -z-10">
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[1100px] glow-primary blur-3xl opacity-50" />
				<div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
			</div>

			<div className="mx-auto max-w-[1100px] px-6 lg:px-10 text-center">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 backdrop-blur px-3 py-1.5 text-xs"
				>
					<span className="size-1.5 rounded-full bg-primary animate-pulse-soft" />
					<span className="text-muted-foreground">Now onboarding the next 1,000 investors</span>
				</motion.div>

				<motion.h2
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.7, delay: 0.05, ease: "easeOut" }}
					className="font-display mt-8 text-balance text-[clamp(3rem,9vw,8rem)] leading-[0.92] font-medium"
				>
					Put your money
					<br />
					<span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
						to work.
					</span>
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
					className="mx-auto mt-6 max-w-xl text-balance text-base lg:text-lg text-muted-foreground"
				>
					One minute to set up. Lifetime to compound. Join early — get fee-free for your first year.
				</motion.p>

				<motion.form
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
					onSubmit={(e) => {
						e.preventDefault()
						if (!email) return
						setSubmitted(true)
					}}
					className="mt-10 mx-auto max-w-md"
				>
					{submitted ? (
						<div className="rounded-full border border-primary/40 bg-primary/10 px-5 py-3 text-sm text-balance">
							You're in. We'll email <span className="font-medium">{email}</span> when your spot is ready.
						</div>
					) : (
						<div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur p-1.5">
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
							/>
							<button
								type="submit"
								className="group inline-flex items-center gap-1.5 rounded-full bg-foreground text-background pl-4 pr-2 h-9 text-sm font-medium hover:opacity-90 transition-opacity"
							>
								Get early access
								<span className="inline-flex size-6 items-center justify-center rounded-full bg-background/15">
									<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
								</span>
							</button>
						</div>
					)}
					<div className="mt-4 text-xs text-muted-foreground">
						No spam. Unsubscribe in one click. Capital at risk.
					</div>
				</motion.form>
			</div>
		</section>
	)
}

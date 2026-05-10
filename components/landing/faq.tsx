"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { useState } from "react"
import { SectionHeader } from "./section-header"

const QA = [
	{
		q: "Is my money safe?",
		a: "Yes — and you don't have to take our word for it. Assets are held by regulated custodians with multi-sig controls. Your positions live in your wallet, tokenized so you can transfer or sell them. Every move an agent makes is signed on-chain and visible to you.",
	},
	{
		q: "Do I need to know anything about crypto?",
		a: "Nothing. Sign up with email, fund with a card or bank transfer, and you're done. The blockchain part is plumbing — you'll see your portfolio in dollars, not tokens.",
	},
	{
		q: "How do AI agents actually decide?",
		a: "They run within guardrails you set: target yield, risk tolerance, horizon, asset preferences. Every deal is underwritten by the Analyst before allocation, every trade is sized to your guardrails, and you can pause or override any time.",
	},
	{
		q: "What returns can I expect?",
		a: "Depends entirely on what you ask for. Conservative income portfolios target 6 – 8% net. Balanced portfolios target 8 – 11%. Higher-yield portfolios go further but take more risk. We'll show you historical performance for any goal before you commit.",
	},
	{
		q: "How fast can I withdraw?",
		a: "Stablecoin and treasury positions: instant. Real estate and private credit: depends on the asset's liquidity window — typically 1 – 30 days. We show you the liquidity profile of every position before you buy.",
	},
	{
		q: "What does Fractionax charge?",
		a: "0.75% per year management fee. No performance fee. No exit fee. No spread on deposits or withdrawals. That's it.",
	},
	{
		q: "Where do you operate?",
		a: "Available in 62 countries today. We're rolling out region by region as we secure local custodian partners — sign up to get notified for yours.",
	},
]

export function Faq() {
	const [open, setOpen] = useState<number | null>(0)
	return (
		<section id="faq" className="relative py-24 lg:py-32">
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10">
				<div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
					<div className="lg:col-span-5">
						<SectionHeader
							eyebrow="The fine print"
							title={<>Honest answers to obvious questions.</>}
							description="If you're thinking about handing money to an AI, you should have questions. Here are the ones we get most."
						/>
					</div>

					<div className="lg:col-span-7">
						<ul className="border-t border-border/40">
							{QA.map((item, i) => {
								const isOpen = open === i
								return (
									<li key={i} className="border-b border-border/40">
										<button
											type="button"
											onClick={() => setOpen(isOpen ? null : i)}
											className="w-full flex items-center justify-between gap-6 py-6 text-left group"
											aria-expanded={isOpen}
										>
											<span className="font-display text-lg lg:text-xl text-balance">{item.q}</span>
											<span
												className={`inline-flex size-8 items-center justify-center rounded-full border border-border/60 shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
											>
												<Plus className="size-4" />
											</span>
										</button>
										<AnimatePresence initial={false}>
											{isOpen && (
												<motion.div
													key="content"
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{ duration: 0.3, ease: "easeOut" }}
													className="overflow-hidden"
												>
													<p className="pb-6 text-muted-foreground text-balance max-w-2xl">
														{item.a}
													</p>
												</motion.div>
											)}
										</AnimatePresence>
									</li>
								)
							})}
						</ul>
					</div>
				</div>
			</div>
		</section>
	)
}

"use client"

import { motion, AnimatePresence, useReducedMotion, useInView, type Variants } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

const cardVariants: Variants = {
	hidden: { opacity: 0, y: 30, scale: 0.97 },
	visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: EASE_OUT } },
}

const floatVariant: Variants = {
	animate: {
		y: [0, -6, 0],
		transition: { duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
	},
}

const glowVariant: Variants = {
	animate: {
		opacity: [0.5, 0.8, 0.5],
		scale: [1, 1.03, 1],
		transition: { duration: 3.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
	},
}

const tabUnderlineVariant: Variants = {
	initial: { width: 0 },
	active: { width: "100%", transition: { duration: 0.25, ease: EASE_OUT } },
}

const tabContentVariant: Variants = {
	hidden: { opacity: 0, y: 8 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
	exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE_OUT } },
}

type ColorKey = "green" | "blue" | "amber"

const colorClasses: Record<
	ColorKey,
	{
		dot: string
		iconBg: string
		iconText: string
		change: string
		categoryText: string
		panelBg: string
		panelBorder: string
		rowSelectedBg: string
		rowSelectedBorder: string
	}
> = {
	green: {
		dot: "bg-green-500",
		iconBg: "bg-green-500/10",
		iconText: "text-green-500",
		change: "text-green-500",
		categoryText: "text-green-500/70",
		panelBg: "bg-green-500/5",
		panelBorder: "border-green-500/10",
		rowSelectedBg: "bg-green-500/5",
		rowSelectedBorder: "border-green-500/20",
	},
	blue: {
		dot: "bg-blue-500",
		iconBg: "bg-blue-500/10",
		iconText: "text-blue-500",
		change: "text-blue-500",
		categoryText: "text-blue-500/70",
		panelBg: "bg-blue-500/5",
		panelBorder: "border-blue-500/10",
		rowSelectedBg: "bg-blue-500/5",
		rowSelectedBorder: "border-blue-500/20",
	},
	amber: {
		dot: "bg-amber-500",
		iconBg: "bg-amber-500/10",
		iconText: "text-amber-500",
		change: "text-amber-500",
		categoryText: "text-amber-500/70",
		panelBg: "bg-amber-500/5",
		panelBorder: "border-amber-500/10",
		rowSelectedBg: "bg-amber-500/5",
		rowSelectedBorder: "border-amber-500/20",
	},
}

function useCountUp(target: number, shouldAnimate: boolean, duration = 1200, start = 0) {
	const [count, setCount] = useState(start)
	const ref = useRef<HTMLDivElement>(null)
	const isInView = useInView(ref, { once: true })

	useEffect(() => {
		if (!isInView || !shouldAnimate) {
			setCount(target)
			return
		}
		let startTime: number | null = null
		const step = (timestamp: number) => {
			if (!startTime) startTime = timestamp
			const progress = Math.min((timestamp - startTime) / duration, 1)
			const eased = 1 - Math.pow(1 - progress, 3)
			setCount(Math.round(start + (target - start) * eased))
			if (progress < 1) requestAnimationFrame(step)
		}
		requestAnimationFrame(step)
	}, [isInView, target, duration, start, shouldAnimate])

	return { count, ref }
}

type Position = {
	ticker: string
	name: string
	category: string
	allocation: string
	value: string
	change: string
	yield: string
	risk: string
	agent: string
	lastAction: string
	color: ColorKey
	icon: "building" | "credit" | "bond"
}

const positions: Position[] = [
	{
		ticker: "REIT",
		name: "Manila Tower REIT",
		category: "Real Estate",
		allocation: "42%",
		value: "$4,200",
		change: "+12.4%",
		yield: "8.4% APY",
		risk: "Low-Med",
		agent: "Portfolio Agent",
		lastAction: "Rebalanced 2h ago",
		color: "green",
		icon: "building",
	},
	{
		ticker: "CRED",
		name: "Private Credit III",
		category: "Credit",
		allocation: "30%",
		value: "$3,847",
		change: "+8.2%",
		yield: "12.1% APY",
		risk: "Medium",
		agent: "Underwrite Agent",
		lastAction: "Yield calc updated 14s ago",
		color: "blue",
		icon: "credit",
	},
	{
		ticker: "GOV",
		name: "US Treasuries",
		category: "Fixed Income",
		allocation: "28%",
		value: "$4,800",
		change: "+4.8%",
		yield: "4.9% APY",
		risk: "Low",
		agent: "Portfolio Agent",
		lastAction: "Coupon received 1d ago",
		color: "amber",
		icon: "bond",
	},
]

function PortfolioTab({ shouldAnimate }: { shouldAnimate: boolean }) {
	const { count: perfCount, ref: perfRef } = useCountUp(72, shouldAnimate, 1400)
	const [selectedTicker, setSelectedTicker] = useState<string | null>(null)

	return (
		<>
			<div className="px-5 py-4" ref={perfRef}>
				<div className="flex items-end justify-between mb-1">
					<div>
						<div className="text-[10px] text-muted-foreground mb-0.5 font-mono uppercase tracking-wider">
							Portfolio Value
						</div>
						<div className="text-3xl font-bold tabular-nums tracking-tight">
							$12,847<span className="text-base text-green-500 font-semibold">.32</span>
						</div>
					</div>
					<div className="text-right">
						<div className="text-xs text-green-500 font-mono">+18.2% APY</div>
						<div className="text-[10px] text-muted-foreground">all time</div>
					</div>
				</div>
				<div className="h-1 rounded-full bg-border/30 mt-3 overflow-hidden">
					<motion.div
						className="h-full rounded-full bg-gradient-to-r from-primary/80 to-green-500/80"
						initial={{ width: 0 }}
						animate={{ width: `${perfCount}%` }}
						transition={{ duration: 1.4, ease: EASE_OUT }}
					/>
				</div>
				<div className="flex justify-between mt-1 text-[9px] text-muted-foreground/60 font-mono">
					<span>vs. Benchmark</span>
					<span className="text-green-500">+6.4%</span>
				</div>
			</div>

			<div className="px-5 pb-4 space-y-1.5">
				{positions.map((row) => {
					const c = colorClasses[row.color]
					const isOpen = selectedTicker === row.ticker
					return (
						<div key={row.ticker}>
							<motion.div
								className={`group flex items-center justify-between py-2 px-3 rounded-lg border cursor-pointer transition-colors duration-150 ${
									isOpen
										? `${c.rowSelectedBg} ${c.rowSelectedBorder}`
										: "bg-card border-border/40 hover:border-border/80"
								}`}
								onClick={() => setSelectedTicker(isOpen ? null : row.ticker)}
								layout
							>
								<div className="flex items-center gap-2">
									<div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${c.iconBg}`}>
										{row.icon === "building" && (
											<svg className={`w-2.5 h-2.5 ${c.iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
											</svg>
										)}
										{row.icon === "credit" && (
											<svg className={`w-2.5 h-2.5 ${c.iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2" />
											</svg>
										)}
										{row.icon === "bond" && (
											<svg className={`w-2.5 h-2.5 ${c.iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6" />
											</svg>
										)}
									</div>
									<div className="min-w-0">
										<div className="text-xs font-medium truncate">{row.name}</div>
										<div className={`text-[9px] ${c.categoryText}`}>
											{row.category} · {row.allocation}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3 flex-shrink-0 ml-2">
									<div className="text-right">
										<div className="text-xs font-medium tabular-nums">{row.value}</div>
										<div className={`text-[9px] tabular-nums ${c.change}`}>{row.change}</div>
									</div>
									<motion.div
										animate={{ rotate: isOpen ? 90 : 0 }}
										transition={{ duration: 0.15, ease: "easeOut" }}
									>
										<svg className="w-3 h-3 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
										</svg>
									</motion.div>
								</div>
							</motion.div>

							<AnimatePresence>
								{isOpen && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.25, ease: EASE_OUT }}
										className="overflow-hidden"
									>
										<div className={`mt-1 mb-2 ml-2 mr-2 p-3 rounded-lg ${c.panelBg} border ${c.panelBorder}`}>
											<div className="grid grid-cols-3 gap-3">
												<div>
													<div className="text-[9px] text-muted-foreground/60 font-mono uppercase tracking-wider mb-1">Yield</div>
													<div className="text-sm font-bold tabular-nums text-green-500">{row.yield}</div>
												</div>
												<div>
													<div className="text-[9px] text-muted-foreground/60 font-mono uppercase tracking-wider mb-1">Risk</div>
													<div className="text-sm font-bold">{row.risk}</div>
												</div>
												<div>
													<div className="text-[9px] text-muted-foreground/60 font-mono uppercase tracking-wider mb-1">Allocation</div>
													<div className="text-sm font-bold tabular-nums">{row.allocation}</div>
												</div>
											</div>
											<div className="mt-3 pt-2.5 border-t border-border/20 flex items-center justify-between">
												<div className="flex items-center gap-1.5">
													<div className={`w-1 h-1 rounded-full ${c.dot}`} />
													<span className="text-[9px] font-mono text-muted-foreground/60">{row.agent}</span>
												</div>
												<span className="text-[9px] font-mono text-muted-foreground/40">{row.lastAction}</span>
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					)
				})}
			</div>

			<div className="px-5 py-2.5 border-t border-border/50 bg-card/50">
				<div className="flex items-center justify-between text-[10px] font-mono">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1.5">
							<div className="relative w-1 h-1 rounded-full">
								<div className="absolute inset-0 rounded-full bg-green-500 opacity-60" />
								<div className="relative w-1 h-1 rounded-full bg-green-500" />
							</div>
							<span className="text-muted-foreground">Portfolio</span>
						</div>
						<div className="flex items-center gap-1.5">
							<div className="w-1 h-1 rounded-full bg-blue-500" />
							<span className="text-muted-foreground">Deal Src</span>
						</div>
						<div className="flex items-center gap-1.5">
							<div className="w-1 h-1 rounded-full bg-amber-500" />
							<span className="text-muted-foreground">Underwrite</span>
						</div>
					</div>
					<span className="text-green-500 tabular-nums">+18.2%</span>
				</div>
			</div>
		</>
	)
}

type AgentRow = {
	name: string
	status: "active" | "idle"
	message: string
	time: string
	color: "green" | "blue" | "amber" | "muted"
}

const agents: AgentRow[] = [
	{ name: "DEAL.SRC", status: "active", message: "Screening 3 Malaysian RE opportunities", time: "2s ago", color: "blue" },
	{ name: "UNDERWRITE", status: "active", message: "Yield calc: 8.4% avg on Manila Tower", time: "14s ago", color: "amber" },
	{ name: "PORTFOLIO", status: "active", message: "Rebalancing: +2% Fixed Income", time: "41s ago", color: "green" },
	{ name: "COMPLIANCE", status: "idle", message: "KYC verified for 3 new investors", time: "2m ago", color: "muted" },
	{ name: "SETTLEMENT", status: "idle", message: "Token transfer complete: $12,400", time: "5m ago", color: "muted" },
]

const agentDotClass: Record<AgentRow["color"], string> = {
	green: "bg-green-500",
	blue: "bg-blue-500",
	amber: "bg-amber-500",
	muted: "bg-muted",
}

function AgentActivityTab() {
	return (
		<div className="px-5 py-4 space-y-2">
			<div className="text-[10px] text-muted-foreground mb-3 font-mono uppercase tracking-wider">Live Agent Feed</div>
			{agents.map((agent, i) => (
				<motion.div
					key={agent.name}
					className="group flex items-start justify-between py-2 px-3 rounded-lg hover:bg-card/80 cursor-default"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: i * 0.08, duration: 0.3, ease: EASE_OUT }}
				>
					<div className="flex items-start gap-2">
						<div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${agentDotClass[agent.color]}`} />
						<div>
							<div className="text-[10px] font-mono text-muted-foreground/60">{agent.name}</div>
							<div className="text-xs text-foreground/80">{agent.message}</div>
						</div>
					</div>
					<span className="text-[9px] font-mono text-muted-foreground/40 flex-shrink-0 mt-0.5">{agent.time}</span>
				</motion.div>
			))}
		</div>
	)
}

export function HeroPortfolioCard() {
	const prefersReducedMotion = useReducedMotion()
	const [activeTab, setActiveTab] = useState<"portfolio" | "agents">("portfolio")
	const shouldAnimate = !prefersReducedMotion

	return (
		<motion.div variants={cardVariants} initial="hidden" animate="visible">
			<div className="relative">
				<motion.div
					className="absolute -inset-6 bg-primary/[0.06] rounded-3xl blur-2xl max-lg:hidden"
					variants={glowVariant}
					animate="animate"
				/>
				<motion.div
					className="relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/[0.08] transition-shadow duration-300 max-lg:max-h-[520px] max-lg:overflow-y-auto max-lg:overflow-x-hidden"
					variants={floatVariant}
					animate="animate"
				>
					<div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-card/80">
						<div className="flex items-center gap-2">
							<div className="flex gap-1.5">
								<div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
								<div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
								<div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
							</div>
							<span className="text-xs font-mono text-muted-foreground/80 ml-1">fractionax://portfolio</span>
						</div>
						<div className="flex items-center gap-1.5">
							<div className="relative flex items-center justify-center w-2 h-2">
								<div className="absolute inset-0 rounded-full bg-green-500 opacity-60" />
								<div className="relative w-2 h-2 rounded-full bg-green-500" />
							</div>
							<span className="text-xs font-mono text-green-500">LIVE</span>
						</div>
					</div>

					<div className="px-4 pt-3 pb-0 flex items-center gap-1 border-b border-border/30">
						<button
							onClick={() => setActiveTab("portfolio")}
							className="relative px-3 py-1.5 text-[11px] font-mono transition-colors duration-150"
						>
							<span className={activeTab === "portfolio" ? "text-foreground" : "text-muted-foreground hover:text-muted-foreground/80"}>
								Portfolio
							</span>
							<motion.div
								className="absolute bottom-0 left-0 h-px bg-primary"
								variants={tabUnderlineVariant}
								initial="initial"
								animate={activeTab === "portfolio" ? "active" : "initial"}
							/>
						</button>
						<button
							onClick={() => setActiveTab("agents")}
							className="relative px-3 py-1.5 text-[11px] font-mono transition-colors duration-150"
						>
							<span className={activeTab === "agents" ? "text-foreground" : "text-muted-foreground hover:text-muted-foreground/80"}>
								Agent Feed
							</span>
							<motion.div
								className="absolute bottom-0 left-0 h-px bg-primary"
								variants={tabUnderlineVariant}
								initial="initial"
								animate={activeTab === "agents" ? "active" : "initial"}
							/>
						</button>
					</div>

					<AnimatePresence mode="wait">
						{activeTab === "portfolio" ? (
							<motion.div
								key="portfolio"
								variants={tabContentVariant}
								initial="hidden"
								animate="visible"
								exit="exit"
							>
								<PortfolioTab shouldAnimate={shouldAnimate} />
							</motion.div>
						) : (
							<motion.div
								key="agents"
								variants={tabContentVariant}
								initial="hidden"
								animate="visible"
								exit="exit"
							>
								<AgentActivityTab />
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
		</motion.div>
	)
}

"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

const NODES = [
	{ id: "scout", label: "Scout", x: 18, y: 28, role: "Sourcing" },
	{ id: "analyst", label: "Analyst", x: 82, y: 24, role: "Underwriting" },
	{ id: "trader", label: "Trader", x: 14, y: 76, role: "Execution" },
	{ id: "manager", label: "Manager", x: 86, y: 78, role: "Portfolio" },
]

const CORE = { x: 50, y: 52 }

export function HeroVisual() {
	const links = useMemo(
		() =>
			NODES.map((n) => ({
				id: n.id,
				d: `M ${n.x} ${n.y} Q ${(n.x + CORE.x) / 2} ${(n.y + CORE.y) / 2 - 6} ${CORE.x} ${CORE.y}`,
			})),
		[],
	)

	return (
		<div className="relative aspect-[16/10] w-full">
			<div className="absolute inset-0 rounded-[28px] border border-border/60 overflow-hidden bg-card/40 backdrop-blur-sm">
				<div className="absolute inset-0 bg-grid bg-grid-fade opacity-50" />

				<svg
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					className="absolute inset-0 size-full"
					aria-hidden
				>
					<defs>
						<linearGradient id="link-gradient" x1="0" x2="1" y1="0" y2="0">
							<stop offset="0%" stopColor="oklch(0.6736 0.1265 172.43)" stopOpacity="0" />
							<stop offset="50%" stopColor="oklch(0.6736 0.1265 172.43)" stopOpacity="1" />
							<stop offset="100%" stopColor="oklch(0.6736 0.1265 172.43)" stopOpacity="0" />
						</linearGradient>
						<radialGradient id="core-glow">
							<stop offset="0%" stopColor="oklch(0.6736 0.1265 172.43)" stopOpacity="0.7" />
							<stop offset="100%" stopColor="oklch(0.6736 0.1265 172.43)" stopOpacity="0" />
						</radialGradient>
					</defs>

					{links.map((link, i) => (
						<g key={link.id}>
							<path
								d={link.d}
								fill="none"
								stroke="oklch(1 0 0 / 0.08)"
								strokeWidth="0.25"
								vectorEffect="non-scaling-stroke"
							/>
							<motion.path
								d={link.d}
								fill="none"
								stroke="url(#link-gradient)"
								strokeWidth="0.6"
								strokeLinecap="round"
								vectorEffect="non-scaling-stroke"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{
									pathLength: [0, 1, 1],
									opacity: [0, 1, 0],
								}}
								transition={{
									duration: 2.4,
									delay: i * 0.6,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
						</g>
					))}

					<circle cx={CORE.x} cy={CORE.y} r="14" fill="url(#core-glow)" />
				</svg>

				{NODES.map((n, i) => (
					<motion.div
						key={n.id}
						className="absolute -translate-x-1/2 -translate-y-1/2"
						style={{ left: `${n.x}%`, top: `${n.y}%` }}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
					>
						<div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 backdrop-blur px-3 py-1.5 text-xs whitespace-nowrap">
							<span className="relative inline-block size-1.5">
								<span className="absolute inset-0 rounded-full bg-primary" />
								<span className="absolute inset-0 rounded-full bg-primary blur-sm animate-pulse-soft" />
							</span>
							<span className="font-medium">{n.label}</span>
							<span className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">{n.role}</span>
						</div>
					</motion.div>
				))}

				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
					className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
				>
					<div className="relative">
						<div className="absolute inset-0 -m-12 glow-primary blur-2xl" />
						<div className="relative flex flex-col items-center gap-2.5 rounded-2xl border border-border/60 bg-background/85 backdrop-blur-xl px-5 py-4 min-w-[220px]">
							<div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
								<span className="size-1.5 rounded-full bg-primary animate-pulse-soft" />
								Goal
							</div>
							<div className="text-sm font-medium text-balance text-center">
								Grow $50K with steady income, low risk
							</div>
							<div className="grid grid-cols-3 gap-2 w-full pt-2 border-t border-border/40">
								<Stat label="Allocated" value="92%" />
								<Stat label="Yield" value="9.4%" />
								<Stat label="Assets" value="14" />
							</div>
						</div>
					</div>
				</motion.div>

				<div className="absolute left-4 top-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
					<span className="size-1.5 rounded-full bg-primary animate-pulse-soft" />
					Live · Solana
				</div>
				<div className="absolute right-4 top-4 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
					4 agents · 12 actions/min
				</div>
			</div>
		</div>
	)
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col items-center">
			<div className="text-sm font-medium tabular-nums">{value}</div>
			<div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
		</div>
	)
}

"use client"

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useRef } from "react"

function Counter({
	to,
	prefix = "",
	suffix = "",
	decimals = 0,
	duration = 2,
}: {
	to: number
	prefix?: string
	suffix?: string
	decimals?: number
	duration?: number
}) {
	const ref = useRef<HTMLSpanElement>(null)
	const inView = useInView(ref, { once: true, margin: "-60px" })
	const count = useMotionValue(0)
	const formatted = useTransform(count, (v) => {
		const n = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString()
		return `${prefix}${n}${suffix}`
	})

	useEffect(() => {
		if (inView) {
			const controls = animate(count, to, { duration, ease: "easeOut" })
			return () => controls.stop()
		}
	}, [inView, count, to, duration])

	return <motion.span ref={ref}>{formatted}</motion.span>
}

export function Stats() {
	return (
		<section className="relative py-24 lg:py-32 border-y border-border/40 overflow-hidden">
			<div className="absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-40" />

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10">
				<div className="text-center text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-16">
					<span className="size-1 rounded-full bg-primary inline-block mr-2 align-middle animate-pulse-soft" />
					Live network · updated continuously
				</div>

				<div className="grid gap-8 lg:gap-4 lg:grid-cols-4">
					<StatBlock value={<Counter to={184_239_412} prefix="$" />} label="Capital under autonomous management" hint="across 11 jurisdictions" />
					<StatBlock value={<Counter to={2_594_357} />} label="Agent actions executed" hint="last 30 days" />
					<StatBlock value={<Counter to={9.4} suffix="%" decimals={1} />} label="Average net yield" hint="trailing 12 months" />
					<StatBlock value={<Counter to={151_108} />} label="Investors onboarded" hint="62 countries" />
				</div>
			</div>
		</section>
	)
}

function StatBlock({ value, label, hint }: { value: React.ReactNode; label: string; hint: string }) {
	return (
		<div className="flex flex-col gap-3 lg:px-6 lg:border-r lg:border-border/40 last:lg:border-r-0">
			<div className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tabular-nums">{value}</div>
			<div className="text-sm text-foreground">{label}</div>
			<div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{hint}</div>
		</div>
	)
}

import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import type { ReactNode } from "react"

export function Card({
	className,
	children,
	padding = "default",
}: {
	className?: string
	children: ReactNode
	padding?: "none" | "default" | "lg"
}) {
	return (
		<div
			className={cn(
				"rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm",
				padding === "default" && "p-5",
				padding === "lg" && "p-6 lg:p-8",
				className,
			)}
		>
			{children}
		</div>
	)
}

export function MetricCard({
	label,
	value,
	hint,
	change,
	chart,
	className,
}: {
	label: string
	value: string
	hint?: string
	change?: { value: string; positive?: boolean }
	chart?: ReactNode
	className?: string
}) {
	return (
		<Card className={cn("flex flex-col gap-3", className)}>
			<div className="flex items-start justify-between gap-2">
				<div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/70">
					{label}
				</div>
				{change && (
					<div
						className={cn(
							"inline-flex items-center gap-0.5 text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded",
							change.positive
								? "bg-primary/10 text-primary"
								: "bg-destructive/10 text-destructive",
						)}
					>
						{change.positive ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
						{change.value}
					</div>
				)}
			</div>
			<div>
				<div className="text-2xl lg:text-3xl font-medium tabular-nums tracking-tight">{value}</div>
				{hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
			</div>
			{chart && <div className="mt-1 -mb-1">{chart}</div>}
		</Card>
	)
}

const STATUS_STYLES: Record<string, string> = {
	success: "bg-primary/10 text-primary border-primary/20",
	live: "bg-primary/10 text-primary border-primary/20",
	pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
	warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
	danger: "bg-destructive/10 text-destructive border-destructive/30",
	muted: "bg-muted text-muted-foreground border-border/60",
	info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
}

export function StatusPill({
	tone = "muted",
	children,
	dot = true,
	className,
}: {
	tone?: keyof typeof STATUS_STYLES
	children: ReactNode
	dot?: boolean
	className?: string
}) {
	const dotColor =
		tone === "success" || tone === "live"
			? "bg-primary"
			: tone === "pending" || tone === "warning"
				? "bg-amber-500"
				: tone === "danger"
					? "bg-destructive"
					: tone === "info"
						? "bg-blue-500"
						: "bg-muted-foreground"
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border",
				STATUS_STYLES[tone],
				className,
			)}
		>
			{dot && <span className={cn("size-1 rounded-full", dotColor)} />}
			{children}
		</span>
	)
}

export function EmptyState({
	title,
	description,
	action,
	icon,
}: {
	title: string
	description?: string
	action?: ReactNode
	icon?: ReactNode
}) {
	return (
		<div className="rounded-xl border border-dashed border-border/60 bg-card/20 p-10 text-center">
			{icon && <div className="inline-flex items-center justify-center size-10 rounded-xl bg-foreground/[0.04] text-muted-foreground mx-auto mb-4">{icon}</div>}
			<div className="font-medium">{title}</div>
			{description && <div className="mt-1.5 text-sm text-muted-foreground max-w-sm mx-auto">{description}</div>}
			{action && <div className="mt-5">{action}</div>}
		</div>
	)
}

export function SectionHeader({
	title,
	description,
	action,
	className,
}: {
	title: string
	description?: string
	action?: ReactNode
	className?: string
}) {
	return (
		<div className={cn("flex items-end justify-between gap-3 mb-4", className)}>
			<div>
				<h2 className="text-base font-medium">{title}</h2>
				{description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
			</div>
			{action}
		</div>
	)
}

export function DataRow({
	label,
	value,
	mono = false,
}: {
	label: string
	value: ReactNode
	mono?: boolean
}) {
	return (
		<div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
			<span className="text-xs text-muted-foreground">{label}</span>
			<span className={cn("text-xs font-medium", mono && "font-mono tabular-nums")}>{value}</span>
		</div>
	)
}

import { cn } from "@/lib/utils"

export function Wordmark({
	className,
	size = "md",
}: {
	className?: string
	size?: "sm" | "md" | "lg"
}) {
	const sizes = {
		sm: "text-base",
		md: "text-xl",
		lg: "text-2xl",
	}
	return (
		<span
			className={cn(
				"font-display font-medium tracking-tight inline-flex items-baseline gap-[0.18em]",
				sizes[size],
				className,
			)}
		>
			<span aria-hidden className="relative inline-block size-[0.55em] translate-y-[0.05em]">
				<span className="absolute inset-0 rounded-full bg-primary" />
				<span className="absolute inset-0 rounded-full bg-primary blur-[6px] opacity-70" />
			</span>
			<span>Fractionax</span>
		</span>
	)
}

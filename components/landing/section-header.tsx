import { cn } from "@/lib/utils"

export function SectionHeader({
	eyebrow,
	title,
	description,
	align = "left",
	className,
}: {
	eyebrow?: string
	title: React.ReactNode
	description?: React.ReactNode
	align?: "left" | "center"
	className?: string
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-4 lg:gap-5",
				align === "center" ? "items-center text-center" : "items-start",
				className,
			)}
		>
			{eyebrow && (
				<div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
					<span className="size-1 rounded-full bg-primary" />
					{eyebrow}
				</div>
			)}
			<h2
				className={cn(
					"font-display text-balance text-[clamp(2rem,5vw,3.75rem)] leading-[0.98] font-medium",
					align === "center" ? "max-w-3xl" : "max-w-3xl",
				)}
			>
				{title}
			</h2>
			{description && (
				<p className="max-w-xl text-balance text-base lg:text-lg text-muted-foreground">
					{description}
				</p>
			)}
		</div>
	)
}

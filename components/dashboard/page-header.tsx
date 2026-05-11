import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export function PageHeader({
	title,
	description,
	actions,
	className,
}: {
	title: string
	description?: string
	actions?: ReactNode
	className?: string
}) {
	return (
		<div className={cn("flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4", className)}>
			<div>
				<h1 className="font-display text-2xl lg:text-3xl font-medium tracking-tight">{title}</h1>
				{description && <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{description}</p>}
			</div>
			{actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
		</div>
	)
}

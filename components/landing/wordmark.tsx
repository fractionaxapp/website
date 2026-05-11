import Image from "next/image"
import { cn } from "@/lib/utils"

const LOGO_ASPECT = 1648 / 345.67

const sizeHeight = {
	sm: 16,
	md: 22,
	lg: 30,
} as const

export function Wordmark({
	className,
	size = "md",
}: {
	className?: string
	size?: "sm" | "md" | "lg"
}) {
	const height = sizeHeight[size]
	const width = Math.round(height * LOGO_ASPECT)

	return (
		<span className={cn("inline-flex items-center", className)}>
			<Image
				src="/assets/logo/FractionaxDark.svg"
				alt="Fractionax"
				width={width}
				height={height}
				priority
				className="block dark:hidden"
			/>
			<Image
				src="/assets/logo/FractionaxLight.svg"
				alt="Fractionax"
				width={width}
				height={height}
				priority
				aria-hidden
				className="hidden dark:block"
			/>
		</span>
	)
}

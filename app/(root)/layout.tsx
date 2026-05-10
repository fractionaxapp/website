import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
	title: "Fractionax — Real-world wealth, on autopilot",
	description:
		"Set a goal. Your AI invests in real estate, private credit, and yield-bearing assets — and keeps your portfolio working 24/7. Built on Solana.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return <>{children}</>
}

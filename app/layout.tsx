import type { Metadata } from "next"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

import "./globals.css";

export const metadata: Metadata = {
	title: "Fractionax",
	description: "Agentic RWA Investment Infrastructure"
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html
			lang="en"
			className={cn("h-full", "antialiased", "font-sans")}
		>
			<body className="min-h-full flex flex-col">
				{children}
			</body>
		</html>
	)
}

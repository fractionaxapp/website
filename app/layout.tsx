import type { Metadata } from "next"
import { ReactNode } from "react"

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
			className={`h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				{children}
			</body>
		</html>
	)
}

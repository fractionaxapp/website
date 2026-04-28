import type { Metadata } from "next"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

import "./globals.css";
import { ThemeProvider } from "@/components/modules/theme/provider";

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
			suppressHydrationWarning
		>
        	<head />
			<body className="min-h-full flex flex-col">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}

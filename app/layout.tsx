import type { Metadata } from "next"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/modules/theme/provider"

import Script from "next/script"

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
	const gaId = process.env.NEXT_PUBLIC_GA_ID

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
				{gaId && (
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
						strategy="afterInteractive"
					/>
				)}
				{gaId && (
					<Script id="google-analytics" strategy="afterInteractive">
						{`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${gaId}');
						`}
					</Script>
				)}
			</body>
		</html>
	)
}

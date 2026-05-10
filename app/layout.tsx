import type { Metadata } from "next"
import { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/modules/theme/provider"

import Script from "next/script"

import "./globals.css"

const geistSans = Geist({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
})

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
})

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
	const gaId = process.env.NEXT_PUBLIC_GA_ID

	return (
		<html
			lang="en"
			className={cn("h-full", geistSans.variable, geistMono.variable)}
			suppressHydrationWarning
		>
			<head />
			<body className={cn("min-h-full flex flex-col antialiased font-sans bg-background text-foreground")}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
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

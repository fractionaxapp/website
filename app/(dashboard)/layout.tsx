import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
	title: "Dashboard | Fractionax",
	description: "Fractionax Dashboard",
}

export default function DashboardLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return <>{children}</>
}

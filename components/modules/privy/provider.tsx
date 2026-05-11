"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import { useTheme } from "next-themes"
import { type ReactNode, useEffect, useState } from "react"

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID

export const isPrivyConfigured = Boolean(PRIVY_APP_ID)

export function PrivyAppProvider({ children }: { children: ReactNode }) {
	const { resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	if (!PRIVY_APP_ID) {
		if (typeof window !== "undefined") {
			console.warn(
				"[Fractionax] NEXT_PUBLIC_PRIVY_APP_ID is not set. Auth features will be disabled.",
			)
		}
		return <>{children}</>
	}

	return (
		<PrivyProvider
			appId={PRIVY_APP_ID}
			config={{
				loginMethods: ["email", "wallet", "google"],
				appearance: {
					theme: mounted && resolvedTheme === "dark" ? "dark" : "light",
					accentColor: "#16af8e",
					logo: "/assets/logo/FractionaxPrimary.svg",
					walletList: ["phantom", "solflare", "metamask", "wallet_connect"],
				},
				embeddedWallets: {
					ethereum: { createOnLogin: "users-without-wallets" },
					solana: { createOnLogin: "users-without-wallets" },
				},
			}}
		>
			{children}
		</PrivyProvider>
	)
}

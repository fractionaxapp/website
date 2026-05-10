"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Wordmark } from "./wordmark"
import ButtonTheme from "@/components/modules/button/theme"

const links = [
	{ href: "#how", label: "How it works" },
	{ href: "#assets", label: "What you own" },
	{ href: "#agents", label: "Your AI team" },
	{ href: "#trust", label: "Trust & safety" },
	{ href: "#faq", label: "FAQ" },
]

export function Nav() {
	const [scrolled, setScrolled] = useState(false)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8)
		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	return (
		<header
			className={cn(
				"fixed inset-x-0 top-0 z-50 transition-all duration-300",
				scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border/40" : "bg-transparent",
			)}
		>
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10">
				<nav className="flex h-16 items-center justify-between">
					<Link href="/" aria-label="Fractionax home" className="flex items-center">
						<Wordmark />
					</Link>

					<ul className="hidden lg:flex items-center gap-1 text-sm">
						{links.map((l) => (
							<li key={l.href}>
								<a
									href={l.href}
									className="px-3 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
								>
									{l.label}
								</a>
							</li>
						))}
					</ul>

					<div className="flex items-center gap-2">
						<a
							href="#"
							className="hidden sm:inline-flex h-9 items-center px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Sign in
						</a>
						<a
							href="#waitlist"
							className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground text-background pl-4 pr-2 text-sm font-medium hover:opacity-90 transition-opacity"
						>
							Get early access
							<span className="inline-flex size-6 items-center justify-center rounded-full bg-background/15">
								<ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</span>
						</a>
						<div className="hidden lg:block">
							<ButtonTheme />
						</div>
						<button
							type="button"
							onClick={() => setOpen((v) => !v)}
							aria-label={open ? "Close menu" : "Open menu"}
							className="lg:hidden inline-flex size-9 items-center justify-center rounded-full border border-border/60"
						>
							{open ? <X className="size-4" /> : <Menu className="size-4" />}
						</button>
					</div>
				</nav>
			</div>

			{open && (
				<div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
					<div className="mx-auto max-w-[1400px] px-6 py-6 flex flex-col gap-1">
						{links.map((l) => (
							<a
								key={l.href}
								href={l.href}
								onClick={() => setOpen(false)}
								className="px-3 py-3 text-base text-foreground border-b border-border/30 last:border-b-0"
							>
								{l.label}
							</a>
						))}
					</div>
				</div>
			)}
		</header>
	)
}

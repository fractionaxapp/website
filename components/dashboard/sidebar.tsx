"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

export type SidebarItem = {
	label: string
	href: string
	icon: LucideIcon
	badge?: string
}

export type SidebarGroup = {
	title: string
	items: SidebarItem[]
}

export function Sidebar({
	groups,
	footer,
}: {
	groups: SidebarGroup[]
	footer?: React.ReactNode
}) {
	const pathname = usePathname()

	return (
		<aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border/60 bg-background/80 backdrop-blur sticky top-0 h-screen">
			<div className="px-5 py-5 border-b border-border/40">
				<Link href="/" className="inline-flex items-center" aria-label="Fractionax">
					<Image
						src="/assets/logo/FractionaxDark.svg"
						alt="Fractionax"
						width={120}
						height={25}
						className="block dark:hidden h-5 w-auto"
					/>
					<Image
						src="/assets/logo/FractionaxLight.svg"
						alt="Fractionax"
						width={120}
						height={25}
						className="hidden dark:block h-5 w-auto"
					/>
				</Link>
			</div>

			<nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
				{groups.map((group) => (
					<div key={group.title}>
						<div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/60">
							{group.title}
						</div>
						<ul className="space-y-0.5">
							{group.items.map((item) => {
								const Icon = item.icon
								const active =
									pathname === item.href ||
									(item.href !== "/app" && item.href !== "/owner" && pathname.startsWith(item.href + "/")) ||
									(item.href === pathname)
								return (
									<li key={item.href}>
										<Link
											href={item.href}
											className={cn(
												"flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
												active
													? "bg-foreground/[0.06] text-foreground"
													: "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]",
											)}
										>
											<Icon className="size-4 shrink-0" />
											<span className="flex-1 truncate">{item.label}</span>
											{item.badge && (
												<span className="text-[9px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
													{item.badge}
												</span>
											)}
										</Link>
									</li>
								)
							})}
						</ul>
					</div>
				))}
			</nav>

			{footer && <div className="border-t border-border/40 p-3">{footer}</div>}
		</aside>
	)
}

import { Wordmark } from "./wordmark"

const COLS = [
	{
		title: "Product",
		links: [
			{ label: "How it works", href: "#how" },
			{ label: "What you own", href: "#assets" },
			{ label: "Your AI team", href: "#agents" },
			{ label: "Trust & safety", href: "#trust" },
			{ label: "Pricing", href: "#" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About", href: "#" },
			{ label: "Careers", href: "#" },
			{ label: "Press", href: "#" },
			{ label: "Contact", href: "#" },
		],
	},
	{
		title: "Resources",
		links: [
			{ label: "Help center", href: "#" },
			{ label: "Whitepaper", href: "#" },
			{ label: "Audits", href: "#" },
			{ label: "Status", href: "#" },
		],
	},
	{
		title: "Legal",
		links: [
			{ label: "Terms", href: "#" },
			{ label: "Privacy", href: "#" },
			{ label: "Disclosures", href: "#" },
			{ label: "Risk", href: "#" },
		],
	},
]

export function Footer() {
	return (
		<footer className="relative pt-24 pb-10 border-t border-border/40">
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10">
				<div className="grid gap-16 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<Wordmark size="lg" />
						<p className="mt-6 max-w-xs text-sm text-muted-foreground text-balance">
							Real-world wealth, on autopilot. Set a goal — your AI does the rest.
						</p>
						<div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
							<span className="size-1.5 rounded-full bg-primary animate-pulse-soft" />
							All systems operational
						</div>
					</div>

					<div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-10">
						{COLS.map((col) => (
							<div key={col.title}>
								<div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-4">
									{col.title}
								</div>
								<ul className="space-y-3">
									{col.links.map((l) => (
										<li key={l.label}>
											<a
												href={l.href}
												className="text-sm text-foreground/80 hover:text-foreground transition-colors"
											>
												{l.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div
					aria-hidden
					className="mt-20 lg:mt-28 select-none font-display font-medium leading-none tracking-[-0.05em] text-[clamp(4rem,18vw,18rem)] text-foreground/[0.06]"
				>
					FRACTIONAX
				</div>

				<div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between text-xs text-muted-foreground">
					<div>© {new Date().getFullYear()} Fractionax Labs, Inc. All rights reserved.</div>
					<div className="text-balance max-w-2xl">
						Investing involves risk, including loss of principal. Past performance does not
						guarantee future results. Fractionax is not a registered investment advisor in
						all jurisdictions; see Disclosures for details.
					</div>
				</div>
			</div>
		</footer>
	)
}

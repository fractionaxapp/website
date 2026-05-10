const ITEMS = [
	"Real estate",
	"Private credit",
	"Treasury yield",
	"Infrastructure",
	"Commercial loans",
	"Trade finance",
	"Renewables",
	"Receivables",
]

export function Marquee() {
	return (
		<section className="relative py-10 lg:py-12 border-y border-border/40 overflow-hidden">
			<div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
			<div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 mb-6">
				<div className="text-center text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
					Asset classes your AI can invest in
				</div>
			</div>

			<div className="flex w-max animate-flow" style={{ animationDuration: "40s" }}>
				{[0, 1].map((dup) => (
					<div key={dup} className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={dup === 1}>
						{ITEMS.map((item, i) => (
							<div key={i} className="flex items-center gap-4 shrink-0">
								<span className="size-1 rounded-full bg-primary" />
								<span className="font-display text-2xl lg:text-3xl text-muted-foreground whitespace-nowrap">
									{item}
								</span>
							</div>
						))}
					</div>
				))}
			</div>
		</section>
	)
}

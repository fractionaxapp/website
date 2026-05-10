import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { Marquee } from "@/components/landing/marquee"
import { TheShift } from "@/components/landing/the-shift"
import { HowItWorks } from "@/components/landing/how-it-works"
import { AssetClasses } from "@/components/landing/asset-classes"
import { Agents } from "@/components/landing/agents"
import { Trust } from "@/components/landing/trust"
import { Stats } from "@/components/landing/stats"
import { Faq } from "@/components/landing/faq"
import { Cta } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function Page() {
	return (
		<>
			<Nav />
			<main className="flex-1">
				<Hero />
				<Marquee />
				<TheShift />
				<HowItWorks />
				<AssetClasses />
				<Agents />
				<Stats />
				<Trust />
				<Faq />
				<Cta />
			</main>
			<Footer />
		</>
	)
}

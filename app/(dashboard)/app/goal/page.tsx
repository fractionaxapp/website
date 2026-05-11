"use client"

import { ArrowRight, Check, Loader2, Sparkles, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { activateGoalFromPrompt } from "@/lib/state/goal"
import { altGoals, exampleGoal, goalSteps, type AgentStep } from "@/lib/mock/goal-flow"

type Phase = "input" | "running" | "complete"

const TONE_CLASS: Record<AgentStep["tone"], { dot: string; bg: string; text: string; border: string }> = {
	primary: { dot: "bg-primary", bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" },
	info: { dot: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
	warning: { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30" },
	purple: { dot: "bg-purple-500", bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" },
	rose: { dot: "bg-rose-500", bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/30" },
}

export default function GoalPage() {
	const router = useRouter()
	const [phase, setPhase] = useState<Phase>("input")
	const [prompt, setPrompt] = useState("")
	const [currentStep, setCurrentStep] = useState(0)
	const [completedSteps, setCompletedSteps] = useState<string[]>([])

	useEffect(() => {
		if (phase !== "running") return
		if (currentStep >= goalSteps.length) {
			setTimeout(() => setPhase("complete"), 500)
			return
		}
		const step = goalSteps[currentStep]
		const timer = setTimeout(() => {
			setCompletedSteps((prev) => [...prev, step.id])
			setCurrentStep((s) => s + 1)
		}, step.durationMs)
		return () => clearTimeout(timer)
	}, [phase, currentStep])

	function start(input: string) {
		const finalPrompt = input.trim().length > 0 ? input.trim() : exampleGoal
		setPrompt(finalPrompt)
		activateGoalFromPrompt(finalPrompt)
		setCurrentStep(0)
		setCompletedSteps([])
		setPhase("running")
	}

	function reset() {
		setPhase("input")
		setCurrentStep(0)
		setCompletedSteps([])
		setPrompt("")
	}

	return (
		<div className="min-h-[calc(100vh-3.5rem)] bg-background overflow-x-hidden">
			<AnimatePresence mode="wait">
				{phase === "input" && (
					<motion.div
						key="input"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="px-4 lg:px-8 py-10 lg:py-20"
					>
						<div className="mx-auto max-w-3xl text-center">
							<div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 backdrop-blur px-3 py-1.5 text-xs">
								<Sparkles className="size-3 text-primary" />
								<span className="text-muted-foreground">New autonomous goal</span>
							</div>
							<h1 className="font-display mt-6 text-4xl lg:text-6xl font-medium tracking-tight">
								What do you want
								<br />
								<span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">your money to do?</span>
							</h1>
							<p className="mt-5 text-sm lg:text-base text-muted-foreground max-w-xl mx-auto">
								Write it in plain English. Your agents will source the deal, underwrite the risk, execute on Solana, and manage it 24/7.
							</p>

							<GoalInput onSubmit={start} />

							<div className="mt-8">
								<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 mb-3">
									Or try one of these
								</div>
								<div className="flex flex-wrap justify-center gap-2">
									{altGoals.map((g) => (
										<button
											key={g}
											onClick={() => start(g)}
											className="text-xs px-3 h-8 rounded-full border border-border/60 bg-card/40 hover:border-foreground/30 hover:bg-card/70 transition-colors"
										>
											{g}
										</button>
									))}
								</div>
							</div>
						</div>
					</motion.div>
				)}

				{phase === "running" && (
					<motion.div
						key="running"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="px-4 lg:px-8 py-8 lg:py-12"
					>
						<div className="mx-auto max-w-5xl">
							<div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur p-5">
								<div className="flex items-start gap-3">
									<div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
										<Sparkles className="size-4" />
									</div>
									<div className="min-w-0 flex-1">
										<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Goal</div>
										<div className="text-base font-medium mt-0.5">{prompt}</div>
									</div>
									<div className="text-right shrink-0">
										<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">Progress</div>
										<div className="text-sm font-medium tabular-nums mt-0.5">
											{completedSteps.length} / {goalSteps.length}
										</div>
									</div>
								</div>
							</div>

							<div className="mt-6 space-y-3">
								{goalSteps.map((step, i) => {
									const isComplete = completedSteps.includes(step.id)
									const isActive = currentStep === i && !isComplete
									const isPending = !isComplete && !isActive
									return (
										<StepCard
											key={step.id}
											step={step}
											state={isComplete ? "complete" : isActive ? "active" : "pending"}
											stepNumber={i + 1}
											hidden={isPending && i > currentStep + 1}
										/>
									)
								})}
							</div>
						</div>
					</motion.div>
				)}

				{phase === "complete" && (
					<motion.div
						key="complete"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="px-4 lg:px-8 py-10 lg:py-16"
					>
						<div className="mx-auto max-w-2xl">
							<div className="rounded-2xl border border-primary/40 bg-primary/[0.04] p-8 text-center">
								<motion.div
									initial={{ scale: 0.6, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ type: "spring", stiffness: 300, damping: 18 }}
									className="size-14 rounded-full bg-primary/15 text-primary mx-auto flex items-center justify-center"
								>
									<Check className="size-7" strokeWidth={2.5} />
								</motion.div>
								<h2 className="font-display mt-6 text-3xl font-medium">Goal active</h2>
								<p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
									Your $2,000 is deployed across 3 RWAs at a blended <span className="text-primary font-medium">8.4% APY</span>. Agents will continue working on this 24/7.
								</p>

								<div className="mt-6 rounded-xl bg-card/60 border border-border/40 p-4 text-left">
									{goalSteps.find((s) => s.id === "portfolio")?.outputs.map((o) => (
										<div key={o.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
											<span className="text-xs">{o.label}</span>
											<span className={`text-xs tabular-nums font-medium ${o.accent ? "text-primary" : ""}`}>{o.value}</span>
										</div>
									))}
								</div>

								<div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
									<button
										onClick={() => router.push("/app")}
										className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90"
									>
										Open portfolio <ArrowRight className="size-3.5" />
									</button>
									<button
										onClick={reset}
										className="inline-flex items-center justify-center h-10 px-5 rounded-md border border-border/60 text-sm font-medium hover:bg-card/60"
									>
										New goal
									</button>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

function GoalInput({ onSubmit }: { onSubmit: (v: string) => void }) {
	const [value, setValue] = useState("")
	const inputRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			onSubmit(value)
		}
	}

	return (
		<div className="mt-10">
			<div className="relative rounded-2xl border border-border/60 bg-card/40 backdrop-blur focus-within:border-foreground/40 transition-colors">
				<textarea
					ref={inputRef}
					rows={3}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={handleKey}
					placeholder={exampleGoal}
					className="w-full bg-transparent resize-none px-5 py-4 pr-32 text-base outline-none placeholder:text-muted-foreground/60"
				/>
				<button
					onClick={() => onSubmit(value)}
					className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90"
				>
					Start <ArrowRight className="size-3.5" />
				</button>
			</div>
			<div className="mt-2 text-[10px] text-muted-foreground/60 font-mono">
				Press Enter to start · Shift+Enter for newline
			</div>
		</div>
	)
}

function StepCard({
	step,
	state,
	stepNumber,
	hidden,
}: {
	step: AgentStep
	state: "pending" | "active" | "complete"
	stepNumber: number
	hidden?: boolean
}) {
	const tone = TONE_CLASS[step.tone]
	const [visibleThoughts, setVisibleThoughts] = useState<number>(0)

	useEffect(() => {
		if (state !== "active") {
			if (state === "complete") setVisibleThoughts(step.thoughts.length)
			else setVisibleThoughts(0)
			return
		}
		setVisibleThoughts(0)
		const perThought = step.durationMs / (step.thoughts.length + 0.5)
		const timers: ReturnType<typeof setTimeout>[] = []
		step.thoughts.forEach((_, i) => {
			timers.push(setTimeout(() => setVisibleThoughts(i + 1), perThought * (i + 1)))
		})
		return () => timers.forEach(clearTimeout)
	}, [state, step.durationMs, step.thoughts])

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 12 }}
			animate={{
				opacity: hidden ? 0.35 : 1,
				y: 0,
				scale: state === "active" ? 1 : 0.99,
			}}
			transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
			className={`rounded-xl border bg-card/40 backdrop-blur p-5 transition-all ${
				state === "active" ? `${tone.border} shadow-lg shadow-primary/[0.03]` : "border-border/60"
			}`}
		>
			<div className="flex items-start gap-4">
				<div className={`size-10 rounded-lg ${tone.bg} ${tone.text} flex items-center justify-center shrink-0 font-mono text-xs font-medium`}>
					{state === "complete" ? <Check className="size-4" /> :
						state === "active" ? <Loader2 className="size-4 animate-spin" /> :
						<span>{String(stepNumber).padStart(2, "0")}</span>}
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex items-baseline gap-2 flex-wrap">
						<div className={`text-[10px] font-mono uppercase tracking-wider ${tone.text}`}>{step.agent}</div>
						<div className="text-[10px] text-muted-foreground/40">·</div>
						<div className="text-[10px] text-muted-foreground/70">{step.agentLabel}</div>
					</div>
					<div className="text-sm font-medium mt-0.5">{step.title}</div>

					<AnimatePresence>
						{state !== "pending" && (
							<motion.ul
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mt-3 space-y-1.5"
							>
								{step.thoughts.slice(0, visibleThoughts).map((t, i) => (
									<motion.li
										key={i}
										initial={{ opacity: 0, x: -8 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.2 }}
										className="flex items-start gap-2 text-xs text-muted-foreground font-mono"
									>
										<span className={`mt-1 size-1 rounded-full ${tone.dot} shrink-0`} />
										{t}
									</motion.li>
								))}
							</motion.ul>
						)}
					</AnimatePresence>

					{state !== "pending" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.15 }}
							className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-border/30"
						>
							{step.outputs.map((o) => (
								<div key={o.label}>
									<div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/50">{o.label}</div>
									<div className={`text-sm font-medium tabular-nums mt-0.5 ${o.accent ? tone.text : ""}`}>
										{o.value}
									</div>
								</div>
							))}
						</motion.div>
					)}
				</div>

				{state === "active" && (
					<button
						className="size-7 inline-flex items-center justify-center rounded-md hover:bg-foreground/[0.04] text-muted-foreground/40 hover:text-foreground"
						aria-label="Stop"
					>
						<X className="size-3.5" />
					</button>
				)}
			</div>
		</motion.div>
	)
}

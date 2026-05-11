"use client"

import { useEffect, useState } from "react"
import { goalAllocations, type ActiveGoal } from "@/lib/mock/goal-flow"

const KEY = "fractionax.activeGoal"

function read(): ActiveGoal | null {
	if (typeof window === "undefined") return null
	try {
		const raw = localStorage.getItem(KEY)
		if (!raw) return null
		return JSON.parse(raw) as ActiveGoal
	} catch {
		return null
	}
}

function write(goal: ActiveGoal | null) {
	if (typeof window === "undefined") return
	if (goal) {
		localStorage.setItem(KEY, JSON.stringify(goal))
	} else {
		localStorage.removeItem(KEY)
	}
	window.dispatchEvent(new CustomEvent("fractionax:goal-change"))
}

export function activateGoalFromPrompt(prompt: string) {
	const capitalMatch = prompt.match(/\$?([\d,]+)(k|K|M)?/)
	let capital = 2000
	if (capitalMatch) {
		const num = Number(capitalMatch[1].replace(/,/g, ""))
		const unit = capitalMatch[2]
		capital = unit === "k" || unit === "K" ? num * 1000 : unit === "M" ? num * 1_000_000 : num
	}
	const apyBlended = goalAllocations.reduce((s, a) => s + (a.apy * a.pct) / 100, 0)
	const goal: ActiveGoal = {
		prompt: prompt.trim(),
		capital,
		apyBlended: Number(apyBlended.toFixed(2)),
		createdAt: new Date().toISOString(),
		allocations: goalAllocations,
	}
	write(goal)
	return goal
}

export function clearGoal() {
	write(null)
}

export function useActiveGoal(): ActiveGoal | null {
	const [goal, setGoal] = useState<ActiveGoal | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		setGoal(read())
		const onChange = () => setGoal(read())
		window.addEventListener("fractionax:goal-change", onChange)
		window.addEventListener("storage", onChange)
		return () => {
			window.removeEventListener("fractionax:goal-change", onChange)
			window.removeEventListener("storage", onChange)
		}
	}, [])

	return mounted ? goal : null
}

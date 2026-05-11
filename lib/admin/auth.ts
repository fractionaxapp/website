import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "admin_session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7

function requireSecret(): string {
	const secret = process.env.ADMIN_SECRET
	if (!secret || secret.length < 16) {
		throw new Error("ADMIN_SECRET must be set and at least 16 characters")
	}
	return secret
}

function sign(payload: string): string {
	return createHmac("sha256", requireSecret()).update(payload).digest("hex")
}

function safeEqual(a: string, b: string): boolean {
	const ab = Buffer.from(a)
	const bb = Buffer.from(b)
	if (ab.length !== bb.length) return false
	return timingSafeEqual(ab, bb)
}

export function verifyPassword(submitted: string): boolean {
	const expected = process.env.ADMIN_PASSWORD
	if (!expected) throw new Error("ADMIN_PASSWORD is not set")
	if (submitted.length === 0) return false
	return safeEqual(submitted.padEnd(expected.length, "\0"), expected.padEnd(submitted.length, "\0"))
		&& submitted.length === expected.length
}

export function buildSessionToken(): string {
	const expiresAt = Date.now() + SESSION_TTL_MS
	const payload = String(expiresAt)
	return `${payload}.${sign(payload)}`
}

export function isSessionTokenValid(token: string | undefined): boolean {
	if (!token) return false
	const dot = token.indexOf(".")
	if (dot === -1) return false
	const payload = token.slice(0, dot)
	const sig = token.slice(dot + 1)
	const expected = sign(payload)
	if (!safeEqual(sig, expected)) return false
	const expiresAt = Number(payload)
	if (!Number.isFinite(expiresAt)) return false
	return Date.now() < expiresAt
}

export async function isAdminAuthenticated(): Promise<boolean> {
	const store = await cookies()
	return isSessionTokenValid(store.get(COOKIE_NAME)?.value)
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME
export const ADMIN_SESSION_TTL_MS = SESSION_TTL_MS

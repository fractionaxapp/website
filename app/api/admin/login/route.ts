import { cookies } from "next/headers"
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_TTL_MS, buildSessionToken, verifyPassword } from "@/lib/admin/auth"

export const runtime = "nodejs"

export async function POST(request: Request) {
	let password: unknown
	try {
		const body = await request.json()
		password = body?.password
	} catch {
		return Response.json({ ok: false, error: "Invalid request" }, { status: 400 })
	}

	if (typeof password !== "string" || password.length === 0) {
		return Response.json({ ok: false, error: "Password required" }, { status: 400 })
	}

	if (!verifyPassword(password)) {
		return Response.json({ ok: false, error: "Incorrect password" }, { status: 401 })
	}

	const store = await cookies()
	store.set(ADMIN_COOKIE_NAME, buildSessionToken(), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
	})

	return Response.json({ ok: true })
}

import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin/auth"
import { LoginForm } from "./login-form"

export const dynamic = "force-dynamic"

export default async function AdminLoginPage({
	searchParams,
}: {
	searchParams: Promise<{ next?: string }>
}) {
	if (await isAdminAuthenticated()) {
		redirect("/admin")
	}
	const params = await searchParams
	const next = typeof params.next === "string" && params.next.startsWith("/admin") ? params.next : "/admin"

	return (
		<main className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-sm">
				<h1 className="font-display text-2xl font-medium">Admin sign-in</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Restricted to the project owner.
				</p>
				<LoginForm nextUrl={next} />
			</div>
		</main>
	)
}

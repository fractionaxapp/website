import { desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin/auth"
import { db } from "@/lib/db"
import { waitlist } from "@/lib/db/schema"
import { LogoutButton } from "./logout-button"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
	if (!(await isAdminAuthenticated())) {
		redirect("/admin/login")
	}

	const entries = await db.select().from(waitlist).orderBy(desc(waitlist.createdAt))

	return (
		<main className="mx-auto max-w-5xl px-6 py-10 lg:py-14">
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="font-display text-2xl font-medium">Waitlist</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{entries.length} {entries.length === 1 ? "signup" : "signups"} total
					</p>
				</div>
				<LogoutButton />
			</div>

			<div className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-card/40">
				{entries.length === 0 ? (
					<div className="p-10 text-center text-sm text-muted-foreground">
						No signups yet.
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border/60 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
									<th className="px-4 py-3 font-normal">#</th>
									<th className="px-4 py-3 font-normal">Email</th>
									<th className="px-4 py-3 font-normal">Source</th>
									<th className="px-4 py-3 font-normal">Submitted</th>
									<th className="px-4 py-3 font-normal">Referrer</th>
								</tr>
							</thead>
							<tbody>
								{entries.map((row, i) => (
									<tr key={row.id} className="border-b border-border/30 last:border-0">
										<td className="px-4 py-3 text-muted-foreground tabular-nums">{i + 1}</td>
										<td className="px-4 py-3 font-medium">{row.email}</td>
										<td className="px-4 py-3 text-muted-foreground">{row.source ?? "—"}</td>
										<td className="px-4 py-3 text-muted-foreground tabular-nums">
											{new Date(row.createdAt).toLocaleString()}
										</td>
										<td className="px-4 py-3 text-muted-foreground truncate max-w-[240px]">
											{row.referrer ?? "—"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</main>
	)
}

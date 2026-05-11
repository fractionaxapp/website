import { desc, eq, sql } from "drizzle-orm"
import Link from "next/link"
import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin/auth"
import { db } from "@/lib/db"
import { assets, users, waitlist } from "@/lib/db/schema"
import { LogoutButton } from "./logout-button"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
	if (!(await isAdminAuthenticated())) {
		redirect("/admin/login")
	}

	const [entries, userCount, assetCount, pendingCount] = await Promise.all([
		db.select().from(waitlist).orderBy(desc(waitlist.createdAt)),
		db.select({ n: sql<number>`count(*)::int` }).from(users),
		db.select({ n: sql<number>`count(*)::int` }).from(assets),
		db.select({ n: sql<number>`count(*)::int` }).from(assets).where(eq(assets.status, "in_review")),
	])

	return (
		<main className="mx-auto max-w-5xl px-6 py-10 lg:py-14">
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="font-display text-2xl font-medium">Admin</h1>
					<p className="mt-1 text-sm text-muted-foreground">Platform operations and review queues</p>
				</div>
				<LogoutButton />
			</div>

			<div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
				<StatTile label="Users" value={String(userCount[0]?.n ?? 0)} />
				<StatTile label="Assets" value={String(assetCount[0]?.n ?? 0)} />
				<StatTile
					label="In review"
					value={String(pendingCount[0]?.n ?? 0)}
					href="/admin/assets"
					accent={(pendingCount[0]?.n ?? 0) > 0}
				/>
				<StatTile label="Waitlist" value={String(entries.length)} />
			</div>

			<div className="mt-10 flex items-center justify-between">
				<h2 className="text-base font-medium">Waitlist</h2>
				<Link href="/admin/assets" className="text-xs text-muted-foreground hover:text-foreground">
					Asset queue →
				</Link>
			</div>

			<div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-card/40">
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

function StatTile({
	label,
	value,
	href,
	accent,
}: {
	label: string
	value: string
	href?: string
	accent?: boolean
}) {
	const cls = `rounded-xl border p-4 ${accent ? "border-amber-500/40 bg-amber-500/[0.04]" : "border-border/60 bg-card/40"}`
	const content = (
		<>
			<div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">{label}</div>
			<div className="mt-1.5 text-2xl font-medium tabular-nums">{value}</div>
		</>
	)
	if (href) return <Link href={href} className={`${cls} hover:border-foreground/30 transition-colors block`}>{content}</Link>
	return <div className={cls}>{content}</div>
}

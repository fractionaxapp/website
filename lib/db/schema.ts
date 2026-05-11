import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const waitlist = pgTable("waitlist", {
	id: serial("id").primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	source: varchar("source", { length: 64 }),
	userAgent: text("user_agent"),
	referrer: text("referrer"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export type WaitlistEntry = typeof waitlist.$inferSelect
export type NewWaitlistEntry = typeof waitlist.$inferInsert

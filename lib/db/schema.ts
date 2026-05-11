import { pgTable, pgEnum, serial, text, timestamp, varchar, uniqueIndex } from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role", ["investor", "asset_owner"])

export const users = pgTable(
	"users",
	{
		id: serial("id").primaryKey(),
		privyId: varchar("privy_id", { length: 128 }).notNull().unique(),
		email: varchar("email", { length: 255 }),
		walletAddress: varchar("wallet_address", { length: 64 }),
		displayName: varchar("display_name", { length: 120 }),
		role: userRoleEnum("role"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		emailIdx: uniqueIndex("users_email_idx").on(table.email),
	}),
)

export const waitlist = pgTable("waitlist", {
	id: serial("id").primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	source: varchar("source", { length: 64 }),
	userAgent: text("user_agent"),
	referrer: text("referrer"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type WaitlistEntry = typeof waitlist.$inferSelect
export type NewWaitlistEntry = typeof waitlist.$inferInsert

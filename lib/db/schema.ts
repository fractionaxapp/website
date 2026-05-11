import { relations } from "drizzle-orm"
import {
	pgTable,
	pgEnum,
	serial,
	integer,
	text,
	timestamp,
	varchar,
	uniqueIndex,
	numeric,
	jsonb,
	index,
} from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role", ["investor", "asset_owner"])
export const assetStatusEnum = pgEnum("asset_status", ["draft", "in_review", "fundraising", "live", "closed"])
export const goalStatusEnum = pgEnum("goal_status", ["active", "paused", "completed"])
export const txKindEnum = pgEnum("tx_kind", ["deposit", "withdraw", "allocation", "yield", "rebalance", "kyc", "trade"])

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

export const assets = pgTable(
	"assets",
	{
		id: serial("id").primaryKey(),
		slug: varchar("slug", { length: 64 }).notNull().unique(),
		name: varchar("name", { length: 255 }).notNull(),
		category: varchar("category", { length: 64 }).notNull(),
		region: varchar("region", { length: 64 }),
		description: text("description"),
		targetApy: numeric("target_apy", { precision: 5, scale: 2 }),
		risk: varchar("risk", { length: 16 }),
		tenor: varchar("tenor", { length: 64 }),
		minInvestment: numeric("min_investment", { precision: 14, scale: 2 }).default("10"),
		targetRaise: numeric("target_raise", { precision: 14, scale: 2 }),
		currentRaised: numeric("current_raised", { precision: 14, scale: 2 }).default("0").notNull(),
		status: assetStatusEnum("status").notNull().default("fundraising"),
		ownerId: integer("owner_id").references(() => users.id, { onDelete: "set null" }),
		highlights: jsonb("highlights").$type<string[]>().default([]),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		statusIdx: index("assets_status_idx").on(table.status),
		ownerIdx: index("assets_owner_idx").on(table.ownerId),
	}),
)

export const goals = pgTable(
	"goals",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
		prompt: text("prompt").notNull(),
		capital: numeric("capital", { precision: 14, scale: 2 }).notNull(),
		blendedApy: numeric("blended_apy", { precision: 5, scale: 2 }),
		status: goalStatusEnum("status").notNull().default("active"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		userIdx: index("goals_user_idx").on(table.userId),
	}),
)

export const holdings = pgTable(
	"holdings",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
		assetId: integer("asset_id").notNull().references(() => assets.id, { onDelete: "restrict" }),
		amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
		tokens: numeric("tokens", { precision: 20, scale: 6 }).notNull(),
		goalId: integer("goal_id").references(() => goals.id, { onDelete: "set null" }),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		userAssetIdx: uniqueIndex("holdings_user_asset_idx").on(table.userId, table.assetId),
		userIdx: index("holdings_user_idx").on(table.userId),
	}),
)

export const transactions = pgTable(
	"transactions",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
		kind: txKindEnum("kind").notNull(),
		assetId: integer("asset_id").references(() => assets.id, { onDelete: "set null" }),
		amount: numeric("amount", { precision: 14, scale: 2 }),
		title: varchar("title", { length: 255 }).notNull(),
		subtitle: text("subtitle"),
		agent: varchar("agent", { length: 64 }),
		meta: jsonb("meta"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => ({
		userTimeIdx: index("transactions_user_time_idx").on(table.userId, table.createdAt),
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

export const usersRelations = relations(users, ({ many }) => ({
	holdings: many(holdings),
	goals: many(goals),
	transactions: many(transactions),
	ownedAssets: many(assets),
}))

export const assetsRelations = relations(assets, ({ one, many }) => ({
	owner: one(users, { fields: [assets.ownerId], references: [users.id] }),
	holdings: many(holdings),
}))

export const holdingsRelations = relations(holdings, ({ one }) => ({
	user: one(users, { fields: [holdings.userId], references: [users.id] }),
	asset: one(assets, { fields: [holdings.assetId], references: [assets.id] }),
	goal: one(goals, { fields: [holdings.goalId], references: [goals.id] }),
}))

export const goalsRelations = relations(goals, ({ one, many }) => ({
	user: one(users, { fields: [goals.userId], references: [users.id] }),
	holdings: many(holdings),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
	user: one(users, { fields: [transactions.userId], references: [users.id] }),
	asset: one(assets, { fields: [transactions.assetId], references: [assets.id] }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Asset = typeof assets.$inferSelect
export type NewAsset = typeof assets.$inferInsert
export type Holding = typeof holdings.$inferSelect
export type NewHolding = typeof holdings.$inferInsert
export type Goal = typeof goals.$inferSelect
export type NewGoal = typeof goals.$inferInsert
export type Transaction = typeof transactions.$inferSelect
export type NewTransaction = typeof transactions.$inferInsert
export type WaitlistEntry = typeof waitlist.$inferSelect
export type NewWaitlistEntry = typeof waitlist.$inferInsert

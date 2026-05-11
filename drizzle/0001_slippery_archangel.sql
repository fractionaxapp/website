CREATE TYPE "public"."user_role" AS ENUM('investor', 'asset_owner');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"privy_id" varchar(128) NOT NULL,
	"email" varchar(255),
	"wallet_address" varchar(64),
	"display_name" varchar(120),
	"role" "user_role",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_privy_id_unique" UNIQUE("privy_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
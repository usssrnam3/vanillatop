import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  steamId: varchar("steam_id", { length: 64 }).notNull(),
  steamId64: varchar("steam_id64", { length: 32 }),
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  donationId: integer("donation_id"),
  donationMessage: varchar("donation_message", { length: 512 }),
  fulfilledAt: timestamp("fulfilled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

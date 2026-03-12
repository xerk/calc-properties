import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const scenarios = sqliteTable("scenarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  balanceUSD: real("balance_usd").notNull(),
  maxSalaryUSD: real("max_salary_usd").notNull(),
  worstSalaryUSD: real("worst_salary_usd").notNull(),
  exchangeRate: real("exchange_rate").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type Scenario = typeof scenarios.$inferSelect;
export type NewScenario = typeof scenarios.$inferInsert;

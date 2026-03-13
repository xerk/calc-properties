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

// Projects table (TALALA, Club Views, Elm Tree Park, etc.)
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  location: text("location").notNull(),
  parent: text("parent"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  description: text("description"),
  mapX: text("map_x"), // CSS position for stylized map
  mapY: text("map_y"),
  mapColor: text("map_color"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

// Properties table (individual units)
export const properties = sqliteTable("properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").references(() => projects.id),
  type: text("type").notNull(), // "S.Villa", "Villa", "S.Villa A", etc.
  bua: integer("bua").notNull(), // Built-up area in sqm
  finished: integer("finished", { mode: "boolean" }).default(false),
  startDate: text("start_date"),
  maintenancePct: real("maintenance_pct").notNull(),
  unitPrice: real("unit_price").notNull(),

  // Standard plan
  standardDiscount: real("standard_discount"),
  standardFinal: real("standard_final"),
  standardInstallments: integer("standard_installments"),
  standardDuration: integer("standard_duration"),
  downPaymentStd: real("down_payment_std"),
  monthlyStd: real("monthly_std"),
  quarterlyStd: real("quarterly_std"),
  annualBumpStd: real("annual_bump_std"),

  // Custom plan
  customDiscount: real("custom_discount"),
  customFinal: real("custom_final"),
  customInstallments: integer("custom_installments"),
  customDuration: integer("custom_duration"),
  downPaymentCustom: real("down_payment_custom"),
  quarterlyCustom: real("quarterly_custom"),

  // Calculated values
  npv: real("npv"),
  maintenanceAmount: real("maintenance_amount"),

  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export type DbProperty = typeof properties.$inferSelect;
export type NewDbProperty = typeof properties.$inferInsert;

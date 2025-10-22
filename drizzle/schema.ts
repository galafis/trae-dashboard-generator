import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /**
   * OAuth identifier (openId) returned from the OAuth callback. Unique per user.
   * This should be used for authentication lookups.
   */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Datasets table for storing uploaded CSV data
 */
export const datasets = mysqlTable("datasets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  columns: json("columns").$type<string[]>().notNull(),
  rowCount: int("rowCount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = typeof datasets.$inferInsert;

/**
 * Dashboards table for storing dashboard configurations
 */
export const dashboards = mysqlTable("dashboards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  datasetId: int("datasetId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  config: json("config").$type<DashboardConfig>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dashboard = typeof dashboards.$inferSelect;
export type InsertDashboard = typeof dashboards.$inferInsert;

/**
 * Dashboard configuration type
 */
export interface DashboardConfig {
  charts: ChartConfig[];
  title: string;
  theme: "light" | "dark";
}

export interface ChartConfig {
  id: string;
  type: "bar" | "line" | "scatter" | "pie" | "area";
  title: string;
  xAxis: string;
  yAxis: string;
  color?: string;
}

/**
 * Relations
 */
export const usersRelations = relations(users, ({ many }) => ({
  datasets: many(datasets),
  dashboards: many(dashboards),
}));

export const datasetsRelations = relations(datasets, ({ one, many }) => ({
  user: one(users, {
    fields: [datasets.userId],
    references: [users.id],
  }),
  dashboards: many(dashboards),
}));

export const dashboardsRelations = relations(dashboards, ({ one }) => ({
  user: one(users, {
    fields: [dashboards.userId],
    references: [users.id],
  }),
  dataset: one(datasets, {
    fields: [dashboards.datasetId],
    references: [datasets.id],
  }),
}));
import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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
 * Tabela para armazenar resultados do teste de tipo psicológico
 */
export const psychologicalTestResults = mysqlTable("psychological_test_results", {
  id: int("id").autoincrement().primaryKey(),
  /** Nome completo da pessoa que respondeu */
  fullName: varchar("fullName", { length: 255 }).notNull(),
  /** Tipo psicológico calculado (ex: INTJ, ENFP) */
  psychologicalType: varchar("psychologicalType", { length: 4 }).notNull(),
  /** JSON com as respostas (id da questão -> a ou b) */
  answers: json("answers").notNull(),
  /** JSON com os scores de cada dimensão */
  scores: json("scores").notNull(),
  /** IP do usuário (suporta IPv6 + IPv4) */
  ipAddress: varchar("ipAddress", { length: 100 }),
  /** Se o resultado foi enviado para o email do administrador */
  sentToAdminEmail: timestamp("sentToAdminEmail"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PsychologicalTestResult = typeof psychologicalTestResults.$inferSelect;
export type InsertPsychologicalTestResult = typeof psychologicalTestResults.$inferInsert;
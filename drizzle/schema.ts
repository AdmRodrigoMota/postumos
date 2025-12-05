import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, datetime } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  password: varchar("password", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Memorial profiles for deceased individuals.
 */
export const memorialProfiles = mysqlTable("memorial_profiles", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  photoUrl: text("photoUrl"),
  photoKey: text("photoKey"),
  birthDate: datetime("birthDate"),
  deathDate: datetime("deathDate"),
  biography: text("biography"),
  visitCount: int("visitCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MemorialProfile = typeof memorialProfiles.$inferSelect;
export type InsertMemorialProfile = typeof memorialProfiles.$inferInsert;

/**
 * Photo gallery for memorial profiles.
 */
export const memorialPhotos = mysqlTable("memorial_photos", {
  id: int("id").autoincrement().primaryKey(),
  memorialId: int("memorialId").notNull(),
  uploadedBy: int("uploadedBy").notNull(),
  photoUrl: text("photoUrl").notNull(),
  photoKey: text("photoKey").notNull(),
  caption: text("caption"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MemorialPhoto = typeof memorialPhotos.$inferSelect;
export type InsertMemorialPhoto = typeof memorialPhotos.$inferInsert;

/**
 * Messages and tributes left on memorial profiles.
 */
export const memorialMessages = mysqlTable("memorial_messages", {
  id: int("id").autoincrement().primaryKey(),
  memorialId: int("memorialId").notNull(),
  authorId: int("authorId"),
  authorName: varchar("authorName", { length: 255 }),
  content: text("content").notNull(),
  isReported: boolean("isReported").default(false).notNull(),
  isHidden: boolean("isHidden").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MemorialMessage = typeof memorialMessages.$inferSelect;
export type InsertMemorialMessage = typeof memorialMessages.$inferInsert;

/**
 * Activity feed tracking recent events.
 */
export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["profile_created", "message_posted", "photo_added"]).notNull(),
  memorialId: int("memorialId").notNull(),
  userId: int("userId"),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

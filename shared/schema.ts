import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  balance: integer("balance").notNull().default(1000),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const updateUserSchema = z.object({
  username: z.string().min(1).max(20).optional(),
  balance: z.number().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

// Game results - now linked to users
export const gameResults = pgTable("game_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  result: text("result").notNull(), // "win", "loss", "push", "blackjack"
  playerScore: integer("player_score").notNull(),
  dealerScore: integer("dealer_score").notNull(),
  betAmount: integer("bet_amount").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameResultSchema = createInsertSchema(gameResults).omit({ id: true, createdAt: true });

export type GameResult = typeof gameResults.$inferSelect;
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;

export type CreateGameResultRequest = InsertGameResult;
export type GameResultResponse = GameResult;

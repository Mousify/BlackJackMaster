import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll track game results for persistence
export const gameResults = pgTable("game_results", {
  id: serial("id").primaryKey(),
  result: text("result").notNull(), // "win", "loss", "push", "blackjack"
  playerScore: integer("player_score").notNull(),
  dealerScore: integer("dealer_score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameResultSchema = createInsertSchema(gameResults).omit({ id: true, createdAt: true });

export type GameResult = typeof gameResults.$inferSelect;
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;

export type CreateGameResultRequest = InsertGameResult;
export type GameResultResponse = GameResult;

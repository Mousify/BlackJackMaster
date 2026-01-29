import { db } from "./db";
import {
  gameResults,
  type CreateGameResultRequest,
  type GameResultResponse
} from "@shared/schema";

export interface IStorage {
  getGameResults(): Promise<GameResultResponse[]>;
  createGameResult(result: CreateGameResultRequest): Promise<GameResultResponse>;
}

export class DatabaseStorage implements IStorage {
  async getGameResults(): Promise<GameResultResponse[]> {
    return await db.select().from(gameResults).orderBy(gameResults.createdAt);
  }

  async createGameResult(insertResult: CreateGameResultRequest): Promise<GameResultResponse> {
    const [result] = await db.insert(gameResults)
      .values(insertResult)
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();

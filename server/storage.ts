import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  gameResults,
  users,
  type CreateGameResultRequest,
  type GameResultResponse,
  type User,
  type InsertUser,
  type UpdateUser,
} from "@shared/schema";

export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  updateUser(id: number, data: UpdateUser): Promise<User | null>;
  checkUsernameAvailable(username: string): Promise<boolean>;
  
  // Game Results
  getGameResults(): Promise<GameResultResponse[]>;
  getGameResultsByUser(userId: number): Promise<GameResultResponse[]>;
  createGameResult(result: CreateGameResultRequest): Promise<GameResultResponse>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async createUser(user: InsertUser): Promise<User> {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }

  async getUserById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || null;
  }

  async updateUser(id: number, data: UpdateUser): Promise<User | null> {
    const [result] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result || null;
  }

  async checkUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    return user === null;
  }

  // Game Results
  async getGameResults(): Promise<GameResultResponse[]> {
    return await db.select().from(gameResults).orderBy(gameResults.createdAt);
  }

  async getGameResultsByUser(userId: number): Promise<GameResultResponse[]> {
    return await db.select().from(gameResults).where(eq(gameResults.userId, userId)).orderBy(gameResults.createdAt);
  }

  async createGameResult(insertResult: CreateGameResultRequest): Promise<GameResultResponse> {
    const [result] = await db.insert(gameResults)
      .values(insertResult)
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();

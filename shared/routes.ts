import { z } from 'zod';
import { insertGameResultSchema, insertUserSchema, updateUserSchema, gameResults, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  users: {
    create: {
      method: 'POST' as const,
      path: '/api/users',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
        409: z.object({ message: z.string() }),
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/users/login',
      input: z.object({ username: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/users/:id',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/users/:id',
      input: updateUserSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
        404: z.object({ message: z.string() }),
        409: z.object({ message: z.string() }),
      },
    },
    checkUsername: {
      method: 'GET' as const,
      path: '/api/users/check/:username',
      responses: {
        200: z.object({ available: z.boolean() }),
      },
    },
  },
  results: {
    list: {
      method: 'GET' as const,
      path: '/api/results',
      responses: {
        200: z.array(z.custom<typeof gameResults.$inferSelect>()),
      },
    },
    listByUser: {
      method: 'GET' as const,
      path: '/api/results/user/:userId',
      responses: {
        200: z.array(z.custom<typeof gameResults.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/results',
      input: insertGameResultSchema,
      responses: {
        201: z.custom<typeof gameResults.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

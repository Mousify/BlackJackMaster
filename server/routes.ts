import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer for avatar uploads
const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.params.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({ 
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', (await import('express')).static(path.join(process.cwd(), 'uploads')));

  // === Users API ===
  
  // Create user (signup)
  app.post(api.users.create.path, async (req, res) => {
    try {
      const input = api.users.create.input.parse(req.body);
      
      // Check if username is taken
      const isAvailable = await storage.checkUsernameAvailable(input.username);
      if (!isAvailable) {
        return res.status(409).json({ message: 'Username is already taken' });
      }
      
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Login
  app.post(api.users.login.path, async (req, res) => {
    try {
      const { username } = api.users.login.input.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Get user by ID
  app.get('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await storage.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  });

  // Update user
  app.patch('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const input = api.users.update.input.parse(req.body);
      
      // If changing username, check availability
      if (input.username) {
        const currentUser = await storage.getUserById(id);
        if (currentUser && currentUser.username !== input.username) {
          const isAvailable = await storage.checkUsernameAvailable(input.username);
          if (!isAvailable) {
            return res.status(409).json({ message: 'Username is already taken' });
          }
        }
      }
      
      const user = await storage.updateUser(id, input);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Check username availability
  app.get('/api/users/check/:username', async (req, res) => {
    const available = await storage.checkUsernameAvailable(req.params.username);
    res.json({ available });
  });

  // Upload avatar
  app.post('/api/users/:id/avatar', upload.single('avatar'), async (req, res) => {
    const idParam = req.params.id;
    const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await storage.updateUser(id, { avatarUrl });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  });

  // === Game Results API ===
  
  app.get(api.results.list.path, async (req, res) => {
    const results = await storage.getGameResults();
    res.json(results);
  });

  app.get('/api/results/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const results = await storage.getGameResultsByUser(userId);
    res.json(results);
  });

  app.post(api.results.create.path, async (req, res) => {
    try {
      const input = api.results.create.input.parse(req.body);
      const result = await storage.createGameResult(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}

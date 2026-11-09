import { Hono } from 'hono';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const authRoutes = new Hono();

// Publik
authRoutes.post('/register', AuthController.register);
authRoutes.post('/login', AuthController.login);
authRoutes.get('/demo-accounts', AuthController.getDemoAccounts);

// Terproteksi (Wajib Login)
authRoutes.get('/me', requireAuth, AuthController.me);

export default authRoutes;

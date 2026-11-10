import { Hono } from 'hono';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const authRoutes = new Hono();

// Publik
authRoutes.post('/register', AuthController.register);
authRoutes.post('/login', AuthController.login);
authRoutes.post('/forgot-password', AuthController.forgotPassword);
authRoutes.post('/reset-password', AuthController.resetPassword);

// Google OAuth2
authRoutes.get('/google/url', AuthController.getGoogleAuthUrl);
authRoutes.get('/google/callback', AuthController.handleGoogleCallback);
authRoutes.post('/google/token', AuthController.loginWithGoogleToken);

authRoutes.get('/demo-accounts', AuthController.getDemoAccounts);

// Terproteksi (Wajib Login)
authRoutes.get('/me', requireAuth, AuthController.me);

export default authRoutes;

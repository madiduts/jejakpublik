import { Hono } from 'hono';
import { SkpdController } from '../controllers/skpd.controller.js';

const router = new Hono();

router.get('/summary/apbd-2025', SkpdController.getSummaryApbd2025);
router.get('/', SkpdController.getAll);
router.get('/:id', SkpdController.getById);

export default router;

import { Hono } from 'hono';
import { ReportController } from '../controllers/report.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const storageRoutes = new Hono();

// Dedicated Storage & Evidence Endpoints
storageRoutes.post('/upload', optionalAuth, ReportController.uploadEvidence);
storageRoutes.get('/:filename', ReportController.getEvidence);
storageRoutes.delete('/:filename', optionalAuth, ReportController.deleteEvidence);

export default storageRoutes;

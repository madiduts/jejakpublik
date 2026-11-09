import { Hono } from 'hono';
import { ContentController } from '../controllers/content.controller.js';

const contentRoutes = new Hono();

contentRoutes.get('/glossary', ContentController.getGlossary);
contentRoutes.get('/about', ContentController.getAbout);
contentRoutes.get('/guide', ContentController.getGuide);

export default contentRoutes;

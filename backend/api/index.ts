import { handle } from '@hono/node-server/vercel';
import { app } from '../src/app.js';

// Runtime Node di Vercel memakai API IncomingMessage, bukan Fetch Request.
export const config = { api: { bodyParser: false } };

export default handle(app);

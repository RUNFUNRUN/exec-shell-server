import { sValidator } from '@hono/standard-validator';
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { logger } from 'hono/logger';
import { z } from 'zod';
import { dirnameSchema, execCommand } from './utils';

const token = process.env.TOKEN;

if (!token) {
  throw new Error('Bearer Auth TOKEN is required. Set it in .env file');
}

const app = new Hono();

app.use(bearerAuth({ token }), logger());

app.get('/', (c) => {
  return c.json({ message: 'Hello, World!' }, 200);
});

app.post(
  '/',
  sValidator(
    'json',
    z.object({
      dirname: dirnameSchema,
      command: z.string(),
    }),
  ),
  async (c) => {
    const { dirname, command } = c.req.valid('json');
    try {
      const { stdout, stderr } = await execCommand(dirname, command);
      if (stderr) {
        return c.json({ result: stderr }, 500);
      }
      return c.json({ result: stdout }, 200);
    } catch {
      return c.json({ result: 'An error occurred.' }, 500);
    }
  },
);

export default app;

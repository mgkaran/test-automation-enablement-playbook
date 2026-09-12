/**
 * A very small in-process API for the demonstration application.
 *
 * It is mounted as Vite middleware (see vite.config.ts) so that `npm run dev`
 * and `npm run preview` both serve it. Keeping it in-process avoids a second
 * server, a second port and CORS configuration - the demo exists only to give
 * the Playwright suite a deterministic target, so the simplest thing that works
 * is the right thing here.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { SERVICE_REQUESTS, authenticate, filterRequests } from './demoData.ts';

const API_PREFIX = '/api/demo';

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(payload);
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk as Buffer));
  }
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf-8')) as unknown;
  } catch {
    return null;
  }
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** Returns true when the request was handled by the demo API. */
export async function handleDemoApi(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const rawUrl = req.url ?? '/';
  if (!rawUrl.startsWith(API_PREFIX)) return false;

  const url = new URL(rawUrl, 'http://localhost');
  const route = url.pathname.slice(API_PREFIX.length) || '/';

  if (route === '/health' && req.method === 'GET') {
    sendJson(res, 200, { status: 'ok', service: 'playbook-demo-api' });
    return true;
  }

  if (route === '/catalog' && req.method === 'GET') {
    const items = filterRequests(SERVICE_REQUESTS, {
      q: url.searchParams.get('q') ?? undefined,
      category: url.searchParams.get('category') ?? undefined,
    });
    sendJson(res, 200, { total: items.length, items });
    return true;
  }

  if (route === '/login' && req.method === 'POST') {
    const body = await readJsonBody(req);
    if (body === null || typeof body !== 'object') {
      sendJson(res, 400, { error: 'Request body must be valid JSON.' });
      return true;
    }
    const username = asString((body as Record<string, unknown>).username);
    const password = asString((body as Record<string, unknown>).password);

    const { status, ...payload } = authenticate(username, password);
    sendJson(res, status, payload);
    return true;
  }

  sendJson(res, 404, { error: `Unknown demo endpoint: ${route}` });
  return true;
}

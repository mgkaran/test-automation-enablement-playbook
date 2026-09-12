import { expect, test } from '@playwright/test';
import { getCredentials, getInvalidCredentials } from '../../playwright/utils/config.ts';

/**
 * API-level tests against the demo service.
 *
 * They run in their own Playwright project with no browser: service-level
 * checks are faster and steadier than the equivalent UI test, and they fail
 * with a message that points at the service rather than at a screen.
 */

interface CatalogResponse {
  total: number;
  items: { id: string; title: string; category: string; status: string; owner: string }[];
}

test.describe('Demo API - catalog', () => {
  test('returns every request when no filter is applied', async ({ request }) => {
    const response = await request.get('/api/demo/catalog');

    expect(response.status()).toBe(200);
    const body = (await response.json()) as CatalogResponse;
    expect(body.items.length).toBe(body.total);
    expect(body.total).toBeGreaterThan(0);
  });

  test('filters by search term across title and id', async ({ request }) => {
    const response = await request.get('/api/demo/catalog?q=REQ-1004');

    expect(response.status()).toBe(200);
    const body = (await response.json()) as CatalogResponse;
    expect(body.total).toBe(1);
    expect(body.items[0]?.title).toContain('Scheduled maintenance window');
  });

  test('filters by category', async ({ request }) => {
    const response = await request.get('/api/demo/catalog?category=Access');

    const body = (await response.json()) as CatalogResponse;
    expect(body.total).toBeGreaterThan(0);
    // Every returned record must match the filter, not just the first one.
    expect(body.items.every((item) => item.category === 'Access')).toBe(true);
  });

  test('returns an empty result set rather than an error for an unknown term', async ({
    request,
  }) => {
    const response = await request.get('/api/demo/catalog?q=no-such-request');

    expect(response.status()).toBe(200);
    const body = (await response.json()) as CatalogResponse;
    expect(body.total).toBe(0);
    expect(body.items).toEqual([]);
  });
});

test.describe('Demo API - login', () => {
  test('valid credentials return a session token', async ({ request }) => {
    const credentials = getCredentials();

    const response = await request.post('/api/demo/login', { data: credentials });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { token?: string; displayName?: string };
    expect(body.token).toBeTruthy();
    expect(body.displayName).toBeTruthy();
  });

  test('invalid credentials are rejected with 401 and no token', async ({ request }) => {
    const response = await request.post('/api/demo/login', { data: getInvalidCredentials() });

    expect(response.status()).toBe(401);
    const body = (await response.json()) as { error?: string; token?: string };
    expect(body.error).toBe('Invalid username or password.');
    expect(body.token).toBeUndefined();
  });

  test('a missing password is a client error, not a server error', async ({ request }) => {
    const response = await request.post('/api/demo/login', { data: { username: 'demo.user' } });

    expect(response.status()).toBe(400);
    const body = (await response.json()) as { error?: string };
    expect(body.error).toBe('Username and password are required.');
  });
});

test('the service reports that it is healthy', async ({ request }) => {
  const response = await request.get('/api/demo/health');

  expect(response.ok()).toBe(true);
  expect(await response.json()).toMatchObject({ status: 'ok' });
});

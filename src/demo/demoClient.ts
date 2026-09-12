import {
  SERVICE_REQUESTS,
  authenticate,
  filterRequests,
  type ServiceRequest,
} from './demoData.ts';

/**
 * How the demo UI reaches its data.
 *
 * Normally it calls the HTTP endpoints served by the Vite middleware. When the
 * site is published to static hosting (GitHub Pages) there is no server to
 * answer them, so the same logic runs in the browser instead.
 *
 * This is a build-time decision, not a runtime fallback. A client that quietly
 * fell back to local data whenever a request failed would let a UI test pass
 * while the real API was broken - exactly the silent fallback the test data
 * guardrail warns about. Here the mode is explicit, and both modes are exercised
 * in CI.
 */
export const isStaticDemo = import.meta.env.VITE_DEMO_MODE === 'static';

/** Endpoints live under the deployed base path, which is not always the root. */
function endpoint(path: string): string {
  return `${import.meta.env.BASE_URL}api/demo/${path}`.replace(/([^:])\/{2,}/g, '$1/');
}

export interface LoginOutcome {
  ok: boolean;
  displayName?: string;
  error?: string;
}

export async function login(username: string, password: string): Promise<LoginOutcome> {
  if (isStaticDemo) {
    const result = authenticate(username, password);
    return result.status === 200
      ? { ok: true, displayName: result.displayName }
      : { ok: false, error: result.error };
  }

  const response = await fetch(endpoint('login'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const body = (await response.json()) as { displayName?: string; error?: string };

  return response.ok
    ? { ok: true, displayName: body.displayName }
    : { ok: false, error: body.error ?? 'Sign in failed.' };
}

export async function fetchCatalog(
  query: { q?: string; category?: string },
  signal?: AbortSignal,
): Promise<ServiceRequest[]> {
  if (isStaticDemo) {
    return filterRequests(SERVICE_REQUESTS, query);
  }

  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.category) params.set('category', query.category);

  const response = await fetch(`${endpoint('catalog')}?${params.toString()}`, { signal });
  const body = (await response.json()) as { items: ServiceRequest[] };
  return body.items;
}

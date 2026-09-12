/**
 * Minimal session handling for the demonstration application.
 *
 * The demo app is a test target, not a product: the "session" is a display name
 * in sessionStorage. Nothing sensitive is stored, and nothing is persisted
 * across browser sessions.
 */
const STORAGE_KEY = 'playbook-demo-session';

export interface DemoSession {
  displayName: string;
}

export function readSession(): DemoSession | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DemoSession>;
    return typeof parsed.displayName === 'string' ? { displayName: parsed.displayName } : null;
  } catch {
    return null;
  }
}

export function writeSession(session: DemoSession): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* Storage can be unavailable (private mode); the demo still works without it. */
  }
}

export function clearSession(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

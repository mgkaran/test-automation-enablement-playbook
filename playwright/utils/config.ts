/**
 * Test configuration read from the environment.
 *
 * The demo application's credentials are published placeholder values that
 * protect nothing, so falling back to them keeps the suite runnable from a
 * clean checkout. In a real project this fallback would not exist: the helper
 * would throw when the variables are missing, because a silent default is how a
 * suite ends up running against the wrong account or the wrong environment.
 *
 * See the "Test data" and "Secrets" guardrails for the shape a real project
 * should use.
 */

const DEMO_USERNAME = 'demo.user';
const DEMO_PASSWORD = 'playbook-demo';

export interface TestCredentials {
  username: string;
  password: string;
}

/**
 * Reads a variable, treating blank as "not configured".
 *
 * A GitHub Actions secret that does not exist is injected as an empty string
 * rather than left undefined, so `process.env.X ?? fallback` silently yields an
 * empty credential and the suite fails somewhere far away from the cause. This
 * project's own pipeline did exactly that on its first run.
 */
function fromEnv(name: string): string | undefined {
  const value = process.env[name];
  return value !== undefined && value.trim().length > 0 ? value : undefined;
}

export function getCredentials(): TestCredentials {
  return {
    username: fromEnv('TEST_USERNAME') ?? DEMO_USERNAME,
    password: fromEnv('TEST_PASSWORD') ?? DEMO_PASSWORD,
  };
}

/** Credentials that are guaranteed to be rejected by the demo API. */
export function getInvalidCredentials(): TestCredentials {
  return { username: 'demo.user', password: 'definitely-not-the-password' };
}

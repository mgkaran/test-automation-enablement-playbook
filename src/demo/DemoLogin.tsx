import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as submitLogin } from './demoClient.ts';
import { writeSession } from './session.ts';

interface FieldErrors {
  username?: string;
  password?: string;
}

export default function DemoLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const errors: FieldErrors = {};
    if (username.trim().length === 0) errors.username = 'Username is required.';
    if (password.length === 0) errors.password = 'Password is required.';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const result = await submitLogin(username, password);

      if (!result.ok) {
        setFormError(result.error ?? 'Sign in failed.');
        return;
      }
      writeSession({ displayName: result.displayName ?? username });
      navigate('/demo/dashboard');
    } catch {
      setFormError('The demo service is not reachable.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-muted">
        Use the published demo credentials below. They are placeholder values for a demo app that
        holds no data.
      </p>

      <form noValidate onSubmit={onSubmit} className="mt-6 space-y-5">
        {formError ? (
          <p
            role="alert"
            className="rounded-sm border border-bad/30 bg-bad-soft px-4 py-3 text-sm text-bad"
          >
            {formError}
          </p>
        ) : null}

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-ink">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            aria-invalid={fieldErrors.username ? true : undefined}
            aria-describedby={fieldErrors.username ? 'username-error' : undefined}
            className="mt-1.5 w-full rounded-sm border border-line-strong px-3 py-2 text-sm"
          />
          {fieldErrors.username ? (
            <p id="username-error" className="mt-1.5 text-sm text-bad">
              {fieldErrors.username}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={fieldErrors.password ? true : undefined}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            className="mt-1.5 w-full rounded-sm border border-line-strong px-3 py-2 text-sm"
          />
          {fieldErrors.password ? (
            <p id="password-error" className="mt-1.5 text-sm text-bad">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-sm bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
        >
          {submitting ? 'Signing in\u2026' : 'Login'}
        </button>
      </form>

      <div className="mt-6 rounded-sm border border-line bg-surface px-4 py-3 text-sm text-muted">
        <p className="font-medium text-ink">Demo credentials</p>
        <p className="mt-1 font-mono text-xs">demo.user / playbook-demo</p>
        <p className="mt-2 text-xs">
          Public placeholder values. Tests read them from environment variables so that a real
          project can supply real credentials through its secret store instead.
        </p>
      </div>
    </div>
  );
}

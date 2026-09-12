import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearSession, readSession } from './session.ts';

export default function DemoDashboard() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const session = readSession();
    if (!session) {
      navigate('/demo/login', { replace: true });
      return;
    }
    setDisplayName(session.displayName);
  }, [navigate]);

  if (!displayName) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">
        Signed in as <span data-testid="signed-in-user">{displayName}</span>
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/demo/requests"
          className="rounded-sm border border-line px-5 py-4 hover:border-accent/40 hover:bg-surface"
        >
          <span className="block text-sm font-semibold text-ink">Service requests</span>
          <span className="mt-1 block text-sm text-muted">
            Search and filter the fictional request list.
          </span>
        </Link>
        <Link
          to="/demo/register"
          className="rounded-sm border border-line px-5 py-4 hover:border-accent/40 hover:bg-surface"
        >
          <span className="block text-sm font-semibold text-ink">Register a colleague</span>
          <span className="mt-1 block text-sm text-muted">
            A form with client-side validation rules.
          </span>
        </Link>
      </div>

      <button
        type="button"
        onClick={() => {
          clearSession();
          navigate('/demo/login');
        }}
        className="mt-8 rounded-sm border border-line-strong px-4 py-2 text-sm text-ink-soft hover:bg-surface"
      >
        Sign out
      </button>
    </div>
  );
}

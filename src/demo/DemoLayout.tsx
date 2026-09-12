import { Link, NavLink, Outlet } from 'react-router-dom';

function demoNavClasses({ isActive }: { isActive: boolean }): string {
  return isActive
    ? 'rounded-sm bg-accent-soft px-3 py-1.5 text-sm font-semibold text-accent'
    : 'rounded-sm px-3 py-1.5 text-sm text-ink-soft hover:bg-surface';
}

/**
 * Chrome for the demonstration application. It is deliberately separate from
 * the playbook layout: the demo is the system under test, not part of the
 * written content.
 */
export default function DemoLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <a
        href="#demo-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>

      <p className="bg-warn-soft px-5 py-2 text-center text-xs text-warn">
        Demo application with fictional data. It exists only as a target for the Playwright
        demonstration suite.
      </p>

      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <Link to="/demo/login" className="text-sm font-semibold text-ink">
            Service Request Portal <span className="font-normal text-muted">(demo)</span>
          </Link>
          <nav aria-label="Demo application" className="flex flex-wrap items-center gap-1">
            <NavLink to="/demo/login" className={demoNavClasses}>
              Sign in
            </NavLink>
            <NavLink to="/demo/requests" className={demoNavClasses}>
              Requests
            </NavLink>
            <NavLink to="/demo/register" className={demoNavClasses}>
              Register
            </NavLink>
            <Link
              to="/playwright-poc"
              className="rounded-sm px-3 py-1.5 text-sm text-muted hover:text-accent hover:underline"
            >
              &larr; Back to playbook
            </Link>
          </nav>
        </div>
      </header>

      <main id="demo-main" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 outline-none">
        <Outlet />
      </main>

      <footer className="border-t border-line px-5 py-6 text-center text-xs text-muted">
        Fictional demo application &middot; no real accounts, customers or transactions.
      </footer>
    </div>
  );
}

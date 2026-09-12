import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/approach', label: 'Enablement Approach' },
  { to: '/guardrails', label: 'Automation Guardrails' },
  { to: '/training', label: 'Team Enablement' },
  { to: '/tool-evaluation', label: 'Tool Evaluation' },
  { to: '/case-study', label: 'Case Study' },
  { to: '/playwright-poc', label: 'Playwright POC' },
  { to: '/about', label: 'About' },
] as const;

function navLinkClasses({ isActive }: { isActive: boolean }): string {
  const base =
    'block whitespace-nowrap rounded-sm px-3 py-2 text-sm transition-colors lg:px-2.5 lg:py-1.5 lg:text-[0.8125rem]';
  return isActive
    ? `${base} bg-accent-soft font-semibold text-accent`
    : `${base} text-ink-soft hover:bg-surface hover:text-ink`;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // Close the mobile menu and move focus to the top of the document on
  // navigation - a client-side route change otherwise leaves screen reader
  // focus stranded on the link that was activated.
  //
  // A hash is handled here too: when a URL such as /guardrails#flaky is opened
  // directly, the browser looks for the target before React has rendered it, so
  // nothing scrolls without this.
  useEffect(() => {
    setMenuOpen(false);

    const targetId = location.hash.slice(1);
    if (targetId) {
      const target = document.getElementById(decodeURIComponent(targetId));
      if (target) {
        isFirstRender.current = false;
        // 'instant' rather than 'auto': 'auto' inherits the smooth
        // scroll-behavior from the stylesheet, and a long smooth scroll started
        // during load is interrupted before it arrives. Repeated once the web
        // font has loaded, because that shifts the target.
        const scrollToTarget = () => target.scrollIntoView({ behavior: 'instant' });
        requestAnimationFrame(scrollToTarget);
        void document.fonts?.ready.then(scrollToTarget);
        return;
      }
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    mainRef.current?.focus();
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="group flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent text-sm font-bold text-white"
            >
              TA
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-ink group-hover:text-accent lg:whitespace-nowrap">
                Test Automation Enablement Playbook
              </span>
              <span className="hidden whitespace-nowrap text-xs text-muted sm:block">
                Personal proof-of-concept
              </span>
            </span>
          </Link>

          <button
            type="button"
            className="rounded-sm border border-line px-3 py-1.5 text-sm text-ink-soft lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>

          <nav
            id="primary-navigation"
            aria-label="Primary"
            className={`${
              menuOpen ? 'block' : 'hidden'
            } absolute left-0 right-0 top-full border-b border-line bg-paper px-5 pb-4 shadow-sm lg:static lg:block lg:border-0 lg:p-0 lg:shadow-none`}
          >
            <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-0.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={navLinkClasses}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <footer className="mt-20 border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold text-ink">Test Automation Enablement Playbook</h2>
            <p className="mt-2 max-w-sm text-sm text-muted">
              A personal proof-of-concept built to describe how I would approach test automation
              enablement. The examples are educational and hypothetical unless explicitly stated
              otherwise.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ink">Sections</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-muted hover:text-accent hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ink">Repository</h2>
            <p className="mt-2 text-sm text-muted">
              Source code, Playwright suite and CI workflow live in the project repository.
            </p>
            <p className="mt-2 text-sm">
              <a
                href="https://github.com/mgkaran/test-automation-enablement-playbook"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-accent hover:underline"
              >
                github.com/mgkaran/test-automation-enablement-playbook
              </a>
            </p>
            <p className="mt-4 text-xs text-muted">
              No confidential information, internal architecture, production data or credentials of
              any organisation are used in this project.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

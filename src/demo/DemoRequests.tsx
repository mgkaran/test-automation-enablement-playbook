import { useEffect, useState } from 'react';
import { CATEGORIES, type ServiceRequest } from './demoData.ts';

export default function DemoRequests() {
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [items, setItems] = useState<ServiceRequest[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (term.trim().length > 0) params.set('q', term.trim());
    if (category !== 'All') params.set('category', category);

    fetch(`/api/demo/catalog?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json() as Promise<{ items: ServiceRequest[] }>)
      .then((body) => {
        setItems(body.items);
        setFailed(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setFailed(true);
      });

    return () => controller.abort();
  }, [term, category]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Service requests</h1>
      <p className="mt-2 text-sm text-muted">Fictional records served by the local demo API.</p>

      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="mt-6 grid gap-4 sm:grid-cols-[1fr_minmax(0,12rem)]"
      >
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-ink">
            Search requests
          </label>
          <input
            id="search"
            name="search"
            type="search"
            value={term}
            placeholder="Title or request ID"
            onChange={(event) => setTerm(event.target.value)}
            className="mt-1.5 w-full rounded-sm border border-line-strong px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-ink">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-1.5 w-full rounded-sm border border-line-strong px-3 py-2 text-sm"
          >
            <option value="All">All</option>
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </form>

      <p aria-live="polite" data-testid="result-count" className="mt-5 text-sm text-muted">
        {failed
          ? 'The demo service is not reachable.'
          : items === null
            ? 'Loading requests\u2026'
            : `${items.length} ${items.length === 1 ? 'request' : 'requests'} found`}
      </p>

      {items !== null && items.length === 0 && !failed ? (
        <p className="mt-4 rounded-sm border border-line bg-surface px-4 py-6 text-center text-sm text-muted">
          No requests match your search.
        </p>
      ) : null}

      {items !== null && items.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-sm border border-line">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="sr-only">Service requests matching the current filters</caption>
            <thead className="bg-surface">
              <tr>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold text-ink">
                  ID
                </th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold text-ink">
                  Title
                </th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold text-ink">
                  Category
                </th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold text-ink">
                  Status
                </th>
                <th scope="col" className="border-b border-line px-4 py-3 font-semibold text-ink">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <th
                    scope="row"
                    className="border-b border-line px-4 py-3 font-mono text-xs font-medium text-ink"
                  >
                    {item.id}
                  </th>
                  <td className="border-b border-line px-4 py-3 text-ink-soft">{item.title}</td>
                  <td className="border-b border-line px-4 py-3 text-ink-soft">{item.category}</td>
                  <td className="border-b border-line px-4 py-3 text-ink-soft">{item.status}</td>
                  <td className="border-b border-line px-4 py-3 text-ink-soft">{item.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

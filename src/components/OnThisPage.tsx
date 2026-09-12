interface OnThisPageProps {
  items: { id: string; label: string }[];
}

/** A short in-page table of contents for the longer documents. */
export default function OnThisPage({ items }: OnThisPageProps) {
  return (
    <nav aria-label="On this page" className="rounded-sm border border-line bg-paper px-5 py-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">On this page</h2>
      <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id} className="text-sm">
            <a href={`#${item.id}`} className="text-ink-soft hover:text-accent hover:underline">
              <span aria-hidden="true" className="mr-2 font-mono text-xs text-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

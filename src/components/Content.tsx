/** Shared content primitives so that spacing and typography stay consistent. */

export function PageBody({ children }: { children: React.ReactNode }) {
  return <div className="prose-block mx-auto max-w-5xl px-5 pb-4">{children}</div>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{children}</p>;
}

interface BulletsProps {
  items: React.ReactNode[];
  columns?: 1 | 2 | 3;
  marker?: 'dot' | 'check' | 'cross';
}

export function Bullets({ items, columns = 1, marker = 'dot' }: BulletsProps) {
  const grid = columns === 3 ? 'sm:grid-cols-3' : columns === 2 ? 'sm:grid-cols-2' : '';
  const markers: Record<NonNullable<BulletsProps['marker']>, { glyph: string; cls: string }> = {
    dot: { glyph: '\u2013', cls: 'text-line-strong' },
    check: { glyph: '\u2713', cls: 'text-good' },
    cross: { glyph: '\u2715', cls: 'text-bad' },
  };
  const m = markers[marker];
  return (
    <ul className={`grid gap-x-8 gap-y-2 ${grid}`}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
          <span aria-hidden="true" className={`mt-0.5 shrink-0 font-mono text-xs ${m.cls}`}>
            {m.glyph}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Panel({
  title,
  tone = 'default',
  children,
}: {
  title?: string;
  tone?: 'default' | 'good' | 'bad';
  children: React.ReactNode;
}) {
  const tones = {
    default: 'border-line bg-paper',
    good: 'border-good/30 bg-good-soft',
    bad: 'border-bad/30 bg-bad-soft',
  } as const;
  return (
    <div className={`rounded-sm border px-5 py-4 ${tones[tone]}`}>
      {title ? <h3 className="text-sm font-semibold text-ink">{title}</h3> : null}
      <div className={`space-y-3 ${title ? 'mt-3' : ''}`}>{children}</div>
    </div>
  );
}

export function Grid({
  columns = 2,
  children,
}: {
  columns?: 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <div className={`grid gap-4 ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
      {children}
    </div>
  );
}

/** A single sentence that deserves to be read on its own. */
export function Statement({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-l-2 border-accent bg-accent-soft px-5 py-4 text-base font-medium leading-relaxed text-ink md:text-lg">
      {children}
    </p>
  );
}

export function DefinitionList({
  items,
}: {
  items: { term: string; description: React.ReactNode }[];
}) {
  return (
    <dl className="divide-y divide-line rounded-sm border border-line">
      {items.map((item) => (
        <div key={item.term} className="grid gap-1 px-5 py-4 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-6">
          <dt className="text-sm font-semibold text-ink">{item.term}</dt>
          <dd className="text-[0.9375rem] leading-relaxed text-ink-soft">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

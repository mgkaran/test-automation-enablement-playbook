export type Verdict = 'preferred' | 'acceptable' | 'avoid';

const VERDICTS: Record<Verdict, { label: string; mark: string; cls: string; bar: string }> = {
  preferred: { label: 'Preferred', mark: '\u2713', cls: 'text-good', bar: 'border-good/40' },
  acceptable: { label: 'Also useful', mark: '\u2022', cls: 'text-accent', bar: 'border-accent/40' },
  avoid: { label: 'Avoid where possible', mark: '\u2715', cls: 'text-bad', bar: 'border-bad/40' },
};

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  verdict?: Verdict;
  caption?: string;
}

export default function CodeBlock({
  code,
  language = 'typescript',
  filename,
  verdict,
  caption,
}: CodeBlockProps) {
  const v = verdict ? VERDICTS[verdict] : null;
  return (
    <figure
      className={`overflow-hidden rounded-sm border border-line bg-paper ${
        v ? `border-l-2 ${v.bar}` : ''
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-4 py-2">
        <span className="font-mono text-xs text-muted">{filename ?? language}</span>
        {v ? (
          <span className={`font-mono text-xs font-medium ${v.cls}`}>
            <span aria-hidden="true">{v.mark} </span>
            {v.label}
          </span>
        ) : null}
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-[0.8125rem] leading-relaxed">
        <code className="font-mono text-ink">{code}</code>
      </pre>
      {caption ? (
        <figcaption className="border-t border-line bg-surface px-4 py-2 text-sm text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Two code samples shown side by side to contrast an approach with its alternative. */
export function CodeCompare({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2 lg:items-start">{children}</div>;
}

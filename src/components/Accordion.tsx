export interface AccordionItem {
  id: string;
  title: string;
  summary?: string;
  content: React.ReactNode;
}

/**
 * Built on <details>/<summary>: keyboard operable and expandable by the browser
 * without any JavaScript state of our own.
 */
export default function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="divide-y divide-line rounded-sm border border-line">
      {items.map((item) => (
        <details key={item.id} id={item.id} className="group scroll-mt-24 open:bg-surface">
          <summary className="flex cursor-pointer list-none items-start gap-3 px-5 py-4 hover:bg-surface">
            <span
              aria-hidden="true"
              className="mt-1 font-mono text-xs text-accent transition-transform group-open:rotate-90"
            >
              &gt;
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{item.title}</span>
              {item.summary ? (
                <span className="mt-0.5 block text-sm text-muted">{item.summary}</span>
              ) : null}
            </span>
          </summary>
          <div className="space-y-4 border-t border-line bg-paper px-5 py-5 text-[0.9375rem] leading-relaxed text-ink-soft">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
}

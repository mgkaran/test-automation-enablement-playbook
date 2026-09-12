export interface FlowStep {
  title: string;
  detail?: string;
}

interface FlowDiagramProps {
  steps: FlowStep[];
  orientation?: 'vertical' | 'horizontal';
  numbered?: boolean;
  caption?: string;
}

/**
 * A plain, readable process diagram. It is an ordered list first and a diagram
 * second, so it stays meaningful for screen readers and on small screens.
 */
export default function FlowDiagram({
  steps,
  orientation = 'vertical',
  numbered = false,
  caption,
}: FlowDiagramProps) {
  const horizontal = orientation === 'horizontal';
  return (
    <figure>
      <ol
        className={
          horizontal
            ? 'flex flex-col gap-2 md:flex-row md:flex-wrap md:items-stretch'
            : 'flex flex-col gap-2'
        }
      >
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={horizontal ? 'flex items-center gap-2' : 'flex flex-col gap-2'}
          >
            <div
              className={`rounded-sm border border-line bg-paper px-4 py-3 ${
                horizontal ? 'h-full min-w-[9.5rem]' : ''
              }`}
            >
              <p className="text-sm font-semibold text-ink">
                {numbered ? (
                  <span className="mr-2 font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                ) : null}
                {step.title}
              </p>
              {step.detail ? <p className="mt-1 text-sm text-muted">{step.detail}</p> : null}
            </div>
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={`text-line-strong ${
                  horizontal ? 'hidden md:inline' : 'ml-4 leading-none text-lg'
                }`}
              >
                {horizontal ? '\u2192' : '\u2193'}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      {caption ? <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

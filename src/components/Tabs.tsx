import { useId, useRef, useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  hint?: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  ariaLabel: string;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * A tablist implementing the WAI-ARIA authoring practice: roving tabindex,
 * arrow-key navigation, Home/End, and a labelled panel per tab.
 */
export default function Tabs({ items, ariaLabel, orientation = 'horizontal' }: TabsProps) {
  const first = items[0];
  const [activeId, setActiveId] = useState<string>(first ? first.id : '');
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const baseId = useId();

  if (!first) return null;
  const active = items.find((item) => item.id === activeId) ?? first;
  const vertical = orientation === 'vertical';

  function focusTab(id: string) {
    setActiveId(id);
    buttonRefs.current.get(id)?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const forward = vertical ? 'ArrowDown' : 'ArrowRight';
    const backward = vertical ? 'ArrowUp' : 'ArrowLeft';
    let nextIndex: number | null = null;

    if (event.key === forward) nextIndex = (index + 1) % items.length;
    else if (event.key === backward) nextIndex = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = items.length - 1;

    if (nextIndex === null) return;
    const next = items[nextIndex];
    if (!next) return;
    event.preventDefault();
    focusTab(next.id);
  }

  return (
    <div className={vertical ? 'grid gap-6 md:grid-cols-[minmax(0,17rem)_1fr]' : ''}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        className={
          vertical
            ? 'flex flex-col gap-1'
            : 'flex flex-wrap gap-1 border-b border-line pb-px'
        }
      >
        {items.map((item, index) => {
          const isActive = item.id === active.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                if (node) buttonRefs.current.set(item.id, node);
                else buttonRefs.current.delete(item.id);
              }}
              id={`${baseId}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={
                vertical
                  ? `rounded-sm border px-4 py-3 text-left transition-colors ${
                      isActive
                        ? 'border-accent/40 bg-accent-soft'
                        : 'border-line bg-paper hover:bg-surface'
                    }`
                  : `rounded-t-sm border-b-2 px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? 'border-accent font-semibold text-accent'
                        : 'border-transparent text-muted hover:text-ink'
                    }`
              }
            >
              <span className={vertical ? 'block text-sm font-semibold text-ink' : undefined}>
                {item.label}
              </span>
              {vertical && item.hint ? (
                <span className="mt-0.5 block text-xs text-muted">{item.hint}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          id={`${baseId}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.id}`}
          tabIndex={0}
          hidden={item.id !== active.id}
          className={vertical ? 'min-w-0' : 'pt-6'}
        >
          {item.id === active.id ? item.content : null}
        </div>
      ))}
    </div>
  );
}

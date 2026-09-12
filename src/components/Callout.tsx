type CalloutVariant = 'principle' | 'note' | 'caution' | 'hypothetical';

const VARIANTS: Record<CalloutVariant, { label: string; box: string; label_cls: string }> = {
  principle: {
    label: 'Key principle',
    box: 'border-accent/30 bg-accent-soft',
    label_cls: 'text-accent',
  },
  note: { label: 'Note', box: 'border-line bg-surface', label_cls: 'text-muted' },
  caution: { label: 'Caution', box: 'border-warn/30 bg-warn-soft', label_cls: 'text-warn' },
  hypothetical: {
    label: 'Hypothetical example',
    box: 'border-warn/30 bg-warn-soft',
    label_cls: 'text-warn',
  },
};

interface CalloutProps {
  variant?: CalloutVariant;
  label?: string;
  children: React.ReactNode;
}

export default function Callout({ variant = 'note', label, children }: CalloutProps) {
  const config = VARIANTS[variant];
  return (
    <aside className={`rounded-sm border-l-2 border-y border-r px-5 py-4 ${config.box}`}>
      <p
        className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${config.label_cls}`}
      >
        {label ?? config.label}
      </p>
      <div className="mt-2 space-y-2 text-[0.9375rem] leading-relaxed text-ink-soft">{children}</div>
    </aside>
  );
}

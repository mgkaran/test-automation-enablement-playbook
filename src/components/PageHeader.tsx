interface PageHeaderProps {
  eyebrow: string;
  title: string;
  lead: string;
  children?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, lead, children }: PageHeaderProps) {
  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-ink md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">{lead}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}

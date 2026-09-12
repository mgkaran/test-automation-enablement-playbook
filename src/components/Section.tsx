interface SectionProps {
  id?: string;
  title: string;
  kicker?: string;
  intro?: string;
  children: React.ReactNode;
}

/** A titled content section with a consistent rhythm and anchorable heading. */
export default function Section({ id, title, kicker, intro, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-10 first:border-t-0 md:py-14">
      {kicker ? (
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{kicker}</p>
      ) : null}
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink md:text-2xl">{title}</h2>
      {intro ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">{intro}</p>
      ) : null}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

export function SubSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

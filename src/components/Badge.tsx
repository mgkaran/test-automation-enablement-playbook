export type Claim = 'evidence' | 'assumption' | 'recommendation' | 'decision';

const CLAIM_STYLES: Record<Claim, string> = {
  evidence: 'border-good/30 bg-good-soft text-good',
  assumption: 'border-warn/30 bg-warn-soft text-warn',
  recommendation: 'border-accent/30 bg-accent-soft text-accent',
  decision: 'border-line-strong bg-surface-2 text-ink-soft',
};

const CLAIM_LABELS: Record<Claim, string> = {
  evidence: 'Evidence',
  assumption: 'Assumption',
  recommendation: 'Recommendation',
  decision: 'Decision',
};

/**
 * Labels the epistemic status of a statement. Used throughout the site so that
 * a reader can always tell what is observed, what is assumed, what is advised
 * and what would be decided by stakeholders.
 */
export function ClaimBadge({ claim }: { claim: Claim }) {
  return (
    <span
      className={`inline-block rounded-sm border px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] ${CLAIM_STYLES[claim]}`}
    >
      {CLAIM_LABELS[claim]}
    </span>
  );
}

export function ClaimLine({ claim, children }: { claim: Claim; children: React.ReactNode }) {
  return (
    <p className="flex flex-col gap-2 text-[0.9375rem] leading-relaxed text-ink-soft sm:flex-row sm:items-baseline">
      <span className="shrink-0">
        <ClaimBadge claim={claim} />
      </span>
      <span>{children}</span>
    </p>
  );
}

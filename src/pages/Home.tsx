import { Link } from 'react-router-dom';
import Tabs, { type TabItem } from '../components/Tabs.tsx';
import Section from '../components/Section.tsx';
import Callout from '../components/Callout.tsx';
import { Bullets, PageBody, P, Statement } from '../components/Content.tsx';
import { ClaimBadge } from '../components/Badge.tsx';
import { LIFECYCLE } from '../data/lifecycle.ts';

const SECTION_LINKS = [
  {
    to: '/approach',
    title: 'Enablement Approach',
    question: 'How would I approach a team?',
    description: 'The seven stages in detail, from first conversation to scaling.',
  },
  {
    to: '/guardrails',
    title: 'Automation Guardrails',
    question: 'How would I keep quality up?',
    description: 'Locators, waiting, assertions, test data, secrets, structure and flakiness.',
  },
  {
    to: '/training',
    title: 'Team Enablement',
    question: 'How would I enable people?',
    description: 'A learning path that starts with context and ends with an independent team.',
  },
  {
    to: '/tool-evaluation',
    title: 'Tool Evaluation',
    question: 'How would I choose technology?',
    description: 'Criteria, a decision process, and why scoring tools out of 100 is misleading.',
  },
  {
    to: '/case-study',
    title: 'Case Study',
    question: 'How would I apply it?',
    description: 'A clearly labelled hypothetical team, worked through end to end.',
  },
  {
    to: '/playwright-poc',
    title: 'Playwright POC',
    question: 'Can I actually implement it?',
    description: 'A small, real Playwright suite running against a local demo application.',
  },
];

const CLAIM_ROWS = [
  {
    claim: 'evidence' as const,
    text: 'Information actually available from a project - a measured duration, an observed failure, a documented constraint.',
  },
  {
    claim: 'assumption' as const,
    text: 'A stated assumption used to make a hypothetical example concrete. Never presented as fact.',
  },
  {
    claim: 'recommendation' as const,
    text: 'A reasoned recommendation based on the available evidence, with the reasoning visible.',
  },
  {
    claim: 'decision' as const,
    text: 'A decision made by the responsible stakeholders after evaluation - not by the enablement function alone.',
  },
];

export default function Home() {
  const stageTabs: TabItem[] = LIFECYCLE.map((stage, index) => ({
    id: stage.id,
    label: `${String(index + 1).padStart(2, '0')} · ${stage.title}`,
    hint: stage.question,
    content: (
      <article className="rounded-sm border border-line bg-paper p-6">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
          Stage {index + 1} of {LIFECYCLE.length}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-ink">{stage.title}</h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{stage.summary}</p>
        <h4 className="mt-5 text-sm font-semibold text-ink">What this involves</h4>
        <div className="mt-2">
          <Bullets items={stage.activities} />
        </div>
        <p className="mt-5 border-l-2 border-accent bg-accent-soft px-4 py-3 text-sm leading-relaxed text-ink">
          {stage.principle}
        </p>
      </article>
    ),
  }));

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            Personal proof-of-concept
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight text-ink md:text-5xl">
            Test Automation Enablement Playbook
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            A practical framework for helping teams adopt sustainable test automation.
          </p>
          <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-soft">
            Test automation is not simply a matter of selecting a framework and writing tests.
            Sustainable automation requires understanding the application, business risks, existing
            testing practices, team capabilities, technical constraints and long-term maintenance
            effort.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/approach"
              className="rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Read the approach
            </Link>
            <Link
              to="/playwright-poc"
              className="rounded-sm border border-line-strong bg-paper px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface-2"
            >
              See the Playwright suite
            </Link>
          </div>
        </div>
      </div>

      <PageBody>
        <Section
          id="lifecycle"
          kicker="The shape of the work"
          title="The enablement lifecycle"
          intro="Seven stages, from the first conversation with a team to automation that team maintains itself. Select a stage to see what it involves."
        >
          <Tabs items={stageTabs} ariaLabel="Enablement lifecycle stages" orientation="vertical" />
          <P>
            The sequence is a starting point rather than a gate. What is learned during a pilot
            routinely changes the assessment, and what is measured later changes the guardrails.
          </P>
        </Section>

        <Section
          id="honesty"
          kicker="Design principle"
          title="How statements in this playbook are labelled"
          intro="This site contains no organisational data, because I have none. Rather than inventing numbers, every non-obvious statement is labelled with what kind of claim it is."
        >
          <dl className="divide-y divide-line rounded-sm border border-line">
            {CLAIM_ROWS.map((row) => (
              <div
                key={row.claim}
                className="grid gap-2 px-5 py-4 md:grid-cols-[minmax(0,10rem)_1fr] md:gap-6"
              >
                <dt>
                  <ClaimBadge claim={row.claim} />
                </dt>
                <dd className="text-[0.9375rem] leading-relaxed text-ink-soft">{row.text}</dd>
              </div>
            ))}
          </dl>
          <Statement>
            Where a number would have to be invented, this playbook explains how to obtain a real
            one instead.
          </Statement>
          <Callout variant="caution" label="What that rules out">
            <p>
              No maturity percentages, no tool scores out of 100, no ROI figures, no regression
              durations, no test counts, no productivity savings. Those numbers exist in real
              projects, and that is exactly where they should come from.
            </p>
          </Callout>
        </Section>

        <Section id="sections" kicker="Where to go next" title="Six questions this playbook answers">
          <div className="grid gap-3 sm:grid-cols-2">
            {SECTION_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group rounded-sm border border-line bg-paper px-5 py-4 transition-colors hover:border-accent/40 hover:bg-surface"
              >
                <span className="block font-mono text-xs uppercase tracking-[0.14em] text-muted">
                  {item.title}
                </span>
                <span className="mt-2 block text-base font-semibold text-ink group-hover:text-accent">
                  {item.question}
                </span>
                <span className="mt-1.5 block text-sm text-muted">{item.description}</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section id="objective" kicker="The point of all of it" title="What success looks like">
          <Statement>
            The objective is not maximum automation. The objective is appropriate automation:
            sustainable, valuable and maintainable, owned by the teams who build the software.
          </Statement>
          <P>
            An enablement function succeeds when teams need it less over time - when they choose
            sensible candidates for automation, write tests other people can maintain, diagnose
            their own failures, and can explain why each test exists.
          </P>
        </Section>
      </PageBody>
    </>
  );
}

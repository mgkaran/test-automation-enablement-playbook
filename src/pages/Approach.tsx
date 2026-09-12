import PageHeader from '../components/PageHeader.tsx';
import Section, { SubSection } from '../components/Section.tsx';
import Callout from '../components/Callout.tsx';
import FlowDiagram from '../components/FlowDiagram.tsx';
import DataTable from '../components/DataTable.tsx';
import OnThisPage from '../components/OnThisPage.tsx';
import Accordion from '../components/Accordion.tsx';
import { ClaimLine } from '../components/Badge.tsx';
import { Bullets, DefinitionList, Grid, PageBody, P, Panel, Statement } from '../components/Content.tsx';
import { LIFECYCLE } from '../data/lifecycle.ts';

const TOC = [
  { id: 'lifecycle', label: 'The seven stages' },
  { id: 'understand', label: 'Stage 1 - Understand' },
  { id: 'assess', label: 'Stage 2 - Assess' },
  { id: 'define', label: 'Stage 3 - Define' },
  { id: 'pilot', label: 'Stage 4 - Pilot' },
  { id: 'enable', label: 'Stage 5 - Enable' },
  { id: 'measure', label: 'Stage 6 - Measure' },
  { id: 'scale', label: 'Stage 7 - Scale' },
  { id: 'scope', label: 'Deciding what to automate' },
  { id: 'pyramid', label: 'Balance across test levels' },
  { id: 'risk', label: 'Risk-based prioritisation' },
  { id: 'regulated', label: 'Enablement in a regulated environment' },
  { id: 'failure-modes', label: 'What can go wrong' },
];

const MATURITY_LEVELS = [
  {
    term: 'Initial',
    description:
      'Testing is largely manual and ad hoc. Little or no automation exists, or what exists is not run regularly.',
  },
  {
    term: 'Developing',
    description:
      'Some automation exists, often written by individuals. Conventions vary, execution is irregular and maintenance ownership is unclear.',
  },
  {
    term: 'Established',
    description:
      'Automation follows agreed conventions, runs in the pipeline, and the team can maintain and extend it without external help.',
  },
  {
    term: 'Advanced',
    description:
      'Automation is part of how the team works: coverage is chosen by risk, failures are diagnosed quickly, reliability is monitored and the approach is regularly revised.',
  },
];

const FAILURE_MODES = [
  {
    id: 'fm-automate-everything',
    title: 'Automating everything',
    summary: 'Coverage as a goal in itself.',
    content: (
      <>
        <P>
          Every automated test is a permanent maintenance commitment. Automating low-value or
          rapidly changing scenarios spends that commitment on the wrong things, and the suite grows
          slower and less trusted without becoming more useful.
        </P>
        <P>
          Better: choose candidates by risk, execution frequency and stability, and be willing to
          delete tests that no longer earn their place.
        </P>
      </>
    ),
  },
  {
    id: 'fm-tool-first',
    title: 'Choosing tools before understanding needs',
    summary: 'A technology-driven decision looking for a problem.',
    content: (
      <P>
        A tool selected before the application, team and pipeline are understood tends to be
        defended rather than evaluated. The evaluation criteria should come out of the context, not
        the other way round.
      </P>
    ),
  },
  {
    id: 'fm-rigid-standards',
    title: 'Creating standards that are too rigid',
    summary: 'Teams cannot adapt to their application context.',
    content: (
      <P>
        Standards that dictate every detail break down as soon as an application behaves
        differently - a legacy interface without accessible roles, a flow that cannot be reset via
        API. The useful shape is a firm principle with an explicit route to a documented exception.
      </P>
    ),
  },
  {
    id: 'fm-context-free-training',
    title: 'Training without context',
    summary: 'People learn syntax but not testing.',
    content: (
      <P>
        A tester who knows the framework API but not what matters in the application will automate
        whatever is easiest to automate. Context first, framework second.
      </P>
    ),
  },
  {
    id: 'fm-counting-tests',
    title: 'Measuring only test count',
    summary: 'More tests do not automatically mean more quality.',
    content: (
      <P>
        Test count is easy to collect and easy to game. It says nothing about which risks are
        covered, whether failures are diagnosable, or how much maintenance the suite consumes.
      </P>
    ),
  },
  {
    id: 'fm-ignoring-flakiness',
    title: 'Ignoring flaky tests',
    summary: 'Teams stop believing red builds.',
    content: (
      <P>
        Once a team starts re-running the pipeline as a reflex, the suite has stopped being a
        signal. Reliability problems deserve the same treatment as product defects: investigation
        and a root cause, not a retry.
      </P>
    ),
  },
  {
    id: 'fm-central-team-does-everything',
    title: 'The central team doing everything',
    summary: 'Application teams never become autonomous.',
    content: (
      <P>
        Writing teams&apos; tests for them is the fastest way to show progress and the slowest way
        to build capability. It also puts failure diagnosis in the hands of the people who
        understand the application least.
      </P>
    ),
  },
];

export default function Approach() {
  return (
    <>
      <PageHeader
        eyebrow="Enablement approach"
        title="My Test Automation Enablement Approach"
        lead="Seven stages I would work through with a team, and the reasoning behind each one. The order matters: most of the expensive mistakes in test automation are made before the first test is written."
      />

      <PageBody>
        <div className="pt-8">
          <OnThisPage items={TOC} />
        </div>

        <Section id="lifecycle" kicker="Overview" title="The seven stages">
          <FlowDiagram
            steps={LIFECYCLE.map((stage) => ({ title: stage.title, detail: stage.question }))}
            orientation="horizontal"
            caption="Understand and Assess produce the information that makes everything after them defensible."
          />
          <P>
            In practice the stages overlap and repeat. A pilot regularly reveals something that
            changes the assessment; measurement later changes the guardrails. What should not change
            is the order in which they are done for the first time.
          </P>
        </Section>

        <Section
          id="understand"
          kicker="Stage 1"
          title="Understand"
          intro="Before recommending tools or automation, build an accurate picture of what is being tested and by whom."
        >
          <Grid>
            <Panel title="Application">
              <Bullets
                items={[
                  'Architecture and application type',
                  'Business purpose and critical workflows',
                  'Integrations and external dependencies',
                  'Test environments and their stability',
                  'Test data: availability, refresh, constraints',
                ]}
              />
            </Panel>
            <Panel title="Process and people">
              <Bullets
                items={[
                  'Current testing process and manual effort',
                  'Existing automation and its condition',
                  'Release frequency and CI/CD environment',
                  'Team structure, skills and responsibilities',
                  'The pain points the team would name themselves',
                ]}
              />
            </Panel>
          </Grid>
          <Callout variant="principle">
            <p>Do not prescribe a solution before understanding the problem.</p>
          </Callout>
          <P>
            Most of this stage is listening. The questions that tend to be most revealing are the
            uncomfortable ones: which part of the release everybody dreads, which tests get skipped
            when time is short, and which failures nobody can explain.
          </P>
        </Section>

        <Section
          id="assess"
          kicker="Stage 2"
          title="Assess"
          intro="Turn what was learned into a shared assessment across four dimensions."
        >
          <Grid columns={2}>
            <Panel title="Application">
              <Bullets
                items={['Web', 'API', 'Mobile', 'Desktop', 'Legacy', 'Distributed systems']}
                columns={2}
              />
            </Panel>
            <Panel title="Testing">
              <Bullets
                items={[
                  'Regression effort',
                  'Test stability',
                  'Existing automation',
                  'Manual testing effort',
                  'Test frequency',
                  'Defect history',
                  'Risk',
                ]}
                columns={2}
              />
            </Panel>
            <Panel title="Team">
              <Bullets
                items={[
                  'Testing experience',
                  'Programming experience',
                  'Automation knowledge',
                  'Framework knowledge',
                  'CI/CD knowledge',
                  'Willingness to adopt automation',
                ]}
                columns={2}
              />
            </Panel>
            <Panel title="Business">
              <Bullets
                items={[
                  'Business criticality',
                  'Risk',
                  'Release frequency',
                  'Regulatory constraints',
                  'Customer impact',
                ]}
                columns={2}
              />
            </Panel>
          </Grid>

          <SubSection title="Classify qualitatively, not numerically">
            <P>
              A maturity percentage implies a measurement that the inputs do not support. A
              qualitative level, agreed with the team against stated evidence, is both more honest
              and more useful - it can be discussed and disagreed with.
            </P>
            <DefinitionList items={MATURITY_LEVELS} />
            <ClaimLine claim="recommendation">
              Agree the level in a working session with the team and the responsible stakeholders,
              record the evidence behind it, and re-assess after the pilot rather than defending the
              original classification.
            </ClaimLine>
          </SubSection>
        </Section>

        <Section
          id="define"
          kicker="Stage 3"
          title="Define"
          intro="The enablement function establishes common principles and guardrails, so that a tester moving between teams recognises what they find."
        >
          <Grid columns={3}>
            <Panel title="Code">
              <Bullets
                items={[
                  'Framework conventions',
                  'Locator strategy',
                  'Test structure',
                  'Naming conventions',
                  'Assertion strategy',
                  'Code review',
                ]}
              />
            </Panel>
            <Panel title="Data and environments">
              <Bullets
                items={[
                  'Test data strategy',
                  'Environment management',
                  'Authentication',
                  'Secrets management',
                  'API testing',
                ]}
              />
            </Panel>
            <Panel title="Operations">
              <Bullets
                items={[
                  'Reporting',
                  'Logging',
                  'Traceability',
                  'CI/CD integration',
                  'Ownership',
                  'Maintenance responsibility',
                ]}
              />
            </Panel>
          </Grid>
          <Callout variant="principle">
            <p>
              Standardize principles where consistency provides value, but avoid unnecessary
              standardization that ignores application context.
            </p>
          </Callout>
          <P>
            The test I apply to a candidate standard: does it make tests easier for another engineer
            to read, maintain or diagnose? If the honest answer is that it only makes things
            uniform, it belongs in a recommendation rather than a rule. The detailed guardrails are
            on their own page.
          </P>
        </Section>

        <Section
          id="pilot"
          kicker="Stage 4"
          title="Pilot"
          intro="Automation should not begin by converting the entire regression suite."
        >
          <Statement>Start small, representative and high-value.</Statement>
          <P>
            A pilot is an experiment with several questions to answer at once, only one of which is
            about the application:
          </P>
          <Bullets
            marker="check"
            items={[
              'Does the selected slice represent important business flows?',
              'Is automating this technically feasible in this application?',
              'Is the framework a good fit for the way this application behaves?',
              'Can the resulting tests be maintained by this team?',
              'Does the suite integrate into the existing CI/CD pipeline?',
              'Which capability gaps show up when the team writes tests themselves?',
              'What does the team say after living with it for a few sprints?',
            ]}
          />
          <Callout variant="hypothetical">
            <p>
              A team has a large regression suite and wants to introduce automation. Rather than
              automating everything immediately, I would select a small representative set of
              stable, high-risk and frequently executed tests.
            </p>
            <p>
              Deliberately no numbers here: how small the set should be depends on the real
              execution frequency, the real failure history and the real capacity of the team. Those
              inputs exist in the project and should drive the decision.
            </p>
          </Callout>
        </Section>

        <Section
          id="enable"
          kicker="Stage 5"
          title="Enable"
          intro="The stage that decides whether automation survives after the enablement work ends."
        >
          <FlowDiagram
            numbered
            steps={[
              { title: 'Assess learner', detail: 'What does this person already know?' },
              { title: 'Explain context', detail: 'Product, risks, testing strategy.' },
              { title: 'Introduce framework', detail: 'Structure before syntax.' },
              { title: 'Teach standards', detail: 'The guardrails and the reasons for them.' },
              { title: 'Guided implementation', detail: 'First tests written together.' },
              { title: 'Code review', detail: 'Feedback on real contributions.' },
              { title: 'Independent implementation', detail: 'The team writes and owns tests.' },
              { title: 'Continuous support', detail: 'Available, not in the middle.' },
            ]}
          />
          <P>
            Training should not begin with tool syntax. Before the framework, a new automation
            engineer needs answers to: what are we testing, why are we automating it, what should
            stay manual, how does automation fit into the delivery process, and who owns the tests
            afterwards. The full learning path is on the team enablement page.
          </P>
        </Section>

        <Section
          id="measure"
          kicker="Stage 6"
          title="Measure"
          intro="Measure the things the initiative was started to improve - and measure them, rather than estimating them."
        >
          <P>
            I would not publish a metric without being able to say which decision it informs. The
            categories below are candidates to select from, not a dashboard to build.
          </P>
          <DataTable
            headers={['Category', 'Candidate metrics', 'Question it answers']}
            firstColumnHeader
            rows={[
              [
                'Efficiency',
                'Regression execution time; manual testing effort; automated execution time',
                'Is the feedback loop getting shorter?',
              ],
              [
                'Coverage',
                'Automated regression coverage; critical workflow coverage',
                'Are the risks we care about actually covered?',
              ],
              [
                'Reliability',
                'Flaky test rate; failure categorisation (product, test, environment, data)',
                'Can the team trust a red result?',
              ],
              [
                'Quality',
                'Defects detected before release; escaped defects',
                'Is automation catching problems earlier?',
              ],
              [
                'Maintainability',
                'Test maintenance effort; time to diagnose a failure',
                'What is the suite costing to keep?',
              ],
              [
                'Adoption',
                'Teams enabled; training completed; independent contributions',
                'Is capability actually transferring to teams?',
              ],
            ]}
          />
          <Callout variant="caution" label="Why there are no numbers here">
            <p>
              Every figure in this table would have to come from a specific project: its pipeline,
              its suite, its release cadence. Publishing invented baselines would make this page
              look more finished and make it worth less.
            </p>
          </Callout>
          <ClaimLine claim="recommendation">
            Capture a baseline before the pilot starts, even a rough one, because after the fact
            nobody can reconstruct how long regression used to take.
          </ClaimLine>
        </Section>

        <Section
          id="scale"
          kicker="Stage 7"
          title="Scale"
          intro="Extend to more flows and more teams only once the pilot is genuinely maintainable."
        >
          <Bullets
            items={[
              'Extend coverage outward from the pilot by risk, not by convenience',
              'Provide templates and a reference architecture so teams do not start from an empty repository',
              'Feed what each team learns back into the guardrails',
              'Keep ownership of tests with the application teams',
              'Review reliability and maintenance effort as the suite grows',
            ]}
          />
          <Callout variant="caution">
            <p>
              Scaling an unreliable or unmaintainable pilot multiplies the problem rather than the
              benefit. If the pilot needed heroics to stay green, that is a finding, not a detail to
              fix later.
            </p>
          </Callout>
        </Section>

        <Section
          id="scope"
          kicker="Scope"
          title="Deciding what to automate"
          intro="Automation is an investment with a running cost. The question is not what can be automated, but what should be."
        >
          <Grid>
            <Panel tone="good" title="Usually good candidates">
              <Bullets
                marker="check"
                items={[
                  'Repetitive regression checks',
                  'Stable functionality',
                  'High-risk business workflows',
                  'Frequently executed tests',
                  'Data-driven scenarios with many variations',
                ]}
              />
            </Panel>
            <Panel tone="bad" title="Often poor candidates">
              <Bullets
                marker="cross"
                items={[
                  'One-time checks',
                  'Areas with highly unstable requirements',
                  'Exploratory testing',
                  'Tests requiring subjective human judgement',
                  'Anything whose maintenance cost exceeds its expected value',
                ]}
              />
            </Panel>
          </Grid>
          <Statement>
            The objective is not maximum automation. The objective is appropriate automation.
          </Statement>
        </Section>

        <Section
          id="pyramid"
          kicker="Balance"
          title="Balance across test levels"
          intro="UI automation is valuable, but it is generally the most expensive and the most fragile way to verify something that could be verified lower down."
        >
          <figure className="rounded-sm border border-line bg-paper p-6">
            <div className="mx-auto flex max-w-md flex-col items-center gap-1.5">
              {[
                { label: 'UI / E2E', width: 'w-[38%]', note: 'Slowest, most expensive to maintain' },
                { label: 'API / service', width: 'w-[58%]', note: 'Fast, stable, close to behaviour' },
                { label: 'Integration', width: 'w-[78%]', note: 'Verifies components together' },
                { label: 'Unit', width: 'w-full', note: 'Fastest feedback, cheapest to keep' },
              ].map((layer) => (
                <div
                  key={layer.label}
                  className={`${layer.width} rounded-sm border border-accent/25 bg-accent-soft px-4 py-2.5 text-center`}
                >
                  <span className="block text-sm font-semibold text-ink">{layer.label}</span>
                  <span className="block text-xs text-muted">{layer.note}</span>
                </div>
              ))}
            </div>
            <figcaption className="mt-4 text-sm text-muted">
              A conventional shape, not a mandatory one.
            </figcaption>
          </figure>
          <P>
            The useful idea behind the pyramid is that a check should be written at the cheapest
            level that can answer the question honestly. The unhelpful version is a fixed ratio
            applied to every project regardless of its architecture.
          </P>
          <ClaimLine claim="recommendation">
            Decide the balance per application: a service-heavy system with a thin interface and a
            monolith with complex screen logic will not have the same distribution, and neither is
            wrong for that reason.
          </ClaimLine>
        </Section>

        <Section
          id="risk"
          kicker="Prioritisation"
          title="Risk-based prioritisation"
          intro="When everything cannot be automated at once - which is always - risk decides the order."
        >
          <P>Automation priority should consider:</P>
          <Bullets
            columns={2}
            items={[
              'Business impact if the functionality fails',
              'Probability of failure, based on defect history and change rate',
              'How often the scenario is executed',
              'Regression value: how likely it is to break again',
              'Technical feasibility in this application',
              'Expected maintenance effort',
            ]}
          />
          <DataTable
            caption="A qualitative matrix. The cells describe priority, not scores - a number here would be arithmetic performed on guesses."
            headers={['', 'Low business impact', 'High business impact']}
            firstColumnHeader
            rows={[
              [
                'High probability of failure',
                'Automate if cheap; otherwise fix the instability first',
                'Automate first - highest value per test',
              ],
              [
                'Low probability of failure',
                'Usually leave manual or drop entirely',
                'Automate for confidence, once stable',
              ],
            ]}
          />
          <ClaimLine claim="assumption">
            Placing a workflow in a quadrant is itself a judgement. It should be made with people
            who know the business impact, and recorded so it can be revisited when the defect
            history says something different.
          </ClaimLine>
        </Section>

        <Section
          id="regulated"
          kicker="Context"
          title="Enablement in a regulated environment"
          intro="General principles that apply when the software carries regulatory or financial weight. This describes considerations in the abstract - not the controls of any particular organisation."
        >
          <DefinitionList
            items={[
              {
                term: 'Risk',
                description:
                  'Critical business functionality requires strong confidence. That usually means deeper verification of fewer, more important flows rather than broad shallow coverage.',
              },
              {
                term: 'Traceability',
                description:
                  'A chain from requirement to test to execution to evidence to defect. Automation helps here, but only if test intent is documented and results are retained.',
              },
              {
                term: 'Security',
                description:
                  'Credentials and sensitive data must be protected in test code, test data and pipeline configuration - not only in production systems.',
              },
              {
                term: 'Auditability',
                description:
                  'Relevant testing evidence may need to be reproducible and traceable to a specific version of the application and the tests.',
              },
              {
                term: 'Reliability',
                description:
                  'Automation used as evidence has to be reliable itself. A suite that needs three attempts to pass is weak evidence of anything.',
              },
              {
                term: 'Change management',
                description:
                  'Changes to critical automation infrastructure - shared frameworks, pipelines, environments - should be controlled like other production-adjacent changes.',
              },
              {
                term: 'Separation of responsibilities',
                description:
                  'Depending on organisational policy, development, testing and approval responsibilities may need appropriate separation.',
              },
            ]}
          />
          <Callout variant="caution" label="Explicit limitation">
            <p>
              The exact controls depend on the organisation&apos;s regulatory, security,
              architecture and governance requirements. I would expect to learn them from the people
              responsible for them rather than assume them.
            </p>
          </Callout>
        </Section>

        <Section
          id="failure-modes"
          kicker="Honesty"
          title="What can go wrong"
          intro="Failure modes I would actively watch for, including in my own work."
        >
          <Accordion items={FAILURE_MODES} />
        </Section>
      </PageBody>
    </>
  );
}

import PageHeader from '../components/PageHeader.tsx';
import Section, { SubSection } from '../components/Section.tsx';
import Callout from '../components/Callout.tsx';
import DataTable from '../components/DataTable.tsx';
import OnThisPage from '../components/OnThisPage.tsx';
import FlowDiagram from '../components/FlowDiagram.tsx';
import { ClaimLine } from '../components/Badge.tsx';
import { Bullets, Grid, PageBody, P, Panel, Statement } from '../components/Content.tsx';

const TOC = [
  { id: 'scenario', label: 'The scenario' },
  { id: 'understand', label: 'Step 1 - Understand' },
  { id: 'assess', label: 'Step 2 - Assess' },
  { id: 'tools', label: 'Step 3 - Tool evaluation' },
  { id: 'pilot', label: 'Step 4 - Pilot design' },
  { id: 'measure', label: 'Step 5 - Measurement plan' },
  { id: 'risks', label: 'What I would expect to be hard' },
];

const NOT_RECORDED = <span className="font-mono text-xs text-muted">not yet measured</span>;

export default function CaseStudy() {
  return (
    <>
      <PageHeader
        eyebrow="Hypothetical case study"
        title="Applying the approach to a team"
        lead="A worked example of the seven stages on a fictional team. Everything on this page is invented for illustration - there is no client, no project and no data behind it."
      >
        <p className="inline-block rounded-sm border border-warn/40 bg-warn-soft px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-warn">
          Hypothetical case study &middot; no real organisation or data
        </p>
      </PageHeader>

      <PageBody>
        <div className="pt-8">
          <OnThisPage items={TOC} />
        </div>

        <Section id="scenario" kicker="Setting" title="The scenario">
          <Callout variant="hypothetical" label="Scenario">
            <p>
              A product team maintains a modern web application. Regression testing is currently
              largely manual. The team wants to introduce automation but has limited automation
              experience.
            </p>
          </Callout>
          <P>
            That is the whole brief, and it is roughly how these conversations actually start. Note
            what is missing: how large the regression suite is, how often they release, what breaks,
            and what they have already tried. Those are the first things to find out, and inventing
            them here would defeat the purpose of the example.
          </P>
        </Section>

        <Section
          id="understand"
          kicker="Step 1"
          title="Understand"
          intro="The questions I would ask first, in roughly this order."
        >
          <Grid>
            <Panel title="About the application and its testing">
              <Bullets
                items={[
                  'What application are we testing, and what is it for?',
                  'Which workflows would hurt most if they broke?',
                  'How is regression testing performed today, and by whom?',
                  'How long does it take, and when does it get skipped?',
                  'What has broken in production or late in the cycle recently?',
                ]}
              />
            </Panel>
            <Panel title="About the environment and the team">
              <Bullets
                items={[
                  'What tools already exist - test management, CI, defect tracking?',
                  'What skills exist in the team today?',
                  'What does the CI/CD pipeline look like, and what runs in it?',
                  'How stable are the test environments, and who owns them?',
                  'What are the major pain points, in the team’s own words?',
                ]}
              />
            </Panel>
          </Grid>
          <ClaimLine claim="recommendation">
            I would watch a regression cycle rather than only ask about it. The gap between the
            documented process and the real one is usually where the useful information is.
          </ClaimLine>
        </Section>

        <Section
          id="assess"
          kicker="Step 2"
          title="Assess"
          intro="With answers in hand, the assessment should produce five things."
        >
          <DataTable
            headers={['What to establish', 'How', 'What it decides']}
            firstColumnHeader
            rows={[
              [
                'High-value regression candidates',
                'Map workflows against business impact, change frequency and defect history',
                'What goes into the pilot',
              ],
              [
                'Technical feasibility',
                'Look at the application: authentication, dynamic content, third-party components, test hooks',
                'Whether UI automation is realistic here at all, and where API-level tests are the better answer',
              ],
              [
                'Team capability',
                'Conversations and a short hands-on session',
                'How much enablement time is needed before the team can contribute',
              ],
              [
                'Maintenance risks',
                'How often the interface changes; how much of it is generated markup',
                'Locator strategy, and how much abstraction is justified',
              ],
              [
                'Environment dependencies',
                'Environment stability, data refresh, external systems',
                'Whether the pilot needs stubs, dedicated data, or a different environment entirely',
              ],
            ]}
          />
          <Callout variant="caution" label="What I would not produce">
            <p>
              A maturity percentage. On the evidence available in a first assessment, &quot;the team
              is at developing level, because regression is manual, automation exists only as
              individual scripts, and nothing runs in the pipeline&quot; is both more accurate and
              more actionable than a number.
            </p>
          </Callout>
        </Section>

        <Section
          id="tools"
          kicker="Step 3"
          title="Tool evaluation"
          intro="Potential candidates for a modern web application: Playwright, Cypress, Selenium."
        >
          <P>
            None of these is universally superior. In this scenario the factors that would actually
            influence the decision are:
          </P>
          <Bullets
            items={[
              'Which languages the team already writes, since the tests will be maintained by this team',
              'Whether the application does anything the tool handles badly - multiple origins, unusual authentication, embedded content',
              'What the existing pipeline can run, and how much parallel execution is available',
              'How good the failure diagnostics are, because a team new to automation will need them constantly',
              'Whether any existing automation would have to be migrated, and what that would cost',
              'Organisational constraints on licensing, hosting and data handling',
            ]}
          />
          <Callout variant="hypothetical">
            <p>
              For a modern web application with strong TypeScript capability, Playwright may be a
              strong candidate to evaluate. This is a hypothesis requiring validation through a POC.
            </p>
          </Callout>
          <ClaimLine claim="decision">
            The tool is selected by the team and the responsible stakeholders on the evidence the
            POC produces. If the POC contradicts the hypothesis, the hypothesis loses.
          </ClaimLine>
        </Section>

        <Section
          id="pilot"
          kicker="Step 4"
          title="Pilot design"
          intro="A pilot that only proves tests can be written has proved the least interesting thing."
        >
          <SubSection title="Pilot objectives">
            <Bullets
              marker="check"
              items={[
                'Validate framework feasibility against this application',
                'Validate maintainability - can the team change a test three months later?',
                'Validate CI/CD integration end to end',
                'Validate reporting and debugging, by investigating a real failure',
                'Identify training needs from what the team struggles with',
                'Gather team feedback and act on some of it visibly',
              ]}
            />
          </SubSection>
          <SubSection title="Pilot success criteria">
            <P>
              Qualitative on purpose. A numeric target invented before the pilot would only measure
              how good I am at guessing.
            </P>
            <DataTable
              headers={['Criterion', 'How it would be judged']}
              firstColumnHeader
              rows={[
                ['Tests are reliable', 'Repeated runs on unchanged code produce the same result; any test that passes only on retry is treated as an open issue'],
                ['Tests are understandable', 'A team member who did not write a test can explain what it verifies'],
                ['Failures are diagnosable', 'A failure can be categorised from the CI artifacts without re-running the suite'],
                ['Team members can modify tests', 'A team member adds a scenario and updates a page object unaided'],
                ['Tests execute in CI/CD', 'The suite runs on every pull request and its result is visible to the team'],
                ['Maintenance is understood', 'The team can say who owns which tests and what happens when one fails'],
              ]}
            />
          </SubSection>
        </Section>

        <Section
          id="measure"
          kicker="Step 5"
          title="Measurement plan"
          intro="What I would measure, with the values deliberately left empty until a real project supplies them."
        >
          <DataTable
            caption="A template, not a result. The baseline column has to be filled in before the pilot starts, because afterwards nobody can reconstruct it honestly."
            headers={['Measure', 'Baseline (before pilot)', 'After pilot', 'Why it is worth collecting']}
            firstColumnHeader
            rows={[
              ['Regression cycle duration', NOT_RECORDED, NOT_RECORDED, 'The pain that started the conversation'],
              ['Manual effort per release', NOT_RECORDED, NOT_RECORDED, 'Where the team’s time actually goes'],
              ['Critical workflows covered', NOT_RECORDED, NOT_RECORDED, 'Coverage of risk, rather than count of tests'],
              ['Tests passing only on retry', NOT_RECORDED, NOT_RECORDED, 'Early warning that trust is eroding'],
              ['Failure categories', NOT_RECORDED, NOT_RECORDED, 'Distinguishes product defects from test and environment problems'],
              ['Time to diagnose a failure', NOT_RECORDED, NOT_RECORDED, 'The real maintenance cost of the suite'],
            ]}
          />
          <Statement>
            Cost and benefit should be measured using actual execution frequency, manual effort and
            maintenance effort - not asserted in advance.
          </Statement>
          <ClaimLine claim="evidence">
            Only this row type would change once a project exists. The structure of the plan stays
            the same; the empty cells get filled with observations.
          </ClaimLine>
        </Section>

        <Section
          id="risks"
          kicker="Realism"
          title="What I would expect to be hard"
          intro="The parts of this plan most likely to go wrong, based on what usually goes wrong."
        >
          <FlowDiagram
            steps={[
              {
                title: 'Environment stability',
                detail:
                  'A shaky test environment produces failures that look like flaky tests and consume the pilot’s credibility.',
              },
              {
                title: 'Test data',
                detail:
                  'Shared or unrefreshed data is the most common reason a pilot passes locally and fails in the pipeline.',
              },
              {
                title: 'Time for the team to learn',
                detail:
                  'Enablement competes with delivery commitments. If nobody is given time, the central team ends up writing the tests.',
              },
              {
                title: 'The first serious flaky test',
                detail:
                  'How it is handled sets the culture: investigated properly, or absorbed by a retry.',
              },
              {
                title: 'Scope pressure',
                detail:
                  'Success invites a request to automate everything next quarter. That is the moment to go back to risk-based prioritisation.',
              },
            ]}
          />
        </Section>
      </PageBody>
    </>
  );
}

import PageHeader from '../components/PageHeader.tsx';
import Section, { SubSection } from '../components/Section.tsx';
import Callout from '../components/Callout.tsx';
import FlowDiagram from '../components/FlowDiagram.tsx';
import DataTable from '../components/DataTable.tsx';
import OnThisPage from '../components/OnThisPage.tsx';
import { ClaimLine } from '../components/Badge.tsx';
import { Bullets, DefinitionList, Grid, PageBody, P, Panel, Statement } from '../components/Content.tsx';

const TOC = [
  { id: 'criteria', label: 'Evaluation criteria' },
  { id: 'no-scores', label: 'Why not a score out of 100' },
  { id: 'process', label: 'The decision process' },
  { id: 'candidates', label: 'Comparing candidates' },
  { id: 'poc', label: 'Designing the proof of concept' },
];

const CRITERIA = [
  {
    term: 'Application fit',
    description:
      'Does the tool support the application technology - browsers, frameworks, authentication, iframes, file handling, anything unusual in the interface? This is the criterion most likely to eliminate a candidate outright.',
  },
  {
    term: 'Team capability',
    description:
      'Can this team learn and maintain it? A framework the team can use unassisted beats a technically superior one that only one person understands.',
  },
  {
    term: 'Existing ecosystem',
    description:
      'Does it integrate with what is already in use - build tooling, reporting, test management, defect tracking, the languages the team already writes?',
  },
  {
    term: 'CI/CD',
    description:
      'Can it run reliably in the existing pipeline: in containers, in parallel, on the available runners, within the available execution time?',
  },
  {
    term: 'Debugging',
    description:
      'When a test fails at 3am in CI, what does the tool give you? Diagnostics quality drives maintenance cost more than almost anything else.',
  },
  {
    term: 'Maintainability',
    description:
      'Does the framework encourage structures that stay readable as the suite grows? How much churn do upgrades cause?',
  },
  {
    term: 'Scalability',
    description:
      'Can it support growing automation needs - more tests, more teams, more environments - without execution time becoming the constraint?',
  },
  {
    term: 'Migration effort',
    description:
      'What does it cost to move from the existing solution: rewriting tests, retraining people, running two suites in parallel during the transition? Often the deciding factor when an existing suite works.',
  },
  {
    term: 'Vendor and community support',
    description:
      'What support ecosystem exists - release cadence, documentation, answers to hard questions, and for commercial tools the contractual support and its limits?',
  },
  {
    term: 'Security and compliance',
    description:
      'Does the solution satisfy organisational requirements: where data goes, how credentials are handled, licence terms, dependency and supply-chain policy, self-hosting where required?',
  },
];

export default function ToolEvaluation() {
  return (
    <>
      <PageHeader
        eyebrow="Tool evaluation"
        title="Tool Evaluation Framework"
        lead="A structure for arriving at a defensible tool decision - and for being able to explain it later to someone who would have chosen differently."
      />

      <PageBody>
        <div className="pt-8">
          <OnThisPage items={TOC} />
        </div>

        <Section id="criteria" kicker="Criteria" title="Evaluation criteria">
          <P>
            The criteria below are the ones I would start from. Which of them matter most is itself
            a decision to make with the team before looking at any tool - otherwise the criteria
            quietly rearrange themselves around the preferred answer.
          </P>
          <DefinitionList items={CRITERIA} />
          <ClaimLine claim="recommendation">
            Agree up front which criteria are knock-out conditions and which are trade-offs. A tool
            that fails a knock-out criterion does not get compensated by being pleasant to write.
          </ClaimLine>
        </Section>

        <Section
          id="no-scores"
          kicker="Method"
          title="Why not a score out of 100"
          intro="Weighted scorecards look objective and usually are not."
        >
          <Grid>
            <Panel tone="bad" title="What a score hides">
              <Bullets
                marker="cross"
                items={[
                  'The weights, which are where the actual judgement lives',
                  'That 86 and 84 are indistinguishable given the input quality',
                  'That a knock-out criterion can be outvoted by several minor ones',
                  'Who disagreed, and on what grounds',
                ]}
              />
            </Panel>
            <Panel tone="good" title="What I would produce instead">
              <Bullets
                marker="check"
                items={[
                  'A statement per criterion: does this candidate satisfy it, with what evidence',
                  'The open risks and what the proof of concept would need to show',
                  'An explicit recommendation with its reasoning',
                  'The decision, recorded with its date and the people who made it',
                ]}
              />
            </Panel>
          </Grid>
          <Callout variant="caution" label="False precision">
            <p>
              Publishing &quot;Playwright: 86%&quot; implies a measurement. Unless there is a
              defined methodology and real input data behind it, that number is an opinion wearing a
              lab coat - and it is much harder to argue with than the opinion would have been.
            </p>
          </Callout>
          <Statement>Tool selection is an engineering decision, not a popularity contest.</Statement>
          <P>
            A tool should not be selected because it is modern, because it is popular, or because it
            was used successfully somewhere else with a different application and a different team.
          </P>
        </Section>

        <Section id="process" kicker="Process" title="The decision process">
          <FlowDiagram
            numbered
            steps={[
              { title: 'Understand context', detail: 'Application, team, pipeline, constraints.' },
              { title: 'Define evaluation criteria', detail: 'Including knock-out conditions, before looking at tools.' },
              { title: 'Shortlist candidates', detail: 'Two or three that plausibly satisfy the criteria.' },
              { title: 'Build a small POC', detail: 'The same representative flows in each candidate.' },
              { title: 'Evaluate evidence', detail: 'Against the criteria, with the POC in hand.' },
              { title: 'Discuss with stakeholders', detail: 'Team, architecture, security, operations.' },
              { title: 'Select tool', detail: 'Recorded with the reasoning and the known trade-offs.' },
              { title: 'Monitor outcome', detail: 'Revisit once the suite has grown and people have lived with it.' },
            ]}
          />
          <ClaimLine claim="decision">
            The selection itself is made by the responsible stakeholders. The enablement function
            supplies evidence, a recommendation and the trade-offs - not a fait accompli.
          </ClaimLine>
        </Section>

        <Section
          id="candidates"
          kicker="Candidates"
          title="Comparing candidates"
          intro="For a modern web application, Playwright, Cypress and Selenium are all plausible starting candidates. The table lists characteristics worth verifying, not a ranking."
        >
          <DataTable
            caption="Characteristics commonly cited for each tool. Every one of them should be re-checked against the current version and against your own application before it influences a decision."
            headers={['', 'Commonly cited strengths', 'Questions I would want answered']}
            firstColumnHeader
            rows={[
              [
                'Playwright',
                'Single API across Chromium, Firefox and WebKit; first-class TypeScript; auto-waiting; trace viewer; parallel execution built in',
                'Does the team have the TypeScript capability to maintain it? How does it behave with this application’s authentication and any unusual components?',
              ],
              [
                'Cypress',
                'Strong developer experience and interactive runner; large ecosystem and plugin community; well-established documentation',
                'Do its architectural constraints matter for this application - multiple tabs or origins, for instance? How does the licensing of any hosted services fit the organisation?',
              ],
              [
                'Selenium',
                'W3C WebDriver standard; broadest language and browser support; mature grid infrastructure; very widely known',
                'How much scaffolding must we build ourselves - waiting, reporting, diagnostics? Does existing in-house experience outweigh that effort?',
              ],
            ]}
          />
          <Callout variant="note" label="Deliberately no verdict">
            <p>
              None of these is universally superior. The right answer depends on the application,
              the team, the pipeline and what already exists - which is why the process above ends
              with a proof of concept rather than with this table.
            </p>
          </Callout>
          <ClaimLine claim="assumption">
            If an existing suite already works and the team can maintain it, migration has to earn
            its cost. &quot;The current tool is older&quot; is not a reason on its own.
          </ClaimLine>
        </Section>

        <Section
          id="poc"
          kicker="Evidence"
          title="Designing the proof of concept"
          intro="The proof of concept exists to convert opinions into evidence, so it has to be designed to be able to fail."
        >
          <SubSection title="What to build">
            <Bullets
              items={[
                'The same two or three representative flows in each candidate - including the awkward part of the application, not only the login screen',
                'Run in the real pipeline, on the real runners, against a real environment',
                'Written by someone from the team, not only by the person recommending the tool',
                'Deliberately broken once, to see what the failure output actually tells you',
              ]}
            />
          </SubSection>
          <SubSection title="What to record">
            <Bullets
              marker="check"
              items={[
                'Where each candidate satisfied or failed a criterion, with the evidence',
                'How long it took a team member to become productive',
                'What had to be built by hand to make it work',
                'What remains uncertain after the POC, and how that risk would be handled',
              ]}
            />
          </SubSection>
          <Callout variant="hypothetical">
            <p>
              For a modern web application with strong TypeScript capability in the team, Playwright
              may be a strong candidate to evaluate. This is a hypothesis requiring validation
              through a POC - not a conclusion, and not transferable to a different application or a
              team with different skills.
            </p>
          </Callout>
        </Section>
      </PageBody>
    </>
  );
}

import PageHeader from '../components/PageHeader.tsx';
import Section, { SubSection } from '../components/Section.tsx';
import Callout from '../components/Callout.tsx';
import FlowDiagram from '../components/FlowDiagram.tsx';
import Accordion from '../components/Accordion.tsx';
import DataTable from '../components/DataTable.tsx';
import OnThisPage from '../components/OnThisPage.tsx';
import { ClaimLine } from '../components/Badge.tsx';
import { Bullets, Grid, PageBody, P, Panel, Statement } from '../components/Content.tsx';

const TOC = [
  { id: 'path', label: 'The learning path' },
  { id: 'learner', label: 'A. Understand the learner' },
  { id: 'context', label: 'B. Build context' },
  { id: 'guided', label: 'C. Guided learning' },
  { id: 'independence', label: 'D. Transition to independence' },
  { id: 'governance', label: 'Ownership and governance' },
];

const TOPICS = [
  {
    id: 'topic-structure',
    title: '1. Test structure',
    summary: 'What a test is trying to say.',
    content: (
      <P>
        Arrange, act, assert; one clear intention per test; a title that describes behaviour rather
        than steps. We start here because it is the habit that makes everything later reviewable.
      </P>
    ),
  },
  {
    id: 'topic-locators',
    title: '2. Locators',
    summary: 'Finding elements the way a user would.',
    content: (
      <P>
        Role, label and test id, and why generated CSS classes are a trap. This is also where a new
        automation engineer first meets the accessibility tree, which pays off far beyond testing.
      </P>
    ),
  },
  {
    id: 'topic-assertions',
    title: '3. Assertions',
    summary: 'Verifying something that matters.',
    content: (
      <P>
        Web-first assertions and their retry behaviour, choosing the outcome worth asserting, and
        writing failure messages that a colleague can act on at 8am.
      </P>
    ),
  },
  {
    id: 'topic-data',
    title: '4. Test data',
    summary: 'Controlling the inputs.',
    content: (
      <P>
        Where data comes from, why shared mutable data causes intermittent failures, and how to set
        up and clean up state. Also the first conversation about handling anything sensitive.
      </P>
    ),
  },
  {
    id: 'topic-pom',
    title: '5. Page Objects',
    summary: 'Keeping locators in one place.',
    content: (
      <P>
        What belongs in a page object and what does not - including the failure mode where the page
        object slowly becomes the test.
      </P>
    ),
  },
  {
    id: 'topic-fixtures',
    title: '6. Fixtures',
    summary: 'Setup that is shared without being hidden.',
    content: (
      <P>
        Reusable setup such as an authenticated context or a seeded record, and the trade-off
        between convenience and a test whose preconditions are no longer visible.
      </P>
    ),
  },
  {
    id: 'topic-api',
    title: '7. API testing',
    summary: 'Testing below the interface.',
    content: (
      <P>
        Verifying behaviour directly at the service level, and using API calls to arrange state for
        UI tests - usually the single biggest improvement in speed and reliability.
      </P>
    ),
  },
  {
    id: 'topic-debugging',
    title: '8. Debugging',
    summary: 'Reading what the tooling already recorded.',
    content: (
      <P>
        Trace viewer, screenshots, video, console and network output; running a single test in
        isolation; reproducing a CI failure locally. Taught early, because a learner who cannot
        debug will guess.
      </P>
    ),
  },
  {
    id: 'topic-ci',
    title: '9. CI/CD',
    summary: 'Where the tests actually run.',
    content: (
      <P>
        How the suite is triggered, what blocks a merge, where artifacts are published, and why a
        test that only passes locally is not finished.
      </P>
    ),
  },
  {
    id: 'topic-reporting',
    title: '10. Reporting',
    summary: 'Communicating a result.',
    content: (
      <P>
        Reading a report, categorising a failure, and reporting it in a way that the right person
        can act on - which is a testing skill, not a tooling skill.
      </P>
    ),
  },
];

export default function Training() {
  return (
    <>
      <PageHeader
        eyebrow="Team enablement"
        title="How I Would Enable a New Tester"
        lead="Training that starts with tool syntax produces people who can write scripts. The goal is people who can decide what is worth automating, write tests others can maintain, and diagnose their own failures."
      />

      <PageBody>
        <div className="pt-8">
          <OnThisPage items={TOC} />
        </div>

        <Section
          id="path"
          kicker="Overview"
          title="The learning path"
          intro="The same path applies whether the learner is a manual tester moving into automation or a developer new to testing - what changes is how long each stage takes."
        >
          <FlowDiagram
            numbered
            steps={[
              { title: 'Assess learner', detail: 'Start from what they already know.' },
              { title: 'Explain context', detail: 'Product, risk and testing strategy.' },
              { title: 'Introduce framework', detail: 'Concepts before API surface.' },
              { title: 'Teach standards', detail: 'The guardrails, with the reasons.' },
              { title: 'Guided implementation', detail: 'Write the first tests together.' },
              { title: 'Code review', detail: 'Real feedback on real contributions.' },
              { title: 'Independent implementation', detail: 'They write and own tests.' },
              { title: 'Continuous support', detail: 'Available, but no longer required.' },
            ]}
          />
          <Statement>
            Before the framework: what are we testing, why are we automating it, what should stay
            manual, how does this fit into the delivery process, and who owns the tests afterwards?
          </Statement>
        </Section>

        <Section
          id="learner"
          kicker="A"
          title="Understand the learner"
          intro="A first conversation, not an exam. The point is to find the right starting altitude and avoid both boring people and losing them."
        >
          <DataTable
            headers={['Area', 'What I would try to find out', 'What it changes']}
            firstColumnHeader
            rows={[
              [
                'Testing knowledge',
                'How they decide what to test, and how they think about risk',
                'How much time we spend on test design rather than tooling',
              ],
              [
                'Programming knowledge',
                'Comfort with functions, types, async code, reading errors',
                'Pace, and how much of the framework we abstract at first',
              ],
              [
                'Application knowledge',
                'Which workflows they already understand deeply',
                'Which flow we automate first together',
              ],
              [
                'Automation experience',
                'What they have used before, and what frustrated them',
                'Which habits to build on and which to revisit',
              ],
              [
                'Git knowledge',
                'Branching, pull requests, resolving a conflict',
                'Whether version control needs its own session before anything else',
              ],
              [
                'CI/CD knowledge',
                'What happens after a merge; how to read a pipeline',
                'When to introduce the pipeline - early, if it is unfamiliar',
              ],
            ]}
          />
          <ClaimLine claim="recommendation">
            Ask people to show something they have tested rather than describe their experience
            level. It is faster, more accurate, and it starts the relationship on their territory.
          </ClaimLine>
        </Section>

        <Section
          id="context"
          kicker="B"
          title="Build context"
          intro="Everything in this stage is about judgement. A tester who understands the product will automate the right things even with an unfamiliar framework."
        >
          <Grid columns={3}>
            <Panel title="The product">
              <Bullets
                items={[
                  'What it does and who depends on it',
                  'The business purpose behind the features',
                  'Which failures would matter most',
                ]}
              />
            </Panel>
            <Panel title="The testing approach">
              <Bullets
                items={[
                  'The current testing strategy',
                  'Objectives of the automation effort',
                  'What is deliberately not automated, and why',
                ]}
              />
            </Panel>
            <Panel title="The setup">
              <Bullets
                items={[
                  'Framework architecture and conventions',
                  'Team responsibilities and ownership',
                  'How work arrives and how it is reviewed',
                ]}
              />
            </Panel>
          </Grid>
          <Callout variant="principle">
            <p>
              Teaching the framework first is faster in week one and slower by month three. The
              expensive mistakes - automating the wrong things, in the wrong place, at the wrong
              level - all come from missing context, not from missing API knowledge.
            </p>
          </Callout>
        </Section>

        <Section
          id="guided"
          kicker="C"
          title="Guided learning"
          intro="Ten topics, in this order, each taught against the real application rather than a tutorial project."
        >
          <Accordion items={TOPICS} />
          <P>
            Each topic ends with something committed: a test, a page object, a fixture, a fixed
            flaky test. Reviewing real work is what turns a demonstration into a skill.
          </P>
        </Section>

        <Section
          id="independence"
          kicker="D"
          title="Transition to independence"
          intro="The handover is the deliverable. If it does not happen, the enablement work has simply moved the bottleneck."
        >
          <FlowDiagram
            orientation="horizontal"
            steps={[
              { title: 'Guided' },
              { title: 'Pairing' },
              { title: 'Review' },
              { title: 'Independent' },
              { title: 'Support' },
            ]}
          />
          <DataTable
            headers={['Stage', 'Who holds the keyboard', 'What tells me we can move on']}
            firstColumnHeader
            rows={[
              ['Guided', 'Me, explaining as I go', 'They can predict what I am about to do and why'],
              ['Pairing', 'Them, with me alongside', 'The questions become design questions, not syntax questions'],
              ['Review', 'Them, with me reviewing pull requests', 'Review comments become discussions rather than corrections'],
              ['Independent', 'Them', 'They add tests and fix failures without escalating'],
              ['Support', 'Them, with me reachable', 'They come with a hypothesis, not just a red build'],
            ]}
          />
          <Statement>
            Enablement succeeds when the team can maintain, extend and explain the automation
            themselves - including deciding to delete a test that no longer earns its place.
          </Statement>
        </Section>

        <Section
          id="governance"
          kicker="Operating model"
          title="Ownership and governance"
          intro="A central enablement function and the application teams need clearly different jobs, or the central team ends up writing everyone's tests."
        >
          <Grid>
            <Panel title="Central enablement team">
              <Bullets
                items={[
                  'Provides standards and a reference architecture',
                  'Provides templates and reusable building blocks',
                  'Supports and coaches teams',
                  'Evaluates tools and runs proofs of concept',
                  'Maintains the shared guidance and keeps it current',
                ]}
              />
            </Panel>
            <Panel title="Application teams">
              <Bullets
                items={[
                  'Own their tests',
                  'Understand their domain and its risks',
                  'Maintain application-specific automation',
                  'Participate in reviews',
                  'Provide feedback that changes the standards',
                ]}
              />
            </Panel>
          </Grid>
          <Callout variant="principle">
            <p>
              Enablement should increase team autonomy rather than create permanent dependency on a
              central team.
            </p>
          </Callout>
          <SubSection title="A test for whether it is working">
            <Bullets
              marker="check"
              items={[
                'Teams add tests without asking the central team first',
                'Teams diagnose their own failures before escalating',
                'Standards change because a team pushed back with a good reason',
                'The central team spends more time on tooling and coaching than on writing tests',
              ]}
            />
          </SubSection>
        </Section>
      </PageBody>
    </>
  );
}

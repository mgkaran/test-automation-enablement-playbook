import PageHeader from '../components/PageHeader.tsx';
import Section from '../components/Section.tsx';
import Callout from '../components/Callout.tsx';
import OnThisPage from '../components/OnThisPage.tsx';
import DataTable from '../components/DataTable.tsx';
import { Bullets, PageBody, P, Statement } from '../components/Content.tsx';

const TOC = [
  { id: 'purpose', label: 'Project purpose' },
  { id: 'scope', label: 'Scope' },
  { id: 'disclaimer', label: 'Disclaimers' },
  { id: 'perspective', label: 'My perspective' },
  { id: 'stack', label: 'How it is built' },
  { id: 'future', label: 'Possible future work' },
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About this project"
        lead="What this is, what it is not, and the assumptions behind everything on the other pages."
      />

      <PageBody>
        <div className="pt-8">
          <OnThisPage items={TOC} />
        </div>

        <Section id="purpose" kicker="Why" title="Project purpose">
          <P>
            This is a personal proof-of-concept created to demonstrate my approach to test
            automation enablement. I built it after an interview for a test automation enablement
            role, as a way of setting out how I would actually approach the work rather than
            describing it in a paragraph on a CV.
          </P>
          <P>
            It is intended to show reasoning: how I would understand a team before recommending
            anything, which standards I would establish and why, how I would teach someone, how I
            would choose a tool, and what I would refuse to claim without evidence.
          </P>
        </Section>

        <Section id="scope" kicker="Boundaries" title="Scope">
          <P>
            The examples are educational and hypothetical unless explicitly stated otherwise. The
            Playwright suite, the configuration and the CI workflow are real and run; everything
            about teams, projects and organisations is invented for illustration and labelled as
            such.
          </P>
          <Bullets
            items={[
              'The case study describes a fictional team. There is no client behind it.',
              'The demo application and its data are fictional and exist only as a test target.',
              'Every statement that could be mistaken for a measurement is either labelled as an assumption or left empty on purpose.',
              'Tool characteristics are described as things to verify, not as verdicts.',
            ]}
          />
        </Section>

        <Section id="disclaimer" kicker="Important" title="Disclaimers">
          <Callout variant="caution" label="Data disclaimer">
            <p>
              No confidential company information, internal architecture, production data,
              credentials or proprietary information is used in this project. The only credentials
              in the repository are published placeholder values for a demo application that holds
              no data.
            </p>
          </Callout>
          <Callout variant="caution" label="Organisational disclaimer">
            <p>
              This project does not represent the internal systems, architecture, policies, tooling,
              metrics or testing strategy of any specific organisation. It is not an assessment of
              any organisation&apos;s automation maturity, and nothing here should be read as
              describing how any particular company works.
            </p>
          </Callout>
          <Callout variant="note" label="On the claims made here">
            <p>
              Where this playbook makes a general claim about testing - that fixed waits cause
              unreliable tests, that retries can mask reliability problems - it is a professional
              judgement based on my own experience and on widely held practice, not a research
              finding. Some of it would be worth arguing about, and I would rather have that
              argument than present it as settled.
            </p>
          </Callout>
        </Section>

        <Section id="perspective" kicker="Personal" title="My perspective">
          <P>
            My experience with automation taught me that automation is not only about writing test
            scripts. The real value comes from selecting the right tests, creating maintainable
            solutions, integrating them into the development process and helping teams use
            automation effectively.
          </P>
          <P>
            My interest in enablement comes from wanting to understand how technical solutions can
            be introduced in a practical way across teams, rather than simply implementing
            automation in isolation. The parts of my work I have learned the most from were not the
            tests I wrote: they were the conversations about which tests were worth writing, and the
            times a suite I was proud of turned out to be hard for someone else to maintain.
          </P>
          <Statement>
            I have roughly two years of professional experience in software testing and automation.
            This project is a demonstration of how I think and a way of learning in public - not a
            claim to be a senior architect.
          </Statement>
          <P>
            There are things in this playbook I would expect to revise after a few months inside a
            real organisation, because the constraints that matter most are usually the ones you
            cannot see from outside. Where I do not know something - the exact controls a regulated
            environment requires, for instance - I have tried to say so rather than fill the gap
            with plausible-sounding text.
          </P>
        </Section>

        <Section id="stack" kicker="Implementation" title="How it is built">
          <DataTable
            headers={['Area', 'Choice', 'Why']}
            firstColumnHeader
            rows={[
              ['Frontend', 'React with TypeScript', 'Typed components, and the same language as the test suite'],
              ['Build', 'Vite', 'Fast builds and a preview server the tests can run against'],
              ['Styling', 'Tailwind CSS', 'A small, consistent design system without a component library'],
              ['Testing', 'Playwright', 'UI and API tests in one framework, with diagnostics worth relying on'],
              ['CI', 'GitHub Actions', 'Runs type checking and the full suite on every push, and publishes the report'],
              [
                'Demo API',
                'Vite middleware',
                'Serves the demo endpoints from the same origin in dev and preview - no second process, no CORS configuration',
              ],
              [
                'Hosting',
                'GitHub Pages',
                'A static project page. The published build runs the demo endpoints in the browser, and the deploy pipeline tests that build before publishing it',
              ],
            ]}
          />
          <P>
            The site has no analytics, no tracking and no backend. The source, the Playwright suite
            and both CI workflows are in the repository linked in the footer.
          </P>
        </Section>

        <Section id="future" kicker="Next" title="Possible future work">
          <P>
            Deliberately not implemented. Each of these only becomes meaningful with a real project
            behind it, and building them without one would produce exactly the fabricated data this
            project avoids.
          </P>
          <Bullets
            items={[
              'Integrate real project data once there is a project to draw it from',
              'Connect a test management system so coverage can be traced to requirements',
              'Integrate a defect tracker such as Jira for failure triage',
              'Add real measured metrics with a documented collection method',
              'Pull execution history from CI/CD APIs to show reliability trends',
              'Role-based access, if the content ever became organisation-specific',
              'Team-specific configuration of the guardrails, with documented exceptions',
            ]}
          />
        </Section>
      </PageBody>
    </>
  );
}

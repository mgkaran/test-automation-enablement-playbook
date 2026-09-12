import PageHeader from '../components/PageHeader.tsx';
import Section, { SubSection } from '../components/Section.tsx';
import Callout from '../components/Callout.tsx';
import CodeBlock, { CodeCompare } from '../components/CodeBlock.tsx';
import FlowDiagram from '../components/FlowDiagram.tsx';
import DataTable from '../components/DataTable.tsx';
import OnThisPage from '../components/OnThisPage.tsx';
import { ClaimLine } from '../components/Badge.tsx';
import {
  Bullets,
  DefinitionList,
  Grid,
  PageBody,
  P,
  Panel,
  Statement,
} from '../components/Content.tsx';

const TOC = [
  { id: 'locators', label: 'Locator policy' },
  { id: 'waiting', label: 'Waiting and synchronisation' },
  { id: 'assertions', label: 'Assertion policy' },
  { id: 'independence', label: 'Test independence' },
  { id: 'test-data', label: 'Test data' },
  { id: 'secrets', label: 'Secrets' },
  { id: 'structure', label: 'Test structure' },
  { id: 'pom', label: 'Page Object Model' },
  { id: 'flaky', label: 'Flaky test management' },
  { id: 'ci', label: 'CI/CD integration' },
  { id: 'debugging', label: 'Debugging a CI failure' },
  { id: 'diagnostics', label: 'Diagnostics' },
];

const LOCATOR_ROLE = `page.getByRole('button', { name: 'Login' })`;

const LOCATOR_LABEL = `page.getByLabel('Username')`;

const LOCATOR_TESTID = `page.getByTestId('login-button')`;

const LOCATOR_CSS = `page.locator('.btn-83927')`;

const WAIT_BAD = `await page.waitForTimeout(3000);
await page.getByRole('link', { name: 'Reports' }).click();`;

const WAIT_GOOD = `await expect(page.getByRole('heading', {
  name: 'Dashboard'
})).toBeVisible();

await page.getByRole('link', { name: 'Reports' }).click();`;

const ASSERT_GOOD = `await page.getByRole('button', { name: 'Login' }).click();

await expect(page.getByRole('heading', {
  name: 'Dashboard'
})).toBeVisible();`;

const ASSERT_WEAK = `await page.getByRole('button', { name: 'Login' }).click();

await page.waitForTimeout(2000);`;

const DEPENDENT_BAD = `// Test 2 only passes if Test 1 ran first, in the same order.
test('creates a request', async ({ page }) => {
  await page.goto('/requests/new');
  // ... creates REQ-2001
});

test('closes the request', async ({ page }) => {
  await page.goto('/requests/REQ-2001'); // created by the test above
  await page.getByRole('button', { name: 'Close' }).click();
});`;

const INDEPENDENT_GOOD = `// Each test creates the state it needs, then cleans up after itself.
test('closes a request', async ({ page, request }) => {
  const created = await createRequest(request, { title: 'Closable request' });

  await page.goto('/requests/' + created.id);
  await page.getByRole('button', { name: 'Close' }).click();

  await expect(page.getByText('Status: Closed')).toBeVisible();

  await deleteRequest(request, created.id);
});`;

const TEST_DATA = `// Configuration comes from the environment, with no fallback to a real account.
const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;

if (!username || !password) {
  throw new Error('TEST_USERNAME and TEST_PASSWORD must be set.');
}`;

const SECRETS = `process.env.TEST_USERNAME
process.env.TEST_PASSWORD`;

const STRUCTURE = `tests/            # the specs themselves, grouped by area
pages/            # page objects: locators and page-level actions
fixtures/         # shared setup: authenticated context, test data helpers
utils/            # small helpers that are not page-specific
test-data/        # static data files and builders
playwright.config.ts`;

const POM = `export class LoginPage {
  constructor(private page: Page) {}

  username = this.page.getByLabel('Username');
  password = this.page.getByLabel('Password');
  loginButton = this.page.getByRole('button', {
    name: 'Login'
  });

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}`;

const POM_TOO_MUCH = `// A page object that has started to absorb the tests themselves.
async loginAndVerifyDashboardAndOpenReportsAndExport(
  user: string, password: string, reportName: string
) {
  // ... 60 lines, three assertions, two navigations
}`;

export default function Guardrails() {
  return (
    <>
      <PageHeader
        eyebrow="Automation guardrails"
        title="Automation Guardrails"
        lead="Guardrails provide consistency without preventing teams from making context-specific engineering decisions. Each one below is a default with a reason attached, so a team can tell when departing from it is justified."
      />

      <PageBody>
        <div className="pt-8">
          <OnThisPage items={TOC} />
        </div>

        <Section
          id="locators"
          kicker="Guardrail"
          title="Locator policy"
          intro="Locators are where most UI test fragility originates, so this is the standard I would establish first."
        >
          <CodeCompare>
            <CodeBlock
              code={LOCATOR_ROLE}
              verdict="preferred"
              caption="Prefer user-facing locators: the role and the accessible name are what a user perceives, and they change when the behaviour changes rather than when the markup changes."
            />
            <div className="space-y-4">
              <CodeBlock
                code={LOCATOR_LABEL}
                verdict="acceptable"
                caption="Form fields by their label - stable, readable, and it fails loudly if the label disappears."
              />
              <CodeBlock
                code={LOCATOR_TESTID}
                verdict="acceptable"
                caption="An explicit test id is a contract between the application and its tests. Useful where no accessible name exists or the text is localised."
              />
            </div>
          </CodeCompare>
          <CodeBlock
            code={LOCATOR_CSS}
            verdict="avoid"
            caption="Generated or styling-derived class names change for reasons that have nothing to do with behaviour, so the test breaks without the application being wrong."
          />
          <ClaimLine claim="recommendation">
            Role-based first, label second, test id where neither works. Deep CSS or XPath chains as
            a documented exception - for example a third-party component that exposes nothing else.
          </ClaimLine>
          <Callout variant="note" label="A useful side effect">
            <p>
              Role-based locators only work when the application is reasonably accessible. When a
              test cannot find an element by role, that is often worth raising with the team rather
              than working around.
            </p>
          </Callout>
        </Section>

        <Section
          id="waiting"
          kicker="Guardrail"
          title="Waiting and synchronisation"
          intro="Synchronise with meaningful application state, not with the clock."
        >
          <CodeCompare>
            <CodeBlock
              code={WAIT_BAD}
              verdict="avoid"
              caption="A fixed wait is simultaneously too long (on a fast run) and too short (on a slow one). It makes the suite slower and still lets it fail unpredictably."
            />
            <CodeBlock
              code={WAIT_GOOD}
              verdict="preferred"
              caption="Waiting for a condition that actually means the application is ready. It returns as soon as the state is reached and fails with a meaningful message when it is not."
            />
          </CodeCompare>
          <P>
            Playwright auto-waits for actionability before most actions, so explicit waits are
            usually only needed to express what the test considers &quot;ready&quot;. The rare
            legitimate case for a timed wait - a deliberate delay that is part of the behaviour
            under test - should carry a comment explaining it.
          </P>
        </Section>

        <Section
          id="assertions"
          kicker="Guardrail"
          title="Assertion policy"
          intro="An action without meaningful verification does not provide sufficient confidence."
        >
          <CodeCompare>
            <CodeBlock
              code={ASSERT_GOOD}
              verdict="preferred"
              caption="Asserts the outcome the user cares about. Web-first assertions retry until the timeout, so no separate wait is needed."
            />
            <CodeBlock
              code={ASSERT_WEAK}
              verdict="avoid"
              caption="This test passes whether or not login worked. It verifies that two seconds elapsed."
            />
          </CodeCompare>
          <Bullets
            items={[
              'Assert the state the user would check, not an internal implementation detail.',
              'Prefer a few precise assertions over many shallow ones.',
              'Make failure messages self-explanatory: the person reading the CI output is often not the author.',
              'Assert the negative case too - an error message that should appear, and one that should not.',
            ]}
          />
        </Section>

        <Section
          id="independence"
          kicker="Guardrail"
          title="Test independence"
          intro="Tests should ideally be independently executable, manage their own state and clean up after themselves."
        >
          <CodeCompare>
            <CodeBlock
              code={DEPENDENT_BAD}
              verdict="avoid"
              language="typescript"
              caption="Order-dependent tests cannot be run in parallel, cannot be re-run individually, and produce a cascade of failures when the first one breaks."
            />
            <CodeBlock
              code={INDEPENDENT_GOOD}
              verdict="preferred"
              language="typescript"
              caption="Setting up state through an API is usually faster and more reliable than driving the UI for it - and it keeps the test focused on the behaviour it is verifying."
            />
          </CodeCompare>
          <Bullets
            items={[
              'Avoid unnecessary ordering dependencies between tests',
              'Create the required state in the test or a fixture',
              'Use controlled test data rather than whatever happens to be in the environment',
              'Clean up appropriately, so a re-run starts from the same place',
            ]}
          />
          <Callout variant="note">
            <p>
              Some flows genuinely are sequential - a multi-step application process, for example.
              Those can be one test with several steps, rather than several tests that secretly
              depend on each other.
            </p>
          </Callout>
        </Section>

        <Section
          id="test-data"
          kicker="Guardrail"
          title="Test data"
          intro="Unpredictable data produces unpredictable tests, and shared mutable data produces tests that fail depending on who ran what."
        >
          <Bullets
            items={[
              'Do not hard-code credentials or sensitive values in test code',
              'Read configuration from the environment, per target environment',
              'Use dedicated test accounts and test data, not data belonging to real people',
              'Avoid shared mutable state between tests and between runs',
              'Keep data deterministic where possible; where it cannot be, make the test tolerant of the variation rather than lucky',
            ]}
          />
          <CodeBlock
            code={TEST_DATA}
            filename="config/credentials.ts"
            verdict="preferred"
            caption="Failing fast with a clear message is better than falling back to a default account - a silent fallback is how a test suite ends up pointing at the wrong environment."
          />
        </Section>

        <Section
          id="secrets"
          kicker="Guardrail"
          title="Secrets"
          intro="This one is a rule rather than a recommendation."
        >
          <Statement>
            Never commit credentials, tokens, API keys or other secrets into source control.
          </Statement>
          <CodeBlock code={SECRETS} caption="Values are supplied by the environment at run time." />
          <Bullets
            items={[
              'Local development: an untracked .env file, with a committed .env.example listing the variable names only',
              'CI: the pipeline secret store, injected as environment variables for the run',
              'Never printed to logs, and never included in a test report or trace that is published',
              'If a secret is committed by accident, it is rotated - removing the commit is not enough',
            ]}
          />
          <Callout variant="note" label="In this repository">
            <p>
              The demo application uses a published placeholder username and password. They are not
              secrets, they guard nothing, and they are documented as placeholders - but the tests
              still read them from environment variables, because that is the shape a real project
              needs.
            </p>
          </Callout>
        </Section>

        <Section
          id="structure"
          kicker="Guardrail"
          title="Test structure"
          intro="One maintainable structure could be the following. It is not the only valid architecture, and a small suite does not need all of it on day one."
        >
          <CodeBlock code={STRUCTURE} language="text" filename="project layout" />
          <DefinitionList
            items={[
              { term: 'tests/', description: 'The specs. They read as a description of behaviour, not as a script of clicks.' },
              { term: 'pages/', description: 'Page objects: locators and the actions that belong to a page. No assertions about business outcomes.' },
              { term: 'fixtures/', description: 'Reusable setup and teardown - an authenticated context, seeded data, a configured API client.' },
              { term: 'utils/', description: 'Small, general helpers that are not tied to a page. Kept small on purpose; a large utils folder is usually a missing abstraction.' },
              { term: 'test-data/', description: 'Static data and builders, so the values a test needs are visible and controlled.' },
              { term: 'playwright.config.ts', description: 'Environment, projects, reporters and diagnostics - the settings that decide what a failure tells you.' },
            ]}
          />
        </Section>

        <Section
          id="pom"
          kicker="Guardrail"
          title="Page Object Model"
          intro="A page object keeps locators and page-level behaviour in one place, so a change to the interface is a change in one file."
        >
          <CodeBlock code={POM} filename="pages/LoginPage.ts" verdict="preferred" />
          <Grid>
            <Panel tone="good" title="What it buys">
              <Bullets
                marker="check"
                items={[
                  'Maintainability: one place to change when the UI changes',
                  'Reuse across specs without copy-paste',
                  'Readability: specs describe intent, not selectors',
                  'Central locator management, which makes the locator policy enforceable',
                ]}
              />
            </Panel>
            <Panel tone="bad" title="How it goes wrong">
              <Bullets
                marker="cross"
                items={[
                  'Page objects that absorb assertions and become the test',
                  'Giant methods that combine several unrelated flows',
                  'Abstraction over one-line calls that adds indirection without saving anything',
                  'A class per screen even where the screen has no meaningful behaviour',
                ]}
              />
            </Panel>
          </Grid>
          <CodeBlock code={POM_TOO_MUCH} verdict="avoid" language="typescript" />
          <Callout variant="principle">
            <p>
              A page object should not become a dumping ground for every possible action. Keep page
              abstractions meaningful and maintainable: if a method cannot be named after a single
              user intention, it is probably two methods.
            </p>
          </Callout>
        </Section>

        <Section
          id="flaky"
          kicker="Guardrail"
          title="Flaky test management"
          intro="A flaky test is a test that produces inconsistent results without a relevant change to the application or the test logic - it passes on one run and fails on the next, with nothing in between."
        >
          <SubSection title="Where flakiness usually comes from">
            <Bullets
              columns={2}
              items={[
                'Timing and synchronisation - fixed waits, or asserting before the state is reached',
                'Unstable locators that match different elements at different times',
                'Shared test data modified by another test or another run',
                'Environment instability: deployments, restarts, slow responses',
                'External dependencies that are not under the test’s control',
                'Race conditions in the application itself',
                'Order dependency between tests',
              ]}
            />
          </SubSection>

          <SubSection title="The process I would follow">
            <FlowDiagram
              orientation="horizontal"
              steps={[
                { title: 'Detect' },
                { title: 'Reproduce' },
                { title: 'Investigate' },
                { title: 'Identify root cause' },
                { title: 'Fix' },
                { title: 'Monitor' },
              ]}
              caption="Detection needs history: a single red run is an incident, a pattern across runs is a flaky test."
            />
            <P>
              Reproduction is usually the hard part. Repeat runs, running the single test in
              isolation, running it under load and comparing traces between a passing and a failing
              run are the techniques that tend to pay off.
            </P>
          </SubSection>

          <Callout variant="caution" label="On retries">
            <p>
              Retries are a legitimate tool for absorbing genuine infrastructure noise in CI, and
              this project configures one retry there. They are not a fix. A test that only passes
              on retry is still telling you something - about the test, the application or the
              environment - and a suite that relies on retries slowly stops being evidence of
              anything.
            </p>
            <p>
              Do not simply retry flaky tests indefinitely and call the problem solved. Track which
              tests pass only on retry, and treat that list as work.
            </p>
          </Callout>
        </Section>

        <Section
          id="ci"
          kicker="Integration"
          title="CI/CD integration"
          intro="Automation provides value when it is integrated into the development workflow rather than executed manually before a release."
        >
          <FlowDiagram
            orientation="horizontal"
            steps={[
              { title: 'Developer commit' },
              { title: 'Build' },
              { title: 'Unit tests' },
              { title: 'Integration / API tests' },
              { title: 'UI regression tests' },
              { title: 'Report' },
              { title: 'Feedback' },
            ]}
          />
          <Bullets
            items={[
              'Order stages so the cheapest, fastest checks fail first',
              'Keep the pull-request suite short enough that people wait for it; run the broader suite on a schedule or before release',
              'Publish reports and traces as build artifacts, so a failure can be investigated without re-running anything',
              'Make the pipeline the normal way tests run - a suite that only runs on someone’s laptop decays',
            ]}
          />
          <ClaimLine claim="decision">
            Which suite runs at which stage, and what blocks a merge, is a decision for the team and
            its stakeholders - it depends on release cadence, risk appetite and pipeline capacity.
          </ClaimLine>
        </Section>

        <Section
          id="debugging"
          kicker="Operations"
          title="Debugging a CI failure"
          intro="A red pipeline is a question, not a verdict."
        >
          <FlowDiagram
            numbered
            steps={[
              { title: 'Identify the failing test', detail: 'Which test, which project, which run.' },
              { title: 'Inspect the logs', detail: 'Error message, stack, surrounding output.' },
              { title: 'Inspect trace, video and screenshots', detail: 'What the browser actually did.' },
              { title: 'Reproduce', detail: 'Locally, then against the same environment as CI.' },
              { title: 'Categorise the failure', detail: 'See the table below.' },
              { title: 'Fix the root cause', detail: 'In the application, the test, the data or the environment.' },
              { title: 'Re-run and confirm', detail: 'Including repeated runs for suspected flakiness.' },
              { title: 'Monitor', detail: 'Watch the same test over subsequent runs.' },
            ]}
          />
          <DataTable
            caption="Categorising failures is also what makes failure data useful later - counting red runs says much less than knowing what kind of red they were."
            headers={['Category', 'Typical signal', 'Who fixes it']}
            firstColumnHeader
            rows={[
              ['Application defect', 'Reproducible, consistent, matches a recent change', 'The development team'],
              ['Test defect', 'Wrong expectation, brittle locator, missing synchronisation', 'The test author or owner'],
              ['Environment issue', 'Multiple unrelated tests fail together; service unavailable', 'Platform or environment owner'],
              ['Test data issue', 'Passes in one environment, fails in another; state left behind', 'The test owner, often with data ownership'],
              ['Infrastructure issue', 'Runner timeouts, browser crashes, network errors', 'Pipeline owner'],
            ]}
          />
          <Callout variant="caution">
            <p>
              Do not automatically assume &quot;the test failed, therefore the application is
              broken&quot; - nor the opposite, which is more common and more damaging: assuming the
              test is wrong and re-running until it passes.
            </p>
          </Callout>
        </Section>

        <Section
          id="diagnostics"
          kicker="Operations"
          title="Diagnostics"
          intro="Good automation should not only detect failure; it should help engineers understand why the failure occurred."
        >
          <DefinitionList
            items={[
              {
                term: 'Trace Viewer',
                description:
                  'A recorded timeline of the run: every action, DOM snapshots before and after, network activity and console output. The single most useful artifact for a failure that cannot be reproduced locally.',
              },
              {
                term: 'Screenshots',
                description:
                  'Captured on failure. Cheap, and often enough to identify an unexpected dialog, an error banner or an empty page.',
              },
              {
                term: 'Video',
                description:
                  'Useful for timing-related failures and for flows where the final state does not explain what happened on the way there.',
              },
              {
                term: 'Console logs',
                description:
                  'Application errors that a screenshot cannot show. Often the fastest route from a vague UI symptom to a concrete cause.',
              },
              {
                term: 'Network information',
                description:
                  'Which request failed, with what status and what payload - it separates a UI problem from a backend or data problem.',
              },
              {
                term: 'Test reports',
                description:
                  'The run as a whole: what failed, how long it took, which tests needed a retry. Published as a CI artifact so it survives the runner.',
              },
            ]}
          />
          <ClaimLine claim="recommendation">
            Configure diagnostics so that the first failure produces enough information to diagnose
            it. If the standard response to a red build is &quot;re-run it with tracing on&quot;,
            the configuration is wrong.
          </ClaimLine>
        </Section>
      </PageBody>
    </>
  );
}

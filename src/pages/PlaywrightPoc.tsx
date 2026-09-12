import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.tsx';
import Section, { SubSection } from '../components/Section.tsx';
import Callout from '../components/Callout.tsx';
import CodeBlock from '../components/CodeBlock.tsx';
import DataTable from '../components/DataTable.tsx';
import FlowDiagram from '../components/FlowDiagram.tsx';
import OnThisPage from '../components/OnThisPage.tsx';
import { ClaimLine } from '../components/Badge.tsx';
import { Bullets, Grid, PageBody, P, Panel } from '../components/Content.tsx';

const TOC = [
  { id: 'demo-app', label: 'The application under test' },
  { id: 'suite', label: 'What the suite covers' },
  { id: 'code', label: 'How it is put together' },
  { id: 'config', label: 'Configuration decisions' },
  { id: 'ci', label: 'The pipeline' },
  { id: 'run', label: 'Running it yourself' },
  { id: 'limits', label: 'What it deliberately does not do' },
];

const PAGE_OBJECT = `export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await this.page.goto('/demo/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}`;

const FIXTURE = `export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  // ... the other page objects
  credentials: async ({}, use) => {
    await use(getCredentials());
  },
});`;

const SPEC = `test('invalid credentials are rejected with a visible error', async ({
  page, loginPage, dashboardPage,
}) => {
  const invalid = getInvalidCredentials();

  await loginPage.login(invalid.username, invalid.password);

  await expect(loginPage.errorMessage).toHaveText('Invalid username or password.');
  // The negative assertion matters as much as the positive one: a wrong
  // password must not result in a session.
  await expect(dashboardPage.heading).toBeHidden();
  await expect(page).toHaveURL(/\\/demo\\/login$/);
});`;

const API_SPEC = `test('filters by category', async ({ request }) => {
  const response = await request.get('/api/demo/catalog?category=Access');

  const body = (await response.json()) as CatalogResponse;
  expect(body.total).toBeGreaterThan(0);
  // Every returned record must match the filter, not just the first one.
  expect(body.items.every((item) => item.category === 'Access')).toBe(true);
});`;

const CREDENTIALS = `// A GitHub Actions secret that does not exist is injected as an empty
// string rather than left undefined, so blank is treated as "not configured".
function fromEnv(name: string): string | undefined {
  const value = process.env[name];
  return value !== undefined && value.trim().length > 0 ? value : undefined;
}

export function getCredentials(): TestCredentials {
  return {
    username: fromEnv('TEST_USERNAME') ?? DEMO_USERNAME,
    password: fromEnv('TEST_PASSWORD') ?? DEMO_PASSWORD,
  };
}`;

const COMMANDS = `npm install
npx playwright install chromium firefox

npm test            # the whole suite; builds and serves the app itself
npm run test:ui     # UI tests, Chromium only
npm run test:api    # API tests, no browser
npm run test:report # open the HTML report from the last run`;

export default function PlaywrightPoc() {
  return (
    <>
      <PageHeader
        eyebrow="Proof of concept"
        title="A small, real Playwright suite"
        lead="Written guidance is easy. This section is the working part: a Playwright suite that runs against a local demo application, applies the guardrails from this playbook, and runs in CI on every push."
      />

      <PageBody>
        <div className="pt-8">
          <OnThisPage items={TOC} />
        </div>

        <Section
          id="demo-app"
          kicker="System under test"
          title="The application under test"
          intro="A deliberately small demo application, served by the same dev server as this site."
        >
          <P>
            Using a local application rather than a public demo site is itself one of the decisions
            on display here: an external site can change or go down, and a suite that fails for
            those reasons teaches a team to distrust it.
          </P>
          <Grid>
            <Panel title="What it contains">
              <Bullets
                items={[
                  'A sign-in screen with client-side validation and a server-side check',
                  'A dashboard that requires a session',
                  'A registration form with four validation rules',
                  'A searchable, filterable list of fictional service requests',
                  'A small JSON API behind all of it',
                ]}
              />
            </Panel>
            <Panel title="Try it">
              <P>
                The demo app is part of this site. Sign in with the published placeholder
                credentials <code className="font-mono text-xs">demo.user / playbook-demo</code>.
              </P>
              <Link
                to="/demo/login"
                className="inline-block rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Open the demo application
              </Link>
            </Panel>
          </Grid>
          <Callout variant="note" label="On those credentials">
            <p>
              They are published placeholders for an application that holds nothing, so they are not
              secrets. The tests still read them from{' '}
              <code className="font-mono text-xs">TEST_USERNAME</code> and{' '}
              <code className="font-mono text-xs">TEST_PASSWORD</code>, because that is the shape a
              real project needs - and the fallback that makes this repository runnable is the one
              thing a real project should not copy.
            </p>
          </Callout>
        </Section>

        <Section
          id="suite"
          kicker="Coverage"
          title="What the suite covers"
          intro="Twelve UI tests across two browsers plus eight API tests - thirty-two executions in total."
        >
          <DataTable
            headers={['Spec', 'Level', 'What it verifies']}
            firstColumnHeader
            rows={[
              [
                'login.spec.ts',
                'UI',
                'A valid sign-in reaches the dashboard; invalid credentials produce a visible error and no session; an empty form reports both required fields',
              ],
              [
                'registration.spec.ts',
                'UI',
                'Every required field is reported; a malformed email is rejected while valid fields are not; an unchecked confirmation blocks submission; a complete submission is confirmed and the form resets',
              ],
              [
                'requests-search.spec.ts',
                'UI',
                'The unfiltered list loads; search by title and by id narrows it; the category filter combines with the search term; no matches shows an empty state rather than an empty table',
              ],
              [
                'demo-api.spec.ts',
                'API',
                'Catalog filtering by term and category, an empty result set for an unknown term, login success, 401 for bad credentials, 400 for a missing field, and a health check',
              ],
            ]}
          />
          <ClaimLine claim="recommendation">
            The negative cases are the point. A suite that only proves the happy path works is the
            most common way to have coverage and no confidence.
          </ClaimLine>
        </Section>

        <Section
          id="code"
          kicker="Structure"
          title="How it is put together"
          intro="Page objects for locators and page-level actions, fixtures for setup, specs that read as behaviour."
        >
          <SubSection title="A page object">
            <CodeBlock code={PAGE_OBJECT} filename="playwright/pages/LoginPage.ts" />
            <P>
              Role- and label-based locators throughout. The one exception in this suite is a
              validation message addressed by the id that the input references with
              aria-describedby - an explicit contract, documented as such in the file.
            </P>
          </SubSection>

          <SubSection title="Fixtures">
            <CodeBlock code={FIXTURE} filename="playwright/fixtures/test.ts" />
            <P>
              There is deliberately no automatic sign-in fixture. In a suite this small it would
              hide more than it saves; in a larger one, a stored authenticated state would be the
              obvious next step.
            </P>
          </SubSection>

          <SubSection title="A UI test">
            <CodeBlock code={SPEC} filename="tests/ui/login.spec.ts" />
          </SubSection>

          <SubSection title="An API test">
            <CodeBlock code={API_SPEC} filename="tests/api/demo-api.spec.ts" />
            <P>
              API tests run in their own project with no browser. They are faster, steadier, and
              when they fail they point at the service rather than at a screen.
            </P>
          </SubSection>

          <SubSection title="Credentials from the environment">
            <CodeBlock code={CREDENTIALS} filename="playwright/utils/config.ts" />
          </SubSection>
        </Section>

        <Section
          id="config"
          kicker="Configuration"
          title="Configuration decisions"
          intro="Each setting in playwright.config.ts carries a comment explaining why it has that value. The ones worth arguing about:"
        >
          <DataTable
            headers={['Setting', 'Value here', 'Reasoning']}
            firstColumnHeader
            rows={[
              [
                'retries',
                '1 in CI, 0 locally',
                'One retry absorbs genuine infrastructure noise; zero locally keeps flakiness visible while writing tests. Any test that passes only on retry is treated as an open issue rather than a success.',
              ],
              [
                'workers',
                '2 in CI, default locally',
                'A fixed count makes CI runs comparable instead of varying with the runner size.',
              ],
              [
                'trace',
                'on-first-retry',
                'Full diagnostics for the run that matters, without recording traces for every green run.',
              ],
              [
                'screenshot / video',
                'only-on-failure / retain-on-failure',
                'Enough to investigate a CI failure without re-running it; nothing kept for passing runs.',
              ],
              [
                'projects',
                'api, chromium, firefox',
                'API tests separated so they run without a browser. WebKit is left out on purpose: the browser matrix should follow the browsers the application supports and the time the pipeline can afford.',
              ],
              [
                'webServer',
                'npm run build && npm run preview',
                'The suite starts the application itself, so a clean checkout can run the tests with one command.',
              ],
              [
                'fullyParallel',
                'true',
                'Only safe because the tests are independent - which is a guardrail, not an accident.',
              ],
            ]}
          />
        </Section>

        <Section
          id="ci"
          kicker="Pipeline"
          title="The pipeline"
          intro="A GitHub Actions workflow runs on every push and pull request to main."
        >
          <FlowDiagram
            orientation="horizontal"
            steps={[
              { title: 'Checkout' },
              { title: 'Install Node' },
              { title: 'Install dependencies' },
              { title: 'Type check' },
              { title: 'Install browsers' },
              { title: 'Run tests' },
              { title: 'Upload report' },
            ]}
            caption=".github/workflows/playwright.yml"
          />
          <Bullets
            items={[
              'The type check runs before the browsers are installed, so an obvious mistake fails in seconds rather than minutes',
              'Only the two browsers the suite uses are installed',
              'The HTML report is uploaded whether the run passed or failed; traces, screenshots and videos are uploaded on failure',
              'Credentials come from the repository secret store as environment variables - nothing sensitive is in the repository',
            ]}
          />
          <ClaimLine claim="decision">
            Which suites block a merge, and how often the broader suite runs, is a team decision.
            This repository runs everything on every push because it is small enough to afford it.
          </ClaimLine>
        </Section>

        <Section id="run" kicker="Reproducibility" title="Running it yourself">
          <CodeBlock code={COMMANDS} language="bash" filename="terminal" />
          <P>
            The suite builds the application and serves it before running, so no server has to be
            started by hand. Locally an already-running preview server is reused; in CI a fresh one
            is always started.
          </P>
        </Section>

        <Section
          id="limits"
          kicker="Honesty"
          title="What it deliberately does not do"
          intro="A proof of concept that pretends to be a production framework is a worse demonstration, not a better one."
        >
          <Bullets
            marker="cross"
            items={[
              'No stored authentication state - useful in a real suite, unnecessary in one this size',
              'No visual regression testing, which needs a stable rendering environment to be worth anything',
              'No sharding or parallel infrastructure tuning: there is not enough here to need it',
              'No test management or defect tracker integration, which would be organisation-specific',
              'No accessibility scanning in the suite, although the locator strategy leans on the accessibility tree',
              'No performance assertions, which would need a realistic environment to mean anything',
            ]}
          />
          <Callout variant="note">
            <p>
              Each of these is a reasonable next step for a real project. Building them here would
              add lines of code without adding evidence of judgement, which is what this section is
              for.
            </p>
          </Callout>
        </Section>
      </PageBody>
    </>
  );
}

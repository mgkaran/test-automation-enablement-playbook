# Automation Guardrails

> Personal proof-of-concept. These are defaults with reasons attached, not rules handed down. A team
> should be able to tell from the reasoning when departing from one is justified.

## Locator policy

Prefer user-facing or explicitly stable locators.

```typescript
// Preferred - role and accessible name: what a user perceives.
page.getByRole('button', { name: 'Login' });

// Also useful - form fields by their label.
page.getByLabel('Username');

// Also useful - an explicit contract between the application and its tests.
page.getByTestId('login-button');

// Avoid where possible - generated or styling-derived class names.
page.locator('.btn-83927');
```

Dynamic CSS classes change for reasons that have nothing to do with behaviour, so the test breaks
without the application being wrong.

Order of preference: role, then label, then test id. Deep CSS or XPath chains as a documented
exception - for example a third-party component that exposes nothing else.

A useful side effect: role-based locators only work when the application is reasonably accessible.
When a test cannot find an element by role, that is often worth raising with the team.

## Waiting and synchronisation

```typescript
// Avoid
await page.waitForTimeout(3000);

// Prefer - synchronise with meaningful application state
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
```

A fixed wait is simultaneously too long on a fast run and too short on a slow one: it makes the
suite slower and still lets it fail unpredictably. The rare legitimate timed wait - a delay that is
part of the behaviour under test - should carry a comment explaining it.

## Assertion policy

```typescript
// Good
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

// Weak - passes whether or not login worked
await page.getByRole('button', { name: 'Login' }).click();
await page.waitForTimeout(2000);
```

An action without meaningful verification does not provide sufficient confidence.

- Assert the state a user would check, not an internal implementation detail.
- Prefer a few precise assertions over many shallow ones.
- Make failure messages self-explanatory; the reader is often not the author.
- Assert negative cases too - an error that should appear, and a state that should not.

## Test independence

Tests should ideally be independently executable, avoid unnecessary ordering dependencies, manage
their own required state, use controlled test data and clean up appropriately.

```typescript
// Avoid - test 2 only passes if test 1 ran first
test('creates a request', async ({ page }) => { /* creates REQ-2001 */ });
test('closes the request', async ({ page }) => {
  await page.goto('/requests/REQ-2001'); // created by the test above
});

// Prefer - each test creates the state it needs, then cleans up
test('closes a request', async ({ page, request }) => {
  const created = await createRequest(request, { title: 'Closable request' });
  await page.goto('/requests/' + created.id);
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByText('Status: Closed')).toBeVisible();
  await deleteRequest(request, created.id);
});
```

Setting up state through an API is usually faster and more reliable than driving the UI for it.

Some flows genuinely are sequential - a multi-step application process. Those can be one test with
several steps, rather than several tests that secretly depend on each other.

## Test data

- Do not hard-code credentials or sensitive values in test code.
- Read configuration from the environment, per target environment.
- Use dedicated test accounts and test data, never data belonging to real people.
- Avoid shared mutable state between tests and between runs.
- Keep data deterministic where possible.

```typescript
const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;

if (!username || !password) {
  throw new Error('TEST_USERNAME and TEST_PASSWORD must be set.');
}
```

Failing fast beats falling back to a default account - a silent fallback is how a suite ends up
pointing at the wrong environment.

## Secrets

**Never commit credentials, tokens, API keys or other secrets into source control.**

```typescript
process.env.TEST_USERNAME;
process.env.TEST_PASSWORD;
```

- Local development: an untracked `.env`, with a committed `.env.example` listing variable names only.
- CI: the pipeline secret store, injected as environment variables for the run.
- Never printed to logs or included in a published report or trace.
- A secret committed by accident is rotated; removing the commit is not enough.

In this repository the demo application uses published placeholder values that guard nothing. The
tests still read them from environment variables, because that is the shape a real project needs.

## Test structure

One maintainable structure could be:

```text
tests/            # the specs themselves, grouped by area
pages/            # page objects: locators and page-level actions
fixtures/         # shared setup: authenticated context, test data helpers
utils/            # small helpers that are not page-specific
test-data/        # static data files and builders
playwright.config.ts
```

| Directory | Responsibility |
| --- | --- |
| `tests/` | Specs that read as a description of behaviour, not a script of clicks. |
| `pages/` | Locators and page-level actions. No business assertions. |
| `fixtures/` | Reusable setup and teardown. |
| `utils/` | Small general helpers. A large utils folder is usually a missing abstraction. |
| `test-data/` | Static data and builders, so the values a test needs are visible. |
| `playwright.config.ts` | Environment, projects, reporters and diagnostics. |

This is not the only valid architecture, and a small suite does not need all of it on day one.

## Page Object Model

```typescript
export class LoginPage {
  constructor(private page: Page) {}

  username = this.page.getByLabel('Username');
  password = this.page.getByLabel('Password');
  loginButton = this.page.getByRole('button', { name: 'Login' });

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
```

Benefits: maintainability, reuse, readability and central locator management - the last of which is
what makes a locator policy enforceable.

A page object should not become a dumping ground for every possible action. Keep page abstractions
meaningful and maintainable: if a method cannot be named after a single user intention, it is
probably two methods. Watch for page objects that absorb assertions, giant methods combining
unrelated flows, and abstraction over one-line calls.

## Flaky test management

A flaky test produces inconsistent results without a relevant change to the application or the test
logic - it passes on one run and fails on the next.

Possible causes: timing and synchronisation, unstable locators, shared test data, environment
instability, external dependencies, race conditions in the application, order dependency.

```
Detect -> Reproduce -> Investigate -> Identify root cause -> Fix -> Monitor
```

Detection needs history: a single red run is an incident, a pattern across runs is a flaky test.
Reproduction is usually the hard part - repeat runs, running the test in isolation, running under
load, and comparing traces between a passing and a failing run.

**On retries.** Retries legitimately absorb genuine infrastructure noise in CI, and this project
configures one there. They are not a fix. A test that only passes on retry is still telling you
something, and a suite that relies on retries slowly stops being evidence of anything. Track which
tests pass only on retry and treat that list as work.

## CI/CD integration

```
Developer commit -> Build -> Unit tests -> Integration/API tests -> UI regression tests -> Report -> Feedback
```

- Order stages so the cheapest, fastest checks fail first.
- Keep the pull-request suite short enough that people wait for it.
- Publish reports and traces as build artifacts.
- Make the pipeline the normal way tests run; a suite that only runs on a laptop decays.

Which suite runs at which stage, and what blocks a merge, is a decision for the team and its
stakeholders.

## Debugging a CI failure

1. Identify the failing test.
2. Inspect the logs.
3. Inspect trace, video and screenshots.
4. Reproduce - locally, then against the same environment as CI.
5. Categorise the failure.
6. Fix the root cause.
7. Re-run and confirm.
8. Monitor over subsequent runs.

| Category | Typical signal | Who fixes it |
| --- | --- | --- |
| Application defect | Reproducible, consistent, matches a recent change | Development team |
| Test defect | Wrong expectation, brittle locator, missing synchronisation | Test owner |
| Environment issue | Several unrelated tests fail together | Environment owner |
| Test data issue | Passes in one environment, fails in another | Test owner / data owner |
| Infrastructure issue | Runner timeouts, browser crashes, network errors | Pipeline owner |

Do not assume "the test failed, therefore the application is broken" - nor the opposite, which is
more common: assuming the test is wrong and re-running until it passes.

## Diagnostics

Good automation should not only detect failure; it should help engineers understand why it occurred.

- **Trace viewer** - actions, DOM snapshots, network and console in one timeline.
- **Screenshots** - captured on failure; often enough to spot an unexpected dialog or error banner.
- **Video** - useful for timing-related failures.
- **Console logs** - application errors a screenshot cannot show.
- **Network information** - separates a UI problem from a backend or data problem.
- **Test reports** - the run as a whole, published as a CI artifact.

If the standard response to a red build is "re-run it with tracing on", the configuration is wrong.

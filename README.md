# Test Automation Enablement Playbook

**A practical approach to introducing, standardizing and scaling test automation across application
teams.**

A personal proof-of-concept: an interactive playbook describing how I would approach test automation
enablement, plus a small, real Playwright suite that applies the standards it describes.

---

## Why I built this

I built this after an interview for a test automation enablement role, as a way of setting out how I
would actually approach the work rather than describing it in a paragraph on a CV.

It is meant to show reasoning rather than volume - how I would:

- introduce **test automation** to a team that has little of it
- **enable** people so that they own the automation afterwards
- **select tools** on evidence instead of preference
- **train** a tester from context through to independent contribution
- define **standards** that help without becoming bureaucracy
- integrate automation into **CI/CD**
- prioritise by **risk** rather than by what is easy to automate

The single design constraint behind the whole project: **do not manufacture evidence.** No invented
maturity percentages, ROI figures, regression durations, test counts or tool scores. Where a number
would have to be fabricated, the project explains how to obtain a real one instead.

## Core philosophy

```
Understand -> Assess -> Define -> Pilot -> Enable -> Measure -> Scale
```

Statements throughout the site are labelled as **Evidence**, **Assumption**, **Recommendation** or
**Decision**, so a reader can always tell what is observed, what is assumed, what is advised, and
what stakeholders would decide.

## What it contains

| Section | Question it answers |
| --- | --- |
| **Enablement Approach** | How would I approach a team? Seven stages, plus what to automate, test levels, risk-based prioritisation, regulated environments and common failure modes. |
| **Automation Guardrails** | How would I keep quality up? Locators, synchronisation, assertions, independence, test data, secrets, structure, page objects, flaky tests, CI/CD and diagnostics. |
| **Team Enablement** | How would I enable people? Understanding the learner, building context, ten guided topics, and the transition to independence. |
| **Tool Evaluation** | How would I choose technology? Ten criteria, a decision process, and why scoring tools out of 100 is misleading. |
| **Case Study** | How would I apply it? A clearly labelled hypothetical team, worked through end to end. |
| **Playwright POC** | Can I actually implement it? A real suite against a local demo application. |

The same content is available as Markdown in [`docs/`](./docs).

## Technical stack

- **React** + **TypeScript** - typed components, same language as the test suite
- **Vite** - fast builds and a preview server the tests run against
- **Tailwind CSS** - a small, consistent design system without a component library
- **Playwright** - UI and API tests in one framework
- **GitHub Actions** - type checking and the full suite on every push

## Getting started

```bash
npm install
npx playwright install chromium firefox

npm run dev        # http://localhost:5173
npm run build      # type check + production build
npm run preview    # serve the production build on :4173
```

## Testing

The demonstration suite runs against a local demo application that is part of this project (a sign-in
screen, a dashboard, a registration form, a searchable request list and a small JSON API). Using a
local target rather than a public demo site is deliberate: an external site can change or go down,
and a suite that fails for those reasons teaches a team to distrust it.

```bash
npm test             # whole suite; builds and serves the app itself
npm run test:ui      # UI tests, Chromium only
npm run test:api     # API tests, no browser
npm run test:headed  # watch the UI tests run
npm run test:report  # open the HTML report from the last run
```

**What is covered** - 12 UI tests across Chromium and Firefox, plus 8 API tests:

| Spec | Level | Verifies |
| --- | --- | --- |
| `tests/ui/login.spec.ts` | UI | Valid sign-in reaches the dashboard; invalid credentials produce a visible error and no session; an empty form reports both required fields |
| `tests/ui/registration.spec.ts` | UI | Required-field validation; malformed email rejected; unchecked confirmation blocks submission; a complete submission is confirmed and the form resets |
| `tests/ui/requests-search.spec.ts` | UI | Search by title and by id; category filter combined with a search term; an empty state instead of an empty table |
| `tests/api/demo-api.spec.ts` | API | Catalog filtering, empty result sets, login success, 401 for bad credentials, 400 for a missing field, health check |

**How it is built** - page objects in `playwright/pages`, fixtures in `playwright/fixtures`,
environment configuration in `playwright/utils`. Locators are role- and label-based; the only
exception is a validation message addressed by the id its input references with `aria-describedby`,
documented in the file. Tests are independent and run in parallel.

## CI/CD

Two workflows. [`playwright.yml`](./.github/workflows/playwright.yml) tests every push and pull
request to `main`; [`deploy.yml`](./.github/workflows/deploy.yml) tests and publishes the hosted
build (see [Hosting](#hosting)).

[`.github/workflows/playwright.yml`](./.github/workflows/playwright.yml) runs on every push and pull
request to `main`, and can be triggered manually:

```
Checkout -> Install Node -> Install dependencies -> Type check ->
Install browsers -> Run tests -> Upload report and artifacts
```

- The type check runs before the browsers are installed, so an obvious mistake fails in seconds.
- Only the two browsers the suite uses are installed.
- The HTML report is uploaded whether the run passes or fails; traces, screenshots and videos are
  uploaded on failure.
- Credentials come from the repository secret store as environment variables.

## Hosting

The site is published to GitHub Pages as a project page:

**https://mgkaran.github.io/test-automation-enablement-playbook/**

[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) builds and deploys it on every push
to `main`. Three things differ between the local build and the published one, and each is a
deliberate decision:

| | Local / CI | Published |
| --- | --- | --- |
| Base path | served from `/` | served from `/test-automation-enablement-playbook/`, so the build sets `--base` and the router takes its `basename` from `import.meta.env.BASE_URL` |
| Demo endpoints | Vite middleware over HTTP | the same functions running in the browser, selected at build time by `VITE_DEMO_MODE=static` |
| Unknown routes | dev server SPA fallback | a copy of `index.html` published as `404.html` |

Two consequences worth stating plainly:

- A deep link such as `/approach` is served by `404.html`, so the page renders correctly but the
  HTTP status is 404. That is inherent to SPA routing on GitHub Pages.
- The published build is not byte-identical to the one the main suite exercises, so the deploy
  workflow runs the UI tests against the static build *before* publishing it. Testing one artifact
  and shipping another is how a green pipeline ends up protecting nothing.

The static mode is a build-time decision rather than a runtime fallback on purpose: a client that
quietly fell back to local data whenever a request failed would let a UI test pass while the real
API was broken - the silent fallback the test data guardrail warns about.

```bash
npm run build:pages    # production build for the sub-path, plus the 404.html fallback
npm run preview:pages  # serve it locally on :4173 under the same sub-path
```

## Design decisions

| Decision | Reasoning |
| --- | --- |
| Local demo app instead of a public demo site | Removes an external dependency that would make the suite unreliable for reasons unrelated to the code. |
| Demo API as Vite middleware | Same origin in `dev` and `preview`: no second process, no CORS configuration, no extra dependency. |
| `retries: 1` in CI, `0` locally | Absorbs genuine infrastructure noise in CI while keeping flakiness visible while writing tests. A test that passes only on retry is an open issue, not a pass. |
| `trace: 'on-first-retry'` | Full diagnostics for the run that matters, without recording traces for every green run. |
| Chromium and Firefox only | The browser matrix should follow what the application supports and what the pipeline can afford, not the full list by default. |
| Credentials via `TEST_USERNAME` / `TEST_PASSWORD` | The shape a real project needs. The demo values are published placeholders, and the fallback that makes this repo runnable is the one thing a real project should not copy. |
| No state management library, no UI kit | The site is a document. Adding either would be complexity for its own sake. |
| Qualitative tables instead of charts | There is no real data to chart. A decorative dashboard would contradict the point of the project. |

## Accessibility

Semantic HTML throughout, a skip link, keyboard-operable tabs following the WAI-ARIA authoring
practice (arrow keys, Home/End, roving tabindex), `<details>`-based accordions, visible focus states,
labelled form fields with `aria-describedby` error messages, live regions for dynamic results, and
responsive layouts from 375px upwards. Desktop is the primary experience, since this is a technical
document.

## What this project is **not**

- **Not** a KfW system, and not affiliated with KfW or any other organisation.
- **Not** based on confidential, internal or proprietary information of any company.
- **Not** a representation of any organisation's internal architecture, tooling or testing strategy.
- **Not** an assessment of any organisation's automation maturity.
- **Not** a claim to seniority. I have roughly two years of professional experience in software
  testing and automation; this is a demonstration of how I think and a way of learning in public.

The case study, the demo application and its data are fictional. The only credentials in this
repository are published placeholders for a demo application that holds no data.

## Future improvements

Deliberately not implemented - each only becomes meaningful with a real project behind it, and
building them without one would produce exactly the fabricated data this project avoids:

- Integrate real project data
- Connect a test management system so coverage can be traced to requirements
- Integrate a defect tracker such as Jira for failure triage
- Add real measured metrics with a documented collection method
- Pull execution history from CI/CD APIs to show reliability trends
- Role-based access, if the content ever became organisation-specific
- Team-specific configuration of the guardrails, with documented exceptions

## Repository

https://github.com/mgkaran/test-automation-enablement-playbook

The site footer links to the same repository.

## Licence

MIT. See [`LICENSE`](./LICENSE).

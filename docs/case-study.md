# Hypothetical Case Study

> **This case study is fictional.** There is no client, no project and no data behind it. It exists
> to show how the approach would be applied, not to report a result.

## Scenario

A product team maintains a modern web application. Regression testing is currently largely manual.
The team wants to introduce automation but has limited automation experience.

That is the whole brief, and it is roughly how these conversations start. Note what is missing: how
large the regression suite is, how often they release, what breaks, and what they have already
tried. Those are the first things to find out; inventing them here would defeat the purpose.

## Step 1 - Understand

Questions I would ask first:

- What application are we testing, and what is it for?
- What are the critical workflows, and which failures would hurt most?
- How is regression currently performed, by whom, and how long does it take?
- When does regression get skipped?
- What has broken in production or late in the cycle recently?
- What tools already exist - test management, CI, defect tracking?
- What skills exist in the team today?
- What does CI/CD look like, and what runs in it?
- How stable are the test environments, and who owns them?
- What are the major pain points, in the team's own words?

I would watch a regression cycle rather than only ask about it. The gap between the documented
process and the real one is usually where the useful information is.

## Step 2 - Assess

| What to establish | How | What it decides |
| --- | --- | --- |
| High-value regression candidates | Map workflows against business impact, change frequency, defect history | What goes into the pilot |
| Technical feasibility | Authentication, dynamic content, third-party components, test hooks | Whether UI automation is realistic, and where API tests are better |
| Team capability | Conversations and a short hands-on session | How much enablement time is needed |
| Maintenance risks | How often the interface changes; how much is generated markup | Locator strategy and level of abstraction |
| Environment dependencies | Environment stability, data refresh, external systems | Whether the pilot needs stubs or dedicated data |

What I would not produce is a maturity percentage. "The team is at developing level, because
regression is manual, automation exists only as individual scripts, and nothing runs in the
pipeline" is more accurate and more actionable than a number.

## Step 3 - Tool evaluation

Potential candidates: Playwright, Cypress, Selenium. None is universally superior.

Factors that would influence this decision:

- Which languages the team already writes, since they will maintain the tests
- Whether the application does anything a tool handles badly - multiple origins, unusual
  authentication, embedded content
- What the existing pipeline can run, and how much parallelism is available
- Diagnostics quality, because a team new to automation will need it constantly
- Whether existing automation would have to be migrated, and at what cost
- Organisational constraints on licensing, hosting and data handling

> **Hypothetical.** For a modern web application with strong TypeScript capability, Playwright may
> be a strong candidate to evaluate. This is a hypothesis requiring validation through a POC.

The tool is selected by the team and the responsible stakeholders on the evidence the POC produces.
If the POC contradicts the hypothesis, the hypothesis loses.

## Step 4 - Pilot design

**Objectives**

- Validate framework feasibility against this application
- Validate maintainability - can the team change a test three months later?
- Validate CI/CD integration end to end
- Validate reporting and debugging by investigating a real failure
- Identify training needs from what the team struggles with
- Gather team feedback and act on some of it visibly

**Success criteria** (qualitative on purpose - a numeric target invented before the pilot only
measures how good I am at guessing)

| Criterion | How it would be judged |
| --- | --- |
| Tests are reliable | Repeated runs on unchanged code produce the same result; a test that passes only on retry is an open issue |
| Tests are understandable | Someone who did not write a test can explain what it verifies |
| Failures are diagnosable | A failure can be categorised from CI artifacts without re-running the suite |
| Team members can modify tests | A team member adds a scenario and updates a page object unaided |
| Tests execute in CI/CD | The suite runs on every pull request and the result is visible |
| Maintenance is understood | The team can say who owns which tests and what happens when one fails |

## Step 5 - Measurement plan

A template, not a result. The baseline column must be filled in before the pilot starts.

| Measure | Baseline | After pilot | Why it is worth collecting |
| --- | --- | --- | --- |
| Regression cycle duration | _not yet measured_ | _not yet measured_ | The pain that started the conversation |
| Manual effort per release | _not yet measured_ | _not yet measured_ | Where the team's time actually goes |
| Critical workflows covered | _not yet measured_ | _not yet measured_ | Coverage of risk, not count of tests |
| Tests passing only on retry | _not yet measured_ | _not yet measured_ | Early warning that trust is eroding |
| Failure categories | _not yet measured_ | _not yet measured_ | Separates product defects from test and environment problems |
| Time to diagnose a failure | _not yet measured_ | _not yet measured_ | The real maintenance cost of the suite |

Cost and benefit should be measured using actual execution frequency, manual effort and maintenance
effort - not asserted in advance.

## What I would expect to be hard

- **Environment stability** - a shaky environment produces failures that look like flaky tests and
  consumes the pilot's credibility.
- **Test data** - shared or unrefreshed data is the most common reason a pilot passes locally and
  fails in the pipeline.
- **Time for the team to learn** - enablement competes with delivery commitments; if nobody is given
  time, the central team ends up writing the tests.
- **The first serious flaky test** - how it is handled sets the culture.
- **Scope pressure** - success invites a request to automate everything next quarter. That is the
  moment to return to risk-based prioritisation.

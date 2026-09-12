# Enablement Approach

> Personal proof-of-concept. Nothing in this document describes the systems, processes or data of
> any specific organisation. Examples are hypothetical unless stated otherwise.

Seven stages I would work through with a team. The order matters: most of the expensive mistakes in
test automation are made before the first test is written.

```
Understand -> Assess -> Define -> Pilot -> Enable -> Measure -> Scale
```

The stages overlap and repeat in practice. A pilot regularly changes the assessment; measurement
later changes the guardrails. What should not change is the order they are done in for the first
time.

## How claims are labelled

| Label | Meaning |
| --- | --- |
| Evidence | Information actually available from a project. |
| Assumption | A stated assumption used to make a hypothetical example concrete. |
| Recommendation | A reasoned recommendation based on available evidence. |
| Decision | A decision made by the responsible stakeholders after evaluation. |

No invented metrics appear in this playbook. Where a number would have to be fabricated, the method
for obtaining a real one is described instead.

## Stage 1 - Understand

Before recommending tools or automation, build an accurate picture of:

- Application architecture, application type and business purpose
- Critical business workflows, and where failure would hurt most
- The current testing process and how much of it is manual
- Existing automation, its condition, and who maintains it
- Release frequency and the CI/CD environment
- Test environments and their stability
- Test data: availability, refresh, constraints
- Team structure, team skills and current pain points

**Key principle:** do not prescribe a solution before understanding the problem.

Most of this stage is listening. The revealing questions tend to be uncomfortable ones: which part
of the release everybody dreads, which tests get skipped when time is short, and which failures
nobody can explain.

## Stage 2 - Assess

Assess across four dimensions:

- **Application** - web, API, mobile, desktop, legacy, distributed
- **Testing** - regression effort, stability, existing automation, manual effort, execution
  frequency, defect history, risk
- **Team** - testing experience, programming experience, automation and framework knowledge, CI/CD
  knowledge, willingness to adopt automation
- **Business** - criticality, risk, release frequency, regulatory constraints, customer impact

Classify maturity qualitatively rather than as a percentage:

| Level | Description |
| --- | --- |
| Initial | Testing largely manual and ad hoc; little or no automation, or none run regularly. |
| Developing | Some automation, often written by individuals; conventions vary; ownership unclear. |
| Established | Agreed conventions; runs in the pipeline; the team maintains and extends it. |
| Advanced | Coverage chosen by risk; failures diagnosed quickly; reliability monitored; approach revised. |

A maturity percentage implies a measurement the inputs do not support. A qualitative level agreed
against stated evidence is more honest and more useful - it can be discussed and disagreed with.

## Stage 3 - Define

Establish common principles and guardrails: framework conventions, locator strategy, test structure,
naming, assertion strategy, test data, environment management, authentication, secrets management,
API testing, reporting, logging, traceability, CI/CD integration, code review, ownership and
maintenance responsibility.

**Key principle:** standardize principles where consistency provides value, but avoid unnecessary
standardization that ignores application context.

A useful test for a candidate standard: does it make tests easier for another engineer to read,
maintain or diagnose? If it only makes things uniform, it belongs in a recommendation rather than a
rule. Details in [guardrails.md](./guardrails.md).

## Stage 4 - Pilot

**Start small, representative and high-value.**

A pilot answers several questions at once, only one of which is about the application:

- Does the slice represent important business flows?
- Is automating it technically feasible here?
- Is the framework a good fit for how this application behaves?
- Can the resulting tests be maintained by this team?
- Does the suite integrate into the existing pipeline?
- Which capability gaps appear when the team writes tests themselves?
- What does the team say after living with it for a few sprints?

> **Hypothetical example.** A team has a large regression suite and wants to introduce automation.
> Rather than automating everything immediately, I would select a small representative set of
> stable, high-risk and frequently executed tests.
>
> Numbers are deliberately omitted: how small the set should be depends on real execution frequency,
> real failure history and the real capacity of the team.

## Stage 5 - Enable

```
Assess learner -> Explain context -> Introduce framework -> Teach standards ->
Guided implementation -> Code review -> Independent implementation -> Continuous support
```

Training should not begin with tool syntax. Before the framework, a new automation engineer needs
answers to: what are we testing, why are we automating, what should stay manual, how does automation
fit into the SDLC, and who owns the tests. See [training.md](./training.md).

## Stage 6 - Measure

Select metrics that answer the questions the initiative was started to answer:

| Category | Candidate metrics | Question it answers |
| --- | --- | --- |
| Efficiency | Regression execution time; manual effort; automated execution time | Is the feedback loop getting shorter? |
| Coverage | Automated regression coverage; critical workflow coverage | Are the risks we care about covered? |
| Reliability | Flaky test rate; failure categorisation | Can the team trust a red result? |
| Quality | Defects found before release; escaped defects | Is automation catching problems earlier? |
| Maintainability | Maintenance effort; time to diagnose a failure | What is the suite costing to keep? |
| Adoption | Teams enabled; training completed; independent contributions | Is capability transferring? |

Capture a baseline before the pilot starts. Afterwards nobody can reconstruct how long regression
used to take.

## Stage 7 - Scale

Extend to more flows and teams only once the pilot is genuinely maintainable. Reuse templates and a
reference architecture, feed team feedback back into the guardrails, and keep ownership with the
application teams. Scaling an unreliable pilot multiplies the problem rather than the benefit.

## Deciding what to automate

| Usually good candidates | Often poor candidates |
| --- | --- |
| Repetitive regression checks | One-time checks |
| Stable functionality | Highly unstable requirements |
| High-risk business workflows | Exploratory testing |
| Frequently executed tests | Tests needing subjective human judgement |
| Data-driven scenarios | Anything whose maintenance cost exceeds its value |

**The objective is not maximum automation. The objective is appropriate automation.**

### Balance across test levels

Unit tests are the cheapest to run and keep; integration and API/service tests verify behaviour
close to the system; UI/E2E tests are the most expensive and the most fragile. Write a check at the
cheapest level that can answer the question honestly.

This is a conventional shape, not a mandatory ratio. The balance depends on the application
architecture and risk profile - a service-heavy system with a thin interface and a monolith with
complex screen logic will not have the same distribution.

### Risk-based prioritisation

Priority should consider business impact, probability of failure, execution frequency, regression
value, technical feasibility and maintenance effort.

|  | Low business impact | High business impact |
| --- | --- | --- |
| **High probability of failure** | Automate if cheap; otherwise fix the instability first | Automate first |
| **Low probability of failure** | Usually leave manual or drop | Automate for confidence, once stable |

Placing a workflow in a quadrant is a judgement. Make it with people who know the business impact,
and record it so it can be revisited against defect history.

## What can go wrong

- **Automating everything** - high maintenance and poor prioritisation.
- **Choosing tools before understanding needs** - technology-driven decisions.
- **Standards that are too rigid** - teams cannot adapt to application context.
- **Training without context** - people learn syntax but not good testing.
- **Measuring only test count** - more tests do not automatically mean more quality.
- **Ignoring flaky tests** - teams lose trust in automation.
- **The central team doing everything** - application teams never become autonomous.

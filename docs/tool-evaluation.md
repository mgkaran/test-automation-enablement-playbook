# Tool Evaluation Framework

> Personal proof-of-concept. No tool is scored, ranked or endorsed here. The point is the method.

**Tool selection is an engineering decision, not a popularity contest.**

## Evaluation criteria

| Criterion | The question it asks |
| --- | --- |
| Application fit | Does the tool support the application technology - browsers, frameworks, authentication, embedded content? |
| Team capability | Can this team learn and maintain it? |
| Existing ecosystem | Does it integrate with current tooling and languages? |
| CI/CD | Can it run reliably in the existing pipeline, in parallel, within the available time? |
| Debugging | What does it give you when a test fails in CI at 3am? |
| Maintainability | Does it encourage structures that stay readable as the suite grows? |
| Scalability | Can it support more tests, teams and environments? |
| Migration effort | What does moving from the existing solution cost? |
| Vendor/community support | Release cadence, documentation, answers to hard questions, contractual support. |
| Security/compliance | Data handling, credential handling, licensing, dependency policy, self-hosting. |

Agree up front which criteria are knock-out conditions and which are trade-offs. A tool that fails a
knock-out criterion does not get compensated by being pleasant to write.

## Why not a score out of 100

A weighted scorecard looks objective and usually is not. It hides the weights - which is where the
judgement actually lives - it implies that 86 and 84 are distinguishable given the input quality, it
lets a knock-out criterion be outvoted by several minor ones, and it erases who disagreed and why.

Publishing "Playwright: 86%" implies a measurement. Without a defined methodology and real input
data, that number is an opinion wearing a lab coat, and it is much harder to argue with than the
opinion would have been.

Instead, produce:

- A statement per criterion: does this candidate satisfy it, with what evidence
- The open risks, and what the POC would need to show
- An explicit recommendation with its reasoning
- The decision, recorded with its date and the people who made it

## The decision process

```
Understand context -> Define evaluation criteria -> Shortlist candidates -> Build small POC ->
Evaluate evidence -> Discuss with stakeholders -> Select tool -> Monitor outcome
```

A tool should not be selected because it is modern, because it is popular, or because it worked
somewhere else with a different application and a different team.

The selection itself is made by the responsible stakeholders. The enablement function supplies
evidence, a recommendation and the trade-offs.

## Comparing candidates

For a modern web application, Playwright, Cypress and Selenium are all plausible starting
candidates. The characteristics below are commonly cited and should be re-checked against the
current version and your own application before they influence a decision.

| Candidate | Commonly cited strengths | Questions I would want answered |
| --- | --- | --- |
| Playwright | Single API across Chromium, Firefox and WebKit; first-class TypeScript; auto-waiting; trace viewer; built-in parallelism | Does the team have the TypeScript capability to maintain it? How does it handle this application's authentication and unusual components? |
| Cypress | Strong developer experience and interactive runner; large plugin ecosystem; well-established documentation | Do its architectural constraints matter here - multiple tabs or origins? How does the licensing of hosted services fit the organisation? |
| Selenium | W3C WebDriver standard; broadest language and browser support; mature grid infrastructure; very widely known | How much scaffolding must we build ourselves - waiting, reporting, diagnostics? Does existing in-house experience outweigh that effort? |

None of these is universally superior. If an existing suite already works and the team can maintain
it, migration has to earn its cost; "the current tool is older" is not a reason on its own.

## Designing the proof of concept

The POC exists to convert opinions into evidence, so it has to be designed to be able to fail.

**Build:** the same two or three representative flows in each candidate, including the awkward part
of the application; running in the real pipeline against a real environment; written by someone from
the team; and deliberately broken once, to see what the failure output actually tells you.

**Record:** where each candidate satisfied or failed a criterion and with what evidence; how long it
took a team member to become productive; what had to be built by hand; and what remains uncertain
afterwards.

> **Hypothetical.** For a modern web application with strong TypeScript capability in the team,
> Playwright may be a strong candidate to evaluate. This is a hypothesis requiring validation
> through a POC - not a conclusion, and not transferable to a different application or team.

# Team Enablement and Training

> Personal proof-of-concept. A description of how I would enable a tester new to automation, not a
> record of a real training programme.

Training that starts with tool syntax produces people who can write scripts. The goal is people who
can decide what is worth automating, write tests others can maintain, and diagnose their own
failures.

```
Assess learner -> Explain context -> Introduce framework -> Teach standards ->
Guided implementation -> Code review -> Independent implementation -> Continuous support
```

Before the framework, the learner needs answers to: what are we testing, why are we automating it,
what should stay manual, how does this fit into the delivery process, and who owns the tests.

## A. Understand the learner

| Area | What I would find out | What it changes |
| --- | --- | --- |
| Testing knowledge | How they decide what to test, how they think about risk | Time spent on test design vs tooling |
| Programming knowledge | Comfort with functions, types, async code, reading errors | Pace, and how much we abstract at first |
| Application knowledge | Which workflows they already understand deeply | Which flow we automate first together |
| Automation experience | What they have used, and what frustrated them | Which habits to build on |
| Git knowledge | Branching, pull requests, resolving a conflict | Whether version control needs its own session |
| CI/CD knowledge | What happens after a merge; reading a pipeline | When to introduce the pipeline |

Ask people to show something they have tested rather than describe their experience level. It is
faster, more accurate, and it starts the relationship on their territory.

## B. Build context

- **The product** - what it does, who depends on it, which failures would matter most.
- **The testing approach** - current strategy, automation objectives, what is deliberately not
  automated and why.
- **The setup** - framework architecture, conventions, team responsibilities, how work is reviewed.

Teaching the framework first is faster in week one and slower by month three. The expensive mistakes
- automating the wrong things, in the wrong place, at the wrong level - come from missing context,
not missing API knowledge.

## C. Guided learning

Ten topics, in this order, taught against the real application rather than a tutorial project:

1. **Test structure** - arrange/act/assert, one intention per test, titles that describe behaviour.
2. **Locators** - role, label and test id; why generated CSS classes are a trap.
3. **Assertions** - web-first assertions, choosing the outcome worth asserting, useful failure
   messages.
4. **Test data** - where data comes from, why shared mutable data causes intermittent failures,
   setup and cleanup.
5. **Page Objects** - what belongs in one and what does not.
6. **Fixtures** - reusable setup, and the trade-off with hidden preconditions.
7. **API testing** - verifying behaviour below the interface, and arranging state for UI tests.
8. **Debugging** - traces, screenshots, video, console and network; reproducing a CI failure.
9. **CI/CD** - how the suite is triggered, what blocks a merge, where artifacts live.
10. **Reporting** - reading a report, categorising a failure, reporting it usefully.

Each topic ends with something committed: a test, a page object, a fixture, a fixed flaky test.

## D. Transition to independence

```
Guided -> Pairing -> Review -> Independent -> Support
```

| Stage | Who holds the keyboard | What tells me we can move on |
| --- | --- | --- |
| Guided | Me, explaining as I go | They can predict what I am about to do and why |
| Pairing | Them, with me alongside | Questions become design questions, not syntax questions |
| Review | Them, with me reviewing PRs | Review comments become discussions, not corrections |
| Independent | Them | They add tests and fix failures without escalating |
| Support | Them, with me reachable | They arrive with a hypothesis, not just a red build |

Enablement succeeds when the team can maintain, extend and explain the automation themselves -
including deciding to delete a test that no longer earns its place.

## Ownership and governance

**Central enablement team**

- Provides standards and a reference architecture
- Provides templates and reusable building blocks
- Supports and coaches teams
- Evaluates tools and runs proofs of concept
- Maintains shared guidance and keeps it current

**Application teams**

- Own their tests
- Understand their domain and its risks
- Maintain application-specific automation
- Participate in reviews
- Provide feedback that changes the standards

**Key principle:** enablement should increase team autonomy rather than create permanent dependency
on a central team.

Signs it is working: teams add tests without asking first; teams diagnose their own failures before
escalating; standards change because a team pushed back with a good reason; the central team spends
more time on tooling and coaching than on writing tests.

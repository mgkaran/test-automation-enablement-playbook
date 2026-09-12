# Enablement in a Regulated Environment

> **This document describes general principles only.** It does not describe the controls, policies,
> architecture or processes of any specific organisation, and it is not compliance advice. I have no
> inside knowledge of any bank's or regulator's internal requirements, and nothing here should be
> read as claiming otherwise.

Software that carries regulatory or financial weight changes what "good enough" means for test
automation. It does not change the fundamentals - it raises the cost of getting them wrong.

## Risk

Critical business functionality requires strong confidence. In practice that usually means deeper
verification of fewer, more important flows rather than broad shallow coverage, and a deliberate
decision about what confidence each test actually provides.

## Traceability

A chain from requirement to test to execution to evidence to defect. Automation helps here, but only
if test intent is documented, results are retained, and a test can be connected to the requirement
it covers. Traceability that exists only in someone's head is not traceability.

## Security

Credentials and sensitive data must be protected in test code, test data and pipeline configuration,
not only in production systems. Test data drawn from production is a common shortcut and a common
problem; anonymisation has to be real, not nominal.

## Auditability

Relevant testing evidence may need to be reproducible and traceable to a specific version of the
application and of the tests. That has practical consequences: retention of reports and artifacts,
pinned dependency versions, and pipelines whose behaviour can be reconstructed later.

## Reliability

Automation used as evidence has to be reliable itself. A suite that needs three attempts to pass is
weak evidence of anything, and a flaky test in this context is not just an annoyance - it undermines
the artifact that is supposed to demonstrate diligence.

## Change management

Changes to critical automation infrastructure - shared frameworks, pipelines, environments - should
be controlled like other production-adjacent changes: reviewed, versioned and reversible.

## Separation of responsibilities

Depending on organisational policy, development, testing and approval responsibilities may need
appropriate separation. This affects who can approve a change to a test, who can approve a release
on the basis of test results, and how those approvals are recorded.

## The limit of what I can say

The exact controls depend on the organisation's regulatory, security, architecture and governance
requirements. In a real role I would expect to learn them from the people responsible for them -
risk, compliance, security and architecture - rather than assume them from general principles.

What I would bring to that conversation is the technical side: what automation can and cannot
evidence, what it costs to make test results auditable, and where a control would be better served
by a change in how tests are built than by a process wrapped around them.

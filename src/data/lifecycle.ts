export interface LifecycleStage {
  id: string;
  title: string;
  question: string;
  summary: string;
  activities: string[];
  principle: string;
}

/**
 * The seven stages used throughout the playbook. The stages are a sequence for
 * a first introduction, not a one-way gate: assessment and measurement feed
 * back into the earlier stages as a team learns more.
 */
export const LIFECYCLE: LifecycleStage[] = [
  {
    id: 'understand',
    title: 'Understand',
    question: 'What are we actually dealing with?',
    summary:
      'Build a picture of the application, the release process, the current testing practice and the team before proposing anything.',
    activities: [
      'Application architecture, application type and business purpose',
      'Critical business workflows and where failure would hurt most',
      'How testing is done today, and how much of it is manual',
      'Existing automation, its condition and who maintains it',
      'Release frequency, CI/CD environment and test environments',
      'Test data availability and constraints',
      'Team structure, team skills and current pain points',
    ],
    principle: 'Do not prescribe a solution before understanding the problem.',
  },
  {
    id: 'assess',
    title: 'Assess',
    question: 'Where does the team stand, and what is worth doing first?',
    summary:
      'Turn observations into a shared, qualitative assessment of the application, the testing practice, the team and the business context.',
    activities: [
      'Application: web, API, mobile, desktop, legacy or distributed',
      'Testing: regression effort, stability, defect history, execution frequency',
      'Team: testing, programming, framework and CI/CD experience, and appetite for automation',
      'Business: criticality, risk, release frequency, regulatory constraints, customer impact',
      'Agree a qualitative level - initial, developing, established or advanced - with stakeholders',
    ],
    principle:
      'Classify maturity qualitatively against defined evidence. An invented percentage adds precision that the input data does not support.',
  },
  {
    id: 'define',
    title: 'Define',
    question: 'What should be consistent across teams?',
    summary:
      'Agree the guardrails: conventions, locator strategy, test data handling, secrets, reporting, CI/CD integration, review and ownership.',
    activities: [
      'Framework conventions, test structure and naming',
      'Locator strategy and assertion strategy',
      'Test data, environment, authentication and secrets handling',
      'API testing, reporting, logging and traceability',
      'CI/CD integration, code review, ownership and maintenance responsibility',
    ],
    principle:
      'Standardize principles where consistency provides value, but avoid unnecessary standardization that ignores application context.',
  },
  {
    id: 'pilot',
    title: 'Pilot',
    question: 'Does this work here, on something that matters?',
    summary:
      'Automate a small, representative, high-value slice first and use it to test the framework, the pipeline and the team - not just the application.',
    activities: [
      'Select stable, high-risk, frequently executed flows',
      'Validate technical feasibility and framework suitability',
      'Validate maintainability and diagnosability of failures',
      'Validate CI/CD integration end to end',
      'Identify capability gaps and gather team feedback',
    ],
    principle: 'Start small, representative and high-value.',
  },
  {
    id: 'enable',
    title: 'Enable',
    question: 'Can the team do this without me?',
    summary:
      'Teach context before syntax, then move the team from guided work to independent contribution with review and support.',
    activities: [
      'Assess the learner, then explain product and testing context',
      'Introduce the framework and the agreed standards',
      'Guided implementation, then pairing and code review',
      'Independent implementation with continuing support',
    ],
    principle:
      'Enablement should increase team autonomy rather than create permanent dependency on a central team.',
  },
  {
    id: 'measure',
    title: 'Measure',
    question: 'Is this actually helping?',
    summary:
      'Select a small number of metrics that answer the questions the initiative was started to answer, and collect them from real projects.',
    activities: [
      'Decide what question each metric answers before collecting it',
      'Efficiency, coverage, reliability, quality, maintainability and adoption',
      'Categorise failures instead of counting them only',
      'Review metrics with the team and adjust the approach',
    ],
    principle:
      'Metrics should be selected based on the purpose of the automation initiative - and measured, not estimated.',
  },
  {
    id: 'scale',
    title: 'Scale',
    question: 'How does this survive contact with more teams?',
    summary:
      'Extend to further teams and flows only once the pilot is maintainable, and keep improving the guardrails with what each team learns.',
    activities: [
      'Extend coverage from the pilot slice outward, by risk',
      'Reuse templates, reference architecture and shared guidance',
      'Feed team feedback back into the standards',
      'Keep ownership with application teams',
    ],
    principle:
      'Scaling an unreliable or unmaintainable pilot multiplies the problem rather than the benefit.',
  },
];

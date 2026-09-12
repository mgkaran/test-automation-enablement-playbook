/**
 * Data for the local demonstration application.
 *
 * This is fictional sample data for a throw-away demo app whose only purpose is
 * to give the Playwright demonstration something deterministic to test against.
 * It does not represent any real organisation, system or dataset.
 */

export type RequestStatus = 'Open' | 'In review' | 'Closed';

export interface ServiceRequest {
  id: string;
  title: string;
  category: string;
  status: RequestStatus;
  owner: string;
}

export const CATEGORIES = ['Access', 'Reporting', 'Onboarding', 'Maintenance'] as const;

export const SERVICE_REQUESTS: ServiceRequest[] = [
  { id: 'REQ-1001', title: 'Grant read access to reporting workspace', category: 'Access', status: 'Open', owner: 'Team Alpha' },
  { id: 'REQ-1002', title: 'Monthly reconciliation report fails to export', category: 'Reporting', status: 'In review', owner: 'Team Beta' },
  { id: 'REQ-1003', title: 'Onboard new colleague to shared mailbox', category: 'Onboarding', status: 'Closed', owner: 'Team Alpha' },
  { id: 'REQ-1004', title: 'Scheduled maintenance window for demo cluster', category: 'Maintenance', status: 'Open', owner: 'Platform' },
  { id: 'REQ-1005', title: 'Revoke access for leaving colleague', category: 'Access', status: 'Closed', owner: 'Team Gamma' },
  { id: 'REQ-1006', title: 'Add quarterly summary to reporting dashboard', category: 'Reporting', status: 'Open', owner: 'Team Beta' },
  { id: 'REQ-1007', title: 'Onboarding checklist needs updated links', category: 'Onboarding', status: 'In review', owner: 'Team Gamma' },
  { id: 'REQ-1008', title: 'Database patch rollout for demo environment', category: 'Maintenance', status: 'Closed', owner: 'Platform' },
];

/**
 * Credentials for the local demo application.
 *
 * These are deliberately public, hard-coded placeholder values for a demo app
 * that holds no data. They are NOT secrets and are not treated as such anywhere
 * in this repository. Real projects must read credentials from a secret store or
 * environment configuration - see the "Test data" and "Secrets" guardrails.
 */
export const DEMO_CREDENTIALS = {
  username: 'demo.user',
  password: 'playbook-demo',
  displayName: 'Demo User',
} as const;

export interface CatalogQuery {
  q?: string;
  category?: string;
}

export function filterRequests(items: ServiceRequest[], query: CatalogQuery): ServiceRequest[] {
  const term = (query.q ?? '').trim().toLowerCase();
  const category = query.category ?? 'All';
  return items.filter((item) => {
    const matchesTerm =
      term.length === 0 ||
      item.title.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term);
    const matchesCategory = category === 'All' || item.category === category;
    return matchesTerm && matchesCategory;
  });
}

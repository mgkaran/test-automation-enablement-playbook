import type { Locator, Page } from '@playwright/test';

/** The searchable list of service requests. */
export class RequestsPage {
  readonly heading: Locator;
  readonly search: Locator;
  readonly category: Locator;
  readonly resultCount: Locator;
  readonly emptyState: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Service requests' });
    this.search = page.getByLabel('Search requests');
    this.category = page.getByLabel('Category');
    this.resultCount = page.getByTestId('result-count');
    this.emptyState = page.getByText('No requests match your search.');
    // Body rows only: the header row lives in <thead>.
    this.rows = page.locator('tbody tr');
  }

  async goto(): Promise<void> {
    await this.page.goto('/demo/requests');
  }

  async searchFor(term: string): Promise<void> {
    await this.search.fill(term);
  }

  async filterByCategory(category: string): Promise<void> {
    await this.category.selectOption(category);
  }
}

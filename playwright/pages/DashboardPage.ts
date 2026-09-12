import type { Locator, Page } from '@playwright/test';

/** The screen a signed-in user lands on. */
export class DashboardPage {
  readonly heading: Locator;
  readonly signedInUser: Locator;
  readonly signOutButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.signedInUser = page.getByTestId('signed-in-user');
    this.signOutButton = page.getByRole('button', { name: 'Sign out' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/demo/dashboard');
  }
}

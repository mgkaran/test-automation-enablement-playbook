import type { Locator, Page } from '@playwright/test';

/**
 * The sign-in screen of the demo application.
 *
 * Locators are user-facing (role and label) so they describe what a person
 * would look for, and they stay valid when the markup changes.
 */
export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await this.page.goto('demo/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  /**
   * Field-level validation message. The id is the same one the input points at
   * with aria-describedby, so it is an explicit contract rather than incidental
   * markup - the documented exception to the role-first locator policy.
   */
  fieldError(field: 'username' | 'password'): Locator {
    return this.page.locator(`#${field}-error`);
  }
}

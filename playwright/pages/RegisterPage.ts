import type { Locator, Page } from '@playwright/test';

export interface RegistrationDetails {
  fullName: string;
  email: string;
  department: string;
  confirm: boolean;
}

/** The registration form of the demo application. */
export class RegisterPage {
  readonly fullName: Locator;
  readonly email: Locator;
  readonly department: Locator;
  readonly confirmation: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(private readonly page: Page) {
    this.fullName = page.getByLabel('Full name');
    this.email = page.getByLabel('Email address');
    this.department = page.getByLabel('Department');
    this.confirmation = page.getByLabel(/I confirm that this is demo data/);
    this.submitButton = page.getByRole('button', { name: 'Submit registration' });
    this.successMessage = page.getByRole('status');
  }

  async goto(): Promise<void> {
    await this.page.goto('demo/register');
  }

  async fill(details: Partial<RegistrationDetails>): Promise<void> {
    if (details.fullName !== undefined) await this.fullName.fill(details.fullName);
    if (details.email !== undefined) await this.email.fill(details.email);
    if (details.department !== undefined) await this.department.selectOption(details.department);
    if (details.confirm) await this.confirmation.check();
  }

  /** Validation message for a field, via the id referenced by aria-describedby. */
  fieldError(field: 'fullName' | 'email' | 'department' | 'confirmed'): Locator {
    return this.page.locator(`#${field}-error`);
  }
}

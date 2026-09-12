import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.ts';
import { DashboardPage } from '../pages/DashboardPage.ts';
import { RegisterPage } from '../pages/RegisterPage.ts';
import { RequestsPage } from '../pages/RequestsPage.ts';
import { getCredentials, type TestCredentials } from '../utils/config.ts';

/**
 * Fixtures for the demonstration suite.
 *
 * They provide page objects and credentials so that specs do not repeat
 * construction boilerplate. Deliberately no automatic sign-in fixture here: the
 * suite is small, and hiding authentication would make the login tests harder
 * to read than they need to be. In a larger suite, a stored authenticated state
 * would be the obvious next addition.
 */
interface Fixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  registerPage: RegisterPage;
  requestsPage: RequestsPage;
  credentials: TestCredentials;
}

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  requestsPage: async ({ page }, use) => {
    await use(new RequestsPage(page));
  },
  credentials: async ({}, use) => {
    await use(getCredentials());
  },
});

export { expect } from '@playwright/test';

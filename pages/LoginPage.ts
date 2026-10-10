/// <reference types="node" />

import { expect, type Locator, type Page } from '@playwright/test';

function requireEnvironmentVariable(name: 'BASE_URL' | 'TEST_USERNAME'): string {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const LOGIN_URL = requireEnvironmentVariable('BASE_URL');
const SUCCESS_URL = /\/logged-in-successfully\//;
const SUCCESS_MESSAGE = `Congratulations ${requireEnvironmentVariable('TEST_USERNAME')}. You successfully logged in!`;

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.errorMessage = page.locator('#error');
    this.successMessage = page.getByText(SUCCESS_MESSAGE, { exact: true });
    this.logoutLink = page.getByRole('link', { name: 'Log out', exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto(LOGIN_URL);
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async expectEmptyForm(): Promise<void> {
    await expect(this.usernameInput).toHaveValue('');
    await expect(this.passwordInput).toHaveValue('');
  }

  async expectErrorNotShown(): Promise<void> {
    await expect(this.errorMessage).not.toHaveClass(/show/);
  }

  async expectRejectedLogin(expectedError: string): Promise<void> {
    await expect(this.page).not.toHaveURL(SUCCESS_URL);
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.errorMessage).toHaveClass(/show/);
    await expect(this.errorMessage).toHaveText(expectedError);
  }

  async expectSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(SUCCESS_URL);
    await expect(this.successMessage).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
  }
}

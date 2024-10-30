import { Page, Locator } from '@playwright/test';

export class SignInPage {
    private page: Page;
    private emailInput: Locator;
    private passwordInput: Locator;
    private signInButton: Locator;

    constructor (page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[id="username"]');
        this.passwordInput = page.locator('input[id="password"]');
        this.signInButton = page.locator('button[id="loginBtn"]');
    }

    // Method to navigate to the Login page
    async navigate(url: string) {
        await this.page.goto(url);
    }

    // Method to perform login action
    async signIn(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

    // Method to check if error messages are displayed
    async getErrorMessage() {
        const errorMessage = this.page.locator('.error-message');
        return await errorMessage.textContent();
    }
}
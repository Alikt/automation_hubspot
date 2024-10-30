import { Page, Locator } from '@playwright/test';

export class CRMPages {

    private page: Page;
    private crmPageButton;
    private contactsPageButton: Locator;
    private searchInput: Locator;
    private searchButton: Locator;
    private deleteButton: Locator;
    private deleteValue: Locator;
    private confirmDeleteButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.crmPageButton = page.locator('button:has-text("CRM")');
        this.contactsPageButton = page.locator('a:has-text("Contacts")');
        this.searchInput = page.locator('[data-test-id="crm-object-table-search-bar"]');
        this.searchButton = page.locator('button[aria-label="Search"]');
        this.deleteButton = page.locator('[data-test-id="bulk-actions-dropdown"]');
        this.deleteValue = page.locator('[data-test-id="delete-dialog-match"]');
        this.confirmDeleteButton = page.locator('[data-test-id="delete-dialog-confirm-button"]');
    }



    async navigateToContacts() {
        await this.crmPageButton.hover();
        await this.contactsPageButton.click();
        await this.page.waitForLoadState('networkidle');

    }

    async searchContact(contactEmail: string) {
        await this.searchInput.fill(contactEmail);
        await this.page.waitForLoadState('networkidle');
    }


    async selectContact(contactID: string) {
        await this.page.waitForTimeout(2000);
        const contactToSelect = this.page.locator(`[data-test-id="checkbox-select-row-${contactID}"]`);
        await contactToSelect.click();
    }

    async deleteSelectedContact() {
        await this.deleteButton.click();
        await this.searchInput.fill("1");
        await this.confirmDeleteButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}

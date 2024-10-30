import { test, expect, } from '@playwright/test';
import {HubSpotAPI} from "../utils/HubSpotAPI";
import fs from 'fs';
import {CRMPages} from "../pages/CRMPages";
import 'dotenv/config';

test.describe('Add/Remove contacts', () => {

    let newContactName: String;
    let newContactID: String;
    let hubSpotAPI: HubSpotAPI;
    newContactName = 'new.contact.' + new Date().getTime() + '@gmail.com';

    test.beforeEach(async ({ page }) => {

        // Load cookies from a file after login
        const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
        await page.context().addCookies(cookies);

        // Create a new contact
        const newContact = await new HubSpotAPI().post('/crm/v3/objects/contacts/', {
            properties: {
                email: newContactName,
                firstname: 'New',
                lastname: 'Contact'
            }
        });
        // Assert new created contact
        expect(newContact.id).toBeTruthy();
        console.log('New Contact: ', newContact);
        newContactID = newContact.id;


        // Navigate to a page that requires authentication
        await page.goto(process.env.BASE_SITE_URL + '/home');

        // Wait for a successful login indicator
        await page.waitForURL(process.env.BASE_SITE_URL + '/user-guide/47899083?via=home');


    });

    test('Delete new contact manually', async ({ page }) => {

        const contactPage = new CRMPages(page);

        // Navigate to Contacts page
        await contactPage.navigateToContacts();

        // Search for the contact
        await contactPage.searchContact(newContactName);

        // Select the contact checkbox
        await contactPage.selectContact(newContactID);

        // Delete the selected contact
        await contactPage.deleteSelectedContact();

        // Verification steps
        await contactPage.searchContact(newContactName);
        const contactExists = await page.locator(`text=${newContactName}`).isVisible();
        if (!contactExists) {
            console.log('Contact was successfully deleted.');
        } else {
            console.log('Contact deletion failed.');
        }
    });



    test('Delete new created contact by API', async ({ page }) => {

        hubSpotAPI = new HubSpotAPI();

        // Delete the contact
        await hubSpotAPI.delete('/crm/v3/objects/contacts/' + newContactID);

        // Verify the contact was deleted
        try {
            await hubSpotAPI.getByContactId('/crm/v3/objects/contacts/' + newContactID);
            console.log('Contact still exists (unexpected)');
        } catch (error) {
            if (error.message.includes('Status: 404')) {
                console.log('Contact successfully deleted and not found (expected)');
            } else {
                console.error('Unexpected error:', error);
            }
        }
    });
});



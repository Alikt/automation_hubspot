import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'tests',
    use: {
        headless: true, // Change to false for headed mode
    },
});
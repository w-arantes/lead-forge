import { test, expect } from '@playwright/test';

test.describe('Lead Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to load
    await page.waitForSelector('[data-testid="dashboard-tabs"]');
  });

  test('should display leads table with initial data', async ({ page }) => {
    // Navigate to leads tab
    await page.click('[data-testid="tab-leads"]');
    
    // Verify leads table is visible
    await expect(page.locator('[data-testid="leads-table"]')).toBeVisible();
    
    // Check if initial leads are loaded (expect at least 1 lead)
    const leadRows = page.locator('[data-testid="leads-table"] tbody tr');
    const count = await leadRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should add a new lead successfully', async ({ page }) => {
    // Navigate to leads tab
    await page.click('[data-testid="tab-leads"]');
    
    // Click add lead button
    await page.click('[data-testid="add-lead-button"]');
    
        // Fill the form
    await page.fill('[data-testid="name-input"]', 'Test Lead E2E');
    await page.fill('[data-testid="company-input"]', 'Test Company E2E');
    await page.fill('[data-testid="email-input"]', 'test@e2e.com');
    await page.selectOption('[data-testid="source-select"]', 'Website');
    await page.fill('[data-testid="score-input"]', '85');
    await page.selectOption('[data-testid="status-select"]', 'New');

    // Submit the form
    await page.click('[data-testid="submit-button"]');

    // Verify success message
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();

    // Verify lead appears in table
    await expect(page.locator('text=Test Lead E2E')).toBeVisible();
  });

  test('should edit lead inline successfully', async ({ page }) => {
    // Navigate to leads tab
    await page.click('[data-testid="tab-leads"]');
    
    // Click on first lead row to open detail panel
    await page.click('[data-testid="leads-table"] tbody tr:first-child');
    
    // Wait for detail panel
    await expect(page.locator('[data-testid="lead-detail-panel"]')).toBeVisible();
    
    // Click edit button to activate editing mode
    await page.click('[data-testid="edit-lead-button"]');
    
    // Edit the email
    await page.fill('[data-testid="email-input"]', 'newemail@techcorp.com');
    
    // Save the changes
    await page.click('[data-testid="save-lead-button"]');
    
    // Verify update
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
  });

  test('should convert lead to opportunity', async ({ page }) => {
    // Navigate to leads tab
    await page.click('[data-testid="tab-leads"]');
    
    // Click on first lead row to open detail panel
    await page.click('[data-testid="leads-table"] tbody tr:first-child');
    
    // Wait for detail panel
    await expect(page.locator('[data-testid="lead-detail-panel"]')).toBeVisible();
    
    // Click convert button
    await page.click('[data-testid="convert-button"]');
    
    // Fill amount
    await page.fill('[data-testid="amount-input"]', '50000');
    
    // Confirm conversion
    await page.click('[data-testid="convert-button"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    
    // Navigate to opportunities tab
    await page.click('[data-testid="tab-opportunities"]');
    
    // Verify opportunity appears
    await expect(page.locator('[data-testid="opportunities-table"]')).toContainText('Paige Knight');
  });

  test('should filter leads by status', async ({ page }) => {
    // Navigate to leads tab
    await page.click('[data-testid="tab-leads"]');
    
        // Select status filter
    await page.selectOption('[data-testid="status-filter"]', 'Hot');

    // Verify filtered results - expect at least 1 hot lead
    const rows = page.locator('[data-testid="leads-table"] tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should search leads by name', async ({ page }) => {
    // Navigate to leads tab
    await page.click('[data-testid="tab-leads"]');
    
        // Search for a specific lead
    await page.fill('[data-testid="search-input"]', 'Sarah');

    // Verify search results - expect at least 1 result
    const rows = page.locator('[data-testid="leads-table"] tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

    test('should export leads to CSV', async ({ page }) => {
    // Navigate to leads tab
    await page.click('[data-testid="tab-leads"]');

    // Click export button - this should trigger direct download
    await page.click('[data-testid="export-button"]');

    // Verify success message
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
  });
});

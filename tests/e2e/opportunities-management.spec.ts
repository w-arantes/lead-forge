import { test, expect } from '@playwright/test';

test.describe('Opportunities Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="dashboard-tabs"]');
  });

  test('should display opportunities table', async ({ page }) => {
    // Navigate to opportunities tab
    await page.click('[data-testid="tab-opportunities"]');
    
    // Check if opportunities exist or show "no opportunities" message
    const opportunitiesTable = page.locator('[data-testid="opportunities-table"]');
    const noOpportunitiesMessage = page.locator('text=No opportunities yet');
    
    // Either the table is visible or the "no opportunities" message is shown
    await expect(opportunitiesTable.or(noOpportunitiesMessage)).toBeVisible();
  });

    test('should view opportunity details', async ({ page }) => {
    // Navigate to opportunities tab
    await page.click('[data-testid="tab-opportunities"]');

    // Check if there are opportunities or show "no opportunities" message
    const opportunitiesTable = page.locator('[data-testid="opportunities-table"]');
    const noOpportunitiesMessage = page.locator('text=No opportunities yet');
    
    if (await opportunitiesTable.isVisible()) {
      // Click on first opportunity row
      await page.click('[data-testid="opportunities-table"] tbody tr:first-child');
      // Verify detail panel is visible
      await expect(page.locator('[data-testid="opportunity-detail-panel"]')).toBeVisible();
    } else {
      // Verify "no opportunities" message is shown
      await expect(noOpportunitiesMessage).toBeVisible();
    }
  });

    test('should update opportunity stage', async ({ page }) => {
    // Navigate to opportunities tab
    await page.click('[data-testid="tab-opportunities"]');

    // Check if there are opportunities or show "no opportunities" message
    const opportunitiesTable = page.locator('[data-testid="opportunities-table"]');
    const noOpportunitiesMessage = page.locator('text=No opportunities yet');
    
    if (await opportunitiesTable.isVisible()) {
      // Click on first opportunity row
      await page.click('[data-testid="opportunities-table"] tbody tr:first-child');
      // Wait for detail panel
      await expect(page.locator('[data-testid="opportunity-detail-panel"]')).toBeVisible();
      // Update stage
      await page.selectOption('[data-testid="stage-select"]', 'Qualification');
      // Verify update
      await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    } else {
      // Verify "no opportunities" message is shown
      await expect(noOpportunitiesMessage).toBeVisible();
    }
  });

    test('should update opportunity amount', async ({ page }) => {
    // Navigate to opportunities tab
    await page.click('[data-testid="tab-opportunities"]');

    // Check if there are opportunities or show "no opportunities" message
    const opportunitiesTable = page.locator('[data-testid="opportunities-table"]');
    const noOpportunitiesMessage = page.locator('text=No opportunities yet');
    
    if (await opportunitiesTable.isVisible()) {
      // Click on first opportunity row
      await page.click('[data-testid="opportunities-table"] tbody tr:first-child');
      // Wait for detail panel
      await expect(page.locator('[data-testid="opportunity-detail-panel"]')).toBeVisible();
      // Update amount
      await page.fill('[data-testid="amount-input"]', '75000');
      await page.press('[data-testid="amount-input"]', 'Enter');
      // Verify update
      await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    } else {
      // Verify "no opportunities" message is shown
      await expect(noOpportunitiesMessage).toBeVisible();
    }
  });

    test('should filter opportunities by stage', async ({ page }) => {
    // Navigate to opportunities tab
    await page.click('[data-testid="tab-opportunities"]');

    // Check if there are opportunities or show "no opportunities" message
    const opportunitiesTable = page.locator('[data-testid="opportunities-table"]');
    const noOpportunitiesMessage = page.locator('text=No opportunities yet');
    
    if (await opportunitiesTable.isVisible()) {
      // Select stage filter
      await page.selectOption('[data-testid="stage-filter"]', 'Prospecting');
      // Verify filtered results
      const rows = page.locator('[data-testid="opportunities-table"] tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    } else {
      // Verify "no opportunities" message is shown
      await expect(noOpportunitiesMessage).toBeVisible();
    }
  });

    test('should search opportunities by name', async ({ page }) => {
    // Navigate to opportunities tab
    await page.click('[data-testid="tab-opportunities"]');

    // Check if there are opportunities or show "no opportunities" message
    const opportunitiesTable = page.locator('[data-testid="opportunities-table"]');
    const noOpportunitiesMessage = page.locator('text=No opportunities yet');
    
    if (await opportunitiesTable.isVisible()) {
      // Search for a specific opportunity
      await page.fill('[data-testid="search-input"]', 'Tech Corp');
      // Verify search results
      const rows = page.locator('[data-testid="opportunities-table"] tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    } else {
      // Verify "no opportunities" message is shown
      await expect(noOpportunitiesMessage).toBeVisible();
    }
  });

    test('should export opportunities to CSV', async ({ page }) => {
    // Navigate to opportunities tab
    await page.click('[data-testid="tab-opportunities"]');

    // Click export button - this should trigger direct download
    await page.click('[data-testid="export-button"]');

    // Verify success message
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
  });
});

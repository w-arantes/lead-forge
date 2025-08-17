import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="dashboard-tabs"]');
  });

  test('should load dashboard with all tabs', async ({ page }) => {
    // Verify dashboard tabs are visible
    await expect(page.locator('[data-testid="dashboard-tabs"]')).toBeVisible();
    
    // Check all tabs are present
    await expect(page.locator('[data-testid="tab-leads"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-opportunities"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-analytics"]')).toBeVisible();
  });

  test('should navigate between tabs successfully', async ({ page }) => {
    // Start on leads tab
    await expect(page.locator('[data-testid="tab-leads"]')).toHaveClass(/border-primary/);
    
    // Navigate to opportunities
    await page.click('[data-testid="tab-opportunities"]');
    await expect(page.locator('[data-testid="tab-opportunities"]')).toHaveClass(/border-primary/);
    
    // Check if opportunities exist or show "no opportunities" message
    const opportunitiesTable = page.locator('[data-testid="opportunities-table"]');
    const noOpportunitiesMessage = page.locator('text=No opportunities yet');
    await expect(opportunitiesTable.or(noOpportunitiesMessage)).toBeVisible();
    
    // Navigate to analytics
    await page.click('[data-testid="tab-analytics"]');
    await expect(page.locator('[data-testid="tab-analytics"]')).toHaveClass(/border-primary/);
    await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible();
    
    // Navigate back to leads
    await page.click('[data-testid="tab-leads"]');
    await expect(page.locator('[data-testid="tab-leads"]')).toHaveClass(/border-primary/);
    await expect(page.locator('[data-testid="leads-table"]')).toBeVisible();
  });

  test('should display stats cards correctly', async ({ page }) => {
    // Navigate to analytics tab
    await page.click('[data-testid="tab-analytics"]');
    
    // Verify stats cards are visible
    await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible();
    
    // Check individual stats
    await expect(page.locator('[data-testid="total-leads"]')).toBeVisible();
    await expect(page.locator('[data-testid="qualified-leads"]')).toBeVisible();
    await expect(page.locator('[data-testid="hot-leads"]')).toBeVisible();
    await expect(page.locator('[data-testid="converted"]')).toBeVisible();
    await expect(page.locator('[data-testid="conversion-rate"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-value"]')).toBeVisible();
  });

  test('should toggle theme successfully', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();
    
    // Click theme toggle to open dropdown
    await themeToggle.click();
    
    // Click on Dark theme option
    await page.click('text=Dark');
    
    // Verify theme change (check for dark mode class or attribute)
    await expect(page.locator('html')).toHaveAttribute('class', /dark/);
    
    // Toggle back to Light theme
    await themeToggle.click();
    await page.click('text=Light');
    await expect(page.locator('html')).not.toHaveAttribute('class', /dark/);
  });

  test('should handle responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="dashboard-tabs"]')).toBeVisible();
    
    // Navigate between tabs on mobile
    await page.click('[data-testid="tab-opportunities"]');
    
    // Check if opportunities exist or show "no opportunities" message
    const opportunitiesTable = page.locator('[data-testid="opportunities-table"]');
    const noOpportunitiesMessage = page.locator('text=No opportunities yet');
    await expect(opportunitiesTable.or(noOpportunitiesMessage)).toBeVisible();
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should persist theme preference', async ({ page }) => {
    // Set dark theme
    await page.click('[data-testid="theme-toggle"]');
    await page.click('text=Dark');
    await expect(page.locator('html')).toHaveAttribute('class', /dark/);
    
    // Reload page
    await page.reload();
    await page.waitForSelector('[data-testid="dashboard-tabs"]');
    
    // Verify theme persists
    await expect(page.locator('html')).toHaveAttribute('class', /dark/);
  });

  test('should display header with logo', async ({ page }) => {
    // Verify header is visible
    await expect(page.locator('[data-testid="header"]')).toBeVisible();
    
    // Check logo is present
    await expect(page.locator('[data-testid="logo"]')).toBeVisible();
    
    // Verify header content - check for the specific Lead Forge heading
    await expect(page.locator('h1:has-text("Lead Forge")')).toBeVisible();
  });

  test('should handle data loading states', async ({ page }) => {
    // Navigate to leads tab
    await page.click('[data-testid="tab-leads"]');
    
    // Verify table loads without skeleton
    await expect(page.locator('[data-testid="leads-table"]')).toBeVisible();
    await expect(page.locator('[data-testid="table-skeleton"]')).not.toBeVisible();
  });
});

import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  async waitForAppLoad() {
    await this.page.waitForSelector('[data-testid="dashboard-tabs"]');
  }

  async navigateToTab(tabName: 'leads' | 'opportunities' | 'analytics') {
    await this.page.click(`[data-testid="tab-${tabName}"]`);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForToast(type: 'success' | 'error' | 'warning' = 'success') {
    await this.page.waitForSelector(`[data-testid="toast-${type}"]`);
  }

  async verifyToastMessage(expectedMessage: string, type: 'success' | 'error' | 'warning' = 'success') {
    const toast = this.page.locator(`[data-testid="toast-${type}"]`);
    await expect(toast).toContainText(expectedMessage);
  }

  async fillLeadForm(data: {
    name: string;
    company: string;
    email: string;
    source: string;
    score: string;
    status: string;
  }) {
    await this.page.fill('[data-testid="name-input"]', data.name);
    await this.page.fill('[data-testid="company-input"]', data.company);
    await this.page.fill('[data-testid="email-input"]', data.email);
    await this.page.selectOption('[data-testid="source-select"]', data.source);
    await this.page.fill('[data-testid="score-input"]', data.score);
    await this.page.selectOption('[data-testid="status-select"]', data.status);
  }

  async submitLeadForm() {
    await this.page.click('[data-testid="submit-button"]');
    await this.waitForToast('success');
  }

  async openLeadDetailPanel(leadIndex: number = 0) {
    const leadRow = this.page.locator('[data-testid="leads-table"] tbody tr').nth(leadIndex);
    await leadRow.click();
    await this.page.waitForSelector('[data-testid="lead-detail-panel"]');
  }

  async openOpportunityDetailPanel(opportunityIndex: number = 0) {
    const opportunityRow = this.page.locator('[data-testid="opportunities-table"] tbody tr').nth(opportunityIndex);
    await opportunityRow.click();
    await this.page.waitForSelector('[data-testid="opportunity-detail-panel"]');
  }

  async convertLeadToOpportunity(amount: string) {
    await this.page.click('[data-testid="convert-button"]');
    await this.page.fill('[data-testid="amount-input"]', amount);
    await this.page.click('[data-testid="confirm-convert"]');
    await this.waitForToast('success');
  }

  async searchAndFilter(searchTerm: string, filterType?: 'status' | 'source' | 'stage') {
    if (searchTerm) {
      await this.page.fill('[data-testid="search-input"]', searchTerm);
    }
    
    if (filterType) {
      const filterValue = filterType === 'status' ? 'Hot' : 
                         filterType === 'source' ? 'Website' : 'Prospecting';
      await this.page.selectOption(`[data-testid="${filterType}-filter"]`, filterValue);
    }
  }

  async exportData() {
    await this.page.click('[data-testid="export-button"]');
    await this.page.waitForSelector('[data-testid="export-modal"]');
    await this.page.click('[data-testid="confirm-export"]');
    await this.waitForToast('success');
  }

  async toggleTheme() {
    await this.page.click('[data-testid="theme-toggle"]');
    // Wait a bit for theme transition
    await this.page.waitForTimeout(100);
  }

  async verifyTheme(isDark: boolean) {
    if (isDark) {
      await expect(this.page.locator('html')).toHaveAttribute('class', /dark/);
    } else {
      await expect(this.page.locator('html')).not.toHaveAttribute('class', /dark/);
    }
  }

  async setMobileViewport() {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async setDesktopViewport() {
    await this.page.setViewportSize({ width: 1280, height: 720 });
  }

  async waitForTableData(tableSelector: string, expectedRowCount?: number) {
    await this.page.waitForSelector(tableSelector);
    
    if (expectedRowCount !== undefined) {
      const rows = this.page.locator(`${tableSelector} tbody tr`);
      await expect(rows).toHaveCount(expectedRowCount);
    }
  }
}

# Lead Forge E2E Testing

This directory contains end-to-end tests for the Lead Forge application using Playwright.

## 🚀 Quick Start

### Prerequisites
- Node.js 22.12.0+ (use `nvm use node`)
- Yarn package manager

### Running Tests

```bash
# Run all E2E tests
yarn test:e2e

# Run tests with UI mode (interactive)
yarn test:e2e:ui

# Run tests in headed mode (see browser)
yarn test:e2e:headed

# Run tests in debug mode
yarn test:e2e:debug
```

## 📁 Test Structure

### Core Test Files

- **`lead-management.spec.ts`** - Lead CRUD operations, conversion, filtering, and export
- **`opportunities-management.spec.ts`** - Opportunity management, stage updates, and filtering
- **`dashboard-navigation.spec.ts`** - Navigation, theme switching, responsive design

### Utilities

- **`utils/test-helpers.ts`** - Common test operations and assertions

## 🧪 Test Coverage

### Lead Management
- ✅ Display leads table with initial data
- ✅ Add new lead successfully
- ✅ Edit lead inline
- ✅ Convert lead to opportunity
- ✅ Filter leads by status
- ✅ Search leads by name
- ✅ Export leads to CSV

### Opportunities Management
- ✅ Display opportunities table
- ✅ View opportunity details
- ✅ Update opportunity stage
- ✅ Update opportunity amount
- ✅ Filter opportunities by stage
- ✅ Search opportunities by name
- ✅ Export opportunities to CSV

### Dashboard & Navigation
- ✅ Load dashboard with all tabs
- ✅ Navigate between tabs
- ✅ Display stats cards
- ✅ Toggle theme
- ✅ Handle responsive design
- ✅ Persist theme preference
- ✅ Display header with logo
- ✅ Handle data loading states

## 🔧 Test Configuration

The tests are configured in `playwright.config.ts` with:

- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome
- **Base URL**: `http://localhost:5173`
- **Web Server**: Automatically starts `yarn dev`
- **Retries**: 2 retries in CI, 0 in development
- **Screenshots**: On failure
- **Traces**: On first retry

## 📱 Responsive Testing

Tests include mobile viewport testing to ensure the application works correctly across different screen sizes.

## 🎨 Theme Testing

Tests verify that:
- Theme toggle works correctly
- Theme preference persists across page reloads
- Both light and dark themes function properly

## 🚨 Error Handling

Tests verify proper error handling and user feedback:
- Success/error toast messages
- Form validation
- Data loading states
- Network error handling

## 🔍 Debugging

### UI Mode
```bash
yarn test:e2e:ui
```
Opens Playwright's interactive UI for debugging tests step by step.

### Debug Mode
```bash
yarn test:e2e:debug
```
Runs tests in headed mode with debugging enabled.

### Screenshots & Traces
- Screenshots are automatically captured on test failures
- Traces are generated on first retry for detailed debugging

## 📊 Test Reports

After running tests, HTML reports are generated in the `playwright-report/` directory:

```bash
# Open the latest report
npx playwright show-report
```

## 🧹 Best Practices

1. **Test Isolation**: Each test is independent and doesn't rely on other tests
2. **Data Test IDs**: Use `data-testid` attributes for reliable element selection
3. **Wait Strategies**: Use proper wait strategies instead of arbitrary timeouts
4. **Page Object Model**: Consider implementing POM for complex test scenarios
5. **Error Handling**: Test both happy path and error scenarios

## 🚀 CI/CD Integration

Tests are configured for CI environments:
- Reduced retries (2 instead of 0)
- Single worker for stability
- Automatic web server management
- Screenshot and trace capture

## 📝 Adding New Tests

When adding new tests:

1. Follow the existing naming convention
2. Use the `TestHelpers` class for common operations
3. Add appropriate `data-testid` attributes to components
4. Test both success and failure scenarios
5. Include responsive design testing where applicable

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure port 5173 is available
2. **Browser installation**: Run `npx playwright install` if browsers aren't installed
3. **Node version**: Use `nvm use node` for the correct Node.js version
4. **Dependencies**: Run `yarn install` to ensure all dependencies are installed

### Debug Commands

```bash
# Check Playwright installation
npx playwright --version

# Install browsers
npx playwright install

# Show available browsers
npx playwright install --help
```

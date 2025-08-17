# Lead Forge

> A modern, lightweight seller console for lead management and opportunity conversion

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-purple.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Lead Forge is a comprehensive lead management system built with modern web technologies. It provides a clean, accessible interface for sales teams to triage leads, track opportunities, and manage their sales pipeline effectively.

## 🎯 **MVP Status - 100% Complete** ✅

This project **fully implements** all MVP requirements from the code challenge:

### **Core Requirements Met**
- ✅ **Leads List**: Load from JSON, search/filter/sort, handle 100+ leads smoothly
- ✅ **Lead Detail Panel**: Slide-over with inline edit, email validation, save/cancel
- ✅ **Convert to Opportunity**: Button flow, opportunity creation, simple table display
- ✅ **UX/States**: Loading, empty, error states with smooth performance

### **Nice-to-Haves Implemented**
- ✅ **Filter/Sort Persistence**: localStorage persistence with Zustand
- ✅ **Responsive Layout**: Mobile-first design with desktop optimization

### **Tech Constraints Compliant**
- ✅ **React + Vite**: Modern React 19 with Vite build tool
- ✅ **Tailwind CSS**: Tailwind v4 with custom design system
- ✅ **No Backend**: Local JSON + localStorage persistence
- ✅ **Simulated Latency**: setTimeout for realistic API simulation

## ✨ Features

### 🎯 **Core Functionality**
- **Lead Management**: Comprehensive lead tracking with search, filtering, and sorting
- **Opportunity Conversion**: Seamlessly convert qualified leads to opportunities
- **Pipeline Tracking**: Monitor opportunities through different sales stages
- **Data Persistence**: Local storage with automatic data synchronization
- **Export Capabilities**: CSV export for leads and opportunities

### 🎨 **User Experience**
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark/Light Themes**: System preference detection with manual toggle
- **Accessibility**: WCAG AA compliant with keyboard navigation support
- **Real-time Updates**: Instant feedback and state synchronization
- **Smooth Animations**: Subtle transitions and loading states

### 🔧 **Technical Features**
- **Type Safety**: Full TypeScript implementation with strict typing
- **Form Validation**: React Hook Form + Zod schema validation
- **State Management**: Zustand with persistence and optimistic updates
- **Code Quality**: Biome linting, formatting, and pre-commit hooks
- **Performance**: Optimized rendering with React 19 features

### 🚀 **Beyond MVP - Additional Features**
- **Analytics Dashboard**: Real-time conversion metrics and pipeline insights
- **Advanced Filtering**: Multi-criteria search with status and source filters
- **Theme System**: Dark/light mode with system preference detection
- **Error Boundaries**: Graceful error handling and recovery mechanisms
- **Toast Notifications**: User feedback system for all actions
- **Keyboard Navigation**: Full accessibility with keyboard shortcuts
- **Pre-commit Hooks**: Automated code quality checks with Husky

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **Yarn** package manager
- **Modern browser** with ES2020 support

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/lead-forge.git
cd lead-forge

# Install dependencies
yarn install

# Start development server
yarn dev
```

The application will be available at `http://localhost:5173`

### Build & Deploy

```bash
# Build for production
yarn build

# Preview production build
yarn preview

# Deploy to static hosting
# The dist/ folder contains the production build
```

## 🏗️ Architecture

Lead Forge follows **Clean Architecture** principles with a domain-driven design approach:

```
src/
├── components/          # React components (UI layer)
├── domain/             # Business logic and domain models
│   ├── models/         # TypeScript interfaces and types
│   ├── schemas/        # Zod validation schemas
│   ├── infra/          # Infrastructure (store, storage)
│   └── usecases/       # Business use cases
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── pages/              # Page components
└── styles/             # Global styles and Tailwind config
```

### **Key Design Principles**

- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Single Responsibility**: Each module has one reason to change
- **Interface Segregation**: Clients depend only on interfaces they use

## 📊 Data Models

### Lead
```typescript
interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: LeadSource;
  score: number;
  status: LeadStatus;
  createdAt: string;
  lastContacted?: string;
  convertedAt?: string;
}
```

### Opportunity
```typescript
interface Opportunity {
  id: string;
  name: string;
  stage: OpportunityStage;
  amount?: number;
  accountName: string;
  convertedFrom: string;
  convertedAt: string;
}
```

### Lead Sources
- Website
- LinkedIn
- Referral
- Cold Call
- Trade Show

### Lead Statuses
- New
- Qualified
- Hot
- Converted

### Opportunity Stages
- Prospecting
- Qualification
- Proposal
- Negotiation
- Closed Won
- Closed Lost

## 🎮 Usage

### Managing Leads

1. **View Leads**: Navigate to the Leads tab to see all leads
2. **Search & Filter**: Use the search bar and status filter to find specific leads
3. **Sort**: Sort by score, name, or company in ascending/descending order
4. **Edit**: Click on a lead to open the detail panel for inline editing
5. **Convert**: Use the convert button to transform a lead into an opportunity

### Working with Opportunities

1. **View Opportunities**: Switch to the Opportunities tab
2. **Track Progress**: Monitor opportunities through different pipeline stages
3. **Update Stages**: Change opportunity stages as deals progress
4. **View Source**: Click on an opportunity to see the original lead

### Data Export

- **Export Leads**: Download lead data as CSV from the leads table
- **Export Opportunities**: Download opportunity data as CSV from the opportunities table
- **Filtered Export**: Export only filtered/visible data

## 🧪 Testing

### **Current Status** ✅ **E2E Testing Implemented**

**Testing Coverage**: E2E tests covering all critical user workflows
**Priority**: High - Critical for production readiness

### **Testing Strategy**

Our testing approach focuses on **End-to-End (E2E) testing** using Playwright to ensure complete user workflows function correctly across all browsers and devices.

### **E2E Testing Stack** ⭐ **Implemented**

- **Framework**: Playwright (cross-browser testing with excellent debugging)
- **Coverage**: Complete user journeys and critical business flows
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome
- **Features**: Screenshots on failure, traces for debugging, responsive testing

### **Test Coverage** ✅ **Implemented**

#### **Lead Management**
- ✅ Display leads table with initial data
- ✅ Add new lead successfully
- ✅ Edit lead inline
- ✅ Convert lead to opportunity
- ✅ Filter leads by status
- ✅ Search leads by name
- ✅ Export leads to CSV

#### **Opportunities Management**
- ✅ Display opportunities table
- ✅ View opportunity details
- ✅ Update opportunity stage
- ✅ Update opportunity amount
- ✅ Filter opportunities by stage
- ✅ Search opportunities by name
- ✅ Export opportunities to CSV

#### **Dashboard & Navigation**
- ✅ Load dashboard with all tabs
- ✅ Navigate between tabs
- ✅ Display stats cards
- ✅ Toggle theme
- ✅ Handle responsive design
- ✅ Persist theme preference
- ✅ Display header with logo
- ✅ Handle data loading states

### **Running Tests**

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

### **Test Reports**

After running tests, HTML reports are generated:
```bash
npx playwright show-report
```

### **Future Testing Plans**

- **Unit Tests**: Add Vitest for business logic testing
- **Integration Tests**: Component interaction testing
- **Performance Tests**: Load testing and optimization

## 🛠️ Development

### Available Scripts

```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn preview          # Preview production build

# Code Quality
yarn lint             # Run linting checks
yarn lint:fix         # Fix linting issues
yarn format           # Format code
yarn format:fix       # Fix formatting issues
yarn code:check       # Run all checks
yarn code:fix         # Fix all issues

# Biome (Advanced)
yarn biome:check      # Biome linting
yarn biome:format     # Biome formatting
yarn biome:fix        # Biome auto-fix

# Testing
yarn test:e2e         # Run E2E tests with Playwright
yarn test:e2e:ui      # Run tests with interactive UI
yarn test:e2e:headed  # Run tests in headed mode
yarn test:e2e:debug   # Run tests in debug mode
```

### Code Style

- **TypeScript**: Strict mode enabled with comprehensive type coverage
- **React**: Functional components with hooks, no class components
- **CSS**: Tailwind CSS with custom design tokens
- **Imports**: Absolute imports with `@/` alias for `src/`

### Pre-commit Hooks

The project uses Husky with pre-commit hooks to ensure code quality:
- Automatic linting and formatting of staged files
- Type checking before commits
- Consistent code style across the team

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Vite](https://vitejs.dev/) - Build tool
- [Biome](https://biomejs.dev/) - Code quality tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/lead-forge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/lead-forge/discussions)
- **Email**: support@leadforge.com

---

**Made with ❤️ by the Lead Forge Team**
# Flight Booking E2E Automation (Playwright)

Playwright-based end-to-end automation project for a flight-booking flow. The suite is structured with Page Object Model (POM) and reusable test utilities to support maintainable regression testing.

## QA Focus

- End-to-end critical booking path validation
- Stable selector strategy and reusable page models
- Error handling for unstable UI states (timeouts, retries, interruption modals)
- CI-friendly execution

## Tech Stack

- Playwright
- JavaScript / Node.js
- Page Object Model (POM)

## Project Structure

```text
automation-test/
├── config/                 # Test configuration and environment placeholders
├── pages/                  # POM classes per page/feature
├── tests/                  # End-to-end scenarios
├── playwright.config.js
└── package.json
```

## Setup

```bash
npm install
npx playwright install
```

## Run

```bash
npm run test
npm run test:headed
npm run test:debug
```

## Security Note

This repository intentionally avoids real credentials and production-sensitive test data. Use local environment variables or private CI variables for secrets.

## CI/CD

Can be executed in GitHub Actions or GitLab CI as part of release-gate regression checks.

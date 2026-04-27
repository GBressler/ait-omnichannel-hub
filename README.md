# AIT Omnichannel Hub — QA Test Suite

A multi-layer, cross-platform test automation framework that validates the [Restful Booker Platform](https://automationintesting.online/) across API, Web (Playwright), and Mobile (WebdriverIO + Appium on Sauce Labs) surfaces.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Running Tests](#running-tests)
- [Test Strategy](#test-strategy)
- [CI/CD Pipeline](#cicd-pipeline)
- [Sauce Labs Integration](#sauce-labs-integration)
- [Known Issues & Limitations](#known-issues--limitations)
- [RCA Process](#rca-process)

---

## Architecture Overview

The framework is built on a **three-layer atomic model** where each layer builds on the one below it:

```
┌──────────────────────────────────────────────┐
│           Layer 3: Mobile (WDIO)             │
│   Appium → Sauce Labs Android Emulator       │
│   Verifies UI state on real mobile devices   │
├──────────────────────────────────────────────┤
│           Layer 2: Web (Playwright)          │
│   Headless Chrome/Firefox                    │
│   Admin panel verification via token inject  │
├──────────────────────────────────────────────┤
│           Layer 1: API (Axios)               │
│   Auth → Create Room → Assert → Teardown     │
│   The atomic foundation all tests depend on  │
└──────────────────────────────────────────────┘
```

**Key principle — Stateful Test Isolation:**
The AUT ([automationintesting.online](https://automationintesting.online/)) resets every ~10 minutes. Tests must be self-contained: the API layer creates all required state, the UI layers assert against it, and teardown cleans up — all within a single test lifecycle. Never rely on data that existed before your test started.

**Token Injection:**
Playwright tests authenticate via API first, then inject the session token into `storageState.json`. This allows tests to start directly on the `/#/admin` page without repeating UI login steps.

---

## Tech Stack

| Tool | Purpose | Version |
|---|---|---|
| Node.js | Runtime | 24.x |
| Playwright | Web UI testing (Chrome, Firefox) | Latest |
| WebdriverIO | Mobile test runner | Latest |
| Appium | Mobile automation protocol | Latest |
| Sauce Labs | Cloud device farm (Android emulator) | — |
| Axios | HTTP client for API layer | Latest |
| Mocha | Test framework (WDIO specs) | Latest |
| GitHub Actions | CI/CD pipeline | — |

---

## Project Structure

```
├── .github/
│   └── workflows/
│       └── main.yml              # CI/CD pipeline definition
├── support/
│   ├── api/
│   │   ├── ApiClient.js          # Core HTTP utility — Axios wrapper with request/response logging
│   │   ├── AuthProvider.js       # POST /auth/login → captures and exposes session token/cookie
│   │   └── RoomProvider.js       # Create and delete rooms via API (setup/teardown logic)
│   └── config.js                 # Central environment config — all env vars resolved here
├── tests/
│   └── mobile/
│       └── room-visibility.spec.js  # Mobile spec: API creates room → Mobile verifies visibility
├── .env                          # Local secrets (NOT committed — see Environment Setup)
├── .gitignore                    # Excludes node_modules, .env, storageState.json
├── package.json                  # Dependencies and npm scripts
└── wdio.conf.js                  # WebdriverIO config — capabilities, Sauce Labs, timeouts
```

---

## Prerequisites

- **Node.js** >= 24.x (`node -v` to check)
- **npm** >= 10.x
- A **Sauce Labs** account with access to Real Device/Emulator Cloud
  - Free tier supports 1 concurrent device
- GitHub repository **Secrets** configured (for CI — see below)

---

## Environment Setup

### 1. Clone and Install

```bash
git clone https://github.com/GBressller/ait-omnichannel-hub.git
cd ait-omnichannel-hub
npm ci
```

### 2. Configure Local Environment

Create a `.env` file at the project root. This file is gitignored and must never be committed:

```bash
# .env
TEST_BASE_URL=https://automationintesting.online/
API_USERNAME=admin
API_PASSWORD=password

SAUCE_USERNAME=your_sauce_username
SAUCE_ACCESS_KEY=your_sauce_access_key
SAUCE_REGION=us-west-1
```

> **Note:** The AUT credentials (`admin` / `password`) are publicly documented as the default admin login for automationintesting.online.

### 3. GitHub Actions Secrets

For CI to run, the following must be set under **Settings → Secrets and variables → Actions** in your GitHub repo:

| Secret | Description |
|---|---|
| `SAUCE_USERNAME` | Sauce Labs username |
| `SAUCE_ACCESS_KEY` | Sauce Labs access key |
| `SAUCE_REGION` | e.g. `us-west-1` |
| `TEST_BASE_URL` | `https://automationintesting.online/` |
| `API_USERNAME` | `admin` |
| `API_PASSWORD` | `password` |

---

## Running Tests

### Mobile Tests (WebdriverIO + Sauce Labs)

Requires Sauce Labs credentials in `.env`.

```bash
npx wdio run wdio.conf.js
```

This spins up the configured Android emulator on Sauce Labs and runs the mobile spec suite.

### Manual Trigger via GitHub Actions

You can trigger a CI run without pushing code:

1. Go to **Actions** tab in GitHub
2. Select **Omnichannel Hub CI**
3. Click **Run workflow** → select branch → **Run workflow**

> To enable this, ensure your `main.yml` includes `workflow_dispatch:` under the `on:` key.

---

## Test Strategy

### Layer 1 — API (Atomic Foundation)

All tests begin with an API call. `AuthProvider` logs in via `POST /auth/login` and captures the session token. `RoomProvider` creates (and later deletes) the room under test. This ensures the UI layers always have a known, fresh state to assert against regardless of the 10-minute reset cycle.

### Layer 2 — Web (Playwright)

Playwright uses the API-captured token to inject auth state (`storageState.json`), bypassing the login UI and landing directly on the admin panel. This makes web tests faster and decoupled from login UI changes.

### Layer 3 — Mobile (WDIO)

WDIO connects to Sauce Labs and runs the spec against an Android emulator. The spec verifies that a room created by the API is visible to a customer on the mobile front-end — a true end-to-end cross-layer assertion.

### Teardown

After each test, `RoomProvider` deletes the created room via API. This keeps the AUT clean between runs and prevents state leakage, which is especially important given the shared, public nature of the site.

---

## CI/CD Pipeline

Defined in `.github/workflows/main.yml`. Triggers on:

- Push to `main`
- Pull request targeting `main`
- Manual dispatch (if `workflow_dispatch` is configured)

**Pipeline steps:**

```
Checkout → Setup Node 24 → npm ci → Run WDIO tests (Sauce Labs)
```

**Actions versions in use:** `actions/checkout@v4`, `actions/setup-node@v4`

> GitHub has announced Node 20 action runners will be deprecated June 2, 2026. Update to `@v5` when available to avoid forced migration.

---

## Sauce Labs Integration

Tests run against a Sauce Labs Android emulator defined in `wdio.conf.js`:

```
Device:     Android GoogleAPI Emulator
Browser:    Chrome 13.0
Platform:   Android 13.0
Automation: UiAutomator2
```

**Viewing results:**

1. Log in to [app.saucelabs.com](https://app.saucelabs.com)
2. Navigate to **Automated → Test Results**
3. Filter by build: `Omnichannel-Final-Validation`

Each run logs session IDs, HAR files, screenshots, and video — see [RCA Process](#rca-process) for how to use these.

---

## Known Issues & Limitations

| Issue | Impact | Notes |
|---|---|---|
| Sauce Labs free tier limits concurrency to 1 device | iOS capability commented out in `wdio.conf.js` | Upgrade account to re-enable parallel mobile execution |
| AUT resets every ~10 minutes | Tests that run long or rely on pre-existing data will fail | Mitigated by atomic API setup/teardown in every spec |
| GitHub Actions intermittent failure | Occasional CI flakiness | Under investigation — check Sauce Labs session logs and HAR files for network-level errors |
| `storageState.json` not committed | Playwright token injection requires a local login run first | Run the auth setup script before Playwright specs on a fresh clone |

---

## RCA Process

When a test fails on Sauce Labs, use the following process to identify root cause:

### 1. Locate the Session

Find the session ID in the CI log:
```
INFO @wdio/sauce-service: Update job with sessionId <id>, status: failing
```

### 2. Open the Session in Sauce Labs

Navigate to the session in the Sauce Labs dashboard. Available artifacts:

- **Video recording** — full screen capture of the test run
- **HAR file** — complete network log including request/response headers and bodies
- **Appium logs** — device-level logs

### 3. Analyze the HAR File

The HAR file is the primary diagnostic tool for API-related failures. Filter by:

- **Status 401** → Authentication failure (token expired or not injected correctly)
- **Status 403** → Authorization failure (wrong role or missing cookie)
- **Status 500** → AUT instability — likely caught a mid-reset window

### 4. Common Failure Patterns

| Symptom | Likely Cause | Fix |
|---|---|---|
| `ReferenceError` in `before` hook | Code bug in support files | Check variable names in `AuthProvider.js` / `ApiClient.js` |
| Session timeout on Sauce Labs | `connectionRetryTimeout` too low | Increase to `120000` in `wdio.conf.js` |
| Room not visible on mobile | AUT reset mid-test | Re-run; consider reducing test duration |
| 401 on `/report` endpoint | Cookie not passed correctly | Inspect HAR, verify `AuthProvider` cookie capture |

---

## Contributing

1. Branch from `main`
2. Add or modify specs under `tests/`
3. Shared utilities go in `support/api/`
4. All environment-specific values must go through `support/config.js` — no hardcoded URLs or credentials in specs
5. Open a PR targeting `main` — CI will run automatically

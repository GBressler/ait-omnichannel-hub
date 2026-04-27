# **AIT Omnichannel Hub — QA Test Suite**

A multi-layer, cross-platform test automation framework that validates the Restful Booker Platform across API, Web (Playwright), and Mobile (WebdriverIO \+ Appium on Sauce Labs) surfaces.

## **Table of Contents**

* [Architecture Overview](https://www.google.com/search?q=%23architecture-overview)  
* [Tech Stack](https://www.google.com/search?q=%23tech-stack)  
* [Project Structure](https://www.google.com/search?q=%23project-structure)  
* [Prerequisites](https://www.google.com/search?q=%23prerequisites)  
* [Environment Setup](https://www.google.com/search?q=%23environment-setup)  
* [Running Tests](https://www.google.com/search?q=%23running-tests)  
* [Reporting (Allure)](https://www.google.com/search?q=%23reporting-allure)  
* [Test Strategy](https://www.google.com/search?q=%23test-strategy)  
* [CI/CD Pipeline](https://www.google.com/search?q=%23cicd-pipeline)  
* [Sauce Labs Integration](https://www.google.com/search?q=%23sauce-labs-integration)  
* [Known Issues & Limitations](https://www.google.com/search?q=%23known-issues--limitations)  
* [RCA Process](https://www.google.com/search?q=%23rca-process)

## ---

**Architecture Overview**

The framework is built on a three-layer atomic model where each layer builds on the one below it:

Plaintext

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

**Key principle — Stateful Test Isolation:**

The AUT (automationintesting.online) resets every \~10 minutes. Tests must be self-contained: the API layer creates all required state, the UI layers assert against it, and teardown cleans up — all within a single test lifecycle.

**Token Injection:**

Playwright tests authenticate via API first, then inject the session token into storageState.json. This allows tests to start directly on the /\#/admin page without repeating UI login steps.

## ---

**Tech Stack**

| Tool | Purpose | Version |
| :---- | :---- | :---- |
| **Node.js** | Runtime | 24.x |
| **Playwright** | Web UI testing (Chrome, Firefox) | Latest |
| **WebdriverIO** | Mobile test runner | Latest |
| **Allure** | Test Reporting & Analytics | Latest |
| **Sauce Labs** | Cloud device farm (Android emulator) | — |
| **Axios** | HTTP client for API layer | Latest |
| **GitHub Actions** | CI/CD pipeline | — |

## ---

**Project Structure**

Plaintext

├── .github/workflows/  
│   └── main.yml              \# CI/CD pipeline definition  
├── support/  
│   ├── api/  
│   │   ├── ApiClient.js          \# Core HTTP utility with request/response logging  
│   │   ├── AuthProvider.js       \# Auth logic & session capture  
│   │   └── RoomProvider.js       \# Setup/Teardown logic  
│   └── config.js                 \# Central environment config  
├── tests/  
│   └── mobile/  
│       └── room-visibility.spec.js  \# Mobile end-to-end spec  
├── allure-results/               \# Generated test artifacts (Git-ignored)  
├── wdio.conf.js                  \# WebdriverIO & Sauce Labs config  
└── package.json                  \# Scripts & Dependencies

## ---

**Prerequisites**

* **Node.js \>= 24.x**  
* **npm \>= 10.x**  
* **Allure Commandline**: Install via npm install \-g allure-commandline to view reports locally.  
* **Sauce Labs Account**: Free tier supports 1 concurrent device.

## ---

**Environment Setup**

1. **Clone and Install**  
   Bash  
   git clone https://github.com/GBressller/ait-omnichannel-hub.git  
   cd ait-omnichannel-hub  
   npm ci

2. **Configure Local Environment**  
   Create a .env file at the project root:  
   Plaintext  
   SAUCE\_USERNAME=your\_username  
   SAUCE\_ACCESS\_KEY=your\_access\_key  
   API\_USERNAME=admin  
   API\_PASSWORD=password

## ---

**Running Tests**

### **Mobile Tests (WebdriverIO \+ Sauce Labs)**

Run tests using the default configuration:

Bash

npm run test

### **Manual Trigger via GitHub Actions**

1. Go to the **Actions** tab in GitHub.  
2. Select **Omnichannel Hub CI**.  
3. Click **Run workflow** (ensure workflow\_dispatch is enabled in main.yml).

## ---

**Reporting (Allure)**

This project uses **Allure Reports** to provide high-level observability, including execution timelines, historical trends, and embedded failure screenshots.

### **Local Report Management**

To simplify the reporting workflow, use the following commands:

* **Generate and Open Report**:  
  Bash  
  npm run report

* **Clean Results**: To clear old test data before a new run:  
  Bash  
  rm \-rf allure-results && rm \-rf allure-report

### **CI/CD Reporting**

After each GitHub Actions run, Allure results are collected as artifacts.

1. Navigate to the completed **Action run**.  
2. Download the allure-results zip.  
3. \[Senior Upgrade Planned\]: Automated deployment to GitHub Pages for instant web-based viewing.

## ---

**Test Strategy**

* **Layer 1 — API**: AuthProvider captures the session token; RoomProvider seeds the data.  
* **Layer 2 — Web**: Token is injected into storageState.json to bypass UI login.  
* **Layer 3 — Mobile**: WDIO asserts that the API-created room is visible on a real mobile browser.  
* **Teardown**: Atomic cleanup follows every spec to prevent state leakage.

## ---

**RCA Process**

When a test fails on Sauce Labs, use this process:

1. **Locate Session ID**: Found in the CI log.  
2. **Open Sauce Labs Dashboard**: View the video recording for UI anomalies.  
3. **Analyze the HAR File**: Check for 401 (Auth), 403 (Permissions), or 500 (Server Reset) errors.  
4. **Allure Insights**: Check the Allure "Suites" tab to see exactly which step in the before or test hook failed.

## ---

**Contributing**

* All environment variables must be resolved in support/config.js.  
* New API utilities belong in support/api/.  
* Open a PR targeting main; CI will validate the changes on Sauce Labs.

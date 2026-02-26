# Banking QA Automation Testing Framework

> Selenium + Cucumber BDD + Appium + REST Assured + TestNG + Maven

---

## Table of Contents
1. [Overview](#overview)
2. [High Level Design (HLD)](#high-level-design-hld)
3. [Low Level Design (LLD)](#low-level-design-lld)
4. [Solution Architecture Document (SAD)](#solution-architecture-document-sad)
5. [C4 Model](#c4-model)
6. [Flowcharts](#flowcharts)
7. [Setup Instructions](#setup-instructions)
8. [Running Tests](#running-tests)
9. [Test Coverage](#test-coverage)
10. [Reporting](#reporting)

---

## Overview

| Component | Technology | Version |
|-----------|-----------|---------|
| Language | Java (OpenJDK) | 21 |
| Build Tool | Apache Maven | 3.9.6 |
| UI Automation | Selenium WebDriver | 4.15.0 |
| BDD Framework | Cucumber | 7.14.1 |
| Mobile Testing | Appium Java Client | 9.0.0 |
| API Testing | REST Assured | 5.4.0 |
| Test Runner | TestNG | 7.8.0 |
| Reporting | Extent Reports + Cucumber Reports | 5.1.1 |
| Driver Mgmt | WebDriverManager | 5.6.2 |
| Test Data | Apache POI (Excel) + CSV | 5.2.5 |
| Logging | Log4j2 | 2.22.0 |

---

## High Level Design (HLD)

### System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                    BANKING QA AUTOMATION                        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Selenium  │  │ Cucumber │  │  Appium  │  │   REST   │       │
│  │ WebDriver │  │   BDD    │  │  Mobile  │  │ Assured  │       │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘      │
│        │              │              │              │            │
│        └──────────────┼──────────────┼──────────────┘            │
│                       │              │                           │
│              ┌────────▼────────┐     │                           │
│              │   TestNG +      │     │                           │
│              │   Maven Runner  │◄────┘                           │
│              └────────┬────────┘                                 │
│                       │                                          │
│              ┌────────▼────────┐                                 │
│              │  Extent Reports │                                 │
│              │  + Screenshots  │                                 │
│              └─────────────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  React UI    │ │  Express.js  │ │  Mobile App  │
│  Dashboard   │ │  REST API    │ │  (Android/   │
│  (Port 3000) │ │  (Port 3001) │ │   iOS)       │
└──────────────┘ └──────┬───────┘ └──────────────┘
                        │
                 ┌──────▼───────┐
                 │   SQLite     │
                 │   Database   │
                 └──────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────┐
│              TEST AUTOMATION LAYERS              │
├─────────────────────────────────────────────────┤
│                                                  │
│  Layer 5: TEST RUNNERS & CI/CD                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │ TestNG   │ │ Maven    │ │ GitHub       │    │
│  │ Suites   │ │ Profiles │ │ Actions CI   │    │
│  └──────────┘ └──────────┘ └──────────────┘    │
│                                                  │
│  Layer 4: BDD / FEATURE FILES                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │ Login    │ │ Transfer │ │ Mobile       │    │
│  │ .feature │ │ .feature │ │ .feature     │    │
│  └──────────┘ └──────────┘ └──────────────┘    │
│                                                  │
│  Layer 3: STEP DEFINITIONS                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │ Login    │ │ Transfer │ │ API Steps    │    │
│  │ Steps   │ │ Steps    │ │ Mobile Steps │    │
│  └──────────┘ └──────────┘ └──────────────┘    │
│                                                  │
│  Layer 2: PAGE OBJECTS (POM)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │ Login    │ │ Transfer │ │ Cards        │    │
│  │ Page     │ │ Page     │ │ Page         │    │
│  └──────────┘ └──────────┘ └──────────────┘    │
│                                                  │
│  Layer 1: UTILITIES & DRIVERS                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │ Driver   │ │ Wait     │ │ Screenshot   │    │
│  │ Factory  │ │ Helper   │ │ Util         │    │
│  └──────────┘ └──────────┘ └──────────────┘    │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Low Level Design (LLD)

### Class Diagram

```
                    ┌─────────────────────┐
                    │     BasePage        │
                    │─────────────────────│
                    │ - driver: WebDriver │
                    │ - waitHelper        │
                    │ - actions           │
                    │─────────────────────│
                    │ + click(By)         │
                    │ + type(By, String)  │
                    │ + getText(By)       │
                    │ + isDisplayed(By)   │
                    │ + selectByText()    │
                    │ + jsClick()         │
                    │ + navigateTo()      │
                    │ + hover()           │
                    │ + dragAndDrop()     │
                    └────────┬────────────┘
                             │ extends
          ┌──────────┬───────┼──────────┬──────────────┐
          ▼          ▼       ▼          ▼              ▼
    ┌──────────┐┌──────────┐┌───────────┐┌───────────┐┌──────────────┐
    │LoginPage ││Dashboard ││TransferPg ││AccountsPg ││MobileBanking │
    │──────────││──────────││───────────││───────────││──────────────│
    │-username ││-balance  ││-fromAcct  ││-acctList  ││-dashTitle    │
    │-password ││-welcome  ││-toAcct    ││-search    ││-balanceText  │
    │-loginBtn ││-menuItems││-amount    ││-filter    ││-pinInput     │
    │──────────││──────────││───────────││───────────││──────────────│
    │+login()  ││+getBalance│+transfer()││+search()  ││+loginPIN()   │
    │+getError()│+logout() ││+confirm() ││+filter()  ││+tapElement() │
    └──────────┘└──────────┘└───────────┘└───────────┘└──────────────┘
          │          │           │            │
    ┌──────────┐┌──────────┐┌───────────┐┌──────────┐┌──────────────┐
    │BillPayPg ││LoansPage ││ CardsPage ││          ││              │
    │──────────││──────────││───────────││          ││              │
    │-biller   ││-loanType ││-cardNum   ││          ││              │
    │-amount   ││-tenure   ││-cardType  ││          ││              │
    │──────────││──────────││───────────││          ││              │
    │+payBill()││+applyLoan│+blockCard()││          ││              │
    └──────────┘└──────────┘└───────────┘└──────────┘└──────────────┘


    ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
    │  DriverFactory   │    │   ConfigReader    │    │   WaitHelper    │
    │─────────────────│    │──────────────────│    │─────────────────│
    │ -driver:         │    │ -properties       │    │ -wait           │
    │  ThreadLocal     │    │ -CONFIG_PATH      │    │ -timeout        │
    │─────────────────│    │──────────────────│    │─────────────────│
    │ +initDriver()    │    │ +get(key)         │    │ +waitVisible()  │
    │ +initAndroid()   │    │ +getBaseUrl()     │    │ +waitClickable()│
    │ +initIOS()       │    │ +getBrowser()     │    │ +waitPresence() │
    │ +quitDriver()    │    │ +isHeadless()     │    │ +waitPageLoad() │
    └─────────────────┘    └──────────────────┘    └─────────────────┘

    ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
    │  ExcelReader     │    │  ScreenshotUtil   │    │  APIHelper      │
    │─────────────────│    │──────────────────│    │─────────────────│
    │ +readSheet()     │    │ +capture()        │    │ +get()          │
    │ +readColumn()    │    │ +captureAsBytes() │    │ +post()         │
    │ +getRowCount()   │    │ +getFileName()    │    │ +put()          │
    │ +readAsDP()      │    │                   │    │ +delete()       │
    └─────────────────┘    └──────────────────┘    └─────────────────┘

    ┌─────────────────┐    ┌──────────────────┐
    │  RetryAnalyzer   │    │  TestListener     │
    │─────────────────│    │──────────────────│
    │ -retryCount      │    │ -passed, failed   │
    │ -MAX_RETRY=2     │    │ -skipped          │
    │─────────────────│    │──────────────────│
    │ +retry()         │    │ +onTestStart()    │
    │                  │    │ +onTestSuccess()  │
    │                  │    │ +onTestFailure()  │
    └─────────────────┘    └──────────────────┘
```

### Package Structure

```
automation-testing/
├── pom.xml                              # Maven config with all dependencies
├── testng.xml                           # Main TestNG suite
├── testng-smoke.xml                     # Smoke test suite
├── testng-regression.xml                # Regression suite
├── testng-mobile.xml                    # Mobile test suite
├── .gitignore                           # Git exclusions
├── .github/
│   └── workflows/
│       └── automation-tests.yml         # CI/CD pipeline
├── src/
│   ├── main/java/com/banking/
│   │   ├── pages/                       # Page Object Model
│   │   │   ├── BasePage.java            # Abstract base (48 methods)
│   │   │   ├── LoginPage.java           # Login page actions
│   │   │   ├── DashboardPage.java       # Dashboard page actions
│   │   │   ├── TransferPage.java        # Fund transfer actions
│   │   │   ├── AccountsPage.java        # Account management
│   │   │   ├── BillPaymentPage.java     # Bill payment module
│   │   │   ├── LoansPage.java           # Loan management
│   │   │   ├── CardsPage.java           # Card management
│   │   │   └── MobileBankingPage.java   # Mobile app (Appium)
│   │   ├── utils/                       # Utility classes
│   │   │   ├── DriverFactory.java       # ThreadLocal WebDriver
│   │   │   ├── ConfigReader.java        # Properties reader
│   │   │   ├── WaitHelper.java          # Explicit waits
│   │   │   ├── ScreenshotUtil.java      # Screenshot capture
│   │   │   ├── ExcelReader.java         # Excel test data reader
│   │   │   ├── APIHelper.java           # REST Assured wrapper
│   │   │   └── RetryAnalyzer.java       # Flaky test retry
│   │   └── listeners/                   # TestNG listeners
│   │       ├── TestListener.java        # Test event listener
│   │       └── RetryTransformer.java    # Auto-retry transformer
│   └── test/
│       ├── java/com/banking/
│       │   ├── steps/                   # Cucumber step definitions
│       │   │   ├── Hooks.java           # Before/After hooks
│       │   │   ├── LoginSteps.java      # Login scenarios
│       │   │   ├── TransferSteps.java   # Transfer scenarios
│       │   │   ├── AccountSteps.java    # Account scenarios
│       │   │   ├── APISteps.java        # API test scenarios
│       │   │   └── MobileSteps.java     # Mobile test scenarios
│       │   └── runners/                 # TestNG + Cucumber runners
│       │       ├── SmokeTestRunner.java
│       │       ├── RegressionTestRunner.java
│       │       ├── MobileTestRunner.java
│       │       └── APITestRunner.java
│       └── resources/
│           ├── config.properties        # Test configuration
│           ├── log4j2.xml               # Logging configuration
│           ├── extent.properties        # Extent Reports config
│           ├── features/                # Cucumber feature files
│           │   ├── login.feature        # 7 scenarios
│           │   ├── fund_transfer.feature # 7 scenarios
│           │   ├── accounts.feature     # 5 scenarios
│           │   ├── mobile_banking.feature # 14 scenarios
│           │   └── api_testing.feature  # 10 scenarios
│           └── testdata/                # Test data files
│               ├── login_data.csv       # Login test data
│               ├── transfer_data.csv    # Transfer test data
│               ├── customer_data.csv    # Customer master data
│               └── api_test_data.csv    # API test data
```

---

## Solution Architecture Document (SAD)

### 1. Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Design Pattern | Page Object Model (POM) | Separates page structure from test logic, improves maintainability |
| BDD Framework | Cucumber with Gherkin | Business-readable test specs, bridges dev and QA communication |
| Driver Management | ThreadLocal + WebDriverManager | Thread-safe parallel execution, auto driver download |
| Mobile Framework | Appium (UiAutomator2 + XCUITest) | Cross-platform mobile testing, supports native + hybrid apps |
| API Framework | REST Assured | Java-native REST client with fluent API, JSON/XML validation |
| Build Tool | Maven | Industry standard, dependency management, profile-based execution |
| Test Runner | TestNG | Parallel execution, data providers, flexible grouping, listeners |
| Reporting | Extent Reports + Cucumber HTML | Rich visual reports with screenshots on failure |
| Test Data | CSV + Excel (Apache POI) | External data-driven testing, easy maintenance by non-devs |
| Retry Strategy | Custom RetryAnalyzer | Handles flaky tests due to timing/environment issues |
| Logging | Log4j2 | Structured logging with rolling files, separate log channels |
| CI/CD | GitHub Actions | Automated pipeline with smoke + regression + API jobs |

### 2. Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                     CI/CD LAYER                          │
│  GitHub Actions → Build → Smoke → API → Regression      │
├─────────────────────────────────────────────────────────┤
│                   EXECUTION LAYER                        │
│  TestNG Suites → Maven Profiles → Parallel Threads      │
├─────────────────────────────────────────────────────────┤
│                    BDD LAYER                             │
│  Gherkin Features → Step Definitions → Scenario Tags     │
├─────────────────────────────────────────────────────────┤
│                  FRAMEWORK LAYER                         │
│  DriverFactory → WaitHelper → ScreenshotUtil → APIHelper │
├─────────────────────────────────────────────────────────┤
│                  PAGE OBJECT LAYER                        │
│  BasePage → LoginPage → TransferPage → MobileBankingPage │
├─────────────────────────────────────────────────────────┤
│                   DRIVER LAYER                           │
│  Chrome/Firefox/Edge (Selenium) │ Android/iOS (Appium)   │
├─────────────────────────────────────────────────────────┤
│               APPLICATION UNDER TEST                     │
│  React Dashboard (3000) │ Express API (3001) │ SQLite DB │
└─────────────────────────────────────────────────────────┘
```

### 3. Non-Functional Requirements

| NFR | Target | Implementation |
|-----|--------|---------------|
| Parallel Execution | 3 threads | TestNG parallel="tests" thread-count="3" |
| Test Isolation | Each test independent | ThreadLocal driver, fresh browser per scenario |
| Screenshot on Failure | 100% | Hooks.java @After captures on scenario.isFailed() |
| Test Data Externalized | 100% | CSV + Excel files in testdata/ directory |
| Retry Flaky Tests | 2 retries | RetryAnalyzer with max 2 retry attempts |
| Logging | All actions logged | Log4j2 with rolling files and error separation |
| Report Generation | Every run | Extent Spark HTML + Cucumber JSON + Surefire |
| Cross-Browser | Chrome, Firefox, Edge | DriverFactory with browser parameter |
| Mobile Platforms | Android + iOS | Appium UiAutomator2 + XCUITest |
| CI/CD Integration | On every push | GitHub Actions with artifact upload |

### 4. Security Testing Coverage

| Area | Scenarios |
|------|-----------|
| SQL Injection | Login with `' OR 1=1--`, API with malicious queries |
| XSS | Login with `<script>alert(1)</script>` |
| Brute Force | Account lockout after 5 wrong attempts |
| Session Timeout | Auto-logout after idle period |
| Input Validation | Boundary values, special characters, Unicode |
| Authorization | Access control between customer accounts |

---

## C4 Model

### Level 1: System Context

```
                    ┌──────────────┐
                    │  QA Tester   │
                    │  (Person)    │
                    └──────┬───────┘
                           │ writes/runs tests
                           ▼
                    ┌──────────────────┐
                    │   Automation     │
                    │   Framework      │
                    │ (Software System)│
                    └──────┬───────────┘
                           │ tests
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
    ┌──────────────┐┌──────────────┐┌──────────────┐
    │ Banking Web  ││ Banking API  ││ Mobile App   │
    │ Dashboard    ││ Backend      ││ (Android/iOS)│
    │ (React)      ││ (Express.js) ││              │
    └──────────────┘└──────────────┘└──────────────┘
```

### Level 2: Container Diagram

```
┌─────────────────────────────────────────────────────┐
│              Automation Framework                    │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │  Cucumber     │  │  TestNG      │                 │
│  │  Feature      │──│  Runner      │                 │
│  │  Files        │  │              │                 │
│  └──────┬───────┘  └──────┬───────┘                 │
│         │                  │                         │
│  ┌──────▼───────┐  ┌──────▼───────┐                 │
│  │  Step        │  │  Test        │                 │
│  │  Definitions │  │  Listeners   │                 │
│  └──────┬───────┘  └──────┬───────┘                 │
│         │                  │                         │
│  ┌──────▼───────────────────▼───────┐               │
│  │         Page Objects             │               │
│  │  (BasePage, LoginPage, etc.)     │               │
│  └──────────────┬───────────────────┘               │
│                 │                                    │
│  ┌──────────────▼───────────────────┐               │
│  │         Utilities                │               │
│  │  DriverFactory, WaitHelper,      │               │
│  │  ConfigReader, ExcelReader,      │               │
│  │  APIHelper, ScreenshotUtil       │               │
│  └──────────────┬───────────────────┘               │
│                 │                                    │
│  ┌──────────────▼───────────────────┐               │
│  │    Selenium / Appium / REST      │               │
│  │    WebDriver Instances           │               │
│  └──────────────────────────────────┘               │
└─────────────────────────────────────────────────────┘
```

### Level 3: Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Step Definitions                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Login   │ │ Transfer │ │ Account  │ │   API    │   │
│  │  Steps   │ │  Steps   │ │  Steps   │ │  Steps   │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│       │             │            │             │          │
│  ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐   │
│  │  Login   │ │ Transfer │ │ Accounts │ │   API    │   │
│  │  Page    │ │  Page    │ │  Page    │ │  Helper  │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│       └─────────────┼────────────┘             │          │
│                     ▼                          ▼          │
│              ┌──────────┐              ┌──────────┐      │
│              │ BasePage │              │   REST   │      │
│              │          │              │ Assured  │      │
│              └────┬─────┘              └──────────┘      │
│                   │                                       │
│        ┌──────────┼──────────┐                            │
│        ▼          ▼          ▼                            │
│  ┌──────────┐┌──────────┐┌──────────┐                    │
│  │  Driver  ││   Wait   ││Screenshot│                    │
│  │ Factory  ││  Helper  ││   Util   │                    │
│  └──────────┘└──────────┘└──────────┘                    │
└─────────────────────────────────────────────────────────┘
```

---

## Flowcharts

### Test Execution Flow

```
┌────────────┐
│   START    │
└─────┬──────┘
      │
      ▼
┌─────────────────┐
│ mvn test        │
│ -P<profile>     │
│ -Dbrowser=chrome│
└─────┬───────────┘
      │
      ▼
┌─────────────────┐     ┌─────────────────┐
│ TestNG reads    │────▶│ Initialize       │
│ testng.xml      │     │ Test Listeners   │
└─────────────────┘     └────────┬─────────┘
                                 │
                                 ▼
                        ┌────────────────┐
                        │ Cucumber scans │
                        │ feature files  │
                        └────────┬───────┘
                                 │
                                 ▼
                        ┌────────────────┐
                        │ Match tags to  │
                        │ runner filter  │
                        │ @smoke/@api/etc│
                        └────────┬───────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              ┌──────────┐┌──────────┐┌──────────┐
              │ @Before  ││ @Before  ││ @Before  │
              │ Web Hook ││ API Hook ││Mobile Hook│
              │ init     ││ (no      ││ init     │
              │ browser  ││ browser) ││ Appium   │
              └────┬─────┘└────┬─────┘└────┬─────┘
                   │           │           │
                   ▼           ▼           ▼
              ┌────────────────────────────────┐
              │    Execute Scenario Steps       │
              │    Given → When → Then → And    │
              └────────────┬───────────────────┘
                           │
                    ┌──────┴──────┐
                    │  Pass/Fail? │
                    └──────┬──────┘
               ┌───────────┤───────────┐
               ▼           │           ▼
        ┌──────────┐       │    ┌──────────┐
        │   PASS   │       │    │   FAIL   │
        │ Log pass │       │    │ Capture  │
        └──────────┘       │    │screenshot│
                           │    │ Retry?   │
                           │    └────┬─────┘
                           │    ┌────┴──────┐
                           │    ▼           ▼
                           │ ┌──────┐  ┌──────┐
                           │ │Retry │  │ Mark │
                           │ │again │  │failed│
                           │ └──────┘  └──────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ @After Hook  │
                    │ Quit driver  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Generate     │
                    │ Reports      │
                    │ Extent +     │
                    │ Cucumber     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────┐
                    │   END    │
                    └──────────┘
```

### Page Object Model Flow

```
Step Definition          Page Object              WebDriver
     │                       │                        │
     │  loginPage.login()    │                        │
     │──────────────────────▶│                        │
     │                       │  type(username, text)  │
     │                       │───────────────────────▶│
     │                       │                        │  findElement()
     │                       │                        │  sendKeys()
     │                       │  click(loginBtn)       │
     │                       │───────────────────────▶│
     │                       │                        │  findElement()
     │                       │                        │  click()
     │                       │◀───────────────────────│
     │  return DashboardPage │                        │
     │◀──────────────────────│                        │
     │                       │                        │
```

### CI/CD Pipeline Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Push to │────▶│  Build   │────▶│  Smoke   │────▶│ Publish  │
│  GitHub  │     │ Compile  │     │  Tests   │     │ Results  │
└──────────┘     └──────────┘     └─────┬────┘     └──────────┘
                                        │
                                  ┌─────▼────┐
                                  │ API Tests│
                                  └─────┬────┘
                                        │
                                  ┌─────▼──────┐
                                  │ Regression │ (manual trigger)
                                  │ Tests      │
                                  └────────────┘
```

---

## Setup Instructions

### Prerequisites

```bash
# Java 21
java -version    # Should show 21+

# Maven 3.9+
mvn -version     # Should show 3.9+

# Chrome browser (for Selenium)
google-chrome --version

# Node.js (for backend server)
node -version
```

### Quick Start

```bash
# 1. Clone repository
git clone git@github.com:PraveenAsthana123/testingsoap.git
cd testingsoap

# 2. Start backend server
cd testing-dashboard && node ../server.js &

# 3. Start frontend
npm start &

# 4. Run tests
cd ../automation-testing
mvn compile
mvn test -Psmoke -Dbrowser=chrome -Dheadless=true
```

### Appium Setup (Mobile Testing)

```bash
# Install Appium
npm install -g appium

# Install drivers
appium driver install uiautomator2   # Android
appium driver install xcuitest       # iOS

# Verify setup
appium doctor

# Start Appium server
appium --port 4723

# Android: Install Android SDK + create emulator
# iOS: Install Xcode + simulators (macOS only)
```

---

## Running Tests

### Maven Commands

| Command | Description |
|---------|-------------|
| `mvn compile` | Compile source code |
| `mvn test` | Run all tests (default testng.xml) |
| `mvn test -Psmoke` | Run smoke tests only |
| `mvn test -Pregression` | Run regression suite |
| `mvn test -Pmobile` | Run mobile tests |
| `mvn test -Dcucumber.filter.tags="@api"` | Run API tests only |
| `mvn test -Dbrowser=firefox` | Run on Firefox |
| `mvn test -Dheadless=true` | Run headless Chrome |
| `mvn verify` | Run tests + generate Cucumber report |
| `mvn clean test` | Clean build + run tests |

### Tag-Based Execution

```bash
# Priority-based
mvn test -Dcucumber.filter.tags="@P0"           # Critical tests only
mvn test -Dcucumber.filter.tags="@P0 or @P1"    # High priority

# Module-based
mvn test -Dcucumber.filter.tags="@banking"       # All banking tests
mvn test -Dcucumber.filter.tags="@api"           # API tests only
mvn test -Dcucumber.filter.tags="@mobile"        # Mobile tests only

# Type-based
mvn test -Dcucumber.filter.tags="@smoke"         # Smoke tests
mvn test -Dcucumber.filter.tags="@regression"    # Regression tests
mvn test -Dcucumber.filter.tags="@negative"      # Negative tests
mvn test -Dcucumber.filter.tags="@security"      # Security tests
```

---

## Test Coverage

### Scenario Summary

| Feature | Scenarios | Tags |
|---------|-----------|------|
| Login | 7 | @banking, @smoke, @negative, @security |
| Fund Transfer | 7 | @banking, @smoke, @negative, @boundary |
| Accounts | 5 | @banking, @accounts, @regression |
| API Testing | 10 | @api, @smoke, @negative |
| Mobile Banking | 14 | @mobile, @android, @ios, @cross-platform |
| **Total** | **43** | |

### Module Coverage

| Module | UI Tests | API Tests | Mobile Tests | Total |
|--------|----------|-----------|-------------|-------|
| Login/Auth | 7 | 2 | 2 | 11 |
| Fund Transfer | 7 | 0 | 1 | 8 |
| Accounts | 5 | 2 | 2 | 9 |
| Bill Payment | 0 | 0 | 1 | 1 |
| Mobile-Specific | 0 | 0 | 8 | 8 |
| Database/Schema | 0 | 4 | 0 | 4 |
| Cross-Platform | 0 | 0 | 2 | 2 |
| **Total** | **19** | **8** | **16** | **43** |

---

## Reporting

### Report Locations

| Report | Path | Format |
|--------|------|--------|
| Extent HTML | `target/extent-reports/SparkReport.html` | HTML |
| Cucumber HTML | `target/cucumber-reports/` | HTML |
| Cucumber JSON | `target/cucumber-reports/Cucumber.json` | JSON |
| Surefire | `target/surefire-reports/` | XML + HTML |
| Screenshots | `target/screenshots/` | PNG |
| Logs | `target/logs/` | Text |

### Generate Reports

```bash
# Run tests + generate all reports
mvn clean verify

# Open Extent Report
open target/extent-reports/SparkReport.html

# Open Cucumber Report
open target/cucumber-reports/overview-features.html
```

---

## Author

**Praveen Asthana** - Banking QA Automation Engineer

## License

Internal Use - Banking QA Team

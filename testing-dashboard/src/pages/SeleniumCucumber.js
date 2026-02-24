import React, { useState } from 'react';

const TABS = [
  'Selenium WebDriver',
  'Cucumber BDD',
  'Page Object Model',
  'Test Automation Framework',
  'Cross-Browser Testing',
  'Interview Prep'
];

const SELENIUM_CONCEPTS = [
  {
    title: 'What is Selenium?',
    desc: 'Open-source browser automation framework for web application testing. Supports Java, Python, C#, JavaScript, Ruby.',
    details: [
      'Selenium WebDriver — directly communicates with browser',
      'Selenium Grid — parallel test execution across machines',
      'Selenium IDE — record/playback browser plugin',
      'Supports Chrome, Firefox, Safari, Edge, IE'
    ]
  },
  {
    title: 'WebDriver Setup (Java)',
    code: `// Maven dependency
<dependency>
  <groupId>org.seleniumhq.selenium</groupId>
  <artifactId>selenium-java</artifactId>
  <version>4.15.0</version>
</dependency>

// Basic test
WebDriver driver = new ChromeDriver();
driver.get("https://banking-app.com/login");
driver.findElement(By.id("username")).sendKeys("testuser");
driver.findElement(By.id("password")).sendKeys("Test@123");
driver.findElement(By.id("loginBtn")).click();
Assert.assertEquals(driver.getTitle(), "Dashboard");
driver.quit();`
  },
  {
    title: 'WebDriver Setup (Python)',
    code: `# pip install selenium
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://banking-app.com/login")
driver.find_element(By.ID, "username").send_keys("testuser")
driver.find_element(By.ID, "password").send_keys("Test@123")
driver.find_element(By.ID, "loginBtn").click()
assert driver.title == "Dashboard"
driver.quit()`
  },
  {
    title: 'Locator Strategies (Priority Order)',
    details: [
      '1. By.ID — fastest, most reliable: driver.findElement(By.id("submit"))',
      '2. By.NAME — form elements: By.name("username")',
      '3. By.CSS_SELECTOR — flexible: By.cssSelector(".btn-primary")',
      '4. By.XPATH — powerful: By.xpath("//input[@type=\'submit\']")',
      '5. By.LINK_TEXT — anchors: By.linkText("Forgot Password?")',
      '6. By.CLASS_NAME — By.className("error-msg")',
      '7. By.TAG_NAME — By.tagName("input")'
    ]
  },
  {
    title: 'Waits (Critical for Banking Apps)',
    code: `// Implicit Wait — applies globally
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

// Explicit Wait — condition-specific (PREFERRED)
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
WebElement balance = wait.until(
  ExpectedConditions.visibilityOfElementLocated(By.id("accountBalance"))
);

// Fluent Wait — custom polling
Wait<WebDriver> fluentWait = new FluentWait<>(driver)
  .withTimeout(Duration.ofSeconds(30))
  .pollingEvery(Duration.ofSeconds(2))
  .ignoring(NoSuchElementException.class);

// Common ExpectedConditions:
// visibilityOfElementLocated, elementToBeClickable,
// presenceOfElementLocated, titleContains,
// alertIsPresent, frameToBeAvailableAndSwitchToIt`
  },
  {
    title: 'Handling Banking UI Elements',
    code: `// Dropdown (Account Type)
Select accountType = new Select(driver.findElement(By.id("accType")));
accountType.selectByVisibleText("Savings Account");
accountType.selectByValue("savings");
accountType.selectByIndex(1);

// Alerts (Transaction Confirmation)
Alert alert = driver.switchTo().alert();
String alertText = alert.getText(); // "Confirm transfer of ₹50,000?"
alert.accept();  // Click OK
// alert.dismiss(); // Click Cancel

// Frames (OTP Verification)
driver.switchTo().frame("otpFrame");
driver.findElement(By.id("otp")).sendKeys("123456");
driver.switchTo().defaultContent();

// Multiple Windows (Print Statement)
String mainWindow = driver.getWindowHandle();
Set<String> windows = driver.getWindowHandles();
for (String w : windows) {
  if (!w.equals(mainWindow)) {
    driver.switchTo().window(w);
    // verify print preview
    driver.close();
  }
}
driver.switchTo().window(mainWindow);

// File Upload (KYC Document)
driver.findElement(By.id("kycUpload")).sendKeys("/path/to/aadhar.pdf");

// JavaScript Executor (Scroll to element)
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("arguments[0].scrollIntoView(true);", element);`
  },
  {
    title: 'Actions Class (Complex Interactions)',
    code: `Actions actions = new Actions(driver);

// Hover over account menu
actions.moveToElement(accountMenu).perform();

// Drag & drop (dashboard widgets)
actions.dragAndDrop(source, target).perform();

// Right-click (context menu)
actions.contextClick(element).perform();

// Double-click (edit mode)
actions.doubleClick(element).perform();

// Keyboard actions
actions.keyDown(Keys.CONTROL).click(elem1).click(elem2)
       .keyUp(Keys.CONTROL).perform();`
  }
];

const CUCUMBER_CONCEPTS = [
  {
    title: 'What is Cucumber BDD?',
    desc: 'Behavior-Driven Development framework that uses Gherkin syntax to write test scenarios in plain English. Bridges gap between business and QA.',
    details: [
      'Gherkin — Given/When/Then syntax for readable test scenarios',
      'Feature files (.feature) — business-readable test specifications',
      'Step Definitions — Java/Python code that implements Gherkin steps',
      'Hooks — @Before, @After for setup/teardown',
      'Tags — @smoke, @regression, @critical for test categorization',
      'Data Tables — parameterized test data',
      'Scenario Outline — data-driven testing with Examples'
    ]
  },
  {
    title: 'Feature File — Fund Transfer',
    code: `@banking @transfer @smoke
Feature: Fund Transfer Between Accounts
  As a banking customer
  I want to transfer funds between my accounts
  So that I can manage my money efficiently

  Background:
    Given I am logged in as customer "CUST001"
    And I have the following accounts:
      | Account       | Type    | Balance    |
      | ACC-SAV-001   | Savings | 150000.00  |
      | ACC-CUR-001   | Current | 500000.00  |

  @positive @critical
  Scenario: Successful fund transfer within own accounts
    Given I navigate to "Fund Transfer" page
    When I select source account "ACC-SAV-001"
    And I select destination account "ACC-CUR-001"
    And I enter transfer amount "25000"
    And I enter remarks "Monthly savings transfer"
    And I click "Transfer" button
    And I confirm the OTP "123456"
    Then I should see success message "Transfer Successful"
    And source account balance should be "125000.00"
    And destination account balance should be "525000.00"
    And transaction should appear in recent transactions

  @negative
  Scenario: Transfer with insufficient balance
    Given I navigate to "Fund Transfer" page
    When I select source account "ACC-SAV-001"
    And I select destination account "ACC-CUR-001"
    And I enter transfer amount "200000"
    And I click "Transfer" button
    Then I should see error "Insufficient balance"

  @negative
  Scenario Outline: Invalid transfer amounts
    When I enter transfer amount "<amount>"
    And I click "Transfer" button
    Then I should see error "<error_message>"

    Examples:
      | amount   | error_message                    |
      | 0        | Amount must be greater than zero |
      | -500     | Invalid amount                   |
      | abc      | Please enter a valid number      |
      | 10000001 | Exceeds daily transfer limit     |`
  },
  {
    title: 'Step Definitions (Java)',
    code: `public class FundTransferSteps {
    WebDriver driver;
    FundTransferPage transferPage;

    @Given("I am logged in as customer {string}")
    public void loginAsCustomer(String custId) {
        driver = new ChromeDriver();
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login(custId, "Test@123");
    }

    @Given("I navigate to {string} page")
    public void navigateToPage(String pageName) {
        driver.findElement(By.linkText(pageName)).click();
    }

    @When("I select source account {string}")
    public void selectSourceAccount(String account) {
        transferPage = new FundTransferPage(driver);
        transferPage.selectFromAccount(account);
    }

    @When("I enter transfer amount {string}")
    public void enterAmount(String amount) {
        transferPage.enterAmount(amount);
    }

    @Then("I should see success message {string}")
    public void verifySuccessMessage(String expected) {
        String actual = transferPage.getSuccessMessage();
        Assert.assertEquals(expected, actual);
    }

    @Then("source account balance should be {string}")
    public void verifySourceBalance(String expected) {
        String actual = transferPage.getSourceBalance();
        Assert.assertEquals(expected, actual);
    }

    @After
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}`
  },
  {
    title: 'Feature File — Customer Registration',
    code: `@banking @registration
Feature: New Customer Registration
  As a bank employee
  I want to register new customers
  So that they can access banking services

  @positive @smoke
  Scenario: Register new individual customer
    Given I am logged in as branch manager
    When I navigate to "Customer Registration" page
    And I fill in the registration form:
      | Field         | Value                |
      | First Name    | Rajesh               |
      | Last Name     | Kumar                |
      | DOB           | 1990-05-15           |
      | PAN           | ABCPK1234A           |
      | Aadhaar       | 1234-5678-9012       |
      | Mobile        | +91-9876543210       |
      | Email         | rajesh@email.com     |
      | Address       | 42 MG Road, Mumbai   |
      | Account Type  | Savings              |
    And I upload KYC documents
    And I click "Register" button
    Then customer should be created with status "pending_verification"
    And a welcome notification should be sent
    And audit log should record "CUSTOMER_CREATED"

  @negative
  Scenario: Duplicate PAN number
    Given customer with PAN "ABCPK1234A" already exists
    When I try to register with PAN "ABCPK1234A"
    Then I should see error "Customer with this PAN already exists"

  @boundary
  Scenario: Minor customer registration
    When I enter DOB as "2015-06-20"
    Then I should see "Minor account requires guardian details"
    And guardian information fields should be displayed`
  },
  {
    title: 'Cucumber Hooks & Tags',
    code: `// Hooks.java
public class Hooks {
    @Before("@banking")
    public void setupBankingTest() {
        // Initialize WebDriver
        // Set up test data
        // Clear previous test state
    }

    @Before("@smoke")
    public void taggedSetup() {
        System.out.println("Running smoke test...");
    }

    @After
    public void tearDown(Scenario scenario) {
        if (scenario.isFailed()) {
            // Take screenshot
            byte[] screenshot = ((TakesScreenshot) driver)
                .getScreenshotAs(OutputType.BYTES);
            scenario.attach(screenshot, "image/png", "failure");
        }
        driver.quit();
    }

    @AfterStep
    public void afterEachStep(Scenario scenario) {
        // Log step completion
        // Optionally take screenshot after each step
    }
}

// Running with tags:
// mvn test -Dcucumber.filter.tags="@smoke and @banking"
// mvn test -Dcucumber.filter.tags="@regression and not @slow"
// mvn test -Dcucumber.filter.tags="@critical or @smoke"`
  }
];

const POM_CONCEPTS = [
  {
    title: 'Page Object Model Pattern',
    desc: 'Design pattern that creates an object repository for web UI elements. Each page has a corresponding class with locators and methods.',
    details: [
      'Separation of test logic from page structure',
      'Reusable page methods across multiple tests',
      'Easy maintenance — change locator in one place',
      'Reduces code duplication by 60-80%',
      'Industry standard for Selenium automation'
    ]
  },
  {
    title: 'Banking POM Structure',
    code: `project/
├── src/test/java/
│   ├── pages/
│   │   ├── BasePage.java          # Common methods (click, type, wait)
│   │   ├── LoginPage.java         # Login form elements
│   │   ├── DashboardPage.java     # Dashboard widgets
│   │   ├── AccountsPage.java      # Account listing & details
│   │   ├── TransferPage.java      # Fund transfer form
│   │   ├── BillPaymentPage.java   # Bill payment form
│   │   ├── LoansPage.java         # Loan application
│   │   └── CardsPage.java         # Card management
│   ├── steps/
│   │   ├── LoginSteps.java
│   │   ├── TransferSteps.java
│   │   └── AccountSteps.java
│   ├── runners/
│   │   ├── SmokeTestRunner.java
│   │   └── RegressionRunner.java
│   ├── utils/
│   │   ├── DriverFactory.java     # WebDriver singleton
│   │   ├── ConfigReader.java      # Properties file reader
│   │   ├── ExcelReader.java       # Test data from Excel
│   │   └── ScreenshotUtil.java    # Screenshot on failure
│   └── resources/
│       ├── features/              # .feature files
│       ├── testdata/              # Excel/CSV test data
│       └── config.properties      # URLs, credentials
└── pom.xml`
  },
  {
    title: 'BasePage.java',
    code: `public class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        PageFactory.initElements(driver, this);
    }

    protected void click(WebElement element) {
        wait.until(ExpectedConditions.elementToBeClickable(element));
        element.click();
    }

    protected void type(WebElement element, String text) {
        wait.until(ExpectedConditions.visibilityOf(element));
        element.clear();
        element.sendKeys(text);
    }

    protected String getText(WebElement element) {
        wait.until(ExpectedConditions.visibilityOf(element));
        return element.getText();
    }

    protected void selectDropdown(WebElement element, String value) {
        new Select(element).selectByVisibleText(value);
    }

    protected boolean isDisplayed(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    protected void waitForPageLoad() {
        wait.until(d -> ((JavascriptExecutor) d)
            .executeScript("return document.readyState").equals("complete"));
    }
}`
  },
  {
    title: 'LoginPage.java (Example)',
    code: `public class LoginPage extends BasePage {
    @FindBy(id = "username")
    private WebElement usernameField;

    @FindBy(id = "password")
    private WebElement passwordField;

    @FindBy(id = "loginBtn")
    private WebElement loginButton;

    @FindBy(css = ".error-message")
    private WebElement errorMessage;

    @FindBy(linkText = "Forgot Password?")
    private WebElement forgotPasswordLink;

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public DashboardPage login(String username, String password) {
        type(usernameField, username);
        type(passwordField, password);
        click(loginButton);
        return new DashboardPage(driver);
    }

    public String getErrorMessage() {
        return getText(errorMessage);
    }

    public boolean isLoginPageDisplayed() {
        return isDisplayed(loginButton);
    }

    public ForgotPasswordPage clickForgotPassword() {
        click(forgotPasswordLink);
        return new ForgotPasswordPage(driver);
    }
}`
  },
  {
    title: 'TransferPage.java (Banking Example)',
    code: `public class TransferPage extends BasePage {
    @FindBy(id = "fromAccount")
    private WebElement fromAccountDropdown;

    @FindBy(id = "toAccount")
    private WebElement toAccountDropdown;

    @FindBy(id = "amount")
    private WebElement amountField;

    @FindBy(id = "remarks")
    private WebElement remarksField;

    @FindBy(id = "transferBtn")
    private WebElement transferButton;

    @FindBy(css = ".success-msg")
    private WebElement successMessage;

    @FindBy(css = ".balance-display")
    private WebElement balanceDisplay;

    public TransferPage(WebDriver driver) {
        super(driver);
    }

    public void selectFromAccount(String account) {
        selectDropdown(fromAccountDropdown, account);
    }

    public void selectToAccount(String account) {
        selectDropdown(toAccountDropdown, account);
    }

    public void enterAmount(String amount) {
        type(amountField, amount);
    }

    public void enterRemarks(String remarks) {
        type(remarksField, remarks);
    }

    public void clickTransfer() {
        click(transferButton);
    }

    public String getSuccessMessage() {
        return getText(successMessage);
    }

    public String getBalance() {
        return getText(balanceDisplay);
    }

    public void performTransfer(String from, String to,
                                 String amount, String remarks) {
        selectFromAccount(from);
        selectToAccount(to);
        enterAmount(amount);
        enterRemarks(remarks);
        clickTransfer();
    }
}`
  }
];

const FRAMEWORK_CONCEPTS = [
  {
    title: 'Test Automation Framework Architecture',
    desc: 'A structured automation framework combines Selenium + Cucumber + POM with supporting utilities for a complete testing solution.',
    structure: `
┌─────────────────────────────────────────────────────┐
│                  Test Runner (JUnit/TestNG)           │
├─────────────────────────────────────────────────────┤
│           Cucumber Feature Files (.feature)           │
├─────────────────────────────────────────────────────┤
│              Step Definitions (Glue Code)             │
├──────────┬──────────────┬────────────────────────────┤
│  Page    │  Utilities   │     Test Data Manager      │
│  Objects │  (Waits,     │     (Excel, JSON, CSV,     │
│  (POM)   │  Screenshots,│      DB queries)           │
│          │  Logger)     │                            │
├──────────┴──────────────┴────────────────────────────┤
│            WebDriver Factory (Browser Config)         │
├─────────────────────────────────────────────────────┤
│         Config Manager (Properties/YAML)              │
├─────────────────────────────────────────────────────┤
│    Reporting (Extent Reports / Allure / Cucumber)     │
└─────────────────────────────────────────────────────┘`
  },
  {
    title: 'TestNG Configuration (testng.xml)',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<suite name="Banking Test Suite" parallel="tests" thread-count="3">

  <test name="Smoke Tests">
    <parameter name="browser" value="chrome"/>
    <parameter name="env" value="staging"/>
    <classes>
      <class name="runners.SmokeTestRunner"/>
    </classes>
  </test>

  <test name="Regression Tests">
    <parameter name="browser" value="firefox"/>
    <classes>
      <class name="runners.RegressionTestRunner"/>
    </classes>
  </test>

  <test name="Cross-Browser Chrome">
    <parameter name="browser" value="chrome"/>
    <classes>
      <class name="runners.CrossBrowserRunner"/>
    </classes>
  </test>

  <test name="Cross-Browser Firefox">
    <parameter name="browser" value="firefox"/>
    <classes>
      <class name="runners.CrossBrowserRunner"/>
    </classes>
  </test>

  <listeners>
    <listener class-name="utils.TestListener"/>
    <listener class-name="utils.RetryAnalyzer"/>
  </listeners>
</suite>`
  },
  {
    title: 'DriverFactory.java',
    code: `public class DriverFactory {
    private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    public static WebDriver getDriver() {
        return driver.get();
    }

    public static void initDriver(String browser) {
        WebDriver webDriver;
        switch (browser.toLowerCase()) {
            case "chrome":
                ChromeOptions chromeOpts = new ChromeOptions();
                chromeOpts.addArguments("--start-maximized");
                chromeOpts.addArguments("--disable-notifications");
                // chromeOpts.addArguments("--headless"); // for CI
                webDriver = new ChromeDriver(chromeOpts);
                break;
            case "firefox":
                FirefoxOptions ffOpts = new FirefoxOptions();
                webDriver = new FirefoxDriver(ffOpts);
                break;
            case "edge":
                webDriver = new EdgeDriver();
                break;
            default:
                throw new RuntimeException("Browser not supported: " + browser);
        }
        webDriver.manage().window().maximize();
        webDriver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        webDriver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
        driver.set(webDriver);
    }

    public static void quitDriver() {
        if (driver.get() != null) {
            driver.get().quit();
            driver.remove();
        }
    }
}

// For Selenium Grid (remote execution):
// DesiredCapabilities caps = new DesiredCapabilities();
// caps.setBrowserName("chrome");
// WebDriver driver = new RemoteWebDriver(
//     new URL("http://grid-hub:4444/wd/hub"), caps);`
  },
  {
    title: 'Reporting with Extent Reports',
    code: `public class ExtentReportManager {
    private static ExtentReports extent;
    private static ThreadLocal<ExtentTest> test = new ThreadLocal<>();

    public static void initReport() {
        ExtentSparkReporter spark = new ExtentSparkReporter("reports/");
        spark.config().setTheme(Theme.DARK);
        spark.config().setDocumentTitle("Banking QA Report");
        spark.config().setReportName("Automation Execution Report");

        extent = new ExtentReports();
        extent.attachReporter(spark);
        extent.setSystemInfo("Application", "Banking Portal");
        extent.setSystemInfo("Environment", "Staging");
        extent.setSystemInfo("Browser", "Chrome 120");
        extent.setSystemInfo("Tester", "QA Team");
    }

    public static void createTest(String name) {
        ExtentTest extTest = extent.createTest(name);
        test.set(extTest);
    }

    public static void logPass(String message) {
        test.get().pass(message);
    }

    public static void logFail(String message, String screenshot) {
        test.get().fail(message)
            .addScreenCaptureFromPath(screenshot);
    }

    public static void flush() {
        extent.flush();
    }
}`
  },
  {
    title: 'Data-Driven Testing with Excel',
    code: `// ExcelReader.java
public class ExcelReader {
    public static Object[][] readTestData(String filePath, String sheet) {
        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook wb = new XSSFWorkbook(fis)) {

            Sheet sh = wb.getSheet(sheet);
            int rows = sh.getLastRowNum();
            int cols = sh.getRow(0).getLastCellNum();

            Object[][] data = new Object[rows][cols];
            for (int i = 1; i <= rows; i++) {
                Row row = sh.getRow(i);
                for (int j = 0; j < cols; j++) {
                    Cell cell = row.getCell(j);
                    data[i-1][j] = getCellValue(cell);
                }
            }
            return data;
        }
    }
}

// Usage in TestNG:
@DataProvider(name = "transferData")
public Object[][] getTransferData() {
    return ExcelReader.readTestData(
        "testdata/transfers.xlsx", "ValidTransfers");
}

@Test(dataProvider = "transferData")
public void testFundTransfer(String from, String to,
                              String amount, String expected) {
    TransferPage page = new TransferPage(driver);
    page.performTransfer(from, to, amount, "Test");
    Assert.assertEquals(page.getSuccessMessage(), expected);
}`
  }
];

const CROSS_BROWSER = [
  {
    title: 'Selenium Grid Setup',
    code: `# docker-compose.yml for Selenium Grid
version: '3'
services:
  hub:
    image: selenium/hub:4.15.0
    ports:
      - "4444:4444"
    environment:
      - GRID_MAX_SESSION=10

  chrome:
    image: selenium/node-chrome:4.15.0
    depends_on:
      - hub
    environment:
      - SE_EVENT_BUS_HOST=hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=3

  firefox:
    image: selenium/node-firefox:4.15.0
    depends_on:
      - hub
    environment:
      - SE_EVENT_BUS_HOST=hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443

  edge:
    image: selenium/node-edge:4.15.0
    depends_on:
      - hub
    environment:
      - SE_EVENT_BUS_HOST=hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443`
  },
  {
    title: 'Cross-Browser Test Matrix',
    matrix: [
      { browser: 'Chrome', versions: '118, 119, 120', os: 'Windows 10/11, macOS, Linux', priority: 'P0' },
      { browser: 'Firefox', versions: '118, 119, 120', os: 'Windows 10/11, macOS, Linux', priority: 'P0' },
      { browser: 'Safari', versions: '16, 17', os: 'macOS Ventura/Sonoma', priority: 'P1' },
      { browser: 'Edge', versions: '118, 119, 120', os: 'Windows 10/11', priority: 'P1' },
      { browser: 'Chrome Mobile', versions: 'Latest', os: 'Android 12/13/14', priority: 'P1' },
      { browser: 'Safari Mobile', versions: 'Latest', os: 'iOS 16/17', priority: 'P1' }
    ]
  },
  {
    title: 'BrowserStack / Sauce Labs Integration',
    code: `// BrowserStack remote execution
DesiredCapabilities caps = new DesiredCapabilities();
caps.setCapability("os", "Windows");
caps.setCapability("os_version", "11");
caps.setCapability("browser", "Chrome");
caps.setCapability("browser_version", "120.0");
caps.setCapability("browserstack.local", "true");
caps.setCapability("project", "Banking QA");
caps.setCapability("build", "Sprint-24");

WebDriver driver = new RemoteWebDriver(
    new URL("https://user:key@hub-cloud.browserstack.com/wd/hub"),
    caps
);

// Parallel execution across 5 browser configs
// Total tests: 150 × 5 browsers = 750 executions
// Sequential time: ~12 hours
// Parallel time (5 nodes): ~2.5 hours`
  }
];

const INTERVIEW_QA = [
  { q: 'What is the difference between findElement() and findElements()?', a: 'findElement() returns first matching WebElement or throws NoSuchElementException. findElements() returns List<WebElement> (empty list if none found, never throws exception).' },
  { q: 'How do you handle dynamic elements in banking apps?', a: 'Use explicit waits with ExpectedConditions, CSS selectors with partial matching (contains, starts-with), or XPath with dynamic attributes. For OTP timers, use FluentWait with custom polling.' },
  { q: 'Explain POM and why it\'s used in banking projects.', a: 'Page Object Model separates test logic from page structure. In banking, frequent UI changes (compliance, regulations) make POM critical — update locator in one place instead of 50 tests.' },
  { q: 'What is the difference between @Before and Background in Cucumber?', a: '@Before is a Java hook that runs before each scenario (setup/teardown). Background is a Gherkin keyword with steps that run before each scenario in the feature file (visible in reports).' },
  { q: 'How do you handle file uploads in Selenium?', a: 'Use sendKeys() on the file input element with absolute file path. For non-standard uploads (drag-drop), use Robot class or AutoIT scripts.' },
  { q: 'What is Selenium Grid and when would you use it?', a: 'Selenium Grid enables parallel test execution across multiple machines/browsers. Used for cross-browser testing and reducing total execution time. Hub distributes tests to registered nodes.' },
  { q: 'How do you handle StaleElementReferenceException?', a: 'Re-locate the element, use explicit waits, or implement retry logic. Common when page refreshes or DOM updates after AJAX calls (e.g., balance update after transfer).' },
  { q: 'Explain data-driven testing with Cucumber.', a: 'Use Scenario Outline with Examples table for parameterized data. For larger datasets, use DataProvider (TestNG) or @DataProvider annotation with Excel/CSV readers.' },
  { q: 'What is the difference between Cucumber and TestNG?', a: 'Cucumber is a BDD framework (business-readable Gherkin). TestNG is a testing framework (annotations, parallel execution, data providers). They complement each other — Cucumber for BDD scenarios, TestNG for execution management.' },
  { q: 'How do you handle SSL certificate errors?', a: 'ChromeOptions: --ignore-certificate-errors or setAcceptInsecureCerts(true). FirefoxProfile: setAcceptUntrustedCertificates(true). Never use in production testing — only in dev/staging.' }
];

export default function SeleniumCucumber() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});

  const toggle = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderConceptCard = (item, idx, prefix) => {
    const key = `${prefix}-${idx}`;
    const isOpen = expandedItems[key];
    return (
      <div key={key} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12, overflow: 'hidden' }}>
        <div
          onClick={() => toggle(key)}
          style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isOpen ? '#f0f4ff' : '#fff' }}
        >
          <div>
            <strong style={{ fontSize: 15 }}>{item.title}</strong>
            {item.desc && <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{item.desc}</div>}
          </div>
          <span style={{ fontSize: 18, color: '#64748b' }}>{isOpen ? '\u25B2' : '\u25BC'}</span>
        </div>
        {isOpen && (
          <div style={{ padding: '0 18px 16px', borderTop: '1px solid #e2e8f0' }}>
            {item.details && (
              <ul style={{ margin: '12px 0', paddingLeft: 20 }}>
                {item.details.map((d, i) => <li key={i} style={{ marginBottom: 6, fontSize: 14, color: '#334155' }}>{d}</li>)}
              </ul>
            )}
            {item.code && (
              <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 16, borderRadius: 6, fontSize: 12.5, overflowX: 'auto', margin: '12px 0', lineHeight: 1.5 }}>
                {item.code}
              </pre>
            )}
            {item.structure && (
              <pre style={{ background: '#0f172a', color: '#38bdf8', padding: 16, borderRadius: 6, fontSize: 12, overflowX: 'auto', margin: '12px 0', lineHeight: 1.4 }}>
                {item.structure}
              </pre>
            )}
            {item.matrix && (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Browser</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Versions</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>OS</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {item.matrix.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>{row.browser}</td>
                      <td style={{ padding: '8px 12px' }}>{row.versions}</td>
                      <td style={{ padding: '8px 12px' }}>{row.os}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{ background: row.priority === 'P0' ? '#dc2626' : '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{row.priority}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTab = () => {
    switch (activeTab) {
      case 0:
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Selenium WebDriver — Banking Automation</h3>
            {SELENIUM_CONCEPTS.map((item, i) => renderConceptCard(item, i, 'sel'))}
          </div>
        );
      case 1:
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Cucumber BDD — Behavior-Driven Testing</h3>
            {CUCUMBER_CONCEPTS.map((item, i) => renderConceptCard(item, i, 'cuc'))}
          </div>
        );
      case 2:
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Page Object Model (POM) Design Pattern</h3>
            {POM_CONCEPTS.map((item, i) => renderConceptCard(item, i, 'pom'))}
          </div>
        );
      case 3:
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Test Automation Framework</h3>
            {FRAMEWORK_CONCEPTS.map((item, i) => renderConceptCard(item, i, 'fw'))}
          </div>
        );
      case 4:
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Cross-Browser Testing</h3>
            {CROSS_BROWSER.map((item, i) => renderConceptCard(item, i, 'cb'))}
          </div>
        );
      case 5:
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Selenium & Cucumber Interview Q&A</h3>
            {INTERVIEW_QA.map((item, i) => (
              <div key={i} onClick={() => toggle(`int-${i}`)} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 10, cursor: 'pointer', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: '#4f46e5', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {i + 1}
                      </span>
                      <strong style={{ fontSize: 14 }}>{item.q}</strong>
                    </div>
                    {expandedItems[`int-${i}`] && (
                      <div style={{ marginTop: 10, padding: '10px 14px', background: '#f0fdf4', borderRadius: 6, fontSize: 13, color: '#166534', lineHeight: 1.6, marginLeft: 32 }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 14, color: '#94a3b8', marginLeft: 8 }}>{expandedItems[`int-${i}`] ? '\u25B2' : '\u25BC'}</span>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Selenium & Cucumber Testing Guide</h2>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
          Complete automation testing guide with Selenium WebDriver, Cucumber BDD, Page Object Model, and banking-specific test scenarios
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20, borderBottom: '2px solid #e2e8f0', paddingBottom: 12 }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: activeTab === i ? '#4f46e5' : '#f1f5f9',
              color: activeTab === i ? '#fff' : '#475569'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}

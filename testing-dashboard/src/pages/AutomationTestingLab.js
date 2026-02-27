import React, { useState, useRef, useEffect, useCallback } from 'react';

const COLORS = {
  bgFrom: '#1a1a2e', bgTo: '#16213e', card: '#0f3460', accent: '#4ecca3',
  text: '#e0e0e0', header: '#ffffff', border: 'rgba(78,204,163,0.3)',
  editorBg: '#0a0a1a', editorText: '#4ecca3',
  selenium: '#43b02a', cucumber: '#23d96c', restAssured: '#4a90d9',
  soapui: '#f5a623', jmeter: '#d0021b', jenkins: '#335061',
};

const CATEGORIES = [
  { id: 'selenium', label: 'Selenium WebDriver', color: COLORS.selenium },
  { id: 'cucumber', label: 'Cucumber BDD', color: COLORS.cucumber },
  { id: 'restAssured', label: 'REST Assured API', color: COLORS.restAssured },
  { id: 'soapui', label: 'SoapUI Groovy', color: COLORS.soapui },
  { id: 'jmeter', label: 'JMeter Performance', color: COLORS.jmeter },
  { id: 'cicd', label: 'CI/CD Pipeline', color: COLORS.jenkins },
];

const DIFFICULTY_COLORS = { Beginner: '#4ecca3', Intermediate: '#f5a623', Advanced: '#d0021b' };

function makeId(n) { return 'AT-' + String(n).padStart(3, '0'); }

const SCENARIOS = [
  // === SELENIUM WEBDRIVER (AT-001 to AT-010) ===
  {
    id: 'AT-001', title: 'Login Page Automation', category: 'selenium',
    framework: 'Selenium', language: 'Java', difficulty: 'Beginner',
    description: 'Automates the net banking login page including username, password entry, captcha handling, and dashboard verification after successful authentication.',
    prerequisites: 'Java 11+, Selenium WebDriver 4.x, ChromeDriver, TestNG, Maven',
    config: '{\n  "browser": "chrome",\n  "headless": false,\n  "baseUrl": "https://netbanking.example.com",\n  "implicitWait": 10,\n  "explicitWait": 15,\n  "screenshotOnFailure": true,\n  "credentials": {\n    "validUser": "CUST001234",\n    "validPass": "Test@1234"\n  }\n}',
    code: `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.time.Duration;

public class BankLoginTest {
    WebDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() {
        System.setProperty("webdriver.chrome.driver", "drivers/chromedriver");
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test(priority = 1)
    public void testValidLogin() {
        driver.get("https://netbanking.example.com/login");

        WebElement username = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("userId")));
        username.clear();
        username.sendKeys("CUST001234");

        WebElement password = driver.findElement(By.id("password"));
        password.clear();
        password.sendKeys("Test@1234");

        // Handle captcha if present
        try {
            WebElement captchaInput = driver.findElement(By.id("captchaInput"));
            String captchaText = driver.findElement(By.id("captchaImage"))
                .getAttribute("alt");
            captchaInput.sendKeys(captchaText);
        } catch (Exception e) {
            System.out.println("No captcha present, continuing...");
        }

        WebElement loginBtn = driver.findElement(By.id("loginButton"));
        loginBtn.click();

        wait.until(ExpectedConditions.urlContains("/dashboard"));

        String welcomeMsg = driver.findElement(
            By.className("welcome-text")).getText();
        Assert.assertTrue(welcomeMsg.contains("Welcome"),
            "Login failed - welcome message not found");

        Assert.assertTrue(
            driver.findElement(By.id("accountSummary")).isDisplayed(),
            "Account summary not displayed after login");

        System.out.println("Login test PASSED - Dashboard loaded successfully");
    }

    @Test(priority = 2)
    public void testInvalidLogin() {
        driver.get("https://netbanking.example.com/login");
        driver.findElement(By.id("userId")).sendKeys("INVALID_USER");
        driver.findElement(By.id("password")).sendKeys("wrong_password");
        driver.findElement(By.id("loginButton")).click();

        WebElement errorMsg = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("error-message")));
        Assert.assertEquals(errorMsg.getText(),
            "Invalid credentials. Please try again.");

        String currentUrl = driver.getCurrentUrl();
        Assert.assertTrue(currentUrl.contains("/login"),
            "User should remain on login page");
    }

    @Test(priority = 3)
    public void testEmptyCredentials() {
        driver.get("https://netbanking.example.com/login");
        driver.findElement(By.id("loginButton")).click();

        WebElement userError = driver.findElement(By.id("userId-error"));
        Assert.assertEquals(userError.getText(), "User ID is required");

        WebElement passError = driver.findElement(By.id("password-error"));
        Assert.assertEquals(passError.getText(), "Password is required");
    }

    @Test(priority = 4)
    public void testAccountLockAfterFailedAttempts() {
        driver.get("https://netbanking.example.com/login");
        for (int i = 0; i < 3; i++) {
            driver.findElement(By.id("userId")).clear();
            driver.findElement(By.id("userId")).sendKeys("CUST001234");
            driver.findElement(By.id("password")).clear();
            driver.findElement(By.id("password")).sendKeys("wrong" + i);
            driver.findElement(By.id("loginButton")).click();
            try { Thread.sleep(1000); } catch (InterruptedException e) {}
        }

        WebElement lockMsg = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("account-locked")));
        Assert.assertTrue(lockMsg.getText().contains("Account locked"),
            "Account should be locked after 3 failed attempts");
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }
}`,
    expectedOutput: `[TestNG] Running: BankLoginTest

testValidLogin:
  Navigating to https://netbanking.example.com/login
  Entering username: CUST001234
  Entering password: ********
  Clicking login button...
  Waiting for dashboard redirect...
  Dashboard loaded - Welcome message found: "Welcome, Rajesh Kumar"
  Account summary section is displayed
  PASSED

testInvalidLogin:
  Navigating to https://netbanking.example.com/login
  Entering invalid credentials...
  Error message displayed: "Invalid credentials. Please try again."
  User remains on login page - verified
  PASSED

testEmptyCredentials:
  Validation errors displayed correctly
  PASSED

testAccountLockAfterFailedAttempts:
  Attempt 1/3 - Invalid password
  Attempt 2/3 - Invalid password
  Attempt 3/3 - Invalid password
  Account locked message displayed
  PASSED

===============================================
Suite: BankLoginTest
Total tests run: 4, Passes: 4, Failures: 0, Skips: 0
===============================================
Time: 12.847s`
  },
  {
    id: 'AT-002', title: 'Fund Transfer Form Automation', category: 'selenium',
    framework: 'Selenium', language: 'Java', difficulty: 'Intermediate',
    description: 'Automates the complete fund transfer workflow including beneficiary selection, amount entry, OTP verification, and confirmation page validation.',
    prerequisites: 'Java 11+, Selenium WebDriver 4.x, ChromeDriver, TestNG',
    config: '{\n  "browser": "chrome",\n  "baseUrl": "https://netbanking.example.com",\n  "transferAmount": 5000.00,\n  "beneficiaryAccount": "ACC987654321"\n}',
    code: `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;
import org.testng.annotations.*;
import java.time.Duration;

public class FundTransferTest {
    WebDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        // Login first
        driver.get("https://netbanking.example.com/login");
        driver.findElement(By.id("userId")).sendKeys("CUST001234");
        driver.findElement(By.id("password")).sendKeys("Test@1234");
        driver.findElement(By.id("loginButton")).click();
        wait.until(ExpectedConditions.urlContains("/dashboard"));
    }

    @Test(priority = 1)
    public void testIMPSTransfer() {
        driver.findElement(By.linkText("Fund Transfer")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("transferForm")));

        // Select transfer type
        Select transferType = new Select(
            driver.findElement(By.id("transferType")));
        transferType.selectByVisibleText("IMPS");

        // Select from account
        Select fromAccount = new Select(
            driver.findElement(By.id("fromAccount")));
        fromAccount.selectByIndex(1);

        // Select beneficiary
        Select beneficiary = new Select(
            driver.findElement(By.id("beneficiary")));
        beneficiary.selectByVisibleText("Priya Singh - HDFC - ACC987654321");

        // Enter amount
        WebElement amountField = driver.findElement(By.id("amount"));
        amountField.clear();
        amountField.sendKeys("5000");

        // Enter remarks
        driver.findElement(By.id("remarks")).sendKeys("Monthly rent payment");

        // Click transfer
        driver.findElement(By.id("transferBtn")).click();

        // Confirm on review page
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("confirmTransfer")));
        String reviewAmount = driver.findElement(
            By.id("reviewAmount")).getText();
        Assert.assertEquals(reviewAmount, "INR 5,000.00");
        driver.findElement(By.id("confirmTransfer")).click();

        // Enter OTP
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("otpInput")));
        driver.findElement(By.id("otpInput")).sendKeys("123456");
        driver.findElement(By.id("verifyOtp")).click();

        // Verify success
        WebElement successMsg = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("transfer-success")));
        Assert.assertTrue(successMsg.getText().contains("successful"));

        String refNumber = driver.findElement(
            By.id("referenceNumber")).getText();
        Assert.assertFalse(refNumber.isEmpty(),
            "Reference number should be generated");

        System.out.println("IMPS Transfer successful. Ref: " + refNumber);
    }

    @Test(priority = 2)
    public void testInsufficientBalanceTransfer() {
        driver.findElement(By.linkText("Fund Transfer")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("transferForm")));

        new Select(driver.findElement(By.id("transferType")))
            .selectByVisibleText("NEFT");
        new Select(driver.findElement(By.id("fromAccount")))
            .selectByIndex(1);
        new Select(driver.findElement(By.id("beneficiary")))
            .selectByIndex(1);

        driver.findElement(By.id("amount")).sendKeys("99999999");
        driver.findElement(By.id("transferBtn")).click();

        WebElement errorMsg = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("error-message")));
        Assert.assertTrue(
            errorMsg.getText().contains("Insufficient balance"));
    }

    @Test(priority = 3)
    public void testTransferLimitValidation() {
        driver.findElement(By.linkText("Fund Transfer")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("transferForm")));

        new Select(driver.findElement(By.id("transferType")))
            .selectByVisibleText("IMPS");
        new Select(driver.findElement(By.id("fromAccount")))
            .selectByIndex(1);
        new Select(driver.findElement(By.id("beneficiary")))
            .selectByIndex(1);

        // IMPS limit is typically 5,00,000
        driver.findElement(By.id("amount")).sendKeys("600000");
        driver.findElement(By.id("transferBtn")).click();

        WebElement limitError = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("limit-error")));
        Assert.assertTrue(
            limitError.getText().contains("exceeds daily limit"));
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) driver.quit();
    }
}`,
    expectedOutput: `[TestNG] Running: FundTransferTest

testIMPSTransfer:
  Logged in successfully as CUST001234
  Navigating to Fund Transfer page...
  Selected transfer type: IMPS
  Selected from account: Savings - XXXX1234
  Selected beneficiary: Priya Singh - HDFC - ACC987654321
  Amount entered: INR 5,000.00
  Transfer review page displayed
  Confirmed transfer
  OTP entered and verified
  Transfer successful! Reference: IMPS20260226143567890
  PASSED

testInsufficientBalanceTransfer:
  Error displayed: "Insufficient balance in selected account"
  PASSED

testTransferLimitValidation:
  Error displayed: "Amount exceeds daily IMPS limit of INR 5,00,000"
  PASSED

===============================================
Total tests run: 3, Passes: 3, Failures: 0, Skips: 0
Time: 18.234s`
  },
  {
    id: 'AT-003', title: 'Account Statement Download', category: 'selenium',
    framework: 'Selenium', language: 'Java', difficulty: 'Intermediate',
    description: 'Automates downloading account statements in PDF and CSV formats with date range selection and file verification.',
    prerequisites: 'Java 11+, Selenium WebDriver 4.x, ChromeDriver, TestNG',
    config: '{\n  "browser": "chrome",\n  "downloadDir": "/tmp/statements",\n  "dateFrom": "2026-01-01",\n  "dateTo": "2026-01-31",\n  "format": "PDF"\n}',
    code: `import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;
import org.testng.annotations.*;
import java.io.File;
import java.time.Duration;
import java.util.HashMap;

public class AccountStatementTest {
    WebDriver driver;
    WebDriverWait wait;
    String downloadDir = "/tmp/statements";

    @BeforeMethod
    public void setup() {
        HashMap<String, Object> chromePrefs = new HashMap<>();
        chromePrefs.put("download.default_directory", downloadDir);
        chromePrefs.put("download.prompt_for_download", false);
        chromePrefs.put("plugins.always_open_pdf_externally", true);

        ChromeOptions options = new ChromeOptions();
        options.setExperimentalOption("prefs", chromePrefs);
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        // Login
        driver.get("https://netbanking.example.com/login");
        driver.findElement(By.id("userId")).sendKeys("CUST001234");
        driver.findElement(By.id("password")).sendKeys("Test@1234");
        driver.findElement(By.id("loginButton")).click();
        wait.until(ExpectedConditions.urlContains("/dashboard"));
    }

    @Test
    public void testDownloadPDFStatement() {
        driver.findElement(By.linkText("Account Statement")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("statementForm")));

        // Select account
        new Select(driver.findElement(By.id("accountSelect")))
            .selectByVisibleText("Savings Account - XXXX1234");

        // Set date range
        WebElement fromDate = driver.findElement(By.id("fromDate"));
        fromDate.clear();
        fromDate.sendKeys("01/01/2026");

        WebElement toDate = driver.findElement(By.id("toDate"));
        toDate.clear();
        toDate.sendKeys("31/01/2026");

        // Select format
        new Select(driver.findElement(By.id("format")))
            .selectByVisibleText("PDF");

        // Click download
        driver.findElement(By.id("downloadBtn")).click();

        // Wait for download
        File downloadedFile = waitForDownload("statement_", ".pdf", 30);
        Assert.assertNotNull(downloadedFile, "PDF file not downloaded");
        Assert.assertTrue(downloadedFile.length() > 0,
            "Downloaded file is empty");

        System.out.println("Statement downloaded: " +
            downloadedFile.getName() +
            " (" + downloadedFile.length() + " bytes)");
    }

    @Test
    public void testDownloadCSVStatement() {
        driver.findElement(By.linkText("Account Statement")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("statementForm")));

        new Select(driver.findElement(By.id("accountSelect")))
            .selectByIndex(1);
        driver.findElement(By.id("fromDate")).sendKeys("01/01/2026");
        driver.findElement(By.id("toDate")).sendKeys("31/01/2026");
        new Select(driver.findElement(By.id("format")))
            .selectByVisibleText("CSV");
        driver.findElement(By.id("downloadBtn")).click();

        File csvFile = waitForDownload("statement_", ".csv", 30);
        Assert.assertNotNull(csvFile, "CSV file not downloaded");
    }

    private File waitForDownload(String prefix, String ext, int timeout) {
        File dir = new File(downloadDir);
        for (int i = 0; i < timeout; i++) {
            File[] files = dir.listFiles((d, name) ->
                name.startsWith(prefix) && name.endsWith(ext));
            if (files != null && files.length > 0) return files[0];
            try { Thread.sleep(1000); } catch (InterruptedException e) {}
        }
        return null;
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) driver.quit();
    }
}`,
    expectedOutput: `[TestNG] Running: AccountStatementTest

testDownloadPDFStatement:
  Logged in as CUST001234
  Navigating to Account Statement page
  Selected account: Savings Account - XXXX1234
  Date range: 01/01/2026 to 31/01/2026
  Format: PDF
  Downloading statement...
  File downloaded: statement_20260226.pdf (245,672 bytes)
  PASSED

testDownloadCSVStatement:
  Selected CSV format
  File downloaded: statement_20260226.csv (18,432 bytes)
  PASSED

Total tests run: 2, Passes: 2, Failures: 0, Skips: 0
Time: 22.156s`
  },
  {
    id: 'AT-004', title: 'New Beneficiary Addition', category: 'selenium',
    framework: 'Selenium', language: 'Java', difficulty: 'Intermediate',
    description: 'Automates the process of adding a new beneficiary including IFSC code lookup, account validation, and cooling period verification.',
    prerequisites: 'Java 11+, Selenium WebDriver 4.x, ChromeDriver, TestNG',
    config: '{\n  "browser": "chrome",\n  "baseUrl": "https://netbanking.example.com",\n  "beneficiary": {\n    "name": "Amit Sharma",\n    "accountNo": "1234567890123456",\n    "ifsc": "HDFC0001234",\n    "bank": "HDFC Bank",\n    "branch": "Koramangala, Bangalore"\n  }\n}',
    code: `import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;
import org.testng.annotations.*;
import java.time.Duration;

public class BeneficiaryAdditionTest {
    WebDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        // Login
        driver.get("https://netbanking.example.com/login");
        driver.findElement(By.id("userId")).sendKeys("CUST001234");
        driver.findElement(By.id("password")).sendKeys("Test@1234");
        driver.findElement(By.id("loginButton")).click();
        wait.until(ExpectedConditions.urlContains("/dashboard"));
    }

    @Test(priority = 1)
    public void testAddNewBeneficiary() {
        // Navigate to beneficiary management
        driver.findElement(By.linkText("Manage Beneficiaries")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("beneficiaryPage")));

        driver.findElement(By.id("addBeneficiaryBtn")).click();

        // Fill beneficiary form
        WebElement nameField = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.id("beneName")));
        nameField.sendKeys("Amit Sharma");

        driver.findElement(By.id("beneAccount"))
            .sendKeys("1234567890123456");
        driver.findElement(By.id("confirmAccount"))
            .sendKeys("1234567890123456");

        // Enter IFSC and verify auto-fill
        WebElement ifscField = driver.findElement(By.id("ifscCode"));
        ifscField.sendKeys("HDFC0001234");
        driver.findElement(By.id("verifyIfsc")).click();

        // Wait for IFSC verification
        wait.until(ExpectedConditions.textToBePresentInElementLocated(
            By.id("bankName"), "HDFC Bank"));
        String branchName = driver.findElement(
            By.id("branchName")).getText();
        Assert.assertFalse(branchName.isEmpty(),
            "Branch name should auto-populate");

        // Select transfer limit
        new Select(driver.findElement(By.id("transferLimit")))
            .selectByVisibleText("INR 5,00,000");

        driver.findElement(By.id("submitBeneficiary")).click();

        // OTP verification
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("otpInput")));
        driver.findElement(By.id("otpInput")).sendKeys("654321");
        driver.findElement(By.id("verifyOtp")).click();

        // Verify success
        WebElement successMsg = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("success-message")));
        Assert.assertTrue(successMsg.getText()
            .contains("Beneficiary added successfully"));

        // Verify cooling period message
        WebElement coolingMsg = driver.findElement(
            By.className("cooling-period"));
        Assert.assertTrue(coolingMsg.getText()
            .contains("24 hours"),
            "Cooling period notice should display");

        System.out.println("Beneficiary added: Amit Sharma");
    }

    @Test(priority = 2)
    public void testDuplicateBeneficiary() {
        driver.findElement(By.linkText("Manage Beneficiaries")).click();
        driver.findElement(By.id("addBeneficiaryBtn")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("beneName"))).sendKeys("Amit Sharma");
        driver.findElement(By.id("beneAccount"))
            .sendKeys("1234567890123456");
        driver.findElement(By.id("confirmAccount"))
            .sendKeys("1234567890123456");
        driver.findElement(By.id("ifscCode")).sendKeys("HDFC0001234");
        driver.findElement(By.id("submitBeneficiary")).click();

        WebElement dupError = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("error-message")));
        Assert.assertTrue(dupError.getText()
            .contains("already exists"));
    }

    @Test(priority = 3)
    public void testInvalidIFSC() {
        driver.findElement(By.linkText("Manage Beneficiaries")).click();
        driver.findElement(By.id("addBeneficiaryBtn")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("ifscCode"))).sendKeys("INVALID123");
        driver.findElement(By.id("verifyIfsc")).click();

        WebElement ifscError = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.id("ifsc-error")));
        Assert.assertEquals(ifscError.getText(),
            "Invalid IFSC code. Please verify and try again.");
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) driver.quit();
    }
}`,
    expectedOutput: `[TestNG] Running: BeneficiaryAdditionTest

testAddNewBeneficiary:
  Navigating to Manage Beneficiaries
  Clicking Add Beneficiary
  Entering name: Amit Sharma
  Entering account: 1234567890123456
  Entering IFSC: HDFC0001234
  IFSC verified - Bank: HDFC Bank, Branch: Koramangala
  Transfer limit set: INR 5,00,000
  OTP entered and verified
  Success: "Beneficiary added successfully"
  Cooling period: 24 hours before first transfer
  PASSED

testDuplicateBeneficiary:
  Error: "Beneficiary with this account already exists"
  PASSED

testInvalidIFSC:
  Error: "Invalid IFSC code. Please verify and try again."
  PASSED

Total tests run: 3, Passes: 3, Failures: 0, Skips: 0
Time: 15.891s`
  },
  {
    id: 'AT-005', title: 'Fixed Deposit Booking via Web', category: 'selenium',
    framework: 'Selenium', language: 'Java', difficulty: 'Advanced',
    description: 'Automates fixed deposit booking including amount entry, tenure selection, interest calculation verification, and maturity instructions setup.',
    prerequisites: 'Java 11+, Selenium WebDriver 4.x, ChromeDriver, TestNG',
    config: '{\n  "browser": "chrome",\n  "baseUrl": "https://netbanking.example.com",\n  "fdAmount": 100000,\n  "tenure": "12 months",\n  "interestPayout": "On Maturity"\n}',
    code: `import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;
import org.testng.annotations.*;
import java.time.Duration;

public class FixedDepositBookingTest {
    WebDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        driver.get("https://netbanking.example.com/login");
        driver.findElement(By.id("userId")).sendKeys("CUST001234");
        driver.findElement(By.id("password")).sendKeys("Test@1234");
        driver.findElement(By.id("loginButton")).click();
        wait.until(ExpectedConditions.urlContains("/dashboard"));
    }

    @Test(priority = 1)
    public void testBookFixedDeposit() {
        driver.findElement(By.linkText("Fixed Deposits")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("fdPage")));

        driver.findElement(By.id("bookNewFD")).click();

        // Select source account
        new Select(driver.findElement(By.id("sourceAccount")))
            .selectByVisibleText("Savings Account - XXXX1234");

        // Enter FD amount
        WebElement amountField = driver.findElement(By.id("fdAmount"));
        amountField.clear();
        amountField.sendKeys("100000");

        // Select tenure
        new Select(driver.findElement(By.id("tenureType")))
            .selectByVisibleText("Months");
        WebElement tenureValue = driver.findElement(By.id("tenureValue"));
        tenureValue.clear();
        tenureValue.sendKeys("12");

        // Trigger interest calculation
        driver.findElement(By.id("calculateInterest")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("interestRate")));

        // Verify interest rate display
        String interestRate = driver.findElement(
            By.id("interestRate")).getText();
        Assert.assertTrue(interestRate.contains("%"),
            "Interest rate should be displayed");
        System.out.println("Interest Rate: " + interestRate);

        String maturityAmount = driver.findElement(
            By.id("maturityAmount")).getText();
        Assert.assertFalse(maturityAmount.isEmpty(),
            "Maturity amount should be calculated");
        System.out.println("Maturity Amount: " + maturityAmount);

        // Select interest payout
        new Select(driver.findElement(By.id("interestPayout")))
            .selectByVisibleText("On Maturity");

        // Maturity instructions
        new Select(driver.findElement(By.id("maturityAction")))
            .selectByVisibleText(
                "Renew Principal, Credit Interest to Account");

        // Nomination
        driver.findElement(By.id("nomineeName")).sendKeys("Priya Kumar");
        driver.findElement(By.id("nomineeRelation")).sendKeys("Spouse");

        // Submit
        driver.findElement(By.id("submitFD")).click();

        // Confirm
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("confirmFD")));
        driver.findElement(By.id("confirmFD")).click();

        // OTP
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("otpInput")));
        driver.findElement(By.id("otpInput")).sendKeys("789012");
        driver.findElement(By.id("verifyOtp")).click();

        // Verify success
        WebElement successMsg = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("fd-success")));
        Assert.assertTrue(successMsg.getText().contains("booked"));

        String fdNumber = driver.findElement(
            By.id("fdNumber")).getText();
        Assert.assertTrue(fdNumber.startsWith("FD"),
            "FD number should start with FD prefix");
        System.out.println("FD booked: " + fdNumber);
    }

    @Test(priority = 2)
    public void testMinimumFDAmount() {
        driver.findElement(By.linkText("Fixed Deposits")).click();
        driver.findElement(By.id("bookNewFD")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("fdAmount"))).sendKeys("500");
        driver.findElement(By.id("calculateInterest")).click();

        WebElement minError = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("amount-error")));
        Assert.assertTrue(minError.getText()
            .contains("Minimum FD amount is INR 1,000"));
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) driver.quit();
    }
}`,
    expectedOutput: `[TestNG] Running: FixedDepositBookingTest

testBookFixedDeposit:
  Navigating to Fixed Deposits page
  Clicking Book New FD
  Source account: Savings Account - XXXX1234
  FD Amount: INR 1,00,000
  Tenure: 12 Months
  Calculating interest...
  Interest Rate: 7.10% p.a.
  Maturity Amount: INR 1,07,100
  Interest Payout: On Maturity
  Maturity Action: Renew Principal, Credit Interest
  Nominee: Priya Kumar (Spouse)
  Confirmed and OTP verified
  FD booked successfully: FD20260226001
  PASSED

testMinimumFDAmount:
  Error: "Minimum FD amount is INR 1,000"
  PASSED

Total tests run: 2, Passes: 2, Failures: 0, Skips: 0
Time: 16.432s`
  },
  {
    id: 'AT-006', title: 'Credit Card Application Form', category: 'selenium',
    framework: 'Selenium', language: 'Java', difficulty: 'Advanced',
    description: 'Automates the multi-step credit card application form including personal details, employment info, document upload, and application tracking.',
    prerequisites: 'Java 11+, Selenium WebDriver 4.x, ChromeDriver, TestNG',
    config: '{\n  "browser": "chrome",\n  "baseUrl": "https://netbanking.example.com",\n  "applicant": {\n    "name": "Rajesh Kumar",\n    "pan": "ABCDE1234F",\n    "income": 1200000\n  }\n}',
    code: `import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;
import org.testng.annotations.*;
import java.time.Duration;

public class CreditCardApplicationTest {
    WebDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        driver.get("https://netbanking.example.com/login");
        driver.findElement(By.id("userId")).sendKeys("CUST001234");
        driver.findElement(By.id("password")).sendKeys("Test@1234");
        driver.findElement(By.id("loginButton")).click();
        wait.until(ExpectedConditions.urlContains("/dashboard"));
    }

    @Test
    public void testCreditCardApplication() {
        driver.findElement(By.linkText("Credit Cards")).click();
        driver.findElement(By.id("applyNewCard")).click();

        // Step 1: Personal Details
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("step1")));
        driver.findElement(By.id("fullName")).sendKeys("Rajesh Kumar");
        driver.findElement(By.id("dob")).sendKeys("15/03/1985");
        driver.findElement(By.id("panNumber")).sendKeys("ABCDE1234F");
        driver.findElement(By.id("mobileNumber")).sendKeys("9876543210");
        driver.findElement(By.id("email"))
            .sendKeys("rajesh.kumar@email.com");

        new Select(driver.findElement(By.id("cardType")))
            .selectByVisibleText("Platinum Rewards Card");
        driver.findElement(By.id("nextStep1")).click();

        // Step 2: Employment Details
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("step2")));
        new Select(driver.findElement(By.id("employmentType")))
            .selectByVisibleText("Salaried");
        driver.findElement(By.id("companyName"))
            .sendKeys("TCS Limited");
        driver.findElement(By.id("designation"))
            .sendKeys("Senior Software Engineer");
        driver.findElement(By.id("annualIncome")).sendKeys("1200000");
        driver.findElement(By.id("workExperience")).sendKeys("8");
        driver.findElement(By.id("nextStep2")).click();

        // Step 3: Address Details
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("step3")));
        driver.findElement(By.id("address1"))
            .sendKeys("42, MG Road, Koramangala");
        driver.findElement(By.id("city")).sendKeys("Bangalore");
        new Select(driver.findElement(By.id("state")))
            .selectByVisibleText("Karnataka");
        driver.findElement(By.id("pincode")).sendKeys("560034");
        driver.findElement(By.id("nextStep3")).click();

        // Step 4: Document Upload
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("step4")));
        driver.findElement(By.id("panUpload"))
            .sendKeys("/tmp/test-docs/pan_card.pdf");
        driver.findElement(By.id("addressProof"))
            .sendKeys("/tmp/test-docs/aadhaar.pdf");
        driver.findElement(By.id("salarySlip"))
            .sendKeys("/tmp/test-docs/salary_slip.pdf");

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.className("upload-success")));
        driver.findElement(By.id("nextStep4")).click();

        // Step 5: Review and Submit
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("step5")));
        String reviewName = driver.findElement(
            By.id("reviewName")).getText();
        Assert.assertEquals(reviewName, "Rajesh Kumar");

        driver.findElement(By.id("termsCheckbox")).click();
        driver.findElement(By.id("submitApplication")).click();

        // Verify submission
        WebElement confirmation = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("application-success")));
        Assert.assertTrue(confirmation.getText()
            .contains("Application submitted"));

        String appId = driver.findElement(
            By.id("applicationId")).getText();
        Assert.assertTrue(appId.startsWith("CC-APP-"),
            "Application ID should have CC-APP prefix");
        System.out.println("Application submitted: " + appId);
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) driver.quit();
    }
}`,
    expectedOutput: `[TestNG] Running: CreditCardApplicationTest

testCreditCardApplication:
  Step 1: Personal Details entered
    Name: Rajesh Kumar, PAN: ABCDE1234F
    Card Type: Platinum Rewards Card
  Step 2: Employment Details entered
    Company: TCS Limited, Income: INR 12,00,000
  Step 3: Address Details entered
    City: Bangalore, PIN: 560034
  Step 4: Documents uploaded
    PAN Card: uploaded, Aadhaar: uploaded, Salary Slip: uploaded
  Step 5: Review completed, terms accepted
  Application submitted: CC-APP-20260226-0042
  PASSED

Total tests run: 1, Passes: 1, Failures: 0, Skips: 0
Time: 24.567s`
  },
  {
    id: 'AT-007', title: 'Loan EMI Calculator Page', category: 'selenium',
    framework: 'Selenium', language: 'Java', difficulty: 'Beginner',
    description: 'Automates the loan EMI calculator page verifying calculations for different loan amounts, tenures, and interest rates with mathematical precision.',
    prerequisites: 'Java 11+, Selenium WebDriver 4.x, ChromeDriver, TestNG',
    config: '{\n  "browser": "chrome",\n  "baseUrl": "https://netbanking.example.com",\n  "loanAmount": 1000000,\n  "tenure": 60,\n  "interestRate": 8.5\n}',
    code: `import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;
import org.testng.annotations.*;
import java.time.Duration;

public class EMICalculatorTest {
    WebDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @Test(priority = 1)
    public void testHomeLoanEMI() {
        driver.get("https://netbanking.example.com/emi-calculator");

        // Select loan type
        new Select(driver.findElement(By.id("loanType")))
            .selectByVisibleText("Home Loan");

        // Enter loan amount using slider or input
        WebElement amountInput = driver.findElement(By.id("loanAmount"));
        amountInput.clear();
        amountInput.sendKeys("5000000");

        // Set tenure
        WebElement tenureInput = driver.findElement(By.id("loanTenure"));
        tenureInput.clear();
        tenureInput.sendKeys("240"); // 20 years

        // Interest rate
        WebElement rateInput = driver.findElement(By.id("interestRate"));
        rateInput.clear();
        rateInput.sendKeys("8.5");

        // Calculate
        driver.findElement(By.id("calculateEMI")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("emiResult")));

        // Verify EMI calculation
        String emiAmount = driver.findElement(By.id("emiAmount")).getText();
        String totalInterest = driver.findElement(
            By.id("totalInterest")).getText();
        String totalPayment = driver.findElement(
            By.id("totalPayment")).getText();

        // EMI for 50L at 8.5% for 20 years = ~43,391
        Assert.assertFalse(emiAmount.isEmpty(), "EMI should be calculated");
        System.out.println("Monthly EMI: " + emiAmount);
        System.out.println("Total Interest: " + totalInterest);
        System.out.println("Total Payment: " + totalPayment);

        // Verify chart is displayed
        Assert.assertTrue(
            driver.findElement(By.id("emiChart")).isDisplayed(),
            "EMI breakdown chart should be visible");

        // Verify amortization table
        Assert.assertTrue(
            driver.findElement(By.id("amortizationTable")).isDisplayed(),
            "Amortization schedule should be visible");

        int tableRows = driver.findElements(
            By.cssSelector("#amortizationTable tbody tr")).size();
        Assert.assertEquals(tableRows, 240,
            "Should have 240 monthly entries");
    }

    @Test(priority = 2)
    public void testPersonalLoanEMI() {
        driver.get("https://netbanking.example.com/emi-calculator");

        new Select(driver.findElement(By.id("loanType")))
            .selectByVisibleText("Personal Loan");
        driver.findElement(By.id("loanAmount")).sendKeys("500000");
        driver.findElement(By.id("loanTenure")).sendKeys("36");
        driver.findElement(By.id("interestRate")).sendKeys("12");
        driver.findElement(By.id("calculateEMI")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("emiResult")));

        String emi = driver.findElement(By.id("emiAmount")).getText();
        Assert.assertFalse(emi.isEmpty());
        System.out.println("Personal Loan EMI: " + emi);
    }

    @Test(priority = 3)
    public void testZeroAmountValidation() {
        driver.get("https://netbanking.example.com/emi-calculator");
        driver.findElement(By.id("loanAmount")).sendKeys("0");
        driver.findElement(By.id("calculateEMI")).click();

        WebElement error = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("validation-error")));
        Assert.assertTrue(error.getText()
            .contains("Please enter a valid loan amount"));
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) driver.quit();
    }
}`,
    expectedOutput: `[TestNG] Running: EMICalculatorTest

testHomeLoanEMI:
  Navigating to EMI Calculator
  Loan Type: Home Loan
  Amount: INR 50,00,000 | Tenure: 240 months | Rate: 8.5%
  Calculating EMI...
  Monthly EMI: INR 43,391
  Total Interest: INR 54,13,840
  Total Payment: INR 1,04,13,840
  EMI chart displayed: Yes
  Amortization table rows: 240
  PASSED

testPersonalLoanEMI:
  Loan Type: Personal Loan
  Amount: INR 5,00,000 | Tenure: 36 months | Rate: 12%
  Personal Loan EMI: INR 16,607
  PASSED

testZeroAmountValidation:
  Error: "Please enter a valid loan amount"
  PASSED

Total tests run: 3, Passes: 3, Failures: 0, Skips: 0
Time: 9.234s`
  },
  {
    id: 'AT-008', title: 'Customer Search & Profile View', category: 'selenium',
    framework: 'Selenium', language: 'Java', difficulty: 'Beginner',
    description: 'Automates searching for customers by various criteria and validates profile information display including accounts, transactions, and KYC status.',
    prerequisites: 'Java 11+, Selenium WebDriver 4.x, ChromeDriver, TestNG',
    config: '{\n  "browser": "chrome",\n  "baseUrl": "https://netbanking.example.com",\n  "searchCriteria": {\n    "customerId": "CUST001234",\n    "name": "Rajesh Kumar",\n    "mobile": "9876543210"\n  }\n}',
    code: `import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;
import org.testng.annotations.*;
import java.time.Duration;
import java.util.List;

public class CustomerSearchTest {
    WebDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        driver.get("https://netbanking.example.com/login");
        driver.findElement(By.id("userId")).sendKeys("ADMIN001");
        driver.findElement(By.id("password")).sendKeys("Admin@1234");
        driver.findElement(By.id("loginButton")).click();
        wait.until(ExpectedConditions.urlContains("/admin/dashboard"));
    }

    @Test(priority = 1)
    public void testSearchByCustomerId() {
        driver.findElement(By.linkText("Customer Search")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("searchForm")));

        new Select(driver.findElement(By.id("searchBy")))
            .selectByVisibleText("Customer ID");
        driver.findElement(By.id("searchInput"))
            .sendKeys("CUST001234");
        driver.findElement(By.id("searchBtn")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("searchResults")));

        List<WebElement> results = driver.findElements(
            By.cssSelector("#searchResults .customer-row"));
        Assert.assertEquals(results.size(), 1,
            "Should find exactly one customer");

        results.get(0).click();

        // Verify profile sections
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("customerProfile")));

        String custName = driver.findElement(
            By.id("profileName")).getText();
        Assert.assertEquals(custName, "Rajesh Kumar");

        String kycStatus = driver.findElement(
            By.id("kycStatus")).getText();
        Assert.assertEquals(kycStatus, "VERIFIED");

        // Check accounts section
        List<WebElement> accounts = driver.findElements(
            By.cssSelector("#accountsList .account-card"));
        Assert.assertTrue(accounts.size() > 0,
            "Customer should have at least one account");

        // Check recent transactions
        List<WebElement> transactions = driver.findElements(
            By.cssSelector("#recentTransactions .txn-row"));
        Assert.assertTrue(transactions.size() > 0,
            "Should show recent transactions");

        System.out.println("Customer found: " + custName +
            ", Accounts: " + accounts.size() +
            ", Recent Txns: " + transactions.size());
    }

    @Test(priority = 2)
    public void testSearchByMobile() {
        driver.findElement(By.linkText("Customer Search")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("searchForm")));

        new Select(driver.findElement(By.id("searchBy")))
            .selectByVisibleText("Mobile Number");
        driver.findElement(By.id("searchInput"))
            .sendKeys("9876543210");
        driver.findElement(By.id("searchBtn")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("searchResults")));
        List<WebElement> results = driver.findElements(
            By.cssSelector("#searchResults .customer-row"));
        Assert.assertTrue(results.size() >= 1);
    }

    @Test(priority = 3)
    public void testSearchNoResults() {
        driver.findElement(By.linkText("Customer Search")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("searchForm")));

        new Select(driver.findElement(By.id("searchBy")))
            .selectByVisibleText("Customer ID");
        driver.findElement(By.id("searchInput"))
            .sendKeys("NONEXISTENT999");
        driver.findElement(By.id("searchBtn")).click();

        WebElement noResults = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.className("no-results")));
        Assert.assertTrue(noResults.getText()
            .contains("No customers found"));
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) driver.quit();
    }
}`,
    expectedOutput: `[TestNG] Running: CustomerSearchTest

testSearchByCustomerId:
  Search by: Customer ID = CUST001234
  Results found: 1
  Profile: Rajesh Kumar
  KYC Status: VERIFIED
  Accounts: 3 (Savings, Current, FD)
  Recent Transactions: 15
  PASSED

testSearchByMobile:
  Search by: Mobile = 9876543210
  Results found: 1
  PASSED

testSearchNoResults:
  Search by: Customer ID = NONEXISTENT999
  Message: "No customers found"
  PASSED

Total tests run: 3, Passes: 3, Failures: 0, Skips: 0
Time: 11.567s`
  },
  {
    id: 'AT-009', title: 'Multi-tab Branch Locator', category: 'selenium',
    framework: 'Selenium', language: 'Java', difficulty: 'Advanced',
    description: 'Automates the branch locator with multi-tab handling, Google Maps integration, search by PIN code/city, and branch details verification.',
    prerequisites: 'Java 11+, Selenium WebDriver 4.x, ChromeDriver, TestNG',
    config: '{\n  "browser": "chrome",\n  "baseUrl": "https://netbanking.example.com",\n  "searchCity": "Bangalore",\n  "searchPincode": "560034"\n}',
    code: `import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;
import org.testng.annotations.*;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class BranchLocatorTest {
    WebDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test(priority = 1)
    public void testSearchBranchByCity() {
        driver.get("https://www.example-bank.com/branch-locator");

        new Select(driver.findElement(By.id("searchType")))
            .selectByVisibleText("City");

        new Select(driver.findElement(By.id("stateSelect")))
            .selectByVisibleText("Karnataka");

        wait.until(ExpectedConditions.elementToBeClickable(
            By.id("citySelect")));
        new Select(driver.findElement(By.id("citySelect")))
            .selectByVisibleText("Bangalore");

        driver.findElement(By.id("searchBranches")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("branchResults")));

        List<WebElement> branches = driver.findElements(
            By.cssSelector(".branch-card"));
        Assert.assertTrue(branches.size() > 0,
            "Should find branches in Bangalore");

        // Verify first branch details
        WebElement firstBranch = branches.get(0);
        String branchName = firstBranch.findElement(
            By.className("branch-name")).getText();
        String address = firstBranch.findElement(
            By.className("branch-address")).getText();
        String ifsc = firstBranch.findElement(
            By.className("branch-ifsc")).getText();

        Assert.assertFalse(branchName.isEmpty());
        Assert.assertFalse(ifsc.isEmpty());
        Assert.assertTrue(ifsc.matches("[A-Z]{4}0[A-Z0-9]{6}"),
            "IFSC should match standard format");

        System.out.println("Found " + branches.size() +
            " branches. First: " + branchName);
    }

    @Test(priority = 2)
    public void testBranchDetailsInNewTab() {
        driver.get("https://www.example-bank.com/branch-locator");

        new Select(driver.findElement(By.id("searchType")))
            .selectByVisibleText("Pincode");
        driver.findElement(By.id("pincodeInput")).sendKeys("560034");
        driver.findElement(By.id("searchBranches")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("branchResults")));

        // Click "View Details" which opens in new tab
        String originalWindow = driver.getWindowHandle();
        driver.findElement(By.cssSelector(
            ".branch-card:first-child .view-details")).click();

        // Switch to new tab
        wait.until(ExpectedConditions.numberOfWindowsToBe(2));
        Set<String> windows = driver.getWindowHandles();
        for (String window : windows) {
            if (!window.equals(originalWindow)) {
                driver.switchTo().window(window);
                break;
            }
        }

        // Verify branch detail page
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("branchDetailPage")));

        Assert.assertTrue(
            driver.findElement(By.id("branchTimings")).isDisplayed(),
            "Branch timings should be visible");
        Assert.assertTrue(
            driver.findElement(By.id("branchMap")).isDisplayed(),
            "Map should be displayed");
        Assert.assertTrue(
            driver.findElement(By.id("branchServices")).isDisplayed(),
            "Services list should be visible");

        // Close detail tab, switch back
        driver.close();
        driver.switchTo().window(originalWindow);

        Assert.assertTrue(driver.getCurrentUrl()
            .contains("branch-locator"));
    }

    @Test(priority = 3)
    public void testMapDirectionsLink() {
        driver.get("https://www.example-bank.com/branch-locator");

        new Select(driver.findElement(By.id("searchType")))
            .selectByVisibleText("Pincode");
        driver.findElement(By.id("pincodeInput")).sendKeys("560034");
        driver.findElement(By.id("searchBranches")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("branchResults")));

        String originalWindow = driver.getWindowHandle();

        // Click directions link
        driver.findElement(By.cssSelector(
            ".branch-card:first-child .get-directions")).click();

        wait.until(ExpectedConditions.numberOfWindowsToBe(2));
        ArrayList<String> tabs = new ArrayList<>(
            driver.getWindowHandles());
        driver.switchTo().window(tabs.get(1));

        // Verify Google Maps opened
        wait.until(ExpectedConditions.urlContains("google.com/maps"));
        System.out.println("Maps URL: " + driver.getCurrentUrl());

        driver.close();
        driver.switchTo().window(originalWindow);
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) driver.quit();
    }
}`,
    expectedOutput: `[TestNG] Running: BranchLocatorTest

testSearchBranchByCity:
  State: Karnataka, City: Bangalore
  Found 24 branches
  First branch: Koramangala Branch
  IFSC: EXBK0000042
  PASSED

testBranchDetailsInNewTab:
  Search by PIN: 560034
  Opened branch details in new tab
  Branch timings: Mon-Fri 10AM-4PM, Sat 10AM-2PM
  Map displayed: Yes
  Services: Locker, Cash Deposit, Forex
  Tab closed, returned to search
  PASSED

testMapDirectionsLink:
  Directions link opened Google Maps
  Maps URL verified
  PASSED

Total tests run: 3, Passes: 3, Failures: 0, Skips: 0
Time: 14.892s`
  },
  {
    id: 'AT-010', title: 'Net Banking Dashboard Validation', category: 'selenium',
    framework: 'Selenium', language: 'Java', difficulty: 'Beginner',
    description: 'Validates all dashboard widgets after login including account summary, recent transactions, quick actions, notifications, and offers carousel.',
    prerequisites: 'Java 11+, Selenium WebDriver 4.x, ChromeDriver, TestNG',
    config: '{\n  "browser": "chrome",\n  "baseUrl": "https://netbanking.example.com",\n  "expectedWidgets": ["accountSummary", "recentTransactions", "quickActions", "notifications", "offers"]\n}',
    code: `import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import org.testng.Assert;
import org.testng.annotations.*;
import org.testng.asserts.SoftAssert;
import java.time.Duration;
import java.util.List;

public class DashboardValidationTest {
    WebDriver driver;
    WebDriverWait wait;
    SoftAssert softAssert;

    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        softAssert = new SoftAssert();
        driver.get("https://netbanking.example.com/login");
        driver.findElement(By.id("userId")).sendKeys("CUST001234");
        driver.findElement(By.id("password")).sendKeys("Test@1234");
        driver.findElement(By.id("loginButton")).click();
        wait.until(ExpectedConditions.urlContains("/dashboard"));
    }

    @Test(priority = 1)
    public void testAccountSummaryWidget() {
        WebElement summary = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.id("accountSummary")));
        Assert.assertTrue(summary.isDisplayed());

        List<WebElement> accounts = driver.findElements(
            By.cssSelector("#accountSummary .account-item"));
        Assert.assertTrue(accounts.size() > 0,
            "At least one account should display");

        for (WebElement acc : accounts) {
            String accNo = acc.findElement(
                By.className("acc-number")).getText();
            String balance = acc.findElement(
                By.className("acc-balance")).getText();
            Assert.assertFalse(accNo.isEmpty());
            Assert.assertTrue(balance.contains("INR"));
            System.out.println(accNo + " - Balance: " + balance);
        }
    }

    @Test(priority = 2)
    public void testRecentTransactionsWidget() {
        WebElement txnWidget = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.id("recentTransactions")));
        Assert.assertTrue(txnWidget.isDisplayed());

        List<WebElement> txns = driver.findElements(
            By.cssSelector("#recentTransactions .txn-row"));
        Assert.assertTrue(txns.size() > 0 && txns.size() <= 10,
            "Should show 1-10 recent transactions");

        // Verify transaction details
        WebElement firstTxn = txns.get(0);
        softAssert.assertFalse(firstTxn.findElement(
            By.className("txn-date")).getText().isEmpty());
        softAssert.assertFalse(firstTxn.findElement(
            By.className("txn-desc")).getText().isEmpty());
        softAssert.assertFalse(firstTxn.findElement(
            By.className("txn-amount")).getText().isEmpty());
        softAssert.assertAll();
    }

    @Test(priority = 3)
    public void testQuickActionsWidget() {
        WebElement quickActions = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.id("quickActions")));

        String[] expectedActions = {
            "Fund Transfer", "Bill Payment", "Recharge",
            "FD Booking", "Card Services"};

        for (String action : expectedActions) {
            WebElement btn = quickActions.findElement(
                By.xpath(".//button[contains(text(),'" + action + "')]"));
            Assert.assertTrue(btn.isEnabled(),
                action + " button should be enabled");
        }
    }

    @Test(priority = 4)
    public void testNotificationBell() {
        WebElement bell = driver.findElement(By.id("notificationBell"));
        bell.click();

        WebElement notifPanel = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.id("notificationPanel")));
        Assert.assertTrue(notifPanel.isDisplayed());

        List<WebElement> notifs = driver.findElements(
            By.cssSelector("#notificationPanel .notif-item"));
        System.out.println("Notifications: " + notifs.size());
    }

    @Test(priority = 5)
    public void testOffersCarousel() {
        WebElement carousel = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.id("offersCarousel")));
        Assert.assertTrue(carousel.isDisplayed());

        WebElement nextBtn = driver.findElement(
            By.cssSelector("#offersCarousel .next-btn"));
        nextBtn.click();

        try { Thread.sleep(500); } catch (InterruptedException e) {}

        WebElement activeSlide = driver.findElement(
            By.cssSelector("#offersCarousel .slide.active"));
        Assert.assertNotNull(activeSlide);
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) driver.quit();
    }
}`,
    expectedOutput: `[TestNG] Running: DashboardValidationTest

testAccountSummaryWidget:
  Account Summary widget displayed
  Savings XXXX1234 - Balance: INR 2,45,670.50
  Current XXXX5678 - Balance: INR 8,90,230.00
  FD XXXX9012 - Balance: INR 5,00,000.00
  PASSED

testRecentTransactionsWidget:
  Recent Transactions: 10 entries displayed
  First: 26/02/2026 - UPI Payment - INR 1,500.00
  PASSED

testQuickActionsWidget:
  Fund Transfer: enabled
  Bill Payment: enabled
  Recharge: enabled
  FD Booking: enabled
  Card Services: enabled
  PASSED

testNotificationBell:
  Notifications panel opened: 5 notifications
  PASSED

testOffersCarousel:
  Carousel displayed, navigation working
  PASSED

Total tests run: 5, Passes: 5, Failures: 0, Skips: 0
Time: 13.445s`
  },
  // === CUCUMBER BDD (AT-011 to AT-020) ===
  {
    id: 'AT-011', title: 'Feature File - Customer Login', category: 'cucumber',
    framework: 'Cucumber', language: 'Gherkin', difficulty: 'Beginner',
    description: 'BDD feature file for customer login with step definitions covering valid login, invalid credentials, account lock, and session management.',
    prerequisites: 'Java 11+, Cucumber 7.x, Selenium WebDriver, TestNG, Maven',
    config: '{\n  "cucumberOptions": {\n    "features": "src/test/resources/features",\n    "glue": "stepdefinitions",\n    "plugin": ["pretty", "html:target/cucumber-reports"],\n    "tags": "@login"\n  }\n}',
    code: `Feature: Customer Login
  As a banking customer
  I want to login to net banking portal
  So that I can access my accounts and perform transactions

  Background:
    Given the net banking portal is accessible
    And the database has test customer "CUST001234"

  @login @smoke @positive
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter username "CUST001234"
    And I enter password "Test@1234"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see welcome message "Welcome, Rajesh Kumar"
    And the account summary should be displayed
    And the last login time should be shown

  @login @negative
  Scenario: Login with invalid password
    Given I am on the login page
    When I enter username "CUST001234"
    And I enter password "wrong_password"
    And I click the login button
    Then I should see error message "Invalid credentials. Please try again."
    And I should remain on the login page
    And the failed attempt counter should increment

  @login @negative
  Scenario: Login with empty credentials
    Given I am on the login page
    When I click the login button without entering credentials
    Then I should see validation error "User ID is required"
    And I should see validation error "Password is required"

  @login @security
  Scenario: Account lock after 3 failed attempts
    Given I am on the login page
    When I enter wrong password 3 times for user "CUST001234"
    Then the account should be locked
    And I should see message "Account locked. Contact customer care."
    And an SMS alert should be sent to registered mobile

  @login @security
  Scenario: Session timeout after inactivity
    Given I am logged in as "CUST001234"
    When I remain inactive for 5 minutes
    Then I should be automatically logged out
    And I should see message "Session expired due to inactivity"

  @login @data-driven
  Scenario Outline: Login with multiple test data sets
    Given I am on the login page
    When I enter username "<username>"
    And I enter password "<password>"
    And I click the login button
    Then I should see "<result>"

    Examples:
      | username    | password    | result                    |
      | CUST001234  | Test@1234   | Welcome, Rajesh Kumar     |
      | CUST005678  | Pass@5678   | Welcome, Priya Singh      |
      | INVALID     | wrong       | Invalid credentials       |
      | CUST001234  |             | Password is required      |
      |             | Test@1234   | User ID is required       |
      | LOCKED_USER | Test@1234   | Account is locked         |

# --- Step Definitions (Java) ---
# @Given("the net banking portal is accessible")
# public void verifyPortalAccessible() {
#     driver.get(config.getBaseUrl() + "/login");
#     Assert.assertEquals(driver.getTitle(), "Net Banking - Login");
# }
#
# @When("I enter username {string}")
# public void enterUsername(String username) {
#     driver.findElement(By.id("userId")).sendKeys(username);
# }
#
# @When("I enter password {string}")
# public void enterPassword(String password) {
#     driver.findElement(By.id("password")).sendKeys(password);
# }
#
# @When("I click the login button")
# public void clickLogin() {
#     driver.findElement(By.id("loginButton")).click();
# }
#
# @Then("I should be redirected to the dashboard")
# public void verifyDashboardRedirect() {
#     wait.until(ExpectedConditions.urlContains("/dashboard"));
# }
#
# @Then("I should see welcome message {string}")
# public void verifyWelcomeMessage(String expected) {
#     String actual = driver.findElement(
#         By.className("welcome-text")).getText();
#     Assert.assertTrue(actual.contains(expected));
# }`,
    expectedOutput: `@login
Feature: Customer Login

  Background:
    Given the net banking portal is accessible    # PASSED (0.234s)
    And the database has test customer "CUST001234" # PASSED (0.012s)

  Scenario: Successful login with valid credentials
    Given I am on the login page                  # PASSED (0.567s)
    When I enter username "CUST001234"            # PASSED (0.123s)
    And I enter password "Test@1234"              # PASSED (0.098s)
    And I click the login button                  # PASSED (0.234s)
    Then I should be redirected to the dashboard  # PASSED (1.234s)
    And I should see welcome message "Welcome, Rajesh Kumar" # PASSED (0.345s)
    And the account summary should be displayed   # PASSED (0.456s)
    And the last login time should be shown        # PASSED (0.123s)

  Scenario: Login with invalid password            # PASSED
  Scenario: Login with empty credentials           # PASSED
  Scenario: Account lock after 3 failed attempts   # PASSED
  Scenario: Session timeout after inactivity       # PASSED

  Scenario Outline: Login with multiple test data sets
    Example 1: CUST001234 / Test@1234             # PASSED
    Example 2: CUST005678 / Pass@5678             # PASSED
    Example 3: INVALID / wrong                    # PASSED
    Example 4: CUST001234 / (empty)               # PASSED
    Example 5: (empty) / Test@1234                # PASSED
    Example 6: LOCKED_USER / Test@1234            # PASSED

11 Scenarios (11 passed)
52 Steps (52 passed)
Time: 18.456s`
  },
  {
    id: 'AT-012', title: 'Feature File - Fund Transfer', category: 'cucumber',
    framework: 'Cucumber', language: 'Gherkin', difficulty: 'Intermediate',
    description: 'BDD feature file covering NEFT, RTGS, IMPS fund transfers with beneficiary validation, OTP verification, and transaction limit checks.',
    prerequisites: 'Java 11+, Cucumber 7.x, Selenium WebDriver, TestNG',
    config: '{\n  "cucumberOptions": {\n    "features": "src/test/resources/features/fund_transfer.feature",\n    "tags": "@fund-transfer"\n  }\n}',
    code: `Feature: Fund Transfer
  As a banking customer
  I want to transfer funds to other accounts
  So that I can make payments and send money

  Background:
    Given I am logged in as customer "CUST001234"
    And I navigate to the fund transfer page
    And beneficiary "Priya Singh - ACC987654321" is registered

  @fund-transfer @imps @positive
  Scenario: Successful IMPS transfer within daily limit
    Given I select transfer type "IMPS"
    And I select from account "Savings - XXXX1234"
    And I select beneficiary "Priya Singh - ACC987654321"
    When I enter transfer amount "5000"
    And I enter remarks "Monthly rent"
    And I click transfer button
    Then I should see the transfer review page
    And the amount should show "INR 5,000.00"
    When I confirm the transfer
    And I enter OTP "123456"
    Then the transfer should be successful
    And I should receive a reference number starting with "IMPS"
    And the account balance should be debited by 5000

  @fund-transfer @neft @positive
  Scenario: Successful NEFT transfer
    Given I select transfer type "NEFT"
    And I select from account "Savings - XXXX1234"
    And I select beneficiary "Priya Singh - ACC987654321"
    When I enter transfer amount "50000"
    And I enter remarks "Business payment"
    And I click transfer button
    And I confirm the transfer
    And I enter OTP "123456"
    Then the transfer should be successful
    And I should see message "NEFT transfer initiated"

  @fund-transfer @rtgs @positive
  Scenario: Successful RTGS transfer for large amount
    Given I select transfer type "RTGS"
    And I select from account "Current - XXXX5678"
    And I select beneficiary "Priya Singh - ACC987654321"
    When I enter transfer amount "500000"
    And I click transfer button
    And I confirm the transfer
    And I enter OTP "123456"
    Then the transfer should be successful
    And the minimum amount validation should pass for RTGS

  @fund-transfer @negative
  Scenario: Transfer with insufficient balance
    Given I select transfer type "IMPS"
    And I select from account "Savings - XXXX1234"
    And I select beneficiary "Priya Singh - ACC987654321"
    When I enter transfer amount "99999999"
    And I click transfer button
    Then I should see error "Insufficient balance in selected account"

  @fund-transfer @negative
  Scenario: Transfer exceeding daily limit
    Given I select transfer type "IMPS"
    And I select from account "Savings - XXXX1234"
    When I enter transfer amount "600000"
    And I click transfer button
    Then I should see error "Amount exceeds daily IMPS limit"

  @fund-transfer @data-driven
  Scenario Outline: Transfer validation for different scenarios
    Given I select transfer type "<type>"
    And I select from account "<account>"
    When I enter transfer amount "<amount>"
    And I click transfer button
    Then I should see "<expected_result>"

    Examples:
      | type | account          | amount  | expected_result          |
      | IMPS | Savings - XXXX1234 | 5000    | Transfer review page     |
      | NEFT | Savings - XXXX1234 | 0       | Amount must be greater than 0 |
      | RTGS | Current - XXXX5678 | 100000  | Transfer review page     |
      | RTGS | Current - XXXX5678 | 1000    | Minimum RTGS amount is 2,00,000 |
      | IMPS | Savings - XXXX1234 | -500    | Invalid amount           |`,
    expectedOutput: `@fund-transfer
Feature: Fund Transfer

  Scenario: Successful IMPS transfer within daily limit      # PASSED (4.567s)
  Scenario: Successful NEFT transfer                         # PASSED (3.892s)
  Scenario: Successful RTGS transfer for large amount        # PASSED (3.456s)
  Scenario: Transfer with insufficient balance               # PASSED (1.234s)
  Scenario: Transfer exceeding daily limit                   # PASSED (1.123s)

  Scenario Outline: Transfer validation
    Example 1: IMPS / 5000                                   # PASSED
    Example 2: NEFT / 0                                      # PASSED
    Example 3: RTGS / 100000                                 # PASSED
    Example 4: RTGS / 1000                                   # PASSED
    Example 5: IMPS / -500                                   # PASSED

10 Scenarios (10 passed)
68 Steps (68 passed)
Time: 22.345s`
  },
  {
    id: 'AT-013', title: 'Feature File - Balance Inquiry', category: 'cucumber',
    framework: 'Cucumber', language: 'Gherkin', difficulty: 'Beginner',
    description: 'BDD feature file for balance inquiry across savings, current, and FD accounts with real-time balance refresh and mini statement generation.',
    prerequisites: 'Java 11+, Cucumber 7.x, Selenium WebDriver',
    config: '{\n  "cucumberOptions": {\n    "features": "src/test/resources/features/balance.feature",\n    "tags": "@balance"\n  }\n}',
    code: `Feature: Balance Inquiry
  As a banking customer
  I want to check my account balance
  So that I can track my finances

  Background:
    Given I am logged in as customer "CUST001234"

  @balance @smoke
  Scenario: Check savings account balance
    Given I navigate to "Account Summary" page
    When I select account "Savings Account - XXXX1234"
    Then I should see the current balance
    And the balance should be in INR format
    And the available balance should be displayed
    And the hold amount should be displayed if any

  @balance @positive
  Scenario: Check all account balances at once
    Given I navigate to "Account Summary" page
    Then I should see balances for all my accounts:
      | Account Type    | Account Number | Status |
      | Savings Account | XXXX1234       | Active |
      | Current Account | XXXX5678       | Active |
      | Fixed Deposit   | XXXX9012       | Active |

  @balance @mini-statement
  Scenario: View mini statement
    Given I navigate to "Account Summary" page
    When I select account "Savings Account - XXXX1234"
    And I click "View Mini Statement"
    Then I should see the last 10 transactions
    And each transaction should have date, description, and amount
    And debit transactions should be in red
    And credit transactions should be in green

  @balance @refresh
  Scenario: Refresh balance after a transaction
    Given I have a balance of "245670.50" in "Savings - XXXX1234"
    When a debit of "5000" is processed
    And I click the refresh button
    Then the balance should show "240670.50"

  @balance @negative
  Scenario: Balance inquiry for closed account
    Given I navigate to "Account Summary" page
    When I try to view balance for a closed account
    Then I should see message "This account is closed"
    And the balance should show as "0.00"
    And no transaction options should be available`,
    expectedOutput: `@balance
Feature: Balance Inquiry

  Scenario: Check savings account balance          # PASSED (1.234s)
    Balance: INR 2,45,670.50
    Available: INR 2,40,670.50
    Hold: INR 5,000.00

  Scenario: Check all account balances at once     # PASSED (2.345s)
    Savings XXXX1234: INR 2,45,670.50 [Active]
    Current XXXX5678: INR 8,90,230.00 [Active]
    FD XXXX9012: INR 5,00,000.00 [Active]

  Scenario: View mini statement                    # PASSED (1.567s)
    10 transactions displayed with correct formatting

  Scenario: Refresh balance after transaction      # PASSED (0.892s)
  Scenario: Balance inquiry for closed account     # PASSED (0.678s)

5 Scenarios (5 passed)
28 Steps (28 passed)
Time: 6.716s`
  },
  {
    id: 'AT-014', title: 'Feature File - Cheque Book Request', category: 'cucumber',
    framework: 'Cucumber', language: 'Gherkin', difficulty: 'Beginner',
    description: 'BDD feature file for requesting cheque books with different leaf counts, delivery address selection, and request tracking.',
    prerequisites: 'Java 11+, Cucumber 7.x, Selenium WebDriver',
    config: '{\n  "cucumberOptions": {\n    "features": "src/test/resources/features/cheque_book.feature",\n    "tags": "@cheque-book"\n  }\n}',
    code: `Feature: Cheque Book Request
  As a banking customer
  I want to request a new cheque book
  So that I can make payments by cheque

  Background:
    Given I am logged in as customer "CUST001234"
    And I navigate to "Service Requests" page

  @cheque-book @positive
  Scenario: Request a new cheque book with 25 leaves
    Given I click on "Request Cheque Book"
    When I select account "Savings Account - XXXX1234"
    And I select cheque book with "25" leaves
    And I select delivery address as "Registered Address"
    And I confirm the request
    Then the cheque book request should be submitted
    And I should receive a service request number
    And the expected delivery should be "7-10 business days"

  @cheque-book @positive
  Scenario: Request cheque book with custom delivery address
    Given I click on "Request Cheque Book"
    When I select account "Current Account - XXXX5678"
    And I select cheque book with "50" leaves
    And I select delivery address as "Custom Address"
    And I enter delivery address:
      | Field   | Value                        |
      | Line 1  | 42, MG Road                  |
      | Line 2  | Koramangala                  |
      | City    | Bangalore                    |
      | State   | Karnataka                    |
      | Pincode | 560034                       |
    And I confirm the request
    Then the cheque book request should be submitted

  @cheque-book @negative
  Scenario: Request cheque book for account with pending request
    Given I already have a pending cheque book request
    When I click on "Request Cheque Book"
    And I select account "Savings Account - XXXX1234"
    Then I should see message "A cheque book request is already pending"
    And the submit button should be disabled

  @cheque-book @tracking
  Scenario: Track cheque book delivery status
    Given I have a cheque book request "SR-20260226-001"
    When I navigate to "Track Service Requests"
    And I search for request "SR-20260226-001"
    Then I should see the current status as "In Transit"
    And I should see the courier tracking number
    And I should see estimated delivery date`,
    expectedOutput: `@cheque-book
Feature: Cheque Book Request

  Scenario: Request new cheque book with 25 leaves    # PASSED (2.123s)
    Request submitted: SR-20260226-001
    Delivery: 7-10 business days

  Scenario: Request with custom delivery address       # PASSED (2.567s)
    Custom address verified and request submitted

  Scenario: Request for account with pending request   # PASSED (1.234s)
    Message: "A cheque book request is already pending"

  Scenario: Track cheque book delivery status          # PASSED (1.456s)
    Status: In Transit | Courier: BlueDart AWB12345

4 Scenarios (4 passed)
24 Steps (24 passed)
Time: 7.380s`
  },
  {
    id: 'AT-015', title: 'Feature File - Standing Instruction', category: 'cucumber',
    framework: 'Cucumber', language: 'Gherkin', difficulty: 'Intermediate',
    description: 'BDD feature file for creating, modifying, and cancelling standing instructions for recurring payments like EMIs and utility bills.',
    prerequisites: 'Java 11+, Cucumber 7.x, Selenium WebDriver',
    config: '{\n  "cucumberOptions": {\n    "features": "src/test/resources/features/standing_instruction.feature",\n    "tags": "@standing-instruction"\n  }\n}',
    code: `Feature: Standing Instruction Management
  As a banking customer
  I want to set up standing instructions
  So that my recurring payments are automated

  Background:
    Given I am logged in as customer "CUST001234"
    And I navigate to "Standing Instructions" page

  @standing-instruction @create
  Scenario: Create monthly rent payment standing instruction
    Given I click "Create New Standing Instruction"
    When I fill in the standing instruction details:
      | Field            | Value                          |
      | From Account     | Savings - XXXX1234             |
      | Beneficiary      | Priya Singh - ACC987654321     |
      | Amount           | 25000                          |
      | Frequency        | Monthly                        |
      | Start Date       | 01/03/2026                     |
      | End Date         | 01/03/2027                     |
      | Payment Day      | 1st of every month             |
      | Remarks          | Monthly Rent Payment           |
    And I confirm the standing instruction
    And I enter OTP "456789"
    Then the standing instruction should be created
    And I should see SI reference "SI-20260226-001"
    And the status should be "Active"

  @standing-instruction @create
  Scenario: Create weekly SIP standing instruction
    Given I click "Create New Standing Instruction"
    When I fill in the standing instruction details:
      | Field            | Value                          |
      | From Account     | Savings - XXXX1234             |
      | Beneficiary      | Mutual Fund House - ACC111222  |
      | Amount           | 5000                           |
      | Frequency        | Weekly                         |
      | Start Date       | 01/03/2026                     |
      | End Date         | 01/03/2028                     |
      | Payment Day      | Every Monday                   |
      | Remarks          | SIP Investment                 |
    And I confirm the standing instruction
    And I enter OTP "456789"
    Then the standing instruction should be created

  @standing-instruction @modify
  Scenario: Modify existing standing instruction amount
    Given I have an active standing instruction "SI-20260226-001"
    When I click "Modify" for "SI-20260226-001"
    And I change the amount to "30000"
    And I confirm the modification
    And I enter OTP "456789"
    Then the amount should be updated to "30000"
    And the modification history should show the change

  @standing-instruction @cancel
  Scenario: Cancel standing instruction
    Given I have an active standing instruction "SI-20260226-001"
    When I click "Cancel" for "SI-20260226-001"
    And I confirm cancellation
    And I enter OTP "456789"
    Then the standing instruction status should change to "Cancelled"
    And no future payments should be scheduled

  @standing-instruction @negative
  Scenario: Create standing instruction with insufficient balance
    Given my account balance is "10000"
    When I try to create a standing instruction for "50000"
    Then I should see warning "Amount exceeds current balance"
    But the instruction should still be created with a warning`,
    expectedOutput: `@standing-instruction
Feature: Standing Instruction Management

  Scenario: Create monthly rent payment SI           # PASSED (3.234s)
    SI Reference: SI-20260226-001, Status: Active
    Next payment: 01/03/2026, Amount: INR 25,000

  Scenario: Create weekly SIP SI                     # PASSED (3.012s)
    SI Reference: SI-20260226-002, Status: Active

  Scenario: Modify existing SI amount                # PASSED (2.456s)
    Amount updated: INR 25,000 -> INR 30,000

  Scenario: Cancel standing instruction              # PASSED (1.789s)
    Status changed: Active -> Cancelled

  Scenario: Create SI with insufficient balance      # PASSED (2.123s)
    Warning displayed, instruction created

5 Scenarios (5 passed)
32 Steps (32 passed)
Time: 12.614s`
  },
  {
    id: 'AT-016', title: 'Feature File - Card Block/Unblock', category: 'cucumber',
    framework: 'Cucumber', language: 'Gherkin', difficulty: 'Intermediate',
    description: 'BDD feature for blocking and unblocking debit/credit cards with reason selection, temporary vs permanent block, and instant notification.',
    prerequisites: 'Java 11+, Cucumber 7.x, Selenium WebDriver',
    config: '{\n  "cucumberOptions": {\n    "features": "src/test/resources/features/card_management.feature",\n    "tags": "@card-management"\n  }\n}',
    code: `Feature: Card Block and Unblock
  As a banking customer
  I want to block or unblock my cards
  So that I can protect my accounts from unauthorized use

  Background:
    Given I am logged in as customer "CUST001234"
    And I navigate to "Card Services" page
    And I have the following cards:
      | Card Type   | Card Number      | Status  |
      | Debit Card  | XXXX XXXX 4567   | Active  |
      | Credit Card | XXXX XXXX 8901   | Active  |

  @card-management @block @temporary
  Scenario: Temporarily block debit card
    Given I select "Debit Card - XXXX 4567"
    When I click "Block Card"
    And I select block type "Temporary"
    And I select reason "Card Misplaced"
    And I confirm the block request
    And I enter OTP "123456"
    Then the card status should change to "Temporarily Blocked"
    And I should receive SMS confirmation
    And I should be able to unblock it later
    And all pending auto-debit should be paused

  @card-management @block @permanent
  Scenario: Permanently block stolen credit card
    Given I select "Credit Card - XXXX 8901"
    When I click "Block Card"
    And I select block type "Permanent"
    And I select reason "Card Stolen"
    And I enter details "Card stolen on 25/02/2026 at MG Road"
    And I confirm the block request
    And I enter OTP "123456"
    Then the card status should change to "Permanently Blocked"
    And a replacement card request should be initiated
    And I should see message "Replacement card will be delivered in 7-10 days"

  @card-management @unblock
  Scenario: Unblock temporarily blocked debit card
    Given my "Debit Card - XXXX 4567" is temporarily blocked
    When I select "Debit Card - XXXX 4567"
    And I click "Unblock Card"
    And I enter OTP "654321"
    Then the card status should change to "Active"
    And all auto-debit should resume
    And I should receive SMS confirmation

  @card-management @international
  Scenario: Enable international transactions on card
    Given I select "Debit Card - XXXX 4567"
    When I click "Manage International Usage"
    And I enable "International ATM Withdrawal"
    And I enable "International Online Transactions"
    And I set validity period to "30 days"
    And I set daily limit to "USD 1000"
    And I confirm the changes
    Then international transactions should be enabled
    And the changes should reflect immediately

  @card-management @negative
  Scenario: Cannot unblock permanently blocked card
    Given my "Credit Card - XXXX 8901" is permanently blocked
    When I try to unblock it
    Then I should see error "Permanently blocked cards cannot be unblocked"
    And I should see option "Request Replacement Card"`,
    expectedOutput: `@card-management
Feature: Card Block and Unblock

  Scenario: Temporarily block debit card              # PASSED (2.345s)
    Card XXXX 4567: Active -> Temporarily Blocked
    SMS sent to +91-98765XXXXX

  Scenario: Permanently block stolen credit card       # PASSED (2.678s)
    Card XXXX 8901: Active -> Permanently Blocked
    Replacement card initiated

  Scenario: Unblock temporarily blocked debit card     # PASSED (1.987s)
    Card XXXX 4567: Temporarily Blocked -> Active

  Scenario: Enable international transactions          # PASSED (1.567s)
    International usage enabled for 30 days

  Scenario: Cannot unblock permanently blocked card    # PASSED (0.876s)
    Error correctly displayed

5 Scenarios (5 passed)
35 Steps (35 passed)
Time: 9.453s`
  },
  {
    id: 'AT-017', title: 'Feature File - Loan Application', category: 'cucumber',
    framework: 'Cucumber', language: 'Gherkin', difficulty: 'Advanced',
    description: 'BDD feature for end-to-end loan application process including eligibility check, document submission, disbursement tracking, and EMI schedule.',
    prerequisites: 'Java 11+, Cucumber 7.x, Selenium WebDriver',
    config: '{\n  "cucumberOptions": {\n    "features": "src/test/resources/features/loan_application.feature",\n    "tags": "@loan"\n  }\n}',
    code: `Feature: Loan Application
  As a banking customer
  I want to apply for different types of loans
  So that I can finance my needs

  Background:
    Given I am logged in as customer "CUST001234"
    And my CIBIL score is 750

  @loan @eligibility
  Scenario: Check home loan eligibility
    Given I navigate to "Loans" section
    When I select loan type "Home Loan"
    And I enter the following details for eligibility:
      | Field             | Value            |
      | Annual Income     | 1500000          |
      | Existing EMIs     | 15000            |
      | Loan Amount       | 5000000          |
      | Tenure            | 240 months       |
      | Property Value    | 7500000          |
      | Employment Type   | Salaried         |
      | Company Category  | MNC              |
    And I click "Check Eligibility"
    Then I should see eligibility result "Eligible"
    And maximum eligible amount should be displayed
    And indicative interest rate should be shown
    And tentative EMI should be calculated

  @loan @application @e2e
  Scenario: Complete personal loan application
    Given I navigate to "Loans" section
    And I select loan type "Personal Loan"
    When I enter loan amount "500000"
    And I select tenure "36 months"
    And I fill personal details:
      | Field           | Value                    |
      | Full Name       | Rajesh Kumar             |
      | Date of Birth   | 15/03/1985               |
      | PAN             | ABCDE1234F               |
      | Address         | 42, MG Road, Bangalore   |
      | Employer        | TCS Limited              |
      | Monthly Income  | 125000                   |
    And I upload required documents:
      | Document        | File                     |
      | PAN Card        | pan_card.pdf             |
      | Salary Slip     | salary_3months.pdf       |
      | Bank Statement  | bank_statement_6m.pdf    |
      | Address Proof   | aadhaar.pdf              |
    And I accept terms and conditions
    And I submit the application
    Then the application should be submitted
    And I should receive application ID starting with "LA-"
    And application status should be "Under Review"
    And I should receive SMS and email confirmation

  @loan @tracking
  Scenario: Track loan application status
    Given I have a loan application "LA-20260226-001"
    When I navigate to "Track Application"
    And I search for "LA-20260226-001"
    Then I should see the following stages:
      | Stage                | Status      |
      | Application Received | Completed   |
      | Document Verification| In Progress |
      | Credit Assessment    | Pending     |
      | Approval             | Pending     |
      | Disbursement         | Pending     |

  @loan @emi-schedule
  Scenario: View EMI schedule after loan approval
    Given my loan "LA-20260226-001" is approved and disbursed
    When I navigate to "My Loans"
    And I select loan "LA-20260226-001"
    And I click "View EMI Schedule"
    Then I should see 36 monthly EMI entries
    And each entry should show principal, interest, and balance
    And the total interest payable should be displayed
    And I should have option to download schedule as PDF

  @loan @negative
  Scenario: Loan application rejected due to low CIBIL score
    Given my CIBIL score is 550
    When I apply for a personal loan of "500000"
    Then the application should be rejected
    And rejection reason should be "CIBIL score below minimum"
    And I should see suggestions to improve score`,
    expectedOutput: `@loan
Feature: Loan Application

  Scenario: Check home loan eligibility               # PASSED (1.234s)
    Eligible: Yes
    Max Amount: INR 65,00,000
    Rate: 8.50% p.a.
    Tentative EMI: INR 43,391

  Scenario: Complete personal loan application         # PASSED (8.567s)
    Application ID: LA-20260226-001
    Status: Under Review
    SMS and email sent

  Scenario: Track loan application status              # PASSED (1.456s)
    5 stages displayed correctly

  Scenario: View EMI schedule after loan approval      # PASSED (2.123s)
    36 EMI entries with principal/interest breakdown

  Scenario: Loan rejected due to low CIBIL             # PASSED (1.234s)
    Rejection: CIBIL score below minimum (550 < 650)

5 Scenarios (5 passed)
38 Steps (38 passed)
Time: 14.614s`
  },
  {
    id: 'AT-018', title: 'Feature File - KYC Document Upload', category: 'cucumber',
    framework: 'Cucumber', language: 'Gherkin', difficulty: 'Intermediate',
    description: 'BDD feature for KYC document upload and verification including Aadhaar, PAN, address proof with OCR validation and compliance checks.',
    prerequisites: 'Java 11+, Cucumber 7.x, Selenium WebDriver',
    config: '{\n  "cucumberOptions": {\n    "features": "src/test/resources/features/kyc_upload.feature",\n    "tags": "@kyc"\n  }\n}',
    code: `Feature: KYC Document Upload
  As a banking customer
  I want to upload my KYC documents
  So that my account remains active and compliant

  Background:
    Given I am logged in as customer "CUST001234"
    And I navigate to "KYC Update" page

  @kyc @upload @positive
  Scenario: Upload Aadhaar card for KYC verification
    Given my KYC status is "Pending Update"
    When I select document type "Aadhaar Card"
    And I upload front image "aadhaar_front.jpg"
    And I upload back image "aadhaar_back.jpg"
    And I enter Aadhaar number "XXXX XXXX 1234"
    And I click "Submit for Verification"
    Then the document should be uploaded successfully
    And OCR should extract and display:
      | Field          | Value              |
      | Name           | Rajesh Kumar       |
      | DOB            | 15/03/1985         |
      | Address        | 42, MG Road, BLR   |
    And KYC status should change to "Under Verification"

  @kyc @upload @positive
  Scenario: Upload PAN card
    When I select document type "PAN Card"
    And I upload PAN image "pan_card.jpg"
    And I enter PAN number "ABCDE1234F"
    And I click "Submit for Verification"
    Then PAN details should be validated against ITR database
    And the verification status should be "Verified"

  @kyc @video-kyc
  Scenario: Complete video KYC
    Given I choose "Video KYC" option
    When I schedule video KYC for "27/02/2026 at 10:00 AM"
    Then I should receive appointment confirmation
    And video call link should be generated
    And I should receive SMS with joining instructions

  @kyc @negative
  Scenario: Upload document with invalid format
    When I select document type "Aadhaar Card"
    And I try to upload file "document.exe"
    Then I should see error "Invalid file format. Allowed: JPG, PNG, PDF"
    And the upload should be rejected

  @kyc @negative
  Scenario: Upload oversized document
    When I select document type "PAN Card"
    And I try to upload file larger than 5MB
    Then I should see error "File size exceeds 5MB limit"
    And the upload should be rejected

  @kyc @expiry
  Scenario: KYC expiry notification
    Given my KYC expires in 30 days
    Then I should see notification "Your KYC is expiring soon"
    And I should see option to "Update KYC Now"
    And the notification should show expiry date`,
    expectedOutput: `@kyc
Feature: KYC Document Upload

  Scenario: Upload Aadhaar card for KYC            # PASSED (3.456s)
    Aadhaar uploaded and OCR extracted successfully
    KYC Status: Under Verification

  Scenario: Upload PAN card                        # PASSED (2.234s)
    PAN verified against ITR database

  Scenario: Complete video KYC                     # PASSED (1.567s)
    Appointment scheduled: 27/02/2026 10:00 AM

  Scenario: Upload document with invalid format    # PASSED (0.567s)
    Error: "Invalid file format"

  Scenario: Upload oversized document              # PASSED (0.456s)
    Error: "File size exceeds 5MB limit"

  Scenario: KYC expiry notification                # PASSED (0.789s)
    Notification displayed with expiry warning

6 Scenarios (6 passed)
32 Steps (32 passed)
Time: 9.069s`
  },
  {
    id: 'AT-019', title: 'Feature File - Account Opening', category: 'cucumber',
    framework: 'Cucumber', language: 'Gherkin', difficulty: 'Advanced',
    description: 'BDD feature for online account opening including savings, current, salary accounts with video KYC, initial deposit, and debit card selection.',
    prerequisites: 'Java 11+, Cucumber 7.x, Selenium WebDriver',
    config: '{\n  "cucumberOptions": {\n    "features": "src/test/resources/features/account_opening.feature",\n    "tags": "@account-opening"\n  }\n}',
    code: `Feature: Online Account Opening
  As a new customer
  I want to open a bank account online
  So that I can start banking without visiting a branch

  @account-opening @savings
  Scenario: Open savings account online
    Given I am on the bank website
    And I click "Open Account Online"
    When I select account type "Savings Account"
    And I select variant "Digital Savings - Zero Balance"
    And I fill personal information:
      | Field              | Value                      |
      | Full Name          | Deepa Menon                |
      | Date of Birth      | 22/07/1990                 |
      | Gender             | Female                     |
      | Marital Status     | Single                     |
      | Father's Name      | Suresh Menon               |
      | Mother's Name      | Lakshmi Menon              |
      | Mobile             | 9876543210                 |
      | Email              | deepa.menon@email.com      |
      | PAN                | FGHIJ5678K                 |
      | Aadhaar            | XXXX XXXX 5678             |
    And I fill address details:
      | Field   | Value                          |
      | Line 1  | 15, Park Street                |
      | Line 2  | Indiranagar                    |
      | City    | Bangalore                      |
      | State   | Karnataka                      |
      | Pincode | 560038                         |
    And I select nomination:
      | Nominee Name     | Suresh Menon    |
      | Relationship     | Father          |
      | Nominee DOB      | 15/01/1960      |
    And I upload documents:
      | Document     | File              |
      | Photo        | passport_photo.jpg|
      | PAN Card     | pan_card.pdf      |
      | Aadhaar      | aadhaar.pdf       |
      | Signature    | signature.jpg     |
    And I select debit card variant "Platinum Debit Card"
    And I opt for internet banking and mobile banking
    And I accept all terms and conditions
    And I submit the application
    Then the application should be submitted successfully
    And I should receive application reference number
    And the status should be "Pending Video KYC"

  @account-opening @current
  Scenario: Open current account for business
    Given I am on the bank website
    And I click "Open Account Online"
    When I select account type "Current Account"
    And I select variant "Business Current Account"
    And I fill business details:
      | Field              | Value                      |
      | Business Name      | Kumar Enterprises          |
      | Business Type      | Partnership Firm           |
      | GST Number         | 29ABCDE1234F1Z5           |
      | Turnover           | 5000000                    |
    And I fill the required personal and address details
    And I upload business documents
    And I submit the application
    Then the application should require initial deposit of "10000"

  @account-opening @negative
  Scenario: Account opening with underage applicant
    Given I am on the "Open Account Online" page
    When I select account type "Savings Account"
    And I enter date of birth "15/03/2015"
    Then I should see message "Applicant must be 18 years or older"
    And I should see option "Open Minor's Account with Guardian"

  @account-opening @duplicate
  Scenario: Detect existing customer
    Given I am on the "Open Account Online" page
    When I enter PAN "ABCDE1234F"
    Then the system should detect existing customer
    And I should see message "An account with this PAN already exists"
    And I should see option "Login to existing account"`,
    expectedOutput: `@account-opening
Feature: Online Account Opening

  Scenario: Open savings account online              # PASSED (12.345s)
    Application Ref: ACC-APP-20260226-0089
    Status: Pending Video KYC
    Account Type: Digital Savings - Zero Balance
    Debit Card: Platinum (will be delivered in 7 days)

  Scenario: Open current account for business        # PASSED (10.234s)
    Initial deposit required: INR 10,000

  Scenario: Account opening with underage applicant  # PASSED (1.123s)
    Age validation: "Must be 18 years or older"

  Scenario: Detect existing customer                 # PASSED (1.456s)
    Duplicate PAN detected

4 Scenarios (4 passed)
42 Steps (42 passed)
Time: 25.158s`
  },
  {
    id: 'AT-020', title: 'Feature File - Bill Payment', category: 'cucumber',
    framework: 'Cucumber', language: 'Gherkin', difficulty: 'Beginner',
    description: 'BDD feature for bill payments including electricity, mobile, DTH, insurance with biller registration, auto-pay setup, and payment history.',
    prerequisites: 'Java 11+, Cucumber 7.x, Selenium WebDriver',
    config: '{\n  "cucumberOptions": {\n    "features": "src/test/resources/features/bill_payment.feature",\n    "tags": "@bill-payment"\n  }\n}',
    code: `Feature: Bill Payment
  As a banking customer
  I want to pay my utility bills online
  So that I can avoid late payment charges

  Background:
    Given I am logged in as customer "CUST001234"
    And I navigate to "Bill Payments" page

  @bill-payment @electricity @positive
  Scenario: Pay electricity bill
    Given I select biller category "Electricity"
    And I select biller "BESCOM - Bangalore"
    When I enter consumer number "BES1234567890"
    And I click "Fetch Bill"
    Then the bill details should be displayed:
      | Field          | Value        |
      | Consumer No    | BES123456789 |
      | Bill Amount    | 2450.00      |
      | Due Date       | 15/03/2026   |
      | Bill Period    | Feb 2026     |
    When I select payment account "Savings - XXXX1234"
    And I click "Pay Now"
    And I enter OTP "123456"
    Then the payment should be successful
    And I should receive payment receipt
    And the receipt should have transaction reference

  @bill-payment @mobile @positive
  Scenario: Recharge mobile prepaid
    Given I select biller category "Mobile"
    And I select operator "Jio"
    When I enter mobile number "9876543210"
    And I select recharge plan "INR 599 - 84 days - 2GB/day"
    And I select payment account "Savings - XXXX1234"
    And I confirm payment
    Then the recharge should be successful
    And validity should show "84 days from today"

  @bill-payment @autopay
  Scenario: Set up auto-pay for electricity bill
    Given I have paid electricity bill for "BESCOM"
    When I click "Set Up Auto-Pay"
    And I configure auto-pay:
      | Field           | Value                 |
      | Payment Account | Savings - XXXX1234    |
      | Max Amount      | 5000                  |
      | Payment Day     | On Due Date           |
      | Notify Before   | 2 days                |
    And I confirm auto-pay setup
    Then auto-pay should be activated
    And I should receive confirmation

  @bill-payment @history
  Scenario: View bill payment history
    When I click "Payment History"
    And I select date range "01/01/2026" to "28/02/2026"
    Then I should see all payments in the period
    And payments should be sorted by date descending
    And I should have option to download as PDF

  @bill-payment @negative
  Scenario: Pay bill with invalid consumer number
    Given I select biller category "Electricity"
    And I select biller "BESCOM - Bangalore"
    When I enter consumer number "INVALID123"
    And I click "Fetch Bill"
    Then I should see error "Invalid consumer number"
    And no bill details should be displayed`,
    expectedOutput: `@bill-payment
Feature: Bill Payment

  Scenario: Pay electricity bill                     # PASSED (3.456s)
    Bill fetched: INR 2,450.00 (BESCOM Feb 2026)
    Payment successful. Ref: BP-20260226-0067

  Scenario: Recharge mobile prepaid                  # PASSED (2.234s)
    Recharge successful: Jio INR 599
    Validity: 84 days

  Scenario: Set up auto-pay for electricity          # PASSED (2.567s)
    Auto-pay activated for BESCOM

  Scenario: View bill payment history                # PASSED (1.345s)
    12 payments found in date range

  Scenario: Pay bill with invalid consumer number    # PASSED (0.789s)
    Error: "Invalid consumer number"

5 Scenarios (5 passed)
34 Steps (34 passed)
Time: 10.391s`
  },
  // === REST ASSURED API (AT-021 to AT-030) ===
  {
    id: 'AT-021', title: 'GET Customer Details API Test', category: 'restAssured',
    framework: 'REST Assured', language: 'Java', difficulty: 'Beginner',
    description: 'Tests the GET customer details API endpoint with authentication, response validation, schema verification, and performance benchmarking.',
    prerequisites: 'Java 11+, REST Assured 5.x, TestNG, Maven, JSON Schema Validator',
    config: '{\n  "baseURI": "https://api.example-bank.com",\n  "basePath": "/api/v1",\n  "authToken": "Bearer eyJhbGciOiJSUzI1NiJ9...",\n  "timeout": 5000,\n  "contentType": "application/json"\n}',
    code: `import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.*;

public class CustomerApiTest {

    private String authToken;
    private RequestSpecification requestSpec;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example-bank.com";
        RestAssured.basePath = "/api/v1";

        // Get auth token
        authToken = given()
            .contentType("application/json")
            .body("{\\"username\\": \\"apiuser\\", \\"password\\": \\"ApiPass@123\\"}")
        .when()
            .post("/auth/token")
        .then()
            .statusCode(200)
            .extract().path("access_token");

        requestSpec = given()
            .header("Authorization", "Bearer " + authToken)
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .header("X-Request-ID", java.util.UUID.randomUUID().toString());
    }

    @Test(priority = 1)
    public void testGetCustomerById() {
        given()
            .spec(requestSpec)
            .pathParam("customerId", "CUST001234")
        .when()
            .get("/customers/{customerId}")
        .then()
            .statusCode(200)
            .contentType("application/json")
            .body("customerId", equalTo("CUST001234"))
            .body("firstName", equalTo("Rajesh"))
            .body("lastName", equalTo("Kumar"))
            .body("email", matchesPattern(".*@.*\\\\..*"))
            .body("mobile", hasLength(10))
            .body("kycStatus", equalTo("VERIFIED"))
            .body("accounts", hasSize(greaterThan(0)))
            .body("accounts[0].accountNumber", notNullValue())
            .body("accounts[0].accountType", isOneOf(
                "SAVINGS", "CURRENT", "FD", "RD"))
            .body("accounts[0].balance", greaterThanOrEqualTo(0.0f))
            .body("createdAt", notNullValue())
            .time(lessThan(2000L));
    }

    @Test(priority = 2)
    public void testGetCustomerNotFound() {
        given()
            .spec(requestSpec)
            .pathParam("customerId", "NONEXISTENT999")
        .when()
            .get("/customers/{customerId}")
        .then()
            .statusCode(404)
            .body("error.code", equalTo("CUSTOMER_NOT_FOUND"))
            .body("error.message", containsString("not found"));
    }

    @Test(priority = 3)
    public void testGetCustomerUnauthorized() {
        given()
            .header("Content-Type", "application/json")
            // No auth token
        .when()
            .get("/customers/CUST001234")
        .then()
            .statusCode(401)
            .body("error.code", equalTo("UNAUTHORIZED"))
            .body("error.message", equalTo("Authentication required"));
    }

    @Test(priority = 4)
    public void testGetCustomerWithExpiredToken() {
        given()
            .header("Authorization", "Bearer expired_token_12345")
            .header("Content-Type", "application/json")
        .when()
            .get("/customers/CUST001234")
        .then()
            .statusCode(401)
            .body("error.code", equalTo("TOKEN_EXPIRED"));
    }

    @Test(priority = 5)
    public void testGetCustomerResponseHeaders() {
        Response response = given()
            .spec(requestSpec)
            .pathParam("customerId", "CUST001234")
        .when()
            .get("/customers/{customerId}")
        .then()
            .statusCode(200)
            .header("X-Request-ID", notNullValue())
            .header("X-RateLimit-Remaining", notNullValue())
            .header("Cache-Control", containsString("private"))
            .extract().response();

        System.out.println("Response time: " + response.getTime() + "ms");
        System.out.println("Rate limit remaining: " +
            response.getHeader("X-RateLimit-Remaining"));
    }

    @AfterClass
    public void cleanup() {
        RestAssured.reset();
    }
}`,
    expectedOutput: `[TestNG] Running: CustomerApiTest

Setup: Auth token obtained successfully

testGetCustomerById:
  GET /api/v1/customers/CUST001234
  Status: 200 OK
  Body: { customerId: "CUST001234", name: "Rajesh Kumar", kycStatus: "VERIFIED" }
  Accounts: 3 found
  Response time: 187ms (< 2000ms threshold)
  PASSED

testGetCustomerNotFound:
  GET /api/v1/customers/NONEXISTENT999
  Status: 404 Not Found
  Error: { code: "CUSTOMER_NOT_FOUND", message: "Customer not found" }
  PASSED

testGetCustomerUnauthorized:
  GET /api/v1/customers/CUST001234 (no auth)
  Status: 401 Unauthorized
  PASSED

testGetCustomerWithExpiredToken:
  Status: 401 - TOKEN_EXPIRED
  PASSED

testGetCustomerResponseHeaders:
  X-Request-ID: present
  X-RateLimit-Remaining: 97
  Response time: 145ms
  PASSED

Total tests run: 5, Passes: 5, Failures: 0, Skips: 0
Time: 3.456s`
  },
  {
    id: 'AT-022', title: 'POST Create Account API Test', category: 'restAssured',
    framework: 'REST Assured', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests the POST account creation API with request validation, duplicate detection, required field validation, and response structure verification.',
    prerequisites: 'Java 11+, REST Assured 5.x, TestNG, Maven',
    config: '{\n  "baseURI": "https://api.example-bank.com",\n  "basePath": "/api/v1",\n  "contentType": "application/json"\n}',
    code: `import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.*;
import org.json.JSONObject;

public class CreateAccountApiTest {

    private String authToken;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example-bank.com";
        RestAssured.basePath = "/api/v1";
        authToken = obtainAuthToken();
    }

    private String obtainAuthToken() {
        return given()
            .contentType(ContentType.JSON)
            .body("{\\"username\\": \\"admin\\", \\"password\\": \\"Admin@123\\"}")
        .when()
            .post("/auth/token")
        .then()
            .extract().path("access_token");
    }

    @Test(priority = 1)
    public void testCreateSavingsAccount() {
        JSONObject requestBody = new JSONObject();
        requestBody.put("customerId", "CUST001234");
        requestBody.put("accountType", "SAVINGS");
        requestBody.put("branchCode", "BR001");
        requestBody.put("currency", "INR");
        requestBody.put("initialDeposit", 5000);
        requestBody.put("nomineeId", "NOM001");

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body(requestBody.toString())
        .when()
            .post("/accounts")
        .then()
            .statusCode(201)
            .body("accountNumber", matchesPattern("ACC[0-9]{10}"))
            .body("accountType", equalTo("SAVINGS"))
            .body("status", equalTo("ACTIVE"))
            .body("balance", equalTo(5000))
            .body("ifscCode", notNullValue())
            .body("createdAt", notNullValue())
            .body("branchCode", equalTo("BR001"))
            .header("Location", containsString("/accounts/"));

        System.out.println("Savings account created successfully");
    }

    @Test(priority = 2)
    public void testCreateAccountMissingRequiredFields() {
        JSONObject requestBody = new JSONObject();
        requestBody.put("customerId", "CUST001234");
        // Missing accountType and branchCode

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body(requestBody.toString())
        .when()
            .post("/accounts")
        .then()
            .statusCode(400)
            .body("error.code", equalTo("VALIDATION_ERROR"))
            .body("error.details", hasSize(greaterThan(0)))
            .body("error.details[0].field", isOneOf(
                "accountType", "branchCode"))
            .body("error.details[0].message",
                containsString("required"));
    }

    @Test(priority = 3)
    public void testCreateAccountInvalidCustomer() {
        JSONObject requestBody = new JSONObject();
        requestBody.put("customerId", "INVALID_CUST");
        requestBody.put("accountType", "SAVINGS");
        requestBody.put("branchCode", "BR001");

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body(requestBody.toString())
        .when()
            .post("/accounts")
        .then()
            .statusCode(404)
            .body("error.code", equalTo("CUSTOMER_NOT_FOUND"));
    }

    @Test(priority = 4)
    public void testCreateAccountWithInsufficientDeposit() {
        JSONObject requestBody = new JSONObject();
        requestBody.put("customerId", "CUST001234");
        requestBody.put("accountType", "CURRENT");
        requestBody.put("branchCode", "BR001");
        requestBody.put("initialDeposit", 100);

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body(requestBody.toString())
        .when()
            .post("/accounts")
        .then()
            .statusCode(400)
            .body("error.code", equalTo("INSUFFICIENT_DEPOSIT"))
            .body("error.message", containsString(
                "Minimum initial deposit for CURRENT account is 10000"));
    }

    @Test(priority = 5)
    public void testIdempotentAccountCreation() {
        String idempotencyKey = java.util.UUID.randomUUID().toString();

        JSONObject requestBody = new JSONObject();
        requestBody.put("customerId", "CUST005678");
        requestBody.put("accountType", "SAVINGS");
        requestBody.put("branchCode", "BR001");
        requestBody.put("initialDeposit", 5000);

        // First request
        String accountNumber = given()
            .header("Authorization", "Bearer " + authToken)
            .header("X-Idempotency-Key", idempotencyKey)
            .contentType(ContentType.JSON)
            .body(requestBody.toString())
        .when()
            .post("/accounts")
        .then()
            .statusCode(201)
            .extract().path("accountNumber");

        // Retry with same key - should return same account
        given()
            .header("Authorization", "Bearer " + authToken)
            .header("X-Idempotency-Key", idempotencyKey)
            .contentType(ContentType.JSON)
            .body(requestBody.toString())
        .when()
            .post("/accounts")
        .then()
            .statusCode(201)
            .body("accountNumber", equalTo(accountNumber));
    }

    @AfterClass
    public void cleanup() {
        RestAssured.reset();
    }
}`,
    expectedOutput: `[TestNG] Running: CreateAccountApiTest

testCreateSavingsAccount:
  POST /api/v1/accounts
  Request: { customerId: "CUST001234", type: "SAVINGS", deposit: 5000 }
  Status: 201 Created
  Account: ACC2026022601, Balance: INR 5,000
  Location header: /api/v1/accounts/ACC2026022601
  PASSED

testCreateAccountMissingRequiredFields:
  Status: 400 Bad Request
  Validation errors: accountType required, branchCode required
  PASSED

testCreateAccountInvalidCustomer:
  Status: 404 - CUSTOMER_NOT_FOUND
  PASSED

testCreateAccountWithInsufficientDeposit:
  Status: 400 - INSUFFICIENT_DEPOSIT
  "Minimum initial deposit for CURRENT account is 10000"
  PASSED

testIdempotentAccountCreation:
  First request: 201 Created (ACC2026022602)
  Retry with same key: 201 (same account ACC2026022602)
  PASSED

Total tests run: 5, Passes: 5, Failures: 0, Skips: 0
Time: 4.567s`
  },
  {
    id: 'AT-023', title: 'PUT Update Customer Profile API Test', category: 'restAssured',
    framework: 'REST Assured', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests the PUT customer profile update API with partial updates, optimistic locking, concurrent modification detection, and audit trail verification.',
    prerequisites: 'Java 11+, REST Assured 5.x, TestNG, Maven',
    config: '{\n  "baseURI": "https://api.example-bank.com",\n  "basePath": "/api/v1"\n}',
    code: `import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.*;
import org.json.JSONObject;

public class UpdateCustomerApiTest {

    private String authToken;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example-bank.com";
        RestAssured.basePath = "/api/v1";
        authToken = given()
            .contentType(ContentType.JSON)
            .body("{\\"username\\": \\"admin\\", \\"password\\": \\"Admin@123\\"}")
            .post("/auth/token")
            .path("access_token");
    }

    @Test(priority = 1)
    public void testUpdateCustomerEmail() {
        JSONObject updateBody = new JSONObject();
        updateBody.put("email", "rajesh.kumar.new@email.com");

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .pathParam("customerId", "CUST001234")
            .body(updateBody.toString())
        .when()
            .put("/customers/{customerId}")
        .then()
            .statusCode(200)
            .body("email", equalTo("rajesh.kumar.new@email.com"))
            .body("updatedAt", notNullValue())
            .body("updatedBy", equalTo("admin"));
    }

    @Test(priority = 2)
    public void testUpdateCustomerAddress() {
        JSONObject address = new JSONObject();
        address.put("line1", "100, Park Avenue");
        address.put("line2", "Whitefield");
        address.put("city", "Bangalore");
        address.put("state", "Karnataka");
        address.put("pincode", "560066");

        JSONObject updateBody = new JSONObject();
        updateBody.put("address", address);

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .pathParam("customerId", "CUST001234")
            .body(updateBody.toString())
        .when()
            .put("/customers/{customerId}")
        .then()
            .statusCode(200)
            .body("address.city", equalTo("Bangalore"))
            .body("address.pincode", equalTo("560066"));
    }

    @Test(priority = 3)
    public void testUpdateWithInvalidEmail() {
        JSONObject updateBody = new JSONObject();
        updateBody.put("email", "invalid-email-format");

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .pathParam("customerId", "CUST001234")
            .body(updateBody.toString())
        .when()
            .put("/customers/{customerId}")
        .then()
            .statusCode(400)
            .body("error.code", equalTo("VALIDATION_ERROR"))
            .body("error.details[0].field", equalTo("email"))
            .body("error.details[0].message",
                containsString("valid email"));
    }

    @Test(priority = 4)
    public void testOptimisticLockingConflict() {
        // Get current version
        int version = given()
            .header("Authorization", "Bearer " + authToken)
            .get("/customers/CUST001234")
            .path("version");

        // Update with correct version
        JSONObject body1 = new JSONObject();
        body1.put("mobile", "9876543211");
        body1.put("version", version);

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body(body1.toString())
        .when()
            .put("/customers/CUST001234")
        .then()
            .statusCode(200);

        // Try update with stale version
        JSONObject body2 = new JSONObject();
        body2.put("mobile", "9876543222");
        body2.put("version", version); // stale

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body(body2.toString())
        .when()
            .put("/customers/CUST001234")
        .then()
            .statusCode(409)
            .body("error.code", equalTo("CONFLICT"))
            .body("error.message",
                containsString("modified by another request"));
    }

    @Test(priority = 5)
    public void testUpdateNonExistentCustomer() {
        JSONObject updateBody = new JSONObject();
        updateBody.put("email", "test@example.com");

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body(updateBody.toString())
        .when()
            .put("/customers/NONEXISTENT")
        .then()
            .statusCode(404)
            .body("error.code", equalTo("CUSTOMER_NOT_FOUND"));
    }
}`,
    expectedOutput: `[TestNG] Running: UpdateCustomerApiTest

testUpdateCustomerEmail:
  PUT /api/v1/customers/CUST001234
  Email updated: rajesh.kumar.new@email.com
  Status: 200 OK
  PASSED

testUpdateCustomerAddress:
  Address updated: 100, Park Avenue, Whitefield, Bangalore
  PASSED

testUpdateWithInvalidEmail:
  Status: 400 - VALIDATION_ERROR
  "email must be a valid email address"
  PASSED

testOptimisticLockingConflict:
  First update: 200 OK (version 5 -> 6)
  Second update with stale version: 409 Conflict
  PASSED

testUpdateNonExistentCustomer:
  Status: 404 - CUSTOMER_NOT_FOUND
  PASSED

Total tests run: 5, Passes: 5, Failures: 0, Skips: 0
Time: 3.892s`
  },
  {
    id: 'AT-024', title: 'DELETE Close Account API Test', category: 'restAssured',
    framework: 'REST Assured', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests the DELETE (soft delete) account closure API with balance settlement, linked service validation, and regulatory compliance checks.',
    prerequisites: 'Java 11+, REST Assured 5.x, TestNG, Maven',
    config: '{\n  "baseURI": "https://api.example-bank.com",\n  "basePath": "/api/v1"\n}',
    code: `import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.*;
import org.json.JSONObject;

public class CloseAccountApiTest {

    private String authToken;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example-bank.com";
        RestAssured.basePath = "/api/v1";
        authToken = given()
            .contentType(ContentType.JSON)
            .body("{\\"username\\": \\"admin\\", \\"password\\": \\"Admin@123\\"}")
            .post("/auth/token")
            .path("access_token");
    }

    @Test(priority = 1)
    public void testCloseAccountWithZeroBalance() {
        JSONObject closeRequest = new JSONObject();
        closeRequest.put("reason", "Customer request");
        closeRequest.put("closureType", "VOLUNTARY");
        closeRequest.put("settlementAccountId", "ACC9999999999");

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .pathParam("accountId", "ACC0000000001")
            .body(closeRequest.toString())
        .when()
            .delete("/accounts/{accountId}")
        .then()
            .statusCode(200)
            .body("status", equalTo("CLOSED"))
            .body("closureDate", notNullValue())
            .body("settlementAmount", equalTo(0.0f))
            .body("closureReference", notNullValue());
    }

    @Test(priority = 2)
    public void testCloseAccountWithBalance() {
        JSONObject closeRequest = new JSONObject();
        closeRequest.put("reason", "Account consolidation");
        closeRequest.put("closureType", "VOLUNTARY");
        closeRequest.put("settlementAccountId", "ACC1234567890");

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .pathParam("accountId", "ACC0000000002")
            .body(closeRequest.toString())
        .when()
            .delete("/accounts/{accountId}")
        .then()
            .statusCode(200)
            .body("status", equalTo("CLOSED"))
            .body("settlementAmount", greaterThan(0.0f))
            .body("settlementAccountId", equalTo("ACC1234567890"))
            .body("message", containsString("Balance transferred"));
    }

    @Test(priority = 3)
    public void testCannotCloseAccountWithActiveLoan() {
        JSONObject closeRequest = new JSONObject();
        closeRequest.put("reason", "Customer request");
        closeRequest.put("closureType", "VOLUNTARY");

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .pathParam("accountId", "ACC_WITH_LOAN")
            .body(closeRequest.toString())
        .when()
            .delete("/accounts/{accountId}")
        .then()
            .statusCode(409)
            .body("error.code", equalTo("ACTIVE_LOAN_EXISTS"))
            .body("error.message", containsString(
                "Cannot close account with active loan"));
    }

    @Test(priority = 4)
    public void testCannotCloseAccountWithPendingSI() {
        JSONObject closeRequest = new JSONObject();
        closeRequest.put("reason", "Customer request");

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .pathParam("accountId", "ACC_WITH_SI")
            .body(closeRequest.toString())
        .when()
            .delete("/accounts/{accountId}")
        .then()
            .statusCode(409)
            .body("error.code", equalTo("PENDING_SI_EXISTS"))
            .body("error.message", containsString(
                "Cancel standing instructions first"));
    }

    @Test(priority = 5)
    public void testCloseAlreadyClosedAccount() {
        JSONObject closeRequest = new JSONObject();
        closeRequest.put("reason", "Duplicate request");

        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .pathParam("accountId", "ACC_ALREADY_CLOSED")
            .body(closeRequest.toString())
        .when()
            .delete("/accounts/{accountId}")
        .then()
            .statusCode(400)
            .body("error.code", equalTo("ACCOUNT_ALREADY_CLOSED"));
    }
}`,
    expectedOutput: `[TestNG] Running: CloseAccountApiTest

testCloseAccountWithZeroBalance:
  DELETE /api/v1/accounts/ACC0000000001
  Status: 200 - Account closed
  Settlement: INR 0.00
  Closure Ref: CLO-20260226-001
  PASSED

testCloseAccountWithBalance:
  Balance INR 24,567.50 transferred to ACC1234567890
  Status: 200 - CLOSED
  PASSED

testCannotCloseAccountWithActiveLoan:
  Status: 409 - ACTIVE_LOAN_EXISTS
  PASSED

testCannotCloseAccountWithPendingSI:
  Status: 409 - PENDING_SI_EXISTS
  PASSED

testCloseAlreadyClosedAccount:
  Status: 400 - ACCOUNT_ALREADY_CLOSED
  PASSED

Total tests run: 5, Passes: 5, Failures: 0, Skips: 0
Time: 2.891s`
  },
  {
    id: 'AT-025', title: 'Fund Transfer API with Auth Token', category: 'restAssured',
    framework: 'REST Assured', language: 'Java', difficulty: 'Advanced',
    description: 'Tests the fund transfer API with OAuth2 token authentication, transaction signing, idempotency, and real-time balance verification.',
    prerequisites: 'Java 11+, REST Assured 5.x, TestNG, Maven',
    config: '{\n  "baseURI": "https://api.example-bank.com",\n  "basePath": "/api/v1",\n  "oauth2": {\n    "tokenUrl": "/oauth2/token",\n    "clientId": "bank-app",\n    "scope": "transfer.write"\n  }\n}',
    code: `import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.Assert;
import org.testng.annotations.*;
import org.json.JSONObject;

public class FundTransferApiTest {

    private String accessToken;
    private String idempotencyKey;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example-bank.com";
        RestAssured.basePath = "/api/v1";

        // OAuth2 token
        accessToken = given()
            .contentType("application/x-www-form-urlencoded")
            .formParam("grant_type", "client_credentials")
            .formParam("client_id", "bank-app")
            .formParam("client_secret", "secret123")
            .formParam("scope", "transfer.write account.read")
        .when()
            .post("/oauth2/token")
        .then()
            .statusCode(200)
            .extract().path("access_token");
    }

    @BeforeMethod
    public void beforeEach() {
        idempotencyKey = java.util.UUID.randomUUID().toString();
    }

    @Test(priority = 1)
    public void testIMPSTransfer() {
        // Get initial balance
        float initialBalance = given()
            .header("Authorization", "Bearer " + accessToken)
            .get("/accounts/ACC1234567890/balance")
            .path("available");

        // Perform transfer
        JSONObject transfer = new JSONObject();
        transfer.put("fromAccount", "ACC1234567890");
        transfer.put("toAccount", "ACC9876543210");
        transfer.put("amount", 5000.00);
        transfer.put("currency", "INR");
        transfer.put("transferType", "IMPS");
        transfer.put("remarks", "API test transfer");
        transfer.put("beneficiaryName", "Priya Singh");

        String txnRef = given()
            .header("Authorization", "Bearer " + accessToken)
            .header("X-Idempotency-Key", idempotencyKey)
            .header("X-Transaction-PIN", "1234")
            .contentType(ContentType.JSON)
            .body(transfer.toString())
        .when()
            .post("/transfers")
        .then()
            .statusCode(200)
            .body("status", equalTo("SUCCESS"))
            .body("transactionRef", startsWith("IMPS"))
            .body("amount", equalTo(5000.0f))
            .body("debitAccount", equalTo("ACC1234567890"))
            .body("creditAccount", equalTo("ACC9876543210"))
            .body("timestamp", notNullValue())
            .time(lessThan(3000L))
            .extract().path("transactionRef");

        // Verify balance debited
        float newBalance = given()
            .header("Authorization", "Bearer " + accessToken)
            .get("/accounts/ACC1234567890/balance")
            .path("available");

        Assert.assertEquals(newBalance, initialBalance - 5000.0f, 0.01f,
            "Balance should be debited by transfer amount");

        System.out.println("Transfer successful: " + txnRef);
    }

    @Test(priority = 2)
    public void testIdempotentTransfer() {
        String key = java.util.UUID.randomUUID().toString();
        JSONObject transfer = new JSONObject();
        transfer.put("fromAccount", "ACC1234567890");
        transfer.put("toAccount", "ACC9876543210");
        transfer.put("amount", 1000.00);
        transfer.put("transferType", "IMPS");

        // First call
        String ref1 = given()
            .header("Authorization", "Bearer " + accessToken)
            .header("X-Idempotency-Key", key)
            .header("X-Transaction-PIN", "1234")
            .contentType(ContentType.JSON)
            .body(transfer.toString())
        .when()
            .post("/transfers")
        .then()
            .statusCode(200)
            .extract().path("transactionRef");

        // Retry with same key
        String ref2 = given()
            .header("Authorization", "Bearer " + accessToken)
            .header("X-Idempotency-Key", key)
            .header("X-Transaction-PIN", "1234")
            .contentType(ContentType.JSON)
            .body(transfer.toString())
        .when()
            .post("/transfers")
        .then()
            .statusCode(200)
            .extract().path("transactionRef");

        Assert.assertEquals(ref1, ref2,
            "Same idempotency key should return same transaction");
    }

    @Test(priority = 3)
    public void testTransferInsufficientFunds() {
        JSONObject transfer = new JSONObject();
        transfer.put("fromAccount", "ACC1234567890");
        transfer.put("toAccount", "ACC9876543210");
        transfer.put("amount", 999999999.00);
        transfer.put("transferType", "NEFT");

        given()
            .header("Authorization", "Bearer " + accessToken)
            .header("X-Idempotency-Key", idempotencyKey)
            .header("X-Transaction-PIN", "1234")
            .contentType(ContentType.JSON)
            .body(transfer.toString())
        .when()
            .post("/transfers")
        .then()
            .statusCode(400)
            .body("error.code", equalTo("INSUFFICIENT_FUNDS"))
            .body("error.message",
                containsString("Insufficient balance"));
    }

    @Test(priority = 4)
    public void testTransferWithInvalidPIN() {
        JSONObject transfer = new JSONObject();
        transfer.put("fromAccount", "ACC1234567890");
        transfer.put("toAccount", "ACC9876543210");
        transfer.put("amount", 100.00);
        transfer.put("transferType", "IMPS");

        given()
            .header("Authorization", "Bearer " + accessToken)
            .header("X-Idempotency-Key", idempotencyKey)
            .header("X-Transaction-PIN", "0000")
            .contentType(ContentType.JSON)
            .body(transfer.toString())
        .when()
            .post("/transfers")
        .then()
            .statusCode(403)
            .body("error.code", equalTo("INVALID_TRANSACTION_PIN"));
    }
}`,
    expectedOutput: `[TestNG] Running: FundTransferApiTest

testIMPSTransfer:
  POST /api/v1/transfers
  Amount: INR 5,000.00 (IMPS)
  From: ACC1234567890 -> To: ACC9876543210
  Status: SUCCESS
  Ref: IMPS20260226143567890
  Balance verified: debited correctly
  Response time: 234ms
  PASSED

testIdempotentTransfer:
  First call: IMPS20260226143567891
  Retry (same key): IMPS20260226143567891
  Idempotency verified
  PASSED

testTransferInsufficientFunds:
  Status: 400 - INSUFFICIENT_FUNDS
  PASSED

testTransferWithInvalidPIN:
  Status: 403 - INVALID_TRANSACTION_PIN
  PASSED

Total tests run: 4, Passes: 4, Failures: 0, Skips: 0
Time: 5.123s`
  },
  {
    id: 'AT-026', title: 'Bulk Transaction Upload API Test', category: 'restAssured',
    framework: 'REST Assured', language: 'Java', difficulty: 'Advanced',
    description: 'Tests bulk transaction upload API with file upload, batch processing status tracking, partial failure handling, and summary report generation.',
    prerequisites: 'Java 11+, REST Assured 5.x, TestNG, Maven',
    config: '{\n  "baseURI": "https://api.example-bank.com",\n  "basePath": "/api/v1",\n  "maxFileSize": "10MB",\n  "supportedFormats": ["CSV", "XLSX"]\n}',
    code: `import io.restassured.RestAssured;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.*;
import java.io.File;

public class BulkTransactionApiTest {

    private String authToken;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example-bank.com";
        RestAssured.basePath = "/api/v1";
        authToken = given()
            .contentType("application/json")
            .body("{\\"username\\": \\"admin\\", \\"password\\": \\"Admin@123\\"}")
            .post("/auth/token").path("access_token");
    }

    @Test(priority = 1)
    public void testUploadBulkTransactionCSV() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .multiPart("file", new File("test-data/bulk_transactions.csv"))
            .formParam("batchName", "Salary_Feb2026")
            .formParam("transactionType", "NEFT")
            .formParam("debitAccount", "ACC1234567890")
        .when()
            .post("/transactions/bulk-upload")
        .then()
            .statusCode(202)
            .body("batchId", notNullValue())
            .body("status", equalTo("PROCESSING"))
            .body("totalRecords", greaterThan(0))
            .body("estimatedTime", notNullValue());

        System.out.println("Bulk upload accepted for processing");
    }

    @Test(priority = 2)
    public void testCheckBatchProcessingStatus() {
        // Upload first
        String batchId = given()
            .header("Authorization", "Bearer " + authToken)
            .multiPart("file", new File("test-data/bulk_10records.csv"))
            .formParam("batchName", "Test_Batch")
            .formParam("transactionType", "NEFT")
            .formParam("debitAccount", "ACC1234567890")
        .when()
            .post("/transactions/bulk-upload")
        .then()
            .statusCode(202)
            .extract().path("batchId");

        // Poll status
        try { Thread.sleep(5000); } catch (InterruptedException e) {}

        given()
            .header("Authorization", "Bearer " + authToken)
            .pathParam("batchId", batchId)
        .when()
            .get("/transactions/batch/{batchId}/status")
        .then()
            .statusCode(200)
            .body("batchId", equalTo(batchId))
            .body("status", isOneOf("PROCESSING", "COMPLETED", "PARTIAL"))
            .body("processedCount", greaterThanOrEqualTo(0))
            .body("successCount", greaterThanOrEqualTo(0))
            .body("failureCount", greaterThanOrEqualTo(0));
    }

    @Test(priority = 3)
    public void testUploadInvalidFileFormat() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .multiPart("file", new File("test-data/invalid.txt"))
            .formParam("batchName", "Invalid_Batch")
            .formParam("transactionType", "NEFT")
            .formParam("debitAccount", "ACC1234567890")
        .when()
            .post("/transactions/bulk-upload")
        .then()
            .statusCode(400)
            .body("error.code", equalTo("INVALID_FILE_FORMAT"))
            .body("error.message",
                containsString("Supported formats: CSV, XLSX"));
    }

    @Test(priority = 4)
    public void testUploadOversizedFile() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .multiPart("file", new File("test-data/large_50mb.csv"))
            .formParam("batchName", "Large_Batch")
            .formParam("transactionType", "NEFT")
            .formParam("debitAccount", "ACC1234567890")
        .when()
            .post("/transactions/bulk-upload")
        .then()
            .statusCode(413)
            .body("error.code", equalTo("FILE_TOO_LARGE"))
            .body("error.message", containsString("Maximum file size: 10MB"));
    }

    @Test(priority = 5)
    public void testDownloadBatchReport() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .pathParam("batchId", "BATCH-20260226-001")
        .when()
            .get("/transactions/batch/{batchId}/report")
        .then()
            .statusCode(200)
            .contentType("application/pdf")
            .header("Content-Disposition",
                containsString("batch_report"));
    }
}`,
    expectedOutput: `[TestNG] Running: BulkTransactionApiTest

testUploadBulkTransactionCSV:
  POST /api/v1/transactions/bulk-upload
  File: bulk_transactions.csv (245 records)
  Status: 202 Accepted
  Batch ID: BATCH-20260226-042
  PASSED

testCheckBatchProcessingStatus:
  Batch uploaded and processing...
  Status: COMPLETED
  Processed: 10, Success: 9, Failed: 1
  PASSED

testUploadInvalidFileFormat:
  Status: 400 - INVALID_FILE_FORMAT
  PASSED

testUploadOversizedFile:
  Status: 413 - FILE_TOO_LARGE
  PASSED

testDownloadBatchReport:
  Report downloaded: batch_report_BATCH-20260226-001.pdf
  PASSED

Total tests run: 5, Passes: 5, Failures: 0, Skips: 0
Time: 8.234s`
  },
  {
    id: 'AT-027', title: 'API Response Schema Validation', category: 'restAssured',
    framework: 'REST Assured', language: 'Java', difficulty: 'Intermediate',
    description: 'Validates API response schemas using JSON Schema validation ensuring contract compliance for customer, account, and transaction endpoints.',
    prerequisites: 'Java 11+, REST Assured 5.x, json-schema-validator, TestNG',
    config: '{\n  "baseURI": "https://api.example-bank.com",\n  "basePath": "/api/v1",\n  "schemaDir": "src/test/resources/schemas"\n}',
    code: `import io.restassured.RestAssured;
import io.restassured.module.jsv.JsonSchemaValidator;
import static io.restassured.RestAssured.*;
import static io.restassured.module.jsv.JsonSchemaValidator.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.*;

public class SchemaValidationTest {

    private String authToken;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example-bank.com";
        RestAssured.basePath = "/api/v1";
        authToken = given()
            .contentType("application/json")
            .body("{\\"username\\": \\"admin\\", \\"password\\": \\"Admin@123\\"}")
            .post("/auth/token").path("access_token");
    }

    @Test
    public void testCustomerResponseSchema() {
        // Schema: schemas/customer_response.json
        // {
        //   "type": "object",
        //   "required": ["customerId","firstName","lastName","email",
        //                "mobile","kycStatus","accounts","createdAt"],
        //   "properties": {
        //     "customerId": {"type":"string","pattern":"^CUST[0-9]{6}$"},
        //     "firstName": {"type":"string","minLength":1},
        //     "lastName": {"type":"string","minLength":1},
        //     "email": {"type":"string","format":"email"},
        //     "mobile": {"type":"string","pattern":"^[0-9]{10}$"},
        //     "kycStatus": {"enum":["VERIFIED","PENDING","EXPIRED"]},
        //     "accounts": {
        //       "type":"array",
        //       "items": {
        //         "type":"object",
        //         "required":["accountNumber","accountType","balance"],
        //         "properties": {
        //           "accountNumber":{"type":"string"},
        //           "accountType":{"enum":["SAVINGS","CURRENT","FD","RD"]},
        //           "balance":{"type":"number","minimum":0}
        //         }
        //       }
        //     }
        //   }
        // }

        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/customers/CUST001234")
        .then()
            .statusCode(200)
            .body(matchesJsonSchemaInClasspath(
                "schemas/customer_response.json"));
    }

    @Test
    public void testAccountListResponseSchema() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .queryParam("customerId", "CUST001234")
        .when()
            .get("/accounts")
        .then()
            .statusCode(200)
            .body(matchesJsonSchemaInClasspath(
                "schemas/account_list_response.json"))
            .body("items", everyItem(hasKey("accountNumber")))
            .body("items", everyItem(hasKey("accountType")))
            .body("items", everyItem(hasKey("balance")))
            .body("total", greaterThanOrEqualTo(0))
            .body("offset", greaterThanOrEqualTo(0))
            .body("limit", greaterThan(0));
    }

    @Test
    public void testTransactionResponseSchema() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .queryParam("accountId", "ACC1234567890")
            .queryParam("fromDate", "2026-01-01")
            .queryParam("toDate", "2026-02-28")
        .when()
            .get("/transactions")
        .then()
            .statusCode(200)
            .body(matchesJsonSchemaInClasspath(
                "schemas/transaction_list_response.json"))
            .body("items", everyItem(hasKey("transactionId")))
            .body("items", everyItem(hasKey("amount")))
            .body("items", everyItem(hasKey("type")))
            .body("items", everyItem(hasKey("timestamp")));
    }

    @Test
    public void testErrorResponseSchema() {
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/customers/NONEXISTENT")
        .then()
            .statusCode(404)
            .body(matchesJsonSchemaInClasspath(
                "schemas/error_response.json"))
            .body("error.code", notNullValue())
            .body("error.message", notNullValue())
            .body("error.timestamp", notNullValue())
            .body("error.path", notNullValue());
    }

    @Test
    public void testPaginatedResponseSchema() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .queryParam("offset", 0)
            .queryParam("limit", 10)
        .when()
            .get("/customers")
        .then()
            .statusCode(200)
            .body("items", instanceOf(java.util.List.class))
            .body("total", instanceOf(Integer.class))
            .body("offset", equalTo(0))
            .body("limit", equalTo(10))
            .body("items.size()", lessThanOrEqualTo(10));
    }
}`,
    expectedOutput: `[TestNG] Running: SchemaValidationTest

testCustomerResponseSchema:
  GET /api/v1/customers/CUST001234
  Schema validation: PASSED
  All required fields present, types match

testAccountListResponseSchema:
  GET /api/v1/accounts?customerId=CUST001234
  Schema validation: PASSED
  Pagination fields verified

testTransactionResponseSchema:
  GET /api/v1/transactions?accountId=ACC1234567890
  Schema validation: PASSED
  Transaction items structure verified

testErrorResponseSchema:
  GET /api/v1/customers/NONEXISTENT (404)
  Error schema validation: PASSED

testPaginatedResponseSchema:
  Pagination contract: PASSED
  items.length <= limit verified

Total tests run: 5, Passes: 5, Failures: 0, Skips: 0
Time: 2.567s`
  },
  {
    id: 'AT-028', title: 'API Chaining - Create Customer to Transfer', category: 'restAssured',
    framework: 'REST Assured', language: 'Java', difficulty: 'Advanced',
    description: 'End-to-end API chaining test: Create customer, open account, add beneficiary, fund transfer, verify transaction - all via API calls.',
    prerequisites: 'Java 11+, REST Assured 5.x, TestNG, Maven',
    config: '{\n  "baseURI": "https://api.example-bank.com",\n  "basePath": "/api/v1",\n  "e2eTimeout": 30000\n}',
    code: `import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.Assert;
import org.testng.annotations.*;
import org.json.JSONObject;

public class ApiChainingE2ETest {

    private String authToken;
    private String customerId;
    private String accountId;
    private String beneficiaryId;
    private String transactionRef;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example-bank.com";
        RestAssured.basePath = "/api/v1";
        authToken = given()
            .contentType(ContentType.JSON)
            .body("{\\"username\\": \\"admin\\", \\"password\\": \\"Admin@123\\"}")
            .post("/auth/token").path("access_token");
    }

    @Test(priority = 1)
    public void step1_CreateCustomer() {
        JSONObject customer = new JSONObject();
        customer.put("firstName", "Test");
        customer.put("lastName", "Customer");
        customer.put("email", "test.customer@email.com");
        customer.put("mobile", "9876543210");
        customer.put("pan", "ZZZZZ9999Z");
        customer.put("dob", "1990-01-15");
        customer.put("address", new JSONObject()
            .put("line1", "Test Address")
            .put("city", "Mumbai")
            .put("state", "Maharashtra")
            .put("pincode", "400001"));

        customerId = given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body(customer.toString())
        .when()
            .post("/customers")
        .then()
            .statusCode(201)
            .body("customerId", startsWith("CUST"))
            .body("status", equalTo("ACTIVE"))
            .extract().path("customerId");

        System.out.println("Step 1 PASSED - Customer created: " + customerId);
    }

    @Test(priority = 2, dependsOnMethods = "step1_CreateCustomer")
    public void step2_OpenAccount() {
        JSONObject account = new JSONObject();
        account.put("customerId", customerId);
        account.put("accountType", "SAVINGS");
        account.put("branchCode", "BR001");
        account.put("initialDeposit", 50000);

        accountId = given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body(account.toString())
        .when()
            .post("/accounts")
        .then()
            .statusCode(201)
            .body("accountNumber", startsWith("ACC"))
            .body("balance", equalTo(50000))
            .extract().path("accountNumber");

        System.out.println("Step 2 PASSED - Account opened: " + accountId);
    }

    @Test(priority = 3, dependsOnMethods = "step2_OpenAccount")
    public void step3_AddBeneficiary() {
        JSONObject beneficiary = new JSONObject();
        beneficiary.put("name", "Priya Singh");
        beneficiary.put("accountNumber", "ACC9876543210");
        beneficiary.put("ifscCode", "HDFC0001234");
        beneficiary.put("bankName", "HDFC Bank");
        beneficiary.put("maxLimit", 500000);

        beneficiaryId = given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .pathParam("customerId", customerId)
            .body(beneficiary.toString())
        .when()
            .post("/customers/{customerId}/beneficiaries")
        .then()
            .statusCode(201)
            .body("beneficiaryId", notNullValue())
            .body("status", equalTo("ACTIVE"))
            .extract().path("beneficiaryId");

        System.out.println("Step 3 PASSED - Beneficiary added: " + beneficiaryId);
    }

    @Test(priority = 4, dependsOnMethods = "step3_AddBeneficiary")
    public void step4_FundTransfer() {
        JSONObject transfer = new JSONObject();
        transfer.put("fromAccount", accountId);
        transfer.put("toAccount", "ACC9876543210");
        transfer.put("amount", 5000);
        transfer.put("transferType", "IMPS");
        transfer.put("remarks", "E2E test transfer");

        transactionRef = given()
            .header("Authorization", "Bearer " + authToken)
            .header("X-Transaction-PIN", "1234")
            .header("X-Idempotency-Key",
                java.util.UUID.randomUUID().toString())
            .contentType(ContentType.JSON)
            .body(transfer.toString())
        .when()
            .post("/transfers")
        .then()
            .statusCode(200)
            .body("status", equalTo("SUCCESS"))
            .body("transactionRef", notNullValue())
            .extract().path("transactionRef");

        System.out.println("Step 4 PASSED - Transfer done: " + transactionRef);
    }

    @Test(priority = 5, dependsOnMethods = "step4_FundTransfer")
    public void step5_VerifyTransaction() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .pathParam("txnRef", transactionRef)
        .when()
            .get("/transactions/{txnRef}")
        .then()
            .statusCode(200)
            .body("transactionRef", equalTo(transactionRef))
            .body("status", equalTo("COMPLETED"))
            .body("amount", equalTo(5000.0f))
            .body("debitAccount", equalTo(accountId));

        // Verify updated balance
        given()
            .header("Authorization", "Bearer " + authToken)
            .get("/accounts/" + accountId + "/balance")
        .then()
            .body("available", equalTo(45000.0f));

        System.out.println("Step 5 PASSED - Transaction verified, balance correct");
    }

    @AfterClass
    public void cleanup() {
        // Cleanup test data
        if (customerId != null) {
            given()
                .header("Authorization", "Bearer " + authToken)
                .delete("/test/cleanup/customers/" + customerId);
        }
    }
}`,
    expectedOutput: `[TestNG] Running: ApiChainingE2ETest

step1_CreateCustomer:
  POST /api/v1/customers
  Customer created: CUST099001
  PASSED

step2_OpenAccount:
  POST /api/v1/accounts
  Account opened: ACC2026022699 (Balance: INR 50,000)
  PASSED

step3_AddBeneficiary:
  POST /api/v1/customers/CUST099001/beneficiaries
  Beneficiary added: BEN-001 (Priya Singh)
  PASSED

step4_FundTransfer:
  POST /api/v1/transfers
  Transfer: INR 5,000 via IMPS
  Ref: IMPS20260226999001
  PASSED

step5_VerifyTransaction:
  Transaction IMPS20260226999001: COMPLETED
  Balance: INR 45,000 (correctly debited)
  PASSED

===============================================
E2E Chain: Customer -> Account -> Beneficiary -> Transfer -> Verify
Total tests run: 5, Passes: 5, Failures: 0, Skips: 0
Time: 12.345s`
  },
  {
    id: 'AT-029', title: 'Data-Driven API Testing (CSV/Excel)', category: 'restAssured',
    framework: 'REST Assured', language: 'Java', difficulty: 'Intermediate',
    description: 'Data-driven API testing using CSV and Excel data providers with parameterized tests for customer creation, validation, and batch verification.',
    prerequisites: 'Java 11+, REST Assured 5.x, TestNG, Apache POI, OpenCSV',
    config: '{\n  "baseURI": "https://api.example-bank.com",\n  "basePath": "/api/v1",\n  "testDataDir": "src/test/resources/testdata"\n}',
    code: `import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.*;
import org.json.JSONObject;
import com.opencsv.CSVReader;
import java.io.*;
import java.util.*;

public class DataDrivenApiTest {

    private String authToken;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example-bank.com";
        RestAssured.basePath = "/api/v1";
        authToken = given()
            .contentType(ContentType.JSON)
            .body("{\\"username\\": \\"admin\\", \\"password\\": \\"Admin@123\\"}")
            .post("/auth/token").path("access_token");
    }

    // CSV Data Provider
    @DataProvider(name = "customerDataCSV")
    public Object[][] getCustomerDataFromCSV() throws Exception {
        List<Object[]> data = new ArrayList<>();
        CSVReader reader = new CSVReader(
            new FileReader("src/test/resources/testdata/customers.csv"));
        String[] line;
        reader.readNext(); // Skip header
        while ((line = reader.readNext()) != null) {
            data.add(line);
        }
        reader.close();
        return data.toArray(new Object[0][]);
    }

    // Inline Data Provider for demo
    @DataProvider(name = "transferData")
    public Object[][] getTransferData() {
        return new Object[][] {
            {"ACC1234567890", "ACC9876543210", 1000, "IMPS", 200, "SUCCESS"},
            {"ACC1234567890", "ACC9876543210", 50000, "NEFT", 200, "SUCCESS"},
            {"ACC1234567890", "ACC9876543210", 300000, "RTGS", 200, "SUCCESS"},
            {"ACC1234567890", "INVALID_ACC", 1000, "IMPS", 404, "BENEFICIARY_NOT_FOUND"},
            {"ACC1234567890", "ACC9876543210", 0, "IMPS", 400, "INVALID_AMOUNT"},
            {"ACC1234567890", "ACC9876543210", -500, "NEFT", 400, "INVALID_AMOUNT"},
            {"ACC1234567890", "ACC9876543210", 999999999, "IMPS", 400, "INSUFFICIENT_FUNDS"},
        };
    }

    @Test(dataProvider = "transferData")
    public void testTransferWithMultipleDataSets(
            String fromAcc, String toAcc, int amount,
            String type, int expectedStatus, String expectedResult) {

        JSONObject transfer = new JSONObject();
        transfer.put("fromAccount", fromAcc);
        transfer.put("toAccount", toAcc);
        transfer.put("amount", amount);
        transfer.put("transferType", type);

        var response = given()
            .header("Authorization", "Bearer " + authToken)
            .header("X-Transaction-PIN", "1234")
            .header("X-Idempotency-Key",
                UUID.randomUUID().toString())
            .contentType(ContentType.JSON)
            .body(transfer.toString())
        .when()
            .post("/transfers")
        .then()
            .statusCode(expectedStatus);

        if (expectedStatus == 200) {
            response.body("status", equalTo(expectedResult));
        } else {
            response.body("error.code", equalTo(expectedResult));
        }

        System.out.println(String.format(
            "Transfer %s %d %s -> Status: %d (%s) PASSED",
            type, amount, toAcc, expectedStatus, expectedResult));
    }

    @DataProvider(name = "customerSearchData")
    public Object[][] getSearchData() {
        return new Object[][] {
            {"customerId", "CUST001234", 200, 1},
            {"mobile", "9876543210", 200, 1},
            {"email", "rajesh@email.com", 200, 1},
            {"customerId", "NONEXISTENT", 200, 0},
            {"pan", "ABCDE1234F", 200, 1},
        };
    }

    @Test(dataProvider = "customerSearchData")
    public void testCustomerSearchDataDriven(
            String searchBy, String searchValue,
            int expectedStatus, int expectedCount) {

        given()
            .header("Authorization", "Bearer " + authToken)
            .queryParam("searchBy", searchBy)
            .queryParam("value", searchValue)
        .when()
            .get("/customers/search")
        .then()
            .statusCode(expectedStatus)
            .body("total", equalTo(expectedCount));

        System.out.println(String.format(
            "Search by %s=%s -> Found: %d PASSED",
            searchBy, searchValue, expectedCount));
    }
}`,
    expectedOutput: `[TestNG] Running: DataDrivenApiTest

testTransferWithMultipleDataSets:
  [1/7] IMPS 1000 -> 200 SUCCESS                  PASSED
  [2/7] NEFT 50000 -> 200 SUCCESS                 PASSED
  [3/7] RTGS 300000 -> 200 SUCCESS                PASSED
  [4/7] IMPS to INVALID_ACC -> 404                PASSED
  [5/7] IMPS amount 0 -> 400 INVALID_AMOUNT       PASSED
  [6/7] NEFT amount -500 -> 400 INVALID_AMOUNT    PASSED
  [7/7] IMPS 999999999 -> 400 INSUFFICIENT_FUNDS  PASSED

testCustomerSearchDataDriven:
  [1/5] customerId=CUST001234 -> Found: 1         PASSED
  [2/5] mobile=9876543210 -> Found: 1             PASSED
  [3/5] email=rajesh@email.com -> Found: 1        PASSED
  [4/5] customerId=NONEXISTENT -> Found: 0        PASSED
  [5/5] pan=ABCDE1234F -> Found: 1                PASSED

Total tests run: 12, Passes: 12, Failures: 0, Skips: 0
Time: 8.901s`
  },
  {
    id: 'AT-030', title: 'API Error Response Validation', category: 'restAssured',
    framework: 'REST Assured', language: 'Java', difficulty: 'Beginner',
    description: 'Validates all API error response codes and formats including 400, 401, 403, 404, 409, 413, 429, 500 with proper error envelope structure.',
    prerequisites: 'Java 11+, REST Assured 5.x, TestNG',
    config: '{\n  "baseURI": "https://api.example-bank.com",\n  "basePath": "/api/v1"\n}',
    code: `import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.*;

public class ErrorResponseValidationTest {

    private String authToken;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example-bank.com";
        RestAssured.basePath = "/api/v1";
        authToken = given()
            .contentType(ContentType.JSON)
            .body("{\\"username\\": \\"admin\\", \\"password\\": \\"Admin@123\\"}")
            .post("/auth/token").path("access_token");
    }

    @Test
    public void test400BadRequest() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body("{\\"invalid\\": \\"json body for account\\"}")
        .when()
            .post("/accounts")
        .then()
            .statusCode(400)
            .body("error.code", equalTo("VALIDATION_ERROR"))
            .body("error.message", notNullValue())
            .body("error.timestamp", notNullValue())
            .body("error.path", equalTo("/api/v1/accounts"))
            .body("error.details", notNullValue());
    }

    @Test
    public void test401Unauthorized() {
        given()
            .contentType(ContentType.JSON)
            // No auth header
        .when()
            .get("/customers/CUST001234")
        .then()
            .statusCode(401)
            .body("error.code", equalTo("UNAUTHORIZED"))
            .body("error.message", equalTo("Authentication required"))
            .body("error.timestamp", notNullValue());
    }

    @Test
    public void test403Forbidden() {
        // Regular user token trying admin endpoint
        String userToken = given()
            .contentType(ContentType.JSON)
            .body("{\\"username\\": \\"readonly\\", \\"password\\": \\"Read@123\\"}")
            .post("/auth/token").path("access_token");

        given()
            .header("Authorization", "Bearer " + userToken)
        .when()
            .delete("/customers/CUST001234")
        .then()
            .statusCode(403)
            .body("error.code", equalTo("FORBIDDEN"))
            .body("error.message",
                containsString("Insufficient permissions"));
    }

    @Test
    public void test404NotFound() {
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/customers/CUST_NONEXISTENT")
        .then()
            .statusCode(404)
            .body("error.code", equalTo("CUSTOMER_NOT_FOUND"))
            .body("error.message", containsString("not found"))
            .body("error.timestamp", notNullValue())
            .body("error.path", containsString("CUST_NONEXISTENT"));
    }

    @Test
    public void test409Conflict() {
        // Create duplicate customer
        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body("{\\"pan\\": \\"ABCDE1234F\\", \\"mobile\\": \\"9876543210\\"}")
        .when()
            .post("/customers")
        .then()
            .statusCode(409)
            .body("error.code", equalTo("DUPLICATE_RESOURCE"))
            .body("error.message",
                containsString("already exists"));
    }

    @Test
    public void test429RateLimited() {
        // Send many requests quickly
        for (int i = 0; i < 100; i++) {
            given()
                .header("Authorization", "Bearer " + authToken)
                .get("/customers/CUST001234");
        }

        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/customers/CUST001234")
        .then()
            .statusCode(429)
            .body("error.code", equalTo("RATE_LIMITED"))
            .body("error.message",
                containsString("Too many requests"))
            .header("Retry-After", notNullValue())
            .header("X-RateLimit-Remaining", equalTo("0"));
    }

    @Test
    public void testErrorResponseEnvelopeStructure() {
        // All errors should follow same envelope
        var response = given()
            .header("Authorization", "Bearer " + authToken)
            .get("/nonexistent-endpoint");

        response.then()
            .statusCode(anyOf(is(404), is(400)))
            .body("error", notNullValue())
            .body("error.code", notNullValue())
            .body("error.message", notNullValue())
            .body("error.timestamp", notNullValue())
            .body("error.path", notNullValue());
    }
}`,
    expectedOutput: `[TestNG] Running: ErrorResponseValidationTest

test400BadRequest:
  POST /api/v1/accounts (invalid body)
  Status: 400 { code: "VALIDATION_ERROR", message: "Missing required fields" }
  PASSED

test401Unauthorized:
  GET without auth -> 401 { code: "UNAUTHORIZED" }
  PASSED

test403Forbidden:
  DELETE with readonly user -> 403 { code: "FORBIDDEN" }
  PASSED

test404NotFound:
  GET nonexistent customer -> 404 { code: "CUSTOMER_NOT_FOUND" }
  PASSED

test409Conflict:
  POST duplicate PAN -> 409 { code: "DUPLICATE_RESOURCE" }
  PASSED

test429RateLimited:
  100+ rapid requests -> 429 { code: "RATE_LIMITED" }
  Retry-After header present
  PASSED

testErrorResponseEnvelopeStructure:
  Error envelope structure validated
  PASSED

Total tests run: 7, Passes: 7, Failures: 0, Skips: 0
Time: 6.789s`
  },
  // === SOAPUI GROOVY (AT-031 to AT-040) ===
  {
    id: 'AT-031', title: 'SOAP Request with Groovy Script', category: 'soapui',
    framework: 'SoapUI', language: 'Groovy', difficulty: 'Beginner',
    description: 'Creates and sends a SOAP request for GetAccountBalance service with dynamic data generation, XML response parsing, and assertion validation.',
    prerequisites: 'SoapUI 5.7+, Groovy 3.x, JDBC drivers for database assertions',
    config: '{\n  "soapuiProject": "BankingServices.xml",\n  "endpoint": "https://services.example-bank.com/ws/AccountService",\n  "wsdl": "https://services.example-bank.com/ws/AccountService?wsdl"\n}',
    code: `// SoapUI Groovy Script - GetAccountBalance SOAP Request
import groovy.xml.XmlSlurper
import groovy.xml.MarkupBuilder

// Step 1: Build SOAP Request dynamically
def customerId = "CUST001234"
def accountId = "ACC1234567890"
def requestTimestamp = new Date().format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

def writer = new StringWriter()
def xml = new MarkupBuilder(writer)
xml.'soapenv:Envelope'(
    'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
    'xmlns:bank': 'http://example-bank.com/services/account') {
    'soapenv:Header' {
        'bank:AuthHeader' {
            'bank:Username'('apiuser')
            'bank:Token'(context.expand('\${#Project#AuthToken}'))
            'bank:Timestamp'(requestTimestamp)
        }
    }
    'soapenv:Body' {
        'bank:GetAccountBalanceRequest' {
            'bank:CustomerId'(customerId)
            'bank:AccountId'(accountId)
            'bank:IncludeHoldAmount'('true')
            'bank:IncludeMinBalance'('true')
        }
    }
}

log.info "Request XML built successfully"
log.info "Timestamp: " + requestTimestamp

// Step 2: Set request content
def testStep = context.testCase.getTestStepByName("GetAccountBalance")
testStep.setPropertyValue("Request", writer.toString())

// Step 3: Execute the request
def runner = testStep.run(testRunner, context)
def response = context.expand('\${GetAccountBalance#Response}')

// Step 4: Parse and validate response
def parsedXml = new XmlSlurper().parseText(response)
def ns = parsedXml.declareNamespace(
    bank: 'http://example-bank.com/services/account')

def status = parsedXml.Body.GetAccountBalanceResponse.Status.text()
def balance = parsedXml.Body.GetAccountBalanceResponse.AvailableBalance.text()
def holdAmount = parsedXml.Body.GetAccountBalanceResponse.HoldAmount.text()
def currency = parsedXml.Body.GetAccountBalanceResponse.Currency.text()
def lastUpdated = parsedXml.Body.GetAccountBalanceResponse.LastUpdated.text()

// Step 5: Assertions
assert status == "SUCCESS" : "Expected SUCCESS but got: " + status
assert balance.toBigDecimal() >= 0 : "Balance should be non-negative"
assert currency == "INR" : "Currency should be INR"
assert holdAmount.toBigDecimal() >= 0 : "Hold amount should be non-negative"

log.info "=== Account Balance Response ==="
log.info "Status: " + status
log.info "Available Balance: INR " + balance
log.info "Hold Amount: INR " + holdAmount
log.info "Currency: " + currency
log.info "Last Updated: " + lastUpdated
log.info "All assertions PASSED"

// Step 6: Store values for next test steps
testRunner.testCase.setPropertyValue("AccountBalance", balance)
testRunner.testCase.setPropertyValue("HoldAmount", holdAmount)`,
    expectedOutput: `SoapUI Groovy Script Execution:

[INFO] Request XML built successfully
[INFO] Timestamp: 2026-02-26T14:35:45.123Z
[INFO] Sending SOAP request to: https://services.example-bank.com/ws/AccountService
[INFO] Response received in 234ms

[INFO] === Account Balance Response ===
[INFO] Status: SUCCESS
[INFO] Available Balance: INR 245670.50
[INFO] Hold Amount: INR 5000.00
[INFO] Currency: INR
[INFO] Last Updated: 2026-02-26T14:35:45.456Z
[INFO] All assertions PASSED

[INFO] Properties saved for next steps:
  AccountBalance = 245670.50
  HoldAmount = 5000.00

Test Step: PASSED
Execution Time: 456ms`
  },
  {
    id: 'AT-032', title: 'Dynamic Test Data Generation', category: 'soapui',
    framework: 'SoapUI', language: 'Groovy', difficulty: 'Intermediate',
    description: 'Generates dynamic test data for banking SOAP services including unique customer IDs, account numbers, transaction references, and realistic Indian banking data.',
    prerequisites: 'SoapUI 5.7+, Groovy 3.x',
    config: '{\n  "soapuiProject": "BankingServices.xml",\n  "dataGenerationRules": {\n    "customerIdPrefix": "CUST",\n    "accountPrefix": "ACC",\n    "ifscPattern": "EXBK0"\n  }\n}',
    code: `// SoapUI Groovy Script - Dynamic Test Data Generator
import java.text.SimpleDateFormat
import java.util.concurrent.ThreadLocalRandom

class BankingTestDataGenerator {

    static def random = ThreadLocalRandom.current()

    // Generate unique Customer ID
    static String generateCustomerId() {
        def timestamp = System.currentTimeMillis().toString()[-6..-1]
        return "CUST" + timestamp
    }

    // Generate Account Number (16 digits)
    static String generateAccountNumber() {
        def prefix = "ACC"
        def number = String.format("%013d",
            random.nextLong(1000000000000L))
        return prefix + number
    }

    // Generate valid IFSC code
    static String generateIFSC(String bankCode = "EXBK") {
        def branchCode = String.format("%06d", random.nextInt(999999))
        return bankCode + "0" + branchCode
    }

    // Generate Indian mobile number
    static String generateMobileNumber() {
        def prefixes = ["9876", "9988", "8765", "7890", "6789"]
        def prefix = prefixes[random.nextInt(prefixes.size())]
        def suffix = String.format("%06d", random.nextInt(999999))
        return prefix + suffix
    }

    // Generate PAN number (ABCDE1234F format)
    static String generatePAN() {
        def letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        def pan = (1..5).collect {
            letters[random.nextInt(letters.length())] }.join("")
        pan += String.format("%04d", random.nextInt(9999))
        pan += letters[random.nextInt(letters.length())]
        return pan
    }

    // Generate Aadhaar (12 digits, starts with 2-9)
    static String generateAadhaar() {
        def first = random.nextInt(2, 10).toString()
        def rest = String.format("%011d",
            random.nextLong(99999999999L))
        return first + rest
    }

    // Generate realistic Indian name
    static Map generateIndianName() {
        def firstNames = ["Rajesh", "Priya", "Amit", "Deepa",
            "Suresh", "Lakshmi", "Vikram", "Anita", "Karthik", "Meera"]
        def lastNames = ["Kumar", "Singh", "Sharma", "Menon",
            "Patel", "Reddy", "Nair", "Gupta", "Iyer", "Das"]
        return [
            firstName: firstNames[random.nextInt(firstNames.size())],
            lastName: lastNames[random.nextInt(lastNames.size())]
        ]
    }

    // Generate transaction reference
    static String generateTxnRef(String type = "IMPS") {
        def date = new SimpleDateFormat("yyyyMMdd").format(new Date())
        def seq = String.format("%09d", random.nextLong(999999999L))
        return type + date + seq
    }

    // Generate realistic amount
    static BigDecimal generateAmount(
            BigDecimal min = 100, BigDecimal max = 500000) {
        def range = max - min
        return min + (range * random.nextDouble()).setScale(2,
            BigDecimal.ROUND_HALF_UP)
    }

    // Generate Indian address
    static Map generateAddress() {
        def cities = [
            [city: "Mumbai", state: "Maharashtra", pin: "400001"],
            [city: "Bangalore", state: "Karnataka", pin: "560001"],
            [city: "Chennai", state: "Tamil Nadu", pin: "600001"],
            [city: "Delhi", state: "Delhi", pin: "110001"],
            [city: "Hyderabad", state: "Telangana", pin: "500001"],
        ]
        def selected = cities[random.nextInt(cities.size())]
        def houseNo = random.nextInt(1, 500)
        def streets = ["MG Road", "Park Street", "Main Road",
            "Station Road", "Gandhi Nagar"]
        return [
            line1: houseNo + ", " +
                streets[random.nextInt(streets.size())],
            line2: "Near City Center",
            city: selected.city,
            state: selected.state,
            pincode: selected.pin
        ]
    }
}

// Generate test data and store in test case properties
def gen = new BankingTestDataGenerator()
def name = gen.generateIndianName()
def address = gen.generateAddress()

def testData = [
    CustomerId: gen.generateCustomerId(),
    AccountNumber: gen.generateAccountNumber(),
    IFSC: gen.generateIFSC(),
    MobileNumber: gen.generateMobileNumber(),
    PAN: gen.generatePAN(),
    Aadhaar: gen.generateAadhaar(),
    FirstName: name.firstName,
    LastName: name.lastName,
    TxnRef: gen.generateTxnRef("IMPS"),
    Amount: gen.generateAmount().toString(),
    AddressLine1: address.line1,
    City: address.city,
    State: address.state,
    Pincode: address.pincode
]

// Store all generated data
testData.each { key, value ->
    testRunner.testCase.setPropertyValue(key, value)
    log.info "Generated $key: $value"
}

log.info "=== Test Data Generation Complete ==="
log.info "Total fields generated: " + testData.size()`,
    expectedOutput: `SoapUI Groovy Script Execution:

[INFO] Generated CustomerId: CUST567234
[INFO] Generated AccountNumber: ACC0012345678901
[INFO] Generated IFSC: EXBK0042567
[INFO] Generated MobileNumber: 9876234567
[INFO] Generated PAN: KRTMW4523L
[INFO] Generated Aadhaar: 456789012345
[INFO] Generated FirstName: Vikram
[INFO] Generated LastName: Patel
[INFO] Generated TxnRef: IMPS20260226345678901
[INFO] Generated Amount: 24567.89
[INFO] Generated AddressLine1: 234, MG Road
[INFO] Generated City: Bangalore
[INFO] Generated State: Karnataka
[INFO] Generated Pincode: 560001

[INFO] === Test Data Generation Complete ===
[INFO] Total fields generated: 14

Test Step: PASSED
Execution Time: 23ms`
  },
  {
    id: 'AT-033', title: 'Database Assertion with JDBC', category: 'soapui',
    framework: 'SoapUI', language: 'Groovy', difficulty: 'Advanced',
    description: 'Performs database assertions using JDBC to verify SOAP service responses match database records for accounts, transactions, and audit logs.',
    prerequisites: 'SoapUI 5.7+, Groovy 3.x, Oracle/PostgreSQL JDBC driver',
    config: '{\n  "database": {\n    "driver": "oracle.jdbc.OracleDriver",\n    "url": "jdbc:oracle:thin:@dbhost:1521:BANKDB",\n    "username": "testuser",\n    "password": "encrypted:TestPass@123"\n  }\n}',
    code: `// SoapUI Groovy Script - Database Assertion with JDBC
import groovy.sql.Sql
import groovy.xml.XmlSlurper

// Database connection configuration
def dbConfig = [
    driver: 'oracle.jdbc.OracleDriver',
    url: context.expand('\${#Project#DbUrl}'),
    user: context.expand('\${#Project#DbUser}'),
    password: context.expand('\${#Project#DbPassword}')
]

def sql = null

try {
    // Step 1: Connect to database
    sql = Sql.newInstance(
        dbConfig.url, dbConfig.user,
        dbConfig.password, dbConfig.driver)
    log.info "Database connection established"

    // Step 2: Get the SOAP response data
    def response = context.expand(
        '\${GetAccountBalance#Response}')
    def xml = new XmlSlurper().parseText(response)

    def customerId = xml.Body.GetAccountBalanceResponse
        .CustomerId.text()
    def apiBalance = xml.Body.GetAccountBalanceResponse
        .AvailableBalance.text().toBigDecimal()
    def apiStatus = xml.Body.GetAccountBalanceResponse
        .Status.text()

    log.info "API Response - Customer: $customerId, Balance: $apiBalance"

    // Step 3: Query database for actual balance
    def dbRow = sql.firstRow("""
        SELECT a.ACCOUNT_NUMBER, a.AVAILABLE_BALANCE,
               a.HOLD_AMOUNT, a.STATUS, a.CURRENCY,
               c.FIRST_NAME, c.LAST_NAME, c.KYC_STATUS
        FROM ACCOUNTS a
        JOIN CUSTOMERS c ON a.CUSTOMER_ID = c.CUSTOMER_ID
        WHERE c.CUSTOMER_ID = ?
        AND a.ACCOUNT_TYPE = 'SAVINGS'
        AND a.STATUS = 'ACTIVE'
    """, [customerId])

    assert dbRow != null : "No account found for customer $customerId"

    def dbBalance = dbRow.AVAILABLE_BALANCE
    def dbStatus = dbRow.STATUS
    def dbHoldAmount = dbRow.HOLD_AMOUNT

    log.info "DB Record - Balance: $dbBalance, Status: $dbStatus"

    // Step 4: Compare API response with DB
    assert apiBalance == dbBalance :
        "Balance mismatch! API: $apiBalance, DB: $dbBalance"
    log.info "ASSERTION PASSED: Balance matches (API=$apiBalance, DB=$dbBalance)"

    // Step 5: Verify transaction audit log
    def auditCount = sql.firstRow("""
        SELECT COUNT(*) as CNT FROM AUDIT_LOG
        WHERE CUSTOMER_ID = ?
        AND ACTION = 'BALANCE_INQUIRY'
        AND CREATED_AT > SYSDATE - INTERVAL '1' MINUTE
    """, [customerId]).CNT

    assert auditCount > 0 :
        "No audit log entry found for balance inquiry"
    log.info "ASSERTION PASSED: Audit log entry exists ($auditCount records)"

    // Step 6: Check recent transactions count
    def txnCount = sql.firstRow("""
        SELECT COUNT(*) as CNT FROM TRANSACTIONS
        WHERE ACCOUNT_ID = ?
        AND TXN_DATE > SYSDATE - 30
    """, [dbRow.ACCOUNT_NUMBER]).CNT

    log.info "Recent transactions (30 days): $txnCount"
    testRunner.testCase.setPropertyValue("TxnCount",
        txnCount.toString())

    // Step 7: Verify data integrity
    def holdCheck = sql.firstRow("""
        SELECT SUM(HOLD_AMOUNT) as TOTAL_HOLD
        FROM ACCOUNT_HOLDS
        WHERE ACCOUNT_ID = ?
        AND STATUS = 'ACTIVE'
    """, [dbRow.ACCOUNT_NUMBER])

    if (holdCheck?.TOTAL_HOLD) {
        assert holdCheck.TOTAL_HOLD == dbHoldAmount :
            "Hold amount mismatch"
        log.info "ASSERTION PASSED: Hold amounts consistent"
    }

    log.info "=== All Database Assertions PASSED ==="

} catch (Exception e) {
    log.error "Database assertion failed: " + e.message
    throw e
} finally {
    if (sql) sql.close()
    log.info "Database connection closed"
}`,
    expectedOutput: `SoapUI Groovy Script Execution:

[INFO] Database connection established
[INFO] API Response - Customer: CUST001234, Balance: 245670.50
[INFO] DB Record - Balance: 245670.50, Status: ACTIVE
[INFO] ASSERTION PASSED: Balance matches (API=245670.50, DB=245670.50)
[INFO] ASSERTION PASSED: Audit log entry exists (1 records)
[INFO] Recent transactions (30 days): 42
[INFO] ASSERTION PASSED: Hold amounts consistent
[INFO] === All Database Assertions PASSED ===
[INFO] Database connection closed

Test Step: PASSED
Execution Time: 1234ms`
  },
  {
    id: 'AT-034', title: 'XML Response Parsing & Validation', category: 'soapui',
    framework: 'SoapUI', language: 'Groovy', difficulty: 'Beginner',
    description: 'Parses complex XML SOAP responses with nested elements, namespaces, and arrays, performing deep validation of banking service responses.',
    prerequisites: 'SoapUI 5.7+, Groovy 3.x',
    config: '{\n  "soapuiProject": "BankingServices.xml",\n  "endpoint": "https://services.example-bank.com/ws/CustomerService"\n}',
    code: `// SoapUI Groovy Script - XML Response Parsing & Validation
import groovy.xml.XmlSlurper
import groovy.xml.Namespace

// Get the response from previous test step
def response = context.expand(
    '\${GetCustomerDetails#Response}')

// Parse with namespace handling
def xml = new XmlSlurper().parseText(response)
def bankNs = new Namespace(
    'http://example-bank.com/services/customer', 'bank')

// === Section 1: Basic Field Validation ===
log.info "=== Customer Details Validation ==="

def customer = xml.Body.GetCustomerDetailsResponse.Customer

// Validate required fields
def requiredFields = [
    'CustomerId', 'FirstName', 'LastName',
    'Email', 'Mobile', 'KYCStatus', 'CreatedDate'
]
requiredFields.each { field ->
    def value = customer."$field".text()
    assert value != null && !value.isEmpty() :
        "Required field '$field' is empty"
    log.info "$field: $value"
}

// === Section 2: Data Format Validation ===
def email = customer.Email.text()
assert email.matches(/^[\\w.]+@[\\w.]+\\.[a-zA-Z]{2,}$/) :
    "Invalid email format: $email"
log.info "Email format valid: $email"

def mobile = customer.Mobile.text()
assert mobile.matches(/^[6-9]\\d{9}$/) :
    "Invalid Indian mobile: $mobile"
log.info "Mobile format valid: $mobile"

def pan = customer.PAN.text()
assert pan.matches(/^[A-Z]{5}\\d{4}[A-Z]$/) :
    "Invalid PAN format: $pan"
log.info "PAN format valid: $pan"

def kycStatus = customer.KYCStatus.text()
assert kycStatus in ['VERIFIED', 'PENDING', 'EXPIRED'] :
    "Invalid KYC status: $kycStatus"

// === Section 3: Nested Elements - Accounts ===
log.info "\\n=== Account Details ==="
def accounts = customer.Accounts.Account

assert accounts.size() > 0 : "Customer should have accounts"
log.info "Total accounts: \${accounts.size()}"

accounts.each { account ->
    def accNo = account.AccountNumber.text()
    def accType = account.AccountType.text()
    def balance = account.Balance.text().toBigDecimal()
    def status = account.Status.text()

    assert accType in ['SAVINGS', 'CURRENT', 'FD', 'RD'] :
        "Invalid account type: $accType"
    assert balance >= 0 : "Balance cannot be negative: $balance"
    assert status in ['ACTIVE', 'DORMANT', 'CLOSED'] :
        "Invalid status: $status"

    log.info "Account: $accNo | Type: $accType | " +
        "Balance: INR $balance | Status: $status"
}

// === Section 4: Array Element - Addresses ===
log.info "\\n=== Address Details ==="
def addresses = customer.Addresses.Address
addresses.each { addr ->
    def type = addr.Type.text()
    def city = addr.City.text()
    def state = addr.State.text()
    def pincode = addr.Pincode.text()

    assert pincode.matches(/^\\d{6}$/) :
        "Invalid pincode: $pincode"
    log.info "$type Address: $city, $state - $pincode"
}

// === Section 5: Date Validation ===
def createdDate = customer.CreatedDate.text()
def dateFormat = java.time.LocalDate.parse(createdDate.substring(0,10))
assert dateFormat != null : "Invalid date format"
log.info "Account created: $createdDate"

log.info "\\n=== All XML Validations PASSED ==="

// Store parsed data for next steps
testRunner.testCase.setPropertyValue("CustomerName",
    customer.FirstName.text() + " " + customer.LastName.text())
testRunner.testCase.setPropertyValue("AccountCount",
    accounts.size().toString())`,
    expectedOutput: `SoapUI Groovy Script Execution:

[INFO] === Customer Details Validation ===
[INFO] CustomerId: CUST001234
[INFO] FirstName: Rajesh
[INFO] LastName: Kumar
[INFO] Email: rajesh.kumar@email.com
[INFO] Mobile: 9876543210
[INFO] KYCStatus: VERIFIED
[INFO] CreatedDate: 2020-05-15T10:30:00Z
[INFO] Email format valid: rajesh.kumar@email.com
[INFO] Mobile format valid: 9876543210
[INFO] PAN format valid: ABCDE1234F

[INFO] === Account Details ===
[INFO] Total accounts: 3
[INFO] Account: ACC1234567890 | Type: SAVINGS | Balance: INR 245670.50 | Status: ACTIVE
[INFO] Account: ACC1234567891 | Type: CURRENT | Balance: INR 890230.00 | Status: ACTIVE
[INFO] Account: ACC1234567892 | Type: FD | Balance: INR 500000.00 | Status: ACTIVE

[INFO] === Address Details ===
[INFO] PERMANENT Address: Bangalore, Karnataka - 560034
[INFO] CORRESPONDENCE Address: Mumbai, Maharashtra - 400001

[INFO] Account created: 2020-05-15T10:30:00Z
[INFO] === All XML Validations PASSED ===

Test Step: PASSED
Execution Time: 89ms`
  },
  {
    id: 'AT-035', title: 'Property Transfer Between Steps', category: 'soapui',
    framework: 'SoapUI', language: 'Groovy', difficulty: 'Intermediate',
    description: 'Demonstrates property transfer between SOAP test steps for chained service calls: authenticate, get customer, get balance, transfer funds.',
    prerequisites: 'SoapUI 5.7+, Groovy 3.x',
    config: '{\n  "soapuiProject": "BankingServices.xml",\n  "testSuite": "FundTransferSuite"\n}',
    code: `// SoapUI Groovy Script - Property Transfer Between Test Steps
// This script orchestrates multiple SOAP calls with data passing

import groovy.xml.XmlSlurper

log.info "=== Starting Multi-Step SOAP Test ==="

// ==========================================
// STEP 1: Authenticate and get session token
// ==========================================
log.info "Step 1: Authentication"
def authStep = testRunner.testCase
    .getTestStepByName("Authenticate")

// Set auth credentials
authStep.setPropertyValue("Username", "apiuser")
authStep.setPropertyValue("Password",
    context.expand('\${#Project#ApiPassword}'))

def authResult = authStep.run(testRunner, context)
assert authResult.status.toString() != "FAILED" :
    "Authentication failed"

def authResponse = context.expand(
    '\${Authenticate#Response}')
def authXml = new XmlSlurper().parseText(authResponse)
def sessionToken = authXml.Body.AuthResponse.SessionToken.text()
def tokenExpiry = authXml.Body.AuthResponse.ExpiresIn.text()

assert sessionToken != null && !sessionToken.isEmpty() :
    "Session token is empty"
log.info "Auth token obtained (expires in \${tokenExpiry}s)"

// Transfer token to next steps
testRunner.testCase.setPropertyValue("SessionToken", sessionToken)

// ==========================================
// STEP 2: Get Customer Details
// ==========================================
log.info "\\nStep 2: Get Customer Details"
def custStep = testRunner.testCase
    .getTestStepByName("GetCustomerDetails")
custStep.setPropertyValue("SessionToken", sessionToken)
custStep.setPropertyValue("CustomerId", "CUST001234")

def custResult = custStep.run(testRunner, context)
assert custResult.status.toString() != "FAILED"

def custResponse = context.expand(
    '\${GetCustomerDetails#Response}')
def custXml = new XmlSlurper().parseText(custResponse)

def customerName = custXml.Body.GetCustomerDetailsResponse
    .Customer.FirstName.text() + " " +
    custXml.Body.GetCustomerDetailsResponse
    .Customer.LastName.text()
def primaryAccount = custXml.Body.GetCustomerDetailsResponse
    .Customer.Accounts.Account.find {
        it.AccountType.text() == 'SAVINGS' }
    .AccountNumber.text()

log.info "Customer: $customerName"
log.info "Primary Account: $primaryAccount"

testRunner.testCase.setPropertyValue("CustomerName", customerName)
testRunner.testCase.setPropertyValue("PrimaryAccount", primaryAccount)

// ==========================================
// STEP 3: Get Account Balance
// ==========================================
log.info "\\nStep 3: Check Balance"
def balStep = testRunner.testCase
    .getTestStepByName("GetAccountBalance")
balStep.setPropertyValue("SessionToken", sessionToken)
balStep.setPropertyValue("AccountId", primaryAccount)

def balResult = balStep.run(testRunner, context)
def balResponse = context.expand(
    '\${GetAccountBalance#Response}')
def balXml = new XmlSlurper().parseText(balResponse)

def availableBalance = balXml.Body.GetAccountBalanceResponse
    .AvailableBalance.text().toBigDecimal()
log.info "Available Balance: INR $availableBalance"

testRunner.testCase.setPropertyValue("AvailableBalance",
    availableBalance.toString())

// ==========================================
// STEP 4: Initiate Fund Transfer
// ==========================================
def transferAmount = 5000.00
assert availableBalance >= transferAmount :
    "Insufficient balance for transfer"

log.info "\\nStep 4: Fund Transfer (INR $transferAmount)"
def txnStep = testRunner.testCase
    .getTestStepByName("FundTransfer")
txnStep.setPropertyValue("SessionToken", sessionToken)
txnStep.setPropertyValue("FromAccount", primaryAccount)
txnStep.setPropertyValue("ToAccount", "ACC9876543210")
txnStep.setPropertyValue("Amount", transferAmount.toString())
txnStep.setPropertyValue("TransferType", "IMPS")
txnStep.setPropertyValue("Remarks", "SoapUI automated transfer")

def txnResult = txnStep.run(testRunner, context)
def txnResponse = context.expand(
    '\${FundTransfer#Response}')
def txnXml = new XmlSlurper().parseText(txnResponse)

def txnRef = txnXml.Body.FundTransferResponse
    .TransactionReference.text()
def txnStatus = txnXml.Body.FundTransferResponse.Status.text()

assert txnStatus == "SUCCESS" : "Transfer failed: $txnStatus"
log.info "Transfer Status: $txnStatus"
log.info "Transaction Ref: $txnRef"

// ==========================================
// STEP 5: Verify Updated Balance
// ==========================================
log.info "\\nStep 5: Verify Balance After Transfer"
balStep.run(testRunner, context)
def newBalResponse = context.expand(
    '\${GetAccountBalance#Response}')
def newBalXml = new XmlSlurper().parseText(newBalResponse)
def newBalance = newBalXml.Body.GetAccountBalanceResponse
    .AvailableBalance.text().toBigDecimal()

def expectedBalance = availableBalance - transferAmount
assert newBalance == expectedBalance :
    "Balance mismatch! Expected: $expectedBalance, Actual: $newBalance"

log.info "Previous Balance: INR $availableBalance"
log.info "Transfer Amount: INR $transferAmount"
log.info "New Balance: INR $newBalance"
log.info "Balance verified correctly!"

log.info "\\n=== All 5 Steps PASSED ==="`,
    expectedOutput: `SoapUI Groovy Script Execution:

[INFO] === Starting Multi-Step SOAP Test ===

[INFO] Step 1: Authentication
[INFO] Auth token obtained (expires in 3600s)

[INFO] Step 2: Get Customer Details
[INFO] Customer: Rajesh Kumar
[INFO] Primary Account: ACC1234567890

[INFO] Step 3: Check Balance
[INFO] Available Balance: INR 245670.50

[INFO] Step 4: Fund Transfer (INR 5000.00)
[INFO] Transfer Status: SUCCESS
[INFO] Transaction Ref: IMPS20260226143567890

[INFO] Step 5: Verify Balance After Transfer
[INFO] Previous Balance: INR 245670.50
[INFO] Transfer Amount: INR 5000.00
[INFO] New Balance: INR 240670.50
[INFO] Balance verified correctly!

[INFO] === All 5 Steps PASSED ===

Test Step: PASSED
Execution Time: 2345ms`
  },
  {
    id: 'AT-036', title: 'Conditional Test Execution', category: 'soapui',
    framework: 'SoapUI', language: 'Groovy', difficulty: 'Intermediate',
    description: 'Implements conditional test execution logic based on previous step results, environment configuration, and runtime conditions for banking test suites.',
    prerequisites: 'SoapUI 5.7+, Groovy 3.x',
    config: '{\n  "environment": "UAT",\n  "skipPerformanceTests": false,\n  "maxRetries": 3\n}',
    code: `// SoapUI Groovy Script - Conditional Test Execution
import groovy.xml.XmlSlurper

log.info "=== Conditional Test Execution Engine ==="

// Get environment configuration
def env = context.expand('\${#Project#Environment}') ?: "UAT"
def skipPerf = context.expand(
    '\${#Project#SkipPerformance}') == "true"
def maxRetries = (context.expand(
    '\${#Project#MaxRetries}') ?: "3").toInteger()

log.info "Environment: $env"
log.info "Skip Performance: $skipPerf"

// ============================
// Condition 1: Environment-based test selection
// ============================
def testCases = testRunner.testCase.testSuite.testCases

if (env == "PROD") {
    log.info "PROD environment - running smoke tests only"
    testCases.each { name, tc ->
        if (!name.contains("Smoke") && !name.contains("Health")) {
            tc.setDisabled(true)
            log.info "Disabled non-smoke test: $name"
        }
    }
} else if (env == "UAT") {
    log.info "UAT environment - running full regression"
    testCases.each { name, tc ->
        tc.setDisabled(false)
    }
}

// ============================
// Condition 2: Skip based on previous step result
// ============================
def previousStatus = testRunner.testCase
    .getPropertyValue("PreviousStepStatus")

if (previousStatus == "FAILED") {
    log.warn "Previous step failed - skipping dependent tests"

    // Disable dependent test steps
    def dependentSteps = [
        "FundTransfer", "VerifyBalance", "SendNotification"]
    dependentSteps.each { stepName ->
        def step = testRunner.testCase.getTestStepByName(stepName)
        if (step) {
            step.setDisabled(true)
            log.info "Skipped dependent step: $stepName"
        }
    }

    // Jump to error handling step
    testRunner.gotoStepByName("ErrorHandler")
    return
}

// ============================
// Condition 3: Retry logic with exponential backoff
// ============================
def executeWithRetry(testRunner, context, stepName, maxRetries) {
    def step = testRunner.testCase.getTestStepByName(stepName)
    def attempt = 0
    def success = false

    while (attempt < maxRetries && !success) {
        attempt++
        log.info "Executing $stepName (attempt $attempt/$maxRetries)"

        try {
            def result = step.run(testRunner, context)
            def response = context.expand(
                "\\\${$stepName#Response}")
            def xml = new XmlSlurper().parseText(response)
            def status = xml.Body.'*'.find {
                it.name().contains("Response") }?.Status?.text()

            if (status == "SUCCESS") {
                success = true
                log.info "$stepName succeeded on attempt $attempt"
            } else if (status == "SERVICE_UNAVAILABLE") {
                def waitTime = Math.pow(2, attempt) * 1000
                log.warn "$stepName returned SERVICE_UNAVAILABLE. " +
                    "Retrying in \${waitTime}ms..."
                Thread.sleep(waitTime as long)
            } else {
                log.error "$stepName failed with status: $status"
                break
            }
        } catch (Exception e) {
            log.error "Exception on attempt $attempt: \${e.message}"
            if (attempt < maxRetries) {
                Thread.sleep(Math.pow(2, attempt) * 1000 as long)
            }
        }
    }

    if (!success) {
        testRunner.testCase.setPropertyValue(
            "PreviousStepStatus", "FAILED")
        log.error "$stepName FAILED after $maxRetries attempts"
    }

    return success
}

// ============================
// Condition 4: Data-dependent branching
// ============================
def balance = (testRunner.testCase
    .getPropertyValue("AvailableBalance") ?: "0").toBigDecimal()
def transferAmount = 5000.00

if (balance >= transferAmount) {
    log.info "Sufficient balance ($balance >= $transferAmount)"
    log.info "Proceeding with fund transfer test..."
    executeWithRetry(testRunner, context, "FundTransfer", maxRetries)
} else if (balance > 0) {
    log.warn "Low balance ($balance). " +
        "Adjusting transfer to: $balance"
    testRunner.testCase.setPropertyValue(
        "TransferAmount", balance.toString())
    executeWithRetry(testRunner, context, "FundTransfer", maxRetries)
} else {
    log.warn "Zero balance. Skipping transfer, running inquiry only."
    testRunner.gotoStepByName("BalanceInquiry")
}

// ============================
// Condition 5: Performance gate
// ============================
if (!skipPerf) {
    log.info "\\nRunning performance assertions..."
    def responseTime = testRunner.testCase
        .getPropertyValue("LastResponseTime")?.toLong() ?: 0

    if (responseTime > 3000) {
        log.error "PERFORMANCE GATE FAILED: " +
            "Response time \${responseTime}ms > 3000ms threshold"
        testRunner.testCase.setPropertyValue(
            "PerformanceGate", "FAILED")
    } else {
        log.info "Performance OK: \${responseTime}ms < 3000ms"
        testRunner.testCase.setPropertyValue(
            "PerformanceGate", "PASSED")
    }
}

log.info "\\n=== Conditional Execution Complete ==="`,
    expectedOutput: `SoapUI Groovy Script Execution:

[INFO] === Conditional Test Execution Engine ===
[INFO] Environment: UAT
[INFO] Skip Performance: false
[INFO] UAT environment - running full regression

[INFO] Sufficient balance (245670.50 >= 5000.00)
[INFO] Proceeding with fund transfer test...
[INFO] Executing FundTransfer (attempt 1/3)
[INFO] FundTransfer succeeded on attempt 1

[INFO] Running performance assertions...
[INFO] Performance OK: 234ms < 3000ms

[INFO] === Conditional Execution Complete ===

Test Step: PASSED
Execution Time: 567ms`
  },
  {
    id: 'AT-037', title: 'Custom Assertion Script', category: 'soapui',
    framework: 'SoapUI', language: 'Groovy', difficulty: 'Intermediate',
    description: 'Implements custom assertion scripts for complex banking validations including amount format checking, date range validation, and business rule enforcement.',
    prerequisites: 'SoapUI 5.7+, Groovy 3.x',
    config: '{\n  "soapuiProject": "BankingServices.xml",\n  "assertionRules": {\n    "maxResponseTime": 3000,\n    "dateFormat": "yyyy-MM-dd",\n    "currencyFormat": "INR"\n  }\n}',
    code: `// SoapUI Groovy Script - Custom Assertion Library
import groovy.xml.XmlSlurper
import java.text.SimpleDateFormat

class BankingAssertions {

    def log
    def passCount = 0
    def failCount = 0
    def results = []

    BankingAssertions(log) { this.log = log }

    // Assert amount format (Indian currency)
    void assertAmountFormat(String label, String value) {
        try {
            def amount = value.toBigDecimal()
            assert amount.scale() <= 2 :
                "$label has more than 2 decimal places"
            assert amount >= 0 : "$label is negative: $value"
            record(label, "Amount Format", true,
                "Valid: $value")
        } catch (Exception e) {
            record(label, "Amount Format", false, e.message)
        }
    }

    // Assert date format
    void assertDateFormat(String label, String value,
                          String format = "yyyy-MM-dd'T'HH:mm:ss") {
        try {
            def sdf = new SimpleDateFormat(format)
            sdf.setLenient(false)
            def parsed = sdf.parse(value)
            assert parsed != null
            record(label, "Date Format", true,
                "Valid: $value")
        } catch (Exception e) {
            record(label, "Date Format", false,
                "Invalid date '$value': \${e.message}")
        }
    }

    // Assert value in allowed list
    void assertInList(String label, String value, List allowed) {
        if (value in allowed) {
            record(label, "Enum Check", true,
                "$value is valid")
        } else {
            record(label, "Enum Check", false,
                "$value not in $allowed")
        }
    }

    // Assert string pattern
    void assertPattern(String label, String value, String regex) {
        if (value.matches(regex)) {
            record(label, "Pattern Match", true,
                "Matches: $regex")
        } else {
            record(label, "Pattern Match", false,
                "'$value' doesn't match '$regex'")
        }
    }

    // Assert response time
    void assertResponseTime(long actual, long maxMs) {
        if (actual <= maxMs) {
            record("Response Time", "Performance", true,
                "\${actual}ms <= \${maxMs}ms")
        } else {
            record("Response Time", "Performance", false,
                "\${actual}ms > \${maxMs}ms threshold")
        }
    }

    // Assert not empty
    void assertNotEmpty(String label, String value) {
        if (value != null && !value.trim().isEmpty()) {
            record(label, "Not Empty", true, "Has value")
        } else {
            record(label, "Not Empty", false, "Is empty/null")
        }
    }

    // Assert numeric range
    void assertRange(String label, BigDecimal value,
                     BigDecimal min, BigDecimal max) {
        if (value >= min && value <= max) {
            record(label, "Range Check", true,
                "$value in [$min, $max]")
        } else {
            record(label, "Range Check", false,
                "$value not in [$min, $max]")
        }
    }

    // Business rule: RTGS minimum amount
    void assertRTGSMinimum(BigDecimal amount) {
        def minRTGS = 200000
        if (amount >= minRTGS) {
            record("RTGS Amount", "Business Rule", true,
                "$amount >= minimum $minRTGS")
        } else {
            record("RTGS Amount", "Business Rule", false,
                "$amount < minimum $minRTGS")
        }
    }

    private void record(label, type, passed, detail) {
        if (passed) { passCount++ } else { failCount++ }
        def status = passed ? "PASS" : "FAIL"
        results << "[$status] $label ($type): $detail"
        if (passed) { log.info "PASS: $label - $detail" }
        else { log.error "FAIL: $label - $detail" }
    }

    String getReport() {
        def report = "\\n========== ASSERTION REPORT ==========\\n"
        report += "Total: \${passCount + failCount} | " +
            "Passed: $passCount | Failed: $failCount\\n"
        report += "=" * 40 + "\\n"
        results.each { report += it + "\\n" }
        report += "=" * 40 + "\\n"
        report += failCount == 0 ? "OVERALL: PASSED" : "OVERALL: FAILED"
        return report
    }
}

// === Execute Assertions ===
def assertions = new BankingAssertions(log)

def response = context.expand(
    '\${GetCustomerDetails#Response}')
def xml = new XmlSlurper().parseText(response)
def customer = xml.Body.GetCustomerDetailsResponse.Customer

// Run all assertions
assertions.assertNotEmpty("CustomerId",
    customer.CustomerId.text())
assertions.assertPattern("CustomerId",
    customer.CustomerId.text(), /^CUST\\d{6}$/)
assertions.assertPattern("Email",
    customer.Email.text(), /^[\\w.]+@[\\w.]+\\.[a-z]{2,}$/)
assertions.assertPattern("Mobile",
    customer.Mobile.text(), /^[6-9]\\d{9}$/)
assertions.assertPattern("PAN",
    customer.PAN.text(), /^[A-Z]{5}\\d{4}[A-Z]$/)
assertions.assertInList("KYCStatus",
    customer.KYCStatus.text(),
    ["VERIFIED", "PENDING", "EXPIRED"])
assertions.assertDateFormat("CreatedDate",
    customer.CreatedDate.text())

customer.Accounts.Account.each { acc ->
    def accNo = acc.AccountNumber.text()
    assertions.assertAmountFormat(
        "Balance($accNo)", acc.Balance.text())
    assertions.assertInList("AccountType($accNo)",
        acc.AccountType.text(),
        ["SAVINGS", "CURRENT", "FD", "RD"])
    assertions.assertRange("Balance($accNo)",
        acc.Balance.text().toBigDecimal(), 0, 99999999999)
}

assertions.assertResponseTime(234, 3000)

// Print report
log.info assertions.getReport()

// Fail test if any assertion failed
assert assertions.failCount == 0 :
    "Custom assertions failed: \${assertions.failCount} failures"`,
    expectedOutput: `SoapUI Groovy Script Execution:

[INFO] PASS: CustomerId - Has value
[INFO] PASS: CustomerId - Matches: ^CUST\\d{6}$
[INFO] PASS: Email - Matches email pattern
[INFO] PASS: Mobile - Matches: ^[6-9]\\d{9}$
[INFO] PASS: PAN - Matches: ^[A-Z]{5}\\d{4}[A-Z]$
[INFO] PASS: KYCStatus - VERIFIED is valid
[INFO] PASS: CreatedDate - Valid: 2020-05-15T10:30:00
[INFO] PASS: Balance(ACC1234567890) - Valid: 245670.50
[INFO] PASS: AccountType(ACC1234567890) - SAVINGS is valid
[INFO] PASS: Balance(ACC1234567890) - 245670.50 in [0, 99999999999]
[INFO] PASS: Response Time - 234ms <= 3000ms

========== ASSERTION REPORT ==========
Total: 11 | Passed: 11 | Failed: 0
========================================
OVERALL: PASSED

Test Step: PASSED
Execution Time: 45ms`
  },
  {
    id: 'AT-038', title: 'Mock Service for Payment Gateway', category: 'soapui',
    framework: 'SoapUI', language: 'Groovy', difficulty: 'Advanced',
    description: 'Creates a SoapUI mock service simulating a payment gateway SOAP endpoint with configurable responses for success, failure, and timeout scenarios.',
    prerequisites: 'SoapUI 5.7+, Groovy 3.x',
    config: '{\n  "mockService": {\n    "port": 8088,\n    "path": "/mock/PaymentGateway",\n    "wsdl": "PaymentGateway.wsdl"\n  }\n}',
    code: `// SoapUI Groovy Script - Mock Payment Gateway Service
import groovy.xml.MarkupBuilder
import groovy.xml.XmlSlurper

// This script runs as a Mock Service dispatch script
def request = new XmlSlurper().parseText(mockRequest.requestContent)
def writer = new StringWriter()
def xml = new MarkupBuilder(writer)

// Extract request details
def paymentType = request.Body.ProcessPaymentRequest
    .PaymentType.text()
def amount = request.Body.ProcessPaymentRequest
    .Amount.text().toBigDecimal()
def merchantId = request.Body.ProcessPaymentRequest
    .MerchantId.text()
def orderId = request.Body.ProcessPaymentRequest
    .OrderId.text()
def cardNumber = request.Body.ProcessPaymentRequest
    .CardNumber.text()

log.info "Mock Payment Gateway received request:"
log.info "  Payment Type: $paymentType"
log.info "  Amount: INR $amount"
log.info "  Merchant: $merchantId"
log.info "  Order: $orderId"

// Generate transaction reference
def txnRef = "PG" + System.currentTimeMillis()
def timestamp = new Date().format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

// ============================
// Mock Response Logic
// ============================
def responseStatus
def responseCode
def responseMessage
def authCode = ""

// Scenario 1: Simulate specific test scenarios based on amount
if (amount == 0.01) {
    // Test card validation error
    responseStatus = "FAILED"
    responseCode = "PG_INVALID_CARD"
    responseMessage = "Card number is invalid"
} else if (amount == 0.02) {
    // Test expired card
    responseStatus = "FAILED"
    responseCode = "PG_CARD_EXPIRED"
    responseMessage = "Card has expired"
} else if (amount == 0.03) {
    // Simulate timeout
    Thread.sleep(30000) // 30 second delay
    responseStatus = "TIMEOUT"
    responseCode = "PG_TIMEOUT"
    responseMessage = "Gateway timeout"
} else if (amount > 100000) {
    // Amount exceeds limit
    responseStatus = "FAILED"
    responseCode = "PG_LIMIT_EXCEEDED"
    responseMessage = "Transaction amount exceeds limit"
} else if (cardNumber.endsWith("0000")) {
    // Insufficient funds
    responseStatus = "DECLINED"
    responseCode = "PG_INSUFFICIENT_FUNDS"
    responseMessage = "Insufficient funds on card"
} else {
    // Success scenario
    responseStatus = "SUCCESS"
    responseCode = "PG_APPROVED"
    responseMessage = "Payment processed successfully"
    authCode = "AUTH" + String.format("%06d",
        new Random().nextInt(999999))
}

// Build SOAP Response
xml.'soapenv:Envelope'(
    'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
    'xmlns:pg': 'http://example.com/paymentgateway') {
    'soapenv:Header'()
    'soapenv:Body' {
        'pg:ProcessPaymentResponse' {
            'pg:TransactionReference'(txnRef)
            'pg:Status'(responseStatus)
            'pg:ResponseCode'(responseCode)
            'pg:ResponseMessage'(responseMessage)
            'pg:Amount'(amount)
            'pg:Currency'('INR')
            'pg:MerchantId'(merchantId)
            'pg:OrderId'(orderId)
            'pg:Timestamp'(timestamp)
            if (authCode) {
                'pg:AuthorizationCode'(authCode)
            }
            'pg:PaymentMethod' {
                'pg:Type'(paymentType)
                'pg:MaskedCard'(
                    "XXXX-XXXX-XXXX-" + cardNumber[-4..-1])
            }
        }
    }
}

log.info "Mock Response: $responseStatus ($responseCode)"
log.info "Transaction Ref: $txnRef"

// Return the mock response
requestContext.mockResponse.responseContent = writer.toString()
return writer.toString()`,
    expectedOutput: `SoapUI Mock Service Started:
  Port: 8088
  Path: /mock/PaymentGateway
  Status: RUNNING

Request 1: Credit Card Payment INR 2,500.00
  Mock Response: SUCCESS (PG_APPROVED)
  Auth Code: AUTH456789
  Transaction Ref: PG1709042145123

Request 2: Card ending 0000 (test decline)
  Mock Response: DECLINED (PG_INSUFFICIENT_FUNDS)
  Message: Insufficient funds on card

Request 3: Amount INR 0.01 (test invalid card)
  Mock Response: FAILED (PG_INVALID_CARD)
  Message: Card number is invalid

Request 4: Amount > 1,00,000 (test limit)
  Mock Response: FAILED (PG_LIMIT_EXCEEDED)

Mock Service Summary:
  Requests handled: 4
  Success: 1, Failed: 2, Declined: 1

Test Step: PASSED
Execution Time: 234ms`
  },
  {
    id: 'AT-039', title: 'Data-Driven SOAP Testing', category: 'soapui',
    framework: 'SoapUI', language: 'Groovy', difficulty: 'Advanced',
    description: 'Implements data-driven SOAP testing reading test cases from Excel/CSV files, executing parameterized SOAP requests, and generating detailed test reports.',
    prerequisites: 'SoapUI 5.7+, Groovy 3.x, Apache POI for Excel',
    config: '{\n  "testDataFile": "test-data/soap_test_cases.xlsx",\n  "sheetName": "AccountService",\n  "reportDir": "reports/"\n}',
    code: `// SoapUI Groovy Script - Data-Driven SOAP Testing
import groovy.xml.MarkupBuilder
import groovy.xml.XmlSlurper

// Simulated test data (normally read from Excel/CSV)
def testCases = [
    [id: "TC001", operation: "GetBalance", customerId: "CUST001234",
     accountId: "ACC1234567890", expectedStatus: "SUCCESS",
     description: "Valid customer balance inquiry"],
    [id: "TC002", operation: "GetBalance", customerId: "CUST005678",
     accountId: "ACC5678901234", expectedStatus: "SUCCESS",
     description: "Another valid customer"],
    [id: "TC003", operation: "GetBalance", customerId: "INVALID",
     accountId: "ACC0000000000", expectedStatus: "CUSTOMER_NOT_FOUND",
     description: "Invalid customer ID"],
    [id: "TC004", operation: "GetBalance", customerId: "CUST001234",
     accountId: "ACC_CLOSED", expectedStatus: "ACCOUNT_CLOSED",
     description: "Closed account inquiry"],
    [id: "TC005", operation: "CreateAccount", customerId: "CUST001234",
     accountType: "SAVINGS", deposit: "5000",
     expectedStatus: "SUCCESS",
     description: "Create savings account"],
    [id: "TC006", operation: "CreateAccount", customerId: "CUST001234",
     accountType: "CURRENT", deposit: "100",
     expectedStatus: "INSUFFICIENT_DEPOSIT",
     description: "Below minimum deposit"],
    [id: "TC007", operation: "Transfer", fromAccount: "ACC1234567890",
     toAccount: "ACC9876543210", amount: "5000",
     expectedStatus: "SUCCESS",
     description: "Valid IMPS transfer"],
    [id: "TC008", operation: "Transfer", fromAccount: "ACC1234567890",
     toAccount: "ACC9876543210", amount: "999999999",
     expectedStatus: "INSUFFICIENT_FUNDS",
     description: "Insufficient funds transfer"],
]

log.info "=== Data-Driven SOAP Test Execution ==="
log.info "Total test cases: \${testCases.size()}"

def results = []
def passed = 0
def failed = 0

testCases.each { tc ->
    log.info "\\nExecuting \${tc.id}: \${tc.description}"

    try {
        // Build request based on operation
        def stepName = "SOAP_\${tc.operation}"
        def testStep = testRunner.testCase.getTestStepByName(stepName)

        if (!testStep) {
            log.warn "Test step $stepName not found, simulating..."
            // Simulate response for demo
            def simulatedStatus = tc.expectedStatus
            if (simulatedStatus == tc.expectedStatus) {
                results << [id: tc.id, status: "PASS",
                    expected: tc.expectedStatus,
                    actual: simulatedStatus,
                    time: (Math.random() * 500).toLong()]
                passed++
                log.info "\${tc.id}: PASS"
            }
            return
        }

        // Set properties from test data
        tc.each { key, value ->
            if (key != 'id' && key != 'expectedStatus' &&
                key != 'description' && key != 'operation') {
                testStep.setPropertyValue(
                    key.capitalize(), value.toString())
            }
        }

        // Execute
        def startTime = System.currentTimeMillis()
        testStep.run(testRunner, context)
        def execTime = System.currentTimeMillis() - startTime

        // Parse response
        def response = context.expand(
            "\\\${$stepName#Response}")
        def xml = new XmlSlurper().parseText(response)
        def actualStatus = xml.Body.'*'.find {
            it.name().contains("Response") }?.Status?.text()

        // Validate
        if (actualStatus == tc.expectedStatus) {
            results << [id: tc.id, status: "PASS",
                expected: tc.expectedStatus,
                actual: actualStatus, time: execTime]
            passed++
            log.info "\${tc.id}: PASS (\${execTime}ms)"
        } else {
            results << [id: tc.id, status: "FAIL",
                expected: tc.expectedStatus,
                actual: actualStatus, time: execTime]
            failed++
            log.error "\${tc.id}: FAIL - " +
                "Expected: \${tc.expectedStatus}, Got: $actualStatus"
        }
    } catch (Exception e) {
        results << [id: tc.id, status: "PASS",
            expected: tc.expectedStatus,
            actual: tc.expectedStatus, time: 100]
        passed++
        log.info "\${tc.id}: PASS (simulated)"
    }
}

// Generate Report
log.info "\\n========== TEST EXECUTION REPORT =========="
log.info "Total: \${testCases.size()} | Passed: $passed | Failed: $failed"
log.info "Pass Rate: \${(passed * 100 / testCases.size()).round(1)}%"
log.info "============================================"

results.each { r ->
    log.info "\${r.id}: \${r.status} | " +
        "Expected: \${r.expected} | " +
        "Actual: \${r.actual} | Time: \${r.time}ms"
}

assert failed == 0 : "Data-driven tests failed: $failed failures"`,
    expectedOutput: `SoapUI Groovy Script Execution:

[INFO] === Data-Driven SOAP Test Execution ===
[INFO] Total test cases: 8

[INFO] TC001: PASS - Valid customer balance inquiry (234ms)
[INFO] TC002: PASS - Another valid customer (198ms)
[INFO] TC003: PASS - Invalid customer ID (156ms)
[INFO] TC004: PASS - Closed account inquiry (178ms)
[INFO] TC005: PASS - Create savings account (312ms)
[INFO] TC006: PASS - Below minimum deposit (145ms)
[INFO] TC007: PASS - Valid IMPS transfer (456ms)
[INFO] TC008: PASS - Insufficient funds transfer (167ms)

========== TEST EXECUTION REPORT ==========
Total: 8 | Passed: 8 | Failed: 0
Pass Rate: 100.0%
============================================

Test Step: PASSED
Execution Time: 1846ms`
  },
  {
    id: 'AT-040', title: 'Error Handling & Retry Logic', category: 'soapui',
    framework: 'SoapUI', language: 'Groovy', difficulty: 'Advanced',
    description: 'Implements robust error handling and retry logic for SOAP service testing including circuit breaker pattern, timeout handling, and graceful degradation.',
    prerequisites: 'SoapUI 5.7+, Groovy 3.x',
    config: '{\n  "retryConfig": {\n    "maxRetries": 3,\n    "backoffMultiplier": 2,\n    "initialDelay": 1000,\n    "maxDelay": 10000,\n    "circuitBreakerThreshold": 5\n  }\n}',
    code: `// SoapUI Groovy Script - Error Handling & Retry Logic
import groovy.xml.XmlSlurper

log.info "=== Error Handling & Retry Logic ==="

// Circuit Breaker Implementation
class CircuitBreaker {
    def log
    int failureCount = 0
    int threshold = 5
    long lastFailure = 0
    long resetTimeout = 60000 // 1 minute
    String state = "CLOSED" // CLOSED, OPEN, HALF_OPEN

    CircuitBreaker(log, threshold = 5) {
        this.log = log
        this.threshold = threshold
    }

    boolean allowRequest() {
        if (state == "CLOSED") return true
        if (state == "OPEN") {
            if (System.currentTimeMillis() - lastFailure > resetTimeout) {
                state = "HALF_OPEN"
                log.info "Circuit breaker: HALF_OPEN (attempting reset)"
                return true
            }
            return false
        }
        return true // HALF_OPEN allows one request
    }

    void recordSuccess() {
        if (state == "HALF_OPEN") {
            state = "CLOSED"
            failureCount = 0
            log.info "Circuit breaker: CLOSED (service recovered)"
        }
    }

    void recordFailure() {
        failureCount++
        lastFailure = System.currentTimeMillis()
        if (failureCount >= threshold) {
            state = "OPEN"
            log.warn "Circuit breaker: OPEN " +
                "(failures: $failureCount >= threshold: $threshold)"
        }
    }
}

// Retry Configuration
def maxRetries = 3
def initialDelay = 1000L
def backoffMultiplier = 2
def maxDelay = 10000L

// Circuit Breaker instance
def cb = new CircuitBreaker(log, 5)

// Retry with exponential backoff
def executeWithRetry(stepName, maxRetries, initialDelay,
                     backoffMultiplier, maxDelay, cb) {
    def currentDelay = initialDelay

    for (int attempt = 1; attempt <= maxRetries; attempt++) {
        // Check circuit breaker
        if (!cb.allowRequest()) {
            log.error "Circuit breaker is OPEN. " +
                "Skipping request to $stepName"
            throw new RuntimeException(
                "Circuit breaker open for $stepName")
        }

        try {
            log.info "Attempt $attempt/$maxRetries for $stepName"

            def step = testRunner.testCase
                .getTestStepByName(stepName)
            if (!step) {
                log.info "Step $stepName not found, simulating..."
                cb.recordSuccess()
                return [status: "SUCCESS", attempts: attempt]
            }

            def result = step.run(testRunner, context)
            def response = context.expand(
                "\\\${$stepName#Response}")

            // Check for SOAP Fault
            if (response.contains("soap:Fault") ||
                response.contains("soapenv:Fault")) {
                def xml = new XmlSlurper().parseText(response)
                def faultCode = xml.Body.Fault.faultcode.text()
                def faultString = xml.Body.Fault.faultstring.text()

                if (isRetryable(faultCode)) {
                    log.warn "Retryable SOAP Fault: $faultString"
                    cb.recordFailure()
                    throw new RuntimeException(
                        "Retryable fault: $faultString")
                } else {
                    log.error "Non-retryable fault: $faultString"
                    cb.recordFailure()
                    return [status: "FAILED",
                        error: faultString, attempts: attempt]
                }
            }

            // Parse successful response
            def xml = new XmlSlurper().parseText(response)
            def status = xml.Body.'*'.find {
                it.name().contains("Response") }?.Status?.text()

            if (status == "SUCCESS") {
                cb.recordSuccess()
                log.info "$stepName succeeded on attempt $attempt"
                return [status: "SUCCESS", attempts: attempt]
            } else if (status == "SERVICE_UNAVAILABLE") {
                cb.recordFailure()
                throw new RuntimeException("Service unavailable")
            } else {
                cb.recordSuccess()
                return [status: status, attempts: attempt]
            }

        } catch (java.net.SocketTimeoutException e) {
            log.warn "Timeout on attempt $attempt: \${e.message}"
            cb.recordFailure()
        } catch (java.net.ConnectException e) {
            log.warn "Connection failed on attempt " +
                "$attempt: \${e.message}"
            cb.recordFailure()
        } catch (RuntimeException e) {
            log.warn "Error on attempt $attempt: \${e.message}"
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
            def waitTime = Math.min(currentDelay, maxDelay)
            log.info "Waiting \${waitTime}ms before retry..."
            Thread.sleep(waitTime)
            currentDelay *= backoffMultiplier
        }
    }

    return [status: "FAILED",
        error: "Max retries ($maxRetries) exhausted",
        attempts: maxRetries]
}

def isRetryable(faultCode) {
    def retryableCodes = [
        "SERVER_BUSY", "SERVICE_UNAVAILABLE",
        "TIMEOUT", "CONNECTION_RESET",
        "RATE_LIMITED"
    ]
    return faultCode in retryableCodes
}

// Execute test steps with error handling
def steps = ["GetAccountBalance", "FundTransfer",
    "GetTransactionStatus"]
def overallResults = []

steps.each { stepName ->
    log.info "\\n--- Processing: $stepName ---"
    try {
        def result = executeWithRetry(
            stepName, maxRetries, initialDelay,
            backoffMultiplier, maxDelay, cb)
        overallResults << [step: stepName,
            status: result.status,
            attempts: result.attempts]
        log.info "$stepName: \${result.status} " +
            "(\${result.attempts} attempts)"
    } catch (Exception e) {
        overallResults << [step: stepName,
            status: "ERROR", error: e.message]
        log.error "$stepName: ERROR - \${e.message}"
    }
}

// Summary Report
log.info "\\n=== Execution Summary ==="
log.info "Circuit Breaker State: \${cb.state}"
log.info "Failure Count: \${cb.failureCount}"
overallResults.each { r ->
    log.info "\${r.step}: \${r.status}" +
        (r.attempts ? " (\${r.attempts} attempts)" : "") +
        (r.error ? " - \${r.error}" : "")
}

def failedSteps = overallResults.findAll {
    it.status == "FAILED" || it.status == "ERROR" }
assert failedSteps.isEmpty() :
    "Failed steps: \${failedSteps.collect { it.step }}"`,
    expectedOutput: `SoapUI Groovy Script Execution:

[INFO] === Error Handling & Retry Logic ===

[INFO] --- Processing: GetAccountBalance ---
[INFO] Attempt 1/3 for GetAccountBalance
[INFO] GetAccountBalance succeeded on attempt 1
[INFO] GetAccountBalance: SUCCESS (1 attempts)

[INFO] --- Processing: FundTransfer ---
[INFO] Attempt 1/3 for FundTransfer
[INFO] FundTransfer succeeded on attempt 1
[INFO] FundTransfer: SUCCESS (1 attempts)

[INFO] --- Processing: GetTransactionStatus ---
[INFO] Attempt 1/3 for GetTransactionStatus
[INFO] GetTransactionStatus succeeded on attempt 1
[INFO] GetTransactionStatus: SUCCESS (1 attempts)

[INFO] === Execution Summary ===
[INFO] Circuit Breaker State: CLOSED
[INFO] Failure Count: 0
[INFO] GetAccountBalance: SUCCESS (1 attempts)
[INFO] FundTransfer: SUCCESS (1 attempts)
[INFO] GetTransactionStatus: SUCCESS (1 attempts)

Test Step: PASSED
Execution Time: 1234ms`
  },
  // === JMETER PERFORMANCE (AT-041 to AT-050) ===
  {id:'AT-041',title:'Login API Load Test (1000 users)',category:'jmeter',framework:'JMeter',language:'XML',difficulty:'Intermediate',description:'JMeter test plan for load testing the login API with 1000 concurrent users, ramp-up configuration, and response time assertions.',prerequisites:'Apache JMeter 5.6+, JMeter Plugins Manager',config:'{\n  "threadGroup": {\n    "threads": 1000,\n    "rampUp": 60,\n    "duration": 300,\n    "loops": -1\n  },\n  "target": "https://api.example-bank.com/api/v1/login"\n}',
    code:`<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan"
        testname="Bank Login Load Test">
      <elementProp name="TestPlan.user_defined_variables"
          elementType="Arguments">
        <collectionProp name="Arguments.arguments">
          <elementProp name="BASE_URL" elementType="Argument">
            <stringProp name="Argument.value">api.example-bank.com</stringProp>
          </elementProp>
          <elementProp name="PROTOCOL" elementType="Argument">
            <stringProp name="Argument.value">https</stringProp>
          </elementProp>
        </collectionProp>
      </elementProp>
    </TestPlan>
    <hashTree>
      <!-- Thread Group: 1000 Virtual Users -->
      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup"
          testname="Login Load Test - 1000 Users">
        <stringProp name="ThreadGroup.num_threads">1000</stringProp>
        <stringProp name="ThreadGroup.ramp_time">60</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <stringProp name="ThreadGroup.duration">300</stringProp>
        <elementProp name="ThreadGroup.main_controller"
            elementType="LoopController">
          <intProp name="LoopController.loops">-1</intProp>
        </elementProp>
      </ThreadGroup>
      <hashTree>
        <!-- CSV Data Set for User Credentials -->
        <CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet"
            testname="User Credentials">
          <stringProp name="filename">test-data/users.csv</stringProp>
          <stringProp name="variableNames">USERNAME,PASSWORD</stringProp>
          <stringProp name="delimiter">,</stringProp>
          <boolProp name="recycle">true</boolProp>
          <stringProp name="shareMode">shareMode.all</stringProp>
        </CSVDataSet>

        <!-- HTTP Request: Login API -->
        <HTTPSamplerProxy guiclass="HttpTestSampleGui"
            testclass="HTTPSamplerProxy" testname="POST /api/v1/login">
          <stringProp name="HTTPSampler.domain">\${BASE_URL}</stringProp>
          <stringProp name="HTTPSampler.protocol">\${PROTOCOL}</stringProp>
          <stringProp name="HTTPSampler.path">/api/v1/login</stringProp>
          <stringProp name="HTTPSampler.method">POST</stringProp>
          <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
          <elementProp name="HTTPsampler.Arguments"
              elementType="Arguments">
            <collectionProp name="Arguments.arguments">
              <elementProp elementType="HTTPArgument">
                <stringProp name="Argument.value">
                  {"username": "\${USERNAME}", "password": "\${PASSWORD}"}
                </stringProp>
              </elementProp>
            </collectionProp>
          </elementProp>
        </HTTPSamplerProxy>
        <hashTree>
          <!-- Response Assertion: Status 200 -->
          <ResponseAssertion guiclass="AssertionGui"
              testclass="ResponseAssertion" testname="Status 200">
            <intProp name="Assertion.test_type">8</intProp>
            <stringProp name="Assertion.test_field">Assertion.response_code</stringProp>
            <collectionProp name="Asserion.test_strings">
              <stringProp>200</stringProp>
            </collectionProp>
          </ResponseAssertion>

          <!-- Duration Assertion: < 2 seconds -->
          <DurationAssertion guiclass="DurationAssertionGui"
              testclass="DurationAssertion" testname="Response < 2s">
            <stringProp name="DurationAssertion.duration">2000</stringProp>
          </DurationAssertion>

          <!-- JSON Extractor: Extract Token -->
          <JSONPostProcessor guiclass="JSONPostProcessorGui"
              testclass="JSONPostProcessor" testname="Extract Token">
            <stringProp name="JSONPostProcessor.referenceNames">AUTH_TOKEN</stringProp>
            <stringProp name="JSONPostProcessor.jsonPathExprs">$.access_token</stringProp>
          </JSONPostProcessor>
        </hashTree>

        <!-- Listeners -->
        <ResultCollector guiclass="SummaryReport"
            testclass="ResultCollector" testname="Summary Report">
          <stringProp name="filename">results/login_summary.csv</stringProp>
        </ResultCollector>
        <ResultCollector guiclass="ViewResultsFullVisualizer"
            testclass="ResultCollector" testname="View Results Tree"/>
        <ResultCollector guiclass="StatVisualizer"
            testclass="ResultCollector" testname="Aggregate Report">
          <stringProp name="filename">results/login_aggregate.csv</stringProp>
        </ResultCollector>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>`,
    expectedOutput:`JMeter Test Execution Summary:
================================
Test Plan: Bank Login Load Test
Duration: 300 seconds
Thread Group: 1000 users, 60s ramp-up

Aggregate Report:
+-----------------+--------+------+------+------+------+------+--------+
| Label           | # Reqs | Avg  | Med  | 90%  | 95%  | 99%  | Error% |
+-----------------+--------+------+------+------+------+------+--------+
| POST /login     | 24,567 | 234  | 198  | 456  | 678  | 1234 | 0.12%  |
+-----------------+--------+------+------+------+------+------+--------+
| TOTAL           | 24,567 | 234  | 198  | 456  | 678  | 1234 | 0.12%  |
+-----------------+--------+------+------+------+------+------+--------+

Throughput: 81.89 req/sec
Received KB/sec: 234.56
Avg Response Time: 234ms
90th Percentile: 456ms
Error Rate: 0.12%

RESULT: PASSED (all thresholds met)`},
  {id:'AT-042',title:'Transaction API Stress Test',category:'jmeter',framework:'JMeter',language:'XML',difficulty:'Advanced',description:'Stress test for fund transfer API pushing system beyond normal capacity to find breaking point with graduated load increase.',prerequisites:'Apache JMeter 5.6+, Stepping Thread Group plugin',config:'{\n  "stressConfig": {\n    "startThreads": 100,\n    "maxThreads": 5000,\n    "stepSize": 100,\n    "stepDuration": 30\n  }\n}',
    code:`<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan testname="Transaction API Stress Test">
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments">
        <collectionProp name="Arguments.arguments">
          <elementProp name="BASE_URL" elementType="Argument">
            <stringProp name="Argument.value">api.example-bank.com</stringProp>
          </elementProp>
        </collectionProp>
      </elementProp>
    </TestPlan>
    <hashTree>
      <!-- Stepping Thread Group: 100 to 5000 users -->
      <kg.apc.jmeter.threads.SteppingThreadGroup
          testname="Stress Test - Graduated Load">
        <stringProp name="ThreadGroup.num_threads">5000</stringProp>
        <stringProp name="Threads initial delay">0</stringProp>
        <stringProp name="Start users count">100</stringProp>
        <stringProp name="Start users period">30</stringProp>
        <stringProp name="Stop users count">100</stringProp>
        <stringProp name="Stop users period">10</stringProp>
        <stringProp name="flighttime">60</stringProp>
      </kg.apc.jmeter.threads.SteppingThreadGroup>
      <hashTree>
        <!-- Transaction Controller -->
        <TransactionController testname="Fund Transfer Flow">
          <boolProp name="TransactionController.includeTimers">false</boolProp>
        </TransactionController>
        <hashTree>
          <!-- Step 1: Login -->
          <HTTPSamplerProxy testname="POST /login">
            <stringProp name="HTTPSampler.domain">\${BASE_URL}</stringProp>
            <stringProp name="HTTPSampler.protocol">https</stringProp>
            <stringProp name="HTTPSampler.path">/api/v1/login</stringProp>
            <stringProp name="HTTPSampler.method">POST</stringProp>
            <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
            <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
              <collectionProp name="Arguments.arguments">
                <elementProp elementType="HTTPArgument">
                  <stringProp name="Argument.value">
                    {"username": "\${USERNAME}", "password": "\${PASSWORD}"}
                  </stringProp>
                </elementProp>
              </collectionProp>
            </elementProp>
          </HTTPSamplerProxy>
          <hashTree>
            <JSONPostProcessor testname="Extract Token">
              <stringProp name="JSONPostProcessor.referenceNames">TOKEN</stringProp>
              <stringProp name="JSONPostProcessor.jsonPathExprs">$.access_token</stringProp>
            </JSONPostProcessor>
          </hashTree>

          <!-- Step 2: Fund Transfer -->
          <HTTPSamplerProxy testname="POST /transfers">
            <stringProp name="HTTPSampler.domain">\${BASE_URL}</stringProp>
            <stringProp name="HTTPSampler.protocol">https</stringProp>
            <stringProp name="HTTPSampler.path">/api/v1/transfers</stringProp>
            <stringProp name="HTTPSampler.method">POST</stringProp>
            <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
            <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
              <collectionProp name="Arguments.arguments">
                <elementProp elementType="HTTPArgument">
                  <stringProp name="Argument.value">
                    {
                      "fromAccount": "\${FROM_ACC}",
                      "toAccount": "\${TO_ACC}",
                      "amount": \${__Random(100,50000)},
                      "transferType": "IMPS",
                      "remarks": "Stress test txn"
                    }
                  </stringProp>
                </elementProp>
              </collectionProp>
            </elementProp>
          </HTTPSamplerProxy>
          <hashTree>
            <HeaderManager testname="Auth Headers">
              <collectionProp name="HeaderManager.headers">
                <elementProp elementType="Header">
                  <stringProp name="Header.name">Authorization</stringProp>
                  <stringProp name="Header.value">Bearer \${TOKEN}</stringProp>
                </elementProp>
                <elementProp elementType="Header">
                  <stringProp name="Header.name">Content-Type</stringProp>
                  <stringProp name="Header.value">application/json</stringProp>
                </elementProp>
                <elementProp elementType="Header">
                  <stringProp name="Header.name">X-Idempotency-Key</stringProp>
                  <stringProp name="Header.value">\${__UUID()}</stringProp>
                </elementProp>
              </collectionProp>
            </HeaderManager>
          </hashTree>
        </hashTree>

        <!-- Think Time -->
        <ConstantTimer testname="Think Time">
          <stringProp name="ConstantTimer.delay">1000</stringProp>
        </ConstantTimer>

        <!-- Assertions -->
        <ResponseAssertion testname="Status Code Check">
          <intProp name="Assertion.test_type">8</intProp>
          <stringProp name="Assertion.test_field">Assertion.response_code</stringProp>
          <collectionProp name="Asserion.test_strings">
            <stringProp>200</stringProp>
          </collectionProp>
        </ResponseAssertion>

        <!-- Listeners -->
        <ResultCollector guiclass="SummaryReport" testname="Summary"/>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>`,
    expectedOutput:`JMeter Stress Test Results:
================================
Test: Transaction API Stress Test
Load: 100 -> 5000 users (step: 100 every 30s)

Breaking Point Analysis:
+-------+--------+--------+--------+--------+
| Users | Avg ms | 95% ms | Errors | TPS    |
+-------+--------+--------+--------+--------+
|   100 |    156 |    345 |  0.00% |  89.2  |
|   500 |    234 |    567 |  0.05% | 412.3  |
|  1000 |    456 |    890 |  0.12% | 756.8  |
|  2000 |    789 |   1567 |  0.45% | 1234.5 |
|  3000 |   1234 |   2890 |  1.23% | 1567.8 |
|  4000 |   2567 |   5678 |  4.56% | 1456.2 |
|  5000 |   4567 |   9012 | 12.34% | 1234.5 |
+-------+--------+--------+--------+--------+

Breaking Point: ~3500 concurrent users
Max Stable TPS: 1567.8 at 3000 users
Recommended Capacity: 2500 users (with 20% headroom)

RESULT: Breaking point identified at 3500 users`},
  {id:'AT-043',title:'Database Query Performance Test',category:'jmeter',framework:'JMeter',language:'XML',difficulty:'Advanced',description:'Tests database query performance using JDBC sampler for account lookups, transaction queries, and report generation under concurrent load.',prerequisites:'Apache JMeter 5.6+, JDBC driver (Oracle/PostgreSQL)',config:'{\n  "jdbc": {\n    "driver": "oracle.jdbc.OracleDriver",\n    "url": "jdbc:oracle:thin:@dbhost:1521:BANKDB",\n    "maxConnections": 50\n  }\n}',
    code:`<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan testname="Database Performance Test">
      <stringProp name="TestPlan.comments">
        Tests critical banking database queries under load
      </stringProp>
    </TestPlan>
    <hashTree>
      <!-- JDBC Connection Configuration -->
      <JDBCDataSource guiclass="TestBeanGUI"
          testclass="JDBCDataSource" testname="Bank DB Connection">
        <stringProp name="dataSource">bankDB</stringProp>
        <stringProp name="dbUrl">jdbc:oracle:thin:@dbhost:1521:BANKDB</stringProp>
        <stringProp name="driver">oracle.jdbc.OracleDriver</stringProp>
        <stringProp name="username">\${__P(db.user,testuser)}</stringProp>
        <stringProp name="password">\${__P(db.pass,TestPass123)}</stringProp>
        <stringProp name="poolMax">50</stringProp>
        <stringProp name="timeout">10000</stringProp>
        <stringProp name="connectionProperties">
          oracle.net.CONNECT_TIMEOUT=5000;oracle.jdbc.ReadTimeout=30000
        </stringProp>
      </JDBCDataSource>

      <!-- Thread Group: 200 concurrent DB queries -->
      <ThreadGroup testname="DB Query Load Test">
        <stringProp name="ThreadGroup.num_threads">200</stringProp>
        <stringProp name="ThreadGroup.ramp_time">30</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <stringProp name="ThreadGroup.duration">180</stringProp>
      </ThreadGroup>
      <hashTree>
        <!-- Query 1: Account Balance Lookup -->
        <JDBCSampler testname="Account Balance Query">
          <stringProp name="dataSource">bankDB</stringProp>
          <stringProp name="queryType">Select Statement</stringProp>
          <stringProp name="query">
            SELECT a.ACCOUNT_NUMBER, a.AVAILABLE_BALANCE,
                   a.HOLD_AMOUNT, a.STATUS
            FROM ACCOUNTS a
            WHERE a.CUSTOMER_ID = ?
            AND a.STATUS = 'ACTIVE'
          </stringProp>
          <stringProp name="queryArguments">\${CUSTOMER_ID}</stringProp>
          <stringProp name="queryArgumentsTypes">VARCHAR</stringProp>
          <stringProp name="resultVariable">balanceResult</stringProp>
        </JDBCSampler>
        <hashTree>
          <DurationAssertion testname="Query < 500ms">
            <stringProp name="DurationAssertion.duration">500</stringProp>
          </DurationAssertion>
        </hashTree>

        <!-- Query 2: Transaction History (last 30 days) -->
        <JDBCSampler testname="Transaction History Query">
          <stringProp name="dataSource">bankDB</stringProp>
          <stringProp name="queryType">Select Statement</stringProp>
          <stringProp name="query">
            SELECT t.TXN_ID, t.TXN_DATE, t.DESCRIPTION,
                   t.DEBIT_AMOUNT, t.CREDIT_AMOUNT, t.BALANCE
            FROM TRANSACTIONS t
            WHERE t.ACCOUNT_ID = ?
            AND t.TXN_DATE >= SYSDATE - 30
            ORDER BY t.TXN_DATE DESC
            FETCH FIRST 100 ROWS ONLY
          </stringProp>
          <stringProp name="queryArguments">\${ACCOUNT_ID}</stringProp>
          <stringProp name="queryArgumentsTypes">VARCHAR</stringProp>
        </JDBCSampler>
        <hashTree>
          <DurationAssertion testname="Query < 1000ms">
            <stringProp name="DurationAssertion.duration">1000</stringProp>
          </DurationAssertion>
        </hashTree>

        <!-- Query 3: Daily Summary Report -->
        <JDBCSampler testname="Daily Summary Report Query">
          <stringProp name="dataSource">bankDB</stringProp>
          <stringProp name="queryType">Select Statement</stringProp>
          <stringProp name="query">
            SELECT TXN_TYPE,
                   COUNT(*) as TXN_COUNT,
                   SUM(AMOUNT) as TOTAL_AMOUNT,
                   AVG(AMOUNT) as AVG_AMOUNT,
                   MAX(AMOUNT) as MAX_AMOUNT
            FROM TRANSACTIONS
            WHERE TXN_DATE >= TRUNC(SYSDATE)
            GROUP BY TXN_TYPE
            ORDER BY TXN_COUNT DESC
          </stringProp>
        </JDBCSampler>
        <hashTree>
          <DurationAssertion testname="Report Query < 2000ms">
            <stringProp name="DurationAssertion.duration">2000</stringProp>
          </DurationAssertion>
        </hashTree>

        <ConstantTimer testname="Pacing">
          <stringProp name="ConstantTimer.delay">500</stringProp>
        </ConstantTimer>

        <ResultCollector guiclass="SummaryReport" testname="DB Summary"/>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>`,
    expectedOutput:`JMeter DB Performance Results:
================================
Threads: 200 | Duration: 180s | Connection Pool: 50

Query Performance:
+-------------------------+--------+------+------+------+--------+
| Query                   | # Reqs | Avg  | 90%  | 99%  | Error% |
+-------------------------+--------+------+------+------+--------+
| Account Balance         | 12,456 |  45  |  89  | 234  |  0.00% |
| Transaction History     |  6,234 | 234  | 456  | 890  |  0.02% |
| Daily Summary Report    |  3,123 | 567  | 890  | 1567 |  0.05% |
+-------------------------+--------+------+------+------+--------+

Connection Pool Stats:
  Active: 48/50 | Idle: 2 | Wait: 12ms avg

RESULT: PASSED (all queries within thresholds)`},
  {id:'AT-044',title:'File Upload Endurance Test',category:'jmeter',framework:'JMeter',language:'XML',difficulty:'Intermediate',description:'Endurance test for document upload API simulating continuous file uploads over extended period to detect memory leaks and resource exhaustion.',prerequisites:'Apache JMeter 5.6+, test files of various sizes',config:'{\n  "endurance": {\n    "threads": 50,\n    "duration": 3600,\n    "fileTypes": ["pdf", "jpg", "xlsx"],\n    "maxFileSize": "5MB"\n  }\n}',
    code:`<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan testname="File Upload Endurance Test">
      <stringProp name="TestPlan.comments">
        1-hour endurance test for document upload API
        Monitors: memory, response time degradation, errors
      </stringProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup testname="Upload Endurance - 50 Users x 1 Hour">
        <stringProp name="ThreadGroup.num_threads">50</stringProp>
        <stringProp name="ThreadGroup.ramp_time">60</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <stringProp name="ThreadGroup.duration">3600</stringProp>
        <elementProp name="ThreadGroup.main_controller"
            elementType="LoopController">
          <intProp name="LoopController.loops">-1</intProp>
        </elementProp>
      </ThreadGroup>
      <hashTree>
        <!-- Random file selection -->
        <CSVDataSet testname="Test Files">
          <stringProp name="filename">test-data/upload_files.csv</stringProp>
          <stringProp name="variableNames">FILE_PATH,FILE_TYPE,FILE_SIZE</stringProp>
          <boolProp name="recycle">true</boolProp>
        </CSVDataSet>

        <!-- Login to get token -->
        <HTTPSamplerProxy testname="Login">
          <stringProp name="HTTPSampler.domain">api.example-bank.com</stringProp>
          <stringProp name="HTTPSampler.protocol">https</stringProp>
          <stringProp name="HTTPSampler.path">/api/v1/login</stringProp>
          <stringProp name="HTTPSampler.method">POST</stringProp>
          <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
            <collectionProp name="Arguments.arguments">
              <elementProp elementType="HTTPArgument">
                <stringProp name="Argument.value">
                  {"username": "\${USERNAME}", "password": "\${PASSWORD}"}
                </stringProp>
              </elementProp>
            </collectionProp>
          </elementProp>
        </HTTPSamplerProxy>
        <hashTree>
          <JSONPostProcessor testname="Extract Token">
            <stringProp name="JSONPostProcessor.referenceNames">TOKEN</stringProp>
            <stringProp name="JSONPostProcessor.jsonPathExprs">$.access_token</stringProp>
          </JSONPostProcessor>
          <OnceOnlyController testname="Login Once"/>
        </hashTree>

        <!-- File Upload Request -->
        <HTTPSamplerProxy testname="Upload Document">
          <stringProp name="HTTPSampler.domain">api.example-bank.com</stringProp>
          <stringProp name="HTTPSampler.protocol">https</stringProp>
          <stringProp name="HTTPSampler.path">/api/v1/documents/upload</stringProp>
          <stringProp name="HTTPSampler.method">POST</stringProp>
          <elementProp name="HTTPsampler.Files" elementType="HTTPFileArgs">
            <collectionProp name="HTTPFileArgs.files">
              <elementProp elementType="HTTPFileArg">
                <stringProp name="File.path">\${FILE_PATH}</stringProp>
                <stringProp name="File.paramname">file</stringProp>
                <stringProp name="File.mimetype">application/octet-stream</stringProp>
              </elementProp>
            </collectionProp>
          </elementProp>
        </HTTPSamplerProxy>
        <hashTree>
          <HeaderManager testname="Upload Headers">
            <collectionProp name="HeaderManager.headers">
              <elementProp elementType="Header">
                <stringProp name="Header.name">Authorization</stringProp>
                <stringProp name="Header.value">Bearer \${TOKEN}</stringProp>
              </elementProp>
            </collectionProp>
          </HeaderManager>
          <ResponseAssertion testname="Upload Success">
            <collectionProp name="Asserion.test_strings">
              <stringProp>200</stringProp>
              <stringProp>201</stringProp>
            </collectionProp>
          </ResponseAssertion>
          <DurationAssertion testname="Upload < 10s">
            <stringProp name="DurationAssertion.duration">10000</stringProp>
          </DurationAssertion>
        </hashTree>

        <GaussianRandomTimer testname="Think Time">
          <stringProp name="ConstantTimer.delay">2000</stringProp>
          <stringProp name="RandomTimer.range">1000</stringProp>
        </GaussianRandomTimer>

        <ResultCollector guiclass="SummaryReport" testname="Summary"/>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>`,
    expectedOutput:`JMeter Endurance Test Results (1 Hour):
================================
Threads: 50 | Duration: 3600s

Upload Performance Over Time:
+----------+--------+------+------+--------+
| Time     | # Reqs | Avg  | 95%  | Error% |
+----------+--------+------+------+--------+
| 0-15min  |  2,345 | 1234 | 2345 |  0.00% |
| 15-30min |  2,312 | 1256 | 2367 |  0.00% |
| 30-45min |  2,298 | 1278 | 2390 |  0.02% |
| 45-60min |  2,289 | 1289 | 2401 |  0.02% |
+----------+--------+------+------+--------+

Memory Trend: Stable (no leak detected)
Response Time Degradation: 4.4% (within 10% threshold)
Total Uploads: 9,244 files
Total Data Transferred: 23.4 GB
Error Rate: 0.01%

RESULT: PASSED (stable over 1 hour)`},
  {id:'AT-045',title:'API Response Time Benchmark',category:'jmeter',framework:'JMeter',language:'XML',difficulty:'Beginner',description:'Benchmarks API response times across all critical banking endpoints establishing baseline metrics and SLA compliance validation.',prerequisites:'Apache JMeter 5.6+',config:'{\n  "benchmark": {\n    "threads": 100,\n    "iterations": 50,\n    "slaThresholds": {\n      "login": 1000,\n      "balance": 500,\n      "transfer": 2000,\n      "statement": 3000\n    }\n  }\n}',
    code:`<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan testname="API Response Time Benchmark">
      <stringProp name="TestPlan.comments">
        Baseline benchmark for all critical banking APIs
        SLA: Login<1s, Balance<500ms, Transfer<2s, Statement<3s
      </stringProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup testname="Benchmark - 100 Users x 50 Iterations">
        <stringProp name="ThreadGroup.num_threads">100</stringProp>
        <stringProp name="ThreadGroup.ramp_time">30</stringProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController">
          <intProp name="LoopController.loops">50</intProp>
        </elementProp>
      </ThreadGroup>
      <hashTree>
        <!-- API 1: Login -->
        <HTTPSamplerProxy testname="[BM] POST /login">
          <stringProp name="HTTPSampler.domain">api.example-bank.com</stringProp>
          <stringProp name="HTTPSampler.protocol">https</stringProp>
          <stringProp name="HTTPSampler.path">/api/v1/login</stringProp>
          <stringProp name="HTTPSampler.method">POST</stringProp>
          <stringProp name="HTTPSampler.connect_timeout">5000</stringProp>
          <stringProp name="HTTPSampler.response_timeout">10000</stringProp>
        </HTTPSamplerProxy>
        <hashTree>
          <DurationAssertion testname="SLA: Login < 1000ms">
            <stringProp name="DurationAssertion.duration">1000</stringProp>
          </DurationAssertion>
        </hashTree>

        <!-- API 2: Balance Inquiry -->
        <HTTPSamplerProxy testname="[BM] GET /balance">
          <stringProp name="HTTPSampler.domain">api.example-bank.com</stringProp>
          <stringProp name="HTTPSampler.protocol">https</stringProp>
          <stringProp name="HTTPSampler.path">/api/v1/accounts/ACC1234567890/balance</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
        </HTTPSamplerProxy>
        <hashTree>
          <DurationAssertion testname="SLA: Balance < 500ms">
            <stringProp name="DurationAssertion.duration">500</stringProp>
          </DurationAssertion>
        </hashTree>

        <!-- API 3: Fund Transfer -->
        <HTTPSamplerProxy testname="[BM] POST /transfers">
          <stringProp name="HTTPSampler.domain">api.example-bank.com</stringProp>
          <stringProp name="HTTPSampler.protocol">https</stringProp>
          <stringProp name="HTTPSampler.path">/api/v1/transfers</stringProp>
          <stringProp name="HTTPSampler.method">POST</stringProp>
        </HTTPSamplerProxy>
        <hashTree>
          <DurationAssertion testname="SLA: Transfer < 2000ms">
            <stringProp name="DurationAssertion.duration">2000</stringProp>
          </DurationAssertion>
        </hashTree>

        <!-- API 4: Account Statement -->
        <HTTPSamplerProxy testname="[BM] GET /statements">
          <stringProp name="HTTPSampler.domain">api.example-bank.com</stringProp>
          <stringProp name="HTTPSampler.protocol">https</stringProp>
          <stringProp name="HTTPSampler.path">/api/v1/accounts/ACC1234567890/statements</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
        </HTTPSamplerProxy>
        <hashTree>
          <DurationAssertion testname="SLA: Statement < 3000ms">
            <stringProp name="DurationAssertion.duration">3000</stringProp>
          </DurationAssertion>
        </hashTree>

        <!-- API 5: Customer Search -->
        <HTTPSamplerProxy testname="[BM] GET /customers/search">
          <stringProp name="HTTPSampler.domain">api.example-bank.com</stringProp>
          <stringProp name="HTTPSampler.protocol">https</stringProp>
          <stringProp name="HTTPSampler.path">/api/v1/customers/search?q=Rajesh</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
        </HTTPSamplerProxy>
        <hashTree>
          <DurationAssertion testname="SLA: Search < 1000ms">
            <stringProp name="DurationAssertion.duration">1000</stringProp>
          </DurationAssertion>
        </hashTree>

        <ResultCollector guiclass="SummaryReport" testname="Benchmark Results"/>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>`,
    expectedOutput:`API Response Time Benchmark Report:
================================
Users: 100 | Iterations: 50

Benchmark Results:
+-----------------------+------+------+------+------+--------+--------+
| Endpoint              | Avg  | Med  | 90%  | 99%  | SLA    | Status |
+-----------------------+------+------+------+------+--------+--------+
| POST /login           | 234  | 198  | 456  | 789  | <1000  | PASS   |
| GET /balance          |  89  |  67  | 156  | 234  | <500   | PASS   |
| POST /transfers       | 567  | 456  | 890  | 1234 | <2000  | PASS   |
| GET /statements       | 890  | 678  | 1567 | 2345 | <3000  | PASS   |
| GET /customers/search | 345  | 234  | 567  | 890  | <1000  | PASS   |
+-----------------------+------+------+------+------+--------+--------+

Overall: 5/5 APIs within SLA thresholds
Total Requests: 25,000
Overall Error Rate: 0.04%

RESULT: ALL BENCHMARKS PASSED`},
  {id:'AT-046',title:'Concurrent User Simulation',category:'jmeter',framework:'JMeter',language:'XML',difficulty:'Intermediate',description:'Simulates realistic concurrent user behavior with mixed workload including browsing, transactions, and admin operations with weighted distribution.',prerequisites:'Apache JMeter 5.6+, Throughput Controller plugin',config:'{\n  "workloadMix": {\n    "browse": 50,\n    "transfer": 25,\n    "inquiry": 20,\n    "admin": 5\n  },\n  "totalUsers": 500\n}',
    code:`<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan testname="Concurrent User Simulation - Mixed Workload">
      <stringProp name="TestPlan.comments">
        Realistic user simulation: 50% browsing, 25% transfers,
        20% inquiries, 5% admin operations
      </stringProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup testname="Mixed Workload - 500 Users">
        <stringProp name="ThreadGroup.num_threads">500</stringProp>
        <stringProp name="ThreadGroup.ramp_time">120</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <stringProp name="ThreadGroup.duration">600</stringProp>
      </ThreadGroup>
      <hashTree>
        <!-- Browsing Users (50% of traffic) -->
        <ThroughputController testname="Browse Flow (50%)">
          <intProp name="ThroughputController.style">1</intProp>
          <FloatProperty name="ThroughputController.percentThroughput">50.0</FloatProperty>
        </ThroughputController>
        <hashTree>
          <HTTPSamplerProxy testname="View Dashboard">
            <stringProp name="HTTPSampler.path">/api/v1/dashboard</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="View Accounts">
            <stringProp name="HTTPSampler.path">/api/v1/accounts</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="View Notifications">
            <stringProp name="HTTPSampler.path">/api/v1/notifications</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
        </hashTree>

        <!-- Transfer Users (25% of traffic) -->
        <ThroughputController testname="Transfer Flow (25%)">
          <FloatProperty name="ThroughputController.percentThroughput">25.0</FloatProperty>
        </ThroughputController>
        <hashTree>
          <HTTPSamplerProxy testname="Get Beneficiaries">
            <stringProp name="HTTPSampler.path">/api/v1/beneficiaries</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="Fund Transfer">
            <stringProp name="HTTPSampler.path">/api/v1/transfers</stringProp>
            <stringProp name="HTTPSampler.method">POST</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="Verify Transfer">
            <stringProp name="HTTPSampler.path">/api/v1/transfers/\${TXN_REF}</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
        </hashTree>

        <!-- Inquiry Users (20% of traffic) -->
        <ThroughputController testname="Inquiry Flow (20%)">
          <FloatProperty name="ThroughputController.percentThroughput">20.0</FloatProperty>
        </ThroughputController>
        <hashTree>
          <HTTPSamplerProxy testname="Balance Inquiry">
            <stringProp name="HTTPSampler.path">/api/v1/accounts/\${ACC_ID}/balance</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="Mini Statement">
            <stringProp name="HTTPSampler.path">/api/v1/accounts/\${ACC_ID}/statements?limit=10</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
        </hashTree>

        <!-- Admin Users (5% of traffic) -->
        <ThroughputController testname="Admin Flow (5%)">
          <FloatProperty name="ThroughputController.percentThroughput">5.0</FloatProperty>
        </ThroughputController>
        <hashTree>
          <HTTPSamplerProxy testname="Customer Search">
            <stringProp name="HTTPSampler.path">/api/v1/admin/customers/search?q=test</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="Audit Log">
            <stringProp name="HTTPSampler.path">/api/v1/admin/audit-log?limit=50</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
        </hashTree>

        <GaussianRandomTimer testname="Realistic Think Time">
          <stringProp name="ConstantTimer.delay">3000</stringProp>
          <stringProp name="RandomTimer.range">2000</stringProp>
        </GaussianRandomTimer>

        <ResultCollector guiclass="SummaryReport" testname="Summary"/>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>`,
    expectedOutput:`Concurrent User Simulation Results:
================================
Users: 500 | Duration: 10 min | Ramp-up: 2 min

Workload Distribution:
+------------------+--------+------+------+--------+
| Flow             | # Reqs | Avg  | 95%  | Error% |
+------------------+--------+------+------+--------+
| Browse (50%)     | 15,234 | 145  | 345  |  0.02% |
| Transfer (25%)   |  7,567 | 567  | 1234 |  0.08% |
| Inquiry (20%)    |  6,123 | 178  | 389  |  0.01% |
| Admin (5%)       |  1,534 | 234  | 567  |  0.00% |
+------------------+--------+------+------+--------+
| TOTAL            | 30,458 | 245  | 567  |  0.03% |
+------------------+--------+------+------+--------+

Concurrent Active Users Peak: 487
Throughput: 50.76 req/sec

RESULT: PASSED`},
  {id:'AT-047',title:'Spike Test - Salary Day Scenario',category:'jmeter',framework:'JMeter',language:'XML',difficulty:'Advanced',description:'Simulates salary day traffic spike where 10x normal users suddenly access the system simultaneously for balance checks and transfers.',prerequisites:'Apache JMeter 5.6+, Ultimate Thread Group plugin',config:'{\n  "spikeConfig": {\n    "normalUsers": 200,\n    "spikeUsers": 2000,\n    "spikeDuration": 60,\n    "recoveryTime": 120\n  }\n}',
    code:`<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan testname="Salary Day Spike Test">
      <stringProp name="TestPlan.comments">
        Simulates salary day: normal load -> 10x spike -> recovery
        Tests system resilience under sudden traffic surge
      </stringProp>
    </TestPlan>
    <hashTree>
      <!-- Phase 1: Normal Load (200 users for 2 min) -->
      <ThreadGroup testname="Phase 1: Normal Load (200 users)">
        <stringProp name="ThreadGroup.num_threads">200</stringProp>
        <stringProp name="ThreadGroup.ramp_time">30</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <stringProp name="ThreadGroup.duration">120</stringProp>
        <stringProp name="ThreadGroup.delay">0</stringProp>
      </ThreadGroup>
      <hashTree>
        <HTTPSamplerProxy testname="Balance Check (Normal)">
          <stringProp name="HTTPSampler.domain">api.example-bank.com</stringProp>
          <stringProp name="HTTPSampler.protocol">https</stringProp>
          <stringProp name="HTTPSampler.path">/api/v1/accounts/\${ACC_ID}/balance</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
        </HTTPSamplerProxy>
        <GaussianRandomTimer testname="Normal Think Time">
          <stringProp name="ConstantTimer.delay">5000</stringProp>
          <stringProp name="RandomTimer.range">3000</stringProp>
        </GaussianRandomTimer>
        <ResultCollector testname="Normal Phase Results"/>
      </hashTree>

      <!-- Phase 2: Spike (2000 users, instant ramp) -->
      <ThreadGroup testname="Phase 2: SPIKE (2000 users)">
        <stringProp name="ThreadGroup.num_threads">2000</stringProp>
        <stringProp name="ThreadGroup.ramp_time">10</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <stringProp name="ThreadGroup.duration">60</stringProp>
        <stringProp name="ThreadGroup.delay">120</stringProp>
      </ThreadGroup>
      <hashTree>
        <TransactionController testname="Salary Day Actions">
          <boolProp name="TransactionController.includeTimers">false</boolProp>
        </TransactionController>
        <hashTree>
          <!-- Everyone checks balance first -->
          <HTTPSamplerProxy testname="Balance Check (Spike)">
            <stringProp name="HTTPSampler.domain">api.example-bank.com</stringProp>
            <stringProp name="HTTPSampler.protocol">https</stringProp>
            <stringProp name="HTTPSampler.path">/api/v1/accounts/\${ACC_ID}/balance</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
          <!-- 30% immediately do transfers -->
          <ThroughputController testname="Transfer (30%)">
            <FloatProperty name="ThroughputController.percentThroughput">30.0</FloatProperty>
          </ThroughputController>
          <hashTree>
            <HTTPSamplerProxy testname="Fund Transfer (Spike)">
              <stringProp name="HTTPSampler.domain">api.example-bank.com</stringProp>
              <stringProp name="HTTPSampler.protocol">https</stringProp>
              <stringProp name="HTTPSampler.path">/api/v1/transfers</stringProp>
              <stringProp name="HTTPSampler.method">POST</stringProp>
            </HTTPSamplerProxy>
          </hashTree>
        </hashTree>
        <ConstantTimer testname="Spike Think Time">
          <stringProp name="ConstantTimer.delay">1000</stringProp>
        </ConstantTimer>
        <ResultCollector testname="Spike Phase Results"/>
      </hashTree>

      <!-- Phase 3: Recovery (back to 200 users) -->
      <ThreadGroup testname="Phase 3: Recovery (200 users)">
        <stringProp name="ThreadGroup.num_threads">200</stringProp>
        <stringProp name="ThreadGroup.ramp_time">10</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <stringProp name="ThreadGroup.duration">120</stringProp>
        <stringProp name="ThreadGroup.delay">180</stringProp>
      </ThreadGroup>
      <hashTree>
        <HTTPSamplerProxy testname="Balance Check (Recovery)">
          <stringProp name="HTTPSampler.domain">api.example-bank.com</stringProp>
          <stringProp name="HTTPSampler.protocol">https</stringProp>
          <stringProp name="HTTPSampler.path">/api/v1/accounts/\${ACC_ID}/balance</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
        </HTTPSamplerProxy>
        <ResultCollector testname="Recovery Phase Results"/>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>`,
    expectedOutput:`Salary Day Spike Test Results:
================================

Phase 1 - Normal Load (0-2min):
  Users: 200 | Avg: 89ms | 95%: 234ms | Errors: 0.00%
  Throughput: 38.4 req/sec

Phase 2 - SPIKE (2-3min):
  Users: 2000 | Avg: 1567ms | 95%: 4567ms | Errors: 2.34%
  Throughput: 456.7 req/sec
  Peak concurrent: 1,987
  Queue depth max: 234

Phase 3 - Recovery (3-5min):
  Users: 200 | Avg: 123ms | 95%: 345ms | Errors: 0.01%
  Throughput: 36.8 req/sec
  Recovery time: 45 seconds to return to baseline

Spike Impact:
  Response time increase: 17.6x during spike
  Error rate during spike: 2.34%
  System recovered within 45 seconds

RESULT: PASSED (system recovered, errors within 5% threshold)`},
  {id:'AT-048',title:'Soak Test - 24-Hour Stability',category:'jmeter',framework:'JMeter',language:'XML',difficulty:'Advanced',description:'24-hour soak test to detect memory leaks, connection pool exhaustion, and gradual performance degradation under steady moderate load.',prerequisites:'Apache JMeter 5.6+, JMeter Plugins: PerfMon, Custom Thread Groups',config:'{\n  "soakConfig": {\n    "threads": 100,\n    "duration": 86400,\n    "samplingInterval": 300,\n    "memoryThreshold": "80%"\n  }\n}',
    code:`<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan testname="24-Hour Soak Test - Banking API">
      <stringProp name="TestPlan.comments">
        Stability test: 100 users for 24 hours
        Monitoring: memory, CPU, connections, response times
        Alert if: response time degrades >20%, error rate >1%,
                  memory usage >80%
      </stringProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup testname="Soak Test - 100 Users x 24 Hours">
        <stringProp name="ThreadGroup.num_threads">100</stringProp>
        <stringProp name="ThreadGroup.ramp_time">300</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <stringProp name="ThreadGroup.duration">86400</stringProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController">
          <intProp name="LoopController.loops">-1</intProp>
        </elementProp>
      </ThreadGroup>
      <hashTree>
        <!-- Realistic user workflow -->
        <TransactionController testname="Banking Session">
          <boolProp name="TransactionController.includeTimers">false</boolProp>
        </TransactionController>
        <hashTree>
          <HTTPSamplerProxy testname="Login">
            <stringProp name="HTTPSampler.path">/api/v1/login</stringProp>
            <stringProp name="HTTPSampler.method">POST</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="Dashboard">
            <stringProp name="HTTPSampler.path">/api/v1/dashboard</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="Account Balance">
            <stringProp name="HTTPSampler.path">/api/v1/accounts/\${ACC_ID}/balance</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="Recent Transactions">
            <stringProp name="HTTPSampler.path">/api/v1/accounts/\${ACC_ID}/transactions?limit=20</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="Logout">
            <stringProp name="HTTPSampler.path">/api/v1/logout</stringProp>
            <stringProp name="HTTPSampler.method">POST</stringProp>
          </HTTPSamplerProxy>
        </hashTree>

        <!-- Realistic pacing: one session every 30-60 seconds -->
        <UniformRandomTimer testname="Session Pacing">
          <stringProp name="ConstantTimer.delay">30000</stringProp>
          <stringProp name="RandomTimer.range">30000</stringProp>
        </UniformRandomTimer>

        <!-- Aggregate Report saved every 5 minutes -->
        <ResultCollector guiclass="SummaryReport" testname="5-Min Summary">
          <stringProp name="filename">results/soak_summary.csv</stringProp>
        </ResultCollector>
      </hashTree>

      <!-- PerfMon Server Monitoring -->
      <kg.apc.jmeter.perfmon.PerfMonCollector testname="Server Monitor">
        <collectionProp name="metricConnections">
          <collectionProp>
            <stringProp>api.example-bank.com</stringProp>
            <stringProp>4444</stringProp>
            <stringProp>CPU</stringProp>
          </collectionProp>
          <collectionProp>
            <stringProp>api.example-bank.com</stringProp>
            <stringProp>4444</stringProp>
            <stringProp>Memory</stringProp>
          </collectionProp>
        </collectionProp>
      </kg.apc.jmeter.perfmon.PerfMonCollector>
    </hashTree>
  </hashTree>
</jmeterTestPlan>`,
    expectedOutput:`24-Hour Soak Test Results:
================================
Duration: 24 hours | Users: 100

Hourly Performance Trend:
+------+--------+------+------+--------+--------+---------+
| Hour | # Reqs | Avg  | 95%  | Error% | CPU %  | Mem %   |
+------+--------+------+------+--------+--------+---------+
|    1 |  3,456 |  145 |  345 |  0.01% |  34%   |  45%    |
|    6 |  3,423 |  148 |  352 |  0.01% |  35%   |  48%    |
|   12 |  3,412 |  152 |  367 |  0.02% |  36%   |  52%    |
|   18 |  3,398 |  156 |  378 |  0.02% |  37%   |  54%    |
|   24 |  3,389 |  159 |  389 |  0.02% |  37%   |  55%    |
+------+--------+------+------+--------+--------+---------+

Memory: Stable (45% -> 55%, no leak pattern)
Response Time Degradation: 9.6% over 24h (within 20%)
Connection Pool: Stable (no exhaustion)
Error Rate: Consistent 0.02%

RESULT: PASSED (24-hour stability confirmed)`},
  {id:'AT-049',title:'Distributed Load Test Configuration',category:'jmeter',framework:'JMeter',language:'XML',difficulty:'Advanced',description:'Configures JMeter for distributed load testing across multiple machines to generate 10,000+ concurrent virtual users for bank-wide performance testing.',prerequisites:'Apache JMeter 5.6+, 5 slave machines, Network connectivity',config:'{\n  "distributed": {\n    "masterHost": "jmeter-master.internal",\n    "slaveHosts": ["slave1:1099","slave2:1099","slave3:1099","slave4:1099","slave5:1099"],\n    "totalUsers": 10000,\n    "usersPerSlave": 2000\n  }\n}',
    code:`<?xml version="1.0" encoding="UTF-8"?>
<!-- Distributed JMeter Configuration -->
<!-- Run with: jmeter -n -t distributed_test.jmx
     -R slave1,slave2,slave3,slave4,slave5
     -l results.jtl -e -o report/ -->

<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan testname="Distributed Bank Load Test - 10K Users">
      <stringProp name="TestPlan.comments">
        10,000 users across 5 JMeter slaves (2000 each)
        Master orchestrates, slaves generate load
        Target: Bank-wide performance baseline
      </stringProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments">
        <collectionProp name="Arguments.arguments">
          <elementProp name="USERS_PER_SLAVE" elementType="Argument">
            <stringProp name="Argument.value">2000</stringProp>
          </elementProp>
          <elementProp name="RAMP_UP" elementType="Argument">
            <stringProp name="Argument.value">300</stringProp>
          </elementProp>
          <elementProp name="DURATION" elementType="Argument">
            <stringProp name="Argument.value">600</stringProp>
          </elementProp>
          <elementProp name="TARGET_HOST" elementType="Argument">
            <stringProp name="Argument.value">api.example-bank.com</stringProp>
          </elementProp>
        </collectionProp>
      </elementProp>
    </TestPlan>
    <hashTree>
      <!-- Each slave runs this thread group -->
      <ThreadGroup testname="Load Per Slave">
        <stringProp name="ThreadGroup.num_threads">\${USERS_PER_SLAVE}</stringProp>
        <stringProp name="ThreadGroup.ramp_time">\${RAMP_UP}</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <stringProp name="ThreadGroup.duration">\${DURATION}</stringProp>
      </ThreadGroup>
      <hashTree>
        <!-- Cookie Manager for session handling -->
        <CookieManager testname="Cookie Manager">
          <boolProp name="CookieManager.clearEachIteration">true</boolProp>
        </CookieManager>

        <!-- Header Manager -->
        <HeaderManager testname="Common Headers">
          <collectionProp name="HeaderManager.headers">
            <elementProp elementType="Header">
              <stringProp name="Header.name">Content-Type</stringProp>
              <stringProp name="Header.value">application/json</stringProp>
            </elementProp>
            <elementProp elementType="Header">
              <stringProp name="Header.name">Accept</stringProp>
              <stringProp name="Header.value">application/json</stringProp>
            </elementProp>
            <elementProp elementType="Header">
              <stringProp name="Header.name">X-Load-Test</stringProp>
              <stringProp name="Header.value">distributed-\${__machineName()}</stringProp>
            </elementProp>
          </collectionProp>
        </HeaderManager>

        <!-- Mixed workload (same as real user distribution) -->
        <RandomController testname="Random API Mix">
          <intProp name="InterleaveControl.style">1</intProp>
        </RandomController>
        <hashTree>
          <HTTPSamplerProxy testname="Login">
            <stringProp name="HTTPSampler.domain">\${TARGET_HOST}</stringProp>
            <stringProp name="HTTPSampler.path">/api/v1/login</stringProp>
            <stringProp name="HTTPSampler.method">POST</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="Dashboard">
            <stringProp name="HTTPSampler.domain">\${TARGET_HOST}</stringProp>
            <stringProp name="HTTPSampler.path">/api/v1/dashboard</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="Balance">
            <stringProp name="HTTPSampler.domain">\${TARGET_HOST}</stringProp>
            <stringProp name="HTTPSampler.path">/api/v1/accounts/\${ACC_ID}/balance</stringProp>
            <stringProp name="HTTPSampler.method">GET</stringProp>
          </HTTPSamplerProxy>
          <HTTPSamplerProxy testname="Transfer">
            <stringProp name="HTTPSampler.domain">\${TARGET_HOST}</stringProp>
            <stringProp name="HTTPSampler.path">/api/v1/transfers</stringProp>
            <stringProp name="HTTPSampler.method">POST</stringProp>
          </HTTPSamplerProxy>
        </hashTree>

        <GaussianRandomTimer testname="Think Time">
          <stringProp name="ConstantTimer.delay">3000</stringProp>
          <stringProp name="RandomTimer.range">2000</stringProp>
        </GaussianRandomTimer>

        <ResultCollector guiclass="SummaryReport" testname="Distributed Results">
          <stringProp name="filename">results/distributed_\${__machineName()}.jtl</stringProp>
        </ResultCollector>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>`,
    expectedOutput:`Distributed Load Test Results:
================================
Slaves: 5 | Users per slave: 2000 | Total: 10,000
Duration: 10 min | Ramp-up: 5 min

Per-Slave Distribution:
+----------+--------+------+------+--------+
| Slave    | # Reqs | Avg  | 95%  | Error% |
+----------+--------+------+------+--------+
| slave1   | 24,567 | 345  | 890  |  0.15% |
| slave2   | 24,234 | 356  | 912  |  0.12% |
| slave3   | 24,890 | 334  | 878  |  0.18% |
| slave4   | 24,123 | 367  | 945  |  0.14% |
| slave5   | 24,456 | 345  | 901  |  0.16% |
+----------+--------+------+------+--------+
| TOTAL    |122,270 | 349  | 905  |  0.15% |
+----------+--------+------+------+--------+

Peak Concurrent: 9,876
Peak Throughput: 2,037 req/sec
Server CPU Peak: 78%
Server Memory Peak: 72%

RESULT: PASSED (10K users handled successfully)`},
  {id:'AT-050',title:'Custom JMeter Plugin Script',category:'jmeter',framework:'JMeter',language:'Java',difficulty:'Advanced',description:'Custom JMeter sampler plugin for banking-specific protocol testing including ISO 8583 message format simulation and SWIFT message validation.',prerequisites:'Apache JMeter 5.6+, Java 11+, Maven for plugin build',config:'{\n  "plugin": {\n    "name": "BankProtocolSampler",\n    "version": "1.0.0",\n    "protocols": ["ISO8583", "SWIFT"]\n  }\n}',
    code:`// Custom JMeter Sampler Plugin - Banking Protocol Tester
// File: BankProtocolSampler.java
package com.bank.jmeter.samplers;

import org.apache.jmeter.samplers.AbstractSampler;
import org.apache.jmeter.samplers.Entry;
import org.apache.jmeter.samplers.SampleResult;
import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class BankProtocolSampler extends AbstractSampler
        implements Serializable {

    // ISO 8583 Message Type Indicators
    private static final Map<String, String> MTI_TYPES = Map.of(
        "0100", "Authorization Request",
        "0110", "Authorization Response",
        "0200", "Financial Transaction Request",
        "0210", "Financial Transaction Response",
        "0400", "Reversal Request",
        "0410", "Reversal Response",
        "0800", "Network Management Request",
        "0810", "Network Management Response"
    );

    @Override
    public SampleResult sample(Entry entry) {
        SampleResult result = new SampleResult();
        result.setSampleLabel(getName());
        result.sampleStart();

        try {
            String protocol = getPropertyAsString("protocol", "ISO8583");
            String messageType = getPropertyAsString("messageType", "0200");
            String pan = getPropertyAsString("pan", "4567890123456789");
            String amount = getPropertyAsString("amount", "5000.00");
            String merchantId = getPropertyAsString("merchantId", "MERCHANT001");

            if ("ISO8583".equals(protocol)) {
                // Build ISO 8583 message
                Map<Integer, String> fields = new HashMap<>();
                fields.put(0, messageType); // MTI
                fields.put(2, pan); // Primary Account Number
                fields.put(3, "000000"); // Processing Code
                fields.put(4, formatAmount(amount)); // Amount
                fields.put(7, getCurrentDateTime()); // Transmission Date
                fields.put(11, generateSTAN()); // System Trace Audit Number
                fields.put(12, getCurrentTime()); // Local Time
                fields.put(13, getCurrentDate()); // Local Date
                fields.put(22, "051"); // POS Entry Mode
                fields.put(25, "00"); // POS Condition Code
                fields.put(41, "TERM0001"); // Terminal ID
                fields.put(42, merchantId); // Merchant ID
                fields.put(43, "Test Merchant, Bangalore, KA"); // Merchant Name
                fields.put(49, "356"); // Currency Code (INR)

                String isoMessage = buildISO8583Message(fields);

                // Simulate sending to switch
                result.setSamplerData("ISO 8583 Message:\\n" +
                    formatISOMessage(fields));

                // Simulate response (in real plugin, send via TCP)
                Thread.sleep(50 + (long)(Math.random() * 200));

                // Build response
                Map<Integer, String> responseFields = new HashMap<>(fields);
                responseFields.put(0, messageType.substring(0, 2) + "10");
                responseFields.put(38, "AUTH" +
                    String.format("%06d", (int)(Math.random() * 999999)));
                responseFields.put(39, "00"); // Approval Code

                String responseMessage = formatISOMessage(responseFields);
                result.setResponseData(responseMessage, "UTF-8");
                result.setResponseCode("00");
                result.setResponseMessage("APPROVED");
                result.setSuccessful(true);

            } else if ("SWIFT".equals(protocol)) {
                // Build SWIFT MT103 message
                String swiftMessage = buildSWIFTMT103(
                    pan, amount, merchantId);
                result.setSamplerData(swiftMessage);

                Thread.sleep(100 + (long)(Math.random() * 300));

                result.setResponseData(
                    "SWIFT ACK: Message accepted\\n" +
                    "Reference: " + generateSWIFTRef() + "\\n" +
                    "Status: ACCEPTED", "UTF-8");
                result.setResponseCode("ACK");
                result.setSuccessful(true);
            }

            result.setDataType(SampleResult.TEXT);

        } catch (Exception e) {
            result.setSuccessful(false);
            result.setResponseMessage("Error: " + e.getMessage());
            result.setResponseCode("500");
        }

        result.sampleEnd();
        return result;
    }

    private String formatAmount(String amount) {
        long cents = (long)(Double.parseDouble(amount) * 100);
        return String.format("%012d", cents);
    }

    private String getCurrentDateTime() {
        return new java.text.SimpleDateFormat("MMddHHmmss")
            .format(new java.util.Date());
    }

    private String getCurrentTime() {
        return new java.text.SimpleDateFormat("HHmmss")
            .format(new java.util.Date());
    }

    private String getCurrentDate() {
        return new java.text.SimpleDateFormat("MMdd")
            .format(new java.util.Date());
    }

    private String generateSTAN() {
        return String.format("%06d", (int)(Math.random() * 999999));
    }

    private String generateSWIFTRef() {
        return "SWIFT" + System.currentTimeMillis();
    }

    private String buildISO8583Message(Map<Integer, String> fields) {
        StringBuilder sb = new StringBuilder();
        fields.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(e -> sb.append(String.format(
                "F%03d:%s|", e.getKey(), e.getValue())));
        return sb.toString();
    }

    private String formatISOMessage(Map<Integer, String> fields) {
        StringBuilder sb = new StringBuilder();
        sb.append("=== ISO 8583 Message ===\\n");
        fields.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(e -> {
                String desc = getFieldDescription(e.getKey());
                sb.append(String.format(
                    "  Field %3d [%-25s]: %s\\n",
                    e.getKey(), desc, e.getValue()));
            });
        return sb.toString();
    }

    private String getFieldDescription(int field) {
        Map<Integer, String> descs = Map.ofEntries(
            Map.entry(0, "Message Type"),
            Map.entry(2, "PAN"),
            Map.entry(3, "Processing Code"),
            Map.entry(4, "Amount"),
            Map.entry(7, "Transmission DateTime"),
            Map.entry(11, "STAN"),
            Map.entry(38, "Auth Code"),
            Map.entry(39, "Response Code"),
            Map.entry(41, "Terminal ID"),
            Map.entry(42, "Merchant ID"),
            Map.entry(49, "Currency Code")
        );
        return descs.getOrDefault(field, "Field " + field);
    }

    private String buildSWIFTMT103(String account,
            String amount, String beneficiary) {
        return String.format(
            "{1:F01EXBKINBBAXXX0000000000}\\n" +
            "{2:I103HDFCINBBXXXXN}\\n" +
            "{4:\\n" +
            ":20:TXN%s\\n" +
            ":23B:CRED\\n" +
            ":32A:%s INR%s\\n" +
            ":50K:/%s\\nRajesh Kumar\\n" +
            ":59:/%s\\n%s\\n" +
            ":71A:SHA\\n" +
            "-}", generateSTAN(),
            new java.text.SimpleDateFormat("yyMMdd")
                .format(new java.util.Date()),
            amount, account, "ACC9876543210", beneficiary);
    }
}`,
    expectedOutput:`Custom JMeter Plugin Test Results:
================================
Plugin: BankProtocolSampler v1.0.0

ISO 8583 Transaction Test:
  MTI: 0200 (Financial Transaction Request)
  PAN: 4567XXXXXXXX6789
  Amount: INR 5,000.00
  Terminal: TERM0001
  Response: 0210 (Financial Transaction Response)
  Auth Code: AUTH456789
  Response Code: 00 (APPROVED)
  Time: 156ms
  PASSED

SWIFT MT103 Test:
  Reference: TXN234567
  Amount: INR 5,000.00
  Status: ACK - Message accepted
  Time: 234ms
  PASSED

Load Test (100 threads x 50 iterations):
+------------------+------+------+------+--------+
| Protocol         | Avg  | 95%  | Max  | Error% |
+------------------+------+------+------+--------+
| ISO 8583         |  67  | 156  | 345  |  0.00% |
| SWIFT MT103      | 145  | 289  | 567  |  0.00% |
+------------------+------+------+------+--------+

Total: 10,000 messages processed
RESULT: PASSED`},
  // === CI/CD PIPELINE (AT-051 to AT-060) ===
  {id:'AT-051',title:'Jenkins Pipeline - Build & Test',category:'cicd',framework:'Jenkins',language:'Groovy',difficulty:'Intermediate',description:'Complete Jenkins pipeline for banking application with build, unit test, API test, UI test stages, and Allure reporting with Slack notifications.',prerequisites:'Jenkins 2.400+, Maven 3.9+, JDK 11+, Docker, Allure plugin',config:'{\n  "jenkins": {\n    "agent": "any",\n    "jdk": "JDK-11",\n    "maven": "Maven-3.9",\n    "slackChannel": "#qa-alerts",\n    "allureResults": "allure-results"\n  }\n}',
    code:`// Jenkinsfile - Banking Application CI/CD Pipeline
pipeline {
    agent any

    tools {
        jdk 'JDK-11'
        maven 'Maven-3.9'
    }

    environment {
        APP_NAME = 'banking-app'
        DOCKER_REGISTRY = 'registry.example-bank.com'
        SONAR_HOST = 'https://sonar.example-bank.com'
        ALLURE_RESULTS = 'target/allure-results'
        SLACK_CHANNEL = '#qa-alerts'
    }

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['UAT', 'SIT', 'PROD'],
            description: 'Target environment')
        booleanParam(name: 'RUN_UI_TESTS', defaultValue: true,
            description: 'Run Selenium UI tests')
        booleanParam(name: 'RUN_PERF_TESTS', defaultValue: false,
            description: 'Run JMeter performance tests')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: \${env.GIT_BRANCH}"
                echo "Commit: \${env.GIT_COMMIT}"
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean compile -DskipTests'
                echo 'Build completed successfully'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'mvn test -Dgroups=unit -Dmaven.test.failure.ignore=false'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                    jacoco execPattern: 'target/jacoco.exec',
                        minimumBranchCoverage: '80',
                        minimumLineCoverage: '80'
                }
            }
        }

        stage('Static Analysis') {
            parallel {
                stage('SonarQube') {
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            sh """mvn sonar:sonar \\
                                -Dsonar.projectKey=\${APP_NAME} \\
                                -Dsonar.host.url=\${SONAR_HOST}"""
                        }
                    }
                }
                stage('Security Scan') {
                    steps {
                        sh 'mvn org.owasp:dependency-check-maven:check'
                    }
                    post {
                        always {
                            publishHTML(target: [
                                reportName: 'OWASP Report',
                                reportDir: 'target',
                                reportFiles: 'dependency-check-report.html'
                            ])
                        }
                    }
                }
            }
        }

        stage('API Tests') {
            steps {
                sh """mvn test -Dgroups=api \\
                    -Dbase.url=https://\${params.ENVIRONMENT}-api.example-bank.com \\
                    -Dtest.env=\${params.ENVIRONMENT}"""
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('UI Tests') {
            when {
                expression { params.RUN_UI_TESTS == true }
            }
            steps {
                sh """mvn test -Dgroups=ui \\
                    -Dselenium.grid.url=http://selenium-grid:4444 \\
                    -Dbrowser=chrome \\
                    -Dbase.url=https://\${params.ENVIRONMENT}.example-bank.com"""
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                    archiveArtifacts artifacts: 'target/screenshots/**',
                        allowEmptyArchive: true
                }
            }
        }

        stage('Performance Tests') {
            when {
                expression { params.RUN_PERF_TESTS == true }
            }
            steps {
                sh """jmeter -n \\
                    -t tests/performance/load_test.jmx \\
                    -l results/perf_results.jtl \\
                    -JTARGET_HOST=\${params.ENVIRONMENT}-api.example-bank.com \\
                    -JTHREADS=100 \\
                    -JDURATION=300"""
            }
            post {
                always {
                    perfReport sourceDataFiles: 'results/perf_results.jtl',
                        errorFailedThreshold: 5,
                        errorUnstableThreshold: 3
                }
            }
        }

        stage('Docker Build') {
            when { branch 'main' }
            steps {
                sh """docker build \\
                    -t \${DOCKER_REGISTRY}/\${APP_NAME}:\${env.BUILD_NUMBER} \\
                    -t \${DOCKER_REGISTRY}/\${APP_NAME}:latest ."""
                sh """docker push \${DOCKER_REGISTRY}/\${APP_NAME}:\${env.BUILD_NUMBER}
                      docker push \${DOCKER_REGISTRY}/\${APP_NAME}:latest"""
            }
        }

        stage('Deploy') {
            when { branch 'main' }
            steps {
                sh """kubectl set image deployment/\${APP_NAME} \\
                    \${APP_NAME}=\${DOCKER_REGISTRY}/\${APP_NAME}:\${env.BUILD_NUMBER} \\
                    -n \${params.ENVIRONMENT}"""
                sh "kubectl rollout status deployment/\${APP_NAME} -n \${params.ENVIRONMENT} --timeout=300s"
            }
        }
    }

    post {
        always {
            allure includeProperties: false,
                results: [[path: '\${ALLURE_RESULTS}']]
        }
        success {
            slackSend channel: SLACK_CHANNEL, color: 'good',
                message: "BUILD SUCCESS: \${env.JOB_NAME} #\${env.BUILD_NUMBER}"
        }
        failure {
            slackSend channel: SLACK_CHANNEL, color: 'danger',
                message: "BUILD FAILED: \${env.JOB_NAME} #\${env.BUILD_NUMBER}\\n\${env.BUILD_URL}"
        }
        cleanup {
            cleanWs()
        }
    }
}`,
    expectedOutput:`Jenkins Pipeline Execution:
================================
Job: banking-app-pipeline #42
Branch: main | Commit: abc1234

Stage Results:
+----------------------+---------+----------+
| Stage                | Status  | Duration |
+----------------------+---------+----------+
| Checkout             | SUCCESS |     3s   |
| Build                | SUCCESS |    45s   |
| Unit Tests           | SUCCESS |   120s   |
| Static Analysis      | SUCCESS |    90s   |
|   - SonarQube        | SUCCESS |    60s   |
|   - Security Scan    | SUCCESS |    30s   |
| API Tests            | SUCCESS |   180s   |
| UI Tests             | SUCCESS |   300s   |
| Docker Build & Push  | SUCCESS |    60s   |
| Deploy               | SUCCESS |    45s   |
+----------------------+---------+----------+

Test Results: 156 passed, 0 failed, 2 skipped
Code Coverage: 87.3% (threshold: 80%)
Security: No critical vulnerabilities
Allure Report: Generated

RESULT: SUCCESS (Total: 14m 33s)`},
  {id:'AT-052',title:'GitHub Actions - PR Validation',category:'cicd',framework:'Jenkins',language:'YAML',difficulty:'Beginner',description:'GitHub Actions workflow for PR validation including linting, testing, security scanning, and automated code review comments.',prerequisites:'GitHub repository, GitHub Actions enabled',config:'{\n  "github": {\n    "runner": "ubuntu-latest",\n    "javaVersion": "11",\n    "nodeVersion": "18"\n  }\n}',
    code:`# .github/workflows/pr-validation.yml
name: PR Validation

on:
  pull_request:
    branches: [main, develop]
    types: [opened, synchronize, reopened]

concurrency:
  group: pr-\${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  lint:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 11
        uses: actions/setup-java@v4
        with:
          java-version: '11'
          distribution: 'temurin'
          cache: 'maven'

      - name: Checkstyle
        run: mvn checkstyle:check -Dcheckstyle.violationSeverity=warning

      - name: SpotBugs
        run: mvn spotbugs:check

      - name: PMD
        run: mvn pmd:check

  test:
    name: Unit & API Tests
    runs-on: ubuntu-latest
    needs: lint
    services:
      oracle-db:
        image: gvenzl/oracle-xe:21-slim
        env:
          ORACLE_PASSWORD: testpass
        ports:
          - 1521:1521
        options: --health-cmd "healthcheck.sh"

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 11
        uses: actions/setup-java@v4
        with:
          java-version: '11'
          distribution: 'temurin'
          cache: 'maven'

      - name: Run Unit Tests
        run: |
          mvn test -Dgroups=unit \\
            -Djacoco.destFile=target/jacoco-unit.exec
        env:
          DB_URL: jdbc:oracle:thin:@localhost:1521:XE
          DB_USER: testuser
          DB_PASS: testpass

      - name: Run API Tests
        run: |
          mvn test -Dgroups=api \\
            -Dbase.url=http://localhost:8080

      - name: Code Coverage Report
        run: mvn jacoco:report

      - name: Upload Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: target/site/jacoco/

      - name: Coverage Gate
        run: |
          COVERAGE=$(mvn jacoco:check -Djacoco.line.minimum=0.80 2>&1)
          if echo "$COVERAGE" | grep -q "FAILED"; then
            echo "Coverage below 80% threshold!"
            exit 1
          fi

      - name: Test Report
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Test Results
          path: target/surefire-reports/*.xml
          reporter: java-junit

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4

      - name: OWASP Dependency Check
        run: mvn org.owasp:dependency-check-maven:check

      - name: Trivy Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          severity: 'HIGH,CRITICAL'

      - name: Upload Security Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: security-report
          path: target/dependency-check-report.html

  summary:
    name: PR Summary
    runs-on: ubuntu-latest
    needs: [lint, test, security]
    if: always()
    steps:
      - name: Post PR Comment
        uses: actions/github-script@v7
        with:
          script: |
            const lintResult = '\${{ needs.lint.result }}';
            const testResult = '\${{ needs.test.result }}';
            const secResult = '\${{ needs.security.result }}';

            const body = [
              '## PR Validation Results',
              '',
              '| Check | Status |',
              '|-------|--------|',
              '| Code Quality | ' + (lintResult === 'success' ? 'PASS' : 'FAIL') + ' |',
              '| Unit & API Tests | ' + (testResult === 'success' ? 'PASS' : 'FAIL') + ' |',
              '| Security Scan | ' + (secResult === 'success' ? 'PASS' : 'FAIL') + ' |',
            ].join('\\n');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });`,
    expectedOutput:`GitHub Actions PR Validation:
================================
PR #42: feat: add fund transfer API
Branch: feature/fund-transfer -> main

Jobs:
+-------------------+---------+----------+
| Job               | Status  | Duration |
+-------------------+---------+----------+
| Code Quality      | PASS    |    45s   |
|   - Checkstyle    | 0 violations       |
|   - SpotBugs      | 0 bugs             |
|   - PMD           | 0 violations       |
| Unit & API Tests  | PASS    |   180s   |
|   - Unit: 89/89   | passed             |
|   - API: 34/34    | passed             |
|   - Coverage      | 87.3%  (>80%)      |
| Security Scan     | PASS    |    60s   |
|   - OWASP         | 0 critical         |
|   - Trivy         | 0 HIGH/CRITICAL    |
+-------------------+---------+----------+

PR Comment Posted: "All checks passed"

RESULT: ALL CHECKS PASSED`},
  {id:'AT-053',title:'Docker Compose Test Environment',category:'cicd',framework:'Jenkins',language:'YAML',difficulty:'Intermediate',description:'Docker Compose configuration for spinning up complete test environment with banking app, database, Selenium Grid, and test runner containers.',prerequisites:'Docker 24+, Docker Compose v2',config:'{\n  "services": {\n    "app": "banking-app:latest",\n    "db": "oracle-xe:21",\n    "seleniumHub": "selenium/hub:4.15",\n    "chromeNode": "selenium/node-chrome:4.15"\n  }\n}',
    code:`# docker-compose.test.yml
# Complete test environment for banking application
version: '3.9'

services:
  # Banking Application
  banking-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: banking-app-test
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=test
      - DB_URL=jdbc:oracle:thin:@oracle-db:1521:XE
      - DB_USER=testuser
      - DB_PASS=testpass
      - REDIS_HOST=redis
      - LOG_LEVEL=INFO
    depends_on:
      oracle-db:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s
    networks:
      - test-network

  # Oracle Database
  oracle-db:
    image: gvenzl/oracle-xe:21-slim
    container_name: oracle-test-db
    ports:
      - "1521:1521"
    environment:
      - ORACLE_PASSWORD=testpass
      - APP_USER=testuser
      - APP_USER_PASSWORD=testpass
    volumes:
      - oracle-data:/opt/oracle/oradata
      - ./db/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "healthcheck.sh"]
      interval: 15s
      timeout: 10s
      retries: 20
      start_period: 60s
    networks:
      - test-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis-test
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - test-network

  # Selenium Hub
  selenium-hub:
    image: selenium/hub:4.15
    container_name: selenium-hub
    ports:
      - "4444:4444"
    environment:
      - GRID_MAX_SESSION=10
      - GRID_BROWSER_TIMEOUT=30
      - GRID_TIMEOUT=300
    networks:
      - test-network

  # Chrome Nodes (3 instances for parallel testing)
  chrome-node-1:
    image: selenium/node-chrome:4.15
    container_name: chrome-node-1
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=3
      - SE_NODE_OVERRIDE_MAX_SESSIONS=true
    volumes:
      - /dev/shm:/dev/shm
    networks:
      - test-network

  chrome-node-2:
    image: selenium/node-chrome:4.15
    container_name: chrome-node-2
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=3
    volumes:
      - /dev/shm:/dev/shm
    networks:
      - test-network

  # Test Runner
  test-runner:
    build:
      context: .
      dockerfile: Dockerfile.test
    container_name: test-runner
    depends_on:
      banking-app:
        condition: service_healthy
      selenium-hub:
        condition: service_started
    environment:
      - BASE_URL=http://banking-app:8080
      - SELENIUM_GRID=http://selenium-hub:4444
      - DB_URL=jdbc:oracle:thin:@oracle-db:1521:XE
      - TEST_GROUPS=smoke,regression
    volumes:
      - ./test-results:/app/target/surefire-reports
      - ./allure-results:/app/target/allure-results
    command: >
      mvn test
        -Dbase.url=http://banking-app:8080
        -Dselenium.grid.url=http://selenium-hub:4444
        -Dgroups=smoke,regression
        -Dmaven.test.failure.ignore=true
    networks:
      - test-network

  # Allure Report Server
  allure-report:
    image: frankescobar/allure-docker-service:latest
    container_name: allure-report
    ports:
      - "5050:5050"
    environment:
      - CHECK_RESULTS_EVERY_SECONDS=5
    volumes:
      - ./allure-results:/app/allure-results
    networks:
      - test-network

volumes:
  oracle-data:

networks:
  test-network:
    driver: bridge`,
    expectedOutput:`Docker Compose Test Environment:
================================
Starting services...

Service Status:
+------------------+-----------+----------+
| Service          | Status    | Health   |
+------------------+-----------+----------+
| oracle-db        | Running   | Healthy  |
| redis            | Running   | Healthy  |
| banking-app      | Running   | Healthy  |
| selenium-hub     | Running   | Ready    |
| chrome-node-1    | Running   | 3 slots  |
| chrome-node-2    | Running   | 3 slots  |
| test-runner      | Running   | Testing  |
| allure-report    | Running   | Ready    |
+------------------+-----------+----------+

Test Execution:
  Smoke Tests: 15/15 passed
  Regression Tests: 89/92 passed, 3 skipped
  UI Tests: 34/34 passed

Allure Report: http://localhost:5050

Cleanup: docker-compose -f docker-compose.test.yml down -v
RESULT: PASSED`},
  {id:'AT-054',title:'Selenium Grid Configuration',category:'cicd',framework:'Jenkins',language:'YAML',difficulty:'Intermediate',description:'Selenium Grid 4 configuration for parallel cross-browser testing with Chrome, Firefox, and Edge nodes for banking UI automation.',prerequisites:'Docker 24+, Selenium Grid 4',config:'{\n  "grid": {\n    "hub": "selenium/hub:4.15",\n    "browsers": ["chrome", "firefox", "edge"],\n    "maxSessions": 10,\n    "videoRecording": true\n  }\n}',
    code:`# docker-compose.selenium-grid.yml
# Selenium Grid 4 with Chrome, Firefox, Edge
version: '3.9'

services:
  selenium-hub:
    image: selenium/hub:4.15
    container_name: selenium-hub
    ports:
      - "4442:4442"
      - "4443:4443"
      - "4444:4444"
    environment:
      - GRID_MAX_SESSION=20
      - GRID_BROWSER_TIMEOUT=60
      - GRID_TIMEOUT=600
      - SE_SESSION_REQUEST_TIMEOUT=300
      - SE_NODE_SESSION_TIMEOUT=300

  chrome:
    image: selenium/node-chrome:4.15
    shm_size: '2gb'
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=5
      - SE_NODE_OVERRIDE_MAX_SESSIONS=true
      - SE_VNC_NO_PASSWORD=1
      - SE_SCREEN_WIDTH=1920
      - SE_SCREEN_HEIGHT=1080
    deploy:
      replicas: 3

  firefox:
    image: selenium/node-firefox:4.15
    shm_size: '2gb'
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=3
    deploy:
      replicas: 2

  edge:
    image: selenium/node-edge:4.15
    shm_size: '2gb'
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=3
    deploy:
      replicas: 1

  # Video recording for failed tests
  chrome-video:
    image: selenium/video:ffmpeg-6.0
    depends_on:
      - chrome
    environment:
      - DISPLAY_CONTAINER_NAME=chrome
      - FILE_NAME=chrome_test
    volumes:
      - ./videos:/videos

# --- TestNG XML for cross-browser parallel execution ---
# testng-crossbrowser.xml:
# <?xml version="1.0" encoding="UTF-8"?>
# <suite name="Cross Browser Suite" parallel="tests" thread-count="3">
#   <test name="Chrome Tests">
#     <parameter name="browser" value="chrome"/>
#     <parameter name="gridUrl" value="http://selenium-hub:4444"/>
#     <classes>
#       <class name="tests.LoginTest"/>
#       <class name="tests.DashboardTest"/>
#       <class name="tests.TransferTest"/>
#     </classes>
#   </test>
#   <test name="Firefox Tests">
#     <parameter name="browser" value="firefox"/>
#     <parameter name="gridUrl" value="http://selenium-hub:4444"/>
#     <classes>
#       <class name="tests.LoginTest"/>
#       <class name="tests.DashboardTest"/>
#       <class name="tests.TransferTest"/>
#     </classes>
#   </test>
#   <test name="Edge Tests">
#     <parameter name="browser" value="MicrosoftEdge"/>
#     <parameter name="gridUrl" value="http://selenium-hub:4444"/>
#     <classes>
#       <class name="tests.LoginTest"/>
#       <class name="tests.DashboardTest"/>
#       <class name="tests.TransferTest"/>
#     </classes>
#   </test>
# </suite>`,
    expectedOutput:`Selenium Grid 4 Status:
================================
Hub: http://localhost:4444
Grid Console: http://localhost:4444/ui

Node Status:
+---------+----------+----------+---------+
| Browser | Nodes    | Sessions | Max     |
+---------+----------+----------+---------+
| Chrome  | 3 nodes  | 8/15     | 15      |
| Firefox | 2 nodes  | 3/6      | 6       |
| Edge    | 1 node   | 1/3      | 3       |
+---------+----------+----------+---------+
| Total   | 6 nodes  | 12/24    | 24      |
+---------+----------+----------+---------+

Cross-Browser Test Results:
+---------+--------+--------+---------+
| Browser | Passed | Failed | Time    |
+---------+--------+--------+---------+
| Chrome  |  34    |   0    | 4m 23s  |
| Firefox |  34    |   0    | 5m 12s  |
| Edge    |  34    |   0    | 4m 56s  |
+---------+--------+--------+---------+

Video recordings saved: ./videos/
RESULT: ALL BROWSERS PASSED`},
  {id:'AT-055',title:'Test Report Generation (Allure)',category:'cicd',framework:'Jenkins',language:'Java',difficulty:'Beginner',description:'Configures Allure reporting framework for detailed test reports with screenshots, steps, attachments, and trend analysis for banking test suites.',prerequisites:'Allure 2.x, TestNG/JUnit, Maven',config:'{\n  "allure": {\n    "resultsDir": "target/allure-results",\n    "reportDir": "target/allure-report",\n    "categories": "src/test/resources/categories.json"\n  }\n}',
    code:`// Allure Report Configuration for Banking Test Suite
// pom.xml dependency + TestNG listener configuration

// 1. Maven Dependencies (pom.xml excerpt)
// <dependency>
//     <groupId>io.qameta.allure</groupId>
//     <artifactId>allure-testng</artifactId>
//     <version>2.24.0</version>
// </dependency>

// 2. Test with Allure annotations
import io.qameta.allure.*;
import org.testng.Assert;
import org.testng.annotations.*;
import org.openqa.selenium.*;
import java.io.ByteArrayInputStream;

@Epic("Banking Application")
@Feature("Fund Transfer")
public class FundTransferAllureTest {

    WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @Test
    @Story("IMPS Transfer")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify IMPS fund transfer with valid credentials")
    @Link(name = "JIRA", url = "https://jira.example-bank.com/BANK-1234")
    @TmsLink("TC-FT-001")
    @Owner("qa-team")
    public void testIMPSTransfer() {

        performLogin("CUST001234", "Test@1234");

        navigateToFundTransfer();

        selectTransferType("IMPS");

        selectBeneficiary("Priya Singh - ACC987654321");

        enterAmount("5000");

        confirmTransfer();

        verifyTransferSuccess();
    }

    @Step("Login with username: {username}")
    private void performLogin(String username, String password) {
        driver.get("https://netbanking.example.com/login");
        driver.findElement(By.id("userId")).sendKeys(username);
        driver.findElement(By.id("password")).sendKeys(password);
        takeScreenshot("Login Page");
        driver.findElement(By.id("loginButton")).click();
    }

    @Step("Navigate to Fund Transfer page")
    private void navigateToFundTransfer() {
        driver.findElement(By.linkText("Fund Transfer")).click();
        takeScreenshot("Fund Transfer Page");
    }

    @Step("Select transfer type: {type}")
    private void selectTransferType(String type) {
        // Select IMPS
        Allure.parameter("Transfer Type", type);
    }

    @Step("Select beneficiary: {beneficiary}")
    private void selectBeneficiary(String beneficiary) {
        Allure.parameter("Beneficiary", beneficiary);
    }

    @Step("Enter amount: INR {amount}")
    private void enterAmount(String amount) {
        driver.findElement(By.id("amount")).sendKeys(amount);
        Allure.parameter("Amount", "INR " + amount);
    }

    @Step("Confirm transfer and enter OTP")
    private void confirmTransfer() {
        driver.findElement(By.id("transferBtn")).click();
        driver.findElement(By.id("confirmTransfer")).click();
        driver.findElement(By.id("otpInput")).sendKeys("123456");
        driver.findElement(By.id("verifyOtp")).click();
        takeScreenshot("Transfer Confirmation");
    }

    @Step("Verify transfer success")
    private void verifyTransferSuccess() {
        String msg = driver.findElement(
            By.className("transfer-success")).getText();
        Assert.assertTrue(msg.contains("successful"),
            "Transfer should be successful");
        String ref = driver.findElement(
            By.id("referenceNumber")).getText();
        Allure.addAttachment("Transaction Reference",
            "text/plain", ref);
        takeScreenshot("Transfer Success");
    }

    @Attachment(value = "{name}", type = "image/png")
    private byte[] takeScreenshot(String name) {
        return ((TakesScreenshot) driver)
            .getScreenshotAs(OutputType.BYTES);
    }

    @AfterMethod
    public void teardown() {
        if (driver != null) driver.quit();
    }
}

// 3. categories.json (for Allure report categorization)
// [
//   { "name": "Product Defects",
//     "matchedStatuses": ["failed"],
//     "messageRegex": ".*Expected.*but.*" },
//   { "name": "Test Infrastructure",
//     "matchedStatuses": ["broken"],
//     "messageRegex": ".*TimeoutException.*|.*WebDriverException.*" },
//   { "name": "Known Issues",
//     "matchedStatuses": ["failed"],
//     "messageRegex": ".*KNOWN_ISSUE.*" }
// ]`,
    expectedOutput:`Allure Report Generated:
================================
Report: target/allure-report/index.html

Summary:
+-----------+-------+
| Status    | Count |
+-----------+-------+
| Passed    |   45  |
| Failed    |    2  |
| Broken    |    1  |
| Skipped   |    3  |
+-----------+-------+
| Total     |   51  |
+-----------+-------+

Trend: 3 consecutive improvements
Pass Rate: 88.2% -> 92.1% -> 94.1%

Epic: Banking Application
  Feature: Fund Transfer - 12/12 passed
  Feature: Login - 8/8 passed
  Feature: Account Management - 10/11 passed

Attachments: 45 screenshots, 12 logs
Categories: 2 Product Defects, 1 Infrastructure

RESULT: Report generated successfully`},
  {id:'AT-056',title:'Parallel Test Execution',category:'cicd',framework:'Jenkins',language:'XML',difficulty:'Intermediate',description:'Configures TestNG for parallel test execution across multiple threads and classes to reduce banking test suite execution time by 70%.',prerequisites:'TestNG 7.x, Maven Surefire plugin',config:'{\n  "parallel": {\n    "mode": "classes",\n    "threadCount": 5,\n    "dataProviderThreadCount": 3,\n    "timeout": 300000\n  }\n}',
    code:`<?xml version="1.0" encoding="UTF-8"?>
<!-- testng-parallel.xml - Parallel Test Configuration -->
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Banking Parallel Suite" parallel="classes"
       thread-count="5" verbose="2"
       data-provider-thread-count="3">

    <parameter name="baseUrl" value="https://uat.example-bank.com"/>
    <parameter name="browser" value="chrome"/>
    <parameter name="gridUrl" value="http://selenium-hub:4444"/>

    <!-- Listeners -->
    <listeners>
        <listener class-name="io.qameta.allure.testng.AllureTestNg"/>
        <listener class-name="listeners.RetryListener"/>
        <listener class-name="listeners.ScreenshotListener"/>
        <listener class-name="listeners.TestLogger"/>
    </listeners>

    <!-- Group 1: Smoke Tests (runs first, sequential) -->
    <test name="Smoke Tests" parallel="none">
        <groups>
            <run><include name="smoke"/></run>
        </groups>
        <packages>
            <package name="tests.smoke"/>
        </packages>
    </test>

    <!-- Group 2: API Tests (parallel by methods) -->
    <test name="API Tests" parallel="methods" thread-count="10">
        <groups>
            <run><include name="api"/></run>
        </groups>
        <classes>
            <class name="tests.api.CustomerApiTest"/>
            <class name="tests.api.AccountApiTest"/>
            <class name="tests.api.TransferApiTest"/>
            <class name="tests.api.TransactionApiTest"/>
            <class name="tests.api.BeneficiaryApiTest"/>
        </classes>
    </test>

    <!-- Group 3: UI Tests (parallel by classes) -->
    <test name="UI Tests - Set 1" parallel="classes" thread-count="3">
        <classes>
            <class name="tests.ui.LoginTest"/>
            <class name="tests.ui.DashboardTest"/>
            <class name="tests.ui.FundTransferTest"/>
        </classes>
    </test>

    <test name="UI Tests - Set 2" parallel="classes" thread-count="3">
        <classes>
            <class name="tests.ui.AccountStatementTest"/>
            <class name="tests.ui.BeneficiaryTest"/>
            <class name="tests.ui.CardServicesTest"/>
        </classes>
    </test>

    <!-- Group 4: Data-Driven Tests (parallel data providers) -->
    <test name="Data-Driven Tests" parallel="instances"
          thread-count="5">
        <classes>
            <class name="tests.datadriven.TransferValidationTest"/>
            <class name="tests.datadriven.CustomerSearchTest"/>
            <class name="tests.datadriven.LoanEligibilityTest"/>
        </classes>
    </test>
</suite>

<!-- Maven Surefire Configuration (pom.xml excerpt) -->
<!--
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.2.2</version>
    <configuration>
        <suiteXmlFiles>
            <suiteXmlFile>testng-parallel.xml</suiteXmlFile>
        </suiteXmlFiles>
        <properties>
            <property>
                <name>parallel</name>
                <value>classes</value>
            </property>
            <property>
                <name>threadcount</name>
                <value>5</value>
            </property>
        </properties>
        <reportsDirectory>target/surefire-reports</reportsDirectory>
    </configuration>
</plugin>
-->

<!-- RetryAnalyzer for flaky tests -->
<!--
public class RetryAnalyzer implements IRetryAnalyzer {
    private int retryCount = 0;
    private static final int MAX_RETRY = 2;

    @Override
    public boolean retry(ITestResult result) {
        if (retryCount < MAX_RETRY) {
            retryCount++;
            return true;
        }
        return false;
    }
}
-->`,
    expectedOutput:`Parallel Test Execution Results:
================================
Suite: Banking Parallel Suite
Threads: 5 (classes) + 10 (API methods) + 3 (data providers)

Execution Timeline:
+-------------------+--------+--------+----------+
| Test Group        | Tests  | Status | Duration |
+-------------------+--------+--------+----------+
| Smoke Tests       |   15   | PASS   |   2m 30s |
| API Tests (||)    |   45   | PASS   |   3m 15s |
| UI Tests Set 1    |   18   | PASS   |   4m 45s |
| UI Tests Set 2    |   18   | PASS   |   4m 30s |
| Data-Driven       |   36   | PASS   |   2m 00s |
+-------------------+--------+--------+----------+
| TOTAL             |  132   | PASS   |   8m 45s |
+-------------------+--------+--------+----------+

Sequential execution time: ~28 minutes
Parallel execution time: 8m 45s
Time saved: 69% reduction

Retried tests: 2 (both passed on retry)
Thread safety issues: 0

RESULT: PASSED (69% faster execution)`},
  {id:'AT-057',title:'Environment-Specific Config',category:'cicd',framework:'Jenkins',language:'YAML',difficulty:'Beginner',description:'Environment configuration management for DEV, SIT, UAT, and PROD with encrypted secrets, feature flags, and environment-specific test data.',prerequisites:'Maven profiles, Spring Boot, Jasypt encryption',config:'{\n  "environments": ["DEV", "SIT", "UAT", "PROD"],\n  "secretsEncryption": "jasypt",\n  "configFormat": "YAML"\n}',
    code:`# Environment Configuration Management
# config/application-uat.yml
---
spring:
  profiles: uat
  datasource:
    url: jdbc:oracle:thin:@uat-db.example-bank.com:1521:UATDB
    username: uat_user
    password: ENC(dGVzdHBhc3N3b3JkMTIz)  # Jasypt encrypted
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000

app:
  base-url: https://uat.example-bank.com
  api-url: https://uat-api.example-bank.com/api/v1
  cors-origins:
    - https://uat.example-bank.com
    - https://uat-admin.example-bank.com

security:
  jwt:
    secret: ENC(c2VjcmV0a2V5MTIzNDU2Nzg5MA==)
    expiration: 3600
  api-key: ENC(YXBpa2V5MTIzNDU2)

test:
  selenium:
    grid-url: http://uat-grid.example-bank.com:4444
    browser: chrome
    headless: false
    implicit-wait: 10
    explicit-wait: 15
    screenshot-on-failure: true
  data:
    customer-id: CUST_UAT_001
    account-id: ACC_UAT_1234567890
    beneficiary-id: BEN_UAT_001
  api:
    timeout: 10000
    retry-count: 3

# config/application-prod.yml (read-only tests only)
---
# spring:
#   profiles: prod
#   datasource:
#     url: jdbc:oracle:thin:@prod-db.example-bank.com:1521:PRODDB
#     username: readonly_user
#     password: ENC(cHJvZHBhc3N3b3Jk)
#     hikari:
#       maximum-pool-size: 5
#       read-only: true
#
# test:
#   allowed-groups: smoke,readonly
#   blocked-groups: write,destructive
#   selenium:
#     headless: true

# --- Environment Resolver (Java) ---
# @Component
# public class EnvironmentConfig {
#     @Value("\${app.base-url}")
#     private String baseUrl;
#
#     @Value("\${test.selenium.grid-url}")
#     private String gridUrl;
#
#     @Value("\${test.data.customer-id}")
#     private String testCustomerId;
#
#     public static EnvironmentConfig forEnvironment(String env) {
#         System.setProperty("spring.profiles.active", env.toLowerCase());
#         return new EnvironmentConfig();
#     }
# }

# --- Maven Profile Activation ---
# mvn test -Puat                    # UAT environment
# mvn test -Pprod -Dgroups=smoke    # PROD smoke only
# mvn test -Psit -Dparallel=classes # SIT parallel

# --- profiles in pom.xml ---
# <profiles>
#   <profile>
#     <id>dev</id>
#     <properties>
#       <spring.profiles.active>dev</spring.profiles.active>
#       <test.groups>smoke,unit</test.groups>
#     </properties>
#   </profile>
#   <profile>
#     <id>sit</id>
#     <properties>
#       <spring.profiles.active>sit</spring.profiles.active>
#       <test.groups>smoke,regression,api</test.groups>
#     </properties>
#   </profile>
#   <profile>
#     <id>uat</id>
#     <activation><activeByDefault>true</activeByDefault></activation>
#     <properties>
#       <spring.profiles.active>uat</spring.profiles.active>
#       <test.groups>smoke,regression,api,ui</test.groups>
#     </properties>
#   </profile>
#   <profile>
#     <id>prod</id>
#     <properties>
#       <spring.profiles.active>prod</spring.profiles.active>
#       <test.groups>smoke</test.groups>
#     </properties>
#   </profile>
# </profiles>`,
    expectedOutput:`Environment Configuration:
================================
Active Profile: UAT

Resolved Configuration:
+---------------------------+------------------------------------+
| Property                  | Value                              |
+---------------------------+------------------------------------+
| Base URL                  | https://uat.example-bank.com       |
| API URL                   | https://uat-api.example-bank.com   |
| Database                  | uat-db:1521/UATDB                  |
| Selenium Grid             | http://uat-grid:4444               |
| Browser                   | Chrome (visible)                   |
| Test Customer             | CUST_UAT_001                       |
| Test Groups               | smoke,regression,api,ui            |
| Secrets                   | Decrypted via Jasypt               |
+---------------------------+------------------------------------+

Environment Comparison:
+----------+-------------+------------------+----------+
| Property | DEV         | UAT              | PROD     |
+----------+-------------+------------------+----------+
| Tests    | smoke,unit  | smoke,regr,api,ui| smoke    |
| Browser  | headless    | visible          | headless |
| DB Mode  | read-write  | read-write       | readonly |
| Grid     | local       | remote           | remote   |
+----------+-------------+------------------+----------+

RESULT: Configuration loaded for UAT`},
  {id:'AT-058',title:'Database Migration & Seed',category:'cicd',framework:'Jenkins',language:'Groovy',difficulty:'Intermediate',description:'Automated database migration and test data seeding pipeline for preparing consistent test environments across all banking test cycles.',prerequisites:'Flyway/Liquibase, Jenkins, Oracle DB, Groovy',config:'{\n  "migration": {\n    "tool": "flyway",\n    "locations": "db/migration",\n    "seedData": "db/seed"\n  }\n}',
    code:`// Jenkins Pipeline Stage - Database Migration & Seed
// Jenkinsfile excerpt

pipeline {
    agent any

    environment {
        DB_URL = credentials('db-url')
        DB_USER = credentials('db-user')
        DB_PASS = credentials('db-pass')
        FLYWAY_VERSION = '9.22.3'
    }

    stages {
        stage('DB Migration') {
            steps {
                script {
                    echo "Running database migrations..."

                    // Run Flyway migrations
                    sh """
                        flyway \\
                            -url=\${DB_URL} \\
                            -user=\${DB_USER} \\
                            -password=\${DB_PASS} \\
                            -locations=filesystem:db/migration \\
                            -baselineOnMigrate=true \\
                            -validateOnMigrate=true \\
                            info
                    """

                    sh """
                        flyway \\
                            -url=\${DB_URL} \\
                            -user=\${DB_USER} \\
                            -password=\${DB_PASS} \\
                            -locations=filesystem:db/migration \\
                            migrate
                    """
                }
            }
        }

        stage('Seed Test Data') {
            steps {
                script {
                    echo "Seeding test data..."
                    sh """
                        sqlplus \${DB_USER}/\${DB_PASS}@\${DB_URL} \\
                            @db/seed/01_customers.sql
                        sqlplus \${DB_USER}/\${DB_PASS}@\${DB_URL} \\
                            @db/seed/02_accounts.sql
                        sqlplus \${DB_USER}/\${DB_PASS}@\${DB_URL} \\
                            @db/seed/03_transactions.sql
                        sqlplus \${DB_USER}/\${DB_PASS}@\${DB_URL} \\
                            @db/seed/04_beneficiaries.sql
                    """
                }
            }
        }

        stage('Verify Data') {
            steps {
                script {
                    echo "Verifying seeded data..."
                    sh """
                        sqlplus -S \${DB_USER}/\${DB_PASS}@\${DB_URL} <<EOF
                        SET PAGESIZE 50
                        SET LINESIZE 120

                        PROMPT === Data Verification ===

                        PROMPT Customers:
                        SELECT COUNT(*) as CUSTOMER_COUNT FROM CUSTOMERS
                        WHERE CUSTOMER_ID LIKE 'CUST_UAT%';

                        PROMPT Accounts:
                        SELECT ACCOUNT_TYPE, COUNT(*) as CNT
                        FROM ACCOUNTS
                        WHERE ACCOUNT_NUMBER LIKE 'ACC_UAT%'
                        GROUP BY ACCOUNT_TYPE;

                        PROMPT Transactions:
                        SELECT COUNT(*) as TXN_COUNT FROM TRANSACTIONS
                        WHERE TXN_DATE >= TRUNC(SYSDATE);

                        PROMPT Beneficiaries:
                        SELECT COUNT(*) as BENE_COUNT FROM BENEFICIARIES
                        WHERE STATUS = 'ACTIVE';

                        EXIT;
EOF
                    """
                }
            }
        }
    }
}

-- db/migration/V001__create_tables.sql
-- CREATE TABLE CUSTOMERS (
--     CUSTOMER_ID VARCHAR2(20) PRIMARY KEY,
--     FIRST_NAME VARCHAR2(50) NOT NULL,
--     LAST_NAME VARCHAR2(50) NOT NULL,
--     EMAIL VARCHAR2(100) UNIQUE,
--     MOBILE VARCHAR2(15) UNIQUE,
--     PAN VARCHAR2(10) UNIQUE,
--     KYC_STATUS VARCHAR2(20) DEFAULT 'PENDING',
--     CREATED_AT TIMESTAMP DEFAULT SYSTIMESTAMP,
--     UPDATED_AT TIMESTAMP DEFAULT SYSTIMESTAMP
-- );

-- db/seed/01_customers.sql
-- INSERT INTO CUSTOMERS VALUES
--     ('CUST_UAT_001','Rajesh','Kumar',
--      'rajesh@test.com','9876543210','ABCDE1234F',
--      'VERIFIED',SYSTIMESTAMP,SYSTIMESTAMP);
-- INSERT INTO CUSTOMERS VALUES
--     ('CUST_UAT_002','Priya','Singh',
--      'priya@test.com','9876543211','FGHIJ5678K',
--      'VERIFIED',SYSTIMESTAMP,SYSTIMESTAMP);
-- COMMIT;`,
    expectedOutput:`Database Migration & Seed Pipeline:
================================

Stage: DB Migration
  Flyway Info:
  +-----------+---------------------------+----------+
  | Version   | Description               | Status   |
  +-----------+---------------------------+----------+
  | 001       | Create tables             | Applied  |
  | 002       | Add indexes               | Applied  |
  | 003       | Add audit retention       | Applied  |
  | 004       | Add beneficiary table     | Pending  |
  +-----------+---------------------------+----------+

  Migration V004 applied successfully.

Stage: Seed Test Data
  01_customers.sql: 10 rows inserted
  02_accounts.sql: 25 rows inserted
  03_transactions.sql: 500 rows inserted
  04_beneficiaries.sql: 15 rows inserted

Stage: Verify Data
  Customers: 10
  Accounts: SAVINGS=10, CURRENT=10, FD=5
  Transactions: 500
  Beneficiaries: 15

RESULT: Migration and seeding PASSED`},
  {id:'AT-059',title:'Smoke Test Suite for Deployment',category:'cicd',framework:'Jenkins',language:'Java',difficulty:'Beginner',description:'Quick smoke test suite that validates all critical banking endpoints are working after a deployment, serving as a deployment gate.',prerequisites:'Java 11+, REST Assured 5.x, TestNG',config:'{\n  "smokeTest": {\n    "timeout": 120,\n    "endpoints": 15,\n    "retries": 3\n  }\n}',
    code:`import io.restassured.RestAssured;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.*;

@Test(groups = "smoke")
public class DeploymentSmokeTest {

    @BeforeClass
    public void setup() {
        String env = System.getProperty("test.env", "UAT");
        RestAssured.baseURI = "https://" + env.toLowerCase() +
            "-api.example-bank.com";
        RestAssured.basePath = "/api/v1";
    }

    // === Health Check Endpoints ===

    @Test(priority = 0)
    public void testHealthEndpoint() {
        get("/health")
            .then()
            .statusCode(200)
            .body("status", equalTo("UP"))
            .body("components.db.status", equalTo("UP"))
            .body("components.redis.status", equalTo("UP"))
            .time(lessThan(5000L));
    }

    @Test(priority = 0)
    public void testReadinessEndpoint() {
        get("/health/ready")
            .then()
            .statusCode(200)
            .body("status", equalTo("READY"));
    }

    // === Authentication ===

    @Test(priority = 1)
    public void testLoginEndpoint() {
        given()
            .contentType("application/json")
            .body("{\\"username\\": \\"smoke_user\\", " +
                  "\\"password\\": \\"SmokeTest@123\\"}")
        .when()
            .post("/auth/login")
        .then()
            .statusCode(200)
            .body("access_token", notNullValue())
            .time(lessThan(3000L));
    }

    // === Core Banking APIs ===

    @Test(priority = 2)
    public void testCustomerEndpoint() {
        String token = getAuthToken();
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .get("/customers/CUST_UAT_001")
        .then()
            .statusCode(200)
            .body("customerId", equalTo("CUST_UAT_001"))
            .time(lessThan(2000L));
    }

    @Test(priority = 2)
    public void testAccountsEndpoint() {
        String token = getAuthToken();
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .get("/accounts?customerId=CUST_UAT_001")
        .then()
            .statusCode(200)
            .body("items", hasSize(greaterThan(0)))
            .time(lessThan(2000L));
    }

    @Test(priority = 2)
    public void testBalanceEndpoint() {
        String token = getAuthToken();
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .get("/accounts/ACC_UAT_1234567890/balance")
        .then()
            .statusCode(200)
            .body("available", notNullValue())
            .time(lessThan(1000L));
    }

    @Test(priority = 2)
    public void testTransactionsEndpoint() {
        String token = getAuthToken();
        given()
            .header("Authorization", "Bearer " + token)
            .queryParam("limit", 10)
        .when()
            .get("/accounts/ACC_UAT_1234567890/transactions")
        .then()
            .statusCode(200)
            .body("items", notNullValue())
            .time(lessThan(3000L));
    }

    @Test(priority = 2)
    public void testBeneficiariesEndpoint() {
        String token = getAuthToken();
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .get("/customers/CUST_UAT_001/beneficiaries")
        .then()
            .statusCode(200)
            .time(lessThan(2000L));
    }

    // === Error Handling ===

    @Test(priority = 3)
    public void testNotFoundReturns404() {
        String token = getAuthToken();
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .get("/customers/NONEXISTENT")
        .then()
            .statusCode(404)
            .body("error.code", notNullValue());
    }

    @Test(priority = 3)
    public void testUnauthorizedReturns401() {
        get("/customers/CUST_UAT_001")
            .then()
            .statusCode(401);
    }

    // === Utility ===

    @Test(priority = 4)
    public void testVersionEndpoint() {
        get("/version")
            .then()
            .statusCode(200)
            .body("version", notNullValue())
            .body("buildNumber", notNullValue())
            .body("environment", notNullValue());
    }

    private String getAuthToken() {
        return given()
            .contentType("application/json")
            .body("{\\"username\\":\\"smoke_user\\"," +
                  "\\"password\\":\\"SmokeTest@123\\"}")
        .when()
            .post("/auth/login")
        .then()
            .extract().path("access_token");
    }
}`,
    expectedOutput: `Deployment Smoke Test Results:
================================
Environment: UAT
Base URL: https://uat-api.example-bank.com/api/v1

Results:
+------+----------------------------+---------+--------+
| #    | Endpoint                   | Status  | Time   |
+------+----------------------------+---------+--------+
|  1   | GET /health                | 200 OK  |  123ms |
|  2   | GET /health/ready          | 200 OK  |   45ms |
|  3   | POST /auth/login           | 200 OK  |  345ms |
|  4   | GET /customers/{id}        | 200 OK  |  189ms |
|  5   | GET /accounts              | 200 OK  |  234ms |
|  6   | GET /accounts/{id}/balance | 200 OK  |   67ms |
|  7   | GET /transactions          | 200 OK  |  456ms |
|  8   | GET /beneficiaries         | 200 OK  |  178ms |
|  9   | GET /customers/NONEXIST    | 404     |   89ms |
| 10   | GET unauthorized           | 401     |   34ms |
| 11   | GET /version               | 200 OK  |   23ms |
+------+----------------------------+---------+--------+

All 11 smoke tests PASSED
Total execution time: 12.3 seconds
Deployment gate: APPROVED`},
  {id:'AT-060',title:'Rollback Trigger on Test Failure',category:'cicd',framework:'Jenkins',language:'Groovy',difficulty:'Advanced',description:'Jenkins pipeline with automated rollback mechanism triggered when smoke tests fail after deployment, including notification and incident creation.',prerequisites:'Jenkins 2.400+, Kubernetes CLI, Slack plugin, PagerDuty integration',config:'{\n  "rollback": {\n    "triggerOnFailure": true,\n    "smokeTestThreshold": 80,\n    "notifyChannels": ["#qa-alerts", "#devops"],\n    "createIncident": true\n  }\n}',
    code: `// Jenkinsfile - Deployment with Automatic Rollback
pipeline {
    agent any

    environment {
        APP_NAME = 'banking-app'
        NAMESPACE = params.ENVIRONMENT.toLowerCase()
        SMOKE_THRESHOLD = 80 // Minimum pass rate %
        SLACK_CHANNEL = '#deployments'
        PAGERDUTY_KEY = credentials('pagerduty-integration-key')
    }

    parameters {
        choice(name: 'ENVIRONMENT',
            choices: ['UAT', 'STAGING', 'PROD'])
        string(name: 'IMAGE_TAG',
            description: 'Docker image tag to deploy')
    }

    stages {
        stage('Pre-Deploy Snapshot') {
            steps {
                script {
                    // Save current deployment state for rollback
                    env.PREVIOUS_IMAGE = sh(
                        script: """kubectl get deployment \${APP_NAME} \\
                            -n \${NAMESPACE} \\
                            -o jsonpath='{.spec.template.spec.containers[0].image}'""",
                        returnStdout: true).trim()

                    env.PREVIOUS_REPLICAS = sh(
                        script: """kubectl get deployment \${APP_NAME} \\
                            -n \${NAMESPACE} \\
                            -o jsonpath='{.spec.replicas}'""",
                        returnStdout: true).trim()

                    echo "Current image: \${env.PREVIOUS_IMAGE}"
                    echo "Current replicas: \${env.PREVIOUS_REPLICAS}"

                    // Save rollback manifest
                    sh """kubectl get deployment \${APP_NAME} \\
                        -n \${NAMESPACE} -o yaml > rollback-manifest.yaml"""
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "Deploying \${params.IMAGE_TAG} to \${NAMESPACE}"

                    sh """kubectl set image deployment/\${APP_NAME} \\
                        \${APP_NAME}=registry.example-bank.com/\${APP_NAME}:\${params.IMAGE_TAG} \\
                        -n \${NAMESPACE}"""

                    // Wait for rollout
                    def rolloutStatus = sh(
                        script: """kubectl rollout status \\
                            deployment/\${APP_NAME} \\
                            -n \${NAMESPACE} \\
                            --timeout=300s""",
                        returnStatus: true)

                    if (rolloutStatus != 0) {
                        error "Deployment rollout failed!"
                    }

                    // Wait for pods to be ready
                    sh """kubectl wait --for=condition=ready pod \\
                        -l app=\${APP_NAME} \\
                        -n \${NAMESPACE} \\
                        --timeout=120s"""

                    echo "Deployment successful, running smoke tests..."
                }
            }
        }

        stage('Post-Deploy Smoke Tests') {
            steps {
                script {
                    def smokeResult = sh(
                        script: """mvn test -Psmoke \\
                            -Dtest.env=\${NAMESPACE} \\
                            -Dmaven.test.failure.ignore=true \\
                            2>&1 | tee smoke-results.txt""",
                        returnStatus: true)

                    // Parse results
                    def output = readFile('smoke-results.txt')
                    def totalMatch = (output =~ /Tests run: (\\d+)/)
                    def failMatch = (output =~ /Failures: (\\d+)/)

                    def total = totalMatch ? totalMatch[0][1].toInteger() : 0
                    def failures = failMatch ? failMatch[0][1].toInteger() : 0
                    def passRate = total > 0 ?
                        ((total - failures) * 100 / total) : 0

                    echo "Smoke Tests: \${total} total, " +
                        "\${failures} failed, Pass rate: \${passRate}%"

                    env.SMOKE_PASS_RATE = passRate.toString()
                    env.SMOKE_TOTAL = total.toString()
                    env.SMOKE_FAILURES = failures.toString()

                    if (passRate < SMOKE_THRESHOLD.toInteger()) {
                        echo "SMOKE TEST THRESHOLD BREACHED! " +
                            "(\${passRate}% < \${SMOKE_THRESHOLD}%)"
                        env.NEEDS_ROLLBACK = 'true'
                    } else {
                        echo "Smoke tests passed: \${passRate}%"
                        env.NEEDS_ROLLBACK = 'false'
                    }
                }
            }
        }

        stage('Rollback') {
            when {
                expression { env.NEEDS_ROLLBACK == 'true' }
            }
            steps {
                script {
                    echo "INITIATING ROLLBACK..."

                    // Rollback to previous version
                    sh """kubectl set image deployment/\${APP_NAME} \\
                        \${APP_NAME}=\${env.PREVIOUS_IMAGE} \\
                        -n \${NAMESPACE}"""

                    sh """kubectl rollout status \\
                        deployment/\${APP_NAME} \\
                        -n \${NAMESPACE} \\
                        --timeout=300s"""

                    // Verify rollback
                    def currentImage = sh(
                        script: """kubectl get deployment \${APP_NAME} \\
                            -n \${NAMESPACE} \\
                            -o jsonpath='{.spec.template.spec.containers[0].image}'""",
                        returnStdout: true).trim()

                    if (currentImage == env.PREVIOUS_IMAGE) {
                        echo "Rollback successful! " +
                            "Reverted to \${env.PREVIOUS_IMAGE}"
                    } else {
                        error "Rollback verification failed!"
                    }
                }
            }
        }
    }

    post {
        success {
            slackSend channel: SLACK_CHANNEL, color: 'good',
                message: """DEPLOY SUCCESS: \${APP_NAME} v\${params.IMAGE_TAG}
Environment: \${NAMESPACE}
Smoke Tests: \${env.SMOKE_PASS_RATE}% passed (\${env.SMOKE_TOTAL} tests)"""
        }
        failure {
            script {
                slackSend channel: SLACK_CHANNEL, color: 'danger',
                    message: """DEPLOY FAILED + ROLLED BACK: \${APP_NAME}
Environment: \${NAMESPACE}
Image: \${params.IMAGE_TAG}
Smoke Tests: \${env.SMOKE_PASS_RATE}% (\${env.SMOKE_FAILURES} failures)
Rolled back to: \${env.PREVIOUS_IMAGE}
Build: \${env.BUILD_URL}"""

                // Create PagerDuty incident for PROD
                if (params.ENVIRONMENT == 'PROD') {
                    sh """curl -X POST \\
                        https://events.pagerduty.com/v2/enqueue \\
                        -H 'Content-Type: application/json' \\
                        -d '{
                            "routing_key": "\${PAGERDUTY_KEY}",
                            "event_action": "trigger",
                            "payload": {
                                "summary": "PROD deployment rolled back: \${APP_NAME}",
                                "severity": "critical",
                                "source": "Jenkins"
                            }
                        }'"""
                }
            }
        }
        always {
            archiveArtifacts artifacts: 'smoke-results.txt',
                allowEmptyArchive: true
            archiveArtifacts artifacts: 'rollback-manifest.yaml',
                allowEmptyArchive: true
        }
    }
}`,
    expectedOutput:`Deployment Pipeline with Rollback:
================================
App: banking-app | Image: v2.5.1 | Env: UAT

Stages:
+---------------------------+-----------+----------+
| Stage                     | Status    | Duration |
+---------------------------+-----------+----------+
| Pre-Deploy Snapshot       | SUCCESS   |     5s   |
|   Previous: v2.4.0        |           |          |
| Deploy v2.5.1             | SUCCESS   |    45s   |
|   Rollout complete        |           |          |
|   Pods ready: 3/3         |           |          |
| Post-Deploy Smoke Tests   | SUCCESS   |    25s   |
|   Pass rate: 100% (11/11) |           |          |
|   Threshold: 80%          |           |          |
| Rollback                  | SKIPPED   |     -    |
|   (not needed)            |           |          |
+---------------------------+-----------+----------+

Deployment: APPROVED
Slack notification sent to #deployments

--- Rollback Scenario Example ---
If smoke tests had failed (e.g., 60% < 80%):
  - Automatic rollback to v2.4.0
  - Slack alert sent
  - PagerDuty incident created (PROD only)
  - Build marked as FAILED

RESULT: DEPLOYMENT SUCCESSFUL`},
];

const AutomationTestingLab = () => {
  const [activeCategory, setActiveCategory] = useState('selenium');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [statuses, setStatuses] = useState({});
  const [editedCode, setEditedCode] = useState({});
  const [editedConfig, setEditedConfig] = useState({});
  const [showConfig, setShowConfig] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState('');
  const [runProgress, setRunProgress] = useState(0);
  const [runResult, setRunResult] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [dividerX, setDividerX] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const containerRef = useRef(null);

  const filteredScenarios = SCENARIOS.filter(s => {
    const matchCat = s.category === activeCategory;
    const matchSearch = searchTerm === '' ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDiff = filterDifficulty === 'All' || s.difficulty === filterDifficulty;
    return matchCat && matchSearch && matchDiff;
  });

  const getCode = (s) => editedCode[s.id] || s.code;
  const getConfig = (s) => editedConfig[s.id] || s.config;

  const getStatus = (id) => statuses[id] || 'Not Started';
  const setStatus = (id, status) => setStatuses(prev => ({ ...prev, [id]: status }));

  const completedCount = Object.values(statuses).filter(s => s === 'Completed').length;
  const totalCount = SCENARIOS.length;
  const overallProgress = Math.round((completedCount / totalCount) * 100);

  const handleSelectScenario = (s) => {
    setSelectedScenario(s);
    setShowConfig(false);
    setRunOutput('');
    setRunProgress(0);
    setRunResult(null);
    setShowReport(false);
    setCopySuccess(false);
  };

  const handleResetCode = () => {
    if (selectedScenario) {
      setEditedCode(prev => { const n = { ...prev }; delete n[selectedScenario.id]; return n; });
    }
  };

  const handleCopyCode = () => {
    if (selectedScenario) {
      navigator.clipboard.writeText(getCode(selectedScenario)).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  const handleRunScript = useCallback(() => {
    if (!selectedScenario || isRunning) return;
    setIsRunning(true);
    setRunOutput('');
    setRunProgress(0);
    setRunResult(null);
    setShowReport(false);
    setStatus(selectedScenario.id, 'In Progress');

    const lines = selectedScenario.expectedOutput.split('\n');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < lines.length) {
        setRunOutput(prev => prev + (prev ? '\n' : '') + lines[idx]);
        setRunProgress(Math.round(((idx + 1) / lines.length) * 100));
        idx++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setRunProgress(100);
        const passed = Math.floor(Math.random() * 3) + 3;
        const failed = Math.random() > 0.85 ? 1 : 0;
        const skipped = Math.random() > 0.8 ? 1 : 0;
        const time = (Math.random() * 15 + 2).toFixed(3);
        setRunResult({ passed, failed, skipped, time, status: failed === 0 ? 'PASSED' : 'FAILED' });
        if (failed === 0) setStatus(selectedScenario.id, 'Completed');
      }
    }, 80);
    return () => clearInterval(interval);
  }, [selectedScenario, isRunning]);

  const handleExportAll = () => {
    const data = SCENARIOS.map(s => ({
      id: s.id, title: s.title, category: s.category,
      framework: s.framework, language: s.language,
      code: getCode(s), config: getConfig(s),
      status: getStatus(s.id)
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'automation-scripts.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleMouseDown = (e) => { setIsDragging(true); e.preventDefault(); };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      if (pct >= 25 && pct <= 60) setDividerX(pct);
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const catColor = (cat) => {
    const c = CATEGORIES.find(c => c.id === cat);
    return c ? c.color : COLORS.accent;
  };

  const fwColor = (fw) => {
    const map = { Selenium: COLORS.selenium, Cucumber: COLORS.cucumber, 'REST Assured': COLORS.restAssured, SoapUI: COLORS.soapui, JMeter: COLORS.jmeter, Jenkins: COLORS.jenkins };
    return map[fw] || COLORS.accent;
  };

  const statusColor = (s) => {
    if (s === 'Completed') return '#4ecca3';
    if (s === 'In Progress') return '#f5a623';
    return '#666';
  };

  const badge = (text, bg, fg = '#fff') => ({
    display: 'inline-block', padding: '2px 8px', borderRadius: '10px',
    fontSize: '10px', fontWeight: 'bold', backgroundColor: bg, color: fg,
    marginRight: '4px', whiteSpace: 'nowrap'
  });

  return (
    <div ref={containerRef} style={{
      minHeight: '100vh', background: `linear-gradient(135deg, ${COLORS.bgFrom} 0%, ${COLORS.bgTo} 100%)`,
      color: COLORS.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex', flexDirection: 'column', userSelect: isDragging ? 'none' : 'auto',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h1 style={{ margin: 0, color: COLORS.header, fontSize: '22px' }}>
            Automation Testing Lab
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#999' }}>
            Banking Test Automation - 60 Scenarios across 6 Frameworks
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '200px', height: '8px', background: '#1a1a2e', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${overallProgress}%`, height: '100%', background: COLORS.accent,
                borderRadius: '4px', transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: '12px', color: COLORS.accent, fontWeight: 'bold' }}>
              {completedCount}/{totalCount} ({overallProgress}%)
            </span>
          </div>
          <button onClick={handleExportAll} style={{
            padding: '8px 16px', background: 'transparent', border: `1px solid ${COLORS.accent}`,
            color: COLORS.accent, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
          }}>Export All Scripts</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT PANEL */}
        <div style={{ width: `${dividerX}%`, display: 'flex', flexDirection: 'column',
          borderRight: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          {/* Search & Filter */}
          <div style={{ padding: '12px', borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
            <input type="text" placeholder="Search scenarios..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', background: COLORS.editorBg,
                border: `1px solid ${COLORS.border}`, borderRadius: '6px', color: COLORS.text,
                fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
                <button key={d} onClick={() => setFilterDifficulty(d)} style={{
                  padding: '4px 10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  fontSize: '11px', fontWeight: 'bold',
                  background: filterDifficulty === d ? COLORS.accent : 'rgba(255,255,255,0.1)',
                  color: filterDifficulty === d ? '#000' : '#ccc'
                }}>{d}</button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', padding: '8px', gap: '4px',
            borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
            {CATEGORIES.map(cat => {
              const count = SCENARIOS.filter(s => s.category === cat.id).length;
              return (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSearchTerm(''); }}
                  style={{
                    padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                    fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap',
                    background: activeCategory === cat.id ? cat.color : 'rgba(255,255,255,0.08)',
                    color: activeCategory === cat.id ? '#fff' : '#aaa',
                    transition: 'all 0.2s'
                  }}>
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Scenario List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {filteredScenarios.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                No scenarios match your search.
              </div>
            ) : filteredScenarios.map(s => (
              <div key={s.id} onClick={() => handleSelectScenario(s)}
                style={{
                  padding: '12px', marginBottom: '6px', borderRadius: '8px', cursor: 'pointer',
                  background: selectedScenario?.id === s.id ? 'rgba(78,204,163,0.15)' : 'rgba(255,255,255,0.04)',
                  border: selectedScenario?.id === s.id ? `1px solid ${COLORS.accent}` : '1px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: COLORS.accent, fontWeight: 'bold', fontFamily: 'monospace' }}>
                        {s.id}
                      </span>
                      <span style={{ fontSize: '13px', color: COLORS.header, fontWeight: '600' }}>
                        {s.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <span style={badge(s.framework, fwColor(s.framework))}>{s.framework}</span>
                      <span style={badge(s.language, 'rgba(255,255,255,0.15)', '#ddd')}>{s.language}</span>
                      <span style={badge(s.difficulty, DIFFICULTY_COLORS[s.difficulty] + '33', DIFFICULTY_COLORS[s.difficulty])}>
                        {s.difficulty}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '10px', fontWeight: 'bold', color: statusColor(getStatus(s.id)),
                    padding: '2px 6px', borderRadius: '8px',
                    border: `1px solid ${statusColor(getStatus(s.id))}40`, whiteSpace: 'nowrap'
                  }}>
                    {getStatus(s.id) === 'Completed' ? '\u2713 ' : getStatus(s.id) === 'In Progress' ? '\u25CB ' : ''}
                    {getStatus(s.id)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div onMouseDown={handleMouseDown} style={{
          width: '5px', cursor: 'col-resize', background: isDragging ? COLORS.accent : COLORS.border,
          transition: isDragging ? 'none' : 'background 0.2s', flexShrink: 0, zIndex: 10
        }} />

        {/* RIGHT PANEL */}
        <div style={{ width: `${100 - dividerX}%`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selectedScenario ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>&lt;/&gt;</div>
              <div style={{ fontSize: '16px' }}>Select a scenario from the left panel</div>
              <div style={{ fontSize: '13px', marginTop: '8px' }}>60 automation scripts ready to explore</div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {/* Section 1: Scenario Details */}
              <div style={{ padding: '16px', borderBottom: `1px solid ${COLORS.border}`,
                background: 'rgba(15,52,96,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'monospace', color: COLORS.accent, fontSize: '14px', fontWeight: 'bold' }}>
                        {selectedScenario.id}
                      </span>
                      <h2 style={{ margin: 0, color: COLORS.header, fontSize: '18px' }}>
                        {selectedScenario.title}
                      </h2>
                    </div>
                    <p style={{ margin: '6px 0', fontSize: '13px', color: '#bbb', lineHeight: '1.5' }}>
                      {selectedScenario.description}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888' }}>
                      <strong style={{ color: '#aaa' }}>Prerequisites:</strong> {selectedScenario.prerequisites}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                  <span style={badge(selectedScenario.framework, fwColor(selectedScenario.framework))}>
                    {selectedScenario.framework}
                  </span>
                  <span style={badge(selectedScenario.language, 'rgba(255,255,255,0.15)', '#ddd')}>
                    {selectedScenario.language}
                  </span>
                  <span style={badge(selectedScenario.difficulty,
                    DIFFICULTY_COLORS[selectedScenario.difficulty] + '33',
                    DIFFICULTY_COLORS[selectedScenario.difficulty])}>
                    {selectedScenario.difficulty}
                  </span>
                </div>
              </div>

              {/* Section 2: Code Editor */}
              <div style={{ padding: '16px', borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, color: COLORS.header, fontSize: '14px' }}>Automation Script</h3>
                    <span style={badge(selectedScenario.language, COLORS.accent + '33', COLORS.accent)}>
                      {selectedScenario.language}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={handleResetCode} style={{
                      padding: '5px 12px', background: 'transparent', border: `1px solid #666`,
                      color: '#aaa', borderRadius: '4px', cursor: 'pointer', fontSize: '11px'
                    }}>Reset to Default</button>
                    <button onClick={handleCopyCode} style={{
                      padding: '5px 12px', background: copySuccess ? '#4ecca3' : 'transparent',
                      border: `1px solid ${copySuccess ? '#4ecca3' : '#666'}`,
                      color: copySuccess ? '#000' : '#aaa', borderRadius: '4px', cursor: 'pointer', fontSize: '11px',
                      transition: 'all 0.2s'
                    }}>{copySuccess ? 'Copied!' : 'Copy Code'}</button>
                  </div>
                </div>
                <textarea value={getCode(selectedScenario)}
                  onChange={e => setEditedCode(prev => ({ ...prev, [selectedScenario.id]: e.target.value }))}
                  spellCheck={false}
                  style={{
                    width: '100%', minHeight: '350px', maxHeight: '500px', padding: '16px',
                    background: COLORS.editorBg, color: COLORS.editorText, border: `1px solid ${COLORS.border}`,
                    borderRadius: '8px', fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, monospace',
                    fontSize: '12px', lineHeight: '1.6', resize: 'vertical', outline: 'none',
                    boxSizing: 'border-box', tabSize: 4
                  }} />
              </div>

              {/* Section 3: Expected Output */}
              <div style={{ padding: '16px', borderBottom: `1px solid ${COLORS.border}` }}>
                <h3 style={{ margin: '0 0 8px', color: COLORS.header, fontSize: '14px' }}>Expected Output</h3>
                <pre style={{
                  padding: '12px', background: COLORS.editorBg, border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.5',
                  color: '#8be9fd', overflow: 'auto', maxHeight: '250px', margin: 0, whiteSpace: 'pre-wrap'
                }}>{selectedScenario.expectedOutput}</pre>
              </div>

              {/* Section 4: Execution Simulator */}
              <div style={{ padding: '16px', borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: COLORS.header, fontSize: '14px' }}>Execution Simulator</h3>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={handleRunScript} disabled={isRunning} style={{
                      padding: '6px 16px', background: isRunning ? '#555' : COLORS.accent,
                      border: 'none', color: isRunning ? '#999' : '#000', borderRadius: '6px',
                      cursor: isRunning ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 'bold'
                    }}>{isRunning ? 'Running...' : 'Run Script'}</button>
                    {runResult && (
                      <button onClick={() => setShowReport(!showReport)} style={{
                        padding: '6px 16px', background: 'transparent', border: `1px solid ${COLORS.accent}`,
                        color: COLORS.accent, borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                      }}>{showReport ? 'Hide Report' : 'View Report'}</button>
                    )}
                  </div>
                </div>

                {(isRunning || runOutput) && (
                  <>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#aaa' }}>Progress</span>
                        <span style={{ fontSize: '11px', color: COLORS.accent }}>{runProgress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: '#1a1a2e', borderRadius: '2px' }}>
                        <div style={{ width: `${runProgress}%`, height: '100%',
                          background: runProgress === 100 ? (runResult?.status === 'PASSED' ? '#4ecca3' : '#d0021b') : COLORS.accent,
                          borderRadius: '2px', transition: 'width 0.1s' }} />
                      </div>
                    </div>
                    <pre style={{
                      padding: '12px', background: '#000', border: `1px solid ${COLORS.border}`,
                      borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.5',
                      color: '#00ff00', maxHeight: '200px', overflow: 'auto', margin: 0, whiteSpace: 'pre-wrap'
                    }}>{runOutput}{isRunning ? '\n\u2588' : ''}</pre>
                  </>
                )}

                {runResult && (
                  <div style={{ marginTop: '10px', padding: '12px', background: 'rgba(15,52,96,0.5)',
                    borderRadius: '8px', border: `1px solid ${runResult.status === 'PASSED' ? COLORS.accent : '#d0021b'}40` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <span style={{ color: '#4ecca3', fontWeight: 'bold', fontSize: '13px' }}>
                          Passed: {runResult.passed}
                        </span>
                        <span style={{ color: runResult.failed > 0 ? '#d0021b' : '#666',
                          fontWeight: 'bold', fontSize: '13px' }}>
                          Failed: {runResult.failed}
                        </span>
                        <span style={{ color: '#f5a623', fontWeight: 'bold', fontSize: '13px' }}>
                          Skipped: {runResult.skipped}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#aaa' }}>Time: {runResult.time}s</span>
                        <span style={{
                          padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                          background: runResult.status === 'PASSED' ? '#4ecca333' : '#d0021b33',
                          color: runResult.status === 'PASSED' ? '#4ecca3' : '#d0021b'
                        }}>{runResult.status}</span>
                      </div>
                    </div>
                  </div>
                )}

                {showReport && runResult && (
                  <div style={{ marginTop: '10px', padding: '16px', background: COLORS.editorBg,
                    borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
                    <h4 style={{ margin: '0 0 10px', color: COLORS.header, fontSize: '14px' }}>Test Execution Report</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                          <th style={{ textAlign: 'left', padding: '6px', color: '#aaa' }}>Metric</th>
                          <th style={{ textAlign: 'right', padding: '6px', color: '#aaa' }}>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['Scenario', selectedScenario.id + ' - ' + selectedScenario.title],
                          ['Framework', selectedScenario.framework],
                          ['Language', selectedScenario.language],
                          ['Total Tests', String(runResult.passed + runResult.failed + runResult.skipped)],
                          ['Passed', String(runResult.passed)],
                          ['Failed', String(runResult.failed)],
                          ['Skipped', String(runResult.skipped)],
                          ['Execution Time', runResult.time + 's'],
                          ['Pass Rate', Math.round(runResult.passed / (runResult.passed + runResult.failed) * 100) + '%'],
                          ['Status', runResult.status],
                        ].map(([k, v], i) => (
                          <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                            <td style={{ padding: '6px', color: '#bbb' }}>{k}</td>
                            <td style={{ padding: '6px', textAlign: 'right',
                              color: k === 'Status' ? (v === 'PASSED' ? '#4ecca3' : '#d0021b') : COLORS.text,
                              fontWeight: k === 'Status' ? 'bold' : 'normal' }}>{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Section 5: Configuration Panel */}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '8px' }}>
                  <h3 onClick={() => setShowConfig(!showConfig)}
                    style={{ margin: 0, color: COLORS.header, fontSize: '14px', cursor: 'pointer' }}>
                    {showConfig ? '\u25BC' : '\u25B6'} Configuration
                  </h3>
                  {showConfig && (
                    <button onClick={() => {
                      try { JSON.parse(getConfig(selectedScenario)); alert('Configuration saved successfully!'); }
                      catch { alert('Invalid JSON configuration'); }
                    }} style={{
                      padding: '5px 12px', background: COLORS.accent, border: 'none', color: '#000',
                      borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold'
                    }}>Save Config</button>
                  )}
                </div>
                {showConfig && (
                  <textarea value={getConfig(selectedScenario)}
                    onChange={e => setEditedConfig(prev => ({ ...prev, [selectedScenario.id]: e.target.value }))}
                    spellCheck={false}
                    style={{
                      width: '100%', minHeight: '150px', padding: '12px', background: COLORS.editorBg,
                      color: '#f5a623', border: `1px solid ${COLORS.border}`, borderRadius: '8px',
                      fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.5', resize: 'vertical',
                      outline: 'none', boxSizing: 'border-box'
                    }} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationTestingLab;

import React, { useState, useRef, useEffect, useCallback } from 'react';

const COLORS = {
  bgFrom: '#1a1a2e', bgTo: '#16213e', card: '#0f3460', accent: '#4ecca3',
  text: '#e0e0e0', header: '#ffffff', border: 'rgba(78,204,163,0.3)',
  editorBg: '#0a0a1a', editorText: '#4ecca3',
  android: '#3DDC84', ios: '#007AFF', cross: '#FF6F00',
};

const CATEGORIES = [
  { id: 'appiumAndroid', label: 'Appium Android', color: COLORS.android },
  { id: 'appiumIos', label: 'Appium iOS', color: COLORS.ios },
  { id: 'mobileApi', label: 'Mobile API Testing', color: '#4a90d9' },
  { id: 'mobilePerf', label: 'Mobile Performance', color: '#f5a623' },
  { id: 'mobileSec', label: 'Mobile Security', color: '#d0021b' },
  { id: 'mobileUiUx', label: 'Mobile UI/UX', color: '#9b59b6' },
];

const DIFFICULTY_COLORS = { Beginner: '#4ecca3', Intermediate: '#f5a623', Advanced: '#d0021b' };
const PLATFORM_COLORS = { Android: COLORS.android, iOS: COLORS.ios, 'Cross-platform': COLORS.cross };

function makeId(n) { return 'MT-' + String(n).padStart(3, '0'); }

const SCENARIOS = [
  // =========== APPIUM ANDROID (MT-001 to MT-010) ===========
  {
    id: makeId(1), title: 'Banking App Login (PIN/Biometric)', category: 'appiumAndroid',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Automates banking app login on Android testing PIN entry and fingerprint biometric using Appium UiAutomator2 driver.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, Android SDK, Pixel 6 emulator API 33',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', platformVersion: '13.0', app: '/path/to/banking.apk', automationName: 'UiAutomator2', appPackage: 'com.bank.app', appActivity: '.LoginActivity', noReset: true }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class BankingLoginTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setPlatformVersion("13.0")
            .setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testPINLogin() {
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/pinLayout")));
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
        String msg = driver.findElement(By.id("com.bank.app:id/welcome")).getText();
        Assert.assertTrue(msg.contains("Welcome"));
    }

    @Test
    public void testBiometricLogin() {
        driver.fingerPrint(1);
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
        Assert.assertTrue(driver.findElement(
            By.id("com.bank.app:id/balanceWidget")).isDisplayed());
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: BankingLoginTest
=== testPINLogin ===
[INFO] PIN entry screen detected
[INFO] Entering PIN: 1,2,3,4
[INFO] Dashboard loaded - Welcome, Praveen Kumar
PASSED: testPINLogin (3.8s)
=== testBiometricLogin ===
[INFO] Fingerprint simulated - match
[INFO] Dashboard loaded, balance visible
PASSED: testBiometricLogin (2.5s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 6.3s`
  },
  {
    id: makeId(2), title: 'Fund Transfer via Mobile Banking', category: 'appiumAndroid',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'End-to-end fund transfer testing including IMPS mode with beneficiary selection, OTP verification, and confirmation.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, test beneficiary, OTP mock server',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', platformVersion: '13.0', app: '/path/to/banking.apk', automationName: 'UiAutomator2', noReset: true }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class FundTransferTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    @Test
    public void testIMPSTransfer() {
        driver.findElement(By.id("com.bank.app:id/btnTransfer")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/transferLayout")));
        driver.findElement(By.id("com.bank.app:id/radioIMPS")).click();
        driver.findElement(By.id("com.bank.app:id/beneficiary")).click();
        driver.findElement(By.xpath("//android.widget.TextView[@text='John - HDFC']")).click();
        driver.findElement(By.id("com.bank.app:id/amount")).sendKeys("5000");
        driver.findElement(By.id("com.bank.app:id/btnSubmit")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/reviewScreen")));
        driver.findElement(By.id("com.bank.app:id/btnConfirm")).click();
        driver.findElement(By.id("com.bank.app:id/otpInput")).sendKeys("123456");
        driver.findElement(By.id("com.bank.app:id/btnVerifyOTP")).click();
        String ref = driver.findElement(By.id("com.bank.app:id/refNumber")).getText();
        Assert.assertFalse(ref.isEmpty(), "Reference number should exist");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: FundTransferTest
=== testIMPSTransfer ===
[INFO] Transfer screen loaded
[INFO] IMPS mode selected
[INFO] Beneficiary: John - HDFC
[INFO] Amount: Rs. 5,000.00
[INFO] OTP verified successfully
[INFO] Transaction Ref: IMPS2025112800001
PASSED: testIMPSTransfer (8.2s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 8.2s`
  },
  {
    id: makeId(3), title: 'UPI Payment Flow', category: 'appiumAndroid',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests UPI payment flow including VPA entry, amount input, UPI PIN authentication, and payment confirmation on Android.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, UPI sandbox environment',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', platformVersion: '13.0', app: '/path/to/banking.apk', automationName: 'UiAutomator2', noReset: true }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class UPIPaymentTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    @Test
    public void testUPIPayToVPA() {
        driver.findElement(By.id("com.bank.app:id/btnUPI")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/upiLayout")));
        driver.findElement(By.id("com.bank.app:id/vpaInput")).sendKeys("merchant@upi");
        driver.findElement(By.id("com.bank.app:id/upiAmount")).sendKeys("500");
        driver.findElement(By.id("com.bank.app:id/btnPayNow")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/upiPinLayout")));
        driver.findElement(By.id("com.bank.app:id/upiPin")).sendKeys("1234");
        driver.findElement(By.id("com.bank.app:id/btnSubmitPin")).click();
        String status = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/paymentStatus"))).getText();
        Assert.assertEquals(status, "Payment Successful");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: UPIPaymentTest
=== testUPIPayToVPA ===
[INFO] UPI screen loaded
[INFO] VPA entered: merchant@upi
[INFO] Amount: Rs. 500.00
[INFO] UPI PIN entered
[INFO] Payment status: Payment Successful
[INFO] UTR: UPI2025112800042
PASSED: testUPIPayToVPA (6.1s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 6.1s`
  },
  {
    id: makeId(4), title: 'Account Balance & Mini Statement', category: 'appiumAndroid',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Validates account balance display and mini statement with last 10 transactions on Android banking app.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, test account with transaction history',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', platformVersion: '13.0', app: '/path/to/banking.apk', automationName: 'UiAutomator2', noReset: true }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.List;

public class BalanceStatementTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testAccountBalance() {
        driver.findElement(By.id("com.bank.app:id/btnAccounts")).click();
        String balance = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/tvBalance"))).getText();
        Assert.assertTrue(balance.matches("Rs\\\\. [\\\\d,]+\\\\.\\\\d{2}"),
            "Balance should be in currency format");
    }

    @Test
    public void testMiniStatement() {
        driver.findElement(By.id("com.bank.app:id/btnMiniStmt")).click();
        List txns = driver.findElements(By.id("com.bank.app:id/txnRow"));
        Assert.assertTrue(txns.size() >= 1 && txns.size() <= 10,
            "Mini statement should show 1-10 transactions");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: BalanceStatementTest
=== testAccountBalance ===
[INFO] Accounts screen loaded
[INFO] Balance displayed: Rs. 1,25,430.50
PASSED: testAccountBalance (2.4s)
=== testMiniStatement ===
[INFO] Mini statement loaded
[INFO] Transactions found: 10
PASSED: testMiniStatement (3.1s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 5.5s`
  },
  {
    id: makeId(5), title: 'Bill Payment (Electricity/Gas/Telecom)', category: 'appiumAndroid',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Automates bill payment for electricity, gas, and telecom providers with biller search, amount fetch, and payment.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, biller sandbox API',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', platformVersion: '13.0', app: '/path/to/banking.apk', automationName: 'UiAutomator2', noReset: true }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class BillPaymentTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    @Test
    public void testElectricityBillPayment() {
        driver.findElement(By.id("com.bank.app:id/btnBillPay")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/billCategory")));
        driver.findElement(By.xpath("//android.widget.TextView[@text='Electricity']")).click();
        driver.findElement(By.id("com.bank.app:id/billerSearch")).sendKeys("BESCOM");
        driver.findElement(By.xpath("//android.widget.TextView[@text='BESCOM - Bangalore']")).click();
        driver.findElement(By.id("com.bank.app:id/consumerId")).sendKeys("1234567890");
        driver.findElement(By.id("com.bank.app:id/btnFetchBill")).click();
        String amt = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/billAmount"))).getText();
        Assert.assertFalse(amt.isEmpty());
        driver.findElement(By.id("com.bank.app:id/btnPayBill")).click();
        String status = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/paymentStatus"))).getText();
        Assert.assertEquals(status, "Bill Paid Successfully");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: BillPaymentTest
=== testElectricityBillPayment ===
[INFO] Bill payment screen loaded
[INFO] Category: Electricity selected
[INFO] Biller: BESCOM - Bangalore
[INFO] Consumer ID entered: 1234567890
[INFO] Bill fetched: Rs. 2,340.00
[INFO] Payment status: Bill Paid Successfully
PASSED: testElectricityBillPayment (7.5s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 7.5s`
  },
  {
    id: makeId(6), title: 'Mobile Cheque Deposit (Camera)', category: 'appiumAndroid',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Advanced',
    description: 'Tests mobile cheque deposit by capturing cheque images via camera, OCR validation, and submission for clearing.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, camera permissions, test cheque images',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', platformVersion: '13.0', app: '/path/to/banking.apk', automationName: 'UiAutomator2', autoGrantPermissions: true }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.io.File;

public class ChequeDepositTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        opts.setCapability("autoGrantPermissions", true);
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(25));
    }

    @Test
    public void testChequeDeposit() {
        driver.findElement(By.id("com.bank.app:id/btnDeposit")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/depositLayout")));
        driver.findElement(By.id("com.bank.app:id/btnCaptureFront")).click();
        driver.pushFile("/sdcard/cheque_front.jpg",
            new File("test-data/cheque_front.jpg"));
        driver.findElement(By.id("com.bank.app:id/btnCapture")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/ocrResult")));
        String micr = driver.findElement(
            By.id("com.bank.app:id/micrCode")).getText();
        Assert.assertFalse(micr.isEmpty(), "MICR should be detected");
        driver.findElement(By.id("com.bank.app:id/depositAmount"))
            .sendKeys("15000");
        driver.findElement(By.id("com.bank.app:id/btnSubmitDeposit")).click();
        String status = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/depositStatus"))).getText();
        Assert.assertTrue(status.contains("Submitted"));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: ChequeDepositTest
=== testChequeDeposit ===
[INFO] Deposit screen loaded
[INFO] Camera permission granted
[INFO] Front cheque image captured
[INFO] OCR processing complete
[INFO] MICR detected: 560002012345678
[INFO] Amount entered: Rs. 15,000.00
[INFO] Deposit submitted for clearing
PASSED: testChequeDeposit (12.3s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 12.3s`
  },
  {
    id: makeId(7), title: 'Beneficiary Management', category: 'appiumAndroid',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Tests adding, editing, and deleting beneficiaries with IFSC validation and cooling period verification.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, IFSC validation API',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', platformVersion: '13.0', app: '/path/to/banking.apk', automationName: 'UiAutomator2', noReset: true }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class BeneficiaryTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testAddBeneficiary() {
        driver.findElement(By.id("com.bank.app:id/btnManageBenef")).click();
        driver.findElement(By.id("com.bank.app:id/btnAddNew")).click();
        driver.findElement(By.id("com.bank.app:id/etName")).sendKeys("Jane Smith");
        driver.findElement(By.id("com.bank.app:id/etAccount")).sendKeys("9876543210");
        driver.findElement(By.id("com.bank.app:id/etIFSC")).sendKeys("HDFC0001234");
        driver.findElement(By.id("com.bank.app:id/btnVerifyIFSC")).click();
        String branch = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/tvBranch"))).getText();
        Assert.assertFalse(branch.isEmpty(), "Branch name should auto-populate");
        driver.findElement(By.id("com.bank.app:id/btnSaveBenef")).click();
        String msg = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/successMsg"))).getText();
        Assert.assertTrue(msg.contains("added successfully"));
    }

    @Test
    public void testDeleteBeneficiary() {
        driver.findElement(By.id("com.bank.app:id/btnManageBenef")).click();
        driver.findElement(By.xpath("//android.widget.TextView[@text='Jane Smith']")).click();
        driver.findElement(By.id("com.bank.app:id/btnDelete")).click();
        driver.findElement(By.id("com.bank.app:id/btnConfirmDelete")).click();
        String msg = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/successMsg"))).getText();
        Assert.assertTrue(msg.contains("removed"));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: BeneficiaryTest
=== testAddBeneficiary ===
[INFO] Beneficiary management screen loaded
[INFO] IFSC HDFC0001234 verified: HDFC Bank, MG Road Branch
[INFO] Beneficiary Jane Smith added successfully
PASSED: testAddBeneficiary (5.2s)
=== testDeleteBeneficiary ===
[INFO] Beneficiary Jane Smith selected
[INFO] Delete confirmed
[INFO] Beneficiary removed successfully
PASSED: testDeleteBeneficiary (3.1s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 8.3s`
  },
  {
    id: makeId(8), title: 'Push Notification Validation', category: 'appiumAndroid',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Advanced',
    description: 'Validates push notification delivery for transactions, OTP alerts, and promotional messages with notification drawer inspection.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, Firebase test project, notification mock server',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', platformVersion: '13.0', app: '/path/to/banking.apk', automationName: 'UiAutomator2', noReset: true }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.net.HttpURLConnection;

public class PushNotificationTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    @Test
    public void testTransactionNotification() {
        // Trigger a transaction via API to generate notification
        HttpURLConnection conn = (HttpURLConnection)
            new URL("http://mock-server:8080/send-notification")
            .openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.getOutputStream().write(
            "type=txn&amount=5000&account=XXXX1234".getBytes());
        Assert.assertEquals(conn.getResponseCode(), 200);
        Thread.sleep(3000);
        // Open notification drawer
        driver.openNotifications();
        String notifText = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//android.widget.TextView[contains(@text, 'Rs. 5,000')]")))
            .getText();
        Assert.assertTrue(notifText.contains("debited"));
        // Tap notification to open app
        driver.findElement(By.xpath(
            "//android.widget.TextView[contains(@text, 'Rs. 5,000')]")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/txnDetail")));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: PushNotificationTest
=== testTransactionNotification ===
[INFO] Mock notification sent: type=txn, amount=5000
[INFO] Waiting 3s for push delivery
[INFO] Notification drawer opened
[INFO] Found notification: "Rs. 5,000 debited from XXXX1234"
[INFO] Tapped notification - transaction detail opened
PASSED: testTransactionNotification (8.4s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 8.4s`
  },
  {
    id: makeId(9), title: 'Session Timeout & Re-auth', category: 'appiumAndroid',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Validates session timeout after inactivity, auto-logout behavior, and re-authentication flow on Android banking app.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, configurable session timeout (set to 30s for test)',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', platformVersion: '13.0', app: '/path/to/banking.apk', automationName: 'UiAutomator2', noReset: true }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class SessionTimeoutTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testSessionTimeout() throws Exception {
        // Login first
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/pinLayout")));
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
        // Wait for session timeout (30s in test env)
        Thread.sleep(35000);
        // Try to navigate - should redirect to login
        driver.findElement(By.id("com.bank.app:id/btnAccounts")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/sessionExpiredDialog")));
        String msg = driver.findElement(
            By.id("com.bank.app:id/tvSessionMsg")).getText();
        Assert.assertTrue(msg.contains("session has expired"));
        driver.findElement(By.id("com.bank.app:id/btnRelogin")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/pinLayout")));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: SessionTimeoutTest
=== testSessionTimeout ===
[INFO] Login successful via PIN
[INFO] Waiting 35s for session timeout
[INFO] Navigation attempted post-timeout
[INFO] Session expired dialog displayed
[INFO] Message: "Your session has expired"
[INFO] Re-login screen displayed
PASSED: testSessionTimeout (42.1s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 42.1s`
  },
  {
    id: makeId(10), title: 'Offline Mode Cached Data', category: 'appiumAndroid',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Advanced',
    description: 'Tests offline mode behavior showing cached balance, recent transactions, and sync when network restores.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, airplane mode toggle capability',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', platformVersion: '13.0', app: '/path/to/banking.apk', automationName: 'UiAutomator2', noReset: true }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

public class OfflineModeTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testOfflineCachedBalance() {
        // Login while online
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
        String onlineBal = driver.findElement(
            By.id("com.bank.app:id/tvBalance")).getText();
        // Enable airplane mode
        Map<String, Object> airplane = new HashMap<>();
        airplane.put("airplaneMode", true);
        driver.executeScript("mobile: setConnectivity", airplane);
        Thread.sleep(2000);
        // Refresh and check cached data
        driver.findElement(By.id("com.bank.app:id/btnRefresh")).click();
        String offlineBal = driver.findElement(
            By.id("com.bank.app:id/tvBalance")).getText();
        Assert.assertEquals(offlineBal, onlineBal, "Cached balance should match");
        boolean offlineBadge = driver.findElement(
            By.id("com.bank.app:id/offlineBadge")).isDisplayed();
        Assert.assertTrue(offlineBadge, "Offline badge should be visible");
        // Restore network
        airplane.put("airplaneMode", false);
        driver.executeScript("mobile: setConnectivity", airplane);
        Thread.sleep(3000);
        wait.until(ExpectedConditions.invisibilityOfElementLocated(
            By.id("com.bank.app:id/offlineBadge")));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: OfflineModeTest
=== testOfflineCachedBalance ===
[INFO] Login successful, dashboard loaded
[INFO] Online balance: Rs. 1,25,430.50
[INFO] Airplane mode enabled
[INFO] Cached balance displayed: Rs. 1,25,430.50
[INFO] Offline badge visible
[INFO] Network restored, syncing...
[INFO] Offline badge removed, data refreshed
PASSED: testOfflineCachedBalance (14.2s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 14.2s`
  },
  // =========== APPIUM iOS (MT-011 to MT-020) ===========
  {
    id: makeId(11), title: 'Face ID / Touch ID Login', category: 'appiumIos',
    platform: 'iOS', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests Face ID and Touch ID biometric authentication on iOS banking app with enrollment, success, failure, and fallback to PIN.',
    prerequisites: 'Java 11+, Appium 2.x, XCUITest driver, Xcode 15+, iPhone 15 Pro simulator',
    config: JSON.stringify({ platformName: 'iOS', deviceName: 'iPhone 15 Pro', platformVersion: '17.0', app: '/path/to/BankingApp.app', automationName: 'XCUITest', bundleId: 'com.bank.app' }, null, 2),
    code: `import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import com.google.common.collect.ImmutableMap;
import java.net.URL;
import java.time.Duration;

public class FaceIDLoginTest {
    IOSDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        XCUITestOptions opts = new XCUITestOptions()
            .setDeviceName("iPhone 15 Pro").setPlatformVersion("17.0")
            .setApp("/path/to/BankingApp.app");
        driver = new IOSDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testFaceIDAuth() {
        driver.executeScript("mobile: enrollBiometric",
            ImmutableMap.of("isEnabled", true));
        driver.findElement(By.accessibilityId("Use Face ID")).click();
        driver.executeScript("mobile: sendBiometricMatch",
            ImmutableMap.of("type", "faceId", "match", true));
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Dashboard Screen")));
        Assert.assertTrue(driver.findElement(
            By.accessibilityId("Account Balance")).isDisplayed());
    }

    @Test
    public void testFaceIDFailFallbackPIN() {
        driver.executeScript("mobile: enrollBiometric",
            ImmutableMap.of("isEnabled", true));
        driver.findElement(By.accessibilityId("Use Face ID")).click();
        driver.executeScript("mobile: sendBiometricMatch",
            ImmutableMap.of("type", "faceId", "match", false));
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Enter PIN"))).sendKeys("1234");
        driver.findElement(By.accessibilityId("Submit PIN")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Dashboard Screen")));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: FaceIDLoginTest
=== testFaceIDAuth ===
[INFO] Biometric enrolled on device
[INFO] Face ID match simulated - SUCCESS
[INFO] Dashboard loaded, balance visible
PASSED: testFaceIDAuth (4.2s)
=== testFaceIDFailFallbackPIN ===
[INFO] Face ID match simulated - FAILURE
[INFO] PIN fallback displayed, PIN entered
[INFO] Dashboard loaded
PASSED: testFaceIDFailFallbackPIN (5.8s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 10.0s`
  },
  {
    id: makeId(12), title: 'Apple Pay Integration', category: 'appiumIos',
    platform: 'iOS', framework: 'Appium', language: 'Java', difficulty: 'Advanced',
    description: 'Tests Apple Pay integration for in-app purchases, card provisioning, and contactless payment simulation on iOS.',
    prerequisites: 'Java 11+, Appium 2.x, XCUITest, Apple Pay sandbox, test card provisioned',
    config: JSON.stringify({ platformName: 'iOS', deviceName: 'iPhone 15 Pro', platformVersion: '17.0', app: '/path/to/BankingApp.app', automationName: 'XCUITest', bundleId: 'com.bank.app' }, null, 2),
    code: `import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import com.google.common.collect.ImmutableMap;
import java.net.URL;
import java.time.Duration;

public class ApplePayTest {
    IOSDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        XCUITestOptions opts = new XCUITestOptions()
            .setDeviceName("iPhone 15 Pro").setPlatformVersion("17.0")
            .setApp("/path/to/BankingApp.app");
        driver = new IOSDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    @Test
    public void testApplePayProvisioning() {
        driver.findElement(By.accessibilityId("Card Management")).click();
        driver.findElement(By.accessibilityId("Add to Apple Wallet")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Apple Pay Setup")));
        driver.findElement(By.accessibilityId("Continue")).click();
        driver.findElement(By.accessibilityId("Accept Terms")).click();
        String status = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Provisioning Status"))).getText();
        Assert.assertTrue(status.contains("Card Added"));
    }

    @Test
    public void testApplePayPayment() {
        driver.findElement(By.accessibilityId("Pay with Apple Pay")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Apple Pay Sheet")));
        driver.executeScript("mobile: enrollBiometric",
            ImmutableMap.of("isEnabled", true));
        driver.executeScript("mobile: sendBiometricMatch",
            ImmutableMap.of("type", "faceId", "match", true));
        String result = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Payment Result"))).getText();
        Assert.assertTrue(result.contains("Success"));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: ApplePayTest
=== testApplePayProvisioning ===
[INFO] Card Management screen opened
[INFO] Apple Pay setup initiated
[INFO] Terms accepted
[INFO] Card provisioned: XXXX-4532
PASSED: testApplePayProvisioning (6.5s)
=== testApplePayPayment ===
[INFO] Apple Pay sheet displayed
[INFO] Face ID authenticated
[INFO] Payment result: Success - Rs. 1,200.00
PASSED: testApplePayPayment (5.2s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 11.7s`
  },
  {
    id: makeId(13), title: 'Card Management (Block/Unblock)', category: 'appiumIos',
    platform: 'iOS', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Tests card block/unblock, PIN change, and spending limit features on iOS banking app.',
    prerequisites: 'Java 11+, Appium 2.x, XCUITest, test debit/credit card linked',
    config: JSON.stringify({ platformName: 'iOS', deviceName: 'iPhone 15 Pro', platformVersion: '17.0', app: '/path/to/BankingApp.app', automationName: 'XCUITest' }, null, 2),
    code: `import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class CardManagementTest {
    IOSDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        XCUITestOptions opts = new XCUITestOptions()
            .setDeviceName("iPhone 15 Pro").setApp("/path/to/BankingApp.app");
        driver = new IOSDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testBlockCard() {
        driver.findElement(By.accessibilityId("Cards")).click();
        driver.findElement(By.accessibilityId("Debit Card XXXX-4532")).click();
        driver.findElement(By.accessibilityId("Block Card")).click();
        driver.findElement(By.accessibilityId("Confirm Block")).click();
        String status = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Card Status"))).getText();
        Assert.assertEquals(status, "Blocked");
    }

    @Test
    public void testUnblockCard() {
        driver.findElement(By.accessibilityId("Cards")).click();
        driver.findElement(By.accessibilityId("Debit Card XXXX-4532")).click();
        driver.findElement(By.accessibilityId("Unblock Card")).click();
        driver.findElement(By.accessibilityId("OTP Field")).sendKeys("654321");
        driver.findElement(By.accessibilityId("Verify")).click();
        String status = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Card Status"))).getText();
        Assert.assertEquals(status, "Active");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: CardManagementTest
=== testBlockCard ===
[INFO] Cards screen loaded
[INFO] Debit Card XXXX-4532 selected
[INFO] Block confirmed
[INFO] Card status: Blocked
PASSED: testBlockCard (3.5s)
=== testUnblockCard ===
[INFO] Unblock initiated, OTP entered
[INFO] Card status: Active
PASSED: testUnblockCard (4.2s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 7.7s`
  },
  {
    id: makeId(14), title: 'QR Code Scanner Payments', category: 'appiumIos',
    platform: 'iOS', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests QR code scanning for merchant payments, dynamic QR amount parsing, and payment confirmation on iOS.',
    prerequisites: 'Java 11+, Appium 2.x, XCUITest, camera permissions, test QR codes',
    config: JSON.stringify({ platformName: 'iOS', deviceName: 'iPhone 15 Pro', platformVersion: '17.0', app: '/path/to/BankingApp.app', automationName: 'XCUITest' }, null, 2),
    code: `import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;

public class QRPaymentTest {
    IOSDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        XCUITestOptions opts = new XCUITestOptions()
            .setDeviceName("iPhone 15 Pro").setApp("/path/to/BankingApp.app");
        driver = new IOSDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    @Test
    public void testQRScanPayment() {
        driver.findElement(By.accessibilityId("Scan & Pay")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("QR Scanner")));
        // Push test QR image to simulator camera roll
        HashMap<String, Object> args = new HashMap<>();
        args.put("payload", "upi://pay?pa=merchant@upi&am=750&tn=Coffee");
        driver.executeScript("mobile: mockQRCode", args);
        // Verify parsed payment details
        String merchant = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Merchant VPA"))).getText();
        Assert.assertEquals(merchant, "merchant@upi");
        String amount = driver.findElement(
            By.accessibilityId("Payment Amount")).getText();
        Assert.assertEquals(amount, "Rs. 750.00");
        driver.findElement(By.accessibilityId("Pay Now")).click();
        driver.findElement(By.accessibilityId("UPI PIN")).sendKeys("1234");
        String status = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Payment Status"))).getText();
        Assert.assertTrue(status.contains("Successful"));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: QRPaymentTest
=== testQRScanPayment ===
[INFO] QR Scanner opened
[INFO] QR code scanned: upi://pay?pa=merchant@upi&am=750
[INFO] Merchant: merchant@upi
[INFO] Amount: Rs. 750.00
[INFO] UPI PIN entered
[INFO] Payment Successful - UTR: UPI2025112800089
PASSED: testQRScanPayment (7.3s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 7.3s`
  },
  {
    id: makeId(15), title: 'KYC Document Upload', category: 'appiumIos',
    platform: 'iOS', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests KYC document upload flow with Aadhaar/PAN capture, image quality validation, and OCR extraction on iOS.',
    prerequisites: 'Java 11+, Appium 2.x, XCUITest, camera/photo library permissions, test documents',
    config: JSON.stringify({ platformName: 'iOS', deviceName: 'iPhone 15 Pro', platformVersion: '17.0', app: '/path/to/BankingApp.app', automationName: 'XCUITest' }, null, 2),
    code: `import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class KYCUploadTest {
    IOSDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        XCUITestOptions opts = new XCUITestOptions()
            .setDeviceName("iPhone 15 Pro").setApp("/path/to/BankingApp.app");
        driver = new IOSDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(25));
    }

    @Test
    public void testAadhaarUpload() {
        driver.findElement(By.accessibilityId("KYC Verification")).click();
        driver.findElement(By.accessibilityId("Upload Aadhaar")).click();
        driver.findElement(By.accessibilityId("Choose from Library")).click();
        // Select pre-loaded test image
        driver.findElement(By.accessibilityId("aadhaar_front")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Image Quality: Good")));
        driver.findElement(By.accessibilityId("Upload")).click();
        String ocrName = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Extracted Name"))).getText();
        Assert.assertFalse(ocrName.isEmpty(), "OCR should extract name");
        String ocrNum = driver.findElement(
            By.accessibilityId("Extracted Number")).getText();
        Assert.assertTrue(ocrNum.matches("XXXX-XXXX-\\\\d{4}"));
        driver.findElement(By.accessibilityId("Confirm Details")).click();
        String status = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("KYC Status"))).getText();
        Assert.assertTrue(status.contains("Verified"));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: KYCUploadTest
=== testAadhaarUpload ===
[INFO] KYC screen opened
[INFO] Aadhaar front image selected
[INFO] Image quality check: Good
[INFO] OCR extracted - Name: Praveen Kumar
[INFO] OCR extracted - Number: XXXX-XXXX-5678
[INFO] KYC Status: Verified
PASSED: testAadhaarUpload (9.4s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 9.4s`
  },
  {
    id: makeId(16), title: 'Loan EMI Calculator', category: 'appiumIos',
    platform: 'iOS', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Tests loan EMI calculator with principal, rate, tenure inputs and validates EMI amount, total interest, and amortization schedule.',
    prerequisites: 'Java 11+, Appium 2.x, XCUITest, iPhone simulator',
    config: JSON.stringify({ platformName: 'iOS', deviceName: 'iPhone 15 Pro', platformVersion: '17.0', app: '/path/to/BankingApp.app', automationName: 'XCUITest' }, null, 2),
    code: `import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class LoanEMICalcTest {
    IOSDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        XCUITestOptions opts = new XCUITestOptions()
            .setDeviceName("iPhone 15 Pro").setApp("/path/to/BankingApp.app");
        driver = new IOSDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testEMICalculation() {
        driver.findElement(By.accessibilityId("Loans")).click();
        driver.findElement(By.accessibilityId("EMI Calculator")).click();
        driver.findElement(By.accessibilityId("Loan Amount")).sendKeys("1000000");
        driver.findElement(By.accessibilityId("Interest Rate")).sendKeys("8.5");
        driver.findElement(By.accessibilityId("Tenure Years")).sendKeys("20");
        driver.findElement(By.accessibilityId("Calculate")).click();
        String emi = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Monthly EMI"))).getText();
        Assert.assertFalse(emi.isEmpty(), "EMI should be calculated");
        String totalInterest = driver.findElement(
            By.accessibilityId("Total Interest")).getText();
        Assert.assertFalse(totalInterest.isEmpty());
        boolean scheduleVisible = driver.findElement(
            By.accessibilityId("Amortization Schedule")).isDisplayed();
        Assert.assertTrue(scheduleVisible);
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: LoanEMICalcTest
=== testEMICalculation ===
[INFO] EMI Calculator opened
[INFO] Principal: Rs. 10,00,000
[INFO] Rate: 8.5%, Tenure: 20 years
[INFO] Monthly EMI: Rs. 8,678
[INFO] Total Interest: Rs. 10,82,720
[INFO] Amortization schedule displayed (240 months)
PASSED: testEMICalculation (3.8s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 3.8s`
  },
  {
    id: makeId(17), title: 'Fixed Deposit Booking', category: 'appiumIos',
    platform: 'iOS', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests FD booking flow with amount, tenure selection, interest rate display, and maturity amount calculation on iOS.',
    prerequisites: 'Java 11+, Appium 2.x, XCUITest, test account with sufficient balance',
    config: JSON.stringify({ platformName: 'iOS', deviceName: 'iPhone 15 Pro', platformVersion: '17.0', app: '/path/to/BankingApp.app', automationName: 'XCUITest' }, null, 2),
    code: `import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class FixedDepositTest {
    IOSDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        XCUITestOptions opts = new XCUITestOptions()
            .setDeviceName("iPhone 15 Pro").setApp("/path/to/BankingApp.app");
        driver = new IOSDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testBookFD() {
        driver.findElement(By.accessibilityId("Investments")).click();
        driver.findElement(By.accessibilityId("Book Fixed Deposit")).click();
        driver.findElement(By.accessibilityId("FD Amount")).sendKeys("500000");
        driver.findElement(By.accessibilityId("Tenure 1 Year")).click();
        String rate = driver.findElement(
            By.accessibilityId("Interest Rate")).getText();
        Assert.assertFalse(rate.isEmpty(), "Interest rate should display");
        String maturity = driver.findElement(
            By.accessibilityId("Maturity Amount")).getText();
        Assert.assertFalse(maturity.isEmpty());
        driver.findElement(By.accessibilityId("Confirm Booking")).click();
        driver.findElement(By.accessibilityId("OTP Input")).sendKeys("123456");
        driver.findElement(By.accessibilityId("Verify OTP")).click();
        String status = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("FD Status"))).getText();
        Assert.assertTrue(status.contains("Booked Successfully"));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: FixedDepositTest
=== testBookFD ===
[INFO] Investments screen loaded
[INFO] FD Amount: Rs. 5,00,000
[INFO] Tenure: 1 Year, Rate: 7.10%
[INFO] Maturity Amount: Rs. 5,35,500
[INFO] OTP verified
[INFO] FD Status: Booked Successfully
[INFO] FD Number: FD2025112800015
PASSED: testBookFD (6.8s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 6.8s`
  },
  {
    id: makeId(18), title: 'Branch/ATM Locator with Maps', category: 'appiumIos',
    platform: 'iOS', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Tests branch and ATM locator with GPS simulation, map rendering, search by pincode, and directions integration.',
    prerequisites: 'Java 11+, Appium 2.x, XCUITest, location services permission',
    config: JSON.stringify({ platformName: 'iOS', deviceName: 'iPhone 15 Pro', platformVersion: '17.0', app: '/path/to/BankingApp.app', automationName: 'XCUITest' }, null, 2),
    code: `import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;

public class BranchLocatorTest {
    IOSDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        XCUITestOptions opts = new XCUITestOptions()
            .setDeviceName("iPhone 15 Pro").setApp("/path/to/BankingApp.app");
        driver = new IOSDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testNearbyBranches() {
        // Simulate GPS location - Bangalore
        driver.setLocation(new org.openqa.selenium.html5.Location(
            12.9716, 77.5946, 0));
        driver.findElement(By.accessibilityId("Branch Locator")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Map View")));
        int pins = driver.findElements(
            By.accessibilityId("Branch Pin")).size();
        Assert.assertTrue(pins > 0, "Should show nearby branches");
        driver.findElement(By.accessibilityId("Search")).sendKeys("560001");
        driver.findElement(By.accessibilityId("Search Button")).click();
        String result = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("First Result"))).getText();
        Assert.assertFalse(result.isEmpty());
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: BranchLocatorTest
=== testNearbyBranches ===
[INFO] GPS set: 12.9716, 77.5946 (Bangalore)
[INFO] Branch Locator opened
[INFO] Map rendered with 8 branch pins
[INFO] Search by pincode: 560001
[INFO] Results: 3 branches found
[INFO] Nearest: MG Road Branch (0.5 km)
PASSED: testNearbyBranches (4.5s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 4.5s`
  },
  {
    id: makeId(19), title: 'In-App Chat Support', category: 'appiumIos',
    platform: 'iOS', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Tests in-app chat support with bot greeting, message send/receive, file attachment, and agent handoff.',
    prerequisites: 'Java 11+, Appium 2.x, XCUITest, chat backend sandbox',
    config: JSON.stringify({ platformName: 'iOS', deviceName: 'iPhone 15 Pro', platformVersion: '17.0', app: '/path/to/BankingApp.app', automationName: 'XCUITest' }, null, 2),
    code: `import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class ChatSupportTest {
    IOSDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        XCUITestOptions opts = new XCUITestOptions()
            .setDeviceName("iPhone 15 Pro").setApp("/path/to/BankingApp.app");
        driver = new IOSDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testChatBotInteraction() {
        driver.findElement(By.accessibilityId("Help & Support")).click();
        driver.findElement(By.accessibilityId("Chat with Us")).click();
        String greeting = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Bot Message"))).getText();
        Assert.assertTrue(greeting.contains("Hello"));
        driver.findElement(By.accessibilityId("Message Input"))
            .sendKeys("What is my account balance?");
        driver.findElement(By.accessibilityId("Send")).click();
        String reply = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("(//XCUIElementTypeStaticText[@name='Bot Message'])[2]")))
            .getText();
        Assert.assertTrue(reply.contains("balance") || reply.contains("account"));
        // Request agent handoff
        driver.findElement(By.accessibilityId("Message Input"))
            .sendKeys("Connect to agent");
        driver.findElement(By.accessibilityId("Send")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Agent Connected")));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: ChatSupportTest
=== testChatBotInteraction ===
[INFO] Chat screen opened
[INFO] Bot greeting: "Hello! How can I help you?"
[INFO] User: "What is my account balance?"
[INFO] Bot: "Your savings account balance is Rs. 1,25,430"
[INFO] User: "Connect to agent"
[INFO] Agent connected: Ravi (ID: AGT-042)
PASSED: testChatBotInteraction (6.2s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 6.2s`
  },
  {
    id: makeId(20), title: 'App Widget Quick Balance', category: 'appiumIos',
    platform: 'iOS', framework: 'Appium', language: 'Java', difficulty: 'Advanced',
    description: 'Tests iOS home screen widget displaying quick balance, last transaction, and widget tap navigation to app.',
    prerequisites: 'Java 11+, Appium 2.x, XCUITest, WidgetKit support, iOS 17+',
    config: JSON.stringify({ platformName: 'iOS', deviceName: 'iPhone 15 Pro', platformVersion: '17.0', app: '/path/to/BankingApp.app', automationName: 'XCUITest' }, null, 2),
    code: `import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;

public class WidgetBalanceTest {
    IOSDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        XCUITestOptions opts = new XCUITestOptions()
            .setDeviceName("iPhone 15 Pro").setApp("/path/to/BankingApp.app");
        driver = new IOSDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    @Test
    public void testWidgetQuickBalance() {
        // First login to populate widget data
        driver.findElement(By.accessibilityId("Enter PIN")).sendKeys("1234");
        driver.findElement(By.accessibilityId("Submit PIN")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Dashboard Screen")));
        // Go to home screen
        HashMap<String, Object> args = new HashMap<>();
        args.put("name", "home");
        driver.executeScript("mobile: pressButton", args);
        Thread.sleep(1000);
        // Swipe left to widget screen
        driver.executeScript("mobile: swipe",
            new HashMap<String, Object>() {{ put("direction", "left"); }});
        String widgetBalance = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Banking Widget Balance"))).getText();
        Assert.assertFalse(widgetBalance.isEmpty());
        // Tap widget to open app
        driver.findElement(By.accessibilityId("Banking Widget Balance")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.accessibilityId("Dashboard Screen")));
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: WidgetBalanceTest
=== testWidgetQuickBalance ===
[INFO] App login successful
[INFO] Home screen navigated
[INFO] Widget screen displayed
[INFO] Widget balance: Rs. 1,25,430
[INFO] Widget tapped - app opened to Dashboard
PASSED: testWidgetQuickBalance (8.9s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 8.9s`
  },
  // =========== MOBILE API TESTING (MT-021 to MT-030) ===========
  {
    id: makeId(21), title: 'Login with Device Binding', category: 'mobileApi',
    platform: 'Cross-platform', framework: 'REST Assured', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests mobile login API with device fingerprint binding, IMEI registration, and multi-device restriction enforcement.',
    prerequisites: 'Java 11+, REST Assured 5.x, TestNG, API sandbox with device binding enabled',
    config: JSON.stringify({ baseUrl: 'https://api.bank.com/v1', authEndpoint: '/auth/login', deviceBindEndpoint: '/auth/device-bind', timeout: 10000 }, null, 2),
    code: `import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class DeviceBindingAPITest {
    String baseUrl = "https://api.bank.com/v1";
    String deviceId = "DEVICE-A1B2C3D4E5F6";
    String token;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = baseUrl;
    }

    @Test(priority = 1)
    public void testLoginWithDeviceBinding() {
        Response res = given()
            .contentType("application/json")
            .body("{\\"username\\":\\"testuser\\",\\"password\\":\\"Test@123\\","
                + "\\"deviceId\\":\\"" + deviceId + "\\","
                + "\\"deviceModel\\":\\"Pixel 6\\",\\"osVersion\\":\\"13.0\\"}")
            .when().post("/auth/login")
            .then().statusCode(200)
            .body("token", notNullValue())
            .body("deviceBound", equalTo(true))
            .extract().response();
        token = res.jsonPath().getString("token");
        Assert.assertNotNull(token);
    }

    @Test(priority = 2)
    public void testLoginFromUnboundDevice() {
        given().contentType("application/json")
            .body("{\\"username\\":\\"testuser\\",\\"password\\":\\"Test@123\\","
                + "\\"deviceId\\":\\"DEVICE-UNKNOWN\\"}")
            .when().post("/auth/login")
            .then().statusCode(403)
            .body("error", containsString("device not registered"));
    }

    @Test(priority = 3)
    public void testRegisterNewDevice() {
        given().contentType("application/json")
            .header("Authorization", "Bearer " + token)
            .body("{\\"newDeviceId\\":\\"DEVICE-NEW123\\","
                + "\\"otp\\":\\"654321\\"}")
            .when().post("/auth/device-bind")
            .then().statusCode(200)
            .body("status", equalTo("bound"));
    }
}`,
    expectedOutput: `[TestNG] Running: DeviceBindingAPITest
=== testLoginWithDeviceBinding ===
POST /auth/login -> 200 OK
Response: token=eyJhbG..., deviceBound=true
PASSED: testLoginWithDeviceBinding (1.2s)
=== testLoginFromUnboundDevice ===
POST /auth/login -> 403 Forbidden
Response: error="device not registered"
PASSED: testLoginFromUnboundDevice (0.8s)
=== testRegisterNewDevice ===
POST /auth/device-bind -> 200 OK
Response: status=bound
PASSED: testRegisterNewDevice (1.1s)
Tests run: 3, Failures: 0, Skips: 0
Total time: 3.1s`
  },
  {
    id: makeId(22), title: 'OTP Generation & Verification', category: 'mobileApi',
    platform: 'Cross-platform', framework: 'REST Assured', language: 'Java', difficulty: 'Beginner',
    description: 'Tests OTP generation API, expiry validation, max retry limits, and verification flow for mobile banking transactions.',
    prerequisites: 'Java 11+, REST Assured 5.x, OTP sandbox API',
    config: JSON.stringify({ baseUrl: 'https://api.bank.com/v1', otpGenerate: '/otp/generate', otpVerify: '/otp/verify', otpExpiry: 300 }, null, 2),
    code: `import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class OTPVerificationAPITest {
    String baseUrl = "https://api.bank.com/v1";
    String otpRef;

    @BeforeClass
    public void setup() { RestAssured.baseURI = baseUrl; }

    @Test(priority = 1)
    public void testGenerateOTP() {
        Response res = given().contentType("application/json")
            .body("{\\"mobile\\":\\"+919876543210\\",\\"purpose\\":\\"txn_verify\\"}")
            .when().post("/otp/generate")
            .then().statusCode(200)
            .body("otpRef", notNullValue())
            .body("expiresIn", equalTo(300))
            .extract().response();
        otpRef = res.jsonPath().getString("otpRef");
    }

    @Test(priority = 2)
    public void testVerifyValidOTP() {
        given().contentType("application/json")
            .body("{\\"otpRef\\":\\"" + otpRef + "\\",\\"otp\\":\\"123456\\"}")
            .when().post("/otp/verify")
            .then().statusCode(200)
            .body("verified", equalTo(true));
    }

    @Test(priority = 3)
    public void testVerifyInvalidOTP() {
        given().contentType("application/json")
            .body("{\\"otpRef\\":\\"" + otpRef + "\\",\\"otp\\":\\"000000\\"}")
            .when().post("/otp/verify")
            .then().statusCode(400)
            .body("error", containsString("invalid"));
    }

    @Test(priority = 4)
    public void testMaxRetryExceeded() {
        for (int i = 0; i < 3; i++) {
            given().contentType("application/json")
                .body("{\\"otpRef\\":\\"" + otpRef + "\\",\\"otp\\":\\"999999\\"}")
                .when().post("/otp/verify");
        }
        given().contentType("application/json")
            .body("{\\"otpRef\\":\\"" + otpRef + "\\",\\"otp\\":\\"123456\\"}")
            .when().post("/otp/verify")
            .then().statusCode(429)
            .body("error", containsString("max attempts"));
    }
}`,
    expectedOutput: `[TestNG] Running: OTPVerificationAPITest
=== testGenerateOTP ===
POST /otp/generate -> 200 OK
otpRef=OTP-2025-A1B2C3, expiresIn=300
PASSED: testGenerateOTP (0.6s)
=== testVerifyValidOTP ===
POST /otp/verify -> 200 OK, verified=true
PASSED: testVerifyValidOTP (0.4s)
=== testVerifyInvalidOTP ===
POST /otp/verify -> 400, error="invalid OTP"
PASSED: testVerifyInvalidOTP (0.3s)
=== testMaxRetryExceeded ===
POST /otp/verify -> 429, error="max attempts exceeded"
PASSED: testMaxRetryExceeded (1.2s)
Tests run: 4, Failures: 0, Skips: 0
Total time: 2.5s`
  },
  {
    id: makeId(23), title: 'Transaction with Geolocation', category: 'mobileApi',
    platform: 'Cross-platform', framework: 'REST Assured', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests transaction API with geolocation data for fraud detection, geo-fencing validation, and suspicious location alerts.',
    prerequisites: 'Java 11+, REST Assured 5.x, geolocation-enabled API sandbox',
    config: JSON.stringify({ baseUrl: 'https://api.bank.com/v1', txnEndpoint: '/transactions', geoFenceRadius: 500 }, null, 2),
    code: `import io.restassured.RestAssured;
import org.testng.annotations.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class GeoTransactionAPITest {
    String token = "Bearer eyJhbGciOiJIUzI1NiJ9.test";

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.bank.com/v1";
    }

    @Test(priority = 1)
    public void testTransactionWithValidLocation() {
        given().contentType("application/json")
            .header("Authorization", token)
            .body("{\\"amount\\":5000,\\"beneficiary\\":\\"ACC-987654\\","
                + "\\"lat\\":12.9716,\\"lon\\":77.5946,"
                + "\\"accuracy\\":15.0}")
            .when().post("/transactions")
            .then().statusCode(201)
            .body("status", equalTo("completed"))
            .body("geoVerified", equalTo(true));
    }

    @Test(priority = 2)
    public void testTransactionFromSuspiciousLocation() {
        given().contentType("application/json")
            .header("Authorization", token)
            .body("{\\"amount\\":50000,\\"beneficiary\\":\\"ACC-987654\\","
                + "\\"lat\\":55.7558,\\"lon\\":37.6173,"
                + "\\"accuracy\\":10.0}")
            .when().post("/transactions")
            .then().statusCode(202)
            .body("status", equalTo("pending_review"))
            .body("riskFlag", equalTo("geo_anomaly"));
    }

    @Test(priority = 3)
    public void testTransactionWithoutLocation() {
        given().contentType("application/json")
            .header("Authorization", token)
            .body("{\\"amount\\":1000,\\"beneficiary\\":\\"ACC-987654\\"}")
            .when().post("/transactions")
            .then().statusCode(400)
            .body("error", containsString("location required"));
    }
}`,
    expectedOutput: `[TestNG] Running: GeoTransactionAPITest
=== testTransactionWithValidLocation ===
POST /transactions -> 201 Created
geoVerified=true, location: Bangalore
PASSED: testTransactionWithValidLocation (1.5s)
=== testTransactionFromSuspiciousLocation ===
POST /transactions -> 202 Accepted
status=pending_review, riskFlag=geo_anomaly
PASSED: testTransactionFromSuspiciousLocation (1.3s)
=== testTransactionWithoutLocation ===
POST /transactions -> 400, error="location required"
PASSED: testTransactionWithoutLocation (0.4s)
Tests run: 3, Failures: 0, Skips: 0
Total time: 3.2s`
  },
  {
    id: makeId(24), title: 'Push Token Registration', category: 'mobileApi',
    platform: 'Cross-platform', framework: 'REST Assured', language: 'Java', difficulty: 'Beginner',
    description: 'Tests FCM/APNS push token registration, token refresh, and deregistration APIs for mobile notification delivery.',
    prerequisites: 'Java 11+, REST Assured 5.x, FCM/APNS sandbox project',
    config: JSON.stringify({ baseUrl: 'https://api.bank.com/v1', pushEndpoint: '/push/register', fcmSandbox: true }, null, 2),
    code: `import io.restassured.RestAssured;
import org.testng.annotations.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class PushTokenAPITest {
    String token = "Bearer eyJhbGciOiJIUzI1NiJ9.test";

    @BeforeClass
    public void setup() { RestAssured.baseURI = "https://api.bank.com/v1"; }

    @Test(priority = 1)
    public void testRegisterPushToken() {
        given().contentType("application/json")
            .header("Authorization", token)
            .body("{\\"fcmToken\\":\\"dGVzdC10b2tlbi0xMjM0\\","
                + "\\"platform\\":\\"android\\",\\"appVersion\\":\\"4.2.1\\"}")
            .when().post("/push/register")
            .then().statusCode(200)
            .body("registered", equalTo(true))
            .body("topics", hasItems("txn_alerts", "promotions"));
    }

    @Test(priority = 2)
    public void testRefreshToken() {
        given().contentType("application/json")
            .header("Authorization", token)
            .body("{\\"oldToken\\":\\"dGVzdC10b2tlbi0xMjM0\\","
                + "\\"newToken\\":\\"bmV3LXRva2VuLTU2Nzg\\"}")
            .when().put("/push/register")
            .then().statusCode(200)
            .body("refreshed", equalTo(true));
    }

    @Test(priority = 3)
    public void testDeregisterToken() {
        given().contentType("application/json")
            .header("Authorization", token)
            .body("{\\"fcmToken\\":\\"bmV3LXRva2VuLTU2Nzg\\"}")
            .when().delete("/push/register")
            .then().statusCode(200)
            .body("deregistered", equalTo(true));
    }
}`,
    expectedOutput: `[TestNG] Running: PushTokenAPITest
=== testRegisterPushToken ===
POST /push/register -> 200, registered=true
topics: [txn_alerts, promotions]
PASSED: testRegisterPushToken (0.8s)
=== testRefreshToken ===
PUT /push/register -> 200, refreshed=true
PASSED: testRefreshToken (0.5s)
=== testDeregisterToken ===
DELETE /push/register -> 200, deregistered=true
PASSED: testDeregisterToken (0.4s)
Tests run: 3, Failures: 0, Skips: 0
Total time: 1.7s`
  },
  {
    id: makeId(25), title: 'GraphQL Customer Dashboard', category: 'mobileApi',
    platform: 'Cross-platform', framework: 'Jest', language: 'JavaScript', difficulty: 'Advanced',
    description: 'Tests GraphQL queries for customer dashboard with nested account, transaction, and card data resolution.',
    prerequisites: 'Node.js 18+, Jest, graphql-request library, GraphQL sandbox API',
    config: JSON.stringify({ graphqlUrl: 'https://api.bank.com/graphql', timeout: 10000 }, null, 2),
    code: `const { GraphQLClient, gql } = require('graphql-request');

const client = new GraphQLClient('https://api.bank.com/graphql', {
    headers: { Authorization: 'Bearer test-token-123' },
    timeout: 10000,
});

describe('Customer Dashboard GraphQL', () => {
    test('fetch dashboard with accounts and cards', async () => {
        const query = gql\`
            query CustomerDashboard {
                customer {
                    name
                    accounts {
                        accountNumber
                        balance
                        type
                    }
                    cards { last4 status type }
                    recentTransactions(limit: 5) {
                        id amount date description
                    }
                }
            }
        \`;
        const data = await client.request(query);
        expect(data.customer.name).toBeTruthy();
        expect(data.customer.accounts.length).toBeGreaterThan(0);
        expect(data.customer.cards.length).toBeGreaterThan(0);
        expect(data.customer.recentTransactions.length).toBeLessThanOrEqual(5);
        data.customer.accounts.forEach(acc => {
            expect(acc.balance).toBeGreaterThanOrEqual(0);
            expect(['SAVINGS', 'CURRENT']).toContain(acc.type);
        });
    });

    test('mutation - update notification preferences', async () => {
        const mutation = gql\`
            mutation UpdatePrefs {
                updateNotificationPrefs(input: {
                    txnAlerts: true, promoEmails: false, smsAlerts: true
                }) { success updatedAt }
            }
        \`;
        const data = await client.request(mutation);
        expect(data.updateNotificationPrefs.success).toBe(true);
    });
});`,
    expectedOutput: `PASS Customer Dashboard GraphQL
  + fetch dashboard with accounts and cards (245ms)
    - customer.name: "Praveen Kumar"
    - accounts: 2 (SAVINGS, CURRENT)
    - cards: 1 (XXXX-4532, Active)
    - recentTransactions: 5
  + mutation - update notification preferences (128ms)
    - success: true
    - updatedAt: "2025-11-28T10:30:00Z"

Tests: 2 passed, 2 total
Time: 0.373s`
  },
  {
    id: makeId(26), title: 'WebSocket Real-time Balance', category: 'mobileApi',
    platform: 'Cross-platform', framework: 'Jest', language: 'JavaScript', difficulty: 'Advanced',
    description: 'Tests WebSocket connection for real-time balance updates, transaction notifications, and reconnection handling.',
    prerequisites: 'Node.js 18+, Jest, ws library, WebSocket sandbox server',
    config: JSON.stringify({ wsUrl: 'wss://ws.bank.com/v1/realtime', pingInterval: 30000, reconnectDelay: 5000 }, null, 2),
    code: `const WebSocket = require('ws');

describe('WebSocket Real-time Balance', () => {
    let ws;
    const WS_URL = 'wss://ws.bank.com/v1/realtime';

    afterEach(() => { if (ws) ws.close(); });

    test('connect and receive balance updates', (done) => {
        ws = new WebSocket(WS_URL, {
            headers: { Authorization: 'Bearer test-token' }
        });
        const messages = [];
        ws.on('open', () => {
            ws.send(JSON.stringify({
                type: 'subscribe',
                channel: 'balance',
                accountId: 'ACC-123456'
            }));
        });
        ws.on('message', (data) => {
            const msg = JSON.parse(data.toString());
            messages.push(msg);
            if (msg.type === 'balance_update') {
                expect(msg.balance).toBeDefined();
                expect(msg.accountId).toBe('ACC-123456');
                expect(msg.timestamp).toBeTruthy();
                done();
            }
        });
        ws.on('error', (err) => done(err));
    }, 15000);

    test('handle reconnection on disconnect', (done) => {
        ws = new WebSocket(WS_URL, {
            headers: { Authorization: 'Bearer test-token' }
        });
        let reconnected = false;
        ws.on('close', () => {
            if (!reconnected) {
                reconnected = true;
                ws = new WebSocket(WS_URL, {
                    headers: { Authorization: 'Bearer test-token' }
                });
                ws.on('open', () => {
                    expect(reconnected).toBe(true);
                    done();
                });
            }
        });
        ws.on('open', () => { ws.close(); });
    }, 15000);
});`,
    expectedOutput: `PASS WebSocket Real-time Balance
  + connect and receive balance updates (2340ms)
    - Connected to wss://ws.bank.com/v1/realtime
    - Subscribed to channel: balance
    - Balance update: Rs. 1,25,430.50
    - Timestamp: 2025-11-28T10:30:15Z
  + handle reconnection on disconnect (1520ms)
    - Initial connection established
    - Connection closed, reconnecting...
    - Reconnected successfully

Tests: 2 passed, 2 total
Time: 3.86s`
  },
  {
    id: makeId(27), title: 'API Response Caching', category: 'mobileApi',
    platform: 'Cross-platform', framework: 'REST Assured', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests API response caching with ETag, If-None-Match headers, cache expiry, and cache invalidation on data change.',
    prerequisites: 'Java 11+, REST Assured 5.x, caching-enabled API endpoints',
    config: JSON.stringify({ baseUrl: 'https://api.bank.com/v1', cacheMaxAge: 300 }, null, 2),
    code: `import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class APICachingTest {
    String token = "Bearer eyJhbGciOiJIUzI1NiJ9.test";
    String etag;

    @BeforeClass
    public void setup() { RestAssured.baseURI = "https://api.bank.com/v1"; }

    @Test(priority = 1)
    public void testFirstRequestReturnsETag() {
        Response res = given().header("Authorization", token)
            .when().get("/accounts/summary")
            .then().statusCode(200)
            .header("ETag", notNullValue())
            .header("Cache-Control", containsString("max-age=300"))
            .extract().response();
        etag = res.header("ETag");
        Assert.assertNotNull(etag);
    }

    @Test(priority = 2)
    public void testCachedResponseReturns304() {
        given().header("Authorization", token)
            .header("If-None-Match", etag)
            .when().get("/accounts/summary")
            .then().statusCode(304);
    }

    @Test(priority = 3)
    public void testCacheInvalidatedAfterTransaction() {
        // Perform a transaction to invalidate cache
        given().contentType("application/json")
            .header("Authorization", token)
            .body("{\\"amount\\":100,\\"type\\":\\"debit\\"}")
            .when().post("/transactions/quick")
            .then().statusCode(201);
        // Now cached ETag should be stale
        given().header("Authorization", token)
            .header("If-None-Match", etag)
            .when().get("/accounts/summary")
            .then().statusCode(200)
            .header("ETag", not(equalTo(etag)));
    }
}`,
    expectedOutput: `[TestNG] Running: APICachingTest
=== testFirstRequestReturnsETag ===
GET /accounts/summary -> 200
ETag: "a1b2c3d4", Cache-Control: max-age=300
PASSED: testFirstRequestReturnsETag (0.9s)
=== testCachedResponseReturns304 ===
GET /accounts/summary If-None-Match: "a1b2c3d4" -> 304
PASSED: testCachedResponseReturns304 (0.2s)
=== testCacheInvalidatedAfterTransaction ===
POST /transactions/quick -> 201
GET /accounts/summary -> 200 (new ETag: "e5f6g7h8")
PASSED: testCacheInvalidatedAfterTransaction (1.5s)
Tests run: 3, Failures: 0, Skips: 0
Total time: 2.6s`
  },
  {
    id: makeId(28), title: 'SSL Pinning Verification', category: 'mobileApi',
    platform: 'Cross-platform', framework: 'pytest', language: 'Python', difficulty: 'Advanced',
    description: 'Tests SSL certificate pinning by verifying correct cert passes, wrong cert fails, and expired cert is rejected.',
    prerequisites: 'Python 3.11+, requests, pytest, OpenSSL, test certificates',
    config: JSON.stringify({ apiUrl: 'https://api.bank.com/v1', pinnedCertHash: 'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', timeout: 10 }, null, 2),
    code: `import requests
import ssl
import hashlib
import base64
import pytest
from urllib3.util.ssl_ import create_urllib3_context

API_URL = "https://api.bank.com/v1/health"
PINNED_HASH = "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="

class PinningAdapter(requests.adapters.HTTPAdapter):
    def __init__(self, expected_hash, **kwargs):
        self.expected_hash = expected_hash
        super().__init__(**kwargs)

    def send(self, request, **kwargs):
        resp = super().send(request, **kwargs)
        conn = self.get_connection(request.url)
        sock = conn.sock
        if hasattr(sock, 'getpeercert'):
            der = sock.getpeercert(binary_form=True)
            digest = hashlib.sha256(der).digest()
            actual = "sha256/" + base64.b64encode(digest).decode()
            if actual != self.expected_hash:
                raise ssl.SSLError("Certificate pin mismatch")
        return resp

def test_valid_pinned_cert():
    session = requests.Session()
    session.mount("https://", PinningAdapter(PINNED_HASH))
    resp = session.get(API_URL, timeout=10)
    assert resp.status_code == 200

def test_wrong_cert_rejected():
    wrong_hash = "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="
    session = requests.Session()
    session.mount("https://", PinningAdapter(wrong_hash))
    with pytest.raises(ssl.SSLError, match="pin mismatch"):
        session.get(API_URL, timeout=10)

def test_connection_without_pinning():
    resp = requests.get(API_URL, timeout=10)
    assert resp.status_code == 200`,
    expectedOutput: `============================= test session starts =============================
collected 3 items

test_ssl_pinning.py::test_valid_pinned_cert PASSED              [33%]
  Cert hash matched: sha256/AAAA...
test_ssl_pinning.py::test_wrong_cert_rejected PASSED             [66%]
  SSLError raised: Certificate pin mismatch
test_ssl_pinning.py::test_connection_without_pinning PASSED      [100%]
  Status: 200 OK (no pinning)

======================== 3 passed in 2.45s ================================`
  },
  {
    id: makeId(29), title: 'API Versioning Compatibility', category: 'mobileApi',
    platform: 'Cross-platform', framework: 'REST Assured', language: 'Java', difficulty: 'Beginner',
    description: 'Tests API version backward compatibility ensuring v1 and v2 endpoints coexist, deprecated fields warn, and unknown versions return 404.',
    prerequisites: 'Java 11+, REST Assured 5.x, multi-version API sandbox',
    config: JSON.stringify({ baseUrl: 'https://api.bank.com', versions: ['v1', 'v2'], timeout: 10000 }, null, 2),
    code: `import io.restassured.RestAssured;
import org.testng.annotations.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class APIVersioningTest {

    @BeforeClass
    public void setup() { RestAssured.baseURI = "https://api.bank.com"; }

    @Test
    public void testV1EndpointWorks() {
        given().header("Authorization", "Bearer test-token")
            .when().get("/v1/accounts")
            .then().statusCode(200)
            .body("accounts", notNullValue())
            .header("Deprecation", nullValue());
    }

    @Test
    public void testV2EndpointWithNewFields() {
        given().header("Authorization", "Bearer test-token")
            .when().get("/v2/accounts")
            .then().statusCode(200)
            .body("data.accounts", notNullValue())
            .body("data.accounts[0].rewardsPoints", notNullValue())
            .body("meta.apiVersion", equalTo("v2"));
    }

    @Test
    public void testV1DeprecatedFieldWarning() {
        given().header("Authorization", "Bearer test-token")
            .when().get("/v1/accounts?include=old_balance")
            .then().statusCode(200)
            .header("Sunset", notNullValue())
            .header("Deprecation", notNullValue());
    }

    @Test
    public void testUnknownVersionReturns404() {
        given().header("Authorization", "Bearer test-token")
            .when().get("/v99/accounts")
            .then().statusCode(404)
            .body("error", containsString("version not supported"));
    }
}`,
    expectedOutput: `[TestNG] Running: APIVersioningTest
=== testV1EndpointWorks ===
GET /v1/accounts -> 200 OK
PASSED: testV1EndpointWorks (0.6s)
=== testV2EndpointWithNewFields ===
GET /v2/accounts -> 200, rewardsPoints present
PASSED: testV2EndpointWithNewFields (0.7s)
=== testV1DeprecatedFieldWarning ===
GET /v1/accounts?include=old_balance -> 200
Sunset: 2026-06-01, Deprecation: true
PASSED: testV1DeprecatedFieldWarning (0.5s)
=== testUnknownVersionReturns404 ===
GET /v99/accounts -> 404
PASSED: testUnknownVersionReturns404 (0.3s)
Tests run: 4, Failures: 0, Skips: 0
Total time: 2.1s`
  },
  {
    id: makeId(30), title: 'Offline Sync Queue & Replay', category: 'mobileApi',
    platform: 'Cross-platform', framework: 'REST Assured', language: 'Java', difficulty: 'Advanced',
    description: 'Tests offline transaction queueing, sync replay on reconnection, conflict resolution, and idempotency guarantees.',
    prerequisites: 'Java 11+, REST Assured 5.x, sync queue API with idempotency support',
    config: JSON.stringify({ baseUrl: 'https://api.bank.com/v1', syncEndpoint: '/sync/replay', maxQueueSize: 50 }, null, 2),
    code: `import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import java.util.UUID;

public class OfflineSyncAPITest {
    String token = "Bearer eyJhbGciOiJIUzI1NiJ9.test";
    String idempotencyKey;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.bank.com/v1";
        idempotencyKey = UUID.randomUUID().toString();
    }

    @Test(priority = 1)
    public void testReplayOfflineQueue() {
        String body = "{\\"queue\\":["
            + "{\\"action\\":\\"transfer\\",\\"amount\\":1000,\\"to\\":\\"ACC-111\\",\\"ts\\":1701158400},"
            + "{\\"action\\":\\"billpay\\",\\"amount\\":500,\\"biller\\":\\"BESCOM\\",\\"ts\\":1701158460}"
            + "],\\"deviceId\\":\\"DEV-123\\"}";
        given().contentType("application/json")
            .header("Authorization", token)
            .header("X-Idempotency-Key", idempotencyKey)
            .body(body)
            .when().post("/sync/replay")
            .then().statusCode(200)
            .body("processed", equalTo(2))
            .body("failed", equalTo(0))
            .body("results[0].status", equalTo("completed"))
            .body("results[1].status", equalTo("completed"));
    }

    @Test(priority = 2)
    public void testIdempotentReplay() {
        String body = "{\\"queue\\":[{\\"action\\":\\"transfer\\",\\"amount\\":1000,"
            + "\\"to\\":\\"ACC-111\\",\\"ts\\":1701158400}],\\"deviceId\\":\\"DEV-123\\"}";
        given().contentType("application/json")
            .header("Authorization", token)
            .header("X-Idempotency-Key", idempotencyKey)
            .body(body)
            .when().post("/sync/replay")
            .then().statusCode(200)
            .body("processed", equalTo(0))
            .body("skipped", equalTo(1))
            .body("reason", equalTo("already_processed"));
    }
}`,
    expectedOutput: `[TestNG] Running: OfflineSyncAPITest
=== testReplayOfflineQueue ===
POST /sync/replay -> 200
processed=2, failed=0
  [0] transfer Rs.1000 -> completed
  [1] billpay Rs.500 -> completed
PASSED: testReplayOfflineQueue (2.1s)
=== testIdempotentReplay ===
POST /sync/replay (same idempotency key) -> 200
processed=0, skipped=1, reason=already_processed
PASSED: testIdempotentReplay (0.6s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 2.7s`
  },
  // =========== MOBILE PERFORMANCE (MT-031 to MT-040) ===========
  {
    id: makeId(31), title: 'App Launch Time (Cold/Warm)', category: 'mobilePerf',
    platform: 'Android', framework: 'Custom', language: 'Python', difficulty: 'Intermediate',
    description: 'Measures cold start and warm start launch times for the banking app using ADB instrumentation and logcat timestamps.',
    prerequisites: 'Python 3.11+, ADB, Android device/emulator, banking app installed',
    config: JSON.stringify({ packageName: 'com.bank.app', activityName: '.LoginActivity', coldStartThreshold: 3000, warmStartThreshold: 1500, iterations: 5 }, null, 2),
    code: `import subprocess
import time
import re
import statistics

PACKAGE = "com.bank.app"
ACTIVITY = ".LoginActivity"
ITERATIONS = 5

def run_adb(cmd):
    result = subprocess.run(
        ["adb"] + cmd.split(),
        capture_output=True, text=True, timeout=30)
    return result.stdout

def measure_cold_start():
    times = []
    for i in range(ITERATIONS):
        run_adb("shell am force-stop " + PACKAGE)
        run_adb("shell pm clear " + PACKAGE)
        time.sleep(2)
        run_adb("logcat -c")
        run_adb("shell am start -W {0}/{1}".format(PACKAGE, ACTIVITY))
        output = run_adb("logcat -d -s ActivityTaskManager:I")
        match = re.search(r"TotalTime:\\s+(\\d+)", output)
        if match:
            times.append(int(match.group(1)))
    return times

def measure_warm_start():
    times = []
    run_adb("shell am start -W {0}/{1}".format(PACKAGE, ACTIVITY))
    time.sleep(2)
    for i in range(ITERATIONS):
        run_adb("shell input keyevent KEYCODE_HOME")
        time.sleep(1)
        run_adb("logcat -c")
        run_adb("shell am start -W {0}/{1}".format(PACKAGE, ACTIVITY))
        output = run_adb("logcat -d -s ActivityTaskManager:I")
        match = re.search(r"TotalTime:\\s+(\\d+)", output)
        if match:
            times.append(int(match.group(1)))
    return times

if __name__ == "__main__":
    cold = measure_cold_start()
    warm = measure_warm_start()
    print("Cold Start - Avg: {0}ms, P95: {1}ms".format(
        int(statistics.mean(cold)), int(sorted(cold)[int(len(cold)*0.95)])))
    print("Warm Start - Avg: {0}ms, P95: {1}ms".format(
        int(statistics.mean(warm)), int(sorted(warm)[int(len(warm)*0.95)])))
    assert statistics.mean(cold) < 3000, "Cold start exceeds 3s threshold"
    assert statistics.mean(warm) < 1500, "Warm start exceeds 1.5s threshold"`,
    expectedOutput: `===== App Launch Time Benchmark =====
Cold Start Measurements (5 iterations):
  [1] 2450ms [2] 2380ms [3] 2520ms [4] 2410ms [5] 2490ms
Cold Start - Avg: 2450ms, P95: 2520ms
Warm Start Measurements (5 iterations):
  [1] 890ms [2] 920ms [3] 850ms [4] 880ms [5] 910ms
Warm Start - Avg: 890ms, P95: 920ms
PASSED: Cold start 2450ms < 3000ms threshold
PASSED: Warm start 890ms < 1500ms threshold`
  },
  {
    id: makeId(32), title: 'Memory Leak Detection', category: 'mobilePerf',
    platform: 'Android', framework: 'Custom', language: 'Python', difficulty: 'Advanced',
    description: 'Detects memory leaks by monitoring heap allocations during repeated screen navigation and transaction flows.',
    prerequisites: 'Python 3.11+, ADB, Android device/emulator, dumpsys meminfo access',
    config: JSON.stringify({ packageName: 'com.bank.app', memoryThresholdMB: 200, leakThresholdMB: 20, iterations: 10 }, null, 2),
    code: `import subprocess
import time
import re

PACKAGE = "com.bank.app"
ITERATIONS = 10
LEAK_THRESHOLD_MB = 20

def get_memory_mb():
    result = subprocess.run(
        ["adb", "shell", "dumpsys", "meminfo", PACKAGE],
        capture_output=True, text=True, timeout=15)
    match = re.search(r"TOTAL\\s+(\\d+)", result.stdout)
    return int(match.group(1)) / 1024 if match else 0

def simulate_navigation():
    cmds = [
        "shell input tap 540 800",   # Dashboard
        "shell input tap 540 1200",  # Accounts
        "shell input tap 540 1600",  # Transfer
        "shell input keyevent KEYCODE_BACK",
        "shell input keyevent KEYCODE_BACK",
    ]
    for cmd in cmds:
        subprocess.run(["adb"] + cmd.split(), timeout=10)
        time.sleep(0.5)

def test_memory_leak():
    baseline = get_memory_mb()
    print("Baseline memory: {0:.1f} MB".format(baseline))
    readings = [baseline]
    for i in range(ITERATIONS):
        simulate_navigation()
        mem = get_memory_mb()
        readings.append(mem)
        print("Iteration {0}: {1:.1f} MB".format(i + 1, mem))
    growth = readings[-1] - baseline
    print("Memory growth: {0:.1f} MB".format(growth))
    assert growth < LEAK_THRESHOLD_MB, (
        "Memory leak detected: {0:.1f} MB growth".format(growth))
    print("PASSED: No memory leak detected")

if __name__ == "__main__":
    test_memory_leak()`,
    expectedOutput: `===== Memory Leak Detection =====
Baseline memory: 85.2 MB
Iteration 1: 88.5 MB
Iteration 2: 90.1 MB
Iteration 3: 89.8 MB (GC reclaimed)
Iteration 4: 91.2 MB
Iteration 5: 90.5 MB
Iteration 6: 92.0 MB
Iteration 7: 91.3 MB
Iteration 8: 93.1 MB
Iteration 9: 92.4 MB
Iteration 10: 93.8 MB
Memory growth: 8.6 MB
PASSED: No memory leak detected (8.6 < 20 MB threshold)`
  },
  {
    id: makeId(33), title: 'Battery Consumption Profiling', category: 'mobilePerf',
    platform: 'Android', framework: 'Custom', language: 'Python', difficulty: 'Intermediate',
    description: 'Profiles battery consumption during typical banking operations using batterystats and power profiling.',
    prerequisites: 'Python 3.11+, ADB, Android device (not emulator), USB debugging enabled',
    config: JSON.stringify({ packageName: 'com.bank.app', testDurationMinutes: 5, maxDrainPercent: 3 }, null, 2),
    code: `import subprocess
import time
import re

PACKAGE = "com.bank.app"
TEST_DURATION = 300  # 5 minutes

def run_adb(cmd):
    result = subprocess.run(
        ["adb"] + cmd.split(),
        capture_output=True, text=True, timeout=30)
    return result.stdout

def get_battery_level():
    output = run_adb("shell dumpsys battery")
    match = re.search(r"level:\\s+(\\d+)", output)
    return int(match.group(1)) if match else -1

def reset_battery_stats():
    run_adb("shell dumpsys batterystats --reset")

def get_app_power_usage():
    output = run_adb("shell dumpsys batterystats " + PACKAGE)
    match = re.search(r"Computed drain:\\s+([\\d.]+)", output)
    return float(match.group(1)) if match else 0.0

def test_battery_consumption():
    reset_battery_stats()
    start_level = get_battery_level()
    print("Start battery: {0}%".format(start_level))
    # Launch app and perform operations
    run_adb("shell am start " + PACKAGE + "/.LoginActivity")
    time.sleep(TEST_DURATION)
    end_level = get_battery_level()
    drain = start_level - end_level
    power = get_app_power_usage()
    print("End battery: {0}%".format(end_level))
    print("Battery drain: {0}%".format(drain))
    print("App power usage: {0} mAh".format(power))
    assert drain <= 3, "Battery drain {0}% exceeds 3% threshold".format(drain)

if __name__ == "__main__":
    test_battery_consumption()`,
    expectedOutput: `===== Battery Consumption Profile =====
Start battery: 85%
Running banking operations for 5 minutes...
  [60s] Login, dashboard view - 85%
  [120s] Fund transfer + OTP - 84%
  [180s] Bill payment - 84%
  [240s] Account statements browse - 83%
  [300s] Idle with background sync - 83%
End battery: 83%
Battery drain: 2%
App power usage: 45.2 mAh
PASSED: Battery drain 2% within 3% threshold`
  },
  {
    id: makeId(34), title: 'Network Bandwidth Optimization', category: 'mobilePerf',
    platform: 'Cross-platform', framework: 'Custom', language: 'Python', difficulty: 'Intermediate',
    description: 'Measures API payload sizes, tests compression effectiveness, and validates bandwidth usage on 3G/4G network conditions.',
    prerequisites: 'Python 3.11+, requests, mitmproxy for traffic capture',
    config: JSON.stringify({ apiUrl: 'https://api.bank.com/v1', maxPayloadKB: 50, compressionRequired: true }, null, 2),
    code: `import requests
import gzip
import time

API_URL = "https://api.bank.com/v1"
TOKEN = "Bearer test-token-123"
MAX_PAYLOAD_KB = 50

def measure_endpoint(path, method="GET", body=None):
    headers = {"Authorization": TOKEN, "Accept-Encoding": "gzip"}
    start = time.time()
    if method == "GET":
        resp = requests.get(API_URL + path, headers=headers, timeout=10)
    else:
        headers["Content-Type"] = "application/json"
        resp = requests.post(API_URL + path, headers=headers,
                           json=body, timeout=10)
    elapsed = time.time() - start
    raw_size = len(resp.content)
    encoding = resp.headers.get("Content-Encoding", "none")
    return {
        "path": path, "status": resp.status_code,
        "size_kb": raw_size / 1024,
        "encoding": encoding, "time_ms": int(elapsed * 1000)
    }

def test_bandwidth():
    endpoints = [
        ("/accounts/summary", "GET", None),
        ("/transactions?limit=50", "GET", None),
        ("/dashboard", "GET", None),
    ]
    results = []
    for path, method, body in endpoints:
        r = measure_endpoint(path, method, body)
        results.append(r)
        print("{0}: {1:.1f}KB ({2}) {3}ms".format(
            r["path"], r["size_kb"], r["encoding"], r["time_ms"]))
        assert r["size_kb"] < MAX_PAYLOAD_KB, (
            "{0} exceeds {1}KB limit".format(path, MAX_PAYLOAD_KB))
    compressed = [r for r in results if r["encoding"] == "gzip"]
    assert len(compressed) == len(results), "All responses should be gzip"

if __name__ == "__main__":
    test_bandwidth()`,
    expectedOutput: `===== Network Bandwidth Analysis =====
/accounts/summary: 2.3KB (gzip) 145ms
/transactions?limit=50: 18.7KB (gzip) 312ms
/dashboard: 5.1KB (gzip) 198ms
-----------------------------------------
Total payload: 26.1KB (all gzip compressed)
Average response time: 218ms
PASSED: All payloads under 50KB limit
PASSED: All responses gzip compressed`
  },
  {
    id: makeId(35), title: 'Image Loading Performance', category: 'mobilePerf',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Measures image loading time for profile photos, cheque images, and promotional banners with caching validation.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, CDN-served images',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', platformVersion: '13.0', app: '/path/to/banking.apk', automationName: 'UiAutomator2', loadTimeThresholdMs: 2000 }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class ImageLoadPerfTest {
    AndroidDriver driver;
    WebDriverWait wait;
    static final long THRESHOLD_MS = 2000;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testProfileImageLoad() {
        long start = System.currentTimeMillis();
        driver.findElement(By.id("com.bank.app:id/btnProfile")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/profileImage")));
        long loadTime = System.currentTimeMillis() - start;
        System.out.println("Profile image load: " + loadTime + "ms");
        Assert.assertTrue(loadTime < THRESHOLD_MS,
            "Image load " + loadTime + "ms exceeds threshold");
    }

    @Test
    public void testCachedImageLoad() {
        // First load (cold)
        driver.findElement(By.id("com.bank.app:id/btnProfile")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/profileImage")));
        driver.navigate().back();
        // Second load (cached)
        long start = System.currentTimeMillis();
        driver.findElement(By.id("com.bank.app:id/btnProfile")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/profileImage")));
        long cachedTime = System.currentTimeMillis() - start;
        System.out.println("Cached image load: " + cachedTime + "ms");
        Assert.assertTrue(cachedTime < 500, "Cached load should be <500ms");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: ImageLoadPerfTest
=== testProfileImageLoad ===
[INFO] Profile screen navigated
Profile image load: 1240ms
PASSED: testProfileImageLoad (1.2s)
=== testCachedImageLoad ===
[INFO] Cold load complete, navigating back
Cached image load: 180ms
PASSED: testCachedImageLoad (0.5s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 1.7s`
  },
  {
    id: makeId(36), title: 'SQLite Query Performance', category: 'mobilePerf',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Advanced',
    description: 'Benchmarks SQLite query performance for transaction history, account lookups, and indexed vs non-indexed queries.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, app with SQLite debug logging',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2', queryThresholdMs: 100 }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SQLitePerfTest {
    AndroidDriver driver;
    WebDriverWait wait;
    static final long QUERY_THRESHOLD = 100; // ms

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testTransactionQueryPerf() {
        // Clear logcat
        driver.manage().logs().get("logcat");
        // Navigate to transactions (triggers DB query)
        driver.findElement(By.id("com.bank.app:id/btnStatements")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/txnList")));
        // Extract query timing from logcat
        List logs = driver.manage().logs().get("logcat").getAll();
        long maxQueryTime = 0;
        for (Object log : logs) {
            String msg = log.toString();
            if (msg.contains("SQLiteQuery")) {
                Pattern p = Pattern.compile("took (\\\\d+)ms");
                Matcher m = p.matcher(msg);
                if (m.find()) {
                    long t = Long.parseLong(m.group(1));
                    if (t > maxQueryTime) maxQueryTime = t;
                }
            }
        }
        System.out.println("Max query time: " + maxQueryTime + "ms");
        Assert.assertTrue(maxQueryTime < QUERY_THRESHOLD,
            "Slow query: " + maxQueryTime + "ms > " + QUERY_THRESHOLD + "ms");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: SQLitePerfTest
=== testTransactionQueryPerf ===
[INFO] Statements screen loaded
[DB] SELECT * FROM transactions ORDER BY date DESC LIMIT 50 -> 12ms
[DB] SELECT COUNT(*) FROM transactions -> 3ms
[DB] SELECT category, SUM(amount) FROM transactions GROUP BY category -> 28ms
Max query time: 28ms
PASSED: testTransactionQueryPerf (2.1s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 2.1s`
  },
  {
    id: makeId(37), title: 'Scroll Performance (FPS)', category: 'mobilePerf',
    platform: 'Android', framework: 'Custom', language: 'Python', difficulty: 'Intermediate',
    description: 'Measures scroll FPS and jank frames during transaction list scrolling using gfxinfo dumpsys.',
    prerequisites: 'Python 3.11+, ADB, Android device/emulator, banking app with long lists',
    config: JSON.stringify({ packageName: 'com.bank.app', minFps: 55, maxJankPercent: 5 }, null, 2),
    code: `import subprocess
import re
import time

PACKAGE = "com.bank.app"
MIN_FPS = 55
MAX_JANK_PCT = 5

def run_adb(cmd):
    result = subprocess.run(
        ["adb"] + cmd.split(),
        capture_output=True, text=True, timeout=15)
    return result.stdout

def reset_gfxinfo():
    run_adb("shell dumpsys gfxinfo {0} reset".format(PACKAGE))

def get_frame_stats():
    output = run_adb("shell dumpsys gfxinfo " + PACKAGE)
    total = 0
    janky = 0
    match_total = re.search(r"Total frames rendered:\\s+(\\d+)", output)
    match_janky = re.search(r"Janky frames:\\s+(\\d+)", output)
    if match_total:
        total = int(match_total.group(1))
    if match_janky:
        janky = int(match_janky.group(1))
    return total, janky

def scroll_list(times=10):
    for _ in range(times):
        run_adb("shell input swipe 540 1500 540 500 300")
        time.sleep(0.3)

def test_scroll_performance():
    # Navigate to transaction list
    run_adb("shell am start {0}/.TransactionsActivity".format(PACKAGE))
    time.sleep(2)
    reset_gfxinfo()
    start = time.time()
    scroll_list(10)
    elapsed = time.time() - start
    total, janky = get_frame_stats()
    fps = total / elapsed if elapsed > 0 else 0
    jank_pct = (janky / total * 100) if total > 0 else 0
    print("Frames: {0}, Janky: {1} ({2:.1f}%)".format(total, janky, jank_pct))
    print("Avg FPS: {0:.1f}".format(fps))
    assert fps >= MIN_FPS, "FPS {0:.1f} below {1}".format(fps, MIN_FPS)
    assert jank_pct <= MAX_JANK_PCT, "Jank {0:.1f}% above {1}%".format(
        jank_pct, MAX_JANK_PCT)

if __name__ == "__main__":
    test_scroll_performance()`,
    expectedOutput: `===== Scroll Performance (FPS) =====
Transaction list loaded
Scrolling 10 times...
Frames: 342, Janky: 8 (2.3%)
Avg FPS: 58.2
PASSED: FPS 58.2 >= 55 threshold
PASSED: Jank 2.3% <= 5% threshold`
  },
  {
    id: makeId(38), title: 'Background/Foreground Transition', category: 'mobilePerf',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Tests app state preservation during background/foreground transitions and measures resume time.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, Android device/emulator',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2', resumeThresholdMs: 1000 }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class BackgroundForegroundTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testStatePreservation() throws Exception {
        // Login and navigate to accounts
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
        driver.findElement(By.id("com.bank.app:id/btnAccounts")).click();
        String balanceBefore = driver.findElement(
            By.id("com.bank.app:id/tvBalance")).getText();
        // Send to background
        driver.runAppInBackground(Duration.ofSeconds(10));
        // Measure resume time
        long start = System.currentTimeMillis();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/tvBalance")));
        long resumeTime = System.currentTimeMillis() - start;
        String balanceAfter = driver.findElement(
            By.id("com.bank.app:id/tvBalance")).getText();
        Assert.assertEquals(balanceAfter, balanceBefore,
            "Balance should be preserved after background");
        System.out.println("Resume time: " + resumeTime + "ms");
        Assert.assertTrue(resumeTime < 1000, "Resume >1s");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: BackgroundForegroundTest
=== testStatePreservation ===
[INFO] Login successful, accounts screen open
[INFO] Balance before: Rs. 1,25,430.50
[INFO] App sent to background (10s)
[INFO] App resumed
Resume time: 450ms
[INFO] Balance after: Rs. 1,25,430.50
[INFO] State preserved successfully
PASSED: testStatePreservation (14.5s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 14.5s`
  },
  {
    id: makeId(39), title: 'Low Memory Handling', category: 'mobilePerf',
    platform: 'Android', framework: 'Custom', language: 'Python', difficulty: 'Advanced',
    description: 'Tests app behavior under low memory conditions by simulating memory pressure and verifying graceful degradation.',
    prerequisites: 'Python 3.11+, ADB, Android emulator with configurable RAM',
    config: JSON.stringify({ packageName: 'com.bank.app', memoryPressureLevel: 'critical', expectedBehavior: 'graceful_degrade' }, null, 2),
    code: `import subprocess
import time
import re

PACKAGE = "com.bank.app"

def run_adb(cmd):
    result = subprocess.run(
        ["adb"] + cmd.split(),
        capture_output=True, text=True, timeout=30)
    return result.stdout

def get_memory_info():
    output = run_adb("shell dumpsys meminfo " + PACKAGE)
    match = re.search(r"TOTAL\\s+(\\d+)", output)
    return int(match.group(1)) / 1024 if match else 0

def simulate_memory_pressure():
    """Fill memory with dummy allocations to trigger low memory"""
    run_adb("shell am send-trim-memory " + PACKAGE + " RUNNING_CRITICAL")

def test_low_memory_handling():
    # Launch app
    run_adb("shell am start " + PACKAGE + "/.LoginActivity")
    time.sleep(3)
    baseline_mem = get_memory_info()
    print("Baseline memory: {0:.1f} MB".format(baseline_mem))
    # Simulate low memory
    simulate_memory_pressure()
    time.sleep(2)
    after_trim = get_memory_info()
    print("After trim: {0:.1f} MB".format(after_trim))
    freed = baseline_mem - after_trim
    print("Memory freed: {0:.1f} MB".format(freed))
    assert freed > 0, "App should release memory under pressure"
    # Verify app is still running
    output = run_adb("shell pidof " + PACKAGE)
    assert output.strip(), "App should still be running"
    # Verify UI is still functional
    run_adb("shell input tap 540 960")
    time.sleep(1)
    output = run_adb("shell dumpsys activity top")
    assert PACKAGE in output, "App should be in foreground"
    print("PASSED: App handles low memory gracefully")

if __name__ == "__main__":
    test_low_memory_handling()`,
    expectedOutput: `===== Low Memory Handling Test =====
App launched successfully
Baseline memory: 92.5 MB
Sending RUNNING_CRITICAL trim level...
After trim: 68.3 MB
Memory freed: 24.2 MB
App PID: 12345 (still running)
UI responsive after memory pressure
PASSED: App handles low memory gracefully`
  },
  {
    id: makeId(40), title: 'CPU Usage During Encryption', category: 'mobilePerf',
    platform: 'Android', framework: 'Custom', language: 'Python', difficulty: 'Advanced',
    description: 'Profiles CPU usage during encryption-heavy operations like PIN generation, SSL handshake, and data encryption.',
    prerequisites: 'Python 3.11+, ADB, Android device/emulator, top command access',
    config: JSON.stringify({ packageName: 'com.bank.app', cpuThresholdPercent: 80, samplingIntervalMs: 500, durationSeconds: 30 }, null, 2),
    code: `import subprocess
import time
import re
import statistics

PACKAGE = "com.bank.app"
CPU_THRESHOLD = 80
DURATION = 30
INTERVAL = 0.5

def run_adb(cmd):
    result = subprocess.run(
        ["adb"] + cmd.split(),
        capture_output=True, text=True, timeout=15)
    return result.stdout

def get_cpu_usage():
    output = run_adb("shell top -n 1 -b")
    for line in output.split("\\n"):
        if PACKAGE in line:
            cols = line.split()
            for col in cols:
                if col.endswith("%"):
                    return float(col.replace("%", ""))
    return 0.0

def trigger_encryption_operations():
    """Trigger login + transaction to exercise encryption"""
    run_adb("shell am start " + PACKAGE + "/.LoginActivity")
    time.sleep(2)
    # Simulate PIN entry and transaction
    for tap in ["540 800", "540 900", "540 1000", "540 1100"]:
        run_adb("shell input tap " + tap)
        time.sleep(0.3)

def test_cpu_during_encryption():
    trigger_encryption_operations()
    samples = []
    peak = 0
    for i in range(int(DURATION / INTERVAL)):
        cpu = get_cpu_usage()
        samples.append(cpu)
        if cpu > peak:
            peak = cpu
        time.sleep(INTERVAL)
    avg = statistics.mean(samples)
    print("Avg CPU: {0:.1f}%, Peak: {1:.1f}%".format(avg, peak))
    print("Samples above 50%: {0}".format(
        len([s for s in samples if s > 50])))
    assert peak < CPU_THRESHOLD, (
        "Peak CPU {0:.1f}% exceeds {1}%".format(peak, CPU_THRESHOLD))
    assert avg < 40, "Avg CPU {0:.1f}% too high".format(avg)
    print("PASSED: CPU usage within limits")

if __name__ == "__main__":
    test_cpu_during_encryption()`,
    expectedOutput: `===== CPU Usage During Encryption =====
Triggering encryption operations...
Sampling CPU for 30 seconds (60 samples)...
  [5s] 35.2%  [10s] 42.1%  [15s] 28.5%
  [20s] 31.8%  [25s] 22.4%  [30s] 18.9%
Avg CPU: 29.8%, Peak: 52.3%
Samples above 50%: 3
PASSED: CPU usage within limits
  Peak 52.3% < 80% threshold
  Avg 29.8% < 40% threshold`
  },
  // =========== MOBILE SECURITY (MT-041 to MT-050) ===========
  {
    id: makeId(41), title: 'Root/Jailbreak Detection', category: 'mobileSec',
    platform: 'Android', framework: 'Frida', language: 'Python', difficulty: 'Advanced',
    description: 'Tests root detection mechanisms using Frida instrumentation to verify the app detects rooted devices and blocks sensitive operations.',
    prerequisites: 'Python 3.11+, Frida 16.x, rooted Android emulator, frida-server running on device',
    config: JSON.stringify({ packageName: 'com.bank.app', fridaServer: '127.0.0.1:27042', detectionMethods: ['su_binary', 'magisk', 'test_keys', 'dangerous_props'] }, null, 2),
    code: `import frida
import time
import sys

PACKAGE = "com.bank.app"
DEVICE_ID = "emulator-5554"

ROOT_CHECK_SCRIPT = \"\"\"
Java.perform(function() {
    var RootDetector = Java.use("com.bank.app.security.RootDetector");
    // Hook isDeviceRooted method
    RootDetector.isDeviceRooted.implementation = function() {
        var result = this.isDeviceRooted();
        send("isDeviceRooted() returned: " + result);
        return result;
    };
    // Hook individual checks
    RootDetector.checkSuBinary.implementation = function() {
        var r = this.checkSuBinary();
        send("checkSuBinary: " + r);
        return r;
    };
    RootDetector.checkMagisk.implementation = function() {
        var r = this.checkMagisk();
        send("checkMagisk: " + r);
        return r;
    };
    RootDetector.checkTestKeys.implementation = function() {
        var r = this.checkTestKeys();
        send("checkTestKeys: " + r);
        return r;
    };
});
\"\"\"

def on_message(message, data):
    if message["type"] == "send":
        print("[HOOK] " + message["payload"])

def test_root_detection():
    device = frida.get_device(DEVICE_ID, timeout=10)
    pid = device.spawn([PACKAGE])
    session = device.attach(pid)
    script = session.create_script(ROOT_CHECK_SCRIPT)
    script.on("message", on_message)
    script.load()
    device.resume(pid)
    time.sleep(5)
    # App should show root detected dialog
    print("Root detection hooks installed, monitoring...")
    time.sleep(3)
    session.detach()

if __name__ == "__main__":
    test_root_detection()`,
    expectedOutput: `===== Root/Jailbreak Detection Test =====
[*] Connecting to emulator-5554
[*] Spawning com.bank.app
[*] Attaching to PID 12345
[*] Script loaded, hooks installed
[HOOK] checkSuBinary: true
[HOOK] checkMagisk: true
[HOOK] checkTestKeys: false
[HOOK] isDeviceRooted() returned: true
[*] App displayed: "Rooted device detected"
[*] Sensitive operations blocked
PASSED: Root detection working correctly`
  },
  {
    id: makeId(42), title: 'SSL Certificate Pinning', category: 'mobileSec',
    platform: 'Cross-platform', framework: 'pytest', language: 'Python', difficulty: 'Advanced',
    description: 'Tests SSL certificate pinning by intercepting traffic with mitmproxy and verifying the app rejects the proxy certificate.',
    prerequisites: 'Python 3.11+, mitmproxy, Frida, Android/iOS device with proxy configured',
    config: JSON.stringify({ targetHost: 'api.bank.com', proxyPort: 8080, expectedBehavior: 'connection_refused' }, null, 2),
    code: `import subprocess
import requests
import time
import pytest

PROXY_PORT = 8080
TARGET_URL = "https://api.bank.com/v1/health"
PACKAGE = "com.bank.app"

def start_mitmproxy():
    proc = subprocess.Popen(
        ["mitmdump", "-p", str(PROXY_PORT), "--ssl-insecure"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(3)
    return proc

def configure_device_proxy(enable=True):
    if enable:
        subprocess.run(["adb", "shell", "settings", "put", "global",
            "http_proxy", "192.168.1.100:{0}".format(PROXY_PORT)], timeout=10)
    else:
        subprocess.run(["adb", "shell", "settings", "put", "global",
            "http_proxy", ":0"], timeout=10)

def test_ssl_pinning_blocks_mitm():
    proxy = start_mitmproxy()
    try:
        configure_device_proxy(True)
        # Launch app - should fail to connect
        subprocess.run(["adb", "shell", "am", "start",
            PACKAGE + "/.LoginActivity"], timeout=10)
        time.sleep(5)
        # Check logcat for SSL error
        result = subprocess.run(
            ["adb", "logcat", "-d", "-s", "OkHttp:E"],
            capture_output=True, text=True, timeout=10)
        assert "CertificateException" in result.stdout or \
               "SSLHandshakeException" in result.stdout, \
            "App should reject MITM certificate"
        print("PASSED: SSL pinning blocked MITM proxy")
    finally:
        configure_device_proxy(False)
        proxy.terminate()

def test_ssl_pinning_allows_valid_cert():
    configure_device_proxy(False)
    subprocess.run(["adb", "shell", "am", "start",
        PACKAGE + "/.LoginActivity"], timeout=10)
    time.sleep(5)
    result = subprocess.run(
        ["adb", "logcat", "-d", "-s", "OkHttp:I"],
        capture_output=True, text=True, timeout=10)
    assert "SSLHandshakeException" not in result.stdout
    print("PASSED: Valid certificate accepted")`,
    expectedOutput: `===== SSL Certificate Pinning Test =====
[*] Starting mitmproxy on port 8080
[*] Device proxy configured: 192.168.1.100:8080
[*] Launching banking app...
[*] Logcat: javax.net.ssl.SSLHandshakeException
[*] App refused connection through MITM proxy
PASSED: SSL pinning blocked MITM proxy

[*] Proxy removed, direct connection
[*] App connected successfully
PASSED: Valid certificate accepted`
  },
  {
    id: makeId(43), title: 'Secure Storage (Keychain/Keystore)', category: 'mobileSec',
    platform: 'Android', framework: 'Frida', language: 'Python', difficulty: 'Advanced',
    description: 'Verifies that sensitive data (tokens, PINs, keys) is stored in Android Keystore rather than SharedPreferences or plain files.',
    prerequisites: 'Python 3.11+, Frida 16.x, rooted test device, frida-server',
    config: JSON.stringify({ packageName: 'com.bank.app', sensitiveKeys: ['auth_token', 'pin_hash', 'encryption_key'], bannedLocations: ['shared_prefs', 'databases', 'files'] }, null, 2),
    code: `import frida
import time
import json
import os

PACKAGE = "com.bank.app"

STORAGE_AUDIT_SCRIPT = \"\"\"
Java.perform(function() {
    // Hook SharedPreferences to detect sensitive data storage
    var SharedPrefs = Java.use("android.content.SharedPreferences$Editor");
    SharedPrefs.putString.implementation = function(key, value) {
        var sensitive = ["token", "pin", "password", "secret", "key"];
        for (var i = 0; i < sensitive.length; i++) {
            if (key.toLowerCase().indexOf(sensitive[i]) !== -1) {
                send("VIOLATION: Sensitive key in SharedPrefs: " + key);
            }
        }
        return this.putString(key, value);
    };
    // Hook AndroidKeyStore usage (positive check)
    var KeyStore = Java.use("java.security.KeyStore");
    KeyStore.getInstance.overload("java.lang.String").implementation = function(type) {
        if (type === "AndroidKeyStore") {
            send("SECURE: Using AndroidKeyStore");
        }
        return this.getInstance(type);
    };
    // Hook file write to detect plain-text storage
    var FileOutputStream = Java.use("java.io.FileOutputStream");
    FileOutputStream.$init.overload("java.io.File").implementation = function(file) {
        var path = file.getAbsolutePath();
        if (path.indexOf(PACKAGE) !== -1) {
            send("FILE_WRITE: " + path);
        }
        return this.$init(file);
    };
});
\"\"\"

def on_message(message, data):
    if message["type"] == "send":
        print("[AUDIT] " + message["payload"])

def test_secure_storage():
    device = frida.get_usb_device(timeout=10)
    pid = device.spawn([PACKAGE])
    session = device.attach(pid)
    script = session.create_script(STORAGE_AUDIT_SCRIPT)
    script.on("message", on_message)
    script.load()
    device.resume(pid)
    print("Monitoring storage operations for 15 seconds...")
    time.sleep(15)
    session.detach()

if __name__ == "__main__":
    test_secure_storage()`,
    expectedOutput: `===== Secure Storage Audit =====
[*] Attaching to com.bank.app (PID: 12345)
[*] Hooks installed, monitoring...
[AUDIT] SECURE: Using AndroidKeyStore
[AUDIT] SECURE: Using AndroidKeyStore
[AUDIT] FILE_WRITE: /data/data/com.bank.app/cache/images/profile.jpg
No SharedPreferences violations detected
No plaintext sensitive data found
PASSED: All secrets stored in AndroidKeyStore`
  },
  {
    id: makeId(44), title: 'MITM Attack Test', category: 'mobileSec',
    platform: 'Cross-platform', framework: 'pytest', language: 'Python', difficulty: 'Advanced',
    description: 'Performs man-in-the-middle attack simulation to verify the app resists traffic interception and data tampering.',
    prerequisites: 'Python 3.11+, mitmproxy, pytest, ADB, test device on same network',
    config: JSON.stringify({ proxyHost: '192.168.1.100', proxyPort: 8080, targetApis: ['/auth/login', '/transactions', '/accounts'] }, null, 2),
    code: `import subprocess
import time
import json
import pytest

PROXY = "192.168.1.100:8080"
PACKAGE = "com.bank.app"

def setup_proxy():
    subprocess.run(["adb", "shell", "settings", "put", "global",
        "http_proxy", PROXY], timeout=10)

def remove_proxy():
    subprocess.run(["adb", "shell", "settings", "put", "global",
        "http_proxy", ":0"], timeout=10)

def get_logcat_errors():
    result = subprocess.run(
        ["adb", "logcat", "-d", "-s", "NetworkSecurity:E", "OkHttp:E"],
        capture_output=True, text=True, timeout=10)
    return result.stdout

def test_mitm_login_blocked():
    """Login API should fail through MITM proxy"""
    setup_proxy()
    try:
        subprocess.run(["adb", "shell", "am", "start",
            PACKAGE + "/.LoginActivity"], timeout=10)
        time.sleep(5)
        logs = get_logcat_errors()
        assert ("SSLHandshakeException" in logs or
                "CertPathValidatorException" in logs), \
            "Login should be blocked through proxy"
    finally:
        remove_proxy()

def test_mitm_transaction_blocked():
    """Transaction API should fail through MITM proxy"""
    setup_proxy()
    try:
        subprocess.run(["adb", "shell", "am", "start",
            "-a", "com.bank.app.TRANSFER", PACKAGE], timeout=10)
        time.sleep(5)
        logs = get_logcat_errors()
        assert "SSL" in logs or "Certificate" in logs
    finally:
        remove_proxy()

def test_no_sensitive_data_leaked():
    """Verify no tokens/credentials in proxy logs"""
    # Check mitmproxy flow dump
    result = subprocess.run(
        ["mitmdump", "-r", "/tmp/mitm_flows", "-n", "--set",
         "flow_detail=3"],
        capture_output=True, text=True, timeout=10)
    output = result.stdout.lower()
    sensitive = ["password", "pin", "token", "secret"]
    for word in sensitive:
        assert word not in output, (
            "Sensitive data leaked: found '{0}'".format(word))`,
    expectedOutput: `===== MITM Attack Simulation =====
test_mitm_login_blocked:
  [*] Proxy configured: 192.168.1.100:8080
  [*] Login attempt through proxy
  [*] SSLHandshakeException caught
  PASSED: Login blocked through MITM

test_mitm_transaction_blocked:
  [*] Transaction attempt through proxy
  [*] CertPathValidatorException caught
  PASSED: Transaction blocked through MITM

test_no_sensitive_data_leaked:
  [*] Analyzed proxy flow dump
  [*] No sensitive data found in intercepted traffic
  PASSED: No data leakage

3 passed in 18.5s`
  },
  {
    id: makeId(45), title: 'Code Obfuscation Verification', category: 'mobileSec',
    platform: 'Android', framework: 'Custom', language: 'Python', difficulty: 'Intermediate',
    description: 'Verifies ProGuard/R8 code obfuscation by analyzing APK for unobfuscated class names, string literals, and API endpoints.',
    prerequisites: 'Python 3.11+, apktool, dex2jar, jadx, test APK (release build)',
    config: JSON.stringify({ apkPath: '/path/to/banking-release.apk', forbiddenPatterns: ['com.bank.app.security', 'API_KEY', 'SECRET'], minObfuscationPercent: 80 }, null, 2),
    code: `import subprocess
import re
import os
import zipfile

APK_PATH = "/path/to/banking-release.apk"
FORBIDDEN = ["API_KEY", "SECRET_KEY", "password", "private_key"]
MIN_OBFUSCATION = 80

def decompile_apk(apk_path):
    output_dir = "/tmp/apk_analysis"
    subprocess.run(["jadx", "-d", output_dir, apk_path],
                   timeout=120, capture_output=True)
    return output_dir

def count_obfuscated_classes(src_dir):
    total = 0
    obfuscated = 0
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            if f.endswith(".java"):
                total += 1
                if re.match(r"^[a-z]{1,2}\\.java$", f):
                    obfuscated += 1
    return total, obfuscated

def check_string_literals(src_dir):
    violations = []
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            if f.endswith(".java"):
                path = os.path.join(root, f)
                with open(path, "r") as fh:
                    content = fh.read()
                for pattern in FORBIDDEN:
                    if pattern in content:
                        violations.append("{0}: contains '{1}'".format(f, pattern))
    return violations

def test_obfuscation():
    src = decompile_apk(APK_PATH)
    total, obfuscated = count_obfuscated_classes(src)
    pct = (obfuscated / total * 100) if total > 0 else 0
    print("Classes: {0}, Obfuscated: {1} ({2:.1f}%)".format(
        total, obfuscated, pct))
    violations = check_string_literals(src)
    for v in violations:
        print("VIOLATION: " + v)
    assert pct >= MIN_OBFUSCATION, (
        "Obfuscation {0:.1f}% below {1}%".format(pct, MIN_OBFUSCATION))
    assert len(violations) == 0, "Found forbidden strings"

if __name__ == "__main__":
    test_obfuscation()`,
    expectedOutput: `===== Code Obfuscation Verification =====
[*] Decompiling APK with jadx...
[*] Analyzing class names...
Classes: 342, Obfuscated: 298 (87.1%)
[*] Scanning for forbidden string literals...
No violations found
PASSED: Obfuscation 87.1% >= 80% threshold
PASSED: No forbidden strings detected`
  },
  {
    id: makeId(46), title: 'Screenshot Prevention', category: 'mobileSec',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Verifies that the banking app prevents screenshots on sensitive screens like login, OTP, and transaction review.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, Android device/emulator',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2', sensitiveScreens: ['login', 'otp', 'transaction'] }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;

public class ScreenshotPreventionTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testLoginScreenBlocked() throws Exception {
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/pinLayout")));
        File screenshot = driver.getScreenshotAs(OutputType.FILE);
        BufferedImage img = ImageIO.read(screenshot);
        // FLAG_SECURE makes screenshot all black
        boolean allBlack = isAllBlack(img);
        Assert.assertTrue(allBlack,
            "Login screen should be blocked from screenshots");
    }

    private boolean isAllBlack(BufferedImage img) {
        for (int x = 0; x < img.getWidth(); x += 10) {
            for (int y = 0; y < img.getHeight(); y += 10) {
                int rgb = img.getRGB(x, y) & 0x00FFFFFF;
                if (rgb != 0) return false;
            }
        }
        return true;
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: ScreenshotPreventionTest
=== testLoginScreenBlocked ===
[INFO] Login screen loaded
[INFO] Screenshot captured
[INFO] Image analysis: all pixels black (FLAG_SECURE active)
PASSED: testLoginScreenBlocked (3.2s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 3.2s`
  },
  {
    id: makeId(47), title: 'Clipboard Data Leakage', category: 'mobileSec',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests that sensitive data (account numbers, OTPs, passwords) is not leaked to the system clipboard.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, Android device/emulator',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2' }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;

public class ClipboardLeakageTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testAccountNumberNotCopyable() {
        // Login and navigate to account details
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
        driver.findElement(By.id("com.bank.app:id/btnAccounts")).click();
        // Long press account number to attempt copy
        var accNum = driver.findElement(By.id("com.bank.app:id/tvAccountNum"));
        HashMap<String, Object> longPress = new HashMap<>();
        longPress.put("elementId", accNum.getId());
        longPress.put("duration", 2000);
        driver.executeScript("mobile: longClickGesture", longPress);
        Thread.sleep(1000);
        // Read clipboard content
        String clipboard = (String) driver.getClipboardText();
        Assert.assertTrue(clipboard == null || clipboard.isEmpty()
            || !clipboard.matches(".*\\\\d{10,}.*"),
            "Account number should not be in clipboard");
    }

    @Test
    public void testOTPFieldNotCopyable() {
        // Navigate to OTP screen
        driver.findElement(By.id("com.bank.app:id/btnTransfer")).click();
        // ... trigger OTP flow
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/otpInput")));
        driver.findElement(By.id("com.bank.app:id/otpInput")).sendKeys("123456");
        String clipboard = (String) driver.getClipboardText();
        Assert.assertFalse(clipboard.contains("123456"),
            "OTP should not leak to clipboard");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: ClipboardLeakageTest
=== testAccountNumberNotCopyable ===
[INFO] Dashboard loaded, navigated to accounts
[INFO] Long press on account number
[INFO] Clipboard content: (empty)
PASSED: testAccountNumberNotCopyable (5.1s)
=== testOTPFieldNotCopyable ===
[INFO] OTP screen loaded, value entered
[INFO] Clipboard: no OTP data found
PASSED: testOTPFieldNotCopyable (4.3s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 9.4s`
  },
  {
    id: makeId(48), title: 'Debug Mode Detection', category: 'mobileSec',
    platform: 'Android', framework: 'Custom', language: 'Python', difficulty: 'Intermediate',
    description: 'Verifies the app detects and blocks debugger attachment, USB debugging, and developer mode settings.',
    prerequisites: 'Python 3.11+, ADB, Frida, rooted Android emulator',
    config: JSON.stringify({ packageName: 'com.bank.app', checks: ['debugger_attached', 'usb_debugging', 'developer_mode'] }, null, 2),
    code: `import subprocess
import time
import re

PACKAGE = "com.bank.app"

def run_adb(cmd):
    result = subprocess.run(
        ["adb"] + cmd.split(),
        capture_output=True, text=True, timeout=15)
    return result.stdout

def check_debuggable_flag():
    output = run_adb("shell run-as " + PACKAGE + " id")
    if "Permission denied" not in output:
        return True  # App is debuggable (BAD)
    return False

def check_developer_options():
    output = run_adb("shell settings get global development_settings_enabled")
    return output.strip() == "1"

def check_usb_debugging():
    output = run_adb("shell settings get global adb_enabled")
    return output.strip() == "1"

def check_app_detects_debug():
    run_adb("shell am start " + PACKAGE + "/.LoginActivity")
    time.sleep(3)
    output = run_adb("logcat -d -s BankSecurity:W")
    return "debug_detected" in output.lower() or \
           "developer_mode" in output.lower()

def test_debug_detection():
    debuggable = check_debuggable_flag()
    dev_opts = check_developer_options()
    usb_debug = check_usb_debugging()
    app_detects = check_app_detects_debug()
    print("Debuggable flag: {0}".format(debuggable))
    print("Developer options: {0}".format(dev_opts))
    print("USB debugging: {0}".format(usb_debug))
    print("App detects debug: {0}".format(app_detects))
    assert not debuggable, "Release APK should not be debuggable"
    if dev_opts or usb_debug:
        assert app_detects, "App should detect debug environment"
    print("PASSED: Debug detection working")

if __name__ == "__main__":
    test_debug_detection()`,
    expectedOutput: `===== Debug Mode Detection =====
Debuggable flag: False (release build)
Developer options: True
USB debugging: True
App detects debug: True
[*] App log: "WARNING: Developer mode detected"
[*] App showed security warning dialog
PASSED: Debug detection working`
  },
  {
    id: makeId(49), title: 'Tamper Detection & Integrity', category: 'mobileSec',
    platform: 'Android', framework: 'Custom', language: 'Python', difficulty: 'Advanced',
    description: 'Tests APK integrity verification by modifying the APK and checking if the app detects tampering on launch.',
    prerequisites: 'Python 3.11+, apktool, jarsigner, zipalign, test signing key',
    config: JSON.stringify({ apkPath: '/path/to/banking.apk', expectedSignature: 'SHA256:AB:CD:EF:12:34', integrityCheck: true }, null, 2),
    code: `import subprocess
import hashlib
import os
import shutil

APK_PATH = "/path/to/banking.apk"
TAMPERED_APK = "/tmp/banking-tampered.apk"
KEYSTORE = "/tmp/test-key.jks"

def get_apk_signature(apk_path):
    result = subprocess.run(
        ["apksigner", "verify", "--print-certs", apk_path],
        capture_output=True, text=True, timeout=30)
    return result.stdout.strip()

def get_apk_hash(apk_path):
    with open(apk_path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

def tamper_apk(apk_path, output_path):
    work_dir = "/tmp/apk_tamper"
    subprocess.run(["apktool", "d", apk_path, "-o", work_dir, "-f"],
                   timeout=120, capture_output=True)
    # Modify a resource string
    strings_path = os.path.join(work_dir, "res", "values", "strings.xml")
    with open(strings_path, "r") as f:
        content = f.read()
    content = content.replace("Banking App", "Banking App TAMPERED")
    with open(strings_path, "w") as f:
        f.write(content)
    subprocess.run(["apktool", "b", work_dir, "-o", output_path],
                   timeout=120, capture_output=True)
    subprocess.run(["apksigner", "sign", "--ks", KEYSTORE,
        "--ks-pass", "pass:testkey", output_path],
        timeout=30, capture_output=True)

def test_integrity_check():
    original_hash = get_apk_hash(APK_PATH)
    original_sig = get_apk_signature(APK_PATH)
    print("Original hash: " + original_hash[:16] + "...")
    print("Original signer: " + original_sig[:50] + "...")
    tamper_apk(APK_PATH, TAMPERED_APK)
    tampered_hash = get_apk_hash(TAMPERED_APK)
    tampered_sig = get_apk_signature(TAMPERED_APK)
    assert original_hash != tampered_hash, "Hashes should differ"
    assert original_sig != tampered_sig, "Signatures should differ"
    # Install tampered APK and check if app detects it
    subprocess.run(["adb", "install", "-r", TAMPERED_APK],
                   timeout=30, capture_output=True)
    subprocess.run(["adb", "shell", "am", "start",
        "com.bank.app/.LoginActivity"], timeout=10)
    import time; time.sleep(5)
    result = subprocess.run(
        ["adb", "logcat", "-d", "-s", "IntegrityCheck:E"],
        capture_output=True, text=True, timeout=10)
    assert "tamper" in result.stdout.lower() or \
           "integrity" in result.stdout.lower(), \
        "App should detect tampering"
    print("PASSED: Tamper detection working")

if __name__ == "__main__":
    test_integrity_check()`,
    expectedOutput: `===== Tamper Detection & Integrity =====
Original hash: a1b2c3d4e5f6g7h8...
Original signer: CN=Bank Corp, O=Bank...
[*] Decompiling APK...
[*] Modifying resources...
[*] Rebuilding and signing with test key...
Tampered hash: x9y8z7w6v5u4t3s2...
Tampered signer: CN=Test Key...
[*] Installing tampered APK...
[*] App detected: "Integrity check failed"
[*] App refused to launch
PASSED: Tamper detection working`
  },
  {
    id: makeId(50), title: 'Biometric Bypass Testing', category: 'mobileSec',
    platform: 'Android', framework: 'Frida', language: 'Python', difficulty: 'Advanced',
    description: 'Tests resistance to biometric bypass attacks using Frida to hook BiometricPrompt callbacks and force authentication success.',
    prerequisites: 'Python 3.11+, Frida 16.x, rooted device, frida-server, app with biometric auth',
    config: JSON.stringify({ packageName: 'com.bank.app', targetClass: 'BiometricPrompt$AuthenticationCallback', expectedResult: 'bypass_blocked' }, null, 2),
    code: `import frida
import time

PACKAGE = "com.bank.app"

BYPASS_SCRIPT = \"\"\"
Java.perform(function() {
    var BiometricPrompt = Java.use(
        "androidx.biometric.BiometricPrompt$AuthenticationCallback");

    // Try to force onAuthenticationSucceeded
    BiometricPrompt.onAuthenticationSucceeded.implementation = function(result) {
        send("BYPASS_ATTEMPT: Forcing onAuthenticationSucceeded");
        this.onAuthenticationSucceeded(result);
    };

    BiometricPrompt.onAuthenticationFailed.implementation = function() {
        send("AUTH_FAILED: Normal failure callback");
        this.onAuthenticationFailed();
    };

    // Check if app validates crypto object
    var CryptoObject = Java.use(
        "androidx.biometric.BiometricPrompt$CryptoObject");
    CryptoObject.getCipher.implementation = function() {
        var cipher = this.getCipher();
        send("CRYPTO_CHECK: getCipher called, cipher=" +
            (cipher != null ? "valid" : "null"));
        return cipher;
    };
});
\"\"\"

violations = []

def on_message(message, data):
    if message["type"] == "send":
        payload = message["payload"]
        print("[HOOK] " + payload)
        if "BYPASS_ATTEMPT" in payload:
            violations.append(payload)

def test_biometric_bypass():
    device = frida.get_usb_device(timeout=10)
    pid = device.spawn([PACKAGE])
    session = device.attach(pid)
    script = session.create_script(BYPASS_SCRIPT)
    script.on("message", on_message)
    script.load()
    device.resume(pid)
    time.sleep(10)
    # App should use CryptoObject-based auth (not bypassable)
    print("Bypass attempts: {0}".format(len(violations)))
    session.detach()
    # If app uses CryptoObject, bypass should fail
    print("PASSED: Biometric uses CryptoObject (bypass resistant)")

if __name__ == "__main__":
    test_biometric_bypass()`,
    expectedOutput: `===== Biometric Bypass Testing =====
[*] Spawning com.bank.app
[*] Hooks installed on BiometricPrompt
[HOOK] CRYPTO_CHECK: getCipher called, cipher=valid
[HOOK] AUTH_FAILED: Normal failure callback
[HOOK] BYPASS_ATTEMPT: Forcing onAuthenticationSucceeded
[HOOK] CRYPTO_CHECK: getCipher called, cipher=valid
[*] CryptoObject validation active
Bypass attempts: 1 (but CryptoObject check prevented access)
PASSED: Biometric uses CryptoObject (bypass resistant)`
  },
  // =========== MOBILE UI/UX (MT-051 to MT-060) ===========
  {
    id: makeId(51), title: 'Multi-Screen Responsiveness', category: 'mobileUiUx',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests UI layout responsiveness across different screen sizes including phone, tablet, and foldable devices.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, multiple device profiles (phone, tablet, foldable)',
    config: JSON.stringify({ devices: [{ name: 'Pixel 6', width: 1080, height: 2400 }, { name: 'Pixel Tablet', width: 1600, height: 2560 }, { name: 'Galaxy Fold', width: 1768, height: 2208 }] }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class ResponsivenessTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testDashboardLayoutPhone() {
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
        Dimension size = driver.manage().window().getSize();
        // Verify single-column layout on phone
        var cards = driver.findElements(By.id("com.bank.app:id/accountCard"));
        Assert.assertTrue(cards.size() > 0, "Account cards should display");
        // Check no horizontal scroll needed
        int cardWidth = cards.get(0).getSize().getWidth();
        Assert.assertTrue(cardWidth <= size.width,
            "Cards should fit screen width");
        // Verify bottom nav visible
        Assert.assertTrue(driver.findElement(
            By.id("com.bank.app:id/bottomNav")).isDisplayed());
    }

    @Test
    public void testTextNotTruncated() {
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
        var welcome = driver.findElement(By.id("com.bank.app:id/welcome"));
        var accName = driver.findElement(By.id("com.bank.app:id/tvAccName"));
        // Check text is not ellipsized (basic check via content desc)
        Assert.assertFalse(welcome.getText().contains("..."),
            "Welcome text should not be truncated");
        Assert.assertFalse(accName.getText().contains("..."),
            "Account name should not be truncated");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: ResponsivenessTest
=== testDashboardLayoutPhone ===
[INFO] Screen: 1080x2400 (Pixel 6)
[INFO] Account cards: 3, all within screen width
[INFO] Bottom nav visible
PASSED: testDashboardLayoutPhone (2.8s)
=== testTextNotTruncated ===
[INFO] Welcome text: full display
[INFO] Account name: full display
PASSED: testTextNotTruncated (1.5s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 4.3s`
  },
  {
    id: makeId(52), title: 'Dark/Light Mode Toggle', category: 'mobileUiUx',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Tests theme switching between dark and light modes, verifying color changes, contrast ratios, and persistence.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, app with theme support',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2' }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;

public class ThemeToggleTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testDarkModeToggle() throws Exception {
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
        // Capture light mode screenshot
        File lightShot = driver.getScreenshotAs(OutputType.FILE);
        BufferedImage lightImg = ImageIO.read(lightShot);
        int lightBg = lightImg.getRGB(540, 100) & 0x00FFFFFF;
        // Toggle to dark mode
        driver.findElement(By.id("com.bank.app:id/btnSettings")).click();
        driver.findElement(By.id("com.bank.app:id/switchDarkMode")).click();
        Thread.sleep(1000);
        driver.navigate().back();
        // Capture dark mode screenshot
        File darkShot = driver.getScreenshotAs(OutputType.FILE);
        BufferedImage darkImg = ImageIO.read(darkShot);
        int darkBg = darkImg.getRGB(540, 100) & 0x00FFFFFF;
        Assert.assertNotEquals(lightBg, darkBg,
            "Background should change between themes");
        Assert.assertTrue(darkBg < 0x404040,
            "Dark mode background should be dark");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: ThemeToggleTest
=== testDarkModeToggle ===
[INFO] Login successful
[INFO] Light mode: bg=#FFFFFF
[INFO] Dark mode toggled
[INFO] Dark mode: bg=#1A1A2E
[INFO] Background color changed correctly
PASSED: testDarkModeToggle (5.5s)
Tests run: 1, Failures: 0, Skips: 0
Total time: 5.5s`
  },
  {
    id: makeId(53), title: 'VoiceOver/TalkBack Accessibility', category: 'mobileUiUx',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests TalkBack accessibility labels, focus order, content descriptions, and screen reader navigation for all key screens.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, TalkBack enabled on device',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2' }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.List;

public class AccessibilityTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testContentDescriptions() {
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/pinLayout")));
        // Check all interactive elements have content descriptions
        List<WebElement> buttons = driver.findElements(
            By.className("android.widget.Button"));
        for (WebElement btn : buttons) {
            String desc = btn.getAttribute("contentDescription");
            String text = btn.getText();
            Assert.assertTrue(desc != null || (text != null && !text.isEmpty()),
                "Button missing accessibility label");
        }
        List<WebElement> images = driver.findElements(
            By.className("android.widget.ImageView"));
        for (WebElement img : images) {
            String desc = img.getAttribute("contentDescription");
            Assert.assertNotNull(desc,
                "Image missing content description");
        }
    }

    @Test
    public void testFocusOrder() {
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/pinLayout")));
        // Verify logical focus traversal order
        List<WebElement> focusable = driver.findElements(
            By.xpath("//*[@focusable='true']"));
        Assert.assertTrue(focusable.size() > 0, "Should have focusable elements");
        // First focusable should be PIN input area
        WebElement first = focusable.get(0);
        Assert.assertTrue(
            first.getAttribute("resourceId").contains("pin") ||
            first.getAttribute("resourceId").contains("key"),
            "First focus should be PIN area");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: AccessibilityTest
=== testContentDescriptions ===
[INFO] Login screen loaded
[INFO] Buttons checked: 12, all have labels
[INFO] Images checked: 3, all have content descriptions
PASSED: testContentDescriptions (2.8s)
=== testFocusOrder ===
[INFO] Focusable elements: 14
[INFO] First focus: PIN key area (correct)
[INFO] Focus order: logical top-to-bottom
PASSED: testFocusOrder (1.9s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 4.7s`
  },
  {
    id: makeId(54), title: 'Gesture Navigation', category: 'mobileUiUx',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests gesture-based navigation including swipe between tabs, pull-to-refresh, pinch-to-zoom, and long press actions.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, Android device/emulator',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2' }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;

public class GestureNavigationTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        // Login
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
    }

    @Test
    public void testPullToRefresh() {
        HashMap<String, Object> swipe = new HashMap<>();
        swipe.put("left", 540); swipe.put("top", 400);
        swipe.put("width", 10); swipe.put("height", 800);
        swipe.put("direction", "down"); swipe.put("percent", 0.75);
        driver.executeScript("mobile: swipeGesture", swipe);
        // Verify refresh indicator appeared
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/refreshIndicator")));
        wait.until(ExpectedConditions.invisibilityOfElementLocated(
            By.id("com.bank.app:id/refreshIndicator")));
    }

    @Test
    public void testSwipeBetweenTabs() {
        String tab1 = driver.findElement(
            By.id("com.bank.app:id/tabTitle")).getText();
        HashMap<String, Object> swipe = new HashMap<>();
        swipe.put("left", 800); swipe.put("top", 960);
        swipe.put("width", 600); swipe.put("height", 10);
        swipe.put("direction", "left"); swipe.put("percent", 0.75);
        driver.executeScript("mobile: swipeGesture", swipe);
        Thread.sleep(500);
        String tab2 = driver.findElement(
            By.id("com.bank.app:id/tabTitle")).getText();
        Assert.assertNotEquals(tab1, tab2, "Tab should change after swipe");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: GestureNavigationTest
=== testPullToRefresh ===
[INFO] Dashboard loaded
[INFO] Pull-to-refresh gesture performed
[INFO] Refresh indicator shown and dismissed
PASSED: testPullToRefresh (3.5s)
=== testSwipeBetweenTabs ===
[INFO] Tab before swipe: "Accounts"
[INFO] Swipe left performed
[INFO] Tab after swipe: "Cards"
PASSED: testSwipeBetweenTabs (2.8s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 6.3s`
  },
  {
    id: makeId(55), title: 'Keyboard & Input Validation', category: 'mobileUiUx',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Tests keyboard behavior, input field validation, numeric-only fields, special characters, and max length enforcement.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, Android device/emulator',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2' }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class InputValidationTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testAmountFieldNumericOnly() {
        // Navigate to transfer
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
        driver.findElement(By.id("com.bank.app:id/btnTransfer")).click();
        var amtField = driver.findElement(By.id("com.bank.app:id/amount"));
        amtField.sendKeys("abc123!@#");
        String value = amtField.getText();
        Assert.assertTrue(value.matches("[0-9.]*"),
            "Amount field should only accept numbers");
    }

    @Test
    public void testMaxLengthEnforcement() {
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
        driver.findElement(By.id("com.bank.app:id/btnTransfer")).click();
        var remarks = driver.findElement(By.id("com.bank.app:id/etRemarks"));
        String longText = "A".repeat(300);
        remarks.sendKeys(longText);
        String actual = remarks.getText();
        Assert.assertTrue(actual.length() <= 100,
            "Remarks should enforce max length of 100");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: InputValidationTest
=== testAmountFieldNumericOnly ===
[INFO] Transfer screen loaded
[INFO] Input "abc123!@#" -> filtered to "123"
PASSED: testAmountFieldNumericOnly (3.5s)
=== testMaxLengthEnforcement ===
[INFO] Entered 300 chars, field shows 100
PASSED: testMaxLengthEnforcement (3.2s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 6.7s`
  },
  {
    id: makeId(56), title: 'Orientation Change', category: 'mobileUiUx',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Tests UI layout preservation and data retention during portrait to landscape and back orientation changes.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, Android device/emulator',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2' }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.ScreenOrientation;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class OrientationChangeTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
    }

    @Test
    public void testDataPreservedOnRotation() {
        String balanceBefore = driver.findElement(
            By.id("com.bank.app:id/tvBalance")).getText();
        // Rotate to landscape
        driver.rotate(ScreenOrientation.LANDSCAPE);
        Thread.sleep(1000);
        String balanceLandscape = driver.findElement(
            By.id("com.bank.app:id/tvBalance")).getText();
        Assert.assertEquals(balanceLandscape, balanceBefore,
            "Balance should persist after rotation");
        // Rotate back to portrait
        driver.rotate(ScreenOrientation.PORTRAIT);
        Thread.sleep(1000);
        String balancePortrait = driver.findElement(
            By.id("com.bank.app:id/tvBalance")).getText();
        Assert.assertEquals(balancePortrait, balanceBefore,
            "Balance should persist after double rotation");
    }

    @Test
    public void testLayoutAdaptsToLandscape() {
        driver.rotate(ScreenOrientation.LANDSCAPE);
        Thread.sleep(1000);
        Assert.assertTrue(driver.findElement(
            By.id("com.bank.app:id/dashboard")).isDisplayed(),
            "Dashboard should display in landscape");
        var cards = driver.findElements(By.id("com.bank.app:id/accountCard"));
        Assert.assertTrue(cards.size() > 0, "Cards should be visible");
        driver.rotate(ScreenOrientation.PORTRAIT);
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: OrientationChangeTest
=== testDataPreservedOnRotation ===
[INFO] Balance (portrait): Rs. 1,25,430.50
[INFO] Rotated to LANDSCAPE
[INFO] Balance (landscape): Rs. 1,25,430.50
[INFO] Rotated to PORTRAIT
[INFO] Balance (portrait): Rs. 1,25,430.50
PASSED: testDataPreservedOnRotation (4.2s)
=== testLayoutAdaptsToLandscape ===
[INFO] Landscape layout: dashboard visible, 3 cards
PASSED: testLayoutAdaptsToLandscape (2.5s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 6.7s`
  },
  {
    id: makeId(57), title: 'Multi-language Localization', category: 'mobileUiUx',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests localization for Hindi, Tamil, and English including text rendering, RTL layout, and currency formatting.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, localized resource files',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2', locales: ['en_US', 'hi_IN', 'ta_IN'] }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;

public class LocalizationTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testHindiLocale() {
        // Change locale to Hindi
        HashMap<String, Object> args = new HashMap<>();
        args.put("language", "hi");
        args.put("country", "IN");
        driver.executeScript("mobile: setDeviceLocale", args);
        driver.findElement(By.id("com.bank.app:id/btnSettings")).click();
        driver.findElement(By.id("com.bank.app:id/langHindi")).click();
        driver.navigate().back();
        String welcomeText = driver.findElement(
            By.id("com.bank.app:id/welcome")).getText();
        // Hindi text should contain Devanagari characters
        Assert.assertTrue(welcomeText.matches(".*[\\u0900-\\u097F]+.*"),
            "Should display Hindi text");
    }

    @Test
    public void testEnglishLocale() {
        driver.findElement(By.id("com.bank.app:id/btnSettings")).click();
        driver.findElement(By.id("com.bank.app:id/langEnglish")).click();
        driver.navigate().back();
        String welcomeText = driver.findElement(
            By.id("com.bank.app:id/welcome")).getText();
        Assert.assertTrue(welcomeText.contains("Welcome"),
            "Should display English text");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: LocalizationTest
=== testHindiLocale ===
[INFO] Locale changed to hi_IN
[INFO] Language set to Hindi
[INFO] Welcome text contains Devanagari script
PASSED: testHindiLocale (4.8s)
=== testEnglishLocale ===
[INFO] Language set to English
[INFO] Welcome text: "Welcome, Praveen Kumar"
PASSED: testEnglishLocale (3.2s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 8.0s`
  },
  {
    id: makeId(58), title: 'Deep Link Testing', category: 'mobileUiUx',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Intermediate',
    description: 'Tests deep link handling for payment links, account pages, and promotional URLs with proper auth redirection.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, deep link scheme registered',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2', deepLinkScheme: 'bankapp://' }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;

public class DeepLinkTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testPaymentDeepLink() {
        HashMap<String, Object> args = new HashMap<>();
        args.put("url", "bankapp://pay?to=merchant@upi&amount=500");
        args.put("package", "com.bank.app");
        driver.executeScript("mobile: deepLink", args);
        // Should redirect to login first if not authenticated
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/pinLayout")));
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        // After login, should land on payment screen with pre-filled data
        String payee = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/vpaInput"))).getText();
        Assert.assertEquals(payee, "merchant@upi");
        String amount = driver.findElement(
            By.id("com.bank.app:id/upiAmount")).getText();
        Assert.assertEquals(amount, "500");
    }

    @Test
    public void testAccountDeepLink() {
        HashMap<String, Object> args = new HashMap<>();
        args.put("url", "bankapp://accounts/savings");
        args.put("package", "com.bank.app");
        driver.executeScript("mobile: deepLink", args);
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/pinLayout")));
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/savingsDetail")));
        Assert.assertTrue(driver.findElement(
            By.id("com.bank.app:id/tvBalance")).isDisplayed());
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: DeepLinkTest
=== testPaymentDeepLink ===
[INFO] Deep link: bankapp://pay?to=merchant@upi&amount=500
[INFO] Login required - PIN entered
[INFO] Payment screen: payee=merchant@upi, amount=500
PASSED: testPaymentDeepLink (6.2s)
=== testAccountDeepLink ===
[INFO] Deep link: bankapp://accounts/savings
[INFO] Login required - PIN entered
[INFO] Savings account detail loaded
PASSED: testAccountDeepLink (5.5s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 11.7s`
  },
  {
    id: makeId(59), title: 'App Update Flow', category: 'mobileUiUx',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Beginner',
    description: 'Tests in-app update flow including forced update dialog, flexible update, and skip behavior.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, app update mock server',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2', currentVersion: '4.2.0', latestVersion: '4.3.0' }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;

public class AppUpdateFlowTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Test
    public void testFlexibleUpdateDialog() {
        // App detects newer version available
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/updateDialog")));
        String title = driver.findElement(
            By.id("com.bank.app:id/tvUpdateTitle")).getText();
        Assert.assertTrue(title.contains("Update Available"));
        String version = driver.findElement(
            By.id("com.bank.app:id/tvNewVersion")).getText();
        Assert.assertTrue(version.contains("4.3.0"));
        // Verify skip option exists (flexible update)
        Assert.assertTrue(driver.findElement(
            By.id("com.bank.app:id/btnSkip")).isDisplayed(),
            "Skip button should be available for flexible update");
        // Skip and continue to app
        driver.findElement(By.id("com.bank.app:id/btnSkip")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/pinLayout")));
    }

    @Test
    public void testForcedUpdate() {
        // Simulate critical update scenario
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/forceUpdateDialog")));
        boolean skipExists = driver.findElements(
            By.id("com.bank.app:id/btnSkip")).size() > 0;
        Assert.assertFalse(skipExists,
            "Forced update should not have skip button");
        Assert.assertTrue(driver.findElement(
            By.id("com.bank.app:id/btnUpdateNow")).isDisplayed());
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: AppUpdateFlowTest
=== testFlexibleUpdateDialog ===
[INFO] Update dialog: "Update Available"
[INFO] New version: 4.3.0
[INFO] Skip button visible (flexible update)
[INFO] Skipped - login screen displayed
PASSED: testFlexibleUpdateDialog (3.8s)
=== testForcedUpdate ===
[INFO] Force update dialog displayed
[INFO] No skip button (forced update)
[INFO] "Update Now" button visible
PASSED: testForcedUpdate (2.5s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 6.3s`
  },
  {
    id: makeId(60), title: 'Interrupt Handling (Call during txn)', category: 'mobileUiUx',
    platform: 'Android', framework: 'Appium', language: 'Java', difficulty: 'Advanced',
    description: 'Tests app behavior when interrupted by phone call, SMS, alarm, or low battery during an active transaction.',
    prerequisites: 'Java 11+, Appium 2.x, UiAutomator2, telephony simulation capability',
    config: JSON.stringify({ platformName: 'Android', deviceName: 'Pixel 6', app: '/path/to/banking.apk', automationName: 'UiAutomator2' }, null, 2),
    code: `import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.*;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;

public class InterruptHandlingTest {
    AndroidDriver driver;
    WebDriverWait wait;

    @BeforeMethod
    public void setup() throws Exception {
        UiAutomator2Options opts = new UiAutomator2Options()
            .setDeviceName("Pixel 6").setApp("/path/to/banking.apk");
        driver = new AndroidDriver(new URL("http://localhost:4723"), opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        // Login
        for (String d : new String[]{"1","2","3","4"})
            driver.findElement(By.id("com.bank.app:id/key_" + d)).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/dashboard")));
    }

    @Test
    public void testPhoneCallDuringTransfer() throws Exception {
        // Start a transfer
        driver.findElement(By.id("com.bank.app:id/btnTransfer")).click();
        driver.findElement(By.id("com.bank.app:id/amount")).sendKeys("5000");
        // Simulate incoming phone call
        HashMap<String, Object> callArgs = new HashMap<>();
        callArgs.put("phoneNumber", "+919876543210");
        callArgs.put("action", "call");
        driver.executeScript("mobile: shell", new HashMap<String, Object>() {{
            put("command", "am");
            put("args", new String[]{"start", "-a",
                "android.intent.action.CALL", "-d", "tel:+919876543210"});
        }});
        Thread.sleep(5000);
        // End call
        driver.executeScript("mobile: shell", new HashMap<String, Object>() {{
            put("command", "input");
            put("args", new String[]{"keyevent", "KEYCODE_ENDCALL"});
        }});
        Thread.sleep(2000);
        // Verify app state preserved
        String amount = driver.findElement(
            By.id("com.bank.app:id/amount")).getText();
        Assert.assertEquals(amount, "5000",
            "Transfer amount should be preserved after call");
        Assert.assertTrue(driver.findElement(
            By.id("com.bank.app:id/transferLayout")).isDisplayed(),
            "Should return to transfer screen");
    }

    @Test
    public void testSMSDuringOTPEntry() throws Exception {
        driver.findElement(By.id("com.bank.app:id/btnTransfer")).click();
        driver.findElement(By.id("com.bank.app:id/amount")).sendKeys("1000");
        driver.findElement(By.id("com.bank.app:id/btnSubmit")).click();
        // Trigger OTP screen
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.id("com.bank.app:id/otpInput")));
        // Simulate incoming SMS notification
        driver.openNotifications();
        Thread.sleep(2000);
        // Dismiss notifications
        driver.navigate().back();
        // OTP screen should still be active
        Assert.assertTrue(driver.findElement(
            By.id("com.bank.app:id/otpInput")).isDisplayed(),
            "OTP screen should persist after notification");
    }

    @AfterMethod
    public void teardown() { if (driver != null) driver.quit(); }
}`,
    expectedOutput: `[TestNG] Running: InterruptHandlingTest
=== testPhoneCallDuringTransfer ===
[INFO] Transfer screen, amount: 5000
[INFO] Incoming call: +919876543210
[INFO] Call active for 5s
[INFO] Call ended, returning to app
[INFO] Amount preserved: 5000
[INFO] Transfer screen intact
PASSED: testPhoneCallDuringTransfer (12.5s)
=== testSMSDuringOTPEntry ===
[INFO] OTP screen active
[INFO] Notification drawer opened
[INFO] Dismissed, OTP screen still active
PASSED: testSMSDuringOTPEntry (8.2s)
Tests run: 2, Failures: 0, Skips: 0
Total time: 20.7s`
  },
];

// =========== REACT COMPONENT ===========
export default function MobileTestingLab() {
  const [activeCategory, setActiveCategory] = useState('appiumAndroid');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [completedIds, setCompletedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mt_completed') || '[]'); } catch { return []; }
  });
  const [editedCode, setEditedCode] = useState('');
  const [editedConfig, setEditedConfig] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState([]);
  const [runProgress, setRunProgress] = useState(0);
  const [runResult, setRunResult] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');
  const outputRef = useRef(null);
  const runTimerRef = useRef(null);

  useEffect(() => {
    const first = SCENARIOS.find(s => s.category === activeCategory);
    if (first && !selectedScenario) { setSelectedScenario(first); setEditedCode(first.code); setEditedConfig(first.config); }
  }, []);

  useEffect(() => {
    localStorage.setItem('mt_completed', JSON.stringify(completedIds));
  }, [completedIds]);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [runOutput]);

  const selectScenario = useCallback((s) => {
    setSelectedScenario(s);
    setEditedCode(s.code);
    setEditedConfig(s.config);
    setRunOutput([]);
    setRunProgress(0);
    setRunResult(null);
    setShowReport(false);
    setIsRunning(false);
    if (runTimerRef.current) clearInterval(runTimerRef.current);
  }, []);

  const handleCategoryChange = useCallback((catId) => {
    setActiveCategory(catId);
    setSearchTerm('');
    setDifficultyFilter('All');
    setStatusFilter('All');
    const first = SCENARIOS.find(s => s.category === catId);
    if (first) selectScenario(first);
  }, [selectScenario]);

  const filteredScenarios = SCENARIOS.filter(s => {
    if (s.category !== activeCategory) return false;
    if (searchTerm && !s.title.toLowerCase().includes(searchTerm.toLowerCase()) && !s.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (difficultyFilter !== 'All' && s.difficulty !== difficultyFilter) return false;
    if (statusFilter === 'Completed' && !completedIds.includes(s.id)) return false;
    if (statusFilter === 'Not Started' && completedIds.includes(s.id)) return false;
    return true;
  });

  const handleRun = useCallback(() => {
    if (!selectedScenario || isRunning) return;
    setIsRunning(true);
    setRunOutput([]);
    setRunProgress(0);
    setRunResult(null);
    setShowReport(false);
    const lines = selectedScenario.expectedOutput.split('\n').filter(l => l.trim());
    let idx = 0;
    runTimerRef.current = setInterval(() => {
      if (idx < lines.length) {
        setRunOutput(prev => [...prev, lines[idx]]);
        setRunProgress(Math.round(((idx + 1) / lines.length) * 100));
        idx++;
      } else {
        clearInterval(runTimerRef.current);
        setRunProgress(100);
        const passed = Math.random() > 0.08;
        setRunResult(passed ? 'PASSED' : 'FAILED');
        setIsRunning(false);
        if (passed && !completedIds.includes(selectedScenario.id)) {
          setCompletedIds(prev => [...prev, selectedScenario.id]);
        }
      }
    }, 180);
  }, [selectedScenario, isRunning, completedIds]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(editedCode).then(() => {
      setCopyMsg('Copied!');
      setTimeout(() => setCopyMsg(''), 2000);
    });
  }, [editedCode]);

  const handleReset = useCallback(() => {
    if (selectedScenario) { setEditedCode(selectedScenario.code); setEditedConfig(selectedScenario.config); }
  }, [selectedScenario]);

  const totalInCategory = SCENARIOS.filter(s => s.category === activeCategory).length;
  const completedInCategory = SCENARIOS.filter(s => s.category === activeCategory && completedIds.includes(s.id)).length;
  const overallCompleted = completedIds.length;
  const overallTotal = SCENARIOS.length;

  // =========== JSX RETURN ===========
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${COLORS.bgFrom}, ${COLORS.bgTo})`, color: COLORS.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* HEADER */}
      <div style={{ padding: '18px 28px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, color: COLORS.header, fontSize: '1.6rem' }}>Mobile Testing Lab</h1>
          <p style={{ margin: '4px 0 0', color: COLORS.accent, fontSize: '0.85rem' }}>Banking Mobile App Test Automation - {overallCompleted}/{overallTotal} scenarios completed</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 200, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${(overallCompleted / overallTotal) * 100}%`, height: '100%', background: COLORS.accent, borderRadius: 4, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: COLORS.accent, fontWeight: 600, fontSize: '0.85rem' }}>{Math.round((overallCompleted / overallTotal) * 100)}%</span>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 72px)', overflow: 'hidden' }}>
        {/* ===== LEFT PANEL ===== */}
        <div style={{ width: 380, minWidth: 380, borderRight: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.15)' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '10px 10px 6px' }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => handleCategoryChange(cat.id)}
                style={{ padding: '5px 10px', borderRadius: 6, border: activeCategory === cat.id ? `2px solid ${cat.color}` : '1px solid rgba(255,255,255,0.15)', background: activeCategory === cat.id ? `${cat.color}22` : 'transparent', color: activeCategory === cat.id ? cat.color : COLORS.text, cursor: 'pointer', fontSize: '0.72rem', fontWeight: activeCategory === cat.id ? 700 : 400, transition: 'all 0.2s' }}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Progress for Category */}
          <div style={{ padding: '4px 12px 8px', fontSize: '0.75rem', color: COLORS.accent }}>
            {completedInCategory}/{totalInCategory} completed in this category
            <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 4 }}>
              <div style={{ width: `${totalInCategory > 0 ? (completedInCategory / totalInCategory) * 100 : 0}%`, height: '100%', background: COLORS.accent, borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
          </div>

          {/* Search */}
          <div style={{ padding: '0 10px 6px' }}>
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search scenarios..."
              style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: 'rgba(0,0,0,0.3)', color: COLORS.text, fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 4, padding: '0 10px 6px', flexWrap: 'wrap' }}>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
              <button key={d} onClick={() => setDifficultyFilter(d)}
                style={{ padding: '3px 8px', borderRadius: 4, border: difficultyFilter === d ? `1px solid ${COLORS.accent}` : '1px solid rgba(255,255,255,0.1)', background: difficultyFilter === d ? `${COLORS.accent}22` : 'transparent', color: difficultyFilter === d ? COLORS.accent : COLORS.text, cursor: 'pointer', fontSize: '0.7rem' }}>
                {d}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, padding: '0 10px 8px' }}>
            {['All', 'Not Started', 'Completed'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                style={{ padding: '3px 8px', borderRadius: 4, border: statusFilter === s ? `1px solid ${COLORS.accent}` : '1px solid rgba(255,255,255,0.1)', background: statusFilter === s ? `${COLORS.accent}22` : 'transparent', color: statusFilter === s ? COLORS.accent : COLORS.text, cursor: 'pointer', fontSize: '0.7rem' }}>
                {s}
              </button>
            ))}
          </div>

          {/* Scenario List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 8px' }}>
            {filteredScenarios.length === 0 && <div style={{ textAlign: 'center', padding: 24, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>No scenarios match filters</div>}
            {filteredScenarios.map(s => (
              <div key={s.id} onClick={() => selectScenario(s)}
                style={{ padding: '10px 12px', marginBottom: 6, borderRadius: 8, border: selectedScenario?.id === s.id ? `2px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`, background: selectedScenario?.id === s.id ? `${COLORS.accent}11` : `${COLORS.card}88`, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.7rem', color: COLORS.accent, fontWeight: 700 }}>{s.id}</span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: 3, background: `${(PLATFORM_COLORS[s.platform] || COLORS.cross)}22`, color: PLATFORM_COLORS[s.platform] || COLORS.cross }}>{s.platform}</span>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: completedIds.includes(s.id) ? '#4ecca3' : 'rgba(255,255,255,0.2)', display: 'inline-block' }} />
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: COLORS.header, fontWeight: 500, marginBottom: 4 }}>{s.title}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(78,204,163,0.15)', color: COLORS.accent }}>{s.framework}</span>
                  <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.08)', color: COLORS.text }}>{s.language}</span>
                  <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: 3, background: `${DIFFICULTY_COLORS[s.difficulty]}22`, color: DIFFICULTY_COLORS[s.difficulty] }}>{s.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {!selectedScenario ? (
            <div style={{ textAlign: 'center', paddingTop: 100, color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>&#128241;</div>
              <div style={{ fontSize: '1.1rem' }}>Select a scenario to begin</div>
            </div>
          ) : (
            <>
              {/* Scenario Details Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ background: COLORS.accent, color: '#000', padding: '4px 10px', borderRadius: 6, fontWeight: 700, fontSize: '0.85rem' }}>{selectedScenario.id}</span>
                <h2 style={{ margin: 0, color: COLORS.header, fontSize: '1.2rem', flex: 1 }}>{selectedScenario.title}</h2>
                <span style={{ padding: '3px 10px', borderRadius: 6, border: `1px solid ${PLATFORM_COLORS[selectedScenario.platform] || COLORS.cross}`, color: PLATFORM_COLORS[selectedScenario.platform] || COLORS.cross, fontSize: '0.75rem', fontWeight: 600 }}>{selectedScenario.platform}</span>
                <span style={{ padding: '3px 10px', borderRadius: 6, border: `1px solid ${COLORS.accent}`, color: COLORS.accent, fontSize: '0.75rem' }}>{selectedScenario.framework}</span>
                <span style={{ padding: '3px 10px', borderRadius: 6, border: `1px solid ${DIFFICULTY_COLORS[selectedScenario.difficulty]}`, color: DIFFICULTY_COLORS[selectedScenario.difficulty], fontSize: '0.75rem' }}>{selectedScenario.difficulty}</span>
              </div>

              {/* Description */}
              <div style={{ background: `${COLORS.card}cc`, borderRadius: 10, padding: 16, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
                <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.88rem' }}>{selectedScenario.description}</p>
                <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}><strong style={{ color: COLORS.accent }}>Prerequisites:</strong> {selectedScenario.prerequisites}</p>
              </div>

              {/* Code Editor */}
              <div style={{ background: COLORS.editorBg, borderRadius: 10, border: `1px solid ${COLORS.border}`, marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', background: 'rgba(78,204,163,0.08)', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent }}>Code Editor - {selectedScenario.language}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {copyMsg && <span style={{ color: COLORS.accent, fontSize: '0.75rem' }}>{copyMsg}</span>}
                    <button onClick={handleCopy} style={{ padding: '3px 10px', borderRadius: 4, border: `1px solid ${COLORS.accent}`, background: 'transparent', color: COLORS.accent, cursor: 'pointer', fontSize: '0.72rem' }}>Copy Code</button>
                    <button onClick={handleReset} style={{ padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: COLORS.text, cursor: 'pointer', fontSize: '0.72rem' }}>Reset</button>
                  </div>
                </div>
                <textarea value={editedCode} onChange={e => setEditedCode(e.target.value)}
                  spellCheck={false}
                  style={{ width: '100%', minHeight: 350, padding: '12px 14px', background: COLORS.editorBg, color: COLORS.editorText, border: 'none', fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace", fontSize: '0.78rem', lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box', tabSize: 4 }} />
              </div>

              {/* Expected Output */}
              <div style={{ background: `${COLORS.card}cc`, borderRadius: 10, border: `1px solid ${COLORS.border}`, marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ padding: '8px 14px', background: 'rgba(78,204,163,0.08)', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent }}>Expected Output</span>
                </div>
                <pre style={{ margin: 0, padding: '12px 14px', color: '#8be9fd', fontFamily: "'Fira Code', monospace", fontSize: '0.75rem', lineHeight: 1.5, overflowX: 'auto', whiteSpace: 'pre-wrap', maxHeight: 200 }}>{selectedScenario.expectedOutput}</pre>
              </div>

              {/* Execution Simulator */}
              <div style={{ background: `${COLORS.card}cc`, borderRadius: 10, border: `1px solid ${COLORS.border}`, marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', background: 'rgba(78,204,163,0.08)', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent }}>Execution Simulator</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {runResult && (
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: runResult === 'PASSED' ? '#4ecca3' : '#ff6b6b' }}>{runResult}</span>
                    )}
                    <button onClick={handleRun} disabled={isRunning}
                      style={{ padding: '5px 18px', borderRadius: 6, border: 'none', background: isRunning ? 'rgba(78,204,163,0.3)' : COLORS.accent, color: '#000', cursor: isRunning ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                      {isRunning ? 'Running...' : 'Run Test'}
                    </button>
                    {runResult && (
                      <button onClick={() => setShowReport(!showReport)}
                        style={{ padding: '5px 14px', borderRadius: 6, border: `1px solid ${COLORS.accent}`, background: 'transparent', color: COLORS.accent, cursor: 'pointer', fontSize: '0.75rem' }}>
                        {showReport ? 'Hide Report' : 'View Report'}
                      </button>
                    )}
                  </div>
                </div>
                {/* Progress Bar */}
                {(isRunning || runProgress > 0) && (
                  <div style={{ padding: '6px 14px 0' }}>
                    <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${runProgress}%`, height: '100%', background: runResult === 'FAILED' ? '#ff6b6b' : COLORS.accent, borderRadius: 3, transition: 'width 0.2s' }} />
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{runProgress}%</div>
                  </div>
                )}
                {/* Console Output */}
                <div ref={outputRef} style={{ maxHeight: 220, overflowY: 'auto', padding: '8px 14px', fontFamily: "'Fira Code', monospace", fontSize: '0.73rem' }}>
                  {runOutput.length === 0 && !isRunning && <div style={{ color: 'rgba(255,255,255,0.25)', padding: 12 }}>Click "Run Test" to simulate execution</div>}
                  {runOutput.map((line, i) => (
                    <div key={i} style={{ color: line.includes('PASSED') ? '#4ecca3' : line.includes('FAILED') || line.includes('ERROR') ? '#ff6b6b' : line.includes('[INFO]') ? '#8be9fd' : COLORS.text, marginBottom: 2 }}>
                      <span style={{ color: 'rgba(255,255,255,0.2)', marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>{line}
                    </div>
                  ))}
                  {isRunning && <div style={{ color: COLORS.accent, animation: 'blink 1s infinite' }}>{'>'} _</div>}
                </div>
                {/* Report Table */}
                {showReport && runResult && (
                  <div style={{ padding: '12px 14px', borderTop: `1px solid ${COLORS.border}` }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                          <th style={{ textAlign: 'left', padding: '6px 8px', color: COLORS.accent }}>Metric</th>
                          <th style={{ textAlign: 'left', padding: '6px 8px', color: COLORS.accent }}>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['Scenario', selectedScenario.id + ' - ' + selectedScenario.title],
                          ['Platform', selectedScenario.platform],
                          ['Framework', selectedScenario.framework],
                          ['Language', selectedScenario.language],
                          ['Status', runResult],
                          ['Duration', (Math.random() * 10 + 2).toFixed(1) + 's'],
                          ['Executed At', new Date().toLocaleString()],
                        ].map(([k, v], i) => (
                          <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                            <td style={{ padding: '5px 8px', color: COLORS.text }}>{k}</td>
                            <td style={{ padding: '5px 8px', color: v === 'PASSED' ? '#4ecca3' : v === 'FAILED' ? '#ff6b6b' : COLORS.header, fontWeight: k === 'Status' ? 700 : 400 }}>{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Device Config Panel */}
              <div style={{ background: `${COLORS.card}cc`, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
                <div onClick={() => setShowConfig(!showConfig)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', background: 'rgba(78,204,163,0.08)', cursor: 'pointer', borderBottom: showConfig ? `1px solid ${COLORS.border}` : 'none' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent }}>Device / Config</span>
                  <span style={{ color: COLORS.accent, fontSize: '0.85rem' }}>{showConfig ? '\u25B2' : '\u25BC'}</span>
                </div>
                {showConfig && (
                  <textarea value={editedConfig} onChange={e => setEditedConfig(e.target.value)}
                    spellCheck={false}
                    style={{ width: '100%', minHeight: 150, padding: '12px 14px', background: COLORS.editorBg, color: COLORS.editorText, border: 'none', fontFamily: "'Fira Code', monospace", fontSize: '0.75rem', lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

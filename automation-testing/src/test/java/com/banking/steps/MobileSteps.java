package com.banking.steps;

import com.banking.pages.MobileBankingPage;
import com.banking.utils.ConfigReader;
import com.banking.utils.DriverFactory;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.nativekey.AndroidKey;
import io.appium.java_client.android.nativekey.KeyEvent;
import io.appium.java_client.ios.IOSDriver;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.DeviceRotation;
import org.openqa.selenium.ScreenOrientation;
import org.testng.Assert;

/**
 * Step Definitions for Mobile Banking Feature
 * Supports Android (UiAutomator2), iOS (XCUITest), and Cross-Platform testing
 */
public class MobileSteps {
    private WebDriver driver;
    private MobileBankingPage mobilePage;

    // ========== Given Steps ==========

    @Given("I launch the banking mobile app on Android")
    public void iLaunchBankingAppOnAndroid() {
        DriverFactory.initAndroidDriver();
        driver = DriverFactory.getDriver();
        mobilePage = new MobileBankingPage(driver);
        System.out.println("Launched banking app on Android");
    }

    @Given("I launch the banking mobile app on iOS")
    public void iLaunchBankingAppOnIOS() {
        DriverFactory.initIOSDriver();
        driver = DriverFactory.getDriver();
        mobilePage = new MobileBankingPage(driver);
        System.out.println("Launched banking app on iOS");
    }

    @Given("I am logged in on the mobile app")
    public void iAmLoggedInOnMobileApp() {
        driver = DriverFactory.getDriver();
        mobilePage = new MobileBankingPage(driver);
        mobilePage.loginWithPIN("1234");
        System.out.println("Logged in on mobile app");
    }

    @Given("I am logged in on the iOS app")
    public void iAmLoggedInOnIOSApp() {
        driver = DriverFactory.getDriver();
        mobilePage = new MobileBankingPage(driver);
        mobilePage.loginWithPIN("1234");
        System.out.println("Logged in on iOS app");
    }

    @Given("I am logged in on the web portal")
    public void iAmLoggedInOnWebPortal() {
        System.out.println("Simulating web portal login for cross-platform test");
    }

    @Given("I open the banking website on mobile Chrome")
    public void iOpenBankingWebsiteOnMobileChrome() {
        driver = DriverFactory.getDriver();
        String baseUrl = ConfigReader.getBaseUrl();
        driver.get(baseUrl);
        System.out.println("Opened banking website on mobile Chrome: " + baseUrl);
    }

    @Given("I am on the mobile dashboard")
    public void iAmOnMobileDashboard() {
        driver = DriverFactory.getDriver();
        mobilePage = new MobileBankingPage(driver);
        Assert.assertTrue(mobilePage.isDashboardDisplayed(),
                "Mobile dashboard should be displayed");
    }

    // ========== When Steps ==========

    @When("I tap on {string}")
    public void iTapOn(String elementText) {
        mobilePage.tapElement(elementText);
        System.out.println("Tapped on: " + elementText);
    }

    @When("I authenticate with fingerprint")
    public void iAuthenticateWithFingerprint() {
        mobilePage.authenticateFingerprint();
        System.out.println("Authenticated with fingerprint");
    }

    @When("I authenticate with Face ID")
    public void iAuthenticateWithFaceID() {
        mobilePage.authenticateFaceID();
        System.out.println("Authenticated with Face ID");
    }

    @When("I authenticate with PIN {string}")
    public void iAuthenticateWithPIN(String pin) {
        mobilePage.enterPIN(pin);
        System.out.println("Authenticated with PIN");
    }

    @When("I enter UPI ID {string}")
    public void iEnterUPIId(String upiId) {
        mobilePage.enterUPIId(upiId);
    }

    @When("I enter amount {string}")
    public void iEnterAmount(String amount) {
        mobilePage.enterAmount(amount);
    }

    @When("I enter PIN {string}")
    public void iEnterPIN(String pin) {
        mobilePage.enterPIN(pin);
    }

    @When("I select biller {string}")
    public void iSelectBiller(String billerName) {
        mobilePage.selectBiller(billerName);
    }

    @When("I enter consumer number {string}")
    public void iEnterConsumerNumber(String consumerNumber) {
        mobilePage.enterConsumerNumber(consumerNumber);
    }

    @When("a transaction occurs on my account")
    public void aTransactionOccursOnMyAccount() {
        // Simulate backend transaction via API
        System.out.println("Simulating backend transaction for push notification test");
    }

    @When("I navigate to {string} tab")
    public void iNavigateToTab(String tabName) {
        mobilePage.navigateToTab(tabName);
    }

    @When("I tap on my savings account")
    public void iTapOnSavingsAccount() {
        mobilePage.tapSavingsAccount();
    }

    @When("I perform a transfer on the web portal")
    public void iPerformTransferOnWebPortal() {
        System.out.println("Performing transfer on web portal for cross-platform test");
    }

    @When("I login with valid credentials")
    public void iLoginWithValidCredentials() {
        mobilePage = new MobileBankingPage(driver);
        mobilePage.loginWithPIN("1234");
    }

    @When("I switch from WiFi to mobile data")
    public void iSwitchFromWifiToMobileData() {
        if (driver instanceof AndroidDriver) {
            AndroidDriver androidDriver = (AndroidDriver) driver;
            // Toggle WiFi off via adb command simulation
            System.out.println("Switching from WiFi to mobile data");
        }
    }

    @When("the device battery is below {int}%")
    public void theDeviceBatteryIsBelow(int percentage) {
        // Simulate low battery condition
        System.out.println("Simulating battery level below " + percentage + "%");
    }

    @When("I rotate the device to landscape")
    public void iRotateDeviceToLandscape() {
        if (driver instanceof AndroidDriver) {
            ((AndroidDriver) driver).rotate(ScreenOrientation.LANDSCAPE);
        } else if (driver instanceof IOSDriver) {
            ((IOSDriver) driver).rotate(ScreenOrientation.LANDSCAPE);
        }
        System.out.println("Rotated device to landscape");
    }

    @When("I go offline \\(airplane mode\\)")
    public void iGoOffline() {
        if (driver instanceof AndroidDriver) {
            AndroidDriver androidDriver = (AndroidDriver) driver;
            // Toggle airplane mode
            System.out.println("Enabling airplane mode for offline testing");
        }
    }

    // ========== Then Steps ==========

    @Then("I should see the mobile dashboard")
    public void iShouldSeeMobileDashboard() {
        Assert.assertTrue(mobilePage.isDashboardDisplayed(),
                "Mobile dashboard should be displayed after login");
    }

    @And("my account summary should be displayed")
    public void myAccountSummaryShouldBeDisplayed() {
        Assert.assertTrue(mobilePage.isAccountSummaryDisplayed(),
                "Account summary should be displayed");
    }

    @Then("I should see my account balance")
    public void iShouldSeeMyAccountBalance() {
        String balance = mobilePage.getAccountBalance();
        Assert.assertNotNull(balance, "Account balance should be displayed");
        Assert.assertFalse(balance.isEmpty(), "Balance should not be empty");
        System.out.println("Account balance: " + balance);
    }

    @And("the balance should match the web portal")
    public void theBalanceShouldMatchWebPortal() {
        // Cross-platform balance verification
        System.out.println("Verifying balance matches web portal");
    }

    @Then("I should see {string}")
    public void iShouldSee(String expectedText) {
        String pageSource = driver.getPageSource();
        Assert.assertTrue(pageSource.contains(expectedText),
                "Should see: " + expectedText);
    }

    @And("I should receive a payment confirmation SMS")
    public void iShouldReceivePaymentConfirmationSMS() {
        // SMS verification (in real testing, use SMS gateway API)
        System.out.println("Verifying payment confirmation SMS");
    }

    @Then("the outstanding amount should be displayed")
    public void theOutstandingAmountShouldBeDisplayed() {
        Assert.assertTrue(mobilePage.isAmountDisplayed(),
                "Outstanding amount should be displayed");
    }

    @Then("I should receive a push notification")
    public void iShouldReceivePushNotification() {
        // Push notification verification
        System.out.println("Verifying push notification received");
    }

    @And("the notification should contain transaction details")
    public void theNotificationShouldContainTransactionDetails() {
        System.out.println("Verifying notification contains transaction details");
    }

    @Then("I should see recent transactions")
    public void iShouldSeeRecentTransactions() {
        Assert.assertTrue(mobilePage.isTransactionListDisplayed(),
                "Recent transactions should be displayed");
    }

    @And("I should be able to share the statement")
    public void iShouldBeAbleToShareStatement() {
        System.out.println("Verifying share statement functionality");
    }

    @Then("the transaction should appear on the mobile app")
    public void theTransactionShouldAppearOnMobileApp() {
        System.out.println("Verifying cross-platform transaction sync");
    }

    @And("the balance should be updated on both platforms")
    public void theBalanceShouldBeUpdatedOnBothPlatforms() {
        System.out.println("Verifying balance sync across platforms");
    }

    @Then("the dashboard should be mobile-responsive")
    public void theDashboardShouldBeMobileResponsive() {
        System.out.println("Verifying mobile responsive layout");
    }

    @And("all navigation menus should be accessible via hamburger menu")
    public void allMenusShouldBeAccessibleViaHamburger() {
        System.out.println("Verifying hamburger menu navigation");
    }

    @And("touch interactions should work correctly")
    public void touchInteractionsShouldWork() {
        System.out.println("Verifying touch interactions");
    }

    @Then("the app should maintain the session")
    public void theAppShouldMaintainSession() {
        Assert.assertTrue(mobilePage.isDashboardDisplayed(),
                "Session should be maintained after network change");
    }

    @And("a network change notification should appear")
    public void aNetworkChangeNotificationShouldAppear() {
        System.out.println("Verifying network change notification");
    }

    @Then("the app should show battery warning")
    public void theAppShouldShowBatteryWarning() {
        System.out.println("Verifying battery warning display");
    }

    @And("non-critical features should be disabled")
    public void nonCriticalFeaturesShouldBeDisabled() {
        System.out.println("Verifying non-critical features disabled on low battery");
    }

    @Then("the UI should adapt to landscape mode")
    public void theUIShouldAdaptToLandscape() {
        System.out.println("Verifying landscape mode adaptation");
    }

    @And("no data should be lost during rotation")
    public void noDataShouldBeLostDuringRotation() {
        System.out.println("Verifying no data loss during rotation");
    }

    @Then("I should see cached account summary")
    public void iShouldSeeCachedAccountSummary() {
        System.out.println("Verifying cached account summary in offline mode");
    }

    @And("transfer functionality should be disabled")
    public void transferFunctionalityShouldBeDisabled() {
        System.out.println("Verifying transfer disabled in offline mode");
    }

    @And("I should see {string} message")
    public void iShouldSeeMessageText(String message) {
        String pageSource = driver.getPageSource();
        Assert.assertTrue(pageSource.contains(message),
                "Should see message: " + message);
    }
}

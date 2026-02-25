package com.banking.steps;

import com.banking.pages.DashboardPage;
import com.banking.pages.LoginPage;
import com.banking.utils.ConfigReader;
import com.banking.utils.DriverFactory;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;

/**
 * Step Definitions for Login Feature
 */
public class LoginSteps {
    private WebDriver driver;
    private LoginPage loginPage;
    private DashboardPage dashboardPage;

    @Given("I am on the banking login page")
    public void iAmOnTheLoginPage() {
        driver = DriverFactory.getDriver();
        loginPage = new LoginPage(driver);
        loginPage.navigateTo(ConfigReader.getBaseUrl() + "/login");
    }

    @Given("I am logged in as {string}")
    public void iAmLoggedInAs(String username) {
        driver = DriverFactory.getDriver();
        loginPage = new LoginPage(driver);
        loginPage.navigateTo(ConfigReader.getBaseUrl() + "/login");
        dashboardPage = loginPage.login(username, "Test@123");
    }

    @Given("I am logged in as customer {string}")
    public void iAmLoggedInAsCustomer(String customerId) {
        driver = DriverFactory.getDriver();
        loginPage = new LoginPage(driver);
        loginPage.navigateTo(ConfigReader.getBaseUrl() + "/login");
        dashboardPage = loginPage.login(customerId, "Test@123");
    }

    @When("I enter username {string}")
    public void iEnterUsername(String username) {
        loginPage.enterUsername(username);
    }

    @When("I enter password {string}")
    public void iEnterPassword(String password) {
        loginPage.enterPassword(password);
    }

    @When("I click the login button")
    public void iClickTheLoginButton() {
        loginPage.clickLogin();
    }

    @Then("I should be redirected to the dashboard")
    public void iShouldBeRedirectedToDashboard() {
        dashboardPage = new DashboardPage(driver);
        Assert.assertTrue(dashboardPage.isDashboardDisplayed(),
                "Dashboard should be displayed after login");
    }

    @Then("I should see welcome message containing {string}")
    public void iShouldSeeWelcomeMessage(String name) {
        String welcomeMsg = dashboardPage.getWelcomeMessage();
        Assert.assertTrue(welcomeMsg.contains(name),
                "Welcome message should contain: " + name);
    }

    @Then("I should see error message {string}")
    public void iShouldSeeErrorMessage(String expectedError) {
        String actualError = loginPage.getErrorMessage();
        Assert.assertEquals(actualError, expectedError,
                "Error message mismatch");
    }

    @Then("I should remain on the login page")
    public void iShouldRemainOnLoginPage() {
        Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                "Should remain on login page");
    }

    @When("I enter wrong password {int} times for user {string}")
    public void iEnterWrongPasswordTimes(int times, String username) {
        for (int i = 0; i < times; i++) {
            loginPage.enterUsername(username);
            loginPage.enterPassword("WrongPass" + i);
            loginPage.clickLogin();
        }
    }

    @Then("the account should be locked")
    public void theAccountShouldBeLocked() {
        Assert.assertTrue(loginPage.isErrorDisplayed(),
                "Account lock error should be displayed");
    }

    @When("I remain idle for {int} minutes")
    public void iRemainIdleForMinutes(int minutes) {
        // Simulate idle time (for testing, use shorter timeout)
        try {
            Thread.sleep(2000); // Simplified for demo
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Then("I should be redirected to the login page")
    public void iShouldBeRedirectedToLoginPage() {
        Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                "Should be redirected to login page");
    }

    @Then("I should see message {string}")
    public void iShouldSeeMessage(String message) {
        // Verify message is displayed on page
        Assert.assertTrue(driver.getPageSource().contains(message),
                "Message should be displayed: " + message);
    }
}

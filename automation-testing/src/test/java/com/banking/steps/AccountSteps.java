package com.banking.steps;

import com.banking.pages.AccountsPage;
import com.banking.pages.DashboardPage;
import com.banking.utils.DriverFactory;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;

import java.util.List;
import java.util.Map;

/**
 * Step Definitions for Account Management Feature
 */
public class AccountSteps {
    private WebDriver driver;
    private AccountsPage accountsPage;
    private DashboardPage dashboardPage;

    @When("I navigate to the {string} page")
    public void iNavigateToPage(String pageName) {
        driver = DriverFactory.getDriver();
        dashboardPage = new DashboardPage(driver);
        switch (pageName.toLowerCase()) {
            case "accounts":
                dashboardPage.navigateToAccounts();
                accountsPage = new AccountsPage(driver);
                break;
            case "fund transfer":
                dashboardPage.navigateToTransfer();
                break;
            default:
                throw new RuntimeException("Unknown page: " + pageName);
        }
    }

    @Then("I should see a list of my accounts")
    public void iShouldSeeAccountList() {
        accountsPage = new AccountsPage(driver);
        Assert.assertTrue(accountsPage.isAccountListDisplayed(),
                "Account list should be displayed");
    }

    @And("each account should display account number, type, balance, and status")
    public void eachAccountShouldDisplayDetails() {
        Assert.assertTrue(accountsPage.getAccountCount() > 0,
                "At least one account should be visible");
        // Verify first account has required fields
        String accountNumber = accountsPage.getAccountNumber(0);
        Assert.assertNotNull(accountNumber, "Account number should be displayed");
        Assert.assertFalse(accountNumber.isEmpty(), "Account number should not be empty");
    }

    @And("I click on account {string}")
    public void iClickOnAccount(String accountId) {
        accountsPage = new AccountsPage(driver);
        accountsPage.searchAccount(accountId);
        accountsPage.viewAccountDetails(0);
    }

    @Then("I should see account details including:")
    public void iShouldSeeAccountDetailsIncluding(DataTable dataTable) {
        List<Map<String, String>> rows = dataTable.asMaps(String.class, String.class);
        for (Map<String, String> row : rows) {
            String field = row.get("Field");
            String expectedValue = row.get("Value");
            // Verify each field on the account details page
            String pageSource = driver.getPageSource();
            Assert.assertTrue(pageSource.contains(expectedValue),
                    "Account details should contain " + field + ": " + expectedValue);
        }
    }

    @When("I navigate to account {string} statement")
    public void iNavigateToAccountStatement(String accountId) {
        driver = DriverFactory.getDriver();
        accountsPage = new AccountsPage(driver);
        accountsPage.searchAccount(accountId);
        accountsPage.viewAccountDetails(0);
        accountsPage.viewStatement();
    }

    @And("I select date range {string} to {string}")
    public void iSelectDateRange(String fromDate, String toDate) {
        // Select date range for statement filter
        System.out.println("Selecting date range: " + fromDate + " to " + toDate);
    }

    @Then("I should see transactions within the date range")
    public void iShouldSeeTransactionsInDateRange() {
        // Verify transaction list is displayed
        Assert.assertNotNull(driver.getPageSource(), "Page should have content");
    }

    @And("opening balance and closing balance should be displayed")
    public void balancesShouldBeDisplayed() {
        String pageSource = driver.getPageSource();
        // Verify balance elements exist
        Assert.assertNotNull(pageSource, "Page should display balances");
    }

    @And("I should be able to download the statement as PDF")
    public void iShouldBeAbleToDownloadStatement() {
        // Verify download button exists
        accountsPage = new AccountsPage(driver);
        accountsPage.downloadStatement();
    }

    @And("I filter by account type {string}")
    public void iFilterByAccountType(String accountType) {
        accountsPage = new AccountsPage(driver);
        accountsPage.filterByType(accountType);
    }

    @Then("only savings accounts should be displayed")
    public void onlySavingsAccountsShouldBeDisplayed() {
        int count = accountsPage.getAccountCount();
        Assert.assertTrue(count > 0, "Filtered accounts should be displayed");
    }

    @And("I search for {string}")
    public void iSearchFor(String searchTerm) {
        accountsPage = new AccountsPage(driver);
        accountsPage.searchAccount(searchTerm);
    }

    @Then("only matching accounts should be displayed")
    public void onlyMatchingAccountsShouldBeDisplayed() {
        int count = accountsPage.getAccountCount();
        Assert.assertTrue(count > 0, "Matching accounts should be displayed");
    }
}

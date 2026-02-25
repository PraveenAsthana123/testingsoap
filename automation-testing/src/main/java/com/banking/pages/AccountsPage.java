package com.banking.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * Accounts Page - Page Object for Account Management
 */
public class AccountsPage extends BasePage {

    private By accountsList = By.cssSelector(".account-row");
    private By searchField = By.id("accountSearch");
    private By accountTypeFilter = By.id("accountTypeFilter");
    private By accountNumber = By.cssSelector(".account-number");
    private By accountBalance = By.cssSelector(".account-balance");
    private By accountStatus = By.cssSelector(".account-status");
    private By viewDetailsButton = By.cssSelector(".view-details-btn");
    private By statementLink = By.linkText("View Statement");
    private By downloadStatement = By.id("downloadStatement");

    public AccountsPage(WebDriver driver) {
        super(driver);
    }

    public int getAccountCount() {
        return driver.findElements(accountsList).size();
    }

    public void searchAccount(String query) {
        type(searchField, query);
    }

    public void filterByType(String accountType) {
        selectByText(accountTypeFilter, accountType);
    }

    public String getAccountNumber(int index) {
        List<WebElement> accounts = driver.findElements(accountNumber);
        return accounts.get(index).getText();
    }

    public String getAccountBalance(int index) {
        List<WebElement> balances = driver.findElements(accountBalance);
        return balances.get(index).getText();
    }

    public void viewAccountDetails(int index) {
        List<WebElement> buttons = driver.findElements(viewDetailsButton);
        buttons.get(index).click();
    }

    public void viewStatement() {
        click(statementLink);
    }

    public void downloadStatement() {
        click(downloadStatement);
    }

    public boolean isAccountListDisplayed() {
        return isDisplayed(accountsList);
    }
}

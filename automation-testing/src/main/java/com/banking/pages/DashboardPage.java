package com.banking.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * Dashboard Page - Banking Dashboard Page Object
 */
public class DashboardPage extends BasePage {

    private By accountBalance = By.id("accountBalance");
    private By totalCustomers = By.cssSelector("[data-stat='customers']");
    private By totalAccounts = By.cssSelector("[data-stat='accounts']");
    private By recentTransactions = By.cssSelector(".recent-transactions");
    private By welcomeMessage = By.cssSelector(".welcome-msg");
    private By notificationBadge = By.cssSelector(".notification-badge");
    private By menuItems = By.cssSelector(".sidebar-item");
    private By logoutButton = By.id("logoutBtn");

    // Sidebar navigation
    private By testCasesMenu = By.cssSelector("[title='Test Cases']");
    private By accountsMenu = By.cssSelector("[title='Accounts']");
    private By transferMenu = By.cssSelector("[title='Fund Transfer']");

    public DashboardPage(WebDriver driver) {
        super(driver);
    }

    public String getAccountBalance() {
        return getText(accountBalance);
    }

    public String getWelcomeMessage() {
        return getText(welcomeMessage);
    }

    public boolean isDashboardDisplayed() {
        return isDisplayed(accountBalance);
    }

    public int getNotificationCount() {
        String badge = getText(notificationBadge);
        return badge.isEmpty() ? 0 : Integer.parseInt(badge);
    }

    public void navigateToTestCases() {
        click(testCasesMenu);
    }

    public void navigateToAccounts() {
        click(accountsMenu);
    }

    public void navigateToTransfer() {
        click(transferMenu);
    }

    public void logout() {
        click(logoutButton);
    }
}

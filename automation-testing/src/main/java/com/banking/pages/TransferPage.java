package com.banking.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * Fund Transfer Page - Page Object
 */
public class TransferPage extends BasePage {

    private By fromAccountDropdown = By.id("fromAccount");
    private By toAccountDropdown = By.id("toAccount");
    private By amountField = By.id("amount");
    private By remarksField = By.id("remarks");
    private By transferButton = By.id("transferBtn");
    private By successMessage = By.cssSelector(".success-msg");
    private By errorMessage = By.cssSelector(".error-msg");
    private By confirmButton = By.id("confirmTransfer");
    private By cancelButton = By.id("cancelTransfer");
    private By transactionId = By.cssSelector(".transaction-id");
    private By balanceAfter = By.cssSelector(".balance-after");

    public TransferPage(WebDriver driver) {
        super(driver);
    }

    public void selectFromAccount(String account) {
        selectByText(fromAccountDropdown, account);
    }

    public void selectToAccount(String account) {
        selectByText(toAccountDropdown, account);
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

    public void confirmTransfer() {
        click(confirmButton);
    }

    public void cancelTransfer() {
        click(cancelButton);
    }

    public String getSuccessMessage() {
        return getText(successMessage);
    }

    public String getErrorMessage() {
        return getText(errorMessage);
    }

    public String getTransactionId() {
        return getText(transactionId);
    }

    public String getBalanceAfter() {
        return getText(balanceAfter);
    }

    public void performTransfer(String from, String to, String amount, String remarks) {
        selectFromAccount(from);
        selectToAccount(to);
        enterAmount(amount);
        enterRemarks(remarks);
        clickTransfer();
    }

    public boolean isSuccessDisplayed() {
        return isDisplayed(successMessage);
    }

    public boolean isErrorDisplayed() {
        return isDisplayed(errorMessage);
    }
}

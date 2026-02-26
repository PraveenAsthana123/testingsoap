package com.banking.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * Cards Page - Page Object for Credit/Debit Card Management
 */
public class CardsPage extends BasePage {

    private By cardsList = By.cssSelector(".card-row");
    private By cardNumber = By.cssSelector(".card-number");
    private By cardType = By.cssSelector(".card-type");
    private By cardStatus = By.cssSelector(".card-status");
    private By creditLimit = By.cssSelector(".credit-limit");
    private By availableLimit = By.cssSelector(".available-limit");
    private By outstandingAmount = By.cssSelector(".outstanding-amount");
    private By minimumDue = By.cssSelector(".minimum-due");
    private By dueDate = By.cssSelector(".due-date");
    private By blockCardButton = By.id("blockCard");
    private By unblockCardButton = By.id("unblockCard");
    private By changePinButton = By.id("changePin");
    private By viewStatementButton = By.id("viewStatement");
    private By payBillButton = By.id("payBill");
    private By setLimitButton = By.id("setLimit");
    private By applyNewCardButton = By.id("applyNewCard");
    private By newPinField = By.id("newPin");
    private By confirmPinField = By.id("confirmPin");
    private By submitPinButton = By.id("submitPin");
    private By transactionList = By.cssSelector(".card-transaction-row");
    private By successMessage = By.cssSelector(".success-msg");
    private By errorMessage = By.cssSelector(".error-msg");

    public CardsPage(WebDriver driver) {
        super(driver);
    }

    public int getCardCount() {
        return driver.findElements(cardsList).size();
    }

    public String getCardNumber(int index) {
        List<WebElement> cards = driver.findElements(cardNumber);
        return cards.get(index).getText();
    }

    public String getCardStatus(int index) {
        List<WebElement> statuses = driver.findElements(cardStatus);
        return statuses.get(index).getText();
    }

    public String getCreditLimit() {
        return getText(creditLimit);
    }

    public String getAvailableLimit() {
        return getText(availableLimit);
    }

    public String getOutstandingAmount() {
        return getText(outstandingAmount);
    }

    public String getMinimumDue() {
        return getText(minimumDue);
    }

    public String getDueDate() {
        return getText(dueDate);
    }

    public void blockCard() {
        click(blockCardButton);
    }

    public void unblockCard() {
        click(unblockCardButton);
    }

    public void changePIN(String newPin) {
        click(changePinButton);
        type(newPinField, newPin);
        type(confirmPinField, newPin);
        click(submitPinButton);
    }

    public void viewStatement() {
        click(viewStatementButton);
    }

    public void payBill() {
        click(payBillButton);
    }

    public void setTransactionLimit() {
        click(setLimitButton);
    }

    public void applyNewCard() {
        click(applyNewCardButton);
    }

    public int getTransactionCount() {
        return driver.findElements(transactionList).size();
    }

    public boolean isSuccessDisplayed() {
        return isDisplayed(successMessage);
    }

    public String getErrorMessage() {
        return getText(errorMessage);
    }
}

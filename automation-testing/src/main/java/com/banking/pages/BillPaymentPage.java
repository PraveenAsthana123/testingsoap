package com.banking.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * Bill Payment Page - Page Object for Bill Payment Module
 */
public class BillPaymentPage extends BasePage {

    private By billerCategory = By.id("billerCategory");
    private By billerName = By.id("billerName");
    private By consumerNumber = By.id("consumerNumber");
    private By fetchBillButton = By.id("fetchBill");
    private By billAmount = By.cssSelector(".bill-amount");
    private By payNowButton = By.id("payNow");
    private By paymentConfirmation = By.cssSelector(".payment-confirmation");
    private By successMessage = By.cssSelector(".success-msg");
    private By errorMessage = By.cssSelector(".error-msg");
    private By paymentHistory = By.cssSelector(".payment-history-row");
    private By schedulePayment = By.id("schedulePayment");
    private By autoPay = By.id("autoPay");
    private By receiptDownload = By.cssSelector(".download-receipt");

    public BillPaymentPage(WebDriver driver) {
        super(driver);
    }

    public void selectCategory(String category) {
        selectByText(billerCategory, category);
    }

    public void selectBiller(String biller) {
        selectByText(billerName, biller);
    }

    public void enterConsumerNumber(String number) {
        type(consumerNumber, number);
    }

    public void fetchBill() {
        click(fetchBillButton);
    }

    public String getBillAmount() {
        return getText(billAmount);
    }

    public void payNow() {
        click(payNowButton);
    }

    public String getConfirmationMessage() {
        return getText(paymentConfirmation);
    }

    public boolean isPaymentSuccessful() {
        return isDisplayed(successMessage);
    }

    public String getErrorMessage() {
        return getText(errorMessage);
    }

    public int getPaymentHistoryCount() {
        return driver.findElements(paymentHistory).size();
    }

    public void schedulePayment() {
        click(schedulePayment);
    }

    public void enableAutoPay() {
        click(autoPay);
    }

    public void downloadReceipt() {
        click(receiptDownload);
    }

    public void payBill(String category, String biller, String consNum) {
        selectCategory(category);
        selectBiller(biller);
        enterConsumerNumber(consNum);
        fetchBill();
        payNow();
    }
}

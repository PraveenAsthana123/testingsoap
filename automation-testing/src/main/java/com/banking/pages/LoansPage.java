package com.banking.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * Loans Page - Page Object for Loan Management Module
 */
public class LoansPage extends BasePage {

    private By loansList = By.cssSelector(".loan-row");
    private By loanType = By.id("loanType");
    private By loanAmount = By.id("loanAmount");
    private By tenure = By.id("loanTenure");
    private By interestRate = By.cssSelector(".interest-rate");
    private By emiAmount = By.cssSelector(".emi-amount");
    private By calculateEmiButton = By.id("calculateEmi");
    private By applyLoanButton = By.id("applyLoan");
    private By loanStatusBadge = By.cssSelector(".loan-status");
    private By outstandingBalance = By.cssSelector(".outstanding-balance");
    private By repaymentSchedule = By.cssSelector(".repayment-schedule-row");
    private By prepaymentButton = By.id("prepayment");
    private By closeLoanButton = By.id("closeLoan");
    private By eligibilityCheck = By.id("checkEligibility");
    private By successMessage = By.cssSelector(".success-msg");
    private By errorMessage = By.cssSelector(".error-msg");

    public LoansPage(WebDriver driver) {
        super(driver);
    }

    public int getLoanCount() {
        return driver.findElements(loansList).size();
    }

    public void selectLoanType(String type) {
        selectByText(loanType, type);
    }

    public void enterLoanAmount(String amount) {
        type(loanAmount, amount);
    }

    public void selectTenure(String months) {
        selectByText(tenure, months);
    }

    public String getInterestRate() {
        return getText(interestRate);
    }

    public String getEMIAmount() {
        return getText(emiAmount);
    }

    public void calculateEMI() {
        click(calculateEmiButton);
    }

    public void applyForLoan() {
        click(applyLoanButton);
    }

    public String getLoanStatus(int index) {
        List<WebElement> statuses = driver.findElements(loanStatusBadge);
        return statuses.get(index).getText();
    }

    public String getOutstandingBalance() {
        return getText(outstandingBalance);
    }

    public int getRepaymentScheduleCount() {
        return driver.findElements(repaymentSchedule).size();
    }

    public void makePrepayment() {
        click(prepaymentButton);
    }

    public void closeLoan() {
        click(closeLoanButton);
    }

    public void checkEligibility() {
        click(eligibilityCheck);
    }

    public boolean isSuccessDisplayed() {
        return isDisplayed(successMessage);
    }

    public String getErrorMessage() {
        return getText(errorMessage);
    }

    public void applyLoan(String type, String amount, String tenureMonths) {
        selectLoanType(type);
        enterLoanAmount(amount);
        selectTenure(tenureMonths);
        calculateEMI();
        applyForLoan();
    }
}

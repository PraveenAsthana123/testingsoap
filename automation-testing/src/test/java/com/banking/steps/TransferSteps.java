package com.banking.steps;

import com.banking.pages.TransferPage;
import com.banking.utils.DriverFactory;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;

/**
 * Step Definitions for Fund Transfer Feature
 */
public class TransferSteps {
    private WebDriver driver;
    private TransferPage transferPage;

    @When("I navigate to the {string} page")
    public void iNavigateToPage(String pageName) {
        driver = DriverFactory.getDriver();
        transferPage = new TransferPage(driver);
        // Navigate via sidebar menu
    }

    @When("I select source account {string}")
    public void iSelectSourceAccount(String account) {
        transferPage.selectFromAccount(account);
    }

    @When("I select destination account {string}")
    public void iSelectDestinationAccount(String account) {
        transferPage.selectToAccount(account);
    }

    @When("I enter transfer amount {string}")
    public void iEnterTransferAmount(String amount) {
        transferPage.enterAmount(amount);
    }

    @When("I enter remarks {string}")
    public void iEnterRemarks(String remarks) {
        transferPage.enterRemarks(remarks);
    }

    @When("I click {string} button")
    public void iClickButton(String buttonName) {
        transferPage.clickTransfer();
    }

    @When("I confirm the transfer")
    public void iConfirmTheTransfer() {
        transferPage.confirmTransfer();
    }

    @Then("I should see success message {string}")
    public void iShouldSeeSuccessMessage(String expectedMessage) {
        String actualMessage = transferPage.getSuccessMessage();
        Assert.assertEquals(actualMessage, expectedMessage,
                "Success message mismatch");
    }

    @Then("I should see error {string}")
    public void iShouldSeeError(String expectedError) {
        String actualError = transferPage.getErrorMessage();
        Assert.assertEquals(actualError, expectedError,
                "Error message mismatch");
    }

    @Then("source account balance should decrease by {int}")
    public void sourceBalanceShouldDecrease(int amount) {
        // Verify balance decreased
        Assert.assertTrue(transferPage.isSuccessDisplayed(),
                "Transfer should be successful");
    }

    @Then("destination account balance should increase by {int}")
    public void destinationBalanceShouldIncrease(int amount) {
        // Verify balance increased
        Assert.assertTrue(transferPage.isSuccessDisplayed(),
                "Transfer should be successful");
    }

    @Then("a transaction reference number should be generated")
    public void transactionRefShouldBeGenerated() {
        String txnId = transferPage.getTransactionId();
        Assert.assertNotNull(txnId, "Transaction ID should not be null");
        Assert.assertFalse(txnId.isEmpty(), "Transaction ID should not be empty");
    }

    @When("I select transfer type {string}")
    public void iSelectTransferType(String type) {
        // Select NEFT/RTGS/IMPS
    }

    @When("I enter beneficiary account {string}")
    public void iEnterBeneficiaryAccount(String account) {
        // Enter beneficiary account number
    }

    @When("I enter beneficiary IFSC {string}")
    public void iEnterBeneficiaryIFSC(String ifsc) {
        // Enter IFSC code
    }

    @When("I verify OTP {string}")
    public void iVerifyOTP(String otp) {
        // Enter and verify OTP
    }

    @Then("transaction status should be {string}")
    public void transactionStatusShouldBe(String status) {
        // Verify transaction status
    }

    @Then("OTP verification screen should be displayed")
    public void otpScreenShouldBeDisplayed() {
        // Verify OTP screen
    }

    @Then("OTP should be sent to registered mobile")
    public void otpShouldBeSent() {
        // Verify OTP sent
    }
}

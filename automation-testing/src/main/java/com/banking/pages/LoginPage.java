package com.banking.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Login Page - Page Object for Banking Login
 */
public class LoginPage extends BasePage {

    // Locators
    private By usernameField = By.id("username");
    private By passwordField = By.id("password");
    private By loginButton = By.id("loginBtn");
    private By errorMessage = By.cssSelector(".error-message");
    private By forgotPasswordLink = By.linkText("Forgot Password?");
    private By rememberMeCheckbox = By.id("rememberMe");
    private By captchaField = By.id("captcha");
    private By otpField = By.id("otp");
    private By otpSubmitButton = By.id("otpSubmit");
    private By logoutButton = By.id("logoutBtn");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    // ========== Actions ==========

    public void enterUsername(String username) {
        type(usernameField, username);
    }

    public void enterPassword(String password) {
        type(passwordField, password);
    }

    public void clickLogin() {
        click(loginButton);
    }

    public DashboardPage login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
        return new DashboardPage(driver);
    }

    public String getErrorMessage() {
        return getText(errorMessage);
    }

    public boolean isErrorDisplayed() {
        return isDisplayed(errorMessage);
    }

    public void clickForgotPassword() {
        click(forgotPasswordLink);
    }

    public void checkRememberMe() {
        if (!driver.findElement(rememberMeCheckbox).isSelected()) {
            click(rememberMeCheckbox);
        }
    }

    public void enterOTP(String otp) {
        type(otpField, otp);
        click(otpSubmitButton);
    }

    public boolean isLoginPageDisplayed() {
        return isDisplayed(loginButton);
    }

    public boolean isLoginButtonEnabled() {
        return isEnabled(loginButton);
    }
}

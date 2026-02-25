package com.banking.pages;

import com.banking.utils.WaitHelper;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

/**
 * Base Page - Common methods for all page objects
 * All page classes extend this
 */
public class BasePage {
    protected WebDriver driver;
    protected WaitHelper waitHelper;
    protected Actions actions;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.waitHelper = new WaitHelper(driver);
        this.actions = new Actions(driver);
        PageFactory.initElements(driver, this);
    }

    // ========== Core Actions ==========

    protected void click(By locator) {
        waitHelper.waitForClickable(locator).click();
    }

    protected void click(WebElement element) {
        waitHelper.waitForClickable(element.toString().contains("By") ?
                By.id("") : By.xpath("//*"));
        element.click();
    }

    protected void type(By locator, String text) {
        WebElement element = waitHelper.waitForVisible(locator);
        element.clear();
        element.sendKeys(text);
    }

    protected String getText(By locator) {
        return waitHelper.waitForVisible(locator).getText();
    }

    protected String getAttribute(By locator, String attribute) {
        return waitHelper.waitForPresence(locator).getAttribute(attribute);
    }

    protected boolean isDisplayed(By locator) {
        try {
            return driver.findElement(locator).isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    protected boolean isEnabled(By locator) {
        return driver.findElement(locator).isEnabled();
    }

    // ========== Dropdown ==========

    protected void selectByText(By locator, String text) {
        new Select(waitHelper.waitForVisible(locator)).selectByVisibleText(text);
    }

    protected void selectByValue(By locator, String value) {
        new Select(waitHelper.waitForVisible(locator)).selectByValue(value);
    }

    protected void selectByIndex(By locator, int index) {
        new Select(waitHelper.waitForVisible(locator)).selectByIndex(index);
    }

    // ========== JavaScript ==========

    protected void jsClick(By locator) {
        WebElement element = driver.findElement(locator);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    protected void jsScrollTo(By locator) {
        WebElement element = driver.findElement(locator);
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
    }

    protected void jsType(By locator, String text) {
        WebElement element = driver.findElement(locator);
        ((JavascriptExecutor) driver).executeScript("arguments[0].value='" + text + "'", element);
    }

    // ========== Navigation ==========

    public void navigateTo(String url) {
        driver.get(url);
        waitHelper.waitForPageLoad();
    }

    public String getPageTitle() {
        return driver.getTitle();
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    // ========== Alerts ==========

    public String getAlertText() {
        return waitHelper.waitForAlert().getText();
    }

    public void acceptAlert() {
        waitHelper.waitForAlert().accept();
    }

    public void dismissAlert() {
        waitHelper.waitForAlert().dismiss();
    }

    // ========== Frames ==========

    public void switchToFrame(String frameId) {
        waitHelper.waitForFrameAndSwitch(frameId);
    }

    public void switchToDefaultContent() {
        driver.switchTo().defaultContent();
    }

    // ========== Actions ==========

    protected void hover(By locator) {
        actions.moveToElement(driver.findElement(locator)).perform();
    }

    protected void doubleClick(By locator) {
        actions.doubleClick(driver.findElement(locator)).perform();
    }

    protected void rightClick(By locator) {
        actions.contextClick(driver.findElement(locator)).perform();
    }

    protected void dragAndDrop(By source, By target) {
        actions.dragAndDrop(driver.findElement(source), driver.findElement(target)).perform();
    }
}

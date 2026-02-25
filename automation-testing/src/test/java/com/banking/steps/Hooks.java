package com.banking.steps;

import com.banking.utils.ConfigReader;
import com.banking.utils.DriverFactory;
import com.banking.utils.ScreenshotUtil;
import io.cucumber.java.After;
import io.cucumber.java.AfterStep;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.openqa.selenium.WebDriver;

/**
 * Cucumber Hooks - Setup and Teardown for each scenario
 */
public class Hooks {

    @Before("@banking and not @api and not @mobile")
    public void setupBrowser(Scenario scenario) {
        String browser = System.getProperty("browser", ConfigReader.getBrowser());
        DriverFactory.initDriver(browser);
        System.out.println("Starting scenario: " + scenario.getName());
        System.out.println("Browser: " + browser);
    }

    @Before("@android")
    public void setupAndroid(Scenario scenario) {
        DriverFactory.initAndroidDriver();
        System.out.println("Starting Android scenario: " + scenario.getName());
    }

    @Before("@ios")
    public void setupIOS(Scenario scenario) {
        DriverFactory.initIOSDriver();
        System.out.println("Starting iOS scenario: " + scenario.getName());
    }

    @Before("@api")
    public void setupAPI(Scenario scenario) {
        System.out.println("Starting API scenario: " + scenario.getName());
        // No browser needed for API tests
    }

    @After
    public void tearDown(Scenario scenario) {
        WebDriver driver = DriverFactory.getDriver();
        if (driver != null) {
            if (scenario.isFailed()) {
                // Capture screenshot on failure
                byte[] screenshot = ScreenshotUtil.captureScreenshotAsBytes(driver);
                scenario.attach(screenshot, "image/png", "failure-screenshot");
                String path = ScreenshotUtil.captureScreenshot(driver, scenario.getName());
                System.out.println("Screenshot saved: " + path);
            }
            DriverFactory.quitDriver();
        }
        System.out.println("Scenario " + scenario.getName() + " - " + scenario.getStatus());
    }

    @AfterStep
    public void afterStep(Scenario scenario) {
        // Optional: capture screenshot after each step for debugging
        if (ConfigReader.getBoolean("screenshot.each.step", false)) {
            WebDriver driver = DriverFactory.getDriver();
            if (driver != null) {
                byte[] screenshot = ScreenshotUtil.captureScreenshotAsBytes(driver);
                scenario.attach(screenshot, "image/png", "step-screenshot");
            }
        }
    }
}

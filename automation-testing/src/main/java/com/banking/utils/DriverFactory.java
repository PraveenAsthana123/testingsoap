package com.banking.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.ios.options.XCUITestOptions;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.net.URL;
import java.time.Duration;

/**
 * Driver Factory - Creates WebDriver and Appium Driver instances
 * Thread-safe with ThreadLocal for parallel execution
 */
public class DriverFactory {
    private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    public static WebDriver getDriver() {
        return driver.get();
    }

    /**
     * Initialize browser-based WebDriver
     */
    public static void initDriver(String browser) {
        WebDriver webDriver;
        boolean headless = ConfigReader.isHeadless();

        switch (browser.toLowerCase()) {
            case "chrome":
                WebDriverManager.chromedriver().setup();
                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.addArguments("--start-maximized");
                chromeOptions.addArguments("--disable-notifications");
                chromeOptions.addArguments("--disable-popup-blocking");
                chromeOptions.addArguments("--no-sandbox");
                chromeOptions.addArguments("--disable-dev-shm-usage");
                if (headless) {
                    chromeOptions.addArguments("--headless=new");
                    chromeOptions.addArguments("--window-size=1920,1080");
                }
                webDriver = new ChromeDriver(chromeOptions);
                break;

            case "firefox":
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions ffOptions = new FirefoxOptions();
                if (headless) {
                    ffOptions.addArguments("--headless");
                    ffOptions.addArguments("--width=1920");
                    ffOptions.addArguments("--height=1080");
                }
                webDriver = new FirefoxDriver(ffOptions);
                break;

            case "edge":
                WebDriverManager.edgedriver().setup();
                EdgeOptions edgeOptions = new EdgeOptions();
                edgeOptions.addArguments("--start-maximized");
                if (headless) {
                    edgeOptions.addArguments("--headless=new");
                }
                webDriver = new EdgeDriver(edgeOptions);
                break;

            default:
                throw new RuntimeException("Unsupported browser: " + browser);
        }

        int implicitWait = ConfigReader.getInt("implicit.wait", 10);
        int pageLoad = ConfigReader.getInt("page.load.timeout", 30);
        webDriver.manage().timeouts().implicitlyWait(Duration.ofSeconds(implicitWait));
        webDriver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(pageLoad));

        if (!headless) {
            webDriver.manage().window().maximize();
        }

        driver.set(webDriver);
    }

    /**
     * Initialize Appium Android Driver
     */
    public static void initAndroidDriver() {
        try {
            UiAutomator2Options options = new UiAutomator2Options();
            options.setDeviceName(ConfigReader.get("appium.device.name", "emulator-5554"));
            options.setPlatformName("Android");
            options.setAutomationName("UiAutomator2");

            String appPath = ConfigReader.get("appium.app.path");
            if (appPath != null && !appPath.isEmpty()) {
                options.setApp(appPath);
            } else {
                options.setAppPackage(ConfigReader.get("appium.app.package"));
                options.setAppActivity(ConfigReader.get("appium.app.activity"));
            }

            String appiumUrl = ConfigReader.get("appium.server.url", "http://127.0.0.1:4723");
            AndroidDriver androidDriver = new AndroidDriver(new URL(appiumUrl), options);
            androidDriver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            driver.set(androidDriver);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Android Driver: " + e.getMessage());
        }
    }

    /**
     * Initialize Appium iOS Driver
     */
    public static void initIOSDriver() {
        try {
            XCUITestOptions options = new XCUITestOptions();
            options.setDeviceName(ConfigReader.get("ios.device.name", "iPhone 15"));
            options.setPlatformVersion(ConfigReader.get("ios.platform.version", "17.0"));
            options.setAutomationName("XCUITest");

            String appPath = ConfigReader.get("ios.app.path");
            if (appPath != null && !appPath.isEmpty()) {
                options.setApp(appPath);
            }

            String appiumUrl = ConfigReader.get("appium.server.url", "http://127.0.0.1:4723");
            IOSDriver iosDriver = new IOSDriver(new URL(appiumUrl), options);
            iosDriver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            driver.set(iosDriver);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize iOS Driver: " + e.getMessage());
        }
    }

    /**
     * Quit driver and cleanup
     */
    public static void quitDriver() {
        if (driver.get() != null) {
            driver.get().quit();
            driver.remove();
        }
    }
}

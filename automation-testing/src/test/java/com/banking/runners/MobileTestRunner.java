package com.banking.runners;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.DataProvider;

/**
 * Mobile Test Runner - Runs @mobile tagged scenarios (Appium)
 * Usage: mvn test -Pmobile
 */
@CucumberOptions(
        features = "src/test/resources/features",
        glue = {"com.banking.steps"},
        tags = "@mobile or @android or @ios",
        plugin = {
                "pretty",
                "html:target/cucumber-reports/mobile-report.html",
                "json:target/cucumber-reports/mobile-report.json",
                "com.aventstack.extentreports.cucumber.adapter.ExtentCucumberAdapter:"
        },
        monochrome = true
)
public class MobileTestRunner extends AbstractTestNGCucumberTests {

    @Override
    @DataProvider(parallel = false)
    public Object[][] scenarios() {
        return super.scenarios();
    }
}

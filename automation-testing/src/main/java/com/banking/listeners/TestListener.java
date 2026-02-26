package com.banking.listeners;

import com.banking.utils.ScreenshotUtil;
import org.openqa.selenium.WebDriver;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * TestNG Test Listener - Captures test events for reporting and monitoring
 */
public class TestListener implements ITestListener {
    private static int passed = 0;
    private static int failed = 0;
    private static int skipped = 0;
    private static long startTime;

    @Override
    public void onStart(ITestContext context) {
        startTime = System.currentTimeMillis();
        passed = 0;
        failed = 0;
        skipped = 0;
        System.out.println("========================================");
        System.out.println("  TEST SUITE: " + context.getName());
        System.out.println("  Started: " + LocalDateTime.now().format(
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        System.out.println("========================================");
    }

    @Override
    public void onTestStart(ITestResult result) {
        System.out.println("[START] " + result.getMethod().getMethodName());
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        passed++;
        long duration = result.getEndMillis() - result.getStartMillis();
        System.out.println("[PASS] " + result.getMethod().getMethodName() +
                " (" + duration + "ms)");
    }

    @Override
    public void onTestFailure(ITestResult result) {
        failed++;
        long duration = result.getEndMillis() - result.getStartMillis();
        System.out.println("[FAIL] " + result.getMethod().getMethodName() +
                " (" + duration + "ms)");
        System.out.println("  Error: " + result.getThrowable().getMessage());

        // Capture screenshot on failure if driver is available
        try {
            Object driver = result.getTestContext().getAttribute("driver");
            if (driver instanceof WebDriver) {
                String path = ScreenshotUtil.captureScreenshot(
                        (WebDriver) driver, result.getMethod().getMethodName());
                System.out.println("  Screenshot: " + path);
            }
        } catch (Exception e) {
            System.out.println("  Screenshot capture failed: " + e.getMessage());
        }
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        skipped++;
        System.out.println("[SKIP] " + result.getMethod().getMethodName());
        if (result.getThrowable() != null) {
            System.out.println("  Reason: " + result.getThrowable().getMessage());
        }
    }

    @Override
    public void onFinish(ITestContext context) {
        long duration = System.currentTimeMillis() - startTime;
        int total = passed + failed + skipped;
        double passRate = total > 0 ? (double) passed / total * 100 : 0;

        System.out.println("========================================");
        System.out.println("  TEST RESULTS SUMMARY");
        System.out.println("========================================");
        System.out.println("  Total    : " + total);
        System.out.println("  Passed   : " + passed);
        System.out.println("  Failed   : " + failed);
        System.out.println("  Skipped  : " + skipped);
        System.out.println("  Pass Rate: " + String.format("%.1f%%", passRate));
        System.out.println("  Duration : " + (duration / 1000) + "s");
        System.out.println("  Finished : " + LocalDateTime.now().format(
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        System.out.println("========================================");
    }
}

package com.banking.utils;

import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

/**
 * Retry Analyzer - Retries failed tests up to maxRetryCount
 * Handles flaky tests that may fail due to timing or environment issues
 */
public class RetryAnalyzer implements IRetryAnalyzer {
    private int retryCount = 0;
    private static final int MAX_RETRY_COUNT = 2; // Retry failed tests up to 2 times

    @Override
    public boolean retry(ITestResult result) {
        if (retryCount < MAX_RETRY_COUNT) {
            retryCount++;
            System.out.println("Retrying test '" + result.getName() +
                    "' - Attempt " + retryCount + " of " + MAX_RETRY_COUNT);
            return true;
        }
        return false;
    }
}

import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12' };

const TABS = [
  { key:'Console', label:'Console' },
  { key:'Network', label:'Network' },
  { key:'Performance', label:'Performance' },
  { key:'Elements', label:'Elements/DOM' },
  { key:'Storage', label:'Storage' },
  { key:'Security', label:'Security Panel' },
];
const DIFF = ['Beginner','Intermediate','Advanced'];
const DC = { Beginner:'#2ecc71', Intermediate:'#f39c12', Advanced:'#e74c3c' };
const TC = { Console:'#e74c3c', Network:'#3498db', Performance:'#9b59b6', Elements:'#2ecc71', Storage:'#e67e22', Security:'#1abc9c' };

const S = [
  {id:'F12-001',title:'JavaScript Error Detection & Logging',layer:'Console',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',
   description:'Monitors the browser console for JavaScript errors, uncaught exceptions, and runtime warnings during page navigation and user interactions across critical application flows.',
   prerequisites:'Playwright 1.40+, Node.js 18+, Target application running on localhost:3000',
   config:'APP_URL=http://localhost:3000\nCONSOLE_LOG_LEVEL=error,warning\nSCREENSHOT_ON_ERROR=true\nTIMEOUT_MS=30000\nBROWSER=chromium',
   code:`const { test, expect } = require('@playwright/test');

test('F12-001: Detect JS errors in console', async ({ page }) => {
    const errors = [];
    const warnings = [];

    // Attach console listener before navigation
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
        if (msg.type() === 'warning') warnings.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    // Navigate through critical flows
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    await page.click('[data-testid="dashboard-link"]');
    await page.waitForTimeout(2000);

    await page.click('[data-testid="reports-link"]');
    await page.waitForTimeout(2000);

    await page.click('[data-testid="settings-link"]');
    await page.waitForTimeout(2000);

    // Assert zero critical errors
    console.log('Errors found:', errors.length);
    console.log('Warnings found:', warnings.length);
    errors.forEach(e => console.log('  ERROR:', e));
    warnings.forEach(w => console.log('  WARN:', w));

    expect(errors.length).toBe(0);
    expect(warnings.length).toBeLessThan(5);
});`,
   expectedOutput:`[TEST] F12-001: JavaScript Error Detection & Logging
[INFO] Launching Chromium browser instance
[INFO] Attaching console and pageerror listeners
[PASS] Homepage loaded: 0 console errors
[PASS] Dashboard page: 0 console errors
[INFO] 1 warning detected: "DevTools source map warning"
[PASS] Reports page: 0 console errors
[PASS] Settings page: 0 console errors
[INFO] Total errors: 0 | Total warnings: 1
[PASS] All critical flows passed without JS errors
[PASS] Warning count (1) below threshold (5)
───────────────────────────────────
F12-001: JS Error Detection — 5 passed, 0 failed`},

  {id:'F12-002',title:'Console Log Audit & Sensitive Data Leak',layer:'Console',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',
   description:'Audits all console.log, console.info, and console.debug statements for sensitive data leaks including tokens, passwords, PII, API keys, and internal URLs that should not appear in production builds.',
   prerequisites:'Playwright 1.40+, Production build of target application, Regex patterns for sensitive data',
   config:'APP_URL=http://localhost:3000\nSENSITIVE_PATTERNS=Bearer,password,apiKey,secret,token,ssn,credit_card\nMAX_ALLOWED_LOGS=20\nENVIRONMENT=production',
   code:`const { test, expect } = require('@playwright/test');

test('F12-002: Audit console for sensitive data', async ({ page }) => {
    const allLogs = [];
    const sensitiveLeaks = [];
    const patterns = [
        /Bearer\\s+[A-Za-z0-9\\-._~+\\/]+/i,
        /password[\\s]*[:=][\\s]*[^\\s]+/i,
        /api[_-]?key[\\s]*[:=][\\s]*[^\\s]+/i,
        /secret[\\s]*[:=][\\s]*[^\\s]+/i,
        /\\b\\d{3}-\\d{2}-\\d{4}\\b/,      // SSN
        /\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b/, // CC
        /eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}/ // JWT
    ];

    page.on('console', msg => {
        const text = msg.text();
        allLogs.push({ type: msg.type(), text });
        for (const pat of patterns) {
            if (pat.test(text)) {
                sensitiveLeaks.push({ type: msg.type(), text, pattern: pat.source });
                break;
            }
        }
    });

    await page.goto('http://localhost:3000');
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'Secret@123');
    await page.click('[data-testid="login-btn"]');
    await page.waitForLoadState('networkidle');
    await page.goto('http://localhost:3000/profile');
    await page.waitForTimeout(3000);

    console.log('Total logs:', allLogs.length);
    console.log('Sensitive leaks:', sensitiveLeaks.length);
    sensitiveLeaks.forEach(l => console.log('  LEAK:', l.text.substring(0, 50)));

    expect(sensitiveLeaks.length).toBe(0);
    expect(allLogs.length).toBeLessThan(20);
});`,
   expectedOutput:`[TEST] F12-002: Console Log Audit & Sensitive Data Leak
[INFO] Monitoring console for 7 sensitive data patterns
[INFO] Navigating login flow as testuser
[PASS] Login page: no sensitive data in console
[PASS] Post-login: no tokens leaked to console
[PASS] Profile page: no PII in console output
[INFO] Total console entries: 8 (below threshold 20)
[PASS] Zero SSN/credit card patterns detected
[PASS] Zero JWT tokens logged to console
[PASS] Zero API keys or secrets exposed
[INFO] Patterns checked: Bearer, password, apiKey, secret, SSN, CC, JWT
───────────────────────────────────
F12-002: Console Audit — 5 passed, 0 failed`},

  {id:'F12-003',title:'Unhandled Promise Rejection & CSP Violation Monitor',layer:'Console',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',
   description:'Detects unhandled promise rejections, Content Security Policy violations, and memory leak warnings in the browser console during SPA navigation and dynamic content loading.',
   prerequisites:'Playwright 1.40+, CSP headers configured on target app, Application with async operations',
   config:'APP_URL=http://localhost:3000\nCSP_REPORT_URI=/api/csp-report\nMEMORY_THRESHOLD_MB=100\nMAX_LISTENERS=50\nNAVIGATION_TIMEOUT=15000',
   code:`const { test, expect } = require('@playwright/test');

test('F12-003: Unhandled rejections & CSP violations', async ({ page }) => {
    const rejections = [];
    const cspViolations = [];
    const memoryWarnings = [];

    page.on('pageerror', err => {
        if (err.message.includes('Unhandled')) rejections.push(err.message);
    });
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Content Security Policy')) cspViolations.push(text);
        if (text.includes('memory') || text.includes('leak')) memoryWarnings.push(text);
        if (text.includes('MaxListenersExceeded')) memoryWarnings.push(text);
    });

    // Navigate through SPA routes with dynamic content
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const routes = ['/dashboard', '/reports', '/analytics', '/settings', '/profile'];
    for (const route of routes) {
        await page.goto(\`http://localhost:3000\${route}\`);
        await page.waitForTimeout(2000);
    }

    // Rapid navigation to trigger memory issues
    for (let i = 0; i < 10; i++) {
        await page.goto('http://localhost:3000/dashboard');
        await page.goto('http://localhost:3000/reports');
    }

    const metrics = await page.evaluate(() => performance.memory
        ? { usedJSHeapSize: performance.memory.usedJSHeapSize }
        : { usedJSHeapSize: 0 });
    const heapMB = Math.round(metrics.usedJSHeapSize / 1024 / 1024);

    expect(rejections.length).toBe(0);
    expect(cspViolations.length).toBe(0);
    expect(heapMB).toBeLessThan(100);
});`,
   expectedOutput:`[TEST] F12-003: Unhandled Rejections & CSP Violations
[INFO] Monitoring: promise rejections, CSP, memory warnings
[PASS] Homepage: 0 unhandled rejections
[PASS] /dashboard: no CSP violations
[PASS] /reports: no CSP violations
[PASS] /analytics: no CSP violations
[PASS] /settings: no unhandled rejections
[PASS] /profile: clean console
[INFO] Rapid navigation: 20 page loads completed
[PASS] Memory after rapid nav: 47 MB (threshold: 100 MB)
[PASS] Zero CSP violations across all routes
[PASS] Zero unhandled promise rejections
[INFO] MaxListenersExceeded warnings: 0
───────────────────────────────────
F12-003: Promise/CSP/Memory — 8 passed, 0 failed`},

  {id:'F12-004',title:'XHR/Fetch Request Monitoring & Validation',layer:'Network',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',
   description:'Monitors all XHR and Fetch API requests from the browser Network tab, validating request methods, headers, payloads, and ensuring correct API endpoint usage during user workflows.',
   prerequisites:'Playwright 1.40+, Target application with REST API calls, API documentation for expected endpoints',
   config:'APP_URL=http://localhost:3000\nAPI_BASE=http://localhost:8080/api/v1\nEXPECTED_ENDPOINTS=/auth/login,/users/me,/dashboard/stats\nTIMEOUT_MS=30000',
   code:`const { test, expect } = require('@playwright/test');

test('F12-004: Monitor XHR/Fetch requests', async ({ page }) => {
    const apiRequests = [];
    const expectedEndpoints = ['/api/v1/auth/login', '/api/v1/users/me', '/api/v1/dashboard/stats'];

    page.on('request', req => {
        if (req.resourceType() === 'xhr' || req.resourceType() === 'fetch') {
            apiRequests.push({
                url: req.url(),
                method: req.method(),
                headers: req.headers(),
                postData: req.postData()
            });
        }
    });

    // Login flow
    await page.goto('http://localhost:3000/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'Test@123');
    await page.click('#login-btn');
    await page.waitForLoadState('networkidle');

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');

    // Validate captured requests
    const hitEndpoints = apiRequests.map(r => new URL(r.url).pathname);
    for (const ep of expectedEndpoints) {
        const found = hitEndpoints.some(h => h.includes(ep));
        console.log(\`Endpoint \${ep}: \${found ? 'HIT' : 'MISSING'}\`);
    }

    expect(apiRequests.length).toBeGreaterThan(0);
    expect(apiRequests.every(r => r.headers['content-type'])).toBeTruthy();
    for (const ep of expectedEndpoints) {
        expect(hitEndpoints.some(h => h.includes(ep))).toBeTruthy();
    }
});`,
   expectedOutput:`[TEST] F12-004: XHR/Fetch Request Monitoring
[INFO] Intercepting XHR and Fetch requests
[INFO] Login flow initiated for testuser
[PASS] POST /api/v1/auth/login captured (XHR)
[PASS] GET /api/v1/users/me captured (Fetch)
[PASS] GET /api/v1/dashboard/stats captured (Fetch)
[INFO] Total API requests intercepted: 5
[PASS] All requests have Content-Type header
[PASS] All expected endpoints hit during workflow
[PASS] Login payload contains username field
[INFO] Methods: POST=1, GET=4
───────────────────────────────────
F12-004: XHR/Fetch Monitor — 5 passed, 0 failed`},

  {id:'F12-005',title:'API Response Time & Failed Request Detection',layer:'Network',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',
   description:'Measures API response times from the Network tab and detects failed requests (4xx/5xx), slow responses exceeding SLA thresholds, and network timeout errors during application usage.',
   prerequisites:'Playwright 1.40+, Application with multiple API endpoints, Defined SLA thresholds',
   config:'APP_URL=http://localhost:3000\nRESPONSE_TIME_SLA_MS=2000\nSLOW_THRESHOLD_MS=1000\nFAILURE_TOLERANCE=0\nRETRY_ON_TIMEOUT=false',
   code:`const { test, expect } = require('@playwright/test');

test('F12-005: API response time & failure detection', async ({ page }) => {
    const responses = [];
    const failures = [];
    const slowRequests = [];
    const SLA_MS = 2000;
    const SLOW_MS = 1000;

    page.on('response', async resp => {
        const req = resp.request();
        if (req.resourceType() === 'xhr' || req.resourceType() === 'fetch') {
            const timing = resp.request().timing();
            const duration = timing ? timing.responseEnd - timing.requestStart : 0;
            const entry = {
                url: req.url(), status: resp.status(),
                method: req.method(), duration
            };
            responses.push(entry);
            if (resp.status() >= 400) failures.push(entry);
            if (duration > SLOW_MS) slowRequests.push(entry);
        }
    });

    page.on('requestfailed', req => {
        failures.push({
            url: req.url(), status: 0,
            method: req.method(), error: req.failure()?.errorText
        });
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const pages = ['/dashboard', '/reports', '/settings'];
    for (const p of pages) {
        await page.goto(\`http://localhost:3000\${p}\`);
        await page.waitForLoadState('networkidle');
    }

    const avgTime = responses.reduce((s, r) => s + r.duration, 0) / (responses.length || 1);

    expect(failures.length).toBe(0);
    expect(slowRequests.length).toBe(0);
    expect(avgTime).toBeLessThan(SLA_MS);
});`,
   expectedOutput:`[TEST] F12-005: API Response Time & Failed Request Detection
[INFO] SLA threshold: 2000ms | Slow threshold: 1000ms
[PASS] Homepage: 3 API calls, avg 245ms
[PASS] /dashboard: 4 API calls, avg 312ms
[PASS] /reports: 2 API calls, avg 189ms
[PASS] /settings: 2 API calls, avg 156ms
[INFO] Total API responses monitored: 11
[PASS] Zero failed requests (4xx/5xx)
[PASS] Zero slow requests (>1000ms)
[PASS] Average response time: 228ms (SLA: 2000ms)
[INFO] Fastest: 89ms GET /api/v1/health
[INFO] Slowest: 487ms GET /api/v1/reports/data
───────────────────────────────────
F12-005: Response Time & Failures — 6 passed, 0 failed`},

  {id:'F12-006',title:'CORS Error Analysis & Payload Size Monitoring',layer:'Network',framework:'Selenium',language:'Python',difficulty:'Advanced',
   description:'Detects Cross-Origin Resource Sharing (CORS) errors, analyzes preflight OPTIONS requests, and monitors request/response payload sizes to identify oversized API calls impacting performance.',
   prerequisites:'Selenium WebDriver 4.x, ChromeDriver with logging prefs, Target app with cross-origin requests',
   config:'APP_URL=http://localhost:3000\nAPI_ORIGIN=http://api.localhost:8080\nMAX_PAYLOAD_KB=512\nMAX_RESPONSE_KB=2048\nCORS_ALLOWED_ORIGINS=http://localhost:3000',
   code:`from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import json, unittest

class TestCORSAndPayload(unittest.TestCase):
    def setUp(self):
        opts = Options()
        opts.add_argument('--headless')
        opts.set_capability('goog:loggingPrefs', {'browser': 'ALL', 'performance': 'ALL'})
        self.driver = webdriver.Chrome(options=opts)

    def tearDown(self):
        self.driver.quit()

    def test_cors_errors(self):
        self.driver.get('http://localhost:3000')
        logs = self.driver.get_log('browser')
        cors_errors = [l for l in logs if 'CORS' in l.get('message', '')
                       or 'Access-Control' in l.get('message', '')]
        self.assertEqual(len(cors_errors), 0, f"CORS errors: {cors_errors}")

    def test_payload_sizes(self):
        self.driver.get('http://localhost:3000/dashboard')
        perf_logs = self.driver.get_log('performance')
        oversized = []
        for entry in perf_logs:
            msg = json.loads(entry['message'])['message']
            if msg['method'] == 'Network.responseReceived':
                resp = msg['params']['response']
                size_kb = resp.get('encodedDataLength', 0) / 1024
                if size_kb > 2048:
                    oversized.append({'url': resp['url'], 'size_kb': round(size_kb, 1)})
        self.assertEqual(len(oversized), 0, f"Oversized: {oversized}")

    def test_preflight_options(self):
        self.driver.get('http://localhost:3000')
        perf_logs = self.driver.get_log('performance')
        preflights = []
        for entry in perf_logs:
            msg = json.loads(entry['message'])['message']
            if msg['method'] == 'Network.requestWillBeSent':
                req = msg['params']['request']
                if req.get('method') == 'OPTIONS':
                    preflights.append(req['url'])
        for pf in preflights:
            self.assertIn('api.localhost', pf)`,
   expectedOutput:`[TEST] F12-006: CORS Error Analysis & Payload Size Monitoring
[INFO] Chrome DevTools Protocol: browser + performance logging
[PASS] Zero CORS errors in browser console
[PASS] Zero Access-Control-Allow-Origin violations
[INFO] Analyzing Network performance logs
[PASS] All response payloads under 2048 KB limit
[INFO] Largest response: 487 KB (GET /api/v1/reports/data)
[INFO] Smallest response: 0.2 KB (GET /api/v1/health)
[PASS] Preflight OPTIONS requests target correct API origin
[INFO] Preflight count: 3 (all to api.localhost:8080)
[PASS] CORS headers present: Access-Control-Allow-Origin, Allow-Methods
───────────────────────────────────
F12-006: CORS & Payload — 4 passed, 0 failed`},

  {id:'F12-007',title:'Core Web Vitals Measurement (FCP, LCP, CLS, FID)',layer:'Performance',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',
   description:'Measures Core Web Vitals metrics using the Performance tab including First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and First Input Delay (FID) against Google thresholds.',
   prerequisites:'Playwright 1.40+, Chrome DevTools Protocol access, Target app deployed on test environment',
   config:'APP_URL=http://localhost:3000\nFCP_THRESHOLD_MS=1800\nLCP_THRESHOLD_MS=2500\nCLS_THRESHOLD=0.1\nFID_THRESHOLD_MS=100\nTTFB_THRESHOLD_MS=800',
   code:`const { test, expect } = require('@playwright/test');

test('F12-007: Core Web Vitals measurement', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Measure FCP and LCP via PerformanceObserver
    const vitals = await page.evaluate(() => {
        return new Promise(resolve => {
            const results = {};
            const entries = performance.getEntriesByType('paint');
            const fcp = entries.find(e => e.name === 'first-contentful-paint');
            results.fcp = fcp ? fcp.startTime : null;

            const navEntries = performance.getEntriesByType('navigation');
            results.ttfb = navEntries[0] ? navEntries[0].responseStart : null;

            const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
            results.lcp = lcpEntries.length > 0
                ? lcpEntries[lcpEntries.length - 1].startTime : null;

            let clsScore = 0;
            performance.getEntriesByType('layout-shift').forEach(entry => {
                if (!entry.hadRecentInput) clsScore += entry.value;
            });
            results.cls = clsScore;
            resolve(results);
        });
    });

    console.log('FCP:', vitals.fcp, 'ms');
    console.log('LCP:', vitals.lcp, 'ms');
    console.log('CLS:', vitals.cls);
    console.log('TTFB:', vitals.ttfb, 'ms');

    expect(vitals.fcp).toBeLessThan(1800);
    expect(vitals.lcp).toBeLessThan(2500);
    expect(vitals.cls).toBeLessThan(0.1);
    expect(vitals.ttfb).toBeLessThan(800);
});`,
   expectedOutput:`[TEST] F12-007: Core Web Vitals Measurement
[INFO] Chrome DevTools Protocol session established
[INFO] Performance monitoring enabled
[PASS] FCP (First Contentful Paint): 412ms (threshold: 1800ms)
[PASS] LCP (Largest Contentful Paint): 1247ms (threshold: 2500ms)
[PASS] CLS (Cumulative Layout Shift): 0.03 (threshold: 0.1)
[PASS] TTFB (Time to First Byte): 189ms (threshold: 800ms)
[INFO] Paint entries: 2 (first-paint, first-contentful-paint)
[INFO] Layout shift entries: 4 (total CLS: 0.03)
[PASS] All Core Web Vitals within Google "Good" thresholds
───────────────────────────────────
F12-007: Core Web Vitals — 5 passed, 0 failed`},

  {id:'F12-008',title:'Memory Profiling & Heap Snapshot Analysis',layer:'Performance',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',
   description:'Profiles JavaScript memory usage via the Performance tab by taking heap snapshots, detecting memory growth patterns, detached DOM nodes, and potential memory leaks during repeated user actions.',
   prerequisites:'Playwright 1.40+, Chrome DevTools Protocol, Application with complex UI components',
   config:'APP_URL=http://localhost:3000\nHEAP_GROWTH_THRESHOLD_MB=20\nMEMORY_CAP_MB=150\nITERATIONS=10\nDETACHED_NODE_THRESHOLD=50',
   code:`const { test, expect } = require('@playwright/test');

test('F12-008: Memory profiling & leak detection', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('HeapProfiler.enable');

    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');

    // Baseline heap measurement
    await client.send('HeapProfiler.collectGarbage');
    const baseline = await page.evaluate(() => ({
        usedJSHeap: performance.memory?.usedJSHeapSize || 0,
        totalJSHeap: performance.memory?.totalJSHeapSize || 0
    }));
    const baselineMB = Math.round(baseline.usedJSHeap / 1024 / 1024);

    // Perform repeated actions to detect leaks
    for (let i = 0; i < 10; i++) {
        await page.click('[data-testid="open-modal"]');
        await page.waitForTimeout(500);
        await page.click('[data-testid="close-modal"]');
        await page.waitForTimeout(500);
    }

    // Post-action heap measurement
    await client.send('HeapProfiler.collectGarbage');
    const after = await page.evaluate(() => ({
        usedJSHeap: performance.memory?.usedJSHeapSize || 0,
        totalJSHeap: performance.memory?.totalJSHeapSize || 0
    }));
    const afterMB = Math.round(after.usedJSHeap / 1024 / 1024);
    const growth = afterMB - baselineMB;

    // Check for detached DOM nodes
    const detachedCount = await page.evaluate(() => {
        const walker = document.createTreeWalker(
            document, NodeFilter.SHOW_ELEMENT);
        let count = 0, node;
        while (node = walker.nextNode()) {
            if (!document.body.contains(node)) count++;
        }
        return count;
    });

    console.log(\`Baseline: \${baselineMB}MB, After: \${afterMB}MB, Growth: \${growth}MB\`);
    console.log(\`Detached DOM nodes: \${detachedCount}\`);

    expect(growth).toBeLessThan(20);
    expect(afterMB).toBeLessThan(150);
    expect(detachedCount).toBeLessThan(50);
});`,
   expectedOutput:`[TEST] F12-008: Memory Profiling & Heap Snapshot Analysis
[INFO] HeapProfiler enabled via CDP
[INFO] Baseline heap: 34 MB (after GC)
[INFO] Performing 10 modal open/close cycles
[PASS] Heap after 10 iterations: 38 MB
[PASS] Memory growth: 4 MB (threshold: 20 MB)
[PASS] Total heap within cap: 38 MB (limit: 150 MB)
[PASS] Detached DOM nodes: 3 (threshold: 50)
[INFO] GC reclaimed: ~2 MB between cycles
[PASS] No memory leak pattern detected
[INFO] Heap growth rate: 0.4 MB/iteration (stable)
───────────────────────────────────
F12-008: Memory Profiling — 4 passed, 0 failed`},

  {id:'F12-009',title:'CPU Usage & Rendering Bottleneck Analysis',layer:'Performance',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',
   description:'Analyzes CPU usage patterns, long-running tasks, rendering bottlenecks, and forced reflow/layout thrashing using the Performance tab tracing API to identify performance anti-patterns.',
   prerequisites:'Playwright 1.40+, Chrome DevTools Protocol, Application with animations and dynamic content',
   config:'APP_URL=http://localhost:3000\nLONG_TASK_THRESHOLD_MS=50\nFRAME_BUDGET_MS=16.67\nTRACE_DURATION_MS=5000\nMAX_LONG_TASKS=5',
   code:`const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('F12-009: CPU & rendering bottleneck analysis', async ({ page }) => {
    const client = await page.context().newCDPSession(page);

    // Start performance tracing
    await client.send('Tracing.start', {
        categories: 'devtools.timeline,v8.execute,disabled-by-default-devtools.timeline',
        options: 'sampling-frequency=10000'
    });

    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');

    // Trigger heavy interactions
    await page.click('[data-testid="load-chart"]');
    await page.waitForTimeout(3000);
    await page.click('[data-testid="filter-data"]');
    await page.waitForTimeout(2000);

    // Stop tracing and collect data
    const traceData = await client.send('Tracing.end');

    // Analyze long tasks via PerformanceObserver
    const longTasks = await page.evaluate(() => {
        return new Promise(resolve => {
            const tasks = [];
            const observer = new PerformanceObserver(list => {
                list.getEntries().forEach(entry => {
                    tasks.push({ duration: entry.duration, startTime: entry.startTime });
                });
            });
            observer.observe({ type: 'longtask', buffered: true });
            setTimeout(() => { observer.disconnect(); resolve(tasks); }, 1000);
        });
    });

    // Measure frame rate
    const fps = await page.evaluate(() => {
        return new Promise(resolve => {
            let frames = 0;
            const start = performance.now();
            function count() {
                frames++;
                if (performance.now() - start < 1000) requestAnimationFrame(count);
                else resolve(frames);
            }
            requestAnimationFrame(count);
        });
    });

    console.log(\`Long tasks: \${longTasks.length}, FPS: \${fps}\`);
    expect(longTasks.length).toBeLessThan(5);
    expect(fps).toBeGreaterThan(30);
});`,
   expectedOutput:`[TEST] F12-009: CPU Usage & Rendering Bottleneck Analysis
[INFO] Performance tracing started (devtools.timeline, v8.execute)
[INFO] Dashboard loaded, triggering heavy interactions
[PASS] Long tasks detected: 2 (threshold: 5)
[INFO] Long task 1: 78ms at 1234ms (chart rendering)
[INFO] Long task 2: 62ms at 3456ms (data filtering)
[PASS] Frame rate: 58 FPS (minimum: 30 FPS)
[PASS] No layout thrashing detected
[INFO] Total trace events: 1,247
[PASS] CPU idle time: 78% (healthy)
[INFO] Main thread busy time: 22% over 5s window
───────────────────────────────────
F12-009: CPU & Rendering — 3 passed, 0 failed`},

  {id:'F12-010',title:'DOM Manipulation Detection & Mutation Tracking',layer:'Elements',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',
   description:'Uses the Elements panel concepts to detect DOM mutations, track element additions/removals, monitor attribute changes, and validate that dynamic content updates follow expected patterns.',
   prerequisites:'Playwright 1.40+, Application with dynamic DOM updates, MutationObserver support',
   config:'APP_URL=http://localhost:3000\nMAX_DOM_NODES=1500\nMAX_DOM_DEPTH=32\nMUTATION_TIMEOUT_MS=5000\nTRACK_ATTRIBUTES=class,style,data-*',
   code:`const { test, expect } = require('@playwright/test');

test('F12-010: DOM mutation detection & tracking', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');

    // Set up MutationObserver to track DOM changes
    const mutations = await page.evaluate(() => {
        return new Promise(resolve => {
            const log = { added: 0, removed: 0, attrChanged: 0, textChanged: 0 };
            const observer = new MutationObserver(mutationsList => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        log.added += mutation.addedNodes.length;
                        log.removed += mutation.removedNodes.length;
                    } else if (mutation.type === 'attributes') {
                        log.attrChanged++;
                    } else if (mutation.type === 'characterData') {
                        log.textChanged++;
                    }
                }
            });
            observer.observe(document.body, {
                childList: true, attributes: true,
                characterData: true, subtree: true
            });
            // Trigger some user actions (simulated)
            setTimeout(() => { observer.disconnect(); resolve(log); }, 5000);
        });
    });

    // Count total DOM nodes and depth
    const domStats = await page.evaluate(() => {
        let count = 0, maxDepth = 0;
        function walk(node, depth) {
            count++;
            if (depth > maxDepth) maxDepth = depth;
            for (const child of node.children) walk(child, depth + 1);
        }
        walk(document.body, 0);
        return { totalNodes: count, maxDepth };
    });

    console.log('Mutations:', JSON.stringify(mutations));
    console.log('DOM stats:', JSON.stringify(domStats));

    expect(domStats.totalNodes).toBeLessThan(1500);
    expect(domStats.maxDepth).toBeLessThan(32);
    expect(mutations.removed).toBeLessThan(mutations.added * 2);
});`,
   expectedOutput:`[TEST] F12-010: DOM Manipulation Detection & Mutation Tracking
[INFO] MutationObserver attached to document.body
[INFO] Observing: childList, attributes, characterData, subtree
[PASS] DOM nodes added: 47 | removed: 12
[PASS] Attribute changes: 23 (class, style updates)
[PASS] Text content changes: 8 (data bindings)
[PASS] Total DOM nodes: 834 (threshold: 1500)
[PASS] Max DOM depth: 18 (threshold: 32)
[PASS] Removal/addition ratio: 0.26 (healthy)
[INFO] Most mutated element: .dashboard-widget (14 changes)
───────────────────────────────────
F12-010: DOM Mutations — 6 passed, 0 failed`},

  {id:'F12-011',title:'Accessibility Audit via DevTools',layer:'Elements',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',
   description:'Performs automated accessibility (a11y) audits using the Elements panel accessibility tree, checking ARIA attributes, color contrast ratios, keyboard navigation, focus management, and semantic HTML usage.',
   prerequisites:'Playwright 1.40+, axe-core library installed, Target app with form elements and interactive controls',
   config:'APP_URL=http://localhost:3000\nWCAG_LEVEL=AA\nMIN_CONTRAST_RATIO=4.5\nMAX_A11Y_VIOLATIONS=0\nCHECK_PAGES=/,/login,/dashboard,/settings',
   code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('F12-011: Accessibility audit via DevTools', async ({ page }) => {
    const pagesToCheck = ['/', '/login', '/dashboard', '/settings'];
    const allViolations = [];

    for (const path of pagesToCheck) {
        await page.goto(\`http://localhost:3000\${path}\`);
        await page.waitForLoadState('networkidle');

        // Run axe-core accessibility scan
        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze();
        if (results.violations.length > 0) {
            results.violations.forEach(v => {
                allViolations.push({
                    page: path, id: v.id,
                    impact: v.impact, description: v.description,
                    nodes: v.nodes.length
                });
            });
        }
    }

    // Check ARIA attributes on interactive elements
    const ariaCheck = await page.evaluate(() => {
        const issues = [];
        document.querySelectorAll('button, a, input, select, textarea').forEach(el => {
            if (!el.getAttribute('aria-label') && !el.textContent.trim()
                && !el.getAttribute('aria-labelledby')) {
                issues.push({ tag: el.tagName, id: el.id || 'unknown' });
            }
        });
        return issues;
    });

    // Check heading hierarchy
    const headings = await page.evaluate(() => {
        const h = [];
        document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(el => {
            h.push(parseInt(el.tagName[1]));
        });
        return h;
    });
    const headingSkips = headings.filter((h, i) => i > 0 && h > headings[i-1] + 1);

    expect(allViolations.filter(v => v.impact === 'critical').length).toBe(0);
    expect(ariaCheck.length).toBe(0);
    expect(headingSkips.length).toBe(0);
});`,
   expectedOutput:`[TEST] F12-011: Accessibility Audit via DevTools
[INFO] WCAG 2.1 AA compliance check on 4 pages
[PASS] / (Homepage): 0 violations
[PASS] /login: 0 violations
[PASS] /dashboard: 0 violations
[PASS] /settings: 0 violations
[PASS] Zero critical a11y violations across all pages
[PASS] All interactive elements have ARIA labels
[PASS] Heading hierarchy: no level skips (h1->h2->h3)
[INFO] Elements scanned: 312 buttons, 45 links, 28 inputs
[INFO] Color contrast: all ratios above 4.5:1 (WCAG AA)
───────────────────────────────────
F12-011: Accessibility Audit — 7 passed, 0 failed`},

  {id:'F12-012',title:'CSS Layout Validation & Responsive Breakpoint Testing',layer:'Elements',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',
   description:'Validates CSS layout properties, detects overflow issues, checks responsive design breakpoints, and ensures elements render correctly across different viewport sizes using computed styles from the Elements panel.',
   prerequisites:'Playwright 1.40+, Responsive design specifications, Breakpoint definitions',
   config:'APP_URL=http://localhost:3000\nBREAKPOINTS=320x568,768x1024,1024x768,1440x900,1920x1080\nOVERFLOW_CHECK=true\nZ_INDEX_MAX=9999',
   code:`const { test, expect } = require('@playwright/test');

test('F12-012: CSS layout & responsive breakpoints', async ({ browser }) => {
    const breakpoints = [
        { name: 'Mobile-S', width: 320, height: 568 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Laptop', width: 1024, height: 768 },
        { name: 'Desktop', width: 1440, height: 900 },
        { name: 'Wide', width: 1920, height: 1080 }
    ];
    const issues = [];

    for (const bp of breakpoints) {
        const ctx = await browser.newContext({ viewport: { width: bp.width, height: bp.height } });
        const page = await ctx.newPage();
        await page.goto('http://localhost:3000/dashboard');
        await page.waitForLoadState('networkidle');

        // Check horizontal overflow
        const hasHOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        if (hasHOverflow) issues.push(\`\${bp.name}: horizontal overflow detected\`);

        // Check visibility of key elements
        const navVisible = await page.isVisible('[data-testid="main-nav"]');
        const contentVisible = await page.isVisible('[data-testid="main-content"]');
        if (!contentVisible) issues.push(\`\${bp.name}: main content not visible\`);

        // Check for overlapping elements via z-index audit
        const zIndexIssues = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            let maxZ = 0, count = 0;
            elements.forEach(el => {
                const z = parseInt(getComputedStyle(el).zIndex);
                if (!isNaN(z) && z > 9999) count++;
                if (!isNaN(z) && z > maxZ) maxZ = z;
            });
            return { maxZ, excessiveCount: count };
        });
        if (zIndexIssues.excessiveCount > 0)
            issues.push(\`\${bp.name}: \${zIndexIssues.excessiveCount} excessive z-index\`);

        await ctx.close();
    }

    console.log(\`Issues: \${issues.length}\`, issues);
    expect(issues.length).toBe(0);
});`,
   expectedOutput:`[TEST] F12-012: CSS Layout & Responsive Breakpoint Testing
[INFO] Testing 5 viewport breakpoints
[PASS] Mobile-S (320x568): no overflow, content visible
[PASS] Tablet (768x1024): no overflow, nav + content visible
[PASS] Laptop (1024x768): no overflow, full layout rendered
[PASS] Desktop (1440x900): no overflow, all elements visible
[PASS] Wide (1920x1080): no overflow, layout stretched correctly
[PASS] Zero horizontal overflow across all breakpoints
[PASS] Zero excessive z-index values (max: 100)
[INFO] Key elements validated: main-nav, main-content, footer
───────────────────────────────────
F12-012: CSS Layout & Responsive — 7 passed, 0 failed`},

  {id:'F12-013',title:'Cookie Security Flags Audit (HttpOnly, Secure, SameSite)',layer:'Storage',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',
   description:'Audits all browser cookies from the Storage panel for security best practices including HttpOnly flag, Secure flag, SameSite attribute, proper expiration, and absence of sensitive data in cookie values.',
   prerequisites:'Playwright 1.40+, Application that sets authentication and session cookies',
   config:'APP_URL=http://localhost:3000\nREQUIRED_FLAGS=HttpOnly,Secure,SameSite\nSAMESITE_VALUE=Strict\nMAX_COOKIE_AGE_DAYS=30\nSENSITIVE_PATTERNS=password,token,ssn,secret',
   code:`const { test, expect } = require('@playwright/test');

test('F12-013: Cookie security flags audit', async ({ page, context }) => {
    // Login to set authentication cookies
    await page.goto('http://localhost:3000/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'Test@123');
    await page.click('#login-btn');
    await page.waitForLoadState('networkidle');

    const cookies = await context.cookies();
    const issues = [];
    const sensitivePatterns = [/password/i, /token/i, /ssn/i, /secret/i, /key/i];

    for (const cookie of cookies) {
        // Check HttpOnly on session cookies
        if (cookie.name.includes('session') || cookie.name.includes('auth')) {
            if (!cookie.httpOnly)
                issues.push(\`\${cookie.name}: missing HttpOnly flag\`);
            if (!cookie.secure)
                issues.push(\`\${cookie.name}: missing Secure flag\`);
            if (cookie.sameSite !== 'Strict' && cookie.sameSite !== 'Lax')
                issues.push(\`\${cookie.name}: SameSite=\${cookie.sameSite}\`);
        }

        // Check for sensitive data in cookie values
        for (const pat of sensitivePatterns) {
            if (pat.test(cookie.value))
                issues.push(\`\${cookie.name}: contains sensitive pattern \${pat}\`);
        }

        // Check expiration (no permanent cookies)
        if (cookie.expires > 0) {
            const daysUntilExpiry = (cookie.expires - Date.now() / 1000) / 86400;
            if (daysUntilExpiry > 30)
                issues.push(\`\${cookie.name}: expires in \${Math.round(daysUntilExpiry)} days\`);
        }
    }

    console.log(\`Cookies: \${cookies.length}, Issues: \${issues.length}\`);
    issues.forEach(i => console.log('  ISSUE:', i));
    expect(issues.length).toBe(0);
});`,
   expectedOutput:`[TEST] F12-013: Cookie Security Flags Audit
[INFO] Login completed, analyzing cookies
[INFO] Total cookies found: 4
[PASS] session_id: HttpOnly=true, Secure=true, SameSite=Strict
[PASS] auth_token: HttpOnly=true, Secure=true, SameSite=Strict
[PASS] csrf_token: Secure=true, SameSite=Strict
[PASS] preferences: SameSite=Lax (non-sensitive)
[PASS] Zero sensitive data patterns in cookie values
[PASS] All session cookies expire within 30 days
[INFO] Cookie lifetimes: session_id=1d, auth_token=1d, csrf_token=1h
───────────────────────────────────
F12-013: Cookie Security — 6 passed, 0 failed`},

  {id:'F12-014',title:'LocalStorage & SessionStorage Security Audit',layer:'Storage',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',
   description:'Audits localStorage and sessionStorage for sensitive data exposure, validates proper data lifecycle management, checks for excessive storage usage, and ensures tokens/secrets are not persisted in client-side storage.',
   prerequisites:'Playwright 1.40+, Application that uses Web Storage API, Known list of sensitive data keys',
   config:'APP_URL=http://localhost:3000\nMAX_LOCAL_STORAGE_KB=5120\nMAX_SESSION_STORAGE_KB=5120\nBANNED_KEYS=password,secret,api_key,private_key,credit_card\nTOKEN_MAX_AGE_MIN=60',
   code:`const { test, expect } = require('@playwright/test');

test('F12-014: localStorage & sessionStorage audit', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'Test@123');
    await page.click('#login-btn');
    await page.waitForLoadState('networkidle');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(2000);

    const storageAudit = await page.evaluate(() => {
        const issues = [];
        const bannedKeys = ['password', 'secret', 'api_key', 'private_key', 'credit_card'];
        const jwtPattern = /^eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$/;

        function auditStorage(storage, name) {
            const entries = {};
            let totalSize = 0;
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                const value = storage.getItem(key);
                totalSize += (key.length + value.length) * 2;
                entries[key] = value.substring(0, 100);

                // Check banned keys
                for (const banned of bannedKeys) {
                    if (key.toLowerCase().includes(banned))
                        issues.push(\`\${name}: banned key "\${key}" found\`);
                }

                // Check for unencrypted JWT tokens
                if (jwtPattern.test(value))
                    issues.push(\`\${name}: raw JWT in "\${key}"\`);

                // Check for PII patterns
                if (/\\b\\d{3}-\\d{2}-\\d{4}\\b/.test(value))
                    issues.push(\`\${name}: SSN pattern in "\${key}"\`);
            }
            return { entries, totalKB: Math.round(totalSize / 1024), count: storage.length };
        }

        const local = auditStorage(localStorage, 'localStorage');
        const session = auditStorage(sessionStorage, 'sessionStorage');
        return { local, session, issues };
    });

    console.log('localStorage:', storageAudit.local.count, 'keys,', storageAudit.local.totalKB, 'KB');
    console.log('sessionStorage:', storageAudit.session.count, 'keys,', storageAudit.session.totalKB, 'KB');

    expect(storageAudit.issues.length).toBe(0);
    expect(storageAudit.local.totalKB).toBeLessThan(5120);
    expect(storageAudit.session.totalKB).toBeLessThan(5120);
});`,
   expectedOutput:`[TEST] F12-014: LocalStorage & SessionStorage Security Audit
[INFO] Post-login storage analysis
[PASS] localStorage: 6 keys, 12 KB (limit: 5120 KB)
[PASS] sessionStorage: 3 keys, 2 KB (limit: 5120 KB)
[PASS] Zero banned keys (password, secret, api_key) found
[PASS] Zero raw JWT tokens in storage
[PASS] Zero PII patterns (SSN, credit card) detected
[INFO] localStorage keys: theme, language, sidebar_state, last_page, feature_flags, consent
[INFO] sessionStorage keys: tab_id, view_mode, filter_state
[PASS] Storage sizes within limits
───────────────────────────────────
F12-014: Storage Security — 5 passed, 0 failed`},

  {id:'F12-015',title:'IndexedDB Validation & Data Integrity Check',layer:'Storage',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',
   description:'Validates IndexedDB databases, object stores, and indexes from the Storage panel. Checks data integrity, proper schema design, encryption of sensitive records, and cleanup of stale offline data.',
   prerequisites:'Playwright 1.40+, Application using IndexedDB for offline storage, Known database schema',
   config:'APP_URL=http://localhost:3000\nDB_NAME=app_offline_store\nEXPECTED_STORES=users,transactions,cache\nSTALE_THRESHOLD_HOURS=24\nENCRYPT_STORES=transactions',
   code:`const { test, expect } = require('@playwright/test');

test('F12-015: IndexedDB validation & data integrity', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'Test@123');
    await page.click('#login-btn');
    await page.waitForLoadState('networkidle');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(3000);

    const idbAudit = await page.evaluate(async () => {
        const results = { databases: [], issues: [] };
        const dbs = await indexedDB.databases();
        results.databases = dbs.map(d => ({ name: d.name, version: d.version }));

        for (const dbInfo of dbs) {
            const db = await new Promise((resolve, reject) => {
                const req = indexedDB.open(dbInfo.name, dbInfo.version);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });

            const storeNames = Array.from(db.objectStoreNames);
            for (const storeName of storeNames) {
                const tx = db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const count = await new Promise(resolve => {
                    const req = store.count();
                    req.onsuccess = () => resolve(req.result);
                });

                const indexes = Array.from(store.indexNames);
                results[storeName] = { count, indexes, keyPath: store.keyPath };

                // Check for plaintext sensitive data
                if (storeName === 'transactions') {
                    const allRecords = await new Promise(resolve => {
                        const req = store.getAll();
                        req.onsuccess = () => resolve(req.result);
                    });
                    for (const record of allRecords.slice(0, 10)) {
                        if (record.amount && typeof record.amount === 'number'
                            && !record.encrypted) {
                            results.issues.push(\`\${storeName}: unencrypted amount field\`);
                        }
                    }
                }
            }
            db.close();
        }
        return results;
    });

    console.log('Databases:', JSON.stringify(idbAudit.databases));
    console.log('Issues:', idbAudit.issues.length);

    expect(idbAudit.databases.length).toBeGreaterThan(0);
    expect(idbAudit.issues.length).toBe(0);
});`,
   expectedOutput:`[TEST] F12-015: IndexedDB Validation & Data Integrity
[INFO] Discovered databases: app_offline_store (v3)
[PASS] Object store "users": 12 records, keyPath=id, indexes=[email, department]
[PASS] Object store "transactions": 48 records, keyPath=txId, indexes=[date, status]
[PASS] Object store "cache": 156 records, keyPath=url, indexes=[timestamp]
[PASS] Transaction store: all records have encryption flag
[PASS] Zero plaintext sensitive data in IndexedDB
[INFO] Total records across stores: 216
[INFO] Database version: 3 (schema up to date)
[PASS] All expected object stores present
───────────────────────────────────
F12-015: IndexedDB Validation — 5 passed, 0 failed`},

  {id:'F12-016',title:'Mixed Content & Certificate Validation',layer:'Security',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',
   description:'Detects mixed content warnings (HTTP resources loaded on HTTPS pages) from the Security panel, validates SSL certificate details, and ensures all resources are served over secure connections.',
   prerequisites:'Playwright 1.40+, HTTPS-enabled target application, Chrome DevTools Protocol access',
   config:'APP_URL=https://localhost:3443\nALLOW_MIXED_CONTENT=false\nMIN_TLS_VERSION=TLSv1.2\nCERT_WARNING_DAYS=30\nCHECK_SUBRESOURCES=true',
   code:`const { test, expect } = require('@playwright/test');

test('F12-016: Mixed content & certificate validation', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Security.enable');

    const securityEvents = [];
    const mixedContent = [];

    client.on('Security.securityStateChanged', event => {
        securityEvents.push(event);
        if (event.mixedContentStatus && event.mixedContentStatus !== 'none') {
            mixedContent.push(event);
        }
    });

    // Monitor insecure requests
    page.on('request', req => {
        if (req.url().startsWith('http://') && !req.url().includes('localhost')) {
            mixedContent.push({
                url: req.url(),
                type: req.resourceType()
            });
        }
    });

    await page.goto('https://localhost:3443');
    await page.waitForLoadState('networkidle');

    // Navigate to multiple pages
    const pages = ['/dashboard', '/reports', '/settings', '/profile'];
    for (const p of pages) {
        await page.goto(\`https://localhost:3443\${p}\`);
        await page.waitForLoadState('networkidle');
    }

    // Get security details via CDP
    const securityState = await client.send('Security.getSecurityState' in client
        ? 'Security.getSecurityState' : 'Security.enable');

    // Check all loaded resources for HTTP
    const httpResources = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        return resources
            .filter(r => r.name.startsWith('http://'))
            .map(r => ({ url: r.name, type: r.initiatorType }));
    });

    console.log(\`Mixed content: \${mixedContent.length}\`);
    console.log(\`HTTP resources: \${httpResources.length}\`);
    console.log(\`Security events: \${securityEvents.length}\`);

    expect(mixedContent.length).toBe(0);
    expect(httpResources.length).toBe(0);
});`,
   expectedOutput:`[TEST] F12-016: Mixed Content & Certificate Validation
[INFO] Security panel monitoring enabled via CDP
[PASS] Homepage: security state = secure
[PASS] /dashboard: zero mixed content
[PASS] /reports: zero mixed content
[PASS] /settings: zero mixed content
[PASS] /profile: zero mixed content
[PASS] Zero HTTP resources loaded on HTTPS pages
[INFO] All subresources served over TLS
[INFO] Security events captured: 5
[PASS] No mixed content warnings across 5 pages
───────────────────────────────────
F12-016: Mixed Content & Cert — 7 passed, 0 failed`},

  {id:'F12-017',title:'HSTS & Security Headers Validation',layer:'Security',framework:'Selenium',language:'Python',difficulty:'Intermediate',
   description:'Validates HTTP Strict Transport Security (HSTS), Content Security Policy (CSP), X-Frame-Options, X-Content-Type-Options, and other security headers from the Security panel response headers analysis.',
   prerequisites:'Selenium WebDriver 4.x, ChromeDriver, HTTPS-enabled application, requests library',
   config:'APP_URL=https://localhost:3443\nHSTS_MAX_AGE=31536000\nCSP_POLICY=default-src self\nX_FRAME_OPTIONS=DENY\nREFERRER_POLICY=strict-origin-when-cross-origin',
   code:`import requests
import unittest

class TestSecurityHeaders(unittest.TestCase):
    BASE = "https://localhost:3443"
    ENDPOINTS = ["/", "/login", "/dashboard", "/api/v1/health"]

    REQUIRED_HEADERS = {
        "Strict-Transport-Security": "max-age=31536000",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    }

    def test_security_headers_present(self):
        for endpoint in self.ENDPOINTS:
            resp = requests.get(f"{self.BASE}{endpoint}", verify=False, timeout=10)
            for header, expected_value in self.REQUIRED_HEADERS.items():
                actual = resp.headers.get(header)
                self.assertIsNotNone(actual,
                    f"{endpoint}: missing {header}")
                self.assertIn(expected_value, actual,
                    f"{endpoint}: {header}={actual}")

    def test_csp_header(self):
        resp = requests.get(f"{self.BASE}/", verify=False, timeout=10)
        csp = resp.headers.get("Content-Security-Policy")
        self.assertIsNotNone(csp, "CSP header missing")
        self.assertIn("default-src", csp)
        self.assertNotIn("unsafe-inline", csp)
        self.assertNotIn("unsafe-eval", csp)

    def test_hsts_preload(self):
        resp = requests.get(f"{self.BASE}/", verify=False, timeout=10)
        hsts = resp.headers.get("Strict-Transport-Security", "")
        self.assertIn("max-age=31536000", hsts)
        self.assertIn("includeSubDomains", hsts)

    def test_no_server_info_leakage(self):
        resp = requests.get(f"{self.BASE}/", verify=False, timeout=10)
        server = resp.headers.get("Server", "")
        self.assertNotIn("Apache", server)
        self.assertNotIn("nginx", server)
        self.assertIsNone(resp.headers.get("X-Powered-By"))`,
   expectedOutput:`[TEST] F12-017: HSTS & Security Headers Validation
[PASS] /: all 6 security headers present
[PASS] /login: all 6 security headers present
[PASS] /dashboard: all 6 security headers present
[PASS] /api/v1/health: all 6 security headers present
[PASS] CSP: default-src present, no unsafe-inline/unsafe-eval
[PASS] HSTS: max-age=31536000; includeSubDomains
[PASS] No server version leakage (Server, X-Powered-By)
[INFO] Headers validated: HSTS, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
[INFO] Endpoints checked: 4
───────────────────────────────────
F12-017: Security Headers — 7 passed, 0 failed`},

  {id:'F12-018',title:'Security Panel Full Audit (Origins, Certificates, Vulnerabilities)',layer:'Security',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',
   description:'Performs a comprehensive security panel audit including origin security analysis, certificate chain validation, insecure form detection, deprecated TLS usage, and cross-origin iframe security assessment.',
   prerequisites:'Playwright 1.40+, Chrome DevTools Protocol, HTTPS application with subresources and iframes',
   config:'APP_URL=https://localhost:3443\nALLOWED_ORIGINS=https://localhost:3443,https://cdn.localhost\nMAX_CERT_CHAIN_LENGTH=4\nBLOCK_INSECURE_FORMS=true\nBLOCK_DEPRECATED_TLS=true',
   code:`const { test, expect } = require('@playwright/test');

test('F12-018: Security panel full audit', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Security.enable');
    await client.send('Network.enable');

    const origins = new Map();
    const insecureForms = [];
    const deprecatedTLS = [];
    const iframeIssues = [];

    client.on('Security.securityStateChanged', event => {
        if (event.explanations) {
            event.explanations.forEach(exp => {
                if (exp.securityState === 'insecure') {
                    origins.set(exp.description, exp.securityState);
                }
            });
        }
    });

    page.on('response', async resp => {
        const secDetails = resp.securityDetails();
        if (secDetails) {
            if (secDetails.protocol === 'TLS 1.0' || secDetails.protocol === 'TLS 1.1') {
                deprecatedTLS.push({
                    url: resp.url(), protocol: secDetails.protocol
                });
            }
        }
    });

    await page.goto('https://localhost:3443');
    await page.waitForLoadState('networkidle');

    // Check for insecure form actions
    const formAudit = await page.evaluate(() => {
        const issues = [];
        document.querySelectorAll('form').forEach(form => {
            const action = form.getAttribute('action') || '';
            if (action.startsWith('http://')) {
                issues.push({ action, id: form.id || 'unknown' });
            }
            // Check for password fields without autocomplete=off
            form.querySelectorAll('input[type="password"]').forEach(input => {
                if (input.getAttribute('autocomplete') !== 'off'
                    && input.getAttribute('autocomplete') !== 'new-password'
                    && input.getAttribute('autocomplete') !== 'current-password') {
                    issues.push({ field: input.name, issue: 'missing autocomplete hint' });
                }
            });
        });
        return issues;
    });

    // Check iframe sandbox attributes
    const iframeAudit = await page.evaluate(() => {
        const issues = [];
        document.querySelectorAll('iframe').forEach(iframe => {
            if (!iframe.hasAttribute('sandbox'))
                issues.push({ src: iframe.src, issue: 'missing sandbox attribute' });
            if (!iframe.src.startsWith('https://'))
                issues.push({ src: iframe.src, issue: 'insecure iframe source' });
        });
        return issues;
    });

    // Check for certificate transparency
    const certInfo = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource');
        return entries.filter(e => e.secureConnectionStart > 0).length;
    });

    console.log(\`Insecure origins: \${origins.size}\`);
    console.log(\`Deprecated TLS: \${deprecatedTLS.length}\`);
    console.log(\`Insecure forms: \${formAudit.length}\`);
    console.log(\`Iframe issues: \${iframeAudit.length}\`);

    expect(origins.size).toBe(0);
    expect(deprecatedTLS.length).toBe(0);
    expect(formAudit.length).toBe(0);
    expect(iframeAudit.length).toBe(0);
});`,
   expectedOutput:`[TEST] F12-018: Security Panel Full Audit
[INFO] Security + Network protocols enabled via CDP
[PASS] Zero insecure origins detected
[PASS] Zero deprecated TLS (1.0/1.1) connections
[PASS] Zero insecure form actions (http://)
[PASS] All password fields have autocomplete hints
[PASS] Zero iframe sandbox violations
[PASS] All iframes use HTTPS sources
[INFO] Secure connections: 12 resources with TLS handshake
[INFO] Certificate transparency: all resources verified
[PASS] All origins pass security state check
[INFO] Audit scope: origins, certificates, forms, iframes, TLS
───────────────────────────────────
F12-018: Security Full Audit — 6 passed, 0 failed`},
];

export default function F12TestingLab() {
  const [tab, setTab] = useState('Console');
  const [sel, setSel] = useState(S[0]);
  const [search, setSearch] = useState('');
  const [diffF, setDiffF] = useState('All');
  const [statuses, setStatuses] = useState({});
  const [code, setCode] = useState(S[0].code);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [progress, setProgress] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const timerRef = useRef(null);

  const filtered = S.filter(s => {
    if (s.layer !== tab) return false;
    if (diffF !== 'All' && s.difficulty !== diffF) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pick = useCallback((s) => { setSel(s); setCode(s.code); setOutput(''); setProgress(0); setRunning(false); }, []);

  const runSim = useCallback(() => {
    if (running) return;
    setRunning(true); setOutput(''); setProgress(0);
    const lines = sel.expectedOutput.split('\n');
    let i = 0;
    timerRef.current = setInterval(() => {
      if (i < lines.length) { setOutput(prev => prev + (prev ? '\n' : '') + lines[i]); setProgress(Math.round(((i + 1) / lines.length) * 100)); i++; }
      else { clearInterval(timerRef.current); setRunning(false); setStatuses(prev => ({ ...prev, [sel.id]: 'passed' })); }
    }, 150);
  }, [sel, running]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const totalTab = S.filter(s => s.layer === tab).length;
  const passedTab = S.filter(s => s.layer === tab && statuses[s.id] === 'passed').length;
  const totalAll = S.length;
  const passedAll = Object.values(statuses).filter(v => v === 'passed').length;
  const copy = () => { navigator.clipboard?.writeText(code); };
  const reset = () => { setCode(sel.code); };

  const sty = {
    page:{minHeight:'100vh',background:`linear-gradient(135deg,${C.bgFrom} 0%,${C.bgTo} 100%)`,color:C.text,fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",padding:'18px 22px 40px'},
    h1:{fontSize:28,fontWeight:800,margin:0,background:`linear-gradient(90deg,${C.accent},#3498db)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'},
    sub:{fontSize:13,color:C.muted,marginTop:4},
    statsBar:{display:'flex',justifyContent:'center',gap:24,marginBottom:14,flexWrap:'wrap'},
    stat:{background:C.card,borderRadius:8,padding:'6px 18px',fontSize:13,border:`1px solid ${C.border}`},
    split:{display:'flex',gap:16,height:'calc(100vh - 160px)',minHeight:500},
    left:{width:'38%',minWidth:320,display:'flex',flexDirection:'column',gap:10},
    right:{flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'hidden'},
    tabBar:{display:'flex',gap:4,flexWrap:'wrap'},
    tabBtn:(a)=>({padding:'6px 12px',borderRadius:6,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,background:a?C.accent:C.card,color:a?'#0a0a1a':C.text}),
    input:{flex:1,padding:'7px 12px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:13,outline:'none',minWidth:120},
    select:{padding:'6px 8px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:12,outline:'none'},
    list:{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:6,paddingRight:4},
    card:(a)=>({padding:'10px 14px',borderRadius:8,background:a?C.cardHover:C.card,border:`1px solid ${a?C.accent:C.border}`,cursor:'pointer'}),
    badge:(c)=>({display:'inline-block',padding:'1px 7px',borderRadius:10,fontSize:10,fontWeight:700,background:c+'22',color:c,marginRight:4}),
    dot:(st)=>({display:'inline-block',width:8,height:8,borderRadius:'50%',background:st==='passed'?C.accent:C.muted,marginRight:6}),
    panel:{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:16,overflowY:'auto'},
    editor:{width:'100%',minHeight:200,maxHeight:280,padding:12,borderRadius:8,border:`1px solid ${C.border}`,background:C.editorBg,color:C.editorText,fontFamily:"'Fira Code','Consolas',monospace",fontSize:12,lineHeight:1.6,resize:'vertical',outline:'none',whiteSpace:'pre',overflowX:'auto'},
    btn:(bg)=>({padding:'7px 16px',borderRadius:6,border:'none',cursor:'pointer',fontSize:12,fontWeight:700,background:bg||C.accent,color:(bg===C.danger||bg==='#555')?'#fff':'#0a0a1a'}),
    outBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,fontFamily:"'Fira Code','Consolas',monospace",fontSize:11,color:C.accent,lineHeight:1.7,whiteSpace:'pre-wrap',minHeight:60,maxHeight:180,overflowY:'auto'},
    progBar:{height:4,borderRadius:2,background:'#0a2744',marginTop:6},
    progFill:(p)=>({height:'100%',borderRadius:2,width:p+'%',background:p===100?C.accent:'#3498db',transition:'width 0.3s'}),
    progO:{height:6,borderRadius:3,background:'#0a2744',marginBottom:8},
    progOF:(p)=>({height:'100%',borderRadius:3,width:p+'%',background:`linear-gradient(90deg,${C.accent},#3498db)`,transition:'width 0.4s'}),
    cfgBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,marginTop:8,fontSize:12,lineHeight:1.6,color:C.warn,fontFamily:"'Fira Code','Consolas',monospace",whiteSpace:'pre-wrap'},
  };

  return (
    <div style={sty.page}>
      <div style={{textAlign:'center',marginBottom:16}}>
        <h1 style={sty.h1}>Browser F12 DevTools Testing Lab</h1>
        <div style={sty.sub}>Console, Network, Performance, Elements, Storage & Security Panel Testing — {totalAll} Scenarios</div>
      </div>
      <div style={sty.statsBar}>
        <span style={sty.stat}>Total: <b style={{color:C.accent}}>{totalAll}</b></span>
        <span style={sty.stat}>Passed: <b style={{color:C.accent}}>{passedAll}</b>/{totalAll}</span>
        <span style={sty.stat}>Tab: <b style={{color:C.accent}}>{passedTab}</b>/{totalTab}</span>
        <span style={sty.stat}>Coverage: <b style={{color:C.accent}}>{totalAll>0?Math.round((passedAll/totalAll)*100):0}%</b></span>
      </div>
      <div style={sty.split}>
        <div style={sty.left}>
          <div style={sty.tabBar}>{TABS.map(t=><button key={t.key} style={sty.tabBtn(tab===t.key)} onClick={()=>setTab(t.key)}>{t.label}</button>)}</div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
            <input style={sty.input} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
            <select style={sty.select} value={diffF} onChange={e=>setDiffF(e.target.value)}>{['All',...DIFF].map(d=><option key={d} value={d}>{d==='All'?'Difficulty':d}</option>)}</select>
          </div>
          <div style={sty.progO}><div style={sty.progOF(totalTab>0?Math.round((passedTab/totalTab)*100):0)}/></div>
          <div style={sty.list}>
            {filtered.length===0&&<div style={{color:C.muted,textAlign:'center',padding:20}}>No scenarios match</div>}
            {filtered.map(s=>(
              <div key={s.id} style={sty.card(sel.id===s.id)} onClick={()=>pick(s)}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={sty.dot(statuses[s.id])}/><span style={{fontSize:11,color:C.accent,marginRight:8}}>{s.id}</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.header}}>{s.title}</span>
                </div>
                <div style={{marginTop:4}}>
                  <span style={sty.badge(TC[s.layer]||C.accent)}>{s.layer}</span>
                  <span style={sty.badge(DC[s.difficulty])}>{s.difficulty}</span>
                  <span style={sty.badge('#3498db')}>{s.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={sty.right}>
          <div style={{...sty.panel,flex:'0 0 auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div><span style={{fontSize:14,fontWeight:800,color:C.accent,marginRight:10}}>{sel.id}</span><span style={{fontSize:16,fontWeight:700,color:C.header}}>{sel.title}</span></div>
              <div><span style={sty.badge(TC[sel.layer]||C.accent)}>{sel.layer}</span><span style={sty.badge(DC[sel.difficulty])}>{sel.difficulty}</span><span style={sty.badge('#f1c40f')}>{sel.language}</span></div>
            </div>
            <div style={{fontSize:12,color:C.muted,marginBottom:10,lineHeight:1.5}}>{sel.description}</div>
            <div style={{fontSize:11,color:C.muted}}><b>Prerequisites:</b> {sel.prerequisites}</div>
          </div>
          <div style={{...sty.panel,flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Test Script — {sel.framework}</span>
              <div style={{display:'flex',gap:6}}><button style={sty.btn()} onClick={copy}>Copy</button><button style={sty.btn('#555')} onClick={reset}>Reset</button></div>
            </div>
            <textarea style={sty.editor} value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Expected Output</span>
              <span style={{fontSize:11,color:C.muted}}>{sel.language}</span>
            </div>
            <div style={sty.outBox}>{sel.expectedOutput}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button style={{...sty.btn(running?'#555':C.accent),opacity:running?0.6:1}} onClick={runSim} disabled={running}>{running?'Running...':'Run Test'}</button>
              {statuses[sel.id]==='passed'&&<span style={{color:C.accent,fontSize:12,fontWeight:700}}>PASSED</span>}
              {progress>0&&progress<100&&<span style={{color:'#3498db',fontSize:11}}>{progress}%</span>}
              <button style={{...sty.btn('#3498db'),marginLeft:'auto'}} onClick={()=>setShowConfig(!showConfig)}>{showConfig?'Hide':'Show'} Config</button>
            </div>
            {(running||output)&&(<div><div style={{fontSize:12,fontWeight:700,color:C.header,marginBottom:4}}>Execution Output</div><div style={sty.outBox}>{output||'Starting...'}</div><div style={sty.progBar}><div style={sty.progFill(progress)}/></div></div>)}
            {showConfig&&<div style={sty.cfgBox}><div style={{fontWeight:700,color:C.accent,marginBottom:6}}>Configuration</div><div>{sel.config}</div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

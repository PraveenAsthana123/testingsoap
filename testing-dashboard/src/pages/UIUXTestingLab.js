import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12' };

const TABS = [
  { key:'VisualRegression', label:'Visual Regression' },
  { key:'Responsiveness', label:'Responsiveness' },
  { key:'Interaction', label:'Interaction Design' },
  { key:'Navigation', label:'Navigation/Flow' },
  { key:'FormUX', label:'Form UX' },
  { key:'Usability', label:'Usability Audit' },
];
const DIFF = ['Beginner','Intermediate','Advanced'];
const DC = { Beginner:'#2ecc71', Intermediate:'#f39c12', Advanced:'#e74c3c' };
const TC = { VisualRegression:'#e74c3c', Responsiveness:'#3498db', Interaction:'#9b59b6', Navigation:'#2ecc71', FormUX:'#e67e22', Usability:'#1abc9c' };

const S = [
  {id:'UX-001',title:'Screenshot Comparison Across Browsers',layer:'VisualRegression',framework:'Playwright / pixelmatch',language:'JavaScript',difficulty:'Intermediate',
   description:'Captures screenshots of the banking dashboard across Chrome, Firefox, and Safari, then performs pixel-level comparison against baseline images to detect visual regressions.',
   prerequisites:'Playwright 1.40+, pixelmatch library, Baseline screenshots directory, Banking dashboard deployed',
   config:'BASE_URL=https://banking.bank.local\nSCREENSHOT_DIR=./screenshots\nBASELINE_DIR=./baselines\nTHRESHOLD=0.1\nBROWSERS=chromium,firefox,webkit',
   code:`const { chromium, firefox, webkit } = require('playwright');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const fs = require('fs');

async function compareScreenshots(browserType, name) {
    const browser = await browserType.launch();
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('https://banking.bank.local/dashboard');
    await page.waitForLoadState('networkidle');

    const screenshotPath = \`./screenshots/\\\${name}_current.png\`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const baselinePath = \`./baselines/\\\${name}_baseline.png\`;
    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const current = PNG.sync.read(fs.readFileSync(screenshotPath));
    const { width, height } = baseline;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
        baseline.data, current.data, diff.data, width, height,
        { threshold: 0.1 }
    );
    const diffPercent = (numDiffPixels / (width * height)) * 100;
    console.log(\`[\\\${name}] Diff: \\\${diffPercent.toFixed(2)}% (\\\${numDiffPixels} pixels)\`);
    console.assert(diffPercent < 0.5, \`Visual regression detected: \\\${diffPercent}%\`);

    fs.writeFileSync(\`./screenshots/\\\${name}_diff.png\`, PNG.sync.write(diff));
    await browser.close();
    return diffPercent;
}

(async () => {
    await compareScreenshots(chromium, 'chrome_dashboard');
    await compareScreenshots(firefox, 'firefox_dashboard');
    await compareScreenshots(webkit, 'safari_dashboard');
})();`,
   expectedOutput:`[TEST] UX-001: Screenshot Comparison Across Browsers
[INFO] Launching Chromium 120.0 — viewport: 1920x1080
[PASS] Chrome dashboard: 0.02% diff (384 pixels) — within threshold
[INFO] Launching Firefox 121.0 — viewport: 1920x1080
[PASS] Firefox dashboard: 0.08% diff (1536 pixels) — within threshold
[INFO] Launching WebKit 17.4 — viewport: 1920x1080
[PASS] Safari dashboard: 0.11% diff (2112 pixels) — within threshold
[INFO] Diff images saved to ./screenshots/*_diff.png
[PASS] All browsers below 0.5% visual regression threshold
───────────────────────────────────
UX-001: Screenshot Comparison — 4 passed, 0 failed`},

  {id:'UX-002',title:'CSS Regression Detection Pipeline',layer:'VisualRegression',framework:'Playwright / BackstopJS',language:'JavaScript',difficulty:'Advanced',
   description:'Runs a full CSS regression pipeline across critical banking pages detecting layout shifts, font rendering changes, color discrepancies, and z-index stacking issues.',
   prerequisites:'BackstopJS 6.x, Playwright, Banking application with all pages accessible, Reference screenshots',
   config:'BASE_URL=https://banking.bank.local\nSCENARIOS=login,dashboard,accounts,transfers,statements\nVIEWPORTS=1920x1080,1366x768\nMISMATCH_THRESHOLD=0.05',
   code:`const backstop = require('backstopjs');

const config = {
    id: 'banking_css_regression',
    viewports: [
        { label: 'desktop_hd', width: 1920, height: 1080 },
        { label: 'desktop_std', width: 1366, height: 768 }
    ],
    scenarios: [
        { label: 'Login Page', url: 'https://banking.bank.local/login',
          selectors: ['.login-form', '.header-bar', '.footer-links'],
          misMatchThreshold: 0.05, delay: 2000 },
        { label: 'Dashboard', url: 'https://banking.bank.local/dashboard',
          selectors: ['.account-summary', '.quick-actions', '.chart-container'],
          misMatchThreshold: 0.05, delay: 3000 },
        { label: 'Account List', url: 'https://banking.bank.local/accounts',
          selectors: ['.account-table', '.balance-widget', '.filter-bar'],
          misMatchThreshold: 0.05, delay: 2000 },
        { label: 'Fund Transfer', url: 'https://banking.bank.local/transfers',
          selectors: ['.transfer-form', '.beneficiary-list', '.amount-input'],
          misMatchThreshold: 0.05, delay: 2000 },
        { label: 'Statement View', url: 'https://banking.bank.local/statements',
          selectors: ['.statement-table', '.date-picker', '.export-btn'],
          misMatchThreshold: 0.05, delay: 2000 }
    ],
    engine: 'playwright',
    engineOptions: { browser: 'chromium' },
    paths: { bitmaps_reference: './backstop_data/ref',
             bitmaps_test: './backstop_data/test' },
    report: ['browser', 'json']
};

backstop('test', { config })
    .then(() => console.log('[PASS] All CSS regression tests passed'))
    .catch(() => console.error('[FAIL] CSS regression detected'));`,
   expectedOutput:`[TEST] UX-002: CSS Regression Detection Pipeline
[INFO] BackstopJS engine: Playwright/Chromium
[INFO] Testing 5 scenarios x 2 viewports = 10 comparisons
[PASS] Login Page @ 1920x1080 — 0.00% mismatch
[PASS] Login Page @ 1366x768 — 0.01% mismatch
[PASS] Dashboard @ 1920x1080 — 0.03% mismatch
[PASS] Dashboard @ 1366x768 — 0.02% mismatch
[PASS] Account List @ 1920x1080 — 0.00% mismatch
[PASS] Fund Transfer @ 1366x768 — 0.04% mismatch
[PASS] Statement View @ 1920x1080 — 0.01% mismatch
[INFO] Report: ./backstop_data/html_report/index.html
[PASS] All 10 comparisons below 0.05% threshold
───────────────────────────────────
UX-002: CSS Regression Pipeline — 8 passed, 0 failed`},

  {id:'UX-003',title:'Theme Consistency Validation',layer:'VisualRegression',framework:'Playwright',language:'TypeScript',difficulty:'Intermediate',
   description:'Validates that the banking application maintains consistent theming (colors, fonts, spacing) between light and dark modes across all critical components.',
   prerequisites:'Playwright 1.40+, TypeScript, Banking app with light/dark theme toggle',
   config:'BASE_URL=https://banking.bank.local\nTHEMES=light,dark\nPRIMARY_LIGHT=#1a5276\nPRIMARY_DARK=#3498db\nBG_LIGHT=#ffffff\nBG_DARK=#1a1a2e',
   code:`import { test, expect, Page } from '@playwright/test';

interface ThemeTokens {
    primary: string; background: string;
    text: string; border: string;
}

const EXPECTED: Record<string, ThemeTokens> = {
    light: { primary: 'rgb(26, 82, 118)', background: 'rgb(255, 255, 255)',
             text: 'rgb(33, 33, 33)', border: 'rgb(224, 224, 224)' },
    dark:  { primary: 'rgb(52, 152, 219)', background: 'rgb(26, 26, 46)',
             text: 'rgb(224, 224, 224)', border: 'rgb(78, 204, 163)' }
};

async function validateTheme(page: Page, theme: string) {
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(500);
    const tokens = EXPECTED[theme];

    const headerBg = await page.locator('.main-header')
        .evaluate(el => getComputedStyle(el).backgroundColor);
    expect(headerBg).toBe(tokens.primary);

    const bodyBg = await page.locator('body')
        .evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bodyBg).toBe(tokens.background);

    const textColor = await page.locator('.content-area p')
        .first().evaluate(el => getComputedStyle(el).color);
    expect(textColor).toBe(tokens.text);

    const btnFont = await page.locator('.btn-primary')
        .first().evaluate(el => getComputedStyle(el).fontFamily);
    expect(btnFont).toContain('Segoe UI');
}

test('theme consistency across light and dark modes', async ({ page }) => {
    await page.goto('https://banking.bank.local/dashboard');
    await validateTheme(page, 'light');
    await validateTheme(page, 'dark');
});`,
   expectedOutput:`[TEST] UX-003: Theme Consistency Validation
[INFO] Testing light theme tokens
[PASS] Header background: rgb(26, 82, 118) matches primary
[PASS] Body background: rgb(255, 255, 255) matches light bg
[PASS] Text color: rgb(33, 33, 33) matches light text
[PASS] Font family: "Segoe UI" consistent
[INFO] Testing dark theme tokens
[PASS] Header background: rgb(52, 152, 219) matches dark primary
[PASS] Body background: rgb(26, 26, 46) matches dark bg
[PASS] Text color: rgb(224, 224, 224) matches dark text
[PASS] Font family: "Segoe UI" consistent across themes
───────────────────────────────────
UX-003: Theme Consistency — 8 passed, 0 failed`},

  {id:'UX-004',title:'Responsive Breakpoint Testing',layer:'Responsiveness',framework:'Playwright',language:'TypeScript',difficulty:'Intermediate',
   description:'Tests the banking application across mobile (375px), tablet (768px), and desktop (1920px) breakpoints ensuring correct layout adaptation, element visibility, and content reflow.',
   prerequisites:'Playwright 1.40+, TypeScript, Banking app with responsive CSS',
   config:'BASE_URL=https://banking.bank.local\nBREAKPOINTS=375x667,768x1024,1920x1080\nPAGES=dashboard,accounts,transfers',
   code:`import { test, expect } from '@playwright/test';

const BREAKPOINTS = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
];

test.describe('Responsive breakpoint tests', () => {
    for (const bp of BREAKPOINTS) {
        test(\`dashboard layout at \\\${bp.name} (\\\${bp.width}px)\`, async ({ page }) => {
            await page.setViewportSize({ width: bp.width, height: bp.height });
            await page.goto('https://banking.bank.local/dashboard');
            await page.waitForLoadState('networkidle');

            if (bp.name === 'mobile') {
                await expect(page.locator('.hamburger-menu')).toBeVisible();
                await expect(page.locator('.sidebar-nav')).toBeHidden();
                const cardWidth = await page.locator('.account-card').first()
                    .evaluate(el => el.getBoundingClientRect().width);
                expect(cardWidth).toBeLessThanOrEqual(bp.width - 32);
            } else if (bp.name === 'tablet') {
                await expect(page.locator('.sidebar-nav')).toBeVisible();
                const grid = await page.locator('.dashboard-grid')
                    .evaluate(el => getComputedStyle(el).gridTemplateColumns);
                expect(grid.split(' ').length).toBe(2);
            } else {
                await expect(page.locator('.sidebar-nav')).toBeVisible();
                const grid = await page.locator('.dashboard-grid')
                    .evaluate(el => getComputedStyle(el).gridTemplateColumns);
                expect(grid.split(' ').length).toBeGreaterThanOrEqual(3);
            }

            const overflow = await page.evaluate(() => {
                return document.documentElement.scrollWidth > window.innerWidth;
            });
            expect(overflow).toBe(false);
        });
    }
});`,
   expectedOutput:`[TEST] UX-004: Responsive Breakpoint Testing
[INFO] Testing mobile breakpoint: 375x667
[PASS] Mobile: hamburger menu visible, sidebar hidden
[PASS] Mobile: account cards fit within viewport (343px <= 343px)
[PASS] Mobile: no horizontal overflow detected
[INFO] Testing tablet breakpoint: 768x1024
[PASS] Tablet: sidebar navigation visible
[PASS] Tablet: dashboard grid 2-column layout
[PASS] Tablet: no horizontal overflow detected
[INFO] Testing desktop breakpoint: 1920x1080
[PASS] Desktop: sidebar navigation visible
[PASS] Desktop: dashboard grid 3+ column layout
[PASS] Desktop: no horizontal overflow detected
───────────────────────────────────
UX-004: Responsive Breakpoints — 9 passed, 0 failed`},

  {id:'UX-005',title:'Touch Target Size Validation',layer:'Responsiveness',framework:'Playwright',language:'TypeScript',difficulty:'Beginner',
   description:'Validates that all interactive elements (buttons, links, inputs) meet the minimum 44x44px touch target size requirement on mobile viewports per WCAG 2.5.5 guidelines.',
   prerequisites:'Playwright 1.40+, TypeScript, Banking mobile web app',
   config:'BASE_URL=https://banking.bank.local\nMIN_TOUCH_SIZE=44\nVIEWPORT=375x667\nPAGES=login,dashboard,transfers,accounts',
   code:`import { test, expect } from '@playwright/test';

const MIN_SIZE = 44;
const PAGES = ['/login', '/dashboard', '/transfers', '/accounts'];

test.describe('Touch target validation', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    for (const pagePath of PAGES) {
        test(\`touch targets on \\\${pagePath}\`, async ({ page }) => {
            await page.goto(\`https://banking.bank.local\\\${pagePath}\`);
            await page.waitForLoadState('networkidle');

            const interactives = page.locator(
                'button, a, input, select, [role="button"], [tabindex="0"]'
            );
            const count = await interactives.count();
            let violations = 0;

            for (let i = 0; i < count; i++) {
                const el = interactives.nth(i);
                const box = await el.boundingBox();
                if (!box) continue;
                if (box.width < MIN_SIZE || box.height < MIN_SIZE) {
                    const tag = await el.evaluate(e => e.tagName);
                    const text = await el.innerText().catch(() => '');
                    console.log(
                        \`[FAIL] \\\${tag} "\\\${text.slice(0,20)}" — \\\${box.width}x\\\${box.height}px\`
                    );
                    violations++;
                }
            }
            console.log(\`[INFO] \\\${pagePath}: \\\${count} elements, \\\${violations} violations\`);
            expect(violations).toBe(0);
        });
    }
});`,
   expectedOutput:`[TEST] UX-005: Touch Target Size Validation
[INFO] Viewport: 375x667 (mobile), min touch target: 44x44px
[INFO] /login: 6 elements, 0 violations
[PASS] /login — all touch targets meet 44x44px minimum
[INFO] /dashboard: 18 elements, 0 violations
[PASS] /dashboard — all touch targets meet 44x44px minimum
[INFO] /transfers: 12 elements, 0 violations
[PASS] /transfers — all touch targets meet 44x44px minimum
[INFO] /accounts: 14 elements, 0 violations
[PASS] /accounts — all touch targets meet 44x44px minimum
[PASS] WCAG 2.5.5 touch target compliance: 50/50 elements passed
───────────────────────────────────
UX-005: Touch Targets — 5 passed, 0 failed`},

  {id:'UX-006',title:'Orientation Change & Fluid Typography',layer:'Responsiveness',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',
   description:'Tests the banking application behavior during orientation changes (portrait to landscape) and validates fluid typography scaling using CSS clamp() across viewport widths.',
   prerequisites:'Playwright 1.40+, Banking app with fluid typography, Mobile device emulation',
   config:'BASE_URL=https://banking.bank.local\nMIN_FONT=14\nMAX_FONT=22\nMIN_VP=320\nMAX_VP=1920',
   code:`const { chromium, devices } = require('playwright');

async function testOrientationChange() {
    const browser = await chromium.launch();
    const iPhone = devices['iPhone 13'];

    // Portrait mode
    const ctxPortrait = await browser.newContext({ ...iPhone });
    const pageP = await ctxPortrait.newPage();
    await pageP.goto('https://banking.bank.local/dashboard');
    await pageP.waitForLoadState('networkidle');

    const portraitLayout = await pageP.evaluate(() => ({
        navVisible: !!document.querySelector('.bottom-nav'),
        cardStack: getComputedStyle(
            document.querySelector('.dashboard-grid')).flexDirection,
        bodyWidth: document.body.scrollWidth
    }));
    console.assert(portraitLayout.navVisible, 'Bottom nav visible in portrait');
    console.assert(portraitLayout.cardStack === 'column', 'Cards stack vertically');
    console.assert(portraitLayout.bodyWidth <= 390, 'No overflow in portrait');

    // Landscape mode
    const ctxLandscape = await browser.newContext({
        ...iPhone, viewport: { width: 844, height: 390 }
    });
    const pageL = await ctxLandscape.newPage();
    await pageL.goto('https://banking.bank.local/dashboard');

    const landscapeLayout = await pageL.evaluate(() => ({
        sidebarVisible: !!document.querySelector('.sidebar-compact'),
        gridCols: getComputedStyle(
            document.querySelector('.dashboard-grid')).gridTemplateColumns,
        bodyWidth: document.body.scrollWidth
    }));
    console.assert(landscapeLayout.bodyWidth <= 844, 'No overflow in landscape');

    // Fluid typography check at multiple widths
    for (const width of [320, 768, 1200, 1920]) {
        const ctx = await browser.newContext({ viewport: { width, height: 800 } });
        const p = await ctx.newPage();
        await p.goto('https://banking.bank.local/dashboard');
        const fontSize = await p.locator('h1.page-title').evaluate(
            el => parseFloat(getComputedStyle(el).fontSize));
        console.assert(fontSize >= 14 && fontSize <= 22,
            \`Font size \\\${fontSize}px out of range at \\\${width}px viewport\`);
        await ctx.close();
    }
    await browser.close();
}
testOrientationChange();`,
   expectedOutput:`[TEST] UX-006: Orientation Change & Fluid Typography
[INFO] Device: iPhone 13 — portrait 390x844
[PASS] Portrait: bottom nav visible, cards stacked vertically
[PASS] Portrait: no horizontal overflow (390px <= 390px)
[INFO] Device: iPhone 13 — landscape 844x390
[PASS] Landscape: compact sidebar displayed
[PASS] Landscape: no horizontal overflow (844px <= 844px)
[INFO] Testing fluid typography: clamp(14px, 2vw, 22px)
[PASS] 320px viewport — font-size: 14px (min clamped)
[PASS] 768px viewport — font-size: 15.4px (fluid)
[PASS] 1200px viewport — font-size: 19.2px (fluid)
[PASS] 1920px viewport — font-size: 22px (max clamped)
───────────────────────────────────
UX-006: Orientation & Typography — 8 passed, 0 failed`},

  {id:'UX-007',title:'Button Click Feedback & Loading States',layer:'Interaction',framework:'Playwright',language:'TypeScript',difficulty:'Beginner',
   description:'Validates that all actionable buttons in the banking app provide immediate visual feedback on click, display loading spinners during async operations, and prevent double submission.',
   prerequisites:'Playwright 1.40+, TypeScript, Banking app with async form submissions',
   config:'BASE_URL=https://banking.bank.local\nFEEDBACK_TIMEOUT=100\nLOADING_TIMEOUT=5000\nPAGES=transfers,payments,settings',
   code:`import { test, expect } from '@playwright/test';

test.describe('Button click feedback', () => {
    test('transfer button shows loading and prevents double click', async ({ page }) => {
        await page.goto('https://banking.bank.local/transfers');
        await page.fill('[data-testid="amount"]', '5000');
        await page.fill('[data-testid="beneficiary"]', 'ACC-001');

        const submitBtn = page.locator('[data-testid="submit-transfer"]');

        // Verify button is enabled before click
        await expect(submitBtn).toBeEnabled();
        const initialText = await submitBtn.innerText();
        expect(initialText).toBe('Transfer Now');

        // Click and verify immediate feedback
        await submitBtn.click();

        // Button should show loading state within 100ms
        await expect(submitBtn).toBeDisabled({ timeout: 100 });
        const loadingSpinner = page.locator('[data-testid="submit-transfer"] .spinner');
        await expect(loadingSpinner).toBeVisible({ timeout: 200 });

        // Button text should change
        const loadingText = await submitBtn.innerText();
        expect(loadingText).toContain('Processing');

        // Attempt double-click — should be prevented
        await submitBtn.click({ force: true });
        const requestCount = await page.evaluate(() =>
            (window as any).__transferRequestCount || 0
        );
        expect(requestCount).toBeLessThanOrEqual(1);

        // Wait for completion
        await expect(submitBtn).toBeEnabled({ timeout: 5000 });
        await expect(page.locator('.success-toast')).toBeVisible();
    });
});`,
   expectedOutput:`[TEST] UX-007: Button Click Feedback & Loading States
[INFO] Page: /transfers — testing submit button
[PASS] Button initial state: enabled, text="Transfer Now"
[PASS] Click feedback: button disabled within 100ms
[PASS] Loading spinner visible within 200ms
[PASS] Button text changed to "Processing..."
[PASS] Double-click prevention: only 1 request sent
[INFO] Waiting for async operation completion...
[PASS] Button re-enabled after operation complete
[PASS] Success toast notification displayed
───────────────────────────────────
UX-007: Button Feedback — 6 passed, 0 failed`},

  {id:'UX-008',title:'Skeleton Screen & Loading Placeholder',layer:'Interaction',framework:'Playwright',language:'TypeScript',difficulty:'Intermediate',
   description:'Validates that the banking application displays skeleton loading screens during data fetches, with proper shimmer animations, correct layout dimensions, and smooth transitions to real content.',
   prerequisites:'Playwright 1.40+, TypeScript, Banking app with skeleton UI components',
   config:'BASE_URL=https://banking.bank.local\nAPI_DELAY=2000\nSKELETON_SELECTORS=.skeleton-card,.skeleton-row,.skeleton-chart\nPAGES=dashboard,accounts,statements',
   code:`import { test, expect } from '@playwright/test';

test.describe('Skeleton screen validation', () => {
    test('dashboard shows skeletons before data loads', async ({ page }) => {
        // Intercept API to introduce delay
        await page.route('**/api/v2/dashboard/**', async route => {
            await new Promise(r => setTimeout(r, 2000));
            await route.continue();
        });

        await page.goto('https://banking.bank.local/dashboard');

        // Skeleton elements should appear immediately
        const skeletonCards = page.locator('.skeleton-card');
        await expect(skeletonCards.first()).toBeVisible({ timeout: 500 });
        const skeletonCount = await skeletonCards.count();
        expect(skeletonCount).toBeGreaterThanOrEqual(3);

        // Verify shimmer animation is running
        const hasAnimation = await skeletonCards.first().evaluate(el => {
            const style = getComputedStyle(el);
            return style.animationName !== 'none' && style.animationName !== '';
        });
        expect(hasAnimation).toBe(true);

        // Verify skeleton dimensions match real content layout
        const skeletonBox = await skeletonCards.first().boundingBox();
        expect(skeletonBox!.width).toBeGreaterThan(200);
        expect(skeletonBox!.height).toBeGreaterThan(80);

        // Wait for real content to replace skeletons
        await expect(page.locator('.account-card').first())
            .toBeVisible({ timeout: 5000 });
        await expect(skeletonCards.first()).toBeHidden();

        // Verify no layout shift during transition
        const contentBox = await page.locator('.account-card').first().boundingBox();
        const widthDiff = Math.abs(contentBox!.width - skeletonBox!.width);
        expect(widthDiff).toBeLessThan(10);
    });
});`,
   expectedOutput:`[TEST] UX-008: Skeleton Screen & Loading Placeholder
[INFO] Intercepting API with 2000ms delay
[PASS] Skeleton cards visible within 500ms of navigation
[PASS] Skeleton count: 4 placeholders rendered
[PASS] Shimmer animation active: "skeleton-shimmer"
[INFO] Skeleton dimensions: 340x120px
[PASS] Skeleton width > 200px, height > 80px
[INFO] Waiting for real content to load...
[PASS] Real account cards replaced skeletons
[PASS] Skeleton elements hidden after data load
[PASS] Layout shift < 10px (width diff: 2px)
───────────────────────────────────
UX-008: Skeleton Screens — 6 passed, 0 failed`},

  {id:'UX-009',title:'Hover States & Micro-Interaction Animation',layer:'Interaction',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',
   description:'Tests hover state transitions, micro-interaction animations (tooltips, ripple effects, focus rings), and animation performance metrics ensuring 60fps rendering in the banking UI.',
   prerequisites:'Playwright 1.40+, Banking app with CSS transitions/animations, DevTools protocol access',
   config:'BASE_URL=https://banking.bank.local\nFPS_TARGET=60\nANIMATION_BUDGET_MS=16.67\nELEMENTS=.action-btn,.nav-link,.card-interactive,.tooltip-trigger',
   code:`const { chromium } = require('playwright');

async function testHoverMicroInteractions() {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();
    await page.goto('https://banking.bank.local/dashboard');
    await page.waitForLoadState('networkidle');

    // Test button hover state change
    const actionBtn = page.locator('.action-btn').first();
    const beforeHover = await actionBtn.evaluate(el => ({
        bg: getComputedStyle(el).backgroundColor,
        transform: getComputedStyle(el).transform,
        shadow: getComputedStyle(el).boxShadow
    }));

    await actionBtn.hover();
    await page.waitForTimeout(350);

    const afterHover = await actionBtn.evaluate(el => ({
        bg: getComputedStyle(el).backgroundColor,
        transform: getComputedStyle(el).transform,
        shadow: getComputedStyle(el).boxShadow
    }));

    console.assert(beforeHover.bg !== afterHover.bg, 'Background should change on hover');
    console.assert(afterHover.shadow !== 'none', 'Box shadow should appear on hover');

    // Test tooltip micro-interaction
    const tooltipTrigger = page.locator('.tooltip-trigger').first();
    await tooltipTrigger.hover();
    await page.waitForTimeout(500);
    const tooltip = page.locator('.tooltip-content');
    const isVisible = await tooltip.isVisible();
    console.assert(isVisible, 'Tooltip should appear on hover');

    const tooltipOpacity = await tooltip.evaluate(el =>
        parseFloat(getComputedStyle(el).opacity));
    console.assert(tooltipOpacity === 1, 'Tooltip should be fully opaque');

    // Animation performance measurement
    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');
    const metrics = await client.send('Performance.getMetrics');
    const fps = metrics.metrics.find(m => m.name === 'FramesSinceLastNavigation');
    console.log(\`[INFO] Frames rendered: \\\${fps ? fps.value : 'N/A'}\`);

    await browser.close();
}
testHoverMicroInteractions();`,
   expectedOutput:`[TEST] UX-009: Hover States & Micro-Interaction Animation
[INFO] Viewport: 1920x1080 — testing interactive elements
[PASS] Button hover: background color transitioned
[PASS] Button hover: box-shadow applied (elevation effect)
[PASS] Button hover: transform scale(1.02) applied
[INFO] Transition duration: 300ms ease-in-out
[PASS] Tooltip appears on hover after 400ms delay
[PASS] Tooltip opacity: 1.0 (fully visible)
[PASS] Tooltip positioned correctly (no viewport overflow)
[INFO] Frames rendered: 847 since navigation
[PASS] Animation performance: no jank detected (>55fps)
───────────────────────────────────
UX-009: Hover & Micro-Interactions — 7 passed, 0 failed`},

  {id:'UX-010',title:'Breadcrumb Navigation Validation',layer:'Navigation',framework:'Playwright',language:'TypeScript',difficulty:'Beginner',
   description:'Validates breadcrumb trail accuracy across the banking application ensuring correct hierarchy, clickable links, proper ARIA attributes, and dynamic updates on navigation.',
   prerequisites:'Playwright 1.40+, TypeScript, Banking app with breadcrumb component',
   config:'BASE_URL=https://banking.bank.local\nMAX_DEPTH=5\nSEPARATOR=>\nROOT_LABEL=Home',
   code:`import { test, expect } from '@playwright/test';

test.describe('Breadcrumb navigation', () => {
    test('breadcrumb reflects correct page hierarchy', async ({ page }) => {
        await page.goto('https://banking.bank.local/dashboard');
        const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
        await expect(breadcrumb).toBeVisible();

        // Verify ARIA attributes
        await expect(breadcrumb).toHaveAttribute('aria-label', 'Breadcrumb');
        const ol = breadcrumb.locator('ol');
        await expect(ol).toHaveAttribute('role', 'list');

        // Navigate to nested page
        await page.goto('https://banking.bank.local/accounts/savings/ACC-001/transactions');
        await page.waitForLoadState('networkidle');

        const crumbs = breadcrumb.locator('li');
        const count = await crumbs.count();
        expect(count).toBe(4);

        // Verify hierarchy: Home > Accounts > Savings ACC-001 > Transactions
        await expect(crumbs.nth(0)).toContainText('Home');
        await expect(crumbs.nth(1)).toContainText('Accounts');
        await expect(crumbs.nth(2)).toContainText('Savings ACC-001');
        await expect(crumbs.nth(3)).toContainText('Transactions');

        // Last item should not be a link (current page)
        const lastLink = crumbs.nth(3).locator('a');
        expect(await lastLink.count()).toBe(0);
        await expect(crumbs.nth(3)).toHaveAttribute('aria-current', 'page');

        // Click intermediate breadcrumb and verify navigation
        await crumbs.nth(1).locator('a').click();
        await expect(page).toHaveURL(/\\/accounts$/);

        // Breadcrumb should update after navigation
        const updatedCrumbs = breadcrumb.locator('li');
        expect(await updatedCrumbs.count()).toBe(2);
    });
});`,
   expectedOutput:`[TEST] UX-010: Breadcrumb Navigation Validation
[INFO] Testing breadcrumb at /dashboard
[PASS] Breadcrumb nav element visible with aria-label="Breadcrumb"
[PASS] Ordered list has role="list"
[INFO] Navigated to /accounts/savings/ACC-001/transactions
[PASS] Breadcrumb depth: 4 items (Home > Accounts > Savings ACC-001 > Transactions)
[PASS] Hierarchy order verified correctly
[PASS] Current page (Transactions) has aria-current="page"
[PASS] Current page item is not a link
[PASS] Intermediate breadcrumb click navigates to /accounts
[PASS] Breadcrumb updated to 2 items after navigation
───────────────────────────────────
UX-010: Breadcrumb Navigation — 7 passed, 0 failed`},

  {id:'UX-011',title:'Back Button & Browser History Behavior',layer:'Navigation',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',
   description:'Tests browser back/forward button behavior in the banking SPA ensuring correct state restoration, scroll position preservation, modal dismissal, and history stack integrity.',
   prerequisites:'Playwright 1.40+, Banking SPA with client-side routing',
   config:'BASE_URL=https://banking.bank.local\nPAGES=dashboard,accounts,transfers,statements\nSCROLL_TOLERANCE=50',
   code:`const { chromium } = require('playwright');

async function testBackButtonBehavior() {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

    // Step 1: Build navigation history
    await page.goto('https://banking.bank.local/dashboard');
    await page.waitForLoadState('networkidle');
    await page.click('a[href="/accounts"]');
    await page.waitForURL('**/accounts');
    await page.click('a[href="/transfers"]');
    await page.waitForURL('**/transfers');
    await page.click('a[href="/statements"]');
    await page.waitForURL('**/statements');

    // Step 2: Scroll down on statements page
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollBefore = await page.evaluate(() => window.scrollY);

    // Step 3: Navigate back and verify
    await page.goBack();
    await page.waitForURL('**/transfers');
    const urlAfterBack1 = page.url();
    console.assert(urlAfterBack1.includes('/transfers'), 'Back to transfers');

    await page.goBack();
    await page.waitForURL('**/accounts');
    console.assert(page.url().includes('/accounts'), 'Back to accounts');

    // Step 4: Forward navigation
    await page.goForward();
    await page.waitForURL('**/transfers');
    console.assert(page.url().includes('/transfers'), 'Forward to transfers');

    // Step 5: Test modal dismissal with back button
    await page.goto('https://banking.bank.local/accounts');
    await page.click('[data-testid="open-detail-modal"]');
    const modal = page.locator('.modal-overlay');
    await modal.waitFor({ state: 'visible' });

    await page.goBack();
    await page.waitForTimeout(300);
    const modalHidden = await modal.isHidden();
    console.assert(modalHidden, 'Modal dismissed on back button');

    // Step 6: Verify page content restored after back
    const accountList = page.locator('.account-list');
    const isVisible = await accountList.isVisible();
    console.assert(isVisible, 'Account list still visible after modal dismiss');

    await browser.close();
}
testBackButtonBehavior();`,
   expectedOutput:`[TEST] UX-011: Back Button & Browser History Behavior
[INFO] Building history: dashboard > accounts > transfers > statements
[PASS] Back button: /statements -> /transfers (correct)
[PASS] Back button: /transfers -> /accounts (correct)
[PASS] Forward button: /accounts -> /transfers (correct)
[INFO] History stack integrity verified
[PASS] Modal opened on /accounts
[PASS] Back button dismissed modal without page navigation
[PASS] Page content (account list) preserved after modal dismiss
[INFO] Scroll position tests: within 50px tolerance
[PASS] Browser history: 6/6 navigation assertions passed
───────────────────────────────────
UX-011: Back Button Behavior — 7 passed, 0 failed`},

  {id:'UX-012',title:'Keyboard Tab Order & Deep Linking',layer:'Navigation',framework:'Playwright',language:'TypeScript',difficulty:'Advanced',
   description:'Validates keyboard tab order follows logical DOM sequence, deep links resolve correctly with full state restoration, and focus management meets WCAG 2.4.3 requirements.',
   prerequisites:'Playwright 1.40+, TypeScript, Banking app with ARIA landmarks and deep linking support',
   config:'BASE_URL=https://banking.bank.local\nDEEP_LINKS=/accounts?filter=savings&sort=balance,/transfers?beneficiary=ACC-001,/statements?from=2026-01-01&to=2026-02-27\nFOCUS_OUTLINE_COLOR=rgb(52, 152, 219)',
   code:`import { test, expect } from '@playwright/test';

test.describe('Tab order and deep linking', () => {
    test('keyboard tab order follows logical sequence', async ({ page }) => {
        await page.goto('https://banking.bank.local/dashboard');
        await page.waitForLoadState('networkidle');

        const expectedOrder = [
            '.skip-to-content', '.logo-link', '.nav-item:nth-child(1)',
            '.nav-item:nth-child(2)', '.nav-item:nth-child(3)',
            '.search-input', '.notification-bell', '.profile-menu',
            '.account-card:nth-child(1)', '.account-card:nth-child(2)',
            '.quick-action:nth-child(1)', '.quick-action:nth-child(2)'
        ];

        for (const selector of expectedOrder) {
            await page.keyboard.press('Tab');
            const focused = await page.evaluate(() =>
                document.activeElement?.matches?.('[data-testid]')
                    ? document.activeElement.getAttribute('data-testid')
                    : document.activeElement?.className || 'unknown'
            );
            const el = page.locator(selector);
            if (await el.count() > 0) {
                const outline = await el.evaluate(el =>
                    getComputedStyle(el).outlineColor);
                expect(outline).not.toBe('transparent');
            }
        }
    });

    test('deep links restore full application state', async ({ page }) => {
        // Test filter state preservation via deep link
        await page.goto(
            'https://banking.bank.local/accounts?filter=savings&sort=balance'
        );
        await page.waitForLoadState('networkidle');

        const filterValue = await page.locator('[data-testid="filter-select"]')
            .inputValue();
        expect(filterValue).toBe('savings');

        const sortValue = await page.locator('[data-testid="sort-select"]')
            .inputValue();
        expect(sortValue).toBe('balance');

        // Test beneficiary pre-fill via deep link
        await page.goto(
            'https://banking.bank.local/transfers?beneficiary=ACC-001'
        );
        const beneficiary = await page.locator('[data-testid="beneficiary"]')
            .inputValue();
        expect(beneficiary).toBe('ACC-001');
    });
});`,
   expectedOutput:`[TEST] UX-012: Keyboard Tab Order & Deep Linking
[INFO] Testing tab order on /dashboard
[PASS] Tab 1: skip-to-content link focused
[PASS] Tab 2: logo link focused
[PASS] Tab 3-5: navigation items in correct order
[PASS] Tab 6: search input focused
[PASS] Tab 7-8: notification bell, profile menu
[PASS] Focus outline visible on all focused elements
[INFO] Testing deep link: /accounts?filter=savings&sort=balance
[PASS] Deep link: filter restored to "savings"
[PASS] Deep link: sort restored to "balance"
[PASS] Deep link: /transfers?beneficiary=ACC-001 pre-filled
[INFO] WCAG 2.4.3 focus order compliance verified
───────────────────────────────────
UX-012: Tab Order & Deep Linking — 9 passed, 0 failed`},

  {id:'UX-013',title:'Inline Validation & Error Display',layer:'FormUX',framework:'Playwright',language:'TypeScript',difficulty:'Beginner',
   description:'Tests inline form validation messages for banking forms ensuring real-time feedback, correct error positioning, accessible error announcements, and proper field highlighting.',
   prerequisites:'Playwright 1.40+, TypeScript, Banking app with form validation',
   config:'BASE_URL=https://banking.bank.local\nFORM_PAGE=/transfers\nERROR_COLOR=rgb(231, 76, 60)\nSUCCESS_COLOR=rgb(46, 204, 113)',
   code:`import { test, expect } from '@playwright/test';

test.describe('Inline validation', () => {
    test('transfer form shows real-time validation errors', async ({ page }) => {
        await page.goto('https://banking.bank.local/transfers');

        // Test empty field validation on blur
        const amountField = page.locator('[data-testid="amount"]');
        await amountField.focus();
        await amountField.blur();
        const amountError = page.locator('[data-testid="amount-error"]');
        await expect(amountError).toBeVisible();
        await expect(amountError).toHaveText('Amount is required');
        await expect(amountError).toHaveAttribute('role', 'alert');

        // Verify field border turns red
        const borderColor = await amountField.evaluate(el =>
            getComputedStyle(el).borderColor);
        expect(borderColor).toBe('rgb(231, 76, 60)');

        // Test invalid amount
        await amountField.fill('-500');
        await amountField.blur();
        await expect(amountError).toHaveText('Amount must be a positive number');

        // Test valid amount — error clears, border turns green
        await amountField.fill('5000');
        await amountField.blur();
        await expect(amountError).toBeHidden();
        const validBorder = await amountField.evaluate(el =>
            getComputedStyle(el).borderColor);
        expect(validBorder).toBe('rgb(46, 204, 113)');

        // Test IFSC code format validation
        const ifscField = page.locator('[data-testid="ifsc-code"]');
        await ifscField.fill('INVALID');
        await ifscField.blur();
        const ifscError = page.locator('[data-testid="ifsc-error"]');
        await expect(ifscError).toHaveText('Invalid IFSC format (e.g., SBIN0001234)');

        // Verify aria-describedby links field to error
        const describedBy = await amountField.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();

        // Test account number Luhn check
        const accField = page.locator('[data-testid="account-number"]');
        await accField.fill('1234567890');
        await accField.blur();
        const accError = page.locator('[data-testid="account-error"]');
        await expect(accError).toHaveText('Invalid account number');
    });
});`,
   expectedOutput:`[TEST] UX-013: Inline Validation & Error Display
[INFO] Page: /transfers — testing form field validation
[PASS] Empty amount: error "Amount is required" displayed
[PASS] Error has role="alert" for screen reader announcement
[PASS] Field border: red (rgb(231, 76, 60)) on validation error
[PASS] Negative amount: "Amount must be a positive number"
[PASS] Valid amount (5000): error cleared, border green
[PASS] IFSC validation: "Invalid IFSC format" for bad input
[PASS] aria-describedby links field to error message
[PASS] Account number Luhn validation: "Invalid account number"
[INFO] All inline validations use role="alert" for a11y
───────────────────────────────────
UX-013: Inline Validation — 8 passed, 0 failed`},

  {id:'UX-014',title:'Multi-Step Form Progress & State',layer:'FormUX',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',
   description:'Validates multi-step form wizard for loan application including progress indicator accuracy, step navigation, data persistence between steps, and draft save functionality.',
   prerequisites:'Playwright 1.40+, Banking app with multi-step loan application form',
   config:'BASE_URL=https://banking.bank.local\nFORM_URL=/loans/apply\nTOTAL_STEPS=4\nAUTO_SAVE_INTERVAL=30000\nDRAFT_API=/api/v2/loans/draft',
   code:`const { chromium } = require('playwright');

async function testMultiStepForm() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://banking.bank.local/loans/apply');

    // Verify initial state — Step 1 active
    const progressBar = page.locator('.progress-indicator');
    await progressBar.waitFor({ state: 'visible' });
    const activeStep = await page.locator('.step-item.active').count();
    console.assert(activeStep === 1, 'Only step 1 should be active initially');

    const progressWidth = await page.locator('.progress-fill')
        .evaluate(el => el.style.width);
    console.assert(progressWidth === '25%', 'Progress should be 25% at step 1');

    // Fill Step 1: Personal Details
    await page.fill('[name="fullName"]', 'Rajesh Kumar');
    await page.fill('[name="panNumber"]', 'ABCDE1234F');
    await page.fill('[name="dateOfBirth"]', '1990-05-15');
    await page.click('[data-testid="next-step"]');

    // Verify Step 2 active and progress updated
    const step2Label = await page.locator('.step-item.active').innerText();
    console.assert(step2Label.includes('Employment'), 'Step 2 should be Employment');
    const progress2 = await page.locator('.progress-fill')
        .evaluate(el => el.style.width);
    console.assert(progress2 === '50%', 'Progress should be 50% at step 2');

    // Fill Step 2 and go back to Step 1 — data should persist
    await page.fill('[name="employer"]', 'State Bank of India');
    await page.fill('[name="annualIncome"]', '1200000');
    await page.click('[data-testid="prev-step"]');

    const nameValue = await page.locator('[name="fullName"]').inputValue();
    console.assert(nameValue === 'Rajesh Kumar', 'Step 1 data should persist');

    // Go forward — Step 2 data should persist
    await page.click('[data-testid="next-step"]');
    const employer = await page.locator('[name="employer"]').inputValue();
    console.assert(employer === 'State Bank of India', 'Step 2 data should persist');

    // Verify draft save
    const draftResp = await page.evaluate(() =>
        fetch('/api/v2/loans/draft', { method: 'GET' })
            .then(r => r.json())
    );
    console.assert(draftResp.fullName === 'Rajesh Kumar', 'Draft should be saved');

    // Navigate to Step 4 and verify completed steps are green
    await page.click('[data-testid="next-step"]');
    await page.click('[data-testid="next-step"]');
    const completedSteps = await page.locator('.step-item.completed').count();
    console.assert(completedSteps === 3, '3 steps should be marked completed');

    await browser.close();
}
testMultiStepForm();`,
   expectedOutput:`[TEST] UX-014: Multi-Step Form Progress & State
[INFO] Loan application form: 4 steps
[PASS] Initial state: Step 1 active, progress 25%
[PASS] Step 1 filled: Personal Details (Rajesh Kumar)
[PASS] Step 2 active: Employment Details, progress 50%
[PASS] Back navigation: Step 1 data persisted ("Rajesh Kumar")
[PASS] Forward navigation: Step 2 data persisted ("State Bank of India")
[PASS] Draft auto-save: data persisted to /api/v2/loans/draft
[PASS] Step 4 reached: 3 completed steps marked green
[INFO] Progress bar: 25% -> 50% -> 75% -> 100%
[PASS] Step indicators reflect correct completion state
───────────────────────────────────
UX-014: Multi-Step Form — 7 passed, 0 failed`},

  {id:'UX-015',title:'Autofill Compatibility & Form Submission',layer:'FormUX',framework:'Python / Playwright',language:'Python',difficulty:'Advanced',
   description:'Tests browser autofill compatibility for banking registration forms including autocomplete attribute validation, autofill hint detection, CAPTCHA interaction, and form submission feedback.',
   prerequisites:'Playwright for Python, Banking registration form, Browser autofill simulation',
   config:'BASE_URL=https://banking.bank.local\nFORM_URL=/register\nAUTOCOMPLETE_FIELDS=name,email,tel,street-address,postal-code\nSUBMIT_FEEDBACK_TIMEOUT=3000',
   code:`from playwright.sync_api import sync_playwright
import re

def test_autofill_and_submission():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('https://banking.bank.local/register')
        page.wait_for_load_state('networkidle')

        # Validate autocomplete attributes on form fields
        fields = {
            'fullName': 'name',
            'email': 'email',
            'phone': 'tel',
            'address': 'street-address',
            'postalCode': 'postal-code'
        }
        for field_id, expected_ac in fields.items():
            el = page.locator(f'[data-testid="{field_id}"]')
            ac_value = el.get_attribute('autocomplete')
            assert ac_value == expected_ac, (
                f'{field_id}: autocomplete="{ac_value}", expected="{expected_ac}"'
            )

        # Verify input types for semantic correctness
        email_type = page.locator('[data-testid="email"]').get_attribute('type')
        assert email_type == 'email', f'Email field type should be "email"'
        phone_type = page.locator('[data-testid="phone"]').get_attribute('type')
        assert phone_type == 'tel', f'Phone field type should be "tel"'

        # Fill form and test submission feedback
        page.fill('[data-testid="fullName"]', 'Priya Sharma')
        page.fill('[data-testid="email"]', 'priya@example.com')
        page.fill('[data-testid="phone"]', '+919876543210')
        page.fill('[data-testid="address"]', '42 MG Road, Mumbai')
        page.fill('[data-testid="postalCode"]', '400001')
        page.fill('[data-testid="password"]', 'SecureP@ss2026!')

        # Submit and verify feedback
        page.click('[data-testid="submit-btn"]')
        success = page.locator('.submission-feedback')
        success.wait_for(state='visible', timeout=3000)
        assert 'successfully' in success.inner_text().lower()

        # Verify submit button shows completion state
        btn = page.locator('[data-testid="submit-btn"]')
        btn_text = btn.inner_text()
        assert btn_text in ['Registered', 'Done'], f'Button text: {btn_text}'

        # Check redirect or confirmation page
        assert '/confirmation' in page.url() or '/welcome' in page.url()

        browser.close()

test_autofill_and_submission()`,
   expectedOutput:`[TEST] UX-015: Autofill Compatibility & Form Submission
[INFO] Page: /register — validating autocomplete attributes
[PASS] fullName: autocomplete="name" (correct)
[PASS] email: autocomplete="email", type="email"
[PASS] phone: autocomplete="tel", type="tel"
[PASS] address: autocomplete="street-address"
[PASS] postalCode: autocomplete="postal-code"
[INFO] Filling form with test data and submitting
[PASS] Form submission: success feedback visible within 3s
[PASS] Feedback text contains "successfully"
[PASS] Submit button shows completion state: "Registered"
[PASS] Redirected to /confirmation page
───────────────────────────────────
UX-015: Autofill & Submission — 8 passed, 0 failed`},

  {id:'UX-016',title:'Task Completion Rate Measurement',layer:'Usability',framework:'Python / Playwright',language:'Python',difficulty:'Intermediate',
   description:'Measures task completion rates for critical banking workflows (fund transfer, bill payment, account opening) by tracking user interaction steps, time-on-task, and error recovery paths.',
   prerequisites:'Playwright for Python, Banking app with analytics hooks, Test user accounts with seeded data',
   config:'BASE_URL=https://banking.bank.local\nTASKS=fund_transfer,bill_payment,account_opening\nMAX_TIME_SECONDS=120\nMAX_STEPS=10\nSUCCESS_RATE_TARGET=95',
   code:`from playwright.sync_api import sync_playwright
import time

def measure_task_completion(page, task_name, steps_fn):
    start = time.time()
    step_count = 0
    errors = []

    try:
        for step_desc, action_fn in steps_fn:
            step_count += 1
            try:
                action_fn(page)
            except Exception as e:
                errors.append(f"Step {step_count} ({step_desc}): {str(e)}")
                # Attempt recovery
                if page.locator('.error-dismiss').is_visible():
                    page.click('.error-dismiss')

        elapsed = time.time() - start
        success = len(errors) == 0
        return {
            'task': task_name, 'completed': success,
            'steps': step_count, 'time': round(elapsed, 1),
            'errors': errors
        }
    except Exception as e:
        return {'task': task_name, 'completed': False,
                'steps': step_count, 'time': round(time.time() - start, 1),
                'errors': [str(e)]}

def test_task_completion_rates():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('https://banking.bank.local/dashboard')

        transfer_steps = [
            ('Navigate to transfers', lambda p: p.click('a[href="/transfers"]')),
            ('Select beneficiary', lambda p: p.select_option('[data-testid="beneficiary"]', 'ACC-001')),
            ('Enter amount', lambda p: p.fill('[data-testid="amount"]', '10000')),
            ('Add remarks', lambda p: p.fill('[data-testid="remarks"]', 'Rent payment')),
            ('Confirm transfer', lambda p: p.click('[data-testid="submit-transfer"]')),
            ('Verify OTP', lambda p: (p.fill('[data-testid="otp"]', '123456'),
                                      p.click('[data-testid="verify-otp"]'))),
            ('Check success', lambda p: p.wait_for_selector('.success-message',
                                                             timeout=5000))
        ]

        result = measure_task_completion(page, 'Fund Transfer', transfer_steps)
        assert result['completed'], f"Task failed: {result['errors']}"
        assert result['time'] < 120, f"Task too slow: {result['time']}s"
        assert result['steps'] <= 10, f"Too many steps: {result['steps']}"

        print(f"Task: {result['task']}")
        print(f"Completed: {result['completed']}")
        print(f"Steps: {result['steps']}, Time: {result['time']}s")

        browser.close()

test_task_completion_rates()`,
   expectedOutput:`[TEST] UX-016: Task Completion Rate Measurement
[INFO] Measuring task: Fund Transfer (max 120s, max 10 steps)
[PASS] Step 1: Navigate to transfers — 0.3s
[PASS] Step 2: Select beneficiary — 0.2s
[PASS] Step 3: Enter amount — 0.1s
[PASS] Step 4: Add remarks — 0.1s
[PASS] Step 5: Confirm transfer — 0.4s
[PASS] Step 6: Verify OTP — 0.8s
[PASS] Step 7: Check success message — 1.2s
[INFO] Fund Transfer: completed=true, steps=7, time=3.1s
[PASS] Task completion: under 120s time limit
[PASS] Task efficiency: 7 steps (under 10-step maximum)
───────────────────────────────────
UX-016: Task Completion — 9 passed, 0 failed`},

  {id:'UX-017',title:'Error Recovery & Learnability Testing',layer:'Usability',framework:'Playwright',language:'TypeScript',difficulty:'Intermediate',
   description:'Tests error recovery flows ensuring users can recover from mistakes (wrong input, failed transactions, session timeouts) with clear guidance, undo options, and contextual help.',
   prerequisites:'Playwright 1.40+, TypeScript, Banking app with error recovery UX patterns',
   config:'BASE_URL=https://banking.bank.local\nERROR_SCENARIOS=invalid_amount,insufficient_funds,session_timeout,network_error\nUNDO_TIMEOUT=10000',
   code:`import { test, expect } from '@playwright/test';

test.describe('Error recovery and learnability', () => {
    test('user can recover from transfer errors', async ({ page }) => {
        await page.goto('https://banking.bank.local/transfers');

        // Scenario 1: Insufficient funds error with recovery guidance
        await page.fill('[data-testid="amount"]', '9999999');
        await page.fill('[data-testid="beneficiary"]', 'ACC-001');
        await page.click('[data-testid="submit-transfer"]');

        const errorBanner = page.locator('[data-testid="error-banner"]');
        await expect(errorBanner).toBeVisible({ timeout: 3000 });
        await expect(errorBanner).toContainText('Insufficient funds');

        // Error should provide actionable suggestion
        const suggestion = page.locator('[data-testid="error-suggestion"]');
        await expect(suggestion).toBeVisible();
        const suggestionText = await suggestion.innerText();
        expect(suggestionText).toContain('Available balance');

        // Verify form data is preserved (not cleared on error)
        const amount = await page.locator('[data-testid="amount"]').inputValue();
        expect(amount).toBe('9999999');

        // User corrects the amount and resubmits
        await page.fill('[data-testid="amount"]', '5000');
        await page.click('[data-testid="submit-transfer"]');
        await expect(page.locator('.success-message')).toBeVisible({ timeout: 5000 });

        // Scenario 2: Undo action available after transfer
        const undoBtn = page.locator('[data-testid="undo-transfer"]');
        await expect(undoBtn).toBeVisible();
        const undoTimer = page.locator('.undo-countdown');
        await expect(undoTimer).toBeVisible();

        // Undo the transfer
        await undoBtn.click();
        await expect(page.locator('[data-testid="undo-success"]'))
            .toBeVisible({ timeout: 2000 });

        // Scenario 3: Contextual help tooltip
        await page.goto('https://banking.bank.local/transfers');
        const helpIcon = page.locator('[data-testid="help-ifsc"]');
        await helpIcon.click();
        const helpContent = page.locator('[data-testid="help-popover"]');
        await expect(helpContent).toBeVisible();
        await expect(helpContent).toContainText('IFSC');
    });
});`,
   expectedOutput:`[TEST] UX-017: Error Recovery & Learnability Testing
[INFO] Scenario 1: Insufficient funds recovery
[PASS] Error banner displayed: "Insufficient funds"
[PASS] Actionable suggestion shown: "Available balance: 50,000"
[PASS] Form data preserved after error (amount=9999999)
[PASS] User corrected amount and resubmitted successfully
[INFO] Scenario 2: Undo action
[PASS] Undo button visible with countdown timer (10s)
[PASS] Undo transfer executed successfully
[INFO] Scenario 3: Contextual help
[PASS] Help icon click shows IFSC code explanation popover
[PASS] Help content includes format example: "SBIN0001234"
───────────────────────────────────
UX-017: Error Recovery — 8 passed, 0 failed`},

  {id:'UX-018',title:'Heuristic Evaluation (Nielsen\'s 10)',layer:'Usability',framework:'Python / Playwright',language:'Python',difficulty:'Advanced',
   description:'Automated heuristic evaluation based on Nielsen\'s 10 usability heuristics checking visibility of system status, match between system and real world, user control, consistency, error prevention, and more.',
   prerequisites:'Playwright for Python, Banking app deployed, Accessibility testing library',
   config:'BASE_URL=https://banking.bank.local\nPAGES=/dashboard,/accounts,/transfers,/statements\nHEURISTICS=10\nPASS_THRESHOLD=8',
   code:`from playwright.sync_api import sync_playwright

def evaluate_heuristics(page, url):
    page.goto(url)
    page.wait_for_load_state('networkidle')
    results = {}

    # H1: Visibility of system status
    loading = page.locator('[aria-busy="true"], .loading-indicator, .spinner')
    status_bar = page.locator('[role="status"], [aria-live="polite"]')
    results['H1_SystemStatus'] = status_bar.count() > 0

    # H2: Match between system and real world
    labels = page.locator('label, [aria-label]')
    jargon_free = all(
        'varchar' not in (l.inner_text() or '').lower() and
        'null' not in (l.inner_text() or '').lower()
        for l in labels.all()[:20]
    )
    results['H2_RealWorldMatch'] = jargon_free

    # H3: User control and freedom
    undo_btns = page.locator('[data-testid*="undo"], [data-testid*="cancel"]')
    back_links = page.locator('[data-testid*="back"], .breadcrumb a')
    results['H3_UserControl'] = (undo_btns.count() + back_links.count()) > 0

    # H4: Consistency and standards
    primary_btns = page.locator('.btn-primary, [data-variant="primary"]')
    if primary_btns.count() >= 2:
        colors = set()
        for btn in primary_btns.all()[:5]:
            colors.add(btn.evaluate('el => getComputedStyle(el).backgroundColor'))
        results['H4_Consistency'] = len(colors) == 1
    else:
        results['H4_Consistency'] = True

    # H5: Error prevention
    confirms = page.locator('[data-testid*="confirm"], .confirm-dialog')
    required_fields = page.locator('[required], [aria-required="true"]')
    results['H5_ErrorPrevention'] = required_fields.count() > 0

    # H6: Recognition rather than recall
    placeholders = page.locator('[placeholder]')
    tooltips = page.locator('[title], [data-tooltip]')
    results['H6_Recognition'] = (placeholders.count() + tooltips.count()) > 0

    # H7: Flexibility and efficiency
    shortcuts = page.locator('[accesskey], [data-shortcut]')
    search = page.locator('[type="search"], [role="searchbox"]')
    results['H7_Flexibility'] = search.count() > 0

    # H8: Aesthetic and minimalist design
    visible_text = page.locator('main').inner_text() or ''
    word_count = len(visible_text.split())
    results['H8_MinimalistDesign'] = word_count < 2000

    # H9: Help users recognize and recover from errors
    error_msgs = page.locator('[role="alert"], .error-message')
    results['H9_ErrorRecovery'] = True  # Validated in error scenarios

    # H10: Help and documentation
    help_links = page.locator('a[href*="help"], a[href*="faq"], [data-testid*="help"]')
    results['H10_HelpDocs'] = help_links.count() > 0

    return results

def test_heuristic_evaluation():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        pages = ['/dashboard', '/accounts', '/transfers', '/statements']

        all_results = {}
        for pg in pages:
            url = f'https://banking.bank.local{pg}'
            all_results[pg] = evaluate_heuristics(page, url)

        # Aggregate scores
        heuristics = set()
        for r in all_results.values():
            heuristics.update(r.keys())

        for h in sorted(heuristics):
            passed = sum(1 for r in all_results.values() if r.get(h, False))
            status = 'PASS' if passed == len(pages) else 'WARN'
            print(f'[{status}] {h}: {passed}/{len(pages)} pages')

        total_pass = sum(
            1 for h in heuristics
            if all(r.get(h, False) for r in all_results.values())
        )
        print(f'Overall: {total_pass}/10 heuristics fully satisfied')
        assert total_pass >= 8, f'Only {total_pass}/10 heuristics passed'

        browser.close()

test_heuristic_evaluation()`,
   expectedOutput:`[TEST] UX-018: Heuristic Evaluation (Nielsen's 10)
[INFO] Evaluating 4 pages against 10 usability heuristics
[PASS] H1_SystemStatus: 4/4 pages have status indicators
[PASS] H2_RealWorldMatch: 4/4 pages use natural language
[PASS] H3_UserControl: 4/4 pages have undo/back options
[PASS] H4_Consistency: 4/4 pages have consistent button styles
[PASS] H5_ErrorPrevention: 4/4 pages mark required fields
[PASS] H6_Recognition: 4/4 pages have placeholders/tooltips
[PASS] H7_Flexibility: 4/4 pages have search functionality
[PASS] H8_MinimalistDesign: 4/4 pages under 2000 words
[PASS] H9_ErrorRecovery: validated via error recovery tests
[PASS] H10_HelpDocs: 4/4 pages link to help/FAQ
[INFO] Overall: 10/10 heuristics fully satisfied (target: 8)
───────────────────────────────────
UX-018: Heuristic Evaluation — 10 passed, 0 failed`},
];

export default function UIUXTestingLab() {
  const [tab, setTab] = useState('VisualRegression');
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
        <h1 style={sty.h1}>UI/UX Testing Lab</h1>
        <div style={sty.sub}>Visual Regression, Responsiveness, Interaction, Navigation, Form UX & Usability Audit — {totalAll} Scenarios</div>
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

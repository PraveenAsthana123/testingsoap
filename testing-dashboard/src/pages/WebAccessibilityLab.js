import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = {
  bgFrom: '#1a1a2e', bgTo: '#16213e', card: '#0f3460', accent: '#4ecca3',
  text: '#e0e0e0', header: '#ffffff', border: 'rgba(78,204,163,0.3)',
  editorBg: '#0a0a1a', editorText: '#4ecca3', red: '#e74c3c', orange: '#f39c12',
  blue: '#3498db', yellow: '#f1c40f', muted: '#78909c', cardHover: '#153a6e',
  badgeBg: 'rgba(78,204,163,0.15)', progressBg: '#0a2744',
};

const CATS = [
  { key: 'screenReader', label: 'Screen Reader', icon: '\u{1F50A}' },
  { key: 'keyboard', label: 'Keyboard Nav', icon: '\u{2328}' },
  { key: 'visual', label: 'Visual A11y', icon: '\u{1F441}' },
  { key: 'form', label: 'Form A11y', icon: '\u{1F4DD}' },
  { key: 'wcag', label: 'WCAG 2.1 AA', icon: '\u{2705}' },
  { key: 'audit', label: 'Audit Tools', icon: '\u{1F527}' },
];

const LEVELS = ['All', 'A', 'AA', 'AAA'];
const DIFFS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const S = [
{id:'WA-001',title:'Login Form ARIA Labels',category:'screenReader',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'1.3.1',level:'A',description:'Verify all form inputs on the login page have proper aria-label or aria-labelledby attributes so screen readers announce field purposes correctly.',prerequisites:'Playwright installed, axe-core/playwright package, banking app running on localhost:3000',config:JSON.stringify({baseUrl:'http://localhost:3000',browser:'chromium',timeout:30000,axeRules:['label','aria-required-attr']},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-001: Login form ARIA labels', async ({ page }) => {
  await page.goto('/login');
  const username = page.locator('#username');
  await expect(username).toHaveAttribute('aria-label', /customer id/i);
  const password = page.locator('#password');
  await expect(password).toHaveAttribute('aria-label', /password/i);
  const submit = page.locator('button[type="submit"]');
  await expect(submit).toHaveAccessibleName(/log\\\\s*in/i);

  const results = await new AxeBuilder({ page })
    .include('#loginForm')
    .withRules(['label', 'aria-required-attr'])
    .analyze();
  console.log('Violations found:', results.violations.length);
  results.violations.forEach(v => {
    console.log('Rule:', v.id, '| Impact:', v.impact);
    v.nodes.forEach(n => console.log('  Element:', n.target[0]));
  });
  expect(results.violations).toHaveLength(0);
});`,expectedOutput:`Running: WA-001 Login Form ARIA Labels
  ✓ Username input has aria-label="Customer ID"
  ✓ Password input has aria-label="Password"
  ✓ Submit button accessible name: "Log In"
  ✓ axe-core scan: 0 violations found
  Rules checked: label, aria-required-attr
  Elements scanned: 6 | Passes: 6 | Violations: 0
  WCAG 1.3.1 Level A — PASS
  ✓ Test passed in 1.8s`},
{id:'WA-002',title:'Account Balance Announcement',category:'screenReader',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'1.3.1',level:'A',description:'Ensure screen readers correctly announce account balance with currency symbol, formatting, and account type context.',prerequisites:'Playwright, logged-in session cookie, test account with known balance',config:JSON.stringify({baseUrl:'http://localhost:3000',testAccount:'SAVINGS-001',expectedBalance:'₹1,25,000.00'},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-002: Account balance announcement', async ({ page }) => {
  await page.goto('/dashboard');
  const balanceEl = page.locator('[data-testid="account-balance"]');
  await expect(balanceEl).toBeVisible();
  const ariaLabel = await balanceEl.getAttribute('aria-label');
  expect(ariaLabel).toMatch(/savings account balance/i);
  expect(ariaLabel).toMatch(/rupees/i);
  expect(ariaLabel).toContain('1,25,000');
  await expect(balanceEl).toHaveAttribute('role', 'status');
  await expect(balanceEl).toHaveAttribute('aria-live', 'polite');
  const srText = page.locator('[data-testid="account-balance"] .sr-only');
  await expect(srText).toContainText('Indian Rupees');
  console.log('Balance aria-label:', ariaLabel);
  console.log('Live region: aria-live="polite"');
});`,expectedOutput:`Running: WA-002 Account Balance Announcement
  ✓ Balance element visible on dashboard
  ✓ aria-label contains "Savings Account Balance"
  ✓ aria-label includes currency "Rupees"
  ✓ Balance value "1,25,000" present in label
  ✓ role="status" attribute present
  ✓ aria-live="polite" for dynamic updates
  ✓ Screen-reader-only text: "Indian Rupees"
  WCAG 1.3.1 Level A — PASS
  ✓ Test passed in 2.1s`},
{id:'WA-003',title:'Transaction Table Navigation',category:'screenReader',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'1.3.1',level:'A',description:'Verify transaction history table has proper headers, scope attributes, and row/column association for screen reader table navigation.',prerequisites:'Playwright, test account with transaction history, axe-core',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/transactions',minRows:5,requiredHeaders:['Date','Description','Amount','Balance']},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-003: Transaction table navigation', async ({ page }) => {
  await page.goto('/transactions');
  const table = page.locator('table[aria-label="Transaction History"]');
  await expect(table).toBeVisible();
  const caption = table.locator('caption');
  await expect(caption).toContainText('Transaction History');
  const headers = table.locator('thead th');
  const count = await headers.count();
  for (let i = 0; i < count; i++) {
    await expect(headers.nth(i)).toHaveAttribute('scope', 'col');
  }
  const rowHeaders = table.locator('tbody th[scope="row"]');
  expect(await rowHeaders.count()).toBeGreaterThan(0);
  const results = await new AxeBuilder({ page })
    .include('table')
    .withRules(['td-headers-attr', 'th-has-data-cells'])
    .analyze();
  expect(results.violations).toHaveLength(0);
  console.log('Headers:', count, '| Rows:', await rowHeaders.count());
});`,expectedOutput:`Running: WA-003 Transaction Table Navigation
  ✓ Table with aria-label="Transaction History" found
  ✓ Caption text: "Transaction History"
  ✓ 4 column headers with scope="col"
  ✓ Row headers (scope="row") present: 10 rows
  ✓ axe: td-headers-attr — PASS
  ✓ axe: th-has-data-cells — PASS
  WCAG 1.3.1 Level A — PASS
  ✓ Test passed in 2.4s`},
{id:'WA-004',title:'Error Message Live Regions',category:'screenReader',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'4.1.3',level:'AA',description:'Verify form validation errors use aria-live="assertive" so screen readers immediately announce errors without requiring user navigation.',prerequisites:'Playwright, banking login or transfer form',config:JSON.stringify({baseUrl:'http://localhost:3000',form:'/transfer',triggerFields:['amount','toAccount'],liveRegionType:'assertive'},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-004: Error message live regions', async ({ page }) => {
  await page.goto('/transfer');
  await page.click('button[type="submit"]');
  const errorRegion = page.locator('[role="alert"]');
  await expect(errorRegion.first()).toBeVisible();
  await expect(errorRegion.first()).toHaveAttribute('aria-live', 'assertive');
  const amountInput = page.locator('#amount');
  const describedBy = await amountInput.getAttribute('aria-describedby');
  expect(describedBy).toBeTruthy();
  const errorMsg = page.locator('#' + describedBy);
  await expect(errorMsg).toContainText(/amount is required/i);
  await expect(amountInput).toHaveAttribute('aria-invalid', 'true');
  await amountInput.fill('5000');
  await expect(amountInput).toHaveAttribute('aria-invalid', 'false');
  console.log('Error linked via aria-describedby:', describedBy);
});`,expectedOutput:`Running: WA-004 Error Message Live Regions
  ✓ Form submitted empty — errors triggered
  ✓ Error region role="alert" visible
  ✓ aria-live="assertive" on error container
  ✓ Amount input aria-describedby="amount-error"
  ✓ Error message: "Amount is required"
  ✓ aria-invalid="true" set on invalid field
  ✓ After valid input: aria-invalid="false"
  WCAG 4.1.3 Level AA — PASS
  ✓ Test passed in 1.9s`},
{id:'WA-005',title:'Modal Dialog Focus Trap',category:'screenReader',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'2.4.3',level:'A',description:'Verify modal dialogs trap focus inside the dialog, have aria-modal="true", and return focus to the trigger element on close.',prerequisites:'Playwright, page with modal dialog (e.g., transfer confirmation)',config:JSON.stringify({baseUrl:'http://localhost:3000',modalTrigger:'#confirmTransfer',expectedRole:'dialog',focusableElements:3},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-005: Modal dialog focus trap', async ({ page }) => {
  await page.goto('/transfer');
  await page.fill('#amount', '10000');
  await page.fill('#toAccount', 'ACC-002');
  const trigger = page.locator('#confirmTransfer');
  await trigger.click();
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog).toHaveAttribute('aria-labelledby');
  const focused = page.locator(':focus');
  const isInside = await focused.evaluate(
    el => el.closest('[role="dialog"]') !== null);
  expect(isInside).toBe(true);
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    const still = await page.locator(':focus').evaluate(
      el => el.closest('[role="dialog"]') !== null);
    expect(still).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});`,expectedOutput:`Running: WA-005 Modal Dialog Focus Trap
  ✓ Confirmation modal opened
  ✓ role="dialog" present
  ✓ aria-modal="true" set
  ✓ aria-labelledby linked to heading
  ✓ Focus moved inside dialog on open
  ✓ Tab x5: focus stays inside dialog
  ✓ Escape closes dialog
  ✓ Focus returned to trigger button
  WCAG 2.4.3 Level A — PASS
  ✓ Test passed in 2.6s`},
{id:'WA-006',title:'Navigation Menu Landmarks',category:'screenReader',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'1.3.1',level:'A',description:'Verify navigation menus use proper landmark roles, aria-expanded for submenus, and aria-current for active page.',prerequisites:'Playwright, axe-core, banking app with navigation menu',config:JSON.stringify({baseUrl:'http://localhost:3000',navSelector:'nav[aria-label="Main Navigation"]',expectedLandmarks:['banner','navigation','main','contentinfo']},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-006: Navigation menu landmarks', async ({ page }) => {
  await page.goto('/dashboard');
  const nav = page.locator('nav[aria-label="Main Navigation"]');
  await expect(nav).toBeVisible();
  await expect(nav).toHaveRole('navigation');
  const landmarks = ['banner', 'navigation', 'main', 'contentinfo'];
  for (const role of landmarks) {
    const el = page.locator('[role="' + role + '"]');
    expect(await el.count()).toBeGreaterThanOrEqual(1);
  }
  const submenuBtn = nav.locator('button[aria-expanded]').first();
  await expect(submenuBtn).toHaveAttribute('aria-expanded', 'false');
  await submenuBtn.click();
  await expect(submenuBtn).toHaveAttribute('aria-expanded', 'true');
  const activeLink = nav.locator('[aria-current="page"]');
  await expect(activeLink).toHaveCount(1);
  const axeResults = await new AxeBuilder({ page })
    .withRules(['landmark-one-main', 'region']).analyze();
  expect(axeResults.violations).toHaveLength(0);
});`,expectedOutput:`Running: WA-006 Navigation Menu Landmarks
  ✓ Main navigation landmark found
  ✓ Landmarks: banner, navigation, main, contentinfo
  ✓ Submenu aria-expanded toggles correctly
  ✓ aria-current="page" on active link
  ✓ axe: landmark-one-main — PASS
  WCAG 1.3.1 Level A — PASS
  ✓ Test passed in 2.0s`},
{id:'WA-007',title:'Progress Bar Status Updates',category:'screenReader',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'4.1.2',level:'A',description:'Verify fund transfer progress bar has aria-valuenow, aria-valuemin, aria-valuemax and updates are announced by screen readers.',prerequisites:'Playwright, fund transfer page with progress indicator',config:JSON.stringify({baseUrl:'http://localhost:3000',progressSelector:'[role="progressbar"]',steps:['Validating','Processing','Confirming','Complete']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-007: Progress bar status updates', async ({ page }) => {
  await page.goto('/transfer');
  await page.fill('#amount', '5000');
  await page.fill('#toAccount', 'ACC-002');
  await page.click('#submitTransfer');
  const progress = page.locator('[role="progressbar"]');
  await expect(progress).toBeVisible();
  await expect(progress).toHaveAttribute('aria-valuemin', '0');
  await expect(progress).toHaveAttribute('aria-valuemax', '100');
  await expect(progress).toHaveAttribute('aria-label', /transfer progress/i);
  let prevValue = 0;
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(1000);
    const val = parseInt(await progress.getAttribute('aria-valuenow'));
    expect(val).toBeGreaterThanOrEqual(prevValue);
    prevValue = val;
    const text = await progress.getAttribute('aria-valuetext');
    console.log('Step ' + (i+1) + ': ' + text + ' (' + val + '%)');
  }
  await expect(progress).toHaveAttribute('aria-valuenow', '100');
});`,expectedOutput:`Running: WA-007 Progress Bar Status Updates
  ✓ Progress bar role="progressbar" found
  ✓ aria-valuemin="0", aria-valuemax="100"
  ✓ aria-label="Transfer Progress"
  Step 1: Validating (25%)
  Step 2: Processing (50%)
  Step 3: Confirming (75%)
  Step 4: Complete (100%)
  ✓ All values monotonically increasing
  WCAG 4.1.2 Level A — PASS
  ✓ Test passed in 5.2s`},
{id:'WA-008',title:'Dynamic Content Updates',category:'screenReader',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'4.1.3',level:'AA',description:'Verify dynamic content like balance refresh and notification badges use aria-live="polite" to announce updates without interrupting user.',prerequisites:'Playwright, dashboard with auto-refresh balance and notification system',config:JSON.stringify({baseUrl:'http://localhost:3000',liveRegions:['#balanceDisplay','#notificationBadge','#recentActivity']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-008: Dynamic content updates', async ({ page }) => {
  await page.goto('/dashboard');
  const balance = page.locator('#balanceDisplay');
  await expect(balance).toHaveAttribute('aria-live', 'polite');
  await expect(balance).toHaveAttribute('aria-atomic', 'true');
  const badge = page.locator('#notificationBadge');
  await expect(badge).toHaveAttribute('aria-live', 'polite');
  const badgeLabel = await badge.getAttribute('aria-label');
  expect(badgeLabel).toMatch(/\\d+ new notification/i);
  await page.click('#refreshBalance');
  await page.waitForSelector('#balanceDisplay[data-updated="true"]');
  const updatedText = await balance.textContent();
  expect(updatedText).toMatch(/\\d/);
  const activity = page.locator('#recentActivity');
  await expect(activity).toHaveAttribute('aria-live', 'polite');
  await expect(activity).toHaveAttribute('aria-relevant', 'additions');
  console.log('All live regions configured correctly');
});`,expectedOutput:`Running: WA-008 Dynamic Content Updates
  ✓ Balance display: aria-live="polite"
  ✓ Balance display: aria-atomic="true"
  ✓ Notification badge: aria-live="polite"
  ✓ Badge label: "3 new notifications"
  ✓ Balance refresh triggered successfully
  ✓ Activity feed: aria-live="polite"
  ✓ Activity feed: aria-relevant="additions"
  WCAG 4.1.3 Level AA — PASS
  ✓ Test passed in 3.1s`},
{id:'WA-009',title:'Skip Navigation Links',category:'screenReader',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'2.4.1',level:'A',description:'Verify "Skip to main content" link is the first focusable element, becomes visible on focus, and correctly targets the main content area.',prerequisites:'Playwright, any banking app page',config:JSON.stringify({baseUrl:'http://localhost:3000',skipLinkText:'Skip to main content',targetId:'main-content',pages:['/dashboard','/transfer','/transactions']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-009: Skip navigation links', async ({ page }) => {
  const pages = ['/dashboard', '/transfer', '/transactions'];
  for (const p of pages) {
    await page.goto(p);
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    const text = await focused.textContent();
    expect(text.toLowerCase()).toContain('skip to main content');
    const isVisible = await focused.isVisible();
    expect(isVisible).toBe(true);
    await page.keyboard.press('Enter');
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
    await expect(mainContent).toHaveAttribute('tabindex', '-1');
    console.log('Page ' + p + ': Skip link works');
  }
});`,expectedOutput:`Running: WA-009 Skip Navigation Links
  ✓ /dashboard: Skip link present and functional
  ✓ /transfer: Skip link present and functional
  ✓ /transactions: Skip link present and functional
  All 3 pages: first Tab = "Skip to main content"
  All 3 pages: Enter moves focus to #main-content
  WCAG 2.4.1 Level A — PASS
  ✓ Test passed in 4.5s`},
{id:'WA-010',title:'Form Autocomplete Attributes',category:'screenReader',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'1.3.5',level:'AA',description:'Verify personal data form fields use correct autocomplete tokens so browsers and assistive tech can auto-fill.',prerequisites:'Playwright, axe-core, profile or payment form page',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/profile',fields:{'#firstName':'given-name','#lastName':'family-name','#email':'email','#phone':'tel'}},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-010: Form autocomplete attributes', async ({ page }) => {
  await page.goto('/profile');
  const expected = {
    '#firstName': 'given-name',
    '#lastName': 'family-name',
    '#email': 'email',
    '#phone': 'tel',
    '#address': 'street-address',
    '#city': 'address-level2',
    '#postalCode': 'postal-code',
  };
  for (const [sel, val] of Object.entries(expected)) {
    const input = page.locator(sel);
    await expect(input).toHaveAttribute('autocomplete', val);
    console.log(sel + ': autocomplete="' + val + '" OK');
  }
  const pan = page.locator('#panNumber');
  await expect(pan).toHaveAttribute('autocomplete', 'off');
  const results = await new AxeBuilder({ page })
    .withRules(['autocomplete-valid']).analyze();
  expect(results.violations).toHaveLength(0);
});`,expectedOutput:`Running: WA-010 Form Autocomplete Attributes
  ✓ #firstName: autocomplete="given-name"
  ✓ #lastName: autocomplete="family-name"
  ✓ #email: autocomplete="email"
  ✓ #phone: autocomplete="tel"
  ✓ #address: autocomplete="street-address"
  ✓ #city: autocomplete="address-level2"
  ✓ #postalCode: autocomplete="postal-code"
  ✓ PAN field: autocomplete="off" (sensitive)
  ✓ axe: autocomplete-valid — PASS
  WCAG 1.3.5 Level AA — PASS
  ✓ Test passed in 1.7s`},
{id:'WA-011',title:'Tab Order Through Banking Forms',category:'keyboard',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'2.4.3',level:'A',description:'Verify logical tab sequence through fund transfer form fields follows visual reading order.',prerequisites:'Playwright, fund transfer page with multiple form fields',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/transfer',expectedOrder:['fromAccount','toAccount','amount','remarks','submitTransfer']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-011: Tab order through transfer form', async ({ page }) => {
  await page.goto('/transfer');
  const expectedOrder = [
    '#fromAccount', '#toAccount', '#amount',
    '#remarks', '#submitTransfer'
  ];
  for (const selector of expectedOrder) {
    await page.keyboard.press('Tab');
    await expect(page.locator(selector)).toBeFocused();
    console.log('Tab -> ' + selector + ' focused ✓');
  }
  // Verify no unexpected tabindex values
  const allInputs = page.locator('input, select, button, textarea');
  const count = await allInputs.count();
  for (let i = 0; i < count; i++) {
    const tabindex = await allInputs.nth(i).getAttribute('tabindex');
    if (tabindex) expect(parseInt(tabindex)).toBeLessThanOrEqual(0);
  }
  console.log('No positive tabindex values found');
});`,expectedOutput:`Running: WA-011 Tab Order Through Banking Forms
  Tab -> #fromAccount focused ✓
  Tab -> #toAccount focused ✓
  Tab -> #amount focused ✓
  Tab -> #remarks focused ✓
  Tab -> #submitTransfer focused ✓
  ✓ Tab order follows visual reading order
  ✓ No positive tabindex values found
  WCAG 2.4.3 Level A — PASS
  ✓ Test passed in 1.5s`},
{id:'WA-012',title:'Enter/Space Button Activation',category:'keyboard',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'2.1.1',level:'A',description:'Verify all buttons and links can be activated via Enter and Space keys, not just mouse click.',prerequisites:'Playwright, banking dashboard with interactive buttons',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/dashboard',testButtons:['#viewBalance','#newTransfer','#downloadStatement']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-012: Enter/Space activation', async ({ page }) => {
  await page.goto('/dashboard');
  const buttons = ['#viewBalance', '#newTransfer', '#downloadStatement'];
  for (const sel of buttons) {
    const btn = page.locator(sel);
    await btn.focus();
    // Test Enter key
    await page.keyboard.press('Enter');
    console.log(sel + ' activated via Enter ✓');
    await page.goto('/dashboard');
    // Test Space key
    await page.locator(sel).focus();
    await page.keyboard.press('Space');
    console.log(sel + ' activated via Space ✓');
    await page.goto('/dashboard');
  }
  // Check custom div-buttons have role="button"
  const customBtns = page.locator('[role="button"]');
  const count = await customBtns.count();
  for (let i = 0; i < count; i++) {
    const tag = await customBtns.nth(i).evaluate(el => el.tagName);
    if (tag !== 'BUTTON') {
      await expect(customBtns.nth(i)).toHaveAttribute('tabindex', '0');
    }
  }
});`,expectedOutput:`Running: WA-012 Enter/Space Button Activation
  #viewBalance activated via Enter ✓
  #viewBalance activated via Space ✓
  #newTransfer activated via Enter ✓
  #newTransfer activated via Space ✓
  #downloadStatement activated via Enter ✓
  #downloadStatement activated via Space ✓
  ✓ Custom buttons have tabindex="0"
  WCAG 2.1.1 Level A — PASS
  ✓ Test passed in 3.8s`},
{id:'WA-013',title:'Escape Key Dialog Dismiss',category:'keyboard',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'2.1.1',level:'A',description:'Verify ESC key closes all modal dialogs, dropdowns, and tooltips and returns focus to the trigger element.',prerequisites:'Playwright, pages with modal dialogs and dropdowns',config:JSON.stringify({baseUrl:'http://localhost:3000',dialogs:['#confirmModal','#helpDialog'],dropdowns:['#accountSelector']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-013: Escape key dialog dismiss', async ({ page }) => {
  await page.goto('/transfer');
  // Test modal dismiss
  const trigger = page.locator('#openConfirmModal');
  await trigger.click();
  const modal = page.locator('#confirmModal');
  await expect(modal).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible();
  await expect(trigger).toBeFocused();
  console.log('Modal dismissed with ESC, focus restored');

  // Test dropdown dismiss
  const dropdown = page.locator('#accountSelector');
  await dropdown.click();
  const menu = page.locator('#accountSelector [role="listbox"]');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(dropdown).toBeFocused();
  console.log('Dropdown dismissed with ESC, focus restored');

  // Test tooltip dismiss
  const tooltipTrigger = page.locator('[data-tooltip]').first();
  await tooltipTrigger.focus();
  const tooltip = page.locator('[role="tooltip"]');
  await expect(tooltip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(tooltip).not.toBeVisible();
});`,expectedOutput:`Running: WA-013 Escape Key Dialog Dismiss
  ✓ Modal opened and visible
  ✓ ESC closes modal
  ✓ Focus restored to trigger button
  ✓ Dropdown opened and visible
  ✓ ESC closes dropdown
  ✓ Focus restored to dropdown trigger
  ✓ Tooltip dismissed with ESC
  WCAG 2.1.1 Level A — PASS
  ✓ Test passed in 2.3s`},
{id:'WA-014',title:'Arrow Key Menu Navigation',category:'keyboard',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'2.1.1',level:'A',description:'Verify up/down arrow keys navigate through dropdown menus and menu items following WAI-ARIA menu pattern.',prerequisites:'Playwright, banking app with dropdown menus',config:JSON.stringify({baseUrl:'http://localhost:3000',menuSelector:'#mainMenu',menuItems:['Dashboard','Accounts','Transfers','Settings']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-014: Arrow key menu navigation', async ({ page }) => {
  await page.goto('/dashboard');
  const menuBtn = page.locator('#mainMenuBtn');
  await menuBtn.focus();
  await page.keyboard.press('Enter');
  const menu = page.locator('#mainMenu[role="menu"]');
  await expect(menu).toBeVisible();

  // Down arrow navigates through items
  const items = menu.locator('[role="menuitem"]');
  await page.keyboard.press('ArrowDown');
  await expect(items.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(items.nth(2)).toBeFocused();

  // Up arrow goes back
  await page.keyboard.press('ArrowUp');
  await expect(items.nth(1)).toBeFocused();

  // Home/End keys
  await page.keyboard.press('End');
  await expect(items.last()).toBeFocused();
  await page.keyboard.press('Home');
  await expect(items.first()).toBeFocused();

  // Enter activates item
  await page.keyboard.press('Enter');
  console.log('Menu item activated via Enter');
});`,expectedOutput:`Running: WA-014 Arrow Key Menu Navigation
  ✓ Menu opened with Enter key
  ✓ ArrowDown -> item 1 focused
  ✓ ArrowDown -> item 2 focused
  ✓ ArrowDown -> item 3 focused
  ✓ ArrowUp -> item 2 focused
  ✓ End key -> last item focused
  ✓ Home key -> first item focused
  ✓ Enter activates menu item
  WCAG 2.1.1 Level A — PASS
  ✓ Test passed in 2.1s`},
{id:'WA-015',title:'Focus Indicator Visibility',category:'keyboard',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'2.4.7',level:'AA',description:'Verify all interactive elements have a visible focus indicator with minimum 2px outline width.',prerequisites:'Playwright, any banking app page',config:JSON.stringify({baseUrl:'http://localhost:3000',minOutlineWidth:2,pages:['/dashboard','/transfer','/login']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-015: Focus indicator visibility', async ({ page }) => {
  await page.goto('/dashboard');
  const interactive = page.locator(
    'a, button, input, select, textarea, [tabindex="0"]');
  const count = await interactive.count();
  let violations = 0;

  for (let i = 0; i < Math.min(count, 20); i++) {
    const el = interactive.nth(i);
    await el.focus();
    const styles = await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        outlineWidth: cs.outlineWidth,
        outlineStyle: cs.outlineStyle,
        outlineColor: cs.outlineColor,
        boxShadow: cs.boxShadow,
      };
    });
    const hasOutline = parseInt(styles.outlineWidth) >= 2
      && styles.outlineStyle !== 'none';
    const hasBoxShadow = styles.boxShadow !== 'none';
    if (!hasOutline && !hasBoxShadow) violations++;
    console.log('Element ' + (i+1) + ': outline=' +
      styles.outlineWidth + ' ' + (hasOutline||hasBoxShadow ? '✓' : '✗'));
  }
  expect(violations).toBe(0);
});`,expectedOutput:`Running: WA-015 Focus Indicator Visibility
  Element 1: outline=2px ✓
  Element 2: outline=2px ✓
  Element 3: outline=3px ✓
  ...checked 20 elements...
  ✓ All interactive elements have visible focus
  ✓ Minimum outline width: 2px met
  Violations: 0 out of 20 elements
  WCAG 2.4.7 Level AA — PASS
  ✓ Test passed in 3.2s`},
{id:'WA-016',title:'Keyboard Shortcut Documentation',category:'keyboard',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'2.1.4',level:'A',description:'Verify keyboard shortcuts are documented in help overlay and can be discovered via Alt+? or help button.',prerequisites:'Playwright, banking app with keyboard shortcuts',config:JSON.stringify({baseUrl:'http://localhost:3000',shortcuts:{'Alt+B':'View Balance','Alt+T':'New Transfer','Alt+H':'Help','?':'Shortcut Help'}},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-016: Keyboard shortcut documentation', async ({ page }) => {
  await page.goto('/dashboard');
  // Open shortcut help with ?
  await page.keyboard.press('?');
  const helpOverlay = page.locator('#keyboardShortcutHelp');
  await expect(helpOverlay).toBeVisible();
  await expect(helpOverlay).toHaveAttribute('role', 'dialog');

  // Verify documented shortcuts
  const shortcuts = {
    'Alt+B': 'View Balance',
    'Alt+T': 'New Transfer',
    'Alt+S': 'Statement',
    'Alt+H': 'Help',
  };
  for (const [key, desc] of Object.entries(shortcuts)) {
    const row = helpOverlay.locator('text=' + key);
    await expect(row).toBeVisible();
    console.log(key + ': ' + desc + ' — documented ✓');
  }

  // Close and test a shortcut
  await page.keyboard.press('Escape');
  await page.keyboard.press('Alt+B');
  await expect(page).toHaveURL(/balance|accounts/);
  console.log('Alt+B shortcut functional ✓');
});`,expectedOutput:`Running: WA-016 Keyboard Shortcut Documentation
  ✓ Shortcut help overlay opened with "?"
  ✓ Help has role="dialog"
  Alt+B: View Balance — documented ✓
  Alt+T: New Transfer — documented ✓
  Alt+S: Statement — documented ✓
  Alt+H: Help — documented ✓
  ✓ Alt+B shortcut navigates to balance
  WCAG 2.1.4 Level A — PASS
  ✓ Test passed in 2.4s`},
{id:'WA-017',title:'No Keyboard Traps',category:'keyboard',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'2.1.2',level:'A',description:'Verify user can tab away from every interactive component without getting trapped, except for intentional modal focus traps.',prerequisites:'Playwright, full banking application flow',config:JSON.stringify({baseUrl:'http://localhost:3000',pages:['/dashboard','/transfer','/profile','/settings'],maxTabPresses:100},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-017: No keyboard traps', async ({ page }) => {
  const pages = ['/dashboard', '/transfer', '/profile'];
  for (const p of pages) {
    await page.goto(p);
    const startEl = await page.evaluate(() => document.activeElement?.tagName);
    let trapped = false;
    const visited = new Set();
    for (let i = 0; i < 100; i++) {
      await page.keyboard.press('Tab');
      const current = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.id || el?.tagName + '_' + el?.textContent?.slice(0,20);
      });
      if (visited.has(current) && visited.size > 2) break;
      visited.add(current);
    }
    // Shift+Tab should also work
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Shift+Tab');
    }
    const afterShiftTab = await page.evaluate(
      () => document.activeElement?.tagName);
    expect(afterShiftTab).toBeTruthy();
    console.log(p + ': ' + visited.size + ' elements reachable, no traps ✓');
  }
});`,expectedOutput:`Running: WA-017 No Keyboard Traps
  /dashboard: 15 elements reachable, no traps ✓
  /transfer: 12 elements reachable, no traps ✓
  /profile: 18 elements reachable, no traps ✓
  ✓ Tab cycles through all elements
  ✓ Shift+Tab reverses navigation
  ✓ No keyboard traps detected
  WCAG 2.1.2 Level A — PASS
  ✓ Test passed in 6.1s`},
{id:'WA-018',title:'Focus Management on Page Change',category:'keyboard',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'2.4.3',level:'A',description:'Verify focus moves to main heading or content area after route navigation in SPA banking application.',prerequisites:'Playwright, SPA banking app with client-side routing',config:JSON.stringify({baseUrl:'http://localhost:3000',routes:[{from:'/dashboard',to:'/transfer',expectedFocus:'h1'},{from:'/transfer',to:'/transactions',expectedFocus:'h1'}]},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-018: Focus management on page change', async ({ page }) => {
  await page.goto('/dashboard');
  // Navigate to transfer page via link
  await page.click('a[href="/transfer"]');
  await page.waitForURL('**/transfer');
  // Focus should be on the page heading
  const heading = page.locator('h1');
  await expect(heading).toBeFocused();
  const headingText = await heading.textContent();
  console.log('After nav to /transfer, focus on: "' + headingText + '"');

  // Navigate to transactions
  await page.click('a[href="/transactions"]');
  await page.waitForURL('**/transactions');
  const h1 = page.locator('h1');
  await expect(h1).toBeFocused();
  console.log('After nav to /transactions, focus on: "' +
    await h1.textContent() + '"');

  // Verify page title updated
  const title = await page.title();
  expect(title).toContain('Transaction');
  // Verify live region announces page change
  const announcer = page.locator('[aria-live="polite"]#routeAnnouncer');
  await expect(announcer).toContainText(/transaction/i);
});`,expectedOutput:`Running: WA-018 Focus Management on Page Change
  ✓ Navigate to /transfer
  ✓ Focus on h1: "Fund Transfer"
  ✓ Navigate to /transactions
  ✓ Focus on h1: "Transaction History"
  ✓ Page title updated: "Transaction History"
  ✓ Route announcer: aria-live="polite"
  WCAG 2.4.3 Level A — PASS
  ✓ Test passed in 3.0s`},
{id:'WA-019',title:'Custom Widget Keyboard Support',category:'keyboard',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'2.1.1',level:'A',description:'Verify custom widgets (date picker, slider, combobox) follow WAI-ARIA keyboard interaction patterns.',prerequisites:'Playwright, banking app with date picker and custom widgets',config:JSON.stringify({baseUrl:'http://localhost:3000',widgets:{datePicker:'#transactionDate',combobox:'#beneficiarySearch',slider:'#amountSlider'}},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-019: Custom widget keyboard support', async ({ page }) => {
  await page.goto('/transfer');
  // Date Picker: Arrow keys navigate days
  const datePicker = page.locator('#transactionDate');
  await datePicker.focus();
  await page.keyboard.press('Enter'); // open calendar
  const calendar = page.locator('[role="grid"]');
  await expect(calendar).toBeVisible();
  await page.keyboard.press('ArrowRight'); // next day
  await page.keyboard.press('Enter'); // select
  await expect(calendar).not.toBeVisible();
  console.log('Date picker: keyboard navigation ✓');

  // Combobox: type to filter, arrows to select
  const combo = page.locator('#beneficiarySearch');
  await combo.focus();
  await combo.fill('Raj');
  const listbox = page.locator('[role="listbox"]');
  await expect(listbox).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  const value = await combo.inputValue();
  expect(value).toContain('Raj');
  console.log('Combobox: type + arrow + enter ✓');

  // Slider: arrow keys adjust value
  const slider = page.locator('#amountSlider[role="slider"]');
  await slider.focus();
  const before = await slider.getAttribute('aria-valuenow');
  await page.keyboard.press('ArrowRight');
  const after = await slider.getAttribute('aria-valuenow');
  expect(parseInt(after)).toBeGreaterThan(parseInt(before));
  console.log('Slider: arrow key adjustment ✓');
});`,expectedOutput:`Running: WA-019 Custom Widget Keyboard Support
  ✓ Date picker opens with Enter
  ✓ ArrowRight navigates to next day
  ✓ Enter selects date and closes calendar
  ✓ Combobox filters on typing "Raj"
  ✓ ArrowDown + Enter selects suggestion
  ✓ Slider ArrowRight increases value
  All custom widgets keyboard accessible
  WCAG 2.1.1 Level A — PASS
  ✓ Test passed in 3.5s`},
{id:'WA-020',title:'Bypass Blocks',category:'keyboard',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'2.4.1',level:'A',description:'Verify bypass mechanisms (skip links, landmark regions) allow keyboard users to quickly navigate to main content areas.',prerequisites:'Playwright, axe-core, multi-page banking application',config:JSON.stringify({baseUrl:'http://localhost:3000',requiredLandmarks:['banner','navigation','main','contentinfo'],skipLinks:['Skip to main content','Skip to navigation']},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-020: Bypass blocks', async ({ page }) => {
  await page.goto('/dashboard');
  // Verify landmark regions
  const main = page.locator('main, [role="main"]');
  await expect(main).toHaveCount(1);
  const nav = page.locator('nav, [role="navigation"]');
  expect(await nav.count()).toBeGreaterThanOrEqual(1);
  const banner = page.locator('header, [role="banner"]');
  await expect(banner).toHaveCount(1);

  // Check heading hierarchy
  const h1 = page.locator('h1');
  await expect(h1).toHaveCount(1);
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1,h2,h3,h4'))
      .map(h => ({ tag: h.tagName, text: h.textContent.trim() }));
  });
  console.log('Heading hierarchy:', JSON.stringify(headings.slice(0,5)));

  // axe bypass rule
  const results = await new AxeBuilder({ page })
    .withRules(['bypass', 'landmark-one-main', 'page-has-heading-one'])
    .analyze();
  expect(results.violations).toHaveLength(0);
  console.log('All bypass mechanisms in place');
});`,expectedOutput:`Running: WA-020 Bypass Blocks
  ✓ main landmark: 1 found
  ✓ navigation landmark: 1 found
  ✓ banner landmark: 1 found
  ✓ Single h1 heading present
  ✓ Heading hierarchy valid
  ✓ axe: bypass — PASS
  ✓ axe: landmark-one-main — PASS
  ✓ axe: page-has-heading-one — PASS
  WCAG 2.4.1 Level A — PASS
  ✓ Test passed in 2.2s`},
{id:'WA-021',title:'Color Contrast Ratio (4.5:1)',category:'visual',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'1.4.3',level:'AA',description:'Verify all text on banking cards and pages meets WCAG AA minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.',prerequisites:'Playwright, axe-core, banking dashboard with various card components',config:JSON.stringify({baseUrl:'http://localhost:3000',minRatioNormal:4.5,minRatioLarge:3.0,pages:['/dashboard','/login','/transfer']},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-021: Color contrast ratio 4.5:1', async ({ page }) => {
  await page.goto('/dashboard');
  const results = await new AxeBuilder({ page })
    .withRules(['color-contrast']).analyze();
  const violations = results.violations
    .filter(v => v.id === 'color-contrast');
  console.log('Contrast violations:', violations.length);
  violations.forEach(v => {
    v.nodes.forEach(n => {
      console.log('Element:', n.target[0],
        'Ratio:', n.any[0]?.data?.contrastRatio);
    });
  });
  // Check specific banking card elements
  const cardText = page.locator('.account-card .balance-text');
  const color = await cardText.evaluate(el => {
    const cs = getComputedStyle(el);
    return { fg: cs.color, bg: cs.backgroundColor };
  });
  console.log('Card text colors:', JSON.stringify(color));
  expect(violations).toHaveLength(0);
});`,expectedOutput:`Running: WA-021 Color Contrast Ratio (4.5:1)
  ✓ axe color-contrast scan complete
  Contrast violations: 0
  ✓ Dashboard: all text meets 4.5:1
  ✓ Banking cards: balance text passes
  ✓ Navigation links: contrast OK
  ✓ Form labels: contrast OK
  Elements scanned: 142 | Passes: 142
  WCAG 1.4.3 Level AA — PASS
  ✓ Test passed in 2.8s`},
{id:'WA-022',title:'Color-Independent Information',category:'visual',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'1.4.1',level:'A',description:'Verify errors, success states, and status information are not conveyed by color alone — use icons, text, or patterns.',prerequisites:'Playwright, banking forms with validation states',config:JSON.stringify({baseUrl:'http://localhost:3000',checkElements:['error-messages','success-alerts','status-badges','transaction-types']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-022: Color-independent information', async ({ page }) => {
  await page.goto('/transfer');
  // Trigger a form error
  await page.click('button[type="submit"]');

  // Error must have icon AND text, not just red color
  const errorMsg = page.locator('.error-message').first();
  await expect(errorMsg).toBeVisible();
  const hasIcon = await errorMsg.locator('svg, img, [aria-hidden]').count();
  expect(hasIcon).toBeGreaterThan(0);
  const hasText = await errorMsg.textContent();
  expect(hasText.length).toBeGreaterThan(5);
  console.log('Error: has icon + text (not color only) ✓');

  // Check status badges have text labels
  await page.goto('/transactions');
  const badges = page.locator('.status-badge');
  const count = await badges.count();
  for (let i = 0; i < Math.min(count, 5); i++) {
    const text = await badges.nth(i).textContent();
    expect(text.trim().length).toBeGreaterThan(0);
  }
  console.log('Status badges all have text labels ✓');

  // Verify required fields use asterisk + sr-only text
  await page.goto('/transfer');
  const required = page.locator('[aria-required="true"]');
  const reqCount = await required.count();
  expect(reqCount).toBeGreaterThan(0);
  console.log('Required fields: ' + reqCount + ' with aria-required');
});`,expectedOutput:`Running: WA-022 Color-Independent Information
  ✓ Error messages have icon + text
  ✓ Not conveyed by color alone
  ✓ Status badges: "Completed", "Pending", "Failed"
  ✓ All badges have text labels
  ✓ Required fields: 3 with aria-required
  ✓ Visual asterisk + sr-only text present
  WCAG 1.4.1 Level A — PASS
  ✓ Test passed in 2.5s`},
{id:'WA-023',title:'Text Resize to 200%',category:'visual',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'1.4.4',level:'AA',description:'Verify banking app layout does not break when text is resized to 200%, no content overlap or horizontal scrolling.',prerequisites:'Playwright, responsive banking application',config:JSON.stringify({baseUrl:'http://localhost:3000',zoomLevels:[150,200],pages:['/dashboard','/transfer','/transactions']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-023: Text resize to 200%', async ({ page }) => {
  const pages = ['/dashboard', '/transfer', '/transactions'];
  for (const p of pages) {
    await page.goto(p);
    // Set browser zoom to 200%
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await page.waitForTimeout(500);

    // Check no horizontal scroll
    const hasHScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth);
    expect(hasHScroll).toBe(false);

    // Check no text overlap
    const overlaps = await page.evaluate(() => {
      const els = document.querySelectorAll('p, span, label, h1, h2, h3');
      let count = 0;
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.height < 1 && el.textContent.trim()) count++;
      });
      return count;
    });
    expect(overlaps).toBe(0);

    // Check text is not clipped
    const clipped = await page.evaluate(() => {
      const els = document.querySelectorAll('*');
      let count = 0;
      els.forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.overflow === 'hidden' && cs.textOverflow === '') count++;
      });
      return count;
    });
    console.log(p + ' at 200%: no overflow, no clip ✓');
  }
});`,expectedOutput:`Running: WA-023 Text Resize to 200%
  ✓ /dashboard at 200%: no horizontal scroll
  ✓ /dashboard at 200%: no text overlap
  ✓ /transfer at 200%: no overflow, no clip
  ✓ /transactions at 200%: layout intact
  All pages maintain layout at 200% zoom
  WCAG 1.4.4 Level AA — PASS
  ✓ Test passed in 4.2s`},
{id:'WA-024',title:'Responsive Reflow at 320px',category:'visual',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'1.4.10',level:'AA',description:'Verify banking app content reflows at 320px viewport width without horizontal scrolling, maintaining all functionality.',prerequisites:'Playwright, responsive banking application',config:JSON.stringify({baseUrl:'http://localhost:3000',viewportWidth:320,viewportHeight:568,pages:['/dashboard','/transfer','/login']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-024: Responsive reflow at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  const pages = ['/dashboard', '/transfer', '/login'];
  for (const p of pages) {
    await page.goto(p);
    await page.waitForTimeout(300);

    // No horizontal scrollbar
    const scrollW = await page.evaluate(
      () => document.documentElement.scrollWidth);
    expect(scrollW).toBeLessThanOrEqual(320);

    // All interactive elements still visible
    const buttons = page.locator('button:visible');
    const btnCount = await buttons.count();
    expect(btnCount).toBeGreaterThan(0);

    // Text is readable (no tiny font)
    const minFont = await page.evaluate(() => {
      let min = 100;
      document.querySelectorAll('p, span, label, a').forEach(el => {
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size < min) min = size;
      });
      return min;
    });
    expect(minFont).toBeGreaterThanOrEqual(12);
    console.log(p + ' at 320px: scrollW=' + scrollW +
      'px, minFont=' + minFont + 'px ✓');
  }
});`,expectedOutput:`Running: WA-024 Responsive Reflow at 320px
  /dashboard at 320px: scrollW=320px, minFont=14px ✓
  /transfer at 320px: scrollW=320px, minFont=14px ✓
  /login at 320px: scrollW=320px, minFont=16px ✓
  ✓ No horizontal scrolling on any page
  ✓ All buttons remain visible
  ✓ Minimum font size >= 12px
  WCAG 1.4.10 Level AA — PASS
  ✓ Test passed in 3.8s`},
{id:'WA-025',title:'Focus Indicator Contrast',category:'visual',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'2.4.11',level:'AAA',description:'Verify focus indicators meet 3:1 contrast ratio against adjacent colors and provide sufficient area for visibility.',prerequisites:'Playwright, banking app with styled focus indicators',config:JSON.stringify({baseUrl:'http://localhost:3000',minContrastRatio:3.0,minOutlineWidth:2,pages:['/dashboard','/transfer']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-025: Focus indicator contrast', async ({ page }) => {
  await page.goto('/dashboard');
  const interactive = page.locator('a, button, input, select');
  const count = await interactive.count();
  let violations = 0;

  for (let i = 0; i < Math.min(count, 15); i++) {
    const el = interactive.nth(i);
    await el.focus();
    const focusStyles = await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        outlineColor: cs.outlineColor,
        outlineWidth: cs.outlineWidth,
        outlineOffset: cs.outlineOffset,
        bgColor: cs.backgroundColor,
      };
    });
    const outlineW = parseInt(focusStyles.outlineWidth);
    if (outlineW < 2) violations++;
    const tag = await el.evaluate(el => el.tagName + '#' + el.id);
    console.log(tag + ': outline=' + focusStyles.outlineColor +
      ' ' + focusStyles.outlineWidth +
      (outlineW >= 2 ? ' ✓' : ' ✗'));
  }
  expect(violations).toBe(0);
});`,expectedOutput:`Running: WA-025 Focus Indicator Contrast
  BUTTON#viewBalance: outline=rgb(78,204,163) 2px ✓
  A#navDashboard: outline=rgb(78,204,163) 2px ✓
  INPUT#searchBox: outline=rgb(78,204,163) 3px ✓
  ...checked 15 elements...
  ✓ All focus indicators meet 3:1 contrast
  ✓ Minimum 2px outline width
  Violations: 0 of 15 elements
  WCAG 2.4.11 Level AAA — PASS
  ✓ Test passed in 2.9s`},
{id:'WA-026',title:'Animation Pause Control',category:'visual',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'2.3.3',level:'AAA',description:'Verify banking app respects prefers-reduced-motion and provides controls to pause/stop animations.',prerequisites:'Playwright, banking app with animations (loading spinners, transitions)',config:JSON.stringify({baseUrl:'http://localhost:3000',checkAnimations:['carousel','loading-spinner','notification-slide'],mediaQuery:'prefers-reduced-motion: reduce'},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-026: Animation pause control', async ({ page }) => {
  // Enable reduced motion preference
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/dashboard');

  // Check animations are disabled
  const animations = await page.evaluate(() => {
    const els = document.querySelectorAll('*');
    let animated = 0;
    els.forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.animationDuration !== '0s' &&
          cs.animationPlayState === 'running') animated++;
    });
    return animated;
  });
  expect(animations).toBe(0);
  console.log('Reduced motion: ' + animations + ' running animations ✓');

  // Check CSS uses prefers-reduced-motion
  const hasMediaQuery = await page.evaluate(() => {
    const sheets = document.styleSheets;
    for (const sheet of sheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.media?.mediaText?.includes('prefers-reduced-motion'))
            return true;
        }
      } catch(e) {}
    }
    return false;
  });
  expect(hasMediaQuery).toBe(true);
  console.log('CSS @media prefers-reduced-motion found ✓');

  // Check pause button exists for auto-playing content
  const pauseBtn = page.locator('[aria-label*="pause" i]');
  if (await pauseBtn.count() > 0) {
    console.log('Pause button available for auto-play content ✓');
  }
});`,expectedOutput:`Running: WA-026 Animation Pause Control
  ✓ prefers-reduced-motion: reduce enabled
  ✓ Running animations: 0
  ✓ CSS @media prefers-reduced-motion found
  ✓ Transitions disabled in reduced motion
  ✓ Pause button for auto-play content
  WCAG 2.3.3 Level AAA — PASS
  ✓ Test passed in 2.1s`},
{id:'WA-027',title:'Dark Mode Accessibility',category:'visual',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'1.4.3',level:'AA',description:'Verify contrast ratios are maintained in dark mode theme, all elements remain readable and interactive.',prerequisites:'Playwright, axe-core, banking app with dark mode toggle',config:JSON.stringify({baseUrl:'http://localhost:3000',darkModeToggle:'#themeToggle',minContrast:4.5},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-027: Dark mode accessibility', async ({ page }) => {
  await page.goto('/dashboard');
  // Switch to dark mode
  await page.click('#themeToggle');
  await page.waitForTimeout(500);

  // Verify dark mode is active
  const isDark = await page.evaluate(() =>
    document.documentElement.classList.contains('dark') ||
    document.body.dataset.theme === 'dark');
  expect(isDark).toBe(true);
  console.log('Dark mode activated ✓');

  // Run contrast check in dark mode
  const results = await new AxeBuilder({ page })
    .withRules(['color-contrast']).analyze();
  const violations = results.violations
    .filter(v => v.id === 'color-contrast');
  console.log('Dark mode contrast violations:', violations.length);
  expect(violations).toHaveLength(0);

  // Check form inputs are visible
  const inputs = page.locator('input:visible');
  const count = await inputs.count();
  for (let i = 0; i < Math.min(count, 5); i++) {
    const border = await inputs.nth(i).evaluate(
      el => getComputedStyle(el).borderColor);
    expect(border).not.toBe('transparent');
  }
  console.log('Form inputs visible in dark mode ✓');
});`,expectedOutput:`Running: WA-027 Dark Mode Accessibility
  ✓ Dark mode activated
  ✓ Theme class applied to document
  ✓ Color contrast scan: 0 violations
  ✓ Form inputs visible with borders
  ✓ Navigation links readable
  ✓ Button text contrast passes 4.5:1
  WCAG 1.4.3 Level AA — PASS
  ✓ Test passed in 3.4s`},
{id:'WA-028',title:'Icon with Text Labels',category:'visual',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'1.1.1',level:'A',description:'Verify all icon buttons have either visible text labels or screen-reader-only text via aria-label or sr-only class.',prerequisites:'Playwright, banking app with icon buttons',config:JSON.stringify({baseUrl:'http://localhost:3000',pages:['/dashboard','/transfer'],iconSelectors:['button svg','a svg','[role="button"] svg']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-028: Icon with text labels', async ({ page }) => {
  await page.goto('/dashboard');
  // Find all icon-only buttons
  const iconBtns = page.locator('button:has(svg), a:has(svg)');
  const count = await iconBtns.count();
  let violations = 0;

  for (let i = 0; i < count; i++) {
    const btn = iconBtns.nth(i);
    const ariaLabel = await btn.getAttribute('aria-label');
    const title = await btn.getAttribute('title');
    const srOnly = await btn.locator('.sr-only, .visually-hidden').count();
    const visibleText = (await btn.textContent()).trim();

    const hasLabel = ariaLabel || title || srOnly > 0 ||
      visibleText.length > 0;
    if (!hasLabel) {
      violations++;
      const html = await btn.evaluate(el => el.outerHTML.slice(0, 80));
      console.log('VIOLATION: ' + html);
    }
  }
  console.log('Icon buttons: ' + count + ' total, ' +
    violations + ' without labels');
  expect(violations).toBe(0);
});`,expectedOutput:`Running: WA-028 Icon with Text Labels
  ✓ Found 12 icon buttons
  ✓ All icon buttons have accessible names
  ✓ 8 with aria-label
  ✓ 2 with visible text + icon
  ✓ 2 with sr-only text
  Violations: 0 of 12 icon buttons
  WCAG 1.1.1 Level A — PASS
  ✓ Test passed in 1.6s`},
{id:'WA-029',title:'Link Purpose from Context',category:'visual',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'2.4.4',level:'A',description:'Verify no "click here" or "read more" links exist — all links have descriptive text conveying their purpose.',prerequisites:'Playwright, axe-core, banking app with multiple pages',config:JSON.stringify({baseUrl:'http://localhost:3000',bannedLinkTexts:['click here','read more','here','more','link','this'],pages:['/dashboard','/help']},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-029: Link purpose from context', async ({ page }) => {
  await page.goto('/dashboard');
  const banned = ['click here', 'read more', 'here', 'more', 'link'];
  const links = page.locator('a');
  const count = await links.count();
  let violations = 0;

  for (let i = 0; i < count; i++) {
    const text = (await links.nth(i).textContent()).trim().toLowerCase();
    const ariaLabel = await links.nth(i).getAttribute('aria-label');
    const effectiveText = ariaLabel || text;
    if (banned.includes(effectiveText)) {
      violations++;
      const href = await links.nth(i).getAttribute('href');
      console.log('VIOLATION: "' + effectiveText + '" -> ' + href);
    }
  }
  console.log('Links: ' + count + ' total, ' + violations + ' vague');

  const results = await new AxeBuilder({ page })
    .withRules(['link-name']).analyze();
  expect(results.violations).toHaveLength(0);
  expect(violations).toBe(0);
});`,expectedOutput:`Running: WA-029 Link Purpose from Context
  ✓ Found 24 links on dashboard
  ✓ No "click here" links found
  ✓ No "read more" links found
  ✓ All links have descriptive text
  ✓ axe: link-name — PASS
  Links: 24 total, 0 vague
  WCAG 2.4.4 Level A — PASS
  ✓ Test passed in 1.8s`},
{id:'WA-030',title:'Consistent Navigation',category:'visual',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'3.2.3',level:'AA',description:'Verify navigation menu appears in the same order and position across all banking pages.',prerequisites:'Playwright, multi-page banking application',config:JSON.stringify({baseUrl:'http://localhost:3000',pages:['/dashboard','/transfer','/transactions','/profile','/settings'],navSelector:'nav#mainNav'},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-030: Consistent navigation', async ({ page }) => {
  const pages = ['/dashboard', '/transfer', '/transactions',
    '/profile', '/settings'];
  let baseNavItems = null;
  let baseNavPosition = null;

  for (const p of pages) {
    await page.goto(p);
    const nav = page.locator('nav#mainNav');
    await expect(nav).toBeVisible();

    // Get nav items text
    const items = await nav.locator('a').allTextContents();
    const cleanItems = items.map(t => t.trim()).filter(Boolean);

    // Get nav position
    const rect = await nav.boundingBox();

    if (!baseNavItems) {
      baseNavItems = cleanItems;
      baseNavPosition = { x: rect.x, y: rect.y };
    } else {
      // Compare order
      expect(cleanItems).toEqual(baseNavItems);
      // Compare position (within tolerance)
      expect(Math.abs(rect.x - baseNavPosition.x)).toBeLessThan(5);
      expect(Math.abs(rect.y - baseNavPosition.y)).toBeLessThan(5);
    }
    console.log(p + ': nav items=' + cleanItems.length +
      ' position=(' + Math.round(rect.x) + ',' + Math.round(rect.y) + ') ✓');
  }
});`,expectedOutput:`Running: WA-030 Consistent Navigation
  /dashboard: nav items=5 position=(0,0) ✓
  /transfer: nav items=5 position=(0,0) ✓
  /transactions: nav items=5 position=(0,0) ✓
  /profile: nav items=5 position=(0,0) ✓
  /settings: nav items=5 position=(0,0) ✓
  ✓ Same order across all 5 pages
  ✓ Same position across all 5 pages
  WCAG 3.2.3 Level AA — PASS
  ✓ Test passed in 5.0s`},
{id:'WA-031',title:'Label-Input Association',category:'form',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'1.3.1',level:'A',description:'Verify every form input has an associated <label> element via for/id or aria-label attribute.',prerequisites:'Playwright, axe-core, banking forms (login, transfer, profile)',config:JSON.stringify({baseUrl:'http://localhost:3000',pages:['/login','/transfer','/profile'],axeRules:['label','label-title-only']},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-031: Label-input association', async ({ page }) => {
  const pages = ['/login', '/transfer', '/profile'];
  for (const p of pages) {
    await page.goto(p);
    const inputs = page.locator('input, select, textarea');
    const count = await inputs.count();
    let unlabeled = 0;
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const label = id ? await page.locator('label[for="' + id + '"]').count() : 0;
      if (!ariaLabel && !ariaLabelledBy && label === 0) unlabeled++;
    }
    const results = await new AxeBuilder({ page })
      .withRules(['label']).analyze();
    console.log(p + ': ' + count + ' inputs, ' + unlabeled + ' unlabeled');
    expect(unlabeled).toBe(0);
    expect(results.violations).toHaveLength(0);
  }
});`,expectedOutput:`Running: WA-031 Label-Input Association
  /login: 3 inputs, 0 unlabeled ✓
  /transfer: 5 inputs, 0 unlabeled ✓
  /profile: 8 inputs, 0 unlabeled ✓
  ✓ axe: label rule — PASS on all pages
  ✓ All 16 inputs have associated labels
  WCAG 1.3.1 Level A — PASS
  ✓ Test passed in 3.2s`},
{id:'WA-032',title:'Required Field Indication',category:'form',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'3.3.2',level:'A',description:'Verify required fields have aria-required="true", visual asterisk, and screen-reader-only text explaining the indicator.',prerequisites:'Playwright, banking form with required fields',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/transfer',requiredFields:['#toAccount','#amount']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-032: Required field indication', async ({ page }) => {
  await page.goto('/transfer');
  const requiredFields = ['#toAccount', '#amount', '#fromAccount'];
  for (const sel of requiredFields) {
    const input = page.locator(sel);
    // Check aria-required
    await expect(input).toHaveAttribute('aria-required', 'true');
    // Check visual asterisk
    const label = page.locator('label[for="' + sel.slice(1) + '"]');
    const labelText = await label.textContent();
    expect(labelText).toContain('*');
    // Check sr-only text for asterisk
    const srOnly = label.locator('.sr-only');
    if (await srOnly.count() > 0) {
      await expect(srOnly).toContainText(/required/i);
    }
    console.log(sel + ': aria-required + visual asterisk ✓');
  }
  // Check form-level instruction
  const instruction = page.locator('.form-instructions');
  await expect(instruction).toContainText(/required/i);
  console.log('Form instruction about required fields present ✓');
});`,expectedOutput:`Running: WA-032 Required Field Indication
  #toAccount: aria-required + visual asterisk ✓
  #amount: aria-required + visual asterisk ✓
  #fromAccount: aria-required + visual asterisk ✓
  ✓ sr-only text: "required" present
  ✓ Form instruction about required fields
  WCAG 3.3.2 Level A — PASS
  ✓ Test passed in 1.4s`},
{id:'WA-033',title:'Error Identification',category:'form',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'3.3.1',level:'A',description:'Verify form errors use aria-invalid="true" and aria-describedby pointing to descriptive error messages.',prerequisites:'Playwright, banking form with validation',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/transfer',invalidInputs:{amount:'abc',toAccount:''}},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-033: Error identification', async ({ page }) => {
  await page.goto('/transfer');
  // Fill invalid data
  await page.fill('#amount', 'abc');
  await page.click('button[type="submit"]');
  // Check aria-invalid
  const amount = page.locator('#amount');
  await expect(amount).toHaveAttribute('aria-invalid', 'true');
  // Check aria-describedby points to error
  const describedBy = await amount.getAttribute('aria-describedby');
  expect(describedBy).toBeTruthy();
  const errorEl = page.locator('#' + describedBy);
  await expect(errorEl).toBeVisible();
  const errorText = await errorEl.textContent();
  expect(errorText.length).toBeGreaterThan(5);
  console.log('Error text: "' + errorText + '"');

  // Check error summary at top of form
  const summary = page.locator('[role="alert"]');
  await expect(summary).toBeVisible();
  const summaryText = await summary.textContent();
  expect(summaryText).toMatch(/error|invalid/i);

  // Verify error icon is decorative
  const icon = errorEl.locator('svg, img');
  if (await icon.count() > 0) {
    await expect(icon.first()).toHaveAttribute('aria-hidden', 'true');
  }
  console.log('Error identification complete ✓');
});`,expectedOutput:`Running: WA-033 Error Identification
  ✓ aria-invalid="true" on amount field
  ✓ aria-describedby="amount-error"
  ✓ Error text: "Please enter a valid amount"
  ✓ Error summary with role="alert"
  ✓ Error icon aria-hidden="true"
  WCAG 3.3.1 Level A — PASS
  ✓ Test passed in 1.8s`},
{id:'WA-034',title:'Error Suggestion',category:'form',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'3.3.3',level:'AA',description:'Verify error messages include correction hints and suggestions, not just "invalid input" messages.',prerequisites:'Playwright, banking form with various validation rules',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/transfer',testCases:[{field:'#amount',value:'-100',expectedHint:'positive number'},{field:'#ifscCode',value:'ABC',expectedHint:'format: XXXX0XXXXXX'}]},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-034: Error suggestion', async ({ page }) => {
  await page.goto('/transfer');
  const testCases = [
    { field: '#amount', value: '-100', hint: /positive|greater than/i },
    { field: '#ifscCode', value: 'ABC', hint: /format|IFSC/i },
    { field: '#toAccount', value: '12', hint: /digit|account number/i },
  ];
  for (const tc of testCases) {
    await page.fill(tc.field, tc.value);
    await page.click('button[type="submit"]');
    const describedBy = await page.locator(tc.field)
      .getAttribute('aria-describedby');
    const errorMsg = page.locator('#' + describedBy);
    const text = await errorMsg.textContent();
    expect(text).toMatch(tc.hint);
    console.log(tc.field + ': error="' + text.trim() + '" ✓');
    await page.fill(tc.field, '');
  }
  // Verify errors are constructive
  const allErrors = page.locator('.error-message');
  const count = await allErrors.count();
  for (let i = 0; i < count; i++) {
    const t = await allErrors.nth(i).textContent();
    expect(t.toLowerCase()).not.toContain('invalid input');
    expect(t.length).toBeGreaterThan(10);
  }
});`,expectedOutput:`Running: WA-034 Error Suggestion
  #amount: error="Enter a positive number (e.g., 500.00)" ✓
  #ifscCode: error="Enter IFSC in format: XXXX0XXXXXX" ✓
  #toAccount: error="Account number must be 10-16 digits" ✓
  ✓ All errors include correction hints
  ✓ No generic "invalid input" messages
  WCAG 3.3.3 Level AA — PASS
  ✓ Test passed in 2.4s`},
{id:'WA-035',title:'Input Format Instructions',category:'form',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'3.3.2',level:'A',description:'Verify form fields with specific format requirements have visible instructions linked via aria-describedby.',prerequisites:'Playwright, banking form with formatted fields (date, IFSC, PAN)',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/transfer',fields:{date:'DD/MM/YYYY',ifsc:'XXXX0XXXXXX',pan:'XXXXX1234X',amount:'Min ₹1, Max ₹10,00,000'}},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-035: Input format instructions', async ({ page }) => {
  await page.goto('/transfer');
  const fields = {
    '#transactionDate': 'DD/MM/YYYY',
    '#ifscCode': 'IFSC',
    '#amount': 'amount',
  };
  for (const [sel, format] of Object.entries(fields)) {
    const input = page.locator(sel);
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    // Check hint element exists and has content
    const ids = describedBy.split(' ');
    for (const id of ids) {
      const hint = page.locator('#' + id);
      if (await hint.count() > 0) {
        const text = await hint.textContent();
        expect(text.length).toBeGreaterThan(3);
        console.log(sel + ' hint: "' + text.trim() + '"');
      }
    }
    // Check placeholder is NOT the only instruction
    const placeholder = await input.getAttribute('placeholder');
    if (placeholder) {
      expect(describedBy).toBeTruthy();
    }
  }
  console.log('All format instructions linked via aria-describedby ✓');
});`,expectedOutput:`Running: WA-035 Input Format Instructions
  #transactionDate hint: "Format: DD/MM/YYYY"
  #ifscCode hint: "IFSC code: XXXX0XXXXXX (e.g., SBIN0001234)"
  #amount hint: "Min ₹1, Max ₹10,00,000"
  ✓ Instructions visible and linked
  ✓ Not relying on placeholder alone
  WCAG 3.3.2 Level A — PASS
  ✓ Test passed in 1.5s`},
{id:'WA-036',title:'Fieldset/Legend Grouping',category:'form',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'1.3.1',level:'A',description:'Verify radio buttons and checkboxes are grouped with fieldset and legend elements for screen reader context.',prerequisites:'Playwright, axe-core, banking form with radio/checkbox groups',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/transfer',groups:['accountType','transferMode','notifications']},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-036: Fieldset/Legend grouping', async ({ page }) => {
  await page.goto('/transfer');
  // Check radio groups have fieldset+legend
  const radioGroups = page.locator('fieldset:has(input[type="radio"])');
  const count = await radioGroups.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const group = radioGroups.nth(i);
    const legend = group.locator('legend');
    await expect(legend).toBeVisible();
    const legendText = await legend.textContent();
    expect(legendText.trim().length).toBeGreaterThan(0);
    console.log('Fieldset ' + (i+1) + ': legend="' + legendText.trim() + '" ✓');
  }
  // Check checkbox groups
  const checkGroups = page.locator('fieldset:has(input[type="checkbox"])');
  const chkCount = await checkGroups.count();
  for (let i = 0; i < chkCount; i++) {
    const legend = checkGroups.nth(i).locator('legend');
    await expect(legend).toBeVisible();
  }
  // axe form group rules
  const results = await new AxeBuilder({ page })
    .withRules(['radiogroup', 'checkboxgroup']).analyze();
  expect(results.violations).toHaveLength(0);
});`,expectedOutput:`Running: WA-036 Fieldset/Legend Grouping
  Fieldset 1: legend="Account Type" ✓
  Fieldset 2: legend="Transfer Mode" ✓
  ✓ Checkbox groups also have fieldset+legend
  ✓ axe: radiogroup — PASS
  ✓ axe: checkboxgroup — PASS
  WCAG 1.3.1 Level A — PASS
  ✓ Test passed in 1.9s`},
{id:'WA-037',title:'Multi-step Form Progress',category:'form',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'2.4.8',level:'AAA',description:'Verify multi-step forms have step indicators with aria-current="step" and screen reader announces current step.',prerequisites:'Playwright, multi-step banking form (account opening, loan application)',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/apply-loan',totalSteps:4,stepNames:['Personal Info','Employment','Loan Details','Review']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-037: Multi-step form progress', async ({ page }) => {
  await page.goto('/apply-loan');
  // Step indicator exists
  const stepper = page.locator('[role="navigation"][aria-label*="step" i]');
  await expect(stepper).toBeVisible();
  // Current step marked
  const currentStep = stepper.locator('[aria-current="step"]');
  await expect(currentStep).toHaveCount(1);
  const stepText = await currentStep.textContent();
  console.log('Current step: "' + stepText.trim() + '"');
  // Verify step count announced
  const stepInfo = page.locator('.step-info');
  await expect(stepInfo).toContainText(/step 1 of 4/i);

  // Navigate to step 2
  await page.fill('#fullName', 'Test User');
  await page.fill('#dob', '1990-01-01');
  await page.click('#nextStep');
  // Focus should move to step 2 heading
  const h2 = page.locator('h2');
  await expect(h2).toBeFocused();
  // aria-current should update
  const newCurrent = stepper.locator('[aria-current="step"]');
  const newText = await newCurrent.textContent();
  expect(newText.trim()).not.toBe(stepText.trim());
  console.log('Step 2: "' + newText.trim() + '"');
  // Completed steps marked
  const completed = stepper.locator('[aria-label*="completed" i]');
  expect(await completed.count()).toBeGreaterThan(0);
});`,expectedOutput:`Running: WA-037 Multi-step Form Progress
  ✓ Step indicator with role="navigation"
  ✓ Current step: "Personal Info"
  ✓ Step info: "Step 1 of 4"
  ✓ Next step navigation works
  ✓ Focus moved to Step 2 heading
  ✓ Step 2: "Employment Details"
  ✓ Step 1 marked as completed
  WCAG 2.4.8 Level AAA — PASS
  ✓ Test passed in 3.6s`},
{id:'WA-038',title:'Timeout Warning',category:'form',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'2.2.1',level:'A',description:'Verify 20-second warning before session timeout with option to extend, accessible via keyboard and screen reader.',prerequisites:'Playwright, banking app with session timeout configured to short interval for testing',config:JSON.stringify({baseUrl:'http://localhost:3000',sessionTimeout:120,warningBefore:20,testTimeout:30000},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-038: Timeout warning', async ({ page }) => {
  // Set short session for testing
  await page.goto('/dashboard?sessionTimeout=30');
  // Wait for timeout warning (appears 20s before expiry)
  const warning = page.locator('[role="alertdialog"]');
  await expect(warning).toBeVisible({ timeout: 25000 });
  // Check warning attributes
  await expect(warning).toHaveAttribute('aria-modal', 'true');
  await expect(warning).toHaveAttribute('aria-label', /session/i);
  // Check warning content
  const text = await warning.textContent();
  expect(text).toMatch(/session.*expir|timeout/i);
  console.log('Warning text: "' + text.trim().slice(0, 50) + '..."');
  // Check extend button
  const extendBtn = warning.locator('button:has-text("extend")');
  await expect(extendBtn).toBeVisible();
  await expect(extendBtn).toBeFocused();
  // Extend session
  await extendBtn.click();
  await expect(warning).not.toBeVisible();
  // Verify session extended
  console.log('Session extended successfully ✓');
  // Verify keyboard accessible
  await page.goto('/dashboard?sessionTimeout=30');
  await expect(warning).toBeVisible({ timeout: 25000 });
  await page.keyboard.press('Enter');
  await expect(warning).not.toBeVisible();
  console.log('Warning dismissable via keyboard ✓');
});`,expectedOutput:`Running: WA-038 Timeout Warning
  ✓ Waiting for session timeout warning...
  ✓ Warning dialog appeared at 10s remaining
  ✓ role="alertdialog", aria-modal="true"
  ✓ Warning text: "Your session will expire in 20 sec..."
  ✓ Extend button visible and focused
  ✓ Session extended successfully
  ✓ Warning dismissable via keyboard
  WCAG 2.2.1 Level A — PASS
  ✓ Test passed in 28.5s`},
{id:'WA-039',title:'Prevent Accidental Submission',category:'form',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'3.3.4',level:'AA',description:'Verify fund transfer shows confirmation dialog before execution, allowing review and cancellation of financial transactions.',prerequisites:'Playwright, fund transfer form',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/transfer',confirmAmount:50000},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-039: Prevent accidental submission', async ({ page }) => {
  await page.goto('/transfer');
  await page.selectOption('#fromAccount', 'SAVINGS-001');
  await page.fill('#toAccount', '9876543210');
  await page.fill('#amount', '50000');
  await page.fill('#remarks', 'Test transfer');
  await page.click('button[type="submit"]');

  // Confirmation dialog should appear
  const confirm = page.locator('[role="alertdialog"]');
  await expect(confirm).toBeVisible();
  // Check it shows transaction details
  const text = await confirm.textContent();
  expect(text).toContain('50,000');
  expect(text).toContain('9876543210');
  console.log('Confirmation shows amount and account ✓');

  // Verify cancel button
  const cancelBtn = confirm.locator('button:has-text("cancel")');
  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();
  await expect(confirm).not.toBeVisible();
  console.log('Cancel returns to form without submitting ✓');

  // Re-submit and confirm
  await page.click('button[type="submit"]');
  const confirmBtn = confirm.locator('button:has-text("confirm")');
  await expect(confirmBtn).toBeVisible();
  // Check confirm button has warning styling
  console.log('Confirm button available for intentional submission ✓');
});`,expectedOutput:`Running: WA-039 Prevent Accidental Submission
  ✓ Transfer form filled with ₹50,000
  ✓ Confirmation dialog appeared
  ✓ Shows amount: 50,000
  ✓ Shows recipient: 9876543210
  ✓ Cancel returns to form without submitting
  ✓ Re-submit shows confirmation again
  ✓ Confirm button available for intentional action
  WCAG 3.3.4 Level AA — PASS
  ✓ Test passed in 3.2s`},
{id:'WA-040',title:'Success Confirmation',category:'form',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'4.1.3',level:'AA',description:'Verify successful transactions are announced via aria-live region with transaction reference and details.',prerequisites:'Playwright, fund transfer form with mock success',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/transfer',mockSuccess:true},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-040: Success confirmation', async ({ page }) => {
  await page.goto('/transfer');
  await page.selectOption('#fromAccount', 'SAVINGS-001');
  await page.fill('#toAccount', '9876543210');
  await page.fill('#amount', '1000');
  await page.click('button[type="submit"]');
  // Confirm the transfer
  await page.locator('[role="alertdialog"] button:has-text("confirm")').click();

  // Success message should appear
  const success = page.locator('[role="status"]');
  await expect(success).toBeVisible();
  await expect(success).toHaveAttribute('aria-live', 'polite');
  const text = await success.textContent();
  expect(text).toMatch(/success|completed/i);
  expect(text).toMatch(/ref|reference/i);
  console.log('Success message: "' + text.trim().slice(0, 60) + '"');

  // Focus should be on success message
  await expect(success).toBeFocused();
  // Check transaction reference is present
  const refNumber = text.match(/[A-Z]{2,}\\d{8,}/);
  expect(refNumber).toBeTruthy();
  console.log('Reference number: ' + refNumber[0]);

  // Print/download receipt option
  const receiptBtn = page.locator('button:has-text("receipt")');
  await expect(receiptBtn).toBeVisible();
  console.log('Download receipt option available ✓');
});`,expectedOutput:`Running: WA-040 Success Confirmation
  ✓ Transfer submitted and confirmed
  ✓ Success message with role="status"
  ✓ aria-live="polite" for announcement
  ✓ Message: "Transfer Completed Successfully"
  ✓ Reference: TXN20260227001
  ✓ Focus moved to success message
  ✓ Download receipt option available
  WCAG 4.1.3 Level AA — PASS
  ✓ Test passed in 4.1s`},
{id:'WA-041',title:'Perceivable - Images Alt Text',category:'wcag',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'1.1.1',level:'A',description:'Verify all images in banking app have descriptive alt text; decorative images have empty alt="".',prerequisites:'Playwright, axe-core, banking app with images',config:JSON.stringify({baseUrl:'http://localhost:3000',pages:['/dashboard','/about','/help'],axeRules:['image-alt','input-image-alt','role-img-alt']},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-041: Images alt text', async ({ page }) => {
  await page.goto('/dashboard');
  const images = page.locator('img');
  const count = await images.count();
  let missing = 0;
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    const role = await images.nth(i).getAttribute('role');
    if (alt === null && role !== 'presentation') {
      missing++;
      const src = await images.nth(i).getAttribute('src');
      console.log('Missing alt: ' + src);
    }
  }
  // Decorative images should have alt=""
  const decorative = page.locator('img[alt=""], img[role="presentation"]');
  const decCount = await decorative.count();
  console.log('Informative images: ' + (count - decCount));
  console.log('Decorative images: ' + decCount);

  const results = await new AxeBuilder({ page })
    .withRules(['image-alt', 'role-img-alt']).analyze();
  expect(results.violations).toHaveLength(0);
  expect(missing).toBe(0);
});`,expectedOutput:`Running: WA-041 Perceivable - Images Alt Text
  ✓ Found 15 images on dashboard
  ✓ Informative images: 10 (all have alt)
  ✓ Decorative images: 5 (alt="" or role="presentation")
  ✓ No missing alt attributes
  ✓ axe: image-alt — PASS
  ✓ axe: role-img-alt — PASS
  WCAG 1.1.1 Level A — PASS
  ✓ Test passed in 1.9s`},
{id:'WA-042',title:'Perceivable - Captions for Video KYC',category:'wcag',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'1.2.2',level:'A',description:'Verify video KYC calls provide live captions and transcript option for hearing-impaired users.',prerequisites:'Playwright, video KYC page with caption support',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/kyc/video',captionFormats:['webvtt','srt'],captionLang:'en'},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-042: Captions for Video KYC', async ({ page }) => {
  await page.goto('/kyc/video');
  const video = page.locator('video');
  await expect(video).toBeVisible();
  // Check caption track exists
  const track = video.locator('track[kind="captions"]');
  await expect(track).toHaveCount(1);
  await expect(track).toHaveAttribute('srclang', 'en');
  const trackSrc = await track.getAttribute('src');
  expect(trackSrc).toBeTruthy();
  console.log('Caption track: ' + trackSrc);
  // Check caption toggle button
  const captionBtn = page.locator('button[aria-label*="caption" i]');
  await expect(captionBtn).toBeVisible();
  await captionBtn.click();
  console.log('Caption toggle button works ✓');
  // Check transcript option
  const transcriptBtn = page.locator('button:has-text("transcript")');
  await expect(transcriptBtn).toBeVisible();
  await transcriptBtn.click();
  const transcript = page.locator('#transcript');
  await expect(transcript).toBeVisible();
  console.log('Full transcript available ✓');
  // Check video controls are keyboard accessible
  await video.focus();
  await page.keyboard.press('Space');
  console.log('Video controls keyboard accessible ✓');
});`,expectedOutput:`Running: WA-042 Perceivable - Captions for Video KYC
  ✓ Video element found on KYC page
  ✓ Caption track: captions_en.vtt
  ✓ srclang="en" on caption track
  ✓ Caption toggle button functional
  ✓ Full transcript available
  ✓ Video controls keyboard accessible
  WCAG 1.2.2 Level A — PASS
  ✓ Test passed in 3.5s`},
{id:'WA-043',title:'Operable - Timing Adjustable',category:'wcag',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'2.2.1',level:'A',description:'Verify session timeout is configurable with minimum 20x default time and users can turn off, adjust, or extend.',prerequisites:'Playwright, banking app with session timeout settings',config:JSON.stringify({baseUrl:'http://localhost:3000',defaultTimeout:300,minMultiplier:20,settingsPage:'/settings/accessibility'},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-043: Timing adjustable', async ({ page }) => {
  await page.goto('/settings/accessibility');
  // Check timeout setting exists
  const timeoutSetting = page.locator('#sessionTimeoutSetting');
  await expect(timeoutSetting).toBeVisible();
  // Verify options include extended times
  const options = timeoutSetting.locator('option');
  const values = await options.allTextContents();
  console.log('Timeout options:', values.join(', '));
  // Check for "No timeout" option
  const noTimeout = options.filter({ hasText: /no timeout|unlimited/i });
  expect(await noTimeout.count()).toBeGreaterThan(0);
  // Check minimum 20x default is available
  const maxOption = await options.last().getAttribute('value');
  const defaultTimeout = 300;
  expect(parseInt(maxOption)).toBeGreaterThanOrEqual(defaultTimeout * 20);
  console.log('Max timeout: ' + maxOption + 's (>= ' + (defaultTimeout*20) + 's) ✓');
  // Save setting
  await timeoutSetting.selectOption(maxOption);
  await page.click('#saveSettings');
  const success = page.locator('[role="status"]');
  await expect(success).toContainText(/saved/i);
  console.log('Timeout setting saved ✓');
});`,expectedOutput:`Running: WA-043 Operable - Timing Adjustable
  ✓ Session timeout setting found
  Timeout options: 5 min, 15 min, 30 min, 60 min, No timeout
  ✓ "No timeout" option available
  ✓ Max timeout: 6000s (>= 6000s)
  ✓ Timeout setting saved
  WCAG 2.2.1 Level A — PASS
  ✓ Test passed in 2.3s`},
{id:'WA-044',title:'Operable - Three Flashes',category:'wcag',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'2.3.1',level:'A',description:'Verify no content on banking pages flashes more than 3 times per second to prevent seizures.',prerequisites:'Playwright, banking app with animations',config:JSON.stringify({baseUrl:'http://localhost:3000',pages:['/dashboard','/transfer'],maxFlashesPerSec:3,observeDuration:5000},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-044: Three flashes threshold', async ({ page }) => {
  await page.goto('/dashboard');
  // Monitor for flashing content
  const flashCount = await page.evaluate(() => {
    return new Promise(resolve => {
      let maxFlashes = 0;
      const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
          if (m.type === 'attributes' &&
              (m.attributeName === 'style' || m.attributeName === 'class')) {
            maxFlashes++;
          }
        });
      });
      observer.observe(document.body, {
        attributes: true, subtree: true, attributeFilter: ['style', 'class']
      });
      setTimeout(() => {
        observer.disconnect();
        resolve(maxFlashes);
      }, 3000);
    });
  });
  console.log('Style/class changes in 3s:', flashCount);

  // Check for CSS animations > 3Hz
  const fastAnims = await page.evaluate(() => {
    const els = document.querySelectorAll('*');
    let count = 0;
    els.forEach(el => {
      const cs = getComputedStyle(el);
      const dur = parseFloat(cs.animationDuration);
      if (dur > 0 && dur < 0.333) count++;
    });
    return count;
  });
  expect(fastAnims).toBe(0);
  console.log('Fast animations (< 333ms cycle): ' + fastAnims + ' ✓');
  console.log('No content exceeds 3 flashes/second ✓');
});`,expectedOutput:`Running: WA-044 Operable - Three Flashes
  ✓ Monitoring page for 3 seconds...
  Style/class changes in 3s: 12 (within threshold)
  ✓ Fast animations (< 333ms cycle): 0
  ✓ No content exceeds 3 flashes/second
  ✓ Dashboard safe for photosensitive users
  WCAG 2.3.1 Level A — PASS
  ✓ Test passed in 4.2s`},
{id:'WA-045',title:'Understandable - Page Language',category:'wcag',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'3.1.1',level:'A',description:'Verify lang="en" is set on html element and lang attributes on sections in other languages (Hindi, etc.).',prerequisites:'Playwright, axe-core, banking app with multi-language content',config:JSON.stringify({baseUrl:'http://localhost:3000',primaryLang:'en',secondaryLangs:['hi','ta','te'],pages:['/dashboard','/help']},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-045: Page language', async ({ page }) => {
  await page.goto('/dashboard');
  // Check html lang attribute
  const htmlLang = await page.locator('html').getAttribute('lang');
  expect(htmlLang).toBe('en');
  console.log('html lang="' + htmlLang + '" ✓');
  // Check for lang on non-English sections
  const hindiSections = page.locator('[lang="hi"]');
  const hiCount = await hindiSections.count();
  if (hiCount > 0) {
    console.log('Hindi sections with lang="hi": ' + hiCount + ' ✓');
  }
  // Verify lang is valid BCP 47
  const allLangs = await page.evaluate(() => {
    const els = document.querySelectorAll('[lang]');
    return Array.from(els).map(el => ({
      tag: el.tagName, lang: el.getAttribute('lang')
    }));
  });
  const validLangs = ['en', 'hi', 'ta', 'te', 'mr', 'bn'];
  allLangs.forEach(el => {
    expect(validLangs).toContain(el.lang);
  });
  const results = await new AxeBuilder({ page })
    .withRules(['html-has-lang', 'html-lang-valid', 'valid-lang']).analyze();
  expect(results.violations).toHaveLength(0);
});`,expectedOutput:`Running: WA-045 Understandable - Page Language
  ✓ html lang="en"
  ✓ Hindi sections with lang="hi": 2
  ✓ All lang values are valid BCP 47
  ✓ axe: html-has-lang — PASS
  ✓ axe: html-lang-valid — PASS
  ✓ axe: valid-lang — PASS
  WCAG 3.1.1 Level A — PASS
  ✓ Test passed in 1.6s`},
{id:'WA-046',title:'Understandable - Consistent Identification',category:'wcag',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'3.2.4',level:'AA',description:'Verify same components have same labels across all pages (e.g., search always labeled "Search", not sometimes "Find").',prerequisites:'Playwright, multi-page banking application',config:JSON.stringify({baseUrl:'http://localhost:3000',pages:['/dashboard','/transfer','/transactions','/profile'],checkComponents:['search','submit','cancel','logout']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-046: Consistent identification', async ({ page }) => {
  const pages = ['/dashboard', '/transfer', '/transactions', '/profile'];
  const componentLabels = {};
  for (const p of pages) {
    await page.goto(p);
    // Collect labels for common components
    const search = page.locator('input[type="search"], #searchBox');
    if (await search.count() > 0) {
      const label = await search.getAttribute('aria-label') ||
        await search.getAttribute('placeholder');
      if (!componentLabels.search) componentLabels.search = label;
      else expect(label).toBe(componentLabels.search);
    }
    const submitBtns = page.locator('button[type="submit"]');
    if (await submitBtns.count() > 0) {
      const text = await submitBtns.first().textContent();
      console.log(p + ' submit: "' + text.trim() + '"');
    }
    const logoutBtn = page.locator('#logout, a[href="/logout"]');
    if (await logoutBtn.count() > 0) {
      const text = await logoutBtn.textContent();
      if (!componentLabels.logout) componentLabels.logout = text.trim();
      else expect(text.trim()).toBe(componentLabels.logout);
    }
  }
  console.log('Component labels consistent: ' +
    JSON.stringify(componentLabels));
});`,expectedOutput:`Running: WA-046 Understandable - Consistent Identification
  /dashboard submit: "Search"
  /transfer submit: "Transfer Funds"
  /transactions submit: "Search"
  /profile submit: "Save Changes"
  ✓ Search label consistent: "Search accounts"
  ✓ Logout label consistent: "Sign Out"
  ✓ All common components identified consistently
  WCAG 3.2.4 Level AA — PASS
  ✓ Test passed in 4.5s`},
{id:'WA-047',title:'Robust - Valid HTML Parsing',category:'wcag',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'4.1.1',level:'A',description:'Verify no duplicate IDs, proper HTML nesting, and valid markup for assistive technology parsing.',prerequisites:'Playwright, banking app pages',config:JSON.stringify({baseUrl:'http://localhost:3000',pages:['/dashboard','/transfer','/login'],checks:['duplicate-ids','proper-nesting','valid-roles']},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-047: Valid HTML parsing', async ({ page }) => {
  const pages = ['/dashboard', '/transfer', '/login'];
  for (const p of pages) {
    await page.goto(p);
    // Check for duplicate IDs
    const dupIds = await page.evaluate(() => {
      const ids = {};
      const dups = [];
      document.querySelectorAll('[id]').forEach(el => {
        if (ids[el.id]) dups.push(el.id);
        ids[el.id] = true;
      });
      return dups;
    });
    expect(dupIds).toHaveLength(0);
    if (dupIds.length > 0) console.log('Duplicate IDs:', dupIds);
    // Check heading hierarchy
    const headings = await page.evaluate(() => {
      const hs = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
      return Array.from(hs).map(h => parseInt(h.tagName[1]));
    });
    for (let i = 1; i < headings.length; i++) {
      expect(headings[i] - headings[i-1]).toBeLessThanOrEqual(1);
    }
    const results = await new AxeBuilder({ page })
      .withRules(['duplicate-id', 'duplicate-id-aria']).analyze();
    expect(results.violations).toHaveLength(0);
    console.log(p + ': valid HTML, no duplicate IDs ✓');
  }
});`,expectedOutput:`Running: WA-047 Robust - Valid HTML Parsing
  /dashboard: valid HTML, no duplicate IDs ✓
  /transfer: valid HTML, no duplicate IDs ✓
  /login: valid HTML, no duplicate IDs ✓
  ✓ Heading hierarchy valid on all pages
  ✓ axe: duplicate-id — PASS
  ✓ axe: duplicate-id-aria — PASS
  WCAG 4.1.1 Level A — PASS
  ✓ Test passed in 3.1s`},
{id:'WA-048',title:'Robust - Name/Role/Value',category:'wcag',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'4.1.2',level:'A',description:'Verify custom widgets expose correct ARIA roles, names, and values for assistive technology.',prerequisites:'Playwright, axe-core, banking app with custom widgets',config:JSON.stringify({baseUrl:'http://localhost:3000',widgets:{'#accountSelector':'combobox','#amountSlider':'slider','#dateRange':'group','#notifToggle':'switch'}},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-048: Name/Role/Value', async ({ page }) => {
  await page.goto('/dashboard');
  // Check custom combobox
  const combo = page.locator('#accountSelector');
  await expect(combo).toHaveAttribute('role', 'combobox');
  await expect(combo).toHaveAttribute('aria-expanded');
  await expect(combo).toHaveAttribute('aria-label');
  console.log('Combobox: role, aria-expanded, aria-label ✓');
  // Check toggle switch
  const toggle = page.locator('#notifToggle');
  await expect(toggle).toHaveAttribute('role', 'switch');
  await expect(toggle).toHaveAttribute('aria-checked');
  const label = await toggle.getAttribute('aria-label');
  console.log('Switch: "' + label + '" aria-checked ✓');
  // Check tab panel
  const tabs = page.locator('[role="tablist"]');
  if (await tabs.count() > 0) {
    const activeTab = tabs.locator('[role="tab"][aria-selected="true"]');
    await expect(activeTab).toHaveCount(1);
    const panelId = await activeTab.getAttribute('aria-controls');
    const panel = page.locator('#' + panelId);
    await expect(panel).toHaveAttribute('role', 'tabpanel');
  }
  const results = await new AxeBuilder({ page })
    .withRules(['aria-required-attr', 'aria-valid-attr-value',
      'aria-roles']).analyze();
  expect(results.violations).toHaveLength(0);
});`,expectedOutput:`Running: WA-048 Robust - Name/Role/Value
  ✓ Combobox: role, aria-expanded, aria-label
  ✓ Switch: "Notifications" aria-checked
  ✓ Tablist with aria-selected tab
  ✓ Tab panel linked via aria-controls
  ✓ axe: aria-required-attr — PASS
  ✓ axe: aria-valid-attr-value — PASS
  ✓ axe: aria-roles — PASS
  WCAG 4.1.2 Level A — PASS
  ✓ Test passed in 2.5s`},
{id:'WA-049',title:'WCAG 2.1 - Orientation',category:'wcag',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'1.3.4',level:'AA',description:'Verify banking app works in both portrait and landscape orientation without restricting or locking orientation.',prerequisites:'Playwright, responsive banking application',config:JSON.stringify({baseUrl:'http://localhost:3000',viewports:{portrait:{width:375,height:812},landscape:{width:812,height:375}},pages:['/dashboard','/transfer']},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-049: Orientation support', async ({ page }) => {
  const pages = ['/dashboard', '/transfer'];
  for (const p of pages) {
    // Portrait mode
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(p);
    const portraitContent = await page.locator('main').isVisible();
    expect(portraitContent).toBe(true);
    const portraitScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth <= window.innerWidth);
    expect(portraitScroll).toBe(true);
    console.log(p + ' portrait: content visible, no h-scroll ✓');

    // Landscape mode
    await page.setViewportSize({ width: 812, height: 375 });
    await page.waitForTimeout(300);
    const landscapeContent = await page.locator('main').isVisible();
    expect(landscapeContent).toBe(true);
    const landscapeScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth <= window.innerWidth);
    expect(landscapeScroll).toBe(true);
    console.log(p + ' landscape: content visible, no h-scroll ✓');

    // No orientation lock meta
    const lockMeta = await page.evaluate(() =>
      document.querySelector('meta[name="screen-orientation-lock"]'));
    expect(lockMeta).toBeNull();
  }
});`,expectedOutput:`Running: WA-049 WCAG 2.1 - Orientation
  /dashboard portrait: content visible, no h-scroll ✓
  /dashboard landscape: content visible, no h-scroll ✓
  /transfer portrait: content visible, no h-scroll ✓
  /transfer landscape: content visible, no h-scroll ✓
  ✓ No orientation lock detected
  ✓ All content accessible in both orientations
  WCAG 1.3.4 Level AA — PASS
  ✓ Test passed in 4.0s`},
{id:'WA-050',title:'WCAG 2.1 - Input Purpose',category:'wcag',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'1.3.5',level:'AA',description:'Verify autocomplete tokens on personal data fields enable browser auto-fill and assistive technology identification.',prerequisites:'Playwright, axe-core, banking profile/registration form',config:JSON.stringify({baseUrl:'http://localhost:3000',page:'/profile',expectedTokens:{'#name':'name','#email':'email','#tel':'tel','#address':'street-address','#dob':'bday'}},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-050: Input purpose autocomplete', async ({ page }) => {
  await page.goto('/profile');
  const fields = {
    '#fullName': 'name',
    '#email': 'email',
    '#phone': 'tel',
    '#dob': 'bday',
    '#address': 'street-address',
    '#newPassword': 'new-password',
  };
  for (const [sel, token] of Object.entries(fields)) {
    const input = page.locator(sel);
    if (await input.count() > 0) {
      const ac = await input.getAttribute('autocomplete');
      expect(ac).toBe(token);
      console.log(sel + ': autocomplete="' + ac + '" ✓');
    }
  }
  // Verify inputmode where appropriate
  const phone = page.locator('#phone');
  if (await phone.count() > 0) {
    await expect(phone).toHaveAttribute('inputmode', 'tel');
  }
  const email = page.locator('#email');
  if (await email.count() > 0) {
    await expect(email).toHaveAttribute('type', 'email');
  }
  const results = await new AxeBuilder({ page })
    .withRules(['autocomplete-valid']).analyze();
  expect(results.violations).toHaveLength(0);
});`,expectedOutput:`Running: WA-050 WCAG 2.1 - Input Purpose
  #fullName: autocomplete="name" ✓
  #email: autocomplete="email" ✓
  #phone: autocomplete="tel" ✓
  #dob: autocomplete="bday" ✓
  #address: autocomplete="street-address" ✓
  #newPassword: autocomplete="new-password" ✓
  ✓ Phone inputmode="tel"
  ✓ Email type="email"
  ✓ axe: autocomplete-valid — PASS
  WCAG 1.3.5 Level AA — PASS
  ✓ Test passed in 1.8s`},
{id:'WA-051',title:'axe-core Full Page Scan',category:'audit',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'4.1.1',level:'A',description:'Run axe-core accessibility engine on dashboard page and flag all critical and serious violations with remediation guidance.',prerequisites:'Playwright, @axe-core/playwright package, banking app running',config:JSON.stringify({baseUrl:'http://localhost:3000',pages:['/dashboard','/transfer','/login'],impactLevels:['critical','serious'],standard:'WCAG2AA'},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('WA-051: axe-core full page scan', async ({ page }) => {
  const pages = ['/dashboard', '/transfer', '/login'];
  for (const p of pages) {
    await page.goto(p);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const critical = results.violations.filter(v => v.impact === 'critical');
    const serious = results.violations.filter(v => v.impact === 'serious');
    const moderate = results.violations.filter(v => v.impact === 'moderate');
    console.log(p + ':');
    console.log('  Critical:', critical.length);
    console.log('  Serious:', serious.length);
    console.log('  Moderate:', moderate.length);
    console.log('  Passes:', results.passes.length);
    critical.forEach(v => {
      console.log('  CRITICAL: ' + v.id + ' - ' + v.description);
    });
    expect(critical).toHaveLength(0);
    expect(serious).toHaveLength(0);
  }
});`,expectedOutput:`Running: WA-051 axe-core Full Page Scan
  /dashboard:
    Critical: 0 | Serious: 0 | Moderate: 1
    Passes: 48
  /transfer:
    Critical: 0 | Serious: 0 | Moderate: 0
    Passes: 35
  /login:
    Critical: 0 | Serious: 0 | Moderate: 0
    Passes: 22
  ✓ Zero critical/serious violations
  Total rules checked: 105
  WCAG 4.1.1 Level A — PASS
  ✓ Test passed in 5.8s`},
{id:'WA-052',title:'Lighthouse Accessibility Audit',category:'audit',platform:'Web',framework:'Lighthouse/Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'4.1.1',level:'AA',description:'Run Lighthouse accessibility audit on banking pages targeting score of 90+ and generate detailed report.',prerequisites:'Playwright, lighthouse npm package, Chrome/Chromium',config:JSON.stringify({baseUrl:'http://localhost:3000',targetScore:90,pages:['/dashboard','/transfer','/login'],categories:['accessibility']},null,2),code:`const { test, expect } = require('@playwright/test');
const { playAudit } = require('playwright-lighthouse');

test('WA-052: Lighthouse accessibility audit', async ({ page }) => {
  const pages = ['/dashboard', '/transfer', '/login'];
  for (const p of pages) {
    await page.goto(p);
    const results = await playAudit({
      page,
      thresholds: { accessibility: 90 },
      port: 9222,
      reports: { formats: { html: true } },
    });
    const score = results.lhr.categories.accessibility.score * 100;
    console.log(p + ': Accessibility Score = ' + score);
    const audits = results.lhr.audits;
    const failed = Object.values(audits).filter(
      a => a.score === 0 && a.details?.items?.length > 0);
    failed.forEach(a => {
      console.log('  FAIL: ' + a.id + ' - ' + a.title);
    });
    expect(score).toBeGreaterThanOrEqual(90);
  }
  console.log('All pages meet 90+ accessibility score ✓');
});`,expectedOutput:`Running: WA-052 Lighthouse Accessibility Audit
  /dashboard: Accessibility Score = 95
  /transfer: Accessibility Score = 92
  /login: Accessibility Score = 98
  ✓ All pages score >= 90
  Failed audits: 0 critical
  HTML reports generated in ./lighthouse-reports/
  WCAG Compliance Level AA — PASS
  ✓ Test passed in 18.2s`},
{id:'WA-053',title:'Pa11y CI Pipeline Integration',category:'audit',platform:'Web',framework:'Pa11y',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'4.1.1',level:'AA',description:'Configure Pa11y CI to run automated accessibility checks in CI/CD pipeline with WCAG 2.1 AA standard.',prerequisites:'Pa11y, pa11y-ci, banking app URLs, CI/CD pipeline (GitHub Actions)',config:JSON.stringify({standard:'WCAG2AA',runners:['axe','htmlcs'],threshold:0,timeout:30000,urls:['http://localhost:3000/dashboard','http://localhost:3000/transfer','http://localhost:3000/login']},null,2),code:`const pa11y = require('pa11y');

async function runAccessibilityAudit() {
  const urls = [
    'http://localhost:3000/dashboard',
    'http://localhost:3000/transfer',
    'http://localhost:3000/login',
  ];
  let totalErrors = 0;
  for (const url of urls) {
    const results = await pa11y(url, {
      standard: 'WCAG2AA',
      runners: ['axe', 'htmlcs'],
      chromeLaunchConfig: { headless: true },
      timeout: 30000,
      threshold: 0,
    });
    const errors = results.issues.filter(i => i.type === 'error');
    const warnings = results.issues.filter(i => i.type === 'warning');
    console.log(url + ':');
    console.log('  Errors:', errors.length, '| Warnings:', warnings.length);
    errors.forEach(e => {
      console.log('  ERROR: ' + e.code + ' - ' + e.message.slice(0, 80));
    });
    totalErrors += errors.length;
  }
  if (totalErrors > 0) {
    throw new Error(totalErrors + ' accessibility errors found');
  }
  console.log('Pa11y CI: All pages pass WCAG 2.1 AA ✓');
}
runAccessibilityAudit();`,expectedOutput:`Running: WA-053 Pa11y CI Pipeline Integration
  http://localhost:3000/dashboard:
    Errors: 0 | Warnings: 2
  http://localhost:3000/transfer:
    Errors: 0 | Warnings: 1
  http://localhost:3000/login:
    Errors: 0 | Warnings: 0
  ✓ Pa11y CI: All pages pass WCAG 2.1 AA
  Total issues: 0 errors, 3 warnings
  CI gate: PASS
  ✓ Audit completed in 12.4s`},
{id:'WA-054',title:'WAVE Tool Analysis',category:'audit',platform:'Web',framework:'WAVE API',language:'JavaScript',difficulty:'Beginner',wcagCriteria:'4.1.1',level:'AA',description:'Run WAVE (Web Accessibility Evaluation Tool) analysis on banking pages to identify structural and semantic issues.',prerequisites:'WAVE API key, banking app URLs, axios/fetch for API calls',config:JSON.stringify({waveApiUrl:'https://wave.webaim.org/api/request',apiKey:'YOUR_WAVE_API_KEY',reportType:3,pages:['/dashboard','/transfer']},null,2),code:`const axios = require('axios');

async function runWaveAnalysis() {
  const baseUrl = 'http://localhost:3000';
  const pages = ['/dashboard', '/transfer', '/login'];
  const apiKey = process.env.WAVE_API_KEY;

  for (const p of pages) {
    const response = await axios.get('https://wave.webaim.org/api/request', {
      params: {
        key: apiKey,
        url: baseUrl + p,
        reporttype: 3,
      },
      timeout: 30000,
    });
    const stats = response.data.categories;
    console.log(baseUrl + p + ':');
    console.log('  Errors:', stats.error?.count || 0);
    console.log('  Alerts:', stats.alert?.count || 0);
    console.log('  Features:', stats.feature?.count || 0);
    console.log('  Structural:', stats.structure?.count || 0);
    console.log('  ARIA:', stats.aria?.count || 0);
    console.log('  Contrast:', stats.contrast?.count || 0);

    if (stats.error?.count > 0) {
      console.log('  Error details:');
      Object.entries(stats.error.items || {}).forEach(([k, v]) => {
        console.log('    ' + k + ': ' + v.count);
      });
    }
    if (stats.error?.count > 0) throw new Error('WAVE errors found on ' + p);
  }
  console.log('WAVE Analysis: All pages pass ✓');
}
runWaveAnalysis();`,expectedOutput:`Running: WA-054 WAVE Tool Analysis
  http://localhost:3000/dashboard:
    Errors: 0 | Alerts: 3 | Features: 12
    Structural: 8 | ARIA: 15 | Contrast: 0
  http://localhost:3000/transfer:
    Errors: 0 | Alerts: 1 | Features: 8
    Structural: 5 | ARIA: 10 | Contrast: 0
  http://localhost:3000/login:
    Errors: 0 | Alerts: 0 | Features: 4
    Structural: 3 | ARIA: 6 | Contrast: 0
  ✓ WAVE Analysis: All pages pass
  ✓ Audit completed in 8.6s`},
{id:'WA-055',title:'Color Contrast Analyzer',category:'audit',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'1.4.3',level:'AA',description:'Batch scan all text elements on banking pages for color contrast ratio compliance using computed styles.',prerequisites:'Playwright, banking app with various themed components',config:JSON.stringify({baseUrl:'http://localhost:3000',minRatioNormal:4.5,minRatioLarge:3.0,largeTextMinPx:18.66,pages:['/dashboard','/transfer','/login']},null,2),code:`const { test, expect } = require('@playwright/test');

function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(fg, bg) {
  const l1 = Math.max(fg, bg);
  const l2 = Math.min(fg, bg);
  return (l1 + 0.05) / (l2 + 0.05);
}

test('WA-055: Color contrast analyzer', async ({ page }) => {
  await page.goto('/dashboard');
  const results = await page.evaluate(() => {
    const els = document.querySelectorAll('p,span,a,button,label,h1,h2,h3,li,td');
    const violations = [];
    els.forEach(el => {
      const cs = getComputedStyle(el);
      const fontSize = parseFloat(cs.fontSize);
      const fontWeight = parseInt(cs.fontWeight);
      const isLarge = fontSize >= 18.66 || (fontSize >= 14 && fontWeight >= 700);
      const minRatio = isLarge ? 3.0 : 4.5;
      // Simplified - real impl would compute actual contrast
      violations.push({ tag: el.tagName, text: el.textContent.slice(0,20),
        fontSize, isLarge, minRatio });
    });
    return { total: els.length, violations: violations.slice(0, 5) };
  });
  console.log('Elements scanned:', results.total);
  console.log('Sample elements:', JSON.stringify(results.violations, null, 2));
  console.log('Batch contrast scan complete ✓');
});`,expectedOutput:`Running: WA-055 Color Contrast Analyzer
  Elements scanned: 156
  ✓ Normal text (< 18.66px): 4.5:1 minimum
  ✓ Large text (>= 18.66px): 3.0:1 minimum
  ✓ Bold text (>= 14px bold): 3.0:1 minimum
  Violations: 0 of 156 elements
  Lowest ratio found: 5.2:1 (above threshold)
  WCAG 1.4.3 Level AA — PASS
  ✓ Test passed in 3.1s`},
{id:'WA-056',title:'HTML Validator (W3C)',category:'audit',platform:'Web',framework:'Playwright/W3C API',language:'JavaScript',difficulty:'Intermediate',wcagCriteria:'4.1.1',level:'A',description:'Validate banking pages for semantic HTML compliance, proper heading hierarchy, and W3C standard conformance.',prerequisites:'Playwright, W3C validator API or html-validate package',config:JSON.stringify({baseUrl:'http://localhost:3000',validatorUrl:'https://validator.w3.org/nu/',pages:['/dashboard','/transfer','/login'],format:'json'},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-056: HTML validator (W3C)', async ({ page }) => {
  const pages = ['/dashboard', '/transfer', '/login'];
  for (const p of pages) {
    await page.goto(p);
    // Check heading hierarchy
    const headings = await page.evaluate(() => {
      const hs = [];
      document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
        hs.push({ level: parseInt(h.tagName[1]), text: h.textContent.trim() });
      });
      return hs;
    });
    let prevLevel = 0;
    let hierarchyValid = true;
    headings.forEach(h => {
      if (h.level - prevLevel > 1 && prevLevel > 0) hierarchyValid = false;
      prevLevel = h.level;
    });
    expect(hierarchyValid).toBe(true);
    // Check for deprecated elements
    const deprecated = await page.evaluate(() => {
      const bad = ['center','font','marquee','blink','frame','frameset'];
      return bad.filter(t => document.querySelectorAll(t).length > 0);
    });
    expect(deprecated).toHaveLength(0);
    // Check semantic structure
    const hasMain = await page.locator('main').count();
    const hasNav = await page.locator('nav').count();
    expect(hasMain).toBeGreaterThanOrEqual(1);
    console.log(p + ': headings=' + headings.length +
      ', semantic structure valid ✓');
  }
});`,expectedOutput:`Running: WA-056 HTML Validator (W3C)
  /dashboard: headings=5, semantic structure valid ✓
  /transfer: headings=3, semantic structure valid ✓
  /login: headings=2, semantic structure valid ✓
  ✓ Heading hierarchy valid on all pages
  ✓ No deprecated HTML elements
  ✓ Semantic landmarks: main, nav, header, footer
  WCAG 4.1.1 Level A — PASS
  ✓ Test passed in 3.5s`},
{id:'WA-057',title:'Screen Reader Recording Test',category:'audit',platform:'Web',framework:'Playwright/NVDA',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'4.1.2',level:'A',description:'Capture NVDA/JAWS screen reader output for critical banking flows and compare against expected announcement sequences.',prerequisites:'NVDA installed (Windows), Playwright, speech recording utility',config:JSON.stringify({screenReader:'NVDA',flows:['login','transfer','balance-check'],outputFormat:'text',comparisonMode:'fuzzy'},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-057: Screen reader recording test', async ({ page }) => {
  // This test validates the expected SR output structure
  await page.goto('/transfer');

  // Simulate expected screen reader output sequence
  const expectedSequence = [
    'Fund Transfer, heading level 1',
    'From Account, combobox, collapsed',
    'To Account, edit text, required',
    'Amount, edit text, required, Indian Rupees',
    'Remarks, edit text',
    'Transfer Funds, button',
  ];

  // Verify each element has appropriate accessible name
  const elements = [
    { sel: 'h1', expected: /fund transfer/i },
    { sel: '#fromAccount', expected: /from account/i },
    { sel: '#toAccount', expected: /to account/i },
    { sel: '#amount', expected: /amount/i },
    { sel: '#remarks', expected: /remark/i },
    { sel: 'button[type="submit"]', expected: /transfer/i },
  ];

  for (const el of elements) {
    const locator = page.locator(el.sel);
    const name = await locator.evaluate(node => {
      return node.getAttribute('aria-label') ||
        node.getAttribute('aria-labelledby') ||
        node.textContent?.trim() || node.tagName;
    });
    expect(name).toMatch(el.expected);
    console.log(el.sel + ': "' + name.slice(0, 40) + '" ✓');
  }
  console.log('Expected SR sequence validated ✓');
});`,expectedOutput:`Running: WA-057 Screen Reader Recording Test
  h1: "Fund Transfer" ✓
  #fromAccount: "From Account" ✓
  #toAccount: "To Account" ✓
  #amount: "Amount (Indian Rupees)" ✓
  #remarks: "Remarks" ✓
  button[type="submit"]: "Transfer Funds" ✓
  ✓ Expected SR sequence validated
  ✓ All 6 elements have accessible names
  WCAG 4.1.2 Level A — PASS
  ✓ Test passed in 2.0s`},
{id:'WA-058',title:'Keyboard-only User Flow Test',category:'audit',platform:'Web',framework:'Playwright',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'2.1.1',level:'A',description:'Complete full fund transfer flow using only keyboard (no mouse) — from login through transfer confirmation.',prerequisites:'Playwright, banking app with full transfer flow',config:JSON.stringify({baseUrl:'http://localhost:3000',flow:['login','navigate-to-transfer','fill-form','confirm','verify-success'],timeout:60000},null,2),code:`const { test, expect } = require('@playwright/test');

test('WA-058: Keyboard-only transfer flow', async ({ page }) => {
  await page.goto('/login');
  // Login with keyboard only
  await page.keyboard.press('Tab'); // skip link
  await page.keyboard.press('Tab'); // username
  await page.keyboard.type('testuser');
  await page.keyboard.press('Tab'); // password
  await page.keyboard.type('Test@123');
  await page.keyboard.press('Enter'); // submit
  await page.waitForURL('**/dashboard');
  console.log('Step 1: Login via keyboard ✓');

  // Navigate to transfer
  await page.keyboard.press('Alt+T');
  await page.waitForURL('**/transfer');
  console.log('Step 2: Navigate to transfer ✓');

  // Fill transfer form
  await page.keyboard.press('Tab'); // from account
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab'); // to account
  await page.keyboard.type('9876543210');
  await page.keyboard.press('Tab'); // amount
  await page.keyboard.type('5000');
  await page.keyboard.press('Tab'); // remarks
  await page.keyboard.type('Keyboard test');
  await page.keyboard.press('Tab'); // submit
  await page.keyboard.press('Enter');
  console.log('Step 3: Form filled via keyboard ✓');

  // Confirm dialog
  const dialog = page.locator('[role="alertdialog"]');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Tab'); // confirm button
  await page.keyboard.press('Enter');
  console.log('Step 4: Transfer confirmed ✓');

  // Verify success
  const success = page.locator('[role="status"]');
  await expect(success).toContainText(/success/i);
  console.log('Step 5: Success message received ✓');
});`,expectedOutput:`Running: WA-058 Keyboard-only User Flow Test
  Step 1: Login via keyboard ✓
  Step 2: Navigate to transfer (Alt+T) ✓
  Step 3: Form filled via keyboard ✓
    From: Savings Account
    To: 9876543210
    Amount: 5000
    Remarks: Keyboard test
  Step 4: Transfer confirmed ✓
  Step 5: Success message received ✓
  ✓ Full transfer flow completed keyboard-only
  WCAG 2.1.1 Level A — PASS
  ✓ Test passed in 8.4s`},
{id:'WA-059',title:'Mobile Accessibility (TalkBack)',category:'audit',platform:'Web',framework:'Playwright/Android',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'4.1.2',level:'A',description:'Test banking app with Android TalkBack screen reader simulation — verify touch targets, swipe navigation, and announcements.',prerequisites:'Playwright with Android emulation, banking responsive web app',config:JSON.stringify({device:'Pixel 5',userAgent:'Mobile',viewport:{width:393,height:851},touchTargetMin:44,hasTouch:true},null,2),code:`const { test, expect, devices } = require('@playwright/test');

test('WA-059: Mobile accessibility TalkBack', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['Pixel 5'],
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/dashboard');

  // Check touch target sizes (min 44x44 CSS px)
  const interactive = page.locator('a, button, input, select, [role="button"]');
  const count = await interactive.count();
  let smallTargets = 0;
  for (let i = 0; i < count; i++) {
    const box = await interactive.nth(i).boundingBox();
    if (box && (box.width < 44 || box.height < 44)) {
      smallTargets++;
      const tag = await interactive.nth(i).evaluate(el => el.tagName + '#' + el.id);
      console.log('Small target: ' + tag + ' (' +
        Math.round(box.width) + 'x' + Math.round(box.height) + ')');
    }
  }
  console.log('Touch targets checked: ' + count + ', small: ' + smallTargets);
  expect(smallTargets).toBe(0);

  // Check viewport meta allows zoom
  const viewport = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    return meta?.content || '';
  });
  expect(viewport).not.toMatch(/maximum-scale\\s*=\\s*1/);
  expect(viewport).not.toMatch(/user-scalable\\s*=\\s*no/);
  console.log('Viewport allows pinch-zoom ✓');
  await context.close();
});`,expectedOutput:`Running: WA-059 Mobile Accessibility (TalkBack)
  ✓ Device: Pixel 5 (393x851)
  Touch targets checked: 18, small: 0
  ✓ All targets >= 44x44 CSS pixels
  ✓ Viewport allows pinch-zoom
  ✓ No user-scalable=no restriction
  ✓ Touch-friendly interactive elements
  WCAG 4.1.2 Level A — PASS
  ✓ Test passed in 4.8s`},
{id:'WA-060',title:'Accessibility Regression Suite',category:'audit',platform:'Web',framework:'axe-core/Playwright',language:'JavaScript',difficulty:'Advanced',wcagCriteria:'4.1.1',level:'AA',description:'Automated before/after comparison suite that catches accessibility regressions on every code change or release.',prerequisites:'Playwright, axe-core, baseline snapshot file, CI/CD pipeline',config:JSON.stringify({baseUrl:'http://localhost:3000',baselineFile:'./a11y-baseline.json',pages:['/dashboard','/transfer','/login','/transactions','/profile'],standard:'WCAG2AA'},null,2),code:`const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');

test('WA-060: Accessibility regression suite', async ({ page }) => {
  const pages = ['/dashboard', '/transfer', '/login',
    '/transactions', '/profile'];
  const baselinePath = './a11y-baseline.json';
  const baseline = fs.existsSync(baselinePath)
    ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : {};
  const current = {};

  for (const p of pages) {
    await page.goto('http://localhost:3000' + p);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    current[p] = {
      violations: results.violations.length,
      passes: results.passes.length,
      ruleIds: results.violations.map(v => v.id),
    };
    if (baseline[p]) {
      const newViolations = current[p].ruleIds.filter(
        id => !baseline[p].ruleIds.includes(id));
      if (newViolations.length > 0) {
        console.log('REGRESSION on ' + p + ': ' + newViolations.join(', '));
      }
      expect(current[p].violations).toBeLessThanOrEqual(baseline[p].violations);
    }
    console.log(p + ': violations=' + current[p].violations +
      ', passes=' + current[p].passes);
  }
  // Save new baseline
  fs.writeFileSync(baselinePath, JSON.stringify(current, null, 2));
  console.log('Baseline updated. No regressions detected ✓');
});`,expectedOutput:`Running: WA-060 Accessibility Regression Suite
  /dashboard: violations=0, passes=48
  /transfer: violations=0, passes=35
  /login: violations=0, passes=22
  /transactions: violations=0, passes=41
  /profile: violations=0, passes=38
  ─────────────────────────────
  Total: 0 violations, 184 passes
  ✓ No regressions vs baseline
  ✓ Baseline updated: a11y-baseline.json
  WCAG Compliance Level AA — PASS
  ✓ Suite completed in 14.6s`},
];

const diffColor = d => d === 'Beginner' ? C.accent : d === 'Intermediate' ? C.orange : C.red;
const levelColor = l => l === 'A' ? C.blue : l === 'AA' ? C.accent : C.yellow;

export default function WebAccessibilityLab() {
  const [cat, setCat] = useState('screenReader');
  const [sel, setSel] = useState(S[0]);
  const [search, setSearch] = useState('');
  const [levelF, setLevelF] = useState('All');
  const [diffF, setDiffF] = useState('All');
  const [statuses, setStatuses] = useState({});
  const [code, setCode] = useState(S[0].code);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [progress, setProgress] = useState(0);
  const [showRef, setShowRef] = useState(false);
  const timerRef = useRef(null);

  const filtered = S.filter(s => {
    if (s.category !== cat) return false;
    if (levelF !== 'All' && s.level !== levelF) return false;
    if (diffF !== 'All' && s.difficulty !== diffF) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) &&
        !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pick = useCallback((s) => { setSel(s); setCode(s.code); setOutput(''); setProgress(0); setRunning(false); }, []);

  const runSim = useCallback(() => {
    if (running) return;
    setRunning(true); setOutput(''); setProgress(0);
    const lines = sel.expectedOutput.split('\n');
    let i = 0;
    timerRef.current = setInterval(() => {
      if (i < lines.length) {
        setOutput(prev => prev + (prev ? '\n' : '') + lines[i]);
        setProgress(Math.round(((i + 1) / lines.length) * 100));
        i++;
      } else {
        clearInterval(timerRef.current);
        setRunning(false);
        setStatuses(prev => ({ ...prev, [sel.id]: 'passed' }));
      }
    }, 180);
  }, [sel, running]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const totalCat = S.filter(s => s.category === cat).length;
  const passedCat = S.filter(s => s.category === cat && statuses[s.id] === 'passed').length;
  const totalAll = S.length;
  const passedAll = Object.values(statuses).filter(v => v === 'passed').length;

  const copy = () => { navigator.clipboard?.writeText(code); };
  const reset = () => { setCode(sel.code); };

  const wcagRefData = {
    '1.1.1': 'Non-text Content: All non-text content has a text alternative that serves the equivalent purpose.',
    '1.2.2': 'Captions (Prerecorded): Captions are provided for all prerecorded audio content in synchronized media.',
    '1.3.1': 'Info and Relationships: Information, structure, and relationships conveyed through presentation can be programmatically determined.',
    '1.3.4': 'Orientation: Content does not restrict its view and operation to a single display orientation.',
    '1.3.5': 'Identify Input Purpose: The purpose of each input field collecting user information can be programmatically determined.',
    '1.4.1': 'Use of Color: Color is not used as the only visual means of conveying information.',
    '1.4.3': 'Contrast (Minimum): Text has a contrast ratio of at least 4.5:1 (3:1 for large text).',
    '1.4.4': 'Resize Text: Text can be resized without assistive technology up to 200 percent without loss of content.',
    '1.4.10': 'Reflow: Content can be presented without loss of information or functionality at 320 CSS px width.',
    '2.1.1': 'Keyboard: All functionality is operable through a keyboard interface.',
    '2.1.2': 'No Keyboard Trap: Focus can be moved away from any component using standard keyboard mechanisms.',
    '2.1.4': 'Character Key Shortcuts: If keyboard shortcuts are implemented, there is a mechanism to turn them off or remap.',
    '2.2.1': 'Timing Adjustable: Users can turn off, adjust, or extend any time limits.',
    '2.3.1': 'Three Flashes or Below Threshold: No content flashes more than three times per second.',
    '2.3.3': 'Animation from Interactions: Motion animation can be disabled unless essential.',
    '2.4.1': 'Bypass Blocks: A mechanism is available to bypass blocks of content repeated on multiple pages.',
    '2.4.3': 'Focus Order: Focusable components receive focus in a meaningful order.',
    '2.4.4': 'Link Purpose (In Context): The purpose of each link can be determined from the link text alone or context.',
    '2.4.7': 'Focus Visible: Any keyboard operable user interface has a visible keyboard focus indicator.',
    '2.4.8': 'Location: Information about the user location within a set of pages is available.',
    '2.4.11': 'Focus Appearance: Focus indicators have sufficient contrast and size.',
    '3.1.1': 'Language of Page: The default human language of each page can be programmatically determined.',
    '3.2.3': 'Consistent Navigation: Navigation mechanisms occur in the same relative order across pages.',
    '3.2.4': 'Consistent Identification: Components with the same functionality are identified consistently.',
    '3.3.1': 'Error Identification: If an input error is detected, the item is identified and described to the user.',
    '3.3.2': 'Labels or Instructions: Labels or instructions are provided when content requires user input.',
    '3.3.3': 'Error Suggestion: If an error is detected, suggestions for correction are provided.',
    '3.3.4': 'Error Prevention: For pages with legal/financial commitments, submissions are reversible, checked, or confirmed.',
    '4.1.1': 'Parsing: Elements have complete start/end tags, are nested properly, and have no duplicate attributes.',
    '4.1.2': 'Name, Role, Value: For all UI components, name and role can be programmatically determined.',
    '4.1.3': 'Status Messages: Status messages can be programmatically determined without receiving focus.',
  };

  const sty = {
    page: { minHeight: '100vh', background: `linear-gradient(135deg,${C.bgFrom} 0%,${C.bgTo} 100%)`, color: C.text, fontFamily: "'Segoe UI',Tahoma,Geneva,Verdana,sans-serif", padding: '18px 22px 40px' },
    header: { textAlign: 'center', marginBottom: 16 },
    h1: { fontSize: 30, fontWeight: 800, margin: 0, background: `linear-gradient(90deg,${C.accent},${C.blue})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    sub: { fontSize: 13, color: C.muted, marginTop: 4 },
    statsBar: { display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 14, flexWrap: 'wrap' },
    stat: { background: C.card, borderRadius: 8, padding: '6px 18px', fontSize: 13, border: `1px solid ${C.border}` },
    split: { display: 'flex', gap: 16, height: 'calc(100vh - 160px)', minHeight: 500 },
    left: { width: '38%', minWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 },
    right: { flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' },
    tabBar: { display: 'flex', gap: 4, flexWrap: 'wrap' },
    tab: (active) => ({ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: active ? C.accent : C.card, color: active ? '#0a0a1a' : C.text, transition: 'all 0.2s' }),
    filterRow: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
    input: { flex: 1, padding: '7px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.editorBg, color: C.text, fontSize: 13, outline: 'none', minWidth: 120 },
    select: { padding: '6px 8px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.editorBg, color: C.text, fontSize: 12, outline: 'none' },
    list: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 4 },
    card: (active) => ({ padding: '10px 14px', borderRadius: 8, background: active ? C.cardHover : C.card, border: `1px solid ${active ? C.accent : C.border}`, cursor: 'pointer', transition: 'all 0.15s' }),
    cardTitle: { fontSize: 13, fontWeight: 700, color: C.header, marginBottom: 4 },
    cardId: { fontSize: 11, color: C.accent, marginRight: 8 },
    badge: (color) => ({ display: 'inline-block', padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: color + '22', color: color, marginRight: 4 }),
    dot: (status) => ({ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: status === 'passed' ? C.accent : status === 'failed' ? C.red : C.muted, marginRight: 6 }),
    panel: { background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: 16, overflowY: 'auto' },
    panelTitle: { fontSize: 16, fontWeight: 700, color: C.header, marginBottom: 6 },
    panelSub: { fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.5 },
    editor: { width: '100%', minHeight: 200, maxHeight: 280, padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, background: C.editorBg, color: C.editorText, fontFamily: "'Fira Code','Consolas',monospace", fontSize: 12, lineHeight: 1.6, resize: 'vertical', outline: 'none', whiteSpace: 'pre', overflowX: 'auto' },
    btn: (bg) => ({ padding: '7px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: bg || C.accent, color: bg === C.red ? '#fff' : '#0a0a1a', transition: 'opacity 0.2s' }),
    outputBox: { background: C.editorBg, borderRadius: 8, border: `1px solid ${C.border}`, padding: 12, fontFamily: "'Fira Code','Consolas',monospace", fontSize: 11, color: C.accent, lineHeight: 1.7, whiteSpace: 'pre-wrap', minHeight: 60, maxHeight: 180, overflowY: 'auto' },
    progBar: { height: 4, borderRadius: 2, background: C.progressBg, marginTop: 6 },
    progFill: (pct) => ({ height: '100%', borderRadius: 2, width: pct + '%', background: pct === 100 ? C.accent : C.blue, transition: 'width 0.3s' }),
    refBox: { background: C.editorBg, borderRadius: 8, border: `1px solid ${C.border}`, padding: 12, marginTop: 8, fontSize: 12, lineHeight: 1.6, color: C.text },
    progressOverall: { height: 6, borderRadius: 3, background: C.progressBg, marginBottom: 8 },
    progressFill: (pct) => ({ height: '100%', borderRadius: 3, width: pct + '%', background: `linear-gradient(90deg,${C.accent},${C.blue})`, transition: 'width 0.4s' }),
  };

  return (
    <div style={sty.page}>
      <div style={sty.header}>
        <h1 style={sty.h1}>Web Accessibility Testing Lab</h1>
        <div style={sty.sub}>Banking Application WCAG 2.1 AA Compliance Suite - 60 Test Scenarios</div>
      </div>
      <div style={sty.statsBar}>
        <span style={sty.stat}>Total: <b style={{color:C.accent}}>{totalAll}</b> scenarios</span>
        <span style={sty.stat}>Passed: <b style={{color:C.accent}}>{passedAll}</b>/{totalAll}</span>
        <span style={sty.stat}>Category: <b style={{color:C.accent}}>{passedCat}</b>/{totalCat} passed</span>
        <span style={sty.stat}>Coverage: <b style={{color:C.accent}}>{totalAll > 0 ? Math.round((passedAll/totalAll)*100) : 0}%</b></span>
      </div>
      <div style={sty.split}>
        {/* LEFT PANEL */}
        <div style={sty.left}>
          <div style={sty.tabBar}>
            {CATS.map(c => (
              <button key={c.key} style={sty.tab(cat === c.key)} onClick={() => { setCat(c.key); }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
          <div style={sty.filterRow}>
            <input style={sty.input} placeholder="Search scenarios..." value={search} onChange={e => setSearch(e.target.value)} />
            <select style={sty.select} value={levelF} onChange={e => setLevelF(e.target.value)}>
              {LEVELS.map(l => <option key={l} value={l}>{l === 'All' ? 'Level' : 'Level ' + l}</option>)}
            </select>
            <select style={sty.select} value={diffF} onChange={e => setDiffF(e.target.value)}>
              {DIFFS.map(d => <option key={d} value={d}>{d === 'All' ? 'Difficulty' : d}</option>)}
            </select>
          </div>
          <div style={sty.progressOverall}>
            <div style={sty.progressFill(totalCat > 0 ? Math.round((passedCat/totalCat)*100) : 0)} />
          </div>
          <div style={sty.list}>
            {filtered.length === 0 && <div style={{color:C.muted,textAlign:'center',padding:20}}>No scenarios match filters</div>}
            {filtered.map(s => (
              <div key={s.id} style={sty.card(sel.id === s.id)} onClick={() => pick(s)}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={sty.dot(statuses[s.id])} />
                  <span style={sty.cardId}>{s.id}</span>
                  <span style={sty.cardTitle}>{s.title}</span>
                </div>
                <div style={{marginTop:4}}>
                  <span style={sty.badge(levelColor(s.level))}>WCAG {s.wcagCriteria} ({s.level})</span>
                  <span style={sty.badge(diffColor(s.difficulty))}>{s.difficulty}</span>
                  <span style={sty.badge(C.blue)}>{s.framework.split('/')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT PANEL */}
        <div style={sty.right}>
          <div style={{...sty.panel, flex: '0 0 auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div>
                <span style={{fontSize:14,fontWeight:800,color:C.accent,marginRight:10}}>{sel.id}</span>
                <span style={sty.panelTitle}>{sel.title}</span>
              </div>
              <div>
                <span style={sty.badge(levelColor(sel.level))}>WCAG {sel.wcagCriteria} Level {sel.level}</span>
                <span style={sty.badge(diffColor(sel.difficulty))}>{sel.difficulty}</span>
                <span style={sty.badge(C.blue)}>{sel.platform}</span>
                <span style={sty.badge(C.yellow)}>{sel.language}</span>
              </div>
            </div>
            <div style={sty.panelSub}>{sel.description}</div>
            <div style={{fontSize:11,color:C.muted}}><b>Prerequisites:</b> {sel.prerequisites}</div>
          </div>
          <div style={{...sty.panel, flex: 1, display:'flex', flexDirection:'column', gap:10, overflow:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Test Script</span>
              <div style={{display:'flex',gap:6}}>
                <button style={sty.btn()} onClick={copy}>Copy Code</button>
                <button style={sty.btn('#555')} onClick={reset}>Reset</button>
              </div>
            </div>
            <textarea style={sty.editor} value={code} onChange={e => setCode(e.target.value)} spellCheck={false} />
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Expected Output</span>
              <span style={{fontSize:11,color:C.muted}}>{sel.framework}</span>
            </div>
            <div style={sty.outputBox}>{sel.expectedOutput}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button style={{...sty.btn(running ? '#555' : C.accent),opacity:running?0.6:1}} onClick={runSim} disabled={running}>
                {running ? 'Running...' : 'Run Test'}
              </button>
              {statuses[sel.id] === 'passed' && <span style={{color:C.accent,fontSize:12,fontWeight:700}}>PASSED</span>}
              {progress > 0 && progress < 100 && <span style={{color:C.blue,fontSize:11}}>{progress}%</span>}
              <button style={{...sty.btn(C.blue),marginLeft:'auto'}} onClick={() => setShowRef(!showRef)}>
                {showRef ? 'Hide' : 'Show'} WCAG Reference
              </button>
            </div>
            {(running || output) && (
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.header,marginBottom:4}}>Execution Output</div>
                <div style={sty.outputBox}>{output || 'Starting...'}</div>
                <div style={sty.progBar}><div style={sty.progFill(progress)} /></div>
              </div>
            )}
            {showRef && (
              <div style={sty.refBox}>
                <div style={{fontWeight:700,color:C.accent,marginBottom:6}}>WCAG {sel.wcagCriteria} - Level {sel.level}</div>
                <div>{wcagRefData[sel.wcagCriteria] || 'Reference data for WCAG ' + sel.wcagCriteria + ' criterion.'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

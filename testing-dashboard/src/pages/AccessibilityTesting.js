import React, { useState, useCallback, useRef } from 'react';

/* ================================================================
   Banking QA - Accessibility Testing Dashboard
   Tabs: Screen Reader | Keyboard Nav | Visual | WCAG | Assistive Tech | Compliance
   ================================================================ */

/* --- Color Tokens (Dark Theme) --- */
const C = {
  bgGradientFrom: '#1a1a2e',
  bgGradientTo: '#16213e',
  card: '#0f3460',
  cardLight: '#1a4a7a',
  accent: '#4ecca3',
  red: '#e74c3c',
  orange: '#f39c12',
  blue: '#3498db',
  green: '#4ecca3',
  yellow: '#f1c40f',
  highOrange: '#e67e22',
  critical: '#e74c3c',
  text: '#ffffff',
  textMuted: '#b0bec5',
  textDim: '#78909c',
  border: '#1e5f8a',
  inputBg: '#0a2744',
  inputBorder: '#1e5f8a',
  shadow: 'rgba(0,0,0,0.4)',
  tabActive: '#4ecca3',
  tabInactive: '#1a4a7a',
  progressBg: '#0a2744',
  headerBg: 'rgba(15,52,96,0.85)',
};

const priorityColor = (p) => {
  if (p === 'P0') return C.critical;
  if (p === 'P1') return C.highOrange;
  return C.blue;
};

const statusColor = (s) => {
  if (s === 'passed') return C.green;
  if (s === 'failed') return C.red;
  return C.textDim;
};

const statusLabel = (s) => {
  if (s === 'passed') return 'PASS';
  if (s === 'failed') return 'FAIL';
  return 'NOT RUN';
};

/* --- Shared Styles --- */
const styles = {
  page: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${C.bgGradientFrom} 0%, ${C.bgGradientTo} 100%)`,
    color: C.text,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px 28px 40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 24,
  },
  h1: {
    fontSize: 32,
    fontWeight: 700,
    margin: 0,
    letterSpacing: 1,
    background: `linear-gradient(90deg, ${C.accent}, ${C.blue})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 14,
    color: C.textMuted,
    marginTop: 6,
  },
  tabBar: {
    display: 'flex',
    gap: 0,
    marginBottom: 24,
    borderBottom: `2px solid ${C.border}`,
    flexWrap: 'wrap',
  },
  tab: (active) => ({
    padding: '12px 22px',
    cursor: 'pointer',
    fontWeight: active ? 700 : 500,
    fontSize: 14,
    color: active ? C.bgGradientFrom : C.textMuted,
    background: active ? C.tabActive : 'transparent',
    borderRadius: '8px 8px 0 0',
    border: 'none',
    borderBottom: active ? `3px solid ${C.tabActive}` : '3px solid transparent',
    transition: 'all 0.25s ease',
    letterSpacing: 0.5,
  }),
  summaryRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  summaryBox: (color) => ({
    background: `${color}18`,
    border: `1px solid ${color}44`,
    borderRadius: 8,
    padding: '8px 22px',
    textAlign: 'center',
    minWidth: 100,
  }),
  summaryValue: (color) => ({
    fontSize: 24,
    fontWeight: 800,
    color,
    margin: 0,
  }),
  summaryLabel: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 2,
  },
  splitPanel: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
  },
  leftPanel: {
    flex: '0 0 40%',
    maxWidth: '40%',
    maxHeight: 'calc(100vh - 320px)',
    overflowY: 'auto',
    paddingRight: 10,
  },
  rightPanel: {
    flex: '0 0 60%',
    maxWidth: '60%',
    maxHeight: 'calc(100vh - 320px)',
    overflowY: 'auto',
    paddingLeft: 6,
  },
  card: {
    background: C.card,
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    border: `1px solid ${C.border}`,
    boxShadow: `0 4px 16px ${C.shadow}`,
  },
  activeScenario: {
    background: C.card,
    borderLeft: `4px solid ${C.accent}`,
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 10,
    border: `1px solid ${C.accent}44`,
    boxShadow: `0 4px 16px ${C.shadow}, 0 0 12px ${C.accent}11`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  inactiveScenario: {
    background: C.card,
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 10,
    border: `1px solid ${C.border}`,
    boxShadow: `0 4px 16px ${C.shadow}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: C.accent,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  badge: (color) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    color: '#000',
    background: color,
    marginLeft: 8,
    letterSpacing: 0.4,
  }),
  statusBadge: (s) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 700,
    color: '#fff',
    background: statusColor(s),
    letterSpacing: 0.4,
  }),
  runBtn: (running) => ({
    width: '100%',
    padding: '12px 0',
    borderRadius: 8,
    border: 'none',
    background: running
      ? `linear-gradient(90deg, ${C.orange}, ${C.yellow})`
      : `linear-gradient(90deg, ${C.accent}, ${C.blue})`,
    color: '#000',
    fontWeight: 700,
    fontSize: 15,
    cursor: running ? 'not-allowed' : 'pointer',
    letterSpacing: 0.8,
    marginTop: 14,
    transition: 'all 0.3s ease',
    opacity: running ? 0.8 : 1,
  }),
  progressBarOuter: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    background: C.progressBg,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 4,
  },
  progressBarInner: (pct, color) => ({
    width: `${pct}%`,
    height: '100%',
    borderRadius: 4,
    background: color || C.accent,
    transition: 'width 0.4s ease',
  }),
  outputCard: {
    background: 'rgba(10,39,68,0.7)',
    borderRadius: 10,
    padding: 14,
    border: `1px solid ${C.border}`,
    marginTop: 10,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: C.textMuted,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    background: C.border,
    margin: '14px 0',
  },
  testDataChip: (color) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 4,
    fontSize: 11,
    background: `${color}22`,
    color,
    marginRight: 6,
    marginBottom: 4,
    fontWeight: 600,
    border: `1px solid ${color}44`,
  }),
};

/* ================================================================
   TAB 1: SCREEN READER TESTING (10 scenarios)
   ================================================================ */
const SCREEN_READER_SCENARIOS = [
  {
    id: 'SR-001',
    name: 'NVDA/JAWS Compatibility with Banking Forms',
    priority: 'P0',
    status: 'not_run',
    category: 'Screen Reader',
    steps: [
      'Open account opening form with NVDA/JAWS active',
      'Navigate through all form fields using screen reader commands',
      'Verify each field label is announced correctly with field type',
      'Complete and submit the form using only screen reader navigation',
    ],
    testData: {
      screenReader: 'NVDA 2024.1 / JAWS 2024',
      browser: 'Chrome 120, Firefox 121',
      formType: 'Account Opening Form',
      fieldCount: 15,
    },
    expected: 'All form fields announce label, type, required status, and current value. Form navigation is logical and complete.',
    actual: null,
    time: null,
  },
  {
    id: 'SR-002',
    name: 'Account Balance Announcement Accuracy',
    priority: 'P0',
    status: 'not_run',
    category: 'Screen Reader',
    steps: [
      'Navigate to account dashboard with screen reader',
      'Focus on account balance display element',
      'Verify balance is announced with correct currency format',
      'Check that balance updates are announced via ARIA live region',
    ],
    testData: {
      balance: '$45,230.75',
      currency: 'USD',
      ariaLive: 'polite',
      accountType: 'Savings Account',
    },
    expected: 'Screen reader announces "Savings Account balance: $45,230.75 USD" with correct number formatting and currency.',
    actual: null,
    time: null,
  },
  {
    id: 'SR-003',
    name: 'Transaction History Table Navigation',
    priority: 'P0',
    status: 'not_run',
    category: 'Screen Reader',
    steps: [
      'Navigate to transaction history table using screen reader',
      'Verify table headers are announced when entering table',
      'Navigate between rows and columns using table navigation keys',
      'Verify cell content includes row/column context',
      'Check sort controls are accessible and announced',
    ],
    testData: {
      tableRows: 50,
      columns: ['Date', 'Description', 'Amount', 'Balance', 'Status'],
      sortable: true,
      pagination: true,
    },
    expected: 'Table announces row/column count on entry. Cell navigation provides header context. Sort state announced on column headers.',
    actual: null,
    time: null,
  },
  {
    id: 'SR-004',
    name: 'Form Field Label Association Verification',
    priority: 'P0',
    status: 'not_run',
    category: 'Screen Reader',
    steps: [
      'Inspect all form fields for proper label association (for/id or aria-labelledby)',
      'Verify screen reader announces label text when field receives focus',
      'Check grouped fields (radio buttons, checkboxes) have fieldset/legend',
      'Validate aria-describedby links helper text to fields',
    ],
    testData: {
      formId: 'fund-transfer-form',
      totalFields: 12,
      requiredFields: 8,
      helperTextFields: 5,
    },
    expected: 'Every input has a programmatic label. Grouped controls use fieldset/legend. Helper text announced via aria-describedby.',
    actual: null,
    time: null,
  },
  {
    id: 'SR-005',
    name: 'Error Message Screen Reader Announcement',
    priority: 'P0',
    status: 'not_run',
    category: 'Screen Reader',
    steps: [
      'Submit form with intentional validation errors',
      'Verify error summary is announced immediately via aria-live="assertive"',
      'Check individual field errors are associated via aria-describedby',
      'Confirm focus moves to first error field or error summary',
    ],
    testData: {
      errorCount: 4,
      ariaLive: 'assertive',
      focusManagement: 'error-summary-first',
      errorTypes: ['required', 'format', 'range', 'pattern'],
    },
    expected: 'Error summary announced immediately. Each error linked to its field. Focus moves to error summary. Individual errors announced on field focus.',
    actual: null,
    time: null,
  },
  {
    id: 'SR-006',
    name: 'Modal Dialog Focus Trap and Announcement',
    priority: 'P1',
    status: 'not_run',
    category: 'Screen Reader',
    steps: [
      'Open transfer confirmation modal dialog',
      'Verify dialog title is announced on open (aria-labelledby)',
      'Check focus is trapped within modal (Tab cycles within)',
      'Close modal and verify focus returns to trigger element',
    ],
    testData: {
      dialogType: 'Confirm Transfer',
      role: 'dialog',
      ariaModal: true,
      focusableElements: 4,
    },
    expected: 'Dialog title announced on open. Focus trapped inside modal. Escape key closes dialog. Focus returns to trigger button after close.',
    actual: null,
    time: null,
  },
  {
    id: 'SR-007',
    name: 'Dynamic Content Update Announcements (ARIA Live)',
    priority: 'P1',
    status: 'not_run',
    category: 'Screen Reader',
    steps: [
      'Trigger real-time balance update on dashboard',
      'Verify ARIA live region announces the change',
      'Check notification banners use appropriate politeness level',
      'Validate transaction status changes are announced',
    ],
    testData: {
      liveRegions: 3,
      politeness: ['polite', 'assertive', 'off'],
      updateTypes: ['balance', 'notification', 'transaction-status'],
      updateFrequency: '5 seconds',
    },
    expected: 'Balance updates use aria-live="polite". Critical alerts use "assertive". Status changes announced without interrupting user flow.',
    actual: null,
    time: null,
  },
  {
    id: 'SR-008',
    name: 'Skip Navigation Link Functionality',
    priority: 'P1',
    status: 'not_run',
    category: 'Screen Reader',
    steps: [
      'Load banking application home page',
      'Press Tab key as first action on page',
      'Verify "Skip to main content" link appears and is focusable',
      'Activate skip link and confirm focus moves to main content area',
    ],
    testData: {
      skipLinkTarget: '#main-content',
      visibleOnFocus: true,
      position: 'first focusable element',
      additionalSkipLinks: ['Skip to accounts', 'Skip to transfers'],
    },
    expected: 'Skip navigation link is first focusable element. Visually appears on focus. Activating it moves focus past navigation to main content.',
    actual: null,
    time: null,
  },
  {
    id: 'SR-009',
    name: 'Heading Hierarchy Validation (H1-H6)',
    priority: 'P1',
    status: 'not_run',
    category: 'Screen Reader',
    steps: [
      'Open heading navigation in screen reader (NVDA: H key / JAWS: H key)',
      'Verify single H1 exists on each page',
      'Check heading levels do not skip (e.g., H1 to H3 without H2)',
      'Validate headings provide meaningful page structure',
    ],
    testData: {
      pages: ['Dashboard', 'Accounts', 'Transfers', 'Payments', 'Settings'],
      expectedH1: 1,
      maxDepth: 4,
      headingCount: 12,
    },
    expected: 'Each page has exactly one H1. Heading levels are sequential without skips. Headings create a logical document outline for screen reader navigation.',
    actual: null,
    time: null,
  },
  {
    id: 'SR-010',
    name: 'Image Alt Text for Banking Icons and Charts',
    priority: 'P2',
    status: 'not_run',
    category: 'Screen Reader',
    steps: [
      'Navigate to dashboard with charts and icons using screen reader',
      'Verify decorative images have empty alt="" or role="presentation"',
      'Check informational images have descriptive alt text',
      'Validate chart images have text alternatives conveying data',
      'Verify icon buttons have accessible names via aria-label',
    ],
    testData: {
      chartTypes: ['pie', 'bar', 'line'],
      iconCount: 24,
      decorativeImages: 8,
      informationalImages: 16,
    },
    expected: 'Decorative images hidden from screen readers. Informational images have meaningful alt text. Charts have text descriptions of data trends.',
    actual: null,
    time: null,
  },
];

/* ================================================================
   TAB 2: KEYBOARD NAVIGATION (10 scenarios)
   ================================================================ */
const KEYBOARD_SCENARIOS = [
  {
    id: 'KB-001',
    name: 'Tab Order Through Banking Application Forms',
    priority: 'P0',
    status: 'not_run',
    category: 'Keyboard Navigation',
    steps: [
      'Start at top of fund transfer form page',
      'Press Tab key repeatedly through all interactive elements',
      'Verify tab order follows visual layout (left-to-right, top-to-bottom)',
      'Check that no focusable elements are skipped or unreachable',
      'Verify Shift+Tab reverses the tab order correctly',
    ],
    testData: {
      formType: 'Fund Transfer Form',
      interactiveElements: 18,
      tabIndexOverrides: 0,
      skipHiddenFields: true,
    },
    expected: 'Tab order follows logical reading order. All interactive elements reachable. No tabindex > 0 used. Hidden/disabled fields are skipped.',
    actual: null,
    time: null,
  },
  {
    id: 'KB-002',
    name: 'Focus Visible Indicator on All Interactive Elements',
    priority: 'P0',
    status: 'not_run',
    category: 'Keyboard Navigation',
    steps: [
      'Tab through all buttons, links, inputs, and controls',
      'Verify each element shows a visible focus indicator',
      'Check focus indicator has minimum 3:1 contrast ratio',
      'Ensure focus style is consistent across the application',
    ],
    testData: {
      focusStyle: '2px solid #4ecca3 outline',
      contrastRatio: '3:1 minimum',
      elements: ['buttons', 'links', 'inputs', 'selects', 'checkboxes'],
      browsers: ['Chrome', 'Firefox', 'Safari', 'Edge'],
    },
    expected: 'Every interactive element has a clearly visible focus indicator with at least 3:1 contrast ratio against adjacent colors.',
    actual: null,
    time: null,
  },
  {
    id: 'KB-003',
    name: 'Keyboard Shortcut for Quick Balance Check',
    priority: 'P1',
    status: 'not_run',
    category: 'Keyboard Navigation',
    steps: [
      'Press designated keyboard shortcut (Alt+B) from any page',
      'Verify account balance summary dialog appears',
      'Check shortcut does not conflict with browser/OS shortcuts',
      'Verify shortcut is documented in keyboard help (Alt+/)',
    ],
    testData: {
      shortcut: 'Alt+B',
      helpShortcut: 'Alt+/',
      conflictCheck: ['browser', 'OS', 'screen reader'],
      customizable: true,
    },
    expected: 'Alt+B opens balance summary overlay. No conflict with assistive technology shortcuts. Shortcut listed in help dialog.',
    actual: null,
    time: null,
  },
  {
    id: 'KB-004',
    name: 'Dropdown/Select Menu Keyboard Operation',
    priority: 'P0',
    status: 'not_run',
    category: 'Keyboard Navigation',
    steps: [
      'Focus on account type dropdown using Tab',
      'Open dropdown with Enter/Space/Alt+Down',
      'Navigate options with Up/Down arrow keys',
      'Select option with Enter key',
      'Verify type-ahead character search works',
    ],
    testData: {
      dropdownType: 'Account Type Selector',
      options: ['Savings', 'Current', 'Fixed Deposit', 'Recurring Deposit'],
      typeAhead: true,
      multiSelect: false,
    },
    expected: 'Dropdown opens with Enter/Space. Arrow keys navigate. Enter selects. Escape closes without selection. Type-ahead jumps to matching option.',
    actual: null,
    time: null,
  },
  {
    id: 'KB-005',
    name: 'Date Picker Keyboard Accessibility',
    priority: 'P1',
    status: 'not_run',
    category: 'Keyboard Navigation',
    steps: [
      'Tab to date picker field for transaction date range',
      'Open calendar widget with Enter/Space',
      'Navigate days with arrow keys, months with Page Up/Down',
      'Select date with Enter and verify field updates',
      'Verify manual date entry as alternative input method',
    ],
    testData: {
      dateFormat: 'MM/DD/YYYY',
      rangeSelector: true,
      minDate: '01/01/2020',
      maxDate: 'today',
      manualEntry: true,
    },
    expected: 'Calendar navigable entirely by keyboard. Arrow keys move between days. Page Up/Down changes months. Enter selects. Manual text entry supported.',
    actual: null,
    time: null,
  },
  {
    id: 'KB-006',
    name: 'Modal Dialog Keyboard Trap and Escape',
    priority: 'P0',
    status: 'not_run',
    category: 'Keyboard Navigation',
    steps: [
      'Open confirmation modal using keyboard (Enter on trigger)',
      'Verify focus moves inside modal automatically',
      'Tab through all focusable elements within modal',
      'Verify Tab wraps from last to first element (focus trap)',
      'Press Escape to close modal and verify focus returns to trigger',
    ],
    testData: {
      modalType: 'Transfer Confirmation',
      focusableElements: ['Close button', 'Cancel button', 'Confirm button'],
      initialFocus: 'first focusable element',
      escapeCloses: true,
    },
    expected: 'Focus trapped inside modal. Tab cycles between modal elements. Escape closes modal. Focus returns to the element that triggered the modal.',
    actual: null,
    time: null,
  },
  {
    id: 'KB-007',
    name: 'Data Table Keyboard Navigation',
    priority: 'P1',
    status: 'not_run',
    category: 'Keyboard Navigation',
    steps: [
      'Focus on transaction history data table',
      'Navigate between cells using arrow keys',
      'Sort columns using Enter on column headers',
      'Activate row actions using Enter/Space on action buttons',
      'Verify pagination controls are keyboard accessible',
    ],
    testData: {
      rows: 25,
      columns: 6,
      sortableColumns: 4,
      rowActions: ['View Details', 'Download Receipt'],
      pagination: true,
    },
    expected: 'Arrow keys navigate between table cells. Enter activates sort on headers. Row action buttons focusable and activatable. Pagination fully keyboard accessible.',
    actual: null,
    time: null,
  },
  {
    id: 'KB-008',
    name: 'Keyboard Access to All Menu Items',
    priority: 'P0',
    status: 'not_run',
    category: 'Keyboard Navigation',
    steps: [
      'Focus on main navigation menu bar',
      'Navigate top-level items with Left/Right arrow keys',
      'Open submenus with Enter/Down arrow',
      'Navigate submenu items with Up/Down arrow keys',
      'Select item with Enter and verify navigation occurs',
    ],
    testData: {
      menuItems: ['Dashboard', 'Accounts', 'Transfers', 'Payments', 'Settings'],
      subMenuDepth: 2,
      menuPattern: 'ARIA menubar',
      role: 'menubar',
    },
    expected: 'Menu bar navigable with arrow keys. Submenus open with Enter/Down. Escape closes submenu. All menu actions accessible via keyboard.',
    actual: null,
    time: null,
  },
  {
    id: 'KB-009',
    name: 'Form Submission via Enter Key',
    priority: 'P0',
    status: 'not_run',
    category: 'Keyboard Navigation',
    steps: [
      'Fill out quick transfer form fields using keyboard only',
      'Press Enter while focused on any form field',
      'Verify form submission is triggered correctly',
      'Check that Enter in multi-line textarea does not submit',
      'Verify submit confirmation feedback is keyboard accessible',
    ],
    testData: {
      formType: 'Quick Transfer',
      submitOnEnter: true,
      textareaException: true,
      confirmationDialog: true,
      fields: 5,
    },
    expected: 'Enter key submits single-line forms. Multi-line fields allow Enter for new line. Confirmation dialog appears and is keyboard accessible.',
    actual: null,
    time: null,
  },
  {
    id: 'KB-010',
    name: 'Focus Management After Page Navigation',
    priority: 'P1',
    status: 'not_run',
    category: 'Keyboard Navigation',
    steps: [
      'Navigate from dashboard to account details via keyboard',
      'Verify focus is placed on the main content heading of new page',
      'Use browser back button and verify focus is restored',
      'Check focus management after AJAX content updates',
    ],
    testData: {
      navigation: 'SPA client-side routing',
      focusTarget: 'h1 or main content',
      backNavigation: true,
      ajaxUpdates: ['account list refresh', 'transaction filter'],
    },
    expected: 'On page change, focus moves to main heading or content. Browser back restores previous focus position. AJAX updates announce but preserve focus.',
    actual: null,
    time: null,
  },
];

/* ================================================================
   TAB 3: VISUAL ACCESSIBILITY (10 scenarios)
   ================================================================ */
const VISUAL_SCENARIOS = [
  {
    id: 'VA-001',
    name: 'Color Contrast Ratio (WCAG AA 4.5:1)',
    priority: 'P0',
    status: 'not_run',
    category: 'Visual Accessibility',
    steps: [
      'Run automated contrast checker on all pages (axe-core)',
      'Manually check text on colored backgrounds (buttons, alerts, badges)',
      'Verify body text meets 4.5:1 ratio against background',
      'Verify large text (18px+ bold or 24px+) meets 3:1 ratio',
      'Check placeholder text contrast (minimum 4.5:1)',
    ],
    testData: {
      tool: 'axe-core + manual check',
      wcagLevel: 'AA',
      normalTextRatio: '4.5:1',
      largeTextRatio: '3:1',
      pages: ['Dashboard', 'Forms', 'Tables', 'Modals'],
    },
    expected: 'All normal text has 4.5:1 contrast ratio. Large text has 3:1 minimum. No text-on-background combination fails WCAG AA requirements.',
    actual: null,
    time: null,
  },
  {
    id: 'VA-002',
    name: 'Text Resize Up to 200% Without Loss',
    priority: 'P0',
    status: 'not_run',
    category: 'Visual Accessibility',
    steps: [
      'Set browser zoom to 200%',
      'Verify all content remains visible and readable',
      'Check no horizontal scrolling is required for single-column content',
      'Verify no text is clipped, truncated, or overlapping',
      'Check that interactive elements remain usable at 200%',
    ],
    testData: {
      zoomLevels: ['100%', '150%', '200%'],
      viewport: '1280x720',
      contentTypes: ['text', 'forms', 'tables', 'charts'],
      browser: 'Chrome, Firefox, Safari',
    },
    expected: 'At 200% zoom, all content visible without horizontal scroll. No text clipping or overlap. All interactions still functional.',
    actual: null,
    time: null,
  },
  {
    id: 'VA-003',
    name: 'High Contrast Mode Support',
    priority: 'P1',
    status: 'not_run',
    category: 'Visual Accessibility',
    steps: [
      'Enable Windows High Contrast mode (Settings > Accessibility)',
      'Navigate through banking application pages',
      'Verify all text remains readable in high contrast',
      'Check that focus indicators are visible in high contrast',
      'Verify custom icons/images adapt or have fallback',
    ],
    testData: {
      modes: ['High Contrast Black', 'High Contrast White', 'Custom'],
      os: 'Windows 10/11',
      browser: 'Edge, Chrome',
      forcedColorsSupport: true,
    },
    expected: 'Application is fully usable in Windows High Contrast mode. Text, borders, and focus indicators adapt. No information lost due to color changes.',
    actual: null,
    time: null,
  },
  {
    id: 'VA-004',
    name: 'Color-Blind Safe Transaction Status Indicators',
    priority: 'P0',
    status: 'not_run',
    category: 'Visual Accessibility',
    steps: [
      'Check that transaction status is not conveyed by color alone',
      'Verify status uses text labels, icons, or patterns alongside color',
      'Test with color blindness simulation (Protanopia, Deuteranopia, Tritanopia)',
      'Verify charts use patterns/textures in addition to colors',
    ],
    testData: {
      statuses: ['Completed', 'Pending', 'Failed', 'Processing'],
      simulationTool: 'Chrome DevTools > Rendering > Emulate vision deficiencies',
      colorBlindTypes: ['Protanopia', 'Deuteranopia', 'Tritanopia', 'Achromatopsia'],
      indicatorTypes: ['color + icon + text'],
    },
    expected: 'Every status indicator uses color plus at least one other visual differentiator (icon, text, pattern). Distinguishable in all color blindness types.',
    actual: null,
    time: null,
  },
  {
    id: 'VA-005',
    name: 'Focus Indicator Visibility (3:1 Contrast)',
    priority: 'P0',
    status: 'not_run',
    category: 'Visual Accessibility',
    steps: [
      'Tab through all interactive elements on banking pages',
      'Measure focus indicator contrast against adjacent colors',
      'Verify focus indicator is at least 2px wide',
      'Check focus indicator is visible on all background colors',
    ],
    testData: {
      contrastMinimum: '3:1',
      focusWidth: '2px minimum',
      backgrounds: ['white', 'dark blue', 'gray cards', 'modals'],
      style: 'outline or box-shadow',
    },
    expected: 'Focus indicator has 3:1 contrast ratio against all adjacent backgrounds. Indicator is at least 2px wide and clearly visible.',
    actual: null,
    time: null,
  },
  {
    id: 'VA-006',
    name: 'Touch Target Size (44x44px Minimum)',
    priority: 'P1',
    status: 'not_run',
    category: 'Visual Accessibility',
    steps: [
      'Measure all clickable/tappable elements on mobile viewport',
      'Verify buttons, links, and controls are at least 44x44px',
      'Check spacing between adjacent touch targets (8px minimum)',
      'Verify small inline links have adequate touch area via padding',
    ],
    testData: {
      minimumSize: '44x44px',
      spacing: '8px minimum between targets',
      viewport: '375px mobile',
      elementsToCheck: ['buttons', 'links', 'checkboxes', 'radio buttons', 'icons'],
    },
    expected: 'All touch targets meet 44x44px minimum. Adjacent targets have adequate spacing. Small text links have expanded touch area.',
    actual: null,
    time: null,
  },
  {
    id: 'VA-007',
    name: 'Animation/Motion Reduction (prefers-reduced-motion)',
    priority: 'P1',
    status: 'not_run',
    category: 'Visual Accessibility',
    steps: [
      'Enable "Reduce motion" in OS accessibility settings',
      'Navigate through banking application',
      'Verify CSS animations are disabled or minimized',
      'Check that page transitions use simple fades instead of slides',
      'Verify loading spinners use reduced motion alternatives',
    ],
    testData: {
      cssMediaQuery: 'prefers-reduced-motion: reduce',
      animatedElements: ['page transitions', 'loading spinners', 'chart animations', 'notifications'],
      os: 'macOS, Windows, iOS, Android',
      fallback: 'instant/fade transitions',
    },
    expected: 'With prefers-reduced-motion enabled, all animations are disabled or replaced with subtle alternatives. No vestibular-triggering motion.',
    actual: null,
    time: null,
  },
  {
    id: 'VA-008',
    name: 'Dark Mode Accessibility Compliance',
    priority: 'P1',
    status: 'not_run',
    category: 'Visual Accessibility',
    steps: [
      'Toggle dark mode in banking application settings',
      'Run contrast checker on all dark mode pages',
      'Verify text contrast meets WCAG AA in dark mode',
      'Check images and icons adapt to dark background',
      'Verify form fields have visible borders in dark mode',
    ],
    testData: {
      darkBg: '#1a1a2e',
      textColor: '#ffffff',
      mutedText: '#b0bec5',
      contrastCheck: 'all pages in dark mode',
      imageTreatment: 'invert or dark-optimized versions',
    },
    expected: 'Dark mode maintains WCAG AA contrast ratios. All UI elements visible and distinguishable. No white-flash during page loads.',
    actual: null,
    time: null,
  },
  {
    id: 'VA-009',
    name: 'Print Stylesheet Accessibility',
    priority: 'P2',
    status: 'not_run',
    category: 'Visual Accessibility',
    steps: [
      'Open bank statement page and trigger Print Preview (Ctrl+P)',
      'Verify content reformats for print (no navigation, no dark background)',
      'Check all text is black on white for maximum readability',
      'Verify URLs are displayed for printed links',
      'Check page breaks do not split tables or transaction groups',
    ],
    testData: {
      printPages: ['Account Statement', 'Transaction Report', 'Tax Summary'],
      mediaQuery: '@media print',
      colors: 'black text on white background',
      linkDisplay: 'show href after link text',
    },
    expected: 'Print version uses black-on-white high contrast. Navigation hidden. Links show URLs. Tables not broken across pages. Clean professional output.',
    actual: null,
    time: null,
  },
  {
    id: 'VA-010',
    name: 'Responsive Layout at Various Zoom Levels',
    priority: 'P1',
    status: 'not_run',
    category: 'Visual Accessibility',
    steps: [
      'Test application at 100%, 125%, 150%, 175%, 200% zoom',
      'Verify layout reflows properly at each zoom level',
      'Check that content does not require 2D scrolling at 400% (WCAG 1.4.10)',
      'Verify no content or functionality is lost at any zoom level',
    ],
    testData: {
      zoomLevels: ['100%', '125%', '150%', '175%', '200%', '400%'],
      viewport: '1280x720 base',
      wcagCriteria: '1.4.10 Reflow',
      breakpoints: ['desktop', 'tablet', 'mobile'],
    },
    expected: 'Layout reflows gracefully at all zoom levels. At 400% zoom, single column layout with vertical-only scroll. No content or functionality lost.',
    actual: null,
    time: null,
  },
];

/* ================================================================
   TAB 4: WCAG COMPLIANCE (12 scenarios)
   ================================================================ */
const WCAG_SCENARIOS = [
  {
    id: 'WC-001',
    name: 'WCAG 2.1 Level A Automated Scan',
    priority: 'P0',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Run axe-core automated scan on all banking pages',
      'Record all Level A violations with element selectors',
      'Categorize violations by impact (critical, serious, moderate, minor)',
      'Generate remediation report with code fix suggestions',
    ],
    testData: {
      tool: 'axe-core 4.8 + Lighthouse',
      pages: 12,
      wcagLevel: 'A',
      ruleCount: 78,
    },
    expected: 'Zero critical or serious Level A violations. All automated rules pass. Report generated with any remaining moderate/minor issues.',
    actual: null,
    time: null,
  },
  {
    id: 'WC-002',
    name: 'WCAG 2.1 Level AA Automated Scan',
    priority: 'P0',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Run axe-core scan with Level AA ruleset enabled',
      'Check contrast requirements (1.4.3 and 1.4.6)',
      'Verify reflow at 320px viewport width (1.4.10)',
      'Check text spacing override support (1.4.12)',
      'Validate all AA success criteria automated checks pass',
    ],
    testData: {
      tool: 'axe-core 4.8',
      pages: 12,
      wcagLevel: 'AA',
      additionalCriteria: ['1.4.3', '1.4.6', '1.4.10', '1.4.12', '1.4.11'],
    },
    expected: 'Zero critical AA violations. Contrast ratios pass. Reflow works at 320px. Text spacing adjustable without content loss.',
    actual: null,
    time: null,
  },
  {
    id: 'WC-003',
    name: 'Perceivable: Text Alternatives for Non-Text Content',
    priority: 'P0',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Audit all images for appropriate alt text (1.1.1)',
      'Check CAPTCHAs have alternative access methods',
      'Verify decorative images are hidden from assistive tech',
      'Check SVG icons have accessible names via title/aria-label',
    ],
    testData: {
      criterion: '1.1.1 Non-text Content',
      images: 45,
      svgIcons: 32,
      decorative: 15,
      captcha: 'alternative audio CAPTCHA provided',
    },
    expected: 'All informational images have descriptive alt text. Decorative images have empty alt. SVG icons have accessible names. CAPTCHA alternatives available.',
    actual: null,
    time: null,
  },
  {
    id: 'WC-004',
    name: 'Perceivable: Captions for Multimedia',
    priority: 'P1',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Check all video content for captions (1.2.2)',
      'Verify captions are synchronized with audio',
      'Check audio-only content has text transcripts (1.2.1)',
      'Verify user can toggle captions on/off',
    ],
    testData: {
      criterion: '1.2.1, 1.2.2, 1.2.3',
      videos: ['product tutorial', 'security awareness', 'mobile app guide'],
      captionFormat: 'WebVTT',
      transcriptAvailable: true,
    },
    expected: 'All videos have synchronized captions. Audio content has transcripts. Captions toggleable by user. Caption timing accurate within 1 second.',
    actual: null,
    time: null,
  },
  {
    id: 'WC-005',
    name: 'Operable: Sufficient Time for Transactions',
    priority: 'P0',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Identify all time-limited operations (session timeout, OTP expiry)',
      'Verify users are warned before timeout (2.2.1)',
      'Check users can extend or disable time limits',
      'Verify session extension does not lose entered data',
    ],
    testData: {
      criterion: '2.2.1 Timing Adjustable',
      sessionTimeout: '15 minutes',
      otpExpiry: '5 minutes',
      warningBefore: '2 minutes',
      extensionAllowed: true,
    },
    expected: 'Users warned 2 minutes before session timeout. Extension available. OTP can be resent. No data loss during timeout extension.',
    actual: null,
    time: null,
  },
  {
    id: 'WC-006',
    name: 'Operable: Seizure-Safe Animations',
    priority: 'P0',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Audit all animated content on banking pages (2.3.1)',
      'Verify no content flashes more than 3 times per second',
      'Check that auto-playing animations can be paused/stopped',
      'Verify parallax effects respect prefers-reduced-motion',
    ],
    testData: {
      criterion: '2.3.1 Three Flashes or Below',
      animatedElements: ['loading spinners', 'chart transitions', 'notification banners'],
      autoPlay: false,
      flashFrequency: 'below 3 Hz threshold',
    },
    expected: 'No content flashes more than 3 times/second. Auto-play animations pausable. Reduced motion preference respected. No seizure-triggering content.',
    actual: null,
    time: null,
  },
  {
    id: 'WC-007',
    name: 'Understandable: Consistent Navigation',
    priority: 'P1',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Navigate through multiple pages and verify consistent menu placement (3.2.3)',
      'Check that repeated components appear in same relative order',
      'Verify navigation labels are consistent across pages',
      'Check that similar functions have consistent labels',
    ],
    testData: {
      criterion: '3.2.3 Consistent Navigation',
      pages: ['Dashboard', 'Accounts', 'Transfers', 'Payments', 'Profile'],
      navigationPosition: 'left sidebar or top bar',
      consistentLabels: true,
    },
    expected: 'Navigation appears in same position on all pages. Menu items in consistent order. Labels identical for same functions across pages.',
    actual: null,
    time: null,
  },
  {
    id: 'WC-008',
    name: 'Understandable: Input Assistance and Error Prevention',
    priority: 'P0',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Submit forms with errors and verify clear error identification (3.3.1)',
      'Check that error suggestions are provided (3.3.3)',
      'Verify financial transactions have confirmation step (3.3.4)',
      'Check that submitted data can be reviewed before final submission',
    ],
    testData: {
      criterion: '3.3.1, 3.3.3, 3.3.4, 3.3.6',
      formTypes: ['transfer', 'bill payment', 'profile update'],
      errorFormat: 'inline + summary',
      confirmationStep: true,
      reversible: 'within 24 hours',
    },
    expected: 'Errors clearly identified with suggestions. Financial transactions require confirmation. Data reviewable before submission. Transactions reversible.',
    actual: null,
    time: null,
  },
  {
    id: 'WC-009',
    name: 'Robust: Parsing and Name/Role/Value',
    priority: 'P0',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Validate HTML with W3C Markup Validator (4.1.1)',
      'Check all custom components expose correct ARIA roles (4.1.2)',
      'Verify name, role, value, and state for custom widgets',
      'Check that programmatic state changes are communicated to AT',
    ],
    testData: {
      criterion: '4.1.1, 4.1.2',
      validator: 'W3C Nu HTML Checker',
      customWidgets: ['date picker', 'combobox', 'accordion', 'tab panel'],
      ariaRoles: ['tablist', 'tab', 'tabpanel', 'dialog', 'alert'],
    },
    expected: 'Valid HTML with no parsing errors. All custom widgets have correct ARIA roles, names, and states. State changes communicated to assistive technology.',
    actual: null,
    time: null,
  },
  {
    id: 'WC-010',
    name: 'ARIA Landmark Roles on Banking Pages',
    priority: 'P1',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Inspect each page for proper landmark regions',
      'Verify single main landmark exists on each page',
      'Check navigation, banner, contentinfo, and complementary regions',
      'Verify landmark labels differentiate multiple instances of same type',
    ],
    testData: {
      requiredLandmarks: ['banner', 'navigation', 'main', 'contentinfo'],
      optionalLandmarks: ['complementary', 'search', 'form'],
      uniqueLabels: true,
      pagesAudited: 8,
    },
    expected: 'Each page has banner, navigation, main, and contentinfo landmarks. Multiple navigation regions labeled uniquely. Screen reader landmark navigation works.',
    actual: null,
    time: null,
  },
  {
    id: 'WC-011',
    name: 'Language Attribute on Page Elements',
    priority: 'P1',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Verify html element has lang attribute set correctly (3.1.1)',
      'Check content in other languages has lang attribute on container (3.1.2)',
      'Verify screen reader switches pronunciation for marked sections',
      'Check that language codes follow BCP 47 standard',
    ],
    testData: {
      criterion: '3.1.1, 3.1.2',
      primaryLanguage: 'en',
      secondaryLanguages: ['hi', 'ta', 'bn'],
      bcp47Compliant: true,
      multilingual: 'regional language support',
    },
    expected: 'HTML lang="en" set on root. Foreign language content marked with appropriate lang attribute. Screen reader pronunciation adapts correctly.',
    actual: null,
    time: null,
  },
  {
    id: 'WC-012',
    name: 'Form Input Purpose Identification (autocomplete)',
    priority: 'P1',
    status: 'not_run',
    category: 'WCAG Compliance',
    steps: [
      'Check all personal info fields have autocomplete attribute (1.3.5)',
      'Verify autocomplete values match field purpose correctly',
      'Test browser autofill populates fields correctly',
      'Verify autocomplete works on account opening and profile forms',
    ],
    testData: {
      criterion: '1.3.5 Identify Input Purpose',
      autocompleteFields: {
        name: 'name', email: 'email', phone: 'tel',
        address: 'street-address', city: 'address-level2',
      },
      forms: ['account opening', 'profile update', 'KYC form'],
      browserSupport: ['Chrome', 'Firefox', 'Safari', 'Edge'],
    },
    expected: 'All personal data fields have correct autocomplete attributes. Browser autofill works correctly. Field purpose identifiable by assistive technology.',
    actual: null,
    time: null,
  },
];

/* ================================================================
   TAB 5: ASSISTIVE TECHNOLOGY (10 scenarios)
   ================================================================ */
const ASSISTIVE_TECH_SCENARIOS = [
  {
    id: 'AT-001',
    name: 'Voice Control (Dragon NaturallySpeaking) Banking Ops',
    priority: 'P1',
    status: 'not_run',
    category: 'Assistive Technology',
    steps: [
      'Activate Dragon NaturallySpeaking with banking application open',
      'Use voice commands to navigate to account summary ("Click Accounts")',
      'Initiate fund transfer using voice commands',
      'Complete amount entry and submit using speech',
    ],
    testData: {
      software: 'Dragon NaturallySpeaking 16',
      commands: ['Click Accounts', 'Show Numbers', 'Type 5000', 'Click Submit'],
      visibleLabels: true,
      gridOverlay: 'supported',
    },
    expected: 'All interactive elements activatable by voice. Visible labels match accessible names. Voice dictation works in form fields. Grid overlay provides fallback.',
    actual: null,
    time: null,
  },
  {
    id: 'AT-002',
    name: 'Switch Access Device Compatibility',
    priority: 'P2',
    status: 'not_run',
    category: 'Assistive Technology',
    steps: [
      'Connect single-switch or dual-switch access device',
      'Enable switch scanning mode in OS accessibility settings',
      'Navigate through banking application using switch scanning',
      'Complete a balance inquiry and simple transfer using switches only',
    ],
    testData: {
      device: 'AbleNet Switch',
      scanMode: 'row-column scanning',
      scanSpeed: '1.5 seconds',
      switchCount: 2,
    },
    expected: 'All interactive elements reachable via switch scanning. Scan groups are logical. Selection activates elements correctly. No timeout issues during scanning.',
    actual: null,
    time: null,
  },
  {
    id: 'AT-003',
    name: 'Magnification Software (ZoomText) Compatibility',
    priority: 'P1',
    status: 'not_run',
    category: 'Assistive Technology',
    steps: [
      'Activate ZoomText at 4x magnification',
      'Navigate through banking dashboard and forms',
      'Verify text remains sharp and readable when magnified',
      'Check that focus tracking follows keyboard focus',
      'Verify color enhancement mode does not break UI',
    ],
    testData: {
      software: 'ZoomText 2024',
      magnification: '4x',
      textEnhancement: true,
      focusTracking: true,
      colorModes: ['normal', 'inverted', 'high contrast'],
    },
    expected: 'Application usable at 4x magnification. Focus tracking keeps active element visible. Text remains crisp. Color enhancements do not break layout.',
    actual: null,
    time: null,
  },
  {
    id: 'AT-004',
    name: 'Braille Display Support for Account Info',
    priority: 'P2',
    status: 'not_run',
    category: 'Assistive Technology',
    steps: [
      'Connect refreshable Braille display device',
      'Navigate to account balance page',
      'Verify account information renders correctly on Braille display',
      'Check that currency amounts are formatted for Braille reading',
      'Navigate transaction table using Braille display commands',
    ],
    testData: {
      device: 'HumanWare Brailliant BI 40',
      cells: 40,
      screenReader: 'JAWS with Braille output',
      currencyFormat: '$XX,XXX.XX',
      tableNavigation: true,
    },
    expected: 'Account data rendered correctly on Braille display. Currency properly formatted. Table navigation via Braille commands works. No garbled output.',
    actual: null,
    time: null,
  },
  {
    id: 'AT-005',
    name: 'Eye Tracking Device Compatibility',
    priority: 'P2',
    status: 'not_run',
    category: 'Assistive Technology',
    steps: [
      'Calibrate eye tracking device (Tobii) with banking application',
      'Navigate through menus using gaze and dwell activation',
      'Click buttons and links using eye gaze selection',
      'Complete a simple transaction using eye tracking only',
    ],
    testData: {
      device: 'Tobii Dynavox PCEye 5',
      activationMethod: 'dwell (800ms)',
      targetSize: '44x44px minimum',
      calibrationAccuracy: '< 0.5 degrees',
    },
    expected: 'All interactive targets large enough for eye gaze selection. Dwell activation works reliably. No accidental activations from adjacent targets.',
    actual: null,
    time: null,
  },
  {
    id: 'AT-006',
    name: 'Mobile Screen Reader (TalkBack/VoiceOver) Banking App',
    priority: 'P0',
    status: 'not_run',
    category: 'Assistive Technology',
    steps: [
      'Enable TalkBack (Android) or VoiceOver (iOS)',
      'Navigate through banking app using swipe gestures',
      'Verify all elements announce correctly with role and state',
      'Complete fund transfer using screen reader gestures only',
      'Check custom gesture support for common actions',
    ],
    testData: {
      android: 'TalkBack 14.1',
      ios: 'VoiceOver iOS 17',
      gestures: ['swipe left/right', 'double-tap', 'two-finger swipe'],
      devices: ['Pixel 7', 'iPhone 15 Pro'],
    },
    expected: 'All app elements accessible via TalkBack/VoiceOver. Gestures work for navigation and activation. Custom actions announced. No unlabeled elements.',
    actual: null,
    time: null,
  },
  {
    id: 'AT-007',
    name: 'Speech-to-Text for Banking Search',
    priority: 'P1',
    status: 'not_run',
    category: 'Assistive Technology',
    steps: [
      'Activate OS speech-to-text (Windows Speech Recognition / macOS Dictation)',
      'Dictate search query in banking app search field',
      'Verify search results match dictated query',
      'Test with banking-specific terms (NEFT, RTGS, IMPS, KYC)',
    ],
    testData: {
      stt: 'OS native speech-to-text',
      bankingTerms: ['NEFT transfer', 'account statement', 'fixed deposit', 'KYC update'],
      accuracy: '> 95% for common banking terms',
      fieldTypes: ['search', 'text input', 'amount'],
    },
    expected: 'Speech-to-text input works in all text fields. Banking terminology recognized correctly. Search returns relevant results from dictated query.',
    actual: null,
    time: null,
  },
  {
    id: 'AT-008',
    name: 'Alternative Input Device Testing',
    priority: 'P2',
    status: 'not_run',
    category: 'Assistive Technology',
    steps: [
      'Test with head-tracking mouse alternative (e.g., Head Mouse Nano)',
      'Test with mouth-operated joystick (Jouse3)',
      'Verify all interactive elements are reachable and activatable',
      'Check that no hover-dependent interactions block access',
    ],
    testData: {
      devices: ['Head Mouse Nano', 'Jouse3', 'sip-and-puff'],
      hoverDependencies: 'none (all interactions on click)',
      targetSize: '44x44px minimum',
      precisionRequired: 'low (large targets)',
    },
    expected: 'Application fully operable with alternative input devices. No hover-only interactions. Large click targets accommodate low-precision input.',
    actual: null,
    time: null,
  },
  {
    id: 'AT-009',
    name: 'Cognitive Accessibility (Simple Language, Clear Layout)',
    priority: 'P1',
    status: 'not_run',
    category: 'Assistive Technology',
    steps: [
      'Review all banking content for plain language (CEFR B1 level)',
      'Check that complex terms have tooltips or glossary links',
      'Verify consistent and predictable page layouts',
      'Check that instructions are clear and step-by-step',
      'Verify error messages use simple, actionable language',
    ],
    testData: {
      readingLevel: 'CEFR B1 (intermediate)',
      glossaryTerms: ['APR', 'EMI', 'CIBIL', 'NEFT', 'RTGS', 'KYC'],
      layoutConsistency: true,
      stepByStepGuides: true,
    },
    expected: 'Content written at B1 reading level. Complex terms explained. Layouts consistent and predictable. Error messages clear and actionable.',
    actual: null,
    time: null,
  },
  {
    id: 'AT-010',
    name: 'Motor Disability Accommodation Testing',
    priority: 'P1',
    status: 'not_run',
    category: 'Assistive Technology',
    steps: [
      'Test all drag-and-drop interactions for keyboard alternatives',
      'Verify no time-dependent interactions require fast motor response',
      'Check that double-click actions have single-click alternatives',
      'Verify complex gestures (pinch, multi-finger) have simple alternatives',
    ],
    testData: {
      dragDrop: 'keyboard reorder with arrow keys',
      timeDependent: 'extended timeout option available',
      doubleClick: 'single-click or keyboard Enter',
      complexGestures: 'button alternatives provided',
    },
    expected: 'All interactions achievable with limited motor ability. No fast-response requirements. Keyboard alternatives for all pointer gestures. Timeouts extendable.',
    actual: null,
    time: null,
  },
];

/* ================================================================
   TAB 6: COMPLIANCE & AUDIT (10 scenarios)
   ================================================================ */
const COMPLIANCE_AUDIT_SCENARIOS = [
  {
    id: 'CA-001',
    name: 'ADA Section 508 Compliance Verification',
    priority: 'P0',
    status: 'not_run',
    category: 'Compliance & Audit',
    steps: [
      'Map Section 508 technical standards to application features',
      'Run ANDI automated scan for 508 compliance',
      'Verify all Electronic and Information Technology (EIT) meets standards',
      'Document compliance status for each 508 provision',
    ],
    testData: {
      standard: 'Section 508 (Revised 2017)',
      tool: 'ANDI (Accessible Name & Description Inspector)',
      provisions: ['E205 Electronic Content', 'E501 General', 'E502 Interoperability'],
      jurisdiction: 'United States Federal',
    },
    expected: 'Application meets all applicable Section 508 revised standards. ANDI scan reports zero violations. Compliance documented for each provision.',
    actual: null,
    time: null,
  },
  {
    id: 'CA-002',
    name: 'AODA (Ontario) Compliance for Canadian Banking',
    priority: 'P1',
    status: 'not_run',
    category: 'Compliance & Audit',
    steps: [
      'Map AODA IASR requirements to banking application',
      'Verify WCAG 2.0 Level AA compliance (AODA minimum)',
      'Check multi-year accessibility plan documentation',
      'Verify customer feedback mechanism for accessibility issues',
    ],
    testData: {
      standard: 'AODA - IASR (Information and Communications)',
      wcagLevel: 'WCAG 2.0 AA (minimum)',
      deadline: 'January 1, 2025 (large org)',
      feedbackMechanism: 'email, phone, online form',
    },
    expected: 'Application meets AODA IASR requirements. WCAG 2.0 AA compliance achieved. Accessibility feedback mechanism in place and documented.',
    actual: null,
    time: null,
  },
  {
    id: 'CA-003',
    name: 'EN 301 549 European Accessibility Standard',
    priority: 'P1',
    status: 'not_run',
    category: 'Compliance & Audit',
    steps: [
      'Map EN 301 549 V3.2.1 requirements to application',
      'Verify web content meets Chapter 9 (WCAG 2.1 Level AA)',
      'Check software requirements in Chapter 11',
      'Validate documentation meets Chapter 12 requirements',
    ],
    testData: {
      standard: 'EN 301 549 V3.2.1 (2021-03)',
      chapters: ['Ch.9 Web', 'Ch.11 Software', 'Ch.12 Documentation'],
      wcagMapping: 'WCAG 2.1 Level AA',
      euDirective: 'Web Accessibility Directive 2016/2102',
    },
    expected: 'Application meets EN 301 549 requirements for web content. Software and documentation accessibility verified. EU Web Accessibility Directive compliance.',
    actual: null,
    time: null,
  },
  {
    id: 'CA-004',
    name: 'VPAT Documentation Generation',
    priority: 'P1',
    status: 'not_run',
    category: 'Compliance & Audit',
    steps: [
      'Create VPAT using ITI VPAT 2.4 template',
      'Document conformance level for each WCAG criterion',
      'Include remarks and explanations for partial conformance',
      'Review VPAT with accessibility team for accuracy',
      'Publish VPAT on banking website accessibility page',
    ],
    testData: {
      template: 'ITI VPAT 2.4 Rev (WCAG edition)',
      conformanceLevels: ['Supports', 'Partially Supports', 'Does Not Support', 'Not Applicable'],
      sections: ['WCAG 2.1 Level A', 'WCAG 2.1 Level AA', 'Section 508'],
      reviewers: 3,
    },
    expected: 'Complete VPAT document covering all WCAG criteria. Accurate conformance levels documented. Published and publicly accessible.',
    actual: null,
    time: null,
  },
  {
    id: 'CA-005',
    name: 'Accessibility Audit Report Creation',
    priority: 'P0',
    status: 'not_run',
    category: 'Compliance & Audit',
    steps: [
      'Conduct combined automated + manual accessibility audit',
      'Document all findings with severity, impact, and remediation steps',
      'Include screenshots and screen reader output for each issue',
      'Prioritize findings by user impact and legal risk',
      'Create executive summary with compliance score',
    ],
    testData: {
      auditScope: '12 key banking pages',
      tools: ['axe-core', 'WAVE', 'Lighthouse', 'manual NVDA/JAWS'],
      severityLevels: ['Critical', 'Major', 'Minor', 'Best Practice'],
      deliverables: ['detailed report', 'executive summary', 'remediation backlog'],
    },
    expected: 'Comprehensive audit report with all issues documented. Clear remediation steps. Executive summary with compliance percentage. Prioritized backlog created.',
    actual: null,
    time: null,
  },
  {
    id: 'CA-006',
    name: 'User Testing with Disabled Participants',
    priority: 'P0',
    status: 'not_run',
    category: 'Compliance & Audit',
    steps: [
      'Recruit 5+ participants with various disabilities',
      'Design task-based testing scenarios for banking workflows',
      'Conduct moderated testing sessions with assistive technology',
      'Document task completion rates, errors, and user feedback',
      'Analyze findings and create improvement recommendations',
    ],
    testData: {
      participants: 8,
      disabilities: ['blind', 'low vision', 'motor impairment', 'cognitive', 'deaf'],
      tasks: ['check balance', 'transfer funds', 'pay bill', 'update profile'],
      compensation: '$75/hour per participant',
    },
    expected: 'All participants can complete core banking tasks. Task completion rate > 80%. Critical barriers identified and documented. Improvement plan created.',
    actual: null,
    time: null,
  },
  {
    id: 'CA-007',
    name: 'Accessibility Bug Severity Classification',
    priority: 'P1',
    status: 'not_run',
    category: 'Compliance & Audit',
    steps: [
      'Define severity classification framework for accessibility bugs',
      'Map WCAG failure to severity (Level A critical = Blocker)',
      'Create Jira/ADO workflow with accessibility severity field',
      'Train QA team on severity classification process',
    ],
    testData: {
      severityMap: {
        Blocker: 'Cannot complete core task (e.g., screen reader cannot login)',
        Critical: 'Workaround exists but task significantly impacted',
        Major: 'Non-core task affected or AA criterion failed',
        Minor: 'Cosmetic or best practice improvement',
      },
      tool: 'Jira with accessibility fields',
      slaTargets: { Blocker: '24 hours', Critical: '1 sprint', Major: '2 sprints', Minor: 'backlog' },
    },
    expected: 'Severity classification framework documented and adopted. Jira workflow configured. Team trained. SLA targets set for each severity level.',
    actual: null,
    time: null,
  },
  {
    id: 'CA-008',
    name: 'Remediation Timeline Tracking',
    priority: 'P1',
    status: 'not_run',
    category: 'Compliance & Audit',
    steps: [
      'Create remediation backlog from audit findings',
      'Set milestone dates for each severity category',
      'Track progress weekly with burn-down metrics',
      'Escalate overdue items to management',
      'Verify fixes with regression testing',
    ],
    testData: {
      totalIssues: 47,
      blockers: 3,
      critical: 8,
      major: 18,
      minor: 18,
      targetDate: '90 days for Blocker+Critical',
    },
    expected: 'Remediation timeline established with milestones. Blockers resolved within 24 hours. Critical issues within one sprint. Weekly progress tracked.',
    actual: null,
    time: null,
  },
  {
    id: 'CA-009',
    name: 'Third-Party Accessibility Certification',
    priority: 'P2',
    status: 'not_run',
    category: 'Compliance & Audit',
    steps: [
      'Select accredited accessibility certification body',
      'Submit application with VPAT and audit reports',
      'Undergo third-party audit process',
      'Address any findings from certification audit',
      'Receive and display accessibility certification badge',
    ],
    testData: {
      certificationBody: 'IAAP, Deque, Level Access',
      certifications: ['WCAG 2.1 AA Conformance', 'Section 508'],
      auditDuration: '4-6 weeks',
      renewalPeriod: 'annual',
    },
    expected: 'Third-party certification obtained. Certification badge displayed on website. Annual renewal process scheduled. Public accessibility statement published.',
    actual: null,
    time: null,
  },
  {
    id: 'CA-010',
    name: 'Continuous Accessibility Monitoring Setup',
    priority: 'P1',
    status: 'not_run',
    category: 'Compliance & Audit',
    steps: [
      'Integrate axe-core into CI/CD pipeline (fail build on violations)',
      'Set up scheduled accessibility scans (weekly full site scan)',
      'Configure Slack/Teams alerts for new accessibility regressions',
      'Create accessibility dashboard with trend metrics',
      'Establish quarterly manual audit cadence',
    ],
    testData: {
      ciTool: 'GitHub Actions / Jenkins',
      scanner: 'axe-core + pa11y-ci',
      schedule: 'weekly full scan, per-PR incremental',
      alertChannel: '#accessibility-alerts',
      dashboard: 'Grafana / custom',
    },
    expected: 'CI/CD blocks PRs with Level A violations. Weekly scans detect regressions. Alerts notify team of new issues. Trend dashboard shows improvement over time.',
    actual: null,
    time: null,
  },
];

/* ================================================================
   TAB DEFINITIONS
   ================================================================ */
const TABS = [
  { id: 'screenReader', label: 'Screen Reader', scenarios: SCREEN_READER_SCENARIOS, count: 10 },
  { id: 'keyboard', label: 'Keyboard Navigation', scenarios: KEYBOARD_SCENARIOS, count: 10 },
  { id: 'visual', label: 'Visual Accessibility', scenarios: VISUAL_SCENARIOS, count: 10 },
  { id: 'wcag', label: 'WCAG Compliance', scenarios: WCAG_SCENARIOS, count: 12 },
  { id: 'assistiveTech', label: 'Assistive Technology', scenarios: ASSISTIVE_TECH_SCENARIOS, count: 10 },
  { id: 'complianceAudit', label: 'Compliance & Audit', scenarios: COMPLIANCE_AUDIT_SCENARIOS, count: 10 },
];

/* ================================================================
   HELPERS
   ================================================================ */
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateActualResult = (scenario) => {
  const passRate = scenario.priority === 'P0' ? 0.75 : scenario.priority === 'P1' ? 0.8 : 0.85;
  const passed = Math.random() < passRate;
  if (passed) {
    return {
      status: 'passed',
      actual: scenario.expected.replace(/\.$/, '') + ' -- Verified successfully.',
      time: `${(randomBetween(800, 4500) / 1000).toFixed(1)}s`,
    };
  }
  const failReasons = [
    'Missing ARIA attribute on one element. Partial compliance detected.',
    'Contrast ratio 3.8:1 found on secondary text -- below 4.5:1 AA threshold.',
    'Focus indicator missing on custom dropdown component.',
    'Screen reader did not announce dynamic content update.',
    'Keyboard trap detected in date picker widget.',
    'Touch target size 32x32px -- below 44x44px minimum.',
    'Heading hierarchy skipped from H2 to H4 on accounts page.',
    'Form error not programmatically associated with input field.',
  ];
  return {
    status: 'failed',
    actual: failReasons[randomBetween(0, failReasons.length - 1)],
    time: `${(randomBetween(1200, 6000) / 1000).toFixed(1)}s`,
  };
};

/* ================================================================
   SUB-COMPONENT: ScenarioPanel (left + right split)
   ================================================================ */
const ScenarioPanel = ({ scenarios: initialScenarios }) => {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const selected = scenarios[selectedIdx];

  const counts = {
    total: scenarios.length,
    passed: scenarios.filter((s) => s.status === 'passed').length,
    failed: scenarios.filter((s) => s.status === 'failed').length,
    notRun: scenarios.filter((s) => s.status === 'not_run').length,
  };

  const runTest = useCallback(() => {
    if (running) return;
    setRunning(true);
    setProgress(0);
    setCurrentStep(0);

    const totalSteps = selected.steps.length;
    let step = 0;

    timerRef.current = setInterval(() => {
      step++;
      if (step < totalSteps) {
        setCurrentStep(step);
        setProgress(Math.round(((step) / totalSteps) * 80));
      } else {
        clearInterval(timerRef.current);
        setProgress(90);

        setTimeout(() => {
          const result = generateActualResult(selected);
          setScenarios((prev) => {
            const updated = [...prev];
            updated[selectedIdx] = {
              ...updated[selectedIdx],
              status: result.status,
              actual: result.actual,
              time: result.time,
            };
            return updated;
          });
          setProgress(100);
          setCurrentStep(totalSteps);
          setRunning(false);
        }, 600);
      }
    }, randomBetween(500, 900));
  }, [running, selected, selectedIdx]);

  /* Cleanup */
  const cleanupTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearTimeout(progressRef.current);
  };

  return (
    <div>
      {/* Summary Stats */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryBox(C.blue)}>
          <p style={styles.summaryValue(C.blue)}>{counts.total}</p>
          <div style={styles.summaryLabel}>Total</div>
        </div>
        <div style={styles.summaryBox(C.green)}>
          <p style={styles.summaryValue(C.green)}>{counts.passed}</p>
          <div style={styles.summaryLabel}>Passed</div>
        </div>
        <div style={styles.summaryBox(C.red)}>
          <p style={styles.summaryValue(C.red)}>{counts.failed}</p>
          <div style={styles.summaryLabel}>Failed</div>
        </div>
        <div style={styles.summaryBox(C.textDim)}>
          <p style={styles.summaryValue(C.textDim)}>{counts.notRun}</p>
          <div style={styles.summaryLabel}>Not Run</div>
        </div>
      </div>

      {/* Split Panel */}
      <div style={styles.splitPanel}>
        {/* LEFT: Scenario List */}
        <div style={styles.leftPanel}>
          {scenarios.map((sc, idx) => (
            <div
              key={sc.id}
              style={idx === selectedIdx ? styles.activeScenario : styles.inactiveScenario}
              onClick={() => { setSelectedIdx(idx); setProgress(0); setCurrentStep(-1); }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.blue, fontFamily: 'monospace' }}>{sc.id}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={styles.badge(priorityColor(sc.priority))}>{sc.priority}</span>
                  <span style={styles.statusBadge(sc.status)}>{statusLabel(sc.status)}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{sc.name}</div>
              {sc.time && (
                <div style={{ fontSize: 10, color: C.textDim, marginTop: 4, fontFamily: 'monospace' }}>
                  Time: {sc.time}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT: Selected Scenario Details */}
        <div style={styles.rightPanel}>
          {selected && (
            <div>
              {/* Header */}
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.blue, fontFamily: 'monospace' }}>{selected.id}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={styles.badge(priorityColor(selected.priority))}>{selected.priority}</span>
                    <span style={styles.statusBadge(selected.status)}>{statusLabel(selected.status)}</span>
                  </div>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.accent, margin: '0 0 4px' }}>{selected.name}</h3>
                <div style={{ fontSize: 12, color: C.textDim }}>{selected.category}</div>
              </div>

              {/* Test Steps */}
              <div style={styles.card}>
                <div style={styles.sectionLabel}>Test Steps</div>
                {selected.steps.map((step, i) => {
                  const done = currentStep > i;
                  const active = currentStep === i && running;
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '8px 10px',
                        borderRadius: 6,
                        marginBottom: 4,
                        background: active ? 'rgba(78,204,163,0.12)' : done ? 'rgba(78,204,163,0.06)' : 'transparent',
                        border: active ? `1px solid ${C.accent}44` : '1px solid transparent',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: done ? C.accent : active ? C.orange : C.inputBg,
                        border: `2px solid ${done ? C.accent : active ? C.orange : C.textDim}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                        color: done ? '#000' : C.textMuted,
                        flexShrink: 0,
                      }}>
                        {done ? '\u2713' : i + 1}
                      </div>
                      <span style={{
                        fontSize: 13,
                        fontWeight: active ? 700 : 500,
                        color: done ? C.accent : active ? C.text : C.textMuted,
                        lineHeight: 1.5,
                      }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Test Data */}
              <div style={styles.card}>
                <div style={styles.sectionLabel}>Test Data</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {Object.entries(selected.testData).map(([key, value]) => (
                    <div key={key} style={styles.testDataChip(C.blue)}>
                      <span style={{ color: C.textMuted }}>{key}: </span>
                      <span style={{ color: C.text }}>
                        {typeof value === 'object'
                          ? Array.isArray(value)
                            ? value.join(', ')
                            : JSON.stringify(value)
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Result */}
              <div style={styles.card}>
                <div style={styles.sectionLabel}>Expected Result</div>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: 0 }}>{selected.expected}</p>
              </div>

              {/* Run Button + Progress */}
              <button style={styles.runBtn(running)} onClick={runTest} disabled={running}>
                {running ? 'Running Test...' : 'Run Test'}
              </button>

              {(running || progress > 0) && (
                <div>
                  <div style={styles.progressBarOuter}>
                    <div style={styles.progressBarInner(progress, progress === 100 ? (selected.status === 'passed' ? C.green : C.red) : C.accent)} />
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, textAlign: 'center' }}>
                    {progress < 100 ? `${progress}% -- Executing step ${Math.min(currentStep + 1, selected.steps.length)} of ${selected.steps.length}...` : 'Test Complete'}
                  </div>
                </div>
              )}

              {/* Actual Result (after run) */}
              {selected.actual && !running && (
                <div style={styles.outputCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={styles.sectionLabel}>
                      <span style={{ color: selected.status === 'passed' ? C.green : C.red }}>
                        {selected.status === 'passed' ? '\u2713' : '\u2717'}
                      </span>
                      {' '}Actual Result
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={styles.statusBadge(selected.status)}>{statusLabel(selected.status)}</span>
                      <span style={{ fontSize: 12, fontFamily: 'monospace', color: C.accent }}>{selected.time}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: 0 }}>{selected.actual}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   MAIN COMPONENT: AccessibilityTesting
   ================================================================ */
const AccessibilityTesting = () => {
  const [activeTab, setActiveTab] = useState('screenReader');
  const activeTabObj = TABS.find((t) => t.id === activeTab);

  const totalScenarios = TABS.reduce((sum, t) => sum + t.count, 0);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.h1}>Accessibility Testing Dashboard</h1>
        <p style={styles.subtitle}>
          Banking QA -- WCAG 2.1, Screen Reader, Keyboard, Visual & Assistive Technology Testing | {totalScenarios} Scenarios
        </p>
      </div>

      {/* TAB BAR */}
      <div style={styles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t.id}
            style={styles.tab(activeTab === t.id)}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTabObj && (
        <ScenarioPanel
          key={activeTabObj.id}
          scenarios={activeTabObj.scenarios}
        />
      )}
    </div>
  );
};

export default AccessibilityTesting;

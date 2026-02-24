import React, { useState } from 'react';

const TABS = [
  'Regression Strategy',
  'Test Suite Management',
  'Automation Approach',
  'Banking Regression Suite',
  'Execution Planning'
];

const REGRESSION_TYPES = [
  { type: 'Complete Regression', desc: 'Execute all test cases in the regression suite. Used for major releases, platform upgrades, or after significant architectural changes.', when: 'Major release, platform migration, quarterly release', effort: 'High (3-5 days)', coverage: '100%', color: '#dc2626' },
  { type: 'Partial Regression', desc: 'Execute test cases related to changed modules + their dependencies. Most common in sprint releases.', when: 'Sprint release, feature additions, module changes', effort: 'Medium (1-2 days)', coverage: '60-80%', color: '#f59e0b' },
  { type: 'Selective Regression', desc: 'Hand-pick critical test cases based on risk analysis. Quick validation after bug fixes or hotfixes.', when: 'Hotfix, patch release, critical bug fix', effort: 'Low (4-8 hours)', coverage: '20-40%', color: '#22c55e' },
  { type: 'Priority-Based Regression', desc: 'Execute test cases based on priority (P0 first, then P1, P2). Stop when time runs out.', when: 'Tight deadlines, resource constraints', effort: 'Variable', coverage: 'P0: 100%, P1: 80%+', color: '#3b82f6' },
  { type: 'Cross-Browser Regression', desc: 'Run critical flows across Chrome, Firefox, Safari, Edge. Focus on UI rendering and JavaScript behavior.', when: 'UI changes, CSS updates, JS framework upgrade', effort: 'Medium (1-2 days)', coverage: 'Top 20 flows × 4 browsers', color: '#8b5cf6' }
];

const REGRESSION_SELECTION = [
  { criteria: 'Impact Analysis', desc: 'Identify all modules affected by code changes using dependency mapping', method: 'Code diff → Impact matrix → Related test cases' },
  { criteria: 'Risk Assessment', desc: 'Prioritize tests for high-risk areas (payment, security, data integrity)', method: 'Risk matrix → Weighted priority scoring' },
  { criteria: 'Frequency of Defects', desc: 'Areas with historically high defect density get more regression coverage', method: 'Defect history analysis → Bug heatmap' },
  { criteria: 'Business Criticality', desc: 'Revenue-generating or compliance-critical flows always included', method: 'Business impact classification (High/Medium/Low)' },
  { criteria: 'Recently Changed Code', desc: 'New or modified code paths are primary candidates for regression', method: 'Git diff analysis → Changed files → Related tests' },
  { criteria: 'Integration Points', desc: 'APIs, database operations, third-party integrations need regression', method: 'API contract tests + Integration test suite' }
];

const BANKING_REGRESSION = [
  {
    module: 'Authentication & Security',
    priority: 'P0',
    testCases: [
      { id: 'REG-001', title: 'Valid login with correct credentials', type: 'Smoke' },
      { id: 'REG-002', title: 'Login fails with wrong password', type: 'Negative' },
      { id: 'REG-003', title: 'Account lockout after 5 failed attempts', type: 'Security' },
      { id: 'REG-004', title: 'Session timeout after 15 minutes idle', type: 'Security' },
      { id: 'REG-005', title: 'Password change with strong password', type: 'Functional' },
      { id: 'REG-006', title: 'OTP generation and validation', type: 'Security' },
      { id: 'REG-007', title: 'Concurrent session detection', type: 'Security' }
    ]
  },
  {
    module: 'Account Management',
    priority: 'P0',
    testCases: [
      { id: 'REG-010', title: 'View account summary with correct balance', type: 'Smoke' },
      { id: 'REG-011', title: 'View transaction history (last 30 days)', type: 'Functional' },
      { id: 'REG-012', title: 'Download account statement (PDF/CSV)', type: 'Functional' },
      { id: 'REG-013', title: 'Mini statement shows last 10 transactions', type: 'Functional' },
      { id: 'REG-014', title: 'Account details display all fields correctly', type: 'UI' },
      { id: 'REG-015', title: 'Multiple accounts listed for same customer', type: 'Functional' }
    ]
  },
  {
    module: 'Fund Transfer',
    priority: 'P0',
    testCases: [
      { id: 'REG-020', title: 'Own account transfer — balance updated correctly', type: 'Smoke' },
      { id: 'REG-021', title: 'NEFT transfer to other bank account', type: 'Functional' },
      { id: 'REG-022', title: 'RTGS transfer (amount > ₹2 lakh)', type: 'Functional' },
      { id: 'REG-023', title: 'IMPS transfer — real-time credit', type: 'Functional' },
      { id: 'REG-024', title: 'Transfer fails with insufficient balance', type: 'Negative' },
      { id: 'REG-025', title: 'Daily transfer limit validation', type: 'Boundary' },
      { id: 'REG-026', title: 'Transfer amount = 0 rejected', type: 'Negative' },
      { id: 'REG-027', title: 'Transfer to blocked account rejected', type: 'Negative' },
      { id: 'REG-028', title: 'OTP required for high-value transfers', type: 'Security' },
      { id: 'REG-029', title: 'Transaction reference number generated', type: 'Functional' }
    ]
  },
  {
    module: 'Bill Payment',
    priority: 'P1',
    testCases: [
      { id: 'REG-030', title: 'Pay electricity bill — successful deduction', type: 'Smoke' },
      { id: 'REG-031', title: 'Schedule future bill payment', type: 'Functional' },
      { id: 'REG-032', title: 'Recurring payment setup and execution', type: 'Functional' },
      { id: 'REG-033', title: 'Payment receipt generation', type: 'Functional' },
      { id: 'REG-034', title: 'Invalid biller ID rejected', type: 'Negative' },
      { id: 'REG-035', title: 'Cancel scheduled payment', type: 'Functional' }
    ]
  },
  {
    module: 'Loans',
    priority: 'P1',
    testCases: [
      { id: 'REG-040', title: 'View active loan details', type: 'Smoke' },
      { id: 'REG-041', title: 'EMI calculator — correct calculation', type: 'Functional' },
      { id: 'REG-042', title: 'Loan application submission', type: 'Functional' },
      { id: 'REG-043', title: 'Loan eligibility check', type: 'Functional' },
      { id: 'REG-044', title: 'Loan prepayment — partial/full', type: 'Functional' },
      { id: 'REG-045', title: 'Loan statement download', type: 'Functional' }
    ]
  },
  {
    module: 'Cards',
    priority: 'P1',
    testCases: [
      { id: 'REG-050', title: 'View card details (masked number)', type: 'Smoke' },
      { id: 'REG-051', title: 'Block/unblock card', type: 'Functional' },
      { id: 'REG-052', title: 'Change card PIN', type: 'Security' },
      { id: 'REG-053', title: 'Set daily transaction limit', type: 'Functional' },
      { id: 'REG-054', title: 'Card statement — last 30 days', type: 'Functional' },
      { id: 'REG-055', title: 'Report lost/stolen card', type: 'Functional' }
    ]
  },
  {
    module: 'API Regression',
    priority: 'P0',
    testCases: [
      { id: 'REG-060', title: 'GET /api/customers — returns 200 with data', type: 'API' },
      { id: 'REG-061', title: 'GET /api/accounts — customer accounts listed', type: 'API' },
      { id: 'REG-062', title: 'POST /api/transfer — fund transfer API', type: 'API' },
      { id: 'REG-063', title: 'GET /api/transactions — history with pagination', type: 'API' },
      { id: 'REG-064', title: 'API authentication — 401 without token', type: 'API' },
      { id: 'REG-065', title: 'API rate limiting — 429 on excessive requests', type: 'API' },
      { id: 'REG-066', title: 'API response schema validation', type: 'API' },
      { id: 'REG-067', title: 'SQL injection attempt — blocked', type: 'Security' }
    ]
  },
  {
    module: 'Database Validation',
    priority: 'P1',
    testCases: [
      { id: 'REG-070', title: 'Transaction audit trail — all fields populated', type: 'DB' },
      { id: 'REG-071', title: 'Account balance = sum of transactions', type: 'DB' },
      { id: 'REG-072', title: 'Foreign key integrity — no orphaned records', type: 'DB' },
      { id: 'REG-073', title: 'Timestamp accuracy (UTC) in audit tables', type: 'DB' },
      { id: 'REG-074', title: 'Concurrent transfer — no double deduction', type: 'DB' },
      { id: 'REG-075', title: 'Data encryption at rest for PII fields', type: 'Security' }
    ]
  }
];

const AUTOMATION_PYRAMID = `
                    ┌─────────┐
                    │  Manual  │  10-15% — Exploratory, UAT
                    │  Testing │  (New features, edge cases)
                ┌───┴─────────┴───┐
                │   E2E / UI      │  15-20% — Selenium + Cucumber
                │   Automation    │  (Critical business flows)
            ┌───┴─────────────────┴───┐
            │   Integration / API     │  30-35% — Postman, RestAssured
            │   Tests                 │  (All API endpoints, contracts)
        ┌───┴─────────────────────────┴───┐
        │       Unit Tests                │  40-50% — JUnit, Jest
        │       (Developer-owned)         │  (Business logic, utilities)
        └─────────────────────────────────┘

  Execution Time:  Unit (ms) → API (seconds) → UI (minutes)
  Maintenance:     Unit (low) → API (medium) → UI (high)
  Flakiness:       Unit (none) → API (low) → UI (medium-high)
`;

const EXECUTION_SCHEDULE = [
  { type: 'Smoke Tests', frequency: 'Every build (CI/CD)', count: '15-20 tests', time: '5-10 min', automated: true },
  { type: 'Sanity Tests', frequency: 'Daily (overnight)', count: '30-50 tests', time: '30-45 min', automated: true },
  { type: 'API Regression', frequency: 'Daily', count: '80-100 tests', time: '15-20 min', automated: true },
  { type: 'Module Regression', frequency: 'Per sprint (affected modules)', count: '50-100 tests', time: '2-4 hours', automated: 'Partial' },
  { type: 'Full Regression', frequency: 'Before release', count: '200-300 tests', time: '1-2 days', automated: 'Partial' },
  { type: 'Cross-Browser', frequency: 'Before release', count: '20 flows × 4 browsers', time: '4-6 hours', automated: true },
  { type: 'Performance Regression', frequency: 'Monthly / before release', count: '10-15 scenarios', time: '2-3 hours', automated: true },
  { type: 'Security Regression', frequency: 'Monthly / before release', count: '20-30 checks', time: '1-2 hours', automated: 'Partial' }
];

export default function RegressionTesting() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedPriority, setSelectedPriority] = useState('all');

  const toggleModule = (key) => setExpandedModules(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredRegression = selectedPriority === 'all'
    ? BANKING_REGRESSION
    : BANKING_REGRESSION.filter(m => m.priority === selectedPriority);

  const totalTCs = BANKING_REGRESSION.reduce((sum, m) => sum + m.testCases.length, 0);

  const renderTab = () => {
    switch (activeTab) {
      case 0: // Strategy
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Regression Testing Types</h3>
            {REGRESSION_TYPES.map((t, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12, borderLeft: `4px solid ${t.color}`, padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <strong style={{ fontSize: 15 }}>{t.type}</strong>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', background: '#f1f5f9', borderRadius: 4 }}>Effort: {t.effort}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', background: '#eff6ff', borderRadius: 4, color: '#3b82f6' }}>Coverage: {t.coverage}</span>
                  </div>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: 13, color: '#64748b' }}>{t.desc}</p>
                <div style={{ fontSize: 12, color: '#4f46e5' }}>When: {t.when}</div>
              </div>
            ))}

            <h3 style={{ margin: '24px 0 16px' }}>Test Selection Criteria</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
              {REGRESSION_SELECTION.map((s, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 14 }}>
                  <strong style={{ fontSize: 14, color: '#1e293b' }}>{s.criteria}</strong>
                  <p style={{ margin: '6px 0', fontSize: 13, color: '#64748b' }}>{s.desc}</p>
                  <div style={{ fontSize: 12, padding: '6px 10px', background: '#f0fdf4', borderRadius: 4, color: '#166534' }}>{s.method}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1: // Test Suite
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Regression Test Suite Organization</h3>
            <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 18, borderRadius: 8, fontSize: 12, lineHeight: 1.5, overflowX: 'auto', marginBottom: 20 }}>
{`regression-suite/
├── smoke/                    # P0 — Run every build (CI/CD)
│   ├── login.feature         # 5 tests (30 sec)
│   ├── dashboard.feature     # 3 tests (15 sec)
│   ├── balance-check.feature # 4 tests (20 sec)
│   └── quick-transfer.feature# 3 tests (25 sec)
│
├── core-banking/             # P0 — Run every sprint
│   ├── accounts/
│   │   ├── view-accounts.feature
│   │   ├── account-statement.feature
│   │   └── account-details.feature
│   ├── transfers/
│   │   ├── own-account-transfer.feature
│   │   ├── neft-transfer.feature
│   │   ├── rtgs-transfer.feature
│   │   └── imps-transfer.feature
│   └── security/
│       ├── authentication.feature
│       ├── session-management.feature
│       └── otp-validation.feature
│
├── extended/                 # P1 — Run before release
│   ├── bill-payment/
│   ├── loans/
│   ├── cards/
│   └── beneficiary/
│
├── api/                      # P0 — Run daily (automated)
│   ├── postman/
│   │   ├── banking-api.postman_collection.json
│   │   └── environment.json
│   └── soapui/
│       └── banking-soapui-project.xml
│
├── database/                 # P1 — Run before release
│   ├── data-integrity.sql
│   ├── balance-reconciliation.sql
│   └── audit-trail-validation.sql
│
└── performance/              # P2 — Run monthly
    ├── load-test-config.yml
    └── stress-test-config.yml

Total: ~75 regression test cases
Automated: ~55 (73%)
Manual: ~20 (27%)`}
            </pre>

            <h4 style={{ marginBottom: 12 }}>Suite Maintenance Best Practices</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              {[
                { title: 'Regular Review', desc: 'Review regression suite every 2 sprints. Remove obsolete tests, add new scenarios for recent bugs.' },
                { title: 'Tag Management', desc: 'Use tags: @smoke, @regression, @P0, @P1, @module-transfer. Run specific suites based on change impact.' },
                { title: 'Data Independence', desc: 'Each test creates its own data and cleans up after. No test should depend on another test\'s data.' },
                { title: 'Parallel Execution', desc: 'Design tests to run in parallel. Avoid shared state. Use unique test data per thread.' },
                { title: 'Flaky Test Management', desc: 'Track flaky tests separately. Fix or quarantine within 1 sprint. Never ignore or skip indefinitely.' },
                { title: 'Version Control', desc: 'Test cases in Git alongside code. PR review for test changes. Branch strategy mirrors dev branches.' }
              ].map((p, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 14 }}>
                  <strong style={{ fontSize: 13, color: '#1e293b' }}>{p.title}</strong>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#64748b' }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2: // Automation
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Test Automation Pyramid</h3>
            <pre style={{ background: '#0f172a', color: '#38bdf8', padding: 20, borderRadius: 8, fontSize: 12, lineHeight: 1.4, overflowX: 'auto', marginBottom: 20 }}>
              {AUTOMATION_PYRAMID}
            </pre>

            <h4 style={{ marginBottom: 12 }}>Automation Tools by Layer</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Layer</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Tools</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Banking Use Case</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>%</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { layer: 'Unit Tests', tools: 'JUnit, Jest, pytest', use: 'EMI calculation logic, validation rules, utility functions', pct: '40-50%' },
                  { layer: 'API Tests', tools: 'Postman, RestAssured, SoapUI, Karate', use: 'All REST endpoints, SOAP services, response validation', pct: '30-35%' },
                  { layer: 'UI Tests', tools: 'Selenium, Cypress, Playwright', use: 'Login flow, fund transfer, bill payment', pct: '15-20%' },
                  { layer: 'Manual', tools: 'Exploratory, UAT, Usability', use: 'New features, complex scenarios, user experience', pct: '10-15%' }
                ].map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{r.layer}</td>
                    <td style={{ padding: '8px 12px', color: '#4f46e5', fontSize: 12 }}>{r.tools}</td>
                    <td style={{ padding: '8px 12px', color: '#64748b', fontSize: 12 }}>{r.use}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700 }}>{r.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ margin: '20px 0 12px' }}>CI/CD Integration for Regression</h4>
            <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 18, borderRadius: 8, fontSize: 12, lineHeight: 1.5, overflowX: 'auto' }}>
{`# .github/workflows/regression.yml
name: Regression Test Suite
on:
  push:
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * *'  # Nightly at 2 AM

jobs:
  smoke-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Smoke Tests
        run: |
          mvn test -Dcucumber.filter.tags="@smoke"
          # OR: npx cypress run --spec "cypress/e2e/smoke/**"
          # OR: newman run collections/smoke.json

  api-regression:
    runs-on: ubuntu-latest
    needs: smoke-tests
    steps:
      - name: Run API Tests (Postman/Newman)
        run: |
          newman run collections/banking-api.json \\
            -e environments/qa.json \\
            --reporters cli,htmlextra \\
            --reporter-htmlextra-export reports/api-report.html

  ui-regression:
    runs-on: ubuntu-latest
    needs: api-regression
    steps:
      - name: Run Selenium Tests
        run: |
          mvn test -Dcucumber.filter.tags="@regression and @P0"
          # Parallel: -Dthreadcount=4

  report:
    runs-on: ubuntu-latest
    needs: [smoke-tests, api-regression, ui-regression]
    if: always()
    steps:
      - name: Publish Reports
        uses: actions/upload-artifact@v4
        with:
          name: regression-reports
          path: reports/`}
            </pre>
          </div>
        );

      case 3: // Banking Suite
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Banking Regression Test Suite ({totalTCs} test cases)</h3>
              <div style={{ display: 'flex', gap: 6 }}>
                {['all', 'P0', 'P1'].map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPriority(p)}
                    style={{
                      padding: '6px 14px', borderRadius: 4, border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      background: selectedPriority === p ? '#4f46e5' : '#fff',
                      color: selectedPriority === p ? '#fff' : '#475569'
                    }}
                  >
                    {p === 'all' ? 'All' : p}
                  </button>
                ))}
              </div>
            </div>

            {filteredRegression.map((mod, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12, overflow: 'hidden' }}>
                <div
                  onClick={() => toggleModule(`mod-${i}`)}
                  style={{ padding: '12px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: expandedModules[`mod-${i}`] ? '#f0f4ff' : '#fff' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                      background: mod.priority === 'P0' ? '#dc2626' : '#f59e0b',
                      color: '#fff'
                    }}>{mod.priority}</span>
                    <strong style={{ fontSize: 14 }}>{mod.module}</strong>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>({mod.testCases.length} tests)</span>
                  </div>
                  <span style={{ color: '#94a3b8' }}>{expandedModules[`mod-${i}`] ? '\u25B2' : '\u25BC'}</span>
                </div>
                {expandedModules[`mod-${i}`] && (
                  <div style={{ borderTop: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          <th style={{ padding: '8px 14px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', width: 100 }}>ID</th>
                          <th style={{ padding: '8px 14px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Test Case</th>
                          <th style={{ padding: '8px 14px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', width: 100 }}>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mod.testCases.map((tc, j) => (
                          <tr key={j} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '6px 14px', fontFamily: 'monospace', color: '#4f46e5', fontSize: 12 }}>{tc.id}</td>
                            <td style={{ padding: '6px 14px' }}>{tc.title}</td>
                            <td style={{ padding: '6px 14px', textAlign: 'center' }}>
                              <span style={{
                                fontSize: 10, padding: '2px 6px', borderRadius: 3, fontWeight: 600,
                                background: tc.type === 'Smoke' ? '#dcfce7' : tc.type === 'Security' ? '#fef2f2' : tc.type === 'API' ? '#eff6ff' : tc.type === 'DB' ? '#f5f3ff' : tc.type === 'Negative' ? '#fff7ed' : '#f1f5f9',
                                color: tc.type === 'Smoke' ? '#166534' : tc.type === 'Security' ? '#dc2626' : tc.type === 'API' ? '#2563eb' : tc.type === 'DB' ? '#7c3aed' : tc.type === 'Negative' ? '#ea580c' : '#475569'
                              }}>{tc.type}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 4: // Execution Planning
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Regression Execution Schedule</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Type</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Frequency</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Test Count</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Duration</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Automated</th>
                </tr>
              </thead>
              <tbody>
                {EXECUTION_SCHEDULE.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{s.type}</td>
                    <td style={{ padding: '8px 12px', color: '#64748b' }}>{s.frequency}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>{s.count}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', color: '#4f46e5' }}>{s.time}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                        background: s.automated === true ? '#dcfce7' : s.automated === 'Partial' ? '#fef3c7' : '#fef2f2',
                        color: s.automated === true ? '#166534' : s.automated === 'Partial' ? '#92400e' : '#dc2626'
                      }}>{s.automated === true ? 'Yes' : s.automated === 'Partial' ? 'Partial' : 'No'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ marginBottom: 12 }}>Regression Decision Matrix</h4>
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 18 }}>
              <pre style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, color: '#334155', margin: 0, overflowX: 'auto' }}>
{`Change Type          → Regression Level        → Timeline
────────────────────────────────────────────────────────────
Hotfix (1 bug fix)   → Selective (affected area) → Same day
Config change        → Smoke + Sanity           → 4 hours
Sprint release       → Partial (changed modules) → 1-2 days
Major release        → Full regression           → 3-5 days
Platform upgrade     → Full + Cross-browser      → 5-7 days
Database migration   → Full + Data validation    → 3-5 days
Security patch       → Security suite + Smoke    → 1 day
UI redesign          → Cross-browser + A11y      → 2-3 days
API version change   → API regression suite      → 1-2 days
Third-party update   → Integration + Smoke       → 1 day`}
              </pre>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Regression Testing</h2>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
          Regression testing strategy, test suite management, automation approach, and banking-specific regression test cases
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20, borderBottom: '2px solid #e2e8f0', paddingBottom: 12 }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: activeTab === i ? '#4f46e5' : '#f1f5f9',
              color: activeTab === i ? '#fff' : '#475569'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}

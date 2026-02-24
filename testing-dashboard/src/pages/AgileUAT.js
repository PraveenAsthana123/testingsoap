import React, { useState } from 'react';

const TABS = [
  'Agile QA Process',
  'UAT Workflow',
  'Test Strategy',
  'SDLC & STLC',
  'Estimation & Metrics',
  'Templates'
];

const AGILE_QA_PROCESS = [
  {
    phase: 'Sprint Planning',
    qaActivities: [
      'Review user stories and acceptance criteria',
      'Identify testable scenarios from stories',
      'Estimate QA effort (story points or hours)',
      'Flag stories with unclear requirements',
      'Identify test data and environment needs',
      'Define Definition of Done (DoD) for QA'
    ],
    deliverables: 'Test estimation, test data requirements, test environment checklist'
  },
  {
    phase: 'Sprint Execution — Day 1-3',
    qaActivities: [
      'Write test cases based on acceptance criteria',
      'Prepare test data in QA environment',
      'Review developer PRs for edge cases',
      'Set up API test collections (Postman/SoapUI)',
      'Write Cucumber feature files (if BDD)',
      'Perform early smoke testing on completed stories'
    ],
    deliverables: 'Test cases document, Postman collection, Cucumber features'
  },
  {
    phase: 'Sprint Execution — Day 4-7',
    qaActivities: [
      'Execute manual test cases systematically',
      'API testing — validate endpoints, payloads, status codes',
      'Database validation — verify data integrity with SQL',
      'Log bugs in JIRA with evidence',
      'Retest fixed bugs promptly',
      'Run regression on affected modules'
    ],
    deliverables: 'Test execution report, bug reports, regression results'
  },
  {
    phase: 'Sprint Execution — Day 8-9',
    qaActivities: [
      'Complete regression testing suite',
      'Cross-browser testing (Chrome, Firefox, Edge)',
      'Mobile responsiveness check',
      'Performance sanity check (page load times)',
      'Security quick checks (OWASP top vulnerabilities)',
      'Update traceability matrix'
    ],
    deliverables: 'Regression report, cross-browser results, security checklist'
  },
  {
    phase: 'Sprint Closure — Day 10',
    qaActivities: [
      'Generate sprint QA metrics report',
      'Demo tested features in sprint review',
      'Hand over to UAT team with test evidence',
      'Update test case repository',
      'Participate in retrospective — share QA insights',
      'Plan carryover items for next sprint'
    ],
    deliverables: 'Sprint QA report, UAT handover package, retrospective notes'
  }
];

const UAT_WORKFLOW = [
  { step: 1, name: 'UAT Planning', desc: 'Define UAT scope, create UAT test plan, identify business users, schedule timelines', owner: 'QA Lead / BA', duration: '2-3 days' },
  { step: 2, name: 'UAT Environment Setup', desc: 'Deploy release to UAT environment, load production-like data, configure integrations', owner: 'DevOps / QA', duration: '1 day' },
  { step: 3, name: 'UAT Test Case Preparation', desc: 'Create business-focused test scenarios, map to requirements, prepare test data', owner: 'QA + BA', duration: '2-3 days' },
  { step: 4, name: 'UAT Kickoff Meeting', desc: 'Walk through features with business users, explain test scenarios, share access credentials', owner: 'QA Lead', duration: '1 hour' },
  { step: 5, name: 'UAT Execution', desc: 'Business users execute scenarios, QA supports with clarifications, issues logged in JIRA', owner: 'Business Users + QA Support', duration: '3-5 days' },
  { step: 6, name: 'Defect Triage', desc: 'Review UAT defects, classify as bug/enhancement/by-design, prioritize fixes', owner: 'QA + Dev + BA', duration: 'Daily during UAT' },
  { step: 7, name: 'UAT Bug Fixes', desc: 'Developers fix critical UAT bugs, QA verifies fixes, redeploy to UAT', owner: 'Dev + QA', duration: '1-2 days' },
  { step: 8, name: 'UAT Sign-Off', desc: 'Business users approve functionality, sign UAT completion document, approve for production', owner: 'Business Stakeholders', duration: '1 day' },
  { step: 9, name: 'Production Deployment', desc: 'Deploy to production, smoke test critical paths, monitor for issues', owner: 'DevOps + QA', duration: '1 day' },
  { step: 10, name: 'Post-Production Validation', desc: 'Verify key flows in production, check integration points, confirm data migration', owner: 'QA + BA', duration: '1 day' }
];

const TEST_STRATEGY = [
  {
    section: 'Test Approach',
    content: `1. Risk-Based Testing — Focus testing effort on high-risk areas (payment, security, compliance)
2. Module-Based Testing — Test each module independently before integration
3. Shift-Left — Start testing early (requirements review, API testing before UI)
4. Continuous Testing — Automated tests in CI/CD pipeline (unit → integration → E2E)
5. Exploratory Testing — Dedicated sessions for finding edge cases beyond scripted tests`
  },
  {
    section: 'Test Types & Coverage',
    content: `Functional Testing:
  - Smoke Testing ........... 10-15 critical path test cases (every build)
  - Sanity Testing .......... 20-30 targeted test cases (after bug fixes)
  - Regression Testing ...... 100-200 test cases (before release)
  - Integration Testing ..... API-to-API, UI-to-API, DB validation
  - End-to-End Testing ...... Complete business workflows

Non-Functional Testing:
  - Performance Testing ..... Response time < 3s, concurrent users > 100
  - Security Testing ........ OWASP Top 10, SQL injection, XSS, CSRF
  - Usability Testing ....... UI consistency, accessibility (WCAG 2.1)
  - Compatibility Testing ... Cross-browser, mobile responsive
  - Load Testing ............ Peak load simulation (salary day, quarter end)`
  },
  {
    section: 'Entry & Exit Criteria',
    content: `Entry Criteria (Start Testing):
  ✓ Build deployed to QA environment
  ✓ Unit tests passing (>80% coverage)
  ✓ Test data available
  ✓ Test cases reviewed and approved
  ✓ Environment stable (no deployment in progress)

Exit Criteria (Stop Testing / Go-Live):
  ✓ All P1/P2 bugs fixed and verified
  ✓ Test execution coverage > 95%
  ✓ Pass rate > 90%
  ✓ No open blocker/critical defects
  ✓ Regression suite passed
  ✓ UAT sign-off obtained
  ✓ Performance benchmarks met`
  },
  {
    section: 'Risk Assessment',
    content: `High Risk (Test Extensively):
  - Fund Transfer (money movement)
  - Payment Processing (financial accuracy)
  - Authentication & Session Management
  - Data Encryption & PII handling
  - Third-party integrations (payment gateway, SMS)

Medium Risk (Standard Coverage):
  - Account Management (CRUD operations)
  - Report Generation
  - Notification System
  - Search & Filter functionality

Low Risk (Smoke Test Only):
  - Static pages (About, FAQ)
  - UI cosmetic elements
  - Admin configuration screens`
  }
];

const SDLC_STLC = {
  sdlc: [
    { phase: 'Requirements', desc: 'Gather business requirements, create BRD/FRD', qa: 'Review requirements for testability' },
    { phase: 'Design', desc: 'HLD, LLD, database schema, API contracts', qa: 'Review design docs, identify test scenarios' },
    { phase: 'Development', desc: 'Code implementation, unit testing', qa: 'Write test cases, prepare test data' },
    { phase: 'Testing', desc: 'System testing, integration testing', qa: 'Execute tests, log bugs, regression' },
    { phase: 'Deployment', desc: 'Release to production', qa: 'Smoke test production, post-deploy validation' },
    { phase: 'Maintenance', desc: 'Bug fixes, enhancements', qa: 'Verify fixes, update regression suite' }
  ],
  stlc: [
    { phase: 'Requirement Analysis', activities: 'Analyze requirements, identify testable items, prepare RTM', deliverable: 'RTM (Requirements Traceability Matrix)' },
    { phase: 'Test Planning', activities: 'Define test strategy, scope, resources, schedule, tools, risks', deliverable: 'Test Plan Document' },
    { phase: 'Test Case Design', activities: 'Write test cases, review, create test data, design BDD scenarios', deliverable: 'Test Cases, Test Data, Feature Files' },
    { phase: 'Environment Setup', activities: 'Prepare QA environment, configure tools, load test data', deliverable: 'Environment Ready Checklist' },
    { phase: 'Test Execution', activities: 'Run test cases, log defects, retest, regression', deliverable: 'Test Execution Report, Bug Reports' },
    { phase: 'Test Closure', activities: 'Generate metrics, lessons learned, archive artifacts', deliverable: 'Test Summary Report, Metrics Dashboard' }
  ]
};

const ESTIMATION_TECHNIQUES = [
  { technique: 'Work Breakdown Structure', desc: 'Break features into testable units, estimate each unit separately, sum up', example: 'Login module: 5 test cases × 30 min = 2.5 hours. Fund Transfer: 15 TCs × 30 min = 7.5 hours' },
  { technique: 'Three-Point Estimation', desc: 'Optimistic (O) + Most Likely (M) + Pessimistic (P). Estimate = (O + 4M + P) / 6', example: 'O=3 days, M=5 days, P=10 days → Estimate = (3 + 20 + 10) / 6 = 5.5 days' },
  { technique: 'Function Point Analysis', desc: 'Count inputs, outputs, inquiries, files, interfaces. Apply complexity weighting.', example: '5 inputs × 4 TCs each + 3 outputs × 3 TCs = 29 test cases total' },
  { technique: 'Historical Data', desc: 'Use past sprint velocity and defect density to predict effort', example: 'Last sprint: 35 TCs in 40 hours. This sprint similar scope → ~40 hours QA' },
  { technique: 'Story Point Mapping', desc: 'Map QA effort proportional to story points (e.g., 3 SP story = 4 hours QA)', example: '5 SP story = 6 hours QA. Sprint total: 40 SP = ~48 hours QA effort' }
];

const QA_METRICS = [
  { metric: 'Test Case Pass Rate', formula: '(Passed TCs / Total Executed) × 100', target: '> 90%', desc: 'Overall quality indicator' },
  { metric: 'Defect Density', formula: 'Total Defects / Size (KLOC or Story Points)', target: '< 5 per KLOC', desc: 'Code quality measure' },
  { metric: 'Defect Injection Rate', formula: 'Defects Found / Test Cases Executed', target: '< 15%', desc: 'Rate of finding new bugs' },
  { metric: 'Bug Escape Rate', formula: 'Prod Bugs / (QA Bugs + Prod Bugs) × 100', target: '< 5%', desc: 'Effectiveness of QA process' },
  { metric: 'Bug Reopen Rate', formula: 'Reopened Bugs / Total Fixed × 100', target: '< 10%', desc: 'Quality of developer fixes' },
  { metric: 'Test Execution Coverage', formula: 'Executed TCs / Total TCs × 100', target: '> 95%', desc: 'Testing completeness' },
  { metric: 'Requirement Coverage', formula: 'Requirements with TCs / Total Requirements × 100', target: '100%', desc: 'Traceability completeness' },
  { metric: 'Average Bug Resolution Time', formula: 'Sum(Resolution Time) / Total Bugs', target: '< 2 days', desc: 'Development team responsiveness' },
  { metric: 'Automation Coverage', formula: 'Automated TCs / Total TCs × 100', target: '> 60%', desc: 'Automation maturity' },
  { metric: 'Sprint Velocity (QA)', formula: 'Story Points Tested / Sprint', target: 'Stable ±10%', desc: 'QA team capacity' }
];

const TEMPLATES = {
  testPlan: `TEST PLAN — Banking Portal v4.2
================================

1. INTRODUCTION
   1.1 Purpose: Validate all features in Sprint 24 release
   1.2 Scope: Accounts, Transfers, Loans, Cards modules
   1.3 References: BRD v3.1, FRD v2.4, API Spec v4.2

2. TEST STRATEGY
   2.1 Test Types: Functional, API, Security, Performance, UAT
   2.2 Test Levels: Unit → Integration → System → UAT
   2.3 Approach: Risk-based + Exploratory

3. TEST SCOPE
   In Scope:
     - Customer registration & KYC
     - Fund transfer (NEFT, RTGS, IMPS, UPI)
     - Bill payment & scheduled payments
     - Loan application & EMI calculator
     - Card management (block, unblock, limit)
   Out of Scope:
     - Legacy batch processing (no changes)
     - Admin back-office (separate release)

4. TEST ENVIRONMENT
   - QA: https://qa.bankingportal.com
   - Staging: https://staging.bankingportal.com
   - UAT: https://uat.bankingportal.com
   - Browsers: Chrome 120+, Firefox 118+, Edge 118+
   - Mobile: Chrome Android, Safari iOS

5. TEST SCHEDULE
   Week 1: Test case design + Environment setup
   Week 2: Functional testing + API testing
   Week 3: Regression + Security + Performance
   Week 4: UAT + Bug fixes + Sign-off

6. RESOURCE ALLOCATION
   - QA Lead: Test strategy, review, reporting (1)
   - Senior QA: API testing, automation (1)
   - QA Analyst: Manual testing, bug logging (2)
   - BA Support: UAT coordination (1)

7. ENTRY / EXIT CRITERIA
   Entry: Build deployed, unit tests pass, data ready
   Exit: 95% execution, 90% pass, no P1/P2 open

8. RISK MITIGATION
   - Environment instability → Backup QA server
   - Scope creep → Change request process
   - Resource shortage → Cross-train team members
   - Third-party dependency → Mock services ready

9. DELIVERABLES
   - Test Plan (this document)
   - Test Cases (JIRA/Zephyr)
   - Test Execution Report (weekly)
   - Defect Summary Report (daily)
   - UAT Sign-off Document
   - Test Summary Report (end of cycle)`,

  bugReport: `BUG REPORT TEMPLATE
====================

Bug ID:        BUG-XXX
Summary:       [Fund Transfer] Incorrect balance after NEFT transfer
Severity:      Critical
Priority:      P2 - High
Status:        Open
Component:     Fund Transfer
Sprint:        Sprint 24

Reporter:      QA Analyst Name
Assignee:      Developer Name
Environment:   Chrome 120 / Windows 11 / QA Server (qa.bank.com)

STEPS TO REPRODUCE:
1. Login as customer CUST001 (Savings Account: ₹1,50,000)
2. Navigate to Fund Transfer → NEFT
3. Select source account: ACC-SAV-001
4. Enter beneficiary: ACC-EXT-5678 (HDFC Bank)
5. Enter amount: ₹25,000
6. Click "Transfer Now"
7. Verify OTP: 123456
8. Check account balance

EXPECTED RESULT:
Account balance should be ₹1,25,000 (₹1,50,000 - ₹25,000)

ACTUAL RESULT:
Account balance shows ₹1,50,000 (unchanged)
Transaction status shows "Success" but amount not deducted

ADDITIONAL INFO:
- API Response: 200 OK (transaction_id: TXN-98765)
- Database: transactions table has entry, but accounts.balance not updated
- Console: No JavaScript errors
- Same issue reproducible with RTGS and IMPS transfers

ATTACHMENTS:
1. screenshot_balance_before.png
2. screenshot_balance_after.png
3. api_response.json
4. database_query_result.png

IMPACT:
- Affects all fund transfer types (NEFT, RTGS, IMPS)
- Financial accuracy issue — customer money at risk
- Blocks UAT testing for transfer module

WORKAROUND:
None — requires code fix`,

  testSummary: `TEST SUMMARY REPORT
====================
Release:       v4.2.0 | Sprint 24
Date:          2024-01-15
QA Lead:       [Name]

EXECUTIVE SUMMARY:
Sprint 24 testing is complete. 280 out of 300 test cases executed (93.3%).
245 passed, 25 failed, 10 blocked. 18 defects found, 12 fixed, 6 open.
Release recommendation: CONDITIONAL GO (pending 3 P2 bug fixes)

TEST EXECUTION SUMMARY:
┌──────────────────┬──────────┬────────────┐
│ Module           │ Pass/Fail│ Coverage   │
├──────────────────┼──────────┼────────────┤
│ Registration     │ 28/2     │ 93%        │
│ Authentication   │ 25/0     │ 100%       │
│ Accounts         │ 35/3     │ 95%        │
│ Fund Transfer    │ 40/8     │ 90%        │
│ Bill Payment     │ 30/2     │ 94%        │
│ Loans            │ 25/4     │ 88%        │
│ Cards            │ 22/3     │ 86%        │
│ Security         │ 40/3     │ 93%        │
├──────────────────┼──────────┼────────────┤
│ TOTAL            │ 245/25   │ 93%        │
└──────────────────┴──────────┴────────────┘

DEFECT SUMMARY:
- Total Found: 18
- Fixed & Verified: 12
- Open: 6 (3 P2, 3 P3)
- Deferred: 0

OPEN CRITICAL BUGS:
1. BUG-156: Balance not updating after NEFT transfer (P2)
2. BUG-159: Loan EMI calculation off by ₹1 for rounding (P2)
3. BUG-162: Card block status not syncing in real-time (P2)

RECOMMENDATION:
Conditional Go — Fix 3 P2 bugs, retest, then proceed to UAT.
ETA for fixes: 2 days`
};

export default function AgileUAT() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});
  const [activeTemplate, setActiveTemplate] = useState('testPlan');

  const toggle = (key) => setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));

  const renderTab = () => {
    switch (activeTab) {
      case 0: // Agile QA Process
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Agile QA Process — Sprint Workflow</h3>
            <div style={{ position: 'relative' }}>
              {AGILE_QA_PROCESS.map((phase, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
                    {i < AGILE_QA_PROCESS.length - 1 && <div style={{ width: 2, flex: 1, background: '#c7d2fe', marginTop: 4 }} />}
                  </div>
                  <div style={{ flex: 1, background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <strong style={{ fontSize: 15, color: '#1e293b' }}>{phase.phase}</strong>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {phase.qaActivities.map((a, j) => (
                        <li key={j} style={{ marginBottom: 5, fontSize: 13, color: '#475569' }}>{a}</li>
                      ))}
                    </ul>
                    <div style={{ marginTop: 10, padding: '8px 12px', background: '#f0fdf4', borderRadius: 6, fontSize: 12, color: '#166534' }}>
                      <strong>Deliverables:</strong> {phase.deliverables}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1: // UAT Workflow
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>User Acceptance Testing (UAT) Workflow</h3>
            {UAT_WORKFLOW.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: i < 4 ? '#3b82f6' : i < 7 ? '#f59e0b' : '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{step.step}</div>
                  {i < UAT_WORKFLOW.length - 1 && <div style={{ width: 2, flex: 1, background: '#e2e8f0', marginTop: 4 }} />}
                </div>
                <div style={{ flex: 1, background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <strong style={{ fontSize: 14 }}>{step.name}</strong>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', background: '#f1f5f9', borderRadius: 4, color: '#64748b' }}>{step.owner}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', background: '#eff6ff', borderRadius: 4, color: '#3b82f6' }}>{step.duration}</span>
                    </div>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>{step.desc}</p>
                </div>
              </div>
            ))}

            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 18, marginTop: 20 }}>
              <h4 style={{ margin: '0 0 12px' }}>UAT Checklist</h4>
              {[
                'UAT environment deployed with latest release build',
                'Test data refreshed from production (anonymized)',
                'UAT test scenarios reviewed by business stakeholders',
                'Access credentials shared with UAT participants',
                'Third-party integrations configured (payment gateway, SMS)',
                'Defect logging process communicated to UAT team',
                'Daily triage meeting scheduled during UAT period',
                'UAT sign-off template prepared',
                'Rollback plan documented in case of go/no-go',
                'Post-production validation checklist ready'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', fontSize: 13, color: '#475569' }}>
                  <input type="checkbox" style={{ width: 16, height: 16 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 2: // Test Strategy
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Test Strategy for Banking Application</h3>
            {TEST_STRATEGY.map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12, overflow: 'hidden' }}>
                <div onClick={() => toggle(`ts-${i}`)} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: expandedItems[`ts-${i}`] ? '#f0f4ff' : '#fff' }}>
                  <strong>{s.section}</strong>
                  <span style={{ color: '#94a3b8' }}>{expandedItems[`ts-${i}`] ? '\u25B2' : '\u25BC'}</span>
                </div>
                {expandedItems[`ts-${i}`] && (
                  <div style={{ padding: '0 18px 16px', borderTop: '1px solid #e2e8f0' }}>
                    <pre style={{ margin: '12px 0', padding: 16, background: '#f8fafc', borderRadius: 6, fontSize: 13, lineHeight: 1.6, color: '#334155', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                      {s.content}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 3: // SDLC & STLC
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>SDLC vs STLC — QA Perspective</h3>

            <h4 style={{ marginBottom: 10 }}>Software Development Life Cycle (SDLC)</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
              {SDLC_STLC.sdlc.map((p, i) => (
                <React.Fragment key={i}>
                  <div style={{ background: '#4f46e5', color: '#fff', padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, textAlign: 'center', minWidth: 100 }}>
                    <div>{p.phase}</div>
                    <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>{p.qa}</div>
                  </div>
                  {i < SDLC_STLC.sdlc.length - 1 && <span style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: 18 }}>{'\u2192'}</span>}
                </React.Fragment>
              ))}
            </div>

            <h4 style={{ marginBottom: 10 }}>Software Testing Life Cycle (STLC)</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Phase</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Activities</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Deliverable</th>
                </tr>
              </thead>
              <tbody>
                {SDLC_STLC.stlc.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#4f46e5' }}>{p.phase}</td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>{p.activities}</td>
                    <td style={{ padding: '10px 12px', color: '#64748b', fontSize: 12 }}>{p.deliverable}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 20, background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 18 }}>
              <h4 style={{ margin: '0 0 12px' }}>Testing Quadrant (Agile)</h4>
              <pre style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, color: '#334155', margin: 0, overflowX: 'auto' }}>
{`            Technology-Facing                     Business-Facing
          ┌─────────────────────┬─────────────────────────┐
          │  Q1: Unit Tests     │  Q2: Functional Tests   │
  Guide   │  Component Tests    │  Story Tests            │
  Dev     │  API Tests          │  Workflow Tests         │
          │  TDD / BDD          │  Prototypes             │
          ├─────────────────────┼─────────────────────────┤
          │  Q3: Performance    │  Q4: Exploratory        │
  Critique│  Security Tests     │  Usability Tests        │
  Product │  Load Tests         │  UAT                    │
          │  Stress Tests       │  Alpha/Beta Testing     │
          └─────────────────────┴─────────────────────────┘`}
              </pre>
            </div>
          </div>
        );

      case 4: // Estimation & Metrics
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Test Estimation Techniques</h3>
            {ESTIMATION_TECHNIQUES.map((t, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12, padding: '14px 18px' }}>
                <strong style={{ fontSize: 14, color: '#1e293b' }}>{t.technique}</strong>
                <p style={{ margin: '6px 0', fontSize: 13, color: '#64748b' }}>{t.desc}</p>
                <div style={{ padding: '8px 12px', background: '#f0f4ff', borderRadius: 6, fontSize: 12, color: '#4f46e5', fontFamily: 'monospace' }}>{t.example}</div>
              </div>
            ))}

            <h3 style={{ margin: '24px 0 16px' }}>QA Metrics Dashboard</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Metric</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Formula</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Target</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {QA_METRICS.map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{m.metric}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 11, color: '#4f46e5' }}>{m.formula}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: '#22c55e' }}>{m.target}</td>
                    <td style={{ padding: '8px 12px', color: '#64748b', fontSize: 12 }}>{m.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 5: // Templates
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>QA Document Templates</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[
                { key: 'testPlan', label: 'Test Plan' },
                { key: 'bugReport', label: 'Bug Report' },
                { key: 'testSummary', label: 'Test Summary' }
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTemplate(t.key)}
                  style={{
                    padding: '8px 16px', borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    background: activeTemplate === t.key ? '#1e293b' : '#fff',
                    color: activeTemplate === t.key ? '#fff' : '#475569'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 20, borderRadius: 8, fontSize: 12.5, lineHeight: 1.5, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
              {TEMPLATES[activeTemplate]}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(TEMPLATES[activeTemplate])}
              style={{ marginTop: 10, padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
            >
              Copy Template
            </button>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Agile Testing & UAT</h2>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
          Complete guide to Agile QA process, UAT workflows, test strategy, SDLC/STLC, estimation techniques, and QA document templates
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

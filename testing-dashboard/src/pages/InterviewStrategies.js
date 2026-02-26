import React, { useState } from 'react';

/* ================================================================
   Interview Strategies for API/SOAP Testing in Banking
   5 Explanation Styles + Decision Matrix
   6 Tabs: Lifecycle, Risk-Based, Data-Centric, Automation,
           Story-Based, Strategy Guide
   ================================================================ */

// Color Tokens (dark theme)
const C = {
  bgGradientStart: '#1a1a2e',
  bgGradientEnd: '#16213e',
  card: '#0f3460',
  cardLight: '#1a4a7a',
  accent: '#4ecca3',
  blue: '#3498db',
  red: '#e74c3c',
  orange: '#f39c12',
  purple: '#9b59b6',
  green: '#4ecca3',
  yellow: '#f1c40f',
  gold: '#d4a017',
  cyan: '#00bcd4',
  text: '#ffffff',
  textMuted: '#a0b4c8',
  border: '#1e5a8a',
  inputBg: '#0a2a4a',
};

// Tab Definitions
const TABS = [
  { id: 'lifecycle', label: 'Lifecycle (SDLC)', icon: 'L', count: 8 },
  { id: 'risk', label: 'Risk-Based', icon: 'R', count: 6 },
  { id: 'data', label: 'Data-Centric', icon: 'D', count: 6 },
  { id: 'automation', label: 'Automation', icon: 'A', count: 5 },
  { id: 'story', label: 'Story-Based', icon: 'S', count: 5 },
  { id: 'guide', label: 'Strategy Guide', icon: 'G', count: 1 },
];

/* ================================================================
   DATA: TAB 1 - Lifecycle-Based Explanation
   ================================================================ */
const LIFECYCLE_STEPS = [
  {
    step: 1,
    title: 'Requirement Understanding',
    color: C.purple,
    bullets: [
      'Review user stories, BRD, API specs (Swagger/WSDL)',
      'Identify business rules & dependencies',
    ],
  },
  {
    step: 2,
    title: 'Contract Analysis',
    color: C.blue,
    bullets: [
      'Validate endpoint, method, request/response schema',
      'Identify mandatory/optional fields',
      'Check status codes & error model',
    ],
  },
  {
    step: 3,
    title: 'Test Design',
    color: C.green,
    bullets: [
      'Functional scenarios',
      'Negative & boundary tests',
      'Security & RBAC tests',
      'Data validation cases',
    ],
  },
  {
    step: 4,
    title: 'Test Data Preparation',
    color: C.orange,
    bullets: [
      'Create valid and invalid datasets',
      'Prepare edge case data',
      'Track IDs for validation',
    ],
  },
  {
    step: 5,
    title: 'Execution',
    color: C.red,
    bullets: [
      'Use API tools to send requests',
      'Chain calls (auth -> create -> verify)',
      'Add assertions for schema & fields',
    ],
  },
  {
    step: 6,
    title: 'Database Validation',
    color: C.cyan,
    bullets: [
      'Run SQL queries',
      'Verify referential integrity',
      'Check audit columns',
    ],
  },
  {
    step: 7,
    title: 'Defect Reporting',
    color: C.yellow,
    bullets: [
      'Attach request/response',
      'Provide DB evidence',
      'Assign severity',
    ],
  },
  {
    step: 8,
    title: 'Regression & Reporting',
    color: C.purple,
    bullets: [
      'Re-test fixes',
      'Run regression suite',
      'Publish summary report',
    ],
  },
];

const LIFECYCLE_SCRIPT = 'I follow the SDLC lifecycle for API testing. Starting with requirement analysis \u2014 reviewing BRDs and API specs to understand business rules. Then I analyze the contract \u2014 endpoints, schemas, status codes. I design test cases covering functional, negative, boundary, and security scenarios. I prepare test data for valid and edge cases, then execute using tools like SoapUI/Postman with proper assertions. I validate database persistence with SQL queries, report defects with full evidence in JIRA, and run regression suites before publishing the release readiness report.';

/* ================================================================
   DATA: TAB 2 - Risk-Based Explanation
   ================================================================ */
const RISK_STEPS = [
  {
    step: 1,
    title: 'Identify Business Risk',
    color: C.red,
    bullets: [
      'What happens if API fails?',
      'Financial loss? Data corruption? Security breach?',
    ],
  },
  {
    step: 2,
    title: 'Classify Risk Areas',
    color: C.orange,
    bullets: [
      'Data risk (wrong values, duplicates, orphans)',
      'Security risk (token bypass, role violation, data exposure)',
      'Integration risk (downstream failure, timeout, retry)',
      'Performance risk (slow response, memory leak, thread exhaustion)',
    ],
  },
  {
    step: 3,
    title: 'Design Tests Around Risk',
    color: C.yellow,
    bullets: [
      'High-risk flows first (transactions, auth, account creation)',
      'Critical transactions get P0 priority',
      'Security scenarios get dedicated test suite',
    ],
  },
  {
    step: 4,
    title: 'Validate Multi-Layer',
    color: C.blue,
    bullets: [
      'Contract correctness (schema compliance)',
      'Business logic accuracy (rules, state transitions)',
      'Data persistence (DB integrity, audit trail)',
      'Logging/monitoring (correlation IDs, alert triggers)',
    ],
  },
  {
    step: 5,
    title: 'Failure Simulation',
    color: C.purple,
    bullets: [
      'Invalid tokens -> expect 401',
      'Duplicate transactions -> expect idempotent behavior',
      'Network timeout -> expect graceful degradation',
      'Missing mandatory fields -> expect proper SOAP fault',
    ],
  },
  {
    step: 6,
    title: 'Prevent Production Incidents',
    color: C.green,
    bullets: [
      'Root cause analysis on every failure',
      'Prevent recurrence through regression coverage',
      'Document risk mitigation in test reports',
    ],
  },
];

const RISK_SCRIPT = 'I approach API testing from a risk perspective. First, I identify what business impact a failure would cause \u2014 financial loss, data corruption, or security breach. I classify risks into data, security, integration, and performance categories, then design test suites prioritized by risk level. I validate across multiple layers \u2014 contract compliance, business logic, data persistence, and monitoring. I also simulate failure conditions to verify graceful handling. This approach ensures we catch the most critical issues first and protect production stability.';

/* ================================================================
   DATA: TAB 3 - Data-Centric Explanation
   ================================================================ */
const DATA_STEPS = [
  {
    step: 1,
    title: 'Understand Data Model',
    color: C.blue,
    bullets: [
      'Tables, keys, relationships (ER diagram awareness)',
      'Master vs transactional data',
      'Status fields and state machines',
    ],
  },
  {
    step: 2,
    title: 'Validate Input Data Rules',
    color: C.green,
    bullets: [
      'Data types (string, numeric, date, enum)',
      'Field length constraints',
      'Required vs optional constraints',
      'Format validation (email, phone, SSN, IBAN)',
    ],
  },
  {
    step: 3,
    title: 'Execute API Call',
    color: C.orange,
    bullets: [
      'Capture full response payload',
      'Extract key IDs (customerId, accountNumber, transactionId)',
      'Verify response structure against contract',
    ],
  },
  {
    step: 4,
    title: 'Verify Database',
    color: C.purple,
    bullets: [
      'SELECT with JOINs across related tables',
      'Check foreign key relationships',
      'Validate status flags (Active, Pending, Closed)',
      'Compare API response values with DB values',
    ],
  },
  {
    step: 5,
    title: 'Data Integrity Checks',
    color: C.red,
    bullets: [
      'No duplicate records (unique constraints)',
      'No null violations on mandatory columns',
      'Correct mapping between API fields and DB columns',
      'Referential integrity (no orphan records)',
    ],
  },
  {
    step: 6,
    title: 'Audit & Logs Validation',
    color: C.cyan,
    bullets: [
      'created_by / created_date populated correctly',
      'updated_timestamp changes on modify',
      'Transaction logs contain correct amounts and timestamps',
      'Sensitive data masked in logs',
    ],
  },
];

const DATA_SCRIPT = 'I focus heavily on data validation. After understanding the data model \u2014 tables, relationships, and status fields \u2014 I validate input rules including types, lengths, and constraints. When I execute API calls, I extract key IDs and then run SQL queries to verify the data was persisted correctly. I check foreign keys, duplicate prevention, null constraints, and audit columns. I also verify that logs contain proper correlation IDs and that sensitive data is masked. This ensures the API isn\'t just returning correct responses but is also storing the truth correctly.';

/* ================================================================
   DATA: TAB 4 - Automation-Oriented Explanation
   ================================================================ */
const AUTOMATION_STEPS = [
  {
    step: 1,
    title: 'Build Reusable Collections',
    color: C.blue,
    bullets: [
      'Environment variables for base URLs, credentials',
      'Token automation (pre-request scripts)',
      'Dynamic request chaining (property transfer)',
      'Parameterized test templates',
    ],
  },
  {
    step: 2,
    title: 'Add Assertions',
    color: C.green,
    bullets: [
      'Status code validation (200, 201, 400, 401, 404, 500)',
      'Schema validation (XSD/JSON Schema)',
      'Field-level checks (XPath, JSONPath)',
      'Response time SLA assertions',
    ],
  },
  {
    step: 3,
    title: 'Data-Driven Testing',
    color: C.orange,
    bullets: [
      'Multiple datasets (CSV, Excel, DB queries)',
      'Iterative execution across data combinations',
      'Boundary value sets',
      'Negative data sets',
    ],
  },
  {
    step: 4,
    title: 'CI/CD Integration',
    color: C.purple,
    bullets: [
      'Run via CLI (testrunner.sh, Newman, Maven)',
      'Generate HTML/XML reports',
      'Pipeline integration (Jenkins, GitHub Actions, Azure DevOps)',
      'Fail build on assertion failure',
    ],
  },
  {
    step: 5,
    title: 'Automated Regression',
    color: C.red,
    bullets: [
      'Smoke suite (critical paths, runs on every deploy)',
      'Critical flow suite (end-to-end workflows)',
      'Version comparison (API backward compatibility)',
      'Scheduled regression runs (nightly, weekly)',
    ],
  },
];

const AUTOMATION_SCRIPT = 'I build API test automation with reusability in mind. I configure environment variables, automate token generation, and chain dependent calls using property transfers. I add multi-level assertions \u2014 status codes, schema compliance, and field-level validation. I implement data-driven testing with external datasets for boundary and negative coverage. The test suites are integrated into CI/CD pipelines via CLI tools, generating HTML reports and failing the build on assertion failures. I maintain separate smoke and regression suites that run on every deployment and nightly schedules.';

/* ================================================================
   DATA: TAB 5 - Story-Based (STAR) Explanation
   ================================================================ */
const STORY_STEPS = [
  {
    step: 1,
    title: 'Problem (Situation)',
    color: C.red,
    bullets: [
      '"The API was returning 200 status but the account balance was incorrect after a deposit transaction."',
      'Customer-facing impact: wrong balance displayed',
      'Detected during: regression test cycle',
    ],
  },
  {
    step: 2,
    title: 'Investigation (Task)',
    color: C.orange,
    bullets: [
      'Compared response payload field-by-field',
      'Verified DB tables (account_balance, transaction_log)',
      'Checked transformation layer mapping',
      'Reviewed correlation ID in application logs',
    ],
  },
  {
    step: 3,
    title: 'Root Cause (Action)',
    color: C.yellow,
    bullets: [
      'Incorrect mapping in backend service layer',
      'Deposit amount was being added to a different account field',
      'Unit test coverage gap in the mapping function',
      'No integration test for balance update flow',
    ],
  },
  {
    step: 4,
    title: 'Action Taken',
    color: C.blue,
    bullets: [
      'Provided SQL proof showing wrong column updated',
      'Shared correlation ID logs showing transformation error',
      'Raised detailed defect in JIRA with full evidence',
      'Suggested adding integration test for balance flow',
    ],
  },
  {
    step: 5,
    title: 'Result',
    color: C.green,
    bullets: [
      'Fix deployed within 24 hours',
      'Regression validated across all transaction types',
      'No production impact (caught in QA)',
      'Integration test added to prevent recurrence',
      'Team adopted SQL verification as standard practice',
    ],
  },
];

const STORY_SCRIPT = 'Let me share a specific example. During regression testing, I found the deposit API was returning a 200 success but the account balance wasn\'t updating correctly. I investigated by comparing the response payload, checking DB tables, and reviewing logs using the correlation ID. The root cause was an incorrect mapping in the backend service \u2014 the deposit amount was updating the wrong column. I raised a detailed defect with SQL proof and log evidence. The fix was deployed within 24 hours, I validated the regression, and the team added an integration test to prevent recurrence. This experience reinforced the importance of not trusting the status code alone \u2014 always verify the data layer.';

/* ================================================================
   DATA: TAB 6 - Strategy Guide (Decision Matrix)
   ================================================================ */
const DECISION_MATRIX = [
  {
    interviewer: 'QA Manager',
    approach: 'Lifecycle-Based',
    why: 'Shows process discipline, SDLC awareness',
    color: C.purple,
  },
  {
    interviewer: 'Architect / Senior Dev',
    approach: 'Risk-Based',
    why: 'Shows systems thinking, quality strategy',
    color: C.red,
  },
  {
    interviewer: 'Backend Engineer',
    approach: 'Data-Centric',
    why: 'Shows technical depth, DB knowledge',
    color: C.blue,
  },
  {
    interviewer: 'DevOps / Automation Lead',
    approach: 'Automation-Oriented',
    why: 'Shows engineering maturity, CI/CD fluency',
    color: C.orange,
  },
  {
    interviewer: 'Behavioral / HR Round',
    approach: 'Problem-Solution Story',
    why: 'Shows communication, impact, teamwork',
    color: C.green,
  },
];

const READING_ROOM_TIPS = [
  { trigger: 'If they ask "Walk me through your process"', style: 'Use Lifecycle' },
  { trigger: 'If they ask "What risks do you test for?"', style: 'Use Risk-Based' },
  { trigger: 'If they ask "How do you validate the backend?"', style: 'Use Data-Centric' },
  { trigger: 'If they ask "How do you automate?"', style: 'Use Automation' },
  { trigger: 'If they ask "Tell me about a bug you found"', style: 'Use Story' },
];

const POWER_COMBO = 'In a real interview, combine 2-3 styles. Start with Lifecycle for structure, add Data-Centric for technical depth, and end with a Story for impact. This shows you\'re both systematic AND practical.';

const CHEAT_SHEET = {
  always: [
    'Assertions',
    'SQL verification',
    'JIRA defects',
    'Regression',
  ],
  never: [
    '"I just checked the response"',
    '"I used Postman to test"',
  ],
  proPhrases: [
    'Contract validation',
    'Persistence verification',
    'Multi-layer assertion',
    'Idempotency check',
    'Correlation ID tracing',
  ],
};

/* ================================================================
   COMPONENT
   ================================================================ */
function InterviewStrategies() {
  const [activeTab, setActiveTab] = useState('lifecycle');
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${C.bgGradientStart} 0%, ${C.bgGradientEnd} 100%)`,
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: C.text,
    },
    header: {
      marginBottom: '24px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '800',
      color: C.text,
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px',
    },
    titleAccent: {
      color: C.accent,
    },
    subtitle: {
      fontSize: '14px',
      color: C.textMuted,
      margin: '0 0 16px 0',
      lineHeight: '1.5',
    },
    statsBar: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      marginBottom: '20px',
    },
    statBadge: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '8px',
      background: `${color}15`,
      border: `1px solid ${color}33`,
      fontSize: '13px',
      fontWeight: '600',
      color: color,
    }),
    statValue: {
      fontSize: '18px',
      fontWeight: '800',
    },
    tabBar: {
      display: 'flex',
      gap: '4px',
      overflowX: 'auto',
      paddingBottom: '4px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    tab: (isActive) => ({
      padding: '10px 16px',
      borderRadius: '8px 8px 0 0',
      border: 'none',
      background: isActive ? C.card : 'rgba(255,255,255,0.05)',
      color: isActive ? C.accent : C.textMuted,
      fontSize: '13px',
      fontWeight: isActive ? '700' : '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      borderBottom: isActive ? `2px solid ${C.accent}` : '2px solid transparent',
      whiteSpace: 'nowrap',
    }),
    card: {
      background: C.card,
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '12px',
      border: `1px solid ${C.border}`,
    },
    cardClickable: (isExpanded) => ({
      background: isExpanded ? C.cardLight : C.card,
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '8px',
      border: `1px solid ${isExpanded ? C.accent + '44' : C.border}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
    },
    cardTitle: {
      fontSize: '15px',
      fontWeight: '700',
      color: C.text,
      margin: 0,
    },
    stepNumber: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: `${color}22`,
      color: color,
      fontSize: '14px',
      fontWeight: '800',
      flexShrink: 0,
      border: `2px solid ${color}`,
    }),
    expandArrow: (isExpanded) => ({
      fontSize: '12px',
      color: C.textMuted,
      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      flexShrink: 0,
    }),
    expandedContent: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: `1px solid ${C.border}`,
    },
    bulletList: {
      listStyle: 'none',
      padding: 0,
      margin: '10px 0 0 0',
    },
    bulletItem: {
      padding: '5px 0 5px 20px',
      position: 'relative',
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.5',
    },
    bestAnswerBox: {
      background: `linear-gradient(135deg, rgba(212, 160, 23, 0.08) 0%, rgba(78, 204, 163, 0.08) 100%)`,
      border: `2px solid ${C.gold}`,
      borderRadius: '12px',
      padding: '20px',
      marginTop: '24px',
    },
    bestAnswerTitle: {
      fontSize: '16px',
      fontWeight: '800',
      color: C.gold,
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    bestAnswerText: {
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.8',
      textAlign: 'justify',
    },
    sectionHeader: {
      fontSize: '18px',
      fontWeight: '700',
      color: C.text,
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionCount: {
      fontSize: '12px',
      fontWeight: '600',
      padding: '3px 10px',
      borderRadius: '12px',
      background: `${C.accent}22`,
      color: C.accent,
    },
    badge: (color) => ({
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '700',
      background: `${color}22`,
      color: color,
      border: `1px solid ${color}44`,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }),
    audienceBadge: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: '8px',
      background: `${color}18`,
      border: `1px solid ${color}44`,
      fontSize: '13px',
      fontWeight: '700',
      color: color,
      marginBottom: '16px',
    }),
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '700',
      color: C.accent,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: `2px solid ${C.border}`,
      background: 'rgba(0,0,0,0.2)',
    },
    td: {
      padding: '10px 16px',
      fontSize: '13px',
      color: C.textMuted,
      borderBottom: `1px solid ${C.border}44`,
      lineHeight: '1.5',
    },
    tipCard: (borderColor) => ({
      background: C.card,
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '16px',
      border: `1px solid ${C.border}`,
      borderLeft: `4px solid ${borderColor}`,
    }),
    tipTitle: (color) => ({
      fontSize: '16px',
      fontWeight: '700',
      color: color,
      marginBottom: '14px',
    }),
  };

  /* ================================================================
     RENDER HELPERS
     ================================================================ */

  // Render a single expandable step card
  const renderStepCard = (step, tabPrefix) => {
    const cardId = `${tabPrefix}-${step.step}`;
    const isExpanded = expandedCards[cardId];
    return (
      <div
        key={cardId}
        style={styles.cardClickable(isExpanded)}
        onClick={() => toggleCard(cardId)}
      >
        <div style={styles.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <span style={styles.stepNumber(step.color)}>{step.step}</span>
            <h3 style={styles.cardTitle}>{step.title}</h3>
          </div>
          <span style={styles.expandArrow(isExpanded)}>&#9660;</span>
        </div>
        {isExpanded && (
          <div style={styles.expandedContent}>
            <ul style={styles.bulletList}>
              {step.bullets.map((bullet, i) => (
                <li key={i} style={styles.bulletItem}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: step.color,
                    fontWeight: '800',
                  }}>
                    &#8227;
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Render sample answer script box
  const renderSampleScript = (text) => (
    <div style={styles.bestAnswerBox}>
      <div style={styles.bestAnswerTitle}>
        Sample Answer Script
      </div>
      <p style={styles.bestAnswerText}>"{text}"</p>
    </div>
  );

  /* ================================================================
     TAB 1: Lifecycle (SDLC)
     ================================================================ */
  const renderLifecycleTab = () => (
    <div>
      <div style={styles.audienceBadge(C.purple)}>
        Best for: QA Managers
      </div>
      <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 20px 0', lineHeight: '1.5' }}>
        Structured SDLC flow that shows process maturity
      </p>

      <div style={styles.sectionHeader}>
        <span>SDLC Lifecycle Steps</span>
        <span style={styles.sectionCount}>{LIFECYCLE_STEPS.length} steps</span>
      </div>

      {LIFECYCLE_STEPS.map((step) => renderStepCard(step, 'lifecycle'))}
      {renderSampleScript(LIFECYCLE_SCRIPT)}
    </div>
  );

  /* ================================================================
     TAB 2: Risk-Based
     ================================================================ */
  const renderRiskTab = () => (
    <div>
      <div style={styles.audienceBadge(C.red)}>
        Best for: Architects / Senior Developers
      </div>
      <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 20px 0', lineHeight: '1.5' }}>
        Shows you think about quality protection, not just test execution
      </p>

      <div style={styles.sectionHeader}>
        <span>Risk-Based Testing Steps</span>
        <span style={styles.sectionCount}>{RISK_STEPS.length} steps</span>
      </div>

      {RISK_STEPS.map((step) => renderStepCard(step, 'risk'))}
      {renderSampleScript(RISK_SCRIPT)}
    </div>
  );

  /* ================================================================
     TAB 3: Data-Centric
     ================================================================ */
  const renderDataTab = () => (
    <div>
      <div style={styles.audienceBadge(C.blue)}>
        Best for: Backend Engineers
      </div>
      <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 20px 0', lineHeight: '1.5' }}>
        Shows you understand what happens behind the API
      </p>

      <div style={styles.sectionHeader}>
        <span>Data Validation Steps</span>
        <span style={styles.sectionCount}>{DATA_STEPS.length} steps</span>
      </div>

      {DATA_STEPS.map((step) => renderStepCard(step, 'data'))}
      {renderSampleScript(DATA_SCRIPT)}
    </div>
  );

  /* ================================================================
     TAB 4: Automation
     ================================================================ */
  const renderAutomationTab = () => (
    <div>
      <div style={styles.audienceBadge(C.orange)}>
        Best for: DevOps / Automation Leads
      </div>
      <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 20px 0', lineHeight: '1.5' }}>
        Shows engineering maturity and CI/CD awareness
      </p>

      <div style={styles.sectionHeader}>
        <span>Automation Strategy Steps</span>
        <span style={styles.sectionCount}>{AUTOMATION_STEPS.length} steps</span>
      </div>

      {AUTOMATION_STEPS.map((step) => renderStepCard(step, 'automation'))}
      {renderSampleScript(AUTOMATION_SCRIPT)}
    </div>
  );

  /* ================================================================
     TAB 5: Story-Based (STAR)
     ================================================================ */
  const renderStoryTab = () => (
    <div>
      <div style={styles.audienceBadge(C.green)}>
        Best for: Behavioral / HR Rounds
      </div>
      <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 20px 0', lineHeight: '1.5' }}>
        STAR format: Situation &rarr; Task &rarr; Action &rarr; Result
      </p>

      <div style={styles.sectionHeader}>
        <span>Problem-Solution Narrative</span>
        <span style={styles.sectionCount}>{STORY_STEPS.length} steps</span>
      </div>

      {STORY_STEPS.map((step) => renderStepCard(step, 'story'))}
      {renderSampleScript(STORY_SCRIPT)}
    </div>
  );

  /* ================================================================
     TAB 6: Strategy Guide
     ================================================================ */
  const renderGuideTab = () => (
    <div>
      <div style={styles.sectionHeader}>
        <span>Match Your Answer to the Interviewer</span>
      </div>

      {/* Decision Matrix Table */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Interviewer Type</th>
              <th style={styles.th}>Best Approach</th>
              <th style={styles.th}>Why It Works</th>
            </tr>
          </thead>
          <tbody>
            {DECISION_MATRIX.map((row, i) => (
              <tr key={i}>
                <td style={{ ...styles.td, fontWeight: '700', color: C.text }}>
                  {row.interviewer}
                </td>
                <td style={styles.td}>
                  <span style={styles.badge(row.color)}>{row.approach}</span>
                </td>
                <td style={styles.td}>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tips for Reading the Room */}
      <div style={styles.tipCard(C.cyan)}>
        <div style={styles.tipTitle(C.cyan)}>Tips for Reading the Room</div>
        <ul style={styles.bulletList}>
          {READING_ROOM_TIPS.map((tip, i) => (
            <li key={i} style={styles.bulletItem}>
              <span style={{
                position: 'absolute',
                left: 0,
                color: C.cyan,
                fontWeight: '800',
              }}>
                &#8227;
              </span>
              <span style={{ color: C.text, fontWeight: '600' }}>{tip.trigger}</span>
              <span style={{ color: C.accent, fontWeight: '700', marginLeft: '8px' }}>
                &rarr; {tip.style}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Power Combo */}
      <div style={styles.tipCard(C.green)}>
        <div style={styles.tipTitle(C.green)}>Power Combo</div>
        <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.8', margin: 0 }}>
          "{POWER_COMBO}"
        </p>
      </div>

      {/* Quick Cheat Sheet */}
      <div style={styles.tipCard(C.gold)}>
        <div style={styles.tipTitle(C.gold)}>Quick Cheat Sheet</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {/* Always Mention */}
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: C.green,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px',
              paddingBottom: '6px',
              borderBottom: `1px solid ${C.green}44`,
            }}>
              Always Mention
            </div>
            <ul style={styles.bulletList}>
              {CHEAT_SHEET.always.map((item, i) => (
                <li key={i} style={{ ...styles.bulletItem, paddingLeft: '16px' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: C.green,
                    fontWeight: '800',
                  }}>
                    +
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Never Say */}
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: C.red,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px',
              paddingBottom: '6px',
              borderBottom: `1px solid ${C.red}44`,
            }}>
              Never Say
            </div>
            <ul style={styles.bulletList}>
              {CHEAT_SHEET.never.map((item, i) => (
                <li key={i} style={{ ...styles.bulletItem, paddingLeft: '16px' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: C.red,
                    fontWeight: '800',
                  }}>
                    &times;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Phrases */}
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: C.accent,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px',
              paddingBottom: '6px',
              borderBottom: `1px solid ${C.accent}44`,
            }}>
              Pro Phrases
            </div>
            <ul style={styles.bulletList}>
              {CHEAT_SHEET.proPhrases.map((item, i) => (
                <li key={i} style={{ ...styles.bulletItem, paddingLeft: '16px' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: C.accent,
                    fontWeight: '800',
                  }}>
                    &#9733;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  /* ================================================================
     RENDER: Tab Content Router
     ================================================================ */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'lifecycle': return renderLifecycleTab();
      case 'risk': return renderRiskTab();
      case 'data': return renderDataTab();
      case 'automation': return renderAutomationTab();
      case 'story': return renderStoryTab();
      case 'guide': return renderGuideTab();
      default: return renderLifecycleTab();
    }
  };

  /* ================================================================
     MAIN RENDER
     ================================================================ */
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.titleAccent}>Interview</span> Explanation Strategies
        </h1>
        <p style={styles.subtitle}>
          5 different ways to explain your API/SOAP testing experience in banking interviews -- match your answer to the interviewer
        </p>
      </div>

      {/* Summary Stats */}
      <div style={styles.statsBar}>
        <div style={styles.statBadge(C.accent)}>
          <span style={styles.statValue}>5</span>
          Strategies
        </div>
        <div style={styles.statBadge(C.blue)}>
          <span style={styles.statValue}>30</span>
          Steps Total
        </div>
        <div style={styles.statBadge(C.orange)}>
          <span style={styles.statValue}>5</span>
          Sample Scripts
        </div>
        <div style={styles.statBadge(C.purple)}>
          <span style={styles.statValue}>1</span>
          Decision Matrix
        </div>
      </div>

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={styles.tab(activeTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{
              marginRight: '6px',
              fontWeight: '800',
              fontSize: '11px',
              opacity: 0.7,
              display: 'inline-block',
              width: '14px',
              height: '14px',
              borderRadius: '3px',
              background: activeTab === tab.id ? `${C.accent}33` : 'transparent',
              textAlign: 'center',
              lineHeight: '14px',
            }}>
              {tab.icon}
            </span>
            {tab.label}
            <span style={{
              marginLeft: '6px',
              fontSize: '10px',
              opacity: 0.6,
              background: 'rgba(255,255,255,0.1)',
              padding: '1px 6px',
              borderRadius: '8px',
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}

export default InterviewStrategies;

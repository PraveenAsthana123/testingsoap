import React, { useState } from 'react';

/* ================================================================
   API Testing Interview Script
   Comprehensive interview preparation combining Traditional Role-Based
   and Modern "Problem-Engineering-Risk-Value" approaches
   7 Tabs: Opening & Pitch, 4-Layer Model, Role-Based Scripts,
           STAR Story, Banking Scenarios, Error Handling, Tools & Defects
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
  { id: 'opening', label: 'Opening & Pitch', icon: 'O' },
  { id: 'layers', label: '4-Layer Model', icon: 'L' },
  { id: 'roles', label: 'Role-Based Scripts', icon: 'R' },
  { id: 'star', label: 'STAR Story', icon: 'S' },
  { id: 'scenarios', label: 'Banking Scenarios', icon: 'B' },
  { id: 'errors', label: 'Error Handling', icon: 'E' },
  { id: 'tools', label: 'Tools & Defects', icon: 'T' },
];

/* ================================================================
   DATA: TAB 1 - Opening & Pitch
   ================================================================ */
const PITCH_OPTIONS = [
  {
    id: 'traditional',
    title: 'Option A -- Traditional Pitch (20-30 sec)',
    text: 'Hi, I\'m a QA Engineer focused on backend/API testing. In my projects, I validate REST and SOAP integrations end-to-end: contract testing (Swagger/WSDL), authentication/authorization, data integrity using SQL, negative/security scenarios, and production-like monitoring using logs/traces. I work closely with Dev, BA, and DevOps to ensure reliable releases and fast defect triage.',
  },
  {
    id: 'engineering',
    title: 'Option B -- Engineering Pitch (Executive Framing)',
    text: 'I approach API testing as a risk-control mechanism. My goal is to validate business rules, data integrity, security, and system resilience before defects reach customers. I treat every API as a contract between systems and verify correctness at multiple layers: interface, logic, data, and behavior under failure.',
  },
];

const FLOW_STEPS = [
  'Requirement',
  'API Contract',
  'Test Design',
  'Test Data',
  'Execute (Postman/SoapUI)',
  'Validate (Response + DB)',
  'Defect',
  'Retest',
  'Regression',
  'Report',
  'Sign-off',
];

/* ================================================================
   DATA: TAB 2 - 4-Layer Model
   ================================================================ */
const LAYERS = [
  {
    id: 1,
    title: 'Contract Integrity',
    color: C.blue,
    subtitle: 'Interface-level correctness',
    bullets: [
      'Endpoint, method (GET/POST/PUT/DELETE)',
      'Schema validation (XSD/JSON Schema)',
      'Status codes & error model',
      'Request/response structure compliance',
    ],
  },
  {
    id: 2,
    title: 'Business Logic Validation',
    color: C.green,
    subtitle: 'Rules and state enforcement',
    bullets: [
      'Field validations (required, format, length)',
      'Conditional rules (if deposit < minimum, reject)',
      'State transitions (Active -> Suspended -> Closed)',
      'Cross-field validation',
    ],
  },
  {
    id: 3,
    title: 'Data Consistency',
    color: C.orange,
    subtitle: 'Database truth verification',
    bullets: [
      'DB verification with SQL',
      'Referential integrity (FK relationships)',
      'Audit logs (created_by, updated_date)',
      'No duplicate/orphan records',
    ],
  },
  {
    id: 4,
    title: 'System Behavior & Risk',
    color: C.red,
    subtitle: 'Security, resilience, and edge cases',
    bullets: [
      'Auth & RBAC enforcement',
      'Rate limits & throttling',
      'Idempotency (retry same request)',
      'Error handling & graceful degradation',
    ],
  },
];

/* ================================================================
   DATA: TAB 3 - Role-Based Scripts
   ================================================================ */
const ROLES = [
  {
    id: 'lead',
    title: 'Test Manager / QA Lead',
    color: C.purple,
    icon: 'TM',
    bullets: [
      'Confirms scope: APIs, endpoints, integrations, environments',
      'Defines test strategy: functional + negative + security + data + performance smoke',
      'Entry/exit criteria, risk areas, defect SLA, reporting cadence',
      'Coordinates UAT + release readiness',
    ],
  },
  {
    id: 'admin',
    title: 'Admin / QA Environment Owner',
    color: C.cyan,
    icon: 'AO',
    bullets: [
      'Access provisioning: tokens, certs, VPN, roles',
      'Environment health: endpoints, configs, DB access, stubs/mocks if needed',
      'Test data setup: seed scripts, masking rules, refresh cadence',
      'Tools/admin: Postman collections, SoapUI projects, CI jobs, JIRA workflows',
    ],
  },
  {
    id: 'tester',
    title: 'Tester / SDET (Main Story)',
    color: C.accent,
    icon: 'QA',
    bullets: [
      'Converts requirements into endpoint-level test cases',
      'Creates data, executes, validates payload + DB + logs',
      'Raises defects with reproducible steps + evidence',
      'Re-tests, runs regression suite, shares quality summary',
    ],
  },
];

/* ================================================================
   DATA: TAB 4 - STAR Story
   ================================================================ */
const STAR_SECTIONS = {
  situation: {
    label: 'S -- Situation',
    color: C.red,
    text: 'In a retail banking CRM integration, multiple services exchanged customer/account data (create/update/search). The risk was wrong data mapping or auth failures impacting downstream systems.',
  },
  task: {
    label: 'T -- Task',
    color: C.orange,
    text: 'My task was to validate API correctness, security, and data integrity for both master data (customer/contact) and transactional flows (account creation, deposits), and ensure stable regression.',
  },
  result: {
    label: 'R -- Result',
    color: C.green,
    text: 'We caught schema mismatches and incorrect mappings early, reduced production incidents, and improved release confidence through repeatable regression suites.',
  },
};

const STAR_ACTIONS = [
  {
    step: 1,
    title: 'Understand contract',
    detail: 'I reviewed Swagger/WSDL, request/response schema, required headers, status codes, and error model.',
    color: C.blue,
  },
  {
    step: 2,
    title: 'Auth & roles',
    detail: 'I validated authentication (token/cert) and authorization (role-based access). I tested both allowed and denied roles.',
    color: C.purple,
  },
  {
    step: 3,
    title: 'Design test cases',
    detail: 'Positive, negative, boundary, idempotency, pagination, sorting/filtering, and concurrency where relevant.',
    color: C.green,
  },
  {
    step: 4,
    title: 'Prepare test data',
    detail: 'Created clean customers and linked entities; tracked IDs; ensured teardown or reusability.',
    color: C.orange,
  },
  {
    step: 5,
    title: 'Execute in Postman/SoapUI',
    detail: 'Used collections/suites, environment variables, chaining (token -> create -> query -> update), and assertions.',
    color: C.cyan,
  },
  {
    step: 6,
    title: 'Validate database',
    detail: 'Verified persistence and mapping with SQL joins: counts, key relationships, null rules, duplicates, and audit fields.',
    color: C.blue,
  },
  {
    step: 7,
    title: 'Observability checks',
    detail: 'When failures happened, I checked logs/trace IDs, gateway responses, and backend error messages to isolate root cause.',
    color: C.yellow,
  },
  {
    step: 8,
    title: 'Defect management',
    detail: 'Logged issues in JIRA with request/response evidence, correlation IDs, DB proof, expected vs actual, severity, and impact.',
    color: C.red,
  },
  {
    step: 9,
    title: 'Regression + reporting',
    detail: 'After fixes, I re-tested, ran regression subset, and published daily test report with pass/fail and defect trends.',
    color: C.green,
  },
];

/* ================================================================
   DATA: TAB 5 - Banking Scenarios
   ================================================================ */
const SCENARIO_CATEGORIES = [
  {
    id: 'functional',
    title: 'Functional (Happy Path)',
    color: C.green,
    scenarios: [
      'Create customer/contact (master)',
      'Create deposit/savings account linked to customer',
      'Get account details, balances, transactions',
      'Update address/phone/email, verify downstream sync',
      'Search APIs (filters, pagination, sorting)',
    ],
  },
  {
    id: 'negative',
    title: 'Negative / Validation',
    color: C.red,
    scenarios: [
      'Missing required fields',
      'Invalid formats (DOB, phone, email)',
      'Invalid account type / unsupported currency',
      'Duplicate customer creation rules',
      'Invalid state transitions (close before open)',
    ],
  },
  {
    id: 'security',
    title: 'Security / Access Control',
    color: C.orange,
    scenarios: [
      'Missing/expired token',
      'Wrong role access (RBAC)',
      'Tampered token/header',
      'Data leakage checks (restricted fields not returned)',
    ],
  },
  {
    id: 'data',
    title: 'Data Integrity (SQL)',
    color: C.blue,
    scenarios: [
      'Customer-Account relationship',
      'No orphan records',
      'Audit fields: created_by/created_dt',
      'Status flags and reference tables consistent',
    ],
  },
];

const SCENARIO_MATRIX = [
  { dimension: 'Positive', example: 'Valid customer -> Create savings account' },
  { dimension: 'Boundary', example: 'Minimum deposit amount' },
  { dimension: 'Negative', example: 'Invalid currency code' },
  { dimension: 'Security', example: 'Unauthorized role trying to create account' },
  { dimension: 'Data', example: 'Verify account record in DB' },
  { dimension: 'Resilience', example: 'Retry same request (idempotency check)' },
];

/* ================================================================
   DATA: TAB 6 - Error Handling
   ================================================================ */
const ERROR_CASES = [
  {
    id: 'err401',
    code: '401',
    title: '401 Unauthorized',
    color: C.red,
    actions: [
      'Verified token expiration',
      'Checked role mapping',
      'Validated gateway config',
      'Confirmed header structure',
    ],
    answer: 'Checked token generation, scopes, role mapping, gateway policy; validated correct headers.',
  },
  {
    id: 'err400',
    code: '400',
    title: '400 Bad Request',
    color: C.orange,
    actions: [
      'Compared payload vs contract',
      'Checked data types, required fields, enums',
      'Validated validation rules',
    ],
    answer: 'Compared payload vs contract; checked data types, required fields, enums, and validation rules.',
  },
  {
    id: 'err500',
    code: '500',
    title: '500 Internal Server Error',
    color: C.purple,
    actions: [
      'Used correlation ID',
      'Reviewed backend logs',
      'Identified null mapping in payload transformation',
      'Provided DB evidence',
    ],
    answer: 'Used correlation ID + logs; reproduced with minimal payload; isolated backend null/mapping issue.',
  },
  {
    id: 'errData',
    code: 'DATA',
    title: 'Data Mismatch',
    color: C.blue,
    actions: [
      'Compared API payload vs DB schema',
      'Identified missing transformation rule',
      'Attached SQL output in defect',
    ],
    answer: 'Compared API payload vs DB schema; identified missing transformation rule; attached SQL output in defect.',
  },
];

const CHALLENGES = [
  {
    problem: 'Inconsistent API contracts across versions',
    solution: 'Version comparison documentation',
    color: C.red,
  },
  {
    problem: 'Token expiry during regression runs',
    solution: 'Automated token refresh',
    color: C.orange,
  },
  {
    problem: 'Test data dependency across environments',
    solution: 'Isolated reusable data sets',
    color: C.yellow,
  },
  {
    problem: 'Backend logs not easily accessible',
    solution: 'Coordinated with DevOps for log access',
    color: C.blue,
  },
];

/* ================================================================
   DATA: TAB 7 - Tools & Defects
   ================================================================ */
const TOOLS = [
  { name: 'Postman', desc: 'Collections, environments, variables, pre-request scripts, tests (assertions), chaining, Newman for CI', color: C.orange },
  { name: 'SoapUI', desc: 'WSDL import, SOAP suites, property transfer, assertions, WS-Security', color: C.blue },
  { name: 'Swagger/OpenAPI', desc: 'Contract source of truth; schema validation; endpoint discovery', color: C.green },
  { name: 'SQL', desc: 'Data validation, joins, reconciliation, duplicates, null checks, referential integrity', color: C.cyan },
  { name: 'JIRA', desc: 'Defect lifecycle, severity/priority, evidence, traceability to user stories', color: C.purple },
  { name: 'CI/CD', desc: 'Run smoke/regression via Newman in pipeline; publish reports', color: C.red },
];

const DEFECT_FIELDS = [
  'Summary + endpoint',
  'Environment + build',
  'Steps to reproduce',
  'Request + headers (masked)',
  'Response + status code',
  'Expected vs actual',
  'DB query proof',
  'Logs/trace/correlation ID',
  'Severity + business impact',
];

const LIGHTNING_QA = [
  {
    q: 'What\'s the difference between API and backend testing?',
    a: 'API testing validates service interfaces and contracts; backend testing also includes DB, processing logic, integrations, jobs, and logs.',
  },
  {
    q: 'How do you decide test coverage?',
    a: 'Risk-based: critical flows, data integrity, security, error handling, and high-change endpoints first.',
  },
  {
    q: 'How do you validate schema?',
    a: 'Contract comparison + automated assertions + negative tests for invalid types/enums.',
  },
];

/* ================================================================
   COMPONENT
   ================================================================ */
function ApiTestingScript() {
  const [activeTab, setActiveTab] = useState('opening');
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
    goldCard: {
      background: `linear-gradient(135deg, rgba(212, 160, 23, 0.08) 0%, rgba(78, 204, 163, 0.08) 100%)`,
      border: `2px solid ${C.gold}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
    },
    goldTitle: {
      fontSize: '16px',
      fontWeight: '800',
      color: C.gold,
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    goldText: {
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
    flowContainer: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '4px',
      padding: '20px',
      background: C.card,
      borderRadius: '10px',
      border: `1px solid ${C.border}`,
      marginTop: '20px',
    },
    flowStep: {
      padding: '8px 14px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      color: C.text,
      background: `${C.accent}22`,
      border: `1px solid ${C.accent}44`,
      whiteSpace: 'nowrap',
    },
    flowArrow: {
      fontSize: '16px',
      color: C.accent,
      fontWeight: '800',
    },
    layerCard: (color, isExpanded) => ({
      background: isExpanded ? C.cardLight : C.card,
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '12px',
      border: `1px solid ${isExpanded ? color + '44' : C.border}`,
      borderLeft: `4px solid ${color}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
    roleCard: (color) => ({
      background: C.card,
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '12px',
      border: `1px solid ${C.border}`,
      borderTop: `3px solid ${color}`,
    }),
    roleIcon: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: `${color}22`,
      color: color,
      fontSize: '14px',
      fontWeight: '800',
      border: `2px solid ${color}`,
      flexShrink: 0,
    }),
    starLabel: (color) => ({
      display: 'inline-block',
      padding: '6px 16px',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '800',
      background: `${color}22`,
      color: color,
      border: `1px solid ${color}44`,
      marginBottom: '10px',
    }),
    starText: {
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.7',
      textAlign: 'justify',
    },
    scenarioCategoryCard: (color) => ({
      background: C.card,
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '12px',
      border: `1px solid ${C.border}`,
      borderLeft: `4px solid ${color}`,
    }),
    scenarioItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '6px 0',
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.5',
    },
    scenarioNumber: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      background: `${color}22`,
      color: color,
      fontSize: '11px',
      fontWeight: '800',
      flexShrink: 0,
    }),
    errorCodeBadge: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 14px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '800',
      background: `${color}22`,
      color: color,
      border: `2px solid ${color}`,
      flexShrink: 0,
    }),
    answerBox: {
      background: `rgba(78, 204, 163, 0.08)`,
      borderRadius: '8px',
      padding: '12px 16px',
      marginTop: '12px',
      borderLeft: `3px solid ${C.accent}`,
    },
    answerLabel: {
      fontSize: '11px',
      fontWeight: '700',
      color: C.accent,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px',
    },
    toolCard: (color) => ({
      background: C.card,
      borderRadius: '10px',
      padding: '14px 16px',
      marginBottom: '8px',
      border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${color}`,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    }),
    toolName: (color) => ({
      fontSize: '14px',
      fontWeight: '700',
      color: color,
      minWidth: '110px',
      flexShrink: 0,
    }),
    toolDesc: {
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.5',
    },
    qaCard: {
      background: C.card,
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '10px',
      border: `1px solid ${C.border}`,
    },
    qaQuestion: {
      fontSize: '14px',
      fontWeight: '700',
      color: C.text,
      marginBottom: '8px',
    },
    qaAnswer: {
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.6',
    },
  };

  /* ================================================================
     RENDER HELPERS
     ================================================================ */

  const renderBullet = (bullet, index, color) => (
    <li key={index} style={styles.bulletItem}>
      <span style={{
        position: 'absolute',
        left: 0,
        color: color,
        fontWeight: '800',
      }}>
        &#8227;
      </span>
      {bullet}
    </li>
  );

  /* ================================================================
     TAB 1: Opening & Pitch
     ================================================================ */
  const renderOpeningTab = () => (
    <div>
      <div style={styles.sectionHeader}>
        <span>Interview Opening Statements</span>
        <span style={styles.sectionCount}>2 options</span>
      </div>

      {PITCH_OPTIONS.map((opt) => (
        <div key={opt.id} style={styles.goldCard}>
          <div style={styles.goldTitle}>{opt.title}</div>
          <p style={styles.goldText}>"{opt.text}"</p>
        </div>
      ))}

      {/* Flow Diagram */}
      <div style={styles.sectionHeader}>
        <span>API Testing Flow</span>
        <span style={styles.sectionCount}>{FLOW_STEPS.length} steps</span>
      </div>

      <div style={styles.flowContainer}>
        {FLOW_STEPS.map((step, i) => (
          <React.Fragment key={i}>
            <span style={styles.flowStep}>{step}</span>
            {i < FLOW_STEPS.length - 1 && (
              <span style={styles.flowArrow}>&rarr;</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  /* ================================================================
     TAB 2: 4-Layer Model
     ================================================================ */
  const renderLayersTab = () => (
    <div>
      <div style={styles.sectionHeader}>
        <span>How I Think About APIs</span>
        <span style={styles.sectionCount}>4 layers</span>
      </div>

      <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 20px 0', lineHeight: '1.5' }}>
        Every API is validated across four layers -- from interface correctness to system resilience
      </p>

      {LAYERS.map((layer) => {
        const cardId = `layer-${layer.id}`;
        const isExpanded = expandedCards[cardId];
        return (
          <div
            key={cardId}
            style={styles.layerCard(layer.color, isExpanded)}
            onClick={() => toggleCard(cardId)}
          >
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={styles.stepNumber(layer.color)}>{layer.id}</span>
                <div>
                  <h3 style={styles.cardTitle}>{layer.title}</h3>
                  <span style={{ fontSize: '12px', color: C.textMuted }}>{layer.subtitle}</span>
                </div>
              </div>
              <span style={styles.expandArrow(isExpanded)}>&#9660;</span>
            </div>
            {isExpanded && (
              <div style={styles.expandedContent}>
                <ul style={styles.bulletList}>
                  {layer.bullets.map((b, i) => renderBullet(b, i, layer.color))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  /* ================================================================
     TAB 3: Role-Based Scripts
     ================================================================ */
  const renderRolesTab = () => (
    <div>
      <div style={styles.sectionHeader}>
        <span>What Each Role Says</span>
        <span style={styles.sectionCount}>3 roles</span>
      </div>

      <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 20px 0', lineHeight: '1.5' }}>
        Understand what each role contributes to the API testing lifecycle
      </p>

      {ROLES.map((role) => {
        const cardId = `role-${role.id}`;
        const isExpanded = expandedCards[cardId];
        return (
          <div
            key={cardId}
            style={{ ...styles.roleCard(role.color), cursor: 'pointer' }}
            onClick={() => toggleCard(cardId)}
          >
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={styles.roleIcon(role.color)}>{role.icon}</span>
                <h3 style={styles.cardTitle}>{role.title}</h3>
              </div>
              <span style={styles.expandArrow(isExpanded)}>&#9660;</span>
            </div>
            {isExpanded && (
              <div style={styles.expandedContent}>
                <ul style={styles.bulletList}>
                  {role.bullets.map((b, i) => renderBullet(b, i, role.color))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  /* ================================================================
     TAB 4: STAR Story
     ================================================================ */
  const renderStarTab = () => (
    <div>
      <div style={styles.sectionHeader}>
        <span>Core Interview Story (Banking CRM)</span>
        <span style={styles.sectionCount}>STAR format</span>
      </div>

      {/* Situation */}
      <div style={{ ...styles.card, marginBottom: '12px' }}>
        <span style={styles.starLabel(STAR_SECTIONS.situation.color)}>
          {STAR_SECTIONS.situation.label}
        </span>
        <p style={styles.starText}>"{STAR_SECTIONS.situation.text}"</p>
      </div>

      {/* Task */}
      <div style={{ ...styles.card, marginBottom: '12px' }}>
        <span style={styles.starLabel(STAR_SECTIONS.task.color)}>
          {STAR_SECTIONS.task.label}
        </span>
        <p style={styles.starText}>"{STAR_SECTIONS.task.text}"</p>
      </div>

      {/* Actions */}
      <div style={styles.sectionHeader}>
        <span>A -- Actions</span>
        <span style={styles.sectionCount}>{STAR_ACTIONS.length} sub-steps</span>
      </div>

      {STAR_ACTIONS.map((action) => {
        const cardId = `star-action-${action.step}`;
        const isExpanded = expandedCards[cardId];
        return (
          <div
            key={cardId}
            style={styles.cardClickable(isExpanded)}
            onClick={() => toggleCard(cardId)}
          >
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={styles.stepNumber(action.color)}>{action.step}</span>
                <h3 style={styles.cardTitle}>{action.title}</h3>
              </div>
              <span style={styles.expandArrow(isExpanded)}>&#9660;</span>
            </div>
            {isExpanded && (
              <div style={styles.expandedContent}>
                <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.7', margin: 0 }}>
                  "{action.detail}"
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Result */}
      <div style={{ ...styles.card, marginTop: '16px' }}>
        <span style={styles.starLabel(STAR_SECTIONS.result.color)}>
          {STAR_SECTIONS.result.label}
        </span>
        <p style={styles.starText}>"{STAR_SECTIONS.result.text}"</p>
      </div>
    </div>
  );

  /* ================================================================
     TAB 5: Banking Scenarios
     ================================================================ */
  const renderScenariosTab = () => (
    <div>
      <div style={styles.sectionHeader}>
        <span>Quick-Reference Scenario Lists</span>
        <span style={styles.sectionCount}>18 scenarios</span>
      </div>

      {SCENARIO_CATEGORIES.map((cat) => (
        <div key={cat.id} style={styles.scenarioCategoryCard(cat.color)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={styles.badge(cat.color)}>{cat.title}</span>
            <span style={{ fontSize: '12px', color: C.textMuted }}>
              {cat.scenarios.length} scenarios
            </span>
          </div>
          {cat.scenarios.map((s, i) => (
            <div key={i} style={styles.scenarioItem}>
              <span style={styles.scenarioNumber(cat.color)}>{i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Account Creation Use Case */}
      <div style={{ ...styles.goldCard, marginTop: '24px' }}>
        <div style={styles.goldTitle}>Account Creation Use Case -- Detailed Walkthrough</div>
        <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.6', marginBottom: '16px' }}>
          <strong style={{ color: C.text }}>Business Problem: </strong>
          "If account creation API fails or mis-maps data, customers may see incorrect balances or regulatory issues."
        </p>

        <div style={styles.sectionHeader}>
          <span style={{ fontSize: '14px' }}>Scenario Matrix</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Dimension</th>
                <th style={styles.th}>Example Scenario</th>
              </tr>
            </thead>
            <tbody>
              {SCENARIO_MATRIX.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...styles.td, fontWeight: '700', color: C.text }}>{row.dimension}</td>
                  <td style={styles.td}>{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ================================================================
     TAB 6: Error Handling
     ================================================================ */
  const renderErrorsTab = () => {
    const challengesId = 'challenges-section';
    const challengesExpanded = expandedCards[challengesId];

    return (
      <div>
        <div style={styles.sectionHeader}>
          <span>Common Errors + How You Handle</span>
          <span style={styles.sectionCount}>{ERROR_CASES.length} cases</span>
        </div>

        {ERROR_CASES.map((errCase) => {
          const cardId = `error-${errCase.id}`;
          const isExpanded = expandedCards[cardId];
          return (
            <div
              key={cardId}
              style={styles.cardClickable(isExpanded)}
              onClick={() => toggleCard(cardId)}
            >
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <span style={styles.errorCodeBadge(errCase.color)}>{errCase.code}</span>
                  <h3 style={styles.cardTitle}>{errCase.title}</h3>
                </div>
                <span style={styles.expandArrow(isExpanded)}>&#9660;</span>
              </div>
              {isExpanded && (
                <div style={styles.expandedContent}>
                  <ul style={styles.bulletList}>
                    {errCase.actions.map((a, i) => renderBullet(a, i, errCase.color))}
                  </ul>
                  <div style={styles.answerBox}>
                    <div style={styles.answerLabel}>Interview Answer</div>
                    <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.6', margin: 0 }}>
                      "{errCase.answer}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Challenges Section */}
        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              ...styles.card,
              cursor: 'pointer',
              border: `1px solid ${challengesExpanded ? C.orange + '44' : C.border}`,
              background: challengesExpanded ? C.cardLight : C.card,
            }}
            onClick={() => toggleCard(challengesId)}
          >
            <div style={styles.cardHeader}>
              <h3 style={{ ...styles.cardTitle, color: C.orange }}>Challenges & Solutions</h3>
              <span style={styles.expandArrow(challengesExpanded)}>&#9660;</span>
            </div>
            {challengesExpanded && (
              <div style={styles.expandedContent}>
                {CHALLENGES.map((ch, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '10px 0',
                      borderBottom: i < CHALLENGES.length - 1 ? `1px solid ${C.border}44` : 'none',
                    }}
                  >
                    <span style={styles.scenarioNumber(ch.color)}>{i + 1}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: C.text, marginBottom: '4px' }}>
                        {ch.problem}
                      </div>
                      <div style={{ fontSize: '12px', color: C.accent }}>
                        Solution: {ch.solution}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ================================================================
     TAB 7: Tools & Defects
     ================================================================ */
  const renderToolsTab = () => (
    <div>
      {/* Tools Section */}
      <div style={styles.sectionHeader}>
        <span>Tools Quick Reference</span>
        <span style={styles.sectionCount}>{TOOLS.length} tools</span>
      </div>

      {TOOLS.map((tool, i) => (
        <div key={i} style={styles.toolCard(tool.color)}>
          <span style={styles.toolName(tool.color)}>{tool.name}</span>
          <span style={styles.toolDesc}>{tool.desc}</span>
        </div>
      ))}

      {/* Defect Template */}
      <div style={{ marginTop: '24px' }}>
        <div style={styles.sectionHeader}>
          <span>Defect Template</span>
          <span style={styles.sectionCount}>{DEFECT_FIELDS.length} fields</span>
        </div>

        <div style={styles.card}>
          {DEFECT_FIELDS.map((field, i) => (
            <div key={i} style={styles.scenarioItem}>
              <span style={styles.scenarioNumber(C.accent)}>{i + 1}</span>
              <span>{field}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lightning Q&A */}
      <div style={{ marginTop: '24px' }}>
        <div style={styles.sectionHeader}>
          <span>Lightning Q&A</span>
          <span style={styles.sectionCount}>{LIGHTNING_QA.length} questions</span>
        </div>

        {LIGHTNING_QA.map((qa, i) => (
          <div key={i} style={styles.qaCard}>
            <div style={styles.qaQuestion}>Q: "{qa.q}"</div>
            <div style={styles.qaAnswer}>A: "{qa.a}"</div>
          </div>
        ))}
      </div>

      {/* Strong Closing */}
      <div style={{ ...styles.goldCard, marginTop: '24px' }}>
        <div style={styles.goldTitle}>Strong Closing</div>
        <p style={styles.goldText}>
          "I don't just validate response codes. I validate business correctness, security posture, data integrity, and system behavior under failure. My focus is preventing production incidents, not just passing test cases."
        </p>
      </div>

      {/* 90-Second Script */}
      <div style={styles.goldCard}>
        <div style={styles.goldTitle}>90-Second Script</div>
        <p style={styles.goldText}>
          "In my API testing approach, I first analyze the contract and identify business risk. I design functional, negative, security, and data integrity scenarios. I automate request flows, validate responses with assertions, verify persistence using SQL, and analyze logs for failures. I raise defects with full technical evidence and support regression validation. My goal is to ensure API reliability, correctness, and secure integration before release."
        </p>
      </div>
    </div>
  );

  /* ================================================================
     TAB CONTENT ROUTER
     ================================================================ */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'opening': return renderOpeningTab();
      case 'layers': return renderLayersTab();
      case 'roles': return renderRolesTab();
      case 'star': return renderStarTab();
      case 'scenarios': return renderScenariosTab();
      case 'errors': return renderErrorsTab();
      case 'tools': return renderToolsTab();
      default: return renderOpeningTab();
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
          API Testing <span style={styles.titleAccent}>Interview Script</span>
        </h1>
        <p style={styles.subtitle}>
          Comprehensive API testing interview preparation -- combining traditional role-based approach
          and modern "Problem-Engineering-Risk-Value" framework for Banking QA
        </p>

        {/* Stats Bar */}
        <div style={styles.statsBar}>
          <span style={styles.statBadge(C.accent)}>
            <span style={styles.statValue}>7</span> Tabs
          </span>
          <span style={styles.statBadge(C.blue)}>
            <span style={styles.statValue}>4</span> Layers
          </span>
          <span style={styles.statBadge(C.orange)}>
            <span style={styles.statValue}>9</span> STAR Actions
          </span>
          <span style={styles.statBadge(C.purple)}>
            <span style={styles.statValue}>18</span> Scenarios
          </span>
          <span style={styles.statBadge(C.red)}>
            <span style={styles.statValue}>4</span> Error Cases
          </span>
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
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}

export default ApiTestingScript;

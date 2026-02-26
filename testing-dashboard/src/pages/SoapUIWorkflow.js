import React, { useState } from 'react';

/* ================================================================
   SoapUI Workflow — 10-Step Practical Guide
   A human-friendly, tester's-perspective walkthrough
   4 Tabs: Preparation, Execution, Validation & Defects, Reporting & Scripts
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
  cyan: '#00cec9',
  text: '#ffffff',
  textMuted: '#a0b4c8',
  border: '#1e5a8a',
  inputBg: '#0a2a4a',
};

// Tab Definitions
const TABS = [
  { id: 'preparation', label: 'Preparation', subtitle: 'Steps 1-3', icon: '1' },
  { id: 'execution', label: 'Execution', subtitle: 'Steps 4-6', icon: '2' },
  { id: 'validation', label: 'Validation & Defects', subtitle: 'Steps 7-9', icon: '3' },
  { id: 'reporting', label: 'Reporting & Scripts', subtitle: 'Step 10+', icon: '4' },
];

/* ================================================================
   COMPONENT
   ================================================================ */
function SoapUIWorkflow() {
  const [activeTab, setActiveTab] = useState('preparation');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ── Styles ──
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
      gap: '12px',
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
      padding: '10px 18px',
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
    tabSubtitle: {
      fontSize: '10px',
      display: 'block',
      opacity: 0.7,
      marginTop: '2px',
    },
    card: {
      background: C.card,
      borderRadius: '10px',
      padding: '18px',
      marginBottom: '12px',
      border: `1px solid ${C.border}`,
    },
    stepCard: {
      background: C.card,
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '16px',
      border: `1px solid ${C.border}`,
    },
    stepHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginBottom: '14px',
    },
    stepNumber: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: `${color}22`,
      color: color,
      fontSize: '16px',
      fontWeight: '800',
      flexShrink: 0,
      border: `2px solid ${color}`,
    }),
    stepTitle: {
      fontSize: '17px',
      fontWeight: '700',
      color: C.text,
      margin: 0,
    },
    quoteBox: {
      background: 'rgba(78, 204, 163, 0.08)',
      borderLeft: `4px solid ${C.accent}`,
      borderRadius: '0 8px 8px 0',
      padding: '14px 16px',
      marginBottom: '14px',
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.6',
      fontStyle: 'italic',
    },
    sectionLabel: {
      fontSize: '13px',
      fontWeight: '700',
      color: C.accent,
      margin: '14px 0 8px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    bulletList: {
      listStyle: 'none',
      padding: 0,
      margin: '0 0 10px 0',
    },
    bulletItem: {
      padding: '4px 0 4px 20px',
      position: 'relative',
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.6',
    },
    insightCard: (borderColor) => ({
      background: `${borderColor}08`,
      border: `1px solid ${borderColor}44`,
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: '0 8px 8px 0',
      padding: '12px 16px',
      marginTop: '14px',
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.5',
    }),
    insightLabel: (color) => ({
      fontSize: '11px',
      fontWeight: '700',
      color: color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '4px',
    }),
    treeContainer: {
      background: C.inputBg,
      borderRadius: '8px',
      padding: '16px',
      border: `1px solid ${C.border}`,
      marginBottom: '12px',
    },
    treeModule: {
      fontSize: '14px',
      fontWeight: '700',
      color: C.accent,
      margin: '10px 0 4px 0',
    },
    treeItem: {
      fontSize: '12px',
      color: C.textMuted,
      padding: '2px 0 2px 24px',
      lineHeight: '1.6',
    },
    categoryCard: (accentColor) => ({
      background: C.card,
      borderRadius: '10px',
      padding: '14px 16px',
      marginBottom: '10px',
      border: `1px solid ${C.border}`,
      borderLeft: `4px solid ${accentColor}`,
    }),
    categoryTitle: (color) => ({
      fontSize: '14px',
      fontWeight: '700',
      color: color,
      margin: '0 0 8px 0',
    }),
    assertionCard: {
      background: C.inputBg,
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '8px',
      border: `1px solid ${C.border}`,
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
    },
    assertionNumber: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      background: `${C.blue}22`,
      color: C.blue,
      fontSize: '13px',
      fontWeight: '800',
      flexShrink: 0,
      border: `2px solid ${C.blue}`,
    },
    assertionTitle: {
      fontSize: '13px',
      fontWeight: '700',
      color: C.text,
      margin: 0,
    },
    assertionDesc: {
      fontSize: '12px',
      color: C.textMuted,
      margin: '2px 0 0 0',
      lineHeight: '1.4',
    },
    flowContainer: {
      background: C.inputBg,
      borderRadius: '10px',
      padding: '20px',
      border: `1px solid ${C.border}`,
      marginBottom: '14px',
    },
    flowStep: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '6px',
    },
    flowBox: (color) => ({
      background: `${color}18`,
      border: `1px solid ${color}44`,
      borderRadius: '8px',
      padding: '10px 16px',
      fontSize: '13px',
      fontWeight: '600',
      color: color,
      flex: 1,
      textAlign: 'center',
    }),
    flowArrow: {
      fontSize: '20px',
      color: C.accent,
      textAlign: 'center',
      padding: '2px 0',
    },
    flowCapture: {
      fontSize: '11px',
      color: C.gold,
      fontStyle: 'italic',
      textAlign: 'center',
      padding: '2px 0 4px 0',
    },
    diagnosticTree: {
      background: C.inputBg,
      borderRadius: '8px',
      padding: '16px',
      border: `1px solid ${C.border}`,
      marginBottom: '12px',
    },
    diagnosticItem: (color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '6px 0 6px 16px',
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.5',
    }),
    diagnosticDot: (color) => ({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: color,
      flexShrink: 0,
    }),
    defectExampleCard: {
      background: `${C.gold}08`,
      border: `2px solid ${C.gold}`,
      borderRadius: '12px',
      padding: '18px',
      marginTop: '14px',
    },
    defectExampleTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: C.gold,
      marginBottom: '8px',
    },
    defectExampleText: {
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.6',
      fontStyle: 'italic',
    },
    scriptCard: (borderColor) => ({
      background: `${borderColor}08`,
      border: `2px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
    }),
    scriptTitle: (color) => ({
      fontSize: '16px',
      fontWeight: '800',
      color: color,
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }),
    scriptText: {
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.8',
      textAlign: 'justify',
    },
    expandableHeader: (isOpen) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 18px',
      background: isOpen ? C.cardLight : C.card,
      border: `1px solid ${isOpen ? C.accent + '44' : C.border}`,
      borderRadius: isOpen ? '10px 10px 0 0' : '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
    expandableBody: {
      background: C.card,
      border: `1px solid ${C.accent}44`,
      borderTop: 'none',
      borderRadius: '0 0 10px 10px',
      padding: '18px',
      marginBottom: '12px',
    },
    expandArrow: (isOpen) => ({
      fontSize: '14px',
      color: C.textMuted,
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      flexShrink: 0,
    }),
    tabContentHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
    },
    tabIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: `linear-gradient(135deg, ${C.accent}33, ${C.blue}33)`,
      color: C.accent,
      fontSize: '20px',
      fontWeight: '800',
    },
    jiraFieldList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    jiraFieldItem: {
      padding: '6px 0 6px 20px',
      position: 'relative',
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.5',
    },
    reportList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    reportItem: {
      padding: '5px 0 5px 20px',
      position: 'relative',
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.6',
    },
    gridTwo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '12px',
    },
    whyItem: {
      padding: '6px 0 6px 20px',
      position: 'relative',
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.5',
    },
  };

  // Bullet dot helper
  const BulletDot = ({ color }) => (
    <span style={{
      position: 'absolute',
      left: 0,
      top: '10px',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: color || C.accent,
    }} />
  );

  /* ================================================================
     TAB 1: Preparation (Steps 1-3)
     ================================================================ */
  const renderPreparationTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>1</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            Before Testing -- Understanding & Setup
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            Steps 1-3: Build a strong foundation before writing a single test
          </p>
        </div>
      </div>

      {/* Step 1 */}
      <div style={styles.stepCard}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNumber(C.blue)}>1</span>
          <h3 style={styles.stepTitle}>Understanding the Business Flow</h3>
        </div>
        <div style={styles.quoteBox}>
          "Before starting testing, I first understood the banking process behind the API.
          I did not just jump into SoapUI -- I needed to know what I was validating and why."
        </div>

        <div style={styles.sectionLabel}>Points I Covered</div>
        <ul style={styles.bulletList}>
          {[
            'How customer onboarding works -- from KYC to account activation',
            'How an account gets created -- the system flow from request to database record',
            'What validations should happen -- minimum deposit, required fields, business rules',
            'What system stores the final data -- which DB tables, which fields, what relationships',
          ].map((item, i) => (
            <li key={i} style={styles.bulletItem}>
              <BulletDot color={C.blue} />
              {item}
            </li>
          ))}
        </ul>

        <div style={styles.sectionLabel}>What I Reviewed</div>
        <ul style={styles.bulletList}>
          {[
            'WSDL file -- to understand operations, data types, and message structure',
            'Request and response structure -- mandatory vs optional fields, XSD constraints',
            'Business rules -- minimum balance, duplicate checks, status transitions',
            'Error handling behavior -- SOAP Fault codes, error messages, edge case responses',
          ].map((item, i) => (
            <li key={i} style={styles.bulletItem}>
              <BulletDot color={C.accent} />
              {item}
            </li>
          ))}
        </ul>

        <div style={styles.insightCard(C.cyan)}>
          <div style={styles.insightLabel(C.cyan)}>Tester's Insight</div>
          This helped me test with business understanding, not just technical validation.
          I could design scenarios that reflected real banking workflows instead of guessing at random inputs.
        </div>
      </div>

      {/* Step 2 */}
      <div style={styles.stepCard}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNumber(C.green)}>2</span>
          <h3 style={styles.stepTitle}>Setting Up SoapUI Environment</h3>
        </div>
        <div style={styles.quoteBox}>
          "After understanding the flow, I configured SoapUI properly so my testing would be
          organized, reusable, and aligned with the project environments."
        </div>

        <div style={styles.sectionLabel}>What I Did</div>
        <ul style={styles.bulletList}>
          {[
            'Imported the WSDL into SoapUI -- auto-generated operations and sample requests',
            'Configured the correct environment endpoint (QA / UAT) to point at the right server',
            'Set authentication -- credentials, token, or certificate as required by the service',
            'Created reusable properties -- CustomerID, AccountNumber, AuthToken, BranchCode',
            'Organized test suites by module -- Customer, Account, Transaction, Security',
          ].map((item, i) => (
            <li key={i} style={styles.bulletItem}>
              <BulletDot color={C.green} />
              {item}
            </li>
          ))}
        </ul>

        <div style={styles.insightCard(C.cyan)}>
          <div style={styles.insightLabel(C.cyan)}>Tester's Insight</div>
          This made execution clean and structured. When switching between QA and UAT,
          I only changed one property instead of editing every request.
        </div>
      </div>

      {/* Step 3 */}
      <div style={styles.stepCard}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNumber(C.orange)}>3</span>
          <h3 style={styles.stepTitle}>Test Suite Design (Module-Based Structure)</h3>
        </div>
        <div style={styles.quoteBox}>
          "I organized my test suites the same way the banking system is organized --
          by module. This made it easy to run targeted regression and track coverage."
        </div>

        <div style={styles.treeContainer}>
          <div style={styles.treeModule}>Customer Services</div>
          {['CreateCustomer', 'UpdateCustomer', 'SearchCustomer'].map((item, i) => (
            <div key={i} style={styles.treeItem}>--- {item}</div>
          ))}

          <div style={styles.treeModule}>Account Services</div>
          {['CreateAccount', 'GetAccountDetails', 'UpdateAccountStatus'].map((item, i) => (
            <div key={i} style={styles.treeItem}>--- {item}</div>
          ))}

          <div style={styles.treeModule}>Transaction Services</div>
          {['Deposit', 'Withdrawal', 'Transfer', 'TransactionHistory'].map((item, i) => (
            <div key={i} style={styles.treeItem}>--- {item}</div>
          ))}

          <div style={styles.treeModule}>Security Testing</div>
          {['Invalid credentials', 'Missing token', 'Unauthorized role'].map((item, i) => (
            <div key={i} style={styles.treeItem}>--- {item}</div>
          ))}
        </div>

        <div style={styles.insightCard(C.cyan)}>
          <div style={styles.insightLabel(C.cyan)}>Tester's Insight</div>
          This organization helped manage regression easily. When a new build was deployed,
          I could re-run the Account Services suite without touching unrelated modules.
        </div>
      </div>
    </div>
  );

  /* ================================================================
     TAB 2: Execution (Steps 4-6)
     ================================================================ */
  const renderExecutionTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>2</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            Testing Phase -- Design, Assert, Chain
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            Steps 4-6: Where the real testing happens
          </p>
        </div>
      </div>

      {/* Step 4 */}
      <div style={styles.stepCard}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNumber(C.yellow)}>4</span>
          <h3 style={styles.stepTitle}>Test Case Design (Scenario-Based Testing)</h3>
        </div>
        <div style={styles.quoteBox}>
          "For each API, I designed test cases across four scenario categories.
          This ensured I covered not just the happy path but also the things that go wrong."
        </div>

        <div style={styles.gridTwo}>
          {/* Positive */}
          <div style={styles.categoryCard(C.green)}>
            <div style={styles.categoryTitle(C.green)}>Positive Scenarios</div>
            <ul style={styles.bulletList}>
              {[
                'Valid input with all mandatory fields',
                'Correct business rules followed',
                'Expected success response (200 / SUCCESS)',
              ].map((item, i) => (
                <li key={i} style={styles.bulletItem}>
                  <BulletDot color={C.green} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Negative */}
          <div style={styles.categoryCard(C.red)}>
            <div style={styles.categoryTitle(C.red)}>Negative Scenarios</div>
            <ul style={styles.bulletList}>
              {[
                'Missing mandatory fields',
                'Invalid data formats (wrong date, bad email)',
                'Invalid account type or product code',
                'Duplicate request submission',
              ].map((item, i) => (
                <li key={i} style={styles.bulletItem}>
                  <BulletDot color={C.red} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Security */}
          <div style={styles.categoryCard(C.orange)}>
            <div style={styles.categoryTitle(C.orange)}>Security Scenarios</div>
            <ul style={styles.bulletList}>
              {[
                'Invalid login credentials',
                'Expired authentication token',
                'Unauthorized role access attempt',
              ].map((item, i) => (
                <li key={i} style={styles.bulletItem}>
                  <BulletDot color={C.orange} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Business Rules */}
          <div style={styles.categoryCard(C.blue)}>
            <div style={styles.categoryTitle(C.blue)}>Business Rule Validation</div>
            <ul style={styles.bulletList}>
              {[
                'Minimum balance validation on withdrawal',
                'Account status transition rules',
                'Transaction limit validation (daily / per-txn)',
              ].map((item, i) => (
                <li key={i} style={styles.bulletItem}>
                  <BulletDot color={C.blue} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Step 5 */}
      <div style={styles.stepCard}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNumber(C.red)}>5</span>
          <h3 style={styles.stepTitle}>Assertions in SoapUI (Response Validation)</h3>
        </div>
        <div style={styles.quoteBox}>
          "I used assertions to automate validation instead of checking manually.
          Every test step had at least one assertion, and critical ones had three or four."
        </div>

        {[
          { num: 1, title: 'Schema Compliance Assertion', desc: 'Validates XML structure matches the WSDL/XSD definition. Catches any structural deviation automatically.' },
          { num: 2, title: 'XPath Assertion', desc: 'Checks specific field values in the response -- like //Status = "SUCCESS" or //AccountNumber exists.' },
          { num: 3, title: 'Contains / Not Contains', desc: 'Verifies presence or absence of expected text in the response body -- quick sanity checks.' },
          { num: 4, title: 'SOAP Fault Validation', desc: 'Validates error responses are correct -- proper fault code, fault string, and detail element for negative scenarios.' },
          { num: 5, title: 'Response Time SLA', desc: 'Ensures the response comes back within acceptable time -- e.g., less than 2 seconds for queries, 5 seconds for transactions.' },
        ].map((assertion) => (
          <div key={assertion.num} style={styles.assertionCard}>
            <span style={styles.assertionNumber}>{assertion.num}</span>
            <div>
              <div style={styles.assertionTitle}>{assertion.title}</div>
              <div style={styles.assertionDesc}>{assertion.desc}</div>
            </div>
          </div>
        ))}

        <div style={styles.insightCard(C.cyan)}>
          <div style={styles.insightLabel(C.cyan)}>Tester's Insight</div>
          This ensured both structural and functional correctness. Schema assertion caught
          contract violations while XPath assertions caught business logic errors.
        </div>
      </div>

      {/* Step 6 */}
      <div style={styles.stepCard}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNumber(C.purple)}>6</span>
          <h3 style={styles.stepTitle}>Chaining API Calls (End-to-End Flow)</h3>
        </div>
        <div style={styles.quoteBox}>
          "In banking, APIs are dependent on each other. A customer must exist before
          an account can be created, and an account must exist before a deposit can happen.
          I chained them together."
        </div>

        <div style={styles.flowContainer}>
          <div style={styles.flowBox(C.blue)}>CreateCustomer</div>
          <div style={styles.flowCapture}>Capture CustomerID</div>
          <div style={styles.flowArrow}>&#8595;</div>

          <div style={styles.flowBox(C.green)}>CreateAccount</div>
          <div style={styles.flowCapture}>Use CustomerID, Capture AccountNumber</div>
          <div style={styles.flowArrow}>&#8595;</div>

          <div style={styles.flowBox(C.orange)}>Deposit</div>
          <div style={styles.flowCapture}>Use AccountNumber</div>
          <div style={styles.flowArrow}>&#8595;</div>

          <div style={styles.flowBox(C.purple)}>GetAccountDetails</div>
          <div style={styles.flowCapture}>Validate updated balance</div>
        </div>

        <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.6', margin: '10px 0' }}>
          I used <span style={{ color: C.accent, fontWeight: '600' }}>property transfer</span> in
          SoapUI to pass values between test steps. The CustomerID from CreateCustomer response was
          automatically injected into the CreateAccount request, and so on down the chain.
        </p>

        <div style={styles.insightCard(C.cyan)}>
          <div style={styles.insightLabel(C.cyan)}>Tester's Insight</div>
          This validated the complete workflow instead of isolated calls.
          If any link in the chain broke, I caught it immediately.
        </div>
      </div>
    </div>
  );

  /* ================================================================
     TAB 3: Validation & Defects (Steps 7-9)
     ================================================================ */
  const renderValidationTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>3</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            Backend Checks, Investigation & Bug Reporting
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            Steps 7-9: Ensuring data integrity and documenting defects properly
          </p>
        </div>
      </div>

      {/* Step 7 */}
      <div style={styles.stepCard}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNumber(C.blue)}>7</span>
          <h3 style={styles.stepTitle}>Database Validation (Data Integrity Check)</h3>
        </div>
        <div style={styles.quoteBox}>
          "Response validation alone was not enough. An API can return SUCCESS but store
          wrong data in the database. So I verified the backend database directly."
        </div>

        <div style={styles.sectionLabel}>What I Checked</div>
        <ul style={styles.bulletList}>
          {[
            'Customer record created correctly -- all fields match the request',
            'Account linked to the correct customer -- foreign key relationship intact',
            'Transaction records stored properly -- amount, type, status, timestamps',
            'No duplicate entries -- same transaction not recorded twice',
            'Audit fields populated -- created_date, created_by, updated_by are correct',
          ].map((item, i) => (
            <li key={i} style={styles.bulletItem}>
              <BulletDot color={C.blue} />
              {item}
            </li>
          ))}
        </ul>

        <div style={styles.insightCard(C.cyan)}>
          <div style={styles.insightLabel(C.cyan)}>Tester's Insight</div>
          This ensured true data integrity. I caught several defects where the API
          returned SUCCESS but the data in the database was wrong or incomplete.
        </div>
      </div>

      {/* Step 8 */}
      <div style={styles.stepCard}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNumber(C.orange)}>8</span>
          <h3 style={styles.stepTitle}>Failure Investigation & Root Cause</h3>
        </div>
        <div style={styles.quoteBox}>
          "When something failed, I did not just re-run and hope. I investigated
          systematically to find the root cause."
        </div>

        <div style={styles.sectionLabel}>When Issues Occurred, I</div>
        <ul style={styles.bulletList}>
          {[
            'Reproduced the issue with the same request data',
            'Compared the request against the WSDL contract to confirm validity',
            'Reviewed SOAP fault details -- fault code, fault string, detail element',
            'Verified the database state -- did data persist partially? Was there a rollback issue?',
          ].map((item, i) => (
            <li key={i} style={styles.bulletItem}>
              <BulletDot color={C.orange} />
              {item}
            </li>
          ))}
        </ul>

        <div style={styles.sectionLabel}>Root Cause Categories</div>
        <div style={styles.diagnosticTree}>
          {[
            { label: 'Mapping issue', desc: 'Field transformation error between layers', color: C.red },
            { label: 'Business logic issue', desc: 'Wrong validation rule or missing condition', color: C.orange },
            { label: 'Validation issue', desc: 'Missing field check or incorrect format validation', color: C.yellow },
            { label: 'Configuration issue', desc: 'Wrong endpoint, authentication, or environment config', color: C.blue },
          ].map((item, i) => (
            <div key={i} style={styles.diagnosticItem(item.color)}>
              <span style={styles.diagnosticDot(item.color)} />
              <span>
                <span style={{ color: item.color, fontWeight: '700' }}>{item.label}</span>
                <span style={{ color: C.textMuted }}> -- {item.desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 9 */}
      <div style={styles.stepCard}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNumber(C.red)}>9</span>
          <h3 style={styles.stepTitle}>Defect Creation (How I Logged Bugs)</h3>
        </div>
        <div style={styles.quoteBox}>
          "A well-documented bug is half the fix. I made sure every defect had complete
          evidence so developers could reproduce and fix without asking me questions."
        </div>

        <div style={styles.sectionLabel}>In JIRA, I Included</div>
        <ul style={styles.jiraFieldList}>
          {[
            'Clear summary -- [Module] [Operation] brief description',
            'Environment details -- QA/UAT, build version, date',
            'SOAP request XML -- the exact request that caused the issue',
            'SOAP response XML -- the actual response received',
            'Expected vs actual behavior -- specific fields and values',
            'SQL query evidence -- database state proving the data issue',
            'Business impact -- why this matters to the business',
            'Severity & priority -- P0 through P3 with justification',
          ].map((item, i) => (
            <li key={i} style={styles.jiraFieldItem}>
              <BulletDot color={C.red} />
              {item}
            </li>
          ))}
        </ul>

        <div style={styles.defectExampleCard}>
          <div style={styles.defectExampleTitle}>Real Example</div>
          <div style={styles.defectExampleText}>
            "CreateAccount API returned success but stored the account status as
            <span style={{ color: C.red, fontWeight: '700' }}> Inactive</span> instead
            of <span style={{ color: C.green, fontWeight: '700' }}>Active</span>."
          </div>
          <div style={{ ...styles.defectExampleText, marginTop: '8px' }}>
            "I validated this using a SQL query against the accounts table and attached both
            the SOAP response (showing SUCCESS) and the DB result (showing status = INACTIVE)
            in the defect. This gave the developer clear evidence of the mismatch."
          </div>
        </div>
      </div>
    </div>
  );

  /* ================================================================
     TAB 4: Reporting & Scripts (Step 10 + Interview Answers)
     ================================================================ */
  const renderReportingTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>4</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            Results, Reports & Ready-Made Answers
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            Step 10 plus polished interview scripts
          </p>
        </div>
      </div>

      {/* Step 10 */}
      <div style={styles.stepCard}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNumber(C.green)}>10</span>
          <h3 style={styles.stepTitle}>Test Reporting & Release Support</h3>
        </div>
        <div style={styles.quoteBox}>
          "At the end of each test cycle, I prepared a report that stakeholders could
          use to make a Go / No-Go decision."
        </div>

        <div style={styles.sectionLabel}>Report Included</div>
        <ul style={styles.reportList}>
          {[
            'Total test cases executed',
            'Pass / Fail / Blocked count with percentages',
            'Defects by severity -- P0, P1, P2, P3 breakdown',
            'Risk areas -- untested scenarios, open critical defects',
            'Release recommendation -- Go / No-Go with supporting evidence',
          ].map((item, i) => (
            <li key={i} style={styles.reportItem}>
              <BulletDot color={C.green} />
              {item}
            </li>
          ))}
        </ul>

        <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.6', margin: '10px 0 0 0' }}>
          Shared daily reports with QA lead and stakeholders via email.
        </p>

        <div style={{ ...styles.sectionLabel, marginTop: '16px' }}>If Automation Used</div>
        <ul style={styles.reportList}>
          {[
            'Exported SoapUI report in HTML/XML format',
            'Attached report in daily status email alongside manual test results',
          ].map((item, i) => (
            <li key={i} style={styles.reportItem}>
              <BulletDot color={C.accent} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Interview Answer Scripts ── */}
      <h3 style={{
        fontSize: '18px',
        fontWeight: '700',
        color: C.accent,
        margin: '28px 0 16px 0',
        paddingBottom: '8px',
        borderBottom: `2px solid ${C.accent}33`,
      }}>
        Interview Answer Scripts
      </h3>

      {/* 90-Second Polished Answer */}
      <div style={styles.scriptCard(C.gold)}>
        <div style={styles.scriptTitle(C.gold)}>
          90-Second Polished Answer
        </div>
        <div style={styles.scriptText}>
          "In my banking project, I used SoapUI to test SOAP-based backend services such as
          customer creation, account management, and transactions. I began by understanding
          the business flow and reviewing the WSDL. After setting up SoapUI, I created
          structured test suites and designed positive, negative, security, and business rule
          scenarios. I used assertions to validate response structure and key fields. I also
          verified backend data using SQL to ensure correct persistence and relationships.
          When defects were found, I documented detailed evidence including request/response
          XML and database validation. Finally, I prepared execution reports highlighting
          coverage, defect trends, and release readiness."
        </div>
      </div>

      {/* "Why SoapUI?" Answer */}
      <div style={styles.scriptCard(C.cyan)}>
        <div style={styles.scriptTitle(C.cyan)}>
          "Why SoapUI?" Answer
        </div>
        <ul style={styles.bulletList}>
          {[
            'Better suited for SOAP services than REST-focused tools like Postman',
            'Easy WSDL import -- auto-generates operations and sample requests',
            'Strong XML validation support -- schema compliance built in',
            'Built-in assertions -- XPath, Contains, Schema, SLA, Script',
            'Supports test suites and regression -- organized by module, re-runnable',
          ].map((item, i) => (
            <li key={i} style={styles.whyItem}>
              <BulletDot color={C.cyan} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* "What This Shows About You" */}
      <div style={styles.scriptCard(C.green)}>
        <div style={styles.scriptTitle(C.green)}>
          "What This Shows About You"
        </div>
        <ul style={styles.bulletList}>
          {[
            'Structured thinking -- organized test suites by banking modules',
            'Backend validation skills -- verified data in the database, not just API responses',
            'Security awareness -- tested authentication, authorization, and data masking',
            'Strong defect documentation -- SOAP XML, SQL evidence, business impact in every bug',
            'Banking domain understanding -- tested with real business context, not random data',
          ].map((item, i) => (
            <li key={i} style={styles.whyItem}>
              <BulletDot color={C.green} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  /* ================================================================
     RENDER: Tab Content Dispatcher
     ================================================================ */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'preparation':
        return renderPreparationTab();
      case 'execution':
        return renderExecutionTab();
      case 'validation':
        return renderValidationTab();
      case 'reporting':
        return renderReportingTab();
      default:
        return renderPreparationTab();
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
          SoapUI <span style={styles.titleAccent}>Workflow</span> -- 10-Step Guide
        </h1>
        <p style={styles.subtitle}>
          A practical, human-friendly walkthrough of how I actually test SOAP APIs in banking --
          from understanding the business flow to reporting results and answering interview questions.
        </p>
      </div>

      {/* Summary Stats */}
      <div style={styles.statsBar}>
        <div style={styles.statBadge(C.accent)}>
          <span style={styles.statValue}>10</span> Steps
        </div>
        <div style={styles.statBadge(C.blue)}>
          <span style={styles.statValue}>4</span> Phases
        </div>
        <div style={styles.statBadge(C.orange)}>
          <span style={styles.statValue}>5</span> Assertion Types
        </div>
        <div style={styles.statBadge(C.gold)}>
          <span style={styles.statValue}>3</span> Interview Scripts
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
            {tab.label}
            <span style={styles.tabSubtitle}>{tab.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}

export default SoapUIWorkflow;

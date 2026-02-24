import React, { useState } from 'react';

const TABS = [
  { id: 'readme', label: 'README', icon: '\u{1F4D6}' },
  { id: 'c4model', label: 'C4 Model', icon: '\u{1F3D7}' },
  { id: 'hld', label: 'HLD', icon: '\u{1F5FA}' },
  { id: 'brd', label: 'BRD', icon: '\u{1F4CB}' },
  { id: 'lld', label: 'LLD', icon: '\u{1F527}' },
  { id: 'dbflow', label: 'Database Flow', icon: '\u{1F4BE}' },
  { id: 'techstack', label: 'Tech Stack', icon: '\u2699' },
];

/* ─── Shared Styles ─── */
const sectionBox = {
  background: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: '10px',
  padding: '20px',
  marginBottom: '16px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};

const codeBlock = {
  background: '#1e1e2e',
  color: '#cdd6f4',
  padding: '16px',
  borderRadius: '8px',
  fontSize: '12px',
  lineHeight: '1.6',
  overflow: 'auto',
  fontFamily: "'Courier New', Consolas, monospace",
  whiteSpace: 'pre',
  margin: '10px 0 0',
};

const h3Style = { margin: '0 0 10px', fontSize: '15px', color: '#1a1a2e' };
const pStyle = { margin: '0 0 8px', fontSize: '13px', lineHeight: '1.7', color: '#444' };

/* ─── README Tab ─── */
function ReadmeTab() {
  return (
    <div>
      <div style={sectionBox}>
        <h3 style={h3Style}>Banking QA Testing Dashboard</h3>
        <p style={pStyle}>
          A comprehensive QA testing dashboard for a banking application. Built with React frontend,
          Express.js backend, and SQLite database. Designed for manual testers, QA engineers, and
          automation leads to manage test cases, execute tests, track defects, and generate reports
          across all core banking modules.
        </p>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Quick Setup</h3>
        <pre style={codeBlock}>{`# 1. Clone the repository
git clone https://github.com/your-org/banking-qa-dashboard.git
cd banking-qa-dashboard

# 2. Setup Backend
cd backend
npm install
node server.js          # Starts on http://localhost:3001

# 3. Setup Frontend (new terminal)
cd testing-dashboard
npm install
npm start               # Starts on http://localhost:3000

# 4. Verify
curl http://localhost:3001/api/dashboard/stats
# Open http://localhost:3000 in browser`}</pre>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Features</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            ['Dashboard', 'Real-time stats: customers, accounts, test pass rate, defects'],
            ['Test Cases', 'CRUD operations with filtering by module, status, priority'],
            ['Manual Testing', 'Execute test cases, record actual results, track time'],
            ['Defects', 'Log bugs linked to test cases, assign severity & priority'],
            ['Reports', 'Module-wise pass/fail charts, defect trends, coverage metrics'],
            ['Operation Flow', 'Trace API call sequences per test execution'],
            ['SQL Editor', 'Run ad-hoc queries against the banking database'],
            ['Banking Modules', 'API reference with request/response samples per module'],
            ['SoapUI Guide', 'Step-by-step guide for SOAP/REST testing with SoapUI'],
            ['Challenges', 'Edge cases and tricky scenarios for banking QA'],
            ['Interview Prep', '30 curated QA interview questions with answers'],
            ['Documentation', 'Architecture docs, C4 model, HLD, LLD, BRD, DB schema'],
          ].map(([title, desc], i) => (
            <div key={i} style={{
              padding: '10px 14px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '3px solid #1a73e8',
            }}>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a2e' }}>{title}</div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Project Structure</h3>
        <pre style={codeBlock}>{`banking-qa-dashboard/
\u251C\u2500\u2500 backend/
\u2502   \u251C\u2500\u2500 server.js            # Express API server (port 3001)
\u2502   \u251C\u2500\u2500 package.json         # Backend dependencies
\u2502   \u2514\u2500\u2500 node_modules/
\u251C\u2500\u2500 database/
\u2502   \u2514\u2500\u2500 banking.db           # SQLite database
\u251C\u2500\u2500 testing-dashboard/
\u2502   \u251C\u2500\u2500 src/
\u2502   \u2502   \u251C\u2500\u2500 App.js           # Root component with sidebar navigation
\u2502   \u2502   \u251C\u2500\u2500 pages/
\u2502   \u2502   \u2502   \u251C\u2500\u2500 Dashboard.js
\u2502   \u2502   \u2502   \u251C\u2500\u2500 TestCases.js
\u2502   \u2502   \u2502   \u251C\u2500\u2500 TestExecution.js
\u2502   \u2502   \u2502   \u251C\u2500\u2500 Defects.js
\u2502   \u2502   \u2502   \u251C\u2500\u2500 Reports.js
\u2502   \u2502   \u2502   \u251C\u2500\u2500 OperationFlow.js
\u2502   \u2502   \u2502   \u251C\u2500\u2500 SqlEditor.js
\u2502   \u2502   \u2502   \u251C\u2500\u2500 BankingModules.js
\u2502   \u2502   \u2502   \u251C\u2500\u2500 SoapUIGuide.js
\u2502   \u2502   \u2502   \u251C\u2500\u2500 Challenges.js
\u2502   \u2502   \u2502   \u251C\u2500\u2500 InterviewPrep.js
\u2502   \u2502   \u2502   \u2514\u2500\u2500 Documentation.js
\u2502   \u2502   \u251C\u2500\u2500 index.js
\u2502   \u2502   \u2514\u2500\u2500 index.css
\u2502   \u2514\u2500\u2500 package.json         # Frontend dependencies
\u2514\u2500\u2500 soapui-projects/             # SoapUI test project XMLs`}</pre>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>API Endpoints (Backend)</h3>
        <pre style={codeBlock}>{`GET  /api/dashboard/stats       # Dashboard statistics
GET  /api/customers             # List all customers
GET  /api/customers/:id         # Get customer by ID
GET  /api/accounts              # List all accounts
GET  /api/accounts/:id          # Get account by ID
GET  /api/transactions          # List all transactions
GET  /api/loans                 # List all loans
GET  /api/cards                 # List all cards
GET  /api/bill-payments         # List all bill payments
GET  /api/test-suites           # List test suites with stats
GET  /api/test-cases            # List/filter test cases
GET  /api/test-cases/:id        # Get test case by ID
PUT  /api/test-cases/:id/execute  # Execute a test case
GET  /api/test-runs             # List test runs
GET  /api/operation-flow        # Operation flow log
GET  /api/defects               # List all defects
GET  /api/audit-log             # Audit log entries
GET  /api/notifications         # Customer notifications
GET  /api/sessions              # Login sessions
GET  /api/schema                # Database schema info
POST /api/sql/execute           # Execute SQL query`}</pre>
      </div>
    </div>
  );
}

/* ─── C4 Model Tab ─── */
function C4ModelTab() {
  return (
    <div>
      <div style={sectionBox}>
        <h3 style={h3Style}>Level 1: System Context Diagram</h3>
        <p style={pStyle}>Shows the banking QA system and its external actors.</p>
        <pre style={codeBlock}>{`
    +-------------------+          +-------------------+
    |     Customer      |          |    QA Tester       |
    |   (End User)      |          |  (Manual/Auto)     |
    +--------+----------+          +--------+-----------+
             |                              |
             | Uses banking                 | Tests APIs,
             | services                     | executes test
             |                              | cases
             v                              v
    +------------------------------------------------+
    |                                                |
    |        Banking QA Testing Dashboard            |
    |                                                |
    |  - Manage test cases & defects                 |
    |  - Execute tests against banking APIs          |
    |  - View reports & coverage metrics             |
    |  - Explore banking module documentation        |
    |                                                |
    +-----+------------------+------------------+----+
          |                  |                  |
          v                  v                  v
  +-------+------+  +-------+-------+  +-------+-------+
  |   SoapUI     |  |   SQLite      |  |  Email/SMS    |
  |  Test Runner |  |   Database    |  |  Gateway      |
  |  (External)  |  |  (banking.db) |  |  (External)   |
  +--------------+  +---------------+  +---------------+`}</pre>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Level 2: Container Diagram</h3>
        <p style={pStyle}>Shows the technology containers that make up the system.</p>
        <pre style={codeBlock}>{`
  +----------------------------------------------------------+
  |                  Banking QA Dashboard                     |
  |                                                          |
  |  +-------------------+       +------------------------+  |
  |  |   React Frontend  |       |   Express.js Backend   |  |
  |  |   (Port 3000)     +------>|   (Port 3001)          |  |
  |  |                   | HTTP  |                        |  |
  |  |  - Dashboard      | REST  |  - /api/customers      |  |
  |  |  - Test Cases     |       |  - /api/accounts       |  |
  |  |  - Test Execution |       |  - /api/transactions   |  |
  |  |  - Defects        |       |  - /api/test-cases     |  |
  |  |  - Reports        |       |  - /api/defects        |  |
  |  |  - SQL Editor     |       |  - /api/sql/execute    |  |
  |  |  - Banking Modules|       |  - /api/schema         |  |
  |  |  - Documentation  |       |  - /api/operation-flow |  |
  |  +-------------------+       +----------+-------------+  |
  |                                         |                |
  |                                         | SQL            |
  |                                         v                |
  |                              +----------+-------------+  |
  |                              |   SQLite Database       |  |
  |                              |   (banking.db)          |  |
  |                              |                         |  |
  |                              |  Tables: customers,     |  |
  |                              |  accounts, transactions,|  |
  |                              |  loans, cards,          |  |
  |                              |  bill_payments,         |  |
  |                              |  test_cases, defects,   |  |
  |                              |  test_suites, test_runs |  |
  |                              +-------------------------+  |
  +----------------------------------------------------------+
          |
          | SoapUI sends REST requests to Express API
          v
  +-------------------+
  |   SoapUI 5.7.2    |
  |   Test Runner     |
  |                   |
  |  - Test Suites    |
  |  - Test Cases     |
  |  - Assertions     |
  |  - Mock Services  |
  +-------------------+`}</pre>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Level 3: Component Diagram</h3>
        <p style={pStyle}>Shows the internal components of the Express.js backend.</p>
        <pre style={codeBlock}>{`
  +------------------------------------------------------------+
  |                  Express.js Backend                        |
  |                                                            |
  |  +------------+  +------------+  +------------+            |
  |  |    Auth    |  |  Accounts  |  | Transfers  |            |
  |  |  Module    |  |  Module    |  |  Module    |            |
  |  |            |  |            |  |            |            |
  |  | - Register |  | - List     |  | - NEFT     |            |
  |  | - Login    |  | - Balance  |  | - IMPS     |            |
  |  | - Logout   |  | - Statement|  | - UPI      |            |
  |  | - OTP      |  | - Close    |  | - RTGS     |            |
  |  +-----+------+  +-----+------+  +-----+------+           |
  |        |               |               |                   |
  |  +-----+------+  +-----+------+  +-----+------+           |
  |  |   Bills    |  |   Loans    |  |   Cards    |           |
  |  |  Module    |  |  Module    |  |  Module    |           |
  |  |            |  |            |  |            |           |
  |  | - Pay bill |  | - Apply    |  | - Block    |           |
  |  | - Schedule |  | - EMI      |  | - Unblock  |           |
  |  | - History  |  | - Prepay   |  | - Limits   |           |
  |  | - Billers  |  | - Close    |  | - Statement|           |
  |  +-----+------+  +-----+------+  +-----+------+           |
  |        |               |               |                   |
  |  +-----+------+  +-----+------+  +-----+------+           |
  |  |  Security  |  | Test Mgmt  |  |  Reporting |           |
  |  |  Module    |  |  Module    |  |  Module    |           |
  |  |            |  |            |  |            |           |
  |  | - Audit    |  | - Cases    |  | - Stats    |           |
  |  | - Sessions |  | - Suites   |  | - Coverage |           |
  |  | - Encrypt  |  | - Execute  |  | - Trends   |           |
  |  | - Access   |  | - Defects  |  | - Export   |           |
  |  +------------+  +------------+  +------------+            |
  |                        |                                   |
  |                        v                                   |
  |               +--------+--------+                          |
  |               | SQLite (WAL)    |                          |
  |               | better-sqlite3  |                          |
  |               +-----------------+                          |
  +------------------------------------------------------------+`}</pre>
      </div>
    </div>
  );
}

/* ─── HLD Tab ─── */
function HLDTab() {
  return (
    <div>
      <div style={sectionBox}>
        <h3 style={h3Style}>High Level Architecture</h3>
        <pre style={codeBlock}>{`
  +------------------------------------------------------------------+
  |                        CLIENT TIER                               |
  |                                                                  |
  |   +------------------+          +------------------+             |
  |   | React SPA        |          | SoapUI Client    |             |
  |   | (localhost:3000)  |          | (Desktop App)    |             |
  |   |                  |          |                  |             |
  |   | State: useState  |          | REST Test Suites |             |
  |   | HTTP: fetch()    |          | Assertions       |             |
  |   | Style: Native CSS|          | Groovy Scripts   |             |
  |   +--------+---------+          +--------+---------+             |
  |            |                             |                       |
  +------------+-----------------------------+-----------------------+
               |  HTTP REST (JSON)           |
               v                             v
  +------------------------------------------------------------------+
  |                       API TIER                                   |
  |                                                                  |
  |   +----------------------------------------------------------+  |
  |   |              Express.js Server (Port 3001)                |  |
  |   |                                                          |  |
  |   |   Middleware:  CORS  |  JSON Parser  |  Error Handler     |  |
  |   |                                                          |  |
  |   |   Routes:                                                |  |
  |   |   /api/dashboard/*    --> Dashboard stats aggregation    |  |
  |   |   /api/customers/*    --> Customer CRUD                  |  |
  |   |   /api/accounts/*     --> Account management             |  |
  |   |   /api/transactions/* --> Transaction records            |  |
  |   |   /api/loans/*        --> Loan lifecycle                 |  |
  |   |   /api/cards/*        --> Card management                |  |
  |   |   /api/bill-payments/*--> Bill payments                  |  |
  |   |   /api/test-cases/*   --> Test case CRUD + execution     |  |
  |   |   /api/test-suites/*  --> Test suite management          |  |
  |   |   /api/defects/*      --> Defect tracking                |  |
  |   |   /api/sql/execute    --> Ad-hoc SQL execution           |  |
  |   |   /api/schema         --> DB schema introspection        |  |
  |   +----------------------------+-----------------------------+  |
  |                                |                                |
  +--------------------------------+--------------------------------+
                                   |  SQL (better-sqlite3)
                                   v
  +------------------------------------------------------------------+
  |                       DATA TIER                                  |
  |                                                                  |
  |   +----------------------------------------------------------+  |
  |   |             SQLite Database (banking.db)                  |  |
  |   |             WAL Mode | Busy Timeout 5000ms                |  |
  |   |                                                          |  |
  |   |   Banking:  customers, accounts, transactions, loans,    |  |
  |   |             cards, bill_payments, notifications           |  |
  |   |                                                          |  |
  |   |   Testing:  test_suites, test_cases, test_runs,          |  |
  |   |             operation_flow_log, defects                   |  |
  |   |                                                          |  |
  |   |   Security: login_sessions, audit_log                    |  |
  |   +----------------------------------------------------------+  |
  +------------------------------------------------------------------+`}</pre>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Data Flow</h3>
        <pre style={codeBlock}>{`
  Request Flow:
  ============
  Browser/SoapUI
      |
      | 1. HTTP Request (GET/POST/PUT/DELETE)
      v
  Express Server
      |
      | 2. CORS check --> JSON parse --> Route match
      v
  Route Handler
      |
      | 3. Validate input --> Build SQL --> Execute
      v
  better-sqlite3
      |
      | 4. Query SQLite (WAL mode, synchronous)
      v
  SQLite banking.db
      |
      | 5. Return rows / changes
      v
  Route Handler
      |
      | 6. Format response JSON
      v
  Express Server
      |
      | 7. HTTP Response (JSON)
      v
  Browser/SoapUI`}</pre>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Component Interactions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            ['Frontend --> Backend', 'React calls Express REST APIs using fetch(). All requests are JSON. CORS enabled for localhost:3000.'],
            ['Backend --> Database', 'Express uses better-sqlite3 (synchronous) with WAL mode. Parameterized queries prevent SQL injection.'],
            ['SoapUI --> Backend', 'SoapUI sends REST requests to the same Express API. Used for automated regression testing.'],
            ['Test Execution Flow', 'Tester selects test case --> Clicks Execute --> Backend updates status + actual_result + timestamp in DB.'],
            ['Defect Linking', 'Failed test cases can have defects linked via test_case_id foreign key. Defects tracked independently.'],
            ['Operation Flow', 'Each API call during test execution is logged in operation_flow_log with request/response details.'],
          ].map(([title, desc], i) => (
            <div key={i} style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '3px solid #1a73e8',
            }}>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a2e', marginBottom: '4px' }}>{title}</div>
              <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── BRD Tab ─── */
function BRDTab() {
  return (
    <div>
      <div style={sectionBox}>
        <h3 style={h3Style}>Business Objectives</h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            'Provide a centralized QA dashboard for banking application testing',
            'Enable manual testers to manage, execute, and track test cases efficiently',
            'Support all core banking modules: Registration, Auth, Accounts, Transfers, Bills, Loans, Cards',
            'Track defects linked to specific test cases with full lifecycle management',
            'Generate test coverage reports per module for stakeholder visibility',
            'Integrate with SoapUI for automated API regression testing',
            'Provide SQL editor for ad-hoc database verification during testing',
            'Document banking API contracts with sample request/response payloads',
          ].map((obj, i) => (
            <div key={i} style={{
              padding: '10px 14px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '3px solid #2e7d32',
              fontSize: '13px',
              color: '#333',
            }}>
              <strong>BO-{String(i + 1).padStart(2, '0')}:</strong> {obj}
            </div>
          ))}
        </div>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>User Stories</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f4f8' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>User Story</th>
              <th style={thStyle}>Priority</th>
              <th style={thStyle}>Module</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['US-01', 'As a QA tester, I want to view all test cases filtered by module so I can focus on one area at a time', 'High', 'Test Cases'],
              ['US-02', 'As a QA tester, I want to execute a test case and record pass/fail with actual results', 'High', 'Execution'],
              ['US-03', 'As a QA lead, I want to see test coverage per banking module on the dashboard', 'High', 'Dashboard'],
              ['US-04', 'As a QA tester, I want to log defects linked to failed test cases', 'High', 'Defects'],
              ['US-05', 'As a QA tester, I want to run SQL queries to verify database state after tests', 'Medium', 'SQL Editor'],
              ['US-06', 'As a QA tester, I want to see API endpoint documentation with sample payloads', 'Medium', 'Banking Modules'],
              ['US-07', 'As a QA lead, I want to generate pass/fail reports for sprint review meetings', 'Medium', 'Reports'],
              ['US-08', 'As a tester, I want to trace the operation flow of each test execution', 'Medium', 'Operation Flow'],
              ['US-09', 'As a new tester, I want to learn banking domain concepts from the documentation', 'Low', 'Documentation'],
              ['US-10', 'As a tester, I want to prepare for QA interviews using curated Q&A', 'Low', 'Interview Prep'],
            ].map(([id, story, priority, module], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}><strong>{id}</strong></td>
                <td style={tdStyle}>{story}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: priority === 'High' ? '#ffebee' : priority === 'Medium' ? '#fff3e0' : '#e8f5e9',
                    color: priority === 'High' ? '#c62828' : priority === 'Medium' ? '#e65100' : '#2e7d32',
                  }}>{priority}</span>
                </td>
                <td style={tdStyle}>{module}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Acceptance Criteria - Banking Modules</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            ['Registration', [
              'AC-01: Customer can register with valid PAN, Aadhaar, phone',
              'AC-02: Duplicate PAN/email rejected with 409 status',
              'AC-03: OTP verified within 5 minutes or expires',
              'AC-04: Account created only after KYC approval',
            ]],
            ['Authentication', [
              'AC-05: Valid credentials return JWT token with 1-hour expiry',
              'AC-06: 5 failed attempts lock account for 30 minutes',
              'AC-07: Logout invalidates token immediately',
              'AC-08: Password change terminates all other sessions',
            ]],
            ['Accounts', [
              'AC-09: Balance reflects all cleared transactions',
              'AC-10: Statement downloadable for up to 1 year',
              'AC-11: Account closure requires zero balance',
              'AC-12: Minimum balance violation generates notification',
            ]],
            ['Transfers', [
              'AC-13: NEFT processes within 2-4 hours during banking hours',
              'AC-14: IMPS completes within 30 seconds, 24x7',
              'AC-15: UPI limit enforced at INR 1,00,000 per transaction',
              'AC-16: RTGS minimum INR 2,00,000 enforced',
            ]],
            ['Bill Payment', [
              'AC-17: Bill fetch returns amount and due date from biller',
              'AC-18: Duplicate payment within 24 hours blocked',
              'AC-19: Scheduled payments execute on configured date',
              'AC-20: Payment receipt generated for every successful payment',
            ]],
            ['Loans', [
              'AC-21: Eligibility check validates FOIR < 0.50',
              'AC-22: EMI schedule shows principal/interest breakdown',
              'AC-23: Prepayment allowed after 6 EMIs with 2-4% charge',
              'AC-24: NOC generated within 7 days of loan closure',
            ]],
            ['Cards', [
              'AC-25: Lost card blocked immediately on request',
              'AC-26: Temporarily blocked card can be unblocked via OTP',
              'AC-27: International transactions disabled by default',
              'AC-28: Card limits cannot exceed credit limit / account balance',
            ]],
            ['Security', [
              'AC-29: All SQL injection payloads return 400 status',
              'AC-30: XSS payloads are sanitized in all output fields',
              'AC-31: CSRF protection on all state-changing endpoints',
              'AC-32: Access to other customer data returns 403',
            ]],
          ].map(([module, criteria], i) => (
            <div key={i} style={{
              padding: '14px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
            }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#1a1a2e', marginBottom: '8px' }}>{module}</div>
              {criteria.map((ac, j) => (
                <div key={j} style={{ fontSize: '12px', color: '#444', padding: '3px 0', lineHeight: '1.5' }}>
                  {ac}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── LLD Tab ─── */
function LLDTab() {
  return (
    <div>
      <div style={sectionBox}>
        <h3 style={h3Style}>Class Diagram (Backend - Express Route Handlers)</h3>
        <pre style={codeBlock}>{`
  +--------------------------------------------------+
  |                  server.js                       |
  |  (Express Application - Single File Backend)     |
  +--------------------------------------------------+
  |                                                  |
  |  Dependencies:                                   |
  |  - express        (HTTP framework)               |
  |  - cors           (Cross-origin support)         |
  |  - better-sqlite3 (Sync SQLite driver)           |
  |                                                  |
  |  Configuration:                                  |
  |  - PORT: 3001                                    |
  |  - DB_PATH: ../database/banking.db               |
  |  - PRAGMA: journal_mode=WAL, busy_timeout=5000   |
  |                                                  |
  |  Route Groups:                                   |
  |  +--------------------------------------------+  |
  |  | GET  /api/dashboard/stats                  |  |
  |  | GET  /api/customers      [list]            |  |
  |  | GET  /api/customers/:id  [detail]          |  |
  |  | GET  /api/accounts       [list + join]     |  |
  |  | GET  /api/accounts/:id   [detail + join]   |  |
  |  | GET  /api/transactions   [list + join]     |  |
  |  | GET  /api/loans          [list + join]     |  |
  |  | GET  /api/cards          [list + join]     |  |
  |  | GET  /api/bill-payments  [list + join]     |  |
  |  | GET  /api/test-suites    [list + subquery] |  |
  |  | GET  /api/test-cases     [filter query]    |  |
  |  | GET  /api/test-cases/:id [detail]          |  |
  |  | PUT  /api/test-cases/:id/execute [update]  |  |
  |  | GET  /api/test-runs      [list]            |  |
  |  | GET  /api/operation-flow [filter]          |  |
  |  | GET  /api/defects        [list + join]     |  |
  |  | GET  /api/audit-log      [list + join]     |  |
  |  | POST /api/sql/execute    [dynamic SQL]     |  |
  |  | GET  /api/schema         [introspection]   |  |
  |  | GET  /api/notifications  [list + join]     |  |
  |  | GET  /api/sessions       [list + join]     |  |
  |  +--------------------------------------------+  |
  +--------------------------------------------------+`}</pre>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>API Contract Details</h3>
        <pre style={codeBlock}>{`
  Endpoint: PUT /api/test-cases/:id/execute
  ==========================================
  Purpose: Execute a test case and record results

  Request Headers:
    Content-Type: application/json

  Request Body:
    {
      "status":            string  ("pass"|"fail"|"blocked"|"not_run"),
      "actual_result":     string  (observed behavior),
      "notes":             string  (optional tester notes),
      "execution_time_ms": integer (time taken in milliseconds)
    }

  Response (200 OK):
    {
      "id":                integer,
      "test_case_id":      string,
      "title":             string,
      "module":            string,
      "status":            string,  -- updated
      "actual_result":     string,  -- updated
      "notes":             string,  -- updated
      "execution_time_ms": integer, -- updated
      "executed_at":       string   -- auto-set to now()
    }

  Error Responses:
    404: { "detail": "Test case not found" }

  ==========================================
  Endpoint: POST /api/sql/execute
  ==========================================
  Purpose: Execute ad-hoc SQL against banking DB

  Request Body:
    { "query": "SELECT * FROM customers LIMIT 10" }

  Response (200 - SELECT):
    {
      "success":     true,
      "type":        "query",
      "rows":        [...],
      "rowCount":    10,
      "columns":     ["id", "first_name", ...],
      "duration_ms": 5
    }

  Response (200 - INSERT/UPDATE/DELETE):
    {
      "success":          true,
      "type":             "statement",
      "changes":          1,
      "lastInsertRowid":  42,
      "duration_ms":      3
    }

  Error (400):
    { "success": false, "error": "...", "detail": "SQL execution failed" }`}</pre>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Database Schema Details</h3>
        <pre style={codeBlock}>{`
  TABLE: customers
  +------------------+---------+------+------------------------------------------+
  | Column           | Type    | NULL | Constraints                              |
  +------------------+---------+------+------------------------------------------+
  | id               | INTEGER | NO   | PRIMARY KEY AUTOINCREMENT                |
  | first_name       | TEXT    | NO   |                                          |
  | last_name        | TEXT    | NO   |                                          |
  | email            | TEXT    | NO   | UNIQUE                                   |
  | phone            | TEXT    | NO   |                                          |
  | pan_number       | TEXT    | YES  | UNIQUE                                   |
  | date_of_birth    | TEXT    | YES  |                                          |
  | address          | TEXT    | YES  |                                          |
  | status           | TEXT    | YES  | DEFAULT 'active'                         |
  | created_at       | TEXT    | YES  | DEFAULT (datetime('now'))                |
  +------------------+---------+------+------------------------------------------+

  TABLE: accounts
  +------------------+---------+------+------------------------------------------+
  | Column           | Type    | NULL | Constraints                              |
  +------------------+---------+------+------------------------------------------+
  | id               | INTEGER | NO   | PRIMARY KEY AUTOINCREMENT                |
  | customer_id      | INTEGER | NO   | REFERENCES customers(id)                 |
  | account_number   | TEXT    | NO   | UNIQUE                                   |
  | account_type     | TEXT    | NO   | 'savings'|'current'|'salary'|'fd'        |
  | balance          | REAL    | YES  | DEFAULT 0                                |
  | status           | TEXT    | YES  | DEFAULT 'active'                         |
  | branch           | TEXT    | YES  |                                          |
  | created_at       | TEXT    | YES  | DEFAULT (datetime('now'))                |
  +------------------+---------+------+------------------------------------------+

  TABLE: transactions
  +------------------+---------+------+------------------------------------------+
  | Column           | Type    | NULL | Constraints                              |
  +------------------+---------+------+------------------------------------------+
  | id               | INTEGER | NO   | PRIMARY KEY AUTOINCREMENT                |
  | from_account_id  | INTEGER | YES  | REFERENCES accounts(id)                  |
  | to_account_id    | INTEGER | YES  | REFERENCES accounts(id)                  |
  | type             | TEXT    | NO   | 'NEFT'|'IMPS'|'UPI'|'RTGS'|'internal'   |
  | amount           | REAL    | NO   |                                          |
  | status           | TEXT    | YES  | DEFAULT 'completed'                      |
  | narration        | TEXT    | YES  |                                          |
  | reference_number | TEXT    | YES  | UNIQUE                                   |
  | created_at       | TEXT    | YES  | DEFAULT (datetime('now'))                |
  +------------------+---------+------+------------------------------------------+

  TABLE: test_cases
  +------------------+---------+------+------------------------------------------+
  | Column           | Type    | NULL | Constraints                              |
  +------------------+---------+------+------------------------------------------+
  | id               | INTEGER | NO   | PRIMARY KEY AUTOINCREMENT                |
  | test_case_id     | TEXT    | NO   | UNIQUE (e.g. TC-001)                     |
  | test_suite_id    | INTEGER | YES  | REFERENCES test_suites(id)               |
  | title            | TEXT    | NO   |                                          |
  | module           | TEXT    | NO   | Module name for filtering                |
  | category         | TEXT    | YES  | 'functional'|'security'|'performance'    |
  | priority         | TEXT    | YES  | 'P0'|'P1'|'P2'|'P3'                     |
  | status           | TEXT    | YES  | 'pass'|'fail'|'blocked'|'not_run'        |
  | expected_result  | TEXT    | YES  |                                          |
  | actual_result    | TEXT    | YES  |                                          |
  | notes            | TEXT    | YES  |                                          |
  | execution_time_ms| INTEGER | YES  |                                          |
  | executed_at      | TEXT    | YES  |                                          |
  +------------------+---------+------+------------------------------------------+`}</pre>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Error Codes Reference</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f4f8' }}>
              <th style={thStyle}>HTTP Status</th>
              <th style={thStyle}>Error Code</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Example</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['200', 'OK', 'Request succeeded', 'GET /api/customers'],
              ['201', 'CREATED', 'Resource created successfully', 'POST /api/v1/auth/register'],
              ['400', 'BAD_REQUEST', 'Invalid input or validation failure', 'Missing required field, invalid format'],
              ['401', 'UNAUTHORIZED', 'Authentication required or token invalid', 'Missing/expired JWT'],
              ['402', 'PAYMENT_REQUIRED', 'Insufficient account balance', 'Transfer exceeds available funds'],
              ['403', 'FORBIDDEN', 'Authenticated but not authorized', 'Access other customer data'],
              ['404', 'NOT_FOUND', 'Resource does not exist', 'GET /api/customers/99999'],
              ['409', 'CONFLICT', 'Duplicate resource or state conflict', 'Duplicate PAN during registration'],
              ['422', 'UNPROCESSABLE', 'Business rule violation', 'Loan amount exceeds eligibility'],
              ['429', 'RATE_LIMITED', 'Too many requests', 'Exceeded 5 login attempts/minute'],
              ['500', 'INTERNAL_ERROR', 'Unexpected server error', 'Database connection failure'],
              ['503', 'SERVICE_UNAVAILABLE', 'External service down', 'NEFT window closed, biller offline'],
            ].map(([status, code, desc, example], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: parseInt(status) < 300 ? '#e8f5e9' : parseInt(status) < 500 ? '#fff3e0' : '#ffebee',
                    color: parseInt(status) < 300 ? '#2e7d32' : parseInt(status) < 500 ? '#e65100' : '#c62828',
                  }}>{status}</span>
                </td>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 600 }}>{code}</td>
                <td style={tdStyle}>{desc}</td>
                <td style={{ ...tdStyle, color: '#666', fontStyle: 'italic' }}>{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Database Flow Tab ─── */
function DbFlowTab() {
  return (
    <div>
      <div style={sectionBox}>
        <h3 style={h3Style}>Entity Relationship Diagram</h3>
        <pre style={codeBlock}>{`
  +----------------+       +------------------+       +------------------+
  |   customers    |       |    accounts      |       |  transactions    |
  +----------------+       +------------------+       +------------------+
  | PK id          |<------| FK customer_id   |    +--| FK from_account  |
  | first_name     |  1:N  | PK id            |<---+  | FK to_account    |
  | last_name      |       | account_number   |    +->| PK id            |
  | email (UNIQUE) |       | account_type     |       | type             |
  | phone          |       | balance          |       | amount           |
  | pan_number     |       | status           |       | status           |
  | date_of_birth  |       | branch           |       | narration        |
  | address        |       | created_at       |       | reference_number |
  | status         |       +------------------+       | created_at       |
  | created_at     |                                  +------------------+
  +-------+--------+
          |
          | 1:N               1:N               1:N
          |
  +-------v--------+       +------------------+       +------------------+
  |     loans      |       |     cards        |       |  bill_payments   |
  +----------------+       +------------------+       +------------------+
  | PK id          |       | PK id            |       | PK id            |
  | FK customer_id |       | FK customer_id   |       | FK customer_id   |
  | loan_type      |       | card_number      |       | biller_name      |
  | amount         |       | card_type        |       | amount           |
  | interest_rate  |       | network          |       | payment_date     |
  | tenure_months  |       | status           |       | status           |
  | emi_amount     |       | credit_limit     |       | reference_number |
  | status         |       | expiry_date      |       | created_at       |
  | disbursed_at   |       | created_at       |       +------------------+
  +----------------+       +------------------+

  +----------------+       +------------------+       +------------------+
  | login_sessions |       |   audit_log      |       |  notifications   |
  +----------------+       +------------------+       +------------------+
  | PK id          |       | PK id            |       | PK id            |
  | FK customer_id |       | FK customer_id   |       | FK customer_id   |
  | session_token  |       | action           |       | type             |
  | ip_address     |       | entity_type      |       | title            |
  | device_info    |       | entity_id        |       | message          |
  | login_at       |       | details          |       | read             |
  | logout_at      |       | ip_address       |       | created_at       |
  | status         |       | created_at       |       +------------------+
  +----------------+       +------------------+

  +----------------+       +------------------+       +------------------+
  |  test_suites   |       |   test_cases     |       |    defects       |
  +----------------+       +------------------+       +------------------+
  | PK id          |<------| FK test_suite_id |<------| FK test_case_id  |
  | name           |  1:N  | PK id            |  1:N  | PK id            |
  | description    |       | test_case_id     |       | title            |
  | module         |       | title            |       | description      |
  | created_at     |       | module           |       | severity         |
  +----------------+       | category         |       | priority         |
                           | priority         |       | status           |
  +----------------+       | status           |       | assignee         |
  |   test_runs    |       | expected_result  |       | created_at       |
  +----------------+       | actual_result    |       +------------------+
  | PK id          |       | executed_at      |
  | run_name       |       +------------------+       +------------------+
  | run_date       |                                  | operation_flow   |
  | total / pass   |       +------------------+       |     _log         |
  | fail / skip    |       | FK test_case_id  |------>+------------------+
  +----------------+       +------------------+       | PK id            |
                                                      | FK test_case_id  |
                                                      | step_number      |
                                                      | operation        |
                                                      | request          |
                                                      | response         |
                                                      | status_code      |
                                                      | timestamp        |
                                                      +------------------+`}</pre>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Table Relationships Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f4f8' }}>
              <th style={thStyle}>Parent Table</th>
              <th style={thStyle}>Child Table</th>
              <th style={thStyle}>Relationship</th>
              <th style={thStyle}>Foreign Key</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['customers', 'accounts', '1:N', 'accounts.customer_id'],
              ['customers', 'loans', '1:N', 'loans.customer_id'],
              ['customers', 'cards', '1:N', 'cards.customer_id'],
              ['customers', 'bill_payments', '1:N', 'bill_payments.customer_id'],
              ['customers', 'login_sessions', '1:N', 'login_sessions.customer_id'],
              ['customers', 'audit_log', '1:N', 'audit_log.customer_id'],
              ['customers', 'notifications', '1:N', 'notifications.customer_id'],
              ['accounts', 'transactions (from)', '1:N', 'transactions.from_account_id'],
              ['accounts', 'transactions (to)', '1:N', 'transactions.to_account_id'],
              ['test_suites', 'test_cases', '1:N', 'test_cases.test_suite_id'],
              ['test_cases', 'defects', '1:N', 'defects.test_case_id'],
              ['test_cases', 'operation_flow_log', '1:N', 'operation_flow_log.test_case_id'],
            ].map(([parent, child, rel, fk], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 600 }}>{parent}</td>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 600 }}>{child}</td>
                <td style={tdStyle}>{rel}</td>
                <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#1565c0' }}>{fk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={sectionBox}>
        <h3 style={h3Style}>Sample Queries</h3>
        <pre style={codeBlock}>{`-- 1. Customer with all accounts and balances
SELECT c.first_name || ' ' || c.last_name AS name,
       a.account_number, a.account_type, a.balance, a.status
FROM customers c
JOIN accounts a ON a.customer_id = c.id
WHERE c.id = 1;

-- 2. Transaction history for an account
SELECT t.*, fa.account_number AS from_acc, ta.account_number AS to_acc
FROM transactions t
LEFT JOIN accounts fa ON t.from_account_id = fa.id
LEFT JOIN accounts ta ON t.to_account_id = ta.id
WHERE t.from_account_id = 1 OR t.to_account_id = 1
ORDER BY t.created_at DESC;

-- 3. Test case pass rate by module
SELECT module,
       COUNT(*) AS total,
       SUM(CASE WHEN status='pass' THEN 1 ELSE 0 END) AS passed,
       SUM(CASE WHEN status='fail' THEN 1 ELSE 0 END) AS failed,
       ROUND(100.0 * SUM(CASE WHEN status='pass' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pass_rate
FROM test_cases
GROUP BY module
ORDER BY pass_rate DESC;

-- 4. Open defects with linked test case info
SELECT d.*, tc.test_case_id AS tc_code, tc.title AS tc_title
FROM defects d
LEFT JOIN test_cases tc ON d.test_case_id = tc.id
WHERE d.status IN ('open', 'in_progress', 'reopened')
ORDER BY d.created_at DESC;

-- 5. Recent login sessions with customer names
SELECT ls.*, c.first_name || ' ' || c.last_name AS customer_name
FROM login_sessions ls
JOIN customers c ON ls.customer_id = c.id
ORDER BY ls.login_at DESC
LIMIT 20;

-- 6. Dashboard aggregate stats
SELECT
  (SELECT COUNT(*) FROM customers) AS total_customers,
  (SELECT COUNT(*) FROM accounts WHERE status='active') AS active_accounts,
  (SELECT SUM(balance) FROM accounts WHERE status='active') AS total_balance,
  (SELECT COUNT(*) FROM test_cases) AS total_tests,
  (SELECT COUNT(*) FROM test_cases WHERE status='pass') AS passed_tests,
  (SELECT COUNT(*) FROM defects WHERE status IN ('open','in_progress')) AS open_defects;`}</pre>
      </div>
    </div>
  );
}

/* ─── Tech Stack Tab ─── */
function TechStackTab() {
  const categories = [
    {
      name: 'Frontend',
      color: '#1565c0',
      items: [
        { name: 'React 18+', version: '19.2.4', desc: 'Component-based UI library with hooks (useState, useEffect)' },
        { name: 'Native CSS', version: '-', desc: 'Inline styles and plain CSS. No CSS framework or preprocessor.' },
        { name: 'Fetch API', version: 'Built-in', desc: 'Native browser HTTP client for REST API calls to Express backend' },
      ],
    },
    {
      name: 'Backend',
      color: '#2e7d32',
      items: [
        { name: 'Node.js', version: '18+', desc: 'JavaScript runtime for the API server' },
        { name: 'Express.js', version: '4.x', desc: 'Minimal web framework for REST API routes and middleware' },
        { name: 'better-sqlite3', version: '11.x', desc: 'Synchronous SQLite3 driver with WAL mode support' },
        { name: 'cors', version: '2.x', desc: 'CORS middleware to allow React dev server cross-origin requests' },
      ],
    },
    {
      name: 'Database',
      color: '#6a1b9a',
      items: [
        { name: 'SQLite', version: '3.x', desc: 'Embedded relational database. Zero configuration, file-based.' },
        { name: 'WAL Mode', version: '-', desc: 'Write-Ahead Logging for better concurrent read performance' },
        { name: 'PRAGMA busy_timeout', version: '5000ms', desc: 'Wait up to 5 seconds on locked database before error' },
      ],
    },
    {
      name: 'Testing Tools',
      color: '#e65100',
      items: [
        { name: 'SoapUI', version: '5.7.2', desc: 'API testing tool for REST/SOAP services. Test suites, assertions, mocking.' },
        { name: 'Manual Testing', version: '-', desc: 'Built-in test execution UI with pass/fail recording and timing' },
        { name: 'SQL Editor', version: '-', desc: 'In-app query tool for database verification during testing' },
      ],
    },
    {
      name: 'Development',
      color: '#455a64',
      items: [
        { name: 'Create React App', version: '5.0.1', desc: 'React project scaffolding with webpack, babel, dev server' },
        { name: 'npm', version: '-', desc: 'Package manager for both frontend and backend dependencies' },
        { name: 'VS Code', version: '-', desc: 'Recommended editor with ESLint + Prettier extensions' },
      ],
    },
  ];

  return (
    <div>
      <div style={sectionBox}>
        <h3 style={h3Style}>Technology Stack Overview</h3>
        <pre style={codeBlock}>{`
  +-------------------------------------------------------------------+
  |                      PRESENTATION LAYER                           |
  |   React 19.2  |  Native CSS  |  Fetch API  |  SPA (localhost:3000)|
  +-------------------------------------------------------------------+
                              |
                         HTTP REST (JSON)
                              |
  +-------------------------------------------------------------------+
  |                        API LAYER                                  |
  |   Node.js 18+  |  Express 4.x  |  CORS  |  JSON  (localhost:3001)|
  +-------------------------------------------------------------------+
                              |
                      better-sqlite3 (sync)
                              |
  +-------------------------------------------------------------------+
  |                        DATA LAYER                                 |
  |   SQLite 3.x  |  WAL Mode  |  banking.db  |  File-based          |
  +-------------------------------------------------------------------+
                              |
  +-------------------------------------------------------------------+
  |                      TESTING LAYER                                |
  |   SoapUI 5.7.2  |  Manual Exec UI  |  SQL Editor  |  Reports     |
  +-------------------------------------------------------------------+`}</pre>
      </div>

      {categories.map((cat, ci) => (
        <div key={ci} style={sectionBox}>
          <h3 style={{ ...h3Style, color: cat.color }}>{cat.name}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f4f8' }}>
                <th style={{ ...thStyle, width: '180px' }}>Technology</th>
                <th style={{ ...thStyle, width: '100px' }}>Version</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {cat.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: cat.color }}>{item.name}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{item.version}</td>
                  <td style={tdStyle}>{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div style={sectionBox}>
        <h3 style={h3Style}>Why These Choices?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            ['React (No Router)', 'Single-page app with sidebar navigation. No need for URL routing since it is a dashboard tool, not a public website.'],
            ['Native CSS (No Framework)', 'Inline styles keep components self-contained. No build-time CSS processing needed. Simple enough for a testing tool.'],
            ['Express (Not FastAPI)', 'JavaScript across the full stack. Simpler deployment. Synchronous SQLite works well with Express.'],
            ['SQLite (Not PostgreSQL)', 'Zero configuration, file-based, embedded. Perfect for a single-user/small-team testing dashboard. No DB server needed.'],
            ['better-sqlite3 (Not Sequelize)', 'Synchronous API is simpler. Direct SQL gives full control. No ORM overhead for a read-heavy testing tool.'],
            ['SoapUI (Not Postman)', 'Better SOAP support for banking systems. Built-in test suites, assertions, and mock services. Industry standard for banking QA.'],
          ].map(([title, desc], i) => (
            <div key={i} style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '3px solid #1a73e8',
            }}>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a2e', marginBottom: '4px' }}>{title}</div>
              <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared table styles ─── */
const thStyle = {
  padding: '10px 12px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '12px',
  color: '#333',
  borderBottom: '2px solid #ddd',
};
const tdStyle = {
  padding: '8px 12px',
  fontSize: '12px',
  color: '#444',
};

/* ─── Main Component ─── */
function Documentation() {
  const [activeTab, setActiveTab] = useState('readme');

  const renderTab = () => {
    switch (activeTab) {
      case 'readme': return <ReadmeTab />;
      case 'c4model': return <C4ModelTab />;
      case 'hld': return <HLDTab />;
      case 'brd': return <BRDTab />;
      case 'lld': return <LLDTab />;
      case 'dbflow': return <DbFlowTab />;
      case 'techstack': return <TechStackTab />;
      default: return <ReadmeTab />;
    }
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        padding: '24px 28px',
        borderRadius: '12px',
        marginBottom: '20px',
      }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 700 }}>Documentation</h2>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
          Architecture documents, design specifications, business requirements, and technical reference
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '4px',
        borderBottom: '2px solid #e0e0e0',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #1a73e8' : '3px solid transparent',
              backgroundColor: activeTab === tab.id ? '#e8f0fe' : 'transparent',
              color: activeTab === tab.id ? '#1a73e8' : '#555',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '13px',
              whiteSpace: 'nowrap',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderTab()}
    </div>
  );
}

export default Documentation;

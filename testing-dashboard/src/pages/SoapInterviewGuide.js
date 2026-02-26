import React, { useState } from 'react';

/* ================================================================
   SOAP API Testing Interview Guide
   Comprehensive interview preparation for Banking QA Testers
   8 Tabs: Framework, PhD-Level, Customer & Account, Transactions,
           Security & Auth, DB Validation, Negative & Edge, Quick Reference
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
  text: '#ffffff',
  textMuted: '#a0b4c8',
  border: '#1e5a8a',
  inputBg: '#0a2a4a',
  pass: '#2ecc71',
  fail: '#e74c3c',
  pending: '#f39c12',
};

const priorityColors = { P0: C.red, P1: C.orange, P2: C.blue };

// Tab Definitions
const TABS = [
  { id: 'framework', label: '10-Step Framework', icon: 'F', count: 11 },
  { id: 'phd', label: 'PhD-Level Explanation', icon: 'P', count: 7 },
  { id: 'customer', label: 'Customer & Account', icon: 'C', count: 20 },
  { id: 'transactions', label: 'Transactions', icon: 'T', count: 10 },
  { id: 'security', label: 'Security & Auth', icon: 'S', count: 10 },
  { id: 'db', label: 'DB Validation', icon: 'D', count: 10 },
  { id: 'negative', label: 'Negative & Edge Cases', icon: 'N', count: 30 },
  { id: 'reference', label: 'Quick Reference', icon: 'R', count: 10 },
];

/* ================================================================
   DATA: TAB 1 - 10-Step Framework
   ================================================================ */
const FRAMEWORK_STEPS = [
  {
    step: 0,
    title: 'Frame the Problem',
    timing: '10-15 seconds',
    color: C.purple,
    content: 'Set context before diving into details. Show the interviewer you understand the big picture.',
    quote: 'In the banking program, multiple systems exchanged customer/account data through SOAP services. My responsibility was to validate that each SOAP operation behaved correctly as a contract (WSDL/XSD), enforced business rules, persisted the right data, and rejected invalid or unauthorized requests.',
    bullets: [
      'Mention the domain (banking/financial services)',
      'Mention the protocol (SOAP over HTTP)',
      'Mention your role (QA validation of SOAP services)',
      'Mention scope (contract, business rules, data persistence, security)',
    ],
  },
  {
    step: 1,
    title: 'Study the Contract and Domain Flow',
    timing: 'First activity on any new service',
    color: C.blue,
    content: 'Before writing a single test, understand what you are testing.',
    bullets: [
      'Read WSDL + XSD thoroughly',
      'Identify operations: CreateCustomer, CreateAccount, Deposit/Posting, GetAccountDetails',
      'Understand request/response structures and SOAP Faults',
      'Map domain workflow: Customer onboarding -> account creation -> transactional posting -> enquiry/reconciliation',
      'List dependencies: Auth mechanism, downstream systems, reference/master tables',
      'Identify mandatory vs optional fields from XSD constraints',
      'Note data types, enumerations, and regex patterns in schema',
    ],
  },
  {
    step: 2,
    title: 'Set Up SoapUI Project Like a Test Harness',
    timing: 'Project setup phase',
    color: C.green,
    content: 'Configure SoapUI as a proper test harness, not just a request sender.',
    bullets: [
      'Import WSDL into SoapUI (auto-generates operations and sample requests)',
      'Configure endpoints per environment (Dev / QA / UAT base URLs)',
      'Configure authentication (Basic auth / WS-Security / certificates)',
      'Create project-level properties: baseUrl, token, customerId, accountId, branchCode, productCode',
      'Set up environment switching for seamless Dev/QA/UAT execution',
      'Configure global HTTP settings (timeouts, SSL, proxy)',
    ],
  },
  {
    step: 3,
    title: 'Build Test Suites That Mirror Banking Modules',
    timing: 'Test organization phase',
    color: C.orange,
    content: 'Structure test suites to reflect the banking domain, not random groupings.',
    bullets: [
      'TestSuite A: Customer / Master Data (CreateCustomer, UpdateCustomer, SearchCustomer, GetCustomer)',
      'TestSuite B: Account Services (CreateAccount, LinkCustomerAccount, UpdateAccountStatus, GetAccount)',
      'TestSuite C: Transactions (Deposit, Withdrawal, Transfer, Reversal, GetTransactionHistory)',
      'TestSuite D: Security / Access (Missing token, expired token, wrong role, data masking)',
      'Each suite contains TestCases -> TestSteps in logical order',
      'Use naming convention: TS_ModuleName / TC_Scenario_Description',
    ],
  },
  {
    step: 4,
    title: 'Design Test Cases Using a Scenario Matrix',
    timing: 'Test design phase',
    color: C.yellow,
    content: 'Use a structured matrix to ensure comprehensive coverage across all scenario types.',
    bullets: [
      'Happy path: Valid inputs, expected successful responses',
      'Validation negatives: Missing mandatory fields, invalid formats, out-of-range values',
      'Boundary: Min/max amounts, field length limits, date ranges',
      'Business rules: Minimum balance, duplicate prevention, status transitions',
      'Security: Auth token validation, role-based access, data masking',
      'Reliability: Timeout handling, retry behavior, concurrent requests',
      'Error handling: SOAP Fault structure, error codes, graceful degradation',
    ],
  },
  {
    step: 5,
    title: 'Execute Tests with Assertions',
    timing: 'Test execution phase',
    color: C.red,
    content: 'Assertions are the backbone of automated validation in SoapUI.',
    bullets: [
      'Schema Compliance Assertion: Validates response against WSDL/XSD',
      'XPath Match Assertions: //CustomerId, //AccountNumber, //Status, //Balance, //ResponseCode',
      'Contains / Not Contains: Check for expected strings or absence of error messages',
      'SOAP Fault Assertions: Validate fault code, fault string, and detail element',
      'Response SLA Assertion: Ensure response time is within acceptable limits (e.g., < 2s)',
      'Script Assertions: Custom Groovy scripts for complex validation logic',
    ],
  },
  {
    step: 6,
    title: 'Chain Calls to Validate End-to-End Flow',
    timing: 'Integration testing phase',
    color: C.purple,
    content: 'Real banking workflows span multiple API calls. Validate the entire chain.',
    bullets: [
      'CreateCustomer -> extract CustomerId from response',
      'CreateAccount using CustomerId -> extract AccountNumber',
      'Deposit/Posting using AccountNumber -> verify transaction reference',
      'GetAccountDetails -> validate updated balance/status reflects deposit',
      'Property Transfer between steps: Use SoapUI property transfer to pass values',
      'Validate data consistency across the entire workflow chain',
    ],
    codeSnippet: `<!-- Property Transfer Example -->
Step 1: CreateCustomer Response
  XPath: //CreateCustomerResponse/CustomerId
  Transfer to: Step 2 Request Property

Step 2: CreateAccount Request
  Uses: \${CreateCustomer#Response#//CustomerId}
  XPath: //CreateAccountRequest/CustomerId`,
  },
  {
    step: 7,
    title: 'Persistence and Data Integrity Validation (SQL)',
    timing: 'Backend validation phase',
    color: C.blue,
    content: 'API responses can lie. The database is the source of truth.',
    bullets: [
      'Query customer tables: SELECT * FROM customers WHERE customer_id = ?',
      'Query account tables: SELECT * FROM accounts WHERE account_number = ?',
      'Query transaction tables: SELECT * FROM transactions WHERE ref_number = ?',
      'Validate: No orphan records (customer without account link)',
      'Validate: No duplicates (same transaction posted twice)',
      'Validate: Correct status flags (ACTIVE, PENDING, CLOSED)',
      'Validate: Audit columns populated (created_by, created_date, updated_by, updated_date)',
    ],
    codeSnippet: `-- Sample DB Validation Queries
SELECT c.customer_id, c.name, c.status,
       a.account_number, a.balance, a.currency
FROM customers c
JOIN customer_accounts ca ON c.customer_id = ca.customer_id
JOIN accounts a ON ca.account_number = a.account_number
WHERE c.customer_id = 'CUST-001';

-- Check for orphan records
SELECT * FROM accounts a
WHERE NOT EXISTS (
  SELECT 1 FROM customer_accounts ca
  WHERE ca.account_number = a.account_number
);`,
  },
  {
    step: 8,
    title: 'Investigate Failures Using Evidence',
    timing: 'Defect investigation phase',
    color: C.orange,
    content: 'When a test fails, follow a systematic investigation process.',
    bullets: [
      'Reproduce with minimal payload: Strip the request to the bare minimum that triggers the failure',
      'Compare request vs contract: Is the request valid per WSDL/XSD?',
      'Check SOAP Fault details: Read faultcode, faultstring, and detail elements carefully',
      'Validate DB state: Did the data persist partially? Is there a rollback issue?',
      'Isolate the layer: Contract violation vs transformation error vs business logic vs persistence',
      'Check server logs: Correlate with timestamp and request ID',
      'Document everything: Request, response, DB state, logs, environment details',
    ],
  },
  {
    step: 9,
    title: 'Bug Creation in JIRA',
    timing: 'Defect reporting phase',
    color: C.red,
    content: 'A well-documented bug is half the fix. Make it easy for developers.',
    bullets: [
      'Clear summary: [Module] [Operation] - Brief description of the defect',
      'Environment + build: QA / UAT, build version, date',
      'Exact SOAP request/response: Attach full XML, not screenshots',
      'Expected vs actual: Be specific about field values and behavior',
      'DB proof: Include SQL query and result that shows the data issue',
      'Impact: Business impact (e.g., "customers cannot create accounts")',
      'Severity/Priority: Use P0-P3 scale with business justification',
      'Attachments: SoapUI project export, server logs, screenshots',
    ],
  },
  {
    step: 10,
    title: 'Results Reporting',
    timing: 'Test closure phase',
    color: C.green,
    content: 'Communicate test results clearly to stakeholders.',
    bullets: [
      'Count executed vs planned: Show test execution coverage percentage',
      'Pass/fail/block rates: Visual breakdown with trend over sprints',
      'Defects by severity + module: Heat map showing problem areas',
      'Top risks: Unresolved P0/P1 defects, untested scenarios, environment issues',
      'Recommendation: Go/No-Go decision with supporting evidence',
      'Include SoapUI execution reports as artifacts',
      'Highlight regression from previous builds',
    ],
  },
];

const BEST_ANSWER_90SEC = `In my banking project, I used SoapUI to validate SOAP services that supported customer onboarding, account creation, and transactions. I began by analyzing the WSDL/XSD to understand each operation, payload constraints, and SOAP fault model. I built SoapUI test suites aligned with banking modules and designed scenarios covering positive flows, validation negatives, business rules, security, and error handling. During execution, I relied on schema and XPath assertions to validate critical response fields, and I chained dependent calls using property transfers to validate end-to-end workflows. I also verified persistence and integrity through SQL -- checking correct customer-account linkage, transaction records, status flags, and audit fields. When failures occurred, I reproduced with minimal payloads, reviewed fault details, cross-checked DB state, and isolated whether the issue was contract, mapping, or business logic. Finally, I logged defects in JIRA with complete evidence -- SOAP request/response, expected vs actual, SQL proof -- and produced execution reports highlighting coverage, defect severity trends, and release readiness risk.`;

/* ================================================================
   DATA: TAB 2 - PhD-Level Explanation
   ================================================================ */
const PHD_SECTIONS = [
  {
    id: 'conceptual',
    title: '1. Conceptual Framing',
    color: C.purple,
    content: 'SOAP API testing in banking is not merely sending requests and checking responses. It is a formal verification exercise against a contractually defined interface (WSDL/XSD) within a domain where data correctness has financial and regulatory implications.',
    bullets: [
      'SOAP services in banking act as the system-of-record integration layer',
      'Each operation is a formally specified contract with strict input/output schemas',
      'Testing must verify syntactic compliance, semantic correctness, transactional integrity, and access control',
      'Unlike REST, SOAP has built-in standards for security (WS-Security), reliability (WS-ReliableMessaging), and transactions (WS-AtomicTransaction)',
      'The tester must understand both the technical contract AND the business domain to design meaningful tests',
    ],
  },
  {
    id: 'contract',
    title: '2. Contract & Formal Interface Analysis',
    color: C.blue,
    content: 'The WSDL is not documentation -- it is a machine-readable contract. Testing begins with formal analysis of this contract.',
    bullets: [
      'Parse WSDL to extract: portType (operations), messages, types (XSD schemas), bindings, and service endpoints',
      'XSD analysis: Identify mandatory elements (minOccurs=1), optional elements, data types, restrictions (patterns, enumerations, min/maxLength)',
      'Fault contract: Understand what SOAP Faults the service can return and under what conditions',
      'Namespace analysis: Verify correct namespace usage in requests and responses',
      'Schema evolution: Check backward compatibility when WSDL changes between versions',
      'Policy analysis: WS-Policy attachments defining security, addressing, and QoS requirements',
    ],
  },
  {
    id: 'design',
    title: '3. Test Design Philosophy (4 Axes)',
    color: C.green,
    content: 'Professional SOAP API testing operates across four orthogonal axes that together provide comprehensive coverage.',
    subsections: [
      {
        name: 'Axis 1: Syntactic Validity',
        items: [
          'Schema compliance: Does the response conform to the XSD?',
          'Well-formedness: Is the XML well-formed?',
          'Namespace correctness: Are all namespaces properly declared and used?',
          'Encoding: Character encoding (UTF-8) handling for international data',
        ],
      },
      {
        name: 'Axis 2: Semantic Correctness',
        items: [
          'Business rule enforcement: Minimum balance, valid product codes, status transitions',
          'Data transformation accuracy: Input values correctly mapped to output/stored values',
          'Calculation correctness: Interest rates, fees, tax calculations',
          'Reference data validation: Branch codes, currency codes, product codes against master tables',
        ],
      },
      {
        name: 'Axis 3: Transactional Integrity',
        items: [
          'ACID properties: Atomicity (all-or-nothing), Consistency, Isolation, Durability',
          'End-to-end data flow: Data created via API matches data persisted in database',
          'Idempotency: Repeated identical requests do not create duplicate records',
          'Rollback behavior: Partial failures result in complete rollback, not orphaned data',
        ],
      },
      {
        name: 'Axis 4: Security & Access Control',
        items: [
          'Authentication: Valid/invalid/expired/missing credentials',
          'Authorization: Role-based access to operations and data',
          'Data protection: Sensitive data masked in responses (PII, account numbers)',
          'Transport security: TLS enforcement, certificate validation',
        ],
      },
    ],
  },
  {
    id: 'execution',
    title: '4. Execution Using SoapUI',
    color: C.orange,
    content: 'SoapUI serves as the test execution engine, but professional usage goes far beyond sending individual requests.',
    bullets: [
      'Project organization mirrors domain architecture (suites per banking module)',
      'Test steps include: SOAP Request, Property Transfer, Groovy Script, JDBC, Delay, Conditional Goto',
      'Assertion layers: Schema -> XPath -> Contains -> Script (progressively deeper validation)',
      'Data-driven testing: External data sources (Excel, CSV, JDBC) for parameterized test execution',
      'Mock services: Simulate unavailable downstream services for isolation testing',
      'Environment profiles: Switch between Dev/QA/UAT/Prod-mirror without modifying tests',
      'CI/CD integration: SoapUI tests triggered via Maven/Gradle in Jenkins/GitHub Actions pipelines',
    ],
  },
  {
    id: 'backend',
    title: '5. Backend Validation (Data Integrity Layer)',
    color: C.red,
    content: 'API response validation is necessary but insufficient. Database validation provides ground-truth verification.',
    bullets: [
      'Direct SQL queries against customer, account, and transaction tables post-API-call',
      'Referential integrity: Foreign key relationships maintained (customer -> account -> transaction)',
      'Temporal correctness: created_date, updated_date timestamps are accurate and in correct timezone',
      'Audit trail completeness: Every CUD operation has corresponding audit log entries',
      'Data type fidelity: Amounts stored with correct precision (decimal places for currency)',
      'Constraint enforcement: NOT NULL, UNIQUE, CHECK constraints honored at DB level',
      'Concurrent access: No lost updates or dirty reads under concurrent API calls',
    ],
  },
  {
    id: 'defect',
    title: '6. Defect Example (Analytical Framing)',
    color: C.yellow,
    content: 'A PhD-level tester does not just report "it does not work." They provide root cause analysis with evidence.',
    bullets: [
      'Observation: CreateAccount returns SUCCESS but GetAccountDetails returns ACCOUNT_NOT_FOUND',
      'Hypothesis 1: Asynchronous processing -- account creation is queued, not immediate',
      'Hypothesis 2: Transaction rollback -- account row was inserted but rolled back due to downstream failure',
      'Hypothesis 3: Data routing -- account created in different schema/partition than the one queried',
      'Investigation: SQL query confirms row exists in ACCOUNTS table but STATUS = "PENDING_ACTIVATION"',
      'Root cause: GetAccountDetails only queries WHERE status = "ACTIVE", missing pending accounts',
      'Impact: Any account in non-ACTIVE state is invisible to enquiry operations',
      'Fix recommendation: Modify GetAccountDetails to accept status filter parameter or return all statuses',
    ],
  },
  {
    id: 'reporting',
    title: '7. Reporting & Governance',
    color: C.purple,
    content: 'Test reporting in banking is not optional -- it is a regulatory requirement (SOX, PCI-DSS, Basel III).',
    bullets: [
      'Traceability matrix: Requirements -> Test Cases -> Defects -> Resolution',
      'Coverage metrics: Operation coverage, scenario type coverage, code path coverage',
      'Risk-based reporting: Untested scenarios weighted by business impact and probability',
      'Defect analytics: Defect injection rate, detection efficiency, escape rate',
      'Trend analysis: Sprint-over-sprint quality trends to predict release readiness',
      'Compliance artifacts: Test evidence packages for audit (screenshots, logs, DB snapshots)',
      'Stakeholder communication: Executive summary for business, detailed report for development',
    ],
  },
];

const PHD_SUMMARY_60SEC = `SOAP API testing in banking is a formal verification exercise across four axes: syntactic validity against WSDL/XSD contracts, semantic correctness of business rules and data transformations, transactional integrity ensuring ACID properties and end-to-end data consistency, and security validation covering authentication, authorization, and data protection. I structure test suites to mirror banking domain modules, use SoapUI with layered assertions from schema compliance through XPath to custom script validation, chain dependent operations via property transfers for workflow testing, and validate persistence through direct SQL against the database. When defects arise, I apply analytical framing -- forming hypotheses, gathering evidence from API responses, database state, and server logs, then isolating the root cause to contract, transformation, business logic, or persistence layer. Reporting follows regulatory governance standards with full traceability from requirements through test execution to defect resolution.`;

/* ================================================================
   DATA: TAB 3 - Customer & Account Scenarios
   ================================================================ */
const CUSTOMER_SCENARIOS = [
  { id: 'CUS-001', title: 'Create new customer (individual / business)', priority: 'P0',
    description: 'Validate CreateCustomer operation with valid individual and business customer payloads. Verify all mandatory fields, customer type differentiation, and unique customer ID generation.',
    assertion: 'XPath: //CreateCustomerResponse/CustomerId exists AND //Status = "ACTIVE"',
    details: ['Validate individual vs business customer type handling', 'Verify unique CustomerId generation pattern', 'Check all mandatory fields: name, DOB, address, ID proof', 'Validate response schema compliance'] },
  { id: 'CUS-002', title: 'Update customer details (address, phone, email)', priority: 'P0',
    description: 'Validate UpdateCustomer operation for partial updates. Ensure only specified fields change while others remain unchanged.',
    assertion: 'XPath: //UpdateCustomerResponse/Status = "SUCCESS" AND DB query confirms updated fields',
    details: ['Partial update: only changed fields should be modified', 'Verify updated_date and updated_by audit fields', 'Validate email/phone format enforcement', 'Confirm unchanged fields retain original values'] },
  { id: 'CUS-003', title: 'Fetch customer by ID', priority: 'P0',
    description: 'Validate GetCustomer operation returns complete customer profile with all linked data.',
    assertion: 'XPath: //GetCustomerResponse/Customer/CustomerId = requested ID',
    details: ['Verify all customer attributes returned', 'Check linked accounts list in response', 'Validate data masking (SSN, phone partially masked)', 'Test with valid and invalid customer IDs'] },
  { id: 'CUS-004', title: 'Search customer with filters (name, DOB, status)', priority: 'P1',
    description: 'Validate SearchCustomer operation with various filter combinations and pagination.',
    assertion: 'XPath: //SearchCustomerResponse/TotalResults > 0 AND results match filter criteria',
    details: ['Test single filter, multiple filters, no filters', 'Verify pagination (offset/limit)', 'Validate sort order (alphabetical, date)', 'Test wildcard/partial name search'] },
  { id: 'CUS-005', title: 'Duplicate customer prevention', priority: 'P0',
    description: 'Validate that the system rejects creation of duplicate customers based on unique identifiers (SSN, email, phone).',
    assertion: 'SOAP Fault: faultcode = "DUPLICATE_CUSTOMER" when duplicate detected',
    details: ['Same SSN should be rejected', 'Same email + DOB combination should be flagged', 'Verify SOAP Fault contains duplicate field details', 'DB should not have partial records from failed creation'] },
  { id: 'CUS-006', title: 'Mandatory field validation', priority: 'P0',
    description: 'Validate that missing mandatory fields result in proper validation errors with field-level details.',
    assertion: 'SOAP Fault: faultcode = "VALIDATION_ERROR" with field name in detail',
    details: ['Remove each mandatory field one at a time', 'Send empty values for mandatory fields', 'Verify error message identifies the missing field', 'Multiple missing fields should report all violations'] },
  { id: 'CUS-007', title: 'Invalid data format validation (DOB, email, SSN format)', priority: 'P0',
    description: 'Validate that invalid data formats are rejected with clear format specification in error messages.',
    assertion: 'SOAP Fault with format violation details',
    details: ['Invalid DOB: "31-02-2000", "2000/13/01", "not-a-date"', 'Invalid email: "no-at-sign", "@no-local", "spaces in@email.com"', 'Invalid SSN: "12345", "ABC-DE-FGHI", too many digits', 'Verify XSD pattern restrictions are enforced'] },
  { id: 'CUS-008', title: 'Soft delete / deactivate customer', priority: 'P1',
    description: 'Validate customer deactivation marks status as INACTIVE without deleting data.',
    assertion: 'XPath: //DeactivateCustomerResponse/Status = "INACTIVE" AND DB record preserved',
    details: ['Verify DB status changes to INACTIVE, not deleted', 'Linked accounts should be frozen/suspended', 'Deactivated customer should not appear in active search results', 'Reactivation should be possible'] },
  { id: 'CUS-009', title: 'Role-based access for customer data', priority: 'P0',
    description: 'Validate that different roles have appropriate access levels to customer data.',
    assertion: 'Admin: full access, Teller: read-only, Customer: own data only',
    details: ['Admin can CRUD all customers', 'Teller can read but not modify sensitive fields', 'Customer can only view own profile', 'Unauthorized access returns 403 SOAP Fault'] },
  { id: 'CUS-010', title: 'Audit field validation (created_by, updated_date)', priority: 'P1',
    description: 'Validate that all CUD operations properly populate audit trail fields in the database.',
    assertion: 'DB: created_by, created_date, updated_by, updated_date all populated correctly',
    details: ['created_by matches authenticated user', 'created_date matches request timestamp (within tolerance)', 'Update operations populate updated_by and updated_date', 'Audit fields are immutable after initial creation'] },
];

const ACCOUNT_SCENARIOS = [
  { id: 'ACC-001', title: 'Create savings account', priority: 'P0',
    description: 'Validate CreateAccount for savings account type with proper product code, initial deposit, and customer linkage.',
    assertion: 'XPath: //AccountNumber exists AND //AccountType = "SAVINGS" AND //Status = "ACTIVE"',
    details: ['Verify unique account number generation', 'Check initial balance matches deposit amount', 'Validate currency code assignment', 'Verify customer-account linkage in DB'] },
  { id: 'ACC-002', title: 'Create deposit account', priority: 'P0',
    description: 'Validate fixed/recurring deposit account creation with tenure, interest rate, and maturity calculations.',
    assertion: 'XPath: //AccountType = "DEPOSIT" AND //MaturityDate AND //InterestRate populated',
    details: ['Verify maturity date calculation based on tenure', 'Validate interest rate from rate master table', 'Check TDS applicability based on amount', 'Verify deposit certificate generation'] },
  { id: 'ACC-003', title: 'Fetch account details', priority: 'P0',
    description: 'Validate GetAccountDetails returns complete account information including balance, status, and linked customer.',
    assertion: 'XPath: //AccountNumber AND //Balance AND //Currency AND //Status all present',
    details: ['Verify real-time balance accuracy', 'Check account holder details included', 'Validate last transaction date', 'Test with valid and invalid account numbers'] },
  { id: 'ACC-004', title: 'Link customer to account', priority: 'P0',
    description: 'Validate LinkCustomerAccount operation for joint accounts and multi-account customers.',
    assertion: 'XPath: //LinkStatus = "SUCCESS" AND DB junction table updated',
    details: ['Primary vs secondary account holder roles', 'Maximum linked customers per account enforcement', 'Duplicate linkage prevention', 'Verify bidirectional navigation (customer -> accounts, account -> customers)'] },
  { id: 'ACC-005', title: 'Account status transition (Active -> Suspended -> Closed)', priority: 'P0',
    description: 'Validate allowed state transitions and rejection of invalid transitions.',
    assertion: 'Valid transitions succeed; invalid transitions return SOAP Fault with "INVALID_TRANSITION"',
    details: ['Active -> Suspended (compliance hold)', 'Suspended -> Active (compliance cleared)', 'Active -> Closed (customer request, zero balance)', 'Invalid: Closed -> Active should be rejected', 'Verify status history maintained in audit table'] },
  { id: 'ACC-006', title: 'Minimum balance validation', priority: 'P0',
    description: 'Validate that operations which would breach minimum balance are rejected.',
    assertion: 'SOAP Fault: faultcode = "MINIMUM_BALANCE_BREACH" with current and minimum amounts',
    details: ['Withdrawal that drops below minimum balance', 'Different minimum balance per account type', 'Verify balance check is atomic (no race conditions)', 'Fee deduction should not breach minimum balance'] },
  { id: 'ACC-007', title: 'Invalid currency handling', priority: 'P1',
    description: 'Validate rejection of invalid or unsupported currency codes.',
    assertion: 'SOAP Fault: faultcode = "INVALID_CURRENCY" for unsupported codes',
    details: ['Test with invalid ISO 4217 codes', 'Test with unsupported but valid codes (e.g., crypto)', 'Verify currency validation against master table', 'Multi-currency account handling'] },
  { id: 'ACC-008', title: 'Duplicate account prevention', priority: 'P0',
    description: 'Validate that duplicate account creation for same customer and product is prevented.',
    assertion: 'SOAP Fault: faultcode = "DUPLICATE_ACCOUNT" when same customer+product combo exists',
    details: ['Same customer + same product type = rejected', 'Same customer + different product type = allowed', 'Verify idempotency key handling', 'DB should not have partial records from rejected creation'] },
  { id: 'ACC-009', title: 'Account search with pagination', priority: 'P1',
    description: 'Validate account search with filters, sorting, and proper pagination.',
    assertion: 'XPath: //TotalResults correct AND //PageSize matches request AND results are filtered',
    details: ['Test pagination with offset and limit', 'Verify total count accuracy across pages', 'Filter by status, type, branch, customer', 'Sort by balance, creation date, account number'] },
  { id: 'ACC-010', title: 'Account not found handling (404 scenario)', priority: 'P0',
    description: 'Validate proper error handling when querying non-existent accounts.',
    assertion: 'SOAP Fault: faultcode = "ACCOUNT_NOT_FOUND" with requested account number in detail',
    details: ['Valid format but non-existent account number', 'Invalid account number format', 'Deleted/closed account lookup behavior', 'Verify no information leakage in error response'] },
];

/* ================================================================
   DATA: TAB 4 - Transaction Scenarios
   ================================================================ */
const TRANSACTION_SCENARIOS = [
  { id: 'TXN-001', title: 'Deposit transaction', priority: 'P0',
    description: 'Validate successful deposit posting with balance update, transaction record creation, and receipt generation.',
    assertion: 'XPath: //TransactionStatus = "SUCCESS" AND //NewBalance = OldBalance + DepositAmount',
    details: ['Verify balance updated atomically', 'Transaction record created with unique reference', 'Audit trail includes depositor details', 'Interest accrual trigger after deposit'],
    testData: { amount: '50000.00', currency: 'INR', accountNo: 'ACC-001', txnType: 'DEPOSIT' } },
  { id: 'TXN-002', title: 'Withdrawal transaction', priority: 'P0',
    description: 'Validate withdrawal with balance check, minimum balance enforcement, and daily limit validation.',
    assertion: 'XPath: //TransactionStatus = "SUCCESS" AND //NewBalance = OldBalance - WithdrawalAmount',
    details: ['Balance check before debit', 'Minimum balance enforcement', 'Daily withdrawal limit check', 'Insufficient balance returns proper SOAP Fault'],
    testData: { amount: '10000.00', currency: 'INR', accountNo: 'ACC-001', txnType: 'WITHDRAWAL' } },
  { id: 'TXN-003', title: 'Fund transfer between accounts', priority: 'P0',
    description: 'Validate debit-credit pair with atomicity. Both or neither should succeed.',
    assertion: 'Debit account balance decreases AND credit account balance increases by exact amount',
    details: ['Atomic debit-credit (both or neither)', 'Cross-currency transfer with exchange rate', 'Same-bank vs inter-bank transfer handling', 'Transfer fee calculation and deduction'],
    testData: { amount: '25000.00', fromAccount: 'ACC-001', toAccount: 'ACC-002', mode: 'NEFT' } },
  { id: 'TXN-004', title: 'Transaction history retrieval', priority: 'P0',
    description: 'Validate GetTransactionHistory with date range filtering, pagination, and proper sorting.',
    assertion: 'XPath: //Transactions sorted by date DESC AND //TotalCount matches filter',
    details: ['Date range filtering (from/to)', 'Transaction type filtering (debit/credit/all)', 'Pagination with consistent results', 'Amount range filtering'],
    testData: { accountNo: 'ACC-001', fromDate: '2026-01-01', toDate: '2026-02-26', limit: '50' } },
  { id: 'TXN-005', title: 'Insufficient balance validation', priority: 'P0',
    description: 'Validate that transactions exceeding available balance are rejected with clear error details.',
    assertion: 'SOAP Fault: faultcode = "INSUFFICIENT_BALANCE" with available and requested amounts',
    details: ['Available balance vs requested amount in error', 'No partial debit should occur', 'Account balance unchanged after rejection', 'Verify DB state is clean (no pending records)'],
    testData: { amount: '999999.00', accountNo: 'ACC-001', currentBalance: '50000.00' } },
  { id: 'TXN-006', title: 'Double transaction prevention (idempotency)', priority: 'P0',
    description: 'Validate that submitting the same transaction twice does not result in duplicate processing.',
    assertion: 'Second request returns same reference number, balance debited only once',
    details: ['Same idempotency key returns cached response', 'Balance should not be debited twice', 'Transaction table should have single entry', 'Idempotency window expiry behavior'],
    testData: { idempotencyKey: 'IDEM-001', amount: '5000.00', accountNo: 'ACC-001' } },
  { id: 'TXN-007', title: 'Invalid account number handling', priority: 'P0',
    description: 'Validate proper error handling for transactions targeting non-existent or closed accounts.',
    assertion: 'SOAP Fault: faultcode = "INVALID_ACCOUNT" with descriptive message',
    details: ['Non-existent account number', 'Closed account (no transactions allowed)', 'Suspended account (restricted operations)', 'Malformed account number format'],
    testData: { accountNo: 'INVALID-999', amount: '1000.00' } },
  { id: 'TXN-008', title: 'Transaction reversal', priority: 'P0',
    description: 'Validate reversal of a previously posted transaction with balance restoration and audit trail.',
    assertion: 'XPath: //ReversalStatus = "SUCCESS" AND balance restored to pre-transaction value',
    details: ['Original transaction must exist and be reversible', 'Balance restored to pre-transaction state', 'Reversal creates new transaction record linked to original', 'Time window for reversal enforcement'],
    testData: { originalRef: 'TXN-REF-001', reversalReason: 'Customer dispute' } },
  { id: 'TXN-009', title: 'Concurrent transaction handling', priority: 'P0',
    description: 'Validate system behavior when multiple transactions hit the same account simultaneously.',
    assertion: 'No lost updates, no dirty reads, final balance is mathematically correct',
    details: ['Two deposits at the same time', 'Deposit and withdrawal at the same time', 'Balance consistency after concurrent operations', 'Deadlock detection and recovery'],
    testData: { concurrentRequests: 5, accountNo: 'ACC-001', amountEach: '1000.00' } },
  { id: 'TXN-010', title: 'Transaction limit validation', priority: 'P0',
    description: 'Validate per-transaction, daily, and monthly transaction limits are enforced.',
    assertion: 'SOAP Fault: faultcode = "LIMIT_EXCEEDED" with limit type and current usage',
    details: ['Per-transaction maximum amount', 'Daily cumulative limit', 'Monthly cumulative limit', 'Different limits by transaction type (NEFT/RTGS/IMPS)'],
    testData: { perTxnLimit: '200000', dailyLimit: '500000', monthlyLimit: '5000000' } },
];

/* ================================================================
   DATA: TAB 5 - Security & Auth Scenarios
   ================================================================ */
const SECURITY_SCENARIOS = [
  { id: 'SEC-001', title: 'Valid token access', priority: 'P0',
    description: 'Validate that requests with a valid, non-expired authentication token are processed successfully.',
    assertion: 'HTTP 200 + valid SOAP response when valid Bearer token provided',
    details: ['Valid JWT/OAuth token in Authorization header', 'WS-Security UsernameToken validation', 'Token claims match requested operation scope', 'Successful response with full data access'] },
  { id: 'SEC-002', title: 'Expired token handling', priority: 'P0',
    description: 'Validate that expired tokens are rejected with proper error code and message guiding re-authentication.',
    assertion: 'SOAP Fault: faultcode = "TOKEN_EXPIRED" with expiry timestamp',
    details: ['Token past expiry time rejected', 'Response includes "re-authenticate" guidance', 'No partial data returned with expired token', 'Refresh token flow for automated token renewal'] },
  { id: 'SEC-003', title: 'Missing token', priority: 'P0',
    description: 'Validate that requests without any authentication token receive clear 401-equivalent SOAP Fault.',
    assertion: 'SOAP Fault: faultcode = "AUTHENTICATION_REQUIRED" (HTTP 401)',
    details: ['No Authorization header', 'Empty Authorization header value', 'Malformed header format', 'Clear error message indicating auth requirement'] },
  { id: 'SEC-004', title: 'Invalid signature', priority: 'P0',
    description: 'Validate that tampered or incorrectly signed tokens/messages are rejected.',
    assertion: 'SOAP Fault: faultcode = "INVALID_SIGNATURE" (HTTP 401)',
    details: ['Modified JWT payload with original signature', 'Wrong signing key used', 'Truncated or corrupted token', 'Replay of token from different environment'] },
  { id: 'SEC-005', title: 'Role-based access (Admin vs Teller vs Customer)', priority: 'P0',
    description: 'Validate that each role can only access operations and data appropriate to their privilege level.',
    assertion: 'Admin: all ops, Teller: operational ops, Customer: read-only own data',
    details: ['Admin can access all CRUD operations', 'Teller can create transactions but not modify customer master data', 'Customer can only view own account details', 'Each role tested against every operation'] },
  { id: 'SEC-006', title: 'Unauthorized endpoint access (403)', priority: 'P0',
    description: 'Validate that authenticated users without proper role receive 403 Forbidden for restricted operations.',
    assertion: 'SOAP Fault: faultcode = "ACCESS_DENIED" (HTTP 403) with operation name',
    details: ['Customer role calling admin-only operations', 'Teller role calling delete operations', 'Horizontal escalation: accessing another customers data', 'Verify no data leakage in 403 response'] },
  { id: 'SEC-007', title: 'Data masking validation', priority: 'P0',
    description: 'Validate that sensitive data (SSN, card numbers, passwords) is masked in API responses.',
    assertion: 'Response contains masked values: SSN = ***-**-1234, CardNo = ****-****-****-5678',
    details: ['SSN: only last 4 digits visible', 'Card number: only last 4 digits visible (PCI-DSS)', 'Phone: partially masked', 'Email: local part partially masked', 'Masking applied regardless of requester role'] },
  { id: 'SEC-008', title: 'API rate limit validation', priority: 'P1',
    description: 'Validate that excessive requests from a single source are throttled with proper 429 response.',
    assertion: 'After N requests in window, SOAP Fault with "RATE_LIMIT_EXCEEDED" and Retry-After header',
    details: ['Per-IP rate limiting on public endpoints', 'Per-user rate limiting on authenticated endpoints', 'Verify Retry-After header value', 'Rate limit reset after window expires'] },
  { id: 'SEC-009', title: 'Session timeout validation', priority: 'P1',
    description: 'Validate that inactive sessions expire after the configured timeout period.',
    assertion: 'After timeout period, next request returns "SESSION_EXPIRED" fault',
    details: ['Session expires after 15-30 minutes of inactivity', 'Active session extends timeout on each request', 'Expired session requires re-authentication', 'Concurrent session limit enforcement'] },
  { id: 'SEC-010', title: 'Multi-factor auth validation', priority: 'P1',
    description: 'Validate MFA flow for high-value transactions and sensitive operations.',
    assertion: 'High-value transactions require OTP/MFA step before processing',
    details: ['Transactions above threshold trigger MFA', 'Invalid OTP rejected with limited retries', 'OTP expiry enforcement', 'MFA bypass attempt detection and logging'] },
];

/* ================================================================
   DATA: TAB 6 - DB Validation Scenarios
   ================================================================ */
const DB_SCENARIOS = [
  { id: 'DB-001', title: 'Verify record creation in DB', priority: 'P0',
    description: 'After a successful API call, verify the corresponding record exists in the database with correct field values.',
    assertion: 'SQL: SELECT * FROM table WHERE id = ? returns exactly 1 row with matching data',
    details: ['Execute CreateCustomer API, then query customers table', 'All request fields match stored values', 'System-generated fields populated (ID, dates, version)', 'No extra/ghost records created'],
    sql: 'SELECT customer_id, name, email, status, created_date FROM customers WHERE customer_id = ?' },
  { id: 'DB-002', title: 'Foreign key relationship validation', priority: 'P0',
    description: 'Validate that parent-child relationships are maintained correctly across tables.',
    assertion: 'SQL: JOIN queries return consistent linked records; no orphan references',
    details: ['Customer -> customer_accounts -> accounts chain', 'Transaction -> account relationship', 'No orphan records in child tables', 'Cascade behavior on parent updates'],
    sql: 'SELECT c.customer_id, a.account_number FROM customers c JOIN customer_accounts ca ON c.customer_id = ca.customer_id JOIN accounts a ON ca.account_number = a.account_number' },
  { id: 'DB-003', title: 'No duplicate primary keys', priority: 'P0',
    description: 'Validate that the system never creates duplicate primary keys even under concurrent operations.',
    assertion: 'SQL: SELECT id, COUNT(*) FROM table GROUP BY id HAVING COUNT(*) > 1 returns 0 rows',
    details: ['Run concurrent create operations', 'Verify unique constraint enforcement', 'Check sequence/auto-increment behavior', 'No gaps in ID sequence under normal operation'],
    sql: 'SELECT customer_id, COUNT(*) AS cnt FROM customers GROUP BY customer_id HAVING cnt > 1' },
  { id: 'DB-004', title: 'Audit field validation', priority: 'P0',
    description: 'Validate that every CUD operation populates audit fields correctly.',
    assertion: 'DB: created_by, created_date, updated_by, updated_date are correct and non-null',
    details: ['created_by matches the authenticated user from the API request', 'created_date is within 1 second of request timestamp', 'Update operations change updated_by and updated_date', 'created_by and created_date are immutable after INSERT'],
    sql: 'SELECT created_by, created_date, updated_by, updated_date FROM customers WHERE customer_id = ?' },
  { id: 'DB-005', title: 'Status flag validation', priority: 'P0',
    description: 'Validate that status fields contain only valid enumeration values and transitions are logged.',
    assertion: 'SQL: All status values are within allowed enum set; transition history is traceable',
    details: ['Customer status: ACTIVE, INACTIVE, SUSPENDED, CLOSED', 'Account status: ACTIVE, DORMANT, FROZEN, CLOSED', 'Transaction status: SUCCESS, FAILED, PENDING, REVERSED', 'No invalid/null status values in production data'],
    sql: 'SELECT status, COUNT(*) FROM accounts GROUP BY status' },
  { id: 'DB-006', title: 'Correct mapping of request fields', priority: 'P0',
    description: 'Validate that every field in the API request is correctly mapped to the corresponding database column.',
    assertion: 'Every request field value matches the stored DB value exactly (no truncation, no transformation error)',
    details: ['String fields: exact match (case-sensitive)', 'Numeric fields: precision preserved (decimal places)', 'Date fields: timezone conversion handled correctly', 'Enum fields: API value maps to correct DB code'],
    sql: 'SELECT name, email, phone, dob, address FROM customers WHERE customer_id = ?' },
  { id: 'DB-007', title: 'Null constraint validation', priority: 'P0',
    description: 'Validate that NOT NULL constraints are enforced at the database level, not just API level.',
    assertion: 'Attempt to bypass API validation with direct DB check; NOT NULL columns reject nulls',
    details: ['Mandatory fields defined as NOT NULL in schema', 'API validation should catch before DB constraint', 'If API bypass occurs, DB constraint is safety net', 'Verify error handling for constraint violations'],
    sql: 'SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = ?' },
  { id: 'DB-008', title: 'Data rollback validation on failure', priority: 'P0',
    description: 'Validate that when an API operation fails mid-way, all partial data changes are rolled back.',
    assertion: 'DB state is identical before and after a failed API call (no orphan/partial records)',
    details: ['Force failure during multi-step operation', 'Verify no partial records exist', 'Account balance unchanged after failed transfer', 'Transaction table has no PENDING records from failed ops'],
    sql: 'SELECT COUNT(*) FROM transactions WHERE status = "PENDING" AND account_number = ?' },
  { id: 'DB-009', title: 'Transaction commit validation', priority: 'P0',
    description: 'Validate that successful operations are durably committed and visible to subsequent queries.',
    assertion: 'Immediately after SUCCESS response, DB query returns the committed data',
    details: ['No read-after-write inconsistency', 'Transaction isolation level appropriate', 'Committed data survives server restart', 'Read replicas reflect committed data within SLA'],
    sql: 'SELECT * FROM transactions WHERE ref_number = ? AND status = "SUCCESS"' },
  { id: 'DB-010', title: 'Data consistency across tables', priority: 'P0',
    description: 'Validate that data is consistent across all related tables after a complex operation.',
    assertion: 'SQL: Cross-table joins show consistent data; no conflicting values between tables',
    details: ['Account balance matches sum of transactions', 'Customer status consistent with account statuses', 'Transaction debit/credit pairs balance to zero', 'Aggregate views match detail records'],
    sql: 'SELECT a.balance, SUM(CASE WHEN t.type="CREDIT" THEN t.amount ELSE -t.amount END) AS calc_balance FROM accounts a JOIN transactions t ON a.account_number = t.account_number GROUP BY a.account_number HAVING a.balance != calc_balance' },
];

/* ================================================================
   DATA: TAB 7 - Negative & Edge Cases
   ================================================================ */
const NEGATIVE_SCENARIOS = [
  { id: 'NEG-001', title: 'Missing required fields', priority: 'P0',
    description: 'Send requests with mandatory fields removed. Validate proper SOAP Fault with field-level error details.' },
  { id: 'NEG-002', title: 'Invalid XML structure', priority: 'P0',
    description: 'Send malformed XML (unclosed tags, invalid encoding, wrong namespace). Validate graceful error handling.' },
  { id: 'NEG-003', title: 'Large payload handling', priority: 'P1',
    description: 'Send oversized XML payloads exceeding server limits. Validate rejection with payload-too-large error.' },
  { id: 'NEG-004', title: 'Boundary value testing', priority: 'P0',
    description: 'Test minimum, maximum, and just-beyond boundary values for numeric fields (amounts, IDs, dates).' },
  { id: 'NEG-005', title: 'Invalid enum values', priority: 'P0',
    description: 'Send values outside defined enumerations (e.g., accountType="INVALID"). Validate XSD restriction enforcement.' },
  { id: 'NEG-006', title: 'Special characters handling', priority: 'P1',
    description: 'Test with unicode, emoji, XML special characters (&, <, >), and null bytes in text fields.' },
  { id: 'NEG-007', title: 'SQL injection attempt', priority: 'P0',
    description: 'Embed SQL injection payloads in request fields. Validate parameterized query protection.' },
  { id: 'NEG-008', title: 'Invalid HTTP method', priority: 'P1',
    description: 'Send GET/PUT/DELETE to SOAP endpoint (expects POST). Validate 405 Method Not Allowed response.' },
  { id: 'NEG-009', title: 'Timeout handling', priority: 'P0',
    description: 'Simulate slow backend processing. Validate client receives timeout error within SLA.' },
  { id: 'NEG-010', title: 'Server crash simulation', priority: 'P1',
    description: 'Test behavior when backend service is down. Validate proper SOAP Fault or HTTP 503.' },
];

const INTEGRATION_SCENARIOS = [
  { id: 'INT-001', title: 'Downstream system failure handling', priority: 'P0',
    description: 'When a dependent service is unavailable, validate graceful degradation with proper error response.' },
  { id: 'INT-002', title: 'Retry mechanism validation', priority: 'P0',
    description: 'Validate automatic retry behavior for transient failures (network timeout, 503). Check retry count and backoff.' },
  { id: 'INT-003', title: 'Asynchronous API validation', priority: 'P1',
    description: 'For async operations, validate request acceptance (202), polling mechanism, and final result delivery.' },
  { id: 'INT-004', title: 'Message queue validation', priority: 'P1',
    description: 'Validate that SOAP requests trigger correct messages on JMS/MQ queues for downstream processing.' },
  { id: 'INT-005', title: 'Partial failure handling', priority: 'P0',
    description: 'In batch operations, validate that individual item failures do not fail the entire batch.' },
  { id: 'INT-006', title: 'Version compatibility testing', priority: 'P1',
    description: 'Test requests against multiple WSDL versions. Validate backward compatibility.' },
  { id: 'INT-007', title: 'Backward compatibility validation', priority: 'P0',
    description: 'Old clients with previous WSDL version should still work against updated service.' },
  { id: 'INT-008', title: 'Error code consistency check', priority: 'P1',
    description: 'Validate that same error condition returns consistent fault code across all operations.' },
  { id: 'INT-009', title: 'Logging validation', priority: 'P1',
    description: 'Validate that server logs contain correlation IDs, timestamps, and request/response details for every call.' },
  { id: 'INT-010', title: 'Monitoring alert trigger validation', priority: 'P2',
    description: 'Validate that error thresholds trigger monitoring alerts (e.g., 5xx spike triggers PagerDuty).' },
];

const PERFORMANCE_SCENARIOS = [
  { id: 'PRF-001', title: 'Load testing of transaction API', priority: 'P0',
    description: 'Simulate 500+ concurrent transaction requests. Validate response time and throughput under load.' },
  { id: 'PRF-002', title: 'Stress testing under peak load', priority: 'P0',
    description: 'Push system beyond expected capacity to find breaking point. Document degradation pattern.' },
  { id: 'PRF-003', title: 'Response time validation', priority: 'P0',
    description: 'Validate that all API operations respond within defined SLA (e.g., < 2s for queries, < 5s for transactions).' },
  { id: 'PRF-004', title: 'Throughput measurement', priority: 'P1',
    description: 'Measure maximum transactions per second (TPS) the system can sustain without errors.' },
  { id: 'PRF-005', title: 'Concurrent user simulation', priority: 'P0',
    description: 'Simulate realistic user behavior patterns with mixed operation types under concurrent load.' },
  { id: 'PRF-006', title: 'Rate limiting behavior', priority: 'P1',
    description: 'Validate that rate limiting engages correctly and does not block legitimate traffic.' },
  { id: 'PRF-007', title: 'Memory leak detection', priority: 'P1',
    description: 'Run sustained load for extended period. Monitor server memory for gradual increase indicating leaks.' },
  { id: 'PRF-008', title: 'Timeout configuration validation', priority: 'P0',
    description: 'Validate that connection, read, and write timeouts are configured correctly across all service calls.' },
  { id: 'PRF-009', title: 'Bulk transaction processing', priority: 'P1',
    description: 'Submit batch of 10,000+ transactions. Validate processing time, error handling, and data integrity.' },
  { id: 'PRF-010', title: 'Failover testing', priority: 'P0',
    description: 'Simulate primary server failure. Validate automatic failover to secondary with no data loss.' },
];

/* ================================================================
   DATA: TAB 8 - Quick Reference
   ================================================================ */
const TOP_10_SCENARIOS = [
  { id: 1, title: 'Customer creation validation', category: 'Customer',
    summary: 'Validate CreateCustomer with valid data, check response schema, verify DB record, test duplicate prevention.' },
  { id: 2, title: 'Account creation validation', category: 'Account',
    summary: 'Validate CreateAccount linked to customer, verify account number generation, initial balance, product code mapping.' },
  { id: 3, title: 'Deposit transaction', category: 'Transaction',
    summary: 'Validate Deposit posting, balance update, transaction record, receipt generation, and audit trail.' },
  { id: 4, title: 'Insufficient balance case', category: 'Transaction',
    summary: 'Validate withdrawal/transfer rejection when balance is insufficient. Verify SOAP Fault details and unchanged balance.' },
  { id: 5, title: 'Token validation', category: 'Security',
    summary: 'Test valid, expired, missing, and tampered tokens. Verify 200/401/403 responses appropriately.' },
  { id: 6, title: 'Role-based access testing', category: 'Security',
    summary: 'Test Admin/Teller/Customer roles against all operations. Verify each role only accesses permitted operations.' },
  { id: 7, title: 'Duplicate prevention', category: 'Business Rule',
    summary: 'Test duplicate customer, duplicate account, and double transaction submission. Verify idempotency handling.' },
  { id: 8, title: 'DB verification with SQL', category: 'Database',
    summary: 'After every API call, verify data in DB matches API response. Check foreign keys, audit fields, status flags.' },
  { id: 9, title: '500 error root cause analysis', category: 'Error Handling',
    summary: 'When 500 occurs: check server logs, reproduce with minimal payload, isolate layer (contract/logic/DB), document evidence.' },
  { id: 10, title: 'Idempotency testing', category: 'Reliability',
    summary: 'Submit same request twice with same idempotency key. Verify single record created, same response returned.' },
];

const SOAP_ASSERTIONS_CHEATSHEET = [
  { assertion: 'Schema Compliance', usage: 'Validates response XML against WSDL/XSD schema', when: 'Every response' },
  { assertion: 'XPath Match', usage: '//element/text() = "expected"', when: 'Specific field validation' },
  { assertion: 'XQuery Match', usage: 'Complex XML queries with conditions', when: 'Multi-field validation' },
  { assertion: 'Contains', usage: 'Response body contains "SUCCESS"', when: 'Quick string check' },
  { assertion: 'Not Contains', usage: 'Response must NOT contain "ERROR"', when: 'Negative validation' },
  { assertion: 'SOAP Fault', usage: 'Validates SOAP Fault structure', when: 'Error scenario testing' },
  { assertion: 'Response SLA', usage: 'Response time < 2000ms', when: 'Performance validation' },
  { assertion: 'Script Assertion', usage: 'Custom Groovy validation logic', when: 'Complex rules' },
  { assertion: 'Valid HTTP Status', usage: 'HTTP 200, 201, etc.', when: 'Status code check' },
  { assertion: 'JsonPath Match', usage: '$.status = "OK" (for REST)', when: 'JSON response validation' },
];

const SOAPUI_SHORTCUTS = [
  { shortcut: 'Ctrl+Enter', action: 'Submit/Run request' },
  { shortcut: 'Ctrl+Shift+R', action: 'Run TestSuite' },
  { shortcut: 'Ctrl+R', action: 'Run TestCase' },
  { shortcut: 'Ctrl+Alt+L', action: 'Launch LoadTest' },
  { shortcut: 'Ctrl+N', action: 'New TestCase' },
  { shortcut: 'Ctrl+T', action: 'Add TestStep' },
  { shortcut: 'Ctrl+Shift+A', action: 'Add Assertion' },
  { shortcut: 'Alt+Enter', action: 'Toggle XML editor mode' },
  { shortcut: 'Ctrl+Shift+C', action: 'Clone TestCase' },
  { shortcut: 'F9', action: 'Run selected TestStep' },
];

const BANKING_STATUS_CODES = [
  { code: '000', meaning: 'Transaction successful' },
  { code: '001', meaning: 'Customer created successfully' },
  { code: '100', meaning: 'Validation error - missing mandatory field' },
  { code: '101', meaning: 'Invalid data format' },
  { code: '200', meaning: 'Account not found' },
  { code: '201', meaning: 'Customer not found' },
  { code: '300', meaning: 'Insufficient balance' },
  { code: '301', meaning: 'Transaction limit exceeded' },
  { code: '400', meaning: 'Authentication failed' },
  { code: '401', meaning: 'Authorization denied' },
  { code: '500', meaning: 'Internal server error' },
  { code: '501', meaning: 'Downstream service unavailable' },
  { code: '600', meaning: 'Duplicate record detected' },
  { code: '601', meaning: 'Invalid state transition' },
];

const JIRA_DEFECT_TEMPLATE = {
  title: '[Module] [Operation] - Brief Description',
  fields: [
    { label: 'Summary', value: '[Customer] CreateCustomer - Duplicate SSN accepted without validation' },
    { label: 'Environment', value: 'QA Environment | Build 2.4.1 | Date: 2026-02-26' },
    { label: 'Steps to Reproduce', value: '1. Send CreateCustomer with SSN 123-45-6789\n2. Send another CreateCustomer with same SSN\n3. Observe: Second request returns SUCCESS instead of DUPLICATE_CUSTOMER fault' },
    { label: 'Expected Result', value: 'SOAP Fault with faultcode="DUPLICATE_CUSTOMER" and HTTP 409' },
    { label: 'Actual Result', value: 'HTTP 200 SUCCESS - duplicate customer created with new CustomerId' },
    { label: 'SOAP Request', value: '<soapenv:Envelope>...</soapenv:Envelope> (attach full XML)' },
    { label: 'SOAP Response', value: '<soapenv:Envelope>...</soapenv:Envelope> (attach full XML)' },
    { label: 'DB Evidence', value: 'SELECT customer_id, ssn FROM customers WHERE ssn = "123-45-6789"\nResult: 2 rows (CUST-001, CUST-002) -- DUPLICATE!' },
    { label: 'Impact', value: 'Data integrity violation. Multiple customer records with same SSN breaks uniqueness constraint and downstream KYC processes.' },
    { label: 'Severity', value: 'P0 - Critical (data integrity)' },
    { label: 'Attachments', value: 'SoapUI project export, server logs, DB screenshot' },
  ],
};


/* ================================================================
   COMPONENT
   ================================================================ */
function SoapInterviewGuide() {
  const [activeTab, setActiveTab] = useState('framework');
  const [expandedCards, setExpandedCards] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  const toggleCard = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalScenarios = CUSTOMER_SCENARIOS.length + ACCOUNT_SCENARIOS.length +
    TRANSACTION_SCENARIOS.length + SECURITY_SCENARIOS.length + DB_SCENARIOS.length +
    NEGATIVE_SCENARIOS.length + INTEGRATION_SCENARIOS.length + PERFORMANCE_SCENARIOS.length +
    TOP_10_SCENARIOS.length;

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
    timing: {
      fontSize: '11px',
      color: C.textMuted,
      fontStyle: 'italic',
    },
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
    quoteBox: {
      background: 'rgba(78, 204, 163, 0.08)',
      borderLeft: `4px solid ${C.accent}`,
      borderRadius: '0 8px 8px 0',
      padding: '14px 16px',
      marginTop: '10px',
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.6',
      fontStyle: 'italic',
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
    codeBlock: {
      background: C.inputBg,
      borderRadius: '8px',
      padding: '14px',
      marginTop: '12px',
      fontSize: '12px',
      fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
      color: C.accent,
      lineHeight: '1.6',
      overflowX: 'auto',
      border: `1px solid ${C.border}`,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
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
    scenarioCard: (priority) => ({
      background: C.card,
      borderRadius: '10px',
      padding: '14px 16px',
      marginBottom: '8px',
      border: `1px solid ${C.border}`,
      borderLeft: `4px solid ${priorityColors[priority] || C.blue}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
    scenarioTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: C.text,
      marginBottom: '4px',
    },
    scenarioDescription: {
      fontSize: '12px',
      color: C.textMuted,
      lineHeight: '1.5',
      marginBottom: '8px',
    },
    assertionBox: {
      background: 'rgba(52, 152, 219, 0.1)',
      borderRadius: '6px',
      padding: '8px 12px',
      fontSize: '12px',
      fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
      color: C.blue,
      marginBottom: '8px',
    },
    badge: (color) => ({
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '700',
      background: `${color}22`,
      color: color,
      border: `1px solid ${color}44`,
      textTransform: 'uppercase',
      marginRight: '6px',
    }),
    sectionHeader: {
      fontSize: '18px',
      fontWeight: '700',
      color: C.accent,
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: `2px solid ${C.accent}33`,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    sectionCount: {
      fontSize: '12px',
      fontWeight: '600',
      color: C.textMuted,
      background: 'rgba(255,255,255,0.08)',
      padding: '2px 8px',
      borderRadius: '12px',
    },
    subsectionTitle: (color) => ({
      fontSize: '14px',
      fontWeight: '700',
      color: color || C.accent,
      marginBottom: '8px',
      marginTop: '12px',
    }),
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px',
      marginTop: '8px',
    },
    th: {
      textAlign: 'left',
      padding: '8px 12px',
      background: 'rgba(52, 152, 219, 0.15)',
      color: C.blue,
      fontWeight: '600',
      borderBottom: `1px solid ${C.border}`,
    },
    td: {
      padding: '8px 12px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      color: C.textMuted,
      verticalAlign: 'top',
    },
    gridTwo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '12px',
    },
    topScenarioCard: {
      background: C.card,
      borderRadius: '10px',
      padding: '16px',
      border: `1px solid ${C.border}`,
      display: 'flex',
      gap: '14px',
      alignItems: 'flex-start',
    },
    topScenarioNumber: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
      color: '#fff',
      fontSize: '16px',
      fontWeight: '800',
      flexShrink: 0,
    },
    detailList: {
      listStyle: 'none',
      padding: 0,
      margin: '8px 0 0 0',
    },
    detailItem: {
      padding: '3px 0 3px 16px',
      position: 'relative',
      fontSize: '12px',
      color: C.textMuted,
      lineHeight: '1.5',
    },
    sqlBox: {
      background: C.inputBg,
      borderRadius: '6px',
      padding: '10px 12px',
      marginTop: '8px',
      fontSize: '11px',
      fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
      color: C.yellow,
      lineHeight: '1.5',
      overflowX: 'auto',
      border: `1px solid ${C.border}`,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    tabContentHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
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
  };

  // Bullet with colored dot
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
     RENDER: TAB 1 - 10-Step Framework
     ================================================================ */
  const renderFrameworkTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>F</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            The Master 10-Step Answer Framework
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            A structured approach to answering "How did you test SOAP APIs in banking?" -- {FRAMEWORK_STEPS.length} steps
          </p>
        </div>
      </div>

      {FRAMEWORK_STEPS.map((step) => {
        const isExpanded = expandedCards[`step-${step.step}`];
        return (
          <div
            key={step.step}
            style={styles.cardClickable(isExpanded)}
            onClick={() => toggleCard(`step-${step.step}`)}
          >
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={styles.stepNumber(step.color)}>{step.step}</span>
                <div>
                  <p style={styles.cardTitle}>{step.title}</p>
                  <p style={styles.timing}>{step.timing}</p>
                </div>
              </div>
              <span style={styles.expandArrow(isExpanded)}>{'\u25BC'}</span>
            </div>

            {isExpanded && (
              <div style={styles.expandedContent} onClick={(e) => e.stopPropagation()}>
                <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 10px 0', lineHeight: '1.5' }}>
                  {step.content}
                </p>

                {step.quote && (
                  <div style={styles.quoteBox}>
                    "{step.quote}"
                  </div>
                )}

                <ul style={styles.bulletList}>
                  {step.bullets.map((bullet, i) => (
                    <li key={i} style={styles.bulletItem}>
                      <BulletDot color={step.color} />
                      {bullet}
                    </li>
                  ))}
                </ul>

                {step.codeSnippet && (
                  <div style={styles.codeBlock}>{step.codeSnippet}</div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* 90-Second Best Answer */}
      <div style={styles.bestAnswerBox}>
        <div style={styles.bestAnswerTitle}>
          <span style={{ fontSize: '20px' }}>*</span>
          90-Second Best Answer (Rehearsal Script)
        </div>
        <p style={styles.bestAnswerText}>{BEST_ANSWER_90SEC}</p>
      </div>
    </div>
  );

  /* ================================================================
     RENDER: TAB 2 - PhD-Level Explanation
     ================================================================ */
  const renderPhdTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>P</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            PhD-Level Explanation
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            Advanced architectural answer for senior/lead QA positions -- {PHD_SECTIONS.length} sections
          </p>
        </div>
      </div>

      {PHD_SECTIONS.map((section) => {
        const isExpanded = expandedCards[`phd-${section.id}`];
        return (
          <div
            key={section.id}
            style={styles.cardClickable(isExpanded)}
            onClick={() => toggleCard(`phd-${section.id}`)}
          >
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={styles.stepNumber(section.color)}>
                  {section.title.charAt(0)}
                </span>
                <p style={styles.cardTitle}>{section.title}</p>
              </div>
              <span style={styles.expandArrow(isExpanded)}>{'\u25BC'}</span>
            </div>

            {isExpanded && (
              <div style={styles.expandedContent} onClick={(e) => e.stopPropagation()}>
                <p style={{ fontSize: '13px', color: C.textMuted, margin: '0 0 10px 0', lineHeight: '1.6' }}>
                  {section.content}
                </p>

                {section.bullets && (
                  <ul style={styles.bulletList}>
                    {section.bullets.map((bullet, i) => (
                      <li key={i} style={styles.bulletItem}>
                        <BulletDot color={section.color} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections && section.subsections.map((sub, idx) => (
                  <div key={idx} style={{ marginTop: '14px' }}>
                    <p style={styles.subsectionTitle(section.color)}>
                      {sub.name}
                    </p>
                    <ul style={styles.bulletList}>
                      {sub.items.map((item, i) => (
                        <li key={i} style={styles.bulletItem}>
                          <BulletDot color={section.color} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* 60-Second PhD Summary */}
      <div style={styles.bestAnswerBox}>
        <div style={styles.bestAnswerTitle}>
          <span style={{ fontSize: '20px' }}>*</span>
          60-Second PhD-Level Summary
        </div>
        <p style={styles.bestAnswerText}>{PHD_SUMMARY_60SEC}</p>
      </div>
    </div>
  );

  /* ================================================================
     RENDER: Scenario Card (reusable)
     ================================================================ */
  const renderScenarioCard = (scenario, prefix) => {
    const isExpanded = expandedCards[`${prefix}-${scenario.id}`];
    return (
      <div
        key={scenario.id}
        style={{
          ...styles.scenarioCard(scenario.priority),
          borderLeftColor: isExpanded ? C.accent : (priorityColors[scenario.priority] || C.blue),
          background: isExpanded ? C.cardLight : C.card,
        }}
        onClick={() => toggleCard(`${prefix}-${scenario.id}`)}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <span style={{ fontSize: '11px', color: C.textMuted, fontFamily: 'monospace', minWidth: '60px' }}>{scenario.id}</span>
            <span style={styles.scenarioTitle}>{scenario.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span style={styles.badge(priorityColors[scenario.priority])}>{scenario.priority}</span>
            <span style={styles.expandArrow(isExpanded)}>{'\u25BC'}</span>
          </div>
        </div>

        {isExpanded && (
          <div style={styles.expandedContent} onClick={(e) => e.stopPropagation()}>
            <p style={styles.scenarioDescription}>{scenario.description}</p>

            {scenario.assertion && (
              <div style={styles.assertionBox}>
                <span style={{ fontWeight: '700', color: C.accent, marginRight: '8px' }}>Assertion:</span>
                {scenario.assertion}
              </div>
            )}

            {scenario.details && (
              <ul style={styles.detailList}>
                {scenario.details.map((detail, i) => (
                  <li key={i} style={styles.detailItem}>
                    <BulletDot color={C.accent} />
                    {detail}
                  </li>
                ))}
              </ul>
            )}

            {scenario.testData && (
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: C.orange, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Test Data
                </span>
                <table style={styles.table}>
                  <tbody>
                    {Object.entries(scenario.testData).map(([key, val]) => (
                      <tr key={key}>
                        <td style={{ ...styles.td, color: C.blue, fontWeight: '600', width: '140px' }}>{key}</td>
                        <td style={styles.td}>{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {scenario.sql && (
              <div style={styles.sqlBox}>{scenario.sql}</div>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ================================================================
     RENDER: Simple Scenario Card (for negative/integration/perf)
     ================================================================ */
  const renderSimpleScenarioCard = (scenario, prefix) => {
    const isExpanded = expandedCards[`${prefix}-${scenario.id}`];
    return (
      <div
        key={scenario.id}
        style={{
          ...styles.scenarioCard('P1'),
          borderLeftColor: isExpanded ? C.accent : C.blue,
          background: isExpanded ? C.cardLight : C.card,
        }}
        onClick={() => toggleCard(`${prefix}-${scenario.id}`)}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <span style={{ fontSize: '11px', color: C.textMuted, fontFamily: 'monospace', minWidth: '60px' }}>{scenario.id}</span>
            <span style={styles.scenarioTitle}>{scenario.title}</span>
          </div>
          <span style={styles.expandArrow(isExpanded)}>{'\u25BC'}</span>
        </div>

        {isExpanded && (
          <div style={styles.expandedContent} onClick={(e) => e.stopPropagation()}>
            <p style={styles.scenarioDescription}>{scenario.description}</p>
          </div>
        )}
      </div>
    );
  };

  /* ================================================================
     RENDER: TAB 3 - Customer & Account
     ================================================================ */
  const renderCustomerTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>C</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            Customer & Account Scenarios
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            {CUSTOMER_SCENARIOS.length + ACCOUNT_SCENARIOS.length} scenarios covering customer master data and account management
          </p>
        </div>
      </div>

      {/* Customer Section */}
      <div style={styles.sectionHeader}>
        <span>Customer / Master Data</span>
        <span style={styles.sectionCount}>{CUSTOMER_SCENARIOS.length} scenarios</span>
      </div>
      {CUSTOMER_SCENARIOS.map((s) => renderScenarioCard(s, 'cust'))}

      {/* Account Section */}
      <div style={{ ...styles.sectionHeader, marginTop: '28px' }}>
        <span>Account Management</span>
        <span style={styles.sectionCount}>{ACCOUNT_SCENARIOS.length} scenarios</span>
      </div>
      {ACCOUNT_SCENARIOS.map((s) => renderScenarioCard(s, 'acc'))}
    </div>
  );

  /* ================================================================
     RENDER: TAB 4 - Transactions
     ================================================================ */
  const renderTransactionsTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>T</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            Transaction API Scenarios
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            {TRANSACTION_SCENARIOS.length} scenarios covering deposits, withdrawals, transfers, and transaction management
          </p>
        </div>
      </div>

      {TRANSACTION_SCENARIOS.map((s) => renderScenarioCard(s, 'txn'))}
    </div>
  );

  /* ================================================================
     RENDER: TAB 5 - Security & Auth
     ================================================================ */
  const renderSecurityTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>S</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            Security & Authentication Scenarios
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            {SECURITY_SCENARIOS.length} scenarios covering authentication, authorization, and data protection
          </p>
        </div>
      </div>

      {SECURITY_SCENARIOS.map((s) => renderScenarioCard(s, 'sec'))}
    </div>
  );

  /* ================================================================
     RENDER: TAB 6 - DB Validation
     ================================================================ */
  const renderDbTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>D</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            Database Validation Scenarios
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            {DB_SCENARIOS.length} scenarios for verifying data integrity, persistence, and consistency
          </p>
        </div>
      </div>

      {DB_SCENARIOS.map((s) => renderScenarioCard(s, 'db'))}
    </div>
  );

  /* ================================================================
     RENDER: TAB 7 - Negative & Edge Cases
     ================================================================ */
  const renderNegativeTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>N</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            Negative, Integration & Performance Scenarios
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            {NEGATIVE_SCENARIOS.length + INTEGRATION_SCENARIOS.length + PERFORMANCE_SCENARIOS.length} scenarios across three categories
          </p>
        </div>
      </div>

      {/* Negative & Edge Cases */}
      <div style={styles.sectionHeader}>
        <span>Negative & Edge Cases</span>
        <span style={styles.sectionCount}>{NEGATIVE_SCENARIOS.length} scenarios</span>
      </div>
      {NEGATIVE_SCENARIOS.map((s) => renderSimpleScenarioCard(s, 'neg'))}

      {/* Integration & System Behavior */}
      <div style={{ ...styles.sectionHeader, marginTop: '28px' }}>
        <span>Integration & System Behavior</span>
        <span style={styles.sectionCount}>{INTEGRATION_SCENARIOS.length} scenarios</span>
      </div>
      {INTEGRATION_SCENARIOS.map((s) => renderSimpleScenarioCard(s, 'int'))}

      {/* Performance & Reliability */}
      <div style={{ ...styles.sectionHeader, marginTop: '28px' }}>
        <span>Performance & Reliability</span>
        <span style={styles.sectionCount}>{PERFORMANCE_SCENARIOS.length} scenarios</span>
      </div>
      {PERFORMANCE_SCENARIOS.map((s) => renderSimpleScenarioCard(s, 'prf'))}
    </div>
  );

  /* ================================================================
     RENDER: TAB 8 - Quick Reference
     ================================================================ */
  const renderReferenceTab = () => (
    <div>
      <div style={styles.tabContentHeader}>
        <div style={styles.tabIcon}>R</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: C.text }}>
            Quick Reference & Cheat Sheet
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: C.textMuted }}>
            Top 10 must-explain scenarios + essential cheat sheets for interview day
          </p>
        </div>
      </div>

      {/* Top 10 Must-Explain Scenarios */}
      <div style={styles.sectionHeader}>
        <span>Top 10 Must-Explain Scenarios</span>
        <span style={styles.sectionCount}>Must Know</span>
      </div>
      <div style={styles.gridTwo}>
        {TOP_10_SCENARIOS.map((scenario) => (
          <div key={scenario.id} style={styles.topScenarioCard}>
            <span style={styles.topScenarioNumber}>{scenario.id}</span>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: C.text }}>
                {scenario.title}
              </p>
              <span style={styles.badge(C.blue)}>{scenario.category}</span>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: C.textMuted, lineHeight: '1.5' }}>
                {scenario.summary}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* SOAP Assertions Cheat Sheet */}
      <div style={{ ...styles.sectionHeader, marginTop: '28px' }}>
        <span>Common SOAP Assertions</span>
        <span style={styles.sectionCount}>{SOAP_ASSERTIONS_CHEATSHEET.length} types</span>
      </div>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Assertion Type</th>
              <th style={styles.th}>Usage / Example</th>
              <th style={styles.th}>When to Use</th>
            </tr>
          </thead>
          <tbody>
            {SOAP_ASSERTIONS_CHEATSHEET.map((item, i) => (
              <tr key={i}>
                <td style={{ ...styles.td, color: C.accent, fontWeight: '600' }}>{item.assertion}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{item.usage}</td>
                <td style={styles.td}>{item.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SoapUI Shortcuts */}
      <div style={{ ...styles.sectionHeader, marginTop: '28px' }}>
        <span>SoapUI Keyboard Shortcuts</span>
        <span style={styles.sectionCount}>{SOAPUI_SHORTCUTS.length} shortcuts</span>
      </div>
      <div style={styles.card}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
          {SOAPUI_SHORTCUTS.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid rgba(255,255,255,0.06)`,
            }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '4px',
                background: C.inputBg,
                border: `1px solid ${C.border}`,
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: '700',
                color: C.accent,
                whiteSpace: 'nowrap',
              }}>
                {item.shortcut}
              </span>
              <span style={{ fontSize: '12px', color: C.textMuted }}>{item.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Banking Status Codes */}
      <div style={{ ...styles.sectionHeader, marginTop: '28px' }}>
        <span>Common Banking Response Codes</span>
        <span style={styles.sectionCount}>{BANKING_STATUS_CODES.length} codes</span>
      </div>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: '100px' }}>Code</th>
              <th style={styles.th}>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {BANKING_STATUS_CODES.map((item, i) => (
              <tr key={i}>
                <td style={{
                  ...styles.td,
                  fontFamily: 'monospace',
                  fontWeight: '700',
                  color: item.code.startsWith('0') ? C.pass :
                         item.code.startsWith('1') ? C.orange :
                         item.code.startsWith('2') ? C.yellow :
                         item.code.startsWith('3') ? C.red :
                         item.code.startsWith('4') ? C.purple :
                         item.code.startsWith('5') ? C.fail :
                         C.blue,
                }}>
                  {item.code}
                </td>
                <td style={styles.td}>{item.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JIRA Defect Template */}
      <div style={{ ...styles.sectionHeader, marginTop: '28px' }}>
        <span>JIRA Defect Template</span>
        <span style={styles.sectionCount}>Template</span>
      </div>
      <div style={styles.card}>
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          background: 'rgba(231, 76, 60, 0.08)',
          border: `1px solid ${C.red}33`,
          marginBottom: '12px',
        }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: C.red, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Title Format:
          </span>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '700', color: C.text, fontFamily: 'monospace' }}>
            {JIRA_DEFECT_TEMPLATE.title}
          </p>
        </div>

        <table style={styles.table}>
          <tbody>
            {JIRA_DEFECT_TEMPLATE.fields.map((field, i) => (
              <tr key={i}>
                <td style={{
                  ...styles.td,
                  color: C.accent,
                  fontWeight: '600',
                  width: '150px',
                  verticalAlign: 'top',
                }}>
                  {field.label}
                </td>
                <td style={{
                  ...styles.td,
                  whiteSpace: 'pre-wrap',
                  fontFamily: field.label === 'SOAP Request' || field.label === 'SOAP Response' || field.label === 'DB Evidence'
                    ? '"Fira Code", "Cascadia Code", "Consolas", monospace' : 'inherit',
                  fontSize: field.label === 'DB Evidence' ? '11px' : '12px',
                  color: field.label === 'Severity' ? C.red : C.textMuted,
                  fontWeight: field.label === 'Severity' ? '700' : 'normal',
                }}>
                  {field.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ================================================================
     RENDER: Tab Content Router
     ================================================================ */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'framework': return renderFrameworkTab();
      case 'phd': return renderPhdTab();
      case 'customer': return renderCustomerTab();
      case 'transactions': return renderTransactionsTab();
      case 'security': return renderSecurityTab();
      case 'db': return renderDbTab();
      case 'negative': return renderNegativeTab();
      case 'reference': return renderReferenceTab();
      default: return renderFrameworkTab();
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
          <span style={styles.titleAccent}>SOAP API</span> Testing Interview Guide
        </h1>
        <p style={styles.subtitle}>
          Comprehensive interview preparation for Banking QA Testers -- Master framework, scenarios, and cheat sheets
        </p>
      </div>

      {/* Summary Stats */}
      <div style={styles.statsBar}>
        <div style={styles.statBadge(C.accent)}>
          <span style={styles.statValue}>{totalScenarios}+</span>
          Total Scenarios
        </div>
        <div style={styles.statBadge(C.blue)}>
          <span style={styles.statValue}>{TABS.length}</span>
          Categories
        </div>
        <div style={styles.statBadge(C.orange)}>
          <span style={styles.statValue}>{FRAMEWORK_STEPS.length}</span>
          Framework Steps
        </div>
        <div style={styles.statBadge(C.purple)}>
          <span style={styles.statValue}>{PHD_SECTIONS.length}</span>
          PhD Sections
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

export default SoapInterviewGuide;

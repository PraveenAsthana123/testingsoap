import React, { useState } from 'react';

const QUESTIONS = [
  {
    id: 1,
    type: 'True/False',
    badge: 'Tricky',
    question: 'SoapUI can only test SOAP services.',
    answer: false,
    explanation: 'False. SoapUI supports SOAP, REST, GraphQL, JMS, JDBC, and more. It is a multi-protocol API testing tool, not limited to SOAP despite its name.',
  },
  {
    id: 2,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'What is the difference between SOAP and REST?',
    answer: 'SOAP (Simple Object Access Protocol) is a protocol with strict standards that uses XML exclusively and operates over HTTP, SMTP, TCP, etc. REST (Representational State Transfer) is an architectural style that uses HTTP methods (GET, POST, PUT, DELETE), supports multiple formats (JSON, XML, HTML, plain text), and is stateless. SOAP has built-in WS-Security and ACID compliance making it common in banking/finance, while REST is lightweight, faster, and more flexible. SOAP uses WSDL for service description; REST may use OpenAPI/Swagger.',
  },
  {
    id: 3,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'What is WSDL and why is it important?',
    answer: 'WSDL (Web Services Description Language) is an XML-based file that describes a SOAP web service. It defines the service endpoint (URL), available operations/methods, input and output message formats, binding protocols, and data types. In SoapUI, importing a WSDL auto-generates test requests for all operations, making it the starting point for SOAP API testing. It acts as a contract between service provider and consumer.',
  },
  {
    id: 4,
    type: 'MCQ',
    badge: 'MCQ',
    question: 'Which assertion type in SoapUI checks if a specific value exists in the response?',
    options: ['Schema Compliance', 'Contains', 'XPath Match', 'Script Assertion'],
    correctIndex: 1,
    explanation: '"Contains" assertion checks if the response contains a specific string value. XPath Match checks for structured XML path values. Schema Compliance validates against WSDL/XSD. Script Assertion uses Groovy for custom validation.',
  },
  {
    id: 5,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'How do you perform data-driven testing in SoapUI?',
    answer: 'Data-driven testing in SoapUI uses external data sources to run the same test with multiple datasets. Steps: (1) Add a DataSource test step (Excel, CSV, JDBC, XML, or Grid). (2) Configure column mappings. (3) Reference data in requests using ${DataSource#column_name}. (4) Add a DataSource Loop step at the end to iterate through all rows. (5) Add assertions that validate each iteration. This is essential for testing banking scenarios like multiple account types, transaction amounts, and currency formats.',
  },
  {
    id: 6,
    type: 'MCQ',
    badge: 'MCQ',
    question: 'What are assertions in SoapUI used for?',
    options: [
      'To define test data inputs',
      'To validate that the response meets expected criteria',
      'To configure authentication headers',
      'To generate test reports'
    ],
    correctIndex: 1,
    explanation: 'Assertions are validation checkpoints that verify the API response meets expected criteria. They check status codes, response content, schema compliance, response time (SLA), XPath/JSONPath values, and more.',
  },
  {
    id: 7,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'How do you handle authentication in SoapUI?',
    answer: 'SoapUI supports multiple authentication methods: (1) Basic Auth: username/password encoded in Base64 in the Authorization header. (2) OAuth 1.0/2.0: configured in the Auth tab with client credentials, token endpoints, and scopes. (3) API Key: added as a header (X-API-Key) or query parameter. (4) WS-Security (SOAP): username token, X.509 certificate, SAML assertions configured in WS-Security settings. (5) NTLM/Kerberos: for Windows-integrated services. In banking APIs, you typically use OAuth 2.0 with client credentials grant for server-to-server, or bearer tokens obtained from an authentication endpoint.',
  },
  {
    id: 8,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'What is a Mock Service in SoapUI?',
    answer: 'A Mock Service simulates a real web service without requiring the actual backend. SoapUI can generate mock services from a WSDL or REST definition. Uses include: (1) Testing when the real service is unavailable or under development. (2) Simulating error responses (500, 404, timeout). (3) Creating predictable test environments. (4) Performance testing without impacting production. (5) In banking, mocking third-party payment gateways or core banking APIs during development. Mock services can include dynamic responses using Groovy scripts.',
  },
  {
    id: 9,
    type: 'MCQ',
    badge: 'MCQ',
    question: 'What is the difference between a TestSuite and a TestCase in SoapUI?',
    options: [
      'They are the same thing with different names',
      'A TestSuite contains multiple TestCases; a TestCase contains test steps',
      'A TestCase contains multiple TestSuites',
      'TestSuite is for SOAP only, TestCase is for REST only'
    ],
    correctIndex: 1,
    explanation: 'The hierarchy is: Project > TestSuite > TestCase > TestStep. A TestSuite groups related TestCases (e.g., "Account Management Suite"). A TestCase is a specific scenario containing test steps (e.g., "Create Account" with steps: request, assertion, property transfer). TestSuites can share properties and run sequentially or in parallel.',
  },
  {
    id: 10,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'How do you perform load testing in SoapUI?',
    answer: 'Load testing in SoapUI (Pro feature in ReadyAPI, basic in open-source): (1) Right-click a TestCase and select "New LoadTest". (2) Configure: Thread Count (concurrent users), Test Delay (think time), Run Limit (duration or total runs), Strategy (Simple, Variance, Burst, Thread). (3) Add LoadTest assertions: Max Errors, Max Response Time, Average Response Time. (4) Monitor: TPS (transactions per second), average response time, error rate, min/max times. (5) For banking: simulate peak load (month-end processing, salary day), stress test transaction endpoints, verify no data corruption under concurrent writes.',
  },
  {
    id: 11,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'What is Groovy script in SoapUI and how is it used?',
    answer: 'Groovy is the scripting language embedded in SoapUI for advanced test logic. Use cases: (1) Groovy TestStep: execute custom logic between requests (generate test data, parse responses, conditional branching). (2) Script Assertion: custom validation logic beyond built-in assertions. (3) Setup/Teardown Scripts: run before/after TestCase or TestSuite. (4) Dynamic properties: generate timestamps, UUIDs, random account numbers. (5) Database operations: JDBC queries via Groovy SQL. Example: def response = context.expand(\'${Request#Response}\'); assert response.contains("SUCCESS");',
  },
  {
    id: 12,
    type: 'MCQ',
    badge: 'MCQ',
    question: 'How do you validate a JSON response in SoapUI?',
    options: [
      'Only through manual visual inspection',
      'Using JsonPath Match assertion or Script assertion with JsonSlurper',
      'JSON validation is not supported in SoapUI',
      'By converting JSON to XML first, then using XPath'
    ],
    correctIndex: 1,
    explanation: 'SoapUI validates JSON using: (1) JsonPath Match assertion: $.status == "SUCCESS". (2) JsonPath Count: verify array sizes. (3) Script assertion with JsonSlurper: def json = new groovy.json.JsonSlurper().parseText(response); assert json.balance >= 0. (4) Contains assertion for simple string checks. JsonPath is the JSON equivalent of XPath for XML.',
  },
  {
    id: 13,
    type: 'MCQ',
    badge: 'MCQ',
    question: 'Which HTTP status code indicates "Resource Created Successfully"?',
    options: ['200 OK', '201 Created', '204 No Content', '202 Accepted'],
    correctIndex: 1,
    explanation: '201 Created indicates a new resource was successfully created (e.g., new bank account). 200 OK is general success. 204 No Content means success with no response body (e.g., DELETE). 202 Accepted means the request is queued for processing (async operations).',
  },
  {
    id: 14,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'What is a JDBC Test Step in SoapUI?',
    answer: 'A JDBC Test Step executes SQL queries directly against a database from within a SoapUI test. Configuration: (1) Add JDBC driver JAR to SoapUI/lib folder. (2) Configure connection: Driver class (e.g., org.sqlite.JDBC), Connection String (e.g., jdbc:sqlite:/path/to/db). (3) Write SQL query. (4) Map results to properties for use in subsequent steps. Use cases in banking: verify API created correct DB records, check account balance after transaction, validate audit trail entries, setup/cleanup test data.',
  },
  {
    id: 15,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'How do you connect SoapUI to a SQLite database using JDBC?',
    answer: 'Steps: (1) Download sqlite-jdbc-*.jar from Maven Central. (2) Copy the JAR to SoapUI installation: <SoapUI>/lib/ folder. (3) Restart SoapUI. (4) In your TestCase, add a JDBC Request test step. (5) Configure: Driver = org.sqlite.JDBC, Connection String = jdbc:sqlite:/mnt/deepa/Deepa/soaptesting/database/banking.db. (6) Write SQL: SELECT * FROM accounts WHERE account_id = ?. (7) Use property expansion for parameters. (8) Results are returned as XML that can be validated with assertions or transferred to other steps via Property Transfer.',
  },
  {
    id: 16,
    type: 'MCQ',
    badge: 'MCQ',
    question: 'What is an XPath assertion used for?',
    options: [
      'To test REST API endpoints',
      'To navigate and validate specific nodes in an XML response',
      'To generate load test scenarios',
      'To encrypt SOAP messages'
    ],
    correctIndex: 1,
    explanation: 'XPath assertion navigates XML document structure to validate specific element values. Example: //AccountResponse/Balance/text() matches "5000.00". It is essential for SOAP testing where responses are XML. In banking: verify //TransferResponse/Status equals "COMPLETED" and //TransferResponse/ReferenceNumber is not empty.',
  },
  {
    id: 17,
    type: 'MCQ',
    badge: 'MCQ',
    question: 'Which REST method is idempotent?',
    options: ['POST', 'PUT', 'PATCH', 'Both PUT and DELETE'],
    correctIndex: 3,
    explanation: 'PUT and DELETE are idempotent: calling them multiple times with the same parameters produces the same result. GET is also idempotent. POST is NOT idempotent (each call may create a new resource). PATCH may or may not be idempotent depending on implementation. In banking, PUT for updating account details is safe to retry; POST for fund transfers needs idempotency keys to prevent duplicate transactions.',
  },
  {
    id: 18,
    type: 'True/False',
    badge: 'True/False',
    question: 'In REST APIs, the GET method should be used to modify server-side data.',
    answer: false,
    explanation: 'False. GET is strictly for reading/retrieving data and must be safe (no side effects) and idempotent. Use POST for creation, PUT/PATCH for updates, and DELETE for removal. Using GET for modifications violates REST principles and creates security risks (URLs are logged, cached, and bookmarked).',
  },
  {
    id: 19,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'How would you test a fund transfer API in a banking application?',
    answer: 'Comprehensive fund transfer API testing: (1) Positive: valid transfer between two active accounts, verify debit/credit amounts, check transaction reference generated. (2) Boundary: minimum amount (0.01), maximum daily limit, exact balance transfer. (3) Negative: insufficient funds, inactive/frozen account, same source and destination, invalid account numbers, negative amount, zero amount. (4) Security: unauthorized access, SQL injection in account fields, transfer exceeding user role limit. (5) Concurrency: simultaneous transfers from same account (race condition), verify final balance consistency. (6) Data validation: currency mismatch, special characters, overflow amounts. (7) Database verification: audit log entry created, balance updated correctly, transaction status recorded. (8) Idempotency: duplicate request with same idempotency key returns same response.',
  },
  {
    id: 20,
    type: 'MCQ',
    badge: 'MCQ',
    question: 'What is the difference between smoke testing and regression testing?',
    options: [
      'They are the same type of testing',
      'Smoke testing is a quick sanity check of critical paths; regression testing verifies existing functionality after changes',
      'Smoke testing is only for UI; regression testing is only for API',
      'Regression testing runs before smoke testing'
    ],
    correctIndex: 1,
    explanation: 'Smoke testing is a shallow, broad test of critical functionality to verify the build is stable enough for further testing (e.g., can login, can view accounts, can initiate transfer). Regression testing is deeper, verifying that new changes have not broken existing functionality. In banking: smoke test after every deployment (critical paths work), regression test the full suite before releases.',
  },
  {
    id: 21,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'How do you handle dynamic data in API testing?',
    answer: 'Strategies for dynamic data: (1) Property Expansion: ${#Project#variable}, ${TestStep#Response#jsonPath}. (2) Property Transfer: extract values from one response and inject into the next request (e.g., extract auth token, then use in subsequent calls). (3) Groovy scripts: generate timestamps (new Date().format("yyyy-MM-dd")), UUIDs (UUID.randomUUID()), random numbers. (4) Environment properties: different values per environment (DEV/QA/PROD). (5) Regular expression extraction: parse dynamic IDs from responses. (6) DataSource: external files for parameterized test data. In banking: transaction IDs, timestamps, session tokens, OTPs are all dynamic.',
  },
  {
    id: 22,
    type: 'True/False',
    badge: 'Tricky',
    question: 'HTTP status code 401 means the resource was not found on the server.',
    answer: false,
    explanation: 'False. 401 Unauthorized means the client has not provided valid authentication credentials. 404 Not Found means the requested resource does not exist. 403 Forbidden means the client is authenticated but lacks permission. These are commonly confused in interviews.',
  },
  {
    id: 23,
    type: 'MCQ',
    badge: 'MCQ',
    question: 'What is Property Transfer in SoapUI?',
    options: [
      'Moving test projects between machines',
      'Transferring values between test steps, such as extracting a token from a login response to use in subsequent requests',
      'Copying test suites from one project to another',
      'Exporting test results to a file'
    ],
    correctIndex: 1,
    explanation: 'Property Transfer extracts a value from one test step (source) and passes it to another (target). Example workflow: (1) Login API returns auth_token. (2) Property Transfer extracts token via JsonPath. (3) Next request uses ${PropertyTransfer#auth_token} in the Authorization header. This is fundamental for testing multi-step banking workflows like login > get accounts > transfer funds.',
  },
  {
    id: 24,
    type: 'True/False',
    badge: 'True/False',
    question: 'SoapUI supports both SOAP and RESTful API testing within the same project.',
    answer: true,
    explanation: 'True. A single SoapUI project can contain both SOAP services (imported via WSDL) and REST services. You can create test suites that mix SOAP and REST test cases, which is useful in banking where core banking may use SOAP while newer microservices use REST.',
  },
  {
    id: 25,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'What are the different types of test environments and how do you manage them in SoapUI?',
    answer: 'Test environments in SoapUI: (1) DEV: developer machines, unstable, frequent deployments. (2) QA/SIT: System Integration Testing, stable for test execution. (3) UAT: User Acceptance Testing, mirrors production. (4) Pre-PROD/Staging: identical to production for final validation. (5) PROD: live environment, read-only testing. Management in SoapUI: Use Environment feature (Pro) or custom properties at Project level. Define endpoint URLs, credentials, database connections per environment. Switch between environments without modifying tests. Use property expansion: ${#Project#BASE_URL}/api/accounts.',
  },
  {
    id: 26,
    type: 'MCQ',
    badge: 'Tricky',
    question: 'Which of the following is NOT a valid HTTP method?',
    options: ['PATCH', 'CONNECT', 'FETCH', 'OPTIONS'],
    correctIndex: 2,
    explanation: 'FETCH is not a valid HTTP method (it is a browser JavaScript API, not an HTTP verb). Valid HTTP methods include: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, CONNECT, and TRACE. In API testing, you primarily use GET, POST, PUT, PATCH, and DELETE.',
  },
  {
    id: 27,
    type: 'True/False',
    badge: 'Tricky',
    question: 'A 200 OK response always means the business operation was successful.',
    answer: false,
    explanation: 'False. HTTP 200 only means the HTTP request was processed successfully, not that the business operation succeeded. An API might return 200 with a body like {"status": "FAILED", "error": "Insufficient funds"}. Always validate the response body, not just the status code. This is a common mistake in API testing.',
  },
  {
    id: 28,
    type: 'Descriptive',
    badge: 'Descriptive',
    question: 'Explain the concept of API test automation framework design.',
    answer: 'A well-designed API test automation framework includes: (1) Layered architecture: Test Data Layer (external data sources, factories), API Client Layer (request builders, authentication handlers), Test Logic Layer (test cases, assertions), Reporting Layer (HTML reports, logs). (2) Configuration management: environment-specific configs, secrets management. (3) Reusable components: common assertions, response parsers, data generators. (4) CI/CD integration: run on every build, fail pipeline on test failure. (5) Reporting: detailed pass/fail with request/response logs, execution time. (6) In SoapUI: organize as Project > TestSuites (by module) > TestCases (by scenario) > TestSteps, with shared properties at project level and data-driven testing for coverage.',
  },
  {
    id: 29,
    type: 'MCQ',
    badge: 'MCQ',
    question: 'What is the primary purpose of the Content-Type header in an HTTP request?',
    options: [
      'To specify the encoding of the URL',
      'To indicate the media type of the request body being sent to the server',
      'To define the caching policy',
      'To set the authentication method'
    ],
    correctIndex: 1,
    explanation: 'Content-Type tells the server what format the request body is in: application/json for JSON, application/xml for XML, multipart/form-data for file uploads, application/x-www-form-urlencoded for form data. In banking APIs, most modern services use application/json, while legacy SOAP services use text/xml or application/soap+xml.',
  },
  {
    id: 30,
    type: 'True/False',
    badge: 'True/False',
    question: 'API testing can completely replace UI testing in a banking application.',
    answer: false,
    explanation: 'False. API testing and UI testing are complementary, not replacements. API testing validates business logic, data integrity, security, and performance at the service layer. UI testing validates the user experience, visual rendering, form behavior, navigation flows, and client-side logic. In banking: API testing verifies the transfer logic is correct; UI testing verifies the customer can actually navigate to the transfer page, fill the form, and see the confirmation. The testing pyramid recommends more API tests and fewer UI tests, but both are necessary.',
  },
];

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: '0 0 20px 0',
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  statCard: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '14px 22px',
    textAlign: 'center',
    minWidth: '120px',
  },
  statValue: {
    fontSize: '26px',
    fontWeight: '700',
    margin: '0',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0 0 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  progressBarOuter: {
    width: '100%',
    height: '10px',
    background: '#e2e8f0',
    borderRadius: '5px',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  progressBarInner: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    background: pct === 100 ? '#10b981' : '#3b82f6',
    borderRadius: '5px',
    transition: 'width 0.4s ease',
  }),
  filterRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filterBtn: (active) => ({
    padding: '7px 16px',
    borderRadius: '20px',
    border: active ? '2px solid #3b82f6' : '1px solid #d1d5db',
    background: active ? '#eff6ff' : '#fff',
    color: active ? '#2563eb' : '#374151',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: active ? '600' : '400',
    transition: 'all 0.15s',
  }),
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    marginBottom: '16px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s',
  },
  cardHeader: {
    padding: '18px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    userSelect: 'none',
  },
  qNumber: {
    background: '#1a1a2e',
    color: '#fff',
    borderRadius: '8px',
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    flexShrink: 0,
  },
  qText: {
    flex: 1,
    fontSize: '15px',
    fontWeight: '500',
    color: '#1e293b',
    lineHeight: '1.5',
    margin: 0,
  },
  badge: (type) => {
    const colors = {
      'True/False': { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
      'MCQ': { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
      'Descriptive': { bg: '#ede9fe', color: '#5b21b6', border: '#c4b5fd' },
      'Tricky': { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
    };
    const c = colors[type] || colors['Descriptive'];
    return {
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    };
  },
  answerArea: {
    padding: '0 20px 20px 72px',
  },
  tfBtnRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
  },
  tfBtn: (selected, isCorrect, revealed) => {
    let bg = '#f1f5f9';
    let color = '#475569';
    let border = '1px solid #cbd5e1';
    if (revealed && isCorrect) {
      bg = '#dcfce7';
      color = '#166534';
      border = '1px solid #86efac';
    } else if (revealed && selected && !isCorrect) {
      bg = '#fee2e2';
      color = '#991b1b';
      border = '1px solid #fca5a5';
    } else if (selected) {
      bg = '#e0e7ff';
      color = '#3730a3';
      border = '1px solid #a5b4fc';
    }
    return {
      padding: '10px 28px',
      borderRadius: '8px',
      border,
      background: bg,
      color,
      cursor: revealed ? 'default' : 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.15s',
    };
  },
  mcqOption: (idx, selectedIdx, correctIdx, revealed) => {
    let bg = '#f8fafc';
    let color = '#334155';
    let border = '1px solid #e2e8f0';
    let fontWeight = '400';
    if (revealed && idx === correctIdx) {
      bg = '#dcfce7';
      color = '#166534';
      border = '2px solid #22c55e';
      fontWeight = '600';
    } else if (revealed && idx === selectedIdx && idx !== correctIdx) {
      bg = '#fee2e2';
      color = '#991b1b';
      border = '2px solid #ef4444';
      fontWeight = '600';
    } else if (idx === selectedIdx) {
      bg = '#e0e7ff';
      color = '#3730a3';
      border = '2px solid #818cf8';
      fontWeight = '500';
    }
    return {
      padding: '12px 16px',
      borderRadius: '8px',
      border,
      background: bg,
      color,
      cursor: revealed ? 'default' : 'pointer',
      fontSize: '14px',
      fontWeight,
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.15s',
    };
  },
  optionLetter: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
  },
  explanation: {
    marginTop: '12px',
    padding: '14px 16px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#166534',
    lineHeight: '1.6',
  },
  wrongExplanation: {
    marginTop: '12px',
    padding: '14px 16px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#991b1b',
    lineHeight: '1.6',
  },
  descriptiveAnswer: {
    padding: '16px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#334155',
    lineHeight: '1.7',
  },
  revealBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid #3b82f6',
    background: '#eff6ff',
    color: '#2563eb',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    marginTop: '10px',
  },
  resetBtn: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '20px',
  },
  chevron: (open) => ({
    fontSize: '18px',
    color: '#94a3b8',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s',
    flexShrink: 0,
    marginTop: '2px',
  }),
};

function InterviewPrep() {
  const [openId, setOpenId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [filter, setFilter] = useState('All');

  const totalAnswered = Object.keys(revealed).length;
  const correctCount = Object.keys(revealed).filter((qId) => {
    const q = QUESTIONS.find((qu) => qu.id === parseInt(qId));
    if (!q) return false;
    if (q.type === 'Descriptive') return true;
    if (q.type === 'True/False') return answers[qId] === q.answer;
    if (q.type === 'MCQ') return answers[qId] === q.correctIndex;
    return false;
  }).length;
  const progressPct = Math.round((totalAnswered / QUESTIONS.length) * 100);

  const filteredQuestions = filter === 'All'
    ? QUESTIONS
    : QUESTIONS.filter((q) => q.badge === filter);

  const handleTfAnswer = (qId, val) => {
    if (revealed[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleMcqAnswer = (qId, idx) => {
    if (revealed[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleReveal = (qId) => {
    setRevealed((prev) => ({ ...prev, [qId]: true }));
  };

  const handleToggle = (qId) => {
    setOpenId(openId === qId ? null : qId);
  };

  const handleReset = () => {
    setOpenId(null);
    setAnswers({});
    setRevealed({});
  };

  const isCorrect = (q) => {
    if (q.type === 'Descriptive') return true;
    if (q.type === 'True/False') return answers[q.id] === q.answer;
    if (q.type === 'MCQ') return answers[q.id] === q.correctIndex;
    return false;
  };

  const filterOptions = ['All', 'True/False', 'MCQ', 'Descriptive', 'Tricky'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Interview Q&A -- SoapUI / API Testing / QA</h1>
        <p style={styles.subtitle}>
          30 questions covering SoapUI, REST/SOAP APIs, testing strategies, and banking-specific scenarios.
          Click a question to expand, answer, then reveal the correct answer.
        </p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={{ ...styles.statValue, color: '#3b82f6' }}>{QUESTIONS.length}</p>
          <p style={styles.statLabel}>Total</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ ...styles.statValue, color: '#8b5cf6' }}>{totalAnswered}</p>
          <p style={styles.statLabel}>Attempted</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ ...styles.statValue, color: '#10b981' }}>{correctCount}</p>
          <p style={styles.statLabel}>Correct</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ ...styles.statValue, color: '#ef4444' }}>{totalAnswered - correctCount}</p>
          <p style={styles.statLabel}>Wrong</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ ...styles.statValue, color: '#f59e0b' }}>{progressPct}%</p>
          <p style={styles.statLabel}>Progress</p>
        </div>
      </div>

      <div style={styles.progressBarOuter}>
        <div style={styles.progressBarInner(progressPct)} />
      </div>

      <div style={styles.filterRow}>
        {filterOptions.map((f) => (
          <button
            key={f}
            style={styles.filterBtn(filter === f)}
            onClick={() => setFilter(f)}
          >
            {f} {f !== 'All' && `(${QUESTIONS.filter((q) => q.badge === f).length})`}
          </button>
        ))}
      </div>

      {filteredQuestions.map((q) => {
        const isOpen = openId === q.id;
        const isRevealed = revealed[q.id];
        const userAnswer = answers[q.id];

        return (
          <div key={q.id} style={{
            ...styles.card,
            borderLeft: isRevealed
              ? `4px solid ${isCorrect(q) ? '#22c55e' : '#ef4444'}`
              : '4px solid transparent',
          }}>
            <div style={styles.cardHeader} onClick={() => handleToggle(q.id)}>
              <div style={styles.qNumber}>{q.id}</div>
              <p style={styles.qText}>{q.question}</p>
              <span style={styles.badge(q.badge)}>{q.badge}</span>
              <span style={styles.chevron(isOpen)}>&#9662;</span>
            </div>

            {isOpen && (
              <div style={styles.answerArea}>
                {/* True/False */}
                {q.type === 'True/False' && (
                  <>
                    <div style={styles.tfBtnRow}>
                      <button
                        style={styles.tfBtn(userAnswer === true, q.answer === true, isRevealed)}
                        onClick={() => handleTfAnswer(q.id, true)}
                      >
                        True
                      </button>
                      <button
                        style={styles.tfBtn(userAnswer === false, q.answer === false, isRevealed)}
                        onClick={() => handleTfAnswer(q.id, false)}
                      >
                        False
                      </button>
                    </div>
                    {userAnswer !== undefined && !isRevealed && (
                      <button style={styles.revealBtn} onClick={() => handleReveal(q.id)}>
                        Reveal Answer
                      </button>
                    )}
                    {isRevealed && (
                      <div style={isCorrect(q) ? styles.explanation : styles.wrongExplanation}>
                        {isCorrect(q) ? 'Correct! ' : 'Incorrect. '}
                        {q.explanation}
                      </div>
                    )}
                  </>
                )}

                {/* MCQ */}
                {q.type === 'MCQ' && (
                  <>
                    {q.options.map((opt, idx) => (
                      <div
                        key={idx}
                        style={styles.mcqOption(idx, userAnswer, q.correctIndex, isRevealed)}
                        onClick={() => handleMcqAnswer(q.id, idx)}
                      >
                        <span style={{
                          ...styles.optionLetter,
                          background: isRevealed && idx === q.correctIndex ? '#22c55e' :
                                     isRevealed && idx === userAnswer && idx !== q.correctIndex ? '#ef4444' :
                                     '#e2e8f0',
                          color: (isRevealed && (idx === q.correctIndex || (idx === userAnswer && idx !== q.correctIndex))) ? '#fff' : '#475569',
                        }}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                    {userAnswer !== undefined && !isRevealed && (
                      <button style={styles.revealBtn} onClick={() => handleReveal(q.id)}>
                        Reveal Answer
                      </button>
                    )}
                    {isRevealed && (
                      <div style={isCorrect(q) ? styles.explanation : styles.wrongExplanation}>
                        {isCorrect(q) ? 'Correct! ' : 'Incorrect. '}
                        {q.explanation}
                      </div>
                    )}
                  </>
                )}

                {/* Descriptive */}
                {q.type === 'Descriptive' && (
                  <>
                    {!isRevealed && (
                      <button style={styles.revealBtn} onClick={() => handleReveal(q.id)}>
                        Show Answer
                      </button>
                    )}
                    {isRevealed && (
                      <div style={styles.descriptiveAnswer}>
                        {q.answer}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
        <button style={styles.resetBtn} onClick={handleReset}>
          Reset All Answers
        </button>
      </div>
    </div>
  );
}

export default InterviewPrep;

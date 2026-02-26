import React, { useState } from 'react';

const SECTIONS = [
  {
    id: 'admin-tasks',
    title: 'Admin Tasks',
    icon: '\u2699\uFE0F',
    subsections: [
      {
        title: 'Install SoapUI Open Source',
        steps: [
          'Download SoapUI from https://www.soapui.org/downloads/soapui/ (choose Open Source version).',
          'For Windows: Run the .exe installer, follow prompts, select installation directory.',
          'For Linux: Download .sh file, run: chmod +x SoapUI-*.sh && ./SoapUI-*.sh',
          'For Mac: Download .dmg, drag SoapUI to Applications folder.',
          'Verify installation: Launch SoapUI, check Help > About for version info.',
          'Default install location: C:\\Program Files\\SmartBear\\SoapUI-5.x (Windows) or /opt/SoapUI (Linux).',
        ],
      },
      {
        title: 'Configure JDBC Driver for SQLite',
        steps: [
          'Download the SQLite JDBC driver: sqlite-jdbc-3.x.x.jar from Maven Central (https://mvnrepository.com/artifact/org.xerial/sqlite-jdbc).',
          'Copy the JAR file to your SoapUI installation: <SoapUI_Install_Dir>/lib/ folder.',
          'Restart SoapUI after adding the JAR (required for driver detection).',
          'Verify: In a JDBC test step, the driver org.sqlite.JDBC should now be available.',
          'Connection String format: jdbc:sqlite:<absolute_path_to_db_file>',
          'For this project: jdbc:sqlite:/mnt/deepa/Deepa/soaptesting/database/banking.db',
        ],
        codeBlock: {
          title: 'JDBC Configuration',
          language: 'properties',
          code: `Driver: org.sqlite.JDBC
Connection String: jdbc:sqlite:/mnt/deepa/Deepa/soaptesting/database/banking.db
Password: (leave empty for SQLite)

# Test the connection by running:
SELECT name FROM sqlite_master WHERE type='table';`,
        },
      },
      {
        title: 'Set Up Test Environment Properties',
        steps: [
          'Go to Project level > Custom Properties tab.',
          'Add environment-specific properties:',
          '  - BASE_URL = http://localhost:5000/api (for local dev)',
          '  - DB_PATH = /mnt/deepa/Deepa/soaptesting/database/banking.db',
          '  - API_VERSION = v1',
          'Reference in requests using: ${#Project#BASE_URL}/accounts',
          'For multiple environments, create separate property files and load them.',
          'Tip: Never hardcode URLs in test steps; always use property expansion.',
        ],
      },
      {
        title: 'Import WSDL for SOAP Services',
        steps: [
          'File > New SOAP Project.',
          'Enter project name (e.g., "Banking SOAP Services").',
          'Paste the WSDL URL in the "Initial WSDL" field.',
          'Check "Create Requests" to auto-generate sample requests for all operations.',
          'Check "Create TestSuite" to scaffold test structure.',
          'SoapUI parses the WSDL and creates: Service > Port > Operations > Requests.',
          'Review generated requests and update with valid test data.',
          'Tip: Save WSDL locally for offline testing: File > Save Project.',
        ],
      },
    ],
  },
  {
    id: 'tester-prep',
    title: 'Software Tester Prep',
    icon: '\uD83E\uDDEA',
    subsections: [
      {
        title: 'Creating Test Suites',
        steps: [
          'Right-click the Project > "New TestSuite".',
          'Name it by module: "Account Management Suite", "Fund Transfer Suite", "Loan Processing Suite".',
          'Organize by testing type: "Smoke Tests", "Regression Tests", "Integration Tests".',
          'TestSuite properties are shared across all TestCases within it.',
          'Run entire suite: Right-click suite > "Run TestSuite" (runs all TestCases sequentially).',
          'Parallel execution: TestSuite runner > check "Run in Parallel" for independent test cases.',
          'Best practice: Keep suites focused (5-15 test cases each), name clearly.',
        ],
      },
      {
        title: 'Writing Test Cases',
        steps: [
          'Right-click TestSuite > "New TestCase".',
          'Name with pattern: "TC_001_CreateAccount_ValidData", "TC_002_CreateAccount_DuplicateAccount".',
          'Add test steps in logical order:',
          '  1. Setup (Groovy script to prepare test data)',
          '  2. API Request (SOAP/REST call)',
          '  3. Assertions (validate response)',
          '  4. Property Transfer (extract values for next step)',
          '  5. Cleanup (Groovy script or JDBC to reset test data)',
          'Use Setup Script (TestCase level) for one-time initialization.',
          'Use TearDown Script for cleanup after each run.',
          'Enable "Abort on Error" for critical paths, disable for exploratory.',
        ],
      },
      {
        title: 'Assertions -- Validating Responses',
        steps: [
          'Click "Add Assertion" icon on any request test step.',
          'Common assertion types:',
          '  - Contains: Response body contains a specific string.',
          '  - Not Contains: Response must NOT contain a string (e.g., error messages).',
          '  - XPath Match: Validate XML node values (//Status/text() = "SUCCESS").',
          '  - JsonPath Match: Validate JSON values ($.account.balance = 5000).',
          '  - Valid HTTP Status Codes: Response code is 200, 201, etc.',
          '  - Schema Compliance: Response matches WSDL/XSD schema.',
          '  - Response SLA: Response time under threshold (e.g., < 2000ms).',
          '  - Script Assertion: Custom Groovy validation logic.',
          'Banking tip: Always assert both status code AND business status in response body.',
          'Example: HTTP 200 + {"status": "APPROVED"} -- both must pass.',
        ],
        codeBlock: {
          title: 'Groovy Script Assertion Example',
          language: 'groovy',
          code: `// Validate JSON response for fund transfer
import groovy.json.JsonSlurper

def response = messageExchange.response.contentAsString
def json = new JsonSlurper().parseText(response)

// Check transfer was successful
assert json.status == "SUCCESS" : "Transfer status is not SUCCESS"
assert json.transactionId != null : "Transaction ID is missing"
assert json.transactionId.length() > 0 : "Transaction ID is empty"

// Validate amount matches request
def requestJson = new JsonSlurper().parseText(
    messageExchange.request.contentAsString
)
assert json.amount == requestJson.amount : "Amount mismatch"

log.info("Transfer validated: txn=" + json.transactionId)`,
        },
      },
      {
        title: 'Data-Driven Testing',
        steps: [
          'Add "DataSource" test step to your TestCase.',
          'Configure data source type:',
          '  - Excel: .xlsx file with header row as column names.',
          '  - CSV/File: comma-separated, first row = headers.',
          '  - JDBC: SQL query against a database.',
          '  - Grid: Manual data grid within SoapUI.',
          'Map columns to test step properties: ${DataSource#accountNumber}, ${DataSource#amount}.',
          'Add "DataSource Loop" as the LAST test step.',
          '  - Configure: Target = DataSource step name.',
          '  - This loops back to DataSource for the next row.',
          'Assertions run on every iteration -- if any row fails, the test reports which row.',
          'Practical example: Test fund transfers with 50 different account/amount combos from Excel.',
        ],
        codeBlock: {
          title: 'Sample CSV Data File (transfer_testdata.csv)',
          language: 'csv',
          code: `fromAccount,toAccount,amount,expectedStatus,expectedMessage
1001,1002,500.00,SUCCESS,Transfer completed
1001,1003,0.00,FAILED,Amount must be greater than zero
1001,9999,100.00,FAILED,Destination account not found
1001,1002,999999999,FAILED,Insufficient funds
1001,1001,100.00,FAILED,Cannot transfer to same account`,
        },
      },
    ],
  },
  {
    id: 'main-operations',
    title: 'Main Operations',
    icon: '\uD83D\uDD27',
    subsections: [
      {
        title: 'SOAP Request Step',
        steps: [
          'After importing WSDL, expand the service tree to see operations.',
          'Double-click an operation to open the request editor.',
          'Replace placeholder values (?) with actual test data.',
          'Set endpoint URL (if not auto-populated from WSDL).',
          'Add WS-Security headers if required (WS-Security tab).',
          'Click green play button to execute.',
          'Response appears in the right panel (Raw, XML, JSON, HTML views).',
          'Add assertions to validate the response.',
        ],
        codeBlock: {
          title: 'Sample SOAP Request -- Get Account Balance',
          language: 'xml',
          code: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:bank="http://banking.example.com/services">
  <soapenv:Header>
    <bank:AuthToken>Bearer eyJhbGciOiJIUzI1NiJ9...</bank:AuthToken>
  </soapenv:Header>
  <soapenv:Body>
    <bank:GetAccountBalanceRequest>
      <bank:AccountNumber>1001</bank:AccountNumber>
      <bank:Currency>USD</bank:Currency>
    </bank:GetAccountBalanceRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
        },
      },
      {
        title: 'REST Request Step',
        steps: [
          'Right-click TestCase > Add Step > REST Request.',
          'Enter endpoint URL: ${#Project#BASE_URL}/accounts/1001',
          'Select HTTP method: GET, POST, PUT, DELETE, PATCH.',
          'For POST/PUT: Add request body (JSON) in the body editor.',
          'Set Headers: Content-Type: application/json, Authorization: Bearer ${#Project#AUTH_TOKEN}.',
          'Add query parameters via the Parameters tab.',
          'Execute and review response.',
          'Add JsonPath assertions for validation.',
        ],
        codeBlock: {
          title: 'Sample REST Request -- Create Account',
          language: 'json',
          code: `POST \${BASE_URL}/api/v1/accounts
Headers:
  Content-Type: application/json
  Authorization: Bearer \${AUTH_TOKEN}
  X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000

Body:
{
  "customerName": "John Smith",
  "accountType": "SAVINGS",
  "initialDeposit": 5000.00,
  "currency": "USD",
  "branchCode": "BR001"
}

Expected Response (201 Created):
{
  "accountId": 1001,
  "accountNumber": "ACC-2026-001001",
  "customerName": "John Smith",
  "accountType": "SAVINGS",
  "balance": 5000.00,
  "status": "ACTIVE",
  "createdAt": "2026-02-24T10:30:00Z"
}`,
        },
      },
      {
        title: 'JDBC Request Step',
        steps: [
          'Right-click TestCase > Add Step > JDBC Request.',
          'Configure connection:',
          '  - Driver: org.sqlite.JDBC',
          '  - Connection String: jdbc:sqlite:/mnt/deepa/Deepa/soaptesting/database/banking.db',
          'Write SQL query in the editor (parameterized).',
          'Use property expansion for dynamic values: WHERE account_id = ${Properties#accountId}.',
          'Execute: Results returned as XML <Results><ResultSet><Row>...</Row></ResultSet></Results>.',
          'Use XPath to extract values: //Row[1]/BALANCE/text()',
          'Common uses: verify DB state after API call, setup test data, cleanup after tests.',
        ],
        codeBlock: {
          title: 'Sample JDBC Queries for Banking Tests',
          language: 'sql',
          code: `-- Verify account was created
SELECT * FROM accounts
WHERE account_number = 'ACC-2026-001001';

-- Check balance after transfer
SELECT balance FROM accounts
WHERE account_id = 1001;

-- Verify audit trail
SELECT * FROM audit_log
WHERE operation = 'TRANSFER'
  AND account_id = 1001
ORDER BY created_at DESC
LIMIT 1;

-- Count transactions for a date range
SELECT COUNT(*) as txn_count
FROM transactions
WHERE created_at BETWEEN '2026-02-01' AND '2026-02-28';

-- Cleanup test data
DELETE FROM accounts WHERE account_number LIKE 'TEST-%';`,
        },
      },
      {
        title: 'Groovy Script Step',
        steps: [
          'Right-click TestCase > Add Step > Groovy Script.',
          'Use for: dynamic data generation, complex logic, conditional execution, logging.',
          'Access context: context, testRunner, log objects are available.',
          'Read properties: testRunner.testCase.getPropertyValue("propName").',
          'Set properties: testRunner.testCase.setPropertyValue("propName", "value").',
          'Access previous step response: context.expand(\'${StepName#Response}\').',
          'Conditional execution: testRunner.gotoStepByName("StepName") for branching.',
          'Error handling: try/catch blocks with testRunner.fail("message") on failure.',
        ],
        codeBlock: {
          title: 'Groovy Script Examples',
          language: 'groovy',
          code: `// 1. Generate unique test data
import java.text.SimpleDateFormat

def timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date())
def uniqueId = UUID.randomUUID().toString().substring(0, 8)
def testAccountNumber = "TEST-" + timestamp + "-" + uniqueId

testRunner.testCase.setPropertyValue("testAccountNumber", testAccountNumber)
log.info("Generated test account: " + testAccountNumber)

// 2. Parse JSON response and extract values
import groovy.json.JsonSlurper

def response = context.expand('\${REST Request#Response}')
def json = new JsonSlurper().parseText(response)
def accountId = json.accountId.toString()

testRunner.testCase.setPropertyValue("createdAccountId", accountId)
log.info("Created account ID: " + accountId)

// 3. Conditional test flow
def statusCode = context.expand('\${REST Request#ResponseStatusCode}')
if (statusCode == "201") {
    log.info("Account created successfully, proceeding to verification")
} else {
    testRunner.fail("Account creation failed with status: " + statusCode)
}

// 4. Database verification via Groovy
import groovy.sql.Sql
def sql = Sql.newInstance(
    "jdbc:sqlite:/mnt/deepa/Deepa/soaptesting/database/banking.db",
    "", "", "org.sqlite.JDBC"
)
def row = sql.firstRow("SELECT balance FROM accounts WHERE account_id = ?", [1001])
assert row.balance == 5000.00 : "Balance mismatch!"
sql.close()`,
        },
      },
      {
        title: 'Property Transfer Step',
        steps: [
          'Right-click TestCase > Add Step > Property Transfer.',
          'Configure Source: select source step and property (e.g., Response).',
          'Set source path: JsonPath ($.token) or XPath (//Token/text()).',
          'Configure Target: select target step and property (e.g., Request).',
          'Set target path: where to insert the value in the next request.',
          'Example flow:',
          '  1. Login API returns {"token": "abc123"}.',
          '  2. Property Transfer: Source = Login Response, Path = $.token.',
          '  3. Target = Next Request, Property = Authorization header.',
          'This chains API calls without hardcoding values between steps.',
        ],
      },
    ],
  },
  {
    id: 'sqlite-integration',
    title: 'SoapUI + SQLite Integration',
    icon: '\uD83D\uDDC4\uFE0F',
    subsections: [
      {
        title: 'JDBC Connection Setup',
        steps: [
          'Ensure sqlite-jdbc-*.jar is in <SoapUI>/lib/ directory.',
          'Restart SoapUI after adding the JAR.',
          'In any TestCase, add a JDBC Request step.',
          'Configure the connection parameters as shown below.',
          'Test with a simple query: SELECT 1; -- should return successfully.',
          'Note: SQLite does not require username/password -- leave fields empty.',
          'Important: Use absolute paths for the database file.',
        ],
        codeBlock: {
          title: 'SQLite JDBC Connection Details',
          language: 'properties',
          code: `Driver Class: org.sqlite.JDBC
Connection String: jdbc:sqlite:/mnt/deepa/Deepa/soaptesting/database/banking.db
Username: (empty)
Password: (empty)

# Alternative: In-memory database for testing
# Connection String: jdbc:sqlite::memory:

# Read-only mode
# Connection String: jdbc:sqlite:/path/to/banking.db?mode=ro`,
        },
      },
      {
        title: 'Sample Banking Queries',
        steps: [
          'Use JDBC steps to verify API operations against the database.',
          'Always parameterize queries -- never concatenate user input.',
          'Results are returned as XML -- use XPath to extract values.',
          'Chain JDBC steps with Property Transfer for end-to-end verification.',
        ],
        codeBlock: {
          title: 'Banking Database Verification Queries',
          language: 'sql',
          code: `-- List all tables in the database
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;

-- Verify account creation
SELECT account_id, account_number, customer_name, account_type,
       balance, status, created_at
FROM accounts
WHERE account_number = :accountNumber;

-- Verify fund transfer recorded correctly
SELECT t.transaction_id, t.from_account, t.to_account,
       t.amount, t.transaction_type, t.status, t.created_at,
       src.balance AS source_balance,
       dst.balance AS dest_balance
FROM transactions t
JOIN accounts src ON t.from_account = src.account_id
JOIN accounts dst ON t.to_account = dst.account_id
WHERE t.transaction_id = :transactionId;

-- Check audit log for security compliance
SELECT audit_id, user_id, operation, table_name,
       record_id, old_values, new_values, ip_address, created_at
FROM audit_log
WHERE operation = 'TRANSFER'
ORDER BY created_at DESC
LIMIT 10;

-- Daily transaction summary
SELECT DATE(created_at) as txn_date,
       COUNT(*) as total_transactions,
       SUM(CASE WHEN status='SUCCESS' THEN 1 ELSE 0 END) as successful,
       SUM(CASE WHEN status='FAILED' THEN 1 ELSE 0 END) as failed,
       SUM(CASE WHEN status='SUCCESS' THEN amount ELSE 0 END) as total_amount
FROM transactions
GROUP BY DATE(created_at)
ORDER BY txn_date DESC;`,
        },
      },
      {
        title: 'End-to-End Test: API + Database Verification',
        steps: [
          'Step 1: Groovy Script -- Generate unique test data.',
          'Step 2: REST Request -- POST /api/v1/accounts (create account).',
          'Step 3: Property Transfer -- Extract accountId from response.',
          'Step 4: JDBC Request -- SELECT from accounts WHERE account_id = ${accountId}.',
          'Step 5: XPath Assertion on JDBC result -- verify data matches API response.',
          'Step 6: REST Request -- POST /api/v1/transfers (fund transfer).',
          'Step 7: JDBC Request -- Verify both account balances updated.',
          'Step 8: JDBC Request -- Verify audit_log entry created.',
          'Step 9: Groovy Script Teardown -- Cleanup test data.',
          'This pattern ensures API and database are in sync -- critical for banking.',
        ],
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: '\uD83D\uDEE0\uFE0F',
    subsections: [
      {
        title: 'Common Errors and Fixes',
        steps: [],
        table: [
          { error: 'java.lang.ClassNotFoundException: org.sqlite.JDBC', fix: 'SQLite JDBC JAR not in <SoapUI>/lib/. Download and copy it, then restart SoapUI.' },
          { error: 'Connection refused (localhost:5000)', fix: 'Backend server not running. Start with: cd backend && python main.py' },
          { error: 'WSDL import fails with "Connection timed out"', fix: 'Check URL accessibility. Try opening WSDL URL in browser. Check proxy settings in SoapUI Preferences > Proxy.' },
          { error: 'XPath assertion returns no match', fix: 'Check namespace declarations. Use //*[local-name()="ElementName"] to ignore namespaces. Verify response XML structure.' },
          { error: 'JsonPath returns null', fix: 'Verify JSON structure in response. Use $ for root, $.data.items[0] for arrays. Check for typos in path.' },
          { error: '"Missing operation for soapAction"', fix: 'SOAP Action header mismatch. Check WSDL binding for correct SOAPAction value.' },
          { error: 'SSL Handshake Error', fix: 'Add SSL certificate to SoapUI truststore. Or disable SSL verification in Preferences > SSL Settings (dev only).' },
          { error: 'OutOfMemoryError during load test', fix: 'Increase JVM heap: edit SoapUI startup script, set -Xmx1024m. Reduce thread count.' },
          { error: 'JDBC query returns empty ResultSet', fix: 'Check table/column names (case-sensitive in SQLite). Verify database path is correct and file exists.' },
          { error: 'Property expansion ${...} not resolving', fix: 'Check property name spelling. Ensure source step has run before the expansion. Use ${#TestCase#prop} for TestCase-level properties.' },
        ],
      },
      {
        title: 'Performance Tips',
        steps: [
          'Increase JVM memory: Edit <SoapUI>/bin/SoapUI-*.vmoptions, set -Xmx2g.',
          'Disable response logging for load tests (speeds up execution significantly).',
          'Use "Run TestCase" without GUI for faster execution (command line runner).',
          'Close unused projects to reduce memory usage.',
          'For large JDBC results, add LIMIT clause to queries.',
          'Save project frequently -- SoapUI can lose work on crash.',
          'Use composite projects (File > Save Project As > Composite) for team collaboration.',
        ],
      },
    ],
  },
  {
    id: 'interview-speaking',
    title: 'Interview Speaking Points',
    icon: '\uD83C\uDFAF',
    subsections: [
      {
        title: 'How to Describe Your SoapUI Experience',
        steps: [
          '"I have hands-on experience with SoapUI for API testing in a banking/financial services project."',
          '"I created test suites organized by banking modules: Account Management, Fund Transfers, Loan Processing, and Payments."',
          '"I used JDBC test steps to verify API operations against the SQLite database, ensuring data integrity between the API layer and database."',
          '"I implemented data-driven testing using Excel data sources to test multiple scenarios: valid transfers, insufficient funds, invalid accounts, and edge cases like zero-amount or max-limit transfers."',
          '"I wrote Groovy scripts for dynamic test data generation, conditional test flow, and custom assertions that go beyond SoapUI built-in assertions."',
          '"I used Property Transfer to chain API calls: authenticate > get account > transfer funds > verify balance -- creating end-to-end test workflows."',
          '"I configured mock services to simulate the core banking system when it was unavailable, allowing frontend and integration testing to continue."',
          '"I performed basic load testing to verify the transfer API handles concurrent requests without data corruption or race conditions."',
        ],
      },
      {
        title: 'Key Technical Terms to Use in Interviews',
        steps: [
          'Test Automation Framework: "SoapUI served as our API test automation framework"',
          'Assertions: "I configured multiple assertion types including JsonPath, XPath, and Groovy script assertions"',
          'Data-Driven Testing: "I parameterized tests with external data sources for comprehensive coverage"',
          'Property Expansion: "I used property expansion to manage environment-specific configurations"',
          'JDBC Integration: "I verified database state directly using JDBC test steps with SQLite"',
          'Mock Services: "I created mock services to decouple testing from external system availability"',
          'Continuous Testing: "Test suites were integrated into the CI/CD pipeline for automated regression"',
          'End-to-End Validation: "I validated the complete flow from API request through database persistence"',
          'SLA Assertions: "I added response time assertions to catch performance degradation early"',
          'Negative Testing: "I covered error paths including invalid inputs, unauthorized access, and boundary conditions"',
        ],
      },
      {
        title: 'Sample Interview Answer: "Describe a challenging test scenario"',
        steps: [
          '"In our banking project, I had to test the fund transfer API for concurrency issues."',
          '"The scenario: Two transfers from the same account happening simultaneously -- the final balance had to be consistent."',
          '"Approach: I created a load test in SoapUI with 10 concurrent threads, each executing a transfer of $100 from Account 1001."',
          '"Initial balance was $5000. After 10 transfers of $100, expected balance was $4000."',
          '"I added a JDBC verification step that ran after all transfers completed to check the actual balance."',
          '"We discovered a race condition where the balance check and deduction were not atomic."',
          '"I reported this as a critical bug with reproduction steps and the load test project file."',
          '"The development team fixed it by implementing database-level locking (SELECT FOR UPDATE equivalent in SQLite using BEGIN IMMEDIATE)."',
          '"After the fix, I re-ran the load test and verified the balance was consistently correct."',
          '"This demonstrated the value of combining API testing with database verification in SoapUI."',
        ],
      },
    ],
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
    marginBottom: '28px',
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
    margin: 0,
    lineHeight: '1.6',
  },
  tocCard: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px 24px',
    marginBottom: '28px',
  },
  tocTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    margin: '0 0 12px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tocList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  tocItem: (isActive) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: isActive ? '2px solid #3b82f6' : '1px solid #d1d5db',
    background: isActive ? '#eff6ff' : '#fff',
    color: isActive ? '#2563eb' : '#374151',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.15s',
  }),
  section: {
    marginBottom: '16px',
  },
  sectionHeader: (isOpen) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    background: isOpen ? '#f0f9ff' : '#fff',
    border: isOpen ? '2px solid #3b82f6' : '1px solid #e2e8f0',
    borderRadius: isOpen ? '12px 12px 0 0' : '12px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.15s',
  }),
  sectionIcon: {
    fontSize: '22px',
    flexShrink: 0,
  },
  sectionTitle: {
    flex: 1,
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  sectionCount: {
    fontSize: '12px',
    color: '#6b7280',
    background: '#f1f5f9',
    padding: '3px 10px',
    borderRadius: '12px',
    flexShrink: 0,
  },
  chevron: (open) => ({
    fontSize: '18px',
    color: '#94a3b8',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s',
    flexShrink: 0,
  }),
  sectionBody: {
    border: '2px solid #3b82f6',
    borderTop: 'none',
    borderRadius: '0 0 12px 12px',
    padding: '20px',
    background: '#fff',
  },
  subsection: {
    marginBottom: '24px',
  },
  subsectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 12px 0',
    paddingBottom: '8px',
    borderBottom: '2px solid #e2e8f0',
  },
  stepList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  stepItem: {
    padding: '8px 0 8px 24px',
    position: 'relative',
    fontSize: '14px',
    color: '#334155',
    lineHeight: '1.6',
  },
  stepBullet: {
    position: 'absolute',
    left: '0',
    top: '12px',
    width: '8px',
    height: '8px',
    background: '#3b82f6',
    borderRadius: '50%',
  },
  codeBlock: {
    marginTop: '14px',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #334155',
  },
  codeHeader: {
    background: '#1e293b',
    color: '#94a3b8',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeBody: {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '16px',
    fontSize: '13px',
    lineHeight: '1.7',
    overflowX: 'auto',
    whiteSpace: 'pre',
    fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, monospace',
  },
  errorTable: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontSize: '13px',
    marginTop: '8px',
  },
  errorTableHead: {
    background: '#f1f5f9',
  },
  errorTableTh: {
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#475569',
    borderBottom: '2px solid #e2e8f0',
  },
  errorTableTd: {
    padding: '10px 14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
    verticalAlign: 'top',
    lineHeight: '1.5',
  },
  errorCode: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#dc2626',
    background: '#fef2f2',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    margin: '20px 0',
  },
  copyBtn: {
    background: '#475569',
    color: '#e2e8f0',
    border: 'none',
    padding: '3px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
  },
};

function SoapUIGuide() {
  const [openSections, setOpenSections] = useState({ 'admin-tasks': true });
  const [copiedId, setCopiedId] = useState(null);

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: true }));
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCopy = (code, blockId) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(blockId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>SoapUI Complete Guide</h1>
        <p style={styles.subtitle}>
          Comprehensive reference for SoapUI setup, testing operations, SQLite integration, and interview preparation.
          Use this guide for hands-on practice and interview speaking points.
        </p>
      </div>

      <div style={styles.tocCard}>
        <h3 style={styles.tocTitle}>Quick Navigation</h3>
        <div style={styles.tocList}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              style={styles.tocItem(openSections[s.id])}
              onClick={() => scrollToSection(s.id)}
            >
              {s.icon} {s.title}
            </button>
          ))}
        </div>
      </div>

      {SECTIONS.map((section) => {
        const isOpen = openSections[section.id];
        return (
          <div key={section.id} id={`section-${section.id}`} style={styles.section}>
            <div
              style={styles.sectionHeader(isOpen)}
              onClick={() => toggleSection(section.id)}
            >
              <span style={styles.sectionIcon}>{section.icon}</span>
              <h2 style={styles.sectionTitle}>{section.title}</h2>
              <span style={styles.sectionCount}>
                {section.subsections.length} topics
              </span>
              <span style={styles.chevron(isOpen)}>&#9662;</span>
            </div>

            {isOpen && (
              <div style={styles.sectionBody}>
                {section.subsections.map((sub, subIdx) => (
                  <div key={subIdx} style={styles.subsection}>
                    <h3 style={styles.subsectionTitle}>{sub.title}</h3>

                    {sub.steps && sub.steps.length > 0 && (
                      <ul style={styles.stepList}>
                        {sub.steps.map((step, stepIdx) => (
                          <li key={stepIdx} style={styles.stepItem}>
                            <span style={styles.stepBullet} />
                            {step}
                          </li>
                        ))}
                      </ul>
                    )}

                    {sub.table && (
                      <table style={styles.errorTable}>
                        <thead style={styles.errorTableHead}>
                          <tr>
                            <th style={{ ...styles.errorTableTh, width: '40%' }}>Error</th>
                            <th style={styles.errorTableTh}>Fix</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sub.table.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              <td style={styles.errorTableTd}>
                                <code style={styles.errorCode}>{row.error}</code>
                              </td>
                              <td style={styles.errorTableTd}>{row.fix}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {sub.codeBlock && (
                      <div style={styles.codeBlock}>
                        <div style={styles.codeHeader}>
                          <span>{sub.codeBlock.title} ({sub.codeBlock.language})</span>
                          <button
                            style={styles.copyBtn}
                            onClick={() => handleCopy(sub.codeBlock.code, `${section.id}-${subIdx}`)}
                          >
                            {copiedId === `${section.id}-${subIdx}` ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <pre style={styles.codeBody}>{sub.codeBlock.code}</pre>
                      </div>
                    )}

                    {subIdx < section.subsections.length - 1 && <hr style={styles.divider} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SoapUIGuide;

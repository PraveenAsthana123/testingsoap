import React, { useState } from 'react';

/* ================================================================
   LinkedIn Content Strategy - Banking API Testing Professionals
   35 Posts | 7 Categories | Expandable Cards with Full Content
   Dark Theme: #1a1a2e -> #16213e gradient, #0f3460 cards, #4ecca3 accent
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

// Category colors
const CAT_COLORS = {
  core: '#4ecca3',
  security: '#e74c3c',
  securityDeep: '#f39c12',
  tools: '#3498db',
  performance: '#9b59b6',
  interview: '#00bcd4',
  leadership: '#d4a017',
};

// Tab Definitions
const TABS = [
  { id: 'core', label: 'Core API Testing', icon: 'C', count: 5, color: CAT_COLORS.core },
  { id: 'security', label: 'Security & Compliance', icon: 'S', count: 5, color: CAT_COLORS.security },
  { id: 'securityDeep', label: 'Security Deep Dive', icon: 'D', count: 5, color: CAT_COLORS.securityDeep },
  { id: 'tools', label: 'Tools & Frameworks', icon: 'T', count: 5, color: CAT_COLORS.tools },
  { id: 'performance', label: 'Performance & Reliability', icon: 'P', count: 5, color: CAT_COLORS.performance },
  { id: 'interview', label: 'Interview & Career', icon: 'I', count: 5, color: CAT_COLORS.interview },
  { id: 'leadership', label: 'Thought Leadership', icon: 'L', count: 5, color: CAT_COLORS.leadership },
];

/* ================================================================
   DATA: TAB 1 - Core API Testing (Posts 1-5)
   ================================================================ */
const CORE_POSTS = [
  {
    id: 1,
    title: 'API Testing in Retail Banking \u2013 What Really Happens Behind the UI',
    hook: 'Every time you tap \'Transfer\' on your banking app, 7+ APIs fire in sequence. If even one fails silently...',
    content: [
      'Most banking customers never think about what happens after they tap a button on their mobile app. But behind every simple action \u2014 checking a balance, transferring funds, paying a bill \u2014 there is an intricate chain of API calls executing in milliseconds.',
      'Here is what typically happens when you tap "Transfer Funds":',
      '\u2022 Authentication API verifies your session token and MFA status\n\u2022 Account Lookup API fetches the source account details\n\u2022 Balance Check API confirms sufficient funds (including holds and pending transactions)\n\u2022 Beneficiary Validation API verifies the recipient account\n\u2022 Transaction Posting API debits the source and credits the destination\n\u2022 Notification API triggers SMS/email/push alerts to both parties\n\u2022 Audit Logging API records the entire transaction trail for compliance',
      'The UI only shows you "Transaction Successful" or "Transaction Failed." It cannot tell you if the notification failed, if the audit log was incomplete, or if the balance was calculated incorrectly. This is exactly why API testing is critical in banking.',
      'When you test at the API layer, you catch what the UI never reveals: silent failures, data inconsistencies, security gaps, and compliance violations. If you are still relying solely on UI testing for banking applications, you are missing the most important layer of quality assurance.',
    ],
    hashtags: ['#APITesting', '#BankingQA', '#QualityEngineering', '#FinTech'],
  },
  {
    id: 2,
    title: 'How I Reduced Defect Leakage Using Structured API Validation',
    hook: 'We were finding 30% of our defects in UAT. After restructuring our API testing approach, that dropped to under 5%.',
    content: [
      'The problem was clear: too many defects were escaping to UAT and even production. Our API testing existed, but it was unstructured \u2014 ad-hoc Postman requests, inconsistent assertions, no database validation. We were checking status codes and calling it done.',
      'Here is the structured approach we implemented:',
      '\u2022 Contract Analysis: Before writing a single test, we analyzed the Swagger spec line by line \u2014 every field, every constraint, every status code\n\u2022 Scenario Matrix: We built a comprehensive matrix covering positive, negative, boundary, security, and integration scenarios for every endpoint\n\u2022 Assertion-Driven Testing: Every test had explicit assertions on status code, response body structure, field values, data types, and error messages\n\u2022 Database Validation: After every API call, we ran SQL queries to verify the data was persisted correctly \u2014 not just what the API returned\n\u2022 Regression Automation: We automated the critical path scenarios with RestAssured and integrated them into our CI/CD pipeline',
      'The results spoke for themselves. Defect leakage dropped from 30% to under 5% within two sprints. The key insight was this: structured testing is not about testing more \u2014 it is about testing smarter. Every test has a purpose, every assertion validates a specific business rule, and every defect is caught at the earliest possible stage.',
      'If your API testing is not reducing your defect leakage, the problem is not your tools \u2014 it is your approach.',
    ],
    hashtags: ['#DefectPrevention', '#QATesting', '#APITesting', '#BankingTechnology'],
  },
  {
    id: 3,
    title: 'End-to-End API Testing Strategy for Core Banking Systems',
    hook: 'Testing individual APIs is easy. Testing the flow from customer onboarding to first transaction? That\'s where most teams fail.',
    content: [
      'Individual API testing gives you confidence that each endpoint works in isolation. But banking systems do not work in isolation. A real customer journey involves a chain of dependent API calls, and the data flows from one to the next.',
      'Consider this end-to-end flow:',
      '\u2022 POST /api/v1/customers \u2014 Create a new customer (returns customer_id)\n\u2022 POST /api/v1/accounts \u2014 Create a savings account linked to the customer_id\n\u2022 POST /api/v1/transactions/deposit \u2014 Make an initial deposit to the new account\n\u2022 GET /api/v1/accounts/{id}/balance \u2014 Verify the balance reflects the deposit\n\u2022 POST /api/v1/transactions/transfer \u2014 Transfer funds to another account\n\u2022 GET /api/v1/transactions/history \u2014 Verify the transaction appears in the history',
      'Each step depends on the output of the previous step. The customer_id from step 1 feeds into step 2. The account_id from step 2 feeds into step 3. If any property transfer breaks, the entire flow collapses \u2014 but individual tests would still pass.',
      'This is why E2E API testing is non-negotiable in core banking. You need to validate the entire chain: data creation, data propagation, state transitions, and final consistency. The most dangerous bugs in banking hide in the spaces between APIs, not within them.',
    ],
    hashtags: ['#CoreBanking', '#E2ETesting', '#APIStrategy', '#QualityAssurance'],
  },
  {
    id: 4,
    title: 'UI vs API vs Database Validation \u2013 The Complete QA Approach',
    hook: 'The UI said \'Transaction Successful.\' The API returned 200. But the database told a different story.',
    content: [
      'I once worked on a fund transfer feature where the UI displayed "Transaction Successful," the API returned a 200 status code with a success message, and the customer received a confirmation SMS. Everything looked perfect. But when we checked the database, the recipient account balance had not been updated.',
      'The root cause? The transaction posting service had a race condition that silently dropped the credit leg of the transfer under concurrent load. The API returned success because the debit was processed, but the credit was queued and failed silently.',
      'This is why multi-layer validation is essential in banking QA:',
      '\u2022 UI Layer: Verify the user sees correct messages, amounts, dates, and confirmations. But never trust it as the source of truth.\n\u2022 API Layer: Validate response status codes, body structure, field values, and error handling. Check both the happy path and edge cases.\n\u2022 Database Layer: Run SQL queries after every state-changing API call. Verify that accounts, transactions, balances, and audit trails are correct at the persistence level.',
      'The rule is simple: if you are only validating at one layer, you are not validating at all. In banking, the database is the ultimate source of truth. Every experienced QA engineer validates from API to database and back.',
    ],
    hashtags: ['#DatabaseTesting', '#MultiLayerQA', '#BankingQA', '#APITesting'],
  },
  {
    id: 5,
    title: 'Real Banking API Defects I Found (And How I Solved Them)',
    hook: 'Here are 5 real API defects I caught before they reached production \u2014 and the exact investigation steps I followed.',
    content: [
      'Over the years, I have caught hundreds of API defects in banking systems. Here are 5 real examples that could have caused serious production incidents:',
      '\u2022 Defect 1: Account Status Mismatch \u2014 The GET /accounts API returned status "ACTIVE" for an account that was frozen in the database. The status mapping logic had a bug that defaulted to ACTIVE for unknown status codes. Investigation: Compared API response with direct SQL query on account_status column.\n\n\u2022 Defect 2: Duplicate Transaction Creation \u2014 Calling POST /transactions twice within 100ms created two separate transactions instead of rejecting the duplicate. No idempotency check was implemented. Investigation: Sent rapid concurrent requests and checked the transaction count in the database.\n\n\u2022 Defect 3: Auth Token Bypass \u2014 Sending an expired JWT token with a modified expiry claim was accepted because the API was only checking the token format, not validating the signature. Investigation: Manually edited the JWT payload in jwt.io and replayed the request.',
      '\u2022 Defect 4: Missing Audit Trail \u2014 High-value transfers above 10 lakh were supposed to create an audit entry with maker-checker details. The audit logging was missing for transfers initiated via the mobile API (only web had it). Investigation: Executed the same transfer from both channels and compared audit_log table entries.\n\n\u2022 Defect 5: Incorrect Balance Calculation \u2014 The available balance API was not accounting for pending holds. A customer with 50,000 balance and a 30,000 hold was shown 50,000 available instead of 20,000. Investigation: Created test data with known holds and compared the API response with manual calculation.',
      'Every one of these defects was caught before production because of disciplined API testing with database validation. The pattern is always the same: observe, investigate, validate at the data layer, document with evidence.',
    ],
    hashtags: ['#DefectAnalysis', '#BankingDefects', '#APITesting', '#RootCause'],
  },
];

/* ================================================================
   DATA: TAB 2 - Security & Compliance (Posts 6-10)
   ================================================================ */
const SECURITY_POSTS = [
  {
    id: 6,
    title: 'Authentication & RBAC Testing in Financial APIs',
    hook: 'A teller could access the admin dashboard. A customer could see other accounts. These aren\'t hypothetical \u2014 they\'re real RBAC failures.',
    content: [
      'Role-Based Access Control (RBAC) is one of the most critical security layers in banking applications. It determines who can see what, who can do what, and who should be blocked from what. When RBAC fails, the consequences range from data exposure to unauthorized fund movements.',
      'Here is how I systematically test authentication and RBAC:',
      '\u2022 Valid Token Test: Authenticate with correct credentials, verify token issuance, check token contains correct role claims\n\u2022 Expired Token Test: Use a token past its expiry time, verify the API returns 401 Unauthorized\n\u2022 Wrong Role Test: Authenticate as a "Customer" role and attempt to access admin endpoints like /api/admin/users \u2014 expect 403 Forbidden\n\u2022 Missing Token Test: Send requests without any Authorization header \u2014 expect 401\n\u2022 Tampered Token Test: Modify the JWT payload (change role from "teller" to "admin") and verify the API rejects it due to signature mismatch',
      'The key to thorough RBAC testing is building a Role-Permission Matrix:',
      '\u2022 Rows = Roles (Customer, Teller, Manager, Admin, SuperAdmin)\n\u2022 Columns = API Endpoints (GET /accounts, POST /transfers, DELETE /users, GET /audit-logs)\n\u2022 Cells = Expected result (200, 403, or 401)\n\nTest every cell in the matrix. The defects you find in the "should be blocked" cells are the ones that matter most. In banking, a single RBAC failure can mean a customer accessing another customer\'s account data, or a teller executing admin-level operations without authorization.',
    ],
    hashtags: ['#SecurityTesting', '#RBAC', '#Authentication', '#BankingSecurity'],
  },
  {
    id: 7,
    title: 'How I Test Fund Transfer APIs Without Breaking Production',
    hook: 'Testing a fund transfer API wrong can move real money. Here\'s how I ensure thorough testing without production risk.',
    content: [
      'Fund transfer is the most sensitive API in any banking system. A bug in testing can move real money, create phantom transactions, or corrupt account balances. Here is how I approach fund transfer API testing safely and thoroughly.',
      'Safety measures first:',
      '\u2022 Environment Isolation: Never test against production databases. Use a dedicated QA environment with test data that mirrors production schema but contains only synthetic accounts.\n\u2022 Test Data Strategy: Create dedicated test accounts with known balances (e.g., Account A = 100,000, Account B = 50,000). Reset balances before each test run.\n\u2022 Idempotency Checks: Verify that sending the same transfer request twice (same idempotency key) does not create duplicate transactions.\n\u2022 Rollback Verification: After testing, verify that all test transactions can be identified and reversed if needed.',
      'The testing approach:',
      '\u2022 Happy Path: Transfer 10,000 from A to B. Verify: A debited, B credited, both notifications sent, audit log created, running balances updated.\n\u2022 Insufficient Funds: Attempt to transfer more than available balance. Verify: no debit, no credit, appropriate error message, no partial transaction.\n\u2022 Same Account: Attempt self-transfer. Verify: rejected with clear error.\n\u2022 Concurrent Transfers: Send 5 transfers simultaneously from the same account. Verify: no overdraft, no race condition, total debits match expected amount.\n\u2022 Cross-Currency: Transfer between accounts in different currencies. Verify: exchange rate applied correctly, both amounts accurate.',
      'The golden rule: after every transfer test, validate three things \u2014 the API response, the database state (both accounts), and the audit trail. If any one of the three is inconsistent, you have found a defect.',
    ],
    hashtags: ['#FundTransfer', '#APITesting', '#SafeTesting', '#BankingQA'],
  },
  {
    id: 8,
    title: 'Data Reconciliation Testing in Banking \u2013 My Approach',
    hook: 'If your account balance doesn\'t match between the API response and the database, you have a reconciliation problem.',
    content: [
      'Data reconciliation is the process of verifying that data is consistent across all layers and systems. In banking, even a one-rupee discrepancy can indicate a systemic issue that could scale to millions.',
      'Here is my systematic approach to data reconciliation testing:',
      '\u2022 API-to-Database Reconciliation: For every GET endpoint, compare the API response with a direct SQL query on the underlying tables. Fields like balance, status, transaction_count, and last_updated must match exactly.\n\u2022 Transaction Log Reconciliation: Sum all debits and credits in the transaction table for an account. The result must equal: opening_balance + total_credits - total_debits = current_balance.\n\u2022 Running Balance Verification: Check that each transaction record has a correct running_balance that reflects all prior transactions in chronological order.\n\u2022 Cross-Service Reconciliation: In microservices architectures, the same data may exist in multiple services (account service, transaction service, notification service). Verify consistency across all.',
      'Real example: I once found that the transaction history API was returning 47 transactions for an account, but the database had 49. The discrepancy was caused by a filter that excluded "reversed" transactions from the API but counted them in the database total. This was a valid business rule \u2014 but it was not documented, and the "total_count" field in the API response included the reversed ones, creating confusion.',
      'Reconciliation testing is not glamorous, but it is the safety net that catches the silent data corruption issues that no other type of testing reveals. In banking, reconciliation is not optional \u2014 it is a regulatory requirement.',
    ],
    hashtags: ['#DataReconciliation', '#BankingData', '#QualityAssurance', '#DatabaseTesting'],
  },
  {
    id: 9,
    title: 'Swagger to SQL \u2013 My Complete API Testing Workflow',
    hook: 'My testing workflow in 10 words: Swagger \u2192 Scenarios \u2192 Execute \u2192 Assert \u2192 SQL \u2192 Defect \u2192 Retest \u2192 Report',
    content: [
      'Every API testing engagement I start follows the same disciplined workflow. Here is the complete process from receiving the Swagger spec to publishing the final test report:',
      '\u2022 Step 1 \u2014 Swagger Analysis: Import the OpenAPI/Swagger spec. Read every endpoint, method, request schema, response schema, and status code. Document questions and ambiguities.\n\u2022 Step 2 \u2014 Scenario Design: For each endpoint, create scenarios: positive (valid input), negative (invalid input), boundary (edge values), security (auth bypass, injection), and integration (chained flows).\n\u2022 Step 3 \u2014 Test Data Preparation: Create the test data in the database or via setup APIs. Include valid, invalid, edge-case, and pre-existing data for duplicate tests.\n\u2022 Step 4 \u2014 Execution: Run each scenario in Postman or RestAssured. Capture the full request and response for evidence.',
      '\u2022 Step 5 \u2014 Assertion: Validate status code, response body structure, field values, data types, error messages, and headers. Never just check "200 OK."\n\u2022 Step 6 \u2014 SQL Validation: After every state-changing request (POST, PUT, DELETE), query the database to verify persistence. Compare API response with DB state.\n\u2022 Step 7 \u2014 Defect Logging: For every failure, log a defect with: endpoint, method, request payload, actual response, expected response, SQL evidence, and severity.\n\u2022 Step 8 \u2014 Retest: Once the fix is deployed, re-execute the exact same request. Verify the fix and run related regression tests.\n\u2022 Step 9 \u2014 Reporting: Compile the test execution report with pass/fail counts, defect summary, coverage metrics, and recommendations.',
      'This workflow works for every project, every domain, every API. The discipline is in following every step for every endpoint, not just the critical ones. The defects that escape to production are always in the endpoints we skipped because they "looked simple."',
    ],
    hashtags: ['#Swagger', '#SQLTesting', '#TestWorkflow', '#APITesting'],
  },
  {
    id: 10,
    title: 'Handling 500 Errors in Banking APIs \u2013 Root Cause & Fix Strategy',
    hook: 'A 500 error in a banking API isn\'t just a server error \u2014 it could mean a customer\'s transaction is stuck in limbo.',
    content: [
      'In banking systems, a 500 Internal Server Error is never "just a server error." It could mean a customer\'s money was debited but not credited, a loan application is stuck in processing, or an audit trail has a gap. Every 500 error in banking deserves a thorough investigation.',
      'Here is my systematic approach to investigating 500 errors:',
      '\u2022 Step 1 \u2014 Capture the Correlation ID: Every banking API should include a correlation_id or trace_id in the response headers. This is your tracking number for the investigation.\n\u2022 Step 2 \u2014 Log Analysis: Search the application logs using the correlation ID. Look for the exact exception: NullPointerException? Database timeout? External service failure? The stack trace tells the story.\n\u2022 Step 3 \u2014 Payload Reproduction: Take the exact request payload that caused the 500 and replay it in the test environment. Can you reproduce it consistently? If so, the root cause is in the code. If it is intermittent, it is likely a resource or concurrency issue.',
      '\u2022 Step 4 \u2014 Database State Check: Query the database to see the state of the affected record. Was the transaction partially committed? Is the account in an inconsistent state? This tells you whether you have a data integrity issue.\n\u2022 Step 5 \u2014 Layer Isolation: Determine where the failure occurred. Was it at the API gateway (routing/auth)? The application service (business logic)? The database layer (query/connection)? Or an external service (payment gateway, notification)?\n\u2022 Step 6 \u2014 Document and Report: Log the defect with full evidence: the request, the 500 response, the correlation ID, the log excerpt, the DB state, and your root cause analysis.',
      'The most dangerous 500 errors are the ones that happen silently \u2014 the API returns 500, but the client retries and gets a 200 on the second attempt, never realizing the first request partially completed. Always check for orphaned data after 500 errors.',
    ],
    hashtags: ['#ErrorHandling', '#500Error', '#RootCauseAnalysis', '#BankingAPI'],
  },
];

/* ================================================================
   DATA: TAB 3 - Security Deep Dive (Posts 11-15)
   ================================================================ */
const SECURITY_DEEP_POSTS = [
  {
    id: 11,
    title: 'API Security Testing in Banking \u2013 Beyond Functional Testing',
    hook: 'Functional testing checks if the API works. Security testing checks if it can be broken.',
    content: [
      'Most QA teams stop at functional testing: does the API return the correct data for valid inputs? But in banking, functional correctness is only half the battle. The other half is ensuring the API cannot be exploited, manipulated, or abused.',
      'Here are the OWASP API Security Top 10 risks applied to banking:',
      '\u2022 Broken Object Level Authorization (BOLA): Can Customer A access Customer B\'s account by changing the account_id in the URL? Test: Replace your account ID with another valid ID in GET /accounts/{id}.\n\u2022 Broken Authentication: Can an attacker bypass login with expired tokens, weak passwords, or missing MFA? Test: Send requests with expired, malformed, and missing tokens.\n\u2022 Excessive Data Exposure: Does the API return more data than the client needs? Test: Check if GET /customers returns SSN, full card numbers, or internal IDs that should be masked.\n\u2022 Lack of Rate Limiting: Can an attacker brute-force OTPs or passwords? Test: Send 1000 login attempts in 60 seconds and check if the account gets locked.\n\u2022 Injection: Can SQL or NoSQL injection payloads pass through input fields? Test: Send payloads like \' OR 1=1-- in search fields and account numbers.',
      '\u2022 Mass Assignment: Can an attacker modify fields they should not have access to? Test: Include "role": "admin" or "balance": 999999 in a customer update request.\n\u2022 Security Misconfiguration: Are debug endpoints exposed? Are CORS headers too permissive? Test: Check for /debug, /actuator, /swagger in production.\n\u2022 Server-Side Request Forgery (SSRF): Can the API be tricked into making requests to internal services? Test: Provide internal URLs in webhook or callback fields.',
      'Security testing is not a separate phase \u2014 it should be embedded in every sprint. For every endpoint you test functionally, add at least 3 security test cases. In banking, a single security vulnerability can result in regulatory penalties, financial losses, and permanent reputation damage.',
    ],
    hashtags: ['#APISecurity', '#OWASP', '#BankingSecurity', '#CyberSecurity'],
  },
  {
    id: 12,
    title: 'Token Tampering & Authorization Bypass \u2013 Real Scenario',
    hook: 'I modified one character in the JWT payload and suddenly had admin access. Here\'s how I caught it.',
    content: [
      'JSON Web Tokens (JWT) are the standard for API authentication in modern banking systems. But a poorly implemented JWT validation can be a massive security hole. Here is a real scenario I encountered during security testing.',
      'The vulnerability:',
      '\u2022 The banking API issued JWT tokens with this payload: {"user_id": "12345", "role": "customer", "exp": 1735689600}\n\u2022 I decoded the token using jwt.io, changed "role" from "customer" to "admin", and re-encoded it\n\u2022 I sent the modified token in the Authorization header\n\u2022 The API accepted it and returned admin-level data\n\nThe root cause? The API was checking if the token was valid JSON and not expired, but it was NOT validating the cryptographic signature. It was using the "none" algorithm vulnerability \u2014 one of the most common JWT implementation flaws.',
      'Here is how to properly test JWT security:',
      '\u2022 Signature Validation: Modify the payload without re-signing. The API must reject it with 401.\n\u2022 Algorithm Confusion: Change the algorithm header from RS256 to "none" or HS256. The API must reject it.\n\u2022 Expired Token: Use a token past its expiry. Must return 401.\n\u2022 Role Escalation: Change role claims. Must return 403 on restricted endpoints.\n\u2022 Token from Different Environment: Use a staging token against production. Must be rejected.\n\u2022 Missing Claims: Remove required claims (user_id, role). Must be rejected.',
      'When you find an authorization bypass, document it with extreme care: the exact steps to reproduce, the expected vs actual behavior, the risk assessment, and the recommended fix. This is the type of defect that gets escalated to the CISO, and your documentation needs to be bulletproof.',
    ],
    hashtags: ['#JWT', '#TokenSecurity', '#AuthBypass', '#SecurityTesting'],
  },
  {
    id: 13,
    title: 'Audit Trail & Logging Validation in Financial APIs',
    hook: 'In banking, if it\'s not logged, it didn\'t happen. Regulators will ask for proof.',
    content: [
      'Financial regulators do not care about your test cases or your code coverage. They care about one thing: can you prove what happened? Every transaction, every access, every change must have an immutable audit trail. As a QA engineer, validating this audit trail is one of your most important responsibilities.',
      'Here is what I validate in audit trail testing:',
      '\u2022 Created By / Modified By: Every record must track who created it and who last modified it. Test: Create a transaction as User A, modify it as User B, verify both usernames are recorded.\n\u2022 Timestamps: Every action must have a precise UTC timestamp. Test: Verify created_at and updated_at are populated, in correct format, and in chronological order.\n\u2022 Transaction Logs: Every financial transaction must log: transaction_id, source_account, destination_account, amount, currency, status, initiated_by, approved_by, timestamp, and correlation_id.\n\u2022 State Change Tracking: Every status change (PENDING -> APPROVED -> COMPLETED) must be logged as a separate audit entry with before/after values.\n\u2022 Correlation IDs: Every API request must generate a unique correlation ID that links all related log entries across microservices.',
      'Regulatory requirements that mandate audit trails:',
      '\u2022 SOX (Sarbanes-Oxley): Requires financial transaction audit trails with maker-checker controls for publicly traded companies\n\u2022 PCI-DSS: Requires logging of all access to cardholder data, with 1-year retention minimum\n\u2022 RBI Guidelines: Requires banks to maintain transaction logs for 10 years\n\u2022 GDPR: Requires logging of all access to personal data, with data subject access request support',
      'My testing approach: After every state-changing API call, I query the audit_log table and verify every required field is present, accurate, and complete. If a single field is missing, it is a compliance defect \u2014 not a minor bug.',
    ],
    hashtags: ['#AuditTrail', '#Compliance', '#RegulatoryTesting', '#BankingQA'],
  },
  {
    id: 14,
    title: 'Encryption & Sensitive Data Masking \u2013 QA Perspective',
    hook: 'I found SSN numbers in plain text in the API response. That\'s not a bug \u2014 it\'s a compliance violation.',
    content: [
      'Finding Personally Identifiable Information (PII) in plain text in an API response is not a regular bug. It is a compliance violation that can result in regulatory fines, legal action, and loss of customer trust. As a QA engineer in banking, you are the last line of defense against data exposure.',
      'Here is my comprehensive data masking and encryption testing approach:',
      '\u2022 API Response Masking: Check every endpoint that returns customer data. Card numbers should show only last 4 digits (****1234). Aadhaar/SSN should be masked (XXXX-XXXX-9012). Email should show partial (r***@email.com). Phone should show partial (+91-****3210).\n\u2022 Database Encryption: Connect to the database and check sensitive columns directly. Card numbers, passwords, and security answers must be encrypted (not readable text). Look for AES-256 or similar encryption.\n\u2022 Log File Review: Search application logs for PII patterns. Grep for card number formats, email addresses, phone numbers. Sensitive data must never appear in log files.\n\u2022 Error Response Audit: Trigger error responses and check if they leak internal details \u2014 database column names, stack traces, or customer data in error messages.',
      'Testing encryption at rest and in transit:',
      '\u2022 At Rest: Query the database for sensitive columns. Verify the stored value is encrypted (gibberish, not readable text). Verify the encryption key is not stored in the same database.\n\u2022 In Transit: Use a proxy tool (Burp Suite, mitmproxy) to inspect the wire format. Verify TLS 1.2+ is enforced. Verify sensitive fields are not sent as URL parameters (which get logged in server access logs).\n\u2022 Key Rotation: Verify that after encryption key rotation, existing encrypted data can still be decrypted (backward compatibility).',
      'Every data masking defect I find gets classified as "Critical" with a compliance tag. These are not negotiable fixes \u2014 they are regulatory requirements. If you find PII in plain text, escalate immediately.',
    ],
    hashtags: ['#DataMasking', '#Encryption', '#PIIProtection', '#ComplianceTesting'],
  },
  {
    id: 15,
    title: 'Regulatory-Ready API Testing for Financial Systems',
    hook: 'Your APIs need to pass the audit before they pass the user acceptance test.',
    content: [
      'Building banking APIs that pass regulatory audits requires testing that goes far beyond functional correctness. Regulators evaluate your systems against specific compliance frameworks, and your API testing must address each one.',
      'Key regulatory testing areas:',
      '\u2022 KYC (Know Your Customer) Validation: Test the customer onboarding API flow \u2014 identity verification, document upload, address proof, PAN/Aadhaar validation. Verify that incomplete KYC blocks account activation. Test that re-KYC is triggered at the mandated intervals.\n\u2022 AML (Anti-Money Laundering) Screening: Test that high-value transactions trigger AML alerts. Verify that suspicious patterns (structuring, rapid movement) are flagged. Test sanctions list screening against known test entries.\n\u2022 PCI-DSS Compliance: Verify card data is tokenized before storage. Test that card numbers are never logged. Verify access controls on cardholder data endpoints. Test that TLS is enforced on all card-related APIs.',
      '\u2022 SOX Audit Trail: Verify maker-checker workflow for all financial operations. Test that every transaction has a complete audit trail. Verify separation of duties (the person who initiates cannot approve).\n\u2022 GDPR Data Handling: Test the "right to be forgotten" API \u2014 does it remove all PII? Verify consent management APIs record and enforce customer preferences. Test data portability \u2014 can a customer export their data?\n\u2022 RBI Digital Lending Guidelines: Verify cooling-off period enforcement. Test that loan terms are disclosed via API before agreement. Verify that customer data is not shared with unauthorized third parties.',
      'My approach: I maintain a regulatory compliance test suite that runs as part of every release. Each test is tagged with the specific regulation it validates (e.g., "PCI-DSS-3.4", "AML-CTF-Rule-7"). During audits, I can produce a compliance coverage report showing which regulations are tested and which are passing. This turns QA from a cost center into a compliance enabler.',
    ],
    hashtags: ['#Regulatory', '#PCI', '#AML', '#FinancialCompliance'],
  },
];

/* ================================================================
   DATA: TAB 4 - Tools & Frameworks (Posts 16-20)
   ================================================================ */
const TOOLS_POSTS = [
  {
    id: 16,
    title: 'Postman + SQL + JIRA \u2013 My Daily API Testing Stack',
    hook: 'You don\'t need 20 tools. Here\'s how I test banking APIs with just 3.',
    content: [
      'I have seen teams spend months evaluating testing tools, building custom frameworks, and integrating complex toolchains. Meanwhile, defects are shipping to production. The truth is, you can cover 90% of your API testing needs with just three tools: Postman, SQL, and JIRA.',
      'Here is my daily workflow with this stack:',
      '\u2022 Postman \u2014 Execute & Assert: I organize my requests into collections (one per module: Accounts, Transactions, Customers). Each request has pre-request scripts for dynamic data (timestamps, UUIDs) and test scripts for assertions (status code, body structure, field values). I use environment variables to switch between DEV, QA, and STAGING.\n\u2022 SQL (DBeaver/SQLite) \u2014 Validate Persistence: After every state-changing API call, I open my SQL client and run validation queries. Did the account get created? Is the balance correct? Was the audit log entry written? This catches the silent failures that Postman cannot see.\n\u2022 JIRA \u2014 Track & Report: Every defect gets logged with a structured template: Endpoint, Method, Payload, Expected vs Actual, SQL Evidence, Screenshot, Severity, Priority. I link defects to user stories for traceability.',
      'Why this stack works:',
      '\u2022 Zero setup time: Postman is installed in 5 minutes, SQL clients are free, JIRA is already in every organization\n\u2022 Full coverage: API execution + database validation + defect tracking covers the entire testing lifecycle\n\u2022 Evidence-rich: Every defect has API response + SQL proof, making it impossible for developers to dispute\n\u2022 Scalable: Postman collections can be exported to Newman for CI/CD automation',
      'Do not let tool paralysis stop you from testing effectively. Master these three tools first, then add automation frameworks when the volume demands it.',
    ],
    hashtags: ['#Postman', '#SQL', '#JIRA', '#TestingTools'],
  },
  {
    id: 17,
    title: 'SOAP vs REST Testing \u2013 Real Banking Comparison',
    hook: 'Legacy banking runs on SOAP. Modern banking runs on REST. Most banks run both.',
    content: [
      'If you work in banking technology, you will encounter both SOAP and REST APIs. Legacy core banking systems (Finacle, T24, Flexcube) expose SOAP web services. Modern digital banking layers expose REST APIs. Understanding both is essential for a banking QA engineer.',
      'Side-by-side comparison:',
      '\u2022 Protocol: SOAP is a strict protocol with XML envelope, header, and body. REST is an architectural style using HTTP methods (GET, POST, PUT, DELETE) with flexible formats.\n\u2022 Data Format: SOAP uses XML exclusively. REST supports JSON, XML, plain text, and binary.\n\u2022 Contract: SOAP uses WSDL (Web Services Description Language). REST uses OpenAPI/Swagger.\n\u2022 Security: SOAP has built-in WS-Security (digital signatures, encryption). REST uses OAuth 2.0, JWT, and API keys.\n\u2022 Error Handling: SOAP returns SOAP Faults with structured error codes. REST uses HTTP status codes (400, 401, 404, 500).',
      'Testing tool comparison:',
      '\u2022 SOAP Testing: SoapUI is the gold standard. Import the WSDL, it auto-generates requests for every operation. Assertions include XPath Match, Schema Compliance, and SOAP Fault validation.\n\u2022 REST Testing: Postman is the most popular. Import the Swagger spec, build collections, write JavaScript test scripts. RestAssured (Java) for automation.\n\u2022 Both: SoapUI supports both SOAP and REST. ReadyAPI (commercial) provides advanced features for both protocols.',
      'Banking-specific example: A fund transfer might start as a REST call from the mobile app (POST /api/v1/transfers), which internally calls a SOAP service on the core banking system (TransferFunds operation in the CBS WSDL). Your testing must cover both the REST layer and the SOAP layer, validating that the data transformation between them is correct.',
    ],
    hashtags: ['#SOAP', '#REST', '#APIComparison', '#BankingTech'],
  },
  {
    id: 18,
    title: 'Automating Banking APIs with RestAssured',
    hook: 'Manual API testing doesn\'t scale. Here\'s how I automated 200+ banking API test cases with RestAssured.',
    content: [
      'When your banking API test suite grows beyond 50 test cases, manual execution becomes a bottleneck. You spend more time running tests than analyzing results. That is when automation becomes essential, and RestAssured is the best tool for the job in Java-based banking teams.',
      'Here is how I set up RestAssured for banking API automation:',
      '\u2022 Project Setup: Maven project with RestAssured, TestNG, and ExtentReports dependencies. Separate config files for each environment (dev.properties, qa.properties, staging.properties).\n\u2022 Base Configuration: Create a base test class with RestAssured.baseURI, authentication headers, content type defaults, and response time SLA assertions.\n\u2022 Request Building: Use RestAssured\'s fluent API for readable tests:\n  given().header("Authorization", "Bearer " + token).body(payload)\n  .when().post("/api/v1/accounts")\n  .then().statusCode(201).body("account_id", notNullValue());',
      '\u2022 Response Validation: Go beyond status codes. Validate JSON schema with JsonSchemaValidator. Check field values with Hamcrest matchers. Validate headers, cookies, and response time.\n\u2022 Data-Driven Testing: Use TestNG @DataProvider to feed test data from Excel/CSV. Run the same test with 50 different input combinations.\n\u2022 Database Validation: Integrate JDBC calls after API execution to verify database state. Compare API response with direct SQL query results.\n\u2022 CI/CD Integration: Configure Maven Surefire plugin to run tests. Integrate with Jenkins/GitHub Actions. Generate ExtentReports and JUnit XML for pipeline dashboards.',
      'Results: We automated 200+ test cases covering 45 endpoints across 8 banking modules. The suite runs in 12 minutes and catches regression defects that would take 2 days to find manually. Every code deployment now triggers the suite automatically, and no code reaches production without passing all 200+ assertions.',
    ],
    hashtags: ['#RestAssured', '#TestAutomation', '#JavaTesting', '#APIAutomation'],
  },
  {
    id: 19,
    title: 'CI/CD Integrated API Regression Strategy',
    hook: 'Every deployment triggers 150 API regression tests. If any fail, the build stops. Here\'s how we set it up.',
    content: [
      'A regression test suite that runs manually is a regression test suite that does not run often enough. In banking, where deployments happen weekly and hotfixes can happen daily, your API regression tests must be integrated into the CI/CD pipeline and run automatically on every code change.',
      'Here is our CI/CD integrated regression strategy:',
      '\u2022 Pipeline Trigger: Every push to the develop branch triggers the pipeline. Every pull request to main triggers it. Hotfix branches trigger it with a reduced "critical path only" suite.\n\u2022 Test Runner: We use Newman (Postman CLI) for the quick smoke suite (30 tests, 2 minutes) and Maven with RestAssured for the full regression suite (150 tests, 12 minutes).\n\u2022 Pipeline Stages:\n  Stage 1: Lint and compile (1 min)\n  Stage 2: Unit tests (3 min)\n  Stage 3: API smoke tests \u2014 Newman (2 min)\n  Stage 4: API regression tests \u2014 RestAssured (12 min)\n  Stage 5: Security scan \u2014 OWASP ZAP (5 min)\n  Stage 6: Build and deploy to staging (3 min)',
      '\u2022 Pass/Fail Thresholds: If any test fails in Stage 3 or 4, the pipeline stops. No deployment happens. The developer is notified via Slack with the failure details.\n\u2022 Report Generation: ExtentReports HTML report is generated and attached to the pipeline artifacts. JUnit XML is parsed for dashboard metrics.\n\u2022 Notification Setup: Slack webhook sends a summary: "Regression Suite: 148/150 PASSED, 2 FAILED. Failures: POST /transfers (500 error), GET /accounts (schema mismatch). Build BLOCKED."',
      'The investment in CI/CD integration paid for itself in the first month. We caught 12 regression defects before they reached QA, saving approximately 3 days of manual testing and defect remediation per sprint. The pipeline is now the team\'s safety net \u2014 no one deploys without green tests.',
    ],
    hashtags: ['#CICD', '#Regression', '#DevOps', '#APITesting'],
  },
  {
    id: 20,
    title: 'Contract Testing with Swagger \u2013 Preventing Production Defects',
    hook: 'The API broke because the backend team changed a field name. Contract testing would have caught it in 5 minutes.',
    content: [
      'It is 3 PM on a Friday. The frontend team deploys a new feature. It immediately crashes because the backend team renamed "account_number" to "accountNo" in the API response. No one communicated the change. No test caught it. The customers are affected for 2 hours.',
      'This is exactly the type of defect that contract testing prevents.',
      '\u2022 What is Contract Testing? A contract test validates that an API implementation matches its documented specification (Swagger/OpenAPI). It checks: field names, data types, required vs optional fields, status codes, and response structure. If the contract says the response has "account_number" (string, required), and the API returns "accountNo," the contract test fails.\n\u2022 How to Implement: Start with your OpenAPI/Swagger spec as the single source of truth. Use tools like Schemathesis, Dredd, or a custom RestAssured validator to compare actual responses against the spec. Run contract tests in CI/CD before every deployment.',
      '\u2022 Automated Schema Validation: For every API response, validate against the OpenAPI schema:\n  - All required fields are present\n  - Data types match (string, integer, boolean, array)\n  - Enum values are within the defined set\n  - Nested object structures match the schema\n  - Array item schemas are validated\n\u2022 Versioning Strategy: Never modify a deployed API contract. Instead, version the API (/api/v1/, /api/v2/). Deprecate old versions with a sunset header. This gives consumers time to migrate.',
      'Contract testing shifts defect detection from "after deployment" to "before deployment." It is the simplest, most cost-effective testing practice you can adopt. If you do nothing else from this post, start validating your API responses against your Swagger spec. You will catch contract drift before it becomes a production incident.',
    ],
    hashtags: ['#ContractTesting', '#Swagger', '#OpenAPI', '#ShiftLeft'],
  },
];

/* ================================================================
   DATA: TAB 5 - Performance & Reliability (Posts 21-25)
   ================================================================ */
const PERFORMANCE_POSTS = [
  {
    id: 21,
    title: 'Load Testing Fund Transfer APIs \u2013 Lessons Learned',
    hook: 'Our fund transfer API handled 100 concurrent users fine. At 500, it started creating duplicate transactions.',
    content: [
      'Load testing in banking is not about finding the breaking point. It is about finding the point where data integrity breaks. An API might continue responding with 200 OK under heavy load, but behind the scenes, it could be creating duplicate records, skipping audit logs, or miscalculating balances.',
      'Here are the lessons I learned from load testing fund transfer APIs:',
      '\u2022 Lesson 1 \u2014 Thread Safety Matters: At 100 concurrent users, our transfer API worked perfectly. At 500, we discovered race conditions in the balance check. Two concurrent requests would both read the same balance, both pass the "sufficient funds" check, and both execute \u2014 resulting in an overdraft.\n\u2022 Lesson 2 \u2014 Database Locks: Under high concurrency, database row locks caused timeouts. Transactions that should complete in 200ms were taking 8 seconds. The fix was optimizing the locking strategy and adding retry logic.\n\u2022 Lesson 3 \u2014 Duplicate Prevention: Without proper idempotency enforcement, retry logic in the client created duplicate transactions. Load testing exposed this because network timeouts triggered retries.',
      '\u2022 Lesson 4 \u2014 Connection Pool Exhaustion: At 500 concurrent users, the database connection pool (max 50 connections) was exhausted. New requests waited in the queue and eventually timed out. We had to tune the pool size and add circuit breaker logic.\n\u2022 Lesson 5 \u2014 Notification Queue Overflow: The SMS/email notification queue could not keep up with the transaction volume. Notifications were delayed by 30+ minutes. We separated the notification service and added a dedicated message queue.',
      'The load testing tool stack: JMeter for simulating concurrent users, with custom thread groups that mimic real user behavior (login, check balance, transfer, verify). After the load test, we ran a full data reconciliation to verify every transaction was correct. Load testing without data validation is meaningless in banking.',
    ],
    hashtags: ['#LoadTesting', '#PerformanceTesting', '#BankingAPI', '#Concurrency'],
  },
  {
    id: 22,
    title: 'Handling Peak Banking Traffic \u2013 API QA Strategy',
    hook: 'Month-end. Payroll day. Tax season. These aren\'t just busy days \u2014 they\'re when your APIs face their real test.',
    content: [
      'Banking traffic is not uniform. There are predictable peaks that can be 10x normal volume, and your APIs need to handle them without degradation, data loss, or downtime. As a QA engineer, your job is to simulate these peaks and verify system resilience.',
      'Identifying peak patterns:',
      '\u2022 Month-End: Salary credits, loan EMI debits, interest calculations, statement generation. Bulk batch processing + high user activity simultaneously.\n\u2022 Quarter-End: Advance tax payments, GST filings, corporate fund movements. API volume spikes from both retail and corporate channels.\n\u2022 Festival Season: Shopping transactions spike 5-10x. UPI and card payment APIs under extreme load. Offer redemption APIs face surge.\n\u2022 Payroll Day (1st and 15th): Bulk salary credit APIs process thousands of transactions. Employees immediately check balances and make transfers.',
      'My peak traffic testing strategy:',
      '\u2022 Baseline Measurement: Measure normal traffic patterns (TPS, response time, error rate) for 1 week. This is your comparison point.\n\u2022 Stress Testing: Gradually increase load to 2x, 5x, and 10x baseline. Identify the breaking point and the degradation curve.\n\u2022 Spike Testing: Simulate sudden traffic spikes (0 to 10x in 30 seconds). Verify auto-scaling triggers, circuit breakers activate, and graceful degradation works.\n\u2022 Soak Testing: Run at 2x load for 4-8 hours. Look for memory leaks, connection pool leaks, and gradual performance degradation.\n\u2022 Failover Testing: Kill a server instance during peak load. Verify traffic redirects to healthy instances without data loss.',
      'The goal is not to prevent peak traffic \u2014 it is to ensure your APIs handle it gracefully. Better to find the limits in a test environment than to discover them when 100,000 customers are trying to check their salary credits.',
    ],
    hashtags: ['#PeakTraffic', '#StressTesting', '#BankingPerformance', '#APIResilience'],
  },
  {
    id: 23,
    title: 'Batch Processing API Testing \u2013 Month-End Challenges',
    hook: 'Month-end batch processing failed at 2 AM. 50,000 interest calculations were wrong. Here\'s what we learned.',
    content: [
      'Batch processing is the backbone of banking operations. Interest calculations, statement generation, loan EMI processing, regulatory reporting \u2014 all run as batch jobs, typically overnight or at month-end. When these batches fail, the impact is massive.',
      'The incident that taught us:',
      '\u2022 Context: Month-end interest calculation batch for 500,000 savings accounts. The batch API processes accounts in chunks of 1,000.\n\u2022 What Happened: At chunk 51 (account 50,001), the batch encountered an account with a negative balance edge case. The calculation threw an unhandled exception. The batch stopped.\n\u2022 The Problem: Chunks 1-50 were already committed. Chunk 51 partially completed. Chunks 52-500 never ran. The batch showed "COMPLETED" status because the error was swallowed.\n\u2022 The Impact: 50,000 accounts had correct interest. 450,000 accounts had no interest calculated. The batch status was misleading.',
      'What we now test for every batch API:',
      '\u2022 Large Volume Processing: Run the batch with realistic data volumes, not just 10 test records. The bugs appear at scale.\n\u2022 Timeout Handling: Set realistic timeouts and verify the batch handles them gracefully \u2014 checkpoint, resume, or rollback.\n\u2022 Partial Failure Recovery: Inject failures at various points. Verify the batch can resume from the last successful checkpoint, not restart from the beginning.\n\u2022 Data Consistency Validation: After the batch completes, run reconciliation queries. Sum of interest calculated must match expected total. Every account must have an interest entry.\n\u2022 Status Reporting: The batch status API must accurately reflect: RUNNING, COMPLETED, FAILED, or PARTIALLY_COMPLETED with counts (processed: 50000, failed: 2, skipped: 0).\n\u2022 Monitoring: Batch progress should be visible in real-time \u2014 percentage complete, current chunk, estimated time remaining.',
    ],
    hashtags: ['#BatchProcessing', '#MonthEnd', '#BankingOps', '#DataIntegrity'],
  },
  {
    id: 24,
    title: 'Performance Bottlenecks in Banking APIs',
    hook: 'The API response time went from 200ms to 8 seconds. The fix wasn\'t in the API \u2014 it was a missing database index.',
    content: [
      'Performance bottlenecks in banking APIs rarely show up during development with 100 test records. They appear in production with 10 million records. Here are the most common bottleneck patterns I have encountered and how to identify each one.',
      'Bottleneck 1 \u2014 Missing Database Indexes:',
      '\u2022 Symptom: A GET endpoint that was fast in development becomes unbearably slow in production.\n\u2022 Diagnosis: Run EXPLAIN ANALYZE on the underlying SQL query. If you see "Seq Scan" instead of "Index Scan," you found the problem.\n\u2022 Fix: Add indexes on columns used in WHERE, ORDER BY, and JOIN clauses.\n\u2022 Real Example: GET /transactions?account_id=123&date_from=2024-01-01 was doing a full table scan on 50 million rows. Adding a composite index on (account_id, created_at) reduced response time from 8 seconds to 120ms.',
      'Bottleneck 2 \u2014 N+1 Query Problem:\n\u2022 Symptom: An endpoint that returns a list of accounts with their recent transactions makes 1 query for the accounts list + N separate queries for each account\'s transactions.\n\u2022 Diagnosis: Enable SQL query logging and count the queries per request. If a list of 50 accounts generates 51 queries, you have N+1.\n\u2022 Fix: Use JOIN queries or batch fetching to load related data in a single query.\n\nBottleneck 3 \u2014 Connection Pool Exhaustion:\n\u2022 Symptom: API response times suddenly spike for all endpoints simultaneously.\n\u2022 Diagnosis: Monitor active database connections. If they hit the pool maximum, new requests wait in queue.\n\u2022 Fix: Tune pool size, add connection timeout, implement connection recycling.',
      'Bottleneck 4 \u2014 Serialization Overhead:\n\u2022 Symptom: The database query is fast (50ms) but the API response takes 2 seconds.\n\u2022 Diagnosis: Profile the API handler. If serialization (converting DB rows to JSON) takes most of the time, you are serializing too much data.\n\u2022 Fix: Paginate results, select only needed columns, use streaming for large datasets.\n\nAs a QA engineer, you do not need to fix these issues, but you need to identify them. Track response times, report deviations, and provide the diagnostic evidence that helps developers pinpoint the root cause.',
    ],
    hashtags: ['#PerformanceBottleneck', '#DatabaseOptimization', '#APIPerformance', '#QAInsights'],
  },
  {
    id: 25,
    title: 'Observability in API Testing \u2013 Logs, Traces & Monitoring',
    hook: 'If you can\'t see what your API is doing in production, you\'re flying blind.',
    content: [
      'Testing does not stop at deployment. In modern banking systems, observability \u2014 the ability to understand what your system is doing in real-time \u2014 is an extension of quality assurance. As a QA engineer, you should be contributing to and validating the observability stack.',
      'The three pillars of observability:',
      '\u2022 Logs: Structured JSON logs with correlation IDs, timestamps, request details, and error stack traces. QA validates: Are logs being generated for every API call? Do they contain the required fields? Are sensitive fields masked? Can you trace a request from start to finish using the correlation ID?\n\u2022 Traces: Distributed tracing (Jaeger, Zipkin, or AWS X-Ray) that shows the journey of a request across microservices. QA validates: Can you see the full trace for a fund transfer from API gateway -> account service -> transaction service -> notification service? Are spans correctly nested? Are latency measurements accurate?\n\u2022 Metrics: Quantitative measurements like response time (p50, p95, p99), error rate, request count, and queue depth. QA validates: Are metric dashboards showing accurate data? Do alerts trigger at the correct thresholds?',
      'How QA contributes to observability:',
      '\u2022 Log Validation Testing: Run test scenarios and verify the correct log entries are created. Missing logs = missing evidence during incidents.\n\u2022 Trace Completeness Testing: Execute end-to-end flows and verify the trace shows all service hops. Missing spans = blind spots in incident investigation.\n\u2022 Alert Testing: Deliberately trigger error conditions (kill a service, exhaust connections) and verify that alerts fire within the expected timeframe.\n\u2022 Dashboard Verification: Compare dashboard metrics with actual test execution counts. If you ran 100 requests and the dashboard shows 95, investigate the gap.',
      'Observability is not a DevOps-only concern. QA engineers who understand and validate observability become invaluable to the team. When a production incident occurs at 2 AM, the quality of your logs, traces, and alerts determines whether the team resolves it in 5 minutes or 5 hours.',
    ],
    hashtags: ['#Observability', '#Monitoring', '#Logging', '#Tracing'],
  },
];

/* ================================================================
   DATA: TAB 6 - Interview & Career (Posts 26-30)
   ================================================================ */
const INTERVIEW_POSTS = [
  {
    id: 26,
    title: 'How to Explain API Testing in Banking During Interviews',
    hook: 'Stop saying \'I used Postman to test APIs.\' Here\'s how to explain it like a quality engineer.',
    content: [
      'When interviewers ask "Tell me about your API testing experience," most candidates say: "I used Postman to send requests and checked the status code." This answer tells the interviewer nothing about your skill level, your approach, or your understanding of quality engineering.',
      'Here is the structured explanation framework that transforms your answer:',
      '\u2022 Contract Analysis: "I start by analyzing the API specification \u2014 Swagger or WSDL. I document every endpoint, method, request/response schema, status code, and business rule. I identify mandatory vs optional fields and inter-field dependencies."\n\u2022 Scenario Design: "For each endpoint, I design a scenario matrix covering positive flows, negative inputs, boundary values, security cases (auth bypass, injection), and integration with upstream/downstream APIs."\n\u2022 Assertion-Driven Execution: "I do not just check if the API returns 200. I validate the complete response \u2014 body structure, field values, data types, error messages, headers, and response time."\n\u2022 Database Validation: "After every state-changing call, I run SQL queries to verify the data was persisted correctly. The API response and the database must be consistent."',
      '\u2022 Defect Documentation: "When I find a defect, I document it with evidence: the request payload, actual response, expected response, SQL query results, and root cause analysis. Every defect is reproducible and traceable."\n\u2022 Regression Automation: "I automate critical path scenarios with RestAssured and integrate them into the CI/CD pipeline. Every deployment triggers the regression suite."',
      'See the difference? The first answer describes a tool. The second answer describes an engineering approach. Interviewers hire engineers, not tool operators. Practice this framework until it becomes natural, and you will stand out in every API testing interview.',
    ],
    hashtags: ['#InterviewPrep', '#QAInterview', '#APITesting', '#CareerGrowth'],
  },
  {
    id: 27,
    title: 'Real API Testing Story Using STAR Method',
    hook: 'Situation: The deposit API returned success but the balance didn\'t update. Here\'s my complete STAR answer.',
    content: [
      'The STAR method (Situation, Task, Action, Result) is the most effective way to answer behavioral interview questions. Here is a complete STAR story from my banking API testing experience:',
      'SITUATION: I was testing the CRM integration module for a retail banking application. The system allowed bank employees to create customer accounts, process deposits, and link accounts to the CRM for relationship management. During integration testing, I noticed that the deposit API returned a 200 success response, but the account balance was not updating in the CRM view.',
      'TASK: My task was to investigate the data integrity issue, identify the root cause, determine the impact, and ensure the fix was validated before the production release scheduled for the following week.',
      'ACTION: Here are the 9 steps I followed:\n\u2022 Step 1: Reproduced the issue by executing POST /api/v1/deposits with a test account and verifying the response (200, success message, transaction_id returned)\n\u2022 Step 2: Queried the transactions table \u2014 the deposit record existed with correct amount and status "COMPLETED"\n\u2022 Step 3: Queried the accounts table \u2014 the balance column was NOT updated\n\u2022 Step 4: Checked the CRM sync table \u2014 no sync event was triggered for the deposit\n\u2022 Step 5: Reviewed the API logs using the correlation ID \u2014 found a NullPointerException in the balance update service\n\u2022 Step 6: Identified root cause: the balance update was in a separate try-catch block that swallowed the exception and returned success anyway\n\u2022 Step 7: Logged the defect with full evidence (API request/response, SQL queries, log excerpt)\n\u2022 Step 8: After the fix, re-tested the exact scenario and verified balance update + CRM sync\n\u2022 Step 9: Added this scenario to the automated regression suite to prevent recurrence',
      'RESULT: The defect was fixed 4 days before the production release. If it had reached production, every deposit would have succeeded without updating balances \u2014 potentially affecting thousands of customers and requiring a manual reconciliation effort. The development team also added a transactional wrapper to ensure balance updates and transaction records are atomic.',
    ],
    hashtags: ['#STARMethod', '#BehavioralInterview', '#QAInterview', '#BankingQA'],
  },
  {
    id: 28,
    title: 'What Interviewers Expect from API Testers in FinTech',
    hook: 'I\'ve been on both sides of the interview table. Here\'s what actually impresses interviewers.',
    content: [
      'Having conducted over 50 QA interviews for banking and fintech positions, I can tell you exactly what separates a "yes" candidate from a "maybe" candidate. It is not about knowing every tool \u2014 it is about demonstrating engineering thinking.',
      'Here is what interviewers are looking for:',
      '\u2022 Structured Thinking: Can you explain your testing approach step by step? Do you start with contract analysis, design scenarios systematically, and validate at multiple layers? Or do you just "send requests and check responses"?\n\u2022 Security Awareness: Can you identify security risks in banking APIs? Do you think about authentication bypass, data exposure, injection attacks, and RBAC failures? In fintech, security testing is not optional \u2014 it is a core competency.\n\u2022 Database Validation Skills: Can you write SQL queries to validate API behavior? Can you explain how you check data persistence, running balances, and audit trails? If you cannot validate at the database layer, you are testing with one eye closed.\n\u2022 Defect Documentation Quality: Can you write a defect report that a developer can reproduce without asking questions? Include: endpoint, method, payload, expected vs actual, SQL evidence, and steps to reproduce.',
      '\u2022 Domain Understanding: Do you understand banking concepts like KYC, AML, fund transfers, account types, and regulatory requirements? Can you design test scenarios that reflect real banking workflows, not just generic API tests?\n\u2022 Automation Capability: Can you discuss how you would automate API tests with RestAssured or Newman? Can you explain CI/CD integration, data-driven testing, and regression strategy?\n\u2022 Problem-Solving: Given a 500 error in a fund transfer API, can you walk through your investigation steps? This is where real experience shows.',
      'The candidates who get offers are the ones who demonstrate depth, not breadth. I would rather hear a detailed explanation of how you tested one fund transfer API than a surface-level overview of 20 tools you have used.',
    ],
    hashtags: ['#FinTech', '#QAHiring', '#InterviewTips', '#APITesterSkills'],
  },
  {
    id: 29,
    title: 'Top API Testing Scenarios Every QA Should Know',
    hook: 'If you can explain these 10 scenarios confidently, you\'ll clear any API testing interview.',
    content: [
      'Every banking API testing interview covers the same core scenarios. If you can explain each one with depth \u2014 the test approach, assertions, SQL validation, and possible defects \u2014 you will clear the interview.',
      'The 10 essential scenarios:',
      '\u2022 Scenario 1 \u2014 Customer Creation: POST /customers with valid KYC data. Validate: 201 response, customer_id generated, all fields persisted in DB, audit log entry created.\n\u2022 Scenario 2 \u2014 Account Creation: POST /accounts linked to customer_id. Validate: account_number generated, initial balance = 0 or min deposit, status = ACTIVE, linked to correct customer.\n\u2022 Scenario 3 \u2014 Deposit: POST /transactions/deposit. Validate: transaction record created, account balance updated, running balance correct, notification sent.\n\u2022 Scenario 4 \u2014 Insufficient Balance Transfer: POST /transfers with amount > available balance. Validate: 400 response, no debit, no credit, clear error message, no partial transaction.\n\u2022 Scenario 5 \u2014 Token Validation: Send requests with valid, expired, missing, and tampered tokens. Validate: correct 200/401/403 responses for each case.',
      '\u2022 Scenario 6 \u2014 RBAC Enforcement: Access admin endpoints with customer token. Validate: 403 Forbidden. Access customer data with wrong customer\'s token. Validate: 403.\n\u2022 Scenario 7 \u2014 Duplicate Prevention: Send the same create request twice. Validate: second request returns 409 Conflict or is idempotent.\n\u2022 Scenario 8 \u2014 Database Verification: After every write operation, run SQL to verify persistence. Compare API response fields with database columns.\n\u2022 Scenario 9 \u2014 500 Error Investigation: Trigger a 500 error. Investigate using correlation ID, logs, and database state. Document root cause.\n\u2022 Scenario 10 \u2014 Idempotency: Send a POST /transfers with the same X-Idempotency-Key twice. Validate: second request returns the cached response, no duplicate transaction.',
      'For each scenario, prepare: the test approach, the assertions you would write, the SQL queries you would run, and a real defect you have found in that area. This level of preparation will make you the strongest candidate in the room.',
    ],
    hashtags: ['#TopScenarios', '#MustKnow', '#QASkills', '#APITesting'],
  },
  {
    id: 30,
    title: 'Common API Testing Mistakes (And How to Avoid Them)',
    hook: 'Mistake #1: Trusting the status code. A 200 OK doesn\'t mean the data is correct.',
    content: [
      'After years of reviewing API test suites and mentoring junior QA engineers, I see the same mistakes repeated across teams and organizations. Here are the 7 most common API testing mistakes and how to avoid each one.',
      'Mistake 1 \u2014 Only Checking Status Codes: A 200 OK means the server processed the request. It does not mean the data is correct, the business rules were applied, or the database was updated. Always validate the response body, field values, and database state.',
      'Mistake 2 \u2014 Skipping Database Validation: If you only check what the API returns, you are trusting the API. In banking, the database is the source of truth. After every POST, PUT, and DELETE, run a SQL query to verify the change was persisted correctly.\n\nMistake 3 \u2014 No Negative Testing: Testing only the happy path is like testing a lock by only using the correct key. Test with invalid inputs, missing fields, wrong data types, SQL injection payloads, and boundary values. Negative tests find more defects than positive tests.\n\nMistake 4 \u2014 Ignoring Security: Most QA engineers skip security testing because "that is the security team\'s job." In banking, every QA engineer must test authentication, authorization, token validation, and data exposure. It is not optional.',
      'Mistake 5 \u2014 No Regression Suite: Finding a defect once is good. Ensuring it never comes back is better. If you do not have an automated regression suite that runs on every deployment, you are relying on luck.\n\nMistake 6 \u2014 Weak Defect Documentation: "API not working" is not a defect report. Include: endpoint, method, request payload, actual response, expected response, SQL evidence, steps to reproduce, environment, and severity. A well-documented defect gets fixed faster.\n\nMistake 7 \u2014 Not Understanding the Business Flow: Testing an API without understanding the business context is like testing a calculator without knowing math. Understand the banking workflow \u2014 why this API exists, what business rule it implements, and what downstream systems depend on it.',
      'Review your current testing approach against this list. If you are making even two of these mistakes, your defect detection rate is significantly lower than it could be. The good news: every one of these mistakes is fixable with discipline, not tools.',
    ],
    hashtags: ['#CommonMistakes', '#QALessons', '#APITesting', '#QualityMatters'],
  },
];

/* ================================================================
   DATA: TAB 7 - Thought Leadership (Posts 31-35)
   ================================================================ */
const LEADERSHIP_POSTS = [
  {
    id: 31,
    title: 'From Functional QA to API Quality Engineering',
    hook: 'I stopped calling myself a \'tester\' and started calling myself a \'quality engineer.\' Here\'s what changed.',
    content: [
      'The title change was not about ego. It was about a fundamental shift in how I approach quality. A "tester" finds bugs. A "quality engineer" prevents them, automates their detection, and builds systems that make quality sustainable.',
      'Here is the evolution I went through:',
      '\u2022 Phase 1 \u2014 Manual Tester: I clicked through the UI, found bugs, logged them in JIRA, and moved on. My value was proportional to my clicking speed.\n\u2022 Phase 2 \u2014 API Tester: I learned Postman and SoapUI. I tested APIs directly instead of through the UI. My defect detection rate doubled because I was testing at a layer the UI could not reveal.\n\u2022 Phase 3 \u2014 Automation Engineer: I learned RestAssured and built automated test suites. I integrated them into CI/CD. My tests ran automatically on every deployment, catching regressions without manual effort.\n\u2022 Phase 4 \u2014 Quality Engineer: I started contributing to API design reviews (contract testing). I added observability validation to my tests. I built quality dashboards. I measured defect leakage, test coverage, and mean time to detect.',
      'What changed in my daily work:',
      '\u2022 Before: Wait for feature to be developed -> Test it -> Log defects -> Wait for fix -> Retest\n\u2022 After: Review API spec in sprint planning -> Design tests in parallel with development -> Automate critical paths -> Run in CI/CD -> Monitor in production -> Improve continuously',
      'The biggest mindset shift was this: quality is not a phase at the end of development. It is a continuous practice that starts at requirement analysis and extends into production monitoring. If you want to grow from tester to quality engineer, start thinking about prevention, automation, and measurement \u2014 not just detection.',
    ],
    hashtags: ['#QualityEngineering', '#CareerEvolution', '#APITesting', '#QATransformation'],
  },
  {
    id: 32,
    title: 'Why API Testing is the Backbone of Digital Banking',
    hook: 'Digital banking isn\'t about the app. It\'s about the APIs behind the app.',
    content: [
      'When a bank launches a new mobile app, the press release talks about the "beautiful interface" and "seamless experience." But the real product is not the app \u2014 it is the APIs that power every feature, every transaction, and every notification.',
      'Consider what APIs enable in modern banking:',
      '\u2022 Mobile Banking: Every screen in the app is powered by 3-10 API calls. The app is just a thin presentation layer. The business logic, data, and security all live in the APIs.\n\u2022 Internet Banking: The web portal uses the same APIs as the mobile app. If the APIs are reliable, both channels work. If not, both break.\n\u2022 Partner Integrations: Fintech partners (payment processors, credit bureaus, insurance companies) integrate via APIs. A single API downtime affects the entire partner ecosystem.\n\u2022 Open Banking: Regulatory mandates (PSD2, Account Aggregator) require banks to expose customer data via APIs to authorized third parties. These APIs must be secure, performant, and compliant.',
      '\u2022 Internal Systems: Core banking, CRM, fraud detection, and compliance systems all communicate via APIs. A failure in the account service API cascades to every dependent system.\n\u2022 ATM Networks: Modern ATMs use REST APIs to communicate with the core banking system. An API outage means ATMs go offline.',
      'This is why API testing is not just another testing layer \u2014 it is the most critical layer. If the UI has a bug, one channel is affected. If an API has a bug, every channel, every partner, and every system is affected. API quality is the foundation of digital banking trust.\n\nAs a QA professional, when you test APIs, you are not testing endpoints. You are testing the infrastructure that millions of customers depend on every day. That is why API testing in banking is not just important \u2014 it is indispensable.',
    ],
    hashtags: ['#DigitalBanking', '#APIFirst', '#BankingInnovation', '#QualityAssurance'],
  },
  {
    id: 33,
    title: 'API Governance & Quality Metrics in Financial Systems',
    hook: 'You can\'t improve what you don\'t measure. Here are the API quality metrics that matter in banking.',
    content: [
      'Quality without measurement is opinion. In banking, where regulators, auditors, and leadership need evidence of quality, you need metrics that are objective, measurable, and actionable.',
      'Here are the API quality metrics every banking QA team should track:',
      '\u2022 Defect Density: Number of defects per API endpoint. Track over time to identify problematic endpoints. Target: < 2 defects per endpoint per release.\n\u2022 Test Coverage: Percentage of API endpoints with automated tests. Track at the endpoint level and the scenario level. Target: 100% endpoint coverage, 80%+ scenario coverage.\n\u2022 Pass Rate: Percentage of test cases passing per release. Track trend over sprints. Target: > 95% pass rate before production deployment.\n\u2022 Mean Time to Detect (MTTD): Average time from defect introduction (code commit) to detection. Lower is better. Shift-left practices should reduce MTTD from days to hours.\n\u2022 Defect Leakage Rate: Percentage of defects found after QA phase (in UAT or production). Target: < 5%. If higher, your testing approach needs restructuring.',
      '\u2022 Response Time SLA Compliance: Percentage of API responses meeting the SLA (e.g., < 500ms for read operations, < 2s for write operations). Track p50, p95, and p99.\n\u2022 Error Rate: Percentage of API responses returning 4xx or 5xx. Track by endpoint, by environment, and over time. Sudden spikes indicate new defects.\n\u2022 Automation ROI: Hours saved per sprint through automated testing vs manual effort. Track to justify automation investment.',
      'Building the dashboard: I recommend a simple dashboard (Grafana, Metabase, or even a spreadsheet) that shows these 8 metrics with trend lines. Update weekly. Review in sprint retrospectives. When a metric degrades, investigate and fix the root cause.\n\nThe teams that measure quality improve quality. The teams that do not measure it argue about it.',
    ],
    hashtags: ['#APIGovernance', '#QualityMetrics', '#FinancialSystems', '#QALeadership'],
  },
  {
    id: 34,
    title: 'Building an API-First Testing Strategy',
    hook: 'If you\'re still testing at the UI layer first, you\'re testing too late.',
    content: [
      'The traditional testing pyramid puts UI tests at the top (fewest) and unit tests at the bottom (most). But many banking QA teams are inverted \u2014 they do most of their testing through the UI and treat API testing as an afterthought. This is backward, and here is why.',
      'Why API-first testing wins:',
      '\u2022 Speed: A UI test for a fund transfer takes 30 seconds (load page, fill form, click submit, wait for confirmation). The same API test takes 200 milliseconds. You can run 150 API tests in the time it takes to run 1 UI test.\n\u2022 Reliability: UI tests are flaky \u2014 they break when a button moves, a modal changes, or a loading spinner takes too long. API tests are stable because the interface (contract) rarely changes.\n\u2022 Coverage: The UI exposes 20% of the API surface. The other 80% (internal services, batch APIs, integration endpoints) can only be tested at the API layer.\n\u2022 Earlier Detection: API tests can run against a deployed backend without waiting for the frontend. Defects found at the API layer are found days earlier than UI defects.',
      'How to shift from UI-heavy to API-first:',
      '\u2022 Step 1: Inventory all your UI test cases. Identify which ones are actually testing business logic (data validation, calculations, state transitions) vs which are testing UI behavior (button placement, form rendering).\n\u2022 Step 2: Move all business logic tests to the API layer. If your UI test checks that a transfer creates a transaction with the correct amount, that is an API test disguised as a UI test.\n\u2022 Step 3: Keep UI tests only for UI-specific behavior: layout, navigation, responsive design, accessibility, and user interaction flows.\n\u2022 Step 4: Automate the API tests and integrate them into CI/CD. They should run on every code change, not just before releases.',
      'The ideal testing ratio for banking: 60% API tests, 25% unit tests, 15% UI tests. This gives you the fastest feedback loop, the highest coverage, and the most reliable test suite. Start shifting today \u2014 pick your top 10 UI tests and rewrite them as API tests. You will immediately see the difference in speed and reliability.',
    ],
    hashtags: ['#APIFirst', '#TestStrategy', '#ShiftLeft', '#ModernQA'],
  },
  {
    id: 35,
    title: 'Shift-Left API Testing in Agile Banking Projects',
    hook: 'We moved API testing from Sprint N+1 to Sprint N. Defect discovery shifted from UAT to development. Here\'s how.',
    content: [
      'In many banking teams, testing follows this pattern: developers build a feature in Sprint 1, QA tests it in Sprint 2 (or later), defects are found, fixes go into Sprint 3, and retesting happens in Sprint 4. By the time the feature is production-ready, 3-4 sprints have passed. This is too slow for agile delivery.',
      'Shift-left means moving testing earlier in the development cycle. Here is how we implemented it:',
      '\u2022 Sprint Planning Participation: QA joins sprint planning and reviews user stories. We identify testability gaps, missing acceptance criteria, and API contract questions before development starts.\n\u2022 Parallel Test Design: While developers build the feature, QA designs the test scenarios and prepares test data. By the time the code is ready, the tests are ready.\n\u2022 API Contract Review: When the Swagger spec is published (before code is written), QA reviews it for completeness, consistency, and testability. We catch schema issues before a single line of code is written.\n\u2022 Developer Collaboration: QA pairs with developers during implementation. We run test scenarios against the developer\'s local environment. Defects found here take 30 minutes to fix instead of 3 days.',
      '\u2022 In-Sprint Testing: All testing happens within the same sprint as development. No "testing sprint" or "QA phase." Features are not considered "done" until they pass QA.\n\u2022 Automated Regression in CI: Every code push triggers the regression suite. Developers see failures immediately, not 2 weeks later.\n\u2022 Definition of Done Update: We updated the team\'s Definition of Done to include: "API tests automated and passing in CI/CD, database validation completed, security scenarios tested."',
      'The measurable impact after 6 months:\n\u2022 Defect leakage to UAT: Dropped from 25% to 4%\n\u2022 Average defect age (time from introduction to detection): Dropped from 8 days to 1.5 days\n\u2022 Sprint velocity: Increased by 15% (fewer rework cycles)\n\u2022 Production incidents: Reduced by 60%\n\nShift-left is not a tool or a process \u2014 it is a culture change. It requires QA to be proactive, collaborative, and technically skilled. But the results are undeniable.',
    ],
    hashtags: ['#ShiftLeft', '#AgileTesting', '#SprintTesting', '#BankingAgile'],
  },
];

/* ================================================================
   LinkedIn Tips per category
   ================================================================ */
const LINKEDIN_TIPS = {
  core: {
    title: 'LinkedIn Tips for Core API Testing Posts',
    tips: [
      'Start with a relatable scenario that every developer or tester has experienced',
      'Use numbered lists and bullet points \u2014 LinkedIn\'s algorithm favors scannable content',
      'End with a question to boost engagement: "What API layer defects have you caught recently?"',
      'Post between 8-10 AM on Tuesday/Wednesday for maximum visibility',
      'Keep your hook line under 150 characters \u2014 it must grab attention before the "see more" fold',
    ],
  },
  security: {
    title: 'LinkedIn Tips for Security & Compliance Posts',
    tips: [
      'Security content performs well because it triggers urgency \u2014 use phrases like "I found" or "This could have..."',
      'Avoid sharing actual vulnerability details from your current employer \u2014 keep examples generic or historical',
      'Tag relevant security communities and hashtags for broader reach',
      'Include a "What would you do?" question to spark discussion in comments',
      'Add a disclaimer: "This is a learning example, not from any specific organization"',
    ],
  },
  securityDeep: {
    title: 'LinkedIn Tips for Advanced Security Posts',
    tips: [
      'Deep technical content attracts a smaller but more engaged audience \u2014 quality over quantity',
      'Use code snippets or pseudo-code to illustrate points \u2014 visual content gets more engagement',
      'Reference OWASP, NIST, or PCI-DSS standards to add credibility',
      'Break complex topics into a series: "Part 1 of 5: JWT Security in Banking APIs"',
      'Engage with comments thoughtfully \u2014 deep dives attract expert commenters',
    ],
  },
  tools: {
    title: 'LinkedIn Tips for Tools & Frameworks Posts',
    tips: [
      'Tool comparison posts always perform well \u2014 people love "vs" content',
      'Share your personal workflow, not just tool features \u2014 "Here is how I use it" beats "Here is what it does"',
      'Include a "starter template" or "quick start" \u2014 actionable content gets saved and shared',
      'Mention specific version numbers and configurations \u2014 it shows real-world experience',
      'Offer to share your Postman collection or test template in comments (great for connection growth)',
    ],
  },
  performance: {
    title: 'LinkedIn Tips for Performance & Reliability Posts',
    tips: [
      'Performance stories with numbers (response time, TPS, error rate) are compelling \u2014 be specific',
      'Before/after comparisons drive engagement \u2014 "Response time: 8s -> 120ms"',
      'Use a "lessons learned" format \u2014 people relate to real-world challenges and solutions',
      'Tag DevOps and SRE communities \u2014 performance content bridges QA and operations',
      'Include a "checklist" or "diagnostic steps" section that readers can immediately apply',
    ],
  },
  interview: {
    title: 'LinkedIn Tips for Interview & Career Posts',
    tips: [
      'Interview content consistently gets the highest engagement on LinkedIn \u2014 everyone is either hiring or job-seeking',
      'Use the STAR method in your examples \u2014 it teaches readers the format while telling the story',
      'Share both what interviewers look for AND what candidates should avoid',
      'Offer to review resumes or do mock interviews in comments \u2014 builds your personal brand',
      'Tag "Open to Work" and career coaching hashtags for maximum reach',
    ],
  },
  leadership: {
    title: 'LinkedIn Tips for Thought Leadership Posts',
    tips: [
      'Thought leadership posts should challenge conventional thinking \u2014 "What if we did it differently?"',
      'Share your personal career journey \u2014 authentic stories resonate more than advice',
      'Use data and metrics to support your arguments \u2014 opinions are common, evidence is rare',
      'Write longer posts (1500+ characters) for thought leadership \u2014 LinkedIn rewards depth',
      'Engage with other thought leaders in comments \u2014 cross-pollination grows your audience',
    ],
  },
};

/* ================================================================
   Map tab IDs to post arrays
   ================================================================ */
const POST_MAP = {
  core: CORE_POSTS,
  security: SECURITY_POSTS,
  securityDeep: SECURITY_DEEP_POSTS,
  tools: TOOLS_POSTS,
  performance: PERFORMANCE_POSTS,
  interview: INTERVIEW_POSTS,
  leadership: LEADERSHIP_POSTS,
};

const TAB_HEADERS = {
  core: 'Banking API Testing \u2014 Foundational Posts',
  security: 'Security, Auth & Regulatory Testing',
  securityDeep: 'Advanced Security & Compliance Posts',
  tools: 'Tools, Automation & Framework Posts',
  performance: 'Performance, Load & Observability Posts',
  interview: 'Interview Preparation & Career Growth Posts',
  leadership: 'Advanced & Strategic Posts',
};

/* ================================================================
   COMPONENT: LinkedInPosts
   ================================================================ */
function LinkedInPosts() {
  const [activeTab, setActiveTab] = useState('core');
  const [expandedPosts, setExpandedPosts] = useState({});

  const togglePost = (postId) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const expandAll = () => {
    const posts = POST_MAP[activeTab] || [];
    const allExpanded = {};
    posts.forEach((p) => { allExpanded[p.id] = true; });
    setExpandedPosts((prev) => ({ ...prev, ...allExpanded }));
  };

  const collapseAll = () => {
    const posts = POST_MAP[activeTab] || [];
    const allCollapsed = {};
    posts.forEach((p) => { allCollapsed[p.id] = false; });
    setExpandedPosts((prev) => ({ ...prev, ...allCollapsed }));
  };

  const currentPosts = POST_MAP[activeTab] || [];
  const currentTips = LINKEDIN_TIPS[activeTab];
  const currentHeader = TAB_HEADERS[activeTab];
  const currentColor = TABS.find((t) => t.id === activeTab)?.color || C.accent;

  /* ── Styles ── */
  const styles = {
    page: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${C.bgGradientStart} 0%, ${C.bgGradientEnd} 100%)`,
      padding: '32px 24px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: C.text,
    },
    container: {
      maxWidth: 1200,
      margin: '0 auto',
    },
    /* Header */
    headerSection: {
      textAlign: 'center',
      marginBottom: 32,
    },
    pageTitle: {
      fontSize: 32,
      fontWeight: 700,
      color: C.accent,
      margin: '0 0 8px 0',
      letterSpacing: 0.5,
    },
    pageSubtitle: {
      fontSize: 16,
      color: C.textMuted,
      margin: '0 0 24px 0',
    },
    /* Summary stats */
    statsRow: {
      display: 'flex',
      gap: 16,
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: 32,
    },
    statCard: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: '16px 28px',
      textAlign: 'center',
      minWidth: 140,
    },
    statValue: {
      fontSize: 28,
      fontWeight: 700,
      color: C.accent,
      margin: 0,
    },
    statLabel: {
      fontSize: 13,
      color: C.textMuted,
      margin: '4px 0 0 0',
    },
    /* Tabs */
    tabContainer: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginBottom: 28,
      justifyContent: 'center',
    },
    tab: (isActive, color) => ({
      padding: '10px 18px',
      borderRadius: 8,
      border: isActive ? `2px solid ${color}` : `1px solid ${C.border}`,
      background: isActive ? `${color}22` : C.card,
      color: isActive ? color : C.textMuted,
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: isActive ? 700 : 500,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }),
    tabIcon: (isActive, color) => ({
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: isActive ? color : C.cardLight,
      color: isActive ? '#fff' : C.textMuted,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11,
      fontWeight: 700,
    }),
    tabCount: (color) => ({
      background: `${color}33`,
      color: color,
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 10,
      padding: '2px 8px',
    }),
    /* Section header */
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      flexWrap: 'wrap',
      gap: 12,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 700,
      color: C.text,
      margin: 0,
      borderLeft: `4px solid ${C.accent}`,
      paddingLeft: 12,
    },
    actionButtons: {
      display: 'flex',
      gap: 8,
    },
    actionBtn: {
      padding: '8px 16px',
      borderRadius: 6,
      border: `1px solid ${C.border}`,
      background: C.card,
      color: C.textMuted,
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 600,
      transition: 'all 0.2s',
    },
    /* Post Card */
    postCard: (color) => ({
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      borderLeft: `4px solid ${color}`,
    }),
    postHeader: {
      padding: '16px 20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
    },
    postNumber: (color) => ({
      minWidth: 36,
      height: 36,
      borderRadius: '50%',
      background: `${color}33`,
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 700,
      flexShrink: 0,
    }),
    postInfo: {
      flex: 1,
    },
    postTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: C.text,
      margin: '0 0 8px 0',
      lineHeight: 1.4,
    },
    hookLine: {
      fontSize: 14,
      color: C.gold,
      margin: 0,
      fontStyle: 'italic',
      lineHeight: 1.5,
      padding: '8px 12px',
      background: `${C.gold}15`,
      borderRadius: 6,
      borderLeft: `3px solid ${C.gold}`,
    },
    expandIcon: {
      fontSize: 18,
      color: C.textMuted,
      flexShrink: 0,
      marginTop: 4,
      transition: 'transform 0.2s',
    },
    /* Post Content */
    postContent: {
      padding: '0 20px 20px 70px',
      borderTop: `1px solid ${C.border}`,
    },
    paragraph: {
      fontSize: 14,
      color: C.textMuted,
      lineHeight: 1.8,
      margin: '14px 0',
      whiteSpace: 'pre-line',
    },
    /* Hashtags */
    hashtagRow: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginTop: 16,
    },
    hashtagChip: (color) => ({
      padding: '4px 12px',
      borderRadius: 20,
      background: `${color}22`,
      color: color,
      fontSize: 12,
      fontWeight: 600,
      border: `1px solid ${color}44`,
    }),
    /* Tips Card */
    tipsCard: {
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 24,
      marginTop: 32,
      borderLeft: `4px solid ${C.gold}`,
    },
    tipsTitle: {
      fontSize: 18,
      fontWeight: 700,
      color: C.gold,
      margin: '0 0 16px 0',
    },
    tipItem: {
      fontSize: 14,
      color: C.textMuted,
      lineHeight: 1.7,
      margin: '8px 0',
      paddingLeft: 20,
      position: 'relative',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.headerSection}>
          <h1 style={styles.pageTitle}>LinkedIn Content Strategy</h1>
          <p style={styles.pageSubtitle}>
            Banking API Testing Professionals — 35 Ready-to-Post Topics with Full Content
          </p>
        </div>

        {/* Summary Stats */}
        <div style={styles.statsRow}>
          {[
            { value: '35', label: 'Posts' },
            { value: '7', label: 'Categories' },
            { value: '35', label: 'Hooks' },
            { value: '170+', label: 'Hashtags' },
          ].map((stat, idx) => (
            <div key={idx} style={styles.statCard}>
              <p style={styles.statValue}>{stat.value}</p>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          {TABS.map((tab) => (
            <div
              key={tab.id}
              style={styles.tab(activeTab === tab.id, tab.color)}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={styles.tabIcon(activeTab === tab.id, tab.color)}>{tab.icon}</span>
              <span>{tab.label}</span>
              <span style={styles.tabCount(tab.color)}>{tab.count}</span>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div style={styles.sectionHeader}>
          <h2 style={{ ...styles.sectionTitle, borderLeftColor: currentColor }}>
            {currentHeader}
          </h2>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn} onClick={expandAll}>
              Expand All
            </button>
            <button style={styles.actionBtn} onClick={collapseAll}>
              Collapse All
            </button>
          </div>
        </div>

        {/* Post Cards */}
        {currentPosts.map((post) => {
          const isExpanded = expandedPosts[post.id] || false;
          return (
            <div key={post.id} style={styles.postCard(currentColor)}>
              {/* Post Header (clickable) */}
              <div style={styles.postHeader} onClick={() => togglePost(post.id)}>
                <div style={styles.postNumber(currentColor)}>
                  {post.id}
                </div>
                <div style={styles.postInfo}>
                  <h3 style={styles.postTitle}>{post.title}</h3>
                  <p style={styles.hookLine}>{post.hook}</p>
                </div>
                <span style={{ ...styles.expandIcon, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  {isExpanded ? '\u25B2' : '\u25BC'}
                </span>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div style={styles.postContent}>
                  {post.content.map((para, idx) => (
                    <p key={idx} style={styles.paragraph}>{para}</p>
                  ))}
                  <div style={styles.hashtagRow}>
                    {post.hashtags.map((tag, idx) => (
                      <span key={idx} style={styles.hashtagChip(currentColor)}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* LinkedIn Tips Card */}
        {currentTips && (
          <div style={styles.tipsCard}>
            <h3 style={styles.tipsTitle}>{currentTips.title}</h3>
            {currentTips.tips.map((tip, idx) => (
              <div key={idx} style={styles.tipItem}>
                <span style={{ position: 'absolute', left: 0, color: C.gold }}>{'\u2022'}</span>
                {tip}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LinkedInPosts;

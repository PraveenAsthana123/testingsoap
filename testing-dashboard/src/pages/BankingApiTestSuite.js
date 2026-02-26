import React, { useState } from 'react';

/* =====================================================
   Banking API Test Suite - Comprehensive QA Dashboard
   ===================================================== */

const TABS = [
  { id: 'customers', label: 'Customer APIs' },
  { id: 'accounts', label: 'Account APIs' },
  { id: 'transactions', label: 'Transaction APIs' },
  { id: 'auth', label: 'Auth & Security' },
  { id: 'db', label: 'DB Validation' },
  { id: 'negative', label: 'Negative & Edge' },
  { id: 'environment', label: 'Environment' },
  { id: 'defects', label: 'Defect Templates' },
];

const C = {
  bgGradientFrom: '#1a1a2e',
  bgGradientTo: '#16213e',
  card: '#0f3460',
  cardLight: '#1a4a7a',
  accent: '#4ecca3',
  accentDark: '#3ba88c',
  text: '#e0e0e0',
  textBright: '#ffffff',
  textMuted: '#8899aa',
  success: '#4ecca3',
  fail: '#e74c3c',
  warning: '#f39c12',
  notRun: '#7f8c8d',
  border: '#1e5080',
  codeBg: '#0a0a1a',
  codeText: '#4ecca3',
};

const METHOD_COLORS = {
  GET: '#61affe',
  POST: '#49cc90',
  PUT: '#fca130',
  PATCH: '#50e3c2',
  DELETE: '#f93e3e',
};

/* =====================================================
   TAB 1: Customer APIs Test Data
   ===================================================== */
const CUSTOMER_TESTS = [
  {
    id: 'TC-CUST-001', name: 'Create Individual Customer', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      firstName: 'Rajesh', lastName: 'Kumar', dob: '1985-03-15',
      email: 'rajesh.kumar@email.com', phone: '+1-416-555-0101',
      ssn: '123-45-6789',
      address: { street: '100 King St W', city: 'Toronto', province: 'ON', postalCode: 'M5X 1A1', country: 'CA' },
      type: 'INDIVIDUAL', kycStatus: 'PENDING'
    }, null, 2),
    expected: '201 Created, customerId generated, status=ACTIVE',
    dbValidation: "SELECT * FROM customers WHERE email='rajesh.kumar@email.com'",
    defectTemplate: 'CreateCustomer returns 500 when address province is 2-char code',
    passRate: 0.7,
  },
  {
    id: 'TC-CUST-002', name: 'Create Business Customer', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      businessName: 'Kumar Electronics Ltd', registrationNumber: 'BN123456789',
      type: 'BUSINESS', contactPerson: 'Rajesh Kumar',
      email: 'info@kumarelectronics.com', phone: '+1-416-555-0202',
      industryCode: '5411', annualRevenue: 2500000
    }, null, 2),
    expected: '201 Created, businessId generated',
    dbValidation: "SELECT * FROM customers WHERE email='info@kumarelectronics.com' AND type='BUSINESS'",
    defectTemplate: 'CreateBusinessCustomer fails when annualRevenue exceeds 7 digits',
    passRate: 0.7,
  },
  {
    id: 'TC-CUST-003', name: 'Update Customer Address', priority: 'P1',
    method: 'PUT', endpoint: '/api/v1/customers/{customerId}',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      address: { street: '200 Bay St', city: 'Toronto', province: 'ON', postalCode: 'M5J 2J5' }
    }, null, 2),
    expected: '200 OK, address updated, audit trail created',
    dbValidation: "SELECT address_street, address_city, updated_at FROM customers WHERE customer_id='CUST-10001'",
    defectTemplate: 'UpdateCustomer does not create audit trail entry for address change',
    passRate: 0.8,
  },
  {
    id: 'TC-CUST-004', name: 'Search Customer by Name', priority: 'P1',
    method: 'GET', endpoint: '/api/v1/customers?firstName=Rajesh&lastName=Kumar',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: 'N/A (Query parameters in URL)',
    expected: '200 OK, array of matching customers with pagination',
    dbValidation: "SELECT * FROM customers WHERE first_name ILIKE '%Rajesh%' AND last_name ILIKE '%Kumar%'",
    defectTemplate: 'Customer search returns 500 when special characters in name query',
    passRate: 0.8,
  },
  {
    id: 'TC-CUST-005', name: 'Duplicate Customer Prevention', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      firstName: 'Rajesh', lastName: 'Kumar', dob: '1985-03-15',
      email: 'rajesh.kumar2@email.com', phone: '+1-416-555-0199',
      ssn: '123-45-6789', type: 'INDIVIDUAL'
    }, null, 2),
    expected: '409 Conflict, error: "Customer with this SSN already exists"',
    dbValidation: "SELECT COUNT(*) FROM customers WHERE ssn_hash = hash('123-45-6789')",
    defectTemplate: 'Duplicate SSN not detected when leading zeros differ',
    passRate: 0.7,
  },
  {
    id: 'TC-CUST-006', name: 'Missing Required Fields', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({ firstName: 'John' }, null, 2),
    expected: '400 Bad Request, validation errors listed for: lastName, dob, ssn',
    dbValidation: 'N/A (request should be rejected before DB)',
    defectTemplate: 'Missing field validation returns 500 instead of 400 with field list',
    passRate: 0.7,
  },
  {
    id: 'TC-CUST-007', name: 'Invalid Email Format', priority: 'P1',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      firstName: 'John', lastName: 'Doe', dob: '1990-01-01',
      email: 'not-an-email', ssn: '987-65-4321', type: 'INDIVIDUAL'
    }, null, 2),
    expected: '400 Bad Request, "Invalid email format"',
    dbValidation: 'N/A (request should be rejected before DB)',
    defectTemplate: 'Invalid email format accepted by API, fails at DB constraint',
    passRate: 0.7,
  },
  {
    id: 'TC-CUST-008', name: 'Invalid DOB (Future Date)', priority: 'P1',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      firstName: 'Jane', lastName: 'Smith', dob: '2030-01-01',
      email: 'jane.smith@email.com', ssn: '111-22-3333', type: 'INDIVIDUAL'
    }, null, 2),
    expected: '400 Bad Request, "Date of birth cannot be in the future"',
    dbValidation: 'N/A (request should be rejected before DB)',
    defectTemplate: 'Future DOB accepted without validation, customer age calculated as negative',
    passRate: 0.7,
  },
  {
    id: 'TC-CUST-009', name: 'Fetch Customer by ID', priority: 'P0',
    method: 'GET', endpoint: '/api/v1/customers/CUST-10001',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: 'N/A (Path parameter)',
    expected: '200 OK, full customer object with masked SSN (***-**-6789)',
    dbValidation: "SELECT customer_id, first_name, last_name, ssn_encrypted FROM customers WHERE customer_id='CUST-10001'",
    defectTemplate: 'GET customer returns SSN in plain text instead of masked format',
    passRate: 0.8,
  },
  {
    id: 'TC-CUST-010', name: 'Deactivate Customer', priority: 'P0',
    method: 'PATCH', endpoint: '/api/v1/customers/CUST-10001/status',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({ status: 'INACTIVE', reason: 'Customer request' }, null, 2),
    expected: '200 OK, status changed, linked accounts flagged',
    dbValidation: "SELECT status, deactivation_reason FROM customers WHERE customer_id='CUST-10001';\nSELECT account_id, status FROM accounts WHERE customer_id='CUST-10001';",
    defectTemplate: 'Customer deactivation does not flag linked accounts for review',
    passRate: 0.7,
  },
];

/* =====================================================
   TAB 2: Account APIs Test Data
   ===================================================== */
const ACCOUNT_TESTS = [
  {
    id: 'TC-ACCT-001', name: 'Create Savings Account', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/accounts',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      customerId: 'CUST-10001', type: 'SAVINGS', currency: 'CAD',
      initialDeposit: 500.00, branchCode: 'BR-001', productCode: 'SAV-STD'
    }, null, 2),
    expected: '201 Created, accountNumber generated (format: 1001-XXXXX-XXX), status=ACTIVE',
    dbValidation: "SELECT account_number, status, balance, currency FROM accounts WHERE customer_id='CUST-10001' AND type='SAVINGS'",
    defectTemplate: 'CreateSavingsAccount generates duplicate account numbers under concurrent load',
    passRate: 0.7,
  },
  {
    id: 'TC-ACCT-002', name: 'Create Checking Account', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/accounts',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      customerId: 'CUST-10001', type: 'CHECKING', currency: 'CAD',
      initialDeposit: 1000.00, overdraftLimit: 500.00
    }, null, 2),
    expected: '201 Created, overdraft configured at $500.00',
    dbValidation: "SELECT account_number, overdraft_limit FROM accounts WHERE customer_id='CUST-10001' AND type='CHECKING'",
    defectTemplate: 'Overdraft limit not saved when creating checking account',
    passRate: 0.7,
  },
  {
    id: 'TC-ACCT-003', name: 'Create Deposit Account (Term Deposit)', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/accounts',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      customerId: 'CUST-10001', type: 'TERM_DEPOSIT', currency: 'CAD',
      amount: 10000.00, termMonths: 12, interestRate: 4.25
    }, null, 2),
    expected: '201 Created, maturityDate calculated as 12 months from creation',
    dbValidation: "SELECT account_number, amount, maturity_date, interest_rate FROM term_deposits WHERE customer_id='CUST-10001'",
    defectTemplate: 'Term deposit maturity date calculated incorrectly for leap year',
    passRate: 0.7,
  },
  {
    id: 'TC-ACCT-004', name: 'Link Customer to Account', priority: 'P1',
    method: 'POST', endpoint: '/api/v1/accounts/ACCT-20001/holders',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      customerId: 'CUST-10002', role: 'JOINT_HOLDER', signatoryLevel: 'ANY'
    }, null, 2),
    expected: '200 OK, joint holder added',
    dbValidation: "SELECT * FROM account_holders WHERE account_id='ACCT-20001' AND customer_id='CUST-10002'",
    defectTemplate: 'Joint holder addition does not validate customer existence',
    passRate: 0.8,
  },
  {
    id: 'TC-ACCT-005', name: 'Account Status Transition (Active to Suspended)', priority: 'P0',
    method: 'PATCH', endpoint: '/api/v1/accounts/ACCT-20001/status',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({ status: 'SUSPENDED', reason: 'Fraud investigation' }, null, 2),
    expected: '200 OK, all transactions blocked',
    dbValidation: "SELECT status, suspension_reason, suspended_at FROM accounts WHERE account_id='ACCT-20001'",
    defectTemplate: 'Suspended account still allows scheduled transactions to execute',
    passRate: 0.7,
  },
  {
    id: 'TC-ACCT-006', name: 'Invalid Currency', priority: 'P1',
    method: 'POST', endpoint: '/api/v1/accounts',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      customerId: 'CUST-10001', type: 'SAVINGS', currency: 'XYZ', initialDeposit: 500.00
    }, null, 2),
    expected: '400 Bad Request, "Invalid currency code"',
    dbValidation: 'N/A (request should be rejected before DB)',
    defectTemplate: 'Invalid currency code XYZ accepted, account created with null currency',
    passRate: 0.7,
  },
  {
    id: 'TC-ACCT-007', name: 'Minimum Balance Violation', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/accounts',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      customerId: 'CUST-10001', type: 'SAVINGS', currency: 'CAD', initialDeposit: 5.00
    }, null, 2),
    expected: '400 Bad Request, "Initial deposit below minimum: $25.00"',
    dbValidation: 'N/A (request should be rejected before DB)',
    defectTemplate: 'Minimum balance check missing for SAVINGS type, $5.00 deposit accepted',
    passRate: 0.7,
  },
  {
    id: 'TC-ACCT-008', name: 'Duplicate Account Prevention', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/accounts',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      customerId: 'CUST-10001', type: 'SAVINGS', currency: 'CAD', initialDeposit: 500.00
    }, null, 2),
    expected: '409 Conflict, "Active savings account already exists for this customer"',
    dbValidation: "SELECT COUNT(*) FROM accounts WHERE customer_id='CUST-10001' AND type='SAVINGS' AND status='ACTIVE'",
    defectTemplate: 'Duplicate savings account created when requests sent concurrently',
    passRate: 0.7,
  },
  {
    id: 'TC-ACCT-009', name: 'Get Account Details', priority: 'P0',
    method: 'GET', endpoint: '/api/v1/accounts/ACCT-20001',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: 'N/A (Path parameter)',
    expected: '200 OK, balance, status, holder info, transaction count',
    dbValidation: "SELECT a.*, COUNT(t.txn_id) as txn_count FROM accounts a LEFT JOIN transactions t ON a.account_id = t.account_id WHERE a.account_id='ACCT-20001' GROUP BY a.account_id",
    defectTemplate: 'GetAccountDetails returns stale cached balance instead of real-time',
    passRate: 0.8,
  },
  {
    id: 'TC-ACCT-010', name: 'Close Account', priority: 'P0',
    method: 'PATCH', endpoint: '/api/v1/accounts/ACCT-20001/status',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      status: 'CLOSED', reason: 'Customer request', finalSettlement: true
    }, null, 2),
    expected: '200 OK, balance transferred, account archived',
    dbValidation: "SELECT status, closed_at, closing_balance FROM accounts WHERE account_id='ACCT-20001';\nSELECT * FROM account_archive WHERE original_account_id='ACCT-20001';",
    defectTemplate: 'Account closure does not transfer remaining balance before archiving',
    passRate: 0.7,
  },
];

/* =====================================================
   TAB 3: Transaction APIs Test Data
   ===================================================== */
const TRANSACTION_TESTS = [
  {
    id: 'TC-TXN-001', name: 'Deposit Transaction', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/transactions',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      accountId: 'ACCT-20001', type: 'DEPOSIT', amount: 5000.00,
      currency: 'CAD', channel: 'BRANCH', teller: 'EMP-3001',
      reference: 'DEP-20260226-001'
    }, null, 2),
    expected: '201 Created, transactionId generated, balance updated, receipt generated',
    dbValidation: "SELECT txn_id, amount, balance_after FROM transactions WHERE reference='DEP-20260226-001';\nSELECT balance FROM accounts WHERE account_id='ACCT-20001';",
    defectTemplate: 'Deposit transaction created but account balance not updated',
    passRate: 0.7,
  },
  {
    id: 'TC-TXN-002', name: 'Withdrawal Transaction', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/transactions',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      accountId: 'ACCT-20001', type: 'WITHDRAWAL', amount: 500.00,
      currency: 'CAD', channel: 'ATM', reference: 'WDR-20260226-001'
    }, null, 2),
    expected: '201 Created, balance deducted',
    dbValidation: "SELECT balance FROM accounts WHERE account_id='ACCT-20001'",
    defectTemplate: 'Withdrawal creates negative balance when concurrent requests exceed available funds',
    passRate: 0.7,
  },
  {
    id: 'TC-TXN-003', name: 'Fund Transfer', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/transactions/transfer',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      fromAccount: 'ACCT-20001', toAccount: 'ACCT-20002',
      amount: 1000.00, currency: 'CAD', memo: 'Rent payment'
    }, null, 2),
    expected: '201 Created, debit + credit entries, both balances updated',
    dbValidation: "SELECT * FROM transactions WHERE (account_id='ACCT-20001' OR account_id='ACCT-20002') ORDER BY created_at DESC LIMIT 2;\nSELECT account_id, balance FROM accounts WHERE account_id IN ('ACCT-20001','ACCT-20002');",
    defectTemplate: 'Fund transfer debits source account but credit to target fails silently',
    passRate: 0.7,
  },
  {
    id: 'TC-TXN-004', name: 'Insufficient Balance', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/transactions',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      accountId: 'ACCT-20001', type: 'WITHDRAWAL', amount: 999999.00, currency: 'CAD'
    }, null, 2),
    expected: '400 Bad Request, "Insufficient balance. Available: $X,XXX.XX"',
    dbValidation: "SELECT balance FROM accounts WHERE account_id='ACCT-20001'",
    defectTemplate: 'Insufficient balance check uses stale cached balance instead of real-time',
    passRate: 0.7,
  },
  {
    id: 'TC-TXN-005', name: 'Transaction History', priority: 'P1',
    method: 'GET', endpoint: '/api/v1/accounts/ACCT-20001/transactions?from=2026-01-01&to=2026-02-26&limit=50',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: 'N/A (Query parameters in URL)',
    expected: '200 OK, paginated list with running balance',
    dbValidation: "SELECT txn_id, type, amount, balance_after, created_at FROM transactions WHERE account_id='ACCT-20001' AND created_at BETWEEN '2026-01-01' AND '2026-02-26' ORDER BY created_at DESC LIMIT 50",
    defectTemplate: 'Transaction history running balance calculation incorrect when reversals present',
    passRate: 0.8,
  },
  {
    id: 'TC-TXN-006', name: 'Duplicate Transaction (Idempotency)', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/transactions',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      accountId: 'ACCT-20001', type: 'DEPOSIT', amount: 5000.00,
      currency: 'CAD', reference: 'DEP-20260226-001'
    }, null, 2),
    expected: '200 OK (return existing transaction), NOT 201 (no duplicate created)',
    dbValidation: "SELECT COUNT(*) FROM transactions WHERE reference='DEP-20260226-001'",
    defectTemplate: 'Idempotency key not enforced, duplicate deposit created on retry',
    passRate: 0.7,
  },
  {
    id: 'TC-TXN-007', name: 'Transaction on Suspended Account', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/transactions',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      accountId: 'ACCT-20001', type: 'DEPOSIT', amount: 100.00, currency: 'CAD'
    }, null, 2),
    expected: '403 Forbidden, "Account is suspended. Transactions not allowed."',
    dbValidation: "SELECT status FROM accounts WHERE account_id='ACCT-20001'",
    defectTemplate: 'Suspended account check missing; deposit processed on frozen account',
    passRate: 0.7,
  },
  {
    id: 'TC-TXN-008', name: 'Large Transaction (AML Threshold)', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/transactions',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      accountId: 'ACCT-20001', type: 'DEPOSIT', amount: 15000.00,
      currency: 'CAD', channel: 'BRANCH', teller: 'EMP-3001'
    }, null, 2),
    expected: '201 Created, but flagged for AML review, SAR alert generated',
    dbValidation: "SELECT * FROM aml_alerts WHERE txn_id = (SELECT txn_id FROM transactions WHERE account_id='ACCT-20001' AND amount=15000.00 ORDER BY created_at DESC LIMIT 1)",
    defectTemplate: 'AML threshold alert not triggered for cash deposit of $15,000',
    passRate: 0.7,
  },
  {
    id: 'TC-TXN-009', name: 'Foreign Currency Transfer', priority: 'P1',
    method: 'POST', endpoint: '/api/v1/transactions/transfer',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      fromAccount: 'ACCT-20001', toAccount: 'ACCT-20003',
      amount: 5000.00, currency: 'USD', targetCurrency: 'CAD'
    }, null, 2),
    expected: '201 Created, exchange rate applied, conversion details in response',
    dbValidation: "SELECT * FROM fx_transactions WHERE source_currency='USD' AND target_currency='CAD' ORDER BY created_at DESC LIMIT 1",
    defectTemplate: 'FX conversion uses stale exchange rate cached from previous day',
    passRate: 0.7,
  },
  {
    id: 'TC-TXN-010', name: 'Transaction Reversal', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/transactions/TXN-30001/reversal',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      reason: 'Customer dispute', authorizedBy: 'MGR-4001'
    }, null, 2),
    expected: '201 Created, original reversed, balance restored',
    dbValidation: "SELECT * FROM transactions WHERE original_txn_id='TXN-30001' AND type='REVERSAL';\nSELECT balance FROM accounts WHERE account_id=(SELECT account_id FROM transactions WHERE txn_id='TXN-30001');",
    defectTemplate: 'Transaction reversal does not restore original balance correctly',
    passRate: 0.7,
  },
  {
    id: 'TC-TXN-011', name: 'Concurrent Transactions', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/transactions (x2 simultaneous)',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      scenario: 'Two simultaneous withdrawals',
      request1: { accountId: 'ACCT-20001', type: 'WITHDRAWAL', amount: 4000.00 },
      request2: { accountId: 'ACCT-20001', type: 'WITHDRAWAL', amount: 4000.00 },
      accountBalance: 5000.00
    }, null, 2),
    expected: 'One succeeds (201), one fails with "Insufficient balance" (400)',
    dbValidation: "SELECT COUNT(*) as txn_count, SUM(amount) as total FROM transactions WHERE account_id='ACCT-20001' AND type='WITHDRAWAL' AND created_at > NOW() - INTERVAL '1 minute'",
    defectTemplate: 'Race condition: both concurrent withdrawals succeed, balance goes negative',
    passRate: 0.7,
  },
  {
    id: 'TC-TXN-012', name: 'Daily Transaction Limit', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/transactions',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      accountId: 'ACCT-20001', type: 'WITHDRAWAL', amount: 25000.00,
      currency: 'CAD', note: 'This is the 3rd large withdrawal today totaling >$50,000'
    }, null, 2),
    expected: '400 Bad Request, "Daily transaction limit exceeded"',
    dbValidation: "SELECT SUM(amount) as daily_total FROM transactions WHERE account_id='ACCT-20001' AND type='WITHDRAWAL' AND DATE(created_at)=CURRENT_DATE",
    defectTemplate: 'Daily transaction limit not enforced for ATM channel withdrawals',
    passRate: 0.7,
  },
];

/* =====================================================
   TAB 4: Auth & Security Test Data
   ===================================================== */
const AUTH_TESTS = [
  {
    id: 'TC-AUTH-001', name: 'Valid Token Access', priority: 'P0',
    method: 'GET', endpoint: '/api/v1/customers/CUST-10001',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      headers: {
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVU0VSOTk5IiwiZXhwIjoxNzQwNjI0MDAwfQ...',
        'Content-Type': 'application/json'
      }
    }, null, 2),
    expected: '200 OK, access granted, customer data returned',
    dbValidation: "SELECT * FROM audit_log WHERE user_id='USER999' AND action='READ' ORDER BY created_at DESC LIMIT 1",
    defectTemplate: 'Valid JWT token rejected when RS256 key rotated',
    passRate: 0.9,
  },
  {
    id: 'TC-AUTH-002', name: 'Expired Token', priority: 'P0',
    method: 'GET', endpoint: '/api/v1/customers/CUST-10001',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      headers: {
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVU0VSOTk5IiwiZXhwIjoxNjAwMDAwMDAwfQ.expired_signature',
        'Content-Type': 'application/json'
      },
      note: 'Token exp claim set to 2020-09-13 (past date)'
    }, null, 2),
    expected: '401 Unauthorized, "Token expired. Please re-authenticate."',
    dbValidation: "SELECT * FROM auth_failures WHERE token_hash=hash('expired_token') ORDER BY created_at DESC LIMIT 1",
    defectTemplate: 'Expired token accepted when system clock drifts >5 seconds',
    passRate: 0.1,
  },
  {
    id: 'TC-AUTH-003', name: 'Missing Token', priority: 'P0',
    method: 'GET', endpoint: '/api/v1/customers/CUST-10001',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      headers: { 'Content-Type': 'application/json' },
      note: 'No Authorization header provided'
    }, null, 2),
    expected: '401 Unauthorized, "Authentication required"',
    dbValidation: 'N/A (request rejected at gateway)',
    defectTemplate: 'Missing auth header returns 500 instead of 401',
    passRate: 0.1,
  },
  {
    id: 'TC-AUTH-004', name: 'Invalid Signature', priority: 'P0',
    method: 'GET', endpoint: '/api/v1/customers/CUST-10001',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      headers: {
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJIQUNLRVIiLCJyb2xlIjoiQURNSU4ifQ.tampered_signature',
        'Content-Type': 'application/json'
      },
      note: 'JWT payload modified after signing (role changed to ADMIN)'
    }, null, 2),
    expected: '401 Unauthorized, "Invalid token signature"',
    dbValidation: "SELECT * FROM security_events WHERE event_type='INVALID_SIGNATURE' ORDER BY created_at DESC LIMIT 1",
    defectTemplate: 'Tampered JWT accepted when alg header changed to none',
    passRate: 0.1,
  },
  {
    id: 'TC-AUTH-005', name: 'Teller Accessing Admin Endpoint', priority: 'P0',
    method: 'GET', endpoint: '/api/v1/admin/users',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      headers: {
        Authorization: 'Bearer <valid_teller_token>',
        'Content-Type': 'application/json'
      },
      tokenPayload: { sub: 'EMP-3001', role: 'TELLER', branch: 'BR-001' }
    }, null, 2),
    expected: '403 Forbidden, "Insufficient permissions"',
    dbValidation: "SELECT * FROM auth_failures WHERE user_id='EMP-3001' AND endpoint='/api/v1/admin/users'",
    defectTemplate: 'TELLER role can access /admin/users endpoint due to missing RBAC check',
    passRate: 0.1,
  },
  {
    id: 'TC-AUTH-006', name: 'Customer Accessing Other Account', priority: 'P0',
    method: 'GET', endpoint: '/api/v1/accounts/ACCT-20099',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      headers: { Authorization: 'Bearer <cust_10001_token>' },
      tokenPayload: { sub: 'CUST-10001', role: 'CUSTOMER' },
      note: 'CUST-10001 trying to access ACCT-20099 (belongs to CUST-10050)'
    }, null, 2),
    expected: '403 Forbidden, "Access denied to this resource"',
    dbValidation: "SELECT customer_id FROM accounts WHERE account_id='ACCT-20099'",
    defectTemplate: 'Horizontal privilege escalation: customer can view any account by changing ID',
    passRate: 0.1,
  },
  {
    id: 'TC-AUTH-007', name: 'Data Masking Validation', priority: 'P0',
    method: 'GET', endpoint: '/api/v1/customers/CUST-10001',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      headers: { Authorization: 'Bearer <valid_token>' },
      fieldsToCheck: ['ssn', 'cardNumber', 'accountNumber']
    }, null, 2),
    expected: 'SSN masked as "***-**-6789", card number as "****-****-****-1234"',
    dbValidation: "SELECT ssn_encrypted, card_number_encrypted FROM customers WHERE customer_id='CUST-10001'",
    defectTemplate: 'SSN exposed in plain text in GET /customers response body',
    passRate: 0.1,
  },
  {
    id: 'TC-AUTH-008', name: 'Rate Limiting', priority: 'P0',
    method: 'GET', endpoint: '/api/v1/customers (x101)',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      scenario: 'Send 101 requests in 60 seconds from same IP',
      rateLimit: '100 requests/minute',
      headers: { Authorization: 'Bearer <valid_token>' }
    }, null, 2),
    expected: '429 Too Many Requests, "Too Many Requests. Retry after: 60s"',
    dbValidation: "SELECT COUNT(*) FROM rate_limit_log WHERE ip_address='10.0.0.1' AND window_start > NOW() - INTERVAL '1 minute'",
    defectTemplate: 'Rate limiter not enforced, 500+ requests/min accepted without throttling',
    passRate: 0.1,
  },
  {
    id: 'TC-AUTH-009', name: 'SQL Injection Attempt', priority: 'P0',
    method: 'GET', endpoint: "/api/v1/customers?name='; DROP TABLE customers; --",
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      queryParams: { name: "'; DROP TABLE customers; --" },
      note: 'Classic SQL injection attack vector'
    }, null, 2),
    expected: '400 Bad Request, input sanitized, no DB impact',
    dbValidation: "SELECT COUNT(*) FROM information_schema.tables WHERE table_name='customers'",
    defectTemplate: 'SQL injection in search parameter drops customers table',
    passRate: 0.1,
  },
  {
    id: 'TC-AUTH-010', name: 'Session Timeout', priority: 'P0',
    method: 'GET', endpoint: '/api/v1/customers/CUST-10001',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      headers: { Authorization: 'Bearer <token_idle_31min>' },
      note: 'Token last used 31 minutes ago (timeout: 30 min)',
      sessionTimeout: '30 minutes'
    }, null, 2),
    expected: '401 Unauthorized, "Session expired due to inactivity"',
    dbValidation: "SELECT last_activity, session_status FROM sessions WHERE token_hash=hash('<token>') ",
    defectTemplate: 'Session timeout not enforced, idle sessions remain active indefinitely',
    passRate: 0.1,
  },
];

/* =====================================================
   TAB 5: DB Validation Test Data
   ===================================================== */
const DB_TESTS = [
  {
    id: 'TC-DB-001', name: 'Customer Record Created', priority: 'P0',
    method: 'SQL', endpoint: 'Database Query',
    env: 'QA PostgreSQL (qa-db.bank.internal:5432)',
    testData: "-- After TC-CUST-001 execution:\nSELECT customer_id, first_name, last_name,\n       ssn_encrypted, status, created_at\nFROM customers\nWHERE email = 'rajesh.kumar@email.com';",
    expected: '1 row returned, status=ACTIVE, ssn encrypted (not plain text), created_at = today',
    dbValidation: "SELECT customer_id, first_name, last_name, ssn_encrypted, status, created_at FROM customers WHERE email = 'rajesh.kumar@email.com'",
    defectTemplate: 'Customer record created with ssn in plain text instead of encrypted',
    passRate: 0.8,
  },
  {
    id: 'TC-DB-002', name: 'Foreign Key Integrity', priority: 'P0',
    method: 'SQL', endpoint: 'Database Query',
    env: 'QA PostgreSQL (qa-db.bank.internal:5432)',
    testData: "SELECT a.account_id, a.customer_id, c.first_name\nFROM accounts a\nJOIN customers c ON a.customer_id = c.customer_id\nWHERE a.account_id = 'ACCT-20001';",
    expected: 'Valid join result, no orphan accounts (every account has a valid customer)',
    dbValidation: "SELECT a.account_id FROM accounts a LEFT JOIN customers c ON a.customer_id = c.customer_id WHERE c.customer_id IS NULL",
    defectTemplate: 'Orphan account records found with no matching customer (FK not enforced)',
    passRate: 0.8,
  },
  {
    id: 'TC-DB-003', name: 'No Duplicate Records', priority: 'P0',
    method: 'SQL', endpoint: 'Database Query',
    env: 'QA PostgreSQL (qa-db.bank.internal:5432)',
    testData: "SELECT ssn_hash, COUNT(*) as cnt\nFROM customers\nGROUP BY ssn_hash\nHAVING COUNT(*) > 1;",
    expected: '0 rows returned (no duplicate SSN hashes)',
    dbValidation: "SELECT ssn_hash, COUNT(*) as cnt FROM customers GROUP BY ssn_hash HAVING COUNT(*) > 1",
    defectTemplate: 'Duplicate customer records found with same SSN hash due to missing unique constraint',
    passRate: 0.8,
  },
  {
    id: 'TC-DB-004', name: 'Audit Fields Validation', priority: 'P1',
    method: 'SQL', endpoint: 'Database Query',
    env: 'QA PostgreSQL (qa-db.bank.internal:5432)',
    testData: "SELECT created_by, created_at, updated_by, updated_at\nFROM customers\nWHERE customer_id = 'CUST-10001';",
    expected: 'All audit fields populated, timestamps in UTC',
    dbValidation: "SELECT created_by, created_at, updated_by, updated_at FROM customers WHERE customer_id = 'CUST-10001'",
    defectTemplate: 'Audit fields created_by and updated_by are NULL on customer records',
    passRate: 0.8,
  },
  {
    id: 'TC-DB-005', name: 'Transaction Balance Consistency', priority: 'P0',
    method: 'SQL', endpoint: 'Database Query',
    env: 'QA PostgreSQL (qa-db.bank.internal:5432)',
    testData: "SELECT account_id,\n       SUM(CASE WHEN type='CREDIT' THEN amount ELSE -amount END) as calculated_balance\nFROM transactions\nWHERE account_id = 'ACCT-20001'\nGROUP BY account_id;",
    expected: 'Calculated balance matches accounts.current_balance exactly',
    dbValidation: "SELECT a.balance as stored_balance, SUM(CASE WHEN t.type='CREDIT' THEN t.amount ELSE -t.amount END) as calc_balance FROM accounts a JOIN transactions t ON a.account_id = t.account_id WHERE a.account_id='ACCT-20001' GROUP BY a.balance",
    defectTemplate: 'Stored balance $5,450.00 does not match calculated balance $5,350.00 (off by $100)',
    passRate: 0.7,
  },
  {
    id: 'TC-DB-006', name: 'Status Flag Validation', priority: 'P1',
    method: 'SQL', endpoint: 'Database Query',
    env: 'QA PostgreSQL (qa-db.bank.internal:5432)',
    testData: "SELECT account_id, status, suspension_reason\nFROM accounts\nWHERE status = 'SUSPENDED';",
    expected: 'All suspended accounts have a non-null suspension_reason',
    dbValidation: "SELECT account_id FROM accounts WHERE status = 'SUSPENDED' AND suspension_reason IS NULL",
    defectTemplate: 'Suspended accounts found with NULL suspension_reason (data integrity violation)',
    passRate: 0.8,
  },
  {
    id: 'TC-DB-007', name: 'Null Constraint Validation', priority: 'P0',
    method: 'SQL', endpoint: 'Database Query',
    env: 'QA PostgreSQL (qa-db.bank.internal:5432)',
    testData: "SELECT *\nFROM customers\nWHERE first_name IS NULL\n   OR last_name IS NULL\n   OR ssn_hash IS NULL;",
    expected: '0 rows returned (all required fields are NOT NULL)',
    dbValidation: "SELECT COUNT(*) FROM customers WHERE first_name IS NULL OR last_name IS NULL OR ssn_hash IS NULL",
    defectTemplate: 'Customer records found with NULL first_name (NOT NULL constraint missing)',
    passRate: 0.8,
  },
  {
    id: 'TC-DB-008', name: 'Data Rollback After Failed Transaction', priority: 'P0',
    method: 'SQL', endpoint: 'Database Query',
    env: 'QA PostgreSQL (qa-db.bank.internal:5432)',
    testData: "-- After a failed fund transfer, verify both accounts unchanged:\nSELECT account_id, balance\nFROM accounts\nWHERE account_id IN ('ACCT-20001', 'ACCT-20002');",
    expected: 'Both balances unchanged from before the failed transfer',
    dbValidation: "SELECT account_id, balance FROM accounts WHERE account_id IN ('ACCT-20001', 'ACCT-20002')",
    defectTemplate: 'Source account debited but target not credited, transaction not rolled back',
    passRate: 0.7,
  },
  {
    id: 'TC-DB-009', name: 'Index Performance Check', priority: 'P1',
    method: 'SQL', endpoint: 'Database Query',
    env: 'QA PostgreSQL (qa-db.bank.internal:5432)',
    testData: "EXPLAIN ANALYZE\nSELECT * FROM transactions\nWHERE account_id = 'ACCT-20001'\n  AND created_at > '2026-01-01';",
    expected: 'USING INDEX idx_transactions_account_date (no sequential scan)',
    dbValidation: "EXPLAIN QUERY PLAN SELECT * FROM transactions WHERE account_id = 'ACCT-20001' AND created_at > '2026-01-01'",
    defectTemplate: 'Missing index on transactions(account_id, created_at) causing full table scan',
    passRate: 0.8,
  },
  {
    id: 'TC-DB-010', name: 'Cross-Table Consistency', priority: 'P0',
    method: 'SQL', endpoint: 'Database Query',
    env: 'QA PostgreSQL (qa-db.bank.internal:5432)',
    testData: "SELECT c.customer_id,\n       COUNT(DISTINCT a.account_id) as acct_count,\n       COUNT(DISTINCT t.txn_id) as txn_count\nFROM customers c\nLEFT JOIN accounts a ON c.customer_id = a.customer_id\nLEFT JOIN transactions t ON a.account_id = t.account_id\nGROUP BY c.customer_id;",
    expected: 'Consistent counts, no orphan transactions without valid accounts',
    dbValidation: "SELECT t.txn_id FROM transactions t LEFT JOIN accounts a ON t.account_id = a.account_id WHERE a.account_id IS NULL",
    defectTemplate: 'Orphan transactions found referencing deleted/non-existent account IDs',
    passRate: 0.8,
  },
];

/* =====================================================
   TAB 6: Negative & Edge Case Test Data
   ===================================================== */
const NEGATIVE_TESTS = [
  {
    id: 'TC-NEG-001', name: 'Oversized Payload (5MB body)', priority: 'P1',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      scenario: 'Send 5MB JSON payload',
      body: '{ "firstName": "A".repeat(5242880), ... }',
      payloadSize: '5MB',
      maxAllowed: '1MB'
    }, null, 2),
    expected: '413 Payload Too Large, "Request body exceeds maximum size of 1MB"',
    dbValidation: 'N/A (request rejected at gateway)',
    defectTemplate: 'Server accepts 5MB payload, causes OOM error and 500 response',
    passRate: 0.1,
  },
  {
    id: 'TC-NEG-002', name: "Special Characters in Name (O'Brien, Mueller)", priority: 'P1',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      firstName: "O'Brien", lastName: 'Mueller',
      dob: '1988-07-22', email: 'obrien.mueller@email.com',
      ssn: '222-33-4444', type: 'INDIVIDUAL'
    }, null, 2),
    expected: "201 Created, name stored correctly with special characters preserved",
    dbValidation: "SELECT first_name, last_name FROM customers WHERE email='obrien.mueller@email.com'",
    defectTemplate: "Apostrophe in name causes SQL error: unterminated string literal",
    passRate: 0.1,
  },
  {
    id: 'TC-NEG-003', name: 'Boundary Amount (0.01, 0.00, -1.00)', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/transactions',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      testCases: [
        { amount: 0.01, expected: '201 Created (minimum valid)' },
        { amount: 0.00, expected: '400 Bad Request (zero amount)' },
        { amount: -1.00, expected: '400 Bad Request (negative amount)' }
      ],
      accountId: 'ACCT-20001', type: 'DEPOSIT'
    }, null, 2),
    expected: '$0.01 accepted, $0.00 rejected, -$1.00 rejected',
    dbValidation: "SELECT amount FROM transactions WHERE account_id='ACCT-20001' ORDER BY created_at DESC LIMIT 3",
    defectTemplate: 'Negative transaction amount -$1.00 accepted, balance incorrectly increased',
    passRate: 0.1,
  },
  {
    id: 'TC-NEG-004', name: 'Max String Length (255 char name)', priority: 'P1',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      firstName: 'A'.repeat(256),
      lastName: 'B'.repeat(256),
      dob: '1990-01-01', email: 'longname@email.com',
      ssn: '333-44-5555', type: 'INDIVIDUAL',
      note: 'First and last name each 256 characters (max is 255)'
    }, null, 2),
    expected: '400 Bad Request, "firstName exceeds maximum length of 255 characters"',
    dbValidation: 'N/A (request should be rejected before DB)',
    defectTemplate: 'Name with 256 characters accepted, truncated silently in DB',
    passRate: 0.1,
  },
  {
    id: 'TC-NEG-005', name: 'Invalid HTTP Method (DELETE on read-only)', priority: 'P1',
    method: 'DELETE', endpoint: '/api/v1/customers/CUST-10001/transactions',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      note: 'Transactions endpoint only supports GET, DELETE not allowed'
    }, null, 2),
    expected: '405 Method Not Allowed, "DELETE method not supported on this endpoint"',
    dbValidation: 'N/A',
    defectTemplate: 'DELETE method on transaction history returns 500 instead of 405',
    passRate: 0.1,
  },
  {
    id: 'TC-NEG-006', name: 'Malformed JSON Body', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: '{ "firstName": "John", "lastName": "Doe", INVALID_JSON }',
    expected: '400 Bad Request, "Malformed JSON in request body"',
    dbValidation: 'N/A (request rejected at parse stage)',
    defectTemplate: 'Malformed JSON causes unhandled exception, returns 500 with stack trace',
    passRate: 0.1,
  },
  {
    id: 'TC-NEG-007', name: 'Invalid Date Format (MM/DD/YYYY vs YYYY-MM-DD)', priority: 'P1',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      firstName: 'John', lastName: 'Doe', dob: '03/15/1985',
      email: 'john.doe@email.com', ssn: '444-55-6666', type: 'INDIVIDUAL',
      note: 'DOB in MM/DD/YYYY format instead of required YYYY-MM-DD'
    }, null, 2),
    expected: '400 Bad Request, "Invalid date format. Expected: YYYY-MM-DD"',
    dbValidation: 'N/A (request should be rejected before DB)',
    defectTemplate: 'Date 03/15/1985 silently parsed as 1985-03-15, no format validation',
    passRate: 0.1,
  },
  {
    id: 'TC-NEG-008', name: 'Empty Request Body', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/customers',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: '(empty body)',
    expected: '400 Bad Request, "Request body is required"',
    dbValidation: 'N/A',
    defectTemplate: 'Empty POST body causes NullPointerException, returns 500 with stack trace',
    passRate: 0.1,
  },
  {
    id: 'TC-NEG-009', name: 'Concurrent Account Creation (Race Condition)', priority: 'P0',
    method: 'POST', endpoint: '/api/v1/accounts (x2 simultaneous)',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      scenario: 'Two simultaneous savings account creation for same customer',
      request1: { customerId: 'CUST-10001', type: 'SAVINGS', initialDeposit: 500 },
      request2: { customerId: 'CUST-10001', type: 'SAVINGS', initialDeposit: 500 },
      note: 'Only one should succeed due to unique constraint'
    }, null, 2),
    expected: 'One returns 201, other returns 409 Conflict',
    dbValidation: "SELECT COUNT(*) FROM accounts WHERE customer_id='CUST-10001' AND type='SAVINGS' AND status='ACTIVE'",
    defectTemplate: 'Race condition creates duplicate savings accounts for same customer',
    passRate: 0.1,
  },
  {
    id: 'TC-NEG-010', name: 'Request Timeout (30 second threshold)', priority: 'P1',
    method: 'POST', endpoint: '/api/v1/reports/generate',
    env: 'QA (https://qa-api.bank.com/v1)',
    testData: JSON.stringify({
      reportType: 'FULL_AUDIT',
      dateRange: { from: '2020-01-01', to: '2026-02-26' },
      note: 'Large date range report that exceeds 30s timeout'
    }, null, 2),
    expected: '408 Request Timeout or 202 Accepted with async job reference',
    dbValidation: "SELECT * FROM async_jobs WHERE job_type='REPORT' ORDER BY created_at DESC LIMIT 1",
    defectTemplate: 'Long-running report request hangs server thread, no timeout enforced',
    passRate: 0.1,
  },
];

/* =====================================================
   TAB 7: Environment Configuration
   ===================================================== */
const ENVIRONMENTS = [
  { aspect: 'Base URL', dev: 'localhost:3001', qa: 'qa-api.bank.com', uat: 'uat-api.bank.com', prod: 'api.bank.com' },
  { aspect: 'Auth', dev: 'Disabled', qa: 'Basic Auth', uat: 'OAuth 2.0', prod: 'OAuth 2.0 + MFA' },
  { aspect: 'Database', dev: 'SQLite (local)', qa: 'PostgreSQL (shared)', uat: 'PostgreSQL (isolated)', prod: 'PostgreSQL (cluster)' },
  { aspect: 'Test Data', dev: 'Auto-seeded', qa: 'Managed', uat: 'Masked prod copy', prod: 'N/A' },
  { aspect: 'Monitoring', dev: 'Console logs', qa: 'ELK Stack', uat: 'ELK + APM', prod: 'Full observability' },
  { aspect: 'SSL/TLS', dev: 'HTTP', qa: 'TLS 1.2', uat: 'TLS 1.3', prod: 'TLS 1.3 + HSTS' },
  { aspect: 'Rate Limit', dev: 'None', qa: '200/min', uat: '100/min', prod: '50/min' },
  { aspect: 'Logging', dev: 'DEBUG', qa: 'INFO', uat: 'INFO', prod: 'WARN' },
];

const TEST_DATA_REFS = [
  { category: 'Customer IDs', range: 'CUST-10001 to CUST-10050' },
  { category: 'Account IDs', range: 'ACCT-20001 to ACCT-20100' },
  { category: 'Employee IDs', range: 'EMP-3001 to EMP-3020' },
  { category: 'Branch Codes', range: 'BR-001 to BR-010' },
  { category: 'Product Codes', range: 'SAV-STD, CHK-STD, TD-12M, TD-24M' },
  { category: 'Transaction IDs', range: 'TXN-30001 to TXN-39999' },
];

const COMMON_HEADERS = [
  { header: 'Content-Type', value: 'application/json' },
  { header: 'Authorization', value: 'Bearer <token>' },
  { header: 'X-Correlation-ID', value: '<uuid>' },
  { header: 'X-Client-ID', value: 'qa-automation' },
  { header: 'Accept', value: 'application/json' },
  { header: 'X-Idempotency-Key', value: '<uuid> (for POST requests)' },
];

/* =====================================================
   TAB 8: Defect Templates
   ===================================================== */
const DEFECT_TEMPLATES = [
  {
    id: 'DEF-001',
    summary: 'CreateAccount returns 500 with valid data',
    severity: 'Critical',
    priority: 'P0',
    environment: 'QA (qa-api.bank.com)',
    stepsToReproduce: [
      'Authenticate with valid Bearer token',
      'POST /api/v1/accounts with valid payload: { "customerId": "CUST-10001", "type": "SAVINGS", "currency": "CAD", "initialDeposit": 500.00 }',
      'Observe response status and body',
    ],
    request: 'POST /api/v1/accounts\nContent-Type: application/json\nAuthorization: Bearer <valid_token>\n\n{\n  "customerId": "CUST-10001",\n  "type": "SAVINGS",\n  "currency": "CAD",\n  "initialDeposit": 500.00,\n  "branchCode": "BR-001"\n}',
    expectedResult: '201 Created with generated accountNumber and status=ACTIVE',
    actualResult: '500 Internal Server Error\n{\n  "error": "NullPointerException",\n  "message": "Cannot invoke method on null object",\n  "trace": "at AccountService.create(AccountService.java:45)"\n}',
    dbEvidence: "SELECT * FROM accounts WHERE customer_id='CUST-10001' ORDER BY created_at DESC LIMIT 1;\n-- Result: No new record created (transaction rolled back)",
    businessImpact: 'Customers cannot open new savings accounts. Branch staff must use manual workaround. Estimated 200+ account openings blocked per day.',
  },
  {
    id: 'DEF-002',
    summary: 'Balance not updated after deposit',
    severity: 'Critical',
    priority: 'P0',
    environment: 'QA (qa-api.bank.com)',
    stepsToReproduce: [
      'Note current balance of ACCT-20001 (e.g., $5,000.00)',
      'POST /api/v1/transactions with deposit of $1,000.00',
      'Verify response shows 201 Created with transactionId',
      'GET /api/v1/accounts/ACCT-20001 and check balance',
    ],
    request: 'POST /api/v1/transactions\nContent-Type: application/json\n\n{\n  "accountId": "ACCT-20001",\n  "type": "DEPOSIT",\n  "amount": 1000.00,\n  "currency": "CAD",\n  "reference": "DEP-TEST-001"\n}',
    expectedResult: 'Balance updated from $5,000.00 to $6,000.00',
    actualResult: 'Transaction record created (TXN-30045) but account balance remains $5,000.00.\nGET /api/v1/accounts/ACCT-20001 returns: { "balance": 5000.00 }',
    dbEvidence: "SELECT txn_id, amount, status FROM transactions WHERE reference='DEP-TEST-001';\n-- Result: TXN-30045, amount=1000.00, status=COMPLETED\n\nSELECT balance FROM accounts WHERE account_id='ACCT-20001';\n-- Result: balance=5000.00 (SHOULD BE 6000.00)",
    businessImpact: 'Customer deposits are recorded but balances are incorrect. Affects all deposit transactions. Risk of financial discrepancy and regulatory audit failure.',
  },
  {
    id: 'DEF-003',
    summary: 'Duplicate transaction created (idempotency failure)',
    severity: 'High',
    priority: 'P1',
    environment: 'QA (qa-api.bank.com)',
    stepsToReproduce: [
      'POST /api/v1/transactions with reference DEP-20260226-001',
      'Note the 201 response with transactionId TXN-30050',
      'POST the exact same request again with same reference',
      'Observe a new 201 response with different transactionId TXN-30051',
    ],
    request: 'POST /api/v1/transactions\nX-Idempotency-Key: dep-key-001\n\n{\n  "accountId": "ACCT-20001",\n  "type": "DEPOSIT",\n  "amount": 5000.00,\n  "reference": "DEP-20260226-001"\n}',
    expectedResult: 'Second request returns 200 with original TXN-30050 (idempotent)',
    actualResult: 'Second request returns 201 with NEW TXN-30051.\nBalance double-credited: $10,000 instead of $5,000.',
    dbEvidence: "SELECT * FROM transactions WHERE reference='DEP-20260226-001';\n-- Result: 2 rows (TXN-30050 and TXN-30051) - SHOULD BE 1 ROW\n\nSELECT balance FROM accounts WHERE account_id='ACCT-20001';\n-- Result: balance inflated by duplicate deposit",
    businessImpact: 'Network retries or client-side double-clicks create duplicate transactions. Risk of financial loss and incorrect account balances. Affects all transaction types.',
  },
  {
    id: 'DEF-004',
    summary: 'SSN exposed in plain text in response',
    severity: 'Critical',
    priority: 'P0',
    environment: 'QA (qa-api.bank.com)',
    stepsToReproduce: [
      'Authenticate with valid Bearer token',
      'GET /api/v1/customers/CUST-10001',
      'Inspect the response body for SSN field',
      'Observe SSN is returned in plain text instead of masked',
    ],
    request: 'GET /api/v1/customers/CUST-10001\nAuthorization: Bearer <valid_token>\nAccept: application/json',
    expectedResult: 'SSN masked: "***-**-6789"',
    actualResult: 'SSN in plain text: "123-45-6789"\n\nFull response:\n{\n  "customerId": "CUST-10001",\n  "firstName": "Rajesh",\n  "lastName": "Kumar",\n  "ssn": "123-45-6789",\n  "email": "rajesh.kumar@email.com"\n}',
    dbEvidence: "SELECT ssn_encrypted FROM customers WHERE customer_id='CUST-10001';\n-- Result: SSN is encrypted in DB, but API layer decrypts and returns plain text",
    businessImpact: 'PII data exposure violates PIPEDA, GDPR, and PCI-DSS requirements. All customer SSNs accessible to any authenticated user. Immediate security incident. Regulatory fines possible.',
  },
  {
    id: 'DEF-005',
    summary: 'Suspended account allows withdrawal',
    severity: 'Critical',
    priority: 'P0',
    environment: 'QA (qa-api.bank.com)',
    stepsToReproduce: [
      'Verify ACCT-20001 status is SUSPENDED (via GET /api/v1/accounts/ACCT-20001)',
      'POST /api/v1/transactions with withdrawal from ACCT-20001',
      'Observe the withdrawal is processed successfully instead of being blocked',
    ],
    request: 'POST /api/v1/transactions\nContent-Type: application/json\n\n{\n  "accountId": "ACCT-20001",\n  "type": "WITHDRAWAL",\n  "amount": 500.00,\n  "currency": "CAD"\n}',
    expectedResult: '403 Forbidden: "Account is suspended. Transactions not allowed."',
    actualResult: '201 Created\n{\n  "transactionId": "TXN-30060",\n  "status": "COMPLETED",\n  "amount": 500.00,\n  "balanceAfter": 4500.00\n}',
    dbEvidence: "SELECT status FROM accounts WHERE account_id='ACCT-20001';\n-- Result: status='SUSPENDED'\n\nSELECT * FROM transactions WHERE account_id='ACCT-20001' AND created_at > '2026-02-26';\n-- Result: Withdrawal of $500 processed on suspended account",
    businessImpact: 'Fraud investigation controls bypassed. Funds can be withdrawn from accounts under investigation. Severe compliance and financial risk.',
  },
];

/* =====================================================
   Collect all tests by tab
   ===================================================== */
const ALL_TESTS = {
  customers: CUSTOMER_TESTS,
  accounts: ACCOUNT_TESTS,
  transactions: TRANSACTION_TESTS,
  auth: AUTH_TESTS,
  db: DB_TESTS,
  negative: NEGATIVE_TESTS,
};

/* =====================================================
   Main Component
   ===================================================== */
function BankingApiTestSuite() {
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedTestId, setSelectedTestId] = useState('TC-CUST-001');
  const [testResults, setTestResults] = useState({});
  const [runningTest, setRunningTest] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const totalTests = Object.values(ALL_TESTS).reduce((sum, arr) => sum + arr.length, 0);
  const currentTests = ALL_TESTS[activeTab] || [];
  const selectedTest = currentTests.find(t => t.id === selectedTestId) || currentTests[0];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const tests = ALL_TESTS[tabId];
    if (tests && tests.length > 0) {
      setSelectedTestId(tests[0].id);
    }
  };

  const runTest = (testId) => {
    setRunningTest(testId);
    setProgressPercent(0);

    const test = currentTests.find(t => t.id === testId);
    if (!test) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        const passed = Math.random() < test.passRate;
        const execTime = (Math.random() * 2 + 0.3).toFixed(2);
        setTestResults(prev => ({
          ...prev,
          [testId]: {
            status: passed ? 'pass' : 'fail',
            executionTime: execTime + 's',
            actualResult: passed ? test.expected : 'Unexpected: ' + test.defectTemplate,
            timestamp: new Date().toISOString(),
          }
        }));
        setRunningTest(null);
      }
      setProgressPercent(Math.min(progress, 100));
    }, 300);
  };

  const runAllTests = () => {
    const tests = [...currentTests];
    let idx = 0;
    const runNext = () => {
      if (idx >= tests.length) return;
      const t = tests[idx];
      idx++;
      setRunningTest(t.id);
      setSelectedTestId(t.id);
      setProgressPercent(0);

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 40 + 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          const passed = Math.random() < t.passRate;
          const execTime = (Math.random() * 2 + 0.3).toFixed(2);
          setTestResults(prev => ({
            ...prev,
            [t.id]: {
              status: passed ? 'pass' : 'fail',
              executionTime: execTime + 's',
              actualResult: passed ? t.expected : 'Unexpected: ' + t.defectTemplate,
              timestamp: new Date().toISOString(),
            }
          }));
          setRunningTest(null);
          setTimeout(runNext, 200);
        }
        setProgressPercent(Math.min(progress, 100));
      }, 200);
    };
    runNext();
  };

  const getStatusIcon = (testId) => {
    if (runningTest === testId) return '\u25B6';
    const result = testResults[testId];
    if (!result) return '\u25CB';
    return result.status === 'pass' ? '\u2713' : '\u2717';
  };

  const getStatusColor = (testId) => {
    if (runningTest === testId) return C.warning;
    const result = testResults[testId];
    if (!result) return C.notRun;
    return result.status === 'pass' ? C.success : C.fail;
  };

  const passCount = Object.values(testResults).filter(r => r.status === 'pass').length;
  const failCount = Object.values(testResults).filter(r => r.status === 'fail').length;

  /* ── Render Helpers ── */

  const renderEnvironmentTab = () => (
    <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
      <h2 style={{ color: C.textBright, margin: '0 0 20px', fontSize: '22px' }}>Test Environment Configuration</h2>

      <div style={{ background: C.card, borderRadius: '10px', padding: '20px', marginBottom: '24px', border: '1px solid ' + C.border }}>
        <h3 style={{ color: C.accent, margin: '0 0 16px', fontSize: '18px' }}>Environment Matrix</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Aspect', 'DEV', 'QA', 'UAT', 'PROD'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: C.accent, borderBottom: '2px solid ' + C.border, fontSize: '13px', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENVIRONMENTS.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '10px 14px', color: C.textBright, fontWeight: 600, borderBottom: '1px solid ' + C.border, fontSize: '13px' }}>{row.aspect}</td>
                  <td style={{ padding: '10px 14px', color: C.text, borderBottom: '1px solid ' + C.border, fontSize: '13px' }}>{row.dev}</td>
                  <td style={{ padding: '10px 14px', color: C.text, borderBottom: '1px solid ' + C.border, fontSize: '13px' }}>{row.qa}</td>
                  <td style={{ padding: '10px 14px', color: C.text, borderBottom: '1px solid ' + C.border, fontSize: '13px' }}>{row.uat}</td>
                  <td style={{ padding: '10px 14px', color: C.text, borderBottom: '1px solid ' + C.border, fontSize: '13px' }}>{row.prod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: C.card, borderRadius: '10px', padding: '20px', border: '1px solid ' + C.border }}>
          <h3 style={{ color: C.accent, margin: '0 0 16px', fontSize: '18px' }}>Test Data Reference</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: C.accent, borderBottom: '2px solid ' + C.border, fontSize: '13px' }}>Category</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: C.accent, borderBottom: '2px solid ' + C.border, fontSize: '13px' }}>Range</th>
              </tr>
            </thead>
            <tbody>
              {TEST_DATA_REFS.map((ref, i) => (
                <tr key={i}>
                  <td style={{ padding: '8px 12px', color: C.textBright, fontWeight: 600, borderBottom: '1px solid ' + C.border, fontSize: '13px' }}>{ref.category}</td>
                  <td style={{ padding: '8px 12px', color: C.text, borderBottom: '1px solid ' + C.border, fontSize: '13px', fontFamily: 'monospace' }}>{ref.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: C.card, borderRadius: '10px', padding: '20px', border: '1px solid ' + C.border }}>
          <h3 style={{ color: C.accent, margin: '0 0 16px', fontSize: '18px' }}>Common Headers</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: C.accent, borderBottom: '2px solid ' + C.border, fontSize: '13px' }}>Header</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: C.accent, borderBottom: '2px solid ' + C.border, fontSize: '13px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {COMMON_HEADERS.map((h, i) => (
                <tr key={i}>
                  <td style={{ padding: '8px 12px', color: C.textBright, fontWeight: 600, borderBottom: '1px solid ' + C.border, fontSize: '13px', fontFamily: 'monospace' }}>{h.header}</td>
                  <td style={{ padding: '8px 12px', color: C.text, borderBottom: '1px solid ' + C.border, fontSize: '13px', fontFamily: 'monospace' }}>{h.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDefectsTab = () => (
    <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
      <h2 style={{ color: C.textBright, margin: '0 0 20px', fontSize: '22px' }}>Sample Defect Reports</h2>
      <p style={{ color: C.textMuted, margin: '0 0 20px', fontSize: '14px' }}>
        Copy these templates when filing defects. Update the fields with actual test execution data.
      </p>

      {DEFECT_TEMPLATES.map((defect) => (
        <div key={defect.id} style={{
          background: C.card, borderRadius: '10px', padding: '20px', marginBottom: '20px',
          border: '1px solid ' + C.border,
          borderLeft: '4px solid ' + (defect.severity === 'Critical' ? C.fail : C.warning)
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span style={{ color: C.textMuted, fontSize: '12px', fontFamily: 'monospace', marginRight: '12px' }}>{defect.id}</span>
              <span style={{ color: C.textBright, fontSize: '16px', fontWeight: 700 }}>{defect.summary}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                background: defect.severity === 'Critical' ? 'rgba(231,76,60,0.2)' : 'rgba(243,156,18,0.2)',
                color: defect.severity === 'Critical' ? C.fail : C.warning
              }}>{defect.severity}</span>
              <span style={{
                padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                background: 'rgba(78,204,163,0.15)', color: C.accent
              }}>{defect.priority}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ color: C.accent, fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Environment</div>
              <div style={{ color: C.text, fontSize: '13px' }}>{defect.environment}</div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: C.accent, fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Steps to Reproduce</div>
            <ol style={{ margin: 0, paddingLeft: '20px' }}>
              {defect.stepsToReproduce.map((step, i) => (
                <li key={i} style={{ color: C.text, fontSize: '13px', marginBottom: '4px', lineHeight: '1.5' }}>{step}</li>
              ))}
            </ol>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: C.accent, fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Request</div>
            <pre style={{
              background: C.codeBg, color: C.codeText, padding: '12px', borderRadius: '6px',
              fontSize: '12px', fontFamily: "'Fira Code', 'Consolas', monospace", overflowX: 'auto',
              margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', border: '1px solid ' + C.border
            }}>{defect.request}</pre>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ color: C.success, fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expected Result</div>
              <div style={{ color: C.text, fontSize: '13px', background: 'rgba(78,204,163,0.08)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(78,204,163,0.2)' }}>{defect.expectedResult}</div>
            </div>
            <div>
              <div style={{ color: C.fail, fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actual Result</div>
              <pre style={{
                color: C.text, fontSize: '12px', background: 'rgba(231,76,60,0.08)', padding: '10px',
                borderRadius: '6px', border: '1px solid rgba(231,76,60,0.2)', margin: 0,
                whiteSpace: 'pre-wrap', fontFamily: "'Fira Code', 'Consolas', monospace"
              }}>{defect.actualResult}</pre>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: C.accent, fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DB Evidence (SQL)</div>
            <pre style={{
              background: C.codeBg, color: C.codeText, padding: '12px', borderRadius: '6px',
              fontSize: '12px', fontFamily: "'Fira Code', 'Consolas', monospace", overflowX: 'auto',
              margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', border: '1px solid ' + C.border
            }}>{defect.dbEvidence}</pre>
          </div>

          <div style={{
            background: 'rgba(231,76,60,0.08)', padding: '12px', borderRadius: '6px',
            border: '1px solid rgba(231,76,60,0.2)'
          }}>
            <div style={{ color: C.fail, fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Impact</div>
            <div style={{ color: C.text, fontSize: '13px', lineHeight: '1.5' }}>{defect.businessImpact}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTestDetailPanel = () => {
    if (!selectedTest) return null;
    const result = testResults[selectedTest.id];
    const isRunning = runningTest === selectedTest.id;

    return (
      <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
        {/* Test Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ color: C.textMuted, fontSize: '12px', fontFamily: 'monospace' }}>{selectedTest.id}</span>
              <span style={{
                padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                background: selectedTest.priority === 'P0' ? 'rgba(231,76,60,0.2)' : selectedTest.priority === 'P1' ? 'rgba(243,156,18,0.2)' : 'rgba(78,204,163,0.15)',
                color: selectedTest.priority === 'P0' ? C.fail : selectedTest.priority === 'P1' ? C.warning : C.accent
              }}>{selectedTest.priority}</span>
              {result && (
                <span style={{
                  padding: '2px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                  background: result.status === 'pass' ? 'rgba(78,204,163,0.2)' : 'rgba(231,76,60,0.2)',
                  color: result.status === 'pass' ? C.success : C.fail
                }}>{result.status === 'pass' ? 'PASSED' : 'FAILED'} ({result.executionTime})</span>
              )}
            </div>
            <h3 style={{ color: C.textBright, margin: 0, fontSize: '18px' }}>{selectedTest.name}</h3>
          </div>
          <button
            onClick={() => runTest(selectedTest.id)}
            disabled={isRunning}
            style={{
              padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: isRunning ? 'not-allowed' : 'pointer',
              background: isRunning ? C.border : C.accent, color: isRunning ? C.textMuted : '#0a0a1a',
              fontSize: '14px', fontWeight: 700, transition: 'all 0.2s',
            }}
          >
            {isRunning ? 'Running...' : 'Run Test'}
          </button>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: C.textMuted, fontSize: '12px' }}>Executing test...</span>
              <span style={{ color: C.accent, fontSize: '12px', fontWeight: 700 }}>{Math.round(progressPercent)}%</span>
            </div>
            <div style={{ height: '6px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: 'linear-gradient(90deg, ' + C.accent + ', ' + C.accentDark + ')',
                borderRadius: '3px', width: progressPercent + '%', transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Method & Endpoint */}
        <div style={{ background: C.card, borderRadius: '8px', padding: '14px', marginBottom: '16px', border: '1px solid ' + C.border }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700,
              background: (METHOD_COLORS[selectedTest.method] || '#8b949e') + '22',
              color: METHOD_COLORS[selectedTest.method] || '#8b949e'
            }}>{selectedTest.method}</span>
            <span style={{ color: C.text, fontSize: '14px', fontFamily: 'monospace' }}>{selectedTest.endpoint}</span>
          </div>
          <div style={{ color: C.textMuted, fontSize: '12px', marginTop: '8px' }}>{selectedTest.env}</div>
        </div>

        {/* Test Data */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: C.accent, fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Test Data</div>
          <pre style={{
            background: C.codeBg, color: C.codeText, padding: '14px', borderRadius: '8px',
            fontSize: '12px', fontFamily: "'Fira Code', 'Consolas', monospace", overflowX: 'auto',
            margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            border: '1px solid ' + C.border, maxHeight: '250px', overflowY: 'auto'
          }}>{selectedTest.testData}</pre>
        </div>

        {/* Expected Result */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: C.success, fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expected Result</div>
          <div style={{
            background: 'rgba(78,204,163,0.08)', padding: '12px', borderRadius: '8px',
            color: C.text, fontSize: '13px', border: '1px solid rgba(78,204,163,0.2)', lineHeight: '1.5'
          }}>{selectedTest.expected}</div>
        </div>

        {/* Actual Result (after execution) */}
        {result && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              color: result.status === 'pass' ? C.success : C.fail, fontSize: '12px', fontWeight: 700,
              marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>Actual Result</div>
            <div style={{
              background: result.status === 'pass' ? 'rgba(78,204,163,0.08)' : 'rgba(231,76,60,0.08)',
              padding: '12px', borderRadius: '8px', color: C.text, fontSize: '13px',
              border: '1px solid ' + (result.status === 'pass' ? 'rgba(78,204,163,0.2)' : 'rgba(231,76,60,0.2)'),
              lineHeight: '1.5'
            }}>{result.actualResult}</div>
          </div>
        )}

        {/* DB Validation */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: C.accent, fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SQL Validation Query</div>
          <pre style={{
            background: C.codeBg, color: '#61affe', padding: '14px', borderRadius: '8px',
            fontSize: '12px', fontFamily: "'Fira Code', 'Consolas', monospace", overflowX: 'auto',
            margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', border: '1px solid ' + C.border
          }}>{selectedTest.dbValidation}</pre>
        </div>

        {/* Defect Template (shown when test fails) */}
        {result && result.status === 'fail' && (
          <div style={{
            background: 'rgba(231,76,60,0.08)', padding: '16px', borderRadius: '8px',
            border: '1px solid rgba(231,76,60,0.2)', marginBottom: '16px'
          }}>
            <div style={{ color: C.fail, fontSize: '12px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suggested Defect Summary</div>
            <div style={{ color: C.text, fontSize: '14px', fontWeight: 600 }}>{selectedTest.defectTemplate}</div>
            <div style={{ color: C.textMuted, fontSize: '12px', marginTop: '8px' }}>
              Executed at: {result.timestamp} | Duration: {result.executionTime}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ── Main Layout ── */
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, ' + C.bgGradientFrom + ' 0%, ' + C.bgGradientTo + ' 100%)',
      fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
      color: C.text,
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 28px', borderBottom: '1px solid ' + C.border,
        background: 'rgba(15,52,96,0.6)', backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: C.textBright, fontSize: '24px', fontWeight: 700 }}>
              Banking API Test Suite
            </h1>
            <p style={{ margin: '4px 0 0', color: C.textMuted, fontSize: '13px' }}>
              Comprehensive QA Testing Dashboard | API v1
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { label: 'Total Tests', value: totalTests, color: C.accent },
              { label: 'Passed', value: passCount, color: C.success },
              { label: 'Failed', value: failCount, color: C.fail },
              { label: 'Environments', value: 4, color: '#61affe' },
              { label: 'Defect Templates', value: 5, color: C.warning },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ color: stat.color, fontSize: '22px', fontWeight: 700 }}>{stat.value}</div>
                <div style={{ color: C.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: 'flex', padding: '0 20px', borderBottom: '1px solid ' + C.border,
        background: 'rgba(15,52,96,0.3)', overflowX: 'auto'
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              padding: '14px 20px', border: 'none', cursor: 'pointer',
              background: 'transparent',
              color: activeTab === tab.id ? C.accent : C.textMuted,
              fontSize: '13px', fontWeight: activeTab === tab.id ? 700 : 500,
              borderBottom: activeTab === tab.id ? '3px solid ' + C.accent : '3px solid transparent',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'environment' ? (
        renderEnvironmentTab()
      ) : activeTab === 'defects' ? (
        renderDefectsTab()
      ) : (
        <div style={{ display: 'flex', height: 'calc(100vh - 140px)' }}>
          {/* Left Panel: Test List */}
          <div style={{
            width: '340px', minWidth: '340px', borderRight: '1px solid ' + C.border,
            background: 'rgba(15,52,96,0.2)', overflowY: 'auto'
          }}>
            <div style={{
              padding: '14px 16px', borderBottom: '1px solid ' + C.border,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ color: C.textMuted, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {currentTests.length} Test Cases
              </span>
              <button
                onClick={runAllTests}
                disabled={runningTest !== null}
                style={{
                  padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: runningTest ? 'not-allowed' : 'pointer',
                  background: runningTest ? C.border : C.accent, color: runningTest ? C.textMuted : '#0a0a1a',
                  fontSize: '12px', fontWeight: 700,
                }}
              >Run All</button>
            </div>

            {currentTests.map(test => (
              <div
                key={test.id}
                onClick={() => setSelectedTestId(test.id)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  borderBottom: '1px solid ' + C.border,
                  background: selectedTestId === test.id ? 'rgba(78,204,163,0.1)' : 'transparent',
                  borderLeft: selectedTestId === test.id ? '3px solid ' + C.accent : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '22px', height: '22px', borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700,
                    background: getStatusColor(test.id) + '22', color: getStatusColor(test.id),
                    flexShrink: 0,
                  }}>{getStatusIcon(test.id)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: C.textBright, fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{test.name}</div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '3px', alignItems: 'center' }}>
                      <span style={{ color: C.textMuted, fontSize: '11px', fontFamily: 'monospace' }}>{test.id}</span>
                      <span style={{
                        padding: '1px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 700,
                        background: (METHOD_COLORS[test.method] || '#8b949e') + '22',
                        color: METHOD_COLORS[test.method] || '#8b949e'
                      }}>{test.method}</span>
                      <span style={{
                        padding: '1px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 700,
                        background: test.priority === 'P0' ? 'rgba(231,76,60,0.15)' : test.priority === 'P1' ? 'rgba(243,156,18,0.15)' : 'rgba(78,204,163,0.1)',
                        color: test.priority === 'P0' ? C.fail : test.priority === 'P1' ? C.warning : C.accent
                      }}>{test.priority}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel: Test Detail */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {renderTestDetailPanel()}
          </div>
        </div>
      )}
    </div>
  );
}

export default BankingApiTestSuite;

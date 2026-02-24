import React, { useState } from 'react';

/* ═══════════════════════════════════════════════════
   Module Data — User Stories, Test Stories, Process Flows
   ═══════════════════════════════════════════════════ */

const MODULE_TABS = [
  { id: 'registration', label: 'Registration' },
  { id: 'login', label: 'Login' },
  { id: 'account_opening', label: 'Account Opening' },
  { id: 'fund_transfer', label: 'Fund Transfer' },
  { id: 'bill_payment', label: 'Bill Payment' },
  { id: 'loan_application', label: 'Loan Application' },
  { id: 'card_management', label: 'Card Management' },
  { id: 'security_testing', label: 'Security Testing' },
];

/* Step type determines colour:
   user    = blue (#58a6ff)
   system  = green (#3fb950)
   validation = orange (#d29922)
   error   = red (#f85149)                              */

const MODULE_DATA = {
  /* ──────── Registration ──────── */
  registration: {
    userStory: [
      { text: 'User Visits Site', type: 'user' },
      { text: 'Click Register', type: 'user' },
      { text: 'Fill Personal Info', type: 'user' },
      { text: 'Upload ID Proof', type: 'user' },
      { text: 'Set Password', type: 'user' },
      { text: 'OTP Verification', type: 'validation' },
      { text: 'Account Created', type: 'system' },
      { text: 'Welcome Email', type: 'system' },
    ],
    testStory: [
      { text: 'Prepare Test Data', type: 'user' },
      { text: 'Review Test Case', type: 'user' },
      { text: 'Execute Test Steps', type: 'user' },
      { text: 'Record Actual Result', type: 'system' },
      { text: 'Compare Expected vs Actual', type: 'validation' },
      { text: 'Mark Pass/Fail', type: 'validation' },
      { text: 'Log Defect (if fail)', type: 'error' },
      { text: 'Update Report', type: 'system' },
    ],
    processDetail: [
      {
        step: 1,
        action: 'Navigate to registration page',
        type: 'user',
        input: '{ "url": "/register" }',
        expectedOutput: 'Registration form displayed with all required fields',
        endpoint: 'GET /register',
        dbTables: '- (no DB interaction)',
      },
      {
        step: 2,
        action: 'Submit personal information',
        type: 'user',
        input: '{\n  "first_name": "Rajesh",\n  "last_name": "Kumar",\n  "email": "rajesh@example.com",\n  "phone": "+919876543210",\n  "pan": "ABCDE1234F"\n}',
        expectedOutput: 'Form validated; proceed to ID upload',
        endpoint: 'POST /api/v1/auth/validate-info',
        dbTables: '- (validation only, no write)',
      },
      {
        step: 3,
        action: 'Upload identity proof document',
        type: 'user',
        input: '{\n  "document_type": "aadhaar",\n  "file": "aadhaar_front.jpg",\n  "file_size": "1.2MB"\n}',
        expectedOutput: '{ "upload_id": "DOC-00123", "status": "uploaded" }',
        endpoint: 'POST /api/v1/auth/upload-kyc',
        dbTables: 'kyc_documents, audit_log',
      },
      {
        step: 4,
        action: 'Set account password',
        type: 'user',
        input: '{\n  "password": "********",\n  "confirm_password": "********"\n}',
        expectedOutput: 'Password strength: Strong. Password accepted.',
        endpoint: 'POST /api/v1/auth/set-password',
        dbTables: 'customers (password_hash)',
      },
      {
        step: 5,
        action: 'Send and verify OTP',
        type: 'validation',
        input: '{\n  "phone": "+919876543210",\n  "otp": "456789"\n}',
        expectedOutput: '{ "verified": true, "message": "OTP verified successfully" }',
        endpoint: 'POST /api/v1/auth/verify-otp',
        dbTables: 'otp_tokens, audit_log',
      },
      {
        step: 6,
        action: 'Create customer account in system',
        type: 'system',
        input: '(internal — aggregated registration data)',
        expectedOutput: '{\n  "customer_id": "CUST00012",\n  "account_number": "ACC2024000012",\n  "status": "active"\n}',
        endpoint: 'POST /api/v1/auth/register',
        dbTables: 'customers, accounts, audit_log',
      },
      {
        step: 7,
        action: 'Send welcome email & SMS notification',
        type: 'system',
        input: '{\n  "customer_id": "CUST00012",\n  "email": "rajesh@example.com"\n}',
        expectedOutput: '{ "email_sent": true, "sms_sent": true }',
        endpoint: 'POST /api/v1/notifications/send',
        dbTables: 'notifications',
      },
    ],
  },

  /* ──────── Login ──────── */
  login: {
    userStory: [
      { text: 'Open App', type: 'user' },
      { text: 'Enter Email/Password', type: 'user' },
      { text: 'Validate Credentials', type: 'validation' },
      { text: 'Check Account Status', type: 'validation' },
      { text: 'Generate Session', type: 'system' },
      { text: 'Load Dashboard', type: 'system' },
      { text: 'Show Notifications', type: 'system' },
    ],
    testStory: [
      { text: 'Prepare Test Data', type: 'user' },
      { text: 'Review Test Case', type: 'user' },
      { text: 'Execute Test Steps', type: 'user' },
      { text: 'Record Actual Result', type: 'system' },
      { text: 'Compare Expected vs Actual', type: 'validation' },
      { text: 'Mark Pass/Fail', type: 'validation' },
      { text: 'Log Defect (if fail)', type: 'error' },
      { text: 'Update Report', type: 'system' },
    ],
    processDetail: [
      {
        step: 1,
        action: 'Navigate to login page',
        type: 'user',
        input: '{ "url": "/login" }',
        expectedOutput: 'Login form displayed with email and password fields',
        endpoint: 'GET /login',
        dbTables: '- (no DB interaction)',
      },
      {
        step: 2,
        action: 'Submit login credentials',
        type: 'user',
        input: '{\n  "email": "rajesh@example.com",\n  "password": "********"\n}',
        expectedOutput: 'Credentials submitted for validation',
        endpoint: 'POST /api/v1/auth/login',
        dbTables: 'customers (read)',
      },
      {
        step: 3,
        action: 'Validate credentials against stored hash',
        type: 'validation',
        input: '(internal — bcrypt comparison)',
        expectedOutput: '{ "valid": true }',
        endpoint: '(internal service)',
        dbTables: 'customers, login_attempts',
      },
      {
        step: 4,
        action: 'Check account status (active, locked, suspended)',
        type: 'validation',
        input: '{ "customer_id": "CUST00012" }',
        expectedOutput: '{ "status": "active", "kyc_verified": true }',
        endpoint: '(internal service)',
        dbTables: 'customers',
      },
      {
        step: 5,
        action: 'Generate JWT session token',
        type: 'system',
        input: '{ "customer_id": "CUST00012", "role": "customer" }',
        expectedOutput: '{\n  "token": "eyJhbGciOi...",\n  "expires_in": 3600\n}',
        endpoint: 'POST /api/v1/auth/login (response)',
        dbTables: 'sessions, audit_log',
      },
      {
        step: 6,
        action: 'Load dashboard data and recent notifications',
        type: 'system',
        input: '{ "Authorization": "Bearer eyJhbGciOi..." }',
        expectedOutput: '{\n  "balance": 52340.00,\n  "recent_txn": [...],\n  "notifications": 3\n}',
        endpoint: 'GET /api/v1/dashboard',
        dbTables: 'accounts, transactions, notifications',
      },
    ],
  },

  /* ──────── Account Opening ──────── */
  account_opening: {
    userStory: [
      { text: 'Login', type: 'user' },
      { text: 'Navigate to Accounts', type: 'user' },
      { text: 'Select Account Type', type: 'user' },
      { text: 'Enter Details', type: 'user' },
      { text: 'Initial Deposit', type: 'user' },
      { text: 'Accept T&C', type: 'validation' },
      { text: 'Generate Account Number', type: 'system' },
      { text: 'Confirmation', type: 'system' },
    ],
    testStory: [
      { text: 'Prepare Test Data', type: 'user' },
      { text: 'Review Test Case', type: 'user' },
      { text: 'Execute Test Steps', type: 'user' },
      { text: 'Record Actual Result', type: 'system' },
      { text: 'Compare Expected vs Actual', type: 'validation' },
      { text: 'Mark Pass/Fail', type: 'validation' },
      { text: 'Log Defect (if fail)', type: 'error' },
      { text: 'Update Report', type: 'system' },
    ],
    processDetail: [
      {
        step: 1,
        action: 'Authenticate and navigate to account opening',
        type: 'user',
        input: '{ "Authorization": "Bearer <token>" }',
        expectedOutput: 'Account opening form displayed with account type selector',
        endpoint: 'GET /api/v1/accounts/new',
        dbTables: 'account_types (read)',
      },
      {
        step: 2,
        action: 'Select account type (savings/current/FD/RD)',
        type: 'user',
        input: '{ "account_type": "savings" }',
        expectedOutput: 'Form fields updated for savings account requirements',
        endpoint: '(client-side)',
        dbTables: '- (no DB interaction)',
      },
      {
        step: 3,
        action: 'Enter account details and nominee information',
        type: 'user',
        input: '{\n  "branch": "MG Road, Bengaluru",\n  "nominee_name": "Priya Kumar",\n  "nominee_relation": "spouse",\n  "initial_deposit": 10000\n}',
        expectedOutput: 'Details validated; proceed to T&C acceptance',
        endpoint: 'POST /api/v1/accounts/validate',
        dbTables: '- (validation only)',
      },
      {
        step: 4,
        action: 'Accept terms and conditions',
        type: 'validation',
        input: '{ "terms_accepted": true, "timestamp": "2024-01-15T10:30:00Z" }',
        expectedOutput: '{ "consent_recorded": true }',
        endpoint: 'POST /api/v1/accounts/accept-terms',
        dbTables: 'consents, audit_log',
      },
      {
        step: 5,
        action: 'Process initial deposit',
        type: 'system',
        input: '{\n  "amount": 10000,\n  "payment_method": "upi",\n  "upi_id": "rajesh@ybl"\n}',
        expectedOutput: '{ "transaction_id": "TXN20240001", "status": "success" }',
        endpoint: 'POST /api/v1/payments/deposit',
        dbTables: 'transactions, ledger',
      },
      {
        step: 6,
        action: 'Generate account number and activate account',
        type: 'system',
        input: '(internal — system generated)',
        expectedOutput: '{\n  "account_number": "ACC2024000045",\n  "ifsc": "BANK0001234",\n  "status": "active"\n}',
        endpoint: 'POST /api/v1/accounts/create',
        dbTables: 'accounts, customers, audit_log',
      },
      {
        step: 7,
        action: 'Send confirmation with account details',
        type: 'system',
        input: '{ "customer_id": "CUST00012", "channel": ["email", "sms"] }',
        expectedOutput: '{ "email_sent": true, "sms_sent": true }',
        endpoint: 'POST /api/v1/notifications/send',
        dbTables: 'notifications',
      },
    ],
  },

  /* ──────── Fund Transfer ──────── */
  fund_transfer: {
    userStory: [
      { text: 'Login', type: 'user' },
      { text: 'Select Transfer Type', type: 'user' },
      { text: 'Choose Beneficiary', type: 'user' },
      { text: 'Enter Amount', type: 'user' },
      { text: 'Verify Balance', type: 'validation' },
      { text: 'Enter OTP', type: 'validation' },
      { text: 'Process Transfer', type: 'system' },
      { text: 'Debit/Credit', type: 'system' },
      { text: 'Send Notification', type: 'system' },
    ],
    testStory: [
      { text: 'Prepare Test Data', type: 'user' },
      { text: 'Review Test Case', type: 'user' },
      { text: 'Execute Test Steps', type: 'user' },
      { text: 'Record Actual Result', type: 'system' },
      { text: 'Compare Expected vs Actual', type: 'validation' },
      { text: 'Mark Pass/Fail', type: 'validation' },
      { text: 'Log Defect (if fail)', type: 'error' },
      { text: 'Update Report', type: 'system' },
    ],
    processDetail: [
      {
        step: 1,
        action: 'Select transfer type (NEFT/RTGS/IMPS/UPI)',
        type: 'user',
        input: '{ "transfer_type": "IMPS" }',
        expectedOutput: 'Transfer form displayed with beneficiary selector',
        endpoint: 'GET /api/v1/transfers/new',
        dbTables: 'beneficiaries (read)',
      },
      {
        step: 2,
        action: 'Choose beneficiary from saved list or add new',
        type: 'user',
        input: '{\n  "beneficiary_id": "BEN00045",\n  "account_number": "ACC2024000099",\n  "ifsc": "SBIN0001234",\n  "name": "Amit Sharma"\n}',
        expectedOutput: 'Beneficiary selected; amount field enabled',
        endpoint: 'GET /api/v1/beneficiaries/BEN00045',
        dbTables: 'beneficiaries',
      },
      {
        step: 3,
        action: 'Enter transfer amount and remarks',
        type: 'user',
        input: '{\n  "amount": 25000.00,\n  "remarks": "Rent payment - Jan 2024",\n  "purpose": "personal"\n}',
        expectedOutput: 'Amount accepted; proceed to verification',
        endpoint: '(client-side validation)',
        dbTables: '- (no DB interaction)',
      },
      {
        step: 4,
        action: 'Verify sufficient balance in source account',
        type: 'validation',
        input: '{ "account_id": "ACC2024000012", "amount": 25000.00 }',
        expectedOutput: '{ "sufficient": true, "available_balance": 52340.00 }',
        endpoint: 'POST /api/v1/accounts/check-balance',
        dbTables: 'accounts (read)',
      },
      {
        step: 5,
        action: 'Send OTP and verify transaction authorization',
        type: 'validation',
        input: '{\n  "phone": "+919876543210",\n  "otp": "789012",\n  "transaction_ref": "TXN-REF-001"\n}',
        expectedOutput: '{ "verified": true }',
        endpoint: 'POST /api/v1/auth/verify-txn-otp',
        dbTables: 'otp_tokens, audit_log',
      },
      {
        step: 6,
        action: 'Process fund transfer (debit sender, credit receiver)',
        type: 'system',
        input: '{\n  "from": "ACC2024000012",\n  "to": "ACC2024000099",\n  "amount": 25000.00,\n  "type": "IMPS"\n}',
        expectedOutput: '{\n  "transaction_id": "TXN20240567",\n  "status": "success",\n  "new_balance": 27340.00\n}',
        endpoint: 'POST /api/v1/transfers/execute',
        dbTables: 'transactions, ledger, accounts',
      },
      {
        step: 7,
        action: 'Send transaction notification to both parties',
        type: 'system',
        input: '{ "transaction_id": "TXN20240567" }',
        expectedOutput: '{ "sender_notified": true, "receiver_notified": true }',
        endpoint: 'POST /api/v1/notifications/transaction',
        dbTables: 'notifications',
      },
    ],
  },

  /* ──────── Bill Payment ──────── */
  bill_payment: {
    userStory: [
      { text: 'Login', type: 'user' },
      { text: 'Select Bill Category', type: 'user' },
      { text: 'Enter Consumer No', type: 'user' },
      { text: 'Fetch Bill Amount', type: 'system' },
      { text: 'Confirm Payment', type: 'validation' },
      { text: 'Debit Account', type: 'system' },
      { text: 'Generate Receipt', type: 'system' },
      { text: 'Send Notification', type: 'system' },
    ],
    testStory: [
      { text: 'Prepare Test Data', type: 'user' },
      { text: 'Review Test Case', type: 'user' },
      { text: 'Execute Test Steps', type: 'user' },
      { text: 'Record Actual Result', type: 'system' },
      { text: 'Compare Expected vs Actual', type: 'validation' },
      { text: 'Mark Pass/Fail', type: 'validation' },
      { text: 'Log Defect (if fail)', type: 'error' },
      { text: 'Update Report', type: 'system' },
    ],
    processDetail: [
      {
        step: 1,
        action: 'Select bill category (electricity/gas/water/broadband/mobile)',
        type: 'user',
        input: '{ "category": "electricity" }',
        expectedOutput: 'Biller list displayed for selected category',
        endpoint: 'GET /api/v1/bills/categories/electricity/billers',
        dbTables: 'billers (read)',
      },
      {
        step: 2,
        action: 'Enter consumer/account number for the biller',
        type: 'user',
        input: '{\n  "biller_id": "BESCOM",\n  "consumer_number": "EL-KA-BNG-123456"\n}',
        expectedOutput: 'Consumer number validated; fetching bill details',
        endpoint: 'POST /api/v1/bills/validate-consumer',
        dbTables: '- (external biller API)',
      },
      {
        step: 3,
        action: 'Fetch outstanding bill amount from biller',
        type: 'system',
        input: '{ "biller_id": "BESCOM", "consumer_number": "EL-KA-BNG-123456" }',
        expectedOutput: '{\n  "bill_amount": 2450.00,\n  "due_date": "2024-02-15",\n  "bill_period": "Jan 2024"\n}',
        endpoint: 'POST /api/v1/bills/fetch-amount',
        dbTables: 'bill_fetch_log',
      },
      {
        step: 4,
        action: 'Confirm payment details and authorize',
        type: 'validation',
        input: '{\n  "amount": 2450.00,\n  "account_id": "ACC2024000012",\n  "confirmed": true\n}',
        expectedOutput: '{ "balance_sufficient": true, "payment_authorized": true }',
        endpoint: 'POST /api/v1/bills/confirm',
        dbTables: 'accounts (read)',
      },
      {
        step: 5,
        action: 'Debit customer account and pay biller',
        type: 'system',
        input: '{\n  "account_id": "ACC2024000012",\n  "biller_id": "BESCOM",\n  "amount": 2450.00\n}',
        expectedOutput: '{\n  "payment_id": "BILL-PAY-00789",\n  "status": "success",\n  "new_balance": 24890.00\n}',
        endpoint: 'POST /api/v1/bills/pay',
        dbTables: 'transactions, ledger, accounts, bill_payments',
      },
      {
        step: 6,
        action: 'Generate payment receipt',
        type: 'system',
        input: '{ "payment_id": "BILL-PAY-00789" }',
        expectedOutput: '{\n  "receipt_number": "RCT-20240789",\n  "pdf_url": "/receipts/RCT-20240789.pdf"\n}',
        endpoint: 'GET /api/v1/bills/receipt/BILL-PAY-00789',
        dbTables: 'receipts',
      },
      {
        step: 7,
        action: 'Send payment confirmation notification',
        type: 'system',
        input: '{ "payment_id": "BILL-PAY-00789", "channel": ["email", "sms", "push"] }',
        expectedOutput: '{ "notified": true }',
        endpoint: 'POST /api/v1/notifications/send',
        dbTables: 'notifications',
      },
    ],
  },

  /* ──────── Loan Application ──────── */
  loan_application: {
    userStory: [
      { text: 'Login', type: 'user' },
      { text: 'Check Eligibility', type: 'validation' },
      { text: 'Select Loan Type', type: 'user' },
      { text: 'Enter Amount/Tenure', type: 'user' },
      { text: 'Upload Documents', type: 'user' },
      { text: 'Submit Application', type: 'user' },
      { text: 'Underwriting', type: 'system' },
      { text: 'Approval/Rejection', type: 'validation' },
      { text: 'Disbursement', type: 'system' },
    ],
    testStory: [
      { text: 'Prepare Test Data', type: 'user' },
      { text: 'Review Test Case', type: 'user' },
      { text: 'Execute Test Steps', type: 'user' },
      { text: 'Record Actual Result', type: 'system' },
      { text: 'Compare Expected vs Actual', type: 'validation' },
      { text: 'Mark Pass/Fail', type: 'validation' },
      { text: 'Log Defect (if fail)', type: 'error' },
      { text: 'Update Report', type: 'system' },
    ],
    processDetail: [
      {
        step: 1,
        action: 'Check loan eligibility based on credit score and income',
        type: 'validation',
        input: '{\n  "customer_id": "CUST00012",\n  "annual_income": 1200000,\n  "existing_emis": 5000\n}',
        expectedOutput: '{\n  "eligible": true,\n  "credit_score": 780,\n  "max_eligible_amount": 2500000\n}',
        endpoint: 'POST /api/v1/loans/check-eligibility',
        dbTables: 'customers, credit_scores, loan_applications (read)',
      },
      {
        step: 2,
        action: 'Select loan type (personal/home/vehicle/education)',
        type: 'user',
        input: '{ "loan_type": "personal" }',
        expectedOutput: 'Loan form with type-specific fields displayed',
        endpoint: 'GET /api/v1/loans/types/personal',
        dbTables: 'loan_products (read)',
      },
      {
        step: 3,
        action: 'Enter loan amount, tenure, and EMI preference',
        type: 'user',
        input: '{\n  "amount": 500000,\n  "tenure_months": 36,\n  "interest_rate": 10.5,\n  "emi_date": 5\n}',
        expectedOutput: '{\n  "monthly_emi": 16267,\n  "total_interest": 85612,\n  "total_payable": 585612\n}',
        endpoint: 'POST /api/v1/loans/calculate-emi',
        dbTables: '- (calculation only)',
      },
      {
        step: 4,
        action: 'Upload required documents (salary slips, bank statements)',
        type: 'user',
        input: '{\n  "documents": [\n    { "type": "salary_slip", "file": "salary_dec.pdf" },\n    { "type": "bank_statement", "file": "stmt_6months.pdf" },\n    { "type": "address_proof", "file": "utility_bill.pdf" }\n  ]\n}',
        expectedOutput: '{ "all_uploaded": true, "document_ids": ["DOC-101", "DOC-102", "DOC-103"] }',
        endpoint: 'POST /api/v1/loans/upload-documents',
        dbTables: 'loan_documents, audit_log',
      },
      {
        step: 5,
        action: 'Submit loan application for processing',
        type: 'user',
        input: '{\n  "customer_id": "CUST00012",\n  "loan_type": "personal",\n  "amount": 500000,\n  "tenure": 36\n}',
        expectedOutput: '{\n  "application_id": "LOAN-APP-2024-00567",\n  "status": "under_review"\n}',
        endpoint: 'POST /api/v1/loans/apply',
        dbTables: 'loan_applications, audit_log',
      },
      {
        step: 6,
        action: 'Automated underwriting and risk assessment',
        type: 'system',
        input: '{ "application_id": "LOAN-APP-2024-00567" }',
        expectedOutput: '{\n  "risk_score": "low",\n  "recommendation": "approve",\n  "conditions": []\n}',
        endpoint: '(internal underwriting engine)',
        dbTables: 'loan_applications, risk_assessments',
      },
      {
        step: 7,
        action: 'Approval decision and loan disbursement',
        type: 'system',
        input: '{ "application_id": "LOAN-APP-2024-00567", "decision": "approved" }',
        expectedOutput: '{\n  "loan_id": "LOAN-2024-00567",\n  "disbursed_amount": 500000,\n  "disbursement_date": "2024-01-20",\n  "first_emi_date": "2024-02-05"\n}',
        endpoint: 'POST /api/v1/loans/disburse',
        dbTables: 'loans, transactions, ledger, accounts, notifications',
      },
    ],
  },

  /* ──────── Card Management ──────── */
  card_management: {
    userStory: [
      { text: 'Login', type: 'user' },
      { text: 'View Cards', type: 'user' },
      { text: 'Select Card', type: 'user' },
      { text: 'Choose Action', type: 'user' },
      { text: 'Enter OTP', type: 'validation' },
      { text: 'Process Request', type: 'system' },
      { text: 'Update Status', type: 'system' },
      { text: 'Notification', type: 'system' },
    ],
    testStory: [
      { text: 'Prepare Test Data', type: 'user' },
      { text: 'Review Test Case', type: 'user' },
      { text: 'Execute Test Steps', type: 'user' },
      { text: 'Record Actual Result', type: 'system' },
      { text: 'Compare Expected vs Actual', type: 'validation' },
      { text: 'Mark Pass/Fail', type: 'validation' },
      { text: 'Log Defect (if fail)', type: 'error' },
      { text: 'Update Report', type: 'system' },
    ],
    processDetail: [
      {
        step: 1,
        action: 'View all cards linked to account',
        type: 'user',
        input: '{ "customer_id": "CUST00012" }',
        expectedOutput: '{\n  "cards": [\n    { "card_id": "CARD-001", "type": "debit", "last4": "4532", "status": "active" },\n    { "card_id": "CARD-002", "type": "credit", "last4": "7891", "status": "active" }\n  ]\n}',
        endpoint: 'GET /api/v1/cards',
        dbTables: 'cards (read)',
      },
      {
        step: 2,
        action: 'Select card and view details',
        type: 'user',
        input: '{ "card_id": "CARD-001" }',
        expectedOutput: '{\n  "card_number": "****-****-****-4532",\n  "expiry": "12/2027",\n  "daily_limit": 100000,\n  "intl_enabled": true\n}',
        endpoint: 'GET /api/v1/cards/CARD-001',
        dbTables: 'cards',
      },
      {
        step: 3,
        action: 'Choose management action (block/unblock/set limit/enable intl)',
        type: 'user',
        input: '{\n  "card_id": "CARD-001",\n  "action": "set_limit",\n  "new_daily_limit": 50000\n}',
        expectedOutput: 'Action queued; OTP verification required',
        endpoint: '(client-side)',
        dbTables: '- (no DB interaction)',
      },
      {
        step: 4,
        action: 'Verify OTP for card management action',
        type: 'validation',
        input: '{\n  "phone": "+919876543210",\n  "otp": "345678",\n  "action_ref": "ACT-REF-001"\n}',
        expectedOutput: '{ "verified": true }',
        endpoint: 'POST /api/v1/auth/verify-txn-otp',
        dbTables: 'otp_tokens, audit_log',
      },
      {
        step: 5,
        action: 'Process card management request',
        type: 'system',
        input: '{\n  "card_id": "CARD-001",\n  "action": "set_limit",\n  "new_daily_limit": 50000\n}',
        expectedOutput: '{\n  "request_id": "CARD-REQ-00123",\n  "status": "processed",\n  "effective_from": "immediate"\n}',
        endpoint: 'POST /api/v1/cards/CARD-001/manage',
        dbTables: 'cards, card_requests, audit_log',
      },
      {
        step: 6,
        action: 'Send confirmation notification',
        type: 'system',
        input: '{ "request_id": "CARD-REQ-00123" }',
        expectedOutput: '{ "sms_sent": true, "email_sent": true, "push_sent": true }',
        endpoint: 'POST /api/v1/notifications/send',
        dbTables: 'notifications',
      },
    ],
  },

  /* ──────── Security Testing ──────── */
  security_testing: {
    userStory: [
      { text: 'Identify Endpoint', type: 'user' },
      { text: 'Craft Attack Payload', type: 'user' },
      { text: 'Send Request', type: 'user' },
      { text: 'Validate Input Sanitization', type: 'validation' },
      { text: 'Check Response', type: 'validation' },
      { text: 'Verify Audit Log', type: 'system' },
      { text: 'Report Finding', type: 'error' },
    ],
    testStory: [
      { text: 'Prepare Test Data', type: 'user' },
      { text: 'Review Test Case', type: 'user' },
      { text: 'Execute Test Steps', type: 'user' },
      { text: 'Record Actual Result', type: 'system' },
      { text: 'Compare Expected vs Actual', type: 'validation' },
      { text: 'Mark Pass/Fail', type: 'validation' },
      { text: 'Log Defect (if fail)', type: 'error' },
      { text: 'Update Report', type: 'system' },
    ],
    processDetail: [
      {
        step: 1,
        action: 'Identify target endpoint and HTTP method',
        type: 'user',
        input: '{\n  "endpoint": "POST /api/v1/auth/login",\n  "method": "POST",\n  "auth_required": false\n}',
        expectedOutput: 'Endpoint mapped; attack vectors identified',
        endpoint: '(reconnaissance phase)',
        dbTables: '- (documentation review)',
      },
      {
        step: 2,
        action: 'Craft attack payload (SQL injection / XSS / path traversal)',
        type: 'user',
        input: '{\n  "test_type": "sql_injection",\n  "payload": {\n    "email": "admin\'--",\n    "password": "OR 1=1--"\n  }\n}',
        expectedOutput: 'Payload crafted; ready to send',
        endpoint: '(test preparation)',
        dbTables: '- (no DB interaction)',
      },
      {
        step: 3,
        action: 'Send malicious request to target endpoint',
        type: 'user',
        input: '{\n  "method": "POST",\n  "url": "/api/v1/auth/login",\n  "body": { "email": "admin\'--", "password": "OR 1=1--" },\n  "headers": { "Content-Type": "application/json" }\n}',
        expectedOutput: '{ "status": 422, "detail": "Invalid email format" }',
        endpoint: 'POST /api/v1/auth/login',
        dbTables: 'audit_log (security event logged)',
      },
      {
        step: 4,
        action: 'Validate that input sanitization blocked the attack',
        type: 'validation',
        input: '(inspect response status and body)',
        expectedOutput: 'Status 422 (not 200/500). No SQL error in response. Parameterized query used.',
        endpoint: '(response analysis)',
        dbTables: '- (no DB interaction)',
      },
      {
        step: 5,
        action: 'Check response headers for security compliance',
        type: 'validation',
        input: '(inspect response headers)',
        expectedOutput: '{\n  "X-Content-Type-Options": "nosniff",\n  "X-Frame-Options": "DENY",\n  "Strict-Transport-Security": "max-age=31536000",\n  "Content-Security-Policy": "default-src \'self\'"\n}',
        endpoint: '(header inspection)',
        dbTables: '- (no DB interaction)',
      },
      {
        step: 6,
        action: 'Verify security event logged in audit trail',
        type: 'system',
        input: '{\n  "query": "SELECT * FROM audit_log WHERE event_type = \'security_violation\' ORDER BY created_at DESC LIMIT 1"\n}',
        expectedOutput: '{\n  "event_type": "security_violation",\n  "source_ip": "192.168.1.100",\n  "details": "SQL injection attempt blocked",\n  "severity": "high"\n}',
        endpoint: 'GET /api/v1/admin/audit-log?event_type=security_violation',
        dbTables: 'audit_log',
      },
      {
        step: 7,
        action: 'Document finding and severity in security report',
        type: 'error',
        input: '{\n  "finding": "SQL injection attempt on login endpoint",\n  "severity": "informational",\n  "result": "blocked",\n  "recommendation": "Continue monitoring; input sanitization working as expected"\n}',
        expectedOutput: 'Security finding documented. Test PASSED (attack was blocked).',
        endpoint: 'POST /api/v1/admin/security-reports',
        dbTables: 'security_reports, audit_log',
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════
   Color helpers
   ═══════════════════════════════════════════════════ */

const TYPE_COLORS = {
  user: { bg: 'rgba(88, 166, 255, 0.12)', border: '#58a6ff', text: '#58a6ff', label: 'User Action' },
  system: { bg: 'rgba(63, 185, 80, 0.12)', border: '#3fb950', text: '#3fb950', label: 'System Action' },
  validation: { bg: 'rgba(210, 153, 34, 0.12)', border: '#d29922', text: '#d29922', label: 'Validation' },
  error: { bg: 'rgba(248, 81, 73, 0.12)', border: '#f85149', text: '#f85149', label: 'Error / Alert' },
};

/* ═══════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════ */

/** Horizontal flowchart built with CSS flexbox */
function HorizontalFlow({ steps, title, titleColor }) {
  return (
    <div style={s.flowSection}>
      <h3 style={{ ...s.flowTitle, color: titleColor || '#f0f6fc' }}>{title}</h3>
      <div style={s.flowContainer}>
        <div style={s.flowTrack}>
          {steps.map((step, idx) => {
            const colors = TYPE_COLORS[step.type] || TYPE_COLORS.user;
            const isLast = idx === steps.length - 1;
            return (
              <React.Fragment key={idx}>
                <div
                  style={{
                    ...s.flowBox,
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  }}
                >
                  <span style={s.flowStepNum}>{idx + 1}</span>
                  <span style={{ ...s.flowBoxText, color: colors.text }}>{step.text}</span>
                </div>
                {!isLast && (
                  <div style={s.arrowContainer}>
                    <div style={s.arrowLine} />
                    <div style={s.arrowHead} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div style={s.legendRow}>
        {Object.entries(TYPE_COLORS).map(([key, val]) => (
          <div key={key} style={s.legendItem}>
            <span style={{ ...s.legendDot, backgroundColor: val.border }} />
            <span style={s.legendLabel}>{val.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Process flow detail — vertical step list */
function ProcessDetail({ steps }) {
  return (
    <div style={s.processSection}>
      <h3 style={{ ...s.flowTitle, color: '#f0f6fc' }}>Process Flow Detail</h3>
      <div style={s.processSteps}>
        {steps.map((step, idx) => {
          const colors = TYPE_COLORS[step.type] || TYPE_COLORS.user;
          const isLast = idx === steps.length - 1;
          return (
            <div key={idx} style={s.processStepWrapper}>
              {/* Connector line */}
              {!isLast && <div style={s.verticalConnector} />}
              {/* Step card */}
              <div
                style={{
                  ...s.processCard,
                  borderLeftColor: colors.border,
                }}
              >
                {/* Header row */}
                <div style={s.processCardHeader}>
                  <span
                    style={{
                      ...s.processStepBadge,
                      backgroundColor: colors.border,
                    }}
                  >
                    Step {step.step}
                  </span>
                  <span
                    style={{
                      ...s.processTypeBadge,
                      backgroundColor: colors.bg,
                      color: colors.text,
                      borderColor: colors.border,
                    }}
                  >
                    {colors.label}
                  </span>
                </div>

                {/* Action */}
                <div style={s.processAction}>{step.action}</div>

                {/* Grid of detail fields */}
                <div style={s.processGrid}>
                  {/* Input */}
                  <div style={s.processField}>
                    <div style={s.processFieldLabel}>Input Data</div>
                    <pre style={s.processFieldCode}>{step.input}</pre>
                  </div>

                  {/* Expected Output */}
                  <div style={s.processField}>
                    <div style={s.processFieldLabel}>Expected Output</div>
                    <pre style={s.processFieldCode}>{step.expectedOutput}</pre>
                  </div>
                </div>

                {/* Endpoint + Tables row */}
                <div style={s.processMetaRow}>
                  <div style={s.processMeta}>
                    <span style={s.processMetaLabel}>API Endpoint</span>
                    <code style={s.processMetaCode}>{step.endpoint}</code>
                  </div>
                  <div style={s.processMeta}>
                    <span style={s.processMetaLabel}>DB Tables</span>
                    <code style={s.processMetaCode}>{step.dbTables}</code>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */

export default function ProcessFlow() {
  const [activeTab, setActiveTab] = useState('registration');
  const [expandedSections, setExpandedSections] = useState({
    userStory: true,
    testStory: true,
    processDetail: true,
  });

  const moduleData = MODULE_DATA[activeTab];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div style={s.container}>
      {/* Page Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <h2 style={s.title}>Process Flow</h2>
          <span style={s.subtitle}>
            User stories, test stories and process flows for banking modules
          </span>
        </div>
        <div style={s.headerActions}>
          <button
            style={s.toggleAllBtn}
            onClick={() => {
              const allExpanded =
                expandedSections.userStory &&
                expandedSections.testStory &&
                expandedSections.processDetail;
              setExpandedSections({
                userStory: !allExpanded,
                testStory: !allExpanded,
                processDetail: !allExpanded,
              });
            }}
          >
            {expandedSections.userStory && expandedSections.testStory && expandedSections.processDetail
              ? 'Collapse All'
              : 'Expand All'}
          </button>
        </div>
      </div>

      {/* Module Tabs */}
      <div style={s.tabBar}>
        <div style={s.tabScroll}>
          {MODULE_TABS.map((tab) => (
            <button
              key={tab.id}
              style={{
                ...s.tab,
                ...(activeTab === tab.id ? s.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={s.content}>
        {moduleData ? (
          <>
            {/* Section 1: User Story Flow */}
            <div style={s.sectionCard}>
              <div style={s.sectionHeader} onClick={() => toggleSection('userStory')}>
                <div style={s.sectionHeaderLeft}>
                  <span style={s.chevron}>{expandedSections.userStory ? '\u25BC' : '\u25B6'}</span>
                  <span style={s.sectionNum}>1</span>
                  <h3 style={s.sectionTitle}>User Story Flow</h3>
                  <span style={s.sectionBadge}>
                    {moduleData.userStory.length} steps
                  </span>
                </div>
                <span style={s.sectionHint}>
                  How the end-user experiences this module
                </span>
              </div>
              {expandedSections.userStory && (
                <div style={s.sectionBody}>
                  <HorizontalFlow
                    steps={moduleData.userStory}
                    title="End-User Journey"
                    titleColor="#58a6ff"
                  />
                </div>
              )}
            </div>

            {/* Section 2: Test Story */}
            <div style={s.sectionCard}>
              <div style={s.sectionHeader} onClick={() => toggleSection('testStory')}>
                <div style={s.sectionHeaderLeft}>
                  <span style={s.chevron}>{expandedSections.testStory ? '\u25BC' : '\u25B6'}</span>
                  <span style={s.sectionNum}>2</span>
                  <h3 style={s.sectionTitle}>Test Story</h3>
                  <span style={s.sectionBadge}>
                    {moduleData.testStory.length} steps
                  </span>
                </div>
                <span style={s.sectionHint}>
                  What a tester does for this module
                </span>
              </div>
              {expandedSections.testStory && (
                <div style={s.sectionBody}>
                  <HorizontalFlow
                    steps={moduleData.testStory}
                    title="Tester's Workflow"
                    titleColor="#a371f7"
                  />
                </div>
              )}
            </div>

            {/* Section 3: Process Flow Detail */}
            <div style={s.sectionCard}>
              <div style={s.sectionHeader} onClick={() => toggleSection('processDetail')}>
                <div style={s.sectionHeaderLeft}>
                  <span style={s.chevron}>{expandedSections.processDetail ? '\u25BC' : '\u25B6'}</span>
                  <span style={s.sectionNum}>3</span>
                  <h3 style={s.sectionTitle}>Process Flow Detail</h3>
                  <span style={s.sectionBadge}>
                    {moduleData.processDetail.length} steps
                  </span>
                </div>
                <span style={s.sectionHint}>
                  Step-by-step with inputs, outputs, endpoints and DB tables
                </span>
              </div>
              {expandedSections.processDetail && (
                <div style={s.sectionBody}>
                  <ProcessDetail steps={moduleData.processDetail} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>&#128269;</div>
            <div style={s.emptyTitle}>No data available</div>
            <div style={s.emptyMessage}>
              Process flow data for this module is not yet defined.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Styles (inline, matching project convention)
   ═══════════════════════════════════════════════════ */

const s = {
  /* Layout */
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #21262d',
    backgroundColor: '#161b22',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#f0f6fc',
  },
  subtitle: {
    fontSize: '13px',
    color: '#8b949e',
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  toggleAllBtn: {
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: 500,
    border: '1px solid #30363d',
    borderRadius: '6px',
    backgroundColor: '#21262d',
    color: '#c9d1d9',
    cursor: 'pointer',
  },

  /* Tabs */
  tabBar: {
    borderBottom: '1px solid #21262d',
    backgroundColor: '#161b22',
    padding: '0 24px',
  },
  tabScroll: {
    display: 'flex',
    gap: '0',
    overflowX: 'auto',
    scrollbarWidth: 'thin',
  },
  tab: {
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#8b949e',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s, border-color 0.15s',
  },
  tabActive: {
    color: '#f0f6fc',
    borderBottomColor: '#58a6ff',
  },

  /* Content */
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  /* Section cards */
  sectionCard: {
    backgroundColor: '#161b22',
    border: '1px solid #21262d',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    cursor: 'pointer',
    userSelect: 'none',
    borderBottom: '1px solid #21262d',
  },
  sectionHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  chevron: {
    fontSize: '11px',
    color: '#8b949e',
    width: '14px',
  },
  sectionNum: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(88, 166, 255, 0.15)',
    color: '#58a6ff',
    fontSize: '12px',
    fontWeight: 700,
  },
  sectionTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: '#f0f6fc',
  },
  sectionBadge: {
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '12px',
    backgroundColor: '#21262d',
    color: '#8b949e',
    fontWeight: 500,
  },
  sectionHint: {
    fontSize: '12px',
    color: '#484f58',
  },
  sectionBody: {
    padding: '20px',
  },

  /* ─── Horizontal flowchart ─── */
  flowSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  flowTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
  },
  flowContainer: {
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  flowTrack: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    minWidth: 'max-content',
  },
  flowBox: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '130px',
    maxWidth: '170px',
    padding: '14px 16px 12px',
    borderRadius: '10px',
    border: '1.5px solid',
    backgroundColor: 'rgba(88, 166, 255, 0.08)',
    textAlign: 'center',
    gap: '6px',
    flexShrink: 0,
  },
  flowStepNum: {
    position: 'absolute',
    top: '-8px',
    left: '-8px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#21262d',
    color: '#8b949e',
    fontSize: '10px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #30363d',
  },
  flowBoxText: {
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '1.3',
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '36px',
    flexShrink: 0,
    position: 'relative',
  },
  arrowLine: {
    width: '100%',
    height: '2px',
    backgroundColor: '#30363d',
  },
  arrowHead: {
    position: 'absolute',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderLeft: '7px solid #30363d',
  },

  /* Legend */
  legendRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    paddingTop: '4px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  legendLabel: {
    fontSize: '11px',
    color: '#8b949e',
  },

  /* ─── Process detail (vertical) ─── */
  processSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  processSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    position: 'relative',
  },
  processStepWrapper: {
    position: 'relative',
    paddingLeft: '0',
    paddingBottom: '20px',
  },
  verticalConnector: {
    position: 'absolute',
    left: '20px',
    top: '70px',
    bottom: '0',
    width: '2px',
    backgroundColor: '#21262d',
    zIndex: 0,
  },
  processCard: {
    position: 'relative',
    backgroundColor: '#0d1117',
    border: '1px solid #21262d',
    borderLeft: '4px solid #58a6ff',
    borderRadius: '8px',
    overflow: 'hidden',
    zIndex: 1,
  },
  processCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderBottom: '1px solid #21262d',
  },
  processStepBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#ffffff',
  },
  processTypeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
    border: '1px solid',
  },
  processAction: {
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#f0f6fc',
    lineHeight: '1.4',
    borderBottom: '1px solid #21262d',
  },
  processGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
    backgroundColor: '#21262d',
  },
  processField: {
    backgroundColor: '#0d1117',
    padding: '12px 16px',
  },
  processFieldLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  processFieldCode: {
    margin: 0,
    padding: '10px 12px',
    backgroundColor: '#161b22',
    borderRadius: '6px',
    border: '1px solid #21262d',
    fontSize: '11px',
    lineHeight: '1.5',
    fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
    color: '#e6edf3',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflow: 'auto',
    maxHeight: '200px',
  },
  processMetaRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
    backgroundColor: '#21262d',
    borderTop: '1px solid #21262d',
  },
  processMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '10px 16px',
    backgroundColor: '#0d1117',
  },
  processMetaLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  processMetaCode: {
    fontSize: '12px',
    fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
    color: '#58a6ff',
    wordBreak: 'break-all',
  },

  /* Empty state */
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '12px',
  },
  emptyIcon: {
    fontSize: '48px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#8b949e',
  },
  emptyMessage: {
    fontSize: '14px',
    color: '#484f58',
  },
};

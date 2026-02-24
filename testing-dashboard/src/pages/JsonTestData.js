import React, { useState } from 'react';

const MODULES = [
  { key: 'registration', label: 'Registration' },
  { key: 'login', label: 'Login' },
  { key: 'account', label: 'Account' },
  { key: 'transfer', label: 'Transfer' },
  { key: 'billPayment', label: 'Bill Payment' },
  { key: 'loan', label: 'Loan' },
  { key: 'card', label: 'Card' },
];

const TEST_DATA = {
  registration: [
    {
      scenario: 'Valid Registration',
      method: 'POST',
      endpoint: '/api/customers/register',
      input: {
        first_name: 'Rahul',
        last_name: 'Mehta',
        email: 'rahul@email.com',
        phone: '+91-9999888877',
        dob: '1990-05-20',
        id_type: 'aadhar',
        id_number: '1111-2222-3333',
        password: 'Test@12345',
      },
      expected_output: {
        status: 201,
        customer_id: 'CUST-XXXXX',
        message: 'Registration successful',
      },
    },
    {
      scenario: 'Duplicate Email',
      method: 'POST',
      endpoint: '/api/customers/register',
      input: {
        first_name: 'Priya',
        last_name: 'Sharma',
        email: 'rahul@email.com',
        phone: '+91-8888777766',
        dob: '1992-08-15',
        id_type: 'pan',
        id_number: 'ABCDE1234F',
        password: 'Secure@789',
      },
      expected_output: {
        status: 409,
        error_code: 'DUPLICATE_EMAIL',
        message: 'Email already registered',
      },
    },
    {
      scenario: 'Invalid Email Format',
      method: 'POST',
      endpoint: '/api/customers/register',
      input: {
        first_name: 'Amit',
        last_name: 'Kumar',
        email: 'invalid-email',
        phone: '+91-7777666655',
        dob: '1988-03-10',
        id_type: 'aadhar',
        id_number: '4444-5555-6666',
        password: 'Strong@456',
      },
      expected_output: {
        status: 400,
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid email format',
      },
    },
    {
      scenario: 'Weak Password',
      method: 'POST',
      endpoint: '/api/customers/register',
      input: {
        first_name: 'Sneha',
        last_name: 'Patel',
        email: 'sneha@email.com',
        phone: '+91-6666555544',
        dob: '1995-11-25',
        id_type: 'passport',
        id_number: 'J1234567',
        password: '123',
      },
      expected_output: {
        status: 400,
        error_code: 'WEAK_PASSWORD',
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
      },
    },
    {
      scenario: 'Missing Required Fields',
      method: 'POST',
      endpoint: '/api/customers/register',
      input: {
        first_name: 'Vikram',
        email: 'vikram@email.com',
      },
      expected_output: {
        status: 400,
        error_code: 'MISSING_FIELDS',
        message: 'Required fields: last_name, phone, dob, id_type, id_number, password',
      },
    },
  ],
  login: [
    {
      scenario: 'Valid Login',
      method: 'POST',
      endpoint: '/api/auth/login',
      input: {
        email: 'rahul@email.com',
        password: 'Test@12345',
      },
      expected_output: {
        status: 200,
        token: 'eyJhbGciOiJIUzI1NiIs...',
        customer_id: 'CUST-00001',
        message: 'Login successful',
      },
    },
    {
      scenario: 'Wrong Password',
      method: 'POST',
      endpoint: '/api/auth/login',
      input: {
        email: 'rahul@email.com',
        password: 'WrongPass@999',
      },
      expected_output: {
        status: 401,
        error_code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        attempts_remaining: 4,
      },
    },
    {
      scenario: 'Inactive Account',
      method: 'POST',
      endpoint: '/api/auth/login',
      input: {
        email: 'inactive@email.com',
        password: 'Test@12345',
      },
      expected_output: {
        status: 403,
        error_code: 'ACCOUNT_INACTIVE',
        message: 'Account is deactivated. Contact support.',
      },
    },
    {
      scenario: 'Account Locked',
      method: 'POST',
      endpoint: '/api/auth/login',
      input: {
        email: 'locked@email.com',
        password: 'Test@12345',
      },
      expected_output: {
        status: 423,
        error_code: 'ACCOUNT_LOCKED',
        message: 'Account locked due to too many failed attempts. Try after 30 minutes.',
        locked_until: '2026-02-24T15:30:00Z',
      },
    },
  ],
  account: [
    {
      scenario: 'Create Savings Account',
      method: 'POST',
      endpoint: '/api/accounts',
      input: {
        customer_id: 'CUST-00001',
        account_type: 'savings',
        currency: 'INR',
        initial_deposit: 5000,
        branch_code: 'BR-MUM-001',
        nomination: {
          name: 'Meera Mehta',
          relationship: 'spouse',
        },
      },
      expected_output: {
        status: 201,
        account_number: 'ACC-XXXXXXXXXX',
        account_type: 'savings',
        balance: 5000,
        ifsc: 'BANK0001234',
        message: 'Account created successfully',
      },
    },
    {
      scenario: 'View Account Balance',
      method: 'GET',
      endpoint: '/api/accounts/ACC-0000000001/balance',
      input: {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIs...',
        },
      },
      expected_output: {
        status: 200,
        account_number: 'ACC-0000000001',
        available_balance: 45000.5,
        current_balance: 47500.5,
        hold_amount: 2500,
        currency: 'INR',
        last_updated: '2026-02-24T10:30:00Z',
      },
    },
    {
      scenario: 'Generate Account Statement',
      method: 'GET',
      endpoint: '/api/accounts/ACC-0000000001/statement?from=2026-01-01&to=2026-02-24',
      input: {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIs...',
        },
        query: {
          from: '2026-01-01',
          to: '2026-02-24',
          format: 'json',
        },
      },
      expected_output: {
        status: 200,
        account_number: 'ACC-0000000001',
        period: { from: '2026-01-01', to: '2026-02-24' },
        opening_balance: 30000,
        closing_balance: 45000.5,
        total_credits: 25000,
        total_debits: 9999.5,
        transaction_count: 15,
      },
    },
    {
      scenario: 'Close Account',
      method: 'POST',
      endpoint: '/api/accounts/ACC-0000000001/close',
      input: {
        customer_id: 'CUST-00001',
        reason: 'No longer needed',
        transfer_balance_to: 'ACC-0000000002',
      },
      expected_output: {
        status: 200,
        message: 'Account closed successfully',
        final_balance: 0,
        transferred_amount: 45000.5,
        closure_date: '2026-02-24',
      },
    },
  ],
  transfer: [
    {
      scenario: 'NEFT Transfer',
      method: 'POST',
      endpoint: '/api/transfers/neft',
      input: {
        from_account: 'ACC-0000000001',
        to_account: 'ACC-9999888877',
        to_ifsc: 'HDFC0001234',
        beneficiary_name: 'Anita Desai',
        amount: 15000,
        purpose: 'Rent payment',
        remarks: 'Feb 2026 rent',
      },
      expected_output: {
        status: 200,
        transaction_id: 'TXN-NEFT-XXXXX',
        status_text: 'Processing',
        amount: 15000,
        charges: 2.5,
        estimated_completion: '2-4 hours',
        message: 'NEFT transfer initiated',
      },
    },
    {
      scenario: 'IMPS Transfer',
      method: 'POST',
      endpoint: '/api/transfers/imps',
      input: {
        from_account: 'ACC-0000000001',
        to_account: 'ACC-7777666655',
        to_ifsc: 'ICIC0005678',
        beneficiary_name: 'Ravi Shankar',
        amount: 5000,
        purpose: 'Personal',
        remarks: 'Quick transfer',
      },
      expected_output: {
        status: 200,
        transaction_id: 'TXN-IMPS-XXXXX',
        status_text: 'Completed',
        amount: 5000,
        charges: 5,
        message: 'IMPS transfer successful (instant)',
      },
    },
    {
      scenario: 'Insufficient Balance',
      method: 'POST',
      endpoint: '/api/transfers/neft',
      input: {
        from_account: 'ACC-0000000001',
        to_account: 'ACC-1111222233',
        to_ifsc: 'SBIN0009876',
        beneficiary_name: 'Test User',
        amount: 999999999,
        purpose: 'Test',
      },
      expected_output: {
        status: 400,
        error_code: 'INSUFFICIENT_BALANCE',
        message: 'Insufficient balance. Available: 45,000.50, Requested: 9,99,99,99,999.00',
        available_balance: 45000.5,
      },
    },
    {
      scenario: 'Exceed Daily Transfer Limit',
      method: 'POST',
      endpoint: '/api/transfers/imps',
      input: {
        from_account: 'ACC-0000000001',
        to_account: 'ACC-4444555566',
        to_ifsc: 'UTIB0003456',
        beneficiary_name: 'Large Transfer',
        amount: 600000,
        purpose: 'Investment',
      },
      expected_output: {
        status: 400,
        error_code: 'LIMIT_EXCEEDED',
        message: 'Daily IMPS transfer limit exceeded. Limit: 5,00,000. Used today: 20,000.',
        daily_limit: 500000,
        used_today: 20000,
        remaining: 480000,
      },
    },
  ],
  billPayment: [
    {
      scenario: 'Pay Electricity Bill',
      method: 'POST',
      endpoint: '/api/bill-payments',
      input: {
        customer_id: 'CUST-00001',
        from_account: 'ACC-0000000001',
        biller_id: 'BILLER-ELEC-001',
        biller_name: 'MSEDCL',
        consumer_number: 'CON-123456789',
        amount: 2350.75,
        bill_period: 'Jan 2026',
      },
      expected_output: {
        status: 200,
        payment_id: 'PAY-XXXXX',
        status_text: 'Paid',
        amount: 2350.75,
        reference_number: 'REF-XXXXX',
        message: 'Bill payment successful',
      },
    },
    {
      scenario: 'Invalid Biller ID',
      method: 'POST',
      endpoint: '/api/bill-payments',
      input: {
        customer_id: 'CUST-00001',
        from_account: 'ACC-0000000001',
        biller_id: 'BILLER-INVALID-999',
        consumer_number: 'CON-000000000',
        amount: 500,
      },
      expected_output: {
        status: 404,
        error_code: 'BILLER_NOT_FOUND',
        message: 'Biller ID not found. Please verify the biller details.',
      },
    },
    {
      scenario: 'Schedule Auto-Pay',
      method: 'POST',
      endpoint: '/api/bill-payments/auto-pay',
      input: {
        customer_id: 'CUST-00001',
        from_account: 'ACC-0000000001',
        biller_id: 'BILLER-ELEC-001',
        consumer_number: 'CON-123456789',
        max_amount: 5000,
        frequency: 'monthly',
        start_date: '2026-03-01',
      },
      expected_output: {
        status: 201,
        auto_pay_id: 'AP-XXXXX',
        status_text: 'Active',
        next_payment_date: '2026-03-01',
        message: 'Auto-pay scheduled successfully',
      },
    },
  ],
  loan: [
    {
      scenario: 'Apply for Personal Loan',
      method: 'POST',
      endpoint: '/api/loans/apply',
      input: {
        customer_id: 'CUST-00001',
        loan_type: 'personal',
        amount: 500000,
        tenure_months: 36,
        purpose: 'Home renovation',
        monthly_income: 85000,
        existing_emi: 5000,
        employment_type: 'salaried',
        employer_name: 'TCS Ltd',
      },
      expected_output: {
        status: 201,
        application_id: 'LOAN-APP-XXXXX',
        loan_type: 'personal',
        amount: 500000,
        tenure_months: 36,
        interest_rate: 10.5,
        emi: 16267,
        total_payable: 585612,
        status_text: 'Under Review',
        message: 'Loan application submitted. Expected decision in 2-3 business days.',
      },
    },
    {
      scenario: 'View EMI Schedule',
      method: 'GET',
      endpoint: '/api/loans/LOAN-00001/emi-schedule',
      input: {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIs...',
        },
      },
      expected_output: {
        status: 200,
        loan_id: 'LOAN-00001',
        total_emis: 36,
        paid_emis: 6,
        remaining_emis: 30,
        next_emi_date: '2026-03-05',
        next_emi_amount: 16267,
        principal_paid: 75000,
        interest_paid: 22602,
        outstanding_principal: 425000,
      },
    },
    {
      scenario: 'Loan Prepayment',
      method: 'POST',
      endpoint: '/api/loans/LOAN-00001/prepay',
      input: {
        customer_id: 'CUST-00001',
        from_account: 'ACC-0000000001',
        prepayment_amount: 100000,
        adjust: 'reduce_tenure',
      },
      expected_output: {
        status: 200,
        prepayment_id: 'PREPAY-XXXXX',
        amount_paid: 100000,
        foreclosure_charge: 2000,
        new_outstanding: 325000,
        new_tenure_months: 22,
        message: 'Prepayment processed. Tenure reduced from 30 to 22 months.',
      },
    },
  ],
  card: [
    {
      scenario: 'Block Debit Card',
      method: 'POST',
      endpoint: '/api/cards/block',
      input: {
        customer_id: 'CUST-00001',
        card_number_last4: '4567',
        card_type: 'debit',
        reason: 'lost',
        request_replacement: true,
      },
      expected_output: {
        status: 200,
        card_id: 'CARD-XXXXX',
        status_text: 'Blocked',
        blocked_at: '2026-02-24T12:00:00Z',
        replacement_card_eta: '5-7 business days',
        message: 'Card blocked successfully. Replacement card will be delivered.',
      },
    },
    {
      scenario: 'Set Card Transaction Limits',
      method: 'PUT',
      endpoint: '/api/cards/CARD-00001/limits',
      input: {
        customer_id: 'CUST-00001',
        daily_atm_limit: 25000,
        daily_pos_limit: 100000,
        daily_online_limit: 50000,
        international_enabled: false,
        contactless_limit: 5000,
      },
      expected_output: {
        status: 200,
        card_id: 'CARD-00001',
        limits: {
          daily_atm: 25000,
          daily_pos: 100000,
          daily_online: 50000,
          international: false,
          contactless: 5000,
        },
        message: 'Card limits updated successfully',
      },
    },
    {
      scenario: 'View Credit Card Statement',
      method: 'GET',
      endpoint: '/api/cards/CARD-00002/statement?month=2026-01',
      input: {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIs...',
        },
        query: {
          month: '2026-01',
        },
      },
      expected_output: {
        status: 200,
        card_id: 'CARD-00002',
        statement_period: '01 Jan 2026 - 31 Jan 2026',
        opening_balance: 12500,
        purchases: 35000,
        payments_received: 20000,
        closing_balance: 27500,
        minimum_due: 2750,
        due_date: '2026-02-18',
        reward_points_earned: 350,
        total_reward_points: 4200,
      },
    },
  ],
};

function JsonTestData() {
  const [activeModule, setActiveModule] = useState('registration');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const scenarios = TEST_DATA[activeModule] || [];

  const handleCopyJson = (scenario, idx) => {
    const jsonStr = JSON.stringify(
      { scenario: scenario.scenario, input: scenario.input, expected_output: scenario.expected_output },
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleSendToTester = (scenario) => {
    alert(
      `Send to API Tester:\n\n` +
      `Method: ${scenario.method}\n` +
      `Endpoint: ${scenario.endpoint}\n` +
      `Payload: ${JSON.stringify(scenario.input, null, 2)}`
    );
  };

  const getMethodBadgeStyle = (method) => {
    const m = (method || '').toUpperCase();
    const map = {
      GET: { backgroundColor: '#dcfce7', color: '#15803d' },
      POST: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
      PUT: { backgroundColor: '#fef3c7', color: '#92400e' },
      PATCH: { backgroundColor: '#e0e7ff', color: '#3730a3' },
      DELETE: { backgroundColor: '#fee2e2', color: '#b91c1c' },
    };
    return map[m] || { backgroundColor: '#f1f5f9', color: '#64748b' };
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <h2 style={styles.title}>JSON Test Data</h2>
        <p style={styles.subtitle}>
          Pre-built JSON payloads for testing each banking module -- copy and use in API testing tools
        </p>
      </div>

      {/* Module Tabs */}
      <div style={styles.tabBar}>
        {MODULES.map((mod) => (
          <button
            key={mod.key}
            onClick={() => {
              setActiveModule(mod.key);
              setCopiedIndex(null);
            }}
            style={{
              ...styles.tabButton,
              ...(activeModule === mod.key ? styles.tabButtonActive : {}),
            }}
          >
            {mod.label}
            <span style={styles.tabCount}>{(TEST_DATA[mod.key] || []).length}</span>
          </button>
        ))}
      </div>

      {/* Scenario Count */}
      <div style={styles.scenarioCount}>
        {scenarios.length} test scenario{scenarios.length !== 1 ? 's' : ''} for{' '}
        {MODULES.find((m) => m.key === activeModule)?.label}
      </div>

      {/* Scenario Cards */}
      <div style={styles.cardsContainer}>
        {scenarios.map((scenario, idx) => (
          <div key={idx} style={styles.card}>
            {/* Card Header */}
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderLeft}>
                <span style={styles.scenarioName}>{scenario.scenario}</span>
                <div style={styles.endpointRow}>
                  <span style={{ ...styles.methodBadge, ...getMethodBadgeStyle(scenario.method) }}>
                    {scenario.method}
                  </span>
                  <span style={styles.endpointText}>{scenario.endpoint}</span>
                </div>
              </div>
              <div style={styles.cardHeaderRight}>
                <button
                  style={{
                    ...styles.copyBtn,
                    backgroundColor: copiedIndex === idx ? '#dcfce7' : '#f8fafc',
                    color: copiedIndex === idx ? '#15803d' : '#475569',
                    borderColor: copiedIndex === idx ? '#86efac' : '#e2e8f0',
                  }}
                  onClick={() => handleCopyJson(scenario, idx)}
                >
                  {copiedIndex === idx ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
            </div>

            {/* Input JSON */}
            <div style={styles.jsonSection}>
              <div style={styles.jsonLabel}>Input Payload</div>
              <pre style={styles.jsonBlockDark}>{JSON.stringify(scenario.input, null, 2)}</pre>
            </div>

            {/* Expected Output JSON */}
            <div style={styles.jsonSection}>
              <div style={styles.jsonLabel}>Expected Output</div>
              <pre style={styles.jsonBlockGreen}>
                {JSON.stringify(scenario.expected_output, null, 2)}
              </pre>
            </div>

            {/* Card Footer */}
            <div style={styles.cardFooter}>
              <button style={styles.sendBtn} onClick={() => handleSendToTester(scenario)}>
                Send to API Tester
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '0',
    backgroundColor: '#ffffff',
    minHeight: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  pageHeader: {
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '22px',
    fontWeight: 700,
    color: '#1e293b',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#64748b',
  },
  tabBar: {
    display: 'flex',
    gap: '4px',
    borderBottom: '2px solid #e2e8f0',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#64748b',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '-2px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
  },
  tabButtonActive: {
    color: '#2563eb',
    borderBottomColor: '#2563eb',
    fontWeight: 600,
  },
  tabCount: {
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: '#e2e8f0',
    color: '#475569',
    padding: '1px 7px',
    borderRadius: '10px',
  },
  scenarioCount: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '16px',
    fontWeight: 500,
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
    gap: '12px',
    flexWrap: 'wrap',
  },
  cardHeaderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    minWidth: 0,
  },
  scenarioName: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1e293b',
  },
  endpointRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  methodBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    fontFamily: '"Courier New", Courier, monospace',
    flexShrink: 0,
  },
  endpointText: {
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '13px',
    color: '#64748b',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cardHeaderRight: {
    flexShrink: 0,
  },
  copyBtn: {
    padding: '7px 16px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  jsonSection: {
    padding: '0 20px',
    marginBottom: '4px',
  },
  jsonLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '12px 0 6px',
  },
  jsonBlockDark: {
    margin: 0,
    padding: '14px 16px',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderRadius: '8px',
    fontSize: '12px',
    lineHeight: 1.6,
    fontFamily: '"Courier New", Courier, monospace',
    overflow: 'auto',
    maxHeight: '300px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  jsonBlockGreen: {
    margin: 0,
    padding: '14px 16px',
    backgroundColor: '#f0fdf4',
    color: '#14532d',
    borderRadius: '8px',
    fontSize: '12px',
    lineHeight: 1.6,
    fontFamily: '"Courier New", Courier, monospace',
    overflow: 'auto',
    maxHeight: '300px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    border: '1px solid #bbf7d0',
  },
  cardFooter: {
    padding: '12px 20px',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  sendBtn: {
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: 600,
    border: '1px solid #2563eb',
    borderRadius: '6px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default JsonTestData;

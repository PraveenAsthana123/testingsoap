import React, { useState, useCallback, useRef, useEffect } from 'react';

/* ================================================================
   Banking QA - Employee Testing Dashboard
   Tabs: Employee Onboarding | Teller Operations | Employee Portal
         | Role-Based Access Control | Branch Operations | HR & Compliance
   ================================================================ */

/* --- Color Tokens (Dark Theme) --- */
const C = {
  bgGradientFrom: '#1a1a2e',
  bgGradientTo: '#16213e',
  card: '#0f3460',
  cardLight: '#1a4a7a',
  accent: '#4ecca3',
  red: '#e74c3c',
  orange: '#f39c12',
  blue: '#3498db',
  green: '#4ecca3',
  yellow: '#f1c40f',
  highOrange: '#e67e22',
  critical: '#e74c3c',
  text: '#ffffff',
  textMuted: '#b0bec5',
  textDim: '#78909c',
  border: '#1e5f8a',
  inputBg: '#0a2744',
  inputBorder: '#1e5f8a',
  shadow: 'rgba(0,0,0,0.4)',
  tabActive: '#4ecca3',
  tabInactive: '#1a4a7a',
  progressBg: '#0a2744',
  headerBg: 'rgba(15,52,96,0.85)',
};

const priorityColor = (p) => {
  if (p === 'P0') return C.critical;
  if (p === 'P1') return C.highOrange;
  if (p === 'P2') return C.yellow;
  return C.textMuted;
};

const statusColor = (s) => {
  if (s === 'passed') return C.green;
  if (s === 'failed') return C.red;
  return C.textDim;
};

const statusLabel = (s) => {
  if (s === 'passed') return 'PASS';
  if (s === 'failed') return 'FAIL';
  return 'NOT RUN';
};

/* --- Shared Styles --- */
const styles = {
  page: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${C.bgGradientFrom} 0%, ${C.bgGradientTo} 100%)`,
    color: C.text,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px 28px 40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 24,
  },
  h1: {
    fontSize: 32,
    fontWeight: 700,
    margin: 0,
    letterSpacing: 1,
    background: `linear-gradient(90deg, ${C.accent}, ${C.blue})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 14,
    color: C.textMuted,
    marginTop: 6,
  },
  tabBar: {
    display: 'flex',
    gap: 0,
    marginBottom: 24,
    borderBottom: `2px solid ${C.border}`,
    flexWrap: 'wrap',
  },
  tab: (active) => ({
    padding: '12px 22px',
    cursor: 'pointer',
    fontWeight: active ? 700 : 500,
    fontSize: 14,
    color: active ? C.bgGradientFrom : C.textMuted,
    background: active ? C.tabActive : 'transparent',
    borderRadius: '8px 8px 0 0',
    border: 'none',
    borderBottom: active ? `3px solid ${C.tabActive}` : '3px solid transparent',
    transition: 'all 0.25s ease',
    letterSpacing: 0.5,
  }),
  splitPanel: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
  },
  leftPanel: {
    flex: '0 0 42%',
    maxWidth: '42%',
    maxHeight: 'calc(100vh - 300px)',
    overflowY: 'auto',
    paddingRight: 10,
  },
  rightPanel: {
    flex: '0 0 58%',
    maxWidth: '58%',
    maxHeight: 'calc(100vh - 300px)',
    overflowY: 'auto',
    paddingLeft: 6,
  },
  card: {
    background: C.card,
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    border: `1px solid ${C.border}`,
    boxShadow: `0 4px 16px ${C.shadow}`,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: C.accent,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: C.textMuted,
    lineHeight: 1.55,
    margin: 0,
  },
  badge: (color) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    color: '#000',
    background: color,
    marginLeft: 8,
    letterSpacing: 0.4,
  }),
  statusBadge: (status) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 700,
    color: status === 'not_run' ? C.textDim : '#000',
    background: statusColor(status),
    letterSpacing: 0.4,
  }),
  sectionLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: C.accent,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  runBtn: (running) => ({
    width: '100%',
    padding: '12px 0',
    borderRadius: 8,
    border: 'none',
    background: running
      ? `linear-gradient(90deg, ${C.orange}, ${C.yellow})`
      : `linear-gradient(90deg, ${C.accent}, ${C.blue})`,
    color: '#000',
    fontWeight: 700,
    fontSize: 15,
    cursor: running ? 'not-allowed' : 'pointer',
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 8,
    transition: 'all 0.3s ease',
    opacity: running ? 0.8 : 1,
  }),
  progressBarOuter: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    background: C.progressBg,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarInner: (pct, color) => ({
    width: `${pct}%`,
    height: '100%',
    borderRadius: 4,
    background: color || C.accent,
    transition: 'width 0.4s ease',
  }),
  outputCard: {
    background: 'rgba(10,39,68,0.7)',
    borderRadius: 10,
    padding: 14,
    border: `1px solid ${C.border}`,
    marginTop: 8,
  },
  stepItem: (active, done) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '6px 10px',
    borderRadius: 6,
    marginBottom: 4,
    background: active ? 'rgba(78,204,163,0.12)' : done ? 'rgba(78,204,163,0.06)' : 'transparent',
    border: active ? `1px solid ${C.accent}44` : '1px solid transparent',
    transition: 'all 0.3s ease',
  }),
  stepDot: (active, done) => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: done ? C.accent : active ? C.orange : C.textDim,
    border: active ? `2px solid ${C.accent}` : '2px solid transparent',
    flexShrink: 0,
    transition: 'all 0.3s ease',
    boxShadow: active ? `0 0 8px ${C.accent}66` : 'none',
  }),
  stepText: (active, done) => ({
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    color: done ? C.accent : active ? C.text : C.textDim,
  }),
  summaryRow: {
    display: 'flex',
    gap: 16,
    marginTop: 12,
    marginBottom: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  summaryBox: (color) => ({
    background: `${color}18`,
    border: `1px solid ${color}44`,
    borderRadius: 8,
    padding: '8px 18px',
    textAlign: 'center',
    minWidth: 100,
  }),
  summaryValue: (color) => ({
    fontSize: 22,
    fontWeight: 800,
    color,
    margin: 0,
  }),
  summaryLabel: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 2,
  },
  scenarioId: {
    fontSize: 11,
    fontWeight: 700,
    color: C.blue,
    fontFamily: 'monospace',
  },
  testDataChip: (color) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    background: `${color}22`,
    color,
    marginRight: 6,
    marginBottom: 4,
    fontWeight: 600,
    border: `1px solid ${color}44`,
  }),
  activeScenario: {
    background: C.card,
    borderLeft: `4px solid ${C.accent}`,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    border: `1px solid ${C.accent}44`,
    boxShadow: `0 4px 16px ${C.shadow}, 0 0 12px ${C.accent}11`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  inactiveScenario: {
    background: C.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    border: `1px solid ${C.border}`,
    boxShadow: `0 4px 16px ${C.shadow}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  scenarioHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    background: C.border,
    margin: '14px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
    marginTop: 8,
  },
  th: {
    background: C.headerBg,
    color: C.accent,
    fontWeight: 700,
    padding: '10px 8px',
    textAlign: 'left',
    borderBottom: `2px solid ${C.accent}44`,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  td: {
    padding: '8px 8px',
    borderBottom: `1px solid ${C.border}`,
    color: C.textMuted,
    fontSize: 12,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: C.textMuted,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
};

/* ================================================================
   SCENARIO DATA
   ================================================================ */

/* --- TAB 1: Employee Onboarding (10 scenarios) --- */
const ONBOARDING_SCENARIOS = [
  {
    id: 'EMP-ONB-001',
    name: 'New Teller Account Creation and Role Assignment',
    priority: 'P0',
    status: 'not_run',
    category: 'Employee Onboarding',
    steps: [
      'Navigate to HR Admin Portal > Employee Management > New Employee',
      'Enter employee details: name, SSN, department, hire date, branch',
      'Select role "Teller" from role dropdown and assign default teller permissions',
      'Submit form and verify employee record created in core banking system',
      'Verify role assignment reflected in RBAC module with correct permission set',
    ],
    testData: {
      employeeName: 'Sarah Johnson',
      ssn: 'XXX-XX-4521',
      department: 'Retail Banking',
      hireDate: '2026-03-01',
      branch: 'Downtown Main Branch',
      role: 'Teller',
    },
    expected: 'Employee account created with Teller role. Default permissions include cash handling, deposit processing, and customer lookup. No loan or admin access granted.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-ONB-002',
    name: 'Employee ID Generation and Badge Provisioning',
    priority: 'P0',
    status: 'not_run',
    category: 'Employee Onboarding',
    steps: [
      'Trigger employee ID generation from onboarding workflow',
      'Verify unique 8-digit employee ID generated following format EMP-XXXXXXXX',
      'Initiate badge provisioning request to security system',
      'Verify badge linked to employee ID with correct access zones',
      'Confirm badge activation date matches employee start date',
    ],
    testData: {
      employeeId: 'EMP-20260301',
      badgeType: 'Standard Access',
      accessZones: 'Lobby, Teller Area, Break Room',
      activationDate: '2026-03-01',
      expiryDate: '2027-03-01',
    },
    expected: 'Unique employee ID generated. Badge provisioned with access to assigned zones only. Badge active on start date. ID and badge linked in security system.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-ONB-003',
    name: 'System Access Provisioning (Core Banking, CRM, Email)',
    priority: 'P0',
    status: 'not_run',
    category: 'Employee Onboarding',
    steps: [
      'Initiate system access provisioning from onboarding checklist',
      'Verify core banking system account created with teller-level access',
      'Verify CRM account created with read-only customer view',
      'Verify corporate email account provisioned with standard mailbox size',
      'Run access verification check across all provisioned systems',
    ],
    testData: {
      coreBankingAccess: 'Teller Module Only',
      crmAccess: 'Read-Only Customer View',
      emailDomain: '@firstnational.bank',
      mailboxSize: '5GB Standard',
      passwordPolicy: 'Must change on first login',
    },
    expected: 'All three systems provisioned within 24 hours. Access levels match role definition. Temporary password generated with forced change on first login.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-ONB-004',
    name: 'Branch Assignment and Workstation Setup',
    priority: 'P1',
    status: 'not_run',
    category: 'Employee Onboarding',
    steps: [
      'Assign employee to target branch in HR system',
      'Verify branch assignment reflected in org chart and reporting hierarchy',
      'Trigger workstation provisioning request for assigned branch',
      'Verify workstation configured with required software stack',
      'Confirm teller drawer assignment linked to employee and workstation',
    ],
    testData: {
      branchCode: 'BR-001',
      branchName: 'Downtown Main Branch',
      workstationId: 'WS-T004',
      softwareStack: 'Core Banking Client, CRM, Email, Scanner Driver',
      tellerDrawer: 'TD-007',
    },
    expected: 'Employee assigned to branch. Workstation provisioned with all required software. Teller drawer assigned and linked to employee profile.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-ONB-005',
    name: 'Training Module Completion Tracking',
    priority: 'P1',
    status: 'not_run',
    category: 'Employee Onboarding',
    steps: [
      'Verify mandatory training modules assigned to new employee',
      'Complete each training module and verify progress recorded',
      'Attempt to access teller operations before completing all required training',
      'Complete all modules and verify system access unlocked',
    ],
    testData: {
      requiredModules: 'AML Basics, Cash Handling, Customer Service, IT Security',
      totalModules: 4,
      completionDeadline: '14 days from hire',
      passingScore: '80%',
    },
    expected: 'All mandatory modules assigned on Day 1. System access blocked until training complete. Progress tracked in real-time. Certificate generated on completion.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-ONB-006',
    name: 'Compliance Certification Verification',
    priority: 'P0',
    status: 'not_run',
    category: 'Employee Onboarding',
    steps: [
      'Check employee compliance certification requirements based on role',
      'Verify AML/BSA certification status from external provider',
      'Validate NMLS registration number for applicable roles',
      'Confirm compliance acknowledgment forms signed electronically',
      'Verify compliance status reflected in employee dashboard',
    ],
    testData: {
      certifications: 'AML/BSA Fundamentals, Bank Secrecy Act',
      nmlsRequired: false,
      acknowledgmentForms: 'Code of Conduct, Data Privacy, Acceptable Use',
      verificationSource: 'CompliancePro API',
    },
    expected: 'All required certifications verified before operational access granted. Missing certifications trigger hold on system access. Acknowledgment forms digitally signed and archived.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-ONB-007',
    name: 'Background Check Status Integration',
    priority: 'P0',
    status: 'not_run',
    category: 'Employee Onboarding',
    steps: [
      'Verify background check initiated through integrated provider API',
      'Poll background check status and verify real-time updates in HR system',
      'Test scenario where background check returns adverse findings',
      'Verify conditional access granted during pending background check',
      'Confirm full access granted only after clear background check',
    ],
    testData: {
      provider: 'Sterling Background Check API',
      checkTypes: 'Criminal, Credit, Employment Verification',
      slaHours: 72,
      conditionalAccess: 'Training modules only',
      adverseAction: 'Auto-escalate to HR Director',
    },
    expected: 'Background check status synced in real-time. Conditional access limited to training only. Full access on clear result. Adverse findings escalate to HR with access hold.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-ONB-008',
    name: 'Employee Profile Data Validation',
    priority: 'P1',
    status: 'not_run',
    category: 'Employee Onboarding',
    steps: [
      'Enter employee profile with all required fields',
      'Test validation rules: SSN format, phone format, email domain',
      'Attempt to submit profile with missing mandatory fields',
      'Verify duplicate SSN detection across employee database',
      'Confirm profile data encrypted at rest in HR database',
    ],
    testData: {
      validSSN: '123-45-6789',
      invalidSSN: '000-00-0000',
      validPhone: '+1-555-0142',
      invalidEmail: 'user@gmail.com',
      validEmail: 'sjohnson@firstnational.bank',
    },
    expected: 'All validation rules enforced. Invalid SSN/phone/email rejected with clear error messages. Duplicate SSN blocked. PII encrypted at rest. Audit trail for profile changes.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-ONB-009',
    name: 'Multi-Branch Access Configuration',
    priority: 'P2',
    status: 'not_run',
    category: 'Employee Onboarding',
    steps: [
      'Request multi-branch access for float teller role',
      'Verify manager approval workflow triggered for multi-branch access',
      'Approve request and verify access granted to specified branches only',
      'Test login from secondary branch and verify correct permissions',
    ],
    testData: {
      primaryBranch: 'BR-001 Downtown',
      secondaryBranches: 'BR-003 Westside, BR-007 Airport',
      approver: 'Regional Manager',
      accessLevel: 'Standard Teller at all branches',
      validityPeriod: '6 months',
    },
    expected: 'Multi-branch access requires manager approval. Access limited to specified branches. Same permission level at all branches. Access auto-expires after validity period.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-ONB-010',
    name: 'Temporary Access Provisioning for Contractors',
    priority: 'P2',
    status: 'not_run',
    category: 'Employee Onboarding',
    steps: [
      'Create contractor profile with contract start and end dates',
      'Provision temporary system access with defined expiry',
      'Verify contractor access restricted to contracted scope only',
      'Test automatic access revocation on contract end date',
    ],
    testData: {
      contractorName: 'Mike IT Consultants LLC',
      contractStart: '2026-03-01',
      contractEnd: '2026-06-30',
      accessScope: 'IT Systems Dashboard Only',
      badgeType: 'Contractor - Escorted Access',
    },
    expected: 'Contractor account with hard expiry date. Access limited to contracted scope. Badge marked as contractor. Auto-deprovisioning on contract end date. No extension without re-approval.',
    actual: null,
    time: null,
  },
];

/* --- TAB 2: Teller Operations (12 scenarios) --- */
const TELLER_SCENARIOS = [
  {
    id: 'EMP-TEL-001',
    name: 'Cash Drawer Opening and Balancing',
    priority: 'P0',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Login to teller workstation and initiate cash drawer opening',
      'Enter starting cash amount and denomination breakdown',
      'System validates starting amount against vault disbursement record',
      'Verify drawer assigned to teller ID with timestamp logged',
      'Confirm dual-signature requirement for drawer opening above $5,000',
    ],
    testData: {
      tellerId: 'EMP-20260301',
      drawerNumber: 'TD-007',
      startingCash: '$5,000.00',
      denominations: '$100x20, $50x20, $20x50, $10x50, $5x40, $1x200',
      branchCode: 'BR-001',
    },
    expected: 'Drawer opened with correct starting balance. Denomination breakdown recorded. Dual signature required for amounts over $5,000. Audit trail created with timestamp.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-TEL-002',
    name: 'Customer Deposit Processing',
    priority: 'P0',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Look up customer account by account number or name search',
      'Enter deposit amount and select deposit type (cash/check)',
      'Scan check image and verify MICR line for check deposits',
      'Process deposit and print customer receipt',
      'Verify account balance updated and transaction logged',
    ],
    testData: {
      customerAccount: '1001-2345-6789',
      depositAmount: '$2,500.00',
      depositType: 'Cash',
      customerName: 'John Smith',
      receiptNumber: 'RCP-2026030100142',
    },
    expected: 'Deposit processed successfully. Account balance updated in real-time. Receipt generated with transaction ID. Cash drawer balance adjusted. Transaction appears in customer statement.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-TEL-003',
    name: 'Customer Withdrawal Processing',
    priority: 'P0',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Verify customer identity via photo ID and signature card',
      'Enter withdrawal amount and verify sufficient balance',
      'Check for holds or restrictions on the account',
      'Process withdrawal with denomination preference',
      'Update drawer balance and generate withdrawal receipt',
    ],
    testData: {
      customerAccount: '1001-2345-6789',
      withdrawalAmount: '$1,000.00',
      idType: 'Driver License',
      denominationPreference: '$100 bills',
      availableBalance: '$15,432.50',
    },
    expected: 'Withdrawal processed after ID verification. Sufficient funds confirmed. No holds blocking withdrawal. Denomination preference honored. Drawer and account balances updated.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-TEL-004',
    name: 'Check Cashing with Hold Policy',
    priority: 'P0',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Accept check for cashing and verify endorsement',
      'Scan check image and validate MICR encoding',
      'System evaluates hold policy based on check type and amount',
      'Apply appropriate hold period (local vs non-local, amount thresholds)',
      'Communicate hold details to customer and process transaction',
    ],
    testData: {
      checkAmount: '$7,500.00',
      checkType: 'Non-local personal check',
      holdPolicy: 'Reg CC - 2 business day hold on first $225, 7 days on remainder',
      immediateAvailability: '$225.00',
      issuingBank: 'Chase Bank - California',
    },
    expected: 'Check accepted with proper hold applied per Reg CC. First $225 available immediately. Remainder held for 7 business days. Customer notified of hold terms. Exception hold applied if warranted.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-TEL-005',
    name: 'Cash Advance Processing',
    priority: 'P1',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Verify customer credit card eligibility for cash advance',
      'Enter cash advance amount and verify against available credit limit',
      'Process cash advance fee calculation (typically 3-5%)',
      'Disburse cash and update credit card account',
      'Print cash advance receipt with fee breakdown',
    ],
    testData: {
      cardNumber: 'XXXX-XXXX-XXXX-4521',
      advanceAmount: '$500.00',
      fee: '3% ($15.00)',
      totalCharged: '$515.00',
      availableCredit: '$8,000.00',
    },
    expected: 'Cash advance processed. Fee calculated and applied correctly. Available credit reduced. Cash disbursed from drawer. Receipt shows advance amount, fee, and total charge.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-TEL-006',
    name: 'Foreign Currency Exchange',
    priority: 'P1',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Look up current exchange rate for requested currency pair',
      'Calculate conversion amount including bank spread/commission',
      'Verify sufficient foreign currency inventory at branch',
      'Process exchange and update foreign currency drawer',
      'Generate exchange receipt with rate, spread, and total',
    ],
    testData: {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: '$1,000.00',
      exchangeRate: '0.9215',
      bankSpread: '2.5%',
      customerReceives: '898.46 EUR',
    },
    expected: 'Exchange rate displayed from live feed. Bank spread applied transparently. Foreign currency inventory checked. Exchange processed with proper documentation. CTR filed if applicable.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-TEL-007',
    name: 'Money Order Issuance',
    priority: 'P1',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Verify customer request for money order amount and payee',
      'Calculate money order fee based on amount tier',
      'Print money order with payee name, amount, and serial number',
      'Collect payment (cash or account debit) plus fee',
      'Record money order serial number in tracking system',
    ],
    testData: {
      payee: 'City Water Department',
      amount: '$350.00',
      fee: '$5.00',
      serialNumber: 'MO-20260301-0042',
      paymentMethod: 'Cash',
    },
    expected: 'Money order printed with correct payee and amount. Fee collected. Serial number tracked in system. Customer copy provided. Drawer updated for cash payment.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-TEL-008',
    name: 'Wire Transfer Initiation',
    priority: 'P0',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Collect wire transfer details: beneficiary, bank, routing, amount',
      'Verify customer identity and authorization for wire transfer',
      'Enter wire details into Fedwire/SWIFT system',
      'Apply wire transfer fee and obtain customer signature on disclosure',
      'Submit wire and provide customer with confirmation number',
    ],
    testData: {
      senderAccount: '1001-2345-6789',
      beneficiaryName: 'ABC Corporation',
      beneficiaryBank: 'Bank of America',
      routingNumber: '026009593',
      wireAmount: '$25,000.00',
      wireFee: '$30.00',
    },
    expected: 'Wire submitted to Fedwire with all required fields. Customer signed wire agreement. Fee debited from account. Confirmation number provided. OFAC screening completed before submission.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-TEL-009',
    name: 'End-of-Day Cash Reconciliation',
    priority: 'P0',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Initiate end-of-day reconciliation from teller workstation',
      'Count physical cash in drawer by denomination',
      'Enter physical count into system and compare with expected balance',
      'Investigate and document any variances',
      'Submit reconciliation report and close drawer for the day',
    ],
    testData: {
      expectedBalance: '$4,850.00',
      physicalCount: '$4,850.00',
      variance: '$0.00',
      transactionsToday: 47,
      reconStatus: 'Balanced',
    },
    expected: 'Physical count matches system expected balance. Zero variance reported. All transactions reconciled. Drawer closed with supervisor sign-off. Daily report generated.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-TEL-010',
    name: 'Vault Access and Cash Replenishment',
    priority: 'P0',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Request vault access for cash replenishment',
      'Verify dual control requirement (two authorized personnel)',
      'Enter vault with dual authentication (badge + PIN)',
      'Count and record cash removed from vault',
      'Transfer cash to teller drawer and verify both balances updated',
    ],
    testData: {
      vaultAccessPerson1: 'EMP-20260301 (Teller)',
      vaultAccessPerson2: 'EMP-20250115 (Head Teller)',
      amountRequested: '$10,000.00',
      denominations: '$100x50, $50x50, $20x50, $10x50',
      vaultBalance: '$250,000.00',
    },
    expected: 'Dual control enforced for vault access. Both personnel authenticated. Cash counted and recorded. Vault and drawer balances updated simultaneously. Audit trail with both signatures.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-TEL-011',
    name: 'Teller Override and Supervisor Approval',
    priority: 'P1',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Teller initiates a transaction exceeding their authority limit',
      'System prompts for supervisor override approval',
      'Supervisor enters credentials and reviews transaction details',
      'Supervisor approves or denies the override request',
      'Transaction completed or rejected based on supervisor decision',
    ],
    testData: {
      transactionType: 'Large Cash Withdrawal',
      amount: '$15,000.00',
      tellerLimit: '$10,000.00',
      supervisorId: 'EMP-20250115',
      overrideReason: 'Customer verified, sufficient funds',
    },
    expected: 'Transaction blocked at teller limit. Supervisor prompt displayed. Override requires supervisor credentials. Approval logged with reason. Transaction completes only after valid override.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-TEL-012',
    name: 'Dual Control for Large Transactions',
    priority: 'P0',
    status: 'not_run',
    category: 'Teller Operations',
    steps: [
      'Initiate transaction above dual control threshold ($25,000)',
      'System enforces dual control requiring second authorized employee',
      'Second employee reviews transaction details and customer identity',
      'Both employees confirm with credentials to process transaction',
      'Transaction logged with both employee IDs and timestamps',
    ],
    testData: {
      transactionAmount: '$50,000.00',
      dualControlThreshold: '$25,000.00',
      primaryTeller: 'EMP-20260301',
      secondaryApprover: 'EMP-20250115',
      transactionType: 'Cash Withdrawal',
    },
    expected: 'Dual control enforced for transactions above threshold. Both employees must authenticate. Transaction logged with both IDs. CTR generated for cash transactions over $10,000.',
    actual: null,
    time: null,
  },
];

/* --- TAB 3: Employee Portal (10 scenarios) --- */
const PORTAL_SCENARIOS = [
  {
    id: 'EMP-PRT-001',
    name: 'Employee Self-Service Login (SSO/LDAP)',
    priority: 'P0',
    status: 'not_run',
    category: 'Employee Portal',
    steps: [
      'Navigate to employee portal login page',
      'Enter corporate credentials (AD/LDAP authentication)',
      'Verify SSO token generated and session established',
      'Test MFA prompt for sensitive portal sections',
      'Verify session timeout after 30 minutes of inactivity',
    ],
    testData: {
      loginUrl: 'https://portal.firstnational.bank/employee',
      authMethod: 'LDAP/Active Directory + SSO',
      mfaMethod: 'TOTP (Authenticator App)',
      sessionTimeout: '30 minutes',
      maxConcurrentSessions: 2,
    },
    expected: 'SSO authentication successful via LDAP. MFA enforced for sensitive sections. Session expires after 30 min inactivity. Max 2 concurrent sessions. Failed attempts locked after 5 tries.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-PRT-002',
    name: 'Leave Management and Approval Workflow',
    priority: 'P1',
    status: 'not_run',
    category: 'Employee Portal',
    steps: [
      'Submit leave request with type, dates, and reason',
      'Verify leave balance deducted provisionally',
      'Confirm notification sent to direct manager for approval',
      'Manager approves/denies leave request',
      'Verify leave calendar updated and employee notified',
    ],
    testData: {
      leaveType: 'Paid Time Off (PTO)',
      startDate: '2026-04-15',
      endDate: '2026-04-18',
      totalDays: 4,
      availableBalance: 15,
      approver: 'Branch Manager - Jennifer Walsh',
    },
    expected: 'Leave request submitted with proper validation. Manager notified via email and portal. Balance updated on approval. Calendar blocked. Team coverage check performed.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-PRT-003',
    name: 'Timesheet Submission and Approval',
    priority: 'P1',
    status: 'not_run',
    category: 'Employee Portal',
    steps: [
      'Open timesheet for current pay period',
      'Enter daily hours worked with project/cost center allocation',
      'Submit timesheet before weekly deadline',
      'Manager reviews and approves timesheet',
      'Verify timesheet data flows to payroll system',
    ],
    testData: {
      payPeriod: '2026-03-01 to 2026-03-15',
      regularHours: 80,
      overtimeHours: 4,
      costCenter: 'CC-1001 Retail Banking',
      submissionDeadline: 'Friday 5:00 PM',
    },
    expected: 'Timesheet submitted with correct hours. Overtime flagged for approval. Manager approval required before payroll processing. Late submissions trigger escalation alert.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-PRT-004',
    name: 'Performance Review Access',
    priority: 'P2',
    status: 'not_run',
    category: 'Employee Portal',
    steps: [
      'Navigate to Performance Review section in employee portal',
      'View current year performance goals and objectives',
      'Access previous review history and ratings',
      'Submit self-assessment for current review cycle',
    ],
    testData: {
      reviewCycle: '2025 Annual Review',
      rating: 'Meets Expectations',
      goals: 'Cross-sell ratio, Customer satisfaction, Accuracy rate',
      selfAssessmentDeadline: '2026-01-31',
    },
    expected: 'Employee can view own reviews only. Historical data accessible. Self-assessment form functional. Manager reviews visible after finalization. No access to peer reviews.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-PRT-005',
    name: 'Pay Stub and Tax Document Viewing',
    priority: 'P0',
    status: 'not_run',
    category: 'Employee Portal',
    steps: [
      'Navigate to Compensation section in employee portal',
      'View current and historical pay stubs',
      'Access W-2 and other tax documents for current/prior years',
      'Download pay stub as PDF and verify correct formatting',
      'Verify PII protection on displayed compensation data',
    ],
    testData: {
      payDate: '2026-02-28',
      grossPay: '$3,500.00',
      netPay: '$2,645.00',
      taxDocuments: 'W-2 (2025), W-4, State Withholding',
      downloadFormat: 'PDF',
    },
    expected: 'Pay stubs display current and 24-month history. Tax documents downloadable as PDF. SSN partially masked on screen. Print function includes security watermark.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-PRT-006',
    name: 'Benefits Enrollment and Changes',
    priority: 'P1',
    status: 'not_run',
    category: 'Employee Portal',
    steps: [
      'Navigate to Benefits section during open enrollment period',
      'View available benefit plans with cost comparison',
      'Select health, dental, and vision plans',
      'Add or remove dependents from coverage',
      'Submit enrollment and verify confirmation',
    ],
    testData: {
      enrollmentPeriod: '2026-11-01 to 2026-11-30',
      healthPlan: 'PPO Gold - $250/month',
      dentalPlan: 'Basic Dental - $35/month',
      visionPlan: 'Standard Vision - $15/month',
      dependents: 'Spouse, 2 Children',
    },
    expected: 'Benefits enrollment only available during open enrollment or qualifying life event. Plan comparison displays total cost. Dependent verification required. Confirmation email sent.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-PRT-007',
    name: 'Internal Job Posting and Application',
    priority: 'P2',
    status: 'not_run',
    category: 'Employee Portal',
    steps: [
      'Browse internal job postings filtered by department and location',
      'View job description, requirements, and salary range',
      'Submit internal application with updated resume',
      'Verify notification sent to hiring manager and current manager',
    ],
    testData: {
      jobTitle: 'Senior Teller - Westside Branch',
      department: 'Retail Banking',
      location: 'BR-003 Westside',
      salaryRange: '$42,000 - $52,000',
      minimumTenure: '6 months in current role',
    },
    expected: 'Internal postings visible to eligible employees. Tenure requirement enforced. Application submitted to HR system. Current manager notified per policy. Applicant status tracked.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-PRT-008',
    name: 'Employee Directory Search',
    priority: 'P2',
    status: 'not_run',
    category: 'Employee Portal',
    steps: [
      'Search employee directory by name, department, or branch',
      'View employee contact details (work email, extension, location)',
      'Verify personal contact information is not displayed',
      'Test org chart navigation from directory results',
    ],
    testData: {
      searchTerm: 'Jennifer Walsh',
      displayedFields: 'Name, Title, Department, Branch, Work Phone, Email',
      hiddenFields: 'Personal Phone, Home Address, SSN, Salary',
      orgChartNavigation: true,
    },
    expected: 'Directory search returns relevant results. Only work contact information displayed. Personal data hidden. Org chart shows reporting structure. Search results paginated.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-PRT-009',
    name: 'IT Helpdesk Ticket Submission',
    priority: 'P1',
    status: 'not_run',
    category: 'Employee Portal',
    steps: [
      'Navigate to IT Support section and click "New Ticket"',
      'Select issue category and priority from dropdown',
      'Enter detailed description and attach screenshots if applicable',
      'Submit ticket and verify confirmation with ticket number',
      'Track ticket status through resolution',
    ],
    testData: {
      issueCategory: 'Software Access - Core Banking',
      priority: 'Medium',
      description: 'Unable to process wire transfers - permission error',
      ticketNumber: 'IT-2026-04521',
      sla: '4 business hours for Medium priority',
    },
    expected: 'Ticket created with unique ID. Confirmation email sent. SLA timer started based on priority. Ticket routed to appropriate IT team. Status updates visible in portal.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-PRT-010',
    name: 'Policy and Procedure Document Access',
    priority: 'P1',
    status: 'not_run',
    category: 'Employee Portal',
    steps: [
      'Navigate to Policy Library in employee portal',
      'Search for specific policy by keyword or category',
      'View policy document with version and effective date',
      'Verify role-based access to restricted policies',
    ],
    testData: {
      policySearch: 'Cash handling procedures',
      policyName: 'POL-RB-042 Cash Handling and Balancing',
      version: 'v3.2',
      effectiveDate: '2025-07-01',
      accessLevel: 'All Retail Banking staff',
    },
    expected: 'Policy library searchable with full-text search. Documents display version and effective date. Restricted policies hidden from unauthorized roles. Read receipts tracked for mandatory policies.',
    actual: null,
    time: null,
  },
];

/* --- TAB 4: Role-Based Access Control (12 scenarios) --- */
const RBAC_SCENARIOS = [
  {
    id: 'EMP-RBAC-001',
    name: 'Teller Role Permissions Verification',
    priority: 'P0',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Login as user with Teller role',
      'Verify access to teller module: deposits, withdrawals, inquiries',
      'Attempt to access loan origination module - expect denied',
      'Attempt to access admin settings - expect denied',
      'Verify transaction limits enforced per teller role definition',
    ],
    testData: {
      role: 'Teller',
      allowedModules: 'Deposits, Withdrawals, Balance Inquiry, Check Cashing',
      deniedModules: 'Loan Origination, Admin Settings, Audit Logs',
      transactionLimit: '$10,000 per transaction',
      dailyLimit: '$50,000 cumulative',
    },
    expected: 'Teller can access only assigned modules. Loan and admin modules return 403 Forbidden. Transaction limits enforced. Exceeded limits trigger supervisor override prompt.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-RBAC-002',
    name: 'Branch Manager Elevated Access Testing',
    priority: 'P0',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Login as user with Branch Manager role',
      'Verify access to all teller operations plus management functions',
      'Verify access to branch reports and performance dashboards',
      'Attempt to access other branches data - expect denied',
      'Verify override authority for teller limit exceptions',
    ],
    testData: {
      role: 'Branch Manager',
      allowedModules: 'All Teller Ops, Branch Reports, Staff Management, Override Authority',
      deniedModules: 'Other Branch Data, System Config, Compliance Reports',
      overrideLimit: '$100,000 per transaction',
      branchScope: 'BR-001 only',
    },
    expected: 'Branch Manager has elevated access within own branch. Cannot view other branch data. Override authority up to $100K. Access to staff scheduling and performance. Branch reports accessible.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-RBAC-003',
    name: 'Loan Officer Specific Module Access',
    priority: 'P0',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Login as user with Loan Officer role',
      'Verify access to loan origination and underwriting modules',
      'Verify access to credit bureau inquiry system',
      'Attempt to process cash transactions - expect denied',
      'Verify loan approval limits per role authorization',
    ],
    testData: {
      role: 'Loan Officer',
      allowedModules: 'Loan Origination, Underwriting, Credit Bureau, Document Management',
      deniedModules: 'Cash Handling, Teller Operations, Vault Access',
      approvalLimit: '$250,000 unsecured, $500,000 secured',
      creditBureauAccess: 'Equifax, TransUnion, Experian',
    },
    expected: 'Loan Officer access restricted to lending modules. No teller operations permitted. Credit bureau queries logged. Loan approval within authorized limits. Over-limit requires committee approval.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-RBAC-004',
    name: 'Compliance Officer Audit Trail Access',
    priority: 'P0',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Login as user with Compliance Officer role',
      'Verify read-only access to all transaction audit trails',
      'Verify access to SAR/CTR filing system',
      'Verify access to employee activity monitoring reports',
      'Attempt to modify transaction records - expect denied',
    ],
    testData: {
      role: 'Compliance Officer',
      allowedModules: 'Audit Trails, SAR/CTR System, Activity Monitoring, KYC Reviews',
      deniedModules: 'Transaction Processing, Account Modification, System Config',
      accessScope: 'All branches (read-only)',
      reportTypes: 'SAR, CTR, OFAC Alerts, Suspicious Activity',
    },
    expected: 'Compliance Officer has read-only access to all audit data across branches. Can file SARs/CTRs. Cannot modify any transaction or account data. All access logged separately.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-RBAC-005',
    name: 'IT Admin System Configuration Access',
    priority: 'P0',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Login as user with IT Administrator role',
      'Verify access to system configuration and user management',
      'Verify access to server monitoring and log management',
      'Attempt to access customer financial data - expect denied',
      'Verify all configuration changes require change ticket reference',
    ],
    testData: {
      role: 'IT Administrator',
      allowedModules: 'System Config, User Management, Server Monitoring, Log Viewer',
      deniedModules: 'Customer Data, Transaction Processing, Financial Reports',
      changeControl: 'Required for all config changes',
      auditLevel: 'Enhanced logging for all admin actions',
    },
    expected: 'IT Admin can configure systems but cannot access financial data. User management available. All config changes linked to change tickets. Enhanced audit logging for every admin action.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-RBAC-006',
    name: 'Customer Service Rep CRM-Only Access',
    priority: 'P1',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Login as user with Customer Service Representative role',
      'Verify access to CRM system with customer interaction history',
      'Verify ability to create service tickets and log calls',
      'Attempt to view full account details - expect masked data',
      'Attempt to process financial transactions - expect denied',
    ],
    testData: {
      role: 'Customer Service Rep',
      allowedModules: 'CRM, Service Tickets, Call Logging, Knowledge Base',
      deniedModules: 'Transaction Processing, Account Modifications, Loan Systems',
      dataVisibility: 'Masked account numbers, no balances',
      interactionLimit: 'View and create, no delete',
    },
    expected: 'CSR accesses CRM only. Financial data masked. Cannot process transactions. Can create service tickets and log interactions. Customer PII partially masked based on need-to-know.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-RBAC-007',
    name: 'Role Escalation Request and Approval',
    priority: 'P1',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Employee submits role escalation request through portal',
      'Verify request routed to appropriate approver based on requested role',
      'Approver reviews justification and makes decision',
      'On approval, verify new permissions granted within SLA',
      'Verify audit trail for the entire escalation workflow',
    ],
    testData: {
      currentRole: 'Teller',
      requestedRole: 'Senior Teller',
      justification: 'Promoted to Senior Teller effective 2026-04-01',
      approver: 'Branch Manager + HR',
      sla: '3 business days',
    },
    expected: 'Escalation request requires dual approval (manager + HR). Justification mandatory. New permissions granted after approval. Old permissions retained unless explicitly removed. Full audit trail.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-RBAC-008',
    name: 'Segregation of Duties Enforcement',
    priority: 'P0',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Attempt to assign conflicting roles to same employee (e.g., maker + checker)',
      'Verify system blocks conflicting role assignments',
      'Test SoD matrix for all role combinations',
      'Verify exception process for temporary SoD override',
      'Confirm SoD violations logged and reported to compliance',
    ],
    testData: {
      conflictingRoles: 'Wire Initiator + Wire Approver',
      sodMatrix: '15 role conflict pairs defined',
      exceptionProcess: 'CISO + Compliance Officer dual approval',
      exceptionDuration: 'Maximum 30 days',
      reportingFrequency: 'Monthly SoD violation report',
    },
    expected: 'System prevents conflicting role assignments. SoD matrix enforced automatically. Temporary exceptions require dual approval with time limit. All violations logged and reported monthly.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-RBAC-009',
    name: 'Access Revocation on Role Change',
    priority: 'P0',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Change employee role from Teller to Loan Officer',
      'Verify old teller permissions revoked immediately',
      'Verify new loan officer permissions granted',
      'Attempt to access teller module with new role - expect denied',
      'Verify transition logged in access management audit trail',
    ],
    testData: {
      previousRole: 'Teller',
      newRole: 'Loan Officer',
      revokedPermissions: 'Cash Handling, Teller Operations, Drawer Access',
      grantedPermissions: 'Loan Origination, Credit Bureau, Underwriting',
      transitionDate: '2026-04-01',
    },
    expected: 'Old permissions revoked before new ones granted (no permission overlap). Role transition atomic operation. Previous role access immediately blocked. New role access activated. Full audit trail.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-RBAC-010',
    name: 'Maker-Checker Workflow Enforcement',
    priority: 'P0',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Maker initiates a transaction requiring checker approval',
      'Verify maker cannot approve their own transaction',
      'Checker reviews and approves the transaction',
      'Verify transaction processed only after checker approval',
      'Test timeout scenario where checker does not respond within SLA',
    ],
    testData: {
      transactionType: 'Wire Transfer > $10,000',
      makerRole: 'Teller',
      checkerRole: 'Supervisor',
      approvalSla: '2 hours',
      timeoutAction: 'Escalate to Branch Manager',
    },
    expected: 'Maker cannot self-approve. Transaction held in pending state until checker acts. Checker approval required for processing. SLA timeout triggers escalation. Both actions logged with timestamps.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-RBAC-011',
    name: 'Time-Based Access Restrictions',
    priority: 'P1',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Configure time-based access rules for teller role (business hours only)',
      'Attempt to login during business hours - expect success',
      'Attempt to login after business hours - expect denied',
      'Test override for authorized after-hours access',
    ],
    testData: {
      role: 'Teller',
      allowedHours: '7:00 AM - 7:00 PM local branch time',
      afterHoursPolicy: 'Deny with supervisor override option',
      overrideApprover: 'Branch Manager',
      timeZone: 'Branch local time',
    },
    expected: 'Access granted only during configured business hours. After-hours login blocked with clear message. Supervisor override available for emergencies. All after-hours access attempts logged.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-RBAC-012',
    name: 'Emergency Access (Break-Glass) Procedures',
    priority: 'P0',
    status: 'not_run',
    category: 'Role-Based Access Control',
    steps: [
      'Initiate break-glass access request for emergency situation',
      'Verify multi-party approval required for emergency access',
      'Grant temporary elevated access with defined time limit',
      'Monitor all actions taken under emergency access',
      'Verify automatic revocation when emergency period expires',
    ],
    testData: {
      emergencyType: 'System outage requiring admin access',
      requiredApprovals: 'CISO + Branch Manager + IT Director',
      accessDuration: '4 hours maximum',
      monitoringLevel: 'Real-time session recording',
      postIncidentReview: 'Mandatory within 24 hours',
    },
    expected: 'Break-glass access requires multi-party approval. Time-limited with auto-revocation. All actions recorded in real-time. Post-incident review mandatory. Full audit trail preserved.',
    actual: null,
    time: null,
  },
];

/* --- TAB 5: Branch Operations (10 scenarios) --- */
const BRANCH_SCENARIOS = [
  {
    id: 'EMP-BRN-001',
    name: 'Branch Opening Procedures Checklist',
    priority: 'P0',
    status: 'not_run',
    category: 'Branch Operations',
    steps: [
      'First employee arrives and disarms security system with code + badge',
      'System verifies opening employee is authorized for branch opening',
      'Complete and log opening checklist items in branch operations system',
      'Verify all workstations boot up and connect to core banking',
      'Confirm ATM and night deposit box status checked and logged',
    ],
    testData: {
      openingEmployee: 'EMP-20250115 (Head Teller)',
      securityCode: 'Rotated weekly, 6-digit PIN',
      checklistItems: 'Security check, Vault verify, Systems boot, ATM check, Signage',
      branchOpenTime: '8:30 AM',
      systemHealthCheck: 'Core Banking, CRM, Network, Printers, Scanner',
    },
    expected: 'Only authorized employees can open branch. Security system logs entry. Checklist completion mandatory before customer access. All systems verified operational. Deficiencies reported immediately.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-BRN-002',
    name: 'Branch Closing and EOD Settlement',
    priority: 'P0',
    status: 'not_run',
    category: 'Branch Operations',
    steps: [
      'Initiate branch closing procedures from operations system',
      'All tellers complete individual drawer reconciliation',
      'Head teller performs branch-level cash reconciliation',
      'Generate and submit end-of-day reports',
      'Arm security system and verify all doors/vault locked',
    ],
    testData: {
      closingEmployee: 'EMP-20250115 (Head Teller)',
      closingTime: '5:30 PM',
      reportTypes: 'Transaction Summary, Cash Position, Exception Report, CTR Log',
      reconciliationStatus: 'All drawers balanced',
      securityChecklist: 'Vault sealed, Doors locked, Alarm armed, Cameras verified',
    },
    expected: 'All teller drawers reconciled before branch close. Branch-level cash matches vault + drawers. EOD reports generated and transmitted. Security system armed. Closing logged with timestamp.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-BRN-003',
    name: 'ATM Cash Loading and Balancing',
    priority: 'P0',
    status: 'not_run',
    category: 'Branch Operations',
    steps: [
      'Check ATM cash level alerts and determine replenishment need',
      'Prepare cash cassettes with counted and verified denominations',
      'Dual control access to ATM (two authorized personnel)',
      'Load cassettes and perform test transactions',
      'Verify ATM balance matches loaded amount in system',
    ],
    testData: {
      atmId: 'ATM-BR001-01',
      currentLevel: '$12,000 (below $15,000 threshold)',
      loadAmount: '$40,000',
      cassettes: '$20x1000, $50x200, $100x100',
      dualControl: 'Head Teller + Operations Manager',
    },
    expected: 'ATM low-cash alert triggered at threshold. Dual control enforced for loading. Cash counted and logged. Test transaction succeeds. ATM system balance matches physical load.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-BRN-004',
    name: 'Safe Deposit Box Access Management',
    priority: 'P1',
    status: 'not_run',
    category: 'Branch Operations',
    steps: [
      'Customer requests safe deposit box access',
      'Verify customer identity and box ownership via signature card',
      'Both customer key and bank guard key required (dual key)',
      'Log access entry with timestamp, customer ID, and box number',
      'Customer returns box and access logged on departure',
    ],
    testData: {
      customerId: 'CUST-7890',
      boxNumber: 'SDB-142',
      boxSize: 'Medium (5x10)',
      accessLog: 'Date, Time In, Time Out, Customer Signature, Employee Witness',
      annualRental: '$150.00',
    },
    expected: 'Customer verified via ID and signature card. Dual key access enforced. Entry and exit times logged. Employee witness required. Unauthorized access attempts flagged and logged.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-BRN-005',
    name: 'Customer Queue Management System',
    priority: 'P2',
    status: 'not_run',
    category: 'Branch Operations',
    steps: [
      'Customer takes queue ticket from kiosk or is greeted by concierge',
      'System assigns queue number based on service type and priority',
      'Teller calls next customer via display and audio announcement',
      'Track wait times and service times per transaction type',
    ],
    testData: {
      queueTypes: 'General Banking, Business Banking, Loans, Priority (VIP)',
      avgWaitTime: '8 minutes',
      maxWaitThreshold: '15 minutes (triggers alert)',
      priorityCustomers: 'Premium account holders, Elderly, Disabled',
      displayFormat: 'Counter number + Customer ticket number',
    },
    expected: 'Queue system assigns tickets by service type. Priority customers served faster. Wait time tracked and alerts triggered at threshold. Service time metrics logged for performance reporting.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-BRN-006',
    name: 'Branch Cash Limit Monitoring',
    priority: 'P0',
    status: 'not_run',
    category: 'Branch Operations',
    steps: [
      'System monitors total cash position across vault, drawers, and ATMs',
      'Verify alerts triggered when cash exceeds insured limit',
      'Test alert when cash drops below minimum operational threshold',
      'Verify cash shipment request auto-generated for low cash',
      'Confirm insurance coverage validation against current cash position',
    ],
    testData: {
      maxCashLimit: '$500,000 (insured limit)',
      minCashThreshold: '$50,000 (operational minimum)',
      currentCash: '$420,000',
      alertThresholds: 'Warning at 80%, Critical at 95% of max',
      autoOrderThreshold: 'Below $75,000 triggers armored car request',
    },
    expected: 'Cash position monitored in real-time. Alerts at 80% and 95% of insured limit. Auto-order triggered below minimum. Branch manager notified for all cash alerts. Daily cash position reported.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-BRN-007',
    name: 'Interbank Transfer Processing',
    priority: 'P1',
    status: 'not_run',
    category: 'Branch Operations',
    steps: [
      'Initiate interbank transfer between branch accounts and external bank',
      'Verify routing number validation against Federal Reserve directory',
      'Process transfer through ACH or Fedwire based on amount and urgency',
      'Track transfer status through settlement',
      'Confirm funds credited/debited with proper value dating',
    ],
    testData: {
      transferType: 'ACH Next-Day',
      amount: '$5,000.00',
      destinationBank: 'Wells Fargo',
      routingNumber: '121000248',
      cutoffTime: '2:00 PM for same-day ACH',
      settlementTime: 'T+1 business day',
    },
    expected: 'Routing number validated. Transfer method selected based on rules. Cutoff times enforced. Transfer tracked through settlement. Proper value dating applied. Confirmation sent to customer.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-BRN-008',
    name: 'Regulatory Report Generation',
    priority: 'P0',
    status: 'not_run',
    category: 'Branch Operations',
    steps: [
      'Generate daily CTR report for cash transactions over $10,000',
      'Generate monthly BSA suspicious activity summary',
      'Produce quarterly CRA (Community Reinvestment Act) data',
      'Verify all reports meet FinCEN formatting requirements',
      'Submit reports through regulatory filing system',
    ],
    testData: {
      ctrCount: 12,
      sarCount: 3,
      reportingPeriod: 'March 2026',
      filingSystem: 'FinCEN BSA E-Filing',
      deadline: 'CTR: 15 calendar days, SAR: 30 calendar days',
    },
    expected: 'All reportable transactions captured. Reports generated in correct format. Filing deadlines tracked with alerts. Submission confirmation archived. Report data reconciled with source transactions.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-BRN-009',
    name: 'Branch Audit Preparation Workflow',
    priority: 'P1',
    status: 'not_run',
    category: 'Branch Operations',
    steps: [
      'Receive audit notification and initiate preparation checklist',
      'Generate required documentation package for auditors',
      'Verify all employee certifications current and documented',
      'Reconcile branch cash position and pending items',
      'Prepare audit workspace with required system access for auditors',
    ],
    testData: {
      auditType: 'Internal Compliance Audit',
      auditDate: '2026-04-15',
      documentPackage: 'Cash logs, Transaction reports, Employee certs, Procedure docs',
      preparationSla: '5 business days before audit',
      auditorAccess: 'Read-only audit role with branch scope',
    },
    expected: 'Audit checklist completed by deadline. All documentation generated and organized. Employee certifications verified current. Cash position reconciled. Auditor access provisioned with appropriate scope.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-BRN-010',
    name: 'Cash Shipment Tracking and Receiving',
    priority: 'P1',
    status: 'not_run',
    category: 'Branch Operations',
    steps: [
      'Verify cash shipment order placed with armored car service',
      'Track shipment status from Federal Reserve/vault to branch',
      'Receive shipment with dual control and verify manifest',
      'Count received cash against manifest and log any discrepancies',
      'Update branch cash position and vault inventory',
    ],
    testData: {
      armoredCarrier: 'Brinks',
      shipmentAmount: '$200,000',
      manifestId: 'SHP-2026030100842',
      dualControl: 'Head Teller + Operations Manager',
      countVerification: 'Machine count + manual spot check',
    },
    expected: 'Shipment tracked from dispatch to receipt. Dual control for receiving. Cash counted against manifest. Discrepancies reported immediately. Branch cash position updated. Receipt acknowledgment transmitted.',
    actual: null,
    time: null,
  },
];

/* --- TAB 6: HR & Compliance (10 scenarios) --- */
const HR_COMPLIANCE_SCENARIOS = [
  {
    id: 'EMP-HRC-001',
    name: 'Annual Compliance Training Completion',
    priority: 'P0',
    status: 'not_run',
    category: 'HR & Compliance',
    steps: [
      'Verify annual compliance training modules assigned to all employees',
      'Track completion rates by department and branch',
      'Test escalation workflow for overdue training',
      'Verify certificates generated upon successful completion',
      'Confirm training records retained per regulatory requirements',
    ],
    testData: {
      trainingModules: 'BSA/AML, Information Security, Ethics, Fair Lending, Privacy',
      completionDeadline: 'December 31, 2026',
      passingScore: '80%',
      escalationTrigger: '30 days before deadline if incomplete',
      retentionPeriod: '7 years',
    },
    expected: 'All employees assigned annual training. Completion tracked in real-time. Overdue escalation to manager then HR. Certificates auto-generated. Records retained for 7 years per regulation.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-HRC-002',
    name: 'Anti-Money Laundering Certification',
    priority: 'P0',
    status: 'not_run',
    category: 'HR & Compliance',
    steps: [
      'Verify AML certification requirement based on employee role',
      'Complete AML training course with assessment',
      'Pass certification exam (minimum 85% score)',
      'Verify certification recorded in employee compliance profile',
      'Test recertification reminder at 11 months',
    ],
    testData: {
      courseTitle: 'AML/BSA Compliance Certification 2026',
      duration: '8 hours',
      passingScore: '85%',
      validityPeriod: '12 months',
      recertificationReminder: '30 days before expiry',
    },
    expected: 'AML certification mandatory for all customer-facing roles. 85% passing threshold enforced. Certification tracked with expiry. Recertification reminder sent 30 days prior. Expired cert triggers access restriction.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-HRC-003',
    name: 'Code of Conduct Acknowledgment',
    priority: 'P0',
    status: 'not_run',
    category: 'HR & Compliance',
    steps: [
      'Present updated Code of Conduct document to employee',
      'Employee reviews document (minimum read time enforced)',
      'Employee signs electronic acknowledgment',
      'Verify acknowledgment recorded with timestamp and IP',
      'Test reminder workflow for employees who have not acknowledged',
    ],
    testData: {
      documentVersion: 'v2026.1',
      minimumReadTime: '15 minutes',
      acknowledgmentDeadline: '30 days from distribution',
      signatureType: 'Electronic (DocuSign integration)',
      reminderSchedule: 'Day 7, Day 14, Day 21, Day 28 (escalation)',
    },
    expected: 'Code of Conduct presented with minimum read time. Electronic signature captured. Acknowledgment timestamped and archived. Non-compliance escalated progressively. Annual refresh cycle enforced.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-HRC-004',
    name: 'Conflict of Interest Disclosure',
    priority: 'P1',
    status: 'not_run',
    category: 'HR & Compliance',
    steps: [
      'Present annual conflict of interest disclosure form',
      'Employee discloses outside business activities and financial interests',
      'System validates disclosures against known conflict patterns',
      'Compliance reviews flagged disclosures',
      'Verify resolution tracking for identified conflicts',
    ],
    testData: {
      disclosureType: 'Annual COI Disclosure 2026',
      disclosureItems: 'Outside employment, Board memberships, Financial interests, Family relationships',
      reviewAuthority: 'Ethics and Compliance Committee',
      flaggedPatterns: 'Vendor relationships, Competitor employment, Customer financial ties',
    },
    expected: 'Disclosure form requires response from all employees. Flagged items routed to compliance. Resolution plans tracked. Annual cycle enforced. Historical disclosures accessible for audit.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-HRC-005',
    name: 'Whistleblower Reporting System Testing',
    priority: 'P0',
    status: 'not_run',
    category: 'HR & Compliance',
    steps: [
      'Access whistleblower reporting system (anonymous option available)',
      'Submit report with category, description, and optional evidence',
      'Verify report routed to Ethics Committee (bypassing management chain)',
      'Test anonymity preservation throughout investigation workflow',
      'Verify retaliation protection safeguards in system',
    ],
    testData: {
      reportingChannels: 'Web portal, Phone hotline, Email (ethics@bank.com)',
      anonymousOption: true,
      routingDestination: 'Ethics and Compliance Committee (direct)',
      confirmationMethod: 'Anonymous tracking number',
      retaliationProtection: 'Automated monitoring of reporter status changes',
    },
    expected: 'Report submitted anonymously with tracking number. Routed directly to Ethics Committee. Management chain bypassed. Reporter identity protected. Retaliation monitoring automated.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-HRC-006',
    name: 'Employee Transaction Monitoring (Personal Accounts)',
    priority: 'P0',
    status: 'not_run',
    category: 'HR & Compliance',
    steps: [
      'Verify employee personal accounts flagged for enhanced monitoring',
      'Test detection of employee accessing own account via teller system',
      'Verify alerts generated for unusual patterns in employee accounts',
      'Test self-dealing detection (employee processing own transactions)',
      'Confirm monitoring reports generated for compliance review',
    ],
    testData: {
      monitoringRules: 'Self-access alerts, Unusual patterns, Large transactions, Frequent transfers',
      selfAccessPolicy: 'Prohibited - must use different teller',
      alertThresholds: 'Same as customer + enhanced sensitivity',
      reportFrequency: 'Monthly for compliance, Immediate for violations',
      lookbackPeriod: '90 days rolling',
    },
    expected: 'Employee accounts flagged for enhanced monitoring. Self-access detected and blocked. Unusual patterns generate immediate alerts. Monthly monitoring reports for compliance. Self-dealing triggers investigation.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-HRC-007',
    name: 'Insider Trading Prevention Controls',
    priority: 'P1',
    status: 'not_run',
    category: 'HR & Compliance',
    steps: [
      'Verify restricted list maintained and updated for MNPI',
      'Test pre-clearance requirement for employee securities trades',
      'Verify blackout period enforcement during earnings/M&A',
      'Test alert generation for trades matching restricted securities',
      'Confirm trade monitoring integrated with brokerage feed',
    ],
    testData: {
      restrictedList: 'Updated daily from Legal/Compliance',
      preClearanceWindow: '2 business days before trade',
      blackoutPeriods: 'Earnings: 15 days before to 2 days after',
      brokerageFeed: 'Automated daily from approved brokers',
      violationPenalty: 'Trade reversal + disciplinary action',
    },
    expected: 'Restricted list checked in real-time. Pre-clearance required and enforced. Blackout periods block trades automatically. Brokerage feeds monitored daily. Violations trigger immediate investigation.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-HRC-008',
    name: 'Data Privacy Training Verification',
    priority: 'P1',
    status: 'not_run',
    category: 'HR & Compliance',
    steps: [
      'Verify data privacy training assigned based on data access level',
      'Complete training covering GLBA, CCPA, and internal privacy policies',
      'Pass assessment with minimum required score',
      'Verify training completion unlocks access to customer PII systems',
    ],
    testData: {
      trainingLevels: 'Basic (all staff), Advanced (PII access), Specialist (data analytics)',
      regulations: 'GLBA, CCPA, State privacy laws',
      passingScore: '80%',
      piiAccessGate: 'Training must be current for PII system access',
      refreshCycle: 'Annual + on regulation change',
    },
    expected: 'Privacy training tiered by data access level. PII system access blocked until training current. Assessment scores tracked. Regulation updates trigger re-training. Compliance dashboard shows completion rates.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-HRC-009',
    name: 'Emergency Contact Information Updates',
    priority: 'P2',
    status: 'not_run',
    category: 'HR & Compliance',
    steps: [
      'Navigate to emergency contact section in employee portal',
      'Add or update emergency contact information',
      'Verify validation rules for phone number and relationship fields',
      'Test annual reminder to verify emergency contact information',
    ],
    testData: {
      contactName: 'Maria Johnson',
      relationship: 'Spouse',
      phoneNumber: '+1-555-0198',
      alternatePhone: '+1-555-0199',
      annualVerification: 'Required by January 31 each year',
    },
    expected: 'Emergency contacts updatable through self-service portal. Phone format validated. Annual verification reminder sent. Non-response escalated to manager. At least one contact required.',
    actual: null,
    time: null,
  },
  {
    id: 'EMP-HRC-010',
    name: 'Employee Exit and Access Deprovisioning',
    priority: 'P0',
    status: 'not_run',
    category: 'HR & Compliance',
    steps: [
      'HR initiates employee termination in HR system',
      'Verify immediate access revocation across all systems',
      'Confirm badge deactivation and building access removed',
      'Verify email account disabled and auto-reply set',
      'Confirm all assigned equipment collected and tracked',
    ],
    testData: {
      terminationType: 'Voluntary Resignation',
      lastDay: '2026-03-15',
      systemsToDeprovision: 'Core Banking, CRM, Email, VPN, Badge, Vault Access',
      equipmentToCollect: 'Laptop, Badge, Keys, Corporate Card, RSA Token',
      accessRevocationSla: 'Within 1 hour of termination effective time',
    },
    expected: 'All system access revoked within 1 hour. Badge deactivated immediately. Email disabled with auto-reply. Equipment collection tracked. Exit checklist completed. Compliance confirmation generated.',
    actual: null,
    time: null,
  },
];

/* ================================================================
   TAB DEFINITIONS
   ================================================================ */
const TABS = [
  { id: 'onboarding', label: 'Employee Onboarding', icon: '\u2795', color: C.blue, scenarios: ONBOARDING_SCENARIOS },
  { id: 'teller', label: 'Teller Operations', icon: '\u{1F4B5}', color: C.green, scenarios: TELLER_SCENARIOS },
  { id: 'portal', label: 'Employee Portal', icon: '\u{1F4BB}', color: C.orange, scenarios: PORTAL_SCENARIOS },
  { id: 'rbac', label: 'Role-Based Access', icon: '\u{1F512}', color: C.critical, scenarios: RBAC_SCENARIOS },
  { id: 'branch', label: 'Branch Operations', icon: '\u{1F3E6}', color: C.yellow, scenarios: BRANCH_SCENARIOS },
  { id: 'hrCompliance', label: 'HR & Compliance', icon: '\u2696', color: '#9b59b6', scenarios: HR_COMPLIANCE_SCENARIOS },
];

/* ================================================================
   HELPER: Simulated Test Execution
   ================================================================ */
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateActualResult = (scenario) => {
  const passRate = scenario.priority === 'P0' ? 0.88 : scenario.priority === 'P1' ? 0.82 : 0.78;
  const passed = Math.random() < passRate;
  if (passed) {
    return {
      status: 'passed',
      actual: scenario.expected.split('.')[0] + '. All validations passed successfully.',
      time: randomBetween(450, 2800),
    };
  }
  const failReasons = [
    'Timeout during system access provisioning. Backend service did not respond within 30s SLA.',
    'Permission mismatch detected. Expected role-based restriction not enforced on secondary module.',
    'Validation rule bypassed for edge case input. Empty string accepted where non-null required.',
    'Audit trail entry missing for the transaction. Expected log record not found in audit table.',
    'Workflow notification not triggered. Manager email notification was not sent within expected SLA.',
    'Data encryption check failed. PII field found unencrypted in API response payload.',
  ];
  return {
    status: 'failed',
    actual: failReasons[randomBetween(0, failReasons.length - 1)],
    time: randomBetween(800, 4500),
  };
};

/* ================================================================
   COMPONENT: ProcessSteps
   ================================================================ */
const ProcessSteps = ({ steps, currentStep, completed }) => (
  <div>
    {steps.map((step, i) => {
      const done = completed || i < currentStep;
      const active = !completed && i === currentStep;
      return (
        <div key={i} style={styles.stepItem(active, done)}>
          <div style={styles.stepDot(active, done)} />
          <span style={styles.stepText(active, done)}>
            {done ? '\u2713' : active ? '\u25B6' : '\u25CB'} Step {i + 1}: {step}
          </span>
        </div>
      );
    })}
  </div>
);

/* ================================================================
   COMPONENT: ScenarioTabContent (reusable per tab)
   ================================================================ */
const ScenarioTabContent = ({ scenarios: initialScenarios, tabLabel }) => {
  const [scenarios, setScenarios] = useState(
    initialScenarios.map((s) => ({ ...s }))
  );
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const selected = scenarios[selectedIdx];

  const stats = {
    total: scenarios.length,
    passed: scenarios.filter((s) => s.status === 'passed').length,
    failed: scenarios.filter((s) => s.status === 'failed').length,
    notRun: scenarios.filter((s) => s.status === 'not_run').length,
  };

  const runTest = useCallback(() => {
    if (running) return;
    setRunning(true);
    setCompleted(false);
    setCurrentStep(0);
    setProgress(0);

    const totalSteps = selected.steps.length;
    let step = 0;

    timerRef.current = setInterval(() => {
      step++;
      const pct = Math.min((step / totalSteps) * 100, 100);
      setProgress(pct);

      if (step >= totalSteps) {
        clearInterval(timerRef.current);
        setCurrentStep(totalSteps);
        setCompleted(true);
        setRunning(false);

        const result = generateActualResult(selected);
        setScenarios((prev) =>
          prev.map((s, i) =>
            i === selectedIdx
              ? { ...s, status: result.status, actual: result.actual, time: result.time }
              : s
          )
        );
      } else {
        setCurrentStep(step);
      }
    }, randomBetween(400, 700));
  }, [running, selected, selectedIdx]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  // Reset step state when selecting a new scenario
  useEffect(() => {
    setCurrentStep(-1);
    setCompleted(false);
    setProgress(0);
  }, [selectedIdx]);

  return (
    <div>
      {/* Summary Stats */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryBox(C.blue)}>
          <p style={styles.summaryValue(C.blue)}>{stats.total}</p>
          <div style={styles.summaryLabel}>Total</div>
        </div>
        <div style={styles.summaryBox(C.green)}>
          <p style={styles.summaryValue(C.green)}>{stats.passed}</p>
          <div style={styles.summaryLabel}>Passed</div>
        </div>
        <div style={styles.summaryBox(C.red)}>
          <p style={styles.summaryValue(C.red)}>{stats.failed}</p>
          <div style={styles.summaryLabel}>Failed</div>
        </div>
        <div style={styles.summaryBox(C.textDim)}>
          <p style={styles.summaryValue(C.textDim)}>{stats.notRun}</p>
          <div style={styles.summaryLabel}>Not Run</div>
        </div>
      </div>

      <div style={{ ...styles.divider, margin: '16px 0' }} />

      <div style={styles.splitPanel}>
        {/* LEFT: Scenario List */}
        <div style={styles.leftPanel}>
          <div style={styles.sectionLabel}>
            {tabLabel} ({scenarios.length} Scenarios)
          </div>
          {scenarios.map((s, i) => (
            <div
              key={s.id}
              style={i === selectedIdx ? styles.activeScenario : styles.inactiveScenario}
              onClick={() => setSelectedIdx(i)}
            >
              <div style={styles.scenarioHeader}>
                <span style={styles.scenarioId}>{s.id}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={styles.badge(priorityColor(s.priority))}>{s.priority}</span>
                  <span style={styles.statusBadge(s.status)}>{statusLabel(s.status)}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: i === selectedIdx ? C.accent : C.text, marginTop: 4 }}>
                {s.name}
              </div>
              {s.time !== null && (
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, fontFamily: 'monospace' }}>
                  Execution: {s.time}ms
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT: Selected Scenario Details */}
        <div style={styles.rightPanel}>
          {/* Scenario Info Card */}
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={styles.scenarioId}>{selected.id}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={styles.badge(priorityColor(selected.priority))}>{selected.priority}</span>
                <span style={styles.statusBadge(selected.status)}>{statusLabel(selected.status)}</span>
              </div>
            </div>
            <div style={styles.cardTitle}>{selected.name}</div>
            <div style={styles.testDataChip(C.blue)}>{selected.category}</div>
          </div>

          {/* Test Steps */}
          <div style={styles.card}>
            <div style={styles.sectionLabel}>
              <span style={{ color: C.blue }}>{'>'}</span> Test Steps
            </div>
            <ProcessSteps steps={selected.steps} currentStep={currentStep} completed={completed} />

            {running && (
              <div style={{ marginTop: 10 }}>
                <div style={styles.progressBarOuter}>
                  <div style={styles.progressBarInner(progress, C.accent)} />
                </div>
                <span style={{ fontSize: 11, color: C.orange }}>
                  Executing step {Math.min(currentStep + 1, selected.steps.length)} of {selected.steps.length}...
                </span>
              </div>
            )}
          </div>

          {/* Test Data */}
          <div style={styles.card}>
            <div style={styles.sectionLabel}>
              <span style={{ color: C.orange }}>{'{ }'}</span> Test Data
            </div>
            <div style={{ background: C.inputBg, borderRadius: 8, padding: 12, border: `1px solid ${C.inputBorder}` }}>
              {Object.entries(selected.testData).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: C.accent, fontWeight: 600, minWidth: 180, fontFamily: 'monospace' }}>{key}:</span>
                  <span style={{ color: C.text }}>{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Result */}
          <div style={styles.card}>
            <div style={styles.sectionLabel}>
              <span style={{ color: C.green }}>{'\u2713'}</span> Expected Result
            </div>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, margin: 0 }}>
              {selected.expected}
            </p>
          </div>

          {/* Run Button */}
          <button style={styles.runBtn(running)} onClick={runTest} disabled={running}>
            {running ? 'Executing Test...' : 'Run Test'}
          </button>

          {/* Actual Result (after run) */}
          {selected.status !== 'not_run' && (
            <div style={styles.card}>
              <div style={styles.sectionLabel}>
                <span style={{ color: selected.status === 'passed' ? C.green : C.red }}>
                  {selected.status === 'passed' ? '\u2713' : '\u2717'}
                </span>{' '}
                Actual Result
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}>
                <span style={{
                  padding: '4px 16px',
                  borderRadius: 14,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#000',
                  background: selected.status === 'passed' ? C.green : C.red,
                  letterSpacing: 0.5,
                }}>
                  {selected.status === 'passed' ? 'PASS' : 'FAIL'}
                </span>
                <span style={{ fontSize: 12, color: C.textDim, fontFamily: 'monospace' }}>
                  Execution Time: {selected.time}ms
                </span>
              </div>
              <div style={styles.outputCard}>
                <p style={{ fontSize: 12, color: C.text, margin: 0, lineHeight: 1.6 }}>
                  {selected.actual}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   MAIN: EmployeeTesting
   ================================================================ */
const EmployeeTesting = () => {
  const [activeTab, setActiveTab] = useState('onboarding');

  const activeTabDef = TABS.find((t) => t.id === activeTab);
  const totalScenarios = TABS.reduce((acc, t) => acc + t.scenarios.length, 0);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.h1}>Employee Testing Dashboard</h1>
        <p style={styles.subtitle}>
          Banking QA -- Employee Scenario Testing | {totalScenarios} Test Scenarios across {TABS.length} Categories
        </p>
      </div>

      {/* STAT BADGES */}
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <div
            key={t.id}
            style={{
              background: activeTab === t.id ? `${t.color}22` : C.card,
              border: `1px solid ${activeTab === t.id ? t.color : C.border}`,
              borderRadius: 10,
              padding: '10px 18px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              minWidth: 130,
            }}
            onClick={() => setActiveTab(t.id)}
          >
            <div style={{ fontSize: 20, marginBottom: 2 }}>{t.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 2 }}>{t.scenarios.length}</div>
            <div style={{ fontSize: 10, color: C.textDim }}>Scenarios</div>
          </div>
        ))}
      </div>

      {/* TAB BAR */}
      <div style={styles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t.id}
            style={styles.tab(activeTab === t.id)}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTabDef && (
        <ScenarioTabContent
          key={activeTabDef.id}
          scenarios={activeTabDef.scenarios}
          tabLabel={activeTabDef.label}
        />
      )}
    </div>
  );
};

export default EmployeeTesting;

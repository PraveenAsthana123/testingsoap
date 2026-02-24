import React, { useState } from 'react';

/* ═══════════════════════════════════════════════════
   Banking Security Scenarios - Comprehensive Reference
   ═══════════════════════════════════════════════════ */

const TABS = [
  { id: 'overview', label: 'Security Overview' },
  { id: 'dataProtection', label: 'Data Protection' },
  { id: 'aml', label: 'AML Scenarios' },
  { id: 'fraudTheft', label: 'Fraud & Theft' },
  { id: 'apiSecurity', label: 'API Security Audit' },
  { id: 'codeGuidelines', label: 'Code Guidelines' },
];

/* ─── Color tokens ─── */
const C = {
  primary: '#1a73e8',
  primaryLight: '#e8f0fe',
  success: '#0d9488',
  successLight: '#d1fae5',
  warning: '#e67e22',
  warningLight: '#fef3c7',
  purple: '#7c3aed',
  purpleLight: '#ede9fe',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  grey: '#64748b',
  greyLight: '#f1f5f9',
  border: '#e2e8f0',
  bg: '#ffffff',
  text: '#1e293b',
  textMuted: '#64748b',
  info: '#2563eb',
  infoLight: '#dbeafe',
  orange: '#ea580c',
  orangeLight: '#fff7ed',
};

/* ═══════════════════════════════════════════════════
   DATA: Security Overview
   ═══════════════════════════════════════════════════ */
const POSTURE_CARDS = [
  { label: 'Total Vulnerabilities Found', value: 47, color: C.primary, bg: C.primaryLight, icon: 'V' },
  { label: 'Critical Issues', value: 5, color: C.danger, bg: C.dangerLight, icon: 'C' },
  { label: 'Resolved', value: 38, color: C.success, bg: C.successLight, icon: 'R' },
  { label: 'Pending', value: 9, color: C.warning, bg: C.warningLight, icon: 'P' },
];

const SECURITY_CHECKLIST = [
  {
    category: 'Authentication',
    items: [
      { name: 'OAuth 2.0 / OpenID Connect', status: 'Implemented', priority: 'Critical', description: 'Token-based authentication with refresh token rotation. Authorization code flow with PKCE for SPAs.' },
      { name: 'JWT Token Validation', status: 'Implemented', priority: 'Critical', description: 'RS256 signed tokens, 15-min access token expiry, audience/issuer validation, token blacklisting on logout.' },
      { name: 'Multi-Factor Authentication (MFA)', status: 'Implemented', priority: 'Critical', description: 'TOTP-based MFA for all admin actions, SMS/email OTP for high-value transactions, hardware key support (FIDO2).' },
      { name: 'Password Policy Enforcement', status: 'Implemented', priority: 'High', description: 'Minimum 12 characters, complexity rules, bcrypt hashing (cost factor 12), breach database check (HaveIBeenPwned).' },
      { name: 'Brute Force Protection', status: 'Implemented', priority: 'High', description: 'Account lockout after 5 failed attempts (30-min cooldown), progressive delay, CAPTCHA after 3 failures.' },
    ],
  },
  {
    category: 'Authorization',
    items: [
      { name: 'Role-Based Access Control (RBAC)', status: 'Implemented', priority: 'Critical', description: 'Hierarchical roles: SuperAdmin > Admin > Manager > Teller > Customer. Permission matrix enforced at API gateway.' },
      { name: 'Attribute-Based Access Control (ABAC)', status: 'Pending', priority: 'High', description: 'Context-aware policies: branch location, time of day, transaction amount, device fingerprint.' },
      { name: 'Principle of Least Privilege', status: 'Implemented', priority: 'Critical', description: 'Service accounts have minimal permissions. No shared credentials. Regular access reviews quarterly.' },
      { name: 'API Endpoint Authorization', status: 'Implemented', priority: 'Critical', description: 'Every endpoint checks user role and resource ownership. Object-level authorization prevents horizontal escalation.' },
    ],
  },
  {
    category: 'Encryption',
    items: [
      { name: 'AES-256 Encryption at Rest', status: 'Implemented', priority: 'Critical', description: 'All PII, card numbers, account details encrypted with AES-256-GCM. Key rotation every 90 days via KMS.' },
      { name: 'TLS 1.3 in Transit', status: 'Implemented', priority: 'Critical', description: 'All API communications over TLS 1.3. HSTS enabled with max-age=31536000. Certificate pinning for mobile apps.' },
      { name: 'Database Column Encryption', status: 'Implemented', priority: 'High', description: 'Sensitive columns (SSN, card_number, pin_hash) use application-level encryption before DB storage.' },
      { name: 'Key Management (KMS)', status: 'At Risk', priority: 'Critical', description: 'AWS KMS for production key management. HSM-backed master keys. Envelope encryption pattern.' },
    ],
  },
  {
    category: 'Input Validation',
    items: [
      { name: 'Server-Side Validation', status: 'Implemented', priority: 'Critical', description: 'All inputs validated server-side with Pydantic schemas. Reject malformed requests before processing.' },
      { name: 'SQL Injection Prevention', status: 'Implemented', priority: 'Critical', description: 'Parameterized queries only. No string concatenation in SQL. ORM with query builder pattern.' },
      { name: 'XSS Prevention', status: 'Implemented', priority: 'High', description: 'Output encoding, Content-Security-Policy headers, DOMPurify on frontend, HttpOnly cookies.' },
      { name: 'File Upload Validation', status: 'Implemented', priority: 'High', description: 'Allowlist extensions, max 10MB, virus scan, content-type verification, isolated storage.' },
    ],
  },
  {
    category: 'Session Management',
    items: [
      { name: 'Secure Session Handling', status: 'Implemented', priority: 'Critical', description: 'HttpOnly + Secure + SameSite=Strict cookies. Session ID regeneration on login. Absolute timeout 30 min.' },
      { name: 'Concurrent Session Control', status: 'Implemented', priority: 'High', description: 'Maximum 3 concurrent sessions per user. New login invalidates oldest session. Admin can terminate all sessions.' },
      { name: 'Session Fixation Protection', status: 'Implemented', priority: 'High', description: 'New session ID generated post-authentication. Old session invalidated. Binding to client fingerprint.' },
    ],
  },
  {
    category: 'Audit Logging',
    items: [
      { name: 'Comprehensive Audit Trail', status: 'Implemented', priority: 'Critical', description: 'All CRUD operations logged with: who, what, when, where (IP), correlation_id. Tamper-proof append-only log.' },
      { name: 'Security Event Logging', status: 'Implemented', priority: 'Critical', description: 'Failed logins, privilege escalation attempts, data exports, admin actions logged with alert triggers.' },
      { name: 'Log Integrity & Retention', status: 'Pending', priority: 'High', description: 'Log hashing chain for tamper detection. 7-year retention for compliance. SIEM integration (Splunk/ELK).' },
      { name: 'PII Redaction in Logs', status: 'At Risk', priority: 'Critical', description: 'Sensitive fields masked in logs (card: ****1234, email: r***@email.com). Regex-based scrubbing pipeline.' },
    ],
  },
];

/* ═══════════════════════════════════════════════════
   DATA: Data Protection
   ═══════════════════════════════════════════════════ */
const PII_MASKING_SCENARIOS = [
  {
    field: 'Card Number',
    original: '4532-1234-5678-9012',
    masked: '****-****-****-9012',
    rule: 'Show only last 4 digits. PCI-DSS requirement.',
    tests: [
      { id: 'PII-TC-001', name: 'API response masks card number', method: 'GET /api/v1/accounts/{id}/cards', expected: 'card_number: "****9012"', status: 'Pass' },
      { id: 'PII-TC-002', name: 'Database stores encrypted card', method: 'SELECT card_number FROM cards', expected: 'AES-256 encrypted blob, not plaintext', status: 'Pass' },
      { id: 'PII-TC-003', name: 'Logs do not contain card number', method: 'grep -r "4532" /var/log/app/', expected: 'No matches found', status: 'Pass' },
    ],
  },
  {
    field: 'Email Address',
    original: 'rahul.sharma@email.com',
    masked: 'r***@email.com',
    rule: 'Show first character + domain. Prevent enumeration.',
    tests: [
      { id: 'PII-TC-004', name: 'API response masks email', method: 'GET /api/v1/customers/{id}', expected: 'email: "r***@email.com"', status: 'Pass' },
      { id: 'PII-TC-005', name: 'Search by partial email blocked', method: 'GET /api/v1/customers?email=rahul', expected: '403 Forbidden or empty result', status: 'Pass' },
      { id: 'PII-TC-006', name: 'Error messages hide email', method: 'POST /api/v1/auth/login (wrong email)', expected: '"Invalid credentials" (not "email not found")', status: 'Pass' },
    ],
  },
  {
    field: 'Phone Number',
    original: '+91-9876543210',
    masked: '+91-****3210',
    rule: 'Show country code + last 4 digits only.',
    tests: [
      { id: 'PII-TC-007', name: 'API response masks phone', method: 'GET /api/v1/customers/{id}', expected: 'phone: "+91-****3210"', status: 'Pass' },
      { id: 'PII-TC-008', name: 'OTP delivery does not log phone', method: 'POST /api/v1/auth/send-otp', expected: 'Log shows "OTP sent to ****3210"', status: 'Fail' },
    ],
  },
  {
    field: 'Aadhaar Number',
    original: '1234-5678-9012',
    masked: 'XXXX-XXXX-9012',
    rule: 'Mask first 8 digits. UIDAI compliance.',
    tests: [
      { id: 'PII-TC-009', name: 'KYC response masks Aadhaar', method: 'GET /api/v1/customers/{id}/kyc', expected: 'aadhaar: "XXXX-XXXX-9012"', status: 'Pass' },
      { id: 'PII-TC-010', name: 'Full Aadhaar only for authorized role', method: 'GET with role=compliance_officer', expected: 'Full number returned for authorized role only', status: 'Pass' },
    ],
  },
  {
    field: 'PAN Number',
    original: 'ABCDE1234F',
    masked: 'A****4F',
    rule: 'Show first and last 2 characters only.',
    tests: [
      { id: 'PII-TC-011', name: 'API response masks PAN', method: 'GET /api/v1/customers/{id}/kyc', expected: 'pan: "A****4F"', status: 'Pass' },
    ],
  },
];

const ENCRYPTION_AT_REST = [
  { field: 'Card Number', algorithm: 'AES-256-GCM', keyRotation: '90 days', storage: 'Encrypted column + separate IV', compliance: 'PCI-DSS' },
  { field: 'Account PIN', algorithm: 'bcrypt (cost 12)', keyRotation: 'N/A (hash)', storage: 'Salted hash only, no reversible encryption', compliance: 'RBI Guidelines' },
  { field: 'Customer SSN/Aadhaar', algorithm: 'AES-256-GCM', keyRotation: '90 days', storage: 'Encrypted column, decryption requires role check', compliance: 'UIDAI / GDPR' },
  { field: 'Transaction Details', algorithm: 'AES-256-CBC', keyRotation: '180 days', storage: 'Encrypted at application layer before DB insert', compliance: 'SOX' },
  { field: 'Passwords', algorithm: 'Argon2id', keyRotation: 'N/A (hash)', storage: 'Memory-hard hash, 64MB memory, 3 iterations', compliance: 'OWASP' },
  { field: 'API Keys', algorithm: 'Fernet (AES-128-CBC)', keyRotation: '30 days', storage: 'Sentinel prefix: __ENCRYPTED__:<token>', compliance: 'Internal' },
];

const ACCESS_CONTROL_MATRIX = [
  { dataType: 'Account Balance', admin: 'Full', manager: 'Branch Only', teller: 'Assigned Customers', customer: 'Own Only' },
  { dataType: 'Transaction History', admin: 'Full', manager: 'Branch Only', teller: 'Assigned (Last 90 days)', customer: 'Own (Last 1 year)' },
  { dataType: 'Customer PII (Full)', admin: 'Full', manager: 'Branch Only', teller: 'Masked', customer: 'Own Only' },
  { dataType: 'Card Details', admin: 'Full (Audit Logged)', manager: 'Masked', teller: 'Last 4 Only', customer: 'Masked' },
  { dataType: 'Loan Documents', admin: 'Full', manager: 'Branch Only', teller: 'Read Only', customer: 'Own Only' },
  { dataType: 'Audit Logs', admin: 'Full', manager: 'None', teller: 'None', customer: 'None' },
  { dataType: 'System Config', admin: 'Full', manager: 'None', teller: 'None', customer: 'None' },
  { dataType: 'KYC Documents', admin: 'Full', manager: 'Branch Only', teller: 'View Only', customer: 'Own Only' },
  { dataType: 'Credit Score', admin: 'Full', manager: 'Branch Only', teller: 'None', customer: 'Own Only' },
  { dataType: 'Compliance Reports', admin: 'Full', manager: 'Branch Summary', teller: 'None', customer: 'None' },
];

const DATA_RETENTION = [
  { dataType: 'Transaction Records', retention: '10 years', regulation: 'RBI / SOX', purgeMethod: 'Archive to cold storage, then delete', gdprErasure: 'Anonymize, retain aggregates' },
  { dataType: 'Customer PII', retention: '7 years post account closure', regulation: 'GDPR / RBI', purgeMethod: 'Crypto-shredding (delete encryption key)', gdprErasure: 'Full erasure within 30 days of request' },
  { dataType: 'Audit Logs', retention: '7 years', regulation: 'SOX / PCI-DSS', purgeMethod: 'Immutable archive, hash chain preserved', gdprErasure: 'Redact PII, retain event structure' },
  { dataType: 'Session Data', retention: '90 days', regulation: 'Internal Policy', purgeMethod: 'Auto-purge via cron job', gdprErasure: 'Immediate deletion' },
  { dataType: 'KYC Documents', retention: '10 years', regulation: 'PMLA / RBI', purgeMethod: 'Secure file deletion + DB record purge', gdprErasure: 'Anonymize metadata, delete files' },
  { dataType: 'Failed Login Attempts', retention: '1 year', regulation: 'Internal Policy', purgeMethod: 'Auto-purge, retain aggregate counts', gdprErasure: 'Delete IP + user mapping' },
];

/* ═══════════════════════════════════════════════════
   DATA: AML Scenarios
   ═══════════════════════════════════════════════════ */
const AML_SCENARIOS = [
  {
    id: 'AML-001',
    name: 'Structuring (Smurfing)',
    severity: 'High',
    description: 'Multiple cash deposits deliberately kept just below the $10,000 Currency Transaction Report (CTR) threshold to avoid reporting requirements.',
    redFlags: [
      'Multiple deposits of $9,000-$9,999 within a short period',
      'Deposits made at different branches on the same day',
      'Multiple individuals depositing into the same account',
      'Customer avoids teller questions about transaction purpose',
      'Round-trip pattern: deposit cash, immediately wire out',
    ],
    detectionRules: [
      'SUM(cash_deposits) in 7 days > $30,000 where each deposit < $10,000',
      'COUNT(cash_deposits < $10,000) in 30 days > 5 for same account',
      'Deposits at 3+ different branches within 48 hours',
      'Velocity check: more than 2 cash deposits per day',
    ],
    flowSteps: [
      { step: 'Customer deposits $9,500', type: 'action' },
      { step: 'Next day: deposits $9,800', type: 'action' },
      { step: 'Next day: deposits $9,200', type: 'action' },
      { step: 'System flags cumulative pattern', type: 'detection' },
      { step: 'Generate STR (Suspicious Transaction Report)', type: 'alert' },
      { step: 'Alert Compliance Officer', type: 'compliance' },
      { step: 'File SAR with FinCEN within 30 days', type: 'compliance' },
    ],
    testData: {
      account_id: 'ACC-2024-78901',
      customer_id: 'CUST-5678',
      transactions: [
        { date: '2024-01-15', amount: 9500, type: 'cash_deposit', branch: 'BR-001' },
        { date: '2024-01-16', amount: 9800, type: 'cash_deposit', branch: 'BR-003' },
        { date: '2024-01-17', amount: 9200, type: 'cash_deposit', branch: 'BR-002' },
        { date: '2024-01-18', amount: 9700, type: 'cash_deposit', branch: 'BR-001' },
      ],
    },
    expectedAlert: 'CTR_STRUCTURING_DETECTED',
    complianceAction: 'File SAR with FinCEN. Freeze account pending review. Notify BSA Officer within 24 hours.',
  },
  {
    id: 'AML-002',
    name: 'Layering',
    severity: 'Critical',
    description: 'Rapid transfers between multiple accounts to obscure the origin and destination of funds. Designed to create complex audit trails that are difficult to trace.',
    redFlags: [
      'Circular fund transfers (A to B to C to A)',
      'Multiple rapid transfers within minutes',
      'Transfers between unrelated accounts with no business purpose',
      'Use of intermediary accounts with minimal other activity',
      'Funds eventually consolidated in a single withdrawal account',
    ],
    detectionRules: [
      'Graph analysis: circular path detected in transfer chain',
      'Transfer velocity: >5 transfers from same source in 1 hour',
      'Amount similarity: transfers within 2% of each other across chain',
      'Intermediary account age < 90 days with >$50,000 throughput',
    ],
    flowSteps: [
      { step: 'Large deposit: $250,000', type: 'action' },
      { step: 'Transfer A to B: $80,000', type: 'action' },
      { step: 'Transfer B to C: $78,500', type: 'action' },
      { step: 'Transfer C to D: $77,000', type: 'action' },
      { step: 'Cash withdrawal from D: $75,000', type: 'action' },
      { step: 'System detects circular flow pattern', type: 'detection' },
      { step: 'Flag all accounts in chain', type: 'alert' },
      { step: 'Freeze and investigate', type: 'compliance' },
    ],
    testData: {
      source_account: 'ACC-2024-11111',
      chain: [
        { from: 'ACC-2024-11111', to: 'ACC-2024-22222', amount: 80000, timestamp: '2024-01-20T10:00:00Z' },
        { from: 'ACC-2024-22222', to: 'ACC-2024-33333', amount: 78500, timestamp: '2024-01-20T10:15:00Z' },
        { from: 'ACC-2024-33333', to: 'ACC-2024-44444', amount: 77000, timestamp: '2024-01-20T10:30:00Z' },
        { from: 'ACC-2024-44444', to: 'ACC-2024-55555', amount: 75000, timestamp: '2024-01-20T10:45:00Z' },
      ],
    },
    expectedAlert: 'LAYERING_CIRCULAR_FLOW_DETECTED',
    complianceAction: 'Freeze all accounts in chain. File SAR. Escalate to Financial Crime Unit. Preserve all transaction records.',
  },
  {
    id: 'AML-003',
    name: 'Shell Company Activity',
    severity: 'Critical',
    description: 'High-value transfers to and from shell companies with no legitimate business operations. Shell companies serve as vehicles for laundering proceeds of crime.',
    redFlags: [
      'Company registered in tax haven with no employees',
      'High transaction volume but no visible business operations',
      'Frequent large transfers to offshore accounts',
      'Company directors are nominees or untraceable individuals',
      'Mismatched business type and transaction patterns',
    ],
    detectionRules: [
      'Entity has no employees but processes >$500,000/month',
      'Registered agent address shared by 10+ entities',
      'Beneficial ownership chain exceeds 3 layers',
      'Jurisdiction risk score > 7 (FATF grey/blacklist)',
    ],
    flowSteps: [
      { step: 'Shell company opens business account', type: 'action' },
      { step: 'Receives $500K wire from offshore', type: 'action' },
      { step: 'Invoices for "consulting services"', type: 'action' },
      { step: 'Transfers to 5 related entities', type: 'action' },
      { step: 'EDD triggers on high-risk jurisdiction', type: 'detection' },
      { step: 'Beneficial ownership check fails', type: 'alert' },
      { step: 'File STR and escalate', type: 'compliance' },
    ],
    testData: {
      entity_id: 'ENT-SHELL-001',
      registered_country: 'BVI',
      employees: 0,
      monthly_volume: 520000,
      directors: ['Nominee Corp Ltd'],
      transactions: [
        { date: '2024-02-01', amount: 500000, type: 'wire_in', source: 'Offshore Holdings LLC' },
        { date: '2024-02-05', amount: 120000, type: 'wire_out', destination: 'Entity-A (Cayman)' },
        { date: '2024-02-05', amount: 110000, type: 'wire_out', destination: 'Entity-B (Panama)' },
      ],
    },
    expectedAlert: 'SHELL_COMPANY_HIGH_RISK',
    complianceAction: 'Enhanced Due Diligence (EDD). Request UBO documentation. File STR if UBO cannot be verified. Consider relationship termination.',
  },
  {
    id: 'AML-004',
    name: 'Unusual International Transfers',
    severity: 'High',
    description: 'Large or frequent cross-border transfers to high-risk jurisdictions with no clear business rationale. Potential proceeds of corruption or terrorism financing.',
    redFlags: [
      'Transfers to FATF grey/blacklist countries',
      'Sudden increase in international transfer activity',
      'Transfer amounts inconsistent with customer profile',
      'Multiple beneficiaries in high-risk regions',
      'Vague transaction descriptions ("business expenses", "services")',
    ],
    detectionRules: [
      'International transfer to FATF high-risk country > $25,000',
      'Monthly international transfers exceed 5x customer average',
      'New beneficiary in sanctioned jurisdiction',
      'Cumulative international transfers > $100,000 in 30 days (for retail customer)',
    ],
    flowSteps: [
      { step: 'Customer initiates $50K wire to Yemen', type: 'action' },
      { step: 'Jurisdiction check: FATF grey list', type: 'detection' },
      { step: 'Customer profile: salaried, avg balance $5K', type: 'detection' },
      { step: 'Amount exceeds profile risk threshold', type: 'alert' },
      { step: 'Hold transfer pending review', type: 'compliance' },
      { step: 'Request source of funds documentation', type: 'compliance' },
    ],
    testData: {
      customer_id: 'CUST-9012',
      profile: { type: 'retail', avg_balance: 5000, income: 60000 },
      transfer: { amount: 50000, destination_country: 'YE', beneficiary: 'Al-Rashid Trading Co', purpose: 'Business expenses' },
    },
    expectedAlert: 'HIGH_RISK_JURISDICTION_TRANSFER',
    complianceAction: 'Hold transfer. Request SOF documentation. OFAC/sanctions screening. File STR if documentation inadequate.',
  },
  {
    id: 'AML-005',
    name: 'Dormant Account Activation',
    severity: 'Medium',
    description: 'Sudden large transactions on accounts that have been inactive for extended periods. Often used for layering or receiving proceeds of fraud.',
    redFlags: [
      'No transactions for 12+ months, then sudden large deposit',
      'Account reactivated with updated contact information',
      'Immediate large transfers out after reactivation',
      'Multiple dormant accounts reactivated by same beneficial owner',
      'Reactivation followed by international wire transfers',
    ],
    detectionRules: [
      'Account dormant >365 days + transaction > $5,000 within 7 days of reactivation',
      'Dormant account receives wire transfer as first post-reactivation transaction',
      'Multiple dormant accounts (same owner) reactivated within 30 days',
    ],
    flowSteps: [
      { step: 'Account dormant for 18 months', type: 'action' },
      { step: 'Customer visits branch to reactivate', type: 'action' },
      { step: 'Next day: $85,000 wire deposit received', type: 'action' },
      { step: 'Same day: $80,000 transfer to offshore account', type: 'action' },
      { step: 'Dormancy + high-value triggers alert', type: 'detection' },
      { step: 'KYC refresh required', type: 'alert' },
      { step: 'Hold outbound transfer, verify SOF', type: 'compliance' },
    ],
    testData: {
      account_id: 'ACC-2024-DORMANT-01',
      last_activity: '2022-06-15',
      reactivation_date: '2024-01-10',
      transactions_post: [
        { date: '2024-01-11', amount: 85000, type: 'wire_in', source: 'Unknown Entity Ltd' },
        { date: '2024-01-11', amount: 80000, type: 'wire_out', destination: 'Swiss Account (CH)' },
      ],
    },
    expectedAlert: 'DORMANT_ACCOUNT_SUSPICIOUS_ACTIVITY',
    complianceAction: 'Refresh KYC. Hold outbound transfers. Verify source of funds. File STR if justification insufficient.',
  },
];

/* ═══════════════════════════════════════════════════
   DATA: Fraud & Theft Scenarios
   ═══════════════════════════════════════════════════ */
const FRAUD_SCENARIOS = [
  {
    id: 'FRAUD-001',
    name: 'Card Skimming',
    icon: 'CS',
    severity: 'High',
    attackVector: 'Physical skimming device attached to ATM/POS terminal captures card magnetic stripe data. Hidden camera or overlay keypad captures PIN. Cloned cards used at different locations.',
    detectionMethods: [
      'Geolocation anomaly: same card used at two locations 500+ km apart within 1 hour',
      'Velocity check: more than 5 transactions in 10 minutes',
      'Unusual merchant category for customer profile',
      'Transaction at known compromised ATM/terminal',
      'Duplicate magnetic stripe data detected across multiple cards',
    ],
    preventionControls: [
      'EMV chip cards (cannot clone chip)',
      'ATM anti-skimming shields (jitter technology)',
      'Real-time transaction alerts to customer',
      'Machine learning fraud scoring on every transaction',
      'Geo-fencing: block transactions outside registered regions',
    ],
    testCase: {
      id: 'FRAUD-TC-001',
      scenario: 'Card used in Mumbai at 10:00 AM, then in Delhi at 10:30 AM',
      input: { card_id: 'CARD-5678', txn1: { location: 'Mumbai', time: '10:00', amount: 5000 }, txn2: { location: 'Delhi', time: '10:30', amount: 8000 } },
      expected: 'Block second transaction. Alert customer. Flag for investigation.',
    },
    responseProcedure: [
      { step: 'Real-time fraud engine flags transaction', type: 'detection' },
      { step: 'Block card immediately', type: 'action' },
      { step: 'Send SMS/push alert to customer', type: 'action' },
      { step: 'Customer confirms fraud', type: 'action' },
      { step: 'Initiate chargeback process', type: 'action' },
      { step: 'Issue replacement card', type: 'action' },
      { step: 'File police report if >$1,000', type: 'compliance' },
      { step: 'Report compromised terminal to network', type: 'compliance' },
    ],
  },
  {
    id: 'FRAUD-002',
    name: 'Phishing Attack',
    icon: 'PA',
    severity: 'Critical',
    attackVector: 'Social engineering via fake emails/SMS/websites that mimic the bank. Tricks customers into entering credentials, OTP, or card details on fraudulent pages. Increasingly uses AI-generated content.',
    detectionMethods: [
      'Email gateway: detect spoofed sender domains (DMARC/DKIM/SPF)',
      'URL analysis: newly registered domains mimicking bank name',
      'Customer reports of suspicious communications',
      'Credential stuffing detection: many failed logins from same IP range',
      'Behavioral biometrics: typing pattern mismatch after "successful" login',
    ],
    preventionControls: [
      'DMARC policy: p=reject for bank domain',
      'Anti-phishing training for customers and employees',
      'Hardware security keys (FIDO2) for high-value operations',
      'SMS sender ID registration to prevent spoofing',
      'Browser-based phishing detection (Google Safe Browsing integration)',
      'Transaction signing: OTP bound to specific transaction details',
    ],
    testCase: {
      id: 'FRAUD-TC-002',
      scenario: 'User enters credentials on fake site, attacker attempts login',
      input: { ip: '185.220.101.42', user_agent: 'different_from_usual', device_fingerprint: 'unknown', geo: 'Russia' },
      expected: 'Block login. Trigger MFA challenge. Alert account holder. Lock account after 3 attempts.',
    },
    responseProcedure: [
      { step: 'Customer reports suspicious email/SMS', type: 'detection' },
      { step: 'Security team analyzes phishing kit', type: 'action' },
      { step: 'Block phishing domain (takedown request)', type: 'action' },
      { step: 'Reset all potentially compromised credentials', type: 'action' },
      { step: 'Notify affected customers', type: 'action' },
      { step: 'Update email filters with new indicators', type: 'action' },
      { step: 'Report to CERT-In / Anti-Phishing Working Group', type: 'compliance' },
    ],
  },
  {
    id: 'FRAUD-003',
    name: 'Account Takeover',
    icon: 'AT',
    severity: 'Critical',
    attackVector: 'Unauthorized access to customer accounts using stolen credentials from data breaches, SIM swapping, or social engineering. Attacker changes contact details, then initiates transfers.',
    detectionMethods: [
      'Login from new device + new location simultaneously',
      'Contact detail changes followed by high-value transfer within 24 hours',
      'SIM swap detection: sudden loss of SMS delivery for OTP',
      'Behavioral analytics: session patterns differ from historical',
      'Password reset from unrecognized email/device',
    ],
    preventionControls: [
      'Mandatory MFA on all logins',
      'Cool-down period (24h) after contact detail changes before allowing transfers',
      'Device binding: new device requires in-branch verification for high-value accounts',
      'SIM swap detection integration with telecom providers',
      'Real-time session risk scoring',
    ],
    testCase: {
      id: 'FRAUD-TC-003',
      scenario: 'Login from new device, change email, then initiate $50K wire',
      input: { account_id: 'ACC-1234', new_device: true, email_change: true, wire_amount: 50000, time_since_change: '2h' },
      expected: 'Block wire transfer. Cool-down period not met (24h required). Alert customer on original contact.',
    },
    responseProcedure: [
      { step: 'Anomalous login detected by risk engine', type: 'detection' },
      { step: 'Step-up authentication required', type: 'action' },
      { step: 'If contact change + transfer: enforce cool-down', type: 'action' },
      { step: 'Notify customer on original (pre-change) contact', type: 'action' },
      { step: 'Lock account if customer confirms unauthorized access', type: 'action' },
      { step: 'Forensic review of all session activity', type: 'compliance' },
      { step: 'File incident report with regulator', type: 'compliance' },
    ],
  },
  {
    id: 'FRAUD-004',
    name: 'Insider Threat',
    icon: 'IT',
    severity: 'Critical',
    attackVector: 'Bank employee abuses authorized access to view, modify, or exfiltrate customer data. May involve unauthorized account lookups, phantom transactions, or selling customer information.',
    detectionMethods: [
      'Access pattern analysis: employee viewing accounts outside their assigned portfolio',
      'After-hours access to sensitive systems',
      'Bulk data export or screen scraping detection',
      'Peer comparison: employee accessing 10x more records than peers',
      'Unauthorized override of security controls',
    ],
    preventionControls: [
      'Role-based access with need-to-know enforcement',
      'Four-eyes principle for high-value operations',
      'Mandatory access logging with real-time SIEM alerts',
      'Background checks and periodic re-screening',
      'Data Loss Prevention (DLP) controls on endpoints',
      'USB port blocking and print watermarking',
    ],
    testCase: {
      id: 'FRAUD-TC-004',
      scenario: 'Teller accesses 50 customer records in 1 hour (normal: 10)',
      input: { employee_id: 'EMP-789', records_accessed: 50, time_window: '1h', normal_avg: 10, after_hours: false },
      expected: 'Alert security team. Flag for investigation. Temporarily restrict access.',
    },
    responseProcedure: [
      { step: 'SIEM alert: abnormal access pattern', type: 'detection' },
      { step: 'Temporarily revoke elevated access', type: 'action' },
      { step: 'Forensic review of all accessed records', type: 'action' },
      { step: 'Interview employee with HR present', type: 'action' },
      { step: 'If confirmed: terminate + legal action', type: 'action' },
      { step: 'Notify affected customers', type: 'compliance' },
      { step: 'Report to regulator (data breach notification)', type: 'compliance' },
    ],
  },
  {
    id: 'FRAUD-005',
    name: 'Check Fraud',
    icon: 'CF',
    severity: 'High',
    attackVector: 'Forged, altered, or counterfeit checks used to withdraw funds. Includes washing (chemical alteration of payee/amount), counterfeiting (printing fake checks), and forged endorsements.',
    detectionMethods: [
      'Check image analysis: altered ink patterns, mismatched fonts',
      'Positive Pay: pre-authorized check list from account holder',
      'Signature verification (automated + manual)',
      'Duplicate check detection (same check number presented twice)',
      'Payee name mismatch with known beneficiaries',
    ],
    preventionControls: [
      'Positive Pay service (mandatory for business accounts)',
      'Check stock with security features (watermark, microprint, chemical sensitivity)',
      'Daily reconciliation of cleared checks',
      'Dual authorization for checks > $10,000',
      'Customer notification for all check clearances',
    ],
    testCase: {
      id: 'FRAUD-TC-005',
      scenario: 'Check presented with altered amount ($500 changed to $5,000)',
      input: { check_number: 'CHK-4567', original_amount: 500, presented_amount: 5000, positive_pay_amount: 500 },
      expected: 'Positive Pay mismatch. Reject check. Alert account holder. Flag presenter.',
    },
    responseProcedure: [
      { step: 'Positive Pay flags amount mismatch', type: 'detection' },
      { step: 'Reject check presentation', type: 'action' },
      { step: 'Retain check as evidence', type: 'action' },
      { step: 'Alert account holder', type: 'action' },
      { step: 'File SAR if fraud confirmed', type: 'compliance' },
      { step: 'Report to law enforcement', type: 'compliance' },
    ],
  },
  {
    id: 'FRAUD-006',
    name: 'Wire Transfer Fraud',
    icon: 'WF',
    severity: 'Critical',
    attackVector: 'Business Email Compromise (BEC) or social engineering to authorize fraudulent wire transfers. Attacker impersonates CEO/CFO or vendor, requests urgent wire to attacker-controlled account.',
    detectionMethods: [
      'New beneficiary + urgent request + executive impersonation',
      'Wire to country not in customer transaction history',
      'Amount exceeds customer typical wire pattern',
      'Email header analysis reveals spoofing',
      'Callback verification to registered phone fails',
    ],
    preventionControls: [
      'Mandatory callback verification for wires > $25,000',
      'Dual authorization for all wire transfers',
      'New beneficiary cool-down period (4 hours)',
      'BEC awareness training for finance teams',
      'Email authentication (DMARC/DKIM/SPF)',
    ],
    testCase: {
      id: 'FRAUD-TC-006',
      scenario: 'CFO email requests urgent $200K wire to new beneficiary',
      input: { requestor: 'cfo@company.com (spoofed)', amount: 200000, beneficiary: 'New account in Hong Kong', urgency: 'ASAP', callback_verified: false },
      expected: 'Hold wire. Callback to registered CFO phone. If unverified, reject and alert.',
    },
    responseProcedure: [
      { step: 'Wire request received via email', type: 'action' },
      { step: 'New beneficiary triggers enhanced verification', type: 'detection' },
      { step: 'Callback to registered phone number', type: 'action' },
      { step: 'CFO confirms: did not send email', type: 'detection' },
      { step: 'Reject wire transfer', type: 'action' },
      { step: 'Notify IT security of BEC attempt', type: 'action' },
      { step: 'File FBI IC3 report', type: 'compliance' },
    ],
  },
  {
    id: 'FRAUD-007',
    name: 'ATM Fraud',
    icon: 'AF',
    severity: 'High',
    attackVector: 'Physical tampering with ATMs including skimming devices, card trapping (Lebanese loop), cash trapping, shoulder surfing, and jackpotting (malware-based cash dispensing).',
    detectionMethods: [
      'ATM health monitoring: tamper sensors, door sensors, card reader anomalies',
      'Transaction pattern: multiple failed withdrawals followed by success',
      'Cash cassette discrepancies during reconciliation',
      'Card trapping: card inserted but no transaction completed, followed by withdrawal at different ATM',
      'Jackpotting: unexpected large cash dispensing without valid transaction',
    ],
    preventionControls: [
      'Anti-skimming jitter technology on card readers',
      'Tamper-evident seals and physical inspections (2x daily)',
      'Encrypted PIN pad (EPP) with tamper detection',
      'ATM software whitelisting (prevent unauthorized code)',
      'CCTV with facial recognition at all ATMs',
      'Geo-fencing alerts for cross-border ATM usage',
    ],
    testCase: {
      id: 'FRAUD-TC-007',
      scenario: 'ATM dispenses cash without matching transaction log',
      input: { atm_id: 'ATM-BR005-01', dispensed: 50000, transaction_log: 'NO_MATCHING_TXN', time: '02:30 AM', tamper_sensor: 'TRIGGERED' },
      expected: 'Immediate ATM shutdown. Alert operations team. Dispatch security. Preserve CCTV footage.',
    },
    responseProcedure: [
      { step: 'Tamper sensor or reconciliation mismatch detected', type: 'detection' },
      { step: 'Remote ATM shutdown', type: 'action' },
      { step: 'Alert operations and security team', type: 'action' },
      { step: 'Dispatch technician and security to site', type: 'action' },
      { step: 'Preserve CCTV footage (30 days)', type: 'action' },
      { step: 'Forensic analysis of ATM software', type: 'action' },
      { step: 'File police report and insurance claim', type: 'compliance' },
    ],
  },
];

/* ═══════════════════════════════════════════════════
   DATA: API Security Audit
   ═══════════════════════════════════════════════════ */
const OWASP_API_TOP_10 = [
  {
    rank: 1,
    name: 'Broken Object Level Authorization (BOLA)',
    severity: 'Critical',
    description: 'APIs expose endpoints that handle object identifiers, creating a wide attack surface for object-level access control issues. Attacker manipulates object IDs in API calls to access other users\' data.',
    exampleAttack: 'GET /api/v1/accounts/12345/balance — change 12345 to 12346 to view another customer\'s balance. The API fails to verify that the authenticated user owns account 12346.',
    testCase: 'Authenticate as User A. Replace account_id in requests with User B\'s account_id. Verify 403 Forbidden returned for all endpoints.',
    remediation: 'Implement object-level authorization checks in every endpoint. Verify the authenticated user has access to the specific resource. Use UUIDs instead of sequential IDs.',
  },
  {
    rank: 2,
    name: 'Broken Authentication',
    severity: 'Critical',
    description: 'Authentication mechanisms are implemented incorrectly, allowing attackers to compromise authentication tokens or exploit implementation flaws to assume other users\' identities.',
    exampleAttack: 'JWT token with algorithm "none" accepted by server. Or: brute force /api/auth/login with no rate limiting. Or: password reset token is predictable (sequential).',
    testCase: 'Send JWT with alg:none. Brute force login endpoint (100 attempts/sec). Test password reset token entropy. Verify token expiration is enforced.',
    remediation: 'Enforce strong JWT validation (RS256, check exp/iss/aud). Rate limit auth endpoints. Use cryptographically random reset tokens. Implement account lockout.',
  },
  {
    rank: 3,
    name: 'Excessive Data Exposure',
    severity: 'High',
    description: 'API returns more data than the client needs, relying on the frontend to filter sensitive fields. The full object is serialized and sent over the wire.',
    exampleAttack: 'GET /api/v1/customers/me returns: { name, email, ssn, card_number, internal_risk_score, credit_limit, ... } — frontend only shows name and email, but all data is in the response.',
    testCase: 'Inspect raw API responses for every endpoint. Verify no PII beyond what the UI displays. Check that internal fields (risk_score, internal_notes) are never exposed.',
    remediation: 'Use response schemas (Pydantic response_model) that explicitly define returned fields. Never serialize full ORM objects. Apply field-level filtering based on user role.',
  },
  {
    rank: 4,
    name: 'Lack of Resources & Rate Limiting',
    severity: 'High',
    description: 'API does not impose restrictions on the size or number of resources that can be requested. Leads to denial-of-service, brute force attacks, and resource exhaustion.',
    exampleAttack: 'GET /api/v1/transactions?limit=999999 — returns millions of records, crashing the server. Or: POST /api/v1/transfers called 1000 times/second with no throttling.',
    testCase: 'Request with limit=999999. Send 1000 requests/second. Upload 1GB file. Verify 429 Too Many Requests returned. Verify max pagination limit enforced.',
    remediation: 'Implement rate limiting per IP and per user. Set maximum pagination limits (500). Enforce request body size limits. Use API gateway throttling.',
  },
  {
    rank: 5,
    name: 'Broken Function Level Authorization',
    severity: 'Critical',
    description: 'Complex access control policies with different hierarchies, groups, and roles. Administrative functions exposed to regular users through predictable endpoint patterns.',
    exampleAttack: 'Regular user discovers /api/v1/admin/users endpoint by guessing the URL pattern. API does not verify admin role, returns all user data.',
    testCase: 'Authenticate as regular user. Call all /admin/* endpoints. Verify 403 for every admin endpoint. Test role escalation by modifying role claim in token.',
    remediation: 'Deny by default. Implement role checks at middleware level. Admin endpoints on separate API gateway route with additional authentication.',
  },
  {
    rank: 6,
    name: 'Mass Assignment',
    severity: 'High',
    description: 'API binds client-provided data to internal objects without proper filtering. Attacker can modify object properties they should not be able to access.',
    exampleAttack: 'PUT /api/v1/users/me with body: { "name": "John", "role": "admin", "credit_limit": 999999 } — API updates role and credit_limit because it blindly accepts all fields.',
    testCase: 'Send update request with extra fields (role, is_admin, credit_limit, internal_status). Verify that only whitelisted fields are updated. Check DB directly after update.',
    remediation: 'Use explicit Pydantic models for input (whitelist fields). Never pass request.json() directly to ORM update. Separate read and write schemas.',
  },
  {
    rank: 7,
    name: 'Security Misconfiguration',
    severity: 'Medium',
    description: 'Insecure default configurations, incomplete/ad-hoc configurations, open cloud storage, misconfigured HTTP headers, unnecessary HTTP methods, CORS misconfiguration.',
    exampleAttack: 'CORS allows origin: *. Debug mode enabled in production exposing stack traces. Default admin credentials not changed. Unnecessary HTTP methods (TRACE, OPTIONS) enabled.',
    testCase: 'Check CORS headers for wildcard. Trigger errors and check for stack traces. Test TRACE/TRACK methods. Verify security headers (HSTS, CSP, X-Frame-Options).',
    remediation: 'Restrict CORS origins. Disable debug mode. Set all security headers. Remove default credentials. Disable unnecessary HTTP methods. Automate configuration audits.',
  },
  {
    rank: 8,
    name: 'Injection (SQL, NoSQL, Command)',
    severity: 'Critical',
    description: 'Untrusted data sent to an interpreter as part of a command or query. SQL injection, NoSQL injection, OS command injection, LDAP injection.',
    exampleAttack: 'GET /api/v1/accounts?sort=name; DROP TABLE accounts;-- OR POST /api/v1/search with body: { "filter": { "$gt": "" } } (NoSQL injection)',
    testCase: 'Send SQL injection payloads in all input fields. Test NoSQL operators in JSON bodies. Test command injection in file upload names. Use SQLMap/Burp Suite for automated testing.',
    remediation: 'Parameterized queries only. Input validation with strict schemas. Whitelist allowed sort/filter fields. Use ORM query builders. Sanitize file names.',
  },
  {
    rank: 9,
    name: 'Improper Asset Management',
    severity: 'Medium',
    description: 'Old API versions still running with known vulnerabilities. Unpatched endpoints. Development/staging APIs exposed to the internet. No API inventory.',
    exampleAttack: 'Discover /api/v1/login (MFA enforced) but /api/v0/login (no MFA) still active. Or: /api/staging/* accessible from public internet with debug endpoints.',
    testCase: 'Enumerate API versions (/v0/, /v1/, /v2/). Check for staging/dev endpoints. Verify old versions are decommissioned. Test that deprecated endpoints return 410 Gone.',
    remediation: 'Maintain API inventory. Decommission old versions. Separate staging from production networks. Use API gateway to block unknown routes. Regular penetration testing.',
  },
  {
    rank: 10,
    name: 'Insufficient Logging & Monitoring',
    severity: 'High',
    description: 'Insufficient logging, monitoring, and alerting allows attackers to go undetected. Without proper audit trails, incident investigation is impossible.',
    exampleAttack: 'Attacker exfiltrates data over weeks. No alerts triggered because API only logs 2xx responses. Failed authentication attempts not logged. No SIEM integration.',
    testCase: 'Generate security events (failed logins, unauthorized access). Verify events are logged with timestamp, IP, user, action. Verify alerts fire within 5 minutes. Check log retention.',
    remediation: 'Log all authentication events, authorization failures, input validation failures. Integrate with SIEM. Set up alerting rules. Ensure tamper-proof log storage. 90-day minimum retention.',
  },
];

const API_HEADERS_TABLE = [
  { header: 'Authorization', purpose: 'Bearer token or API key for authentication', required: 'Yes (all endpoints except /health)', example: 'Bearer eyJhbGciOi...' },
  { header: 'Content-Type', purpose: 'Media type of request body', required: 'Yes (POST/PUT/PATCH)', example: 'application/json' },
  { header: 'X-Request-ID', purpose: 'Correlation ID for request tracing across services', required: 'Recommended', example: 'req-550e8400-e29b-41d4-a716' },
  { header: 'X-RateLimit-Limit', purpose: 'Maximum requests allowed in window (response)', required: 'Auto (response)', example: '100' },
  { header: 'X-RateLimit-Remaining', purpose: 'Remaining requests in current window (response)', required: 'Auto (response)', example: '87' },
  { header: 'X-RateLimit-Reset', purpose: 'Unix timestamp when rate limit resets (response)', required: 'Auto (response)', example: '1706745600' },
  { header: 'X-Content-Type-Options', purpose: 'Prevent MIME type sniffing', required: 'Auto (response)', example: 'nosniff' },
  { header: 'X-Frame-Options', purpose: 'Prevent clickjacking via iframes', required: 'Auto (response)', example: 'DENY' },
  { header: 'Strict-Transport-Security', purpose: 'Enforce HTTPS connections', required: 'Auto (response)', example: 'max-age=31536000; includeSubDomains' },
  { header: 'Content-Security-Policy', purpose: 'Restrict resource loading sources', required: 'Auto (response)', example: "default-src 'self'" },
  { header: 'X-Idempotency-Key', purpose: 'Prevent duplicate write operations', required: 'Recommended (POST/PUT)', example: 'idem-550e8400-e29b-41d4' },
  { header: 'Accept', purpose: 'Expected response format', required: 'Recommended', example: 'application/json' },
];

const HTTP_METHODS_TABLE = [
  { method: 'GET', usage: 'Retrieve resources', idempotent: 'Yes', cacheable: 'Yes', rules: 'Never modify state. No request body. Use query params for filtering. Always paginate list responses.' },
  { method: 'POST', usage: 'Create new resources', idempotent: 'No (use idempotency key)', cacheable: 'No', rules: 'Return 201 Created with Location header. Validate request body schema. Support idempotency key.' },
  { method: 'PUT', usage: 'Full resource replacement', idempotent: 'Yes', cacheable: 'No', rules: 'Replace entire resource. Return 200. Client must send complete object. Reject partial updates.' },
  { method: 'PATCH', usage: 'Partial resource update', idempotent: 'Yes', cacheable: 'No', rules: 'Update only provided fields. Return 200. Use JSON Merge Patch (RFC 7396) format.' },
  { method: 'DELETE', usage: 'Remove resources', idempotent: 'Yes', cacheable: 'No', rules: 'Return 204 No Content. Soft-delete preferred (set deleted_at). Cascading rules documented.' },
];

/* ═══════════════════════════════════════════════════
   DATA: Code Guidelines
   ═══════════════════════════════════════════════════ */
const SECURE_CODING_PRACTICES = [
  {
    category: 'Input Validation',
    practices: [
      { name: 'Validate all input server-side', description: 'Never trust client-side validation alone. Use Pydantic schemas with strict type checking for all API inputs.', example: 'class TransferRequest(BaseModel):\n    amount: Decimal = Field(gt=0, le=1000000)\n    to_account: str = Field(regex="^ACC-[0-9]{4}-[0-9]{5}$")' },
      { name: 'Whitelist over blacklist', description: 'Define what IS allowed rather than blocking known bad patterns. Regex allowlists for IDs, names, amounts.', example: 'ACCOUNT_ID_PATTERN = re.compile(r"^ACC-[0-9]{4}-[0-9]{5}$")\nif not ACCOUNT_ID_PATTERN.match(account_id):\n    raise ValidationError("Invalid account ID format")' },
      { name: 'Sanitize file paths', description: 'Resolve paths and verify they stay within allowed directories. Prevent path traversal attacks.', example: 'resolved = Path(user_path).resolve()\nif not str(resolved).startswith(str(ALLOWED_DIR)):\n    raise ValidationError("Path traversal detected")' },
    ],
  },
  {
    category: 'Output Encoding',
    practices: [
      { name: 'Encode output for context', description: 'HTML-encode data inserted into HTML. JSON-encode data in JSON responses. Prevent XSS.', example: 'from markupsafe import escape\nhtml_content = f"<p>Hello, {escape(user_name)}</p>"' },
      { name: 'Use response schemas', description: 'Never return raw database objects. Use Pydantic response_model to explicitly control output fields.', example: '@router.get("/accounts/{id}", response_model=AccountResponse)\ndef get_account(id: str, repo = Depends(get_repo)):\n    return repo.get_by_id(id)' },
    ],
  },
  {
    category: 'Parameterized Queries',
    practices: [
      { name: 'Never use f-strings in SQL', description: 'Always use parameterized queries with ? placeholders. Prevents SQL injection.', example: '# WRONG: f"SELECT * FROM users WHERE id = \'{user_id}\'"\n# RIGHT:\ncursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))' },
      { name: 'Sanitize table/column names', description: 'Dynamic table names must be validated against allowlist. Cannot be parameterized.', example: 'ALLOWED_TABLES = {"users", "accounts", "transactions"}\nif table_name not in ALLOWED_TABLES:\n    raise ValidationError(f"Invalid table: {table_name}")' },
    ],
  },
  {
    category: 'Error Handling',
    practices: [
      { name: 'Catch specific exceptions', description: 'Never use bare except: or except Exception:. Catch specific errors and handle appropriately.', example: 'try:\n    result = external_service.call()\nexcept ConnectionError as e:\n    logger.error("Service unavailable", exc_info=e)\n    raise ExternalServiceError("Service unavailable") from e' },
      { name: 'Never expose internals', description: 'Error responses must not include stack traces, SQL queries, or internal paths in production.', example: '# WRONG: {"error": "sqlite3.OperationalError: no such table: users"}\n# RIGHT: {"detail": "Internal server error", "error_code": "INTERNAL_ERROR"}' },
    ],
  },
  {
    category: 'Least Privilege',
    practices: [
      { name: 'Minimal DB permissions', description: 'Application DB user should only have SELECT, INSERT, UPDATE, DELETE. No DROP, ALTER, or GRANT.', example: 'GRANT SELECT, INSERT, UPDATE, DELETE ON banking.* TO \'app_user\'@\'%\';\n-- Never: GRANT ALL PRIVILEGES' },
      { name: 'Minimal API scopes', description: 'OAuth tokens should have narrowest scope. Separate read and write tokens where possible.', example: 'scopes=["accounts:read"] # Not scopes=["*"]' },
    ],
  },
];

const CODE_REVIEW_CHECKLIST = [
  { id: 1, item: 'No hardcoded secrets (passwords, API keys, tokens)', category: 'Secrets', severity: 'Critical' },
  { id: 2, item: 'No SQL injection vectors (parameterized queries only)', category: 'Injection', severity: 'Critical' },
  { id: 3, item: 'Proper error handling (no bare except, no stack traces in responses)', category: 'Error Handling', severity: 'High' },
  { id: 4, item: 'Input validation on all user-supplied data', category: 'Validation', severity: 'Critical' },
  { id: 5, item: 'Authentication check on all protected endpoints', category: 'Auth', severity: 'Critical' },
  { id: 6, item: 'Authorization check (object-level + function-level)', category: 'Auth', severity: 'Critical' },
  { id: 7, item: 'Logging present (no PII in logs, structured format)', category: 'Logging', severity: 'High' },
  { id: 8, item: 'Rate limiting configured for public/sensitive endpoints', category: 'DoS Protection', severity: 'High' },
  { id: 9, item: 'CORS configured (no wildcard origins)', category: 'Headers', severity: 'Medium' },
  { id: 10, item: 'Security headers set (HSTS, CSP, X-Frame-Options)', category: 'Headers', severity: 'Medium' },
  { id: 11, item: 'TLS enforced (no HTTP fallback)', category: 'Transport', severity: 'Critical' },
  { id: 12, item: 'Dependencies updated (no known CVEs)', category: 'Dependencies', severity: 'High' },
  { id: 13, item: 'No debug code or console.log in production paths', category: 'Hygiene', severity: 'Low' },
  { id: 14, item: 'Test coverage > 80% for changed files', category: 'Testing', severity: 'High' },
  { id: 15, item: 'Documentation updated for API changes', category: 'Docs', severity: 'Low' },
];

const SONARQUBE_SECTIONS = [
  {
    title: 'What SonarQube Checks',
    items: [
      { name: 'Bugs', description: 'Code that is demonstrably wrong or will cause unexpected behavior at runtime.', icon: 'B', color: C.danger },
      { name: 'Vulnerabilities', description: 'Security-sensitive code that could be exploited (SQL injection, XSS, hardcoded credentials).', icon: 'V', color: C.orange },
      { name: 'Code Smells', description: 'Maintainability issues: duplicated code, complex methods, unused variables, long parameter lists.', icon: 'S', color: C.warning },
      { name: 'Coverage', description: 'Percentage of code executed by unit tests. Gate: minimum 80% on new code.', icon: 'C', color: C.success },
      { name: 'Duplications', description: 'Blocks of code repeated across files. Threshold: <3% duplicated lines.', icon: 'D', color: C.purple },
      { name: 'Security Hotspots', description: 'Code that needs manual security review (crypto usage, regex complexity, permission checks).', icon: 'H', color: C.info },
    ],
  },
  {
    title: 'Configuration',
    steps: [
      'Install SonarQube server (Docker: sonarqube:lts-community)',
      'Add sonar-scanner to CI pipeline',
      'Create sonar-project.properties in project root',
      'Configure quality gates: 0 bugs, 0 vulnerabilities, >80% coverage, <3% duplication',
      'Integrate with GitHub PR decoration (status checks)',
      'Set up branch analysis for feature branches',
    ],
  },
  {
    title: 'Sample Quality Gate Metrics',
    metrics: [
      { metric: 'Bugs', value: '0', threshold: '= 0', status: 'Pass' },
      { metric: 'Vulnerabilities', value: '2', threshold: '= 0', status: 'Fail' },
      { metric: 'Code Smells', value: '23', threshold: '< 50', status: 'Pass' },
      { metric: 'Coverage', value: '84.2%', threshold: '> 80%', status: 'Pass' },
      { metric: 'Duplications', value: '1.8%', threshold: '< 3%', status: 'Pass' },
      { metric: 'Security Hotspots Reviewed', value: '100%', threshold: '= 100%', status: 'Pass' },
      { metric: 'Reliability Rating', value: 'A', threshold: '>= A', status: 'Pass' },
      { metric: 'Security Rating', value: 'B', threshold: '>= A', status: 'Fail' },
    ],
  },
];

const TOOLS_COMPARISON = [
  { tool: 'SonarQube', type: 'SAST + Quality', languages: 'Java, Python, JS, TS, Go, C#, 25+', pricing: 'Community (Free) / Enterprise (Paid)', strengths: 'Most comprehensive. Quality gates. PR decoration. Historical trends.', weaknesses: 'Heavy resource usage. Complex setup. Enterprise features locked.' },
  { tool: 'ESLint', type: 'Linter', languages: 'JavaScript, TypeScript', pricing: 'Free (Open Source)', strengths: 'Fast. Extensive plugin ecosystem. Auto-fixable rules. IDE integration.', weaknesses: 'JS/TS only. No security-focused rules by default (need plugin).' },
  { tool: 'Semgrep', type: 'SAST', languages: 'Python, JS, Go, Java, Ruby, 20+', pricing: 'Free (OSS) / Team (Paid)', strengths: 'Fast. Custom rule authoring. Pattern-based matching. Great for security rules.', weaknesses: 'Smaller default rule set than SonarQube. Less code quality focus.' },
  { tool: 'Bandit', type: 'SAST (Security)', languages: 'Python only', pricing: 'Free (Open Source)', strengths: 'Python-specific security checks. Fast. Easy to configure. CI-friendly.', weaknesses: 'Python only. No code quality metrics. Limited to security patterns.' },
  { tool: 'OWASP ZAP', type: 'DAST', languages: 'Any (tests running APIs)', pricing: 'Free (Open Source)', strengths: 'Dynamic testing of live APIs. Finds runtime vulnerabilities. Proxy mode.', weaknesses: 'Requires running application. Slower than SAST. Can produce false positives.' },
  { tool: 'Snyk', type: 'SCA + SAST', languages: 'All major languages', pricing: 'Free tier / Team (Paid)', strengths: 'Dependency vulnerability scanning. Container scanning. License compliance.', weaknesses: 'Limited free tier. Best for dependency scanning, SAST is secondary.' },
  { tool: 'Ruff', type: 'Linter + Formatter', languages: 'Python only', pricing: 'Free (Open Source)', strengths: 'Extremely fast (Rust-based). Replaces flake8, isort, pyupgrade. Auto-fix.', weaknesses: 'Python only. Newer tool, still maturing. No deep security analysis.' },
  { tool: 'Trivy', type: 'SCA + Container', languages: 'All (container/IaC focus)', pricing: 'Free (Open Source)', strengths: 'Container image scanning. IaC scanning. Filesystem scanning. Very fast.', weaknesses: 'Less focus on application code quality. More ops-focused.' },
];

/* ═══════════════════════════════════════════════════
   STYLE HELPERS
   ═══════════════════════════════════════════════════ */
const styles = {
  page: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    color: C.text,
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: `2px solid ${C.border}`,
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: C.text,
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: C.textMuted,
    margin: 0,
  },
  tabBar: {
    display: 'flex',
    gap: '4px',
    borderBottom: `2px solid ${C.border}`,
    marginBottom: '24px',
    overflowX: 'auto',
    paddingBottom: '0',
  },
  tab: (active) => ({
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: active ? '600' : '400',
    color: active ? C.primary : C.textMuted,
    borderBottom: active ? `3px solid ${C.primary}` : '3px solid transparent',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    background: 'none',
    border: 'none',
    borderBottomStyle: 'solid',
    transition: 'all 0.2s',
    marginBottom: '-2px',
  }),
  card: {
    backgroundColor: '#ffffff',
    border: `1px solid ${C.border}`,
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: C.text,
    margin: '0 0 12px 0',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: C.text,
    margin: '0 0 16px 0',
  },
  badge: (color, bg) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    color: color,
    backgroundColor: bg,
  }),
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: `2px solid ${C.border}`,
    backgroundColor: C.greyLight,
    fontWeight: '600',
    color: C.text,
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '10px 12px',
    borderBottom: `1px solid ${C.border}`,
    verticalAlign: 'top',
    lineHeight: '1.5',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  pre: {
    backgroundColor: C.greyLight,
    border: `1px solid ${C.border}`,
    borderRadius: '6px',
    padding: '12px',
    fontSize: '12px',
    fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: '8px 0',
    lineHeight: '1.6',
  },
  flowContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    overflowX: 'auto',
    padding: '16px 0',
    flexWrap: 'wrap',
  },
  flowStep: (type) => {
    const colors = {
      action: { bg: C.primaryLight, color: C.primary, border: C.primary },
      detection: { bg: C.warningLight, color: C.warning, border: C.warning },
      alert: { bg: C.dangerLight, color: C.danger, border: C.danger },
      compliance: { bg: C.successLight, color: C.success, border: C.success },
    };
    const c = colors[type] || colors.action;
    return {
      padding: '8px 14px',
      borderRadius: '6px',
      border: `2px solid ${c.border}`,
      backgroundColor: c.bg,
      color: c.color,
      fontSize: '12px',
      fontWeight: '500',
      minWidth: '120px',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    };
  },
  flowArrow: {
    fontSize: '18px',
    color: C.grey,
    margin: '0 4px',
    flexShrink: 0,
  },
  tag: (color) => ({
    display: 'inline-block',
    padding: '1px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    color: '#ffffff',
    backgroundColor: color,
    marginRight: '4px',
    marginBottom: '4px',
  }),
  metricCard: (color, bg) => ({
    backgroundColor: bg,
    border: `1px solid ${color}33`,
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  }),
  ul: {
    margin: '4px 0',
    paddingLeft: '18px',
    lineHeight: '1.8',
    fontSize: '13px',
  },
  listItem: {
    marginBottom: '4px',
  },
  codeInline: {
    backgroundColor: C.greyLight,
    padding: '1px 6px',
    borderRadius: '3px',
    fontSize: '12px',
    fontFamily: '"Fira Code", Consolas, monospace',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '8px 12px',
    borderBottom: `1px solid ${C.border}`,
  },
  checkbox: (checked) => ({
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: `2px solid ${checked ? C.success : C.border}`,
    backgroundColor: checked ? C.successLight : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: C.success,
    fontWeight: '700',
    flexShrink: 0,
    marginTop: '2px',
  }),
};

/* ═══════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════ */
function StatusBadge({ status }) {
  const map = {
    Implemented: { color: C.success, bg: C.successLight },
    Pending: { color: C.warning, bg: C.warningLight },
    'At Risk': { color: C.danger, bg: C.dangerLight },
    Pass: { color: C.success, bg: C.successLight },
    Fail: { color: C.danger, bg: C.dangerLight },
  };
  const s = map[status] || { color: C.grey, bg: C.greyLight };
  return <span style={styles.badge(s.color, s.bg)}>{status}</span>;
}

function SeverityBadge({ severity }) {
  const map = {
    Critical: C.danger,
    High: C.orange,
    Medium: C.warning,
    Low: C.info,
  };
  const color = map[severity] || C.grey;
  return <span style={styles.tag(color)}>{severity}</span>;
}

function PriorityBadge({ priority }) {
  const map = {
    Critical: { color: C.danger, bg: C.dangerLight },
    High: { color: C.orange, bg: C.orangeLight },
    Medium: { color: C.warning, bg: C.warningLight },
    Low: { color: C.info, bg: C.infoLight },
  };
  const s = map[priority] || { color: C.grey, bg: C.greyLight };
  return <span style={styles.badge(s.color, s.bg)}>{priority}</span>;
}

function FlowChart({ steps }) {
  return (
    <div style={styles.flowContainer}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div style={styles.flowStep(s.type)}>{s.step}</div>
          {i < steps.length - 1 && <span style={styles.flowArrow}>&#8594;</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 1: Security Overview
   ═══════════════════════════════════════════════════ */
function SecurityOverviewTab() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Security Posture Dashboard</h2>

      {/* Posture Cards */}
      <div style={styles.grid4}>
        {POSTURE_CARDS.map((card, i) => (
          <div key={i} style={styles.metricCard(card.color, card.bg)}>
            <div style={{ fontSize: '36px', fontWeight: '800', color: card.color, marginBottom: '4px' }}>{card.value}</div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: card.color }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Security Checklist */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>Security Checklist</h2>
      {SECURITY_CHECKLIST.map((group, gi) => (
        <div key={gi} style={{ ...styles.card, marginBottom: '16px' }}>
          <h3 style={{ ...styles.cardTitle, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '6px',
              backgroundColor: C.primaryLight, color: C.primary, display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px',
            }}>{group.category.charAt(0)}</span>
            {group.category}
          </h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Control</th>
                <th style={{ ...styles.th, width: '100px' }}>Status</th>
                <th style={{ ...styles.th, width: '80px' }}>Priority</th>
                <th style={styles.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((item, ii) => (
                <tr key={ii}>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{item.name}</td>
                  <td style={styles.td}><StatusBadge status={item.status} /></td>
                  <td style={styles.td}><PriorityBadge priority={item.priority} /></td>
                  <td style={{ ...styles.td, color: C.textMuted }}>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 2: Data Protection
   ═══════════════════════════════════════════════════ */
function DataProtectionTab() {
  return (
    <div>
      {/* PII Masking */}
      <h2 style={styles.sectionTitle}>PII Masking Scenarios</h2>
      {PII_MASKING_SCENARIOS.map((scenario, si) => (
        <div key={si} style={styles.card}>
          <h3 style={styles.cardTitle}>{scenario.field}</h3>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '11px', color: C.textMuted, display: 'block' }}>Original</span>
              <span style={{ ...styles.codeInline, color: C.danger }}>{scenario.original}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: C.grey, fontSize: '18px', paddingTop: '10px' }}>&#8594;</div>
            <div>
              <span style={{ fontSize: '11px', color: C.textMuted, display: 'block' }}>Masked</span>
              <span style={{ ...styles.codeInline, color: C.success }}>{scenario.masked}</span>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: C.textMuted, marginBottom: '12px' }}>
            <strong>Rule:</strong> {scenario.rule}
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: '100px' }}>Test ID</th>
                <th style={styles.th}>Test Case</th>
                <th style={styles.th}>Method / Endpoint</th>
                <th style={styles.th}>Expected Result</th>
                <th style={{ ...styles.th, width: '60px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {scenario.tests.map((t, ti) => (
                <tr key={ti}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>{t.id}</td>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{t.name}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>{t.method}</td>
                  <td style={{ ...styles.td, color: C.textMuted }}>{t.expected}</td>
                  <td style={styles.td}><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Encryption at Rest */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>Data Encryption at Rest</h2>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Field</th>
              <th style={styles.th}>Algorithm</th>
              <th style={styles.th}>Key Rotation</th>
              <th style={styles.th}>Storage Details</th>
              <th style={styles.th}>Compliance</th>
            </tr>
          </thead>
          <tbody>
            {ENCRYPTION_AT_REST.map((row, i) => (
              <tr key={i}>
                <td style={{ ...styles.td, fontWeight: '500' }}>{row.field}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>{row.algorithm}</td>
                <td style={styles.td}>{row.keyRotation}</td>
                <td style={{ ...styles.td, color: C.textMuted }}>{row.storage}</td>
                <td style={styles.td}><span style={styles.badge(C.info, C.infoLight)}>{row.compliance}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Encryption in Transit */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>Data Encryption in Transit</h2>
      <div style={styles.card}>
        <div style={styles.grid2}>
          <div style={{ padding: '16px', backgroundColor: C.greyLight, borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>TLS 1.3 Configuration</h4>
            <ul style={styles.ul}>
              <li style={styles.listItem}>Protocol: TLS 1.3 (TLS 1.2 as fallback, TLS 1.0/1.1 disabled)</li>
              <li style={styles.listItem}>Cipher suites: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256</li>
              <li style={styles.listItem}>Perfect Forward Secrecy (PFS) enabled</li>
              <li style={styles.listItem}>Certificate: EV SSL from trusted CA (DigiCert/Let's Encrypt)</li>
              <li style={styles.listItem}>OCSP Stapling enabled for revocation checking</li>
            </ul>
          </div>
          <div style={{ padding: '16px', backgroundColor: C.greyLight, borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>HSTS & Certificate Policies</h4>
            <ul style={styles.ul}>
              <li style={styles.listItem}>HSTS: max-age=31536000; includeSubDomains; preload</li>
              <li style={styles.listItem}>Certificate Pinning for mobile apps (backup pins included)</li>
              <li style={styles.listItem}>CAA DNS record restricting certificate issuance</li>
              <li style={styles.listItem}>Certificate Transparency monitoring enabled</li>
              <li style={styles.listItem}>Auto-renewal: 30 days before expiry via ACME</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Retention */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>Data Retention Policy</h2>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Data Type</th>
              <th style={styles.th}>Retention Period</th>
              <th style={styles.th}>Regulation</th>
              <th style={styles.th}>Purge Method</th>
              <th style={styles.th}>GDPR Erasure</th>
            </tr>
          </thead>
          <tbody>
            {DATA_RETENTION.map((row, i) => (
              <tr key={i}>
                <td style={{ ...styles.td, fontWeight: '500' }}>{row.dataType}</td>
                <td style={styles.td}>{row.retention}</td>
                <td style={styles.td}><span style={styles.badge(C.purple, C.purpleLight)}>{row.regulation}</span></td>
                <td style={{ ...styles.td, color: C.textMuted }}>{row.purgeMethod}</td>
                <td style={{ ...styles.td, color: C.textMuted }}>{row.gdprErasure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Access Control Matrix */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>Access Control Matrix (Role vs Data Access)</h2>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Data Type</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>Admin</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>Manager</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>Teller</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>Customer</th>
            </tr>
          </thead>
          <tbody>
            {ACCESS_CONTROL_MATRIX.map((row, i) => {
              const accessColor = (val) => {
                if (val === 'Full' || val.startsWith('Full')) return { bg: C.successLight, color: C.success };
                if (val === 'None') return { bg: C.dangerLight, color: C.danger };
                if (val.includes('Masked') || val.includes('Last 4')) return { bg: C.warningLight, color: C.warning };
                return { bg: C.infoLight, color: C.info };
              };
              return (
                <tr key={i}>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{row.dataType}</td>
                  {['admin', 'manager', 'teller', 'customer'].map((role) => {
                    const ac = accessColor(row[role]);
                    return (
                      <td key={role} style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={{ ...styles.badge(ac.color, ac.bg), fontSize: '11px' }}>{row[role]}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 3: AML Scenarios
   ═══════════════════════════════════════════════════ */
function AMLScenariosTab() {
  const [expandedScenario, setExpandedScenario] = useState(null);

  return (
    <div>
      <h2 style={styles.sectionTitle}>Anti-Money Laundering Simulation Scenarios</h2>
      <p style={{ fontSize: '13px', color: C.textMuted, marginBottom: '24px', lineHeight: '1.6' }}>
        These scenarios simulate common money laundering patterns used for testing AML detection systems.
        Each scenario includes red flags, detection rules, test data, and compliance actions.
      </p>

      {AML_SCENARIOS.map((scenario, si) => {
        const isExpanded = expandedScenario === si;
        return (
          <div key={si} style={{ ...styles.card, borderLeft: `4px solid ${scenario.severity === 'Critical' ? C.danger : scenario.severity === 'High' ? C.orange : C.warning}` }}>
            {/* Header */}
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setExpandedScenario(isExpanded ? null : si)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: C.textMuted }}>{scenario.id}</span>
                  <SeverityBadge severity={scenario.severity} />
                </div>
                <h3 style={{ ...styles.cardTitle, margin: 0 }}>{scenario.name}</h3>
              </div>
              <span style={{ fontSize: '20px', color: C.textMuted, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>&#9660;</span>
            </div>

            <p style={{ fontSize: '13px', color: C.textMuted, marginTop: '8px', lineHeight: '1.6' }}>{scenario.description}</p>

            {/* Flow Chart (always visible) */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: C.text, marginBottom: '4px' }}>Detection Flow:</div>
              <FlowChart steps={scenario.flowSteps} />
            </div>

            {isExpanded && (
              <div style={{ marginTop: '16px' }}>
                {/* Red Flags */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: C.danger, marginBottom: '6px' }}>Red Flags</h4>
                  <ul style={styles.ul}>
                    {scenario.redFlags.map((flag, fi) => (
                      <li key={fi} style={styles.listItem}>{flag}</li>
                    ))}
                  </ul>
                </div>

                {/* Detection Rules */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: C.warning, marginBottom: '6px' }}>Detection Rules</h4>
                  <ul style={styles.ul}>
                    {scenario.detectionRules.map((rule, ri) => (
                      <li key={ri} style={{ ...styles.listItem, fontFamily: 'monospace', fontSize: '12px' }}>{rule}</li>
                    ))}
                  </ul>
                </div>

                {/* Test Data */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: C.primary, marginBottom: '6px' }}>Test Data (JSON)</h4>
                  <pre style={styles.pre}>{JSON.stringify(scenario.testData, null, 2)}</pre>
                </div>

                {/* Expected Alert & Compliance */}
                <div style={styles.grid2}>
                  <div style={{ padding: '12px', backgroundColor: C.dangerLight, borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: C.danger, marginBottom: '4px' }}>EXPECTED ALERT</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '13px', color: C.danger, fontWeight: '500' }}>{scenario.expectedAlert}</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: C.successLight, borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: C.success, marginBottom: '4px' }}>COMPLIANCE ACTION</div>
                    <div style={{ fontSize: '13px', color: C.success }}>{scenario.complianceAction}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 4: Fraud & Theft
   ═══════════════════════════════════════════════════ */
function FraudTheftTab() {
  const [expandedFraud, setExpandedFraud] = useState(null);

  return (
    <div>
      <h2 style={styles.sectionTitle}>Fraud and Theft Detection Scenarios</h2>
      <p style={{ fontSize: '13px', color: C.textMuted, marginBottom: '24px', lineHeight: '1.6' }}>
        Common banking fraud and theft scenarios with attack vectors, detection methods, prevention controls, test cases, and response procedures.
      </p>

      {FRAUD_SCENARIOS.map((scenario, si) => {
        const isExpanded = expandedFraud === si;
        return (
          <div key={si} style={{ ...styles.card, borderLeft: `4px solid ${scenario.severity === 'Critical' ? C.danger : C.orange}` }}>
            {/* Header */}
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setExpandedFraud(isExpanded ? null : si)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  backgroundColor: scenario.severity === 'Critical' ? C.dangerLight : C.orangeLight,
                  color: scenario.severity === 'Critical' ? C.danger : C.orange,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '13px',
                }}>{scenario.icon}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: C.textMuted }}>{scenario.id}</span>
                    <SeverityBadge severity={scenario.severity} />
                  </div>
                  <h3 style={{ ...styles.cardTitle, margin: 0 }}>{scenario.name}</h3>
                </div>
              </div>
              <span style={{ fontSize: '20px', color: C.textMuted, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>&#9660;</span>
            </div>

            {/* Attack Vector (always visible) */}
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: C.greyLight, borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: C.textMuted, marginBottom: '4px' }}>ATTACK VECTOR</div>
              <div style={{ fontSize: '13px', color: C.text, lineHeight: '1.6' }}>{scenario.attackVector}</div>
            </div>

            {isExpanded && (
              <div style={{ marginTop: '16px' }}>
                {/* Detection Methods */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: C.warning, marginBottom: '6px' }}>Detection Methods</h4>
                  <ul style={styles.ul}>
                    {scenario.detectionMethods.map((method, mi) => (
                      <li key={mi} style={styles.listItem}>{method}</li>
                    ))}
                  </ul>
                </div>

                {/* Prevention Controls */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: C.success, marginBottom: '6px' }}>Prevention Controls</h4>
                  <ul style={styles.ul}>
                    {scenario.preventionControls.map((ctrl, ci) => (
                      <li key={ci} style={styles.listItem}>{ctrl}</li>
                    ))}
                  </ul>
                </div>

                {/* Test Case */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: C.primary, marginBottom: '6px' }}>Test Case</h4>
                  <div style={{ padding: '12px', backgroundColor: C.primaryLight, borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: C.primary, marginBottom: '4px' }}>{scenario.testCase.id}: {scenario.testCase.scenario}</div>
                    <div style={{ fontSize: '12px', marginTop: '8px' }}>
                      <strong>Input:</strong>
                      <pre style={{ ...styles.pre, margin: '4px 0' }}>{JSON.stringify(scenario.testCase.input, null, 2)}</pre>
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      <strong>Expected:</strong> {scenario.testCase.expected}
                    </div>
                  </div>
                </div>

                {/* Response Procedure Flow */}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: C.text, marginBottom: '6px' }}>Response Procedure</h4>
                  <FlowChart steps={scenario.responseProcedure} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 5: API Security Audit
   ═══════════════════════════════════════════════════ */
function APISecurityTab() {
  const [expandedItem, setExpandedItem] = useState(null);

  return (
    <div>
      <h2 style={styles.sectionTitle}>OWASP API Security Top 10</h2>
      <p style={{ fontSize: '13px', color: C.textMuted, marginBottom: '24px', lineHeight: '1.6' }}>
        The OWASP API Security Top 10 identifies the most critical security risks to APIs.
        Each entry includes a description, example attack, test case, and remediation guidance.
      </p>

      {OWASP_API_TOP_10.map((item, i) => {
        const isExpanded = expandedItem === i;
        return (
          <div key={i} style={{ ...styles.card, cursor: 'pointer' }} onClick={() => setExpandedItem(isExpanded ? null : i)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  backgroundColor: C.primaryLight, color: C.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '14px',
                }}>{item.rank}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ ...styles.cardTitle, margin: 0 }}>{item.name}</h3>
                    <SeverityBadge severity={item.severity} />
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '20px', color: C.textMuted, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>&#9660;</span>
            </div>
            <p style={{ fontSize: '13px', color: C.textMuted, margin: '8px 0 0 44px', lineHeight: '1.6' }}>{item.description}</p>

            {isExpanded && (
              <div style={{ marginTop: '16px', marginLeft: '44px' }}>
                <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: C.dangerLight, borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: C.danger, marginBottom: '4px' }}>EXAMPLE ATTACK</div>
                  <div style={{ fontSize: '13px', color: C.danger, lineHeight: '1.5' }}>{item.exampleAttack}</div>
                </div>
                <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: C.primaryLight, borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: C.primary, marginBottom: '4px' }}>TEST CASE</div>
                  <div style={{ fontSize: '13px', color: C.primary, lineHeight: '1.5' }}>{item.testCase}</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: C.successLight, borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: C.success, marginBottom: '4px' }}>REMEDIATION</div>
                  <div style={{ fontSize: '13px', color: C.success, lineHeight: '1.5' }}>{item.remediation}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* API Headers Table */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>API Monitoring Attributes - Headers</h2>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Header</th>
              <th style={styles.th}>Purpose</th>
              <th style={{ ...styles.th, width: '120px' }}>Required</th>
              <th style={styles.th}>Example Value</th>
            </tr>
          </thead>
          <tbody>
            {API_HEADERS_TABLE.map((row, i) => (
              <tr key={i}>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px', fontWeight: '500' }}>{row.header}</td>
                <td style={{ ...styles.td, color: C.textMuted }}>{row.purpose}</td>
                <td style={styles.td}>
                  <span style={styles.badge(
                    row.required.startsWith('Yes') ? C.danger : row.required === 'Recommended' ? C.warning : C.info,
                    row.required.startsWith('Yes') ? C.dangerLight : row.required === 'Recommended' ? C.warningLight : C.infoLight
                  )}>{row.required}</span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{row.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HTTP Methods Table */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>HTTP Methods Usage Rules</h2>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: '80px' }}>Method</th>
              <th style={styles.th}>Usage</th>
              <th style={{ ...styles.th, width: '80px', textAlign: 'center' }}>Idempotent</th>
              <th style={{ ...styles.th, width: '80px', textAlign: 'center' }}>Cacheable</th>
              <th style={styles.th}>Rules</th>
            </tr>
          </thead>
          <tbody>
            {HTTP_METHODS_TABLE.map((row, i) => {
              const methodColors = {
                GET: C.success, POST: C.primary, PUT: C.warning, PATCH: C.purple, DELETE: C.danger,
              };
              return (
                <tr key={i}>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.tag(methodColors[row.method] || C.grey),
                      fontSize: '12px', fontWeight: '700', fontFamily: 'monospace',
                    }}>{row.method}</span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{row.usage}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <span style={styles.badge(
                      row.idempotent === 'Yes' ? C.success : C.warning,
                      row.idempotent === 'Yes' ? C.successLight : C.warningLight
                    )}>{row.idempotent}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <span style={styles.badge(
                      row.cacheable === 'Yes' ? C.success : C.grey,
                      row.cacheable === 'Yes' ? C.successLight : C.greyLight
                    )}>{row.cacheable}</span>
                  </td>
                  <td style={{ ...styles.td, color: C.textMuted, fontSize: '12px' }}>{row.rules}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 6: Code Guidelines & Audit
   ═══════════════════════════════════════════════════ */
function CodeGuidelinesTab() {
  return (
    <div>
      {/* Secure Coding Practices */}
      <h2 style={styles.sectionTitle}>Secure Coding Practices</h2>
      {SECURE_CODING_PRACTICES.map((group, gi) => (
        <div key={gi} style={styles.card}>
          <h3 style={{ ...styles.cardTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '24px', height: '24px', borderRadius: '4px',
              backgroundColor: C.primaryLight, color: C.primary,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '12px',
            }}>{group.category.charAt(0)}</span>
            {group.category}
          </h3>
          {group.practices.map((practice, pi) => (
            <div key={pi} style={{ marginBottom: '16px', paddingLeft: '16px', borderLeft: `3px solid ${C.border}` }}>
              <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>{practice.name}</div>
              <div style={{ fontSize: '12px', color: C.textMuted, marginBottom: '6px', lineHeight: '1.5' }}>{practice.description}</div>
              <pre style={styles.pre}>{practice.example}</pre>
            </div>
          ))}
        </div>
      ))}

      {/* Code Review Checklist */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>Code Review Security Checklist</h2>
      <div style={styles.card}>
        {CODE_REVIEW_CHECKLIST.map((item, i) => (
          <div key={i} style={styles.checkboxRow}>
            <div style={styles.checkbox(true)}>&#10003;</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '500' }}>{item.item}</div>
              <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>
                <span style={styles.badge(C.grey, C.greyLight)}>{item.category}</span>
                <span style={{ marginLeft: '6px' }}><SeverityBadge severity={item.severity} /></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SonarQube Integration */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>SonarQube Integration</h2>
      {SONARQUBE_SECTIONS.map((section, si) => (
        <div key={si} style={styles.card}>
          <h3 style={styles.cardTitle}>{section.title}</h3>

          {/* What it checks */}
          {section.items && (
            <div style={styles.grid2}>
              {section.items.map((item, ii) => (
                <div key={ii} style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: C.greyLight, borderRadius: '6px' }}>
                  <span style={{
                    width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                    backgroundColor: item.color + '20', color: item.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '15px',
                  }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '13px', color: item.color }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '2px', lineHeight: '1.5' }}>{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Configuration steps */}
          {section.steps && (
            <ol style={{ ...styles.ul, paddingLeft: '20px' }}>
              {section.steps.map((step, sti) => (
                <li key={sti} style={{ ...styles.listItem, padding: '4px 0' }}>{step}</li>
              ))}
            </ol>
          )}

          {/* Quality Gate Metrics */}
          {section.metrics && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Metric</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Value</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Threshold</th>
                  <th style={{ ...styles.th, textAlign: 'center', width: '80px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {section.metrics.map((m, mi) => (
                  <tr key={mi}>
                    <td style={{ ...styles.td, fontWeight: '500' }}>{m.metric}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontFamily: 'monospace', fontWeight: '600' }}>{m.value}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontFamily: 'monospace', color: C.textMuted }}>{m.threshold}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}><StatusBadge status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}

      {/* Open Source Alternatives */}
      <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>Open Source Security Tools Comparison</h2>
      <div style={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tool</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Languages</th>
                <th style={styles.th}>Pricing</th>
                <th style={styles.th}>Strengths</th>
                <th style={styles.th}>Weaknesses</th>
              </tr>
            </thead>
            <tbody>
              {TOOLS_COMPARISON.map((tool, i) => (
                <tr key={i}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{tool.tool}</td>
                  <td style={styles.td}><span style={styles.badge(C.primary, C.primaryLight)}>{tool.type}</span></td>
                  <td style={{ ...styles.td, fontSize: '12px', color: C.textMuted }}>{tool.languages}</td>
                  <td style={{ ...styles.td, fontSize: '12px' }}>{tool.pricing}</td>
                  <td style={{ ...styles.td, fontSize: '12px', color: C.success }}>{tool.strengths}</td>
                  <td style={{ ...styles.td, fontSize: '12px', color: C.danger }}>{tool.weaknesses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function SecurityScenarios() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <SecurityOverviewTab />;
      case 'dataProtection': return <DataProtectionTab />;
      case 'aml': return <AMLScenariosTab />;
      case 'fraudTheft': return <FraudTheftTab />;
      case 'apiSecurity': return <APISecurityTab />;
      case 'codeGuidelines': return <CodeGuidelinesTab />;
      default: return <SecurityOverviewTab />;
    }
  };

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Banking Security Scenarios</h1>
        <p style={styles.subtitle}>
          Comprehensive security testing reference covering personal information security, data protection,
          anti-money laundering, fraud detection, API security, and secure coding guidelines.
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={styles.tab(activeTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTab()}
    </div>
  );
}

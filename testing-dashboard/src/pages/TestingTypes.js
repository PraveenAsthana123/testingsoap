import React, { useState, useEffect, useRef } from 'react';

/* ================================================================
   Banking QA Testing Dashboard — Testing Types
   7 Tabs: Smoke, Integration, Performance, Load,
           Blackbox, Positive, Negative
   ================================================================ */

// ─── Color Tokens ───
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
  text: '#ffffff',
  textMuted: '#a0b4c8',
  border: '#1e5a8a',
  inputBg: '#0a2a4a',
  pass: '#2ecc71',
  fail: '#e74c3c',
  pending: '#f39c12',
};

const priorityColors = { P0: C.red, P1: C.orange, P2: C.blue };
const statusColors = { Pass: C.pass, Fail: C.fail, Pending: C.pending };

// ─── Tab Definitions ───
const TABS = [
  { id: 'smoke', label: 'Smoke Testing', icon: 'S' },
  { id: 'integration', label: 'Integration Testing', icon: 'I' },
  { id: 'performance', label: 'Performance Testing', icon: 'P' },
  { id: 'load', label: 'Load Testing', icon: 'L' },
  { id: 'blackbox', label: 'Blackbox Testing', icon: 'B' },
  { id: 'positive', label: 'Positive Testing', icon: '+' },
  { id: 'negative', label: 'Negative Testing', icon: '-' },
];

// ═══════════════════════════════════════════════
//  SCENARIO DATA — ALL 7 TYPES
// ═══════════════════════════════════════════════

const SMOKE_SCENARIOS = [
  { id: 'SMK-001', name: 'Login Page Loads', priority: 'P0', status: 'Pass', category: 'Authentication',
    steps: ['1. Open browser', '2. Navigate to bank URL', '3. Verify login form renders', '4. Check username/password fields present', '5. Verify Submit button enabled'],
    testData: { url: 'https://netbanking.example.com/login', browser: 'Chrome 120', expected: 'HTTP 200' },
    expected: 'Login page loads within 3s with all form elements', actual: 'Page loaded in 1.2s, all elements present', time: '1.2s' },
  { id: 'SMK-002', name: 'Dashboard Renders After Login', priority: 'P0', status: 'Pass', category: 'Navigation',
    steps: ['1. Login with valid credentials', '2. Wait for redirect', '3. Verify dashboard components render', '4. Check account summary widget', '5. Verify quick links section'],
    testData: { username: 'testuser01', password: '****', role: 'customer' },
    expected: 'Dashboard loads with account summary and quick links', actual: 'Dashboard rendered in 2.1s with all widgets', time: '2.1s' },
  { id: 'SMK-003', name: 'Account Balance Displays', priority: 'P0', status: 'Pass', category: 'Accounts',
    steps: ['1. Navigate to Accounts section', '2. Select savings account', '3. Verify balance displayed', '4. Check currency format (INR)', '5. Verify last updated timestamp'],
    testData: { accountNo: '1234567890', accountType: 'Savings', currency: 'INR' },
    expected: 'Balance shown in INR format with 2 decimal places', actual: 'Balance: INR 45,230.50 displayed correctly', time: '0.8s' },
  { id: 'SMK-004', name: 'Fund Transfer Form Works', priority: 'P0', status: 'Pass', category: 'Transfers',
    steps: ['1. Click Fund Transfer menu', '2. Verify form loads', '3. Check beneficiary dropdown populated', '4. Verify amount field accepts input', '5. Check transfer mode options (NEFT/RTGS/IMPS)'],
    testData: { fromAccount: '1234567890', transferModes: ['NEFT', 'RTGS', 'IMPS'] },
    expected: 'Transfer form renders with all fields and dropdowns', actual: 'Form loaded with 5 beneficiaries in dropdown', time: '1.5s' },
  { id: 'SMK-005', name: 'Bill Payment Page Loads', priority: 'P1', status: 'Pass', category: 'Payments',
    steps: ['1. Navigate to Bill Payments', '2. Verify biller categories shown', '3. Check search functionality', '4. Verify recent billers section', '5. Check Add Biller button'],
    testData: { categories: ['Electricity', 'Water', 'Gas', 'Telecom', 'Insurance'] },
    expected: 'Bill payment page with biller categories and search', actual: 'Page loaded with 5 categories, search functional', time: '1.3s' },
  { id: 'SMK-006', name: 'Loan Calculator Works', priority: 'P1', status: 'Pass', category: 'Loans',
    steps: ['1. Open Loan Calculator', '2. Enter loan amount', '3. Select tenure', '4. Verify EMI calculation', '5. Check amortization schedule link'],
    testData: { loanAmount: 500000, tenure: '60 months', interestRate: '8.5%' },
    expected: 'EMI calculated and displayed with breakdown', actual: 'EMI: INR 10,247 calculated correctly', time: '0.5s' },
  { id: 'SMK-007', name: 'Card Management Loads', priority: 'P1', status: 'Pass', category: 'Cards',
    steps: ['1. Navigate to Cards section', '2. Verify card list displays', '3. Check card details (masked number)', '4. Verify action buttons (Block/Unblock)', '5. Check credit limit display'],
    testData: { cardType: 'Credit Card', lastFour: '4532', status: 'Active' },
    expected: 'Card management page with masked card details', actual: 'Card ending 4532 displayed with all actions', time: '1.1s' },
  { id: 'SMK-008', name: 'Beneficiary List Displays', priority: 'P1', status: 'Pass', category: 'Transfers',
    steps: ['1. Go to Manage Beneficiaries', '2. Verify list loads', '3. Check beneficiary details visible', '4. Verify Add/Edit/Delete buttons', '5. Check IFSC validation status'],
    testData: { totalBeneficiaries: 5, verified: 4, pending: 1 },
    expected: 'Beneficiary list with verified status indicators', actual: '5 beneficiaries listed, 4 verified, 1 pending', time: '0.9s' },
  { id: 'SMK-009', name: 'Transaction History Loads', priority: 'P0', status: 'Pass', category: 'Accounts',
    steps: ['1. Click Transaction History', '2. Verify default date range (30 days)', '3. Check transactions list renders', '4. Verify pagination works', '5. Check download statement button'],
    testData: { dateRange: 'Last 30 days', accountNo: '1234567890', format: 'Table' },
    expected: 'Transaction list with date filter and pagination', actual: '47 transactions loaded with pagination', time: '1.8s' },
  { id: 'SMK-010', name: 'Profile Page Renders', priority: 'P1', status: 'Pass', category: 'Profile',
    steps: ['1. Click Profile icon', '2. Verify personal details displayed', '3. Check contact info section', '4. Verify KYC status shown', '5. Check Edit Profile button'],
    testData: { userId: 'USR001', kycStatus: 'Verified', lastLogin: '2024-01-15 10:30' },
    expected: 'Profile page with personal and KYC details', actual: 'Profile rendered with all sections visible', time: '0.7s' },
  { id: 'SMK-011', name: 'Logout Works', priority: 'P0', status: 'Pass', category: 'Authentication',
    steps: ['1. Click Logout button', '2. Verify confirmation dialog', '3. Confirm logout', '4. Verify redirect to login page', '5. Check session destroyed'],
    testData: { sessionId: 'SES123456', tokenExpiry: '30 min' },
    expected: 'User logged out and redirected to login page', actual: 'Logout successful, session terminated', time: '0.3s' },
  { id: 'SMK-012', name: 'Session Timeout', priority: 'P0', status: 'Pass', category: 'Security',
    steps: ['1. Login to application', '2. Wait for 15 minutes (idle)', '3. Verify timeout warning dialog', '4. Check auto-logout after 2 min warning', '5. Verify redirect to login'],
    testData: { idleTimeout: '15 min', warningBefore: '2 min', action: 'Auto-logout' },
    expected: 'Session timeout after 15 min idle with 2 min warning', actual: 'Warning at 13 min, logout at 15 min', time: '15m' },
  { id: 'SMK-013', name: 'API Health Check', priority: 'P0', status: 'Pass', category: 'Infrastructure',
    steps: ['1. Call /api/health endpoint', '2. Verify HTTP 200 response', '3. Check response body has status', '4. Verify DB connectivity in response', '5. Check response time < 500ms'],
    testData: { endpoint: '/api/health', method: 'GET', expectedStatus: 200 },
    expected: 'Health endpoint returns 200 with all services UP', actual: '{"status":"UP","db":"connected","cache":"active"}', time: '0.1s' },
  { id: 'SMK-014', name: 'DB Connectivity', priority: 'P0', status: 'Pass', category: 'Infrastructure',
    steps: ['1. Execute simple SELECT query', '2. Verify response received', '3. Check connection pool status', '4. Verify query execution time', '5. Check connection count'],
    testData: { query: 'SELECT 1', dbType: 'Oracle', poolSize: 10 },
    expected: 'Database responds within 100ms', actual: 'Query executed in 12ms, pool 8/10 active', time: '0.01s' },
  { id: 'SMK-015', name: 'Menu Navigation', priority: 'P1', status: 'Fail', category: 'Navigation',
    steps: ['1. Click each main menu item', '2. Verify page loads for each', '3. Check breadcrumb updates', '4. Verify active menu highlight', '5. Check submenu expansion'],
    testData: { menuItems: 8, subMenus: 12, totalLinks: 20 },
    expected: 'All 20 menu links navigate correctly', actual: 'Cards submenu link returns 404', time: '3.5s' },
];

const INTEGRATION_SCENARIOS = [
  { id: 'INT-001', name: 'Login -> Dashboard Data Load', priority: 'P0', status: 'Pass', category: 'Auth Flow',
    steps: ['1. Submit login credentials via API', '2. Verify JWT token received', '3. Call dashboard API with token', '4. Verify account summary data loads', '5. Check recent transactions populated', '6. Verify notification count updated'],
    testData: { username: 'testuser01', authType: 'JWT', dashboardAPIs: ['/api/summary', '/api/transactions', '/api/notifications'] },
    expected: 'Post-login: dashboard loads all widgets with real-time data', actual: 'All 3 dashboard APIs responded within 2s', time: '2.8s' },
  { id: 'INT-002', name: 'Fund Transfer -> Balance Update -> Txn History', priority: 'P0', status: 'Pass', category: 'Transfers',
    steps: ['1. Initiate fund transfer (NEFT)', '2. Verify OTP sent to mobile', '3. Submit OTP for authentication', '4. Verify debit from source account', '5. Check balance updated in real-time', '6. Verify transaction appears in history', '7. Check beneficiary account credited'],
    testData: { fromAcc: '1234567890', toAcc: '9876543210', amount: 5000, mode: 'NEFT', otp: '123456' },
    expected: 'Amount debited, balance updated, transaction recorded', actual: 'Transfer completed, balance updated within 30s', time: '4.2s' },
  { id: 'INT-003', name: 'Bill Payment -> Deduction -> Receipt', priority: 'P0', status: 'Pass', category: 'Payments',
    steps: ['1. Select biller (Electricity)', '2. Enter consumer number', '3. Fetch bill amount from biller API', '4. Confirm payment', '5. Verify account debited', '6. Check receipt generated with transaction ID', '7. Verify biller confirmation received'],
    testData: { biller: 'State Electricity Board', consumerNo: 'EL123456', billAmount: 2350, paymentMode: 'Account Debit' },
    expected: 'Bill paid, account debited, receipt with ref number generated', actual: 'Payment successful, receipt REF-2024-001 generated', time: '3.5s' },
  { id: 'INT-004', name: 'Loan Application -> Credit Check -> Approval', priority: 'P0', status: 'Fail', category: 'Loans',
    steps: ['1. Fill loan application form', '2. Submit for processing', '3. System triggers credit bureau check', '4. CIBIL score fetched via API', '5. Loan eligibility calculated', '6. Approval/rejection decision generated', '7. Notification sent to applicant'],
    testData: { loanType: 'Personal Loan', amount: 500000, tenure: '36 months', cibilScore: 750, income: 80000 },
    expected: 'Loan approved based on CIBIL score and income criteria', actual: 'Credit bureau API timeout after 30s', time: '35.2s' },
  { id: 'INT-005', name: 'Card Activation -> Management Update', priority: 'P1', status: 'Pass', category: 'Cards',
    steps: ['1. Enter new card details', '2. Verify card number with issuer', '3. Set PIN via secure channel', '4. Activate card in core banking', '5. Update card status in management portal', '6. Send activation SMS'],
    testData: { cardNo: '****-****-****-4532', cardType: 'Debit', issuer: 'VISA', activationMode: 'Online' },
    expected: 'Card activated and reflected in card management portal', actual: 'Card activated, SMS sent within 5s', time: '6.1s' },
  { id: 'INT-006', name: 'KYC Verification -> Account Activation', priority: 'P0', status: 'Pass', category: 'Onboarding',
    steps: ['1. Upload KYC documents (Aadhaar/PAN)', '2. OCR extraction triggered', '3. Data matched with government DB', '4. eKYC verification response received', '5. Account status changed to Active', '6. Welcome kit email triggered'],
    testData: { docType: 'Aadhaar', aadhaarNo: '****-****-1234', panNo: 'ABCDE1234F', verificationAPI: 'DigiLocker' },
    expected: 'KYC verified via DigiLocker, account activated', actual: 'eKYC verified in 8s, account activated', time: '12.3s' },
  { id: 'INT-007', name: 'NEFT/RTGS -> Core Banking -> Confirmation', priority: 'P0', status: 'Pass', category: 'Transfers',
    steps: ['1. Submit NEFT transfer request', '2. Request queued in CBS', '3. Batch processed by RBI gateway', '4. Settlement confirmation received', '5. Beneficiary bank acknowledgment', '6. Transaction status updated', '7. SMS/Email notification sent'],
    testData: { mode: 'NEFT', batch: 'Half-hourly', settlementTime: '2 hours', rbiGateway: 'SFMS' },
    expected: 'NEFT settled via RBI gateway with confirmation', actual: 'Settlement confirmed in batch cycle', time: '8.5s' },
  { id: 'INT-008', name: 'Mobile OTP -> Transaction Auth', priority: 'P0', status: 'Pass', category: 'Security',
    steps: ['1. User initiates high-value transaction', '2. OTP generation triggered', '3. OTP sent via SMS gateway', '4. User enters OTP in app', '5. OTP validated against server', '6. Transaction authorized and processed'],
    testData: { txnAmount: 50000, otpLength: 6, otpExpiry: '5 min', smsGateway: 'Twilio', hashVerification: true },
    expected: 'OTP sent, validated, and transaction authorized', actual: 'OTP delivered in 3s, validated successfully', time: '5.8s' },
  { id: 'INT-009', name: 'Statement Generation -> PDF Download', priority: 'P1', status: 'Pass', category: 'Reports',
    steps: ['1. Select account and date range', '2. Request statement generation', '3. Backend queries transaction DB', '4. PDF generated with bank template', '5. Digital signature applied', '6. PDF available for download', '7. Email copy sent if opted'],
    testData: { dateFrom: '2024-01-01', dateTo: '2024-01-31', format: 'PDF', accountNo: '1234567890' },
    expected: 'PDF statement generated with digital signature', actual: 'PDF generated (245KB), 47 transactions included', time: '4.7s' },
  { id: 'INT-010', name: 'Account Closure -> Settlement -> Final Statement', priority: 'P1', status: 'Pass', category: 'Accounts',
    steps: ['1. Initiate account closure request', '2. Check for pending transactions', '3. Calculate interest till date', '4. Process final settlement', '5. Generate final statement', '6. Transfer balance to nominated account', '7. Mark account as closed in CBS'],
    testData: { accountNo: '9876543210', balance: 15430.75, pendingTxn: 0, interestDue: 125.50, nominatedAcc: '1234567890' },
    expected: 'Account closed, balance settled, final statement generated', actual: 'Settlement of INR 15,556.25 processed', time: '7.3s' },
  { id: 'INT-011', name: 'Beneficiary Add -> Verification -> Transfer', priority: 'P0', status: 'Pass', category: 'Transfers',
    steps: ['1. Add new beneficiary details', '2. IFSC code validated via RBI API', '3. Penny drop verification initiated', '4. INR 1 credited and verified', '5. Beneficiary marked as verified', '6. First transfer enabled after cooling period'],
    testData: { benefName: 'John Doe', ifsc: 'SBIN0001234', accNo: '30201234567', bankName: 'SBI', coolingPeriod: '30 min' },
    expected: 'Beneficiary added, penny-drop verified, transfer enabled', actual: 'Penny drop successful, beneficiary active', time: '45.0s' },
  { id: 'INT-012', name: 'Fixed Deposit -> Interest Calc -> Maturity', priority: 'P1', status: 'Pass', category: 'Deposits',
    steps: ['1. Create FD with principal amount', '2. Interest rate fetched from rate master', '3. Maturity value calculated', '4. TDS computation if applicable', '5. FD certificate generated', '6. Auto-renewal instruction set'],
    testData: { principal: 100000, tenure: '12 months', rate: '7.1%', tds: 'Applicable', maturityValue: 107100 },
    expected: 'FD created with correct interest and TDS calculation', actual: 'FD created, maturity INR 1,07,100, TDS INR 710', time: '3.2s' },
  { id: 'INT-013', name: 'Standing Instruction -> Auto Debit -> Notification', priority: 'P1', status: 'Fail', category: 'Payments',
    steps: ['1. Set up standing instruction', '2. Define frequency and amount', '3. On trigger date, auto-debit initiated', '4. Sufficient balance check', '5. Amount debited from account', '6. Beneficiary credited', '7. SMS notification sent'],
    testData: { siType: 'Monthly', amount: 5000, frequency: '1st of month', beneficiary: 'LIC Premium', startDate: '2024-02-01' },
    expected: 'Auto-debit executed and notification sent on trigger date', actual: 'Auto-debit failed: insufficient balance not handled', time: '2.1s' },
  { id: 'INT-014', name: 'Cheque Book Request -> Inventory -> Dispatch', priority: 'P2', status: 'Pass', category: 'Services',
    steps: ['1. Submit cheque book request online', '2. Request logged in CBS', '3. Cheque inventory allocated', '4. Cheque series generated', '5. Dispatch initiated via courier', '6. Tracking number sent via SMS'],
    testData: { leaves: 25, accountNo: '1234567890', dispatchMode: 'Courier', estimatedDelivery: '5-7 days' },
    expected: 'Cheque book ordered, tracking details shared', actual: 'Order placed, AWB: CRR123456789', time: '1.5s' },
  { id: 'INT-015', name: 'Insurance Linkage -> Premium -> Policy Update', priority: 'P2', status: 'Pending', category: 'Insurance',
    steps: ['1. Link insurance policy to bank account', '2. Verify policy details with insurer API', '3. Set up auto-premium deduction', '4. First premium deducted', '5. Policy status updated', '6. Confirmation sent to customer'],
    testData: { insurer: 'LIC', policyNo: 'POL123456', premium: 12500, frequency: 'Quarterly', linkedAcc: '1234567890' },
    expected: 'Policy linked, premium auto-deduction set up', actual: 'Pending: Insurer API integration in progress', time: '-' },
];

const PERFORMANCE_SCENARIOS = [
  { id: 'PRF-001', name: 'Login Response Time < 2s', priority: 'P0', status: 'Pass', category: 'Response Time',
    steps: ['1. Send POST /api/auth/login', '2. Measure TTFB (Time to First Byte)', '3. Measure total response time', '4. Verify response under 2 seconds', '5. Record p50, p95, p99 latencies'],
    testData: { endpoint: 'POST /api/auth/login', threshold: '2000ms', iterations: 100, concurrency: 1 },
    expected: 'p95 response time < 2000ms', actual: 'p50: 450ms, p95: 1200ms, p99: 1800ms', time: '1.2s' },
  { id: 'PRF-002', name: 'Dashboard Load Time < 3s', priority: 'P0', status: 'Pass', category: 'Response Time',
    steps: ['1. Authenticate and get token', '2. Call all dashboard APIs in parallel', '3. Measure aggregate load time', '4. Check individual widget load times', '5. Verify FCP and LCP metrics'],
    testData: { apis: ['/summary', '/transactions', '/notifications'], threshold: '3000ms', metric: 'LCP' },
    expected: 'Dashboard fully loaded within 3s (LCP < 3000ms)', actual: 'FCP: 800ms, LCP: 2100ms, Total: 2.4s', time: '2.4s' },
  { id: 'PRF-003', name: 'Fund Transfer API < 1s', priority: 'P0', status: 'Pass', category: 'Response Time',
    steps: ['1. Prepare transfer payload', '2. Send POST /api/transfers', '3. Measure end-to-end response', '4. Include OTP validation time', '5. Verify p99 under 1000ms'],
    testData: { endpoint: 'POST /api/transfers', threshold: '1000ms', payload: '{ amount: 5000, mode: "IMPS" }' },
    expected: 'Transfer API responds within 1000ms at p99', actual: 'p50: 320ms, p95: 680ms, p99: 920ms', time: '0.9s' },
  { id: 'PRF-004', name: 'Account Statement Generation < 5s', priority: 'P1', status: 'Fail', category: 'Response Time',
    steps: ['1. Request 12-month statement', '2. Backend queries all transactions', '3. PDF generation triggered', '4. Digital signature applied', '5. Response with download URL'],
    testData: { period: '12 months', transactions: 580, format: 'PDF', threshold: '5000ms' },
    expected: 'Statement PDF generated within 5s for 580 txns', actual: 'PDF generation took 7.2s for 580 transactions', time: '7.2s' },
  { id: 'PRF-005', name: 'Concurrent User Login (100 users)', priority: 'P0', status: 'Pass', category: 'Concurrency',
    steps: ['1. Spin up 100 virtual users', '2. All users login simultaneously', '3. Measure success rate', '4. Check average response time', '5. Monitor error rate'],
    testData: { users: 100, rampUp: '10s', duration: '60s', tool: 'JMeter' },
    expected: '100% success rate, avg response < 3s', actual: 'Success: 100%, Avg: 1.8s, Max: 4.2s', time: '60s' },
  { id: 'PRF-006', name: 'Database Query Performance', priority: 'P0', status: 'Pass', category: 'Database',
    steps: ['1. Execute top 10 critical queries', '2. Measure execution time for each', '3. Check query execution plans', '4. Verify index usage', '5. Monitor connection pool'],
    testData: { queries: 10, avgThreshold: '100ms', dbType: 'Oracle 19c', connectionPool: 50 },
    expected: 'All critical queries execute under 100ms', actual: 'Avg: 45ms, Max: 92ms, Index hit rate: 98%', time: '0.09s' },
  { id: 'PRF-007', name: 'API Response Under Load', priority: 'P0', status: 'Pass', category: 'Throughput',
    steps: ['1. Simulate 50 concurrent API calls', '2. Mix of GET and POST requests', '3. Measure throughput (req/sec)', '4. Check response time degradation', '5. Monitor server resources'],
    testData: { concurrency: 50, duration: '5 min', endpoints: 8, tool: 'k6' },
    expected: 'Throughput > 200 req/s with < 20% degradation', actual: 'Throughput: 285 req/s, degradation: 12%', time: '5m' },
  { id: 'PRF-008', name: 'Page Rendering Metrics', priority: 'P1', status: 'Pass', category: 'Frontend',
    steps: ['1. Load key pages using Lighthouse', '2. Measure FCP, LCP, CLS, FID', '3. Check performance score', '4. Verify bundle size', '5. Check image optimization'],
    testData: { tool: 'Lighthouse', pages: ['Login', 'Dashboard', 'Transfer', 'Statement'], target: 'Score > 90' },
    expected: 'Lighthouse performance score > 90 for all pages', actual: 'Login: 95, Dashboard: 88, Transfer: 92, Statement: 91', time: '30s' },
  { id: 'PRF-009', name: 'Memory Usage Monitoring', priority: 'P1', status: 'Pass', category: 'Resources',
    steps: ['1. Start application with baseline memory', '2. Simulate 2 hours of typical usage', '3. Monitor heap size over time', '4. Check for memory leaks', '5. Verify GC patterns'],
    testData: { baselineMemory: '256MB', maxAllowed: '512MB', duration: '2 hours', tool: 'Grafana + Prometheus' },
    expected: 'Memory stays below 512MB, no leaks detected', actual: 'Peak: 420MB, stable after GC, no leaks', time: '2h' },
  { id: 'PRF-010', name: 'CPU Utilization Tracking', priority: 'P1', status: 'Pass', category: 'Resources',
    steps: ['1. Monitor CPU during idle state', '2. Apply typical load pattern', '3. Apply peak load pattern', '4. Check CPU spikes', '5. Verify auto-scaling triggers'],
    testData: { idleTarget: '< 10%', normalTarget: '< 50%', peakTarget: '< 80%', cores: 4 },
    expected: 'CPU < 80% even under peak load', actual: 'Idle: 5%, Normal: 35%, Peak: 72%', time: '30m' },
  { id: 'PRF-011', name: 'Network Latency Measurement', priority: 'P1', status: 'Pass', category: 'Network',
    steps: ['1. Measure latency from CDN to client', '2. Check API gateway latency', '3. Measure DB round-trip time', '4. Check inter-service communication', '5. Test from multiple geographic regions'],
    testData: { cdnProvider: 'CloudFront', regions: ['Mumbai', 'Singapore', 'US-East'], pingTarget: '< 50ms' },
    expected: 'Network latency < 50ms within same region', actual: 'Mumbai: 12ms, Singapore: 45ms, US-East: 180ms', time: '5s' },
  { id: 'PRF-012', name: 'Cache Hit Ratio', priority: 'P2', status: 'Pass', category: 'Caching',
    steps: ['1. Enable cache monitoring', '2. Simulate typical user journey', '3. Measure cache hit/miss ratio', '4. Check Redis cache performance', '5. Verify cache invalidation timing'],
    testData: { cacheType: 'Redis', targetHitRatio: '> 85%', ttl: '5 min', maxSize: '1GB' },
    expected: 'Cache hit ratio > 85% for repeated queries', actual: 'Hit ratio: 91%, Avg lookup: 2ms', time: '1s' },
];

const LOAD_SCENARIOS = [
  { id: 'LOD-001', name: '100 Concurrent Logins', priority: 'P0', status: 'Pass', category: 'Authentication',
    steps: ['1. Create 100 virtual users with valid credentials', '2. Ramp up all users over 30 seconds', '3. All users attempt login simultaneously', '4. Measure success rate and response times', '5. Check server resource utilization'],
    testData: { users: 100, rampUp: '30s', tool: 'JMeter', authMethod: 'JWT', threadGroup: 'Concurrent' },
    expected: '100% login success, avg response < 3s', actual: 'Success: 100%, Avg: 1.5s, Error: 0%', time: '45s' },
  { id: 'LOD-002', name: '500 Simultaneous Transactions', priority: 'P0', status: 'Pass', category: 'Transfers',
    steps: ['1. Pre-authenticate 500 users', '2. Each user initiates a fund transfer', '3. Process all transfers concurrently', '4. Verify no duplicate processing', '5. Check database consistency', '6. Validate all balances updated correctly'],
    testData: { users: 500, txnType: 'IMPS', avgAmount: 2500, totalVolume: 1250000, duration: '2 min' },
    expected: '500 transactions processed without duplicates', actual: '498 success, 2 retried, 0 duplicates', time: '2m' },
  { id: 'LOD-003', name: '1000 API Calls/Second', priority: 'P0', status: 'Fail', category: 'Throughput',
    steps: ['1. Configure load generator for 1000 RPS', '2. Send mixed GET/POST requests', '3. Sustain for 5 minutes', '4. Monitor error rate', '5. Check if rate limiting kicks in'],
    testData: { targetRPS: 1000, duration: '5 min', endpoints: ['GET /accounts', 'POST /transfers', 'GET /statements'] },
    expected: 'System handles 1000 RPS with < 1% error', actual: 'Max sustained: 780 RPS, errors at 850+ RPS', time: '5m' },
  { id: 'LOD-004', name: 'Peak Hour Simulation (9-11 AM)', priority: 'P0', status: 'Pass', category: 'Peak Load',
    steps: ['1. Model 9 AM login surge pattern', '2. Simulate gradual ramp to peak', '3. Sustain peak for 2 hours', '4. Include mix of all operations', '5. Monitor auto-scaling response'],
    testData: { peakUsers: 300, rampPattern: 'Bell curve', operationMix: 'Login 30%, View 40%, Transfer 20%, Other 10%' },
    expected: 'System handles peak without degradation', actual: 'All operations within SLA during peak', time: '2h' },
  { id: 'LOD-005', name: 'End of Day Batch Processing', priority: 'P0', status: 'Pass', category: 'Batch',
    steps: ['1. Trigger EOD batch at 8 PM', '2. Process interest calculations', '3. Generate daily statements', '4. Run reconciliation jobs', '5. Verify batch completes before midnight'],
    testData: { accounts: 50000, interestCalc: true, statementGen: true, reconciliation: true, deadline: '12:00 AM' },
    expected: 'EOD batch for 50K accounts completes in 3 hours', actual: 'Batch completed in 2h 45m', time: '2h45m' },
  { id: 'LOD-006', name: 'Month-End Statement Generation', priority: 'P1', status: 'Pass', category: 'Batch',
    steps: ['1. Trigger month-end statement job', '2. Generate statements for all accounts', '3. Create PDFs with digital signatures', '4. Queue email dispatch', '5. Monitor queue processing rate'],
    testData: { totalAccounts: 50000, format: 'PDF', emailEnabled: true, targetTime: '4 hours' },
    expected: '50K statements generated and emailed within 4 hours', actual: '50K statements in 3h 20m, emails queued', time: '3h20m' },
  { id: 'LOD-007', name: 'Salary Credit Day Simulation', priority: 'P0', status: 'Pass', category: 'Peak Load',
    steps: ['1. Simulate bulk salary credit (1st of month)', '2. 10,000 credits processed via batch', '3. Concurrent user logins to check balance', '4. Fund transfers spike after credits', '5. Monitor system under combined load'],
    testData: { salaryCredits: 10000, concurrentLogins: 500, transferSpike: '200%', avgSalary: 45000 },
    expected: 'Salary credits processed while system handles user load', actual: 'All credits processed, 98% users served < 3s', time: '1h' },
  { id: 'LOD-008', name: 'Festival Season Spike', priority: 'P1', status: 'Pass', category: 'Peak Load',
    steps: ['1. Simulate Diwali shopping spike', '2. 3x normal transaction volume', '3. UPI and card payments surge', '4. Monitor payment gateway latency', '5. Check third-party API stability'],
    testData: { normalTPS: 100, peakTPS: 300, duration: '6 hours', paymentModes: ['UPI', 'Card', 'NetBanking'] },
    expected: 'System handles 3x spike without failures', actual: 'Peak 280 TPS sustained, 99.2% success rate', time: '6h' },
  { id: 'LOD-009', name: 'ATM Network Load', priority: 'P1', status: 'Pass', category: 'Network',
    steps: ['1. Simulate 200 concurrent ATM requests', '2. Mix: balance inquiry + withdrawal', '3. Check switch response time', '4. Verify transaction reconciliation', '5. Monitor network bandwidth'],
    testData: { atmCount: 200, balanceInquiry: '40%', withdrawal: '60%', switchTimeout: '15s' },
    expected: 'ATM switch responds within 15s for all requests', actual: 'Avg switch time: 3.2s, Max: 12s', time: '30s' },
  { id: 'LOD-010', name: 'Mobile Banking Surge', priority: 'P1', status: 'Pass', category: 'Mobile',
    steps: ['1. Simulate 1000 mobile app users', '2. Mix of app launch, balance check, transfer', '3. Include push notification load', '4. Check API gateway throttling', '5. Monitor CDN performance'],
    testData: { mobileUsers: 1000, appLaunch: '30%', balanceCheck: '40%', transfer: '20%', pushNotif: '10%' },
    expected: '1000 concurrent mobile users handled smoothly', actual: 'All operations within SLA, 99.5% success', time: '5m' },
  { id: 'LOD-011', name: 'Internet Banking Peak', priority: 'P0', status: 'Pass', category: 'Web',
    steps: ['1. Simulate 2000 web banking sessions', '2. Apply realistic user journey model', '3. Include session management overhead', '4. Monitor web server connections', '5. Check SSL/TLS handshake performance'],
    testData: { sessions: 2000, avgDuration: '10 min', sslHandshake: '< 200ms', webServer: 'Nginx' },
    expected: '2000 concurrent sessions without session drops', actual: '1998 sessions stable, 2 reconnected, 0 dropped', time: '10m' },
  { id: 'LOD-012', name: 'Branch Network Load', priority: 'P2', status: 'Pending', category: 'Network',
    steps: ['1. Simulate 500 branch terminals online', '2. Each branch processes 50 txns/hour', '3. MPLS network load monitoring', '4. Failover testing on network switch', '5. Branch server sync verification'],
    testData: { branches: 500, txnPerBranch: 50, networkType: 'MPLS', failoverTime: '< 30s' },
    expected: 'All branches operational with < 30s failover', actual: 'Pending: Network simulation environment setup', time: '-' },
];

const BLACKBOX_SCENARIOS = [
  { id: 'BLK-001', name: 'Equivalence Partitioning: Valid/Invalid Amounts', priority: 'P0', status: 'Pass', category: 'Partitioning',
    steps: ['1. Test valid amount: INR 100 (min threshold)', '2. Test valid amount: INR 50,000 (mid range)', '3. Test valid amount: INR 2,00,000 (max NEFT)', '4. Test invalid: INR 0', '5. Test invalid: INR -500', '6. Test invalid: INR 10,00,001 (above max)'],
    testData: { validPartition: '1 - 10,00,000', invalidLow: '<= 0', invalidHigh: '> 10,00,000', currency: 'INR' },
    expected: 'Valid amounts accepted, invalid amounts rejected with proper error', actual: 'All valid amounts accepted, invalid rejected correctly', time: '2.1s' },
  { id: 'BLK-002', name: 'Boundary Value: Min/Max Transfer', priority: 'P0', status: 'Pass', category: 'Boundary',
    steps: ['1. Test amount = 0 (below minimum)', '2. Test amount = 1 (minimum valid)', '3. Test amount = 2 (just above minimum)', '4. Test amount = 9,99,999 (just below max)', '5. Test amount = 10,00,000 (maximum valid)', '6. Test amount = 10,00,001 (above maximum)'],
    testData: { min: 1, max: 1000000, belowMin: 0, aboveMax: 1000001, boundary: 'inclusive' },
    expected: 'Only amounts 1-10,00,000 accepted', actual: 'Boundary values correctly validated', time: '1.8s' },
  { id: 'BLK-003', name: 'Decision Table: Loan Eligibility', priority: 'P0', status: 'Pass', category: 'Decision Table',
    steps: ['1. CIBIL >= 750 AND Income >= 50K => Approved', '2. CIBIL >= 750 AND Income < 50K => Conditional', '3. CIBIL 650-749 AND Income >= 50K => Review', '4. CIBIL 650-749 AND Income < 50K => Rejected', '5. CIBIL < 650 => Rejected regardless of income', '6. Verify all 6 combinations'],
    testData: { conditions: ['CIBIL Score', 'Monthly Income'], outcomes: ['Approved', 'Conditional', 'Review', 'Rejected'], combinations: 6 },
    expected: 'All 6 decision combinations produce correct outcomes', actual: 'All decision paths verified correctly', time: '3.5s' },
  { id: 'BLK-004', name: 'State Transition: Account Status', priority: 'P0', status: 'Pass', category: 'State Transition',
    steps: ['1. New -> Active (KYC verified)', '2. Active -> Dormant (no txn for 2 years)', '3. Dormant -> Active (new transaction)', '4. Active -> Frozen (court order)', '5. Frozen -> Active (court release)', '6. Active -> Closed (customer request)', '7. Closed -> (no further transitions)'],
    testData: { states: ['New', 'Active', 'Dormant', 'Frozen', 'Closed'], transitions: 7, invalidTransitions: ['Closed->Active', 'New->Closed'] },
    expected: 'Only valid state transitions allowed', actual: 'All valid transitions work, invalid ones blocked', time: '4.2s' },
  { id: 'BLK-005', name: 'Use Case: End-to-End Fund Transfer', priority: 'P0', status: 'Pass', category: 'Use Case',
    steps: ['1. Login as customer', '2. Navigate to Fund Transfer', '3. Select beneficiary', '4. Enter amount and remarks', '5. Select transfer mode', '6. Review and confirm', '7. Enter OTP', '8. Verify success message and reference number'],
    testData: { actor: 'Customer', precondition: 'Active account with balance', postcondition: 'Balance debited, txn recorded' },
    expected: 'Complete transfer flow works end-to-end', actual: 'Transfer completed, ref: TXN2024001234', time: '8.5s' },
  { id: 'BLK-006', name: 'Error Guessing: Special Characters in Forms', priority: 'P1', status: 'Pass', category: 'Error Guessing',
    steps: ['1. Enter <script>alert(1)</script> in name field', '2. Enter SQL: OR 1=1-- in search', '3. Enter emoji in amount field', '4. Enter unicode in beneficiary name', '5. Enter null bytes in form fields', '6. Verify all inputs sanitized'],
    testData: { inputs: ['<script>alert(1)</script>', "' OR 1=1--", '\\x00', 'INR 500\\u200B'], fields: ['name', 'search', 'amount'] },
    expected: 'All special characters sanitized, no injection', actual: 'All inputs sanitized, XSS/SQLi prevented', time: '2.8s' },
  { id: 'BLK-007', name: 'Random Testing: Unexpected Inputs', priority: 'P1', status: 'Fail', category: 'Random',
    steps: ['1. Generate random string inputs for all fields', '2. Submit forms with mixed valid/invalid data', '3. Send malformed JSON to APIs', '4. Upload non-file content as document', '5. Submit extremely long input strings (10K chars)'],
    testData: { iterations: 100, fuzzer: 'Random ASCII + Unicode', maxLength: 10000, timeout: '30s' },
    expected: 'Application handles all random inputs gracefully', actual: '10K char input in remarks field caused 500 error', time: '15s' },
  { id: 'BLK-008', name: 'Exploratory: New Feature Discovery', priority: 'P2', status: 'Pass', category: 'Exploratory',
    steps: ['1. Explore UPI payment flow as new user', '2. Try unusual navigation paths', '3. Test with slow 2G network simulation', '4. Switch language mid-transaction', '5. Use back/forward browser buttons during flow'],
    testData: { timeBox: '60 min', tester: 'Senior QA', focus: 'UPI Payment', charter: 'Find usability issues' },
    expected: 'No critical usability issues found', actual: 'Minor: language switch resets form data', time: '60m' },
  { id: 'BLK-009', name: 'Comparison: Cross-Browser Behavior', priority: 'P1', status: 'Pass', category: 'Comparison',
    steps: ['1. Test login flow on Chrome', '2. Test login flow on Firefox', '3. Test login flow on Safari', '4. Test login flow on Edge', '5. Compare rendering and functionality', '6. Check CSS consistency'],
    testData: { browsers: ['Chrome 120', 'Firefox 121', 'Safari 17', 'Edge 120'], pages: ['Login', 'Dashboard', 'Transfer'] },
    expected: 'Consistent behavior across all browsers', actual: 'All browsers render correctly, minor CSS diff in Safari', time: '20m' },
  { id: 'BLK-010', name: 'Cause-Effect: Input Combinations', priority: 'P1', status: 'Pass', category: 'Cause-Effect',
    steps: ['1. Transfer mode NEFT + amount < 2L => Process normally', '2. Transfer mode RTGS + amount < 2L => Reject (RTGS min 2L)', '3. Transfer mode IMPS + amount > 5L => Reject (IMPS max 5L)', '4. Holiday + NEFT => Queue for next working day', '5. Weekend + RTGS => Reject with message'],
    testData: { causes: ['Transfer Mode', 'Amount', 'Day Type'], effects: ['Process', 'Queue', 'Reject'], combinations: 5 },
    expected: 'All cause-effect combinations produce correct effects', actual: 'All 5 combinations verified correctly', time: '3.8s' },
  { id: 'BLK-011', name: 'All-Pairs: Form Field Combinations', priority: 'P2', status: 'Pass', category: 'All-Pairs',
    steps: ['1. Generate pairwise combinations using PICT tool', '2. Account Type x Transfer Mode x Amount Range', '3. Execute all generated test cases', '4. Verify results for each combination', '5. Report any failing combinations'],
    testData: { factors: ['AccType(3)', 'Mode(3)', 'Amount(3)', 'Day(2)'], totalPairs: 18, tool: 'PICT' },
    expected: 'All pairwise combinations produce valid results', actual: '18 pairs tested, all passed', time: '12s' },
  { id: 'BLK-012', name: 'Orthogonal Array: Config Testing', priority: 'P2', status: 'Pending', category: 'Orthogonal',
    steps: ['1. Define configuration factors', '2. OS x Browser x Resolution x Language', '3. Generate orthogonal array (L9)', '4. Execute 9 test configurations', '5. Analyze results for config-specific defects'],
    testData: { factors: ['OS(3)', 'Browser(3)', 'Resolution(3)', 'Language(3)'], arrayType: 'L9', configs: 9 },
    expected: 'Application works across all orthogonal configs', actual: 'Pending: test environment setup', time: '-' },
];

const POSITIVE_SCENARIOS = [
  { id: 'POS-001', name: 'Valid Login Credentials', priority: 'P0', status: 'Pass', category: 'Authentication',
    steps: ['1. Enter valid username: testuser01', '2. Enter correct password', '3. Click Login button', '4. Verify redirect to dashboard', '5. Check welcome message displayed', '6. Verify session token created'],
    testData: { username: 'testuser01', password: 'Valid@Pass123', expectedResult: 'Login successful', redirectTo: '/dashboard' },
    expected: 'User logs in successfully and sees dashboard', actual: 'Login successful, redirected to dashboard in 1.2s', time: '1.2s' },
  { id: 'POS-002', name: 'Correct Fund Transfer Amount', priority: 'P0', status: 'Pass', category: 'Transfers',
    steps: ['1. Select beneficiary from list', '2. Enter valid amount: INR 5,000', '3. Select transfer mode: IMPS', '4. Add remarks: "Monthly rent"', '5. Confirm transaction', '6. Enter valid OTP', '7. Verify success message'],
    testData: { amount: 5000, mode: 'IMPS', beneficiary: 'John Doe', remarks: 'Monthly rent', otp: '123456' },
    expected: 'Transfer of INR 5,000 completed successfully', actual: 'Transfer successful, Ref: IMPS2024001234', time: '3.5s' },
  { id: 'POS-003', name: 'Valid Beneficiary Details', priority: 'P0', status: 'Pass', category: 'Transfers',
    steps: ['1. Enter beneficiary name: Rajesh Kumar', '2. Enter valid account number: 30201234567', '3. Enter valid IFSC: SBIN0001234', '4. Select account type: Savings', '5. Submit for verification', '6. Verify penny-drop success'],
    testData: { name: 'Rajesh Kumar', accNo: '30201234567', ifsc: 'SBIN0001234', accType: 'Savings', bank: 'SBI' },
    expected: 'Beneficiary added and verified successfully', actual: 'Beneficiary verified via penny-drop in 30s', time: '32s' },
  { id: 'POS-004', name: 'Proper Loan Application', priority: 'P0', status: 'Pass', category: 'Loans',
    steps: ['1. Select loan type: Personal Loan', '2. Enter amount: INR 3,00,000', '3. Select tenure: 36 months', '4. Enter income details: 80,000/month', '5. Upload salary slips (PDF)', '6. Submit application', '7. Verify application reference number'],
    testData: { loanType: 'Personal', amount: 300000, tenure: 36, income: 80000, documents: 'salary_slip.pdf' },
    expected: 'Loan application submitted with reference number', actual: 'Application LA-2024-005678 submitted', time: '5.2s' },
  { id: 'POS-005', name: 'Valid Card PIN Change', priority: 'P0', status: 'Pass', category: 'Cards',
    steps: ['1. Navigate to Card Management', '2. Select debit card ending 4532', '3. Click Change PIN', '4. Enter current PIN correctly', '5. Enter new valid PIN (4 digits)', '6. Confirm new PIN', '7. Verify PIN changed confirmation'],
    testData: { cardLast4: '4532', currentPin: '****', newPin: '****', pinFormat: '4 digits numeric' },
    expected: 'PIN changed successfully with confirmation', actual: 'PIN changed, SMS confirmation sent', time: '2.8s' },
  { id: 'POS-006', name: 'Correct Cheque Details', priority: 'P1', status: 'Pass', category: 'Payments',
    steps: ['1. Navigate to Stop Cheque', '2. Enter valid cheque number: 000125', '3. Enter cheque amount: INR 15,000', '4. Enter payee name: ABC Corp', '5. Select reason: Lost cheque', '6. Submit stop payment request', '7. Verify confirmation'],
    testData: { chequeNo: '000125', amount: 15000, payee: 'ABC Corp', reason: 'Lost', accountNo: '1234567890' },
    expected: 'Stop cheque request processed successfully', actual: 'Stop payment confirmed, Ref: STP-2024-001', time: '1.5s' },
  { id: 'POS-007', name: 'Valid Mobile Number Update', priority: 'P1', status: 'Pass', category: 'Profile',
    steps: ['1. Go to Profile Settings', '2. Click Update Mobile Number', '3. Enter valid 10-digit number', '4. OTP sent to old number for verification', '5. Enter OTP from old number', '6. OTP sent to new number for confirmation', '7. Enter OTP from new number', '8. Verify update confirmation'],
    testData: { oldMobile: '9876543210', newMobile: '9123456780', otpOld: '123456', otpNew: '654321' },
    expected: 'Mobile number updated after dual OTP verification', actual: 'Mobile number updated successfully', time: '45s' },
  { id: 'POS-008', name: 'Proper Email Format', priority: 'P1', status: 'Pass', category: 'Profile',
    steps: ['1. Go to Profile Settings', '2. Click Update Email', '3. Enter valid email: user@example.com', '4. Verify email format validation passes', '5. Verification link sent to new email', '6. Click verification link', '7. Email updated successfully'],
    testData: { email: 'user@example.com', format: 'RFC 5322', verification: 'Link-based' },
    expected: 'Valid email accepted and verified', actual: 'Email updated after link verification', time: '30s' },
  { id: 'POS-009', name: 'Correct Account Number Format', priority: 'P0', status: 'Pass', category: 'Accounts',
    steps: ['1. Enter account number in search', '2. Use valid 10-14 digit format', '3. Account details fetched successfully', '4. Verify account holder name displayed', '5. Check account type and branch'],
    testData: { accountNo: '1234567890', format: '10-14 digits numeric', expectedName: 'Test User', branch: 'Mumbai Main' },
    expected: 'Account details retrieved for valid account number', actual: 'Account details displayed correctly', time: '0.8s' },
  { id: 'POS-010', name: 'Valid IFSC Code', priority: 'P0', status: 'Pass', category: 'Transfers',
    steps: ['1. Enter IFSC code: SBIN0001234', '2. Format: 4 alpha + 0 + 6 alphanumeric', '3. Verify bank name auto-populated', '4. Check branch name displayed', '5. Verify MICR code shown'],
    testData: { ifsc: 'SBIN0001234', format: 'XXXX0XXXXXX', bank: 'State Bank of India', branch: 'Mumbai Main' },
    expected: 'IFSC validated, bank and branch auto-populated', actual: 'SBI Mumbai Main Branch populated correctly', time: '0.5s' },
  { id: 'POS-011', name: 'Proper Date Format', priority: 'P1', status: 'Pass', category: 'General',
    steps: ['1. Enter date in DD/MM/YYYY format', '2. Verify date picker accepts input', '3. Check date validation (valid calendar date)', '4. Verify date range filters work', '5. Check date displayed in correct locale'],
    testData: { date: '15/01/2024', format: 'DD/MM/YYYY', locale: 'en-IN', valid: true },
    expected: 'Valid date accepted in DD/MM/YYYY format', actual: 'Date parsed and displayed correctly', time: '0.2s' },
  { id: 'POS-012', name: 'Valid Currency Conversion', priority: 'P1', status: 'Pass', category: 'Forex',
    steps: ['1. Select source currency: INR', '2. Select target currency: USD', '3. Enter amount: INR 83,000', '4. Fetch live exchange rate', '5. Display converted amount', '6. Show rate timestamp', '7. Verify rounding to 2 decimals'],
    testData: { from: 'INR', to: 'USD', amount: 83000, rate: 83.12, expected: 998.80 },
    expected: 'INR 83,000 converted to ~USD 998.80', actual: 'Converted: USD 998.80 at rate 83.12', time: '1.2s' },
];

const NEGATIVE_SCENARIOS = [
  { id: 'NEG-001', name: 'Invalid Login (Wrong Password)', priority: 'P0', status: 'Pass', category: 'Authentication',
    steps: ['1. Enter valid username: testuser01', '2. Enter wrong password: WrongPass!', '3. Click Login button', '4. Verify error message displayed', '5. Check account not locked (1st attempt)', '6. Verify login attempt logged'],
    testData: { username: 'testuser01', password: 'WrongPass!', expectedError: 'Invalid credentials', attemptsLeft: 4 },
    expected: 'Login rejected with "Invalid credentials" message', actual: 'Error: "Invalid username or password"', time: '0.8s' },
  { id: 'NEG-002', name: 'Transfer Exceeding Balance', priority: 'P0', status: 'Pass', category: 'Transfers',
    steps: ['1. Check account balance: INR 10,000', '2. Attempt transfer: INR 15,000', '3. Submit transfer request', '4. Verify insufficient balance error', '5. Check balance unchanged', '6. Verify no partial debit'],
    testData: { balance: 10000, transferAmount: 15000, expectedError: 'Insufficient balance', mode: 'IMPS' },
    expected: 'Transfer rejected with insufficient balance error', actual: 'Error: "Insufficient funds in account"', time: '0.5s' },
  { id: 'NEG-003', name: 'Invalid Beneficiary Account', priority: 'P0', status: 'Pass', category: 'Transfers',
    steps: ['1. Enter invalid account number: 000', '2. Enter valid IFSC: SBIN0001234', '3. Submit beneficiary addition', '4. Verify validation error', '5. Check penny-drop fails', '6. Beneficiary not added'],
    testData: { accNo: '000', ifsc: 'SBIN0001234', name: 'Invalid Test', expectedError: 'Invalid account number' },
    expected: 'Beneficiary rejected due to invalid account number', actual: 'Error: "Account number must be 10-14 digits"', time: '0.3s' },
  { id: 'NEG-004', name: 'Expired Session Token', priority: 'P0', status: 'Pass', category: 'Security',
    steps: ['1. Login and get valid token', '2. Wait for token expiry (or manually expire)', '3. Attempt API call with expired token', '4. Verify 401 Unauthorized response', '5. Check redirect to login page', '6. Verify new login required'],
    testData: { tokenType: 'JWT', expiry: '30 min', action: 'API call after expiry', expectedStatus: 401 },
    expected: '401 Unauthorized returned, redirect to login', actual: '401 received, user redirected to login page', time: '0.2s' },
  { id: 'NEG-005', name: 'SQL Injection in Search', priority: 'P0', status: 'Pass', category: 'Security',
    steps: ['1. Enter in search: \' OR 1=1--', '2. Submit search query', '3. Verify input sanitized', '4. Check no SQL error exposed', '5. Verify WAF/sanitization active', '6. Check audit log for attempt'],
    testData: { input: "' OR 1=1--", field: 'search', expectedBehavior: 'Input sanitized, no data leak' },
    expected: 'SQL injection attempt blocked, input sanitized', actual: 'Input sanitized, search returned no results', time: '0.4s' },
  { id: 'NEG-006', name: 'XSS in Form Fields', priority: 'P0', status: 'Pass', category: 'Security',
    steps: ['1. Enter in remarks: <script>alert("XSS")</script>', '2. Submit the form', '3. Verify script tags stripped/encoded', '4. Check rendered output is safe', '5. Verify CSP headers present', '6. Check no alert dialog appears'],
    testData: { input: '<script>alert("XSS")</script>', field: 'remarks', expectedBehavior: 'HTML encoded output' },
    expected: 'XSS payload sanitized, no script execution', actual: 'Input encoded: &lt;script&gt;...', time: '0.3s' },
  { id: 'NEG-007', name: 'Negative Transfer Amount', priority: 'P0', status: 'Pass', category: 'Validation',
    steps: ['1. Enter transfer amount: -5000', '2. Submit transfer form', '3. Verify client-side validation', '4. Check server-side validation', '5. Verify no reverse debit occurs', '6. Check error message clarity'],
    testData: { amount: -5000, expectedError: 'Amount must be positive', field: 'amount' },
    expected: 'Negative amount rejected with validation error', actual: 'Error: "Transfer amount must be greater than 0"', time: '0.1s' },
  { id: 'NEG-008', name: 'Invalid IFSC Code', priority: 'P0', status: 'Pass', category: 'Validation',
    steps: ['1. Enter IFSC: INVALID', '2. Verify format validation fails', '3. Enter IFSC: ZZZZ0999999 (valid format, invalid code)', '4. Verify RBI API lookup fails', '5. Check error message displayed', '6. Bank/branch not auto-populated'],
    testData: { ifsc1: 'INVALID', ifsc2: 'ZZZZ0999999', format: 'XXXX0XXXXXX', expectedError: 'Invalid IFSC code' },
    expected: 'Invalid IFSC codes rejected with proper error', actual: 'Format error for "INVALID", lookup error for ZZZZ0999999', time: '0.6s' },
  { id: 'NEG-009', name: 'Future Date for DOB', priority: 'P1', status: 'Pass', category: 'Validation',
    steps: ['1. Open profile update form', '2. Enter DOB: 15/01/2030 (future date)', '3. Submit form', '4. Verify date validation error', '5. Check error message is user-friendly', '6. Verify form not submitted'],
    testData: { dob: '15/01/2030', today: '25/02/2026', expectedError: 'Date of birth cannot be in the future' },
    expected: 'Future date rejected for DOB field', actual: 'Error: "Date of birth cannot be a future date"', time: '0.1s' },
  { id: 'NEG-010', name: 'Special Characters in Name Field', priority: 'P1', status: 'Fail', category: 'Validation',
    steps: ['1. Enter name: @#$%^&*()', '2. Submit beneficiary form', '3. Verify special chars rejected', '4. Enter name: Robert); DROP TABLE--', '5. Verify SQL injection attempt blocked', '6. Check only alphabets/spaces allowed'],
    testData: { input1: '@#$%^&*()', input2: 'Robert); DROP TABLE--', allowedPattern: '^[A-Za-z ]{2,50}$' },
    expected: 'Special characters rejected in name field', actual: 'Name with @#$ was accepted (validation gap)', time: '0.3s' },
  { id: 'NEG-011', name: 'Zero Amount Transfer', priority: 'P0', status: 'Pass', category: 'Validation',
    steps: ['1. Enter transfer amount: 0', '2. Submit transfer form', '3. Verify amount validation triggers', '4. Check error message displayed', '5. Verify no transaction created', '6. Balance remains unchanged'],
    testData: { amount: 0, expectedError: 'Amount must be greater than zero', field: 'amount' },
    expected: 'Zero amount transfer rejected', actual: 'Error: "Minimum transfer amount is INR 1"', time: '0.1s' },
  { id: 'NEG-012', name: 'Duplicate Transaction Submit', priority: 'P0', status: 'Pass', category: 'Idempotency',
    steps: ['1. Submit fund transfer request', '2. Quickly click submit again (double-click)', '3. Verify idempotency check triggers', '4. Only one transaction processed', '5. Second request returns duplicate warning', '6. Check balance debited only once'],
    testData: { amount: 5000, submitCount: 2, expectedTxn: 1, idempotencyKey: 'UUID-based', cooldown: '30s' },
    expected: 'Only one transaction processed despite double submit', actual: 'Second submit blocked: "Transaction already processed"', time: '0.5s' },
];

const ALL_SCENARIOS = {
  smoke: SMOKE_SCENARIOS,
  integration: INTEGRATION_SCENARIOS,
  performance: PERFORMANCE_SCENARIOS,
  load: LOAD_SCENARIOS,
  blackbox: BLACKBOX_SCENARIOS,
  positive: POSITIVE_SCENARIOS,
  negative: NEGATIVE_SCENARIOS,
};

// ─── Tab Descriptions ───
const TAB_DESCRIPTIONS = {
  smoke: 'Quick sanity checks to verify critical banking functions are operational after deployment. Ensures basic system health before deeper testing.',
  integration: 'Validates end-to-end workflows where multiple banking systems interact: Core Banking, Payment Gateway, SMS Gateway, Credit Bureau, and more.',
  performance: 'Measures response times, throughput, and resource utilization under controlled conditions to ensure SLA compliance.',
  load: 'Simulates high concurrent user loads and transaction volumes to validate system capacity and identify breaking points.',
  blackbox: 'Tests banking application functionality without knowledge of internal code. Uses techniques like equivalence partitioning, boundary analysis, and decision tables.',
  positive: 'Validates that the system works correctly with valid inputs and expected user behavior.',
  negative: 'Validates that the system handles invalid inputs, edge cases, and malicious attempts gracefully.',
};

// ─── Form Fields per Tab ───
const TAB_FORMS = {
  smoke: [
    { label: 'Target URL', type: 'text', placeholder: 'https://netbanking.example.com', key: 'url' },
    { label: 'Browser', type: 'select', options: ['Chrome', 'Firefox', 'Safari', 'Edge'], key: 'browser' },
    { label: 'Environment', type: 'select', options: ['DEV', 'QA', 'UAT', 'PROD'], key: 'env' },
    { label: 'Timeout (ms)', type: 'number', placeholder: '5000', key: 'timeout' },
  ],
  integration: [
    { label: 'Source System', type: 'select', options: ['Core Banking', 'Payment Gateway', 'Mobile App', 'Internet Banking'], key: 'source' },
    { label: 'Target System', type: 'select', options: ['CBS', 'RBI Gateway', 'SMS Provider', 'Email Service', 'Credit Bureau'], key: 'target' },
    { label: 'Test Account', type: 'text', placeholder: '1234567890', key: 'account' },
    { label: 'Transaction Amount', type: 'number', placeholder: '5000', key: 'amount' },
  ],
  performance: [
    { label: 'Endpoint', type: 'text', placeholder: '/api/auth/login', key: 'endpoint' },
    { label: 'Response Threshold (ms)', type: 'number', placeholder: '2000', key: 'threshold' },
    { label: 'Iterations', type: 'number', placeholder: '100', key: 'iterations' },
    { label: 'Tool', type: 'select', options: ['JMeter', 'k6', 'Gatling', 'Locust'], key: 'tool' },
  ],
  load: [
    { label: 'Concurrent Users', type: 'number', placeholder: '100', key: 'users' },
    { label: 'Ramp-up Period (s)', type: 'number', placeholder: '30', key: 'rampUp' },
    { label: 'Duration (min)', type: 'number', placeholder: '5', key: 'duration' },
    { label: 'Scenario', type: 'select', options: ['Peak Hour', 'Salary Day', 'Festival', 'Normal'], key: 'scenario' },
  ],
  blackbox: [
    { label: 'Technique', type: 'select', options: ['Equivalence Partitioning', 'Boundary Value', 'Decision Table', 'State Transition', 'Use Case', 'Error Guessing'], key: 'technique' },
    { label: 'Input Field', type: 'text', placeholder: 'Transfer Amount', key: 'field' },
    { label: 'Test Value', type: 'text', placeholder: '50000', key: 'value' },
    { label: 'Expected Outcome', type: 'select', options: ['Accept', 'Reject', 'Error Message', 'Redirect'], key: 'outcome' },
  ],
  positive: [
    { label: 'Module', type: 'select', options: ['Login', 'Transfer', 'Cards', 'Loans', 'Profile', 'Payments'], key: 'module' },
    { label: 'Valid Input', type: 'text', placeholder: 'testuser01', key: 'input' },
    { label: 'Expected Result', type: 'text', placeholder: 'Login successful', key: 'expected' },
    { label: 'Data Type', type: 'select', options: ['String', 'Number', 'Date', 'Email', 'Phone'], key: 'dataType' },
  ],
  negative: [
    { label: 'Attack Type', type: 'select', options: ['SQL Injection', 'XSS', 'Invalid Input', 'Boundary Violation', 'Auth Bypass', 'Session Hijack'], key: 'attack' },
    { label: 'Target Field', type: 'text', placeholder: 'username', key: 'field' },
    { label: 'Malicious Input', type: 'text', placeholder: "' OR 1=1--", key: 'input' },
    { label: 'Expected Response', type: 'select', options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '422 Validation Error'], key: 'response' },
  ],
};

// ═══════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════
function TestingTypes() {
  const [activeTab, setActiveTab] = useState('smoke');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [expandedScenario, setExpandedScenario] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [runResults, setRunResults] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [processSteps, setProcessSteps] = useState([]);
  const [currentProcessStep, setCurrentProcessStep] = useState(-1);
  const timerRef = useRef(null);

  const scenarios = ALL_SCENARIOS[activeTab] || [];
  const description = TAB_DESCRIPTIONS[activeTab] || '';
  const formFields = TAB_FORMS[activeTab] || [];

  const passCount = scenarios.filter(s => s.status === 'Pass').length;
  const failCount = scenarios.filter(s => s.status === 'Fail').length;
  const pendingCount = scenarios.filter(s => s.status === 'Pending').length;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedScenario(null);
    setExpandedScenario(null);
    setIsRunning(false);
    setProgress(0);
    setRunResults(null);
    setProcessSteps([]);
    setCurrentProcessStep(-1);
    setFormValues({});
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleRunTest = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);
    setRunResults(null);

    const steps = [
      'Initializing test environment...',
      'Connecting to banking APIs...',
      'Loading test data...',
      'Executing test scenarios...',
      'Validating responses...',
      'Generating results...',
    ];
    setProcessSteps(steps);
    setCurrentProcessStep(0);

    let p = 0;
    let stepIdx = 0;
    timerRef.current = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p >= 100) p = 100;
      setProgress(p);

      const newStep = Math.min(Math.floor((p / 100) * steps.length), steps.length - 1);
      if (newStep !== stepIdx) {
        stepIdx = newStep;
        setCurrentProcessStep(stepIdx);
      }

      if (p >= 100) {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setCurrentProcessStep(steps.length);
        const execTime = (Math.random() * 5 + 2).toFixed(1);
        setRunResults({
          total: scenarios.length,
          passed: passCount,
          failed: failCount,
          skipped: pendingCount,
          executionTime: execTime + 's',
          timestamp: new Date().toLocaleString(),
        });
      }
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ─── Styles ───
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: C.text,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '24px',
    },
    header: {
      marginBottom: '24px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      margin: '0 0 8px 0',
      background: 'linear-gradient(90deg, #4ecca3, #3498db)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '14px',
      color: C.textMuted,
      margin: 0,
    },
    tabBar: {
      display: 'flex',
      gap: '4px',
      marginBottom: '24px',
      overflowX: 'auto',
      paddingBottom: '4px',
      borderBottom: `2px solid ${C.border}`,
    },
    tab: (isActive) => ({
      padding: '10px 18px',
      borderRadius: '8px 8px 0 0',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: isActive ? '700' : '500',
      background: isActive ? C.accent : 'transparent',
      color: isActive ? '#1a1a2e' : C.textMuted,
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
      borderBottom: isActive ? `3px solid ${C.accent}` : '3px solid transparent',
    }),
    descriptionBar: {
      background: 'rgba(78, 204, 163, 0.1)',
      border: `1px solid ${C.accent}33`,
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '20px',
      fontSize: '13px',
      color: C.textMuted,
      lineHeight: '1.5',
    },
    splitPanel: {
      display: 'flex',
      gap: '20px',
      alignItems: 'flex-start',
    },
    leftPanel: {
      flex: '0 0 60%',
      maxWidth: '60%',
    },
    rightPanel: {
      flex: '0 0 38%',
      maxWidth: '38%',
      position: 'sticky',
      top: '24px',
    },
    card: {
      background: C.card,
      borderRadius: '12px',
      border: `1px solid ${C.border}`,
      padding: '16px',
      marginBottom: '16px',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      margin: '0 0 12px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    scenarioRow: (isSelected) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      background: isSelected ? 'rgba(78, 204, 163, 0.15)' : 'rgba(255,255,255,0.03)',
      border: isSelected ? `1px solid ${C.accent}55` : '1px solid transparent',
      marginBottom: '6px',
      transition: 'all 0.15s ease',
    }),
    scenarioId: {
      fontSize: '11px',
      fontWeight: '700',
      color: C.blue,
      minWidth: '65px',
      fontFamily: 'monospace',
    },
    scenarioName: {
      flex: 1,
      fontSize: '13px',
      fontWeight: '500',
    },
    badge: (color) => ({
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '700',
      background: `${color}22`,
      color: color,
      border: `1px solid ${color}44`,
      textTransform: 'uppercase',
    }),
    expandedBox: {
      background: 'rgba(0,0,0,0.25)',
      borderRadius: '8px',
      padding: '14px',
      margin: '8px 0 4px 0',
      fontSize: '12px',
    },
    stepsList: {
      listStyle: 'none',
      padding: 0,
      margin: '8px 0',
    },
    stepItem: {
      padding: '4px 0',
      color: C.textMuted,
      fontSize: '12px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    dataTable: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px',
      marginTop: '8px',
    },
    dataTh: {
      textAlign: 'left',
      padding: '6px 10px',
      background: 'rgba(52, 152, 219, 0.15)',
      color: C.blue,
      fontWeight: '600',
      borderBottom: `1px solid ${C.border}`,
    },
    dataTd: {
      padding: '6px 10px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      color: C.textMuted,
      wordBreak: 'break-word',
    },
    formGroup: {
      marginBottom: '12px',
    },
    formLabel: {
      display: 'block',
      fontSize: '11px',
      fontWeight: '600',
      color: C.textMuted,
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    formInput: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '6px',
      border: `1px solid ${C.border}`,
      background: C.inputBg,
      color: C.text,
      fontSize: '13px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    formSelect: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '6px',
      border: `1px solid ${C.border}`,
      background: C.inputBg,
      color: C.text,
      fontSize: '13px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    runBtn: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      background: isRunning ? C.orange : `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
      color: isRunning ? '#1a1a2e' : '#fff',
      fontSize: '14px',
      fontWeight: '700',
      cursor: isRunning ? 'not-allowed' : 'pointer',
      marginTop: '8px',
      transition: 'all 0.2s ease',
      letterSpacing: '0.5px',
    },
    progressContainer: {
      width: '100%',
      height: '8px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '12px',
    },
    progressBar: {
      height: '100%',
      background: `linear-gradient(90deg, ${C.accent}, ${C.blue})`,
      borderRadius: '4px',
      transition: 'width 0.3s ease',
      width: `${progress}%`,
    },
    processStep: (isActive, isDone) => ({
      padding: '6px 10px',
      fontSize: '12px',
      color: isDone ? C.accent : isActive ? C.yellow : C.textMuted,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }),
    resultGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginTop: '12px',
    },
    resultCard: (color) => ({
      background: `${color}15`,
      border: `1px solid ${color}33`,
      borderRadius: '8px',
      padding: '12px',
      textAlign: 'center',
    }),
    resultValue: (color) => ({
      fontSize: '24px',
      fontWeight: '700',
      color: color,
      margin: 0,
    }),
    resultLabel: {
      fontSize: '11px',
      color: C.textMuted,
      margin: '4px 0 0 0',
      textTransform: 'uppercase',
    },
    sectionLabel: {
      fontSize: '12px',
      fontWeight: '700',
      color: C.accent,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px',
      paddingBottom: '6px',
      borderBottom: `1px solid ${C.accent}33`,
    },
    summaryBar: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
    },
    summaryItem: (color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      color: color,
      fontWeight: '600',
    }),
    summaryDot: (color) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: color,
    }),
    expandBtn: {
      background: 'none',
      border: 'none',
      color: C.accent,
      fontSize: '12px',
      cursor: 'pointer',
      padding: '4px 0',
      fontWeight: '600',
    },
  };

  const renderScenarioList = () => (
    <div style={styles.card}>
      <div style={styles.cardTitle}>
        <span style={{ color: C.accent }}>{'[ ]'}</span>
        Test Scenarios ({scenarios.length})
      </div>

      <div style={styles.summaryBar}>
        <div style={styles.summaryItem(C.pass)}>
          <span style={styles.summaryDot(C.pass)} /> {passCount} Passed
        </div>
        <div style={styles.summaryItem(C.fail)}>
          <span style={styles.summaryDot(C.fail)} /> {failCount} Failed
        </div>
        <div style={styles.summaryItem(C.pending)}>
          <span style={styles.summaryDot(C.pending)} /> {pendingCount} Pending
        </div>
      </div>

      {scenarios.map((sc) => {
        const isExpanded = expandedScenario === sc.id;
        const isSelected = selectedScenario === sc.id;
        return (
          <div key={sc.id}>
            <div
              style={styles.scenarioRow(isSelected)}
              onClick={() => {
                setSelectedScenario(sc.id);
                setExpandedScenario(isExpanded ? null : sc.id);
              }}
            >
              <span style={styles.scenarioId}>{sc.id}</span>
              <span style={styles.scenarioName}>{sc.name}</span>
              <span style={styles.badge(priorityColors[sc.priority])}>{sc.priority}</span>
              <span style={styles.badge(statusColors[sc.status])}>{sc.status}</span>
              <span style={{ fontSize: '11px', color: C.textMuted, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                {'\u25BC'}
              </span>
            </div>
            {isExpanded && (
              <div style={styles.expandedBox}>
                {/* Steps */}
                <div style={styles.sectionLabel}>Test Steps</div>
                <ul style={styles.stepsList}>
                  {sc.steps.map((step, i) => (
                    <li key={i} style={styles.stepItem}>{step}</li>
                  ))}
                </ul>

                {/* Test Data */}
                <div style={{ ...styles.sectionLabel, marginTop: '12px' }}>Test Data</div>
                <table style={styles.dataTable}>
                  <thead>
                    <tr>
                      <th style={styles.dataTh}>Parameter</th>
                      <th style={styles.dataTh}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sc.testData).map(([key, val]) => (
                      <tr key={key}>
                        <td style={styles.dataTd}>{key}</td>
                        <td style={styles.dataTd}>
                          {Array.isArray(val) ? val.join(', ') : String(val)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Expected vs Actual */}
                <div style={{ ...styles.sectionLabel, marginTop: '12px' }}>Results</div>
                <table style={styles.dataTable}>
                  <tbody>
                    <tr>
                      <td style={{ ...styles.dataTd, color: C.blue, fontWeight: '600', width: '120px' }}>Expected</td>
                      <td style={styles.dataTd}>{sc.expected}</td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.dataTd, color: sc.status === 'Pass' ? C.pass : sc.status === 'Fail' ? C.fail : C.pending, fontWeight: '600' }}>Actual</td>
                      <td style={styles.dataTd}>{sc.actual}</td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.dataTd, fontWeight: '600', color: C.textMuted }}>Exec Time</td>
                      <td style={styles.dataTd}>{sc.time}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderRightPanel = () => (
    <div>
      {/* INPUT SECTION */}
      <div style={styles.card}>
        <div style={styles.sectionLabel}>Input - Test Configuration</div>
        {formFields.map((field) => (
          <div key={field.key} style={styles.formGroup}>
            <label style={styles.formLabel}>{field.label}</label>
            {field.type === 'select' ? (
              <select
                style={styles.formSelect}
                value={formValues[field.key] || ''}
                onChange={(e) => setFormValues({ ...formValues, [field.key]: e.target.value })}
              >
                <option value="">-- Select --</option>
                {field.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                style={styles.formInput}
                placeholder={field.placeholder}
                value={formValues[field.key] || ''}
                onChange={(e) => setFormValues({ ...formValues, [field.key]: e.target.value })}
              />
            )}
          </div>
        ))}
        <button style={styles.runBtn} onClick={handleRunTest} disabled={isRunning}>
          {isRunning ? 'Running Tests...' : 'Run Test'}
        </button>
      </div>

      {/* PROCESS SECTION */}
      <div style={styles.card}>
        <div style={styles.sectionLabel}>Process - Execution Pipeline</div>
        {processSteps.length === 0 ? (
          <div style={{ fontSize: '12px', color: C.textMuted, padding: '12px 0' }}>
            Click "Run Test" to start the execution pipeline.
          </div>
        ) : (
          <>
            {processSteps.map((step, i) => {
              const isDone = i < currentProcessStep;
              const isActive = i === currentProcessStep;
              return (
                <div key={i} style={styles.processStep(isActive, isDone)}>
                  <span style={{
                    width: '18px', height: '18px', borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700',
                    background: isDone ? C.accent : isActive ? C.yellow : 'rgba(255,255,255,0.1)',
                    color: isDone || isActive ? '#1a1a2e' : C.textMuted,
                    flexShrink: 0,
                  }}>
                    {isDone ? '\u2713' : i + 1}
                  </span>
                  {step}
                  {isActive && (
                    <span style={{
                      marginLeft: 'auto',
                      width: '12px', height: '12px', border: '2px solid transparent',
                      borderTop: `2px solid ${C.yellow}`, borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                  )}
                </div>
              );
            })}
            <div style={styles.progressContainer}>
              <div style={styles.progressBar} />
            </div>
            <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '6px', textAlign: 'right' }}>
              {Math.round(progress)}%
            </div>
          </>
        )}
      </div>

      {/* OUTPUT SECTION */}
      <div style={styles.card}>
        <div style={styles.sectionLabel}>Output - Expected vs Actual</div>
        {selectedScenario ? (
          (() => {
            const sc = scenarios.find(s => s.id === selectedScenario);
            if (!sc) return null;
            return (
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: C.blue }}>Scenario: </span>
                  <span style={{ fontSize: '12px', color: C.text }}>{sc.name}</span>
                </div>
                <div style={{
                  padding: '10px', borderRadius: '6px',
                  background: 'rgba(52, 152, 219, 0.1)', border: `1px solid ${C.blue}33`,
                  marginBottom: '8px',
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: C.blue, marginBottom: '4px' }}>EXPECTED</div>
                  <div style={{ fontSize: '12px', color: C.textMuted }}>{sc.expected}</div>
                </div>
                <div style={{
                  padding: '10px', borderRadius: '6px',
                  background: sc.status === 'Pass' ? 'rgba(46, 204, 113, 0.1)' : sc.status === 'Fail' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(243, 156, 18, 0.1)',
                  border: `1px solid ${statusColors[sc.status]}33`,
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: statusColors[sc.status], marginBottom: '4px' }}>ACTUAL</div>
                  <div style={{ fontSize: '12px', color: C.textMuted }}>{sc.actual}</div>
                </div>
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: C.textMuted }}>
                  <span>Execution: {sc.time}</span>
                  <span style={styles.badge(statusColors[sc.status])}>{sc.status}</span>
                </div>
              </div>
            );
          })()
        ) : (
          <div style={{ fontSize: '12px', color: C.textMuted, padding: '12px 0' }}>
            Select a scenario from the left panel to view expected vs actual results.
          </div>
        )}
      </div>

      {/* TEST RESULTS SUMMARY */}
      <div style={styles.card}>
        <div style={styles.sectionLabel}>Test Results Summary</div>
        {runResults ? (
          <>
            <div style={styles.resultGrid}>
              <div style={styles.resultCard(C.pass)}>
                <p style={styles.resultValue(C.pass)}>{runResults.passed}</p>
                <p style={styles.resultLabel}>Passed</p>
              </div>
              <div style={styles.resultCard(C.fail)}>
                <p style={styles.resultValue(C.fail)}>{runResults.failed}</p>
                <p style={styles.resultLabel}>Failed</p>
              </div>
              <div style={styles.resultCard(C.pending)}>
                <p style={styles.resultValue(C.pending)}>{runResults.skipped}</p>
                <p style={styles.resultLabel}>Skipped</p>
              </div>
              <div style={styles.resultCard(C.blue)}>
                <p style={styles.resultValue(C.blue)}>{runResults.total}</p>
                <p style={styles.resultLabel}>Total</p>
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: C.textMuted, display: 'flex', justifyContent: 'space-between' }}>
              <span>Time: {runResults.executionTime}</span>
              <span>{runResults.timestamp}</span>
            </div>
            {/* Pass rate bar */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '4px' }}>
                Pass Rate: {((runResults.passed / runResults.total) * 100).toFixed(1)}%
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(runResults.passed / runResults.total) * 100}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${C.pass}, ${C.accent})`,
                  borderRadius: '3px',
                }} />
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px', opacity: 0.3 }}>{'{ }'}</div>
            <div style={{ fontSize: '12px', color: C.textMuted }}>
              Run tests to see results summary
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Spinner animation */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Banking QA - Testing Types Dashboard</h1>
        <p style={styles.subtitle}>
          Comprehensive test management across 7 testing methodologies with {
            Object.values(ALL_SCENARIOS).reduce((sum, arr) => sum + arr.length, 0)
          } banking-specific scenarios
        </p>
      </div>

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            style={styles.tab(activeTab === tab.id)}
            onClick={() => handleTabChange(tab.id)}
          >
            <span style={{ marginRight: '6px', fontWeight: '800', fontSize: '11px', opacity: 0.7 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description Bar */}
      <div style={styles.descriptionBar}>
        <strong style={{ color: C.accent }}>{TABS.find(t => t.id === activeTab)?.label}:</strong>{' '}
        {description}
      </div>

      {/* Split Panel */}
      <div style={styles.splitPanel}>
        <div style={styles.leftPanel}>
          {renderScenarioList()}
        </div>
        <div style={styles.rightPanel}>
          {renderRightPanel()}
        </div>
      </div>
    </div>
  );
}

export default TestingTypes;

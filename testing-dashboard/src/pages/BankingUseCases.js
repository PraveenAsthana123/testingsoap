import React, { useState } from 'react';

const TABS = [
  'Customer Onboarding', 'Login & Account', 'Deposit Account', 'Debit Card',
  'Student Account', 'Senior Citizen', 'RESP Account', 'Single Account',
  'Corporate Account', 'Joint Account'
];

const ALL_SCENARIOS = {
  'Customer Onboarding': [
    { id: 'TC-ONB-001', name: 'New customer registration', priority: 'P0', status: 'pass', steps: ['Navigate to registration page', 'Fill personal details (Name, DOB, Email, Phone)', 'Submit registration form', 'Verify success message'], testData: { name: 'Rajesh Kumar', dob: '1990-05-15', email: 'rajesh@email.com', phone: '+919876543210' }, expected: 'Customer profile created with unique Customer ID', actual: 'CUST00012 generated successfully', time: '3.2s' },
    { id: 'TC-ONB-002', name: 'KYC document upload', priority: 'P0', status: 'pass', steps: ['Login to portal', 'Navigate to KYC section', 'Upload PAN card image', 'Upload Aadhaar card image', 'Submit for verification'], testData: { docType: 'PAN + Aadhaar', panNo: 'ABCDE1234F', aadhaar: '1234-5678-9012', fileSize: '2MB' }, expected: 'Documents uploaded, status: Pending Verification', actual: 'KYC documents uploaded successfully', time: '5.1s' },
    { id: 'TC-ONB-003', name: 'Identity verification (Aadhaar/PAN/Passport)', priority: 'P0', status: 'pass', steps: ['Submit identity document', 'System performs OCR extraction', 'Cross-verify with government database', 'Display verification result'], testData: { verifyType: 'Aadhaar OTP', aadhaar: '1234-5678-9012', otp: '456789' }, expected: 'Identity verified via Aadhaar OTP', actual: 'Verification successful - Green check', time: '8.5s' },
    { id: 'TC-ONB-004', name: 'Address proof validation', priority: 'P1', status: 'pass', steps: ['Upload address proof document', 'System extracts address via OCR', 'Verify against entered address', 'Confirm match status'], testData: { docType: 'Utility Bill', address: '123 MG Road, Bengaluru 560001', issueDate: '2026-01-15' }, expected: 'Address matched with submitted document', actual: 'Address verification: Match 95%', time: '4.3s' },
    { id: 'TC-ONB-005', name: 'Photo capture and verification', priority: 'P0', status: 'pass', steps: ['Activate camera for selfie', 'Capture live photo', 'Compare with ID document photo', 'Display face match score'], testData: { captureType: 'Selfie', livenessCheck: true, minScore: 80 }, expected: 'Face match score > 80%', actual: 'Face match: 94% - Passed', time: '6.2s' },
    { id: 'TC-ONB-006', name: 'Digital signature capture', priority: 'P1', status: 'pass', steps: ['Open signature pad', 'Customer draws signature', 'Save signature specimen', 'Confirm storage'], testData: { inputMethod: 'Touch/Stylus', format: 'PNG', resolution: '300dpi' }, expected: 'Signature saved as specimen', actual: 'Signature specimen stored', time: '2.1s' },
    { id: 'TC-ONB-007', name: 'Terms & conditions acceptance', priority: 'P0', status: 'pass', steps: ['Display T&C document', 'Scroll to bottom', 'Check acceptance checkbox', 'Record consent timestamp'], testData: { version: 'v2.5', language: 'English', scrollRequired: true }, expected: 'Consent recorded with timestamp', actual: 'Consent logged: 2026-02-25 10:30:00 UTC', time: '1.5s' },
    { id: 'TC-ONB-008', name: 'Initial deposit processing', priority: 'P0', status: 'pass', steps: ['Enter initial deposit amount', 'Select payment method', 'Process payment', 'Verify account credited'], testData: { amount: 10000, method: 'Debit Card', minDeposit: 1000 }, expected: 'Account funded with initial deposit', actual: 'Balance: $10,000.00', time: '4.8s' },
    { id: 'TC-ONB-009', name: 'Account number generation', priority: 'P0', status: 'pass', steps: ['Complete all KYC steps', 'System generates unique account number', 'Verify format and uniqueness', 'Display to customer'], testData: { accountType: 'Savings', branch: 'Main', format: 'ACC2024XXXXXX' }, expected: 'Unique 12-digit account number generated', actual: 'ACC2024000012 generated', time: '1.2s' },
    { id: 'TC-ONB-010', name: 'Welcome kit dispatch', priority: 'P2', status: 'pass', steps: ['Trigger welcome kit creation', 'Generate welcome letter', 'Include debit card details', 'Mark dispatch status'], testData: { kitType: 'Standard', delivery: 'Courier', address: 'Registered Address' }, expected: 'Welcome kit dispatched, tracking ID generated', actual: 'Kit dispatched - Track: WK2024001', time: '2.3s' },
    { id: 'TC-ONB-011', name: 'Internet banking activation', priority: 'P0', status: 'fail', steps: ['Generate login credentials', 'Send credentials via email/SMS', 'First login with temp password', 'Force password change'], testData: { userId: 'rajesh.kumar', tempPass: 'TMP@12345', channel: 'Email+SMS' }, expected: 'Internet banking activated on first login', actual: 'Email delivery failed - SMTP timeout', time: '12.5s' },
    { id: 'TC-ONB-012', name: 'Mobile banking registration', priority: 'P0', status: 'pass', steps: ['Download mobile app', 'Register with account number', 'Verify via OTP', 'Set MPIN'], testData: { platform: 'Android/iOS', otp: '123456', mpinLength: 6 }, expected: 'Mobile banking activated with MPIN', actual: 'MPIN set successfully', time: '7.8s' },
  ],
  'Login & Account': [
    { id: 'TC-LGN-001', name: 'Valid username/password login', priority: 'P0', status: 'pass', steps: ['Navigate to login page', 'Enter valid username', 'Enter valid password', 'Click Login button'], testData: { username: 'rajesh.kumar', password: 'Test@12345', browser: 'Chrome' }, expected: 'Redirect to dashboard with welcome message', actual: 'Dashboard loaded in 1.2s', time: '2.1s' },
    { id: 'TC-LGN-002', name: 'OTP-based 2FA authentication', priority: 'P0', status: 'pass', steps: ['Login with credentials', 'System sends OTP to registered mobile', 'Enter 6-digit OTP', 'Verify and grant access'], testData: { otp: '456789', channel: 'SMS', validity: '5min' }, expected: 'OTP verified, session created', actual: 'Session token generated', time: '8.2s' },
    { id: 'TC-LGN-003', name: 'Biometric login (fingerprint/face)', priority: 'P0', status: 'pass', steps: ['Open mobile app', 'Tap biometric login', 'Scan fingerprint/face', 'Verify match and grant access'], testData: { biometricType: 'Fingerprint', device: 'Samsung S23', threshold: 0.95 }, expected: 'Biometric match, instant login', actual: 'Match score: 0.98 - Access granted', time: '1.5s' },
    { id: 'TC-LGN-004', name: 'Session management validation', priority: 'P0', status: 'pass', steps: ['Login successfully', 'Note session token', 'Wait for timeout period', 'Verify auto-logout'], testData: { sessionTimeout: '15min', tokenType: 'JWT', refreshEnabled: true }, expected: 'Session expires after 15min of inactivity', actual: 'Auto-logout triggered at 15:00', time: '900.0s' },
    { id: 'TC-LGN-005', name: 'Account summary view', priority: 'P0', status: 'pass', steps: ['Login to dashboard', 'Navigate to account summary', 'Verify all accounts listed', 'Check balance accuracy'], testData: { accounts: ['Savings', 'Current', 'FD'], expectedCount: 3 }, expected: 'All accounts displayed with correct balances', actual: '3 accounts listed with correct balances', time: '2.8s' },
    { id: 'TC-LGN-006', name: 'Balance enquiry', priority: 'P0', status: 'pass', steps: ['Select account', 'Click "Check Balance"', 'Verify balance amount', 'Check last updated timestamp'], testData: { accountNo: 'ACC2024000012', expectedBalance: 45250.75 }, expected: 'Current balance: $45,250.75', actual: 'Balance: $45,250.75 as of 10:30 AM', time: '1.2s' },
    { id: 'TC-LGN-007', name: 'Mini statement (last 10 txns)', priority: 'P1', status: 'pass', steps: ['Select account', 'Click "Mini Statement"', 'Verify 10 transactions displayed', 'Check date ordering'], testData: { transactionCount: 10, sortOrder: 'DESC', dateRange: 'Last 30 days' }, expected: 'Last 10 transactions in reverse chronological order', actual: '10 transactions displayed correctly', time: '1.8s' },
    { id: 'TC-LGN-008', name: 'Detailed statement download', priority: 'P1', status: 'pass', steps: ['Select account and date range', 'Choose format (PDF/CSV)', 'Click Download', 'Verify file content'], testData: { fromDate: '2026-01-01', toDate: '2026-02-25', format: 'PDF' }, expected: 'Statement PDF generated with all transactions', actual: 'PDF downloaded - 3 pages, 47 transactions', time: '4.5s' },
    { id: 'TC-LGN-009', name: 'Account details view', priority: 'P1', status: 'pass', steps: ['Navigate to account details', 'Verify account type, number, branch', 'Check IFSC code', 'Verify nominee info'], testData: { accountNo: 'ACC2024000012', branch: 'Main Branch', ifsc: 'BANK0001234' }, expected: 'All account details displayed accurately', actual: 'Account details match records', time: '1.5s' },
    { id: 'TC-LGN-010', name: 'Nominee details display', priority: 'P1', status: 'pass', steps: ['Navigate to nominee section', 'Verify nominee name and relationship', 'Check nominee percentage', 'Verify last update date'], testData: { nomineeName: 'Priya Kumar', relationship: 'Spouse', percentage: 100 }, expected: 'Nominee details displayed correctly', actual: 'Nominee: Priya Kumar (Spouse) - 100%', time: '1.3s' },
    { id: 'TC-LGN-011', name: 'Standing instructions list', priority: 'P2', status: 'pass', steps: ['Navigate to standing instructions', 'View active SIs', 'Verify amount and frequency', 'Check next execution date'], testData: { activeCount: 3, types: ['SIP', 'Insurance', 'Rent'] }, expected: '3 active standing instructions displayed', actual: '3 SIs listed with next dates', time: '2.0s' },
    { id: 'TC-LGN-012', name: 'Recent transactions view', priority: 'P0', status: 'pass', steps: ['View dashboard widget', 'Check last 5 transactions', 'Verify amounts and descriptions', 'Click to see full history'], testData: { widgetCount: 5, includesPending: true }, expected: 'Last 5 transactions with correct details', actual: '5 recent txns displayed', time: '1.1s' },
  ],
  'Deposit Account': [
    { id: 'TC-DEP-001', name: 'Savings account opening', priority: 'P0', status: 'pass', steps: ['Select "Open Savings Account"', 'Fill account details', 'Submit with initial deposit', 'Verify account created'], testData: { type: 'Savings', minBalance: 1000, interestRate: '3.5%', currency: 'USD' }, expected: 'Savings account opened with assigned number', actual: 'Account ACC2024000015 created', time: '5.2s' },
    { id: 'TC-DEP-002', name: 'Fixed deposit creation', priority: 'P0', status: 'pass', steps: ['Select "Create Fixed Deposit"', 'Enter amount and tenure', 'Choose interest payout frequency', 'Confirm FD creation'], testData: { amount: 100000, tenure: '12 months', rate: '7.25%', payout: 'Quarterly' }, expected: 'FD created with maturity details calculated', actual: 'FD-2024-001: Maturity $107,250', time: '3.8s' },
    { id: 'TC-DEP-003', name: 'Recurring deposit setup', priority: 'P1', status: 'pass', steps: ['Select "Create RD"', 'Set monthly amount', 'Choose tenure', 'Set auto-debit date'], testData: { monthlyAmount: 5000, tenure: '24 months', debitDate: 5, autoDebit: true }, expected: 'RD created with monthly debit schedule', actual: 'RD-2024-003 active, next debit: Mar 5', time: '3.2s' },
    { id: 'TC-DEP-004', name: 'Interest calculation verification', priority: 'P0', status: 'pass', steps: ['Open existing FD details', 'Calculate expected interest', 'Compare with system calculation', 'Verify compounding frequency'], testData: { principal: 100000, rate: 7.25, tenure: 12, compounding: 'Quarterly' }, expected: 'Interest: $7,250 (simple) or $7,452 (compound)', actual: 'Compound interest: $7,452.10', time: '1.5s' },
    { id: 'TC-DEP-005', name: 'Maturity calculation', priority: 'P0', status: 'pass', steps: ['View FD maturity details', 'Verify maturity date', 'Check maturity amount', 'Verify auto-renewal settings'], testData: { startDate: '2026-01-01', tenure: '12M', principal: 100000, rate: 7.25 }, expected: 'Maturity Date: 2027-01-01, Amount: $107,452.10', actual: 'Maturity: Jan 1, 2027 - $107,452.10', time: '1.2s' },
    { id: 'TC-DEP-006', name: 'Premature withdrawal', priority: 'P1', status: 'pass', steps: ['Select FD for premature closure', 'System shows penalty details', 'Confirm withdrawal', 'Verify reduced interest applied'], testData: { fdAmount: 100000, completedMonths: 6, penaltyRate: '1%' }, expected: 'Penalty applied, reduced interest credited', actual: 'Penalty: $500, Net credit: $102,625', time: '4.1s' },
    { id: 'TC-DEP-007', name: 'Auto-renewal setup', priority: 'P1', status: 'pass', steps: ['Open FD settings', 'Enable auto-renewal', 'Select renewal terms', 'Confirm settings'], testData: { renewalType: 'Principal + Interest', newTenure: '12M', notify: true }, expected: 'Auto-renewal enabled for maturity', actual: 'Auto-renewal: ON (P+I for 12M)', time: '1.8s' },
    { id: 'TC-DEP-008', name: 'Joint holder addition', priority: 'P1', status: 'pass', steps: ['Open account settings', 'Click "Add Joint Holder"', 'Enter joint holder KYC details', 'Set operating instructions'], testData: { jointHolder: 'Priya Kumar', relationship: 'Spouse', mode: 'Either or Survivor' }, expected: 'Joint holder added with specified mode', actual: 'Joint holder: Priya Kumar - E/S mode', time: '6.5s' },
    { id: 'TC-DEP-009', name: 'Nomination update', priority: 'P1', status: 'pass', steps: ['Navigate to nomination', 'Update nominee details', 'Set percentage allocation', 'Submit with authentication'], testData: { nominee: 'Amit Kumar', relation: 'Son', percentage: 100, otp: '123456' }, expected: 'Nominee updated successfully', actual: 'Nominee changed to Amit Kumar (Son)', time: '3.5s' },
    { id: 'TC-DEP-010', name: 'TDS calculation verification', priority: 'P1', status: 'fail', steps: ['View interest earned for FY', 'Check TDS threshold (rs 40,000)', 'Verify TDS deduction rate', 'Cross-check with Form 26AS'], testData: { totalInterest: 55000, threshold: 40000, tdsRate: '10%', pan: 'ABCDE1234F' }, expected: 'TDS of 10% deducted on interest above threshold', actual: 'TDS calculation mismatch: Expected $1,500, Got $1,375', time: '2.2s' },
    { id: 'TC-DEP-011', name: 'Interest certificate generation', priority: 'P2', status: 'pass', steps: ['Select financial year', 'Click "Generate Certificate"', 'Download PDF certificate', 'Verify details accuracy'], testData: { fy: '2025-26', format: 'PDF', includesTDS: true }, expected: 'Interest certificate with TDS details', actual: 'Certificate generated for FY 2025-26', time: '3.8s' },
    { id: 'TC-DEP-012', name: 'Account closure process', priority: 'P1', status: 'pass', steps: ['Request account closure', 'Clear all pending transactions', 'Calculate final settlement', 'Transfer balance to linked account'], testData: { reason: 'Account consolidation', balance: 45250.75, transferTo: 'ACC2024000001' }, expected: 'Account closed, balance transferred', actual: 'Closed. $45,250.75 transferred', time: '8.2s' },
  ],
  'Debit Card': [
    { id: 'TC-DC-001', name: 'New debit card request', priority: 'P0', status: 'pass', steps: ['Navigate to card services', 'Select "Request New Card"', 'Choose card variant', 'Confirm mailing address'], testData: { cardType: 'Platinum', network: 'Visa', deliveryType: 'Courier' }, expected: 'Card request submitted, delivery in 7 days', actual: 'Request #CR-2024-001 submitted', time: '2.5s' },
    { id: 'TC-DC-002', name: 'Card activation', priority: 'P0', status: 'pass', steps: ['Receive physical card', 'Enter card number in portal', 'Set initial PIN via IVR/online', 'Make test transaction'], testData: { cardLast4: '4567', activationMethod: 'Online', testAmount: 1 }, expected: 'Card activated, test transaction successful', actual: 'Card active, $1 test charged and reversed', time: '15.2s' },
    { id: 'TC-DC-003', name: 'PIN generation', priority: 'P0', status: 'pass', steps: ['Select "Generate PIN"', 'Verify via OTP', 'Enter new 4-digit PIN', 'Confirm PIN'], testData: { pinLength: 4, otp: '789012', channel: 'Online' }, expected: 'New PIN set successfully', actual: 'PIN generated - Active immediately', time: '5.8s' },
    { id: 'TC-DC-004', name: 'PIN change', priority: 'P0', status: 'pass', steps: ['Select "Change PIN"', 'Enter current PIN', 'Enter new PIN', 'Confirm new PIN'], testData: { oldPin: '1234', newPin: '5678', confirmPin: '5678' }, expected: 'PIN changed successfully', actual: 'PIN updated', time: '3.2s' },
    { id: 'TC-DC-005', name: 'Card block/unblock', priority: 'P0', status: 'pass', steps: ['Navigate to card management', 'Click "Block Card"', 'Select block reason', 'Confirm with OTP'], testData: { reason: 'Lost/Stolen', blockType: 'Temporary', otp: '456789' }, expected: 'Card blocked immediately', actual: 'Card blocked at 10:30 AM UTC', time: '2.1s' },
    { id: 'TC-DC-006', name: 'Transaction limit setup', priority: 'P1', status: 'pass', steps: ['Open card settings', 'Set daily transaction limit', 'Set per-transaction limit', 'Set ATM withdrawal limit'], testData: { dailyLimit: 50000, perTxnLimit: 25000, atmLimit: 20000 }, expected: 'All limits updated successfully', actual: 'Limits active: Daily $50K, Per-txn $25K, ATM $20K', time: '2.5s' },
    { id: 'TC-DC-007', name: 'International usage toggle', priority: 'P1', status: 'pass', steps: ['Navigate to card controls', 'Toggle international usage ON', 'Set travel dates', 'Confirm with OTP'], testData: { enabled: true, countries: ['US', 'UK', 'EU'], dateRange: '2026-03-01 to 2026-03-15' }, expected: 'International usage enabled for travel dates', actual: 'International ON: Mar 1-15', time: '3.0s' },
    { id: 'TC-DC-008', name: 'Contactless payment enable', priority: 'P1', status: 'pass', steps: ['Open card settings', 'Enable contactless/tap payments', 'Set contactless limit', 'Test with NFC'], testData: { enabled: true, contactlessLimit: 5000, nfcRequired: true }, expected: 'Contactless enabled with limit', actual: 'Tap-to-pay active, limit: $5,000', time: '1.8s' },
    { id: 'TC-DC-009', name: 'Virtual card generation', priority: 'P1', status: 'pass', steps: ['Request virtual card', 'System generates card number', 'Display card details', 'Set validity period'], testData: { type: 'Virtual', validity: '1 month', limit: 10000 }, expected: 'Virtual card generated with temp number', actual: 'Virtual: XXXX-XXXX-XXXX-8901, Exp: Mar 2026', time: '2.2s' },
    { id: 'TC-DC-010', name: 'Card replacement request', priority: 'P1', status: 'pass', steps: ['Select "Replace Card"', 'Choose replacement reason', 'Confirm address', 'Block old card automatically'], testData: { reason: 'Damaged', oldCardLast4: '4567', sameNumber: false }, expected: 'Old card blocked, new card dispatched', actual: 'Replacement #CR-2024-002 dispatched', time: '3.5s' },
  ],
  'Student Account': [
    { id: 'TC-STU-001', name: 'Student ID verification', priority: 'P0', status: 'pass', steps: ['Upload student ID card', 'System extracts student details', 'Verify with university database', 'Confirm student status'], testData: { university: 'MIT', studentId: 'STU-2024-5678', program: 'B.Tech', year: 3 }, expected: 'Student identity verified', actual: 'Verified: MIT Student - Active', time: '5.5s' },
    { id: 'TC-STU-002', name: 'Age validation (under 25)', priority: 'P0', status: 'pass', steps: ['Extract DOB from ID', 'Calculate age', 'Verify under 25 years', 'Apply student account type'], testData: { dob: '2003-08-20', currentAge: 22, maxAge: 25 }, expected: 'Age verified: 22 years - Eligible', actual: 'Age check passed: 22 < 25', time: '1.0s' },
    { id: 'TC-STU-003', name: 'Zero balance account opening', priority: 'P0', status: 'pass', steps: ['Select Student Account type', 'Verify zero minimum balance', 'Create account without deposit', 'Confirm no minimum balance charges'], testData: { minBalance: 0, maintenanceFee: 0, accountType: 'Student Savings' }, expected: 'Account opened with zero balance', actual: 'Student account active - $0 min balance', time: '3.2s' },
    { id: 'TC-STU-004', name: 'Scholarship credit processing', priority: 'P1', status: 'pass', steps: ['University initiates scholarship transfer', 'System validates student account', 'Credit scholarship amount', 'Send notification to student'], testData: { scholarshipName: 'Merit Scholarship', amount: 5000, source: 'University Fund' }, expected: 'Scholarship credited with notification', actual: '$5,000 credited - SMS sent', time: '4.2s' },
    { id: 'TC-STU-005', name: 'Education loan linkage', priority: 'P1', status: 'pass', steps: ['Apply for education loan', 'Link loan to student account', 'Set disbursement schedule', 'Verify loan account created'], testData: { loanAmount: 50000, tenure: '60 months', rate: '8.5%', linkedTo: 'STU-ACC-001' }, expected: 'Loan linked to student account', actual: 'Loan EL-2024-001 linked', time: '6.8s' },
    { id: 'TC-STU-006', name: 'Student discount activation', priority: 'P2', status: 'pass', steps: ['Verify student status', 'Apply student discount package', 'Waive transaction fees', 'Enable free ATM withdrawals'], testData: { discountPackage: 'Student Basic', freeATM: 10, txnFeeWaiver: true }, expected: 'Student discounts applied', actual: 'Package active: 10 free ATM, 0 txn fee', time: '2.0s' },
    { id: 'TC-STU-007', name: 'Spending limit setup', priority: 'P1', status: 'pass', steps: ['Set daily spending limit', 'Set online transaction limit', 'Enable spend category alerts', 'Configure notifications'], testData: { dailyLimit: 500, onlineLimit: 200, alertCategories: ['Food', 'Shopping'] }, expected: 'Spending limits configured', actual: 'Limits set: $500/day, $200 online', time: '1.8s' },
    { id: 'TC-STU-008', name: 'Parent/Guardian linkage', priority: 'P1', status: 'pass', steps: ['Add parent as guardian', 'Set view-only access', 'Enable spending alerts to parent', 'Verify guardian portal access'], testData: { guardian: 'Mr. Kumar', relationship: 'Father', accessLevel: 'View Only', alerts: true }, expected: 'Guardian linked with view access', actual: 'Guardian linked - Alerts enabled', time: '4.5s' },
    { id: 'TC-STU-009', name: 'Monthly allowance auto-credit', priority: 'P2', status: 'pass', steps: ['Parent sets up standing instruction', 'Configure monthly amount', 'Set credit date', 'Verify auto-debit from parent account'], testData: { amount: 500, creditDate: 1, fromAccount: 'Parent-SAV-001', frequency: 'Monthly' }, expected: 'Monthly $500 auto-credited on 1st', actual: 'SI active: $500/month from Parent', time: '3.2s' },
    { id: 'TC-STU-010', name: 'Account upgrade on graduation', priority: 'P2', status: 'not_run', steps: ['Student completes education', 'Verify graduation date', 'Convert to regular savings', 'Apply new terms and conditions'], testData: { graduationDate: '2027-05-30', newType: 'Regular Savings', minBalance: 1000 }, expected: 'Account upgraded to regular savings', actual: '-', time: '-' },
  ],
  'Senior Citizen': [
    { id: 'TC-SC-001', name: 'Age verification (60+)', priority: 'P0', status: 'pass', steps: ['Extract DOB from ID', 'Calculate age', 'Verify 60 years or above', 'Apply senior citizen category'], testData: { dob: '1964-03-15', currentAge: 61, minAge: 60 }, expected: 'Age verified: 61 years - Eligible for senior citizen', actual: 'Senior citizen status: Confirmed', time: '1.0s' },
    { id: 'TC-SC-002', name: 'Higher interest rate application', priority: 'P0', status: 'pass', steps: ['Open savings/FD account', 'System detects senior status', 'Apply additional 0.50% interest', 'Display enhanced rate'], testData: { baseRate: '7.25%', seniorBonus: '0.50%', effectiveRate: '7.75%' }, expected: 'Interest rate: 7.75% (7.25% + 0.50% senior bonus)', actual: 'Rate applied: 7.75%', time: '1.5s' },
    { id: 'TC-SC-003', name: 'Pension credit setup', priority: 'P0', status: 'pass', steps: ['Configure pension auto-credit', 'Link pension provider', 'Set credit notification', 'Verify first credit'], testData: { pensionProvider: 'Govt Pension Fund', amount: 2500, creditDate: 1, frequency: 'Monthly' }, expected: 'Pension auto-credit configured', actual: 'Pension linked: $2,500/month on 1st', time: '4.5s' },
    { id: 'TC-SC-004', name: 'Nomination mandatory check', priority: 'P0', status: 'pass', steps: ['Open account for senior citizen', 'System enforces nomination', 'Cannot proceed without nominee', 'Nominee form displayed'], testData: { nominationRequired: true, maxNominees: 2, skipAllowed: false }, expected: 'Nomination form mandatory - cannot skip', actual: 'Blocked: "Nominee required for senior accounts"', time: '0.8s' },
    { id: 'TC-SC-005', name: 'Joint holder with survivor clause', priority: 'P0', status: 'pass', steps: ['Add joint holder', 'Select survivor clause', 'Verify legal compliance', 'Generate joint mandate'], testData: { jointHolder: 'Priya Kumar', clause: 'Either or Survivor', relationship: 'Spouse' }, expected: 'Survivor clause applied to joint account', actual: 'Joint A/C: E/S clause active', time: '5.2s' },
    { id: 'TC-SC-006', name: 'Auto-sweep facility setup', priority: 'P1', status: 'pass', steps: ['Enable auto-sweep', 'Set sweep threshold', 'Link to FD/RD', 'Verify sweep execution'], testData: { threshold: 50000, sweepTo: 'Auto-FD', minSweep: 10000, tenure: '12M' }, expected: 'Auto-sweep: amounts above $50K to FD', actual: 'Sweep active: >$50K to Auto-FD', time: '3.0s' },
    { id: 'TC-SC-007', name: 'Medical emergency overdraft', priority: 'P1', status: 'pass', steps: ['Request emergency overdraft', 'Verify senior citizen status', 'Approve pre-approved limit', 'Credit overdraft amount'], testData: { odLimit: 25000, rate: '12%', approval: 'Auto', reason: 'Medical Emergency' }, expected: 'Overdraft of $25,000 at 12% approved', actual: 'OD-2024-001: $25,000 approved', time: '6.5s' },
    { id: 'TC-SC-008', name: 'TDS exemption (Form 15H)', priority: 'P1', status: 'pass', steps: ['Submit Form 15H declaration', 'System validates senior status', 'Mark TDS exemption', 'No TDS deduction on interest'], testData: { form: '15H', fy: '2025-26', estimatedIncome: 450000, taxableLimit: 500000 }, expected: 'TDS exempted via Form 15H', actual: 'Form 15H accepted - No TDS', time: '2.8s' },
    { id: 'TC-SC-009', name: 'Large print statement', priority: 'P2', status: 'pass', steps: ['Request statement preferences', 'Select large print option', 'Generate statement in large font', 'Verify readability'], testData: { fontSize: '16pt', format: 'PDF', pageSize: 'A4', contrast: 'High' }, expected: 'Statement in 16pt font, high contrast', actual: 'Large print PDF generated', time: '4.2s' },
    { id: 'TC-SC-010', name: 'Priority service flag', priority: 'P2', status: 'pass', steps: ['Mark account as senior citizen', 'Enable priority queue', 'Set dedicated helpline', 'Activate doorstep banking'], testData: { priority: 'VIP', helpline: '1800-SENIOR', doorstep: true }, expected: 'Priority services activated', actual: 'All priority flags set', time: '1.5s' },
  ],
  'RESP Account': [
    { id: 'TC-RESP-001', name: 'Beneficiary child registration', priority: 'P0', status: 'pass', steps: ['Enter child details', 'Provide SIN number', 'Verify child age (under 17)', 'Link to subscriber account'], testData: { childName: 'Amit Kumar', sin: '123-456-789', dob: '2015-06-20', age: 10 }, expected: 'Beneficiary registered with SIN', actual: 'Beneficiary: Amit Kumar registered', time: '4.5s' },
    { id: 'TC-RESP-002', name: 'Government grant application (CESG)', priority: 'P0', status: 'pass', steps: ['Submit CESG application', 'Verify family income bracket', 'Calculate grant amount (20%)', 'Credit grant to RESP'], testData: { contribution: 2500, grantRate: '20%', maxGrant: 500, familyIncome: 75000 }, expected: 'CESG grant of $500 credited', actual: 'CESG: $500 credited (20% of $2,500)', time: '8.2s' },
    { id: 'TC-RESP-003', name: 'Contribution tracking', priority: 'P0', status: 'pass', steps: ['Make contribution to RESP', 'Track lifetime contributions', 'Verify against $50,000 limit', 'Display contribution history'], testData: { currentContribution: 2500, lifetimeTotal: 25000, maxLifetime: 50000, remaining: 25000 }, expected: 'Contribution tracked: $25,000 of $50,000 used', actual: 'Lifetime: $25,000 / $50,000', time: '2.0s' },
    { id: 'TC-RESP-004', name: 'Investment allocation', priority: 'P1', status: 'pass', steps: ['Select investment options', 'Allocate between funds', 'Verify risk profile match', 'Confirm allocation'], testData: { equity: '60%', bonds: '30%', cash: '10%', riskProfile: 'Moderate' }, expected: 'Allocation: 60% equity, 30% bonds, 10% cash', actual: 'Portfolio allocated as specified', time: '3.5s' },
    { id: 'TC-RESP-005', name: 'Annual contribution limit check', priority: 'P0', status: 'fail', steps: ['Attempt contribution of $2,500', 'System checks annual limit', 'Verify carry-forward room', 'Process or reject contribution'], testData: { attemptedAmount: 2500, annualLimit: 2500, usedThisYear: 1000, carryForward: 5000 }, expected: 'Contribution accepted (within limit)', actual: 'Error: Annual limit validation incorrect', time: '1.5s' },
    { id: 'TC-RESP-006', name: 'Education withdrawal (EAP)', priority: 'P0', status: 'pass', steps: ['Submit proof of enrollment', 'Request Educational Assistance Payment', 'Verify eligible institution', 'Process withdrawal'], testData: { institution: 'University of Toronto', program: 'Engineering', eapAmount: 10000 }, expected: 'EAP of $10,000 processed', actual: 'EAP processed: $10,000 to student', time: '6.5s' },
    { id: 'TC-RESP-007', name: 'Non-education withdrawal penalty', priority: 'P1', status: 'pass', steps: ['Request non-education withdrawal', 'System calculates penalty', 'Return government grants', 'Deduct penalty from payout'], testData: { withdrawalAmount: 20000, grantsToReturn: 3500, taxRate: '33%', penaltyAmount: 6600 }, expected: 'Grants returned + 33% tax on growth', actual: 'Net payout: $10,000 after penalties', time: '4.8s' },
    { id: 'TC-RESP-008', name: 'Beneficiary change', priority: 'P1', status: 'pass', steps: ['Request beneficiary change', 'Verify new beneficiary eligibility', 'Transfer assets to new beneficiary', 'Update CESG allocation'], testData: { oldBeneficiary: 'Amit Kumar', newBeneficiary: 'Sara Kumar', relationship: 'Sibling' }, expected: 'Beneficiary changed to Sara Kumar', actual: 'Changed: Sara Kumar (Sibling)', time: '5.2s' },
    { id: 'TC-RESP-009', name: 'Account maturity handling', priority: 'P1', status: 'not_run', steps: ['RESP reaches 35-year limit', 'System notifies subscriber', 'Options: withdraw, transfer to RRSP', 'Process maturity action'], testData: { yearsActive: 35, totalValue: 150000, options: ['Withdraw', 'RRSP Transfer'] }, expected: 'Maturity options presented at 35 years', actual: '-', time: '-' },
    { id: 'TC-RESP-010', name: 'Tax-free growth verification', priority: 'P0', status: 'pass', steps: ['View RESP growth report', 'Verify no tax on investment gains', 'Confirm CESG not taxable', 'Generate tax statement'], testData: { contributions: 25000, grants: 5000, growth: 8000, totalValue: 38000 }, expected: 'Growth tax-free, only EAP taxable to student', actual: 'Tax report: $0 tax on growth', time: '2.5s' },
  ],
  'Single Account': [
    { id: 'TC-SNG-001', name: 'Individual account opening', priority: 'P0', status: 'pass', steps: ['Select "Individual Account"', 'Complete KYC', 'Set as single signatory', 'Activate account'], testData: { holder: 'Rajesh Kumar', type: 'Savings', signatory: 'Single' }, expected: 'Individual account opened', actual: 'Account ACC-SNG-001 active', time: '5.0s' },
    { id: 'TC-SNG-002', name: 'Single signatory setup', priority: 'P0', status: 'pass', steps: ['Verify single holder', 'Set signing authority', 'No co-signatory required', 'Confirm mandate'], testData: { signatoryCount: 1, authority: 'Full', mandate: 'Self' }, expected: 'Single signatory mandate set', actual: 'Mandate: Self-operated', time: '2.0s' },
    { id: 'TC-SNG-003', name: 'Transaction authorization', priority: 'P0', status: 'pass', steps: ['Initiate transaction', 'OTP verification', 'No second approval needed', 'Transaction processed'], testData: { amount: 25000, authMethod: 'OTP', approvers: 1 }, expected: 'Single-factor auth sufficient', actual: 'Authorized and processed', time: '5.5s' },
    { id: 'TC-SNG-004', name: 'Power of Attorney (PoA) addition', priority: 'P1', status: 'pass', steps: ['Submit PoA request', 'Upload PoA document', 'Verify notarization', 'Activate PoA access'], testData: { poaHolder: 'Advocate Sharma', scope: 'Financial', validity: '2027-12-31' }, expected: 'PoA activated with limited scope', actual: 'PoA active until Dec 2027', time: '6.8s' },
    { id: 'TC-SNG-005', name: 'Mandate letter upload', priority: 'P2', status: 'pass', steps: ['Upload mandate letter', 'Verify signatures', 'Update account instructions', 'Confirm changes'], testData: { mandateType: 'Third Party Payment', docFormat: 'PDF', verified: true }, expected: 'Mandate letter processed', actual: 'Mandate updated', time: '3.2s' },
    { id: 'TC-SNG-006', name: 'Account statement delivery', priority: 'P1', status: 'pass', steps: ['Set statement preferences', 'Choose delivery method', 'Set frequency', 'Verify delivery'], testData: { method: 'Email', frequency: 'Monthly', format: 'PDF', email: 'rajesh@email.com' }, expected: 'Monthly email statement configured', actual: 'Email delivery: Monthly PDF', time: '1.5s' },
    { id: 'TC-SNG-007', name: 'Cheque book request', priority: 'P1', status: 'pass', steps: ['Request cheque book', 'Select number of leaves', 'Confirm delivery address', 'Track dispatch'], testData: { leaves: 25, type: 'CTS-2010', delivery: 'Registered Address' }, expected: 'Cheque book dispatched', actual: 'CB-2024-001: 25 leaves dispatched', time: '2.8s' },
    { id: 'TC-SNG-008', name: 'Standing instruction setup', priority: 'P1', status: 'pass', steps: ['Create standing instruction', 'Set beneficiary and amount', 'Set frequency and dates', 'Activate SI'], testData: { payee: 'Landlord', amount: 15000, frequency: 'Monthly', startDate: '2026-03-01' }, expected: 'SI active for monthly rent', actual: 'SI-2024-001: Monthly $15,000', time: '3.5s' },
    { id: 'TC-SNG-009', name: 'Sweep-in/sweep-out configuration', priority: 'P2', status: 'pass', steps: ['Enable sweep facility', 'Set sweep threshold', 'Link FD for sweep', 'Test sweep trigger'], testData: { sweepOutThreshold: 100000, sweepInThreshold: 25000, linkedFD: true }, expected: 'Sweep configured at thresholds', actual: 'Sweep active: Out >$100K, In <$25K', time: '2.5s' },
    { id: 'TC-SNG-010', name: 'Account closure process', priority: 'P1', status: 'pass', steps: ['Request account closure', 'Cancel all SIs and mandates', 'Settle pending transactions', 'Transfer final balance'], testData: { pendingSI: 2, finalBalance: 32500, transferTo: 'Other Bank A/C' }, expected: 'Account closed after settlement', actual: 'Closed. $32,500 transferred', time: '10.5s' },
  ],
  'Corporate Account': [
    { id: 'TC-CORP-001', name: 'Business registration verification', priority: 'P0', status: 'pass', steps: ['Upload business registration certificate', 'Verify with registrar database', 'Validate company name and CIN', 'Approve business entity'], testData: { company: 'TechCorp Ltd', cin: 'U72200KA2020PTC123456', type: 'Private Limited' }, expected: 'Business verified with registrar', actual: 'Verified: TechCorp Ltd - Active', time: '8.5s' },
    { id: 'TC-CORP-002', name: 'Multiple signatory setup', priority: 'P0', status: 'pass', steps: ['Add authorized signatories', 'Set signing rules', 'Configure approval matrix', 'Test multi-sign workflow'], testData: { signatories: ['CEO', 'CFO', 'Director'], rule: 'Any 2 of 3', threshold: 50000 }, expected: 'Multi-signatory: Any 2 of 3 for >$50K', actual: 'Approval matrix configured', time: '6.2s' },
    { id: 'TC-CORP-003', name: 'Board resolution upload', priority: 'P0', status: 'pass', steps: ['Upload board resolution', 'Verify authorized persons', 'Cross-check with MCA records', 'Activate corporate account'], testData: { resolution: 'BR-2024-001', date: '2026-01-15', authorizedPersons: 3 }, expected: 'Board resolution accepted', actual: 'BR verified - Account activated', time: '5.8s' },
    { id: 'TC-CORP-004', name: 'GST/Tax certificate verification', priority: 'P0', status: 'pass', steps: ['Upload GST certificate', 'Verify GSTIN with portal', 'Link tax profile', 'Enable GST-compliant invoicing'], testData: { gstin: '29ABCDE1234F1Z5', state: 'Karnataka', status: 'Active' }, expected: 'GST verified and linked', actual: 'GSTIN verified - Active', time: '4.5s' },
    { id: 'TC-CORP-005', name: 'Bulk transaction processing', priority: 'P0', status: 'pass', steps: ['Upload bulk payment file (CSV)', 'Validate all entries', 'Submit for approval', 'Process approved transactions'], testData: { fileType: 'CSV', transactions: 500, totalAmount: 2500000, format: 'NEFT' }, expected: '500 transactions processed in batch', actual: '498 success, 2 failed (invalid IFSC)', time: '45.2s' },
    { id: 'TC-CORP-006', name: 'Payroll management', priority: 'P0', status: 'pass', steps: ['Upload payroll file', 'Validate employee accounts', 'Schedule salary credit', 'Generate payslips'], testData: { employees: 150, totalPayroll: 7500000, creditDate: '2026-02-28', format: 'H2H' }, expected: '150 salary credits processed', actual: '150/150 salaries credited', time: '35.8s' },
    { id: 'TC-CORP-007', name: 'Vendor payment automation', priority: 'P1', status: 'pass', steps: ['Configure vendor master', 'Set payment terms', 'Trigger auto-payment on invoice', 'Generate payment advice'], testData: { vendors: 25, paymentTerms: 'Net 30', autoApproveLimit: 10000 }, expected: 'Auto-payments for invoices < $10K', actual: '25 vendors configured', time: '12.5s' },
    { id: 'TC-CORP-008', name: 'Multi-level approval workflow', priority: 'P0', status: 'pass', steps: ['Initiate high-value payment', 'Level 1: Manager approval', 'Level 2: Director approval', 'Level 3: CFO final approval'], testData: { amount: 500000, levels: 3, approvers: ['Manager', 'Director', 'CFO'] }, expected: '3-level approval for $500K payment', actual: 'All 3 levels approved in 2hrs', time: '7200.0s' },
    { id: 'TC-CORP-009', name: 'Corporate credit card linkage', priority: 'P1', status: 'pass', steps: ['Request corporate cards', 'Set employee card limits', 'Link to corporate account', 'Enable expense tracking'], testData: { cards: 10, perCardLimit: 25000, totalLimit: 250000 }, expected: '10 corporate cards issued and linked', actual: '10 cards active, expense tracking ON', time: '15.2s' },
    { id: 'TC-CORP-010', name: 'Cash management services', priority: 'P1', status: 'pass', steps: ['Enable cash management', 'Configure collection accounts', 'Set pooling rules', 'Activate sweep between accounts'], testData: { collectionAccounts: 5, poolingFrequency: 'Daily', masterAccount: 'CORP-MAIN-001' }, expected: 'Daily pooling from 5 accounts to master', actual: 'CMS active: 5 accounts, daily pool', time: '8.5s' },
    { id: 'TC-CORP-011', name: 'Trade finance integration', priority: 'P1', status: 'fail', steps: ['Apply for Letter of Credit', 'Upload trade documents', 'Bank verification', 'LC issuance'], testData: { lcType: 'Irrevocable', amount: 1000000, beneficiary: 'ExportCo', validity: '90 days' }, expected: 'LC issued within 24 hours', actual: 'Error: Trade module integration timeout', time: '86400.0s' },
    { id: 'TC-CORP-012', name: 'Regulatory compliance check', priority: 'P0', status: 'pass', steps: ['Run compliance scan', 'Check AML/KYC status', 'Verify director screening', 'Generate compliance report'], testData: { checks: ['AML', 'KYC', 'PEP', 'Sanctions'], directors: 3, frequency: 'Quarterly' }, expected: 'All compliance checks passed', actual: 'Compliance: 4/4 checks passed', time: '12.0s' },
  ],
  'Joint Account': [
    { id: 'TC-JNT-001', name: 'Joint holder registration', priority: 'P0', status: 'pass', steps: ['Add primary holder details', 'Add joint holder details', 'Both complete KYC', 'Set operating mode'], testData: { primary: 'Rajesh Kumar', joint: 'Priya Kumar', relationship: 'Spouse', mode: 'Either or Survivor' }, expected: 'Joint account with 2 holders', actual: 'Joint A/C created: 2 holders', time: '8.5s' },
    { id: 'TC-JNT-002', name: 'Either or Survivor mode', priority: 'P0', status: 'pass', steps: ['Set mode to "Either or Survivor"', 'Primary holder makes transaction', 'Joint holder makes transaction', 'Both should succeed independently'], testData: { mode: 'Either or Survivor', txnByPrimary: true, txnByJoint: true }, expected: 'Both holders can transact independently', actual: 'Both transactions successful', time: '6.2s' },
    { id: 'TC-JNT-003', name: 'Both to sign mode', priority: 'P0', status: 'pass', steps: ['Set mode to "Both to Sign"', 'Primary initiates transaction', 'Joint holder must approve', 'Transaction processed after both approve'], testData: { mode: 'Both to Sign', initiator: 'Primary', approver: 'Joint' }, expected: 'Transaction needs both approvals', actual: 'Blocked until joint holder approved', time: '12.5s' },
    { id: 'TC-JNT-004', name: 'Primary holder designation', priority: 'P1', status: 'pass', steps: ['Verify primary holder assignment', 'Check primary receives statements', 'Primary has admin rights', 'Joint has transactional rights'], testData: { primary: 'Rajesh Kumar', adminRights: true, statementTo: 'Primary' }, expected: 'Primary gets admin + statements', actual: 'Primary: Admin rights confirmed', time: '2.0s' },
    { id: 'TC-JNT-005', name: 'Joint holder modification', priority: 'P1', status: 'pass', steps: ['Request to change joint holder', 'Submit new holder KYC', 'Both existing holders approve', 'Update account records'], testData: { removeHolder: 'Priya Kumar', addHolder: 'Amit Kumar', relationship: 'Brother', otp: '789012' }, expected: 'Joint holder changed with both approvals', actual: 'Holder changed: Amit Kumar (Brother)', time: '10.5s' },
    { id: 'TC-JNT-006', name: 'Survivor claim process', priority: 'P0', status: 'pass', steps: ['Report holder demise', 'Upload death certificate', 'Verify survivor status', 'Transfer full ownership'], testData: { deceased: 'Primary Holder', survivor: 'Joint Holder', certificate: 'DC-2024-001' }, expected: 'Account transferred to survivor', actual: 'Full ownership to survivor', time: '48.0s' },
    { id: 'TC-JNT-007', name: 'Death certificate processing', priority: 'P0', status: 'pass', steps: ['Upload death certificate', 'Verify certificate authenticity', 'Freeze account temporarily', 'Initiate succession process'], testData: { certificateNo: 'DC-2024-001', issuedBy: 'Municipal Corp', date: '2026-02-01' }, expected: 'Certificate verified, account frozen', actual: 'Verified. Account frozen for succession', time: '24.0s' },
    { id: 'TC-JNT-008', name: 'Account conversion (joint to single)', priority: 'P1', status: 'pass', steps: ['Request conversion', 'Joint holder consent or death certificate', 'Process conversion', 'Update account type'], testData: { from: 'Joint', to: 'Single', reason: 'Mutual Agreement', consent: true }, expected: 'Converted to single holder account', actual: 'Converted: Single A/C - Rajesh Kumar', time: '8.2s' },
    { id: 'TC-JNT-009', name: 'Tax liability split', priority: 'P1', status: 'pass', steps: ['View joint account tax report', 'Split interest income proportionally', 'Generate individual tax certificates', 'Verify TDS allocation'], testData: { totalInterest: 10000, primaryShare: '60%', jointShare: '40%', tdsRate: '10%' }, expected: 'Interest split: $6,000 (P) / $4,000 (J)', actual: 'Split: $6,000 + $4,000, TDS: $1,000', time: '3.5s' },
    { id: 'TC-JNT-010', name: 'Communication preference per holder', priority: 'P2', status: 'pass', steps: ['Set individual notification preferences', 'Primary: Email + SMS', 'Joint: Email only', 'Verify separate notifications'], testData: { primaryPref: ['Email', 'SMS'], jointPref: ['Email'], language: 'English' }, expected: 'Each holder receives per their preference', actual: 'Separate notifications configured', time: '2.0s' },
  ],
};

// ========== STYLES ==========
const S = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", padding: 20 },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 700, background: 'linear-gradient(90deg, #4ecca3, #3498db)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
  subtitle: { color: '#8892b0', fontSize: 14, marginTop: 4 },
  statsRow: { display: 'flex', gap: 15, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' },
  statBox: { background: '#0f3460', borderRadius: 10, padding: '12px 24px', textAlign: 'center', minWidth: 120 },
  statVal: { fontSize: 24, fontWeight: 700 },
  statLabel: { fontSize: 11, color: '#8892b0', marginTop: 2 },
  tabs: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20, justifyContent: 'center' },
  tab: (active) => ({ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: active ? '#4ecca3' : '#0f3460', color: active ? '#1a1a2e' : '#8892b0', transition: 'all 0.2s' }),
  splitPanel: { display: 'flex', gap: 20, minHeight: 600 },
  leftPanel: { flex: '0 0 55%', maxHeight: 700, overflowY: 'auto' },
  rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: 15 },
  card: { background: '#0f3460', borderRadius: 10, padding: 16, marginBottom: 10 },
  scenarioItem: (active) => ({ background: active ? 'rgba(78,204,163,0.15)' : '#0f3460', borderRadius: 8, padding: '10px 14px', marginBottom: 6, cursor: 'pointer', borderLeft: active ? '3px solid #4ecca3' : '3px solid transparent', transition: 'all 0.2s' }),
  scenarioId: { fontSize: 11, color: '#4ecca3', fontWeight: 600 },
  scenarioName: { fontSize: 13, color: '#e0e0e0', marginTop: 2 },
  badge: (type) => {
    const colors = { pass: '#4ecca3', fail: '#e74c3c', not_run: '#f39c12', P0: '#e74c3c', P1: '#f39c12', P2: '#3498db' };
    return { display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: `${colors[type] || '#666'}22`, color: colors[type] || '#666', marginLeft: 6 };
  },
  sectionTitle: { fontSize: 14, fontWeight: 600, color: '#4ecca3', marginBottom: 8, borderBottom: '1px solid #1a3a5c', paddingBottom: 6 },
  inputGroup: { marginBottom: 10 },
  label: { display: 'block', fontSize: 11, color: '#8892b0', marginBottom: 3 },
  input: { width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #1a3a5c', background: '#1a1a2e', color: '#e0e0e0', fontSize: 12, boxSizing: 'border-box' },
  processStep: (active) => ({ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, marginBottom: 4, background: active ? 'rgba(78,204,163,0.1)' : 'transparent', fontSize: 12 }),
  stepDot: (done) => ({ width: 8, height: 8, borderRadius: '50%', background: done ? '#4ecca3' : '#333', flexShrink: 0 }),
  outputBox: { background: '#1a1a2e', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 12 },
  runBtn: { background: 'linear-gradient(90deg, #4ecca3, #3498db)', border: 'none', borderRadius: 8, padding: '10px 24px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13, width: '100%', marginTop: 10 },
  progressBar: { width: '100%', height: 6, background: '#1a1a2e', borderRadius: 3, overflow: 'hidden', marginTop: 8 },
  progressFill: (pct) => ({ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #4ecca3, #3498db)', borderRadius: 3, transition: 'width 0.3s' }),
  detail: { marginTop: 10, padding: 10, background: '#1a1a2e', borderRadius: 8, fontSize: 12 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11, marginTop: 10 },
  th: { padding: '8px 6px', background: '#1a1a2e', color: '#4ecca3', textAlign: 'left', borderBottom: '1px solid #1a3a5c', fontSize: 11 },
  td: { padding: '6px', borderBottom: '1px solid #0a1628', fontSize: 11 },
};

function BankingUseCases() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processStep, setProcessStep] = useState(-1);
  const [results, setResults] = useState([]);

  const scenarios = ALL_SCENARIOS[activeTab] || [];
  const totalScenarios = Object.values(ALL_SCENARIOS).flat().length;
  const totalPass = Object.values(ALL_SCENARIOS).flat().filter(s => s.status === 'pass').length;
  const totalFail = Object.values(ALL_SCENARIOS).flat().filter(s => s.status === 'fail').length;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedScenario(null);
    setResults([]);
    setProgress(0);
    setProcessStep(-1);
  };

  const selected = selectedScenario ? scenarios.find(s => s.id === selectedScenario) : scenarios[0];

  const runTest = () => {
    if (running || !selected) return;
    setRunning(true);
    setProgress(0);
    setProcessStep(0);
    const steps = selected.steps.length;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProcessStep(step);
      setProgress(Math.round((step / steps) * 100));
      if (step >= steps) {
        clearInterval(interval);
        setRunning(false);
        setResults(prev => [...prev, {
          id: selected.id,
          name: selected.name,
          input: JSON.stringify(selected.testData).substring(0, 60) + '...',
          expected: selected.expected,
          actual: selected.actual,
          status: selected.status,
          time: selected.time,
        }]);
      }
    }, 600);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>Banking Use Cases Testing</h1>
        <p style={S.subtitle}>Comprehensive test scenarios for all banking account types and operations</p>
      </div>

      <div style={S.statsRow}>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#3498db' }}>{totalScenarios}</div><div style={S.statLabel}>Total Scenarios</div></div>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#4ecca3' }}>{totalPass}</div><div style={S.statLabel}>Passed</div></div>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#e74c3c' }}>{totalFail}</div><div style={S.statLabel}>Failed</div></div>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#f39c12' }}>{TABS.length}</div><div style={S.statLabel}>Account Types</div></div>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#9b59b6' }}>{totalScenarios > 0 ? Math.round((totalPass / totalScenarios) * 100) : 0}%</div><div style={S.statLabel}>Pass Rate</div></div>
      </div>

      <div style={S.tabs}>
        {TABS.map(tab => (
          <button key={tab} style={S.tab(activeTab === tab)} onClick={() => handleTabChange(tab)}>{tab}</button>
        ))}
      </div>

      <div style={S.splitPanel}>
        {/* LEFT PANEL: Scenarios */}
        <div style={S.leftPanel}>
          <div style={{ ...S.card, marginBottom: 6, padding: '10px 14px' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#4ecca3' }}>{activeTab}</span>
            <span style={{ float: 'right', fontSize: 11, color: '#8892b0' }}>{scenarios.length} scenarios</span>
          </div>
          {scenarios.map(sc => (
            <div key={sc.id} style={S.scenarioItem(selectedScenario === sc.id)} onClick={() => setSelectedScenario(sc.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={S.scenarioId}>{sc.id}</span>
                <div>
                  <span style={S.badge(sc.priority)}>{sc.priority}</span>
                  <span style={S.badge(sc.status)}>{sc.status === 'not_run' ? 'NOT RUN' : sc.status.toUpperCase()}</span>
                </div>
              </div>
              <div style={S.scenarioName}>{sc.name}</div>
              {selectedScenario === sc.id && (
                <div style={S.detail}>
                  <div style={{ marginBottom: 6 }}><strong style={{ color: '#4ecca3' }}>Steps:</strong></div>
                  {sc.steps.map((step, i) => (
                    <div key={i} style={{ padding: '2px 0', color: '#b0b0b0', fontSize: 11 }}>{i + 1}. {step}</div>
                  ))}
                  <div style={{ marginTop: 8 }}><strong style={{ color: '#3498db' }}>Test Data:</strong></div>
                  <pre style={{ color: '#8892b0', fontSize: 10, whiteSpace: 'pre-wrap', margin: '4px 0' }}>{JSON.stringify(sc.testData, null, 2)}</pre>
                  <div style={{ marginTop: 6 }}><strong style={{ color: '#4ecca3' }}>Expected:</strong> <span style={{ color: '#b0b0b0' }}>{sc.expected}</span></div>
                  <div><strong style={{ color: sc.status === 'fail' ? '#e74c3c' : '#4ecca3' }}>Actual:</strong> <span style={{ color: '#b0b0b0' }}>{sc.actual}</span></div>
                  <div><strong style={{ color: '#f39c12' }}>Time:</strong> <span style={{ color: '#b0b0b0' }}>{sc.time}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT PANEL: Testing UI */}
        <div style={S.rightPanel}>
          {/* Input Section */}
          <div style={S.card}>
            <div style={S.sectionTitle}>INPUT</div>
            {selected && Object.entries(selected.testData).map(([key, val]) => (
              <div key={key} style={S.inputGroup}>
                <label style={S.label}>{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toUpperCase()}</label>
                <input style={S.input} value={typeof val === 'object' ? JSON.stringify(val) : String(val)} readOnly />
              </div>
            ))}
          </div>

          {/* Process Section */}
          <div style={S.card}>
            <div style={S.sectionTitle}>PROCESS</div>
            {selected && selected.steps.map((step, i) => (
              <div key={i} style={S.processStep(processStep === i)}>
                <div style={S.stepDot(processStep > i)}/>
                <span style={{ color: processStep > i ? '#4ecca3' : processStep === i ? '#f39c12' : '#555' }}>
                  {i + 1}. {step}
                </span>
                {processStep > i && <span style={{ marginLeft: 'auto', color: '#4ecca3', fontSize: 10 }}>Done</span>}
                {processStep === i && running && <span style={{ marginLeft: 'auto', color: '#f39c12', fontSize: 10 }}>Running...</span>}
              </div>
            ))}
          </div>

          {/* Output Section */}
          <div style={S.card}>
            <div style={S.sectionTitle}>OUTPUT</div>
            <div style={S.outputBox}>
              {selected ? (
                <>
                  <div><span style={{ color: '#4ecca3' }}>Expected:</span> {selected.expected}</div>
                  <div style={{ marginTop: 4 }}><span style={{ color: selected.status === 'fail' ? '#e74c3c' : '#4ecca3' }}>Actual:</span> {selected.actual}</div>
                  <div style={{ marginTop: 4 }}><span style={{ color: '#f39c12' }}>Status:</span> <span style={S.badge(selected.status)}>{selected.status.toUpperCase()}</span></div>
                  <div style={{ marginTop: 4 }}><span style={{ color: '#3498db' }}>Execution Time:</span> {selected.time}</div>
                </>
              ) : <span style={{ color: '#555' }}>Select a scenario to view output</span>}
            </div>
          </div>

          {/* Run Button & Progress */}
          <button style={{ ...S.runBtn, opacity: running ? 0.6 : 1 }} onClick={runTest} disabled={running}>
            {running ? 'Running Test...' : 'Run Test'}
          </button>
          {progress > 0 && (
            <div style={S.progressBar}><div style={S.progressFill(progress)} /></div>
          )}

          {/* Results Table */}
          {results.length > 0 && (
            <div style={S.card}>
              <div style={S.sectionTitle}>TEST RESULTS ({results.length} executed)</div>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>ID</th>
                    <th style={S.th}>Scenario</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      <td style={S.td}>{r.id}</td>
                      <td style={S.td}>{r.name}</td>
                      <td style={S.td}><span style={S.badge(r.status)}>{r.status.toUpperCase()}</span></td>
                      <td style={S.td}>{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BankingUseCases;

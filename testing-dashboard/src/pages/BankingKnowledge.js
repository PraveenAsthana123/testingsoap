import React, { useState } from 'react';

/* ═══════════════════════════════════════════════════
   Banking Domain Knowledge - Comprehensive Reference
   ═══════════════════════════════════════════════════ */

const TABS = [
  { id: 'segments', label: 'Banking Segments' },
  { id: 'accounts', label: 'Account Types' },
  { id: 'customers', label: 'Customer Types' },
  { id: 'cards', label: 'Card Products' },
  { id: 'operations', label: 'Operations & Processes' },
  { id: 'bpm', label: 'BPM Flows' },
  { id: 'compliance', label: 'Compliance & Regulations' },
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
};

/* ═══════════════════════════════════════════════════
   DATA: Banking Segments
   ═══════════════════════════════════════════════════ */
const SEGMENTS = [
  {
    name: 'Retail Banking',
    color: C.primary,
    bg: C.primaryLight,
    icon: 'R',
    description: 'Personal banking services for individual consumers. Forms the largest customer base for most banks, offering day-to-day financial products and services.',
    services: ['Savings & Current Accounts', 'Personal Loans', 'Credit Cards', 'Fixed & Recurring Deposits', 'Home Loans', 'Insurance Products', 'Locker Facility'],
    target: 'Individual consumers, salaried professionals, self-employed individuals',
  },
  {
    name: 'Wealth Management',
    color: C.purple,
    bg: C.purpleLight,
    icon: 'W',
    description: 'Premium financial advisory and portfolio management for high-net-worth individuals. Combines investment expertise with personalized financial planning.',
    services: ['Portfolio Management', 'Investment Advisory', 'Estate Planning', 'Tax Planning', 'Alternative Investments', 'Private Equity Access', 'Family Office Services'],
    target: 'High-net-worth individuals (HNI), Ultra-HNI (UHNI) with assets above 5 Cr',
  },
  {
    name: 'Corporate Banking',
    color: C.success,
    bg: C.successLight,
    icon: 'C',
    description: 'Comprehensive financial solutions for large corporations and multinational companies. Handles high-value transactions, complex treasury needs, and structured finance.',
    services: ['Cash Management', 'Trade Finance (LC/BG)', 'Treasury Operations', 'Working Capital Finance', 'Term Loans', 'Syndicated Lending', 'Forex Services'],
    target: 'Large corporations, MNCs, public sector undertakings (PSUs)',
  },
  {
    name: 'SME Banking',
    color: C.warning,
    bg: C.warningLight,
    icon: 'S',
    description: 'Tailored banking solutions for small and medium enterprises. Bridges the gap between retail and corporate banking with accessible business finance products.',
    services: ['Business Loans', 'Merchant Services', 'POS Terminals', 'Business Current Accounts', 'Overdraft Facility', 'MSME Schemes', 'Invoice Discounting'],
    target: 'Small & medium enterprises, startups, proprietorships, partnerships',
  },
  {
    name: 'Agricultural Banking',
    color: '#15803d',
    bg: '#dcfce7',
    icon: 'A',
    description: 'Specialized banking for the agricultural sector. Supports farming communities with subsidized credit, insurance, and government scheme implementation.',
    services: ['Crop Loans', 'Farm Equipment Loans', 'Kisan Credit Card (KCC)', 'Subsidy Schemes (PM-KISAN)', 'Warehouse Receipt Finance', 'Dairy & Poultry Loans', 'Rural Insurance'],
    target: 'Farmers, agri-businesses, rural cooperatives, farmer producer organizations (FPOs)',
  },
  {
    name: 'Investment Banking',
    color: '#b91c1c',
    bg: '#fee2e2',
    icon: 'I',
    description: 'Capital markets and advisory services for corporations and institutional investors. Facilitates large-scale capital raising, M&A transactions, and securities underwriting.',
    services: ['IPO Management', 'Mergers & Acquisitions', 'Underwriting', 'Capital Markets Advisory', 'Debt Structuring', 'Private Placements', 'Restructuring Advisory'],
    target: 'Corporations, institutional investors, private equity firms, governments',
  },
  {
    name: 'Digital Banking',
    color: '#0891b2',
    bg: '#cffafe',
    icon: 'D',
    description: 'Technology-driven banking channels offering 24/7 access to financial services. Encompasses mobile banking, UPI payments, and digital-first account management.',
    services: ['Mobile Banking App', 'UPI Payments', 'Internet Banking', 'Digital Wallets', 'QR Code Payments', 'API Banking / Open Banking', 'Video KYC & e-KYC'],
    target: 'Tech-savvy customers, millennials, digital-first businesses',
  },
  {
    name: 'NRI Banking',
    color: '#7c2d12',
    bg: '#ffedd5',
    icon: 'N',
    description: 'Dedicated banking services for Non-Resident Indians. Manages foreign currency accounts, repatriation, and India-linked financial needs from overseas.',
    services: ['NRE/NRO Accounts', 'FCNR Deposits', 'Repatriation Services', 'Home Loans for NRIs', 'Portfolio Investment Scheme (PIS)', 'Remittance Services', 'Power of Attorney Management'],
    target: 'Non-resident Indians (NRIs), Persons of Indian Origin (PIOs), OCIs',
  },
];

/* ═══════════════════════════════════════════════════
   DATA: Account Types
   ═══════════════════════════════════════════════════ */
const ACCOUNT_TYPES = [
  {
    type: 'Savings Account (Regular)',
    description: 'Standard savings account for individuals to park surplus funds and earn interest. Most common account type across all banks.',
    minBalance: '1,000 - 10,000',
    interestRate: '3.5% - 4.0%',
    features: ['Passbook & cheque book', 'ATM/Debit card', 'Net & mobile banking', 'Auto-sweep to FD', 'Nomination facility'],
    eligibility: 'Indian resident, 18+ years, valid KYC (Aadhaar + PAN)',
    color: C.primary,
  },
  {
    type: 'Savings Account (Zero Balance)',
    description: 'Basic savings account with no minimum balance requirement. Part of financial inclusion initiatives like PMJDY.',
    minBalance: 'NIL (Zero)',
    interestRate: '3.5% - 4.0%',
    features: ['RuPay debit card', 'Accident insurance (Rs 2 lakh)', 'Overdraft up to 10,000', 'Direct Benefit Transfer (DBT)', 'Basic mobile banking'],
    eligibility: 'Any Indian citizen, Aadhaar-based e-KYC, no existing account in same bank',
    color: C.success,
  },
  {
    type: 'Current Account',
    description: 'Transaction-heavy account for businesses and professionals. No interest earned but offers high transaction limits and overdraft facility.',
    minBalance: '10,000 - 1,00,000',
    interestRate: '0% (No interest)',
    features: ['Unlimited transactions', 'Overdraft facility', 'Cheque book (100 leaves)', 'Cash deposit machines', 'Multi-location banking', 'RTGS/NEFT free'],
    eligibility: 'Business entity, GST registration, trade license, board resolution (for companies)',
    color: C.warning,
  },
  {
    type: 'Fixed Deposit (FD)',
    description: 'Term deposit with fixed tenure and guaranteed returns. Higher interest rates for longer tenures and senior citizens.',
    minBalance: '1,000 (minimum deposit)',
    interestRate: '6.0% - 7.5%',
    features: ['Lock-in period (7 days to 10 years)', 'Premature withdrawal (with penalty)', 'Loan against FD (up to 90%)', 'Auto-renewal option', 'Tax-saver FD (5yr lock-in, 80C)'],
    eligibility: 'Any individual/entity with savings/current account, PAN mandatory for > 50,000',
    color: C.purple,
  },
  {
    type: 'Recurring Deposit (RD)',
    description: 'Systematic monthly savings with fixed interest rate. Ideal for building a corpus through regular small deposits.',
    minBalance: '100/month (minimum installment)',
    interestRate: '6.0% - 6.5%',
    features: ['Fixed monthly installment', 'Tenure: 6 months to 10 years', 'Missed installment penalty', 'Premature withdrawal allowed', 'Nomination facility'],
    eligibility: 'Any individual with savings account, minors through guardians',
    color: '#0891b2',
  },
  {
    type: 'Student Account',
    description: 'Specially designed for students pursuing education. Offers basic banking with relaxed minimum balance and student-centric benefits.',
    minBalance: 'NIL (Zero balance)',
    interestRate: '3.5% - 4.0%',
    features: ['Free debit card (low limit)', 'Limited withdrawals/month', 'Education loan linkage', 'Scholarship credit', 'Online payment enabled', 'Auto-converts to regular at 25'],
    eligibility: 'Age 18-25, valid student ID / college admission letter, Aadhaar + PAN',
    color: '#6366f1',
  },
  {
    type: 'Senior Citizen Account',
    description: 'Enhanced savings account for senior citizens with preferential interest rates and dedicated services.',
    minBalance: '1,000 - 5,000',
    interestRate: '4.0% - 4.5% (+0.5% premium)',
    features: ['Higher FD rates (+0.25-0.50%)', 'Priority banking', 'Doorstep banking', 'Free demand drafts', 'Health insurance tie-ups', 'Pension credit'],
    eligibility: 'Age 60+ years, Aadhaar + PAN, age proof document',
    color: '#be185d',
  },
  {
    type: 'Kids Education Account',
    description: 'Long-term savings account for children operated by parent/guardian. Builds education corpus with discipline.',
    minBalance: '500 - 1,000',
    interestRate: '4.0%',
    features: ['Guardian operated until age 18', 'Gift deposit facility', 'Photo passbook', 'Financial literacy program', 'Auto-converts to savings at 18', 'Restricted withdrawal'],
    eligibility: 'Age 0-17 years, guardian must have account in same bank, birth certificate',
    color: '#ea580c',
  },
  {
    type: 'Government Register Account',
    description: 'Account linked to government schemes for receiving pensions, subsidies, and Direct Benefit Transfers (DBT).',
    minBalance: 'NIL',
    interestRate: '3.5% - 4.0%',
    features: ['DBT (Direct Benefit Transfer)', 'Pension auto-credit', 'Subsidy receipt (LPG, fertilizer)', 'Aadhaar-linked', 'Basic RuPay card', 'PM-KISAN credit'],
    eligibility: 'Government scheme beneficiary, Aadhaar mandatory, linked to NPCI mapper',
    color: '#15803d',
  },
  {
    type: 'Joint Account',
    description: 'Account with two or more holders for shared financial management. Flexible operation modes for families and business partners.',
    minBalance: '1,000 - 10,000',
    interestRate: '3.5% - 4.0%',
    features: ['Operation modes: Joint / Either-or-Survivor / Former-or-Survivor', 'All holders get debit cards', 'Joint nomination', 'Independent net banking', 'Shared cheque book'],
    eligibility: '2-4 holders, all must complete KYC, relationship declaration',
    color: '#4338ca',
  },
  {
    type: 'Salary Account',
    description: 'Employer-linked zero-balance account for salary credit. Upgraded features based on salary slab with corporate tie-up benefits.',
    minBalance: 'NIL (while employed)',
    interestRate: '3.5% - 4.0%',
    features: ['Zero balance privilege', 'Pre-approved personal loan', 'Higher ATM limits', 'Complimentary insurance', 'Salary slip integration', 'Converts to savings if no credit for 3 months'],
    eligibility: 'Employer must have corporate tie-up with bank, employee joining letter',
    color: '#0d9488',
  },
  {
    type: 'Loan Account',
    description: 'Account tracking loan disbursement, EMI payments, and outstanding balance. Created automatically upon loan sanction.',
    minBalance: 'N/A (liability account)',
    interestRate: '8.5% - 18% (varies by loan type)',
    features: ['EMI auto-debit from linked account', 'Prepayment facility', 'EMI schedule & amortization', 'Interest certificate for tax', 'Loan restructuring option', 'Foreclosure statement'],
    eligibility: 'Approved loan application, CIBIL score 650+, income proof, collateral (if secured)',
    color: C.danger,
  },
  {
    type: 'Demat Account',
    description: 'Electronic account for holding securities (shares, bonds, ETFs, mutual funds) in dematerialized form.',
    minBalance: 'NIL (AMC: 300-900/year)',
    interestRate: 'N/A (market returns)',
    features: ['Hold shares/bonds/ETFs/MFs', 'Linked to trading account', 'Pledge for margin', 'Corporate action processing', 'Nomination facility', 'e-DIS for delivery'],
    eligibility: 'PAN mandatory, linked bank account, KYC via CDSL/NSDL, age 18+',
    color: '#7c2d12',
  },
  {
    type: 'FCNR / NRE / NRO Account',
    description: 'Specialized accounts for Non-Resident Indians to manage foreign and Indian earnings with tax benefits and repatriation.',
    minBalance: '10,000 (NRE/NRO) / USD 1,000 (FCNR)',
    interestRate: 'NRE: 6-7%, NRO: 5.5-6.5%, FCNR: 2-4%',
    features: ['NRE: Fully repatriable, tax-free in India', 'NRO: Partially repatriable (USD 1M/year)', 'FCNR: Foreign currency deposit, no exchange risk', 'Joint with resident (NRO only)', 'Power of Attorney operations'],
    eligibility: 'NRI/PIO/OCI status, valid passport, overseas address proof, FEMA compliance',
    color: '#9333ea',
  },
];

/* ═══════════════════════════════════════════════════
   DATA: Customer Types
   ═══════════════════════════════════════════════════ */
const CUSTOMER_TYPES = [
  {
    type: 'Individual (Single)',
    color: C.primary,
    bg: C.primaryLight,
    icon: 'I',
    kycDocs: ['Aadhaar Card', 'PAN Card', 'Passport-size photograph', 'Address proof (utility bill / passport)', 'Income proof (for loan/credit products)'],
    kycRequirements: 'Aadhaar-based e-KYC or in-person verification. PAN mandatory for transactions > 50,000. Video KYC allowed for digital onboarding.',
    accountOptions: ['Savings (Regular/Zero Balance)', 'Current Account', 'Fixed/Recurring Deposit', 'Loan Account', 'Demat Account'],
    onboardingFlow: ['Visit branch / Online application', 'Fill application form with personal details', 'Submit KYC documents (Aadhaar + PAN)', 'Biometric / OTP verification', 'Initial deposit (if applicable)', 'Account number generated', 'Debit card & cheque book dispatched', 'Net banking credentials issued'],
  },
  {
    type: 'Joint Customers',
    color: C.success,
    bg: C.successLight,
    icon: 'J',
    kycDocs: ['KYC of ALL holders (Aadhaar + PAN each)', 'Relationship declaration form', 'Joint photograph', 'Mode of operation declaration', 'Nomination form'],
    kycRequirements: 'All holders must complete individual KYC. Mode of operation (Joint / Either-or-Survivor / Former-or-Survivor) must be declared. All holders must sign account opening form.',
    accountOptions: ['Joint Savings Account', 'Joint Current Account', 'Joint Fixed Deposit', 'Joint NRO Account (with resident)'],
    onboardingFlow: ['All holders visit branch together', 'Fill joint application form', 'Submit KYC for each holder', 'Declare mode of operation', 'Nominate beneficiary', 'Initial deposit by primary holder', 'Individual debit cards issued to all', 'Separate net banking credentials for each'],
  },
  {
    type: 'Corporate Customer',
    color: C.purple,
    bg: C.purpleLight,
    icon: 'C',
    kycDocs: ['Certificate of Incorporation', 'Memorandum & Articles of Association', 'Board Resolution for account opening', 'PAN of company', 'KYC of all authorized signatories', 'GST registration certificate', 'Audited financial statements (last 2 years)'],
    kycRequirements: 'KYC of all directors and authorized signatories. Board resolution specifying authorized persons and transaction limits. Annual review of KYC documents.',
    accountOptions: ['Corporate Current Account', 'Cash Credit / Overdraft', 'Term Loan Account', 'Trade Finance (LC/BG)', 'Payroll (Salary) Accounts for employees'],
    onboardingFlow: ['Relationship Manager assigned', 'Submit company registration documents', 'Board resolution with authorized signatories', 'KYC of all directors & signatories', 'Credit assessment & due diligence', 'Risk categorization', 'Account opening approval by branch head', 'Corporate internet banking setup', 'Cash management integration'],
  },
  {
    type: 'SME / Proprietorship',
    color: C.warning,
    bg: C.warningLight,
    icon: 'S',
    kycDocs: ['Trade License / Udyam Registration', 'GST Registration Certificate', 'PAN of proprietor', 'Aadhaar of proprietor', 'Business address proof', 'Bank statement (last 6 months, if existing)', 'ITR (last 2 years)'],
    kycRequirements: 'Proprietor KYC as individual. Business existence proof via trade license or Udyam registration. GST mandatory for turnover > 40 lakh.',
    accountOptions: ['Business Current Account', 'Overdraft Facility', 'MSME Loan', 'Merchant POS Terminal', 'Business Credit Card'],
    onboardingFlow: ['Proprietor visits branch with documents', 'Fill business account opening form', 'Submit trade license & GST certificate', 'KYC of proprietor (individual)', 'Business verification (address/existence)', 'Account opening & cheque book', 'POS terminal setup (if merchant)', 'Business internet banking activation'],
  },
  {
    type: 'HUF (Hindu Undivided Family)',
    color: '#b91c1c',
    bg: '#fee2e2',
    icon: 'H',
    kycDocs: ['HUF Deed', 'PAN of HUF', 'KYC of Karta (head of family)', 'KYC of all coparceners', 'Declaration of coparceners', 'Address proof of HUF'],
    kycRequirements: 'HUF must have separate PAN. Karta is the sole authorized signatory unless deed specifies otherwise. All coparceners must be declared.',
    accountOptions: ['HUF Savings Account', 'HUF Fixed Deposit', 'HUF Current Account', 'Loan in HUF name'],
    onboardingFlow: ['Karta visits branch', 'Submit HUF deed & PAN', 'KYC of Karta & all coparceners', 'Declaration of family members', 'Account opened in HUF name', 'Karta as sole operator', 'Cheque book in HUF name issued'],
  },
  {
    type: 'Trust / Society',
    color: '#0891b2',
    bg: '#cffafe',
    icon: 'T',
    kycDocs: ['Trust Deed / Society Registration Certificate', 'PAN of Trust/Society', 'Resolution for account opening', 'KYC of all trustees/office bearers', 'List of beneficiaries', 'Certificate of Registration under Societies Act / Indian Trust Act'],
    kycRequirements: 'All trustees/office bearers KYC required. Resolution specifying authorized signatories and limits. Annual renewal of authorization.',
    accountOptions: ['Trust Savings Account', 'Trust Current Account', 'Fixed Deposit', 'Donation Collection Account'],
    onboardingFlow: ['Submit trust deed / registration certificate', 'Board resolution with authorized signatories', 'KYC of all trustees/office bearers', 'Verification of registration', 'Risk assessment (especially for NGOs)', 'Account opening approval', 'Restricted internet banking setup'],
  },
  {
    type: 'NRI Customer',
    color: '#9333ea',
    bg: '#ede9fe',
    icon: 'N',
    kycDocs: ['Valid Passport (Indian)', 'Valid Visa / Work Permit', 'Overseas address proof', 'PAN Card (mandatory for NRO)', 'Employment proof abroad', 'PIO/OCI card (if applicable)', 'FEMA declaration form'],
    kycRequirements: 'NRI status verification via passport stamps. Video KYC allowed for remote account opening. FEMA compliance mandatory. Annual re-confirmation of NRI status.',
    accountOptions: ['NRE Account (tax-free, fully repatriable)', 'NRO Account (Indian income)', 'FCNR Deposit (foreign currency)', 'NRI Home Loan', 'Portfolio Investment Scheme (PIS)'],
    onboardingFlow: ['Online application from overseas', 'Video KYC with bank representative', 'Submit passport, visa, address proof', 'FEMA declaration & compliance check', 'NRE/NRO/FCNR account selection', 'Initial remittance from overseas bank', 'International debit card dispatched', 'NRI internet banking activated', 'Power of Attorney setup (optional)'],
  },
  {
    type: 'Minor / Kids',
    color: '#ea580c',
    bg: '#ffedd5',
    icon: 'M',
    kycDocs: ['Birth Certificate of minor', 'KYC of guardian (Aadhaar + PAN)', 'Proof of relationship (guardian to minor)', 'School ID (for age 10+)', 'Photograph of minor & guardian'],
    kycRequirements: 'Guardian must have account in same bank. Minor (age 10+) can operate limited transactions independently. Full operations transfer to minor at age 18.',
    accountOptions: ['Kids Savings Account (guardian operated)', 'Minor Fixed Deposit', 'Sukanya Samriddhi (for girl child)', 'PPF in minor name'],
    onboardingFlow: ['Guardian visits branch with minor', 'Submit birth certificate & guardian KYC', 'Fill minor account opening form', 'Guardian signs as operator', 'Photo passbook issued', 'Restricted ATM card (age 10+)', 'Account converts to regular savings at 18', 'Minor completes own KYC at 18'],
  },
];

/* ═══════════════════════════════════════════════════
   DATA: Card Products
   ═══════════════════════════════════════════════════ */
const CARD_PRODUCTS = [
  {
    name: 'Debit Card',
    color: C.primary,
    bg: C.primaryLight,
    description: 'Linked directly to savings/current account. Spends are debited in real-time from account balance. Primary card for ATM withdrawals and POS purchases.',
    features: ['ATM withdrawal (daily limit: 25K-1L)', 'POS / merchant payments', 'Online / e-commerce transactions', 'Contactless (NFC) payments', 'International usage (if enabled)', 'SMS/email alerts for every transaction', 'Temporary block/unblock via app'],
    charges: 'Issuance: Free-500, Annual: 100-500, ATM (own): Free (5/month), ATM (other): 20/txn after 3 free',
    eligibility: 'Any savings/current account holder with valid KYC',
    processFlow: ['Account Opening', 'Card Application (auto/request)', 'Card Personalization', 'PIN Generation (Green PIN / IVR)', 'Card Dispatch (courier)', 'Activation (ATM / app / IVR)', 'Set Transaction Limits'],
  },
  {
    name: 'Credit Card',
    color: C.purple,
    bg: C.purpleLight,
    description: 'Unsecured revolving credit line based on income and credit score. Buy now, pay later with interest-free period (up to 50 days). EMI conversion available.',
    features: ['Credit limit (50K - 10L+)', 'Interest-free period (20-50 days)', 'EMI conversion on large purchases', 'Reward points / cashback', 'Lounge access (premium cards)', 'Fuel surcharge waiver', 'Add-on cards for family', 'Balance transfer facility'],
    charges: 'Joining: 0-5000, Annual: 500-10000, Interest: 24-42% APR, Late payment: 500-1300, Cash advance: 2.5%',
    eligibility: 'Age 21-65, CIBIL 700+, minimum income 2.5L/year, salaried/self-employed',
    processFlow: ['Application (online/branch)', 'Income & Employment Verification', 'CIBIL/Credit Score Check', 'Risk Assessment & Limit Setting', 'Approval / Rejection', 'Card Manufacturing & Embossing', 'PIN Generation', 'Card Dispatch', 'Activation & Welcome Call'],
  },
  {
    name: 'Mastercard',
    color: '#e67e22',
    bg: '#fef3c7',
    description: 'Global payment network by Mastercard Inc. Accepted in 210+ countries with contactless technology. Offers multiple tiers: Standard, World, World Elite.',
    features: ['Global acceptance (210+ countries)', 'Contactless / tap-to-pay', 'Mastercard SecureCode (3D Secure)', 'Zero liability protection', 'Travel insurance & purchase protection', 'Priceless.com experiences', 'Dynamic currency conversion'],
    charges: 'Forex markup: 2-3.5%, Cross-border: 1%, Tier-based annual fee',
    eligibility: 'Based on card tier: Standard (basic), World (income 6L+), World Elite (income 15L+)',
    processFlow: ['Select Mastercard variant', 'Apply through issuing bank', 'Bank processes application', 'Mastercard network enrollment', 'Card issued with MC BIN', 'Activate & register on MC portal', 'Enable international transactions'],
  },
  {
    name: 'Visa Card',
    color: '#1a73e8',
    bg: '#e8f0fe',
    description: 'Largest global payment network by Visa Inc. Industry-leading security with Visa Secure. Tiers: Classic, Gold, Platinum, Signature, Infinite.',
    features: ['Worldwide acceptance (200+ countries)', 'Visa Secure (3D authentication)', 'Visa Purchase Alerts', 'Global customer assistance', 'Emergency card replacement', 'Travel insurance (Platinum+)', 'Concierge service (Signature+)'],
    charges: 'Forex markup: 2-3.5%, Cross-border: 1%, Tier-based annual fee',
    eligibility: 'Classic (basic), Gold (income 3L+), Platinum (6L+), Signature (12L+), Infinite (24L+)',
    processFlow: ['Select Visa tier', 'Apply through issuing bank', 'Credit assessment', 'Visa network registration', 'Card issued with Visa BIN', 'Enrollment in Visa Secure', 'International activation'],
  },
  {
    name: 'RuPay Card',
    color: '#0d9488',
    bg: '#d1fae5',
    description: 'India\'s domestic card payment network by NPCI. Lower merchant discount rate (MDR) promoting digital payments. Strong government backing under Digital India.',
    features: ['Domestic acceptance across India', 'Lower MDR (merchant charges)', 'UPI linkage', 'RuPay Contactless', 'Accident insurance (up to 10L)', 'PMJDY scheme cards', 'JCB co-branded for international'],
    charges: 'Issuance: Free (PMJDY), Annual: 0-200, MDR: 0.6% (lower than Visa/MC)',
    eligibility: 'Any Indian bank account holder, PMJDY beneficiaries (auto-issued)',
    processFlow: ['Account opening triggers auto-issuance (PMJDY)', 'Or apply at branch', 'NPCI network enrollment', 'Card issued with RuPay BIN', 'PIN generation', 'UPI linking (optional)', 'Activation at ATM or branch'],
  },
  {
    name: 'Prepaid Card',
    color: '#7c2d12',
    bg: '#ffedd5',
    description: 'Pre-loaded card with fixed amount, not linked to bank account. Used for gifting, travel forex, corporate disbursements, and controlled spending.',
    features: ['Pre-loaded fixed amount', 'No bank account needed', 'Reloadable options available', 'Travel forex card (multi-currency)', 'Gift card variants', 'Meal/fuel cards for corporates', 'Limited KYC: up to 10K, Full KYC: up to 2L'],
    charges: 'Issuance: 100-500, Reload: 25-100, Inactivity: 25/month after 1 year, Forex: 2% markup',
    eligibility: 'Minimal KYC for up to 10,000 load, Full KYC for higher limits, age 18+',
    processFlow: ['Purchase at bank/online/retail', 'Load amount (cash/transfer/card)', 'Activate with OTP', 'Use at ATM/POS/online', 'Reload (if reloadable)', 'Check balance via app/SMS', 'Refund balance on closure'],
  },
  {
    name: 'Virtual Card',
    color: '#6366f1',
    bg: '#eef2ff',
    description: 'Digital-only card for online transactions. Instant issuance without physical card. Ideal for one-time purchases and subscription management.',
    features: ['Instant issuance (2 minutes)', 'Online-only transactions', 'Temporary / disposable option', 'Dynamic CVV (some issuers)', 'Set custom spending limit', 'Auto-expiry option', 'Visible only in banking app'],
    charges: 'Issuance: Free-100, No annual fee, Transaction fees same as physical card',
    eligibility: 'Existing account holder with active net/mobile banking, age 18+',
    processFlow: ['Request via mobile/net banking', 'Instant card number generated', 'CVV & expiry visible in app', 'Set spending limit', 'Use for online purchase', 'Auto-destroy after use (if disposable)', 'Generate new card as needed'],
  },
  {
    name: 'Business / Corporate Card',
    color: '#b91c1c',
    bg: '#fee2e2',
    description: 'Cards issued to companies for employee expense management. Higher limits, centralized billing, expense categorization, and detailed MIS reports.',
    features: ['Higher transaction limits', 'Employee sub-cards (add-on)', 'Centralized billing to company', 'Expense categorization & MIS', 'GST-compliant invoicing', 'Travel & entertainment limits', 'Integration with ERP/accounting', 'Real-time spend visibility'],
    charges: 'Joining: 1000-5000, Annual: 1000-10000/card, Interest: 24-36% APR on revolving',
    eligibility: 'Registered business (2+ years), minimum turnover 50L, board resolution for card issuance',
    processFlow: ['Company applies with business documents', 'Bank assesses company creditworthiness', 'Credit limit assigned to company', 'Employee list with sub-limits submitted', 'Individual cards manufactured', 'Cards dispatched to company', 'Admin portal setup for expense tracking', 'Monthly consolidated statement to company'],
  },
];

/* ═══════════════════════════════════════════════════
   DATA: Operations & Processes
   ═══════════════════════════════════════════════════ */
const OPERATIONS = [
  {
    title: 'Customer Onboarding',
    color: C.primary,
    steps: ['Application', 'KYC Verification', 'Document Upload', 'Account Opening', 'Card Issuance', 'Welcome Kit', 'Activation'],
    details: 'End-to-end process for new customer acquisition. Involves identity verification, document collection, risk assessment, and account setup. TAT: 1-3 business days (instant for e-KYC).',
  },
  {
    title: 'Payment Processing',
    color: C.success,
    steps: ['Initiate Payment', 'Validate Account', 'Check Balance', 'Debit Sender', 'Credit Receiver', 'Generate Reference', 'Send Notification'],
    details: 'Real-time or batch payment execution. Validates sender/receiver details, ensures sufficient balance, executes atomic debit-credit, and generates transaction reference for audit trail.',
  },
  {
    title: 'Deposit Operations',
    color: C.warning,
    steps: ['Cash/Cheque Deposit', 'Verify Amount', 'Update Ledger', 'Credit Account', 'Generate Receipt', 'Send Confirmation'],
    details: 'Cash deposit reflected instantly. Cheque deposit: clearing cycle 2-3 days (CTS). Cash deposits > 10L reported to FIU-IND. CTR (Cash Transaction Report) generated for compliance.',
  },
  {
    title: 'Loan Processing',
    color: C.purple,
    steps: ['Application', 'Credit Score Check', 'Income Verification', 'Collateral Assessment', 'Approval / Rejection', 'Disbursement', 'EMI Schedule', 'Monitoring'],
    details: 'Multi-stage loan lifecycle from application to monitoring. Involves CIBIL score check (650+ threshold), income verification, collateral valuation (for secured loans), committee approval for large amounts, and ongoing NPA monitoring.',
  },
  {
    title: 'Card Operations',
    color: '#b91c1c',
    steps: ['Apply', 'Verify Eligibility', 'Approve', 'Issue Card', 'Activate', 'Set PIN', 'Enable Features'],
    details: 'Card lifecycle management from application to feature enablement. Includes BIN assignment, embossing/printing, secure PIN generation, and feature configuration (international, contactless, etc.).',
  },
  {
    title: 'Account Closure',
    color: C.grey,
    steps: ['Request', 'Verify Identity', 'Check Pending Txns', 'Settle Outstanding', 'Deactivate Card', 'Close Account', 'Issue Refund'],
    details: 'Account closure requires clearing all pending transactions, EMIs, and charges. Linked services (debit card, net banking, auto-debits) are terminated. Balance refunded via DD/transfer. Closure certificate issued.',
  },
];

const FUND_TRANSFER_COMPARISON = [
  { method: 'NEFT', timing: 'Half-hourly batches (24x7 from Dec 2019)', limit: 'No upper limit (min 1)', settlement: 'Batch (every 30 min)', charges: '0 - 25 (most banks free now)' },
  { method: 'RTGS', timing: '24x7 (real-time)', limit: 'Min 2,00,000 (no upper limit)', settlement: 'Real-time gross settlement', charges: '0 - 50 (RBI mandated free)' },
  { method: 'IMPS', timing: '24x7x365 (instant)', limit: 'Up to 5,00,000 per txn', settlement: 'Instant (real-time)', charges: '0 - 15 per transaction' },
  { method: 'UPI', timing: '24x7x365 (instant)', limit: 'Up to 1,00,000 per txn (5L for some)', settlement: 'Instant via NPCI', charges: 'Free (zero MDR for P2P)' },
];

/* ═══════════════════════════════════════════════════
   DATA: BPM Flows
   ═══════════════════════════════════════════════════ */
const BPM_FLOWS = [
  {
    title: 'Account Opening BPM',
    color: C.primary,
    owner: 'Branch Operations Manager',
    sla: '1-3 business days (instant for e-KYC)',
    metrics: ['Application-to-account TAT', 'KYC rejection rate', 'Document completeness %', 'First-time-right rate'],
    automation: ['e-KYC via Aadhaar OTP', 'OCR for document extraction', 'Auto risk scoring', 'Workflow routing to approver'],
    steps: [
      { label: 'Start', type: 'start' },
      { label: 'Receive Application', type: 'task' },
      { label: 'Validate Documents', type: 'task' },
      { label: 'Risk Assessment', type: 'task' },
      { label: 'Decision', type: 'decision' },
      { label: 'Create Account', type: 'task', branch: 'approve' },
      { label: 'Issue Welcome Kit', type: 'task', branch: 'approve' },
      { label: 'Send Rejection', type: 'task', branch: 'reject' },
      { label: 'End', type: 'end' },
    ],
  },
  {
    title: 'Loan Processing BPM',
    color: C.success,
    owner: 'Credit Manager / Loan Committee',
    sla: '5-15 business days (personal loan: 2-3 days)',
    metrics: ['Approval rate', 'Average processing time', 'NPA rate', 'Pre-screening rejection %', 'Disbursement TAT'],
    automation: ['Auto credit bureau pull', 'Income verification via Account Aggregator', 'Risk model scoring', 'Auto-sanction for pre-approved', 'e-Sign for documentation'],
    steps: [
      { label: 'Start', type: 'start' },
      { label: 'Application Received', type: 'task' },
      { label: 'Pre-screening', type: 'task' },
      { label: 'Credit Analysis', type: 'task' },
      { label: 'Risk Rating', type: 'task' },
      { label: 'Committee Approval', type: 'decision' },
      { label: 'Sanction Letter', type: 'task', branch: 'approve' },
      { label: 'Documentation', type: 'task', branch: 'approve' },
      { label: 'Disbursement', type: 'task', branch: 'approve' },
      { label: 'Monitoring', type: 'task', branch: 'approve' },
      { label: 'End', type: 'end' },
    ],
  },
  {
    title: 'Payment Processing BPM',
    color: C.purple,
    owner: 'Payment Operations Head',
    sla: 'NEFT: 30 min, RTGS/IMPS/UPI: Instant',
    metrics: ['Transaction success rate', 'Average settlement time', 'Failed transaction %', 'Reconciliation accuracy'],
    automation: ['Real-time balance check', 'Auto-routing (NEFT/RTGS/IMPS)', 'Instant beneficiary validation', 'Auto-reconciliation', 'Fraud detection (ML-based)'],
    steps: [
      { label: 'Start', type: 'start' },
      { label: 'Initiate', type: 'task' },
      { label: 'Authentication', type: 'task' },
      { label: 'Authorization', type: 'decision' },
      { label: 'Routing', type: 'task', branch: 'approve' },
      { label: 'Settlement', type: 'task', branch: 'approve' },
      { label: 'Reconciliation', type: 'task', branch: 'approve' },
      { label: 'End', type: 'end' },
    ],
  },
  {
    title: 'Complaint Management BPM',
    color: C.warning,
    owner: 'Customer Service Manager',
    sla: 'Acknowledgment: 24 hrs, Resolution: 7-30 days',
    metrics: ['First contact resolution %', 'Average resolution time', 'Escalation rate', 'Customer satisfaction (CSAT)', 'Repeat complaint %'],
    automation: ['Auto-categorization (NLP)', 'SLA breach alerts', 'Auto-assignment based on category', 'Customer notification at each stage', 'Sentiment analysis on feedback'],
    steps: [
      { label: 'Start', type: 'start' },
      { label: 'Register Complaint', type: 'task' },
      { label: 'Categorize', type: 'task' },
      { label: 'Assign to Team', type: 'task' },
      { label: 'Investigate', type: 'task' },
      { label: 'Resolve', type: 'decision' },
      { label: 'Customer Feedback', type: 'task', branch: 'approve' },
      { label: 'Close Ticket', type: 'task', branch: 'approve' },
      { label: 'End', type: 'end' },
    ],
  },
];

/* ═══════════════════════════════════════════════════
   DATA: Compliance & Regulations
   ═══════════════════════════════════════════════════ */
const COMPLIANCE_DATA = [
  {
    name: 'KYC / AML',
    color: C.primary,
    description: 'Know Your Customer (KYC) and Anti-Money Laundering (AML) are foundational regulatory requirements. Banks must verify customer identity, monitor transactions for suspicious activity, and report to Financial Intelligence Unit (FIU-IND).',
    requirements: ['Customer identification (CDD/EDD)', 'Ongoing transaction monitoring', 'Suspicious Transaction Reports (STR)', 'Cash Transaction Reports (CTR) for >10L', 'PEP (Politically Exposed Persons) screening', 'Sanctions list screening (UN/OFAC)', 'Periodic KYC renewal (2/8/10 years based on risk)'],
    testingImpact: ['Verify KYC data capture completeness', 'Test AML rule engine triggers', 'Validate STR/CTR report generation', 'Test PEP & sanctions screening API', 'Verify re-KYC workflow and alerts', 'Test document expiry notifications'],
    checklist: ['Customer risk categorization implemented', 'Transaction monitoring rules configured', 'STR filing workflow tested', 'Sanctions screening integrated', 'Re-KYC alerts and workflows active'],
  },
  {
    name: 'RBI Guidelines',
    color: '#15803d',
    description: 'Reserve Bank of India regulations governing all banking operations in India. Covers interest rates, lending norms, digital banking standards, customer protection, and financial inclusion mandates.',
    requirements: ['Priority Sector Lending (40% of ANBC)', 'SLR (Statutory Liquidity Ratio) maintenance', 'CRR (Cash Reserve Ratio) compliance', 'Interest rate transmission (MCLR/EBLR)', 'Digital lending guidelines (Sep 2022)', 'Customer compensation for failed transactions', 'Tokenization mandate for card data'],
    testingImpact: ['Verify interest rate calculations', 'Test compliance report generation', 'Validate digital lending flow (LSP/RE)', 'Test customer compensation auto-credit', 'Verify tokenization implementation', 'Test regulatory return filing'],
    checklist: ['SLR/CRR reporting automated', 'Priority sector classification logic tested', 'Digital lending disclosure tested', 'Failed transaction reversal within T+5', 'Card tokenization for all saved cards'],
  },
  {
    name: 'PCI-DSS',
    color: C.danger,
    description: 'Payment Card Industry Data Security Standard. Mandatory for all entities that store, process, or transmit cardholder data. 12 requirements across 6 control objectives.',
    requirements: ['Install and maintain firewall', 'Do not use vendor default passwords', 'Protect stored cardholder data (encryption)', 'Encrypt data in transit (TLS 1.2+)', 'Use and regularly update anti-virus', 'Develop secure applications (OWASP)', 'Restrict access (need-to-know basis)', 'Assign unique ID to each user', 'Restrict physical access to data', 'Track and monitor all network access', 'Regularly test security systems (pen test)', 'Maintain information security policy'],
    testingImpact: ['Verify card data masking (show only last 4)', 'Test encryption of stored card data', 'Validate TLS implementation', 'Test access control and audit logs', 'Verify PAN not logged in any system', 'Penetration test card processing flow'],
    checklist: ['Card data encrypted at rest (AES-256)', 'TLS 1.2+ for all card transmissions', 'PAN masked in all UI and logs', 'Access logs for all card data access', 'Annual penetration test completed', 'Quarterly ASV scan passed'],
  },
  {
    name: 'GDPR / Data Privacy',
    color: C.purple,
    description: 'General Data Protection Regulation (EU) and Indian Digital Personal Data Protection Act 2023. Governs collection, processing, storage, and sharing of customer personal data.',
    requirements: ['Lawful basis for data processing', 'Explicit consent for data collection', 'Right to erasure (right to be forgotten)', 'Data portability', 'Data breach notification (72 hours)', 'Data Protection Officer (DPO) appointment', 'Privacy Impact Assessment (PIA)', 'Cross-border data transfer restrictions'],
    testingImpact: ['Test consent capture and management', 'Verify data deletion workflows', 'Test data export (portability) API', 'Validate data masking in non-prod', 'Test breach notification workflow', 'Verify data retention policies'],
    checklist: ['Consent management system implemented', 'Data deletion API functional', 'Personal data inventory documented', 'Breach notification process tested', 'Non-prod data masked/anonymized', 'Cross-border transfer controls active'],
  },
  {
    name: 'Basel III Norms',
    color: C.warning,
    description: 'International banking regulations for capital adequacy, stress testing, and liquidity risk management. Ensures banks maintain sufficient capital buffers to absorb losses.',
    requirements: ['Minimum CET1 ratio: 4.5%', 'Minimum Tier 1 capital: 6%', 'Total capital ratio: 8% (India: 9%)', 'Capital Conservation Buffer: 2.5%', 'Countercyclical Buffer: 0-2.5%', 'Liquidity Coverage Ratio (LCR) > 100%', 'Net Stable Funding Ratio (NSFR) > 100%', 'Leverage Ratio > 3%'],
    testingImpact: ['Verify capital ratio calculations', 'Test stress testing scenarios', 'Validate LCR/NSFR computation', 'Test regulatory reporting accuracy', 'Verify risk-weighted asset calculations'],
    checklist: ['Capital adequacy reports automated', 'Stress test framework implemented', 'LCR daily monitoring active', 'NSFR quarterly computation tested', 'Risk-weighted asset engine validated'],
  },
  {
    name: 'SEBI Regulations',
    color: '#0891b2',
    description: 'Securities and Exchange Board of India regulations for capital market operations, investor protection, and market integrity. Applicable to banks with investment banking and demat services.',
    requirements: ['Investor protection guidelines', 'Market manipulation prevention', 'Insider trading regulations', 'Depository participant compliance', 'Margin trading rules', 'IPO/FPO process compliance', 'Mutual fund distribution norms'],
    testingImpact: ['Test demat transaction processing', 'Verify margin calculation', 'Test trade surveillance alerts', 'Validate investor disclosure reports', 'Test IPO application flow'],
    checklist: ['Trade surveillance system active', 'Margin monitoring automated', 'Investor grievance portal tested', 'Demat transfer workflow validated', 'Regulatory filings automated'],
  },
  {
    name: 'Audit Requirements',
    color: '#7c2d12',
    description: 'Internal and external audit compliance including SOX (for listed banks), statutory audit (RBI mandated), concurrent audit, and IS audit for technology controls.',
    requirements: ['Statutory audit (annual, RBI mandated)', 'Concurrent audit (real-time branch audit)', 'Internal audit (quarterly)', 'IS audit (information systems)', 'SOX compliance (listed entities)', 'Revenue audit', 'Credit audit', 'LFAR (Long Form Audit Report) submission'],
    testingImpact: ['Verify complete audit trail for all transactions', 'Test audit log immutability', 'Validate segregation of duties', 'Test maker-checker workflow', 'Verify data integrity checks', 'Test regulatory return accuracy'],
    checklist: ['Audit trail captures all CRUD operations', 'Logs are tamper-proof and archived', 'Maker-checker enforced for critical operations', 'Segregation of duties matrix defined', 'Audit sampling data exportable', 'LFAR data points automated'],
  },
];

/* ═══════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════ */
const styles = {
  page: {
    background: '#ffffff',
    minHeight: '100vh',
    padding: '24px 32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: C.text,
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: C.text,
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: C.textMuted,
    margin: 0,
  },
  tabBar: {
    display: 'flex',
    gap: '4px',
    borderBottom: `2px solid ${C.border}`,
    marginBottom: '28px',
    overflowX: 'auto',
    paddingBottom: '0',
  },
  tab: (active) => ({
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: active ? '600' : '500',
    color: active ? C.primary : C.textMuted,
    background: active ? C.primaryLight : 'transparent',
    border: 'none',
    borderBottom: active ? `2px solid ${C.primary}` : '2px solid transparent',
    borderRadius: '6px 6px 0 0',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    marginBottom: '-2px',
  }),
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
    gap: '20px',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px',
  },
  card: (color, bgColor) => ({
    background: '#ffffff',
    border: `1px solid ${C.border}`,
    borderLeft: `4px solid ${color}`,
    borderRadius: '8px',
    padding: '20px',
    transition: 'box-shadow 0.2s ease',
  }),
  cardTitle: (color) => ({
    fontSize: '16px',
    fontWeight: '700',
    color: color || C.text,
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }),
  cardDesc: {
    fontSize: '13px',
    color: C.textMuted,
    lineHeight: '1.6',
    margin: '0 0 12px 0',
  },
  badge: (color, bg) => ({
    display: 'inline-block',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: '600',
    color: color,
    background: bg,
    borderRadius: '12px',
    marginRight: '6px',
    marginBottom: '4px',
  }),
  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '12px 0 6px 0',
  },
  list: {
    margin: '0',
    paddingLeft: '18px',
    fontSize: '13px',
    lineHeight: '1.8',
    color: C.text,
  },
  iconCircle: (color, bg) => ({
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: bg,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    fontWeight: '700',
    flexShrink: 0,
  }),
  /* Flow chart styles */
  flowContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    overflowX: 'auto',
    padding: '16px 0',
    flexWrap: 'wrap',
    rowGap: '8px',
  },
  flowStep: (color) => ({
    padding: '8px 16px',
    background: color || C.primaryLight,
    color: C.text,
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    border: `1px solid ${color || C.primary}33`,
    flexShrink: 0,
  }),
  flowArrow: {
    fontSize: '16px',
    color: C.grey,
    margin: '0 4px',
    flexShrink: 0,
    fontWeight: '700',
  },
  /* Table */
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    border: `1px solid ${C.border}`,
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    background: C.greyLight,
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: '700',
    fontSize: '12px',
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `2px solid ${C.border}`,
  },
  td: {
    padding: '10px 14px',
    borderBottom: `1px solid ${C.border}`,
    verticalAlign: 'top',
    lineHeight: '1.5',
  },
  /* Accordion */
  accordionHeader: (open, color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    background: open ? `${color}11` : '#ffffff',
    border: `1px solid ${C.border}`,
    borderLeft: `4px solid ${color}`,
    borderRadius: open ? '8px 8px 0 0' : '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  accordionBody: {
    padding: '18px',
    border: `1px solid ${C.border}`,
    borderTop: 'none',
    borderRadius: '0 0 8px 8px',
    background: '#ffffff',
  },
  /* BPM specific */
  bpmStep: (type) => {
    const map = {
      start: { bg: '#dcfce7', color: '#15803d', border: '#15803d', radius: '50%', size: '48px' },
      end: { bg: '#fee2e2', color: '#dc2626', border: '#dc2626', radius: '50%', size: '48px' },
      task: { bg: C.primaryLight, color: C.primary, border: C.primary, radius: '8px', size: 'auto' },
      decision: { bg: '#fef3c7', color: '#d97706', border: '#d97706', radius: '4px', size: 'auto' },
    };
    const s = map[type] || map.task;
    return {
      padding: type === 'start' || type === 'end' ? '0' : '8px 16px',
      width: type === 'start' || type === 'end' ? s.size : 'auto',
      height: type === 'start' || type === 'end' ? s.size : 'auto',
      background: s.bg,
      color: s.color,
      border: `2px solid ${s.border}`,
      borderRadius: s.radius,
      fontSize: '12px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      transform: type === 'decision' ? 'rotate(0deg)' : 'none',
    };
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: C.text,
    margin: '0 0 16px 0',
    paddingBottom: '8px',
    borderBottom: `2px solid ${C.border}`,
  },
  infoBox: (color) => ({
    background: `${color}08`,
    border: `1px solid ${color}33`,
    borderRadius: '8px',
    padding: '14px 16px',
    marginTop: '12px',
  }),
  infoRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    marginTop: '12px',
  },
  infoItem: {
    fontSize: '12px',
    color: C.textMuted,
  },
  infoLabel: {
    fontWeight: '700',
    color: C.text,
    marginRight: '4px',
  },
};

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════ */

function FlowChart({ steps, color }) {
  return (
    <div style={styles.flowContainer}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div style={styles.flowStep(color ? `${color}22` : undefined)}>{step}</div>
          {i < steps.length - 1 && <span style={styles.flowArrow}>&rarr;</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function BpmFlowChart({ steps }) {
  return (
    <div style={{ ...styles.flowContainer, gap: '0' }}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div style={styles.bpmStep(step.type)}>
            {step.label}
            {step.type === 'decision' && (
              <span style={{ fontSize: '10px', marginLeft: '4px', opacity: 0.7 }}>&#9674;</span>
            )}
          </div>
          {i < steps.length - 1 && <span style={styles.flowArrow}>&rarr;</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB PANELS
   ═══════════════════════════════════════════════════ */

function SegmentsPanel() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Banking Segments Overview</h2>
      <p style={{ ...styles.cardDesc, marginBottom: '20px' }}>
        Banks operate across multiple segments, each with distinct customer profiles, products, regulatory requirements, and risk characteristics.
        Understanding these segments is critical for designing comprehensive test strategies.
      </p>
      <div style={styles.grid2}>
        {SEGMENTS.map((seg) => (
          <div key={seg.name} style={styles.card(seg.color, seg.bg)}>
            <div style={styles.cardTitle(seg.color)}>
              <div style={styles.iconCircle(seg.color, seg.bg)}>{seg.icon}</div>
              {seg.name}
            </div>
            <p style={styles.cardDesc}>{seg.description}</p>
            <div style={styles.label}>Key Services</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {seg.services.map((s) => (
                <span key={s} style={styles.badge(seg.color, seg.bg)}>{s}</span>
              ))}
            </div>
            <div style={styles.label}>Target Customers</div>
            <p style={{ ...styles.cardDesc, margin: 0, fontWeight: '500', color: C.text }}>{seg.target}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountTypesPanel() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Account Types Reference</h2>
      <p style={{ ...styles.cardDesc, marginBottom: '20px' }}>
        Comprehensive listing of all banking account types with eligibility criteria, features, and key parameters for test scenario design.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: '180px' }}>Account Type</th>
              <th style={styles.th}>Description</th>
              <th style={{ ...styles.th, width: '140px' }}>Min Balance</th>
              <th style={{ ...styles.th, width: '120px' }}>Interest Rate</th>
              <th style={styles.th}>Key Features</th>
              <th style={{ ...styles.th, width: '200px' }}>Eligibility</th>
            </tr>
          </thead>
          <tbody>
            {ACCOUNT_TYPES.map((acc) => (
              <tr key={acc.type}>
                <td style={styles.td}>
                  <span style={{ fontWeight: '700', color: acc.color }}>{acc.type}</span>
                </td>
                <td style={styles.td}>{acc.description}</td>
                <td style={styles.td}>
                  <span style={styles.badge(acc.color, `${acc.color}15`)}>{acc.minBalance}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ fontWeight: '600', color: acc.color }}>{acc.interestRate}</span>
                </td>
                <td style={styles.td}>
                  <ul style={{ ...styles.list, paddingLeft: '14px' }}>
                    {acc.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </td>
                <td style={styles.td}>{acc.eligibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomerTypesPanel() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Customer Types & Onboarding</h2>
      <p style={{ ...styles.cardDesc, marginBottom: '20px' }}>
        Each customer type has unique KYC requirements, onboarding workflows, and account options. Understanding these is essential for testing customer lifecycle management.
      </p>
      <div style={styles.grid2}>
        {CUSTOMER_TYPES.map((cust) => (
          <div key={cust.type} style={styles.card(cust.color, cust.bg)}>
            <div style={styles.cardTitle(cust.color)}>
              <div style={styles.iconCircle(cust.color, cust.bg)}>{cust.icon}</div>
              {cust.type}
            </div>

            <div style={styles.label}>KYC Documents Required</div>
            <ul style={styles.list}>
              {cust.kycDocs.map((d) => <li key={d}>{d}</li>)}
            </ul>

            <div style={styles.label}>KYC Requirements</div>
            <p style={styles.cardDesc}>{cust.kycRequirements}</p>

            <div style={styles.label}>Account Options</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
              {cust.accountOptions.map((a) => (
                <span key={a} style={styles.badge(cust.color, cust.bg)}>{a}</span>
              ))}
            </div>

            <div style={styles.label}>Onboarding Process Flow</div>
            <FlowChart steps={cust.onboardingFlow} color={cust.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardProductsPanel() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Card Products Catalog</h2>
      <p style={{ ...styles.cardDesc, marginBottom: '20px' }}>
        Complete reference of card products including features, charges, eligibility, and issuance process flows. Critical for payment testing and card lifecycle test scenarios.
      </p>
      <div style={styles.grid2}>
        {CARD_PRODUCTS.map((card) => (
          <div key={card.name} style={styles.card(card.color, card.bg)}>
            <div style={styles.cardTitle(card.color)}>{card.name}</div>
            <p style={styles.cardDesc}>{card.description}</p>

            <div style={styles.label}>Features</div>
            <ul style={styles.list}>
              {card.features.map((f) => <li key={f}>{f}</li>)}
            </ul>

            <div style={styles.label}>Charges</div>
            <p style={{ ...styles.cardDesc, margin: '0 0 4px 0', fontWeight: '500' }}>{card.charges}</p>

            <div style={styles.label}>Eligibility</div>
            <p style={{ ...styles.cardDesc, margin: '0 0 4px 0' }}>{card.eligibility}</p>

            <div style={styles.label}>Process Flow</div>
            <FlowChart steps={card.processFlow} color={card.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

function OperationsPanel() {
  const [openOp, setOpenOp] = useState(null);

  return (
    <div>
      <h2 style={styles.sectionTitle}>Operations & Processes</h2>
      <p style={{ ...styles.cardDesc, marginBottom: '20px' }}>
        Core banking operations with step-by-step process flows. Each operation represents a testable end-to-end workflow with specific validation points.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
        {OPERATIONS.map((op) => (
          <div key={op.title}>
            <div
              style={styles.accordionHeader(openOp === op.title, op.color)}
              onClick={() => setOpenOp(openOp === op.title ? null : op.title)}
            >
              <span style={{ fontWeight: '700', fontSize: '15px', color: op.color }}>{op.title}</span>
              <span style={{ fontSize: '18px', color: C.grey, transform: openOp === op.title ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                &#9662;
              </span>
            </div>
            {openOp === op.title && (
              <div style={styles.accordionBody}>
                <FlowChart steps={op.steps} color={op.color} />
                <div style={styles.infoBox(op.color)}>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: C.text }}>{op.details}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fund Transfer Comparison Table */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: C.text, margin: '0 0 12px 0' }}>
        Fund Transfer Methods Comparison (NEFT / RTGS / IMPS / UPI)
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Timing</th>
              <th style={styles.th}>Transaction Limit</th>
              <th style={styles.th}>Settlement</th>
              <th style={styles.th}>Charges</th>
            </tr>
          </thead>
          <tbody>
            {FUND_TRANSFER_COMPARISON.map((ft) => (
              <tr key={ft.method}>
                <td style={styles.td}>
                  <span style={{ fontWeight: '700', color: C.primary }}>{ft.method}</span>
                </td>
                <td style={styles.td}>{ft.timing}</td>
                <td style={styles.td}>{ft.limit}</td>
                <td style={styles.td}>{ft.settlement}</td>
                <td style={styles.td}>{ft.charges}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BpmPanel() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Business Process Management (BPM) Flows</h2>
      <p style={{ ...styles.cardDesc, marginBottom: '16px' }}>
        BPM provides a systematic approach to improving banking processes. Each flow includes process ownership, SLA targets, performance metrics, and automation opportunities.
      </p>

      {/* BPM Lifecycle */}
      <div style={{ ...styles.card(C.purple, C.purpleLight), marginBottom: '24px' }}>
        <div style={styles.cardTitle(C.purple)}>BPM Lifecycle</div>
        <p style={styles.cardDesc}>
          The continuous improvement cycle that drives operational excellence in banking. Each phase feeds into the next, creating a loop of process refinement.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', padding: '16px 0', flexWrap: 'wrap', rowGap: '8px' }}>
          {['Plan', 'Model', 'Analyze', 'Improve', 'Monitor'].map((phase, i) => (
            <React.Fragment key={phase}>
              <div style={{
                padding: '10px 24px',
                background: C.purpleLight,
                color: C.purple,
                border: `2px solid ${C.purple}`,
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: '700',
              }}>
                {phase}
              </div>
              <span style={{ ...styles.flowArrow, fontSize: '20px' }}>
                {i < 4 ? '\u2192' : '\u21BA'}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* BPM Flows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {BPM_FLOWS.map((bpm) => (
          <div key={bpm.title} style={styles.card(bpm.color)}>
            <div style={styles.cardTitle(bpm.color)}>{bpm.title}</div>

            {/* Flow diagram */}
            <BpmFlowChart steps={bpm.steps} />

            {/* Meta info */}
            <div style={styles.infoRow}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Process Owner:</span> {bpm.owner}
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>SLA:</span> {bpm.sla}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div style={styles.infoBox(bpm.color)}>
                <div style={{ ...styles.label, marginTop: 0 }}>Key Metrics</div>
                <ul style={{ ...styles.list, paddingLeft: '16px' }}>
                  {bpm.metrics.map((m) => <li key={m}>{m}</li>)}
                </ul>
              </div>
              <div style={styles.infoBox(C.success)}>
                <div style={{ ...styles.label, marginTop: 0 }}>Automation Opportunities</div>
                <ul style={{ ...styles.list, paddingLeft: '16px' }}>
                  {bpm.automation.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompliancePanel() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Compliance & Regulations</h2>
      <p style={{ ...styles.cardDesc, marginBottom: '20px' }}>
        Regulatory compliance is fundamental to banking operations. Each regulation directly impacts testing requirements, test data management, and validation criteria.
      </p>
      <div style={styles.grid2}>
        {COMPLIANCE_DATA.map((reg) => (
          <div key={reg.name} style={styles.card(reg.color)}>
            <div style={styles.cardTitle(reg.color)}>{reg.name}</div>
            <p style={styles.cardDesc}>{reg.description}</p>

            <div style={styles.label}>Key Requirements</div>
            <ul style={styles.list}>
              {reg.requirements.map((r) => <li key={r}>{r}</li>)}
            </ul>

            <div style={styles.label}>Impact on Testing</div>
            <ul style={styles.list}>
              {reg.testingImpact.map((t) => <li key={t}>{t}</li>)}
            </ul>

            <div style={styles.infoBox(reg.color)}>
              <div style={{ ...styles.label, marginTop: 0 }}>Compliance Checklist</div>
              {reg.checklist.map((c) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', lineHeight: '2', color: C.text }}>
                  <span style={{ color: C.success, fontWeight: '700' }}>[  ]</span> {c}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function BankingKnowledge() {
  const [activeTab, setActiveTab] = useState('segments');

  const renderPanel = () => {
    switch (activeTab) {
      case 'segments': return <SegmentsPanel />;
      case 'accounts': return <AccountTypesPanel />;
      case 'customers': return <CustomerTypesPanel />;
      case 'cards': return <CardProductsPanel />;
      case 'operations': return <OperationsPanel />;
      case 'bpm': return <BpmPanel />;
      case 'compliance': return <CompliancePanel />;
      default: return <SegmentsPanel />;
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Banking Domain Knowledge</h1>
        <p style={styles.subtitle}>
          Comprehensive reference covering banking segments, account types, customer categories, card products, operations, BPM flows, and regulatory compliance.
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

      {/* Active Panel */}
      {renderPanel()}
    </div>
  );
}

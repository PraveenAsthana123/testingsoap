import React, { useState, useCallback, useRef, useEffect } from 'react';

/* ================================================================
   Banking QA - Compliance Testing Dashboard
   Tabs: AML Testing | Fraud Testing | Anomaly Detection
   ================================================================ */

/* ─── Color Tokens (Dark Theme) ─── */
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

const riskColor = (level) => {
  const l = (level || '').toLowerCase();
  if (l === 'low' || l === 'normal') return C.green;
  if (l === 'medium' || l === 'warning' || l === 'suspicious') return C.yellow;
  if (l === 'high') return C.highOrange;
  if (l === 'critical' || l === 'anomalous') return C.critical;
  return C.textMuted;
};

const statusColor = (s) => (s === 'Pass' ? C.green : C.red);

/* ─── Shared Styles ─── */
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
  },
  tab: (active) => ({
    padding: '12px 28px',
    cursor: 'pointer',
    fontWeight: active ? 700 : 500,
    fontSize: 15,
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
    flex: '0 0 55%',
    maxWidth: '55%',
    maxHeight: 'calc(100vh - 260px)',
    overflowY: 'auto',
    paddingRight: 10,
  },
  rightPanel: {
    flex: '0 0 45%',
    maxWidth: '45%',
    maxHeight: 'calc(100vh - 260px)',
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
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: C.textMuted,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: `1px solid ${C.inputBorder}`,
    background: C.inputBg,
    color: C.text,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: `1px solid ${C.inputBorder}`,
    background: C.inputBg,
    color: C.text,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
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
  riskMeter: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  riskMeterLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: C.textMuted,
    minWidth: 110,
  },
  riskMeterBarOuter: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    background: C.progressBg,
    overflow: 'hidden',
  },
  riskMeterBarInner: (pct, color) => ({
    width: `${pct}%`,
    height: '100%',
    borderRadius: 7,
    background: `linear-gradient(90deg, ${color}bb, ${color})`,
    transition: 'width 0.6s ease',
  }),
  riskMeterValue: (color) => ({
    fontSize: 13,
    fontWeight: 700,
    color,
    minWidth: 40,
    textAlign: 'right',
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
    border: active ? `2px solid ${C.accent}` : `2px solid transparent`,
    flexShrink: 0,
    transition: 'all 0.3s ease',
    boxShadow: active ? `0 0 8px ${C.accent}66` : 'none',
  }),
  stepText: (active, done) => ({
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    color: done ? C.accent : active ? C.text : C.textDim,
  }),
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
  summaryRow: {
    display: 'flex',
    gap: 16,
    marginTop: 12,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  summaryBox: (color) => ({
    background: `${color}18`,
    border: `1px solid ${color}44`,
    borderRadius: 8,
    padding: '8px 18px',
    textAlign: 'center',
    minWidth: 90,
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
  alertBadge: (level) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 12px',
    borderRadius: 14,
    fontSize: 11,
    fontWeight: 700,
    color: '#fff',
    background: riskColor(level),
    boxShadow: `0 0 8px ${riskColor(level)}44`,
    letterSpacing: 0.4,
  }),
  inlineRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 12,
  },
  inlineItem: {
    flex: 1,
  },
  divider: {
    height: 1,
    background: `${C.border}`,
    margin: '14px 0',
  },
  activeScenario: {
    background: `${C.card}`,
    borderLeft: `4px solid ${C.accent}`,
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    border: `1px solid ${C.accent}44`,
    boxShadow: `0 4px 16px ${C.shadow}, 0 0 12px ${C.accent}11`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  inactiveScenario: {
    background: C.card,
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    border: `1px solid ${C.border}`,
    boxShadow: `0 4px 16px ${C.shadow}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  scenarioHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
};

/* ================================================================
   AML SCENARIOS DATA
   ================================================================ */
const AML_SCENARIOS = [
  {
    id: 'TC-AML-001', title: 'Large Cash Deposit Detection',
    desc: 'Verify the system correctly flags cash deposits exceeding the $10,000 BSA/CTR threshold. Tests both single deposits and aggregate daily deposits per customer.',
    severity: 'High',
    testData: ['$9,999', '$10,001', '$50,000', '$100,000'],
    expected: 'Deposits > $10,000 trigger CTR filing. Deposits at exactly $10,000 also flagged. Aggregate daily deposits crossing threshold generate alert.',
    ruleChecks: ['BSA Threshold Check', 'Aggregate Daily Total', 'CTR Auto-Generation'],
  },
  {
    id: 'TC-AML-002', title: 'Structuring/Smurfing Detection',
    desc: 'Detect patterns of multiple deposits just under the $10,000 reporting threshold designed to evade CTR requirements. Identifies structuring across accounts, branches, and time windows.',
    severity: 'Critical',
    testData: ['$9,500 x3 deposits', '$8,000 + $1,900 split', 'Multiple branches same day'],
    expected: 'System detects deposits under threshold within 48-hour window. Pattern triggers SAR filing. Cross-branch structuring detected.',
    ruleChecks: ['Pattern Window Analysis', 'Threshold Proximity', 'Multi-Branch Correlation'],
  },
  {
    id: 'TC-AML-003', title: 'Suspicious Activity Report (SAR) Generation',
    desc: 'Validate SAR form auto-population, workflow routing, filing deadline compliance (30 days), and FinCEN BSA E-Filing integration.',
    severity: 'Critical',
    testData: ['Auto-triggered SAR', 'Manual SAR', 'Joint account SAR'],
    expected: 'SAR form populated with transaction details, customer info, and narrative. Filing within 30-day deadline tracked. Manager review workflow triggered.',
    ruleChecks: ['Form Population', 'Deadline Tracking', 'Review Workflow'],
  },
  {
    id: 'TC-AML-004', title: 'Currency Transaction Report (CTR) Filing',
    desc: 'Ensure CTR is automatically filed for qualifying cash transactions. Validate FinCEN 104 form accuracy, batch filing, and 15-day deadline compliance.',
    severity: 'High',
    testData: ['$10,001 cash deposit', '$15,000 cash withdrawal', 'Multiple transactions aggregating to $10K+'],
    expected: 'CTR auto-generated within 15 calendar days. Form fields match transaction data. Batch filing works for multiple CTRs.',
    ruleChecks: ['Auto-CTR Generation', 'Form Accuracy', '15-Day Deadline'],
  },
  {
    id: 'TC-AML-005', title: 'Customer Due Diligence (CDD) Verification',
    desc: 'Test CDD collection at account opening: identity verification, beneficial ownership for legal entities, risk rating assignment, and document retention.',
    severity: 'High',
    testData: ['Individual - US citizen', 'LLC - 2 owners', 'Trust - complex structure'],
    expected: 'Identity verified via government ID + SSN. Beneficial owners identified (25%+ threshold). Risk rating assigned based on profile. Documents retained per policy.',
    ruleChecks: ['Identity Verification', 'Beneficial Ownership', 'Risk Rating Assignment'],
  },
  {
    id: 'TC-AML-006', title: 'Enhanced Due Diligence (EDD) for High-Risk Customers',
    desc: 'Validate EDD triggers for PEPs, high-risk geographies, complex ownership structures, and customers with previous SARs. Includes enhanced monitoring frequency.',
    severity: 'Critical',
    testData: ['PEP customer', 'Cayman Islands entity', 'Previous SAR subject'],
    expected: 'EDD triggered automatically for high-risk indicators. Enhanced monitoring activated (daily vs monthly). Senior management approval required for relationship.',
    ruleChecks: ['Risk Trigger Detection', 'Enhanced Monitoring', 'Senior Approval Workflow'],
  },
  {
    id: 'TC-AML-007', title: 'PEP (Politically Exposed Person) Screening',
    desc: 'Screen customers and beneficiaries against PEP databases including domestic and foreign politically exposed persons, their relatives, and close associates (RCA).',
    severity: 'Critical',
    testData: ['Known PEP match', 'Partial name match (fuzzy)', 'RCA - spouse of PEP'],
    expected: 'PEP matches flagged with confidence score. Fuzzy matching catches name variations. RCA relationships identified. Ongoing monitoring activated.',
    ruleChecks: ['Database Screening', 'Fuzzy Name Matching', 'RCA Identification'],
  },
  {
    id: 'TC-AML-008', title: 'Sanctions List Screening (OFAC/UN/EU)',
    desc: 'Real-time screening against OFAC SDN list, UN consolidated list, EU sanctions, and other relevant sanctions programs. Includes name, address, and entity matching.',
    severity: 'Critical',
    testData: ['OFAC SDN exact match', 'UN list partial match', 'Iran-connected entity', 'EU sanctioned country'],
    expected: 'Transactions blocked in real-time for SDN matches. Partial matches queued for review. 100% blocking rate for sanctioned countries. Daily list updates applied.',
    ruleChecks: ['OFAC SDN Screening', 'UN List Check', 'EU Sanctions Check', 'Country Sanctions'],
  },
  {
    id: 'TC-AML-009', title: 'Wire Transfer Monitoring (International)',
    desc: 'Monitor international wire transfers for suspicious patterns, missing originator/beneficiary info (Travel Rule compliance), and high-risk corridor transactions.',
    severity: 'High',
    testData: ['$50K wire to Switzerland', '$100K wire from Cayman Islands', 'Incomplete beneficiary info'],
    expected: 'International wires risk-scored based on amount, corridor, and parties. Travel Rule compliance enforced. High-risk corridors flagged for enhanced review.',
    ruleChecks: ['Travel Rule Compliance', 'Corridor Risk Scoring', 'Amount Threshold Check'],
  },
  {
    id: 'TC-AML-010', title: 'Unusual Account Activity Pattern Detection',
    desc: 'Detect deviations from established customer transaction patterns using statistical models and behavioral analytics. Includes velocity checks and amount anomalies.',
    severity: 'High',
    testData: ['Dormant account sudden activity', '10x normal volume', 'New high-risk country'],
    expected: 'Behavioral baseline established per customer. Deviations beyond 2-sigma flagged. Alert priority based on deviation magnitude and customer risk rating.',
    ruleChecks: ['Baseline Comparison', 'Velocity Analysis', 'Statistical Deviation'],
  },
  {
    id: 'TC-AML-011', title: 'Shell Company Transaction Monitoring',
    desc: 'Identify transactions involving potential shell companies through indicators such as minimal business activity, nominee directors, registered agent addresses, and circular fund flows.',
    severity: 'Critical',
    testData: ['Company with PO Box only', 'Nominee director structure', 'Circular fund flow pattern'],
    expected: 'Shell company indicators scored and aggregated. High-risk entities flagged for investigation. Circular transaction patterns detected across entity network.',
    ruleChecks: ['Entity Structure Analysis', 'Director Screening', 'Circular Flow Detection'],
  },
  {
    id: 'TC-AML-012', title: 'Trade-Based Money Laundering Detection',
    desc: 'Detect trade-based laundering through over/under-invoicing, multiple invoicing, phantom shipments, and misrepresented goods/services in trade finance transactions.',
    severity: 'High',
    testData: ['Invoice 3x market value', 'Duplicate invoice', 'Phantom shipment indicators'],
    expected: 'Trade documents cross-referenced with market prices. Duplicate invoices detected. Phantom shipment indicators flagged. Trade finance red flags aggregated.',
    ruleChecks: ['Price Verification', 'Duplicate Invoice Check', 'Shipment Validation'],
  },
  {
    id: 'TC-AML-013', title: 'Beneficial Ownership Verification',
    desc: 'Verify ultimate beneficial owners (UBO) of legal entities per CDD Final Rule (25% ownership threshold). Test multi-layered corporate structures and trust arrangements.',
    severity: 'High',
    testData: ['Single UBO at 30%', 'Complex chain - 4 layers', 'Trust with multiple beneficiaries'],
    expected: 'All UBOs with 25%+ ownership identified. Multi-layered structures traced to individuals. Missing UBO information triggers enhanced review. Annual recertification tracked.',
    ruleChecks: ['Ownership Threshold Check', 'Layered Structure Analysis', 'Annual Review Trigger'],
  },
  {
    id: 'TC-AML-014', title: 'Cross-Border Transaction Risk Scoring',
    desc: 'Risk score international transactions based on originating/destination country risk ratings, correspondent banking relationships, and transaction characteristics.',
    severity: 'High',
    testData: ['US to Canada (low risk)', 'US to Cayman Islands (high risk)', 'US to Iran (prohibited)'],
    expected: 'Country risk ratings applied from FATF/Basel index. Correspondent bank risk assessed. Composite risk score drives alert priority. Prohibited countries blocked.',
    ruleChecks: ['Country Risk Rating', 'Correspondent Bank Assessment', 'Composite Risk Scoring'],
  },
  {
    id: 'TC-AML-015', title: 'KYC Refresh and Periodic Review Triggers',
    desc: 'Test automated triggers for KYC refresh based on risk rating, material changes, SAR filings, and regulatory timelines (High: annual, Medium: 3 years, Low: 5 years).',
    severity: 'Medium',
    testData: ['High risk - 11 months', 'Medium risk - 35 months', 'SAR filed - immediate review'],
    expected: 'KYC refresh alerts generated per risk-based schedule. Material event changes trigger immediate review. Dashboard tracks upcoming reviews. Escalation for overdue reviews.',
    ruleChecks: ['Schedule-Based Trigger', 'Event-Based Trigger', 'Escalation Workflow'],
  },
];

/* ================================================================
   FRAUD SCENARIOS DATA
   ================================================================ */
const FRAUD_SCENARIOS = [
  {
    id: 'TC-FRD-001', title: 'Duplicate Transaction Detection',
    desc: 'Detect exact and near-duplicate transactions within configurable time windows. Checks same amount, same merchant, same card within 1/5/30 minute windows.',
    severity: 'High',
    testData: ['$250 x2 at same merchant in 30s', '$500 x3 via different channels', 'Retry vs duplicate'],
    expected: 'Exact duplicates blocked in real-time. Near-duplicates flagged for review. Legitimate retries distinguished from fraud. Customer notification sent.',
    pipelineSteps: ['Hash Comparison', 'Time Window Check', 'Amount Match', 'Merchant Match'],
  },
  {
    id: 'TC-FRD-002', title: 'Unusual Login Location (Geo-Velocity Check)',
    desc: 'Detect impossible travel scenarios where login locations change faster than physically possible. Uses IP geolocation and device GPS when available.',
    severity: 'Critical',
    testData: ['NYC then London in 1hr', 'Same city different IP', 'VPN/TOR exit node'],
    expected: 'Impossible travel flagged (>500mph implied velocity). VPN/TOR connections flagged. Step-up authentication triggered. Account temporarily locked for review.',
    pipelineSteps: ['IP Geolocation', 'Velocity Calculation', 'VPN/TOR Detection', 'Risk Scoring'],
  },
  {
    id: 'TC-FRD-003', title: 'Card-Not-Present (CNP) Fraud Detection',
    desc: 'Detect fraudulent online/phone transactions where physical card is not presented. Uses device fingerprinting, shipping address analysis, and velocity checks.',
    severity: 'High',
    testData: ['New device, high value', 'Mismatched billing/shipping', 'Multiple cards same device'],
    expected: 'High-risk CNP transactions flagged for 3DS challenge. Device reputation checked. Shipping address analyzed against customer profile. Velocity limits enforced.',
    pipelineSteps: ['Device Fingerprint', 'Address Verification', 'Velocity Check', '3DS Risk Assessment'],
  },
  {
    id: 'TC-FRD-004', title: 'Account Takeover Attempt Detection',
    desc: 'Identify account takeover through credential changes, unusual device/location combinations, and behavioral anomalies in post-login activity.',
    severity: 'Critical',
    testData: ['Password change + immediate transfer', 'New device + email change', 'Brute force pattern'],
    expected: 'Credential change from new device triggers verification. Rapid succession of security changes blocked. Behavioral biometrics deviation flagged. Customer notified via secondary channel.',
    pipelineSteps: ['Device Trust Check', 'Credential Change Analysis', 'Behavioral Biometrics', 'Customer Verification'],
  },
  {
    id: 'TC-FRD-005', title: 'SIM Swap Fraud Detection',
    desc: 'Detect SIM swap attacks where fraudsters port victim phone numbers to intercept OTP codes. Monitors carrier signals and authentication pattern changes.',
    severity: 'Critical',
    testData: ['SIM change + OTP request', 'Carrier API swap signal', 'IMEI change detected'],
    expected: 'SIM swap detected via carrier API integration. SMS OTP disabled for 72 hours post-swap. Alternative authentication enforced. High-value transactions blocked until verified.',
    pipelineSteps: ['Carrier Signal Check', 'IMEI Tracking', 'Auth Pattern Analysis', 'Transaction Block'],
  },
  {
    id: 'TC-FRD-006', title: 'Phishing Attempt Identification',
    desc: 'Detect phishing-related fraud through analysis of login referrer URLs, credential entry patterns, and post-compromise behavioral indicators.',
    severity: 'High',
    testData: ['Suspicious referrer URL', 'Rapid credential entry (paste)', 'Known phishing domain'],
    expected: 'Phishing domains blocked at WAF level. Credential paste patterns flagged. Post-compromise rapid transfers blocked. Customer warned via push notification.',
    pipelineSteps: ['Referrer Analysis', 'Entry Pattern Check', 'Domain Reputation', 'Behavioral Monitor'],
  },
  {
    id: 'TC-FRD-007', title: 'Man-in-the-Middle Attack Detection',
    desc: 'Detect MITM attacks through SSL certificate anomalies, session token manipulation, and transaction tampering indicators.',
    severity: 'Critical',
    testData: ['Certificate mismatch', 'Session token replay', 'Modified transaction payload'],
    expected: 'Certificate pinning violations detected. Session token integrity verified via HMAC. Transaction payload checksums validated. Connection terminated and customer notified.',
    pipelineSteps: ['Certificate Validation', 'Token Integrity Check', 'Payload Checksum', 'Session Termination'],
  },
  {
    id: 'TC-FRD-008', title: 'Multiple Failed Authentication Attempts',
    desc: 'Track and respond to failed login attempts with progressive security measures: CAPTCHA, temporary lockout, permanent lockout, and fraud team notification.',
    severity: 'Medium',
    testData: ['3 failures (CAPTCHA)', '5 failures (30min lock)', '10 failures (permanent lock)'],
    expected: '3 failures: CAPTCHA activated. 5 failures: 30-minute lockout + email alert. 10 failures: permanent lock + fraud notification. IP-based rate limiting applied.',
    pipelineSteps: ['Attempt Counter', 'Progressive Response', 'IP Rate Limiting', 'Fraud Team Alert'],
  },
  {
    id: 'TC-FRD-009', title: 'Unusual Transaction Time Pattern',
    desc: 'Detect transactions occurring outside customer established behavioral time patterns. Flags late-night/early-morning activity for customers with daytime-only history.',
    severity: 'Medium',
    testData: ['2 AM transfer (normally 9-5)', 'Holiday transaction', 'Weekend pattern change'],
    expected: 'Time-based behavioral baseline per customer. Transactions outside normal window flagged. Risk score adjusted by time deviation. Step-up auth for anomalous times.',
    pipelineSteps: ['Time Profile Load', 'Window Deviation Check', 'Risk Score Adjustment', 'Auth Challenge'],
  },
  {
    id: 'TC-FRD-010', title: 'Rapid Succession of High-Value Transfers',
    desc: 'Detect rapid sequences of high-value transfers that may indicate account compromise or mule account activity. Monitors velocity and cumulative amounts.',
    severity: 'Critical',
    testData: ['$5,000 x5 in 10 minutes', '$10K total in rapid bursts', 'New beneficiaries each time'],
    expected: 'Velocity limits enforced per time window. Cumulative threshold triggers review. New beneficiary + high value = elevated risk. Automatic hold on account.',
    pipelineSteps: ['Velocity Monitor', 'Cumulative Threshold', 'Beneficiary Analysis', 'Account Hold Decision'],
  },
  {
    id: 'TC-FRD-011', title: 'New Device Login with Immediate Transfer',
    desc: 'Flag high-risk pattern where account is accessed from a previously unseen device and a transfer is initiated within the first session.',
    severity: 'High',
    testData: ['New device + $5K transfer in 2min', 'Emulator detected + wire', 'New device + known WiFi'],
    expected: 'New device detection via fingerprint. Immediate transfer trigger flagged. Emulator/rooted device blocked. Known network reduces risk score. MFA enforced.',
    pipelineSteps: ['Device Fingerprint', 'Session Timing', 'Emulator Detection', 'MFA Enforcement'],
  },
  {
    id: 'TC-FRD-012', title: 'Beneficiary Change Followed by Large Transfer',
    desc: 'Detect pattern where beneficiary details are modified and immediately followed by a large transfer - common in business email compromise (BEC) fraud.',
    severity: 'Critical',
    testData: ['Beneficiary change + $50K wire same day', 'Account name change + ACH', 'New payee + max transfer'],
    expected: 'Beneficiary change triggers cooling period (24-48 hrs). Large transfers to new beneficiaries require callback verification. BEC indicators scored. Dual approval enforced.',
    pipelineSteps: ['Change Detection', 'Cooling Period Check', 'Callback Verification', 'Dual Approval'],
  },
  {
    id: 'TC-FRD-013', title: 'Check Fraud Detection (Altered/Forged)',
    desc: 'Detect altered or forged checks through image analysis, signature verification, MICR line validation, and payee name matching.',
    severity: 'High',
    testData: ['Altered amount (wash technique)', 'Forged signature', 'Counterfeit check stock'],
    expected: 'Check image AI detects alterations. Signature verification against on-file specimen. MICR line validated against issuing bank. Payee name cross-referenced with customer data.',
    pipelineSteps: ['Image Analysis', 'Signature Verify', 'MICR Validation', 'Payee Match'],
  },
  {
    id: 'TC-FRD-014', title: 'Identity Theft Detection (SSN/SIN Mismatch)',
    desc: 'Detect identity theft through mismatched personal identifiers, synthetic identity patterns, and cross-referencing with credit bureau data.',
    severity: 'Critical',
    testData: ['SSN associated with different name', 'Synthetic SSN (random generation)', 'Deceased SSN usage'],
    expected: 'SSN ownership verified via credit bureau. Synthetic identity patterns detected (no credit history + new SSN). Deceased records flagged via DMF. Application rejected with SAR filed.',
    pipelineSteps: ['SSN Verification', 'Credit History Check', 'Death Master File', 'Synthetic ID Pattern'],
  },
  {
    id: 'TC-FRD-015', title: 'Mule Account Pattern Detection',
    desc: 'Identify money mule accounts through characteristic patterns: rapid fund-through, multiple senders to single receiver, and recruitment network analysis.',
    severity: 'Critical',
    testData: ['Receive + immediate forward pattern', 'Multiple P2P senders', 'New account high volume'],
    expected: 'Fund-through pattern detected (receive → forward within 24hrs). Multiple unique senders flagged. New account with abnormal volume investigated. Network graph analysis identifies mule rings.',
    pipelineSteps: ['Flow-Through Analysis', 'Sender Diversity', 'Account Age Check', 'Network Graph'],
  },
];

/* ================================================================
   ANOMALY DETECTION SCENARIOS DATA
   ================================================================ */
const ANOMALY_SCENARIOS = [
  {
    id: 'TC-ANM-001', title: 'Transaction Volume Spike Detection',
    desc: 'Detect abnormal spikes in transaction volume that deviate from established baselines. Uses rolling averages and seasonal decomposition for accurate detection.',
    severity: 'High',
    testData: ['Baseline: 50/day, Current: 500/day (10x)', 'Seasonal adjustment needed', 'Holiday expected spike'],
    expected: 'Spikes beyond 3-sigma detected. Seasonal patterns accounted for. Known events (holidays, promotions) whitelisted. Alert with volume trend visualization.',
    algorithm: ['Rolling Average', 'Seasonal Decomposition', 'Z-Score Calculation', 'Threshold Comparison'],
  },
  {
    id: 'TC-ANM-002', title: 'Unusual Account Dormancy Followed by Activity',
    desc: 'Flag accounts with extended dormancy periods (90+ days) that suddenly show transaction activity, especially high-value or international transactions.',
    severity: 'High',
    testData: ['6-month dormant + $10K withdrawal', 'Dormant + international wire', 'Dormant + address change'],
    expected: 'Dormancy period calculated per account. Reactivation triggers alert. Activity type affects severity (wire > debit). Customer verification recommended.',
    algorithm: ['Dormancy Calculator', 'Activity Type Scoring', 'Risk Aggregation', 'Verification Trigger'],
  },
  {
    id: 'TC-ANM-003', title: 'Deviation from Customer Spending Profile',
    desc: 'Detect transactions that deviate significantly from established customer spending patterns including amount, category, frequency, and geographic distribution.',
    severity: 'Medium',
    testData: ['Avg $200 spend, current $5,000', 'New merchant category', 'New geographic region'],
    expected: 'Customer spending profile maintained with rolling 90-day window. Deviations scored by magnitude. Category-level anomalies flagged. Geographic expansion monitored.',
    algorithm: ['Profile Loading', 'Deviation Scoring', 'Category Analysis', 'Geographic Clustering'],
  },
  {
    id: 'TC-ANM-004', title: 'Network Anomaly (Unusual Connection Patterns)',
    desc: 'Monitor banking network infrastructure for unusual connection patterns, unexpected data flows, and potential lateral movement indicative of cyber attacks.',
    severity: 'Critical',
    testData: ['Unusual port scanning', 'Data flow to unknown IP', 'Lateral movement pattern'],
    expected: 'Network baseline established per segment. Unusual connections flagged in real-time. Data exfiltration patterns detected. SOC team alerted for critical findings.',
    algorithm: ['Connection Baseline', 'Port Analysis', 'Flow Volume Check', 'Lateral Movement Detection'],
  },
  {
    id: 'TC-ANM-005', title: 'Data Exfiltration Attempt Detection',
    desc: 'Detect potential data exfiltration through unusual data transfer volumes, off-hours bulk queries, and unauthorized data access patterns.',
    severity: 'Critical',
    testData: ['10GB data transfer at 3AM', 'Bulk customer query', 'USB device + large copy'],
    expected: 'Data transfer volume monitored per user/endpoint. Off-hours bulk access flagged. DLP policies enforced. Endpoint monitoring detects removable media usage.',
    algorithm: ['Volume Monitoring', 'Time Analysis', 'DLP Policy Check', 'Endpoint Detection'],
  },
  {
    id: 'TC-ANM-006', title: 'Abnormal Batch Processing Behavior',
    desc: 'Monitor batch jobs for abnormal execution patterns including unexpected timing, processing duration anomalies, record count deviations, and error rate spikes.',
    severity: 'Medium',
    testData: ['Batch completed in 10min (normal: 2hr)', 'Record count 2x expected', 'Error rate 15% (normal: 0.1%)'],
    expected: 'Batch job profiles maintained. Duration anomalies flagged (both fast and slow). Record count deviations investigated. Error rate thresholds trigger escalation.',
    algorithm: ['Duration Profiling', 'Record Count Check', 'Error Rate Analysis', 'Trend Comparison'],
  },
  {
    id: 'TC-ANM-007', title: 'System Resource Usage Anomaly',
    desc: 'Detect abnormal system resource usage patterns (CPU, memory, disk I/O, network) that may indicate cryptomining, data exfiltration, or DDoS attacks.',
    severity: 'High',
    testData: ['CPU sustained 95% (normal: 40%)', 'Memory leak pattern', 'Disk I/O spike at 2AM'],
    expected: 'Resource baselines per time window. Sustained high usage triggers investigation. Pattern matching for known attack signatures. Automated scaling vs alerting decision.',
    algorithm: ['Resource Baseline', 'Pattern Matching', 'Trend Analysis', 'Attack Signature Check'],
  },
  {
    id: 'TC-ANM-008', title: 'API Call Pattern Anomaly',
    desc: 'Monitor API usage for anomalous patterns including unusual endpoints, excessive call rates, scraping behavior, and authentication bypass attempts.',
    severity: 'High',
    testData: ['1000 calls/min to /accounts (normal: 50)', 'Sequential ID enumeration', 'Unauthenticated probe'],
    expected: 'API usage profiled per client/endpoint. Rate anomalies flagged. Enumeration patterns detected. WAF rules triggered for suspicious behavior.',
    algorithm: ['Rate Profiling', 'Endpoint Analysis', 'Pattern Detection', 'WAF Integration'],
  },
  {
    id: 'TC-ANM-009', title: 'Database Query Anomaly Detection',
    desc: 'Detect anomalous database queries including unusually broad SELECT statements, mass UPDATE/DELETE operations, and privilege escalation attempts.',
    severity: 'Critical',
    testData: ['SELECT * from all customer tables', 'DELETE WHERE 1=1', 'GRANT ALL PRIVILEGES attempt'],
    expected: 'Query patterns baselined per user/application. Broad queries flagged. Destructive operations require approval. Privilege changes audited and alerted.',
    algorithm: ['Query Profiling', 'Scope Analysis', 'Destructive Op Check', 'Privilege Audit'],
  },
  {
    id: 'TC-ANM-010', title: 'Authentication Pattern Anomaly',
    desc: 'Detect anomalous authentication patterns across the organization: mass login attempts, off-hours admin access, service account unusual usage, and SSO anomalies.',
    severity: 'High',
    testData: ['50 admin logins in 5 minutes', 'Service account at 3AM', 'SSO token reuse from different IP'],
    expected: 'Auth patterns profiled per user type. Mass login events trigger lockdown. Off-hours admin access requires justification. SSO token anomalies invalidated.',
    algorithm: ['Pattern Profiling', 'Volume Detection', 'Time Analysis', 'Token Validation'],
  },
  {
    id: 'TC-ANM-011', title: 'Transaction Amount Distribution Outlier',
    desc: 'Statistical detection of transaction amounts that fall outside the normal distribution for a given customer segment, merchant category, or time period.',
    severity: 'Medium',
    testData: ['$50K in segment avg $500', 'Exact round amounts ($1000 x10)', 'Micro-transactions ($0.01 x100)'],
    expected: 'Distribution modeled per segment. Outliers flagged with sigma score. Round amount patterns detected (structuring indicator). Micro-transaction abuse identified.',
    algorithm: ['Distribution Modeling', 'Outlier Scoring', 'Pattern Classification', 'Segment Comparison'],
  },
  {
    id: 'TC-ANM-012', title: 'Time-Series Pattern Deviation',
    desc: 'Detect deviations from expected time-series patterns in transaction flows, system metrics, and business KPIs using ARIMA/Prophet-style decomposition.',
    severity: 'Medium',
    testData: ['Weekday pattern on weekend', 'Missing expected daily peak', 'Trend reversal detection'],
    expected: 'Time-series decomposed into trend, seasonal, and residual. Deviations in any component flagged. Missing patterns detected. Trend reversals trigger investigation.',
    algorithm: ['Trend Extraction', 'Seasonal Decomposition', 'Residual Analysis', 'Forecast Comparison'],
  },
];

/* ================================================================
   HELPER: Simulated Analysis Engine
   ================================================================ */
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);

const alertLevel = (score) => {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 35) return 'Medium';
  return 'Low';
};

const anomalySeverity = (score) => {
  if (score >= 0.7) return 'Critical';
  if (score >= 0.4) return 'Warning';
  return 'Normal';
};

/* ================================================================
   COMPONENT: RiskMeter
   ================================================================ */
const RiskMeter = ({ label, value, max = 100, color }) => {
  const pct = Math.min((value / max) * 100, 100);
  const c = color || riskColor(alertLevel(value));
  return (
    <div style={styles.riskMeter}>
      <span style={styles.riskMeterLabel}>{label}</span>
      <div style={styles.riskMeterBarOuter}>
        <div style={styles.riskMeterBarInner(pct, c)} />
      </div>
      <span style={styles.riskMeterValue(c)}>{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}{max === 100 ? '%' : ''}</span>
    </div>
  );
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
            {done ? '\u2713' : active ? '\u25B6' : '\u25CB'} {step}
          </span>
        </div>
      );
    })}
  </div>
);

/* ================================================================
   COMPONENT: ResultsTable
   ================================================================ */
const ResultsTable = ({ results }) => {
  if (!results || results.length === 0) return null;
  const passed = results.filter((r) => r.status === 'Pass').length;
  const failed = results.length - passed;
  const passRate = ((passed / results.length) * 100).toFixed(1);

  return (
    <div style={{ marginTop: 20 }}>
      <div style={styles.sectionLabel}>
        <span style={{ fontSize: 14 }}>{'\u2630'}</span> Test Results Summary
      </div>
      <div style={styles.summaryRow}>
        <div style={styles.summaryBox(C.blue)}>
          <p style={styles.summaryValue(C.blue)}>{results.length}</p>
          <div style={styles.summaryLabel}>Total Cases</div>
        </div>
        <div style={styles.summaryBox(C.green)}>
          <p style={styles.summaryValue(C.green)}>{passed}</p>
          <div style={styles.summaryLabel}>Passed</div>
        </div>
        <div style={styles.summaryBox(C.red)}>
          <p style={styles.summaryValue(C.red)}>{failed}</p>
          <div style={styles.summaryLabel}>Failed</div>
        </div>
        <div style={styles.summaryBox(passed === results.length ? C.green : C.orange)}>
          <p style={styles.summaryValue(passed === results.length ? C.green : C.orange)}>{passRate}%</p>
          <div style={styles.summaryLabel}>Pass Rate</div>
        </div>
      </div>
      <div style={{ overflowX: 'auto', maxHeight: 320 }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Test Case</th>
              <th style={styles.th}>Input</th>
              <th style={styles.th}>Expected</th>
              <th style={styles.th}>Actual</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(10,39,68,0.3)' }}>
                <td style={{ ...styles.td, fontFamily: 'monospace', color: C.blue, fontWeight: 600 }}>{r.id}</td>
                <td style={{ ...styles.td, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.input}</td>
                <td style={styles.td}>{r.expected}</td>
                <td style={styles.td}>{r.actual}</td>
                <td style={styles.td}>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#000',
                    background: statusColor(r.status),
                  }}>{r.status}</span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 11 }}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================================================================
   TAB 1: AML TESTING
   ================================================================ */
const AMLTab = () => {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [inputs, setInputs] = useState({
    amount: '10001',
    customerId: 'CUST-2847',
    country: 'US',
    transactionType: 'Cash Deposit',
    customerRisk: 'Medium',
  });
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [output, setOutput] = useState(null);
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);

  const processSteps = [
    'Rule 1: BSA Threshold Check ($10,000)',
    'Rule 2: Pattern Analysis (Structuring)',
    'Rule 3: Sanctions Screening (OFAC/UN/EU)',
    'Rule 4: Customer Risk Scoring',
    'Rule 5: Country Risk Assessment',
    'Rule 6: Alert Classification',
  ];

  const runAnalysis = useCallback(() => {
    if (running) return;
    setRunning(true);
    setCompleted(false);
    setOutput(null);
    setCurrentStep(0);

    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      if (step >= processSteps.length) {
        clearInterval(timerRef.current);
        setCurrentStep(processSteps.length);
        setCompleted(true);
        setRunning(false);

        const amt = parseFloat(inputs.amount) || 0;
        let riskScore = 0;
        riskScore += amt > 10000 ? 30 : amt > 5000 ? 15 : 5;
        riskScore += inputs.customerRisk === 'High' ? 25 : inputs.customerRisk === 'Medium' ? 15 : 5;
        riskScore += ['Iran', 'Cayman Islands'].includes(inputs.country) ? 30 : ['Switzerland'].includes(inputs.country) ? 15 : 5;
        riskScore += inputs.transactionType === 'Wire Transfer' ? 10 : inputs.transactionType === 'Cash Deposit' ? 8 : 3;
        riskScore = Math.min(riskScore, 100);

        const level = alertLevel(riskScore);
        const sarRequired = riskScore >= 60 ? 'Yes' : riskScore >= 40 ? 'Review Required' : 'No';
        const action = riskScore >= 80
          ? 'Block transaction. File SAR immediately. Escalate to BSA Officer.'
          : riskScore >= 60
          ? 'Hold transaction for review. Generate SAR. Notify compliance.'
          : riskScore >= 35
          ? 'Allow with monitoring. Flag for periodic review.'
          : 'Allow transaction. Standard monitoring.';

        const analysisOutput = { riskScore, level, sarRequired, action };
        setOutput(analysisOutput);

        const scenario = AML_SCENARIOS[selectedScenario];
        const newResult = {
          id: scenario.id,
          input: `$${inputs.amount} | ${inputs.country} | ${inputs.transactionType}`,
          expected: `Alert: ${scenario.severity}`,
          actual: `Alert: ${level} (Score: ${riskScore})`,
          status: riskScore >= 35 ? 'Pass' : 'Fail',
          time: `${randomBetween(120, 850)}ms`,
        };
        setResults((prev) => [...prev, newResult]);
      } else {
        setCurrentStep(step);
      }
    }, 500);
  }, [running, inputs, selectedScenario, processSteps.length]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div>
      <div style={styles.splitPanel}>
        {/* LEFT: Scenarios */}
        <div style={styles.leftPanel}>
          <div style={styles.sectionLabel}>
            <span style={{ color: C.orange, fontSize: 16 }}>{'\u26A0'}</span> AML Test Scenarios (15)
          </div>
          {AML_SCENARIOS.map((s, i) => (
            <div
              key={s.id}
              style={i === selectedScenario ? styles.activeScenario : styles.inactiveScenario}
              onClick={() => setSelectedScenario(i)}
            >
              <div style={styles.scenarioHeader}>
                <span style={styles.scenarioId}>{s.id}</span>
                <span style={styles.alertBadge(s.severity)}>{s.severity}</span>
              </div>
              <div style={{ ...styles.cardTitle, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
              {i === selectedScenario && (
                <>
                  <p style={styles.cardDesc}>{s.desc}</p>
                  <div style={{ marginTop: 8 }}>
                    {s.testData.map((d, j) => (
                      <span key={j} style={styles.testDataChip(C.blue)}>{d}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: C.textDim, fontWeight: 600 }}>Rule Checks: </span>
                    {s.ruleChecks.map((rc, j) => (
                      <span key={j} style={styles.testDataChip(C.accent)}>{rc}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(78,204,163,0.08)', borderRadius: 6, border: `1px solid ${C.accent}33` }}>
                    <span style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>Expected: </span>
                    <span style={{ fontSize: 11, color: C.textMuted }}>{s.expected}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT: Testing UI */}
        <div style={styles.rightPanel}>
          {/* INPUT */}
          <div style={styles.card}>
            <div style={styles.sectionLabel}>
              <span style={{ color: C.blue }}>{'\u25B6'}</span> Input Parameters
            </div>
            <div style={styles.inlineRow}>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Transaction Amount ($)</label>
                <input
                  style={styles.input}
                  type="number"
                  value={inputs.amount}
                  onChange={(e) => setInputs({ ...inputs, amount: e.target.value })}
                  placeholder="10001"
                />
              </div>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Customer ID</label>
                <input
                  style={styles.input}
                  value={inputs.customerId}
                  onChange={(e) => setInputs({ ...inputs, customerId: e.target.value })}
                  placeholder="CUST-XXXX"
                />
              </div>
            </div>
            <div style={styles.inlineRow}>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Country</label>
                <select
                  style={styles.select}
                  value={inputs.country}
                  onChange={(e) => setInputs({ ...inputs, country: e.target.value })}
                >
                  <option value="US">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Cayman Islands">Cayman Islands</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Iran">Iran (Sanctioned)</option>
                </select>
              </div>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Transaction Type</label>
                <select
                  style={styles.select}
                  value={inputs.transactionType}
                  onChange={(e) => setInputs({ ...inputs, transactionType: e.target.value })}
                >
                  <option>Cash Deposit</option>
                  <option>Wire Transfer</option>
                  <option>ACH</option>
                  <option>Check Deposit</option>
                </select>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Customer Risk Profile</label>
              <select
                style={styles.select}
                value={inputs.customerRisk}
                onChange={(e) => setInputs({ ...inputs, customerRisk: e.target.value })}
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
                <option value="PEP">PEP (Politically Exposed Person)</option>
              </select>
            </div>
          </div>

          {/* PROCESS */}
          <div style={styles.card}>
            <div style={styles.sectionLabel}>
              <span style={{ color: C.orange }}>{'\u2699'}</span> Rule Engine Evaluation
            </div>
            <ProcessSteps steps={processSteps} currentStep={currentStep} completed={completed} />
            {running && (
              <div style={{ marginTop: 8 }}>
                <div style={styles.progressBarOuter}>
                  <div style={styles.progressBarInner((currentStep / processSteps.length) * 100, C.orange)} />
                </div>
                <span style={{ fontSize: 11, color: C.orange }}>Processing step {currentStep + 1} of {processSteps.length}...</span>
              </div>
            )}
            <button style={styles.runBtn(running)} onClick={runAnalysis} disabled={running}>
              {running ? 'Analyzing...' : 'Run AML Analysis'}
            </button>
          </div>

          {/* OUTPUT */}
          {output && (
            <div style={styles.card}>
              <div style={styles.sectionLabel}>
                <span style={{ color: C.green }}>{'\u2713'}</span> Analysis Results
              </div>
              <RiskMeter label="Risk Score" value={output.riskScore} />
              <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                <div>
                  <span style={styles.label}>Alert Level</span>
                  <div style={styles.alertBadge(output.level)}>{output.level}</div>
                </div>
                <div>
                  <span style={styles.label}>SAR Required</span>
                  <div style={styles.alertBadge(output.sarRequired === 'Yes' ? 'Critical' : output.sarRequired === 'Review Required' ? 'High' : 'Low')}>
                    {output.sarRequired}
                  </div>
                </div>
              </div>
              <div style={styles.outputCard}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>Recommended Action:</span>
                <p style={{ fontSize: 12, color: C.text, margin: '6px 0 0', lineHeight: 1.6 }}>{output.action}</p>
              </div>
            </div>
          )}

          {/* RESULTS TABLE */}
          <ResultsTable results={results} />
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   TAB 2: FRAUD TESTING
   ================================================================ */
const FraudTab = () => {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [inputs, setInputs] = useState({
    transactionAmount: '5000',
    merchantName: 'Online Electronics Store',
    ipAddress: '203.0.113.50',
    deviceType: 'New Device',
    loginLocation: 'New York, US',
    previousLocation: 'London, UK',
    timeSinceLastLogin: '45',
    transactionTime: 'Late Night (2-4 AM)',
  });
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [output, setOutput] = useState(null);
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);

  const processSteps = [
    'Device Fingerprint Verification',
    'Geo-Velocity Analysis',
    'Transaction Amount Pattern Check',
    'Behavioral Analysis Engine',
    'ML Model Scoring (Ensemble)',
    'Decision Engine',
  ];

  const runAnalysis = useCallback(() => {
    if (running) return;
    setRunning(true);
    setCompleted(false);
    setOutput(null);
    setCurrentStep(0);

    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      if (step >= processSteps.length) {
        clearInterval(timerRef.current);
        setCurrentStep(processSteps.length);
        setCompleted(true);
        setRunning(false);

        let fraudScore = 0;
        const amt = parseFloat(inputs.transactionAmount) || 0;
        fraudScore += amt > 5000 ? 25 : amt > 1000 ? 15 : 5;
        fraudScore += inputs.ipAddress.includes('203.0.113') ? 20 : inputs.ipAddress.includes('TOR') ? 30 : 5;
        fraudScore += inputs.deviceType === 'Emulator' ? 30 : inputs.deviceType === 'New Device' ? 20 : 5;
        fraudScore += inputs.transactionTime.includes('Late Night') ? 15 : inputs.transactionTime.includes('Holiday') ? 10 : 3;
        const timeSince = parseFloat(inputs.timeSinceLastLogin) || 0;
        if (timeSince < 60 && inputs.previousLocation !== inputs.loginLocation) fraudScore += 15;
        fraudScore = Math.min(fraudScore, 100);

        const fraudTypes = [];
        if (inputs.deviceType === 'New Device' || inputs.deviceType === 'Emulator') fraudTypes.push('Device Anomaly');
        if (timeSince < 120 && inputs.previousLocation !== inputs.loginLocation) fraudTypes.push('Geo-Velocity');
        if (amt > 5000) fraudTypes.push('High-Value');
        if (inputs.transactionTime.includes('Late Night')) fraudTypes.push('Time Anomaly');
        if (inputs.ipAddress.includes('TOR')) fraudTypes.push('TOR Network');
        if (fraudTypes.length === 0) fraudTypes.push('None Detected');

        const decision = fraudScore >= 75 ? 'BLOCK' : fraudScore >= 50 ? 'CHALLENGE (Step-Up Auth)' : fraudScore >= 30 ? 'ALLOW with Monitoring' : 'ALLOW';
        const alertGenerated = fraudScore >= 50;

        const analysisOutput = { fraudScore, fraudTypes, decision, alertGenerated };
        setOutput(analysisOutput);

        const scenario = FRAUD_SCENARIOS[selectedScenario];
        const newResult = {
          id: scenario.id,
          input: `$${inputs.transactionAmount} | ${inputs.deviceType} | ${inputs.ipAddress}`,
          expected: `Detect: ${scenario.severity}`,
          actual: `Score: ${fraudScore} | ${decision}`,
          status: fraudScore >= 30 ? 'Pass' : 'Fail',
          time: `${randomBetween(80, 650)}ms`,
        };
        setResults((prev) => [...prev, newResult]);
      } else {
        setCurrentStep(step);
      }
    }, 450);
  }, [running, inputs, selectedScenario, processSteps.length]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div>
      <div style={styles.splitPanel}>
        {/* LEFT: Scenarios */}
        <div style={styles.leftPanel}>
          <div style={styles.sectionLabel}>
            <span style={{ color: C.red, fontSize: 16 }}>{'\u26D4'}</span> Fraud Test Scenarios (15)
          </div>
          {FRAUD_SCENARIOS.map((s, i) => (
            <div
              key={s.id}
              style={i === selectedScenario ? styles.activeScenario : styles.inactiveScenario}
              onClick={() => setSelectedScenario(i)}
            >
              <div style={styles.scenarioHeader}>
                <span style={styles.scenarioId}>{s.id}</span>
                <span style={styles.alertBadge(s.severity)}>{s.severity}</span>
              </div>
              <div style={{ ...styles.cardTitle, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
              {i === selectedScenario && (
                <>
                  <p style={styles.cardDesc}>{s.desc}</p>
                  <div style={{ marginTop: 8 }}>
                    {s.testData.map((d, j) => (
                      <span key={j} style={styles.testDataChip(C.red)}>{d}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: C.textDim, fontWeight: 600 }}>Detection Pipeline: </span>
                    {s.pipelineSteps.map((ps, j) => (
                      <span key={j} style={styles.testDataChip(C.orange)}>{ps}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(231,76,60,0.08)', borderRadius: 6, border: `1px solid ${C.red}33` }}>
                    <span style={{ fontSize: 11, color: C.red, fontWeight: 700 }}>Expected: </span>
                    <span style={{ fontSize: 11, color: C.textMuted }}>{s.expected}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT: Testing UI */}
        <div style={styles.rightPanel}>
          {/* INPUT */}
          <div style={styles.card}>
            <div style={styles.sectionLabel}>
              <span style={{ color: C.blue }}>{'\u25B6'}</span> Input Parameters
            </div>
            <div style={styles.inlineRow}>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Transaction Amount ($)</label>
                <input
                  style={styles.input}
                  type="number"
                  value={inputs.transactionAmount}
                  onChange={(e) => setInputs({ ...inputs, transactionAmount: e.target.value })}
                />
              </div>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Merchant Name</label>
                <input
                  style={styles.input}
                  value={inputs.merchantName}
                  onChange={(e) => setInputs({ ...inputs, merchantName: e.target.value })}
                />
              </div>
            </div>
            <div style={styles.inlineRow}>
              <div style={styles.inlineItem}>
                <label style={styles.label}>IP Address</label>
                <select
                  style={styles.select}
                  value={inputs.ipAddress}
                  onChange={(e) => setInputs({ ...inputs, ipAddress: e.target.value })}
                >
                  <option value="192.168.1.1">192.168.1.1 (Known)</option>
                  <option value="203.0.113.50">203.0.113.50 (Suspicious)</option>
                  <option value="TOR Exit Node">TOR Exit Node</option>
                </select>
              </div>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Device Type</label>
                <select
                  style={styles.select}
                  value={inputs.deviceType}
                  onChange={(e) => setInputs({ ...inputs, deviceType: e.target.value })}
                >
                  <option value="Known Device">Known Device</option>
                  <option value="New Device">New Device</option>
                  <option value="Emulator">Emulator</option>
                </select>
              </div>
            </div>
            <div style={styles.inlineRow}>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Login Location</label>
                <select
                  style={styles.select}
                  value={inputs.loginLocation}
                  onChange={(e) => setInputs({ ...inputs, loginLocation: e.target.value })}
                >
                  <option>New York, US</option>
                  <option>London, UK</option>
                  <option>Lagos, Nigeria</option>
                  <option>Moscow, Russia</option>
                  <option>Shanghai, China</option>
                </select>
              </div>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Previous Location</label>
                <select
                  style={styles.select}
                  value={inputs.previousLocation}
                  onChange={(e) => setInputs({ ...inputs, previousLocation: e.target.value })}
                >
                  <option>New York, US</option>
                  <option>London, UK</option>
                  <option>Lagos, Nigeria</option>
                  <option>Moscow, Russia</option>
                  <option>Shanghai, China</option>
                </select>
              </div>
            </div>
            <div style={styles.inlineRow}>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Minutes Since Last Login</label>
                <input
                  style={styles.input}
                  type="number"
                  value={inputs.timeSinceLastLogin}
                  onChange={(e) => setInputs({ ...inputs, timeSinceLastLogin: e.target.value })}
                />
              </div>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Transaction Time</label>
                <select
                  style={styles.select}
                  value={inputs.transactionTime}
                  onChange={(e) => setInputs({ ...inputs, transactionTime: e.target.value })}
                >
                  <option>Business Hours (9AM-5PM)</option>
                  <option>Late Night (2-4 AM)</option>
                  <option>Holiday</option>
                  <option>Weekend</option>
                </select>
              </div>
            </div>
          </div>

          {/* PROCESS */}
          <div style={styles.card}>
            <div style={styles.sectionLabel}>
              <span style={{ color: C.red }}>{'\u2699'}</span> Fraud Detection Pipeline
            </div>
            <ProcessSteps steps={processSteps} currentStep={currentStep} completed={completed} />
            {running && (
              <div style={{ marginTop: 8 }}>
                <div style={styles.progressBarOuter}>
                  <div style={styles.progressBarInner((currentStep / processSteps.length) * 100, C.red)} />
                </div>
                <span style={{ fontSize: 11, color: C.red }}>Analyzing step {currentStep + 1} of {processSteps.length}...</span>
              </div>
            )}
            <button style={styles.runBtn(running)} onClick={runAnalysis} disabled={running}>
              {running ? 'Detecting...' : 'Run Fraud Analysis'}
            </button>
          </div>

          {/* OUTPUT */}
          {output && (
            <div style={styles.card}>
              <div style={styles.sectionLabel}>
                <span style={{ color: C.green }}>{'\u2713'}</span> Detection Results
              </div>
              <RiskMeter label="Fraud Score" value={output.fraudScore} />
              <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div>
                  <span style={styles.label}>Fraud Type(s)</span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    {output.fraudTypes.map((ft, i) => (
                      <span key={i} style={styles.testDataChip(ft === 'None Detected' ? C.green : C.red)}>{ft}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                <div>
                  <span style={styles.label}>Decision</span>
                  <div style={styles.alertBadge(
                    output.decision.includes('BLOCK') ? 'Critical'
                    : output.decision.includes('CHALLENGE') ? 'High'
                    : output.decision.includes('Monitoring') ? 'Medium'
                    : 'Low'
                  )}>{output.decision}</div>
                </div>
                <div>
                  <span style={styles.label}>Alert Generated</span>
                  <div style={styles.alertBadge(output.alertGenerated ? 'High' : 'Low')}>
                    {output.alertGenerated ? 'Yes - Fraud Alert' : 'No'}
                  </div>
                </div>
              </div>
              <div style={styles.outputCard}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.red }}>Detection Summary:</span>
                <p style={{ fontSize: 12, color: C.text, margin: '6px 0 0', lineHeight: 1.6 }}>
                  {output.decision.includes('BLOCK')
                    ? 'Transaction BLOCKED. Fraud case opened. Customer notified via secure channel. Account placed on temporary hold pending investigation.'
                    : output.decision.includes('CHALLENGE')
                    ? 'Step-up authentication required. OTP sent to registered device. Transaction held for 30 minutes pending verification.'
                    : output.decision.includes('Monitoring')
                    ? 'Transaction allowed with enhanced monitoring. Activity flagged for 7-day review window. Behavioral baseline updated.'
                    : 'Transaction approved. No significant fraud indicators detected. Standard monitoring continues.'}
                </p>
              </div>
            </div>
          )}

          {/* RESULTS TABLE */}
          <ResultsTable results={results} />
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   TAB 3: ANOMALY DETECTION
   ================================================================ */
const AnomalyTab = () => {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [inputs, setInputs] = useState({
    metricType: 'Transaction Volume',
    timeWindow: '24 hours',
    baselineValue: '50',
    currentValue: '500',
    sigmaThreshold: '3',
    mlModelThreshold: '0.7',
  });
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [output, setOutput] = useState(null);
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);

  const processSteps = [
    'Data Collection & Ingestion',
    'Feature Extraction & Engineering',
    'Statistical Analysis (Z-Score/IQR)',
    'ML Model Inference (Isolation Forest)',
    'Threshold Comparison & Classification',
    'Root Cause Analysis',
  ];

  const runAnalysis = useCallback(() => {
    if (running) return;
    setRunning(true);
    setCompleted(false);
    setOutput(null);
    setCurrentStep(0);

    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      if (step >= processSteps.length) {
        clearInterval(timerRef.current);
        setCurrentStep(processSteps.length);
        setCompleted(true);
        setRunning(false);

        const baseline = parseFloat(inputs.baselineValue) || 50;
        const current = parseFloat(inputs.currentValue) || 50;
        const sigma = parseFloat(inputs.sigmaThreshold) || 3;

        const deviation = baseline > 0 ? ((current - baseline) / baseline) * 100 : 0;
        const zScore = baseline > 0 ? Math.abs(current - baseline) / (baseline * 0.25) : 0;
        const anomalyScore = randomFloat(
          zScore > sigma ? 0.7 : zScore > 2 ? 0.35 : 0.05,
          zScore > sigma ? 0.98 : zScore > 2 ? 0.69 : 0.29
        );
        const severity = anomalySeverity(anomalyScore);

        const rootCauses = [];
        if (deviation > 500) rootCauses.push('Extreme volume spike - possible DDoS or bot activity');
        else if (deviation > 200) rootCauses.push('Significant deviation - investigate operational changes');
        else if (deviation > 100) rootCauses.push('Moderate increase - may correlate with marketing campaign');
        if (inputs.metricType === 'Transaction Volume') rootCauses.push('Check for batch processing anomalies');
        if (inputs.metricType === 'API Calls') rootCauses.push('Review API client rate patterns');
        if (inputs.metricType === 'System Resources') rootCauses.push('Check for cryptomining or resource abuse');
        if (inputs.metricType === 'Login Attempts') rootCauses.push('Possible credential stuffing attack');
        if (rootCauses.length === 0) rootCauses.push('Within normal operating parameters');

        const analysisOutput = {
          anomalyScore,
          deviation: deviation.toFixed(1),
          zScore: zScore.toFixed(2),
          severity,
          rootCauses,
          confidence: randomFloat(0.82, 0.99),
        };
        setOutput(analysisOutput);

        const scenario = ANOMALY_SCENARIOS[selectedScenario];
        const newResult = {
          id: scenario.id,
          input: `${inputs.metricType} | Baseline: ${baseline} | Current: ${current}`,
          expected: `Detect: ${scenario.severity}`,
          actual: `Score: ${anomalyScore} | ${severity}`,
          status: anomalyScore >= parseFloat(inputs.mlModelThreshold) * 0.5 ? 'Pass' : 'Fail',
          time: `${randomBetween(200, 1200)}ms`,
        };
        setResults((prev) => [...prev, newResult]);
      } else {
        setCurrentStep(step);
      }
    }, 550);
  }, [running, inputs, selectedScenario, processSteps.length]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div>
      <div style={styles.splitPanel}>
        {/* LEFT: Scenarios */}
        <div style={styles.leftPanel}>
          <div style={styles.sectionLabel}>
            <span style={{ color: C.yellow, fontSize: 16 }}>{'\u26A1'}</span> Anomaly Detection Scenarios (12)
          </div>
          {ANOMALY_SCENARIOS.map((s, i) => (
            <div
              key={s.id}
              style={i === selectedScenario ? styles.activeScenario : styles.inactiveScenario}
              onClick={() => setSelectedScenario(i)}
            >
              <div style={styles.scenarioHeader}>
                <span style={styles.scenarioId}>{s.id}</span>
                <span style={styles.alertBadge(s.severity)}>{s.severity}</span>
              </div>
              <div style={{ ...styles.cardTitle, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
              {i === selectedScenario && (
                <>
                  <p style={styles.cardDesc}>{s.desc}</p>
                  <div style={{ marginTop: 8 }}>
                    {s.testData.map((d, j) => (
                      <span key={j} style={styles.testDataChip(C.yellow)}>{d}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: C.textDim, fontWeight: 600 }}>Algorithm Steps: </span>
                    {s.algorithm.map((a, j) => (
                      <span key={j} style={styles.testDataChip(C.blue)}>{a}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(241,196,15,0.08)', borderRadius: 6, border: `1px solid ${C.yellow}33` }}>
                    <span style={{ fontSize: 11, color: C.yellow, fontWeight: 700 }}>Expected: </span>
                    <span style={{ fontSize: 11, color: C.textMuted }}>{s.expected}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT: Testing UI */}
        <div style={styles.rightPanel}>
          {/* INPUT */}
          <div style={styles.card}>
            <div style={styles.sectionLabel}>
              <span style={{ color: C.blue }}>{'\u25B6'}</span> Input Parameters
            </div>
            <div style={styles.inlineRow}>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Metric Type</label>
                <select
                  style={styles.select}
                  value={inputs.metricType}
                  onChange={(e) => setInputs({ ...inputs, metricType: e.target.value })}
                >
                  <option>Transaction Volume</option>
                  <option>Transaction Amount</option>
                  <option>API Calls</option>
                  <option>Login Attempts</option>
                  <option>System Resources</option>
                  <option>Database Queries</option>
                  <option>Network Traffic</option>
                </select>
              </div>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Time Window</label>
                <select
                  style={styles.select}
                  value={inputs.timeWindow}
                  onChange={(e) => setInputs({ ...inputs, timeWindow: e.target.value })}
                >
                  <option>1 hour</option>
                  <option>6 hours</option>
                  <option>24 hours</option>
                  <option>7 days</option>
                  <option>30 days</option>
                </select>
              </div>
            </div>
            <div style={styles.inlineRow}>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Baseline Value</label>
                <input
                  style={styles.input}
                  type="number"
                  value={inputs.baselineValue}
                  onChange={(e) => setInputs({ ...inputs, baselineValue: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Current Value</label>
                <input
                  style={styles.input}
                  type="number"
                  value={inputs.currentValue}
                  onChange={(e) => setInputs({ ...inputs, currentValue: e.target.value })}
                  placeholder="500"
                />
              </div>
            </div>
            <div style={styles.inlineRow}>
              <div style={styles.inlineItem}>
                <label style={styles.label}>Sigma Threshold</label>
                <select
                  style={styles.select}
                  value={inputs.sigmaThreshold}
                  onChange={(e) => setInputs({ ...inputs, sigmaThreshold: e.target.value })}
                >
                  <option value="2">2 Sigma (95.45%)</option>
                  <option value="3">3 Sigma (99.73%)</option>
                  <option value="4">4 Sigma (99.99%)</option>
                </select>
              </div>
              <div style={styles.inlineItem}>
                <label style={styles.label}>ML Model Threshold</label>
                <select
                  style={styles.select}
                  value={inputs.mlModelThreshold}
                  onChange={(e) => setInputs({ ...inputs, mlModelThreshold: e.target.value })}
                >
                  <option value="0.3">0.3 (Sensitive)</option>
                  <option value="0.5">0.5 (Balanced)</option>
                  <option value="0.7">0.7 (Conservative)</option>
                  <option value="0.9">0.9 (Strict)</option>
                </select>
              </div>
            </div>
          </div>

          {/* PROCESS */}
          <div style={styles.card}>
            <div style={styles.sectionLabel}>
              <span style={{ color: C.yellow }}>{'\u2699'}</span> Detection Algorithm Pipeline
            </div>
            <ProcessSteps steps={processSteps} currentStep={currentStep} completed={completed} />
            {running && (
              <div style={{ marginTop: 8 }}>
                <div style={styles.progressBarOuter}>
                  <div style={styles.progressBarInner((currentStep / processSteps.length) * 100, C.yellow)} />
                </div>
                <span style={{ fontSize: 11, color: C.yellow }}>Processing step {currentStep + 1} of {processSteps.length}...</span>
              </div>
            )}
            <button style={styles.runBtn(running)} onClick={runAnalysis} disabled={running}>
              {running ? 'Detecting Anomalies...' : 'Run Anomaly Detection'}
            </button>
          </div>

          {/* OUTPUT */}
          {output && (
            <div style={styles.card}>
              <div style={styles.sectionLabel}>
                <span style={{ color: C.green }}>{'\u2713'}</span> Detection Results
              </div>
              <RiskMeter label="Anomaly Score" value={output.anomalyScore} max={1} color={riskColor(output.severity)} />
              <RiskMeter
                label="Deviation"
                value={Math.min(Math.abs(parseFloat(output.deviation)), 100)}
                max={100}
                color={Math.abs(parseFloat(output.deviation)) > 200 ? C.red : Math.abs(parseFloat(output.deviation)) > 100 ? C.orange : C.yellow}
              />
              <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                <div>
                  <span style={styles.label}>Severity</span>
                  <div style={styles.alertBadge(output.severity)}>{output.severity}</div>
                </div>
                <div>
                  <span style={styles.label}>Z-Score</span>
                  <div style={{
                    ...styles.alertBadge(parseFloat(output.zScore) > 3 ? 'Critical' : parseFloat(output.zScore) > 2 ? 'High' : 'Low'),
                    fontFamily: 'monospace',
                  }}>
                    {output.zScore}
                  </div>
                </div>
                <div>
                  <span style={styles.label}>Deviation</span>
                  <div style={{
                    ...styles.alertBadge(Math.abs(parseFloat(output.deviation)) > 200 ? 'Critical' : Math.abs(parseFloat(output.deviation)) > 100 ? 'High' : 'Medium'),
                    fontFamily: 'monospace',
                  }}>
                    {output.deviation}%
                  </div>
                </div>
                <div>
                  <span style={styles.label}>Confidence</span>
                  <div style={{ ...styles.alertBadge('Low'), fontFamily: 'monospace' }}>
                    {(output.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div style={styles.outputCard}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.yellow }}>Root Cause Suggestions:</span>
                <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                  {output.rootCauses.map((rc, i) => (
                    <li key={i} style={{ fontSize: 12, color: C.text, lineHeight: 1.7, listStyleType: 'disc' }}>{rc}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* RESULTS TABLE */}
          <ResultsTable results={results} />
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   MAIN: ComplianceTesting
   ================================================================ */
const TABS = [
  { id: 'aml', label: 'AML Testing', icon: '\u26A0', color: C.orange, count: 15 },
  { id: 'fraud', label: 'Fraud Testing', icon: '\u26D4', color: C.red, count: 15 },
  { id: 'anomaly', label: 'Anomaly Detection', icon: '\u26A1', color: C.yellow, count: 12 },
];

const ComplianceTesting = () => {
  const [activeTab, setActiveTab] = useState('aml');

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.h1}>Compliance Testing Dashboard</h1>
        <p style={styles.subtitle}>
          Banking QA -- AML, Fraud Detection & Anomaly Analysis | 42 Test Scenarios
        </p>
      </div>

      {/* STAT BADGES */}
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <div
            key={t.id}
            style={{
              background: activeTab === t.id ? `${t.color}22` : `${C.card}`,
              border: `1px solid ${activeTab === t.id ? t.color : C.border}`,
              borderRadius: 10,
              padding: '10px 22px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              minWidth: 160,
            }}
            onClick={() => setActiveTab(t.id)}
          >
            <div style={{ fontSize: 22, marginBottom: 2 }}>{t.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginTop: 2 }}>{t.count}</div>
            <div style={{ fontSize: 10, color: C.textDim }}>Test Scenarios</div>
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
      {activeTab === 'aml' && <AMLTab />}
      {activeTab === 'fraud' && <FraudTab />}
      {activeTab === 'anomaly' && <AnomalyTab />}
    </div>
  );
};

export default ComplianceTesting;

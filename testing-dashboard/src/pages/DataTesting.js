import React, { useState } from 'react';

/* ================================================================
   Banking Data Testing - Comprehensive Testing Scenarios
   Tabs: Ingestion | Transformation | Governance | Query/Extraction
         | Modeling | Visualization | Authorization | Security
   ================================================================ */

/* ─── Color Tokens (Dark Theme) ─── */
const C = {
  bgGradientFrom: '#1a1a2e',
  bgGradientTo: '#16213e',
  card: '#0f3460',
  cardHover: '#134b8a',
  accent: '#4ecca3',
  text: '#e0e0e0',
  textWhite: '#ffffff',
  border: 'rgba(78,204,163,0.3)',
  severityCritical: '#e74c3c',
  severityHigh: '#e67e22',
  severityMedium: '#f39c12',
  severityLow: '#27ae60',
  shadow: 'rgba(0,0,0,0.4)',
  tabActive: '#4ecca3',
  tabInactive: 'rgba(15,52,96,0.7)',
  inputBg: '#0a2744',
  statBg: 'rgba(15,52,96,0.6)',
};

const severityColor = (sev) => {
  const s = (sev || '').toLowerCase();
  if (s === 'critical') return C.severityCritical;
  if (s === 'high') return C.severityHigh;
  if (s === 'medium') return C.severityMedium;
  if (s === 'low') return C.severityLow;
  return C.text;
};

/* ================================================================
   TAB DEFINITIONS
   ================================================================ */
const TABS = [
  { id: 'ingestion', label: 'Data Ingestion' },
  { id: 'transformation', label: 'Data Transformation' },
  { id: 'governance', label: 'Data Governance' },
  { id: 'query', label: 'Query / Extraction' },
  { id: 'modeling', label: 'Data Modeling' },
  { id: 'visualization', label: 'Visualization / Reporting' },
  { id: 'authorization', label: 'Data Authorization' },
  { id: 'security', label: 'Data Security' },
];

/* ================================================================
   SCENARIO DATA
   ================================================================ */

const SCENARIOS = {
  /* ─────────── TAB 1: DATA INGESTION TESTING ─────────── */
  ingestion: [
    {
      id: 'DI-001',
      title: 'Real-Time Transaction Feed Ingestion',
      description: 'Validate that real-time transaction feeds from the core banking system are ingested into the data lake without data loss, latency spikes, or schema drift. The pipeline must handle peak volumes during salary-credit days (10x normal throughput) and maintain exactly-once delivery semantics.',
      steps: [
        'Configure the Kafka/MQ consumer to subscribe to the core banking transaction topic with exactly-once semantics enabled.',
        'Inject 50,000 transactions per second for 15 minutes simulating peak salary-credit-day volume.',
        'Compare source record count and checksums against records landed in the data lake staging layer.',
        'Verify that no duplicate transaction IDs exist in the target and that all mandatory fields (txn_id, account_no, amount, timestamp) are populated.',
        'Validate end-to-end latency is under the 5-second SLA for 99th percentile.'
      ],
      expectedResult: 'All transactions land in the data lake within the 5-second SLA. Zero data loss, zero duplicates. Schema matches the agreed contract. Monitoring dashboards reflect accurate throughput and lag metrics.',
      severity: 'Critical',
      category: 'Real-Time Streaming',
    },
    {
      id: 'DI-002',
      title: 'Batch File Ingestion (SWIFT/ISO 20022 & ACH)',
      description: 'Verify that daily batch files in SWIFT MT/MX (ISO 20022) and ACH NACHA formats are parsed correctly, validated against schema definitions, and loaded into the staging area. Malformed records must be quarantined without halting the entire batch.',
      steps: [
        'Place sample SWIFT MT103, MT202, ISO 20022 pain.001, and ACH NACHA files in the configured SFTP landing zone.',
        'Trigger the batch ingestion scheduler and monitor the parsing log for schema validation results.',
        'Inject 3 deliberately malformed records (invalid BIC code, missing mandatory tag, incorrect checksum) into the batch files.',
        'Verify quarantined records are routed to the error table with descriptive rejection reasons.',
        'Confirm that valid records are committed to the staging area with correct field mappings.'
      ],
      expectedResult: 'Valid records are loaded with 100% field-mapping accuracy. Malformed records are quarantined with clear error codes (E-101: Invalid BIC, E-102: Missing Tag, E-103: Checksum Mismatch). Batch completion status is PARTIAL_SUCCESS with quarantine count reported.',
      severity: 'Critical',
      category: 'Batch Processing',
    },
    {
      id: 'DI-003',
      title: 'CDC from Core Banking Database',
      description: 'Test Change Data Capture (CDC) from the core banking Oracle/DB2 database to ensure inserts, updates, and deletes on customer and account tables are captured in near-real-time and replicated accurately to the analytics data store.',
      steps: [
        'Enable CDC (Oracle GoldenGate / Debezium) on the customer_master and account_balance tables.',
        'Perform a controlled set of operations: 100 inserts, 50 updates (including primary key-adjacent fields), and 10 soft deletes.',
        'Verify that all change events appear in the CDC topic/stream within the configured latency window (under 30 seconds).',
        'Validate that update events carry both before and after images for audit trail reconstruction.',
        'Confirm that the target analytics store reflects the final state matching the source after all operations complete.'
      ],
      expectedResult: 'CDC captures 100% of DML operations. Before/after images are intact for updates. Soft deletes propagate correctly with delete flags. Target store is eventually consistent within 30 seconds. No orphan or phantom records in the target.',
      severity: 'Critical',
      category: 'Change Data Capture',
    },
    {
      id: 'DI-004',
      title: 'API-Based Data Ingestion from Partner Systems',
      description: 'Validate the REST/SOAP API-based ingestion pipeline that pulls credit bureau data, insurance partner feeds, and mutual fund NAV data. The pipeline must handle API rate limits, authentication token refresh, and partial response pagination gracefully.',
      steps: [
        'Configure API connectors for 3 partner endpoints: credit bureau (REST), insurance (SOAP/XML), and MF NAV (REST with pagination).',
        'Execute a full pull cycle and verify that paginated responses are concatenated correctly without missing or duplicating pages.',
        'Simulate an OAuth2 token expiry mid-pull by setting a 60-second token TTL and verifying automatic token refresh.',
        'Simulate HTTP 429 (rate limit exceeded) and verify the pipeline applies exponential backoff and retries.',
        'Validate ingested data against partner-provided reconciliation checksums.'
      ],
      expectedResult: 'All partner data is ingested completely. Token refresh is transparent with zero data loss. Rate-limited requests are retried successfully within 3 attempts. Paginated data is complete with no gaps. Reconciliation checksums match 100%.',
      severity: 'High',
      category: 'API Integration',
    },
    {
      id: 'DI-005',
      title: 'ATM/POS Transaction Stream Ingestion',
      description: 'Test the ingestion of ATM withdrawal and POS purchase transaction streams from the card switch/network processor. These streams arrive in ISO 8583 message format and must be decoded, enriched with merchant category codes, and stored for fraud analytics.',
      steps: [
        'Simulate 10,000 ISO 8583 authorization and settlement messages from the ATM/POS switch simulator.',
        'Verify that all message types (0100-authorization, 0200-financial, 0400-reversal, 0800-network management) are correctly parsed.',
        'Validate that merchant category code (MCC) enrichment is applied by cross-referencing the MCC lookup table.',
        'Test handling of reversal messages (0400) to ensure the original transaction is correctly linked and flagged.',
        'Check that geo-location data (terminal ID to branch mapping) is correctly attached to each transaction.'
      ],
      expectedResult: 'All ISO 8583 message types are parsed without errors. MCC enrichment accuracy is 100%. Reversal messages are linked to original transactions. Geo-location mapping is accurate. Stream processing lag is under 2 seconds.',
      severity: 'Critical',
      category: 'Real-Time Streaming',
    },
    {
      id: 'DI-006',
      title: 'Customer Onboarding Data Ingestion (KYC Documents)',
      description: 'Verify that customer onboarding data including KYC documents (Aadhaar, PAN, passport scans), video KYC recordings, and e-signed application forms are ingested into the document management system with proper metadata tagging and PII encryption.',
      steps: [
        'Submit 50 customer onboarding applications through the digital channel with attached KYC documents in PDF, JPEG, and MP4 formats.',
        'Verify that all documents are stored in the encrypted object store (S3/Azure Blob) with correct customer_id tagging.',
        'Validate that PII fields (Aadhaar number, PAN) extracted via OCR are encrypted before storage in the metadata database.',
        'Check that document type classification (ID proof, address proof, photo, signature) is accurately assigned.',
        'Confirm that the audit trail records who uploaded what and when, with tamper-evident hashing.'
      ],
      expectedResult: 'All documents are ingested and stored with AES-256 encryption. PII fields are encrypted in metadata. Document classification accuracy exceeds 98%. Audit trail is complete and tamper-evident. No unencrypted PII exists in any intermediate storage.',
      severity: 'High',
      category: 'Document Ingestion',
    },
    {
      id: 'DI-007',
      title: 'Regulatory Reporting Data Feeds (RBI/SEBI/Fed)',
      description: 'Test the ingestion pipelines that consume regulatory reference data feeds such as RBI master directions, SEBI circular updates, Fed rate announcements, and FATCA/CRS reporting templates. These feeds arrive in XML, PDF, and structured CSV formats.',
      steps: [
        'Configure feed listeners for RBI (XML over SFTP), SEBI (REST API with JSON), and Fed (CSV via HTTPS download).',
        'Trigger an ingestion cycle and verify that all regulatory reference data is loaded into the compliance data mart.',
        'Validate XML schema compliance for RBI feeds against the published XSD definitions.',
        'Test handling of a feed that arrives 2 hours late (beyond the expected window) and verify alert generation.',
        'Confirm that historical regulatory data (past 7 years) is preserved and queryable for audit purposes.'
      ],
      expectedResult: 'All regulatory feeds are ingested with schema validation. Late feed arrivals trigger SLA-breach alerts. Historical data retention meets the 7-year regulatory requirement. XML schema validation catches any non-compliant feeds. Audit log records all ingestion events.',
      severity: 'Critical',
      category: 'Regulatory',
    },
    {
      id: 'DI-008',
      title: 'Cross-Border Payment Data Ingestion',
      description: 'Validate the ingestion of cross-border payment data from SWIFT gpi, correspondent banking networks, and forex dealing platforms. Data includes multi-currency amounts, UETR tracking IDs, intermediary bank chains, and compliance screening results.',
      steps: [
        'Ingest 500 cross-border payment messages with UETR (Unique End-to-End Transaction Reference) tracking enabled.',
        'Verify that the full intermediary bank chain (ordering, sending, receiving, beneficiary) is captured for each payment.',
        'Validate that multi-currency amounts are stored with both original currency and USD-equivalent using the applicable exchange rate.',
        'Test handling of SWIFT gpi status updates (ACSP, ACCC, RJCT) and verify they update the payment lifecycle state.',
        'Confirm that OFAC/sanctions screening results are ingested and linked to the corresponding payment record.'
      ],
      expectedResult: 'All cross-border payments are ingested with complete intermediary chains. UETR tracking is intact. Multi-currency conversion is accurate to 4 decimal places. gpi status updates are reflected in real-time. Sanctions screening results are correctly linked.',
      severity: 'Critical',
      category: 'Payments',
    },
    {
      id: 'DI-009',
      title: 'Card Network Settlement File Ingestion (Visa/Mastercard)',
      description: 'Test the ingestion of daily settlement files from Visa (TC33) and Mastercard (IPM) card networks. These files contain clearing and settlement data, chargebacks, representments, and fee assessments that must reconcile to the penny.',
      steps: [
        'Ingest a full day settlement file set: Visa TC33 (clearing), Mastercard IPM (clearing), and both networks fee assessment files.',
        'Parse and validate all transaction types: purchases, refunds, chargebacks (CB), representments, and fee line items.',
        'Reconcile total settlement amounts against the expected net settlement position published by each network.',
        'Test handling of a chargeback cycle: original transaction -> chargeback -> representment -> pre-arbitration.',
        'Verify that interchange fee calculations match the expected rate tables for each card program and MCC combination.'
      ],
      expectedResult: 'Settlement file parsing is 100% accurate. Net settlement position reconciles to zero variance. Chargeback lifecycle is fully tracked. Interchange fees match rate tables within 0.01% tolerance. All file processing completes within the T+1 settlement window.',
      severity: 'Critical',
      category: 'Settlement',
    },
    {
      id: 'DI-010',
      title: 'Mobile Banking Event Stream Ingestion',
      description: 'Verify ingestion of mobile banking application event streams including user session events, biometric authentication events, transaction initiation/completion events, and app crash/error telemetry for analytics and fraud detection.',
      steps: [
        'Generate 100,000 mobile events from a simulation tool covering: app_open, login_biometric, view_balance, initiate_transfer, confirm_transfer, app_crash.',
        'Verify that event ordering is preserved per user session using session_id and event_sequence_number.',
        'Validate that device fingerprint data (device_id, OS version, app version, IP, geolocation) is captured for each event.',
        'Test handling of out-of-order events (network delays) and verify the pipeline reorders or flags them appropriately.',
        'Confirm that sensitive data in events (account numbers, amounts) is masked/encrypted before landing in the analytics store.'
      ],
      expectedResult: 'All mobile events are ingested with correct session ordering. Device fingerprint data is complete. Out-of-order events are detected and flagged. Sensitive fields are encrypted in the analytics store. Event processing latency is under 3 seconds for 95th percentile.',
      severity: 'High',
      category: 'Event Streaming',
    },
  ],

  /* ─────────── TAB 2: DATA TRANSFORMATION TESTING ─────────── */
  transformation: [
    {
      id: 'DT-001',
      title: 'Currency Conversion Transformation (Multi-Currency)',
      description: 'Validate the transformation logic that converts transaction amounts from original currency to reporting currency (USD/INR/EUR) using the applicable exchange rate at transaction time. Must handle 160+ currencies, rate triangulation, and weekend/holiday rate carryover.',
      steps: [
        'Load a test dataset with transactions in 20 different currencies including exotic pairs (KES, BDT, LKR, NGN).',
        'Execute the currency conversion transformation using the exchange rate table effective on the transaction date.',
        'Verify conversion accuracy to 4 decimal places against a manually calculated control set of 100 transactions.',
        'Test rate triangulation logic for currency pairs without a direct rate (e.g., THB to BRL via USD cross-rate).',
        'Validate weekend/holiday rate carryover: a Saturday transaction must use the Friday closing rate.'
      ],
      expectedResult: 'All conversions are accurate to 4 decimal places. Cross-rate triangulation produces correct results. Weekend/holiday carryover uses the last available business day rate. No NULL or zero conversion rates in the output. Audit column records the rate source and effective date.',
      severity: 'Critical',
      category: 'Financial Calculation',
    },
    {
      id: 'DT-002',
      title: 'Account Balance Aggregation (Across Products)',
      description: 'Test the transformation that aggregates a customer total relationship value across all products: savings, current, fixed deposits, recurring deposits, loan outstanding, credit card balance, mutual fund holdings, and insurance policies.',
      steps: [
        'Prepare test data for 5 customers each holding 4-8 different product types with known balances.',
        'Execute the balance aggregation transformation that computes total_assets, total_liabilities, and net_worth per customer.',
        'Verify that fixed deposits include accrued interest up to the computation date.',
        'Validate that loan balances are treated as liabilities (negative contribution to net worth) including accrued interest.',
        'Test edge case: customer with zero-balance dormant accounts and recently closed accounts (should exclude closed).'
      ],
      expectedResult: 'Total relationship value matches manual calculation for all 5 test customers. Accrued interest is correctly included. Closed accounts are excluded. Dormant zero-balance accounts are included but contribute zero. Product-wise breakdown sums to the total.',
      severity: 'High',
      category: 'Aggregation',
    },
    {
      id: 'DT-003',
      title: 'Transaction Categorization (Credit/Debit/Transfer/Fee)',
      description: 'Validate the transformation that categorizes raw transactions into standardized types: credit, debit, internal_transfer, external_transfer, fee, interest_credit, interest_debit, reversal, and chargeback. Categorization rules are based on transaction codes, narration parsing, and counterparty identification.',
      steps: [
        'Load 1,000 raw transactions with diverse transaction codes covering all 9 category types.',
        'Execute the categorization transformation and compare output categories against the expected mapping.',
        'Test narration-based categorization: "NEFT-CR-ACME CORP-SALARY" should map to credit/salary category.',
        'Validate that internal transfers (same bank, different accounts of same customer) are correctly identified.',
        'Test ambiguous cases: a fee reversal should be categorized as "reversal" not "fee" and linked to the original fee transaction.'
      ],
      expectedResult: 'Categorization accuracy is 99%+ against the control set. Narration parsing correctly extracts counterparty and purpose. Internal transfers are identified with >98% accuracy. Fee reversals are linked to originals. No uncategorized transactions in the output.',
      severity: 'High',
      category: 'Classification',
    },
    {
      id: 'DT-004',
      title: 'Date Format Standardization (Global Branches)',
      description: 'Test the transformation that standardizes date and timestamp formats from global branches into a unified ISO 8601 UTC format. Branches across 15 countries use different local formats (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD), time zones, and calendar conventions.',
      steps: [
        'Prepare a dataset with dates from 15 branches in local formats: India (DD/MM/YYYY IST), US (MM/DD/YYYY EST/PST), UK (DD/MM/YYYY GMT/BST), Japan (YYYY/MM/DD JST), UAE (DD/MM/YYYY GST).',
        'Execute the date standardization transformation to convert all dates to ISO 8601 UTC format.',
        'Validate ambiguous dates: 03/04/2025 from US branch (March 4) vs UK branch (April 3) must resolve correctly based on branch locale.',
        'Test daylight saving time transitions: a transaction at 2:30 AM on DST changeover day must convert correctly.',
        'Verify leap year handling: February 29 transactions from all time zones.'
      ],
      expectedResult: 'All dates are converted to ISO 8601 UTC format. Ambiguous dates resolve correctly per branch locale. DST transitions are handled without 1-hour errors. Leap year dates are preserved. No NULL or invalid dates in the output.',
      severity: 'High',
      category: 'Data Standardization',
    },
    {
      id: 'DT-005',
      title: 'Customer 360 View Transformation',
      description: 'Validate the transformation that merges customer data from 7 source systems (core banking, cards, loans, wealth management, insurance, CRM, digital channels) into a unified Customer 360 view with conflict resolution rules for overlapping attributes.',
      steps: [
        'Prepare test records for 20 customers with data spread across all 7 source systems, including deliberate conflicts (different addresses, phone numbers).',
        'Execute the merge transformation with the defined source priority hierarchy: core_banking > CRM > digital_channel for contact info.',
        'Verify that the golden record for each customer has the correct winning value for each conflicting attribute.',
        'Test duplicate detection: two records with slightly different names ("JOHN SMITH" vs "JOHN K SMITH") but same PAN/SSN must merge.',
        'Validate that the merge audit trail records which source contributed each attribute value.'
      ],
      expectedResult: 'Customer 360 records are complete for all 20 test customers. Conflict resolution follows the priority hierarchy. Duplicate detection identifies and merges fuzzy matches. Audit trail is complete showing source attribution for every field. No orphan records.',
      severity: 'Critical',
      category: 'Data Integration',
    },
    {
      id: 'DT-006',
      title: 'Loan EMI Calculation Transformation',
      description: 'Test the transformation that computes Equated Monthly Installment (EMI) schedules for all active loans. Covers fixed-rate, floating-rate, step-up, and balloon payment structures. Must handle prepayment recalculations, moratorium periods, and interest rate resets.',
      steps: [
        'Create test loans: fixed-rate home loan (20yr, 8.5%), floating-rate personal loan (5yr, 12% with quarterly reset), step-up car loan, and a loan with 6-month moratorium.',
        'Execute the EMI calculation transformation and verify each EMI amount against the standard PMT formula.',
        'Simulate an interest rate reset (12% to 12.5%) on the floating-rate loan and verify the recalculated EMI from the reset date.',
        'Test a partial prepayment of 20% principal on the home loan and verify the reduced EMI or reduced tenure option.',
        'Validate the moratorium period: interest should accrue during moratorium and be capitalized at the end.'
      ],
      expectedResult: 'EMI calculations match the PMT formula within 0.01 tolerance. Floating rate reset produces correct new EMI. Prepayment correctly reduces EMI or tenure. Moratorium interest is capitalized accurately. Total interest over loan life matches expected value.',
      severity: 'Critical',
      category: 'Financial Calculation',
    },
    {
      id: 'DT-007',
      title: 'Interest Accrual Computation',
      description: 'Validate the daily interest accrual transformation for savings accounts, fixed deposits, and loan accounts. Must handle different day-count conventions (ACT/360, ACT/365, 30/360), tiered interest rates, and tax deduction at source (TDS) computation.',
      steps: [
        'Set up test accounts with known balances: savings (tiered rate: 3% up to 1L, 3.5% above), FD (6.5% ACT/365), and loan (9% ACT/360).',
        'Run the daily accrual for a 31-day month and verify the accrued interest for each account.',
        'Test tiered rate calculation: a savings account with 2,50,000 balance should earn 3% on 1,00,000 and 3.5% on 1,50,000.',
        'Validate day-count convention: ACT/360 accrual for 31 days should use 31/360, not 31/365.',
        'Verify TDS computation: 10% TDS on FD interest exceeding 40,000 annual threshold.'
      ],
      expectedResult: 'Daily accrual amounts match manual calculations to 2 decimal places. Tiered rates are applied correctly at each slab boundary. Day-count conventions produce correct denominators. TDS is computed only when the annual threshold is breached. Month-end accrual totals reconcile.',
      severity: 'Critical',
      category: 'Financial Calculation',
    },
    {
      id: 'DT-008',
      title: 'Risk Score Normalization',
      description: 'Test the transformation that normalizes risk scores from multiple scoring models (credit score, behavior score, fraud score, AML risk rating) into a unified 0-1000 risk scale for the bank internal risk dashboard.',
      steps: [
        'Prepare test data with raw scores: credit bureau score (300-900), internal behavior score (0-100), fraud probability (0.0-1.0), AML risk (Low/Medium/High/Critical).',
        'Execute the normalization transformation using the defined mapping functions for each score type.',
        'Verify that the normalized composite score correctly weights: credit (40%), behavior (25%), fraud (20%), AML (15%).',
        'Test boundary conditions: minimum possible raw scores should map to 0, maximum to 1000.',
        'Validate that missing scores (e.g., new customer with no behavior score) use the configured default value, not NULL.'
      ],
      expectedResult: 'Normalized scores fall within the 0-1000 range. Weighted composite score matches manual calculation. Boundary conditions map correctly. Missing scores use defaults (not NULL). Score distribution maintains the relative ordering of the original scores.',
      severity: 'High',
      category: 'Score Normalization',
    },
    {
      id: 'DT-009',
      title: 'Regulatory Report Format Transformation (XBRL/XML)',
      description: 'Validate the transformation that converts internal data mart tables into regulatory submission formats: XBRL for Basel III reports, XML for CCAR/DFAST stress testing, and fixed-width text for legacy RBI returns.',
      steps: [
        'Extract data from the regulatory data mart for: Capital Adequacy (Basel III), Liquidity Coverage Ratio (LCR), and Net Stable Funding Ratio (NSFR).',
        'Execute the XBRL transformation and validate the output against the published XBRL taxonomy (version 2.1).',
        'Generate the CCAR XML submission and validate against the Fed published XSD schema.',
        'Produce the RBI fixed-width return file and verify field positions, padding, and checksums against the RBI format specification.',
        'Test with edge case data: negative values, zero balances, and very large numbers (>10 billion) to verify formatting.'
      ],
      expectedResult: 'XBRL output validates against the taxonomy without errors. XML validates against XSD schema. Fixed-width file passes field position and checksum validation. Edge case values (negatives, zeros, large numbers) are formatted correctly. Submission-ready files are produced.',
      severity: 'Critical',
      category: 'Regulatory',
    },
    {
      id: 'DT-010',
      title: 'PII Masking/Tokenization Transformation',
      description: 'Test the transformation pipeline that masks or tokenizes Personally Identifiable Information (PII) before data is moved to non-production environments, analytics sandboxes, or shared with third parties. Covers format-preserving encryption, consistent tokenization, and referential integrity.',
      steps: [
        'Identify PII fields across all tables: customer_name, SSN/Aadhaar, PAN, phone, email, address, date_of_birth, account_number.',
        'Execute the masking transformation using format-preserving encryption (FPE) for account numbers and tokenization for SSN/Aadhaar.',
        'Verify that masked account numbers retain the same format (e.g., 16 digits) and pass Luhn check if applicable.',
        'Test referential integrity: the same SSN appearing in 5 different tables must tokenize to the same token value consistently.',
        'Validate that the masked dataset can still support valid analytical queries (e.g., transaction counts by masked customer still aggregate correctly).'
      ],
      expectedResult: 'All PII fields are masked/tokenized. Format-preserving encryption maintains field format and length. Consistent tokenization preserves referential integrity across tables. Analytical queries on masked data produce correct aggregate results. No reversible PII leakage in the output.',
      severity: 'Critical',
      category: 'Data Privacy',
    },
  ],

  /* ─────────── TAB 3: DATA GOVERNANCE TESTING ─────────── */
  governance: [
    {
      id: 'DG-001',
      title: 'Data Lineage Tracking (Transaction Source to Report)',
      description: 'Validate that complete data lineage is captured from the point a transaction enters the system through every transformation, aggregation, and join until it appears in a regulatory or management report. Lineage must be queryable and visualizable.',
      steps: [
        'Select 10 sample transactions and trace their lineage from core banking source to the final regulatory report.',
        'Verify that every ETL/ELT step (extract, transform, load, aggregate) is recorded in the lineage metadata store.',
        'Check that column-level lineage is captured: report field "Total_NPA" traces back to specific source columns and transformation rules.',
        'Test that lineage is preserved through complex transformations: joins, unions, pivots, and window functions.',
        'Validate the lineage visualization tool correctly renders the end-to-end flow graph.'
      ],
      expectedResult: 'Complete lineage from source to report is captured for all 10 transactions. Column-level lineage is accurate. Complex transformations maintain lineage continuity. Lineage graph renders correctly showing all intermediate steps. No broken lineage links.',
      severity: 'Critical',
      category: 'Data Lineage',
    },
    {
      id: 'DG-002',
      title: 'Data Quality Rule Validation (Completeness & Accuracy)',
      description: 'Test the data quality framework that enforces completeness, accuracy, consistency, timeliness, and uniqueness rules on banking data. Rules include: mandatory field checks, cross-field validation, referential integrity, and business rule compliance.',
      steps: [
        'Configure 50 data quality rules across customer, account, and transaction tables covering all 5 DQ dimensions.',
        'Execute the DQ validation engine against a test dataset containing 20 deliberate quality violations.',
        'Verify that all 20 violations are detected and correctly classified (completeness, accuracy, consistency, etc.).',
        'Test threshold-based alerting: DQ score dropping below 95% should trigger a critical alert to the data steward.',
        'Validate the DQ scorecard report showing pass/fail rates per rule, table, and dimension.'
      ],
      expectedResult: 'All 20 deliberate violations are detected with correct classification. DQ scoring is accurate. Threshold alerts fire when configured. DQ scorecard shows correct pass/fail rates. No false positives on clean data. Historical DQ trend is trackable.',
      severity: 'Critical',
      category: 'Data Quality',
    },
    {
      id: 'DG-003',
      title: 'Master Data Management (Customer Golden Record)',
      description: 'Validate the MDM process that creates and maintains a customer golden record by matching, merging, and surviving attributes from multiple source systems. Must handle probabilistic matching, manual review workflows, and merge/unmerge operations.',
      steps: [
        'Load 500 customer records from 4 source systems with 50 known duplicates (same person, different records).',
        'Execute the matching algorithm using configured match rules: exact match on PAN/SSN, probabilistic match on name + DOB + address.',
        'Verify that 48+ of the 50 duplicates are identified (96%+ match rate) with confidence scores.',
        'Test the survivorship rules: which source wins for name (core banking), which for phone (CRM), which for email (digital).',
        'Validate the manual review queue: low-confidence matches (score 60-80%) are routed for human review.'
      ],
      expectedResult: 'Match rate is 96%+ for known duplicates. Golden record survivorship follows defined rules. Manual review queue contains only low-confidence matches. Merge operation creates a single golden record with full audit trail. Unmerge operation restores original records.',
      severity: 'High',
      category: 'Master Data',
    },
    {
      id: 'DG-004',
      title: 'Data Classification (PII, Sensitive, Public)',
      description: 'Test the automated data classification engine that scans all data assets and classifies columns into sensitivity tiers: PII (Tier 1), Sensitive Financial (Tier 2), Internal (Tier 3), and Public (Tier 4). Classification drives downstream access controls and masking policies.',
      steps: [
        'Run the classification scanner against 100 tables spanning customer, account, transaction, and reference data domains.',
        'Verify that known PII columns (SSN, Aadhaar, PAN, name, DOB, phone, email, address) are classified as Tier 1.',
        'Validate that financial columns (account_balance, transaction_amount, credit_limit) are classified as Tier 2.',
        'Test that the scanner detects PII in free-text fields (e.g., transaction narration containing customer names).',
        'Confirm that classification metadata is propagated to the data catalog and triggers appropriate access policies.'
      ],
      expectedResult: 'Classification accuracy is 95%+ across all tables. PII columns are correctly identified as Tier 1. Financial columns are Tier 2. Free-text PII detection works for structured patterns (phone, email). Data catalog reflects classification. Access policies are auto-applied.',
      severity: 'High',
      category: 'Data Classification',
    },
    {
      id: 'DG-005',
      title: 'Data Retention Policy Enforcement (7-Year Banking Rule)',
      description: 'Validate that the data retention framework correctly enforces regulatory retention periods (7 years for transaction data, 10 years for KYC, 5 years for audit logs) and that expired data is purged or archived according to policy without affecting active records.',
      steps: [
        'Configure retention policies: transactions (7 years), KYC documents (10 years), audit logs (5 years), session logs (1 year).',
        'Insert test data with dates spanning: current year, 5 years ago, 7 years ago, 8 years ago, and 11 years ago.',
        'Execute the retention enforcement job and verify that only data exceeding its retention period is archived/purged.',
        'Validate that archived data is moved to cold storage (Glacier/Archive tier) and remains queryable for legal holds.',
        'Test legal hold override: data under litigation hold must NOT be purged even if past retention period.'
      ],
      expectedResult: 'Expired data is correctly identified and archived/purged per policy. Active data within retention period is untouched. Archived data is accessible from cold storage. Legal hold prevents purging of held records. Retention job logs all actions with before/after counts.',
      severity: 'Critical',
      category: 'Data Retention',
    },
    {
      id: 'DG-006',
      title: 'Data Access Audit Trail',
      description: 'Test that every data access event (read, write, export, query) is captured in an immutable audit trail with user identity, timestamp, data asset accessed, action type, and the specific records/columns viewed or modified.',
      steps: [
        'Perform a series of data access operations: SELECT queries, UPDATE statements, data exports, and report downloads across 5 user roles.',
        'Verify that each access event is recorded in the audit log within 5 seconds of occurrence.',
        'Validate audit log completeness: user_id, timestamp, action_type, table_name, column_list, row_count, query_text, source_ip.',
        'Test audit log immutability: attempt to modify or delete audit records and verify the operation is blocked.',
        'Generate an audit report for a specific user showing all data accesses in the last 30 days.'
      ],
      expectedResult: 'All data access events are captured within 5 seconds. Audit logs are complete with all required fields. Immutability is enforced (modification attempts are rejected). User-specific audit reports are accurate. Audit trail supports forensic investigation queries.',
      severity: 'Critical',
      category: 'Audit & Compliance',
    },
    {
      id: 'DG-007',
      title: 'Cross-Border Data Residency Compliance',
      description: 'Validate that data residency rules are enforced: Indian customer PII must reside in India-region data centers, EU customer data must comply with GDPR data localization, and US customer data must not be transferred to restricted jurisdictions.',
      steps: [
        'Configure data residency rules: India PII stays in ap-south-1, EU PII stays in eu-west-1, US PII in us-east-1.',
        'Attempt to replicate Indian customer PII to the EU region and verify the operation is blocked by the residency policy engine.',
        'Test that aggregated/anonymized data (not PII) can be replicated cross-region for analytics purposes.',
        'Validate that cross-border data transfer requests trigger a compliance approval workflow before execution.',
        'Verify that the data residency dashboard correctly shows the geographic distribution of all PII data assets.'
      ],
      expectedResult: 'PII replication to non-compliant regions is blocked. Anonymized data transfers are allowed. Compliance approval workflow is triggered for cross-border requests. Residency dashboard accurately reflects data locations. No PII data leaks to restricted regions.',
      severity: 'Critical',
      category: 'Data Residency',
    },
    {
      id: 'DG-008',
      title: 'Data Catalog Metadata Accuracy',
      description: 'Test the enterprise data catalog to ensure metadata (table descriptions, column definitions, data types, owners, refresh frequency, data quality scores, lineage links) is accurate, complete, and automatically updated when schema changes occur.',
      steps: [
        'Audit the data catalog for 50 critical banking tables and verify metadata completeness against a checklist.',
        'Introduce a schema change (add column, rename column, change data type) and verify the catalog auto-updates within the configured sync interval.',
        'Validate that business glossary terms are correctly linked to technical column names (e.g., "NPA" maps to non_performing_asset_flag).',
        'Test search functionality: searching for "customer balance" should surface relevant tables and columns.',
        'Verify that data ownership and stewardship assignments are current and match the organizational structure.'
      ],
      expectedResult: 'Metadata is 95%+ complete for all 50 tables. Schema changes auto-sync within 1 hour. Business glossary linkages are accurate. Search returns relevant results within the top 5. Ownership assignments match the current org chart.',
      severity: 'High',
      category: 'Data Catalog',
    },
    {
      id: 'DG-009',
      title: 'Data Stewardship Workflow',
      description: 'Validate the data stewardship workflow that manages data quality issue resolution: issue detection, steward assignment, root cause analysis, remediation, and closure. Workflow must integrate with the DQ engine, ticketing system, and escalation policies.',
      steps: [
        'Trigger 10 data quality issues across different domains: missing customer phone (completeness), duplicate account (uniqueness), invalid branch code (referential integrity).',
        'Verify that each issue is auto-assigned to the correct domain data steward based on the data ownership matrix.',
        'Test the escalation policy: unresolved issues older than 5 business days escalate to the data governance lead.',
        'Validate that the steward can mark an issue as remediated and the DQ engine re-validates the fix.',
        'Check that SLA metrics (time-to-detect, time-to-assign, time-to-resolve) are correctly calculated and reported.'
      ],
      expectedResult: 'All 10 issues are auto-assigned to correct stewards. Escalation triggers after 5 days. Remediation workflow includes re-validation. SLA metrics are accurate. Closed issues are archived with full resolution history.',
      severity: 'Medium',
      category: 'Data Stewardship',
    },
    {
      id: 'DG-010',
      title: 'Regulatory Data Standards Compliance (BCBS 239)',
      description: 'Test compliance with BCBS 239 (Basel Committee on Banking Supervision) principles for effective risk data aggregation and risk reporting. Covers accuracy, completeness, timeliness, and adaptability of risk data.',
      steps: [
        'Map the 14 BCBS 239 principles to specific data governance controls implemented in the system.',
        'Validate Principle 3 (Accuracy and Integrity): risk data aggregation produces results that match source system totals within acceptable tolerance.',
        'Test Principle 5 (Timeliness): risk reports are generated within the T+1 reporting deadline.',
        'Verify Principle 6 (Adaptability): the system can produce ad-hoc risk reports for new stress scenarios within 48 hours.',
        'Generate a BCBS 239 compliance scorecard showing the maturity level (1-4) for each of the 14 principles.'
      ],
      expectedResult: 'All 14 principles are mapped to controls. Risk data accuracy is within tolerance. Reports meet T+1 deadline. Ad-hoc report capability is demonstrated. Compliance scorecard shows maturity level 3+ for all critical principles.',
      severity: 'Critical',
      category: 'Regulatory',
    },
  ],

  /* ─────────── TAB 4: DATA QUERY/EXTRACTION TESTING ─────────── */
  query: [
    {
      id: 'DQ-001',
      title: 'High-Volume Transaction Query Performance',
      description: 'Test the performance of analytical queries against the transaction fact table containing 500 million+ records. Queries must return results within defined SLAs even under concurrent multi-user load from the BI tool.',
      steps: [
        'Load the transaction fact table with 500 million records spanning 3 years with realistic data distribution.',
        'Execute 5 representative query patterns: daily summary, monthly trend, YTD aggregation, top-N customers, and percentile calculation.',
        'Measure query response time for each pattern and compare against SLA: simple aggregations < 5s, complex analytics < 30s.',
        'Run the same queries with 20 concurrent users and measure degradation.',
        'Verify that query execution plans use partition pruning and index scans (not full table scans).'
      ],
      expectedResult: 'Single-user queries meet SLA thresholds. Concurrent load causes < 50% degradation. Execution plans show partition pruning for date-based queries. No full table scans. Memory usage stays within allocated limits.',
      severity: 'Critical',
      category: 'Performance',
    },
    {
      id: 'DQ-002',
      title: 'Complex Join Queries (Customer + Accounts + Transactions)',
      description: 'Validate the correctness and performance of multi-table join queries that combine customer demographics, account details, and transaction history. These queries power the customer 360 dashboard and relationship manager screens.',
      steps: [
        'Write a 5-table join query: customer -> accounts -> transactions -> branches -> products with appropriate join conditions.',
        'Execute the query for a single customer and verify that all related accounts and transactions are returned with no missing or extra rows.',
        'Test with a customer having 10 accounts and 50,000 transactions to verify performance remains under 10 seconds.',
        'Validate that LEFT JOIN correctly handles customers with no transactions in a specific product (returns customer row with NULL transaction fields).',
        'Test the query with account closure scenarios: closed accounts should appear with status but not inflate transaction counts.'
      ],
      expectedResult: 'Join results are 100% correct with no Cartesian product issues. Single customer query returns in < 10 seconds. LEFT JOIN handles missing data correctly. Closed account transactions are included with proper status filtering. No duplicate rows from many-to-many relationships.',
      severity: 'High',
      category: 'Query Correctness',
    },
    {
      id: 'DQ-003',
      title: 'Date-Range Partition Pruning for Statements',
      description: 'Test that account statement queries leverage date-based partitioning to scan only the relevant partitions. A 6-month statement query on a 10-year partitioned table should scan only 6 monthly partitions, not the entire table.',
      steps: [
        'Verify the transaction table is partitioned by month (RANGE partition on transaction_date).',
        'Execute a statement query for January 2025 to June 2025 and capture the execution plan.',
        'Confirm the plan shows only 6 partitions scanned out of the total 120 (10 years x 12 months).',
        'Test edge cases: statement spanning month boundary (Jan 28 to Feb 5), year boundary (Dec 15 to Jan 15).',
        'Benchmark performance: 6-month query on partitioned table vs equivalent non-partitioned table.'
      ],
      expectedResult: 'Execution plan confirms only 6 partitions are scanned. Month-boundary and year-boundary queries correctly include adjacent partitions. Partitioned query is 10x+ faster than non-partitioned equivalent. Partition pruning works with both equality and range predicates.',
      severity: 'High',
      category: 'Performance',
    },
    {
      id: 'DQ-004',
      title: 'Suspicious Transaction Pattern Query (AML)',
      description: 'Validate the AML (Anti-Money Laundering) pattern detection queries that identify structuring (smurfing), rapid movement, round-trip transactions, and unusual geographic patterns. These queries feed the transaction monitoring system.',
      steps: [
        'Inject known suspicious patterns: 5 deposits just below the 10,000 USD reporting threshold within 24 hours (structuring).',
        'Add rapid movement pattern: funds deposited and withdrawn within 30 minutes across 3 accounts.',
        'Create a round-trip pattern: A sends to B, B sends to C, C sends back to A within 48 hours.',
        'Execute the AML pattern detection queries and verify all 3 patterns are flagged.',
        'Test false positive handling: legitimate payroll deposits of 9,500 from the same employer should not be flagged as structuring.'
      ],
      expectedResult: 'All 3 suspicious patterns are detected with correct pattern type classification. Structuring detection identifies the threshold-avoidance behavior. Rapid movement is flagged with time-window analysis. Round-trip is detected with graph traversal. Legitimate payroll is not flagged (false positive rate < 5%).',
      severity: 'Critical',
      category: 'AML/Compliance',
    },
    {
      id: 'DQ-005',
      title: 'Customer Segmentation Query',
      description: 'Test the customer segmentation query that classifies customers into value tiers (Platinum, Gold, Silver, Mass) based on relationship value, transaction frequency, product holding breadth, and tenure. Segmentation drives marketing campaigns and service differentiation.',
      steps: [
        'Define segmentation rules: Platinum (>50L AUM, >5 products, >10yr tenure), Gold (>10L, >3 products, >5yr), Silver (>1L, >2 products), Mass (rest).',
        'Execute the segmentation query against 100,000 customer records and verify tier distribution matches expected percentages.',
        'Validate boundary cases: customer with exactly 50L AUM should be Platinum, customer with 49.99L should be Gold.',
        'Test segment migration: compare current quarter segmentation with previous quarter to identify upgrades/downgrades.',
        'Verify that the segment query correctly handles NULLs: customer with unknown AUM should default to Mass, not NULL segment.'
      ],
      expectedResult: 'Segmentation distribution matches expected: Platinum (~2%), Gold (~8%), Silver (~25%), Mass (~65%). Boundary cases resolve correctly. Segment migration report shows correct upgrades and downgrades. NULL handling defaults to Mass tier. Query completes in < 30 seconds for 100K customers.',
      severity: 'Medium',
      category: 'Analytics',
    },
    {
      id: 'DQ-006',
      title: 'Loan Portfolio Extraction',
      description: 'Validate the loan portfolio extraction query that pulls comprehensive loan data for risk assessment: outstanding principal, accrued interest, collateral value, LTV ratio, days past due (DPD), NPA classification, and provisioning amounts.',
      steps: [
        'Extract the complete loan portfolio (100,000 loans) with all risk attributes and verify completeness.',
        'Validate DPD calculation: a loan with last payment on Jan 15 and extraction date of Mar 20 should show DPD = 65.',
        'Verify NPA classification: DPD > 90 should be NPA, 60-90 should be SMA-2, 30-60 should be SMA-1.',
        'Test LTV ratio calculation: loan_outstanding / collateral_market_value with collateral values refreshed quarterly.',
        'Validate provisioning amounts against RBI guidelines: 15% for substandard, 25% for doubtful, 100% for loss.'
      ],
      expectedResult: 'Portfolio extraction is complete with no missing loans. DPD calculation is accurate. NPA classification follows RBI norms. LTV ratios use current collateral values. Provisioning amounts match regulatory guidelines. Total provisioning reconciles to the general ledger.',
      severity: 'Critical',
      category: 'Risk Analytics',
    },
    {
      id: 'DQ-007',
      title: 'Regulatory Report Data Extraction',
      description: 'Test the data extraction queries that feed regulatory reports: Basel III capital adequacy, Liquidity Coverage Ratio (LCR), Large Exposure (LE) reporting, and Fraud Monitoring Return (FMR). Each extraction must be reproducible and auditable.',
      steps: [
        'Execute the Basel III capital adequacy extraction and verify Risk-Weighted Assets (RWA) calculation for credit, market, and operational risk.',
        'Run the LCR extraction and validate High-Quality Liquid Assets (HQLA) categorization (Level 1, 2A, 2B).',
        'Test the Large Exposure extraction: identify all exposures exceeding 10% of Tier 1 capital to a single counterparty.',
        'Verify extraction reproducibility: running the same extraction twice for the same reporting date produces identical results.',
        'Validate the extraction audit log: who ran it, when, parameters used, record counts, and checksum.'
      ],
      expectedResult: 'RWA calculations match validated manual computations. HQLA categorization is correct per Basel III definitions. Large Exposures are identified with correct Tier 1 capital percentage. Extractions are reproducible (byte-identical). Audit logs are complete.',
      severity: 'Critical',
      category: 'Regulatory',
    },
    {
      id: 'DQ-008',
      title: 'Real-Time Balance Inquiry Query',
      description: 'Test the real-time balance inquiry that returns the current available balance factoring in: ledger balance, pending debits (checks, scheduled transfers), holds (card authorizations), and float (uncleared deposits). Response time SLA is 200ms.',
      steps: [
        'Set up a test account with ledger balance of 100,000 plus known pending transactions: 3 pending debits (-5,000 each), 2 card holds (-2,000 each), 1 uncleared deposit (+10,000).',
        'Execute the real-time balance inquiry and verify: ledger_balance = 100,000, available_balance = 100,000 - 15,000 - 4,000 = 81,000.',
        'Measure response time under load: 1,000 concurrent balance inquiries should all return within 200ms.',
        'Test with an account that has a sweep arrangement: available balance should reflect the sweep limit.',
        'Validate that expired holds (older than 7 days) are automatically released and increase available balance.'
      ],
      expectedResult: 'Available balance calculation is correct accounting for all pending items. Response time is under 200ms at 95th percentile under concurrent load. Sweep limits are correctly applied. Expired holds are released. Balance components (ledger, available, hold, float) are individually reported.',
      severity: 'Critical',
      category: 'Real-Time Query',
    },
    {
      id: 'DQ-009',
      title: 'Historical Data Archive Query',
      description: 'Test the ability to query historical archived data that has been moved to cold storage (tape/Glacier) for regulatory compliance. Archived data must be retrievable within the committed SLA (24 hours for cold, 4 hours for warm archive).',
      steps: [
        'Request retrieval of transaction data from 6 years ago (within 7-year retention but in cold archive).',
        'Verify that the retrieval request is logged and an estimated completion time is returned.',
        'Once data is restored to warm storage, execute analytical queries and verify data completeness against archived checksums.',
        'Test query federation: a query spanning both active (hot) and archived (warm) data should return unified results.',
        'Validate that restored archive data is automatically re-archived after the configured access window (7 days).'
      ],
      expectedResult: 'Archive retrieval completes within SLA. Data checksums match confirming no corruption. Federated queries return unified results seamlessly. Re-archival happens automatically after the access window. Retrieval audit trail is complete.',
      severity: 'Medium',
      category: 'Archive & Retrieval',
    },
    {
      id: 'DQ-010',
      title: 'Cross-Database Federated Query',
      description: 'Validate federated queries that span multiple database engines: core banking (Oracle), data warehouse (Teradata/Snowflake), NoSQL store (MongoDB for documents), and real-time cache (Redis). The query optimizer must push predicates to each engine for optimal performance.',
      steps: [
        'Write a federated query that joins Oracle customer data with Snowflake transaction aggregates and MongoDB KYC documents.',
        'Verify that the query optimizer pushes date-range filters down to Snowflake and customer_id filter to Oracle (predicate pushdown).',
        'Measure query performance and compare with a materialized view approach (pre-joined snapshot).',
        'Test with a Redis-accelerated lookup: hot customer balances from Redis, historical from Snowflake.',
        'Validate data consistency: federated query result matches the result of querying each source individually and joining locally.'
      ],
      expectedResult: 'Federated query returns correct results spanning all 3 data stores. Predicate pushdown is confirmed in the execution plan. Performance is within 2x of the materialized view approach. Redis cache hit reduces latency for hot data. Data consistency is verified.',
      severity: 'High',
      category: 'Federation',
    },
  ],

  /* ─────────── TAB 5: DATA MODELING TESTING ─────────── */
  modeling: [
    {
      id: 'DM-001',
      title: 'Star Schema for Transaction Fact Table',
      description: 'Validate the star schema design for the transaction fact table. The fact table should contain degenerate dimensions (transaction_id), foreign keys to all dimension tables, and additive measures (amount, fee, tax). Grain must be one row per transaction.',
      steps: [
        'Verify the fact table grain: each row represents exactly one atomic transaction with a unique transaction_id.',
        'Validate all foreign key relationships to dimension tables: dim_customer, dim_account, dim_branch, dim_product, dim_date, dim_currency.',
        'Test that all measures are correctly typed: amount (DECIMAL(18,4)), fee (DECIMAL(12,4)), tax (DECIMAL(12,4)).',
        'Verify additive measure behavior: SUM(amount) across any dimension slice produces correct aggregations.',
        'Test semi-additive measure: account_balance is additive across all dimensions except time (use latest snapshot).'
      ],
      expectedResult: 'Fact table grain is correct (one row per transaction). All FK relationships are valid with referential integrity enforced. Measures aggregate correctly across all dimension combinations. Semi-additive measures handle time dimension correctly. No orphan FK records.',
      severity: 'Critical',
      category: 'Dimensional Modeling',
    },
    {
      id: 'DM-002',
      title: 'Customer Dimension SCD Type 2 Handling',
      description: 'Test Slowly Changing Dimension Type 2 implementation for the customer dimension. When customer attributes change (address, phone, segment), a new row is inserted with effective dates while preserving historical records for point-in-time reporting.',
      steps: [
        'Insert a customer record with initial attributes: name, address (City A), segment (Gold), effective_from = 2024-01-01, effective_to = 9999-12-31, is_current = true.',
        'Simulate an address change to City B on 2025-06-15. Verify old row is expired (effective_to = 2025-06-14, is_current = false) and new row is created.',
        'Execute a point-in-time query for 2024-07-01 and verify it returns the original City A address.',
        'Execute a current-state query and verify it returns City B.',
        'Test multiple changes: 3 address changes in rapid succession should create 3 historical rows plus 1 current row.'
      ],
      expectedResult: 'SCD Type 2 creates new rows on attribute changes with correct effective dates. Point-in-time queries return historically accurate data. Current-state queries return only the active row (is_current = true). No gaps or overlaps in effective date ranges. Surrogate keys are sequential.',
      severity: 'Critical',
      category: 'Dimensional Modeling',
    },
    {
      id: 'DM-003',
      title: 'Account Hierarchy Modeling',
      description: 'Validate the account hierarchy model that supports multi-level parent-child relationships: customer -> relationship -> product_group -> account -> sub_account. Hierarchical queries must efficiently traverse the tree for aggregation and drill-down.',
      steps: [
        'Create a 4-level hierarchy: Customer (CIF) -> Relationship (Family/Business) -> Product Group (Deposits/Loans/Cards) -> Individual Accounts.',
        'Test bottom-up aggregation: sum of all individual account balances should equal the relationship-level total.',
        'Test top-down drill-down: from customer level to individual accounts with correct intermediate subtotals.',
        'Validate recursive/hierarchical query performance (CTE or CONNECT BY) for a customer with 50 accounts across 5 product groups.',
        'Test orphan detection: accounts not linked to any relationship or customer should be flagged.'
      ],
      expectedResult: 'Hierarchy is correctly modeled with parent-child FK relationships. Bottom-up aggregation is accurate at every level. Drill-down navigation works with correct subtotals. Recursive queries complete in < 2 seconds. Orphan accounts are detected and reported.',
      severity: 'High',
      category: 'Hierarchy Modeling',
    },
    {
      id: 'DM-004',
      title: 'Product Catalog Dimension',
      description: 'Test the product catalog dimension that models the bank product portfolio: deposits (savings, current, FD, RD), loans (home, personal, auto, business), cards (credit, debit, prepaid), and investment products (MF, insurance, NPS). Each product has attributes, terms, and rate structures.',
      steps: [
        'Populate the product dimension with 50 product variants across 4 categories with all attributes (product_code, name, category, sub_category, interest_rate, tenure, features).',
        'Verify that the product hierarchy (category -> sub_category -> product) supports drill-down analytics.',
        'Test product attribute versioning: when interest rate changes, the new rate applies from effective_date without losing history.',
        'Validate that product-level aggregation in the transaction fact table correctly groups by product category.',
        'Test the relationship between product dimension and pricing/rate tables through bridge table or multi-valued dimension.'
      ],
      expectedResult: 'All 50 products are correctly modeled with complete attributes. Product hierarchy supports drill-down. Rate versioning preserves history. Product-level aggregations in fact queries are correct. Bridge table relationship to rate schedules is functioning.',
      severity: 'Medium',
      category: 'Dimensional Modeling',
    },
    {
      id: 'DM-005',
      title: 'Time Dimension with Banking Calendar',
      description: 'Validate the time/date dimension that includes banking-specific calendar attributes: business day flag (excluding weekends and bank holidays per country), RBI reporting periods, fiscal quarters, settlement dates, and value dates.',
      steps: [
        'Generate the time dimension for 2020-2030 with daily grain and verify completeness (3,652 rows for 10 years).',
        'Validate business day flags for India (exclude Saturdays 2nd/4th, Sundays, RBI holidays), US (exclude weekends, Fed holidays), UK (exclude weekends, bank holidays).',
        'Test banking calendar functions: next_business_day(2025-12-25) should return 2025-12-26 for US but 2025-12-29 for UK (Boxing Day).',
        'Verify fiscal quarter mapping: Indian fiscal year starts April 1 (Q1=Apr-Jun), US fiscal Oct 1 (Q1=Oct-Dec).',
        'Validate settlement date calculations: T+1 for equities, T+2 for forex, T+0 for same-day value transfers.'
      ],
      expectedResult: 'Time dimension has 100% date coverage. Business day flags are correct per country. Calendar functions return correct next business day. Fiscal quarters map correctly for India and US calendars. Settlement date offsets account for non-business days.',
      severity: 'High',
      category: 'Calendar Modeling',
    },
    {
      id: 'DM-006',
      title: 'Currency Exchange Rate Bridge Table',
      description: 'Test the currency exchange rate bridge table that stores daily exchange rates for all currency pairs the bank trades. Must support direct rates, cross rates (triangulated via USD), and historical rate lookups for any past date.',
      steps: [
        'Load daily exchange rates for 50 currency pairs for 1 year (18,250 records = 50 pairs x 365 days).',
        'Verify that direct rate lookup for USD/INR on a specific date returns the correct bid, ask, and mid rates.',
        'Test cross-rate derivation: EUR/JPY rate calculated as (EUR/USD) x (USD/JPY) matches the direct EUR/JPY rate within 0.1% tolerance.',
        'Validate weekend rate handling: querying the rate for a Saturday should return the Friday closing rate.',
        'Test multi-hop conversion: convert 1000 THB to BRL via THB->USD->BRL and verify accuracy.'
      ],
      expectedResult: 'Direct rate lookups are accurate to 6 decimal places. Cross-rate derivation matches direct rates within tolerance. Weekend/holiday rates fall back to last business day. Multi-hop conversions produce correct results. No missing rates for any date-currency combination.',
      severity: 'High',
      category: 'Bridge Table',
    },
    {
      id: 'DM-007',
      title: 'Loan Lifecycle State Modeling',
      description: 'Validate the data model that captures the complete loan lifecycle: application -> approval -> disbursement -> repayment -> closure/NPA/write-off. Each state transition must be tracked with timestamps, actors, and reasons for audit and regulatory reporting.',
      steps: [
        'Model the loan state machine with all valid transitions: Applied->Approved, Applied->Rejected, Approved->Disbursed, Disbursed->Current, Current->Overdue, Overdue->NPA, NPA->WriteOff, Current->Closed, etc.',
        'Insert a test loan and walk it through the complete lifecycle: application to closure with all intermediate states.',
        'Verify that invalid state transitions are rejected (e.g., Applied -> NPA directly without intermediate states).',
        'Test the state history table: query the full lifecycle timeline of a loan with state, timestamp, and actor at each transition.',
        'Validate reporting queries: count of loans by current state, average time in each state, state transition velocity.'
      ],
      expectedResult: 'All valid state transitions are modeled and functional. Invalid transitions are rejected with clear error messages. State history preserves the complete audit trail. Reporting queries on state distribution and duration are accurate. State machine covers all edge cases (restructuring, moratorium).',
      severity: 'Critical',
      category: 'State Modeling',
    },
    {
      id: 'DM-008',
      title: 'Risk Factor Modeling',
      description: 'Test the data model for risk factors used in credit risk, market risk, and operational risk calculations. Includes Probability of Default (PD), Loss Given Default (LGD), Exposure at Default (EAD), Value at Risk (VaR), and Key Risk Indicators (KRI).',
      steps: [
        'Model the risk factor dimension with: factor_id, factor_name, risk_category (credit/market/operational), calculation_method, data_source, refresh_frequency.',
        'Populate PD model factors for 5 customer segments with Through-The-Cycle (TTC) and Point-In-Time (PIT) estimates.',
        'Validate that the LGD model correctly captures: secured vs unsecured, collateral type, recovery rate assumptions.',
        'Test the VaR factor table with 3 calculation methods: Historical Simulation, Monte Carlo, and Parametric (Variance-Covariance).',
        'Verify that risk factor versioning allows comparison between current model and previous model outputs.'
      ],
      expectedResult: 'Risk factor dimension captures all required attributes. PD/LGD/EAD factors are correctly segmented. VaR calculations using stored factors match validated model outputs. Factor versioning supports model comparison. Refresh schedules are enforced.',
      severity: 'High',
      category: 'Risk Modeling',
    },
    {
      id: 'DM-009',
      title: 'Branch/Geography Hierarchy Dimension',
      description: 'Validate the branch and geography dimension that models the bank organizational hierarchy: country -> zone -> region -> cluster -> branch -> department. Must support analytics at every level and handle branch closures, mergers, and re-organizations.',
      steps: [
        'Build the geography hierarchy: 3 countries -> 6 zones -> 18 regions -> 54 clusters -> 500 branches -> multiple departments.',
        'Test drill-down analytics: total deposits from country level to individual branch with correct subtotals at each level.',
        'Simulate a branch merger (Branch A absorbs Branch B) and verify historical data retains the original branch attribution.',
        'Test branch closure: closed branches should be excluded from current reports but included in historical queries for their active period.',
        'Validate re-organization: moving a branch from Region X to Region Y should update current reporting without altering historical data.'
      ],
      expectedResult: 'Hierarchy navigation works from top to bottom with correct aggregations. Branch mergers preserve historical attribution. Closed branches are handled with effective dates. Re-organization updates current structure while preserving history. Orphan branches are detected.',
      severity: 'Medium',
      category: 'Hierarchy Modeling',
    },
    {
      id: 'DM-010',
      title: 'Regulatory Reporting Data Mart',
      description: 'Test the regulatory reporting data mart that pre-computes aggregations required for periodic regulatory submissions: CRAR (Capital to Risk-weighted Assets Ratio), NPA ratios, Priority Sector Lending percentages, and SLR/CRR compliance metrics.',
      steps: [
        'Build the data mart with pre-computed metrics: CRAR, Gross NPA ratio, Net NPA ratio, PCR (Provision Coverage Ratio), PSL percentage.',
        'Validate CRAR calculation: (Tier 1 + Tier 2 Capital) / Risk-Weighted Assets against manually computed values.',
        'Test NPA ratio: Gross NPA = NPA Amount / Gross Advances, Net NPA = (NPA - Provisions) / (Gross Advances - Provisions).',
        'Verify PSL computation: agriculture, MSME, education, housing, and other priority sector loans as % of ANBC (Adjusted Net Bank Credit).',
        'Test time-series: data mart should store quarterly snapshots enabling trend analysis over 12 quarters.'
      ],
      expectedResult: 'All regulatory metrics are correctly computed. CRAR matches manual computation within 0.01%. NPA ratios align with audited figures. PSL percentages match RBI return filings. Quarterly trend analysis shows correct historical snapshots.',
      severity: 'Critical',
      category: 'Regulatory Data Mart',
    },
  ],

  /* ─────────── TAB 6: DATA VISUALIZATION / REPORTING TESTING ─────────── */
  visualization: [
    {
      id: 'DV-001',
      title: 'Real-Time Transaction Dashboard Refresh',
      description: 'Validate that the real-time transaction monitoring dashboard refreshes data within the configured interval (5 seconds) and accurately displays current transaction volumes, values, success/failure rates, and channel distribution without UI lag or stale data.',
      steps: [
        'Open the real-time dashboard and verify the initial data load matches the current state from the database.',
        'Inject 100 new transactions and verify the dashboard reflects the updated count within 5 seconds.',
        'Simulate a transaction failure spike (20% failure rate) and verify the failure rate indicator updates with the correct alert threshold color change.',
        'Test dashboard performance with 8 hours of continuous streaming data (simulate an entire business day).',
        'Verify that switching between time granularities (per-second, per-minute, per-hour) correctly re-aggregates the data.'
      ],
      expectedResult: 'Dashboard refreshes within 5-second SLA. Transaction counts and values are accurate. Failure rate indicator triggers alert color at the configured threshold (5%). No memory leaks during 8-hour continuous operation. Time granularity switching is instant and accurate.',
      severity: 'Critical',
      category: 'Real-Time Dashboard',
    },
    {
      id: 'DV-002',
      title: 'Branch Performance Comparison Charts',
      description: 'Test the branch performance comparison visualization that displays key metrics (deposits, loans, NPA, customer acquisition, revenue) across branches using bar charts, radar charts, and ranked league tables. Filters must support region, cluster, and time period.',
      steps: [
        'Load performance data for 50 branches across 3 regions for the last 4 quarters.',
        'Verify that the bar chart correctly ranks branches by total deposits within a selected region.',
        'Test the radar chart comparing 5 metrics for 3 selected branches and ensure all axes are correctly scaled.',
        'Apply a time period filter (Q3 2025) and verify all charts update with the correct quarter data.',
        'Validate the league table: branch ranking changes from Q2 to Q3 should be highlighted with up/down arrows.'
      ],
      expectedResult: 'Bar charts correctly rank branches by selected metric. Radar charts display all 5 metrics with correct scaling. Time period filter updates all visualizations consistently. League table shows correct rankings with movement indicators. Data labels are readable and accurate.',
      severity: 'High',
      category: 'Comparative Analytics',
    },
    {
      id: 'DV-003',
      title: 'Loan Portfolio Risk Heat Map',
      description: 'Validate the risk heat map visualization that displays the loan portfolio distributed across two dimensions: product type (rows) and risk rating (columns). Cell color intensity represents exposure amount, and clicking a cell drills down to individual loans.',
      steps: [
        'Populate the heat map with loan portfolio data: 8 product types x 5 risk ratings (AAA, AA, A, BBB, Below Investment Grade).',
        'Verify that cell color intensity correctly corresponds to the exposure amount (darker = higher exposure).',
        'Click a high-exposure cell (e.g., Home Loans / AA) and verify the drill-down shows individual loan details.',
        'Test the color legend: exposure ranges (0-10Cr: light, 10-50Cr: medium, 50-100Cr: dark, >100Cr: critical red).',
        'Validate tooltip on hover: shows exact exposure amount, count of loans, and percentage of total portfolio.'
      ],
      expectedResult: 'Heat map correctly visualizes exposure concentration. Color intensity matches the defined exposure ranges. Drill-down returns correct individual loan details. Tooltips show accurate summary statistics. Total exposure across all cells sums to the portfolio total.',
      severity: 'High',
      category: 'Risk Visualization',
    },
    {
      id: 'DV-004',
      title: 'Customer Acquisition Funnel',
      description: 'Test the customer acquisition funnel visualization showing the conversion journey: Lead -> Application -> Document Submission -> Verification -> Approval -> Account Opening -> First Transaction. Each stage shows count and drop-off percentage.',
      steps: [
        'Load funnel data for 10,000 leads from the last quarter across 3 channels: digital, branch walk-in, and DSA (Direct Sales Agent).',
        'Verify that each funnel stage shows the correct count and conversion rate to the next stage.',
        'Test channel-wise funnel comparison: digital channel should show higher lead volume but lower conversion than branch walk-in.',
        'Validate drop-off analysis: the stage with the highest drop-off rate should be highlighted.',
        'Test time-range filter: changing from quarterly to monthly view should show the correct monthly funnel.'
      ],
      expectedResult: 'Funnel stages display correct counts and conversion rates. Channel comparison shows accurate channel-specific funnels. Highest drop-off stage is correctly identified and highlighted. Time-range filtering produces correct data. Total lead count matches the source system.',
      severity: 'Medium',
      category: 'Business Analytics',
    },
    {
      id: 'DV-005',
      title: 'Revenue Trend Analysis Report',
      description: 'Validate the revenue trend report that shows interest income, fee income, trading income, and other income across time periods with year-over-year (YoY) and month-over-month (MoM) comparisons. The report must support drill-down from bank level to business unit to product.',
      steps: [
        'Load revenue data for 24 months and verify the line chart shows the correct trend for each income category.',
        'Test YoY comparison: overlay current year line on previous year and verify the variance calculation.',
        'Validate MoM growth rate calculation: (current_month - previous_month) / previous_month x 100.',
        'Drill down from total revenue to business unit (retail, corporate, treasury) and verify subtotals sum to total.',
        'Test data export: download the report as PDF and Excel and verify exported data matches the on-screen display.'
      ],
      expectedResult: 'Trend lines are accurately plotted for all income categories. YoY comparison shows correct variance. MoM growth rates are mathematically accurate. Business unit drill-down subtotals sum correctly. Exported PDF and Excel match on-screen data exactly.',
      severity: 'High',
      category: 'Financial Reporting',
    },
    {
      id: 'DV-006',
      title: 'Regulatory Compliance Scorecard',
      description: 'Test the compliance scorecard dashboard that displays the bank compliance status across key regulatory metrics: CRAR, LCR, NSFR, NPA ratios, PSL targets, and KYC refresh completion. Each metric shows current value, regulatory threshold, and compliance status (green/amber/red).',
      steps: [
        'Configure the scorecard with 10 regulatory metrics, each with its regulatory minimum/maximum threshold.',
        'Verify traffic light status: CRAR at 13.5% (threshold 11.5%) shows green, LCR at 98% (threshold 100%) shows red.',
        'Test the amber zone: a metric within 10% of the threshold should show amber (e.g., CRAR at 12.5% = amber).',
        'Validate the trend sparkline for each metric showing the last 12 monthly values.',
        'Test the regulatory deadline calendar: upcoming reporting deadlines with countdown and submission status.'
      ],
      expectedResult: 'All 10 metrics display correct current values. Traffic light thresholds work correctly (green/amber/red). Trend sparklines show accurate 12-month history. Regulatory deadline calendar shows correct dates. Overall compliance score aggregates correctly.',
      severity: 'Critical',
      category: 'Compliance Dashboard',
    },
    {
      id: 'DV-007',
      title: 'ATM Uptime/Usage Analytics',
      description: 'Validate the ATM analytics dashboard displaying: uptime percentage per ATM, cash-out frequency, average replenishment cycle, transaction success rate, and geographic coverage map. The dashboard feeds into cash management and maintenance planning.',
      steps: [
        'Load data for 200 ATMs across 50 locations for the last 30 days.',
        'Verify the geographic map correctly plots all 200 ATMs with color-coded status (green=online, red=offline, amber=low cash).',
        'Validate uptime calculation: total_online_hours / total_hours x 100 per ATM per day.',
        'Test the cash-out prediction model visualization: projected cash-out time based on current dispensing rate.',
        'Verify the maintenance alert table: ATMs with uptime below 95% in the last 7 days should be flagged.'
      ],
      expectedResult: 'Geographic map shows all 200 ATMs with correct status colors. Uptime calculations are accurate. Cash-out predictions are displayed with confidence intervals. Maintenance alerts are correctly triggered. Dashboard loads within 3 seconds for 200 ATMs.',
      severity: 'Medium',
      category: 'Operational Analytics',
    },
    {
      id: 'DV-008',
      title: 'Fraud Detection Alert Dashboard',
      description: 'Test the fraud detection dashboard that displays real-time fraud alerts from the transaction monitoring system. Shows alert priority, fraud type, affected accounts, potential loss amount, and investigation status. Must support one-click case creation.',
      steps: [
        'Generate 50 fraud alerts across types: card cloning, account takeover, identity theft, phishing, insider fraud.',
        'Verify that the alert queue displays alerts sorted by priority (Critical first) and potential loss amount.',
        'Test alert filtering: filter by fraud type, date range, amount range, and investigation status.',
        'Validate the alert detail view: shows transaction timeline, device fingerprint comparison, and geo-location anomaly map.',
        'Test one-click case creation: clicking "Investigate" should create a case in the fraud case management system.'
      ],
      expectedResult: 'All 50 alerts are displayed with correct priority ordering. Filtering works across all dimensions. Alert detail shows comprehensive information. Case creation successfully integrates with the case management system. No alerts are dropped or duplicated.',
      severity: 'Critical',
      category: 'Fraud Analytics',
    },
    {
      id: 'DV-009',
      title: 'Treasury Position Visualization',
      description: 'Validate the treasury dashboard showing: current asset/liability maturity profile, interest rate sensitivity gap, currency position exposure, investment portfolio composition, and liquidity buffer. Designed for real-time treasury desk operations.',
      steps: [
        'Load treasury position data: 500 instruments across government securities, corporate bonds, forex positions, and money market.',
        'Verify the maturity ladder chart: instruments grouped by maturity buckets (overnight, 1-7 days, 7-14 days, 1-3 months, 3-12 months, >1 year).',
        'Test the interest rate gap analysis: assets minus liabilities per maturity bucket showing positive/negative gap.',
        'Validate currency position pie chart: exposure by currency with regulatory limits overlaid.',
        'Test intraday refresh: treasury positions should update every 60 seconds during market hours.'
      ],
      expectedResult: 'Maturity ladder correctly groups instruments into time buckets. Interest rate gap analysis matches manual computation. Currency position totals reconcile. Intraday refresh works within 60-second intervals. Charts handle instruments with multiple cash flow dates.',
      severity: 'High',
      category: 'Treasury Analytics',
    },
    {
      id: 'DV-010',
      title: 'Cross-Sell Opportunity Report',
      description: 'Test the cross-sell opportunity report that identifies customers with propensity for additional products based on their current holdings, transaction patterns, demographics, and predictive model scores. Report generates targeted lists for relationship managers.',
      steps: [
        'Run the cross-sell model for 10,000 customers and generate the opportunity report with product recommendations.',
        'Verify that the recommendation logic is sound: a savings-only customer with high balance is recommended FD/MF, not a second savings account.',
        'Test the RM (Relationship Manager) view: each RM should see only their assigned customers opportunity list.',
        'Validate the expected conversion probability: model score should rank customers by likelihood, and top decile should show 3x+ lift over random.',
        'Test the "already holds product" filter: recommendations should not include products the customer already has.'
      ],
      expectedResult: 'Cross-sell recommendations are logical and relevant. RM-level filtering works correctly. Model lift in top decile is 3x+ over random selection. Already-held products are excluded from recommendations. Report exports with customer contact details for campaign execution.',
      severity: 'Medium',
      category: 'Business Analytics',
    },
  ],

  /* ─────────── TAB 7: DATA AUTHORIZATION TESTING ─────────── */
  authorization: [
    {
      id: 'DA-001',
      title: 'Role-Based Data Access (Teller vs Manager vs Admin)',
      description: 'Validate that role-based access control (RBAC) correctly restricts data visibility based on user role. A teller sees only their branch transactions, a manager sees cluster-level data, and an admin has bank-wide access. Privilege escalation must be impossible.',
      steps: [
        'Configure 3 test users: Teller (Branch 101), Manager (Cluster North), Admin (All).',
        'Login as Teller and query transactions. Verify only Branch 101 transactions are returned.',
        'Login as Manager and query transactions. Verify all branches in Cluster North are returned but no other clusters.',
        'Login as Admin and verify bank-wide data access.',
        'Attempt privilege escalation: Teller tries to modify the branch_id filter parameter to access Branch 202. Verify the system rejects this with a 403 Forbidden response.'
      ],
      expectedResult: 'Teller sees only Branch 101 data. Manager sees Cluster North data. Admin sees all data. Privilege escalation via parameter tampering is blocked. Access denial is logged in the audit trail. No data leakage across role boundaries.',
      severity: 'Critical',
      category: 'RBAC',
    },
    {
      id: 'DA-002',
      title: 'Column-Level Security (Mask SSN for Non-Privileged)',
      description: 'Test column-level security that masks sensitive columns (SSN, Aadhaar, PAN, account number) for users without the "PII_VIEW" privilege. Masked users should see "XXX-XX-1234" format, while privileged users see the full value.',
      steps: [
        'Query the customer table as a user WITHOUT PII_VIEW privilege. Verify SSN shows as "XXX-XX-1234" (last 4 digits only).',
        'Query as a user WITH PII_VIEW privilege. Verify the full SSN "123-45-6789" is returned.',
        'Test Aadhaar masking: non-privileged sees "XXXX-XXXX-1234", privileged sees full "1234-5678-9012".',
        'Verify that masked data cannot be reversed by exporting to CSV/Excel (export retains masking).',
        'Test that aggregate functions on masked columns work correctly: COUNT(DISTINCT SSN) should count unmasked values server-side.'
      ],
      expectedResult: 'Masked users see only partial values for all PII columns. Privileged users see full values. Masking is applied consistently across all access methods (SQL, API, export). Aggregate functions operate on real values server-side. No PII leakage via export.',
      severity: 'Critical',
      category: 'Column-Level Security',
    },
    {
      id: 'DA-003',
      title: 'Row-Level Security (Branch-Specific Data Access)',
      description: 'Validate row-level security (RLS) policies that filter data rows based on the logged-in user attributes. Branch employees see only their branch data, regional managers see their region, and compliance officers see all data but with read-only access.',
      steps: [
        'Create RLS policies on the transaction, customer, and account tables linked to the user branch_id attribute.',
        'Login as Branch 101 employee and count records. Verify the count matches the known Branch 101 record count.',
        'Attempt to UPDATE a record belonging to Branch 202 while logged in as Branch 101. Verify the operation is blocked.',
        'Login as Regional Manager and verify data for all branches in the region is accessible.',
        'Login as Compliance Officer and verify read-only access to all branches. Attempt an UPDATE and verify it is blocked.'
      ],
      expectedResult: 'RLS filters rows correctly per user attribute. Cross-branch data access is prevented. Regional aggregation includes all assigned branches. Compliance read-only access is enforced (no writes). RLS policies do not degrade query performance by more than 10%.',
      severity: 'Critical',
      category: 'Row-Level Security',
    },
    {
      id: 'DA-004',
      title: 'Cross-Functional Data Access Controls',
      description: 'Test access control across functional boundaries: the retail banking team should not access corporate banking customer data and vice versa. Treasury data should be restricted to the treasury team. Shared reference data (product catalog, branch master) is accessible to all.',
      steps: [
        'Configure functional access groups: Retail, Corporate, Treasury, Operations, Compliance.',
        'Login as a Retail analyst and query the corporate_customer table. Verify access is denied.',
        'Login as a Corporate analyst and query the retail_customer table. Verify access is denied.',
        'Verify that both Retail and Corporate analysts can query shared reference tables (branch_master, product_catalog).',
        'Test a dual-role user (Retail + Compliance) and verify they can access both retail data and compliance reports but not corporate customer data.'
      ],
      expectedResult: 'Cross-functional data access is blocked. Shared reference data is accessible. Dual-role users get the union of their role permissions. Access denials are logged. No data leakage through views, stored procedures, or materialized views that join across functional boundaries.',
      severity: 'High',
      category: 'Access Control',
    },
    {
      id: 'DA-005',
      title: 'Temporary Elevated Access (Audit Period)',
      description: 'Validate the temporary access elevation mechanism used during regulatory audits, year-end closings, and special investigations. Elevated access must be time-bound, approved by a supervisor, and automatically revoked after the defined period.',
      steps: [
        'Submit a temporary access request: "Read access to all NPA data for internal audit, 7 days from 2025-06-01 to 2025-06-07."',
        'Verify the request triggers an approval workflow to the data governance lead.',
        'After approval, verify the auditor can access NPA data within the approved date range.',
        'Test access on day 8 (2025-06-08): the elevated privilege should be automatically revoked.',
        'Validate the audit trail: request, approval, access events, and revocation are all logged.'
      ],
      expectedResult: 'Temporary access is granted only after supervisor approval. Access is functional within the approved window. Auto-revocation happens at expiry without manual intervention. Complete audit trail from request to revocation. Reminder notification sent 24 hours before expiry.',
      severity: 'High',
      category: 'Temporary Access',
    },
    {
      id: 'DA-006',
      title: 'API-Level Data Authorization',
      description: 'Test that all data access APIs enforce authorization checks at the endpoint level. Unauthorized API calls must return appropriate HTTP status codes (401/403) with descriptive error messages. Token scopes must limit data access to authorized resources only.',
      steps: [
        'Call the /api/v1/customers endpoint with a valid token scoped to "read:retail_customers". Verify success.',
        'Call /api/v1/customers/corporate with the same retail-scoped token. Verify 403 Forbidden response.',
        'Call /api/v1/transactions with an expired token. Verify 401 Unauthorized response.',
        'Test token with "read" scope attempting a POST (write). Verify 403 Forbidden.',
        'Validate that API error responses follow the standard format: {"detail": "...", "error_code": "FORBIDDEN"} and include a correlation_id.'
      ],
      expectedResult: 'Scoped tokens correctly restrict access to authorized resources. Expired tokens return 401. Insufficient scope returns 403. Write attempts with read-only scope are blocked. Error responses follow the standard envelope format with correlation IDs.',
      severity: 'Critical',
      category: 'API Security',
    },
    {
      id: 'DA-007',
      title: 'Report-Level Access Restrictions',
      description: 'Validate that BI reports and dashboards enforce access controls at the report level. Sensitive reports (profitability, executive scorecard, regulatory submissions) should be restricted to authorized viewers only. Report scheduling must respect access controls.',
      steps: [
        'Configure 3 report access levels: Public (branch performance), Restricted (profitability), Confidential (executive scorecard).',
        'Verify a branch employee can view Public reports but not Restricted or Confidential.',
        'Test that a scheduled report email does not send Confidential reports to unauthorized recipients.',
        'Validate that embedded report links (shared URLs) enforce authentication before rendering.',
        'Test report export controls: Confidential reports should have export/download disabled for non-executive roles.'
      ],
      expectedResult: 'Report-level access is enforced. Unauthorized users cannot view restricted reports. Scheduled emails respect access controls. Shared URLs require authentication. Export restrictions are enforced for confidential reports.',
      severity: 'High',
      category: 'Report Security',
    },
    {
      id: 'DA-008',
      title: 'PII Data Access with Consent Verification',
      description: 'Test that access to customer PII is gated by consent verification. The system must check the customer consent record before serving PII data for marketing, analytics, or third-party sharing. Withdrawn consent must immediately restrict access.',
      steps: [
        'Set up test customers: Customer A (full consent), Customer B (analytics only, no marketing), Customer C (consent withdrawn).',
        'Query Customer A PII for marketing campaign. Verify access is granted per consent record.',
        'Query Customer B PII for marketing. Verify access is denied. Query for analytics. Verify access is granted.',
        'Query Customer C PII for any purpose. Verify all access is denied due to withdrawn consent.',
        'Test consent withdrawal mid-process: withdraw Customer A consent while a batch job is accessing their data and verify the job respects the updated consent.'
      ],
      expectedResult: 'PII access is correctly gated by consent purpose. Marketing access denied for analytics-only consent. All access denied for withdrawn consent. Real-time consent changes are reflected immediately. Consent check audit trail is maintained.',
      severity: 'Critical',
      category: 'Consent Management',
    },
    {
      id: 'DA-009',
      title: 'Third-Party Data Sharing Authorization (Open Banking)',
      description: 'Validate the Open Banking / Account Aggregator framework data sharing controls. Customer-authorized third-party apps (TPPs) should access only the consented data types (account info, transactions, balances) for the consented duration via standardized APIs.',
      steps: [
        'Register a test TPP (Third-Party Provider) with consent to access: account_info and balances (but NOT transactions) for Customer A.',
        'Call the Account Information API as the TPP. Verify account details and balances are returned.',
        'Call the Transaction History API as the same TPP. Verify 403 Forbidden (not in consented scope).',
        'Test consent expiry: set consent duration to 1 hour, wait for expiry, and verify subsequent API calls return 401.',
        'Validate that the customer can revoke TPP consent in real-time and the TPP immediately loses access.'
      ],
      expectedResult: 'TPP accesses only consented data types. Non-consented data returns 403. Expired consent returns 401. Customer revocation takes immediate effect. All TPP data access events are logged for regulatory audit.',
      severity: 'Critical',
      category: 'Open Banking',
    },
    {
      id: 'DA-010',
      title: 'Break-Glass Emergency Access Procedures',
      description: 'Test the break-glass emergency access mechanism that allows designated personnel to bypass normal access controls during a crisis (system outage, fraud incident, regulatory emergency). All break-glass access must be heavily logged and trigger immediate alerts.',
      steps: [
        'Simulate a critical fraud incident requiring a fraud analyst to access all customer accounts immediately.',
        'Execute the break-glass procedure: analyst enters justification, selects incident severity (P1), and receives temporary superuser access.',
        'Verify that break-glass activation sends real-time alerts to: CISO, Data Governance Lead, and Compliance Head.',
        'Validate that every data access during break-glass is logged with enhanced detail (query text, rows returned, time spent).',
        'Test break-glass auto-expiry: access should automatically revoke after 4 hours (configurable) and require re-authorization for extension.'
      ],
      expectedResult: 'Break-glass access is granted within 60 seconds. Alert notifications reach all designated personnel. Enhanced logging captures every action. Auto-expiry revokes access at the configured time. Post-incident review report is automatically generated.',
      severity: 'Critical',
      category: 'Emergency Access',
    },
  ],

  /* ─────────── TAB 8: DATA SECURITY TESTING ─────────── */
  security: [
    {
      id: 'DS-001',
      title: 'Encryption at Rest (AES-256 for PII Fields)',
      description: 'Validate that all PII fields stored in the database are encrypted using AES-256-GCM before writing to disk. Encryption must be transparent to the application layer (handled by the encryption service) and keys must be managed via a KMS (Key Management Service).',
      steps: [
        'Insert a customer record with PII: name, SSN, DOB, phone, email, address through the application API.',
        'Query the database directly (bypassing the application) and verify that PII columns contain encrypted ciphertext, not plaintext.',
        'Verify the encryption algorithm by checking the ciphertext header/prefix matches AES-256-GCM format.',
        'Test decryption through the application API and verify the returned plaintext matches the original input.',
        'Validate key rotation: rotate the encryption key and verify that all existing data is re-encrypted with the new key and old ciphertext is purged.'
      ],
      expectedResult: 'PII columns are encrypted at the database level. Direct DB queries return ciphertext only. Application API correctly decrypts and returns plaintext. Key rotation re-encrypts all data without downtime. No plaintext PII exists in DB, logs, or temp tables.',
      severity: 'Critical',
      category: 'Encryption',
    },
    {
      id: 'DS-002',
      title: 'Encryption in Transit (TLS 1.3 for Data Pipelines)',
      description: 'Test that all data pipeline connections (ETL tools to databases, API calls between microservices, streaming platform to consumers) use TLS 1.3 encryption. Downgrade to TLS 1.2 or lower must be rejected. Certificate validation must be enforced.',
      steps: [
        'Capture network traffic on the ETL server using tcpdump/Wireshark during an active data pipeline run.',
        'Verify that the TLS handshake uses TLS 1.3 protocol version (0x0304).',
        'Attempt to force a TLS 1.2 downgrade from the client side and verify the server rejects the connection.',
        'Test with an expired/self-signed certificate and verify the pipeline refuses to connect.',
        'Validate that inter-service communication (Kafka broker to consumer, API gateway to backend) uses mutual TLS (mTLS).'
      ],
      expectedResult: 'All pipeline connections use TLS 1.3. TLS 1.2 downgrade attempts are rejected. Expired/self-signed certificates cause connection failure. mTLS is enforced for inter-service communication. No plaintext data visible in network captures.',
      severity: 'Critical',
      category: 'Transport Security',
    },
    {
      id: 'DS-003',
      title: 'Data Masking in Non-Production Environments',
      description: 'Validate that production data refreshed into non-production environments (DEV, QA, UAT) has all PII and sensitive data masked before it becomes available. Masking must be irreversible, format-preserving, and referentially consistent across tables.',
      steps: [
        'Execute the production-to-QA data refresh pipeline which includes the masking transformation.',
        'Compare PII fields (name, SSN, phone, email, address) between production and QA environments. Verify no matching values.',
        'Verify format preservation: masked phone numbers are still 10 digits, masked emails are valid format (xxx@xxx.com).',
        'Test referential consistency: Customer A SSN in the customer table and the same SSN in the beneficiary table must mask to the same value.',
        'Attempt to reverse-engineer masked data using known production values as lookup. Verify this is not possible (irreversible masking).'
      ],
      expectedResult: 'Zero PII matches between production and non-production. Format preservation maintains data usability. Referential consistency is intact across all tables. Masking is irreversible. Non-production environments are fully functional with masked data.',
      severity: 'Critical',
      category: 'Data Masking',
    },
    {
      id: 'DS-004',
      title: 'SQL Injection Prevention in Data Queries',
      description: 'Test that all data access layers are immune to SQL injection attacks. All queries must use parameterized statements. Dynamic SQL (if any) must sanitize inputs. The application must never construct SQL strings using string concatenation with user inputs.',
      steps: [
        'Inject classic SQL injection payloads into search fields: " OR 1=1 --, UNION SELECT * FROM users, DROP TABLE customers; --.',
        'Inject into numeric fields: account_id=1; DELETE FROM transactions; --.',
        'Test second-order SQL injection: store a payload as customer name, then trigger a query that uses the stored name.',
        'Verify that parameterized queries are used by examining query logs (parameters should appear as bind variables, not inline values).',
        'Run an automated SQL injection scanner (SQLMap) against all data-access API endpoints.'
      ],
      expectedResult: 'All SQL injection payloads are rejected or safely escaped. No data is returned from UNION-based injections. No data modification occurs from injected statements. Query logs show parameterized bind variables. SQLMap scan reports zero vulnerabilities.',
      severity: 'Critical',
      category: 'Injection Prevention',
    },
    {
      id: 'DS-005',
      title: 'Data Exfiltration Detection',
      description: 'Validate the data exfiltration detection mechanisms that monitor for unusual data access patterns: bulk data downloads, off-hours access, access from unusual locations, and queries returning abnormally large result sets that may indicate data theft attempts.',
      steps: [
        'Simulate a bulk download: a single user querying and exporting 100,000 customer records within 30 minutes.',
        'Verify that the DLP (Data Loss Prevention) system flags this as anomalous and triggers an alert.',
        'Simulate off-hours access: a user querying sensitive data at 3 AM on a weekend from an unusual IP address.',
        'Test the large result set detection: a query returning 50,000+ rows should trigger a review alert if the user role normally handles < 100 rows.',
        'Validate that the alert includes: user_id, query_text, row_count, timestamp, source_ip, and data classification of accessed tables.'
      ],
      expectedResult: 'Bulk download triggers DLP alert. Off-hours unusual access generates a security alert. Large result set detection flags anomalous queries. Alert details are comprehensive for investigation. No legitimate business queries are false-positive flagged (baseline established).',
      severity: 'Critical',
      category: 'DLP',
    },
    {
      id: 'DS-006',
      title: 'Key Rotation for Encrypted Data',
      description: 'Test the encryption key rotation process that periodically rotates AES-256 encryption keys without causing application downtime. During rotation, both old and new keys must be active (dual-key period) until all data is re-encrypted with the new key.',
      steps: [
        'Initiate a key rotation from Key_V1 to Key_V2 and verify that the key management system generates the new key.',
        'During the dual-key period, verify that data encrypted with Key_V1 can still be decrypted (backward compatibility).',
        'Run the re-encryption batch job that re-encrypts all existing data from Key_V1 to Key_V2.',
        'After re-encryption completes, retire Key_V1 and verify that all data is now accessible only via Key_V2.',
        'Test key rotation under load: rotate keys while the application is actively reading and writing encrypted data.'
      ],
      expectedResult: 'Key rotation completes without application downtime. Dual-key period provides backward compatibility. Re-encryption batch processes all records. Old key is retired after re-encryption. No data is inaccessible at any point during rotation.',
      severity: 'Critical',
      category: 'Key Management',
    },
    {
      id: 'DS-007',
      title: 'Backup Encryption and Secure Recovery',
      description: 'Validate that database backups are encrypted before writing to backup storage and that the encrypted backups can be successfully decrypted and restored in a disaster recovery scenario. Backup encryption keys must be stored separately from the backups.',
      steps: [
        'Trigger a full database backup and verify the backup file is encrypted (attempt to read it with a text editor - should be binary ciphertext).',
        'Verify that the backup encryption key is stored in a separate KMS, not co-located with the backup files.',
        'Execute a restore from the encrypted backup to a clean environment and verify data integrity (row counts and checksums match).',
        'Test recovery without the encryption key: attempt to restore the backup without providing the key and verify it fails with a clear error.',
        'Validate the backup chain: full backup + 7 daily incrementals, all encrypted, and a point-in-time restore to 3 days ago.'
      ],
      expectedResult: 'Backup files are encrypted and unreadable without the key. Backup key is stored separately in KMS. Restore produces an exact copy of the source database. Restore without key fails with a clear error. Point-in-time restore from incremental chain is successful.',
      severity: 'Critical',
      category: 'Backup Security',
    },
    {
      id: 'DS-008',
      title: 'Data Anonymization for Analytics',
      description: 'Test the data anonymization pipeline that produces privacy-safe datasets for analytics, machine learning model training, and third-party sharing. Anonymization must prevent re-identification while preserving statistical properties for analytical utility.',
      steps: [
        'Apply k-anonymity (k=5) to the customer analytics dataset and verify that every combination of quasi-identifiers (age, gender, ZIP) appears at least 5 times.',
        'Apply l-diversity (l=3) to ensure sensitive attributes (income bracket) have at least 3 distinct values within each equivalence class.',
        'Test re-identification attack: attempt to identify a known individual by cross-referencing the anonymized dataset with public records. Verify this fails.',
        'Validate statistical utility: mean, median, and standard deviation of key metrics in the anonymized dataset should be within 5% of the original.',
        'Test differential privacy: add calibrated noise to query results and verify that individual records cannot be inferred from aggregate query patterns.'
      ],
      expectedResult: 'k-anonymity (k=5) is achieved across all quasi-identifier combinations. l-diversity ensures attribute diversity. Re-identification attack fails. Statistical properties are preserved within 5% tolerance. Differential privacy prevents individual inference from aggregates.',
      severity: 'High',
      category: 'Anonymization',
    },
    {
      id: 'DS-009',
      title: 'Secure Data Disposal/Purging',
      description: 'Validate the secure data disposal process that permanently and irreversibly deletes data beyond its retention period. Disposal must comply with NIST 800-88 guidelines: clear, purge, or destroy depending on data classification. Disposal must be certified and auditable.',
      steps: [
        'Identify data past its retention period: 100 customer records expired per the 7-year retention policy.',
        'Execute the secure disposal process and verify data is removed from the primary database, replicas, backups, and all caches.',
        'Attempt to recover the disposed data using database forensics tools (undrop, flashback query). Verify recovery is not possible.',
        'Validate that the disposal certificate is generated with: data classification, volume destroyed, method used, operator ID, timestamp.',
        'Test cascade disposal: disposing a customer record must also dispose all related accounts, transactions, and documents.'
      ],
      expectedResult: 'Disposed data is unrecoverable from all storage tiers. Forensic recovery attempts fail. Disposal certificate is complete and tamper-evident. Cascade disposal removes all related records. Audit trail records the complete disposal chain.',
      severity: 'High',
      category: 'Data Disposal',
    },
    {
      id: 'DS-010',
      title: 'Penetration Testing on Data Access Layers',
      description: 'Conduct penetration testing against all data access layers: direct database connections, API endpoints, BI tool connections, ETL pipeline credentials, and backup storage access. Identify vulnerabilities in authentication, authorization, and network segmentation.',
      steps: [
        'Scan database ports (1521/Oracle, 5432/Postgres, 3306/MySQL) from the application subnet and verify only authorized IPs can connect.',
        'Attempt direct database login with default/common credentials (admin/admin, sa/password, root/root). Verify all fail.',
        'Test network segmentation: attempt to access the database server from the DMZ or internet-facing subnet. Verify connection is blocked.',
        'Test API authentication bypass: attempt to access data endpoints without a token, with a forged token, and with a token from a different application.',
        'Test BI tool credential storage: verify that saved database credentials in BI tools (Tableau, Power BI) are encrypted, not stored in plaintext.'
      ],
      expectedResult: 'Database ports are accessible only from authorized subnets. Default credentials do not work. Network segmentation prevents cross-zone access. API authentication cannot be bypassed. BI tool credentials are encrypted. Pentest report shows no critical vulnerabilities.',
      severity: 'Critical',
      category: 'Penetration Testing',
    },
  ],
};

/* ================================================================
   COMPONENT
   ================================================================ */
const DataTesting = () => {
  const [activeTab, setActiveTab] = useState('ingestion');
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scenarios = SCENARIOS[activeTab] || [];

  /* ─── Summary stats ─── */
  const stats = {
    total: scenarios.length,
    critical: scenarios.filter((s) => s.severity === 'Critical').length,
    high: scenarios.filter((s) => s.severity === 'High').length,
    medium: scenarios.filter((s) => s.severity === 'Medium').length,
    low: scenarios.filter((s) => s.severity === 'Low').length,
  };

  /* ─── Styles ─── */
  const styles = {
    page: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${C.bgGradientFrom} 0%, ${C.bgGradientTo} 100%)`,
      color: C.text,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '24px 32px 48px',
    },
    header: {
      textAlign: 'center',
      marginBottom: 28,
    },
    h1: {
      fontSize: 34,
      fontWeight: 700,
      color: C.textWhite,
      margin: '0 0 8px 0',
      letterSpacing: '0.5px',
    },
    subtitle: {
      fontSize: 15,
      color: C.text,
      margin: 0,
      opacity: 0.85,
    },
    tabBar: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      marginBottom: 24,
    },
    tab: (isActive) => ({
      padding: '10px 20px',
      borderRadius: 8,
      border: isActive ? `2px solid ${C.tabActive}` : `1px solid ${C.border}`,
      background: isActive ? C.tabActive : C.tabInactive,
      color: isActive ? '#0f3460' : C.text,
      fontWeight: isActive ? 700 : 500,
      fontSize: 13,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
    }),
    statsBar: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 16,
      justifyContent: 'center',
      marginBottom: 28,
      padding: '16px 24px',
      background: C.statBg,
      borderRadius: 12,
      border: `1px solid ${C.border}`,
    },
    statItem: (color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: C.text,
    }),
    statDot: (color) => ({
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: color,
      flexShrink: 0,
    }),
    statValue: {
      fontWeight: 700,
      color: C.textWhite,
      fontSize: 16,
    },
    cardList: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      maxWidth: 1100,
      margin: '0 auto',
    },
    card: (isExpanded) => ({
      background: C.card,
      borderRadius: 12,
      border: `1px solid ${isExpanded ? C.tabActive : C.border}`,
      overflow: 'hidden',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      boxShadow: isExpanded ? `0 4px 20px ${C.shadow}` : `0 2px 8px ${C.shadow}`,
      cursor: 'pointer',
    }),
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px 20px',
      gap: 14,
      flexWrap: 'wrap',
    },
    scenarioId: {
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: 13,
      fontWeight: 700,
      color: C.tabActive,
      background: 'rgba(78,204,163,0.12)',
      padding: '4px 10px',
      borderRadius: 6,
      flexShrink: 0,
    },
    scenarioTitle: {
      fontSize: 15,
      fontWeight: 600,
      color: C.textWhite,
      flex: 1,
      minWidth: 200,
    },
    severityBadge: (sev) => ({
      fontSize: 11,
      fontWeight: 700,
      color: '#fff',
      background: severityColor(sev),
      padding: '3px 10px',
      borderRadius: 12,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      flexShrink: 0,
    }),
    categoryTag: {
      fontSize: 11,
      color: C.tabActive,
      border: `1px solid ${C.border}`,
      padding: '3px 10px',
      borderRadius: 12,
      flexShrink: 0,
    },
    expandIcon: (isExpanded) => ({
      fontSize: 18,
      color: C.tabActive,
      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      flexShrink: 0,
      marginLeft: 4,
    }),
    cardBody: {
      padding: '0 20px 20px',
      borderTop: `1px solid ${C.border}`,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: 700,
      color: C.tabActive,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginTop: 16,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      lineHeight: 1.7,
      color: C.text,
      margin: 0,
    },
    stepList: {
      margin: '0',
      paddingLeft: 20,
      listStyleType: 'decimal',
    },
    stepItem: {
      fontSize: 13,
      lineHeight: 1.7,
      color: C.text,
      marginBottom: 6,
    },
    expectedResult: {
      fontSize: 14,
      lineHeight: 1.7,
      color: '#b8f0d8',
      margin: 0,
      padding: '12px 16px',
      background: 'rgba(78,204,163,0.08)',
      borderRadius: 8,
      border: `1px solid rgba(78,204,163,0.15)`,
    },
  };

  return (
    <div style={styles.page}>
      {/* ─── Header ─── */}
      <div style={styles.header}>
        <h1 style={styles.h1}>Banking Data Testing Scenarios</h1>
        <p style={styles.subtitle}>
          Comprehensive testing scenarios across 8 data testing disciplines for banking and financial services
        </p>
      </div>

      {/* ─── Tab Bar ─── */}
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <div
            key={tab.id}
            style={styles.tab(activeTab === tab.id)}
            onClick={() => {
              setActiveTab(tab.id);
              setExpandedCards({});
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* ─── Stats Bar ─── */}
      <div style={styles.statsBar}>
        <div style={styles.statItem(C.textWhite)}>
          <span style={styles.statValue}>{stats.total}</span> Total Scenarios
        </div>
        <div style={{ width: 1, background: C.border, alignSelf: 'stretch' }} />
        <div style={styles.statItem(C.severityCritical)}>
          <span style={styles.statDot(C.severityCritical)} />
          <span style={styles.statValue}>{stats.critical}</span> Critical
        </div>
        <div style={styles.statItem(C.severityHigh)}>
          <span style={styles.statDot(C.severityHigh)} />
          <span style={styles.statValue}>{stats.high}</span> High
        </div>
        <div style={styles.statItem(C.severityMedium)}>
          <span style={styles.statDot(C.severityMedium)} />
          <span style={styles.statValue}>{stats.medium}</span> Medium
        </div>
        <div style={styles.statItem(C.severityLow)}>
          <span style={styles.statDot(C.severityLow)} />
          <span style={styles.statValue}>{stats.low}</span> Low
        </div>
      </div>

      {/* ─── Scenario Cards ─── */}
      <div style={styles.cardList}>
        {scenarios.map((scenario) => {
          const isExpanded = !!expandedCards[scenario.id];
          return (
            <div key={scenario.id} style={styles.card(isExpanded)}>
              {/* Collapsed header — always visible */}
              <div style={styles.cardHeader} onClick={() => toggleCard(scenario.id)}>
                <span style={styles.scenarioId}>{scenario.id}</span>
                <span style={styles.scenarioTitle}>{scenario.title}</span>
                <span style={styles.severityBadge(scenario.severity)}>{scenario.severity}</span>
                <span style={styles.categoryTag}>{scenario.category}</span>
                <span style={styles.expandIcon(isExpanded)}>&#9660;</span>
              </div>

              {/* Expanded body */}
              {isExpanded && (
                <div style={styles.cardBody}>
                  <div style={styles.sectionLabel}>Description</div>
                  <p style={styles.description}>{scenario.description}</p>

                  <div style={styles.sectionLabel}>Test Steps</div>
                  <ol style={styles.stepList}>
                    {scenario.steps.map((step, idx) => (
                      <li key={idx} style={styles.stepItem}>
                        {step}
                      </li>
                    ))}
                  </ol>

                  <div style={styles.sectionLabel}>Expected Result</div>
                  <p style={styles.expectedResult}>{scenario.expectedResult}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataTesting;

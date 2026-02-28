import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = {
  bgFrom: '#1a1a2e', bgTo: '#16213e', card: '#0f3460',
  accent: '#4ecca3', text: '#e0e0e0', header: '#fff',
  border: 'rgba(78,204,163,0.3)', editorBg: '#0a0a1a',
  editorText: '#4ecca3', muted: '#78909c', cardHover: '#143b6a',
  inputBg: '#0a2744', danger: '#e74c3c', warn: '#f39c12',
};

const TAB_COLORS = {
  BatchJobs: '#e74c3c', WorkflowEngine: '#3498db', Scheduler: '#f39c12',
  ETLPipeline: '#9b59b6', MessageQueue: '#2ecc71', EventDriven: '#1abc9c',
};

const TABS = [
  { key: 'BatchJobs', label: 'Batch Jobs' },
  { key: 'WorkflowEngine', label: 'Workflow Engine' },
  { key: 'Scheduler', label: 'Scheduler' },
  { key: 'ETLPipeline', label: 'ETL Pipeline' },
  { key: 'MessageQueue', label: 'Message Queue' },
  { key: 'EventDriven', label: 'Event-Driven' },
];

const DIFF = ['Beginner', 'Intermediate', 'Advanced'];
const DIFF_COLORS = { Beginner: '#2ecc71', Intermediate: '#f39c12', Advanced: '#e74c3c' };

const SCENARIOS = [
  {
    id: 'JW-001', title: 'EOD Batch Settlement', category: 'Batch Jobs',
    layer: 'BatchJobs', framework: 'Spring Batch / Jenkins', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Validates end-of-day batch settlement processing for all transaction types including NEFT, RTGS, IMPS, and UPI. Ensures debit-credit balancing, nostro/vostro reconciliation, and GL posting accuracy after batch completion.',
    prerequisites: 'Spring Batch 5.x, Jenkins pipeline access, Core Banking DB read credentials, Settlement engine API endpoint',
    config: 'BATCH_SERVER=http://batch.bank.local:8080\nDB_URL=jdbc:oracle:thin:@cbsdb:1521/PROD\nSETTLEMENT_CUTOFF=18:30:00\nRECON_TOLERANCE=0.01\nJENKINS_JOB=eod-settlement-batch',
    code: `@RunWith(SpringRunner.class)
@SpringBatchTest
@ContextConfiguration(classes = {EodSettlementConfig.class})
public class EodBatchSettlementTest {

    @Autowired private JobLauncherTestUtils jobLauncher;
    @Autowired private JdbcTemplate jdbc;

    @Test
    public void testEodSettlementBatchCompletion() throws Exception {
        // Insert test transactions for the day
        jdbc.update("INSERT INTO txn_staging (txn_id, type, amount, status) " +
            "VALUES (?, ?, ?, ?)", "TXN-90001", "NEFT", 50000.00, "PENDING");
        jdbc.update("INSERT INTO txn_staging (txn_id, type, amount, status) " +
            "VALUES (?, ?, ?, ?)", "TXN-90002", "RTGS", 250000.00, "PENDING");

        JobParameters params = new JobParametersBuilder()
            .addString("run.date", "2026-02-27")
            .addLong("run.id", System.currentTimeMillis())
            .toJobParameters();

        JobExecution exec = jobLauncher.launchJob(params);
        assertEquals(BatchStatus.COMPLETED, exec.getStatus());

        // Verify all transactions settled
        int pending = jdbc.queryForObject(
            "SELECT COUNT(*) FROM txn_staging WHERE status = 'PENDING' " +
            "AND txn_date = TRUNC(SYSDATE)", Integer.class);
        assertEquals("No pending txns after EOD", 0, (int) pending);

        // Verify GL postings balanced
        BigDecimal debits = jdbc.queryForObject(
            "SELECT SUM(amount) FROM gl_postings WHERE entry_type='DR' " +
            "AND posting_date = TRUNC(SYSDATE)", BigDecimal.class);
        BigDecimal credits = jdbc.queryForObject(
            "SELECT SUM(amount) FROM gl_postings WHERE entry_type='CR' " +
            "AND posting_date = TRUNC(SYSDATE)", BigDecimal.class);
        assertEquals("GL must balance", 0, debits.compareTo(credits));
        System.out.println("[PASS] EOD settlement batch completed, GL balanced");
    }
}`,
    expectedOutput: `[TEST] EOD Batch Settlement Validation
[INFO] Inserting 2 test transactions into staging...
[INFO] Launching EOD settlement batch job...
[INFO] Step 1/4: Transaction validation... COMPLETED
[INFO] Step 2/4: Settlement processing... COMPLETED
[INFO] Step 3/4: GL posting... COMPLETED
[INFO] Step 4/4: Reconciliation... COMPLETED
[PASS] Batch status: COMPLETED
[PASS] Pending transactions after EOD: 0
[PASS] GL debits: 300000.00, credits: 300000.00
[PASS] GL balance verified (debit = credit)
[INFO] Total execution time: 4.2s
-----------------------------------------
JW-001: EOD Batch Settlement - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-002', title: 'Interest Calculation Batch', category: 'Batch Jobs',
    layer: 'BatchJobs', framework: 'Spring Batch / Oracle', language: 'Java',
    difficulty: 'Advanced',
    description: 'Tests the monthly interest calculation batch that computes accrued interest on savings accounts, fixed deposits, and loan accounts. Validates rate application, compounding logic, and TDS deduction for interest exceeding threshold.',
    prerequisites: 'Interest rate master data, Account balance snapshots, TDS configuration, Spring Batch infrastructure',
    config: 'INTEREST_BATCH_URL=http://batch.bank.local:8080/interest\nRATE_MASTER_API=http://rateservice:8081/api/rates\nTDS_THRESHOLD=40000\nTDS_RATE=0.10\nCOMPOUND_FREQ=QUARTERLY',
    code: `@RunWith(SpringRunner.class)
@SpringBatchTest
public class InterestCalculationBatchTest {

    @Autowired private JobLauncherTestUtils jobLauncher;
    @Autowired private JdbcTemplate jdbc;

    @Before
    public void seedTestData() {
        jdbc.update("INSERT INTO accounts (acct_id, type, balance, rate) " +
            "VALUES (?, ?, ?, ?)", "SA-100001", "SAVINGS", 500000.00, 4.0);
        jdbc.update("INSERT INTO accounts (acct_id, type, balance, rate) " +
            "VALUES (?, ?, ?, ?)", "FD-200001", "FD", 1000000.00, 7.5);
        jdbc.update("INSERT INTO accounts (acct_id, type, balance, rate) " +
            "VALUES (?, ?, ?, ?)", "LN-300001", "LOAN", 750000.00, 9.25);
    }

    @Test
    public void testSavingsInterestCalculation() throws Exception {
        JobExecution exec = jobLauncher.launchJob(
            new JobParametersBuilder()
                .addString("month", "2026-02")
                .addString("account.type", "SAVINGS")
                .toJobParameters());
        assertEquals(BatchStatus.COMPLETED, exec.getStatus());

        BigDecimal interest = jdbc.queryForObject(
            "SELECT interest_amount FROM interest_accrual " +
            "WHERE acct_id = ? AND period = ?",
            BigDecimal.class, "SA-100001", "2026-02");
        // 500000 * 4.0% / 12 = 1666.67
        assertEquals(new BigDecimal("1666.67"), interest);
        System.out.println("[PASS] Savings interest: " + interest);
    }

    @Test
    public void testTdsDeduction() throws Exception {
        // FD interest 1000000 * 7.5% = 75000 > 40000 threshold
        JobExecution exec = jobLauncher.launchJob(
            new JobParametersBuilder()
                .addString("month", "2026-02")
                .addString("account.type", "FD")
                .toJobParameters());
        BigDecimal tds = jdbc.queryForObject(
            "SELECT tds_amount FROM interest_accrual WHERE acct_id = ?",
            BigDecimal.class, "FD-200001");
        assertTrue("TDS must be deducted", tds.compareTo(BigDecimal.ZERO) > 0);
        System.out.println("[PASS] TDS deducted: " + tds);
    }
}`,
    expectedOutput: `[TEST] Interest Calculation Batch Validation
[INFO] Seeding 3 test accounts (SAVINGS, FD, LOAN)...
[INFO] Running savings interest calculation for 2026-02...
[INFO] Rate applied: 4.0% p.a., Monthly: 0.3333%
[PASS] Savings interest calculated: 1666.67
[INFO] Running FD interest calculation for 2026-02...
[INFO] Annual interest: 75000.00 > TDS threshold: 40000
[PASS] TDS deducted: 7500.00 (10% of 75000)
[INFO] Running loan interest calculation...
[PASS] Loan interest accrued: 5781.25
[PASS] Compounding frequency: QUARTERLY verified
[INFO] Total accounts processed: 3
-----------------------------------------
JW-002: Interest Calculation Batch - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-003', title: 'Statement Generation Batch', category: 'Batch Jobs',
    layer: 'BatchJobs', framework: 'Spring Batch / Jasper', language: 'Java',
    difficulty: 'Beginner',
    description: 'Validates monthly account statement generation batch that produces PDF statements for all active accounts. Tests pagination, transaction sorting, opening/closing balance accuracy, and email delivery trigger.',
    prerequisites: 'JasperReports server, SMTP configuration, Account transaction history, PDF template repository',
    config: 'JASPER_URL=http://jasper.bank.local:8080/api\nSMTP_HOST=smtp.bank.local\nSTATEMENT_OUTPUT=/data/statements/\nMAX_PAGES=50\nDELIVERY_MODE=EMAIL',
    code: `@RunWith(SpringRunner.class)
@SpringBatchTest
public class StatementGenerationTest {

    @Autowired private JobLauncherTestUtils jobLauncher;
    @Autowired private JdbcTemplate jdbc;
    @Value("\${statement.output.dir}") private String outputDir;

    @Test
    public void testMonthlyStatementGeneration() throws Exception {
        jdbc.update("INSERT INTO accounts (acct_id, name, status) " +
            "VALUES (?, ?, ?)", "SA-400001", "John Doe", "ACTIVE");
        jdbc.update("INSERT INTO transactions (acct_id, txn_date, amount, type) " +
            "VALUES (?, DATE '2026-02-01', ?, ?)", "SA-400001", 10000.00, "CR");
        jdbc.update("INSERT INTO transactions (acct_id, txn_date, amount, type) " +
            "VALUES (?, DATE '2026-02-15', ?, ?)", "SA-400001", 5000.00, "DR");

        JobExecution exec = jobLauncher.launchJob(
            new JobParametersBuilder()
                .addString("period", "2026-02")
                .toJobParameters());

        assertEquals(BatchStatus.COMPLETED, exec.getStatus());

        // Verify PDF generated
        File pdf = new File(outputDir + "/SA-400001_2026-02.pdf");
        assertTrue("PDF statement must exist", pdf.exists());
        assertTrue("PDF must not be empty", pdf.length() > 0);

        // Verify closing balance in statement metadata
        String closingBal = jdbc.queryForObject(
            "SELECT closing_balance FROM statement_meta " +
            "WHERE acct_id = ? AND period = ?",
            String.class, "SA-400001", "2026-02");
        assertNotNull("Closing balance must be recorded", closingBal);
        System.out.println("[PASS] Statement generated, closing: " + closingBal);
    }

    @Test
    public void testStatementEmailTrigger() throws Exception {
        JobExecution exec = jobLauncher.launchJob(
            new JobParametersBuilder()
                .addString("period", "2026-02")
                .addString("delivery", "EMAIL").toJobParameters());
        int emailsSent = jdbc.queryForObject(
            "SELECT COUNT(*) FROM email_queue WHERE template='STATEMENT'",
            Integer.class);
        assertTrue("Email queue must have entries", emailsSent > 0);
        System.out.println("[PASS] " + emailsSent + " statement emails queued");
    }
}`,
    expectedOutput: `[TEST] Statement Generation Batch Validation
[INFO] Seeding test account SA-400001 with 2 transactions...
[INFO] Launching statement generation batch for 2026-02...
[INFO] Processing account SA-400001...
[INFO] Generating PDF: SA-400001_2026-02.pdf
[PASS] PDF statement generated (size: 24.5 KB)
[PASS] Closing balance recorded: 5000.00
[INFO] Testing email delivery trigger...
[PASS] 1 statement email(s) queued for delivery
[PASS] Email template: STATEMENT
[INFO] Total statements generated: 1
-----------------------------------------
JW-003: Statement Generation Batch - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-004', title: 'Nostro Reconciliation Batch', category: 'Batch Jobs',
    layer: 'BatchJobs', framework: 'Spring Batch / SWIFT', language: 'Java',
    difficulty: 'Advanced',
    description: 'Tests the daily nostro account reconciliation batch that matches internal ledger entries against SWIFT MT940 statements from correspondent banks. Identifies unmatched items and generates exception reports.',
    prerequisites: 'SWIFT Alliance Lite2 access, MT940 parser library, Nostro account master, Reconciliation rules engine',
    config: 'SWIFT_GATEWAY=https://swift.bank.local:9443\nNOSTRO_ACCOUNTS=USD-CITI,EUR-DEUT,GBP-BARC\nMATCH_TOLERANCE=0.05\nMT940_INPUT=/data/swift/incoming/\nEXCEPTION_REPORT=/data/recon/exceptions/',
    code: `@RunWith(SpringRunner.class)
@SpringBatchTest
public class NostroReconciliationTest {

    @Autowired private JobLauncherTestUtils jobLauncher;
    @Autowired private JdbcTemplate jdbc;
    @Autowired private Mt940Parser mt940Parser;

    @Before
    public void seedNostroData() {
        // Internal ledger entries
        jdbc.update("INSERT INTO nostro_ledger (acct, ref, amount, ccy, value_date) " +
            "VALUES (?, ?, ?, ?, DATE '2026-02-27')",
            "USD-CITI", "REF-001", 100000.00, "USD");
        jdbc.update("INSERT INTO nostro_ledger (acct, ref, amount, ccy, value_date) " +
            "VALUES (?, ?, ?, ?, DATE '2026-02-27')",
            "USD-CITI", "REF-002", 50000.00, "USD");
    }

    @Test
    public void testNostroReconciliation() throws Exception {
        // Place test MT940 file
        String mt940 = ":20:STMT20260227\\n:25:USD-CITI\\n" +
            ":60F:C260226USD100000,00\\n" +
            ":61:2602270227C100000,00NTRF REF-001\\n" +
            ":61:2602270227C50000,00NTRF REF-002\\n" +
            ":62F:C260227USD250000,00";
        Files.write(Path.of("/data/swift/incoming/USD-CITI_260227.mt940"),
            mt940.getBytes());

        JobExecution exec = jobLauncher.launchJob(
            new JobParametersBuilder()
                .addString("recon.date", "2026-02-27")
                .addString("nostro.account", "USD-CITI")
                .toJobParameters());
        assertEquals(BatchStatus.COMPLETED, exec.getStatus());

        int unmatched = jdbc.queryForObject(
            "SELECT COUNT(*) FROM recon_exceptions WHERE recon_date = DATE '2026-02-27'",
            Integer.class);
        assertEquals("All items should match", 0, (int) unmatched);

        String status = jdbc.queryForObject(
            "SELECT status FROM recon_summary WHERE acct = 'USD-CITI'",
            String.class);
        assertEquals("RECONCILED", status);
        System.out.println("[PASS] Nostro USD-CITI fully reconciled");
    }
}`,
    expectedOutput: `[TEST] Nostro Reconciliation Batch Validation
[INFO] Seeding 2 internal ledger entries for USD-CITI...
[INFO] Loading MT940 statement: USD-CITI_260227.mt940
[INFO] Parsing SWIFT MT940 format...
[INFO] Found 2 statement entries in MT940
[INFO] Matching internal vs external entries...
[PASS] REF-001: 100000.00 USD - MATCHED
[PASS] REF-002: 50000.00 USD - MATCHED
[PASS] Unmatched exceptions: 0
[PASS] Nostro USD-CITI status: RECONCILED
[INFO] Opening balance: 100000.00, Closing: 250000.00
-----------------------------------------
JW-004: Nostro Reconciliation - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-005', title: 'ATM Cash Replenishment Batch', category: 'Batch Jobs',
    layer: 'BatchJobs', framework: 'Jenkins / Shell Script', language: 'Shell',
    difficulty: 'Beginner',
    description: 'Tests the nightly ATM cash replenishment planning batch that analyzes dispensing patterns, predicts cash requirements, and generates CIT (Cash-in-Transit) orders for ATMs below threshold levels.',
    prerequisites: 'ATM monitoring system access, Cash management API, CIT vendor integration, Historical dispensing data',
    config: 'ATM_MONITOR_API=http://atm-mon.bank.local:8090/api\nCASH_THRESHOLD_PCT=20\nFORECAST_DAYS=3\nCIT_VENDOR_API=http://cit-vendor.local:443/orders\nATM_NETWORK=ZONE-NORTH',
    code: `#!/bin/bash
# JW-005: ATM Cash Replenishment Batch Test
set -euo pipefail

ATM_API="http://atm-mon.bank.local:8090/api"
THRESHOLD=20
PASS=0; FAIL=0

echo "[TEST] ATM Cash Replenishment Batch Validation"

# Test 1: Check ATM cash levels retrieval
echo "[INFO] Fetching ATM cash levels for ZONE-NORTH..."
RESPONSE=$(curl -s -w "\\n%{http_code}" "\${ATM_API}/atms?zone=ZONE-NORTH")
HTTP_CODE=$(echo "\$RESPONSE" | tail -1)
BODY=$(echo "\$RESPONSE" | head -1)

if [ "\$HTTP_CODE" -eq 200 ]; then
    echo "[PASS] ATM cash levels retrieved successfully"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] Cannot fetch ATM cash levels: HTTP \$HTTP_CODE"
    FAIL=\$((FAIL + 1))
fi

# Test 2: Identify ATMs below threshold
LOW_ATMS=$(echo "\$BODY" | jq "[.atms[] | select(.cash_pct < \${THRESHOLD})] | length")
echo "[INFO] ATMs below \${THRESHOLD}% threshold: \$LOW_ATMS"

if [ "\$LOW_ATMS" -ge 0 ]; then
    echo "[PASS] Low-cash ATM identification working"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] ATM threshold check failed"
    FAIL=\$((FAIL + 1))
fi

# Test 3: Generate CIT orders
echo "[INFO] Generating CIT replenishment orders..."
ORDER_RESP=$(curl -s -X POST "\${ATM_API}/cit/generate" \\
    -H "Content-Type: application/json" \\
    -d "{\\"zone\\": \\"ZONE-NORTH\\", \\"threshold\\": \${THRESHOLD}}")
ORDER_COUNT=$(echo "\$ORDER_RESP" | jq '.orders | length')

if [ "\$ORDER_COUNT" -ge 0 ]; then
    echo "[PASS] CIT orders generated: \$ORDER_COUNT"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] CIT order generation failed"
    FAIL=\$((FAIL + 1))
fi

# Test 4: Verify forecast data
FORECAST=$(curl -s "\${ATM_API}/forecast?zone=ZONE-NORTH&days=3")
HAS_FORECAST=$(echo "\$FORECAST" | jq '.predictions | length > 0')

if [ "\$HAS_FORECAST" = "true" ]; then
    echo "[PASS] 3-day cash forecast generated"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] Cash forecast not available"
    FAIL=\$((FAIL + 1))
fi

echo "-----------------------------------------"
echo "JW-005: ATM Cash Replenishment - \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] ATM Cash Replenishment Batch Validation
[INFO] Fetching ATM cash levels for ZONE-NORTH...
[PASS] ATM cash levels retrieved successfully
[INFO] ATMs below 20% threshold: 3
[PASS] Low-cash ATM identification working
[INFO] Generating CIT replenishment orders...
[PASS] CIT orders generated: 3
[INFO] Testing 3-day cash forecast...
[PASS] 3-day cash forecast generated
-----------------------------------------
JW-005: ATM Cash Replenishment - 4 passed, 0 failed`
  },
  {
    id: 'JW-006', title: 'Loan EMI Processing Batch', category: 'Batch Jobs',
    layer: 'BatchJobs', framework: 'Spring Batch / Quartz', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Validates the daily loan EMI auto-debit batch that processes scheduled EMI payments from borrower accounts. Tests successful debit, insufficient funds handling, NPA marking after 90 days overdue, and bounce charge application.',
    prerequisites: 'Loan management system, Auto-debit mandate registry, NPA classification rules, Bounce charge configuration',
    config: 'LOAN_BATCH_URL=http://loan-batch.bank.local:8080\nEMI_SCHEDULE_TABLE=emi_schedule\nNPA_DAYS_THRESHOLD=90\nBOUNCE_CHARGE=500\nMAX_RETRY=3',
    code: `@RunWith(SpringRunner.class)
@SpringBatchTest
public class LoanEmiProcessingTest {

    @Autowired private JobLauncherTestUtils jobLauncher;
    @Autowired private JdbcTemplate jdbc;

    @Before
    public void setupTestLoans() {
        // Loan with sufficient balance for EMI
        jdbc.update("INSERT INTO loan_accounts (loan_id, acct_id, emi_amount, status) " +
            "VALUES (?, ?, ?, ?)", "LN-5001", "SA-5001", 25000.00, "ACTIVE");
        jdbc.update("UPDATE accounts SET balance = 100000 WHERE acct_id = 'SA-5001'");

        // Loan with insufficient balance
        jdbc.update("INSERT INTO loan_accounts (loan_id, acct_id, emi_amount, status) " +
            "VALUES (?, ?, ?, ?)", "LN-5002", "SA-5002", 25000.00, "ACTIVE");
        jdbc.update("UPDATE accounts SET balance = 1000 WHERE acct_id = 'SA-5002'");
    }

    @Test
    public void testSuccessfulEmiDebit() throws Exception {
        JobExecution exec = jobLauncher.launchJob(
            new JobParametersBuilder()
                .addString("emi.date", "2026-02-27").toJobParameters());
        assertEquals(BatchStatus.COMPLETED, exec.getStatus());

        BigDecimal balance = jdbc.queryForObject(
            "SELECT balance FROM accounts WHERE acct_id = 'SA-5001'",
            BigDecimal.class);
        assertEquals(new BigDecimal("75000.00"), balance);
        System.out.println("[PASS] EMI debited, balance: " + balance);
    }

    @Test
    public void testInsufficientFundsBounce() throws Exception {
        jobLauncher.launchJob(new JobParametersBuilder()
            .addString("emi.date", "2026-02-27").toJobParameters());

        String status = jdbc.queryForObject(
            "SELECT emi_status FROM emi_schedule WHERE loan_id = 'LN-5002' " +
            "AND emi_date = DATE '2026-02-27'", String.class);
        assertEquals("BOUNCED", status);

        BigDecimal charge = jdbc.queryForObject(
            "SELECT SUM(amount) FROM charges WHERE acct_id = 'SA-5002' " +
            "AND charge_type = 'EMI_BOUNCE'", BigDecimal.class);
        assertEquals(new BigDecimal("500.00"), charge);
        System.out.println("[PASS] EMI bounced, charge applied: " + charge);
    }
}`,
    expectedOutput: `[TEST] Loan EMI Processing Batch Validation
[INFO] Setting up test loans LN-5001 and LN-5002...
[INFO] Processing EMI schedule for 2026-02-27...
[INFO] LN-5001: Balance 100000.00, EMI 25000.00 - SUFFICIENT
[PASS] EMI debited successfully, new balance: 75000.00
[INFO] LN-5002: Balance 1000.00, EMI 25000.00 - INSUFFICIENT
[PASS] EMI marked as BOUNCED
[PASS] Bounce charge applied: 500.00
[INFO] NPA check: LN-5002 overdue 1 day (threshold: 90)
[PASS] NPA status: STANDARD (not yet NPA)
-----------------------------------------
JW-006: Loan EMI Processing - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-007', title: 'AML Transaction Screening Batch', category: 'Batch Jobs',
    layer: 'BatchJobs', framework: 'Spring Batch / Drools', language: 'Java',
    difficulty: 'Advanced',
    description: 'Tests the anti-money laundering batch screening process that analyzes daily transactions against OFAC/UN/EU sanctions lists, detects structuring patterns (smurfing), and flags suspicious activity reports (SAR) for compliance review.',
    prerequisites: 'Sanctions list feeds (OFAC, UN, EU), AML rules engine (Drools), Transaction monitoring database, SAR template',
    config: 'AML_ENGINE=http://aml.bank.local:8080/api\nOFAC_LIST=/data/sanctions/ofac_sdn.xml\nSTRUCTURING_THRESHOLD=10000\nSAR_OUTPUT=/data/compliance/sar/\nSCREENING_FUZZY_MATCH=0.85',
    code: `@RunWith(SpringRunner.class)
@SpringBatchTest
public class AmlScreeningBatchTest {

    @Autowired private JobLauncherTestUtils jobLauncher;
    @Autowired private JdbcTemplate jdbc;
    @Autowired private SanctionsListService sanctionsSvc;

    @Before
    public void seedSuspiciousTransactions() {
        // Normal transaction
        jdbc.update("INSERT INTO daily_txns (txn_id, sender, receiver, amount, ccy) " +
            "VALUES (?, ?, ?, ?, ?)", "T-7001", "John Smith", "Jane Doe", 5000.00, "USD");
        // Structuring pattern: multiple txns just below 10000
        jdbc.update("INSERT INTO daily_txns (txn_id, sender, receiver, amount, ccy) " +
            "VALUES (?, ?, ?, ?, ?)", "T-7002", "Suspicious Actor", "Shell Corp", 9800.00, "USD");
        jdbc.update("INSERT INTO daily_txns (txn_id, sender, receiver, amount, ccy) " +
            "VALUES (?, ?, ?, ?, ?)", "T-7003", "Suspicious Actor", "Shell Corp", 9700.00, "USD");
        jdbc.update("INSERT INTO daily_txns (txn_id, sender, receiver, amount, ccy) " +
            "VALUES (?, ?, ?, ?, ?)", "T-7004", "Suspicious Actor", "Shell Corp", 9900.00, "USD");
    }

    @Test
    public void testSanctionsScreening() throws Exception {
        sanctionsSvc.loadList("/data/sanctions/ofac_sdn.xml");
        JobExecution exec = jobLauncher.launchJob(
            new JobParametersBuilder()
                .addString("screening.date", "2026-02-27")
                .addString("mode", "FULL").toJobParameters());
        assertEquals(BatchStatus.COMPLETED, exec.getStatus());

        int hits = jdbc.queryForObject(
            "SELECT COUNT(*) FROM sanctions_hits WHERE screening_date = CURRENT_DATE",
            Integer.class);
        System.out.println("[INFO] Sanctions hits found: " + hits);
    }

    @Test
    public void testStructuringDetection() throws Exception {
        jobLauncher.launchJob(new JobParametersBuilder()
            .addString("screening.date", "2026-02-27").toJobParameters());
        int alerts = jdbc.queryForObject(
            "SELECT COUNT(*) FROM aml_alerts WHERE alert_type = 'STRUCTURING' " +
            "AND sender = 'Suspicious Actor'", Integer.class);
        assertTrue("Structuring pattern must be detected", alerts > 0);
        System.out.println("[PASS] Structuring alerts: " + alerts);
    }
}`,
    expectedOutput: `[TEST] AML Transaction Screening Batch Validation
[INFO] Loading OFAC SDN sanctions list (12,847 entries)...
[INFO] Screening 4 daily transactions...
[INFO] T-7001: John Smith -> Jane Doe: 5000.00 USD - CLEAR
[INFO] T-7002: Suspicious Actor -> Shell Corp: 9800.00 USD - FLAGGED
[INFO] T-7003: Suspicious Actor -> Shell Corp: 9700.00 USD - FLAGGED
[INFO] T-7004: Suspicious Actor -> Shell Corp: 9900.00 USD - FLAGGED
[PASS] Sanctions screening completed: 0 OFAC hits
[PASS] Structuring pattern detected: 3 txns from same sender below 10000
[PASS] AML alert generated for Suspicious Actor
[INFO] SAR report queued for compliance review
-----------------------------------------
JW-007: AML Transaction Screening - ALL PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'JW-008', title: 'Cheque Clearing Batch (CTS)', category: 'Batch Jobs',
    layer: 'BatchJobs', framework: 'Spring Batch / ISO 8583', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Tests the Cheque Truncation System (CTS) batch that processes inward and outward cheque clearing. Validates MICR code parsing, signature verification trigger, amount matching, and return memo generation for dishonored cheques.',
    prerequisites: 'CTS gateway access, MICR parser library, Signature verification API, Clearing house settlement account',
    config: 'CTS_GATEWAY=http://cts.bank.local:8443/api\nCLEARING_HOUSE=NPCI-CTS\nMICR_VALIDATOR=http://micr-svc:8081/validate\nSIG_VERIFY_API=http://sig-verify:8082/api\nRETURN_WINDOW_HOURS=24',
    code: `@RunWith(SpringRunner.class)
@SpringBatchTest
public class ChequeClearingBatchTest {

    @Autowired private JobLauncherTestUtils jobLauncher;
    @Autowired private JdbcTemplate jdbc;

    @Before
    public void seedChequeData() {
        jdbc.update("INSERT INTO cheque_inward (cheque_no, micr, drawer_acct, " +
            "payee_acct, amount, presented_date) VALUES (?, ?, ?, ?, ?, CURRENT_DATE)",
            "CHQ-800001", "110002056", "SA-8001", "SA-8002", 15000.00);
        jdbc.update("INSERT INTO cheque_inward (cheque_no, micr, drawer_acct, " +
            "payee_acct, amount, presented_date) VALUES (?, ?, ?, ?, ?, CURRENT_DATE)",
            "CHQ-800002", "110002056", "SA-8003", "SA-8004", 75000.00);
        // SA-8003 has insufficient funds
        jdbc.update("UPDATE accounts SET balance = 500 WHERE acct_id = 'SA-8003'");
        jdbc.update("UPDATE accounts SET balance = 200000 WHERE acct_id = 'SA-8001'");
    }

    @Test
    public void testInwardChequeClearing() throws Exception {
        JobExecution exec = jobLauncher.launchJob(
            new JobParametersBuilder()
                .addString("clearing.date", "2026-02-27")
                .addString("direction", "INWARD").toJobParameters());
        assertEquals(BatchStatus.COMPLETED, exec.getStatus());

        String status1 = jdbc.queryForObject(
            "SELECT status FROM cheque_inward WHERE cheque_no = 'CHQ-800001'",
            String.class);
        assertEquals("CLEARED", status1);

        String status2 = jdbc.queryForObject(
            "SELECT status FROM cheque_inward WHERE cheque_no = 'CHQ-800002'",
            String.class);
        assertEquals("RETURNED", status2);

        String returnReason = jdbc.queryForObject(
            "SELECT return_reason FROM cheque_inward WHERE cheque_no = 'CHQ-800002'",
            String.class);
        assertEquals("INSUFFICIENT_FUNDS", returnReason);
        System.out.println("[PASS] Cheque clearing: 1 cleared, 1 returned");
    }
}`,
    expectedOutput: `[TEST] Cheque Clearing Batch (CTS) Validation
[INFO] Processing 2 inward cheques for 2026-02-27...
[INFO] CHQ-800001: MICR 110002056 validated
[INFO] CHQ-800001: Drawer SA-8001 balance: 200000.00, Amount: 15000.00
[PASS] CHQ-800001: CLEARED successfully
[INFO] CHQ-800002: MICR 110002056 validated
[INFO] CHQ-800002: Drawer SA-8003 balance: 500.00, Amount: 75000.00
[FAIL] CHQ-800002: INSUFFICIENT_FUNDS
[PASS] Return memo generated for CHQ-800002
[PASS] Cheque clearing completed: 1 cleared, 1 returned
[INFO] Settlement posted to clearing house account
-----------------------------------------
JW-008: Cheque Clearing Batch - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-009', title: 'Regulatory Reporting Batch (RBI)', category: 'Batch Jobs',
    layer: 'BatchJobs', framework: 'Jenkins / Python', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Tests the regulatory reporting batch that generates mandatory RBI returns including SLR/CRR computation, Form A return (foreign exchange), and DSB return (daily statement of balances). Validates data accuracy against source systems.',
    prerequisites: 'Core banking data warehouse, RBI return format specifications, Treasury management system access, Previous period return data for comparison',
    config: 'CBS_DW=postgresql://readonly:pass@dw.bank.local:5432/cbsdw\nRBI_RETURN_OUTPUT=/data/regulatory/rbi/\nSLR_MIN_PCT=18.0\nCRR_PCT=4.5\nREPORTING_DATE=2026-02-27',
    code: `#!/usr/bin/env python3
"""JW-009: RBI Regulatory Reporting Batch Test"""
import psycopg2
import json
import sys
from datetime import date
from decimal import Decimal

DW_CONN = "postgresql://readonly:pass@dw.bank.local:5432/cbsdw"
SLR_MIN = Decimal("18.0")
CRR_PCT = Decimal("4.5")

def test_slr_computation():
    """Verify SLR (Statutory Liquidity Ratio) calculation"""
    conn = psycopg2.connect(DW_CONN)
    cur = conn.cursor()
    cur.execute("""
        SELECT ndtl_amount, slr_securities_value,
               (slr_securities_value / ndtl_amount * 100) as slr_pct
        FROM regulatory_ratios
        WHERE report_date = %s
    """, (date(2026, 2, 27),))
    row = cur.fetchone()
    ndtl, slr_val, slr_pct = row
    assert slr_pct >= SLR_MIN, f"SLR {slr_pct}% below minimum {SLR_MIN}%"
    print(f"[PASS] SLR: {slr_pct:.2f}% (min: {SLR_MIN}%)")
    conn.close()

def test_crr_computation():
    """Verify CRR (Cash Reserve Ratio) maintenance"""
    conn = psycopg2.connect(DW_CONN)
    cur = conn.cursor()
    cur.execute("""
        SELECT ndtl_amount, rbi_balance,
               (rbi_balance / ndtl_amount * 100) as crr_pct
        FROM regulatory_ratios WHERE report_date = %s
    """, (date(2026, 2, 27),))
    row = cur.fetchone()
    _, _, crr_pct = row
    assert crr_pct >= CRR_PCT, f"CRR {crr_pct}% below required {CRR_PCT}%"
    print(f"[PASS] CRR: {crr_pct:.2f}% (required: {CRR_PCT}%)")
    conn.close()

def test_dsb_return_generation():
    """Verify Daily Statement of Balances return"""
    conn = psycopg2.connect(DW_CONN)
    cur = conn.cursor()
    cur.execute("""
        SELECT total_deposits, total_advances, total_investments
        FROM dsb_return WHERE report_date = %s
    """, (date(2026, 2, 27),))
    row = cur.fetchone()
    assert all(v is not None and v > 0 for v in row), "DSB values must be positive"
    print(f"[PASS] DSB Return: Deposits={row[0]}, Advances={row[1]}, Investments={row[2]}")
    conn.close()

if __name__ == "__main__":
    print("[TEST] RBI Regulatory Reporting Batch Validation")
    test_slr_computation()
    test_crr_computation()
    test_dsb_return_generation()
    print("\\nJW-009: All regulatory reporting tests PASSED")`,
    expectedOutput: `[TEST] RBI Regulatory Reporting Batch Validation
[INFO] Connecting to CBS data warehouse...
[INFO] Computing SLR for 2026-02-27...
[INFO] NDTL: 45,000 Cr, SLR Securities: 9,450 Cr
[PASS] SLR: 21.00% (min: 18.0%)
[INFO] Computing CRR for 2026-02-27...
[INFO] RBI Balance: 2,250 Cr
[PASS] CRR: 5.00% (required: 4.5%)
[INFO] Generating DSB Return...
[PASS] DSB Return: Deposits=32000Cr, Advances=28000Cr, Investments=9450Cr
[INFO] Return file: DSB_20260227.xml generated
-----------------------------------------
JW-009: RBI Regulatory Reporting - ALL PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'JW-010', title: 'Card Billing Cycle Batch', category: 'Batch Jobs',
    layer: 'BatchJobs', framework: 'Spring Batch / Oracle', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Tests the credit card billing cycle batch that generates monthly statements, calculates minimum due, applies late fees, computes reward points, and triggers payment reminders. Validates interest-free period logic and revolving credit interest.',
    prerequisites: 'Card management system, Billing cycle configuration, Rewards engine, SMS/Email notification service',
    config: 'CARD_BATCH=http://card-batch.bank.local:8080\nBILLING_CYCLE_TABLE=card_billing_cycle\nLATE_FEE=1000\nMIN_DUE_PCT=5\nREWARD_RATE=2\nINTEREST_FREE_DAYS=45',
    code: `@RunWith(SpringRunner.class)
@SpringBatchTest
public class CardBillingCycleTest {

    @Autowired private JobLauncherTestUtils jobLauncher;
    @Autowired private JdbcTemplate jdbc;

    @Before
    public void setupCardAccounts() {
        jdbc.update("INSERT INTO card_accounts (card_no, credit_limit, " +
            "outstanding, last_payment_date, billing_date) " +
            "VALUES (?, ?, ?, DATE '2026-01-25', 27)",
            "4111-XXXX-XXXX-1001", 200000.00, 45000.00);
        jdbc.update("INSERT INTO card_transactions (card_no, txn_date, " +
            "merchant, amount, category) VALUES (?, DATE '2026-02-10', ?, ?, ?)",
            "4111-XXXX-XXXX-1001", "Amazon India", 12500.00, "SHOPPING");
        jdbc.update("INSERT INTO card_transactions (card_no, txn_date, " +
            "merchant, amount, category) VALUES (?, DATE '2026-02-18', ?, ?, ?)",
            "4111-XXXX-XXXX-1001", "Swiggy", 850.00, "FOOD");
    }

    @Test
    public void testBillingStatementGeneration() throws Exception {
        JobExecution exec = jobLauncher.launchJob(
            new JobParametersBuilder()
                .addString("billing.date", "2026-02-27").toJobParameters());
        assertEquals(BatchStatus.COMPLETED, exec.getStatus());

        Map<String, Object> stmt = jdbc.queryForMap(
            "SELECT total_due, min_due, reward_points FROM card_statements " +
            "WHERE card_no = '4111-XXXX-XXXX-1001' AND billing_month = '2026-02'");
        BigDecimal totalDue = (BigDecimal) stmt.get("total_due");
        BigDecimal minDue = (BigDecimal) stmt.get("min_due");
        int rewards = (int) stmt.get("reward_points");

        assertTrue("Total due must include new txns", totalDue.compareTo(new BigDecimal("58350")) == 0);
        assertEquals("Min due = 5% of total", new BigDecimal("2917.50"), minDue);
        assertTrue("Reward points earned", rewards > 0);

        System.out.println("[PASS] Statement: Total=" + totalDue +
            ", MinDue=" + minDue + ", Rewards=" + rewards);
    }
}`,
    expectedOutput: `[TEST] Card Billing Cycle Batch Validation
[INFO] Setting up card account 4111-XXXX-XXXX-1001...
[INFO] Adding 2 transactions for billing period...
[INFO] Running billing cycle batch for 2026-02-27...
[INFO] Previous outstanding: 45000.00
[INFO] New transactions: 13350.00 (Amazon + Swiggy)
[PASS] Total due: 58350.00
[PASS] Minimum due (5%): 2917.50
[PASS] Reward points earned: 267 (2 pts per 100)
[INFO] Interest-free period: 45 days applicable
[PASS] Payment reminder SMS queued
-----------------------------------------
JW-010: Card Billing Cycle - ALL PASSED
Total: 4 passed, 0 failed`
  },
  /* ====== TAB 2: Workflow Engine (JW-011 to JW-020) ====== */
  {
    id: 'JW-011', title: 'Loan Approval Workflow', category: 'Workflow Engine',
    layer: 'WorkflowEngine', framework: 'Camunda BPMN / REST', language: 'Java',
    difficulty: 'Advanced',
    description: 'Tests the multi-stage loan approval workflow engine covering application intake, credit scoring, document verification, underwriting decision, and disbursement. Validates state transitions, SLA timers, and escalation paths.',
    prerequisites: 'Camunda BPM engine, Credit bureau API, Document management system, Underwriting rules engine',
    config: 'CAMUNDA_URL=http://camunda.bank.local:8080/engine-rest\nCREDIT_BUREAU_API=http://cibil.bank.local:9090/api\nDMS_URL=http://dms.bank.local:8081\nSLA_APPROVAL_HOURS=48\nESCALATION_LEVEL=SENIOR_MANAGER',
    code: `@RunWith(SpringRunner.class)
@Deployment(resources = "loan-approval.bpmn")
public class LoanApprovalWorkflowTest {

    @Autowired private RuntimeService runtimeService;
    @Autowired private TaskService taskService;
    @Autowired private HistoryService historyService;

    @Test
    public void testFullLoanApprovalFlow() {
        // Start loan application process
        Map<String, Object> vars = new HashMap<>();
        vars.put("applicantId", "CUST-1001");
        vars.put("loanAmount", 500000);
        vars.put("loanType", "PERSONAL");
        vars.put("creditScore", 750);

        ProcessInstance pi = runtimeService.startProcessInstanceByKey(
            "loan-approval-process", vars);
        assertNotNull("Process must start", pi.getId());

        // Complete credit check task
        Task creditTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("credit-check").singleResult();
        assertNotNull("Credit check task must exist", creditTask);
        taskService.complete(creditTask.getId(),
            Map.of("creditApproved", true, "riskCategory", "LOW"));

        // Complete document verification
        Task docTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("doc-verification").singleResult();
        taskService.complete(docTask.getId(),
            Map.of("docsVerified", true));

        // Complete underwriting decision
        Task uwTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("underwriting-decision").singleResult();
        taskService.complete(uwTask.getId(),
            Map.of("approved", true, "sanctionedAmount", 500000));

        // Verify process completed
        HistoricProcessInstance hpi = historyService
            .createHistoricProcessInstanceQuery()
            .processInstanceId(pi.getId()).singleResult();
        assertNotNull("Process must be in history", hpi.getEndTime());
        System.out.println("[PASS] Loan approval workflow completed");
    }
}`,
    expectedOutput: `[TEST] Loan Approval Workflow Validation
[INFO] Starting loan application for CUST-1001...
[INFO] Loan amount: 500000, Type: PERSONAL
[INFO] Step 1: Credit Check - Score: 750, Risk: LOW
[PASS] Credit check approved
[INFO] Step 2: Document Verification
[PASS] All documents verified
[INFO] Step 3: Underwriting Decision
[PASS] Loan approved, sanctioned: 500000
[INFO] Step 4: Disbursement triggered
[PASS] Workflow completed in 3 stages
[INFO] Total workflow time: 2.1s (SLA: 48 hours)
-----------------------------------------
JW-011: Loan Approval Workflow - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-012', title: 'Account Opening Workflow', category: 'Workflow Engine',
    layer: 'WorkflowEngine', framework: 'Camunda BPMN / REST', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Tests the digital account opening workflow including KYC verification, video KYC (V-KYC), initial deposit processing, debit card issuance trigger, and welcome kit dispatch. Validates parallel gateway for concurrent tasks.',
    prerequisites: 'Camunda BPM engine, eKYC provider API, Video KYC platform, Card management system, CRM system',
    config: 'CAMUNDA_URL=http://camunda.bank.local:8080/engine-rest\nEKYC_API=http://ekyc.vendor.local:8443/api\nVKYC_PLATFORM=http://vkyc.bank.local:9090\nCARD_MGMT=http://card-mgmt.bank.local:8082\nMIN_DEPOSIT=1000',
    code: `@RunWith(SpringRunner.class)
@Deployment(resources = "account-opening.bpmn")
public class AccountOpeningWorkflowTest {

    @Autowired private RuntimeService runtimeService;
    @Autowired private TaskService taskService;

    @Test
    public void testDigitalAccountOpening() {
        Map<String, Object> vars = new HashMap<>();
        vars.put("customerName", "Priya Sharma");
        vars.put("aadhaarNumber", "9876-5432-1098");
        vars.put("panNumber", "ABCDE1234F");
        vars.put("accountType", "SAVINGS");
        vars.put("initialDeposit", 5000);

        ProcessInstance pi = runtimeService.startProcessInstanceByKey(
            "account-opening-flow", vars);
        assertNotNull(pi.getId());

        // eKYC verification
        Task ekycTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("ekyc-verify").singleResult();
        assertNotNull("eKYC task must exist", ekycTask);
        taskService.complete(ekycTask.getId(),
            Map.of("ekycStatus", "VERIFIED", "riskFlag", false));

        // Parallel tasks: card issuance + welcome kit
        List<Task> parallelTasks = taskService.createTaskQuery()
            .processInstanceId(pi.getId()).list();
        assertEquals("Two parallel tasks expected", 2, parallelTasks.size());

        for (Task t : parallelTasks) {
            taskService.complete(t.getId(), Map.of("completed", true));
        }

        // Verify account created
        long activeInstances = runtimeService.createProcessInstanceQuery()
            .processInstanceId(pi.getId()).count();
        assertEquals("Process should be complete", 0, activeInstances);
        System.out.println("[PASS] Account opening workflow completed");
    }

    @Test
    public void testKycRejectionPath() {
        Map<String, Object> vars = Map.of(
            "customerName", "Test User",
            "aadhaarNumber", "0000-0000-0000",
            "panNumber", "XXXXX0000X",
            "accountType", "SAVINGS",
            "initialDeposit", 1000);

        ProcessInstance pi = runtimeService.startProcessInstanceByKey(
            "account-opening-flow", vars);
        Task ekycTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("ekyc-verify").singleResult();
        taskService.complete(ekycTask.getId(),
            Map.of("ekycStatus", "REJECTED", "riskFlag", true));

        // Should go to manual review, not account creation
        Task reviewTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("manual-review").singleResult();
        assertNotNull("Manual review task must exist after rejection", reviewTask);
        System.out.println("[PASS] KYC rejection routes to manual review");
    }
}`,
    expectedOutput: `[TEST] Account Opening Workflow Validation
[INFO] Starting account opening for Priya Sharma...
[INFO] Account type: SAVINGS, Initial deposit: 5000
[INFO] Step 1: eKYC Verification (Aadhaar + PAN)
[PASS] eKYC verified successfully
[INFO] Step 2: Parallel gateway - Card + Welcome Kit
[PASS] Debit card issuance triggered
[PASS] Welcome kit dispatch triggered
[PASS] Account SA-NEW-001 created successfully
[INFO] Testing KYC rejection path...
[PASS] Rejected KYC routes to manual review queue
-----------------------------------------
JW-012: Account Opening Workflow - ALL PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'JW-013', title: 'KYC Verification Workflow', category: 'Workflow Engine',
    layer: 'WorkflowEngine', framework: 'Flowable / REST', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Tests the Know Your Customer verification workflow with multi-level checks: PAN verification, Aadhaar OTP validation, address proof verification, PEP/sanctions screening, and risk categorization (Low/Medium/High).',
    prerequisites: 'Flowable BPM engine, NSDL PAN API, UIDAI Aadhaar API, PEP database, Risk scoring model',
    config: 'FLOWABLE_URL=http://flowable.bank.local:8080/api\nPAN_VERIFY_API=https://nsdl.bank.local/api/pan\nAADHAAR_API=https://uidai.bank.local/api/otp\nPEP_DB=postgresql://pepdb:5432/sanctions\nRISK_THRESHOLD_HIGH=80',
    code: `@RunWith(SpringRunner.class)
@FlowableTest
public class KycVerificationWorkflowTest {

    @Autowired private RuntimeService runtimeService;
    @Autowired private TaskService taskService;

    @Test
    public void testFullKycFlow() {
        Map<String, Object> vars = new HashMap<>();
        vars.put("customerId", "CUST-2001");
        vars.put("panNumber", "ABCDE1234F");
        vars.put("aadhaarNumber", "987654321098");
        vars.put("addressProof", "PASSPORT");

        ProcessInstance pi = runtimeService.startProcessInstanceByKey(
            "kyc-verification", vars);

        // PAN verification step
        Task panTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("pan-verify").singleResult();
        assertNotNull(panTask);
        taskService.complete(panTask.getId(),
            Map.of("panValid", true, "panName", "PRIYA SHARMA"));
        System.out.println("[PASS] PAN verified: ABCDE1234F");

        // Aadhaar OTP step
        Task aadhaarTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("aadhaar-otp").singleResult();
        taskService.complete(aadhaarTask.getId(),
            Map.of("otpVerified", true, "aadhaarName", "PRIYA SHARMA"));
        System.out.println("[PASS] Aadhaar OTP verified");

        // PEP screening step
        Task pepTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("pep-screening").singleResult();
        taskService.complete(pepTask.getId(),
            Map.of("pepHit", false, "sanctionsHit", false));
        System.out.println("[PASS] PEP/Sanctions screening clear");

        // Risk categorization
        Task riskTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("risk-category").singleResult();
        taskService.complete(riskTask.getId(),
            Map.of("riskScore", 25, "riskCategory", "LOW"));
        System.out.println("[PASS] Risk category: LOW (score: 25)");
    }
}`,
    expectedOutput: `[TEST] KYC Verification Workflow Validation
[INFO] Starting KYC for customer CUST-2001...
[INFO] Step 1: PAN Verification
[PASS] PAN verified: ABCDE1234F - Name: PRIYA SHARMA
[INFO] Step 2: Aadhaar OTP Verification
[PASS] Aadhaar OTP verified successfully
[INFO] Step 3: PEP/Sanctions Screening
[PASS] No PEP or sanctions hits found
[INFO] Step 4: Risk Categorization
[PASS] Risk score: 25, Category: LOW
[PASS] KYC status updated to VERIFIED
[INFO] Workflow completed in 4 steps
-----------------------------------------
JW-013: KYC Verification Workflow - ALL PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'JW-014', title: 'Trade Finance Workflow (LC)', category: 'Workflow Engine',
    layer: 'WorkflowEngine', framework: 'Camunda BPMN / SWIFT', language: 'Java',
    difficulty: 'Advanced',
    description: 'Tests the Letter of Credit (LC) issuance workflow covering application, credit assessment, document examination (UCP 600 compliance), SWIFT MT700 generation, amendment handling, and LC closure after shipment documents presentation.',
    prerequisites: 'Camunda BPM, SWIFT Alliance access, UCP 600 rules engine, Trade finance module, Document checker service',
    config: 'CAMUNDA_URL=http://camunda.bank.local:8080/engine-rest\nSWIFT_GW=https://swift.bank.local:9443\nTRADE_MODULE=http://trade.bank.local:8084\nUCP600_RULES=http://rules.bank.local:8085/ucp600\nLC_MARGIN_PCT=10',
    code: `@RunWith(SpringRunner.class)
@Deployment(resources = "lc-issuance.bpmn")
public class TradeFinanceLcWorkflowTest {

    @Autowired private RuntimeService runtimeService;
    @Autowired private TaskService taskService;

    @Test
    public void testLcIssuanceWorkflow() {
        Map<String, Object> vars = new HashMap<>();
        vars.put("applicant", "ABC Imports Ltd");
        vars.put("beneficiary", "XYZ Exports Inc");
        vars.put("lcAmount", 1000000);
        vars.put("currency", "USD");
        vars.put("expiryDate", "2026-06-30");
        vars.put("goodsDescription", "Electronic Components");

        ProcessInstance pi = runtimeService.startProcessInstanceByKey(
            "lc-issuance-workflow", vars);

        // Credit assessment
        Task creditTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("credit-assessment").singleResult();
        taskService.complete(creditTask.getId(),
            Map.of("creditApproved", true, "marginCollected", 100000));
        System.out.println("[PASS] Credit assessment: approved, margin: 100000");

        // Document examination (UCP 600)
        Task docExam = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("doc-examination").singleResult();
        taskService.complete(docExam.getId(),
            Map.of("ucpCompliant", true, "discrepancies", 0));
        System.out.println("[PASS] UCP 600 compliance verified");

        // SWIFT MT700 generation
        Task swiftTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("swift-mt700").singleResult();
        assertNotNull("SWIFT MT700 task must exist", swiftTask);
        taskService.complete(swiftTask.getId(),
            Map.of("swiftRef", "MT700-2026022700001", "sent", true));
        System.out.println("[PASS] SWIFT MT700 sent: MT700-2026022700001");
    }
}`,
    expectedOutput: `[TEST] Trade Finance LC Workflow Validation
[INFO] Starting LC issuance for ABC Imports Ltd...
[INFO] LC Amount: 1,000,000 USD, Beneficiary: XYZ Exports Inc
[INFO] Step 1: Credit Assessment
[PASS] Credit approved, margin collected: 100,000 USD (10%)
[INFO] Step 2: Document Examination (UCP 600)
[PASS] UCP 600 compliant, discrepancies: 0
[INFO] Step 3: SWIFT MT700 Generation
[PASS] MT700 sent successfully: MT700-2026022700001
[INFO] LC status: ISSUED
[PASS] Advising bank notified via SWIFT
-----------------------------------------
JW-014: Trade Finance LC Workflow - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-015', title: 'Fraud Investigation Workflow', category: 'Workflow Engine',
    layer: 'WorkflowEngine', framework: 'Camunda BPMN / REST', language: 'Java',
    difficulty: 'Advanced',
    description: 'Tests the fraud investigation case management workflow including alert triage, case assignment, evidence collection, customer contact, decision (genuine/fraud), recovery action, and regulatory reporting (STR). Validates SLA tracking and escalation.',
    prerequisites: 'Fraud detection alert feed, Case management system, Investigation tools API, STR filing template',
    config: 'FRAUD_ENGINE=http://fraud.bank.local:8080/api\nCASE_MGMT=http://cases.bank.local:8081\nSLA_TRIAGE_HOURS=4\nSLA_INVESTIGATION_DAYS=15\nSTR_TEMPLATE=/templates/str_v2.xml',
    code: `@RunWith(SpringRunner.class)
@Deployment(resources = "fraud-investigation.bpmn")
public class FraudInvestigationWorkflowTest {

    @Autowired private RuntimeService runtimeService;
    @Autowired private TaskService taskService;

    @Test
    public void testFraudCaseWorkflow() {
        Map<String, Object> vars = new HashMap<>();
        vars.put("alertId", "FRD-ALERT-5001");
        vars.put("customerId", "CUST-3001");
        vars.put("transactionId", "TXN-99001");
        vars.put("alertAmount", 250000);
        vars.put("alertType", "UNUSUAL_PATTERN");

        ProcessInstance pi = runtimeService.startProcessInstanceByKey(
            "fraud-investigation", vars);

        // Triage step
        Task triageTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("alert-triage").singleResult();
        assertNotNull("Triage task must be created", triageTask);
        taskService.complete(triageTask.getId(),
            Map.of("severity", "HIGH", "assignedTo", "INV-OFFICER-01"));
        System.out.println("[PASS] Alert triaged: HIGH severity");

        // Evidence collection
        Task evidenceTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("evidence-collection").singleResult();
        taskService.complete(evidenceTask.getId(), Map.of(
            "evidenceCount", 5,
            "cctv", true,
            "ipTrace", "103.45.67.89"));
        System.out.println("[PASS] Evidence collected: 5 items");

        // Decision
        Task decisionTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("investigation-decision").singleResult();
        taskService.complete(decisionTask.getId(),
            Map.of("decision", "CONFIRMED_FRAUD", "lossAmount", 250000));

        // STR filing should be triggered
        Task strTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("str-filing").singleResult();
        assertNotNull("STR filing task must be created for confirmed fraud", strTask);
        taskService.complete(strTask.getId(),
            Map.of("strFiled", true, "strRef", "STR-2026-0001"));
        System.out.println("[PASS] STR filed: STR-2026-0001");
    }
}`,
    expectedOutput: `[TEST] Fraud Investigation Workflow Validation
[INFO] Processing fraud alert FRD-ALERT-5001...
[INFO] Customer: CUST-3001, Amount: 250000, Type: UNUSUAL_PATTERN
[INFO] Step 1: Alert Triage
[PASS] Severity: HIGH, Assigned to: INV-OFFICER-01
[INFO] Step 2: Evidence Collection
[PASS] 5 evidence items collected (CCTV, IP trace, etc.)
[INFO] Step 3: Investigation Decision
[PASS] Decision: CONFIRMED_FRAUD, Loss: 250000
[INFO] Step 4: STR Filing (Regulatory)
[PASS] STR filed: STR-2026-0001
[INFO] Case status: CLOSED - FRAUD CONFIRMED
-----------------------------------------
JW-015: Fraud Investigation Workflow - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-016', title: 'Wire Transfer Approval Workflow', category: 'Workflow Engine',
    layer: 'WorkflowEngine', framework: 'Flowable / REST', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Tests the high-value wire transfer approval workflow with maker-checker pattern, dual authorization for amounts above threshold, sanctions screening, FX rate lock, and SWIFT message generation (MT103).',
    prerequisites: 'Flowable BPM, SWIFT gateway, Sanctions screening API, FX rate service, Maker-checker configuration',
    config: 'FLOWABLE_URL=http://flowable.bank.local:8080/api\nDUAL_AUTH_THRESHOLD=1000000\nSANCTIONS_API=http://sanctions.bank.local:8086\nFX_RATE_API=http://fx.bank.local:8087\nSWIFT_MT103_GW=https://swift.bank.local:9443/mt103',
    code: `@RunWith(SpringRunner.class)
@FlowableTest
public class WireTransferApprovalTest {

    @Autowired private RuntimeService runtimeService;
    @Autowired private TaskService taskService;

    @Test
    public void testHighValueWireTransfer() {
        Map<String, Object> vars = new HashMap<>();
        vars.put("senderId", "CUST-4001");
        vars.put("beneficiary", "Global Corp Ltd");
        vars.put("beneficiaryBank", "CITIUS33");
        vars.put("amount", 2500000);
        vars.put("currency", "USD");
        vars.put("purpose", "TRADE_PAYMENT");

        ProcessInstance pi = runtimeService.startProcessInstanceByKey(
            "wire-transfer-approval", vars);

        // Maker creates transfer
        Task makerTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("maker-input").singleResult();
        taskService.complete(makerTask.getId(),
            Map.of("makerApproved", true, "makerId", "EMP-M001"));

        // Sanctions screening
        Task sanctionsTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("sanctions-check").singleResult();
        taskService.complete(sanctionsTask.getId(),
            Map.of("sanctionsClear", true));
        System.out.println("[PASS] Sanctions screening: CLEAR");

        // Checker 1 (above threshold = dual auth required)
        Task checker1 = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("checker-approve-1").singleResult();
        assertNotNull("First checker required for high value", checker1);
        taskService.complete(checker1.getId(),
            Map.of("checker1Approved", true, "checker1Id", "EMP-C001"));

        // Checker 2 (dual authorization)
        Task checker2 = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("checker-approve-2").singleResult();
        assertNotNull("Second checker required above 1M", checker2);
        taskService.complete(checker2.getId(),
            Map.of("checker2Approved", true, "checker2Id", "EMP-C002"));
        System.out.println("[PASS] Dual authorization completed");
    }
}`,
    expectedOutput: `[TEST] Wire Transfer Approval Workflow Validation
[INFO] Wire transfer: 2,500,000 USD to Global Corp Ltd (CITIUS33)
[INFO] Amount exceeds dual-auth threshold (1,000,000)
[INFO] Step 1: Maker input by EMP-M001
[PASS] Maker approved
[INFO] Step 2: Sanctions screening
[PASS] Beneficiary clear - no sanctions hits
[INFO] Step 3: First checker approval
[PASS] Checker 1 (EMP-C001) approved
[INFO] Step 4: Second checker approval (dual auth)
[PASS] Checker 2 (EMP-C002) approved
[INFO] SWIFT MT103 generated and queued
-----------------------------------------
JW-016: Wire Transfer Approval - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-017', title: 'Mortgage Origination Workflow', category: 'Workflow Engine',
    layer: 'WorkflowEngine', framework: 'Camunda BPMN / REST', language: 'Java',
    difficulty: 'Advanced',
    description: 'Tests the end-to-end mortgage origination workflow covering property valuation, income verification, legal title check, insurance mandate, loan sanction, and mortgage registration. Validates conditional branching based on property type.',
    prerequisites: 'Camunda BPM, Property valuation API, Income tax portal integration, Legal verification service, Insurance aggregator API',
    config: 'CAMUNDA_URL=http://camunda.bank.local:8080/engine-rest\nVALUATION_API=http://valuation.bank.local:8088\nITR_VERIFY_API=https://itr.bank.local:8089\nLEGAL_CHECK=http://legal.bank.local:8090\nINSURANCE_API=http://insurance.bank.local:8091\nMAX_LTV_PCT=80',
    code: `@RunWith(SpringRunner.class)
@Deployment(resources = "mortgage-origination.bpmn")
public class MortgageOriginationTest {

    @Autowired private RuntimeService runtimeService;
    @Autowired private TaskService taskService;

    @Test
    public void testMortgageApprovalFlow() {
        Map<String, Object> vars = new HashMap<>();
        vars.put("applicantId", "CUST-5001");
        vars.put("propertyType", "APARTMENT");
        vars.put("propertyValue", 8000000);
        vars.put("requestedAmount", 6000000);
        vars.put("annualIncome", 2400000);

        ProcessInstance pi = runtimeService.startProcessInstanceByKey(
            "mortgage-origination", vars);

        // Property valuation
        Task valTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("property-valuation").singleResult();
        taskService.complete(valTask.getId(),
            Map.of("valuedAt", 7500000, "ltvPct", 80.0));
        System.out.println("[PASS] Property valued at 7,500,000 - LTV 80%");

        // Income verification
        Task incomeTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("income-verify").singleResult();
        taskService.complete(incomeTask.getId(),
            Map.of("incomeVerified", true, "dti", 45.0));

        // Legal title check
        Task legalTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("legal-title-check").singleResult();
        taskService.complete(legalTask.getId(),
            Map.of("titleClear", true, "encumbranceFree", true));
        System.out.println("[PASS] Legal title: clear, encumbrance free");

        // Insurance mandate
        Task insuranceTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("insurance-mandate").singleResult();
        taskService.complete(insuranceTask.getId(),
            Map.of("insured", true, "policyNo", "INS-MRT-90001"));

        // Verify loan sanctioned
        Task sanctionTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("loan-sanction").singleResult();
        assertNotNull("Sanction task must exist after all checks", sanctionTask);
        System.out.println("[PASS] Mortgage sanctioned for 6,000,000");
    }
}`,
    expectedOutput: `[TEST] Mortgage Origination Workflow Validation
[INFO] Mortgage application for CUST-5001...
[INFO] Property: APARTMENT, Value: 8,000,000, Requested: 6,000,000
[INFO] Step 1: Property Valuation
[PASS] Valued at 7,500,000 - LTV: 80% (max: 80%)
[INFO] Step 2: Income Verification
[PASS] Income verified, DTI ratio: 45%
[INFO] Step 3: Legal Title Check
[PASS] Title clear, no encumbrance
[INFO] Step 4: Insurance Mandate
[PASS] Policy INS-MRT-90001 issued
[INFO] Step 5: Loan Sanction
[PASS] Mortgage sanctioned: 6,000,000
-----------------------------------------
JW-017: Mortgage Origination - ALL PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'JW-018', title: 'Customer Complaint Workflow', category: 'Workflow Engine',
    layer: 'WorkflowEngine', framework: 'Flowable / REST', language: 'Python',
    difficulty: 'Beginner',
    description: 'Tests the customer complaint management workflow covering ticket creation, auto-categorization, SLA assignment, escalation timers, resolution, and customer feedback collection. Validates RBI-mandated TAT for different complaint types.',
    prerequisites: 'Flowable BPM engine, Complaint categorization ML model, CRM system, SMS/Email gateway, RBI TAT configuration',
    config: 'FLOWABLE_URL=http://flowable.bank.local:8080/api\nCRM_API=http://crm.bank.local:8092\nSLA_CARD_DISPUTE_DAYS=7\nSLA_SERVICE_ISSUE_DAYS=15\nSLA_FRAUD_COMPLAINT_DAYS=10\nESCALATION_LEVELS=L1,L2,L3,OMBUDSMAN',
    code: `#!/usr/bin/env python3
"""JW-018: Customer Complaint Workflow Test"""
import requests
import json
from datetime import datetime, timedelta

FLOWABLE_URL = "http://flowable.bank.local:8080/api"
SLA_CONFIG = {"CARD_DISPUTE": 7, "SERVICE_ISSUE": 15, "FRAUD": 10}

def test_complaint_creation():
    """Test complaint ticket creation and auto-categorization"""
    payload = {
        "customerId": "CUST-6001",
        "channel": "MOBILE_APP",
        "description": "Unauthorized ATM withdrawal of Rs 20000 on 25-Feb-2026",
        "amount": 20000
    }
    resp = requests.post(
        f"{FLOWABLE_URL}/process/complaint-workflow/start",
        json=payload, timeout=10)
    data = resp.json()
    assert resp.status_code == 201
    assert data["category"] == "CARD_DISPUTE"
    assert data["sla_days"] == 7
    print(f"[PASS] Complaint created: {data['ticketId']}")
    print(f"[PASS] Auto-categorized as: {data['category']}")
    return data["processInstanceId"]

def test_sla_assignment(process_id):
    """Verify correct SLA assigned based on category"""
    resp = requests.get(
        f"{FLOWABLE_URL}/process/{process_id}/variables", timeout=10)
    variables = resp.json()
    sla = next(v for v in variables if v["name"] == "slaDays")
    assert sla["value"] == 7, "Card dispute SLA must be 7 days"
    due_date = next(v for v in variables if v["name"] == "dueDate")
    assert due_date["value"] is not None
    print(f"[PASS] SLA assigned: {sla['value']} days")
    return process_id

def test_resolution_and_feedback(process_id):
    """Complete the complaint and verify feedback collection"""
    # Complete investigation task
    tasks = requests.get(
        f"{FLOWABLE_URL}/tasks?processInstanceId={process_id}",
        timeout=10).json()
    task_id = tasks["data"][0]["id"]
    requests.post(f"{FLOWABLE_URL}/tasks/{task_id}/complete",
        json={"resolution": "REFUND_PROCESSED", "amount": 20000},
        timeout=10)
    print("[PASS] Complaint resolved: REFUND_PROCESSED")

if __name__ == "__main__":
    print("[TEST] Customer Complaint Workflow Validation")
    pid = test_complaint_creation()
    test_sla_assignment(pid)
    test_resolution_and_feedback(pid)
    print("\\nJW-018: All complaint workflow tests PASSED")`,
    expectedOutput: `[TEST] Customer Complaint Workflow Validation
[INFO] Creating complaint for CUST-6001...
[INFO] Channel: MOBILE_APP, Amount: 20000
[PASS] Complaint created: CMP-2026-00451
[PASS] Auto-categorized as: CARD_DISPUTE
[INFO] Checking SLA assignment...
[PASS] SLA assigned: 7 days (RBI mandated)
[PASS] Due date: 2026-03-06
[INFO] Processing resolution...
[PASS] Complaint resolved: REFUND_PROCESSED
[PASS] Customer feedback SMS sent
[INFO] TAT: 2 days (within 7-day SLA)
-----------------------------------------
JW-018: Customer Complaint Workflow - ALL PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'JW-019', title: 'Fixed Deposit Maturity Workflow', category: 'Workflow Engine',
    layer: 'WorkflowEngine', framework: 'Camunda BPMN / REST', language: 'Java',
    difficulty: 'Beginner',
    description: 'Tests the FD maturity processing workflow that handles auto-renewal, premature closure, partial withdrawal, and maturity proceeds credit. Validates interest calculation at maturity, TDS deduction, and Form 16A generation.',
    prerequisites: 'Camunda BPM, FD management module, Interest rate master, TDS computation engine, Form 16A template',
    config: 'CAMUNDA_URL=http://camunda.bank.local:8080/engine-rest\nFD_MODULE=http://fd.bank.local:8093\nTDS_ENGINE=http://tds.bank.local:8094\nAUTO_RENEW_DEFAULT=true\nPREMATURE_PENALTY_PCT=1.0',
    code: `@RunWith(SpringRunner.class)
@Deployment(resources = "fd-maturity.bpmn")
public class FdMaturityWorkflowTest {

    @Autowired private RuntimeService runtimeService;
    @Autowired private TaskService taskService;
    @Autowired private JdbcTemplate jdbc;

    @Test
    public void testFdAutoRenewal() {
        Map<String, Object> vars = new HashMap<>();
        vars.put("fdAccountId", "FD-7001");
        vars.put("principal", 500000);
        vars.put("rate", 7.25);
        vars.put("tenureMonths", 12);
        vars.put("maturityDate", "2026-02-27");
        vars.put("autoRenew", true);

        ProcessInstance pi = runtimeService.startProcessInstanceByKey(
            "fd-maturity-workflow", vars);

        // Interest computation task
        Task interestTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("compute-interest").singleResult();
        taskService.complete(interestTask.getId(),
            Map.of("maturityAmount", 536250.00, "interestEarned", 36250.00));

        // TDS deduction task
        Task tdsTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("tds-deduction").singleResult();
        taskService.complete(tdsTask.getId(),
            Map.of("tdsDeducted", false, "reason", "BELOW_THRESHOLD"));

        // Auto-renewal task (since autoRenew=true)
        Task renewTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("auto-renew").singleResult();
        assertNotNull("Auto-renew task must exist", renewTask);
        taskService.complete(renewTask.getId(),
            Map.of("newFdId", "FD-7001-R1", "newPrincipal", 536250.00));
        System.out.println("[PASS] FD auto-renewed: FD-7001-R1 at 536250.00");
    }

    @Test
    public void testPrematureClosure() {
        Map<String, Object> vars = Map.of(
            "fdAccountId", "FD-7002", "principal", 1000000,
            "rate", 7.50, "tenureMonths", 24,
            "maturityDate", "2026-08-27", "autoRenew", false);

        ProcessInstance pi = runtimeService.startProcessInstanceByKey(
            "fd-maturity-workflow", vars);

        Task closeTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("premature-close").singleResult();
        taskService.complete(closeTask.getId(), Map.of(
            "penaltyRate", 1.0, "effectiveRate", 6.50,
            "payoutAmount", 1032500.00));
        System.out.println("[PASS] Premature closure: penalty 1%, payout 1032500");
    }
}`,
    expectedOutput: `[TEST] Fixed Deposit Maturity Workflow Validation
[INFO] Processing FD-7001 maturity (2026-02-27)...
[INFO] Principal: 500000, Rate: 7.25%, Tenure: 12 months
[PASS] Interest earned: 36250.00
[PASS] Maturity amount: 536250.00
[INFO] TDS check: Interest 36250 below 40000 threshold
[PASS] No TDS deducted
[INFO] Auto-renewal enabled...
[PASS] FD renewed as FD-7001-R1 with principal 536250.00
[INFO] Testing premature closure (FD-7002)...
[PASS] Penalty rate: 1.0%, Effective rate: 6.50%
[PASS] Payout amount: 1032500.00
-----------------------------------------
JW-019: FD Maturity Workflow - ALL PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'JW-020', title: 'Credit Card Dispute Workflow', category: 'Workflow Engine',
    layer: 'WorkflowEngine', framework: 'Camunda BPMN / REST', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Tests the credit card transaction dispute workflow covering dispute initiation, provisional credit, merchant notification, chargeback processing (Visa/Mastercard network rules), and final resolution with customer notification.',
    prerequisites: 'Camunda BPM, Card network gateway (Visa/MC), Merchant acquirer integration, Chargeback rules engine, Provisional credit module',
    config: 'CAMUNDA_URL=http://camunda.bank.local:8080/engine-rest\nVISA_API=https://visa-dispute.bank.local:9443\nMC_API=https://mc-dispute.bank.local:9444\nPROVISIONAL_CREDIT_DAYS=10\nCHARGEBACK_WINDOW_DAYS=120',
    code: `@RunWith(SpringRunner.class)
@Deployment(resources = "card-dispute.bpmn")
public class CreditCardDisputeWorkflowTest {

    @Autowired private RuntimeService runtimeService;
    @Autowired private TaskService taskService;

    @Test
    public void testDisputeWithChargebackFlow() {
        Map<String, Object> vars = new HashMap<>();
        vars.put("cardNumber", "4111-XXXX-XXXX-9999");
        vars.put("disputedTxnId", "TXN-DISP-001");
        vars.put("disputeAmount", 15000);
        vars.put("merchantName", "Unknown Merchant");
        vars.put("disputeReason", "UNAUTHORIZED_TXN");
        vars.put("cardNetwork", "VISA");

        ProcessInstance pi = runtimeService.startProcessInstanceByKey(
            "card-dispute-workflow", vars);

        // Dispute validation
        Task validateTask = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("validate-dispute").singleResult();
        taskService.complete(validateTask.getId(),
            Map.of("valid", true, "category", "FRAUD"));

        // Provisional credit
        Task provCredit = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("provisional-credit").singleResult();
        taskService.complete(provCredit.getId(),
            Map.of("creditApplied", true, "creditAmount", 15000));
        System.out.println("[PASS] Provisional credit: 15000 applied");

        // Chargeback to merchant
        Task chargeback = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("chargeback-process").singleResult();
        taskService.complete(chargeback.getId(),
            Map.of("chargebackAccepted", true, "arn", "ARN-74839201"));

        // Final resolution
        Task resolution = taskService.createTaskQuery()
            .processInstanceId(pi.getId())
            .taskDefinitionKey("final-resolution").singleResult();
        taskService.complete(resolution.getId(),
            Map.of("outcome", "RESOLVED_CUSTOMER_FAVOR", "permanentCredit", true));
        System.out.println("[PASS] Dispute resolved in customer favor");
    }
}`,
    expectedOutput: `[TEST] Credit Card Dispute Workflow Validation
[INFO] Dispute for card 4111-XXXX-XXXX-9999...
[INFO] Disputed amount: 15000, Reason: UNAUTHORIZED_TXN
[INFO] Step 1: Dispute Validation
[PASS] Dispute valid, categorized as: FRAUD
[INFO] Step 2: Provisional Credit
[PASS] Provisional credit of 15000 applied to card
[INFO] Step 3: Chargeback Processing (VISA network)
[PASS] Chargeback accepted, ARN: ARN-74839201
[INFO] Step 4: Final Resolution
[PASS] Resolved in customer favor, permanent credit applied
[PASS] Customer notified via SMS and email
-----------------------------------------
JW-020: Credit Card Dispute Workflow - ALL PASSED
Total: 5 passed, 0 failed`
  },
  /* ====== TAB 3: Scheduler (JW-021 to JW-030) ====== */
  {
    id: 'JW-021', title: 'EOD Cron Job Scheduler', category: 'Scheduler',
    layer: 'Scheduler', framework: 'Quartz / Cron', language: 'Java',
    difficulty: 'Beginner',
    description: 'Tests the Quartz-based cron scheduler that orchestrates end-of-day batch jobs in the correct dependency sequence. Validates job chaining, failure handling, and automatic retry with exponential backoff.',
    prerequisites: 'Quartz Scheduler 2.x, Job dependency graph configuration, SMTP for failure alerts, Monitoring dashboard API',
    config: 'QUARTZ_DS=jdbc:oracle:thin:@scheddb:1521/SCHED\nEOD_CRON=0 30 18 * * ?\nMAX_RETRY=3\nBACKOFF_MULTIPLIER=2\nALERT_EMAIL=ops@bank.local',
    code: `@RunWith(SpringRunner.class)
@SpringBootTest
public class EodCronSchedulerTest {

    @Autowired private Scheduler scheduler;
    @Autowired private JdbcTemplate jdbc;

    @Test
    public void testEodJobChainExecution() throws Exception {
        // Verify EOD job chain is scheduled
        JobKey eodKey = new JobKey("eod-master", "batch-jobs");
        assertTrue("EOD master job must exist", scheduler.checkExists(eodKey));

        TriggerKey triggerKey = new TriggerKey("eod-trigger", "batch-jobs");
        CronTrigger trigger = (CronTrigger) scheduler.getTrigger(triggerKey);
        assertEquals("0 30 18 * * ?", trigger.getCronExpression());
        System.out.println("[PASS] EOD cron: 0 30 18 * * ?");

        // Manually fire the job chain
        scheduler.triggerJob(eodKey);
        Thread.sleep(5000); // Wait for chain execution

        // Verify execution order from audit log
        List<Map<String, Object>> logs = jdbc.queryForList(
            "SELECT job_name, start_time, status FROM job_audit_log " +
            "WHERE run_date = TRUNC(SYSDATE) ORDER BY start_time");
        assertTrue("At least 3 chained jobs executed", logs.size() >= 3);

        String[] expectedOrder = {"txn-validation", "settlement", "gl-posting"};
        for (int i = 0; i < expectedOrder.length; i++) {
            assertEquals(expectedOrder[i], logs.get(i).get("job_name"));
            assertEquals("COMPLETED", logs.get(i).get("status"));
        }
        System.out.println("[PASS] Job chain executed in correct order");
    }

    @Test
    public void testJobRetryOnFailure() throws Exception {
        // Simulate a failing job
        jdbc.update("UPDATE job_config SET simulate_failure = true " +
            "WHERE job_name = 'settlement'");
        scheduler.triggerJob(new JobKey("eod-master", "batch-jobs"));
        Thread.sleep(10000);

        int retries = jdbc.queryForObject(
            "SELECT retry_count FROM job_audit_log WHERE job_name = 'settlement' " +
            "AND run_date = TRUNC(SYSDATE)", Integer.class);
        assertEquals("Should retry 3 times", 3, retries);
        System.out.println("[PASS] Retry count: " + retries + " (max: 3)");
    }
}`,
    expectedOutput: `[TEST] EOD Cron Job Scheduler Validation
[INFO] Checking Quartz scheduler configuration...
[PASS] EOD cron expression: 0 30 18 * * ? (daily 6:30 PM)
[INFO] Triggering EOD job chain manually...
[INFO] Job 1: txn-validation - COMPLETED (1.2s)
[INFO] Job 2: settlement - COMPLETED (2.8s)
[INFO] Job 3: gl-posting - COMPLETED (0.9s)
[PASS] Job chain executed in correct dependency order
[INFO] Testing retry mechanism...
[INFO] Settlement job simulated failure - retry 1 (backoff: 2s)
[INFO] Settlement job simulated failure - retry 2 (backoff: 4s)
[INFO] Settlement job simulated failure - retry 3 (backoff: 8s)
[PASS] Retry count: 3 (max: 3)
-----------------------------------------
JW-021: EOD Cron Scheduler - ALL PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'JW-022', title: 'Scheduled Report Generation', category: 'Scheduler',
    layer: 'Scheduler', framework: 'Airflow / Python', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Tests the Apache Airflow DAG that generates daily, weekly, and monthly banking reports including transaction summaries, branch performance dashboards, and MIS reports. Validates report accuracy, delivery channels, and archive retention.',
    prerequisites: 'Apache Airflow 2.x, Jasper Reports server, Email/SFTP delivery, Report archive storage, Data warehouse access',
    config: 'AIRFLOW_URL=http://airflow.bank.local:8080/api/v1\nJASPER_URL=http://jasper.bank.local:8080\nREPORT_ARCHIVE=/data/reports/archive/\nSFTP_HOST=sftp.bank.local\nRETENTION_DAYS=365',
    code: `#!/usr/bin/env python3
"""JW-022: Scheduled Report Generation Test"""
import requests
import json
from datetime import datetime, timedelta

AIRFLOW_URL = "http://airflow.bank.local:8080/api/v1"
AUTH = ("airflow", "airflow_pass")

def test_daily_report_dag():
    """Verify daily report DAG is active and scheduled"""
    resp = requests.get(f"{AIRFLOW_URL}/dags/daily_reports",
        auth=AUTH, timeout=10)
    dag = resp.json()
    assert dag["is_active"] is True, "DAG must be active"
    assert dag["schedule_interval"] == "0 6 * * *"
    print("[PASS] Daily report DAG active, schedule: 0 6 * * *")

def test_report_dag_trigger():
    """Trigger daily report DAG and verify completion"""
    trigger_resp = requests.post(
        f"{AIRFLOW_URL}/dags/daily_reports/dagRuns",
        auth=AUTH, json={"conf": {"report_date": "2026-02-27"}},
        timeout=10)
    run_id = trigger_resp.json()["dag_run_id"]
    assert trigger_resp.status_code == 200

    # Poll for completion
    import time
    for attempt in range(30):
        status_resp = requests.get(
            f"{AIRFLOW_URL}/dags/daily_reports/dagRuns/{run_id}",
            auth=AUTH, timeout=10)
        state = status_resp.json()["state"]
        if state == "success":
            print(f"[PASS] DAG run completed: {run_id}")
            return run_id
        elif state == "failed":
            raise AssertionError(f"DAG run failed: {run_id}")
        time.sleep(10)
    raise TimeoutError("DAG did not complete within 5 minutes")

def test_report_output_files():
    """Verify report files were generated"""
    import os
    archive_dir = "/data/reports/archive/2026-02-27"
    expected_reports = [
        "txn_summary_20260227.pdf",
        "branch_performance_20260227.xlsx",
        "mis_daily_20260227.pdf"
    ]
    for report in expected_reports:
        path = os.path.join(archive_dir, report)
        assert os.path.exists(path), f"Report missing: {report}"
        assert os.path.getsize(path) > 0, f"Report empty: {report}"
        print(f"[PASS] Report generated: {report}")

if __name__ == "__main__":
    print("[TEST] Scheduled Report Generation Validation")
    test_daily_report_dag()
    test_report_dag_trigger()
    test_report_output_files()
    print("\\nJW-022: All scheduled report tests PASSED")`,
    expectedOutput: `[TEST] Scheduled Report Generation Validation
[INFO] Checking daily report DAG configuration...
[PASS] Daily report DAG active, schedule: 0 6 * * * (6 AM daily)
[INFO] Triggering DAG run for 2026-02-27...
[INFO] DAG run ID: manual__2026-02-27T00:00:00
[INFO] Polling for completion... (attempt 1/30)
[PASS] DAG run completed successfully
[INFO] Verifying report output files...
[PASS] Report generated: txn_summary_20260227.pdf (145 KB)
[PASS] Report generated: branch_performance_20260227.xlsx (89 KB)
[PASS] Report generated: mis_daily_20260227.pdf (210 KB)
-----------------------------------------
JW-022: Scheduled Report Generation - ALL PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'JW-023', title: 'Auto-Reconciliation Scheduler', category: 'Scheduler',
    layer: 'Scheduler', framework: 'Quartz / Spring', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Tests the automated reconciliation scheduler that runs hourly matching between core banking system and payment switch (UPI, IMPS, NEFT). Validates match accuracy, exception identification, and auto-resolution of known discrepancy patterns.',
    prerequisites: 'Quartz scheduler, CBS extract API, Payment switch DB access, Reconciliation rules, Exception queue',
    config: 'RECON_CRON=0 0 * * * ?\nCBS_EXTRACT_API=http://cbs.bank.local:8095/api/extract\nPAYMENT_SWITCH_DB=jdbc:postgresql://payswitch:5432/txndb\nMATCH_WINDOW_HOURS=24\nAUTO_RESOLVE_THRESHOLD=100',
    code: `@RunWith(SpringRunner.class)
@SpringBootTest
public class AutoReconciliationSchedulerTest {

    @Autowired private Scheduler scheduler;
    @Autowired private JdbcTemplate cbsJdbc;
    @Autowired private JdbcTemplate switchJdbc;

    @Test
    public void testReconSchedulerConfig() throws Exception {
        JobKey reconKey = new JobKey("auto-recon", "reconciliation");
        assertTrue(scheduler.checkExists(reconKey));

        CronTrigger trigger = (CronTrigger) scheduler.getTrigger(
            new TriggerKey("recon-trigger", "reconciliation"));
        assertEquals("0 0 * * * ?", trigger.getCronExpression());
        System.out.println("[PASS] Recon scheduler: hourly (0 0 * * * ?)");
    }

    @Test
    public void testCbsToSwitchMatching() throws Exception {
        // Seed CBS transaction
        cbsJdbc.update("INSERT INTO cbs_txns (ref_id, amount, type, status, txn_time) " +
            "VALUES (?, ?, ?, ?, NOW())", "UPI-REF-001", 5000.00, "UPI", "SUCCESS");
        // Seed matching switch transaction
        switchJdbc.update("INSERT INTO switch_txns (ref_id, amount, channel, status, txn_time) " +
            "VALUES (?, ?, ?, ?, NOW())", "UPI-REF-001", 5000.00, "UPI", "SUCCESS");

        // Trigger reconciliation
        scheduler.triggerJob(new JobKey("auto-recon", "reconciliation"));
        Thread.sleep(5000);

        String matchStatus = cbsJdbc.queryForObject(
            "SELECT recon_status FROM recon_results WHERE ref_id = ?",
            String.class, "UPI-REF-001");
        assertEquals("MATCHED", matchStatus);
        System.out.println("[PASS] CBS-Switch match: UPI-REF-001 MATCHED");
    }

    @Test
    public void testExceptionIdentification() throws Exception {
        // CBS has transaction, switch does not
        cbsJdbc.update("INSERT INTO cbs_txns (ref_id, amount, type, status, txn_time) " +
            "VALUES (?, ?, ?, ?, NOW())", "NEFT-REF-999", 100000.00, "NEFT", "SUCCESS");

        scheduler.triggerJob(new JobKey("auto-recon", "reconciliation"));
        Thread.sleep(5000);

        String excStatus = cbsJdbc.queryForObject(
            "SELECT recon_status FROM recon_results WHERE ref_id = ?",
            String.class, "NEFT-REF-999");
        assertEquals("EXCEPTION_CBS_ONLY", excStatus);
        System.out.println("[PASS] Exception detected: NEFT-REF-999 CBS-only");
    }
}`,
    expectedOutput: `[TEST] Auto-Reconciliation Scheduler Validation
[INFO] Checking reconciliation scheduler configuration...
[PASS] Recon scheduler: hourly (0 0 * * * ?)
[INFO] Seeding matched transaction UPI-REF-001...
[INFO] Running CBS-to-Switch matching...
[PASS] UPI-REF-001: 5000.00 UPI - MATCHED
[INFO] Testing exception identification...
[INFO] CBS entry NEFT-REF-999 has no switch match
[PASS] Exception detected: NEFT-REF-999 (CBS_ONLY)
[PASS] Exception added to review queue
[INFO] Match rate: 50% (1/2 transactions)
-----------------------------------------
JW-023: Auto-Reconciliation - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-024', title: 'Scheduled Backup Verification', category: 'Scheduler',
    layer: 'Scheduler', framework: 'Cron / Shell', language: 'Shell',
    difficulty: 'Beginner',
    description: 'Tests the scheduled database backup cron jobs that perform daily incremental and weekly full backups. Validates backup completeness, integrity checksum, restoration test, and offsite replication to DR site.',
    prerequisites: 'Oracle RMAN or pg_dump access, Backup storage (NAS/SAN), DR site connectivity, Backup verification scripts',
    config: 'BACKUP_DAILY_CRON=0 2 * * *\nBACKUP_WEEKLY_CRON=0 1 * * 0\nBACKUP_DIR=/backup/oracle/\nDR_SITE=dr-backup.bank.local\nRETENTION_DAYS=30\nCHECKSUM_ALGO=sha256',
    code: `#!/bin/bash
# JW-024: Scheduled Backup Verification Test
set -euo pipefail

BACKUP_DIR="/backup/oracle"
DR_SITE="dr-backup.bank.local"
PASS=0; FAIL=0

echo "[TEST] Scheduled Backup Verification"

# Test 1: Verify daily backup cron entry
echo "[INFO] Checking cron configuration..."
DAILY_CRON=$(crontab -l 2>/dev/null | grep "daily_backup.sh" || true)
if [ -n "\$DAILY_CRON" ]; then
    echo "[PASS] Daily backup cron exists: \$DAILY_CRON"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] Daily backup cron not found"
    FAIL=\$((FAIL + 1))
fi

# Test 2: Check latest backup file exists and is recent
LATEST_BACKUP=$(ls -t "\${BACKUP_DIR}"/incremental_*.dmp 2>/dev/null | head -1)
if [ -n "\$LATEST_BACKUP" ]; then
    BACKUP_AGE=$(( ($(date +%s) - $(stat -c %Y "\$LATEST_BACKUP")) / 3600 ))
    if [ "\$BACKUP_AGE" -lt 25 ]; then
        echo "[PASS] Latest backup: \$(basename "\$LATEST_BACKUP") (age: \${BACKUP_AGE}h)"
        PASS=\$((PASS + 1))
    else
        echo "[FAIL] Backup too old: \${BACKUP_AGE} hours"
        FAIL=\$((FAIL + 1))
    fi
else
    echo "[FAIL] No incremental backup files found"
    FAIL=\$((FAIL + 1))
fi

# Test 3: Verify checksum integrity
if [ -n "\$LATEST_BACKUP" ]; then
    STORED_SUM=$(cat "\${LATEST_BACKUP}.sha256")
    CALC_SUM=$(sha256sum "\$LATEST_BACKUP" | awk '{print \$1}')
    if [ "\$STORED_SUM" = "\$CALC_SUM" ]; then
        echo "[PASS] Checksum verified: \$CALC_SUM"
        PASS=\$((PASS + 1))
    else
        echo "[FAIL] Checksum mismatch!"
        FAIL=\$((FAIL + 1))
    fi
fi

# Test 4: Verify DR replication
DR_STATUS=$(ssh "\${DR_SITE}" "ls -t /backup/replicated/ | head -1" 2>/dev/null)
if [ -n "\$DR_STATUS" ]; then
    echo "[PASS] DR replication verified: \$DR_STATUS"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] DR replication check failed"
    FAIL=\$((FAIL + 1))
fi

echo "-----------------------------------------"
echo "JW-024: Backup Verification - \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Scheduled Backup Verification
[INFO] Checking cron configuration...
[PASS] Daily backup cron exists: 0 2 * * * /opt/scripts/daily_backup.sh
[INFO] Checking latest backup file...
[PASS] Latest backup: incremental_20260227.dmp (age: 6h)
[INFO] Verifying backup integrity...
[PASS] Checksum verified: a3f2b9c8d1e4...
[INFO] Checking DR site replication...
[PASS] DR replication verified: incremental_20260227.dmp
[INFO] Backup size: 12.4 GB, Compression: 65%
-----------------------------------------
JW-024: Backup Verification - 4 passed, 0 failed`
  },
  {
    id: 'JW-025', title: 'Dormant Account Scheduler', category: 'Scheduler',
    layer: 'Scheduler', framework: 'Quartz / Spring Batch', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Tests the scheduled job that identifies and marks dormant/inactive accounts based on RBI guidelines (no transaction for 24 months). Validates account status transition, customer notification, and unclaimed deposit reporting.',
    prerequisites: 'Account master data, Transaction history, RBI dormancy rules, Notification service, UDGAM portal integration',
    config: 'DORMANCY_CRON=0 0 3 1 * ?\nINACTIVE_MONTHS=12\nDORMANT_MONTHS=24\nUNCLAIMED_YEARS=10\nNOTIFICATION_API=http://notify.bank.local:8096\nUDGAM_API=https://udgam.rbi.org.in/api',
    code: `@RunWith(SpringRunner.class)
@SpringBootTest
public class DormantAccountSchedulerTest {

    @Autowired private Scheduler scheduler;
    @Autowired private JdbcTemplate jdbc;

    @Before
    public void seedTestAccounts() {
        // Active account (recent transaction)
        jdbc.update("INSERT INTO accounts (acct_id, status, last_txn_date) " +
            "VALUES (?, 'ACTIVE', DATE '2026-02-01')", "SA-DRM-001");
        // Should become inactive (no txn for 12+ months)
        jdbc.update("INSERT INTO accounts (acct_id, status, last_txn_date) " +
            "VALUES (?, 'ACTIVE', DATE '2024-12-01')", "SA-DRM-002");
        // Should become dormant (no txn for 24+ months)
        jdbc.update("INSERT INTO accounts (acct_id, status, last_txn_date) " +
            "VALUES (?, 'ACTIVE', DATE '2023-11-01')", "SA-DRM-003");
    }

    @Test
    public void testDormancyClassification() throws Exception {
        scheduler.triggerJob(new JobKey("dormant-sweep", "account-mgmt"));
        Thread.sleep(5000);

        String s1 = jdbc.queryForObject(
            "SELECT status FROM accounts WHERE acct_id = ?", String.class, "SA-DRM-001");
        assertEquals("ACTIVE", s1);
        System.out.println("[PASS] SA-DRM-001: ACTIVE (recent txn)");

        String s2 = jdbc.queryForObject(
            "SELECT status FROM accounts WHERE acct_id = ?", String.class, "SA-DRM-002");
        assertEquals("INACTIVE", s2);
        System.out.println("[PASS] SA-DRM-002: INACTIVE (14 months idle)");

        String s3 = jdbc.queryForObject(
            "SELECT status FROM accounts WHERE acct_id = ?", String.class, "SA-DRM-003");
        assertEquals("DORMANT", s3);
        System.out.println("[PASS] SA-DRM-003: DORMANT (27 months idle)");
    }

    @Test
    public void testNotificationTrigger() throws Exception {
        scheduler.triggerJob(new JobKey("dormant-sweep", "account-mgmt"));
        Thread.sleep(3000);
        int notifs = jdbc.queryForObject(
            "SELECT COUNT(*) FROM notification_queue WHERE template = 'DORMANCY_WARNING'",
            Integer.class);
        assertTrue("Notifications must be sent", notifs > 0);
        System.out.println("[PASS] Dormancy notifications sent: " + notifs);
    }
}`,
    expectedOutput: `[TEST] Dormant Account Scheduler Validation
[INFO] Running dormancy sweep job...
[INFO] Evaluating 3 test accounts...
[PASS] SA-DRM-001: ACTIVE (last txn: 26 days ago)
[PASS] SA-DRM-002: INACTIVE (last txn: 14 months ago)
[PASS] SA-DRM-003: DORMANT (last txn: 27 months ago)
[INFO] Testing notification triggers...
[PASS] 2 dormancy warning notifications queued
[INFO] UDGAM portal update scheduled for dormant accounts
[PASS] Account status transitions logged to audit
-----------------------------------------
JW-025: Dormant Account Scheduler - ALL PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'JW-026', title: 'Currency Rate Feed Scheduler', category: 'Scheduler',
    layer: 'Scheduler', framework: 'Cron / Python', language: 'Python',
    difficulty: 'Beginner',
    description: 'Tests the scheduled forex rate feed job that fetches exchange rates from RBI/Reuters/Bloomberg feeds every 15 minutes during market hours. Validates rate staleness checks, spread calculation, and rate card publication to channels.',
    prerequisites: 'RBI reference rate API, Reuters/Bloomberg feed credentials, Rate card publishing service, Treasury front-office system',
    config: 'RATE_FEED_CRON=*/15 8-17 * * 1-5\nRBI_RATE_API=https://rbi.org.in/api/forex/rates\nREUTERS_FEED=https://reuters.bank.local:8443/rates\nSTALENESS_MINUTES=30\nSPREAD_BPS=50',
    code: `#!/usr/bin/env python3
"""JW-026: Currency Rate Feed Scheduler Test"""
import requests
import json
from datetime import datetime, timedelta
from decimal import Decimal

RBI_API = "https://rbi.org.in/api/forex/rates"
RATE_SERVICE = "http://treasury.bank.local:8097/api/rates"
STALENESS_MIN = 30

def test_rate_feed_freshness():
    """Verify forex rates are not stale"""
    resp = requests.get(f"{RATE_SERVICE}/latest", timeout=10)
    rates = resp.json()
    last_update = datetime.fromisoformat(rates["lastUpdated"])
    age_minutes = (datetime.utcnow() - last_update).seconds / 60

    assert age_minutes < STALENESS_MIN, f"Rates stale: {age_minutes:.0f} min old"
    print(f"[PASS] Rate freshness: {age_minutes:.0f} min (max: {STALENESS_MIN})")

def test_usd_inr_rate():
    """Verify USD/INR rate within reasonable range"""
    resp = requests.get(f"{RATE_SERVICE}/pair/USD/INR", timeout=10)
    rate = resp.json()
    buy = Decimal(str(rate["buyRate"]))
    sell = Decimal(str(rate["sellRate"]))

    assert Decimal("75") < buy < Decimal("95"), f"USD buy rate out of range: {buy}"
    assert sell > buy, "Sell rate must be > buy rate"
    spread_bps = (sell - buy) / buy * 10000
    print(f"[PASS] USD/INR Buy: {buy}, Sell: {sell}, Spread: {spread_bps:.0f} bps")

def test_rbi_reference_rate():
    """Verify RBI reference rate is fetched"""
    resp = requests.get(f"{RATE_SERVICE}/rbi-reference", timeout=10)
    data = resp.json()
    assert "USD" in data["rates"], "USD reference rate must exist"
    assert "EUR" in data["rates"], "EUR reference rate must exist"
    assert "GBP" in data["rates"], "GBP reference rate must exist"
    print(f"[PASS] RBI reference rates: USD={data['rates']['USD']}, "
          f"EUR={data['rates']['EUR']}, GBP={data['rates']['GBP']}")

def test_rate_card_publication():
    """Verify rate card published to channels"""
    resp = requests.get(f"{RATE_SERVICE}/publications/latest", timeout=10)
    pub = resp.json()
    assert pub["publishedToWeb"] is True
    assert pub["publishedToMobile"] is True
    print("[PASS] Rate card published to Web and Mobile channels")

if __name__ == "__main__":
    print("[TEST] Currency Rate Feed Scheduler Validation")
    test_rate_feed_freshness()
    test_usd_inr_rate()
    test_rbi_reference_rate()
    test_rate_card_publication()
    print("\\nJW-026: All currency rate feed tests PASSED")`,
    expectedOutput: `[TEST] Currency Rate Feed Scheduler Validation
[INFO] Checking rate feed freshness...
[PASS] Rate freshness: 12 min (max: 30)
[INFO] Validating USD/INR rates...
[PASS] USD/INR Buy: 83.45, Sell: 83.95, Spread: 60 bps
[INFO] Fetching RBI reference rates...
[PASS] RBI reference rates: USD=83.62, EUR=90.15, GBP=106.30
[INFO] Checking rate card publication...
[PASS] Rate card published to Web and Mobile channels
-----------------------------------------
JW-026: Currency Rate Feed - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-027', title: 'SLA Monitoring Timer Jobs', category: 'Scheduler',
    layer: 'Scheduler', framework: 'Quartz / Spring', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Tests the SLA monitoring timer jobs that track service delivery timelines for loan processing, complaint resolution, and account opening. Validates escalation triggers when SLA breaches are imminent (80% threshold) or confirmed.',
    prerequisites: 'Quartz scheduler, SLA configuration master, Escalation matrix, Manager notification system, Dashboard API',
    config: 'SLA_CHECK_CRON=0 */30 * * * ?\nSLA_WARNING_PCT=80\nESCALATION_MATRIX=/config/escalation_matrix.json\nDASHBOARD_API=http://dashboard.bank.local:8098\nNOTIFY_API=http://notify.bank.local:8096',
    code: `@RunWith(SpringRunner.class)
@SpringBootTest
public class SlaMonitoringTimerTest {

    @Autowired private Scheduler scheduler;
    @Autowired private JdbcTemplate jdbc;

    @Before
    public void seedSlaData() {
        // Loan application within SLA
        jdbc.update("INSERT INTO sla_tracker (request_id, type, sla_hours, " +
            "created_at, status) VALUES (?, ?, ?, NOW() - INTERVAL '20' HOUR, ?)",
            "LOAN-SLA-001", "PERSONAL_LOAN", 48, "IN_PROGRESS");
        // Loan application near SLA breach (80%+)
        jdbc.update("INSERT INTO sla_tracker (request_id, type, sla_hours, " +
            "created_at, status) VALUES (?, ?, ?, NOW() - INTERVAL '40' HOUR, ?)",
            "LOAN-SLA-002", "PERSONAL_LOAN", 48, "IN_PROGRESS");
        // Complaint past SLA
        jdbc.update("INSERT INTO sla_tracker (request_id, type, sla_hours, " +
            "created_at, status) VALUES (?, ?, ?, NOW() - INTERVAL '180' HOUR, ?)",
            "CMP-SLA-003", "CARD_DISPUTE", 168, "IN_PROGRESS");
    }

    @Test
    public void testSlaStatusComputation() throws Exception {
        scheduler.triggerJob(new JobKey("sla-monitor", "sla-jobs"));
        Thread.sleep(3000);

        String status1 = jdbc.queryForObject(
            "SELECT sla_status FROM sla_tracker WHERE request_id = ?",
            String.class, "LOAN-SLA-001");
        assertEquals("ON_TRACK", status1);

        String status2 = jdbc.queryForObject(
            "SELECT sla_status FROM sla_tracker WHERE request_id = ?",
            String.class, "LOAN-SLA-002");
        assertEquals("AT_RISK", status2);

        String status3 = jdbc.queryForObject(
            "SELECT sla_status FROM sla_tracker WHERE request_id = ?",
            String.class, "CMP-SLA-003");
        assertEquals("BREACHED", status3);

        System.out.println("[PASS] SLA statuses computed correctly");
    }

    @Test
    public void testEscalationTrigger() throws Exception {
        scheduler.triggerJob(new JobKey("sla-monitor", "sla-jobs"));
        Thread.sleep(3000);

        int escalations = jdbc.queryForObject(
            "SELECT COUNT(*) FROM escalation_log WHERE trigger_date = CURRENT_DATE",
            Integer.class);
        assertTrue("Escalations must be triggered", escalations > 0);
        System.out.println("[PASS] Escalations triggered: " + escalations);
    }
}`,
    expectedOutput: `[TEST] SLA Monitoring Timer Validation
[INFO] Running SLA monitoring job...
[INFO] Evaluating 3 tracked requests...
[PASS] LOAN-SLA-001: ON_TRACK (42% of SLA consumed)
[PASS] LOAN-SLA-002: AT_RISK (83% of SLA consumed)
[PASS] CMP-SLA-003: BREACHED (107% of SLA consumed)
[INFO] Checking escalation triggers...
[PASS] 2 escalations triggered (AT_RISK + BREACHED)
[INFO] Manager notification sent for LOAN-SLA-002
[INFO] Senior manager notification sent for CMP-SLA-003
-----------------------------------------
JW-027: SLA Monitoring Timer - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-028', title: 'Penalty Interest Scheduler', category: 'Scheduler',
    layer: 'Scheduler', framework: 'Quartz / Spring Batch', language: 'Java',
    difficulty: 'Advanced',
    description: 'Tests the daily penalty interest calculation scheduler for overdue loan EMIs, credit card minimum due defaults, and cheque bounce charges. Validates penal rate application, compounding rules, and waiver eligibility check.',
    prerequisites: 'Loan management system, Credit card system, Penal interest rate master, Waiver rules engine, Customer communication API',
    config: 'PENALTY_CRON=0 0 1 * * ?\nPENAL_RATE_LOAN=2.0\nPENAL_RATE_CARD=3.5\nWAIVER_ELIGIBLE_DAYS=7\nCOMPOUND=DAILY\nMAX_PENAL_MONTHS=6',
    code: `@RunWith(SpringRunner.class)
@SpringBootTest
public class PenaltyInterestSchedulerTest {

    @Autowired private Scheduler scheduler;
    @Autowired private JdbcTemplate jdbc;

    @Before
    public void seedOverdueAccounts() {
        // Loan EMI overdue by 30 days
        jdbc.update("INSERT INTO overdue_tracker (acct_id, type, overdue_amount, " +
            "due_date, penal_rate) VALUES (?, ?, ?, DATE '2026-01-27', ?)",
            "LN-PEN-001", "LOAN_EMI", 25000.00, 2.0);
        // Credit card min due overdue by 15 days
        jdbc.update("INSERT INTO overdue_tracker (acct_id, type, overdue_amount, " +
            "due_date, penal_rate) VALUES (?, ?, ?, DATE '2026-02-12', ?)",
            "CC-PEN-002", "CARD_MIN_DUE", 5000.00, 3.5);
    }

    @Test
    public void testPenaltyCalculation() throws Exception {
        scheduler.triggerJob(new JobKey("penalty-calc", "interest-jobs"));
        Thread.sleep(5000);

        // Loan penalty: 25000 * 2.0% * 30/365 = 41.10
        BigDecimal loanPenalty = jdbc.queryForObject(
            "SELECT penal_interest FROM overdue_tracker WHERE acct_id = ?",
            BigDecimal.class, "LN-PEN-001");
        assertTrue("Loan penalty must be > 0",
            loanPenalty.compareTo(BigDecimal.ZERO) > 0);
        System.out.println("[PASS] Loan penalty interest: " + loanPenalty);

        // Card penalty: 5000 * 3.5% * 15/365 = 7.19
        BigDecimal cardPenalty = jdbc.queryForObject(
            "SELECT penal_interest FROM overdue_tracker WHERE acct_id = ?",
            BigDecimal.class, "CC-PEN-002");
        assertTrue("Card penalty must be > 0",
            cardPenalty.compareTo(BigDecimal.ZERO) > 0);
        System.out.println("[PASS] Card penalty interest: " + cardPenalty);
    }

    @Test
    public void testWaiverEligibility() throws Exception {
        // Account overdue by only 5 days (within 7-day waiver window)
        jdbc.update("INSERT INTO overdue_tracker (acct_id, type, overdue_amount, " +
            "due_date, penal_rate) VALUES (?, ?, ?, DATE '2026-02-22', ?)",
            "LN-PEN-003", "LOAN_EMI", 15000.00, 2.0);

        scheduler.triggerJob(new JobKey("penalty-calc", "interest-jobs"));
        Thread.sleep(3000);

        Boolean waiver = jdbc.queryForObject(
            "SELECT waiver_eligible FROM overdue_tracker WHERE acct_id = ?",
            Boolean.class, "LN-PEN-003");
        assertTrue("5-day overdue should be waiver eligible", waiver);
        System.out.println("[PASS] Waiver eligible for 5-day overdue");
    }
}`,
    expectedOutput: `[TEST] Penalty Interest Scheduler Validation
[INFO] Running penalty interest calculation...
[INFO] Processing 2 overdue accounts...
[INFO] LN-PEN-001: 25000.00 overdue 30 days at 2.0% p.a.
[PASS] Loan penalty interest: 41.10
[INFO] CC-PEN-002: 5000.00 overdue 15 days at 3.5% p.a.
[PASS] Card penalty interest: 7.19
[INFO] Testing waiver eligibility...
[INFO] LN-PEN-003: 5 days overdue (waiver window: 7 days)
[PASS] Waiver eligible for 5-day overdue
[PASS] Penalty posted to customer accounts
-----------------------------------------
JW-028: Penalty Interest Scheduler - ALL PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'JW-029', title: 'Audit Log Rotation Scheduler', category: 'Scheduler',
    layer: 'Scheduler', framework: 'Cron / Shell', language: 'Shell',
    difficulty: 'Beginner',
    description: 'Tests the scheduled audit log rotation and archival job that compresses logs older than 30 days, moves them to cold storage, and purges entries beyond the retention period. Validates compliance with 7-year retention mandate.',
    prerequisites: 'Log storage filesystem, Cold storage (S3/NAS), Compression utilities, Retention policy configuration',
    config: 'LOG_ROTATE_CRON=0 4 * * *\nHOT_RETENTION_DAYS=30\nCOLD_RETENTION_YEARS=7\nCOLD_STORAGE=s3://bank-audit-archive/\nCOMPRESS_ALGO=zstd\nLOG_DIR=/var/log/banking/',
    code: `#!/bin/bash
# JW-029: Audit Log Rotation Scheduler Test
set -euo pipefail

LOG_DIR="/var/log/banking"
COLD_STORAGE="s3://bank-audit-archive"
HOT_DAYS=30
PASS=0; FAIL=0

echo "[TEST] Audit Log Rotation Scheduler Validation"

# Test 1: Verify cron entry exists
ROTATE_CRON=$(crontab -l 2>/dev/null | grep "log_rotation.sh" || true)
if [ -n "\$ROTATE_CRON" ]; then
    echo "[PASS] Log rotation cron configured: \$ROTATE_CRON"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] Log rotation cron not found"
    FAIL=\$((FAIL + 1))
fi

# Test 2: Check no uncompressed logs older than 30 days
OLD_LOGS=$(find "\${LOG_DIR}" -name "*.log" -mtime +\${HOT_DAYS} 2>/dev/null | wc -l)
if [ "\$OLD_LOGS" -eq 0 ]; then
    echo "[PASS] No uncompressed logs older than \${HOT_DAYS} days"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] Found \$OLD_LOGS uncompressed old log files"
    FAIL=\$((FAIL + 1))
fi

# Test 3: Verify compressed archives exist
ARCHIVES=$(find "\${LOG_DIR}/archive" -name "*.zst" 2>/dev/null | wc -l)
if [ "\$ARCHIVES" -gt 0 ]; then
    echo "[PASS] Compressed archives found: \$ARCHIVES files"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] No compressed archives found"
    FAIL=\$((FAIL + 1))
fi

# Test 4: Verify S3 cold storage upload
LATEST_S3=$(aws s3 ls "\${COLD_STORAGE}" --recursive | sort | tail -1)
if [ -n "\$LATEST_S3" ]; then
    echo "[PASS] Cold storage latest: \$LATEST_S3"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] No files in cold storage"
    FAIL=\$((FAIL + 1))
fi

# Test 5: Verify 7-year retention compliance
OLDEST_ARCHIVE=$(aws s3 ls "\${COLD_STORAGE}" --recursive | sort | head -1)
if [ -n "\$OLDEST_ARCHIVE" ]; then
    echo "[PASS] Oldest archive: \$OLDEST_ARCHIVE (7-year retention)"
    PASS=\$((PASS + 1))
else
    echo "[INFO] No historical archives to verify retention"
    PASS=\$((PASS + 1))
fi

echo "-----------------------------------------"
echo "JW-029: Log Rotation - \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Audit Log Rotation Scheduler Validation
[INFO] Checking cron configuration...
[PASS] Log rotation cron configured: 0 4 * * * /opt/scripts/log_rotation.sh
[INFO] Checking hot storage for old logs...
[PASS] No uncompressed logs older than 30 days
[INFO] Checking compressed archives...
[PASS] Compressed archives found: 145 files
[INFO] Checking cold storage (S3)...
[PASS] Cold storage latest: 2026-02-27 audit_20260126.zst
[PASS] Oldest archive: 2019-03-01 (7-year retention compliant)
-----------------------------------------
JW-029: Log Rotation - 5 passed, 0 failed`
  },
  {
    id: 'JW-030', title: 'Scheduled Limit Reset Job', category: 'Scheduler',
    layer: 'Scheduler', framework: 'Quartz / Spring', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Tests the daily/monthly limit reset scheduler for transaction limits (daily ATM withdrawal, UPI per-transaction, NEFT daily cap). Validates correct reset timing, carry-forward rules, and VIP customer enhanced limits.',
    prerequisites: 'Limit management module, Customer tier configuration, Transaction limit master, Limit utilization tracker',
    config: 'DAILY_RESET_CRON=0 0 0 * * ?\nMONTHLY_RESET_CRON=0 0 0 1 * ?\nDEFAULT_ATM_DAILY=50000\nDEFAULT_UPI_TXN=100000\nVIP_MULTIPLIER=5',
    code: `@RunWith(SpringRunner.class)
@SpringBootTest
public class LimitResetSchedulerTest {

    @Autowired private Scheduler scheduler;
    @Autowired private JdbcTemplate jdbc;

    @Before
    public void seedLimitData() {
        // Regular customer with partially used daily limit
        jdbc.update("INSERT INTO limit_tracker (acct_id, limit_type, " +
            "daily_limit, utilized, customer_tier) VALUES (?, ?, ?, ?, ?)",
            "SA-LIM-001", "ATM_WITHDRAWAL", 50000, 35000, "REGULAR");
        // VIP customer
        jdbc.update("INSERT INTO limit_tracker (acct_id, limit_type, " +
            "daily_limit, utilized, customer_tier) VALUES (?, ?, ?, ?, ?)",
            "SA-LIM-002", "ATM_WITHDRAWAL", 250000, 100000, "VIP");
        // UPI limit
        jdbc.update("INSERT INTO limit_tracker (acct_id, limit_type, " +
            "daily_limit, utilized, customer_tier) VALUES (?, ?, ?, ?, ?)",
            "SA-LIM-001", "UPI_DAILY", 100000, 80000, "REGULAR");
    }

    @Test
    public void testDailyLimitReset() throws Exception {
        scheduler.triggerJob(new JobKey("daily-limit-reset", "limit-jobs"));
        Thread.sleep(3000);

        int utilized1 = jdbc.queryForObject(
            "SELECT utilized FROM limit_tracker WHERE acct_id = ? AND limit_type = ?",
            Integer.class, "SA-LIM-001", "ATM_WITHDRAWAL");
        assertEquals("Daily limit must reset to 0", 0, utilized1);
        System.out.println("[PASS] SA-LIM-001 ATM utilized reset: 0");

        int utilized2 = jdbc.queryForObject(
            "SELECT utilized FROM limit_tracker WHERE acct_id = ? AND limit_type = ?",
            Integer.class, "SA-LIM-002", "ATM_WITHDRAWAL");
        assertEquals("VIP limit must reset to 0", 0, utilized2);
        System.out.println("[PASS] SA-LIM-002 VIP ATM utilized reset: 0");

        int upiUtil = jdbc.queryForObject(
            "SELECT utilized FROM limit_tracker WHERE acct_id = ? AND limit_type = ?",
            Integer.class, "SA-LIM-001", "UPI_DAILY");
        assertEquals("UPI daily limit must reset", 0, upiUtil);
        System.out.println("[PASS] SA-LIM-001 UPI utilized reset: 0");
    }

    @Test
    public void testVipEnhancedLimits() throws Exception {
        int vipLimit = jdbc.queryForObject(
            "SELECT daily_limit FROM limit_tracker WHERE acct_id = ? AND limit_type = ?",
            Integer.class, "SA-LIM-002", "ATM_WITHDRAWAL");
        assertEquals("VIP limit = 5x regular", 250000, vipLimit);
        System.out.println("[PASS] VIP enhanced limit: " + vipLimit);
    }
}`,
    expectedOutput: `[TEST] Scheduled Limit Reset Job Validation
[INFO] Running daily limit reset job...
[INFO] Processing 3 limit entries...
[PASS] SA-LIM-001 ATM_WITHDRAWAL: 35000 -> 0 (reset)
[PASS] SA-LIM-002 ATM_WITHDRAWAL: 100000 -> 0 (reset)
[PASS] SA-LIM-001 UPI_DAILY: 80000 -> 0 (reset)
[INFO] Verifying VIP enhanced limits...
[PASS] VIP ATM limit: 250000 (5x regular 50000)
[INFO] Limit reset audit log updated
-----------------------------------------
JW-030: Limit Reset Job - ALL PASSED
Total: 4 passed, 0 failed`
  },
];

export default function JobWorkflowLab() {
  const [tab, setTab] = useState('BatchJobs');
  const [sel, setSel] = useState(SCENARIOS[0]);
  const [search, setSearch] = useState('');
  const [diffF, setDiffF] = useState('All');
  const [statuses, setStatuses] = useState({});
  const [code, setCode] = useState(SCENARIOS[0].code);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [progress, setProgress] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const timerRef = useRef(null);

  const filtered = SCENARIOS.filter(s => {
    if (s.layer !== tab) return false;
    if (diffF !== 'All' && s.difficulty !== diffF) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pick = useCallback((s) => { setSel(s); setCode(s.code); setOutput(''); setProgress(0); setRunning(false); }, []);

  const runSim = useCallback(() => {
    if (running) return;
    setRunning(true); setOutput(''); setProgress(0);
    const lines = sel.expectedOutput.split('\n');
    let i = 0;
    timerRef.current = setInterval(() => {
      if (i < lines.length) {
        setOutput(prev => prev + (prev ? '\n' : '') + lines[i]);
        setProgress(Math.round(((i + 1) / lines.length) * 100));
        i++;
      } else { clearInterval(timerRef.current); setRunning(false); setStatuses(prev => ({ ...prev, [sel.id]: 'passed' })); }
    }, 150);
  }, [sel, running]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const totalTab = SCENARIOS.filter(s => s.layer === tab).length;
  const passedTab = SCENARIOS.filter(s => s.layer === tab && statuses[s.id] === 'passed').length;
  const totalAll = SCENARIOS.length;
  const passedAll = Object.values(statuses).filter(v => v === 'passed').length;
  const copy = () => { navigator.clipboard?.writeText(code); };
  const reset = () => { setCode(sel.code); };

  const sty = {
    page: { minHeight: '100vh', background: `linear-gradient(135deg,${C.bgFrom} 0%,${C.bgTo} 100%)`, color: C.text, fontFamily: "'Segoe UI',Tahoma,Geneva,Verdana,sans-serif", padding: '18px 22px 40px' },
    h1: { fontSize: 28, fontWeight: 800, margin: 0, background: `linear-gradient(90deg,${C.accent},#3498db)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    sub: { fontSize: 13, color: C.muted, marginTop: 4 },
    statsBar: { display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 14, flexWrap: 'wrap' },
    stat: { background: C.card, borderRadius: 8, padding: '6px 18px', fontSize: 13, border: `1px solid ${C.border}` },
    split: { display: 'flex', gap: 16, height: 'calc(100vh - 160px)', minHeight: 500 },
    left: { width: '38%', minWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 },
    right: { flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' },
    tabBar: { display: 'flex', gap: 4, flexWrap: 'wrap' },
    tabBtn: (a) => ({ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: a ? C.accent : C.card, color: a ? '#0a0a1a' : C.text }),
    filterRow: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
    input: { flex: 1, padding: '7px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.editorBg, color: C.text, fontSize: 13, outline: 'none', minWidth: 120 },
    select: { padding: '6px 8px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.editorBg, color: C.text, fontSize: 12, outline: 'none' },
    list: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 4 },
    card: (a) => ({ padding: '10px 14px', borderRadius: 8, background: a ? C.cardHover : C.card, border: `1px solid ${a ? C.accent : C.border}`, cursor: 'pointer' }),
    cardTitle: { fontSize: 13, fontWeight: 700, color: C.header },
    cardId: { fontSize: 11, color: C.accent, marginRight: 8 },
    badge: (c) => ({ display: 'inline-block', padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: c + '22', color: c, marginRight: 4 }),
    dot: (st) => ({ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: st === 'passed' ? C.accent : C.muted, marginRight: 6 }),
    panel: { background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: 16, overflowY: 'auto' },
    editor: { width: '100%', minHeight: 200, maxHeight: 280, padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, background: C.editorBg, color: C.editorText, fontFamily: "'Fira Code','Consolas',monospace", fontSize: 12, lineHeight: 1.6, resize: 'vertical', outline: 'none', whiteSpace: 'pre', overflowX: 'auto' },
    btn: (bg) => ({ padding: '7px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: bg || C.accent, color: (bg === C.danger || bg === '#555') ? '#fff' : '#0a0a1a' }),
    outBox: { background: C.editorBg, borderRadius: 8, border: `1px solid ${C.border}`, padding: 12, fontFamily: "'Fira Code','Consolas',monospace", fontSize: 11, color: C.accent, lineHeight: 1.7, whiteSpace: 'pre-wrap', minHeight: 60, maxHeight: 180, overflowY: 'auto' },
    progBar: { height: 4, borderRadius: 2, background: '#0a2744', marginTop: 6 },
    progFill: (p) => ({ height: '100%', borderRadius: 2, width: p + '%', background: p === 100 ? C.accent : '#3498db', transition: 'width 0.3s' }),
    progOverall: { height: 6, borderRadius: 3, background: '#0a2744', marginBottom: 8 },
    progOverFill: (p) => ({ height: '100%', borderRadius: 3, width: p + '%', background: `linear-gradient(90deg,${C.accent},#3498db)`, transition: 'width 0.4s' }),
    cfgBox: { background: C.editorBg, borderRadius: 8, border: `1px solid ${C.border}`, padding: 12, marginTop: 8, fontSize: 12, lineHeight: 1.6, color: C.warn, fontFamily: "'Fira Code','Consolas',monospace", whiteSpace: 'pre-wrap' },
  };

  return (
    <div style={sty.page}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h1 style={sty.h1}>Job & Workflow Testing Lab</h1>
        <div style={sty.sub}>Banking Batch Jobs, Workflows, Schedulers, ETL & Event-Driven Testing — {totalAll} Scenarios</div>
      </div>
      <div style={sty.statsBar}>
        <span style={sty.stat}>Total: <b style={{color:C.accent}}>{totalAll}</b></span>
        <span style={sty.stat}>Passed: <b style={{color:C.accent}}>{passedAll}</b>/{totalAll}</span>
        <span style={sty.stat}>Tab: <b style={{color:C.accent}}>{passedTab}</b>/{totalTab}</span>
        <span style={sty.stat}>Coverage: <b style={{color:C.accent}}>{totalAll > 0 ? Math.round((passedAll/totalAll)*100) : 0}%</b></span>
      </div>
      <div style={sty.split}>
        <div style={sty.left}>
          <div style={sty.tabBar}>
            {TABS.map(t => <button key={t.key} style={sty.tabBtn(tab === t.key)} onClick={() => setTab(t.key)}>{t.label}</button>)}
          </div>
          <div style={sty.filterRow}>
            <input style={sty.input} placeholder="Search scenarios..." value={search} onChange={e => setSearch(e.target.value)} />
            <select style={sty.select} value={diffF} onChange={e => setDiffF(e.target.value)}>
              {['All', ...DIFF].map(d => <option key={d} value={d}>{d === 'All' ? 'Difficulty' : d}</option>)}
            </select>
          </div>
          <div style={sty.progOverall}><div style={sty.progOverFill(totalTab > 0 ? Math.round((passedTab/totalTab)*100) : 0)} /></div>
          <div style={sty.list}>
            {filtered.length === 0 && <div style={{color:C.muted,textAlign:'center',padding:20}}>No scenarios match</div>}
            {filtered.map(s => (
              <div key={s.id} style={sty.card(sel.id === s.id)} onClick={() => pick(s)}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={sty.dot(statuses[s.id])} />
                  <span style={sty.cardId}>{s.id}</span>
                  <span style={sty.cardTitle}>{s.title}</span>
                </div>
                <div style={{marginTop:4}}>
                  <span style={sty.badge(TAB_COLORS[s.layer] || C.accent)}>{s.layer}</span>
                  <span style={sty.badge(DIFF_COLORS[s.difficulty])}>{s.difficulty}</span>
                  <span style={sty.badge('#3498db')}>{s.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={sty.right}>
          <div style={{...sty.panel, flex: '0 0 auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div><span style={{fontSize:14,fontWeight:800,color:C.accent,marginRight:10}}>{sel.id}</span><span style={{fontSize:16,fontWeight:700,color:C.header}}>{sel.title}</span></div>
              <div>
                <span style={sty.badge(TAB_COLORS[sel.layer] || C.accent)}>{sel.layer}</span>
                <span style={sty.badge(DIFF_COLORS[sel.difficulty])}>{sel.difficulty}</span>
                <span style={sty.badge('#f1c40f')}>{sel.language}</span>
              </div>
            </div>
            <div style={{fontSize:12,color:C.muted,marginBottom:10,lineHeight:1.5}}>{sel.description}</div>
            <div style={{fontSize:11,color:C.muted}}><b>Prerequisites:</b> {sel.prerequisites}</div>
          </div>
          <div style={{...sty.panel, flex: 1, display:'flex', flexDirection:'column', gap:10, overflow:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Test Script — {sel.framework}</span>
              <div style={{display:'flex',gap:6}}>
                <button style={sty.btn()} onClick={copy}>Copy</button>
                <button style={sty.btn('#555')} onClick={reset}>Reset</button>
              </div>
            </div>
            <textarea style={sty.editor} value={code} onChange={e => setCode(e.target.value)} spellCheck={false} />
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Expected Output</span>
              <span style={{fontSize:11,color:C.muted}}>{sel.language}</span>
            </div>
            <div style={sty.outBox}>{sel.expectedOutput}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button style={{...sty.btn(running ? '#555' : C.accent),opacity:running?0.6:1}} onClick={runSim} disabled={running}>{running ? 'Running...' : 'Run Test'}</button>
              {statuses[sel.id] === 'passed' && <span style={{color:C.accent,fontSize:12,fontWeight:700}}>PASSED</span>}
              {progress > 0 && progress < 100 && <span style={{color:'#3498db',fontSize:11}}>{progress}%</span>}
              <button style={{...sty.btn('#3498db'),marginLeft:'auto'}} onClick={() => setShowConfig(!showConfig)}>{showConfig ? 'Hide' : 'Show'} Config</button>
            </div>
            {(running || output) && (
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.header,marginBottom:4}}>Execution Output</div>
                <div style={sty.outBox}>{output || 'Starting...'}</div>
                <div style={sty.progBar}><div style={sty.progFill(progress)} /></div>
              </div>
            )}
            {showConfig && <div style={sty.cfgBox}><div style={{fontWeight:700,color:C.accent,marginBottom:6}}>Configuration</div><div>{sel.config}</div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12' };

const TABS = [
  { key:'UiPath', label:'UiPath Bots' },
  { key:'AutomationAnywhere', label:'Automation Anywhere' },
  { key:'BotTesting', label:'Bot Testing' },
  { key:'OCRDocument', label:'OCR/Documents' },
  { key:'ProcessMining', label:'Process Mining' },
  { key:'IntelligentAuto', label:'Intelligent Auto' },
];
const DIFF = ['Beginner','Intermediate','Advanced'];
const DC = { Beginner:'#2ecc71', Intermediate:'#f39c12', Advanced:'#e74c3c' };
const TC = { UiPath:'#e74c3c', AutomationAnywhere:'#3498db', BotTesting:'#9b59b6', OCRDocument:'#2ecc71', ProcessMining:'#e67e22', IntelligentAuto:'#1abc9c' };

const S = [
  {id:'RP-001',title:'Account Opening Bot Workflow',layer:'UiPath',framework:'UiPath Studio / Test Suite',language:'C#',difficulty:'Intermediate',
   description:'Validates the UiPath bot workflow for automated bank account opening including form filling, document upload, KYC data extraction, and core banking system integration via attended automation.',
   prerequisites:'UiPath Studio 2024.x, UiPath Orchestrator, Core banking test environment, Test customer documents',
   config:'ORCHESTRATOR_URL=https://orchestrator.bank.local\nTENANT=BankingOps\nBOT_PROCESS=AccountOpening_v3\nCORE_BANKING_API=https://cbs.bank.local:8443/api/v2\nMAX_EXECUTION_TIME=120',
   code:`[TestMethod]
public void TestAccountOpeningBotWorkflow()
{
    var orchestrator = new OrchestratorClient(
        "https://orchestrator.bank.local", "BankingOps");
    var jobInput = new Dictionary<string, object>
    {
        { "CustomerName", "Rajesh Kumar" },
        { "PAN", "ABCPK1234F" },
        { "Aadhaar", "1234-5678-9012" },
        { "AccountType", "Savings" },
        { "Branch", "MUM001" }
    };

    // Start bot process
    var job = orchestrator.StartJob("AccountOpening_v3", jobInput);
    Assert.IsNotNull(job.JobId, "Bot job should be created");
    Assert.AreEqual("Running", job.Status);

    // Wait for completion with timeout
    var result = orchestrator.WaitForCompletion(job.JobId, 120);
    Assert.AreEqual("Successful", result.Status);

    // Verify account created in core banking
    var accountId = result.OutputArgs["AccountId"].ToString();
    Assert.IsFalse(string.IsNullOrEmpty(accountId));

    var cbsClient = new HttpClient();
    var resp = cbsClient.GetAsync(
        \$"https://cbs.bank.local:8443/api/v2/accounts/{accountId}")
        .Result;
    Assert.AreEqual(200, (int)resp.StatusCode);

    var account = JsonConvert.DeserializeObject<AccountDto>(
        resp.Content.ReadAsStringAsync().Result);
    Assert.AreEqual("Rajesh Kumar", account.CustomerName);
    Assert.AreEqual("Savings", account.AccountType);
    Assert.AreEqual("Active", account.Status);
}`,
   expectedOutput:`[TEST] RP-001: Account Opening Bot Workflow
[INFO] Connecting to Orchestrator: https://orchestrator.bank.local
[PASS] Bot job created: JOB-AO-20260227-001
[INFO] Process: AccountOpening_v3, Robot: BOT-MUM-01
[PASS] Bot status: Running → form filling in progress
[PASS] KYC data extracted: PAN verified, Aadhaar validated
[PASS] Document upload completed: 3 documents attached
[PASS] Bot completed in 47.3 seconds (limit: 120s)
[PASS] Account created: ACC-MUM001-98765
[PASS] Account status: Active, Type: Savings
[INFO] Core banking sync confirmed
───────────────────────────────────
RP-001: Account Opening Bot — 7 passed, 0 failed`},

  {id:'RP-002',title:'KYC Verification Bot Pipeline',layer:'UiPath',framework:'UiPath Studio / REFramework',language:'C#',difficulty:'Advanced',
   description:'Tests the UiPath REFramework-based KYC verification bot that processes customer verification requests from a queue, validates documents against government APIs, and updates compliance status.',
   prerequisites:'UiPath Orchestrator with Queue configured, Government API mock, Compliance database',
   config:'ORCHESTRATOR_URL=https://orchestrator.bank.local\nQUEUE_NAME=KYC_Verification_Queue\nGOV_API=https://gov-verify.mock.local/api/v1\nCOMPLIANCE_DB=postgresql://compliance:pass@db.local/kyc\nRETRY_COUNT=3',
   code:`[TestMethod]
public void TestKYCVerificationBotPipeline()
{
    var orchestrator = new OrchestratorClient(
        "https://orchestrator.bank.local", "BankingOps");

    // Add test items to queue
    var queueItems = new[]
    {
        new QueueItem { Reference = "KYC-001",
            SpecificContent = new { CustomerId = "CUST001",
                DocType = "PAN", DocNumber = "ABCPK1234F" } },
        new QueueItem { Reference = "KYC-002",
            SpecificContent = new { CustomerId = "CUST002",
                DocType = "Aadhaar", DocNumber = "9876-5432-1098" } }
    };
    foreach (var item in queueItems)
        orchestrator.AddQueueItem("KYC_Verification_Queue", item);

    // Start REFramework process
    var job = orchestrator.StartJob("KYC_REFramework_v2");
    var result = orchestrator.WaitForCompletion(job.JobId, 180);
    Assert.AreEqual("Successful", result.Status);

    // Verify queue items processed
    var processed = orchestrator.GetQueueItems(
        "KYC_Verification_Queue", "Successful");
    Assert.AreEqual(2, processed.Count);

    // Verify compliance status updated
    var compClient = new HttpClient();
    var r1 = compClient.GetAsync(
        "https://cbs.bank.local:8443/api/v2/kyc/CUST001").Result;
    Assert.AreEqual("VERIFIED",
        JObject.Parse(r1.Content.ReadAsStringAsync().Result)
            ["kyc_status"].ToString());
}`,
   expectedOutput:`[TEST] RP-002: KYC Verification Bot Pipeline
[INFO] Queue: KYC_Verification_Queue — 2 items added
[PASS] REFramework bot started: JOB-KYC-20260227-001
[PASS] Transaction KYC-001: PAN ABCPK1234F verified via gov API
[INFO] Gov API response: 200 OK, match_score: 0.99
[PASS] Transaction KYC-002: Aadhaar validated via UIDAI mock
[PASS] Queue: 2/2 items processed successfully
[PASS] CUST001 compliance status: VERIFIED
[PASS] CUST002 compliance status: VERIFIED
[INFO] Processing time: 62.1s (avg 31.0s per item)
[INFO] Retry count: 0 (no failures)
───────────────────────────────────
RP-002: KYC Verification Bot — 6 passed, 0 failed`},

  {id:'RP-003',title:'Payment Processing Bot Automation',layer:'AutomationAnywhere',framework:'Automation Anywhere A360',language:'Python',difficulty:'Intermediate',
   description:'Validates the Automation Anywhere A360 bot for automated payment processing including NEFT/RTGS/IMPS routing, amount validation, beneficiary verification, and transaction status tracking.',
   prerequisites:'AA Control Room A360, Payment gateway test environment, Core banking sandbox',
   config:'CONTROL_ROOM=https://aa-cr.bank.local\nBOT_ID=PAY_PROCESSOR_v4\nPAYMENT_GW=https://payment.bank.local:8443/api/v2\nNEFT_LIMIT=200000\nRTGS_MIN=200001\nIMPS_LIMIT=500000',
   code:`import requests
import unittest
import time

class TestPaymentProcessingBot(unittest.TestCase):
    CR_URL = "https://aa-cr.bank.local/api/v3"
    AUTH = {"Authorization": "Bearer aa_test_token_xyz"}

    def test_payment_bot_neft_routing(self):
        """Test NEFT payment routing for amounts <= 2L"""
        payload = {
            "botId": "PAY_PROCESSOR_v4",
            "inputVariables": {
                "PayerAccount": "ACC001",
                "BeneficiaryAccount": "ACC002",
                "Amount": 150000,
                "BeneficiaryIFSC": "SBIN0001234",
                "Purpose": "Vendor Payment"
            }
        }
        resp = requests.post(
            f"{self.CR_URL}/automations/deploy",
            json=payload, headers=self.AUTH, timeout=30)
        self.assertEqual(200, resp.status_code)
        deploy_id = resp.json()["deploymentId"]

        # Poll for completion
        for _ in range(60):
            status = requests.get(
                f"{self.CR_URL}/deployments/{deploy_id}",
                headers=self.AUTH, timeout=10).json()
            if status["status"] in ["COMPLETED", "FAILED"]:
                break
            time.sleep(2)

        self.assertEqual("COMPLETED", status["status"])
        output = status["outputVariables"]
        self.assertEqual("NEFT", output["PaymentChannel"])
        self.assertEqual("SUCCESS", output["TransactionStatus"])
        self.assertIsNotNone(output["TransactionRef"])

    def test_payment_bot_rtgs_routing(self):
        """Test RTGS routing for amounts > 2L"""
        payload = {
            "botId": "PAY_PROCESSOR_v4",
            "inputVariables": {
                "PayerAccount": "ACC001",
                "BeneficiaryAccount": "ACC003",
                "Amount": 500000,
                "BeneficiaryIFSC": "HDFC0002345",
                "Purpose": "Loan Disbursement"
            }
        }
        resp = requests.post(
            f"{self.CR_URL}/automations/deploy",
            json=payload, headers=self.AUTH, timeout=30)
        self.assertEqual(200, resp.status_code)
        deploy_id = resp.json()["deploymentId"]

        for _ in range(60):
            status = requests.get(
                f"{self.CR_URL}/deployments/{deploy_id}",
                headers=self.AUTH, timeout=10).json()
            if status["status"] in ["COMPLETED", "FAILED"]:
                break
            time.sleep(2)

        self.assertEqual("COMPLETED", status["status"])
        self.assertEqual("RTGS", status["outputVariables"]["PaymentChannel"])`,
   expectedOutput:`[TEST] RP-003: Payment Processing Bot Automation
[INFO] Control Room: https://aa-cr.bank.local
[PASS] NEFT payment bot deployed: DEP-20260227-001
[INFO] Amount: 150,000 → routed to NEFT (limit: 200,000)
[PASS] Bot completed: NEFT transaction SUCCESS
[PASS] Transaction ref: NEFT2026022700012345
[INFO] Beneficiary IFSC: SBIN0001234 verified
[PASS] RTGS payment bot deployed: DEP-20260227-002
[INFO] Amount: 500,000 → routed to RTGS (min: 200,001)
[PASS] Bot completed: RTGS transaction SUCCESS
[PASS] Transaction ref: RTGS2026022700067890
[INFO] Processing time: NEFT 4.2s, RTGS 2.8s
───────────────────────────────────
RP-003: Payment Processing Bot — 6 passed, 0 failed`},

  {id:'RP-004',title:'Reconciliation Bot End-of-Day',layer:'AutomationAnywhere',framework:'Automation Anywhere A360',language:'Python',difficulty:'Advanced',
   description:'Tests the AA A360 reconciliation bot that performs end-of-day matching between core banking transactions, payment gateway records, and GL entries, flagging discrepancies for manual review.',
   prerequisites:'AA Control Room, Core banking EOD data, Payment gateway logs, GL system access',
   config:'CONTROL_ROOM=https://aa-cr.bank.local\nBOT_ID=RECON_EOD_v3\nCBS_API=https://cbs.bank.local:8443/api/v2\nGL_API=https://gl.bank.local:8443/api/v1\nTOLERANCE_AMOUNT=0.01\nRECON_DATE=2026-02-27',
   code:`import requests
import unittest

class TestReconciliationBot(unittest.TestCase):
    CR_URL = "https://aa-cr.bank.local/api/v3"
    AUTH = {"Authorization": "Bearer aa_test_token_xyz"}

    def test_eod_reconciliation_run(self):
        """Test end-of-day reconciliation bot execution"""
        payload = {
            "botId": "RECON_EOD_v3",
            "inputVariables": {
                "ReconDate": "2026-02-27",
                "CBSSource": "core_banking_txns",
                "PayGWSource": "payment_gateway_log",
                "GLSource": "general_ledger",
                "ToleranceAmount": 0.01
            }
        }
        resp = requests.post(
            f"{self.CR_URL}/automations/deploy",
            json=payload, headers=self.AUTH, timeout=30)
        self.assertEqual(200, resp.status_code)
        deploy_id = resp.json()["deploymentId"]

        # Wait for completion (recon can take time)
        import time
        for _ in range(120):
            status = requests.get(
                f"{self.CR_URL}/deployments/{deploy_id}",
                headers=self.AUTH, timeout=10).json()
            if status["status"] in ["COMPLETED", "FAILED"]:
                break
            time.sleep(3)

        self.assertEqual("COMPLETED", status["status"])
        output = status["outputVariables"]

        # Verify reconciliation results
        self.assertGreater(int(output["TotalCBSTxns"]), 0)
        self.assertGreater(int(output["MatchedCount"]), 0)
        match_rate = float(output["MatchRate"])
        self.assertGreaterEqual(match_rate, 95.0)

    def test_discrepancy_flagging(self):
        """Test that discrepancies are correctly flagged"""
        resp = requests.get(
            f"{self.CR_URL}/reports/recon/2026-02-27/discrepancies",
            headers=self.AUTH, timeout=10)
        self.assertEqual(200, resp.status_code)
        discrepancies = resp.json()["items"]
        for disc in discrepancies:
            self.assertIn(disc["type"],
                ["AMOUNT_MISMATCH", "MISSING_IN_GL",
                 "MISSING_IN_CBS", "DUPLICATE_ENTRY"])
            self.assertIsNotNone(disc["flagged_for_review"])`,
   expectedOutput:`[TEST] RP-004: Reconciliation Bot End-of-Day
[INFO] Recon date: 2026-02-27 | Tolerance: 0.01
[PASS] EOD recon bot deployed: DEP-RECON-20260227
[INFO] Processing: CBS=12,450 txns, PayGW=12,448 txns, GL=12,451 entries
[PASS] Bot completed in 98.4 seconds
[PASS] Match rate: 99.87% (12,434 matched)
[INFO] Discrepancies found: 16 items
[PASS] Discrepancy types validated: AMOUNT_MISMATCH(8), MISSING_IN_GL(5), MISSING_IN_CBS(3)
[PASS] All discrepancies flagged for manual review
[INFO] Total variance: INR 23,456.78
[INFO] Report generated: RECON_RPT_20260227.xlsx
───────────────────────────────────
RP-004: Reconciliation Bot — 5 passed, 0 failed`},

  {id:'RP-005',title:'Bot Reliability & Uptime Testing',layer:'BotTesting',framework:'Robot Framework / Python',language:'Python',difficulty:'Intermediate',
   description:'Tests RPA bot reliability by executing stress runs, measuring success rates, validating retry mechanisms, and verifying bot recovery from transient failures across multiple iterations.',
   prerequisites:'Robot Framework 6.x, RPA bot deployed in test environment, Monitoring dashboard API',
   config:'BOT_ENDPOINT=https://orchestrator.bank.local/api/v1\nBOT_PROCESS=LoanProcessing_v2\nITERATIONS=50\nSUCCESS_THRESHOLD=98.0\nMAX_RETRY=3\nMONITOR_API=https://monitor.bank.local/api/v1',
   code:`import requests
import unittest
import time
from concurrent.futures import ThreadPoolExecutor

class TestBotReliability(unittest.TestCase):
    ORCH_URL = "https://orchestrator.bank.local/api/v1"
    AUTH = {"Authorization": "Bearer orch_test_token"}
    ITERATIONS = 50
    SUCCESS_THRESHOLD = 98.0

    def run_single_bot(self, iteration_id):
        """Execute a single bot run and return result"""
        resp = requests.post(
            f"{self.ORCH_URL}/jobs/start",
            json={"processKey": "LoanProcessing_v2",
                  "inputArgs": {"LoanId": f"LOAN-TEST-{iteration_id}"}},
            headers=self.AUTH, timeout=30)
        if resp.status_code != 200:
            return {"iteration": iteration_id, "status": "DEPLOY_FAILED"}
        job_id = resp.json()["jobId"]
        for _ in range(60):
            status = requests.get(
                f"{self.ORCH_URL}/jobs/{job_id}",
                headers=self.AUTH, timeout=10).json()
            if status["state"] in ["Successful", "Faulted"]:
                return {"iteration": iteration_id,
                        "status": status["state"],
                        "duration": status.get("duration", 0)}
            time.sleep(2)
        return {"iteration": iteration_id, "status": "TIMEOUT"}

    def test_bot_reliability_threshold(self):
        """Run bot N times and verify success rate"""
        results = []
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(self.run_single_bot, i)
                       for i in range(1, self.ITERATIONS + 1)]
            results = [f.result() for f in futures]

        success = sum(1 for r in results if r["status"] == "Successful")
        rate = (success / self.ITERATIONS) * 100
        self.assertGreaterEqual(rate, self.SUCCESS_THRESHOLD,
            f"Success rate {rate}% below threshold {self.SUCCESS_THRESHOLD}%")

    def test_bot_retry_mechanism(self):
        """Verify bot retries on transient failure"""
        resp = requests.post(
            f"{self.ORCH_URL}/jobs/start",
            json={"processKey": "LoanProcessing_v2",
                  "inputArgs": {"LoanId": "LOAN-RETRY-TEST",
                                "SimulateFailure": True}},
            headers=self.AUTH, timeout=30)
        job_id = resp.json()["jobId"]
        for _ in range(90):
            status = requests.get(
                f"{self.ORCH_URL}/jobs/{job_id}",
                headers=self.AUTH, timeout=10).json()
            if status["state"] == "Successful":
                break
            time.sleep(2)
        self.assertEqual("Successful", status["state"])
        self.assertGreater(status.get("retryCount", 0), 0)`,
   expectedOutput:`[TEST] RP-005: Bot Reliability & Uptime Testing
[INFO] Starting reliability test: 50 iterations, 5 concurrent
[PASS] Iteration batch 1-10: 10/10 successful
[PASS] Iteration batch 11-20: 10/10 successful
[PASS] Iteration batch 21-30: 10/10 successful
[PASS] Iteration batch 31-40: 9/10 successful (1 retried)
[PASS] Iteration batch 41-50: 10/10 successful
[PASS] Success rate: 99.2% (threshold: 98.0%)
[INFO] Avg duration: 12.4s | Max: 28.1s | Min: 8.2s
[PASS] Retry mechanism: transient failure recovered after 2 retries
[INFO] Total runtime: 312.5 seconds
───────────────────────────────────
RP-005: Bot Reliability — 7 passed, 0 failed`},

  {id:'RP-006',title:'Bot Error Recovery & Exception Handling',layer:'BotTesting',framework:'UiPath Test Suite / NUnit',language:'C#',difficulty:'Advanced',
   description:'Validates RPA bot exception handling for application crashes, network timeouts, element not found errors, and system unavailability with proper screenshot capture and notification triggers.',
   prerequisites:'UiPath Test Suite, Bot with exception workflows, Alert notification service, Screenshot storage',
   config:'ORCHESTRATOR_URL=https://orchestrator.bank.local\nBOT_PROCESS=FundTransfer_v5\nALERT_API=https://alerts.bank.local/api/v1\nSCREENSHOT_PATH=//storage.bank.local/bot-screenshots\nMAX_RETRY=3\nALERT_CHANNEL=ops-rpa-alerts',
   code:`[TestFixture]
public class TestBotErrorRecovery
{
    private OrchestratorClient _orch;
    private HttpClient _alertClient;

    [SetUp]
    public void Setup()
    {
        _orch = new OrchestratorClient(
            "https://orchestrator.bank.local", "BankingOps");
        _alertClient = new HttpClient();
    }

    [Test]
    public void TestApplicationCrashRecovery()
    {
        var job = _orch.StartJob("FundTransfer_v5",
            new { SimulateError = "APP_CRASH",
                  TransferId = "TXN-ERR-001" });
        var result = _orch.WaitForCompletion(job.JobId, 180);

        // Bot should recover and complete
        Assert.AreEqual("Successful", result.Status);
        Assert.IsTrue(result.OutputArgs.ContainsKey("RecoveryLog"));
        var log = result.OutputArgs["RecoveryLog"].ToString();
        Assert.That(log, Does.Contain("APP_CRASH_DETECTED"));
        Assert.That(log, Does.Contain("RECOVERY_EXECUTED"));
    }

    [Test]
    public void TestNetworkTimeoutHandling()
    {
        var job = _orch.StartJob("FundTransfer_v5",
            new { SimulateError = "NETWORK_TIMEOUT",
                  TransferId = "TXN-ERR-002" });
        var result = _orch.WaitForCompletion(job.JobId, 180);

        Assert.AreEqual("Successful", result.Status);
        var retries = int.Parse(
            result.OutputArgs["RetryCount"].ToString());
        Assert.That(retries, Is.GreaterThan(0).And.LessThanOrEqualTo(3));
    }

    [Test]
    public void TestScreenshotOnFailure()
    {
        var job = _orch.StartJob("FundTransfer_v5",
            new { SimulateError = "UNRECOVERABLE",
                  TransferId = "TXN-ERR-003" });
        var result = _orch.WaitForCompletion(job.JobId, 180);

        Assert.AreEqual("Faulted", result.Status);
        Assert.IsTrue(result.OutputArgs.ContainsKey("ScreenshotPath"));
        var alertResp = _alertClient.GetAsync(
            "https://alerts.bank.local/api/v1/latest?channel=ops-rpa-alerts")
            .Result;
        Assert.AreEqual(200, (int)alertResp.StatusCode);
    }
}`,
   expectedOutput:`[TEST] RP-006: Bot Error Recovery & Exception Handling
[INFO] Testing error scenarios for FundTransfer_v5
[PASS] App crash: bot detected crash, closed app, relaunched
[PASS] Recovery log: APP_CRASH_DETECTED → RECOVERY_EXECUTED
[INFO] Recovery time: 8.2 seconds
[PASS] Network timeout: bot retried 2 times, succeeded on attempt 3
[PASS] Retry count within limit: 2 <= 3
[PASS] Unrecoverable error: bot faulted gracefully
[PASS] Screenshot captured: //storage/bot-screenshots/TXN-ERR-003.png
[PASS] Alert sent to ops-rpa-alerts channel
[INFO] Alert payload: severity=HIGH, bot=FundTransfer_v5
[FAIL] Known issue: screenshot resolution below 1080p threshold
───────────────────────────────────
RP-006: Error Recovery — 7 passed, 1 failed`},

  {id:'RP-007',title:'OCR Check Scanning & Data Extraction',layer:'OCRDocument',framework:'Python / Tesseract / OpenCV',language:'Python',difficulty:'Intermediate',
   description:'Tests OCR-based check scanning pipeline that extracts MICR code, amount (in words and figures), payee name, date, and signature region from scanned bank checks with confidence scoring.',
   prerequisites:'Tesseract OCR 5.x, OpenCV 4.x, Sample check images, MICR font trained data',
   config:'TESSERACT_PATH=/usr/bin/tesseract\nTRAINED_DATA=/usr/share/tesseract/tessdata\nCONFIDENCE_THRESHOLD=85.0\nCHECK_IMAGE_DIR=/data/test-checks\nMICR_MODEL=micr_e13b.traineddata',
   code:`import cv2
import pytesseract
import re
import unittest
from pathlib import Path

class TestOCRCheckScanning(unittest.TestCase):
    CHECK_DIR = Path("/data/test-checks")
    CONFIDENCE_THRESHOLD = 85.0

    def extract_check_fields(self, image_path):
        """Extract fields from check image using OCR"""
        img = cv2.imread(str(image_path))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        thresh = cv2.threshold(
            gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

        # Extract MICR line (bottom strip)
        h, w = thresh.shape
        micr_region = thresh[int(h*0.85):h, 0:w]
        micr_data = pytesseract.image_to_data(
            micr_region, config="--psm 7 -c tessedit_char_whitelist=0123456789",
            output_type=pytesseract.Output.DICT)

        # Extract amount region (right middle)
        amount_region = thresh[int(h*0.3):int(h*0.5), int(w*0.5):w]
        amount_text = pytesseract.image_to_string(
            amount_region, config="--psm 7").strip()

        # Extract payee (upper left)
        payee_region = thresh[int(h*0.15):int(h*0.3), int(w*0.1):int(w*0.7)]
        payee_text = pytesseract.image_to_string(
            payee_region, config="--psm 7").strip()

        # Extract date (upper right)
        date_region = thresh[int(h*0.05):int(h*0.15), int(w*0.65):w]
        date_text = pytesseract.image_to_string(
            date_region, config="--psm 7").strip()

        return {
            "micr": "".join(micr_data["text"]),
            "amount": amount_text,
            "payee": payee_text, "date": date_text
        }

    def test_check_field_extraction(self):
        fields = self.extract_check_fields(
            self.CHECK_DIR / "sample_check_001.png")
        self.assertTrue(len(fields["micr"]) >= 9)
        self.assertRegex(fields["amount"], r"[\\d,]+\\.\\d{2}")
        self.assertTrue(len(fields["payee"]) > 0)
        self.assertRegex(fields["date"], r"\\d{2}[/-]\\d{2}[/-]\\d{4}")

    def test_ocr_confidence_score(self):
        img = cv2.imread(str(self.CHECK_DIR / "sample_check_001.png"))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        data = pytesseract.image_to_data(
            gray, output_type=pytesseract.Output.DICT)
        confidences = [int(c) for c in data["conf"] if int(c) > 0]
        avg_conf = sum(confidences) / len(confidences)
        self.assertGreaterEqual(avg_conf, self.CONFIDENCE_THRESHOLD)`,
   expectedOutput:`[TEST] RP-007: OCR Check Scanning & Data Extraction
[INFO] Processing: sample_check_001.png (2480x1100px)
[PASS] MICR code extracted: 123456789 (9 digits)
[PASS] Amount extracted: 25,000.00
[PASS] Payee extracted: "Rajesh Kumar Sharma"
[PASS] Date extracted: 27/02/2026
[INFO] OCR engine: Tesseract 5.3.1 + MICR E-13B model
[PASS] Average OCR confidence: 92.4% (threshold: 85.0%)
[INFO] Field confidences: MICR=97.1%, Amount=94.2%, Payee=88.6%, Date=89.7%
[PASS] All fields above confidence threshold
───────────────────────────────────
RP-007: OCR Check Scanning — 6 passed, 0 failed`},

  {id:'RP-008',title:'Document Classification & Routing',layer:'OCRDocument',framework:'Python / ML Pipeline',language:'Python',difficulty:'Advanced',
   description:'Tests the document classification system that categorizes incoming banking documents (loan applications, KYC forms, account statements, correspondence) and routes them to appropriate processing queues.',
   prerequisites:'Document classification model, Training dataset, Processing queue API, Storage service',
   config:'MODEL_PATH=/models/doc_classifier_v3.pkl\nQUEUE_API=https://queue.bank.local/api/v1\nSTORAGE_API=https://storage.bank.local/api/v1\nCLASSES=loan_application,kyc_form,account_statement,correspondence\nCONFIDENCE_MIN=0.85',
   code:`import requests
import unittest
import json
import base64
from pathlib import Path

class TestDocumentClassification(unittest.TestCase):
    CLASSIFY_API = "https://docai.bank.local/api/v1/classify"
    QUEUE_API = "https://queue.bank.local/api/v1"
    AUTH = {"Authorization": "Bearer docai_test_token"}
    TEST_DOCS = Path("/data/test-documents")

    def classify_document(self, doc_path):
        """Submit document for classification"""
        with open(doc_path, "rb") as f:
            doc_b64 = base64.b64encode(f.read()).decode()
        resp = requests.post(self.CLASSIFY_API, json={
            "document": doc_b64,
            "filename": doc_path.name
        }, headers=self.AUTH, timeout=30)
        return resp.json()

    def test_loan_application_classification(self):
        result = self.classify_document(
            self.TEST_DOCS / "loan_app_sample.pdf")
        self.assertEqual("loan_application", result["category"])
        self.assertGreaterEqual(result["confidence"], 0.85)
        self.assertEqual("loan_processing_queue", result["routed_to"])

    def test_kyc_form_classification(self):
        result = self.classify_document(
            self.TEST_DOCS / "kyc_form_sample.pdf")
        self.assertEqual("kyc_form", result["category"])
        self.assertGreaterEqual(result["confidence"], 0.85)
        self.assertEqual("kyc_verification_queue", result["routed_to"])

    def test_statement_classification(self):
        result = self.classify_document(
            self.TEST_DOCS / "account_stmt_sample.pdf")
        self.assertEqual("account_statement", result["category"])
        self.assertGreaterEqual(result["confidence"], 0.85)

    def test_batch_classification_accuracy(self):
        test_cases = [
            ("loan_app_001.pdf", "loan_application"),
            ("loan_app_002.pdf", "loan_application"),
            ("kyc_001.pdf", "kyc_form"),
            ("stmt_001.pdf", "account_statement"),
            ("letter_001.pdf", "correspondence"),
        ]
        correct = 0
        for filename, expected in test_cases:
            result = self.classify_document(
                self.TEST_DOCS / filename)
            if result["category"] == expected:
                correct += 1
        accuracy = (correct / len(test_cases)) * 100
        self.assertGreaterEqual(accuracy, 90.0)`,
   expectedOutput:`[TEST] RP-008: Document Classification & Routing
[INFO] Model: doc_classifier_v3.pkl | Classes: 4
[PASS] loan_app_sample.pdf → loan_application (conf: 0.96)
[PASS] Routed to: loan_processing_queue
[PASS] kyc_form_sample.pdf → kyc_form (conf: 0.93)
[PASS] Routed to: kyc_verification_queue
[PASS] account_stmt_sample.pdf → account_statement (conf: 0.91)
[PASS] Batch accuracy: 100% (5/5 correct)
[INFO] Avg classification time: 1.2s per document
[INFO] Confidence distribution: min=0.88, max=0.97, avg=0.93
[FAIL] letter_001.pdf confidence below threshold: 0.82 < 0.85
───────────────────────────────────
RP-008: Document Classification — 6 passed, 1 failed`},

  {id:'RP-009',title:'Process Discovery & Mapping',layer:'ProcessMining',framework:'PowerShell / Process Mining API',language:'PowerShell',difficulty:'Intermediate',
   description:'Tests the process mining discovery engine that analyzes event logs from core banking to discover actual process flows, identify variants, and generate process maps for account opening workflows.',
   prerequisites:'Process mining platform (Celonis/Minit), Event log database, Banking process definitions',
   config:'PM_API=https://processmining.bank.local/api/v2\nEVENT_LOG_DB=postgresql://pm:pass@db.local/eventlogs\nPROCESS_ID=account_opening\nMIN_CASE_COUNT=100\nVARIANT_THRESHOLD=5',
   code:`# Process Mining Discovery Test Script
$PMApiUrl = "https://processmining.bank.local/api/v2"
$Headers = @{ "Authorization" = "Bearer pm_test_token" }

# Test 1: Trigger process discovery
$discoveryPayload = @{
    processId = "account_opening"
    dataSource = "core_banking_events"
    dateRange = @{
        startDate = "2026-01-01"
        endDate = "2026-02-27"
    }
    minCaseCount = 100
} | ConvertTo-Json -Depth 3

$discovery = Invoke-RestMethod -Uri "$PMApiUrl/discovery/run" -Method POST -Headers $Headers -Body $discoveryPayload -ContentType "application/json" -TimeoutSec 60
Write-Host "[TEST] Discovery job: $($discovery.jobId)"
if ($discovery.status -ne "COMPLETED") { throw "Discovery failed" }

# Test 2: Validate discovered process model
$model = Invoke-RestMethod -Uri "$PMApiUrl/discovery/$($discovery.jobId)/model" -Headers $Headers -TimeoutSec 30
Write-Host "[PASS] Activities found: $($model.activities.Count)"
if ($model.activities.Count -lt 5) {
    throw "Too few activities discovered"
}

# Test 3: Check process variants
$variants = Invoke-RestMethod -Uri "$PMApiUrl/discovery/$($discovery.jobId)/variants" -Headers $Headers -TimeoutSec 30
Write-Host "[PASS] Variants: $($variants.Count)"
$happyPath = $variants | Where-Object { $_.isHappyPath -eq $true }
if (-not $happyPath) { throw "No happy path identified" }
Write-Host "[PASS] Happy path: $($happyPath.name)"

# Test 4: Validate case statistics
$stats = Invoke-RestMethod -Uri "$PMApiUrl/discovery/$($discovery.jobId)/statistics" -Headers $Headers -TimeoutSec 30
if ($stats.totalCases -lt 100) {
    throw "Insufficient cases: $($stats.totalCases)"
}
Write-Host "[PASS] Cases analyzed: $($stats.totalCases)"
Write-Host "[INFO] Avg duration: $($stats.avgDuration)"
Write-Host "[PASS] Conformance rate: $($stats.conformanceRate)%"`,
   expectedOutput:`[TEST] RP-009: Process Discovery & Mapping
[INFO] Process: account_opening | Date range: 2026-01-01 to 2026-02-27
[PASS] Discovery job completed: JOB-PM-20260227-001
[PASS] Activities discovered: 12 (Application Submit → Account Active)
[INFO] Activities: Submit, KYC Check, Doc Verify, Credit Check, Approval, Account Create...
[PASS] Process variants found: 8
[PASS] Happy path identified: Standard Opening (68% of cases)
[PASS] Cases analyzed: 2,847
[INFO] Avg duration: 3.2 days | Median: 2.8 days
[PASS] Conformance rate: 87.4%
[INFO] Top deviation: skipped Credit Check (12.6% of cases)
───────────────────────────────────
RP-009: Process Discovery — 7 passed, 0 failed`},

  {id:'RP-010',title:'Bottleneck Analysis & SLA Monitoring',layer:'ProcessMining',framework:'Python / Process Mining SDK',language:'Python',difficulty:'Advanced',
   description:'Tests the process mining bottleneck detection engine that identifies delays, resource constraints, and SLA violations in banking loan approval processes using event log analysis.',
   prerequisites:'Process mining SDK, Historical event logs (6 months), SLA definitions, Resource capacity data',
   config:'PM_API=https://processmining.bank.local/api/v2\nPROCESS_ID=loan_approval\nSLA_TARGET_DAYS=7\nBOTTLENECK_THRESHOLD_HOURS=24\nANALYSIS_PERIOD=6M',
   code:`import requests
import unittest
from datetime import datetime, timedelta

class TestBottleneckAnalysis(unittest.TestCase):
    PM_API = "https://processmining.bank.local/api/v2"
    AUTH = {"Authorization": "Bearer pm_test_token"}
    SLA_TARGET_DAYS = 7

    def test_bottleneck_detection(self):
        """Identify bottleneck activities in loan approval"""
        resp = requests.post(
            f"{self.PM_API}/analysis/bottleneck",
            json={
                "processId": "loan_approval",
                "period": "6M",
                "thresholdHours": 24
            }, headers=self.AUTH, timeout=60)
        self.assertEqual(200, resp.status_code)
        bottlenecks = resp.json()["bottlenecks"]
        self.assertGreater(len(bottlenecks), 0)
        for bn in bottlenecks:
            self.assertIn("activity", bn)
            self.assertIn("avgWaitHours", bn)
            self.assertGreater(bn["avgWaitHours"], 24)

    def test_sla_violation_analysis(self):
        """Analyze SLA violations in loan approval"""
        resp = requests.post(
            f"{self.PM_API}/analysis/sla",
            json={
                "processId": "loan_approval",
                "slaTargetDays": self.SLA_TARGET_DAYS,
                "period": "6M"
            }, headers=self.AUTH, timeout=60)
        self.assertEqual(200, resp.status_code)
        sla = resp.json()
        self.assertIn("violationRate", sla)
        self.assertIn("avgCompletionDays", sla)
        self.assertIn("violationsByActivity", sla)
        violation_rate = sla["violationRate"]
        self.assertLess(violation_rate, 30.0,
            f"SLA violation rate {violation_rate}% too high")

    def test_resource_utilization(self):
        """Analyze resource utilization patterns"""
        resp = requests.post(
            f"{self.PM_API}/analysis/resources",
            json={
                "processId": "loan_approval",
                "period": "6M",
                "groupBy": "role"
            }, headers=self.AUTH, timeout=60)
        self.assertEqual(200, resp.status_code)
        resources = resp.json()["resources"]
        for res in resources:
            self.assertIn("role", res)
            self.assertIn("utilizationPct", res)
            self.assertIn("avgCasesPerDay", res)`,
   expectedOutput:`[TEST] RP-010: Bottleneck Analysis & SLA Monitoring
[INFO] Process: loan_approval | Period: 6 months | SLA: 7 days
[PASS] Bottleneck detected: Credit Assessment (avg wait: 38.4 hours)
[PASS] Bottleneck detected: Manager Approval (avg wait: 26.7 hours)
[INFO] Total bottleneck activities: 2 above 24h threshold
[PASS] SLA violation rate: 18.3% (threshold: 30%)
[INFO] Avg completion: 5.8 days | Median: 4.2 days
[PASS] Top SLA violator: Credit Assessment (contributes 62% of delays)
[PASS] Resource utilization: Credit Officers at 94.2% (overloaded)
[INFO] Underutilized: Junior Analysts at 45.8%
[FAIL] Credit Assessment SLA: avg 38.4h exceeds 24h activity target
[INFO] Recommendation: Add 2 credit officers to reduce bottleneck
───────────────────────────────────
RP-010: Bottleneck Analysis — 5 passed, 1 failed`},

  {id:'RP-011',title:'AI-Powered Bot Decision Testing',layer:'IntelligentAuto',framework:'Python / ML Integration',language:'Python',difficulty:'Advanced',
   description:'Tests an AI-powered RPA bot that uses machine learning models for intelligent decision-making in loan underwriting, including credit scoring, fraud detection, and automated approval/rejection.',
   prerequisites:'ML model API, Credit scoring service, Fraud detection engine, Loan management system',
   config:'ML_API=https://ml.bank.local/api/v2\nCREDIT_MODEL=credit_score_v5\nFRAUD_MODEL=fraud_detect_v3\nLOAN_API=https://loans.bank.local/api/v2\nAUTO_APPROVE_THRESHOLD=750\nAUTO_REJECT_THRESHOLD=500',
   code:`import requests
import unittest

class TestAIPoweredBotDecision(unittest.TestCase):
    ML_API = "https://ml.bank.local/api/v2"
    LOAN_API = "https://loans.bank.local/api/v2"
    AUTH = {"Authorization": "Bearer ml_test_token"}
    APPROVE_THRESHOLD = 750
    REJECT_THRESHOLD = 500

    def test_auto_approve_high_score(self):
        """Test auto-approval for high credit score applicant"""
        resp = requests.post(
            f"{self.ML_API}/predict/credit_score",
            json={
                "applicantId": "APP-001",
                "income": 1200000, "age": 35,
                "employment": "salaried", "tenure": 8,
                "existingLoans": 1, "creditHistory": "good"
            }, headers=self.AUTH, timeout=15)
        self.assertEqual(200, resp.status_code)
        score = resp.json()["creditScore"]
        self.assertGreaterEqual(score, self.APPROVE_THRESHOLD)

        # Verify bot decision
        decision = requests.post(
            f"{self.LOAN_API}/decision",
            json={"applicantId": "APP-001", "creditScore": score,
                  "loanAmount": 500000},
            headers=self.AUTH, timeout=15)
        self.assertEqual("AUTO_APPROVED", decision.json()["decision"])

    def test_auto_reject_low_score(self):
        """Test auto-rejection for low credit score"""
        resp = requests.post(
            f"{self.ML_API}/predict/credit_score",
            json={
                "applicantId": "APP-002",
                "income": 200000, "age": 22,
                "employment": "self_employed", "tenure": 1,
                "existingLoans": 5, "creditHistory": "poor"
            }, headers=self.AUTH, timeout=15)
        score = resp.json()["creditScore"]
        self.assertLess(score, self.REJECT_THRESHOLD)

        decision = requests.post(
            f"{self.LOAN_API}/decision",
            json={"applicantId": "APP-002", "creditScore": score,
                  "loanAmount": 1000000},
            headers=self.AUTH, timeout=15)
        self.assertEqual("AUTO_REJECTED", decision.json()["decision"])

    def test_fraud_detection_integration(self):
        """Test fraud detection flags suspicious application"""
        resp = requests.post(
            f"{self.ML_API}/predict/fraud_detect",
            json={
                "applicantId": "APP-003",
                "applicationData": {
                    "income": 5000000, "age": 19,
                    "employment": "salaried", "tenure": 15,
                    "addressChanges": 4, "phoneChanges": 3
                }
            }, headers=self.AUTH, timeout=15)
        self.assertEqual(200, resp.status_code)
        self.assertTrue(resp.json()["isFraudSuspect"])
        self.assertGreaterEqual(resp.json()["fraudScore"], 0.8)`,
   expectedOutput:`[TEST] RP-011: AI-Powered Bot Decision Testing
[INFO] Models: credit_score_v5, fraud_detect_v3
[PASS] APP-001 credit score: 812 (threshold: 750)
[PASS] Decision: AUTO_APPROVED for loan INR 500,000
[INFO] Model confidence: 0.94 | Processing: 230ms
[PASS] APP-002 credit score: 423 (threshold: 500)
[PASS] Decision: AUTO_REJECTED for loan INR 1,000,000
[INFO] Rejection reasons: low income, poor credit history, high debt
[PASS] APP-003 fraud detection: SUSPICIOUS (score: 0.91)
[INFO] Fraud indicators: age/tenure mismatch, high address changes
[PASS] Fraud flag: application routed to manual review
[INFO] Total decisions: 3 | Avg latency: 245ms
───────────────────────────────────
RP-011: AI Bot Decision — 6 passed, 0 failed`},

  {id:'RP-012',title:'NLP-Based Customer Request Automation',layer:'IntelligentAuto',framework:'JavaScript / NLP API',language:'JavaScript',difficulty:'Intermediate',
   description:'Tests the NLP automation pipeline that classifies customer emails/messages, extracts intent and entities, and triggers appropriate RPA workflows for request fulfillment in banking operations.',
   prerequisites:'NLP service API, Intent classifier model, Entity extractor, Workflow orchestrator',
   config:'NLP_API=https://nlp.bank.local/api/v2\nWORKFLOW_API=https://orchestrator.bank.local/api/v1\nINTENTS=balance_inquiry,fund_transfer,card_block,statement_request,complaint\nCONFIDENCE_MIN=0.80',
   code:`const axios = require("axios");
const assert = require("assert");

const NLP_API = "https://nlp.bank.local/api/v2";
const WORKFLOW_API = "https://orchestrator.bank.local/api/v1";
const AUTH = { Authorization: "Bearer nlp_test_token" };

async function testIntentClassification() {
    const testMessages = [
        {
            text: "Please check my account balance for savings account 1234",
            expectedIntent: "balance_inquiry",
            expectedEntities: ["account_type", "account_number"]
        },
        {
            text: "Transfer Rs 50000 from my account to IFSC SBIN001 acc 5678",
            expectedIntent: "fund_transfer",
            expectedEntities: ["amount", "ifsc_code", "account_number"]
        },
        {
            text: "My debit card ending 4321 is lost, please block immediately",
            expectedIntent: "card_block",
            expectedEntities: ["card_type", "card_last_four"]
        }
    ];

    for (const tc of testMessages) {
        const resp = await axios.post(
            \`\${NLP_API}/classify\`,
            { text: tc.text, language: "en" },
            { headers: AUTH, timeout: 10000 }
        );
        assert.strictEqual(resp.status, 200);
        assert.strictEqual(resp.data.intent, tc.expectedIntent);
        assert.ok(resp.data.confidence >= 0.80,
            \`Confidence \${resp.data.confidence} below 0.80\`);
        for (const entity of tc.expectedEntities) {
            assert.ok(resp.data.entities.some(e => e.type === entity),
                \`Entity \${entity} not found\`);
        }
        console.log(\`[PASS] "\${tc.text.substring(0, 40)}..." => \${tc.expectedIntent}\`);
    }
}

async function testWorkflowTrigger() {
    const resp = await axios.post(
        \`\${WORKFLOW_API}/trigger\`,
        {
            intent: "card_block",
            entities: { card_type: "debit", card_last_four: "4321" },
            customerId: "CUST-NLP-001",
            priority: "HIGH"
        },
        { headers: AUTH, timeout: 15000 }
    );
    assert.strictEqual(resp.status, 200);
    assert.ok(resp.data.workflowId);
    assert.strictEqual(resp.data.status, "TRIGGERED");
    console.log("[PASS] Workflow triggered:", resp.data.workflowId);
}

(async () => {
    await testIntentClassification();
    await testWorkflowTrigger();
    console.log("[PASS] All NLP automation tests passed");
})();`,
   expectedOutput:`[TEST] RP-012: NLP-Based Customer Request Automation
[INFO] NLP model loaded: intent_classifier_v4 + entity_extractor_v2
[PASS] "Please check my account balance fo..." => balance_inquiry (conf: 0.94)
[INFO] Entities: account_type=savings, account_number=1234
[PASS] "Transfer Rs 50000 from my account..." => fund_transfer (conf: 0.91)
[INFO] Entities: amount=50000, ifsc_code=SBIN001, account_number=5678
[PASS] "My debit card ending 4321 is lost..." => card_block (conf: 0.97)
[INFO] Entities: card_type=debit, card_last_four=4321
[PASS] Workflow triggered: WF-CARD-BLOCK-20260227-001
[INFO] Priority: HIGH | Auto-escalation: enabled
[PASS] All NLP automation tests passed
[INFO] Avg classification latency: 89ms
───────────────────────────────────
RP-012: NLP Automation — 5 passed, 0 failed`},
];

export default function RPATestingLab() {
  const [tab, setTab] = useState('UiPath');
  const [sel, setSel] = useState(S[0]);
  const [search, setSearch] = useState('');
  const [diffF, setDiffF] = useState('All');
  const [statuses, setStatuses] = useState({});
  const [code, setCode] = useState(S[0].code);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [progress, setProgress] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const timerRef = useRef(null);

  const filtered = S.filter(s => {
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
      if (i < lines.length) { setOutput(prev => prev + (prev ? '\n' : '') + lines[i]); setProgress(Math.round(((i + 1) / lines.length) * 100)); i++; }
      else { clearInterval(timerRef.current); setRunning(false); setStatuses(prev => ({ ...prev, [sel.id]: 'passed' })); }
    }, 150);
  }, [sel, running]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const totalTab = S.filter(s => s.layer === tab).length;
  const passedTab = S.filter(s => s.layer === tab && statuses[s.id] === 'passed').length;
  const totalAll = S.length;
  const passedAll = Object.values(statuses).filter(v => v === 'passed').length;
  const copy = () => { navigator.clipboard?.writeText(code); };
  const reset = () => { setCode(sel.code); };

  const sty = {
    page:{minHeight:'100vh',background:`linear-gradient(135deg,${C.bgFrom} 0%,${C.bgTo} 100%)`,color:C.text,fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",padding:'18px 22px 40px'},
    h1:{fontSize:28,fontWeight:800,margin:0,background:`linear-gradient(90deg,${C.accent},#3498db)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'},
    sub:{fontSize:13,color:C.muted,marginTop:4},
    statsBar:{display:'flex',justifyContent:'center',gap:24,marginBottom:14,flexWrap:'wrap'},
    stat:{background:C.card,borderRadius:8,padding:'6px 18px',fontSize:13,border:`1px solid ${C.border}`},
    split:{display:'flex',gap:16,height:'calc(100vh - 160px)',minHeight:500},
    left:{width:'38%',minWidth:320,display:'flex',flexDirection:'column',gap:10},
    right:{flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'hidden'},
    tabBar:{display:'flex',gap:4,flexWrap:'wrap'},
    tabBtn:(a)=>({padding:'6px 12px',borderRadius:6,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,background:a?C.accent:C.card,color:a?'#0a0a1a':C.text}),
    input:{flex:1,padding:'7px 12px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:13,outline:'none',minWidth:120},
    select:{padding:'6px 8px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:12,outline:'none'},
    list:{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:6,paddingRight:4},
    card:(a)=>({padding:'10px 14px',borderRadius:8,background:a?C.cardHover:C.card,border:`1px solid ${a?C.accent:C.border}`,cursor:'pointer'}),
    badge:(c)=>({display:'inline-block',padding:'1px 7px',borderRadius:10,fontSize:10,fontWeight:700,background:c+'22',color:c,marginRight:4}),
    dot:(st)=>({display:'inline-block',width:8,height:8,borderRadius:'50%',background:st==='passed'?C.accent:C.muted,marginRight:6}),
    panel:{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:16,overflowY:'auto'},
    editor:{width:'100%',minHeight:200,maxHeight:280,padding:12,borderRadius:8,border:`1px solid ${C.border}`,background:C.editorBg,color:C.editorText,fontFamily:"'Fira Code','Consolas',monospace",fontSize:12,lineHeight:1.6,resize:'vertical',outline:'none',whiteSpace:'pre',overflowX:'auto'},
    btn:(bg)=>({padding:'7px 16px',borderRadius:6,border:'none',cursor:'pointer',fontSize:12,fontWeight:700,background:bg||C.accent,color:(bg===C.danger||bg==='#555')?'#fff':'#0a0a1a'}),
    outBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,fontFamily:"'Fira Code','Consolas',monospace",fontSize:11,color:C.accent,lineHeight:1.7,whiteSpace:'pre-wrap',minHeight:60,maxHeight:180,overflowY:'auto'},
    progBar:{height:4,borderRadius:2,background:'#0a2744',marginTop:6},
    progFill:(p)=>({height:'100%',borderRadius:2,width:p+'%',background:p===100?C.accent:'#3498db',transition:'width 0.3s'}),
    progO:{height:6,borderRadius:3,background:'#0a2744',marginBottom:8},
    progOF:(p)=>({height:'100%',borderRadius:3,width:p+'%',background:`linear-gradient(90deg,${C.accent},#3498db)`,transition:'width 0.4s'}),
    cfgBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,marginTop:8,fontSize:12,lineHeight:1.6,color:C.warn,fontFamily:"'Fira Code','Consolas',monospace",whiteSpace:'pre-wrap'},
  };

  return (
    <div style={sty.page}>
      <div style={{textAlign:'center',marginBottom:16}}>
        <h1 style={sty.h1}>RPA Testing Lab</h1>
        <div style={sty.sub}>UiPath, Automation Anywhere, Bot Testing, OCR/Documents, Process Mining & Intelligent Automation — {totalAll} Scenarios</div>
      </div>
      <div style={sty.statsBar}>
        <span style={sty.stat}>Total: <b style={{color:C.accent}}>{totalAll}</b></span>
        <span style={sty.stat}>Passed: <b style={{color:C.accent}}>{passedAll}</b>/{totalAll}</span>
        <span style={sty.stat}>Tab: <b style={{color:C.accent}}>{passedTab}</b>/{totalTab}</span>
        <span style={sty.stat}>Coverage: <b style={{color:C.accent}}>{totalAll>0?Math.round((passedAll/totalAll)*100):0}%</b></span>
      </div>
      <div style={sty.split}>
        <div style={sty.left}>
          <div style={sty.tabBar}>{TABS.map(t=><button key={t.key} style={sty.tabBtn(tab===t.key)} onClick={()=>setTab(t.key)}>{t.label}</button>)}</div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
            <input style={sty.input} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
            <select style={sty.select} value={diffF} onChange={e=>setDiffF(e.target.value)}>{['All',...DIFF].map(d=><option key={d} value={d}>{d==='All'?'Difficulty':d}</option>)}</select>
          </div>
          <div style={sty.progO}><div style={sty.progOF(totalTab>0?Math.round((passedTab/totalTab)*100):0)}/></div>
          <div style={sty.list}>
            {filtered.length===0&&<div style={{color:C.muted,textAlign:'center',padding:20}}>No scenarios match</div>}
            {filtered.map(s=>(
              <div key={s.id} style={sty.card(sel.id===s.id)} onClick={()=>pick(s)}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={sty.dot(statuses[s.id])}/><span style={{fontSize:11,color:C.accent,marginRight:8}}>{s.id}</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.header}}>{s.title}</span>
                </div>
                <div style={{marginTop:4}}>
                  <span style={sty.badge(TC[s.layer]||C.accent)}>{s.layer}</span>
                  <span style={sty.badge(DC[s.difficulty])}>{s.difficulty}</span>
                  <span style={sty.badge('#3498db')}>{s.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={sty.right}>
          <div style={{...sty.panel,flex:'0 0 auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div><span style={{fontSize:14,fontWeight:800,color:C.accent,marginRight:10}}>{sel.id}</span><span style={{fontSize:16,fontWeight:700,color:C.header}}>{sel.title}</span></div>
              <div><span style={sty.badge(TC[sel.layer]||C.accent)}>{sel.layer}</span><span style={sty.badge(DC[sel.difficulty])}>{sel.difficulty}</span><span style={sty.badge('#f1c40f')}>{sel.language}</span></div>
            </div>
            <div style={{fontSize:12,color:C.muted,marginBottom:10,lineHeight:1.5}}>{sel.description}</div>
            <div style={{fontSize:11,color:C.muted}}><b>Prerequisites:</b> {sel.prerequisites}</div>
          </div>
          <div style={{...sty.panel,flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Test Script — {sel.framework}</span>
              <div style={{display:'flex',gap:6}}><button style={sty.btn()} onClick={copy}>Copy</button><button style={sty.btn('#555')} onClick={reset}>Reset</button></div>
            </div>
            <textarea style={sty.editor} value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Expected Output</span>
              <span style={{fontSize:11,color:C.muted}}>{sel.language}</span>
            </div>
            <div style={sty.outBox}>{sel.expectedOutput}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button style={{...sty.btn(running?'#555':C.accent),opacity:running?0.6:1}} onClick={runSim} disabled={running}>{running?'Running...':'Run Test'}</button>
              {statuses[sel.id]==='passed'&&<span style={{color:C.accent,fontSize:12,fontWeight:700}}>PASSED</span>}
              {progress>0&&progress<100&&<span style={{color:'#3498db',fontSize:11}}>{progress}%</span>}
              <button style={{...sty.btn('#3498db'),marginLeft:'auto'}} onClick={()=>setShowConfig(!showConfig)}>{showConfig?'Hide':'Show'} Config</button>
            </div>
            {(running||output)&&(<div><div style={{fontSize:12,fontWeight:700,color:C.header,marginBottom:4}}>Execution Output</div><div style={sty.outBox}>{output||'Starting...'}</div><div style={sty.progBar}><div style={sty.progFill(progress)}/></div></div>)}
            {showConfig&&<div style={sty.cfgBox}><div style={{fontWeight:700,color:C.accent,marginBottom:6}}>Configuration</div><div>{sel.config}</div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

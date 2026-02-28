import React, { useState, useCallback, useRef, useEffect } from 'react';

/* ================================================================
   Code Quality & Repository Testing Lab
   Split-panel: LEFT (scenario list) | RIGHT (editor + output)
   60 Scenarios across 6 tabs for Banking QA
   ================================================================ */

const C = {
  bgFrom: '#1a1a2e', bgTo: '#16213e', card: '#0f3460',
  accent: '#4ecca3', text: '#e0e0e0', header: '#fff',
  border: 'rgba(78,204,163,0.3)', editorBg: '#0a0a1a',
  editorText: '#4ecca3', muted: '#78909c', cardHover: '#143b6a',
  inputBg: '#0a2744', danger: '#e74c3c', warn: '#f39c12',
};

const TAB_COLORS = {
  SonarQube: '#e74c3c', StaticAnalysis: '#3498db', CodeReview: '#9b59b6',
  TestQuality: '#2ecc71', RepoManagement: '#e67e22', DocQuality: '#1abc9c',
};

const TABS = [
  { key: 'SonarQube', label: 'SonarQube' },
  { key: 'StaticAnalysis', label: 'Static Analysis' },
  { key: 'CodeReview', label: 'Code Review' },
  { key: 'TestQuality', label: 'Test Quality' },
  { key: 'RepoManagement', label: 'Repo Mgmt' },
  { key: 'DocQuality', label: 'Doc Quality' },
];

const DIFF = ['Beginner', 'Intermediate', 'Advanced'];

/* ─── SCENARIO DATA ─── */
const SCENARIOS = [
  /* ====== TAB 1: SonarQube (CQ-001 to CQ-010) ====== */
  {
    id: 'CQ-001', title: 'SonarQube Quality Gate Validation',
    category: 'Quality Gates', layer: 'SonarQube',
    framework: 'SonarQube / Maven', language: 'Java',
    difficulty: 'Beginner',
    description: 'Validate that the SonarQube quality gate is configured to enforce banking-grade code quality thresholds. Checks include coverage minimums, duplicated line limits, and reliability/security ratings required before code can be merged into main branches.',
    prerequisites: 'SonarQube server access, Maven project with sonar-maven-plugin, Quality gate profile configured',
    config: 'SONAR_URL=https://sonar.bank.local:9000\nSONAR_TOKEN=env:SONAR_AUTH_TOKEN\nPROJECT_KEY=com.bank:core-banking\nQUALITY_GATE=Banking-Strict\nMIN_COVERAGE=80',
    code: `// CQ-001: SonarQube Quality Gate Validation
// File: QualityGateValidationTest.java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.net.http.*;
import java.net.URI;
import com.google.gson.*;

public class QualityGateValidationTest {
    private static final String SONAR_URL = "https://sonar.bank.local:9000";
    private static final String PROJECT_KEY = "com.bank:core-banking";
    private final HttpClient client = HttpClient.newHttpClient();

    @Test
    void qualityGateShouldBeConfigured() throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(SONAR_URL + "/api/qualitygates/project_status?projectKey=" + PROJECT_KEY))
            .header("Authorization", "Bearer " + System.getenv("SONAR_AUTH_TOKEN"))
            .build();
        HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
        assertEquals(200, resp.statusCode(), "SonarQube API should respond");
        JsonObject json = JsonParser.parseString(resp.body()).getAsJsonObject();
        String status = json.getAsJsonObject("projectStatus").get("status").getAsString();
        assertEquals("OK", status, "Quality gate must pass");
        System.out.println("[PASS] Quality gate status: " + status);
    }

    @Test
    void coverageThresholdMustMeetMinimum() throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(SONAR_URL + "/api/measures/component?component="
                + PROJECT_KEY + "&metricKeys=coverage"))
            .header("Authorization", "Bearer " + System.getenv("SONAR_AUTH_TOKEN"))
            .build();
        HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
        JsonObject json = JsonParser.parseString(resp.body()).getAsJsonObject();
        double coverage = json.getAsJsonObject("component")
            .getAsJsonArray("measures").get(0).getAsJsonObject()
            .get("value").getAsDouble();
        assertTrue(coverage >= 80.0, "Coverage " + coverage + "% must be >= 80%");
        System.out.println("[PASS] Coverage: " + coverage + "% (min: 80%)");
    }
}`,
    expectedOutput: `[TEST] SonarQube Quality Gate Validation
[INFO] Connecting to SonarQube: https://sonar.bank.local:9000
[INFO] Project: com.bank:core-banking
[INFO] Quality Gate Profile: Banking-Strict
[PASS] Quality gate status: OK
[INFO] Checking coverage threshold...
[PASS] Coverage: 84.7% (min: 80%)
[INFO] Reliability Rating: A
[INFO] Security Rating: A
[INFO] Maintainability Rating: A
[PASS] All quality gate conditions met
─────────────────────────────────
CQ-001: Quality Gate Validation PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'CQ-002', title: 'Code Smell Detection Threshold',
    category: 'Code Smells', layer: 'SonarQube',
    framework: 'SonarQube / Gradle', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Verify that SonarQube detects and categorizes code smells in banking applications. Validate that critical and blocker code smells are zero before release, and that the total code smell count stays within the configured threshold for banking modules.',
    prerequisites: 'SonarQube analysis completed, Code smell rules enabled, Banking-specific rule profile active',
    config: 'SONAR_URL=https://sonar.bank.local:9000\nPROJECT_KEY=com.bank:payment-gateway\nMAX_CRITICAL_SMELLS=0\nMAX_BLOCKER_SMELLS=0\nMAX_TOTAL_SMELLS=50\nRULE_PROFILE=Banking-CodeSmells',
    code: `// CQ-002: Code Smell Detection Threshold
// File: CodeSmellThresholdTest.java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.net.http.*;
import java.net.URI;
import com.google.gson.*;

public class CodeSmellThresholdTest {
    private static final String SONAR_URL = "https://sonar.bank.local:9000";
    private static final String PROJECT = "com.bank:payment-gateway";

    @Test
    void noBlockerCodeSmells() throws Exception {
        int blockers = getIssueCount("CODE_SMELL", "BLOCKER");
        assertEquals(0, blockers, "Blocker code smells must be zero");
        System.out.println("[PASS] Blocker code smells: " + blockers);
    }

    @Test
    void noCriticalCodeSmells() throws Exception {
        int criticals = getIssueCount("CODE_SMELL", "CRITICAL");
        assertEquals(0, criticals, "Critical code smells must be zero");
        System.out.println("[PASS] Critical code smells: " + criticals);
    }

    @Test
    void totalSmellsWithinThreshold() throws Exception {
        int total = getIssueCount("CODE_SMELL", null);
        assertTrue(total <= 50, "Total smells " + total + " exceeds 50");
        System.out.println("[PASS] Total code smells: " + total + " (max: 50)");
    }

    private int getIssueCount(String type, String severity) throws Exception {
        String url = SONAR_URL + "/api/issues/search?componentKeys="
            + PROJECT + "&types=" + type
            + (severity != null ? "&severities=" + severity : "")
            + "&statuses=OPEN,CONFIRMED";
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Authorization", "Bearer " + System.getenv("SONAR_AUTH_TOKEN"))
            .build();
        HttpResponse<String> resp = HttpClient.newHttpClient()
            .send(req, HttpResponse.BodyHandlers.ofString());
        return JsonParser.parseString(resp.body()).getAsJsonObject()
            .get("total").getAsInt();
    }
}`,
    expectedOutput: `[TEST] Code Smell Detection Threshold
[INFO] Project: com.bank:payment-gateway
[INFO] Rule Profile: Banking-CodeSmells
[INFO] Checking blocker code smells...
[PASS] Blocker code smells: 0
[INFO] Checking critical code smells...
[PASS] Critical code smells: 0
[INFO] Checking total code smell count...
[PASS] Total code smells: 34 (max: 50)
[INFO] Breakdown: Minor=22, Major=12, Info=0
[INFO] Top smell: LongMethod (8 instances)
─────────────────────────────────
CQ-002: Code Smell Threshold PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'CQ-003', title: 'Technical Debt Ratio Analysis',
    category: 'Technical Debt', layer: 'SonarQube',
    framework: 'SonarQube / Maven', language: 'Python',
    difficulty: 'Advanced',
    description: 'Analyze and enforce technical debt ratio limits for banking core modules. Validate the SQALE debt ratio stays below 5% for critical financial transaction modules, and verify remediation time estimates are accurate for sprint planning.',
    prerequisites: 'SonarQube with SQALE plugin, Historical analysis data, Sprint velocity metrics',
    config: 'SONAR_URL=https://sonar.bank.local:9000\nPROJECT_KEY=com.bank:core-banking\nMAX_DEBT_RATIO_PCT=5.0\nMAX_DEBT_DAYS=30\nCRITICAL_MODULES=payment,settlement,compliance',
    code: `#!/usr/bin/env python3
"""CQ-003: Technical Debt Ratio Analysis"""
import requests, sys, os

SONAR_URL = "https://sonar.bank.local:9000"
TOKEN = os.environ["SONAR_AUTH_TOKEN"]
PROJECT = "com.bank:core-banking"
MAX_RATIO = 5.0
MAX_DAYS = 30
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

def get_debt_metrics():
    """Fetch SQALE debt ratio and remediation effort"""
    url = f"{SONAR_URL}/api/measures/component"
    params = {
        "component": PROJECT,
        "metricKeys": "sqale_debt_ratio,sqale_index,effort_to_reach_maintainability_rating_a"
    }
    r = requests.get(url, headers=HEADERS, params=params, timeout=15)
    r.raise_for_status()
    measures = r.json()["component"]["measures"]
    return {m["metric"]: float(m["value"]) for m in measures}

def check_module_debt(module_name):
    """Check debt ratio for a specific module"""
    url = f"{SONAR_URL}/api/measures/component"
    params = {
        "component": f"{PROJECT}:src/main/java/com/bank/{module_name}",
        "metricKeys": "sqale_debt_ratio"
    }
    r = requests.get(url, headers=HEADERS, params=params, timeout=15)
    r.raise_for_status()
    measures = r.json()["component"]["measures"]
    ratio = float(measures[0]["value"]) if measures else 0.0
    status = "PASS" if ratio <= MAX_RATIO else "FAIL"
    print(f"[{status}] Module {module_name}: debt ratio {ratio:.1f}% (max: {MAX_RATIO}%)")
    return ratio <= MAX_RATIO

def validate_debt():
    metrics = get_debt_metrics()
    ratio = metrics.get("sqale_debt_ratio", 0)
    effort_mins = metrics.get("sqale_index", 0)
    effort_days = effort_mins / (8 * 60)
    print(f"[INFO] Overall debt ratio: {ratio:.1f}%")
    print(f"[INFO] Remediation effort: {effort_days:.1f} days")
    assert ratio <= MAX_RATIO, f"Debt ratio {ratio}% > {MAX_RATIO}%"
    assert effort_days <= MAX_DAYS, f"Effort {effort_days:.1f}d > {MAX_DAYS}d"
    print("[PASS] Technical debt within limits")

    modules = ["payment", "settlement", "compliance"]
    all_ok = all(check_module_debt(m) for m in modules)
    assert all_ok, "One or more critical modules exceed debt threshold"

if __name__ == "__main__":
    validate_debt()
    print("\\nCQ-003: Technical Debt Analysis PASSED")`,
    expectedOutput: `[TEST] Technical Debt Ratio Analysis
[INFO] Project: com.bank:core-banking
[INFO] Overall debt ratio: 3.2%
[INFO] Remediation effort: 18.5 days
[PASS] Technical debt within limits
[INFO] Checking critical module debt ratios...
[PASS] Module payment: debt ratio 2.1% (max: 5.0%)
[PASS] Module settlement: debt ratio 4.3% (max: 5.0%)
[PASS] Module compliance: debt ratio 1.8% (max: 5.0%)
[INFO] Estimated sprint velocity: 12 story points
[INFO] Debt payoff estimate: 2.3 sprints
─────────────────────────────────
CQ-003: Technical Debt Analysis PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'CQ-004', title: 'Coverage Threshold Enforcement',
    category: 'Coverage', layer: 'SonarQube',
    framework: 'SonarQube / JaCoCo', language: 'Java',
    difficulty: 'Beginner',
    description: 'Enforce minimum code coverage thresholds across banking application modules using SonarQube and JaCoCo. Validate line coverage, branch coverage, and method coverage meet the mandated 80% minimum for production banking code.',
    prerequisites: 'JaCoCo agent configured in Maven/Gradle, SonarQube analysis with coverage import, Coverage exclusion rules defined',
    config: 'SONAR_URL=https://sonar.bank.local:9000\nPROJECT_KEY=com.bank:core-banking\nMIN_LINE_COVERAGE=80\nMIN_BRANCH_COVERAGE=75\nMIN_METHOD_COVERAGE=85\nEXCLUDE_PATTERNS=**/dto/**,**/config/**',
    code: `// CQ-004: Coverage Threshold Enforcement
// File: CoverageThresholdTest.java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.net.http.*;
import java.net.URI;
import com.google.gson.*;

public class CoverageThresholdTest {
    private static final String SONAR_URL = "https://sonar.bank.local:9000";
    private static final String PROJECT = "com.bank:core-banking";
    private static final double MIN_LINE = 80.0;
    private static final double MIN_BRANCH = 75.0;

    @Test
    void lineCoverageMeetsThreshold() throws Exception {
        double coverage = getMetric("line_coverage");
        assertTrue(coverage >= MIN_LINE,
            "Line coverage " + coverage + "% below " + MIN_LINE + "%");
        System.out.println("[PASS] Line coverage: " + coverage + "%");
    }

    @Test
    void branchCoverageMeetsThreshold() throws Exception {
        double coverage = getMetric("branch_coverage");
        assertTrue(coverage >= MIN_BRANCH,
            "Branch coverage " + coverage + "% below " + MIN_BRANCH + "%");
        System.out.println("[PASS] Branch coverage: " + coverage + "%");
    }

    @Test
    void newCodeCoverageOnPullRequest() throws Exception {
        double newCoverage = getMetric("new_coverage");
        assertTrue(newCoverage >= 80.0,
            "New code coverage " + newCoverage + "% below 80%");
        System.out.println("[PASS] New code coverage: " + newCoverage + "%");
    }

    private double getMetric(String key) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(SONAR_URL + "/api/measures/component?component="
                + PROJECT + "&metricKeys=" + key))
            .header("Authorization", "Bearer " + System.getenv("SONAR_AUTH_TOKEN"))
            .build();
        HttpResponse<String> resp = HttpClient.newHttpClient()
            .send(req, HttpResponse.BodyHandlers.ofString());
        JsonObject json = JsonParser.parseString(resp.body()).getAsJsonObject();
        return json.getAsJsonObject("component")
            .getAsJsonArray("measures").get(0).getAsJsonObject()
            .get("value").getAsDouble();
    }
}`,
    expectedOutput: `[TEST] Coverage Threshold Enforcement
[INFO] Project: com.bank:core-banking
[INFO] JaCoCo report imported successfully
[INFO] Checking line coverage...
[PASS] Line coverage: 84.2% (min: 80%)
[INFO] Checking branch coverage...
[PASS] Branch coverage: 78.6% (min: 75%)
[INFO] Checking new code coverage...
[PASS] New code coverage: 91.3% (min: 80%)
[INFO] Excluded patterns: **/dto/**, **/config/**
[INFO] Uncovered files: 3 (below threshold)
─────────────────────────────────
CQ-004: Coverage Threshold PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'CQ-005', title: 'Security Hotspot Review Status',
    category: 'Security', layer: 'SonarQube',
    framework: 'SonarQube / OWASP', language: 'Python',
    difficulty: 'Advanced',
    description: 'Verify all security hotspots flagged by SonarQube in banking code have been reviewed and resolved. Ensure no open hotspots exist in critical financial transaction modules, and validate that SQL injection, XSS, and authentication bypass patterns are caught.',
    prerequisites: 'SonarQube security rules enabled, OWASP Top 10 profile active, Security reviewer role assigned',
    config: 'SONAR_URL=https://sonar.bank.local:9000\nPROJECT_KEY=com.bank:payment-gateway\nMAX_OPEN_HOTSPOTS=0\nSECURITY_CATEGORIES=sql-injection,xss,auth\nREVIEW_REQUIRED=true',
    code: `#!/usr/bin/env python3
"""CQ-005: Security Hotspot Review Status"""
import requests, os, sys

SONAR_URL = "https://sonar.bank.local:9000"
TOKEN = os.environ["SONAR_AUTH_TOKEN"]
PROJECT = "com.bank:payment-gateway"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

def check_security_hotspots():
    """Verify all security hotspots are reviewed"""
    url = f"{SONAR_URL}/api/hotspots/search"
    params = {"projectKey": PROJECT, "status": "TO_REVIEW"}
    r = requests.get(url, headers=HEADERS, params=params, timeout=15)
    r.raise_for_status()
    data = r.json()
    to_review = data.get("paging", {}).get("total", 0)
    print(f"[INFO] Hotspots to review: {to_review}")
    assert to_review == 0, f"{to_review} unreviewed security hotspots"
    print("[PASS] All security hotspots reviewed")

def check_vulnerability_count():
    """Verify zero open vulnerabilities"""
    url = f"{SONAR_URL}/api/issues/search"
    params = {
        "componentKeys": PROJECT,
        "types": "VULNERABILITY",
        "statuses": "OPEN,CONFIRMED,REOPENED"
    }
    r = requests.get(url, headers=HEADERS, params=params, timeout=15)
    r.raise_for_status()
    total = r.json().get("total", 0)
    print(f"[INFO] Open vulnerabilities: {total}")
    assert total == 0, f"{total} open vulnerabilities found"
    print("[PASS] Zero open vulnerabilities")

def check_security_rating():
    """Verify security rating is A"""
    url = f"{SONAR_URL}/api/measures/component"
    params = {"component": PROJECT, "metricKeys": "security_rating"}
    r = requests.get(url, headers=HEADERS, params=params, timeout=15)
    r.raise_for_status()
    rating = r.json()["component"]["measures"][0]["value"]
    rating_map = {"1.0": "A", "2.0": "B", "3.0": "C", "4.0": "D", "5.0": "E"}
    letter = rating_map.get(rating, "Unknown")
    assert letter == "A", f"Security rating {letter} is not A"
    print(f"[PASS] Security rating: {letter}")

if __name__ == "__main__":
    check_security_hotspots()
    check_vulnerability_count()
    check_security_rating()
    print("\\nCQ-005: Security Hotspot Review PASSED")`,
    expectedOutput: `[TEST] Security Hotspot Review Status
[INFO] Project: com.bank:payment-gateway
[INFO] Scanning security hotspots...
[INFO] Hotspots to review: 0
[PASS] All security hotspots reviewed
[INFO] Checking open vulnerabilities...
[INFO] Open vulnerabilities: 0
[PASS] Zero open vulnerabilities
[INFO] Checking security rating...
[PASS] Security rating: A
[INFO] OWASP categories clear: sql-injection, xss, auth
[INFO] Last review: 2026-02-25 by security-team
─────────────────────────────────
CQ-005: Security Hotspot Review PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'CQ-006', title: 'Duplicated Code Block Detection',
    category: 'Duplication', layer: 'SonarQube',
    framework: 'SonarQube / CPD', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Detect and enforce limits on duplicated code blocks in banking applications. Validate that duplicated lines stay below the 3% threshold and that no critical business logic (transaction processing, interest calculation) contains copy-paste code.',
    prerequisites: 'SonarQube CPD analysis enabled, Duplication exclusion rules configured, Banking module classification',
    config: 'SONAR_URL=https://sonar.bank.local:9000\nPROJECT_KEY=com.bank:core-banking\nMAX_DUPLICATION_PCT=3.0\nMIN_TOKENS=100\nCRITICAL_PACKAGES=transaction,interest,compliance',
    code: `// CQ-006: Duplicated Code Block Detection
// File: DuplicationCheckTest.java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.net.http.*;
import java.net.URI;
import com.google.gson.*;

public class DuplicationCheckTest {
    private static final String SONAR_URL = "https://sonar.bank.local:9000";
    private static final String PROJECT = "com.bank:core-banking";
    private static final double MAX_DUP = 3.0;

    @Test
    void overallDuplicationBelowThreshold() throws Exception {
        double dupPct = getMetric("duplicated_lines_density");
        assertTrue(dupPct <= MAX_DUP,
            "Duplication " + dupPct + "% exceeds " + MAX_DUP + "%");
        System.out.println("[PASS] Overall duplication: " + dupPct + "%");
    }

    @Test
    void noDuplicationInCriticalPackages() throws Exception {
        String[] packages = {"transaction", "interest", "compliance"};
        for (String pkg : packages) {
            String component = PROJECT + ":src/main/java/com/bank/" + pkg;
            double dup = getModuleMetric(component, "duplicated_lines_density");
            assertEquals(0.0, dup, 0.1,
                "Critical package " + pkg + " has duplicated code: " + dup + "%");
            System.out.println("[PASS] Package " + pkg + ": 0% duplication");
        }
    }

    @Test
    void duplicatedBlockCountWithinLimit() throws Exception {
        double blocks = getMetric("duplicated_blocks");
        assertTrue(blocks <= 10,
            "Duplicated blocks " + blocks + " exceeds limit of 10");
        System.out.println("[PASS] Duplicated blocks: " + (int) blocks);
    }

    private double getMetric(String key) throws Exception {
        return getModuleMetric(PROJECT, key);
    }

    private double getModuleMetric(String comp, String key) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(SONAR_URL + "/api/measures/component?component="
                + comp + "&metricKeys=" + key))
            .header("Authorization", "Bearer " + System.getenv("SONAR_AUTH_TOKEN"))
            .build();
        HttpResponse<String> resp = HttpClient.newHttpClient()
            .send(req, HttpResponse.BodyHandlers.ofString());
        JsonArray measures = JsonParser.parseString(resp.body())
            .getAsJsonObject().getAsJsonObject("component")
            .getAsJsonArray("measures");
        return measures.size() > 0
            ? measures.get(0).getAsJsonObject().get("value").getAsDouble()
            : 0.0;
    }
}`,
    expectedOutput: `[TEST] Duplicated Code Block Detection
[INFO] Project: com.bank:core-banking
[INFO] CPD token threshold: 100
[INFO] Checking overall duplication...
[PASS] Overall duplication: 2.4% (max: 3.0%)
[INFO] Checking critical packages...
[PASS] Package transaction: 0% duplication
[PASS] Package interest: 0% duplication
[PASS] Package compliance: 0% duplication
[INFO] Checking duplicated block count...
[PASS] Duplicated blocks: 7 (max: 10)
[INFO] Largest block: 45 lines in ReportGenerator.java
─────────────────────────────────
CQ-006: Duplication Check PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'CQ-007', title: 'Cognitive Complexity Limits',
    category: 'Complexity', layer: 'SonarQube',
    framework: 'SonarQube / Maven', language: 'Python',
    difficulty: 'Advanced',
    description: 'Enforce cognitive complexity limits on banking methods to ensure code readability and maintainability. Validate that no single method exceeds a complexity of 15, and that critical payment processing methods stay below 10.',
    prerequisites: 'SonarQube cognitive complexity rule enabled, Method-level metrics available, Banking module classification',
    config: 'SONAR_URL=https://sonar.bank.local:9000\nPROJECT_KEY=com.bank:payment-gateway\nMAX_COMPLEXITY=15\nMAX_CRITICAL_COMPLEXITY=10\nCRITICAL_CLASSES=PaymentProcessor,SettlementEngine,FraudDetector',
    code: `#!/usr/bin/env python3
"""CQ-007: Cognitive Complexity Limits"""
import requests, os, json

SONAR_URL = "https://sonar.bank.local:9000"
TOKEN = os.environ["SONAR_AUTH_TOKEN"]
PROJECT = "com.bank:payment-gateway"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}
MAX_COMPLEXITY = 15
MAX_CRITICAL = 10

def get_high_complexity_methods():
    """Find methods exceeding complexity threshold"""
    url = f"{SONAR_URL}/api/issues/search"
    params = {
        "componentKeys": PROJECT,
        "rules": "java:S3776",
        "statuses": "OPEN,CONFIRMED"
    }
    r = requests.get(url, headers=HEADERS, params=params, timeout=15)
    r.raise_for_status()
    issues = r.json().get("issues", [])
    return issues

def check_overall_complexity():
    issues = get_high_complexity_methods()
    print(f"[INFO] Methods exceeding complexity threshold: {len(issues)}")
    for issue in issues:
        comp = issue.get("component", "").split(":")[-1]
        msg = issue.get("message", "")
        severity = issue.get("severity", "UNKNOWN")
        print(f"  [WARN] {comp}: {msg} (severity: {severity})")
    assert len(issues) == 0, f"{len(issues)} methods exceed complexity limit"
    print("[PASS] All methods within complexity limits")

def check_critical_class_complexity():
    """Check complexity in critical financial classes"""
    critical = ["PaymentProcessor", "SettlementEngine", "FraudDetector"]
    for cls in critical:
        url = f"{SONAR_URL}/api/measures/component_tree"
        params = {
            "component": PROJECT,
            "metricKeys": "cognitive_complexity",
            "q": cls,
            "qualifiers": "FIL"
        }
        r = requests.get(url, headers=HEADERS, params=params, timeout=15)
        r.raise_for_status()
        components = r.json().get("components", [])
        for comp in components:
            measures = comp.get("measures", [])
            complexity = float(measures[0]["value"]) if measures else 0
            status = "PASS" if complexity <= MAX_CRITICAL else "FAIL"
            print(f"[{status}] {cls}: complexity {complexity:.0f} (max: {MAX_CRITICAL})")
            assert complexity <= MAX_CRITICAL

if __name__ == "__main__":
    check_overall_complexity()
    check_critical_class_complexity()
    print("\\nCQ-007: Cognitive Complexity PASSED")`,
    expectedOutput: `[TEST] Cognitive Complexity Limits
[INFO] Project: com.bank:payment-gateway
[INFO] Max complexity: 15 (critical: 10)
[INFO] Methods exceeding complexity threshold: 0
[PASS] All methods within complexity limits
[INFO] Checking critical class complexity...
[PASS] PaymentProcessor: complexity 8 (max: 10)
[PASS] SettlementEngine: complexity 7 (max: 10)
[PASS] FraudDetector: complexity 9 (max: 10)
[INFO] Average project complexity: 4.3
[INFO] Highest non-critical method: ReportBuilder.generate (12)
─────────────────────────────────
CQ-007: Cognitive Complexity PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'CQ-008', title: 'SonarQube Custom Rule Validation',
    category: 'Custom Rules', layer: 'SonarQube',
    framework: 'SonarQube / Custom Plugin', language: 'Java',
    difficulty: 'Advanced',
    description: 'Validate custom SonarQube rules specific to banking applications are active and detecting violations. These rules cover banking-specific patterns like hardcoded account numbers, unencrypted PII logging, and missing audit trail annotations.',
    prerequisites: 'Custom SonarQube plugin deployed, Banking rule profile activated, Test code with known violations',
    config: 'SONAR_URL=https://sonar.bank.local:9000\nPROJECT_KEY=com.bank:core-banking\nCUSTOM_RULES=bank:HardcodedAccount,bank:PIILogging,bank:MissingAuditTrail\nPLUGIN_VERSION=2.1.0',
    code: `// CQ-008: SonarQube Custom Rule Validation
// File: CustomBankingRulesTest.java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.net.http.*;
import java.net.URI;
import com.google.gson.*;

public class CustomBankingRulesTest {
    private static final String SONAR_URL = "https://sonar.bank.local:9000";
    private static final String PROJECT = "com.bank:core-banking";
    private final HttpClient client = HttpClient.newHttpClient();

    @Test
    void customPluginIsInstalled() throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(SONAR_URL + "/api/plugins/installed"))
            .header("Authorization", "Bearer " + System.getenv("SONAR_AUTH_TOKEN"))
            .build();
        HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
        String body = resp.body();
        assertTrue(body.contains("banking-rules"),
            "Banking custom plugin not installed");
        System.out.println("[PASS] Banking custom plugin installed");
    }

    @Test
    void hardcodedAccountRuleActive() throws Exception {
        assertTrue(isRuleActive("bank:HardcodedAccount"),
            "HardcodedAccount rule not active");
        System.out.println("[PASS] Rule bank:HardcodedAccount is active");
    }

    @Test
    void piiLoggingRuleActive() throws Exception {
        assertTrue(isRuleActive("bank:PIILogging"),
            "PIILogging rule not active");
        System.out.println("[PASS] Rule bank:PIILogging is active");
    }

    @Test
    void missingAuditTrailRuleActive() throws Exception {
        assertTrue(isRuleActive("bank:MissingAuditTrail"),
            "MissingAuditTrail rule not active");
        System.out.println("[PASS] Rule bank:MissingAuditTrail is active");
    }

    @Test
    void noCustomRuleViolationsInProd() throws Exception {
        String[] rules = {"bank:HardcodedAccount", "bank:PIILogging", "bank:MissingAuditTrail"};
        for (String rule : rules) {
            int count = getViolationCount(rule);
            assertEquals(0, count, rule + " has " + count + " violations");
            System.out.println("[PASS] " + rule + ": 0 violations");
        }
    }

    private boolean isRuleActive(String ruleKey) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(SONAR_URL + "/api/rules/show?key=" + ruleKey))
            .header("Authorization", "Bearer " + System.getenv("SONAR_AUTH_TOKEN"))
            .build();
        HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
        return resp.statusCode() == 200;
    }

    private int getViolationCount(String rule) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(SONAR_URL + "/api/issues/search?componentKeys="
                + PROJECT + "&rules=" + rule + "&statuses=OPEN"))
            .header("Authorization", "Bearer " + System.getenv("SONAR_AUTH_TOKEN"))
            .build();
        HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
        return JsonParser.parseString(resp.body()).getAsJsonObject()
            .get("total").getAsInt();
    }
}`,
    expectedOutput: `[TEST] SonarQube Custom Rule Validation
[INFO] Project: com.bank:core-banking
[INFO] Plugin version: 2.1.0
[PASS] Banking custom plugin installed
[INFO] Validating custom rule activation...
[PASS] Rule bank:HardcodedAccount is active
[PASS] Rule bank:PIILogging is active
[PASS] Rule bank:MissingAuditTrail is active
[INFO] Checking for violations in production code...
[PASS] bank:HardcodedAccount: 0 violations
[PASS] bank:PIILogging: 0 violations
[PASS] bank:MissingAuditTrail: 0 violations
─────────────────────────────────
CQ-008: Custom Rule Validation PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'CQ-009', title: 'Multi-Branch Analysis Pipeline',
    category: 'CI Integration', layer: 'SonarQube',
    framework: 'SonarQube / Jenkins', language: 'Bash',
    difficulty: 'Intermediate',
    description: 'Validate that SonarQube multi-branch analysis is properly configured for all banking repository branches. Verify feature branches, release branches, and hotfix branches all trigger analysis and quality gate checks before merge.',
    prerequisites: 'SonarQube Developer Edition or higher, Jenkins CI pipeline configured, Branch analysis plugin enabled',
    config: 'SONAR_URL=https://sonar.bank.local:9000\nJENKINS_URL=https://jenkins.bank.local:8443\nPROJECT_KEY=com.bank:core-banking\nBRANCH_PATTERNS=feature/*,release/*,hotfix/*\nMAIN_BRANCH=main',
    code: `#!/bin/bash
# CQ-009: Multi-Branch Analysis Pipeline Validation
set -euo pipefail

SONAR_URL="https://sonar.bank.local:9000"
SONAR_TOKEN="\${SONAR_AUTH_TOKEN}"
PROJECT="com.bank:core-banking"
PASS=0; FAIL=0

echo "[TEST] Multi-Branch Analysis Pipeline"

# Check if multi-branch analysis is enabled
BRANCHES=$(curl -sf -H "Authorization: Bearer \$SONAR_TOKEN" \\
    "\$SONAR_URL/api/project_branches/list?project=\$PROJECT" | jq '.branches | length')
echo "[INFO] Total branches analyzed: \$BRANCHES"

if [ "\$BRANCHES" -gt 1 ]; then
    echo "[PASS] Multi-branch analysis active (\$BRANCHES branches)"
    ((PASS++))
else
    echo "[FAIL] Multi-branch analysis not configured"
    ((FAIL++))
fi

# Check main branch status
MAIN_STATUS=$(curl -sf -H "Authorization: Bearer \$SONAR_TOKEN" \\
    "\$SONAR_URL/api/project_branches/list?project=\$PROJECT" \\
    | jq -r '.branches[] | select(.name=="main") | .status.qualityGateStatus')
if [ "\$MAIN_STATUS" = "OK" ]; then
    echo "[PASS] Main branch quality gate: \$MAIN_STATUS"
    ((PASS++))
else
    echo "[FAIL] Main branch quality gate: \$MAIN_STATUS"
    ((FAIL++))
fi

# Verify feature branch analysis
for BRANCH in "feature/payment-v2" "feature/kyc-update"; do
    STATUS=$(curl -sf -H "Authorization: Bearer \$SONAR_TOKEN" \\
        "\$SONAR_URL/api/project_branches/list?project=\$PROJECT" \\
        | jq -r ".branches[] | select(.name==\\"\$BRANCH\\") | .status.qualityGateStatus")
    if [ -n "\$STATUS" ]; then
        echo "[PASS] Branch \$BRANCH analyzed: \$STATUS"
        ((PASS++))
    else
        echo "[WARN] Branch \$BRANCH not found in analysis"
    fi
done

# Check PR decoration is enabled
PR_DECORATION=$(curl -sf -H "Authorization: Bearer \$SONAR_TOKEN" \\
    "\$SONAR_URL/api/project_pull_requests/list?project=\$PROJECT" \\
    | jq '.pullRequests | length')
echo "[INFO] Pull requests with analysis: \$PR_DECORATION"

echo ""
echo "CQ-009: Multi-Branch Analysis — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Multi-Branch Analysis Pipeline
[INFO] Total branches analyzed: 5
[PASS] Multi-branch analysis active (5 branches)
[INFO] Checking main branch quality gate...
[PASS] Main branch quality gate: OK
[INFO] Checking feature branch analysis...
[PASS] Branch feature/payment-v2 analyzed: OK
[PASS] Branch feature/kyc-update analyzed: OK
[INFO] Pull requests with analysis: 3
[INFO] PR decoration: enabled (GitHub)
[INFO] Last analysis: 2026-02-27T08:15:00Z
─────────────────────────────────
CQ-009: Multi-Branch Analysis — 4 passed, 0 failed`
  },
  {
    id: 'CQ-010', title: 'SonarQube Profile Compliance Audit',
    category: 'Compliance', layer: 'SonarQube',
    framework: 'SonarQube / REST API', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Audit SonarQube quality profiles to ensure banking-mandated rules are activated. Verify that the active profile includes all PCI-DSS required rules, OWASP Top 10 coverage, and banking-specific coding standards for regulatory compliance.',
    prerequisites: 'SonarQube quality profile management access, PCI-DSS rule mapping document, Banking coding standards reference',
    config: 'SONAR_URL=https://sonar.bank.local:9000\nPROFILE_NAME=Banking-PCI-DSS\nLANGUAGE=java\nMIN_RULES=350\nREQUIRED_TAGS=pci-dss,owasp-top10,banking-standard',
    code: `#!/usr/bin/env python3
"""CQ-010: SonarQube Profile Compliance Audit"""
import requests, os, sys

SONAR_URL = "https://sonar.bank.local:9000"
TOKEN = os.environ["SONAR_AUTH_TOKEN"]
HEADERS = {"Authorization": f"Bearer {TOKEN}"}
PROFILE = "Banking-PCI-DSS"
LANGUAGE = "java"
MIN_RULES = 350

def check_profile_exists():
    """Verify banking quality profile exists and is active"""
    url = f"{SONAR_URL}/api/qualityprofiles/search"
    params = {"language": LANGUAGE}
    r = requests.get(url, headers=HEADERS, params=params, timeout=15)
    r.raise_for_status()
    profiles = r.json().get("profiles", [])
    banking = [p for p in profiles if p["name"] == PROFILE]
    assert len(banking) > 0, f"Profile '{PROFILE}' not found"
    profile = banking[0]
    print(f"[PASS] Profile '{PROFILE}' exists")
    print(f"[INFO] Active rules: {profile['activeRuleCount']}")
    print(f"[INFO] Is default: {profile['isDefault']}")
    return profile

def check_rule_count(profile):
    """Verify minimum rule count"""
    count = profile["activeRuleCount"]
    assert count >= MIN_RULES, f"Only {count} rules (min: {MIN_RULES})"
    print(f"[PASS] Rule count: {count} (min: {MIN_RULES})")

def check_required_tags():
    """Verify PCI-DSS and OWASP rules are activated"""
    required_tags = ["pci-dss", "owasp-top10", "cwe"]
    for tag in required_tags:
        url = f"{SONAR_URL}/api/rules/search"
        params = {
            "tags": tag,
            "activation": "true",
            "qprofile": PROFILE,
            "languages": LANGUAGE
        }
        r = requests.get(url, headers=HEADERS, params=params, timeout=15)
        r.raise_for_status()
        total = r.json().get("total", 0)
        assert total > 0, f"No active rules for tag '{tag}'"
        print(f"[PASS] Tag '{tag}': {total} active rules")

def check_profile_inheritance():
    """Verify profile inherits from Sonar way"""
    url = f"{SONAR_URL}/api/qualityprofiles/inheritance"
    params = {"language": LANGUAGE, "qualityProfile": PROFILE}
    r = requests.get(url, headers=HEADERS, params=params, timeout=15)
    r.raise_for_status()
    data = r.json()
    parent = data.get("profile", {}).get("parentName", "None")
    print(f"[INFO] Parent profile: {parent}")

if __name__ == "__main__":
    profile = check_profile_exists()
    check_rule_count(profile)
    check_required_tags()
    check_profile_inheritance()
    print("\\nCQ-010: Profile Compliance Audit PASSED")`,
    expectedOutput: `[TEST] SonarQube Profile Compliance Audit
[INFO] Language: java
[PASS] Profile 'Banking-PCI-DSS' exists
[INFO] Active rules: 412
[INFO] Is default: true
[PASS] Rule count: 412 (min: 350)
[INFO] Checking required rule tags...
[PASS] Tag 'pci-dss': 87 active rules
[PASS] Tag 'owasp-top10': 64 active rules
[PASS] Tag 'cwe': 156 active rules
[INFO] Parent profile: Sonar way
[INFO] Profile last updated: 2026-02-20
─────────────────────────────────
CQ-010: Profile Compliance Audit PASSED
Total: 5 passed, 0 failed`
  },

  /* ====== TAB 2: Static Analysis (CQ-011 to CQ-020) ====== */
  {
    id: 'CQ-011', title: 'ESLint Banking Rule Enforcement',
    category: 'Linting', layer: 'StaticAnalysis',
    framework: 'ESLint / Custom Rules', language: 'JavaScript',
    difficulty: 'Beginner',
    description: 'Validate ESLint configuration enforces banking-specific JavaScript rules for frontend banking applications. Check for no-eval, no-implied-eval, strict equality, and custom rules preventing hardcoded API endpoints and insecure localStorage usage.',
    prerequisites: 'ESLint 9.x installed, Custom banking ESLint plugin, Node.js 20+, .eslintrc.json configured',
    config: 'ESLINT_CONFIG=.eslintrc.json\nCUSTOM_PLUGIN=eslint-plugin-banking\nTARGET_DIR=src/\nMAX_ERRORS=0\nMAX_WARNINGS=10',
    code: `#!/usr/bin/env node
// CQ-011: ESLint Banking Rule Enforcement
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const TARGET = "src/";
const MAX_ERRORS = 0;
const MAX_WARNINGS = 10;

function runEslint() {
    console.log("[TEST] ESLint Banking Rule Enforcement");
    try {
        const result = execSync(
            \`npx eslint \${TARGET} --format json --max-warnings \${MAX_WARNINGS}\`,
            { encoding: "utf-8", timeout: 120000 }
        );
        const report = JSON.parse(result);
        let totalErrors = 0;
        let totalWarnings = 0;
        report.forEach(file => {
            totalErrors += file.errorCount;
            totalWarnings += file.warningCount;
        });
        console.log(\`[INFO] Files scanned: \${report.length}\`);
        console.log(\`[INFO] Errors: \${totalErrors}, Warnings: \${totalWarnings}\`);
        if (totalErrors > MAX_ERRORS) {
            console.log(\`[FAIL] Error count \${totalErrors} exceeds max \${MAX_ERRORS}\`);
            process.exit(1);
        }
        console.log("[PASS] No linting errors found");
    } catch (err) {
        console.log("[FAIL] ESLint execution failed: " + err.message);
        process.exit(1);
    }
}

function checkBankingPlugin() {
    const config = JSON.parse(fs.readFileSync(".eslintrc.json", "utf-8"));
    const plugins = config.plugins || [];
    if (!plugins.includes("banking")) {
        console.log("[FAIL] Banking ESLint plugin not configured");
        process.exit(1);
    }
    console.log("[PASS] Banking ESLint plugin active");
}

checkBankingPlugin();
runEslint();
console.log("\\nCQ-011: ESLint Enforcement PASSED");`,
    expectedOutput: `[TEST] ESLint Banking Rule Enforcement
[PASS] Banking ESLint plugin active
[INFO] Files scanned: 142
[INFO] Errors: 0, Warnings: 7
[PASS] No linting errors found
[INFO] Rule hits: no-eval(0), eqeqeq(2), banking/no-hardcoded-url(3)
[INFO] Auto-fixable warnings: 5
[INFO] Custom banking rules validated: 8
─────────────────────────────────
CQ-011: ESLint Enforcement PASSED
Total: 2 passed, 0 failed`
  },
  {
    id: 'CQ-012', title: 'Python Type Checking with mypy',
    category: 'Type Checking', layer: 'StaticAnalysis',
    framework: 'mypy / Python', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Enforce strict type checking on Python banking microservices using mypy. Validate that all function signatures have type annotations, no Any types are used in financial calculation modules, and return types are explicitly defined.',
    prerequisites: 'mypy 1.8+ installed, pyproject.toml with mypy config, Type stubs for dependencies, Banking module type annotations',
    config: 'MYPY_CONFIG=pyproject.toml\nSTRICT_MODE=true\nTARGET_MODULES=banking.payments,banking.compliance,banking.fraud\nDISALLOW_ANY_GENERICS=true\nDISALLOW_UNTYPED_DEFS=true',
    code: `#!/usr/bin/env python3
"""CQ-012: Python Type Checking with mypy"""
import subprocess, json, sys

MODULES = [
    "banking.payments",
    "banking.compliance",
    "banking.fraud"
]
MAX_ERRORS = 0

def run_mypy(module):
    """Run mypy strict mode on a banking module"""
    cmd = [
        "mypy", module,
        "--strict",
        "--disallow-any-generics",
        "--disallow-untyped-defs",
        "--warn-return-any",
        "--warn-unused-configs",
        "--no-implicit-reexport",
        "--output", "json"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    errors = []
    for line in result.stdout.strip().split("\\n"):
        if line.strip():
            try:
                entry = json.loads(line)
                if entry.get("severity") == "error":
                    errors.append(entry)
            except json.JSONDecodeError:
                if "error:" in line:
                    errors.append({"message": line})
    return errors

def check_type_coverage():
    """Check overall type annotation coverage"""
    cmd = ["mypy", "--txt-report", "/tmp/mypy_report", "banking/"]
    subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    try:
        with open("/tmp/mypy_report/linecount.txt") as f:
            lines = f.readlines()
            for line in lines:
                if "banking" in line:
                    parts = line.strip().split()
                    if len(parts) >= 3:
                        pct = float(parts[2])
                        print(f"[INFO] Type coverage: {pct:.1f}%")
                        assert pct >= 95.0, f"Coverage {pct}% < 95%"
                        print("[PASS] Type coverage meets threshold")
                        return
    except FileNotFoundError:
        print("[WARN] Could not generate coverage report")

if __name__ == "__main__":
    print("[TEST] Python Type Checking with mypy")
    all_errors = []
    for mod in MODULES:
        errors = run_mypy(mod)
        print(f"[INFO] Module {mod}: {len(errors)} errors")
        if errors:
            for e in errors[:3]:
                print(f"  [ERROR] {e.get('message', str(e))}")
        all_errors.extend(errors)
    total = len(all_errors)
    assert total == 0, f"{total} type errors found"
    print(f"[PASS] All modules pass strict type checking")
    check_type_coverage()
    print("\\nCQ-012: mypy Type Checking PASSED")`,
    expectedOutput: `[TEST] Python Type Checking with mypy
[INFO] Module banking.payments: 0 errors
[INFO] Module banking.compliance: 0 errors
[INFO] Module banking.fraud: 0 errors
[PASS] All modules pass strict type checking
[INFO] Type coverage: 97.3%
[PASS] Type coverage meets threshold
[INFO] No Any types in financial calculation modules
[INFO] All return types explicitly annotated
─────────────────────────────────
CQ-012: mypy Type Checking PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'CQ-013', title: 'Cyclomatic Complexity Metrics',
    category: 'Complexity Metrics', layer: 'StaticAnalysis',
    framework: 'Radon / Lizard', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Measure and enforce cyclomatic complexity limits on banking Python modules using Radon. Validate that no function exceeds complexity grade C, and critical payment functions remain at grade A or B for maintainability and testability.',
    prerequisites: 'Radon 6.x installed, Banking module source code, Complexity baseline document',
    config: 'RADON_MIN_GRADE=C\nCRITICAL_MAX_GRADE=B\nCRITICAL_MODULES=payments,transfers,settlement\nEXCLUDE=tests/,migrations/\nOUTPUT_FORMAT=json',
    code: `#!/usr/bin/env python3
"""CQ-013: Cyclomatic Complexity Metrics"""
import subprocess, json, sys

GRADE_MAP = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6}
MAX_GRADE = "C"
CRITICAL_MAX = "B"
CRITICAL_DIRS = ["banking/payments", "banking/transfers", "banking/settlement"]

def analyze_complexity(target_dir):
    """Run Radon cyclomatic complexity analysis"""
    cmd = ["radon", "cc", target_dir, "-j", "-n", "C", "--exclude", "tests/,migrations/"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError:
        return {}
    return data

def check_complexity():
    print("[TEST] Cyclomatic Complexity Metrics")
    violations = []
    total_functions = 0
    grade_counts = {"A": 0, "B": 0, "C": 0, "D": 0, "E": 0, "F": 0}

    data = analyze_complexity("banking/")
    for filepath, functions in data.items():
        for func in functions:
            total_functions += 1
            grade = func.get("rank", "A")
            grade_counts[grade] = grade_counts.get(grade, 0) + 1
            if GRADE_MAP.get(grade, 0) > GRADE_MAP[MAX_GRADE]:
                violations.append(f"{filepath}:{func['name']} (grade {grade})")

    print(f"[INFO] Total functions analyzed: {total_functions}")
    for g, c in sorted(grade_counts.items()):
        if c > 0:
            print(f"[INFO] Grade {g}: {c} functions")

    if violations:
        for v in violations:
            print(f"[FAIL] Complexity violation: {v}")
        sys.exit(1)
    print(f"[PASS] All functions within grade {MAX_GRADE}")

def check_critical_modules():
    for cdir in CRITICAL_DIRS:
        data = analyze_complexity(cdir)
        for filepath, functions in data.items():
            for func in functions:
                grade = func.get("rank", "A")
                if GRADE_MAP.get(grade, 0) > GRADE_MAP[CRITICAL_MAX]:
                    print(f"[FAIL] Critical module violation: {filepath}:{func['name']} grade {grade}")
                    sys.exit(1)
        module_name = cdir.split("/")[-1]
        print(f"[PASS] Critical module {module_name}: all functions grade <= {CRITICAL_MAX}")

if __name__ == "__main__":
    check_complexity()
    check_critical_modules()
    print("\\nCQ-013: Cyclomatic Complexity PASSED")`,
    expectedOutput: `[TEST] Cyclomatic Complexity Metrics
[INFO] Total functions analyzed: 287
[INFO] Grade A: 198 functions
[INFO] Grade B: 72 functions
[INFO] Grade C: 17 functions
[PASS] All functions within grade C
[INFO] Checking critical modules...
[PASS] Critical module payments: all functions grade <= B
[PASS] Critical module transfers: all functions grade <= B
[PASS] Critical module settlement: all functions grade <= B
[INFO] Average complexity: 3.4
─────────────────────────────────
CQ-013: Cyclomatic Complexity PASSED
Total: 4 passed, 0 failed`
  },
  {
    id: 'CQ-014', title: 'Dead Code Detection',
    category: 'Dead Code', layer: 'StaticAnalysis',
    framework: 'Vulture / Python', language: 'Python',
    difficulty: 'Beginner',
    description: 'Detect unreachable and unused code in banking Python applications using Vulture. Identify unused imports, functions, variables, and classes that increase attack surface and maintenance burden in financial software.',
    prerequisites: 'Vulture 2.x installed, Banking source code, Whitelist file for framework-required symbols',
    config: 'VULTURE_MIN_CONFIDENCE=80\nTARGET_DIR=banking/\nWHITELIST=vulture_whitelist.py\nEXCLUDE=tests/,migrations/,__pycache__/\nMAX_DEAD_CODE=5',
    code: `#!/usr/bin/env python3
"""CQ-014: Dead Code Detection"""
import subprocess, sys, re

TARGET = "banking/"
WHITELIST = "vulture_whitelist.py"
MIN_CONFIDENCE = 80
MAX_DEAD_CODE = 5

def run_vulture():
    """Run Vulture dead code detection"""
    print("[TEST] Dead Code Detection")
    cmd = [
        "vulture", TARGET, WHITELIST,
        "--min-confidence", str(MIN_CONFIDENCE),
        "--exclude", "tests/,migrations/,__pycache__/"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    findings = []
    for line in result.stdout.strip().split("\\n"):
        if line.strip():
            findings.append(line.strip())
    return findings

def categorize_findings(findings):
    """Categorize dead code by type"""
    categories = {
        "unused import": [],
        "unused function": [],
        "unused variable": [],
        "unused class": [],
        "unreachable code": [],
        "other": []
    }
    for f in findings:
        categorized = False
        for cat in categories:
            if cat in f.lower():
                categories[cat].append(f)
                categorized = True
                break
        if not categorized:
            categories["other"].append(f)
    return categories

if __name__ == "__main__":
    findings = run_vulture()
    categories = categorize_findings(findings)

    total = len(findings)
    print(f"[INFO] Dead code findings: {total} (max: {MAX_DEAD_CODE})")
    for cat, items in categories.items():
        if items:
            print(f"[INFO] {cat}: {len(items)}")
            for item in items[:2]:
                print(f"  -> {item}")

    if total > MAX_DEAD_CODE:
        print(f"[FAIL] Dead code count {total} exceeds limit {MAX_DEAD_CODE}")
        sys.exit(1)
    print(f"[PASS] Dead code within threshold ({total}/{MAX_DEAD_CODE})")
    print("\\nCQ-014: Dead Code Detection PASSED")`,
    expectedOutput: `[TEST] Dead Code Detection
[INFO] Dead code findings: 3 (max: 5)
[INFO] unused import: 2
  -> banking/utils/legacy.py:4: unused import 'datetime'
  -> banking/reports/export.py:7: unused import 'csv'
[INFO] unused function: 1
  -> banking/utils/helpers.py:45: unused function 'format_legacy_date'
[PASS] Dead code within threshold (3/5)
[INFO] Confidence level: 80%+
[INFO] Whitelist entries: 12 (framework symbols)
─────────────────────────────────
CQ-014: Dead Code Detection PASSED
Total: 1 passed, 0 failed`
  },
  {
    id: 'CQ-015', title: 'Bandit Security Linting',
    category: 'Security Linting', layer: 'StaticAnalysis',
    framework: 'Bandit / Python', language: 'Python',
    difficulty: 'Advanced',
    description: 'Run Bandit security linter on banking Python code to detect common security issues. Validate zero high-severity and medium-severity findings for hardcoded passwords, SQL injection patterns, insecure deserialization, and weak cryptography usage.',
    prerequisites: 'Bandit 1.7+ installed, Banking source code, Bandit configuration file with banking-specific exclusions',
    config: 'BANDIT_CONFIG=.bandit.yml\nTARGET=banking/\nSEVERITY_THRESHOLD=MEDIUM\nCONFIDENCE_THRESHOLD=HIGH\nEXCLUDE=tests/\nSKIP_IDS=B101',
    code: `#!/usr/bin/env python3
"""CQ-015: Bandit Security Linting"""
import subprocess, json, sys

TARGET = "banking/"
EXCLUDE = "tests/"

def run_bandit():
    """Run Bandit with JSON output"""
    print("[TEST] Bandit Security Linting")
    cmd = [
        "bandit", "-r", TARGET,
        "--exclude", EXCLUDE,
        "-f", "json",
        "-ll",
        "--confidence-level", "HIGH",
        "-s", "B101"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    try:
        report = json.loads(result.stdout)
    except json.JSONDecodeError:
        print("[FAIL] Could not parse Bandit output")
        sys.exit(1)
    return report

def analyze_report(report):
    """Analyze Bandit report for violations"""
    results = report.get("results", [])
    metrics = report.get("metrics", {}).get("_totals", {})
    print(f"[INFO] Files scanned: {metrics.get('loc', 0)} lines of code")
    print(f"[INFO] Files analyzed: {metrics.get('nosec', 0)} nosec comments")

    severity_counts = {"HIGH": 0, "MEDIUM": 0, "LOW": 0}
    for finding in results:
        sev = finding.get("issue_severity", "LOW")
        severity_counts[sev] = severity_counts.get(sev, 0) + 1

    for sev, count in severity_counts.items():
        status = "PASS" if (sev == "LOW" or count == 0) else "FAIL"
        print(f"[{status}] {sev} severity findings: {count}")

    critical = severity_counts["HIGH"] + severity_counts["MEDIUM"]
    if critical > 0:
        print(f"[FAIL] {critical} high/medium findings detected")
        for f in results:
            if f["issue_severity"] in ("HIGH", "MEDIUM"):
                print(f"  [ALERT] {f['filename']}:{f['line_number']} - "
                      f"{f['issue_text']} ({f['test_id']})")
        sys.exit(1)
    print("[PASS] Zero high/medium security findings")

def check_banking_specific():
    """Check for banking-specific security patterns"""
    patterns = [
        ("B608", "SQL injection via string formatting"),
        ("B301", "Pickle deserialization"),
        ("B324", "Weak hash (MD5/SHA1)"),
        ("B105", "Hardcoded password")
    ]
    for test_id, desc in patterns:
        cmd = ["bandit", "-r", TARGET, "-t", test_id, "-f", "json"]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        report = json.loads(result.stdout)
        count = len(report.get("results", []))
        status = "PASS" if count == 0 else "FAIL"
        print(f"[{status}] {desc} ({test_id}): {count} findings")

if __name__ == "__main__":
    report = run_bandit()
    analyze_report(report)
    check_banking_specific()
    print("\\nCQ-015: Bandit Security Linting PASSED")`,
    expectedOutput: `[TEST] Bandit Security Linting
[INFO] Files scanned: 14520 lines of code
[INFO] Files analyzed: 3 nosec comments
[PASS] HIGH severity findings: 0
[PASS] MEDIUM severity findings: 0
[PASS] LOW severity findings: 4
[PASS] Zero high/medium security findings
[INFO] Checking banking-specific patterns...
[PASS] SQL injection via string formatting (B608): 0 findings
[PASS] Pickle deserialization (B301): 0 findings
[PASS] Weak hash (MD5/SHA1) (B324): 0 findings
[PASS] Hardcoded password (B105): 0 findings
─────────────────────────────────
CQ-015: Bandit Security Linting PASSED
Total: 6 passed, 0 failed`
  },
  {
    id: 'CQ-016', title: 'SpotBugs Java Static Analysis',
    category: 'Bug Detection', layer: 'StaticAnalysis',
    framework: 'SpotBugs / Maven', language: 'Java',
    difficulty: 'Intermediate',
    description: 'Run SpotBugs static analysis on banking Java applications to detect potential bugs including null pointer dereferences, resource leaks, infinite loops, and concurrency issues in transaction processing code.',
    prerequisites: 'SpotBugs 4.x Maven plugin, Banking project compiled, FindSecBugs plugin for security bugs',
    config: 'SPOTBUGS_EFFORT=max\nSPOTBUGS_THRESHOLD=low\nINCLUDE_FILTER=spotbugs-include.xml\nEXCLUDE_FILTER=spotbugs-exclude.xml\nPLUGINS=com.h3xstream.findsecbugs:findsecbugs-plugin:1.12.0',
    code: `// CQ-016: SpotBugs Java Static Analysis
// File: SpotBugsValidationTest.java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.io.*;
import javax.xml.parsers.*;
import org.w3c.dom.*;

public class SpotBugsValidationTest {
    private static final String REPORT = "target/spotbugsXml.xml";

    @BeforeAll
    static void runAnalysis() throws Exception {
        ProcessBuilder pb = new ProcessBuilder(
            "mvn", "spotbugs:check",
            "-Dspotbugs.effort=max",
            "-Dspotbugs.threshold=low"
        );
        pb.inheritIO();
        Process p = pb.start();
        int exitCode = p.waitFor();
        System.out.println("[INFO] SpotBugs analysis exit code: " + exitCode);
    }

    @Test
    void noHighPriorityBugs() throws Exception {
        Document doc = parseReport();
        NodeList bugs = doc.getElementsByTagName("BugInstance");
        int highCount = 0;
        for (int i = 0; i < bugs.getLength(); i++) {
            Element bug = (Element) bugs.item(i);
            int priority = Integer.parseInt(bug.getAttribute("priority"));
            if (priority == 1) highCount++;
        }
        assertEquals(0, highCount, "High priority bugs: " + highCount);
        System.out.println("[PASS] High priority bugs: " + highCount);
    }

    @Test
    void noSecurityBugs() throws Exception {
        Document doc = parseReport();
        NodeList bugs = doc.getElementsByTagName("BugInstance");
        int secCount = 0;
        for (int i = 0; i < bugs.getLength(); i++) {
            Element bug = (Element) bugs.item(i);
            String category = bug.getAttribute("category");
            if ("SECURITY".equals(category)) secCount++;
        }
        assertEquals(0, secCount, "Security bugs: " + secCount);
        System.out.println("[PASS] Security bugs: " + secCount);
    }

    @Test
    void totalBugsBelowThreshold() throws Exception {
        Document doc = parseReport();
        int total = doc.getElementsByTagName("BugInstance").getLength();
        assertTrue(total <= 20, "Total bugs " + total + " > 20");
        System.out.println("[PASS] Total bugs: " + total + " (max: 20)");
    }

    private Document parseReport() throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(new File(REPORT));
    }
}`,
    expectedOutput: `[TEST] SpotBugs Java Static Analysis
[INFO] SpotBugs analysis exit code: 0
[INFO] Analysis effort: max, threshold: low
[INFO] FindSecBugs plugin: active
[PASS] High priority bugs: 0
[PASS] Security bugs: 0
[PASS] Total bugs: 12 (max: 20)
[INFO] Bug categories: STYLE(8), PERFORMANCE(3), CORRECTNESS(1)
[INFO] FindSecBugs categories checked: 128 patterns
[INFO] No null pointer risks in transaction handlers
─────────────────────────────────
CQ-016: SpotBugs Analysis PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'CQ-017', title: 'Checkstyle Coding Standard',
    category: 'Code Style', layer: 'StaticAnalysis',
    framework: 'Checkstyle / Maven', language: 'Java',
    difficulty: 'Beginner',
    description: 'Enforce Java coding standards for banking applications using Checkstyle with a custom banking ruleset. Validate naming conventions, Javadoc requirements, import ordering, and line length limits comply with the organization coding standard.',
    prerequisites: 'Checkstyle 10.x Maven plugin, Custom banking checkstyle.xml, Suppression filter file',
    config: 'CHECKSTYLE_CONFIG=config/checkstyle/banking-checks.xml\nSUPPRESSIONS=config/checkstyle/suppressions.xml\nMAX_VIOLATIONS=0\nFAIL_ON_VIOLATION=true',
    code: `#!/bin/bash
# CQ-017: Checkstyle Coding Standard Validation
set -euo pipefail

echo "[TEST] Checkstyle Coding Standard"
PASS=0; FAIL=0

# Run Checkstyle via Maven
echo "[INFO] Running Checkstyle analysis..."
mvn checkstyle:check \\
    -Dcheckstyle.config.location=config/checkstyle/banking-checks.xml \\
    -Dcheckstyle.suppressions.location=config/checkstyle/suppressions.xml \\
    -Dcheckstyle.failOnViolation=false \\
    -q 2>&1 | tee /tmp/checkstyle_output.txt

# Parse results from target
if [ -f target/checkstyle-result.xml ]; then
    ERRORS=$(grep -c '<error' target/checkstyle-result.xml || echo 0)
    echo "[INFO] Total violations: \$ERRORS"

    if [ "\$ERRORS" -eq 0 ]; then
        echo "[PASS] Zero Checkstyle violations"
        ((PASS++))
    else
        echo "[FAIL] \$ERRORS Checkstyle violations found"
        ((FAIL++))
        # Show top violations
        grep '<error' target/checkstyle-result.xml \\
            | sed 's/.*message="//' | sed 's/".*//' \\
            | sort | uniq -c | sort -rn | head -5 \\
            | while read COUNT MSG; do
                echo "  [\$COUNT] \$MSG"
            done
    fi
else
    echo "[FAIL] Checkstyle report not generated"
    ((FAIL++))
fi

# Verify naming conventions
NAMING_ISSUES=$(grep -c 'naming' /tmp/checkstyle_output.txt 2>/dev/null || echo 0)
if [ "\$NAMING_ISSUES" -eq 0 ]; then
    echo "[PASS] Naming conventions compliant"
    ((PASS++))
fi

# Check Javadoc coverage
JAVADOC_ISSUES=$(grep -c 'Javadoc' target/checkstyle-result.xml 2>/dev/null || echo 0)
echo "[INFO] Javadoc issues: \$JAVADOC_ISSUES"

echo ""
echo "CQ-017: Checkstyle Validation — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Checkstyle Coding Standard
[INFO] Running Checkstyle analysis...
[INFO] Total violations: 0
[PASS] Zero Checkstyle violations
[PASS] Naming conventions compliant
[INFO] Javadoc issues: 0
[INFO] Config: config/checkstyle/banking-checks.xml
[INFO] Files checked: 94
[INFO] Lines checked: 12,450
─────────────────────────────────
CQ-017: Checkstyle Validation — 2 passed, 0 failed`
  },
  {
    id: 'CQ-018', title: 'Dependency Vulnerability Scan',
    category: 'Dependency Audit', layer: 'StaticAnalysis',
    framework: 'pip-audit / OWASP Dependency-Check', language: 'Python',
    difficulty: 'Advanced',
    description: 'Scan banking application dependencies for known vulnerabilities using pip-audit and OWASP Dependency-Check. Validate zero critical and high vulnerabilities exist in production dependencies, and generate SBOM for audit trail.',
    prerequisites: 'pip-audit installed, OWASP Dependency-Check CLI, requirements.txt with pinned versions, NVD API key',
    config: 'PIP_AUDIT_STRICT=true\nOWASP_DC_PATH=/opt/dependency-check/bin\nNVD_API_KEY=env:NVD_API_KEY\nFAIL_ON_CVSS=7.0\nSBOM_OUTPUT=sbom.json',
    code: `#!/usr/bin/env python3
"""CQ-018: Dependency Vulnerability Scan"""
import subprocess, json, sys

def run_pip_audit():
    """Run pip-audit for Python dependency vulnerabilities"""
    print("[TEST] Dependency Vulnerability Scan")
    cmd = ["pip-audit", "--format", "json", "--strict", "--desc"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    try:
        report = json.loads(result.stdout)
    except json.JSONDecodeError:
        if result.returncode == 0:
            print("[PASS] pip-audit found no vulnerabilities")
            return []
        print("[FAIL] pip-audit failed to produce output")
        sys.exit(1)
    return report.get("dependencies", [])

def analyze_vulnerabilities(deps):
    """Analyze vulnerability findings"""
    vulns = []
    for dep in deps:
        for vuln in dep.get("vulns", []):
            vulns.append({
                "package": dep["name"],
                "version": dep["version"],
                "vuln_id": vuln.get("id", ""),
                "fix_versions": vuln.get("fix_versions", []),
                "description": vuln.get("description", "")[:100]
            })
    critical = [v for v in vulns if "CRITICAL" in v.get("description", "").upper()]
    high = [v for v in vulns if "HIGH" in v.get("description", "").upper()]
    print(f"[INFO] Total dependencies scanned: {len(deps)}")
    print(f"[INFO] Vulnerabilities found: {len(vulns)}")
    print(f"[INFO] Critical: {len(critical)}, High: {len(high)}")

    if critical or high:
        for v in (critical + high)[:5]:
            print(f"  [ALERT] {v['package']}=={v['version']}: {v['vuln_id']}")
            if v['fix_versions']:
                print(f"    Fix: upgrade to {v['fix_versions'][0]}")
        sys.exit(1)
    print("[PASS] No critical or high vulnerabilities")

def generate_sbom():
    """Generate Software Bill of Materials"""
    cmd = ["pip-audit", "--format", "json", "--output", "sbom.json"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    if result.returncode == 0:
        print("[PASS] SBOM generated: sbom.json")
    else:
        print("[WARN] SBOM generation failed")

if __name__ == "__main__":
    deps = run_pip_audit()
    analyze_vulnerabilities(deps)
    generate_sbom()
    print("\\nCQ-018: Dependency Scan PASSED")`,
    expectedOutput: `[TEST] Dependency Vulnerability Scan
[INFO] Total dependencies scanned: 87
[INFO] Vulnerabilities found: 0
[INFO] Critical: 0, High: 0
[PASS] No critical or high vulnerabilities
[PASS] SBOM generated: sbom.json
[INFO] All dependencies have pinned versions
[INFO] Last NVD database update: 2026-02-27
[INFO] Audit trail logged to compliance/dep-audit.log
─────────────────────────────────
CQ-018: Dependency Scan PASSED
Total: 2 passed, 0 failed`
  },
  {
    id: 'CQ-019', title: 'Ruff Linter Speed Validation',
    category: 'Fast Linting', layer: 'StaticAnalysis',
    framework: 'Ruff / Python', language: 'Python',
    difficulty: 'Beginner',
    description: 'Validate Ruff linter configuration for high-speed Python linting of banking codebases. Verify all banking-mandated rule categories are enabled (E, F, I, N, W, UP, S, B) and that linting completes within acceptable time limits for CI pipeline efficiency.',
    prerequisites: 'Ruff 0.4+ installed, pyproject.toml with ruff config, Banking Python codebase',
    config: 'RUFF_CONFIG=pyproject.toml\nTARGET=banking/\nMAX_LINT_TIME_SEC=10\nRULE_SETS=E,F,I,N,W,UP,S,B,A,C4,SIM\nLINE_LENGTH=120',
    code: `#!/usr/bin/env python3
"""CQ-019: Ruff Linter Speed Validation"""
import subprocess, json, sys, time

TARGET = "banking/"
MAX_TIME = 10.0
REQUIRED_RULES = ["E", "F", "I", "N", "W", "UP", "S", "B"]

def check_ruff_config():
    """Verify Ruff configuration has required rule sets"""
    cmd = ["ruff", "config", "lint.select"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
    configured = result.stdout.strip()
    print(f"[INFO] Configured rules: {configured}")
    for rule in REQUIRED_RULES:
        if rule not in configured:
            print(f"[FAIL] Required rule set '{rule}' not configured")
            sys.exit(1)
    print("[PASS] All required rule sets configured")

def run_ruff_timed():
    """Run Ruff and measure execution time"""
    start = time.time()
    cmd = ["ruff", "check", TARGET, "--output-format", "json", "--statistics"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    elapsed = time.time() - start
    print(f"[INFO] Lint time: {elapsed:.2f}s (max: {MAX_TIME}s)")
    if elapsed > MAX_TIME:
        print(f"[FAIL] Linting took {elapsed:.2f}s > {MAX_TIME}s")
        sys.exit(1)
    print(f"[PASS] Linting completed in {elapsed:.2f}s")
    return result

def analyze_results(result):
    """Parse and report Ruff findings"""
    try:
        findings = json.loads(result.stdout) if result.stdout.strip() else []
    except json.JSONDecodeError:
        findings = []
    errors = [f for f in findings if f.get("fix", {}).get("applicability") != "safe"]
    fixable = [f for f in findings if f.get("fix", {}).get("applicability") == "safe"]
    print(f"[INFO] Total findings: {len(findings)}")
    print(f"[INFO] Auto-fixable: {len(fixable)}")
    print(f"[INFO] Manual fix needed: {len(errors)}")
    if errors:
        for e in errors[:3]:
            print(f"  [WARN] {e.get('filename','')}:{e.get('location',{}).get('row','')} "
                  f"- {e.get('code','')} {e.get('message','')}")
    return len(errors) == 0

if __name__ == "__main__":
    print("[TEST] Ruff Linter Speed Validation")
    check_ruff_config()
    result = run_ruff_timed()
    clean = analyze_results(result)
    if clean:
        print("[PASS] Zero non-fixable issues")
    print("\\nCQ-019: Ruff Linter Validation PASSED")`,
    expectedOutput: `[TEST] Ruff Linter Speed Validation
[INFO] Configured rules: ["E", "F", "I", "N", "W", "UP", "S", "B", "A", "C4", "SIM"]
[PASS] All required rule sets configured
[INFO] Lint time: 0.42s (max: 10s)
[PASS] Linting completed in 0.42s
[INFO] Total findings: 3
[INFO] Auto-fixable: 3
[INFO] Manual fix needed: 0
[PASS] Zero non-fixable issues
[INFO] Line length: 120 configured
[INFO] Target Python version: 3.11
─────────────────────────────────
CQ-019: Ruff Linter Validation PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'CQ-020', title: 'YAML/Config Lint Validation',
    category: 'Config Linting', layer: 'StaticAnalysis',
    framework: 'yamllint / hadolint', language: 'YAML',
    difficulty: 'Intermediate',
    description: 'Validate YAML configuration files and Dockerfiles in banking infrastructure-as-code repositories. Check for proper indentation, no duplicate keys, valid anchors, and Dockerfile best practices including non-root users and health checks.',
    prerequisites: 'yamllint installed, hadolint installed, CI/CD YAML files, Dockerfiles for banking services',
    config: 'YAMLLINT_CONFIG=.yamllint.yml\nHADOLINT_CONFIG=.hadolint.yaml\nYAML_DIRS=config/,deploy/,.github/\nDOCKERFILE_DIRS=docker/\nMAX_WARNINGS=5',
    code: `#!/bin/bash
# CQ-020: YAML/Config Lint Validation
set -euo pipefail

echo "[TEST] YAML/Config Lint Validation"
PASS=0; FAIL=0; WARN=0

# Lint all YAML files
echo "[INFO] Scanning YAML files..."
YAML_FILES=$(find config/ deploy/ .github/ -name "*.yml" -o -name "*.yaml" 2>/dev/null)
YAML_COUNT=$(echo "\$YAML_FILES" | wc -l)
echo "[INFO] YAML files found: \$YAML_COUNT"

YAML_ERRORS=$(yamllint -f parsable \$YAML_FILES 2>&1 | grep -c "error" || echo 0)
YAML_WARNINGS=$(yamllint -f parsable \$YAML_FILES 2>&1 | grep -c "warning" || echo 0)

if [ "\$YAML_ERRORS" -eq 0 ]; then
    echo "[PASS] YAML files: 0 errors"
    ((PASS++))
else
    echo "[FAIL] YAML files: \$YAML_ERRORS errors"
    ((FAIL++))
    yamllint -f parsable \$YAML_FILES 2>&1 | grep "error" | head -5
fi
echo "[INFO] YAML warnings: \$YAML_WARNINGS"

# Lint Dockerfiles
echo "[INFO] Scanning Dockerfiles..."
DOCKERFILES=$(find docker/ -name "Dockerfile*" 2>/dev/null)
for DF in \$DOCKERFILES; do
    ISSUES=$(hadolint "\$DF" --format json 2>/dev/null | jq 'length')
    if [ "\$ISSUES" -eq 0 ]; then
        echo "[PASS] \$DF: 0 issues"
        ((PASS++))
    else
        SEVERITY=$(hadolint "\$DF" --format json 2>/dev/null \\
            | jq '[.[] | select(.level=="error")] | length')
        if [ "\$SEVERITY" -gt 0 ]; then
            echo "[FAIL] \$DF: \$SEVERITY errors"
            ((FAIL++))
        else
            echo "[WARN] \$DF: \$ISSUES warnings"
            ((WARN++))
        fi
    fi
done

# Check for non-root user in Dockerfiles
for DF in \$DOCKERFILES; do
    if grep -q "^USER " "\$DF"; then
        echo "[PASS] \$DF: non-root USER directive found"
        ((PASS++))
    else
        echo "[FAIL] \$DF: missing USER directive (non-root)"
        ((FAIL++))
    fi
done

echo ""
echo "CQ-020: Config Lint — \$PASS passed, \$FAIL failed, \$WARN warnings"`,
    expectedOutput: `[TEST] YAML/Config Lint Validation
[INFO] Scanning YAML files...
[INFO] YAML files found: 18
[PASS] YAML files: 0 errors
[INFO] YAML warnings: 2
[INFO] Scanning Dockerfiles...
[PASS] docker/Dockerfile.api: 0 issues
[PASS] docker/Dockerfile.worker: 0 issues
[PASS] docker/Dockerfile.api: non-root USER directive found
[PASS] docker/Dockerfile.worker: non-root USER directive found
[INFO] Indentation: consistent 2-space
[INFO] No duplicate keys detected
─────────────────────────────────
CQ-020: Config Lint — 4 passed, 0 failed, 0 warnings`
  },

  /* ====== TAB 3: Code Review Automation (CQ-021 to CQ-030) ====== */
  {
    id: 'CQ-021', title: 'Pull Request Size Gate',
    category: 'PR Checks', layer: 'CodeReview',
    framework: 'GitHub Actions / Danger.js', language: 'JavaScript',
    difficulty: 'Beginner',
    description: 'Enforce pull request size limits for banking code changes. Validate that PRs do not exceed 400 lines of code changes to ensure thorough review. Flag large PRs with warnings and block merges for PRs exceeding 800 lines.',
    prerequisites: 'GitHub Actions configured, Danger.js installed, Branch protection rules enabled, PR template defined',
    config: 'WARN_LINES=400\nBLOCK_LINES=800\nEXCLUDE_PATTERNS=*.lock,*.generated.*,package-lock.json\nDANGER_GITHUB_API_TOKEN=env:GITHUB_TOKEN',
    code: `// CQ-021: Pull Request Size Gate — Dangerfile.js
const { danger, warn, fail, message } = require("danger");

const WARN_LINES = 400;
const BLOCK_LINES = 800;
const EXCLUDE = [/\\.lock$/, /\\.generated\\./, /package-lock\\.json/];

async function checkPRSize() {
    const diff = danger.github.pr.additions + danger.github.pr.deletions;
    const files = danger.git.modified_files.concat(danger.git.created_files);
    const filtered = files.filter(
        f => !EXCLUDE.some(pattern => pattern.test(f))
    );
    const filteredDiff = filtered.length;

    message(\`PR touches \${filtered.length} files (\${diff} lines changed)\`);

    if (diff > BLOCK_LINES) {
        fail(
            \`PR is too large: \${diff} lines changed (max: \${BLOCK_LINES}). \`
            + "Please split into smaller PRs for banking code review compliance."
        );
    } else if (diff > WARN_LINES) {
        warn(
            \`PR is large: \${diff} lines changed (recommended max: \${WARN_LINES}). \`
            + "Consider splitting for more thorough review."
        );
    } else {
        message(\`PR size OK: \${diff} lines (threshold: \${WARN_LINES})\`);
    }

    // Check for test files
    const testFiles = filtered.filter(f => /test/i.test(f));
    if (testFiles.length === 0 && filtered.length > 0) {
        warn("No test files modified. Banking PRs should include tests.");
    } else {
        message(\`Test files included: \${testFiles.length}\`);
    }
}

checkPRSize();
console.log("\\nCQ-021: PR Size Gate validation complete");`,
    expectedOutput: `[TEST] Pull Request Size Gate
[INFO] PR #247: feature/payment-validation
[INFO] Files changed: 8 (filtered from 10)
[INFO] Lines changed: 312 (additions: 245, deletions: 67)
[PASS] PR size OK: 312 lines (threshold: 400)
[INFO] Test files included: 3
[INFO] Excluded: package-lock.json, schema.generated.ts
[PASS] PR meets banking review size requirements
[INFO] Auto-label applied: size/M
─────────────────────────────────
CQ-021: PR Size Gate PASSED
Total: 2 passed, 0 failed`
  },
  {
    id: 'CQ-022', title: 'Automated Code Review Bot',
    category: 'Automated Reviews', layer: 'CodeReview',
    framework: 'GitHub Actions / reviewdog', language: 'YAML',
    difficulty: 'Intermediate',
    description: 'Configure reviewdog to automatically post inline review comments on pull requests for banking repositories. Integrate with ESLint, Checkstyle, and custom banking rules to provide actionable review comments directly on changed lines.',
    prerequisites: 'GitHub Actions access, reviewdog installed, Linter configurations, Repository write permissions',
    config: 'REVIEWDOG_REPORTER=github-pr-review\nLEVEL=warning\nFILTER_MODE=added\nFAIL_ON_ERROR=true\nGITHUB_TOKEN=env:GITHUB_TOKEN',
    code: `# CQ-022: Automated Code Review Bot
# File: .github/workflows/reviewdog.yml
name: Automated Code Review
on: [pull_request]

jobs:
  eslint-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - uses: reviewdog/action-eslint@v1
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          reporter: github-pr-review
          eslint_flags: "src/ --ext .js,.jsx,.ts,.tsx"
          level: warning
          filter_mode: added
          fail_on_error: true

  checkstyle-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: "21"
          distribution: "temurin"
      - run: mvn checkstyle:checkstyle -q
      - uses: reviewdog/action-checkstyle@v1
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          reporter: github-pr-review
          level: warning
          filter_mode: added

  banking-rules:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run banking-specific checks
        run: |
          echo "[INFO] Checking for hardcoded credentials..."
          if grep -rn "password\\s*=" --include="*.java" src/; then
            echo "::error::Hardcoded credentials detected"
            exit 1
          fi
          echo "[PASS] No hardcoded credentials"
          echo "[INFO] Checking for System.out.println..."
          COUNT=$(grep -rn "System.out.println" --include="*.java" src/ | wc -l)
          if [ "\$COUNT" -gt 0 ]; then
            echo "::warning::\$COUNT instances of System.out.println found"
          fi
          echo "[PASS] Banking rule checks complete"`,
    expectedOutput: `[TEST] Automated Code Review Bot
[INFO] Workflow: reviewdog.yml triggered on PR #247
[INFO] ESLint review job started...
[PASS] ESLint: 0 errors, 2 warnings (inline comments posted)
[INFO] Checkstyle review job started...
[PASS] Checkstyle: 0 violations on changed lines
[INFO] Banking rules check started...
[PASS] No hardcoded credentials
[PASS] Banking rule checks complete
[INFO] Review comments posted: 2 (warnings)
[INFO] Filter mode: added lines only
─────────────────────────────────
CQ-022: Automated Review Bot PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'CQ-023', title: 'Merge Policy Enforcement',
    category: 'Merge Policies', layer: 'CodeReview',
    framework: 'GitHub Branch Protection', language: 'Bash',
    difficulty: 'Intermediate',
    description: 'Validate GitHub branch protection rules enforce banking merge policies. Verify required reviewers, status checks, signed commits, linear history, and administrator enforcement are properly configured for main and release branches.',
    prerequisites: 'GitHub repository admin access, gh CLI authenticated, Branch protection rules configured',
    config: 'REPO=bank-org/core-banking\nBRANCH=main\nMIN_REVIEWERS=2\nREQUIRED_CHECKS=ci,security-scan,sonar\nSIGNED_COMMITS=true\nLINEAR_HISTORY=true',
    code: `#!/bin/bash
# CQ-023: Merge Policy Enforcement Validation
set -euo pipefail

REPO="bank-org/core-banking"
BRANCH="main"
MIN_REVIEWERS=2
PASS=0; FAIL=0

echo "[TEST] Merge Policy Enforcement"

# Get branch protection rules
PROTECTION=$(gh api "repos/\$REPO/branches/\$BRANCH/protection" 2>/dev/null)

# Check required reviews
REVIEWS=$(echo "\$PROTECTION" | jq '.required_pull_request_reviews.required_approving_review_count // 0')
if [ "\$REVIEWS" -ge "\$MIN_REVIEWERS" ]; then
    echo "[PASS] Required reviewers: \$REVIEWS (min: \$MIN_REVIEWERS)"
    ((PASS++))
else
    echo "[FAIL] Required reviewers: \$REVIEWS (min: \$MIN_REVIEWERS)"
    ((FAIL++))
fi

# Check dismiss stale reviews
DISMISS=$(echo "\$PROTECTION" | jq '.required_pull_request_reviews.dismiss_stale_reviews // false')
if [ "\$DISMISS" = "true" ]; then
    echo "[PASS] Dismiss stale reviews: enabled"
    ((PASS++))
else
    echo "[FAIL] Dismiss stale reviews: disabled"
    ((FAIL++))
fi

# Check required status checks
CHECKS=$(echo "\$PROTECTION" | jq -r '.required_status_checks.contexts[]' 2>/dev/null)
for CHECK in ci security-scan sonar; do
    if echo "\$CHECKS" | grep -q "\$CHECK"; then
        echo "[PASS] Required check '\$CHECK': configured"
        ((PASS++))
    else
        echo "[FAIL] Required check '\$CHECK': missing"
        ((FAIL++))
    fi
done

# Check signed commits
SIGNED=$(echo "\$PROTECTION" | jq '.required_signatures.enabled // false')
if [ "\$SIGNED" = "true" ]; then
    echo "[PASS] Signed commits required: enabled"
    ((PASS++))
else
    echo "[WARN] Signed commits: not enforced"
fi

# Check linear history
LINEAR=$(echo "\$PROTECTION" | jq '.required_linear_history.enabled // false')
if [ "\$LINEAR" = "true" ]; then
    echo "[PASS] Linear history: enforced"
    ((PASS++))
else
    echo "[FAIL] Linear history: not enforced"
    ((FAIL++))
fi

# Check admin enforcement
ENFORCE=$(echo "\$PROTECTION" | jq '.enforce_admins.enabled // false')
if [ "\$ENFORCE" = "true" ]; then
    echo "[PASS] Admin enforcement: enabled"
    ((PASS++))
else
    echo "[WARN] Admin bypass allowed"
fi

echo ""
echo "CQ-023: Merge Policy — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Merge Policy Enforcement
[INFO] Repository: bank-org/core-banking
[INFO] Branch: main
[PASS] Required reviewers: 2 (min: 2)
[PASS] Dismiss stale reviews: enabled
[PASS] Required check 'ci': configured
[PASS] Required check 'security-scan': configured
[PASS] Required check 'sonar': configured
[PASS] Signed commits required: enabled
[PASS] Linear history: enforced
[PASS] Admin enforcement: enabled
─────────────────────────────────
CQ-023: Merge Policy — 8 passed, 0 failed`
  },
  {
    id: 'CQ-024', title: 'CODEOWNERS Validation',
    category: 'Code Ownership', layer: 'CodeReview',
    framework: 'GitHub CODEOWNERS', language: 'Python',
    difficulty: 'Beginner',
    description: 'Validate CODEOWNERS file ensures proper review routing for banking code changes. Check that critical paths (payment processing, compliance, security) have designated senior reviewers, and that all source directories have at least one owner assigned.',
    prerequisites: 'CODEOWNERS file in repository, GitHub team structure configured, Directory structure documented',
    config: 'CODEOWNERS_PATH=.github/CODEOWNERS\nCRITICAL_PATHS=src/payments/,src/compliance/,src/security/,src/fraud/\nMIN_OWNERS_PER_PATH=2\nREQUIRED_TEAMS=@bank-org/security-review,@bank-org/compliance-review',
    code: `#!/usr/bin/env python3
"""CQ-024: CODEOWNERS Validation"""
import os, sys, re

CODEOWNERS_PATH = ".github/CODEOWNERS"
CRITICAL_PATHS = [
    "src/payments/", "src/compliance/",
    "src/security/", "src/fraud/"
]
MIN_OWNERS = 2
REQUIRED_TEAMS = ["@bank-org/security-review", "@bank-org/compliance-review"]

def parse_codeowners():
    """Parse CODEOWNERS file into path->owners mapping"""
    if not os.path.exists(CODEOWNERS_PATH):
        print(f"[FAIL] CODEOWNERS file not found: {CODEOWNERS_PATH}")
        sys.exit(1)
    print(f"[PASS] CODEOWNERS file exists")
    rules = {}
    with open(CODEOWNERS_PATH) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split()
            if len(parts) >= 2:
                path = parts[0]
                owners = parts[1:]
                rules[path] = owners
    print(f"[INFO] Total ownership rules: {len(rules)}")
    return rules

def check_critical_paths(rules):
    """Verify critical paths have sufficient owners"""
    for cpath in CRITICAL_PATHS:
        matching = []
        for rule_path, owners in rules.items():
            if cpath.startswith(rule_path.rstrip("*").rstrip("/")):
                matching.extend(owners)
            elif rule_path.rstrip("*").rstrip("/").startswith(cpath.rstrip("/")):
                matching.extend(owners)
        unique_owners = list(set(matching))
        if len(unique_owners) >= MIN_OWNERS:
            print(f"[PASS] {cpath}: {len(unique_owners)} owners assigned")
        else:
            print(f"[FAIL] {cpath}: only {len(unique_owners)} owners (min: {MIN_OWNERS})")
            sys.exit(1)

def check_required_teams(rules):
    """Verify required teams are assigned to critical paths"""
    all_owners = set()
    for owners in rules.values():
        all_owners.update(owners)
    for team in REQUIRED_TEAMS:
        if team in all_owners:
            print(f"[PASS] Required team '{team}' present in CODEOWNERS")
        else:
            print(f"[FAIL] Required team '{team}' missing from CODEOWNERS")
            sys.exit(1)

def check_coverage(rules):
    """Check that all source directories have owners"""
    src_dirs = set()
    for root, dirs, files in os.walk("src/"):
        for d in dirs:
            src_dirs.add(os.path.join(root, d) + "/")
    covered = 0
    for sdir in src_dirs:
        for rule_path in rules:
            if sdir.startswith(rule_path.rstrip("*").rstrip("/")):
                covered += 1
                break
    pct = (covered / len(src_dirs) * 100) if src_dirs else 100
    print(f"[INFO] Directory coverage: {pct:.0f}% ({covered}/{len(src_dirs)})")

if __name__ == "__main__":
    print("[TEST] CODEOWNERS Validation")
    rules = parse_codeowners()
    check_critical_paths(rules)
    check_required_teams(rules)
    check_coverage(rules)
    print("\\nCQ-024: CODEOWNERS Validation PASSED")`,
    expectedOutput: `[TEST] CODEOWNERS Validation
[PASS] CODEOWNERS file exists
[INFO] Total ownership rules: 14
[PASS] src/payments/: 3 owners assigned
[PASS] src/compliance/: 2 owners assigned
[PASS] src/security/: 3 owners assigned
[PASS] src/fraud/: 2 owners assigned
[PASS] Required team '@bank-org/security-review' present
[PASS] Required team '@bank-org/compliance-review' present
[INFO] Directory coverage: 100% (22/22)
─────────────────────────────────
CQ-024: CODEOWNERS Validation PASSED
Total: 7 passed, 0 failed`
  },
  {
    id: 'CQ-025', title: 'Conventional Commit Enforcement',
    category: 'Commit Standards', layer: 'CodeReview',
    framework: 'commitlint / Husky', language: 'JavaScript',
    difficulty: 'Beginner',
    description: 'Enforce conventional commit message format across banking repositories. Validate that all commits follow the pattern type(scope): description with approved types (feat, fix, docs, refactor, test, chore) and mandatory scope for banking modules.',
    prerequisites: 'commitlint installed, Husky git hooks configured, .commitlintrc.js with banking scopes',
    config: 'COMMITLINT_CONFIG=.commitlintrc.js\nAPPROVED_TYPES=feat,fix,docs,refactor,test,chore,ci,perf\nAPPROVED_SCOPES=payments,compliance,fraud,security,auth,core\nMAX_HEADER_LENGTH=72',
    code: `#!/usr/bin/env node
// CQ-025: Conventional Commit Enforcement
const { execSync } = require("child_process");

const TYPES = ["feat", "fix", "docs", "refactor", "test", "chore", "ci", "perf"];
const SCOPES = ["payments", "compliance", "fraud", "security", "auth", "core"];
const MAX_HEADER = 72;
const PATTERN = /^(feat|fix|docs|refactor|test|chore|ci|perf)(\\([a-z-]+\\))?!?: .{1,}/;

function getRecentCommits(count) {
    const log = execSync(
        \`git log --oneline -\${count} --format="%s"\`,
        { encoding: "utf-8" }
    );
    return log.trim().split("\\n").filter(Boolean);
}

function validateCommit(message) {
    const errors = [];
    if (!PATTERN.test(message)) {
        errors.push("Does not match conventional commit format");
    }
    if (message.length > MAX_HEADER) {
        errors.push(\`Header too long: \${message.length} > \${MAX_HEADER}\`);
    }
    const scopeMatch = message.match(/^\\w+\\(([^)]+)\\)/);
    if (scopeMatch) {
        const scope = scopeMatch[1];
        if (!SCOPES.includes(scope)) {
            errors.push(\`Unknown scope: \${scope}\`);
        }
    }
    return errors;
}

console.log("[TEST] Conventional Commit Enforcement");
const commits = getRecentCommits(20);
console.log(\`[INFO] Checking last \${commits.length} commits\`);

let pass = 0;
let fail = 0;
for (const msg of commits) {
    const errors = validateCommit(msg);
    if (errors.length === 0) {
        pass++;
    } else {
        fail++;
        console.log(\`[FAIL] "\${msg}"\`);
        errors.forEach(e => console.log(\`  -> \${e}\`));
    }
}

console.log(\`[INFO] Valid: \${pass}, Invalid: \${fail}\`);
if (fail === 0) {
    console.log("[PASS] All commits follow conventional format");
} else {
    console.log(\`[FAIL] \${fail} commits violate convention\`);
    process.exit(1);
}
console.log("\\nCQ-025: Commit Enforcement PASSED");`,
    expectedOutput: `[TEST] Conventional Commit Enforcement
[INFO] Checking last 20 commits
[INFO] Valid: 20, Invalid: 0
[PASS] All commits follow conventional format
[INFO] Types used: feat(8), fix(5), test(4), refactor(2), docs(1)
[INFO] Scopes: payments(6), compliance(4), core(5), security(3), fraud(2)
[INFO] Average header length: 48 chars (max: 72)
─────────────────────────────────
CQ-025: Commit Enforcement PASSED
Total: 1 passed, 0 failed`
  },
  {
    id: 'CQ-026', title: 'Review Turnaround Time Audit',
    category: 'Review Metrics', layer: 'CodeReview',
    framework: 'GitHub API / Python', language: 'Python',
    difficulty: 'Advanced',
    description: 'Audit code review turnaround times for banking repositories to ensure SLA compliance. Validate that PRs receive first review within 4 hours, final approval within 24 hours, and that no PR stays open longer than 5 business days without action.',
    prerequisites: 'GitHub API access, Historical PR data, Team schedule information, SLA documentation',
    config: 'REPO=bank-org/core-banking\nFIRST_REVIEW_SLA_HOURS=4\nAPPROVAL_SLA_HOURS=24\nMAX_OPEN_DAYS=5\nAUDIT_PERIOD_DAYS=30\nGITHUB_TOKEN=env:GITHUB_TOKEN',
    code: `#!/usr/bin/env python3
"""CQ-026: Review Turnaround Time Audit"""
import requests, os, sys
from datetime import datetime, timedelta

REPO = "bank-org/core-banking"
TOKEN = os.environ["GITHUB_TOKEN"]
HEADERS = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github.v3+json"}
BASE = "https://api.github.com"
FIRST_REVIEW_SLA = 4
APPROVAL_SLA = 24
MAX_OPEN_DAYS = 5

def get_recent_prs(days=30):
    """Fetch PRs from the last N days"""
    since = (datetime.utcnow() - timedelta(days=days)).isoformat() + "Z"
    url = f"{BASE}/repos/{REPO}/pulls"
    params = {"state": "all", "sort": "created", "direction": "desc", "per_page": 100}
    r = requests.get(url, headers=HEADERS, params=params, timeout=30)
    r.raise_for_status()
    prs = [p for p in r.json() if p["created_at"] >= since]
    return prs

def get_reviews(pr_number):
    """Get reviews for a PR"""
    url = f"{BASE}/repos/{REPO}/pulls/{pr_number}/reviews"
    r = requests.get(url, headers=HEADERS, timeout=15)
    r.raise_for_status()
    return r.json()

def calculate_metrics(prs):
    """Calculate review turnaround metrics"""
    first_review_times = []
    approval_times = []
    sla_violations = {"first_review": 0, "approval": 0, "stale": 0}

    for pr in prs:
        created = datetime.fromisoformat(pr["created_at"].rstrip("Z"))
        reviews = get_reviews(pr["number"])
        if reviews:
            first = datetime.fromisoformat(reviews[0]["submitted_at"].rstrip("Z"))
            hours = (first - created).total_seconds() / 3600
            first_review_times.append(hours)
            if hours > FIRST_REVIEW_SLA:
                sla_violations["first_review"] += 1
            approvals = [r for r in reviews if r["state"] == "APPROVED"]
            if approvals:
                approved = datetime.fromisoformat(approvals[0]["submitted_at"].rstrip("Z"))
                approval_hours = (approved - created).total_seconds() / 3600
                approval_times.append(approval_hours)
                if approval_hours > APPROVAL_SLA:
                    sla_violations["approval"] += 1
    return first_review_times, approval_times, sla_violations

if __name__ == "__main__":
    print("[TEST] Review Turnaround Time Audit")
    prs = get_recent_prs(30)
    print(f"[INFO] PRs analyzed: {len(prs)} (last 30 days)")
    frt, at, violations = calculate_metrics(prs)
    avg_frt = sum(frt) / len(frt) if frt else 0
    avg_at = sum(at) / len(at) if at else 0
    print(f"[INFO] Avg first review: {avg_frt:.1f}h (SLA: {FIRST_REVIEW_SLA}h)")
    print(f"[INFO] Avg approval: {avg_at:.1f}h (SLA: {APPROVAL_SLA}h)")
    for k, v in violations.items():
        status = "PASS" if v == 0 else "WARN"
        print(f"[{status}] SLA violations ({k}): {v}")
    total_violations = sum(violations.values())
    if total_violations == 0:
        print("[PASS] All reviews within SLA")
    print("\\nCQ-026: Review Turnaround Audit PASSED")`,
    expectedOutput: `[TEST] Review Turnaround Time Audit
[INFO] PRs analyzed: 47 (last 30 days)
[INFO] Avg first review: 2.3h (SLA: 4h)
[INFO] Avg approval: 16.7h (SLA: 24h)
[PASS] SLA violations (first_review): 0
[PASS] SLA violations (approval): 0
[PASS] SLA violations (stale): 0
[PASS] All reviews within SLA
[INFO] Fastest review: 0.5h (PR #234)
[INFO] Team avg: security=1.8h, payments=2.1h, core=2.5h
─────────────────────────────────
CQ-026: Review Turnaround Audit PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'CQ-027', title: 'Branch Protection Rules',
    category: 'Branch Protection', layer: 'CodeReview',
    framework: 'GitHub API / gh CLI', language: 'Bash',
    difficulty: 'Intermediate',
    description: 'Audit branch protection rules across all banking repositories in the organization. Verify main, develop, and release branches have proper protection including required status checks, code owner reviews, and force-push restrictions.',
    prerequisites: 'GitHub organization admin access, gh CLI authenticated, Repository list',
    config: 'ORG=bank-org\nCRITICAL_REPOS=core-banking,payment-gateway,fraud-engine,compliance-api\nPROTECTED_BRANCHES=main,develop,release/*\nGITHUB_TOKEN=env:GITHUB_TOKEN',
    code: `#!/bin/bash
# CQ-027: Branch Protection Rules Audit
set -euo pipefail

ORG="bank-org"
REPOS=("core-banking" "payment-gateway" "fraud-engine" "compliance-api")
BRANCHES=("main" "develop")
PASS=0; FAIL=0

echo "[TEST] Branch Protection Rules Audit"

for REPO in "\${REPOS[@]}"; do
    echo "[INFO] Repository: \$ORG/\$REPO"
    for BRANCH in "\${BRANCHES[@]}"; do
        # Check if branch protection exists
        PROT=$(gh api "repos/\$ORG/\$REPO/branches/\$BRANCH/protection" 2>/dev/null || echo "NONE")
        if [ "\$PROT" = "NONE" ]; then
            echo "  [FAIL] \$BRANCH: No protection rules"
            ((FAIL++))
            continue
        fi

        # Required reviews
        REVIEWS=$(echo "\$PROT" | jq '.required_pull_request_reviews != null')
        if [ "\$REVIEWS" = "true" ]; then
            echo "  [PASS] \$BRANCH: PR reviews required"
            ((PASS++))
        else
            echo "  [FAIL] \$BRANCH: PR reviews not required"
            ((FAIL++))
        fi

        # Force push disabled
        FORCE=$(echo "\$PROT" | jq '.allow_force_pushes.enabled // false')
        if [ "\$FORCE" = "false" ]; then
            echo "  [PASS] \$BRANCH: Force push disabled"
            ((PASS++))
        else
            echo "  [FAIL] \$BRANCH: Force push allowed!"
            ((FAIL++))
        fi

        # Deletion disabled
        DELETE=$(echo "\$PROT" | jq '.allow_deletions.enabled // false')
        if [ "\$DELETE" = "false" ]; then
            echo "  [PASS] \$BRANCH: Deletion disabled"
            ((PASS++))
        else
            echo "  [FAIL] \$BRANCH: Deletion allowed!"
            ((FAIL++))
        fi
    done
done

echo ""
echo "CQ-027: Branch Protection — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Branch Protection Rules Audit
[INFO] Repository: bank-org/core-banking
  [PASS] main: PR reviews required
  [PASS] main: Force push disabled
  [PASS] main: Deletion disabled
  [PASS] develop: PR reviews required
  [PASS] develop: Force push disabled
  [PASS] develop: Deletion disabled
[INFO] Repository: bank-org/payment-gateway
  [PASS] main: PR reviews required
  [PASS] main: Force push disabled
  [PASS] main: Deletion disabled
  [PASS] develop: PR reviews required
  [PASS] develop: Force push disabled
  [PASS] develop: Deletion disabled
─────────────────────────────────
CQ-027: Branch Protection — 24 passed, 0 failed`
  },
  {
    id: 'CQ-028', title: 'Security Review Gate',
    category: 'Security Reviews', layer: 'CodeReview',
    framework: 'GitHub Actions / Custom', language: 'Python',
    difficulty: 'Advanced',
    description: 'Enforce mandatory security team review for changes touching sensitive banking code paths. Automatically request security team review when PRs modify authentication, encryption, payment processing, or compliance modules.',
    prerequisites: 'GitHub webhook configured, Security team defined, Sensitive path patterns documented, Label automation',
    config: 'REPO=bank-org/core-banking\nSECURITY_TEAM=@bank-org/security-review\nSENSITIVE_PATHS=src/auth/,src/crypto/,src/payments/,src/compliance/\nSECURITY_LABEL=security-review-required\nGITHUB_TOKEN=env:GITHUB_TOKEN',
    code: `#!/usr/bin/env python3
"""CQ-028: Security Review Gate"""
import requests, os, sys, re

REPO = "bank-org/core-banking"
TOKEN = os.environ["GITHUB_TOKEN"]
HEADERS = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github.v3+json"}
BASE = "https://api.github.com"
SECURITY_TEAM = "security-review"
SENSITIVE = ["src/auth/", "src/crypto/", "src/payments/", "src/compliance/"]
LABEL = "security-review-required"

def get_open_prs():
    """Get all open PRs"""
    url = f"{BASE}/repos/{REPO}/pulls"
    r = requests.get(url, headers=HEADERS, params={"state": "open"}, timeout=15)
    r.raise_for_status()
    return r.json()

def get_pr_files(pr_number):
    """Get files changed in a PR"""
    url = f"{BASE}/repos/{REPO}/pulls/{pr_number}/files"
    r = requests.get(url, headers=HEADERS, timeout=15)
    r.raise_for_status()
    return [f["filename"] for f in r.json()]

def check_security_review(pr):
    """Check if PR touching sensitive paths has security review"""
    files = get_pr_files(pr["number"])
    sensitive_files = [f for f in files if any(f.startswith(s) for s in SENSITIVE)]
    if not sensitive_files:
        return True, "No sensitive files"

    reviews = requests.get(
        f"{BASE}/repos/{REPO}/pulls/{pr['number']}/reviews",
        headers=HEADERS, timeout=15
    ).json()
    security_approved = any(
        r["state"] == "APPROVED" and SECURITY_TEAM in str(r.get("user", {}).get("login", ""))
        for r in reviews
    )
    labels = [l["name"] for l in pr.get("labels", [])]
    has_label = LABEL in labels

    if sensitive_files and not has_label:
        print(f"  [WARN] PR #{pr['number']}: missing '{LABEL}' label")
    if sensitive_files and not security_approved:
        return False, f"{len(sensitive_files)} sensitive files without security review"
    return True, f"Security review approved for {len(sensitive_files)} files"

if __name__ == "__main__":
    print("[TEST] Security Review Gate")
    prs = get_open_prs()
    print(f"[INFO] Open PRs: {len(prs)}")
    violations = []
    for pr in prs:
        ok, msg = check_security_review(pr)
        if ok:
            print(f"[PASS] PR #{pr['number']}: {msg}")
        else:
            print(f"[FAIL] PR #{pr['number']}: {msg}")
            violations.append(pr["number"])
    if violations:
        print(f"[FAIL] {len(violations)} PRs missing security review")
        sys.exit(1)
    print("[PASS] All sensitive PRs have security review")
    print("\\nCQ-028: Security Review Gate PASSED")`,
    expectedOutput: `[TEST] Security Review Gate
[INFO] Open PRs: 5
[PASS] PR #251: No sensitive files
[PASS] PR #250: Security review approved for 3 files
[PASS] PR #249: No sensitive files
[PASS] PR #248: Security review approved for 1 files
[PASS] PR #247: No sensitive files
[PASS] All sensitive PRs have security review
[INFO] Security team avg review time: 3.2h
[INFO] Sensitive path coverage: 100%
─────────────────────────────────
CQ-028: Security Review Gate PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'CQ-029', title: 'PR Template Compliance Check',
    category: 'PR Standards', layer: 'CodeReview',
    framework: 'GitHub Actions / Custom', language: 'Python',
    difficulty: 'Beginner',
    description: 'Validate that all pull requests in banking repositories follow the required PR template. Check for mandatory sections: Summary, Test Plan, Checklist, and ensure security-related checkboxes are filled for changes touching financial modules.',
    prerequisites: 'PR template file configured, GitHub Actions with PR event trigger, Template sections defined',
    config: 'REPO=bank-org/core-banking\nTEMPLATE_PATH=.github/pull_request_template.md\nREQUIRED_SECTIONS=Summary,Test Plan,Checklist\nMIN_DESCRIPTION_LENGTH=50\nCHECKLIST_ITEMS=tests,secrets,schemas,env-template',
    code: `#!/usr/bin/env python3
"""CQ-029: PR Template Compliance Check"""
import requests, os, sys, re

REPO = "bank-org/core-banking"
TOKEN = os.environ["GITHUB_TOKEN"]
HEADERS = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github.v3+json"}
BASE = "https://api.github.com"
REQUIRED = ["Summary", "Test Plan", "Checklist"]
MIN_DESC = 50

def get_open_prs():
    url = f"{BASE}/repos/{REPO}/pulls"
    r = requests.get(url, headers=HEADERS, params={"state": "open", "per_page": 50}, timeout=15)
    r.raise_for_status()
    return r.json()

def check_template(pr):
    """Validate PR body against template"""
    body = pr.get("body", "") or ""
    errors = []

    if len(body) < MIN_DESC:
        errors.append(f"Description too short ({len(body)} < {MIN_DESC} chars)")

    for section in REQUIRED:
        pattern = re.compile(rf"##\s*{section}", re.IGNORECASE)
        if not pattern.search(body):
            errors.append(f"Missing section: {section}")

    checklist = re.findall(r"- \[([ xX])\]", body)
    unchecked = sum(1 for c in checklist if c == " ")
    if unchecked > 0:
        errors.append(f"{unchecked} unchecked items in checklist")

    return errors

if __name__ == "__main__":
    print("[TEST] PR Template Compliance Check")
    prs = get_open_prs()
    print(f"[INFO] Open PRs to check: {len(prs)}")
    violations = 0
    for pr in prs:
        errors = check_template(pr)
        if errors:
            violations += 1
            print(f"[FAIL] PR #{pr['number']} '{pr['title']}':")
            for e in errors:
                print(f"  -> {e}")
        else:
            print(f"[PASS] PR #{pr['number']} '{pr['title']}': template compliant")
    if violations == 0:
        print("[PASS] All PRs follow template")
    else:
        print(f"[FAIL] {violations} PRs violate template")
        sys.exit(1)
    print("\\nCQ-029: PR Template Compliance PASSED")`,
    expectedOutput: `[TEST] PR Template Compliance Check
[INFO] Open PRs to check: 5
[PASS] PR #251 'feat(payments): add SEPA transfer': template compliant
[PASS] PR #250 'fix(auth): session timeout handling': template compliant
[PASS] PR #249 'refactor(core): extract validation': template compliant
[PASS] PR #248 'test(fraud): detection coverage': template compliant
[PASS] PR #247 'docs: update API reference': template compliant
[PASS] All PRs follow template
[INFO] Avg description length: 280 chars
[INFO] Checklist completion: 100%
─────────────────────────────────
CQ-029: PR Template Compliance PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'CQ-030', title: 'Approval Matrix Enforcement',
    category: 'Approval Policies', layer: 'CodeReview',
    framework: 'GitHub API / Custom', language: 'Python',
    difficulty: 'Advanced',
    description: 'Enforce a tiered approval matrix based on change risk for banking repositories. Low-risk changes need 1 reviewer, medium-risk need 2 including a senior developer, and high-risk (financial, security) need 2 plus security team and compliance sign-off.',
    prerequisites: 'GitHub team structure, Risk classification rules, Approval policy document, GitHub API access',
    config: 'REPO=bank-org/core-banking\nLOW_RISK_APPROVALS=1\nMED_RISK_APPROVALS=2\nHIGH_RISK_APPROVALS=3\nSENIOR_TEAM=@bank-org/senior-devs\nSECURITY_TEAM=@bank-org/security-review\nCOMPLIANCE_TEAM=@bank-org/compliance',
    code: `#!/usr/bin/env python3
"""CQ-030: Approval Matrix Enforcement"""
import requests, os, sys

REPO = "bank-org/core-banking"
TOKEN = os.environ["GITHUB_TOKEN"]
HEADERS = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github.v3+json"}
BASE = "https://api.github.com"

HIGH_RISK_PATHS = ["src/payments/", "src/security/", "src/compliance/", "src/crypto/"]
MED_RISK_PATHS = ["src/api/", "src/services/", "src/repositories/"]
APPROVALS = {"low": 1, "medium": 2, "high": 3}

def classify_risk(files):
    """Classify PR risk level based on files changed"""
    for f in files:
        if any(f.startswith(p) for p in HIGH_RISK_PATHS):
            return "high"
    for f in files:
        if any(f.startswith(p) for p in MED_RISK_PATHS):
            return "medium"
    return "low"

def get_pr_details(pr_number):
    """Get PR files and reviews"""
    files_url = f"{BASE}/repos/{REPO}/pulls/{pr_number}/files"
    files = [f["filename"] for f in requests.get(files_url, headers=HEADERS, timeout=15).json()]
    reviews_url = f"{BASE}/repos/{REPO}/pulls/{pr_number}/reviews"
    reviews = requests.get(reviews_url, headers=HEADERS, timeout=15).json()
    approvals = [r for r in reviews if r["state"] == "APPROVED"]
    return files, approvals

def check_approval_matrix():
    """Validate all open PRs meet approval requirements"""
    print("[TEST] Approval Matrix Enforcement")
    prs = requests.get(
        f"{BASE}/repos/{REPO}/pulls",
        headers=HEADERS, params={"state": "open"}, timeout=15
    ).json()
    print(f"[INFO] Open PRs: {len(prs)}")

    violations = []
    for pr in prs:
        files, approvals = get_pr_details(pr["number"])
        risk = classify_risk(files)
        required = APPROVALS[risk]
        actual = len(approvals)
        if actual >= required:
            print(f"[PASS] PR #{pr['number']}: risk={risk}, "
                  f"approvals={actual}/{required}")
        else:
            print(f"[FAIL] PR #{pr['number']}: risk={risk}, "
                  f"approvals={actual}/{required} (insufficient)")
            violations.append(pr["number"])

    if violations:
        print(f"[FAIL] {len(violations)} PRs do not meet approval matrix")
        sys.exit(1)
    print("[PASS] All PRs meet approval requirements")

if __name__ == "__main__":
    check_approval_matrix()
    print("\\nCQ-030: Approval Matrix PASSED")`,
    expectedOutput: `[TEST] Approval Matrix Enforcement
[INFO] Open PRs: 5
[PASS] PR #251: risk=high, approvals=3/3
[PASS] PR #250: risk=medium, approvals=2/2
[PASS] PR #249: risk=low, approvals=1/1
[PASS] PR #248: risk=medium, approvals=2/2
[PASS] PR #247: risk=low, approvals=1/1
[PASS] All PRs meet approval requirements
[INFO] Risk distribution: high=1, medium=2, low=2
[INFO] Avg approvals: 1.8 per PR
─────────────────────────────────
CQ-030: Approval Matrix PASSED
Total: 5 passed, 0 failed`
  },

  /* ====== TAB 4: Test Quality (CQ-031 to CQ-040) ====== */
  {
    id: 'CQ-031', title: 'Mutation Testing with PIT',
    category: 'Mutation Testing', layer: 'TestQuality',
    framework: 'PIT / Maven', language: 'Java',
    difficulty: 'Advanced',
    description: 'Run mutation testing on banking Java code using PIT to evaluate test suite effectiveness. Validate that mutation score exceeds 85% for payment processing modules, ensuring tests can detect real code changes and are not merely achieving coverage.',
    prerequisites: 'PIT Maven plugin configured, Compiled banking project, Test suite passing, Mutation operators configured',
    config: 'PIT_TARGET_CLASSES=com.bank.payments.*,com.bank.settlement.*\nPIT_TARGET_TESTS=com.bank.payments.*Test,com.bank.settlement.*Test\nMIN_MUTATION_SCORE=85\nTHREADS=4\nTIMEOUT_FACTOR=1.5',
    code: `// CQ-031: Mutation Testing with PIT
// File: MutationTestValidation.java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.io.*;
import javax.xml.parsers.*;
import org.w3c.dom.*;

public class MutationTestValidation {
    private static final String REPORT = "target/pit-reports/mutations.xml";
    private static final double MIN_SCORE = 85.0;

    @BeforeAll
    static void runPIT() throws Exception {
        ProcessBuilder pb = new ProcessBuilder(
            "mvn", "org.pitest:pitest-maven:mutationCoverage",
            "-DtargetClasses=com.bank.payments.*,com.bank.settlement.*",
            "-DtargetTests=com.bank.payments.*Test,com.bank.settlement.*Test",
            "-Dthreads=4",
            "-DtimeoutFactor=1.5"
        );
        pb.inheritIO();
        int exit = pb.start().waitFor();
        System.out.println("[INFO] PIT exit code: " + exit);
    }

    @Test
    void mutationScoreMeetsThreshold() throws Exception {
        Document doc = parseReport();
        NodeList mutations = doc.getElementsByTagName("mutation");
        int total = mutations.getLength();
        int killed = 0;
        for (int i = 0; i < total; i++) {
            Element m = (Element) mutations.item(i);
            if ("true".equals(m.getAttribute("detected"))) killed++;
        }
        double score = (killed * 100.0) / total;
        System.out.println("[INFO] Total mutants: " + total);
        System.out.println("[INFO] Killed: " + killed);
        System.out.println("[INFO] Survived: " + (total - killed));
        System.out.println("[INFO] Mutation score: " + String.format("%.1f", score) + "%");
        assertTrue(score >= MIN_SCORE,
            "Mutation score " + score + "% below " + MIN_SCORE + "%");
        System.out.println("[PASS] Mutation score meets threshold");
    }

    @Test
    void noSurvivingMutantsInCriticalMethods() throws Exception {
        Document doc = parseReport();
        NodeList mutations = doc.getElementsByTagName("mutation");
        for (int i = 0; i < mutations.getLength(); i++) {
            Element m = (Element) mutations.item(i);
            String method = m.getElementsByTagName("mutatedMethod")
                .item(0).getTextContent();
            if (method.contains("processPayment") || method.contains("calculateInterest")) {
                assertEquals("true", m.getAttribute("detected"),
                    "Surviving mutant in critical method: " + method);
            }
        }
        System.out.println("[PASS] No surviving mutants in critical methods");
    }

    private Document parseReport() throws Exception {
        return DocumentBuilderFactory.newInstance()
            .newDocumentBuilder().parse(new File(REPORT));
    }
}`,
    expectedOutput: `[TEST] Mutation Testing with PIT
[INFO] PIT exit code: 0
[INFO] Total mutants: 342
[INFO] Killed: 308
[INFO] Survived: 34
[INFO] Mutation score: 90.1%
[PASS] Mutation score meets threshold (90.1% >= 85%)
[INFO] Checking critical methods...
[PASS] No surviving mutants in critical methods
[INFO] Mutator breakdown: CONDITIONALS(89), MATH(67), RETURNS(54)
[INFO] Weakest class: ReportGenerator (78% score)
─────────────────────────────────
CQ-031: Mutation Testing PASSED
Total: 2 passed, 0 failed`
  },
  {
    id: 'CQ-032', title: 'Test Coverage Gap Analysis',
    category: 'Coverage Analysis', layer: 'TestQuality',
    framework: 'JaCoCo / Python coverage', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Analyze test coverage gaps in banking applications by identifying untested code paths, error handlers, and edge cases. Generate a prioritized list of coverage gaps based on risk (financial impact, security, compliance) for targeted test writing.',
    prerequisites: 'Coverage reports generated, Source code access, Risk classification for modules, Coverage threshold definitions',
    config: 'COVERAGE_XML=coverage.xml\nMIN_LINE_COVERAGE=80\nMIN_BRANCH_COVERAGE=75\nHIGH_RISK_MIN=95\nHIGH_RISK_MODULES=payments,settlement,fraud_detection',
    code: `#!/usr/bin/env python3
"""CQ-032: Test Coverage Gap Analysis"""
import xml.etree.ElementTree as ET
import sys, os

COVERAGE_XML = "coverage.xml"
MIN_LINE = 80.0
MIN_BRANCH = 75.0
HIGH_RISK_MIN = 95.0
HIGH_RISK = ["payments", "settlement", "fraud_detection"]

def parse_coverage():
    """Parse JaCoCo/coverage.py XML report"""
    tree = ET.parse(COVERAGE_XML)
    root = tree.getroot()
    packages = {}
    for pkg in root.findall(".//package"):
        name = pkg.get("name", "").replace("/", ".")
        counters = {}
        for counter in pkg.findall("counter"):
            ctype = counter.get("type")
            missed = int(counter.get("missed", 0))
            covered = int(counter.get("covered", 0))
            total = missed + covered
            pct = (covered / total * 100) if total > 0 else 0
            counters[ctype] = {"missed": missed, "covered": covered, "pct": pct}
        packages[name] = counters
    return packages

def analyze_gaps(packages):
    """Find coverage gaps and prioritize by risk"""
    gaps = []
    for pkg, counters in packages.items():
        line_cov = counters.get("LINE", {}).get("pct", 0)
        branch_cov = counters.get("BRANCH", {}).get("pct", 0)
        is_high_risk = any(hr in pkg for hr in HIGH_RISK)
        threshold = HIGH_RISK_MIN if is_high_risk else MIN_LINE

        if line_cov < threshold:
            gaps.append({
                "package": pkg, "line_coverage": line_cov,
                "branch_coverage": branch_cov,
                "risk": "HIGH" if is_high_risk else "NORMAL",
                "gap": threshold - line_cov
            })
    gaps.sort(key=lambda g: (-1 if g["risk"] == "HIGH" else 0, -g["gap"]))
    return gaps

if __name__ == "__main__":
    print("[TEST] Test Coverage Gap Analysis")
    packages = parse_coverage()
    print(f"[INFO] Packages analyzed: {len(packages)}")

    total_line = sum(p.get("LINE", {}).get("pct", 0) for p in packages.values()) / len(packages)
    print(f"[INFO] Overall line coverage: {total_line:.1f}%")

    gaps = analyze_gaps(packages)
    if gaps:
        print(f"[INFO] Coverage gaps found: {len(gaps)}")
        for g in gaps[:5]:
            print(f"  [{g['risk']}] {g['package']}: {g['line_coverage']:.1f}% "
                  f"(target: {'95' if g['risk']=='HIGH' else '80'}%)")
    else:
        print("[PASS] No coverage gaps found")

    high_risk_gaps = [g for g in gaps if g["risk"] == "HIGH"]
    if high_risk_gaps:
        print(f"[FAIL] {len(high_risk_gaps)} high-risk modules below threshold")
        sys.exit(1)
    print("[PASS] All high-risk modules meet coverage requirements")
    print("\\nCQ-032: Coverage Gap Analysis PASSED")`,
    expectedOutput: `[TEST] Test Coverage Gap Analysis
[INFO] Packages analyzed: 18
[INFO] Overall line coverage: 86.3%
[INFO] Coverage gaps found: 2
  [NORMAL] banking.reports: 72.4% (target: 80%)
  [NORMAL] banking.utils.legacy: 68.1% (target: 80%)
[PASS] All high-risk modules meet coverage requirements
[INFO] High-risk coverage: payments=96.2%, settlement=95.8%, fraud=97.1%
[INFO] Branch coverage: 81.4% overall
[INFO] Priority gap: banking.reports (+7.6% needed)
─────────────────────────────────
CQ-032: Coverage Gap Analysis PASSED
Total: 1 passed, 0 failed`
  },
  {
    id: 'CQ-033', title: 'Flaky Test Detection',
    category: 'Test Reliability', layer: 'TestQuality',
    framework: 'pytest / JUnit', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Detect and report flaky tests in banking test suites by running tests multiple times and tracking intermittent failures. Identify tests with inconsistent results that undermine CI reliability and banking release confidence.',
    prerequisites: 'Test suite executable, pytest-repeat or similar plugin, Historical test results database, CI pipeline access',
    config: 'TEST_DIR=tests/\nREPEAT_COUNT=5\nFLAKY_THRESHOLD=0.8\nOUTPUT_REPORT=flaky_report.json\nTIMEOUT_PER_RUN_SEC=300',
    code: `#!/usr/bin/env python3
"""CQ-033: Flaky Test Detection"""
import subprocess, json, sys, time

TEST_DIR = "tests/"
REPEAT = 5
FLAKY_THRESHOLD = 0.8

def run_tests():
    """Run test suite multiple times and collect results"""
    all_results = {}
    for run in range(REPEAT):
        print(f"[INFO] Test run {run + 1}/{REPEAT}...")
        cmd = ["pytest", TEST_DIR, "--tb=no", "-q", "--json-report",
               "--json-report-file=/tmp/test_run.json"]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        try:
            with open("/tmp/test_run.json") as f:
                report = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            continue
        for test in report.get("tests", []):
            name = test["nodeid"]
            outcome = test["outcome"]
            if name not in all_results:
                all_results[name] = []
            all_results[name].append(outcome)
    return all_results

def detect_flaky(results):
    """Identify tests with inconsistent results"""
    flaky = []
    stable_pass = 0
    stable_fail = 0
    for name, outcomes in results.items():
        pass_rate = outcomes.count("passed") / len(outcomes)
        if 0 < pass_rate < 1:
            flaky.append({"test": name, "pass_rate": pass_rate,
                          "outcomes": outcomes})
        elif pass_rate == 1:
            stable_pass += 1
        else:
            stable_fail += 1
    return flaky, stable_pass, stable_fail

if __name__ == "__main__":
    print("[TEST] Flaky Test Detection")
    results = run_tests()
    print(f"[INFO] Unique tests executed: {len(results)}")
    flaky, stable_pass, stable_fail = detect_flaky(results)
    print(f"[INFO] Stable passing: {stable_pass}")
    print(f"[INFO] Stable failing: {stable_fail}")
    print(f"[INFO] Flaky tests: {len(flaky)}")
    for f in flaky:
        print(f"  [WARN] {f['test']}: pass rate {f['pass_rate']:.0%}")
    if len(flaky) == 0:
        print("[PASS] No flaky tests detected")
    else:
        print(f"[WARN] {len(flaky)} flaky tests need investigation")
    with open("flaky_report.json", "w") as out:
        json.dump(flaky, out, indent=2)
    print("\\nCQ-033: Flaky Test Detection PASSED")`,
    expectedOutput: `[TEST] Flaky Test Detection
[INFO] Test run 1/5... 142 passed
[INFO] Test run 2/5... 142 passed
[INFO] Test run 3/5... 141 passed, 1 failed
[INFO] Test run 4/5... 142 passed
[INFO] Test run 5/5... 142 passed
[INFO] Unique tests executed: 142
[INFO] Stable passing: 141
[INFO] Stable failing: 0
[INFO] Flaky tests: 1
  [WARN] tests/test_api.py::test_timeout_handling: pass rate 80%
[PASS] Flaky test count within tolerance
[INFO] Report saved: flaky_report.json
─────────────────────────────────
CQ-033: Flaky Test Detection PASSED
Total: 1 passed, 0 failed`
  },
  {
    id: 'CQ-034', title: 'Test Execution Time Analysis',
    category: 'Test Performance', layer: 'TestQuality',
    framework: 'pytest / JUnit', language: 'Python',
    difficulty: 'Beginner',
    description: 'Analyze test execution times to identify slow tests that impact CI pipeline speed for banking deployments. Enforce maximum test duration limits and flag tests exceeding thresholds for optimization or parallelization.',
    prerequisites: 'Test suite with timing data, pytest-duration plugin, CI execution history',
    config: 'TEST_DIR=tests/\nMAX_TOTAL_TIME_SEC=300\nMAX_SINGLE_TEST_SEC=10\nSLOW_THRESHOLD_SEC=5\nTOP_SLOW_COUNT=10',
    code: `#!/usr/bin/env python3
"""CQ-034: Test Execution Time Analysis"""
import subprocess, json, sys, time

TEST_DIR = "tests/"
MAX_TOTAL = 300
MAX_SINGLE = 10
SLOW_THRESHOLD = 5

def run_tests_with_timing():
    """Run tests and collect timing information"""
    print("[TEST] Test Execution Time Analysis")
    start = time.time()
    cmd = ["pytest", TEST_DIR, "--json-report",
           "--json-report-file=/tmp/timing_report.json", "-v", "--tb=no"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    elapsed = time.time() - start
    print(f"[INFO] Total execution time: {elapsed:.1f}s (max: {MAX_TOTAL}s)")

    try:
        with open("/tmp/timing_report.json") as f:
            report = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        print("[FAIL] Could not parse timing report")
        sys.exit(1)

    tests = []
    for t in report.get("tests", []):
        duration = t.get("duration", 0)
        tests.append({"name": t["nodeid"], "duration": duration,
                       "outcome": t["outcome"]})
    tests.sort(key=lambda x: -x["duration"])
    return tests, elapsed

def analyze_timing(tests, total_time):
    """Analyze test timing and flag slow tests"""
    slow = [t for t in tests if t["duration"] > SLOW_THRESHOLD]
    over_limit = [t for t in tests if t["duration"] > MAX_SINGLE]

    print(f"[INFO] Tests executed: {len(tests)}")
    print(f"[INFO] Slow tests (> {SLOW_THRESHOLD}s): {len(slow)}")
    if slow:
        print("[INFO] Top slow tests:")
        for t in slow[:5]:
            print(f"  -> {t['name']}: {t['duration']:.2f}s")

    if total_time > MAX_TOTAL:
        print(f"[FAIL] Total time {total_time:.1f}s > {MAX_TOTAL}s")
        sys.exit(1)
    print(f"[PASS] Total execution time within limit")

    if over_limit:
        for t in over_limit:
            print(f"[FAIL] Test exceeds {MAX_SINGLE}s: {t['name']} ({t['duration']:.2f}s)")
        sys.exit(1)
    print(f"[PASS] All tests under {MAX_SINGLE}s individual limit")

    avg = sum(t["duration"] for t in tests) / len(tests)
    print(f"[INFO] Average test duration: {avg:.2f}s")

if __name__ == "__main__":
    tests, total = run_tests_with_timing()
    analyze_timing(tests, total)
    print("\\nCQ-034: Execution Time Analysis PASSED")`,
    expectedOutput: `[TEST] Test Execution Time Analysis
[INFO] Total execution time: 87.3s (max: 300s)
[INFO] Tests executed: 142
[INFO] Slow tests (> 5s): 3
[INFO] Top slow tests:
  -> tests/test_integration.py::test_full_payment_flow: 8.42s
  -> tests/test_fraud.py::test_ml_model_scoring: 6.71s
  -> tests/test_compliance.py::test_aml_screening: 5.23s
[PASS] Total execution time within limit
[PASS] All tests under 10s individual limit
[INFO] Average test duration: 0.61s
─────────────────────────────────
CQ-034: Execution Time Analysis PASSED
Total: 2 passed, 0 failed`
  },
  {
    id: 'CQ-035', title: 'Test Naming Convention Audit',
    category: 'Test Standards', layer: 'TestQuality',
    framework: 'AST Analysis / Python', language: 'Python',
    difficulty: 'Beginner',
    description: 'Audit test method naming conventions in banking test suites. Validate that tests follow the pattern test_<action>_<scenario>_<expected> or should<Action><Scenario> for Java, ensuring clear intent and self-documenting test suites.',
    prerequisites: 'Test source code access, AST parsing library, Naming convention document',
    config: 'TEST_DIR=tests/\nPATTERN=test_[a-z]+_[a-z_]+\nJAVA_PATTERN=should[A-Z][a-zA-Z]+\nMIN_NAME_LENGTH=15\nMAX_NAME_LENGTH=80',
    code: `#!/usr/bin/env python3
"""CQ-035: Test Naming Convention Audit"""
import ast, os, sys, re

TEST_DIR = "tests/"
PATTERN = re.compile(r"^test_[a-z][a-z0-9]*(_[a-z][a-z0-9]*)+$")
MIN_LENGTH = 15
MAX_LENGTH = 80

def find_test_methods(directory):
    """Parse Python files and extract test method names"""
    methods = []
    for root, dirs, files in os.walk(directory):
        for fname in files:
            if fname.startswith("test_") and fname.endswith(".py"):
                fpath = os.path.join(root, fname)
                with open(fpath) as f:
                    try:
                        tree = ast.parse(f.read())
                    except SyntaxError:
                        continue
                for node in ast.walk(tree):
                    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        if node.name.startswith("test_"):
                            methods.append({"name": node.name,
                                            "file": fpath,
                                            "line": node.lineno})
    return methods

def validate_naming(methods):
    """Check each test method against naming convention"""
    violations = []
    for m in methods:
        errors = []
        if not PATTERN.match(m["name"]):
            errors.append("Does not match pattern test_<action>_<scenario>")
        if len(m["name"]) < MIN_LENGTH:
            errors.append(f"Name too short ({len(m['name'])} < {MIN_LENGTH})")
        if len(m["name"]) > MAX_LENGTH:
            errors.append(f"Name too long ({len(m['name'])} > {MAX_LENGTH})")
        if errors:
            violations.append({**m, "errors": errors})
    return violations

if __name__ == "__main__":
    print("[TEST] Test Naming Convention Audit")
    methods = find_test_methods(TEST_DIR)
    print(f"[INFO] Test methods found: {len(methods)}")
    violations = validate_naming(methods)
    print(f"[INFO] Naming violations: {len(violations)}")
    for v in violations[:5]:
        print(f"  [WARN] {v['file']}:{v['line']} - {v['name']}")
        for e in v["errors"]:
            print(f"    -> {e}")
    compliance = ((len(methods) - len(violations)) / len(methods) * 100) if methods else 100
    print(f"[INFO] Naming compliance: {compliance:.1f}%")
    if compliance >= 95:
        print("[PASS] Test naming convention compliance meets threshold")
    else:
        print("[FAIL] Naming compliance below 95%")
        sys.exit(1)
    print("\\nCQ-035: Naming Convention Audit PASSED")`,
    expectedOutput: `[TEST] Test Naming Convention Audit
[INFO] Test methods found: 142
[INFO] Naming violations: 3
  [WARN] tests/test_utils.py:12 - test_helper
    -> Does not match pattern test_<action>_<scenario>
    -> Name too short (11 < 15)
  [WARN] tests/test_api.py:78 - test_get
    -> Name too short (8 < 15)
[INFO] Naming compliance: 97.9%
[PASS] Test naming convention compliance meets threshold
[INFO] Common patterns: test_should_*, test_when_*, test_given_*
─────────────────────────────────
CQ-035: Naming Convention Audit PASSED
Total: 1 passed, 0 failed`
  },
  {
    id: 'CQ-036', title: 'Test Independence Validation',
    category: 'Test Isolation', layer: 'TestQuality',
    framework: 'pytest / Randomized', language: 'Python',
    difficulty: 'Advanced',
    description: 'Validate that banking tests are independent and can run in any order. Run the test suite with randomized ordering multiple times to detect order-dependent tests that may hide bugs or give false confidence in CI results.',
    prerequisites: 'pytest-randomly installed, Full test suite, Database fixtures with proper teardown',
    config: 'TEST_DIR=tests/\nRANDOM_RUNS=3\nSEED_VALUES=12345,67890,11111\nFAIL_ON_ORDER_DEPENDENCY=true\nTIMEOUT_SEC=600',
    code: `#!/usr/bin/env python3
"""CQ-036: Test Independence Validation"""
import subprocess, json, sys

TEST_DIR = "tests/"
SEEDS = [12345, 67890, 11111]

def run_with_seed(seed):
    """Run tests with specific random seed"""
    cmd = ["pytest", TEST_DIR, "-p", "randomly", f"--randomly-seed={seed}",
           "--json-report", f"--json-report-file=/tmp/random_{seed}.json",
           "-q", "--tb=short"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    try:
        with open(f"/tmp/random_{seed}.json") as f:
            report = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None
    outcomes = {}
    for t in report.get("tests", []):
        outcomes[t["nodeid"]] = t["outcome"]
    return outcomes

def compare_runs(runs):
    """Compare test outcomes across randomized runs"""
    all_tests = set()
    for run in runs.values():
        if run:
            all_tests.update(run.keys())

    inconsistent = []
    for test in all_tests:
        outcomes = set()
        for seed, run in runs.items():
            if run and test in run:
                outcomes.add(run[test])
        if len(outcomes) > 1:
            inconsistent.append(test)
    return inconsistent

if __name__ == "__main__":
    print("[TEST] Test Independence Validation")
    runs = {}
    for seed in SEEDS:
        print(f"[INFO] Running with seed {seed}...")
        runs[seed] = run_with_seed(seed)
        if runs[seed]:
            passed = sum(1 for v in runs[seed].values() if v == "passed")
            failed = sum(1 for v in runs[seed].values() if v == "failed")
            print(f"  [INFO] Seed {seed}: {passed} passed, {failed} failed")

    inconsistent = compare_runs(runs)
    if inconsistent:
        print(f"[FAIL] {len(inconsistent)} order-dependent tests found:")
        for t in inconsistent[:5]:
            print(f"  -> {t}")
        sys.exit(1)
    print(f"[PASS] All tests produce consistent results across orderings")
    print(f"[INFO] Seeds tested: {len(SEEDS)}")
    print("\\nCQ-036: Test Independence PASSED")`,
    expectedOutput: `[TEST] Test Independence Validation
[INFO] Running with seed 12345...
  [INFO] Seed 12345: 142 passed, 0 failed
[INFO] Running with seed 67890...
  [INFO] Seed 67890: 142 passed, 0 failed
[INFO] Running with seed 11111...
  [INFO] Seed 11111: 142 passed, 0 failed
[PASS] All tests produce consistent results across orderings
[INFO] Seeds tested: 3
[INFO] Test count consistent: 142 across all runs
[INFO] No shared state contamination detected
─────────────────────────────────
CQ-036: Test Independence PASSED
Total: 1 passed, 0 failed`
  },
  {
    id: 'CQ-037', title: 'Assertion Quality Check',
    category: 'Assertion Analysis', layer: 'TestQuality',
    framework: 'AST Analysis / Python', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Analyze assertion quality in banking test suites to detect weak or missing assertions. Identify tests with no assertions, tests using only assertTrue(True), and tests that check side effects without verifying business logic outcomes.',
    prerequisites: 'Test source code, AST parsing library, Assertion pattern database',
    config: 'TEST_DIR=tests/\nMIN_ASSERTIONS_PER_TEST=1\nBAN_PATTERNS=assertTrue(True),assertEqual(1,1)\nWARN_SINGLE_ASSERT=true',
    code: `#!/usr/bin/env python3
"""CQ-037: Assertion Quality Check"""
import ast, os, sys

TEST_DIR = "tests/"
MIN_ASSERTIONS = 1
WEAK_PATTERNS = ["assertTrue(True)", "assertEqual(1, 1)", "assertIsNotNone(None)"]

class AssertionVisitor(ast.NodeVisitor):
    def __init__(self):
        self.assertions = 0
        self.weak = 0
        self.names = []

    def visit_Call(self, node):
        if isinstance(node.func, ast.Attribute):
            name = node.func.attr
            if name.startswith("assert") or name == "fail":
                self.assertions += 1
                self.names.append(name)
        elif isinstance(node.func, ast.Name):
            if node.func.id in ("assert_", "fail"):
                self.assertions += 1
        self.generic_visit(node)

    def visit_Assert(self, node):
        self.assertions += 1
        self.generic_visit(node)

def analyze_test_file(filepath):
    """Analyze assertions in a test file"""
    with open(filepath) as f:
        try:
            tree = ast.parse(f.read())
        except SyntaxError:
            return []
    results = []
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            if node.name.startswith("test_"):
                visitor = AssertionVisitor()
                visitor.visit(node)
                results.append({
                    "name": node.name, "file": filepath,
                    "line": node.lineno,
                    "assertion_count": visitor.assertions,
                    "assertion_types": visitor.names
                })
    return results

if __name__ == "__main__":
    print("[TEST] Assertion Quality Check")
    all_tests = []
    for root, dirs, files in os.walk(TEST_DIR):
        for f in files:
            if f.startswith("test_") and f.endswith(".py"):
                all_tests.extend(analyze_test_file(os.path.join(root, f)))

    print(f"[INFO] Test methods analyzed: {len(all_tests)}")
    no_assert = [t for t in all_tests if t["assertion_count"] == 0]
    weak = [t for t in all_tests if t["assertion_count"] == 1]
    total_asserts = sum(t["assertion_count"] for t in all_tests)
    avg = total_asserts / len(all_tests) if all_tests else 0

    print(f"[INFO] Total assertions: {total_asserts}")
    print(f"[INFO] Average per test: {avg:.1f}")
    print(f"[INFO] Tests with no assertions: {len(no_assert)}")
    if no_assert:
        for t in no_assert[:3]:
            print(f"  [FAIL] {t['file']}:{t['line']} - {t['name']}")
    if len(no_assert) == 0:
        print("[PASS] All tests have assertions")
    else:
        print(f"[FAIL] {len(no_assert)} tests missing assertions")
        sys.exit(1)
    print("\\nCQ-037: Assertion Quality PASSED")`,
    expectedOutput: `[TEST] Assertion Quality Check
[INFO] Test methods analyzed: 142
[INFO] Total assertions: 487
[INFO] Average per test: 3.4
[INFO] Tests with no assertions: 0
[PASS] All tests have assertions
[INFO] Single-assertion tests: 8 (consider adding more)
[INFO] Top assertion types: assertEqual(198), assertTrue(124), assertIn(87)
[INFO] No weak assertion patterns detected
─────────────────────────────────
CQ-037: Assertion Quality PASSED
Total: 1 passed, 0 failed`
  },
  {
    id: 'CQ-038', title: 'Test Data Management Audit',
    category: 'Test Data', layer: 'TestQuality',
    framework: 'pytest / Fixtures', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Audit test data management practices in banking test suites. Verify that tests use proper fixtures, factories, or builders instead of hardcoded data. Check that no real customer data, account numbers, or PII is embedded in test files.',
    prerequisites: 'Test source code, Pattern matching rules for PII, Test data fixture files, Banking data format patterns',
    config: 'TEST_DIR=tests/\nPII_PATTERNS=SSN,ACCOUNT_NUMBER,CREDIT_CARD\nSSN_REGEX=\\d{3}-\\d{2}-\\d{4}\nACCOUNT_REGEX=\\d{10,12}\nCC_REGEX=\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}',
    code: `#!/usr/bin/env python3
"""CQ-038: Test Data Management Audit"""
import os, re, sys

TEST_DIR = "tests/"
PII_PATTERNS = {
    "SSN": re.compile(r"\\b\\d{3}-\\d{2}-\\d{4}\\b"),
    "Credit Card": re.compile(r"\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})\\b"),
    "Account Number": re.compile(r"\\baccount[_\\s]*(?:number|num|no)[_\\s]*[:=]\\s*['\"]?\\d{10,12}", re.IGNORECASE),
    "Email PII": re.compile(r"\\b[a-zA-Z]+\\.[a-zA-Z]+@[a-z]+bank\\.com\\b"),
}
FACTORY_PATTERNS = ["factory", "faker", "fixture", "builder", "conftest"]

def scan_for_pii(filepath):
    """Scan a test file for potential PII"""
    findings = []
    with open(filepath) as f:
        for i, line in enumerate(f, 1):
            for pii_type, pattern in PII_PATTERNS.items():
                if pattern.search(line):
                    findings.append({
                        "file": filepath, "line": i,
                        "type": pii_type, "content": line.strip()[:80]
                    })
    return findings

def check_factory_usage():
    """Verify test data factories are used"""
    factory_files = []
    hardcoded_data = 0
    for root, dirs, files in os.walk(TEST_DIR):
        for f in files:
            if f.endswith(".py"):
                fpath = os.path.join(root, f)
                with open(fpath) as fp:
                    content = fp.read().lower()
                if any(p in content for p in FACTORY_PATTERNS):
                    factory_files.append(fpath)
                if "hardcoded" in content or content.count('= "') > 20:
                    hardcoded_data += 1
    return factory_files, hardcoded_data

if __name__ == "__main__":
    print("[TEST] Test Data Management Audit")
    all_pii = []
    file_count = 0
    for root, dirs, files in os.walk(TEST_DIR):
        for f in files:
            if f.endswith(".py"):
                file_count += 1
                pii = scan_for_pii(os.path.join(root, f))
                all_pii.extend(pii)

    print(f"[INFO] Test files scanned: {file_count}")
    print(f"[INFO] PII findings: {len(all_pii)}")
    if all_pii:
        for p in all_pii[:5]:
            print(f"  [FAIL] {p['file']}:{p['line']} - {p['type']}: {p['content']}")
    else:
        print("[PASS] No PII detected in test files")

    factories, hardcoded = check_factory_usage()
    print(f"[INFO] Factory/fixture files: {len(factories)}")
    if factories:
        print("[PASS] Test data factories in use")
    else:
        print("[WARN] No factory pattern detected")
    if len(all_pii) > 0:
        sys.exit(1)
    print("\\nCQ-038: Test Data Audit PASSED")`,
    expectedOutput: `[TEST] Test Data Management Audit
[INFO] Test files scanned: 28
[INFO] PII findings: 0
[PASS] No PII detected in test files
[INFO] Factory/fixture files: 4
[PASS] Test data factories in use
[INFO] conftest.py fixtures: 12 defined
[INFO] Factory patterns: faker(3), factory_boy(1)
[INFO] Test data isolation: proper teardown confirmed
─────────────────────────────────
CQ-038: Test Data Audit PASSED
Total: 2 passed, 0 failed`
  },
  {
    id: 'CQ-039', title: 'Integration Test Coverage',
    category: 'Integration Tests', layer: 'TestQuality',
    framework: 'pytest / TestContainers', language: 'Python',
    difficulty: 'Advanced',
    description: 'Validate that banking integration tests cover all critical workflows end-to-end. Verify that payment processing, account management, compliance reporting, and fraud detection flows have dedicated integration tests with proper external service mocking.',
    prerequisites: 'Integration test suite, TestContainers or Docker Compose setup, API endpoint list, Workflow documentation',
    config: 'TEST_DIR=tests/integration/\nCRITICAL_FLOWS=payment_processing,account_management,compliance_reporting,fraud_detection\nMIN_INTEGRATION_TESTS=20\nEXTERNAL_SERVICES=database,redis,elasticsearch',
    code: `#!/usr/bin/env python3
"""CQ-039: Integration Test Coverage"""
import os, ast, re, sys

TEST_DIR = "tests/integration/"
CRITICAL_FLOWS = [
    "payment_processing", "account_management",
    "compliance_reporting", "fraud_detection"
]
MIN_TESTS = 20

def find_integration_tests():
    """Find all integration test files and methods"""
    tests = []
    for root, dirs, files in os.walk(TEST_DIR):
        for f in files:
            if f.startswith("test_") and f.endswith(".py"):
                fpath = os.path.join(root, f)
                with open(fpath) as fp:
                    try:
                        tree = ast.parse(fp.read())
                    except SyntaxError:
                        continue
                for node in ast.walk(tree):
                    if isinstance(node, ast.FunctionDef) and node.name.startswith("test_"):
                        tests.append({"name": node.name, "file": fpath})
    return tests

def check_flow_coverage(tests):
    """Verify critical flows have integration tests"""
    flow_coverage = {}
    for flow in CRITICAL_FLOWS:
        matching = [t for t in tests
                    if flow in t["name"] or flow in t["file"]]
        flow_coverage[flow] = len(matching)
    return flow_coverage

def check_external_mocking(tests):
    """Verify external services are properly mocked"""
    mocked_count = 0
    for root, dirs, files in os.walk(TEST_DIR):
        for f in files:
            if f.endswith(".py"):
                with open(os.path.join(root, f)) as fp:
                    content = fp.read()
                if "mock" in content.lower() or "patch" in content.lower() or "testcontainer" in content.lower():
                    mocked_count += 1
    return mocked_count

if __name__ == "__main__":
    print("[TEST] Integration Test Coverage")
    tests = find_integration_tests()
    print(f"[INFO] Integration tests found: {len(tests)}")

    if len(tests) < MIN_TESTS:
        print(f"[FAIL] Only {len(tests)} integration tests (min: {MIN_TESTS})")
        sys.exit(1)
    print(f"[PASS] Integration test count: {len(tests)} (min: {MIN_TESTS})")

    coverage = check_flow_coverage(tests)
    for flow, count in coverage.items():
        status = "PASS" if count > 0 else "FAIL"
        print(f"[{status}] Flow '{flow}': {count} tests")

    uncovered = [f for f, c in coverage.items() if c == 0]
    if uncovered:
        print(f"[FAIL] Uncovered flows: {', '.join(uncovered)}")
        sys.exit(1)
    print("[PASS] All critical flows have integration tests")

    mocked = check_external_mocking(tests)
    print(f"[INFO] Files with external mocking: {mocked}")
    print("\\nCQ-039: Integration Test Coverage PASSED")`,
    expectedOutput: `[TEST] Integration Test Coverage
[INFO] Integration tests found: 34
[PASS] Integration test count: 34 (min: 20)
[PASS] Flow 'payment_processing': 12 tests
[PASS] Flow 'account_management': 8 tests
[PASS] Flow 'compliance_reporting': 7 tests
[PASS] Flow 'fraud_detection': 7 tests
[PASS] All critical flows have integration tests
[INFO] Files with external mocking: 6
[INFO] TestContainers: PostgreSQL, Redis, Elasticsearch
─────────────────────────────────
CQ-039: Integration Test Coverage PASSED
Total: 5 passed, 0 failed`
  },
  {
    id: 'CQ-040', title: 'Test Report Generation Audit',
    category: 'Test Reporting', layer: 'TestQuality',
    framework: 'Allure / pytest-html', language: 'Bash',
    difficulty: 'Beginner',
    description: 'Validate that test reporting is properly configured for banking CI pipelines. Check that Allure reports are generated with proper categorization, history trends are maintained, and test evidence is captured for audit compliance.',
    prerequisites: 'Allure CLI installed, pytest-allure plugin configured, Report server access, Historical data directory',
    config: 'ALLURE_RESULTS=allure-results/\nALLURE_REPORT=allure-report/\nHISTORY_DIR=allure-history/\nCATEGORIES_FILE=allure-categories.json\nSERVER_URL=https://allure.bank.local',
    code: `#!/bin/bash
# CQ-040: Test Report Generation Audit
set -euo pipefail

echo "[TEST] Test Report Generation Audit"
PASS=0; FAIL=0

ALLURE_RESULTS="allure-results/"
ALLURE_REPORT="allure-report/"
HISTORY="allure-history/"

# Run tests with Allure
echo "[INFO] Running tests with Allure reporting..."
pytest tests/ --alluredir=\$ALLURE_RESULTS -q --tb=no 2>/dev/null || true

# Check Allure results exist
if [ -d "\$ALLURE_RESULTS" ] && [ "$(ls -A \$ALLURE_RESULTS 2>/dev/null)" ]; then
    RESULT_COUNT=$(ls \$ALLURE_RESULTS/*.json 2>/dev/null | wc -l)
    echo "[PASS] Allure results generated: \$RESULT_COUNT files"
    ((PASS++))
else
    echo "[FAIL] Allure results not generated"
    ((FAIL++))
fi

# Copy history for trends
if [ -d "\$HISTORY" ]; then
    cp -r "\$HISTORY" "\$ALLURE_RESULTS/history" 2>/dev/null || true
    echo "[PASS] History trends included"
    ((PASS++))
fi

# Generate report
allure generate \$ALLURE_RESULTS -o \$ALLURE_REPORT --clean 2>/dev/null
if [ -f "\$ALLURE_REPORT/index.html" ]; then
    echo "[PASS] Allure report generated"
    ((PASS++))
else
    echo "[FAIL] Report generation failed"
    ((FAIL++))
fi

# Check categories file
if [ -f "allure-categories.json" ]; then
    CAT_COUNT=$(jq length allure-categories.json)
    echo "[PASS] Categories configured: \$CAT_COUNT"
    ((PASS++))
else
    echo "[WARN] Categories file not found"
fi

# Verify report sections
for SECTION in "suites" "graphs" "timeline"; do
    if [ -d "\$ALLURE_REPORT/data/\$SECTION" ] || [ -f "\$ALLURE_REPORT/data/\$SECTION.json" ]; then
        echo "[PASS] Report section '\$SECTION' present"
        ((PASS++))
    fi
done

echo ""
echo "CQ-040: Report Generation — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Test Report Generation Audit
[INFO] Running tests with Allure reporting...
[PASS] Allure results generated: 142 files
[PASS] History trends included
[PASS] Allure report generated
[PASS] Categories configured: 6
[PASS] Report section 'suites' present
[PASS] Report section 'graphs' present
[PASS] Report section 'timeline' present
[INFO] Report URL: https://allure.bank.local/report/latest
[INFO] Trend data: 30 days of history
─────────────────────────────────
CQ-040: Report Generation — 7 passed, 0 failed`
  },

  /* ====== TAB 5: Repository Management (CQ-041 to CQ-050) ====== */
  {
    id: 'CQ-041', title: 'Pre-Commit Hook Validation',
    category: 'Git Hooks', layer: 'RepoManagement',
    framework: 'pre-commit / Husky', language: 'Bash',
    difficulty: 'Beginner',
    description: 'Validate that pre-commit hooks are properly configured for banking repositories. Verify hooks run linting, formatting, secret detection, and commit message validation before any code can be committed to the repository.',
    prerequisites: 'pre-commit framework installed, .pre-commit-config.yaml defined, Git repository initialized',
    config: 'PRE_COMMIT_CONFIG=.pre-commit-config.yaml\nREQUIRED_HOOKS=ruff,black,mypy,detect-secrets\nHOOK_TIMEOUT_SEC=120\nAUTO_FIX=true',
    code: `#!/bin/bash
# CQ-041: Pre-Commit Hook Validation
set -euo pipefail

echo "[TEST] Pre-Commit Hook Validation"
PASS=0; FAIL=0

CONFIG=".pre-commit-config.yaml"

# Check config exists
if [ -f "\$CONFIG" ]; then
    echo "[PASS] Pre-commit config exists: \$CONFIG"
    ((PASS++))
else
    echo "[FAIL] Pre-commit config not found: \$CONFIG"
    ((FAIL++))
    exit 1
fi

# Check required hooks
REQUIRED_HOOKS=("ruff" "black" "mypy" "detect-secrets")
for HOOK in "\${REQUIRED_HOOKS[@]}"; do
    if grep -q "\$HOOK" "\$CONFIG"; then
        echo "[PASS] Hook '\$HOOK' configured"
        ((PASS++))
    else
        echo "[FAIL] Hook '\$HOOK' missing from config"
        ((FAIL++))
    fi
done

# Verify hooks are installed
if [ -f ".git/hooks/pre-commit" ]; then
    echo "[PASS] Pre-commit hook installed in .git/hooks/"
    ((PASS++))
else
    echo "[FAIL] Pre-commit hook not installed"
    echo "[INFO] Run: pre-commit install"
    ((FAIL++))
fi

# Run hooks in dry-run mode
echo "[INFO] Running pre-commit in check mode..."
if pre-commit run --all-files 2>&1 | tail -5; then
    echo "[PASS] All pre-commit hooks pass"
    ((PASS++))
else
    echo "[WARN] Some hooks reported issues (auto-fixable)"
fi

# Check hook versions are pinned
UNPINNED=$(grep -c "rev: ''" "\$CONFIG" 2>/dev/null || echo 0)
if [ "\$UNPINNED" -eq 0 ]; then
    echo "[PASS] All hook versions pinned"
    ((PASS++))
else
    echo "[FAIL] \$UNPINNED hooks with unpinned versions"
    ((FAIL++))
fi

echo ""
echo "CQ-041: Pre-Commit Hooks — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Pre-Commit Hook Validation
[PASS] Pre-commit config exists: .pre-commit-config.yaml
[PASS] Hook 'ruff' configured
[PASS] Hook 'black' configured
[PASS] Hook 'mypy' configured
[PASS] Hook 'detect-secrets' configured
[PASS] Pre-commit hook installed in .git/hooks/
[INFO] Running pre-commit in check mode...
[PASS] All pre-commit hooks pass
[PASS] All hook versions pinned
[INFO] Hooks: 4 repos, 6 hooks total
─────────────────────────────────
CQ-041: Pre-Commit Hooks — 8 passed, 0 failed`
  },
  {
    id: 'CQ-042', title: 'Git Branch Strategy Audit',
    category: 'Branch Strategy', layer: 'RepoManagement',
    framework: 'Git / GitHub API', language: 'Bash',
    difficulty: 'Intermediate',
    description: 'Audit Git branch strategy compliance for banking repositories. Validate branch naming conventions (feature/*, fix/*, release/*), verify stale branch cleanup, and ensure no direct commits to protected branches.',
    prerequisites: 'Git repository with history, Branch naming convention documented, gh CLI authenticated',
    config: 'REPO=bank-org/core-banking\nALLOWED_PREFIXES=feature/,fix/,release/,hotfix/,chore/\nSTALE_DAYS=30\nPROTECTED=main,develop\nMAX_BRANCHES=50',
    code: `#!/bin/bash
# CQ-042: Git Branch Strategy Audit
set -euo pipefail

echo "[TEST] Git Branch Strategy Audit"
PASS=0; FAIL=0

PREFIXES=("feature/" "fix/" "release/" "hotfix/" "chore/")
PROTECTED=("main" "develop")
STALE_DAYS=30
MAX_BRANCHES=50

# List all remote branches
BRANCHES=$(git branch -r --format='%(refname:short)' | grep -v HEAD | sed 's|origin/||')
BRANCH_COUNT=$(echo "\$BRANCHES" | wc -l)
echo "[INFO] Total remote branches: \$BRANCH_COUNT"

if [ "\$BRANCH_COUNT" -le "\$MAX_BRANCHES" ]; then
    echo "[PASS] Branch count \$BRANCH_COUNT <= \$MAX_BRANCHES"
    ((PASS++))
else
    echo "[FAIL] Too many branches: \$BRANCH_COUNT > \$MAX_BRANCHES"
    ((FAIL++))
fi

# Check naming conventions
INVALID=0
for BRANCH in \$BRANCHES; do
    VALID=false
    for PREFIX in "\${PREFIXES[@]}"; do
        if [[ "\$BRANCH" == \$PREFIX* ]] || [[ "\$BRANCH" == "main" ]] || [[ "\$BRANCH" == "develop" ]]; then
            VALID=true
            break
        fi
    done
    if [ "\$VALID" = false ]; then
        echo "  [WARN] Non-standard branch: \$BRANCH"
        ((INVALID++))
    fi
done

if [ "\$INVALID" -eq 0 ]; then
    echo "[PASS] All branches follow naming convention"
    ((PASS++))
else
    echo "[WARN] \$INVALID branches with non-standard names"
fi

# Check for stale branches
CUTOFF=$(date -d "-\$STALE_DAYS days" +%s)
STALE=0
for BRANCH in \$BRANCHES; do
    LAST_COMMIT=$(git log -1 --format=%ct "origin/\$BRANCH" 2>/dev/null || echo 0)
    if [ "\$LAST_COMMIT" -lt "\$CUTOFF" ] && [ "\$LAST_COMMIT" -gt 0 ]; then
        IS_PROTECTED=false
        for P in "\${PROTECTED[@]}"; do
            [ "\$BRANCH" = "\$P" ] && IS_PROTECTED=true
        done
        if [ "\$IS_PROTECTED" = false ]; then
            ((STALE++))
        fi
    fi
done

echo "[INFO] Stale branches (> \$STALE_DAYS days): \$STALE"
if [ "\$STALE" -eq 0 ]; then
    echo "[PASS] No stale branches"
    ((PASS++))
else
    echo "[WARN] \$STALE branches should be cleaned up"
fi

echo ""
echo "CQ-042: Branch Strategy — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Git Branch Strategy Audit
[INFO] Total remote branches: 12
[PASS] Branch count 12 <= 50
[PASS] All branches follow naming convention
[INFO] Stale branches (> 30 days): 0
[PASS] No stale branches
[INFO] Branch distribution: feature(6), fix(3), release(1), protected(2)
[INFO] Most active: feature/payment-v2 (4 commits today)
─────────────────────────────────
CQ-042: Branch Strategy — 3 passed, 0 failed`
  },
  {
    id: 'CQ-043', title: 'Commit Signature Verification',
    category: 'Commit Validation', layer: 'RepoManagement',
    framework: 'GPG / Git', language: 'Bash',
    difficulty: 'Advanced',
    description: 'Verify that all commits in banking repositories are GPG-signed to maintain an auditable chain of custody. Validate that developer signing keys are registered, signatures are valid, and unsigned commits are blocked by pre-push hooks.',
    prerequisites: 'GPG keys distributed to developers, Git signing configured, Key registry maintained, Pre-push hook configured',
    config: 'REPO=bank-org/core-banking\nBRANCH=main\nCHECK_LAST_N=50\nREQUIRE_SIGNING=true\nKEY_REGISTRY=https://keyserver.bank.local\nMIN_KEY_BITS=4096',
    code: `#!/bin/bash
# CQ-043: Commit Signature Verification
set -euo pipefail

echo "[TEST] Commit Signature Verification"
PASS=0; FAIL=0
CHECK_N=50

# Check Git signing config
SIGN_KEY=$(git config --get user.signingkey 2>/dev/null || echo "")
SIGN_COMMITS=$(git config --get commit.gpgsign 2>/dev/null || echo "false")

if [ -n "\$SIGN_KEY" ]; then
    echo "[PASS] Signing key configured: \${SIGN_KEY:0:8}..."
    ((PASS++))
else
    echo "[FAIL] No signing key configured"
    ((FAIL++))
fi

if [ "\$SIGN_COMMITS" = "true" ]; then
    echo "[PASS] Commit signing enabled globally"
    ((PASS++))
else
    echo "[FAIL] Commit signing not enabled"
    ((FAIL++))
fi

# Verify signatures on recent commits
echo "[INFO] Checking last \$CHECK_N commits..."
SIGNED=0; UNSIGNED=0; INVALID=0

git log --format='%H %G?' -n \$CHECK_N | while read HASH STATUS; do
    case "\$STATUS" in
        G) ((SIGNED++)) ;;
        B) ((INVALID++)); echo "  [FAIL] Invalid signature: \${HASH:0:8}" ;;
        N) ((UNSIGNED++)) ;;
        U) ((SIGNED++)) ;; # Good signature but untrusted key
    esac
done

SIGNED=$(git log --format='%G?' -n \$CHECK_N | grep -c '^[GU]' || echo 0)
UNSIGNED=$(git log --format='%G?' -n \$CHECK_N | grep -c '^N' || echo 0)
INVALID=$(git log --format='%G?' -n \$CHECK_N | grep -c '^B' || echo 0)

echo "[INFO] Signed: \$SIGNED, Unsigned: \$UNSIGNED, Invalid: \$INVALID"

if [ "\$UNSIGNED" -eq 0 ] && [ "\$INVALID" -eq 0 ]; then
    echo "[PASS] All \$CHECK_N commits are signed"
    ((PASS++))
else
    echo "[FAIL] Found unsigned or invalid commits"
    ((FAIL++))
fi

# Check key strength
KEY_BITS=$(gpg --list-keys --with-colons 2>/dev/null | grep "^pub" | head -1 | cut -d: -f3)
if [ -n "\$KEY_BITS" ] && [ "\$KEY_BITS" -ge 4096 ]; then
    echo "[PASS] Key strength: \$KEY_BITS bits (min: 4096)"
    ((PASS++))
fi

echo ""
echo "CQ-043: Commit Signatures — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Commit Signature Verification
[PASS] Signing key configured: A1B2C3D4...
[PASS] Commit signing enabled globally
[INFO] Checking last 50 commits...
[INFO] Signed: 50, Unsigned: 0, Invalid: 0
[PASS] All 50 commits are signed
[PASS] Key strength: 4096 bits (min: 4096)
[INFO] Key algorithm: RSA
[INFO] Key expiry: 2027-01-15
─────────────────────────────────
CQ-043: Commit Signatures — 4 passed, 0 failed`
  },
  {
    id: 'CQ-044', title: 'Dependency Scanning Pipeline',
    category: 'Dependency Scanning', layer: 'RepoManagement',
    framework: 'Dependabot / Renovate', language: 'YAML',
    difficulty: 'Intermediate',
    description: 'Validate automated dependency scanning and update pipelines for banking repositories. Verify Dependabot or Renovate is configured to scan for outdated and vulnerable dependencies, auto-create PRs, and respect banking-specific version pinning policies.',
    prerequisites: 'Dependabot or Renovate configured, GitHub repository access, Dependency policy document',
    config: 'DEPENDABOT_CONFIG=.github/dependabot.yml\nSCAN_INTERVAL=weekly\nAUTO_MERGE=false\nSECURITY_ONLY=false\nMAX_OPEN_PRS=10\nALLOW_MAJOR=false',
    code: `# CQ-044: Dependency Scanning Pipeline Validation
# File: validate_dependabot.py
#!/usr/bin/env python3
"""CQ-044: Dependency Scanning Pipeline"""
import yaml, os, sys, requests

CONFIG_PATH = ".github/dependabot.yml"
REQUIRED_ECOSYSTEMS = ["pip", "npm", "docker", "github-actions"]
MAX_OPEN_PRS = 10

def validate_config():
    """Validate Dependabot configuration"""
    print("[TEST] Dependency Scanning Pipeline")
    if not os.path.exists(CONFIG_PATH):
        print(f"[FAIL] Config not found: {CONFIG_PATH}")
        sys.exit(1)
    print(f"[PASS] Dependabot config exists")

    with open(CONFIG_PATH) as f:
        config = yaml.safe_load(f)

    version = config.get("version", 0)
    if version != 2:
        print(f"[FAIL] Config version {version} (expected 2)")
        sys.exit(1)
    print(f"[PASS] Config version: {version}")

    updates = config.get("updates", [])
    ecosystems = [u.get("package-ecosystem") for u in updates]
    print(f"[INFO] Configured ecosystems: {ecosystems}")

    for req in REQUIRED_ECOSYSTEMS:
        if req in ecosystems:
            print(f"[PASS] Ecosystem '{req}' configured")
        else:
            print(f"[FAIL] Ecosystem '{req}' missing")
            sys.exit(1)

    for update in updates:
        eco = update.get("package-ecosystem")
        schedule = update.get("schedule", {}).get("interval", "unknown")
        directory = update.get("directory", "/")
        limit = update.get("open-pull-requests-limit", 5)
        print(f"[INFO] {eco}: schedule={schedule}, dir={directory}, pr_limit={limit}")

        # Check auto-merge is not enabled for banking
        if update.get("auto-merge", False):
            print(f"[FAIL] Auto-merge enabled for {eco} (not allowed in banking)")
            sys.exit(1)

    print("[PASS] Auto-merge disabled on all ecosystems")
    return config

def check_security_updates():
    """Verify security-only updates are handled promptly"""
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        print("[WARN] GITHUB_TOKEN not set, skipping PR check")
        return
    headers = {"Authorization": f"token {token}"}
    url = "https://api.github.com/repos/bank-org/core-banking/pulls"
    r = requests.get(url, headers=headers,
                     params={"state": "open", "head": "dependabot"}, timeout=15)
    prs = [p for p in r.json() if "dependabot" in p.get("user", {}).get("login", "")]
    print(f"[INFO] Open Dependabot PRs: {len(prs)}")
    if len(prs) > MAX_OPEN_PRS:
        print(f"[WARN] Too many open PRs: {len(prs)} > {MAX_OPEN_PRS}")

if __name__ == "__main__":
    validate_config()
    check_security_updates()
    print("\\nCQ-044: Dependency Scanning PASSED")`,
    expectedOutput: `[TEST] Dependency Scanning Pipeline
[PASS] Dependabot config exists
[PASS] Config version: 2
[INFO] Configured ecosystems: ['pip', 'npm', 'docker', 'github-actions']
[PASS] Ecosystem 'pip' configured
[PASS] Ecosystem 'npm' configured
[PASS] Ecosystem 'docker' configured
[PASS] Ecosystem 'github-actions' configured
[INFO] pip: schedule=weekly, dir=/, pr_limit=10
[INFO] npm: schedule=weekly, dir=/frontend, pr_limit=5
[PASS] Auto-merge disabled on all ecosystems
[INFO] Open Dependabot PRs: 3
─────────────────────────────────
CQ-044: Dependency Scanning PASSED
Total: 7 passed, 0 failed`
  },
  {
    id: 'CQ-045', title: 'Secret Detection in Repository',
    category: 'Secret Scanning', layer: 'RepoManagement',
    framework: 'detect-secrets / truffleHog', language: 'Python',
    difficulty: 'Advanced',
    description: 'Scan banking repository for accidentally committed secrets, API keys, passwords, and tokens. Use detect-secrets and truffleHog to identify high-entropy strings, known secret patterns, and credentials in code, config, and history.',
    prerequisites: 'detect-secrets installed, truffleHog installed, Git repository with history, Baseline secrets file',
    config: 'DETECT_SECRETS_BASELINE=.secrets.baseline\nSCAN_HISTORY=true\nHIGH_ENTROPY_THRESHOLD=4.5\nEXCLUDE_PATTERNS=*.lock,*.min.js\nALERT_WEBHOOK=https://security.bank.local/alerts',
    code: `#!/usr/bin/env python3
"""CQ-045: Secret Detection in Repository"""
import subprocess, json, sys, os

BASELINE = ".secrets.baseline"

def run_detect_secrets():
    """Run detect-secrets scan"""
    print("[TEST] Secret Detection in Repository")
    cmd = ["detect-secrets", "scan", "--all-files",
           "--exclude-files", ".*\\.lock$",
           "--exclude-files", ".*\\.min\\.js$"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    try:
        scan = json.loads(result.stdout)
    except json.JSONDecodeError:
        print("[FAIL] Could not parse scan results")
        sys.exit(1)
    return scan

def compare_baseline(scan):
    """Compare scan against baseline to find new secrets"""
    if not os.path.exists(BASELINE):
        print("[WARN] No baseline file, treating all findings as new")
        return scan.get("results", {})

    with open(BASELINE) as f:
        baseline = json.load(f)

    new_findings = {}
    for filename, secrets in scan.get("results", {}).items():
        baseline_secrets = baseline.get("results", {}).get(filename, [])
        baseline_hashes = {s.get("hashed_secret") for s in baseline_secrets}
        new = [s for s in secrets if s.get("hashed_secret") not in baseline_hashes]
        if new:
            new_findings[filename] = new
    return new_findings

def run_trufflehog():
    """Run truffleHog for git history scanning"""
    cmd = ["trufflehog", "git", "file://.", "--json", "--only-verified"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    findings = []
    for line in result.stdout.strip().split("\\n"):
        if line.strip():
            try:
                findings.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return findings

if __name__ == "__main__":
    scan = run_detect_secrets()
    total = sum(len(v) for v in scan.get("results", {}).values())
    print(f"[INFO] Total potential secrets found: {total}")

    new_findings = compare_baseline(scan)
    new_count = sum(len(v) for v in new_findings.values())
    print(f"[INFO] New secrets (not in baseline): {new_count}")

    if new_count > 0:
        for filename, secrets in new_findings.items():
            for s in secrets:
                print(f"  [ALERT] {filename}:{s.get('line_number', '?')}"
                      f" - {s.get('type', 'Unknown')} detected")
        print(f"[FAIL] {new_count} new secrets detected!")
        sys.exit(1)
    print("[PASS] No new secrets detected")

    history = run_trufflehog()
    print(f"[INFO] Git history findings: {len(history)}")
    if len(history) == 0:
        print("[PASS] Git history clean of verified secrets")
    print("\\nCQ-045: Secret Detection PASSED")`,
    expectedOutput: `[TEST] Secret Detection in Repository
[INFO] Total potential secrets found: 4
[INFO] New secrets (not in baseline): 0
[PASS] No new secrets detected
[INFO] Git history findings: 0
[PASS] Git history clean of verified secrets
[INFO] Baseline entries: 4 (all reviewed and whitelisted)
[INFO] Scan coverage: 342 files, 28,450 lines
[INFO] High entropy strings checked: 89
─────────────────────────────────
CQ-045: Secret Detection PASSED
Total: 2 passed, 0 failed`
  },
  {
    id: 'CQ-046', title: 'Git LFS Configuration',
    category: 'Large Files', layer: 'RepoManagement',
    framework: 'Git LFS', language: 'Bash',
    difficulty: 'Beginner',
    description: 'Validate Git LFS configuration for banking repositories handling large files such as test data sets, ML models, and report templates. Ensure proper tracking patterns, storage limits, and bandwidth management.',
    prerequisites: 'Git LFS installed and initialized, .gitattributes configured, LFS server access',
    config: 'LFS_PATTERNS=*.csv,*.xlsx,*.pdf,*.pkl,*.h5,*.model\nMAX_FILE_SIZE_MB=100\nSTORAGE_LIMIT_GB=10\nLFS_SERVER=https://lfs.bank.local',
    code: `#!/bin/bash
# CQ-046: Git LFS Configuration Validation
set -euo pipefail

echo "[TEST] Git LFS Configuration"
PASS=0; FAIL=0
MAX_SIZE_MB=100

# Check LFS is installed
if git lfs version >/dev/null 2>&1; then
    LFS_VER=$(git lfs version | head -1)
    echo "[PASS] Git LFS installed: \$LFS_VER"
    ((PASS++))
else
    echo "[FAIL] Git LFS not installed"
    ((FAIL++))
    exit 1
fi

# Check .gitattributes
if [ -f ".gitattributes" ]; then
    LFS_PATTERNS=$(grep "filter=lfs" .gitattributes | wc -l)
    echo "[PASS] .gitattributes has \$LFS_PATTERNS LFS patterns"
    ((PASS++))

    # Verify required patterns
    for PATTERN in "*.csv" "*.xlsx" "*.pkl" "*.model"; do
        if grep -q "\$PATTERN.*filter=lfs" .gitattributes; then
            echo "  [PASS] Pattern tracked: \$PATTERN"
            ((PASS++))
        else
            echo "  [FAIL] Pattern not tracked: \$PATTERN"
            ((FAIL++))
        fi
    done
else
    echo "[FAIL] .gitattributes not found"
    ((FAIL++))
fi

# Check for large files not tracked by LFS
echo "[INFO] Scanning for large untracked files..."
LARGE_FILES=$(find . -type f -size +\${MAX_SIZE_MB}M \\
    -not -path "./.git/*" -not -path "*/node_modules/*" 2>/dev/null)

if [ -n "\$LARGE_FILES" ]; then
    echo "\$LARGE_FILES" | while read FILE; do
        SIZE=$(du -m "\$FILE" | cut -f1)
        # Check if LFS tracked
        if git lfs ls-files 2>/dev/null | grep -q "\$FILE"; then
            echo "  [PASS] \$FILE (\${SIZE}MB) - LFS tracked"
        else
            echo "  [FAIL] \$FILE (\${SIZE}MB) - NOT LFS tracked"
            ((FAIL++))
        fi
    done
else
    echo "[PASS] No large untracked files found"
    ((PASS++))
fi

# Check LFS storage usage
LFS_INFO=$(git lfs env 2>/dev/null | head -5)
echo "[INFO] LFS environment configured"

echo ""
echo "CQ-046: Git LFS — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Git LFS Configuration
[PASS] Git LFS installed: git-lfs/3.4.0
[PASS] .gitattributes has 6 LFS patterns
  [PASS] Pattern tracked: *.csv
  [PASS] Pattern tracked: *.xlsx
  [PASS] Pattern tracked: *.pkl
  [PASS] Pattern tracked: *.model
[PASS] No large untracked files found
[INFO] LFS environment configured
[INFO] LFS storage used: 2.3 GB / 10 GB
─────────────────────────────────
CQ-046: Git LFS — 7 passed, 0 failed`
  },
  {
    id: 'CQ-047', title: 'License Compliance Scan',
    category: 'License Management', layer: 'RepoManagement',
    framework: 'license-checker / FOSSA', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Scan all banking project dependencies for license compliance. Verify no dependencies use copyleft licenses (GPL, AGPL) that could require source disclosure, and ensure all dependencies have approved licenses per banking legal policy.',
    prerequisites: 'license-checker installed (npm/pip), Approved license list, Legal policy document',
    config: 'APPROVED_LICENSES=MIT,Apache-2.0,BSD-2-Clause,BSD-3-Clause,ISC,0BSD,CC0-1.0\nDENIED_LICENSES=GPL-2.0,GPL-3.0,AGPL-3.0,LGPL-2.1,LGPL-3.0\nOUTPUT_FORMAT=json\nFAIL_ON_DENIED=true',
    code: `#!/usr/bin/env python3
"""CQ-047: License Compliance Scan"""
import subprocess, json, sys

APPROVED = {"MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "0BSD", "CC0-1.0", "Unlicense", "PSF-2.0"}
DENIED = {"GPL-2.0-only", "GPL-3.0-only", "AGPL-3.0-only", "LGPL-2.1-only", "LGPL-3.0-only"}

def scan_python_licenses():
    """Scan Python package licenses using pip-licenses"""
    cmd = ["pip-licenses", "--format=json", "--with-license-file", "--no-license-path"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return []

def check_npm_licenses():
    """Scan npm package licenses"""
    cmd = ["npx", "license-checker", "--json", "--production"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return {}

def classify_license(license_name):
    """Classify a license as approved, denied, or unknown"""
    if any(a in license_name for a in APPROVED):
        return "approved"
    if any(d in license_name for d in DENIED):
        return "denied"
    return "unknown"

if __name__ == "__main__":
    print("[TEST] License Compliance Scan")
    packages = scan_python_licenses()
    print(f"[INFO] Python packages scanned: {len(packages)}")

    approved = denied = unknown = 0
    denied_list = []
    for pkg in packages:
        name = pkg.get("Name", "")
        license_name = pkg.get("License", "UNKNOWN")
        status = classify_license(license_name)
        if status == "approved":
            approved += 1
        elif status == "denied":
            denied += 1
            denied_list.append(f"{name} ({license_name})")
        else:
            unknown += 1
            if "GPL" in license_name.upper():
                denied += 1
                denied_list.append(f"{name} ({license_name})")

    print(f"[INFO] Approved: {approved}, Denied: {denied}, Unknown: {unknown}")
    if denied_list:
        for d in denied_list:
            print(f"  [FAIL] Denied license: {d}")
        print(f"[FAIL] {len(denied_list)} packages with denied licenses")
        sys.exit(1)
    print("[PASS] No denied licenses found")
    if unknown > 0:
        print(f"[WARN] {unknown} packages with unrecognized licenses need review")
    print("\\nCQ-047: License Compliance PASSED")`,
    expectedOutput: `[TEST] License Compliance Scan
[INFO] Python packages scanned: 87
[INFO] Approved: 82, Denied: 0, Unknown: 5
[PASS] No denied licenses found
[WARN] 5 packages with unrecognized licenses need review
[INFO] Most common: MIT(45), Apache-2.0(22), BSD-3-Clause(15)
[INFO] Review needed: custom-internal(3), Public Domain(2)
[INFO] SBOM exported: license-report.json
─────────────────────────────────
CQ-047: License Compliance PASSED
Total: 1 passed, 0 failed`
  },
  {
    id: 'CQ-048', title: 'Repository Size Management',
    category: 'Repo Health', layer: 'RepoManagement',
    framework: 'Git / BFG Repo-Cleaner', language: 'Bash',
    difficulty: 'Beginner',
    description: 'Monitor and enforce repository size limits for banking code repositories. Identify large files, bloated history, and unnecessary artifacts that slow clone times and consume storage. Flag repositories exceeding size budgets.',
    prerequisites: 'Git repository access, du/find utilities, Size budget policy, BFG Repo-Cleaner for remediation',
    config: 'MAX_REPO_SIZE_MB=500\nMAX_FILE_SIZE_MB=50\nWARN_OBJECTS=50000\nEXCLUDE=.git/\nIGNORE_LFS=true',
    code: `#!/bin/bash
# CQ-048: Repository Size Management
set -euo pipefail

echo "[TEST] Repository Size Management"
PASS=0; FAIL=0
MAX_REPO_MB=500
MAX_FILE_MB=50
WARN_OBJECTS=50000

# Total repository size
REPO_SIZE_KB=$(du -sk . --exclude=.git 2>/dev/null | cut -f1)
REPO_SIZE_MB=$((REPO_SIZE_KB / 1024))
echo "[INFO] Repository size (working tree): \${REPO_SIZE_MB}MB"

# Git directory size
GIT_SIZE_KB=$(du -sk .git 2>/dev/null | cut -f1)
GIT_SIZE_MB=$((GIT_SIZE_KB / 1024))
echo "[INFO] .git directory size: \${GIT_SIZE_MB}MB"

TOTAL_MB=$((REPO_SIZE_MB + GIT_SIZE_MB))
if [ "\$TOTAL_MB" -le "\$MAX_REPO_MB" ]; then
    echo "[PASS] Total size \${TOTAL_MB}MB <= \${MAX_REPO_MB}MB"
    ((PASS++))
else
    echo "[FAIL] Total size \${TOTAL_MB}MB > \${MAX_REPO_MB}MB"
    ((FAIL++))
fi

# Count git objects
OBJ_COUNT=$(git count-objects -v 2>/dev/null | grep "count:" | awk '{print $2}')
echo "[INFO] Loose objects: \$OBJ_COUNT"
if [ "\$OBJ_COUNT" -lt "\$WARN_OBJECTS" ]; then
    echo "[PASS] Object count within limits"
    ((PASS++))
fi

# Find large files in working tree
echo "[INFO] Scanning for large files..."
LARGE=$(find . -type f -size +\${MAX_FILE_MB}M -not -path "./.git/*" 2>/dev/null | head -10)
if [ -z "\$LARGE" ]; then
    echo "[PASS] No files exceed \${MAX_FILE_MB}MB"
    ((PASS++))
else
    echo "\$LARGE" | while read FILE; do
        SIZE=$(du -m "\$FILE" | cut -f1)
        echo "  [WARN] \$FILE: \${SIZE}MB"
    done
fi

# Find largest files in git history
echo "[INFO] Largest files in history:"
git rev-list --objects --all 2>/dev/null | \\
    git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' 2>/dev/null | \\
    grep '^blob' | sort -k3 -rn | head -5 | \\
    while read TYPE HASH SIZE NAME; do
        SIZE_MB=$((SIZE / 1048576))
        echo "  [INFO] \${NAME}: \${SIZE_MB}MB"
    done

echo ""
echo "CQ-048: Repo Size — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Repository Size Management
[INFO] Repository size (working tree): 124MB
[INFO] .git directory size: 89MB
[PASS] Total size 213MB <= 500MB
[INFO] Loose objects: 1247
[PASS] Object count within limits
[INFO] Scanning for large files...
[PASS] No files exceed 50MB
[INFO] Largest files in history:
  [INFO] data/test_dataset.csv: 12MB
  [INFO] models/fraud_model.pkl: 8MB
  [INFO] docs/compliance_report.pdf: 5MB
─────────────────────────────────
CQ-048: Repo Size — 3 passed, 0 failed`
  },
  {
    id: 'CQ-049', title: 'Git Tag and Release Validation',
    category: 'Release Management', layer: 'RepoManagement',
    framework: 'Git / Semantic Versioning', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Validate Git tags follow semantic versioning and are properly annotated for banking release management. Verify release tags are signed, changelogs are generated, and version numbers increment correctly across the release history.',
    prerequisites: 'Git repository with release tags, Semantic versioning policy, Release documentation, Tag signing configured',
    config: 'VERSION_PATTERN=v[0-9]+.[0-9]+.[0-9]+\nREQUIRE_ANNOTATED=true\nREQUIRE_SIGNED=true\nCHANGELOG_FILE=CHANGELOG.md\nMIN_RELEASES=5',
    code: `#!/usr/bin/env python3
"""CQ-049: Git Tag and Release Validation"""
import subprocess, re, sys

VERSION_PATTERN = re.compile(r"^v(\\d+)\\.(\\d+)\\.(\\d+)$")

def get_tags():
    """Get all version tags sorted by version"""
    result = subprocess.run(
        ["git", "tag", "--list", "v*", "--sort=version:refname"],
        capture_output=True, text=True, timeout=30
    )
    tags = [t.strip() for t in result.stdout.strip().split("\\n") if t.strip()]
    return [t for t in tags if VERSION_PATTERN.match(t)]

def parse_version(tag):
    """Parse semantic version from tag"""
    match = VERSION_PATTERN.match(tag)
    if match:
        return tuple(int(x) for x in match.groups())
    return None

def check_tag_annotation(tag):
    """Check if tag is annotated"""
    result = subprocess.run(
        ["git", "cat-file", "-t", tag],
        capture_output=True, text=True, timeout=10
    )
    return result.stdout.strip() == "tag"

def check_version_ordering(tags):
    """Verify versions increment correctly"""
    versions = [parse_version(t) for t in tags]
    issues = []
    for i in range(1, len(versions)):
        prev, curr = versions[i-1], versions[i]
        if curr <= prev:
            issues.append(f"{tags[i-1]} -> {tags[i]}: non-increasing version")
    return issues

if __name__ == "__main__":
    print("[TEST] Git Tag and Release Validation")
    tags = get_tags()
    print(f"[INFO] Version tags found: {len(tags)}")

    if len(tags) < 5:
        print(f"[WARN] Only {len(tags)} releases (recommend >= 5)")

    # Check annotation
    annotated = sum(1 for t in tags if check_tag_annotation(t))
    unannotated = len(tags) - annotated
    print(f"[INFO] Annotated: {annotated}, Lightweight: {unannotated}")
    if unannotated == 0:
        print("[PASS] All tags are annotated")
    else:
        print(f"[FAIL] {unannotated} lightweight tags found")

    # Check ordering
    issues = check_version_ordering(tags)
    if issues:
        for i in issues:
            print(f"[FAIL] {i}")
    else:
        print("[PASS] Version ordering is correct")

    # Check latest version format
    if tags:
        latest = tags[-1]
        print(f"[INFO] Latest release: {latest}")
        print(f"[PASS] Latest tag follows semver: {latest}")

    print("\\nCQ-049: Tag Validation PASSED")`,
    expectedOutput: `[TEST] Git Tag and Release Validation
[INFO] Version tags found: 12
[INFO] Annotated: 12, Lightweight: 0
[PASS] All tags are annotated
[PASS] Version ordering is correct
[INFO] Latest release: v2.8.1
[PASS] Latest tag follows semver: v2.8.1
[INFO] Release frequency: 1.2 per month
[INFO] All tags GPG signed
─────────────────────────────────
CQ-049: Tag Validation PASSED
Total: 3 passed, 0 failed`
  },
  {
    id: 'CQ-050', title: 'Gitignore Completeness Check',
    category: 'Repo Hygiene', layer: 'RepoManagement',
    framework: 'Git / Custom', language: 'Python',
    difficulty: 'Beginner',
    description: 'Validate .gitignore file covers all sensitive and generated files for banking repositories. Ensure secrets, credentials, database files, compiled artifacts, IDE configs, and OS-specific files are properly excluded from version control.',
    prerequisites: '.gitignore file in repository root, Banking-specific exclusion patterns, File type inventory',
    config: 'GITIGNORE_PATH=.gitignore\nREQUIRED_PATTERNS=.env,.env.local,*.key,*.pem,*.db,*.pkl,credentials.*,secrets.*,.encryption.key\nCHECK_TRACKED=true',
    code: `#!/usr/bin/env python3
"""CQ-050: Gitignore Completeness Check"""
import os, subprocess, sys

GITIGNORE = ".gitignore"
REQUIRED = [
    ".env", ".env.local", "*.key", "*.pem", "*.db",
    "*.pkl", "credentials.*", "secrets.*", ".encryption.key",
    "__pycache__/", "*.pyc", "node_modules/", ".DS_Store",
    "*.log", "*.bak", ".idea/", ".vscode/", "*.sqlite3"
]
SENSITIVE_EXTENSIONS = [".key", ".pem", ".p12", ".jks", ".env", ".db"]

def check_gitignore_exists():
    """Verify .gitignore file exists"""
    if not os.path.exists(GITIGNORE):
        print(f"[FAIL] {GITIGNORE} not found")
        sys.exit(1)
    print(f"[PASS] {GITIGNORE} exists")

def check_required_patterns():
    """Check for required exclusion patterns"""
    with open(GITIGNORE) as f:
        content = f.read()
    missing = []
    for pattern in REQUIRED:
        if pattern not in content:
            missing.append(pattern)
    if missing:
        for m in missing:
            print(f"  [FAIL] Missing pattern: {m}")
        return False
    print(f"[PASS] All {len(REQUIRED)} required patterns present")
    return True

def check_tracked_sensitive():
    """Check if any sensitive files are tracked"""
    result = subprocess.run(
        ["git", "ls-files"],
        capture_output=True, text=True, timeout=30
    )
    tracked = result.stdout.strip().split("\\n")
    violations = []
    for f in tracked:
        for ext in SENSITIVE_EXTENSIONS:
            if f.endswith(ext):
                violations.append(f)
    if violations:
        for v in violations:
            print(f"  [FAIL] Sensitive file tracked: {v}")
        return False
    print("[PASS] No sensitive files tracked")
    return True

def count_patterns():
    """Count total patterns in .gitignore"""
    with open(GITIGNORE) as f:
        lines = [l.strip() for l in f if l.strip() and not l.startswith("#")]
    print(f"[INFO] Total gitignore patterns: {len(lines)}")

if __name__ == "__main__":
    print("[TEST] Gitignore Completeness Check")
    check_gitignore_exists()
    patterns_ok = check_required_patterns()
    tracked_ok = check_tracked_sensitive()
    count_patterns()
    if patterns_ok and tracked_ok:
        print("[PASS] Gitignore configuration is complete")
    else:
        print("[FAIL] Gitignore needs updates")
        sys.exit(1)
    print("\\nCQ-050: Gitignore Check PASSED")`,
    expectedOutput: `[TEST] Gitignore Completeness Check
[PASS] .gitignore exists
[PASS] All 19 required patterns present
[PASS] No sensitive files tracked
[INFO] Total gitignore patterns: 34
[PASS] Gitignore configuration is complete
[INFO] Categories: secrets(5), compiled(4), IDE(3), OS(2), data(4)
[INFO] Last updated: 2026-02-25
─────────────────────────────────
CQ-050: Gitignore Check PASSED
Total: 3 passed, 0 failed`
  },
];

const DIFF_COLORS = { Beginner: '#2ecc71', Intermediate: '#f39c12', Advanced: '#e74c3c' };

export default function CodeQualityLab() {
  const [tab, setTab] = useState('SonarQube');
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
        <h1 style={sty.h1}>Code Quality & Repository Testing Lab</h1>
        <div style={sty.sub}>SonarQube, Static Analysis, Code Reviews, Test Quality & Repo Management — {totalAll} Scenarios</div>
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

import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12' };

const TABS = [
  { key:'HTTPErrors', label:'HTTP Errors' },
  { key:'DatabaseErrors', label:'DB Errors' },
  { key:'ApplicationErrors', label:'App Errors' },
  { key:'NetworkIntegration', label:'Network/Integration' },
  { key:'BusinessLogicErrors', label:'Business Logic' },
  { key:'ErrorRecovery', label:'Error Recovery' },
];
const DIFF = ['Beginner','Intermediate','Advanced'];
const DC = { Beginner:'#2ecc71', Intermediate:'#f39c12', Advanced:'#e74c3c' };
const TC = { HTTPErrors:'#e74c3c', DatabaseErrors:'#3498db', ApplicationErrors:'#9b59b6', NetworkIntegration:'#2ecc71', BusinessLogicErrors:'#e67e22', ErrorRecovery:'#1abc9c' };

const S = [
  {id:'ET-001',title:'4xx Client Error Validation',layer:'HTTPErrors',framework:'REST Assured',language:'Java',difficulty:'Beginner',
   description:'Validates proper handling of 4xx client errors including 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, and 422 Unprocessable Entity across banking API endpoints.',
   prerequisites:'REST Assured 5.x, Banking API running on port 8443, Test user accounts with various permission levels',
   config:'API_URL=https://api.bank.local:8443/api/v2\nTEST_USER=testclient001\nTEST_PASS=ClientP@ss123\nTIMEOUT=10',
   code:`@Test
public void testClientErrors4xx() {
    // 400 Bad Request - malformed JSON
    Response r400 = given().contentType("application/json")
        .body("{invalid_json}")
        .post("/api/v2/accounts");
    assertEquals(400, r400.statusCode());
    assertEquals("MALFORMED_REQUEST", r400.jsonPath().getString("error_code"));
    assertNotNull(r400.jsonPath().getString("correlation_id"));

    // 401 Unauthorized - no token
    Response r401 = given()
        .get("/api/v2/accounts/ACC001/balance");
    assertEquals(401, r401.statusCode());
    assertEquals("AUTHENTICATION_REQUIRED", r401.jsonPath().getString("error_code"));

    // 403 Forbidden - insufficient permissions
    String tellerToken = loginAsRole("Teller");
    Response r403 = given().header("Authorization", "Bearer " + tellerToken)
        .delete("/api/v2/admin/users/U001");
    assertEquals(403, r403.statusCode());
    assertEquals("INSUFFICIENT_PERMISSIONS", r403.jsonPath().getString("error_code"));

    // 404 Not Found - nonexistent resource
    Response r404 = given().header("Authorization", "Bearer " + tellerToken)
        .get("/api/v2/accounts/NONEXISTENT999");
    assertEquals(404, r404.statusCode());
    assertEquals("RESOURCE_NOT_FOUND", r404.jsonPath().getString("error_code"));

    // 409 Conflict - duplicate creation
    Response r409 = given().header("Authorization", "Bearer " + tellerToken)
        .contentType("application/json")
        .body("{\\"account_id\\":\\"ACC001\\",\\"type\\":\\"savings\\"}")
        .post("/api/v2/accounts");
    assertEquals(409, r409.statusCode());
    assertEquals("DUPLICATE_RESOURCE", r409.jsonPath().getString("error_code"));

    // 422 Unprocessable - validation failure
    Response r422 = given().header("Authorization", "Bearer " + tellerToken)
        .contentType("application/json")
        .body("{\\"amount\\":-500,\\"currency\\":\\"INVALID\\"}")
        .post("/api/v2/transfers");
    assertEquals(422, r422.statusCode());
    assertEquals("VALIDATION_FAILED", r422.jsonPath().getString("error_code"));
}`,
   expectedOutput:`[TEST] ET-001: 4xx Client Error Validation
[INFO] Testing against: https://api.bank.local:8443/api/v2
[PASS] 400 Bad Request: malformed JSON rejected correctly
[PASS] Error code: MALFORMED_REQUEST with correlation_id
[PASS] 401 Unauthorized: missing auth token detected
[PASS] 403 Forbidden: Teller blocked from admin delete
[PASS] 404 Not Found: nonexistent account returns RESOURCE_NOT_FOUND
[PASS] 409 Conflict: duplicate account creation blocked
[PASS] 422 Unprocessable: negative amount and invalid currency rejected
[INFO] All error responses include correlation_id and error_code
[INFO] Response times: 400=12ms, 401=8ms, 403=15ms, 404=11ms
───────────────────────────────────
ET-001: Client Errors 4xx — 7 passed, 0 failed`},

  {id:'ET-002',title:'5xx Server Error Handling',layer:'HTTPErrors',framework:'pytest / requests',language:'Python',difficulty:'Intermediate',
   description:'Tests server-side error handling for 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, and 504 Gateway Timeout with proper error envelope responses and retry headers.',
   prerequisites:'Banking API with chaos engineering endpoints enabled, Upstream service mock, Load balancer configured',
   config:'API_URL=https://api.bank.local:8443/api/v2\nCHAOS_API=https://chaos.bank.local:9090\nLB_URL=https://lb.bank.local:443\nRETRY_AFTER=30',
   code:`import requests
import unittest

class TestServerErrors5xx(unittest.TestCase):
    BASE = "https://api.bank.local:8443/api/v2"
    CHAOS = "https://chaos.bank.local:9090"

    def test_500_internal_server_error(self):
        """Trigger and validate 500 ISE response"""
        requests.post(f"{self.CHAOS}/fault/inject",
            json={"target": "/accounts", "fault": "exception"}, timeout=10)
        resp = requests.get(f"{self.BASE}/accounts/ACC001", timeout=10)
        self.assertEqual(500, resp.status_code)
        body = resp.json()
        self.assertEqual("INTERNAL_ERROR", body["error_code"])
        self.assertIn("correlation_id", body)
        self.assertNotIn("stack_trace", body)
        requests.post(f"{self.CHAOS}/fault/clear", timeout=10)

    def test_502_bad_gateway(self):
        """Simulate upstream service crash"""
        requests.post(f"{self.CHAOS}/fault/inject",
            json={"target": "upstream", "fault": "crash"}, timeout=10)
        resp = requests.get(f"{self.BASE}/transfers/TX001", timeout=10)
        self.assertEqual(502, resp.status_code)
        self.assertEqual("BAD_GATEWAY", resp.json()["error_code"])
        requests.post(f"{self.CHAOS}/fault/clear", timeout=10)

    def test_503_service_unavailable(self):
        """Test maintenance mode response with Retry-After"""
        requests.post(f"{self.CHAOS}/maintenance/enable", timeout=10)
        resp = requests.get(f"{self.BASE}/accounts", timeout=10)
        self.assertEqual(503, resp.status_code)
        self.assertEqual("SERVICE_UNAVAILABLE", resp.json()["error_code"])
        self.assertIn("Retry-After", resp.headers)
        self.assertEqual("30", resp.headers["Retry-After"])
        requests.post(f"{self.CHAOS}/maintenance/disable", timeout=10)

    def test_504_gateway_timeout(self):
        """Simulate upstream timeout"""
        requests.post(f"{self.CHAOS}/fault/inject",
            json={"target": "upstream", "fault": "delay", "ms": 35000},
            timeout=10)
        resp = requests.get(f"{self.BASE}/reports/generate",
            timeout=40)
        self.assertEqual(504, resp.status_code)
        self.assertEqual("GATEWAY_TIMEOUT", resp.json()["error_code"])
        requests.post(f"{self.CHAOS}/fault/clear", timeout=10)`,
   expectedOutput:`[TEST] ET-002: 5xx Server Error Handling
[INFO] Chaos engineering endpoint: https://chaos.bank.local:9090
[PASS] 500 ISE: error_code=INTERNAL_ERROR, no stack trace leaked
[PASS] Correlation ID present in 500 response
[PASS] 502 Bad Gateway: upstream crash detected correctly
[PASS] 503 Service Unavailable: maintenance mode active
[PASS] Retry-After header present: 30 seconds
[PASS] 504 Gateway Timeout: upstream delay triggered timeout
[INFO] Fault injection cleared after each test
[INFO] No sensitive data leaked in any error response
───────────────────────────────────
ET-002: Server Errors 5xx — 6 passed, 0 failed`},

  {id:'ET-003',title:'Database Connection Failure Handling',layer:'DatabaseErrors',framework:'JUnit / JDBC',language:'Java',difficulty:'Intermediate',
   description:'Tests application resilience when database connections fail, including connection pool exhaustion, connection timeout, and automatic reconnection after transient failures.',
   prerequisites:'PostgreSQL database, Connection pool (HikariCP), Chaos proxy (ToxiProxy) for fault injection',
   config:'DB_URL=jdbc:postgresql://db.bank.local:5432/banking\nDB_USER=app_user\nDB_PASS=DbP@ss123\nPOOL_SIZE=10\nCONN_TIMEOUT=5000\nTOXI_URL=http://toxi.bank.local:8474',
   code:`@Test
public void testDatabaseConnectionFailures() {
    HikariDataSource ds = createPool("jdbc:postgresql://db.bank.local:5432/banking",
        10, 5000);

    // Test 1: Successful connection baseline
    try (Connection conn = ds.getConnection()) {
        assertFalse(conn.isClosed());
        ResultSet rs = conn.createStatement().executeQuery("SELECT 1");
        assertTrue(rs.next());
        assertEquals(1, rs.getInt(1));
    }

    // Test 2: Connection timeout via ToxiProxy
    enableToxic("db_timeout", "timeout", 15000);
    assertThrows(SQLTimeoutException.class, () -> {
        try (Connection conn = ds.getConnection()) {
            conn.createStatement().executeQuery("SELECT 1");
        }
    });
    disableToxic("db_timeout");

    // Test 3: Pool exhaustion
    List<Connection> held = new ArrayList<>();
    for (int i = 0; i < 10; i++) {
        held.add(ds.getConnection());
    }
    assertThrows(SQLTimeoutException.class, () -> {
        ds.getConnection(); // Pool exhausted
    });
    held.forEach(c -> { try { c.close(); } catch (Exception e) {} });

    // Test 4: Auto-reconnect after transient failure
    enableToxic("db_reset", "reset_peer", 0);
    Thread.sleep(2000);
    disableToxic("db_reset");
    Thread.sleep(3000); // Wait for pool recovery
    try (Connection conn = ds.getConnection()) {
        assertFalse(conn.isClosed());
        ResultSet rs = conn.createStatement().executeQuery("SELECT 1");
        assertTrue(rs.next());
    }
}`,
   expectedOutput:`[TEST] ET-003: Database Connection Failure Handling
[INFO] Pool: HikariCP, size=10, timeout=5000ms
[PASS] Baseline: connection successful, SELECT 1 OK
[PASS] Connection timeout: SQLTimeoutException after 5000ms
[INFO] ToxiProxy fault: timeout=15000ms injected
[PASS] Pool exhaustion: 11th connection correctly rejected
[INFO] All 10 pool slots occupied, new request timed out
[PASS] Auto-reconnect: pool recovered after transient reset
[INFO] Recovery time: 2.8 seconds after fault cleared
[PASS] Post-recovery query: SELECT 1 returned successfully
───────────────────────────────────
ET-003: DB Connection Failures — 5 passed, 0 failed`},

  {id:'ET-004',title:'Database Deadlock Detection & Resolution',layer:'DatabaseErrors',framework:'pytest / psycopg2',language:'Python',difficulty:'Advanced',
   description:'Tests database deadlock detection between concurrent transactions, verifies automatic deadlock resolution by the database engine, and validates application-level retry logic after deadlock errors.',
   prerequisites:'PostgreSQL 15+, psycopg2 driver, Test accounts table with row-level locking, Concurrent transaction support',
   config:'DB_HOST=db.bank.local\nDB_PORT=5432\nDB_NAME=banking\nDB_USER=app_user\nDB_PASS=DbP@ss123\nDEADLOCK_TIMEOUT=1000\nRETRY_ATTEMPTS=3',
   code:`import psycopg2
import threading
import unittest
import time

class TestDeadlockDetection(unittest.TestCase):
    DSN = "host=db.bank.local dbname=banking user=app_user password=DbP@ss123"

    def test_deadlock_detection(self):
        """Two transactions lock rows in opposite order"""
        errors = []
        barrier = threading.Barrier(2, timeout=10)

        def txn_a():
            conn = psycopg2.connect(self.DSN)
            conn.autocommit = False
            cur = conn.cursor()
            try:
                cur.execute("UPDATE accounts SET balance=balance-100 WHERE id='A001'")
                barrier.wait()
                cur.execute("UPDATE accounts SET balance=balance+100 WHERE id='A002'")
                conn.commit()
            except psycopg2.errors.DeadlockDetected as e:
                errors.append(("txn_a", str(e)))
                conn.rollback()
            finally:
                conn.close()

        def txn_b():
            conn = psycopg2.connect(self.DSN)
            conn.autocommit = False
            cur = conn.cursor()
            try:
                cur.execute("UPDATE accounts SET balance=balance-200 WHERE id='A002'")
                barrier.wait()
                cur.execute("UPDATE accounts SET balance=balance+200 WHERE id='A001'")
                conn.commit()
            except psycopg2.errors.DeadlockDetected as e:
                errors.append(("txn_b", str(e)))
                conn.rollback()
            finally:
                conn.close()

        t1 = threading.Thread(target=txn_a)
        t2 = threading.Thread(target=txn_b)
        t1.start(); t2.start()
        t1.join(timeout=15); t2.join(timeout=15)

        self.assertEqual(1, len(errors), "Exactly one transaction should be aborted")
        self.assertIn("deadlock detected", errors[0][1].lower())

    def test_retry_after_deadlock(self):
        """Application retries successfully after deadlock"""
        attempts = 0
        for attempt in range(3):
            attempts += 1
            try:
                conn = psycopg2.connect(self.DSN)
                cur = conn.cursor()
                cur.execute("UPDATE accounts SET balance=balance+50 WHERE id='A001'")
                conn.commit()
                conn.close()
                break
            except psycopg2.errors.DeadlockDetected:
                time.sleep(0.5 * (2 ** attempt))
        self.assertLessEqual(attempts, 3)`,
   expectedOutput:`[TEST] ET-004: Database Deadlock Detection & Resolution
[INFO] DSN: host=db.bank.local dbname=banking
[INFO] Transaction A: UPDATE A001 then A002
[INFO] Transaction B: UPDATE A002 then A001
[PASS] Deadlock detected: one transaction aborted by PostgreSQL
[INFO] Victim: txn_b — deadlock detected after 1.2s
[PASS] Non-victim transaction committed successfully
[PASS] Exactly 1 of 2 transactions aborted (as expected)
[INFO] Testing retry logic with exponential backoff
[PASS] Retry after deadlock: succeeded on attempt 1
[INFO] Backoff delays: 0.5s, 1.0s, 2.0s (if needed)
───────────────────────────────────
ET-004: Deadlock Detection — 4 passed, 0 failed`},

  {id:'ET-005',title:'Null Pointer & Null Safety Handling',layer:'ApplicationErrors',framework:'JUnit 5',language:'Java',difficulty:'Beginner',
   description:'Validates null safety handling across service layer methods including null input parameters, null database results, null nested objects, and proper NullPointerException prevention with Optional patterns.',
   prerequisites:'JUnit 5, Banking service layer, Account and Transaction domain objects',
   config:'APP_URL=https://api.bank.local:8443\nNULL_SAFETY_MODE=strict\nDEFAULT_CURRENCY=INR\nLOG_NULL_ACCESS=true',
   code:`@Test
public void testNullSafetyHandling() {
    AccountService service = new AccountService(mockRepo);

    // Test 1: Null account ID input
    assertThrows(IllegalArgumentException.class,
        () -> service.getAccount(null));

    // Test 2: Account not found returns Optional.empty
    when(mockRepo.findById("UNKNOWN")).thenReturn(Optional.empty());
    Optional<Account> result = service.findAccount("UNKNOWN");
    assertTrue(result.isEmpty());

    // Test 3: Null nested object - address on account
    Account acc = new Account("ACC001", "John Doe", null);
    String city = service.getAccountCity(acc);
    assertEquals("N/A", city); // Graceful default, no NPE

    // Test 4: Null collection handling
    when(mockRepo.getTransactions("ACC001")).thenReturn(null);
    List<Transaction> txns = service.getTransactions("ACC001");
    assertNotNull(txns);
    assertTrue(txns.isEmpty()); // Returns empty list, not null

    // Test 5: Null field in JSON response
    Response resp = given()
        .get("/api/v2/accounts/ACC_PARTIAL");
    assertEquals(200, resp.statusCode());
    assertNull(resp.jsonPath().get("email")); // Field present but null
    assertNotNull(resp.jsonPath().getString("account_id"));

    // Test 6: Null-safe chain with Optional
    BigDecimal balance = service.findAccount("ACC001")
        .map(Account::getBalance)
        .orElse(BigDecimal.ZERO);
    assertNotNull(balance);
}`,
   expectedOutput:`[TEST] ET-005: Null Pointer & Null Safety Handling
[INFO] Null safety mode: strict
[PASS] Null account ID: IllegalArgumentException thrown
[PASS] Unknown account: Optional.empty returned (no NPE)
[PASS] Null nested address: default "N/A" returned
[PASS] Null collection: empty list returned instead of null
[PASS] Null JSON field: email=null, account_id present
[PASS] Optional chain: zero balance default on missing account
[INFO] All null paths handled gracefully without NPE
[INFO] No NullPointerException thrown in any test case
───────────────────────────────────
ET-005: Null Safety — 6 passed, 0 failed`},

  {id:'ET-006',title:'Memory Leak Detection Under Load',layer:'ApplicationErrors',framework:'Shell / JMX / curl',language:'Shell',difficulty:'Advanced',
   description:'Detects memory leaks by monitoring JVM heap usage during sustained load, checking for monotonically increasing memory consumption, unclosed connections, and GC pressure that indicates object retention issues.',
   prerequisites:'Java application with JMX enabled, jstat/jcmd tools, curl for load generation, bc for arithmetic',
   config:'APP_URL=https://api.bank.local:8443\nJMX_PORT=9010\nHEAP_MAX=512m\nLEAK_THRESHOLD_MB=50\nLOAD_DURATION=60\nREQUESTS_PER_SEC=50',
   code:`#!/bin/bash
set -euo pipefail

APP_HOST="api.bank.local"
APP_PORT=8443
JMX_PORT=9010
LEAK_THRESHOLD_MB=50
DURATION=60
RPS=50
PID=\$(jcmd | grep "banking-app" | awk '{print \$1}')

echo "[INFO] Capturing baseline heap usage..."
BASELINE=\$(jstat -gc "\$PID" | tail -1 | awk '{printf "%.0f", (\$3+\$4+\$6+\$8)/1024}')
echo "[INFO] Baseline heap: \${BASELINE}MB"

echo "[INFO] Generating sustained load: \${RPS} req/s for \${DURATION}s..."
for i in \$(seq 1 \$((DURATION * RPS))); do
    curl -s -o /dev/null "https://\${APP_HOST}:\${APP_PORT}/api/v2/accounts" &
    if (( i % RPS == 0 )); then sleep 1; fi
done
wait

echo "[INFO] Capturing post-load heap usage..."
POSTLOAD=\$(jstat -gc "\$PID" | tail -1 | awk '{printf "%.0f", (\$3+\$4+\$6+\$8)/1024}')
echo "[INFO] Post-load heap: \${POSTLOAD}MB"

jcmd "\$PID" GC.run
sleep 5
POSTGC=\$(jstat -gc "\$PID" | tail -1 | awk '{printf "%.0f", (\$3+\$4+\$6+\$8)/1024}')
echo "[INFO] Post-GC heap: \${POSTGC}MB"

DELTA=\$((POSTGC - BASELINE))
echo "[INFO] Heap delta after GC: \${DELTA}MB (threshold: \${LEAK_THRESHOLD_MB}MB)"

if [ "\$DELTA" -gt "\$LEAK_THRESHOLD_MB" ]; then
    echo "[FAIL] Potential memory leak: \${DELTA}MB retained after GC"
    jcmd "\$PID" GC.heap_dump /tmp/leak_dump.hprof
    echo "[INFO] Heap dump saved: /tmp/leak_dump.hprof"
    exit 1
else
    echo "[PASS] No memory leak: \${DELTA}MB within threshold"
fi

OPEN_CONNS=\$(jcmd "\$PID" VM.native_memory | grep -c "Thread" || echo 0)
echo "[INFO] Open threads post-load: \$OPEN_CONNS"`,
   expectedOutput:`[TEST] ET-006: Memory Leak Detection Under Load
[INFO] PID: 24601, Application: banking-app
[INFO] Baseline heap: 128MB
[INFO] Generating sustained load: 50 req/s for 60s...
[INFO] Total requests sent: 3000
[INFO] Post-load heap: 245MB
[INFO] Running forced GC...
[INFO] Post-GC heap: 142MB
[PASS] Heap delta after GC: 14MB (threshold: 50MB)
[PASS] No memory leak detected
[INFO] Open threads post-load: 22 (within pool limits)
[INFO] GC cycles during test: 8 minor, 1 major
───────────────────────────────────
ET-006: Memory Leak Detection — 2 passed, 0 failed`},

  {id:'ET-007',title:'DNS Resolution Failure Handling',layer:'NetworkIntegration',framework:'pytest / requests',language:'Python',difficulty:'Intermediate',
   description:'Tests application behavior when DNS resolution fails for upstream services, including proper timeout handling, fallback to cached DNS entries, and meaningful error messages returned to clients.',
   prerequisites:'Banking API with external service dependencies, DNS mock/override capability, requests library with timeout support',
   config:'API_URL=https://api.bank.local:8443/api/v2\nEXTERNAL_FX_SERVICE=https://fx.external-provider.com\nDNS_TIMEOUT=5\nDNS_CACHE_TTL=300\nFALLBACK_ENABLED=true',
   code:`import requests
import unittest
from unittest.mock import patch
import socket

class TestDNSFailureHandling(unittest.TestCase):
    BASE = "https://api.bank.local:8443/api/v2"

    def test_dns_resolution_failure(self):
        """External service DNS failure returns proper error"""
        with patch("socket.getaddrinfo", side_effect=socket.gaierror(
                "[Errno -2] Name or service not known")):
            resp = requests.get(
                f"{self.BASE}/forex/rates?pair=USD_INR", timeout=10)
        self.assertEqual(502, resp.status_code)
        body = resp.json()
        self.assertEqual("UPSTREAM_DNS_FAILURE", body["error_code"])
        self.assertIn("correlation_id", body)
        self.assertNotIn("fx.external-provider.com", body.get("detail", ""))

    def test_dns_timeout_handling(self):
        """DNS timeout triggers circuit breaker"""
        with patch("socket.getaddrinfo",
                side_effect=socket.timeout("DNS resolution timed out")):
            resp = requests.get(
                f"{self.BASE}/forex/rates?pair=EUR_INR", timeout=15)
        self.assertEqual(504, resp.status_code)
        self.assertEqual("DNS_TIMEOUT", resp.json()["error_code"])

    def test_dns_cached_fallback(self):
        """Cached DNS entry used when resolution fails"""
        resp1 = requests.get(
            f"{self.BASE}/forex/rates?pair=GBP_INR", timeout=10)
        self.assertEqual(200, resp1.status_code)
        cached_rate = resp1.json()["rate"]

        with patch("socket.getaddrinfo", side_effect=socket.gaierror(
                "Temporary DNS failure")):
            resp2 = requests.get(
                f"{self.BASE}/forex/rates?pair=GBP_INR", timeout=10)
        self.assertEqual(200, resp2.status_code)
        self.assertEqual(cached_rate, resp2.json()["rate"])
        self.assertTrue(resp2.json().get("cached", False))

    def test_partial_dns_failure(self):
        """Some services fail DNS while others work"""
        resp = requests.get(
            f"{self.BASE}/dashboard/health", timeout=10)
        self.assertEqual(207, resp.status_code)
        services = resp.json()["services"]
        self.assertTrue(any(s["status"] == "degraded" for s in services))`,
   expectedOutput:`[TEST] ET-007: DNS Resolution Failure Handling
[INFO] Testing DNS failure scenarios against banking API
[PASS] DNS failure: 502 returned with UPSTREAM_DNS_FAILURE
[PASS] No internal hostname leaked in error response
[PASS] Correlation ID present in DNS error response
[PASS] DNS timeout: 504 returned with DNS_TIMEOUT error
[PASS] Cached DNS fallback: served cached rate for GBP_INR
[INFO] Cache TTL: 300 seconds, cached=true in response
[PASS] Partial DNS failure: 207 Multi-Status with degraded services
[INFO] Healthy: 3 services, Degraded: 1 service
───────────────────────────────────
ET-007: DNS Failure Handling — 6 passed, 0 failed`},

  {id:'ET-008',title:'SSL/TLS Certificate Error Handling',layer:'NetworkIntegration',framework:'JUnit / HttpClient',language:'Java',difficulty:'Advanced',
   description:'Tests SSL/TLS error scenarios including expired certificates, self-signed certificates, hostname mismatch, revoked certificates, and weak cipher suite rejection to ensure secure communication enforcement.',
   prerequisites:'Java HttpClient, Test certificates (expired, self-signed, mismatched CN), OCSP responder mock, TLS 1.2+ enforcement',
   config:'APP_URL=https://api.bank.local:8443\nCERT_DIR=/certs/test\nOCSP_URL=http://ocsp.bank.local:8080\nMIN_TLS_VERSION=TLSv1.2\nALLOWED_CIPHERS=TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256',
   code:`@Test
public void testSSLCertificateErrors() throws Exception {
    // Test 1: Expired certificate rejection
    SSLContext expiredCtx = loadSSLContext("/certs/test/expired.jks", "changeit");
    HttpClient expiredClient = HttpClient.newBuilder()
        .sslContext(expiredCtx).connectTimeout(Duration.ofSeconds(5)).build();
    HttpRequest req = HttpRequest.newBuilder()
        .uri(URI.create("https://api.bank.local:8443/api/v2/health")).build();
    assertThrows(SSLHandshakeException.class,
        () -> expiredClient.send(req, BodyHandlers.ofString()));

    // Test 2: Self-signed certificate rejection
    SSLContext selfSignedCtx = loadSSLContext("/certs/test/selfsigned.jks", "changeit");
    HttpClient selfClient = HttpClient.newBuilder()
        .sslContext(selfSignedCtx).connectTimeout(Duration.ofSeconds(5)).build();
    assertThrows(SSLHandshakeException.class,
        () -> selfClient.send(req, BodyHandlers.ofString()));

    // Test 3: Hostname mismatch rejection
    HttpRequest wrongHost = HttpRequest.newBuilder()
        .uri(URI.create("https://wrong-host.bank.local:8443/api/v2/health")).build();
    SSLContext validCtx = loadSSLContext("/certs/test/valid.jks", "changeit");
    HttpClient validClient = HttpClient.newBuilder()
        .sslContext(validCtx).connectTimeout(Duration.ofSeconds(5)).build();
    assertThrows(SSLHandshakeException.class,
        () -> validClient.send(wrongHost, BodyHandlers.ofString()));

    // Test 4: Valid certificate succeeds
    HttpResponse<String> resp = validClient.send(req, BodyHandlers.ofString());
    assertEquals(200, resp.statusCode());
    assertEquals("healthy", new JSONObject(resp.body()).getString("status"));

    // Test 5: TLS 1.1 rejected
    SSLContext tls11 = SSLContext.getInstance("TLSv1.1");
    tls11.init(null, null, null);
    HttpClient oldClient = HttpClient.newBuilder()
        .sslContext(tls11).connectTimeout(Duration.ofSeconds(5)).build();
    assertThrows(SSLHandshakeException.class,
        () -> oldClient.send(req, BodyHandlers.ofString()));
}`,
   expectedOutput:`[TEST] ET-008: SSL/TLS Certificate Error Handling
[INFO] Testing TLS error scenarios on api.bank.local:8443
[PASS] Expired certificate: SSLHandshakeException thrown
[INFO] Cert expired: 2025-06-15T00:00:00Z (past expiry)
[PASS] Self-signed certificate: SSLHandshakeException thrown
[PASS] Hostname mismatch: SSLHandshakeException thrown
[INFO] Expected CN: api.bank.local, Actual: wrong-host.bank.local
[PASS] Valid certificate: 200 OK, status=healthy
[PASS] TLS 1.1 rejected: only TLSv1.2+ accepted
[INFO] Negotiated protocol: TLSv1.3
[INFO] Cipher: TLS_AES_256_GCM_SHA384
───────────────────────────────────
ET-008: SSL/TLS Errors — 5 passed, 0 failed`},

  {id:'ET-009',title:'Insufficient Funds Transaction Rejection',layer:'BusinessLogicErrors',framework:'REST Assured',language:'Java',difficulty:'Beginner',
   description:'Validates business rule enforcement for insufficient funds scenarios including balance checks, overdraft limit validation, pending transaction consideration, and proper hold amount deduction before transfer approval.',
   prerequisites:'REST Assured 5.x, Banking API with transaction endpoints, Test accounts with known balances, Hold management API',
   config:'API_URL=https://api.bank.local:8443/api/v2\nTEST_ACCOUNT=ACC_TEST_001\nACCOUNT_BALANCE=5000.00\nOVERDRAFT_LIMIT=1000.00\nPENDING_HOLD=500.00',
   code:`@Test
public void testInsufficientFundsRejection() {
    String token = loginAsRole("Teller");

    // Setup: Verify account balance
    Response balResp = given().header("Authorization", "Bearer " + token)
        .get("/api/v2/accounts/ACC_TEST_001/balance");
    assertEquals(200, balResp.statusCode());
    double available = balResp.jsonPath().getDouble("available_balance");
    assertEquals(4500.00, available, 0.01); // 5000 - 500 hold

    // Test 1: Transfer exceeding available balance
    Response r1 = given().header("Authorization", "Bearer " + token)
        .contentType("application/json")
        .body("{\\"from\\":\\"ACC_TEST_001\\",\\"to\\":\\"ACC_002\\"," +
              "\\"amount\\":5000.00,\\"currency\\":\\"INR\\"}")
        .post("/api/v2/transfers");
    assertEquals(422, r1.statusCode());
    assertEquals("INSUFFICIENT_FUNDS", r1.jsonPath().getString("error_code"));
    assertEquals(4500.00, r1.jsonPath().getDouble("available_balance"), 0.01);

    // Test 2: Transfer exceeding overdraft limit
    Response r2 = given().header("Authorization", "Bearer " + token)
        .contentType("application/json")
        .body("{\\"from\\":\\"ACC_TEST_001\\",\\"to\\":\\"ACC_002\\"," +
              "\\"amount\\":5800.00,\\"currency\\":\\"INR\\"}")
        .post("/api/v2/transfers");
    assertEquals(422, r2.statusCode());
    assertEquals("OVERDRAFT_LIMIT_EXCEEDED", r2.jsonPath().getString("error_code"));

    // Test 3: Transfer within available balance succeeds
    Response r3 = given().header("Authorization", "Bearer " + token)
        .contentType("application/json")
        .body("{\\"from\\":\\"ACC_TEST_001\\",\\"to\\":\\"ACC_002\\"," +
              "\\"amount\\":1000.00,\\"currency\\":\\"INR\\"}")
        .post("/api/v2/transfers");
    assertEquals(201, r3.statusCode());
    assertEquals("COMPLETED", r3.jsonPath().getString("status"));

    // Test 4: Verify updated balance
    Response r4 = given().header("Authorization", "Bearer " + token)
        .get("/api/v2/accounts/ACC_TEST_001/balance");
    assertEquals(3500.00, r4.jsonPath().getDouble("available_balance"), 0.01);
}`,
   expectedOutput:`[TEST] ET-009: Insufficient Funds Transaction Rejection
[INFO] Account ACC_TEST_001: balance=5000.00, hold=500.00, available=4500.00
[PASS] Transfer 5000.00 rejected: INSUFFICIENT_FUNDS
[INFO] Requested: 5000.00, Available: 4500.00, Shortfall: 500.00
[PASS] Transfer 5800.00 rejected: OVERDRAFT_LIMIT_EXCEEDED
[INFO] Overdraft limit: 1000.00, Would need: 1300.00 overdraft
[PASS] Transfer 1000.00 accepted: COMPLETED
[PASS] Balance updated: 4500.00 -> 3500.00
[INFO] Transaction ID: TXN_20260227_001
[INFO] All business rules enforced correctly
───────────────────────────────────
ET-009: Insufficient Funds — 4 passed, 0 failed`},

  {id:'ET-010',title:'Duplicate Transaction Prevention',layer:'BusinessLogicErrors',framework:'pytest / requests',language:'Python',difficulty:'Intermediate',
   description:'Tests idempotency and duplicate transaction detection using idempotency keys, transaction fingerprinting, and time-window deduplication to prevent double-charging customers in payment processing.',
   prerequisites:'Banking API with idempotency support, Redis for idempotency key storage, Transaction deduplication service',
   config:'API_URL=https://api.bank.local:8443/api/v2\nIDEMPOTENCY_TTL=86400\nDEDUP_WINDOW_SEC=300\nREDIS_URL=redis://redis.bank.local:6379',
   code:`import requests
import unittest
import uuid

class TestDuplicateTransactionPrevention(unittest.TestCase):
    BASE = "https://api.bank.local:8443/api/v2"
    TOKEN = "Bearer test_token_123"

    def test_idempotency_key_dedup(self):
        """Same idempotency key returns cached response"""
        idem_key = str(uuid.uuid4())
        headers = {"Authorization": self.TOKEN,
                   "X-Idempotency-Key": idem_key,
                   "Content-Type": "application/json"}
        payload = {"from": "ACC001", "to": "ACC002",
                   "amount": 1500.00, "currency": "INR"}

        r1 = requests.post(f"{self.BASE}/transfers",
            json=payload, headers=headers, timeout=10)
        self.assertEqual(201, r1.status_code)
        txn_id_1 = r1.json()["transaction_id"]

        r2 = requests.post(f"{self.BASE}/transfers",
            json=payload, headers=headers, timeout=10)
        self.assertEqual(201, r2.status_code)
        txn_id_2 = r2.json()["transaction_id"]
        self.assertEqual(txn_id_1, txn_id_2)
        self.assertTrue(r2.json().get("idempotent_replay", False))

    def test_fingerprint_dedup(self):
        """Same amount/account within time window flagged"""
        headers = {"Authorization": self.TOKEN,
                   "Content-Type": "application/json"}
        payload = {"from": "ACC003", "to": "ACC004",
                   "amount": 2500.00, "currency": "INR"}

        r1 = requests.post(f"{self.BASE}/transfers",
            json=payload, headers=headers, timeout=10)
        self.assertEqual(201, r1.status_code)

        r2 = requests.post(f"{self.BASE}/transfers",
            json=payload, headers=headers, timeout=10)
        self.assertEqual(409, r2.status_code)
        self.assertEqual("DUPLICATE_TRANSACTION_SUSPECTED",
            r2.json()["error_code"])
        self.assertIn("confirmation_token", r2.json())

    def test_force_duplicate_with_confirmation(self):
        """Explicit confirmation overrides duplicate check"""
        headers = {"Authorization": self.TOKEN,
                   "Content-Type": "application/json"}
        payload = {"from": "ACC003", "to": "ACC004",
                   "amount": 2500.00, "currency": "INR",
                   "force_confirm": "CONFIRMED_DUPLICATE"}

        resp = requests.post(f"{self.BASE}/transfers",
            json=payload, headers=headers, timeout=10)
        self.assertEqual(201, resp.status_code)
        self.assertTrue(resp.json().get("duplicate_override", False))`,
   expectedOutput:`[TEST] ET-010: Duplicate Transaction Prevention
[INFO] Idempotency TTL: 86400s, Dedup window: 300s
[PASS] First transfer: 201 Created, TXN_ID=TXN_A1B2C3
[PASS] Replay with same idempotency key: same TXN_ID returned
[INFO] idempotent_replay=true, no double charge
[PASS] Fingerprint dedup: 409 DUPLICATE_TRANSACTION_SUSPECTED
[INFO] Matching fingerprint: ACC003->ACC004, 2500.00 INR within 300s
[PASS] Confirmation token provided for user override
[PASS] Force duplicate with confirmation: 201 Created
[INFO] duplicate_override=true, audit trail recorded
───────────────────────────────────
ET-010: Duplicate Prevention — 5 passed, 0 failed`},

  {id:'ET-011',title:'Circuit Breaker Pattern Validation',layer:'ErrorRecovery',framework:'JUnit / Resilience4j',language:'Java',difficulty:'Advanced',
   description:'Validates circuit breaker state transitions (CLOSED -> OPEN -> HALF_OPEN -> CLOSED) for external service calls, including failure threshold, wait duration, and successful recovery after downstream service restoration.',
   prerequisites:'Resilience4j library, External payment gateway mock, Metrics endpoint for circuit breaker state, WireMock for fault simulation',
   config:'PAYMENT_GW=https://pay.gateway.local:8443\nCB_FAILURE_THRESHOLD=50\nCB_WAIT_DURATION_SEC=10\nCB_RING_BUFFER_SIZE=10\nCB_HALF_OPEN_CALLS=3\nMETRICS_URL=https://api.bank.local:8443/actuator/circuitbreakers',
   code:`@Test
public void testCircuitBreakerStateTransitions() {
    // Phase 1: CLOSED state - normal operation
    Response r1 = given().header("Authorization", "Bearer " + token)
        .contentType("application/json")
        .body("{\\"amount\\":100,\\"gateway\\":\\"VISA\\"}")
        .post("/api/v2/payments/process");
    assertEquals(200, r1.statusCode());

    String cbState = getCBState("paymentGateway");
    assertEquals("CLOSED", cbState);

    // Phase 2: Inject failures to trigger OPEN state
    enableGatewayFault("500_error");
    for (int i = 0; i < 6; i++) {
        given().header("Authorization", "Bearer " + token)
            .contentType("application/json")
            .body("{\\"amount\\":100,\\"gateway\\":\\"VISA\\"}")
            .post("/api/v2/payments/process");
    }

    cbState = getCBState("paymentGateway");
    assertEquals("OPEN", cbState);

    // Phase 3: OPEN state rejects immediately (no downstream call)
    Response r2 = given().header("Authorization", "Bearer " + token)
        .contentType("application/json")
        .body("{\\"amount\\":100,\\"gateway\\":\\"VISA\\"}")
        .post("/api/v2/payments/process");
    assertEquals(503, r2.statusCode());
    assertEquals("CIRCUIT_OPEN", r2.jsonPath().getString("error_code"));
    assertTrue(r2.time() < 100); // Fast fail, no downstream wait

    // Phase 4: Wait for HALF_OPEN transition
    disableGatewayFault();
    Thread.sleep(11000); // Wait > CB_WAIT_DURATION_SEC

    cbState = getCBState("paymentGateway");
    assertEquals("HALF_OPEN", cbState);

    // Phase 5: Successful calls in HALF_OPEN -> CLOSED
    for (int i = 0; i < 3; i++) {
        Response r3 = given().header("Authorization", "Bearer " + token)
            .contentType("application/json")
            .body("{\\"amount\\":100,\\"gateway\\":\\"VISA\\"}")
            .post("/api/v2/payments/process");
        assertEquals(200, r3.statusCode());
    }

    cbState = getCBState("paymentGateway");
    assertEquals("CLOSED", cbState);
}`,
   expectedOutput:`[TEST] ET-011: Circuit Breaker Pattern Validation
[INFO] Circuit breaker: paymentGateway, threshold=50%, buffer=10
[PASS] Phase 1: CLOSED state, payment processed successfully
[INFO] Injecting 500 errors on payment gateway...
[PASS] Phase 2: 6 failures triggered OPEN state (60% > 50%)
[PASS] Phase 3: OPEN state returns 503 CIRCUIT_OPEN immediately
[INFO] Fast-fail response time: 12ms (no downstream call)
[INFO] Waiting 11 seconds for HALF_OPEN transition...
[PASS] Phase 4: State transitioned to HALF_OPEN after wait
[PASS] Phase 5: 3 successful calls in HALF_OPEN restored CLOSED
[INFO] State transitions: CLOSED -> OPEN -> HALF_OPEN -> CLOSED
[INFO] Total recovery time: 11.3 seconds
───────────────────────────────────
ET-011: Circuit Breaker — 5 passed, 0 failed`},

  {id:'ET-012',title:'Graceful Degradation Under Partial Failure',layer:'ErrorRecovery',framework:'pytest / requests',language:'Python',difficulty:'Intermediate',
   description:'Tests graceful degradation when some backend services are unavailable, ensuring the application returns partial data with degraded status indicators rather than complete failure, maintaining core banking operations.',
   prerequisites:'Banking API with multiple microservices, Service health endpoints, Feature flag service, Fallback configuration',
   config:'API_URL=https://api.bank.local:8443/api/v2\nSERVICES=accounts,transfers,forex,notifications,analytics\nDEGRADATION_MODE=partial\nFALLBACK_CACHE_TTL=600',
   code:`import requests
import unittest

class TestGracefulDegradation(unittest.TestCase):
    BASE = "https://api.bank.local:8443/api/v2"
    CHAOS = "https://chaos.bank.local:9090"
    TOKEN = "Bearer admin_token_123"

    def test_dashboard_with_partial_services(self):
        """Dashboard loads with degraded non-critical services"""
        requests.post(f"{self.CHAOS}/service/analytics/disable",
            timeout=10)
        requests.post(f"{self.CHAOS}/service/notifications/disable",
            timeout=10)

        resp = requests.get(f"{self.BASE}/dashboard",
            headers={"Authorization": self.TOKEN}, timeout=15)
        self.assertEqual(200, resp.status_code)
        data = resp.json()

        self.assertIn("accounts", data)
        self.assertIn("recent_transfers", data)
        self.assertIsNone(data.get("analytics"))
        self.assertEqual("degraded", data["service_status"])
        self.assertIn("analytics", data["unavailable_services"])
        self.assertIn("notifications", data["unavailable_services"])

        requests.post(f"{self.CHAOS}/service/analytics/enable", timeout=10)
        requests.post(f"{self.CHAOS}/service/notifications/enable",
            timeout=10)

    def test_cached_forex_on_service_failure(self):
        """Forex rates served from cache when live service fails"""
        r1 = requests.get(f"{self.BASE}/forex/rates",
            headers={"Authorization": self.TOKEN}, timeout=10)
        self.assertEqual(200, r1.status_code)
        live_rates = r1.json()["rates"]

        requests.post(f"{self.CHAOS}/service/forex/disable", timeout=10)
        r2 = requests.get(f"{self.BASE}/forex/rates",
            headers={"Authorization": self.TOKEN}, timeout=10)
        self.assertEqual(200, r2.status_code)
        self.assertTrue(r2.json()["cached"])
        self.assertIsNotNone(r2.json()["cache_age_seconds"])
        self.assertEqual(live_rates, r2.json()["rates"])
        requests.post(f"{self.CHAOS}/service/forex/enable", timeout=10)

    def test_critical_service_failure_blocks(self):
        """Core banking service failure returns 503, not partial"""
        requests.post(f"{self.CHAOS}/service/accounts/disable",
            timeout=10)
        resp = requests.get(f"{self.BASE}/dashboard",
            headers={"Authorization": self.TOKEN}, timeout=15)
        self.assertEqual(503, resp.status_code)
        self.assertEqual("CORE_SERVICE_UNAVAILABLE",
            resp.json()["error_code"])
        requests.post(f"{self.CHAOS}/service/accounts/enable",
            timeout=10)`,
   expectedOutput:`[TEST] ET-012: Graceful Degradation Under Partial Failure
[INFO] Disabling non-critical services: analytics, notifications
[PASS] Dashboard loaded with degraded status (200 OK)
[PASS] Core data present: accounts, recent_transfers
[PASS] Unavailable services listed: analytics, notifications
[INFO] service_status=degraded, 3/5 services healthy
[PASS] Cached forex rates served when forex service down
[INFO] Cache age: 45 seconds, TTL: 600 seconds
[PASS] Cached rates match last live rates exactly
[PASS] Core service (accounts) failure returns 503
[INFO] error_code: CORE_SERVICE_UNAVAILABLE (not partial data)
[INFO] All services re-enabled after tests
───────────────────────────────────
ET-012: Graceful Degradation — 6 passed, 0 failed`},
];

export default function ErrorTestingLab() {
  const [tab, setTab] = useState('HTTPErrors');
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
        <h1 style={sty.h1}>Error & Exception Testing Lab</h1>
        <div style={sty.sub}>HTTP Errors, DB Errors, App Errors, Network/Integration, Business Logic & Error Recovery — {totalAll} Scenarios</div>
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

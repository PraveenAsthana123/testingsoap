import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12' };

const TABS = [
  { key:'ApplicationHealth', label:'App Health' },
  { key:'DatabaseHealth', label:'DB Health' },
  { key:'InfraHealth', label:'Infra Health' },
  { key:'MiddlewareHealth', label:'Middleware' },
  { key:'IntegrationHealth', label:'Integration' },
  { key:'E2EHealth', label:'E2E Health' },
];
const DIFF = ['Beginner','Intermediate','Advanced'];
const DC = { Beginner:'#2ecc71', Intermediate:'#f39c12', Advanced:'#e74c3c' };
const TC = { ApplicationHealth:'#e74c3c', DatabaseHealth:'#3498db', InfraHealth:'#9b59b6', MiddlewareHealth:'#2ecc71', IntegrationHealth:'#e67e22', E2EHealth:'#1abc9c' };

const S = [
  {id:'SH-001',title:'API Health Endpoint Validation',layer:'ApplicationHealth',framework:'Python / requests',language:'Python',difficulty:'Beginner',
   description:'Validates all critical API health check endpoints across banking microservices, verifying HTTP status codes, response time SLAs, and JSON health payload structure for application readiness and liveness probes.',
   prerequisites:'Python 3.x, requests library, Access to internal health endpoints, Service registry',
   config:'HEALTH_ENDPOINTS=https://api.bank.local/health,https://auth.bank.local/health,https://pay.bank.local/health\nTIMEOUT=10\nMAX_RESPONSE_MS=2000\nEXPECTED_STATUS=200',
   code:`import requests
import unittest
import time

class TestAPIHealthEndpoints(unittest.TestCase):
    ENDPOINTS = [
        ("Core Banking", "https://api.bank.local/health"),
        ("Auth Service", "https://auth.bank.local/health"),
        ("Payment Gateway", "https://pay.bank.local/health"),
        ("Account Service", "https://acct.bank.local/health"),
    ]
    MAX_RESPONSE_MS = 2000

    def test_health_endpoints_status(self):
        """Verify all health endpoints return 200 OK"""
        for name, url in self.ENDPOINTS:
            start = time.time()
            resp = requests.get(url, timeout=10)
            elapsed_ms = (time.time() - start) * 1000
            self.assertEqual(resp.status_code, 200,
                f"{name} health check failed: {resp.status_code}")
            body = resp.json()
            self.assertIn("status", body)
            self.assertEqual(body["status"], "healthy")
            self.assertIn("version", body)
            self.assertIn("uptime", body)
            self.assertLess(elapsed_ms, self.MAX_RESPONSE_MS,
                f"{name} response too slow: {elapsed_ms:.0f}ms")

    def test_readiness_probe(self):
        """Verify readiness probe includes dependency checks"""
        resp = requests.get(
            "https://api.bank.local/health/ready", timeout=10)
        self.assertEqual(200, resp.status_code)
        body = resp.json()
        self.assertTrue(body["database_connected"])
        self.assertTrue(body["cache_available"])
        self.assertTrue(body["message_broker_connected"])

    def test_liveness_probe(self):
        """Verify liveness probe is lightweight"""
        start = time.time()
        resp = requests.get(
            "https://api.bank.local/health/live", timeout=5)
        elapsed_ms = (time.time() - start) * 1000
        self.assertEqual(200, resp.status_code)
        self.assertLess(elapsed_ms, 100)`,
   expectedOutput:`[TEST] SH-001: API Health Endpoint Validation
[INFO] Checking 4 service health endpoints
[PASS] Core Banking: 200 OK, status=healthy, 45ms
[PASS] Auth Service: 200 OK, status=healthy, 62ms
[PASS] Payment Gateway: 200 OK, status=healthy, 38ms
[PASS] Account Service: 200 OK, status=healthy, 55ms
[PASS] Readiness probe: DB=true, Cache=true, Broker=true
[PASS] Liveness probe: 200 OK, response in 8ms
[INFO] All endpoints within 2000ms SLA threshold
[INFO] Versions: core=3.2.1, auth=2.1.0, pay=1.8.4
───────────────────────────────────
SH-001: API Health Endpoints — 6 passed, 0 failed`},

  {id:'SH-002',title:'Service Dependency Chain Validation',layer:'ApplicationHealth',framework:'Shell / curl',language:'Shell',difficulty:'Intermediate',
   description:'Validates the complete service dependency chain for the banking platform, ensuring all upstream and downstream service dependencies are reachable, responding within SLA, and returning correct health payloads.',
   prerequisites:'curl, jq, Access to service registry, Network connectivity to all microservices',
   config:'REGISTRY_URL=https://consul.bank.local:8500/v1/health\nSERVICES=core-banking,auth-service,payment-engine,notification-service,audit-logger\nSLA_MS=3000\nCHECK_INTERVAL=30',
   code:`#!/bin/bash
# Service Dependency Chain Health Check
REGISTRY="https://consul.bank.local:8500/v1/health"
SERVICES=("core-banking" "auth-service" "payment-engine"
          "notification-service" "audit-logger")
SLA_MS=3000
PASS=0; FAIL=0; TOTAL=0

echo "[TEST] SH-002: Service Dependency Chain"
for SVC in "\${SERVICES[@]}"; do
    TOTAL=\$((TOTAL + 1))
    START=\$(date +%s%N)
    RESP=\$(curl -s -w "\\n%{http_code}\\n%{time_total}" \\
        "\${REGISTRY}/service/\${SVC}" --max-time 10)
    HTTP_CODE=\$(echo "\$RESP" | tail -2 | head -1)
    TIME_MS=\$(echo "\$RESP" | tail -1 | awk '{printf "%.0f", \$1*1000}')
    BODY=\$(echo "\$RESP" | head -n -2)
    STATUS=\$(echo "\$BODY" | jq -r '.[0].Status // "unknown"')

    if [ "\$HTTP_CODE" = "200" ] && [ "\$STATUS" = "passing" ]; then
        if [ "\$TIME_MS" -lt "\$SLA_MS" ]; then
            echo "[PASS] \${SVC}: healthy (\${TIME_MS}ms)"
            PASS=\$((PASS + 1))
        else
            echo "[FAIL] \${SVC}: slow response (\${TIME_MS}ms > \${SLA_MS}ms)"
            FAIL=\$((FAIL + 1))
        fi
    else
        echo "[FAIL] \${SVC}: status=\${STATUS}, http=\${HTTP_CODE}"
        FAIL=\$((FAIL + 1))
    fi
done

# Check circular dependency detection
DEP_RESP=\$(curl -s "\${REGISTRY}/service/core-banking?dependencies=true")
CIRCULAR=\$(echo "\$DEP_RESP" | jq '.circular_deps // false')
if [ "\$CIRCULAR" = "false" ]; then
    echo "[PASS] No circular dependencies detected"
    PASS=\$((PASS + 1))
fi

echo "───────────────────────────────────"
echo "SH-002: Dependency Chain — \${PASS} passed, \${FAIL} failed"`,
   expectedOutput:`[TEST] SH-002: Service Dependency Chain
[INFO] Consul registry: https://consul.bank.local:8500
[PASS] core-banking: healthy (120ms)
[PASS] auth-service: healthy (85ms)
[PASS] payment-engine: healthy (142ms)
[PASS] notification-service: healthy (67ms)
[PASS] audit-logger: healthy (93ms)
[PASS] No circular dependencies detected
[INFO] All 5 services within 3000ms SLA
[INFO] Dependency graph: core→auth→payment→notify→audit
───────────────────────────────────
SH-002: Dependency Chain — 6 passed, 0 failed`},

  {id:'SH-003',title:'Database Connection Pool Monitoring',layer:'DatabaseHealth',framework:'Python / psycopg2',language:'Python',difficulty:'Intermediate',
   description:'Monitors database connection pool health including active connections, idle connections, pool exhaustion thresholds, connection leak detection, and query execution latency for the core banking PostgreSQL cluster.',
   prerequisites:'Python 3.x, psycopg2, PostgreSQL 14+, Access to pg_stat_activity, DBA credentials',
   config:'DB_HOST=pgcluster.bank.local\nDB_PORT=5432\nDB_NAME=core_banking\nDB_USER=monitor\nDB_PASS=MonitorP@ss123\nMAX_POOL_SIZE=100\nWARN_THRESHOLD_PCT=80\nLEAK_TIMEOUT_SEC=300',
   code:`import psycopg2
import unittest
import time

class TestDBConnectionPool(unittest.TestCase):
    DSN = "host=pgcluster.bank.local port=5432 dbname=core_banking user=monitor password=MonitorP@ss123"
    MAX_POOL = 100
    WARN_PCT = 80

    def get_conn(self):
        return psycopg2.connect(self.DSN, connect_timeout=10)

    def test_connection_pool_utilization(self):
        """Check pool is not exhausted"""
        conn = self.get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT count(*) as total,
                   count(*) FILTER (WHERE state = 'active') as active,
                   count(*) FILTER (WHERE state = 'idle') as idle,
                   count(*) FILTER (WHERE state = 'idle in transaction') as idle_tx
            FROM pg_stat_activity
            WHERE datname = 'core_banking'
        """)
        total, active, idle, idle_tx = cur.fetchone()
        util_pct = (total / self.MAX_POOL) * 100
        self.assertLess(util_pct, self.WARN_PCT,
            f"Pool utilization at {util_pct:.0f}%")
        self.assertLess(idle_tx, 5,
            f"Idle-in-transaction connections: {idle_tx}")
        cur.close()
        conn.close()

    def test_connection_leak_detection(self):
        """Detect connections open longer than threshold"""
        conn = self.get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT pid, usename, state, query,
                   EXTRACT(EPOCH FROM now() - state_change) as age_sec
            FROM pg_stat_activity
            WHERE datname = 'core_banking'
              AND state != 'active'
              AND EXTRACT(EPOCH FROM now() - state_change) > 300
        """)
        leaks = cur.fetchall()
        self.assertEqual(len(leaks), 0,
            f"Found {len(leaks)} leaked connections (>300s idle)")
        cur.close()
        conn.close()

    def test_query_execution_latency(self):
        """Verify query latency is within SLA"""
        conn = self.get_conn()
        cur = conn.cursor()
        start = time.time()
        cur.execute("SELECT 1")
        cur.fetchone()
        latency_ms = (time.time() - start) * 1000
        self.assertLess(latency_ms, 50,
            f"Query latency too high: {latency_ms:.1f}ms")
        cur.close()
        conn.close()`,
   expectedOutput:`[TEST] SH-003: Database Connection Pool Monitoring
[INFO] Connected to pgcluster.bank.local:5432/core_banking
[PASS] Pool utilization: 34/100 (34%) — below 80% threshold
[INFO] Active: 12, Idle: 18, Idle-in-tx: 4
[PASS] No idle-in-transaction overflow (4 < 5)
[PASS] No connection leaks detected (0 idle > 300s)
[PASS] Query latency: 2.3ms (SLA < 50ms)
[INFO] Connection pool healthy — headroom: 66 connections
[INFO] Oldest idle connection: 45s
───────────────────────────────────
SH-003: DB Connection Pool — 4 passed, 0 failed`},

  {id:'SH-004',title:'Database Replication Lag Monitoring',layer:'DatabaseHealth',framework:'Shell / psql',language:'Shell',difficulty:'Advanced',
   description:'Monitors PostgreSQL streaming replication lag between primary and replica nodes, validates WAL position synchronization, checks replication slot status, and alerts on excessive lag for the banking database cluster.',
   prerequisites:'psql client, DBA credentials with replication monitoring privileges, Primary and replica node access',
   config:'PRIMARY_HOST=pg-primary.bank.local\nREPLICA_HOSTS=pg-replica1.bank.local,pg-replica2.bank.local\nDB_NAME=core_banking\nDB_USER=repl_monitor\nDB_PASS=ReplMonP@ss123\nMAX_LAG_BYTES=16777216\nMAX_LAG_SECONDS=10',
   code:`#!/bin/bash
# Database Replication Lag Monitor
PRIMARY="pg-primary.bank.local"
REPLICAS=("pg-replica1.bank.local" "pg-replica2.bank.local")
DB="core_banking"
USER="repl_monitor"
MAX_LAG_BYTES=16777216  # 16MB
MAX_LAG_SEC=10
PASS=0; FAIL=0

echo "[TEST] SH-004: Replication Lag Monitoring"

# Check primary WAL position
PRIMARY_LSN=\$(PGPASSWORD=ReplMonP@ss123 psql -h "\$PRIMARY" \\
    -U "\$USER" -d "\$DB" -t -c \\
    "SELECT pg_current_wal_lsn();" | tr -d ' ')
echo "[INFO] Primary WAL LSN: \$PRIMARY_LSN"

# Check each replica
for REPLICA in "\${REPLICAS[@]}"; do
    REPLICA_LSN=\$(PGPASSWORD=ReplMonP@ss123 psql -h "\$REPLICA" \\
        -U "\$USER" -d "\$DB" -t -c \\
        "SELECT pg_last_wal_replay_lsn();" | tr -d ' ')
    LAG_BYTES=\$(PGPASSWORD=ReplMonP@ss123 psql -h "\$PRIMARY" \\
        -U "\$USER" -d "\$DB" -t -c \\
        "SELECT pg_wal_lsn_diff('\$PRIMARY_LSN', '\$REPLICA_LSN');" | tr -d ' ')
    LAG_SEC=\$(PGPASSWORD=ReplMonP@ss123 psql -h "\$REPLICA" \\
        -U "\$USER" -d "\$DB" -t -c \\
        "SELECT EXTRACT(EPOCH FROM now() - pg_last_xact_replay_timestamp());" \\
        | tr -d ' ' | cut -d'.' -f1)

    if [ "\$LAG_BYTES" -lt "\$MAX_LAG_BYTES" ] && \\
       [ "\$LAG_SEC" -lt "\$MAX_LAG_SEC" ]; then
        echo "[PASS] \$REPLICA: lag=\${LAG_BYTES}B (\${LAG_SEC}s)"
        PASS=\$((PASS + 1))
    else
        echo "[FAIL] \$REPLICA: lag=\${LAG_BYTES}B (\${LAG_SEC}s)"
        FAIL=\$((FAIL + 1))
    fi
done

# Check replication slots
SLOT_STATUS=\$(PGPASSWORD=ReplMonP@ss123 psql -h "\$PRIMARY" \\
    -U "\$USER" -d "\$DB" -t -c \\
    "SELECT count(*) FROM pg_replication_slots WHERE NOT active;")
INACTIVE=\$(echo "\$SLOT_STATUS" | tr -d ' ')
if [ "\$INACTIVE" -eq 0 ]; then
    echo "[PASS] All replication slots active"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] \$INACTIVE inactive replication slots"
    FAIL=\$((FAIL + 1))
fi

echo "───────────────────────────────────"
echo "SH-004: Replication Lag — \$PASS passed, \$FAIL failed"`,
   expectedOutput:`[TEST] SH-004: Replication Lag Monitoring
[INFO] Primary WAL LSN: 0/5A0003E8
[INFO] Checking 2 replica nodes
[PASS] pg-replica1.bank.local: lag=4096B (1s)
[PASS] pg-replica2.bank.local: lag=8192B (2s)
[PASS] All replication slots active
[INFO] Max lag threshold: 16MB / 10s
[INFO] Replication mode: streaming async
[INFO] Slot count: 2 active, 0 inactive
───────────────────────────────────
SH-004: Replication Lag — 3 passed, 0 failed`},

  {id:'SH-005',title:'CPU & Memory Utilization Monitoring',layer:'InfraHealth',framework:'PowerShell / WMI',language:'PowerShell',difficulty:'Beginner',
   description:'Monitors CPU utilization, memory consumption, disk I/O, and process health across banking application servers using WMI/CIM queries, with threshold-based alerting for proactive infrastructure management.',
   prerequisites:'PowerShell 7.x, WMI/CIM access to target servers, Admin credentials, WinRM enabled',
   config:'SERVERS=app-srv01.bank.local,app-srv02.bank.local,app-srv03.bank.local\nCPU_WARN_PCT=80\nCPU_CRIT_PCT=95\nMEM_WARN_PCT=85\nMEM_CRIT_PCT=95\nCHECK_INTERVAL=60',
   code:`# CPU & Memory Infrastructure Health Check
param(
    [string[]]$Servers = @("app-srv01.bank.local",
        "app-srv02.bank.local", "app-srv03.bank.local"),
    [int]$CpuWarn = 80,
    [int]$CpuCrit = 95,
    [int]$MemWarn = 85,
    [int]$MemCrit = 95
)

$Pass = 0; $Fail = 0
Write-Host "[TEST] SH-005: CPU & Memory Monitoring"

foreach ($Server in $Servers) {
    # CPU utilization
    $cpu = Get-CimInstance -ComputerName $Server ` +
        "`" + `-ClassName Win32_Processor |
        Measure-Object -Property LoadPercentage -Average
    $cpuAvg = [math]::Round($cpu.Average, 1)

    # Memory utilization
    $os = Get-CimInstance -ComputerName $Server ` +
        "`" + `-ClassName Win32_OperatingSystem
    $memTotal = [math]::Round($os.TotalVisibleMemorySize/1MB, 1)
    $memFree = [math]::Round($os.FreePhysicalMemory/1MB, 1)
    $memUsedPct = [math]::Round((1-$memFree/$memTotal)*100, 1)

    # Evaluate CPU
    if ($cpuAvg -lt $CpuWarn) {
        Write-Host "[PASS] $Server CPU: $($cpuAvg)%"
        $Pass++
    } else {
        Write-Host "[FAIL] $Server CPU: $($cpuAvg)% (>$CpuWarn)"
        $Fail++
    }

    # Evaluate Memory
    if ($memUsedPct -lt $MemWarn) {
        Write-Host "[PASS] $Server MEM: $($memUsedPct)%"
        $Pass++
    } else {
        Write-Host "[FAIL] $Server MEM: $($memUsedPct)% (>$MemWarn)"
        $Fail++
    }
}

# Check critical processes
$critProcs = @("java", "sqlservr", "nginx", "redis-server")
foreach ($proc in $critProcs) {
    $running = Get-Process -Name $proc -ErrorAction SilentlyContinue
    if ($running) {
        Write-Host "[PASS] Process $proc is running (PID: $($running.Id))"
        $Pass++
    } else {
        Write-Host "[FAIL] Process $proc is NOT running"
        $Fail++
    }
}

Write-Host "───────────────────────────────────"
Write-Host "SH-005: CPU & Memory — $Pass passed, $Fail failed"`,
   expectedOutput:`[TEST] SH-005: CPU & Memory Monitoring
[INFO] Checking 3 application servers
[PASS] app-srv01.bank.local CPU: 42.3%
[PASS] app-srv01.bank.local MEM: 61.7% (24.8GB/40GB)
[PASS] app-srv02.bank.local CPU: 38.9%
[PASS] app-srv02.bank.local MEM: 58.2% (23.3GB/40GB)
[PASS] app-srv03.bank.local CPU: 55.1%
[PASS] app-srv03.bank.local MEM: 72.4% (29.0GB/40GB)
[PASS] Process java is running (PID: 4521)
[PASS] Process sqlservr is running (PID: 1892)
[PASS] Process nginx is running (PID: 1023)
[PASS] Process redis-server is running (PID: 2341)
───────────────────────────────────
SH-005: CPU & Memory — 10 passed, 0 failed`},

  {id:'SH-006',title:'SSL Certificate Expiry Monitoring',layer:'InfraHealth',framework:'Python / ssl',language:'Python',difficulty:'Intermediate',
   description:'Proactively monitors SSL/TLS certificate expiry dates across all banking platform endpoints, validating certificate chain integrity, key strength, and triggering alerts for certificates approaching renewal deadlines.',
   prerequisites:'Python 3.x, ssl module, Network access to all HTTPS endpoints, Certificate inventory list',
   config:'ENDPOINTS=api.bank.local:443,auth.bank.local:8443,pay.bank.local:443,portal.bank.local:443\nWARN_DAYS=30\nCRIT_DAYS=7\nMIN_KEY_BITS=2048\nCHECK_CHAIN=true',
   code:`import ssl
import socket
from datetime import datetime, timezone
import unittest

class TestSSLCertExpiry(unittest.TestCase):
    ENDPOINTS = [
        ("API Gateway", "api.bank.local", 443),
        ("Auth Server", "auth.bank.local", 8443),
        ("Payment Portal", "pay.bank.local", 443),
        ("Customer Portal", "portal.bank.local", 443),
    ]
    WARN_DAYS = 30
    CRIT_DAYS = 7

    def test_certificate_expiry(self):
        """Check all certs are not near expiry"""
        for name, host, port in self.ENDPOINTS:
            ctx = ssl.create_default_context()
            with socket.create_connection(
                    (host, port), timeout=10) as sock:
                with ctx.wrap_socket(
                        sock, server_hostname=host) as ssock:
                    cert = ssock.getpeercert()
                    not_after = datetime.strptime(
                        cert["notAfter"], "%b %d %H:%M:%S %Y %Z"
                    ).replace(tzinfo=timezone.utc)
                    days_left = (not_after - datetime.now(
                        timezone.utc)).days
                    self.assertGreater(days_left, self.CRIT_DAYS,
                        f"{name}: CRITICAL — expires in {days_left}d")
                    self.assertGreater(days_left, self.WARN_DAYS,
                        f"{name}: WARNING — expires in {days_left}d")

    def test_certificate_chain_valid(self):
        """Verify full certificate chain is trusted"""
        for name, host, port in self.ENDPOINTS:
            ctx = ssl.create_default_context()
            with socket.create_connection(
                    (host, port), timeout=10) as sock:
                with ctx.wrap_socket(
                        sock, server_hostname=host) as ssock:
                    cert = ssock.getpeercert()
                    issuer = dict(x[0] for x in cert["issuer"])
                    self.assertIn("organizationName", issuer)

    def test_key_strength(self):
        """Verify minimum key size"""
        for name, host, port in self.ENDPOINTS:
            ctx = ssl.create_default_context()
            with socket.create_connection(
                    (host, port), timeout=10) as sock:
                with ctx.wrap_socket(
                        sock, server_hostname=host) as ssock:
                    cipher = ssock.cipher()
                    self.assertGreaterEqual(cipher[2], 128,
                        f"{name}: key size {cipher[2]} too small")`,
   expectedOutput:`[TEST] SH-006: SSL Certificate Expiry Monitoring
[INFO] Scanning 4 endpoints for certificate health
[PASS] API Gateway: 245 days remaining (expires 2026-10-30)
[PASS] Auth Server: 312 days remaining (expires 2027-01-04)
[PASS] Payment Portal: 180 days remaining (expires 2026-08-26)
[PASS] Customer Portal: 156 days remaining (expires 2026-08-02)
[PASS] All certificate chains validated and trusted
[PASS] All endpoints meet minimum key strength (>=128-bit)
[INFO] Nearest expiry: Payment Portal in 180 days
[INFO] Issuer: DigiCert Global Root G2
───────────────────────────────────
SH-006: SSL Cert Expiry — 6 passed, 0 failed`},

  {id:'SH-007',title:'Redis Cache Health & Performance',layer:'MiddlewareHealth',framework:'Python / redis',language:'Python',difficulty:'Intermediate',
   description:'Validates Redis cache cluster health including connectivity, memory utilization, hit/miss ratios, replication status, key eviction rates, and latency benchmarks for the banking session and data caching layer.',
   prerequisites:'Python 3.x, redis-py library, Redis 7.x cluster, Monitor credentials',
   config:'REDIS_NODES=redis-node1.bank.local:6379,redis-node2.bank.local:6379,redis-node3.bank.local:6379\nREDIS_PASS=RedisMonP@ss123\nMAX_MEMORY_PCT=85\nMIN_HIT_RATIO=0.90\nMAX_LATENCY_MS=5',
   code:`import redis
import unittest
import time

class TestRedisCacheHealth(unittest.TestCase):
    NODES = [
        ("redis-node1", "redis-node1.bank.local", 6379),
        ("redis-node2", "redis-node2.bank.local", 6379),
        ("redis-node3", "redis-node3.bank.local", 6379),
    ]
    PASSWORD = "RedisMonP@ss123"
    MAX_MEM_PCT = 85
    MIN_HIT_RATIO = 0.90

    def get_client(self, host, port):
        return redis.Redis(host=host, port=port,
            password=self.PASSWORD, socket_timeout=5,
            decode_responses=True)

    def test_redis_connectivity(self):
        """Verify all Redis nodes respond to PING"""
        for name, host, port in self.NODES:
            r = self.get_client(host, port)
            self.assertTrue(r.ping(), f"{name}: PING failed")
            r.close()

    def test_memory_utilization(self):
        """Check memory usage below threshold"""
        for name, host, port in self.NODES:
            r = self.get_client(host, port)
            info = r.info("memory")
            used = info["used_memory"]
            maxmem = info["maxmemory"]
            if maxmem > 0:
                pct = (used / maxmem) * 100
                self.assertLess(pct, self.MAX_MEM_PCT,
                    f"{name}: memory at {pct:.1f}%")
            r.close()

    def test_cache_hit_ratio(self):
        """Verify cache hit ratio above threshold"""
        for name, host, port in self.NODES:
            r = self.get_client(host, port)
            info = r.info("stats")
            hits = info["keyspace_hits"]
            misses = info["keyspace_misses"]
            total = hits + misses
            if total > 0:
                ratio = hits / total
                self.assertGreaterEqual(ratio, self.MIN_HIT_RATIO,
                    f"{name}: hit ratio {ratio:.2f}")
            r.close()

    def test_latency_benchmark(self):
        """Verify SET/GET latency under threshold"""
        r = self.get_client(*self.NODES[0][1:])
        start = time.time()
        r.set("health_check_key", "test_value")
        val = r.get("health_check_key")
        elapsed_ms = (time.time() - start) * 1000
        self.assertEqual(val, "test_value")
        self.assertLess(elapsed_ms, 5,
            f"Latency too high: {elapsed_ms:.1f}ms")
        r.delete("health_check_key")
        r.close()`,
   expectedOutput:`[TEST] SH-007: Redis Cache Health & Performance
[INFO] Checking 3 Redis cluster nodes
[PASS] redis-node1: PING OK, connected
[PASS] redis-node2: PING OK, connected
[PASS] redis-node3: PING OK, connected
[PASS] redis-node1: memory 62.3% (5.0GB/8.0GB)
[PASS] redis-node2: memory 58.7% (4.7GB/8.0GB)
[PASS] redis-node3: memory 64.1% (5.1GB/8.0GB)
[PASS] Cache hit ratio: 0.94 (threshold >= 0.90)
[PASS] SET/GET latency: 1.2ms (SLA < 5ms)
[INFO] Total keys: 1.2M across cluster
[INFO] Eviction policy: allkeys-lru
───────────────────────────────────
SH-007: Redis Cache — 8 passed, 0 failed`},

  {id:'SH-008',title:'Message Broker Health Validation',layer:'MiddlewareHealth',framework:'Java / JMS',language:'Java',difficulty:'Advanced',
   description:'Validates RabbitMQ/ActiveMQ message broker health including queue depths, consumer counts, dead letter queue monitoring, message throughput rates, and cluster node synchronization for the banking event-driven architecture.',
   prerequisites:'Java 11+, JMS client library, RabbitMQ Management API access, Admin credentials',
   config:'BROKER_URL=amqp://broker.bank.local:5672\nMGMT_URL=https://broker.bank.local:15672/api\nBROKER_USER=monitor\nBROKER_PASS=BrokerMonP@ss123\nMAX_QUEUE_DEPTH=10000\nMAX_DLQ_COUNT=100',
   code:`import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.net.http.*;
import java.net.URI;
import java.util.Base64;
import com.fasterxml.jackson.databind.*;

public class TestMessageBrokerHealth {
    static final String MGMT = "https://broker.bank.local:15672/api";
    static final String AUTH = Base64.getEncoder().encodeToString(
        "monitor:BrokerMonP@ss123".getBytes());
    static final int MAX_DEPTH = 10000;
    static final int MAX_DLQ = 100;

    HttpResponse<String> apiGet(String path) throws Exception {
        return HttpClient.newHttpClient().send(
            HttpRequest.newBuilder()
                .uri(URI.create(MGMT + path))
                .header("Authorization", "Basic " + AUTH)
                .timeout(java.time.Duration.ofSeconds(10))
                .build(),
            HttpResponse.BodyHandlers.ofString());
    }

    @Test
    void testBrokerNodeHealth() throws Exception {
        var resp = apiGet("/nodes");
        assertEquals(200, resp.statusCode());
        var nodes = new ObjectMapper().readTree(resp.body());
        for (var node : nodes) {
            assertTrue(node.get("running").asBoolean(),
                node.get("name").asText() + " not running");
            assertFalse(node.get("mem_alarm").asBoolean(),
                "Memory alarm on " + node.get("name").asText());
            assertFalse(node.get("disk_free_alarm").asBoolean(),
                "Disk alarm on " + node.get("name").asText());
        }
    }

    @Test
    void testQueueDepthThresholds() throws Exception {
        var resp = apiGet("/queues/%2F");
        assertEquals(200, resp.statusCode());
        var queues = new ObjectMapper().readTree(resp.body());
        for (var q : queues) {
            String name = q.get("name").asText();
            int msgs = q.get("messages").asInt();
            if (name.startsWith("dlq.")) {
                assertTrue(msgs < MAX_DLQ,
                    "DLQ " + name + " has " + msgs + " messages");
            } else {
                assertTrue(msgs < MAX_DEPTH,
                    name + " depth " + msgs + " exceeds " + MAX_DEPTH);
            }
            assertTrue(q.get("consumers").asInt() > 0,
                name + " has no consumers");
        }
    }

    @Test
    void testMessageThroughput() throws Exception {
        var resp = apiGet("/overview");
        assertEquals(200, resp.statusCode());
        var overview = new ObjectMapper().readTree(resp.body());
        var rates = overview.get("message_stats");
        double publishRate = rates.get("publish_details")
            .get("rate").asDouble();
        double deliverRate = rates.get("deliver_get_details")
            .get("rate").asDouble();
        assertTrue(publishRate > 0, "No messages being published");
        assertTrue(deliverRate > 0, "No messages being consumed");
    }`,
   expectedOutput:`[TEST] SH-008: Message Broker Health Validation
[INFO] RabbitMQ Management: https://broker.bank.local:15672
[PASS] Node rabbit@broker01: running, no alarms
[PASS] Node rabbit@broker02: running, no alarms
[PASS] Node rabbit@broker03: running, no alarms
[PASS] Queue payment.events: depth=245, consumers=4
[PASS] Queue notification.queue: depth=89, consumers=2
[PASS] Queue audit.events: depth=1023, consumers=3
[PASS] DLQ dlq.payment: 12 msgs (< 100 threshold)
[PASS] Publish rate: 1,250 msg/s
[PASS] Consume rate: 1,248 msg/s
[INFO] Cluster: 3 nodes synchronized
───────────────────────────────────
SH-008: Message Broker — 9 passed, 0 failed`},

  {id:'SH-009',title:'Payment Gateway Connectivity Test',layer:'IntegrationHealth',framework:'REST Assured',language:'Java',difficulty:'Intermediate',
   description:'Validates end-to-end connectivity with external payment gateway providers including VISA, MasterCard, and RuPay networks, testing ping health, authentication handshake, transaction simulation, and failover routing.',
   prerequisites:'REST Assured 5.x, Payment gateway sandbox credentials, VPN/leased line to payment network, HSM access for PIN block generation',
   config:'VISA_URL=https://visa-sandbox.bank.local:8443/api/v1\nMC_URL=https://mc-sandbox.bank.local:8443/api/v1\nRUPAY_URL=https://rupay-sandbox.bank.local:8443/api/v1\nAPI_KEY=sandbox_key_abc123\nTIMEOUT=15000\nRETRY_COUNT=3',
   code:`import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.*;
import static org.junit.jupiter.api.Assertions.*;
import io.restassured.response.Response;

public class TestPaymentGatewayConnectivity {
    static final String VISA = "https://visa-sandbox.bank.local:8443/api/v1";
    static final String MC = "https://mc-sandbox.bank.local:8443/api/v1";
    static final String RUPAY = "https://rupay-sandbox.bank.local:8443/api/v1";
    static final String API_KEY = "sandbox_key_abc123";

    @Test
    void testVisaGatewayHealth() {
        Response resp = given()
            .header("X-API-Key", API_KEY)
            .get(VISA + "/health");
        assertEquals(200, resp.statusCode());
        assertEquals("active", resp.jsonPath().getString("status"));
        assertTrue(resp.jsonPath().getInt("latency_ms") < 500);
    }

    @Test
    void testMasterCardGatewayHealth() {
        Response resp = given()
            .header("X-API-Key", API_KEY)
            .get(MC + "/health");
        assertEquals(200, resp.statusCode());
        assertEquals("active", resp.jsonPath().getString("status"));
    }

    @Test
    void testRuPayGatewayHealth() {
        Response resp = given()
            .header("X-API-Key", API_KEY)
            .get(RUPAY + "/health");
        assertEquals(200, resp.statusCode());
        assertEquals("active", resp.jsonPath().getString("status"));
    }

    @Test
    void testTransactionSimulation() {
        Response resp = given()
            .header("X-API-Key", API_KEY)
            .contentType("application/json")
            .body("{\\"amount\\":100,\\"currency\\":\\"INR\\"," +
                  "\\"card_network\\":\\"VISA\\"," +
                  "\\"type\\":\\"ECHO_TEST\\"}")
            .post(VISA + "/transactions/simulate");
        assertEquals(200, resp.statusCode());
        assertEquals("APPROVED", resp.jsonPath().getString("result"));
        assertNotNull(resp.jsonPath().getString("ref_number"));
    }

    @Test
    void testFailoverRouting() {
        // Simulate primary down, verify fallback route
        Response resp = given()
            .header("X-API-Key", API_KEY)
            .header("X-Force-Failover", "true")
            .get(VISA + "/health");
        assertEquals(200, resp.statusCode());
        assertEquals("failover", resp.jsonPath().getString("route"));
    }`,
   expectedOutput:`[TEST] SH-009: Payment Gateway Connectivity Test
[INFO] Testing 3 payment gateway connections
[PASS] VISA gateway: active, latency=142ms
[PASS] MasterCard gateway: active, latency=168ms
[PASS] RuPay gateway: active, latency=95ms
[PASS] VISA echo test: APPROVED, ref=VTX20260227001
[PASS] Failover routing: secondary route active
[INFO] Primary: visa-primary.bank.local
[INFO] Failover: visa-secondary.bank.local
[INFO] All 3 networks reachable and responding
───────────────────────────────────
SH-009: Payment Gateway — 5 passed, 0 failed`},

  {id:'SH-010',title:'SWIFT/RTGS Network Health Check',layer:'IntegrationHealth',framework:'Python / requests',language:'Python',difficulty:'Advanced',
   description:'Validates connectivity and health status of SWIFT (Society for Worldwide Interbank Financial Telecommunication) and RTGS (Real Time Gross Settlement) networks, including message queue status, session authentication, and settlement window availability.',
   prerequisites:'Python 3.x, requests library, SWIFT Alliance Lite2 access, RTGS participant credentials, VPN to payment network',
   config:'SWIFT_URL=https://swift-gateway.bank.local:9443/api/v2\nRTGS_URL=https://rtgs-gateway.bank.local:8443/api/v1\nSWIFT_BIC=BANKINUS33\nRTGS_IFSC=BANK0000001\nSWIFT_CERT=/certs/swift-client.pem\nRTGS_CERT=/certs/rtgs-client.pem',
   code:`import requests
import unittest
from datetime import datetime, timezone

class TestSWIFTRTGSHealth(unittest.TestCase):
    SWIFT_URL = "https://swift-gateway.bank.local:9443/api/v2"
    RTGS_URL = "https://rtgs-gateway.bank.local:8443/api/v1"
    SWIFT_BIC = "BANKINUS33"
    RTGS_IFSC = "BANK0000001"
    SWIFT_CERT = ("/certs/swift-client.pem",
                  "/certs/swift-client-key.pem")
    RTGS_CERT = ("/certs/rtgs-client.pem",
                 "/certs/rtgs-client-key.pem")

    def test_swift_gateway_status(self):
        """Verify SWIFT gateway connectivity"""
        resp = requests.get(
            f"{self.SWIFT_URL}/status",
            cert=self.SWIFT_CERT, verify=True, timeout=15)
        self.assertEqual(200, resp.status_code)
        data = resp.json()
        self.assertEqual(data["bic"], self.SWIFT_BIC)
        self.assertEqual(data["connection_status"], "ACTIVE")
        self.assertIn("session_id", data)

    def test_swift_message_queue(self):
        """Check SWIFT message queue health"""
        resp = requests.get(
            f"{self.SWIFT_URL}/queues/status",
            cert=self.SWIFT_CERT, verify=True, timeout=15)
        self.assertEqual(200, resp.status_code)
        queues = resp.json()["queues"]
        for q in queues:
            self.assertLess(q["pending_count"], 500,
                f"Queue {q['name']} backlog: {q['pending_count']}")
            self.assertTrue(q["consumer_active"])

    def test_rtgs_settlement_window(self):
        """Verify RTGS settlement window status"""
        resp = requests.get(
            f"{self.RTGS_URL}/settlement/status",
            cert=self.RTGS_CERT, verify=True, timeout=15)
        self.assertEqual(200, resp.status_code)
        data = resp.json()
        self.assertEqual(data["ifsc"], self.RTGS_IFSC)
        self.assertIn(data["window_status"],
            ["OPEN", "EXTENDED"])

    def test_rtgs_participant_status(self):
        """Verify RTGS participant is active"""
        resp = requests.get(
            f"{self.RTGS_URL}/participants/{self.RTGS_IFSC}",
            cert=self.RTGS_CERT, verify=True, timeout=15)
        self.assertEqual(200, resp.status_code)
        self.assertEqual(resp.json()["status"], "ACTIVE")
        self.assertTrue(resp.json()["settlement_enabled"])`,
   expectedOutput:`[TEST] SH-010: SWIFT/RTGS Network Health Check
[INFO] SWIFT BIC: BANKINUS33 | RTGS IFSC: BANK0000001
[PASS] SWIFT gateway: ACTIVE, session=SWF20260227001
[PASS] SWIFT input queue: 23 pending, consumer active
[PASS] SWIFT output queue: 8 pending, consumer active
[PASS] RTGS settlement window: OPEN
[INFO] Window hours: 08:00-18:00 IST (extended to 19:30)
[PASS] RTGS participant BANK0000001: ACTIVE
[PASS] Settlement enabled: true
[INFO] Last SWIFT msg: MT103, 2 min ago
[INFO] Last RTGS txn: INR 5,00,000, 5 min ago
───────────────────────────────────
SH-010: SWIFT/RTGS Health — 6 passed, 0 failed`},

  {id:'SH-011',title:'End-to-End Transaction Flow Validation',layer:'E2EHealth',framework:'Python / requests',language:'Python',difficulty:'Advanced',
   description:'Validates the complete end-to-end transaction lifecycle from authentication through fund transfer, payment processing, notification delivery, and audit trail generation across all banking microservices in a production-like environment.',
   prerequisites:'Python 3.x, requests library, Sandbox environment with all microservices, Test account with pre-funded balance, SMS/Email mock service',
   config:'API_BASE=https://api-sandbox.bank.local\nAUTH_URL=https://auth-sandbox.bank.local:8443\nTEST_USER=e2e_test_user\nTEST_PASS=E2ETestP@ss123!\nSOURCE_ACCT=1234567890\nDEST_ACCT=9876543210\nTRANSFER_AMT=1000.00',
   code:`import requests
import unittest
import time

class TestE2ETransactionFlow(unittest.TestCase):
    BASE = "https://api-sandbox.bank.local"
    AUTH = "https://auth-sandbox.bank.local:8443"

    def test_full_transaction_lifecycle(self):
        session = requests.Session()
        session.verify = True

        # Step 1: Authenticate
        auth_resp = session.post(f"{self.AUTH}/api/v2/auth/login",
            json={"username": "e2e_test_user",
                  "password": "E2ETestP@ss123!"},
            timeout=10)
        self.assertEqual(200, auth_resp.status_code)
        token = auth_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Step 2: Check source balance
        bal_resp = session.get(
            f"{self.BASE}/api/v2/accounts/1234567890/balance",
            headers=headers, timeout=10)
        self.assertEqual(200, bal_resp.status_code)
        initial_bal = bal_resp.json()["available_balance"]
        self.assertGreaterEqual(initial_bal, 1000.00)

        # Step 3: Initiate transfer
        tx_resp = session.post(
            f"{self.BASE}/api/v2/transfers",
            headers=headers, json={
                "from_account": "1234567890",
                "to_account": "9876543210",
                "amount": 1000.00,
                "currency": "INR",
                "remarks": "E2E health check"
            }, timeout=15)
        self.assertEqual(201, tx_resp.status_code)
        tx_id = tx_resp.json()["transaction_id"]
        self.assertIsNotNone(tx_id)

        # Step 4: Poll transaction status
        for attempt in range(10):
            status_resp = session.get(
                f"{self.BASE}/api/v2/transfers/{tx_id}/status",
                headers=headers, timeout=10)
            status = status_resp.json()["status"]
            if status in ["COMPLETED", "FAILED"]:
                break
            time.sleep(2)
        self.assertEqual("COMPLETED", status)

        # Step 5: Verify balances updated
        new_bal_resp = session.get(
            f"{self.BASE}/api/v2/accounts/1234567890/balance",
            headers=headers, timeout=10)
        new_bal = new_bal_resp.json()["available_balance"]
        self.assertAlmostEqual(
            new_bal, initial_bal - 1000.00, places=2)

        # Step 6: Verify audit trail
        audit_resp = session.get(
            f"{self.BASE}/api/v2/audit/transactions/{tx_id}",
            headers=headers, timeout=10)
        self.assertEqual(200, audit_resp.status_code)
        events = audit_resp.json()["events"]
        event_types = [e["type"] for e in events]
        self.assertIn("INITIATED", event_types)
        self.assertIn("AUTHORIZED", event_types)
        self.assertIn("SETTLED", event_types)`,
   expectedOutput:`[TEST] SH-011: End-to-End Transaction Flow Validation
[INFO] Environment: api-sandbox.bank.local
[PASS] Step 1: Authentication successful, token issued
[PASS] Step 2: Source balance: INR 50,000.00 (sufficient)
[PASS] Step 3: Transfer initiated: TXN20260227E2E001
[INFO] Amount: INR 1,000.00 | From: ****7890 → To: ****3210
[PASS] Step 4: Transaction COMPLETED (polled 3 times, 6s)
[PASS] Step 5: Balance updated: INR 49,000.00
[PASS] Step 6: Audit trail: INITIATED → AUTHORIZED → SETTLED
[INFO] Total E2E time: 8.4 seconds
[INFO] Notification: SMS sent to +91****7890
───────────────────────────────────
SH-011: E2E Transaction — 6 passed, 0 failed`},

  {id:'SH-012',title:'Disaster Recovery Readiness Check',layer:'E2EHealth',framework:'Shell / curl',language:'Shell',difficulty:'Advanced',
   description:'Validates disaster recovery readiness by checking DR site replication status, failover mechanism health, backup integrity, RTO/RPO compliance, and cross-region data synchronization for the banking platform critical infrastructure.',
   prerequisites:'curl, jq, ssh access to DR site, DR orchestrator API access, Backup verification tools, Network connectivity between primary and DR sites',
   config:'DR_ORCHESTRATOR=https://dr-mgmt.bank.local:9443/api/v1\nDR_SITE=dr-south.bank.local\nPRIMARY_SITE=prod-north.bank.local\nRPO_TARGET_SEC=300\nRTO_TARGET_SEC=600\nBACKUP_RETENTION_DAYS=30\nREPLICATION_MODE=async',
   code:`#!/bin/bash
# Disaster Recovery Readiness Health Check
DR_API="https://dr-mgmt.bank.local:9443/api/v1"
RPO_TARGET=300   # 5 minutes
RTO_TARGET=600   # 10 minutes
PASS=0; FAIL=0

echo "[TEST] SH-012: Disaster Recovery Readiness"

# 1. Check DR site connectivity
DR_STATUS=\$(curl -sk -w "%{http_code}" -o /tmp/dr_resp.json \\
    "\${DR_API}/sites/dr-south/status" --max-time 15)
if [ "\$DR_STATUS" = "200" ]; then
    SITE_STATE=\$(jq -r '.state' /tmp/dr_resp.json)
    if [ "\$SITE_STATE" = "STANDBY_READY" ]; then
        echo "[PASS] DR site state: STANDBY_READY"
        PASS=\$((PASS + 1))
    else
        echo "[FAIL] DR site state: \$SITE_STATE"
        FAIL=\$((FAIL + 1))
    fi
else
    echo "[FAIL] DR site unreachable: HTTP \$DR_STATUS"
    FAIL=\$((FAIL + 1))
fi

# 2. Check replication lag (RPO)
RPO_RESP=\$(curl -sk "\${DR_API}/replication/lag" --max-time 10)
RPO_LAG=\$(echo "\$RPO_RESP" | jq '.lag_seconds')
if [ "\$RPO_LAG" -lt "\$RPO_TARGET" ]; then
    echo "[PASS] RPO lag: \${RPO_LAG}s (target <\${RPO_TARGET}s)"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] RPO lag: \${RPO_LAG}s exceeds \${RPO_TARGET}s"
    FAIL=\$((FAIL + 1))
fi

# 3. Check last failover test result
FO_RESP=\$(curl -sk "\${DR_API}/failover/last-test" --max-time 10)
FO_RTO=\$(echo "\$FO_RESP" | jq '.actual_rto_seconds')
FO_RESULT=\$(echo "\$FO_RESP" | jq -r '.result')
if [ "\$FO_RESULT" = "SUCCESS" ] && [ "\$FO_RTO" -lt "\$RTO_TARGET" ]; then
    echo "[PASS] Last failover test: \${FO_RTO}s RTO (target <\${RTO_TARGET}s)"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] Failover test: result=\$FO_RESULT, RTO=\${FO_RTO}s"
    FAIL=\$((FAIL + 1))
fi

# 4. Check backup integrity
BK_RESP=\$(curl -sk "\${DR_API}/backups/latest" --max-time 10)
BK_STATUS=\$(echo "\$BK_RESP" | jq -r '.verification_status')
BK_AGE_HR=\$(echo "\$BK_RESP" | jq '.age_hours')
if [ "\$BK_STATUS" = "VERIFIED" ] && [ "\$BK_AGE_HR" -lt 25 ]; then
    echo "[PASS] Latest backup: VERIFIED, \${BK_AGE_HR}h old"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] Backup: status=\$BK_STATUS, age=\${BK_AGE_HR}h"
    FAIL=\$((FAIL + 1))
fi

# 5. Check cross-region data sync
SYNC_RESP=\$(curl -sk "\${DR_API}/sync/status" --max-time 10)
SYNC_PCT=\$(echo "\$SYNC_RESP" | jq '.sync_percentage')
if [ "\$SYNC_PCT" -ge 99 ]; then
    echo "[PASS] Cross-region sync: \${SYNC_PCT}%"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] Cross-region sync: \${SYNC_PCT}% (<99%)"
    FAIL=\$((FAIL + 1))
fi

# 6. Check DR runbook automation
RB_RESP=\$(curl -sk "\${DR_API}/runbook/validation" --max-time 10)
RB_STATUS=\$(echo "\$RB_RESP" | jq -r '.all_steps_validated')
if [ "\$RB_STATUS" = "true" ]; then
    echo "[PASS] DR runbook: all steps validated"
    PASS=\$((PASS + 1))
else
    echo "[FAIL] DR runbook: validation incomplete"
    FAIL=\$((FAIL + 1))
fi

echo "───────────────────────────────────"
echo "SH-012: DR Readiness — \$PASS passed, \$FAIL failed"`,
   expectedOutput:`[TEST] SH-012: Disaster Recovery Readiness
[INFO] Primary: prod-north.bank.local | DR: dr-south.bank.local
[PASS] DR site state: STANDBY_READY
[PASS] RPO lag: 45s (target <300s)
[PASS] Last failover test: 380s RTO (target <600s)
[INFO] Last DR test: 2026-02-20 02:00 IST
[PASS] Latest backup: VERIFIED, 6h old
[PASS] Cross-region sync: 100%
[PASS] DR runbook: all steps validated
[INFO] Replication mode: async | Backup retention: 30 days
[INFO] DR readiness score: 100%
───────────────────────────────────
SH-012: DR Readiness — 6 passed, 0 failed`},
];

export default function SystemHealthLab() {
  const [tab, setTab] = useState('ApplicationHealth');
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
        <h1 style={sty.h1}>System Health Testing Lab</h1>
        <div style={sty.sub}>Application Health, Database, Infrastructure, Middleware, Integration & E2E Health — {totalAll} Scenarios</div>
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

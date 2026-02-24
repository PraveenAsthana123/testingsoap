import React, { useState, useCallback, useRef } from 'react';

/* ═══════════════════════════════════════════════════
   Performance & Load Testing Dashboard
   ═══════════════════════════════════════════════════ */

const API_BASE = 'http://localhost:3001';

const TABS = [
  { id: 'loadTesting', label: 'Load Testing' },
  { id: 'perfMetrics', label: 'Performance Metrics' },
  { id: 'testRunner', label: 'Test Runner' },
  { id: 'benchmarks', label: 'Benchmarks' },
  { id: 'toolsGuide', label: 'Tools Guide' },
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
  info: '#2563eb',
  infoLight: '#dbeafe',
  orange: '#ea580c',
  orangeLight: '#fff7ed',
};

/* ─── Endpoint presets ─── */
const ENDPOINT_PRESETS = [
  { label: 'Dashboard Stats', method: 'GET', path: '/api/dashboard/stats' },
  { label: 'Customers', method: 'GET', path: '/api/customers' },
  { label: 'Accounts', method: 'GET', path: '/api/accounts' },
  { label: 'Transactions', method: 'GET', path: '/api/transactions' },
  { label: 'Loans', method: 'GET', path: '/api/loans' },
  { label: 'Cards', method: 'GET', path: '/api/cards' },
  { label: 'Bill Payments', method: 'GET', path: '/api/bill-payments' },
  { label: 'Test Cases', method: 'GET', path: '/api/test-cases' },
  { label: 'Test Suites', method: 'GET', path: '/api/test-suites' },
  { label: 'Defects', method: 'GET', path: '/api/defects' },
  { label: 'Schema', method: 'GET', path: '/api/schema' },
  { label: 'Audit Log', method: 'GET', path: '/api/audit-log' },
  { label: 'Operation Flow', method: 'GET', path: '/api/operation-flow' },
  { label: 'Notifications', method: 'GET', path: '/api/notifications' },
  { label: 'Sessions', method: 'GET', path: '/api/sessions' },
  { label: 'SQL Execute', method: 'POST', path: '/api/sql/execute' },
];

/* ─── Performance Metrics Checklist ─── */
const PERF_CHECKLIST = {
  api: {
    title: 'API Performance',
    icon: 'A',
    color: C.primary,
    bg: C.primaryLight,
    items: [
      'Response time < 200ms for GET endpoints',
      'Response time < 500ms for POST endpoints',
      'Response time < 1000ms for complex queries',
      'Concurrent 10 users - no degradation',
      'Concurrent 50 users - <20% degradation',
      'Error rate < 1% under load',
      'No memory leaks after 1000 requests',
      'Database query time < 100ms',
      'JSON serialization < 50ms',
      'Gzip compression working',
    ],
  },
  frontend: {
    title: 'Frontend Performance',
    icon: 'F',
    color: C.purple,
    bg: C.purpleLight,
    items: [
      'First Contentful Paint < 1.5s',
      'Largest Contentful Paint < 2.5s',
      'Time to Interactive < 3.5s',
      'Cumulative Layout Shift < 0.1',
      'Total bundle size < 500KB',
      'Images optimized (WebP, lazy load)',
      'No render-blocking resources',
      'Service worker cache active',
    ],
  },
  database: {
    title: 'Database Performance',
    icon: 'D',
    color: C.success,
    bg: C.successLight,
    items: [
      'WAL mode enabled',
      'Indexes on all query columns',
      'Query execution < 50ms for simple queries',
      'Join queries < 200ms',
      'Bulk insert < 1s for 100 records',
      'No table locks during read',
    ],
  },
};

const TOTAL_METRICS = Object.values(PERF_CHECKLIST).reduce((sum, cat) => sum + cat.items.length, 0);

/* ─── Initial Benchmark Data ─── */
const INITIAL_BENCHMARKS = [
  { endpoint: '/api/dashboard/stats', method: 'GET', avg: 45, p95: 120, throughput: '200/s', status: 'Fast' },
  { endpoint: '/api/customers', method: 'GET', avg: 32, p95: 85, throughput: '250/s', status: 'Fast' },
  { endpoint: '/api/transactions', method: 'GET', avg: 78, p95: 210, throughput: '150/s', status: 'Good' },
  { endpoint: '/api/test-cases', method: 'GET', avg: 55, p95: 145, throughput: '180/s', status: 'Good' },
  { endpoint: '/api/sql/execute', method: 'POST', avg: 120, p95: 350, throughput: '80/s', status: 'Moderate' },
  { endpoint: '/api/accounts', method: 'GET', avg: 38, p95: 95, throughput: '230/s', status: 'Fast' },
  { endpoint: '/api/defects', method: 'GET', avg: 62, p95: 175, throughput: '160/s', status: 'Good' },
  { endpoint: '/api/loans', method: 'GET', avg: 48, p95: 130, throughput: '190/s', status: 'Fast' },
  { endpoint: '/api/schema', method: 'GET', avg: 95, p95: 280, throughput: '100/s', status: 'Good' },
  { endpoint: '/api/audit-log', method: 'GET', avg: 110, p95: 320, throughput: '90/s', status: 'Moderate' },
];

/* ─── Tools Guide Data ─── */
const TOOLS = [
  {
    name: 'k6',
    org: 'Grafana',
    language: 'JavaScript',
    icon: 'k6',
    color: '#7B61FF',
    description: 'Modern load testing tool built for developer happiness. Write tests in JavaScript, run from CLI, perfect for CI/CD pipelines. Outputs metrics to InfluxDB, Prometheus, Datadog, and more.',
    install: 'brew install k6\n# or\nsnap install k6\n# or Docker\ndocker pull grafana/k6',
    sample: `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3001/api/customers');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}`,
    pros: ['JavaScript-based (developer-friendly)', 'Low resource usage', 'Built-in CI/CD support', 'Rich metrics output', 'Free and open source'],
    cons: ['No GUI (CLI only)', 'No browser-based testing', 'Limited protocol support vs JMeter'],
    bestFor: 'CI/CD pipelines, developer-driven performance testing, API load testing',
  },
  {
    name: 'Apache JMeter',
    org: 'Apache Foundation',
    language: 'Java',
    icon: 'JM',
    color: '#D22128',
    description: 'The original open source load testing tool. Feature-rich GUI, supports HTTP, JDBC, LDAP, SOAP, JMS, and more. Extensible via plugins. Industry standard for enterprise testing.',
    install: 'brew install jmeter\n# or download from\n# https://jmeter.apache.org/download_jmeter.cgi\n# Extract and run bin/jmeter.sh',
    sample: `# CLI mode (non-GUI for actual tests):
jmeter -n -t test-plan.jmx \\
  -l results.jtl \\
  -e -o report-folder/

# Thread Group config in .jmx:
# Threads: 50
# Ramp-Up: 10s
# Loop Count: 100
# HTTP Sampler: GET http://localhost:3001/api/customers`,
    pros: ['Rich GUI for test design', 'Huge protocol support', 'Plugin ecosystem', 'Distributed testing', 'Enterprise-proven'],
    cons: ['Heavy memory usage', 'GUI can be slow', 'XML-based test plans', 'Steep learning curve'],
    bestFor: 'Enterprise testing, multi-protocol testing, teams with dedicated QA engineers',
  },
  {
    name: 'Locust',
    org: 'Open Source',
    language: 'Python',
    icon: 'Lo',
    color: '#4B8A3F',
    description: 'Python-based load testing tool with a real-time web UI. Write test scenarios in Python. Supports distributed load generation across multiple machines. Great for Python teams.',
    install: 'pip install locust',
    sample: `from locust import HttpUser, task, between

class BankingUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def get_customers(self):
        self.client.get("/api/customers")

    @task(2)
    def get_transactions(self):
        self.client.get("/api/transactions")

    @task(1)
    def get_dashboard(self):
        self.client.get("/api/dashboard/stats")

# Run: locust -f locustfile.py --host=http://localhost:3001`,
    pros: ['Python-based (easy to learn)', 'Real-time web UI', 'Distributed testing built-in', 'Code-as-tests approach', 'Lightweight'],
    cons: ['Python GIL limits single-process throughput', 'Less protocol support than JMeter', 'No built-in assertions like k6'],
    bestFor: 'Python teams, quick ramp-up, distributed testing, real-time monitoring',
  },
  {
    name: 'Artillery',
    org: 'Artillery.io',
    language: 'Node.js',
    icon: 'Ar',
    color: '#1B1B1B',
    description: 'Node.js-based performance testing tool. YAML configuration for test scenarios. SaaS dashboard option available. Great for Node.js teams and microservices testing.',
    install: 'npm install -g artillery',
    sample: `# artillery-config.yml
config:
  target: "http://localhost:3001"
  phases:
    - duration: 30
      arrivalRate: 10
      name: "Warm up"
    - duration: 60
      arrivalRate: 50
      name: "Ramp up"

scenarios:
  - name: "Browse API"
    flow:
      - get:
          url: "/api/customers"
      - think: 1
      - get:
          url: "/api/transactions"

# Run: artillery run artillery-config.yml`,
    pros: ['YAML config (no code needed)', 'Built-in Node.js', 'SaaS dashboard option', 'Scenario-based testing', 'Good documentation'],
    cons: ['SaaS features are paid', 'Limited customization vs code-based tools', 'Smaller community than k6/JMeter'],
    bestFor: 'Node.js teams, YAML-first workflows, quick scenario testing',
  },
  {
    name: 'Gatling',
    org: 'Gatling Corp',
    language: 'Scala / Java',
    icon: 'Ga',
    color: '#FF6600',
    description: 'High-performance load testing tool built on Akka/Netty. Produces beautiful HTML reports. Scala DSL for test scenarios. Enterprise version available with real-time dashboards.',
    install: `# Download from https://gatling.io/open-source/
# Or use Maven/Gradle plugin:
# Maven: gatling-maven-plugin
# Gradle: io.gatling.gradle`,
    sample: `import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class BankingSimulation extends Simulation {
  val httpProtocol = http
    .baseUrl("http://localhost:3001")
    .acceptHeader("application/json")

  val scn = scenario("Banking API")
    .exec(http("Get Customers")
      .get("/api/customers")
      .check(status.is(200)))
    .pause(1)
    .exec(http("Get Transactions")
      .get("/api/transactions")
      .check(status.is(200)))

  setUp(
    scn.inject(rampUsers(100).during(30.seconds))
  ).protocols(httpProtocol)
}`,
    pros: ['Excellent HTML reports', 'High performance (Netty-based)', 'Code-as-tests (Scala DSL)', 'Maven/Gradle integration', 'Enterprise support'],
    cons: ['Scala learning curve', 'Enterprise features are paid', 'Heavier setup than CLI tools'],
    bestFor: 'JVM teams, detailed reporting needs, enterprise environments',
  },
  {
    name: 'wrk / wrk2',
    org: 'Open Source',
    language: 'C',
    icon: 'wr',
    color: '#555555',
    description: 'Ultra-lightweight HTTP benchmarking tool written in C. Uses epoll/kqueue for high concurrency with minimal threads. wrk2 adds constant-rate load generation for accurate latency measurement.',
    install: 'brew install wrk\n# or build from source:\ngit clone https://github.com/wg/wrk.git\ncd wrk && make',
    sample: `# Basic benchmark:
wrk -t4 -c100 -d30s http://localhost:3001/api/customers

# With Lua script for POST:
wrk -t2 -c50 -d30s -s post.lua http://localhost:3001/api/sql/execute

# post.lua:
# wrk.method = "POST"
# wrk.body = '{"query": "SELECT * FROM customers"}'
# wrk.headers["Content-Type"] = "application/json"

# wrk2 (constant rate):
wrk2 -t4 -c100 -d30s -R1000 http://localhost:3001/api/customers`,
    pros: ['Extremely lightweight', 'Very high throughput', 'Accurate latency histograms (wrk2)', 'Lua scripting', 'Minimal resource usage'],
    cons: ['No GUI', 'HTTP only', 'Limited reporting', 'Lua scripts for complex scenarios'],
    bestFor: 'Quick HTTP benchmarks, maximum throughput testing, CI smoke tests',
  },
  {
    name: 'Apache Bench (ab)',
    org: 'Apache Foundation',
    language: 'C',
    icon: 'ab',
    color: '#990000',
    description: 'Simple command-line HTTP benchmarking tool bundled with Apache HTTP Server. Perfect for quick, one-off benchmarks. Single-threaded but effective for basic testing.',
    install: '# Usually pre-installed with Apache:\napt install apache2-utils\n# or\nbrew install httpd',
    sample: `# 1000 requests, 50 concurrent:
ab -n 1000 -c 50 http://localhost:3001/api/customers

# With POST data:
ab -n 500 -c 20 -p post-data.json \\
   -T application/json \\
   http://localhost:3001/api/sql/execute

# With keep-alive:
ab -n 1000 -c 50 -k http://localhost:3001/api/customers`,
    pros: ['Pre-installed on most systems', 'Dead simple CLI', 'Quick results', 'No setup needed', 'Good for sanity checks'],
    cons: ['Single-threaded', 'No scripting', 'Basic metrics only', 'No distributed testing', 'HTTP/1.1 only'],
    bestFor: 'Quick sanity checks, simple HTTP benchmarks, comparing before/after changes',
  },
  {
    name: 'Vegeta',
    org: 'Open Source',
    language: 'Go',
    icon: 'Ve',
    color: '#00ADD8',
    description: 'HTTP load testing tool and library written in Go. Designed for constant request rate testing. Produces detailed latency histograms. Can be used as both CLI tool and Go library.',
    install: 'brew install vegeta\n# or\ngo install github.com/tsenart/vegeta@latest',
    sample: `# Constant rate attack:
echo "GET http://localhost:3001/api/customers" | \\
  vegeta attack -rate=100/s -duration=30s | \\
  vegeta report

# With multiple targets:
cat targets.txt | \\
  vegeta attack -rate=50/s -duration=60s | \\
  vegeta report -type=text

# Generate HTML report:
echo "GET http://localhost:3001/api/customers" | \\
  vegeta attack -rate=100/s -duration=30s | \\
  vegeta report -type=json | \\
  vegeta plot > report.html

# targets.txt:
# GET http://localhost:3001/api/customers
# GET http://localhost:3001/api/transactions
# POST http://localhost:3001/api/sql/execute
# @post-body.json`,
    pros: ['Constant rate testing', 'Go library + CLI', 'Detailed histograms', 'HTML plot output', 'Low resource usage'],
    cons: ['HTTP only', 'No GUI', 'Smaller community', 'Limited scripting'],
    bestFor: 'Constant-rate testing, Go teams, latency analysis, automated benchmarks',
  },
];

/* ─── Load Testing Types ─── */
const LOAD_TEST_TYPES = [
  {
    name: 'Load Testing',
    icon: 'L',
    color: C.primary,
    bg: C.primaryLight,
    description: 'Simulates expected user load to verify system performance under normal conditions. Gradually increases users to the expected peak.',
    example: '50 concurrent users for 5 minutes',
  },
  {
    name: 'Stress Testing',
    icon: 'S',
    color: C.danger,
    bg: C.dangerLight,
    description: 'Pushes the system beyond normal capacity to find breaking points. Determines maximum capacity and how the system recovers from failure.',
    example: '500+ concurrent users until errors appear',
  },
  {
    name: 'Spike Testing',
    icon: 'K',
    color: C.orange,
    bg: C.orangeLight,
    description: 'Tests system behavior when load suddenly spikes and then drops. Verifies the system can handle sudden traffic bursts.',
    example: 'Ramp from 10 to 500 users in 10 seconds',
  },
  {
    name: 'Soak Testing',
    icon: 'O',
    color: C.purple,
    bg: C.purpleLight,
    description: 'Runs a sustained load over an extended period to detect memory leaks, resource exhaustion, and degradation over time.',
    example: '100 users for 24 hours continuously',
  },
  {
    name: 'Volume Testing',
    icon: 'V',
    color: C.success,
    bg: C.successLight,
    description: 'Tests system behavior with large volumes of data. Checks how the database and application handle growing data sets.',
    example: 'Insert 1M records, then run standard queries',
  },
];

/* ═══════════════════════════════════════════════════
   Helper Functions
   ═══════════════════════════════════════════════════ */

function percentile(arr, p) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function median(arr) {
  return percentile(arr, 50);
}

function getStatusBadgeStyle(status) {
  const map = {
    Fast: { background: C.successLight, color: C.success, border: C.success },
    Good: { background: C.infoLight, color: C.info, border: C.info },
    Moderate: { background: C.warningLight, color: C.warning, border: C.warning },
    Slow: { background: C.dangerLight, color: C.danger, border: C.danger },
  };
  const s = map[status] || map.Moderate;
  return {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    background: s.background,
    color: s.color,
    border: `1px solid ${s.border}`,
  };
}

function classifyResponseTime(ms) {
  if (ms < 100) return 'fast';
  if (ms < 300) return 'good';
  if (ms < 500) return 'moderate';
  return 'slow';
}

function getTimeColor(ms) {
  if (ms < 200) return C.success;
  if (ms < 500) return C.warning;
  return C.danger;
}

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */

export default function PerformanceTesting() {
  const [activeTab, setActiveTab] = useState('loadTesting');

  /* ─── Load Testing State ─── */
  const [loadConfig, setLoadConfig] = useState({
    targetUrl: 'http://localhost:3001/api/customers',
    concurrentUsers: 10,
    duration: 10,
    rampUpTime: 2,
    method: 'GET',
    requestBody: '{\n  "query": "SELECT * FROM customers LIMIT 5"\n}',
  });
  const [loadRunning, setLoadRunning] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadResults, setLoadResults] = useState(null);
  const loadAbortRef = useRef(false);

  /* ─── Performance Metrics State ─── */
  const [checkedItems, setCheckedItems] = useState({});

  /* ─── Test Runner State ─── */
  const [runnerEndpoint, setRunnerEndpoint] = useState(0);
  const [runnerCount, setRunnerCount] = useState(10);
  const [runnerRunning, setRunnerRunning] = useState(false);
  const [runnerResults, setRunnerResults] = useState(null);

  /* ─── Benchmarks State ─── */
  const [benchmarks, setBenchmarks] = useState(INITIAL_BENCHMARKS);
  const [benchRunning, setBenchRunning] = useState(false);
  const [benchProgress, setBenchProgress] = useState(0);

  /* ═══════════════════════════════════════════════════
     Load Testing Logic
     ═══════════════════════════════════════════════════ */

  const runLoadTest = useCallback(async () => {
    setLoadRunning(true);
    setLoadProgress(0);
    setLoadResults(null);
    loadAbortRef.current = false;

    const { targetUrl, concurrentUsers, duration, rampUpTime, method, requestBody } = loadConfig;
    const totalDurationMs = duration * 1000;
    const rampUpMs = rampUpTime * 1000;
    const startTime = Date.now();
    const responseTimes = [];
    let successCount = 0;
    let failCount = 0;
    let totalSent = 0;

    const makeRequest = async () => {
      const reqStart = performance.now();
      try {
        const opts = { method, headers: { 'Content-Type': 'application/json' } };
        if (method === 'POST' && requestBody.trim()) {
          opts.body = requestBody;
        }
        const res = await fetch(targetUrl, opts);
        const elapsed = Math.round(performance.now() - reqStart);
        responseTimes.push(elapsed);
        totalSent++;
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        const elapsed = Math.round(performance.now() - reqStart);
        responseTimes.push(elapsed);
        totalSent++;
        failCount++;
      }
    };

    const runBatch = async (batchSize) => {
      const promises = [];
      for (let i = 0; i < batchSize; i++) {
        promises.push(makeRequest());
      }
      await Promise.all(promises);
    };

    const intervalMs = 200;
    const totalIntervals = Math.ceil(totalDurationMs / intervalMs);

    for (let i = 0; i < totalIntervals; i++) {
      if (loadAbortRef.current) break;

      const elapsed = i * intervalMs;
      const progress = Math.min(100, Math.round((elapsed / totalDurationMs) * 100));
      setLoadProgress(progress);

      let currentUsers;
      if (elapsed < rampUpMs) {
        currentUsers = Math.max(1, Math.round((elapsed / rampUpMs) * concurrentUsers));
      } else {
        currentUsers = concurrentUsers;
      }

      const batchSize = Math.max(1, Math.round(currentUsers / (1000 / intervalMs)));
      await runBatch(batchSize);
      await new Promise((r) => setTimeout(r, intervalMs));
    }

    setLoadProgress(100);

    const totalElapsed = (Date.now() - startTime) / 1000;
    const sortedTimes = [...responseTimes].sort((a, b) => a - b);

    const buckets = { '<100ms': 0, '100-300ms': 0, '300-500ms': 0, '500-1000ms': 0, '>1000ms': 0 };
    responseTimes.forEach((t) => {
      if (t < 100) buckets['<100ms']++;
      else if (t < 300) buckets['100-300ms']++;
      else if (t < 500) buckets['300-500ms']++;
      else if (t < 1000) buckets['500-1000ms']++;
      else buckets['>1000ms']++;
    });

    setLoadResults({
      totalRequests: totalSent,
      successCount,
      failCount,
      avgTime: responseTimes.length ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0,
      minTime: sortedTimes.length ? sortedTimes[0] : 0,
      maxTime: sortedTimes.length ? sortedTimes[sortedTimes.length - 1] : 0,
      throughput: totalElapsed > 0 ? (totalSent / totalElapsed).toFixed(1) : '0',
      p50: percentile(responseTimes, 50),
      p90: percentile(responseTimes, 90),
      p95: percentile(responseTimes, 95),
      buckets,
      durationSec: totalElapsed.toFixed(1),
    });

    setLoadRunning(false);
  }, [loadConfig]);

  const stopLoadTest = useCallback(() => {
    loadAbortRef.current = true;
  }, []);

  /* ═══════════════════════════════════════════════════
     Test Runner Logic
     ═══════════════════════════════════════════════════ */

  const runQuickBenchmark = useCallback(async () => {
    setRunnerRunning(true);
    setRunnerResults(null);

    const preset = ENDPOINT_PRESETS[runnerEndpoint];
    const url = `${API_BASE}${preset.path}`;
    const times = [];

    for (let i = 0; i < runnerCount; i++) {
      const start = performance.now();
      try {
        const opts = { method: preset.method, headers: { 'Content-Type': 'application/json' } };
        if (preset.method === 'POST') {
          opts.body = JSON.stringify({ query: 'SELECT 1' });
        }
        await fetch(url, opts);
        times.push(Math.round(performance.now() - start));
      } catch {
        times.push(Math.round(performance.now() - start));
      }
    }

    const sorted = [...times].sort((a, b) => a - b);
    setRunnerResults({
      times,
      avg: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: median(times),
      endpoint: preset,
    });

    setRunnerRunning(false);
  }, [runnerEndpoint, runnerCount]);

  /* ═══════════════════════════════════════════════════
     Benchmarks Logic
     ═══════════════════════════════════════════════════ */

  const runAllBenchmarks = useCallback(async () => {
    setBenchRunning(true);
    setBenchProgress(0);

    const endpoints = [
      { endpoint: '/api/dashboard/stats', method: 'GET' },
      { endpoint: '/api/customers', method: 'GET' },
      { endpoint: '/api/transactions', method: 'GET' },
      { endpoint: '/api/test-cases', method: 'GET' },
      { endpoint: '/api/sql/execute', method: 'POST' },
      { endpoint: '/api/accounts', method: 'GET' },
      { endpoint: '/api/defects', method: 'GET' },
      { endpoint: '/api/loans', method: 'GET' },
      { endpoint: '/api/schema', method: 'GET' },
      { endpoint: '/api/audit-log', method: 'GET' },
    ];

    const results = [];

    for (let i = 0; i < endpoints.length; i++) {
      const ep = endpoints[i];
      const times = [];

      for (let j = 0; j < 5; j++) {
        const start = performance.now();
        try {
          const opts = { method: ep.method, headers: { 'Content-Type': 'application/json' } };
          if (ep.method === 'POST') {
            opts.body = JSON.stringify({ query: 'SELECT 1' });
          }
          await fetch(`${API_BASE}${ep.endpoint}`, opts);
          times.push(Math.round(performance.now() - start));
        } catch {
          times.push(Math.round(performance.now() - start));
        }
      }

      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      const p95val = percentile(times, 95);
      const throughputEst = avg > 0 ? Math.round(1000 / avg) : 0;

      let status;
      if (avg < 50) status = 'Fast';
      else if (avg < 100) status = 'Good';
      else if (avg < 200) status = 'Moderate';
      else status = 'Slow';

      results.push({
        endpoint: ep.endpoint,
        method: ep.method,
        avg,
        p95: p95val,
        throughput: `${throughputEst}/s`,
        status,
      });

      setBenchProgress(Math.round(((i + 1) / endpoints.length) * 100));
    }

    setBenchmarks(results);
    setBenchRunning(false);
  }, []);

  /* ═══════════════════════════════════════════════════
     Metrics Score Calculation
     ═══════════════════════════════════════════════════ */

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const scorePercent = TOTAL_METRICS > 0 ? Math.round((checkedCount / TOTAL_METRICS) * 100) : 0;

  const getScoreColor = () => {
    if (scorePercent >= 80) return C.success;
    if (scorePercent >= 50) return C.warning;
    return C.danger;
  };

  /* ═══════════════════════════════════════════════════
     Render Helpers
     ═══════════════════════════════════════════════════ */

  const renderCard = (title, value, subtitle, color, bgColor) => (
    <div
      style={{
        background: bgColor || '#fff',
        border: `1px solid ${color}22`,
        borderRadius: 10,
        padding: '18px 22px',
        flex: '1 1 160px',
        minWidth: 160,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 4 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{subtitle}</div>}
    </div>
  );

  /* ═══════════════════════════════════════════════════
     Tab: Load Testing
     ═══════════════════════════════════════════════════ */

  const renderLoadTesting = () => (
    <div>
      {/* Explanation Section */}
      <div style={{ background: C.primaryLight, borderRadius: 10, padding: 24, marginBottom: 24, border: `1px solid ${C.primary}22` }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 18, color: C.primary }}>What is Load Testing?</h3>
        <p style={{ margin: '0 0 16px', color: C.text, lineHeight: 1.6, fontSize: 14 }}>
          Load testing evaluates system behavior under expected and peak load conditions. It measures response times,
          throughput, resource utilization, and error rates to ensure your application can handle real-world traffic.
          Load testing is critical for identifying bottlenecks before they affect users in production.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {LOAD_TEST_TYPES.map((type) => (
            <div
              key={type.name}
              style={{
                flex: '1 1 180px',
                background: '#fff',
                borderRadius: 8,
                padding: 14,
                border: `1px solid ${type.color}33`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: type.bg,
                    color: type.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {type.icon}
                </div>
                <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{type.name}</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{type.description}</p>
              <div style={{ marginTop: 8, fontSize: 11, color: type.color, fontStyle: 'italic' }}>{type.example}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      <div style={{ background: '#fff', borderRadius: 10, border: `1px solid ${C.border}`, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 16, color: C.text }}>Test Configuration</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {/* Target URL */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              Target URL
            </label>
            <input
              type="text"
              value={loadConfig.targetUrl}
              onChange={(e) => setLoadConfig({ ...loadConfig, targetUrl: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
              }}
            />
          </div>

          {/* Concurrent Users */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              Concurrent Users
            </label>
            <select
              value={loadConfig.concurrentUsers}
              onChange={(e) => setLoadConfig({ ...loadConfig, concurrentUsers: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                background: '#fff',
              }}
            >
              <option value={10}>10 Users</option>
              <option value={50}>50 Users</option>
              <option value={100}>100 Users</option>
              <option value={500}>500 Users</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              Duration (seconds)
            </label>
            <input
              type="number"
              value={loadConfig.duration}
              onChange={(e) => setLoadConfig({ ...loadConfig, duration: Math.max(1, Number(e.target.value)) })}
              min={1}
              max={300}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Ramp-up Time */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              Ramp-up Time (seconds)
            </label>
            <input
              type="number"
              value={loadConfig.rampUpTime}
              onChange={(e) => setLoadConfig({ ...loadConfig, rampUpTime: Math.max(0, Number(e.target.value)) })}
              min={0}
              max={60}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* HTTP Method */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              HTTP Method
            </label>
            <select
              value={loadConfig.method}
              onChange={(e) => setLoadConfig({ ...loadConfig, method: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                background: '#fff',
              }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
          </div>
        </div>

        {/* Request Body (POST only) */}
        {loadConfig.method === 'POST' && (
          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              Request Body (JSON)
            </label>
            <textarea
              value={loadConfig.requestBody}
              onChange={(e) => setLoadConfig({ ...loadConfig, requestBody: e.target.value })}
              rows={5}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontSize: 13,
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>
        )}

        {/* Buttons */}
        <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={runLoadTest}
            disabled={loadRunning}
            style={{
              padding: '10px 28px',
              background: loadRunning ? C.grey : C.primary,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: loadRunning ? 'not-allowed' : 'pointer',
            }}
          >
            {loadRunning ? 'Running...' : 'Run Load Test'}
          </button>
          {loadRunning && (
            <button
              onClick={stopLoadTest}
              style={{
                padding: '10px 20px',
                background: C.danger,
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {loadRunning && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Test in progress...</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.primary }}>{loadProgress}%</span>
          </div>
          <div style={{ height: 8, background: C.greyLight, borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                width: `${loadProgress}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${C.primary}, ${C.info})`,
                borderRadius: 4,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {loadResults && (
        <div>
          {/* Summary Cards */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            {renderCard('Total Requests', loadResults.totalRequests, `in ${loadResults.durationSec}s`, C.primary, C.primaryLight)}
            {renderCard('Successful', loadResults.successCount, `${loadResults.totalRequests ? ((loadResults.successCount / loadResults.totalRequests) * 100).toFixed(1) : 0}%`, C.success, C.successLight)}
            {renderCard('Failed', loadResults.failCount, `${loadResults.totalRequests ? ((loadResults.failCount / loadResults.totalRequests) * 100).toFixed(1) : 0}%`, C.danger, C.dangerLight)}
            {renderCard('Avg Time', `${loadResults.avgTime}ms`, `Min: ${loadResults.minTime}ms / Max: ${loadResults.maxTime}ms`, C.info, C.infoLight)}
            {renderCard('Throughput', `${loadResults.throughput}/s`, 'requests per second', C.purple, C.purpleLight)}
          </div>

          {/* Percentiles */}
          <div style={{ background: '#fff', borderRadius: 10, border: `1px solid ${C.border}`, padding: 20, marginBottom: 24 }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, color: C.text }}>Response Time Percentiles</h4>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { label: 'P50 (Median)', value: loadResults.p50 },
                { label: 'P90', value: loadResults.p90 },
                { label: 'P95', value: loadResults.p95 },
                { label: 'Min', value: loadResults.minTime },
                { label: 'Max', value: loadResults.maxTime },
              ].map((p) => (
                <div key={p.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: getTimeColor(p.value) }}>{p.value}ms</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{p.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Time Distribution */}
          <div style={{ background: '#fff', borderRadius: 10, border: `1px solid ${C.border}`, padding: 20 }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, color: C.text }}>Response Time Distribution</h4>
            {(() => {
              const maxBucket = Math.max(...Object.values(loadResults.buckets), 1);
              const bucketColors = {
                '<100ms': C.success,
                '100-300ms': '#2563eb',
                '300-500ms': C.warning,
                '500-1000ms': C.orange,
                '>1000ms': C.danger,
              };
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(loadResults.buckets).map(([label, count]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 90, fontSize: 12, fontWeight: 600, color: C.textMuted, textAlign: 'right', flexShrink: 0 }}>
                        {label}
                      </div>
                      <div style={{ flex: 1, height: 24, background: C.greyLight, borderRadius: 4, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${(count / maxBucket) * 100}%`,
                            height: '100%',
                            background: bucketColors[label],
                            borderRadius: 4,
                            minWidth: count > 0 ? 4 : 0,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      <div style={{ width: 60, fontSize: 12, fontWeight: 600, color: C.text, flexShrink: 0 }}>
                        {count} ({loadResults.totalRequests > 0 ? ((count / loadResults.totalRequests) * 100).toFixed(1) : 0}%)
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );

  /* ═══════════════════════════════════════════════════
     Tab: Performance Metrics
     ═══════════════════════════════════════════════════ */

  const renderPerfMetrics = () => (
    <div>
      {/* Overall Score */}
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          border: `1px solid ${C.border}`,
          padding: 24,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 18, color: C.text }}>Overall Performance Score</h3>
        <div style={{ fontSize: 48, fontWeight: 700, color: getScoreColor() }}>
          {checkedCount}/{TOTAL_METRICS}
        </div>
        <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 16 }}>{scorePercent}% criteria met</div>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ height: 12, background: C.greyLight, borderRadius: 6, overflow: 'hidden' }}>
            <div
              style={{
                width: `${scorePercent}%`,
                height: '100%',
                background: getScoreColor(),
                borderRadius: 6,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: C.textMuted }}>
            <span>0%</span>
            <span style={{ color: C.danger }}>Poor (&lt;50%)</span>
            <span style={{ color: C.warning }}>Fair (50-79%)</span>
            <span style={{ color: C.success }}>Good (80%+)</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Checklists */}
      {Object.entries(PERF_CHECKLIST).map(([key, category]) => (
        <div
          key={key}
          style={{
            background: '#fff',
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: category.bg,
                color: category.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {category.icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, color: C.text }}>{category.title}</h3>
              <div style={{ fontSize: 12, color: C.textMuted }}>
                {category.items.filter((_, i) => checkedItems[`${key}-${i}`]).length}/{category.items.length} items passed
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {category.items.map((item, i) => {
              const itemKey = `${key}-${i}`;
              const isChecked = !!checkedItems[itemKey];
              return (
                <label
                  key={itemKey}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    background: isChecked ? category.bg : C.greyLight,
                    borderRadius: 6,
                    cursor: 'pointer',
                    border: `1px solid ${isChecked ? category.color + '44' : 'transparent'}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      setCheckedItems((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }))
                    }
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: category.color }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      color: isChecked ? category.color : C.text,
                      fontWeight: isChecked ? 600 : 400,
                      textDecoration: isChecked ? 'line-through' : 'none',
                    }}
                  >
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  /* ═══════════════════════════════════════════════════
     Tab: Test Runner
     ═══════════════════════════════════════════════════ */

  const renderTestRunner = () => (
    <div>
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          border: `1px solid ${C.border}`,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 16, color: C.text }}>Quick API Benchmark</h3>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>
          Select an endpoint and run sequential requests to measure response times. Each request is executed one after
          another to get accurate individual timings.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 20 }}>
          {/* Endpoint Selector */}
          <div style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              Endpoint
            </label>
            <select
              value={runnerEndpoint}
              onChange={(e) => setRunnerEndpoint(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                background: '#fff',
              }}
            >
              {ENDPOINT_PRESETS.map((ep, i) => (
                <option key={i} value={i}>
                  {ep.method} {ep.path} - {ep.label}
                </option>
              ))}
            </select>
          </div>

          {/* Request Count */}
          <div style={{ flex: '0 0 150px' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              Number of Requests
            </label>
            <input
              type="number"
              value={runnerCount}
              onChange={(e) => setRunnerCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              min={1}
              max={100}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={runQuickBenchmark}
            disabled={runnerRunning}
            style={{
              padding: '10px 28px',
              background: runnerRunning ? C.grey : C.primary,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: runnerRunning ? 'not-allowed' : 'pointer',
              height: 42,
            }}
          >
            {runnerRunning ? 'Running...' : 'Run Benchmark'}
          </button>
        </div>
      </div>

      {/* Results */}
      {runnerResults && (
        <div>
          {/* Summary */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            {renderCard('Average', `${runnerResults.avg}ms`, '', getTimeColor(runnerResults.avg), '#fff')}
            {renderCard('Minimum', `${runnerResults.min}ms`, '', C.success, C.successLight)}
            {renderCard('Maximum', `${runnerResults.max}ms`, '', getTimeColor(runnerResults.max), '#fff')}
            {renderCard('Median', `${runnerResults.median}ms`, '', getTimeColor(runnerResults.median), '#fff')}
          </div>

          {/* Endpoint Info */}
          <div style={{ background: C.greyLight, borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13 }}>
            <strong>Endpoint:</strong>{' '}
            <span style={{ fontFamily: 'monospace', color: C.primary }}>
              {runnerResults.endpoint.method} {runnerResults.endpoint.path}
            </span>
            <span style={{ marginLeft: 12, color: C.textMuted }}>({runnerResults.times.length} requests)</span>
          </div>

          {/* Individual Request Times */}
          <div
            style={{
              background: '#fff',
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              padding: 20,
            }}
          >
            <h4 style={{ margin: '0 0 16px', fontSize: 15, color: C.text }}>Individual Request Times</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 400, overflowY: 'auto' }}>
              {runnerResults.times.map((time, i) => {
                const color = getTimeColor(time);
                const cls = classifyResponseTime(time);
                const maxTime = Math.max(...runnerResults.times, 1);
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '6px 0',
                    }}
                  >
                    <div style={{ width: 30, fontSize: 12, color: C.textMuted, textAlign: 'right', flexShrink: 0 }}>
                      #{i + 1}
                    </div>
                    <div style={{ flex: 1, height: 20, background: C.greyLight, borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${(time / maxTime) * 100}%`,
                          height: '100%',
                          background: color,
                          borderRadius: 4,
                          minWidth: 4,
                        }}
                      />
                    </div>
                    <div style={{ width: 70, fontSize: 13, fontWeight: 600, color, textAlign: 'right', flexShrink: 0 }}>
                      {time}ms
                    </div>
                    <div
                      style={{
                        width: 70,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        color,
                        flexShrink: 0,
                      }}
                    >
                      {cls}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ═══════════════════════════════════════════════════
     Tab: Benchmarks
     ═══════════════════════════════════════════════════ */

  const renderBenchmarks = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, color: C.text }}>API Endpoint Benchmarks</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textMuted }}>
            Performance comparison across all API endpoints. Click "Run All Benchmarks" to test each endpoint with live data.
          </p>
        </div>
        <button
          onClick={runAllBenchmarks}
          disabled={benchRunning}
          style={{
            padding: '10px 24px',
            background: benchRunning ? C.grey : C.primary,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: benchRunning ? 'not-allowed' : 'pointer',
            flexShrink: 0,
          }}
        >
          {benchRunning ? 'Running...' : 'Run All Benchmarks'}
        </button>
      </div>

      {/* Progress */}
      {benchRunning && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Testing endpoints...</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.primary }}>{benchProgress}%</span>
          </div>
          <div style={{ height: 6, background: C.greyLight, borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${benchProgress}%`,
                height: '100%',
                background: C.primary,
                borderRadius: 3,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Benchmark Table */}
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          border: `1px solid ${C.border}`,
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ background: C.greyLight }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}` }}>
                  Endpoint
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}`, width: 70 }}>
                  Method
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}`, width: 90 }}>
                  Avg (ms)
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}`, width: 90 }}>
                  P95 (ms)
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}`, width: 100 }}>
                  Throughput
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}`, width: 100 }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: `1px solid ${C.border}`,
                    background: i % 2 === 0 ? '#fff' : '#fafbfc',
                  }}
                >
                  <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: 12, color: C.text }}>
                    {row.endpoint}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        background: row.method === 'GET' ? '#e8f0fe' : '#d1fae5',
                        color: row.method === 'GET' ? '#1a73e8' : '#0d9488',
                      }}
                    >
                      {row.method}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'right', fontWeight: 600, color: getTimeColor(row.avg) }}>
                    {row.avg}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'right', fontWeight: 600, color: getTimeColor(row.p95) }}>
                    {row.p95}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12 }}>
                    {row.throughput}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'center' }}>
                    <span style={getStatusBadgeStyle(row.status)}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Fast', desc: '< 50ms avg', status: 'Fast' },
          { label: 'Good', desc: '50-100ms avg', status: 'Good' },
          { label: 'Moderate', desc: '100-200ms avg', status: 'Moderate' },
          { label: 'Slow', desc: '> 200ms avg', status: 'Slow' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={getStatusBadgeStyle(item.status)}>{item.label}</span>
            <span style={{ fontSize: 12, color: C.textMuted }}>{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════
     Tab: Tools Guide
     ═══════════════════════════════════════════════════ */

  const renderToolsGuide = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 18, color: C.text }}>Open Source Performance Testing Tools</h3>
        <p style={{ margin: 0, fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>
          Comprehensive guide to the most popular open source tools for load testing, performance benchmarking,
          and stress testing. Each tool has different strengths -- choose based on your team's language, CI/CD needs, and testing goals.
        </p>
      </div>

      {/* Quick Comparison Table */}
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          border: `1px solid ${C.border}`,
          overflow: 'hidden',
          marginBottom: 24,
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.greyLight }}>
          <h4 style={{ margin: 0, fontSize: 14, color: C.text }}>Quick Comparison</h4>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#fafbfc' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}` }}>Tool</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}` }}>Language</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}` }}>GUI</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}` }}>CI/CD</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}` }}>Distributed</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}` }}>Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tool: 'k6', lang: 'JavaScript', gui: 'No', cicd: 'Yes', dist: 'Yes (Cloud)', best: 'CI/CD pipelines' },
                { tool: 'JMeter', lang: 'Java', gui: 'Yes', cicd: 'Yes', dist: 'Yes', best: 'Enterprise, multi-protocol' },
                { tool: 'Locust', lang: 'Python', gui: 'Web UI', cicd: 'Yes', dist: 'Yes', best: 'Python teams' },
                { tool: 'Artillery', lang: 'Node.js', gui: 'No', cicd: 'Yes', dist: 'No', best: 'YAML config, Node.js' },
                { tool: 'Gatling', lang: 'Scala', gui: 'No', cicd: 'Yes', dist: 'Yes (Ent.)', best: 'Detailed reports' },
                { tool: 'wrk', lang: 'C', gui: 'No', cicd: 'Yes', dist: 'No', best: 'Quick HTTP benchmarks' },
                { tool: 'ab', lang: 'C', gui: 'No', cicd: 'Yes', dist: 'No', best: 'Sanity checks' },
                { tool: 'Vegeta', lang: 'Go', gui: 'No', cicd: 'Yes', dist: 'No', best: 'Constant-rate testing' },
              ].map((row, i) => (
                <tr key={row.tool} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                  <td style={{ padding: '9px 14px', fontWeight: 600, color: C.text }}>{row.tool}</td>
                  <td style={{ padding: '9px 14px', textAlign: 'center', color: C.textMuted }}>{row.lang}</td>
                  <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                    <span style={{ color: row.gui === 'No' ? C.textMuted : C.success, fontWeight: 600 }}>{row.gui}</span>
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                    <span style={{ color: C.success, fontWeight: 600 }}>{row.cicd}</span>
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                    <span style={{ color: row.dist.startsWith('Yes') ? C.success : C.textMuted, fontWeight: 600 }}>{row.dist}</span>
                  </td>
                  <td style={{ padding: '9px 14px', color: C.textMuted }}>{row.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tool Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {TOOLS.map((tool) => (
          <div
            key={tool.name}
            style={{
              background: '#fff',
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 24px',
                borderBottom: `1px solid ${C.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: tool.color + '18',
                  color: tool.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {tool.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h4 style={{ margin: 0, fontSize: 16, color: C.text }}>{tool.name}</h4>
                  <span style={{ fontSize: 11, color: C.textMuted, background: C.greyLight, padding: '2px 8px', borderRadius: 4 }}>
                    {tool.org}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: tool.color,
                      background: tool.color + '12',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontWeight: 600,
                    }}
                  >
                    {tool.language}
                  </span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>
                  {tool.description}
                </p>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Install */}
                <div>
                  <h5 style={{ margin: '0 0 8px', fontSize: 13, color: C.text, fontWeight: 600 }}>Installation</h5>
                  <pre
                    style={{
                      background: '#1e293b',
                      color: '#e2e8f0',
                      padding: 14,
                      borderRadius: 6,
                      fontSize: 12,
                      lineHeight: 1.6,
                      overflow: 'auto',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {tool.install}
                  </pre>
                </div>

                {/* Sample */}
                <div>
                  <h5 style={{ margin: '0 0 8px', fontSize: 13, color: C.text, fontWeight: 600 }}>Sample Usage</h5>
                  <pre
                    style={{
                      background: '#1e293b',
                      color: '#e2e8f0',
                      padding: 14,
                      borderRadius: 6,
                      fontSize: 11,
                      lineHeight: 1.5,
                      overflow: 'auto',
                      margin: 0,
                      maxHeight: 260,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {tool.sample}
                  </pre>
                </div>
              </div>

              {/* Pros / Cons / Best For */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
                <div>
                  <h5 style={{ margin: '0 0 8px', fontSize: 12, color: C.success, fontWeight: 600 }}>Pros</h5>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: C.text, lineHeight: 1.8 }}>
                    {tool.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 style={{ margin: '0 0 8px', fontSize: 12, color: C.danger, fontWeight: 600 }}>Cons</h5>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: C.text, lineHeight: 1.8 }}>
                    {tool.cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 style={{ margin: '0 0 8px', fontSize: 12, color: C.primary, fontWeight: 600 }}>Best For</h5>
                  <p style={{ margin: 0, fontSize: 12, color: C.text, lineHeight: 1.6 }}>{tool.bestFor}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════
     Tab Router
     ═══════════════════════════════════════════════════ */

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'loadTesting':
        return renderLoadTesting();
      case 'perfMetrics':
        return renderPerfMetrics();
      case 'testRunner':
        return renderTestRunner();
      case 'benchmarks':
        return renderBenchmarks();
      case 'toolsGuide':
        return renderToolsGuide();
      default:
        return null;
    }
  };

  /* ═══════════════════════════════════════════════════
     Main Render
     ═══════════════════════════════════════════════════ */

  return (
    <div style={{ padding: 24, background: '#ffffff', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 700, color: C.text }}>
          Performance & Load Testing
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: C.textMuted }}>
          Configure, execute, and analyze performance tests against your API endpoints.
          Measure response times, throughput, and identify bottlenecks.
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          marginBottom: 24,
          borderBottom: `2px solid ${C.border}`,
          overflowX: 'auto',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 22px',
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? C.primary : C.textMuted,
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${isActive ? C.primary : 'transparent'}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                marginBottom: -2,
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {renderActiveTab()}
    </div>
  );
}

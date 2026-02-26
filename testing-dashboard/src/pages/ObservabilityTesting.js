import React, { useState, useCallback, useRef, useEffect } from 'react';

/* ================================================================
   Banking QA - Observability Testing Dashboard
   Tabs: Application Monitoring | Log Management | Distributed Tracing
         | Alerting & Incident | Infrastructure Monitoring | SRE & SLA
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
  purple: '#9b59b6',
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

const priorityColor = (p) => {
  if (p === 'P0') return C.critical;
  if (p === 'P1') return C.highOrange;
  if (p === 'P2') return C.yellow;
  return C.textMuted;
};

const statusColor = (s) => {
  if (s === 'passed') return C.green;
  if (s === 'failed') return C.red;
  return C.textDim;
};

const statusLabel = (s) => {
  if (s === 'passed') return 'PASSED';
  if (s === 'failed') return 'FAILED';
  return 'NOT RUN';
};

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
    flexWrap: 'wrap',
  },
  tab: (active) => ({
    padding: '12px 22px',
    cursor: 'pointer',
    fontWeight: active ? 700 : 500,
    fontSize: 14,
    color: active ? C.bgGradientFrom : C.textMuted,
    background: active ? C.tabActive : 'transparent',
    borderRadius: '8px 8px 0 0',
    border: 'none',
    borderBottom: active ? `3px solid ${C.tabActive}` : '3px solid transparent',
    transition: 'all 0.25s ease',
    letterSpacing: 0.5,
    whiteSpace: 'nowrap',
  }),
  splitPanel: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
  },
  leftPanel: {
    flex: '0 0 42%',
    maxWidth: '42%',
    maxHeight: 'calc(100vh - 300px)',
    overflowY: 'auto',
    paddingRight: 10,
  },
  rightPanel: {
    flex: '0 0 58%',
    maxWidth: '58%',
    maxHeight: 'calc(100vh - 300px)',
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
    border: active ? `2px solid ${C.accent}` : '2px solid transparent',
    flexShrink: 0,
    transition: 'all 0.3s ease',
    boxShadow: active ? `0 0 8px ${C.accent}66` : 'none',
  }),
  stepText: (active, done) => ({
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    color: done ? C.accent : active ? C.text : C.textDim,
  }),
  summaryRow: {
    display: 'flex',
    gap: 16,
    marginTop: 12,
    marginBottom: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  summaryBox: (color) => ({
    background: `${color}18`,
    border: `1px solid ${color}44`,
    borderRadius: 8,
    padding: '8px 18px',
    textAlign: 'center',
    minWidth: 100,
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
    background: priorityColor(level),
    boxShadow: `0 0 8px ${priorityColor(level)}44`,
    letterSpacing: 0.4,
  }),
  activeScenario: {
    background: C.card,
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
  divider: {
    height: 1,
    background: C.border,
    margin: '14px 0',
  },
  statusBadge: (s) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 700,
    color: s === 'not_run' ? C.textDim : '#000',
    background: statusColor(s),
    letterSpacing: 0.3,
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
};

/* ================================================================
   HELPER UTILITIES
   ================================================================ */
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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
   SCENARIOS DATA
   ================================================================ */

/* ─── TAB 1: Application Monitoring (12 scenarios) ─── */
const APP_MONITORING_SCENARIOS = [
  {
    id: 'OBS-APM-001',
    name: 'APM Dashboard Verification for Core Banking',
    priority: 'P0',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Navigate to APM dashboard (Datadog/New Relic/Dynatrace)',
      'Verify core banking services are instrumented and reporting',
      'Check service map shows all microservice dependencies',
      'Validate real-time metrics (throughput, latency, errors) are populating',
      'Confirm dashboard auto-refresh interval is set to 30s or less',
    ],
    testData: {
      apmTool: 'Datadog APM',
      services: ['core-banking-api', 'payment-gateway', 'account-service', 'auth-service'],
      refreshInterval: '30s',
      retentionDays: 15,
    },
    expected: 'All core banking services visible on APM dashboard with real-time metrics. Service map shows correct dependency graph. No stale or missing services.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-APM-002',
    name: 'Transaction Response Time Monitoring',
    priority: 'P0',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Identify critical transaction endpoints (fund transfer, balance inquiry, payments)',
      'Configure p50, p90, p99 latency monitors',
      'Set SLA thresholds: p99 < 500ms for balance, p99 < 2s for transfers',
      'Run load test and validate metrics accuracy',
      'Verify alerts fire when thresholds are breached',
    ],
    testData: {
      endpoints: ['/api/v1/transfer', '/api/v1/balance', '/api/v1/payments'],
      slaP99Transfer: '2000ms',
      slaP99Balance: '500ms',
      slaP99Payment: '1500ms',
      monitoringWindow: '5min rolling',
    },
    expected: 'Latency metrics accurately tracked per endpoint. p50/p90/p99 percentiles calculated correctly. Alerts trigger within 60s of SLA breach.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-APM-003',
    name: 'API Endpoint Latency Tracking',
    priority: 'P0',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Verify all REST API endpoints have latency instrumentation',
      'Check histogram buckets are configured (10ms, 50ms, 100ms, 500ms, 1s, 5s)',
      'Validate latency breakdown by HTTP method (GET/POST/PUT/DELETE)',
      'Confirm slow endpoint detection (>1s) generates warnings',
    ],
    testData: {
      totalEndpoints: 47,
      histogramBuckets: ['10ms', '50ms', '100ms', '500ms', '1s', '5s'],
      slowThreshold: '1000ms',
      instrumentationLib: 'OpenTelemetry',
    },
    expected: 'Every API endpoint reports latency histograms. Slow endpoints automatically flagged. Breakdown by method and status code available.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-APM-004',
    name: 'Database Query Performance Monitoring',
    priority: 'P0',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Verify database query tracing is enabled for all services',
      'Check slow query log captures queries exceeding 200ms',
      'Validate query plan analysis is available for slow queries',
      'Confirm connection pool metrics are exposed (active, idle, waiting)',
      'Verify N+1 query detection alerts are configured',
    ],
    testData: {
      dbType: 'PostgreSQL 15',
      slowQueryThreshold: '200ms',
      connectionPoolSize: 50,
      n1DetectionEnabled: true,
      queryTracingSampling: '100%',
    },
    expected: 'All database queries traced with execution time. Slow queries logged with full SQL and plan. Connection pool saturation alerts at 80% utilization.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-APM-005',
    name: 'Memory Usage and Leak Detection',
    priority: 'P1',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Configure memory usage monitors for all application pods',
      'Set baseline memory consumption per service',
      'Verify memory growth trend analysis over 24hr windows',
      'Test OOM (Out of Memory) kill detection and alerting',
    ],
    testData: {
      memoryLimit: '2Gi',
      alertThreshold: '80%',
      leakDetectionWindow: '24h',
      baselineMemory: { 'core-banking': '512Mi', 'payment-gateway': '768Mi', 'auth-service': '256Mi' },
    },
    expected: 'Memory usage tracked per pod with trend analysis. Memory leak patterns detected (steady growth >5%/hr). OOM kills generate P0 alerts within 30s.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-APM-006',
    name: 'CPU Utilization Threshold Alerts',
    priority: 'P1',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Configure CPU utilization monitors per service',
      'Set warning threshold at 70%, critical at 90%',
      'Verify sustained high CPU detection (>85% for 5 minutes)',
      'Test CPU spike correlation with request volume',
    ],
    testData: {
      warningThreshold: '70%',
      criticalThreshold: '90%',
      sustainedWindow: '5min',
      cpuLimit: '2 cores',
      throttleDetection: true,
    },
    expected: 'CPU utilization tracked in real-time per pod. Sustained high CPU triggers investigation alert. CPU throttling detected and correlated with latency increase.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-APM-007',
    name: 'Thread Pool Exhaustion Detection',
    priority: 'P1',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Expose thread pool metrics (active, queued, pool size, rejected)',
      'Configure alert for queue depth exceeding threshold',
      'Test thread pool saturation under high concurrency',
      'Verify rejected task counting and alerting',
    ],
    testData: {
      maxPoolSize: 200,
      queueCapacity: 500,
      warningQueueDepth: 100,
      criticalQueueDepth: 400,
      rejectionPolicy: 'CallerRunsPolicy',
    },
    expected: 'Thread pool metrics visible in dashboard. Queue depth warning at 100, critical at 400. Task rejections trigger P0 alert. Correlation with response time degradation shown.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-APM-008',
    name: 'JVM Heap Monitoring for Java Services',
    priority: 'P1',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Enable JMX metrics export for all Java services',
      'Monitor heap usage (young gen, old gen, metaspace)',
      'Configure GC pause time monitoring (G1GC)',
      'Set alerts for long GC pauses (>500ms) and full GC events',
    ],
    testData: {
      heapMax: '4Gi',
      gcAlgorithm: 'G1GC',
      gcPauseThreshold: '500ms',
      fullGcAlertSeverity: 'P1',
      metaspaceLimit: '512Mi',
    },
    expected: 'JVM heap breakdown visible (Eden, Survivor, Old Gen, Metaspace). GC metrics tracked (frequency, pause time, throughput). Full GC events generate alerts.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-APM-009',
    name: 'Application Error Rate Monitoring',
    priority: 'P0',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Configure error rate monitoring (5xx responses / total requests)',
      'Set baseline error rate per service (<0.1% normal)',
      'Verify error rate spike detection within 2-minute window',
      'Test error categorization by type (timeout, null pointer, DB, auth)',
      'Confirm error rate alert escalation chain',
    ],
    testData: {
      baselineErrorRate: '0.05%',
      warningThreshold: '1%',
      criticalThreshold: '5%',
      detectionWindow: '2min',
      errorCategories: ['TimeoutException', 'NullPointerException', 'SQLTransientException', 'AuthenticationException'],
    },
    expected: 'Error rate calculated per service in real-time. Spike detection within 2 minutes. Errors categorized by exception type with stack trace grouping. Alert escalation from warning to critical.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-APM-010',
    name: 'Service Dependency Health Checks',
    priority: 'P0',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Verify health check endpoints exist for all services (/health, /ready, /live)',
      'Test dependency health propagation (service A unhealthy if dependency B is down)',
      'Validate circuit breaker state monitoring',
      'Confirm health check frequency matches SLA requirements (10s intervals)',
    ],
    testData: {
      healthEndpoints: ['/health', '/ready', '/live'],
      checkInterval: '10s',
      timeout: '5s',
      dependencies: { 'core-banking': ['postgres', 'redis', 'kafka'], 'payment-gateway': ['core-banking', 'fraud-engine', 'visa-network'] },
    },
    expected: 'All services report comprehensive health status. Dependency failures propagate correctly. Circuit breaker states visible in dashboard. Stale health checks detected.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-APM-011',
    name: 'Custom Business Metric Dashboards',
    priority: 'P1',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Verify custom business metrics are emitted (transactions/sec, active users, payment volume)',
      'Check dashboard shows real-time business KPIs',
      'Validate metric aggregation intervals (1min, 5min, 1hr)',
      'Confirm business metric anomaly detection is active',
    ],
    testData: {
      businessMetrics: ['transactions_per_second', 'active_users', 'payment_volume_usd', 'account_opens_today', 'failed_logins_rate'],
      aggregationIntervals: ['1min', '5min', '1hr'],
      anomalyDetection: true,
      dashboardRefresh: '30s',
    },
    expected: 'Business metrics displayed in real-time. Historical trends available with correct aggregation. Anomalies in business metrics (e.g., 50% drop in transactions) trigger alerts.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-APM-012',
    name: 'Real-Time Transaction Throughput Monitoring',
    priority: 'P0',
    status: 'not_run',
    category: 'Application Monitoring',
    steps: [
      'Configure real-time throughput counter (transactions per second)',
      'Set up throughput comparison with historical baselines',
      'Verify throughput drop detection (>30% decrease in 5min)',
      'Test throughput ceiling alerts approaching system capacity',
    ],
    testData: {
      baselineTPS: 1200,
      peakTPS: 3500,
      dropThreshold: '30%',
      capacityCeiling: 5000,
      monitorGranularity: '10s',
    },
    expected: 'Real-time TPS displayed with 10s granularity. Throughput drops >30% from baseline generate alerts. Approaching capacity ceiling (>80% of 5000 TPS) triggers scaling recommendation.',
    actual: null,
    time: null,
  },
];

/* ─── TAB 2: Log Management (10 scenarios) ─── */
const LOG_MANAGEMENT_SCENARIOS = [
  {
    id: 'OBS-LOG-001',
    name: 'Centralized Log Aggregation (ELK/Splunk)',
    priority: 'P0',
    status: 'not_run',
    category: 'Log Management',
    steps: [
      'Verify all services ship logs to centralized platform (ELK/Splunk)',
      'Check log ingestion rate matches expected volume (>50K events/min)',
      'Validate no log data loss during peak traffic periods',
      'Confirm log pipeline health monitoring is active',
    ],
    testData: {
      platform: 'ELK Stack (Elasticsearch 8.x, Logstash, Kibana)',
      expectedVolume: '50,000 events/min',
      services: 12,
      shippers: 'Filebeat + Logstash',
      retentionHot: '7 days',
      retentionWarm: '30 days',
    },
    expected: 'All 12 microservices shipping logs to ELK. No data loss under 100K events/min load. Log pipeline metrics (lag, error rate) visible in monitoring dashboard.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-LOG-002',
    name: 'Log Format Standardization Across Microservices',
    priority: 'P0',
    status: 'not_run',
    category: 'Log Management',
    steps: [
      'Verify all services emit JSON-structured logs',
      'Check mandatory fields present: timestamp, level, service, correlation_id, message',
      'Validate timestamp format is ISO-8601 UTC across all services',
      'Confirm log schema validation rejects malformed entries',
    ],
    testData: {
      format: 'JSON',
      mandatoryFields: ['timestamp', 'level', 'service_name', 'correlation_id', 'message', 'trace_id'],
      timestampFormat: 'ISO-8601 UTC',
      schemaVersion: 'v2.1',
    },
    expected: 'All services produce JSON logs with mandatory fields. Timestamp consistency verified across services. Malformed log entries flagged and quarantined.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-LOG-003',
    name: 'Structured Logging with Correlation IDs',
    priority: 'P0',
    status: 'not_run',
    category: 'Log Management',
    steps: [
      'Generate a test transaction through multiple services',
      'Search logs using correlation_id to trace full request path',
      'Verify correlation_id propagated through HTTP headers and Kafka messages',
      'Confirm correlation_id included in error logs and stack traces',
    ],
    testData: {
      correlationHeader: 'X-Correlation-ID',
      propagationMethod: 'HTTP header + Kafka header',
      testTransactionId: 'TXN-20260226-TEST-001',
      servicesInPath: ['api-gateway', 'core-banking', 'payment-engine', 'notification-service'],
    },
    expected: 'Single correlation_id traces through all 4 services. Log search returns complete request timeline. Correlation_id present in Kafka consumer logs.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-LOG-004',
    name: 'Log Retention Policy Compliance (7yr Banking)',
    priority: 'P0',
    status: 'not_run',
    category: 'Log Management',
    steps: [
      'Verify log retention tiers: hot (7d), warm (30d), cold (7yr)',
      'Check archived logs are still searchable within SLA (cold: <30s)',
      'Validate audit logs are immutable (append-only, no deletion)',
      'Confirm retention policy automation (lifecycle management)',
    ],
    testData: {
      hotRetention: '7 days',
      warmRetention: '30 days',
      coldRetention: '7 years (2,555 days)',
      coldSearchSLA: '30 seconds',
      storageBackend: 'S3 Glacier Deep Archive',
      immutableAudit: true,
    },
    expected: 'Logs move through retention tiers automatically. 7-year-old logs retrievable within 30s. Audit logs cannot be modified or deleted. Storage costs optimized per tier.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-LOG-005',
    name: 'PII Masking in Log Entries',
    priority: 'P0',
    status: 'not_run',
    category: 'Log Management',
    steps: [
      'Search logs for unmasked PII patterns (SSN, card numbers, email, phone)',
      'Verify log masking pipeline runs before log storage',
      'Test masking patterns: SSN (***-**-1234), card (****1234), email (r***@domain.com)',
      'Confirm masking does not break log parsing or correlation',
    ],
    testData: {
      piiPatterns: ['SSN: \\d{3}-\\d{2}-\\d{4}', 'Card: \\d{4}-\\d{4}-\\d{4}-\\d{4}', 'Email: [^@]+@[^@]+'],
      maskingStage: 'Logstash filter pipeline',
      testSSN: '123-45-6789',
      expectedMasked: '***-**-6789',
      testCard: '4532-1234-5678-9012',
      expectedCardMasked: '****-****-****-9012',
    },
    expected: 'Zero unmasked PII found in stored logs. Masking applied consistently across all services. Masked logs still usable for debugging (last 4 digits preserved).',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-LOG-006',
    name: 'Log Level Configuration Per Environment',
    priority: 'P1',
    status: 'not_run',
    category: 'Log Management',
    steps: [
      'Verify production logs at INFO level (no DEBUG)',
      'Check staging allows DEBUG level per service toggle',
      'Test runtime log level change without service restart',
      'Validate log volume impact of level changes',
    ],
    testData: {
      prodLevel: 'INFO',
      stagingLevel: 'DEBUG',
      devLevel: 'TRACE',
      runtimeChangeAPI: 'POST /admin/log-level',
      volumeImpact: { INFO: '50K/min', DEBUG: '500K/min', TRACE: '2M/min' },
    },
    expected: 'Production runs at INFO, no DEBUG leaks. Runtime level change takes effect within 10s. Volume monitoring alerts if DEBUG accidentally enabled in prod.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-LOG-007',
    name: 'Error Log Alerting and Escalation',
    priority: 'P0',
    status: 'not_run',
    category: 'Log Management',
    steps: [
      'Verify ERROR and FATAL log events trigger alerts',
      'Check alert deduplication for repeated errors (same stack trace)',
      'Validate escalation: 1 error = ticket, 10 errors/min = page, 100 errors/min = P0 incident',
      'Confirm error context includes correlation_id, user_id, request details',
    ],
    testData: {
      alertThresholds: { single: 'Create ticket', burst10: 'Page on-call', burst100: 'P0 incident' },
      deduplicationWindow: '5 minutes',
      deduplicationKey: 'exception_class + first_stack_frame',
      escalationChannel: 'PagerDuty',
    },
    expected: 'Errors generate alerts within 30s. Duplicate errors grouped (not flooding). Escalation chain works: ticket > page > P0. Error context sufficient for debugging.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-LOG-008',
    name: 'Audit Trail Log Completeness',
    priority: 'P0',
    status: 'not_run',
    category: 'Log Management',
    steps: [
      'Perform all CRUD operations on customer and account entities',
      'Verify each operation generates an audit log entry',
      'Check audit log contains: who, what, when, where (IP), correlation_id',
      'Validate audit logs are tamper-proof (hash chain or WORM storage)',
    ],
    testData: {
      operations: ['CREATE customer', 'UPDATE account', 'DELETE beneficiary', 'READ credit_score (sensitive)'],
      requiredFields: ['actor_id', 'action', 'resource_type', 'resource_id', 'timestamp', 'ip_address', 'correlation_id', 'old_value', 'new_value'],
      storage: 'Append-only with SHA-256 hash chain',
    },
    expected: 'Every data mutation logged with full context. Audit trail is complete (no gaps). Hash chain integrity verified. Sensitive data reads also logged.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-LOG-009',
    name: 'Log Search and Filtering Performance',
    priority: 'P1',
    status: 'not_run',
    category: 'Log Management',
    steps: [
      'Execute full-text search across 7 days of logs (<5s SLA)',
      'Test filtered search by service + level + time range',
      'Verify regex search capability for pattern matching',
      'Benchmark search performance under concurrent user load',
    ],
    testData: {
      searchSLA: '5 seconds for 7-day range',
      dataVolume: '500M log entries',
      concurrentUsers: 10,
      indexedFields: ['service_name', 'level', 'correlation_id', 'timestamp', 'error_code'],
    },
    expected: 'Full-text search returns results in <5s for 7-day window. Filtered queries <2s. Regex search functional. Performance stable with 10 concurrent users.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-LOG-010',
    name: 'Log Volume Anomaly Detection',
    priority: 'P1',
    status: 'not_run',
    category: 'Log Management',
    steps: [
      'Establish baseline log volume per service per hour',
      'Configure anomaly detection for volume spikes (>3x baseline)',
      'Test alerting when log volume drops (potential log pipeline failure)',
      'Verify cost impact alerting for unexpected volume increases',
    ],
    testData: {
      baselineVolume: { 'core-banking': '120K/hr', 'payment-gateway': '80K/hr', 'auth-service': '200K/hr' },
      spikeThreshold: '3x baseline',
      dropThreshold: '50% below baseline',
      costPerGB: '$0.50',
    },
    expected: 'Volume anomalies detected within 15 minutes. Spike alerts include cost projection. Volume drop alerts indicate potential log pipeline failure. Auto-throttling available.',
    actual: null,
    time: null,
  },
];

/* ─── TAB 3: Distributed Tracing (10 scenarios) ─── */
const DISTRIBUTED_TRACING_SCENARIOS = [
  {
    id: 'OBS-TRC-001',
    name: 'End-to-End Transaction Tracing (Jaeger/Zipkin)',
    priority: 'P0',
    status: 'not_run',
    category: 'Distributed Tracing',
    steps: [
      'Initiate a fund transfer transaction through API gateway',
      'Verify trace captures all service spans (gateway > core-banking > payment > notification)',
      'Check span timing accuracy (start, end, duration)',
      'Validate trace visualization in Jaeger/Zipkin UI',
      'Confirm trace data includes HTTP status, DB queries, Kafka publishes',
    ],
    testData: {
      tracingBackend: 'Jaeger',
      protocol: 'OpenTelemetry (OTLP/gRPC)',
      testTransaction: 'Fund Transfer $500 from ACC-001 to ACC-002',
      expectedSpans: 8,
      servicesInTrace: ['api-gateway', 'auth-service', 'core-banking', 'payment-engine', 'fraud-check', 'notification-service'],
    },
    expected: 'Complete trace with 8 spans across 6 services. Each span shows timing, status, and metadata. Trace waterfall view correctly visualizes the transaction flow.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-TRC-002',
    name: 'Cross-Service Correlation ID Propagation',
    priority: 'P0',
    status: 'not_run',
    category: 'Distributed Tracing',
    steps: [
      'Send request with W3C traceparent header to API gateway',
      'Verify trace context propagated to all downstream services',
      'Check Kafka message headers contain trace context',
      'Validate async job processing preserves trace context',
    ],
    testData: {
      propagationStandard: 'W3C Trace Context',
      headerName: 'traceparent',
      asyncTransport: 'Kafka headers',
      testTraceId: '0af7651916cd43dd8448eb211c80319c',
    },
    expected: 'Same trace_id appears in all service spans. Kafka consumers create child spans linked to parent. Async job processing maintains trace lineage.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-TRC-003',
    name: 'Trace Sampling Rate Configuration',
    priority: 'P1',
    status: 'not_run',
    category: 'Distributed Tracing',
    steps: [
      'Verify production sampling rate is configured (10% head-based)',
      'Test tail-based sampling captures all error traces (100%)',
      'Validate high-value transaction traces always captured',
      'Check sampling rate impact on trace storage costs',
    ],
    testData: {
      headBasedRate: '10%',
      tailBasedErrorRate: '100%',
      highValueThreshold: '$10,000',
      highValueSampling: '100%',
      estimatedStorage: '50GB/day at 10%',
    },
    expected: '10% random sampling in production. All errors traced regardless of sampling. Transactions >$10K always traced. Storage costs within budget.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-TRC-004',
    name: 'Slow Transaction Root Cause Analysis',
    priority: 'P0',
    status: 'not_run',
    category: 'Distributed Tracing',
    steps: [
      'Identify transactions exceeding p99 latency threshold',
      'Open trace for a slow transaction in UI',
      'Verify bottleneck span is clearly identifiable (longest duration)',
      'Check span annotations include DB query text, HTTP details',
      'Validate trace comparison between slow and normal transactions',
    ],
    testData: {
      slowThreshold: 'p99 latency (>2s)',
      exampleSlowTrace: 'Fund Transfer - 4.2s total (DB query in payment-engine: 3.8s)',
      normalTrace: 'Fund Transfer - 350ms total',
      rootCause: 'Missing index on payment_transactions.account_id',
    },
    expected: 'Slow traces easily filterable. Bottleneck span highlighted in waterfall view. DB query causing slowness visible with execution plan hint. Side-by-side comparison available.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-TRC-005',
    name: 'Failed Transaction Trace Investigation',
    priority: 'P0',
    status: 'not_run',
    category: 'Distributed Tracing',
    steps: [
      'Trigger a transaction that fails mid-flow (e.g., insufficient funds)',
      'Verify error trace captures the failure point and error details',
      'Check error propagation through parent spans',
      'Validate error trace includes stack trace in span events',
    ],
    testData: {
      failureScenario: 'Insufficient funds during transfer',
      expectedErrorSpan: 'core-banking.debit_account',
      errorCode: 'INSUFFICIENT_FUNDS',
      httpStatus: 422,
    },
    expected: 'Failed span marked with error status. Error message and code in span attributes. Parent spans show error propagation. Stack trace available in span events.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-TRC-006',
    name: 'Database Call Tracing Within Transactions',
    priority: 'P1',
    status: 'not_run',
    category: 'Distributed Tracing',
    steps: [
      'Verify database calls appear as child spans in traces',
      'Check DB span includes: query type (SELECT/INSERT/UPDATE), table name, duration',
      'Validate connection acquisition time tracked separately',
      'Confirm prepared statement vs dynamic query distinction',
    ],
    testData: {
      dbInstrumentation: 'OpenTelemetry JDBC instrumentation',
      trackedAttributes: ['db.system', 'db.statement', 'db.operation', 'db.sql.table'],
      connectionPoolTracing: true,
    },
    expected: 'Each DB call creates a span with query details. Connection wait time visible. N+1 patterns detectable from trace (many sequential DB spans). Query timing accurate.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-TRC-007',
    name: 'External API Call Tracing',
    priority: 'P1',
    status: 'not_run',
    category: 'Distributed Tracing',
    steps: [
      'Verify outbound HTTP calls to external APIs create spans',
      'Check span includes: URL, method, status code, response time',
      'Validate timeout and retry attempts visible in trace',
      'Confirm sensitive data (API keys) not included in span attributes',
    ],
    testData: {
      externalAPIs: ['Visa Network', 'SWIFT', 'Credit Bureau', 'KYC Provider'],
      trackedAttributes: ['http.url', 'http.method', 'http.status_code', 'http.response_content_length'],
      sensitiveRedaction: ['Authorization header', 'API key parameters'],
    },
    expected: 'All external API calls traced with timing. Retries visible as separate spans. Timeouts show clear duration. No sensitive credentials in trace data.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-TRC-008',
    name: 'Message Queue Tracing (Kafka/RabbitMQ)',
    priority: 'P1',
    status: 'not_run',
    category: 'Distributed Tracing',
    steps: [
      'Verify Kafka producer creates a span with topic and partition',
      'Check consumer span linked to producer span (parent-child)',
      'Validate consumer lag visible in trace metadata',
      'Test dead-letter queue (DLQ) processing maintains trace context',
    ],
    testData: {
      messageBroker: 'Apache Kafka 3.x',
      topics: ['payment-events', 'notification-events', 'audit-events'],
      tracePropagation: 'Kafka headers (traceparent)',
      dlqTopic: 'payment-events-dlq',
    },
    expected: 'Producer and consumer spans linked correctly. Message processing time visible (produce-to-consume latency). DLQ messages retain original trace_id. Consumer group lag in span.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-TRC-009',
    name: 'Trace Data Retention and Storage',
    priority: 'P2',
    status: 'not_run',
    category: 'Distributed Tracing',
    steps: [
      'Verify trace retention policy (hot: 7 days, cold: 30 days)',
      'Check trace data storage consumption and growth rate',
      'Validate old traces are queryable from cold storage',
      'Confirm trace compaction/rollup for long-term storage',
    ],
    testData: {
      hotRetention: '7 days',
      coldRetention: '30 days',
      dailyStorage: '15GB',
      storageBackend: 'Elasticsearch (hot) + S3 (cold)',
      compressionRatio: '5:1',
    },
    expected: 'Traces available for 7 days in hot storage (<1s query). Cold storage traces retrievable in <10s. Storage growth predictable. Old traces aggregated into service-level metrics.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-TRC-010',
    name: 'Trace-Based Alerting for SLA Violations',
    priority: 'P0',
    status: 'not_run',
    category: 'Distributed Tracing',
    steps: [
      'Configure trace-based alerts for SLA violation patterns',
      'Test alert triggers when p99 latency exceeds SLA for specific endpoints',
      'Verify alert includes trace_id link for investigation',
      'Validate alert suppression during maintenance windows',
    ],
    testData: {
      slaEndpoints: {
        '/api/v1/transfer': '2s p99',
        '/api/v1/balance': '500ms p99',
        '/api/v1/login': '1s p99',
      },
      alertWindow: '5min rolling',
      violationThreshold: '3 breaches in 5min',
      maintenanceWindow: 'Sundays 02:00-06:00 UTC',
    },
    expected: 'SLA violation alerts fire within 5 minutes. Alert contains trace_id for root cause investigation. Maintenance windows suppress alerts correctly. False positive rate <5%.',
    actual: null,
    time: null,
  },
];

/* ─── TAB 4: Alerting & Incident (10 scenarios) ─── */
const ALERTING_INCIDENT_SCENARIOS = [
  {
    id: 'OBS-ALT-001',
    name: 'Alert Threshold Configuration for Banking SLAs',
    priority: 'P0',
    status: 'not_run',
    category: 'Alerting & Incident',
    steps: [
      'Review SLA definitions for all critical banking services',
      'Configure alert thresholds aligned with SLA targets',
      'Test threshold breach detection for each SLA metric',
      'Verify alert metadata includes SLA reference and impact assessment',
    ],
    testData: {
      slaDefinitions: {
        availability: '99.99% (52.6 min downtime/year)',
        transferLatency: '<2s p99',
        errorRate: '<0.1%',
        dataConsistency: 'Zero data loss',
      },
      alertLeadTime: '5 minutes before SLA breach',
    },
    expected: 'Alerts fire before SLA breach (early warning). Each alert references specific SLA metric. Impact assessment shows affected customers/transactions. Thresholds reviewed quarterly.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-ALT-002',
    name: 'PagerDuty/OpsGenie Integration Testing',
    priority: 'P0',
    status: 'not_run',
    category: 'Alerting & Incident',
    steps: [
      'Trigger test alert from monitoring system',
      'Verify PagerDuty/OpsGenie receives alert within 30s',
      'Check alert payload includes all required fields',
      'Test acknowledgment sync back to monitoring system',
      'Validate auto-resolve when condition clears',
    ],
    testData: {
      integrationPlatform: 'PagerDuty',
      webhookEndpoint: 'https://events.pagerduty.com/v2/enqueue',
      requiredFields: ['severity', 'summary', 'source', 'component', 'group', 'custom_details'],
      ackSyncEnabled: true,
    },
    expected: 'Alert reaches PagerDuty within 30s. Payload has severity, component, runbook link. Ack in PagerDuty reflects in monitoring tool. Auto-resolve works when metric recovers.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-ALT-003',
    name: 'Alert Escalation Policy Verification',
    priority: 'P0',
    status: 'not_run',
    category: 'Alerting & Incident',
    steps: [
      'Trigger a P0 alert and do not acknowledge',
      'Verify Level 1 escalation after 5 minutes (on-call engineer)',
      'Verify Level 2 escalation after 15 minutes (team lead)',
      'Verify Level 3 escalation after 30 minutes (VP Engineering)',
      'Confirm escalation path differs by severity (P0 vs P1 vs P2)',
    ],
    testData: {
      escalationPolicy: {
        P0: { L1: '5min', L2: '15min', L3: '30min' },
        P1: { L1: '15min', L2: '45min', L3: '2hr' },
        P2: { L1: '1hr', L2: '4hr', L3: 'Next business day' },
      },
      onCallSchedule: 'Follow-the-sun (US/EU/APAC)',
    },
    expected: 'Escalation follows defined policy per severity. Each level notified via correct channel. On-call schedule respected. Escalation audit trail maintained.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-ALT-004',
    name: 'Alert Fatigue Reduction (Dedup, Grouping)',
    priority: 'P1',
    status: 'not_run',
    category: 'Alerting & Incident',
    steps: [
      'Trigger 50 identical alerts within 1 minute',
      'Verify alerts are deduplicated into a single incident',
      'Test related alert grouping (same service, different metrics)',
      'Check alert suppression during known maintenance',
    ],
    testData: {
      deduplicationWindow: '5 minutes',
      deduplicationKey: 'service + alert_name + severity',
      groupingRules: 'Same service within 10min window',
      suppressionSchedule: 'Maintenance calendar integration',
    },
    expected: '50 duplicate alerts consolidated into 1 incident. Related alerts grouped (e.g., high CPU + high latency on same service). Maintenance suppression prevents false pages.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-ALT-005',
    name: 'Incident Response Runbook Automation',
    priority: 'P1',
    status: 'not_run',
    category: 'Alerting & Incident',
    steps: [
      'Trigger an alert that has an associated runbook',
      'Verify runbook link is included in alert notification',
      'Test automated runbook execution (e.g., restart service, scale pods)',
      'Validate runbook execution logs are captured for audit',
    ],
    testData: {
      runbookPlatform: 'Confluence + PagerDuty Automation',
      automatedActions: ['Restart unhealthy pod', 'Scale to +2 replicas', 'Enable circuit breaker', 'Failover to DR'],
      approvalRequired: { 'Restart pod': false, 'Scale up': false, 'Failover DR': true },
    },
    expected: 'Runbook link in every P0/P1 alert. Automated actions execute within 60s. Actions requiring approval wait for on-call confirmation. All executions logged.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-ALT-006',
    name: 'Mean Time To Detect (MTTD) Measurement',
    priority: 'P1',
    status: 'not_run',
    category: 'Alerting & Incident',
    steps: [
      'Inject a known failure at a recorded timestamp',
      'Measure time until first alert fires',
      'Calculate MTTD across multiple incident types',
      'Verify MTTD trending dashboard shows improvement over time',
    ],
    testData: {
      targetMTTD: { P0: '<2 minutes', P1: '<5 minutes', P2: '<15 minutes' },
      injectionTypes: ['Service crash', 'Latency spike', 'Error rate increase', 'Disk full'],
      measurementMethod: 'injection_timestamp - alert_timestamp',
    },
    expected: 'MTTD for P0 incidents <2 minutes. MTTD tracked per incident category. Trending shows MTTD improvement quarter-over-quarter. Outliers investigated.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-ALT-007',
    name: 'Mean Time To Resolve (MTTR) Tracking',
    priority: 'P1',
    status: 'not_run',
    category: 'Alerting & Incident',
    steps: [
      'Track incident lifecycle: detect > acknowledge > investigate > resolve',
      'Verify MTTR calculation includes all phases',
      'Check MTTR dashboard breakdown by team, severity, service',
      'Validate MTTR targets: P0 <30min, P1 <2hr, P2 <24hr',
    ],
    testData: {
      mttrTargets: { P0: '30 minutes', P1: '2 hours', P2: '24 hours' },
      phases: ['Detection', 'Acknowledgment', 'Investigation', 'Mitigation', 'Resolution'],
      trackingTool: 'PagerDuty Analytics',
    },
    expected: 'MTTR calculated per incident with phase breakdown. Dashboard shows MTTR by severity, team, service. Trending over time visible. SLA compliance percentage calculated.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-ALT-008',
    name: 'Post-Incident Review Documentation',
    priority: 'P2',
    status: 'not_run',
    category: 'Alerting & Incident',
    steps: [
      'Verify post-incident review template is used for all P0/P1 incidents',
      'Check timeline accuracy against monitoring data',
      'Validate action items are tracked to completion',
      'Confirm blameless review culture enforced (no individual blame)',
    ],
    testData: {
      template: 'Blameless Post-Incident Review',
      sections: ['Timeline', 'Impact', 'Root Cause', 'Contributing Factors', 'Action Items', 'Lessons Learned'],
      actionItemTracking: 'Jira tickets linked to incident',
      reviewDeadline: '5 business days after incident',
    },
    expected: 'All P0/P1 incidents have PIR within 5 days. Timeline validated against monitoring data. Action items tracked in Jira with owners and deadlines. No blame language used.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-ALT-009',
    name: 'Alert Channel Routing (Email/SMS/Slack)',
    priority: 'P1',
    status: 'not_run',
    category: 'Alerting & Incident',
    steps: [
      'Trigger P0 alert and verify SMS + phone call + Slack notification',
      'Trigger P1 alert and verify Slack + email notification',
      'Trigger P2 alert and verify email-only notification',
      'Test channel fallback when primary channel fails',
    ],
    testData: {
      channelMatrix: {
        P0: ['Phone call', 'SMS', 'Slack #incidents', 'Email'],
        P1: ['Slack #incidents', 'Email', 'PagerDuty'],
        P2: ['Email', 'Slack #alerts'],
      },
      fallbackOrder: 'Phone > SMS > Slack > Email',
    },
    expected: 'P0 alerts reach responder via phone within 1 minute. Channel routing matches severity matrix. Fallback works when primary channel unavailable. Delivery confirmation logged.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-ALT-010',
    name: 'Business-Hours vs 24/7 Alert Policies',
    priority: 'P2',
    status: 'not_run',
    category: 'Alerting & Incident',
    steps: [
      'Verify P0/P1 alerts are 24/7 regardless of business hours',
      'Check P2 alerts only page during business hours (9AM-6PM)',
      'Test timezone handling for follow-the-sun on-call',
      'Validate holiday calendar integration for alert routing',
    ],
    testData: {
      businessHours: '09:00-18:00 local timezone',
      alwaysOn: ['P0', 'P1'],
      businessHoursOnly: ['P2'],
      followTheSun: ['US-East (09-17 EST)', 'EU (09-17 CET)', 'APAC (09-17 IST)'],
      holidayCalendar: 'Company + regional holidays',
    },
    expected: 'P0/P1 alerts reach on-call 24/7. P2 alerts deferred to next business day if after hours. Timezone-aware routing to correct on-call. Holidays handled as non-business days.',
    actual: null,
    time: null,
  },
];

/* ─── TAB 5: Infrastructure Monitoring (10 scenarios) ─── */
const INFRA_MONITORING_SCENARIOS = [
  {
    id: 'OBS-INF-001',
    name: 'Server Health Monitoring (CPU/Memory/Disk)',
    priority: 'P0',
    status: 'not_run',
    category: 'Infrastructure Monitoring',
    steps: [
      'Verify node_exporter/cloudwatch agents installed on all servers',
      'Check CPU, memory, disk utilization metrics are collecting',
      'Validate alert thresholds: CPU >80%, Memory >85%, Disk >90%',
      'Test disk space prediction (days until full at current growth rate)',
    ],
    testData: {
      monitoringAgent: 'Prometheus node_exporter',
      servers: 24,
      thresholds: { cpu: '80%', memory: '85%', disk: '90%' },
      scrapeInterval: '15s',
      diskPredictionWindow: '7 days',
    },
    expected: 'All 24 servers reporting CPU/memory/disk metrics. Alerts fire at defined thresholds. Disk prediction warns 7 days before full. Dashboard shows fleet-wide overview.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-INF-002',
    name: 'Network Latency Between Microservices',
    priority: 'P0',
    status: 'not_run',
    category: 'Infrastructure Monitoring',
    steps: [
      'Measure network latency between all service pairs',
      'Verify latency baseline established (<1ms intra-AZ, <5ms cross-AZ)',
      'Test alerting when latency exceeds 2x baseline',
      'Check for packet loss monitoring between critical services',
    ],
    testData: {
      measurement: 'TCP RTT via service mesh (Istio)',
      intraAZBaseline: '<1ms',
      crossAZBaseline: '<5ms',
      alertThreshold: '2x baseline sustained 2min',
      packetLossThreshold: '0.1%',
    },
    expected: 'Network latency tracked between all service pairs. Cross-AZ latency visible. Latency spikes trigger investigation. Packet loss >0.1% generates P1 alert.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-INF-003',
    name: 'Container Orchestration Monitoring (K8s)',
    priority: 'P0',
    status: 'not_run',
    category: 'Infrastructure Monitoring',
    steps: [
      'Verify Kubernetes cluster metrics are collected (kube-state-metrics)',
      'Check pod restart count monitoring and alerting',
      'Validate node pressure conditions detected (memory, disk, PID)',
      'Test pending pod detection and scheduling failure alerts',
    ],
    testData: {
      k8sVersion: '1.28',
      clusters: 3,
      totalPods: 150,
      metricsSource: 'kube-state-metrics + metrics-server',
      restartAlertThreshold: '3 restarts in 10min',
    },
    expected: 'All 3 K8s clusters monitored. Pod restarts (>3 in 10min) generate alert. Node pressure detected before evictions. Pending pods alerted within 2 minutes.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-INF-004',
    name: 'Database Replication Lag Monitoring',
    priority: 'P0',
    status: 'not_run',
    category: 'Infrastructure Monitoring',
    steps: [
      'Monitor replication lag between primary and replica databases',
      'Set alert threshold at 5s replication lag',
      'Test alerting when replica falls behind during high write load',
      'Verify read-replica routing adjusts based on lag (failover to primary)',
    ],
    testData: {
      dbEngine: 'PostgreSQL 15 (streaming replication)',
      replicas: 3,
      lagThreshold: '5 seconds',
      criticalLag: '30 seconds',
      readRoutingStrategy: 'Failover to primary if lag > 10s',
    },
    expected: 'Replication lag monitored per replica with 1s granularity. Alert at 5s lag, critical at 30s. Read routing failover tested. Replication slot monitoring prevents WAL accumulation.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-INF-005',
    name: 'Load Balancer Health Check Verification',
    priority: 'P0',
    status: 'not_run',
    category: 'Infrastructure Monitoring',
    steps: [
      'Verify load balancer health checks configured for all target groups',
      'Test unhealthy target detection and removal time',
      'Validate healthy target reintroduction after recovery',
      'Check load balancer connection draining during target removal',
    ],
    testData: {
      lbType: 'AWS ALB',
      healthCheckPath: '/health',
      healthCheckInterval: '10s',
      unhealthyThreshold: '3 consecutive failures',
      healthyThreshold: '2 consecutive successes',
      drainingTimeout: '30s',
    },
    expected: 'Unhealthy targets removed within 30s. Connection draining prevents in-flight request errors. Recovery detected within 20s. LB metrics (5xx, active connections) monitored.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-INF-006',
    name: 'SSL Certificate Expiry Monitoring',
    priority: 'P1',
    status: 'not_run',
    category: 'Infrastructure Monitoring',
    steps: [
      'Inventory all SSL certificates across services and domains',
      'Configure expiry alerts: 90 days (info), 30 days (warning), 7 days (critical)',
      'Verify certificate chain completeness validation',
      'Test auto-renewal workflow (Let\'s Encrypt / ACM)',
    ],
    testData: {
      totalCertificates: 15,
      domains: ['api.bank.com', 'portal.bank.com', 'admin.bank.com', 'internal-services (mTLS)'],
      alertSchedule: { info: '90 days', warning: '30 days', critical: '7 days' },
      autoRenewal: 'AWS ACM + Let\'s Encrypt',
    },
    expected: 'All 15 certificates tracked with expiry dates. Alerts fire at 90/30/7 day thresholds. Auto-renewal tested and confirmed. Certificate chain validation catches missing intermediates.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-INF-007',
    name: 'DNS Resolution Monitoring',
    priority: 'P1',
    status: 'not_run',
    category: 'Infrastructure Monitoring',
    steps: [
      'Monitor DNS resolution time for all critical domains',
      'Set alert for resolution time exceeding 100ms',
      'Test DNS failover to secondary nameservers',
      'Verify DNSSEC validation is active and monitored',
    ],
    testData: {
      criticalDomains: ['api.bank.com', 'auth.bank.com', 'payments.bank.com'],
      resolutionSLA: '<100ms',
      dnsProvider: 'AWS Route 53 + Cloudflare (secondary)',
      dnssecEnabled: true,
      healthCheckInterval: '30s',
    },
    expected: 'DNS resolution <100ms for all critical domains. Failover to secondary nameserver tested. DNSSEC validation failures generate P0 alert. TTL configuration verified.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-INF-008',
    name: 'Cloud Resource Utilization Tracking',
    priority: 'P1',
    status: 'not_run',
    category: 'Infrastructure Monitoring',
    steps: [
      'Monitor cloud resource usage vs allocated capacity',
      'Track cost anomalies (>20% increase over baseline)',
      'Verify reserved instance utilization reporting',
      'Check resource tagging compliance for cost allocation',
    ],
    testData: {
      cloudProvider: 'AWS',
      resourceTypes: ['EC2', 'RDS', 'ElastiCache', 'EKS', 'S3', 'Lambda'],
      costBaseline: '$45,000/month',
      anomalyThreshold: '20% above baseline',
      reservedUtilization: '>85% target',
    },
    expected: 'Resource utilization tracked per service. Cost anomalies detected within 24 hours. Reserved instance utilization >85%. Tagging compliance >95% for cost allocation.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-INF-009',
    name: 'Auto-Scaling Trigger Verification',
    priority: 'P1',
    status: 'not_run',
    category: 'Infrastructure Monitoring',
    steps: [
      'Verify auto-scaling policies configured for all stateless services',
      'Test scale-out trigger: CPU >70% for 3 minutes',
      'Test scale-in trigger: CPU <30% for 10 minutes',
      'Validate scaling event monitoring and alerting',
    ],
    testData: {
      scalingType: 'K8s HPA (Horizontal Pod Autoscaler)',
      scaleOutTrigger: 'CPU >70% for 3min',
      scaleInTrigger: 'CPU <30% for 10min',
      minReplicas: 3,
      maxReplicas: 20,
      cooldownPeriod: '5min',
    },
    expected: 'Auto-scaling triggers correctly on CPU thresholds. Scale-out adds pods within 2 minutes. Scale-in respects cooldown period. All scaling events logged and alerted.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-INF-010',
    name: 'Disaster Recovery Failover Monitoring',
    priority: 'P0',
    status: 'not_run',
    category: 'Infrastructure Monitoring',
    steps: [
      'Verify DR site health monitoring is active',
      'Test data replication lag between primary and DR sites',
      'Validate failover detection time (primary site failure)',
      'Check DR readiness dashboard shows current RPO/RTO status',
    ],
    testData: {
      drSite: 'AWS us-west-2 (primary: us-east-1)',
      rpo: '<1 minute',
      rto: '<15 minutes',
      replicationMethod: 'Cross-region PostgreSQL replication + S3 cross-region',
      failoverType: 'Active-passive with automated DNS failover',
    },
    expected: 'DR site health confirmed green. Replication lag <1min (RPO met). Failover completes in <15min (RTO met). DR readiness dashboard updated in real-time.',
    actual: null,
    time: null,
  },
];

/* ─── TAB 6: SRE & SLA Compliance (10 scenarios) ─── */
const SRE_SLA_SCENARIOS = [
  {
    id: 'OBS-SRE-001',
    name: 'SLA Uptime Calculation (99.9%, 99.99%)',
    priority: 'P0',
    status: 'not_run',
    category: 'SRE & SLA Compliance',
    steps: [
      'Verify uptime calculation methodology (synthetic + real user monitoring)',
      'Check uptime excludes planned maintenance windows',
      'Validate monthly/quarterly/annual uptime reports are generated',
      'Test uptime calculation accuracy against known downtime events',
    ],
    testData: {
      slaTarget: '99.99% (52.6 min downtime/year)',
      calculationMethod: 'Successful requests / Total requests (excluding maintenance)',
      monitoringType: 'Synthetic probes (1min interval) + RUM',
      reportFrequency: 'Monthly + Quarterly + Annual',
      maintenanceExclusion: 'Planned maintenance window (Sunday 02:00-04:00 UTC)',
    },
    expected: 'Uptime calculated to 4 decimal places. Maintenance windows correctly excluded. Monthly report generated automatically. Historical uptime trend available for 12+ months.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-SRE-002',
    name: 'Error Budget Tracking and Burn Rate',
    priority: 'P0',
    status: 'not_run',
    category: 'SRE & SLA Compliance',
    steps: [
      'Calculate error budget: (1 - SLO) x total requests per window',
      'Monitor error budget consumption in real-time',
      'Configure burn rate alerts (1hr: 14.4x, 6hr: 6x, 1day: 3x)',
      'Test error budget exhaustion workflow (feature freeze)',
    ],
    testData: {
      slo: '99.9%',
      windowDays: 30,
      totalRequests: '100M/month',
      errorBudget: '100,000 errors/month',
      burnRateAlerts: { '1hr': '14.4x', '6hr': '6x', '1day': '3x', '3day': '1x' },
    },
    expected: 'Error budget dashboard shows remaining budget in real-time. Burn rate alerts fire at configured multiples. Budget exhaustion triggers feature freeze policy. Budget resets monthly.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-SRE-003',
    name: 'Service Level Indicator (SLI) Definition',
    priority: 'P0',
    status: 'not_run',
    category: 'SRE & SLA Compliance',
    steps: [
      'Verify SLIs defined for all critical services (availability, latency, correctness)',
      'Check SLI measurement points are at the load balancer (user-facing)',
      'Validate SLI data quality (no gaps, no double-counting)',
      'Confirm SLI definitions documented and reviewed quarterly',
    ],
    testData: {
      sliTypes: {
        availability: 'Successful HTTP responses / Total HTTP responses',
        latency: 'Requests completing < threshold / Total requests',
        correctness: 'Correct responses / Total responses (data integrity)',
      },
      measurementPoint: 'Load balancer access logs',
      services: ['Core Banking API', 'Payment Gateway', 'Mobile Banking', 'Internet Banking'],
    },
    expected: 'SLIs defined for availability, latency, correctness per service. Measurement at LB ensures user perspective. No SLI data gaps in past 30 days. Documentation current.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-SRE-004',
    name: 'Service Level Objective (SLO) Monitoring',
    priority: 'P0',
    status: 'not_run',
    category: 'SRE & SLA Compliance',
    steps: [
      'Verify SLO targets set for each SLI (e.g., 99.9% availability)',
      'Check SLO compliance dashboard with current period status',
      'Test multi-window SLO evaluation (1hr, 1day, 30day)',
      'Validate SLO breach notification to service owners',
    ],
    testData: {
      sloTargets: {
        'Core Banking API': { availability: '99.99%', latency_p99: '<500ms' },
        'Payment Gateway': { availability: '99.99%', latency_p99: '<2s' },
        'Mobile Banking': { availability: '99.9%', latency_p99: '<3s' },
      },
      windows: ['1 hour', '1 day', '30 days'],
    },
    expected: 'SLO compliance displayed per service with traffic-light status. Multi-window evaluation catches both short and long-term degradation. Breach notifications sent to service owners.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-SRE-005',
    name: 'Availability Zone Failover Testing',
    priority: 'P0',
    status: 'not_run',
    category: 'SRE & SLA Compliance',
    steps: [
      'Simulate availability zone failure (remove one AZ from service)',
      'Measure request success rate during failover',
      'Verify zero customer-facing errors during AZ failover',
      'Check failover time and document for RTO compliance',
    ],
    testData: {
      availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
      failoverTarget: 'us-east-1b (remove)',
      expectedBehavior: 'Traffic redistributes to remaining AZs',
      maxFailoverTime: '30 seconds',
      errorBudgetImpact: 'Should consume <0.01% of monthly budget',
    },
    expected: 'AZ failover completes in <30s. Zero customer-visible errors. Traffic redistributes evenly. Error budget impact minimal. Recovery from AZ restoration is automatic.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-SRE-006',
    name: 'Chaos Engineering Experiment Tracking',
    priority: 'P1',
    status: 'not_run',
    category: 'SRE & SLA Compliance',
    steps: [
      'Verify chaos engineering experiments are tracked in a registry',
      'Check experiment results include impact metrics (latency, errors, availability)',
      'Validate experiment rollback (abort) mechanism works',
      'Confirm experiments run in production with proper blast radius limits',
    ],
    testData: {
      chaosTool: 'Gremlin / Litmus Chaos',
      experiments: ['Pod kill', 'Network latency injection', 'CPU stress', 'Disk fill', 'AZ blackhole'],
      blastRadius: 'Max 10% of pods per experiment',
      abortCondition: 'Error rate >1% or latency p99 >5s',
      frequency: 'Weekly (staging), Monthly (production)',
    },
    expected: 'All chaos experiments registered with hypothesis and metrics. Results tracked with before/after comparison. Abort triggered if safety conditions breached. Action items from failures.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-SRE-007',
    name: 'Capacity Planning Data Collection',
    priority: 'P1',
    status: 'not_run',
    category: 'SRE & SLA Compliance',
    steps: [
      'Verify resource utilization data collected for capacity planning',
      'Check growth trend analysis for key metrics (traffic, storage, compute)',
      'Validate capacity forecasting model (linear/exponential projection)',
      'Confirm capacity reports generated quarterly for leadership',
    ],
    testData: {
      metrics: ['Peak TPS', 'Storage growth GB/month', 'CPU headroom %', 'Memory headroom %', 'DB connections'],
      forecastHorizon: '6 months',
      growthRate: '15% QoQ',
      reportFrequency: 'Quarterly',
      safetyMargin: '30% headroom',
    },
    expected: 'Capacity metrics collected with 6-month history. Forecast predicts when capacity ceiling reached. Quarterly report shows utilization trends and scaling recommendations.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-SRE-008',
    name: 'Change Failure Rate Measurement',
    priority: 'P1',
    status: 'not_run',
    category: 'SRE & SLA Compliance',
    steps: [
      'Track all production deployments and their outcomes',
      'Calculate change failure rate (failed deployments / total deployments)',
      'Verify rollback events are counted as failures',
      'Check trend against DORA metrics target (<15% for elite performers)',
    ],
    testData: {
      trackingTool: 'GitHub Actions + PagerDuty',
      totalDeployments: '120/month',
      failureDefinition: 'Deployment causing incident or rollback',
      doraTarget: '<15% (elite)',
      currentRate: '8%',
    },
    expected: 'Change failure rate calculated per team and overall. Rollbacks counted as failures. DORA metric trending visible. Root cause analysis for failed changes tracked.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-SRE-009',
    name: 'Deployment Frequency Tracking',
    priority: 'P2',
    status: 'not_run',
    category: 'SRE & SLA Compliance',
    steps: [
      'Track deployment frequency per service and team',
      'Verify automated deployment detection from CI/CD pipeline',
      'Check deployment frequency against DORA target (daily+ for elite)',
      'Validate lead time for changes measurement (commit to production)',
    ],
    testData: {
      cicdTool: 'GitHub Actions',
      deploymentDetection: 'Webhook on successful deployment job',
      doraTarget: 'Multiple deploys per day (elite)',
      currentFrequency: '3-5 per day',
      leadTimeTarget: '<1 hour (elite)',
    },
    expected: 'Deployment frequency tracked per service. Automated detection from CI/CD. DORA dashboard shows frequency trend. Lead time for changes measured from commit to production.',
    actual: null,
    time: null,
  },
  {
    id: 'OBS-SRE-010',
    name: 'Toil Reduction Measurement',
    priority: 'P2',
    status: 'not_run',
    category: 'SRE & SLA Compliance',
    steps: [
      'Inventory manual operational tasks (toil) per team',
      'Measure time spent on toil vs engineering work',
      'Track automation initiatives and their toil reduction impact',
      'Verify toil budget target: <50% of SRE time on toil',
    ],
    testData: {
      toilCategories: ['Manual deployments', 'Alert triage', 'Certificate renewal', 'Capacity management', 'Incident response'],
      currentToilPercentage: '35%',
      targetToilPercentage: '<50%',
      automationBacklog: 12,
      measuredReduction: '15% over last quarter',
    },
    expected: 'Toil inventory maintained per team. Time tracking shows toil vs engineering split. Automation reduces toil quarter-over-quarter. Toil budget within target (<50%).',
    actual: null,
    time: null,
  },
];

/* ================================================================
   ALL TABS CONFIG
   ================================================================ */
const TAB_CONFIG = [
  { id: 'appMonitoring', label: 'Application Monitoring', icon: '\u2699', color: C.blue, scenarios: APP_MONITORING_SCENARIOS },
  { id: 'logManagement', label: 'Log Management', icon: '\u2630', color: C.green, scenarios: LOG_MANAGEMENT_SCENARIOS },
  { id: 'tracing', label: 'Distributed Tracing', icon: '\u2194', color: C.purple, scenarios: DISTRIBUTED_TRACING_SCENARIOS },
  { id: 'alerting', label: 'Alerting & Incident', icon: '\u26A0', color: C.orange, scenarios: ALERTING_INCIDENT_SCENARIOS },
  { id: 'infrastructure', label: 'Infrastructure', icon: '\u2601', color: C.yellow, scenarios: INFRA_MONITORING_SCENARIOS },
  { id: 'sreSla', label: 'SRE & SLA', icon: '\u2713', color: C.accent, scenarios: SRE_SLA_SCENARIOS },
];

/* ================================================================
   COMPONENT: ScenarioTab (reusable for all 6 tabs)
   ================================================================ */
const ScenarioTab = ({ scenarios: initialScenarios, tabColor }) => {
  const [scenarios, setScenarios] = useState(initialScenarios.map((s) => ({ ...s })));
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  // Reset state when tab changes (scenarios change)
  useEffect(() => {
    setScenarios(initialScenarios.map((s) => ({ ...s })));
    setSelectedIdx(0);
    setRunning(false);
    setCurrentStep(-1);
    setCompleted(false);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [initialScenarios]);

  const selected = scenarios[selectedIdx];

  const runTest = useCallback(() => {
    if (running) return;
    setRunning(true);
    setCompleted(false);
    setCurrentStep(0);
    setProgress(0);

    const totalSteps = selected.steps.length;
    let step = 0;

    timerRef.current = setInterval(() => {
      step++;
      const pct = Math.min((step / totalSteps) * 100, 100);
      setProgress(pct);

      if (step >= totalSteps) {
        clearInterval(timerRef.current);
        setCurrentStep(totalSteps);
        setCompleted(true);
        setRunning(false);

        const passed = Math.random() > 0.2;
        const execTime = randomBetween(180, 2400);

        setScenarios((prev) => {
          const updated = [...prev];
          updated[selectedIdx] = {
            ...updated[selectedIdx],
            status: passed ? 'passed' : 'failed',
            actual: passed
              ? selected.expected
              : 'Partial verification - some checks did not meet expected thresholds. Review individual step results for details.',
            time: `${execTime}ms`,
          };
          return updated;
        });
      } else {
        setCurrentStep(step);
      }
    }, 600);
  }, [running, selected, selectedIdx]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const totalCount = scenarios.length;
  const passedCount = scenarios.filter((s) => s.status === 'passed').length;
  const failedCount = scenarios.filter((s) => s.status === 'failed').length;
  const notRunCount = scenarios.filter((s) => s.status === 'not_run').length;

  return (
    <div>
      {/* Summary Stats */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryBox(C.blue)}>
          <p style={styles.summaryValue(C.blue)}>{totalCount}</p>
          <div style={styles.summaryLabel}>Total</div>
        </div>
        <div style={styles.summaryBox(C.green)}>
          <p style={styles.summaryValue(C.green)}>{passedCount}</p>
          <div style={styles.summaryLabel}>Passed</div>
        </div>
        <div style={styles.summaryBox(C.red)}>
          <p style={styles.summaryValue(C.red)}>{failedCount}</p>
          <div style={styles.summaryLabel}>Failed</div>
        </div>
        <div style={styles.summaryBox(C.textDim)}>
          <p style={styles.summaryValue(C.textDim)}>{notRunCount}</p>
          <div style={styles.summaryLabel}>Not Run</div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }} />

      <div style={styles.splitPanel}>
        {/* LEFT PANEL: Scenario List */}
        <div style={styles.leftPanel}>
          <div style={styles.sectionLabel}>
            <span style={{ color: tabColor, fontSize: 16 }}>{'\u25A0'}</span> Scenarios ({totalCount})
          </div>
          {scenarios.map((s, i) => (
            <div
              key={s.id}
              style={i === selectedIdx ? styles.activeScenario : styles.inactiveScenario}
              onClick={() => { setSelectedIdx(i); setCompleted(false); setCurrentStep(-1); setProgress(0); }}
            >
              <div style={styles.scenarioHeader}>
                <span style={styles.scenarioId}>{s.id}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={styles.alertBadge(s.priority)}>{s.priority}</span>
                  <span style={styles.statusBadge(s.status)}>{statusLabel(s.status)}</span>
                </div>
              </div>
              <div style={{ ...styles.cardTitle, fontSize: 13, marginBottom: 2 }}>{s.name}</div>
              {s.time && (
                <span style={{ fontSize: 10, color: C.textDim, fontFamily: 'monospace' }}>Exec: {s.time}</span>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT PANEL: Selected Scenario Detail */}
        <div style={styles.rightPanel}>
          {selected && (
            <>
              {/* Scenario Header */}
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span style={styles.scenarioId}>{selected.id}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: C.accent, margin: '4px 0 6px' }}>{selected.name}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <span style={styles.alertBadge(selected.priority)}>{selected.priority}</span>
                    <span style={styles.statusBadge(selected.status)}>{statusLabel(selected.status)}</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: C.textDim, fontWeight: 600 }}>Category: {selected.category}</span>
              </div>

              {/* Test Steps */}
              <div style={styles.card}>
                <div style={styles.sectionLabel}>
                  <span style={{ color: tabColor }}>{'\u25B6'}</span> Test Steps
                </div>
                <ProcessSteps steps={selected.steps} currentStep={currentStep} completed={completed} />
              </div>

              {/* Test Data */}
              <div style={styles.card}>
                <div style={styles.sectionLabel}>
                  <span style={{ color: C.blue }}>{'\u2630'}</span> Test Data
                </div>
                <div style={{ background: 'rgba(10,39,68,0.7)', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 12, color: C.textMuted, overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                  {Object.entries(selected.testData).map(([key, val]) => (
                    <div key={key} style={{ marginBottom: 4 }}>
                      <span style={{ color: C.accent, fontWeight: 700 }}>{key}: </span>
                      <span style={{ color: C.text }}>
                        {typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Result */}
              <div style={styles.card}>
                <div style={styles.sectionLabel}>
                  <span style={{ color: C.green }}>{'\u2713'}</span> Expected Result
                </div>
                <div style={{ padding: '10px 12px', background: 'rgba(78,204,163,0.08)', borderRadius: 6, border: `1px solid ${C.accent}33` }}>
                  <p style={{ fontSize: 13, color: C.text, margin: 0, lineHeight: 1.65 }}>{selected.expected}</p>
                </div>
              </div>

              {/* Run Test Button + Progress */}
              <div style={styles.card}>
                {running && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={styles.progressBarOuter}>
                      <div style={styles.progressBarInner(progress, tabColor)} />
                    </div>
                    <span style={{ fontSize: 11, color: tabColor }}>
                      Executing step {Math.min(currentStep + 1, selected.steps.length)} of {selected.steps.length}...
                    </span>
                  </div>
                )}
                <button style={styles.runBtn(running)} onClick={runTest} disabled={running}>
                  {running ? 'Running Test...' : 'Run Test'}
                </button>
              </div>

              {/* Actual Result (shown after test run) */}
              {selected.status !== 'not_run' && selected.actual && (
                <div style={styles.card}>
                  <div style={styles.sectionLabel}>
                    <span style={{ color: selected.status === 'passed' ? C.green : C.red }}>
                      {selected.status === 'passed' ? '\u2713' : '\u2717'}
                    </span>
                    {' '}Actual Result
                  </div>
                  <div style={{
                    padding: '10px 12px',
                    background: selected.status === 'passed' ? 'rgba(78,204,163,0.1)' : 'rgba(231,76,60,0.1)',
                    borderRadius: 6,
                    border: `1px solid ${selected.status === 'passed' ? C.green : C.red}44`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{
                        padding: '3px 14px',
                        borderRadius: 14,
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#000',
                        background: selected.status === 'passed' ? C.green : C.red,
                      }}>
                        {selected.status === 'passed' ? 'PASS' : 'FAIL'}
                      </span>
                      <span style={{ fontSize: 12, fontFamily: 'monospace', color: C.textMuted }}>
                        Execution Time: {selected.time}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: C.text, margin: 0, lineHeight: 1.65 }}>{selected.actual}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   MAIN COMPONENT: ObservabilityTesting
   ================================================================ */
const ObservabilityTesting = () => {
  const [activeTab, setActiveTab] = useState('appMonitoring');

  const activeConfig = TAB_CONFIG.find((t) => t.id === activeTab);
  const totalScenarios = TAB_CONFIG.reduce((sum, t) => sum + t.scenarios.length, 0);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.h1}>Observability Testing Dashboard</h1>
        <p style={styles.subtitle}>
          Banking QA -- Application Monitoring, Logging, Tracing, Alerting, Infrastructure & SRE | {totalScenarios} Test Scenarios
        </p>
      </div>

      {/* STAT BADGES */}
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        {TAB_CONFIG.map((t) => (
          <div
            key={t.id}
            style={{
              background: activeTab === t.id ? `${t.color}22` : C.card,
              border: `1px solid ${activeTab === t.id ? t.color : C.border}`,
              borderRadius: 10,
              padding: '10px 18px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              minWidth: 130,
            }}
            onClick={() => setActiveTab(t.id)}
          >
            <div style={{ fontSize: 20, marginBottom: 2 }}>{t.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 2 }}>{t.scenarios.length}</div>
            <div style={{ fontSize: 10, color: C.textDim }}>Scenarios</div>
          </div>
        ))}
      </div>

      {/* TAB BAR */}
      <div style={styles.tabBar}>
        {TAB_CONFIG.map((t) => (
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
      {activeConfig && (
        <ScenarioTab
          key={activeConfig.id}
          scenarios={activeConfig.scenarios}
          tabColor={activeConfig.color}
        />
      )}
    </div>
  );
};

export default ObservabilityTesting;

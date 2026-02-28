import React, { useState } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12', success:'#2ecc71', info:'#3498db' };

const TABS = [
  { key: 'architecture', label: 'Architecture' },
  { key: 'brd', label: 'BRD' },
  { key: 'hld', label: 'HLD' },
  { key: 'lld', label: 'LLD' },
  { key: 'scenarios', label: 'Scenarios' },
  { key: 'testcases', label: 'Test Cases' },
  { key: 'c4model', label: 'C4 Model' },
  { key: 'techstack', label: 'Tech Stack' },
  { key: 'sad', label: 'SAD' },
  { key: 'flowchart', label: 'Flowchart' },
  { key: 'sequence', label: 'Sequence Diagram' }
];

export default function ChaosResilienceArch() {
  const [activeTab, setActiveTab] = useState('architecture');

  const preStyle = { fontFamily:'monospace', fontSize:13, background:C.editorBg, color:C.editorText, padding:20, borderRadius:8, overflowX:'auto', whiteSpace:'pre', lineHeight:1.6, border:`1px solid ${C.border}` };
  const tableStyle = { width:'100%', borderCollapse:'collapse', fontSize:14 };
  const thStyle = { background:C.card, color:C.accent, padding:'12px 10px', textAlign:'left', borderBottom:`2px solid ${C.accent}`, fontWeight:700 };
  const tdStyle = { padding:'10px', borderBottom:`1px solid ${C.border}`, color:C.text, verticalAlign:'top' };
  const cardStyle = { background:C.card, borderRadius:10, padding:20, border:`1px solid ${C.border}`, marginBottom:16 };
  const gridStyle = { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))', gap:16, marginBottom:20 };
  const sectionTitle = { color:C.accent, fontSize:20, fontWeight:700, marginBottom:12, marginTop:24 };
  const subTitle = { color:C.header, fontSize:16, fontWeight:600, marginBottom:8 };
  const badge = (color, text) => (
    <span style={{ background:color, color:'#fff', padding:'2px 10px', borderRadius:12, fontSize:12, fontWeight:600, marginRight:6 }}>{text}</span>
  );

  const renderArchitecture = () => (
    <div>
      <h2 style={sectionTitle}>Chaos Engineering & Resilience Testing Platform Architecture</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Enterprise-grade chaos engineering and resilience testing platform for Indian banking ecosystem. Designed to proactively discover system weaknesses through controlled fault injection, validate disaster recovery procedures, ensure business continuity compliance with RBI BCP requirements, and build confidence in production resilience for core banking, payment processing, and digital channels.
      </p>

      <pre style={preStyle}>{`
+=============================================================================+
|           CHAOS ENGINEERING & RESILIENCE TESTING PLATFORM                    |
|                Banking QA Architecture Overview                              |
+=============================================================================+

  CHAOS CONTROLLER                    BANKING SYSTEM UNDER TEST
  ================                    =========================

  +---------------------+         +------------------------------------------+
  |  CHAOS ORCHESTRATOR |         |                                          |
  |  =================  |         |   BANKING MICROSERVICES MESH              |
  |                     |         |                                          |
  |  +---------------+  |         |   +-------------+    +---------------+   |
  |  | Experiment    |  |         |   | Core Banking |    | Payment       |   |
  |  | Registry      |  |         |   | Service (CBS)|    | Gateway       |   |
  |  | - Templates   |  |         |   | - Accounts   |    | - UPI/IMPS    |   |
  |  | - Schedules   |  |  INJECT |   | - Deposits   |    | - NEFT/RTGS   |   |
  |  | - History     |  |  FAULTS |   | - Loans      |    | - Cards       |   |
  |  +---------------+  |========>|   | - Interest   |    | - QR Pay      |   |
  |                     |         |   +-------------+    +---------------+   |
  |  +---------------+  |         |                                          |
  |  | Blast Radius  |  |         |   +-------------+    +---------------+   |
  |  | Controller    |  |         |   | Account      |    | Fraud         |   |
  |  | - Scope limit |  |         |   | Management   |    | Detection     |   |
  |  | - % traffic   |  |         |   | - KYC        |    | - Rules       |   |
  |  | - Duration    |  |         |   | - Onboarding |    | - ML Models   |   |
  |  | - Auto-stop   |  |         |   | - Statements |    | - Real-time   |   |
  |  +---------------+  |         |   +-------------+    +---------------+   |
  |                     |         |                                          |
  |  +---------------+  |         |   +-------------+    +---------------+   |
  |  | Rollback      |  |         |   | Notification |    | Reconciliation|   |
  |  | Engine        |  |         |   | Service      |    | Engine        |   |
  |  | - State save  |  |         |   | - SMS/Email  |    | - EOD Batch   |   |
  |  | - Instant     |  |         |   | - Push       |    | - GL Posting  |   |
  |  |   recovery    |  |         |   | - Webhooks   |    | - Settlement  |   |
  |  | - Validation  |  |         |   +-------------+    +---------------+   |
  |  +---------------+  |         |                                          |
  |                     |         +------------------------------------------+
  +---------------------+

  FAULT INJECTORS                     INFRASTRUCTURE LAYER
  ================                    ====================

  +----------------+  +------------+  +------------------------------------------+
  | Network Faults |  | CPU Faults |  |                                          |
  | - Latency      |  | - Stress   |  |  +-------------+    +---------------+    |
  | - Packet Loss  |  | - Spike    |  |  | PostgreSQL   |    | Redis         |    |
  | - Partition    |  | - Throttle |  |  | Primary +    |    | Cluster       |    |
  | - DNS Failure  |  +------------+  |  | Replicas     |    | (Sentinel)    |    |
  +----------------+                  |  | (Patroni HA) |    |               |    |
                                      |  +-------------+    +---------------+    |
  +----------------+  +------------+  |                                          |
  | Memory Faults  |  | Disk Faults|  |  +-------------+    +---------------+    |
  | - Pressure     |  | - I/O Slow |  |  | Kafka        |    | Load Balancer |    |
  | - Leak Sim     |  | - Full Disk|  |  | Cluster      |    | (HAProxy/     |    |
  | - OOM Trigger  |  | - Corrupt  |  |  | (MirrorMaker)|    |  Nginx)       |    |
  +----------------+  +------------+  |  +-------------+    +---------------+    |
                                      |                                          |
  +----------------+  +------------+  |  +-------------+    +---------------+    |
  | Process Faults |  | Dependency |  |  | API Gateway  |    | Service Mesh  |    |
  | - Kill Process |  | Faults     |  |  | (Kong/APISIX)|    | (Istio/Envoy) |    |
  | - Zombie       |  | - Timeout  |  |  +-------------+    +---------------+    |
  | - Fork Bomb    |  | - 5xx Resp |  |                                          |
  | - Cert Expiry  |  | - Slow Dep |  +------------------------------------------+
  +----------------+  +------------+

  OBSERVABILITY STACK
  ===================

  +----------------+    +----------------+    +------------------+    +----------------+
  | Steady State   |    | Metrics        |    | Alert Manager    |    | Auto-Rollback  |
  | Monitor        |    | Collector      |    |                  |    | Trigger        |
  | - SLIs/SLOs    |    | - Prometheus   |    | - PagerDuty      |    | - Threshold    |
  | - Error Rates  |    | - OpenTelemetry|    | - Slack/Teams    |    |   breach       |
  | - Latency P99  |    | - Jaeger Traces|    | - Email          |    | - Error spike  |
  | - Throughput   |    | - Custom       |    | - Webhook        |    | - SLO violation|
  +----------------+    +----------------+    +------------------+    +----------------+
`}</pre>

      <h3 style={sectionTitle}>Module Overview</h3>
      <div style={gridStyle}>
        {[
          { title:'Chaos Orchestrator', desc:'Central experiment management engine. Manages experiment lifecycle from creation through approval, execution, monitoring, and rollback. Maintains experiment registry with templates, schedules, and execution history. Coordinates all fault injectors.', reg:'Experiment Lifecycle Management', color:C.accent },
          { title:'Steady State Monitor', desc:'Continuously monitors system health indicators (SLIs/SLOs) before, during, and after chaos experiments. Validates steady state hypothesis by tracking error rates, latency percentiles (P50/P95/P99), throughput, and availability metrics.', reg:'SLI/SLO Validation', color:C.info },
          { title:'Blast Radius Controller', desc:'Limits the scope of fault injection to prevent cascading failures. Controls percentage of traffic affected, geographic scope, time duration, and automatic experiment termination when safety thresholds are breached.', reg:'Safety & Scope Control', color:C.warn },
          { title:'Rollback Engine', desc:'Provides instant recovery capability during experiments. Saves pre-experiment state, monitors for degradation, and performs automated rollback when steady state hypothesis is violated or manual abort is triggered.', reg:'Instant Recovery', color:C.danger },
          { title:'Core Banking Resilience', desc:'Tests resilience of core banking services including account operations, deposit processing, loan servicing, and interest calculation. Validates failover of CBS under partial and full outage conditions.', reg:'CBS Failover Testing', color:C.success },
          { title:'Payment Gateway Failover', desc:'Validates payment processing resilience across UPI, IMPS, NEFT, RTGS, and card payment channels. Tests failover between primary and secondary payment processors, timeout handling, and retry mechanisms.', reg:'Payment Continuity', color:C.accent },
          { title:'DB Replication & Lag Testing', desc:'Tests database resilience under replication lag, primary failover, split-brain scenarios, and data consistency validation. Covers PostgreSQL Patroni clusters, Redis Sentinel, and Kafka MirrorMaker.', reg:'Data Resilience', color:C.info },
          { title:'MQ Backpressure Testing', desc:'Validates message queue behavior under extreme load conditions. Tests Kafka consumer lag, dead letter queue handling, backpressure propagation, and message ordering guarantees during broker failures.', reg:'Message Queue Resilience', color:C.warn }
        ].map((m, i) => (
          <div key={i} style={cardStyle}>
            <h4 style={{ color:m.color, fontSize:16, fontWeight:700, marginBottom:8 }}>{m.title}</h4>
            <p style={{ color:C.text, fontSize:13, lineHeight:1.6, marginBottom:8 }}>{m.desc}</p>
            <div>{badge(m.color, m.reg)}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBRD = () => (
    <div>
      <h2 style={sectionTitle}>Business Requirements Document (BRD)</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Chaos Engineering & Resilience Testing Framework for Indian Banking - Business Requirements covering disaster recovery, failover validation, business continuity planning, and production resilience assurance.
      </p>

      <h3 style={subTitle}>Objectives</h3>
      <div style={cardStyle}>
        <ul style={{ color:C.text, lineHeight:2, paddingLeft:20 }}>
          <li>Validate <strong style={{ color:C.accent }}>system resilience</strong> across core banking, payment processing, API gateway, database clusters, and message queues through controlled fault injection</li>
          <li>Reduce Mean Time to Recovery (MTTR) from <strong style={{ color:C.danger }}>current 45 minutes to under 5 minutes</strong> through automated failover validation and runbook testing</li>
          <li>Comply with <strong style={{ color:C.accent }}>RBI Business Continuity Planning (BCP)</strong> requirements and cybersecurity framework mandates for DR testing</li>
          <li>Build <strong style={{ color:C.success }}>disaster recovery confidence</strong> through regular GameDay exercises simulating real-world failure modes</li>
          <li>Achieve <strong style={{ color:C.warn }}>zero data loss</strong> during all chaos experiments through blast radius control and automated rollback mechanisms</li>
          <li>Establish production resilience baselines with measurable SLIs/SLOs for all critical banking services</li>
        </ul>
      </div>

      <h3 style={sectionTitle}>Scope by Domain</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Domain</th>
            <th style={thStyle}>Scope Areas</th>
            <th style={thStyle}>Key Experiments</th>
            <th style={thStyle}>Frequency</th>
          </tr>
        </thead>
        <tbody>
          {[
            { reg:'Core Banking System (CBS)', scope:'Account operations, deposit processing, loan servicing, interest calculation, GL posting, EOD batch processing, statement generation', controls:'CBS pod failure, CBS database failover, EOD batch interruption, account lock contention, interest calculation under stress', freq:'Weekly automated + Monthly GameDay' },
            { reg:'Payment Processing', scope:'UPI/IMPS real-time payments, NEFT/RTGS batch settlements, card authorization, QR payment, payment gateway failover, reconciliation', controls:'Payment pod kill, gateway timeout injection, settlement service failure, card processor disconnect, UPI switch failover', freq:'Daily automated + Bi-weekly GameDay' },
            { reg:'API Gateway & Service Mesh', scope:'Rate limiting, circuit breaking, load balancing, health checks, TLS termination, request routing, API versioning', controls:'Gateway memory leak, LB health check failure, circuit breaker trip, DNS failure, SSL certificate expiry simulation', freq:'Weekly automated' },
            { reg:'Database Clusters', scope:'PostgreSQL primary/replica failover (Patroni), Redis cluster failover (Sentinel), connection pool management, replication lag, backup/restore', controls:'Primary DB kill, replica lag injection, connection pool exhaustion, split-brain simulation, WAL corruption', freq:'Bi-weekly automated + Monthly DR drill' },
            { reg:'Message Queues', scope:'Kafka broker failure, consumer lag, partition rebalancing, dead letter queue, message ordering, MirrorMaker cross-DC replication', controls:'Kafka broker kill, 100K message backpressure, consumer group rebalance, partition leader election, cross-DC lag', freq:'Weekly automated' },
            { reg:'Infrastructure & Network', scope:'AZ network partition, data center evacuation, DNS resolution failure, NTP drift, disk I/O degradation, CPU/memory resource exhaustion', controls:'Network partition between AZs, DC power failure simulation, DNS blackhole, disk fill to 100%, CPU spike to 100%', freq:'Monthly automated + Quarterly DR drill' },
            { reg:'Security & Compliance', scope:'DDoS resilience, WAF bypass testing, certificate rotation under load, secrets rotation impact, audit log availability during outage', controls:'DDoS simulation (Layer 7), concurrent TLS handshake storm, vault seal/unseal, log pipeline failure', freq:'Quarterly + Annual BCP test' }
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:600, minWidth:160 }}>{r.reg}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.scope}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.controls}</td>
              <td style={{ ...tdStyle, fontSize:13, minWidth:120 }}>{r.freq}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={sectionTitle}>Non-Functional Requirements (NFRs)</h3>
      <div style={gridStyle}>
        {[
          { title:'Zero Data Loss', value:'0 bytes', desc:'All chaos experiments must guarantee zero data loss. Blast radius controller must prevent any experiment from corrupting production data. Write-ahead logs and point-in-time recovery must be validated.', color:C.danger },
          { title:'MTTR Target', value:'< 5 min', desc:'Mean Time to Recovery must be under 5 minutes for all Tier-1 services (CBS, payments, authentication). Automated failover must complete within 30 seconds. Manual runbook execution within 5 minutes.', color:C.warn },
          { title:'Experiment Safety', value:'Auto-Rollback', desc:'Every experiment must have an automated rollback mechanism. If steady state hypothesis is violated beyond threshold, experiment must auto-terminate and rollback within 60 seconds.', color:C.info },
          { title:'Blast Radius Control', value:'< 5% traffic', desc:'Initial experiments must affect no more than 5% of production traffic. Progressive increase allowed only after successful validation. Kill switch must terminate experiment in under 10 seconds.', color:C.danger },
          { title:'RBI BCP Compliance', value:'Semi-Annual DR', desc:'DR drills must be conducted semi-annually per RBI BCP guidelines. Full data center evacuation test annually. Results documented and submitted to board and regulators.', color:C.success },
          { title:'GameDay Cadence', value:'Monthly', desc:'Monthly GameDay exercises involving cross-functional teams (SRE, Dev, Ops, Business). Simulate real-world failure scenarios end-to-end. Post-mortem report within 48 hours.', color:C.accent }
        ].map((n, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ color:C.header, fontWeight:600 }}>{n.title}</span>
              <span style={{ background:n.color, color:'#fff', padding:'4px 12px', borderRadius:12, fontSize:14, fontWeight:700 }}>{n.value}</span>
            </div>
            <p style={{ color:C.muted, fontSize:13, lineHeight:1.5 }}>{n.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHLD = () => (
    <div>
      <h2 style={sectionTitle}>High-Level Design (HLD)</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        High-level chaos engineering architecture showing experiment scheduling, fault injection pipeline, monitoring integration, auto-rollback mechanisms, and disaster recovery topology for active-active and active-passive configurations.
      </p>

      <pre style={preStyle}>{`
+=============================================================================+
|              HIGH-LEVEL CHAOS ENGINEERING ARCHITECTURE                       |
+=============================================================================+

   EXPERIMENT PIPELINE
   ====================

   Experiment Definition (Engineer / SRE Team)
            |
            v
   +------------------+     +--------------------+     +-------------------+
   | Experiment        |---->| Approval Workflow   |---->| Chaos Controller  |
   | Scheduler         |     | (Peer Review +      |     | (Orchestration)   |
   | - Cron schedule   |     |  Manager Approval)  |     |                   |
   | - Event trigger   |     |                     |     | - Parse config    |
   | - Manual launch   |     | - Risk assessment   |     | - Set blast radius|
   | - Pipeline hook   |     | - Blast review      |     | - Init monitoring |
   +------------------+     | - Rollback plan OK  |     | - Execute faults  |
                             +--------------------+     +-------------------+
                                                               |
                             +--------------------+            |
                             | Target Service Mesh |<-----------+
                             | (Kubernetes + Istio) |
                             |                     |
                             | - Pod disruption    |
                             | - Network policies  |
                             | - Sidecar injection |
                             | - Traffic shifting  |
                             +--------------------+


   MONITORING & AUTO-ROLLBACK
   ==========================

   +------------------------------------------------------------------+
   |                    Observability Pipeline                          |
   |                                                                   |
   |  Prometheus          Grafana           Alert Manager              |
   |  +-----------------+ +-----------------+ +-------------------+   |
   |  | Metrics Scrape  | | Real-time       | | Threshold Rules   |   |
   |  | - Error rate    | | Dashboards      | | - Error > 1%      |   |
   |  | - Latency P99   | | - Experiment    | | - Latency > 2s    |   |
   |  | - Throughput    | |   progress      | | - Throughput drop  |   |
   |  | - Saturation    | | - Steady state  | |   > 20%           |   |
   |  | - Pod health    | |   comparison    | | - Pod restart > 3 |   |
   |  +-----------------+ +-----------------+ +-------------------+   |
   |                                                 |                 |
   |                                                 v                 |
   |                                          +-------------------+   |
   |                                          | Auto-Rollback     |   |
   |                                          | Decision Engine   |   |
   |                                          | - Evaluate SLOs   |   |
   |                                          | - Check thresholds|   |
   |                                          | - Trigger rollback|   |
   |                                          | - Notify teams    |   |
   |                                          +-------------------+   |
   +------------------------------------------------------------------+


   DISASTER RECOVERY TOPOLOGY
   ===========================

   +------------------------------------------------------------------+
   |                                                                    |
   |  ACTIVE-ACTIVE (Multi-AZ / Multi-Region)                          |
   |                                                                    |
   |  Data Center A (Primary)        Data Center B (Secondary)         |
   |  +---------------------+       +---------------------+           |
   |  | CBS Primary         |<=====>| CBS Standby          |           |
   |  | Payment Gateway     |  Sync | Payment Gateway     |           |
   |  | PostgreSQL Primary  |       | PostgreSQL Replica   |           |
   |  | Kafka Cluster       |       | Kafka MirrorMaker    |           |
   |  | Redis Primary       |       | Redis Sentinel       |           |
   |  +---------------------+       +---------------------+           |
   |          |                              |                          |
   |  +-------+-------+              +------+------+                   |
   |  | Global LB     |              | Global LB   |                   |
   |  | (GSLB/Route53)|              | (Failover)  |                   |
   |  +---------------+              +-------------+                   |
   |                                                                    |
   |  ACTIVE-PASSIVE (DR Site)                                         |
   |  +---------------------+                                          |
   |  | DR Site (Cold/Warm)  |                                          |
   |  | - CBS Image         |   RTO: 4 hours (Active-Passive)          |
   |  | - DB Backup Restore |   RPO: 15 minutes (Async Replication)    |
   |  | - Config Snapshots  |   RTO: 15 min (Active-Active Failover)   |
   |  | - Runbook Scripts   |   RPO: 0 (Synchronous Replication)       |
   |  +---------------------+                                          |
   +------------------------------------------------------------------+


   SECURITY BOUNDARIES & APPROVAL WORKFLOW
   ========================================

   +----------------+    +----------------+    +------------------+    +----------------+
   | SRE Engineer   |    | Peer Review    |    | Manager Approval |    | CISO Sign-off  |
   | Defines        |--->| (Technical     |--->| (Business Impact |--->| (Production    |
   | Experiment     |    |  Feasibility)  |    |  Assessment)     |    |  Readiness)    |
   +----------------+    +----------------+    +------------------+    +----------------+
                                                                              |
                                                                              v
                                                                       +----------------+
                                                                       | Execute with   |
                                                                       | Blast Radius   |
                                                                       | Controls       |
                                                                       +----------------+
`}</pre>
    </div>
  );

  const renderLLD = () => (
    <div>
      <h2 style={sectionTitle}>Low-Level Design (LLD)</h2>

      <h3 style={subTitle}>Chaos Experiment API Contracts</h3>
      <pre style={preStyle}>{`
  CHAOS EXPERIMENT API ENDPOINTS
  ==============================

  POST /api/v1/experiments/create
  --------------------------------
  Request:
  {
    "name": "CBS Primary DB Failover Test",
    "description": "Kill PostgreSQL primary to validate Patroni auto-failover",
    "experiment_type": "DATABASE_FAILOVER",
    "target": {
      "service": "postgresql-primary",
      "namespace": "banking-core",
      "cluster": "prod-east-1",
      "selector": { "app": "patroni", "role": "primary" }
    },
    "fault_config": {
      "type": "PROCESS_KILL",
      "parameters": {
        "signal": "SIGKILL",
        "target_process": "postgres",
        "delay_seconds": 0
      }
    },
    "blast_radius": {
      "percentage": 100,
      "scope": "single_pod",
      "max_duration_seconds": 300,
      "auto_rollback": true
    },
    "steady_state_hypothesis": {
      "probes": [
        { "name": "api_error_rate", "type": "prometheus", "query": "rate(http_errors_total[1m])", "threshold": "< 0.01" },
        { "name": "api_latency_p99", "type": "prometheus", "query": "histogram_quantile(0.99, rate(http_duration_seconds_bucket[1m]))", "threshold": "< 2.0" },
        { "name": "transaction_throughput", "type": "prometheus", "query": "rate(transactions_total[1m])", "threshold": "> 100" }
      ],
      "evaluation_interval_seconds": 10
    },
    "rollback_plan": {
      "strategy": "AUTOMATIC",
      "actions": [
        { "type": "RESTART_POD", "target": "postgresql-primary" },
        { "type": "VERIFY_REPLICATION", "timeout_seconds": 60 },
        { "type": "RUN_HEALTH_CHECK", "endpoint": "/api/health" }
      ]
    },
    "schedule": {
      "type": "MANUAL",
      "approved_window": "2026-03-01T02:00:00Z/2026-03-01T04:00:00Z"
    },
    "tags": ["database", "failover", "patroni", "P0"]
  }
  Response: 201 Created
  {
    "experiment_id": "EXP-20260301-00042",
    "status": "CREATED",
    "requires_approval": true,
    "approval_chain": ["peer_review", "manager", "ciso"],
    "created_at": "2026-03-01T00:30:00Z"
  }

  POST /api/v1/experiments/{experiment_id}/run
  ---------------------------------------------
  Request:
  {
    "experiment_id": "EXP-20260301-00042",
    "dry_run": false,
    "override_blast_radius": null,
    "notification_channels": ["slack:#chaos-alerts", "pagerduty:chaos-oncall"]
  }
  Response: 200 OK
  {
    "run_id": "RUN-20260301-00108",
    "experiment_id": "EXP-20260301-00042",
    "status": "RUNNING",
    "started_at": "2026-03-01T02:15:00Z",
    "estimated_duration_seconds": 300,
    "monitoring_dashboard": "https://grafana.bank.internal/d/chaos-exp-00042",
    "kill_switch_url": "/api/v1/experiments/RUN-20260301-00108/abort"
  }

  GET /api/v1/experiments/{run_id}/status
  ----------------------------------------
  Response: 200 OK
  {
    "run_id": "RUN-20260301-00108",
    "experiment_id": "EXP-20260301-00042",
    "status": "MONITORING",
    "phase": "FAULT_INJECTED",
    "elapsed_seconds": 120,
    "steady_state": {
      "maintained": true,
      "probes": [
        { "name": "api_error_rate", "current": 0.002, "threshold": "< 0.01", "status": "PASS" },
        { "name": "api_latency_p99", "current": 1.45, "threshold": "< 2.0", "status": "PASS" },
        { "name": "transaction_throughput", "current": 142, "threshold": "> 100", "status": "PASS" }
      ]
    },
    "fault_status": {
      "injected": true,
      "target_affected": "patroni-primary-0",
      "recovery_detected": true,
      "failover_time_seconds": 8.3
    },
    "timeline": [
      { "time": "02:15:00", "event": "Experiment started" },
      { "time": "02:15:02", "event": "Steady state baseline captured" },
      { "time": "02:15:05", "event": "Fault injected: SIGKILL to postgres process" },
      { "time": "02:15:08", "event": "Patroni detected primary failure" },
      { "time": "02:15:13", "event": "Replica promoted to primary (8.3s failover)" },
      { "time": "02:15:15", "event": "Application connections re-established" },
      { "time": "02:17:00", "event": "Monitoring: steady state maintained" }
    ]
  }

  POST /api/v1/experiments/{run_id}/rollback
  -------------------------------------------
  Request:
  {
    "run_id": "RUN-20260301-00108",
    "reason": "MANUAL_ABORT",
    "initiated_by": "sre-engineer@bank.com"
  }
  Response: 200 OK
  {
    "rollback_id": "RB-20260301-00015",
    "status": "ROLLING_BACK",
    "actions_executed": [
      { "action": "STOP_FAULT_INJECTION", "status": "COMPLETED", "duration_ms": 150 },
      { "action": "RESTART_POD", "status": "COMPLETED", "duration_ms": 5200 },
      { "action": "VERIFY_REPLICATION", "status": "IN_PROGRESS" }
    ],
    "estimated_completion_seconds": 45
  }
`}</pre>

      <h3 style={sectionTitle}>Experiment State Machine</h3>
      <pre style={preStyle}>{`
  EXPERIMENT STATE MACHINE
  ========================

  +----------+     +-----------+     +-----------+     +-------------+
  | CREATED  |---->| APPROVED  |---->| RUNNING   |---->| MONITORING  |
  +----------+     +-----------+     +-----------+     +------+------+
       |                |                  |                   |
       v                v                  v              +----+----+
  +----------+     +-----------+     +-----------+     |         |
  | REJECTED |     | CANCELLED |     | ABORTED   |     v         v
  +----------+     +-----------+     +-----------+  +--------+ +--------+
                                          ^          |COMPLETED| |ROLLED_ |
                                          |          |(SUCCESS)| |BACK    |
                                          +----------|        | +--------+
                                                     +--------+

  State Transitions:
  ==================
  CREATED    --> APPROVED      : Peer review + Manager approval + CISO sign-off
  CREATED    --> REJECTED      : Risk too high / Blast radius too wide
  APPROVED   --> RUNNING       : Experiment execution started
  APPROVED   --> CANCELLED     : Cancelled before execution
  RUNNING    --> MONITORING    : Fault injected, observing steady state
  RUNNING    --> ABORTED       : Manual kill switch or safety threshold
  MONITORING --> COMPLETED     : Steady state maintained, experiment success
  MONITORING --> ROLLED_BACK   : Steady state violated, auto-rollback triggered
  MONITORING --> ABORTED       : Manual abort during monitoring phase
`}</pre>

      <h3 style={sectionTitle}>Database Schema</h3>
      <pre style={preStyle}>{`
  DATABASE SCHEMA DESIGN
  ======================

  TABLE: experiments
  -------------------
  experiment_id     VARCHAR(30)   PRIMARY KEY
  name              VARCHAR(200)  NOT NULL
  description       TEXT
  experiment_type   ENUM('NETWORK_FAULT','CPU_STRESS','MEMORY_PRESSURE',
                         'DISK_IO','PROCESS_KILL','DNS_FAILURE',
                         'DEPENDENCY_TIMEOUT','DATABASE_FAILOVER',
                         'BROKER_FAILURE','CERTIFICATE_EXPIRY',
                         'LOAD_TEST','DC_EVACUATION')
  target_config     JSONB         NOT NULL
  fault_config      JSONB         NOT NULL
  blast_radius      JSONB         NOT NULL
  steady_state      JSONB         NOT NULL
  rollback_plan     JSONB         NOT NULL
  schedule_config   JSONB
  status            ENUM('CREATED','APPROVED','REJECTED','CANCELLED')
  created_by        VARCHAR(100)  NOT NULL
  approved_by       VARCHAR(100)
  approved_at       TIMESTAMP
  tags              TEXT[]
  created_at        TIMESTAMP     DEFAULT NOW()
  updated_at        TIMESTAMP
  INDEX idx_exp_status      ON experiments(status)
  INDEX idx_exp_type        ON experiments(experiment_type)
  INDEX idx_exp_created_by  ON experiments(created_by)
  INDEX idx_exp_created_at  ON experiments(created_at)

  TABLE: experiment_runs
  -----------------------
  run_id            VARCHAR(30)   PRIMARY KEY
  experiment_id     VARCHAR(30)   NOT NULL REFERENCES experiments(experiment_id)
  status            ENUM('RUNNING','MONITORING','COMPLETED','ROLLED_BACK','ABORTED')
  phase             ENUM('BASELINE','FAULT_INJECTION','OBSERVATION','RECOVERY','CLEANUP')
  dry_run           BOOLEAN       DEFAULT FALSE
  started_at        TIMESTAMP     NOT NULL
  completed_at      TIMESTAMP
  duration_seconds  INTEGER
  fault_injected_at TIMESTAMP
  failover_time_ms  INTEGER
  steady_state_maintained BOOLEAN
  rollback_triggered     BOOLEAN  DEFAULT FALSE
  rollback_reason        TEXT
  timeline_json     JSONB
  metrics_snapshot  JSONB
  executed_by       VARCHAR(100)  NOT NULL
  INDEX idx_run_experiment  ON experiment_runs(experiment_id)
  INDEX idx_run_status      ON experiment_runs(status)
  INDEX idx_run_started     ON experiment_runs(started_at)

  TABLE: steady_state_metrics
  ----------------------------
  metric_id         BIGSERIAL     PRIMARY KEY
  run_id            VARCHAR(30)   NOT NULL REFERENCES experiment_runs(run_id)
  probe_name        VARCHAR(100)  NOT NULL
  probe_type        VARCHAR(50)   NOT NULL
  timestamp         TIMESTAMP     NOT NULL
  value             DECIMAL(12,4) NOT NULL
  threshold         VARCHAR(50)   NOT NULL
  status            ENUM('PASS','FAIL','WARN')
  phase             ENUM('BASELINE','DURING_FAULT','POST_RECOVERY')
  INDEX idx_ssm_run         ON steady_state_metrics(run_id)
  INDEX idx_ssm_probe       ON steady_state_metrics(probe_name)
  INDEX idx_ssm_timestamp   ON steady_state_metrics(timestamp)
  INDEX idx_ssm_status      ON steady_state_metrics(status)

  TABLE: rollback_actions
  ------------------------
  action_id         BIGSERIAL     PRIMARY KEY
  run_id            VARCHAR(30)   NOT NULL REFERENCES experiment_runs(run_id)
  action_type       ENUM('STOP_FAULT','RESTART_POD','SCALE_UP','FAILBACK',
                         'RESTORE_CONFIG','VERIFY_HEALTH','RUN_RECONCILIATION')
  target            VARCHAR(200)  NOT NULL
  status            ENUM('PENDING','IN_PROGRESS','COMPLETED','FAILED')
  started_at        TIMESTAMP
  completed_at      TIMESTAMP
  duration_ms       INTEGER
  error_message     TEXT
  INDEX idx_ra_run          ON rollback_actions(run_id)
  INDEX idx_ra_status       ON rollback_actions(status)
`}</pre>

      <h3 style={sectionTitle}>Fault Injection Types</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Fault Type</th>
            <th style={thStyle}>Parameters</th>
            <th style={thStyle}>Banking Use Case</th>
            <th style={thStyle}>Blast Radius</th>
          </tr>
        </thead>
        <tbody>
          {[
            { type:'Network Latency', params:'delay_ms: 50-5000, jitter_ms: 0-500, correlation: 0-100%, interface: eth0', use:'Simulate cross-DC latency for CBS-to-payment gateway calls, NEFT/RTGS settlement delays', blast:'Per-pod / Per-service' },
            { type:'Packet Loss', params:'loss_percent: 1-100%, correlation: 0-100%, duration_seconds: 30-600', use:'Simulate unreliable network between AZs affecting DB replication and Kafka mirroring', blast:'Per-pod / Per-namespace' },
            { type:'CPU Stress', params:'cores: 1-ALL, load_percent: 50-100%, duration_seconds: 60-600', use:'Settlement engine under CPU pressure, fraud detection ML model inference slowdown', blast:'Per-pod' },
            { type:'Memory Pressure', params:'target_mb: 256-8192, growth_rate_mb_per_sec: 10-500, oom_kill: true/false', use:'API gateway memory leak simulation, cache eviction behavior under memory pressure', blast:'Per-pod' },
            { type:'Disk I/O Slowdown', params:'read_delay_ms: 10-1000, write_delay_ms: 10-1000, iops_limit: 10-1000', use:'Audit log write latency, DB WAL write performance degradation', blast:'Per-pod / Per-volume' },
            { type:'Process Kill', params:'signal: SIGKILL/SIGTERM, target_process: name, restart_delay_seconds: 0-300', use:'Core banking service crash, payment processor unexpected termination', blast:'Per-pod' },
            { type:'DNS Failure', params:'target_domains: list, failure_type: NXDOMAIN/TIMEOUT/WRONG_IP, duration_seconds', use:'Payment gateway DNS resolution failure, external API endpoint unreachable', blast:'Per-pod / Per-namespace' },
            { type:'Certificate Expiry', params:'target_service: name, expire_in_seconds: 0, force_renewal: false', use:'TLS certificate expiry between microservices, mTLS failure in service mesh', blast:'Per-service' }
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:600, minWidth:140 }}>{r.type}</td>
              <td style={{ ...tdStyle, fontSize:12, fontFamily:'monospace', color:C.editorText }}>{r.params}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.use}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.blast}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderScenarios = () => (
    <div>
      <h2 style={sectionTitle}>Chaos Engineering Scenarios</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 comprehensive chaos engineering scenarios covering infrastructure failures, application faults, database disruptions, network partitions, and cascading failure simulations for Indian banking systems.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width:50 }}>#</th>
            <th style={thStyle}>Scenario</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Expected Outcome</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id:'S01', title:'Kill Payment Processing Pod', reg:'Application', desc:'Terminate the primary payment processing pod (UPI/IMPS handler) using SIGKILL. Kubernetes should detect the pod failure and reschedule within 30 seconds. In-flight transactions should be retried by upstream services.', outcome:'Pod rescheduled within 30s, zero failed transactions, retry mechanism handles in-flight payments, no duplicate debits, MTTR < 45 seconds.' },
            { id:'S02', title:'Inject 500ms Database Latency', reg:'Database', desc:'Inject 500ms latency on all read/write operations to PostgreSQL primary. Simulate cross-DC replication lag during network congestion. Monitor transaction throughput degradation and timeout behavior.', outcome:'Throughput drops 20-30%, no transaction failures, circuit breaker activates for non-critical reads, critical writes succeed within SLA, latency P99 < 2s.' },
            { id:'S03', title:'Core Banking Full Outage Simulation', reg:'Application', desc:'Simulate complete CBS outage by killing all CBS pods simultaneously. Validate that payment services gracefully degrade, queued transactions are preserved in Kafka, and CBS recovery triggers automatic replay.', outcome:'Payment services return 503 for CBS-dependent operations, Kafka retains messages, CBS auto-recovery within 2 min, queued transactions replayed successfully, zero data loss.' },
            { id:'S04', title:'Availability Zone Network Partition', reg:'Network', desc:'Create a network partition between AZ-A and AZ-B. PostgreSQL primary in AZ-A, replica in AZ-B. Validate split-brain prevention (Patroni), client failover, and data consistency after partition heals.', outcome:'Patroni prevents split-brain, clients failover to available AZ, replication catches up after partition heals, zero data inconsistency, partition detection < 10s.' },
            { id:'S05', title:'API Gateway Memory Leak Simulation', reg:'Application', desc:'Gradually increase memory consumption of the API Gateway (Kong/APISIX) at 50MB/minute. Monitor when OOM killer triggers, how traffic reroutes to healthy instances, and whether rate limiting state is preserved.', outcome:'OOM triggered at memory limit, LB routes traffic to healthy instances within 5s, rate limiting state recovered from Redis, no request loss during failover.' },
            { id:'S06', title:'Disk Full on Audit Log Server', reg:'Infrastructure', desc:'Fill disk to 100% on the audit log server. Validate that banking services continue processing transactions (log buffering), alerts fire for disk space, and log rotation/cleanup restores capacity.', outcome:'Banking services continue with in-memory log buffer, disk alert fires at 85% and 95%, log rotation frees space, buffered logs written after recovery, compliance log chain unbroken.' },
            { id:'S07', title:'DNS Failure for Payment Gateway', reg:'Network', desc:'Inject DNS resolution failure (NXDOMAIN) for the external payment gateway endpoint (NPCI/card network). Validate DNS caching behavior, fallback to cached IPs, and graceful degradation of payment channels.', outcome:'Cached DNS entries serve for TTL period, payment processing continues for TTL duration, new DNS queries fail gracefully, alert fires within 30s, manual DNS override available.' },
            { id:'S08', title:'SSL Certificate Expiry Simulation', reg:'Security', desc:'Force-expire the TLS certificate on the inter-service communication channel between payment service and fraud detection. Validate certificate rotation automation, mTLS fallback, and service mesh behavior.', outcome:'Istio/Envoy detects cert expiry, auto-rotation triggers, service mesh handles mTLS renegotiation, temporary degradation < 30s, no plaintext fallback allowed.' },
            { id:'S09', title:'Kafka Broker Failure', reg:'Infrastructure', desc:'Kill one of three Kafka brokers in the cluster. Validate partition leader re-election, consumer rebalance, message ordering preservation, and producer retry behavior for banking event streams.', outcome:'Partition leaders re-elected within 10s, consumer group rebalances within 30s, zero message loss, message ordering preserved within partitions, producer retries succeed.' },
            { id:'S10', title:'Redis Sentinel Node Failure', reg:'Database', desc:'Kill the Redis primary node in the Sentinel-managed cluster. Validate automatic failover to replica, session state preservation, cache warming behavior, and rate limiting state recovery.', outcome:'Sentinel promotes replica within 15s, session state preserved (Redis persistence), cache miss rate spike temporary, rate limiting recovers from new primary, zero session loss.' },
            { id:'S11', title:'PostgreSQL Primary Failover (Patroni)', reg:'Database', desc:'SIGKILL the PostgreSQL primary managed by Patroni. Validate automatic leader election, replica promotion, application connection pool reconnection, and zero-downtime failover for banking transactions.', outcome:'Patroni promotes replica within 10s, connection pools reconnect within 5s, zero failed transactions during failover, replication lag catches up within 30s, data consistency verified.' },
            { id:'S12', title:'Load Balancer Health Check Failure', reg:'Infrastructure', desc:'Make all backend instances fail their health check endpoint (/api/health returning 503). Validate LB behavior with all backends unhealthy, last-resort routing, and automatic recovery detection.', outcome:'LB enters degraded mode, returns 503 to clients with retry-after header, alerts fire immediately, automatic recovery when health checks pass, no traffic to unhealthy backends.' },
            { id:'S13', title:'Fraud Detection Service Timeout', reg:'Application', desc:'Inject 30-second timeout on the fraud detection service response. Validate that payment processing does not hang indefinitely, circuit breaker trips, and transactions are processed with fallback risk scoring.', outcome:'Circuit breaker trips after 3 failed calls, payments proceed with fallback risk rules, fraud service calls bypass for 30s, circuit half-opens to test recovery, audit log captures bypass events.' },
            { id:'S14', title:'Message Queue Backpressure (100K Pending)', reg:'Infrastructure', desc:'Flood Kafka topic with 100K messages (simulating transaction spike during salary day). Validate consumer lag handling, backpressure propagation, producer throttling, and ordered processing under load.', outcome:'Consumers scale horizontally (auto-scaling), lag reduces within 10 min, no message loss, ordering preserved, producer receives backpressure signal, dead letter queue handles poison messages.' },
            { id:'S15', title:'CPU Spike on Settlement Service', reg:'Infrastructure', desc:'Inject 100% CPU utilization on all cores of the settlement service pod for 5 minutes. Validate request queuing, timeout behavior, horizontal pod autoscaler response, and settlement batch integrity.', outcome:'HPA scales pods within 2 min, queued requests served after scale-up, settlement batch completes (delayed but correct), no data corruption, CPU alert fires within 30s.' },
            { id:'S16', title:'DDoS Simulation (Layer 7)', reg:'Security', desc:'Generate 10x normal traffic volume against the banking API gateway. Validate rate limiting activation, WAF rules, legitimate user prioritization, and graceful degradation under sustained high load.', outcome:'Rate limiter activates at threshold, WAF blocks malicious patterns, legitimate users experience < 2x latency, API gateway does not crash, auto-scaling adds capacity within 3 min.' },
            { id:'S17', title:'Connection Pool Exhaustion', reg:'Application', desc:'Exhaust all database connection pool slots by injecting long-running queries. Validate connection pool overflow behavior, queue timeout handling, and connection release under pressure.', outcome:'New connections queued with timeout, queue overflow returns 503 with retry-after, long-running queries killed after timeout, connection pool recovers after release, health check detects pool saturation.' },
            { id:'S18', title:'Circuit Breaker Trip and Recovery', reg:'Application', desc:'Force the circuit breaker for the core banking service to trip (by injecting 50% error rate). Validate fallback responses, half-open testing, automatic recovery, and metrics reporting during circuit open state.', outcome:'Circuit opens after error threshold, fallback responses served (cached/degraded), half-open test after 30s, circuit closes after 3 successful probes, full recovery within 2 min, metrics report all transitions.' },
            { id:'S19', title:'Data Center Power Failure Simulation', reg:'Infrastructure', desc:'Simulate complete data center power failure by shutting down all pods in AZ-A simultaneously. Validate GSLB failover to AZ-B, data consistency, RTO/RPO compliance, and runbook execution.', outcome:'GSLB detects DC failure within 30s, traffic routes to AZ-B, RPO met (async replication lag < 15min data), RTO < 15 min for full service restoration, runbook executed successfully, DR report generated.' },
            { id:'S20', title:'Gradual Traffic Increase to Breaking Point', reg:'Performance', desc:'Linearly increase traffic from 1x to 20x normal load over 30 minutes. Identify the breaking point where services start degrading, measure degradation patterns, and validate graceful behavior at limits.', outcome:'Breaking point identified at Nx load, graceful degradation (not crash), error rate increases linearly (not exponentially), auto-scaling maxes out at configured limit, load shedding activates for low-priority traffic.' }
          ].map((s, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:700, textAlign:'center' }}>{s.id}</td>
              <td style={{ ...tdStyle, fontWeight:600, color:C.header, minWidth:200 }}>{s.title}</td>
              <td style={{ ...tdStyle, textAlign:'center' }}>{badge(
                s.reg === 'Application' ? C.info : s.reg === 'Database' ? C.warn : s.reg === 'Network' ? C.danger : s.reg === 'Infrastructure' ? C.accent : s.reg === 'Security' ? C.danger : C.success,
                s.reg
              )}</td>
              <td style={{ ...tdStyle, fontSize:12, maxWidth:300 }}>{s.desc}</td>
              <td style={{ ...tdStyle, fontSize:12, maxWidth:250 }}>{s.outcome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTestCases = () => (
    <div>
      <h2 style={sectionTitle}>Chaos Engineering Test Cases</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 detailed test cases for chaos engineering experiments with steady state hypotheses, fault injection methods, blast radius controls, expected behaviors, and rollback plans.
      </p>
      <div style={{ overflowX:'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, minWidth:90 }}>TC-ID</th>
              <th style={{ ...thStyle, minWidth:170 }}>Experiment</th>
              <th style={{ ...thStyle, minWidth:200 }}>Steady State Hypothesis</th>
              <th style={{ ...thStyle, minWidth:150 }}>Fault Method</th>
              <th style={{ ...thStyle, minWidth:100 }}>Blast Radius</th>
              <th style={{ ...thStyle, minWidth:200 }}>Expected Behavior</th>
              <th style={{ ...thStyle, minWidth:150 }}>Rollback Plan</th>
              <th style={{ ...thStyle, minWidth:60 }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id:'TC-CH-001', title:'Payment Pod Kill Recovery', hypothesis:'Payment API error rate < 0.1%, latency P99 < 500ms, throughput > 200 TPS during and after pod termination', fault:'SIGKILL payment-service-0 pod via Litmus ChaosEngine, Kubernetes reschedule', blast:'1 of 3 pods (33%)', expected:'Pod rescheduled in < 30s, LB removes unhealthy pod in < 5s, in-flight requests retried by client, zero failed user transactions', rollback:'kubectl rollout restart deployment/payment-service, verify 3/3 pods ready', pri:'P0' },
              { id:'TC-CH-002', title:'Database Latency Injection', hypothesis:'Transaction success rate > 99.5%, no timeouts on critical path, settlement batch completes within SLA', fault:'ToxiProxy inject 500ms latency on PostgreSQL port 5432, affect 100% of connections', blast:'All DB connections from payment service', expected:'Throughput drops 25%, circuit breaker activates for non-critical reads, critical writes succeed with extended timeout, P99 latency < 2s', rollback:'Remove ToxiProxy toxic, verify latency returns to baseline < 5ms', pri:'P0' },
              { id:'TC-CH-003', title:'CBS Complete Outage Recovery', hypothesis:'Payment queue preserves all messages during outage, CBS recovers within 2 min, queued transactions replay successfully with zero data loss', fault:'Scale CBS deployment to 0 replicas for 2 minutes, then restore to 3 replicas', blast:'All CBS pods (100% outage)', expected:'Payment services return 503 for CBS operations, Kafka retains 100% of messages, CBS pods start within 90s, message replay completes within 5 min', rollback:'kubectl scale deployment/cbs --replicas=3, monitor pod readiness, run data reconciliation', pri:'P0' },
              { id:'TC-CH-004', title:'AZ Network Partition', hypothesis:'Services in healthy AZ continue processing, Patroni prevents split-brain, data consistency maintained after healing', fault:'iptables DROP between AZ-A and AZ-B subnets via Chaos Mesh NetworkChaos', blast:'Inter-AZ traffic only (intra-AZ unaffected)', expected:'Patroni fences AZ-B replica, clients failover to AZ-A services, partition heals and replication catches up within 60s', rollback:'Remove iptables rules, verify network connectivity, check replication status', pri:'P0' },
              { id:'TC-CH-005', title:'API Gateway Memory Leak', hypothesis:'Gateway handles traffic normally until OOM, LB failover completes in < 5s, rate limiting state recovered from Redis', fault:'Stress-ng memory worker consuming 50MB/min on gateway pod until OOM kill', blast:'1 of 4 gateway pods (25%)', expected:'OOM killer triggers at container memory limit, LB detects unhealthy instance in < 5s, traffic reroutes seamlessly, new pod scheduled', rollback:'Delete OOM-killed pod, verify new pod healthy, check rate limit state in Redis', pri:'P1' },
              { id:'TC-CH-006', title:'Audit Disk Full Scenario', hypothesis:'Banking services continue processing with in-memory log buffer, disk alert fires at 85%, no compliance log gaps', fault:'dd if=/dev/zero of=/var/log/audit/fill bs=1M to fill disk to 100%', blast:'Audit log server only (single node)', expected:'Services buffer logs in memory (100MB buffer), disk alerts at 85% and 95%, log rotation triggered, buffered logs flushed after cleanup', rollback:'rm /var/log/audit/fill, trigger log rotation, verify log continuity', pri:'P1' },
              { id:'TC-CH-007', title:'Payment Gateway DNS Failure', hypothesis:'Cached DNS entries serve for TTL duration, payment processing continues during TTL, alert fires within 30s', fault:'Chaos Mesh DNSChaos inject NXDOMAIN for npci.gateway.bank.internal', blast:'DNS resolution for payment gateway only', expected:'Cached DNS serves for TTL (300s), new connections fail after TTL, fallback to hardcoded IP if configured, alert fires for DNS failure', rollback:'Remove DNSChaos resource, flush DNS cache, verify resolution working', pri:'P0' },
              { id:'TC-CH-008', title:'Inter-Service TLS Cert Expiry', hypothesis:'Service mesh handles cert rotation automatically, temporary degradation < 30s, no plaintext communication allowed', fault:'Istio cert rotation forced with expired intermediate CA via cert-manager', blast:'mTLS between payment and fraud services', expected:'Envoy sidecar detects cert expiry, auto-rotation triggers within 10s, mTLS renegotiation completes, no plaintext fallback', rollback:'Restore valid CA certificate, restart Istio pilot, verify mTLS status on all pods', pri:'P1' },
              { id:'TC-CH-009', title:'Kafka Broker Failure Recovery', hypothesis:'Partition leaders re-elect within 10s, zero message loss, consumer rebalance within 30s, ordering preserved', fault:'Kill kafka-broker-1 pod (1 of 3 brokers) via Litmus pod-delete', blast:'1 of 3 Kafka brokers (33%)', expected:'ISR shrinks, leader election for affected partitions in < 10s, consumers rebalance, producers retry successfully, zero message loss verified', rollback:'Restart kafka-broker-1 pod, wait for ISR recovery, verify partition balance', pri:'P0' },
              { id:'TC-CH-010', title:'Redis Sentinel Failover', hypothesis:'Sentinel promotes replica within 15s, session data preserved, rate limiting state recovered', fault:'Kill redis-primary pod, Sentinel detects failure and promotes replica', blast:'Redis primary node only', expected:'Sentinel detects failure in < 5s, promotes replica in < 15s, application reconnects, session data available from new primary', rollback:'Verify new primary healthy, add old primary as replica, check data consistency', pri:'P0' },
              { id:'TC-CH-011', title:'Patroni DB Primary Failover', hypothesis:'Replica promoted within 10s, connection pools reconnect in 5s, zero failed banking transactions, replication catches up in 30s', fault:'SIGKILL postgres process on patroni-primary-0 pod', blast:'PostgreSQL primary pod only', expected:'Patroni detects failure, promotes sync replica, applications reconnect via PgBouncer, zero transaction failures, old primary rejoins as replica', rollback:'Verify new primary, check replication lag, run pg_rewind on old primary if needed', pri:'P0' },
              { id:'TC-CH-012', title:'LB Health Check Total Failure', hypothesis:'LB returns 503 with retry-after, alerts fire immediately, auto-recovery when health restores', fault:'Modify /api/health endpoint to return 503 on all backend pods', blast:'All backend instances (100%)', expected:'LB removes all backends, returns 503 to clients, fires critical alert, enters last-resort mode if configured, recovers when health restored', rollback:'Revert health endpoint to return 200, verify LB adds backends back, check traffic flow', pri:'P1' },
              { id:'TC-CH-013', title:'Fraud Service Timeout Cascade', hypothesis:'Circuit breaker trips after 3 failures, payments proceed with fallback risk scoring, bypass events logged', fault:'ToxiProxy inject 30s timeout on fraud-detection-service port 8080', blast:'All calls to fraud service (100%)', expected:'Circuit breaker trips after 3 timeouts (90s), payments use fallback rules, fraud service calls skipped for 30s, half-open test after 30s', rollback:'Remove ToxiProxy toxic, reset circuit breaker state, verify fraud service responsive', pri:'P0' },
              { id:'TC-CH-014', title:'100K Message Backpressure', hypothesis:'Consumers auto-scale, lag reduces within 10 min, no message loss, dead letter queue handles failures', fault:'Produce 100K messages to banking-transactions topic in 60 seconds', blast:'Kafka transaction topic consumers', expected:'Consumer lag spikes, HPA scales consumers from 3 to 10, lag reduces within 10 min, zero message loss, 0.1% to dead letter queue', rollback:'Stop message producer, scale consumers manually if HPA fails, drain dead letter queue', pri:'P1' },
              { id:'TC-CH-015', title:'Settlement CPU Saturation', hypothesis:'HPA scales pods within 2 min, settlement batch delayed but correct, CPU alert fires in 30s', fault:'stress-ng --cpu 0 --timeout 300s on settlement-service pod (all cores)', blast:'1 of 2 settlement pods (50%)', expected:'CPU alert fires in 30s, HPA triggers scale-up, new pod ready in 90s, settlement batch queued and completed after scale-up, no data corruption', rollback:'Kill stress-ng process, verify CPU returns to normal, check settlement batch status', pri:'P1' },
              { id:'TC-CH-016', title:'DDoS Layer 7 Resilience', hypothesis:'Rate limiter activates, WAF blocks attacks, legitimate users < 2x latency, gateway stable', fault:'k6 load test: 10x traffic for 10 min with mixed GET/POST against API gateway', blast:'API gateway (all endpoints)', expected:'Rate limiter activates at 1000 RPS per IP, WAF blocks suspicious patterns, legitimate traffic served with < 2x latency, auto-scaling adds capacity', rollback:'Stop k6 load test, verify rate limiter state, check WAF logs for false positives', pri:'P1' },
              { id:'TC-CH-017', title:'DB Connection Pool Exhaustion', hypothesis:'Queue overflow returns 503, long-running queries killed, pool recovers after timeout, health check detects saturation', fault:'Inject 50 concurrent long-running queries (SELECT pg_sleep(300)) to exhaust pool', blast:'PostgreSQL connection pool (max_connections)', expected:'Pool saturated in 10s, new requests queued, queue timeout returns 503, health check reports pool saturation, recovery after query timeout', rollback:'Kill long-running queries (pg_terminate_backend), verify pool connections released, restart connection pool', pri:'P0' },
              { id:'TC-CH-018', title:'Circuit Breaker Full Lifecycle', hypothesis:'Circuit opens after threshold, fallback responses served, half-open tests recovery, full closure within 2 min', fault:'Inject 50% HTTP 500 error rate on core-banking-service via Istio fault injection', blast:'50% of requests to CBS', expected:'Circuit opens after 10 consecutive failures, fallback (cached) responses served, half-open after 30s, 3 successful probes close circuit, metrics captured', rollback:'Remove Istio fault injection VirtualService, verify error rate drops to 0%, circuit fully closed', pri:'P0' },
              { id:'TC-CH-019', title:'Full DC Evacuation Drill', hypothesis:'GSLB failover in 30s, AZ-B handles full load, RPO < 15 min, RTO < 15 min, runbook works', fault:'Shutdown all pods in AZ-A namespace (kubectl delete pods --all -n banking-aza)', blast:'All services in AZ-A (full DC)', expected:'GSLB routes 100% traffic to AZ-B in < 30s, AZ-B auto-scales for full load, RPO met, RTO within 15 min, runbook steps validated', rollback:'Restart all AZ-A deployments, verify pod health, rebalance GSLB traffic, run reconciliation', pri:'P0' },
              { id:'TC-CH-020', title:'Traffic Ramp to Breaking Point', hypothesis:'Identify breaking point, graceful degradation (no crash), error rate linear increase, load shedding activates', fault:'Gatling ramp from 1x to 20x load over 30 min with realistic banking transaction mix', blast:'All services (progressive load)', expected:'Breaking point identified at ~12x, degradation starts at ~8x, error rate increases linearly, load shedding drops low-priority at 10x, no crash at 20x', rollback:'Stop Gatling test, verify all services recover to baseline within 5 min, check data integrity', pri:'P1' }
            ].map((tc, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
                <td style={{ ...tdStyle, color:C.accent, fontWeight:700, fontSize:12 }}>{tc.id}</td>
                <td style={{ ...tdStyle, fontWeight:600, color:C.header, fontSize:12 }}>{tc.title}</td>
                <td style={{ ...tdStyle, fontSize:11 }}>{tc.hypothesis}</td>
                <td style={{ ...tdStyle, fontSize:11, fontFamily:'monospace', color:C.editorText }}>{tc.fault}</td>
                <td style={{ ...tdStyle, fontSize:11, textAlign:'center' }}>{tc.blast}</td>
                <td style={{ ...tdStyle, fontSize:11 }}>{tc.expected}</td>
                <td style={{ ...tdStyle, fontSize:11 }}>{tc.rollback}</td>
                <td style={{ ...tdStyle, textAlign:'center' }}>{badge(tc.pri === 'P0' ? C.danger : C.warn, tc.pri)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderC4Model = () => (
    <div>
      <h2 style={sectionTitle}>C4 Model - Chaos Engineering Platform</h2>

      <h3 style={subTitle}>Level 1: System Context</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                C4 MODEL - LEVEL 1: SYSTEM CONTEXT                       |
  +=========================================================================+

                          +-------------------+
                          |  SRE / Platform    |
                          |  Engineers         |
                          +--------+----------+
                                   |
                          Define & Run Experiments
                                   |
                                   v
  +----------------+    +========================+    +-------------------+
  |  Approval      |    |                        |    | Banking System    |
  |  System        |<-->|  CHAOS ENGINEERING     |<-->| Under Test        |
  |  - Peer Review |    |  PLATFORM              |    |                   |
  |  - Manager OK  |    |                        |    | - Core Banking    |
  |  - CISO Sign   |    | Orchestrates chaos     |    | - Payments        |
  +----------------+    | experiments against    |    | - Fraud Detection |
                        | banking infrastructure |    | - Reconciliation  |
  +----------------+    | with safety controls   |    | - Notifications   |
  |  Observability |<-->|                        |    +-------------------+
  |  Stack         |    +========================+
  |  - Prometheus  |               ^                  +-------------------+
  |  - Grafana     |               |                  | Infrastructure    |
  |  - PagerDuty   |    +----------+----------+       |                   |
  |  - Jaeger      |    |  Incident Mgmt      |       | - Kubernetes      |
  +----------------+    |  - Runbooks          |       | - PostgreSQL      |
                        |  - Post-mortems      |       | - Redis           |
                        |  - GameDay Reports   |       | - Kafka           |
                        +---------------------+       | - Istio/Envoy     |
                                                       +-------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 2: Container Diagram</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                C4 MODEL - LEVEL 2: CONTAINERS                           |
  +=========================================================================+

  +-------------------------------------------------------------------------+
  |                      CHAOS ENGINEERING PLATFORM                          |
  |                                                                          |
  |  +------------------+  +------------------+  +---------------------+    |
  |  | Experiment       |  | Fault Injection  |  | Steady State        |    |
  |  | Manager          |  | Engine           |  | Validator           |    |
  |  | [Go/gRPC]        |  | [Go/Python]      |  | [Go/PromQL]         |    |
  |  |                  |  |                  |  |                     |    |
  |  | - CRUD lifecycle |  | - Network faults |  | - Baseline capture  |    |
  |  | - Scheduling     |  | - Process kill   |  | - Continuous probes |    |
  |  | - Approval flow  |  | - Resource stress|  | - Threshold eval    |    |
  |  | - History/audit  |  | - DNS/TLS faults |  | - Deviation detect  |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------+  +---------------------+    |
  |  | Blast Radius     |  | Rollback Engine  |  | Reporting &         |    |
  |  | Controller       |  | [Go/K8s API]     |  | Analytics           |    |
  |  | [Go/K8s API]     |  |                  |  | [Python/React]      |    |
  |  |                  |  | - State snapshot  |  |                     |    |
  |  | - Scope limiting |  | - Auto-rollback  |  | - Experiment reports|    |
  |  | - Traffic %      |  | - Health verify  |  | - Trend analysis    |    |
  |  | - Kill switch    |  | - Reconciliation |  | - MTTR tracking     |    |
  |  | - Duration guard |  | - Notification   |  | - GameDay summaries |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------------------------------+    |
  |  | Approval &       |  | Notification Hub                          |    |
  |  | Auth Gateway     |  | [Go/Webhooks]                             |    |
  |  | [Go/OIDC]        |  |                                           |    |
  |  |                  |  | - Slack integration                       |    |
  |  | - RBAC policies  |  | - PagerDuty alerts                       |    |
  |  | - Approval chain |  | - Email notifications                    |    |
  |  | - Audit logging  |  | - Webhook callbacks                      |    |
  |  +------------------+  +------------------------------------------+    |
  |                                                                          |
  |  +------------------------------------------------------------------+  |
  |  | Data Layer                                                        |  |
  |  | PostgreSQL (Experiments/Runs) | Prometheus (Metrics) | S3 (Reports)|  |
  |  | Redis (State/Locks)           | Elasticsearch (Logs) | etcd (K8s)  |  |
  |  +------------------------------------------------------------------+  |
  +-------------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 3: Component Diagram</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                C4 MODEL - LEVEL 3: COMPONENTS                           |
  +=========================================================================+

  Fault Injection Engine [Container] - Component Breakdown:

  +------------------------------------------------------------------+
  |                                                                    |
  |  +------------------+     +-------------------+                    |
  |  | FaultRegistry    |---->| FaultScheduler     |                    |
  |  | - Fault types    |     | - Timing control   |                    |
  |  | - Config schemas |     | - Ramp-up/down     |                    |
  |  | - Validation     |     | - Duration guard   |                    |
  |  | - Templating     |     | - Kill switch      |                    |
  |  +------------------+     +--------+-----------+                    |
  |                                     |                               |
  |  +------------------+              v                               |
  |  | NetworkFaultInj  |     +-------------------+                    |
  |  | - tc/netem       |     | FaultExecutor      |                    |
  |  | - iptables       |     | - K8s API calls    |                    |
  |  | - DNS intercept  |     | - Pod exec         |                    |
  |  | - TLS manipulate |     | - Sidecar inject   |                    |
  |  +------------------+     | - Network policy   |                    |
  |                            +--------+----------+                    |
  |  +------------------+              |                               |
  |  | ResourceFaultInj |              v                               |
  |  | - stress-ng      |     +-------------------+                    |
  |  | - cgroups        |     | SafetyGuard        |                    |
  |  | - OOM trigger    |     | - Blast radius     |                    |
  |  | - disk fill      |     | - Duration limit   |                    |
  |  +------------------+     | - Threshold watch  |                    |
  |                            | - Emergency stop   |                    |
  |  +------------------+     +--------+----------+                    |
  |  | ProcessFaultInj  |              |                               |
  |  | - SIGKILL/TERM   |              v                               |
  |  | - Pod delete     |     +-------------------+                    |
  |  | - Container stop |     | MetricsCollector   |                    |
  |  | - Deployment     |     | - PromQL queries   |                    |
  |  |   scale          |     | - Trace collection |                    |
  |  +------------------+     | - Log aggregation  |                    |
  |                            | - Event timeline   |                    |
  |                            +-------------------+                    |
  +------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 4: Code (Key Classes)</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                C4 MODEL - LEVEL 4: CODE                                 |
  +=========================================================================+

  class ChaosOrchestrator:
      def __init__(self, fault_engine, steady_state_validator, rollback_engine, blast_controller):
          self.fault_engine = fault_engine
          self.steady_state = steady_state_validator
          self.rollback = rollback_engine
          self.blast = blast_controller

      def execute_experiment(self, experiment: Experiment) -> ExperimentResult:
          # 1. Capture baseline steady state
          baseline = self.steady_state.capture_baseline(experiment.probes)

          # 2. Set blast radius controls
          self.blast.configure(experiment.blast_radius)
          self.rollback.save_state(experiment.target)

          # 3. Inject fault
          fault_result = self.fault_engine.inject(experiment.fault_config)

          # 4. Monitor steady state
          while not self.blast.duration_exceeded():
              metrics = self.steady_state.evaluate(experiment.probes)
              if not metrics.hypothesis_maintained:
                  self.rollback.execute(experiment.rollback_plan)
                  return ExperimentResult(status="ROLLED_BACK", metrics=metrics)

          # 5. Cleanup and report
          self.fault_engine.cleanup(fault_result)
          return ExperimentResult(status="COMPLETED", metrics=metrics, baseline=baseline)

  class SteadyStateValidator:
      def __init__(self, prometheus_client, config):
          self.prom = prometheus_client
          self.evaluation_interval = config.EVAL_INTERVAL_SECONDS

      def capture_baseline(self, probes: list[Probe]) -> Baseline:
          results = {}
          for probe in probes:
              value = self.prom.query(probe.promql_query)
              results[probe.name] = BaselineMetric(value=value, threshold=probe.threshold)
          return Baseline(metrics=results, captured_at=datetime.utcnow())

      def evaluate(self, probes: list[Probe]) -> EvaluationResult:
          all_pass = True
          probe_results = []
          for probe in probes:
              current = self.prom.query(probe.promql_query)
              passed = probe.evaluate_threshold(current)
              probe_results.append(ProbeResult(name=probe.name, value=current, passed=passed))
              if not passed:
                  all_pass = False
          return EvaluationResult(hypothesis_maintained=all_pass, probes=probe_results)

  class BlastRadiusController:
      def __init__(self, k8s_client, config):
          self.k8s = k8s_client
          self.max_duration = config.MAX_EXPERIMENT_DURATION
          self.max_percentage = config.MAX_BLAST_PERCENTAGE
          self.start_time = None

      def configure(self, blast_config: BlastConfig):
          if blast_config.percentage > self.max_percentage:
              raise BlastRadiusExceeded(f"Requested {blast_config.percentage}% exceeds max {self.max_percentage}%")
          self.start_time = datetime.utcnow()
          self.configured_duration = min(blast_config.max_duration, self.max_duration)

      def duration_exceeded(self) -> bool:
          elapsed = (datetime.utcnow() - self.start_time).total_seconds()
          return elapsed >= self.configured_duration

  class RollbackEngine:
      def __init__(self, k8s_client, notification_service):
          self.k8s = k8s_client
          self.notifier = notification_service
          self.saved_state = None

      def save_state(self, target: Target):
          self.saved_state = self.k8s.snapshot(target.namespace, target.selector)

      def execute(self, rollback_plan: RollbackPlan) -> RollbackResult:
          self.notifier.send("Rollback initiated", severity="CRITICAL")
          results = []
          for action in rollback_plan.actions:
              result = self._execute_action(action)
              results.append(result)
              if not result.success:
                  self.notifier.send(f"Rollback action failed: {action.type}", severity="CRITICAL")
          return RollbackResult(actions=results, state_restored=all(r.success for r in results))
`}</pre>
    </div>
  );

  const renderTechStack = () => (
    <div>
      <h2 style={sectionTitle}>Technology Stack</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Comprehensive technology stack for chaos engineering and resilience testing in banking infrastructure.
      </p>
      <div style={gridStyle}>
        {[
          { cat:'Chaos Engineering Tools', items:[
            { name:'Chaos Monkey (Netflix)', desc:'Randomly terminates VM instances in production to ensure services can tolerate instance failures', use:'Random pod/instance termination in non-critical hours' },
            { name:'Litmus Chaos (CNCF)', desc:'Kubernetes-native chaos engineering framework with ChaosHub experiment library and CRD-based workflows', use:'Primary chaos orchestration on K8s clusters' },
            { name:'Gremlin', desc:'Enterprise chaos engineering platform with SaaS management, team collaboration, and safety controls', use:'Managed chaos experiments with approval workflows' },
            { name:'Chaos Toolkit', desc:'Open-source chaos engineering CLI with extensible drivers for AWS, K8s, Azure, and custom targets', use:'CI/CD pipeline integration for automated chaos tests' }
          ], color:C.accent },
          { cat:'Fault Injection & Proxy', items:[
            { name:'ToxiProxy (Shopify)', desc:'TCP proxy for simulating network conditions: latency, bandwidth, packet loss, timeout, and connection reset', use:'Database and service-to-service fault injection' },
            { name:'AWS Fault Injection Simulator', desc:'Managed service for running fault injection experiments on AWS infrastructure (EC2, ECS, RDS, EKS)', use:'AWS infrastructure chaos experiments' },
            { name:'Chaos Mesh (CNCF)', desc:'Kubernetes-native chaos engineering platform with rich fault types including network, disk, DNS, JVM, HTTP', use:'K8s pod-level fault injection with fine-grained control' },
            { name:'Pumba', desc:'Docker chaos testing and network emulation tool for container environments', use:'Docker container-level fault injection' }
          ], color:C.info },
          { cat:'Observability & Monitoring', items:[
            { name:'Prometheus', desc:'Time-series metrics database with PromQL query language, service discovery, and alerting rules', use:'Steady state metrics collection and threshold evaluation' },
            { name:'Grafana', desc:'Visualization platform for metrics dashboards, alerting, and experiment progress tracking', use:'Real-time chaos experiment dashboards and SLO tracking' },
            { name:'Datadog', desc:'Cloud-scale monitoring platform with APM, infrastructure metrics, log management, and synthetic monitoring', use:'Full-stack observability during chaos experiments' },
            { name:'PagerDuty', desc:'Incident management platform with on-call scheduling, escalation policies, and incident response automation', use:'Chaos experiment alerting and incident response coordination' }
          ], color:C.warn },
          { cat:'Container Orchestration', items:[
            { name:'Kubernetes', desc:'Container orchestration platform for deploying, scaling, and managing containerized banking applications', use:'Target platform for chaos experiments, pod disruption budgets' },
            { name:'Istio Service Mesh', desc:'Service mesh for traffic management, mTLS, circuit breaking, fault injection, and observability', use:'Traffic-level fault injection, circuit breaker testing, mTLS validation' },
            { name:'Envoy Proxy', desc:'High-performance edge/service proxy with advanced load balancing, circuit breaking, and health checking', use:'Sidecar proxy for service-level fault injection and monitoring' }
          ], color:C.success },
          { cat:'Load & Performance Testing', items:[
            { name:'k6 (Grafana)', desc:'Modern load testing tool with JavaScript scripting, cloud execution, and Prometheus/Grafana integration', use:'Load generation for breaking point analysis and DDoS simulation' },
            { name:'Gatling', desc:'High-performance load testing framework with Scala/Java DSL and detailed HTML reports', use:'Realistic banking transaction load simulation and ramp testing' },
            { name:'Locust', desc:'Python-based load testing tool with distributed execution and real-time web UI', use:'Custom banking scenario load testing with Python scripts' }
          ], color:C.danger },
          { cat:'Database & Data Resilience', items:[
            { name:'PostgreSQL Patroni', desc:'HA solution for PostgreSQL with automatic failover, leader election, and replication management', use:'Database failover testing, split-brain prevention, replication lag simulation' },
            { name:'Redis Sentinel', desc:'High availability solution for Redis with automatic failover, monitoring, and notification', use:'Cache failover testing, session persistence validation' },
            { name:'Kafka MirrorMaker 2', desc:'Cross-cluster Kafka replication for disaster recovery and geo-replication', use:'Cross-DC message replication testing, broker failure recovery' }
          ], color:C.accent },
          { cat:'Distributed Tracing & Logging', items:[
            { name:'OpenTelemetry', desc:'Vendor-neutral observability framework for traces, metrics, and logs with auto-instrumentation', use:'Distributed trace context propagation during chaos experiments' },
            { name:'Jaeger', desc:'Distributed tracing system for monitoring and troubleshooting microservice-based architectures', use:'Trace analysis during fault injection, latency breakdown' },
            { name:'ELK Stack (Elastic)', desc:'Elasticsearch, Logstash, Kibana for centralized log management, search, and visualization', use:'Chaos experiment log aggregation, error pattern analysis, audit trails' }
          ], color:C.info },
          { cat:'Infrastructure & Automation', items:[
            { name:'Terraform', desc:'Infrastructure as Code tool for provisioning and managing cloud infrastructure declaratively', use:'DR site provisioning, infrastructure state management' },
            { name:'Ansible', desc:'Automation platform for configuration management, application deployment, and orchestration', use:'Runbook automation, DR procedure scripting' },
            { name:'ArgoCD', desc:'Declarative GitOps continuous delivery tool for Kubernetes applications', use:'Automated rollback via GitOps, deployment state recovery' }
          ], color:C.warn }
        ].map((cat, i) => (
          <div key={i} style={{ ...cardStyle, gridColumn: 'span 1' }}>
            <h4 style={{ color:cat.color, fontSize:16, fontWeight:700, marginBottom:12, borderBottom:`1px solid ${C.border}`, paddingBottom:8 }}>{cat.cat}</h4>
            {cat.items.map((item, j) => (
              <div key={j} style={{ marginBottom:10, paddingBottom:8, borderBottom: j < cat.items.length - 1 ? `1px solid rgba(78,204,163,0.1)` : 'none' }}>
                <div style={{ color:C.header, fontWeight:600, fontSize:13 }}>{item.name}</div>
                <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>{item.desc}</div>
                <div style={{ color:cat.color, fontSize:11, marginTop:3, fontStyle:'italic' }}>Usage: {item.use}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSAD = () => (
    <div>
      <h2 style={sectionTitle}>Software Architecture Decisions (SAD)</h2>

      <h3 style={subTitle}>Key Architectural Decisions</h3>
      <div style={gridStyle}>
        {[
          { title:'ADR-001: Litmus Chaos as Primary Orchestrator', decision:'Use Litmus Chaos (CNCF) as the primary chaos engineering orchestrator for Kubernetes-based banking infrastructure.', rationale:'Litmus is Kubernetes-native with CRD-based workflows, provides a ChaosHub with pre-built experiments, supports GitOps integration via ArgoCD, and is a CNCF project with active community support. Its ChaosEngine/ChaosExperiment model maps well to banking experiment approval workflows.', tradeoff:'Limited to Kubernetes environments. Non-K8s infrastructure (bare-metal DBs, legacy CBS) requires Chaos Toolkit or Gremlin as supplementary tools. Learning curve for Litmus-specific CRDs and Go-based experiment authoring.', color:C.accent },
          { title:'ADR-002: Production Chaos with Blast Radius Controls', decision:'Run chaos experiments in production (not staging) with strict blast radius controls and automated rollback.', rationale:'Staging environments never accurately replicate production complexity (data volume, traffic patterns, infrastructure config). The only way to truly validate resilience is in production. Blast radius controls (max 5% traffic, duration limits, auto-rollback) make this safe. Netflix, Amazon, and Google all practice production chaos.', tradeoff:'Non-zero risk of customer impact despite controls. Requires mature observability, fast rollback, and organizational buy-in. Regulatory scrutiny from RBI on production testing - requires documented approval workflows and incident response readiness. Cannot run during peak banking hours (salary days, month-end).', color:C.danger },
          { title:'ADR-003: Automated Rollback Over Manual Recovery', decision:'Default to automated rollback when steady state hypothesis is violated, rather than relying on manual operator intervention.', rationale:'Human response time (minutes) is too slow for banking transaction systems where every second of downtime means failed payments. Automated rollback achieves < 60s recovery vs 5-15 min manual. Reduces dependency on operator availability during experiment windows.', tradeoff:'Automated rollback may trigger prematurely on transient metric spikes (false positives). Requires well-tuned thresholds to avoid premature termination. Complex rollback scenarios (data corruption) still need manual intervention. Over-reliance on automation may reduce operator expertise.', color:C.success },
          { title:'ADR-004: Prometheus-Based Steady State Validation', decision:'Use Prometheus with PromQL as the primary steady state hypothesis evaluation engine.', rationale:'Prometheus is already the standard metrics backend in banking K8s clusters. PromQL provides powerful query capability for complex SLI calculations. Real-time evaluation at configurable intervals (10s default). Native alerting integration with AlertManager for auto-rollback triggers.', tradeoff:'Prometheus has limited long-term storage (15d default). Historical experiment comparison requires Thanos/Cortex. PromQL complexity for business-level SLIs (transaction success rate across multiple services). Prometheus pull model may miss transient spikes between scrape intervals.', color:C.info },
          { title:'ADR-005: GameDay-Driven Culture Over Automated-Only', decision:'Combine automated chaos experiments (continuous) with monthly GameDay exercises (team-based, scenario-driven).', rationale:'Automated experiments validate technical resilience but miss human factors: runbook accuracy, team communication, decision-making under pressure, and cross-team coordination. GameDays simulate real incidents with time pressure, involve business stakeholders, and build organizational muscle memory for incident response.', tradeoff:'GameDays are expensive (team time, coordination overhead, 4-8 hours per session). Risk of "GameDay fatigue" if too frequent. Difficult to simulate truly realistic scenarios without impacting production. Requires executive sponsorship and business team participation.', color:C.warn },
          { title:'ADR-006: Experiment Approval Workflow for Banking', decision:'Implement a multi-level approval workflow (peer review, manager, CISO) for all production chaos experiments.', rationale:'Banking regulators (RBI) require documented approval for production testing activities. Multi-level approval ensures technical feasibility (peer), business impact assessment (manager), and security compliance (CISO). Creates audit trail for regulatory examination. Prevents unauthorized or poorly planned experiments.', tradeoff:'Approval overhead slows experiment velocity (24-72 hours vs immediate execution). May discourage engineers from proposing experiments. Risk of approval becoming a rubber stamp without genuine review. Need to balance safety with experimentation speed - fast-track for pre-approved experiment templates.', color:C.accent }
        ].map((d, i) => (
          <div key={i} style={{ ...cardStyle, borderLeft:`4px solid ${d.color}` }}>
            <h4 style={{ color:d.color, fontSize:15, fontWeight:700, marginBottom:8 }}>{d.title}</h4>
            <div style={{ marginBottom:8 }}>
              <span style={{ color:C.accent, fontWeight:600, fontSize:13 }}>Decision: </span>
              <span style={{ color:C.header, fontSize:13 }}>{d.decision}</span>
            </div>
            <div style={{ marginBottom:8 }}>
              <span style={{ color:C.success, fontWeight:600, fontSize:13 }}>Rationale: </span>
              <span style={{ color:C.text, fontSize:12, lineHeight:1.6 }}>{d.rationale}</span>
            </div>
            <div>
              <span style={{ color:C.warn, fontWeight:600, fontSize:13 }}>Trade-offs: </span>
              <span style={{ color:C.muted, fontSize:12, lineHeight:1.6 }}>{d.tradeoff}</span>
            </div>
          </div>
        ))}
      </div>

      <h3 style={sectionTitle}>Non-Functional Requirements & Constraints</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>NFR Category</th>
            <th style={thStyle}>Requirement</th>
            <th style={thStyle}>Target</th>
            <th style={thStyle}>Measurement</th>
          </tr>
        </thead>
        <tbody>
          {[
            { cat:'Safety', req:'Zero data loss during all chaos experiments. No transaction corruption, no orphaned records, no inconsistent state.', target:'0 bytes data loss', measure:'Post-experiment data reconciliation, checksum validation, transaction count audit' },
            { cat:'Recovery Time', req:'Automated rollback must complete within 60 seconds of steady state violation detection.', target:'Rollback < 60s', measure:'Time from threshold breach to full recovery (Prometheus metrics)' },
            { cat:'Blast Radius', req:'Maximum blast radius for any experiment must not exceed configured limits. Kill switch must work within 10 seconds.', target:'< 5% traffic (default)', measure:'Traffic analysis during experiment, kill switch response time measurement' },
            { cat:'Availability', req:'Chaos platform itself must be highly available. Platform failure must not leave experiments in an uncontrollable state.', target:'99.9% platform uptime', measure:'Platform health checks, orphan experiment detection, dead man switch' },
            { cat:'Audit & Compliance', req:'All experiments must have full audit trail: who, what, when, why, approval chain, results, and post-mortem.', target:'100% audit coverage', measure:'Audit log completeness check, RBI BCP compliance report generation' },
            { cat:'Observability', req:'Real-time visibility into experiment progress, steady state metrics, and system health during all experiments.', target:'< 10s metric lag', measure:'Prometheus scrape interval, Grafana dashboard refresh rate, alert latency' },
            { cat:'Scalability', req:'Platform must support concurrent experiments across multiple clusters and namespaces without interference.', target:'10 concurrent experiments', measure:'Concurrent experiment execution test, resource isolation validation' },
            { cat:'DR Compliance', req:'Full DR drill must be completed semi-annually per RBI BCP requirements. Results documented for regulatory submission.', target:'2 DR drills/year', measure:'DR drill completion reports, RTO/RPO achievement records, board presentation' }
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:600, fontSize:13 }}>{r.cat}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.req}</td>
              <td style={{ ...tdStyle, fontSize:13, color:C.warn, fontWeight:600 }}>{r.target}</td>
              <td style={{ ...tdStyle, fontSize:12 }}>{r.measure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFlowchart = () => (
    <div>
      <h2 style={sectionTitle}>Chaos Experiment Execution Flowchart</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        End-to-end flow of a chaos experiment from hypothesis definition through approval, execution, monitoring, and reporting with decision points for rollback and escalation.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |        CHAOS EXPERIMENT EXECUTION - DETAILED FLOWCHART                   |
  +=========================================================================+

                        +---------------------+
                        |  Define Steady State |
                        |  Hypothesis          |
                        |  - What SLIs matter  |
                        |  - Threshold values  |
                        |  - Evaluation period |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Design Experiment   |
                        |  - Fault type        |
                        |  - Target service    |
                        |  - Duration          |
                        |  - Blast radius      |
                        |  - Rollback plan     |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Submit for Approval |
                        |  - Peer review       |
                        |  - Risk assessment   |
                        |  - Business impact   |
                        +----------+----------+
                                   |
                          +--------+--------+
                          |                 |
                          v                 v
                   +------------+    +------------+
                   | REJECTED   |    | APPROVED   |
                   | - Too risky|    |            |
                   | - Scope too|    +------+-----+
                   |   wide     |           |
                   | - Fix and  |           v
                   |   resubmit |    +---------------------+
                   +------------+    | Set Blast Radius     |
                                     | Controls             |
                                     | - % traffic affected |
                                     | - Max duration       |
                                     | - Auto-rollback      |
                                     |   thresholds         |
                                     | - Kill switch ready  |
                                     +----------+----------+
                                                |
                                                v
                                     +---------------------+
                                     | Capture Baseline     |
                                     | Steady State         |
                                     | - Record SLI values  |
                                     | - Snapshot metrics    |
                                     | - Save system state  |
                                     +----------+----------+
                                                |
                                                v
                                     +---------------------+
                                     | Start Monitoring     |
                                     | (Continuous)         |
                                     | - Prometheus scrape  |
                                     | - Grafana dashboard  |
                                     | - Alert rules active |
                                     +----------+----------+
                                                |
                                                v
                                     +---------------------+
                                     | Inject Fault         |
                                     | - Execute fault      |
                                     |   injection          |
                                     | - Log injection time |
                                     | - Notify team        |
                                     +----------+----------+
                                                |
                                                v
                                     +---------------------+
                                     | Observe Steady State |
                                     | - Compare to         |
                                     |   baseline           |
                                     | - Evaluate probes    |
                                     | - Check thresholds   |
                                     +----------+----------+
                                                |
                                   +------------+------------+
                                   |                         |
                                   v                         v
                        +------------------+      +------------------+
                        | Steady State     |      | Steady State     |
                        | MAINTAINED       |      | VIOLATED         |
                        +--------+---------+      +--------+---------+
                                 |                         |
                        +--------+--------+                v
                        |                 |      +------------------+
                        v                 v      | Auto-Rollback    |
                 +-----------+    +-----------+  | - Stop fault     |
                 | Duration  |    | Increase  |  | - Restore state  |
                 | Complete? |    | Blast     |  | - Verify health  |
                 +-----------+    | Radius    |  | - Notify team    |
                   |    |         | (optional)|  +--------+---------+
                   |    |         +-----------+           |
                   v    v                                  v
               +----+ +-----+                   +------------------+
               | NO | | YES |                   | Post-Mortem      |
               +----+ +-----+                   | Analysis         |
                 |       |                       | - Root cause     |
                 v       v                       | - Improvements   |
          (Continue   +---------------------+    | - Action items   |
           Observe)   | Remove Fault        |    +--------+---------+
                      | - Clean up injection|             |
                      | - Verify recovery   |             v
                      +----------+----------+    +------------------+
                                 |               | File Bug /       |
                                 v               | Improvement      |
                      +---------------------+    | Ticket           |
                      | Validate Recovery    |    +------------------+
                      | - SLIs back to       |
                      |   baseline           |
                      | - No data loss       |
                      | - No side effects    |
                      +----------+----------+
                                 |
                                 v
                      +---------------------+
                      | Generate Report      |
                      | - Experiment summary |
                      | - Metrics comparison |
                      | - Timeline of events |
                      | - Findings           |
                      | - Recommendations    |
                      +----------+----------+
                                 |
                                 v
                      +---------------------+
                      | Share Results        |
                      | - Team review        |
                      | - Update runbooks    |
                      | - Improve monitoring |
                      | - Schedule follow-up |
                      +---------------------+
`}</pre>
    </div>
  );

  const renderSequenceDiagram = () => (
    <div>
      <h2 style={sectionTitle}>Sequence Diagram - Chaos Experiment Execution</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        End-to-end sequence showing interaction between SRE Engineer, Chaos Platform, Approval System, Fault Injector, Target Service, Monitoring Stack, and Alert Manager during a chaos experiment lifecycle.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |   SEQUENCE DIAGRAM: CHAOS EXPERIMENT LIFECYCLE (DB FAILOVER TEST)       |
  +=========================================================================+

  Engineer    Chaos         Approval     Fault        Target       Monitoring   Alert
  (SRE)       Platform      System       Injector     Service      Stack        Manager
  |           |             |            |            |            |            |
  |  1. Create|             |            |            |            |            |
  |  Experiment|            |            |            |            |            |
  |  (DB Fail- |            |            |            |            |            |
  |  over Test)|            |            |            |            |            |
  |---------->|             |            |            |            |            |
  |           |             |            |            |            |            |
  |           | 2. Submit   |            |            |            |            |
  |           |    for      |            |            |            |            |
  |           |    Approval |            |            |            |            |
  |           |------------>|            |            |            |            |
  |           |             |            |            |            |            |
  |           |             | 3. Peer    |            |            |            |
  |           |             |    Review  |            |            |            |
  |           |             |    (Tech   |            |            |            |
  |           |             |    assess) |            |            |            |
  |           |             |            |            |            |            |
  |           |             | 4. Manager |            |            |            |
  |           |             |    Approval|            |            |            |
  |           |             |    (Business            |            |            |
  |           |             |     impact)|            |            |            |
  |           |             |            |            |            |            |
  |           |             | 5. CISO    |            |            |            |
  |           |             |    Sign-off|            |            |            |
  |           |             |    (Prod   |            |            |            |
  |           |             |     ready) |            |            |            |
  |           |             |            |            |            |            |
  |           | 6. Approved |            |            |            |            |
  |           |<------------|            |            |            |            |
  |           |             |            |            |            |            |
  |  7. Trigger             |            |            |            |            |
  |  Execution|             |            |            |            |            |
  |---------->|             |            |            |            |            |
  |           |             |            |            |            |            |
  |           | 8. Configure|            |            |            |            |
  |           |    Blast    |            |            |            |            |
  |           |    Radius   |            |            |            |            |
  |           |             |            |            |            |            |
  |           | 9. Capture  |            |            |            |            |
  |           |    Baseline |            |            | 10. Query  |            |
  |           |    Steady   |            |            |    Baseline|            |
  |           |    State    |            |            |    Metrics |            |
  |           |------------------------------------------->|            |
  |           |             |            |            |            |            |
  |           |<-------------------------------------------|            |
  |           | 11. Baseline captured (error_rate=0.001, latency_p99=0.2s)     |
  |           |             |            |            |            |            |
  |           | 12. Inject  |            |            |            |            |
  |           |     Fault   |            |            |            |            |
  |           |-------------|----------->|            |            |            |
  |           |             |            |            |            |            |
  |           |             |            | 13. SIGKILL|            |            |
  |           |             |            |     postgres            |            |
  |           |             |            |     process |            |            |
  |           |             |            |------------>|            |            |
  |           |             |            |            |            |            |
  |           |             |            | 14. Fault  |            |            |
  |           |             |            |     Injected|            |            |
  |           |<------------|------------|            |            |            |
  |           |             |            |            |            |            |
  |           |             |            |            | 15. Patroni|            |
  |           |             |            |            |     Detects |            |
  |           |             |            |            |     Failure |            |
  |           |             |            |            |     (3s)    |            |
  |           |             |            |            |            |            |
  |           |             |            |            | 16. Replica|            |
  |           |             |            |            |     Promoted            |
  |           |             |            |            |     to Primary          |
  |           |             |            |            |     (8.3s)  |            |
  |           |             |            |            |            |            |
  |           | 17. Monitor |            |            |            |            |
  |           |     Steady  |            |            | 18. Query  |            |
  |           |     State   |            |            |    Current |            |
  |           |     (every  |            |            |    Metrics |            |
  |           |      10s)   |            |            |            |            |
  |           |------------------------------------------->|            |
  |           |             |            |            |            |            |
  |           |<-------------------------------------------|            |
  |           | 19. Metrics: error_rate=0.003, latency_p99=0.8s (PASS)         |
  |           |             |            |            |            |            |
  |           | 20. Continue monitoring (10s intervals)            |            |
  |           |------------------------------------------->|            |
  |           |<-------------------------------------------|            |
  |           | 21. Metrics: error_rate=0.002, latency_p99=0.4s (PASS)         |
  |           |             |            |            |            |            |
  |           |             |            |            |            |            |
  |           |  [IF STEADY STATE VIOLATED]            |            |            |
  |           |             |            |            |            |            |
  |           | 22. SLO     |            |            |            | 23. Fire   |
  |           |     Breach  |            |            |            |     Alert  |
  |           |     Detected|            |            |            |----------->|
  |           |             |            |            |            |            |
  |           | 24. Auto-   |            |            |            |            |
  |           |     Rollback|            |            |            |            |
  |           |     Triggered            |            |            |            |
  |           |-------------|----------->|            |            |            |
  |           |             |            | 25. Stop   |            |            |
  |           |             |            |     Fault  |            |            |
  |           |             |            |     + Restore            |            |
  |           |             |            |------------>|            |            |
  |           |             |            |            |            |            |
  |           |             |            |            |            | 26. Alert  |
  |           |             |            |            |            |     to     |
  |           |             |            |            |            |     SRE    |
  |           |             |            |            |            |----------->|
  |           |             |            |            |            |            |
  |           |  [IF STEADY STATE MAINTAINED - EXPERIMENT COMPLETE]             |
  |           |             |            |            |            |            |
  |           | 27. Duration|            |            |            |            |
  |           |     Complete|            |            |            |            |
  |           |             |            |            |            |            |
  |           | 28. Cleanup |            |            |            |            |
  |           |     Fault   |            |            |            |            |
  |           |-------------|----------->|            |            |            |
  |           |             |            | 29. Remove |            |            |
  |           |             |            |     Fault  |            |            |
  |           |             |            |------------>|            |            |
  |           |             |            |            |            |            |
  |           | 30. Validate|            |            | 31. Final  |            |
  |           |     Recovery|            |            |    Metrics |            |
  |           |------------------------------------------->|            |
  |           |<-------------------------------------------|            |
  |           | 32. Metrics back to baseline (PASS)        |            |
  |           |             |            |            |            |            |
  |           | 33. Generate|            |            |            |            |
  |           |     Report  |            |            |            |            |
  |           |             |            |            |            |            |
  |  34. Report             |            |            |            |            |
  |  Delivered |            |            |            |            |            |
  |  (Success) |            |            |            |            |            |
  |<----------|             |            |            |            |            |
  |           |             |            |            |            |            |


  LEGEND:
  ------> Synchronous call
  <------ Synchronous response
  [IF...] Conditional branch
  SRE     Site Reliability Engineer
  CISO    Chief Information Security Officer
  SLO     Service Level Objective
  SLI     Service Level Indicator
`}</pre>

      <h3 style={sectionTitle}>Key Interaction Summary</h3>
      <div style={gridStyle}>
        {[
          { step:'Steps 1-6', title:'Experiment Creation & Approval', desc:'SRE engineer defines the experiment with hypothesis, fault config, blast radius, and rollback plan. Multi-level approval: peer review (technical), manager (business impact), CISO (production readiness).', color:C.accent },
          { step:'Steps 7-11', title:'Baseline Capture', desc:'Chaos platform configures blast radius controls, queries Prometheus for baseline steady state metrics (error rate, latency P99, throughput), and stores snapshot for comparison during and after experiment.', color:C.info },
          { step:'Steps 12-16', title:'Fault Injection & System Response', desc:'Fault injector sends SIGKILL to PostgreSQL primary. Patroni detects failure (3s), promotes replica to primary (8.3s total failover). Application connections re-establish through PgBouncer.', color:C.warn },
          { step:'Steps 17-21', title:'Steady State Monitoring', desc:'Continuous monitoring at 10-second intervals. PromQL queries evaluate error rate, latency, and throughput against thresholds. Each probe result classified as PASS/FAIL. Metrics trending toward baseline.', color:C.success },
          { step:'Steps 22-26', title:'Auto-Rollback (If Violated)', desc:'If steady state violated, auto-rollback triggers immediately. Fault injection stopped, system state restored, Alert Manager fires critical alert to SRE on-call. Rollback completes within 60 seconds.', color:C.danger },
          { step:'Steps 27-34', title:'Completion & Reporting', desc:'Experiment duration completes, fault cleaned up, recovery validated against baseline. Report generated with metrics comparison, timeline, findings, and recommendations. Shared with team for review.', color:C.accent }
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, borderLeft:`4px solid ${s.color}` }}>
            <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:6 }}>
              <span style={{ background:s.color, color:'#fff', padding:'2px 10px', borderRadius:8, fontSize:12, fontWeight:700 }}>{s.step}</span>
              <span style={{ color:s.color, fontWeight:700, fontSize:14 }}>{s.title}</span>
            </div>
            <p style={{ color:C.text, fontSize:13, lineHeight:1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'architecture': return renderArchitecture();
      case 'brd': return renderBRD();
      case 'hld': return renderHLD();
      case 'lld': return renderLLD();
      case 'scenarios': return renderScenarios();
      case 'testcases': return renderTestCases();
      case 'c4model': return renderC4Model();
      case 'techstack': return renderTechStack();
      case 'sad': return renderSAD();
      case 'flowchart': return renderFlowchart();
      case 'sequence': return renderSequenceDiagram();
      default: return renderArchitecture();
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(135deg, ${C.bgFrom} 0%, ${C.bgTo} 100%)`, padding:'24px 32px', fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth:1400, margin:'0 auto' }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ color:C.header, fontSize:28, fontWeight:800, marginBottom:6, letterSpacing:'-0.5px' }}>
            Chaos Engineering & Resilience Testing Architecture
          </h1>
          <p style={{ color:C.muted, fontSize:15, lineHeight:1.6 }}>
            Fault Injection | Disaster Recovery | Business Continuity | Failover Validation - Banking QA Testing Dashboard
          </p>
          <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
            {badge(C.accent, 'Chaos Engineering')}{badge(C.warn, 'Fault Injection')}{badge(C.danger, 'DR Testing')}{badge(C.info, 'Failover')}{badge(C.success, 'Resilience')}{badge(C.warn, 'GameDay')}{badge(C.accent, 'RBI BCP')}{badge(C.info, 'SRE')}
          </div>
        </div>

        <div style={{ display:'flex', gap:6, marginBottom:24, flexWrap:'wrap', borderBottom:`2px solid ${C.border}`, paddingBottom:12 }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding:'8px 18px',
                borderRadius:'8px 8px 0 0',
                border: activeTab === tab.key ? `1px solid ${C.accent}` : `1px solid transparent`,
                borderBottom: activeTab === tab.key ? `2px solid ${C.accent}` : '2px solid transparent',
                background: activeTab === tab.key ? C.card : 'transparent',
                color: activeTab === tab.key ? C.accent : C.muted,
                fontSize:13,
                fontWeight: activeTab === tab.key ? 700 : 500,
                cursor:'pointer',
                transition:'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ background:'rgba(15,52,96,0.3)', borderRadius:12, padding:28, border:`1px solid ${C.border}` }}>
          {renderContent()}
        </div>

        <div style={{ marginTop:20, textAlign:'center', color:C.muted, fontSize:12, padding:12 }}>
          Chaos Engineering & Resilience Testing Architecture | Banking QA Dashboard | Fault Injection | DR | BCP | Failover | GameDay
        </div>
      </div>
    </div>
  );
}

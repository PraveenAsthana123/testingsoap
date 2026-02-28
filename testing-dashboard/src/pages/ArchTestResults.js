import React, { useState } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12', success:'#2ecc71', info:'#3498db' };

const TABS = [
  { key: 'summary', label: 'Executive Summary' },
  { key: 'execution', label: 'Test Execution' },
  { key: 'defects', label: 'Defect Analysis' },
  { key: 'trends', label: 'Trend Analysis' },
  { key: 'exports', label: 'Export Reports' }
];

const TOPIC_RESULTS = [
  { topic:'Compliance & Regulatory', total:20, pass:18, fail:1, blocked:1, pct:90, status:'PASS' },
  { topic:'Contract Testing', total:20, pass:19, fail:1, blocked:0, pct:95, status:'PASS' },
  { topic:'Data Pipeline', total:20, pass:17, fail:2, blocked:1, pct:85, status:'WARNING' },
  { topic:'Message Queue', total:20, pass:18, fail:1, blocked:1, pct:90, status:'PASS' },
  { topic:'Microservices', total:20, pass:17, fail:2, blocked:1, pct:85, status:'WARNING' },
  { topic:'Chaos & Resilience', total:20, pass:16, fail:3, blocked:1, pct:80, status:'WARNING' },
  { topic:'Cloud Native', total:20, pass:18, fail:1, blocked:1, pct:90, status:'PASS' },
  { topic:'Payment Gateway', total:20, pass:19, fail:1, blocked:0, pct:95, status:'PASS' },
  { topic:'Mainframe Banking', total:20, pass:17, fail:2, blocked:1, pct:85, status:'WARNING' },
  { topic:'Concurrency', total:20, pass:19, fail:0, blocked:1, pct:95, status:'PASS' }
];

const EXECUTION_LOG = [
  { id:1, testId:'TC-COMP-001', arch:'Compliance & Regulatory', testCase:'KYC Aadhaar OTP Verification', start:'09:00:12', end:'09:01:28', dur:'1m 16s', status:'PASS', assignee:'Rajesh K' },
  { id:2, testId:'TC-COMP-002', arch:'Compliance & Regulatory', testCase:'AML Transaction Threshold Detection', start:'09:01:30', end:'09:02:55', dur:'1m 25s', status:'PASS', assignee:'Rajesh K' },
  { id:3, testId:'TC-COMP-003', arch:'Compliance & Regulatory', testCase:'KYC OTP Timeout SLA Validation', start:'09:03:00', end:'09:05:12', dur:'2m 12s', status:'FAIL', assignee:'Priya S' },
  { id:4, testId:'TC-COMP-004', arch:'Compliance & Regulatory', testCase:'GDPR Right to Erasure Workflow', start:'09:05:15', end:'09:06:30', dur:'1m 15s', status:'PASS', assignee:'Priya S' },
  { id:5, testId:'TC-COMP-005', arch:'Compliance & Regulatory', testCase:'PCI-DSS Network Segmentation Scan', start:'09:06:35', end:'09:08:00', dur:'1m 25s', status:'BLOCKED', assignee:'Amit D' },
  { id:6, testId:'TC-CONT-001', arch:'Contract Testing', testCase:'Account Service OpenAPI Schema Validation', start:'09:30:00', end:'09:31:10', dur:'1m 10s', status:'PASS', assignee:'Sneha M' },
  { id:7, testId:'TC-CONT-002', arch:'Contract Testing', testCase:'Payment API Consumer Contract Pact Test', start:'09:31:15', end:'09:32:40', dur:'1m 25s', status:'PASS', assignee:'Sneha M' },
  { id:8, testId:'TC-CONT-003', arch:'Contract Testing', testCase:'Loan Origination Provider Contract', start:'09:32:45', end:'09:34:20', dur:'1m 35s', status:'PASS', assignee:'Vikram R' },
  { id:9, testId:'TC-CONT-004', arch:'Contract Testing', testCase:'CBS API Backward Compatibility Check', start:'09:34:25', end:'09:36:00', dur:'1m 35s', status:'FAIL', assignee:'Vikram R' },
  { id:10, testId:'TC-DATA-001', arch:'Data Pipeline', testCase:'ETL Daily Reconciliation Batch', start:'10:00:00', end:'10:02:45', dur:'2m 45s', status:'PASS', assignee:'Deepak N' },
  { id:11, testId:'TC-DATA-002', arch:'Data Pipeline', testCase:'ETL Large Batch Reconciliation Accuracy', start:'10:02:50', end:'10:05:30', dur:'2m 40s', status:'FAIL', assignee:'Deepak N' },
  { id:12, testId:'TC-DATA-003', arch:'Data Pipeline', testCase:'EOD GL Posting Duplicate Detection', start:'10:05:35', end:'10:07:15', dur:'1m 40s', status:'FAIL', assignee:'Kavitha L' },
  { id:13, testId:'TC-DATA-004', arch:'Data Pipeline', testCase:'Spark Streaming Latency < 5s', start:'10:07:20', end:'10:08:00', dur:'0m 40s', status:'BLOCKED', assignee:'Kavitha L' },
  { id:14, testId:'TC-MQ-001', arch:'Message Queue', testCase:'Kafka Topic Partition Rebalance', start:'10:30:00', end:'10:31:25', dur:'1m 25s', status:'PASS', assignee:'Arun P' },
  { id:15, testId:'TC-MQ-002', arch:'Message Queue', testCase:'Dead Letter Queue Alert Trigger', start:'10:31:30', end:'10:33:10', dur:'1m 40s', status:'FAIL', assignee:'Arun P' },
  { id:16, testId:'TC-MQ-003', arch:'Message Queue', testCase:'Message Ordering Guarantee FIFO', start:'10:33:15', end:'10:34:30', dur:'1m 15s', status:'PASS', assignee:'Meena T' },
  { id:17, testId:'TC-MQ-004', arch:'Message Queue', testCase:'RabbitMQ Cluster Failover', start:'10:34:35', end:'10:35:50', dur:'1m 15s', status:'BLOCKED', assignee:'Meena T' },
  { id:18, testId:'TC-MICRO-001', arch:'Microservices', testCase:'Circuit Breaker Open After Failures', start:'11:00:00', end:'11:02:20', dur:'2m 20s', status:'FAIL', assignee:'Suresh V' },
  { id:19, testId:'TC-MICRO-002', arch:'Microservices', testCase:'Service Mesh Sidecar Memory Under Load', start:'11:02:25', end:'11:05:00', dur:'2m 35s', status:'FAIL', assignee:'Suresh V' },
  { id:20, testId:'TC-MICRO-003', arch:'Microservices', testCase:'API Gateway Rate Limiting', start:'11:05:05', end:'11:06:20', dur:'1m 15s', status:'PASS', assignee:'Ritu G' },
  { id:21, testId:'TC-MICRO-004', arch:'Microservices', testCase:'Service Discovery Health Check', start:'11:06:25', end:'11:07:00', dur:'0m 35s', status:'BLOCKED', assignee:'Ritu G' },
  { id:22, testId:'TC-CHAOS-001', arch:'Chaos & Resilience', testCase:'DR Switchover RTO Validation', start:'11:30:00', end:'11:33:15', dur:'3m 15s', status:'FAIL', assignee:'Karthik B' },
  { id:23, testId:'TC-CHAOS-002', arch:'Chaos & Resilience', testCase:'Pod Restart Loop CPU Stress', start:'11:33:20', end:'11:36:00', dur:'2m 40s', status:'FAIL', assignee:'Karthik B' },
  { id:24, testId:'TC-CHAOS-003', arch:'Chaos & Resilience', testCase:'Network Partition Tolerance', start:'11:36:05', end:'11:37:30', dur:'1m 25s', status:'PASS', assignee:'Nisha F' },
  { id:25, testId:'TC-CHAOS-004', arch:'Chaos & Resilience', testCase:'Zone Failure Auto-Recovery', start:'11:37:35', end:'11:39:50', dur:'2m 15s', status:'FAIL', assignee:'Nisha F' },
  { id:26, testId:'TC-CLOUD-001', arch:'Cloud Native', testCase:'Lambda Cold Start Threshold', start:'12:00:00', end:'12:01:45', dur:'1m 45s', status:'FAIL', assignee:'Rahul J' },
  { id:27, testId:'TC-CLOUD-002', arch:'Cloud Native', testCase:'Auto-Scaling Under Load', start:'12:01:50', end:'12:03:10', dur:'1m 20s', status:'PASS', assignee:'Rahul J' },
  { id:28, testId:'TC-PAY-001', arch:'Payment Gateway', testCase:'3DS Challenge Timeout Handling', start:'12:30:00', end:'12:32:30', dur:'2m 30s', status:'FAIL', assignee:'Divya H' },
  { id:29, testId:'TC-MAIN-001', arch:'Mainframe Banking', testCase:'COBOL Decimal Field S0C7 Handling', start:'13:00:00', end:'13:02:10', dur:'2m 10s', status:'FAIL', assignee:'Venkat S' },
  { id:30, testId:'TC-CONC-001', arch:'Concurrency', testCase:'Optimistic Lock Retry Under Peak', start:'13:30:00', end:'13:31:45', dur:'1m 45s', status:'PASS', assignee:'Anita W' }
];

const DEFECTS = [
  { id:'DEF-001', arch:'Compliance & Regulatory', testCase:'KYC OTP Timeout SLA Validation', severity:'Critical', desc:'KYC OTP timeout not handled within SLA - system hangs for 45 seconds instead of 30-second threshold before returning error to customer', rootCause:'Missing timeout configuration in Aadhaar OTP gateway connector; default JVM socket timeout of 60s overrides application-level setting', status:'Open', assignee:'Rajesh K' },
  { id:'DEF-002', arch:'Data Pipeline', testCase:'ETL Large Batch Reconciliation', severity:'High', desc:'ETL reconciliation off by 0.01% on large batches exceeding 1M records - cumulative rounding error in decimal aggregation', rootCause:'Using float64 instead of Decimal128 for monetary aggregation in Spark job; precision loss on large summations', status:'In Progress', assignee:'Deepak N' },
  { id:'DEF-003', arch:'Chaos & Resilience', testCase:'DR Switchover RTO Validation', severity:'Critical', desc:'DR switchover exceeds 30-second RTO target - actual measured time 47 seconds due to DNS propagation delay', rootCause:'Route53 health check interval set to 30s with 3 threshold; DNS TTL not reduced from 300s to 60s for failover zone', status:'Open', assignee:'Karthik B' },
  { id:'DEF-004', arch:'Microservices', testCase:'Circuit Breaker Open After Failures', severity:'High', desc:'Circuit breaker not opening after 5 consecutive failures to downstream payment service - continues sending requests to degraded service', rootCause:'Hystrix circuit breaker threshold configured as percentage (50%) but volume threshold set to 20; with only 5 calls, percentage threshold not triggered', status:'In Progress', assignee:'Suresh V' },
  { id:'DEF-005', arch:'Payment Gateway', testCase:'3DS Challenge Timeout Handling', severity:'Critical', desc:'3DS challenge timeout not returning user to merchant page - browser session left in indeterminate state after ACS timeout', rootCause:'Missing challenge-status polling mechanism in 3DS2 SDK integration; iframe postMessage handler not registered for timeout event', status:'Open', assignee:'Divya H' },
  { id:'DEF-006', arch:'Mainframe Banking', testCase:'COBOL Decimal Field S0C7', severity:'High', desc:'COBOL S0C7 abend on decimal field with embedded spaces in batch input file from upstream core banking system', rootCause:'Missing INSPECT REPLACING ALL SPACES BY ZEROS before COMPUTE statement; upstream CBS sends space-padded numeric fields for zero-balance accounts', status:'In Progress', assignee:'Venkat S' },
  { id:'DEF-007', arch:'Message Queue', testCase:'Dead Letter Queue Alert Trigger', severity:'High', desc:'Dead letter queue not triggering alert after 100 messages accumulate - operations team unaware of processing failures', rootCause:'CloudWatch alarm threshold set to 1000 instead of 100; alarm action SNS topic ARN pointing to decommissioned endpoint', status:'Open', assignee:'Arun P' },
  { id:'DEF-008', arch:'Data Pipeline', testCase:'EOD GL Posting Duplicate Detection', severity:'Medium', desc:'Duplicate records appearing in EOD General Ledger posting when batch job restarts after failure - no idempotency check', rootCause:'Missing idempotency key (posting_date + account_id + txn_ref) check before INSERT; batch restart replays from last checkpoint without dedup', status:'In Progress', assignee:'Kavitha L' },
  { id:'DEF-009', arch:'Microservices', testCase:'Service Mesh Sidecar Memory Under Load', severity:'High', desc:'Istio sidecar proxy memory leak under sustained 5000 RPS load - container OOM-killed after 4 hours of operation', rootCause:'Envoy proxy access logging configured with JSON format writing to stdout; log rotation not configured causing unbounded memory growth in buffer', status:'Open', assignee:'Suresh V' },
  { id:'DEF-010', arch:'Chaos & Resilience', testCase:'Pod Restart Loop CPU Stress', severity:'Medium', desc:'Kubernetes pod enters CrashLoopBackOff during CPU stress test - readiness probe timeout too aggressive for stressed conditions', rootCause:'Readiness probe timeout set to 1s with failure threshold of 3; under CPU stress, JVM GC pause exceeds probe timeout causing false-positive failure detection', status:'In Progress', assignee:'Karthik B' },
  { id:'DEF-011', arch:'Mainframe Banking', testCase:'DB2 Deadlock Concurrent Batch', severity:'Medium', desc:'DB2 deadlock occurring when concurrent batch job and online transaction access same account range during EOD processing window', rootCause:'Batch job using table-level lock instead of row-level lock; ISOLATION(RR) should be ISOLATION(CS) with SKIP LOCKED for batch cursor', status:'Open', assignee:'Venkat S' },
  { id:'DEF-012', arch:'Cloud Native', testCase:'Lambda Cold Start Threshold', severity:'Medium', desc:'Lambda cold start exceeds 3-second threshold - measured 4.2 seconds for Java runtime with Spring Boot initialization', rootCause:'Spring Boot component scanning loading unnecessary beans; Lambda SnapStart not enabled; dependency injection initializing full application context on cold start', status:'In Progress', assignee:'Rahul J' },
  { id:'DEF-013', arch:'Compliance & Regulatory', testCase:'Sanctions Screening False Positive', severity:'Low', desc:'Sanctions screening false positive rate at 12% against industry benchmark of 5% - excessive manual review workload for compliance team', rootCause:'Fuzzy matching threshold set to 70% Jaro-Winkler similarity; common Indian names (Sharma, Patel, Singh) matching against sanction list entries with similar phonetics', status:'Open', assignee:'Priya S' },
  { id:'DEF-014', arch:'Concurrency', testCase:'Optimistic Lock Retry Exhaustion', severity:'Low', desc:'Optimistic lock retry exhaustion under peak load (>10K TPS) - 0.02% of transactions failing with version conflict after 3 retries', rootCause:'Retry count set to 3 with linear backoff; under peak load, contention window exceeds retry budget; exponential backoff with jitter not implemented', status:'Open', assignee:'Anita W' }
];

const SPRINT_TRENDS = [
  { sprint:'Sprint 23', total:180, pass:145, fail:25, blocked:10, pct:80.6, delta:'-' },
  { sprint:'Sprint 24', total:190, pass:160, fail:20, blocked:10, pct:84.2, delta:'+3.6%' },
  { sprint:'Sprint 25', total:195, pass:170, fail:17, blocked:8, pct:87.2, delta:'+3.0%' },
  { sprint:'Sprint 26', total:200, pass:175, fail:16, blocked:9, pct:87.5, delta:'+0.3%' },
  { sprint:'Sprint 27', total:200, pass:178, fail:14, blocked:8, pct:89.0, delta:'+1.5%' }
];

const DEFECT_TRENDS = [
  { sprint:'Sprint 23', newD:18, resolved:12, open:22, escaped:3 },
  { sprint:'Sprint 24', newD:15, resolved:16, open:21, escaped:2 },
  { sprint:'Sprint 25', newD:12, resolved:14, open:19, escaped:1 },
  { sprint:'Sprint 26', newD:10, resolved:13, open:16, escaped:1 },
  { sprint:'Sprint 27', newD:8, resolved:10, open:14, escaped:0 }
];

const COVERAGE_TRENDS = [
  { sprint:'Sprint 23', scenarios:180, automated:120, manual:60, pct:85 },
  { sprint:'Sprint 24', scenarios:190, automated:140, manual:50, pct:89 },
  { sprint:'Sprint 25', scenarios:195, automated:155, manual:40, pct:92 },
  { sprint:'Sprint 26', scenarios:200, automated:168, manual:32, pct:94 },
  { sprint:'Sprint 27', scenarios:200, automated:176, manual:24, pct:96 }
];

export default function ArchTestResults() {
  const [activeTab, setActiveTab] = useState('summary');

  const preStyle = { fontFamily:'monospace', fontSize:13, background:C.editorBg, color:C.editorText, padding:20, borderRadius:8, overflowX:'auto', whiteSpace:'pre', lineHeight:1.6, border:`1px solid ${C.border}` };
  const tableStyle = { width:'100%', borderCollapse:'collapse', fontSize:14 };
  const thStyle = { background:C.card, color:C.accent, padding:'12px 10px', textAlign:'left', borderBottom:`2px solid ${C.accent}`, fontWeight:700 };
  const tdStyle = { padding:'10px', borderBottom:`1px solid ${C.border}`, color:C.text, verticalAlign:'top' };
  const cardStyle = { background:C.card, borderRadius:10, padding:20, border:`1px solid ${C.border}`, marginBottom:16 };
  const gridStyle = { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16, marginBottom:20 };
  const sectionTitle = { color:C.accent, fontSize:20, fontWeight:700, marginBottom:12, marginTop:24 };
  const subTitle = { color:C.header, fontSize:16, fontWeight:600, marginBottom:8 };
  const badge = (color, text) => (
    <span style={{ background:color, color:'#fff', padding:'2px 10px', borderRadius:12, fontSize:12, fontWeight:600, marginRight:6 }}>{text}</span>
  );
  const statusBadge = (status) => {
    const map = { PASS:C.success, FAIL:C.danger, BLOCKED:C.warn, WARNING:C.warn, 'In Progress':C.info, Open:C.danger, Critical:C.danger, High:C.warn, Medium:C.info, Low:C.muted };
    return badge(map[status] || C.muted, status);
  };
  const progressBar = (pct, color) => (
    <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:6, height:18, width:'100%', overflow:'hidden' }}>
      <div style={{ background:color || C.accent, height:'100%', width:`${pct}%`, borderRadius:6, transition:'width 0.5s ease' }} />
    </div>
  );
  const metricCard = (title, value, subtitle, color) => (
    <div style={{ ...cardStyle, textAlign:'center', borderTop:`3px solid ${color || C.accent}` }}>
      <div style={{ color:C.muted, fontSize:12, fontWeight:600, textTransform:'uppercase', marginBottom:6 }}>{title}</div>
      <div style={{ color:color || C.accent, fontSize:32, fontWeight:800, marginBottom:4 }}>{value}</div>
      <div style={{ color:C.text, fontSize:12 }}>{subtitle}</div>
    </div>
  );

  /* ============================== TAB 1: EXECUTIVE SUMMARY ============================== */
  const renderSummary = () => (
    <div>
      <h2 style={sectionTitle}>Architecture Test Execution - Executive Summary</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Comprehensive test execution results for all 10 architecture testing topics across the Banking QA Testing Platform.
        Sprint 27 execution completed on 2026-02-28 with overall pass rate of 89.0%. Total 200 test cases executed across
        Compliance, Contract Testing, Data Pipeline, Message Queue, Microservices, Chaos Engineering, Cloud Native,
        Payment Gateway, Mainframe Banking, and Concurrency domains.
      </p>

      {/* Overall Metrics */}
      <h3 style={subTitle}>Overall Test Metrics</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16, marginBottom:24 }}>
        {metricCard('Total Test Cases', '200', 'Across 10 Architecture Topics', C.accent)}
        {metricCard('Passed', '178', '89.0% Pass Rate', C.success)}
        {metricCard('Failed', '14', '7.0% Failure Rate', C.danger)}
        {metricCard('Blocked', '8', '4.0% Blocked Rate', C.warn)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16, marginBottom:24 }}>
        {metricCard('Total Scenarios', '200', 'Covered: 192 (96%)', C.info)}
        {metricCard('Execution Time', '4h 32m', 'Avg per test: 1.36 min', C.accent)}
        {metricCard('Defects Found', '14', 'Critical: 3 | High: 5', C.danger)}
        {metricCard('Automation Rate', '88%', '176 Automated / 24 Manual', C.success)}
      </div>

      {/* Overall Pass Rate Progress */}
      <div style={{ ...cardStyle, marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ color:C.header, fontWeight:600 }}>Overall Pass Rate</span>
          <span style={{ color:C.success, fontWeight:700 }}>89.0%</span>
        </div>
        {progressBar(89, C.success)}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
          <span style={{ color:C.muted, fontSize:12 }}>Target: 85%</span>
          <span style={{ color:C.success, fontSize:12, fontWeight:600 }}>Above Target (+4.0%)</span>
        </div>
      </div>

      {/* Pass/Fail by Architecture Topic */}
      <h3 style={sectionTitle}>Pass/Fail by Architecture Topic</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Architecture Topic</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Pass</th>
              <th style={thStyle}>Fail</th>
              <th style={thStyle}>Blocked</th>
              <th style={thStyle}>Pass%</th>
              <th style={thStyle}>Progress</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {TOPIC_RESULTS.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={{ ...tdStyle, fontWeight:600 }}>{r.topic}</td>
                <td style={tdStyle}>{r.total}</td>
                <td style={{ ...tdStyle, color:C.success }}>{r.pass}</td>
                <td style={{ ...tdStyle, color:r.fail > 0 ? C.danger : C.text }}>{r.fail}</td>
                <td style={{ ...tdStyle, color:r.blocked > 0 ? C.warn : C.text }}>{r.blocked}</td>
                <td style={{ ...tdStyle, color: r.pct >= 90 ? C.success : r.pct >= 85 ? C.warn : C.danger, fontWeight:700 }}>{r.pct}%</td>
                <td style={{ ...tdStyle, width:120 }}>{progressBar(r.pct, r.pct >= 90 ? C.success : r.pct >= 85 ? C.warn : C.danger)}</td>
                <td style={tdStyle}>{statusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background:'rgba(78,204,163,0.1)' }}>
              <td style={{ ...tdStyle, fontWeight:700, color:C.accent }} colSpan={2}>TOTAL</td>
              <td style={{ ...tdStyle, fontWeight:700, color:C.accent }}>200</td>
              <td style={{ ...tdStyle, fontWeight:700, color:C.success }}>178</td>
              <td style={{ ...tdStyle, fontWeight:700, color:C.danger }}>14</td>
              <td style={{ ...tdStyle, fontWeight:700, color:C.warn }}>8</td>
              <td style={{ ...tdStyle, fontWeight:700, color:C.success }}>89%</td>
              <td style={tdStyle}>{progressBar(89, C.success)}</td>
              <td style={tdStyle}>{statusBadge('PASS')}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ASCII Bar Chart */}
      <h3 style={sectionTitle}>Pass Rate Distribution by Topic</h3>
      <pre style={preStyle}>{`
  ARCHITECTURE TEST PASS RATES - Sprint 27 (2026-02-28)
  =====================================================

  Compliance & Regulatory  |${'='.repeat(18)} | 90%  [18/20] PASS
  Contract Testing         |${'='.repeat(19)} | 95%  [19/20] PASS
  Data Pipeline            |${'='.repeat(17)} | 85%  [17/20] WARNING
  Message Queue            |${'='.repeat(18)} | 90%  [18/20] PASS
  Microservices            |${'='.repeat(17)} | 85%  [17/20] WARNING
  Chaos & Resilience       |${'='.repeat(16)} | 80%  [16/20] WARNING
  Cloud Native             |${'='.repeat(18)} | 90%  [18/20] PASS
  Payment Gateway          |${'='.repeat(19)} | 95%  [19/20] PASS
  Mainframe Banking        |${'='.repeat(17)} | 85%  [17/20] WARNING
  Concurrency              |${'='.repeat(19)} | 95%  [19/20] PASS

  Legend:  = = 1 passed test    Target >= 85%
  =====================================================
  Overall: 178/200 = 89.0%  [TARGET MET]
`}</pre>

      {/* Severity Distribution */}
      <h3 style={sectionTitle}>Defect Severity Distribution</h3>
      <div style={gridStyle}>
        {metricCard('Critical', '3', 'Immediate fix required', C.danger)}
        {metricCard('High', '5', 'Fix within sprint', C.warn)}
        {metricCard('Medium', '4', 'Planned for next sprint', C.info)}
        {metricCard('Low', '2', 'Backlog priority', C.muted)}
      </div>

      {/* Key Findings */}
      <h3 style={sectionTitle}>Key Findings & Recommendations</h3>
      <div style={cardStyle}>
        <div style={{ marginBottom:12 }}>
          <h4 style={{ color:C.danger, marginBottom:8, fontWeight:700 }}>Critical Issues (Requires Immediate Attention)</h4>
          <ul style={{ color:C.text, lineHeight:2, paddingLeft:20, fontSize:13 }}>
            <li><strong style={{ color:C.danger }}>DEF-001:</strong> KYC OTP timeout handling exceeds SLA - customer-facing impact</li>
            <li><strong style={{ color:C.danger }}>DEF-003:</strong> DR switchover RTO 47s vs 30s target - regulatory non-compliance risk</li>
            <li><strong style={{ color:C.danger }}>DEF-005:</strong> 3DS challenge timeout leaves payment in limbo - revenue impact</li>
          </ul>
        </div>
        <div style={{ marginBottom:12 }}>
          <h4 style={{ color:C.warn, marginBottom:8, fontWeight:700 }}>High Priority (Fix This Sprint)</h4>
          <ul style={{ color:C.text, lineHeight:2, paddingLeft:20, fontSize:13 }}>
            <li><strong style={{ color:C.warn }}>DEF-002:</strong> ETL reconciliation precision loss on large batches</li>
            <li><strong style={{ color:C.warn }}>DEF-004:</strong> Circuit breaker threshold misconfiguration</li>
            <li><strong style={{ color:C.warn }}>DEF-006:</strong> COBOL S0C7 abend on space-padded numeric fields</li>
            <li><strong style={{ color:C.warn }}>DEF-007:</strong> DLQ alert threshold misconfiguration</li>
            <li><strong style={{ color:C.warn }}>DEF-009:</strong> Envoy sidecar memory leak under load</li>
          </ul>
        </div>
        <div>
          <h4 style={{ color:C.success, marginBottom:8, fontWeight:700 }}>Positive Observations</h4>
          <ul style={{ color:C.text, lineHeight:2, paddingLeft:20, fontSize:13 }}>
            <li>Overall pass rate improved from 87.5% (Sprint 26) to 89.0% (Sprint 27)</li>
            <li>Contract Testing and Concurrency at 95% - highest performing topics</li>
            <li>Automation rate increased to 88% (176/200 automated test cases)</li>
            <li>Zero escaped defects in Sprint 27 - all caught in QA phase</li>
            <li>Payment Gateway pass rate at 95% despite complexity of 3DS integration</li>
          </ul>
        </div>
      </div>
    </div>
  );

  /* ============================== TAB 2: TEST EXECUTION ============================== */
  const renderExecution = () => (
    <div>
      <h2 style={sectionTitle}>Test Execution Log - 2026-02-28</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Detailed execution log for Sprint 27 architecture test run. All timestamps in IST (UTC+5:30).
        Execution started at 09:00 IST and completed at 13:32 IST. Total duration: 4 hours 32 minutes.
      </p>

      {/* Execution Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:24 }}>
        {metricCard('Start Time', '09:00', '2026-02-28 IST', C.info)}
        {metricCard('End Time', '13:32', '2026-02-28 IST', C.info)}
        {metricCard('Total Duration', '4h 32m', '272 minutes', C.accent)}
        {metricCard('Avg Duration', '1m 22s', 'Per test case', C.accent)}
        {metricCard('Fastest Test', '0m 35s', 'TC-MICRO-004', C.success)}
        {metricCard('Slowest Test', '3m 15s', 'TC-CHAOS-001', C.warn)}
      </div>

      {/* Execution Log Table */}
      <h3 style={sectionTitle}>Detailed Execution Log</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Test ID</th>
              <th style={thStyle}>Architecture</th>
              <th style={thStyle}>Test Case</th>
              <th style={thStyle}>Start</th>
              <th style={thStyle}>End</th>
              <th style={thStyle}>Duration</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {EXECUTION_LOG.map((r, i) => {
              const rowBg = r.status === 'PASS' ? 'rgba(46,204,113,0.07)' : r.status === 'FAIL' ? 'rgba(231,76,60,0.07)' : 'rgba(243,156,18,0.07)';
              return (
                <tr key={i} style={{ background: rowBg }}>
                  <td style={tdStyle}>{r.id}</td>
                  <td style={{ ...tdStyle, fontFamily:'monospace', fontWeight:600, color:C.accent }}>{r.testId}</td>
                  <td style={{ ...tdStyle, fontSize:12 }}>{r.arch}</td>
                  <td style={{ ...tdStyle, fontWeight:500 }}>{r.testCase}</td>
                  <td style={{ ...tdStyle, fontFamily:'monospace', fontSize:12 }}>{r.start}</td>
                  <td style={{ ...tdStyle, fontFamily:'monospace', fontSize:12 }}>{r.end}</td>
                  <td style={{ ...tdStyle, fontFamily:'monospace', fontSize:12 }}>{r.dur}</td>
                  <td style={tdStyle}>{statusBadge(r.status)}</td>
                  <td style={{ ...tdStyle, fontSize:12 }}>{r.assignee}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Execution Timeline ASCII */}
      <h3 style={sectionTitle}>Execution Timeline</h3>
      <pre style={preStyle}>{`
  EXECUTION TIMELINE - 2026-02-28 (Sprint 27)
  ============================================

  TIME    TOPIC                  PROGRESS             RESULT
  ------  ---------------------  -------------------  -----------------
  09:00   Compliance & Reg.      ==================.. 18/20  (90%)  PASS
  09:30   Contract Testing       ===================. 19/20  (95%)  PASS
  10:00   Data Pipeline          =================... 17/20  (85%)  WARNING
  10:30   Message Queue          ==================.. 18/20  (90%)  PASS
  11:00   Microservices          =================... 17/20  (85%)  WARNING
  11:30   Chaos & Resilience     ================.... 16/20  (80%)  WARNING
  12:00   Cloud Native           ==================.. 18/20  (90%)  PASS
  12:30   Payment Gateway        ===================. 19/20  (95%)  PASS
  13:00   Mainframe Banking      =================... 17/20  (85%)  WARNING
  13:30   Concurrency            ===================. 19/20  (95%)  PASS

  ============================================
  TOTAL EXECUTION: 09:00 - 13:32 (4h 32m)
  PARALLEL THREADS: 3 (Compliance+Contract, Data+MQ, Micro+Chaos)
  SEQUENTIAL: Cloud, Payment, Mainframe, Concurrency

  STATUS SUMMARY:
  +-----------+-------+--------+---------+
  | Status    | Count | Rate   | Target  |
  +-----------+-------+--------+---------+
  | PASS      |   178 | 89.0%  | >= 85%  |
  | FAIL      |    14 |  7.0%  | <= 10%  |
  | BLOCKED   |     8 |  4.0%  | <=  5%  |
  +-----------+-------+--------+---------+
  | TOTAL     |   200 | 100%   | MET     |
  +-----------+-------+--------+---------+
`}</pre>

      {/* Execution by Tester */}
      <h3 style={sectionTitle}>Execution by Tester</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Tester</th>
              <th style={thStyle}>Topics Assigned</th>
              <th style={thStyle}>Tests Run</th>
              <th style={thStyle}>Pass</th>
              <th style={thStyle}>Fail</th>
              <th style={thStyle}>Blocked</th>
              <th style={thStyle}>Avg Duration</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name:'Rajesh K', topics:'Compliance', tests:5, pass:4, fail:1, blocked:0, avg:'1m 20s' },
              { name:'Priya S', topics:'Compliance', tests:5, pass:4, fail:0, blocked:1, avg:'1m 15s' },
              { name:'Sneha M', topics:'Contract Testing', tests:5, pass:5, fail:0, blocked:0, avg:'1m 10s' },
              { name:'Vikram R', topics:'Contract Testing', tests:5, pass:4, fail:1, blocked:0, avg:'1m 35s' },
              { name:'Deepak N', topics:'Data Pipeline', tests:5, pass:3, fail:2, blocked:0, avg:'2m 42s' },
              { name:'Kavitha L', topics:'Data Pipeline', tests:5, pass:4, fail:1, blocked:1, avg:'1m 40s' },
              { name:'Arun P', topics:'Message Queue', tests:5, pass:4, fail:1, blocked:0, avg:'1m 32s' },
              { name:'Meena T', topics:'Message Queue', tests:5, pass:4, fail:0, blocked:1, avg:'1m 15s' },
              { name:'Suresh V', topics:'Microservices', tests:5, pass:3, fail:2, blocked:0, avg:'2m 27s' },
              { name:'Ritu G', topics:'Microservices', tests:5, pass:4, fail:0, blocked:1, avg:'0m 55s' },
              { name:'Karthik B', topics:'Chaos & Resilience', tests:5, pass:2, fail:3, blocked:0, avg:'2m 57s' },
              { name:'Nisha F', topics:'Chaos & Resilience', tests:5, pass:4, fail:1, blocked:1, avg:'1m 50s' },
              { name:'Rahul J', topics:'Cloud Native', tests:5, pass:4, fail:1, blocked:0, avg:'1m 32s' },
              { name:'Divya H', topics:'Payment Gateway', tests:5, pass:4, fail:1, blocked:0, avg:'2m 30s' },
              { name:'Venkat S', topics:'Mainframe Banking', tests:5, pass:3, fail:2, blocked:0, avg:'2m 10s' },
              { name:'Anita W', topics:'Concurrency', tests:5, pass:5, fail:0, blocked:0, avg:'1m 45s' }
            ].map((t, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={{ ...tdStyle, fontWeight:600 }}>{t.name}</td>
                <td style={{ ...tdStyle, fontSize:12 }}>{t.topics}</td>
                <td style={tdStyle}>{t.tests}</td>
                <td style={{ ...tdStyle, color:C.success }}>{t.pass}</td>
                <td style={{ ...tdStyle, color:t.fail > 0 ? C.danger : C.text }}>{t.fail}</td>
                <td style={{ ...tdStyle, color:t.blocked > 0 ? C.warn : C.text }}>{t.blocked}</td>
                <td style={{ ...tdStyle, fontFamily:'monospace', fontSize:12 }}>{t.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Environment Info */}
      <h3 style={sectionTitle}>Execution Environment</h3>
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h4 style={subTitle}>Test Environment</h4>
          <pre style={{ ...preStyle, fontSize:12 }}>{`
  Environment : QA-UAT (Integrated)
  Region      : ap-south-1 (Mumbai)
  Kubernetes  : EKS v1.28
  Namespace   : banking-qa-sprint27
  Nodes       : 12 (m5.2xlarge)
  DB Instance : RDS PostgreSQL 15.4
  Cache       : ElastiCache Redis 7.0
  MQ          : MSK Kafka 3.6.0
  Mainframe   : IBM z/OS 2.5 (LPAR-QA)
  CI/CD       : Jenkins 2.426 + ArgoCD 2.9
`}</pre>
        </div>
        <div style={cardStyle}>
          <h4 style={subTitle}>Test Tools & Frameworks</h4>
          <pre style={{ ...preStyle, fontSize:12 }}>{`
  API Testing  : RestAssured 5.4 + Karate 1.4
  Contract     : Pact JVM 4.6 + Specmatic 1.3
  Performance  : Gatling 3.10 + k6 0.49
  Chaos        : Litmus 3.5 + Chaos Monkey
  Security     : OWASP ZAP 2.14 + Burp Suite
  Mainframe    : IBM Developer for z/OS 16
  Monitoring   : Grafana 10.3 + Prometheus
  Log Agg      : ELK Stack 8.12
  Test Mgmt    : Jira + Zephyr Scale
  Automation   : Selenium 4.17 + Playwright 1.41
`}</pre>
        </div>
      </div>
    </div>
  );

  /* ============================== TAB 3: DEFECT ANALYSIS ============================== */
  const renderDefects = () => (
    <div>
      <h2 style={sectionTitle}>Defect Analysis - Sprint 27</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Comprehensive defect analysis from Sprint 27 architecture test execution. Total 14 defects identified across
        8 architecture topics. 3 critical defects require immediate production-blocking resolution before go-live.
      </p>

      {/* Defect Summary Cards */}
      <h3 style={subTitle}>Defect Severity Summary</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:24 }}>
        {metricCard('Critical', '3', 'Production blockers', C.danger)}
        {metricCard('High', '5', 'Sprint fix required', C.warn)}
        {metricCard('Medium', '4', 'Next sprint planned', C.info)}
        {metricCard('Low', '2', 'Backlog items', C.muted)}
      </div>

      {/* Defect Status Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:24 }}>
        {metricCard('Open', '7', '50% of total defects', C.danger)}
        {metricCard('In Progress', '7', '50% being fixed', C.info)}
        {metricCard('Resolved', '0', 'Pending in Sprint 27', C.success)}
        {metricCard('Avg Resolution', '3.2 days', 'Sprint 26 average', C.accent)}
      </div>

      {/* Defects Table */}
      <h3 style={sectionTitle}>Detailed Defect Register</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Defect ID</th>
              <th style={thStyle}>Architecture</th>
              <th style={thStyle}>Test Case</th>
              <th style={thStyle}>Severity</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Root Cause</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {DEFECTS.map((d, i) => {
              const sevColor = d.severity === 'Critical' ? C.danger : d.severity === 'High' ? C.warn : d.severity === 'Medium' ? C.info : C.muted;
              const rowBg = d.severity === 'Critical' ? 'rgba(231,76,60,0.08)' : d.severity === 'High' ? 'rgba(243,156,18,0.05)' : 'transparent';
              return (
                <tr key={i} style={{ background: rowBg }}>
                  <td style={{ ...tdStyle, fontFamily:'monospace', fontWeight:700, color:sevColor }}>{d.id}</td>
                  <td style={{ ...tdStyle, fontSize:12 }}>{d.arch}</td>
                  <td style={{ ...tdStyle, fontSize:12, maxWidth:140 }}>{d.testCase}</td>
                  <td style={tdStyle}>{statusBadge(d.severity)}</td>
                  <td style={{ ...tdStyle, fontSize:12, maxWidth:220, lineHeight:1.5 }}>{d.desc}</td>
                  <td style={{ ...tdStyle, fontSize:11, maxWidth:220, lineHeight:1.5, color:C.muted }}>{d.rootCause}</td>
                  <td style={tdStyle}>{statusBadge(d.status)}</td>
                  <td style={{ ...tdStyle, fontSize:12 }}>{d.assignee}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Defect Distribution ASCII Charts */}
      <h3 style={sectionTitle}>Defect Distribution by Severity</h3>
      <pre style={preStyle}>{`
  DEFECT SEVERITY DISTRIBUTION - Sprint 27
  =========================================

  Critical (3) |######                          | 21.4%
  High     (5) |##########                      | 35.7%
  Medium   (4) |########                        | 28.6%
  Low      (2) |####                            | 14.3%
               +--------------------------------+
                0     2     4     6     8    10

  Total Defects: 14
  Defect Density: 0.07 per test case (14 / 200)
  Critical Rate:  1.5% of test cases produced critical defects
`}</pre>

      <h3 style={sectionTitle}>Defect Distribution by Architecture Topic</h3>
      <pre style={preStyle}>{`
  DEFECTS BY ARCHITECTURE TOPIC
  =========================================

  Compliance & Regulatory  |####   (2)  Critical:1  High:0  Med:0  Low:1
  Contract Testing         |           (0)  No defects - clean run
  Data Pipeline            |####   (2)  Critical:0  High:1  Med:1  Low:0
  Message Queue            |##     (1)  Critical:0  High:1  Med:0  Low:0
  Microservices            |####   (2)  Critical:0  High:2  Med:0  Low:0
  Chaos & Resilience       |####   (2)  Critical:1  High:0  Med:1  Low:0
  Cloud Native             |##     (1)  Critical:0  High:0  Med:1  Low:0
  Payment Gateway          |##     (1)  Critical:1  High:0  Med:0  Low:0
  Mainframe Banking        |####   (2)  Critical:0  High:1  Med:1  Low:0
  Concurrency              |##     (1)  Critical:0  High:0  Med:0  Low:1

  =========================================
  Most Affected: Compliance, Data Pipeline, Microservices,
                 Chaos & Resilience, Mainframe Banking (2 defects each)
  Cleanest:      Contract Testing (0 defects)
`}</pre>

      {/* Root Cause Analysis Summary */}
      <h3 style={sectionTitle}>Root Cause Analysis Summary</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Root Cause Category</th>
              <th style={thStyle}>Count</th>
              <th style={thStyle}>Percentage</th>
              <th style={thStyle}>Defect IDs</th>
              <th style={thStyle}>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {[
              { cat:'Configuration Error', count:4, pct:'28.6%', ids:'DEF-003, DEF-004, DEF-007, DEF-010', rec:'Implement configuration validation in CI pipeline; add config drift detection' },
              { cat:'Missing Error Handling', count:3, pct:'21.4%', ids:'DEF-001, DEF-005, DEF-014', rec:'Enforce timeout and error handler code review checklist; add chaos testing for edge cases' },
              { cat:'Data Type / Precision', count:2, pct:'14.3%', ids:'DEF-002, DEF-006', rec:'Mandate Decimal types for monetary fields; add COBOL field validation in interface contracts' },
              { cat:'Resource Management', count:2, pct:'14.3%', ids:'DEF-009, DEF-012', rec:'Implement resource limit testing in pre-prod; add memory profiling to load tests' },
              { cat:'Missing Idempotency', count:1, pct:'7.1%', ids:'DEF-008', rec:'Require idempotency keys for all batch write operations' },
              { cat:'Threshold Calibration', count:1, pct:'7.1%', ids:'DEF-013', rec:'Tune fuzzy matching with production name distribution data' },
              { cat:'Concurrency Design', count:1, pct:'7.1%', ids:'DEF-011', rec:'Review isolation levels for batch-online overlap windows' }
            ].map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={{ ...tdStyle, fontWeight:600 }}>{r.cat}</td>
                <td style={{ ...tdStyle, textAlign:'center' }}>{r.count}</td>
                <td style={tdStyle}>{r.pct}</td>
                <td style={{ ...tdStyle, fontFamily:'monospace', fontSize:12, color:C.accent }}>{r.ids}</td>
                <td style={{ ...tdStyle, fontSize:12, lineHeight:1.5 }}>{r.rec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Defect Aging */}
      <h3 style={sectionTitle}>Defect Aging Analysis</h3>
      <pre style={preStyle}>{`
  DEFECT AGING - As of 2026-02-28
  =========================================

  Age Range        Open   In Progress   Total
  ---------------  -----  -----------   -----
  0-2 days           5         4           9
  3-5 days           2         3           5
  6-10 days          0         0           0
  > 10 days          0         0           0
  ---------------  -----  -----------   -----
  Total              7         7          14

  Average Age: 2.1 days
  Oldest Open: DEF-003 (3 days - Critical DR issue)
  SLA Breach Risk: DEF-001, DEF-003, DEF-005 (Critical > 2 days)

  RESOLUTION VELOCITY (Sprint 26 Reference):
  - Critical avg: 1.5 days  |  Current: 2.3 days (SLOW)
  - High avg:     2.8 days  |  Current: 1.9 days (ON TRACK)
  - Medium avg:   4.2 days  |  Current: 2.0 days (FAST)
  - Low avg:      6.5 days  |  Current: 1.5 days (FAST)
`}</pre>

      {/* Defect Impact Assessment */}
      <h3 style={sectionTitle}>Defect Impact Assessment</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Defect ID</th>
              <th style={thStyle}>Business Impact</th>
              <th style={thStyle}>Affected Users</th>
              <th style={thStyle}>Revenue Risk</th>
              <th style={thStyle}>Regulatory Risk</th>
              <th style={thStyle}>Fix Priority</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id:'DEF-001', impact:'Customer onboarding blocked during OTP timeout window', users:'~12K daily KYC requests', revenue:'High - lost account openings', regulatory:'RBI KYC Master Direction violation', priority:'P0 - Hotfix Today' },
              { id:'DEF-003', impact:'DR failover SLA breach during outage scenario', users:'All banking customers (~5M)', revenue:'Catastrophic if real outage', regulatory:'RBI BCP Guidelines non-compliance', priority:'P0 - This Week' },
              { id:'DEF-005', impact:'Payment abandonment during 3DS challenge flow', users:'~8K daily card transactions', revenue:'High - 3-5% cart abandonment increase', regulatory:'PCI-DSS 3DS2 mandate risk', priority:'P0 - This Week' },
              { id:'DEF-002', impact:'EOD reconciliation discrepancy in GL posting', users:'Finance & Audit teams', revenue:'Medium - reconciliation manual effort', regulatory:'SOX audit finding risk', priority:'P1 - This Sprint' },
              { id:'DEF-004', impact:'Cascading failure not contained by circuit breaker', users:'Downstream payment service users', revenue:'Medium - degraded service quality', regulatory:'None', priority:'P1 - This Sprint' },
              { id:'DEF-009', impact:'Sidecar OOM causing service restarts under load', users:'All microservice consumers', revenue:'Medium - intermittent availability', regulatory:'None', priority:'P1 - This Sprint' }
            ].map((d, i) => {
              const rowBg = d.priority.includes('P0') ? 'rgba(231,76,60,0.08)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)';
              return (
                <tr key={i} style={{ background:rowBg }}>
                  <td style={{ ...tdStyle, fontFamily:'monospace', fontWeight:700, color:C.accent }}>{d.id}</td>
                  <td style={{ ...tdStyle, fontSize:12, lineHeight:1.5 }}>{d.impact}</td>
                  <td style={{ ...tdStyle, fontSize:12 }}>{d.users}</td>
                  <td style={{ ...tdStyle, fontSize:12 }}>{d.revenue}</td>
                  <td style={{ ...tdStyle, fontSize:12 }}>{d.regulatory}</td>
                  <td style={tdStyle}>{badge(d.priority.includes('P0') ? C.danger : C.warn, d.priority)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Defect Resolution Plan */}
      <h3 style={sectionTitle}>Defect Resolution Plan</h3>
      <pre style={preStyle}>{`
  DEFECT RESOLUTION PLAN - Sprint 27 Hotfix + Sprint 28
  =====================================================

  IMMEDIATE HOTFIX (2026-02-28 - Today):
  +----------+----------------------------------------------+----------+
  | Defect   | Fix Description                              | ETA      |
  +----------+----------------------------------------------+----------+
  | DEF-001  | Set Aadhaar OTP gateway timeout to 25s,      | 14:00    |
  |          | add fallback to retry with backup gateway     | IST      |
  +----------+----------------------------------------------+----------+

  THIS WEEK (Sprint 27 Carryover):
  +----------+----------------------------------------------+----------+
  | DEF-003  | Reduce Route53 TTL to 60s, health check to   | 03-02    |
  |          | 10s interval, add DNS pre-propagation script  |          |
  +----------+----------------------------------------------+----------+
  | DEF-005  | Implement 3DS2 challenge-status polling with  | 03-03    |
  |          | 15s timeout and merchant redirect fallback    |          |
  +----------+----------------------------------------------+----------+

  SPRINT 28 PLANNED:
  +----------+----------------------------------------------+----------+
  | DEF-002  | Migrate Spark aggregation to Decimal128,      | 03-07    |
  |          | add precision validation in reconciliation    |          |
  | DEF-004  | Reconfigure Hystrix: volumeThreshold=5,       | 03-05    |
  |          | errorThresholdPct=60, sleepWindow=5000ms      |          |
  | DEF-006  | Add INSPECT REPLACING in COBOL copybook,      | 03-06    |
  |          | validate numeric fields at interface boundary |          |
  | DEF-007  | Fix CloudWatch alarm threshold to 100, update | 03-05    |
  |          | SNS topic ARN to active operations endpoint   |          |
  | DEF-008  | Add idempotency key check before GL INSERT,   | 03-08    |
  |          | implement batch checkpoint with dedup logic   |          |
  | DEF-009  | Configure Envoy log rotation, set memory      | 03-07    |
  |          | limits on sidecar, add OOM-kill alerting       |          |
  +----------+----------------------------------------------+----------+

  BACKLOG (Sprint 29+):
  DEF-010, DEF-011, DEF-012, DEF-013, DEF-014
`}</pre>
    </div>
  );

  /* ============================== TAB 4: TREND ANALYSIS ============================== */
  const renderTrends = () => (
    <div>
      <h2 style={sectionTitle}>Trend Analysis - Last 5 Sprints</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Sprint-over-sprint trend analysis showing continuous improvement across test execution, defect management,
        and test coverage. Data spans Sprint 23 through Sprint 27 (current), covering the last 10 weeks of
        architecture testing across the Banking QA platform.
      </p>

      {/* Sprint-wise Execution Trend */}
      <h3 style={sectionTitle}>Sprint-wise Test Execution Trend</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Sprint</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Pass</th>
              <th style={thStyle}>Fail</th>
              <th style={thStyle}>Blocked</th>
              <th style={thStyle}>Pass%</th>
              <th style={thStyle}>Delta</th>
              <th style={thStyle}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {SPRINT_TRENDS.map((s, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={{ ...tdStyle, fontWeight:600 }}>{s.sprint}</td>
                <td style={tdStyle}>{s.total}</td>
                <td style={{ ...tdStyle, color:C.success }}>{s.pass}</td>
                <td style={{ ...tdStyle, color:C.danger }}>{s.fail}</td>
                <td style={{ ...tdStyle, color:C.warn }}>{s.blocked}</td>
                <td style={{ ...tdStyle, fontWeight:700, color: s.pct >= 85 ? C.success : C.warn }}>{s.pct}%</td>
                <td style={{ ...tdStyle, color: s.delta === '-' ? C.muted : C.success, fontWeight:600 }}>{s.delta}</td>
                <td style={{ ...tdStyle, width:120 }}>{progressBar(s.pct, s.pct >= 85 ? C.success : C.warn)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ASCII Trend Chart */}
      <h3 style={sectionTitle}>Pass Rate Trend (Visual)</h3>
      <pre style={preStyle}>{`
  PASS RATE TREND - Sprint 23 to Sprint 27
  =========================================
  100% |
   95% |                                          *--*
   90% |                              *-----------*
   87% |                    *--------*
   85% |          *--------*.......................... TARGET LINE (85%)
   80% |*--------*
   75% |
       +----+----+----+----+----+
        S23  S24  S25  S26  S27

  Sprint 23: 80.6%  (+0.0%)  [BELOW TARGET]
  Sprint 24: 84.2%  (+3.6%)  [BELOW TARGET]
  Sprint 25: 87.2%  (+3.0%)  [ABOVE TARGET]
  Sprint 26: 87.5%  (+0.3%)  [ABOVE TARGET]
  Sprint 27: 89.0%  (+1.5%)  [ABOVE TARGET]

  Cumulative Improvement: +8.4% over 5 sprints
  Avg Sprint Improvement: +2.1% per sprint
  Trend Direction: POSITIVE (consistent upward)
`}</pre>

      {/* Defect Trend */}
      <h3 style={sectionTitle}>Defect Trend</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Sprint</th>
              <th style={thStyle}>New Defects</th>
              <th style={thStyle}>Resolved</th>
              <th style={thStyle}>Open (EOD)</th>
              <th style={thStyle}>Escaped to Prod</th>
              <th style={thStyle}>Resolution Rate</th>
            </tr>
          </thead>
          <tbody>
            {DEFECT_TRENDS.map((d, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={{ ...tdStyle, fontWeight:600 }}>{d.sprint}</td>
                <td style={{ ...tdStyle, color:C.danger }}>{d.newD}</td>
                <td style={{ ...tdStyle, color:C.success }}>{d.resolved}</td>
                <td style={{ ...tdStyle, color:C.warn, fontWeight:700 }}>{d.open}</td>
                <td style={{ ...tdStyle, color: d.escaped > 0 ? C.danger : C.success, fontWeight:700 }}>{d.escaped}</td>
                <td style={tdStyle}>{Math.round((d.resolved / (d.open + d.resolved)) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <pre style={preStyle}>{`
  DEFECT TREND - Sprint 23 to Sprint 27
  =========================================

  New Defects:
  S23: ||||||||||||||||||  (18)
  S24: |||||||||||||||     (15)
  S25: ||||||||||||        (12)
  S26: ||||||||||          (10)
  S27: ||||||||            (8)   DECREASING TREND

  Escaped Defects:
  S23: |||  (3)
  S24: ||   (2)
  S25: |    (1)
  S26: |    (1)
  S27:      (0)   ZERO ESCAPED - EXCELLENT

  Open Defects (End of Sprint):
  S23: ######################  (22)
  S24: #####################   (21)
  S25: ###################     (19)
  S26: ################        (16)
  S27: ##############          (14)   DECREASING TREND
`}</pre>

      {/* Test Coverage Trend */}
      <h3 style={sectionTitle}>Test Coverage Trend</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Sprint</th>
              <th style={thStyle}>Total Scenarios</th>
              <th style={thStyle}>Automated</th>
              <th style={thStyle}>Manual</th>
              <th style={thStyle}>Coverage%</th>
              <th style={thStyle}>Automation%</th>
              <th style={thStyle}>Progress</th>
            </tr>
          </thead>
          <tbody>
            {COVERAGE_TRENDS.map((c, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={{ ...tdStyle, fontWeight:600 }}>{c.sprint}</td>
                <td style={tdStyle}>{c.scenarios}</td>
                <td style={{ ...tdStyle, color:C.success }}>{c.automated}</td>
                <td style={{ ...tdStyle, color:C.info }}>{c.manual}</td>
                <td style={{ ...tdStyle, fontWeight:700, color:C.success }}>{c.pct}%</td>
                <td style={{ ...tdStyle, color:C.accent }}>{Math.round((c.automated / c.scenarios) * 100)}%</td>
                <td style={{ ...tdStyle, width:120 }}>{progressBar(c.pct, C.success)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <pre style={preStyle}>{`
  AUTOMATION COVERAGE TREND
  =========================================

  S23: Auto [============        ] 67%  Manual [======    ] 33%
  S24: Auto [==============      ] 74%  Manual [=====     ] 26%
  S25: Auto [================    ] 79%  Manual [====      ] 21%
  S26: Auto [=================   ] 84%  Manual [===       ] 16%
  S27: Auto [==================  ] 88%  Manual [==        ] 12%

  Target: 90% automation by Sprint 30
  Current: 88% (176/200 automated)
  Gap: 4 more test cases to automate
`}</pre>

      {/* Quality Metrics */}
      <h3 style={sectionTitle}>Quality Metrics Dashboard</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16, marginBottom:24 }}>
        {metricCard('Defect Density', '0.07', '14 defects / 200 test cases', C.success)}
        {metricCard('Defect Removal Efficiency', '93%', 'Defects caught in QA vs total', C.success)}
        {metricCard('Test Effectiveness', '87%', 'Defects found / estimated total', C.info)}
        {metricCard('Regression Pass Rate', '95%', 'Regression suite stability', C.success)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16, marginBottom:24 }}>
        {metricCard('Mean Time to Detect', '1.2 hrs', 'Avg time to find defect', C.accent)}
        {metricCard('Mean Time to Resolve', '2.8 days', 'Avg resolution time', C.info)}
        {metricCard('Test Case Growth', '+11%', 'Sprint-over-sprint increase', C.success)}
        {metricCard('Flaky Test Rate', '1.5%', '3 flaky tests identified', C.warn)}
      </div>

      {/* Quality Gate Results */}
      <h3 style={sectionTitle}>Quality Gate Results</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Quality Gate</th>
              <th style={thStyle}>Threshold</th>
              <th style={thStyle}>Actual</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {[
              { gate:'Overall Pass Rate', threshold:'>= 85%', actual:'89.0%', status:'PASS', comment:'4% above threshold' },
              { gate:'Critical Defects Open', threshold:'<= 2', actual:'3', status:'FAIL', comment:'1 over limit - DEF-001, DEF-003, DEF-005' },
              { gate:'Escaped Defects', threshold:'0', actual:'0', status:'PASS', comment:'Zero escaped to production' },
              { gate:'Test Coverage', threshold:'>= 90%', actual:'96%', status:'PASS', comment:'6% above threshold' },
              { gate:'Automation Rate', threshold:'>= 80%', actual:'88%', status:'PASS', comment:'8% above threshold' },
              { gate:'Regression Pass Rate', threshold:'>= 95%', actual:'95%', status:'PASS', comment:'Meeting threshold exactly' },
              { gate:'Avg Defect Resolution', threshold:'<= 5 days', actual:'2.8 days', status:'PASS', comment:'Well within SLA' },
              { gate:'Blocked Tests', threshold:'<= 5%', actual:'4%', status:'PASS', comment:'1% below threshold' }
            ].map((g, i) => (
              <tr key={i} style={{ background: g.status === 'FAIL' ? 'rgba(231,76,60,0.08)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={{ ...tdStyle, fontWeight:600 }}>{g.gate}</td>
                <td style={{ ...tdStyle, fontFamily:'monospace' }}>{g.threshold}</td>
                <td style={{ ...tdStyle, fontFamily:'monospace', fontWeight:700, color: g.status === 'PASS' ? C.success : C.danger }}>{g.actual}</td>
                <td style={tdStyle}>{statusBadge(g.status)}</td>
                <td style={{ ...tdStyle, fontSize:12 }}>{g.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={cardStyle}>
        <h4 style={{ color:C.warn, marginBottom:8, fontWeight:700 }}>Quality Gate Verdict: CONDITIONAL PASS</h4>
        <p style={{ color:C.text, lineHeight:1.7, fontSize:13 }}>
          7 out of 8 quality gates met. The "Critical Defects Open" gate failed with 3 critical defects vs. threshold of 2.
          <strong style={{ color:C.danger }}> Go-live blocked</strong> until at least 1 critical defect is resolved (DEF-001 KYC OTP timeout is
          targeted for hotfix today). Once resolved, quality gate will be re-evaluated for conditional approval.
        </p>
      </div>

      {/* Topic-wise Sprint Trend */}
      <h3 style={sectionTitle}>Pass Rate by Topic - Sprint Over Sprint</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Architecture Topic</th>
              <th style={thStyle}>S23</th>
              <th style={thStyle}>S24</th>
              <th style={thStyle}>S25</th>
              <th style={thStyle}>S26</th>
              <th style={thStyle}>S27</th>
              <th style={thStyle}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {[
              { topic:'Compliance & Regulatory', s23:'75%', s24:'80%', s25:'85%', s26:'85%', s27:'90%', trend:'UP' },
              { topic:'Contract Testing', s23:'80%', s24:'85%', s25:'90%', s26:'90%', s27:'95%', trend:'UP' },
              { topic:'Data Pipeline', s23:'70%', s24:'75%', s25:'80%', s26:'80%', s27:'85%', trend:'UP' },
              { topic:'Message Queue', s23:'80%', s24:'85%', s25:'85%', s26:'90%', s27:'90%', trend:'STABLE' },
              { topic:'Microservices', s23:'75%', s24:'80%', s25:'85%', s26:'85%', s27:'85%', trend:'STABLE' },
              { topic:'Chaos & Resilience', s23:'65%', s24:'70%', s25:'75%', s26:'80%', s27:'80%', trend:'STABLE' },
              { topic:'Cloud Native', s23:'85%', s24:'85%', s25:'90%', s26:'90%', s27:'90%', trend:'STABLE' },
              { topic:'Payment Gateway', s23:'85%', s24:'90%', s25:'90%', s26:'95%', s27:'95%', trend:'STABLE' },
              { topic:'Mainframe Banking', s23:'75%', s24:'80%', s25:'80%', s26:'85%', s27:'85%', trend:'STABLE' },
              { topic:'Concurrency', s23:'90%', s24:'90%', s25:'95%', s26:'95%', s27:'95%', trend:'STABLE' }
            ].map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={{ ...tdStyle, fontWeight:600 }}>{r.topic}</td>
                <td style={{ ...tdStyle, fontSize:12, color: parseInt(r.s23) >= 85 ? C.success : C.warn }}>{r.s23}</td>
                <td style={{ ...tdStyle, fontSize:12, color: parseInt(r.s24) >= 85 ? C.success : C.warn }}>{r.s24}</td>
                <td style={{ ...tdStyle, fontSize:12, color: parseInt(r.s25) >= 85 ? C.success : C.warn }}>{r.s25}</td>
                <td style={{ ...tdStyle, fontSize:12, color: parseInt(r.s26) >= 85 ? C.success : C.warn }}>{r.s26}</td>
                <td style={{ ...tdStyle, fontSize:12, fontWeight:700, color: parseInt(r.s27) >= 85 ? C.success : C.warn }}>{r.s27}</td>
                <td style={tdStyle}>{badge(r.trend === 'UP' ? C.success : C.info, r.trend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Predictive Analysis */}
      <h3 style={sectionTitle}>Sprint 28 Predictive Forecast</h3>
      <pre style={preStyle}>{`
  SPRINT 28 PREDICTIONS (Based on Linear Regression)
  ===================================================

  PASS RATE FORECAST:
  Current Rate:   89.0%
  Predicted:      90.5% (+/- 1.2%)
  Confidence:     82%
  Method:         Weighted Moving Average (last 3 sprints)

  TOPIC-LEVEL PREDICTIONS:
  +----------------------------+--------+-----------+------------+
  | Topic                      | S27    | Predicted | Confidence |
  +----------------------------+--------+-----------+------------+
  | Compliance & Regulatory    | 90%    | 92%       | High       |
  | Contract Testing           | 95%    | 95%       | High       |
  | Data Pipeline              | 85%    | 88%       | Medium     |
  | Message Queue              | 90%    | 90%       | High       |
  | Microservices              | 85%    | 87%       | Medium     |
  | Chaos & Resilience         | 80%    | 83%       | Low        |
  | Cloud Native               | 90%    | 92%       | High       |
  | Payment Gateway            | 95%    | 95%       | High       |
  | Mainframe Banking          | 85%    | 87%       | Medium     |
  | Concurrency                | 95%    | 95%       | High       |
  +----------------------------+--------+-----------+------------+

  DEFECT FORECAST:
  New Defects Expected:    6-8  (based on trend: 18->15->12->10->8)
  Critical Expected:       1-2  (down from 3)
  Resolution Velocity:     Improving (2.8 days avg -> est. 2.5 days)

  RISK FACTORS:
  - Chaos & Resilience still below 85% target
  - 3 critical defects must be resolved before Sprint 28 starts
  - Mainframe batch window overlap not yet fully tested

  AUTOMATION TARGET:
  Current: 88% (176/200)
  Sprint 28 Target: 90% (180/200)
  Tests to automate: TC-CHAOS-004, TC-DATA-003, TC-MICRO-004, TC-MQ-004
`}</pre>

      {/* Velocity Metrics */}
      <h3 style={sectionTitle}>Team Velocity Metrics</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Metric</th>
              <th style={thStyle}>S23</th>
              <th style={thStyle}>S24</th>
              <th style={thStyle}>S25</th>
              <th style={thStyle}>S26</th>
              <th style={thStyle}>S27</th>
              <th style={thStyle}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {[
              { metric:'Tests Executed / Day', s23:'18', s24:'19', s25:'20', s26:'20', s27:'20', trend:'STABLE' },
              { metric:'Defects Found / Day', s23:'1.8', s24:'1.5', s25:'1.2', s26:'1.0', s27:'0.8', trend:'DOWN (Good)' },
              { metric:'Avg Execution Time (min)', s23:'1.65', s24:'1.55', s25:'1.48', s26:'1.40', s27:'1.36', trend:'DOWN (Good)' },
              { metric:'Automation Added / Sprint', s23:'8', s24:'20', s25:'15', s26:'13', s27:'8', trend:'STABLE' },
              { metric:'Blocked Resolution (hrs)', s23:'6.5', s24:'5.2', s25:'4.8', s26:'3.5', s27:'3.0', trend:'DOWN (Good)' },
              { metric:'Rework Rate (%)', s23:'8.5', s24:'7.2', s25:'5.5', s26:'4.0', s27:'3.5', trend:'DOWN (Good)' }
            ].map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={{ ...tdStyle, fontWeight:600 }}>{r.metric}</td>
                <td style={{ ...tdStyle, fontSize:12 }}>{r.s23}</td>
                <td style={{ ...tdStyle, fontSize:12 }}>{r.s24}</td>
                <td style={{ ...tdStyle, fontSize:12 }}>{r.s25}</td>
                <td style={{ ...tdStyle, fontSize:12 }}>{r.s26}</td>
                <td style={{ ...tdStyle, fontSize:12, fontWeight:700, color:C.accent }}>{r.s27}</td>
                <td style={tdStyle}>{badge(r.trend.includes('Good') ? C.success : C.info, r.trend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Risk Heatmap */}
      <h3 style={sectionTitle}>Architecture Risk Heatmap</h3>
      <pre style={preStyle}>{`
  RISK HEATMAP - Architecture Topics (Sprint 27)
  ===============================================

                    LOW IMPACT     MEDIUM IMPACT    HIGH IMPACT
                  +-------------+----------------+---------------+
  HIGH            |             | Chaos &        | DR Switchover |
  LIKELIHOOD      |             | Resilience     | (DEF-003)     |
                  +-------------+----------------+---------------+
  MEDIUM          | Lambda Cold | Data Pipeline  | KYC OTP SLA   |
  LIKELIHOOD      | Start       | ETL Precision  | (DEF-001)     |
                  +-------------+----------------+---------------+
  LOW             | Sanctions   | COBOL S0C7     | 3DS Timeout   |
  LIKELIHOOD      | FP Rate     | DB2 Deadlock   | (DEF-005)     |
                  +-------------+----------------+---------------+

  LEGEND:
    Top-right (High/High):    CRITICAL  - Immediate action required
    Middle (Medium/Medium):   HIGH      - Sprint priority fix
    Bottom-left (Low/Low):    MODERATE  - Planned resolution

  ACTION ITEMS:
  1. DR Switchover: Reduce DNS TTL, increase health check frequency
  2. KYC OTP SLA: Configure gateway timeout, add circuit breaker
  3. 3DS Timeout: Implement challenge-status polling with fallback
  4. Chaos Testing: Tune readiness probe for stress conditions
  5. ETL Precision: Migrate float64 to Decimal128 in Spark jobs
`}</pre>
    </div>
  );

  /* ============================== TAB 5: EXPORT REPORTS ============================== */
  const renderExports = () => (
    <div>
      <h2 style={sectionTitle}>Export Reports</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Generate and download comprehensive test reports for stakeholder distribution, audit compliance,
        and archival purposes. All reports include correlation IDs, timestamps, and digital signatures.
      </p>

      {/* Report Cards */}
      <h3 style={subTitle}>Available Reports</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))', gap:16, marginBottom:24 }}>
        {[
          { title:'Executive Summary Report', format:'PDF', icon:'[PDF]', desc:'High-level overview with pass/fail metrics, severity distribution, key findings, and quality gate results. Suitable for management and steering committee presentations.', lastExport:'2026-02-28 09:15 IST', size:'~2.4 MB', color:C.danger },
          { title:'Detailed Test Results', format:'Excel', icon:'[XLS]', desc:'Complete test execution log with all 200 test cases, timestamps, durations, status, tester assignments, and execution environment details. Filterable and pivot-ready.', lastExport:'2026-02-28 09:15 IST', size:'~1.8 MB', color:C.success },
          { title:'Defect Analysis Report', format:'PDF', icon:'[PDF]', desc:'All 14 defects with root cause analysis, severity distribution, aging analysis, resolution velocity, and recommendations. Includes defect lifecycle charts.', lastExport:'2026-02-28 09:20 IST', size:'~3.1 MB', color:C.danger },
          { title:'Test Coverage Matrix', format:'Excel', icon:'[XLS]', desc:'Requirements-to-test mapping across all 10 architecture topics. Traceability matrix showing BRD requirement coverage, gap analysis, and automation status.', lastExport:'2026-02-27 17:30 IST', size:'~1.2 MB', color:C.success },
          { title:'Trend Analysis Report', format:'PDF', icon:'[PDF]', desc:'5-sprint trend analysis with pass rate progression, defect trend, coverage growth, and quality metrics. Includes predictive analysis for Sprint 28 targets.', lastExport:'2026-02-28 09:25 IST', size:'~4.5 MB', color:C.danger },
          { title:'Architecture Test Data', format:'JSON', icon:'[JSON]', desc:'Raw test execution data in structured JSON format for integration with CI/CD dashboards, Grafana, and custom analytics tools. Includes all metadata.', lastExport:'2026-02-28 09:30 IST', size:'~850 KB', color:C.warn }
        ].map((r, i) => (
          <div key={i} style={{ ...cardStyle, borderLeft:`4px solid ${r.color}`, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <h4 style={{ color:C.header, fontWeight:700, fontSize:15 }}>{r.title}</h4>
                <span style={{ background:r.color, color:'#fff', padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:700 }}>{r.format}</span>
              </div>
              <p style={{ color:C.text, fontSize:12, lineHeight:1.6, marginBottom:12 }}>{r.desc}</p>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ color:C.muted, fontSize:11 }}>Last exported: {r.lastExport}</span>
                <span style={{ color:C.muted, fontSize:11 }}>Size: {r.size}</span>
              </div>
            </div>
            <button
              onClick={() => alert(`Downloading ${r.title} (${r.format})...`)}
              style={{ background:r.color, color:'#fff', border:'none', padding:'10px 20px', borderRadius:6, fontWeight:600, fontSize:13, cursor:'pointer', width:'100%', marginTop:8 }}
            >
              Download {r.format}
            </button>
          </div>
        ))}
      </div>

      {/* Bulk Export */}
      <h3 style={sectionTitle}>Bulk Export</h3>
      <div style={cardStyle}>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:16 }}>
          <button
            onClick={() => alert('Generating all reports as ZIP...')}
            style={{ background:C.accent, color:'#0a0a1a', border:'none', padding:'12px 24px', borderRadius:6, fontWeight:700, fontSize:14, cursor:'pointer' }}
          >
            Download All Reports (ZIP)
          </button>
          <button
            onClick={() => alert('Sending reports via email to stakeholders...')}
            style={{ background:C.info, color:'#fff', border:'none', padding:'12px 24px', borderRadius:6, fontWeight:700, fontSize:14, cursor:'pointer' }}
          >
            Email to Stakeholders
          </button>
          <button
            onClick={() => alert('Uploading to SharePoint...')}
            style={{ background:C.warn, color:'#fff', border:'none', padding:'12px 24px', borderRadius:6, fontWeight:700, fontSize:14, cursor:'pointer' }}
          >
            Upload to SharePoint
          </button>
        </div>
        <p style={{ color:C.muted, fontSize:12 }}>
          Reports are automatically archived in the QA document repository. Retention policy: 2 years for audit compliance.
        </p>
      </div>

      {/* Report Preview */}
      <h3 style={sectionTitle}>Report Preview - Executive Summary</h3>
      <pre style={preStyle}>{`
  +=============================================================================+
  |              ARCHITECTURE TEST EXECUTION REPORT - EXECUTIVE SUMMARY          |
  |              Banking QA Testing Platform - Sprint 27                         |
  |              Date: 2026-02-28 | Prepared By: QA Architecture Team            |
  +=============================================================================+

  1. EXECUTIVE OVERVIEW
  ---------------------
  This report summarizes the test execution results for Sprint 27 across all
  10 architecture testing domains of the Banking QA Testing Platform.

  Overall Result: CONDITIONAL PASS (7/8 quality gates met)
  Blocking Issue: 3 critical defects open (threshold: <= 2)

  2. KEY METRICS
  ---------------------
  Total Test Cases:     200
  Passed:               178 (89.0%)
  Failed:                14 (7.0%)
  Blocked:                8 (4.0%)
  Execution Time:       4h 32m
  Defects Found:        14 (Critical:3, High:5, Medium:4, Low:2)

  3. PASS RATE BY TOPIC
  ---------------------
  Contract Testing         95%  ============= PASS
  Payment Gateway          95%  ============= PASS
  Concurrency              95%  ============= PASS
  Compliance & Regulatory  90%  ============  PASS
  Message Queue            90%  ============  PASS
  Cloud Native             90%  ============  PASS
  Data Pipeline            85%  ===========   WARNING
  Microservices            85%  ===========   WARNING
  Mainframe Banking        85%  ===========   WARNING
  Chaos & Resilience       80%  ==========    WARNING

  4. CRITICAL DEFECTS REQUIRING IMMEDIATE ACTION
  -----------------------------------------------
  DEF-001: KYC OTP timeout exceeds SLA (Compliance)
  DEF-003: DR switchover exceeds 30s RTO (Chaos & Resilience)
  DEF-005: 3DS challenge timeout (Payment Gateway)

  5. TREND SUMMARY
  ---------------------
  Pass Rate Trend:    80.6% -> 84.2% -> 87.2% -> 87.5% -> 89.0% (IMPROVING)
  Defect Trend:       18 -> 15 -> 12 -> 10 -> 8 new/sprint (DECREASING)
  Escaped Defects:    3 -> 2 -> 1 -> 1 -> 0 (ZERO THIS SPRINT)
  Automation:         67% -> 74% -> 79% -> 84% -> 88% (GROWING)

  6. RECOMMENDATION
  ---------------------
  - HOLD go-live until DEF-001 (KYC OTP) hotfix deployed and verified
  - Expedite DEF-003 (DR RTO) fix for regulatory compliance
  - Schedule DEF-005 (3DS timeout) fix for payment team sprint backlog
  - Continue automation push to reach 90% target by Sprint 30

  +=============================================================================+
  |  Report ID: RPT-2026-0228-001 | Classification: INTERNAL - CONFIDENTIAL     |
  |  Digital Signature: SHA256:a1b2c3d4e5f6...                                  |
  +=============================================================================+
`}</pre>

      {/* Report Metadata */}
      <h3 style={sectionTitle}>Report Metadata & Audit Trail</h3>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Report ID</th>
              <th style={thStyle}>Report Name</th>
              <th style={thStyle}>Generated At</th>
              <th style={thStyle}>Generated By</th>
              <th style={thStyle}>Format</th>
              <th style={thStyle}>Checksum (SHA256)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id:'RPT-2026-0228-001', name:'Executive Summary', time:'2026-02-28 09:15:42 IST', by:'System (Auto)', fmt:'PDF', hash:'a1b2c3d4e5f6...' },
              { id:'RPT-2026-0228-002', name:'Detailed Test Results', time:'2026-02-28 09:15:58 IST', by:'System (Auto)', fmt:'XLSX', hash:'f7e8d9c0b1a2...' },
              { id:'RPT-2026-0228-003', name:'Defect Analysis', time:'2026-02-28 09:20:11 IST', by:'Priya S (Manual)', fmt:'PDF', hash:'3c4d5e6f7a8b...' },
              { id:'RPT-2026-0228-004', name:'Coverage Matrix', time:'2026-02-27 17:30:05 IST', by:'System (Auto)', fmt:'XLSX', hash:'9d0e1f2a3b4c...' },
              { id:'RPT-2026-0228-005', name:'Trend Analysis', time:'2026-02-28 09:25:33 IST', by:'System (Auto)', fmt:'PDF', hash:'5e6f7a8b9c0d...' },
              { id:'RPT-2026-0228-006', name:'Architecture Test Data', time:'2026-02-28 09:30:02 IST', by:'CI/CD Pipeline', fmt:'JSON', hash:'1a2b3c4d5e6f...' }
            ].map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={{ ...tdStyle, fontFamily:'monospace', color:C.accent, fontWeight:600 }}>{r.id}</td>
                <td style={tdStyle}>{r.name}</td>
                <td style={{ ...tdStyle, fontFamily:'monospace', fontSize:12 }}>{r.time}</td>
                <td style={{ ...tdStyle, fontSize:12 }}>{r.by}</td>
                <td style={tdStyle}>{badge(r.fmt === 'PDF' ? C.danger : r.fmt === 'XLSX' ? C.success : C.warn, r.fmt)}</td>
                <td style={{ ...tdStyle, fontFamily:'monospace', fontSize:11, color:C.muted }}>{r.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Distribution List */}
      <h3 style={sectionTitle}>Report Distribution List</h3>
      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Stakeholder</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Reports</th>
              <th style={thStyle}>Frequency</th>
              <th style={thStyle}>Delivery</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name:'VP Engineering', role:'Sponsor', reports:'Executive Summary', freq:'Per Sprint', delivery:'Email + SharePoint' },
              { name:'QA Director', role:'QA Lead', reports:'All Reports', freq:'Per Sprint', delivery:'Email + SharePoint + Jira' },
              { name:'Release Manager', role:'Release Mgmt', reports:'Executive Summary, Defect Analysis', freq:'Per Sprint', delivery:'Email + Slack' },
              { name:'Architecture Board', role:'Governance', reports:'Trend Analysis, Coverage Matrix', freq:'Monthly', delivery:'SharePoint + Presentation' },
              { name:'Compliance Officer', role:'Audit', reports:'Executive Summary, Coverage Matrix', freq:'Quarterly', delivery:'Email + Secure Portal' },
              { name:'Dev Team Leads', role:'Development', reports:'Defect Analysis, Test Data', freq:'Per Sprint', delivery:'Jira + Slack' },
              { name:'CISO Office', role:'Security', reports:'Executive Summary, Defect Analysis', freq:'Monthly', delivery:'Encrypted Email' }
            ].map((s, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={{ ...tdStyle, fontWeight:600 }}>{s.name}</td>
                <td style={{ ...tdStyle, fontSize:12 }}>{s.role}</td>
                <td style={{ ...tdStyle, fontSize:12 }}>{s.reports}</td>
                <td style={tdStyle}>{badge(C.info, s.freq)}</td>
                <td style={{ ...tdStyle, fontSize:12 }}>{s.delivery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ============================== MAIN RENDER ============================== */
  return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(135deg, ${C.bgFrom} 0%, ${C.bgTo} 100%)`, padding:'32px 24px', fontFamily:'Inter, Segoe UI, Arial, sans-serif' }}>
      <div style={{ maxWidth:1400, margin:'0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom:32, textAlign:'center' }}>
          <h1 style={{ color:C.header, fontSize:32, fontWeight:800, marginBottom:8, letterSpacing:'-0.5px' }}>
            Architecture Test Results Dashboard
          </h1>
          <p style={{ color:C.muted, fontSize:15, marginBottom:4 }}>
            Banking QA Testing Platform - Sprint 27 | Execution Date: 2026-02-28
          </p>
          <p style={{ color:C.accent, fontSize:13, fontWeight:600 }}>
            10 Architecture Topics | 200 Test Cases | 14 Defects | 89.0% Pass Rate
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display:'flex', gap:4, marginBottom:32, overflowX:'auto', borderBottom:`2px solid ${C.border}`, paddingBottom:0 }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding:'12px 24px',
                background: activeTab === tab.key ? C.card : 'transparent',
                color: activeTab === tab.key ? C.accent : C.muted,
                border: activeTab === tab.key ? `1px solid ${C.accent}` : '1px solid transparent',
                borderBottom: activeTab === tab.key ? `2px solid ${C.accent}` : '2px solid transparent',
                borderRadius:'8px 8px 0 0',
                fontWeight: activeTab === tab.key ? 700 : 500,
                fontSize:14,
                cursor:'pointer',
                transition:'all 0.2s ease',
                whiteSpace:'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'execution' && renderExecution()}
        {activeTab === 'defects' && renderDefects()}
        {activeTab === 'trends' && renderTrends()}
        {activeTab === 'exports' && renderExports()}

        {/* Footer */}
        <div style={{ marginTop:40, paddingTop:20, borderTop:`1px solid ${C.border}`, textAlign:'center' }}>
          <p style={{ color:C.muted, fontSize:12 }}>
            Banking QA Testing Platform - Architecture Test Results Dashboard | Sprint 27 | Generated: 2026-02-28 09:30 IST
          </p>
          <p style={{ color:C.muted, fontSize:11, marginTop:4 }}>
            Classification: INTERNAL - CONFIDENTIAL | Retention: 2 Years | Report ID: RPT-2026-0228-ARCH
          </p>
        </div>
      </div>
    </div>
  );
}

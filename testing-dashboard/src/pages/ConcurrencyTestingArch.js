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

export default function ConcurrencyTestingArch() {
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
      <h2 style={sectionTitle}>Concurrency & Network Testing Platform Architecture</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Enterprise-grade concurrency and network testing platform for banking systems covering race condition detection, deadlock analysis, thread safety validation, network partition testing, double-spending prevention, and distributed transaction consistency. Designed for real-time concurrent transaction processing validation across ATM, POS, mobile banking, and internet banking channels.
      </p>

      <pre style={preStyle}>{`
+=============================================================================+
|           CONCURRENCY & NETWORK TESTING PLATFORM                            |
|              Banking QA Architecture Overview                               |
+=============================================================================+

  TRANSACTION SOURCES              CONCURRENCY ENGINE                 OUTPUT
  ===================              ==================                 ======

  +----------------+         +----------------------------------+
  | ATM Network    |-------->|                                  |    +---------------------+
  | (Multithreaded)|         |    CONCURRENCY TEST ENGINE       |    | Race Condition      |
  +----------------+         |    ========================      |--->| Detection Reports   |
                              |                                  |    +---------------------+
  +----------------+         |  +----------------------------+  |
  | POS Terminals  |-------->|  | Thread Pool Manager        |  |    +---------------------+
  | (Concurrent)   |         |  | - Worker thread allocation |  |--->| Deadlock Analysis   |
  +----------------+         |  | - Thread lifecycle mgmt    |  |    | Reports             |
                              |  | - Pool sizing optimization |  |    +---------------------+
  +----------------+         |  | - Thread starvation detect |  |
  | Mobile Banking |-------->|  +----------------------------+  |    +---------------------+
  | (Multi-session)|         |                                  |--->| Thread Safety       |
  +----------------+         |  +----------------------------+  |    | Validation          |
                              |  | Lock Manager               |  |    +---------------------+
  +----------------+         |  | - Mutex acquisition/release|  |
  | Internet       |-------->|  | - Read/Write lock control  |  |    +---------------------+
  | Banking (Web)  |         |  | - Optimistic lock verify   |  |--->| Network Partition   |
  +----------------+         |  | - Pessimistic lock monitor |  |    | Test Results        |
                              |  | - Distributed lock (Redis) |  |    +---------------------+
  +----------------+         |  +----------------------------+  |
  | Core Banking   |-------->|                                  |    +---------------------+
  | System (CBS)   |         |  +----------------------------+  |--->| Double-Spend        |
  +----------------+         |  | Race Condition Detector    |  |    | Prevention Logs     |
                              |  | - Balance check-and-set    |  |    +---------------------+
  +----------------+         |  | - Lost update detection    |  |
  | RTGS/NEFT/IMPS |-------->|  | - Dirty read scenarios     |  |    +---------------------+
  | Payment Gateway|         |  | - Phantom read detection   |  |--->| Consistency         |
  +----------------+         |  | - Write skew analysis      |  |    | Verification        |
                              |  +----------------------------+  |    +---------------------+
                              |                                  |
                              |  +----------------------------+  |
                              |  | Network Partition Simulator |  |
                              |  | - Split-brain scenarios     |  |
                              |  | - CAP theorem validation    |  |
                              |  | - Jepsen-style testing      |  |
                              |  | - Chaos engineering hooks   |  |
                              |  +----------------------------+  |
                              |                                  |
                              |  +----------------------------+  |
                              |  | Distributed TX Coordinator  |  |
                              |  | - Two-Phase Commit (2PC)    |  |
                              |  | - Saga orchestration        |  |
                              |  | - Compensating transactions |  |
                              |  | - Idempotency validation    |  |
                              |  +----------------------------+  |
                              |                                  |
                              |  +----------------------------+  |
                              |  | Double-Spend Prevention     |  |
                              |  | - UTXO validation           |  |
                              |  | - Balance snapshot isolation|  |
                              |  | - Concurrent debit guard    |  |
                              |  | - Nonce-based ordering      |  |
                              |  +----------------------------+  |
                              |                                  |
                              |  +----------------------------+  |
                              |  | DB Lock Contention Analyzer |  |
                              |  | - Row-level lock monitor    |  |
                              |  | - Table-level lock tracker  |  |
                              |  | - Lock wait timeout detect  |  |
                              |  | - Lock escalation analysis  |  |
                              |  +----------------------------+  |
                              +----------------------------------+

  INFRASTRUCTURE LAYER
  ====================

  +----------------+    +----------------+    +------------------+    +----------------+
  | Redis Cluster  |    | PostgreSQL     |    | Apache Kafka     |    | Consul/etcd    |
  | (Dist. Locks)  |    | (MVCC/Locks)   |    | (Event Ordering) |    | (Service Disc) |
  +----------------+    +----------------+    +------------------+    +----------------+
  +----------------+    +----------------+    +------------------+    +----------------+
  | Chaos Monkey   |    | Toxiproxy      |    | Pumba (Docker)   |    | tc/netem       |
  | (Fault Inject) |    | (Network Sim)  |    | (Container chaos)|    | (Latency/Loss) |
  +----------------+    +----------------+    +------------------+    +----------------+
`}</pre>

      <h3 style={sectionTitle}>Module Overview</h3>
      <div style={gridStyle}>
        {[
          { title:'Race Condition Detector', desc:'Detects time-of-check to time-of-use (TOCTOU) vulnerabilities in banking transactions. Validates that balance checks and updates are atomic. Covers simultaneous debit/credit on same account.', reg:'ACID Compliance', color:C.accent },
          { title:'Deadlock Analyzer', desc:'Monitors and detects circular wait conditions in multi-threaded banking operations. Generates wait-for graphs, identifies lock ordering violations, and validates deadlock prevention strategies.', reg:'Thread Safety Standards', color:C.warn },
          { title:'Thread Safety Validator', desc:'Tests shared mutable state access patterns for account balances, transaction counters, and session data. Validates proper synchronization primitives usage across banking services.', reg:'Concurrency Best Practices', color:C.danger },
          { title:'Network Partition Tester', desc:'Simulates network failures between data centers, database replicas, and service nodes. Validates split-brain resolution, quorum-based decisions, and data consistency during partitions.', reg:'CAP Theorem / Jepsen', color:C.info },
          { title:'Double-Spend Prevention', desc:'Validates that concurrent debit requests against the same account cannot result in overdraft beyond limits. Tests optimistic and pessimistic locking strategies for balance updates.', reg:'Banking Integrity Rules', color:C.success },
          { title:'Concurrent ATM/POS Tester', desc:'Simulates simultaneous ATM withdrawals and POS purchases against shared account balances. Validates real-time authorization, hold management, and settlement consistency.', reg:'Card Network Standards', color:C.warn },
          { title:'DB Lock Contention Monitor', desc:'Analyzes database lock contention patterns during peak transaction loads. Measures lock wait times, identifies hot rows/tables, and validates lock escalation thresholds.', reg:'Database Performance SLA', color:C.accent },
          { title:'Distributed TX Coordinator', desc:'Tests Two-Phase Commit (2PC), Saga patterns, and compensating transactions for cross-service banking operations. Validates eventual consistency and rollback mechanisms.', reg:'Distributed Systems Design', color:C.info }
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
        Concurrency and Network Testing Framework for Banking Systems - Business Requirements covering race conditions, deadlocks, thread safety, network partitions, and distributed transaction consistency.
      </p>

      <h3 style={subTitle}>Objectives</h3>
      <div style={cardStyle}>
        <ul style={{ color:C.text, lineHeight:2, paddingLeft:20 }}>
          <li>Ensure <strong style={{ color:C.accent }}>zero double-spending incidents</strong> across all concurrent transaction channels (ATM, POS, mobile, internet banking)</li>
          <li>Detect and prevent <strong style={{ color:C.danger }}>race conditions</strong> in balance check-and-update operations with 100% coverage</li>
          <li>Validate <strong style={{ color:C.accent }}>deadlock-free operation</strong> under peak load conditions (10,000+ concurrent transactions per second)</li>
          <li>Achieve <strong style={{ color:C.warn }}>sub-200ms transaction latency</strong> even under heavy lock contention scenarios</li>
          <li>Ensure data consistency across <strong style={{ color:C.info }}>distributed database replicas</strong> during network partition events</li>
          <li>Validate <strong style={{ color:C.success }}>99.999% transaction integrity</strong> through comprehensive concurrency testing</li>
        </ul>
      </div>

      <h3 style={sectionTitle}>Scope by Domain</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Domain</th>
            <th style={thStyle}>Scope Areas</th>
            <th style={thStyle}>Key Controls</th>
            <th style={thStyle}>Frequency</th>
          </tr>
        </thead>
        <tbody>
          {[
            { reg:'Race Condition Testing', scope:'Simultaneous balance reads/writes, check-and-set operations, TOCTOU bugs, lost updates, dirty reads, non-repeatable reads, phantom reads across all banking channels', controls:'Atomic operations, Compare-And-Swap (CAS), serializable isolation, read-write locks, version vectors', freq:'Every release + daily regression' },
            { reg:'Deadlock Detection', scope:'Multi-resource lock ordering, cross-service deadlocks, database deadlocks, distributed deadlocks, priority inversion, livelock scenarios', controls:'Lock ordering protocols, timeout-based detection, wait-for graph analysis, lock hierarchy enforcement', freq:'Every release + weekly stress test' },
            { reg:'Thread Safety', scope:'Shared account balance access, concurrent session management, counter atomicity, cache coherence, singleton safety, connection pool thread safety', controls:'Synchronized blocks, ConcurrentHashMap, AtomicLong, thread-local storage, immutable objects, volatile fields', freq:'Continuous (CI/CD pipeline)' },
            { reg:'Network Partition', scope:'Split-brain resolution, quorum decisions, leader election during partition, data reconciliation post-partition, CAP tradeoff validation', controls:'Consensus protocols (Raft/Paxos), quorum reads/writes, anti-entropy repair, conflict-free replicated data types (CRDTs)', freq:'Monthly chaos engineering' },
            { reg:'Double-Spend Prevention', scope:'Concurrent ATM withdrawals, simultaneous POS authorizations, parallel mobile transfers, batch payment vs real-time debit conflicts', controls:'Pessimistic locking, optimistic concurrency control (OCC), serializable snapshots, idempotency keys, nonce validation', freq:'Every release + daily smoke test' },
            { reg:'Distributed Transactions', scope:'Cross-bank fund transfers, multi-service saga orchestration, compensating transaction rollbacks, two-phase commit validation, eventual consistency', controls:'2PC coordinator, saga state machine, outbox pattern, event sourcing, idempotent receivers, dead letter queues', freq:'Every release + weekly integration' },
            { reg:'DB Lock Contention', scope:'Row-level lock wait analysis, table lock escalation, index lock contention, gap lock conflicts, deadlock victim selection, lock timeout tuning', controls:'Lock monitoring queries, pg_stat_activity analysis, lock wait timeout configuration, query optimization, index strategy', freq:'Daily monitoring + weekly tuning' }
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
          { title:'Transaction Throughput', value:'10,000 TPS', desc:'System must handle 10,000 concurrent transactions per second across all channels (ATM, POS, mobile, internet banking) without data integrity violations.', color:C.danger },
          { title:'Lock Acquisition Latency', value:'< 5ms', desc:'Lock acquisition for any banking resource (account balance, transaction record) must complete within 5ms at P99 under peak load conditions.', color:C.warn },
          { title:'Deadlock Detection Time', value:'< 1 second', desc:'Deadlock detection mechanism must identify circular wait conditions within 1 second and automatically resolve by rolling back the victim transaction.', color:C.info },
          { title:'Partition Recovery Time', value:'< 30 seconds', desc:'After network partition heals, data consistency across replicas must be restored within 30 seconds with zero data loss for committed transactions.', color:C.danger },
          { title:'Consistency Guarantee', value:'99.999%', desc:'Transaction consistency must be maintained at 99.999% (five nines) even under concurrent access, network failures, and partial system outages.', color:C.success },
          { title:'Race Condition Coverage', value:'100%', desc:'All critical paths involving balance reads and updates must have race condition test coverage. Zero tolerance for TOCTOU vulnerabilities in production.', color:C.accent }
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
        High-level concurrency testing architecture showing transaction flow through lock managers, thread pools, race condition detectors, and distributed transaction coordinators.
      </p>

      <pre style={preStyle}>{`
+=============================================================================+
|              HIGH-LEVEL CONCURRENCY TESTING ARCHITECTURE                     |
+=============================================================================+

   CONCURRENT TRANSACTION FLOW
   ============================

   Incoming Transaction (ATM/POS/Mobile/Internet Banking/CBS)
            |
            v
   +------------------+     +--------------------+     +-------------------+
   | Thread Pool Mgr  |---->| Lock Manager        |---->| Isolation Level   |
   | - Thread alloc   |     | (Concurrency Ctrl)  |     | Controller        |
   | - Queue sizing   |     |                     |     | - Read Committed  |
   | - Priority queue |     | - Pessimistic Locks |     | - Repeatable Read |
   | - Backpressure   |     | - Optimistic Locks  |     | - Serializable    |
   +------------------+     | - Distributed Locks |     | - Snapshot Isol.  |
                             +--------------------+     +-------------------+
                                                              |
                             +--------------------+           |
                             | Race Condition     |<----------+
                             | Detector           |
                             | - TOCTOU check     |
                             | - ABA detection    |
                             | - Lost update guard|
                             +--------------------+
                                      |
                             +--------------------+     +-------------------+
                             | Deadlock Monitor   |---->| Conflict Resolver |
                             | - Wait-for graph   |     | - Victim select   |
                             | - Timeout detect   |     | - Auto-rollback   |
                             | - Cycle detection  |     | - Retry strategy  |
                             | - Lock ordering    |     | - Backoff policy  |
                             +--------------------+     +-------------------+


   LOCK HIERARCHY MODEL
   ====================

   +------------------------------------------------------------------+
   |                     Banking Lock Hierarchy                        |
   |                                                                   |
   |  Level 1 (Coarsest)                                              |
   |  +-------------+  +---------------+  +----------------+          |
   |  | Database     |  | Schema Lock   |  | Partition Lock |          |
   |  | Lock         |  | (DDL ops)     |  | (Shard-level)  |          |
   |  +-------------+  +---------------+  +----------------+          |
   |                                                                   |
   |  Level 2                                                         |
   |  +-------------+  +---------------+  +----------------+          |
   |  | Table Lock  |  | Index Lock    |  | Sequence Lock  |          |
   |  | (Bulk ops)  |  | (B-tree node) |  | (ID generation)|          |
   |  +-------------+  +---------------+  +----------------+          |
   |                                                                   |
   |  Level 3 (Finest)                                                |
   |  +-------------+  +---------------+  +----------------+          |
   |  | Row Lock    |  | Column Lock   |  | Key-Range Lock |          |
   |  | (Account    |  | (Balance fld) |  | (Gap/Next-Key) |          |
   |  |  record)    |  |               |  |                |          |
   |  +-------------+  +---------------+  +----------------+          |
   +------------------------------------------------------------------+


   DISTRIBUTED LOCK SERVICE
   ========================

   +------------------------------------------------------------------+
   |              Redis-Based Distributed Lock (Redlock)               |
   |                                                                   |
   |  +------------------+  +------------------+  +--------------+    |
   |  | Redis Node 1     |  | Redis Node 2     |  | Redis Node 3 |    |
   |  | (Master)         |  | (Master)         |  | (Master)     |    |
   |  |                  |  |                  |  |              |    |
   |  | SET lock_key     |  | SET lock_key     |  | SET lock_key |    |
   |  | NX PX 30000      |  | NX PX 30000      |  | NX PX 30000  |    |
   |  +------------------+  +------------------+  +--------------+    |
   |                                                                   |
   |  Quorum: Acquire lock on N/2+1 nodes (2 of 3)                   |
   |  Fencing Token: Monotonically increasing sequence number         |
   |  TTL: Auto-release after 30s to prevent lock leaks               |
   +------------------------------------------------------------------+


   NETWORK PARTITION TESTING
   =========================

   +------------------------------------------------------------------+
   |                Network Fault Injection Layer                      |
   |                                                                   |
   |  +------------------+    +------------------+                     |
   |  | Data Center A    |    | Data Center B    |                     |
   |  | (Primary)        |    | (Secondary)      |                     |
   |  |                  |    |                   |                     |
   |  | DB Primary  <=======X======>  DB Replica  |                     |
   |  | App Server 1     |    | App Server 2     |                     |
   |  | Redis Master <=====X======>  Redis Replica|                     |
   |  +------------------+    +------------------+                     |
   |                                                                   |
   |  X = Network partition injected by Toxiproxy/tc netem            |
   |  Test: Both sides accept writes -> split-brain detected          |
   |  Resolution: Quorum-based or last-writer-wins with vector clocks |
   +------------------------------------------------------------------+


   TWO-PHASE COMMIT (2PC)
   ======================

   +------------------------------------------------------------------+
   |  Coordinator          Participant A       Participant B           |
   |  (TX Manager)         (Account DB)        (Ledger DB)            |
   |      |                     |                    |                 |
   |      |--- PREPARE -------->|                    |                 |
   |      |--- PREPARE ---------|------------------>|                 |
   |      |                     |                    |                 |
   |      |<-- VOTE_COMMIT -----|                    |                 |
   |      |<-- VOTE_COMMIT -----|--------------------| (if both YES)  |
   |      |                     |                    |                 |
   |      |--- COMMIT --------->|                    |                 |
   |      |--- COMMIT ----------|------------------>|                 |
   |      |                     |                    |                 |
   |      |<-- ACK -------------|                    |                 |
   |      |<-- ACK -------------|--------------------| (TX Complete)  |
   +------------------------------------------------------------------+
`}</pre>
    </div>
  );

  const renderLLD = () => (
    <div>
      <h2 style={sectionTitle}>Low-Level Design (LLD)</h2>

      <h3 style={subTitle}>Concurrency Control API Contracts</h3>
      <pre style={preStyle}>{`
  CONCURRENCY CONTROL API ENDPOINTS
  ==================================

  POST /api/v1/concurrency/acquire-lock
  --------------------------------------
  Request:
  {
    "resource_id": "ACCT-2024-001",
    "resource_type": "ACCOUNT_BALANCE",
    "lock_type": "WRITE",
    "timeout_ms": 5000,
    "holder_id": "TXN-20240115-00042",
    "fencing_token": true
  }
  Response: 200 OK
  {
    "lock_id": "LOCK-2024-00042",
    "resource_id": "ACCT-2024-001",
    "acquired": true,
    "fencing_token": 42,
    "ttl_ms": 30000,
    "acquired_at": "2024-01-15T10:30:00.123Z"
  }

  POST /api/v1/concurrency/release-lock
  ---------------------------------------
  Request:
  {
    "lock_id": "LOCK-2024-00042",
    "holder_id": "TXN-20240115-00042",
    "fencing_token": 42
  }
  Response: 200 OK
  {
    "released": true,
    "held_duration_ms": 12,
    "contention_count": 3
  }

  POST /api/v1/concurrency/atomic-debit
  ---------------------------------------
  Request:
  {
    "account_id": "ACCT-2024-001",
    "amount": 5000.00,
    "currency": "INR",
    "idempotency_key": "IDEM-2024-UUID-001",
    "expected_version": 42,
    "channel": "ATM",
    "terminal_id": "ATM-MUM-001"
  }
  Response: 200 OK
  {
    "transaction_id": "TXN-20240115-00042",
    "status": "COMMITTED",
    "new_balance": 45000.00,
    "new_version": 43,
    "lock_wait_ms": 3,
    "timestamp": "2024-01-15T10:30:00.135Z"
  }

  GET /api/v1/concurrency/deadlock-report
  ----------------------------------------
  Response: 200 OK
  {
    "active_deadlocks": 0,
    "resolved_last_hour": 2,
    "wait_for_graph": {
      "nodes": ["TXN-001", "TXN-002", "TXN-003"],
      "edges": [
        {"from": "TXN-001", "waits_for": "TXN-002", "resource": "ACCT-100"},
        {"from": "TXN-002", "waits_for": "TXN-003", "resource": "ACCT-200"},
        {"from": "TXN-003", "waits_for": "TXN-001", "resource": "ACCT-300"}
      ],
      "cycle_detected": true,
      "victim": "TXN-003",
      "resolution": "ROLLBACK_YOUNGEST"
    }
  }
`}</pre>

      <h3 style={sectionTitle}>Lock Strategy Implementations</h3>
      <pre style={preStyle}>{`
  OPTIMISTIC CONCURRENCY CONTROL (OCC)
  =====================================

  -- Step 1: Read with version
  SELECT balance, version FROM accounts WHERE account_id = ?;
  -- Returns: balance=50000, version=42

  -- Step 2: Application logic (check sufficient balance)
  -- new_balance = 50000 - 5000 = 45000

  -- Step 3: Conditional update with version check
  UPDATE accounts
  SET balance = 45000, version = 43, updated_at = NOW()
  WHERE account_id = ? AND version = 42;
  -- If rows_affected = 0 -> CONFLICT (retry with backoff)
  -- If rows_affected = 1 -> SUCCESS

  PESSIMISTIC LOCKING (SELECT FOR UPDATE)
  ========================================

  BEGIN TRANSACTION;
    -- Step 1: Acquire row-level lock
    SELECT balance FROM accounts
    WHERE account_id = ?
    FOR UPDATE NOWAIT;
    -- Throws: lock_not_available if row already locked

    -- Step 2: Validate and update
    UPDATE accounts
    SET balance = balance - 5000, updated_at = NOW()
    WHERE account_id = ? AND balance >= 5000;
    -- If rows_affected = 0 -> INSUFFICIENT_BALANCE (rollback)

    -- Step 3: Insert transaction record
    INSERT INTO transactions (account_id, amount, type, status)
    VALUES (?, -5000, 'DEBIT', 'COMPLETED');
  COMMIT;

  DISTRIBUTED LOCK (REDLOCK ALGORITHM)
  =====================================

  Algorithm:
    1. Get current time T1
    2. Try to acquire lock on N Redis instances sequentially
       SET resource_name unique_value NX PX 30000
    3. Calculate elapsed time: T2 - T1
    4. Lock acquired if:
       - Majority (N/2 + 1) instances granted lock
       - Elapsed time < lock TTL
    5. Lock validity time = TTL - elapsed
    6. If lock NOT acquired, release on ALL instances

  COMPARE-AND-SWAP (CAS) FOR BALANCE
  ====================================

  function atomicDebit(accountId, amount):
      while true:
          current = readBalance(accountId)  // {balance: 50000, cas: "abc123"}
          if current.balance < amount:
              throw InsufficientBalance
          newBalance = current.balance - amount
          success = compareAndSwap(accountId, current.cas, newBalance)
          if success:
              return newBalance
          else:
              backoff(attempt++)  // Exponential backoff
`}</pre>

      <h3 style={sectionTitle}>Database Schema for Concurrency</h3>
      <pre style={preStyle}>{`
  DATABASE SCHEMA DESIGN
  ======================

  TABLE: accounts
  ----------------
  account_id       VARCHAR(20)  PRIMARY KEY
  customer_id      VARCHAR(20)  NOT NULL
  balance          DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK(balance >= 0)
  hold_amount      DECIMAL(15,2) NOT NULL DEFAULT 0
  available_bal    DECIMAL(15,2) GENERATED ALWAYS AS (balance - hold_amount)
  version          BIGINT       NOT NULL DEFAULT 1
  lock_holder      VARCHAR(50)
  lock_acquired_at TIMESTAMP
  updated_at       TIMESTAMP    DEFAULT NOW()
  INDEX idx_accounts_customer   ON accounts(customer_id)
  INDEX idx_accounts_version    ON accounts(version)

  TABLE: distributed_locks
  -------------------------
  lock_id          VARCHAR(50)  PRIMARY KEY
  resource_id      VARCHAR(100) NOT NULL
  resource_type    VARCHAR(50)  NOT NULL
  holder_id        VARCHAR(100) NOT NULL
  fencing_token    BIGSERIAL
  acquired_at      TIMESTAMP    DEFAULT NOW()
  expires_at       TIMESTAMP    NOT NULL
  released_at      TIMESTAMP
  INDEX idx_locks_resource     ON distributed_locks(resource_id, resource_type)
  INDEX idx_locks_holder       ON distributed_locks(holder_id)
  INDEX idx_locks_expires      ON distributed_locks(expires_at)

  TABLE: deadlock_history
  ------------------------
  deadlock_id      BIGSERIAL    PRIMARY KEY
  detected_at      TIMESTAMP    DEFAULT NOW()
  cycle_json       JSONB        NOT NULL
  victim_txn_id    VARCHAR(50)  NOT NULL
  resolution       VARCHAR(50)  NOT NULL
  wait_graph_json  JSONB
  total_wait_ms    INTEGER
  INDEX idx_deadlock_detected  ON deadlock_history(detected_at)
  INDEX idx_deadlock_victim    ON deadlock_history(victim_txn_id)

  TABLE: concurrency_test_results
  --------------------------------
  test_id          BIGSERIAL    PRIMARY KEY
  test_type        VARCHAR(50)  NOT NULL
  thread_count     INTEGER      NOT NULL
  duration_ms      INTEGER      NOT NULL
  total_ops        BIGINT       NOT NULL
  successful_ops   BIGINT       NOT NULL
  failed_ops       BIGINT       NOT NULL
  race_conditions  INTEGER      DEFAULT 0
  deadlocks        INTEGER      DEFAULT 0
  avg_latency_ms   DECIMAL(10,3)
  p99_latency_ms   DECIMAL(10,3)
  created_at       TIMESTAMP    DEFAULT NOW()
  INDEX idx_conctest_type      ON concurrency_test_results(test_type)
  INDEX idx_conctest_created   ON concurrency_test_results(created_at)
`}</pre>
    </div>
  );

  const renderScenarios = () => (
    <div>
      <h2 style={sectionTitle}>Concurrency Testing Scenarios</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 comprehensive test scenarios covering race conditions, deadlocks, thread safety, network partitions, double-spending, and distributed transaction consistency for banking systems.
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
            { id:'S01', title:'Simultaneous Debit from Same Account (2 ATMs)', reg:'Race Condition', desc:'Customer initiates INR 40,000 withdrawal from two different ATMs simultaneously. Account balance is INR 50,000. Both ATMs read balance at the same instant. Without proper locking, both could succeed, resulting in -INR 30,000 balance.', outcome:'Only one withdrawal succeeds. Second ATM receives "Insufficient Balance" or retries with updated balance. Final balance is INR 10,000. No negative balance allowed.' },
            { id:'S02', title:'Concurrent Credit and Debit on Same Account', reg:'Race Condition', desc:'Salary credit of INR 100,000 (NEFT) arrives while customer is withdrawing INR 20,000 at ATM. Both operations read initial balance of INR 5,000 simultaneously. Risk of lost update where one operation overwrites the other.', outcome:'Both operations succeed atomically. Final balance = 5000 + 100000 - 20000 = INR 85,000. Neither operation is lost. Version numbers increment correctly.' },
            { id:'S03', title:'Deadlock Between Fund Transfer Accounts', reg:'Deadlock', desc:'Transaction A transfers INR 10,000 from Account X to Account Y (locks X first, then Y). Transaction B simultaneously transfers INR 5,000 from Account Y to Account X (locks Y first, then X). Classic circular wait deadlock.', outcome:'Deadlock detected within 1 second. One transaction chosen as victim and rolled back. Other transaction completes successfully. Victim transaction retried automatically with backoff.' },
            { id:'S04', title:'Thread Pool Exhaustion Under Load', reg:'Thread Safety', desc:'50,000 concurrent mobile banking requests arrive within 10 seconds. Thread pool is configured for 200 worker threads. Queue capacity is 10,000. Tests backpressure handling when both pool and queue are full.', outcome:'System handles load gracefully: 200 threads active, 10,000 queued, remaining rejected with 503 Service Unavailable. No thread leaks, no OOM. Pool recovers within 5 seconds after load drops.' },
            { id:'S05', title:'Network Partition Between Primary and Replica DB', reg:'Network Partition', desc:'Network partition injected between PostgreSQL primary and read replica during peak trading hours. 500 TPS write load on primary, 2000 TPS read load on replica. Partition lasts 60 seconds.', outcome:'Writes continue on primary without interruption. Reads on replica serve stale data (max staleness bounded). After partition heals, replica catches up within 30 seconds. Zero data loss for committed writes.' },
            { id:'S06', title:'Double-Spend via Concurrent API Calls', reg:'Double-Spend', desc:'Attacker sends 100 simultaneous debit requests for INR 50,000 each against account with INR 50,000 balance. All requests arrive within 50ms window. Tests idempotency and serialization controls.', outcome:'Exactly one debit succeeds. Remaining 99 requests receive either "Insufficient Balance" or idempotency key rejection. Final balance is INR 0. No overdraft. Suspicious activity logged.' },
            { id:'S07', title:'Optimistic Lock Conflict on Balance Update', reg:'Race Condition', desc:'10 concurrent transactions read account version=42 and attempt to update balance. Each expects version=42 during write. Only first write should succeed; remaining 9 should detect version conflict.', outcome:'First transaction succeeds with version=43. Remaining 9 receive OptimisticLockException. Each retries with fresh read (version=43). Retry convergence within 3 attempts for all.' },
            { id:'S08', title:'Split-Brain in Redis Cluster (Distributed Lock)', reg:'Network Partition', desc:'Redis cluster with 5 nodes split into 2+3 partition. Client A holds lock via 2-node partition. Client B attempts lock acquisition on 3-node partition. Both could believe they hold the lock.', outcome:'Fencing token prevents split-brain writes. 3-node partition has quorum and issues valid lock. 2-node partition lock is invalid (no quorum). Client A operation rejected by storage layer via fencing token check.' },
            { id:'S09', title:'Concurrent Account Opening with Same PAN', reg:'Thread Safety', desc:'Two bank branches simultaneously process account opening for same customer (same PAN number). Both check "PAN not exists" at the same time, both proceed to create. Risk of duplicate accounts.', outcome:'Unique constraint on PAN prevents duplicate. Second insertion fails with conflict error. Branch receives clear error message. No duplicate accounts created. Audit log captures both attempts.' },
            { id:'S10', title:'Database Lock Escalation Under Batch Processing', reg:'DB Lock Contention', desc:'Batch job updates 50,000 account records for interest computation while real-time transactions continue. Row-level locks escalate to table lock after threshold, blocking all real-time transactions.', outcome:'Batch job processes in chunks of 1,000 with explicit COMMIT between chunks. No table-level lock escalation. Real-time transactions experience max 50ms additional latency. Zero timeouts.' },
            { id:'S11', title:'Saga Pattern Failure Mid-Way Through Fund Transfer', reg:'Distributed TX', desc:'Inter-bank transfer saga: Step 1 (Debit sender) succeeds, Step 2 (Credit receiver at partner bank) fails due to partner bank timeout. Compensating transaction must reverse Step 1.', outcome:'Saga orchestrator detects Step 2 failure. Compensating transaction reverses Step 1 debit. Sender balance restored. Transaction marked FAILED with clear reason. Customer notified of reversal within 2 minutes.' },
            { id:'S12', title:'Concurrent UPI Collect Requests on Same Account', reg:'Race Condition', desc:'5 UPI collect requests arrive simultaneously for same payer account. Total of all collect amounts exceeds balance. Each reads balance independently before hold placement.', outcome:'Holds placed sequentially with balance validation. Only collects that fit within available balance are authorized. Remaining rejected with insufficient funds. Running balance calculated correctly per hold.' },
            { id:'S13', title:'Priority Inversion in Transaction Processing', reg:'Deadlock', desc:'High-priority RTGS transfer (INR 10 Crore) waiting for lock held by low-priority batch reconciliation job. Medium-priority mobile transactions keep preempting the low-priority job, preventing lock release.', outcome:'Priority inheritance protocol activated. Low-priority job temporarily inherits RTGS priority. Batch job completes lock section in <100ms. RTGS transaction proceeds within SLA. No starvation.' },
            { id:'S14', title:'Two-Phase Commit Coordinator Failure', reg:'Distributed TX', desc:'2PC coordinator sends PREPARE to both participants. Both vote COMMIT. Coordinator crashes before sending COMMIT. Both participants in uncertain state (prepared but not committed/aborted).', outcome:'Participants detect coordinator failure via heartbeat timeout. Recovery coordinator reads transaction log. Determines both voted COMMIT. Issues COMMIT to both. Transaction completes after recovery. Max uncertainty window: 30 seconds.' },
            { id:'S15', title:'Concurrent Standing Instruction Execution', reg:'Thread Safety', desc:'10 standing instructions scheduled at same time (00:00:00) for different accounts but processed by same thread pool. Tests thread safety of the scheduler and execution engine.', outcome:'All 10 instructions execute exactly once. No double-execution. No missed execution. Thread pool handles concurrent scheduling without race conditions. Each instruction gets unique execution ID.' },
            { id:'S16', title:'Cache Coherence During Balance Update', reg:'Thread Safety', desc:'Redis cache holds account balance. Database updated via direct SQL. Cache invalidation message lost due to network glitch. Subsequent reads serve stale cached balance, causing incorrect authorization decisions.', outcome:'Write-through cache strategy ensures cache updated atomically with DB. If cache update fails, cache entry invalidated. Read-through fallback to DB on cache miss. Max stale read window: 0ms (synchronous invalidation).' },
            { id:'S17', title:'Jepsen-Style Linearizability Test', reg:'Network Partition', desc:'Multiple clients perform concurrent read-write operations on account balance during induced network partitions. After all partitions heal, verify that all operations are linearizable (appear to execute in some sequential order consistent with real-time ordering).', outcome:'All operations pass linearizability check (Knossos model checker). No stale reads observed post-partition. Write ordering preserved. Consistency violations: 0. System passes Jepsen audit.' },
            { id:'S18', title:'Hot Account Row Lock Contention', reg:'DB Lock Contention', desc:'Popular merchant account receives 500 concurrent credit transactions per second. All transactions contend for same row lock on the merchant account balance. Tests lock throughput and queuing efficiency.', outcome:'Lock throughput sustained at 500 TPS. Average lock wait time < 10ms. P99 lock wait time < 50ms. No lock timeouts. Batch aggregation reduces lock contention by 10x via periodic flush.' },
            { id:'S19', title:'Idempotent Retry After Network Timeout', reg:'Distributed TX', desc:'Client sends debit request, receives network timeout (no response). Client retries with same idempotency key. Server had already processed the original request successfully. Tests idempotency guarantee.', outcome:'Retry returns cached result from original execution. Account debited exactly once. Idempotency key maps to original transaction ID. Response identical to original (same balance, timestamp, status).' },
            { id:'S20', title:'Concurrent Batch Settlement and Real-Time Auth', reg:'Race Condition', desc:'Card network batch settlement file processes 100,000 transactions while real-time POS authorizations continue. Settlement adjusts hold amounts while new authorizations check available balance.', outcome:'Settlement and authorization use separate lock granularities. Settlement releases holds in bulk. Authorization checks available_balance (balance - active_holds). No authorization uses stale hold data. Reconciliation matches 100%.' }
          ].map((s, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:700, textAlign:'center' }}>{s.id}</td>
              <td style={{ ...tdStyle, fontWeight:600, color:C.header, minWidth:200 }}>{s.title}</td>
              <td style={{ ...tdStyle, textAlign:'center' }}>{badge(
                s.reg.includes('Race') ? C.danger : s.reg.includes('Deadlock') ? C.warn : s.reg.includes('Thread') ? C.info : s.reg.includes('Network') ? C.accent : s.reg.includes('Double') ? C.danger : s.reg.includes('DB') ? C.warn : C.success,
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
      <h2 style={sectionTitle}>Concurrency Test Cases</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 detailed test cases with step-by-step procedures for validating concurrency, thread safety, and distributed transaction integrity in banking systems.
      </p>
      <div style={{ overflowX:'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, minWidth:80 }}>TC-ID</th>
              <th style={{ ...thStyle, minWidth:180 }}>Test Case</th>
              <th style={{ ...thStyle, minWidth:80 }}>Category</th>
              <th style={{ ...thStyle, minWidth:250 }}>Steps</th>
              <th style={{ ...thStyle, minWidth:200 }}>Expected Result</th>
              <th style={{ ...thStyle, minWidth:60 }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id:'TC-CC-001', title:'Atomic Balance Debit Under Concurrency', reg:'Race Condition', steps:'1. Set account balance to INR 100,000\n2. Launch 10 threads, each debiting INR 10,000\n3. All threads start simultaneously via CountDownLatch\n4. Wait for all threads to complete\n5. Verify final balance = INR 0\n6. Verify exactly 10 successful transactions', result:'Final balance exactly INR 0. Exactly 10 transactions committed. No lost updates. No negative balance at any point.', pri:'P0' },
              { id:'TC-CC-002', title:'Optimistic Lock Retry Convergence', reg:'Race Condition', steps:'1. Set account version to 1\n2. Launch 20 threads reading same version\n3. Each thread attempts update with version=1\n4. First succeeds, 19 get conflict\n5. Verify all 19 retry with updated version\n6. Verify all 20 eventually succeed', result:'All 20 operations complete within 5 retries. No operation permanently fails. Final version = 21. All balance updates applied correctly.', pri:'P0' },
              { id:'TC-CC-003', title:'Deadlock Detection and Auto-Resolution', reg:'Deadlock', steps:'1. Create accounts A and B with INR 50,000 each\n2. Thread 1: Lock A, sleep 100ms, try Lock B\n3. Thread 2: Lock B, sleep 100ms, try Lock A\n4. Deadlock forms within 200ms\n5. Monitor deadlock detector\n6. Verify victim rollback and retry', result:'Deadlock detected in < 1 second. One transaction rolled back (victim). Other completes. Victim retried with opposite lock order. Both complete within 3 seconds total.', pri:'P0' },
              { id:'TC-CC-004', title:'Thread Pool Saturation Backpressure', reg:'Thread Safety', steps:'1. Configure pool: 10 threads, queue: 100\n2. Submit 500 tasks simultaneously\n3. Monitor queue depth over time\n4. Verify rejection policy activates at 110\n5. Monitor thread utilization\n6. Verify clean recovery after load drops', result:'10 tasks active, 100 queued, 390 rejected with RejectedExecutionException. No thread leak after load drops. Pool reusable for new tasks.', pri:'P0' },
              { id:'TC-CC-005', title:'Double-Spend Prevention (Concurrent Debits)', reg:'Double-Spend', steps:'1. Set balance to INR 50,000\n2. Send 50 parallel debit requests of INR 50,000 each\n3. Use unique idempotency key per request\n4. Wait for all responses\n5. Count successful vs rejected\n6. Verify final balance', result:'Exactly 1 debit succeeds. 49 rejected with insufficient balance. Final balance = INR 0. No overdraft. Audit log shows 50 attempts, 1 success.', pri:'P0' },
              { id:'TC-CC-006', title:'Network Partition with Write Conflict', reg:'Network Partition', steps:'1. Setup primary-replica PostgreSQL cluster\n2. Inject network partition via Toxiproxy\n3. Write to primary during partition\n4. Attempt write to replica (should fail)\n5. Heal partition\n6. Verify replica catches up', result:'Primary accepts writes during partition. Replica rejects writes (read-only). After heal, replica replays WAL and catches up within 30s. Zero data divergence.', pri:'P0' },
              { id:'TC-CC-007', title:'Distributed Lock Fencing Token Validation', reg:'Distributed TX', steps:'1. Client A acquires lock with fencing_token=10\n2. Client A pauses (GC pause simulated)\n3. Lock expires, Client B acquires token=11\n4. Client A resumes, tries write with token=10\n5. Storage rejects token=10 (< current 11)\n6. Verify data integrity', result:'Client A write rejected by storage (stale fencing token). Client B write accepted. No data corruption from expired lock holder. Alert generated for stale lock usage.', pri:'P0' },
              { id:'TC-CC-008', title:'Saga Compensating Transaction', reg:'Distributed TX', steps:'1. Initiate cross-bank transfer saga\n2. Step 1: Debit sender (SUCCESS)\n3. Step 2: Credit receiver (TIMEOUT)\n4. Saga detects Step 2 failure\n5. Execute compensating: Credit sender\n6. Verify sender balance restored', result:'Sender balance restored to original. Saga state = COMPENSATED. Compensating transaction has unique ID. No money lost. Customer notified of failure.', pri:'P0' },
              { id:'TC-CC-009', title:'Concurrent Account Interest Calculation', reg:'Thread Safety', steps:'1. Create 1,000 accounts with varying balances\n2. Launch interest calculation for all accounts\n3. Simultaneously process real-time debits on 100 accounts\n4. Verify no lost updates\n5. Check interest applied exactly once\n6. Reconcile total interest paid', result:'Interest applied exactly once per account. Real-time debits not lost. Total interest matches independent calculation. No duplicate interest credits.', pri:'P0' },
              { id:'TC-CC-010', title:'Redis Cache Stampede Prevention', reg:'Thread Safety', steps:'1. Cache entry for popular account expires\n2. 100 concurrent requests arrive for same account\n3. Without protection: 100 DB queries (stampede)\n4. With singleflight: 1 DB query + 99 wait\n5. Verify only 1 DB query executed\n6. All 100 responses correct', result:'Single DB query executed (singleflight pattern). 99 waiters receive cached result. DB load reduced by 99%. All responses have correct balance.', pri:'P1' },
              { id:'TC-CC-011', title:'Row-Level Lock Timeout Configuration', reg:'DB Lock Contention', steps:'1. Transaction A locks account row with FOR UPDATE\n2. Transaction A sleeps for 10 seconds\n3. Transaction B attempts FOR UPDATE NOWAIT\n4. Transaction B should fail immediately\n5. Transaction C attempts with lock_timeout=2s\n6. Transaction C should fail after 2 seconds', result:'Transaction B fails immediately with lock_not_available. Transaction C fails after 2 seconds with lock_timeout. Transaction A completes normally after sleep.', pri:'P1' },
              { id:'TC-CC-012', title:'Phantom Read Prevention Under Serializable', reg:'Race Condition', steps:'1. Set isolation level to SERIALIZABLE\n2. Transaction A: SELECT COUNT(*) WHERE balance > 50000\n3. Transaction B: INSERT account with balance 60000\n4. Transaction B: COMMIT\n5. Transaction A: Re-run same COUNT(*)\n6. Verify A sees same count (no phantom)', result:'Transaction A sees consistent count in both queries. Phantom read prevented by serializable isolation. Transaction B either blocks or A gets serialization failure (retry).', pri:'P1' },
              { id:'TC-CC-013', title:'Concurrent POS Authorization and Settlement', reg:'Race Condition', steps:'1. POS authorization places hold of INR 5,000\n2. Simultaneously, batch settlement releases old hold of INR 3,000\n3. Both modify hold_amount on same account\n4. Verify atomic hold update\n5. Check available_balance accuracy\n6. Reconcile holds at end of day', result:'Hold amount accurately reflects both operations. Available balance = balance - net_holds. No stale hold data used. End-of-day reconciliation matches 100%.', pri:'P0' },
              { id:'TC-CC-014', title:'Leader Election During Network Partition', reg:'Network Partition', steps:'1. 3-node database cluster with leader on Node 1\n2. Network partition isolates Node 1\n3. Nodes 2 and 3 elect new leader\n4. Both leaders accept writes (split-brain)\n5. Partition heals\n6. Conflict resolution executes', result:'Node 2/3 partition elects new leader (quorum). Node 1 steps down when quorum lost. After heal, Node 1 catches up from new leader. No conflicting writes reach storage. Zero data loss.', pri:'P0' },
              { id:'TC-CC-015', title:'Concurrent Batch File Processing', reg:'Thread Safety', steps:'1. Upload 3 payment batch files simultaneously\n2. Each file contains 10,000 transactions\n3. Some transactions across files affect same accounts\n4. Process all files in parallel\n5. Verify no transaction lost or duplicated\n6. Verify account balances consistent', result:'All 30,000 transactions processed exactly once. Cross-file account conflicts resolved via row-level locking. Zero duplicates. Final balances match sequential processing result.', pri:'P1' },
              { id:'TC-CC-016', title:'Connection Pool Exhaustion Under Concurrency', reg:'Thread Safety', steps:'1. Configure DB connection pool: max=50\n2. Launch 200 concurrent long-running queries\n3. Verify pool hands out 50 connections\n4. 150 requests wait in pool queue\n5. Set connection timeout to 5 seconds\n6. Verify timeout handling for waiting requests', result:'50 connections active. 150 waiting. After 5s timeout, waiting requests get ConnectionTimeoutException. No connection leak after all queries complete. Pool returns to 0 active.', pri:'P1' },
              { id:'TC-CC-017', title:'Idempotent Payment Processing', reg:'Distributed TX', steps:'1. Send payment request with idempotency key IK-001\n2. Payment processes successfully\n3. Simulate client retry with same IK-001\n4. Verify original result returned\n5. Verify account debited once only\n6. Verify idempotency cache TTL = 24 hours', result:'Second request returns exact same response as first. Account debited exactly once. Idempotency key cached for 24 hours. After TTL, key can be reused for new payment.', pri:'P0' },
              { id:'TC-CC-018', title:'Write Skew Anomaly Detection', reg:'Race Condition', steps:'1. Joint account: Alice and Bob, balance INR 100,000\n2. Rule: Combined withdrawal cannot exceed INR 80,000\n3. Alice reads balance, checks 40000 < (100000-0)\n4. Bob reads balance, checks 50000 < (100000-0)\n5. Both write simultaneously: Alice -40000, Bob -50000\n6. Total withdrawal = 90000 > 80000 (write skew)', result:'Under SERIALIZABLE isolation, one transaction detects conflict and aborts. Combined withdrawal stays within INR 80,000 limit. Under READ COMMITTED, write skew must be prevented via explicit locking.', pri:'P0' },
              { id:'TC-CC-019', title:'Chaos Engineering: Random Service Kill', reg:'Network Partition', steps:'1. 3 instances of payment service running\n2. Chaos Monkey randomly kills 1 instance\n3. In-flight transactions on killed instance\n4. Load balancer detects failure\n5. Retries route to healthy instances\n6. Killed instance restarts and rejoins', result:'In-flight transactions on killed instance timeout and retry on healthy instances. No duplicate processing (idempotency). Service recovers within 30s. Zero data loss. SLA maintained.', pri:'P1' },
              { id:'TC-CC-020', title:'Distributed Lock Lease Renewal Under Load', reg:'Distributed TX', steps:'1. Acquire distributed lock with 30s TTL\n2. Long-running transaction takes 45 seconds\n3. Lock renewal thread extends TTL at 20s\n4. Simulate renewal failure at 20s (network blip)\n5. Lock expires at 30s while TX in progress\n6. Verify stale lock detection', result:'Lock renewal succeeds normally: TX completes with valid lock. On renewal failure: TX detects lock loss, rolls back, retries with new lock. No concurrent access during lock gap. Fencing token prevents stale writes.', pri:'P1' }
            ].map((tc, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
                <td style={{ ...tdStyle, color:C.accent, fontWeight:700, fontSize:12 }}>{tc.id}</td>
                <td style={{ ...tdStyle, fontWeight:600, color:C.header, fontSize:12 }}>{tc.title}</td>
                <td style={{ ...tdStyle, textAlign:'center', fontSize:11 }}>{badge(
                  tc.reg.includes('Race') ? C.danger : tc.reg.includes('Deadlock') ? C.warn : tc.reg.includes('Thread') ? C.info : tc.reg.includes('Network') ? C.accent : tc.reg.includes('Double') ? C.danger : tc.reg.includes('DB') ? C.warn : C.success,
                  tc.reg
                )}</td>
                <td style={{ ...tdStyle, fontSize:11, whiteSpace:'pre-line' }}>{tc.steps}</td>
                <td style={{ ...tdStyle, fontSize:11 }}>{tc.result}</td>
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
      <h2 style={sectionTitle}>C4 Model - Concurrency Testing Platform</h2>

      <h3 style={subTitle}>Level 1: System Context</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 1: SYSTEM CONTEXT                   |
  +=========================================================================+

                          +-------------------+
                          |    Bank Channels   |
                          | (ATM/POS/Mobile/   |
                          |  Internet Banking) |
                          +--------+----------+
                                   |
                          Concurrent Transactions
                                   |
                                   v
  +----------------+    +========================+    +-------------------+
  |  QA Engineers  |    |                        |    | Infrastructure    |
  |  - Test Design |<-->| CONCURRENCY TESTING    |<-->| Services          |
  |  - Results     |    | PLATFORM               |    |                   |
  |    Analysis    |    | (Banking QA System)    |    | - Redis Cluster   |
  |  - Regression  |    |                        |    | - PostgreSQL HA   |
  |    Tracking    |    | Validates thread safety|    | - Kafka Cluster   |
  +----------------+    | race conditions, locks |    | - Service Mesh    |
                         | network partitions     |    | - Load Balancers  |
  +----------------+    |                        |    +-------------------+
  |  DevOps Team  |<-->|                        |
  |  - Infra Mgmt  |    +========================+    +-------------------+
  |  - Chaos Engg  |               ^                  | External Systems  |
  |  - Monitoring  |               |                  | - Partner Banks   |
  +----------------+    +----------+----------+       | - Card Networks   |
                         |  Banking Systems     |       | - Payment Gateways|
                         |  - Core Banking (CBS)|       | - UPI/NPCI        |
                         |  - Payment Engine    |       +-------------------+
                         |  - Card Processor    |
                         |  - Loan System       |
                         +---------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 2: Container Diagram</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 2: CONTAINERS                       |
  +=========================================================================+

  +-------------------------------------------------------------------------+
  |                     CONCURRENCY TESTING PLATFORM                         |
  |                                                                          |
  |  +------------------+  +------------------+  +---------------------+    |
  |  | Thread Safety    |  | Race Condition   |  | Deadlock Detection  |    |
  |  | Validator        |  | Detector         |  | Engine              |    |
  |  | [Java/JUnit]     |  | [Go/Custom]      |  | [Java/Custom]       |    |
  |  |                  |  |                  |  |                     |    |
  |  | - ThreadSanitizer|  | - TOCTOU check   |  | - Wait-for graph    |    |
  |  | - Atomicity test |  | - Lost update det|  | - Cycle detection   |    |
  |  | - Visibility test|  | - ABA problem det|  | - Victim selection  |    |
  |  | - Ordering test  |  | - Write skew det |  | - Auto-resolution   |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------+  +---------------------+    |
  |  | Network Partition|  | Dist. Lock       |  | Saga Orchestrator   |    |
  |  | Simulator        |  | Tester           |  | Validator           |    |
  |  | [Go/Toxiproxy]   |  | [Java/Redisson]  |  | [Java/Temporal]     |    |
  |  |                  |  |                  |  |                     |    |
  |  | - Partition inject|  | - Redlock verify |  | - Saga state check  |    |
  |  | - Split-brain sim|  | - Fencing tokens |  | - Compensation test |    |
  |  | - Latency inject |  | - TTL validation |  | - Idempotency check |    |
  |  | - Packet loss sim|  | - Lease renewal  |  | - Rollback verify   |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------------------------------+    |
  |  | Load Generator   |  | Results Analyzer & Dashboard              |    |
  |  | [Gatling/k6]     |  | [React + Grafana + InfluxDB]             |    |
  |  |                  |  |                                           |    |
  |  | - TPS ramping    |  | - Real-time concurrency metrics           |    |
  |  | - Concurrent usr |  | - Deadlock visualization                  |    |
  |  | - Scenario mix   |  | - Lock contention heatmaps               |    |
  |  | - Chaos triggers |  | - Consistency verification reports        |    |
  |  +------------------+  +------------------------------------------+    |
  |                                                                          |
  |  +------------------------------------------------------------------+  |
  |  | Data Layer                                                        |  |
  |  | PostgreSQL (MVCC) | Redis Cluster (Dist Locks) | Kafka (Events)  |  |
  |  | InfluxDB (Metrics)| Elasticsearch (Logs)       | etcd (Config)   |  |
  |  +------------------------------------------------------------------+  |
  +-------------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 3: Component Diagram</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 3: COMPONENTS                       |
  +=========================================================================+

  Race Condition Detector [Container] - Component Breakdown:

  +------------------------------------------------------------------+
  |                                                                    |
  |  +------------------+     +-------------------+                    |
  |  | TransactionIntr- |---->| BalanceValidator   |                    |
  |  | ceptor           |     | - Pre-read balance |                    |
  |  | - Capture all ops|     | - Post-write verify|                    |
  |  | - Timestamp mark |     | - Delta validation |                    |
  |  | - Thread ID tag  |     | - Invariant check  |                    |
  |  +------------------+     +--------+-----------+                    |
  |                                     |                               |
  |  +------------------+              v                               |
  |  | ConcurrencyModel |     +-------------------+                    |
  |  | Checker           |     | ConflictDetector   |                    |
  |  | - Happens-before |     | - Version mismatch |                    |
  |  | - Lamport clocks |     | - Write-write conf |                    |
  |  | - Vector clocks  |     | - Read-write conf  |                    |
  |  | - Causal ordering|     | - ABA detection    |                    |
  |  +------------------+     +--------+----------+                    |
  |                                     |                               |
  |  +------------------+              v                               |
  |  | IsolationLevel   |     +-------------------+                    |
  |  | Verifier         |     | ReportGenerator    |                    |
  |  | - READ_COMMITTED |     | - Race condition   |                    |
  |  | - REPEATABLE_READ|     |   evidence         |                    |
  |  | - SERIALIZABLE   |     | - Timeline replay  |                    |
  |  | - SNAPSHOT        |     | - Fix suggestions  |                    |
  |  +------------------+     +-------------------+                    |
  +------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 4: Code (Key Classes)</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 4: CODE                             |
  +=========================================================================+

  class AtomicBalanceUpdater:
      def __init__(self, db_pool, lock_manager, retry_policy):
          self.db = db_pool
          self.locks = lock_manager
          self.retry = retry_policy

      def debit(self, account_id: str, amount: Decimal) -> TransactionResult:
          for attempt in range(self.retry.max_attempts):
              try:
                  with self.db.transaction(isolation="SERIALIZABLE") as txn:
                      row = txn.execute(
                          "SELECT balance, version FROM accounts "
                          "WHERE account_id = %s FOR UPDATE", [account_id]
                      )
                      if row.balance < amount:
                          raise InsufficientBalance(account_id, row.balance, amount)
                      txn.execute(
                          "UPDATE accounts SET balance = balance - %s, "
                          "version = version + 1 WHERE account_id = %s",
                          [amount, account_id]
                      )
                      return TransactionResult(success=True, new_balance=row.balance - amount)
              except SerializationFailure:
                  if attempt == self.retry.max_attempts - 1:
                      raise
                  time.sleep(self.retry.backoff(attempt))

  class DeadlockDetector:
      def __init__(self, lock_registry):
          self.registry = lock_registry
          self.wait_graph = DirectedGraph()

      def detect_cycle(self) -> Optional[DeadlockInfo]:
          self.wait_graph.clear()
          for lock in self.registry.active_locks():
              for waiter in lock.waiters:
                  self.wait_graph.add_edge(waiter.txn_id, lock.holder.txn_id)
          cycle = self.wait_graph.find_cycle()
          if cycle:
              victim = self._select_victim(cycle)
              return DeadlockInfo(cycle=cycle, victim=victim)
          return None

      def _select_victim(self, cycle: List[str]) -> str:
          # Select youngest transaction as victim (least work lost)
          return min(cycle, key=lambda txn_id: self.registry.get_start_time(txn_id))

  class DistributedLockManager:
      def __init__(self, redis_nodes: List[Redis], ttl_ms: int = 30000):
          self.nodes = redis_nodes
          self.quorum = len(redis_nodes) // 2 + 1
          self.ttl_ms = ttl_ms

      def acquire(self, resource: str, holder: str) -> Optional[LockToken]:
          start = time.monotonic_ns()
          token = str(uuid4())
          acquired_count = 0
          for node in self.nodes:
              if node.set(resource, token, nx=True, px=self.ttl_ms):
                  acquired_count += 1
          elapsed_ms = (time.monotonic_ns() - start) / 1_000_000
          if acquired_count >= self.quorum and elapsed_ms < self.ttl_ms:
              return LockToken(resource=resource, token=token,
                               validity_ms=self.ttl_ms - elapsed_ms)
          self._release_all(resource, token)
          return None
`}</pre>
    </div>
  );

  const renderTechStack = () => (
    <div>
      <h2 style={sectionTitle}>Technology Stack</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Comprehensive technology stack for concurrency and network testing in banking transaction processing systems.
      </p>
      <div style={gridStyle}>
        {[
          { cat:'Load & Concurrency Testing', items:[
            { name:'Apache JMeter', desc:'Open-source load testing tool with thread group based concurrency simulation', use:'Multi-threaded transaction load generation, ramp-up testing' },
            { name:'Gatling', desc:'Scala-based load testing framework with async event-driven architecture', use:'High-concurrency simulation (10,000+ virtual users), detailed latency reports' },
            { name:'Locust', desc:'Python-based distributed load testing with real-time web UI', use:'Concurrent user behavior simulation, custom transaction scenarios' },
            { name:'k6 (Grafana)', desc:'Modern load testing tool with JavaScript scripting, built-in metrics', use:'CI/CD integrated concurrency tests, threshold-based pass/fail' }
          ], color:C.accent },
          { cat:'Thread & Race Condition Analysis', items:[
            { name:'ThreadSanitizer (TSan)', desc:'Compile-time instrumentation for detecting data races in C/C++/Go', use:'Detecting unsynchronized shared memory access in native banking modules' },
            { name:'Java Concurrency Stress (jcstress)', desc:'OpenJDK tool for testing concurrency correctness in JVM programs', use:'Validating atomicity, visibility, and ordering in Java banking services' },
            { name:'Go Race Detector', desc:'Built-in race detector for Go programs using happens-before analysis', use:'Detecting race conditions in Go-based payment processing microservices' },
            { name:'Lincheck (JetBrains)', desc:'Framework for testing concurrent data structures for linearizability', use:'Verifying thread-safe collections used in banking transaction caches' }
          ], color:C.info },
          { cat:'Chaos Engineering & Fault Injection', items:[
            { name:'Chaos Monkey (Netflix)', desc:'Randomly terminates VM instances in production to test resilience', use:'Testing banking service recovery and failover under instance failure' },
            { name:'Toxiproxy (Shopify)', desc:'TCP proxy for simulating network conditions (latency, timeout, partition)', use:'Network partition simulation between banking services and databases' },
            { name:'Pumba', desc:'Chaos testing tool for Docker containers (kill, pause, network emulate)', use:'Container-level chaos for microservice banking architecture' },
            { name:'Litmus (CNCF)', desc:'Kubernetes-native chaos engineering framework', use:'Pod kill, network partition, disk failure in K8s banking deployments' }
          ], color:C.danger },
          { cat:'Distributed Lock & Consensus', items:[
            { name:'Redis / Redisson', desc:'In-memory data store with distributed lock support (Redlock algorithm)', use:'Distributed account locking across banking service instances' },
            { name:'Apache ZooKeeper', desc:'Distributed coordination service with leader election and barriers', use:'Consensus-based distributed locking for critical banking operations' },
            { name:'etcd', desc:'Distributed key-value store with strong consistency (Raft consensus)', use:'Service discovery, distributed configuration, and leader election' },
            { name:'Consul (HashiCorp)', desc:'Service mesh with health checking, KV store, and leader election', use:'Service health monitoring and distributed semaphore implementation' }
          ], color:C.warn },
          { cat:'Database Concurrency Testing', items:[
            { name:'pgbench (PostgreSQL)', desc:'Built-in PostgreSQL benchmarking tool for concurrent transaction testing', use:'Measuring TPS, lock contention, and isolation level behavior' },
            { name:'Jepsen', desc:'Distributed systems verification framework testing linearizability', use:'Verifying database consistency under network partitions and clock skew' },
            { name:'sysbench', desc:'Multi-threaded benchmark tool for database and system performance', use:'OLTP workload simulation with configurable concurrency levels' },
            { name:'pg_stat_activity / pg_locks', desc:'PostgreSQL system views for lock monitoring and query analysis', use:'Real-time database lock contention analysis and deadlock investigation' }
          ], color:C.success },
          { cat:'Distributed Transaction Frameworks', items:[
            { name:'Temporal.io', desc:'Durable execution platform for long-running workflows and sagas', use:'Saga orchestration for cross-service banking transactions' },
            { name:'Axon Framework', desc:'Event-driven microservices framework with saga support', use:'CQRS and event sourcing for banking domain with distributed transactions' },
            { name:'Seata', desc:'Open-source distributed transaction solution (AT, TCC, Saga, XA modes)', use:'Cross-database distributed transactions in banking microservices' }
          ], color:C.accent },
          { cat:'Monitoring & Observability', items:[
            { name:'Grafana + InfluxDB', desc:'Time-series metrics visualization with real-time dashboards', use:'Lock contention heatmaps, TPS graphs, latency percentile tracking' },
            { name:'Jaeger / Zipkin', desc:'Distributed tracing for microservice request flow visualization', use:'Tracing concurrent transaction paths, identifying lock wait bottlenecks' },
            { name:'Prometheus + Alertmanager', desc:'Metrics collection with threshold-based alerting', use:'Deadlock count alerts, lock timeout rate monitoring, thread pool saturation' }
          ], color:C.info },
          { cat:'CI/CD Integration', items:[
            { name:'Jenkins Pipeline', desc:'CI/CD automation with parallel stage execution', use:'Automated concurrency test execution on every PR, nightly stress tests' },
            { name:'GitHub Actions', desc:'Cloud-hosted CI with matrix strategy for parallel test runs', use:'Multi-database concurrency test matrix (PG 14/15/16, isolation levels)' },
            { name:'Docker Compose', desc:'Multi-container orchestration for test environment setup', use:'Spinning up Redis cluster, PostgreSQL HA, Kafka for integration tests' }
          ], color:C.warn }
        ].map((cat, i) => (
          <div key={i} style={{ ...cardStyle, gridColumn: cat.items.length > 3 ? 'span 1' : 'span 1' }}>
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
          { title:'ADR-001: Pessimistic Locking for Balance-Critical Operations', decision:'Use SELECT FOR UPDATE (pessimistic locking) for all debit operations on account balances rather than optimistic concurrency control.', rationale:'Banking balance operations have extremely high contention on popular accounts (merchant accounts, salary accounts). Optimistic locking leads to excessive retries (up to 100x under peak load), causing latency spikes. Pessimistic locking serializes access and provides predictable latency. The lock hold time is minimal (< 5ms per transaction).', tradeoff:'Pessimistic locking reduces throughput on hot rows (serialized access). Risk of deadlocks when multiple accounts locked in different orders. Mitigated by strict lock ordering (always lock by ascending account_id) and deadlock detection with auto-rollback.', color:C.accent },
          { title:'ADR-002: Redlock Algorithm for Distributed Locking', decision:'Use Redlock (Redis-based distributed lock) for cross-service resource locking instead of ZooKeeper or database advisory locks.', rationale:'Redis provides sub-millisecond lock acquisition latency critical for real-time banking transactions. Redlock achieves fault tolerance via quorum across 5 independent Redis nodes. No single point of failure. Auto-expiry prevents lock leaks. Fencing tokens prevent stale lock holders from corrupting data.', tradeoff:'Redlock has theoretical safety concerns under clock skew (Martin Kleppmann critique). Mitigated by using fencing tokens at the storage layer. Redis cluster management adds operational complexity. Lock TTL must be tuned carefully: too short causes premature expiry, too long delays failure recovery.', color:C.danger },
          { title:'ADR-003: Saga Pattern Over 2PC for Cross-Bank Transfers', decision:'Use Saga pattern with compensating transactions for inter-bank fund transfers instead of Two-Phase Commit (2PC).', rationale:'2PC requires all participants to be available simultaneously, which is unrealistic for cross-bank transfers where partner bank APIs have variable availability. Saga allows partial progress: debit sender immediately, credit receiver asynchronously. If credit fails, compensating transaction reverses the debit. Better availability and latency characteristics for banking operations.', tradeoff:'Saga provides eventual consistency, not strong consistency. Intermediate states are visible (sender debited but receiver not yet credited). Compensating transactions must be carefully designed to be idempotent. Saga state management adds complexity. Requires robust monitoring and alerting for stuck sagas.', color:C.success },
          { title:'ADR-004: Serializable Snapshot Isolation for Financial Reports', decision:'Use SERIALIZABLE isolation level for all financial reporting queries and balance reconciliation operations.', rationale:'Financial reports must reflect a consistent snapshot of all account balances at a point in time. Lower isolation levels (READ COMMITTED, REPEATABLE READ) can produce phantom reads where new transactions appear mid-report, causing balance discrepancies. SERIALIZABLE prevents all anomalies (dirty reads, non-repeatable reads, phantoms, write skew).', tradeoff:'SERIALIZABLE causes serialization failures under concurrent writes, requiring retry logic. Throughput reduction of 20-30% compared to READ COMMITTED. Acceptable trade-off for report accuracy. Real-time transaction processing uses READ COMMITTED with explicit locking for better throughput.', color:C.info },
          { title:'ADR-005: Event Sourcing for Transaction Audit Trail', decision:'Use event sourcing (append-only event log) for all banking transactions instead of mutable state updates.', rationale:'Event sourcing provides complete audit trail of every state change. Enables temporal queries ("what was the balance at time T?"). Naturally supports concurrent reads (events are immutable). Enables event replay for debugging race conditions. Compliant with RBI audit requirements for transaction history retention.', tradeoff:'Storage grows linearly with transactions (mitigated by snapshotting). Event schema evolution requires careful versioning. Eventual consistency between event store and read models (CQRS). Increased complexity for developers unfamiliar with event-driven architecture.', color:C.warn },
          { title:'ADR-006: Circuit Breaker for Partner Bank Integration', decision:'Implement circuit breaker pattern (Resilience4j) for all partner bank API calls with exponential backoff retry.', rationale:'Partner bank APIs have unpredictable availability (99.5% average). Without circuit breaker, timeout cascades from partner bank can exhaust thread pools and block all transactions. Circuit breaker provides fast failure after threshold (5 failures in 60 seconds), allowing system to handle other transactions while partner bank recovers.', tradeoff:'Open circuit causes immediate failure for transactions to affected partner bank. Customers may need to retry. Half-open state requires careful tuning to avoid premature closure. Monitoring required to detect prolonged open circuit states. Fallback mechanisms (queue for retry) add complexity.', color:C.accent }
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

      <h3 style={sectionTitle}>Concurrency Model Comparison</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Concurrency Model</th>
            <th style={thStyle}>Mechanism</th>
            <th style={thStyle}>Banking Use Case</th>
            <th style={thStyle}>Trade-offs</th>
          </tr>
        </thead>
        <tbody>
          {[
            { reg:'Pessimistic Locking (SELECT FOR UPDATE)', body:'Row-level exclusive lock acquired before read; held until transaction commits', provisions:'ATM withdrawal, POS authorization, real-time balance debit where contention is high and correctness is critical', penalty:'Reduces throughput on hot rows, risk of deadlocks, requires lock ordering discipline' },
            { reg:'Optimistic Concurrency Control (OCC)', body:'Read version on SELECT, conditional UPDATE with WHERE version=N, retry on conflict', provisions:'Account profile updates, beneficiary management, KYC updates where contention is low', penalty:'High retry rate under contention, wasted work on conflict, not suitable for high-contention scenarios' },
            { reg:'Multi-Version Concurrency Control (MVCC)', body:'Database maintains multiple row versions; readers see snapshot, writers create new versions', provisions:'PostgreSQL default behavior; enables concurrent reads during writes for balance inquiries', penalty:'Vacuum overhead for old versions, potential for serialization failures under SERIALIZABLE isolation' },
            { reg:'Compare-And-Swap (CAS)', body:'Atomic hardware instruction: compare current value, if match then swap with new value', provisions:'In-memory counter updates (transaction sequence numbers, session counters, rate limiters)', penalty:'Busy-wait loop under high contention (spin lock), ABA problem requires version tagging' },
            { reg:'Distributed Lock (Redlock)', body:'Acquire lock on majority of N independent Redis nodes with TTL auto-expiry', provisions:'Cross-service account locking, distributed rate limiting, leader election for batch jobs', penalty:'Clock skew vulnerability, operational complexity of multi-node Redis, lock granularity decisions' },
            { reg:'Event Sourcing + CQRS', body:'Append-only event log for writes, materialized views for reads, eventual consistency', provisions:'Transaction history, audit trail, balance reconstruction, regulatory reporting', penalty:'Eventual consistency between write and read models, increased storage, schema evolution complexity' },
            { reg:'Saga Pattern', body:'Sequence of local transactions with compensating transactions for rollback', provisions:'Inter-bank transfers, loan disbursement across services, multi-step payment processing', penalty:'Intermediate visible states, compensating transaction design complexity, stuck saga monitoring required' },
            { reg:'Two-Phase Commit (2PC)', body:'Coordinator asks all participants to PREPARE, then COMMIT or ABORT atomically', provisions:'Intra-bank cross-database transactions (accounts DB + ledger DB), batch settlement', penalty:'Blocking protocol (participants wait during coordinator failure), reduced availability, latency overhead' }
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:600, fontSize:13 }}>{r.reg}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.body}</td>
              <td style={{ ...tdStyle, fontSize:12 }}>{r.provisions}</td>
              <td style={{ ...tdStyle, fontSize:12, color:C.danger }}>{r.penalty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFlowchart = () => (
    <div>
      <h2 style={sectionTitle}>Concurrent Transaction Processing Flowchart</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        End-to-end flow of concurrent banking transaction processing with lock acquisition, race condition prevention, deadlock detection, and conflict resolution.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |       CONCURRENT TRANSACTION PROCESSING - DETAILED FLOWCHART            |
  +=========================================================================+

                        +---------------------+
                        |  Transaction         |
                        |  Request Received    |
                        |  (ATM/POS/Mobile/    |
                        |   Internet/API)      |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Validate Request    |
                        |  - Auth token check  |
                        |  - Idempotency key   |
                        |  - Rate limit check  |
                        |  - Amount validation |
                        +----------+----------+
                                   |
                          +--------+--------+
                          | Idempotency     |
                          | key exists?     |
                          +--------+--------+
                          |YES             |NO
                          v                v
                  +---------------+  +---------------+
                  | Return cached |  | Assign to     |
                  | result        |  | Thread Pool   |
                  | (exact same   |  | Worker        |
                  |  response)    |  |               |
                  +---------------+  +-------+-------+
                                             |
                                             v
                                    +---------------+
                                    | Acquire Lock  |
                                    | on Account    |
                                    | (SELECT FOR   |
                                    |  UPDATE)      |
                                    +-------+-------+
                                            |
                                   +--------+--------+
                                   | Lock acquired?  |
                                   +--------+--------+
                                   |YES             |NO (timeout)
                                   v                v
                           +---------------+  +---------------+
                           | Read Current  |  | Check deadlock|
                           | Balance +     |  | wait-for graph|
                           | Version       |  +-------+-------+
                           +-------+-------+          |
                                   |           +------+------+
                                   |           |DEADLOCK     |TIMEOUT
                                   |           v             v
                                   |    +----------+  +----------+
                                   |    | Rollback |  | Return   |
                                   |    | victim TX|  | 503 Retry|
                                   |    | Retry    |  | -After   |
                                   |    +----------+  +----------+
                                   |
                                   v
                           +---------------------+
                           | Validate Business   |
                           | Rules               |
                           | - Sufficient balance|
                           | - Daily limit check |
                           | - Fraud check       |
                           +----------+----------+
                                      |
                             +--------+--------+
                             | Balance         |
                             | sufficient?     |
                             +--------+--------+
                             |YES             |NO
                             v                v
                      +------------+   +------------+
                      | Debit      |   | Release    |
                      | Account    |   | Lock       |
                      | - Update   |   | Return     |
                      |   balance  |   | Insufficient|
                      | - Incr ver |   | Balance    |
                      | - Write TX |   +------------+
                      |   record   |
                      +------+-----+
                             |
                             v
                      +------------+
                      | COMMIT     |
                      | Transaction|
                      | (releases  |
                      |  all locks)|
                      +------+-----+
                             |
                             v
                      +---------------------+
                      | Cache Result with   |
                      | Idempotency Key     |
                      | (TTL: 24 hours)     |
                      +----------+----------+
                                 |
                                 v
                      +---------------------+
                      | Return Success      |
                      | - New balance       |
                      | - Transaction ID    |
                      | - Timestamp         |
                      +---------------------+


  DEADLOCK DETECTION AND RESOLUTION FLOWCHART
  ============================================

                      +---------------------+
                      | Deadlock Detector    |
                      | (runs every 500ms)  |
                      +----------+----------+
                                 |
                                 v
                      +---------------------+
                      | Build Wait-For Graph|
                      | - Query pg_locks    |
                      | - Map TX -> waits   |
                      | - Build directed    |
                      |   graph edges       |
                      +----------+----------+
                                 |
                                 v
                      +---------------------+
                      | Run Cycle Detection |
                      | (DFS / Tarjan SCC)  |
                      +----------+----------+
                                 |
                        +--------+--------+
                        | Cycle found?    |
                        +--------+--------+
                        |YES             |NO
                        v                v
                 +---------------+  +--------+
                 | Select Victim |  | Sleep  |
                 | Transaction   |  | 500ms  |
                 | Criteria:     |  +--------+
                 | 1. Youngest TX|
                 | 2. Least work |
                 | 3. Lowest pri |
                 +-------+-------+
                         |
                         v
                 +---------------+
                 | ROLLBACK      |
                 | victim TX     |
                 | - Release all |
                 |   locks       |
                 | - Log deadlock|
                 |   details     |
                 +-------+-------+
                         |
                         v
                 +---------------+
                 | Schedule Retry|
                 | with exp.     |
                 | backoff       |
                 | (100ms base)  |
                 +---------------+
`}</pre>
    </div>
  );

  const renderSequenceDiagram = () => (
    <div>
      <h2 style={sectionTitle}>Sequence Diagram - Concurrent ATM Withdrawal with Locking</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Sequence diagram showing two simultaneous ATM withdrawals against the same account, demonstrating how pessimistic locking prevents double-spending and ensures data consistency.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |  SEQUENCE DIAGRAM: CONCURRENT ATM WITHDRAWAL (PESSIMISTIC LOCKING)      |
  +=========================================================================+

  ATM-1          ATM-2          API Gateway     Lock Manager     Database       Audit Log
  (Mumbai)       (Delhi)        (Load Bal.)     (Redis/PG)       (PostgreSQL)
  |              |              |               |                |              |
  |              |              |               |                |              |
  | 1. Withdraw  |              |               |                |              |
  |    INR 40000 |              |               |                |              |
  |------------->|              |               |                |              |
  |              | 2. Withdraw  |               |                |              |
  |              |    INR 40000 |               |                |              |
  |              |------------->|               |                |              |
  |              |              |               |                |              |
  |              |  3. Route to |               |                |              |
  |              |     worker   |               |                |              |
  |              |     thread   |               |                |              |
  |              |              |               |                |              |
  |              |              | 4. Acquire    |                |              |
  |              |              |    lock on    |                |              |
  |              |              |    ACCT-001   |                |              |
  |              |              |    (ATM-1)    |                |              |
  |              |              |-------------->|                |              |
  |              |              |               |                |              |
  |              |              | 5. Lock       |                |              |
  |              |              |    GRANTED    |                |              |
  |              |              |    token=42   |                |              |
  |              |              |<--------------|                |              |
  |              |              |               |                |              |
  |              |              | 6. Acquire    |                |              |
  |              |              |    lock on    |                |              |
  |              |              |    ACCT-001   |                |              |
  |              |              |    (ATM-2)    |                |              |
  |              |              |-------------->|                |              |
  |              |              |               |                |              |
  |              |              | 7. Lock WAIT  |                |              |
  |              |              |    (queued,   |                |              |
  |              |              |     timeout   |                |              |
  |              |              |     5000ms)   |                |              |
  |              |              |<--------------|                |              |
  |              |              |               |                |              |
  |              |              | 8. SELECT     |                |              |
  |              |              |    balance    |                |              |
  |              |              |    FOR UPDATE |                |              |
  |              |              |    (ATM-1 TX) |                |              |
  |              |              |---------------|--------------->|              |
  |              |              |               |                |              |
  |              |              | 9. balance=   |                |              |
  |              |              |    50000,     |                |              |
  |              |              |    ver=10     |                |              |
  |              |              |<--------------|----------------|              |
  |              |              |               |                |              |
  |              |              | 10. Check:    |                |              |
  |              |              |     50000 >=  |                |              |
  |              |              |     40000 OK  |                |              |
  |              |              |               |                |              |
  |              |              | 11. UPDATE    |                |              |
  |              |              |     balance = |                |              |
  |              |              |     10000,    |                |              |
  |              |              |     ver=11    |                |              |
  |              |              |---------------|--------------->|              |
  |              |              |               |                |              |
  |              |              | 12. COMMIT    |                |              |
  |              |              |     (ATM-1 TX)|                |              |
  |              |              |---------------|--------------->|              |
  |              |              |               |                |              |
  |              |              | 13. Release   |                |              |
  |              |              |     lock      |                |              |
  |              |              |     ACCT-001  |                |              |
  |              |              |-------------->|                |              |
  |              |              |               |                |              |
  | 14. Success  |              |               |                |              |
  |     Balance: |              |               |                |              |
  |     10000    |              |               |                |              |
  |<-------------|              |               |                |              |
  |              |              |               |                |              |
  |              |              | 15. Lock      |                |              |
  |              |              |     GRANTED   |                |              |
  |              |              |     to ATM-2  |                |              |
  |              |              |     token=43  |                |              |
  |              |              |<--------------|                |              |
  |              |              |               |                |              |
  |              |              | 16. SELECT    |                |              |
  |              |              |     balance   |                |              |
  |              |              |     FOR UPDATE|                |              |
  |              |              |     (ATM-2 TX)|                |              |
  |              |              |---------------|--------------->|              |
  |              |              |               |                |              |
  |              |              | 17. balance=  |                |              |
  |              |              |     10000,    |                |              |
  |              |              |     ver=11    |                |              |
  |              |              |<--------------|----------------|              |
  |              |              |               |                |              |
  |              |              | 18. Check:    |                |              |
  |              |              |     10000 <   |                |              |
  |              |              |     40000     |                |              |
  |              |              |     FAIL!     |                |              |
  |              |              |               |                |              |
  |              |              | 19. ROLLBACK  |                |              |
  |              |              |     (ATM-2 TX)|                |              |
  |              |              |---------------|--------------->|              |
  |              |              |               |                |              |
  |              |              | 20. Release   |                |              |
  |              |              |     lock      |                |              |
  |              |              |-------------->|                |              |
  |              |              |               |                |              |
  |              | 21. DECLINED |               |                |              |
  |              |     Insuff.  |               |                |              |
  |              |     Balance  |               |                |              |
  |              |<-------------|               |                |              |
  |              |              |               |                |              |
  |              |              | 22. Log both  |                |              |
  |              |              |     attempts  |                |              |
  |              |              |     to audit  |                |              |
  |              |              |---------------|----------------|------------->|
  |              |              |               |                |              |


  LEGEND:
  ------>  Synchronous call
  <------  Synchronous response
  ACCT-001: Shared account (balance: INR 50,000)
  ATM-1 succeeds (40,000 debit), ATM-2 declined (insufficient after ATM-1)
`}</pre>

      <h3 style={sectionTitle}>Sequence Diagram - Two-Phase Commit for Inter-Account Transfer</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |  SEQUENCE DIAGRAM: TWO-PHASE COMMIT (2PC) INTER-ACCOUNT TRANSFER       |
  +=========================================================================+

  Client         TX Coordinator    Accounts DB       Ledger DB         TX Log
  |              |                 (Participant A)   (Participant B)   |
  |              |                 |                  |                 |
  | 1. Transfer  |                 |                  |                 |
  |    A -> B    |                 |                  |                 |
  |    INR 10000 |                 |                  |                 |
  |------------->|                 |                  |                 |
  |              |                 |                  |                 |
  |              | 2. Begin 2PC    |                  |                 |
  |              |    TX-ID: 2PC-  |                  |                 |
  |              |    001          |                  |                 |
  |              |-----------------|------------------|---------------->|
  |              |                 |                  |                 |
  |              | 3. PREPARE      |                  |                 |
  |              |    Debit A by   |                  |                 |
  |              |    10000        |                  |                 |
  |              |---------------->|                  |                 |
  |              |                 |                  |                 |
  |              | 4. PREPARE      |                  |                 |
  |              |    Credit B by  |                  |                 |
  |              |    10000        |                  |                 |
  |              |-----------------|----------------->|                 |
  |              |                 |                  |                 |
  |              | 5. VOTE_COMMIT  |                  |                 |
  |              |    (A has       |                  |                 |
  |              |     sufficient  |                  |                 |
  |              |     balance)    |                  |                 |
  |              |<----------------|                  |                 |
  |              |                 |                  |                 |
  |              | 6. VOTE_COMMIT  |                  |                 |
  |              |    (B account   |                  |                 |
  |              |     valid)      |                  |                 |
  |              |<----------------|------------------|                 |
  |              |                 |                  |                 |
  |              | 7. Log COMMIT   |                  |                 |
  |              |    decision     |                  |                 |
  |              |-----------------|------------------|---------------->|
  |              |                 |                  |                 |
  |              | 8. COMMIT       |                  |                 |
  |              |    (finalize    |                  |                 |
  |              |     debit)      |                  |                 |
  |              |---------------->|                  |                 |
  |              |                 |                  |                 |
  |              | 9. COMMIT       |                  |                 |
  |              |    (finalize    |                  |                 |
  |              |     credit)     |                  |                 |
  |              |-----------------|----------------->|                 |
  |              |                 |                  |                 |
  |              | 10. ACK         |                  |                 |
  |              |<----------------|                  |                 |
  |              |                 |                  |                 |
  |              | 11. ACK         |                  |                 |
  |              |<----------------|------------------|                 |
  |              |                 |                  |                 |
  | 12. Transfer |                 |                  |                 |
  |     Complete |                 |                  |                 |
  |     TX-ID:   |                 |                  |                 |
  |     2PC-001  |                 |                  |                 |
  |<-------------|                 |                  |                 |
  |              |                 |                  |                 |


  FAILURE SCENARIO: Participant B votes ABORT
  ============================================

  Client         TX Coordinator    Accounts DB       Ledger DB
  |              |                 |                  |
  |              | PREPARE         |                  |
  |              |---------------->| VOTE_COMMIT      |
  |              |<----------------|                  |
  |              |                 |                  |
  |              | PREPARE         |                  |
  |              |-----------------|----------------->|
  |              |                 | VOTE_ABORT       |
  |              |                 | (account B       |
  |              |                 |  frozen)         |
  |              |<----------------|------------------|
  |              |                 |                  |
  |              | ABORT (to both) |                  |
  |              |---------------->| Rollback debit   |
  |              |-----------------|----------------->| Rollback credit  |
  |              |                 |                  |
  | Transfer     |                 |                  |
  | FAILED:      |                 |                  |
  | Receiver     |                 |                  |
  | account      |                 |                  |
  | frozen       |                 |                  |
  |<-------------|                 |                  |
`}</pre>

      <h3 style={sectionTitle}>Key Interaction Summary</h3>
      <div style={gridStyle}>
        {[
          { step:'Steps 1-3', title:'Request & Lock Acquisition', desc:'Transaction request arrives from ATM/POS channel. API gateway validates idempotency key and assigns to thread pool worker. Lock manager grants exclusive lock on the target account resource.', color:C.accent },
          { step:'Steps 4-9', title:'Serialized Balance Access', desc:'First transaction acquires lock and reads current balance with SELECT FOR UPDATE. Second transaction queued in lock wait. First transaction validates business rules and updates balance atomically.', color:C.info },
          { step:'Steps 10-14', title:'Commit & Lock Release', desc:'First transaction commits, releasing the row-level lock. Lock manager promotes the waiting second transaction. Second transaction now reads the updated balance (post first debit).', color:C.success },
          { step:'Steps 15-18', title:'Second Transaction Validation', desc:'Second transaction reads updated balance (INR 10,000). Validates against requested amount (INR 40,000). Insufficient balance detected. Transaction rolled back with clear error.', color:C.warn },
          { step:'Steps 19-21', title:'Declined & Cleanup', desc:'Second ATM receives "Insufficient Balance" response. Lock released. Both transactions logged in audit trail with complete timeline showing serialized execution order.', color:C.danger },
          { step:'2PC Flow', title:'Distributed Transaction Coordination', desc:'Two-Phase Commit ensures atomic cross-database transfers. PREPARE phase validates on all participants. COMMIT phase finalizes only if all vote YES. ABORT rolls back if any participant votes NO.', color:C.accent }
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
            Concurrency & Network Testing Architecture
          </h1>
          <p style={{ color:C.muted, fontSize:15, lineHeight:1.6 }}>
            Race Conditions | Deadlocks | Thread Safety | Network Partitions | Double-Spend Prevention | Distributed Transactions - Banking QA Testing Dashboard
          </p>
          <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
            {badge(C.accent, 'Race Conditions')}{badge(C.warn, 'Deadlocks')}{badge(C.danger, 'Double-Spend')}{badge(C.info, 'Thread Safety')}{badge(C.success, 'Network Partition')}{badge(C.warn, 'DB Locks')}{badge(C.accent, '2PC/Saga')}{badge(C.info, 'Chaos Engineering')}
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
          Concurrency & Network Testing Architecture | Banking QA Dashboard | Race Conditions | Deadlocks | Thread Safety | Network Partitions | Distributed TX
        </div>
      </div>
    </div>
  );
}

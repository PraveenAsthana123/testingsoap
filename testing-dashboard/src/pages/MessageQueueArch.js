import React, { useState } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12', success:'#2ecc71', info:'#3498db' };

const TABS = [
  { key:'architecture', label:'Architecture' },
  { key:'brd', label:'BRD' },
  { key:'hld', label:'HLD' },
  { key:'lld', label:'LLD' },
  { key:'scenarios', label:'Scenarios' },
  { key:'testcases', label:'TestCases' },
  { key:'c4model', label:'C4Model' },
  { key:'techstack', label:'TechStack' },
  { key:'sad', label:'SAD' },
  { key:'flowchart', label:'Flowchart' },
  { key:'sequence', label:'SequenceDiagram' }
];

const pre = { background:C.editorBg, color:C.editorText, padding:20, borderRadius:8, overflowX:'auto', fontSize:12, fontFamily:'monospace', lineHeight:1.6, border:'1px solid ' + C.border };
const thS = { padding:'12px 10px', textAlign:'left', borderBottom:'2px solid ' + C.accent, background:'rgba(78,204,163,0.15)', color:C.header, fontSize:13 };
const tdS = { padding:'10px', borderBottom:'1px solid ' + C.border, color:C.text, fontSize:12, verticalAlign:'top' };
const cardS = { background:C.card, borderRadius:10, padding:20, border:'1px solid ' + C.border };
const h3S = { color:C.header, marginBottom:12, marginTop:24 };
const gridS = { display:'grid', gap:16 };

function ArchitectureTab() {
  return (
    <div>
      <h2 style={{color:C.header,marginBottom:8}}>Event-Driven Banking Architecture</h2>
      <p style={{color:C.text,marginBottom:16}}>Comprehensive event-driven architecture for banking services using Apache Kafka as the central event backbone, RabbitMQ for request-reply patterns, and event sourcing for financial state management.</p>

      <h3 style={h3S}>System Architecture Overview</h3>
      <pre style={pre}>{`
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                          EVENT-DRIVEN BANKING ARCHITECTURE                                         │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                     │
│  ┌─────────────────────── EVENT PRODUCERS ───────────────────────┐                                  │
│  │                                                                │                                  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │                                  │
│  │  │   Payment    │  │   Account    │  │    Loan      │         │                                  │
│  │  │   Service    │  │   Service    │  │   Service    │         │                                  │
│  │  │              │  │              │  │              │         │                                  │
│  │  │ - Transfers  │  │ - Open/Close │  │ - Originate  │         │                                  │
│  │  │ - Payments   │  │ - KYC Update │  │ - Disburse   │         │                                  │
│  │  │ - Refunds    │  │ - Status Chg │  │ - Repayment  │         │                                  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │                                  │
│  │         │                  │                  │                 │                                  │
│  │  ┌──────────────┐  ┌──────────────┐                            │                                  │
│  │  │    Card      │  │  Regulatory  │                            │                                  │
│  │  │   Service    │  │   Service    │                            │                                  │
│  │  │ - Activate   │  │ - AML Report │                            │                                  │
│  │  │ - Block      │  │ - CTR Filing │                            │                                  │
│  │  │ - Txn Auth   │  │ - SAR Submit │                            │                                  │
│  │  └──────┬───────┘  └──────┬───────┘                            │                                  │
│  └─────────┼─────────────────┼────────────────────────────────────┘                                  │
│            │                  │                                                                       │
│            ▼                  ▼                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐                                   │
│  │                    OUTBOX TABLES (per service)                 │                                   │
│  │   DB Transaction + Event Insert = Atomic Publish Guarantee    │                                   │
│  └──────────────────────────┬────────────────────────────────────┘                                   │
│                              │  Outbox Poller (CDC / Debezium)                                       │
│                              ▼                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐                                   │
│  │              CONFLUENT SCHEMA REGISTRY                        │                                   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │                                   │
│  │  │  Avro   │  │Protobuf │  │  JSON   │  │ Compat  │         │                                   │
│  │  │ Schemas │  │ Schemas │  │ Schema  │  │ Check   │         │                                   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │                                   │
│  └──────────────────────────┬────────────────────────────────────┘                                   │
│                              ▼                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐                                   │
│  │                 KAFKA CLUSTER (3 Brokers)                     │                                   │
│  │                                                               │                                   │
│  │  Broker-1 (Leader)    Broker-2 (Follower)  Broker-3 (Follower)│                                   │
│  │  ┌────────────────┐   ┌────────────────┐  ┌────────────────┐  │                                   │
│  │  │  Partition 0   │   │  Partition 1   │  │  Partition 2   │  │                                   │
│  │  │  (Replica)     │   │  (Replica)     │  │  (Replica)     │  │                                   │
│  │  └────────────────┘   └────────────────┘  └────────────────┘  │                                   │
│  │                                                               │                                   │
│  │  TOPICS:                                                      │                                   │
│  │  ├── banking.payments.transactions  (12 partitions)           │                                   │
│  │  ├── banking.accounts.lifecycle     (6 partitions)            │                                   │
│  │  ├── banking.loans.events           (6 partitions)            │                                   │
│  │  ├── banking.cards.events           (6 partitions)            │                                   │
│  │  ├── banking.fraud.alerts           (3 partitions)            │                                   │
│  │  ├── banking.notifications.outbound (6 partitions)            │                                   │
│  │  ├── banking.audit.trail            (3 partitions)            │                                   │
│  │  └── banking.dlq.*                  (Dead Letter Queues)      │                                   │
│  │                                                               │                                   │
│  │  ZooKeeper Ensemble (3 nodes) - Cluster coordination          │                                   │
│  └──────────────────────────┬────────────────────────────────────┘                                   │
│                              │                                                                       │
│  ┌───────────────────────── EVENT CONSUMERS ─────────────────────┐                                   │
│  │                                                                │                                   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │                                   │
│  │  │ Notification │  │   Fraud      │  │  Analytics   │         │                                   │
│  │  │   Service    │  │   Engine     │  │   Engine     │         │                                   │
│  │  │ (Group: ntf) │  │ (Group: frd) │  │ (Group: anl) │         │                                   │
│  │  │ SMS/Email/   │  │ Real-time    │  │ Aggregation  │         │                                   │
│  │  │ Push alerts  │  │ scoring      │  │ & reporting  │         │                                   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │                                   │
│  │                                                                │                                   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │                                   │
│  │  │Reconciliation│  │   Audit      │  │    DLQ       │         │                                   │
│  │  │   Service    │  │   Logger     │  │  Processor   │         │                                   │
│  │  │ (Group: rec) │  │ (Group: aud) │  │ (Group: dlq) │         │                                   │
│  │  │ End-of-day   │  │ Compliance   │  │ Retry/Alert  │         │                                   │
│  │  │ balancing    │  │ trail        │  │ handling     │         │                                   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │                                   │
│  └────────────────────────────────────────────────────────────────┘                                   │
│                                                                                                      │
│  ┌──────────────── RABBITMQ (Request-Reply) ─────────────────────┐                                   │
│  │  Used for synchronous workflows:                               │                                   │
│  │  - Loan approval request/response                              │                                   │
│  │  - Card authorization request/response                         │                                   │
│  │  - KYC verification request/response                           │                                   │
│  │  Exchanges: direct, topic, headers    Queues: durable, TTL     │                                   │
│  └────────────────────────────────────────────────────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
`}</pre>

      <h3 style={h3S}>Core Patterns</h3>
      <div style={{...gridS, gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))'}}>
        {[
          { t:'Event Sourcing', d:'Account balance derived from immutable event stream. Every debit/credit stored as an event. Current state = replay of all events. Enables point-in-time balance queries and full audit trail for regulatory compliance.' },
          { t:'CQRS', d:'Command side writes to event store (Kafka). Query side reads from materialized views (PostgreSQL/Redis). Write model optimized for consistency, read model optimized for query performance. Separate scaling for reads vs writes.' },
          { t:'Saga Choreography', d:'Account opening saga: KYC Check Event -> Address Verify Event -> Account Created Event -> Card Issued Event -> Welcome Notification Event. Each service reacts to events, publishes compensating events on failure.' },
          { t:'Outbox Pattern', d:'Service writes business data + event to Outbox table in same DB transaction. Outbox Poller (Debezium CDC) reads and publishes to Kafka. Guarantees atomicity between state change and event publish. No dual-write problem.' },
          { t:'Dead Letter Queue', d:'Failed messages after max retries (3) routed to DLQ topic. DLQ Processor inspects, alerts ops team, supports manual replay. Prevents poison messages from blocking consumer progress.' },
          { t:'Consumer Groups', d:'Each logical consumer (fraud, notifications, audit) has its own consumer group. Kafka assigns partitions to group members. Enables independent consumption rates and scaling per consumer type.' }
        ].map((c,i) => (
          <div key={i} style={cardS}>
            <h4 style={{color:C.accent,marginBottom:8}}>{c.t}</h4>
            <p style={{color:C.text,fontSize:13,lineHeight:1.6}}>{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrdTab() {
  return (
    <div>
      <h2 style={{color:C.header,marginBottom:8}}>Business Requirements Document - Event-Driven Banking</h2>
      <p style={{color:C.text,marginBottom:16}}>Business requirements for implementing message queue and event-driven architecture across banking services for real-time processing, compliance, and operational resilience.</p>

      <h3 style={h3S}>Business Objectives</h3>
      <div style={{...gridS, gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))'}}>
        {[
          { t:'Decouple Services', d:'Enable independent deployment and scaling of banking services. Payment processing must not be blocked by notification failures. Each domain team owns their service lifecycle.' },
          { t:'Real-Time Fraud Detection', d:'Stream transaction events to fraud engine within 50ms. Enable real-time scoring of every transaction against ML models. Block suspicious transactions before settlement.' },
          { t:'Event Replay for Audit', d:'Regulators require full transaction history replay. Support point-in-time reconstruction of account state. Retain events for 7 years per banking regulations.' },
          { t:'Reduce Inter-Service Coupling', d:'Eliminate synchronous REST chains (Payment->Notification->Audit). Replace with publish-subscribe. Services can be added/removed without modifying producers.' }
        ].map((c,i) => (
          <div key={i} style={cardS}>
            <h4 style={{color:C.accent,marginBottom:8}}>{c.t}</h4>
            <p style={{color:C.text,fontSize:13}}>{c.d}</p>
          </div>
        ))}
      </div>

      <h3 style={h3S}>Scope</h3>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr>
          <th style={thS}>Event Domain</th><th style={thS}>Events</th><th style={thS}>Producers</th><th style={thS}>Consumers</th>
        </tr></thead>
        <tbody>
          {[
            ['Transaction Events','PaymentInitiated, PaymentCompleted, PaymentFailed, RefundProcessed','Payment Service','Fraud, Notification, Reconciliation, Audit'],
            ['Account Lifecycle','AccountOpened, AccountClosed, KYCUpdated, StatusChanged, TierUpgraded','Account Service','Notification, Analytics, Regulatory'],
            ['Loan Events','LoanApplied, LoanApproved, LoanDisbursed, EMIReceived, LoanClosed','Loan Service','Notification, Analytics, Reconciliation'],
            ['Card Events','CardActivated, CardBlocked, TransactionAuthorized, LimitChanged','Card Service','Fraud, Notification, Analytics'],
            ['Notification Events','SMSSent, EmailSent, PushDelivered, NotificationFailed','Notification Service','Audit, Analytics'],
            ['Regulatory Events','AMLAlertRaised, CTRFiled, SARSubmitted, ComplianceCheckPassed','Regulatory Service','Audit, Analytics, Notification']
          ].map((r,i) => (
            <tr key={i}><td style={tdS}>{r[0]}</td><td style={tdS}>{r[1]}</td><td style={tdS}>{r[2]}</td><td style={tdS}>{r[3]}</td></tr>
          ))}
        </tbody>
      </table>

      <h3 style={h3S}>Functional Requirements</h3>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr>
          <th style={thS}>ID</th><th style={thS}>Requirement</th><th style={thS}>Priority</th><th style={thS}>Acceptance Criteria</th>
        </tr></thead>
        <tbody>
          {[
            ['FR-01','Guaranteed message delivery for all financial events','P0','Zero message loss verified via end-to-end reconciliation'],
            ['FR-02','Event ordering within same account (partition key = account_id)','P0','Events for same account processed in publish order'],
            ['FR-03','Exactly-once processing for payment transactions','P0','No duplicate debits/credits after retries or failures'],
            ['FR-04','Dead letter queue handling with alerting','P0','Failed messages routed to DLQ after 3 retries, ops alerted within 1 min'],
            ['FR-05','Schema evolution without breaking existing consumers','P0','Backward-compatible schema changes deployed without consumer downtime'],
            ['FR-06','Event replay capability for audit and reconciliation','P0','Any event range replayable by time or offset within 5 minutes'],
            ['FR-07','Consumer lag monitoring with auto-scaling triggers','P0','Alert when lag > 10000 messages, auto-scale consumers at > 50000'],
            ['FR-08','Outbox pattern for atomic event publishing','P0','Business state change and event publish succeed or fail together'],
            ['FR-09','Idempotent consumers for all financial operations','P0','Reprocessing same event produces no side effects'],
            ['FR-10','Cross-datacenter replication for disaster recovery','P1','Events replicated to DR site within 5 seconds'],
            ['FR-11','Event enrichment pipeline (add account metadata)','P1','Raw events enriched with account type, tier, region before analytics'],
            ['FR-12','RabbitMQ request-reply for synchronous workflows','P1','Loan approval response within 30 seconds via RabbitMQ RPC'],
            ['FR-13','Message TTL for time-sensitive notifications','P1','Undelivered OTP notifications expire after 5 minutes'],
            ['FR-14','Kafka Connect CDC from core banking database','P1','Database changes captured and streamed within 1 second'],
            ['FR-15','Schema Registry with compatibility enforcement','P1','Breaking schema changes rejected at CI/CD pipeline'],
            ['FR-16','Partition reassignment during cluster scaling','P2','Zero message loss during broker addition/removal'],
            ['FR-17','Multi-tenant topic isolation','P2','Business unit events isolated with ACLs and quotas']
          ].map((r,i) => (
            <tr key={i}><td style={tdS}>{r[0]}</td><td style={tdS}>{r[1]}</td><td style={{...tdS,color:r[2]==='P0'?C.danger:r[2]==='P1'?C.warn:C.info}}>{r[2]}</td><td style={tdS}>{r[3]}</td></tr>
          ))}
        </tbody>
      </table>

      <h3 style={h3S}>Non-Functional Requirements</h3>
      <div style={{...gridS, gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))'}}>
        {[
          { t:'Latency', d:'< 50ms end-to-end event propagation (producer publish to consumer receive). < 10ms for fraud scoring pipeline. P99 latency under 100ms.' },
          { t:'Throughput', d:'100,000 events/second sustained. 500,000 events/second peak (month-end batch). Linear scaling with partition count.' },
          { t:'Retention', d:'7-day retention on hot topics. 90-day on cold storage (S3/HDFS tiered). 7-year compliance archive for regulatory events.' },
          { t:'Durability', d:'Zero message loss. Replication factor 3. min.insync.replicas=2. acks=all for all financial topics.' },
          { t:'Availability', d:'99.99% uptime for Kafka cluster. Tolerate 1 broker failure with no impact. Automated failover within 30 seconds.' },
          { t:'Security', d:'mTLS for broker-to-broker and client-to-broker. SASL/SCRAM authentication. Topic-level ACLs. Encryption at rest (AES-256).' }
        ].map((c,i) => (
          <div key={i} style={cardS}>
            <h4 style={{color:C.accent,marginBottom:8}}>{c.t}</h4>
            <p style={{color:C.text,fontSize:13}}>{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HldTab() {
  return (
    <div>
      <h2 style={{color:C.header,marginBottom:8}}>High-Level Design - Message Queue Architecture</h2>

      <h3 style={h3S}>Kafka Cluster Topology</h3>
      <pre style={pre}>{`
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        KAFKA CLUSTER TOPOLOGY                                   │
│                                                                                 │
│  ┌─────────────── ZooKeeper Ensemble ───────────────┐                           │
│  │  ZK-1 (Leader)    ZK-2 (Follower)  ZK-3 (Follower)│                          │
│  │  Port: 2181        Port: 2181       Port: 2181     │                          │
│  │  Election, Config, Broker Registration             │                          │
│  └─────────────────────┬────────────────────────────┘                           │
│                         │                                                        │
│  ┌─────────────── Kafka Brokers ────────────────────┐                           │
│  │                                                    │                           │
│  │  Broker-1 (ID:1)   Broker-2 (ID:2)  Broker-3 (ID:3)                          │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                        │
│  │  │ payments-0 L │  │ payments-1 L │  │ payments-2 L │                        │
│  │  │ payments-4 R │  │ payments-0 R │  │ payments-1 R │                        │
│  │  │ accounts-0 L │  │ accounts-1 L │  │ accounts-2 L │                        │
│  │  │ loans-0 L    │  │ loans-1 L    │  │ loans-0 R    │                        │
│  │  │ fraud-0 L    │  │ fraud-1 L    │  │ fraud-2 L    │                        │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                        │
│  │  L = Leader replica    R = Follower replica                                   │
│  │  Replication Factor: 3    Min ISR: 2                                          │
│  └───────────────────────────────────────────────────┘                           │
│                                                                                  │
│  ┌─────────── Schema Registry (HA) ─────────────────┐                           │
│  │  Primary        Secondary (standby)                │                           │
│  │  Port: 8081     Port: 8081                         │                           │
│  │  Stores: Avro, Protobuf, JSON schemas              │                           │
│  │  Compatibility: BACKWARD (default)                 │                           │
│  │  Backed by: _schemas topic (compacted)             │                           │
│  └────────────────────────────────────────────────────┘                           │
│                                                                                  │
│  ┌─────────── Kafka Connect Cluster ────────────────┐                           │
│  │  Worker-1          Worker-2          Worker-3      │                           │
│  │  ┌──────────┐     ┌──────────┐     ┌──────────┐   │                           │
│  │  │ Debezium │     │ S3 Sink  │     │ JDBC     │   │                           │
│  │  │ CDC      │     │ Connector│     │ Sink     │   │                           │
│  │  │ Source   │     │          │     │          │   │                           │
│  │  └──────────┘     └──────────┘     └──────────┘   │                           │
│  └────────────────────────────────────────────────────┘                           │
└──────────────────────────────────────────────────────────────────────────────────┘
`}</pre>

      <h3 style={h3S}>Topic Partitioning Strategy</h3>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr>
          <th style={thS}>Topic</th><th style={thS}>Partitions</th><th style={thS}>Partition Key</th><th style={thS}>Retention</th><th style={thS}>Cleanup</th><th style={thS}>Rationale</th>
        </tr></thead>
        <tbody>
          {[
            ['banking.payments.transactions','12','account_id','7 days','delete','High volume; account_id ensures ordering per account'],
            ['banking.accounts.lifecycle','6','account_id','30 days','delete','Moderate volume; ordering by account critical'],
            ['banking.loans.events','6','loan_id','30 days','delete','Ordering per loan application required'],
            ['banking.cards.events','6','card_id','7 days','delete','Ordering per card for auth/block sequencing'],
            ['banking.fraud.alerts','3','account_id','90 days','delete','Low volume, high retention for investigation'],
            ['banking.notifications.outbound','6','customer_id','3 days','delete','Short retention, ordering per customer'],
            ['banking.audit.trail','3','entity_id','365 days','compact','Long retention, compacted for latest state'],
            ['banking.dlq.*','1','original_key','30 days','delete','Single partition for ordered retry processing']
          ].map((r,i) => (
            <tr key={i}><td style={tdS}>{r[0]}</td><td style={tdS}>{r[1]}</td><td style={tdS}>{r[2]}</td><td style={tdS}>{r[3]}</td><td style={tdS}>{r[4]}</td><td style={tdS}>{r[5]}</td></tr>
          ))}
        </tbody>
      </table>

      <h3 style={h3S}>Consumer Group Architecture</h3>
      <div style={{...gridS, gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))'}}>
        {[
          { t:'fraud-detection-group', d:'3 consumers, subscribed to: payments.transactions, cards.events. Max poll: 100 records. Processing: real-time ML scoring. SLA: < 10ms per event. Auto-scale trigger: lag > 5000.' },
          { t:'notification-group', d:'4 consumers, subscribed to: payments.transactions, accounts.lifecycle, loans.events. Max poll: 500 records. Processing: template rendering + delivery. SLA: < 2 seconds.' },
          { t:'reconciliation-group', d:'2 consumers, subscribed to: payments.transactions, loans.events. Max poll: 1000 records. Processing: end-of-day aggregation. Batch-oriented, runs after market close.' },
          { t:'audit-logging-group', d:'2 consumers, subscribed to ALL topics. Max poll: 1000 records. Processing: append to immutable audit store. Compliance requirement: every event logged.' },
          { t:'analytics-group', d:'3 consumers, subscribed to ALL topics. Max poll: 2000 records. Processing: Kafka Streams aggregation to analytics DB. Powers dashboards and reports.' },
          { t:'dlq-processor-group', d:'1 consumer, subscribed to: banking.dlq.*. Manual/scheduled retry. Alert on new DLQ messages. Ops team reviews before replay.' }
        ].map((c,i) => (
          <div key={i} style={cardS}>
            <h4 style={{color:C.accent,marginBottom:8}}>{c.t}</h4>
            <p style={{color:C.text,fontSize:13}}>{c.d}</p>
          </div>
        ))}
      </div>

      <h3 style={h3S}>Integration Architecture</h3>
      <pre style={pre}>{`
┌──────────────────────────────────────────────────────────────────────┐
│                    INTEGRATION ARCHITECTURE                          │
│                                                                      │
│  ┌────────────────┐     CDC (Debezium)      ┌──────────────────┐    │
│  │  Core Banking  │ ──────────────────────>  │  Kafka Connect   │    │
│  │  Database      │  Change Data Capture     │  (Source)         │    │
│  │  (Oracle/DB2)  │                          └────────┬─────────┘    │
│  └────────────────┘                                   │              │
│                                                       ▼              │
│                                              ┌──────────────────┐    │
│                                              │  Kafka Cluster   │    │
│                                              └───┬──────┬───────┘    │
│                                                  │      │            │
│                         ┌────────────────────────┘      └──────┐     │
│                         ▼                                       ▼    │
│              ┌──────────────────┐                   ┌──────────────┐ │
│              │ Kafka Streams    │                   │ Kafka Connect │ │
│              │ (Enrichment)     │                   │ (S3 Sink)     │ │
│              │ Add metadata,    │                   │ Archive to    │ │
│              │ compute derived  │                   │ data lake     │ │
│              └──────────────────┘                   └──────────────┘ │
│                                                                      │
│  ┌──────────────── MONITORING STACK ────────────────────────────┐    │
│  │  Kafka Manager │ Burrow (consumer lag) │ Prometheus + Grafana │    │
│  │  JMX Exporter  │ PagerDuty alerts      │ Kafdrop (topic view) │    │
│  └───────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
`}</pre>
    </div>
  );
}

function LldTab() {
  return (
    <div>
      <h2 style={{color:C.header,marginBottom:8}}>Low-Level Design - Detailed Configuration & Schemas</h2>

      <h3 style={h3S}>Kafka Producer Configuration</h3>
      <pre style={pre}>{`
# Payment Service Producer Configuration
bootstrap.servers=kafka-1:9092,kafka-2:9092,kafka-3:9092
acks=all                          # Wait for all ISR replicas
retries=2147483647                # Infinite retries (bounded by delivery.timeout.ms)
delivery.timeout.ms=120000        # 2-minute delivery timeout
enable.idempotence=true           # Exactly-once producer semantics
max.in.flight.requests.per.connection=5   # Allows batching with idempotence
batch.size=65536                  # 64KB batch size
linger.ms=10                     # Wait up to 10ms for batch fill
compression.type=snappy          # Snappy compression for throughput
buffer.memory=67108864           # 64MB buffer memory
key.serializer=io.confluent.kafka.serializers.KafkaAvroSerializer
value.serializer=io.confluent.kafka.serializers.KafkaAvroSerializer
schema.registry.url=http://schema-registry:8081
security.protocol=SSL
ssl.keystore.location=/certs/producer.keystore.jks
ssl.truststore.location=/certs/truststore.jks
`}</pre>

      <h3 style={h3S}>Kafka Consumer Configuration</h3>
      <pre style={pre}>{`
# Fraud Detection Consumer Configuration
bootstrap.servers=kafka-1:9092,kafka-2:9092,kafka-3:9092
group.id=fraud-detection-group
auto.offset.reset=earliest        # Start from beginning if no committed offset
enable.auto.commit=false          # Manual commit after processing
max.poll.records=100              # Small batch for low-latency fraud scoring
max.poll.interval.ms=30000       # 30-second max between polls
session.timeout.ms=10000         # 10-second session timeout
heartbeat.interval.ms=3000       # 3-second heartbeat
fetch.min.bytes=1                # Fetch immediately (low latency)
fetch.max.wait.ms=100            # Max 100ms wait for fetch
key.deserializer=io.confluent.kafka.serializers.KafkaAvroDeserializer
value.deserializer=io.confluent.kafka.serializers.KafkaAvroDeserializer
schema.registry.url=http://schema-registry:8081
specific.avro.reader=true
isolation.level=read_committed    # Only read committed transactional messages
`}</pre>

      <h3 style={h3S}>Avro Schema Definitions</h3>
      <pre style={pre}>{`
// TransactionEvent.avsc
{
  "type": "record",
  "name": "TransactionEvent",
  "namespace": "com.bank.events.payments",
  "fields": [
    {"name": "event_id",        "type": "string",  "doc": "Unique event identifier (UUID)"},
    {"name": "event_type",      "type": {"type": "enum", "name": "TxnType",
      "symbols": ["PAYMENT_INITIATED","PAYMENT_COMPLETED","PAYMENT_FAILED","REFUND_PROCESSED"]}},
    {"name": "account_id",      "type": "string",  "doc": "Source account ID (partition key)"},
    {"name": "target_account",  "type": ["null","string"], "default": null},
    {"name": "amount",          "type": {"type": "bytes", "logicalType": "decimal", "precision": 18, "scale": 2}},
    {"name": "currency",        "type": "string",  "default": "USD"},
    {"name": "channel",         "type": {"type": "enum", "name": "Channel",
      "symbols": ["MOBILE","WEB","ATM","BRANCH","API"]}},
    {"name": "timestamp",       "type": {"type": "long", "logicalType": "timestamp-millis"}},
    {"name": "correlation_id",  "type": "string",  "doc": "Distributed tracing ID"},
    {"name": "metadata",        "type": {"type": "map", "values": "string"}, "default": {}}
  ]
}

// AccountEvent.avsc
{
  "type": "record",
  "name": "AccountEvent",
  "namespace": "com.bank.events.accounts",
  "fields": [
    {"name": "event_id",        "type": "string"},
    {"name": "event_type",      "type": {"type": "enum", "name": "AcctType",
      "symbols": ["ACCOUNT_OPENED","ACCOUNT_CLOSED","KYC_UPDATED","STATUS_CHANGED","TIER_UPGRADED"]}},
    {"name": "account_id",      "type": "string"},
    {"name": "customer_id",     "type": "string"},
    {"name": "account_type",    "type": {"type": "enum", "name": "AcctCategory",
      "symbols": ["SAVINGS","CHECKING","FIXED_DEPOSIT","LOAN","CREDIT_CARD"]}},
    {"name": "timestamp",       "type": {"type": "long", "logicalType": "timestamp-millis"}},
    {"name": "changes",         "type": {"type": "map", "values": "string"}, "default": {}}
  ]
}

// FraudAlert.avsc
{
  "type": "record",
  "name": "FraudAlert",
  "namespace": "com.bank.events.fraud",
  "fields": [
    {"name": "alert_id",        "type": "string"},
    {"name": "event_id",        "type": "string",  "doc": "Reference to triggering event"},
    {"name": "account_id",      "type": "string"},
    {"name": "risk_score",      "type": "double",  "doc": "ML model score 0.0-1.0"},
    {"name": "rule_triggers",   "type": {"type": "array", "items": "string"}},
    {"name": "severity",        "type": {"type": "enum", "name": "Severity",
      "symbols": ["LOW","MEDIUM","HIGH","CRITICAL"]}},
    {"name": "recommended_action", "type": "string"},
    {"name": "timestamp",       "type": {"type": "long", "logicalType": "timestamp-millis"}}
  ]
}
`}</pre>

      <h3 style={h3S}>Outbox Table Schema</h3>
      <pre style={pre}>{`
CREATE TABLE outbox_events (
    id              BIGSERIAL PRIMARY KEY,
    aggregate_type  VARCHAR(100)  NOT NULL,     -- 'Payment', 'Account', 'Loan'
    aggregate_id    VARCHAR(100)  NOT NULL,     -- account_id, loan_id
    event_type      VARCHAR(100)  NOT NULL,     -- 'PaymentCompleted', 'AccountOpened'
    payload         JSONB         NOT NULL,     -- Serialized event data
    metadata        JSONB         DEFAULT '{}', -- correlation_id, source, etc.
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    published_at    TIMESTAMP     NULL,         -- NULL = not yet published
    retry_count     INT           NOT NULL DEFAULT 0,
    last_error      TEXT          NULL
);

CREATE INDEX idx_outbox_unpublished ON outbox_events(published_at) WHERE published_at IS NULL;
CREATE INDEX idx_outbox_aggregate   ON outbox_events(aggregate_type, aggregate_id);
CREATE INDEX idx_outbox_created     ON outbox_events(created_at);

-- Idempotency / Deduplication Table
CREATE TABLE event_dedup (
    event_id        VARCHAR(100) PRIMARY KEY,
    processed_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    consumer_group  VARCHAR(100) NOT NULL
);

CREATE INDEX idx_dedup_processed ON event_dedup(processed_at);
-- Cleanup: DELETE FROM event_dedup WHERE processed_at < NOW() - INTERVAL '7 days';
`}</pre>

      <h3 style={h3S}>Consumer Retry Policy</h3>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr>
          <th style={thS}>Attempt</th><th style={thS}>Delay</th><th style={thS}>Action</th><th style={thS}>Logging</th>
        </tr></thead>
        <tbody>
          {[
            ['1st retry','1 second','Re-process event','WARN: Retry attempt 1'],
            ['2nd retry','2 seconds','Re-process event','WARN: Retry attempt 2'],
            ['3rd retry','4 seconds','Re-process event','WARN: Retry attempt 3'],
            ['4th retry','8 seconds','Re-process event','ERROR: Retry attempt 4'],
            ['Final','N/A','Route to DLQ topic','ERROR: Sending to DLQ, alert ops team']
          ].map((r,i) => (
            <tr key={i}><td style={tdS}>{r[0]}</td><td style={tdS}>{r[1]}</td><td style={tdS}>{r[2]}</td><td style={tdS}>{r[3]}</td></tr>
          ))}
        </tbody>
      </table>

      <h3 style={h3S}>Dead Letter Queue Handling</h3>
      <pre style={pre}>{`
DLQ Topic Naming: banking.dlq.<original-topic>.<consumer-group>

Example: banking.dlq.payments.transactions.fraud-detection-group

DLQ Message Headers:
  x-original-topic:     banking.payments.transactions
  x-original-partition: 3
  x-original-offset:    12847592
  x-error-message:      "Schema deserialization failed: field 'amount' expected decimal"
  x-retry-count:        5
  x-first-failure:      2026-02-27T10:15:30Z
  x-last-failure:       2026-02-27T10:15:45Z
  x-consumer-group:     fraud-detection-group

DLQ Processing Workflow:
  1. DLQ Processor reads message
  2. Inspect error type (transient vs permanent)
  3. Transient (timeout, connection): auto-retry after cooldown
  4. Permanent (schema error, validation): alert ops, require manual fix
  5. After fix: replay from DLQ to original topic
  6. Archive processed DLQ messages for audit
`}</pre>
    </div>
  );
}

function ScenariosTab() {
  return (
    <div>
      <h2 style={{color:C.header,marginBottom:8}}>Test Scenarios - Message Queue & Event-Driven Architecture</h2>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr>
          <th style={thS}>#</th><th style={thS}>Scenario</th><th style={thS}>Component</th><th style={thS}>Type</th><th style={thS}>Description</th>
        </tr></thead>
        <tbody>
          {[
            ['S01','Payment Event End-to-End Delivery','Kafka','Functional','Publish PaymentCompleted event and verify Fraud, Notification, Reconciliation, and Audit consumers all receive and process it within SLA'],
            ['S02','Consumer Group Rebalancing','Kafka','Resilience','Kill one consumer in fraud-detection-group during active processing. Verify partitions reassigned to surviving consumers with no message loss'],
            ['S03','Message Ordering Within Partition','Kafka','Functional','Publish 1000 events for same account_id. Verify consumer processes them in exact publish order (same partition key = same partition)'],
            ['S04','Dead Letter Queue for Poison Messages','Kafka','Error Handling','Send malformed event (invalid schema). Verify consumer retries 3 times with exponential backoff then routes to DLQ. Verify DLQ alert fires'],
            ['S05','Schema Evolution Backward Compatibility','Schema Registry','Contract','Add optional field to TransactionEvent schema. Verify existing consumers (old schema) continue processing without errors. Verify new consumers read new field'],
            ['S06','Broker Failure - 1 of 3 Down','Kafka','Disaster Recovery','Stop Broker-2. Verify leader election for affected partitions completes within 30s. Verify producers and consumers continue with no message loss (RF=3, min.isr=2)'],
            ['S07','Consumer Lag Spike and Auto-Scaling','Kafka','Performance','Generate 500K events rapidly. Verify consumer lag monitoring detects spike. Verify auto-scaling adds consumer instances. Verify lag returns to normal within 5 minutes'],
            ['S08','Exactly-Once Payment Processing','Kafka','Transactional','Process same PaymentCompleted event through idempotent consumer. Verify account credited exactly once even if event delivered multiple times (at-least-once + dedup)'],
            ['S09','Event Replay for Reconciliation','Kafka','Functional','Reset consumer offset to specific timestamp. Replay 24 hours of transaction events. Verify reconciliation service produces accurate end-of-day report matching source data'],
            ['S10','Outbox Pattern Atomicity','Kafka + DB','Transactional','Execute payment that writes to payments table + outbox table in same transaction. Verify: if DB commit succeeds, event eventually published. If DB rolls back, no event published'],
            ['S11','RabbitMQ Request-Reply for Loan Approval','RabbitMQ','Functional','Send LoanApprovalRequest to RabbitMQ. Verify response received within 30s timeout on reply queue. Verify correlation_id matches. Test timeout scenario'],
            ['S12','Message TTL Expiry in Notification Queue','RabbitMQ','Functional','Publish OTP notification with 5-minute TTL. Verify: if consumed within 5 min, delivered. If not consumed, message expires and routes to dead-letter exchange'],
            ['S13','Consumer Idempotency Verification','Kafka','Transactional','Publish same event_id twice. Verify dedup table catches duplicate. Verify processing occurs exactly once. Verify second attempt returns cached result'],
            ['S14','Kafka Connect CDC from Core Banking DB','Kafka Connect','Integration','Insert row into core banking Oracle table. Verify Debezium CDC captures change. Verify event published to Kafka topic within 1 second. Verify schema matches source'],
            ['S15','Schema Registry Compatibility Check','Schema Registry','Contract','Attempt to register breaking schema change (remove required field). Verify Schema Registry rejects with 409 Conflict. Verify non-breaking change accepted'],
            ['S16','Partition Reassignment During Scaling','Kafka','Operations','Add 4th broker to cluster. Trigger partition reassignment. Verify zero message loss during migration. Verify even partition distribution after completion'],
            ['S17','Cross-Datacenter Replication','MirrorMaker2','Disaster Recovery','Verify MirrorMaker2 replicates events from primary to DR cluster within 5 seconds. Verify offset translation. Test failover to DR and consumer resume'],
            ['S18','Transaction Event Enrichment Pipeline','Kafka Streams','Data Pipeline','Publish raw transaction event. Verify Kafka Streams app enriches with account metadata (type, tier, region) from KTable. Verify enriched event published to output topic'],
            ['S19','Back-Pressure Handling','Kafka','Performance','Slow down consumer to 10% speed. Verify producer continues publishing without errors. Verify consumer lag grows linearly. Verify auto-pause when lag exceeds threshold'],
            ['S20','Event-Driven Saga for Account Opening','Kafka','Workflow','Initiate account opening. Verify saga: KYCCheck event -> AddressVerified event -> AccountCreated event -> CardIssued event -> WelcomeNotification. Test compensating events on KYC failure']
          ].map((r,i) => (
            <tr key={i}>
              <td style={{...tdS,color:C.accent,fontWeight:'bold'}}>{r[0]}</td>
              <td style={{...tdS,fontWeight:'bold',color:C.header}}>{r[1]}</td>
              <td style={tdS}>{r[2]}</td>
              <td style={{...tdS,color:r[3]==='Functional'?C.success:r[3]==='Resilience'||r[3]==='Disaster Recovery'?C.danger:r[3]==='Performance'?C.warn:C.info}}>{r[3]}</td>
              <td style={tdS}>{r[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TestCasesTab() {
  return (
    <div>
      <h2 style={{color:C.header,marginBottom:8}}>Test Cases - Message Queue & Event-Driven Testing</h2>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:1100}}>
          <thead><tr>
            <th style={thS}>TC-ID</th><th style={thS}>Title</th><th style={thS}>Component</th><th style={thS}>Type</th><th style={thS}>Steps</th><th style={thS}>Expected Result</th><th style={thS}>Priority</th>
          </tr></thead>
          <tbody>
            {[
              ['TC-MQ-001','Verify guaranteed delivery of payment event','Kafka','Functional','1. Produce PaymentCompleted event with acks=all\n2. Wait for producer callback\n3. Consume from all consumer groups\n4. Verify offset committed','All 4 consumer groups receive event. Producer receives RecordMetadata with offset. No message loss.','P0'],
              ['TC-MQ-002','Verify event ordering per account','Kafka','Functional','1. Produce 500 events with same account_id key\n2. Consume all events from partition\n3. Compare sequence numbers\n4. Verify no gaps or reordering','Events consumed in exact produce order. Sequence numbers monotonically increasing. All events in same partition.','P0'],
              ['TC-MQ-003','Verify exactly-once with idempotent consumer','Kafka','Transactional','1. Produce PaymentCompleted event\n2. Consumer processes and commits\n3. Reset offset to replay same event\n4. Consumer processes again\n5. Check dedup table and account balance','Dedup table catches duplicate event_id. Account balance credited exactly once. Second processing returns cached result.','P0'],
              ['TC-MQ-004','Verify DLQ routing for deserialization failure','Kafka','Error Handling','1. Publish event with incompatible schema\n2. Consumer attempts deserialization\n3. Verify retry attempts (3x)\n4. Verify DLQ routing\n5. Check alert notification','Consumer retries 3 times with 1s/2s/4s backoff. Event routed to DLQ with error headers. PagerDuty alert triggered within 1 minute.','P0'],
              ['TC-MQ-005','Verify backward-compatible schema evolution','Schema Registry','Contract','1. Register TransactionEvent v1\n2. Produce events with v1\n3. Register v2 (add optional field)\n4. Produce events with v2\n5. Consume with v1 consumer','v1 consumer reads v2 events without error, ignoring new field. v2 consumer reads both v1 and v2 events. Schema Registry shows compatibility BACKWARD.','P0'],
              ['TC-MQ-006','Verify broker failure tolerance','Kafka','Resilience','1. Produce events continuously\n2. Stop Broker-2 (kill -9)\n3. Wait for leader election\n4. Continue producing and consuming\n5. Restart Broker-2\n6. Verify ISR restoration','Leader election completes within 30s. Producers experience brief retry then resume. Zero message loss. ISR restored after broker rejoin.','P0'],
              ['TC-MQ-007','Verify consumer group rebalance','Kafka','Resilience','1. Start 3 consumers in group\n2. Verify partition assignment (4 partitions each)\n3. Kill consumer-2\n4. Verify rebalance\n5. Check no duplicate processing','Rebalance completes within session.timeout.ms (10s). Partitions from dead consumer redistributed. No messages lost. No duplicate processing during rebalance.','P0'],
              ['TC-MQ-008','Verify outbox pattern atomicity','Kafka + DB','Transactional','1. Begin DB transaction\n2. Insert payment record\n3. Insert outbox event\n4. Commit transaction\n5. Verify outbox poller publishes\n6. Test rollback scenario','On commit: both payment and outbox saved, event published to Kafka. On rollback: neither payment nor outbox saved, no event published.','P0'],
              ['TC-MQ-009','Verify event replay from offset','Kafka','Functional','1. Produce 10000 events over 1 hour\n2. Note offset at T+30min mark\n3. Reset consumer group to that offset\n4. Re-consume events\n5. Compare with original data','Consumer replays exactly the events from T+30min onward. Event count matches expected. Data integrity preserved.','P0'],
              ['TC-MQ-010','Verify RabbitMQ request-reply pattern','RabbitMQ','Functional','1. Publish LoanApprovalRequest to loan.approval.request queue\n2. Set reply_to and correlation_id headers\n3. Wait on reply queue\n4. Verify response within timeout','Response received on reply queue within 30s. correlation_id matches request. Response contains approval decision and terms.','P1'],
              ['TC-MQ-011','Verify message TTL expiry','RabbitMQ','Functional','1. Publish OTP notification with 300s TTL\n2. Do NOT consume for 6 minutes\n3. Check message expired\n4. Verify routed to DLX','Message disappears from queue after TTL. Dead-letter exchange receives expired message with x-death headers.','P1'],
              ['TC-MQ-012','Verify Kafka Connect CDC capture','Kafka Connect','Integration','1. Insert row into core_banking.transactions table\n2. Verify Debezium captures INSERT\n3. Check Kafka topic for CDC event\n4. Update row, verify UPDATE captured\n5. Delete row, verify DELETE captured','All CRUD operations captured within 1 second. CDC events match source data. Schema auto-registered in Schema Registry.','P1'],
              ['TC-MQ-013','Verify Schema Registry rejects breaking change','Schema Registry','Contract','1. Register PersonEvent v1 with required field "name"\n2. Attempt to register v2 removing "name"\n3. Verify rejection\n4. Register v2 adding optional "nickname"\n5. Verify acceptance','Removing required field returns 409 Conflict with BACKWARD compatibility error. Adding optional field succeeds. Schema version incremented.','P1'],
              ['TC-MQ-014','Verify high-throughput sustained load','Kafka','Performance','1. Configure 12-partition topic\n2. Start 12 producer threads\n3. Produce 100K events/second for 10 minutes\n4. Monitor broker metrics\n5. Verify no message loss','100K events/sec sustained. Producer latency P99 < 50ms. No OutOfMemoryError. Consumer lag stays below 10000. Zero message loss confirmed by count.','P1'],
              ['TC-MQ-015','Verify consumer lag monitoring and alerting','Kafka','Operations','1. Stop all consumers in notification-group\n2. Continue producing events\n3. Monitor Burrow for lag metrics\n4. Verify alert when lag > 10000\n5. Restart consumers, verify lag recovery','Burrow detects lag increase. Alert fires when threshold exceeded. Grafana dashboard shows lag graph. Consumers catch up after restart.','P1'],
              ['TC-MQ-016','Verify partition reassignment','Kafka','Operations','1. Record current partition assignments\n2. Add Broker-4 to cluster\n3. Generate reassignment plan\n4. Execute reassignment\n5. Verify balanced distribution','Reassignment completes without message loss. Partitions evenly distributed across 4 brokers. Throttle prevents impact on production traffic.','P1'],
              ['TC-MQ-017','Verify cross-DC replication','MirrorMaker2','DR','1. Produce events to primary cluster\n2. Verify MirrorMaker2 replicates to DR\n3. Measure replication lag\n4. Simulate primary failure\n5. Failover consumers to DR','Events replicated within 5 seconds. Offset translation accurate. Consumer resumes from correct position on DR cluster.','P1'],
              ['TC-MQ-018','Verify Kafka Streams enrichment','Kafka Streams','Data Pipeline','1. Produce raw TransactionEvent\n2. Kafka Streams joins with account KTable\n3. Verify enriched event on output topic\n4. Check added fields (account_type, tier, region)','Enriched event contains all original fields plus account metadata. Latency < 100ms. Handles missing account gracefully (default values).','P2'],
              ['TC-MQ-019','Verify back-pressure handling','Kafka','Performance','1. Produce at 100K/sec\n2. Slow consumer to 1K/sec\n3. Monitor consumer lag growth\n4. Verify producer not blocked\n5. Verify auto-pause at threshold','Producer continues unimpeded. Consumer lag grows linearly. Auto-pause triggered at configured threshold. Alert sent to ops.','P2'],
              ['TC-MQ-020','Verify saga compensation on failure','Kafka','Workflow','1. Start account opening saga\n2. KYC Check passes, event published\n3. Address Verify fails\n4. Verify compensating event: KYCCheckRolledBack\n5. Verify account NOT created','Compensating events published for each completed step. Final state: no account created. Audit trail shows complete saga with failure reason.','P2']
            ].map((r,i) => (
              <tr key={i}>
                <td style={{...tdS,color:C.accent,fontWeight:'bold',whiteSpace:'nowrap'}}>{r[0]}</td>
                <td style={{...tdS,fontWeight:'bold',color:C.header,minWidth:180}}>{r[1]}</td>
                <td style={tdS}>{r[2]}</td>
                <td style={tdS}>{r[3]}</td>
                <td style={{...tdS,whiteSpace:'pre-line',minWidth:200}}>{r[4]}</td>
                <td style={{...tdS,minWidth:200}}>{r[5]}</td>
                <td style={{...tdS,color:r[6]==='P0'?C.danger:r[6]==='P1'?C.warn:C.info,fontWeight:'bold'}}>{r[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function C4ModelTab() {
  return (
    <div>
      <h2 style={{color:C.header,marginBottom:8}}>C4 Model - Event-Driven Banking Platform</h2>

      <h3 style={h3S}>Level 1: System Context</h3>
      <pre style={pre}>{`
┌─────────────────────────────────────────────────────────────────────────┐
│                     LEVEL 1: SYSTEM CONTEXT                             │
│                                                                         │
│                        ┌────────────────┐                               │
│                        │   Operations   │                               │
│                        │   Team         │                               │
│                        └───────┬────────┘                               │
│                                │ Monitors                               │
│  ┌──────────────┐              ▼              ┌──────────────┐          │
│  │   Banking    │   Events   ┌────────────┐   │  Compliance  │          │
│  │   Services   │ ─────────> │   EVENT    │ <─│  & Audit     │          │
│  │ (Payment,    │            │  PLATFORM  │   │  Systems     │          │
│  │  Account,    │ <───────── │  (Kafka +  │   └──────────────┘          │
│  │  Loan, Card) │  Commands  │  RabbitMQ) │                             │
│  └──────────────┘            └─────┬──────┘                             │
│                                    │                                     │
│                          ┌─────────┴──────────┐                          │
│                          ▼                     ▼                         │
│                 ┌──────────────┐      ┌──────────────┐                  │
│                 │  Analytics   │      │  External    │                  │
│                 │  Platform    │      │  Partners    │                  │
│                 │ (Dashboards, │      │  (SWIFT,     │                  │
│                 │  Reports)    │      │   VISA, RBI) │                  │
│                 └──────────────┘      └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
`}</pre>

      <h3 style={h3S}>Level 2: Container Diagram</h3>
      <pre style={pre}>{`
┌──────────────────────────────────────────────────────────────────────────────┐
│                      LEVEL 2: CONTAINER DIAGRAM                              │
│                                                                              │
│  ┌──────────────────── Event Platform ──────────────────────────────────┐    │
│  │                                                                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │    │
│  │  │ Kafka Cluster│  │   Schema     │  │   Kafka      │                │    │
│  │  │ (3 Brokers)  │  │  Registry    │  │  Connect     │                │    │
│  │  │              │  │ (Confluent)  │  │  (Debezium)  │                │    │
│  │  │ Event store  │  │ Schema       │  │ CDC from     │                │    │
│  │  │ & streaming  │  │ validation   │  │ core banking │                │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                │    │
│  │                                                                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │    │
│  │  │  RabbitMQ    │  │  Monitoring  │  │  Dead Letter │                │    │
│  │  │  Cluster     │  │  Dashboard   │  │  Processor   │                │    │
│  │  │              │  │              │  │              │                │    │
│  │  │ Request-     │  │ Grafana +    │  │ Failed msg   │                │    │
│  │  │ reply flows  │  │ Burrow       │  │ handling     │                │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                │    │
│  │                                                                       │    │
│  └───────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
`}</pre>

      <h3 style={h3S}>Level 3: Component Diagram</h3>
      <pre style={pre}>{`
┌──────────────────────────────────────────────────────────────────────────────┐
│                      LEVEL 3: COMPONENT DIAGRAM                              │
│                                                                              │
│  ┌─────────── Producer Side ──────────────────────────────────┐              │
│  │                                                             │              │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │              │
│  │  │ KafkaProducer│  │  Schema      │  │   Outbox     │      │              │
│  │  │ Wrapper      │  │  Validator   │  │   Poller     │      │              │
│  │  │              │  │              │  │              │      │              │
│  │  │ Serialize,   │  │ Validate vs  │  │ Poll outbox  │      │              │
│  │  │ partition,   │  │ registry,    │  │ table, publish│      │              │
│  │  │ publish      │  │ evolve       │  │ to Kafka     │      │              │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │              │
│  └─────────────────────────────────────────────────────────────┘              │
│                                                                              │
│  ┌─────────── Consumer Side ──────────────────────────────────┐              │
│  │                                                             │              │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │              │
│  │  │ KafkaConsumer│  │ Idempotency  │  │   Event      │      │              │
│  │  │ Wrapper      │  │  Checker     │  │   Router     │      │              │
│  │  │              │  │              │  │              │      │              │
│  │  │ Poll, deser, │  │ Check dedup  │  │ Route event  │      │              │
│  │  │ commit       │  │ table, skip  │  │ to handler   │      │              │
│  │  │ offsets      │  │ if duplicate │  │ by type      │      │              │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │              │
│  │                                                             │              │
│  │  ┌──────────────┐                                           │              │
│  │  │  DLQ Handler │                                           │              │
│  │  │              │                                           │              │
│  │  │ Route failed │                                           │              │
│  │  │ msgs to DLQ, │                                           │              │
│  │  │ alert ops    │                                           │              │
│  │  └──────────────┘                                           │              │
│  └─────────────────────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────────────────────┘
`}</pre>

      <h3 style={h3S}>Level 4: Key Classes</h3>
      <pre style={pre}>{`
┌─────────────────────────────────────────────────────────────────────────┐
│                      LEVEL 4: CODE / CLASS DIAGRAM                      │
│                                                                         │
│  class BankingEventProducer:                                            │
│      - kafka_producer: KafkaProducer                                    │
│      - schema_registry: SchemaRegistryClient                            │
│      - serializer: AvroSerializer                                       │
│      + publish(topic, key, event): RecordMetadata                       │
│      + publish_transactional(events[]): void                            │
│      - serialize(event): bytes                                          │
│      - get_partition_key(event): string                                 │
│                                                                         │
│  class BankingEventConsumer:                                            │
│      - kafka_consumer: KafkaConsumer                                    │
│      - dedup_store: EventDedupRepository                                │
│      - dlq_producer: DLQProducer                                        │
│      - event_router: EventRouter                                        │
│      + start(): void                                                    │
│      + poll_and_process(): int                                          │
│      - check_idempotency(event_id): bool                                │
│      - commit_offset(partition, offset): void                           │
│      - handle_error(event, error): void                                 │
│                                                                         │
│  class OutboxPoller:                                                    │
│      - outbox_repo: OutboxRepository                                    │
│      - producer: BankingEventProducer                                   │
│      + poll_and_publish(batch_size=100): int                            │
│      - mark_published(event_ids[]): void                                │
│      - handle_publish_failure(event, error): void                       │
│                                                                         │
│  class EventRouter:                                                     │
│      - handlers: Map<EventType, EventHandler>                           │
│      + register(event_type, handler): void                              │
│      + route(event): ProcessingResult                                   │
│      - resolve_handler(event_type): EventHandler                        │
│                                                                         │
│  interface EventHandler:                                                │
│      + handle(event): ProcessingResult                                  │
│      + supports(event_type): bool                                       │
│                                                                         │
│  class FraudDetectionHandler implements EventHandler:                   │
│      - ml_model: FraudScoringModel                                      │
│      - alert_producer: BankingEventProducer                             │
│      + handle(event): ProcessingResult                                  │
│      - score_transaction(event): float                                  │
│      - publish_alert_if_suspicious(score, event): void                  │
└─────────────────────────────────────────────────────────────────────────┘
`}</pre>
    </div>
  );
}

function TechStackTab() {
  const categories = [
    { cat:'Messaging', items:[
      { n:'Apache Kafka', v:'3.7.x', u:'Core event streaming platform. Log-based, high throughput, replay capability.' },
      { n:'RabbitMQ', v:'3.13.x', u:'Request-reply patterns, routing, TTL, priority queues for synchronous workflows.' },
      { n:'AWS SQS/SNS', v:'Managed', u:'Cloud-native alternative for simpler pub/sub and queue patterns.' }
    ]},
    { cat:'Streaming', items:[
      { n:'Kafka Streams', v:'3.7.x', u:'Stream processing library for event enrichment, aggregation, windowing.' },
      { n:'Apache Flink', v:'1.19.x', u:'Complex event processing, stateful computations, exactly-once semantics.' },
      { n:'ksqlDB', v:'0.29.x', u:'SQL interface for Kafka streams. Ad-hoc queries on event data.' }
    ]},
    { cat:'Schema Management', items:[
      { n:'Confluent Schema Registry', v:'7.6.x', u:'Central schema store. Compatibility enforcement (BACKWARD, FORWARD, FULL).' },
      { n:'Apache Avro', v:'1.11.x', u:'Primary serialization format. Compact binary, schema evolution support.' },
      { n:'Protocol Buffers', v:'4.x', u:'Alternative serialization for high-performance inter-service communication.' }
    ]},
    { cat:'Change Data Capture', items:[
      { n:'Debezium', v:'2.6.x', u:'CDC connector for Oracle, PostgreSQL, MySQL. Captures DB changes as Kafka events.' },
      { n:'Kafka Connect', v:'3.7.x', u:'Framework for source/sink connectors. Manages CDC workers and scaling.' }
    ]},
    { cat:'Monitoring', items:[
      { n:'Kafka Manager (CMAK)', v:'3.x', u:'Cluster management UI. Topic/partition management, broker monitoring.' },
      { n:'Burrow', v:'1.6.x', u:'Consumer lag monitoring. Evaluates consumer health and lag trends.' },
      { n:'Prometheus JMX Exporter', v:'0.20.x', u:'Export Kafka JMX metrics to Prometheus for alerting and dashboards.' },
      { n:'Grafana', v:'11.x', u:'Dashboards for Kafka metrics: throughput, latency, consumer lag, broker health.' }
    ]},
    { cat:'Testing', items:[
      { n:'Testcontainers', v:'3.x', u:'Spin up Kafka/RabbitMQ in Docker for integration tests. Ephemeral, isolated.' },
      { n:'EmbeddedKafka', v:'3.7.x', u:'In-process Kafka for unit tests. Fast startup, no Docker dependency.' },
      { n:'Kafdrop', v:'4.x', u:'Web UI for viewing Kafka topics, messages, consumer groups during testing.' },
      { n:'kafkacat (kcat)', v:'1.7.x', u:'CLI tool for producing/consuming messages. Essential for debugging.' }
    ]},
    { cat:'Infrastructure', items:[
      { n:'Kubernetes', v:'1.29.x', u:'Container orchestration for Kafka consumers, connectors, and processing apps.' },
      { n:'Strimzi Kafka Operator', v:'0.40.x', u:'Kubernetes operator for managing Kafka clusters declaratively.' },
      { n:'Confluent Platform', v:'7.6.x', u:'Enterprise Kafka distribution with Schema Registry, ksqlDB, Control Center.' }
    ]}
  ];
  return (
    <div>
      <h2 style={{color:C.header,marginBottom:8}}>Technology Stack</h2>
      {categories.map((cat,ci) => (
        <div key={ci}>
          <h3 style={h3S}>{cat.cat}</h3>
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:16}}>
            <thead><tr>
              <th style={thS}>Technology</th><th style={thS}>Version</th><th style={thS}>Purpose</th>
            </tr></thead>
            <tbody>
              {cat.items.map((it,i) => (
                <tr key={i}><td style={{...tdS,color:C.accent,fontWeight:'bold'}}>{it.n}</td><td style={tdS}>{it.v}</td><td style={tdS}>{it.u}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function SadTab() {
  return (
    <div>
      <h2 style={{color:C.header,marginBottom:8}}>Software Architecture Decisions</h2>

      <h3 style={h3S}>Key Architecture Decisions</h3>
      <div style={{...gridS, gridTemplateColumns:'1fr'}}>
        {[
          { t:'ADR-001: Kafka over RabbitMQ for Event Streaming', ctx:'Need a durable, replayable event backbone for financial transaction events with high throughput.',
            dec:'Use Apache Kafka as the primary event streaming platform.',
            why:'Kafka provides log-based storage with configurable retention, enabling event replay for audit and reconciliation. Throughput of 100K+ events/sec. Consumer groups allow independent consumption. Built-in partitioning for ordered processing per account.',
            alt:'RabbitMQ: better for request-reply but lacks log-based replay. AWS Kinesis: managed but vendor lock-in. Pulsar: newer, less ecosystem maturity.'},
          { t:'ADR-002: RabbitMQ for Request-Reply Patterns', ctx:'Loan approval and card authorization require synchronous request-response within timeout.',
            dec:'Use RabbitMQ for synchronous RPC workflows alongside Kafka for async streaming.',
            why:'RabbitMQ excels at request-reply with correlation_id, TTL, priority queues, and dead-letter exchanges. Kafka is not designed for request-reply patterns. Using both gives best-of-breed for each pattern.',
            alt:'Kafka request-reply (possible but awkward). gRPC (tight coupling). REST (no queue benefits like retry, DLX).'},
          { t:'ADR-003: Avro over JSON for Event Serialization', ctx:'Events need schema evolution support, compact wire format, and contract enforcement.',
            dec:'Use Apache Avro with Confluent Schema Registry for all event serialization.',
            why:'Avro provides compact binary encoding (40-60% smaller than JSON), schema evolution with backward/forward compatibility, and integration with Schema Registry for contract management. Prevents breaking changes from reaching production.',
            alt:'JSON Schema: human-readable but larger. Protobuf: good but weaker schema evolution story with Kafka. Thrift: limited ecosystem.'},
          { t:'ADR-004: Outbox Pattern over Dual-Write', ctx:'Must guarantee atomicity between business state change (DB) and event publish (Kafka).',
            dec:'Implement Outbox pattern with Debezium CDC for reliable event publishing.',
            why:'Dual-write (write to DB then Kafka) has failure modes: DB succeeds but Kafka fails = lost event, or Kafka succeeds but DB fails = phantom event. Outbox pattern uses single DB transaction for both, with CDC polling for publish. Guarantees at-least-once delivery.',
            alt:'Dual-write with retry (still has failure window). Transactional outbox with polling (simpler but higher latency). Kafka transactions (requires all participants to be Kafka-aware).'},
          { t:'ADR-005: Consumer-Driven Contract Testing', ctx:'Multiple teams own different consumers. Schema changes must not break existing consumers.',
            dec:'Implement consumer-driven contract tests in CI/CD pipeline with Schema Registry compatibility checks.',
            why:'Each consumer team defines their expected schema. Schema Registry enforces backward compatibility by default. CI pipeline runs compatibility check before deploying new schema. Prevents runtime deserialization failures in production.',
            alt:'Provider-driven testing (producer decides, consumers adapt). No contract testing (runtime failures). Manual schema review (slow, error-prone).'}
        ].map((d,i) => (
          <div key={i} style={{...cardS,marginBottom:12}}>
            <h4 style={{color:C.accent,marginBottom:10}}>{d.t}</h4>
            <p style={{color:C.muted,fontSize:12,marginBottom:6}}><strong style={{color:C.header}}>Context:</strong> {d.ctx}</p>
            <p style={{color:C.text,fontSize:13,marginBottom:6}}><strong style={{color:C.header}}>Decision:</strong> {d.dec}</p>
            <p style={{color:C.text,fontSize:13,marginBottom:6}}><strong style={{color:C.header}}>Rationale:</strong> {d.why}</p>
            <p style={{color:C.muted,fontSize:12}}><strong style={{color:C.header}}>Alternatives Considered:</strong> {d.alt}</p>
          </div>
        ))}
      </div>

      <h3 style={h3S}>Trade-Off Analysis</h3>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr>
          <th style={thS}>Trade-Off</th><th style={thS}>Option A</th><th style={thS}>Option B</th><th style={thS}>Our Choice</th><th style={thS}>Rationale</th>
        </tr></thead>
        <tbody>
          {[
            ['Ordering vs Throughput','Fewer partitions = strict ordering','More partitions = higher parallelism','6-12 partitions per topic','Balance: partition by account_id gives per-account ordering with adequate parallelism'],
            ['At-Least-Once vs Exactly-Once','At-least-once (simpler, higher throughput)','Exactly-once (complex, lower throughput)','At-least-once + idempotent consumers','Simpler infrastructure with application-level dedup table for financial correctness'],
            ['Retention vs Storage Cost','Long retention = full replay capability','Short retention = lower storage cost','7-day hot + tiered cold storage','Hot topics for recent replay, S3 archival for compliance (7-year requirement)'],
            ['Schema Strictness vs Flexibility','Strict FULL compatibility','Loose NONE compatibility','BACKWARD compatibility','Consumers can read old + new. Producers must not remove fields. Good balance for banking.'],
            ['Sync vs Async Processing','Synchronous REST (simple, immediate)','Async events (decoupled, resilient)','Async by default, sync for approval workflows','Async for 90% of flows. RabbitMQ RPC for the 10% requiring immediate response.']
          ].map((r,i) => (
            <tr key={i}><td style={{...tdS,fontWeight:'bold',color:C.header}}>{r[0]}</td><td style={tdS}>{r[1]}</td><td style={tdS}>{r[2]}</td><td style={{...tdS,color:C.accent}}>{r[3]}</td><td style={tdS}>{r[4]}</td></tr>
          ))}
        </tbody>
      </table>

      <h3 style={h3S}>Failure Modes</h3>
      <div style={{...gridS, gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))'}}>
        {[
          { t:'Split Brain', d:'ZooKeeper partition causes two brokers to think they are leader for same partition. Mitigated by: min.insync.replicas=2, unclean.leader.election.enable=false, ZK ensemble of 3+ nodes.', sev:'CRITICAL' },
          { t:'Consumer Lag Snowball', d:'Consumer falls behind, lag grows, memory pressure increases, GC pauses cause more lag. Mitigated by: lag monitoring with auto-scaling, back-pressure alerts, consumer pause at threshold.', sev:'HIGH' },
          { t:'Schema Incompatibility', d:'Breaking schema deployed to production, consumers fail to deserialize. Mitigated by: Schema Registry compatibility enforcement, CI/CD compatibility checks, consumer-driven contract tests.', sev:'HIGH' },
          { t:'Outbox Poller Stall', d:'CDC connector stops polling outbox table, events not published. Mitigated by: connector health monitoring, heartbeat table, alerting on publish lag > 5 seconds.', sev:'MEDIUM' }
        ].map((f,i) => (
          <div key={i} style={{...cardS, borderLeft:'4px solid '+(f.sev==='CRITICAL'?C.danger:f.sev==='HIGH'?C.warn:C.info)}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <h4 style={{color:C.header,margin:0}}>{f.t}</h4>
              <span style={{color:f.sev==='CRITICAL'?C.danger:f.sev==='HIGH'?C.warn:C.info,fontSize:11,fontWeight:'bold'}}>{f.sev}</span>
            </div>
            <p style={{color:C.text,fontSize:13}}>{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowchartTab() {
  return (
    <div>
      <h2 style={{color:C.header,marginBottom:8}}>Event Processing Flowchart</h2>

      <h3 style={h3S}>End-to-End Event Processing Flow</h3>
      <pre style={pre}>{`
                    ┌─────────────────────────┐
                    │   Transaction Occurs     │
                    │   (Payment, Transfer)    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Service writes to DB    │
                    │  + Outbox table in       │
                    │  SAME transaction        │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  DB Transaction Commit   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Outbox Poller (CDC)     │
                    │  reads unpublished       │
                    │  events from Outbox      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Serialize event with    │
                    │  Avro (Schema Registry)  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Validate schema against │
                    │  Schema Registry         │
                    │  (compatibility check)   │
                    └────────────┬────────────┘
                                 │
                          ┌──────┴──────┐
                          │ Schema OK?  │
                          └──────┬──────┘
                          │             │
                     Yes  ▼             ▼  No
              ┌──────────────┐  ┌──────────────┐
              │ Publish to   │  │ Schema Error │
              │ Kafka topic  │  │ Log + Alert  │
              │ (acks=all)   │  │ Return Error │
              └──────┬───────┘  └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ Kafka ISR    │
              │ replication  │
              │ (RF=3,ISR=2) │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │ Mark Outbox  │
              │ as published │
              └──────┬───────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Consumer polls from   │
         │ assigned partitions   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Deserialize with Avro │
         │ (Schema Registry)     │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Check Idempotency     │
         │ (event_id in dedup    │
         │  table?)              │
         └───────────┬───────────┘
                     │
              ┌──────┴───────┐
              │ Already       │
              │ processed?    │
              └──────┬───────┘
              │              │
         Yes  ▼              ▼  No
    ┌──────────────┐  ┌──────────────┐
    │ Skip event,  │  │ Process      │
    │ commit offset│  │ event        │
    │ (idempotent) │  │ (business    │
    └──────────────┘  │  logic)      │
                      └──────┬───────┘
                             │
                      ┌──────┴───────┐
                      │  Success?    │
                      └──────┬───────┘
                      │              │
                 Yes  ▼              ▼  No
          ┌──────────────┐  ┌──────────────┐
          │ Insert into  │  │ Retry count  │
          │ dedup table  │  │ < 3 ?        │
          │ Commit offset│  └──────┬───────┘
          │              │  │              │
          │  DONE        │  Yes ▼          ▼ No
          └──────────────┘  ┌────────┐  ┌──────────────┐
                            │ Retry  │  │ Send to DLQ  │
                            │ with   │  │ topic        │
                            │backoff │  │              │
                            │1s/2s/4s│  │ Alert ops    │
                            └───┬────┘  │ team via     │
                                │       │ PagerDuty    │
                                ▼       └──────────────┘
                         (back to Process event)
`}</pre>

      <h3 style={h3S}>Saga Orchestration Flow (Account Opening)</h3>
      <pre style={pre}>{`
┌──────────────────────────────────────────────────────────────────────────┐
│                ACCOUNT OPENING SAGA (Choreography)                       │
│                                                                          │
│  Customer Request                                                        │
│       │                                                                  │
│       ▼                                                                  │
│  ┌──────────┐   KYCCheckRequested   ┌──────────┐                        │
│  │ Account  │ ────────────────────> │   KYC    │                        │
│  │ Service  │                       │ Service  │                        │
│  └──────────┘                       └────┬─────┘                        │
│       ▲                                  │                               │
│       │                           ┌──────┴──────┐                        │
│       │                      Pass │             │ Fail                   │
│       │                           ▼             ▼                        │
│       │                   KYCCheckPassed  KYCCheckFailed                 │
│       │                           │             │                        │
│       │                           ▼             ▼                        │
│       │                   ┌──────────┐   ┌──────────────┐               │
│       │                   │ Address  │   │ SAGA ABORTED │               │
│       │                   │ Verify   │   │ Notify       │               │
│       │                   │ Service  │   │ customer     │               │
│       │                   └────┬─────┘   └──────────────┘               │
│       │                        │                                         │
│       │                 ┌──────┴──────┐                                  │
│       │            Pass │             │ Fail                             │
│       │                 ▼             ▼                                   │
│       │         AddrVerified    AddrVerifyFailed                         │
│       │                 │             │                                   │
│       │                 ▼             ▼                                   │
│       │         ┌──────────┐   ┌──────────────────┐                     │
│       │         │ Create   │   │ COMPENSATE:      │                     │
│       │         │ Account  │   │ KYCCheckRolledBack│                    │
│       │         └────┬─────┘   │ SAGA ABORTED     │                     │
│       │              │         └──────────────────┘                     │
│       │              ▼                                                   │
│       │      AccountCreated                                              │
│       │              │                                                   │
│       │              ▼                                                   │
│       │      ┌──────────┐   CardIssued   ┌──────────────┐              │
│       │      │  Card    │ ─────────────> │ Notification │              │
│       │      │  Service │                │   Service    │              │
│       │      └──────────┘                │              │              │
│       │                                  │ WelcomeEmail │              │
│       │                                  │ + SMS sent   │              │
│       │                                  └──────────────┘              │
│       │                                                                  │
│       └──── SAGA COMPLETE ◄──────────────────────────────────────────   │
└──────────────────────────────────────────────────────────────────────────┘
`}</pre>
    </div>
  );
}

function SequenceDiagramTab() {
  return (
    <div>
      <h2 style={{color:C.header,marginBottom:8}}>Sequence Diagrams</h2>

      <h3 style={h3S}>Event Publish and Consume Flow</h3>
      <pre style={pre}>{`
  Payment     Outbox      Outbox      Schema      Kafka       Fraud       Notification   DLQ
  Service     Table       Poller      Registry    Broker      Consumer    Consumer       Handler
    │           │           │           │           │           │           │              │
    │  BEGIN TX │           │           │           │           │           │              │
    │──────────>│           │           │           │           │           │              │
    │           │           │           │           │           │           │              │
    │ INSERT    │           │           │           │           │           │              │
    │ payment   │           │           │           │           │           │              │
    │ record    │           │           │           │           │           │              │
    │──────────>│           │           │           │           │           │              │
    │           │           │           │           │           │           │              │
    │ INSERT    │           │           │           │           │           │              │
    │ outbox    │           │           │           │           │           │              │
    │ event     │           │           │           │           │           │              │
    │──────────>│           │           │           │           │           │              │
    │           │           │           │           │           │           │              │
    │  COMMIT   │           │           │           │           │           │              │
    │──────────>│           │           │           │           │           │              │
    │           │           │           │           │           │           │              │
    │           │  Poll     │           │           │           │           │              │
    │           │  unpubl.  │           │           │           │           │              │
    │           │<──────────│           │           │           │           │              │
    │           │           │           │           │           │           │              │
    │           │  Return   │           │           │           │           │              │
    │           │  events   │           │           │           │           │              │
    │           │──────────>│           │           │           │           │              │
    │           │           │           │           │           │           │              │
    │           │           │ Get       │           │           │           │              │
    │           │           │ schema    │           │           │           │              │
    │           │           │──────────>│           │           │           │              │
    │           │           │           │           │           │           │              │
    │           │           │ Schema +  │           │           │           │              │
    │           │           │ ID        │           │           │           │              │
    │           │           │<──────────│           │           │           │              │
    │           │           │           │           │           │           │              │
    │           │           │ Serialize │           │           │           │              │
    │           │           │ (Avro)    │           │           │           │              │
    │           │           │           │           │           │           │              │
    │           │           │ Produce   │           │           │           │              │
    │           │           │ (acks=all)│           │           │           │              │
    │           │           │──────────────────────>│           │           │              │
    │           │           │           │           │           │           │              │
    │           │           │           │  Replicate│           │           │              │
    │           │           │           │  to ISR   │           │           │              │
    │           │           │           │  (RF=3)   │           │           │              │
    │           │           │           │           │           │           │              │
    │           │           │ ACK       │           │           │           │              │
    │           │           │ (offset)  │           │           │           │              │
    │           │           │<─────────────────────│           │           │              │
    │           │           │           │           │           │           │              │
    │           │ Mark      │           │           │           │           │              │
    │           │ published │           │           │           │           │              │
    │           │<──────────│           │           │           │           │              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │  Poll     │           │              │
    │           │           │           │           │<──────────│           │              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │  Events   │           │              │
    │           │           │           │           │──────────>│           │              │
    │           │           │           │           │           │           │              │
    │           │           │           │  Get      │           │           │              │
    │           │           │           │  schema   │           │           │              │
    │           │           │           │<──────────│           │           │              │
    │           │           │           │           │           │           │              │
    │           │           │           │  Schema   │           │           │              │
    │           │           │           │──────────>│           │           │              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │ Deser +   │           │              │
    │           │           │           │           │ Check     │           │              │
    │           │           │           │           │ dedup     │           │              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │ Process   │           │              │
    │           │           │           │           │ (fraud    │           │              │
    │           │           │           │           │  scoring) │           │              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │ Commit    │           │              │
    │           │           │           │           │ offset    │           │              │
    │           │           │           │           │<──────────│           │              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │  Poll     │           │              │
    │           │           │           │           │<──────────────────────│              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │  Events   │           │              │
    │           │           │           │           │──────────────────────>│              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │           │  Process  │              │
    │           │           │           │           │           │  (send    │              │
    │           │           │           │           │           │   SMS)    │              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │           │  ERROR!   │              │
    │           │           │           │           │           │  (SMS     │              │
    │           │           │           │           │           │   failed) │              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │           │  Retry 1  │              │
    │           │           │           │           │           │  (1s)     │              │
    │           │           │           │           │           │  Retry 2  │              │
    │           │           │           │           │           │  (2s)     │              │
    │           │           │           │           │           │  Retry 3  │              │
    │           │           │           │           │           │  (4s)     │              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │           │  Still    │              │
    │           │           │           │           │           │  failing  │              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │           │  Send to  │              │
    │           │           │           │           │           │  DLQ      │              │
    │           │           │           │           │           │──────────────────────────>│
    │           │           │           │           │           │           │              │
    │           │           │           │           │           │           │              │
    │           │           │           │           │           │           │     Inspect  │
    │           │           │           │           │           │           │     + Alert  │
    │           │           │           │           │           │           │     ops team │
    │           │           │           │           │           │           │              │
`}</pre>

      <h3 style={h3S}>RabbitMQ Request-Reply (Loan Approval)</h3>
      <pre style={pre}>{`
  Loan          RabbitMQ       Loan            Credit         RabbitMQ       Loan
  API           Exchange       Approval        Bureau         Reply Queue    API
  Gateway                      Worker                                        Gateway
    │               │              │              │              │              │
    │  Publish      │              │              │              │              │
    │  LoanRequest  │              │              │              │              │
    │  reply_to=    │              │              │              │              │
    │  loan.reply.q │              │              │              │              │
    │  corr_id=abc  │              │              │              │              │
    │──────────────>│              │              │              │              │
    │               │              │              │              │              │
    │               │  Route to    │              │              │              │
    │               │  loan.       │              │              │              │
    │               │  approval.q  │              │              │              │
    │               │─────────────>│              │              │              │
    │               │              │              │              │              │
    │               │              │  Check       │              │              │
    │               │              │  credit      │              │              │
    │               │              │  score       │              │              │
    │               │              │─────────────>│              │              │
    │               │              │              │              │              │
    │               │              │  Score: 750  │              │              │
    │               │              │<─────────────│              │              │
    │               │              │              │              │              │
    │               │              │  Evaluate    │              │              │
    │               │              │  rules       │              │              │
    │               │              │  (DTI, LTV)  │              │              │
    │               │              │              │              │              │
    │               │              │  Decision:   │              │              │
    │               │              │  APPROVED    │              │              │
    │               │              │              │              │              │
    │               │              │  Publish     │              │              │
    │               │              │  response    │              │              │
    │               │              │  corr_id=abc │              │              │
    │               │              │─────────────────────────────>│              │
    │               │              │              │              │              │
    │               │              │              │              │  Consume     │
    │               │              │              │              │  response    │
    │               │              │              │              │  match       │
    │               │              │              │              │  corr_id     │
    │               │              │              │              │─────────────>│
    │               │              │              │              │              │
    │               │              │              │              │   Return     │
    │               │              │              │              │   APPROVED   │
    │               │              │              │              │   to client  │
    │               │              │              │              │              │
    │  Timeout scenario (30s):                                                 │
    │  If no response within 30s, return 408 Request Timeout                   │
    │  Message in loan.approval.q gets TTL expiry -> DLX -> alert             │
    │               │              │              │              │              │
`}</pre>
    </div>
  );
}

function renderTab(tab) {
  switch (tab) {
    case 'architecture': return <ArchitectureTab />;
    case 'brd': return <BrdTab />;
    case 'hld': return <HldTab />;
    case 'lld': return <LldTab />;
    case 'scenarios': return <ScenariosTab />;
    case 'testcases': return <TestCasesTab />;
    case 'c4model': return <C4ModelTab />;
    case 'techstack': return <TechStackTab />;
    case 'sad': return <SadTab />;
    case 'flowchart': return <FlowchartTab />;
    case 'sequence': return <SequenceDiagramTab />;
    default: return <ArchitectureTab />;
  }
}

export default function MessageQueueArch() {
  const [activeTab, setActiveTab] = useState('architecture');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, ' + C.bgFrom + ' 0%, ' + C.bgTo + ' 100%)',
      padding: 24,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ color: C.header, fontSize: 28, marginBottom: 4, fontWeight: 700 }}>
          Message Queue & Event-Driven Architecture Testing
        </h1>
        <p style={{ color: C.muted, marginBottom: 24, fontSize: 14 }}>
          Kafka, RabbitMQ, CQRS, Event Sourcing - Banking QA Testing Dashboard
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          marginBottom: 24,
          borderBottom: '2px solid ' + C.border,
          paddingBottom: 8
        }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px 6px 0 0',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: activeTab === tab.key ? 700 : 400,
                background: activeTab === tab.key ? C.accent : 'transparent',
                color: activeTab === tab.key ? C.bgFrom : C.text,
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{
          background: C.card,
          borderRadius: 12,
          padding: 28,
          border: '1px solid ' + C.border,
          minHeight: 600
        }}>
          {renderTab(activeTab)}
        </div>
      </div>
    </div>
  );
}

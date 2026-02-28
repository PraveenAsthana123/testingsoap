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

const pre = (txt) => (
  <pre style={{ fontFamily:'monospace', background:C.editorBg, padding:20, borderRadius:8, overflowX:'auto', color:C.editorText, fontSize:12, lineHeight:1.6, border:'1px solid ' + C.border, margin:'16px 0' }}>{txt}</pre>
);

const hdr = (t) => <h3 style={{ color:C.header, borderBottom:'1px solid ' + C.border, paddingBottom:8, marginTop:24 }}>{t}</h3>;

const card = (children, extra) => (
  <div style={{ background:C.card, borderRadius:8, padding:16, border:'1px solid ' + C.border, marginBottom:12, ...extra }}>{children}</div>
);

const tbl = (headers, rows) => (
  <div style={{ overflowX:'auto', marginTop:12 }}>
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
      <thead>
        <tr>{headers.map((h,i) => <th key={i} style={{ background:'rgba(78,204,163,0.15)', color:C.accent, padding:'10px 8px', textAlign:'left', borderBottom:'2px solid ' + C.border, whiteSpace:'nowrap' }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r,ri) => <tr key={ri} style={{ borderBottom:'1px solid ' + C.border }}>{r.map((c,ci) => <td key={ci} style={{ padding:'8px', color:C.text, verticalAlign:'top' }}>{c}</td>)}</tr>)}
      </tbody>
    </table>
  </div>
);

const badge = (text, color) => (
  <span style={{ display:'inline-block', background:color || C.accent, color:'#fff', borderRadius:12, padding:'2px 10px', fontSize:11, fontWeight:600, marginRight:4 }}>{text}</span>
);

/* ===================== TAB CONTENT ===================== */

function ArchitectureTab() {
  return (
    <div>
      {hdr('Banking Microservices Ecosystem Overview')}
      <p style={{ color:C.text, lineHeight:1.7 }}>
        A comprehensive microservices architecture for modern banking, decomposing the monolithic core banking system into independently deployable, domain-driven services. The ecosystem leverages a service mesh for secure inter-service communication, an API gateway for external traffic management, and event-driven patterns for eventual consistency across bounded contexts.
      </p>

      {hdr('Ecosystem Architecture Diagram')}
      {pre(`
+===========================================================================================+
|                              BANKING MICROSERVICES ECOSYSTEM                               |
+===========================================================================================+
|                                                                                           |
|  +------------------+    +------------------+    +------------------+                     |
|  | Mobile Banking   |    | Internet Banking |    | Partner APIs     |                     |
|  | (iOS / Android)  |    | (React SPA)      |    | (Open Banking)   |                     |
|  +--------+---------+    +--------+---------+    +--------+---------+                     |
|           |                       |                       |                               |
|           +----------+------------+-----------+-----------+                               |
|                      |                        |                                           |
|              +-------v------------------------v-------+                                   |
|              |         API GATEWAY (Kong / Envoy)      |                                  |
|              |  +-----------------------------------+  |                                  |
|              |  | Rate Limiting | Auth (JWT/OAuth2) |  |                                  |
|              |  | Request Routing | Load Balancing   |  |                                  |
|              |  | SSL Termination | API Versioning   |  |                                  |
|              |  +-----------------------------------+  |                                  |
|              +------------------+----------------------+                                  |
|                                 |                                                         |
|              +------------------v----------------------+                                  |
|              |         SERVICE MESH (Istio + Envoy)    |                                  |
|              |  +-----------------------------------+  |                                  |
|              |  | mTLS | Traffic Mgmt | Observability|  |                                  |
|              |  | Fault Injection | Circuit Breaking |  |                                  |
|              |  +-----------------------------------+  |                                  |
|              +--+------+------+------+------+------+--+                                   |
|                 |      |      |      |      |      |                                      |
|   +-------------v--+ +-v------+-+ +--v-------+ +--v---------+ +--v-----------+ +--v------+|
|   | Account Svc    | | Payment  | | Loan Svc | | Customer   | | Notification | | Fraud   ||
|   | +----------+   | | Service  | |          | | Service    | | Service      | | Service ||
|   | |Sidecar   |   | | +------+ | | +------+ | | +--------+ | | +----------+ | | +----+ ||
|   | |Proxy     |   | | |Sidecar| | | |Sidecar| | | |Sidecar | | | |Sidecar   | | | |Side| ||
|   | |(Envoy)   |   | | |(Envoy)| | | |(Envoy)| | | |(Envoy)  | | | |(Envoy)   | | | |car | ||
|   | +----------+   | | +------+ | | +------+ | | +--------+ | | +----------+ | | +----+ ||
|   |                 | |          | |          | |            | |              | |        ||
|   | PostgreSQL      | | PostgreSQL| | MongoDB  | | PostgreSQL | | Redis Queue  | | Neo4j  ||
|   +-----------------+ +----------+ +----------+ +------------+ +--------------+ +--------+|
|                                                                                           |
|   +-----------------------------+    +----------------------------+                       |
|   |   Audit Service             |    |   Config Server            |                       |
|   |   (Compliance Logging)      |    |   (Spring Cloud Config)    |                       |
|   |   Elasticsearch + Kibana    |    |   HashiCorp Vault          |                       |
|   +-----------------------------+    +----------------------------+                       |
|                                                                                           |
|   +-----------------------------------------------------------------------------------+   |
|   |                    EVENT BUS (Apache Kafka)                                       |   |
|   |  Topics: account.events | payment.events | loan.events | fraud.alerts            |   |
|   |  Schema Registry (Avro/Protobuf) | Partitioning by Account ID                    |   |
|   +-----------------------------------------------------------------------------------+   |
|                                                                                           |
|   +---------------------------+  +---------------------------+  +---------------------+   |
|   | Service Discovery         |  | Distributed Tracing       |  | Centralized Logging |   |
|   | (Consul)                  |  | (Jaeger / Zipkin)         |  | (ELK Stack)         |   |
|   +---------------------------+  +---------------------------+  +---------------------+   |
|                                                                                           |
|   +---------------------------+  +---------------------------+  +---------------------+   |
|   | Circuit Breakers          |  | Distributed Cache         |  | Metrics & Alerts    |   |
|   | (Resilience4j)            |  | (Redis Cluster)           |  | (Prometheus+Grafana)|   |
|   +---------------------------+  +---------------------------+  +---------------------+   |
|                                                                                           |
+===========================================================================================+
`)}

      {hdr('Key Architecture Patterns')}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:12 }}>
        {card(<div>
          <h4 style={{ color:C.accent, margin:'0 0 8px' }}>Saga Pattern</h4>
          <p style={{ color:C.text, fontSize:13, margin:0 }}><strong style={{ color:C.warn }}>Choreography:</strong> Each service publishes events; other services listen and react. No central coordinator. Suitable for simple, linear flows.</p>
          <p style={{ color:C.text, fontSize:13, margin:'8px 0 0' }}><strong style={{ color:C.info }}>Orchestration:</strong> A central saga orchestrator directs each step. Better for complex multi-step transactions like fund transfers with compensation logic.</p>
        </div>)}
        {card(<div>
          <h4 style={{ color:C.accent, margin:'0 0 8px' }}>CQRS (Command Query Responsibility Segregation)</h4>
          <p style={{ color:C.text, fontSize:13, margin:0 }}>Separate read and write models for Account Service. Write model uses normalized PostgreSQL; read model uses denormalized views or Redis cache for high-throughput balance queries and statement generation.</p>
        </div>)}
        {card(<div>
          <h4 style={{ color:C.accent, margin:'0 0 8px' }}>Event Sourcing</h4>
          <p style={{ color:C.text, fontSize:13, margin:0 }}>Account balances derived from immutable event log. Every debit/credit stored as an event. Enables complete audit trail, point-in-time reconstruction, and regulatory compliance. Events stored in Kafka with long retention.</p>
        </div>)}
        {card(<div>
          <h4 style={{ color:C.accent, margin:'0 0 8px' }}>Strangler Fig (Legacy Migration)</h4>
          <p style={{ color:C.text, fontSize:13, margin:0 }}>Incrementally replace monolithic core banking modules. API gateway routes traffic: new requests to microservices, legacy to monolith. Phased: Account first, then Payment, then Loan. Anti-corruption layer between old and new.</p>
        </div>)}
      </div>
    </div>
  );
}

function BrdTab() {
  return (
    <div>
      {hdr('Business Requirements Document - Microservices Migration')}
      {card(<div>
        <h4 style={{ color:C.accent, margin:'0 0 8px' }}>Project Vision</h4>
        <p style={{ color:C.text, fontSize:13 }}>Decompose the monolithic core banking platform into independently deployable microservices to enable team autonomy, accelerate feature delivery, improve fault isolation, and support horizontal scaling for growing digital banking demands.</p>
      </div>)}

      {hdr('Business Objectives')}
      {tbl(['#','Objective','Success Metric','Timeline'], [
        ['BO-1','Reduce release cycle from quarterly to weekly','Average deployment frequency >= 1/week','Q2 2026'],
        ['BO-2','Enable independent team ownership per domain','Each service owned by a single team (2-pizza rule)','Q1 2026'],
        ['BO-3','Achieve 99.99% availability per service','Monthly uptime >= 99.99% measured per service','Q3 2026'],
        ['BO-4','Support 10x transaction volume growth','Handle 50K TPS at peak without degradation','Q4 2026'],
        ['BO-5','Reduce mean time to recovery (MTTR)','MTTR < 5 minutes per incident','Q2 2026'],
        ['BO-6','Enable A/B testing and canary releases','Canary deployment for every production release','Q2 2026'],
      ])}

      {hdr('Scope - Domain Services')}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:12 }}>
        {[
          { name:'Account Management Service', desc:'Current/savings accounts, balance inquiries, account lifecycle (open, freeze, close), interest calculation, statements' },
          { name:'Payment Service', desc:'Fund transfers (NEFT, RTGS, IMPS, UPI), bill payments, standing instructions, payment status tracking, refunds' },
          { name:'Loan Service', desc:'Loan origination, underwriting, disbursement, EMI calculation, repayment tracking, pre-closure, NPA management' },
          { name:'Customer Onboarding Service', desc:'KYC verification (eKYC, VKYC), document upload, CIBIL score check, account opening workflow, dedup check' },
          { name:'Notification Service', desc:'SMS, email, push notifications, in-app messages, regulatory alerts, transaction alerts, marketing communications' },
          { name:'Fraud Detection Service', desc:'Real-time transaction scoring, rule engine, ML model inference, suspicious activity reporting (SAR), velocity checks' },
        ].map((s,i) => card(<div key={i}>
          <h4 style={{ color:C.accent, margin:'0 0 6px' }}>{s.name}</h4>
          <p style={{ color:C.text, fontSize:13, margin:0 }}>{s.desc}</p>
        </div>))}
      </div>

      {hdr('Functional Requirements')}
      {tbl(['FR-ID','Requirement','Service','Priority'], [
        ['FR-01','System shall process fund transfers via saga pattern with compensation','Payment','P0'],
        ['FR-02','Each service shall have independent database with no shared schema','All','P0'],
        ['FR-03','API gateway shall enforce rate limits per customer tier (Basic: 100/min, Premium: 500/min)','Gateway','P0'],
        ['FR-04','Circuit breaker shall trip after 5 consecutive failures, half-open after 30s','All','P0'],
        ['FR-05','All inter-service communication shall use mTLS via service mesh','All','P0'],
        ['FR-06','Service shall register/deregister with Consul on startup/shutdown','All','P0'],
        ['FR-07','Distributed tracing shall propagate correlation ID across all service calls','All','P0'],
        ['FR-08','Account balance queries shall use CQRS read model with < 10ms response','Account','P0'],
        ['FR-09','Event sourcing shall maintain immutable audit log for all financial transactions','Account, Payment','P0'],
        ['FR-10','Notification service shall support multi-channel delivery (SMS, email, push)','Notification','P1'],
        ['FR-11','Fraud service shall score transactions in < 50ms using ML model','Fraud','P0'],
        ['FR-12','Loan service shall integrate with CIBIL/Experian via anti-corruption layer','Loan','P1'],
        ['FR-13','Customer onboarding shall support eKYC with Aadhaar OTP verification','Customer','P1'],
        ['FR-14','System shall support canary deployments with configurable traffic split','Platform','P1'],
        ['FR-15','Config changes shall propagate to all service instances within 30 seconds','Config','P1'],
        ['FR-16','Secret rotation shall occur without service restart or downtime','Platform','P0'],
        ['FR-17','Health check endpoints shall differentiate liveness from readiness','All','P0'],
        ['FR-18','Kafka events shall guarantee at-least-once delivery with idempotent consumers','All','P0'],
        ['FR-19','Blue-green deployment shall support instant rollback within 60 seconds','Platform','P1'],
        ['FR-20','Strangler fig proxy shall route legacy endpoints to monolith transparently','Gateway','P1'],
        ['FR-21','Bulkhead pattern shall isolate thread pools per downstream dependency','All','P1'],
        ['FR-22','gRPC shall be used for internal synchronous calls between services','All','P2'],
      ])}

      {hdr('Non-Functional Requirements')}
      {tbl(['NFR-ID','Requirement','Target'], [
        ['NFR-01','Inter-service latency','< 100ms p99 for synchronous calls'],
        ['NFR-02','Service availability','99.99% per service (< 4.32 min downtime/month)'],
        ['NFR-03','Independent scaling','Each service scales 1-100 pods independently'],
        ['NFR-04','Zero-downtime deployment','Rolling update with no dropped requests'],
        ['NFR-05','Data consistency','Eventual consistency within 5 seconds across services'],
        ['NFR-06','Throughput','50,000 TPS aggregate at peak load'],
        ['NFR-07','Recovery time','< 5 min MTTR, < 1 min failover'],
        ['NFR-08','Security','mTLS everywhere, secrets in Vault, no plaintext credentials'],
        ['NFR-09','Observability','100% distributed trace coverage, < 2% sampling overhead'],
        ['NFR-10','Compliance','PCI-DSS, RBI guidelines, SOX audit trail'],
      ])}
    </div>
  );
}

function HldTab() {
  return (
    <div>
      {hdr('High-Level Design - Banking Microservices Platform')}

      {hdr('System Context Diagram')}
      {pre(`
+================================================================================================+
|                           HIGH-LEVEL DESIGN - BANKING PLATFORM                                 |
+================================================================================================+
|                                                                                                |
|  EXTERNAL CLIENTS                                                                              |
|  +-------------+  +----------------+  +---------------+  +--------------+                      |
|  | Mobile App  |  | Web Portal     |  | Partner Banks |  | ATM Network  |                      |
|  | (REST/JSON) |  | (REST/GraphQL) |  | (ISO 8583)   |  | (ISO 8583)   |                      |
|  +------+------+  +-------+--------+  +-------+-------+  +------+-------+                     |
|         |                 |                    |                 |                              |
|         +---------+-------+--------+-----------+--------+-------+                              |
|                   |                            |                                               |
|          +--------v----------------------------v--------+                                      |
|          |            API GATEWAY (Kong)                 |                                      |
|          |  +----------------------------------------+  |                                      |
|          |  | JWT Validation    | OAuth2 Token Intro  |  |                                      |
|          |  | Rate Limiting     | Request Throttling  |  |                                      |
|          |  | API Versioning    | Response Caching    |  |                                      |
|          |  | Request/Response  | Circuit Breaking    |  |                                      |
|          |  | Transformation    | IP Whitelisting     |  |                                      |
|          |  | SSL Termination   | WAF Integration     |  |                                      |
|          |  +----------------------------------------+  |                                      |
|          +---------------------+------------------------+                                      |
|                                |                                                               |
|          +---------------------v------------------------+                                      |
|          |         SERVICE MESH (Istio)                  |                                      |
|          |  mTLS | Traffic Policies | Fault Injection    |                                      |
|          +--+-----+-----+-----+-----+-----+-----+------+                                      |
|             |     |     |     |     |     |     |                                              |
|  +----------v-+ +-v-----+-+ +-v----+-+ +-v------+-+ +-v----------+ +-v--------+ +-v---------+ |
|  | Account    | | Payment | | Loan   | | Customer | | Notify     | | Fraud    | | Audit     | |
|  | Service    | | Service | | Service| | Service  | | Service    | | Service  | | Service   | |
|  |            | |         | |        | |          | |            | |          | |           | |
|  | PostgreSQL | | Postgre | | Mongo  | | Postgre  | | Redis      | | Neo4j    | | Elastic   | |
|  | (CQRS R/W) | | SQL     | | DB     | | SQL      | | + SQS      | | Graph    | | search    | |
|  +------------+ +---------+ +--------+ +----------+ +------------+ +----------+ +-----------+ |
|                                                                                                |
|  +--------------------------------------------------------------------------------------------+|
|  |                       EVENT BUS (Apache Kafka Cluster)                                     ||
|  |  Broker 1  |  Broker 2  |  Broker 3  (3-node cluster, replication factor 3)               ||
|  |  Topics: account.created | account.updated | payment.initiated | payment.completed         ||
|  |           payment.failed | loan.approved | loan.disbursed | fraud.alert | audit.log        ||
|  |  Schema Registry: Confluent (Avro schemas with backward compatibility)                     ||
|  +--------------------------------------------------------------------------------------------+|
|                                                                                                |
|  SHARED INFRASTRUCTURE                                                                         |
|  +------------------+ +------------------+ +------------------+ +------------------+           |
|  | Config Server    | | Service Registry | | Secret Manager   | | Distributed Cache|           |
|  | Spring Cloud     | | Consul           | | HashiCorp Vault  | | Redis Cluster    |           |
|  | Config           | | Health Checks    | | Dynamic Secrets  | | 6-node cluster   |           |
|  | Git-backed       | | DNS Interface    | | PKI Certificates | | Read replicas    |           |
|  +------------------+ +------------------+ +------------------+ +------------------+           |
|                                                                                                |
|  OBSERVABILITY STACK                                                                           |
|  +------------------+ +------------------+ +------------------+ +------------------+           |
|  | Metrics          | | Tracing          | | Logging          | | Alerting         |           |
|  | Prometheus       | | Jaeger           | | ELK Stack        | | PagerDuty        |           |
|  | Grafana          | | OpenTelemetry    | | Fluentd          | | Slack            |           |
|  +------------------+ +------------------+ +------------------+ +------------------+           |
|                                                                                                |
+================================================================================================+
`)}

      {hdr('Database Strategy - Database Per Service')}
      {tbl(['Service','Database','Justification','Key Tables/Collections'], [
        ['Account Service','PostgreSQL (CQRS)','Strong consistency for balances, ACID transactions','accounts, transactions, balances_read_model'],
        ['Payment Service','PostgreSQL','Transaction integrity for payment processing','payments, saga_state, payment_events'],
        ['Loan Service','MongoDB','Flexible schema for diverse loan products','loans, applications, repayment_schedules'],
        ['Customer Service','PostgreSQL','Relational data for customer profiles and KYC','customers, kyc_documents, addresses'],
        ['Notification Service','Redis + SQS','High-throughput queue for notification delivery','notification_queue, delivery_status'],
        ['Fraud Service','Neo4j','Graph relationships for fraud ring detection','transactions, accounts, relationships'],
        ['Audit Service','Elasticsearch','Full-text search, time-series audit logs','audit_events (time-partitioned index)'],
      ])}

      {hdr('Bounded Contexts')}
      {pre(`
+-------------------+     +-------------------+     +-------------------+
|  ACCOUNT CONTEXT  |     |  PAYMENT CONTEXT  |     |   LOAN CONTEXT    |
|                   |     |                   |     |                   |
| - Account Entity  |<--->| - Payment Entity  |     | - Loan Entity     |
| - Balance VO      |     | - Transfer VO     |<--->| - EMI Schedule    |
| - Statement       |     | - Saga State      |     | - Disbursement    |
| - Interest Calc   |     | - Gateway Adapter |     | - Underwriting    |
+-------------------+     +-------------------+     +-------------------+
        ^                         ^                         ^
        |     ANTI-CORRUPTION     |                         |
        |         LAYER           |                         |
+-------------------+     +-------------------+     +-------------------+
| CUSTOMER CONTEXT  |     | NOTIFICATION CTX  |     |  FRAUD CONTEXT    |
|                   |     |                   |     |                   |
| - Customer Entity |     | - Channel Router  |     | - Risk Score      |
| - KYC Process     |     | - Template Engine |     | - Rule Engine     |
| - Dedup Check     |     | - Delivery Track  |     | - ML Model        |
| - Consent Mgmt    |     | - Preference Mgmt |     | - Graph Analysis  |
+-------------------+     +-------------------+     +-------------------+
`)}
    </div>
  );
}

function LldTab() {
  return (
    <div>
      {hdr('Low-Level Design - Banking Microservices')}

      {hdr('API Contracts Per Service')}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:12 }}>
        {card(<div>
          <h4 style={{ color:C.accent, margin:'0 0 8px' }}>Account Service (REST + gRPC)</h4>
          {pre(`REST Endpoints:
  POST   /api/v1/accounts              Create account
  GET    /api/v1/accounts/{id}         Get account details
  GET    /api/v1/accounts/{id}/balance  Get real-time balance
  GET    /api/v1/accounts/{id}/statement?from=&to=
  PUT    /api/v1/accounts/{id}/status   Freeze/Unfreeze
  DELETE /api/v1/accounts/{id}         Close account

gRPC Service:
  rpc GetBalance(AccountId) returns (BalanceResponse)
  rpc DebitAccount(DebitRequest) returns (TransactionResult)
  rpc CreditAccount(CreditRequest) returns (TransactionResult)
  rpc ValidateAccount(AccountId) returns (ValidationResult)`)}
        </div>)}
        {card(<div>
          <h4 style={{ color:C.accent, margin:'0 0 8px' }}>Payment Service (REST + gRPC)</h4>
          {pre(`REST Endpoints:
  POST   /api/v1/payments/transfer     Initiate fund transfer
  GET    /api/v1/payments/{id}         Get payment status
  GET    /api/v1/payments/{id}/saga    Get saga state
  POST   /api/v1/payments/bill-pay     Bill payment
  GET    /api/v1/payments?account_id=  List payments

gRPC Service:
  rpc InitiateTransfer(TransferReq) returns (SagaId)
  rpc GetSagaState(SagaId) returns (SagaState)
  rpc CancelTransfer(SagaId) returns (CancelResult)`)}
        </div>)}
      </div>

      {hdr('Fund Transfer Saga - Orchestration Detail')}
      {pre(`
SAGA: Fund Transfer (Orchestrated)
=====================================

Step 1: VALIDATE
  Action:    PaymentService.validateTransfer(from, to, amount)
  Compensate: None (read-only)
  Timeout:   5 seconds

Step 2: RESERVE (Debit Source)
  Action:    AccountService.debitAccount(fromAccount, amount)
  Compensate: AccountService.creditAccount(fromAccount, amount)  [REVERSE DEBIT]
  Timeout:   10 seconds
  Retry:     3 attempts, exponential backoff (1s, 2s, 4s)

Step 3: CREDIT (Credit Destination)
  Action:    AccountService.creditAccount(toAccount, amount)
  Compensate: AccountService.debitAccount(toAccount, amount)  [REVERSE CREDIT]
  Timeout:   10 seconds
  Retry:     3 attempts, exponential backoff

Step 4: NOTIFY
  Action:    NotificationService.sendTransferAlert(from, to, amount)
  Compensate: None (best-effort, non-critical)
  Timeout:   5 seconds

Step 5: AUDIT
  Action:    AuditService.logTransaction(sagaId, details)
  Compensate: None (append-only log)
  Timeout:   5 seconds

SAGA STATES:
  STARTED -> VALIDATING -> DEBITING -> CREDITING -> NOTIFYING -> AUDITING -> COMPLETED
                |              |            |
                v              v            v
           VALIDATION_FAILED  DEBIT_FAILED  CREDIT_FAILED
                                  |            |
                                  v            v
                              COMPENSATING -> COMPENSATED -> FAILED
`)}

      {hdr('Circuit Breaker Configuration (Resilience4j)')}
      {tbl(['Parameter','Payment Gateway','Account Service','External API'], [
        ['Failure Rate Threshold','50%','40%','60%'],
        ['Slow Call Rate Threshold','80%','70%','90%'],
        ['Slow Call Duration','3 seconds','2 seconds','5 seconds'],
        ['Minimum Calls','10','5','20'],
        ['Wait Duration (Open)','30 seconds','20 seconds','60 seconds'],
        ['Permitted Calls (Half-Open)','3','2','5'],
        ['Sliding Window Type','COUNT_BASED','TIME_BASED','COUNT_BASED'],
        ['Sliding Window Size','20 calls','60 seconds','50 calls'],
        ['Fallback','Queue for retry','Return cached balance','Return error'],
      ])}

      {hdr('Retry & Bulkhead Configuration')}
      {pre(`
Retry Policy:
  maxAttempts: 3
  waitDuration: 1000ms
  retryExceptions: [ConnectException, TimeoutException, ServiceUnavailableException]
  ignoreExceptions: [BusinessException, ValidationException]
  intervalFunction: exponentialRandomBackoff(multiplier=2, randomizationFactor=0.5)

Bulkhead Configuration (Thread Pool Isolation):
  Account Service:  maxConcurrent=25, maxWait=500ms, queueCapacity=50
  Payment Service:  maxConcurrent=50, maxWait=1000ms, queueCapacity=100
  Fraud Service:    maxConcurrent=100, maxWait=200ms, queueCapacity=200
  Notification Svc: maxConcurrent=10, maxWait=2000ms, queueCapacity=500

Service Mesh Routing Rules (Istio VirtualService):
  canary-v2:
    match: header["x-canary"] = "true" OR weight: 10%
    route: payment-service-v2
  stable:
    weight: 90%
    route: payment-service-v1

Health Check Endpoints:
  /health   -> Overall service health (composite)
  /ready    -> Ready to receive traffic (DB connected, dependencies up)
  /live     -> Process alive (basic heartbeat)
  /metrics  -> Prometheus metrics endpoint
`)}

      {hdr('Database Schema - Payment Service')}
      {pre(`
CREATE TABLE payments (
    payment_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    saga_id         UUID NOT NULL UNIQUE,
    from_account    VARCHAR(20) NOT NULL,
    to_account      VARCHAR(20) NOT NULL,
    amount          DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    currency        VARCHAR(3) DEFAULT 'INR',
    payment_type    VARCHAR(20) NOT NULL,  -- NEFT, RTGS, IMPS, UPI
    status          VARCHAR(20) NOT NULL DEFAULT 'INITIATED',
    idempotency_key UUID UNIQUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE saga_state (
    saga_id         UUID PRIMARY KEY,
    payment_id      UUID REFERENCES payments(payment_id),
    current_step    VARCHAR(30) NOT NULL,
    status          VARCHAR(20) NOT NULL,  -- STARTED, COMPENSATING, COMPLETED, FAILED
    step_results    JSONB DEFAULT '{}',
    started_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at    TIMESTAMP WITH TIME ZONE
);

CREATE TABLE payment_events (
    event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    saga_id         UUID NOT NULL,
    event_type      VARCHAR(50) NOT NULL,
    payload         JSONB NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_saga_id ON payments(saga_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_from_account ON payments(from_account);
CREATE INDEX idx_saga_state_status ON saga_state(status);
CREATE INDEX idx_payment_events_saga_id ON payment_events(saga_id);
CREATE INDEX idx_payment_events_created_at ON payment_events(created_at);

-- CloudEvents Format for Kafka:
-- {
--   "specversion": "1.0",
--   "type": "com.bank.payment.initiated",
--   "source": "/payment-service",
--   "id": "<uuid>",
--   "time": "2026-02-27T10:00:00Z",
--   "datacontenttype": "application/json",
--   "data": { "sagaId": "...", "amount": 5000.00, "currency": "INR" }
-- }
`)}
    </div>
  );
}

function ScenariosTab() {
  const scenarios = [
    { id:'SC-01', title:'Fund Transfer Saga - Happy Path', type:'E2E', risk:'Low', desc:'Customer initiates INR 10,000 transfer. Debit succeeds, credit succeeds, notification sent, audit logged. Saga completes in COMPLETED state within 2 seconds.' },
    { id:'SC-02', title:'Fund Transfer Saga - Credit Failure with Compensation', type:'E2E', risk:'High', desc:'Debit of INR 50,000 succeeds from source account. Credit to destination fails (account frozen). Saga orchestrator triggers compensation: reverse debit, notify customer of failure, log to audit.' },
    { id:'SC-03', title:'Circuit Breaker Trip on Payment Gateway Timeout', type:'Resilience', risk:'High', desc:'Payment gateway responds slowly (>3s). After 10 consecutive slow calls, circuit breaker opens. Subsequent payment requests get immediate fallback response. After 30s, circuit enters half-open state, allows 3 test requests.' },
    { id:'SC-04', title:'Service Mesh Canary Deployment (10% Traffic)', type:'Deployment', risk:'Medium', desc:'Deploy Payment Service v2 with new UPI flow. Istio VirtualService routes 10% traffic to v2. Monitor error rates and latency. If p99 latency > 200ms or error rate > 1%, auto-rollback to v1.' },
    { id:'SC-05', title:'API Gateway Rate Limiting Per Customer Tier', type:'Security', risk:'Medium', desc:'Basic tier customer exceeds 100 requests/minute. API gateway returns 429 Too Many Requests with Retry-After header. Premium tier customer at 400 requests/minute passes through. Verify tier-based rate limit configuration.' },
    { id:'SC-06', title:'Service Discovery During Rolling Update', type:'Resilience', risk:'Medium', desc:'Account Service rolling update from v1.2 to v1.3. Old pods deregister from Consul, new pods register. During transition, Payment Service discovers healthy endpoints. Zero dropped requests verified via distributed tracing.' },
    { id:'SC-07', title:'Distributed Transaction Across 3 Services', type:'E2E', risk:'High', desc:'Loan disbursement requires: Loan Service (approve) -> Account Service (credit) -> Notification Service (confirm). Saga coordinates all three. If Account Service fails, Loan Service compensates by reverting approval status.' },
    { id:'SC-08', title:'Event Ordering Guarantee in Kafka', type:'Integration', risk:'High', desc:'Multiple transactions for same account published to Kafka. Verify events processed in order using partition key (account_id). Consumer processes debit before credit for same account. Out-of-order detection and resequencing tested.' },
    { id:'SC-09', title:'Database Per Service - Eventual Consistency', type:'Integration', risk:'Medium', desc:'Customer updates address in Customer Service. Event published to Kafka. Account Service, Loan Service, and Notification Service consume event and update their local copies. Verify all services consistent within 5 seconds.' },
    { id:'SC-10', title:'Retry Storm Prevention (Exponential Backoff + Jitter)', type:'Resilience', risk:'High', desc:'Account Service goes down. 100 concurrent Payment Service instances retry simultaneously. Without jitter, all retry at same intervals causing thundering herd. With jitter, retries spread across time window. Verify no retry storm via metrics.' },
    { id:'SC-11', title:'Bulkhead Isolation - Thread Pool Exhaustion', type:'Resilience', risk:'High', desc:'Fraud Service becomes slow (5s response). Payment Service bulkhead limits concurrent calls to Fraud Service to 25 threads. Other downstream calls (Account, Notification) unaffected. Verify Payment Service remains responsive for non-fraud operations.' },
    { id:'SC-12', title:'Health Check Failure and Auto-Recovery', type:'Resilience', risk:'Medium', desc:'Account Service instance loses database connection. Readiness probe fails, Kubernetes removes pod from service endpoints. Liveness probe triggers pod restart. New pod passes readiness check and receives traffic. Verify zero customer impact.' },
    { id:'SC-13', title:'Config Change Propagation Across Services', type:'Integration', risk:'Medium', desc:'Update rate limit threshold in Spring Cloud Config. All 20 service instances pick up new config within 30 seconds via /actuator/refresh or bus-refresh. Verify new rate limit enforced across all instances without restart.' },
    { id:'SC-14', title:'Secret Rotation Without Downtime', type:'Security', risk:'High', desc:'Rotate database password in HashiCorp Vault. Vault dynamic secrets generate new credentials. Services pick up new credentials via sidecar injector. Old credentials remain valid for grace period. Zero connection failures during rotation.' },
    { id:'SC-15', title:'gRPC Deadline Propagation', type:'Integration', risk:'Medium', desc:'Client sets 5-second deadline for fund transfer. Payment Service calls Account Service with remaining deadline (e.g., 4.2s). Account Service calls Fraud Service with remaining deadline (e.g., 3.8s). If deadline exceeded at any hop, proper DEADLINE_EXCEEDED error propagated back.' },
    { id:'SC-16', title:'Distributed Tracing Across 5 Services', type:'Observability', risk:'Low', desc:'Fund transfer request generates trace ID at API Gateway. Trace propagated through Payment -> Account -> Fraud -> Notification -> Audit services. Jaeger shows complete waterfall view with timing for each span. Verify no broken traces.' },
    { id:'SC-17', title:'Cache Invalidation Across Services', type:'Integration', risk:'Medium', desc:'Account balance updated in Account Service. Redis cache invalidated. Payment Service and Loan Service that cache account data receive invalidation event via Kafka. Verify stale data window < 2 seconds.' },
    { id:'SC-18', title:'Service Mesh mTLS Certificate Rotation', type:'Security', risk:'High', desc:'Istio rotates mTLS certificates (24-hour validity). During rotation, existing connections gracefully drain. New connections use new certificates. Verify zero TLS handshake failures during rotation. Certificate chain validation confirmed.' },
    { id:'SC-19', title:'Blue-Green Deployment Switchover', type:'Deployment', risk:'High', desc:'Deploy Payment Service v2 to green environment. Run smoke tests against green. Switch Istio routing from blue (v1) to green (v2). Monitor for 5 minutes. If errors detected, instant rollback to blue within 60 seconds.' },
    { id:'SC-20', title:'Strangler Fig - Legacy and New Coexisting', type:'Migration', risk:'High', desc:'API Gateway routes /api/v1/accounts to new Account microservice. /api/v1/legacy/accounts routes to monolith via anti-corruption layer. Both return same response format. Gradually migrate endpoints. Verify no data inconsistency between old and new.' },
  ];

  const riskColor = (r) => r === 'High' ? C.danger : r === 'Medium' ? C.warn : C.success;

  return (
    <div>
      {hdr('Microservices Test Scenarios - Banking Platform')}
      <p style={{ color:C.muted, fontSize:13 }}>20 comprehensive test scenarios covering saga patterns, circuit breakers, service mesh, event-driven flows, and deployment strategies.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(370px, 1fr))', gap:12 }}>
        {scenarios.map(s => (
          <div key={s.id} style={{ background:C.card, borderRadius:8, padding:16, border:'1px solid ' + C.border, borderLeft:'4px solid ' + riskColor(s.risk) }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ color:C.accent, fontWeight:700, fontSize:13 }}>{s.id}</span>
              <div>
                {badge(s.type, C.info)}
                {badge(s.risk, riskColor(s.risk))}
              </div>
            </div>
            <h4 style={{ color:C.header, margin:'0 0 8px', fontSize:14 }}>{s.title}</h4>
            <p style={{ color:C.text, fontSize:12, margin:0, lineHeight:1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestCasesTab() {
  const cases = [
    ['TC-MS-01','Fund Transfer Saga - Complete Success','Payment, Account, Notification, Audit','E2E','1. POST /payments/transfer with valid accounts and amount\n2. Verify saga state transitions: STARTED->DEBITING->CREDITING->NOTIFYING->AUDITING->COMPLETED\n3. Verify source account debited\n4. Verify destination account credited\n5. Verify notification sent\n6. Verify audit log entry','Saga completes in < 2s, both balances correct, notification delivered, audit logged with correlation ID','P0'],
    ['TC-MS-02','Saga Compensation - Credit Failure','Payment, Account','E2E','1. POST /payments/transfer where destination account is frozen\n2. Verify debit succeeds\n3. Verify credit fails with ACCOUNT_FROZEN error\n4. Verify compensation triggers reverse debit\n5. Verify source balance restored\n6. Verify saga state = COMPENSATED','Source balance unchanged after compensation, saga in FAILED state with compensation log, customer notified of failure','P0'],
    ['TC-MS-03','Circuit Breaker - Open State','Payment','Chaos','1. Configure circuit breaker: failureThreshold=50%, slidingWindow=10\n2. Inject 6/10 failures in payment gateway\n3. Verify circuit opens on 6th failure\n4. Send new request - verify immediate fallback (no gateway call)\n5. Wait 30s, verify half-open state\n6. Send successful request - verify circuit closes','Circuit opens after threshold, fallback response < 10ms, metrics show state transitions, half-open allows test requests','P0'],
    ['TC-MS-04','Service Mesh mTLS Enforcement','All Services','Security','1. Deploy service without Istio sidecar\n2. Attempt to call Account Service directly\n3. Verify connection refused (no mTLS cert)\n4. Deploy with sidecar, verify successful mTLS handshake\n5. Inspect certificate chain in Jaeger trace\n6. Verify certificate rotation during test','Non-mesh services cannot communicate with mesh services, all inter-service traffic encrypted, cert details visible in traces','P0'],
    ['TC-MS-05','Canary Deployment Validation','Payment','Integration','1. Deploy payment-service-v2 with canary weight 10%\n2. Send 1000 requests\n3. Verify ~100 routed to v2 (check response header x-version)\n4. Verify v2 error rate < 1%\n5. Increase weight to 50%, send 1000 more\n6. Verify ~500 to v2\n7. Promote v2 to 100%','Traffic split matches configured weights within 5% tolerance, no errors during progressive rollout, metrics tracked per version','P1'],
    ['TC-MS-06','Distributed Tracing Propagation','Payment, Account, Fraud, Notification, Audit','Integration','1. Send fund transfer request\n2. Extract trace ID from response header\n3. Query Jaeger API for trace\n4. Verify 5 service spans present\n5. Verify parent-child span relationships correct\n6. Verify timing data accurate\n7. Verify baggage items propagated','Complete trace with all 5 services, no orphaned spans, latency breakdown per service visible, correlation ID matches across all logs','P0'],
    ['TC-MS-07','Kafka Event Ordering','Payment, Account','Integration','1. Publish 100 events for same account (partition key = account_id)\n2. Verify all events land in same Kafka partition\n3. Consumer processes events sequentially\n4. Verify event sequence numbers monotonically increasing\n5. Introduce consumer failure mid-batch\n6. Verify resume from last committed offset','Events processed in exact publish order, no duplicates after consumer restart, offset tracking accurate','P0'],
    ['TC-MS-08','Rate Limiting Per Customer Tier','API Gateway','Performance','1. Authenticate as Basic tier customer\n2. Send 101 requests in 60 seconds\n3. Verify 101st request returns 429 with Retry-After header\n4. Authenticate as Premium tier customer\n5. Send 400 requests in 60 seconds\n6. Verify all 400 succeed\n7. Send 501st request, verify 429','Rate limits enforced per tier, 429 response includes correct Retry-After value, rate limit headers (X-RateLimit-Remaining) present','P0'],
    ['TC-MS-09','Bulkhead Thread Pool Isolation','Payment','Resilience','1. Configure bulkhead: fraud-pool=25 threads, account-pool=50 threads\n2. Inject 5s delay in Fraud Service\n3. Send 30 concurrent requests requiring fraud check\n4. Verify 25 execute, 5 queued/rejected\n5. Simultaneously send account queries\n6. Verify account queries unaffected (different pool)','Fraud pool exhaustion does not impact account operations, bulkhead metrics show pool utilization, rejected requests get proper error','P0'],
    ['TC-MS-10','Health Check and Auto-Recovery','Account','Resilience','1. Scale Account Service to 3 replicas\n2. Kill database connection on replica-2\n3. Verify readiness probe fails for replica-2\n4. Verify Kubernetes removes replica-2 from endpoints\n5. Verify traffic distributed to replica-1 and replica-3\n6. Verify liveness probe triggers restart\n7. Verify replica-2 recovers and rejoins','Zero failed customer requests during recovery, Kubernetes events show proper probe detection, service mesh drains connections gracefully','P0'],
    ['TC-MS-11','Config Change Hot Reload','All Services','Integration','1. Current rate limit: 100 req/min\n2. Update config server: rate limit = 200 req/min\n3. POST /actuator/bus-refresh\n4. Wait 30 seconds\n5. Verify all 20 instances reflect new config\n6. Send 150 requests - verify all pass (new limit)\n7. Verify config change audit logged','All instances updated within 30s, no restart required, config change event published to audit, old config archived','P1'],
    ['TC-MS-12','Secret Rotation Zero Downtime','Account','Security','1. Current DB password: secret-v1 in Vault\n2. Rotate to secret-v2 in Vault\n3. Monitor active database connections\n4. Verify new connections use secret-v2\n5. Verify existing connections on secret-v1 still work (grace period)\n6. After grace period, verify all connections on secret-v2\n7. Revoke secret-v1','Zero connection failures during rotation, Vault audit log shows rotation event, application logs show credential refresh','P0'],
    ['TC-MS-13','gRPC Deadline Propagation Chain','Payment, Account, Fraud','Integration','1. Set client deadline: 5 seconds\n2. Payment Service receives request (remaining: 4.8s)\n3. Payment calls Account Service (deadline: 4.5s)\n4. Account calls Fraud Service (deadline: 4.0s)\n5. Inject 4.5s delay in Fraud Service\n6. Verify DEADLINE_EXCEEDED at Fraud Service\n7. Verify error propagated to client with correct gRPC status','Deadline decreases at each hop, DEADLINE_EXCEEDED returned when time budget exhausted, no hanging requests, proper cleanup at each service','P1'],
    ['TC-MS-14','Saga Idempotency - Duplicate Request','Payment','Integration','1. POST /payments/transfer with X-Idempotency-Key: uuid-123\n2. Verify payment created, saga started\n3. POST same request with same X-Idempotency-Key: uuid-123\n4. Verify 201 returned (not 409)\n5. Verify no duplicate payment created\n6. Verify saga executed only once\n7. Verify same payment_id returned','Idempotent handling prevents duplicate transfers, same response returned for duplicate request, single debit/credit executed','P0'],
    ['TC-MS-15','Blue-Green Deployment Switchover','Payment','Deployment','1. Blue (v1) serving 100% traffic\n2. Deploy Green (v2) - verify not receiving traffic\n3. Run smoke tests against Green directly\n4. Switch routing: Green 100%, Blue 0%\n5. Verify all traffic on v2 (check response headers)\n6. Detect simulated error in v2\n7. Rollback: Blue 100% in < 60 seconds','Zero downtime during switch, rollback completes in < 60s, no in-flight requests lost, connection draining works properly','P1'],
    ['TC-MS-16','Event-Driven Eventual Consistency','Customer, Account, Loan, Notification','E2E','1. Update customer address in Customer Service\n2. Customer Service publishes AddressUpdated event to Kafka\n3. Account Service consumes event, updates local copy\n4. Loan Service consumes event, updates local copy\n5. Notification Service consumes event, sends confirmation\n6. Query all services - verify consistent address\n7. Measure consistency window','All services consistent within 5 seconds, event consumed by all subscribers, no data loss, consumer lag metrics available','P1'],
    ['TC-MS-17','Strangler Fig Legacy Coexistence','API Gateway, Account, Legacy','Migration','1. POST /api/v1/accounts (routed to new Account microservice)\n2. POST /api/v1/legacy/accounts (routed to monolith via ACL)\n3. Verify both return same response schema\n4. Create account via new service\n5. Query via legacy endpoint - verify account visible\n6. Verify anti-corruption layer translates data formats','Both endpoints functional, data synchronized between old and new, ACL handles schema translation, no data inconsistency','P1'],
    ['TC-MS-18','Retry Storm Prevention','Payment, Account','Chaos','1. Take down Account Service\n2. 50 Payment Service instances begin retrying\n3. Verify exponential backoff with jitter applied\n4. Monitor Account Service recovery - verify no thundering herd\n5. Measure retry distribution over time\n6. Verify total retry load < 2x normal load\n7. Verify circuit breaker eventually opens','Retries spread across time window (jitter verified), no thundering herd on recovery, circuit breaker opens before retry storm, metrics show backoff distribution','P0'],
    ['TC-MS-19','Service Mesh Certificate Rotation','All Services','Security','1. Check current certificate expiry (24h validity)\n2. Trigger Istio certificate rotation\n3. Monitor active mTLS connections\n4. Verify new certificates issued to all sidecars\n5. Verify no TLS handshake failures during rotation\n6. Verify old certificates revoked after grace period\n7. Verify certificate chain validates against root CA','Zero handshake failures during rotation, new cert serial numbers in all sidecars, Istio telemetry shows rotation event, no security alerts','P0'],
    ['TC-MS-20','Cross-Service Cache Invalidation','Account, Payment, Loan','Integration','1. Cache account balance in Redis (Account Service)\n2. Cache same balance in Payment Service local cache\n3. Process debit transaction in Account Service\n4. Account Service publishes CacheInvalidation event\n5. Payment Service receives event, invalidates local cache\n6. Next Payment Service query fetches fresh data\n7. Verify stale window < 2 seconds','Cache invalidated across all services within 2s, no stale reads after invalidation event processed, cache miss triggers fresh fetch from source','P1'],
  ];

  return (
    <div>
      {hdr('Microservices Test Cases - Banking Platform')}
      <p style={{ color:C.muted, fontSize:13 }}>20 detailed test cases covering sagas, circuit breakers, service mesh, distributed tracing, event-driven flows, and deployment strategies.</p>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead>
            <tr>
              {['TC-ID','Title','Service(s)','Type','Steps','Expected Result','Pri'].map((h,i) => (
                <th key={i} style={{ background:'rgba(78,204,163,0.15)', color:C.accent, padding:'10px 8px', textAlign:'left', borderBottom:'2px solid ' + C.border, whiteSpace:'nowrap', position:'sticky', top:0 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cases.map((r,ri) => (
              <tr key={ri} style={{ borderBottom:'1px solid ' + C.border }}>
                <td style={{ padding:8, color:C.accent, fontWeight:700, whiteSpace:'nowrap' }}>{r[0]}</td>
                <td style={{ padding:8, color:C.header, fontWeight:600, minWidth:180 }}>{r[1]}</td>
                <td style={{ padding:8, color:C.text, fontSize:11 }}>{r[2]}</td>
                <td style={{ padding:8 }}>{badge(r[3], r[3]==='E2E'?C.info:r[3]==='Chaos'?C.danger:r[3]==='Security'?C.warn:r[3]==='Performance'?C.warn:r[3]==='Resilience'?C.danger:C.success)}</td>
                <td style={{ padding:8, color:C.text, whiteSpace:'pre-line', minWidth:280, fontSize:11 }}>{r[4]}</td>
                <td style={{ padding:8, color:C.text, fontSize:11, minWidth:220 }}>{r[5]}</td>
                <td style={{ padding:8 }}>{badge(r[6], r[6]==='P0'?C.danger:r[6]==='P1'?C.warn:C.info)}</td>
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
      {hdr('C4 Model - Banking Microservices Platform')}

      {hdr('Level 1: System Context Diagram')}
      {pre(`
+================================================================================+
|                     LEVEL 1: SYSTEM CONTEXT                                    |
+================================================================================+
|                                                                                |
|                         +---------------------------+                          |
|                         |   BANKING MICROSERVICES   |                          |
|                         |       PLATFORM            |                          |
|                         |                           |                          |
|                         | Provides digital banking  |                          |
|                         | services: accounts,       |                          |
|                         | payments, loans, fraud     |                          |
|                         | detection, notifications   |                          |
|                         +-----+-----+-----+---------+                          |
|                               |     |     |                                    |
|        +----------------------+     |     +---------------------+              |
|        |                  +---------+----------+                |              |
|        v                  v                    v                v              |
| +--------------+  +--------------+  +----------------+  +--------------+      |
| | Retail       |  | Corporate    |  | Partner Banks  |  | Internal     |      |
| | Customers    |  | Customers    |  | (Open Banking  |  | Staff        |      |
| |              |  |              |  |  PSD2 APIs)    |  | (Operations) |      |
| | Mobile App,  |  | Web Portal,  |  | REST APIs,     |  | Admin Portal,|      |
| | Internet     |  | API Direct   |  | ISO 20022      |  | Reports      |      |
| | Banking      |  |              |  |                |  |              |      |
| +--------------+  +--------------+  +----------------+  +--------------+      |
|                                                                                |
|        +----------------------+     +---------------------+                    |
|        v                      v     v                     v                    |
| +--------------+  +----------------+  +------------------+                     |
| | ATM Network  |  | Regulators     |  | Payment Networks |                     |
| | (ISO 8583)   |  | (RBI, SEBI)    |  | (NPCI, SWIFT,    |                     |
| |              |  | Audit Reports, |  |  Visa, Master)   |                     |
| |              |  | Compliance     |  |                  |                     |
| +--------------+  +----------------+  +------------------+                     |
|                                                                                |
+================================================================================+
`)}

      {hdr('Level 2: Container Diagram')}
      {pre(`
+================================================================================+
|                     LEVEL 2: CONTAINER DIAGRAM                                 |
+================================================================================+
|                                                                                |
|  +------------------------------------------------------------------------+   |
|  |                    API GATEWAY (Kong)                                   |   |
|  |  Auth | Rate Limit | Routing | SSL | Versioning | WAF                  |   |
|  +---+--------+--------+--------+--------+--------+--------+-------------+   |
|      |        |        |        |        |        |        |                  |
|  +---v----+ +-v------+ +v------+ +v------+ +v------+ +v------+ +v---------+  |
|  |Account | |Payment | |Loan   | |Custom | |Notify | |Fraud  | |Audit     |  |
|  |Service | |Service | |Service| |er Svc | |Svc    | |Service| |Service   |  |
|  |        | |        | |       | |       | |       | |       | |          |  |
|  |Java    | |Java    | |Node.js| |Java   | |Go     | |Python | |Java      |  |
|  |Spring  | |Spring  | |Express| |Spring | |Fiber  | |FastAPI| |Spring    |  |
|  |Boot    | |Boot    | |       | |Boot   | |       | |       | |Boot      |  |
|  |        | |        | |       | |       | |       | |       | |          |  |
|  |Postgre | |Postgre | |Mongo  | |Postgre| |Redis  | |Neo4j  | |Elastic   |  |
|  |SQL     | |SQL     | |DB     | |SQL    | |       | |       | |search    |  |
|  +--------+ +--------+ +-------+ +-------+ +-------+ +-------+ +----------+  |
|      |        |        |        |        |        |        |                  |
|  +---v--------v--------v--------v--------v--------v--------v--------------+   |
|  |                    EVENT BUS (Apache Kafka)                             |   |
|  |  account.events | payment.events | loan.events | fraud.alerts          |   |
|  +------------------------------------------------------------------------+   |
|                                                                                |
|  +------------------+ +------------------+ +------------------+               |
|  | Monitoring       | | Service Registry | | Config + Secrets |               |
|  | Prometheus       | | Consul           | | Spring Config    |               |
|  | Grafana          | | DNS Service      | | Vault            |               |
|  | Jaeger           | | Health Checks    | | Git Backend      |               |
|  +------------------+ +------------------+ +------------------+               |
|                                                                                |
+================================================================================+
`)}

      {hdr('Level 3: Component Diagram (Payment Service)')}
      {pre(`
+================================================================================+
|              LEVEL 3: PAYMENT SERVICE - COMPONENTS                             |
+================================================================================+
|                                                                                |
|  +------------------------------------------------------------------------+   |
|  |                      PAYMENT SERVICE (Spring Boot)                      |   |
|  |                                                                        |   |
|  |  +---------------------+     +------------------------+                |   |
|  |  | PaymentController   |     | HealthController       |                |   |
|  |  | (REST API)          |     | /health, /ready, /live |                |   |
|  |  | POST /transfer      |     +------------------------+                |   |
|  |  | GET  /payments/{id} |                                               |   |
|  |  | GET  /payments      |                                               |   |
|  |  +----------+----------+                                               |   |
|  |             |                                                          |   |
|  |  +----------v----------+     +------------------------+                |   |
|  |  | PaymentProcessor    |---->| IdempotencyService     |                |   |
|  |  | (Business Logic)    |     | (Dedup via Redis)      |                |   |
|  |  | Validate, Enrich    |     +------------------------+                |   |
|  |  +----------+----------+                                               |   |
|  |             |                                                          |   |
|  |  +----------v----------+     +------------------------+                |   |
|  |  | SagaOrchestrator    |---->| SagaStateRepository    |                |   |
|  |  | (Saga Coordination) |     | (PostgreSQL)           |                |   |
|  |  | Steps, Compensate   |     +------------------------+                |   |
|  |  +--+--------+--------++                                               |   |
|  |     |        |        |                                                |   |
|  |  +--v---+ +--v----+ +-v---------+    +------------------------+       |   |
|  |  |Acct  | |Fraud  | |Notify     |    | EventPublisher         |       |   |
|  |  |Client| |Client | |Client     |    | (Kafka Producer)       |       |   |
|  |  |(gRPC)| |(gRPC) | |(REST)     |    | payment.initiated      |       |   |
|  |  +------+ +-------+ +-----------+    | payment.completed      |       |   |
|  |                                       | payment.failed         |       |   |
|  |  +---------------------+             +------------------------+       |   |
|  |  | PaymentRepository   |                                              |   |
|  |  | (PostgreSQL)        |             +------------------------+       |   |
|  |  | payments table      |             | MetricsCollector       |       |   |
|  |  | payment_events      |             | (Micrometer/Prometheus)|       |   |
|  |  +---------------------+             +------------------------+       |   |
|  |                                                                        |   |
|  +------------------------------------------------------------------------+   |
|                                                                                |
+================================================================================+
`)}

      {hdr('Level 4: Code Diagram (Key Classes)')}
      {pre(`
+================================================================================+
|              LEVEL 4: KEY CLASS STRUCTURES                                     |
+================================================================================+

class PaymentController {
    - paymentProcessor: PaymentProcessor
    + initiateTransfer(TransferRequest): ResponseEntity<PaymentResponse>
    + getPayment(paymentId: UUID): ResponseEntity<PaymentDetail>
    + listPayments(accountId: String, offset: int, limit: int): Page<PaymentSummary>
}

class PaymentProcessor {
    - sagaOrchestrator: SagaOrchestrator
    - idempotencyService: IdempotencyService
    - paymentRepository: PaymentRepository
    - eventPublisher: EventPublisher
    + processTransfer(request: TransferRequest): PaymentResult
    - validateTransfer(request: TransferRequest): ValidationResult
    - enrichPayment(payment: Payment): Payment
}

class SagaOrchestrator {
    - sagaStateRepo: SagaStateRepository
    - accountClient: AccountServiceClient
    - fraudClient: FraudServiceClient
    - notifyClient: NotificationClient
    - steps: List<SagaStep>
    + executeSaga(sagaId: UUID, payment: Payment): SagaResult
    + compensate(sagaId: UUID, fromStep: int): CompensationResult
    - executeStep(step: SagaStep, context: SagaContext): StepResult
}

interface SagaStep {
    + execute(context: SagaContext): StepResult
    + compensate(context: SagaContext): StepResult
    + getName(): String
    + getTimeout(): Duration
}

class DebitAccountStep implements SagaStep {
    - accountClient: AccountServiceClient
    + execute(ctx): debitAccount(ctx.fromAccount, ctx.amount)
    + compensate(ctx): creditAccount(ctx.fromAccount, ctx.amount)
}

class CreditAccountStep implements SagaStep {
    - accountClient: AccountServiceClient
    + execute(ctx): creditAccount(ctx.toAccount, ctx.amount)
    + compensate(ctx): debitAccount(ctx.toAccount, ctx.amount)
}

class EventPublisher {
    - kafkaTemplate: KafkaTemplate<String, CloudEvent>
    + publish(topic: String, event: CloudEvent): CompletableFuture
    + publishWithKey(topic: String, key: String, event: CloudEvent): CompletableFuture
}
`)}
    </div>
  );
}

function TechStackTab() {
  const categories = [
    { name:'Runtime & Frameworks', items:[
      { tech:'Java 17 + Spring Boot 3.x', use:'Account, Payment, Customer, Audit services', notes:'Primary framework, strong ecosystem for banking' },
      { tech:'Node.js 20 + Express', use:'Loan Service', notes:'Flexible schema handling with MongoDB driver' },
      { tech:'Go 1.21 + Fiber', use:'Notification Service', notes:'High concurrency for message dispatch' },
      { tech:'Python 3.11 + FastAPI', use:'Fraud Detection Service', notes:'ML model serving, scikit-learn/TensorFlow integration' },
    ]},
    { name:'Service Mesh & Networking', items:[
      { tech:'Istio 1.20', use:'Service mesh control plane', notes:'mTLS, traffic management, fault injection, observability' },
      { tech:'Envoy Proxy', use:'Sidecar proxy (data plane)', notes:'L7 proxy, circuit breaking, load balancing, retries' },
      { tech:'Linkerd (Alternative)', use:'Lightweight service mesh', notes:'Lower resource footprint, simpler operations' },
    ]},
    { name:'API Gateway', items:[
      { tech:'Kong Gateway', use:'External API management', notes:'Rate limiting, auth, routing, plugins ecosystem' },
      { tech:'AWS API Gateway', use:'Cloud-native alternative', notes:'Managed service, Lambda integration, WAF' },
      { tech:'Envoy (as gateway)', use:'Unified gateway + mesh', notes:'Single technology for edge and internal' },
    ]},
    { name:'Resilience', items:[
      { tech:'Resilience4j', use:'Circuit breaker, retry, bulkhead, rate limiter', notes:'Lightweight, functional, Spring Boot integration' },
      { tech:'Hystrix (Legacy)', use:'Circuit breaker (deprecated)', notes:'Netflix OSS, replaced by Resilience4j' },
      { tech:'Polly (.NET)', use:'Resilience for .NET services', notes:'If any .NET microservices exist' },
    ]},
    { name:'Messaging & Events', items:[
      { tech:'Apache Kafka 3.6', use:'Event bus, event sourcing', notes:'High throughput, partitioning, exactly-once semantics' },
      { tech:'Confluent Schema Registry', use:'Event schema management', notes:'Avro/Protobuf schemas, compatibility checks' },
      { tech:'RabbitMQ', use:'Task queues, notifications', notes:'Simpler routing, dead letter queues, priority queues' },
    ]},
    { name:'Service Discovery & Config', items:[
      { tech:'HashiCorp Consul', use:'Service registry, health checks', notes:'DNS interface, KV store, multi-DC support' },
      { tech:'Spring Cloud Config', use:'Centralized configuration', notes:'Git-backed, environment profiles, encryption' },
      { tech:'HashiCorp Vault', use:'Secret management', notes:'Dynamic secrets, PKI, encryption as a service' },
      { tech:'Netflix Eureka (Alternative)', use:'Service registry', notes:'Spring Cloud native, simpler setup' },
    ]},
    { name:'Databases', items:[
      { tech:'PostgreSQL 16', use:'Account, Payment, Customer services', notes:'ACID, JSONB, partitioning, row-level security' },
      { tech:'MongoDB 7.0', use:'Loan Service', notes:'Flexible schema for diverse loan products' },
      { tech:'Redis 7.2', use:'Distributed cache, notification queue', notes:'Cluster mode, pub/sub, streams' },
      { tech:'Neo4j 5.x', use:'Fraud Service (graph analysis)', notes:'Cypher queries, graph algorithms, fraud rings' },
      { tech:'Elasticsearch 8.x', use:'Audit Service, full-text search', notes:'Time-series data, aggregations, Kibana' },
    ]},
    { name:'Observability', items:[
      { tech:'Prometheus', use:'Metrics collection', notes:'Pull-based, PromQL, alerting rules' },
      { tech:'Grafana', use:'Dashboards, visualization', notes:'Multi-datasource, alerting, annotations' },
      { tech:'Jaeger', use:'Distributed tracing', notes:'OpenTelemetry compatible, trace analysis' },
      { tech:'ELK Stack', use:'Centralized logging', notes:'Elasticsearch + Logstash + Kibana, Fluentd alternative' },
      { tech:'OpenTelemetry', use:'Telemetry instrumentation', notes:'Vendor-neutral, traces + metrics + logs' },
    ]},
    { name:'CI/CD & GitOps', items:[
      { tech:'ArgoCD', use:'GitOps continuous delivery', notes:'Declarative, Kubernetes-native, auto-sync' },
      { tech:'Flux', use:'GitOps alternative', notes:'CNCF project, Helm controller, image automation' },
      { tech:'Tekton', use:'CI pipelines', notes:'Kubernetes-native, reusable tasks, triggers' },
      { tech:'GitHub Actions', use:'CI pipeline', notes:'PR checks, linting, testing, security scans' },
    ]},
    { name:'Container & Orchestration', items:[
      { tech:'Docker', use:'Container runtime', notes:'Multi-stage builds, non-root users, health checks' },
      { tech:'Kubernetes 1.28', use:'Container orchestration', notes:'HPA, PDB, network policies, RBAC' },
      { tech:'Helm 3', use:'Package management', notes:'Charts per service, values per environment' },
      { tech:'Kustomize', use:'Config overlay', notes:'Environment-specific patches without templating' },
    ]},
  ];

  return (
    <div>
      {hdr('Technology Stack - Banking Microservices Platform')}
      {categories.map((cat,ci) => (
        <div key={ci}>
          <h4 style={{ color:C.accent, marginTop:20, marginBottom:8 }}>{cat.name}</h4>
          {tbl(['Technology','Use Case','Notes'], cat.items.map(it => [it.tech, it.use, it.notes]))}
        </div>
      ))}
    </div>
  );
}

function SadTab() {
  const decisions = [
    { id:'ADR-01', title:'Saga Pattern over Two-Phase Commit (2PC)', status:'Accepted', context:'Banking transactions span multiple services (Account, Payment, Notification). Need distributed transaction coordination.', decision:'Use Saga pattern (orchestration) instead of 2PC for distributed transactions.', rationale:'2PC requires locking resources across services, creating tight coupling and reducing availability. Saga allows each service to commit locally and publish events. Compensation logic handles failures. Better fault tolerance and scalability. Trade-off: eventual consistency instead of strong consistency.', consequences:'Must implement compensation logic for each saga step. Eventual consistency requires idempotent consumers. More complex error handling but better availability.' },
    { id:'ADR-02', title:'CQRS for Account Balance Queries', status:'Accepted', context:'Account Service handles both high-volume read queries (balance checks, statements) and write operations (debits, credits). Read:write ratio is 100:1.', decision:'Implement CQRS with separate read and write models for Account Service.', rationale:'Write model uses normalized PostgreSQL with ACID transactions. Read model uses denormalized views (or Redis) optimized for balance queries. Reduces contention, allows independent scaling of read and write paths. Event sourcing feeds the read model via Kafka events.', consequences:'Increased complexity with two data models. Read model may lag behind write model (eventual consistency). Need event replay capability for read model rebuild.' },
    { id:'ADR-03', title:'Kafka over RabbitMQ for Event Bus', status:'Accepted', context:'Need event bus for inter-service communication. Requirements: high throughput, event ordering, event replay, long retention for audit.', decision:'Use Apache Kafka as the primary event bus.', rationale:'Kafka provides: ordered events per partition (partition by account_id), log compaction for event sourcing, high throughput (millions of events/sec), consumer groups for parallel processing, configurable retention for regulatory compliance. RabbitMQ better for task queues but lacks log-based architecture needed for event sourcing.', consequences:'Higher operational complexity than RabbitMQ. Need Schema Registry for schema evolution. Consumer offset management required. Use RabbitMQ for simple notification queues where ordering is not critical.' },
    { id:'ADR-04', title:'Database Per Service over Shared Database', status:'Accepted', context:'Monolithic core banking uses single Oracle database shared by all modules. Migration to microservices requires data strategy.', decision:'Each microservice owns its database. No direct cross-service database access.', rationale:'Shared database creates tight coupling (schema changes affect all services), prevents independent deployment, limits technology choice (stuck with one DB). Database per service enables: polyglot persistence (PostgreSQL for ACID, MongoDB for flexibility, Neo4j for graph), independent scaling, schema evolution per service.', consequences:'No cross-service JOINs. Data duplication across services. Need eventual consistency via events. Cross-service queries require API composition or CQRS read models. More operational overhead managing multiple databases.' },
    { id:'ADR-05', title:'Istio over Linkerd for Service Mesh', status:'Accepted', context:'Need service mesh for mTLS, traffic management, observability across 7+ microservices in Kubernetes.', decision:'Use Istio as the service mesh.', rationale:'Istio provides: comprehensive traffic management (canary, blue-green, fault injection), strong mTLS enforcement, detailed telemetry integration with Jaeger/Prometheus, policy enforcement via OPA. Linkerd is simpler and lighter but lacks advanced traffic management features needed for canary deployments and fault injection testing.', consequences:'Higher resource overhead (Envoy sidecars ~50MB per pod). Steeper learning curve. More configuration complexity. But provides enterprise-grade features needed for banking compliance and deployment strategies.' },
  ];

  return (
    <div>
      {hdr('Software Architecture Decisions (SAD)')}

      {decisions.map(d => (
        <div key={d.id} style={{ background:C.card, borderRadius:8, padding:16, border:'1px solid ' + C.border, marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ color:C.accent, fontWeight:700 }}>{d.id}: {d.title}</span>
            {badge(d.status, C.success)}
          </div>
          <div style={{ marginBottom:8 }}>
            <strong style={{ color:C.warn, fontSize:12 }}>Context:</strong>
            <p style={{ color:C.text, fontSize:13, margin:'4px 0' }}>{d.context}</p>
          </div>
          <div style={{ marginBottom:8 }}>
            <strong style={{ color:C.info, fontSize:12 }}>Decision:</strong>
            <p style={{ color:C.text, fontSize:13, margin:'4px 0' }}>{d.decision}</p>
          </div>
          <div style={{ marginBottom:8 }}>
            <strong style={{ color:C.accent, fontSize:12 }}>Rationale:</strong>
            <p style={{ color:C.text, fontSize:13, margin:'4px 0' }}>{d.rationale}</p>
          </div>
          <div>
            <strong style={{ color:C.danger, fontSize:12 }}>Consequences:</strong>
            <p style={{ color:C.text, fontSize:13, margin:'4px 0' }}>{d.consequences}</p>
          </div>
        </div>
      ))}

      {hdr('Trade-off Analysis')}
      {tbl(['Trade-off','Option A','Option B','Decision','Justification'], [
        ['Consistency','Strong (2PC)','Eventual (Saga)','Eventual','Higher availability, better fault tolerance for distributed banking'],
        ['Communication','Synchronous (REST/gRPC)','Asynchronous (Kafka)','Hybrid','Sync for queries, async for commands and events'],
        ['Data Ownership','Shared Database','Database Per Service','DB Per Service','Team autonomy, polyglot persistence, independent scaling'],
        ['Service Mesh','Istio (feature-rich)','Linkerd (lightweight)','Istio','Need advanced traffic management for canary/blue-green'],
        ['Config','Env Variables','Config Server','Config Server','Centralized management, hot reload, audit trail'],
        ['Secrets','Files/Env Vars','Vault','Vault','Dynamic secrets, rotation, PKI, audit logging'],
        ['Tracing','Zipkin','Jaeger','Jaeger','Better UI, OpenTelemetry native, scalable storage'],
      ])}

      {hdr('Failure Modes and Mitigations')}
      {tbl(['Failure Mode','Impact','Mitigation','Recovery'], [
        ['Cascading Failure','One slow service brings down entire chain','Circuit breaker (Resilience4j), bulkhead isolation, timeouts on all calls','Circuit opens, fallback response, auto-recovery on half-open'],
        ['Split Brain','Service registry has inconsistent view','Consul consensus (Raft), health check TTL, anti-entropy sync','Automatic leader election, stale reads tolerated for discovery'],
        ['Network Partition','Services cannot communicate across zones','Multi-zone deployment, retry with backoff, local caching, async fallback','Partition heals, Kafka replays missed events, eventual consistency'],
        ['Kafka Broker Failure','Events not published/consumed','Replication factor 3, ISR (in-sync replicas), producer acks=all','Kafka auto-rebalances partitions, consumers resume from offset'],
        ['Database Failure','Service data unavailable','Read replicas, connection pooling, circuit breaker on DB calls','Failover to replica, reconnect with backoff, alert operations'],
        ['Saga Stuck','Transaction in intermediate state','Saga timeout (5 min), dead letter queue, manual compensation API','Timeout triggers compensation, operations dashboard for manual intervention'],
      ])}

      {hdr('Migration Strategy - Strangler Fig')}
      {pre(`
STRANGLER FIG MIGRATION PHASES
================================

Phase 1 (Q1 2026): Account Service
  - Extract account CRUD from monolith
  - API Gateway routes /api/v1/accounts to new service
  - Legacy /api/v1/legacy/accounts still routes to monolith
  - Anti-corruption layer translates between old and new schemas
  - Data sync: CDC (Change Data Capture) from Oracle to PostgreSQL

Phase 2 (Q2 2026): Payment Service
  - Extract payment processing
  - Implement saga pattern for fund transfers
  - Kafka event bus for payment events
  - Dual-write during transition (write to both old and new)

Phase 3 (Q3 2026): Customer + Notification Services
  - Extract customer onboarding and KYC
  - Notification service as greenfield microservice
  - Event-driven customer updates across services

Phase 4 (Q4 2026): Loan + Fraud Services
  - Loan service with MongoDB (flexible schema)
  - Fraud service with Neo4j (graph analysis)
  - ML model serving via FastAPI

Phase 5 (Q1 2027): Decommission Monolith
  - All traffic routed to microservices
  - Monolith in read-only mode for data verification
  - Final data reconciliation
  - Monolith shutdown

Key Principle: At every phase, both old and new coexist.
               No big-bang cutover. Incremental and reversible.
`)}
    </div>
  );
}

function FlowchartTab() {
  return (
    <div>
      {hdr('Fund Transfer Saga - Flowchart')}
      {pre(`
+==============================================================================+
|              FUND TRANSFER SAGA - COMPLETE FLOWCHART                         |
+==============================================================================+

                          +-------------------+
                          |  Customer Request  |
                          |  (Transfer Funds)  |
                          +--------+----------+
                                   |
                                   v
                          +-------------------+
                          |   API GATEWAY     |
                          | - Authenticate    |
                          | - Rate Limit      |
                          | - Route Request   |
                          +--------+----------+
                                   |
                                   v
                          +-------------------+
                          | PAYMENT SERVICE   |
                          | - Check Idempotency|
                          +--------+----------+
                                   |
                          +--------v----------+
                          | Duplicate Request? |
                          +---+------------+--+
                              |            |
                          YES |            | NO
                              v            v
                    +-----------+   +------+--------+
                    | Return     |   | CREATE SAGA   |
                    | Cached     |   | State=STARTED |
                    | Response   |   +------+--------+
                    +-----------+          |
                                           v
                                  +--------+---------+
                                  | VALIDATE TRANSFER |
                                  | - From/To valid?  |
                                  | - Amount > 0?     |
                                  | - Sufficient bal?  |
                                  +---+----------+----+
                                      |          |
                                  VALID       INVALID
                                      |          |
                                      v          v
                              +-------+--+  +---+----------+
                              | DEBIT    |  | REJECT       |
                              | SOURCE   |  | Saga=FAILED  |
                              | ACCOUNT  |  | Notify Error |
                              +----+-----+  +--------------+
                                   |
                              +----v---------+
                              | Debit OK?    |
                              +---+------+---+
                                  |      |
                               YES|      |NO
                                  |      |
                                  v      v
                          +-------+--+  ++-------------+
                          | CREDIT   |  | DEBIT FAILED |
                          | DEST     |  | Saga=FAILED  |
                          | ACCOUNT  |  | Notify Error |
                          +----+-----+  +--------------+
                               |
                          +----v---------+
                          | Credit OK?   |
                          +---+------+---+
                              |      |
                           YES|      |NO
                              |      |
                              v      v
                      +-------+--+ ++------------------+
                      | SEND     | | CREDIT FAILED     |
                      | NOTIFY   | |                    |
                      | TO CUST  | | COMPENSATE:        |
                      +----+-----+ | Reverse Debit      |
                           |       | (Credit back source)|
                           v       +----+---------------+
                      +----+-----+      |
                      | LOG TO   |      v
                      | AUDIT    | +----+---------------+
                      | SERVICE  | | COMPENSATION OK?   |
                      +----+-----+ +---+-------+--------+
                           |           |       |
                           v        YES|       |NO
                      +----+--------+  v       v
                      | COMPLETE    | ++---+ +-+----------+
                      | SAGA        | |SAGA| |MANUAL      |
                      |             | |COMP| |INTERVENTION|
                      | State=      | |LETE| |REQUIRED    |
                      | COMPLETED   | +----+ +------------+
                      +-------------+
`)}

      {hdr('Circuit Breaker State Machine')}
      {pre(`
+==============================================================================+
|              CIRCUIT BREAKER STATE MACHINE                                   |
+==============================================================================+

              +--------------------------------------------+
              |                                            |
              v                                            |
     +--------+--------+                                   |
     |     CLOSED      |  (Normal operation)               |
     |                 |                                   |
     | - Requests pass |                                   |
     |   through to    |                                   |
     |   downstream    |                                   |
     | - Track success/|                                   |
     |   failure rate  |                                   |
     +--------+--------+                                   |
              |                                            |
              | Failure rate > threshold                   |
              | (e.g., > 50% in sliding window)            |
              |                                            |
              v                                            |
     +--------+--------+                         +--------+--------+
     |      OPEN       |   wait duration expires  |   HALF-OPEN    |
     |                 +------------------------->|                 |
     | - All requests  |                          | - Allow N test  |
     |   fail fast     |                          |   requests      |
     | - Return        |                          | - Monitor       |
     |   fallback      |                          |   success rate  |
     | - No downstream |                          +---+--------+----+
     |   calls         |                              |        |
     +--------+--------+                              |        |
              ^                                    SUCCESS   FAILURE
              |                                       |        |
              |              +------------------------+        |
              |              |                                 |
              |              v                                 |
              |     +--------+--------+                        |
              |     |  Close Circuit  |                        |
              +-----+  (Resume Normal)|                        |
                    |  Operations     |                        |
                    +-----------------+                        |
                                                               |
              +------------------------------------------------+
              |
              v
     +--------+--------+
     | Re-open Circuit |
     | (Still Failing) |
     | Reset wait timer|
     +-----------------+
`)}

      {hdr('Service Mesh Traffic Routing - Canary Deployment')}
      {pre(`
+==============================================================================+
|              CANARY DEPLOYMENT FLOW                                          |
+==============================================================================+

  Incoming Request
        |
        v
  +-----+------+
  | API Gateway |
  +-----+------+
        |
        v
  +-----+---------+
  | Istio Ingress |
  | Gateway       |
  +-----+---------+
        |
        v
  +-----+------------------+
  | VirtualService Router  |
  |                        |
  | canary-header match?   +--YES--> +-------------------+
  |                        |         | Payment Svc v2    |
  | weight-based split:    |         | (Canary - 10%)    |
  |   90% --> v1           |         +-------------------+
  |   10% --> v2           |
  +---+----------------+---+
      |                |
      v                v
  +---+-------+  +-----+-------+
  | Payment   |  | Payment     |
  | Svc v1    |  | Svc v2      |
  | (Stable   |  | (Canary     |
  |  90%)     |  |  10%)       |
  +-----------+  +------+------+
                        |
                        v
                 +------+------+
                 | Monitor     |
                 | - Error rate|
                 | - Latency   |
                 | - Success % |
                 +------+------+
                        |
              +---------+---------+
              |                   |
           HEALTHY            UNHEALTHY
              |                   |
              v                   v
      +-------+------+   +-------+------+
      | Promote v2   |   | Rollback     |
      | 10%->50%     |   | Route 100%   |
      | ->100%       |   | back to v1   |
      +--------------+   +--------------+
`)}
    </div>
  );
}

function SequenceDiagramTab() {
  return (
    <div>
      {hdr('Fund Transfer Saga - Sequence Diagram (Happy Path)')}
      {pre(`
+====================================================================================+
|              SEQUENCE DIAGRAM: FUND TRANSFER SAGA (HAPPY PATH)                     |
+====================================================================================+

Customer    API Gateway   Payment Svc   Account Svc   Account Svc   Kafka       Notify Svc  Audit Svc
  |              |             |          (Source)      (Dest)         |             |           |
  | POST /transfer             |             |             |          |             |           |
  |------------->|             |             |             |          |             |           |
  |              | Auth + Rate |             |             |          |             |           |
  |              | Limit Check |             |             |          |             |           |
  |              |------------>|             |             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | Create Saga |             |          |             |           |
  |              |             | State=START |             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | Check       |             |          |             |           |
  |              |             | Idempotency |             |          |             |           |
  |              |             | Key (Redis) |             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | gRPC: DebitAccount        |          |             |           |
  |              |             |------------>|             |          |             |           |
  |              |             |             | BEGIN TX     |          |             |           |
  |              |             |             | UPDATE bal   |          |             |           |
  |              |             |             | INSERT event |          |             |           |
  |              |             |             | COMMIT       |          |             |           |
  |              |             |<------------|             |          |             |           |
  |              |             | DebitResult |             |          |             |           |
  |              |             | (SUCCESS)   |             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | Update Saga |             |          |             |           |
  |              |             | State=DEBIT |             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | gRPC: CreditAccount       |          |             |           |
  |              |             |-------------------------->|          |             |           |
  |              |             |             |             | BEGIN TX |             |           |
  |              |             |             |             | UPDATE   |             |           |
  |              |             |             |             | INSERT   |             |           |
  |              |             |             |             | COMMIT   |             |           |
  |              |             |<--------------------------|          |             |           |
  |              |             | CreditResult|             |          |             |           |
  |              |             | (SUCCESS)   |             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | Update Saga |             |          |             |           |
  |              |             | State=CREDIT|             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | Publish: payment.completed|          |             |           |
  |              |             |-------------------------------------->             |           |
  |              |             |             |             |          |             |           |
  |              |             |             |             |          | Consume     |           |
  |              |             |             |             |          | event       |           |
  |              |             |             |             |          |------------>|           |
  |              |             |             |             |          |             | Send SMS  |
  |              |             |             |             |          |             | Send Email|
  |              |             |             |             |          |             |           |
  |              |             |             |             |          | Consume     |           |
  |              |             |             |             |          | event       |           |
  |              |             |             |             |          |------------------------->
  |              |             |             |             |          |             |  Log TX   |
  |              |             |             |             |          |             |  to ES    |
  |              |             |             |             |          |             |           |
  |              |             | Update Saga |             |          |             |           |
  |              |             | State=DONE  |             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |<------------|             |             |          |             |           |
  |              | 201 Created |             |             |          |             |           |
  |              | sagaId, status             |             |          |             |           |
  |<-------------|             |             |             |          |             |           |
  | Transfer     |             |             |             |          |             |           |
  | Successful   |             |             |             |          |             |           |
  |              |             |             |             |          |             |           |
`)}

      {hdr('Fund Transfer Saga - Sequence Diagram (Compensation Flow)')}
      {pre(`
+====================================================================================+
|         SEQUENCE DIAGRAM: FUND TRANSFER SAGA (CREDIT FAILURE + COMPENSATION)       |
+====================================================================================+

Customer    API Gateway   Payment Svc   Account Svc   Account Svc   Kafka       Notify Svc  Audit Svc
  |              |             |          (Source)      (Dest)         |             |           |
  | POST /transfer             |             |             |          |             |           |
  |------------->|             |             |             |          |             |           |
  |              |------------>|             |             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | Create Saga |             |          |             |           |
  |              |             | State=START |             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | gRPC: DebitAccount        |          |             |           |
  |              |             |------------>|             |          |             |           |
  |              |             |             | Debit OK    |          |             |           |
  |              |             |<------------|             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | gRPC: CreditAccount       |          |             |           |
  |              |             |-------------------------->|          |             |           |
  |              |             |             |             |          |             |           |
  |              |             |             |     ACCOUNT_FROZEN     |             |           |
  |              |             |             |     ERROR   |          |             |           |
  |              |             |<-----------XXXXX---------|          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | !!CREDIT FAILED!!         |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | Update Saga |             |          |             |           |
  |              |             | State=      |             |          |             |           |
  |              |             | COMPENSATING|             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | COMPENSATE: |             |          |             |           |
  |              |             | gRPC: CreditAccount (Reverse Debit)  |             |           |
  |              |             |------------>|             |          |             |           |
  |              |             |             | Credit back |          |             |           |
  |              |             |             | source acct |          |             |           |
  |              |             |             | (reverse)   |          |             |           |
  |              |             |<------------|             |          |             |           |
  |              |             | Reversal OK |             |          |             |           |
  |              |             |             |             |          |             |           |
  |              |             | Publish: payment.failed   |          |             |           |
  |              |             |-------------------------------------->             |           |
  |              |             |             |             |          |             |           |
  |              |             |             |             |          | Consume     |           |
  |              |             |             |             |          |------------>|           |
  |              |             |             |             |          |             | Send      |
  |              |             |             |             |          |             | Failure   |
  |              |             |             |             |          |             | Alert     |
  |              |             |             |             |          |             |           |
  |              |             |             |             |          | Consume     |           |
  |              |             |             |             |          |------------------------->
  |              |             |             |             |          |             |  Log      |
  |              |             |             |             |          |             |  Failed   |
  |              |             |             |             |          |             |  TX +     |
  |              |             |             |             |          |             |  Compen-  |
  |              |             |             |             |          |             |  sation   |
  |              |             |             |             |          |             |           |
  |              |             | Update Saga |             |          |             |           |
  |              |             | State=FAILED|             |          |             |           |
  |              |             | (Compensated)|            |          |             |           |
  |              |             |             |             |          |             |           |
  |              |<------------|             |             |          |             |           |
  |              | 200 OK      |             |             |          |             |           |
  |              | status:FAILED             |             |          |             |           |
  |              | reason:DEST_ACCOUNT_FROZEN |             |          |             |           |
  |<-------------|             |             |             |          |             |           |
  | Transfer     |             |             |             |          |             |           |
  | Failed -     |             |             |             |          |             |           |
  | Dest Frozen  |             |             |             |          |             |           |
  |              |             |             |             |          |             |           |
`)}

      {hdr('Circuit Breaker Interaction Sequence')}
      {pre(`
+====================================================================================+
|         SEQUENCE DIAGRAM: CIRCUIT BREAKER BEHAVIOR                                 |
+====================================================================================+

Payment Svc   Circuit Breaker   Payment Gateway    Metrics
    |              |                  |                |
    | call()       |                  |                |
    |------------->|                  |                |
    |              | state=CLOSED     |                |
    |              | forward request  |                |
    |              |----------------->|                |
    |              |                  | 200 OK         |
    |              |<-----------------|                |
    |              | record(SUCCESS)  |                |
    |<-------------|                  |                |
    | response     |                  |                |
    |              |                  |                |
    |  ... (multiple successful calls) ...             |
    |              |                  |                |
    | call()       |                  |                |
    |------------->|                  |                |
    |              |----------------->|                |
    |              |                  | TIMEOUT (3s)   |
    |              |<------XXXXX------|                |
    |              | record(FAILURE)  |                |
    |              |--------------------------------------> failure_count++
    |<-------------|                  |                |
    | timeout error|                  |                |
    |              |                  |                |
    |  ... (failures exceed 50% threshold) ...         |
    |              |                  |                |
    | call()       |                  |                |
    |------------->|                  |                |
    |              | state=OPEN       |                |
    |              | REJECT (no call) |                |
    |              |--------------------------------------> circuit_open++
    |<-------------|                  |                |
    | fallback     |                  |                |
    | response     |                  |                |
    |              |                  |                |
    |  ... (wait 30 seconds) ...                       |
    |              |                  |                |
    | call()       |                  |                |
    |------------->|                  |                |
    |              | state=HALF_OPEN  |                |
    |              | allow test call  |                |
    |              |----------------->|                |
    |              |                  | 200 OK         |
    |              |<-----------------|                |
    |              | record(SUCCESS)  |                |
    |              | state=CLOSED     |                |
    |              |--------------------------------------> circuit_closed++
    |<-------------|                  |                |
    | response     |                  |                |
    |              |                  |                |
`)}
    </div>
  );
}

/* ===================== MAIN COMPONENT ===================== */

export default function MicroservicesArch() {
  const [activeTab, setActiveTab] = useState('architecture');

  const renderTab = () => {
    switch (activeTab) {
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
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, ' + C.bgFrom + ' 0%, ' + C.bgTo + ' 100%)', color:C.text, fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding:'20px 28px 40px' }}>
      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <h1 style={{ fontSize:32, color:C.header, margin:'0 0 4px', fontWeight:800, letterSpacing:1 }}>Microservices Architecture</h1>
        <p style={{ color:C.muted, fontSize:14, margin:0 }}>Banking QA Testing Dashboard -- Service Mesh, Circuit Breaker, Saga Pattern, API Gateway</p>
      </div>

      {/* Tabs */}
      <div style={{ overflowX:'auto', whiteSpace:'nowrap', marginBottom:24, borderBottom:'2px solid ' + C.border, paddingBottom:0 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display:'inline-block',
              padding:'10px 20px',
              margin:'0 2px',
              background: activeTab === tab.key ? C.accent : 'transparent',
              color: activeTab === tab.key ? '#0a0a1a' : C.text,
              border:'none',
              borderRadius:'8px 8px 0 0',
              cursor:'pointer',
              fontWeight: activeTab === tab.key ? 700 : 400,
              fontSize:13,
              transition:'background 0.2s, color 0.2s',
              fontFamily:'inherit'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth:1400, margin:'0 auto' }}>
        {renderTab()}
      </div>
    </div>
  );
}

import React, { useState } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12', success:'#2ecc71', info:'#3498db' };

const TABS = [
  { key: 'architecture', label: 'Architecture' },
  { key: 'brd', label: 'BRD' },
  { key: 'hld', label: 'HLD' },
  { key: 'lld', label: 'LLD' },
  { key: 'scenarios', label: 'Scenarios' },
  { key: 'testcases', label: 'TestCases' },
  { key: 'c4model', label: 'C4Model' },
  { key: 'techstack', label: 'TechStack' },
  { key: 'sad', label: 'SAD' },
  { key: 'flowchart', label: 'Flowchart' },
  { key: 'sequence', label: 'SequenceDiagram' }
];

const pre = { background: C.editorBg, color: C.editorText, padding: 20, borderRadius: 8, overflowX: 'auto', fontSize: 12, fontFamily: 'monospace', lineHeight: 1.6, border: '1px solid ' + C.border };
const th = { padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid ' + C.accent, color: C.accent, fontWeight: 700, fontSize: 13 };
const td = { padding: '10px 16px', borderBottom: '1px solid ' + C.border, color: C.text, fontSize: 13, verticalAlign: 'top' };
const sectionTitle = { color: C.header, fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 24, borderBottom: '2px solid ' + C.accent, paddingBottom: 8, display: 'inline-block' };
const cardStyle = { background: C.card, borderRadius: 10, padding: 20, border: '1px solid ' + C.border };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 24 };

function ArchitectureTab() {
  return (
    <div>
      <h2 style={sectionTitle}>Contract Testing Architecture - Banking Microservices</h2>
      <p style={{ color: C.text, marginBottom: 16, lineHeight: 1.7 }}>
        Contract testing ensures that banking microservices communicate correctly by validating API contracts
        between consumers and providers. In a banking ecosystem with 15+ internal APIs and multiple consuming
        teams, contract testing prevents breaking changes from reaching production and enables independent
        team deployments without full integration testing.
      </p>
      <pre style={pre}>{`
+====================================================================================+
|                   CONTRACT TESTING ARCHITECTURE - BANKING PLATFORM                  |
+====================================================================================+

  CONSUMER SERVICES                    CONTRACT BROKER                PROVIDER SERVICES
  ==================                   ===============                ==================

  +------------------+                                               +------------------+
  |  Mobile Banking  |---+                                       +---|  Account API     |
  |  App (iOS/Droid) |   |                                       |   |  (Core Banking)  |
  +------------------+   |         +---------------------+       |   +------------------+
                         |         |                     |       |
  +------------------+   +-------->|   PACT BROKER       |<------+   +------------------+
  |  Internet Banking|   |         |                     |       |   |  Payment API     |
  |  Web Portal      |---+         |  - Contract Store   |       +---|  (NEFT/RTGS/UPI) |
  +------------------+   |         |  - Version Matrix   |       |   +------------------+
                         +-------->|  - can-i-deploy     |<------+
  +------------------+   |         |  - Webhook Triggers |       |   +------------------+
  |  Partner API     |---+         |  - Environment Tags |       +---|  Loan API        |
  |  (Fintech/TPP)   |   |         |  - Network Diagram  |       |   |  (Origination)   |
  +------------------+   |         +---------------------+       |   +------------------+
                         |                |       |              |
  +------------------+   |                |       |              |   +------------------+
  |  Internal Admin  |---+         Webhooks|      |Verification  +---|  Card API        |
  |  Dashboard       |                    v       v                  |  (Credit/Debit)  |
  +------------------+         +------------------+                  +------------------+
                               |  CI/CD Pipeline  |
                               |  (Jenkins/GHA)   |                  +------------------+
                               +------------------+                  |  Fraud Detection |
                                      |                              |  API             |
                                      v                              +------------------+
                               +------------------+
                               |  can-i-deploy    |
                               |  Decision Gate   |
                               +------------------+
                                      |
                          +-----------+-----------+
                          |                       |
                     [DEPLOY]               [BLOCK + NOTIFY]


  CONTRACT FLOW:
  ==============

  1. Consumer writes Pact test  ------>  Generates .pact JSON file
  2. Pact file published        ------>  Stored in Pact Broker (versioned)
  3. Webhook fires              ------>  Triggers Provider CI build
  4. Provider verifies contract ------>  Runs against actual provider
  5. Verification result        ------>  Published back to Broker
  6. can-i-deploy check         ------>  Deploy decision gate
  7. Contract tagged            ------>  Environment tag (dev/staging/prod)


  CONTRACT TYPES SUPPORTED:
  =========================

  +---------------------+--------------------------------------------+
  | REST API Contracts  | Pact HTTP interactions (JSON over HTTP)    |
  | (Pact HTTP)         | Request/response matching rules            |
  +---------------------+--------------------------------------------+
  | Async Message       | Pact Message for Kafka/RabbitMQ events     |
  | Contracts           | TransactionEvent, AccountEvent schemas     |
  +---------------------+--------------------------------------------+
  | GraphQL Contracts   | Query/mutation shape validation            |
  |                     | Fragment and variable type checking        |
  +---------------------+--------------------------------------------+
  | OpenAPI Schema      | Bi-directional contract testing            |
  | Validation          | Provider OAS spec vs Consumer Pact         |
  +---------------------+--------------------------------------------+


  BANKING CONTEXT - MULTI-TEAM CONSUMPTION:
  =========================================

  Account API (Provider) consumed by:
    - Mobile Banking Team     (GET /accounts, GET /accounts/{id}, GET /accounts/{id}/balance)
    - Internet Banking Team   (GET /accounts, POST /accounts/transfer, GET /accounts/{id}/statement)
    - Partner API Team        (GET /accounts/{id}/summary - limited fields)
    - Loan Origination Team   (GET /accounts/{id}/credit-score, GET /accounts/{id}/history)
    - Card Management Team    (GET /accounts/{id}/linked-cards)

  BREAKING CHANGE DETECTION:
    - Provider removes "middleName" field from Account response
    - Broker shows: Mobile Banking contract FAILS (uses middleName)
    - Broker shows: Partner API contract PASSES (doesn't use middleName)
    - can-i-deploy: BLOCKED - not all consumers verified
    - Action: Provider team negotiates with Mobile team before change
`}</pre>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ color: C.accent, marginBottom: 12 }}>Consumer-Driven Contracts</h3>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.6 }}>
            Consumers define what they need from a provider API. The contract captures only the interactions
            the consumer actually uses, not the entire API surface. This means providers can safely change
            fields that no consumer relies on.
          </p>
          <ul style={{ color: C.muted, fontSize: 13, paddingLeft: 20, marginTop: 10 }}>
            <li>Consumer writes test specifying expected request/response</li>
            <li>Pact framework generates contract (JSON Pact file)</li>
            <li>Contract published to Pact Broker with consumer version</li>
            <li>Provider verifies it can fulfill the contract</li>
          </ul>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: C.accent, marginBottom: 12 }}>CI/CD Integration</h3>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.6 }}>
            Contract testing is embedded in the CI/CD pipeline. The can-i-deploy tool acts as a deployment
            gate, ensuring no service deploys unless all its contracts are verified.
          </p>
          <ul style={{ color: C.muted, fontSize: 13, paddingLeft: 20, marginTop: 10 }}>
            <li>Consumer CI: generate + publish contracts</li>
            <li>Webhook: triggers provider verification automatically</li>
            <li>Provider CI: verify contracts + publish results</li>
            <li>Deployment: can-i-deploy check before release</li>
          </ul>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: C.accent, marginBottom: 12 }}>Breaking Change Prevention</h3>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.6 }}>
            In banking, API breaking changes can disrupt partner integrations, mobile apps, and core
            banking workflows. Contract testing catches these before deployment.
          </p>
          <ul style={{ color: C.muted, fontSize: 13, paddingLeft: 20, marginTop: 10 }}>
            <li>Removing a required field detected immediately</li>
            <li>Changing field type (string to number) caught</li>
            <li>Renaming endpoints flagged by consumer contracts</li>
            <li>Response status code changes detected</li>
          </ul>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: C.accent, marginBottom: 12 }}>Environment Promotion</h3>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.6 }}>
            Contracts are tagged per environment. A contract verified in dev is tagged "dev", then
            promoted to "staging" and "prod" as it passes through the pipeline.
          </p>
          <ul style={{ color: C.muted, fontSize: 13, paddingLeft: 20, marginTop: 10 }}>
            <li>Branch-based tagging: feature/BANK-123 tag</li>
            <li>Environment tags: dev, staging, prod</li>
            <li>can-i-deploy checks against target environment tag</li>
            <li>Rollback: previous version tag still valid</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function BrdTab() {
  return (
    <div>
      <h2 style={sectionTitle}>Business Requirements Document - Contract Testing Adoption</h2>

      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h3 style={{ color: C.accent, marginBottom: 12 }}>Executive Summary</h3>
        <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7 }}>
          The banking platform operates 15+ internal microservices and 5+ external partner integrations.
          Integration testing currently takes 4-6 hours per release cycle and frequently fails due to
          environment instability. Contract testing will reduce integration failures by 70%, enable
          independent team deployments, and ensure backward compatibility for regulated partner APIs.
        </p>
      </div>

      <h3 style={{ color: C.header, marginBottom: 12 }}>Business Objectives</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr style={{ background: C.card }}>
            <th style={th}>ID</th>
            <th style={th}>Objective</th>
            <th style={th}>Success Metric</th>
            <th style={th}>Timeline</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['BO-01','Prevent API breaking changes from reaching production','Zero breaking change incidents in production','Q1 2026'],
            ['BO-02','Enable independent team deployments','Teams deploy independently 5x per week','Q1 2026'],
            ['BO-03','Reduce integration testing time by 70%','Integration suite from 6hr to <2hr','Q2 2026'],
            ['BO-04','Ensure backward compatibility for partner APIs','100% partner API contract coverage','Q2 2026'],
            ['BO-05','Achieve regulatory compliance for API changes','Audit trail for every contract change','Q1 2026'],
            ['BO-06','Reduce production incidents from API mismatches','<2 API-related incidents per quarter','Q3 2026'],
            ['BO-07','Enable faster onboarding of new API consumers','New consumer integrated in <1 day','Q2 2026'],
            ['BO-08','Support multi-version API contracts (v1/v2)','Concurrent version support verified','Q2 2026']
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...td, color: C.accent, fontWeight: 600 }}>{r[0]}</td>
              <td style={td}>{r[1]}</td>
              <td style={td}>{r[2]}</td>
              <td style={{ ...td, color: C.info }}>{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: C.header, marginBottom: 12 }}>Scope</h3>
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h4 style={{ color: C.accent, marginBottom: 10 }}>In-Scope: Internal APIs (15+)</h4>
          <ul style={{ color: C.text, fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Account Management API (Core Banking)</li>
            <li>Payment Processing API (NEFT/RTGS/IMPS/UPI)</li>
            <li>Loan Origination API</li>
            <li>Credit Card Management API</li>
            <li>Debit Card Management API</li>
            <li>Fraud Detection API</li>
            <li>KYC/AML Compliance API</li>
            <li>Customer Profile API</li>
            <li>Notification Service API (SMS/Email/Push)</li>
            <li>Document Management API</li>
            <li>Audit & Logging API</li>
            <li>Rate & Fee Calculation API</li>
            <li>Foreign Exchange API</li>
            <li>Fixed Deposit API</li>
            <li>Mutual Fund API</li>
          </ul>
        </div>
        <div style={cardStyle}>
          <h4 style={{ color: C.accent, marginBottom: 10 }}>In-Scope: Partner Integrations (5+)</h4>
          <ul style={{ color: C.text, fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
            <li>NPCI UPI Gateway Integration</li>
            <li>RBI Reporting API</li>
            <li>Credit Bureau (CIBIL/Experian) API</li>
            <li>Fintech Partner APIs (Account Aggregator)</li>
            <li>Payment Gateway (Razorpay/PayU) API</li>
            <li>Insurance Partner API</li>
          </ul>
          <h4 style={{ color: C.accent, marginBottom: 10, marginTop: 16 }}>In-Scope: Event Contracts</h4>
          <ul style={{ color: C.text, fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
            <li>TransactionEvent (Kafka topic: banking.transactions)</li>
            <li>AccountEvent (Kafka topic: banking.accounts)</li>
            <li>PaymentStatusEvent (Kafka topic: banking.payments)</li>
            <li>FraudAlertEvent (Kafka topic: banking.fraud-alerts)</li>
            <li>KYCStatusEvent (Kafka topic: banking.kyc-status)</li>
          </ul>
        </div>
      </div>

      <h3 style={{ color: C.header, marginBottom: 12 }}>Functional Requirements</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr style={{ background: C.card }}>
            <th style={th}>FR-ID</th>
            <th style={th}>Requirement</th>
            <th style={th}>Priority</th>
            <th style={th}>Acceptance Criteria</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['FR-01','Automated contract verification in CI pipeline','P0','Every PR triggers contract verification; results visible in PR checks'],
            ['FR-02','Pact Broker for contract storage and versioning','P0','All contracts stored with version, branch, and environment tags'],
            ['FR-03','can-i-deploy checks before production deployment','P0','Deployment blocked if any consumer contract unverified'],
            ['FR-04','Webhook-triggered provider verification','P0','Provider CI automatically triggered within 2 min of contract publish'],
            ['FR-05','Contract tagging per environment (dev/staging/prod)','P0','Each environment has independent contract verification matrix'],
            ['FR-06','Pending pacts support for new consumers','P1','New consumer contracts do not block provider deployment initially'],
            ['FR-07','WIP (Work in Progress) pacts for feature branches','P1','Feature branch contracts isolated from main verification'],
            ['FR-08','Bi-directional contract testing via PactFlow','P1','Provider OAS spec compared against consumer Pact contracts'],
            ['FR-09','Contract diff visualization in Broker UI','P1','Teams can see exact changes between contract versions'],
            ['FR-10','Audit trail for all contract changes','P0','Every publish, verify, tag operation logged with timestamp and user'],
            ['FR-11','Multi-language support (Java, JS, Python, .NET)','P1','All team tech stacks can generate and verify contracts'],
            ['FR-12','Message contract support for Kafka events','P0','Async event schemas verified between producer and consumer']
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...td, color: C.accent, fontWeight: 600 }}>{r[0]}</td>
              <td style={td}>{r[1]}</td>
              <td style={{ ...td, color: r[2] === 'P0' ? C.danger : C.warn, fontWeight: 600 }}>{r[2]}</td>
              <td style={{ ...td, color: C.muted, fontSize: 12 }}>{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: C.header, marginBottom: 12 }}>Non-Functional Requirements</h3>
      <div style={gridStyle}>
        {[
          { title: 'Performance', items: ['Contract verification completes in <30 seconds', 'Pact Broker handles 100+ concurrent publishes', 'can-i-deploy responds in <5 seconds', 'Webhook delivery within 2 minutes of publish'] },
          { title: 'Security', items: ['Pact Broker access via API token authentication', 'Contracts do not contain real customer data', 'Provider state handlers use synthetic test data only', 'TLS encryption for all Broker communications'] },
          { title: 'Reliability', items: ['Pact Broker availability: 99.9% uptime', 'Contract verification retry on transient failures', 'Broker data backed up daily with 30-day retention', 'Failover support for Broker (active-passive)'] },
          { title: 'Compliance', items: ['RBI mandated API versioning compliance', 'PCI-DSS: no card data in contracts', 'GDPR: no PII in contract examples', 'SOC2: audit trail for all contract operations'] }
        ].map((card, i) => (
          <div key={i} style={cardStyle}>
            <h4 style={{ color: C.accent, marginBottom: 10 }}>{card.title}</h4>
            <ul style={{ color: C.text, fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
              {card.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function HldTab() {
  return (
    <div>
      <h2 style={sectionTitle}>High-Level Design - Contract Testing Platform</h2>
      <pre style={pre}>{`
+==========================================================================================+
|                     HIGH-LEVEL DESIGN - CONTRACT TESTING PLATFORM                        |
+==========================================================================================+

  CONTRACT LIFECYCLE FLOW:
  ========================

  +-------------------+     +------------------+     +---------------------+
  |  CONSUMER TEST    |     |  PACT FILE       |     |  PACT BROKER        |
  |  SUITE            |---->|  GENERATION      |---->|  (Contract Store)   |
  |                   |     |  (.pact JSON)    |     |                     |
  | - Describe API    |     | - Interactions   |     | - Version tracking  |
  | - Mock provider   |     | - Matchers       |     | - Environment tags  |
  | - Assert response |     | - Provider state |     | - Network diagram   |
  +-------------------+     +------------------+     | - Verification matrix|
                                                     +---------+-----------+
                                                               |
                                                     +---------v-----------+
                                                     |  WEBHOOK SERVICE    |
                                                     |                     |
                                                     | - On contract       |
                                                     |   publish event     |
                                                     | - Triggers provider |
                                                     |   CI pipeline       |
                                                     +---------+-----------+
                                                               |
                                                     +---------v-----------+
                                                     |  PROVIDER CI        |
                                                     |                     |
                                                     | - Fetch contracts   |
                                                     |   from Broker       |
                                                     | - Setup provider    |
                                                     |   states            |
                                                     | - Run verification  |
                                                     | - Publish results   |
                                                     +---------+-----------+
                                                               |
                                                     +---------v-----------+
                                                     |  VERIFICATION       |
                                                     |  RESULT             |
                                                     |                     |
                                                     | - PASS: All         |
                                                     |   interactions OK   |
                                                     | - FAIL: Mismatch    |
                                                     |   details logged    |
                                                     +---------+-----------+
                                                               |
                                                     +---------v-----------+
                                                     |  PACT BROKER        |
                                                     |  (Updated Matrix)   |
                                                     +---------+-----------+
                                                               |
                                                     +---------v-----------+
                                                     |  can-i-deploy       |
                                                     |  DECISION GATE      |
                                                     |                     |
                                                     | Query: Can consumer |
                                                     | version X deploy   |
                                                     | to environment Y?  |
                                                     +----------+----------+
                                                                |
                                                     +----------+----------+
                                                     |                     |
                                                +----v----+         +-----v-----+
                                                | DEPLOY  |         |  BLOCK    |
                                                | (Green) |         |  (Red)    |
                                                +---------+         | + Notify  |
                                                                    +-----------+


  MULTI-CONSUMER SCENARIO - PAYMENT API:
  =======================================

  +------------------+
  |  Mobile Banking  |----+
  |  Consumer        |    |     +-------------------+     +------------------+
  +------------------+    |     |                   |     |                  |
                          +---->|   PACT BROKER     |---->|  Payment API     |
  +------------------+    |     |                   |     |  (Provider)      |
  |  Internet Banking|----+     | Consumer Contracts|     |                  |
  |  Consumer        |    |     | for Payment API:  |     | Verifies ALL     |
  +------------------+    |     |                   |     | consumer         |
                          +---->| - MobileBank v2.1 |     | contracts:       |
  +------------------+    |     | - WebPortal v3.0  |     |                  |
  |  Partner Fintech |----+     | - Partner v1.0    |     | - POST /payments |
  |  Consumer        |          | - Admin v1.5      |     | - GET /payments  |
  +------------------+          +-------------------+     | - GET /status    |
                                                          +------------------+
  +------------------+
  |  Admin Dashboard |----+
  |  Consumer        |    |
  +------------------+    |


  VERSIONING STRATEGY:
  ====================

  Branch-Based Tags:
  +-----------+---------------------------+----------------------------+
  | Branch    | Consumer Tag              | can-i-deploy target        |
  +-----------+---------------------------+----------------------------+
  | main      | prod                      | --to-environment prod      |
  | develop   | dev                       | --to-environment dev       |
  | staging   | staging                   | --to-environment staging   |
  | feature/* | feature/BANK-{ticket-id}  | --to-environment dev       |
  +-----------+---------------------------+----------------------------+

  Environment Promotion:
  dev --> staging --> prod
   |        |          |
   v        v          v
  Tag:     Tag:       Tag:
  "dev"    "staging"  "prod"

  Each environment has its own verification matrix.
  can-i-deploy checks ONLY against the target environment.


  WEBHOOK INTEGRATION:
  ====================

  1. Consumer publishes contract to Pact Broker
  2. Broker fires webhook to Provider CI:
     POST https://ci.bank.internal/api/trigger
     {
       "pactUrl": "https://broker.bank.internal/pacts/provider/PaymentAPI/consumer/MobileBank/version/2.1.0",
       "consumerName": "MobileBank",
       "providerName": "PaymentAPI",
       "consumerVersion": "2.1.0"
     }
  3. Provider CI fetches contract and runs verification
  4. Results published back to Broker
  5. Consumer team notified via Slack/Teams webhook
`}</pre>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ color: C.accent, marginBottom: 12 }}>Pact Broker Components</h3>
          <ul style={{ color: C.text, fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
            <li><strong style={{ color: C.header }}>Contract Store:</strong> PostgreSQL-backed storage for all Pact files</li>
            <li><strong style={{ color: C.header }}>Verification Matrix:</strong> Consumer-provider compatibility grid</li>
            <li><strong style={{ color: C.header }}>can-i-deploy:</strong> CLI tool querying matrix for deploy decision</li>
            <li><strong style={{ color: C.header }}>Webhooks:</strong> Event-driven triggers for CI pipelines</li>
            <li><strong style={{ color: C.header }}>Network Diagram:</strong> Visual graph of service dependencies</li>
            <li><strong style={{ color: C.header }}>API Tokens:</strong> Read/write access control per team</li>
          </ul>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: C.accent, marginBottom: 12 }}>Infrastructure</h3>
          <ul style={{ color: C.text, fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
            <li><strong style={{ color: C.header }}>Pact Broker:</strong> Docker container on Kubernetes (HA)</li>
            <li><strong style={{ color: C.header }}>Database:</strong> PostgreSQL 15 for Broker persistence</li>
            <li><strong style={{ color: C.header }}>CI/CD:</strong> Jenkins + GitHub Actions pipelines</li>
            <li><strong style={{ color: C.header }}>Monitoring:</strong> Broker health dashboard + Grafana alerts</li>
            <li><strong style={{ color: C.header }}>Networking:</strong> Internal VPC, no public access</li>
            <li><strong style={{ color: C.header }}>Backup:</strong> Daily automated PostgreSQL backups</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LldTab() {
  return (
    <div>
      <h2 style={sectionTitle}>Low-Level Design - Contract Testing Implementation</h2>

      <h3 style={{ color: C.header, marginBottom: 12 }}>Consumer Pact Test - JavaScript (Account API)</h3>
      <pre style={pre}>{`
// consumer-account-api.pact.test.js
// Mobile Banking App consuming Account API

const { Pact } = require('@pact-foundation/pact');
const { like, eachLike, term } = require('@pact-foundation/pact').Matchers;
const AccountService = require('./account-service');

const provider = new Pact({
  consumer: 'MobileBankingApp',
  provider: 'AccountAPI',
  port: 1234,
  log: './logs/pact.log',
  dir: './pacts',
  logLevel: 'warn',
});

describe('Account API Contract', () => {
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());
  afterEach(() => provider.verify());

  describe('GET /api/v1/accounts/{accountId}', () => {
    const EXPECTED_BODY = {
      accountId: like('ACC-2026-001'),
      accountNumber: like('1234567890'),
      accountType: term({ generate: 'SAVINGS', matcher: 'SAVINGS|CURRENT|FD|RD' }),
      currency: like('INR'),
      balance: {
        available: like(50000.00),
        current: like(52000.00),
        currency: like('INR')
      },
      holder: {
        name: like('Rajesh Kumar'),
        customerId: like('CUS-2026-001')
      },
      status: term({ generate: 'ACTIVE', matcher: 'ACTIVE|DORMANT|FROZEN|CLOSED' }),
      branch: {
        code: like('HDFC0001234'),
        name: like('Koramangala Branch')
      },
      openedDate: term({ generate: '2020-01-15', matcher: '\\\\d{4}-\\\\d{2}-\\\\d{2}' }),
      lastTransactionDate: like('2026-02-25')
    };

    beforeEach(() => {
      return provider.addInteraction({
        state: 'account ACC-2026-001 exists with balance 50000',
        uponReceiving: 'a request for account details',
        withRequest: {
          method: 'GET',
          path: '/api/v1/accounts/ACC-2026-001',
          headers: {
            'Accept': 'application/json',
            'Authorization': like('Bearer eyJhbGciOiJSUzI1NiJ9...')
          }
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: EXPECTED_BODY
        }
      });
    });

    it('returns account details', async () => {
      const account = await AccountService.getAccount('ACC-2026-001');
      expect(account.accountId).toBe('ACC-2026-001');
      expect(account.balance.available).toBe(50000.00);
      expect(account.status).toBe('ACTIVE');
    });
  });

  describe('GET /api/v1/accounts/{accountId} - Not Found', () => {
    beforeEach(() => {
      return provider.addInteraction({
        state: 'account ACC-9999-999 does not exist',
        uponReceiving: 'a request for non-existent account',
        withRequest: {
          method: 'GET',
          path: '/api/v1/accounts/ACC-9999-999',
          headers: { 'Accept': 'application/json', 'Authorization': like('Bearer token') }
        },
        willRespondWith: {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: 'NOT_FOUND',
            message: like('Account not found'),
            correlationId: like('corr-uuid-1234')
          }
        }
      });
    });

    it('returns 404 for non-existent account', async () => {
      await expect(AccountService.getAccount('ACC-9999-999'))
        .rejects.toThrow('Account not found');
    });
  });
});
`}</pre>

      <h3 style={{ color: C.header, marginBottom: 12, marginTop: 24 }}>Consumer Pact Test - Java (Payment API)</h3>
      <pre style={pre}>{`
// PaymentApiContractTest.java
// Internet Banking consuming Payment API

@ExtendWith(PactConsumerTestExt.class)
@PactTestFor(providerName = "PaymentAPI", port = "8080")
public class PaymentApiContractTest {

    @Pact(consumer = "InternetBanking")
    public V4Pact createPaymentPact(PactDslWithProvider builder) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Authorization", "Bearer valid-token");

        DslPart requestBody = new PactDslJsonBody()
            .stringType("fromAccountId", "ACC-2026-001")
            .stringType("toAccountId", "ACC-2026-002")
            .numberType("amount", 25000.00)
            .stringValue("currency", "INR")
            .stringMatcher("paymentMode", "NEFT|RTGS|IMPS|UPI", "NEFT")
            .stringType("remarks", "Rent Payment Feb 2026")
            .stringType("idempotencyKey", "IDMP-2026-001");

        DslPart responseBody = new PactDslJsonBody()
            .stringType("paymentId", "PAY-2026-001")
            .stringMatcher("status", "INITIATED|PROCESSING|COMPLETED|FAILED", "INITIATED")
            .stringType("referenceNumber", "NEFT-2026-02-27-001")
            .numberType("amount", 25000.00)
            .stringValue("currency", "INR")
            .stringType("fromAccountId", "ACC-2026-001")
            .stringType("toAccountId", "ACC-2026-002")
            .datetime("createdAt", "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            .object("charges")
                .numberType("gst", 4.50)
                .numberType("processingFee", 25.00)
                .numberType("totalCharges", 29.50)
            .closeObject();

        return builder
            .given("account ACC-2026-001 has sufficient balance for 25000 INR NEFT")
            .uponReceiving("a request to initiate NEFT payment")
            .path("/api/v1/payments")
            .method("POST")
            .headers(headers)
            .body(requestBody)
            .willRespondWith()
            .status(201)
            .headers(Map.of("Content-Type", "application/json"))
            .body(responseBody)
            .toPact(V4Pact.class);
    }

    @Test
    @PactTestFor(pactMethod = "createPaymentPact")
    void testInitiatePayment(MockServer mockServer) {
        PaymentService service = new PaymentService(mockServer.getUrl());
        PaymentResponse response = service.initiatePayment(
            "ACC-2026-001", "ACC-2026-002", 25000.00, "INR", "NEFT"
        );
        assertThat(response.getStatus()).isEqualTo("INITIATED");
        assertThat(response.getAmount()).isEqualTo(25000.00);
        assertThat(response.getCharges().getTotalCharges()).isEqualTo(29.50);
    }
}
`}</pre>

      <h3 style={{ color: C.header, marginBottom: 12, marginTop: 24 }}>Provider Verification Configuration</h3>
      <pre style={pre}>{`
// provider-verification.config.js
// Account API Provider Verification

const { Verifier } = require('@pact-foundation/pact');

const opts = {
  provider: 'AccountAPI',
  providerBaseUrl: 'http://localhost:3000',
  pactBrokerUrl: 'https://broker.bank.internal',
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  publishVerificationResult: true,
  providerVersion: process.env.GIT_COMMIT_SHA,
  providerVersionBranch: process.env.GIT_BRANCH,
  enablePending: true,                    // Don't fail on new consumer contracts
  includeWipPactsSince: '2026-01-01',     // Include WIP pacts from this date
  consumerVersionSelectors: [
    { mainBranch: true },                 // Contracts from main branch
    { deployedOrReleased: true },         // Contracts deployed to any environment
    { matchingBranch: true },             // Contracts from same-named branch
  ],
  stateHandlers: {
    'account ACC-2026-001 exists with balance 50000': async () => {
      // Setup test data in provider database
      await db.query(
        'INSERT INTO accounts (id, number, type, balance, status, customer_id) ' +
        'VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET balance = $4',
        ['ACC-2026-001', '1234567890', 'SAVINGS', 50000.00, 'ACTIVE', 'CUS-2026-001']
      );
      await db.query(
        'INSERT INTO customers (id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        ['CUS-2026-001', 'Rajesh Kumar']
      );
    },
    'account ACC-9999-999 does not exist': async () => {
      await db.query('DELETE FROM accounts WHERE id = $1', ['ACC-9999-999']);
    },
    'account ACC-2026-001 has sufficient balance for 25000 INR NEFT': async () => {
      await db.query(
        'INSERT INTO accounts (id, balance, status) VALUES ($1, $2, $3) ' +
        'ON CONFLICT (id) DO UPDATE SET balance = $2',
        ['ACC-2026-001', 100000.00, 'ACTIVE']
      );
    }
  }
};

new Verifier(opts).verifyProvider().then(() => {
  console.log('All contracts verified successfully');
}).catch((error) => {
  console.error('Contract verification FAILED:', error.message);
  process.exit(1);
});
`}</pre>

      <h3 style={{ color: C.header, marginBottom: 12, marginTop: 24 }}>Message Contract - Kafka TransactionEvent</h3>
      <pre style={pre}>{`
// message-contract-transaction-event.pact.test.js
// Fraud Detection Service consuming TransactionEvent from Payment API

const { MessageConsumerPact, synchronousBodyHandler } = require('@pact-foundation/pact');
const { like, term, eachLike } = require('@pact-foundation/pact').Matchers;

const messagePact = new MessageConsumerPact({
  consumer: 'FraudDetectionService',
  provider: 'PaymentAPI',
  dir: './pacts',
  logLevel: 'warn'
});

describe('TransactionEvent Message Contract', () => {
  it('processes a transaction event for fraud analysis', () => {
    return messagePact
      .given('a completed NEFT transaction for 50000 INR')
      .expectsToReceive('a TransactionEvent message')
      .withContent({
        eventType: term({ generate: 'TRANSACTION_COMPLETED', matcher: 'TRANSACTION_.*' }),
        eventId: like('EVT-2026-001'),
        timestamp: like('2026-02-27T10:30:00.000Z'),
        transaction: {
          transactionId: like('TXN-2026-001'),
          paymentId: like('PAY-2026-001'),
          type: term({ generate: 'NEFT', matcher: 'NEFT|RTGS|IMPS|UPI' }),
          amount: like(50000.00),
          currency: like('INR'),
          fromAccount: {
            accountId: like('ACC-2026-001'),
            ifscCode: like('HDFC0001234'),
            accountType: like('SAVINGS')
          },
          toAccount: {
            accountId: like('ACC-2026-002'),
            ifscCode: like('ICIC0005678'),
            accountType: like('CURRENT')
          },
          status: term({ generate: 'COMPLETED', matcher: 'COMPLETED|FAILED|REVERSED' }),
          channel: term({ generate: 'INTERNET_BANKING', matcher: 'MOBILE|INTERNET_BANKING|BRANCH|ATM' }),
          ipAddress: like('192.168.1.100'),
          deviceId: like('DEV-MOB-001'),
          location: {
            city: like('Bangalore'),
            state: like('Karnataka'),
            country: like('IN')
          }
        },
        metadata: {
          correlationId: like('CORR-2026-001'),
          sourceSystem: like('PaymentAPI'),
          schemaVersion: like('2.0')
        }
      })
      .withMetadata({ 'content-type': 'application/json', topic: 'banking.transactions' })
      .verify(synchronousBodyHandler(async (message) => {
        const event = JSON.parse(JSON.stringify(message));
        expect(event.eventType).toContain('TRANSACTION_');
        expect(event.transaction.amount).toBeGreaterThan(0);
        expect(event.transaction.fromAccount.accountId).toBeTruthy();
        // Fraud detection logic would process this event
      }));
  });
});


  Avro Schema for TransactionEvent:
  ==================================
  {
    "type": "record",
    "name": "TransactionEvent",
    "namespace": "com.bank.events",
    "fields": [
      { "name": "eventType", "type": "string" },
      { "name": "eventId", "type": "string" },
      { "name": "timestamp", "type": { "type": "long", "logicalType": "timestamp-millis" } },
      { "name": "transactionId", "type": "string" },
      { "name": "paymentId", "type": "string" },
      { "name": "type", "type": { "type": "enum", "name": "PaymentType",
          "symbols": ["NEFT", "RTGS", "IMPS", "UPI"] } },
      { "name": "amount", "type": { "type": "bytes", "logicalType": "decimal",
          "precision": 18, "scale": 2 } },
      { "name": "currency", "type": "string", "default": "INR" },
      { "name": "fromAccountId", "type": "string" },
      { "name": "toAccountId", "type": "string" },
      { "name": "status", "type": { "type": "enum", "name": "TxnStatus",
          "symbols": ["COMPLETED", "FAILED", "REVERSED"] } },
      { "name": "channel", "type": "string" },
      { "name": "metadata", "type": ["null", { "type": "map", "values": "string" }],
          "default": null }
    ]
  }
`}</pre>

      <h3 style={{ color: C.header, marginBottom: 12, marginTop: 24 }}>Verification Matrix</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr style={{ background: C.card }}>
            <th style={th}>Consumer</th>
            <th style={th}>Provider</th>
            <th style={th}>Consumer Version</th>
            <th style={th}>Provider Version</th>
            <th style={th}>Status</th>
            <th style={th}>Environment</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['MobileBankingApp','AccountAPI','3.2.1','5.0.0','Verified','prod'],
            ['InternetBanking','AccountAPI','2.8.0','5.0.0','Verified','prod'],
            ['PartnerFintech','AccountAPI','1.2.0','5.0.0','Verified','prod'],
            ['MobileBankingApp','PaymentAPI','3.2.1','4.1.0','Verified','staging'],
            ['InternetBanking','PaymentAPI','2.8.0','4.1.0','Verified','staging'],
            ['FraudDetection','PaymentAPI','1.5.0','4.1.0','Verified','staging'],
            ['LoanOrigination','AccountAPI','2.0.0','5.1.0-rc1','Pending','dev'],
            ['AdminDashboard','AccountAPI','1.0.0','5.1.0-rc1','Failed','dev'],
            ['MobileBankingApp','CardAPI','3.2.1','2.0.0','Verified','prod'],
            ['PartnerFintech','LoanAPI','1.2.0','3.0.0','WIP','dev']
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...td, color: C.info }}>{r[0]}</td>
              <td style={td}>{r[1]}</td>
              <td style={{ ...td, fontFamily: 'monospace', fontSize: 12 }}>{r[2]}</td>
              <td style={{ ...td, fontFamily: 'monospace', fontSize: 12 }}>{r[3]}</td>
              <td style={{ ...td, color: r[4] === 'Verified' ? C.success : r[4] === 'Failed' ? C.danger : r[4] === 'WIP' ? C.info : C.warn, fontWeight: 600 }}>{r[4]}</td>
              <td style={{ ...td, color: r[5] === 'prod' ? C.success : r[5] === 'staging' ? C.warn : C.info }}>{r[5]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScenariosTab() {
  const scenarios = [
    { id: 'SC-01', title: 'Consumer generates contract for GET /accounts/{id}', type: 'REST', priority: 'P0', desc: 'Mobile Banking app writes Pact test for account details endpoint. Contract captures accountId, balance, status, holder fields. Pact file generated with matchers for field types and regex for enums.' },
    { id: 'SC-02', title: 'Provider verifies account contract from 3 consumers', type: 'REST', priority: 'P0', desc: 'Account API provider runs verification against MobileBanking, InternetBanking, and PartnerFintech contracts simultaneously. Provider state handlers setup test accounts. All 3 consumer contracts must pass.' },
    { id: 'SC-03', title: 'Breaking change detection - remove required field', type: 'REST', priority: 'P0', desc: 'Account API removes middleName field from response. MobileBanking contract expects middleName. Verification fails. can-i-deploy blocks Account API deployment. Provider team notified.' },
    { id: 'SC-04', title: 'Backward-compatible change - add optional field', type: 'REST', priority: 'P0', desc: 'Account API adds new optional field "rewardsPoints" to response. No existing consumer contracts reference this field. Verification passes for all consumers. Deployment proceeds.' },
    { id: 'SC-05', title: 'Consumer contract for POST /payments', type: 'REST', priority: 'P0', desc: 'Internet Banking creates Pact test for NEFT payment initiation. Contract specifies request body schema (fromAccount, toAccount, amount, currency, paymentMode) and response schema (paymentId, status, referenceNumber, charges).' },
    { id: 'SC-06', title: 'Async message contract for TransactionEvent', type: 'Message', priority: 'P0', desc: 'Fraud Detection service creates message Pact for TransactionEvent on Kafka topic banking.transactions. Contract specifies event schema with transaction details, amount, accounts, channel, location.' },
    { id: 'SC-07', title: 'Partner API contract - versioned v1 and v2 coexist', type: 'REST', priority: 'P1', desc: 'Fintech partner consumes Account API v1 (limited fields). New partner onboards with v2 (full fields). Both contracts coexist in Broker. Provider verifies both versions. v1 contract tagged with "legacy" annotation.' },
    { id: 'SC-08', title: 'can-i-deploy check before production deployment', type: 'CI/CD', priority: 'P0', desc: 'Before deploying Payment API v4.1.0 to production, CI runs: pact-broker can-i-deploy --pacticipant PaymentAPI --version 4.1.0 --to-environment prod. Checks all consumer contracts verified against this version for prod environment.' },
    { id: 'SC-09', title: 'Contract for error responses (400, 401, 403, 404, 500)', type: 'REST', priority: 'P0', desc: 'Consumer contracts include interactions for error scenarios: invalid request (400), unauthorized (401), forbidden (403), not found (404), server error (500). Each has consistent error envelope {error, message, correlationId}.' },
    { id: 'SC-10', title: 'Webhook triggers provider verification on publish', type: 'CI/CD', priority: 'P0', desc: 'When MobileBanking publishes new contract to Broker, webhook fires to Account API Jenkins pipeline. Pipeline fetches contract, runs provider verification, publishes result back. Entire flow completes in <5 minutes.' },
    { id: 'SC-11', title: 'Provider state setup - account with specific balance', type: 'REST', priority: 'P1', desc: 'Consumer contract specifies provider state: "account ACC-001 exists with balance 50000". Provider state handler creates test account with exact balance before verification. State torn down after verification.' },
    { id: 'SC-12', title: 'GraphQL query contract validation', type: 'GraphQL', priority: 'P1', desc: 'Admin dashboard consumes Account API GraphQL endpoint. Contract validates query shape: query { account(id: "ACC-001") { balance { available current } transactions(limit: 10) { amount type } } }.' },
    { id: 'SC-13', title: 'Pagination contract - offset/limit', type: 'REST', priority: 'P1', desc: 'Consumer contract for GET /accounts?offset=0&limit=20. Response contract includes: items array (eachLike matcher), total count, offset, limit fields. Provider verifies pagination parameters are respected.' },
    { id: 'SC-14', title: 'Multi-provider contract (Payment depends on Account + Fraud)', type: 'REST', priority: 'P1', desc: 'Payment API is both a provider (to Mobile/Web consumers) and a consumer (of Account API and Fraud API). Payment API has consumer contracts with Account API for balance check and Fraud API for risk assessment.' },
    { id: 'SC-15', title: 'Contract for file upload endpoint', type: 'REST', priority: 'P2', desc: 'Document Management API provides KYC document upload endpoint. Consumer contract specifies multipart form data with file (PDF/JPG), document type, customer ID. Response includes document ID and verification status.' },
    { id: 'SC-16', title: 'Schema evolution - Avro compatibility check', type: 'Message', priority: 'P1', desc: 'TransactionEvent Avro schema evolves from v1 to v2 (new field added with default). Schema Registry validates backward compatibility. All existing consumers can deserialize new schema. Forward compatibility also verified.' },
    { id: 'SC-17', title: 'Contract for WebSocket events', type: 'Message', priority: 'P2', desc: 'Mobile Banking app subscribes to real-time transaction notifications via WebSocket. Contract defines event message shape for TRANSACTION_ALERT, BALANCE_UPDATE, PAYMENT_STATUS events with amount, timestamp, description.' },
    { id: 'SC-18', title: 'Cross-team contract negotiation workflow', type: 'Process', priority: 'P1', desc: 'Account API team wants to deprecate field "legacyCode". Consumer teams review pending contract changes in Broker. Negotiation via Slack channel. 30-day deprecation period. Migration guide published. Field removed after all consumers updated.' },
    { id: 'SC-19', title: 'Contract tagging per environment', type: 'CI/CD', priority: 'P0', desc: 'After successful deployment to staging, CI tags contract: pact-broker create-version-tag --pacticipant MobileBanking --version 3.2.1 --tag staging. Same for prod after production deploy. can-i-deploy uses environment-specific tags.' },
    { id: 'SC-20', title: 'Contract for batch API endpoint', type: 'REST', priority: 'P2', desc: 'Admin service consumes batch account status endpoint: POST /api/v1/accounts/batch-status with array of accountIds. Response includes status for each account. Contract uses eachLike matcher for request and response arrays.' }
  ];

  return (
    <div>
      <h2 style={sectionTitle}>Contract Testing Scenarios - Banking APIs</h2>
      <p style={{ color: C.text, marginBottom: 20, lineHeight: 1.7 }}>
        20 comprehensive test scenarios covering REST contracts, message contracts, GraphQL contracts,
        CI/CD integration, schema evolution, and cross-team workflows in a banking microservices ecosystem.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr style={{ background: C.card }}>
            <th style={th}>ID</th>
            <th style={th}>Scenario</th>
            <th style={th}>Type</th>
            <th style={th}>Priority</th>
            <th style={th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...td, color: C.accent, fontWeight: 600, whiteSpace: 'nowrap' }}>{s.id}</td>
              <td style={{ ...td, color: C.header, fontWeight: 500, minWidth: 220 }}>{s.title}</td>
              <td style={{ ...td, color: s.type === 'REST' ? C.info : s.type === 'Message' ? C.warn : s.type === 'GraphQL' ? C.accent : C.muted, fontWeight: 600, whiteSpace: 'nowrap' }}>{s.type}</td>
              <td style={{ ...td, color: s.priority === 'P0' ? C.danger : s.priority === 'P1' ? C.warn : C.muted, fontWeight: 600 }}>{s.priority}</td>
              <td style={{ ...td, fontSize: 12, color: C.muted, maxWidth: 400 }}>{s.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TestCasesTab() {
  const testCases = [
    { id:'TC-01', title:'Generate consumer contract for GET /accounts/{id}', type:'REST', parties:'MobileBanking -> AccountAPI', steps:'1. Write Pact consumer test with expected request/response\n2. Run consumer test suite\n3. Verify .pact JSON file generated in ./pacts\n4. Validate interaction count and matchers', expected:'Pact file generated with correct interaction, matchers for field types, provider states defined', priority:'P0' },
    { id:'TC-02', title:'Publish contract to Pact Broker', type:'REST', parties:'MobileBanking -> Broker', steps:'1. Run pact-broker publish ./pacts --consumer-app-version 3.2.1 --branch main\n2. Verify contract appears in Broker UI\n3. Check version and branch tags applied\n4. Verify network diagram updated', expected:'Contract published with correct version, branch tag, visible in Broker matrix and network diagram', priority:'P0' },
    { id:'TC-03', title:'Provider verifies consumer contract', type:'REST', parties:'AccountAPI verifies MobileBanking', steps:'1. Configure provider verifier with Broker URL\n2. Setup provider state handlers\n3. Run verification against consumer contracts\n4. Check verification result in Broker', expected:'All interactions verified successfully, result published to Broker, matrix shows green', priority:'P0' },
    { id:'TC-04', title:'Breaking change detection - field removal', type:'REST', parties:'AccountAPI (provider change)', steps:'1. Provider removes "middleName" from Account response\n2. Run provider verification\n3. Check MobileBanking contract fails (expects middleName)\n4. Run can-i-deploy for AccountAPI to prod', expected:'Verification fails for MobileBanking, can-i-deploy returns "Computer says no", deployment blocked', priority:'P0' },
    { id:'TC-05', title:'Breaking change detection - type change', type:'REST', parties:'PaymentAPI (provider change)', steps:'1. Provider changes "amount" from number to string\n2. Run provider verification against all consumers\n3. All consumer contracts fail on type mismatch\n4. can-i-deploy blocks deployment', expected:'Type mismatch detected for all consumers, clear error message showing expected vs actual type', priority:'P0' },
    { id:'TC-06', title:'Backward-compatible additive change', type:'REST', parties:'AccountAPI adds optional field', steps:'1. Provider adds "rewardsPoints" optional field\n2. Run verification against existing consumers\n3. No consumer uses rewardsPoints\n4. can-i-deploy succeeds', expected:'All existing contracts pass, new field ignored by consumers, deployment proceeds', priority:'P0' },
    { id:'TC-07', title:'Message contract generation for Kafka event', type:'Message', parties:'FraudDetection -> PaymentAPI', steps:'1. Write MessageConsumerPact test\n2. Define TransactionEvent expected schema\n3. Run consumer test\n4. Verify message pact file generated', expected:'Message Pact file generated with correct content matchers, metadata includes topic name', priority:'P0' },
    { id:'TC-08', title:'Message contract provider verification', type:'Message', parties:'PaymentAPI verifies FraudDetection', steps:'1. Configure message provider verifier\n2. Implement message producer factory\n3. Run verification for message interactions\n4. Check results in Broker', expected:'Provider can produce message matching consumer expectations, verification passes', priority:'P0' },
    { id:'TC-09', title:'can-i-deploy before production release', type:'CI/CD', parties:'PaymentAPI -> prod', steps:'1. Run: pact-broker can-i-deploy --pacticipant PaymentAPI --version 4.1.0 --to-environment prod\n2. Check all consumer contracts verified for prod\n3. Verify exit code (0 = safe, 1 = blocked)\n4. Check detailed matrix output', expected:'If all consumers verified: exit 0, "Computer says yes". If any unverified: exit 1 with details', priority:'P0' },
    { id:'TC-10', title:'Webhook triggers provider CI on publish', type:'CI/CD', parties:'Broker -> Jenkins', steps:'1. Consumer publishes new contract\n2. Broker fires webhook to provider CI URL\n3. Provider CI triggered within 2 minutes\n4. Verification runs and result published', expected:'Webhook delivered, provider CI triggered, verification result available within 5 minutes', priority:'P0' },
    { id:'TC-11', title:'Provider state handler setup and teardown', type:'REST', parties:'AccountAPI state handlers', steps:'1. Define state: "account with balance 50000"\n2. State handler inserts test data\n3. Verification runs with test data present\n4. State torn down after verification', expected:'Test data created before verification, contract passes with correct data, cleanup after', priority:'P1' },
    { id:'TC-12', title:'Multi-consumer verification (3+ consumers)', type:'REST', parties:'AccountAPI verifies all consumers', steps:'1. AccountAPI has contracts from Mobile, Web, Partner\n2. Run verification for all consumers\n3. Each consumer contract verified independently\n4. Any failure blocks deployment', expected:'All 3 consumer contracts verified, matrix shows complete coverage, can-i-deploy passes', priority:'P0' },
    { id:'TC-13', title:'Pending pacts for new consumer', type:'REST', parties:'New AdminDashboard -> AccountAPI', steps:'1. New AdminDashboard team publishes first contract\n2. enablePending: true on provider verifier\n3. Provider verification runs but failure does not block\n4. Pending pact appears in Broker with "pending" status', expected:'New consumer contract does not block provider deployment, marked as pending until first verification', priority:'P1' },
    { id:'TC-14', title:'WIP pacts for feature branch', type:'REST', parties:'Feature branch contract', steps:'1. Consumer publishes from feature/BANK-456 branch\n2. includeWipPactsSince configured on provider\n3. WIP pact verified but failure is non-blocking\n4. Feature branch tagged separately', expected:'Feature branch contracts isolated from main, WIP pacts non-blocking, merge to main promotes to verified', priority:'P1' },
    { id:'TC-15', title:'Contract for error response 404', type:'REST', parties:'MobileBanking -> AccountAPI', steps:'1. Consumer test: request non-existent account\n2. Expected response: 404 with error envelope\n3. Provider state: account does not exist\n4. Verify error response shape matches', expected:'404 response with {error: "NOT_FOUND", message: "...", correlationId: "..."} shape verified', priority:'P0' },
    { id:'TC-16', title:'Contract for unauthorized access 401', type:'REST', parties:'MobileBanking -> AccountAPI', steps:'1. Consumer test: request without auth token\n2. Expected response: 401 with error envelope\n3. Provider returns 401 for missing auth\n4. Verify error response shape', expected:'401 response with {error: "UNAUTHORIZED", message: "..."} verified, consistent with other error contracts', priority:'P0' },
    { id:'TC-17', title:'Environment tagging after deployment', type:'CI/CD', parties:'All services', steps:'1. Deploy MobileBanking v3.2.1 to staging\n2. Tag: pact-broker create-version-tag --pacticipant MobileBanking --version 3.2.1 --tag staging\n3. Verify tag appears in Broker\n4. can-i-deploy for staging uses this tag', expected:'Contract tagged with staging, future can-i-deploy checks reference staging tag', priority:'P0' },
    { id:'TC-18', title:'Bi-directional contract test (PactFlow)', type:'REST', parties:'AccountAPI OAS vs consumers', steps:'1. Provider publishes OpenAPI spec to PactFlow\n2. Consumer Pact contracts compared against OAS\n3. PactFlow cross-validates consumer needs vs provider spec\n4. Mismatches flagged', expected:'Bi-directional comparison shows consumer needs are subset of provider spec, any gap flagged', priority:'P1' },
    { id:'TC-19', title:'Contract diff between versions', type:'REST', parties:'Contract versioning', steps:'1. Consumer publishes v3.2.0 and v3.2.1 contracts\n2. Open Broker diff view between versions\n3. Identify added/removed/changed interactions\n4. Review matcher changes', expected:'Diff shows exact changes: new interaction added for GET /accounts/{id}/statement, matcher tightened', priority:'P1' },
    { id:'TC-20', title:'Schema compatibility check for Avro events', type:'Message', parties:'TransactionEvent schema evolution', steps:'1. Current schema v1 in Schema Registry\n2. Propose v2 with new optional field (default value)\n3. Run compatibility check: BACKWARD_TRANSITIVE\n4. All consumers can deserialize v2 messages', expected:'Schema Registry validates backward compatibility, v2 registered successfully, no consumer breakage', priority:'P1' }
  ];

  return (
    <div>
      <h2 style={sectionTitle}>Test Cases - Contract Testing for Banking APIs</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24, minWidth: 1100 }}>
          <thead>
            <tr style={{ background: C.card }}>
              <th style={th}>TC-ID</th>
              <th style={th}>Title</th>
              <th style={th}>Contract Type</th>
              <th style={th}>Consumer / Provider</th>
              <th style={th}>Steps</th>
              <th style={th}>Expected Result</th>
              <th style={th}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((tc, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
                <td style={{ ...td, color: C.accent, fontWeight: 600, whiteSpace: 'nowrap' }}>{tc.id}</td>
                <td style={{ ...td, color: C.header, fontWeight: 500, minWidth: 180 }}>{tc.title}</td>
                <td style={{ ...td, color: tc.type === 'REST' ? C.info : tc.type === 'Message' ? C.warn : C.accent, fontWeight: 600, whiteSpace: 'nowrap' }}>{tc.type}</td>
                <td style={{ ...td, fontSize: 12, whiteSpace: 'nowrap' }}>{tc.parties}</td>
                <td style={{ ...td, fontSize: 11, color: C.muted, whiteSpace: 'pre-line', minWidth: 220 }}>{tc.steps}</td>
                <td style={{ ...td, fontSize: 12, color: C.text, minWidth: 200 }}>{tc.expected}</td>
                <td style={{ ...td, color: tc.priority === 'P0' ? C.danger : tc.priority === 'P1' ? C.warn : C.muted, fontWeight: 600 }}>{tc.priority}</td>
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
      <h2 style={sectionTitle}>C4 Model - Contract Testing Platform</h2>

      <h3 style={{ color: C.header, marginBottom: 12 }}>Level 1: System Context</h3>
      <pre style={pre}>{`
+==========================================================================================+
|                        LEVEL 1: SYSTEM CONTEXT DIAGRAM                                   |
+==========================================================================================+

                    +---------------------+
                    |  Consumer Teams     |
                    |  (Mobile, Web,      |
                    |   Partner, Admin)   |
                    +----------+----------+
                               |
                     Write consumer tests
                     Publish contracts
                               |
                    +----------v----------+
                    |                     |
                    |  CONTRACT TESTING   |
                    |  PLATFORM           |
  +----------+      |                     |      +----------+
  | CI/CD    |<---->|  - Pact Broker      |<---->| Provider |
  | Pipeline |      |  - Contract Store   |      | Teams    |
  | (Jenkins |      |  - Verification     |      | (Account,|
  |  / GHA)  |      |    Engine           |      |  Payment,|
  +----------+      |  - can-i-deploy     |      |  Loan,   |
                    |  - Webhook Service  |      |  Card)   |
                    |                     |      +----------+
                    +----------+----------+
                               |
                     Deploy decisions
                     Audit trail
                               |
                    +----------v----------+
                    |  Deployment         |
                    |  Infrastructure     |
                    |  (Kubernetes/ECS)   |
                    +---------------------+

  External Systems:
  +------------------+    +------------------+    +------------------+
  |  Slack/Teams     |    |  JIRA/Confluence |    |  Grafana/PD      |
  |  (Notifications) |    |  (Documentation) |    |  (Monitoring)    |
  +------------------+    +------------------+    +------------------+
`}</pre>

      <h3 style={{ color: C.header, marginBottom: 12, marginTop: 24 }}>Level 2: Container Diagram</h3>
      <pre style={pre}>{`
+==========================================================================================+
|                        LEVEL 2: CONTAINER DIAGRAM                                        |
+==========================================================================================+

  +-----------------------------------------------------------------------+
  |                    CONTRACT TESTING PLATFORM                           |
  |                                                                       |
  |  +---------------------+        +---------------------+              |
  |  |  PACT BROKER        |        |  POSTGRESQL DB      |              |
  |  |  (Ruby/Docker)      |<------>|  (Contract Store)   |              |
  |  |                     |        |                     |              |
  |  | - REST API          |        | - Pact files (JSON) |              |
  |  | - UI Dashboard      |        | - Verifications     |              |
  |  | - Webhook Manager   |        | - Tags & labels     |              |
  |  | - can-i-deploy      |        | - Audit history     |              |
  |  +----------+----------+        +---------------------+              |
  |             |                                                        |
  |  +----------v----------+        +---------------------+              |
  |  |  WEBHOOK SERVICE    |        |  can-i-deploy CLI   |              |
  |  |  (Event Dispatcher) |        |  (Decision Gate)    |              |
  |  |                     |        |                     |              |
  |  | - Listens to Broker |        | - Queries Broker    |              |
  |  |   events            |        |   verification      |              |
  |  | - Triggers CI jobs  |        |   matrix            |              |
  |  | - Sends Slack/Email |        | - Returns YES/NO    |              |
  |  |   notifications     |        | - Used in CI gate   |              |
  |  +---------------------+        +---------------------+              |
  |                                                                       |
  +-----------------------------------------------------------------------+

  +---------------------+        +---------------------+
  |  CONSUMER TEST      |        |  PROVIDER VERIFIER  |
  |  FRAMEWORK          |        |  FRAMEWORK          |
  |                     |        |                     |
  | - Pact JS/JVM/      |        | - Pact Verifier     |
  |   Python/NET        |        | - State handlers    |
  | - Mock provider     |        | - Replay contract   |
  | - Generate .pact    |        |   against real API  |
  | - Publish to Broker |        | - Publish result    |
  +---------------------+        +---------------------+
`}</pre>

      <h3 style={{ color: C.header, marginBottom: 12, marginTop: 24 }}>Level 3: Component Diagram</h3>
      <pre style={pre}>{`
+==========================================================================================+
|                        LEVEL 3: COMPONENT DIAGRAM                                        |
+==========================================================================================+

  PACT BROKER INTERNALS:
  ======================

  +-------------------------------------------------------------------+
  |  PACT BROKER APPLICATION                                          |
  |                                                                   |
  |  +-------------------+  +-------------------+  +----------------+ |
  |  | PactService       |  | VerificationSvc   |  | WebhookSvc    | |
  |  |                   |  |                   |  |               | |
  |  | - publishPact()   |  | - recordResult()  |  | - onPublish() | |
  |  | - getPact()       |  | - getMatrix()     |  | - dispatch()  | |
  |  | - deletePact()    |  | - canIDeploy()    |  | - retry()     | |
  |  | - diffPacts()     |  | - latestVerif()   |  | - configure() | |
  |  +-------------------+  +-------------------+  +----------------+ |
  |                                                                   |
  |  +-------------------+  +-------------------+  +----------------+ |
  |  | TagService        |  | PacticipantSvc    |  | MatrixService | |
  |  |                   |  |                   |  |               | |
  |  | - createTag()     |  | - register()      |  | - query()     | |
  |  | - getByEnv()      |  | - getVersions()   |  | - resolve()   | |
  |  | - promoteToProd() |  | - getLatest()     |  | - visualize() | |
  |  +-------------------+  +-------------------+  +----------------+ |
  +-------------------------------------------------------------------+

  CONSUMER TEST FRAMEWORK INTERNALS:
  ===================================

  +-------------------------------------------------------------------+
  |  CONSUMER FRAMEWORK                                               |
  |                                                                   |
  |  +-------------------+  +-------------------+  +----------------+ |
  |  | ContractGenerator |  | MockProvider      |  | BrokerClient  | |
  |  |                   |  |                   |  |               | |
  |  | - addInteraction()|  | - start()         |  | - publish()   | |
  |  | - withRequest()   |  | - handleRequest() |  | - tag()       | |
  |  | - willRespond()   |  | - verify()        |  | - canDeploy() | |
  |  | - generatePact()  |  | - stop()          |  | - getMatrix() | |
  |  +-------------------+  +-------------------+  +----------------+ |
  |                                                                   |
  |  +-------------------+  +-------------------+                     |
  |  | MatcherFactory    |  | ProviderState     |                     |
  |  |                   |  | Registry          |                     |
  |  | - like()          |  |                   |                     |
  |  | - eachLike()      |  | - registerState() |                     |
  |  | - term()          |  | - getHandler()    |                     |
  |  | - integer()       |  | - setupState()    |                     |
  |  | - decimal()       |  | - teardownState() |                     |
  |  +-------------------+  +-------------------+                     |
  +-------------------------------------------------------------------+

  PROVIDER VERIFIER INTERNALS:
  ============================

  +-------------------------------------------------------------------+
  |  PROVIDER VERIFIER                                                |
  |                                                                   |
  |  +-------------------+  +-------------------+  +----------------+ |
  |  | ContractVerifier  |  | StateManager      |  | ResultPublisher| |
  |  |                   |  |                   |  |               | |
  |  | - fetchContracts()|  | - setupState()    |  | - publish()   | |
  |  | - replayRequest() |  | - teardownState() |  | - logResult() | |
  |  | - matchResponse() |  | - listStates()    |  | - notifyTeam()| |
  |  | - reportDiff()    |  | - validateState() |  | - tagVersion()| |
  |  +-------------------+  +-------------------+  +----------------+ |
  |                                                                   |
  |  +-------------------+                                            |
  |  | CompatibilityChk  |                                            |
  |  |                   |                                            |
  |  | - checkPending()  |                                            |
  |  | - checkWIP()      |                                            |
  |  | - isBreaking()    |                                            |
  |  | - suggestFix()    |                                            |
  |  +-------------------+                                            |
  +-------------------------------------------------------------------+
`}</pre>

      <h3 style={{ color: C.header, marginBottom: 12, marginTop: 24 }}>Level 4: Key Classes</h3>
      <pre style={pre}>{`
+==========================================================================================+
|                        LEVEL 4: CODE / CLASS DIAGRAM                                     |
+==========================================================================================+

  class PactInteraction {
    - description: string
    - providerState: string
    - request: PactRequest
    - response: PactResponse
    + matches(actual: HttpResponse): MatchResult
    + toJson(): object
  }

  class PactRequest {
    - method: HttpMethod
    - path: string
    - headers: Map<string, Matcher>
    - query: Map<string, string[]>
    - body: Matcher | null
    + matchesActual(request: HttpRequest): boolean
  }

  class PactResponse {
    - status: number
    - headers: Map<string, Matcher>
    - body: Matcher | null
    + matchesActual(response: HttpResponse): MatchResult
  }

  class Matcher {
    <<abstract>>
    + matches(actual: any): boolean
    + generate(): any
    + toJson(): object
  }

  class LikeMatcher extends Matcher {
    - expected: any
    + matches(actual): boolean  // type check only
  }

  class TermMatcher extends Matcher {
    - generate: string
    - regex: string
    + matches(actual): boolean  // regex match
  }

  class EachLikeMatcher extends Matcher {
    - contents: Matcher
    - min: number
    + matches(actual): boolean  // array with element matching
  }

  class VerificationResult {
    - consumer: Pacticipant
    - provider: Pacticipant
    - consumerVersion: string
    - providerVersion: string
    - success: boolean
    - interactions: InteractionResult[]
    - executedAt: DateTime
    + isAllPassed(): boolean
    + getFailures(): InteractionResult[]
    + publishToBroker(): void
  }

  class DeploymentDecision {
    - pacticipant: string
    - version: string
    - environment: string
    - canDeploy: boolean
    - reason: string
    - matrix: VerificationResult[]
    + toJson(): object
    + getBlockingConsumers(): string[]
  }
`}</pre>
    </div>
  );
}

function TechStackTab() {
  const categories = [
    {
      title: 'Contract Testing Frameworks',
      color: C.accent,
      items: [
        { name: 'Pact', version: '5.x / 4.x', desc: 'Consumer-driven contract testing framework. Polyglot (JS, Java, Python, .NET, Go, Ruby). Industry standard for microservice contract testing. Supports HTTP and message interactions.', use: 'Primary contract testing tool for all banking APIs' },
        { name: 'Spring Cloud Contract', version: '4.x', desc: 'Contract testing framework for Spring Boot applications. Generates tests from Groovy/YAML contracts. Strong integration with Spring ecosystem.', use: 'Alternative for Spring Boot provider services' },
        { name: 'Dredd', version: '14.x', desc: 'API description testing tool. Tests API against OpenAPI/API Blueprint documentation. Ensures API implementation matches documentation.', use: 'OpenAPI spec compliance validation' },
        { name: 'Schemathesis', version: '3.x', desc: 'Property-based testing for OpenAPI and GraphQL APIs. Generates test cases automatically from API schema. Finds edge cases.', use: 'Fuzz testing API schemas for edge cases' }
      ]
    },
    {
      title: 'Schema Validation',
      color: C.info,
      items: [
        { name: 'OpenAPI / Swagger', version: '3.1', desc: 'API specification standard. Machine-readable API description. Used for bi-directional contract testing with PactFlow.', use: 'Provider API documentation and schema validation' },
        { name: 'JSON Schema', version: 'Draft 2020-12', desc: 'Schema language for JSON data. Used for request/response body validation. Pact matchers map to JSON Schema concepts.', use: 'Response body schema validation in contracts' },
        { name: 'Apache Avro', version: '1.11', desc: 'Data serialization system with schema evolution support. Used for Kafka event schemas. Schema Registry enforces compatibility.', use: 'Kafka event message schemas (TransactionEvent, AccountEvent)' },
        { name: 'Protocol Buffers', version: '3.x', desc: 'Google language-neutral serialization mechanism. Strongly typed, efficient binary format. Used for gRPC service contracts.', use: 'gRPC internal service communication contracts' }
      ]
    },
    {
      title: 'Broker & Management',
      color: C.warn,
      items: [
        { name: 'Pact Broker (OSS)', version: '2.x', desc: 'Open-source contract broker. Stores pacts, tracks verifications, provides can-i-deploy, webhooks, and network diagrams.', use: 'Self-hosted contract management for development environments' },
        { name: 'PactFlow (SaaS)', version: 'Enterprise', desc: 'Commercial Pact Broker with bi-directional contract testing, team management, RBAC, SSO, and advanced analytics.', use: 'Production contract management with enterprise features' },
        { name: 'Confluent Schema Registry', version: '7.x', desc: 'Schema storage and compatibility checking for Kafka events. Enforces schema evolution rules (backward, forward, full).', use: 'Avro schema management for Kafka message contracts' }
      ]
    },
    {
      title: 'CI/CD Integration',
      color: C.success,
      items: [
        { name: 'Jenkins', version: '2.x', desc: 'Open-source automation server. Webhook-triggered provider verification. can-i-deploy as pipeline gate.', use: 'Primary CI/CD for provider verification pipelines' },
        { name: 'GitHub Actions', version: 'Latest', desc: 'GitHub-native CI/CD. Pact publish on PR, verification status checks, can-i-deploy before merge.', use: 'Consumer-side CI for contract generation and publishing' },
        { name: 'GitLab CI', version: 'Latest', desc: 'GitLab integrated CI/CD. Contract testing stages in .gitlab-ci.yml.', use: 'Alternative CI for teams using GitLab' },
        { name: 'can-i-deploy CLI', version: 'Latest', desc: 'CLI tool that queries Pact Broker verification matrix. Returns deploy decision based on consumer-provider verification status.', use: 'Deployment gate in all CI/CD pipelines' }
      ]
    },
    {
      title: 'Language-Specific Libraries',
      color: C.danger,
      items: [
        { name: 'Pact JVM', version: '4.6.x', desc: 'Java/Kotlin/Scala Pact implementation. JUnit 5 integration. Consumer DSL (PactDslWithProvider) and provider verifier (PactVerifier).', use: 'Java-based banking services (Account API, Payment API)' },
        { name: 'Pact JS', version: '12.x', desc: 'JavaScript/TypeScript Pact implementation. Jest/Mocha integration. Consumer and provider testing for Node.js services.', use: 'Node.js BFF services and frontend contract tests' },
        { name: 'Pact Python', version: '2.x', desc: 'Python Pact implementation. pytest integration. Consumer and provider testing for Python services.', use: 'Python-based ML/analytics services' },
        { name: 'Pact .NET', version: '4.x', desc: '.NET Pact implementation. xUnit/NUnit integration. Consumer and provider testing for .NET services.', use: 'Legacy .NET banking services' }
      ]
    },
    {
      title: 'Monitoring & Observability',
      color: C.muted,
      items: [
        { name: 'Pact Broker Dashboard', version: 'Built-in', desc: 'Built-in web UI showing network diagram, verification matrix, contract versions, and deployment status.', use: 'Primary dashboard for contract health monitoring' },
        { name: 'Grafana', version: '10.x', desc: 'Visualization platform for contract testing metrics. Custom dashboards for verification success rate, contract coverage.', use: 'Custom dashboards for contract testing KPIs' },
        { name: 'Contract Coverage Metrics', version: 'Custom', desc: 'Track percentage of APIs with contracts, verification success rate, average verification time, breaking change frequency.', use: 'Monthly reporting on contract testing adoption and health' }
      ]
    }
  ];

  return (
    <div>
      <h2 style={sectionTitle}>Technology Stack - Contract Testing Platform</h2>
      {categories.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 32 }}>
          <h3 style={{ color: cat.color, marginBottom: 16, fontSize: 18, fontWeight: 600 }}>{cat.title}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
            <thead>
              <tr style={{ background: C.card }}>
                <th style={th}>Technology</th>
                <th style={th}>Version</th>
                <th style={th}>Description</th>
                <th style={th}>Banking Use Case</th>
              </tr>
            </thead>
            <tbody>
              {cat.items.map((item, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
                  <td style={{ ...td, color: C.header, fontWeight: 600, whiteSpace: 'nowrap' }}>{item.name}</td>
                  <td style={{ ...td, color: C.accent, fontFamily: 'monospace', fontSize: 12 }}>{item.version}</td>
                  <td style={{ ...td, fontSize: 12, color: C.muted }}>{item.desc}</td>
                  <td style={{ ...td, fontSize: 12, color: C.text }}>{item.use}</td>
                </tr>
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
      <h2 style={sectionTitle}>Software Architecture Decisions</h2>

      <h3 style={{ color: C.header, marginBottom: 16 }}>Key Architecture Decisions</h3>

      {[
        {
          id: 'ADR-01', title: 'Pact over Spring Cloud Contract',
          context: 'Banking platform uses multiple languages: Java (Account API, Payment API), Node.js (BFF, Partner Gateway), Python (Fraud ML), .NET (Legacy Card Service). Need a polyglot contract testing solution.',
          decision: 'Chose Pact as the primary contract testing framework.',
          rationale: [
            'Polyglot support: Pact has mature libraries for Java, JavaScript, Python, .NET, Go, Ruby',
            'Broker ecosystem: Pact Broker provides centralized contract storage, verification matrix, can-i-deploy, webhooks',
            'Industry standard: Widely adopted in financial services, strong community support',
            'Consumer-driven: Better fit for our multi-team, multi-consumer architecture',
            'Spring Cloud Contract is Spring-specific, would not cover Node.js/Python services'
          ],
          tradeoffs: 'Spring Cloud Contract has tighter Spring Boot integration and Groovy DSL. Pact requires more setup but provides cross-language compatibility.',
          status: 'Accepted'
        },
        {
          id: 'ADR-02', title: 'Consumer-Driven vs Provider-Driven Contracts',
          context: 'Debate on who should own the API contract: consumer teams or provider teams. Provider-driven means provider publishes OpenAPI spec, consumers must adapt. Consumer-driven means consumers define what they need.',
          decision: 'Adopted consumer-driven contract testing as the primary approach, with bi-directional testing for select APIs.',
          rationale: [
            'Consumer-driven ensures providers only break contracts that consumers actually rely on',
            'Providers can safely add new fields/endpoints without impacting anyone',
            'Multiple consumers (Mobile, Web, Partner) each define their specific needs',
            'Reduces over-specification: contracts capture actual usage, not theoretical API surface',
            'Bi-directional testing used for Partner APIs where provider spec is the source of truth'
          ],
          tradeoffs: 'Consumer-driven requires all consumer teams to write Pact tests. Provider-driven is simpler but risks over-coupling to full API spec.',
          status: 'Accepted'
        },
        {
          id: 'ADR-03', title: 'Bi-Directional Contract Testing for Partner APIs',
          context: 'External partner APIs (NPCI, Credit Bureau, Fintech) provide OpenAPI specs. We cannot run Pact provider verification against external services. Need a way to validate our consumer expectations against their spec.',
          decision: 'Use PactFlow bi-directional contract testing for external partner APIs.',
          rationale: [
            'Partner publishes OpenAPI spec; we compare our Pact consumer contract against it',
            'No need to run verification against partner production API',
            'Detects mismatches between our expectations and partner spec before integration',
            'PactFlow handles the cross-comparison automatically',
            'Can be triggered when partner publishes updated spec'
          ],
          tradeoffs: 'PactFlow is a commercial product (cost). Only validates schema compatibility, not runtime behavior. Still need integration tests for end-to-end validation.',
          status: 'Accepted'
        },
        {
          id: 'ADR-04', title: 'When to Use Pact vs OpenAPI Validation',
          context: 'Some teams question whether Pact is needed when OpenAPI specs already exist. Need clear guidance on when to use each approach.',
          decision: 'Use Pact for inter-service contracts (consumer-specific), OpenAPI validation for API documentation compliance.',
          rationale: [
            'Pact: tests what each consumer actually uses (subset of full API)',
            'OpenAPI: validates that API implementation matches documentation (full spec)',
            'Pact catches: provider breaking a field that consumer relies on',
            'OpenAPI catches: API diverging from documented behavior',
            'Both are complementary, not competing approaches'
          ],
          tradeoffs: 'Running both increases test execution time. But each catches different categories of issues. Worth the overhead for critical banking APIs.',
          status: 'Accepted'
        },
        {
          id: 'ADR-05', title: 'Contract Granularity Guidelines',
          context: 'Contracts that are too specific become brittle (break on minor changes). Contracts that are too loose miss real issues. Need to define the right level of granularity.',
          decision: 'Established contract granularity guidelines: test shape not values, use matchers, avoid exact body matching.',
          rationale: [
            'Use like() matcher for field types, not exact values',
            'Use term() matcher with regex for enums (ACTIVE|DORMANT|FROZEN)',
            'Use eachLike() for arrays (at least one element matching shape)',
            'Test HTTP status codes and response structure, not specific error messages',
            'Provider states should set up minimal data, not replicate production state',
            'Avoid testing business logic in contracts (that belongs in provider unit tests)'
          ],
          tradeoffs: 'Loose contracts may miss subtle issues (e.g., date format changes). But brittle contracts cause false failures and erode team trust in contract testing.',
          status: 'Accepted'
        }
      ].map((adr, i) => (
        <div key={i} style={{ ...cardStyle, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ color: C.accent, fontSize: 16, margin: 0 }}>{adr.id}: {adr.title}</h4>
            <span style={{ background: adr.status === 'Accepted' ? C.success : C.warn, color: '#000', padding: '2px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{adr.status}</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: C.header, fontSize: 13 }}>Context:</strong>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: '4px 0' }}>{adr.context}</p>
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: C.header, fontSize: 13 }}>Decision:</strong>
            <p style={{ color: C.text, fontSize: 13, lineHeight: 1.6, margin: '4px 0' }}>{adr.decision}</p>
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: C.header, fontSize: 13 }}>Rationale:</strong>
            <ul style={{ color: C.text, fontSize: 13, lineHeight: 1.7, paddingLeft: 20, margin: '4px 0' }}>
              {adr.rationale.map((r, j) => <li key={j}>{r}</li>)}
            </ul>
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: C.header, fontSize: 13 }}>Trade-offs:</strong>
            <p style={{ color: C.warn, fontSize: 13, lineHeight: 1.6, margin: '4px 0', fontStyle: 'italic' }}>{adr.tradeoffs}</p>
          </div>
        </div>
      ))}

      <h3 style={{ color: C.header, marginBottom: 16, marginTop: 32 }}>Best Practices</h3>
      <div style={gridStyle}>
        {[
          { title: 'DO: Test Shape, Not Values', items: ['Use like() for type matching', 'Use term() with regex for enums', 'Use eachLike() for arrays', 'Focus on response structure'], color: C.success },
          { title: 'DO: Use Provider States', items: ['Setup minimal test data per interaction', 'Name states descriptively', 'Teardown after verification', 'Keep states idempotent'], color: C.success },
          { title: 'DO: Tag Per Environment', items: ['Tag contracts after each deploy', 'Use can-i-deploy with --to-environment', 'Promote tags through pipeline', 'Branch-based tags for feature work'], color: C.success },
          { title: 'DO NOT: Test Business Logic', items: ['Contracts verify API shape, not behavior', 'Business rules tested in provider unit tests', 'Do not assert calculated values', 'Do not test authorization rules in contracts'], color: C.danger },
          { title: 'DO NOT: Use Exact Body Matching', items: ['Exact matching is brittle', 'Any additive change breaks contract', 'Use matchers for flexibility', 'Only match fields consumer uses'], color: C.danger },
          { title: 'DO NOT: Share Test Databases', items: ['Each verification uses isolated data', 'Provider states create needed data', 'No dependency on external state', 'Tests must be reproducible'], color: C.danger }
        ].map((card, i) => (
          <div key={i} style={{ ...cardStyle, borderLeft: '4px solid ' + card.color }}>
            <h4 style={{ color: card.color, marginBottom: 10, fontSize: 14 }}>{card.title}</h4>
            <ul style={{ color: C.text, fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
              {card.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowchartTab() {
  return (
    <div>
      <h2 style={sectionTitle}>Contract Testing Flowchart</h2>

      <h3 style={{ color: C.header, marginBottom: 12 }}>Consumer Contract Lifecycle</h3>
      <pre style={pre}>{`
+==========================================================================================+
|                    CONTRACT TESTING FLOWCHART - FULL LIFECYCLE                            |
+==========================================================================================+

                               +----------------------------+
                               |  Developer writes          |
                               |  consumer Pact test        |
                               |  (describe API need)       |
                               +-------------+--------------+
                                             |
                                             v
                               +----------------------------+
                               |  Run consumer test suite   |
                               |  (Jest/JUnit/pytest)       |
                               +-------------+--------------+
                                             |
                                             v
                               +----------------------------+
                               |  Pact framework generates  |
                               |  .pact JSON contract file  |
                               |  (interactions + matchers) |
                               +-------------+--------------+
                                             |
                                             v
                               +----------------------------+
                               |  Consumer CI publishes     |
                               |  contract to Pact Broker   |
                               |  (with version + branch)   |
                               +-------------+--------------+
                                             |
                                             v
                               +----------------------------+
                               |  Pact Broker stores        |
                               |  contract and fires        |
                               |  webhook event             |
                               +------+----------+----------+
                                      |          |
                              +-------v--+  +----v-----------+
                              | Notify   |  | Trigger        |
                              | Slack    |  | Provider CI    |
                              | channel  |  | pipeline       |
                              +----------+  +----+-----------+
                                                 |
                                                 v
                               +----------------------------+
                               |  Provider CI fetches       |
                               |  consumer contracts from   |
                               |  Pact Broker               |
                               +-------------+--------------+
                                             |
                                             v
                               +----------------------------+
                               |  Provider state handlers   |
                               |  setup test data           |
                               |  (insert accounts, etc.)   |
                               +-------------+--------------+
                                             |
                                             v
                               +----------------------------+
                               |  Provider verifier replays |
                               |  each interaction against  |
                               |  running provider API      |
                               +-------------+--------------+
                                             |
                                             v
                               +----------------------------+
                               |  All interactions          |
                               |  verified?                 |
                               +------+----------+----------+
                                      |          |
                                YES   |          |  NO
                                      v          v
                        +-------------+--+  +----+-----------+
                        | Mark contract  |  | Log failure    |
                        | as VERIFIED    |  | details:       |
                        | in Pact Broker |  | - expected vs  |
                        +--------+-------+  |   actual       |
                                 |          | - interaction  |
                                 |          |   that failed  |
                                 |          +----+-----------+
                                 |               |
                                 |               v
                                 |          +----+-----------+
                                 |          | BLOCK provider |
                                 |          | deployment     |
                                 |          |                |
                                 |          | Notify consumer|
                                 |          | team: "Your    |
                                 |          | contract is    |
                                 |          | broken"        |
                                 |          +----------------+
                                 |
                                 v
                        +----------------------------+
                        |  Consumer runs             |
                        |  can-i-deploy check:       |
                        |                            |
                        |  pact-broker can-i-deploy  |
                        |  --pacticipant MobileBank  |
                        |  --version 3.2.1           |
                        |  --to-environment prod     |
                        +------+----------+----------+
                               |          |
                         YES   |          |  NO
                               v          v
                 +-------------+--+  +----+-----------+
                 | All providers  |  | Some providers |
                 | verified?      |  | unverified     |
                 |                |  |                |
                 | YES: Deploy    |  | NO: Block      |
                 | to environment |  | deployment     |
                 +--------+-------+  +----------------+
                          |
                          v
                 +----------------------------+
                 |  Deploy service to         |
                 |  target environment        |
                 +-------------+--------------+
                               |
                               v
                 +----------------------------+
                 |  Tag contract with         |
                 |  environment label:        |
                 |                            |
                 |  pact-broker               |
                 |  create-version-tag        |
                 |  --pacticipant MobileBank  |
                 |  --version 3.2.1           |
                 |  --tag prod                |
                 +----------------------------+


  BREAKING CHANGE DETECTION FLOW:
  ================================

  +-------------------+     +-------------------+     +-------------------+
  |  Provider team    |     |  Run provider     |     |  Contract         |
  |  removes field    |---->|  verification     |---->|  verification     |
  |  "middleName"     |     |  against all      |     |  FAILS for        |
  |  from Account API |     |  consumer         |     |  MobileBanking    |
  +-------------------+     |  contracts        |     |  (uses middleName)|
                            +-------------------+     +--------+----------+
                                                               |
                                                               v
                            +-------------------+     +--------+----------+
                            |  Provider team    |     |  can-i-deploy     |
                            |  negotiates with  |<----|  BLOCKS deployment|
                            |  Mobile team:     |     |  "Computer says   |
                            |  - Add grace      |     |   no"             |
                            |    period         |     +-------------------+
                            |  - Deprecate      |
                            |    field first    |
                            |  - Mobile updates |
                            |    contract       |
                            +-------------------+
`}</pre>
    </div>
  );
}

function SequenceDiagramTab() {
  return (
    <div>
      <h2 style={sectionTitle}>Sequence Diagram - Contract Testing Lifecycle</h2>

      <h3 style={{ color: C.header, marginBottom: 12 }}>Full Contract Lifecycle: Generation to Deployment</h3>
      <pre style={pre}>{`
+==========================================================================================+
|         SEQUENCE DIAGRAM - CONTRACT TESTING LIFECYCLE (Banking Platform)                  |
+==========================================================================================+

  Consumer     Consumer    Pact        Webhook     Provider    Provider     Deployment
  Developer    CI          Broker      Service     CI          Service      Pipeline
  |            |           |           |           |           |            |
  |  Write     |           |           |           |           |            |
  |  Pact test |           |           |           |           |            |
  |----------->|           |           |           |           |            |
  |            |           |           |           |           |            |
  |  Push code |           |           |           |           |            |
  |  to branch |           |           |           |           |            |
  |----------->|           |           |           |           |            |
  |            |           |           |           |           |            |
  |            | Run consumer tests    |           |           |            |
  |            |---------->|           |           |           |            |
  |            |           |           |           |           |            |
  |            | Generate .pact file   |           |           |            |
  |            |---------->|           |           |           |            |
  |            |           |           |           |           |            |
  |            | Publish contract      |           |           |            |
  |            | (version: 3.2.1,      |           |           |            |
  |            |  branch: main)        |           |           |            |
  |            |---------->|           |           |           |            |
  |            |           |           |           |           |            |
  |            |           | Store     |           |           |            |
  |            |           | contract  |           |           |            |
  |            |           |---------->|           |           |            |
  |            |           |           |           |           |            |
  |            |           | Fire webhook          |           |            |
  |            |           | (contract-published)   |           |            |
  |            |           |---------->|           |           |            |
  |            |           |           |           |           |            |
  |            |           |           | Trigger   |           |            |
  |            |           |           | provider  |           |            |
  |            |           |           | CI build  |           |            |
  |            |           |           |---------->|           |            |
  |            |           |           |           |           |            |
  |            |           |           |           | Fetch     |            |
  |            |           |           |           | contracts |            |
  |            |           |           |           | from      |            |
  |            |           |           |           | Broker    |            |
  |            |           |<--------------------------|      |            |
  |            |           |           |           |           |            |
  |            |           | Return    |           |           |            |
  |            |           | consumer  |           |           |            |
  |            |           | contracts |           |           |            |
  |            |           |-------------------------->|      |            |
  |            |           |           |           |           |            |
  |            |           |           |           | Setup     |            |
  |            |           |           |           | provider  |            |
  |            |           |           |           | states    |            |
  |            |           |           |           |---------->|            |
  |            |           |           |           |           |            |
  |            |           |           |           |           | Create     |
  |            |           |           |           |           | test data  |
  |            |           |           |           |           | (accounts, |
  |            |           |           |           |           |  payments) |
  |            |           |           |           |           |            |
  |            |           |           |           | Replay    |            |
  |            |           |           |           | each      |            |
  |            |           |           |           | interaction|           |
  |            |           |           |           |---------->|            |
  |            |           |           |           |           |            |
  |            |           |           |           |           | Process    |
  |            |           |           |           |           | request    |
  |            |           |           |           |           | and return |
  |            |           |           |           |           | response   |
  |            |           |           |           |<----------|            |
  |            |           |           |           |           |            |
  |            |           |           |           | Match     |            |
  |            |           |           |           | response  |            |
  |            |           |           |           | against   |            |
  |            |           |           |           | contract  |            |
  |            |           |           |           | matchers  |            |
  |            |           |           |           |           |            |
  |            |           |           |           | Publish   |            |
  |            |           |           |           | verification           |
  |            |           |           |           | result    |            |
  |            |           |<--------------------------|      |            |
  |            |           |           |           |           |            |
  |            |           | Store     |           |           |            |
  |            |           | result    |           |           |            |
  |            |           | (PASS/    |           |           |            |
  |            |           |  FAIL)    |           |           |            |
  |            |           |           |           |           |            |
  |            |           | Fire webhook          |           |            |
  |            |           | (verification-result)  |           |            |
  |            |           |---------->|           |           |            |
  |            |           |           |           |           |            |
  |            |           |           | Notify    |           |            |
  |            |           |           | consumer  |           |            |
  |            |           |           | team via  |           |            |
  |            |           |           | Slack     |           |            |
  |            |           |           |---------->|           |            |
  |            |           |           |           |           |            |
  |  (When ready to deploy)|          |           |           |            |
  |            |           |           |           |           |            |
  |            | can-i-deploy?         |           |           |            |
  |            | --pacticipant         |           |           |            |
  |            |   MobileBanking       |           |           |            |
  |            | --version 3.2.1       |           |           |            |
  |            | --to-environment prod |           |           |            |
  |            |---------->|           |           |           |            |
  |            |           |           |           |           |            |
  |            |           | Query     |           |           |            |
  |            |           | matrix    |           |           |            |
  |            |           | for all   |           |           |            |
  |            |           | providers |           |           |            |
  |            |           |           |           |           |            |
  |            |           | Return:   |           |           |            |
  |            |           | "Computer |           |           |            |
  |            |           |  says yes"|           |           |            |
  |            |<----------|           |           |           |            |
  |            |           |           |           |           |            |
  |            | Deploy to production  |           |           |            |
  |            |------------------------------------------------------>|   |
  |            |           |           |           |           |        |   |
  |            |           |           |           |           |  Deploy|   |
  |            |           |           |           |           |  to K8s|   |
  |            |           |           |           |           |        |   |
  |            | Tag contract with "prod"          |           |        |   |
  |            |---------->|           |           |           |        |   |
  |            |           |           |           |           |        |   |
  |            |           | Store     |           |           |        |   |
  |            |           | env tag   |           |           |        |   |
  |            |           | "prod"    |           |           |        |   |
  |            |           |           |           |           |        |   |
  |            |           |           |           |           |        |   |
  DONE         DONE        DONE        DONE        DONE        DONE    DONE


  ALTERNATIVE FLOW - VERIFICATION FAILURE:
  =========================================

  Consumer     Consumer    Pact        Provider    Slack
  Developer    CI          Broker      CI          Channel
  |            |           |           |           |
  |            |           |   (Provider removes   |
  |            |           |    required field)     |
  |            |           |           |           |
  |            |           |           | Verify    |
  |            |           |           | contracts |
  |            |           |           |           |
  |            |           |           | FAIL:     |
  |            |           |           | Missing   |
  |            |           |           | field     |
  |            |           |           | "middleName"|
  |            |           |           |           |
  |            |           | Publish   |           |
  |            |           | FAIL      |           |
  |            |           | result    |           |
  |            |           |<----------|           |
  |            |           |           |           |
  |            |           | Webhook:  |           |
  |            |           | notify    |           |
  |            |           |-----------|---------->|
  |            |           |           |           |
  |            |           |           |           | @mobile-team
  |            |           |           |           | Contract BROKEN
  |            |           |           |           | for AccountAPI
  |            |           |           |           | Missing: middleName
  |            |           |           |           |
  |  Receive   |           |           |           |
  |  Slack     |           |           |           |
  |  alert     |<---------------------------------|
  |            |           |           |           |
  |  Fix       |           |           |           |
  |  consumer  |           |           |           |
  |  contract  |           |           |           |
  |  OR        |           |           |           |
  |  Ask provider          |           |           |
  |  to keep field         |           |           |
  |            |           |           |           |


  MULTI-CONSUMER VERIFICATION SEQUENCE:
  ======================================

  AccountAPI    Pact         MobileBanking   WebPortal     PartnerAPI
  (Provider)    Broker       Contract        Contract      Contract
  |             |            |               |             |
  | Fetch all   |            |               |             |
  | consumer    |            |               |             |
  | contracts   |            |               |             |
  |------------>|            |               |             |
  |             |            |               |             |
  |    Return 3 contracts    |               |             |
  |<------------|            |               |             |
  |             |            |               |             |
  | Verify MobileBanking     |               |             |
  |------------------------->|               |             |
  |             |       PASS |               |             |
  |<-------------------------|               |             |
  |             |            |               |             |
  | Verify WebPortal         |               |             |
  |----------------------------------------->|             |
  |             |            |          PASS |             |
  |<-----------------------------------------|             |
  |             |            |               |             |
  | Verify PartnerAPI        |               |             |
  |------------------------------------------------------->|
  |             |            |               |        PASS |
  |<-------------------------------------------------------|
  |             |            |               |             |
  | Publish: ALL VERIFIED    |               |             |
  |------------>|            |               |             |
  |             |            |               |             |
  | can-i-deploy: YES        |               |             |
  |<------------|            |               |             |
  |             |            |               |             |
`}</pre>
    </div>
  );
}

export default function ContractTestingArch() {
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, ' + C.bgFrom + ' 0%, ' + C.bgTo + ' 100%)', padding: '32px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{ color: C.header, fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
            Contract Testing Architecture
          </h1>
          <p style={{ color: C.muted, fontSize: 16, maxWidth: 800, margin: '0 auto' }}>
            Consumer-Driven Contract Testing for Banking Microservices - Pact, API Schema Validation, and CI/CD Integration
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32, justifyContent: 'center', background: C.card, padding: 12, borderRadius: 12, border: '1px solid ' + C.border }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.2s ease',
                background: activeTab === tab.key ? C.accent : 'transparent',
                color: activeTab === tab.key ? '#000' : C.text
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ ...cardStyle, padding: 32 }}>
          {renderTab()}
        </div>
      </div>
    </div>
  );
}

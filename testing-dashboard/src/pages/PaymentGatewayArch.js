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

export default function PaymentGatewayArch() {
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
      <h2 style={sectionTitle}>Payment Gateway Testing Platform Architecture</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Enterprise-grade payment gateway testing architecture for Indian banking ecosystem covering Card payments (Visa/MasterCard/RuPay), UPI, NEFT, RTGS, IMPS, Wallets, and NACH. Designed for event-driven, CQRS, and Saga-based payment orchestration with PCI-DSS Level 1 compliance.
      </p>

      <pre style={preStyle}>{`
+=============================================================================+
|                  PAYMENT GATEWAY TESTING PLATFORM                            |
|                    Banking QA Architecture Overview                           |
+=============================================================================+

  CUSTOMER LAYER              GATEWAY LAYER                 NETWORK LAYER
  ==============              =============                 =============

  +----------------+     +---------------------+
  | Customer       |     |                     |      +---------------------+
  | Browser / App  |---->|  WAF (Web App        |      | Card Networks       |
  | (Web / Mobile) |     |  Firewall)           |      |                     |
  +----------------+     +----------+----------+      | +-------+ +-------+ |
                                    |                  | | Visa  | |Master | |
                                    v                  | | Net   | | Card  | |
                         +---------------------+      | +-------+ +-------+ |
                         | API Gateway          |      |                     |
                         | (Rate Limit, Auth,   |      | +-------+ +-------+ |
                         |  Routing, TLS Term)  |      | | RuPay | | AMEX  | |
                         +----------+----------+      | | (NPCI) | |       | |
                                    |                  | +-------+ +-------+ |
                                    v                  +----------+----------+
                         +---------------------+                  ^
                         | Payment Service      |                  |
                         | (Orchestrator)        |------------------+
                         |                      |
                         | +------------------+ |      +---------------------+
                         | | Fraud Detection  | |      | Payment Gateways    |
                         | | Engine           | |      |                     |
                         | +------------------+ |      | +-------+ +-------+ |
                         |                      |      | |Stripe | |Razor  | |
                         | +------------------+ |      | |       | | pay   | |
                         | | Tokenization     | |----->| +-------+ +-------+ |
                         | | Service          | |      |                     |
                         | +------------------+ |      | +-------+ +-------+ |
                         |                      |      | | PayU  | | CC    | |
                         | +------------------+ |      | |       | |Avenue | |
                         | | 3D Secure        | |      | +-------+ +-------+ |
                         | | Handler          | |      +---------------------+
                         | +------------------+ |
                         |                      |      +---------------------+
                         | +------------------+ |      | Banking Rails       |
                         | | Settlement       | |      |                     |
                         | | Engine           | |----->| +-------+ +-------+ |
                         | +------------------+ |      | | UPI   | | NEFT  | |
                         |                      |      | | (NPCI)| |       | |
                         | +------------------+ |      | +-------+ +-------+ |
                         | | Reconciliation   | |      |                     |
                         | | Service          | |      | +-------+ +-------+ |
                         | +------------------+ |      | | RTGS  | | IMPS  | |
                         +---------------------+      | |       | |       | |
                                    |                  | +-------+ +-------+ |
                                    v                  +----------+----------+
                         +---------------------+                  |
                         | Issuing Bank         |<-----------------+
                         | (Authorization &     |
                         |  Settlement)         |
                         +---------------------+


  ARCHITECTURE PATTERNS
  =====================

  +---------------------+    +---------------------+    +---------------------+
  | Event-Driven        |    | CQRS                |    | Saga Pattern        |
  | Architecture        |    | (Command Query      |    | (Distributed Txn)   |
  |                     |    |  Responsibility     |    |                     |
  | - Kafka event bus   |    |  Segregation)       |    | - Orchestration     |
  | - Async processing  |    |                     |    |   based sagas       |
  | - Event sourcing    |    | - Write model for   |    | - Compensating      |
  | - Eventual          |    |   payment commands  |    |   transactions      |
  |   consistency       |    | - Read model for    |    | - Idempotency       |
  | - Dead letter queue |    |   transaction query |    |   guarantees        |
  | - Retry with        |    | - Separate DBs for  |    | - Timeout handling  |
  |   backoff           |    |   read/write        |    | - Rollback chains   |
  +---------------------+    +---------------------+    +---------------------+
`}</pre>

      <h3 style={sectionTitle}>Core Components</h3>
      <div style={gridStyle}>
        {[
          { title:'Payment Orchestrator', desc:'Central coordination engine managing payment lifecycle from initiation through settlement. Handles routing to appropriate gateway/rail based on payment method, amount, and merchant configuration. Implements saga pattern for distributed transaction management.', reg:'PCI-DSS Level 1', color:C.accent },
          { title:'Fraud Detection Engine', desc:'Real-time fraud scoring using ML models (velocity checks, device fingerprinting, geo-anomaly, behavioral analysis). Risk threshold-based auto-block for high-risk transactions. Integrates with 3rd party fraud providers for enhanced detection.', reg:'RBI Fraud Guidelines', color:C.danger },
          { title:'Tokenization Service', desc:'PCI-DSS compliant card tokenization replacing sensitive PAN with non-reversible tokens. Supports network tokenization (Visa/MC/RuPay token specs), merchant-level tokens, and acquirer tokens. Token vault with HSM integration.', reg:'RBI Card Tokenization Mandate', color:C.warn },
          { title:'3D Secure Handler', desc:'3DS 2.0 authentication flow management for card-not-present transactions. Handles challenge/frictionless flows, device data collection, risk-based authentication. Supports Visa Secure, MC Identity Check, RuPay PaySecure.', reg:'EMV 3DS 2.0 / PCI 3DS', color:C.info },
          { title:'Settlement Engine', desc:'End-of-day settlement processing with acquiring banks and payment networks. Handles gross/net settlement, multi-currency conversion, interchange fee computation, and merchant payout scheduling.', reg:'RBI Settlement Guidelines', color:C.success },
          { title:'Reconciliation Service', desc:'Automated 3-way reconciliation between payment gateway, acquiring bank, and merchant records. Detects discrepancies in settlement amounts, identifies missing/orphan transactions, and generates exception reports.', reg:'Banking Recon Standards', color:C.accent }
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
        Payment Gateway Testing Framework for Indian Banking - Business Requirements covering secure multi-channel payment processing across Card, UPI, NEFT, RTGS, IMPS, Wallets, and NACH payment instruments.
      </p>

      <h3 style={subTitle}>Objectives</h3>
      <div style={cardStyle}>
        <ul style={{ color:C.text, lineHeight:2, paddingLeft:20 }}>
          <li>Enable <strong style={{ color:C.accent }}>secure multi-channel payment processing</strong> across all payment instruments (Card, UPI, NEFT, RTGS, IMPS, Wallets, NACH)</li>
          <li>Achieve <strong style={{ color:C.accent }}>PCI-DSS Level 1 compliance</strong> for all card-based payment flows end-to-end</li>
          <li>Support <strong style={{ color:C.accent }}>1000+ TPS (transactions per second)</strong> sustained throughput with auto-scaling</li>
          <li>Ensure end-to-end payment latency of <strong style={{ color:C.danger }}>less than 2 seconds</strong> for 95th percentile</li>
          <li>Achieve <strong style={{ color:C.accent }}>99.99% uptime</strong> for payment processing services across all channels</li>
          <li>Implement real-time fraud detection with <strong style={{ color:C.danger }}>sub-100ms scoring latency</strong> per transaction</li>
        </ul>
      </div>

      <h3 style={sectionTitle}>Functional Requirements</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>FR-ID</th>
            <th style={thStyle}>Requirement</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Payment Channel</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id:'FR-01', title:'Card Payment Initiation', desc:'Accept Visa, MasterCard, RuPay, AMEX card payments via secure PCI-compliant hosted checkout or server-to-server API integration', channel:'Card' },
            { id:'FR-02', title:'3D Secure Authentication', desc:'Implement 3DS 2.0 challenge and frictionless flows for card-not-present transactions with ACS and DS integration', channel:'Card' },
            { id:'FR-03', title:'UPI Collect Payment', desc:'Generate UPI collect request to customer VPA, handle callback from NPCI, verify payment status with UPI switch', channel:'UPI' },
            { id:'FR-04', title:'UPI Intent Payment', desc:'Generate UPI intent deeplink/QR code, handle PSP app callback, verify with UPI switch via check transaction status API', channel:'UPI' },
            { id:'FR-05', title:'NEFT Transfer', desc:'Initiate NEFT transfers via core banking integration, handle batch processing windows, track settlement status', channel:'NEFT' },
            { id:'FR-06', title:'RTGS Transfer', desc:'Process real-time gross settlement for high-value transactions (>= INR 2 Lakhs), ensure immediate finality', channel:'RTGS' },
            { id:'FR-07', title:'IMPS Transfer', desc:'Enable instant 24x7 payment transfers via NPCI IMPS rail with MMID/mobile or account number + IFSC', channel:'IMPS' },
            { id:'FR-08', title:'Wallet Payment', desc:'Integrate with bank wallets and third-party wallets (Paytm, PhonePe, Amazon Pay) for payment acceptance', channel:'Wallet' },
            { id:'FR-09', title:'NACH Mandate', desc:'Register, modify, and revoke NACH mandates for recurring payments (SIP, EMI, subscriptions) via NPCI', channel:'NACH' },
            { id:'FR-10', title:'Card Tokenization', desc:'Tokenize card PAN per RBI mandate, support network tokens (Visa/MC/RuPay), manage token lifecycle', channel:'Card' },
            { id:'FR-11', title:'Refund Processing', desc:'Process full and partial refunds with original transaction reference, handle refund to source, track refund status', channel:'All' },
            { id:'FR-12', title:'Chargeback Management', desc:'Handle chargeback notifications from card networks, manage representment workflow, track arbitration', channel:'Card' },
            { id:'FR-13', title:'Multi-Currency Support', desc:'Accept payments in 25+ currencies with real-time FX rate conversion, DCC (Dynamic Currency Conversion)', channel:'Card/SWIFT' },
            { id:'FR-14', title:'Recurring Payments', desc:'Support subscription billing with auto-debit via tokenized cards, UPI autopay mandates, and NACH mandates', channel:'Card/UPI/NACH' },
            { id:'FR-15', title:'Settlement & Reconciliation', desc:'Automated T+1/T+2 settlement, 3-way reconciliation (gateway-bank-merchant), exception handling', channel:'All' }
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:700, textAlign:'center' }}>{r.id}</td>
              <td style={{ ...tdStyle, fontWeight:600, color:C.header }}>{r.title}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.desc}</td>
              <td style={{ ...tdStyle, textAlign:'center' }}>{badge(
                r.channel === 'Card' ? C.info : r.channel === 'UPI' ? C.accent : r.channel === 'All' ? C.success : r.channel.includes('NACH') ? C.warn : C.muted,
                r.channel
              )}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={sectionTitle}>Non-Functional Requirements (NFRs)</h3>
      <div style={gridStyle}>
        {[
          { title:'Payment Latency', value:'< 2s (P95)', desc:'End-to-end payment processing from initiation to gateway response must complete within 2 seconds for 95th percentile. Includes fraud check, tokenization, 3DS, and gateway call.', color:C.danger },
          { title:'System Availability', value:'99.99%', desc:'Payment platform must maintain 99.99% uptime (max 52 minutes downtime/year). Active-active multi-AZ deployment with automatic failover and zero-downtime deployments.', color:C.success },
          { title:'PCI-DSS Compliance', value:'Level 1', desc:'Full PCI-DSS Level 1 compliance for card data handling. Annual QSA audit, quarterly ASV scans, network segmentation, HSM for key management, tokenization for PAN storage.', color:C.info },
          { title:'Transaction Throughput', value:'1000 TPS', desc:'Sustained throughput of 1000 transactions per second with ability to burst to 3000 TPS during peak sales events (festive season, flash sales). Auto-scaling infrastructure.', color:C.accent },
          { title:'Fraud Detection SLA', value:'< 100ms', desc:'Real-time fraud scoring must complete within 100ms per transaction. ML model inference, velocity checks, device fingerprinting, and geo-anomaly detection within this budget.', color:C.warn },
          { title:'Data Retention', value:'7 years', desc:'Transaction records, audit logs, and settlement data retained for 7 years per RBI guidelines. Automated archival to cold storage after 1 year. GDPR-compliant data lifecycle management.', color:C.accent }
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
        High-level payment gateway architecture showing transaction flow through security boundaries, payment orchestration, gateway integration, settlement, and reconciliation subsystems.
      </p>

      <pre style={preStyle}>{`
+=============================================================================+
|              HIGH-LEVEL PAYMENT GATEWAY ARCHITECTURE                         |
+=============================================================================+

   SECURITY BOUNDARIES
   ====================

   +----------------------------------------------------------------------+
   |  DMZ (Demilitarized Zone)                                             |
   |                                                                       |
   |  +------------------+    +------------------+    +-----------------+  |
   |  | WAF              |    | DDoS Protection  |    | TLS Termination |  |
   |  | (ModSecurity /   |    | (CloudFlare /    |    | (nginx / F5)    |  |
   |  |  AWS WAF)        |    |  AWS Shield)     |    | TLS 1.2+ only   |  |
   |  +--------+---------+    +--------+---------+    +--------+--------+  |
   |           |                       |                       |           |
   +----------------------------------------------------------------------+
               |                       |                       |
               v                       v                       v
   +----------------------------------------------------------------------+
   |  PCI-DSS CDE (Cardholder Data Environment)                            |
   |                                                                       |
   |  +------------------+    +------------------+    +-----------------+  |
   |  | API Gateway      |    | Payment          |    | Token Vault     |  |
   |  | - Auth (OAuth2)  |    | Orchestrator     |    | - Card tokens   |  |
   |  | - Rate limiting  |    | - Saga mgmt      |    | - HSM backed    |  |
   |  | - Request valid  |    | - Gateway router  |    | - PCI scoped    |  |
   |  | - Idempotency    |    | - Retry logic     |    | - AES-256 enc   |  |
   |  +--------+---------+    +--------+---------+    +-----------------+  |
   |           |                       |                                   |
   |  +------------------+    +------------------+    +-----------------+  |
   |  | Fraud Engine     |    | 3DS Server       |    | Settlement      |  |
   |  | - ML scoring     |    | - ACS connect    |    | Engine          |  |
   |  | - Velocity check |    | - Challenge flow |    | - T+1 / T+2    |  |
   |  | - Device ID      |    | - RBA engine     |    | - Net / Gross   |  |
   |  | - Geo fencing    |    | - EMV 3DS 2.0    |    | - Multi-currency|  |
   |  +------------------+    +------------------+    +-----------------+  |
   |                                                                       |
   +----------------------------------------------------------------------+


   DATA FLOW
   =========

   Customer --> API Gateway --> Fraud Engine --> Payment Orchestrator
                                                        |
                                        +---------------+---------------+
                                        |               |               |
                                        v               v               v
                                  +-----------+   +-----------+   +-----------+
                                  | Card      |   | UPI       |   | Bank      |
                                  | Gateway   |   | Switch    |   | Transfer  |
                                  | (Stripe/  |   | (NPCI)    |   | (NEFT/    |
                                  |  Razorpay)|   |           |   |  RTGS/    |
                                  +-----------+   +-----------+   |  IMPS)    |
                                        |               |         +-----------+
                                        v               v               |
                                  +-----------+   +-----------+         |
                                  | Card      |   | Issuing   |         |
                                  | Network   |   | Bank PSP  |         |
                                  | (Visa/MC/ |   |           |<--------+
                                  |  RuPay)   |   +-----------+
                                  +-----------+
                                        |
                                        v
                                  +-----------+
                                  | Issuing   |
                                  | Bank      |
                                  +-----------+


   INTEGRATION POINTS
   ==================

   +------------+    +------------+    +-----------+    +-----------+
   | Visa Net   |    | MasterCard |    | NPCI      |    | RBI       |
   | (VisaNet / |    | (Banknet / |    | (UPI /    |    | (RTGS /   |
   |  Base II)  |    |  MIP)      |    |  RuPay /  |    |  NEFT /   |
   +------------+    +------------+    |  NACH /   |    |  SFMS)    |
                                       |  IMPS)    |    +-----------+
   +------------+    +------------+    +-----------+
   | Stripe     |    | Razorpay   |    +-----------+    +-----------+
   | Gateway    |    | Gateway    |    | Core      |    | Fraud     |
   | API        |    | API        |    | Banking   |    | Provider  |
   +------------+    +------------+    | System    |    | (Emailage |
                                       +-----------+    |  Riskified)|
                                                        +-----------+


   MULTI-AZ DEPLOYMENT
   ====================

   +---------------------------+    +---------------------------+
   |  Availability Zone A      |    |  Availability Zone B      |
   |                           |    |                           |
   |  +--------+ +--------+   |    |  +--------+ +--------+   |
   |  |Payment | |Payment |   |    |  |Payment | |Payment |   |
   |  |Svc (1) | |Svc (2) |   |    |  |Svc (3) | |Svc (4) |   |
   |  +--------+ +--------+   |    |  +--------+ +--------+   |
   |                           |    |                           |
   |  +--------+ +--------+   |    |  +--------+ +--------+   |
   |  |Fraud   | |3DS     |   |    |  |Fraud   | |3DS     |   |
   |  |Engine  | |Server  |   |    |  |Engine  | |Server  |   |
   |  +--------+ +--------+   |    |  +--------+ +--------+   |
   |                           |    |                           |
   |  +--------------------+   |    |  +--------------------+   |
   |  | PostgreSQL Primary |   |    |  | PostgreSQL Replica |   |
   |  +--------------------+   |    |  +--------------------+   |
   +---------------------------+    +---------------------------+
`}</pre>
    </div>
  );

  const renderLLD = () => (
    <div>
      <h2 style={sectionTitle}>Low-Level Design (LLD)</h2>

      <h3 style={subTitle}>Payment API Contracts</h3>
      <pre style={preStyle}>{`
  PAYMENT API ENDPOINTS
  =====================

  POST /api/v1/payments/initiate
  -------------------------------
  Request:
  {
    "merchant_id": "MERCH-2024-001",
    "order_id": "ORD-20240115-98765",
    "amount": 4999.00,
    "currency": "INR",
    "payment_method": "CARD | UPI | NEFT | RTGS | IMPS | WALLET | NACH",
    "card_details": {
      "token_id": "tok_visa_4242_abc123",
      "network": "VISA | MASTERCARD | RUPAY | AMEX",
      "card_type": "CREDIT | DEBIT | PREPAID"
    },
    "upi_details": {
      "vpa": "customer@upi",
      "flow": "COLLECT | INTENT | QR"
    },
    "customer": {
      "id": "CUST-001",
      "email": "customer@example.com",
      "phone": "+919876543210",
      "ip_address": "203.0.113.42"
    },
    "billing_address": {
      "line1": "123 MG Road",
      "city": "Mumbai",
      "state": "MH",
      "postal_code": "400001",
      "country": "IN"
    },
    "idempotency_key": "idem-uuid-12345",
    "return_url": "https://merchant.com/payment/callback",
    "metadata": { "product": "Premium Plan" }
  }
  Response: 201 Created
  {
    "payment_id": "pay_Ax1bCd2EfG3hIj",
    "order_id": "ORD-20240115-98765",
    "status": "INITIATED",
    "amount": 4999.00,
    "currency": "INR",
    "payment_method": "CARD",
    "gateway": "STRIPE",
    "requires_3ds": true,
    "redirect_url": "https://3ds.bank.com/auth?txn=abc123",
    "created_at": "2024-01-15T10:30:00Z",
    "expires_at": "2024-01-15T10:45:00Z"
  }

  POST /api/v1/payments/verify
  -----------------------------
  Request:
  {
    "payment_id": "pay_Ax1bCd2EfG3hIj",
    "gateway_payment_id": "ch_stripe_xyz789",
    "gateway_signature": "sha256_hmac_signature_value"
  }
  Response: 200 OK
  {
    "payment_id": "pay_Ax1bCd2EfG3hIj",
    "status": "AUTHORIZED | CAPTURED | FAILED",
    "amount": 4999.00,
    "currency": "INR",
    "auth_code": "AUTH-123456",
    "rrn": "400115000012",
    "card_last4": "4242",
    "card_network": "VISA",
    "3ds_status": "AUTHENTICATED",
    "fraud_score": 12,
    "verified_at": "2024-01-15T10:31:15Z"
  }

  POST /api/v1/refunds
  ---------------------
  Request:
  {
    "payment_id": "pay_Ax1bCd2EfG3hIj",
    "amount": 2500.00,
    "reason": "CUSTOMER_REQUEST | DUPLICATE | FRAUDULENT | PRODUCT_RETURN",
    "notes": "Customer requested partial refund",
    "idempotency_key": "refund-idem-uuid-456"
  }
  Response: 201 Created
  {
    "refund_id": "rfnd_Mn4oPq5RsT6uVw",
    "payment_id": "pay_Ax1bCd2EfG3hIj",
    "amount": 2500.00,
    "status": "INITIATED | PROCESSING | COMPLETED | FAILED",
    "refund_type": "PARTIAL",
    "estimated_arrival": "2024-01-22T00:00:00Z",
    "created_at": "2024-01-15T14:00:00Z"
  }

  GET /api/v1/transactions/{transaction_id}
  ------------------------------------------
  Response: 200 OK
  {
    "transaction_id": "txn_Ab1Cd2Ef3Gh4Ij",
    "payment_id": "pay_Ax1bCd2EfG3hIj",
    "type": "PAYMENT | REFUND | CHARGEBACK | SETTLEMENT",
    "status": "SUCCESS | FAILED | PENDING | REVERSED",
    "amount": 4999.00,
    "currency": "INR",
    "payment_method": "CARD",
    "gateway": "STRIPE",
    "gateway_txn_id": "ch_stripe_xyz789",
    "auth_code": "AUTH-123456",
    "rrn": "400115000012",
    "settlement_id": "stl_2024011500001",
    "settlement_status": "SETTLED | PENDING",
    "fraud_check": {
      "score": 12,
      "decision": "ACCEPT",
      "rules_triggered": []
    },
    "timeline": [
      { "event": "INITIATED", "timestamp": "2024-01-15T10:30:00Z" },
      { "event": "FRAUD_CHECKED", "timestamp": "2024-01-15T10:30:00.095Z" },
      { "event": "3DS_AUTHENTICATED", "timestamp": "2024-01-15T10:30:45Z" },
      { "event": "AUTHORIZED", "timestamp": "2024-01-15T10:31:10Z" },
      { "event": "CAPTURED", "timestamp": "2024-01-15T10:31:15Z" }
    ],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:31:15Z"
  }
`}</pre>

      <h3 style={sectionTitle}>Payment State Machine</h3>
      <pre style={preStyle}>{`
  PAYMENT STATE MACHINE
  ======================

  +----------+     +------------+     +-----------+     +---------+
  | INITIATED|---->| AUTHORIZED |---->| CAPTURED  |---->| SETTLED |
  +----+-----+     +-----+------+     +-----+-----+     +---------+
       |                 |                   |
       |                 |                   |
       v                 v                   v
  +----------+     +------------+     +------------+
  | FAILED   |     | VOIDED     |     | REFUNDED   |
  | (Timeout |     | (Pre-      |     | (Full /    |
  |  Gateway |     |  capture   |     |  Partial)  |
  |  Decline)|     |  cancel)   |     +-----+------+
  +----------+     +------------+           |
                                            v
                                     +------------+
                                     | CHARGEBACK |
                                     | (Disputed) |
                                     +-----+------+
                                           |
                                    +------+------+
                                    |             |
                                    v             v
                              +-----------+ +-----------+
                              | CB_WON    | | CB_LOST   |
                              | (Merchant)| | (Customer)|
                              +-----------+ +-----------+
`}</pre>

      <h3 style={sectionTitle}>Database Schema</h3>
      <pre style={preStyle}>{`
  DATABASE SCHEMA DESIGN
  ======================

  TABLE: payments
  ---------------
  payment_id        VARCHAR(30)   PRIMARY KEY
  merchant_id       VARCHAR(20)   NOT NULL  REFERENCES merchants(merchant_id)
  order_id          VARCHAR(50)   NOT NULL
  amount            DECIMAL(12,2) NOT NULL  CHECK(amount > 0)
  currency          VARCHAR(3)    NOT NULL  DEFAULT 'INR'
  status            ENUM('INITIATED','AUTHORIZED','CAPTURED','SETTLED',
                         'FAILED','VOIDED','REFUNDED','CHARGEBACK')
  payment_method    ENUM('CARD','UPI','NEFT','RTGS','IMPS','WALLET','NACH')
  gateway           VARCHAR(20)   NOT NULL
  gateway_payment_id VARCHAR(50)
  idempotency_key   VARCHAR(50)   UNIQUE
  customer_id       VARCHAR(20)
  customer_email    VARCHAR(100)
  customer_phone    VARCHAR(15)
  ip_address        INET
  metadata_json     JSONB
  return_url        TEXT
  expires_at        TIMESTAMP
  created_at        TIMESTAMP     DEFAULT NOW()
  updated_at        TIMESTAMP
  INDEX idx_pay_merchant     ON payments(merchant_id)
  INDEX idx_pay_order        ON payments(order_id)
  INDEX idx_pay_status       ON payments(status)
  INDEX idx_pay_created      ON payments(created_at)
  INDEX idx_pay_idempotency  ON payments(idempotency_key)

  TABLE: transactions
  --------------------
  transaction_id    VARCHAR(30)   PRIMARY KEY
  payment_id        VARCHAR(30)   NOT NULL  REFERENCES payments(payment_id)
  type              ENUM('PAYMENT','REFUND','CHARGEBACK','SETTLEMENT','VOID')
  status            ENUM('SUCCESS','FAILED','PENDING','REVERSED')
  amount            DECIMAL(12,2) NOT NULL
  currency          VARCHAR(3)    NOT NULL
  gateway_txn_id    VARCHAR(50)
  auth_code         VARCHAR(20)
  rrn               VARCHAR(20)
  card_last4        VARCHAR(4)
  card_network      VARCHAR(10)
  card_type         VARCHAR(10)
  upi_txn_id        VARCHAR(50)
  fraud_score       INTEGER       CHECK(fraud_score BETWEEN 0 AND 100)
  fraud_decision    ENUM('ACCEPT','REVIEW','DECLINE')
  three_ds_status   VARCHAR(20)
  settlement_id     VARCHAR(30)
  error_code        VARCHAR(10)
  error_message     TEXT
  created_at        TIMESTAMP     DEFAULT NOW()
  INDEX idx_txn_payment      ON transactions(payment_id)
  INDEX idx_txn_type         ON transactions(type)
  INDEX idx_txn_status       ON transactions(status)
  INDEX idx_txn_created      ON transactions(created_at)
  INDEX idx_txn_rrn          ON transactions(rrn)

  TABLE: refunds
  ---------------
  refund_id         VARCHAR(30)   PRIMARY KEY
  payment_id        VARCHAR(30)   NOT NULL  REFERENCES payments(payment_id)
  amount            DECIMAL(12,2) NOT NULL  CHECK(amount > 0)
  status            ENUM('INITIATED','PROCESSING','COMPLETED','FAILED')
  refund_type       ENUM('FULL','PARTIAL')
  reason            VARCHAR(50)
  gateway_refund_id VARCHAR(50)
  notes             TEXT
  idempotency_key   VARCHAR(50)   UNIQUE
  estimated_arrival DATE
  created_at        TIMESTAMP     DEFAULT NOW()
  completed_at      TIMESTAMP
  INDEX idx_rfnd_payment     ON refunds(payment_id)
  INDEX idx_rfnd_status      ON refunds(status)
  INDEX idx_rfnd_created     ON refunds(created_at)

  TABLE: audit_log
  -----------------
  audit_id          BIGSERIAL     PRIMARY KEY
  entity_type       VARCHAR(30)   NOT NULL
  entity_id         VARCHAR(50)   NOT NULL
  action            ENUM('CREATE','UPDATE','CAPTURE','REFUND','VOID',
                         'SETTLE','CHARGEBACK','WEBHOOK')
  performed_by      VARCHAR(50)   NOT NULL
  ip_address        INET
  old_value_json    JSONB
  new_value_json    JSONB
  correlation_id    UUID
  created_at        TIMESTAMP     DEFAULT NOW()
  INDEX idx_audit_entity     ON audit_log(entity_type, entity_id)
  INDEX idx_audit_action     ON audit_log(action)
  INDEX idx_audit_created    ON audit_log(created_at)
`}</pre>

      <h3 style={sectionTitle}>Error Codes</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Error Code</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>HTTP Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {[
            { code:'PAY_001', desc:'Invalid payment method', http:'400', action:'Reject with validation error' },
            { code:'PAY_002', desc:'Amount below minimum threshold', http:'400', action:'Reject, return min amount' },
            { code:'PAY_003', desc:'Currency not supported', http:'400', action:'Reject, return supported currencies' },
            { code:'PAY_004', desc:'Duplicate idempotency key', http:'409', action:'Return cached original response' },
            { code:'PAY_005', desc:'Card declined by issuing bank', http:'402', action:'Notify customer, suggest retry' },
            { code:'PAY_006', desc:'Insufficient funds', http:'402', action:'Notify customer' },
            { code:'PAY_007', desc:'3DS authentication failed', http:'402', action:'Retry with new 3DS challenge' },
            { code:'PAY_008', desc:'Card expired', http:'402', action:'Request updated card details' },
            { code:'PAY_009', desc:'Fraud check declined', http:'403', action:'Block transaction, flag for review' },
            { code:'PAY_010', desc:'Gateway timeout', http:'504', action:'Auto-retry with exponential backoff' },
            { code:'PAY_011', desc:'Gateway unavailable', http:'503', action:'Route to fallback gateway' },
            { code:'PAY_012', desc:'Invalid card token', http:'400', action:'Request re-tokenization' },
            { code:'PAY_013', desc:'UPI VPA not found', http:'400', action:'Validate VPA before collect' },
            { code:'PAY_014', desc:'UPI transaction timeout', http:'504', action:'Check status with NPCI' },
            { code:'PAY_015', desc:'Refund exceeds payment amount', http:'400', action:'Reject, show remaining refundable' },
            { code:'PAY_016', desc:'Payment already refunded', http:'409', action:'Return existing refund details' },
            { code:'PAY_017', desc:'Settlement mismatch detected', http:'500', action:'Generate exception report' },
            { code:'PAY_018', desc:'Webhook signature invalid', http:'401', action:'Reject webhook, log attempt' },
            { code:'PAY_019', desc:'Rate limit exceeded', http:'429', action:'Return Retry-After header' },
            { code:'PAY_020', desc:'Merchant not active', http:'403', action:'Reject, notify merchant support' }
          ].map((e, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:700, fontFamily:'monospace' }}>{e.code}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{e.desc}</td>
              <td style={{ ...tdStyle, textAlign:'center', fontWeight:600, color: e.http.startsWith('4') ? C.warn : e.http.startsWith('5') ? C.danger : C.success }}>{e.http}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{e.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderScenarios = () => (
    <div>
      <h2 style={sectionTitle}>Payment Gateway Testing Scenarios</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 comprehensive test scenarios covering card payments, UPI, bank transfers, refunds, chargebacks, fraud detection, tokenization, and settlement reconciliation for Indian banking payment gateway validation.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width:50 }}>#</th>
            <th style={thStyle}>Scenario</th>
            <th style={thStyle}>Channel</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Expected Outcome</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id:'S01', title:'Visa Card Payment with 3D Secure 2.0', ch:'Card', desc:'Customer initiates Visa card payment. System performs fraud check, tokenizes card, redirects to 3DS 2.0 challenge flow. Customer authenticates via OTP from issuing bank. Payment authorized and captured.', outcome:'Payment status CAPTURED, 3DS status AUTHENTICATED, auth code received, RRN generated, fraud score < 30.' },
            { id:'S02', title:'MasterCard Payment without 3DS (Frictionless)', ch:'Card', desc:'Low-risk MasterCard transaction qualifies for 3DS 2.0 frictionless flow. RBA (Risk-Based Authentication) score below threshold. No customer challenge required. Direct authorization from issuing bank.', outcome:'Payment CAPTURED without redirect, 3DS status FRICTIONLESS, transaction completed in < 2s, liability shifted to issuer.' },
            { id:'S03', title:'Insufficient Funds Decline', ch:'Card', desc:'Customer attempts payment with card having insufficient balance. Gateway sends authorization request. Issuing bank declines with response code 51 (Insufficient Funds).', outcome:'Payment status FAILED, error code PAY_006, decline reason displayed to customer, no amount debited, audit log created.' },
            { id:'S04', title:'Duplicate Payment Detection (Idempotency)', ch:'All', desc:'Merchant sends same payment request twice with identical idempotency key within 24 hours. First request processes normally. Second request detected as duplicate.', outcome:'First request: 201 Created with payment details. Second request: 409 Conflict returning cached first response. No duplicate charge.' },
            { id:'S05', title:'Full Refund Processing', ch:'Card', desc:'Merchant initiates full refund for a captured payment. System validates refundable amount, sends refund request to gateway, gateway processes refund to original payment method.', outcome:'Refund status COMPLETED, original payment status REFUNDED, customer receives credit within 5-7 business days, settlement adjusted.' },
            { id:'S06', title:'Partial Refund Processing', ch:'Card', desc:'Merchant initiates partial refund of INR 1500 on a INR 5000 payment. System validates partial amount does not exceed original. Refund processed to source card.', outcome:'Partial refund COMPLETED, remaining refundable amount updated to INR 3500, payment status remains CAPTURED (not fully refunded).' },
            { id:'S07', title:'Chargeback Received from Card Network', ch:'Card', desc:'Visa sends chargeback notification for a transaction. Reason code: 13.1 (Merchandise not received). System creates chargeback record, debits merchant settlement, initiates representment workflow.', outcome:'Chargeback created, merchant notified, provisional debit applied, representment deadline tracked (30 days), evidence collection initiated.' },
            { id:'S08', title:'Multi-Currency Payment with DCC', ch:'Card', desc:'International customer pays in USD on INR-denominated merchant. System offers Dynamic Currency Conversion. Customer chooses to pay in USD with disclosed exchange rate and markup.', outcome:'Payment processed in USD, FX rate locked at transaction time, DCC disclosure displayed, settlement in INR to merchant, conversion fee applied.' },
            { id:'S09', title:'UPI Collect Payment Flow', ch:'UPI', desc:'System generates UPI collect request to customer VPA. Customer approves payment on their UPI app (GPay/PhonePe). NPCI processes and returns success callback.', outcome:'UPI collect sent, customer receives notification, after approval: payment CAPTURED, UPI transaction ID received, RRN generated.' },
            { id:'S10', title:'UPI Intent Payment Flow', ch:'UPI', desc:'System generates UPI intent deeplink with payment details. Customer clicks deeplink, UPI app opens with pre-filled details. Customer enters UPI PIN and authorizes.', outcome:'Intent URL generated, PSP app callback received, payment CAPTURED, UPI transaction reference stored, status verified with NPCI.' },
            { id:'S11', title:'NEFT Transfer Processing', ch:'NEFT', desc:'Customer initiates NEFT transfer of INR 50,000. System validates beneficiary IFSC, submits to core banking for NEFT batch processing during next settlement window.', outcome:'NEFT submitted in next batch window, beneficiary credited within 2 hours (during business hours), confirmation received from CBS.' },
            { id:'S12', title:'RTGS High-Value Transfer', ch:'RTGS', desc:'Corporate customer initiates RTGS transfer of INR 5,00,000 (above RTGS minimum of INR 2 Lakhs). Real-time gross settlement processed through RBI RTGS system.', outcome:'RTGS processed in real-time, immediate settlement finality, UTR number generated, beneficiary credited instantly, irrevocable transfer.' },
            { id:'S13', title:'Recurring Payment via Tokenized Card', ch:'Card', desc:'Subscription merchant triggers monthly auto-debit using stored card token. System retrieves network token, sends authorization with MIT (Merchant Initiated Transaction) flag.', outcome:'Recurring payment CAPTURED, network token used (no raw PAN), MIT flag set, no 3DS required for recurring, billing cycle updated.' },
            { id:'S14', title:'Payment Retry on Gateway Timeout', ch:'Card', desc:'Primary gateway (Stripe) times out after 10 seconds. System detects timeout, verifies no authorization occurred via status check, automatically retries on fallback gateway (Razorpay).', outcome:'Timeout detected, original gateway status checked (no auth), retry on fallback gateway succeeds, single charge to customer, incident logged.' },
            { id:'S15', title:'Card Tokenization (RBI Mandate)', ch:'Card', desc:'New customer card tokenized per RBI tokenization mandate. Raw PAN replaced with network-specific token. Token stored in PCI-scoped vault. Original PAN purged after tokenization.', outcome:'Network token generated (Visa/MC/RuPay), token reference stored, raw PAN deleted, subsequent payments use token, token lifecycle managed.' },
            { id:'S16', title:'PCI-DSS Validation for Payment Flow', ch:'Card', desc:'Automated PCI-DSS validation: verify no PAN in logs, encryption at rest/transit, HSM key management, network segmentation of CDE, access controls on payment systems.', outcome:'Zero PAN in application logs, TLS 1.2+ enforced, AES-256 encryption validated, CDE segmented, all controls pass audit.' },
            { id:'S17', title:'Webhook Retry on Delivery Failure', ch:'All', desc:'Payment success webhook delivery to merchant endpoint fails (HTTP 500). System retries with exponential backoff: 1min, 5min, 30min, 2hr, 12hr. Maximum 5 retries.', outcome:'Webhook retried per schedule, merchant endpoint recovers on 3rd attempt, webhook delivered successfully, delivery log updated, idempotency maintained.' },
            { id:'S18', title:'Settlement Reconciliation', ch:'All', desc:'End-of-day settlement file from gateway reconciled with internal transaction records. System matches by RRN/UTR, identifies discrepancies, generates exception report for unmatched entries.', outcome:'3-way recon completed, 99.5% auto-matched, exceptions flagged (missing/extra/amount mismatch), settlement report generated for finance.' },
            { id:'S19', title:'Fraud Score Exceeds Threshold', ch:'Card', desc:'Transaction from new device, unusual geo-location (VPN detected), amount 10x average for customer. Fraud engine scores 92 (threshold: 80). Auto-decline triggered.', outcome:'Transaction DECLINED by fraud engine, error code PAY_009, customer notified, transaction flagged for manual review, device fingerprint blacklisted.' },
            { id:'S20', title:'NACH Mandate Registration', ch:'NACH', desc:'Customer registers NACH mandate for monthly SIP of INR 10,000. Mandate submitted to NPCI for sponsor bank approval. After approval, recurring debits auto-executed on schedule.', outcome:'NACH mandate registered with UMRN, sponsor bank approved, first debit executed on scheduled date, mandate status ACTIVE, debit notifications sent.' }
          ].map((s, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:700, textAlign:'center' }}>{s.id}</td>
              <td style={{ ...tdStyle, fontWeight:600, color:C.header, minWidth:200 }}>{s.title}</td>
              <td style={{ ...tdStyle, textAlign:'center' }}>{badge(
                s.ch === 'Card' ? C.info : s.ch === 'UPI' ? C.accent : s.ch === 'All' ? C.success : s.ch === 'NACH' ? C.warn : C.muted,
                s.ch
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
      <h2 style={sectionTitle}>Payment Gateway Test Cases</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 detailed test cases for payment gateway validation with step-by-step procedures covering card payments, UPI, refunds, fraud, tokenization, and settlement.
      </p>
      <div style={{ overflowX:'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, minWidth:80 }}>TC-ID</th>
              <th style={{ ...thStyle, minWidth:180 }}>Title</th>
              <th style={{ ...thStyle, minWidth:150 }}>Precondition</th>
              <th style={{ ...thStyle, minWidth:250 }}>Steps</th>
              <th style={{ ...thStyle, minWidth:200 }}>Expected Result</th>
              <th style={{ ...thStyle, minWidth:60 }}>Priority</th>
              <th style={{ ...thStyle, minWidth:80 }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id:'TC-PG-001', title:'Visa 3DS 2.0 Card Payment', pre:'Valid Visa test card, merchant onboarded, 3DS enabled', steps:'1. POST /payments/initiate with Visa card token\n2. Verify fraud check passes (score < 80)\n3. Follow 3DS redirect URL\n4. Enter OTP on issuing bank ACS page\n5. Verify callback received\n6. POST /payments/verify with gateway signature', result:'Payment CAPTURED, 3DS AUTHENTICATED, auth_code present, RRN generated, fraud_score < 30, amount debited', pri:'P0', type:'Functional' },
              { id:'TC-PG-002', title:'MasterCard Frictionless Payment', pre:'Low-risk MC test card, RBA configured', steps:'1. POST /payments/initiate with MC card token\n2. Verify 3DS frictionless qualification\n3. Confirm no redirect required\n4. Verify direct authorization\n5. POST /payments/verify\n6. Check transaction timeline', result:'Payment CAPTURED without redirect, 3DS FRICTIONLESS, latency < 2s, liability shifted to issuer', pri:'P0', type:'Functional' },
              { id:'TC-PG-003', title:'RuPay Card via NPCI Switch', pre:'RuPay test card, NPCI integration active', steps:'1. POST /payments/initiate with RuPay card token\n2. Verify routing to NPCI RuPay switch\n3. Complete RuPay PaySecure authentication\n4. Verify authorization via NPCI\n5. Confirm capture\n6. Validate settlement via NPCI', result:'Payment processed via NPCI, RuPay PaySecure completed, RRN from NPCI, settlement via NPCI clearing', pri:'P0', type:'Functional' },
              { id:'TC-PG-004', title:'Insufficient Funds Decline', pre:'Test card with low balance, known decline scenario', steps:'1. POST /payments/initiate with amount > card balance\n2. Verify fraud check passes\n3. Authorization sent to issuer\n4. Verify decline response code 51\n5. Check error code PAY_006 returned\n6. Verify no amount debited', result:'Payment FAILED, error PAY_006, decline reason Insufficient Funds, no debit, customer-friendly error displayed', pri:'P0', type:'Negative' },
              { id:'TC-PG-005', title:'Idempotency Key Duplicate Detection', pre:'Successful payment with known idempotency key', steps:'1. POST /payments/initiate with idempotency_key X\n2. Verify 201 Created response\n3. POST /payments/initiate again with same key X\n4. Verify 409 Conflict response\n5. Compare response body matches original\n6. Verify only one charge on card', result:'First: 201 with payment. Second: 409 with cached response. Single charge only. Idempotency enforced.', pri:'P0', type:'Functional' },
              { id:'TC-PG-006', title:'Full Refund to Source Card', pre:'CAPTURED payment exists, within refund window', steps:'1. POST /refunds with full payment amount\n2. Verify refund initiated at gateway\n3. Check original payment status updated\n4. Verify refund settlement adjustment\n5. Confirm customer credit timeline\n6. Validate audit trail', result:'Refund COMPLETED, payment status REFUNDED, settlement adjusted, customer credited in 5-7 days, audit logged', pri:'P0', type:'Functional' },
              { id:'TC-PG-007', title:'Partial Refund Processing', pre:'CAPTURED payment of INR 5000 exists', steps:'1. POST /refunds with amount INR 2000\n2. Verify partial refund processed\n3. Check remaining refundable = INR 3000\n4. Attempt second partial of INR 3000\n5. Verify payment now fully refunded\n6. Attempt another refund (should fail)', result:'First partial: COMPLETED (INR 2000). Second: COMPLETED (INR 3000). Third: REJECTED (PAY_016). Total matches original.', pri:'P0', type:'Functional' },
              { id:'TC-PG-008', title:'UPI Collect Payment Flow', pre:'Customer VPA validated, UPI integration active', steps:'1. POST /payments/initiate with UPI collect\n2. Verify collect request sent to VPA\n3. Simulate customer approval on PSP app\n4. Verify NPCI callback received\n5. POST /payments/verify\n6. Validate UPI txn ID and RRN', result:'Collect request delivered, payment CAPTURED on approval, UPI txn ID stored, RRN generated, verified with NPCI', pri:'P0', type:'Functional' },
              { id:'TC-PG-009', title:'UPI Intent with QR Code', pre:'UPI intent flow configured for merchant', steps:'1. POST /payments/initiate with UPI intent flow\n2. Verify QR code / deeplink generated\n3. Scan QR with UPI app\n4. Enter UPI PIN and authorize\n5. Verify callback from PSP\n6. Confirm payment captured', result:'QR/deeplink generated, PSP callback received, payment CAPTURED, UPI reference stored, status confirmed via NPCI', pri:'P0', type:'Functional' },
              { id:'TC-PG-010', title:'Gateway Timeout with Fallback', pre:'Primary gateway (Stripe) configured with 10s timeout, fallback (Razorpay) active', steps:'1. POST /payments/initiate (primary gateway slow)\n2. Wait for 10s timeout\n3. Verify status check on primary gateway\n4. Confirm no authorization on primary\n5. Verify auto-retry on fallback gateway\n6. Confirm successful payment on fallback', result:'Primary timeout detected, no double-charge verified, fallback gateway succeeds, single charge, incident logged', pri:'P0', type:'Reliability' },
              { id:'TC-PG-011', title:'Fraud Engine Auto-Decline', pre:'Fraud rules: new device + VPN + high amount = decline', steps:'1. POST /payments/initiate from VPN IP\n2. Include new device fingerprint\n3. Set amount 10x customer average\n4. Verify fraud engine scores > 80\n5. Confirm auto-decline (PAY_009)\n6. Verify manual review flag created', result:'Fraud score 92, auto-declined, PAY_009 returned, transaction flagged for review, device fingerprint logged', pri:'P0', type:'Security' },
              { id:'TC-PG-012', title:'Card Tokenization Lifecycle', pre:'PCI-DSS compliant token vault, HSM available', steps:'1. Submit card PAN for tokenization\n2. Verify network token generated\n3. Confirm raw PAN purged\n4. Use token for payment\n5. Payment succeeds with token\n6. Verify PAN not in any logs', result:'Network token created, PAN deleted, payment via token succeeds, zero PAN in logs, token lifecycle managed', pri:'P0', type:'Security' },
              { id:'TC-PG-013', title:'Webhook Delivery with Retry', pre:'Merchant webhook endpoint configured, endpoint initially down', steps:'1. Complete payment successfully\n2. First webhook delivery fails (HTTP 500)\n3. Verify retry after 1 minute\n4. Simulate endpoint recovery\n5. Verify webhook delivered on retry\n6. Confirm webhook payload and signature', result:'Webhook retried per backoff schedule, delivered on 2nd/3rd attempt, HMAC signature valid, idempotent delivery', pri:'P1', type:'Integration' },
              { id:'TC-PG-014', title:'Settlement Reconciliation Report', pre:'Day-end settlement file available from gateway', steps:'1. Trigger settlement reconciliation\n2. Match internal records vs gateway file\n3. Match by RRN/UTR for each transaction\n4. Identify discrepancies\n5. Generate exception report\n6. Verify settlement totals match', result:'Auto-match rate > 99%, exceptions flagged, missing/extra transactions identified, settlement report generated', pri:'P1', type:'Functional' },
              { id:'TC-PG-015', title:'Multi-Currency DCC Payment', pre:'International card, DCC enabled for merchant', steps:'1. POST /payments/initiate with USD card on INR merchant\n2. Verify DCC offer presented\n3. Customer selects USD payment\n4. Verify FX rate disclosure\n5. Payment processed in USD\n6. Merchant settled in INR', result:'DCC offer with FX rate, payment in USD, merchant receives INR, conversion fee applied, FX rate locked', pri:'P1', type:'Functional' },
              { id:'TC-PG-016', title:'NACH Mandate Registration', pre:'Customer bank supports NACH, sponsor bank configured', steps:'1. Submit NACH mandate with customer details\n2. Include mandate amount, frequency, start/end date\n3. Submit to NPCI for registration\n4. Wait for sponsor bank approval\n5. Verify UMRN generated\n6. Confirm mandate status ACTIVE', result:'Mandate registered with UMRN, sponsor bank approved, status ACTIVE, first debit schedulable, notifications sent', pri:'P1', type:'Functional' },
              { id:'TC-PG-017', title:'Chargeback Processing', pre:'Captured payment exists, chargeback notification received', steps:'1. Receive chargeback from Visa (reason 13.1)\n2. Verify chargeback record created\n3. Merchant settlement debited provisionally\n4. Initiate representment with evidence\n5. Submit compelling evidence to network\n6. Track arbitration outcome', result:'Chargeback recorded, merchant notified, provisional debit applied, representment filed within deadline, outcome tracked', pri:'P1', type:'Functional' },
              { id:'TC-PG-018', title:'Rate Limiting on Payment API', pre:'Rate limit set to 100 req/min per merchant', steps:'1. Send 100 payment requests in 1 minute\n2. Verify all 100 accepted\n3. Send 101st request\n4. Verify 429 Too Many Requests\n5. Check Retry-After header\n6. Wait and retry successfully', result:'First 100 accepted, 101st returns 429, Retry-After header present, request succeeds after wait, no data loss', pri:'P1', type:'Non-Functional' },
              { id:'TC-PG-019', title:'NEFT/RTGS Transfer Validation', pre:'Core banking integration active, valid beneficiary IFSC', steps:'1. POST /payments/initiate with NEFT method\n2. Validate beneficiary IFSC code\n3. Submit to CBS for NEFT processing\n4. Verify batch submission in next window\n5. Confirm beneficiary credit notification\n6. Validate UTR number received', result:'NEFT submitted in batch, beneficiary credited within 2 hrs, UTR generated, settlement confirmed from CBS', pri:'P0', type:'Functional' },
              { id:'TC-PG-020', title:'Payment Latency Under Load (1000 TPS)', pre:'Load test environment, JMeter/Gatling configured', steps:'1. Configure 1000 concurrent users\n2. Ramp up over 60 seconds\n3. Sustain 1000 TPS for 10 minutes\n4. Measure P50, P95, P99 latencies\n5. Monitor error rates\n6. Check system resource utilization', result:'P95 latency < 2s, P99 < 5s, error rate < 0.1%, no memory leaks, auto-scaling triggered, zero payment loss', pri:'P0', type:'Performance' }
            ].map((tc, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
                <td style={{ ...tdStyle, color:C.accent, fontWeight:700, fontSize:12 }}>{tc.id}</td>
                <td style={{ ...tdStyle, fontWeight:600, color:C.header, fontSize:12 }}>{tc.title}</td>
                <td style={{ ...tdStyle, fontSize:11 }}>{tc.pre}</td>
                <td style={{ ...tdStyle, fontSize:11, whiteSpace:'pre-line' }}>{tc.steps}</td>
                <td style={{ ...tdStyle, fontSize:11 }}>{tc.result}</td>
                <td style={{ ...tdStyle, textAlign:'center' }}>{badge(tc.pri === 'P0' ? C.danger : C.warn, tc.pri)}</td>
                <td style={{ ...tdStyle, textAlign:'center', fontSize:11 }}>{badge(
                  tc.type === 'Security' ? C.danger : tc.type === 'Performance' ? C.warn : tc.type === 'Negative' ? C.danger : tc.type === 'Reliability' ? C.info : tc.type === 'Non-Functional' ? C.warn : tc.type === 'Integration' ? C.accent : C.success,
                  tc.type
                )}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderC4Model = () => (
    <div>
      <h2 style={sectionTitle}>C4 Model - Payment Gateway Platform</h2>

      <h3 style={subTitle}>Level 1: System Context</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 1: SYSTEM CONTEXT                   |
  +=========================================================================+

                          +-------------------+
                          |    Customer        |
                          |  (Web / Mobile)    |
                          +--------+----------+
                                   |
                          Initiates Payment
                                   |
                                   v
  +----------------+    +========================+    +-------------------+
  |  Merchant      |    |                        |    | Card Networks     |
  |  Systems       |<-->|  PAYMENT GATEWAY       |<-->|                   |
  |                |    |  PLATFORM              |    | - Visa (VisaNet)  |
  | - E-commerce   |    |                        |    | - MC (Banknet)    |
  | - POS          |    | Processes all payment  |    | - RuPay (NPCI)    |
  | - Mobile app   |    | instruments securely   |    | - AMEX            |
  | - Billing      |    | with fraud detection   |    +-------------------+
  +----------------+    | and PCI compliance     |
                        |                        |    +-------------------+
  +----------------+    |                        |    | Banking Rails     |
  |  Fraud         |<-->|                        |<-->|                   |
  |  Providers     |    +========================+    | - UPI (NPCI)      |
  |                |               ^                  | - NEFT (RBI)      |
  | - Emailage     |               |                  | - RTGS (RBI)      |
  | - Riskified    |    +----------+----------+       | - IMPS (NPCI)     |
  | - MaxMind      |    |  Issuing / Acquiring |      | - NACH (NPCI)     |
  +----------------+    |  Banks               |      +-------------------+
                        +---------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 2: Container Diagram</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 2: CONTAINERS                       |
  +=========================================================================+

  +-------------------------------------------------------------------------+
  |                        PAYMENT GATEWAY PLATFORM                          |
  |                                                                          |
  |  +------------------+  +------------------+  +---------------------+    |
  |  | API Gateway      |  | Payment Service  |  | Fraud Engine        |    |
  |  | [Kong / nginx]   |  | [Java/Spring]    |  | [Python/ML]         |    |
  |  |                  |  |                  |  |                     |    |
  |  | - Auth (OAuth2)  |  | - Orchestrator   |  | - ML model scoring  |    |
  |  | - Rate limiting  |  | - Saga manager   |  | - Velocity checks   |    |
  |  | - TLS terminate  |  | - Gateway router |  | - Device fingerprint|    |
  |  | - Request log    |  | - Retry handler  |  | - Geo-anomaly       |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------+  +---------------------+    |
  |  | 3DS Server       |  | Token Vault      |  | Notification Svc    |    |
  |  | [Java/Spring]    |  | [Java/HSM]       |  | [Node.js]           |    |
  |  |                  |  |                  |  |                     |    |
  |  | - ACS connect    |  | - Card tokens    |  | - Webhooks          |    |
  |  | - Challenge flow |  | - Network tokens |  | - Email/SMS         |    |
  |  | - RBA engine     |  | - HSM integration|  | - Push notifications|    |
  |  | - EMV 3DS 2.0    |  | - PCI scoped     |  | - Retry logic       |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------------------------------+    |
  |  | Settlement       |  | Reconciliation Engine                     |    |
  |  | Engine           |  | [Python/Pandas]                           |    |
  |  | [Java/Spring]    |  |                                           |    |
  |  |                  |  | - 3-way matching (gateway-bank-merchant)  |    |
  |  | - T+1/T+2 settle|  | - Exception detection                     |    |
  |  | - Net / Gross    |  | - Auto-resolution rules                   |    |
  |  | - FX conversion  |  | - Settlement reports                      |    |
  |  | - Payout calc    |  | - Audit trail                             |    |
  |  +------------------+  +------------------------------------------+    |
  |                                                                          |
  |  +------------------------------------------------------------------+  |
  |  | Data Layer                                                        |  |
  |  | PostgreSQL (OLTP) | Redis (Cache/Sessions) | MongoDB (Events)    |  |
  |  | Kafka (Event Bus) | S3 (Settlement Files)  | Elasticsearch (Logs)|  |
  |  +------------------------------------------------------------------+  |
  +-------------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 3: Component Diagram (Payment Service)</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 3: COMPONENTS                       |
  +=========================================================================+

  Payment Service [Container] - Component Breakdown:

  +------------------------------------------------------------------+
  |                                                                    |
  |  +------------------+     +-------------------+                    |
  |  | PaymentController|---->| PaymentProcessor   |                    |
  |  | - REST endpoints |     | - Validate request |                    |
  |  | - Request parse  |     | - Enrich data      |                    |
  |  | - Response format|     | - Orchestrate flow |                    |
  |  | - Idempotency    |     | - State machine    |                    |
  |  +------------------+     +--------+-----------+                    |
  |                                     |                               |
  |  +------------------+              v                               |
  |  | GatewayAdapter   |     +-------------------+                    |
  |  | (Strategy Pattern)|    | SagaOrchestrator   |                    |
  |  |                  |     | - Step sequencing  |                    |
  |  | - StripeAdapter  |     | - Compensating txn |                    |
  |  | - RazorpayAdapter|     | - Timeout handling |                    |
  |  | - PayUAdapter    |     | - Rollback chain   |                    |
  |  | - NPCIAdapter    |     +--------+----------+                    |
  |  +--------+---------+              |                               |
  |           |                        v                               |
  |           |              +-------------------+                    |
  |           +------------->| TokenVault         |                    |
  |                          | - Tokenize PAN     |                    |
  |                          | - Detokenize       |                    |
  |                          | - HSM calls        |                    |
  |                          | - Token lifecycle  |                    |
  |                          +-------------------+                    |
  |                                                                    |
  |  +------------------+     +-------------------+                    |
  |  | RefundManager    |     | ReconciliationEng  |                    |
  |  | - Full / Partial |     | - File parsing     |                    |
  |  | - Validate amount|     | - 3-way match      |                    |
  |  | - Gateway refund |     | - Exception report |                    |
  |  | - Status track   |     | - Settlement calc  |                    |
  |  +------------------+     +-------------------+                    |
  +------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 4: Code (Key Classes)</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 4: CODE                             |
  +=========================================================================+

  class PaymentOrchestrator:
      def __init__(self, fraud_engine, token_vault, gateway_factory, saga_mgr):
          self.fraud_engine = fraud_engine
          self.token_vault = token_vault
          self.gateway_factory = gateway_factory
          self.saga_mgr = saga_mgr

      def process_payment(self, request: PaymentRequest) -> PaymentResult:
          # Step 1: Fraud check
          fraud_result = self.fraud_engine.score(request)
          if fraud_result.decision == "DECLINE":
              return PaymentResult(status="FAILED", error="PAY_009")

          # Step 2: Tokenize if raw card
          token = self.token_vault.tokenize(request.card) if request.card else None

          # Step 3: Route to gateway
          gateway = self.gateway_factory.get_gateway(request.payment_method)

          # Step 4: Execute saga (authorize -> capture)
          saga = self.saga_mgr.create_payment_saga(request, gateway, token)
          result = saga.execute()
          return result

  class GatewayAdapterFactory:
      def __init__(self, config):
          self._adapters = {
              "STRIPE": StripeAdapter(config.stripe_key),
              "RAZORPAY": RazorpayAdapter(config.razorpay_key),
              "NPCI_UPI": NPCIUPIAdapter(config.npci_config),
              "NPCI_RUPAY": NPCIRuPayAdapter(config.npci_config),
          }

      def get_gateway(self, method: str, merchant: Merchant) -> GatewayAdapter:
          primary = merchant.gateway_preference.get(method)
          return self._adapters[primary]

  class PaymentSaga:
      def __init__(self, steps: list, compensations: list):
          self.steps = steps           # [fraud_check, tokenize, authorize, capture]
          self.compensations = compensations  # [void, detokenize, release_hold]
          self.completed = []

      def execute(self) -> SagaResult:
          for step in self.steps:
              try:
                  result = step.execute()
                  self.completed.append(step)
              except StepFailure as e:
                  self._compensate()
                  return SagaResult(status="FAILED", error=e.code)
          return SagaResult(status="SUCCESS")

      def _compensate(self):
          for step in reversed(self.completed):
              compensation = self.compensations.get(step.name)
              if compensation:
                  compensation.execute()
`}</pre>
    </div>
  );

  const renderTechStack = () => (
    <div>
      <h2 style={sectionTitle}>Technology Stack</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Comprehensive technology stack for payment gateway testing in the Indian banking ecosystem.
      </p>
      <div style={gridStyle}>
        {[
          { cat:'Backend Services', items:[
            { name:'Java Spring Boot', desc:'Primary backend framework for payment service, 3DS server, settlement engine', use:'Payment orchestration, saga management' },
            { name:'Node.js (Express)', desc:'Lightweight services for webhooks, notifications, and real-time events', use:'Webhook delivery, push notifications, SSE' },
            { name:'Python (FastAPI)', desc:'ML model serving for fraud engine, reconciliation data processing', use:'Fraud scoring API, settlement reconciliation' }
          ], color:C.accent },
          { cat:'Gateway SDKs & Integrations', items:[
            { name:'Stripe SDK', desc:'Official Stripe server-side SDK for card payments, refunds, and payouts', use:'Primary card gateway integration' },
            { name:'Razorpay SDK', desc:'Razorpay server SDK for payments, UPI, and subscriptions', use:'Fallback gateway, UPI integration' },
            { name:'PayU SDK', desc:'PayU integration for multi-method payments in India', use:'Additional gateway for routing diversity' },
            { name:'NPCI APIs', desc:'Direct NPCI integration for UPI, RuPay, IMPS, NACH', use:'UPI switch, RuPay processing, NACH mandates' }
          ], color:C.info },
          { cat:'Security & PCI Compliance', items:[
            { name:'HSM (Thales Luna)', desc:'Hardware Security Module for cryptographic key management and tokenization', use:'Card tokenization, key storage, PCI-DSS compliance' },
            { name:'HashiCorp Vault', desc:'Secrets management for API keys, certificates, and encryption keys', use:'Gateway API key storage, TLS certificates' },
            { name:'Qualys PCI Scanner', desc:'Automated PCI-DSS compliance validation and ASV scanning', use:'Quarterly PCI scans, vulnerability assessment' },
            { name:'WAF (AWS WAF / ModSecurity)', desc:'Web Application Firewall for payment endpoint protection', use:'SQL injection, XSS, bot protection on payment APIs' }
          ], color:C.danger },
          { cat:'Database & Storage', items:[
            { name:'PostgreSQL', desc:'Primary OLTP database for payments, transactions, settlements', use:'Payment records, audit trail, merchant data' },
            { name:'Redis', desc:'In-memory cache for session data, idempotency keys, rate limiting', use:'Idempotency store, fraud velocity cache, rate limiter' },
            { name:'MongoDB', desc:'Document store for event sourcing and flexible schema requirements', use:'Payment events, webhook logs, gateway responses' }
          ], color:C.success },
          { cat:'Messaging & Events', items:[
            { name:'Apache Kafka', desc:'Distributed event streaming for payment events and async processing', use:'Payment event bus, settlement triggers, audit events' },
            { name:'RabbitMQ', desc:'Message broker for webhook delivery and notification queuing', use:'Webhook retry queue, notification delivery' }
          ], color:C.warn },
          { cat:'Monitoring & Observability', items:[
            { name:'Grafana + Prometheus', desc:'Metrics visualization, alerting, and payment SLA dashboards', use:'TPS monitoring, latency tracking, error rate alerting' },
            { name:'ELK Stack', desc:'Elasticsearch, Logstash, Kibana for centralized log management', use:'Payment flow tracing, error debugging, PCI audit logs' },
            { name:'Jaeger / Zipkin', desc:'Distributed tracing for payment flow across microservices', use:'End-to-end payment latency breakdown, bottleneck detection' }
          ], color:C.info },
          { cat:'Testing Tools', items:[
            { name:'JMeter / Gatling', desc:'Load testing tools for payment throughput and latency validation', use:'1000 TPS load tests, latency benchmarking' },
            { name:'Newman (Postman CLI)', desc:'API test runner for automated payment API contract testing', use:'CI/CD API regression testing' },
            { name:'Pact', desc:'Contract testing framework for consumer-driven contracts', use:'Gateway adapter contract validation' },
            { name:'OWASP ZAP', desc:'Security scanner for payment API penetration testing', use:'PCI-DSS web app security scanning' }
          ], color:C.accent },
          { cat:'Infrastructure & DevOps', items:[
            { name:'AWS (EKS, RDS, ElastiCache)', desc:'Cloud infrastructure for payment platform deployment', use:'Multi-AZ deployment, managed databases, auto-scaling' },
            { name:'Kubernetes (K8s)', desc:'Container orchestration for payment microservices', use:'Auto-scaling, rolling deployments, health checks' },
            { name:'Docker', desc:'Containerization for consistent payment service packaging', use:'Service packaging, local development, CI builds' },
            { name:'Terraform', desc:'Infrastructure as Code for reproducible payment infra', use:'VPC, security groups, RDS, EKS provisioning' }
          ], color:C.warn }
        ].map((cat, i) => (
          <div key={i} style={{ ...cardStyle, gridColumn:'span 1' }}>
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
          { title:'ADR-001: Saga Pattern for Distributed Payment Transactions', decision:'Use orchestration-based Saga pattern for multi-step payment flows instead of 2PC (two-phase commit).', rationale:'Payment processing spans multiple services (fraud, tokenization, gateway, settlement). 2PC creates tight coupling and single point of failure. Saga pattern allows each step to have a compensating action (void, refund) enabling graceful failure recovery without distributed locks.', tradeoff:'Eventual consistency instead of strong consistency. Compensating transactions may fail (requiring manual intervention). More complex implementation with state machine management. Requires idempotency at every step.', color:C.accent },
          { title:'ADR-002: Multi-Gateway Routing with Automatic Failover', decision:'Integrate multiple payment gateways (Stripe, Razorpay, PayU) with automatic failover and intelligent routing.', rationale:'Single gateway dependency creates availability risk. Multi-gateway approach provides: (1) Failover on gateway outage, (2) Cost optimization via routing to cheapest gateway per transaction type, (3) Higher approval rates by retrying declined transactions on alternate gateway, (4) Negotiation leverage with gateway providers.', tradeoff:'Higher integration and maintenance cost. Reconciliation complexity increases with multiple gateways. Each gateway has different API contracts requiring adapter pattern. Settlement from multiple sources must be unified.', color:C.danger },
          { title:'ADR-003: Event Sourcing for Payment State Management', decision:'Use event sourcing to capture all payment state changes as immutable events rather than updating current state in-place.', rationale:'Payment transactions require complete audit trail for PCI-DSS, RBI compliance, and dispute resolution. Event sourcing provides: (1) Complete history of every state change, (2) Ability to replay events for debugging, (3) Temporal queries for reconciliation, (4) Natural fit with CQRS pattern for read/write separation.', tradeoff:'Higher storage requirements (all events stored forever). Eventual consistency for read models. Event schema evolution complexity. Snapshot strategy needed for performance with high-volume transactions.', color:C.info },
          { title:'ADR-004: Network Tokenization Over Proprietary Tokenization', decision:'Implement card network tokenization (Visa Token Service, MC MDES, RuPay Tokenization) per RBI mandate instead of proprietary vault-only approach.', rationale:'RBI mandate (effective Oct 2022) requires card-on-file tokenization. Network tokens provide: (1) Regulatory compliance, (2) Higher approval rates (tokens auto-updated on card reissue), (3) Lower interchange fees, (4) Reduced PCI scope (no PAN storage). Network tokens are universally accepted across gateways.', tradeoff:'Dependency on card network token services. Token provisioning latency on first use. Different token formats per network (Visa vs MC vs RuPay). Fallback needed for networks that do not support tokenization.', color:C.warn },
          { title:'ADR-005: Separate Read/Write Databases (CQRS)', decision:'Implement CQRS with PostgreSQL for write operations and read replicas + Redis for query operations.', rationale:'Payment write operations (initiate, capture, refund) require strong consistency and ACID guarantees. Read operations (transaction history, dashboard, reconciliation) are 10x more frequent and can tolerate slight staleness. Separation allows independent scaling of read and write workloads.', tradeoff:'Increased infrastructure cost (multiple databases). Data synchronization lag between write and read stores. Application complexity for maintaining consistency. Cache invalidation challenges with Redis.', color:C.success },
          { title:'ADR-006: Circuit Breaker for External Gateway Calls', decision:'Implement circuit breaker pattern (Resilience4j) for all external payment gateway and card network calls.', rationale:'External gateways can experience intermittent failures, slowdowns, or complete outages. Circuit breaker prevents cascading failures by: (1) Failing fast when gateway is down, (2) Routing to fallback gateway automatically, (3) Monitoring gateway health continuously, (4) Auto-recovering when gateway comes back online.', tradeoff:'Some legitimate transactions may be rejected during circuit-open state. Configuration of thresholds requires tuning (failure rate, wait duration, half-open trials). Must handle circuit state persistence across service restarts.', color:C.accent }
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

      <h3 style={sectionTitle}>Non-Functional Requirements Architecture</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>NFR Category</th>
            <th style={thStyle}>Requirement</th>
            <th style={thStyle}>Architecture Decision</th>
            <th style={thStyle}>Failure Mode</th>
          </tr>
        </thead>
        <tbody>
          {[
            { cat:'Availability (99.99%)', req:'Max 52 min downtime/year. Zero payment loss.', arch:'Active-active multi-AZ deployment. Auto-failover with health checks every 5s. Blue-green deployments for zero-downtime releases.', failure:'AZ failure: traffic auto-routed to surviving AZ. Service crash: K8s auto-restart within 10s. DB failover: RDS Multi-AZ with 30s failover.' },
            { cat:'Latency (< 2s P95)', req:'End-to-end payment under 2 seconds.', arch:'Redis cache for hot data (tokens, merchant config). Connection pooling. Async fraud check where possible. Pre-warmed gateway connections.', failure:'Latency spike: auto-scale pods horizontally. Gateway slowdown: circuit breaker opens, route to faster gateway. DB slow query: read from replica.' },
            { cat:'Throughput (1000 TPS)', req:'Sustained 1000 TPS, burst to 3000 TPS.', arch:'Horizontal pod auto-scaling (HPA). Kafka partitioning for parallel event processing. Database connection pooling (PgBouncer). Read replicas for query load.', failure:'TPS exceeds capacity: auto-scale within 30s. Kafka lag: increase consumer group size. DB connection exhaustion: queue requests with backpressure.' },
            { cat:'Security (PCI-DSS L1)', req:'Full PCI-DSS Level 1 compliance.', arch:'CDE network segmentation. HSM for key management. Tokenization for PAN. TLS 1.2+ everywhere. WAF on all endpoints. No PAN in logs.', failure:'Data breach attempt: WAF blocks, IDS alerts, auto-blacklist IP. Key compromise: HSM-backed rotation within 1 hour. Audit log tampering: immutable event store.' },
            { cat:'Consistency', req:'No double charges. No lost payments.', arch:'Idempotency keys for all write operations. Saga pattern with compensating transactions. Event sourcing for complete audit trail. Status check before retry.', failure:'Double-charge risk: idempotency key prevents. Lost payment: event sourcing provides replay. Split-brain: consensus-based leader election.' },
            { cat:'Observability', req:'Real-time visibility into payment health.', arch:'Distributed tracing (Jaeger). Structured logging (ELK). Metrics (Prometheus/Grafana). Custom payment dashboards. PagerDuty alerting.', failure:'Monitoring gap: synthetic transactions every 60s. Alert fatigue: ML-based anomaly detection. Log loss: Kafka-backed log pipeline with retention.' }
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:600, fontSize:13 }}>{r.cat}</td>
              <td style={{ ...tdStyle, fontSize:12 }}>{r.req}</td>
              <td style={{ ...tdStyle, fontSize:12 }}>{r.arch}</td>
              <td style={{ ...tdStyle, fontSize:12, color:C.warn }}>{r.failure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFlowchart = () => (
    <div>
      <h2 style={sectionTitle}>Payment Processing Flowchart</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Complete end-to-end payment processing flow from initiation through settlement and reconciliation.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |          PAYMENT PROCESSING - DETAILED FLOWCHART                         |
  +=========================================================================+

                        +---------------------+
                        |  Payment             |
                        |  Initiation          |
                        |  (Customer / API)    |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Validate Request    |
                        |  - Amount > 0        |
                        |  - Currency valid    |
                        |  - Merchant active   |
                        |  - Idempotency check |
                        |  - Schema validation |
                        +----------+----------+
                                   |
                          +--------+--------+
                          | Valid?           |
                          +--------+--------+
                          |  NO    |  YES
                          v        v
                   +----------+   |
                   | Return   |   |
                   | 400 Error|   |
                   | PAY_001- |   |
                   | PAY_003  |   |
                   +----------+   |
                                  v
                        +---------------------+
                        |  Fraud Check         |
                        |  - ML model score    |
                        |  - Velocity rules    |
                        |  - Device fingerprint|
                        |  - Geo-IP validation |
                        |  - Amount pattern    |
                        +----------+----------+
                                   |
                          +--------+--------+
                          | Score >= 80?     |
                          +--------+--------+
                          |  YES   |  NO
                          v        v
                   +----------+   |
                   | DECLINE  |   |
                   | PAY_009  |   |
                   | Flag for |   |
                   | review   |   |
                   +----------+   |
                                  v
                        +---------------------+
                        |  Tokenize Card       |
                        |  (If card payment)   |
                        |  - Network token     |
                        |  - HSM encryption    |
                        |  - PAN purge         |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Call Payment        |
                        |  Gateway             |
                        |  (Stripe/Razorpay/   |
                        |   NPCI)              |
                        +----------+----------+
                                   |
                          +--------+--------+
                          | Requires 3DS?   |
                          +--------+--------+
                          |  YES   |  NO
                          v        |
                   +-----------+   |
                   | 3DS Auth  |   |
                   | - Redirect|   |
                   |   to ACS  |   |
                   | - Customer|   |
                   |   OTP/Bio |   |
                   | - Callback|   |
                   +-----+-----+   |
                         |         |
                         v         v
                        +---------------------+
                        |  Gateway Response    |
                        +----------+----------+
                                   |
                          +--------+--------+
                          | Authorized?     |
                          +--------+--------+
                          |  NO    |  YES
                          v        v
                   +----------+  +---------------------+
                   | FAILED   |  | Capture Payment     |
                   | PAY_005- |  | - Debit customer    |
                   | PAY_008  |  | - Auth code stored  |
                   +----------+  | - RRN generated     |
                                 +----------+----------+
                                            |
                                            v
                                 +---------------------+
                                 | Notify              |
                                 | - Webhook to        |
                                 |   merchant          |
                                 | - SMS/Email to      |
                                 |   customer          |
                                 | - Push notification |
                                 +----------+----------+
                                            |
                                            v
                                 +---------------------+
                                 | Settlement          |
                                 | - T+1 / T+2 batch   |
                                 | - Net settlement    |
                                 | - Interchange calc  |
                                 | - Merchant payout   |
                                 +----------+----------+
                                            |
                                            v
                                 +---------------------+
                                 | Reconciliation      |
                                 | - Gateway file match|
                                 | - Bank file match   |
                                 | - Exception detect  |
                                 | - Report generation |
                                 +---------------------+
`}</pre>
    </div>
  );

  const renderSequenceDiagram = () => (
    <div>
      <h2 style={sectionTitle}>Sequence Diagram - Card Payment with 3D Secure</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        End-to-end card payment flow showing interaction between Customer, Merchant API, Payment Service, Fraud Engine, Payment Gateway, 3DS Server, Card Network, and Issuing Bank.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |     SEQUENCE DIAGRAM: CARD PAYMENT WITH 3D SECURE 2.0                    |
  +=========================================================================+

  Customer    Merchant     Payment     Fraud       Payment    3DS        Card       Issuing
              API          Service     Engine      Gateway    Server     Network    Bank
  |           |            |           |           |          |          |          |
  |  1. Pay   |            |           |           |          |          |          |
  |  (Card +  |            |           |           |          |          |          |
  |   Amount) |            |           |           |          |          |          |
  |---------->|            |           |           |          |          |          |
  |           |            |           |           |          |          |          |
  |           | 2. POST    |           |           |          |          |          |
  |           | /payments/ |           |           |          |          |          |
  |           | initiate   |           |           |          |          |          |
  |           |----------->|           |           |          |          |          |
  |           |            |           |           |          |          |          |
  |           |            | 3. Score  |           |          |          |          |
  |           |            | Transaction           |          |          |          |
  |           |            |---------->|           |          |          |          |
  |           |            |           |           |          |          |          |
  |           |            | 4. Fraud  |           |          |          |          |
  |           |            | Score: 15 |           |          |          |          |
  |           |            | ACCEPT    |           |          |          |          |
  |           |            |<----------|           |          |          |          |
  |           |            |           |           |          |          |          |
  |           |            | 5. Tokenize           |          |          |          |
  |           |            | Card PAN  |           |          |          |          |
  |           |            | (HSM)     |           |          |          |          |
  |           |            |           |           |          |          |          |
  |           |            | 6. Auth   |           |          |          |          |
  |           |            | Request   |           |          |          |          |
  |           |            |-----------|---------->|          |          |          |
  |           |            |           |           |          |          |          |
  |           |            |           |           | 7. Check |          |          |
  |           |            |           |           | 3DS      |          |          |
  |           |            |           |           | Enrolled |          |          |
  |           |            |           |           |--------->|          |          |
  |           |            |           |           |          |          |          |
  |           |            |           |           | 8. 3DS   |          |          |
  |           |            |           |           | Required |          |          |
  |           |            |           |           |<---------|          |          |
  |           |            |           |           |          |          |          |
  |           |            | 9. Redirect           |          |          |          |
  |           |            | URL for 3DS           |          |          |          |
  |           |            |<----------|-----------|          |          |          |
  |           |            |           |           |          |          |          |
  |           | 10. 3DS    |           |           |          |          |          |
  |           | Redirect   |           |           |          |          |          |
  |           |<-----------|           |           |          |          |          |
  |           |            |           |           |          |          |          |
  | 11. 3DS   |            |           |           |          |          |          |
  | Challenge |            |           |           |          |          |          |
  | Page      |            |           |           |          |          |          |
  |<----------|            |           |           |          |          |          |
  |           |            |           |           |          |          |          |
  | 12. Enter |            |           |           |          |          |          |
  | OTP       |            |           |           |          |          |          |
  |---------->|            |           |           |          |          |          |
  |           |            |           |           |          |          |          |
  |           |            |           |           |          | 13. Verify          |
  |           |            |           |           |          | OTP with  |          |
  |           |            |           |           |          | Issuer    |          |
  |           |            |           |           |          |--------->|          |
  |           |            |           |           |          |          |          |
  |           |            |           |           |          |          | 14. Fwd  |
  |           |            |           |           |          |          | to Issuer|
  |           |            |           |           |          |          |--------->|
  |           |            |           |           |          |          |          |
  |           |            |           |           |          |          | 15. OTP  |
  |           |            |           |           |          |          | Verified |
  |           |            |           |           |          |          |<---------|
  |           |            |           |           |          |          |          |
  |           |            |           |           |          | 16. Auth |          |
  |           |            |           |           |          | Success  |          |
  |           |            |           |           |          |<---------|          |
  |           |            |           |           |          |          |          |
  |           |            |           |           | 17. 3DS  |          |          |
  |           |            |           |           | Passed   |          |          |
  |           |            |           |           |<---------|          |          |
  |           |            |           |           |          |          |          |
  |           |            |           |           | 18. Auth |          |          |
  |           |            |           |           | Request  |          |          |
  |           |            |           |           | to Network          |          |
  |           |            |           |           |----------|--------->|          |
  |           |            |           |           |          |          |          |
  |           |            |           |           |          |          | 19. Auth |
  |           |            |           |           |          |          | to Issuer|
  |           |            |           |           |          |          |--------->|
  |           |            |           |           |          |          |          |
  |           |            |           |           |          |          | 20. Auth |
  |           |            |           |           |          |          | Approved |
  |           |            |           |           |          |          | (Code:   |
  |           |            |           |           |          |          | AUTH123) |
  |           |            |           |           |          |          |<---------|
  |           |            |           |           |          |          |          |
  |           |            |           |           | 21. Auth |          |          |
  |           |            |           |           | Approved |          |          |
  |           |            |           |           |<---------|----------|          |
  |           |            |           |           |          |          |          |
  |           |            | 22. Capture           |          |          |          |
  |           |            | Payment   |           |          |          |          |
  |           |            |-----------|---------->|          |          |          |
  |           |            |           |           |          |          |          |
  |           |            | 23. Payment           |          |          |          |
  |           |            | CAPTURED  |           |          |          |          |
  |           |            |<----------|-----------|          |          |          |
  |           |            |           |           |          |          |          |
  |           | 24. Payment|           |           |          |          |          |
  |           | Success    |           |           |          |          |          |
  |           | (Webhook)  |           |           |          |          |          |
  |           |<-----------|           |           |          |          |          |
  |           |            |           |           |          |          |          |
  | 25.       |            |           |           |          |          |          |
  | Payment   |            |           |           |          |          |          |
  | Confirmed |            |           |           |          |          |          |
  | (Receipt) |            |           |           |          |          |          |
  |<----------|            |           |           |          |          |          |
  |           |            |           |           |          |          |          |


  LEGEND:
  ------>  Synchronous call
  <------  Synchronous response
  3DS      3D Secure 2.0 Protocol
  ACS      Access Control Server (Issuing Bank)
  HSM      Hardware Security Module
  OTP      One-Time Password
  RRN      Retrieval Reference Number
`}</pre>

      <h3 style={sectionTitle}>Key Interaction Summary</h3>
      <div style={gridStyle}>
        {[
          { step:'Steps 1-2', title:'Payment Initiation', desc:'Customer submits payment on merchant site. Merchant API forwards payment request to Payment Service with card token, amount, currency, and idempotency key.', color:C.accent },
          { step:'Steps 3-5', title:'Fraud Check & Tokenization', desc:'Payment Service scores transaction via Fraud Engine (ML model + velocity rules). If accepted, card PAN is tokenized via HSM. Network token generated per RBI mandate.', color:C.warn },
          { step:'Steps 6-12', title:'3D Secure Authentication', desc:'Gateway checks 3DS enrollment. If required, customer is redirected to issuing bank ACS page for OTP challenge. Customer enters OTP for authentication.', color:C.info },
          { step:'Steps 13-17', title:'3DS Verification', desc:'3DS Server verifies OTP with issuing bank via card network. Authentication result (success/failure) returned to payment gateway. Liability shifts to issuer on success.', color:C.danger },
          { step:'Steps 18-23', title:'Authorization & Capture', desc:'Payment gateway sends authorization request through card network to issuing bank. Bank approves with auth code. Payment Service captures the authorized amount.', color:C.success },
          { step:'Steps 24-25', title:'Notification & Confirmation', desc:'Payment success webhook delivered to merchant. Customer receives payment confirmation via SMS/email/push with receipt and transaction reference.', color:C.accent }
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
            Payment Gateway Testing Architecture
          </h1>
          <p style={{ color:C.muted, fontSize:15, lineHeight:1.6 }}>
            Card Payments | UPI | NEFT/RTGS/IMPS | Wallets | NACH - Banking QA Testing Dashboard
          </p>
          <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
            {badge(C.info, 'Visa/MC/RuPay')}{badge(C.accent, 'UPI')}{badge(C.warn, 'NEFT/RTGS/IMPS')}{badge(C.success, 'Wallets')}{badge(C.danger, 'PCI-DSS L1')}{badge(C.info, '3D Secure')}{badge(C.warn, 'NACH')}{badge(C.accent, 'Settlement')}
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
          Payment Gateway Testing Architecture | Banking QA Dashboard | PCI-DSS | Card Networks | UPI | NEFT/RTGS | Settlement
        </div>
      </div>
    </div>
  );
}

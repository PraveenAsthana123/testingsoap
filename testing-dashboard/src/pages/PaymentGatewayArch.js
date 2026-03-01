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
      <h2 style={sectionTitle}>Payment Gateway Testing Architecture</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Enterprise-grade payment gateway testing platform for Indian banking ecosystem covering PCI-DSS compliance, 3D Secure 2.0, UPI/IMPS/NEFT/RTGS payment rails, card network integration (Visa/Mastercard/RuPay), tokenization, HSM key management, fraud detection, and settlement reconciliation.
      </p>

      <pre style={preStyle}>{`
+============================================================================+
|                PAYMENT GATEWAY TESTING PLATFORM                             |
|                    Banking QA Architecture Overview                         |
+============================================================================+

  PAYMENT CHANNELS              GATEWAY ENGINE                    OUTPUT
  ================              ==============                    ======

  +----------------+         +----------------------------------+
  | Card Payments  |-------->|                                  |    +---------------------+
  | (Visa/MC/RuPay)|         |    PAYMENT GATEWAY ENGINE        |    | Transaction         |
  +----------------+         |    ======================        |--->| Dashboard           |
                             |                                  |    +---------------------+
  +----------------+         |  +----------------------------+  |
  | UPI (NPCI)     |-------->|  | Payment Router             |  |    +---------------------+
  | - P2P / P2M    |         |  | - Card Network Routing     |  |--->| Settlement          |
  +----------------+         |  | - UPI Switch (NPCI)        |  |    | Reports             |
                             |  | - NEFT/RTGS (RBI)          |  |    +---------------------+
  +----------------+         |  | - IMPS (NPCI)              |  |
  | NEFT / RTGS    |-------->|  | - Wallet / PPI             |  |    +---------------------+
  | (RBI)          |         |  +----------------------------+  |--->| Fraud               |
  +----------------+         |                                  |    | Analytics           |
                             |  +----------------------------+  |    +---------------------+
  +----------------+         |  | 3D Secure 2.0 Engine       |  |
  | IMPS (NPCI)    |-------->|  | - ACS (Issuer)             |  |    +---------------------+
  +----------------+         |  | - DS (Directory Server)    |  |--->| Reconciliation      |
                             |  | - 3DS Server (Acquirer)    |  |    | Engine              |
  +----------------+         |  | - Challenge Flow           |  |    +---------------------+
  | Net Banking    |-------->|  | - Frictionless Flow        |  |
  +----------------+         |  +----------------------------+  |    +---------------------+
                             |                                  |--->| Chargeback          |
  +----------------+         |  +----------------------------+  |    | Management          |
  | Wallets / PPI  |-------->|  | Tokenization Engine        |  |    +---------------------+
  | (Paytm/PhonePe)|         |  | - Network Tokenization     |  |
  +----------------+         |  | - Device Token (DPAN)      |  |
                             |  | - Merchant Token            |  |
  +----------------+         |  | - CoF Tokenization (RBI)   |  |
  | QR Code        |-------->|  +----------------------------+  |
  | (Bharat QR /   |         |                                  |
  |  UPI QR)       |         |  +----------------------------+  |
  +----------------+         |  | Fraud Detection Engine     |  |
                             |  | - Velocity Checks          |  |
                             |  | - ML-Based Risk Scoring    |  |
                             |  | - Device Fingerprinting    |  |
                             |  | - Geo-location Validation  |  |
                             |  | - BIN/IIN Analysis         |  |
                             |  +----------------------------+  |
                             |                                  |
                             |  +----------------------------+  |
                             |  | HSM / Key Management       |  |
                             |  | - PIN Block Encryption     |  |
                             |  | - MAC Generation/Verify    |  |
                             |  | - Key Injection (KEK/ZMK)  |  |
                             |  | - EMV Key Derivation       |  |
                             |  | - PCI PTS Compliance       |  |
                             |  +----------------------------+  |
                             |                                  |
                             |  +----------------------------+  |
                             |  | Settlement & Reconciliation|  |
                             |  | - T+1 / T+2 Settlement    |  |
                             |  | - Interchange Calculation  |  |
                             |  | - MDR Computation          |  |
                             |  | - Chargeback Processing    |  |
                             |  | - Dispute Resolution       |  |
                             |  +----------------------------+  |
                             +----------------------------------+

  EXTERNAL INTEGRATIONS
  =====================

  +----------------+    +----------------+    +------------------+    +----------------+
  | NPCI           |    | Visa / MC      |    | RBI (NEFT/RTGS)  |    | Card Networks  |
  | (UPI/IMPS/     |    | (VisaNet /     |    | (SFMS / INFINET) |    | (RuPay/Amex/   |
  |  RuPay/NACH)   |    |  Banknet)      |    |                  |    |  Diners/JCB)   |
  +----------------+    +----------------+    +------------------+    +----------------+
  +----------------+    +----------------+    +------------------+    +----------------+
  | Acquirer Banks |    | Issuer Banks   |    | Payment          |    | HSM Vendors    |
  | (Axis/HDFC/    |    | (SBI/ICICI/    |    | Aggregators      |    | (Thales/       |
  |  ICICI/SBI)    |    |  BOB/PNB)      |    | (Razorpay/CCAvn) |    |  Utimaco)      |
  +----------------+    +----------------+    +------------------+    +----------------+
`}</pre>

      <h3 style={sectionTitle}>Module Overview</h3>
      <div style={gridStyle}>
        {[
          { title:'Card Payment Processing', desc:'End-to-end card transaction lifecycle covering authorization, capture, settlement, and reversal for Visa, Mastercard, RuPay, and Amex networks. Includes EMV chip, contactless (NFC), and e-commerce transactions.', reg:'PCI-DSS v4.0 / EMV Specification', color:C.accent },
          { title:'UPI Payment Rail', desc:'Unified Payments Interface testing covering P2P, P2M, collect requests, mandate/autopay, UPI Lite, and UPI 123PAY. Integration with NPCI Common Library (UCL) and PSP/TPAP flows.', reg:'NPCI UPI Procedural Guidelines', color:C.info },
          { title:'3D Secure 2.0 Authentication', desc:'EMVCo 3DS 2.0 protocol testing with frictionless and challenge flows. ACS (Access Control Server), DS (Directory Server), and 3DS Server integration. Risk-Based Authentication (RBA).', reg:'EMVCo 3DS 2.3.1 Specification', color:C.warn },
          { title:'Tokenization Engine', desc:'RBI-mandated Card-on-File (CoF) tokenization. Network tokenization via Visa VTS, MC MDES, and RuPay tokenization. Device tokens (DPAN), merchant tokens, and token lifecycle management.', reg:'RBI CoF Tokenization Directive 2022', color:C.danger },
          { title:'Fraud Detection System', desc:'Real-time fraud scoring using velocity checks, device fingerprinting, geo-location analysis, BIN intelligence, and ML models (XGBoost, Neural Networks). Includes chargeback fraud pattern detection.', reg:'PCI-DSS Req 10 / RBI Fraud Reporting', color:C.success },
          { title:'HSM & Key Management', desc:'Hardware Security Module testing for PIN block encryption (ISO 9564), MAC generation/verification, key injection (KEK/ZMK/ZPK), EMV key derivation, and DUKPT key management.', reg:'PCI PTS / ANSI X9.24', color:C.warn },
          { title:'Settlement & Reconciliation', desc:'Multi-party settlement processing (acquirer, issuer, network). Interchange fee calculation, MDR computation, T+1/T+2 settlement cycles, and automated reconciliation across payment rails.', reg:'NPCI / RBI Settlement Guidelines', color:C.info },
          { title:'Chargeback & Dispute Management', desc:'End-to-end chargeback lifecycle: retrieval request, first chargeback, representment, pre-arbitration, arbitration. Reason code mapping (Visa/MC/RuPay) and SLA tracking.', reg:'Visa Core Rules / MC Chargeback Guide', color:C.accent }
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
        Payment Gateway Testing Framework for Indian Banking - Business Requirements covering card payments, UPI, NEFT/RTGS/IMPS, tokenization, fraud detection, HSM security, and settlement reconciliation.
      </p>

      <h3 style={subTitle}>Objectives</h3>
      <div style={cardStyle}>
        <ul style={{ color:C.text, lineHeight:2, paddingLeft:20 }}>
          <li>Ensure <strong style={{ color:C.accent }}>100% PCI-DSS v4.0 compliance</strong> across all payment processing components including CDE, HSM, and network infrastructure</li>
          <li>Validate end-to-end payment flows for all rails: Card (Visa/MC/RuPay), UPI, NEFT, RTGS, IMPS with <strong style={{ color:C.accent }}>&lt; 2 second authorization latency</strong></li>
          <li>Achieve <strong style={{ color:C.danger }}>zero unencrypted PAN storage</strong> through RBI-mandated CoF tokenization across all merchant integrations</li>
          <li>Validate 3D Secure 2.0 authentication with frictionless approval rate of <strong style={{ color:C.accent }}>&gt; 85%</strong> and challenge completion rate of &gt; 70%</li>
          <li>Ensure fraud detection engine catches &gt; 95% of known fraud patterns with false positive rate &lt; 2%</li>
          <li>Validate settlement reconciliation accuracy at <strong style={{ color:C.accent }}>99.99%</strong> across all payment networks</li>
        </ul>
      </div>

      <h3 style={sectionTitle}>Scope by Payment Domain</h3>
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
            { reg:'Card Payments (Visa/MC/RuPay)', scope:'Authorization, capture, void, refund, reversal, partial capture, recurring payments, installments (EMI), card-present (POS/ATM), card-not-present (e-commerce), contactless (NFC)', controls:'ISO 8583 message validation, EMV chip processing, CVV/CVV2 verification, address verification (AVS), BIN validation', freq:'Every release + quarterly regression' },
            { reg:'UPI (NPCI)', scope:'P2P transfer, P2M payment, collect request, mandate registration/execution/revocation, UPI Lite (small value), UPI 123PAY (feature phone), UPI Autopay, QR code payments', controls:'NPCI Common Library (UCL) compliance, PSP-TPAP integration, VPA validation, MPIN encryption, transaction limits', freq:'Every release + NPCI certification cycles' },
            { reg:'NEFT / RTGS / IMPS', scope:'Outward/inward remittance, beneficiary validation, IFSC code validation, large value transfers (RTGS), batch processing (NEFT), instant transfers (IMPS)', controls:'SFMS message format, INFINET connectivity, RBI settlement windows, beneficiary name matching, IBAN validation', freq:'Every release + RBI mandated testing' },
            { reg:'3D Secure 2.0', scope:'Frictionless authentication, challenge flow (OTP/biometric), risk-based authentication, exemption handling (TRA/LVP/recurring), 3DS Method, device data collection', controls:'EMVCo 3DS protocol compliance, ACS/DS/3DS Server integration, SCA requirements, authentication data validation', freq:'Every release + EMVCo certification' },
            { reg:'Tokenization (RBI CoF)', scope:'Token provisioning, token lifecycle (suspend/resume/delete), network tokenization (VTS/MDES/RuPay), device tokenization (DPAN), merchant token mapping', controls:'Token requestor onboarding, cryptogram generation, domain restriction, token-PAN mapping security', freq:'Continuous + RBI compliance audits' },
            { reg:'Fraud Detection', scope:'Real-time transaction scoring, velocity checks, device fingerprinting, geo-fencing, BIN/IIN analysis, ML model scoring, chargeback fraud detection, friendly fraud identification', controls:'Rule engine configuration, ML model accuracy validation, false positive monitoring, alert escalation workflow', freq:'Continuous + monthly model review' },
            { reg:'HSM / Key Management', scope:'PIN block translation (ISO 9564), MAC generation/verification, key injection (KEK/ZMK/ZPK), DUKPT key derivation, EMV key management, certificate lifecycle', controls:'PCI PTS device security, ANSI X9.24 key management, dual control/split knowledge, key ceremony audit', freq:'Quarterly + key rotation events' }
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
          { title:'Authorization Latency', value:'< 2 sec', desc:'End-to-end card authorization must complete within 2 seconds including network round-trip to issuer. UPI transactions must respond within 800ms per NPCI SLA.', color:C.danger },
          { title:'System Availability', value:'99.99%', desc:'Payment gateway must maintain 99.99% uptime (max 52 minutes downtime/year). Active-active deployment across 2 data centers with automatic failover.', color:C.success },
          { title:'Transaction TPS', value:'10,000+', desc:'Gateway must handle 10,000+ transactions per second during peak load (festival sales, salary day). UPI peak capacity: 1 Lakh TPS per NPCI projections.', color:C.info },
          { title:'Settlement Accuracy', value:'99.99%', desc:'Automated reconciliation must achieve 99.99% accuracy across all payment networks. Discrepancies must be flagged within T+1 settlement window.', color:C.accent },
          { title:'PCI-DSS Compliance', value:'Level 1', desc:'As a payment processor handling >6 million transactions/year, must maintain PCI-DSS Level 1 compliance with annual QSA audit and quarterly ASV scans.', color:C.warn },
          { title:'Data Encryption', value:'AES-256', desc:'All cardholder data encrypted at rest (AES-256) and in transit (TLS 1.2+). PIN blocks encrypted via HSM using 3DES/AES. Zero clear-text PAN in logs or databases.', color:C.danger }
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
        High-level payment gateway architecture showing transaction flow through payment routing, authentication, fraud scoring, authorization, settlement, and reconciliation subsystems.
      </p>

      <pre style={preStyle}>{`
+=============================================================================+
|              HIGH-LEVEL PAYMENT GATEWAY ARCHITECTURE                         |
+=============================================================================+

   PAYMENT TRANSACTION FLOW
   ========================

   Customer Initiates Payment (Card / UPI / NEFT / RTGS / IMPS)
            |
            v
   +------------------+     +--------------------+     +-------------------+
   | Channel Gateway  |---->| Payment Router      |---->| Authentication    |
   | - POS Terminal   |     | - Card Network ID   |     | Engine            |
   | - E-commerce     |     | - BIN/IIN Lookup    |     | - 3DS 2.0         |
   | - Mobile App     |     | - UPI PSP Routing   |     | - UPI MPIN        |
   | - UPI App        |     | - NEFT/RTGS Switch  |     | - Net Banking OTP |
   | - ATM            |     | - Least-cost Route  |     | - Biometric       |
   +------------------+     +--------------------+     +-------------------+
                                                               |
                             +--------------------+            |
                             | Fraud Detection    |<-----------+
                             | Engine             |
                             | - Velocity checks  |
                             | - ML risk score    |
                             | - Device fingerprint|
                             | - Geo-validation   |
                             +--------------------+
                                      |
                             +--------------------+     +-------------------+
                             | Authorization      |---->| Card Network /    |
                             | Engine             |     | Payment Switch    |
                             | - ISO 8583 builder |     | - VisaNet         |
                             | - HSM PIN translate|     | - Banknet (MC)    |
                             | - Token detokenize |     | - RuPay Switch    |
                             | - Risk decision    |     | - NPCI UPI Switch |
                             +--------------------+     | - RBI SFMS (NEFT) |
                                                        | - INFINET (RTGS)  |
                                                        +-------------------+
                                                               |
                                                               v
                                                        +-------------------+
                                                        | Issuer Bank       |
                                                        | - Balance check   |
                                                        | - Fraud rules     |
                                                        | - Auth decision   |
                                                        | - Response code   |
                                                        +-------------------+
                                                               |
                                                               v
   +------------------+     +--------------------+     +-------------------+
   | Response Handler |<----| Post-Auth Processing|<----| Auth Response     |
   | - Customer notify|     | - Capture/Void     |     | - Approve/Decline |
   | - Receipt gen    |     | - Partial capture  |     | - Response code   |
   | - Webhook fire   |     | - Reversal/Timeout |     | - Auth code       |
   +------------------+     +--------------------+     +-------------------+


   SETTLEMENT ENGINE
   =================

   +------------------------------------------------------------------+
   |                Settlement & Reconciliation Engine                  |
   |                                                                   |
   |  +--------------------+  +--------------------+                   |
   |  | Settlement Files   |  | Reconciliation     |                   |
   |  | - Visa TC33/TC40   |  | Engine             |                   |
   |  | - MC IPM/GCMS      |  | - Gateway vs Switch|                   |
   |  | - RuPay Settlement |  | - Switch vs Issuer |                   |
   |  | - UPI Settlement   |  | - Fee calculation  |                   |
   |  | - NEFT/RTGS batch  |  | - Exception detect |                   |
   |  +--------------------+  +--------------------+                   |
   |                                                                   |
   |  +--------------------+  +--------------------+                   |
   |  | Fee Engine         |  | Chargeback Manager |                   |
   |  | - Interchange calc |  | - Retrieval req    |                   |
   |  | - MDR computation  |  | - First chargeback |                   |
   |  | - Surcharge apply  |  | - Representment    |                   |
   |  | - GST calculation  |  | - Pre-arbitration  |                   |
   |  +--------------------+  | - Arbitration      |                   |
   |                           +--------------------+                   |
   +------------------------------------------------------------------+


   TOKENIZATION LAYER
   ==================

   +------------------------------------------------------------------+
   |                   Tokenization Service                            |
   |                                                                   |
   |  +------------------+  +------------------+  +----------------+  |
   |  | Visa Token Svc   |  | MC MDES          |  | RuPay Token    |  |
   |  | (VTS)            |  | Token Service    |  | Service        |  |
   |  | - Token provision|  | - Token provision|  | - NPCI token   |  |
   |  | - Cryptogram gen |  | - DSRP crypto    |  | - Domestic     |  |
   |  | - Lifecycle mgmt |  | - Lifecycle mgmt |  | - Lifecycle    |  |
   |  +------------------+  +------------------+  +----------------+  |
   |                                                                   |
   |  Token Vault: PAN <-> Token Mapping (HSM Protected, AES-256)    |
   +------------------------------------------------------------------+


   HSM INFRASTRUCTURE
   ==================

   +------------------------------------------------------------------+
   |                   HSM Cluster (PCI PTS Certified)                 |
   |                                                                   |
   |  +------------------+  +------------------+  +----------------+  |
   |  | PIN Translation  |  | Key Management   |  | Cryptographic  |  |
   |  | - ISO 9564 Fmt 0 |  | - KEK Injection  |  | Operations     |  |
   |  | - ISO 9564 Fmt 3 |  | - ZMK Exchange   |  | - MAC Gen/Vrfy |  |
   |  | - PIN Verify     |  | - ZPK Rotation   |  | - EMV Crypto   |  |
   |  | - PIN Change     |  | - DUKPT Derive   |  | - Digital Sign |  |
   |  | - PVV Generate   |  | - RSA Key Pair   |  | - Hash (SHA)   |  |
   |  +------------------+  +------------------+  +----------------+  |
   +------------------------------------------------------------------+
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

  POST /api/v1/payments/authorize
  --------------------------------
  Request:
  {
    "merchant_id": "MER-2024-00123",
    "order_id": "ORD-20240115-98765",
    "amount": 15000.00,
    "currency": "INR",
    "payment_method": {
      "type": "CARD | UPI | NET_BANKING | WALLET",
      "card": {
        "token_ref": "TKN-VISA-4567890123",
        "cryptogram": "AABBCCDD11223344",
        "eci": "05",
        "cavv": "base64_encoded_cavv"
      },
      "upi": {
        "vpa": "customer@okicici",
        "flow": "PAY | COLLECT | INTENT"
      }
    },
    "billing": { "name": "Rajesh Kumar", "email": "rajesh@example.com" },
    "device_info": {
      "ip": "103.25.180.42",
      "user_agent": "Mozilla/5.0...",
      "device_id": "DEV-FINGERPRINT-XYZ"
    },
    "three_ds": { "version": "2.2.0", "challenge_preference": "NO_PREFERENCE" },
    "idempotency_key": "IDEM-UUID-12345"
  }
  Response: 200 OK
  {
    "payment_id": "PAY-20240115-00042",
    "status": "AUTHORIZED | DECLINED | REQUIRES_3DS | PENDING",
    "auth_code": "A12345",
    "rrn": "412345678901",
    "response_code": "00",
    "response_message": "Approved",
    "amount_authorized": 15000.00,
    "network_txn_id": "VISA-TXN-987654",
    "fraud_score": 12,
    "three_ds_result": {
      "authentication_status": "Y",
      "eci": "05",
      "cavv": "base64_encoded"
    }
  }

  POST /api/v1/payments/{payment_id}/capture
  -------------------------------------------
  Request:
  {
    "amount": 15000.00,
    "final": true
  }
  Response: 200 OK
  {
    "payment_id": "PAY-20240115-00042",
    "status": "CAPTURED",
    "amount_captured": 15000.00,
    "settlement_date": "2024-01-17"
  }

  POST /api/v1/payments/{payment_id}/refund
  -------------------------------------------
  Request:
  {
    "amount": 5000.00,
    "reason": "CUSTOMER_REQUEST | DUPLICATE | FRAUD",
    "reference": "REF-REFUND-001"
  }
  Response: 200 OK
  {
    "refund_id": "RFD-20240116-00018",
    "status": "INITIATED | PROCESSED",
    "amount_refunded": 5000.00,
    "arn": "74123456789012345678901"
  }

  POST /api/v1/upi/pay
  ----------------------
  Request:
  {
    "payer_vpa": "customer@okicici",
    "payee_vpa": "merchant@yesbank",
    "amount": 500.00,
    "purpose": "PURCHASE | TRANSFER",
    "remarks": "Payment for order #123",
    "mcc": "5411",
    "ref_id": "UPI-REF-20240115-001",
    "expiry_minutes": 10
  }
  Response: 200 OK
  {
    "upi_txn_id": "UPI-TXN-CKD78F9G12",
    "npci_txn_id": "NPCI-20240115-987654",
    "status": "SUCCESS | FAILURE | PENDING | DEEMED",
    "response_code": "00",
    "payer_name": "Rajesh Kumar",
    "approval_number": "654321"
  }
`}</pre>

      <h3 style={sectionTitle}>ISO 8583 Message Structure</h3>
      <pre style={preStyle}>{`
  ISO 8583 MESSAGE FORMAT (Authorization Request - 0100)
  ======================================================

  Field  Name                      Length  Value Example
  -----  ----                      ------  -------------
  MTI    Message Type Indicator    4       0100 (Authorization Request)
  DE-2   Primary Account Number    19      4567XXXXXXXX1234
  DE-3   Processing Code           6       000000 (Purchase)
  DE-4   Transaction Amount        12      000000150000 (INR 1500.00)
  DE-7   Transmission Date/Time    10      0115143022 (MMDDHHmmss)
  DE-11  System Trace Audit Number 6       123456
  DE-12  Local Transaction Time    6       143022
  DE-13  Local Transaction Date    4       0115
  DE-14  Expiration Date           4       2612 (YYMM)
  DE-22  POS Entry Mode            3       051 (Chip + PIN)
  DE-23  Card Sequence Number      3       001
  DE-25  POS Condition Code        2       00 (Normal transaction)
  DE-26  PIN Capture Code          2       04
  DE-32  Acquiring Institution ID  11      12345678
  DE-35  Track 2 Data              37      (Encrypted by HSM)
  DE-37  Retrieval Reference Num   12      412345678901
  DE-38  Authorization Code        6       A12345
  DE-39  Response Code             2       00 (Approved)
  DE-41  Terminal ID               8       TERM0001
  DE-42  Merchant ID               15      MER000000012345
  DE-43  Merchant Name/Location    40      MERCHANT STORE / MUMBAI / IN
  DE-48  Private Data              999     (EMV Tags / 3DS Data)
  DE-49  Currency Code             3       356 (INR)
  DE-52  PIN Data (Encrypted)      8       (HSM PIN Block)
  DE-55  EMV Data (ICC)            999     (TLV Encoded EMV Tags)


  KEY EMV TAGS IN DE-55
  =====================

  Tag    Name                      Example
  ---    ----                      -------
  9F26   Application Cryptogram    A1B2C3D4E5F6G7H8
  9F27   Cryptogram Info Data      80 (ARQC)
  9F10   Issuer Application Data   06010A03A4A800
  9F37   Unpredictable Number      12AB34CD
  9F36   Application Txn Counter   0012
  9F02   Amount Authorized         000000150000
  9F03   Amount Other              000000000000
  9F1A   Terminal Country Code     0356
  5F2A   Transaction Currency Code 0356
  9A     Transaction Date          240115
  9C     Transaction Type          00
  9F33   Terminal Capabilities     E0F0C8
  9F34   CVM Results               420302
  9F35   Terminal Type             22
`}</pre>

      <h3 style={sectionTitle}>Database Schema</h3>
      <pre style={preStyle}>{`
  DATABASE SCHEMA DESIGN
  ======================

  TABLE: transactions
  --------------------
  txn_id            VARCHAR(30)  PRIMARY KEY
  merchant_id       VARCHAR(20)  NOT NULL  REFERENCES merchants(merchant_id)
  order_id          VARCHAR(50)  NOT NULL
  payment_method    ENUM('CARD','UPI','NEFT','RTGS','IMPS','WALLET','NET_BANKING')
  txn_type          ENUM('AUTHORIZATION','CAPTURE','VOID','REFUND','REVERSAL')
  status            ENUM('INITIATED','AUTHORIZED','CAPTURED','SETTLED','DECLINED','REVERSED','REFUNDED')
  amount            DECIMAL(15,2) NOT NULL
  currency          CHAR(3)       DEFAULT 'INR'
  auth_code         VARCHAR(10)
  rrn               VARCHAR(12)
  response_code     VARCHAR(4)
  network_txn_id    VARCHAR(50)
  token_ref         VARCHAR(50)
  eci               VARCHAR(2)
  fraud_score       INTEGER       CHECK(fraud_score BETWEEN 0 AND 100)
  settlement_date   DATE
  created_at        TIMESTAMP     DEFAULT NOW()
  updated_at        TIMESTAMP
  INDEX idx_txn_merchant     ON transactions(merchant_id)
  INDEX idx_txn_order        ON transactions(order_id)
  INDEX idx_txn_status       ON transactions(status)
  INDEX idx_txn_created      ON transactions(created_at)
  INDEX idx_txn_settlement   ON transactions(settlement_date)
  INDEX idx_txn_rrn          ON transactions(rrn)

  TABLE: token_vault
  -------------------
  token_id          VARCHAR(50)  PRIMARY KEY
  token_requestor   VARCHAR(50)  NOT NULL
  token_type        ENUM('NETWORK','DEVICE','MERCHANT','COF')
  card_network      ENUM('VISA','MASTERCARD','RUPAY','AMEX')
  pan_hash          VARCHAR(64)  NOT NULL
  pan_last_four     CHAR(4)      NOT NULL
  pan_encrypted     BYTEA        NOT NULL
  expiry_month      SMALLINT
  expiry_year       SMALLINT
  token_status      ENUM('ACTIVE','SUSPENDED','DEACTIVATED','EXPIRED')
  domain_restriction VARCHAR(100)
  created_at        TIMESTAMP    DEFAULT NOW()
  updated_at        TIMESTAMP
  INDEX idx_token_requestor  ON token_vault(token_requestor)
  INDEX idx_token_status     ON token_vault(token_status)
  INDEX idx_token_pan_hash   ON token_vault(pan_hash)

  TABLE: settlement_records
  -------------------------
  settlement_id     VARCHAR(30)  PRIMARY KEY
  batch_id          VARCHAR(30)  NOT NULL
  network           ENUM('VISA','MASTERCARD','RUPAY','UPI','NEFT','RTGS','IMPS')
  settlement_date   DATE         NOT NULL
  total_txns        INTEGER
  gross_amount      DECIMAL(18,2)
  interchange_fee   DECIMAL(15,2)
  mdr_amount        DECIMAL(15,2)
  gst_amount        DECIMAL(15,2)
  net_settlement    DECIMAL(18,2)
  status            ENUM('PENDING','PROCESSED','RECONCILED','EXCEPTION')
  file_reference    VARCHAR(100)
  created_at        TIMESTAMP    DEFAULT NOW()
  INDEX idx_settle_date      ON settlement_records(settlement_date)
  INDEX idx_settle_network   ON settlement_records(network)
  INDEX idx_settle_status    ON settlement_records(status)
  INDEX idx_settle_batch     ON settlement_records(batch_id)

  TABLE: chargebacks
  -------------------
  chargeback_id     VARCHAR(30)  PRIMARY KEY
  txn_id            VARCHAR(30)  NOT NULL REFERENCES transactions(txn_id)
  arn               VARCHAR(24)  NOT NULL
  reason_code       VARCHAR(10)  NOT NULL
  reason_desc       TEXT
  stage             ENUM('RETRIEVAL','FIRST_CHARGEBACK','REPRESENTMENT','PRE_ARBITRATION','ARBITRATION')
  status            ENUM('OPEN','RESPONDED','WON','LOST','EXPIRED')
  chargeback_amount DECIMAL(15,2) NOT NULL
  currency          CHAR(3)      DEFAULT 'INR'
  deadline_date     DATE         NOT NULL
  evidence_json     JSONB
  created_at        TIMESTAMP    DEFAULT NOW()
  updated_at        TIMESTAMP
  INDEX idx_cb_txn           ON chargebacks(txn_id)
  INDEX idx_cb_arn           ON chargebacks(arn)
  INDEX idx_cb_stage         ON chargebacks(stage)
  INDEX idx_cb_deadline      ON chargebacks(deadline_date)

  TABLE: fraud_alerts
  --------------------
  alert_id          VARCHAR(30)  PRIMARY KEY
  txn_id            VARCHAR(30)  NOT NULL REFERENCES transactions(txn_id)
  rule_id           VARCHAR(20)  NOT NULL
  alert_type        ENUM('VELOCITY','GEO_MISMATCH','DEVICE_ANOMALY','BIN_RISK','ML_SCORE','AMOUNT_ANOMALY')
  risk_score        INTEGER      CHECK(risk_score BETWEEN 0 AND 100)
  disposition       ENUM('PENDING','CONFIRMED_FRAUD','FALSE_POSITIVE','BLOCKED')
  details_json      JSONB
  created_at        TIMESTAMP    DEFAULT NOW()
  INDEX idx_fraud_txn        ON fraud_alerts(txn_id)
  INDEX idx_fraud_type       ON fraud_alerts(alert_type)
  INDEX idx_fraud_score      ON fraud_alerts(risk_score)
`}</pre>
    </div>
  );

  const renderScenarios = () => (
    <div>
      <h2 style={sectionTitle}>Payment Gateway Testing Scenarios</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 comprehensive test scenarios covering card payments, UPI, 3D Secure, tokenization, fraud detection, HSM operations, settlement, and chargeback processing for Indian banking payment systems.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width:50 }}>#</th>
            <th style={thStyle}>Scenario</th>
            <th style={thStyle}>Domain</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Expected Outcome</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id:'S01', title:'Card Authorization with EMV Chip', reg:'Card/EMV', desc:'Customer swipes/inserts chip card at POS terminal. Terminal reads EMV chip data, generates ARQC cryptogram. Gateway builds ISO 8583 message (MTI 0100), routes to card network (Visa/MC/RuPay), issuer validates and responds.', outcome:'Authorization approved (Response Code 00), auth code generated, ARPC cryptogram returned to chip for verification, transaction logged with full EMV tag data.' },
            { id:'S02', title:'UPI P2P Transfer via PSP App', reg:'UPI/NPCI', desc:'Payer enters payee VPA (user@okbank), amount INR 5000, and MPIN on PSP app. Request routed through PSP switch to NPCI UPI, NPCI validates and routes to payee PSP. Both payer and payee banks process debit/credit.', outcome:'UPI transaction SUCCESS (response code 00), NPCI transaction ID generated, both payer debited and payee credited, SMS notifications sent to both parties within 5 seconds.' },
            { id:'S03', title:'3D Secure 2.0 Frictionless Flow', reg:'3DS/EMVCo', desc:'E-commerce payment initiated. 3DS Server sends AReq to Directory Server, DS routes to Issuer ACS. ACS performs risk-based authentication using device data, transaction history, and behavioral analysis. Low-risk transaction approved without challenge.', outcome:'3DS authentication completed frictionlessly (transStatus=Y), ECI=05 for Visa / ECI=02 for MC, CAVV generated, liability shift to issuer, total auth time < 3 seconds.' },
            { id:'S04', title:'3D Secure 2.0 Challenge Flow (OTP)', reg:'3DS/EMVCo', desc:'High-risk e-commerce transaction triggers challenge. ACS sends CReq with OTP challenge to cardholder browser/app. Customer enters OTP received via SMS. ACS validates OTP and returns authentication result.', outcome:'Challenge completed successfully (transStatus=Y after challenge), OTP validated within 5-minute window, CAVV generated, authentication data embedded in authorization message.' },
            { id:'S05', title:'RBI CoF Tokenization - Token Provisioning', reg:'Tokenization', desc:'Customer saves card on merchant app. Merchant (Token Requestor) sends tokenization request to card network (Visa VTS / MC MDES). Network validates card with issuer, generates token and cryptogram. Token stored instead of PAN.', outcome:'Network token provisioned successfully, DPAN/token mapped to PAN in token vault, domain restriction set to merchant, token status ACTIVE, original PAN purged from merchant system.' },
            { id:'S06', title:'UPI Mandate Registration & Auto-Debit', reg:'UPI/NPCI', desc:'Customer registers recurring mandate (UPI Autopay) for INR 999/month subscription. Mandate registered with NPCI, customer authenticates via MPIN. On due date, merchant initiates auto-debit execution against registered mandate.', outcome:'Mandate registered with unique UMN (UPI Mandate Number), execution on due date debits payer automatically, pre-debit notification sent 24hrs before, execution amount within mandate limit.' },
            { id:'S07', title:'NEFT Outward Remittance Processing', reg:'NEFT/RBI', desc:'Customer initiates NEFT transfer of INR 2,00,000 from SBI to HDFC. Originating bank validates beneficiary IFSC, builds SFMS message, submits to RBI NEFT clearing. Settlement in next available batch (half-hourly).', outcome:'NEFT message accepted by RBI clearing, beneficiary account credited within 2 hours (T+0 settlement), UTR number generated, credit confirmation received from beneficiary bank.' },
            { id:'S08', title:'RTGS Real-Time Gross Settlement', reg:'RTGS/RBI', desc:'Corporate initiates RTGS transfer of INR 5,00,00,000 (5 Crore). Bank validates sender account balance, builds SFMS message with RTGS-specific fields, submits to RBI INFINET. Real-time gross settlement processed.', outcome:'RTGS settled in real-time (within 30 minutes), UTR generated, beneficiary bank confirms credit, debit/credit confirmations sent to both parties, CRILC reporting triggered for large value.' },
            { id:'S09', title:'Contactless Card Payment (NFC)', reg:'Card/EMV', desc:'Customer taps contactless card/mobile wallet at POS terminal. Terminal reads NFC payload with EMV contactless kernel (Visa payWave / MC PayPass / RuPay Contactless). For transactions < INR 5000, no PIN required (CDCVM).', outcome:'Contactless authorization approved, CVM = No CVM Required for < 5000 INR, ARQC verified, transaction time < 500ms (tap-to-done), receipt printed/sent.' },
            { id:'S10', title:'Payment Refund Processing', reg:'Card/Settlement', desc:'Merchant initiates full refund of INR 15,000 for returned merchandise. Gateway sends reversal/credit to card network. Issuer processes credit to cardholder account. Refund reflected in next settlement cycle.', outcome:'Refund processed successfully, ARN generated for tracking, issuer credits cardholder within 5-7 business days, settlement file reflects refund adjustment, merchant account debited.' },
            { id:'S11', title:'HSM PIN Block Translation', reg:'HSM/PCI PTS', desc:'ATM captures customer PIN encrypted under terminal ZPK (Zone PIN Key). Gateway receives encrypted PIN block. HSM translates PIN block from terminal ZPK to host ZPK for forwarding to card network/issuer.', outcome:'PIN block translated without exposing clear PIN, source ZPK validated, destination ZPK applied, ISO 9564 Format 0/3 maintained, HSM audit log records operation with no clear PIN exposure.' },
            { id:'S12', title:'Fraud Detection - Velocity Check', reg:'Fraud/Risk', desc:'5 card-not-present transactions from same card within 10 minutes across different merchants totaling INR 2,50,000. Velocity rule triggers: >3 transactions in 15 minutes OR cumulative amount > INR 1,00,000.', outcome:'Fraud alert generated with type VELOCITY, risk score 88, 4th and 5th transactions auto-declined (response code 57), SMS alert sent to cardholder, card temporarily blocked pending review.' },
            { id:'S13', title:'Fraud Detection - Geo Mismatch', reg:'Fraud/Risk', desc:'Card used for POS transaction in Mumbai at 14:00 IST, followed by e-commerce transaction from IP geolocated to Lagos, Nigeria at 14:15 IST. Physically impossible travel time triggers geo-mismatch rule.', outcome:'GEO_MISMATCH fraud alert generated, risk score 95, e-commerce transaction declined, cardholder contacted for verification, card flagged for enhanced monitoring.' },
            { id:'S14', title:'Settlement Reconciliation - T+1', reg:'Settlement', desc:'End-of-day settlement file received from Visa (TC33) containing 15,000 transactions. Gateway reconciliation engine matches each settlement record against internal transaction database. Identifies discrepancies in amounts, missing transactions.', outcome:'14,985 transactions matched (99.9%), 10 amount mismatches flagged, 5 missing transactions identified, exception report generated, net settlement amount verified against bank statement.' },
            { id:'S15', title:'Chargeback First Representment', reg:'Chargeback', desc:'Issuer initiates chargeback for INR 25,000 with reason code 10.4 (Visa - Other Fraud). Merchant has 30 days to respond. Merchant submits representment with delivery proof, AVS match, 3DS authentication evidence.', outcome:'Representment package submitted within deadline, evidence includes 3DS proof (liability shift), delivery confirmation, AVS match. Chargeback reversed in merchant favor by network.' },
            { id:'S16', title:'EMV Key Injection & Rotation', reg:'HSM/Key Mgmt', desc:'Quarterly key rotation: new ZMK (Zone Master Key) exchanged between acquirer and network under dual control. ZPK (Zone PIN Key) derived from new ZMK. All terminals updated with new keys via remote key injection.', outcome:'ZMK exchanged successfully with split knowledge (2 components, 2 custodians), ZPK derived and distributed, all terminals updated, old keys decommissioned, key ceremony audit log complete.' },
            { id:'S17', title:'UPI Collect Request with Expiry', reg:'UPI/NPCI', desc:'Merchant sends UPI collect request to customer VPA for INR 1,200. Customer receives notification on UPI app. Customer does not respond within 10-minute expiry window. System handles timeout and notifies merchant.', outcome:'Collect request delivered to customer app, timer started. After 10 minutes: status changed to EXPIRED/DEEMED, merchant notified of expiry, no debit from customer account, NPCI timeout response received.' },
            { id:'S18', title:'Payment with Tokenized Card (CoF)', reg:'Tokenization', desc:'Returning customer on e-commerce site selects saved card (shows last 4 digits + network logo). Merchant sends token reference. Gateway detokenizes via network, generates cryptogram, processes authorization with actual PAN at network level.', outcome:'Token resolved to PAN at network level, cryptogram validated, authorization processed as normal card transaction, merchant never receives clear PAN, PCI scope reduced for merchant.' },
            { id:'S19', title:'BharatQR Code Payment', reg:'UPI/NPCI', desc:'Merchant displays static/dynamic Bharat QR code. Customer scans with any UPI app or card-linked app (Visa/MC/RuPay). Payment routed through appropriate rail (UPI or card network) based on scan method.', outcome:'QR decoded correctly, payment routed to appropriate network, transaction processed within 3 seconds, merchant receives instant notification, settlement included in respective network batch.' },
            { id:'S20', title:'IMPS Instant Fund Transfer', reg:'IMPS/NPCI', desc:'Customer initiates IMPS transfer of INR 50,000 using beneficiary mobile number + MMID. NPCI routes request to beneficiary bank. Instant debit from sender and credit to receiver. Available 24x7x365.', outcome:'IMPS transaction completed within 10 seconds, NPCI reference number generated, instant debit/credit reflected, SMS confirmation to both parties, available on bank holiday/weekend.' }
          ].map((s, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:700, textAlign:'center' }}>{s.id}</td>
              <td style={{ ...tdStyle, fontWeight:600, color:C.header, minWidth:200 }}>{s.title}</td>
              <td style={{ ...tdStyle, textAlign:'center' }}>{badge(
                s.reg.includes('Card') ? C.info : s.reg.includes('UPI') ? C.accent : s.reg.includes('3DS') ? C.warn : s.reg.includes('Token') ? C.danger : s.reg.includes('Fraud') ? C.danger : s.reg.includes('HSM') ? C.warn : s.reg.includes('Settlement') ? C.success : s.reg.includes('Chargeback') ? C.info : s.reg.includes('NEFT') || s.reg.includes('RTGS') ? C.accent : s.reg.includes('IMPS') ? C.success : C.accent,
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
      <h2 style={sectionTitle}>Payment Gateway Test Cases</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 detailed test cases covering card authorization, UPI flows, 3DS authentication, tokenization, fraud detection, HSM operations, settlement, and chargeback processing.
      </p>
      <div style={{ overflowX:'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, minWidth:80 }}>TC-ID</th>
              <th style={{ ...thStyle, minWidth:180 }}>Title</th>
              <th style={{ ...thStyle, minWidth:80 }}>Domain</th>
              <th style={{ ...thStyle, minWidth:250 }}>Steps</th>
              <th style={{ ...thStyle, minWidth:200 }}>Expected Result</th>
              <th style={{ ...thStyle, minWidth:60 }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id:'TC-PG-001', title:'Card Authorization - Approved', reg:'Card', steps:'1. Submit auth request (MTI 0100)\n2. Validate ISO 8583 field mapping\n3. Verify HSM PIN translation\n4. Route to card network\n5. Receive issuer response\n6. Verify auth code and RRN', result:'Authorization approved (RC=00), auth code 6 chars, RRN 12 digits, response time < 2 seconds, transaction logged with all fields', pri:'P0' },
              { id:'TC-PG-002', title:'Card Authorization - Declined (Insufficient Funds)', reg:'Card', steps:'1. Submit auth for amount exceeding balance\n2. Verify routing to correct network\n3. Receive decline response\n4. Validate response code mapping\n5. Verify decline notification\n6. Ensure no capture possible', result:'Authorization declined (RC=51), appropriate error message returned, cardholder notified, no settlement record created, decline logged for analytics', pri:'P0' },
              { id:'TC-PG-003', title:'UPI P2P Transfer - Success', reg:'UPI', steps:'1. Validate payer VPA format\n2. Verify payee VPA exists (NPCI lookup)\n3. Encrypt MPIN via device binding\n4. Submit to NPCI UPI switch\n5. Verify debit from payer bank\n6. Verify credit to payee bank', result:'UPI txn SUCCESS (RC=00), NPCI txn ID generated, payer debited, payee credited, both receive SMS within 5 sec, callback sent to PSP', pri:'P0' },
              { id:'TC-PG-004', title:'UPI P2P Transfer - Invalid VPA', reg:'UPI', steps:'1. Submit payment to non-existent VPA\n2. NPCI VPA validation fails\n3. Verify error response\n4. Ensure no debit from payer\n5. Check error code mapping\n6. Validate retry behavior', result:'Transaction fails with RC=U30 (Invalid VPA), no debit initiated, appropriate error message displayed, payer can retry with correct VPA', pri:'P0' },
              { id:'TC-PG-005', title:'3DS 2.0 Frictionless Authentication', reg:'3DS', steps:'1. Send AReq to Directory Server\n2. DS routes to Issuer ACS\n3. ACS performs RBA analysis\n4. Verify device data collection\n5. Receive frictionless approval\n6. Validate CAVV generation', result:'transStatus=Y (authenticated), ECI=05 (Visa), CAVV generated (28 bytes base64), total 3DS time < 3 sec, no customer interaction required', pri:'P0' },
              { id:'TC-PG-006', title:'3DS 2.0 Challenge Flow - OTP', reg:'3DS', steps:'1. ACS determines challenge required\n2. CReq sent to browser/SDK\n3. OTP delivered to cardholder\n4. Customer enters OTP\n5. ACS validates OTP\n6. RReq sent to 3DS Server', result:'Challenge rendered in iframe/SDK, OTP validated within 5-min window, transStatus=Y post-challenge, authentication data passed to authorization', pri:'P0' },
              { id:'TC-PG-007', title:'Token Provisioning (Visa VTS)', reg:'Tokenization', steps:'1. Merchant sends token request to VTS\n2. VTS validates with issuer\n3. Issuer approves tokenization\n4. Token generated with domain restriction\n5. Token stored in vault\n6. PAN purged from merchant', result:'Token provisioned (19-digit format), domain restriction = merchant, token status ACTIVE, PAN-to-token mapping stored in HSM-protected vault', pri:'P0' },
              { id:'TC-PG-008', title:'Token Lifecycle - Suspend/Resume', reg:'Tokenization', steps:'1. Issuer triggers token suspension\n2. Token status updated to SUSPENDED\n3. Attempt payment with suspended token\n4. Verify decline response\n5. Issuer resumes token\n6. Retry payment succeeds', result:'Suspended token declines (RC=62), resume restores to ACTIVE, subsequent payment succeeds, lifecycle events logged in token vault audit', pri:'P1' },
              { id:'TC-PG-009', title:'HSM PIN Translation - Format 0 to Format 3', reg:'HSM', steps:'1. Receive PIN block in ISO 9564 Format 0\n2. Send to HSM for translation\n3. HSM decrypts under source ZPK\n4. Re-encrypts under destination ZPK\n5. Output in ISO 9564 Format 3\n6. Verify no clear PIN exposure', result:'PIN block translated successfully, format changed from 0 to 3, HSM audit shows no clear PIN logged, source/dest ZPK validated, operation < 50ms', pri:'P0' },
              { id:'TC-PG-010', title:'HSM Key Rotation - ZPK Under ZMK', reg:'HSM', steps:'1. Generate new ZPK component 1\n2. Generate new ZPK component 2\n3. Combine under dual control\n4. Encrypt ZPK under existing ZMK\n5. Distribute to all terminals\n6. Verify old ZPK decommissioned', result:'New ZPK generated and distributed, dual control enforced (2 custodians), key check value (KCV) verified, all terminals updated, old key purged from HSM', pri:'P0' },
              { id:'TC-PG-011', title:'Fraud Rule - Velocity Breach', reg:'Fraud', steps:'1. Process 3 transactions in 5 minutes\n2. Verify first 3 approved\n3. Submit 4th transaction\n4. Velocity rule triggers\n5. Verify auto-decline\n6. Check fraud alert generated', result:'4th transaction declined (RC=57), fraud alert type=VELOCITY, risk score >= 80, cardholder SMS alert sent, card flagged for review', pri:'P0' },
              { id:'TC-PG-012', title:'Fraud Rule - ML Score Threshold', reg:'Fraud', steps:'1. Submit transaction with high-risk features\n2. ML model scores transaction\n3. Score exceeds threshold (> 85)\n4. Verify step-up authentication\n5. If auth fails, decline\n6. Log ML feature importance', result:'ML risk score calculated in < 100ms, score > 85 triggers step-up or decline, model features logged for explainability, alert created for analyst review', pri:'P0' },
              { id:'TC-PG-013', title:'NEFT Transfer - Outward Success', reg:'NEFT', steps:'1. Validate beneficiary IFSC code\n2. Build SFMS message format\n3. Submit to RBI NEFT clearing\n4. Wait for next settlement batch\n5. Receive acknowledgment\n6. Update transaction status', result:'NEFT message accepted, UTR generated (16 chars), settlement in next half-hourly batch, beneficiary bank sends credit confirmation, status updated to SETTLED', pri:'P0' },
              { id:'TC-PG-014', title:'RTGS Transfer - Large Value', reg:'RTGS', steps:'1. Validate amount >= 2 Lakhs (RTGS minimum)\n2. Check sender balance/limit\n3. Build INFINET message\n4. Submit to RBI RTGS system\n5. Receive real-time settlement\n6. Confirm with beneficiary bank', result:'RTGS settled in real-time (< 30 min), UTR generated, both banks debited/credited in RBI books, CRILC reporting triggered if amount >= 5 Crore', pri:'P0' },
              { id:'TC-PG-015', title:'Settlement File Processing - Visa TC33', reg:'Settlement', steps:'1. Receive Visa TC33 settlement file\n2. Parse all transaction records\n3. Match against internal txn database\n4. Calculate interchange fees\n5. Identify exceptions/mismatches\n6. Generate reconciliation report', result:'All records parsed, 99.9%+ match rate, interchange calculated per Visa fee schedule, exceptions flagged within 24hrs, net settlement verified', pri:'P0' },
              { id:'TC-PG-016', title:'Chargeback Representment', reg:'Chargeback', steps:'1. Receive first chargeback notification\n2. Auto-retrieve original txn data\n3. Compile evidence (3DS, delivery proof)\n4. Submit representment within deadline\n5. Track case through network\n6. Update outcome', result:'Representment submitted within 30-day window (Visa) / 45-day (MC), evidence package includes 3DS proof, representment won/lost tracked, financial adjustment applied', pri:'P1' },
              { id:'TC-PG-017', title:'Payment Void (Pre-Settlement)', reg:'Card', steps:'1. Authorization exists, not yet captured\n2. Merchant initiates void\n3. Void request sent to network\n4. Issuer releases hold on funds\n5. Verify settlement excluded\n6. Update transaction status', result:'Void processed (RC=00), hold released on cardholder account, transaction excluded from settlement file, merchant not charged interchange, status = VOIDED', pri:'P0' },
              { id:'TC-PG-018', title:'Partial Capture', reg:'Card', steps:'1. Authorization for INR 10,000\n2. Merchant captures INR 7,500 (partial)\n3. Verify partial capture accepted\n4. Remaining INR 2,500 released\n5. Settlement reflects captured amount\n6. Verify interchange on captured amount', result:'Partial capture processed, INR 7,500 settled, INR 2,500 hold released, interchange calculated on INR 7,500 only, settlement file reflects correct amount', pri:'P1' },
              { id:'TC-PG-019', title:'BharatQR Dynamic QR Payment', reg:'UPI/Card', steps:'1. Generate dynamic QR with amount\n2. Customer scans with UPI app\n3. Route through UPI/card rail\n4. Process authorization\n5. Instant notification to merchant\n6. Verify settlement routing', result:'QR contains correct amount and merchant info, payment processed via appropriate rail, merchant receives real-time notification, settlement in correct network batch', pri:'P1' },
              { id:'TC-PG-020', title:'IMPS 24x7 Transfer', reg:'IMPS', steps:'1. Initiate IMPS on bank holiday\n2. Validate MMID + mobile number\n3. Route through NPCI IMPS switch\n4. Verify instant debit/credit\n5. Check SMS delivery\n6. Verify 24x7 availability', result:'IMPS processed on holiday/weekend, instant settlement (< 10 sec), NPCI ref number generated, both parties notified, no batch dependency', pri:'P0' }
            ].map((tc, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
                <td style={{ ...tdStyle, color:C.accent, fontWeight:700, fontSize:12 }}>{tc.id}</td>
                <td style={{ ...tdStyle, fontWeight:600, color:C.header, fontSize:12 }}>{tc.title}</td>
                <td style={{ ...tdStyle, textAlign:'center', fontSize:11 }}>{badge(
                  tc.reg.includes('Card') ? C.info : tc.reg.includes('UPI') ? C.accent : tc.reg.includes('3DS') ? C.warn : tc.reg.includes('Token') ? C.danger : tc.reg.includes('Fraud') ? C.danger : tc.reg.includes('HSM') ? C.warn : tc.reg.includes('NEFT') ? C.accent : tc.reg.includes('RTGS') ? C.accent : tc.reg.includes('Settlement') ? C.success : tc.reg.includes('Chargeback') ? C.info : tc.reg.includes('IMPS') ? C.success : C.accent,
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
      <h2 style={sectionTitle}>C4 Model - Payment Gateway Platform</h2>

      <h3 style={subTitle}>Level 1: System Context</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 1: SYSTEM CONTEXT                   |
  +=========================================================================+

                          +-------------------+
                          |    Customers       |
                          |  (Retail/Corp/     |
                          |   Merchants)       |
                          +--------+----------+
                                   |
                          Card / UPI / Net Banking
                                   |
                                   v
  +----------------+    +========================+    +-------------------+
  |  Card Networks |    |                        |    | Issuer Banks      |
  |  - Visa        |<-->|  PAYMENT GATEWAY       |<-->| - SBI             |
  |  - Mastercard  |    |  (Banking QA System)   |    | - HDFC            |
  |  - RuPay       |    |                        |    | - ICICI           |
  |  - Amex        |    | Processes all payment  |    | - Axis            |
  +----------------+    | transactions across    |    | - PNB / BOB       |
                        | multiple rails          |    +-------------------+
  +----------------+    |                        |
  |  Regulators    |<-->|                        |    +-------------------+
  |  - RBI         |    |                        |    | Payment           |
  |  - NPCI        |    +========================+    | Aggregators       |
  |  - PCI SSC     |               ^                  | - Razorpay        |
  +----------------+               |                  | - CCAvenue        |
                        +----------+----------+       | - PayU            |
                        |  Acquirer Banks     |       +-------------------+
                        |  - Axis Bank        |
                        |  - HDFC Bank        |
                        |  - ICICI Bank       |
                        |  - SBI              |
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
  |  | Channel Gateway  |  | Payment Router   |  | 3DS Server          |    |
  |  | [Java/Spring]    |  | [Java/Spring]    |  | [Java/EMVCo SDK]    |    |
  |  |                  |  |                  |  |                     |    |
  |  | - POS/ATM API    |  | - BIN routing    |  | - AReq/ARes        |    |
  |  | - E-commerce API |  | - Network select |  | - CReq/CRes        |    |
  |  | - UPI gateway    |  | - Least-cost     |  | - RReq/RRes        |    |
  |  | - Mobile SDK     |  | - Failover       |  | - Risk-based auth  |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------+  +---------------------+    |
  |  | Auth Engine      |  | Fraud Engine     |  | Tokenization Svc    |    |
  |  | [Java/C++]       |  | [Python/ML]      |  | [Java/Spring]       |    |
  |  |                  |  |                  |  |                     |    |
  |  | - ISO 8583 build |  | - Velocity rules |  | - VTS integration   |    |
  |  | - HSM interface  |  | - ML scoring     |  | - MDES integration  |    |
  |  | - Response parse |  | - Device fingerpr|  | - RuPay token       |    |
  |  | - Timeout mgmt   |  | - Geo validation |  | - Token vault       |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------------------------------+    |
  |  | Settlement Eng   |  | Chargeback & Dispute Manager              |    |
  |  | [Java/Batch]     |  | [Java/Spring + React]                    |    |
  |  |                  |  |                                           |    |
  |  | - TC33/IPM parse |  | - Retrieval request handling              |    |
  |  | - Reconciliation |  | - First chargeback processing             |    |
  |  | - Fee calculation|  | - Representment workflow                  |    |
  |  | - Net settlement |  | - Pre-arbitration / Arbitration           |    |
  |  +------------------+  +------------------------------------------+    |
  |                                                                          |
  |  +------------------------------------------------------------------+  |
  |  | Infrastructure Layer                                              |  |
  |  | PostgreSQL (OLTP) | Redis (Cache/Session) | Kafka (Events)       |  |
  |  | HSM Cluster (Thales) | Elasticsearch (Logs) | S3 (Settlement)   |  |
  |  +------------------------------------------------------------------+  |
  +-------------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 3: Component Diagram</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 3: COMPONENTS                       |
  +=========================================================================+

  Authorization Engine [Container] - Component Breakdown:

  +------------------------------------------------------------------+
  |                                                                    |
  |  +------------------+     +-------------------+                    |
  |  | MessageBuilder   |---->| HSMInterface       |                    |
  |  | - ISO 8583 format|     | - PIN translation  |                    |
  |  | - Field mapping  |     | - MAC generation   |                    |
  |  | - EMV data pack  |     | - Key management   |                    |
  |  | - Bitmap calc    |     | - Cryptogram verify|                    |
  |  +------------------+     +--------+-----------+                    |
  |                                     |                               |
  |  +------------------+              v                               |
  |  | BINLookup        |     +-------------------+                    |
  |  | - Issuer identify|     | NetworkConnector   |                    |
  |  | - Card type      |     | - VisaNet adapter  |                    |
  |  | - Country code   |     | - Banknet adapter  |                    |
  |  | - Product type   |     | - RuPay adapter    |                    |
  |  +------------------+     | - NPCI adapter     |                    |
  |                            | - Timeout/Retry   |                    |
  |  +------------------+     +--------+----------+                    |
  |  | TokenResolver    |              |                               |
  |  | - Detokenize     |              v                               |
  |  | - Cryptogram gen |     +-------------------+                    |
  |  | - Domain check   |     | ResponseHandler    |                    |
  |  | - VTS/MDES call  |     | - Response parse   |                    |
  |  +------------------+     | - Code mapping     |                    |
  |                            | - Auth code store  |                    |
  |                            | - Callback trigger |                    |
  |                            +-------------------+                    |
  +------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 4: Code (Key Classes)</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 4: CODE                             |
  +=========================================================================+

  class PaymentAuthorizer:
      def __init__(self, message_builder, hsm_client, network_connector,
                   fraud_engine, token_resolver):
          self.message_builder = message_builder
          self.hsm = hsm_client
          self.network = network_connector
          self.fraud = fraud_engine
          self.token_resolver = token_resolver

      def authorize(self, payment_request: PaymentRequest) -> AuthResult:
          # Step 1: Resolve token if tokenized payment
          card_data = self.token_resolver.resolve(payment_request.token_ref)

          # Step 2: Fraud screening
          fraud_result = self.fraud.score(payment_request, card_data)
          if fraud_result.score > FRAUD_BLOCK_THRESHOLD:
              return AuthResult(status="DECLINED", reason="FRAUD_SUSPECTED")

          # Step 3: HSM operations (PIN translate, MAC generate)
          pin_block = self.hsm.translate_pin(payment_request.pin_data,
                                              source_zpk, dest_zpk)
          mac = self.hsm.generate_mac(message_data, mac_key)

          # Step 4: Build ISO 8583 message
          iso_msg = self.message_builder.build_auth_request(
              card_data, payment_request, pin_block, mac)

          # Step 5: Route to network
          network_id = self._identify_network(card_data.bin)
          response = self.network.send(network_id, iso_msg, timeout=2000)

          return AuthResult(
              status="AUTHORIZED" if response.code == "00" else "DECLINED",
              auth_code=response.auth_code,
              rrn=response.rrn,
              fraud_score=fraud_result.score
          )

  class UPIPaymentProcessor:
      def __init__(self, npci_client, psp_validator, mpin_handler):
          self.npci = npci_client
          self.psp = psp_validator
          self.mpin = mpin_handler

      def process_p2p(self, payer_vpa: str, payee_vpa: str,
                      amount: Decimal, mpin_data: bytes) -> UPIResult:
          # Validate VPAs
          if not self.psp.validate_vpa(payee_vpa):
              return UPIResult(status="FAILED", code="U30")

          # Verify MPIN
          if not self.mpin.verify(payer_vpa, mpin_data):
              return UPIResult(status="FAILED", code="U69")

          # Submit to NPCI
          npci_response = self.npci.submit_pay_request(
              payer_vpa, payee_vpa, amount)

          return UPIResult(
              status=npci_response.status,
              code=npci_response.response_code,
              npci_txn_id=npci_response.txn_id
          )

  class SettlementReconciler:
      def __init__(self, txn_repo, settlement_parser, fee_calculator):
          self.txn_repo = txn_repo
          self.parser = settlement_parser
          self.fee_calc = fee_calculator

      def reconcile(self, settlement_file: bytes, network: str) -> ReconResult:
          records = self.parser.parse(settlement_file, network)
          matched, exceptions = [], []
          for record in records:
              txn = self.txn_repo.find_by_rrn(record.rrn)
              if txn and txn.amount == record.amount:
                  matched.append((txn, record))
              else:
                  exceptions.append(record)
          return ReconResult(
              total=len(records), matched=len(matched),
              exceptions=exceptions,
              match_rate=len(matched)/len(records)*100
          )
`}</pre>
    </div>
  );

  const renderTechStack = () => (
    <div>
      <h2 style={sectionTitle}>Technology Stack</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Comprehensive technology stack for payment gateway testing in Indian banking ecosystem.
      </p>
      <div style={gridStyle}>
        {[
          { cat:'Payment Testing Tools', items:[
            { name:'JMeter + ISO 8583 Plugin', desc:'Load testing for payment gateway with ISO 8583 message simulation', use:'Performance testing of auth engine at 10K+ TPS' },
            { name:'Postman / Newman', desc:'API testing for REST payment endpoints, webhook testing, collection runner', use:'Functional testing of payment APIs, 3DS endpoints' },
            { name:'Selenium + Appium', desc:'Browser and mobile automation for e-commerce checkout and UPI app flows', use:'End-to-end payment flow automation (cart to confirmation)' },
            { name:'Gatling', desc:'Scala-based load testing with real-time reporting and protocol support', use:'Peak load simulation (festival sale, salary day scenarios)' }
          ], color:C.accent },
          { cat:'Security Testing', items:[
            { name:'Burp Suite Professional', desc:'Web vulnerability scanner for payment pages, API security testing', use:'PCI-DSS web application scanning, API security assessment' },
            { name:'OWASP ZAP', desc:'Open-source security scanner for payment form injection testing', use:'Automated vulnerability scanning of checkout pages' },
            { name:'Nessus / Qualys', desc:'Network vulnerability scanner for PCI-DSS ASV quarterly scans', use:'PCI-DSS Requirement 11.2 ASV scanning' },
            { name:'Kali Linux Toolkit', desc:'Penetration testing distribution for PCI-DSS annual pentest', use:'Network segmentation testing, CDE penetration testing' }
          ], color:C.danger },
          { cat:'Payment Simulators', items:[
            { name:'Visa VTS Sandbox', desc:'Visa Token Service sandbox for tokenization testing', use:'Token provisioning, cryptogram generation, lifecycle testing' },
            { name:'MC MDES Sandbox', desc:'Mastercard Digital Enablement Service test environment', use:'MDES token testing, DSRP cryptogram validation' },
            { name:'NPCI UAT Environment', desc:'NPCI User Acceptance Testing for UPI, IMPS, RuPay', use:'UPI flow testing, IMPS simulation, RuPay auth testing' },
            { name:'ISO 8583 Simulator', desc:'Custom ISO 8583 message generator/parser for card network simulation', use:'Acquirer/issuer simulation, response code testing, timeout scenarios' }
          ], color:C.info },
          { cat:'HSM & Cryptographic', items:[
            { name:'Thales payShield (HSM)', desc:'Hardware Security Module for PIN translation, key management, cryptographic operations', use:'PIN block encryption/translation, MAC generation, key injection' },
            { name:'Utimaco HSM Simulator', desc:'Software HSM simulator for development and testing environments', use:'HSM function testing without physical hardware' },
            { name:'OpenSSL', desc:'Cryptographic toolkit for TLS/SSL testing, certificate validation', use:'TLS 1.2+ validation, certificate chain verification, cipher suite testing' },
            { name:'SoftHSM', desc:'PKCS#11 software HSM for key management testing', use:'Development environment key management, PKCS#11 interface testing' }
          ], color:C.warn },
          { cat:'Data & Monitoring', items:[
            { name:'PostgreSQL', desc:'Primary OLTP database for transactions, tokens, settlements', use:'Transaction storage, token vault, settlement records' },
            { name:'Apache Kafka', desc:'Event streaming for real-time transaction events and fraud alerts', use:'Transaction event bus, fraud alert streaming, settlement events' },
            { name:'Redis', desc:'In-memory cache for session management, rate limiting, idempotency', use:'3DS session cache, fraud velocity counters, token cache' },
            { name:'Elasticsearch + Kibana', desc:'Log aggregation, transaction search, fraud analytics dashboards', use:'Transaction log analysis, fraud pattern visualization, PCI audit logs' }
          ], color:C.success },
          { cat:'CI/CD & DevSecOps', items:[
            { name:'Jenkins / GitLab CI', desc:'CI/CD pipeline for payment application deployment', use:'Automated build, test, security scan, deployment pipeline' },
            { name:'SonarQube', desc:'Code quality and security analysis for payment codebase', use:'Static analysis, vulnerability detection, code coverage' },
            { name:'Trivy / Snyk', desc:'Container and dependency vulnerability scanning', use:'Docker image scanning, dependency CVE detection for PCI compliance' },
            { name:'HashiCorp Vault', desc:'Secrets management for API keys, HSM credentials, certificates', use:'Secure credential storage, dynamic secrets, PKI management' }
          ], color:C.accent },
          { cat:'Reconciliation Tools', items:[
            { name:'Custom Recon Engine (Python)', desc:'In-house reconciliation engine for multi-network settlement matching', use:'Visa TC33, MC IPM, RuPay settlement file parsing and matching' },
            { name:'Apache Spark', desc:'Large-scale data processing for batch reconciliation', use:'End-of-day reconciliation across millions of transactions' },
            { name:'Grafana + Prometheus', desc:'Real-time metrics and alerting for payment SLAs', use:'Authorization latency, TPS monitoring, error rate dashboards' }
          ], color:C.info },
          { cat:'Compliance & Reporting', items:[
            { name:'PCI-DSS Assessment Tools', desc:'Compliance management platform for PCI-DSS control tracking', use:'PCI-DSS 12 requirements tracking, evidence collection, audit readiness' },
            { name:'Splunk', desc:'SIEM for payment transaction monitoring and PCI audit trail', use:'PCI-DSS Req 10 log monitoring, fraud correlation, incident detection' },
            { name:'Crystal Reports / Jasper', desc:'Enterprise reporting for settlement reports and merchant statements', use:'Daily settlement reports, monthly merchant statements, MIS reports' }
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
      <h2 style={sectionTitle}>Solution Architecture Document (SAD)</h2>

      <h3 style={subTitle}>Key Architectural Decisions</h3>
      <div style={gridStyle}>
        {[
          { title:'ADR-001: Synchronous Auth with Async Settlement', decision:'Process card/UPI authorizations synchronously with < 2s SLA, while settlement and reconciliation run as async batch processes.', rationale:'Authorization is customer-facing and latency-sensitive. Settlement is a back-office process that runs end-of-day. Decoupling allows independent scaling and fault isolation. Authorization engine can scale horizontally for peak TPS.', tradeoff:'Settlement discrepancies not detected until T+1. Requires robust reconciliation engine. Auth engine must handle timeouts gracefully with auto-reversal logic.', color:C.accent },
          { title:'ADR-002: HSM-Based PIN Processing (No Software Crypto)', decision:'All PIN block operations (encryption, translation, verification) must occur within PCI PTS certified HSM hardware. No software-based PIN cryptography.', rationale:'PCI-DSS Requirement 3 and PCI PTS mandate that PIN data never exists in clear-text outside HSM boundary. Software crypto risks PIN exposure through memory dumps, side-channel attacks. HSM provides tamper-evident hardware protection.', tradeoff:'HSM hardware cost ($50K-200K per unit). HSM cluster required for HA (min 2 units). HSM throughput becomes bottleneck at very high TPS. Vendor lock-in risk (Thales vs Utimaco).', color:C.danger },
          { title:'ADR-003: Network Tokenization Over Gateway Tokenization', decision:'Implement network-level tokenization (Visa VTS, MC MDES, RuPay Token) rather than proprietary gateway tokenization per RBI CoF mandate.', rationale:'RBI directive prohibits merchants from storing card data. Network tokens are interoperable across payment processors. Network provides token lifecycle management and cryptogram generation. Reduces PCI scope for merchants significantly.', tradeoff:'Dependency on card network token services. Token provisioning adds latency to first-time card save. Each network has different API/integration requirements. Cross-network token portability not yet standardized.', color:C.warn },
          { title:'ADR-004: Event-Driven Fraud Detection Pipeline', decision:'Use Apache Kafka event streaming for real-time fraud detection rather than synchronous in-line fraud checks.', rationale:'Decouples fraud engine from authorization path. Allows complex ML model inference without impacting authorization latency. Enables replay of events for model retraining. Supports both real-time (streaming) and batch (historical) fraud analysis.', tradeoff:'Fraud decision may arrive after authorization for very fast transactions. Requires in-line lightweight checks (velocity, BIN) plus async deep analysis. Event ordering must be maintained per card/customer.', color:C.info },
          { title:'ADR-005: Multi-Rail Payment Routing with Failover', decision:'Implement intelligent payment routing across multiple acquiring connections and payment rails with automatic failover.', rationale:'Single acquirer dependency creates SPOF. Multi-rail routing enables least-cost routing (interchange optimization). Automatic failover ensures high availability. Supports A/B testing of different acquirer performance.', tradeoff:'Complex routing logic maintenance. Need to manage multiple acquirer integrations. Settlement reconciliation becomes multi-party. Fee structures vary across acquirers requiring dynamic calculation.', color:C.success },
          { title:'ADR-006: Idempotent Payment Processing', decision:'Every payment API endpoint must be idempotent using client-supplied idempotency keys with 24-hour TTL.', rationale:'Network failures between gateway and merchant can cause duplicate transactions. Idempotency keys ensure exactly-once processing semantics. Critical for financial transactions where duplicates mean double charges. Redis-backed idempotency cache provides sub-ms lookup.', tradeoff:'Redis memory consumption for idempotency cache. TTL management complexity. Merchant must generate and manage unique idempotency keys. Edge cases around partial failures and idempotency.', color:C.accent }
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

      <h3 style={sectionTitle}>Deployment Topology</h3>
      <pre style={preStyle}>{`
  DEPLOYMENT TOPOLOGY - PAYMENT GATEWAY
  ======================================

  +------------------------------------------------------------------+
  |  Primary Data Center (DC1 - Mumbai)                               |
  |                                                                   |
  |  +------------------+  +------------------+  +----------------+  |
  |  | Load Balancer    |  | API Gateway      |  | WAF            |  |
  |  | (F5 / HAProxy)   |  | (Kong / Apigee)  |  | (Imperva)      |  |
  |  | - SSL Terminate  |  | - Rate limiting  |  | - OWASP rules  |  |
  |  | - Health checks  |  | - API versioning |  | - Bot protect  |  |
  |  +------------------+  +------------------+  +----------------+  |
  |                                                                   |
  |  +--------------------+  +--------------------+                   |
  |  | Auth Engine Cluster|  | Fraud Engine Cluster|                  |
  |  | (8 nodes, Java)    |  | (4 nodes, Python)   |                  |
  |  | - Active-Active    |  | - ML model serving  |                  |
  |  | - 10K TPS capacity |  | - Real-time scoring |                  |
  |  +--------------------+  +--------------------+                   |
  |                                                                   |
  |  +--------------------+  +--------------------+                   |
  |  | HSM Cluster        |  | Token Vault         |                  |
  |  | (Thales payShield) |  | (HSM-protected DB)  |                  |
  |  | - 2 units HA       |  | - AES-256 encrypted |                  |
  |  | - 5000 PIN ops/sec |  | - PostgreSQL + HSM  |                  |
  |  +--------------------+  +--------------------+                   |
  |                                                                   |
  |  +----------------------------------------------------------+    |
  |  | Database Layer                                            |    |
  |  | PostgreSQL Primary | Redis Cluster | Kafka Brokers (3)   |    |
  |  +----------------------------------------------------------+    |
  +------------------------------------------------------------------+

  +------------------------------------------------------------------+
  |  DR Data Center (DC2 - Chennai)                                   |
  |  - Active-Passive (< 30 min RTO, < 5 min RPO)                   |
  |  - Database replication (synchronous for txn DB)                  |
  |  - HSM key replication via secure key ceremony                    |
  |  - Automated failover via DNS GSLB                                |
  +------------------------------------------------------------------+
`}</pre>
    </div>
  );

  const renderFlowchart = () => (
    <div>
      <h2 style={sectionTitle}>Payment Authorization Flowchart</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Detailed flowcharts for card payment authorization, settlement reconciliation, and chargeback lifecycle workflows.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |          CARD PAYMENT AUTHORIZATION - DETAILED FLOWCHART                 |
  +=========================================================================+

                        +---------------------+
                        |  Payment Request     |
                        |  Received            |
                        |  (Card/UPI/NB)       |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Validate Request    |
                        |  - Merchant ID valid |
                        |  - Amount > 0        |
                        |  - Currency valid    |
                        |  - Idempotency check |
                        +----------+----------+
                                   |
                          +--------+--------+
                          | Idempotent?      |
                          +--------+--------+
                          |YES              |NO
                          v                 v
                   +----------+     +---------------------+
                   | Return   |     | Identify Payment    |
                   | Cached   |     | Method              |
                   | Response |     | - Card (BIN lookup) |
                   +----------+     | - UPI (VPA parse)   |
                                    | - Net Banking       |
                                    +----------+----------+
                                               |
                                      +--------+--------+
                                      |                 |
                                      v                 v
                               [CARD FLOW]       [UPI FLOW]
                                      |                 |
                                      v                 |
                        +---------------------+         |
                        |  Token Resolution   |         |
                        |  - Is tokenized?    |         |
                        |  - Detokenize via   |         |
                        |    VTS/MDES/RuPay   |         |
                        |  - Get real PAN     |         |
                        +----------+----------+         |
                                   |                    |
                                   v                    |
                        +---------------------+         |
                        |  Fraud Pre-Screen   |         |
                        |  - Velocity check   |         |
                        |  - BIN risk check   |         |
                        |  - Amount anomaly   |         |
                        |  - Device check     |         |
                        +----------+----------+         |
                                   |                    |
                          +--------+--------+           |
                          | Fraud Score     |           |
                          +--------+--------+           |
                     HIGH |        | LOW/MED            |
                          v        v                    |
                   +----------+  +---------------------+|
                   | DECLINE  |  | 3DS Authentication  ||
                   | (Fraud)  |  | Required?           ||
                   +----------+  +----------+----------+|
                                            |           |
                                   +--------+--------+  |
                                   |YES             |NO |
                                   v                v   |
                            +-----------+    +------+   |
                            | 3DS 2.0   |    |      |   |
                            | Flow      |    |      |   |
                            | (AReq/    |    |      |   |
                            |  CReq)    |    |      |   |
                            +-----+-----+    |      |   |
                                  |          |      |   |
                                  v          v      |   |
                        +---------------------+     |   |
                        |  HSM Operations     |     |   |
                        |  - PIN translate    |     |   |
                        |  - MAC generate     |     |   |
                        |  - EMV crypto verify|     |   |
                        +----------+----------+     |   |
                                   |                |   |
                                   v                |   |
                        +---------------------+     |   |
                        |  Build ISO 8583     |     |   |
                        |  Message (MTI 0100) |     |   |
                        |  - Map all DEs      |     |   |
                        |  - Set bitmap       |     |   |
                        +----------+----------+     |   |
                                   |                |   |
                                   v                |   |
                        +---------------------+     |   |
                        |  Route to Network   |     |   |
                        |  - Visa / MC / RuPay|     |   |
                        |  - Timeout: 30 sec  |     |   |
                        +----------+----------+     |   |
                                   |                |   |
                          +--------+--------+       |   |
                          |                 |       |   |
                          v                 v       |   |
                   +----------+      +----------+   |   |
                   | TIMEOUT  |      | RESPONSE |   |   |
                   +-----+----+      +-----+----+   |   |
                         |                 |        |   |
                         v                 v        |   |
                  +------------+  +---------------+ |   |
                  | Auto-      |  | Parse Response| |   |
                  | Reversal   |  | - RC mapping  | |   |
                  | (MTI 0420) |  | - Auth code   | |   |
                  +------------+  | - Store RRN   | |   |
                                  +-------+-------+ |   |
                                          |         |   |
                                          v         v   v
                                  +---------------------+
                                  | Return Response     |
                                  | to Merchant         |
                                  | - Status            |
                                  | - Auth code / Error |
                                  | - RRN               |
                                  | - Fraud score       |
                                  +---------------------+
`}</pre>

      <h3 style={sectionTitle}>Settlement Reconciliation Flow</h3>
      <pre style={preStyle}>{`
  SETTLEMENT RECONCILIATION FLOWCHART
  ====================================

  End of Day (EOD)
            |
            v
  +---------------------+
  | Receive Settlement   |
  | Files from Networks  |
  | - Visa TC33          |
  | - MC IPM             |
  | - RuPay Settlement   |
  | - UPI Settlement     |
  +----------+----------+
             |
             v
  +---------------------+
  | Parse Settlement     |
  | Records              |
  | - Extract txn details|
  | - Validate format    |
  | - Checksum verify    |
  +----------+----------+
             |
             v
  +---------------------+
  | Match Against        |
  | Internal Database    |
  | - RRN lookup         |
  | - Amount verify      |
  | - Date verify        |
  +----------+----------+
             |
    +--------+--------+
    |                 |
    v                 v
  +----------+  +----------+
  | MATCHED  |  | EXCEPTION|
  | (99.9%)  |  | (0.1%)   |
  +-----+----+  +-----+----+
        |              |
        v              v
  +----------+  +---------------------+
  | Calculate|  | Exception Handling   |
  | Fees     |  | - Missing txns      |
  | - MDR    |  | - Amount mismatch   |
  | - GST    |  | - Duplicate detect  |
  | - Net amt|  | - Manual review     |
  +-----+----+  +----------+----------+
        |                   |
        v                   v
  +---------------------+
  | Generate Settlement  |
  | Report               |
  | - Net payable/receive|
  | - Fee breakdown      |
  | - Exception summary  |
  | - Merchant statement |
  +---------------------+
`}</pre>

      <h3 style={sectionTitle}>Chargeback Lifecycle Flow</h3>
      <pre style={preStyle}>{`
  CHARGEBACK LIFECYCLE FLOWCHART
  ===============================

  Cardholder Dispute
            |
            v
  +---------------------+
  | Issuer Initiates     |
  | Retrieval Request    |
  | (Optional)           |
  +----------+----------+
             |
             v
  +---------------------+
  | Acquirer Responds    |
  | with Transaction     |
  | Details (30 days)    |
  +----------+----------+
             |
             v
  +---------------------+
  | First Chargeback     |
  | - Reason code assign |
  | - Amount debited from|
  |   merchant           |
  +----------+----------+
             |
    +--------+--------+
    |                 |
    v                 v
  +----------+  +--------------+
  | Merchant |  | Merchant     |
  | Accepts  |  | Disputes     |
  | Loss     |  | (Represent)  |
  +----------+  +------+-------+
                        |
                        v
               +--------------+
               | Submit       |
               | Evidence     |
               | - 3DS proof  |
               | - Delivery   |
               | - AVS match  |
               +------+-------+
                       |
              +--------+--------+
              |                 |
              v                 v
       +----------+     +-------------+
       | Won       |     | Lost        |
       | (Reversed)|     | (Pre-Arb)   |
       +----------+     +------+------+
                               |
                               v
                       +-------------+
                       | Arbitration  |
                       | (Network     |
                       |  decides)    |
                       +------+------+
                              |
                     +--------+--------+
                     |                 |
                     v                 v
              +----------+     +----------+
              | Merchant |     | Issuer   |
              | Wins     |     | Wins     |
              +----------+     +----------+
`}</pre>
    </div>
  );

  const renderSequenceDiagram = () => (
    <div>
      <h2 style={sectionTitle}>Sequence Diagram - Card Payment with 3D Secure</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        End-to-end card payment flow showing e-commerce checkout, 3D Secure 2.0 authentication, tokenization, HSM operations, and network authorization.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |     SEQUENCE DIAGRAM: CARD PAYMENT WITH 3DS 2.0 AUTHENTICATION          |
  +=========================================================================+

  Customer    Merchant    Gateway     3DS Server   Dir Server   Issuer ACS   HSM        Card Network  Issuer Bank
  |           |           |           |            |            |            |          |             |
  |  1. Checkout          |           |            |            |            |          |             |
  |  (Card/Token)         |           |            |            |            |          |             |
  |---------->|           |           |            |            |            |          |             |
  |           |           |           |            |            |            |          |             |
  |           | 2. Auth   |           |            |            |            |          |             |
  |           |    Request|           |            |            |            |          |             |
  |           |---------->|           |            |            |            |          |             |
  |           |           |           |            |            |            |          |             |
  |           |           | 3. Token  |            |            |            |          |             |
  |           |           |    Resolve|            |            |            |          |             |
  |           |           |    (if CoF|            |            |            |          |             |
  |           |           |     token)|            |            |            |          |             |
  |           |           |           |            |            |            |          |             |
  |           |           | 4. Fraud  |            |            |            |          |             |
  |           |           |    Pre-   |            |            |            |          |             |
  |           |           |    Screen |            |            |            |          |             |
  |           |           |           |            |            |            |          |             |
  |           |           | 5. Init   |            |            |            |          |             |
  |           |           |    3DS    |            |            |            |          |             |
  |           |           |---------->|            |            |            |          |             |
  |           |           |           |            |            |            |          |             |
  |           |           |           | 6. AReq    |            |            |          |             |
  |           |           |           |    (Auth   |            |            |          |             |
  |           |           |           |     Req)   |            |            |          |             |
  |           |           |           |----------->|            |            |          |             |
  |           |           |           |            |            |            |          |             |
  |           |           |           |            | 7. Route   |            |          |             |
  |           |           |           |            |    to ACS  |            |          |             |
  |           |           |           |            |----------->|            |          |             |
  |           |           |           |            |            |            |          |             |
  |           |           |           |            |            | 8. Risk    |          |             |
  |           |           |           |            |            |    Based   |          |             |
  |           |           |           |            |            |    Auth    |          |             |
  |           |           |           |            |            |    (RBA)   |          |             |
  |           |           |           |            |            |            |          |             |
  |           |           |           |            | 9. ARes    |            |          |             |
  |           |           |           |            |    (trans  |            |          |             |
  |           |           |           |            |     Status)|            |          |             |
  |           |           |           |            |<-----------|            |          |             |
  |           |           |           |            |            |            |          |             |
  |           |           |           | 10. ARes   |            |            |          |             |
  |           |           |           |<-----------|            |            |          |             |
  |           |           |           |            |            |            |          |             |
  |           |           | 11. 3DS   |            |            |            |          |             |
  |           |           |     Result|            |            |            |          |             |
  |           |           |     (CAVV,|            |            |            |          |             |
  |           |           |      ECI) |            |            |            |          |             |
  |           |           |<----------|            |            |            |          |             |
  |           |           |           |            |            |            |          |             |
  |           |           | 12. HSM   |            |            |            |          |             |
  |           |           |     PIN   |            |            |            |          |             |
  |           |           |     Xlate |            |            |            |          |             |
  |           |           |-----------|------------|------------|----------->|          |             |
  |           |           |           |            |            |            |          |             |
  |           |           | 13. PIN   |            |            |            |          |             |
  |           |           |     Block |            |            |            |          |             |
  |           |           |<----------|------------|------------|------------|          |             |
  |           |           |           |            |            |            |          |             |
  |           |           | 14. Build ISO 8583     |            |            |          |             |
  |           |           |     (MTI 0100)         |            |            |          |             |
  |           |           |     + EMV + 3DS Data   |            |            |          |             |
  |           |           |           |            |            |            |          |             |
  |           |           | 15. Send  |            |            |            |          |             |
  |           |           |     to    |            |            |            |          |             |
  |           |           |     Network            |            |            |          |             |
  |           |           |-----------|------------|------------|------------|--------->|             |
  |           |           |           |            |            |            |          |             |
  |           |           |           |            |            |            |          | 16. Forward |
  |           |           |           |            |            |            |          |     to      |
  |           |           |           |            |            |            |          |     Issuer  |
  |           |           |           |            |            |            |          |------------>|
  |           |           |           |            |            |            |          |             |
  |           |           |           |            |            |            |          |             | 17. Auth
  |           |           |           |            |            |            |          |             |     Decision
  |           |           |           |            |            |            |          |             |
  |           |           |           |            |            |            |          | 18. Auth    |
  |           |           |           |            |            |            |          |     Response|
  |           |           |           |            |            |            |          |<------------|
  |           |           |           |            |            |            |          |             |
  |           |           | 19. ISO   |            |            |            |          |             |
  |           |           |     8583  |            |            |            |          |             |
  |           |           |     Response           |            |            |          |             |
  |           |           |     (MTI 0110)         |            |            |          |             |
  |           |           |<----------|------------|------------|------------|----------|             |
  |           |           |           |            |            |            |          |             |
  |           | 20. Auth  |           |            |            |            |          |             |
  |           |     Result|           |            |            |            |          |             |
  |           |<----------|           |            |            |            |          |             |
  |           |           |           |            |            |            |          |             |
  |  21.      |           |           |            |            |            |          |             |
  |  Payment  |           |           |            |            |            |          |             |
  |  Result   |           |           |            |            |            |          |             |
  |<----------|           |           |            |            |            |          |             |
  |           |           |           |            |            |            |          |             |
`}</pre>

      <h3 style={sectionTitle}>UPI Payment Sequence</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |          SEQUENCE DIAGRAM: UPI P2P PAYMENT FLOW                          |
  +=========================================================================+

  Payer       PSP App     Payer Bank   NPCI UPI    Payee Bank   Payee
  |           |           |            Switch      |            |
  |           |           |            |           |            |
  |  1. Enter |           |            |           |            |
  |  VPA +    |           |            |           |            |
  |  Amount   |           |            |           |            |
  |---------->|           |            |           |            |
  |           |           |            |           |            |
  |           | 2. Validate            |           |            |
  |           |    Payee VPA           |           |            |
  |           |----------->            |           |            |
  |           |           |            |           |            |
  |           |           | 3. VPA     |           |            |
  |           |           |    Lookup  |           |            |
  |           |           |----------->|           |            |
  |           |           |            |           |            |
  |           |           | 4. VPA     |           |            |
  |           |           |    Valid   |           |            |
  |           |           |<-----------|           |            |
  |           |           |            |           |            |
  |  5. Enter |           |            |           |            |
  |  MPIN     |           |            |           |            |
  |---------->|           |            |           |            |
  |           |           |            |           |            |
  |           | 6. Encrypt             |           |            |
  |           |    MPIN +              |           |            |
  |           |    Submit Pay          |           |            |
  |           |----------->            |           |            |
  |           |           |            |           |            |
  |           |           | 7. Debit   |           |            |
  |           |           |    Request |           |            |
  |           |           |    to NPCI |           |            |
  |           |           |----------->|           |            |
  |           |           |            |           |            |
  |           |           |            | 8. Route  |            |
  |           |           |            |    Credit |            |
  |           |           |            |    to     |            |
  |           |           |            |    Payee  |            |
  |           |           |            |    Bank   |            |
  |           |           |            |---------->|            |
  |           |           |            |           |            |
  |           |           |            |           | 9. Credit  |
  |           |           |            |           |    Payee   |
  |           |           |            |           |    Account |
  |           |           |            |           |            |
  |           |           |            | 10. Credit|            |
  |           |           |            |     ACK   |            |
  |           |           |            |<----------|            |
  |           |           |            |           |            |
  |           |           | 11. Debit  |           |            |
  |           |           |     Confirm|           |            |
  |           |           |<-----------|           |            |
  |           |           |            |           |            |
  |           | 12. Pay   |            |           |            |
  |           |     Success            |           |            |
  |           |<-----------|           |           |            |
  |           |           |            |           |            |
  |  13.      |           |            |           |            |
  |  Success  |           |            |           |  14. Credit|
  |  Notif    |           |            |           |  Notification
  |<----------|           |            |           |----------->|
  |           |           |            |           |            |
`}</pre>

      <h3 style={sectionTitle}>Key Interaction Summary</h3>
      <div style={gridStyle}>
        {[
          { step:'Steps 1-4', title:'Payment Initiation & Routing', desc:'Customer submits payment via card/UPI. Gateway identifies payment method via BIN lookup or VPA parsing, routes to appropriate processing pipeline (card network or UPI switch).', color:C.accent },
          { step:'Steps 5-11', title:'Authentication (3DS/MPIN)', desc:'Card payments undergo 3DS 2.0 authentication via ACS. Frictionless flow approved silently; challenge flow presents OTP/biometric. UPI payments authenticated via encrypted MPIN.', color:C.info },
          { step:'Steps 12-13', title:'HSM Cryptographic Operations', desc:'HSM translates PIN block from terminal format to network format. Generates MAC for message integrity. Verifies EMV cryptogram for chip transactions. No clear-text PIN exposure.', color:C.warn },
          { step:'Steps 14-18', title:'Network Authorization', desc:'ISO 8583 message built with all data elements, routed to appropriate card network (Visa/MC/RuPay). Network forwards to issuer bank for authorization decision (balance, fraud, limits).', color:C.danger },
          { step:'Steps 19-21', title:'Response & Notification', desc:'Issuer response received with approval/decline code. Gateway parses response, updates transaction record, sends webhook to merchant, and notifies customer via receipt/SMS.', color:C.success },
          { step:'Settlement', title:'Post-Auth Settlement', desc:'Authorized transactions batched for settlement. Network sends settlement files (TC33/IPM). Reconciliation engine matches transactions, calculates fees (interchange, MDR, GST), and generates settlement reports.', color:C.accent }
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
            Card Payments | UPI/IMPS/NEFT/RTGS | 3D Secure 2.0 | Tokenization | Fraud Detection | HSM - Banking QA Testing Dashboard
          </p>
          <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
            {badge(C.accent, 'Card Payments')}{badge(C.info, 'UPI/NPCI')}{badge(C.warn, '3DS 2.0')}{badge(C.danger, 'Tokenization')}{badge(C.success, 'Fraud Detection')}{badge(C.warn, 'HSM/PCI PTS')}{badge(C.accent, 'Settlement')}{badge(C.info, 'Chargeback')}
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
          Payment Gateway Testing Architecture | Banking QA Dashboard | PCI-DSS | UPI | NPCI | Visa | Mastercard | RuPay | HSM
        </div>
      </div>
    </div>
  );
}

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

export default function ComplianceRegulatoryArch() {
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
      <h2 style={sectionTitle}>Compliance & Regulatory Platform Architecture</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Enterprise-grade compliance platform for Indian banking ecosystem covering KYC/AML, PCI-DSS, GDPR, SOX, RBI Norms, and BASEL III requirements. Designed for real-time regulatory compliance monitoring, automated reporting, and audit trail management.
      </p>

      <pre style={preStyle}>{`
+============================================================================+
|                COMPLIANCE & REGULATORY TESTING PLATFORM                     |
|                    Banking QA Architecture Overview                         |
+============================================================================+

  DATA SOURCES                    COMPLIANCE ENGINE                 OUTPUT
  ============                    =================                 ======

  +----------------+         +----------------------------------+
  | Core Banking   |-------->|                                  |    +---------------------+
  | System (CBS)   |         |    COMPLIANCE ENGINE              |    | Compliance          |
  +----------------+         |    ==================             |--->| Dashboard           |
                             |                                  |    +---------------------+
  +----------------+         |  +----------------------------+  |
  | Card System    |-------->|  | KYC/eKYC Engine            |  |    +---------------------+
  | (Visa/MC/RuPay)|         |  | - Aadhaar OTP/Biometric    |  |--->| Regulatory          |
  +----------------+         |  | - Video KYC (V-CIP)        |  |    | Reports             |
                             |  | - CKYC Upload/Fetch        |  |    +---------------------+
  +----------------+         |  | - Document Verification    |  |
  | Loan Mgmt      |-------->|  +----------------------------+  |    +---------------------+
  | System (LMS)   |         |                                  |--->| Alert               |
  +----------------+         |  +----------------------------+  |    | Management          |
                             |  | AML Transaction Monitor    |  |    +---------------------+
  +----------------+         |  | - Rule-Based Detection     |  |
  | Treasury &     |-------->|  | - ML Anomaly Detection     |  |    +---------------------+
  | Trade Finance  |         |  | - Network Analysis (Neo4j) |  |--->| Audit               |
  +----------------+         |  | - STR/CTR Auto-Filing      |  |    | Logs                |
                             |  +----------------------------+  |    +---------------------+
  +----------------+         |                                  |
  | CRM / Customer |-------->|  +----------------------------+  |
  | Data Hub       |         |  | Sanctions Screening        |  |
  +----------------+         |  | - OFAC SDN List            |  |
                             |  | - UN Security Council      |  |
                             |  | - EU Sanctions             |  |
                             |  | - India MHA List           |  |
                             |  | - Fuzzy Name Matching      |  |
                             |  +----------------------------+  |
                             |                                  |
                             |  +----------------------------+  |
                             |  | PCI-DSS Compliance Scanner |  |
                             |  | - 12 Requirements          |  |
                             |  | - 300+ Controls            |  |
                             |  | - Quarterly ASV Scans      |  |
                             |  | - Penetration Testing      |  |
                             |  +----------------------------+  |
                             |                                  |
                             |  +----------------------------+  |
                             |  | GDPR Data Protection       |  |
                             |  | - Data Classification      |  |
                             |  | - Consent Management       |  |
                             |  | - Right to Erasure         |  |
                             |  | - Breach Notification      |  |
                             |  +----------------------------+  |
                             |                                  |
                             |  +----------------------------+  |
                             |  | SOX Audit Trail            |  |
                             |  | - Segregation of Duties    |  |
                             |  | - Change Management        |  |
                             |  | - Access Recertification   |  |
                             |  +----------------------------+  |
                             |                                  |
                             |  +----------------------------+  |
                             |  | RBI Regulatory Reporting   |  |
                             |  | - CRILC Reporting          |  |
                             |  | - KYC Master Direction     |  |
                             |  | - Cybersecurity Framework  |  |
                             |  | - Digital Lending Norms    |  |
                             |  +----------------------------+  |
                             |                                  |
                             |  +----------------------------+  |
                             |  | BASEL III Capital Adequacy  |  |
                             |  | - CET1 / Tier 1 / Total   |  |
                             |  | - Liquidity Coverage (LCR) |  |
                             |  | - Leverage Ratio           |  |
                             |  | - Risk-Weighted Assets     |  |
                             |  +----------------------------+  |
                             +----------------------------------+

  EXTERNAL INTEGRATIONS
  =====================

  +----------------+    +----------------+    +------------------+    +----------------+
  | UIDAI          |    | CKYC Registry  |    | Credit Bureaus   |    | SWIFT           |
  | (Aadhaar eKYC) |    | (CERSAI)       |    | CIBIL / Experian |    | Sanctions Feed  |
  +----------------+    +----------------+    | Equifax / CRIF   |    +----------------+
                                              +------------------+
  +----------------+    +----------------+    +------------------+    +----------------+
  | PEP Lists      |    | FIU-IND        |    | XBRL Taxonomy    |    | RBI CRILC      |
  | (Global DB)    |    | (STR/CTR)      |    | (SEBI/MCA)       |    | Portal          |
  +----------------+    +----------------+    +------------------+    +----------------+
`}</pre>

      <h3 style={sectionTitle}>Module Overview</h3>
      <div style={gridStyle}>
        {[
          { title:'KYC/eKYC Engine', desc:'Customer identity verification via Aadhaar OTP, biometric, video KYC (V-CIP), document OCR, and CKYC registry integration. Supports re-KYC workflows for periodic compliance.', reg:'RBI KYC Master Direction 2016', color:C.accent },
          { title:'AML Transaction Monitoring', desc:'Real-time and batch transaction monitoring using rule-based and ML-based detection. Covers structuring, layering, rapid fund movement, and dormant account activation.', reg:'PMLA 2002, RBI AML/CFT Guidelines', color:C.warn },
          { title:'Sanctions Screening', desc:'Real-time screening against OFAC SDN, UN, EU, India MHA lists using fuzzy matching (Jaro-Winkler + Levenshtein). Sub-200ms SLA for transaction-time screening.', reg:'OFAC, UN Resolutions, EU Regulations', color:C.danger },
          { title:'PCI-DSS Scanner', desc:'Automated compliance validation across all 12 PCI-DSS requirements. Network segmentation testing, encryption validation, access control verification. Quarterly ASV scans.', reg:'PCI-DSS v4.0', color:C.info },
          { title:'GDPR Data Protection', desc:'Personal data inventory, consent management, data subject request automation (erasure, portability, rectification). 72-hour breach notification workflow.', reg:'EU GDPR, India DPDP Act 2023', color:C.success },
          { title:'SOX Audit Trail', desc:'IT General Controls (ITGC) and Application Controls validation. Segregation of duties matrix, access recertification, change management evidence collection.', reg:'SOX Section 302/404', color:C.warn },
          { title:'RBI Regulatory Reporting', desc:'CRILC large exposure reporting, statutory return filing, cybersecurity incident reporting, outsourcing compliance, digital lending guidelines adherence.', reg:'RBI Master Directions', color:C.accent },
          { title:'BASEL III Capital Adequacy', desc:'CET1, Tier 1, Total Capital ratio calculation. Liquidity Coverage Ratio (LCR), Net Stable Funding Ratio (NSFR), Leverage Ratio computation and reporting.', reg:'BASEL III Framework, RBI Implementation', color:C.info }
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
        Compliance Testing Framework for Indian Banking - Business Requirements covering KYC/AML/PCI-DSS/GDPR/SOX/RBI/BASEL regulatory domains.
      </p>

      <h3 style={subTitle}>Objectives</h3>
      <div style={cardStyle}>
        <ul style={{ color:C.text, lineHeight:2, paddingLeft:20 }}>
          <li>Ensure <strong style={{ color:C.accent }}>100% regulatory compliance</strong> across KYC, AML, PCI-DSS, GDPR, SOX, RBI Norms, and BASEL III requirements</li>
          <li>Automate compliance testing and reporting to reduce manual effort by 70%</li>
          <li>Reduce audit preparation time by <strong style={{ color:C.accent }}>60%</strong> through automated evidence collection</li>
          <li>Detect compliance violations <strong style={{ color:C.danger }}>before regulatory examination</strong> through continuous monitoring</li>
          <li>Achieve real-time sanctions screening with SLA of &lt;200ms per transaction</li>
          <li>Generate regulatory-ready reports (CRILC, XBRL, STR/CTR) with zero manual intervention</li>
        </ul>
      </div>

      <h3 style={sectionTitle}>Scope by Regulation</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Regulation</th>
            <th style={thStyle}>Scope Areas</th>
            <th style={thStyle}>Key Controls</th>
            <th style={thStyle}>Frequency</th>
          </tr>
        </thead>
        <tbody>
          {[
            { reg:'KYC (RBI Master Direction)', scope:'Customer onboarding, Re-KYC, Video KYC (V-CIP), CKYC upload/fetch, Aadhaar eKYC, OVD verification, beneficial ownership', controls:'Identity verification, address proof, risk categorization, periodic updation', freq:'Onboarding + Periodic (2/8/10 yrs)' },
            { reg:'AML (PMLA 2002)', scope:'Transaction monitoring, STR/CTR filing, Sanctions screening, PEP checks, Wire transfer rules, Trade-based ML, Correspondent banking', controls:'Rule engine (50+ rules), ML models, network analysis, threshold monitoring, suspicious pattern detection', freq:'Real-time + Daily batch' },
            { reg:'PCI-DSS v4.0', scope:'12 Requirements with 300+ controls, Cardholder data environment (CDE), Network segmentation, Encryption (at rest + in transit)', controls:'Firewall config, access control, encryption standards, vulnerability management, penetration testing, log monitoring', freq:'Quarterly ASV + Annual audit' },
            { reg:'GDPR / DPDP Act', scope:'Right to erasure, Consent management, Data portability, Breach notification (72hrs), Data minimization, Privacy by design', controls:'Data inventory, consent register, DSR workflow, breach detection, DPO appointment, DPIA', freq:'Continuous + On-demand' },
            { reg:'SOX (Section 302/404)', scope:'IT General Controls (ITGC), Application controls, Segregation of duties, Change management, Access recertification', controls:'User access reviews, SoD matrix, change approval workflow, evidence retention, audit trail integrity', freq:'Annual + Quarterly reviews' },
            { reg:'RBI Norms', scope:'KYC Master Direction, Cybersecurity framework, Outsourcing guidelines, Digital lending norms, CRILC reporting, Fraud reporting (FMR)', controls:'Customer due diligence, cyber incident reporting, vendor risk assessment, lending platform compliance', freq:'As mandated per direction' },
            { reg:'BASEL III', scope:'Capital adequacy (CET1/Tier1/Total), Liquidity Coverage Ratio (LCR), Net Stable Funding Ratio (NSFR), Leverage Ratio, Risk-Weighted Assets (RWA)', controls:'Capital computation, stress testing, liquidity buffer, counterparty credit risk, market risk VaR', freq:'Quarterly + Annual ICAAP' }
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
          { title:'Sanctions Screening SLA', value:'< 200ms', desc:'Real-time screening per transaction against all sanctions lists (OFAC/UN/EU/MHA). Must not block payment processing beyond SLA.', color:C.danger },
          { title:'CTR Filing Timeline', value:'15 days', desc:'Cash Transaction Reports for transactions exceeding INR 10 Lakhs must be filed with FIU-IND within 15 days of the month end.', color:C.warn },
          { title:'GDPR Breach Notification', value:'72 hours', desc:'Data breach notification to supervisory authority within 72 hours of becoming aware. Automated detection and notification workflow required.', color:C.info },
          { title:'STR Filing Timeline', value:'7 days', desc:'Suspicious Transaction Reports must be filed with FIU-IND within 7 days of determination of suspicion. Automated workflow with evidence packaging.', color:C.danger },
          { title:'System Availability', value:'99.99%', desc:'Compliance platform must maintain 99.99% uptime. Sanctions screening and AML monitoring are mission-critical with zero tolerance for downtime.', color:C.success },
          { title:'Data Retention', value:'5-8 years', desc:'KYC records: 5 years after closure. AML records: 5 years. SOX: 7 years. Audit trails: 8 years. Automated archival and purge policies required.', color:C.accent }
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
        High-level compliance architecture showing transaction flow through rule engine, risk scoring, alert generation, case management, and regulatory filing subsystems.
      </p>

      <pre style={preStyle}>{`
+=============================================================================+
|              HIGH-LEVEL COMPLIANCE ARCHITECTURE                              |
+=============================================================================+

   TRANSACTION FLOW
   ================

   Incoming Transaction (CBS/Cards/NEFT/RTGS/UPI/IMPS)
            |
            v
   +------------------+     +--------------------+     +-------------------+
   | Data Enrichment  |---->| Rule Engine         |---->| Risk Scoring      |
   | - Customer data  |     | (Drools / Custom)   |     | - Rule score      |
   | - Account history|     |                     |     | - ML score        |
   | - Geo data       |     | 50+ AML Rules       |     | - Composite risk  |
   | - Device info    |     | 300+ PCI Controls   |     | - Risk category   |
   +------------------+     | KYC Validations     |     | (Low/Med/High)    |
                            +--------------------+     +-------------------+
                                                               |
                            +--------------------+             |
                            | Alert Generation   |<------------+
                            | - Priority assign  |
                            | - Auto-close low   |
                            | - Route to analyst |
                            +--------------------+
                                     |
                            +--------------------+     +-------------------+
                            | Case Management    |---->| Regulatory Filing |
                            | - Investigation    |     | - STR to FIU-IND  |
                            | - Evidence attach  |     | - CTR to FIU-IND  |
                            | - Workflow engine  |     | - CRILC to RBI    |
                            | - SLA tracking     |     | - XBRL to MCA     |
                            +--------------------+     | - FATCA to CBDT   |
                                                       +-------------------+


   KYC WORKFLOW MODULE
   ===================

   +------------------------------------------------------------------+
   |                     KYC / eKYC Engine                             |
   |                                                                   |
   |  +-------------+  +---------------+  +----------------+          |
   |  | Aadhaar OTP |  | Video KYC     |  | Document       |          |
   |  | eKYC        |  | (V-CIP)       |  | Verification   |          |
   |  | - OTP gen   |  | - Live video  |  | - PAN (NSDL)   |          |
   |  | - UIDAI API |  | - Liveness    |  | - Passport     |          |
   |  | - XML parse |  | - Geo-tag     |  | - Voter ID     |          |
   |  | - Photo     |  | - Recording   |  | - Driving Lic  |          |
   |  +-------------+  | - Audit trail |  | - OCR Extract  |          |
   |                    +---------------+  +----------------+          |
   |                                                                   |
   |  +-------------+  +---------------+  +----------------+          |
   |  | Biometric   |  | CKYC Registry |  | Risk Category  |          |
   |  | Verification|  | (CERSAI)      |  | Assignment     |          |
   |  | - Fingerprnt|  | - Upload KYC  |  | - Low Risk     |          |
   |  | - Iris scan |  | - Fetch KYC   |  | - Medium Risk  |          |
   |  | - Face match|  | - KYC ID gen  |  | - High Risk    |          |
   |  +-------------+  +---------------+  +----------------+          |
   +------------------------------------------------------------------+


   AML PIPELINE
   ============

   +------------------------------------------------------------------+
   |                AML Transaction Monitoring Pipeline                 |
   |                                                                   |
   |  Rule-Based Detection          ML-Based Detection                 |
   |  +---------------------+      +------------------------+         |
   |  | Structuring         |      | Isolation Forest       |         |
   |  | Rapid Movement      |      | Autoencoder Anomaly    |         |
   |  | Round Amounts       |      | Graph Neural Network   |         |
   |  | Dormant Activation  |      | Behavioral Clustering  |         |
   |  | Threshold Breach    |      | Time-Series Anomaly    |         |
   |  | Smurfing            |      | Supervised (XGBoost)   |         |
   |  +---------------------+      +------------------------+         |
   |                                                                   |
   |  Network Analysis (Neo4j)     Sanctions Screening                |
   |  +---------------------+      +------------------------+         |
   |  | Fund flow graphs    |      | OFAC SDN List          |         |
   |  | Circular patterns   |      | UN Consolidated List   |         |
   |  | Shell company links |      | EU Sanctions           |         |
   |  | Beneficiary chains  |      | India MHA List         |         |
   |  | Community detection |      | PEP Database           |         |
   |  +---------------------+      +------------------------+         |
   +------------------------------------------------------------------+


   PCI-DSS SCOPE
   =============

   +------------------------------------------------------------------+
   |  Cardholder Data Environment (CDE) Boundary                       |
   |                                                                   |
   |  +--------------------+    +------------------+                   |
   |  | Network Segment A  |    | Network Segment B|                   |
   |  | (CDE - In Scope)   |    | (Non-CDE)        |                   |
   |  |                    |    |                   |                   |
   |  | Card Processing    |<===| Firewall /        |                   |
   |  | HSM / Key Mgmt     |    | Segmentation     |                   |
   |  | PAN Storage (Enc)  |    | Controls         |                   |
   |  | Token Vault        |    |                   |                   |
   |  +--------------------+    +------------------+                   |
   +------------------------------------------------------------------+


   GDPR DATA MAP
   =============

   +------------------------------------------------------------------+
   |  Personal Data Inventory & Processing Activities Register          |
   |                                                                   |
   |  +------------------+  +------------------+  +----------------+  |
   |  | Data Categories  |  | Processing       |  | Consent Store  |  |
   |  | - Identity       |  | Activities       |  | - Purpose      |  |
   |  | - Financial      |  | - Onboarding     |  | - Lawful basis |  |
   |  | - Transactional  |  | - Marketing      |  | - Timestamp    |  |
   |  | - Behavioral     |  | - Analytics      |  | - Withdrawal   |  |
   |  | - Biometric      |  | - Credit scoring |  | - Audit trail  |  |
   |  +------------------+  +------------------+  +----------------+  |
   +------------------------------------------------------------------+


   INTEGRATION POINTS
   ==================

   +------------+    +------------+    +-----------+    +-----------+
   | RBI CRILC  |    | XBRL       |    | SWIFT     |    | FATCA/CRS |
   | Reporting  |    | Filing     |    | Sanctions |    | Reporting |
   | (Large     |    | (MCA/SEBI) |    | Feed      |    | (CBDT)    |
   | Exposures) |    |            |    | (Daily)   |    | (Annual)  |
   +------------+    +------------+    +-----------+    +-----------+
`}</pre>
    </div>
  );

  const renderLLD = () => (
    <div>
      <h2 style={sectionTitle}>Low-Level Design (LLD)</h2>

      <h3 style={subTitle}>KYC API Contracts</h3>
      <pre style={preStyle}>{`
  KYC API ENDPOINTS
  =================

  POST /api/v1/kyc/initiate
  -------------------------
  Request:
  {
    "customer_id": "CUST-2024-001",
    "kyc_type": "FULL_KYC | MIN_KYC | REKYC | VIDEO_KYC",
    "channel": "BRANCH | DIGITAL | V_CIP",
    "documents": [
      {
        "doc_type": "AADHAAR | PAN | PASSPORT | VOTER_ID | DRIVING_LICENSE",
        "doc_number": "XXXX-XXXX-1234",
        "doc_image_front": "base64_encoded",
        "doc_image_back": "base64_encoded"
      }
    ],
    "risk_category": "LOW | MEDIUM | HIGH"
  }
  Response: 201 Created
  {
    "kyc_id": "KYC-20240115-00042",
    "status": "INITIATED",
    "verification_steps": ["AADHAAR_OTP", "PAN_VERIFY", "ADDRESS_PROOF"],
    "estimated_completion": "2024-01-15T14:30:00Z"
  }

  POST /api/v1/kyc/verify-aadhaar
  --------------------------------
  Request:
  {
    "kyc_id": "KYC-20240115-00042",
    "aadhaar_number": "XXXX-XXXX-1234",
    "otp": "123456",
    "consent": true,
    "purpose": "ACCOUNT_OPENING"
  }
  Response: 200 OK
  {
    "verification_status": "SUCCESS | FAILED | OTP_EXPIRED",
    "aadhaar_details": {
      "name": "Rajesh Kumar",
      "dob": "1990-05-15",
      "gender": "M",
      "address": { ... },
      "photo": "base64_encoded"
    },
    "uidai_txn_id": "TXN-UIDAI-20240115-9876"
  }

  POST /api/v1/kyc/video-kyc
  ----------------------------
  Request:
  {
    "kyc_id": "KYC-20240115-00042",
    "session_id": "VCIP-SESSION-001",
    "video_recording_url": "s3://kyc-videos/session-001.mp4",
    "liveness_score": 0.97,
    "geo_coordinates": { "lat": 28.6139, "lng": 77.2090 },
    "agent_id": "AGENT-KYC-042",
    "customer_consent_timestamp": "2024-01-15T10:30:00Z"
  }
  Response: 200 OK
  {
    "vcip_status": "COMPLETED | FAILED | RETRY_REQUIRED",
    "liveness_verified": true,
    "face_match_score": 0.94,
    "audit_trail_id": "AUDIT-VCIP-001"
  }

  GET /api/v1/kyc/status/{kyc_id}
  --------------------------------
  Response: 200 OK
  {
    "kyc_id": "KYC-20240115-00042",
    "customer_id": "CUST-2024-001",
    "kyc_type": "FULL_KYC",
    "status": "COMPLETED | PENDING | FAILED | EXPIRED",
    "risk_category": "LOW",
    "verification_results": {
      "aadhaar": "VERIFIED",
      "pan": "VERIFIED",
      "address": "VERIFIED",
      "ckyc_uploaded": true,
      "ckyc_id": "CKYC-1234567890"
    },
    "next_rekyc_date": "2034-01-15",
    "created_at": "2024-01-15T10:00:00Z",
    "completed_at": "2024-01-15T11:30:00Z"
  }
`}</pre>

      <h3 style={sectionTitle}>AML Rule Configurations</h3>
      <pre style={preStyle}>{`
  AML DETECTION RULES
  ====================

  RULE: STRUCTURING DETECTION
  ---------------------------
  Description: Multiple cash deposits/withdrawals just below CTR threshold
  Trigger Conditions:
    - 3+ cash transactions within 24 hours
    - Each transaction < INR 10,00,000 (10 Lakhs)
    - Cumulative total > INR 10,00,000
    - Same account or linked accounts
  Risk Score: HIGH (85-100)
  Action: Generate STR alert, freeze further cash transactions pending review

  RULE: RAPID FUND MOVEMENT
  --------------------------
  Description: Funds credited and immediately transferred out
  Trigger Conditions:
    - Incoming credit (NEFT/RTGS/IMPS) > INR 5,00,000
    - Outbound transfer within 2 hours of credit
    - Outbound amount >= 80% of credited amount
    - Different beneficiary from source
  Risk Score: HIGH (75-95)
  Action: Alert generation, transaction hold for review

  RULE: ROUND AMOUNT TRANSACTIONS
  --------------------------------
  Description: Unusual pattern of round-amount transactions
  Trigger Conditions:
    - 5+ transactions in 7 days with round amounts (multiples of 50,000)
    - No business justification on record
    - Account type: Individual (non-business)
  Risk Score: MEDIUM (50-74)
  Action: Generate alert for analyst review

  RULE: DORMANT ACCOUNT ACTIVATION
  ---------------------------------
  Description: Sudden high-value activity in previously dormant account
  Trigger Conditions:
    - Account inactive for 6+ months
    - Transaction value > INR 2,00,000 within first week of reactivation
    - Multiple outbound transfers following activation
  Risk Score: HIGH (80-95)
  Action: Mandatory enhanced due diligence, analyst review


  SANCTIONS SCREENING ALGORITHM
  =============================

  Input: Customer Name / Beneficiary Name / Remitter Name
  Lists: OFAC SDN + UN + EU + India MHA + Internal Watchlist

  Algorithm:
    1. Normalize: lowercase, remove diacritics, standardize transliteration
    2. Tokenize: split into name components
    3. Fuzzy Match (parallel):
       a. Jaro-Winkler Similarity (threshold >= 0.85)
       b. Levenshtein Distance (threshold <= 2 edits)
       c. Phonetic Match (Soundex + Metaphone)
    4. Composite Score = 0.4*JW + 0.3*Lev + 0.2*Phonetic + 0.1*ExactToken
    5. If CompositeScore >= 0.80 --> TRUE HIT (auto-block)
    6. If CompositeScore >= 0.60 --> POTENTIAL MATCH (manual review)
    7. If CompositeScore <  0.60 --> CLEAR (auto-pass)

  SLA: < 200ms per name check (P99 latency)
`}</pre>

      <h3 style={sectionTitle}>PCI-DSS Control Mapping</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Req #</th>
            <th style={thStyle}>Requirement</th>
            <th style={thStyle}>Sub-Controls</th>
            <th style={thStyle}>Test Procedure</th>
          </tr>
        </thead>
        <tbody>
          {[
            { req:'1', title:'Install and maintain network security controls', sub:'1.1-1.5 (Firewall, DMZ, Segmentation)', test:'Network diagram review, firewall rule analysis, segmentation penetration test' },
            { req:'2', title:'Apply secure configurations to all system components', sub:'2.1-2.3 (Default passwords, hardening)', test:'Configuration baseline scan, default credential check, CIS benchmark validation' },
            { req:'3', title:'Protect stored account data', sub:'3.1-3.7 (Encryption, masking, key mgmt)', test:'Data discovery scan, encryption validation, key rotation verification' },
            { req:'4', title:'Protect cardholder data with strong cryptography during transmission', sub:'4.1-4.2 (TLS, certificate management)', test:'SSL/TLS scan, certificate validation, protocol version check (no SSL 3.0/TLS 1.0)' },
            { req:'5', title:'Protect all systems and networks from malicious software', sub:'5.1-5.4 (Anti-malware, integrity monitoring)', test:'AV deployment verification, signature update check, FIM validation' },
            { req:'6', title:'Develop and maintain secure systems and software', sub:'6.1-6.5 (Patching, secure SDLC, WAF)', test:'Patch compliance scan, SAST/DAST results review, WAF rule validation' },
            { req:'7', title:'Restrict access to system components by business need to know', sub:'7.1-7.3 (RBAC, least privilege)', test:'Access matrix review, privilege escalation test, orphan account detection' },
            { req:'8', title:'Identify users and authenticate access', sub:'8.1-8.6 (MFA, password policy, service accounts)', test:'MFA verification, password policy compliance, service account inventory' },
            { req:'9', title:'Restrict physical access to cardholder data', sub:'9.1-9.9 (Facility access, media destruction)', test:'Physical access log review, visitor log audit, media destruction certificate' },
            { req:'10', title:'Log and monitor all access to system components', sub:'10.1-10.7 (Audit logging, SIEM, NTP)', test:'Log completeness check, SIEM alert validation, time sync verification' },
            { req:'11', title:'Test security of systems and networks regularly', sub:'11.1-11.6 (ASV scan, pentest, IDS/IPS)', test:'Quarterly ASV scan results, annual pentest report, IDS signature update' },
            { req:'12', title:'Support information security with organizational policies', sub:'12.1-12.11 (Security policy, incident response)', test:'Policy review, incident response drill, security awareness training records' }
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:700, textAlign:'center' }}>{r.req}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.title}</td>
              <td style={{ ...tdStyle, fontSize:12 }}>{r.sub}</td>
              <td style={{ ...tdStyle, fontSize:12 }}>{r.test}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={sectionTitle}>Database Schemas</h3>
      <pre style={preStyle}>{`
  DATABASE SCHEMA DESIGN
  ======================

  TABLE: kyc_records
  -------------------
  kyc_id            VARCHAR(30)  PRIMARY KEY
  customer_id       VARCHAR(20)  NOT NULL  REFERENCES customers(customer_id)
  kyc_type          ENUM('FULL_KYC','MIN_KYC','REKYC','VIDEO_KYC')
  status            ENUM('INITIATED','IN_PROGRESS','COMPLETED','FAILED','EXPIRED')
  risk_category     ENUM('LOW','MEDIUM','HIGH')
  aadhaar_verified  BOOLEAN      DEFAULT FALSE
  pan_verified      BOOLEAN      DEFAULT FALSE
  ckyc_id           VARCHAR(20)
  video_kyc_url     TEXT
  liveness_score    DECIMAL(4,2)
  agent_id          VARCHAR(20)
  documents_json    JSONB
  created_at        TIMESTAMP    DEFAULT NOW()
  completed_at      TIMESTAMP
  next_rekyc_date   DATE
  INDEX idx_kyc_customer    ON kyc_records(customer_id)
  INDEX idx_kyc_status      ON kyc_records(status)
  INDEX idx_kyc_rekyc_date  ON kyc_records(next_rekyc_date)

  TABLE: aml_alerts
  ------------------
  alert_id          VARCHAR(30)  PRIMARY KEY
  rule_id           VARCHAR(20)  NOT NULL
  customer_id       VARCHAR(20)  NOT NULL
  account_id        VARCHAR(20)  NOT NULL
  alert_type        ENUM('STRUCTURING','RAPID_MOVEMENT','ROUND_AMOUNT','DORMANT','SANCTIONS','PEP','THRESHOLD')
  risk_score        INTEGER      CHECK(risk_score BETWEEN 0 AND 100)
  status            ENUM('OPEN','ASSIGNED','INVESTIGATING','ESCALATED','CLOSED_STR','CLOSED_FALSE_POSITIVE')
  assigned_to       VARCHAR(20)
  transactions_json JSONB
  evidence_json     JSONB
  str_filed         BOOLEAN      DEFAULT FALSE
  str_reference     VARCHAR(30)
  created_at        TIMESTAMP    DEFAULT NOW()
  updated_at        TIMESTAMP
  closed_at         TIMESTAMP
  INDEX idx_aml_customer   ON aml_alerts(customer_id)
  INDEX idx_aml_status     ON aml_alerts(status)
  INDEX idx_aml_risk       ON aml_alerts(risk_score)
  INDEX idx_aml_created    ON aml_alerts(created_at)

  TABLE: sanctions_hits
  ----------------------
  hit_id            VARCHAR(30)  PRIMARY KEY
  screening_type    ENUM('TRANSACTION','CUSTOMER','BENEFICIARY','REMITTER')
  entity_name       VARCHAR(200) NOT NULL
  matched_list      ENUM('OFAC_SDN','UN','EU','INDIA_MHA','PEP','INTERNAL')
  matched_entry     VARCHAR(200) NOT NULL
  match_score       DECIMAL(4,3) NOT NULL
  match_algorithm   VARCHAR(50)
  disposition       ENUM('TRUE_HIT','FALSE_POSITIVE','PENDING_REVIEW')
  transaction_id    VARCHAR(30)
  customer_id       VARCHAR(20)
  reviewed_by       VARCHAR(20)
  reviewed_at       TIMESTAMP
  created_at        TIMESTAMP    DEFAULT NOW()
  INDEX idx_sanctions_entity    ON sanctions_hits(entity_name)
  INDEX idx_sanctions_list      ON sanctions_hits(matched_list)
  INDEX idx_sanctions_disp      ON sanctions_hits(disposition)

  TABLE: audit_trail
  -------------------
  audit_id          BIGSERIAL    PRIMARY KEY
  entity_type       VARCHAR(50)  NOT NULL
  entity_id         VARCHAR(50)  NOT NULL
  action            ENUM('CREATE','READ','UPDATE','DELETE','APPROVE','REJECT','EXPORT')
  performed_by      VARCHAR(50)  NOT NULL
  ip_address        INET
  user_agent        TEXT
  old_value_json    JSONB
  new_value_json    JSONB
  correlation_id    UUID
  timestamp         TIMESTAMP    DEFAULT NOW()
  INDEX idx_audit_entity     ON audit_trail(entity_type, entity_id)
  INDEX idx_audit_user       ON audit_trail(performed_by)
  INDEX idx_audit_timestamp  ON audit_trail(timestamp)

  TABLE: consent_register
  ------------------------
  consent_id        VARCHAR(30)  PRIMARY KEY
  customer_id       VARCHAR(20)  NOT NULL
  purpose           VARCHAR(100) NOT NULL
  lawful_basis      ENUM('CONSENT','CONTRACT','LEGAL_OBLIGATION','VITAL_INTEREST','PUBLIC_TASK','LEGITIMATE_INTEREST')
  consent_given     BOOLEAN      DEFAULT FALSE
  consent_timestamp TIMESTAMP
  withdrawal_timestamp TIMESTAMP
  data_categories   TEXT[]
  retention_period  INTERVAL
  third_party_sharing BOOLEAN    DEFAULT FALSE
  created_at        TIMESTAMP    DEFAULT NOW()
  INDEX idx_consent_customer ON consent_register(customer_id)
  INDEX idx_consent_purpose  ON consent_register(purpose)

  TABLE: gdpr_requests
  ---------------------
  request_id        VARCHAR(30)  PRIMARY KEY
  customer_id       VARCHAR(20)  NOT NULL
  request_type      ENUM('ERASURE','PORTABILITY','RECTIFICATION','RESTRICTION','ACCESS','OBJECTION')
  status            ENUM('RECEIVED','IN_PROGRESS','COMPLETED','REJECTED','PARTIALLY_COMPLETED')
  systems_affected  TEXT[]
  completion_pct    INTEGER      DEFAULT 0
  due_date          TIMESTAMP    NOT NULL
  completed_at      TIMESTAMP
  rejection_reason  TEXT
  evidence_json     JSONB
  created_at        TIMESTAMP    DEFAULT NOW()
  INDEX idx_gdpr_customer   ON gdpr_requests(customer_id)
  INDEX idx_gdpr_status     ON gdpr_requests(status)
  INDEX idx_gdpr_due_date   ON gdpr_requests(due_date)
`}</pre>
    </div>
  );

  const renderScenarios = () => (
    <div>
      <h2 style={sectionTitle}>Compliance Testing Scenarios</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 comprehensive test scenarios covering KYC, AML, PCI-DSS, GDPR, SOX, RBI, and BASEL regulatory domains for Indian banking compliance validation.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width:50 }}>#</th>
            <th style={thStyle}>Scenario</th>
            <th style={thStyle}>Regulation</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Expected Outcome</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id:'S01', title:'eKYC via Aadhaar OTP Verification', reg:'KYC', desc:'Customer initiates account opening with Aadhaar eKYC. System sends OTP via UIDAI, customer enters OTP, system fetches demographic data and photo from UIDAI, performs face match, and creates KYC record.', outcome:'KYC record created with VERIFIED status, CKYC uploaded to CERSAI, risk category assigned based on customer profile.' },
            { id:'S02', title:'Video KYC (V-CIP) with Liveness Detection', reg:'KYC', desc:'Customer initiates V-CIP session. Bank agent connects via video, verifies identity documents live, system performs liveness detection (blink, head turn), captures geo-location, records video for audit.', outcome:'V-CIP session recorded, liveness score > 0.90, face match score > 0.85, geo-location logged, KYC completed with full audit trail.' },
            { id:'S03', title:'Re-KYC for High-Risk Customer', reg:'KYC/RBI', desc:'System identifies high-risk customer approaching re-KYC due date (2 years). Triggers re-KYC workflow with enhanced due diligence requirements. Customer must provide updated documents and source of funds.', outcome:'Re-KYC completed before expiry, enhanced documents collected, risk re-assessment performed, CKYC registry updated.' },
            { id:'S04', title:'Structuring Detection (Multiple Deposits Below Threshold)', reg:'AML', desc:'Customer makes 4 cash deposits of INR 9,50,000 each across 3 branches within 24 hours. Total: INR 38,00,000. Each below CTR threshold of INR 10,00,000 but pattern indicates structuring.', outcome:'AML alert generated with STRUCTURING type, risk score 90+, alert auto-assigned to L2 analyst, account flagged for enhanced monitoring.' },
            { id:'S05', title:'Rapid Fund Movement Across Accounts', reg:'AML', desc:'INR 25,00,000 received via RTGS into savings account. Within 90 minutes, INR 24,50,000 transferred via NEFT to 5 different beneficiaries in different banks. Account has no prior RTGS history.', outcome:'RAPID_MOVEMENT alert triggered, transaction chain captured in evidence, all 5 beneficiary accounts flagged for downstream monitoring.' },
            { id:'S06', title:'Sanctions Screening Against OFAC SDN List', reg:'AML/Sanctions', desc:'International wire transfer initiated to beneficiary "Mohammad Al-Rashid Trading LLC" in Dubai. Name fuzzy-matched against OFAC SDN list. Jaro-Winkler score: 0.87 against known SDN entity.', outcome:'Transaction blocked (auto-hold), TRUE HIT alert generated, compliance officer notified within 15 minutes, SAR prepared for filing.' },
            { id:'S07', title:'PEP (Politically Exposed Person) Identification', reg:'AML/KYC', desc:'During customer onboarding, system screens customer name against PEP database. Match found: customer is a relative of a state-level politician. Enhanced Due Diligence (EDD) triggered.', outcome:'Customer flagged as PEP-related, risk category elevated to HIGH, senior management approval required, ongoing enhanced monitoring enabled.' },
            { id:'S08', title:'CTR Generation for Cash Transactions > 10 Lakhs', reg:'AML/RBI', desc:'Customer deposits INR 15,00,000 in cash at branch. System auto-generates Cash Transaction Report (CTR) with customer details, transaction details, source of funds declaration.', outcome:'CTR generated automatically, queued for FIU-IND filing within 15 days of month-end, branch manager attestation captured.' },
            { id:'S09', title:'STR Filing Workflow for Suspicious Activity', reg:'AML/PMLA', desc:'Analyst investigates AML alert, determines transaction is suspicious. Initiates STR filing workflow: documents evidence, obtains compliance officer approval, packages report in FIU-IND format.', outcome:'STR filed with FIU-IND within 7 days of suspicion determination, unique FIU reference received, evidence archived for 5 years.' },
            { id:'S10', title:'PCI-DSS Cardholder Data Encryption Validation', reg:'PCI-DSS', desc:'Automated scan of all databases, file systems, and logs to detect unencrypted PAN (Primary Account Number) storage. Validates AES-256 encryption at rest and TLS 1.2+ in transit.', outcome:'Zero unencrypted PAN detected, encryption keys rotated per policy, tokenization validated for non-essential PAN usage.' },
            { id:'S11', title:'PCI-DSS Network Segmentation Testing', reg:'PCI-DSS', desc:'Penetration test validates CDE (Cardholder Data Environment) is properly segmented from non-CDE networks. Test lateral movement from corporate network to CDE.', outcome:'No lateral movement possible, firewall rules validated, segmentation effective, all CDE access logged and monitored.' },
            { id:'S12', title:'GDPR Right to Erasure (Data Deletion)', reg:'GDPR', desc:'Customer submits "Right to be Forgotten" request. System identifies all personal data across 12 systems (CBS, CRM, marketing, analytics, backups). Initiates cascading deletion with evidence.', outcome:'Personal data deleted/anonymized across all systems within 30 days, deletion certificates generated per system, backup retention exception documented.' },
            { id:'S13', title:'GDPR Data Portability (Export Customer Data)', reg:'GDPR', desc:'Customer requests all personal data in machine-readable format. System aggregates data from all processing systems, generates structured JSON/CSV export, delivers securely.', outcome:'Complete data package generated in JSON format within 30 days, delivered via secure download link, export audit logged.' },
            { id:'S14', title:'GDPR Consent Withdrawal and Processing Stop', reg:'GDPR', desc:'Customer withdraws consent for marketing communications. System must stop all marketing processing within 24 hours while maintaining legitimate interest processing (account management).', outcome:'Marketing consent revoked, all marketing channels stopped within 24 hours, legitimate processing continues, consent register updated.' },
            { id:'S15', title:'GDPR Breach Notification Within 72 Hours', reg:'GDPR', desc:'Security team detects data breach affecting 5,000 customer records. Breach involves unauthorized access to names, email addresses, and account numbers. 72-hour notification clock starts.', outcome:'DPO notified within 1 hour, impact assessment completed within 24 hours, supervisory authority notified within 72 hours, affected customers notified.' },
            { id:'S16', title:'SOX Segregation of Duties Validation', reg:'SOX', desc:'Quarterly SoD review: validate that no single user can both initiate and approve fund transfers, create and authorize GL entries, or manage user access and audit logs.', outcome:'SoD matrix validated, 3 violations detected and remediated, compensating controls documented, evidence retained for auditors.' },
            { id:'S17', title:'SOX Access Recertification Audit', reg:'SOX', desc:'Annual access recertification: all privileged access to financial systems reviewed by respective managers. Orphan accounts identified, excessive privileges flagged for removal.', outcome:'100% of privileged accounts recertified, 12 orphan accounts disabled, 28 excessive privileges removed, recertification evidence archived.' },
            { id:'S18', title:'RBI CRILC Reporting for Large Exposures', reg:'RBI', desc:'Generate CRILC (Central Repository of Information on Large Credits) report for all borrowers with aggregate exposure >= INR 5 Crore. Validate data accuracy, format compliance, and submission timeline.', outcome:'CRILC report generated with zero data errors, SMA classification accurate, submitted to RBI within due date, acknowledgment received.' },
            { id:'S19', title:'BASEL III Capital Adequacy Ratio Calculation', reg:'BASEL III', desc:'Quarter-end CRAR calculation: compute CET1, Additional Tier 1, Tier 2 capital. Calculate RWA for credit risk (standardized approach), market risk (BIA), operational risk (BIA). Validate minimum ratios.', outcome:'CET1 ratio >= 5.5%, Tier 1 >= 7%, Total CRAR >= 9% (RBI minimum). Capital buffers (CCB 2.5%) validated. Report submitted to RBI.' },
            { id:'S20', title:'FATCA/CRS Tax Reporting for NRI Accounts', reg:'RBI/FATCA', desc:'Annual FATCA/CRS reporting: identify all NRI and foreign tax resident accounts, extract reportable information (account balance, interest income, gross proceeds), generate XML report for CBDT.', outcome:'All reportable accounts identified (US persons + CRS jurisdictions), XML report generated per schema, submitted to CBDT by due date.' }
          ].map((s, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:700, textAlign:'center' }}>{s.id}</td>
              <td style={{ ...tdStyle, fontWeight:600, color:C.header, minWidth:200 }}>{s.title}</td>
              <td style={{ ...tdStyle, textAlign:'center' }}>{badge(
                s.reg.includes('AML') ? C.warn : s.reg.includes('PCI') ? C.info : s.reg.includes('GDPR') ? C.success : s.reg.includes('SOX') ? C.warn : s.reg.includes('BASEL') ? C.info : s.reg.includes('RBI') ? C.accent : C.accent,
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
      <h2 style={sectionTitle}>Compliance Test Cases</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 detailed test cases mapped to specific regulatory controls with step-by-step procedures and evidence requirements.
      </p>
      <div style={{ overflowX:'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, minWidth:80 }}>TC-ID</th>
              <th style={{ ...thStyle, minWidth:180 }}>Title</th>
              <th style={{ ...thStyle, minWidth:80 }}>Regulation</th>
              <th style={{ ...thStyle, minWidth:100 }}>Control ID</th>
              <th style={{ ...thStyle, minWidth:250 }}>Steps</th>
              <th style={{ ...thStyle, minWidth:200 }}>Expected Result</th>
              <th style={{ ...thStyle, minWidth:60 }}>Priority</th>
              <th style={{ ...thStyle, minWidth:150 }}>Evidence Required</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id:'TC-CR-001', title:'Aadhaar eKYC OTP Flow', reg:'KYC', ctrl:'RBI-KYC-MD-2016 Sec 18', steps:'1. Initiate KYC with valid Aadhaar\n2. Request OTP from UIDAI\n3. Submit OTP within 10 min\n4. Verify demographic data returned\n5. Validate face photo extracted\n6. Check CKYC upload triggered', result:'eKYC completed, UIDAI txn ID captured, customer record created with VERIFIED status, CKYC ID generated', pri:'P0', evidence:'UIDAI response XML, CKYC upload confirmation, KYC record screenshot, audit trail' },
              { id:'TC-CR-002', title:'V-CIP Video KYC Session', reg:'KYC', ctrl:'RBI-KYC-MD-2016 Sec 18A', steps:'1. Schedule V-CIP session\n2. Agent connects via video\n3. Liveness check (blink+turn)\n4. Document hold-up verification\n5. Geo-location capture\n6. Session recording saved', result:'Liveness score > 0.90, face match > 0.85, video recorded with timestamp, geo-coordinates within India', pri:'P0', evidence:'Video recording, liveness report, geo-location log, agent attestation, audit trail' },
              { id:'TC-CR-003', title:'Re-KYC Expiry Alert', reg:'KYC', ctrl:'RBI-KYC-MD Sec 38', steps:'1. Set customer re-KYC date to T-30 days\n2. Run re-KYC scheduler\n3. Verify alert generated\n4. Check customer notification sent\n5. Validate account restriction on expiry\n6. Complete re-KYC and verify restoration', result:'Alert 30 days before expiry, SMS/email to customer, account restricted on expiry date, restored after re-KYC', pri:'P0', evidence:'Alert log, notification records, account status history, re-KYC completion record' },
              { id:'TC-CR-004', title:'AML Structuring Detection', reg:'AML', ctrl:'PMLA-Rule-3 / RBI-AML-2023', steps:'1. Insert 4 cash deposits of 9.5L each\n2. Same customer, different branches\n3. Within 24-hour window\n4. Run AML batch processing\n5. Verify alert generated\n6. Check risk score calculation', result:'STRUCTURING alert with risk score >= 85, all 4 transactions linked in evidence, auto-assigned to L2 analyst', pri:'P0', evidence:'Alert record, transaction linkage, risk scoring breakdown, assignment log' },
              { id:'TC-CR-005', title:'OFAC Sanctions Screening', reg:'AML', ctrl:'OFAC-SDN / UN-1267', steps:'1. Initiate wire transfer to SDN-listed entity\n2. Real-time screening triggered\n3. Fuzzy match algorithm runs\n4. Verify match score > 0.80\n5. Transaction auto-blocked\n6. Compliance officer alerted', result:'Transaction blocked within 200ms, TRUE HIT recorded, compliance officer notified, OFAC report prepared', pri:'P0', evidence:'Screening result, match score details, block confirmation, notification timestamp, OFAC report draft' },
              { id:'TC-CR-006', title:'CTR Auto-Generation', reg:'AML', ctrl:'PMLA-Rule-3(1)(A)', steps:'1. Cash deposit of INR 12,00,000\n2. Verify CTR auto-generated\n3. Validate all required fields\n4. Check FIU-IND format compliance\n5. Verify filing queue placement\n6. Confirm filing within 15 days', result:'CTR generated with correct FIU format, all 27 mandatory fields populated, queued for batch filing', pri:'P0', evidence:'CTR XML, field validation report, filing queue screenshot, FIU acknowledgment' },
              { id:'TC-CR-007', title:'STR Filing Workflow', reg:'AML', ctrl:'PMLA-Rule-3(1)(B)', steps:'1. Analyst marks alert as suspicious\n2. Evidence package auto-compiled\n3. Compliance officer reviews\n4. STR form populated (FIU format)\n5. Officer approves and signs\n6. STR submitted to FIU-IND', result:'STR filed within 7 days of suspicion, FIU reference number received, evidence archived with 5-year retention', pri:'P0', evidence:'STR form, FIU acknowledgment, evidence package, approval chain, filing timestamp' },
              { id:'TC-CR-008', title:'PAN Encryption at Rest (Req 3)', reg:'PCI-DSS', ctrl:'PCI-DSS-3.4 / 3.5', steps:'1. Scan all databases for PAN patterns\n2. Verify AES-256 encryption\n3. Check encryption key in HSM\n4. Validate key rotation schedule\n5. Test tokenization for display\n6. Verify masking (first 6, last 4)', result:'Zero unencrypted PAN found, keys stored in HSM, rotation every 12 months, display shows masked PAN only', pri:'P0', evidence:'Scan report, encryption config, HSM certificate, key rotation log, masking screenshot' },
              { id:'TC-CR-009', title:'Network Segmentation Test (Req 1)', reg:'PCI-DSS', ctrl:'PCI-DSS-1.3 / 1.4', steps:'1. Attempt access from corp network to CDE\n2. Verify firewall blocks\n3. Test all CDE entry points\n4. Validate micro-segmentation\n5. Check IDS/IPS alerting\n6. Review firewall rule sets', result:'No unauthorized CDE access, firewall blocks all non-permitted traffic, IDS alert on attempted access', pri:'P0', evidence:'Penetration test report, firewall rule export, IDS alert log, network diagram' },
              { id:'TC-CR-010', title:'Vulnerability Scan (Req 11)', reg:'PCI-DSS', ctrl:'PCI-DSS-11.2 / 11.3', steps:'1. Run quarterly ASV scan\n2. Identify all vulnerabilities\n3. Validate CVSS scoring\n4. Verify no critical/high unpatched\n5. Run annual penetration test\n6. Validate remediation within SLA', result:'ASV scan passes (no CVSS >= 4.0 unresolved), pentest finds no exploitable vulnerabilities in CDE', pri:'P0', evidence:'ASV scan report (signed), pentest report, remediation tracker, retest results' },
              { id:'TC-CR-011', title:'GDPR Right to Erasure', reg:'GDPR', ctrl:'GDPR-Art.17', steps:'1. Submit erasure request via portal\n2. System identifies all data stores\n3. Verify 12 systems enumerated\n4. Initiate cascading deletion\n5. Verify anonymization in analytics\n6. Generate deletion certificate', result:'Data deleted/anonymized across all systems within 30 days, certificates per system, backup exception documented', pri:'P0', evidence:'Deletion certificates (12), anonymization proof, backup retention policy, request completion record' },
              { id:'TC-CR-012', title:'GDPR Data Portability Export', reg:'GDPR', ctrl:'GDPR-Art.20', steps:'1. Submit data portability request\n2. System aggregates from all sources\n3. Generate structured JSON export\n4. Validate data completeness\n5. Deliver via secure channel\n6. Log export in audit trail', result:'Complete JSON export within 30 days, includes all personal data categories, secure delivery confirmed', pri:'P1', evidence:'Export JSON sample, completeness checklist, delivery confirmation, audit log' },
              { id:'TC-CR-013', title:'GDPR 72-Hour Breach Notification', reg:'GDPR', ctrl:'GDPR-Art.33/34', steps:'1. Simulate data breach event\n2. Verify auto-detection within 1 hr\n3. DPO notification triggered\n4. Impact assessment completed\n5. Supervisory authority notified\n6. Affected customers contacted', result:'Detection < 1 hour, DPO notified immediately, authority notified < 72 hours, customer notification if high risk', pri:'P0', evidence:'Breach detection log, DPO notification, authority submission, customer notification, impact assessment' },
              { id:'TC-CR-014', title:'GDPR Consent Management', reg:'GDPR', ctrl:'GDPR-Art.7', steps:'1. Customer grants marketing consent\n2. Verify consent recorded with timestamp\n3. Customer withdraws consent\n4. Verify processing stopped < 24 hrs\n5. Check consent register updated\n6. Validate no marketing after withdrawal', result:'Consent lifecycle fully tracked, withdrawal effective within 24 hours, no processing after withdrawal', pri:'P1', evidence:'Consent register entries, withdrawal timestamp, marketing system logs, processing activity record' },
              { id:'TC-CR-015', title:'SOX Segregation of Duties', reg:'SOX', ctrl:'SOX-404 ITGC-AC', steps:'1. Extract user-role matrix\n2. Run SoD conflict detection\n3. Identify users with conflicting roles\n4. Verify compensating controls\n5. Generate SoD violation report\n6. Remediate or document exceptions', result:'SoD matrix validated, all conflicts identified, compensating controls documented for approved exceptions', pri:'P0', evidence:'SoD matrix, conflict report, compensating control documentation, management sign-off' },
              { id:'TC-CR-016', title:'SOX Access Recertification', reg:'SOX', ctrl:'SOX-404 ITGC-LA', steps:'1. Generate privileged access report\n2. Send to respective managers\n3. Managers certify or revoke\n4. Identify orphan accounts\n5. Remove excessive privileges\n6. Archive recertification evidence', result:'100% accounts recertified, orphans disabled, excessive privileges removed, evidence archived for 7 years', pri:'P0', evidence:'Recertification forms (signed), orphan account list, privilege removal log, manager attestations' },
              { id:'TC-CR-017', title:'RBI CRILC Large Exposure Report', reg:'RBI', ctrl:'RBI-CRILC-2014', steps:'1. Extract all borrowers >= 5 Cr\n2. Calculate aggregate exposure\n3. Classify SMA status (0/1/2)\n4. Validate against CBS data\n5. Generate CRILC XML\n6. Submit to RBI portal', result:'CRILC report with accurate SMA classification, zero data discrepancies, submitted within RBI timeline', pri:'P0', evidence:'CRILC XML, data reconciliation report, SMA classification logic, RBI portal acknowledgment' },
              { id:'TC-CR-018', title:'BASEL III Capital Adequacy (CRAR)', reg:'BASEL III', ctrl:'BASEL-III-Pillar-1', steps:'1. Compute CET1 capital\n2. Calculate Additional Tier 1\n3. Calculate Tier 2 capital\n4. Compute RWA (credit+market+operational)\n5. Calculate CET1, Tier1, Total CRAR\n6. Validate against RBI minimum', result:'CET1 >= 5.5%, Tier 1 >= 7%, Total CRAR >= 9%, CCB 2.5% maintained, reported to RBI quarterly', pri:'P0', evidence:'Capital computation worksheet, RWA calculation, ratio report, RBI submission, board approval' },
              { id:'TC-CR-019', title:'PEP Screening and EDD', reg:'AML/KYC', ctrl:'PMLA-Rule-9 / FATF-R12', steps:'1. Screen customer against PEP database\n2. Identify PEP match (direct/related)\n3. Trigger Enhanced Due Diligence\n4. Senior management approval\n5. Source of wealth documented\n6. Ongoing enhanced monitoring', result:'PEP identified, EDD completed, senior management approved, enhanced monitoring configured, documented in KYC', pri:'P0', evidence:'PEP screening result, EDD form, management approval, source of wealth docs, monitoring config' },
              { id:'TC-CR-020', title:'FATCA/CRS Annual Reporting', reg:'FATCA/CRS', ctrl:'IGA-Model1 / CRS-MCAA', steps:'1. Identify US/CRS reportable accounts\n2. Extract account balances\n3. Calculate reportable income\n4. Generate FATCA XML (Schema v2.0)\n5. Generate CRS XML\n6. Submit to CBDT portal', result:'All reportable accounts identified, XML schema validated, submitted to CBDT before May 31 deadline', pri:'P0', evidence:'Account identification methodology, XML validation report, CBDT submission receipt, W-8BEN forms' }
            ].map((tc, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
                <td style={{ ...tdStyle, color:C.accent, fontWeight:700, fontSize:12 }}>{tc.id}</td>
                <td style={{ ...tdStyle, fontWeight:600, color:C.header, fontSize:12 }}>{tc.title}</td>
                <td style={{ ...tdStyle, textAlign:'center', fontSize:11 }}>{badge(
                  tc.reg.includes('AML') ? C.warn : tc.reg.includes('PCI') ? C.info : tc.reg.includes('GDPR') ? C.success : tc.reg.includes('SOX') ? C.warn : tc.reg.includes('BASEL') ? C.info : tc.reg.includes('FATCA') ? C.danger : C.accent,
                  tc.reg
                )}</td>
                <td style={{ ...tdStyle, fontSize:11, fontFamily:'monospace', color:C.editorText }}>{tc.ctrl}</td>
                <td style={{ ...tdStyle, fontSize:11, whiteSpace:'pre-line' }}>{tc.steps}</td>
                <td style={{ ...tdStyle, fontSize:11 }}>{tc.result}</td>
                <td style={{ ...tdStyle, textAlign:'center' }}>{badge(tc.pri === 'P0' ? C.danger : C.warn, tc.pri)}</td>
                <td style={{ ...tdStyle, fontSize:11 }}>{tc.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderC4Model = () => (
    <div>
      <h2 style={sectionTitle}>C4 Model - Compliance Platform</h2>

      <h3 style={subTitle}>Level 1: System Context</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 1: SYSTEM CONTEXT                   |
  +=========================================================================+

                          +-------------------+
                          |    Customers       |
                          |  (Retail/Corp/NRI) |
                          +--------+----------+
                                   |
                          KYC, Consent, DSR
                                   |
                                   v
  +----------------+    +========================+    +-------------------+
  |  Regulators    |    |                        |    | External Data     |
  |  - RBI         |<-->|  COMPLIANCE PLATFORM   |<-->| Providers         |
  |  - SEBI        |    |  (Banking QA System)   |    |                   |
  |  - FIU-IND     |    |                        |    | - UIDAI (Aadhaar) |
  |  - CBDT        |    | Ensures regulatory     |    | - CKYC (CERSAI)   |
  |  - IBBI        |    | compliance across all  |    | - Credit Bureaus  |
  +----------------+    | banking operations     |    |   (CIBIL/Experian)|
                        |                        |    | - OFAC/UN/EU      |
  +----------------+    |                        |    |   Sanctions Lists |
  |  Auditors      |<-->|                        |    | - PEP Databases   |
  |  - Internal    |    +========================+    | - SWIFT Network   |
  |  - External    |               ^                  +-------------------+
  |  - Statutory   |               |
  |  (ICAI firms)  |    +----------+----------+
  +----------------+    |  Banking Systems     |
                        |  - Core Banking (CBS)|
                        |  - Card Processing   |
                        |  - Loan Management   |
                        |  - Treasury          |
                        |  - Trade Finance     |
                        |  - Digital Banking   |
                        +---------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 2: Container Diagram</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 2: CONTAINERS                       |
  +=========================================================================+

  +-------------------------------------------------------------------------+
  |                        COMPLIANCE PLATFORM                               |
  |                                                                          |
  |  +------------------+  +------------------+  +---------------------+    |
  |  | KYC Engine       |  | AML Monitor      |  | Sanctions Screener  |    |
  |  | [Java/Spring]    |  | [Python/Spark]   |  | [Java/Elasticsearch]|    |
  |  |                  |  |                  |  |                     |    |
  |  | - eKYC workflow  |  | - Rule engine    |  | - OFAC SDN          |    |
  |  | - V-CIP handler  |  | - ML pipeline    |  | - UN/EU lists       |    |
  |  | - CKYC sync      |  | - Network graph  |  | - Fuzzy matching    |    |
  |  | - Doc OCR        |  | - Batch monitor  |  | - Real-time screen  |    |
  |  | - Risk scoring   |  | - Alert gen      |  | - PEP checks        |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------+  +---------------------+    |
  |  | PCI Scanner      |  | GDPR Manager     |  | SOX Auditor         |    |
  |  | [Python/Nessus]  |  | [Java/Spring]    |  | [Java/Spring]       |    |
  |  |                  |  |                  |  |                     |    |
  |  | - Control checks |  | - Data inventory |  | - SoD matrix        |    |
  |  | - Vuln scanning  |  | - Consent mgmt   |  | - Access revert     |    |
  |  | - Encryption val |  | - DSR workflow   |  | - Change mgmt       |    |
  |  | - Segmentation   |  | - Breach notify  |  | - Evidence collect  |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------------------------------+    |
  |  | Reporting Engine |  | Case Management System                    |    |
  |  | [Python/XBRL]    |  | [Java/Spring + React]                    |    |
  |  |                  |  |                                           |    |
  |  | - CRILC reports  |  | - Alert investigation workflow            |    |
  |  | - XBRL filing    |  | - Evidence attachment & packaging         |    |
  |  | - CTR/STR gen    |  | - SLA tracking & escalation              |    |
  |  | - FATCA/CRS      |  | - Regulatory filing initiation            |    |
  |  | - BASEL reports   |  | - Analyst assignment & workload mgmt     |    |
  |  +------------------+  +------------------------------------------+    |
  |                                                                          |
  |  +------------------------------------------------------------------+  |
  |  | Data Layer                                                        |  |
  |  | PostgreSQL (OLTP) | Elasticsearch (Search) | Neo4j (Graph)       |  |
  |  | Redis (Cache)     | S3 (Documents/Evidence) | Kafka (Events)     |  |
  |  +------------------------------------------------------------------+  |
  +-------------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 3: Component Diagram</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 3: COMPONENTS                       |
  +=========================================================================+

  AML Monitor [Container] - Component Breakdown:

  +------------------------------------------------------------------+
  |                                                                    |
  |  +------------------+     +-------------------+                    |
  |  | RuleEngine       |---->| RiskScorer         |                    |
  |  | - Rule loader    |     | - Rule score calc  |                    |
  |  | - Drools/Custom  |     | - ML score calc    |                    |
  |  | - Threshold eval |     | - Composite score  |                    |
  |  | - Pattern detect |     | - Risk categorize  |                    |
  |  +------------------+     +--------+-----------+                    |
  |                                     |                               |
  |  +------------------+              v                               |
  |  | DataClassifier   |     +-------------------+                    |
  |  | - Data profiling |     | AlertGenerator     |                    |
  |  | - Type detection |     | - Priority assign  |                    |
  |  | - PII flagging   |     | - Dedup alerts     |                    |
  |  | - Sensitivity    |     | - Auto-close rules |                    |
  |  +------------------+     | - Route to analyst |                    |
  |                            +--------+----------+                    |
  |                                     |                               |
  |  +------------------+              v                               |
  |  | SanctionsMatch   |     +-------------------+                    |
  |  | Engine           |     | CaseManager        |                    |
  |  | - Name normalize |     | - Investigation    |                    |
  |  | - Jaro-Winkler   |     | - Evidence attach  |                    |
  |  | - Levenshtein    |     | - Workflow state   |                    |
  |  | - Phonetic match |     | - SLA monitor      |                    |
  |  | - Composite score|     | - Escalation       |                    |
  |  +------------------+     +--------+----------+                    |
  |                                     |                               |
  |                                     v                               |
  |                            +-------------------+                    |
  |                            | ReportGenerator    |                    |
  |                            | - STR formatter    |                    |
  |                            | - CTR formatter    |                    |
  |                            | - CRILC generator  |                    |
  |                            | - XBRL converter   |                    |
  |                            | - Evidence packager|                    |
  |                            +-------------------+                    |
  +------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 4: Code (Key Classes)</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                     C4 MODEL - LEVEL 4: CODE                             |
  +=========================================================================+

  class TransactionMonitor:
      def __init__(self, rule_engine, risk_scorer, alert_generator):
          self.rule_engine = rule_engine
          self.risk_scorer = risk_scorer
          self.alert_generator = alert_generator

      def process_transaction(self, transaction: Transaction) -> MonitoringResult:
          enriched = self._enrich(transaction)
          rule_hits = self.rule_engine.evaluate(enriched)
          risk_score = self.risk_scorer.calculate(enriched, rule_hits)
          if risk_score.category in (RiskCategory.MEDIUM, RiskCategory.HIGH):
              alert = self.alert_generator.create(enriched, rule_hits, risk_score)
              return MonitoringResult(alert=alert, score=risk_score)
          return MonitoringResult(alert=None, score=risk_score)

  class SanctionsScreener:
      def __init__(self, lists_loader, match_engine, config):
          self.lists = lists_loader.load_all()  # OFAC, UN, EU, MHA
          self.match_engine = match_engine
          self.threshold_true_hit = config.SANCTIONS_TRUE_HIT_THRESHOLD  # 0.80
          self.threshold_potential = config.SANCTIONS_POTENTIAL_THRESHOLD  # 0.60

      def screen(self, entity_name: str) -> ScreeningResult:
          normalized = self._normalize(entity_name)
          best_match = self.match_engine.find_best_match(normalized, self.lists)
          if best_match.score >= self.threshold_true_hit:
              return ScreeningResult(disposition="TRUE_HIT", match=best_match)
          elif best_match.score >= self.threshold_potential:
              return ScreeningResult(disposition="POTENTIAL_MATCH", match=best_match)
          return ScreeningResult(disposition="CLEAR", match=None)

  class KYCWorkflow:
      def __init__(self, uidai_client, ckyc_client, doc_verifier, risk_engine):
          self.uidai = uidai_client
          self.ckyc = ckyc_client
          self.doc_verifier = doc_verifier
          self.risk_engine = risk_engine

      def initiate_ekyc(self, customer_id: str, aadhaar: str) -> KYCSession:
          otp_ref = self.uidai.request_otp(aadhaar)
          return KYCSession(customer_id=customer_id, otp_ref=otp_ref, status="OTP_SENT")

      def verify_otp(self, session: KYCSession, otp: str) -> KYCResult:
          aadhaar_data = self.uidai.verify_otp(session.otp_ref, otp)
          risk = self.risk_engine.categorize(aadhaar_data)
          ckyc_id = self.ckyc.upload(aadhaar_data)
          return KYCResult(status="VERIFIED", data=aadhaar_data, risk=risk, ckyc_id=ckyc_id)

  class GDPRRequestHandler:
      def __init__(self, data_inventory, deletion_orchestrator, notification_service):
          self.inventory = data_inventory
          self.orchestrator = deletion_orchestrator
          self.notifier = notification_service

      def handle_erasure(self, customer_id: str) -> ErasureResult:
          systems = self.inventory.find_all_systems(customer_id)
          results = self.orchestrator.cascade_delete(customer_id, systems)
          certificates = [r.certificate for r in results if r.success]
          return ErasureResult(systems_processed=len(systems), certificates=certificates)
`}</pre>
    </div>
  );

  const renderTechStack = () => (
    <div>
      <h2 style={sectionTitle}>Technology Stack</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Comprehensive technology stack for compliance and regulatory testing in Indian banking ecosystem.
      </p>
      <div style={gridStyle}>
        {[
          { cat:'Compliance Platforms', items:[
            { name:'NICE Actimize', desc:'Enterprise AML/fraud detection, transaction monitoring, case management', use:'Primary AML monitoring' },
            { name:'SAS Anti-Money Laundering', desc:'Advanced analytics-based AML solution with network visualization', use:'ML-based anomaly detection' },
            { name:'FICO TONBELLER', desc:'Sanctions screening, KYC/CDD, regulatory reporting', use:'Sanctions and KYC automation' },
            { name:'Accuity / Fircosoft', desc:'Real-time sanctions filtering for payments (SWIFT, domestic)', use:'Payment screening (OFAC/UN/EU)' }
          ], color:C.accent },
          { cat:'KYC / Identity Verification', items:[
            { name:'Digilocker API', desc:'Government digital document locker for verified document access', use:'Document verification (PAN, Aadhaar, DL)' },
            { name:'UIDAI Aadhaar API', desc:'eKYC OTP and biometric authentication via UIDAI gateway', use:'Aadhaar-based eKYC' },
            { name:'NSDL PAN Verification', desc:'PAN card validation and name/DOB matching', use:'PAN verification during KYC' },
            { name:'Jumio / Onfido', desc:'AI-powered identity verification with liveness detection', use:'Video KYC liveness and document OCR' }
          ], color:C.info },
          { cat:'Rule Engine & Decision', items:[
            { name:'Drools (Red Hat)', desc:'Business rules management system for complex event processing', use:'AML rules, KYC risk scoring' },
            { name:'IBM ODM', desc:'Operational Decision Manager for enterprise decision automation', use:'Compliance decision workflows' },
            { name:'Custom Python Engine', desc:'In-house rule engine with configurable thresholds and ML integration', use:'Flexible rule management, rapid deployment' }
          ], color:C.warn },
          { cat:'Data & Storage', items:[
            { name:'PostgreSQL', desc:'Primary OLTP database for compliance records, audit trails', use:'KYC records, AML alerts, consent register' },
            { name:'Elasticsearch', desc:'Full-text search and analytics for sanctions lists and log analysis', use:'Sanctions name search, compliance log analytics' },
            { name:'Neo4j', desc:'Graph database for relationship and network analysis', use:'AML network analysis, fund flow tracing' },
            { name:'Apache Kafka', desc:'Event streaming for real-time transaction monitoring pipeline', use:'Transaction event bus, alert streaming' }
          ], color:C.success },
          { cat:'Reporting & Filing', items:[
            { name:'XBRL Taxonomy', desc:'eXtensible Business Reporting Language for regulatory filings', use:'RBI/SEBI/MCA statutory returns' },
            { name:'Crystal Reports / Jasper', desc:'Enterprise reporting for compliance dashboards and evidence', use:'Audit reports, compliance dashboards' },
            { name:'FIU-IND Portal Integration', desc:'Direct integration with Financial Intelligence Unit for STR/CTR', use:'Automated STR/CTR filing' },
            { name:'RBI CRILC Portal', desc:'Central Repository of Information on Large Credits', use:'Large exposure reporting' }
          ], color:C.accent },
          { cat:'Security & Secrets', items:[
            { name:'HashiCorp Vault', desc:'Secrets management, encryption as a service, PKI', use:'Encryption keys, API secrets, certificate management' },
            { name:'CyberArk', desc:'Privileged Access Management (PAM) for compliance systems', use:'Admin credential vaulting, session recording' },
            { name:'Qualys / Tenable', desc:'Vulnerability management and compliance scanning', use:'PCI-DSS ASV scans, vulnerability assessment' }
          ], color:C.danger },
          { cat:'SIEM & Monitoring', items:[
            { name:'Splunk', desc:'Security Information and Event Management, log analytics', use:'Compliance event correlation, SOX audit trail monitoring' },
            { name:'IBM QRadar', desc:'AI-powered threat detection and SIEM', use:'Security incident detection, compliance alerting' },
            { name:'Grafana + Prometheus', desc:'Metrics visualization and alerting', use:'Compliance SLA monitoring, system health dashboards' }
          ], color:C.info },
          { cat:'Testing & QA Tools', items:[
            { name:'OWASP ZAP', desc:'Open-source web application security scanner', use:'PCI-DSS web application scanning' },
            { name:'Burp Suite', desc:'Web vulnerability scanner and proxy', use:'Penetration testing for CDE applications' },
            { name:'Nessus', desc:'Vulnerability scanner for network and system assessment', use:'PCI-DSS quarterly ASV scans' },
            { name:'Custom Compliance Scripts', desc:'Python/Shell scripts for automated compliance checks', use:'Regulatory control validation automation' }
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
          { title:'ADR-001: Hybrid AML Detection (Rule-Based + ML)', decision:'Use both rule-based and ML-based transaction monitoring in parallel.', rationale:'Rule-based detection catches known patterns (structuring, threshold breaches) with 100% recall for defined rules. ML models (Isolation Forest, Autoencoder) detect emerging/unknown patterns that rules cannot anticipate. Combining both maximizes detection coverage.', tradeoff:'Higher infrastructure cost and maintenance complexity. ML models require regular retraining and validation. False positive rate increases with dual systems but can be managed with ensemble scoring.', color:C.accent },
          { title:'ADR-002: Real-Time Sanctions Screening at Transaction Time', decision:'Screen every transaction in real-time against sanctions lists before processing.', rationale:'Regulatory mandate (OFAC, RBI) requires screening before fund transfer. Post-transaction screening risks facilitating sanctioned entity transactions. Real-time screening with < 200ms SLA prevents regulatory violations and potential penalties (up to USD 1M+ per violation).', tradeoff:'Adds latency to every transaction. Requires high-availability infrastructure (99.99%). List updates must be near-instantaneous. False positives can block legitimate transactions and impact customer experience.', color:C.danger },
          { title:'ADR-003: Separate GDPR Data Subject Request Orchestrator', decision:'Build a dedicated orchestration layer for GDPR data subject requests (erasure, portability, rectification).', rationale:'Personal data exists across 12+ systems. A centralized orchestrator ensures complete and auditable data lifecycle management. Without it, erasure requests risk incomplete execution, leading to GDPR fines (up to 4% of global turnover).', tradeoff:'Requires maintaining a comprehensive data inventory/catalog. Each system needs a deletion/export API. Backup data creates complexity (can\'t delete from immutable backups, must document exception).', color:C.success },
          { title:'ADR-004: Event-Driven Architecture for Compliance Pipeline', decision:'Use Apache Kafka as the event backbone for transaction monitoring and compliance events.', rationale:'Decouples transaction source systems from compliance consumers. Enables real-time processing with replay capability. Supports audit trail requirements (events are immutable). Scales horizontally for peak transaction volumes.', tradeoff:'Operational complexity of Kafka cluster management. Eventual consistency must be handled. Message ordering guarantees needed for accurate transaction sequencing. Schema evolution requires careful management.', color:C.info },
          { title:'ADR-005: Graph Database (Neo4j) for AML Network Analysis', decision:'Use Neo4j for relationship mapping and network analysis in AML investigations.', rationale:'Traditional RDBMS cannot efficiently traverse multi-hop relationships (A->B->C->D fund flows). Graph traversal enables detection of circular fund flows, shell company networks, and layering patterns. Visual representation aids analyst investigation.', tradeoff:'Additional database to maintain. Data synchronization between PostgreSQL and Neo4j required. Graph query performance degrades with very large datasets (10M+ nodes). Team needs Cypher query expertise.', color:C.warn },
          { title:'ADR-006: Data Retention Policies Per Regulation', decision:'Implement regulation-specific data retention with automated archival and purge.', rationale:'Different regulations mandate different retention periods: KYC (5 years post-closure), AML/STR (5 years), SOX (7 years), Audit trails (8 years), PCI-DSS (1 year for logs). Automated policies prevent both premature deletion (compliance violation) and indefinite retention (GDPR violation).', tradeoff:'Complex retention logic with overlapping rules. Some data may be subject to multiple regulations with different periods (apply longest). Legal hold requirements can override automated purge. Storage costs for long-term archival.', color:C.accent }
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

      <h3 style={sectionTitle}>Regulatory Landscape - Indian Banking</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Regulation / Act</th>
            <th style={thStyle}>Governing Body</th>
            <th style={thStyle}>Key Provisions</th>
            <th style={thStyle}>Penalty for Non-Compliance</th>
          </tr>
        </thead>
        <tbody>
          {[
            { reg:'RBI KYC Master Direction 2016 (Updated 2023)', body:'Reserve Bank of India', provisions:'Customer identification, CDD/EDD, beneficial ownership, re-KYC periodicity, V-CIP guidelines, CKYC registry, digital KYC, Aadhaar eKYC consent', penalty:'Monetary penalty up to INR 1 Crore per instance, license restrictions, directive for compliance' },
            { reg:'PMLA 2002 (Prevention of Money Laundering Act)', body:'Enforcement Directorate / FIU-IND', provisions:'STR/CTR filing obligations, record keeping (5 years), KYC requirements, wire transfer rules, correspondent banking due diligence', penalty:'Imprisonment 3-7 years, fine up to INR 5 Lakhs, property attachment and confiscation' },
            { reg:'IT Act 2000 / IT Rules 2011', body:'MeitY / CERT-IN', provisions:'Reasonable security practices, data protection, cyber incident reporting (6 hours to CERT-IN), intermediary guidelines', penalty:'Compensation up to INR 5 Crore, imprisonment up to 3 years for data breach negligence' },
            { reg:'DPDP Act 2023 (Digital Personal Data Protection)', body:'Data Protection Board of India', provisions:'Consent-based processing, data principal rights, data fiduciary obligations, cross-border data transfer, children data protection', penalty:'Up to INR 250 Crore per instance of violation' },
            { reg:'PCI-DSS v4.0', body:'PCI Security Standards Council', provisions:'12 requirements for cardholder data protection, network security, access control, encryption, monitoring, testing', penalty:'Fines USD 5,000-100,000/month by card networks, increased transaction fees, loss of card processing ability' },
            { reg:'SOX (Sarbanes-Oxley) Sec 302/404', body:'SEC (for listed banks)', provisions:'CEO/CFO certification, internal controls over financial reporting, IT General Controls, change management, access controls', penalty:'Fines up to USD 5 Million, imprisonment up to 20 years for willful violations' },
            { reg:'BASEL III Framework', body:'Basel Committee / RBI Implementation', provisions:'Minimum capital ratios (CET1 5.5%, Tier 1 7%, Total 9%), LCR, NSFR, leverage ratio, countercyclical buffer', penalty:'Restrictions on dividend distribution, bonus payments, regulatory action plan (RAP)' },
            { reg:'FATCA / CRS', body:'CBDT / IRS (US)', provisions:'Identification of US/foreign tax resident accounts, annual reporting of account balances and income, withholding obligations', penalty:'30% withholding on US-source payments (FATCA), information exchange penalties, reputational risk' }
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
      <h2 style={sectionTitle}>AML Transaction Monitoring Flowchart</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        End-to-end flow of AML transaction monitoring from transaction receipt through regulatory filing with FIU-IND.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |          AML TRANSACTION MONITORING - DETAILED FLOWCHART                 |
  +=========================================================================+

                        +---------------------+
                        |  Transaction         |
                        |  Received            |
                        |  (CBS/Cards/UPI/     |
                        |   NEFT/RTGS/IMPS)    |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Extract Features    |
                        |  - Amount            |
                        |  - Frequency         |
                        |  - Counterparty      |
                        |  - Geography         |
                        |  - Channel           |
                        |  - Time of day       |
                        |  - Account history   |
                        |  - Customer profile  |
                        +----------+----------+
                                   |
                          +--------+--------+
                          |                 |
                          v                 v
                  +---------------+  +---------------+
                  | Rule Engine   |  | ML Engine     |
                  | (50+ Rules)   |  | (Anomaly Det) |
                  |               |  |               |
                  | - Structuring |  | - Isolation   |
                  | - Rapid Move  |  |   Forest      |
                  | - Round Amt   |  | - Autoencoder |
                  | - Dormant Act |  | - GNN         |
                  | - Threshold   |  | - XGBoost     |
                  | - Smurfing    |  | - Time Series |
                  +-------+-------+  +-------+-------+
                          |                 |
                          v                 v
                  +-------------------------------+
                  |  Composite Risk Scoring        |
                  |  Score = W1*RuleScore +         |
                  |          W2*MLScore +            |
                  |          W3*CustomerRisk +       |
                  |          W4*GeographyRisk        |
                  +---------------+---------------+
                                  |
                     +------------+------------+
                     |            |            |
                     v            v            v
              +----------+  +----------+  +----------+
              | LOW       |  | MEDIUM   |  | HIGH     |
              | Score<40  |  | 40-74    |  | Score>=75|
              +-----+----+  +-----+----+  +-----+----+
                    |              |              |
                    v              v              v
              +----------+  +----------+  +----------+
              | Auto-     |  | Queue for|  | Generate |
              | Clear     |  | L1 Review|  | Alert    |
              | (Log Only)|  |          |  | (Priority|
              +----------+  +-----+----+  |  HIGH)   |
                                  |       +-----+----+
                                  |             |
                                  v             v
                           +---------------------+
                           | Auto-Assign to       |
                           | Compliance Analyst    |
                           | (Round-robin / skill  |
                           |  based routing)       |
                           +----------+----------+
                                      |
                                      v
                           +---------------------+
                           | Investigate          |
                           | - Review transactions|
                           | - Check customer     |
                           |   history            |
                           | - Verify source of   |
                           |   funds              |
                           | - Network analysis   |
                           | - Contact branch     |
                           +----------+----------+
                                      |
                             +--------+--------+
                             |                 |
                             v                 v
                      +------------+    +------------+
                      | NOT        |    | SUSPICIOUS |
                      | SUSPICIOUS |    |            |
                      +------+-----+    +------+-----+
                             |                 |
                             v                 v
                      +------------+    +---------------------+
                      | Close Case |    | Prepare STR         |
                      | - Document |    | - Evidence package  |
                      |   rationale|    | - FIU-IND format    |
                      | - Evidence |    | - Transaction chain |
                      |   retained |    | - Customer profile  |
                      +------------+    +----------+----------+
                                                   |
                                                   v
                                        +---------------------+
                                        | Compliance Officer   |
                                        | Review & Approve     |
                                        | - Verify evidence    |
                                        | - Approve/Reject STR |
                                        | - Digital signature  |
                                        +----------+----------+
                                                   |
                                          +--------+--------+
                                          |                 |
                                          v                 v
                                   +------------+   +------------+
                                   | REJECTED   |   | APPROVED   |
                                   | (Send back |   |            |
                                   |  to analyst|   +------+-----+
                                   |  for more  |          |
                                   |  evidence) |          v
                                   +------------+   +---------------------+
                                                    | File STR with       |
                                                    | FIU-IND             |
                                                    | - Within 7 days     |
                                                    | - Secure submission |
                                                    | - Get reference #   |
                                                    +----------+----------+
                                                               |
                                                               v
                                                    +---------------------+
                                                    | Close Case with     |
                                                    | Evidence            |
                                                    | - FIU reference     |
                                                    | - All documents     |
                                                    | - Analyst notes     |
                                                    | - Timeline          |
                                                    | - Retain 5 years    |
                                                    +----------+----------+
                                                               |
                                                               v
                                                    +---------------------+
                                                    | Regulatory Report   |
                                                    | - Monthly STR stats |
                                                    | - Quarterly AML     |
                                                    |   effectiveness     |
                                                    | - Annual compliance |
                                                    |   report to Board   |
                                                    +---------------------+


  CTR (Cash Transaction Report) PARALLEL FLOW
  ============================================

  Cash Transaction > INR 10,00,000
            |
            v
  +---------------------+
  | Auto-Generate CTR    |
  | - Customer details   |
  | - Transaction details|
  | - Source of funds     |
  | - Branch details     |
  +----------+----------+
             |
             v
  +---------------------+
  | Queue for Monthly    |
  | Batch Filing         |
  | (Within 15 days of   |
  |  month end)          |
  +----------+----------+
             |
             v
  +---------------------+
  | Submit to FIU-IND    |
  | - Bulk XML upload    |
  | - Acknowledgment     |
  +---------------------+
`}</pre>
    </div>
  );

  const renderSequenceDiagram = () => (
    <div>
      <h2 style={sectionTitle}>Sequence Diagram - Customer Onboarding with KYC + AML Screening</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        End-to-end customer onboarding flow showing KYC verification via UIDAI, CKYC registration, and initial AML screening including sanctions check.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |     SEQUENCE DIAGRAM: CUSTOMER ONBOARDING (KYC + AML SCREENING)         |
  +=========================================================================+

  Customer    Bank App     KYC Engine    UIDAI       CKYC         AML Engine   Sanctions DB  Compliance   FIU-IND
  |           |            |             (Aadhaar)   Registry     |            |             Officer      |
  |           |            |             |           (CERSAI)     |            |             |            |
  |  1. Open  |            |             |           |            |            |             |            |
  |  Account  |            |             |           |            |             |             |            |
  |  Request  |            |             |           |            |            |             |            |
  |---------->|            |             |           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |           | 2. Initiate|             |           |            |            |             |            |
  |           |    KYC     |             |           |            |            |             |            |
  |           |----------->|             |           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |           |            | 3. Request  |           |            |            |             |            |
  |           |            |    OTP      |           |            |            |             |            |
  |           |            |------------>|           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |           |            | 4. OTP Ref  |           |            |            |             |            |
  |           |            |<------------|           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |  5. OTP   |            |             |           |            |            |             |            |
  |  Delivered|            |             |           |            |            |             |            |
  |  (SMS)    |            |             |           |            |            |             |            |
  |<..........|............|.............|           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |  6. Enter |            |             |           |            |            |             |            |
  |  OTP      |            |             |           |            |            |             |            |
  |---------->|            |             |           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |           | 7. Verify  |             |           |            |            |             |            |
  |           |    OTP     |             |           |            |            |             |            |
  |           |----------->|             |           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |           |            | 8. Validate |           |            |            |             |            |
  |           |            |    OTP +    |           |            |            |             |            |
  |           |            |    Fetch    |           |            |            |             |            |
  |           |            |    Demo Data|           |            |            |             |            |
  |           |            |------------>|           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |           |            | 9. Aadhaar  |           |            |            |             |            |
  |           |            |    Details  |           |            |            |             |            |
  |           |            |    (Name,   |           |            |            |             |            |
  |           |            |    DOB,     |           |            |            |             |            |
  |           |            |    Address, |           |            |            |             |            |
  |           |            |    Photo)   |           |            |            |             |            |
  |           |            |<------------|           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |           |            | 10. Upload  |           |            |            |             |            |
  |           |            |     KYC to  |           |            |            |             |            |
  |           |            |     CKYC    |           |            |            |             |            |
  |           |            |-------------|---------->|            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |           |            | 11. CKYC ID |           |            |            |             |            |
  |           |            |     Generated|          |            |            |             |            |
  |           |            |<------------|-----------|            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |           |            | 12. Risk    |           |            |            |             |            |
  |           |            |     Category|           |            |            |             |            |
  |           |            |     Assigned|           |            |            |             |            |
  |           |            |     (Low/   |           |            |            |             |            |
  |           |            |      Med/   |           |            |            |             |            |
  |           |            |      High)  |           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |           |            | 13. Trigger |           |            |            |             |            |
  |           |            |     AML     |           |            |            |             |            |
  |           |            |     Screen  |           |            |            |             |            |
  |           |            |-------------|-----------|----------->|            |             |            |
  |           |            |             |           |            |            |             |            |
  |           |            |             |           |            | 14. Screen |             |            |
  |           |            |             |           |            |     Against|             |            |
  |           |            |             |           |            |     Sancts |             |            |
  |           |            |             |           |            |----------->|             |            |
  |           |            |             |           |            |            |             |            |
  |           |            |             |           |            | 15. Match  |             |            |
  |           |            |             |           |            |     Result |             |            |
  |           |            |             |           |            |     (CLEAR/|             |            |
  |           |            |             |           |            |      HIT)  |             |            |
  |           |            |             |           |            |<-----------|             |            |
  |           |            |             |           |            |            |             |            |
  |           |            |             |           |            | 16. PEP    |             |            |
  |           |            |             |           |            |     Check  |             |            |
  |           |            |             |           |            |----------->|             |            |
  |           |            |             |           |            |<-----------|             |            |
  |           |            |             |           |            |            |             |            |
  |           |            | 17. AML     |           |            |            |             |            |
  |           |            |     Result  |           |            |            |             |            |
  |           |            |     (Clear/ |           |            |            |             |            |
  |           |            |      Alert) |           |            |            |             |            |
  |           |            |<------------|-----------|------------|            |             |            |
  |           |            |             |           |            |            |             |            |
  |           |            |             |           |  [IF SANCTIONS HIT]     |             |            |
  |           |            |             |           |            |            |             |            |
  |           |            |             |           |            | 18. Alert  |             |            |
  |           |            |             |           |            |     to CO  |             |            |
  |           |            |             |           |            |------------|------------>|            |
  |           |            |             |           |            |            |             |            |
  |           |            |             |           |            |            |  19. Review |            |
  |           |            |             |           |            |            |      & Decide            |
  |           |            |             |           |            |            |             |            |
  |           |            |             |           |            |            | 20. If STR  |            |
  |           |            |             |           |            |            |     needed: |            |
  |           |            |             |           |            |            |     File    |            |
  |           |            |             |           |            |            |-------------|----------->|
  |           |            |             |           |            |            |             |            |
  |           |            |             |           |            |            | 21. FIU Ack |            |
  |           |            |             |           |            |            |<------------|------------|
  |           |            |             |           |            |            |             |            |
  |           |  [IF CLEAR - NO HITS]    |           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |           | 22. KYC    |             |           |            |            |             |            |
  |           |     Complete|            |           |            |            |             |            |
  |           |     Account|             |           |            |            |             |            |
  |           |     Created|             |           |            |            |             |            |
  |           |<-----------|             |           |            |            |             |            |
  |           |            |             |           |            |            |             |            |
  |  23.      |            |             |           |            |            |             |            |
  |  Welcome  |            |             |           |            |            |             |            |
  |  (Acc No, |            |             |           |            |            |             |            |
  |   CKYC ID)|            |             |           |            |            |             |            |
  |<----------|            |             |           |            |            |             |            |
  |           |            |             |           |            |            |             |            |


  LEGEND:
  ------>  Synchronous call
  <------  Synchronous response
  <......  Asynchronous notification (SMS/Email)
  [IF...]  Conditional branch
  CO       Compliance Officer
  FIU-IND  Financial Intelligence Unit - India
  CERSAI   Central Registry of Securitisation Asset Reconstruction and Security Interest
  UIDAI    Unique Identification Authority of India
`}</pre>

      <h3 style={sectionTitle}>Key Interaction Summary</h3>
      <div style={gridStyle}>
        {[
          { step:'Steps 1-4', title:'KYC Initiation', desc:'Customer submits account opening request. Bank app initiates KYC with KYC Engine, which requests OTP from UIDAI Aadhaar gateway.', color:C.accent },
          { step:'Steps 5-9', title:'Aadhaar eKYC Verification', desc:'Customer receives OTP via SMS, enters it. KYC Engine validates OTP with UIDAI and fetches demographic data (name, DOB, address, photo).', color:C.info },
          { step:'Steps 10-12', title:'CKYC Registration', desc:'KYC data uploaded to CKYC Registry (CERSAI). CKYC ID generated. Risk category assigned based on customer profile and transaction intent.', color:C.success },
          { step:'Steps 13-17', title:'AML Screening', desc:'AML Engine performs initial screening: sanctions check against OFAC/UN/EU/MHA lists, PEP check against global databases. Results returned to KYC Engine.', color:C.warn },
          { step:'Steps 18-21', title:'Alert Handling (If Hit)', desc:'If sanctions hit or PEP match found, compliance officer notified. Investigation initiated. If suspicious, STR filed with FIU-IND within 7 days.', color:C.danger },
          { step:'Steps 22-23', title:'Account Opening', desc:'If AML screening is clear, account is created with KYC linked. Customer receives account number, CKYC ID, and welcome communication.', color:C.accent }
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
            Compliance & Regulatory Testing Architecture
          </h1>
          <p style={{ color:C.muted, fontSize:15, lineHeight:1.6 }}>
            KYC/AML | PCI-DSS | GDPR | SOX | RBI Norms | BASEL III - Banking QA Testing Dashboard
          </p>
          <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
            {badge(C.accent, 'KYC/eKYC')}{badge(C.warn, 'AML/CFT')}{badge(C.danger, 'Sanctions')}{badge(C.info, 'PCI-DSS v4.0')}{badge(C.success, 'GDPR/DPDP')}{badge(C.warn, 'SOX 302/404')}{badge(C.accent, 'RBI Norms')}{badge(C.info, 'BASEL III')}
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
          Compliance & Regulatory Testing Architecture | Banking QA Dashboard | RBI | PMLA | PCI-DSS | GDPR | SOX | BASEL III
        </div>
      </div>
    </div>
  );
}

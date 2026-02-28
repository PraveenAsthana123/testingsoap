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

export default function MainframeBankingArch() {
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
      <h2 style={sectionTitle}>Mainframe Banking Platform Architecture</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Enterprise mainframe banking architecture for Indian banks (SBI/HDFC/ICICI style) covering COBOL core banking, CICS online transactions, DB2 data management, JCL batch processing, IMS transaction management, and VSAM file storage on IBM z/OS platform.
      </p>

      <pre style={preStyle}>{`
+===================================================================================+
|              MAINFRAME BANKING TESTING PLATFORM - z/OS ARCHITECTURE                |
|                     Banking QA Architecture Overview                               |
+===================================================================================+

  CHANNELS                     CHANNEL INTEGRATION              z/OS MAINFRAME
  ========                     ===================              ==============

  +-----------------+       +------------------------+
  | ATM Network     |------>| IBM MQ                 |       +==============================+
  | (NCR/Diebold)   |       | (Message Queuing)      |       |        z/OS LPAR             |
  +-----------------+       +--------+---------------+       |   (Production Sysplex)       |
                                     |                        |                              |
  +-----------------+       +--------v---------------+       |  CICS REGION (Online)        |
  | Branch 3270     |------>| CICS Transaction       |       |  =======================     |
  | Terminals       |       | Gateway (CTG)          |------>|  +---------------------+     |
  +-----------------+       +--------+---------------+       |  | Account Inquiry     |     |
                                     |                        |  | (ACCTINQ - COBOL)   |     |
  +-----------------+       +--------v---------------+       |  +---------------------+     |
  | Internet        |------>| z/OS Connect EE        |       |  | Fund Transfer       |     |
  | Banking         |       | (RESTful APIs)         |------>|  | (FUNDXFR - COBOL)   |     |
  +-----------------+       +--------+---------------+       |  +---------------------+     |
                                     |                        |  | Bill Payment        |     |
  +-----------------+       +--------v---------------+       |  | (BILLPAY - COBOL)   |     |
  | Mobile Banking  |------>| Connect:Direct         |       |  +---------------------+     |
  | (UPI/IMPS)      |       | (File Transfer)        |       |  | Loan Processing     |     |
  +-----------------+       +------------------------+       |  | (LOANPRC - COBOL)   |     |
                                                              |  +---------------------+     |
                                                              |                              |
  MIDDLEWARE                                                  |  BATCH REGION (JCL)          |
  ==========                                                  |  =======================     |
                                                              |  +---------------------+     |
  +-----------------+     +-------------------+              |  | EOD Interest Calc   |     |
  | IBM MQ Series   |     | WLM (Workload     |              |  | (INTCALC JCL)       |     |
  | (Msg Routing)   |     |  Manager)          |              |  +---------------------+     |
  +-----------------+     +-------------------+              |  | Statement Gen       |     |
                                                              |  | (STMTGEN JCL)       |     |
  +-----------------+     +-------------------+              |  +---------------------+     |
  | CTG (CICS       |     | Sysplex           |              |  | GL Posting          |     |
  |  Transaction    |     | Distributor       |              |  | (GLPOST JCL)        |     |
  |  Gateway)       |     +-------------------+              |  +---------------------+     |
  +-----------------+                                         |  | Reconciliation      |     |
                                                              |  | (RECONC JCL)        |     |
  +-----------------+     +-------------------+              |  +---------------------+     |
  | z/OS Connect EE |     | LPAR Config       |              |  | NPA Classification  |     |
  | (API Gateway)   |     | (Prod/Test/DR)    |              |  | (NPACLS JCL)        |     |
  +-----------------+     +-------------------+              |  +---------------------+     |
                                                              |                              |
                                                              |  DB2 SUBSYSTEM               |
                                                              |  =======================     |
                                                              |  +---------------------+     |
                                                              |  | Account Master      |     |
                                                              |  | Transaction Log     |     |
                                                              |  | Customer Master     |     |
                                                              |  | GL Tables           |     |
                                                              |  | Loan Tables         |     |
                                                              |  +---------------------+     |
                                                              |                              |
                                                              |  IMS / VSAM                  |
                                                              |  =======================     |
                                                              |  +---------------------+     |
                                                              |  | IMS/TM (Txn Mgmt)  |     |
                                                              |  | VSAM KSDS (Cust Idx)|     |
                                                              |  | VSAM ESDS (Rate Tbl)|     |
                                                              |  | VSAM RRDS (Seq Data)|     |
                                                              |  +---------------------+     |
                                                              +==============================+
`}</pre>

      <h3 style={sectionTitle}>Module Overview</h3>
      <div style={gridStyle}>
        {[
          { title:'CICS Online Transactions', desc:'Real-time transaction processing via CICS TS regions. Handles account inquiry, fund transfers, bill payments, and loan disbursements through 3270 terminal interface and CTG for distributed clients.', reg:'CICS TS v5.6 / v6.1', color:C.accent },
          { title:'COBOL Business Logic', desc:'Core banking business logic in COBOL programs covering interest calculation, balance management, loan EMI computation, NPA classification (90/180/360 days), and GL posting as per RBI guidelines.', reg:'Enterprise COBOL v6.4', color:C.warn },
          { title:'JCL Batch Processing', desc:'End-of-day (EOD) and beginning-of-day (BOD) batch jobs for interest calculation, statement generation, GL posting, reconciliation, NPA classification, and regulatory reporting via TWS/OPC scheduling.', reg:'JES2 / TWS / CA-7', color:C.danger },
          { title:'DB2 Data Management', desc:'Relational data storage for Account Master, Transaction Log, Customer Master, GL Tables, and Loan Tables. Supports data sharing across Sysplex with referential integrity and ACID compliance.', reg:'DB2 v13 for z/OS', color:C.info },
          { title:'IMS Transaction Manager', desc:'High-performance transaction processing for legacy banking functions. IMS/TM handles message queuing and transaction routing for batch and online workloads with sub-second response.', reg:'IMS v15.3', color:C.success },
          { title:'VSAM File Storage', desc:'Virtual Storage Access Method for indexed sequential files. KSDS for customer index, ESDS for rate tables and historical data, RRDS for sequential batch processing data.', reg:'DFSMS / IDCAMS', color:C.warn },
          { title:'IBM MQ Integration', desc:'Message queuing between mainframe and distributed systems. Handles ATM transactions, internet banking requests, UPI/IMPS routing, and inter-bank NEFT/RTGS message flow via IBM MQ for z/OS.', reg:'IBM MQ v9.3 z/OS', color:C.accent },
          { title:'z/OS Connect EE', desc:'RESTful API enablement for COBOL/CICS programs without code changes. Exposes mainframe services as OpenAPI-compliant REST APIs for mobile banking, internet banking, and fintech integration.', reg:'z/OS Connect EE v3.0', color:C.info }
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
        Mainframe Banking Testing Framework for Indian Banks - Business Requirements covering COBOL business logic validation, CICS online transaction testing, JCL batch job verification, DB2 data integrity, IMS transaction management, and VSAM file operations.
      </p>

      <h3 style={subTitle}>Objectives</h3>
      <div style={cardStyle}>
        <ul style={{ color:C.text, lineHeight:2, paddingLeft:20 }}>
          <li>Ensure <strong style={{ color:C.accent }}>COBOL business logic correctness</strong> for all core banking calculations (interest, EMI, NPA, GL posting)</li>
          <li>Validate <strong style={{ color:C.accent }}>JCL batch jobs</strong> for EOD/BOD processing within defined batch windows (4-hour SLA)</li>
          <li>Test <strong style={{ color:C.warn }}>CICS transaction performance</strong> with sub-second response time under peak load (5000 concurrent users)</li>
          <li>Verify <strong style={{ color:C.danger }}>DB2 data integrity</strong> across Account Master, Transaction Log, and GL Tables with zero data loss</li>
          <li>Validate <strong style={{ color:C.info }}>batch window optimization</strong> to complete EOD within 4 hours for 50M+ accounts</li>
          <li>Test <strong style={{ color:C.success }}>abend handling and recovery</strong> for all critical batch jobs and CICS transactions</li>
        </ul>
      </div>

      <h3 style={sectionTitle}>Scope by Banking Domain</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Domain</th>
            <th style={thStyle}>Scope Areas</th>
            <th style={thStyle}>Key Components</th>
            <th style={thStyle}>Test Focus</th>
          </tr>
        </thead>
        <tbody>
          {[
            { domain:'Core Banking (Savings/Current/FD/RD)', scope:'Account opening, balance inquiry, fund transfer, interest calculation, statement generation, account closure, dormant account handling', comp:'COBOL: ACCTINQ, FUNDXFR, INTCALC, STMTGEN; CICS maps: ACCTMAP, XFRMAP; DB2: ACCOUNT_MASTER, TRANSACTION_LOG', focus:'COBOL unit testing, CICS 3270 screen testing, DB2 CRUD operations, batch interest calculation accuracy' },
            { domain:'Loan Management (Home/Personal/Vehicle)', scope:'Loan disbursement, EMI calculation, repayment processing, prepayment, NPA classification (90/180/360 days), loan restructuring, write-off', comp:'COBOL: LOANPRC, EMICALC, NPACLS; JCL: LOANDAY, NPARUN; DB2: LOAN_MASTER, EMI_SCHEDULE, NPA_HISTORY', focus:'EMI calculation accuracy (reducing balance), NPA classification as per RBI IRAC norms, provisioning calculation' },
            { domain:'Trade Finance (LC/BG)', scope:'Letter of Credit issuance, Bank Guarantee processing, amendment, advising, negotiation, settlement, SWIFT messaging (MT700/MT760)', comp:'COBOL: LCPROC, BGPROC, SWFTMSG; CICS: TRDEFIN; DB2: LC_MASTER, BG_MASTER, SWIFT_LOG; MQ: SWIFT.QUEUE', focus:'LC lifecycle testing, SWIFT message format validation, BG expiry processing, margin calculation' },
            { domain:'Treasury Operations', scope:'Forex dealing, money market, government securities, investment portfolio, mark-to-market, P&L calculation, SLR/CRR maintenance', comp:'COBOL: FXDEAL, GSECPROC, MTMCALC; JCL: TREASDAY; DB2: DEAL_MASTER, PORTFOLIO, MTM_RATES', focus:'Deal capture accuracy, MTM valuation, SLR/CRR compliance (RBI), forex revaluation' },
            { domain:'GL & Reporting', scope:'General Ledger posting, trial balance, profit & loss, balance sheet, regulatory returns (RBI), CRILC reporting, statutory audit support', comp:'COBOL: GLPOST, TBALGEN, PLGEN; JCL: GLEOD, REGRET; DB2: GL_MASTER, GL_TRANSACTIONS, REPORTING_EXTRACT', focus:'GL balancing (debits = credits), regulatory report accuracy, inter-branch reconciliation' },
            { domain:'Batch Processing (EOD/BOD)', scope:'End-of-day interest calculation, statement generation, GL posting, reconciliation, NPA run, regulatory extract, standing instructions, auto-sweep', comp:'JCL: EODMAIN, BODMAIN, INTCALC, STMTGEN, GLPOST, RECONJOB, NPARUN, SIPROC; TWS/OPC scheduling', focus:'Batch window optimization, job dependency chain, restart/recovery, abend handling, checkpoint processing' }
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:600, minWidth:160 }}>{r.domain}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.scope}</td>
              <td style={{ ...tdStyle, fontSize:12, fontFamily:'monospace', color:C.editorText }}>{r.comp}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.focus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={sectionTitle}>Non-Functional Requirements (NFRs)</h3>
      <div style={gridStyle}>
        {[
          { title:'CICS Response Time', value:'< 1 sec', desc:'All CICS online transactions (account inquiry, fund transfer, bill payment) must respond within 1 second at P99 under peak load of 5000 concurrent 3270 sessions.', color:C.danger },
          { title:'Batch Window', value:'4 hours', desc:'Complete EOD batch processing for 50M+ accounts including interest calculation, GL posting, reconciliation, and statement generation within 4-hour batch window.', color:C.warn },
          { title:'DB2 Availability', value:'99.999%', desc:'DB2 data sharing group must maintain 99.999% availability across Sysplex. Zero data loss for committed transactions with ACID compliance.', color:C.info },
          { title:'MIPS Optimization', value:'< 5% growth', desc:'Annual MIPS consumption growth must remain below 5%. COBOL programs and JCL jobs must be optimized for CPU efficiency per RBI cost guidelines.', color:C.danger },
          { title:'Batch Restart/Recovery', value:'< 15 min', desc:'Any failed batch job must be restartable from last checkpoint within 15 minutes. Automatic notification to operations team on ABEND with diagnostic data.', color:C.success },
          { title:'Data Retention', value:'7 years', desc:'Transaction history retention for 7 years per RBI mandate. Archival to VSAM/tape for data older than 2 years. Online access for last 6 months.', color:C.accent }
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
        High-level mainframe banking architecture showing z/OS LPAR layout, CICS region topology, DB2 data sharing, batch scheduling, and mainframe-to-cloud integration path.
      </p>

      <pre style={preStyle}>{`
+===================================================================================+
|                    HIGH-LEVEL MAINFRAME ARCHITECTURE                               |
+===================================================================================+

  z/OS LPAR LAYOUT (Parallel Sysplex)
  ====================================

  +---------------------------+  +---------------------------+  +---------------------------+
  | LPAR: PRODUCTION (PROD)   |  | LPAR: TEST / UAT          |  | LPAR: DISASTER RECOVERY   |
  | z15 / z16 Processor       |  | z15 / z16 Processor       |  | z15 / z16 Processor       |
  |                           |  |                           |  |                           |
  | CICS Regions:             |  | CICS Regions:             |  | CICS Regions:             |
  | +-------+ +-------+      |  | +-------+ +-------+      |  | +-------+ +-------+      |
  | | TOR   | | TOR   |      |  | | TOR   | | TOR   |      |  | | TOR   | | TOR   |      |
  | | (Term | | (Term |      |  | | (Test | | (UAT  |      |  | | (DR   | | (DR   |      |
  | |  Own) | |  Own) |      |  | |  Rgn) | |  Rgn) |      |  | |  Rgn) | |  Rgn) |      |
  | +---+---+ +---+---+      |  | +---+---+ +---+---+      |  | +---+---+ +---+---+      |
  |     |         |           |  |     |         |           |  |     |         |           |
  | +---v---+ +---v---+      |  | +---v---+ +---v---+      |  | +---v---+ +---v---+      |
  | | AOR1  | | AOR2  |      |  | | AOR-T | | AOR-U |      |  | | AOR-D | | AOR-D |      |
  | | (Appl | | (Appl |      |  | | (Test)| | (UAT) |      |  | | (DR1) | | (DR2) |      |
  | |  Own) | |  Own) |      |  | +-------+ +-------+      |  | +-------+ +-------+      |
  | +-------+ +-------+      |  |                           |  |                           |
  | +-------+                |  | +-------+                |  | +-------+                |
  | | FOR   |                |  | | FOR-T |                |  | | FOR-D |                |
  | | (File |                |  | | (File |                |  | | (File |                |
  | |  Own) |                |  | |  Own) |                |  | |  Own) |                |
  | +-------+                |  | +-------+                |  | +-------+                |
  |                           |  |                           |  |                           |
  | DB2 Subsystem:            |  | DB2 Subsystem:            |  | DB2 Subsystem:            |
  | +---------------------+  |  | +---------------------+  |  | +---------------------+  |
  | | DB2 PROD (Data      |  |  | | DB2 TEST (Isolated  |  |  | | DB2 DR (Replicated  |  |
  | |  Sharing Group)     |  |  | |  Test Data)         |  |  | |  via GDPS)          |  |
  | +---------------------+  |  | +---------------------+  |  | +---------------------+  |
  |                           |  |                           |  |                           |
  | Batch (JES2):             |  | Batch (JES2):             |  | Batch (JES2):             |
  | +---------------------+  |  | +---------------------+  |  | +---------------------+  |
  | | TWS/OPC Scheduler   |  |  | | TWS Test Scheduler  |  |  | | TWS DR Scheduler    |  |
  | | EOD/BOD Jobs        |  |  | | Test Job Streams    |  |  | | DR Job Streams      |  |
  | +---------------------+  |  | +---------------------+  |  | +---------------------+  |
  +---------------------------+  +---------------------------+  +---------------------------+


  BATCH SCHEDULING (TWS/OPC)
  ===========================

  BOD (Beginning of Day)              EOD (End of Day)
  +-------------------+               +-------------------+
  | 06:00 Unlock Txns |               | 20:00 Lock Txns   |
  | 06:05 Rate Update |               | 20:05 Extract Txns|
  | 06:10 SI Process  |               | 20:15 Interest Calc|
  | 06:30 BOD GL Post |               | 20:45 GL Posting  |
  | 07:00 Open Online |               | 21:15 Reconcile   |
  +-------------------+               | 21:45 NPA Run     |
                                       | 22:15 Stmt Gen    |
                                       | 22:45 Reg Extract |
                                       | 23:15 Archival    |
                                       | 23:45 Backup      |
                                       | 00:00 BOD Prep    |
                                       +-------------------+


  MAINFRAME-TO-CLOUD INTEGRATION
  ===============================

  +-------------+     +----------------+     +------------------+     +----------------+
  | COBOL/CICS  |---->| z/OS Connect   |---->| API Gateway      |---->| Microservices  |
  | Programs    |     | EE (REST API)  |     | (Kong/Apigee)    |     | (Cloud Native) |
  +-------------+     +----------------+     +------------------+     +----------------+
                                                                            |
  +-------------+     +----------------+     +------------------+          |
  | IBM MQ      |---->| MQ Internet    |---->| Event Bus        |<---------+
  | (z/OS)      |     | Gateway        |     | (Kafka)          |
  +-------------+     +----------------+     +------------------+


  MONITORING & SECURITY
  ======================

  +-------------+  +-------------+  +-------------+  +-------------+
  | OMEGAMON    |  | RMF         |  | SMF Records |  | RACF        |
  | (Real-time  |  | (Resource   |  | (Accounting |  | (Security)  |
  |  Monitoring)|  |  Measurement)|  |  & Audit)   |  |             |
  +-------------+  +-------------+  +-------------+  +-------------+
`}</pre>
    </div>
  );
  const renderLLD = () => (
    <div>
      <h2 style={sectionTitle}>Low-Level Design (LLD)</h2>

      <h3 style={subTitle}>COBOL Program Structure (All 4 Divisions)</h3>
      <pre style={preStyle}>{`
  COBOL PROGRAM: FUNDXFR (Fund Transfer)
  ========================================

  IDENTIFICATION DIVISION.
    PROGRAM-ID.    FUNDXFR.
    AUTHOR.        CORE-BANKING-TEAM.
    DATE-WRITTEN.  2024-01-15.
    REMARKS.       Fund Transfer between accounts via CICS.

  ENVIRONMENT DIVISION.
    CONFIGURATION SECTION.
      SOURCE-COMPUTER.  IBM-Z15.
      OBJECT-COMPUTER.  IBM-Z15.
    INPUT-OUTPUT SECTION.
      FILE-CONTROL.
        SELECT RATE-FILE ASSIGN TO RATEFILE
          ORGANIZATION IS INDEXED
          ACCESS MODE IS RANDOM
          RECORD KEY IS RATE-KEY
          FILE STATUS IS WS-FILE-STATUS.

  DATA DIVISION.
    WORKING-STORAGE SECTION.
      01 WS-DEBIT-ACCT        PIC X(16).
      01 WS-CREDIT-ACCT       PIC X(16).
      01 WS-TRANSFER-AMT      PIC 9(13)V99.
      01 WS-DEBIT-BAL         PIC S9(13)V99 COMP-3.
      01 WS-CREDIT-BAL        PIC S9(13)V99 COMP-3.
      01 WS-SQLCODE            PIC S9(09) COMP.
      01 WS-TIMESTAMP          PIC X(26).
      01 WS-TXN-REF            PIC X(20).
      01 WS-FILE-STATUS        PIC XX.
      01 WS-RESP-CODE          PIC S9(08) COMP.
      01 WS-RESP2-CODE         PIC S9(08) COMP.

      COPY ACCTCOPY.
      COPY TXNLCOPY.

      EXEC SQL INCLUDE SQLCA END-EXEC.

    LINKAGE SECTION.
      01 DFHCOMMAREA.
        05 LS-FUNCTION         PIC X(04).
        05 LS-DEBIT-ACCT       PIC X(16).
        05 LS-CREDIT-ACCT      PIC X(16).
        05 LS-AMOUNT            PIC 9(13)V99.
        05 LS-RETURN-CODE       PIC S9(04) COMP.
        05 LS-ERROR-MSG         PIC X(80).

  PROCEDURE DIVISION.
    MAIN-LOGIC.
      PERFORM VALIDATE-INPUT
      PERFORM DEBIT-ACCOUNT
      PERFORM CREDIT-ACCOUNT
      PERFORM LOG-TRANSACTION
      PERFORM SEND-MQ-NOTIFICATION
      EXEC CICS RETURN END-EXEC
      STOP RUN.

    VALIDATE-INPUT.
      IF LS-AMOUNT <= ZERO
        MOVE -1 TO LS-RETURN-CODE
        MOVE 'INVALID TRANSFER AMOUNT' TO LS-ERROR-MSG
        EXEC CICS RETURN END-EXEC
      END-IF.

    DEBIT-ACCOUNT.
      EXEC SQL
        SELECT CURRENT_BALANCE INTO :WS-DEBIT-BAL
        FROM ACCOUNT_MASTER
        WHERE ACCOUNT_NO = :LS-DEBIT-ACCT
        FOR UPDATE OF CURRENT_BALANCE
      END-EXEC.
      IF WS-DEBIT-BAL < LS-AMOUNT
        MOVE -2 TO LS-RETURN-CODE
        MOVE 'INSUFFICIENT BALANCE' TO LS-ERROR-MSG
        EXEC CICS RETURN END-EXEC
      END-IF.
      EXEC SQL
        UPDATE ACCOUNT_MASTER
        SET CURRENT_BALANCE = CURRENT_BALANCE - :LS-AMOUNT,
            LAST_TXN_DATE = CURRENT TIMESTAMP
        WHERE ACCOUNT_NO = :LS-DEBIT-ACCT
      END-EXEC.

    CREDIT-ACCOUNT.
      EXEC SQL
        UPDATE ACCOUNT_MASTER
        SET CURRENT_BALANCE = CURRENT_BALANCE + :LS-AMOUNT,
            LAST_TXN_DATE = CURRENT TIMESTAMP
        WHERE ACCOUNT_NO = :LS-CREDIT-ACCT
      END-EXEC.

    LOG-TRANSACTION.
      EXEC SQL
        INSERT INTO TRANSACTION_LOG
          (TXN_REF, DEBIT_ACCT, CREDIT_ACCT,
           TXN_AMOUNT, TXN_TYPE, TXN_TIMESTAMP)
        VALUES
          (:WS-TXN-REF, :LS-DEBIT-ACCT, :LS-CREDIT-ACCT,
           :LS-AMOUNT, 'TRANSFER', CURRENT TIMESTAMP)
      END-EXEC.
      EXEC SQL COMMIT END-EXEC.

    SEND-MQ-NOTIFICATION.
      EXEC CICS WRITEQ TS
        QUEUE('FUNDXFR.NOTIFY')
        FROM(WS-TXN-REF)
        LENGTH(20)
        RESP(WS-RESP-CODE)
      END-EXEC.
`}</pre>

      <h3 style={sectionTitle}>COPY Book Layouts</h3>
      <pre style={preStyle}>{`
  COPYBOOK: ACCTCOPY (Account Record Layout)
  =============================================
      01 ACCT-RECORD.
        05 ACCT-NUMBER          PIC X(16).
        05 ACCT-TYPE            PIC X(02).
           88 ACCT-SAVINGS      VALUE 'SA'.
           88 ACCT-CURRENT      VALUE 'CA'.
           88 ACCT-FD            VALUE 'FD'.
           88 ACCT-RD            VALUE 'RD'.
        05 ACCT-CUST-ID         PIC X(10).
        05 ACCT-BRANCH          PIC X(06).
        05 ACCT-BALANCE         PIC S9(13)V99 COMP-3.
        05 ACCT-OPEN-DATE       PIC X(10).
        05 ACCT-STATUS          PIC X(01).
           88 ACCT-ACTIVE       VALUE 'A'.
           88 ACCT-DORMANT      VALUE 'D'.
           88 ACCT-CLOSED       VALUE 'C'.
           88 ACCT-FROZEN       VALUE 'F'.
        05 ACCT-INTEREST-RATE   PIC 9(02)V9(04).
        05 ACCT-LAST-TXN-DATE   PIC X(10).
        05 ACCT-NPA-FLAG        PIC X(01).
        05 ACCT-NPA-DAYS        PIC 9(04).

  COPYBOOK: TXNLCOPY (Transaction Log Layout)
  =============================================
      01 TXN-RECORD.
        05 TXN-REF              PIC X(20).
        05 TXN-DEBIT-ACCT      PIC X(16).
        05 TXN-CREDIT-ACCT     PIC X(16).
        05 TXN-AMOUNT           PIC S9(13)V99 COMP-3.
        05 TXN-TYPE             PIC X(10).
           88 TXN-TRANSFER      VALUE 'TRANSFER  '.
           88 TXN-DEPOSIT       VALUE 'DEPOSIT   '.
           88 TXN-WITHDRAWAL    VALUE 'WITHDRAWAL'.
           88 TXN-INTEREST      VALUE 'INTEREST  '.
        05 TXN-CHANNEL          PIC X(03).
           88 TXN-BRANCH        VALUE 'BRN'.
           88 TXN-ATM            VALUE 'ATM'.
           88 TXN-NET            VALUE 'NET'.
           88 TXN-MOB            VALUE 'MOB'.
        05 TXN-TIMESTAMP        PIC X(26).
        05 TXN-STATUS           PIC X(01).
`}</pre>

      <h3 style={sectionTitle}>CICS Commands Reference</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>CICS Command</th>
            <th style={thStyle}>Purpose</th>
            <th style={thStyle}>Example</th>
          </tr>
        </thead>
        <tbody>
          {[
            { cmd:'SEND MAP', purpose:'Display BMS map on 3270 terminal', ex:'EXEC CICS SEND MAP("ACCTMAP") MAPSET("ACCTSET") ERASE END-EXEC' },
            { cmd:'RECEIVE MAP', purpose:'Receive input from 3270 terminal', ex:'EXEC CICS RECEIVE MAP("ACCTMAP") MAPSET("ACCTSET") INTO(ACCT-MAP-DATA) END-EXEC' },
            { cmd:'READ FILE', purpose:'Read VSAM record by key', ex:'EXEC CICS READ FILE("CUSTFILE") INTO(CUST-RECORD) RIDFLD(CUST-KEY) END-EXEC' },
            { cmd:'WRITE FILE', purpose:'Write new VSAM record', ex:'EXEC CICS WRITE FILE("CUSTFILE") FROM(CUST-RECORD) RIDFLD(CUST-KEY) END-EXEC' },
            { cmd:'LINK', purpose:'Call another CICS program (return)', ex:'EXEC CICS LINK PROGRAM("INTCALC") COMMAREA(WS-COMM) LENGTH(256) END-EXEC' },
            { cmd:'XCTL', purpose:'Transfer control (no return)', ex:'EXEC CICS XCTL PROGRAM("MENUPRG") COMMAREA(WS-COMM) END-EXEC' },
            { cmd:'SYNCPOINT', purpose:'Commit all recoverable changes', ex:'EXEC CICS SYNCPOINT END-EXEC' },
            { cmd:'HANDLE ABEND', purpose:'Define abend handling routine', ex:'EXEC CICS HANDLE ABEND PROGRAM("ABNDHAND") END-EXEC' }
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:600, fontFamily:'monospace' }}>{r.cmd}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.purpose}</td>
              <td style={{ ...tdStyle, fontSize:11, fontFamily:'monospace', color:C.editorText }}>{r.ex}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={sectionTitle}>JCL Structure</h3>
      <pre style={preStyle}>{`
  JCL: EODINTCALC (EOD Interest Calculation)
  =============================================

  //EODINTCL JOB (ACCT,BANKING),'EOD INTEREST CALC',
  //         CLASS=A,MSGCLASS=X,MSGLEVEL=(1,1),
  //         NOTIFY=&SYSUID,REGION=0M,
  //         RESTART=STEP020
  //*
  //* ============================================
  //* EOD INTEREST CALCULATION - DAILY BATCH
  //* RUN TIME: 20:15 IST (TWS TRIGGERED)
  //* ============================================
  //*
  //STEP010  EXEC PGM=IKJEFT01,COND=(0,NE)
  //SYSTSPRT DD SYSOUT=*
  //SYSTSIN  DD *
    DSN SYSTEM(DB2P)
    RUN PROGRAM(DSNUPROC) -
    PLAN(INTCPLAN) -
    LIB('BANK.PROD.LOADLIB')
  /*
  //*
  //STEP020  EXEC PGM=INTCALC,COND=(0,NE)
  //STEPLIB  DD DSN=BANK.PROD.LOADLIB,DISP=SHR
  //RATEFILE DD DSN=BANK.PROD.VSAM.RATES,DISP=SHR
  //ACCTFILE DD DSN=BANK.PROD.VSAM.ACCOUNTS,DISP=SHR
  //SYSOUT   DD SYSOUT=*
  //SYSPRINT DD SYSOUT=*
  //CHKPOINT DD DSN=BANK.PROD.CHKPOINT.INTCALC,
  //            DISP=(NEW,CATLG,CATLG),
  //            SPACE=(CYL,(10,5),RLSE)
  //*
  //STEP030  EXEC PGM=GLPOST,COND=(0,NE)
  //STEPLIB  DD DSN=BANK.PROD.LOADLIB,DISP=SHR
  //GLINPUT  DD DSN=BANK.PROD.INTCALC.OUTPUT,DISP=SHR
  //SYSOUT   DD SYSOUT=*
  //*
  //STEP040  EXEC PGM=IEFBR14,COND=(0,NE)
  //* CLEANUP STEP
`}</pre>

      <h3 style={sectionTitle}>Common Abend Codes</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Abend Code</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Meaning</th>
            <th style={thStyle}>Common Cause</th>
            <th style={thStyle}>Resolution</th>
          </tr>
        </thead>
        <tbody>
          {[
            { code:'S0C7', type:'System', meaning:'Data Exception', cause:'Non-numeric data in numeric field, uninitialized COMP-3 field, invalid packed decimal', fix:'Check COBOL data definitions, initialize working storage, validate input data before arithmetic' },
            { code:'S0C4', type:'System', meaning:'Protection Exception', cause:'Accessing memory outside program bounds, invalid pointer, subscript out of range', fix:'Check table subscripts, OCCURS DEPENDING ON limits, pointer arithmetic, BLL cells' },
            { code:'S0C1', type:'System', meaning:'Operation Exception', cause:'Invalid instruction, branching to data area, corrupted program load module', fix:'Recompile COBOL program, check CALL statements, verify load library concatenation' },
            { code:'S222', type:'System', meaning:'Job Cancelled by Operator', cause:'Operator cancelled job, exceeded time limit, resource contention', fix:'Check with operations team, verify JOB TIME parameter, check for deadlocks' },
            { code:'S322', type:'System', meaning:'CPU Time Exceeded', cause:'Infinite loop in COBOL, insufficient TIME parameter, inefficient SQL', fix:'Review PERFORM UNTIL logic, increase TIME parameter, optimize DB2 SQL with EXPLAIN' },
            { code:'S806', type:'System', meaning:'Module Not Found', cause:'Missing load module in STEPLIB/JOBLIB, incorrect program name in CALL/LINK', fix:'Verify STEPLIB DD, check program name spelling, ensure module is linked into load library' },
            { code:'S913', type:'System', meaning:'RACF Security Violation', cause:'Insufficient authority to access dataset or resource', fix:'Request RACF access via security team, check dataset profile, verify user ID authorization' },
            { code:'ASRA', type:'CICS', meaning:'Program Check', cause:'Equivalent of S0C7/S0C4 in CICS environment, data exception in CICS program', fix:'Check CICS transaction dump, review COBOL data divisions, verify COMMAREA mapping' }
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.danger, fontWeight:700, fontFamily:'monospace', fontSize:15 }}>{r.code}</td>
              <td style={tdStyle}>{badge(r.type === 'System' ? C.warn : C.info, r.type)}</td>
              <td style={{ ...tdStyle, color:C.header, fontWeight:600 }}>{r.meaning}</td>
              <td style={{ ...tdStyle, fontSize:12 }}>{r.cause}</td>
              <td style={{ ...tdStyle, fontSize:12 }}>{r.fix}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  const renderScenarios = () => (
    <div>
      <h2 style={sectionTitle}>Mainframe Banking Testing Scenarios</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 comprehensive test scenarios covering COBOL business logic, CICS transactions, JCL batch processing, DB2 data integrity, VSAM operations, and mainframe integration for Indian banking.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width:50 }}>#</th>
            <th style={thStyle}>Scenario</th>
            <th style={thStyle}>Component</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Expected Outcome</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id:'S01', title:'COBOL Account Balance Inquiry via CICS', comp:'COBOL/CICS', desc:'User enters account number on 3270 ACCTINQ screen. CICS RECEIVE MAP captures input, COBOL program reads ACCOUNT_MASTER via DB2 SELECT, formats balance with INR currency, SEND MAP displays result.', outcome:'Account details displayed within 1 second. Balance formatted as INR with comma separators. Invalid account returns error map with ACCT NOT FOUND message.' },
            { id:'S02', title:'Fund Transfer with DB2 Commit', comp:'COBOL/DB2', desc:'FUNDXFR program debits source account and credits target account in single DB2 unit of work. Both updates must succeed or both must rollback. COMMIT issued only after both UPDATE statements complete.', outcome:'Source balance decreased, target balance increased by exact amount. Single TRANSACTION_LOG entry created. DB2 COMMIT successful. On failure, ROLLBACK restores both balances.' },
            { id:'S03', title:'EOD Interest Calculation Batch', comp:'JCL/COBOL', desc:'INTCALC JCL job reads all savings accounts, applies daily interest rate (annual rate / 365), calculates interest on minimum balance between 10th and end of month (RBI rule), posts to accrued interest.', outcome:'Interest calculated for all 50M+ accounts within batch window. Accrued interest matches manual calculation. GL entry created: DR Interest Expense, CR Interest Payable.' },
            { id:'S04', title:'EOD GL Posting and Balancing', comp:'JCL/DB2', desc:'GLPOST batch job aggregates all day transactions by GL code, creates debit and credit entries in GL_TRANSACTIONS table. Trial balance validation ensures total debits equal total credits.', outcome:'GL entries balanced (total DR = total CR). Zero out-of-balance condition. Branch-wise P&L generated. Reconciliation report produced with zero exceptions.' },
            { id:'S05', title:'Statement Generation Batch', comp:'JCL/COBOL', desc:'STMTGEN processes month-end statement for all active accounts. Extracts transactions from TRANSACTION_LOG for the month, formats statement with opening balance, transactions, closing balance, interest.', outcome:'Statements generated for all active accounts. PDF/print output formatted correctly. Closing balance matches ACCOUNT_MASTER. Interest summary matches accrual records.' },
            { id:'S06', title:'NPA Classification (90/180/360 Day)', comp:'JCL/COBOL/DB2', desc:'NPACLS batch classifies loan accounts per RBI IRAC norms. Sub-standard (90 days overdue), Doubtful (180 days), Loss (360 days). Calculates provisioning requirement based on classification.', outcome:'Loans classified correctly per days-past-due. SMA-0 (30 days), SMA-1 (60 days), SMA-2 (90 days) flagged. Provisioning: Sub-std 15%, Doubtful 25-100%, Loss 100%.' },
            { id:'S07', title:'Fixed Deposit Maturity Processing', comp:'JCL/COBOL', desc:'FD maturity batch identifies FDs maturing today, calculates maturity amount with compound interest, auto-renews if instruction set, transfers to savings if no renewal instruction, generates TDS certificate.', outcome:'Maturity amount matches compound interest formula. Auto-renewal creates new FD at current rate. Transfer to savings reflects correct amount after TDS deduction.' },
            { id:'S08', title:'Standing Instruction Batch', comp:'JCL/COBOL', desc:'SIPROC processes all active standing instructions: SIP transfers, recurring deposits, loan EMI auto-debit, utility bill payments. Verifies sufficient balance before debit.', outcome:'All SIs executed on schedule. Insufficient balance SIs retried next day. Successful SIs logged in TRANSACTION_LOG. Failed SIs generate customer notification.' },
            { id:'S09', title:'CICS Timeout Under Load (Stress Test)', comp:'CICS', desc:'Simulate 5000 concurrent 3270 sessions executing ACCTINQ and FUNDXFR transactions. Monitor CICS response time, CPU utilization, AOR queue depth, and DB2 thread consumption.', outcome:'P99 response time < 1 second. No CICS AEY9 (timeout) abends. AOR queue depth within WLM goal. DB2 thread pool not exhausted. Zero transaction loss.' },
            { id:'S10', title:'DB2 Deadlock Resolution', comp:'DB2', desc:'Two concurrent FUNDXFR transactions: Txn-A debits Acct-1 credits Acct-2, Txn-B debits Acct-2 credits Acct-1. DB2 detects deadlock (SQLCODE -911 or -913) and rolls back victim transaction.', outcome:'DB2 selects deadlock victim (lower priority). Victim receives SQLCODE -911. COBOL program retries after 1 second delay. Both transactions eventually complete. No data corruption.' },
            { id:'S11', title:'JCL ABEND S0C7 Handling', comp:'JCL/COBOL', desc:'Batch job encounters corrupted account record with non-numeric data in balance field (COMP-3). COBOL program ABENDs with S0C7. Job must restart from checkpoint after data fix.', outcome:'ABEND captured in job log with offset. CEE3207S diagnostic identifies field. Data corrected in DB2. Job restarted from STEP020 checkpoint. Remaining accounts processed correctly.' },
            { id:'S12', title:'Batch Restart After Failure', comp:'JCL', desc:'INTCALC job fails at STEP020 after processing 30M of 50M accounts. Checkpoint file records last processed account. Job restarted with RESTART=STEP020 and PARM=RESTART.', outcome:'Job resumes from account 30,000,001. No duplicate interest calculation for first 30M accounts. Job completes remaining 20M accounts. Total interest matches full run calculation.' },
            { id:'S13', title:'VSAM I/O Error Recovery', comp:'VSAM', desc:'VSAM KSDS customer index file encounters I/O error during batch read. COBOL FILE STATUS returns 47 (logic error) or 93 (VSAM resource not available). Program must handle gracefully.', outcome:'I/O error logged with VSAM return code and reason code. IDCAMS VERIFY run to check cluster integrity. If repairable, REPRO from backup. Batch job retried successfully.' },
            { id:'S14', title:'CICS AOR Failover', comp:'CICS', desc:'Primary AOR region fails during peak hours. CICS Sysplex Distributor routes transactions to secondary AOR. In-flight transactions receive ATNI (node error). Terminal users retry seamlessly.', outcome:'Failover completes within 30 seconds. Secondary AOR absorbs load. No committed transactions lost. Terminal users experience brief delay then normal service. CICS log shows clean takeover.' },
            { id:'S15', title:'DB2 Tablespace Reorg Impact', comp:'DB2', desc:'REORG TABLESPACE on ACCOUNT_MASTER during batch window. Online transactions must continue with minimal impact. REORG SHRLEVEL CHANGE allows concurrent access.', outcome:'REORG completes within SLA. Online queries experience < 10% response time increase. No lock timeouts (SQLCODE -911). Table statistics updated. RUNSTATS confirms improved access paths.' },
            { id:'S16', title:'z/OS Connect API Integration', comp:'z/OS Connect', desc:'Mobile banking app calls REST API to fetch account balance. z/OS Connect EE receives GET request, maps to CICS LINK to ACCTINQ COBOL program, transforms COMMAREA response to JSON.', outcome:'REST API returns 200 OK with JSON response in < 500ms. Account balance matches CICS 3270 inquiry. Error responses return proper HTTP status codes (404 for invalid account).' },
            { id:'S17', title:'3270 Screen Regression Testing', comp:'CICS/BMS', desc:'Verify all BMS maps (ACCTMAP, XFRMAP, LOANMAP, STMTMAP) display correctly after COBOL program changes. Check field positions, attributes (protected/unprotified), color, cursor positioning.', outcome:'All BMS maps render correctly on 3270 emulator. Tab order follows expected sequence. Protected fields cannot be modified. Error messages display in red on line 24. F-key assignments work.' },
            { id:'S18', title:'Batch Window Optimization', comp:'JCL/TWS', desc:'EOD batch currently takes 5 hours for 50M accounts. Optimize by parallelizing INTCALC across 4 job streams (by branch range), using DB2 multi-row FETCH, and tuning VSAM buffer allocation.', outcome:'Batch window reduced from 5 hours to 3.5 hours. Parallel streams complete within 10% of each other. No resource contention between streams. DB2 CPU time reduced by 25%.' },
            { id:'S19', title:'RACF Security Validation', comp:'RACF', desc:'Verify RACF profiles protect production datasets, CICS transactions, and DB2 objects. Test that unauthorized user IDs cannot access sensitive resources. Validate audit trail in SMF records.', outcome:'Unauthorized access attempts blocked with S913 abend. RACF violation logged in SMF Type 80 records. Production datasets protected with UACC(NONE). CICS transaction security active.' },
            { id:'S20', title:'MQ Mainframe-to-Distributed Flow', comp:'IBM MQ', desc:'CICS FUNDXFR program puts notification message to MQ queue FUNDXFR.NOTIFY. MQ channel transfers to distributed MQ manager. Consumer application processes notification and sends SMS/email.', outcome:'MQ message delivered within 5 seconds. Message format matches MQMD and application header. Persistent message survives MQ restart. Dead letter queue empty. SMS/email received by customer.' }
          ].map((s, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:700, textAlign:'center' }}>{s.id}</td>
              <td style={{ ...tdStyle, fontWeight:600, color:C.header, minWidth:200 }}>{s.title}</td>
              <td style={{ ...tdStyle, textAlign:'center' }}>{badge(
                s.comp.includes('DB2') ? C.info : s.comp.includes('JCL') ? C.danger : s.comp.includes('CICS') ? C.warn : s.comp.includes('VSAM') ? C.success : s.comp.includes('MQ') ? C.accent : s.comp.includes('RACF') ? C.danger : C.accent,
                s.comp
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
      <h2 style={sectionTitle}>Mainframe Banking Test Cases</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 detailed test cases covering COBOL, CICS, JCL, DB2, VSAM, and MQ components with step-by-step procedures for Indian banking mainframe QA.
      </p>
      <div style={{ overflowX:'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, minWidth:90 }}>TC-ID</th>
              <th style={{ ...thStyle, minWidth:180 }}>Title</th>
              <th style={{ ...thStyle, minWidth:80 }}>Component</th>
              <th style={{ ...thStyle, minWidth:80 }}>Test Type</th>
              <th style={{ ...thStyle, minWidth:250 }}>Steps</th>
              <th style={{ ...thStyle, minWidth:200 }}>Expected Result</th>
              <th style={{ ...thStyle, minWidth:60 }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id:'TC-MF-001', title:'Savings Account Balance Inquiry', comp:'COBOL/CICS', type:'Functional', steps:'1. Log into 3270 terminal\n2. Enter ACCTINQ transaction\n3. Input valid savings account number\n4. Press ENTER\n5. Verify balance displayed\n6. Press F3 to exit', result:'Account holder name, branch, balance (INR formatted), last txn date, status displayed. Response < 1 sec.', pri:'P0' },
              { id:'TC-MF-002', title:'Fund Transfer - Sufficient Balance', comp:'COBOL/DB2', type:'Functional', steps:'1. Enter FUNDXFR transaction\n2. Input debit account (balance INR 50,000)\n3. Input credit account\n4. Enter amount INR 10,000\n5. Confirm transfer\n6. Verify both account balances', result:'Debit account: INR 40,000. Credit account: increased by INR 10,000. TXN_LOG entry created. DB2 COMMIT successful.', pri:'P0' },
              { id:'TC-MF-003', title:'Fund Transfer - Insufficient Balance', comp:'COBOL/DB2', type:'Negative', steps:'1. Enter FUNDXFR transaction\n2. Input debit account (balance INR 5,000)\n3. Input credit account\n4. Enter amount INR 10,000\n5. Confirm transfer\n6. Verify error handling', result:'Transfer rejected with INSUFFICIENT BALANCE error on line 24. Both account balances unchanged. No TXN_LOG entry. DB2 ROLLBACK executed.', pri:'P0' },
              { id:'TC-MF-004', title:'EOD Interest Calculation Accuracy', comp:'JCL/COBOL', type:'Functional', steps:'1. Set up test account with known balance\n2. Submit INTCALC JCL\n3. Wait for job completion (CC=0000)\n4. Query accrued interest in DB2\n5. Compare with manual calculation\n6. Verify GL posting entry', result:'Daily interest = (Balance * Rate) / 365. Matches to 2 decimal places. GL: DR Interest Expense CR Interest Payable. Job CC=0000.', pri:'P0' },
              { id:'TC-MF-005', title:'NPA Classification - 90 Day Overdue', comp:'JCL/COBOL', type:'Functional', steps:'1. Create loan with EMI overdue 91 days\n2. Submit NPACLS JCL batch\n3. Verify NPA flag set to SUB-STD\n4. Verify provisioning calculated at 15%\n5. Check CRILC reporting flag\n6. Verify reversal of accrued interest', result:'Loan classified as Sub-Standard (NPA). Provisioning at 15% of outstanding. Accrued interest reversed. CRILC flag set. SMA-2 history recorded.', pri:'P0' },
              { id:'TC-MF-006', title:'JCL Job Restart from Checkpoint', comp:'JCL', type:'Recovery', steps:'1. Submit INTCALC with intentional ABEND at record 1000\n2. Verify checkpoint file at record 999\n3. Fix data causing ABEND\n4. Restart job with RESTART=STEP020\n5. Verify processing resumes at record 1000\n6. Verify no duplicate processing', result:'Job restarts from checkpoint. Records 1-999 not reprocessed. Records 1000+ processed correctly. Final totals match expected full-run totals.', pri:'P0' },
              { id:'TC-MF-007', title:'CICS BMS Map Field Validation', comp:'CICS/BMS', type:'UI', steps:'1. Display ACCTMAP on 3270\n2. Verify all field positions per BMS source\n3. Test TAB order across fields\n4. Enter invalid data in numeric field\n5. Verify cursor positioning on error\n6. Check protected field attributes', result:'Fields at correct row/col. TAB follows defined order. Non-numeric input rejected. Cursor positioned at error field. Protected fields non-modifiable.', pri:'P1' },
              { id:'TC-MF-008', title:'DB2 Concurrent Update Handling', comp:'DB2', type:'Concurrency', steps:'1. Start two CICS sessions\n2. Both query same account\n3. Session A initiates debit\n4. Session B initiates debit simultaneously\n5. Verify DB2 lock handling\n6. Check final balance correctness', result:'DB2 serializes access via row lock. Second transaction waits or gets SQLCODE -911 (timeout). Final balance reflects both debits. No lost updates.', pri:'P0' },
              { id:'TC-MF-009', title:'VSAM KSDS Read by Alternate Index', comp:'VSAM', type:'Functional', steps:'1. Define VSAM KSDS with AIX on customer name\n2. Build AIX path with BLDINDEX\n3. Read customer record via name AIX\n4. Verify record matches primary key read\n5. Test with duplicate AIX key\n6. Verify UPGRADE set reflects updates', result:'AIX read returns correct record. Duplicate AIX returns all matching records via READNEXT. UPGRADE set keeps AIX in sync after base cluster update.', pri:'P1' },
              { id:'TC-MF-010', title:'DB2 SQL Performance (EXPLAIN)', comp:'DB2', type:'Performance', steps:'1. Run EXPLAIN on INTCALC SQL\n2. Verify index usage on ACCOUNT_MASTER\n3. Check ACCESSTYPE (I=index, R=tablespace scan)\n4. Verify MATCHCOLS > 0\n5. Run RUNSTATS and re-EXPLAIN\n6. Compare CPU time before/after', result:'EXPLAIN shows index access (ACCESSTYPE=I). MATCHCOLS >= 1. No tablespace scans. CPU time per query < 0.01 seconds. RUNSTATS improves access path.', pri:'P1' },
              { id:'TC-MF-011', title:'Batch GL Posting Reconciliation', comp:'JCL/DB2', type:'Functional', steps:'1. Submit GLPOST JCL batch\n2. Query GL_TRANSACTIONS sum of debits\n3. Query GL_TRANSACTIONS sum of credits\n4. Verify DR total = CR total\n5. Reconcile with TRANSACTION_LOG\n6. Generate trial balance report', result:'Total debits equal total credits (zero imbalance). GL totals reconcile with transaction log. Trial balance balances. Branch-wise breakup correct.', pri:'P0' },
              { id:'TC-MF-012', title:'FD Interest Calculation (Quarterly Compounding)', comp:'COBOL', type:'Functional', steps:'1. Create FD: INR 1,00,000, 7% p.a., 1 year\n2. Run FD interest batch\n3. Verify quarterly compounding\n4. Q1: 1,00,000 * 7/400 = 1,750\n5. Q2: 1,01,750 * 7/400 = 1,780.63\n6. Verify maturity amount', result:'Maturity = INR 1,07,185.90 (quarterly compounding). TDS deducted if interest > INR 40,000. Form 16A generated. Auto-renewal at current rate if instructed.', pri:'P0' },
              { id:'TC-MF-013', title:'CICS Transaction Security (RACF)', comp:'CICS/RACF', type:'Security', steps:'1. Define CICS transaction profile in RACF\n2. Attempt FUNDXFR with unauthorized user\n3. Verify transaction blocked\n4. Check SMF Type 80 violation record\n5. Attempt with authorized user\n6. Verify transaction succeeds', result:'Unauthorized user gets DFHAC2030 (Not authorized). SMF 80 record logged. Authorized user executes normally. Audit trail captured in RACF database.', pri:'P0' },
              { id:'TC-MF-014', title:'MQ Message Put/Get from CICS', comp:'MQ/CICS', type:'Integration', steps:'1. CICS program PUTs message to FUNDXFR.NOTIFY\n2. Verify message in queue (MQSC DISPLAY)\n3. Consumer GETs message from queue\n4. Verify message body matches original\n5. Check MQMD headers (persistence, expiry)\n6. Verify dead-letter queue is empty', result:'Message delivered with correct body and MQMD headers. Persistent message survives queue manager restart. No messages in dead-letter queue. Round-trip < 5 seconds.', pri:'P1' },
              { id:'TC-MF-015', title:'S0C7 Abend Diagnostic and Fix', comp:'COBOL', type:'Defect', steps:'1. Submit job with corrupted COMP-3 field\n2. Verify S0C7 abend occurs\n3. Analyze CEE3207S diagnostic message\n4. Identify offset from dump\n5. Map offset to COBOL source line\n6. Fix data and resubmit', result:'S0C7 trapped correctly. CEE3207S shows field name and offset. COBOL listing maps to exact COMPUTE/ADD statement. After fix, job completes CC=0000.', pri:'P0' },
              { id:'TC-MF-016', title:'z/OS Connect REST API Response', comp:'z/OS Connect', type:'Integration', steps:'1. Send GET /api/v1/accounts/{id} to z/OS Connect\n2. z/OS Connect maps to CICS LINK ACCTINQ\n3. Verify JSON response format\n4. Test with invalid account (expect 404)\n5. Test with server error (expect 500)\n6. Measure response time', result:'200 OK with JSON body matching COMMAREA fields. 404 for invalid account. 500 for CICS errors. Response < 500ms. Content-Type: application/json.', pri:'P1' },
              { id:'TC-MF-017', title:'Batch Job Dependency Chain (TWS)', comp:'JCL/TWS', type:'Functional', steps:'1. Define job chain: EXTRACT > INTCALC > GLPOST > RECON\n2. Submit via TWS scheduler\n3. Verify sequential execution\n4. Fail INTCALC intentionally\n5. Verify GLPOST/RECON held\n6. Fix and release chain', result:'Jobs execute in correct sequence. Downstream jobs held when predecessor fails. TWS shows dependency tree. After fix, chain resumes from failed job. All jobs complete CC=0000.', pri:'P0' },
              { id:'TC-MF-018', title:'DB2 Bind Plan and Package', comp:'DB2', type:'Deployment', steps:'1. Modify COBOL SQL program\n2. Precompile with DB2 precompiler\n3. Compile and link COBOL\n4. BIND PACKAGE with EXPLAIN(YES)\n5. BIND PLAN including new package\n6. Test in CICS with new plan', result:'BIND successful with no SQL errors. EXPLAIN output shows optimal access paths. CICS uses new plan. Transaction results correct with new logic. Old plan preserved for rollback.', pri:'P1' },
              { id:'TC-MF-019', title:'VSAM File Backup and Restore', comp:'VSAM', type:'Recovery', steps:'1. IDCAMS REPRO VSAM KSDS to sequential file\n2. Corrupt VSAM cluster (simulate failure)\n3. IDCAMS DELETE then DEFINE cluster\n4. REPRO sequential file back to VSAM\n5. Verify all records restored\n6. Verify AIX rebuilt correctly', result:'Backup contains all records. Restore rebuilds KSDS with correct key sequence. Record count matches original. AIX rebuilt via BLDINDEX. Application reads succeed.', pri:'P1' },
              { id:'TC-MF-020', title:'EOD Batch Window End-to-End', comp:'JCL/COBOL/DB2', type:'E2E', steps:'1. Lock online transactions (20:00)\n2. Extract day transactions\n3. Calculate interest\n4. Post GL entries\n5. Reconcile\n6. Generate statements\n7. NPA classification\n8. Regulatory extract\n9. Unlock (00:00)', result:'All EOD jobs complete within 4-hour window. Zero GL imbalance. Interest totals verified. Statements generated for all accounts. NPA classification per RBI norms. Regulatory extracts ready.', pri:'P0' }
            ].map((tc, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
                <td style={{ ...tdStyle, color:C.accent, fontWeight:700, fontSize:12 }}>{tc.id}</td>
                <td style={{ ...tdStyle, fontWeight:600, color:C.header, fontSize:12 }}>{tc.title}</td>
                <td style={{ ...tdStyle, textAlign:'center', fontSize:11 }}>{badge(
                  tc.comp.includes('DB2') ? C.info : tc.comp.includes('JCL') ? C.danger : tc.comp.includes('CICS') ? C.warn : tc.comp.includes('VSAM') ? C.success : tc.comp.includes('MQ') ? C.accent : tc.comp.includes('z/OS') ? C.info : C.accent,
                  tc.comp
                )}</td>
                <td style={{ ...tdStyle, fontSize:11 }}>{badge(
                  tc.type === 'Functional' ? C.accent : tc.type === 'Negative' ? C.danger : tc.type === 'Recovery' ? C.warn : tc.type === 'Performance' ? C.info : tc.type === 'Security' ? C.danger : tc.type === 'Integration' ? C.success : tc.type === 'E2E' ? C.accent : C.muted,
                  tc.type
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
      <h2 style={sectionTitle}>C4 Model - Mainframe Banking Platform</h2>

      <h3 style={subTitle}>Level 1: System Context</h3>
      <pre style={preStyle}>{`
+===================================================================================+
|                 C4 MODEL - LEVEL 1: SYSTEM CONTEXT                                 |
+===================================================================================+

                        +--------------------+
                        |   Bank Customers   |
                        | (Retail/Corporate/ |
                        |  NRI/Government)   |
                        +--------+-----------+
                                 |
                        ATM, Branch, Net, Mobile
                                 |
                                 v
  +-----------------+  +========================+  +--------------------+
  |  RBI / NPCI     |  |                        |  |  External Systems  |
  |  Regulators     |<>|  MAINFRAME BANKING     |<>|                    |
  |  - NEFT/RTGS    |  |  SYSTEM (z/OS)         |  | - SWIFT Network    |
  |  - UPI/IMPS     |  |                        |  | - NPCI (UPI/IMPS)  |
  |  - CRILC/CRR    |  |  Core Banking on IBM   |  | - Credit Bureaus   |
  +-----------------+  |  z15/z16 Mainframe     |  | - RBI SFMS         |
                        |  processing 50M+       |  | - Payment Gateways |
  +-----------------+  |  accounts daily         |  | - Correspondent    |
  |  Internal Users |<>|                        |  |   Banks            |
  |  - Branch Staff |  +========================+  +--------------------+
  |  - Back Office  |             ^
  |  - Operations   |             |
  |  - Audit        |  +----------+-----------+
  +-----------------+  |  Cloud / Distributed  |
                        |  - Internet Banking   |
                        |  - Mobile Banking     |
                        |  - API Partners       |
                        |  - Analytics Platform |
                        +----------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 2: Container Diagram</h3>
      <pre style={preStyle}>{`
+===================================================================================+
|                 C4 MODEL - LEVEL 2: CONTAINERS                                     |
+===================================================================================+

+--------------------------------------------------------------------------+
|                        z/OS MAINFRAME SYSTEM                              |
|                                                                           |
|  +-------------------+  +-------------------+  +---------------------+   |
|  | CICS TS Region    |  | Batch Region      |  | IMS/TM Region       |   |
|  | [COBOL Programs]  |  | [JCL/COBOL]       |  | [IMS Transactions]  |   |
|  |                   |  |                   |  |                     |   |
|  | - Account Inquiry |  | - EOD Interest    |  | - Legacy Txn Mgmt  |   |
|  | - Fund Transfer   |  | - GL Posting      |  | - Message Queue    |   |
|  | - Bill Payment    |  | - Statement Gen   |  | - Fast Path Txns   |   |
|  | - Loan Processing |  | - NPA Classific.  |  | - Batch Message    |   |
|  | - Trade Finance   |  | - Reconciliation  |  |   Processing       |   |
|  +-------------------+  +-------------------+  +---------------------+   |
|                                                                           |
|  +-------------------+  +-------------------+  +---------------------+   |
|  | DB2 Subsystem     |  | VSAM Files        |  | IBM MQ for z/OS     |   |
|  | [Relational DB]   |  | [File Storage]    |  | [Message Queuing]   |   |
|  |                   |  |                   |  |                     |   |
|  | - Account Master  |  | - Customer Index  |  | - ATM Queue         |   |
|  | - Transaction Log |  |   (KSDS)          |  | - NEFT/RTGS Queue   |   |
|  | - Customer Master |  | - Rate Tables     |  | - Notification Q    |   |
|  | - GL Tables       |  |   (ESDS)          |  | - Inter-system Q    |   |
|  | - Loan Tables     |  | - Batch Work      |  | - Dead Letter Q     |   |
|  +-------------------+  |   (RRDS)          |  +---------------------+   |
|                          +-------------------+                            |
|                                                                           |
|  +-------------------+  +-------------------+  +---------------------+   |
|  | z/OS Connect EE   |  | TWS/OPC Scheduler |  | RACF Security       |   |
|  | [API Gateway]     |  | [Job Scheduler]   |  | [Access Control]    |   |
|  |                   |  |                   |  |                     |   |
|  | - REST API expose |  | - EOD/BOD chains  |  | - User Auth         |   |
|  | - JSON/COBOL map  |  | - Job dependency  |  | - Dataset Protect   |   |
|  | - OpenAPI spec    |  | - Restart/Recovery|  | - Transaction Sec   |   |
|  +-------------------+  +-------------------+  +---------------------+   |
+--------------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 3: Component Diagram (CICS Region)</h3>
      <pre style={preStyle}>{`
+===================================================================================+
|                 C4 MODEL - LEVEL 3: COMPONENTS                                     |
+===================================================================================+

  CICS TS Region [Container] - Component Breakdown:

  +------------------------------------------------------------------+
  |                                                                    |
  |  +-------------------+      +---------------------+               |
  |  | TOR (Terminal     |----->| AOR (Application    |               |
  |  |  Owning Region)   |      |  Owning Region)     |               |
  |  | - 3270 sessions   |      |                     |               |
  |  | - Screen routing  |      | +----------------+  |               |
  |  | - Load balancing  |      | | ACCTINQ Program|  |               |
  |  +-------------------+      | | (Account Inq.) |  |               |
  |                              | +----------------+  |               |
  |  +-------------------+      | +----------------+  |               |
  |  | FOR (File Owning  |      | | FUNDXFR Program|  |               |
  |  |  Region)          |<-----| | (Fund Transfer)|  |               |
  |  | - VSAM file mgmt  |      | +----------------+  |               |
  |  | - File I/O control|      | +----------------+  |               |
  |  | - Record locking  |      | | BILLPAY Program|  |               |
  |  +-------------------+      | | (Bill Payment) |  |               |
  |                              | +----------------+  |               |
  |                              | +----------------+  |               |
  |  +-------------------+      | | LOANPRC Program|  |               |
  |  | DB2 Connection    |<-----| | (Loan Process) |  |               |
  |  | Pool              |      | +----------------+  |               |
  |  | - Thread mgmt     |      | +----------------+  |               |
  |  | - SQL routing     |      | | TRDEFIN Program|  |               |
  |  | - DSNC attach     |      | | (Trade Finance)|  |               |
  |  +-------------------+      | +----------------+  |               |
  |                              +---------------------+               |
  +------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 4: Code (COBOL Program Structure)</h3>
      <pre style={preStyle}>{`
+===================================================================================+
|                 C4 MODEL - LEVEL 4: CODE                                           |
+===================================================================================+

  FUNDXFR Program - Internal Structure:

  IDENTIFICATION DIVISION
  |
  +-- PROGRAM-ID: FUNDXFR
  +-- AUTHOR: CORE-BANKING-TEAM

  ENVIRONMENT DIVISION
  |
  +-- SOURCE-COMPUTER: IBM-Z15
  +-- FILE-CONTROL: VSAM Rate File

  DATA DIVISION
  |
  +-- WORKING-STORAGE
  |   +-- WS-DEBIT-ACCT        PIC X(16)
  |   +-- WS-CREDIT-ACCT       PIC X(16)
  |   +-- WS-TRANSFER-AMT      PIC 9(13)V99
  |   +-- COPY ACCTCOPY        (Account Record)
  |   +-- COPY TXNLCOPY        (Transaction Record)
  |   +-- EXEC SQL INCLUDE SQLCA
  |
  +-- LINKAGE SECTION
      +-- DFHCOMMAREA
          +-- LS-FUNCTION       PIC X(04)
          +-- LS-DEBIT-ACCT     PIC X(16)
          +-- LS-CREDIT-ACCT    PIC X(16)
          +-- LS-AMOUNT          PIC 9(13)V99
          +-- LS-RETURN-CODE     PIC S9(04) COMP

  PROCEDURE DIVISION
  |
  +-- MAIN-LOGIC
  |   +-- PERFORM VALIDATE-INPUT
  |   +-- PERFORM DEBIT-ACCOUNT
  |   |   +-- SELECT ... FOR UPDATE (DB2 Row Lock)
  |   |   +-- IF balance < amount THEN RETURN ERROR
  |   |   +-- UPDATE ACCOUNT_MASTER SET balance = balance - amount
  |   +-- PERFORM CREDIT-ACCOUNT
  |   |   +-- UPDATE ACCOUNT_MASTER SET balance = balance + amount
  |   +-- PERFORM LOG-TRANSACTION
  |   |   +-- INSERT INTO TRANSACTION_LOG
  |   |   +-- EXEC SQL COMMIT
  |   +-- PERFORM SEND-MQ-NOTIFICATION
  |       +-- EXEC CICS WRITEQ TS QUEUE('FUNDXFR.NOTIFY')
  |
  +-- ERROR-HANDLER
      +-- EXEC CICS HANDLE ABEND PROGRAM('ABNDHAND')
      +-- ROLLBACK on any failure
      +-- Return error code in COMMAREA
`}</pre>
    </div>
  );
  const renderTechStack = () => (
    <div>
      <h2 style={sectionTitle}>Technology Stack</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Comprehensive technology stack for mainframe banking testing in Indian banking ecosystem covering IBM z/OS platform, languages, middleware, schedulers, and modern DevOps tools.
      </p>
      <div style={gridStyle}>
        {[
          { cat:'Platform & Hardware', items:[
            { name:'IBM z/OS', desc:'Mainframe operating system for enterprise banking workloads', use:'Primary platform for all COBOL/CICS/DB2 workloads' },
            { name:'IBM z15 / z16', desc:'Latest IBM Z hardware with on-chip AI acceleration and Telum processor', use:'Production and DR mainframe hardware' },
            { name:'Parallel Sysplex', desc:'Cluster of z/OS systems sharing workload via Coupling Facility', use:'High availability and horizontal scaling' },
            { name:'LPAR (Logical Partitions)', desc:'Hardware virtualization for Prod/Test/DR isolation on same physical machine', use:'Environment isolation and resource allocation' }
          ], color:C.accent },
          { cat:'Transaction Processing', items:[
            { name:'CICS TS v5.6 / v6.1', desc:'Customer Information Control System for online transaction processing', use:'Real-time banking transactions (inquiry, transfer, payment)' },
            { name:'IMS/TM v15.3', desc:'Information Management System Transaction Manager for high-volume messaging', use:'Legacy transaction routing, batch message processing' },
            { name:'JES2 (Job Entry Subsystem)', desc:'Batch job management for JCL submission, scheduling, and output', use:'EOD/BOD batch job execution and spool management' },
            { name:'WLM (Workload Manager)', desc:'z/OS workload management for SLA-based resource allocation', use:'CICS response time goals, batch priority management' }
          ], color:C.warn },
          { cat:'Languages & Development', items:[
            { name:'Enterprise COBOL v6.4', desc:'Primary business logic language for banking applications', use:'Account management, interest calc, NPA, GL posting' },
            { name:'PL/I', desc:'Programming language for complex banking algorithms and utilities', use:'Treasury calculations, statistical analysis programs' },
            { name:'Assembler (HLASM)', desc:'High Level Assembler for system-level programs and exits', use:'CICS exits, DB2 exits, performance-critical routines' },
            { name:'REXX', desc:'Scripting language for z/OS automation and ISPF panels', use:'Batch automation, ISPF tools, system administration scripts' },
            { name:'JCL (Job Control Language)', desc:'Batch job definition language for z/OS', use:'EOD/BOD job streams, utility execution, file management' }
          ], color:C.info },
          { cat:'Data Management', items:[
            { name:'DB2 v13 for z/OS', desc:'Enterprise relational database for structured banking data', use:'Account Master, Transaction Log, Customer Master, GL Tables' },
            { name:'IMS/DB', desc:'Hierarchical database for legacy banking data structures', use:'Legacy customer hierarchies, product catalogs' },
            { name:'VSAM (KSDS/ESDS/RRDS)', desc:'Virtual Storage Access Method for indexed and sequential files', use:'Customer index, rate tables, batch work files' },
            { name:'DFSMS', desc:'Data Facility Storage Management Subsystem for storage management', use:'SMS-managed datasets, HSM archival, tape management' }
          ], color:C.success },
          { cat:'Middleware & Integration', items:[
            { name:'IBM MQ v9.3 for z/OS', desc:'Enterprise message queuing for reliable async communication', use:'ATM routing, NEFT/RTGS messaging, notification delivery' },
            { name:'CICS Transaction Gateway (CTG)', desc:'J2EE connector for CICS from distributed platforms', use:'Internet banking to CICS integration' },
            { name:'z/OS Connect EE v3.0', desc:'RESTful API enablement for mainframe programs', use:'Mobile banking APIs, fintech partner integration' },
            { name:'Connect:Direct', desc:'Secure file transfer between mainframe and distributed systems', use:'RBI file submissions, inter-bank file exchange, SWIFT files' }
          ], color:C.accent },
          { cat:'Scheduling & Automation', items:[
            { name:'TWS (Tivoli Workload Scheduler) / OPC', desc:'Enterprise job scheduling with dependency management', use:'EOD/BOD batch scheduling, job chain management' },
            { name:'Control-M for z/OS', desc:'Cross-platform workload automation and orchestration', use:'Mainframe-to-distributed job coordination' },
            { name:'CA-7 Workload Automation', desc:'Mainframe job scheduling and monitoring', use:'Legacy batch scheduling, on-demand job submission' }
          ], color:C.danger },
          { cat:'Testing & Debug Tools', items:[
            { name:'IBM Debug Tool', desc:'Interactive source-level debugger for COBOL/PL/I on z/OS', use:'COBOL program debugging, variable inspection, breakpoints' },
            { name:'Xpediter (Compuware/BMC)', desc:'Interactive testing and debugging for CICS/batch programs', use:'CICS transaction debugging, batch step-through, data manipulation' },
            { name:'Compuware Topaz', desc:'Modern IDE for mainframe development with graphical interface', use:'COBOL editing, JCL analysis, dataset browsing' },
            { name:'Micro Focus Enterprise Developer', desc:'Off-mainframe COBOL development and testing environment', use:'COBOL unit testing on Windows/Linux without mainframe' }
          ], color:C.warn },
          { cat:'Monitoring & Security', items:[
            { name:'OMEGAMON', desc:'Real-time monitoring for CICS, DB2, IMS, MQ, and z/OS', use:'Performance monitoring, threshold alerting, capacity planning' },
            { name:'RMF (Resource Measurement Facility)', desc:'z/OS performance data collection and reporting', use:'CPU utilization, I/O rates, memory usage, workload analysis' },
            { name:'SMF (System Management Facility)', desc:'Accounting and audit data recording', use:'Job accounting, RACF violations, DB2 activity, security audit' },
            { name:'RACF / ACF2', desc:'Resource Access Control Facility for mainframe security', use:'User authentication, dataset protection, transaction security' }
          ], color:C.info },
          { cat:'Modern DevOps (Mainframe)', items:[
            { name:'IBM Dependency Based Build (DBB)', desc:'Intelligent build system for mainframe applications', use:'Automated COBOL compile, link, bind from Git source' },
            { name:'Rocket Git for z/OS', desc:'Native Git client on z/OS for source control', use:'COBOL/JCL version control on mainframe' },
            { name:'IBM Wazi DevSpaces', desc:'Cloud-based mainframe development environment', use:'COBOL development in VS Code with z/OS backend' },
            { name:'Zowe CLI', desc:'Open source CLI for z/OS interaction from any platform', use:'Submit JCL, browse datasets, manage CICS from terminal' }
          ], color:C.success }
        ].map((cat, i) => (
          <div key={i} style={{ ...cardStyle, gridColumn:'span 1' }}>
            <h4 style={{ color:cat.color, fontSize:16, fontWeight:700, marginBottom:12, borderBottom:`1px solid ${C.border}`, paddingBottom:8 }}>{cat.cat}</h4>
            {cat.items.map((item, j) => (
              <div key={j} style={{ marginBottom:10, paddingBottom:8, borderBottom: j < cat.items.length - 1 ? '1px solid rgba(78,204,163,0.1)' : 'none' }}>
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
          { title:'ADR-001: Maintain Mainframe for Core Banking', decision:'Continue running core banking workloads (account management, GL, interest calculation) on IBM z/OS mainframe rather than rewriting to cloud-native.', rationale:'Mainframe processes 50M+ accounts daily with 99.999% uptime. COBOL programs have 30+ years of business rules embedded. Rewrite risk is extremely high for a running bank. z/OS throughput of 1 billion transactions/day is unmatched. RBI mandates zero-downtime for core banking.', tradeoff:'High MIPS licensing cost (INR 15-25 Crore/year). Shrinking COBOL talent pool in India. Limited modern developer experience. Vendor lock-in to IBM. But rewrite failure risk (estimated 60-70% for large banks) far exceeds maintenance cost.', color:C.accent },
          { title:'ADR-002: API-Enable via z/OS Connect (Not Rewrite)', decision:'Use z/OS Connect EE to expose COBOL/CICS programs as REST APIs instead of rewriting business logic in Java/Python microservices.', rationale:'z/OS Connect wraps existing COBOL programs with zero code change. OpenAPI spec auto-generated from COMMAREA/copybook. Preserves 30+ years of tested business logic. Mobile/internet banking gets REST APIs without mainframe rewrite. Incremental modernization path.', tradeoff:'Additional z/OS Connect licensing cost. JSON-to-COBOL mapping can be complex for nested structures. Latency slightly higher than native REST. Limited to request-response pattern (no streaming/websocket). But eliminates rewrite risk entirely.', color:C.info },
          { title:'ADR-003: Batch Optimization via Parallelization', decision:'Optimize EOD batch window by parallelizing JCL job streams across branch ranges rather than moving batch to distributed platform.', rationale:'Current 5-hour batch window must shrink to 4 hours for growing account base. Splitting INTCALC into 4 parallel streams (North/South/East/West branches) leverages Sysplex parallelism. DB2 partitioned tablespaces support parallel access. TWS manages inter-stream dependencies.', tradeoff:'Complex restart/recovery across parallel streams. DB2 lock contention between streams requires careful partition design. TWS dependency management complexity increases. But achieves 30% batch reduction without architectural change.', color:C.warn },
          { title:'ADR-004: Off-Mainframe Testing with Micro Focus', decision:'Use Micro Focus Enterprise Developer for COBOL unit testing on Windows/Linux to reduce mainframe MIPS consumption during testing.', rationale:'Mainframe test LPAR MIPS cost is INR 8-12 Lakh/month. Micro Focus emulates CICS/DB2/VSAM on x86. Developers can run COBOL tests locally. CI/CD pipeline runs unit tests off-mainframe. Integration testing still on mainframe for fidelity. Reduces test MIPS by 40-60%.', tradeoff:'Micro Focus does not replicate 100% mainframe behavior. CICS-specific features (Sysplex, WLM) not fully emulated. DB2 z/OS features differ from Micro Focus DB2 emulation. Must run final regression on real z/OS. But cost savings justify dual-track testing.', color:C.danger },
          { title:'ADR-005: COBOL Talent Strategy - Train, Not Replace', decision:'Invest in training Java/Python developers in COBOL rather than waiting for full platform replacement.', rationale:'India has ~50,000 active COBOL developers (avg age 45+). Attrition rate 15-20% annually. Major banks (SBI, HDFC, ICICI) face COBOL skill shortage. Training a Java developer in COBOL takes 6-12 months. Mainframe will run for 15-20+ more years. Partnering with IBM for Wazi DevSpaces enables modern IDE experience for COBOL.', tradeoff:'Training investment (INR 5-8 Lakh per developer). Developers may resist mainframe assignments. Modern IDE helps but JCL/VSAM concepts have steep learning curve. Retain experienced COBOL developers with competitive packages as mentors.', color:C.success },
          { title:'ADR-006: DB2 Data Sharing for High Availability', decision:'Use DB2 Data Sharing Group across Parallel Sysplex for zero-downtime database access.', rationale:'Single DB2 subsystem is a single point of failure. Data Sharing Group allows multiple DB2 members to access same data concurrently. If one member fails, others continue serving. Enables rolling maintenance (one member at a time). Supports z/OS Sysplex Distributor for workload balancing.', tradeoff:'Coupling Facility overhead (5-10% CPU). Inter-member lock propagation adds latency for write-heavy workloads. Complex setup and DBA expertise required. Higher hardware cost for Coupling Facility. But zero-downtime requirement for Indian banking (RBI) makes this mandatory.', color:C.info }
        ].map((d, i) => (
          <div key={i} style={{ ...cardStyle, borderLeft:'4px solid ' + d.color }}>
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
    </div>
  );
  const renderFlowchart = () => (
    <div>
      <h2 style={sectionTitle}>EOD Batch Processing Flowchart</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        End-to-end EOD (End of Day) batch processing flow for Indian banking mainframe showing TWS-triggered job chain, interest calculation, GL posting, reconciliation, and abend handling.
      </p>
      <pre style={preStyle}>{`
+===================================================================================+
|              EOD BATCH PROCESSING - DETAILED FLOWCHART                             |
+===================================================================================+

                    +-------------------------+
                    |  TWS/OPC Trigger         |
                    |  (20:00 IST Daily)       |
                    |  Job: EODMAIN            |
                    +-----------+-------------+
                                |
                                v
                    +-------------------------+
                    |  STEP 1: Lock Online     |
                    |  Transactions             |
                    |  - CICS DISABLE TRANS     |
                    |  - Set ONLINE_STATUS=OFF  |
                    |  - Drain active sessions  |
                    +-----------+-------------+
                                |
                                v
                    +-------------------------+
                    |  STEP 2: Extract Day     |
                    |  Transactions             |
                    |  - DB2 SELECT from        |
                    |    TRANSACTION_LOG         |
                    |  - WHERE TXN_DATE = TODAY  |
                    |  - Write to sequential     |
                    |    extract file            |
                    +-----------+-------------+
                                |
                                v
               +----------------+----------------+
               |                |                |
               v                v                v
    +----------+---+ +----------+---+ +----------+---+
    | STEP 3A:     | | STEP 3B:     | | STEP 3C:     |
    | Interest Calc| | Interest Calc| | Interest Calc|
    | (North Zone) | | (South Zone) | | (East/West)  |
    | Branches     | | Branches     | | Branches     |
    | 0001-3000    | | 3001-6000    | | 6001-9999    |
    | INTCALC-N    | | INTCALC-S    | | INTCALC-EW   |
    +------+-------+ +------+-------+ +------+-------+
           |                 |                |
           +--------+--------+--------+-------+
                    |                 |
                    v                 v
           +-------+--------+ +------+----------+
           | CHECKPOINT      | | ABEND HANDLER   |
           | - Save last     | | - Capture dump  |
           |   processed     | | - Log S0C7/S322 |
           |   account       | | - Notify ops    |
           | - Write to      | | - Write restart |
           |   CHKPOINT file | |   info          |
           +-----------------+ | - ABEND EXIT    |
                               +---------+-------+
                                          |
                                  [IF ABEND]
                                          |
                                          v
                               +----------+-------+
                               | Manual Fix        |
                               | - Correct data    |
                               | - RESTART=STEPnnn |
                               | - Resume from     |
                               |   checkpoint      |
                               +-------------------+

                    [AFTER ALL ZONES COMPLETE]
                                |
                                v
                    +-------------------------+
                    |  STEP 4: GL Posting      |
                    |  - Aggregate by GL code  |
                    |  - DR Interest Expense   |
                    |  - CR Interest Payable   |
                    |  - Branch-wise breakup   |
                    |  - Verify DR = CR        |
                    +-----------+-------------+
                                |
                                v
                    +-------------------------+
                    |  STEP 5: Reconciliation  |
                    |  - Match TXN_LOG totals  |
                    |    with GL totals        |
                    |  - Inter-branch recon    |
                    |  - Nostro/Vostro recon   |
                    |  - Generate exception    |
                    |    report                |
                    +-----------+-------------+
                                |
                                v
                    +-------------------------+
                    |  STEP 6: Statement Gen   |
                    |  - Monthly accounts      |
                    |  - Format per RBI norms  |
                    |  - PDF generation        |
                    |  - Email/print queue     |
                    +-----------+-------------+
                                |
                                v
                    +-------------------------+
                    |  STEP 7: Update Balances |
                    |  - Apply accrued interest|
                    |  - Update ACCOUNT_MASTER |
                    |  - Set LAST_INT_DATE     |
                    +-----------+-------------+
                                |
                                v
                    +-------------------------+
                    |  STEP 8: NPA             |
                    |  Classification           |
                    |  - Check days overdue    |
                    |  - SMA-0 (30 days)       |
                    |  - SMA-1 (60 days)       |
                    |  - SMA-2 / NPA (90 days) |
                    |  - Doubtful (180 days)   |
                    |  - Loss (360 days)       |
                    |  - Calculate provisioning|
                    +-----------+-------------+
                                |
                                v
                    +-------------------------+
                    |  STEP 9: Regulatory      |
                    |  Extract                  |
                    |  - CRILC extract (>5 Cr) |
                    |  - RBI returns data      |
                    |  - FATCA/CRS extract     |
                    |  - Connect:Direct to RBI |
                    +-----------+-------------+
                                |
                                v
                    +-------------------------+
                    |  STEP 10: Unlock Online  |
                    |  - CICS ENABLE TRANS     |
                    |  - Set ONLINE_STATUS=ON  |
                    |  - Verify CICS regions   |
                    |    accepting transactions|
                    +-----------+-------------+
                                |
                                v
                    +-------------------------+
                    |  STEP 11: Notify         |
                    |  - MQ message to ops     |
                    |  - Email batch summary   |
                    |  - Update TWS calendar   |
                    |  - Log completion time   |
                    +-------------------------+


  BATCH WINDOW TIMELINE
  ======================
  20:00  Lock Transactions
  20:05  Extract Day Transactions
  20:15  Interest Calculation (Parallel x3)
  20:45  GL Posting
  21:15  Reconciliation
  21:45  Statement Generation
  22:15  Balance Update
  22:30  NPA Classification
  22:45  Regulatory Extract
  23:00  Unlock Transactions
  23:05  Notify & Cleanup
  -----
  Total: ~3 hours (target: < 4 hours)
`}</pre>
    </div>
  );
  const renderSequenceDiagram = () => (
    <div>
      <h2 style={sectionTitle}>Sequence Diagram - Fund Transfer (3270 to DB2 Commit to MQ Notification)</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        End-to-end fund transfer flow from branch 3270 terminal input through CICS transaction processing, COBOL business logic, DB2 commit, and MQ notification to distributed systems.
      </p>
      <pre style={preStyle}>{`
+===================================================================================+
|  SEQUENCE DIAGRAM: FUND TRANSFER (BRANCH 3270 TO DB2 COMMIT TO MQ NOTIFICATION)   |
+===================================================================================+

  Branch       CICS         CICS        COBOL         DB2          IBM MQ      Distributed
  Terminal     TOR          AOR         FUNDXFR       Subsystem    z/OS        System
  (3270)       (Router)     (App)       Program       (Data)       (Messaging) (Notification)
  |            |            |           |             |            |           |
  |  1. Enter  |            |           |             |            |           |
  |  FUNDXFR   |            |           |             |            |           |
  |  txn code  |            |           |             |            |           |
  |----------->|            |           |             |            |           |
  |            |            |           |             |            |           |
  |            | 2. Route   |           |             |            |           |
  |            |    to AOR  |           |             |            |           |
  |            |    (Sysplex|           |             |            |           |
  |            |     Distrib)|          |             |            |           |
  |            |----------->|           |             |            |           |
  |            |            |           |             |            |           |
  |            |            | 3. SEND   |             |            |           |
  |            |            |    MAP    |             |            |           |
  |            |            |    XFRMAP |             |            |           |
  |            |            |    (input |             |            |           |
  |            |            |     form) |             |            |           |
  |<...........|............|...........|             |            |           |
  |            |            |           |             |            |           |
  |  4. User enters:        |           |             |            |           |
  |  - Debit Acct: 10012345|           |             |            |           |
  |  - Credit Acct: 20067890           |             |            |           |
  |  - Amount: INR 25,000  |           |             |            |           |
  |  - Press ENTER         |           |             |            |           |
  |----------->|            |           |             |            |           |
  |            |----------->|           |             |            |           |
  |            |            |           |             |            |           |
  |            |            | 5. RECEIVE|             |            |           |
  |            |            |    MAP    |             |            |           |
  |            |            |    XFRMAP |             |            |           |
  |            |            |    (get   |             |            |           |
  |            |            |     input)|             |            |           |
  |            |            |           |             |            |           |
  |            |            | 6. LINK   |             |            |           |
  |            |            |    FUNDXFR|             |            |           |
  |            |            |    (COMMAREA)           |            |           |
  |            |            |---------->|             |            |           |
  |            |            |           |             |            |           |
  |            |            |           | 7. VALIDATE |            |           |
  |            |            |           |    INPUT    |            |           |
  |            |            |           |    - Amount > 0          |           |
  |            |            |           |    - Accts valid         |           |
  |            |            |           |    - Not same acct       |           |
  |            |            |           |             |            |           |
  |            |            |           | 8. SELECT   |            |           |
  |            |            |           |    balance  |            |           |
  |            |            |           |    FOR UPDATE            |           |
  |            |            |           |    (Row Lock)|            |           |
  |            |            |           |------------>|            |           |
  |            |            |           |             |            |           |
  |            |            |           | 9. Balance  |            |           |
  |            |            |           |    = 50,000 |            |           |
  |            |            |           |<------------|            |           |
  |            |            |           |             |            |           |
  |            |            |           | 10. Check   |            |           |
  |            |            |           |     balance |            |           |
  |            |            |           |     >= amt  |            |           |
  |            |            |           |     50000   |            |           |
  |            |            |           |     >= 25000|            |           |
  |            |            |           |     = YES   |            |           |
  |            |            |           |             |            |           |
  |            |            |           | 11. UPDATE  |            |           |
  |            |            |           |     debit   |            |           |
  |            |            |           |     acct    |            |           |
  |            |            |           |     bal =   |            |           |
  |            |            |           |     bal-amt |            |           |
  |            |            |           |------------>|            |           |
  |            |            |           |             |            |           |
  |            |            |           | 12. UPDATE  |            |           |
  |            |            |           |     credit  |            |           |
  |            |            |           |     acct    |            |           |
  |            |            |           |     bal =   |            |           |
  |            |            |           |     bal+amt |            |           |
  |            |            |           |------------>|            |           |
  |            |            |           |             |            |           |
  |            |            |           | 13. INSERT  |            |           |
  |            |            |           |     TXN_LOG |            |           |
  |            |            |           |------------>|            |           |
  |            |            |           |             |            |           |
  |            |            |           | 14. COMMIT  |            |           |
  |            |            |           |------------>|            |           |
  |            |            |           |             |            |           |
  |            |            |           | 15. SQLCODE |            |           |
  |            |            |           |     = 0     |            |           |
  |            |            |           |     (Success)|           |           |
  |            |            |           |<------------|            |           |
  |            |            |           |             |            |           |
  |            |            |           | 16. WRITEQ  |            |           |
  |            |            |           |     TS to   |            |           |
  |            |            |           |     MQ queue|            |           |
  |            |            |           |--------------------------->|           |
  |            |            |           |             |            |           |
  |            |            |           |             |            | 17. MQ    |
  |            |            |           |             |            |     Channel|
  |            |            |           |             |            |     sends |
  |            |            |           |             |            |     to    |
  |            |            |           |             |            |     dist. |
  |            |            |           |             |            |---------->|
  |            |            |           |             |            |           |
  |            |            |           |             |            |           | 18. Process
  |            |            |           |             |            |           |     notif.
  |            |            |           |             |            |           |     Send SMS
  |            |            |           |             |            |           |     to cust.
  |            |            |           |             |            |           |
  |            |            |           | 19. Set     |            |           |
  |            |            |           |     COMMAREA|            |           |
  |            |            |           |     RC = 0  |            |           |
  |            |            |           |     (Success)|           |           |
  |            |            |<----------|             |            |           |
  |            |            |           |             |            |           |
  |            |            | 20. SEND  |             |            |           |
  |            |            |     MAP   |             |            |           |
  |            |            |     XFRMAP|             |            |           |
  |            |            |     (conf)|             |            |           |
  |<...........|............|...........|             |            |           |
  |            |            |           |             |            |           |
  |  21. Display:           |           |             |            |           |
  |  "TRANSFER SUCCESSFUL"  |           |             |            |           |
  |  Txn Ref: TXN20240115001|           |             |            |           |
  |  Debit: 10012345        |           |             |            |           |
  |  Credit: 20067890       |           |             |            |           |
  |  Amount: INR 25,000.00  |           |             |            |           |
  |  New Bal: INR 25,000.00 |           |             |            |           |
  |            |            |           |             |            |           |


  LEGEND:
  ------->  Synchronous call
  <-------  Synchronous response
  <.......  Screen display (3270 data stream)
  FOR UPDATE = DB2 row-level lock acquired
  COMMIT     = All DB2 changes made permanent
  WRITEQ TS  = Write to CICS Temporary Storage (MQ bridge)
`}</pre>

      <h3 style={sectionTitle}>Key Interaction Summary</h3>
      <div style={gridStyle}>
        {[
          { step:'Steps 1-3', title:'Transaction Initiation', desc:'User enters FUNDXFR transaction code on 3270 terminal. CICS TOR routes to least-loaded AOR via Sysplex Distributor. AOR displays input BMS map (XFRMAP).', color:C.accent },
          { step:'Steps 4-6', title:'Input Capture and Program Link', desc:'User enters debit account, credit account, and amount. CICS RECEIVE MAP captures input. AOR LINKs to FUNDXFR COBOL program passing data via COMMAREA.', color:C.info },
          { step:'Steps 7-10', title:'Validation and Balance Check', desc:'COBOL program validates inputs. DB2 SELECT with FOR UPDATE acquires row lock on debit account. Balance checked against transfer amount. Insufficient balance returns error.', color:C.warn },
          { step:'Steps 11-15', title:'DB2 Update and Commit', desc:'COBOL UPDATEs debit account (subtract), credit account (add), INSERTs transaction log entry. DB2 COMMIT makes all changes permanent atomically. SQLCODE 0 confirms success.', color:C.success },
          { step:'Steps 16-18', title:'MQ Notification', desc:'CICS WRITEQ TS puts notification message to IBM MQ queue. MQ channel transfers to distributed system. Consumer sends SMS/email notification to customer within 5 seconds.', color:C.danger },
          { step:'Steps 19-21', title:'Response to Terminal', desc:'COBOL sets return code 0 in COMMAREA. CICS SEND MAP displays confirmation screen with transaction reference, account details, amount, and new balance on 3270 terminal.', color:C.accent }
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, borderLeft:'4px solid ' + s.color }}>
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
            Mainframe Banking Testing Architecture
          </h1>
          <p style={{ color:C.muted, fontSize:15, lineHeight:1.6 }}>
            COBOL | CICS | DB2 | JCL | IMS | VSAM | Batch Processing - Banking QA Testing Dashboard
          </p>
          <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
            {badge(C.accent, 'COBOL')}{badge(C.warn, 'CICS TS')}{badge(C.danger, 'DB2 z/OS')}{badge(C.info, 'JCL/JES2')}{badge(C.success, 'IMS/TM')}{badge(C.warn, 'VSAM')}{badge(C.accent, 'z/OS Connect')}{badge(C.info, 'IBM MQ')}
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
                border: activeTab === tab.key ? `1px solid ${C.accent}` : '1px solid transparent',
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
          Mainframe Banking Testing Architecture | Banking QA Dashboard | COBOL | CICS | DB2 | JCL | IMS | VSAM | z/OS
        </div>
      </div>
    </div>
  );
}

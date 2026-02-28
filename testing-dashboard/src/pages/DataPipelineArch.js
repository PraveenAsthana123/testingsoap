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
  <pre style={{ background:C.editorBg, color:C.editorText, padding:20, borderRadius:8, overflowX:'auto', fontSize:13, lineHeight:1.6, border:`1px solid ${C.border}`, whiteSpace:'pre', fontFamily:'Fira Mono, Consolas, monospace' }}>{txt}</pre>
);

const card = (title, children, extra) => (
  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:20, marginBottom:16, ...extra }}>
    {title && <h3 style={{ color:C.accent, margin:'0 0 12px 0', fontSize:17 }}>{title}</h3>}
    <div style={{ color:C.text, fontSize:14, lineHeight:1.7 }}>{children}</div>
  </div>
);

const sectionTitle = (t) => <h2 style={{ color:C.header, borderBottom:`2px solid ${C.accent}`, paddingBottom:8, marginBottom:18, fontSize:22 }}>{t}</h2>;

const table = (headers, rows) => (
  <div style={{ overflowX:'auto', marginBottom:16 }}>
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
      <thead>
        <tr>{headers.map((h,i) => <th key={i} style={{ background:C.card, color:C.accent, padding:'10px 12px', textAlign:'left', borderBottom:`2px solid ${C.accent}`, whiteSpace:'nowrap' }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r,ri) => <tr key={ri} style={{ background: ri%2===0 ? 'rgba(15,52,96,0.4)' : 'transparent' }}>
          {r.map((c,ci) => <td key={ci} style={{ padding:'9px 12px', color:C.text, borderBottom:`1px solid ${C.border}`, verticalAlign:'top' }}>{c}</td>)}
        </tr>)}
      </tbody>
    </table>
  </div>
);

const badge = (text, color) => <span style={{ background:color||C.accent, color:'#000', padding:'2px 10px', borderRadius:12, fontSize:11, fontWeight:700, marginRight:6 }}>{text}</span>;

const grid2 = (children) => <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))', gap:16 }}>{children}</div>;

/* ========== TAB CONTENT RENDERERS ========== */

function renderArchitecture() {
  return (<div>
    {sectionTitle('Banking Data Pipeline Architecture Overview')}
    {card('System Context', <p>The Banking Data Pipeline platform provides end-to-end data integration, transformation, reconciliation, and reporting capabilities for a modern banking institution. It ingests data from core banking, card processing, treasury, lending, and payment systems, processes it through a multi-layered medallion architecture, and delivers curated datasets for regulatory reporting, analytics, and operational reconciliation.</p>)}

    {pre(`
+========================================================================================+
|                    BANKING DATA PIPELINE ARCHITECTURE                                   |
+========================================================================================+

  SOURCE SYSTEMS                INGESTION LAYER            PROCESSING LAYER
 +------------------+        +------------------+       +---------------------+
 | Core Banking     |------->|  Apache Kafka    |------>|  Apache Spark       |
 | (Finacle/T24)    |  CDC   |  (Real-time CDC) |       |  (Batch Transform)  |
 +------------------+        +------------------+       +---------------------+
 +------------------+        +------------------+       +---------------------+
 | Card System      |------->|  SFTP Gateway    |------>|  Apache Airflow     |
 | (Visa/MC Switch) | Files  |  (Batch Files)   |       |  (DAG Orchestrator) |
 +------------------+        +------------------+       +---------------------+
 +------------------+        +------------------+       +---------------------+
 | Loan Management  |------->|  REST APIs       |------>|  Data Quality       |
 | (LOS/LMS)       |  API   |  (Pull/Push)     |       |  (Great Expect.)    |
 +------------------+        +------------------+       +---------------------+
 +------------------+        +------------------+       +---------------------+
 | Treasury/FX      |------->|  MQ / JMS        |------>|  Reconciliation     |
 | (Murex/Calypso)  |  MSG   |  (Message Queue) |       |  Engine             |
 +------------------+        +------------------+       +---------------------+
 +------------------+
 | Payments (UPI/   |     DATA WAREHOUSE (MEDALLION)       REPORTING / CONSUMERS
 |  NACH/RTGS/NEFT) |    +------+  +--------+  +------+   +-------------------+
 +------------------+    |BRONZE|->| SILVER  |->| GOLD |-->| Tableau / PowerBI |
 +------------------+    | Raw  |  | Cleaned |  | Agg  |   +-------------------+
 | SWIFT Messages   |    +------+  +--------+  +------+   +-------------------+
 | (MT103/MT202)    |                                      | RBI Regulatory    |
 +------------------+                                      | Returns (DSB/DBS) |
                                                           +-------------------+
                                                           +-------------------+
                                                           | Operations        |
                                                           | Dashboard         |
                                                           +-------------------+
`)}

    <h3 style={{ color:C.accent, marginTop:24 }}>Core Components</h3>
    {grid2([
      card('ETL Orchestrator', <ul style={{margin:0,paddingLeft:18}}>
        <li>Apache Airflow DAGs for batch scheduling</li>
        <li>EOD/BOD job dependency management</li>
        <li>SLA monitoring and alerting</li>
        <li>Retry logic with exponential backoff</li>
        <li>Cross-system dependency resolution</li>
      </ul>),
      card('Data Quality Engine', <ul style={{margin:0,paddingLeft:18}}>
        <li>Great Expectations validation suites</li>
        <li>Schema drift detection (source system upgrades)</li>
        <li>Completeness, accuracy, consistency checks</li>
        <li>Referential integrity validation</li>
        <li>Business rule validation (e.g., debit = credit)</li>
      </ul>),
      card('Reconciliation Engine', <ul style={{margin:0,paddingLeft:18}}>
        <li>Exact match, fuzzy match, threshold match algorithms</li>
        <li>Nostro/Vostro account reconciliation</li>
        <li>ATM switch vs core banking reconciliation</li>
        <li>Card settlement (Visa/MC) reconciliation</li>
        <li>Break resolution workflow with aging</li>
      </ul>),
      card('EOD/BOD Batch Processor', <ul style={{margin:0,paddingLeft:18}}>
        <li>Interest accrual and posting</li>
        <li>Fee calculation and levy</li>
        <li>GL aggregation and trial balance</li>
        <li>Rate refresh (forex, interest rates)</li>
        <li>Limit reset and dormancy checks</li>
      </ul>),
      card('Data Lineage Tracker', <ul style={{margin:0,paddingLeft:18}}>
        <li>Column-level lineage from source to report</li>
        <li>Impact analysis for schema changes</li>
        <li>Apache Atlas / OpenLineage integration</li>
        <li>Regulatory audit trail (7-year retention)</li>
      </ul>),
      card('Audit Logger', <ul style={{margin:0,paddingLeft:18}}>
        <li>Every pipeline execution logged with correlation ID</li>
        <li>Data mutation tracking (before/after)</li>
        <li>User action audit for manual interventions</li>
        <li>Tamper-proof log storage (WORM)</li>
      </ul>)
    ])}

    <h3 style={{ color:C.accent, marginTop:24 }}>Architecture Patterns</h3>
    {table(['Pattern','Description','Banking Use Case'], [
      ['Lambda Architecture','Parallel batch + real-time processing paths','Batch EOD reports + real-time fraud alerts'],
      ['Medallion (Bronze/Silver/Gold)','Progressive data refinement layers','Raw CBS extracts -> Cleaned -> Aggregated GL'],
      ['Event Sourcing','Immutable event log as source of truth','Transaction journal for audit compliance'],
      ['CDC (Change Data Capture)','Capture incremental changes from source','Real-time account balance sync from Finacle'],
      ['Dead Letter Queue','Isolate failed messages for manual review','Failed SWIFT message parsing'],
      ['Circuit Breaker','Prevent cascade failures in integrations','Core banking API downtime handling'],
    ])}
  </div>);
}

function renderBRD() {
  return (<div>
    {sectionTitle('Business Requirements Document (BRD)')}
    {card('Project Overview', <div>
      <p><strong>Project:</strong> Enterprise Banking Data Pipeline & Reconciliation Platform</p>
      <p><strong>Sponsor:</strong> Chief Data Officer (CDO) / Head of Operations</p>
      <p><strong>Objective:</strong> Build a scalable, auditable data pipeline platform that enables real-time and batch data processing for regulatory reporting, customer analytics, risk management, and operational reconciliation across all banking verticals.</p>
      <p><strong>Regulatory Drivers:</strong> RBI Master Directions on IT Governance, BASEL III/IV reporting, AML/CFT compliance (PMLA 2002), DPIS (Data Privacy), CERSAI, SEBI reporting.</p>
    </div>)}

    {card('Business Objectives', <ol style={{paddingLeft:18, lineHeight:2}}>
      <li>Enable EOD batch processing completion within 4-hour SLA window (10 PM - 2 AM)</li>
      <li>Achieve 99.99% reconciliation accuracy across all settlement channels</li>
      <li>Provide T+0 data freshness for real-time dashboards and fraud monitoring</li>
      <li>Automate 100% of RBI regulatory return generation (DSB, DBS, CRILC, XBRL)</li>
      <li>Reduce manual reconciliation effort by 85% through automated matching</li>
      <li>Ensure full data lineage traceability from source to regulatory report</li>
      <li>Support 7-year data retention with immutable audit trails</li>
      <li>Enable self-service analytics for business users via curated Gold layer</li>
    </ol>)}

    {card('Scope', <div>
      <h4 style={{color:C.accent}}>In Scope</h4>
      {table(['Area','Details','Priority'], [
        ['EOD Processing','Interest calculation, fee posting, GL aggregation, trial balance','P0'],
        ['BOD Processing','Rate refresh (forex, PLR, MCLR), limit reset, dormancy check, maturity processing','P0'],
        ['Reconciliation','Nostro/Vostro, ATM switch, card settlement (Visa/MC), UPI (NPCI), NACH, RTGS/NEFT','P0'],
        ['Regulatory Reporting','RBI DSB returns, BASEL III capital adequacy, AML/STR filing, CRILC','P0'],
        ['Data Quality','Validation rules, completeness checks, anomaly detection, schema drift','P1'],
        ['Real-time Streaming','CDC from core banking, real-time transaction alerts, balance updates','P1'],
        ['Analytics','Customer 360, product profitability, branch performance, NPA monitoring','P2'],
        ['Data Lineage','Column-level lineage, impact analysis, regulatory audit trail','P1'],
      ])}
      <h4 style={{color:C.warn, marginTop:16}}>Out of Scope</h4>
      <ul style={{paddingLeft:18}}>
        <li>Core banking system changes (Finacle/T24 configuration)</li>
        <li>Card management system internals (CMS)</li>
        <li>Customer-facing application changes</li>
        <li>Physical data center infrastructure provisioning</li>
      </ul>
    </div>)}

    {card('Functional Requirements', <div>
      {table(['FR-ID','Requirement','Category','Priority'], [
        ['FR-01','System shall extract transaction data from Core Banking via CDC (Debezium) with <5 second latency','Ingestion','P0'],
        ['FR-02','System shall process batch files from Visa/MC in ISO 8583 and TC format within 30 minutes','Ingestion','P0'],
        ['FR-03','System shall validate all incoming data against predefined quality rules before loading','Data Quality','P0'],
        ['FR-04','System shall calculate interest accrual for all savings, current, and loan accounts during EOD','Processing','P0'],
        ['FR-05','System shall post fee charges (SMS, cheque book, debit card) to customer accounts','Processing','P0'],
        ['FR-06','System shall aggregate all GL entries and generate trial balance','Processing','P0'],
        ['FR-07','System shall perform automated nostro/vostro reconciliation with configurable matching rules','Reconciliation','P0'],
        ['FR-08','System shall reconcile ATM switch transactions against core banking entries','Reconciliation','P0'],
        ['FR-09','System shall process UPI settlement files from NPCI and reconcile with CBS','Reconciliation','P0'],
        ['FR-10','System shall generate RBI Daily Statistical Bulletin (DSB) returns automatically','Reporting','P0'],
        ['FR-11','System shall support SWIFT message parsing (MT103, MT202, MT940, MT950)','Processing','P0'],
        ['FR-12','System shall implement dead letter queue for failed records with manual review workflow','Error Handling','P0'],
        ['FR-13','System shall retry failed pipeline steps with exponential backoff (max 3 retries)','Error Handling','P1'],
        ['FR-14','System shall maintain data lineage from source column to report field','Lineage','P1'],
        ['FR-15','System shall detect and handle late-arriving transactions (up to T+3)','Processing','P1'],
        ['FR-16','System shall deduplicate transactions using composite key (txn_ref, date, amount, account)','Data Quality','P0'],
        ['FR-17','System shall process NACH mandate files (APBS/AEPS) from NPCI','Processing','P1'],
        ['FR-18','System shall calculate loan amortization schedules for all active loans','Processing','P1'],
        ['FR-19','System shall process fixed deposit maturity and auto-renewal instructions','Processing','P0'],
        ['FR-20','System shall execute standing instructions (SIs) during BOD processing','Processing','P0'],
        ['FR-21','System shall archive processed source files to cold storage after 90 days','Housekeeping','P2'],
        ['FR-22','System shall provide real-time pipeline monitoring dashboard with SLA tracking','Monitoring','P1'],
      ])}
    </div>)}

    {card('Non-Functional Requirements', <div>
      {table(['NFR-ID','Requirement','Target','Measurement'], [
        ['NFR-01','EOD batch completion time','< 4 hours','Airflow DAG duration metric'],
        ['NFR-02','Zero data loss guarantee','100%','Kafka offset tracking, checkpointing'],
        ['NFR-03','Real-time data freshness','< 15 minutes','CDC lag monitoring'],
        ['NFR-04','Reconciliation accuracy','99.99%','Matched vs total records ratio'],
        ['NFR-05','System availability','99.9% uptime','Infrastructure monitoring'],
        ['NFR-06','Batch processing throughput','10M records/hour','Spark job metrics'],
        ['NFR-07','Data retention period','7 years (regulatory)','Storage lifecycle policies'],
        ['NFR-08','Recovery Time Objective (RTO)','< 1 hour','DR drill metrics'],
        ['NFR-09','Recovery Point Objective (RPO)','< 5 minutes','Replication lag'],
        ['NFR-10','Concurrent pipeline capacity','50 parallel DAGs','Airflow worker scaling'],
      ])}
    </div>)}
  </div>);
}

function renderHLD() {
  return (<div>
    {sectionTitle('High-Level Design (HLD)')}
    {card('Data Flow Architecture', <p>The high-level design illustrates the end-to-end data flow from 10+ source banking systems through ingestion, processing, storage, and consumption layers. Each layer implements security controls, data quality checkpoints, and audit logging.</p>)}

    {pre(`
+============================================================================================+
|                         HIGH-LEVEL DATA FLOW ARCHITECTURE                                   |
+============================================================================================+

  ZONE: DMZ / EXTERNAL                    ZONE: INTERNAL / PROCESSING
 +---------------------------+           +------------------------------------------+
 |  EXTERNAL SOURCES         |           |  INGESTION LAYER                         |
 |                           |           |                                          |
 |  [NPCI]--UPI/NACH Files---+---------->|  +----------+    +------------------+   |
 |  [VISA]--Settlement Files-+---------->|  | SFTP     |--->| File Watcher     |   |
 |  [MC]----TC/IPM Files-----+---------->|  | Gateway  |    | (Apache NiFi)    |   |
 |  [SWIFT]--MT103/MT202-----+---------->|  +----------+    +--------+---------+   |
 |  [RBI]---Rate Feeds-------+---------->|                           |              |
 +---------------------------+           |  +----------+    +--------v---------+   |
                                         |  | Kafka    |<---| Debezium CDC     |   |
  ZONE: INTERNAL / SOURCE                |  | Cluster  |    | Connectors       |   |
 +---------------------------+           |  | (3 node) |    +------------------+   |
 |  CORE BANKING SYSTEMS     |           |  +----+-----+                           |
 |                           |    CDC    |       |                                  |
 |  [Finacle CBS]------------+---------->|       |  +------------------+           |
 |  [Card Mgmt System]------+---------->|       +->| Schema Registry  |           |
 |  [Loan Origination]------+---------->|       |  | (Confluent)      |           |
 |  [Treasury (Murex)]------+---------->|       |  +------------------+           |
 |  [Trade Finance]----------+---------->|       |                                  |
 |  [Internet Banking]------+---------->|       v                                  |
 |  [Mobile Banking]---------+---------->|  +-----------------------------------+  |
 |  [ATM Switch]-------------+---------->|  | PROCESSING LAYER                  |  |
 |  [POS Switch]-------------+---------->|  |                                   |  |
 |  [HRMS/Payroll]-----------+---------->|  | +--------+  +---------+  +------+ |  |
 +---------------------------+           |  | |Airflow |->|Spark    |->|Data  | |  |
                                         |  | |DAGs    |  |Jobs     |  |Qual. | |  |
                                         |  | +--------+  +---------+  +------+ |  |
                                         |  +-----------------------------------+  |
                                         +------------------+-+--------------------+

  ZONE: DATA WAREHOUSE                    ZONE: CONSUMPTION
 +---------------------------+           +------------------------------------------+
 |  MEDALLION ARCHITECTURE   |           |  CONSUMERS                               |
 |                           |           |                                          |
 |  +-------+  VALIDATE      |           |  [Tableau/PowerBI]----Dashboards         |
 |  |BRONZE |  & CLEANSE     |           |  [RBI Portal]--------Regulatory Returns  |
 |  | Raw   |------+         |           |  [Recon Dashboard]---Break Management    |
 |  | Land  |      |         |           |  [Risk Engine]-------BASEL Reports       |
 |  +-------+      v         |           |  [AML System]--------STR/CTR Filing     |
 |  +-------+  ENRICH &      |           |  [Customer 360]------Analytics           |
 |  |SILVER |  CONFORM       |           |  [Ops Dashboard]-----Pipeline Monitoring |
 |  |Cleaned|------+         |           |                                          |
 |  +-------+      |         |           +------------------------------------------+
 |  +-------+      v         |
 |  | GOLD  |  AGGREGATE     |            ZONE: MONITORING
 |  |Curated|  & PUBLISH     |           +------------------------------------------+
 |  +-------+                |           |  [Grafana]----Pipeline Metrics            |
 |                           |           |  [PagerDuty]--SLA Breach Alerts           |
 +---------------------------+           |  [ELK Stack]--Log Aggregation             |
                                         +------------------------------------------+
`)}

    {card('Integration Points', <div>
      {table(['Source System','Protocol','Format','Frequency','Volume/Day'], [
        ['Finacle Core Banking','JDBC / CDC (Debezium)','Database tables (Oracle)','Real-time CDC + EOD batch','50M+ transactions'],
        ['Visa Settlement','SFTP','TC (Transaction Clearing) files','Daily (T+1)','2M records'],
        ['Mastercard Settlement','SFTP','IPM (Integrated Product Messages)','Daily (T+1)','1.5M records'],
        ['NPCI UPI','SFTP + API','CSV settlement files','Hourly batches','20M+ transactions'],
        ['NPCI NACH','SFTP','ACH file format (APBS/AEPS)','Daily batches','5M mandates'],
        ['SWIFT Alliance','MQ Series','MT103, MT202, MT940, MT950','Real-time','50K messages'],
        ['ATM Switch','Database link','Switch transaction logs','Real-time + EOD','10M transactions'],
        ['RBI XBRL','HTTPS API','XBRL taxonomy','Monthly/Quarterly','Regulatory returns'],
        ['Treasury (Murex)','FIX Protocol + Files','FpML, FIX messages','Real-time + EOD','100K deals'],
        ['HRMS/Payroll','REST API','JSON','Monthly','50K records'],
      ])}
    </div>)}

    {card('Security Zones & Data Classification', <div>
      {table(['Zone','Systems','Data Classification','Controls'], [
        ['DMZ','SFTP Gateway, API Gateway','Public/External','WAF, TLS 1.3, IP whitelisting'],
        ['Internal Processing','Kafka, Spark, Airflow','Confidential','Network segmentation, RBAC, encryption at rest'],
        ['Data Warehouse','Snowflake/BigQuery','Confidential/Restricted','Column-level masking, row-level security'],
        ['Monitoring','Grafana, ELK','Internal','Read-only access, no PII in logs'],
      ])}
    </div>)}
  </div>);
}

function renderLLD() {
  return (<div>
    {sectionTitle('Low-Level Design (LLD)')}

    {card('Airflow DAG Definition - EOD Processing', pre(`
# dag_eod_processing.py
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.sensors.external_task import ExternalTaskSensor
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-engineering',
    'depends_on_past': True,
    'email': ['data-ops@bank.com'],
    'email_on_failure': True,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True,
    'max_retry_delay': timedelta(minutes=30),
    'execution_timeout': timedelta(hours=4),
    'sla': timedelta(hours=4),
}

dag = DAG(
    dag_id='eod_batch_processing',
    default_args=default_args,
    description='End of Day Batch Processing Pipeline',
    schedule_interval='0 22 * * *',  # 10 PM daily
    start_date=datetime(2024, 1, 1),
    catchup=False,
    max_active_runs=1,
    tags=['eod', 'critical', 'batch'],
)

# Task: Lock transaction posting
lock_txns = PythonOperator(
    task_id='lock_transactions',
    python_callable=lock_transaction_posting,
    dag=dag,
)

# Task: Extract day's transactions from CBS
extract_txns = PythonOperator(
    task_id='extract_transactions',
    python_callable=extract_daily_transactions,
    op_kwargs={'source': 'finacle', 'batch_date': '{{ ds }}'},
    dag=dag,
)

# Task: Data quality validation
validate_data = PythonOperator(
    task_id='validate_data_quality',
    python_callable=run_data_quality_checks,
    op_kwargs={'suite': 'eod_transaction_suite'},
    dag=dag,
)

# Task: Interest calculation (Spark job)
calc_interest = BashOperator(
    task_id='calculate_interest',
    bash_command='spark-submit --master yarn --deploy-mode cluster '
                 '--conf spark.sql.shuffle.partitions=200 '
                 'jobs/interest_calculation.py --date {{ ds }}',
    dag=dag,
)

# Task: Fee posting
post_fees = PythonOperator(
    task_id='post_fees',
    python_callable=execute_fee_posting,
    dag=dag,
)

# Task: GL aggregation
gl_aggregation = PythonOperator(
    task_id='gl_aggregation',
    python_callable=aggregate_gl_entries,
    dag=dag,
)

# Task: Reconciliation
run_recon = PythonOperator(
    task_id='run_reconciliation',
    python_callable=execute_reconciliation,
    op_kwargs={'recon_type': 'eod_gl_balance'},
    dag=dag,
)

# Task: Generate reports
gen_reports = PythonOperator(
    task_id='generate_reports',
    python_callable=generate_eod_reports,
    dag=dag,
)

# Task: Unlock and notify
unlock_notify = PythonOperator(
    task_id='unlock_and_notify',
    python_callable=unlock_and_send_notifications,
    dag=dag,
)

# DAG Dependencies
lock_txns >> extract_txns >> validate_data
validate_data >> [calc_interest, post_fees]
[calc_interest, post_fees] >> gl_aggregation
gl_aggregation >> run_recon >> gen_reports >> unlock_notify
`))}

    {card('Spark Job Configuration - Interest Calculation', pre(`
# interest_calculation.py
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.window import Window

spark = SparkSession.builder \\
    .appName("EOD_Interest_Calculation") \\
    .config("spark.sql.shuffle.partitions", "200") \\
    .config("spark.sql.adaptive.enabled", "true") \\
    .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \\
    .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \\
    .enableHiveSupport() \\
    .getOrCreate()

# Read account balances
accounts_df = spark.read.format("jdbc") \\
    .option("url", "jdbc:oracle:thin:@cbs-db:1521/FINACLE") \\
    .option("dbtable", "GAM") \\  # General Account Master
    .option("fetchsize", "10000") \\
    .load()

# Read interest rate master
rates_df = spark.read.table("silver.interest_rate_master")

# Calculate daily interest accrual
interest_df = accounts_df \\
    .join(rates_df, accounts_df.schm_code == rates_df.scheme_code) \\
    .withColumn("daily_rate", F.col("annual_rate") / 365) \\
    .withColumn("interest_amount",
        F.round(F.col("clr_bal_amt") * F.col("daily_rate") / 100, 2)) \\
    .withColumn("accrual_date", F.current_date()) \\
    .select("foracid", "clr_bal_amt", "annual_rate",
            "daily_rate", "interest_amount", "accrual_date")

# Write to Gold layer
interest_df.write \\
    .format("delta") \\
    .mode("append") \\
    .partitionBy("accrual_date") \\
    .saveAsTable("gold.daily_interest_accrual")
`))}

    {card('Data Quality Rules (Great Expectations)', pre(`
# great_expectations/suites/eod_transaction_suite.json
{
  "expectation_suite_name": "eod_transaction_validation",
  "expectations": [
    {
      "expectation_type": "expect_table_row_count_to_be_between",
      "kwargs": { "min_value": 100000, "max_value": 50000000 }
    },
    {
      "expectation_type": "expect_column_values_to_not_be_null",
      "kwargs": { "column": "transaction_id" }
    },
    {
      "expectation_type": "expect_column_values_to_be_unique",
      "kwargs": { "column": "transaction_id" }
    },
    {
      "expectation_type": "expect_column_values_to_not_be_null",
      "kwargs": { "column": "account_number" }
    },
    {
      "expectation_type": "expect_column_values_to_match_regex",
      "kwargs": {
        "column": "account_number",
        "regex": "^[0-9]{10,18}$"
      }
    },
    {
      "expectation_type": "expect_column_values_to_be_between",
      "kwargs": {
        "column": "transaction_amount",
        "min_value": 0.01,
        "max_value": 999999999999.99
      }
    },
    {
      "expectation_type": "expect_column_values_to_be_in_set",
      "kwargs": {
        "column": "debit_credit_flag",
        "value_set": ["D", "C"]
      }
    },
    {
      "expectation_type": "expect_column_pair_values_to_be_equal",
      "kwargs": {
        "column_A": "total_debits",
        "column_B": "total_credits",
        "comment": "GL must balance: sum(debits) = sum(credits)"
      }
    }
  ]
}
`))}

    {card('Reconciliation Matching Algorithms', <div>
      {table(['Algorithm','Description','Use Case','Accuracy'], [
        ['Exact Match','All key fields match precisely','ATM switch vs CBS (txn_ref, amount, date)','100%'],
        ['Fuzzy Match','Levenshtein distance on name/description fields','SWIFT beneficiary name matching','95%+'],
        ['Threshold Match','Amount within configurable tolerance (e.g., +/- 0.01)','FX conversion rounding differences','99.5%'],
        ['Composite Key Match','Hash of multiple fields for dedup + matching','Card settlement (PAN+amount+date+auth_code)','99.9%'],
        ['Date Window Match','Match within +/- N days for cross-border settlements','Nostro reconciliation (value date +/- 2 days)','98%'],
        ['Rule-Based Match','Configurable business rules engine','Multi-currency reconciliation with rate tolerance','97%'],
      ])}
    </div>)}

    {card('Database Schemas', pre(`
-- Staging Tables
CREATE TABLE stg_transactions (
    batch_id            VARCHAR(50) NOT NULL,
    source_system       VARCHAR(20) NOT NULL,
    transaction_id      VARCHAR(50) NOT NULL,
    account_number      VARCHAR(18) NOT NULL,
    transaction_date    DATE NOT NULL,
    value_date          DATE,
    amount              DECIMAL(18,2) NOT NULL,
    currency            CHAR(3) DEFAULT 'INR',
    debit_credit        CHAR(1) NOT NULL,
    description         VARCHAR(200),
    channel             VARCHAR(20),
    loaded_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quality_status      VARCHAR(10) DEFAULT 'PENDING',
    PRIMARY KEY (batch_id, transaction_id)
);

-- Reconciliation Tables
CREATE TABLE recon_header (
    recon_id            SERIAL PRIMARY KEY,
    recon_type          VARCHAR(30) NOT NULL,
    recon_date          DATE NOT NULL,
    source_a            VARCHAR(30) NOT NULL,
    source_b            VARCHAR(30) NOT NULL,
    total_source_a      INTEGER,
    total_source_b      INTEGER,
    matched_count       INTEGER DEFAULT 0,
    unmatched_a         INTEGER DEFAULT 0,
    unmatched_b         INTEGER DEFAULT 0,
    match_percentage    DECIMAL(5,2),
    status              VARCHAR(15) DEFAULT 'IN_PROGRESS',
    started_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at        TIMESTAMP,
    created_by          VARCHAR(50)
);

CREATE TABLE recon_detail (
    detail_id           SERIAL PRIMARY KEY,
    recon_id            INTEGER REFERENCES recon_header(recon_id),
    source_a_ref        VARCHAR(50),
    source_b_ref        VARCHAR(50),
    match_status        VARCHAR(15) NOT NULL,  -- MATCHED, BREAK, PENDING
    match_type          VARCHAR(15),           -- EXACT, FUZZY, THRESHOLD
    amount_a            DECIMAL(18,2),
    amount_b            DECIMAL(18,2),
    difference          DECIMAL(18,2),
    break_reason        VARCHAR(100),
    resolution_status   VARCHAR(15) DEFAULT 'OPEN',
    resolved_by         VARCHAR(50),
    resolved_at         TIMESTAMP
);

-- Audit Tables
CREATE TABLE pipeline_audit_log (
    audit_id            SERIAL PRIMARY KEY,
    pipeline_name       VARCHAR(100) NOT NULL,
    dag_run_id          VARCHAR(100),
    task_id             VARCHAR(100),
    status              VARCHAR(15) NOT NULL,
    records_processed   INTEGER,
    records_failed      INTEGER,
    error_message       TEXT,
    started_at          TIMESTAMP NOT NULL,
    completed_at        TIMESTAMP,
    correlation_id      UUID NOT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_stg_txn_date ON stg_transactions(transaction_date);
CREATE INDEX idx_stg_account ON stg_transactions(account_number);
CREATE INDEX idx_stg_quality ON stg_transactions(quality_status);
CREATE INDEX idx_recon_date ON recon_header(recon_date);
CREATE INDEX idx_recon_status ON recon_header(status);
CREATE INDEX idx_recon_detail_status ON recon_detail(match_status);
CREATE INDEX idx_audit_pipeline ON pipeline_audit_log(pipeline_name);
CREATE INDEX idx_audit_created ON pipeline_audit_log(created_at);
`))}

    {card('API Contracts - Pipeline Monitoring', pre(`
# GET /api/v1/pipelines/status
# Response:
{
  "pipelines": [
    {
      "dag_id": "eod_batch_processing",
      "last_run": "2024-12-15T22:00:00Z",
      "status": "SUCCESS",
      "duration_seconds": 7200,
      "tasks_total": 9,
      "tasks_completed": 9,
      "tasks_failed": 0,
      "sla_met": true,
      "next_scheduled": "2024-12-16T22:00:00Z"
    }
  ],
  "total": 15,
  "offset": 0,
  "limit": 50
}

# POST /api/v1/reconciliation/run
# Request:
{
  "recon_type": "NOSTRO_VOSTRO",
  "recon_date": "2024-12-15",
  "source_a": "CBS_NOSTRO_EXTRACT",
  "source_b": "CORRESPONDENT_STATEMENT",
  "matching_rules": {
    "primary_key": ["transaction_ref", "value_date"],
    "amount_tolerance": 0.01,
    "date_window_days": 2,
    "currency_conversion": true
  }
}
# Response: 202 Accepted
{
  "recon_id": 4567,
  "status": "QUEUED",
  "estimated_completion": "2024-12-15T23:30:00Z",
  "tracking_url": "/api/v1/reconciliation/4567/status"
}
`))}
  </div>);
}

function renderScenarios() {
  const scenarios = [
    { id:'SC-01', title:'EOD Interest Calculation Batch', desc:'Validate that the EOD batch correctly calculates daily interest accrual for all savings, current, FD, and loan accounts using the applicable rate scheme (PLR, MCLR, repo-linked). Verify interest is computed on cleared balance, accounts with zero/negative balance are handled, and NPA accounts use different accrual rules.', type:'Batch', priority:'P0' },
    { id:'SC-02', title:'BOD Rate Refresh Job', desc:'Verify that Beginning-of-Day processing refreshes forex rates from RBI reference rates, updates PLR/MCLR/base rates from treasury feed, resets daily transaction limits for debit cards and net banking, and processes overnight FCNR/NRE deposit rate changes.', type:'Batch', priority:'P0' },
    { id:'SC-03', title:'GL Aggregation & Balancing', desc:'Validate that all debit entries exactly equal credit entries in the General Ledger after EOD. Verify sub-ledger to GL reconciliation, profit center-wise aggregation, and that trial balance is zero-balanced. Flag any out-of-balance conditions immediately.', type:'Reconciliation', priority:'P0' },
    { id:'SC-04', title:'Nostro/Vostro Reconciliation', desc:'Reconcile the bank nostro account entries with correspondent bank statements (SWIFT MT940/MT950). Handle multi-currency entries, value date mismatches (up to T+2), and FX conversion differences within tolerance. Identify and age unmatched items.', type:'Reconciliation', priority:'P0' },
    { id:'SC-05', title:'ATM Transaction Reconciliation', desc:'Reconcile ATM switch transaction logs against core banking system entries. Handle on-us and off-us transactions, failed transactions with reversal entries, cash dispensed vs debited mismatches, and ATM replenishment entries.', type:'Reconciliation', priority:'P0' },
    { id:'SC-06', title:'Card Settlement File Processing (Visa/MC)', desc:'Process daily settlement files from Visa (TC files) and Mastercard (IPM files). Validate file checksums, parse transaction records, apply interchange fees, handle chargebacks and representments, and reconcile net settlement amounts.', type:'Batch', priority:'P0' },
    { id:'SC-07', title:'UPI Settlement Reconciliation (NPCI)', desc:'Process hourly UPI settlement files from NPCI. Reconcile UPI collect/pay transactions, handle dispute cases, validate settlement amounts against CBS entries, process UPI mandate (AutoPay) settlements, and handle UDIR (UPI Dispute Resolution) entries.', type:'Reconciliation', priority:'P0' },
    { id:'SC-08', title:'SWIFT Message Processing (MT103/MT202)', desc:'Parse and process inward/outward SWIFT messages. Validate MT103 (customer transfers) and MT202 (bank transfers) fields against SWIFT standards. Handle STP (Straight Through Processing) for eligible messages and queue others for manual review.', type:'Batch', priority:'P0' },
    { id:'SC-09', title:'Data Quality Validation Failure Handling', desc:'Simulate various data quality failures: null mandatory fields, invalid account numbers, negative amounts, future-dated transactions, duplicate transaction IDs. Verify records are routed to dead letter queue, alerts are triggered, and pipeline continues processing valid records.', type:'Data Quality', priority:'P0' },
    { id:'SC-10', title:'Late-Arriving Transaction Processing', desc:'Handle transactions that arrive after EOD cutoff or from delayed settlement channels (T+1, T+2, T+3). Verify back-value dating logic, interest adjustment calculations, and GL correction entries are posted correctly.', type:'Batch', priority:'P1' },
    { id:'SC-11', title:'Duplicate Transaction Detection', desc:'Validate duplicate detection using composite key matching (transaction_ref + date + amount + account). Handle legitimate duplicates (e.g., same amount/date to same account), near-duplicates with minor field differences, and batch file resubmission scenarios.', type:'Data Quality', priority:'P0' },
    { id:'SC-12', title:'Large File Processing (10M+ Records)', desc:'Process a settlement file containing 10 million+ records. Validate Spark job parallelism, memory management, partition strategy, checkpoint/restart capability, and completion within SLA. Monitor for data skew and OOM errors.', type:'Performance', priority:'P1' },
    { id:'SC-13', title:'Pipeline Failure & Auto-Recovery', desc:'Simulate failures at various pipeline stages: source system timeout, Kafka broker failure, Spark executor OOM, database connection pool exhaustion. Verify retry logic, dead letter queue routing, alerting, and automatic recovery without data loss.', type:'Reliability', priority:'P0' },
    { id:'SC-14', title:'Data Lineage Tracking', desc:'Trace a single transaction from source system (Finacle CBS) through Bronze (raw landing), Silver (cleaned/conformed), to Gold (aggregated GL entry) and final regulatory report field. Verify column-level lineage metadata is captured at each transformation.', type:'Lineage', priority:'P1' },
    { id:'SC-15', title:'Regulatory Report Generation (RBI DSB)', desc:'Generate RBI Daily Statistical Bulletin returns. Validate data completeness for all required fields, XBRL taxonomy compliance, cross-validation rules between report sections, and submission file format. Compare with previous day for anomaly detection.', type:'Reporting', priority:'P0' },
    { id:'SC-16', title:'NACH Mandate File Processing', desc:'Process NACH (National Automated Clearing House) mandate files from NPCI. Validate APBS (Aadhaar Payment Bridge) and AEPS transactions, handle mandate registration/amendment/cancellation, and reconcile settlement with CBS entries.', type:'Batch', priority:'P1' },
    { id:'SC-17', title:'Loan Amortization Schedule Calculation', desc:'Calculate and validate EMI amortization schedules for all active loans. Handle fixed-rate and floating-rate loans, rate resets (quarterly/annual), prepayment adjustments, moratorium periods, and restructured loan schedules as per RBI guidelines.', type:'Batch', priority:'P1' },
    { id:'SC-18', title:'Fixed Deposit Maturity Processing', desc:'Process FD maturity during EOD/BOD. Handle auto-renewal instructions, premature closure requests, TDS deduction and certificate generation, senior citizen additional rate application, and sweep-in/sweep-out FD operations.', type:'Batch', priority:'P0' },
    { id:'SC-19', title:'Standing Instruction Execution', desc:'Execute standing instructions during BOD processing. Handle recurring fund transfers (internal and NEFT/RTGS), SIP investments, insurance premium payments, loan EMI debits, and RD installments. Process insufficient balance scenarios with retry logic.', type:'Batch', priority:'P0' },
    { id:'SC-20', title:'Cross-Border Remittance Reconciliation', desc:'Reconcile cross-border remittance transactions involving SWIFT transfers, correspondent bank chains, and multi-currency conversions. Handle OFAC/sanctions screening results, LRS (Liberalised Remittance Scheme) limit tracking, and FEMA compliance validations.', type:'Reconciliation', priority:'P1' },
  ];
  const typeColors = { Batch:C.info, Reconciliation:C.accent, 'Data Quality':C.warn, Performance:C.danger, Reliability:'#9b59b6', Lineage:'#1abc9c', Reporting:'#e67e22' };
  return (<div>
    {sectionTitle('Test Scenarios (20 Banking Data Pipeline Scenarios)')}
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(420px,1fr))', gap:16 }}>
      {scenarios.map(s => (
        <div key={s.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ color:C.accent, fontWeight:700, fontSize:15 }}>{s.id}</span>
            <div>{badge(s.type, typeColors[s.type]||C.info)} {badge(s.priority, s.priority==='P0'?C.danger:C.warn)}</div>
          </div>
          <h4 style={{ color:C.header, margin:'0 0 8px 0', fontSize:15 }}>{s.title}</h4>
          <p style={{ color:C.text, fontSize:13, lineHeight:1.6, margin:0 }}>{s.desc}</p>
        </div>
      ))}
    </div>
  </div>);
}

function renderTestCases() {
  const tcs = [
    ['TC-DP-001','EOD Interest Accrual - Savings Account','Active savings accounts with positive cleared balance; interest rate master loaded','1. Trigger EOD batch at scheduled time\n2. Extract all savings account balances\n3. Apply daily interest rate (annual/365)\n4. Post accrual entries to interest accrual GL\n5. Verify account-level accrual amounts','Interest calculated correctly for each account; GL debit=credit; NPA accounts excluded from accrual; Zero-balance accounts skipped','P0','Functional'],
    ['TC-DP-002','EOD GL Trial Balance Validation','All EOD sub-processes (interest, fees, charges) completed','1. Aggregate all GL entries posted during EOD\n2. Sum all debit entries\n3. Sum all credit entries\n4. Compare totals\n5. Generate trial balance report','Total debits = Total credits (zero difference); All profit centers balanced; Report generated in standard format','P0','Data Quality'],
    ['TC-DP-003','Nostro Reconciliation - Exact Match','Nostro extract from CBS and MT940 statement from correspondent bank available','1. Load CBS nostro entries for the day\n2. Parse MT940 statement entries\n3. Run exact match on (txn_ref, value_date, amount, currency)\n4. Identify matched and unmatched items\n5. Generate break report','Match rate > 95%; All matched items flagged correctly; Unmatched items categorized (missing in CBS / missing in statement)','P0','Reconciliation'],
    ['TC-DP-004','ATM Switch Reconciliation','ATM switch log extracted; CBS ATM transaction entries available','1. Extract ATM switch transactions for the day\n2. Extract CBS ATM debit entries\n3. Match on (RRN, amount, card_number, terminal_id)\n4. Handle reversal entries (pair matching)\n5. Flag discrepancies','All successful ATM withdrawals matched; Failed transactions with reversals paired; Net settlement amount reconciled','P0','Reconciliation'],
    ['TC-DP-005','Visa Settlement File Processing','Visa TC (Transaction Clearing) file received via SFTP','1. Validate file checksum and header record count\n2. Parse TC file records (TCR0-TCR7)\n3. Extract transaction details and interchange fees\n4. Load to staging table\n5. Reconcile against CBS card transaction entries','File parsed without errors; Record count matches header; All transactions loaded; Interchange fees calculated correctly','P0','Functional'],
    ['TC-DP-006','Data Quality - Null Mandatory Fields','Batch file with intentionally null mandatory fields (account_number, amount)','1. Submit batch file with null values in mandatory columns\n2. Run data quality validation suite\n3. Check validation results\n4. Verify rejected records routed to DLQ\n5. Verify valid records continue processing','Null records rejected with clear error codes; DLQ populated; Valid records processed successfully; Alert sent to data ops team','P0','Data Quality'],
    ['TC-DP-007','Duplicate Transaction Detection','Batch file containing exact and near-duplicate transactions','1. Submit file with duplicate transaction_ids\n2. Submit file with same amount/date/account but different txn_id\n3. Run deduplication logic\n4. Check dedup results','Exact duplicates (same txn_id) rejected; Near-duplicates flagged for review; Original records processed; Dedup metrics logged','P0','Data Quality'],
    ['TC-DP-008','Pipeline Retry on Source System Timeout','Core banking system configured to simulate timeout after initial connection','1. Trigger data extraction from CBS\n2. Simulate CBS timeout after 30 seconds\n3. Verify retry attempt #1 (delay: 5 min)\n4. Verify retry attempt #2 (delay: 10 min)\n5. On 3rd failure, verify DLQ routing and alert','Retry logic executes with exponential backoff; Each attempt logged with correlation_id; After max retries, job marked FAILED; PagerDuty alert triggered; No partial data loaded','P0','Functional'],
    ['TC-DP-009','Large Volume Batch Processing (10M Records)','10M record test file prepared; Spark cluster scaled appropriately','1. Submit 10M record settlement file\n2. Monitor Spark job execution (partitioning, memory)\n3. Verify all records processed\n4. Check processing time against SLA\n5. Validate data integrity (row count, checksums)','All 10M records processed without OOM errors; Processing completed within 2-hour SLA; No data loss (source count = target count); Checkpoint/restart capability verified','P1','Performance'],
    ['TC-DP-010','UPI Settlement Reconciliation','NPCI UPI settlement file received; CBS UPI transaction entries available','1. Parse NPCI settlement CSV file\n2. Extract CBS UPI transactions for settlement window\n3. Match on (UPI_txn_id, amount, payer_VPA, payee_VPA)\n4. Handle dispute/reversal entries\n5. Reconcile net settlement amount','Match rate > 99%; Dispute entries correctly excluded from settlement; Net amount matches NPCI settlement instruction; Breaks aged and categorized','P0','Reconciliation'],
    ['TC-DP-011','Schema Drift Detection','Source system (CBS) adds new column or changes column data type','1. Simulate adding new column to source table\n2. Trigger CDC extraction\n3. Verify schema registry detects change\n4. Check pipeline handles gracefully\n5. Alert data engineering team','Schema change detected and logged; Pipeline does not crash; New column handled (ignored or added based on config); Alert sent with diff details','P1','Data Quality'],
    ['TC-DP-012','SWIFT MT103 Inward Remittance Processing','Inward SWIFT MT103 message received on MQ','1. Receive MT103 message from MQ\n2. Parse all mandatory fields (20, 23B, 32A, 50K, 59)\n3. Validate beneficiary account in CBS\n4. Run sanctions/OFAC screening\n5. Post credit to beneficiary account or queue for manual processing','MT103 parsed correctly; Valid beneficiary credited within STP SLA; Sanctions hit queued for compliance review; Audit trail complete','P0','Functional'],
    ['TC-DP-013','RBI DSB Regulatory Return Generation','Gold layer data available for reporting date; Previous day return for comparison','1. Extract required data points from Gold layer\n2. Apply RBI DSB taxonomy mappings\n3. Run cross-validation rules between sections\n4. Generate XBRL output file\n5. Compare with previous day for anomaly detection','All required fields populated; XBRL file validates against RBI taxonomy; Cross-section totals balance; Variance from previous day within expected range','P0','Functional'],
    ['TC-DP-014','NACH Mandate Processing','NACH mandate file (APBS format) received from NPCI','1. Parse NACH mandate file\n2. Validate mandate registration details\n3. Process debit instructions against customer accounts\n4. Handle insufficient balance cases\n5. Generate response file for NPCI','Mandates processed correctly; Insufficient balance entries returned with reason code R01; Response file format compliant; Settlement amount reconciled','P1','Functional'],
    ['TC-DP-015','EOD - Fixed Deposit Maturity Processing','FDs maturing on processing date identified; Auto-renewal instructions available','1. Identify all FDs maturing today\n2. Check renewal instructions for each FD\n3. Process auto-renewal (create new FD at current rate)\n4. Process non-renewal (credit proceeds to linked account)\n5. Calculate and deduct TDS where applicable','Matured FDs processed correctly; Auto-renewed FDs created at current applicable rate; TDS deducted at correct rate (10% or 20% without PAN); Proceeds credited for non-renewal; Senior citizen rate applied where eligible','P0','Functional'],
    ['TC-DP-016','Late-Arriving Transaction Back-Value Dating','Transactions arriving T+2 with original value date','1. Receive late transactions with back-value dates\n2. Verify interest adjustment calculation\n3. Post adjustment entries to correct period\n4. Update GL for affected dates\n5. Flag in reconciliation as late-arrived','Interest correctly adjusted for back-valued period; GL correction entries posted; Reconciliation report shows late-arrival flag; No double-counting in regulatory reports','P1','Functional'],
    ['TC-DP-017','Data Lineage - End-to-End Tracing','Transaction data loaded from source to Gold layer','1. Pick a sample transaction from source (Finacle)\n2. Trace through Bronze layer (raw landing)\n3. Trace through Silver layer (cleaned/conformed)\n4. Trace to Gold layer (aggregated)\n5. Trace to regulatory report field','Column-level lineage captured at each stage; Transformation logic documented; No data loss or corruption across layers; Lineage queryable via API','P1','Data Quality'],
    ['TC-DP-018','BOD Rate Refresh and Limit Reset','New day rates published by Treasury; Previous day limits consumed','1. Trigger BOD processing\n2. Refresh forex rates from RBI reference rates\n3. Update PLR/MCLR/base rates from treasury feed\n4. Reset daily transaction limits (debit card, net banking, UPI)\n5. Process overnight deposit rate changes','All rates updated before first transaction; Limits reset to configured daily maximums; Rate effective date correctly set; Audit trail of old vs new rates','P0','Functional'],
    ['TC-DP-019','Standing Instruction Execution - Insufficient Balance','SI scheduled for accounts with insufficient balance','1. Trigger BOD SI processing\n2. Attempt fund transfer for SI with insufficient balance\n3. Apply retry logic (attempt at 10 AM, 2 PM, 4 PM)\n4. After all retries fail, mark SI as failed for the day\n5. Send notification to customer','SI executed for accounts with sufficient balance; Retry attempts made at configured intervals; Failed SIs logged with reason code; Customer SMS/email notification sent; SI not cancelled (retries next cycle)','P0','Functional'],
    ['TC-DP-020','Cross-Border Remittance - Multi-Currency Reconciliation','Outward remittance via SWIFT with INR-USD-EUR conversion chain','1. Process outward remittance (INR to USD)\n2. Track correspondent bank legs (intermediary in EUR)\n3. Reconcile each leg with applicable FX rate\n4. Verify FEMA compliance (purpose code, LRS limit)\n5. Match final credit confirmation from beneficiary bank','Each leg reconciled with correct FX rate; Total charges (correspondent + intermediary) tracked; LRS limit updated for customer; FEMA purpose code validated; End-to-end SLA tracked','P1','Reconciliation'],
  ];
  return (<div>
    {sectionTitle('Test Cases (20 Detailed Banking Data Pipeline Test Cases)')}
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
        <thead>
          <tr>
            {['TC-ID','Title','Precondition','Steps','Expected Result','Pri','Type'].map((h,i) => (
              <th key={i} style={{ background:C.card, color:C.accent, padding:'10px 8px', textAlign:'left', borderBottom:`2px solid ${C.accent}`, whiteSpace:'nowrap', position:'sticky', top:0, zIndex:1 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tcs.map((r,ri) => (
            <tr key={ri} style={{ background: ri%2===0 ? 'rgba(15,52,96,0.4)' : 'transparent' }}>
              <td style={{ padding:'8px', color:C.accent, fontWeight:700, borderBottom:`1px solid ${C.border}`, whiteSpace:'nowrap', verticalAlign:'top' }}>{r[0]}</td>
              <td style={{ padding:'8px', color:C.header, borderBottom:`1px solid ${C.border}`, fontWeight:600, minWidth:180, verticalAlign:'top' }}>{r[1]}</td>
              <td style={{ padding:'8px', color:C.text, borderBottom:`1px solid ${C.border}`, minWidth:180, verticalAlign:'top', fontSize:12 }}>{r[2]}</td>
              <td style={{ padding:'8px', color:C.text, borderBottom:`1px solid ${C.border}`, minWidth:220, verticalAlign:'top', whiteSpace:'pre-line', fontSize:12 }}>{r[3]}</td>
              <td style={{ padding:'8px', color:C.text, borderBottom:`1px solid ${C.border}`, minWidth:220, verticalAlign:'top', fontSize:12 }}>{r[4]}</td>
              <td style={{ padding:'8px', borderBottom:`1px solid ${C.border}`, verticalAlign:'top' }}>{badge(r[5], r[5]==='P0'?C.danger:C.warn)}</td>
              <td style={{ padding:'8px', borderBottom:`1px solid ${C.border}`, verticalAlign:'top' }}>{badge(r[6], r[6]==='Performance'?C.danger:r[6]==='Data Quality'?C.warn:r[6]==='Reconciliation'?C.accent:C.info)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>);
}

function renderC4Model() {
  return (<div>
    {sectionTitle('C4 Model - Banking Data Pipeline Platform')}

    {card('Level 1: System Context Diagram', <div>
      <p style={{color:C.muted, marginBottom:12}}>Shows the Data Pipeline Platform in the context of its users and external systems.</p>
      {pre(`
+============================================================================+
|                    LEVEL 1: SYSTEM CONTEXT                                  |
+============================================================================+

                          +---------------------+
                          |   Operations Team   |
                          |   [Person]          |
                          |   Monitors pipeline |
                          |   health & SLAs     |
                          +----------+----------+
                                     |
                                     | Views dashboards,
                                     | manages breaks
                                     v
+-------------------+     +---------------------+     +-------------------+
| Core Banking      |     |                     |     | Analytics Users   |
| System            |<--->|   DATA PIPELINE     |<--->| [Person]          |
| [External System] |     |   PLATFORM          |     | Queries Gold      |
| Finacle/T24       | CDC |   [Software System] |     | layer for reports |
+-------------------+     |                     |     +-------------------+
                          |   Ingests, transforms|
+-------------------+     |   reconciles, and    |     +-------------------+
| Card Processing   |<--->|   delivers banking   |<--->| Regulatory Bodies |
| System            |     |   data across all    |     | [External System] |
| [External System] | FTP |   channels           |     | RBI, SEBI, NPCI  |
| Visa/MC Switch    |     |                     | XBRL| Receives returns   |
+-------------------+     +---------------------+     +-------------------+
                               ^           ^
                               |           |
                    +----------+--+    +---+-----------+
                    | Payment     |    | Treasury      |
                    | Systems     |    | System        |
                    | [External]  |    | [External]    |
                    | NPCI/SWIFT  |    | Murex/Calypso |
                    +-------------+    +---------------+
`)}
    </div>)}

    {card('Level 2: Container Diagram', <div>
      <p style={{color:C.muted, marginBottom:12}}>Shows the major containers (applications/services) within the Data Pipeline Platform.</p>
      {pre(`
+============================================================================+
|                    LEVEL 2: CONTAINER DIAGRAM                               |
+============================================================================+
|                                                                             |
|   DATA PIPELINE PLATFORM                                                    |
|   +-------------------------------------------------------------------+    |
|   |                                                                   |    |
|   |  +--------------+    +----------------+    +----------------+     |    |
|   |  | Ingestion    |    | Processing     |    | Data           |     |    |
|   |  | Service      |--->| Engine         |--->| Warehouse      |     |    |
|   |  | [Container]  |    | [Container]    |    | [Container]    |     |    |
|   |  | Kafka +      |    | Spark + Airflow|    | Snowflake/     |     |    |
|   |  | Debezium +   |    | Great Expect.  |    | Delta Lake     |     |    |
|   |  | NiFi         |    | dbt transforms |    | Bronze/Silver/ |     |    |
|   |  +--------------+    +-------+--------+    | Gold layers    |     |    |
|   |         ^                    |              +-------+--------+     |    |
|   |         |                    |                      |              |    |
|   |         |            +-------v--------+    +--------v-------+     |    |
|   |         |            | Reconciliation |    | Reporting      |     |    |
|   |         |            | Engine         |    | Service        |     |    |
|   |         |            | [Container]    |    | [Container]    |     |    |
|   |         |            | Matching algos |    | Tableau,       |     |    |
|   |         |            | Break mgmt     |    | XBRL generator |     |    |
|   |         |            | Aging/escalate |    | PowerBI, APIs  |     |    |
|   |         |            +----------------+    +----------------+     |    |
|   |         |                                                         |    |
|   |  +------+-------+    +----------------+                          |    |
|   |  | Monitoring   |    | API Gateway    |                          |    |
|   |  | [Container]  |    | [Container]    |                          |    |
|   |  | Grafana +    |    | FastAPI app    |                          |    |
|   |  | PagerDuty +  |    | Pipeline APIs  |                          |    |
|   |  | ELK Stack    |    | Recon APIs     |                          |    |
|   |  +--------------+    +----------------+                          |    |
|   |                                                                   |    |
|   +-------------------------------------------------------------------+    |
|                                                                             |
+============================================================================+
`)}
    </div>)}

    {card('Level 3: Component Diagram (Processing Engine)', <div>
      <p style={{color:C.muted, marginBottom:12}}>Shows the internal components of the Processing Engine container.</p>
      {pre(`
+============================================================================+
|                    LEVEL 3: COMPONENT DIAGRAM                               |
|                    (Processing Engine Container)                            |
+============================================================================+
|                                                                             |
|  +------------------+     +-------------------+     +------------------+   |
|  | KafkaConsumer    |     | FileWatcher       |     | APIPoller        |   |
|  | [Component]      |     | [Component]       |     | [Component]      |   |
|  | Consumes CDC     |     | Monitors SFTP     |     | Pulls data from  |   |
|  | events from      |     | directories for   |     | REST APIs on     |   |
|  | Debezium topics  |     | new settlement    |     | schedule         |   |
|  +--------+---------+     | files             |     +--------+---------+   |
|           |               +--------+----------+              |             |
|           |                        |                         |             |
|           v                        v                         v             |
|  +--------+------------------------+-------------------------+---------+   |
|  |                    SparkProcessor [Component]                       |   |
|  |  Orchestrates Spark jobs for data transformation                    |   |
|  |  - Interest calculation    - Fee computation                       |   |
|  |  - GL aggregation          - Settlement processing                 |   |
|  |  - Amortization calc       - Currency conversion                   |   |
|  +---------------------------+-------------------------------------+   |   |
|                              |                                     |   |   |
|                  +-----------v-----------+    +--------------------v+   |   |
|                  | DataValidator         |    | AuditLogger        |   |   |
|                  | [Component]           |    | [Component]        |   |   |
|                  | Great Expectations    |    | Logs every         |   |   |
|                  | validation suites     |    | pipeline step      |   |   |
|                  | Schema validation     |    | with correlation   |   |   |
|                  | Business rules        |    | ID and metrics     |   |   |
|                  +-----------+-----------+    +--------------------+   |   |
|                              |                                         |   |
|                  +-----------v-----------+                             |   |
|                  | ReconciliationMatcher |                             |   |
|                  | [Component]           |                             |   |
|                  | Exact/Fuzzy/Threshold |                             |   |
|                  | matching algorithms   |                             |   |
|                  | Break categorization  |                             |   |
|                  +-----------+-----------+                             |   |
|                              |                                         |   |
|                  +-----------v-----------+                             |   |
|                  | ReportGenerator       |                             |   |
|                  | [Component]           |                             |   |
|                  | XBRL/CSV/PDF output   |                             |   |
|                  | RBI return formatting |                             |   |
|                  | Dashboard data prep   |                             |   |
|                  +-----------------------+                             |   |
|                                                                        |   |
+========================================================================+   |
`)}
    </div>)}

    {card('Level 4: Code Diagram (Key Classes)', <div>
      <p style={{color:C.muted, marginBottom:12}}>Shows key classes and their methods within core components.</p>
      {pre(`
+============================================================================+
|                    LEVEL 4: CODE DIAGRAM                                    |
+============================================================================+

  +----------------------------------+    +----------------------------------+
  | class KafkaConsumer:             |    | class SparkProcessor:            |
  |   - bootstrap_servers: str       |    |   - spark_session: SparkSession  |
  |   - consumer_group: str          |    |   - config: PipelineConfig       |
  |   - schema_registry: Registry    |    |                                  |
  |                                  |    |   + process_batch(df, rules)     |
  |   + consume(topic) -> Iterator   |    |   + calculate_interest(date)     |
  |   + commit_offset(partition)     |    |   + aggregate_gl(date)           |
  |   + handle_deserialization_err() |    |   + process_settlement(file)     |
  |   + get_lag() -> dict            |    |   + apply_transformations(df)    |
  +----------------------------------+    +----------------------------------+

  +----------------------------------+    +----------------------------------+
  | class DataValidator:             |    | class ReconciliationMatcher:      |
  |   - suite_name: str              |    |   - match_config: MatchConfig    |
  |   - expectations: list           |    |   - tolerance: Decimal           |
  |   - checkpoint: str              |    |   - date_window: int             |
  |                                  |    |                                  |
  |   + validate(df) -> Results      |    |   + exact_match(src_a, src_b)    |
  |   + check_completeness(df)       |    |   + fuzzy_match(src_a, src_b)    |
  |   + check_accuracy(df)           |    |   + threshold_match(a, b, tol)   |
  |   + check_consistency(df)        |    |   + composite_key_match(keys)    |
  |   + detect_schema_drift(df)      |    |   + generate_break_report()      |
  |   + route_to_dlq(failures)       |    |   + age_unmatched_items()        |
  +----------------------------------+    +----------------------------------+

  +----------------------------------+    +----------------------------------+
  | class AuditLogger:               |    | class ReportGenerator:           |
  |   - correlation_id: UUID         |    |   - template_registry: dict      |
  |   - pipeline_name: str           |    |   - output_path: Path            |
  |                                  |    |                                  |
  |   + log_start(task, metadata)    |    |   + generate_xbrl(data, schema)  |
  |   + log_complete(task, metrics)  |    |   + generate_dsb_return(date)    |
  |   + log_failure(task, error)     |    |   + generate_recon_report(id)    |
  |   + log_data_mutation(before,    |    |   + generate_trial_balance()     |
  |       after, reason)             |    |   + compare_with_previous(rpt)   |
  |   + get_lineage(txn_id)         |    |   + validate_cross_sections()    |
  +----------------------------------+    +----------------------------------+
`)}
    </div>)}
  </div>);
}

function renderTechStack() {
  const cats = [
    { name:'Orchestration', items:[
      { tech:'Apache Airflow', ver:'2.8+', desc:'DAG-based workflow orchestration for batch ETL pipelines. Python-native, extensive operator library, built-in retry and SLA monitoring.', use:'EOD/BOD batch scheduling, dependency management' },
      { tech:'Control-M', ver:'9.x', desc:'Enterprise job scheduling (legacy). Still used for mainframe-connected batch jobs in some banks.', use:'Legacy batch job integration, mainframe triggers' },
      { tech:'Informatica PowerCenter', ver:'10.5', desc:'Enterprise ETL platform with visual mapping designer. Common in banks with Oracle/DB2 data warehouses.', use:'Complex ETL mappings, data quality rules' },
    ]},
    { name:'Processing', items:[
      { tech:'Apache Spark', ver:'3.5+', desc:'Distributed data processing engine. Handles batch and micro-batch workloads at scale. PySpark for Python API.', use:'Interest calculation, GL aggregation, settlement processing, large file processing' },
      { tech:'Apache Flink', ver:'1.18+', desc:'Stream processing engine with exactly-once semantics. Low-latency event processing.', use:'Real-time fraud detection, CDC event processing, balance updates' },
      { tech:'dbt (Data Build Tool)', ver:'1.7+', desc:'SQL-based transformation framework with testing and documentation. Manages Silver-to-Gold transformations.', use:'Data warehouse transformations, data modeling, test automation' },
    ]},
    { name:'Streaming', items:[
      { tech:'Apache Kafka', ver:'3.6+', desc:'Distributed event streaming platform. High-throughput, fault-tolerant message broker with consumer groups.', use:'CDC event streaming, inter-service messaging, transaction event bus' },
      { tech:'Kafka Connect', ver:'3.6+', desc:'Framework for connecting Kafka with external systems via source/sink connectors.', use:'Database CDC ingestion, data warehouse loading, file system integration' },
      { tech:'Debezium', ver:'2.5+', desc:'CDC platform capturing row-level changes from databases. Supports Oracle, PostgreSQL, MySQL.', use:'Real-time data capture from Finacle (Oracle), card system (PostgreSQL)' },
    ]},
    { name:'Storage', items:[
      { tech:'Snowflake', ver:'Enterprise', desc:'Cloud data warehouse with separation of compute and storage. Time travel, zero-copy cloning.', use:'Data warehouse (Bronze/Silver/Gold layers), regulatory reporting' },
      { tech:'PostgreSQL', ver:'16+', desc:'Open-source relational database for operational metadata, reconciliation state, pipeline configs.', use:'Airflow metadata DB, reconciliation tables, audit logs' },
      { tech:'AWS S3 / Azure ADLS', ver:'Current', desc:'Cloud object storage for raw file landing zone and data lake.', use:'Settlement file storage, archive, data lake raw layer' },
      { tech:'Delta Lake', ver:'3.0+', desc:'Open-source storage layer with ACID transactions on data lakes. Schema enforcement, time travel.', use:'Bronze/Silver layer storage with ACID guarantees, schema evolution' },
    ]},
    { name:'Data Quality', items:[
      { tech:'Great Expectations', ver:'0.18+', desc:'Python-based data validation framework with declarative expectation suites.', use:'Data quality checks at each pipeline stage, automated test documentation' },
      { tech:'AWS Deequ / PyDeequ', ver:'2.0+', desc:'Data quality library built on Spark. Constraint verification, metrics computation.', use:'Large-scale data quality checks in Spark jobs, anomaly detection' },
      { tech:'Monte Carlo', ver:'SaaS', desc:'Data observability platform. Automated anomaly detection, lineage tracking, incident management.', use:'Proactive data quality monitoring, schema change alerting, lineage visualization' },
    ]},
    { name:'Reconciliation', items:[
      { tech:'Custom Recon Engine', ver:'In-house', desc:'Purpose-built reconciliation engine with configurable matching rules, break management, and aging.', use:'Nostro/Vostro, ATM switch, card settlement, UPI reconciliation' },
      { tech:'Trintech Cadency', ver:'Enterprise', desc:'Commercial reconciliation platform for financial close and compliance.', use:'GL reconciliation, intercompany reconciliation, regulatory compliance' },
    ]},
    { name:'Monitoring & Alerting', items:[
      { tech:'Grafana', ver:'10+', desc:'Open-source observability platform. Dashboards for pipeline metrics, SLA tracking, data quality scores.', use:'Pipeline execution dashboards, SLA monitoring, data freshness tracking' },
      { tech:'Datadog', ver:'SaaS', desc:'Cloud monitoring and analytics platform. APM, log management, infrastructure monitoring.', use:'End-to-end pipeline tracing, log aggregation, infrastructure metrics' },
      { tech:'PagerDuty', ver:'SaaS', desc:'Incident management platform. On-call scheduling, escalation policies, automated alerting.', use:'SLA breach alerts, pipeline failure notifications, on-call rotation' },
    ]},
    { name:'File Formats', items:[
      { tech:'CSV/TSV', ver:'Standard', desc:'Comma/tab separated values for batch file exchange with NPCI, switches, and internal systems.', use:'NACH files, UPI settlement, ATM reconciliation files' },
      { tech:'ISO 20022 XML', ver:'2024', desc:'International standard for financial messaging. Replacing SWIFT MT messages.', use:'Payment instructions, securities settlement, regulatory reporting' },
      { tech:'SWIFT FIN (MT)', ver:'2024', desc:'SWIFT message format (MT103, MT202, MT940, MT950). Being migrated to ISO 20022 MX.', use:'Cross-border payments, nostro statements, trade finance' },
      { tech:'Apache Parquet', ver:'Current', desc:'Columnar storage format optimized for analytical queries. Snappy/ZSTD compression.', use:'Data lake storage, analytical workloads, archive format' },
    ]},
  ];
  const catColors = { Orchestration:C.info, Processing:C.accent, Streaming:'#e74c3c', Storage:'#9b59b6', 'Data Quality':C.warn, Reconciliation:'#1abc9c', 'Monitoring & Alerting':'#e67e22', 'File Formats':C.muted };
  return (<div>
    {sectionTitle('Technology Stack')}
    {cats.map(cat => (
      <div key={cat.name} style={{ marginBottom:28 }}>
        <h3 style={{ color:catColors[cat.name]||C.accent, marginBottom:12, fontSize:18 }}>{badge(cat.name, catColors[cat.name]||C.accent)} {cat.name}</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px,1fr))', gap:14 }}>
          {cat.items.map(item => (
            <div key={item.tech} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ color:C.header, fontWeight:700, fontSize:15 }}>{item.tech}</span>
                <span style={{ color:C.muted, fontSize:12 }}>{item.ver}</span>
              </div>
              <p style={{ color:C.text, fontSize:13, lineHeight:1.6, margin:'0 0 8px 0' }}>{item.desc}</p>
              <p style={{ color:C.accent, fontSize:12, margin:0 }}><strong>Use:</strong> {item.use}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>);
}

function renderSAD() {
  return (<div>
    {sectionTitle('Software Architecture Decisions (SAD)')}

    {card('ADR-001: Airflow over Control-M for Orchestration', <div>
      <p><strong>Status:</strong> {badge('ACCEPTED', C.success)}</p>
      <p><strong>Context:</strong> The bank needs a workflow orchestration engine for 200+ daily batch pipelines including EOD/BOD processing, reconciliation, and regulatory reporting.</p>
      <p><strong>Decision:</strong> Use Apache Airflow as the primary orchestration engine.</p>
      {table(['Criteria','Airflow','Control-M'], [
        ['Cost','Open-source (free)','License: $200K+/year'],
        ['Language','Python-native (DAGs as code)','Proprietary DSL + GUI'],
        ['Extensibility','Custom operators, hooks, sensors','Limited to vendor plugins'],
        ['Community','Large open-source community','Vendor-dependent'],
        ['CI/CD Integration','Git-native, version-controlled DAGs','Complex deployment process'],
        ['Monitoring','Built-in UI + Grafana metrics','Proprietary monitoring'],
        ['Cloud Support','MWAA (AWS), Cloud Composer (GCP)','Cloud agents available'],
      ])}
      <p><strong>Consequences:</strong> Team needs Python skills. Control-M retained for legacy mainframe job triggers only. Migration of existing Control-M jobs phased over 6 months.</p>
    </div>)}

    {card('ADR-002: Apache Spark over Raw SQL for Transformations', <div>
      <p><strong>Status:</strong> {badge('ACCEPTED', C.success)}</p>
      <p><strong>Context:</strong> Daily data processing involves 50M+ transactions requiring interest calculations, GL aggregation, and complex business rule application.</p>
      <p><strong>Decision:</strong> Use Apache Spark (PySpark) for data transformation workloads.</p>
      {table(['Factor','Spark','Raw SQL (Stored Procedures)'], [
        ['Scalability','Horizontal (add workers)','Vertical (bigger DB server)'],
        ['Complex Logic','Python/Scala UDFs','Limited procedural SQL'],
        ['Testing','Unit testable with pytest','Difficult to unit test'],
        ['Version Control','Code in Git','Stored procs in DB'],
        ['Processing Volume','10M+ records/hour','Limited by DB resources'],
        ['Fault Tolerance','Checkpoint/restart, RDD lineage','Transaction rollback only'],
      ])}
      <p><strong>Consequences:</strong> Spark cluster operational overhead. dbt used for simpler Silver-to-Gold SQL transformations. Spark reserved for compute-intensive jobs.</p>
    </div>)}

    {card('ADR-003: Medallion Architecture (Bronze/Silver/Gold)', <div>
      <p><strong>Status:</strong> {badge('ACCEPTED', C.success)}</p>
      <p><strong>Context:</strong> Need a structured approach to progressive data refinement from raw source extracts to curated analytical datasets.</p>
      {table(['Layer','Purpose','Data State','Retention','Access'], [
        ['Bronze','Raw data landing','As-is from source, append-only','7 years (regulatory)','Data Engineering only'],
        ['Silver','Cleaned and conformed','Deduplicated, validated, schema-enforced','5 years','Data Engineering + Analysts'],
        ['Gold','Business-ready aggregations','Domain-specific models, KPIs, reports','3 years (hot) + archive','All authorized consumers'],
      ])}
      <p><strong>Consequences:</strong> Storage costs increase (3x raw data). But enables reprocessing from Bronze if transformation logic changes. Regulatory requirement for raw data retention satisfied.</p>
    </div>)}

    {card('ADR-004: Real-Time vs Batch Processing Trade-offs', <div>
      <p><strong>Status:</strong> {badge('ACCEPTED', C.success)}</p>
      {table(['Dimension','Real-Time (Kafka/Flink)','Batch (Spark/Airflow)','Decision'], [
        ['Latency','< 1 second','Minutes to hours','Real-time for fraud, batch for EOD'],
        ['Cost','Higher (always-on infra)','Lower (run on schedule)','Batch for most workloads'],
        ['Complexity','Higher (event ordering, dedup)','Lower (well-understood patterns)','Start batch, add real-time selectively'],
        ['Exactly-Once','Harder (Kafka transactions)','Easier (checkpoint/restart)','At-least-once for CDC, exactly-once for settlement'],
        ['Use Cases','Fraud alerts, balance sync','EOD/BOD, reports, recon','Lambda architecture (both)'],
      ])}
    </div>)}

    {card('NFR Targets & Failure Modes', <div>
      <h4 style={{color:C.accent}}>Non-Functional Requirements</h4>
      {table(['NFR','Target','Monitoring','Escalation'], [
        ['EOD Completion SLA','< 4 hours (10 PM - 2 AM)','Airflow DAG duration alert at 3hr mark','Auto-page on-call; escalate to CTO at 3.5hr'],
        ['Reconciliation Accuracy','99.99% match rate','Daily match rate dashboard','Alert if below 99.5%; manual review queue'],
        ['Data Freshness (CDC)','< 15 minutes lag','Kafka consumer lag monitoring','Alert at 10 min lag; circuit breaker at 30 min'],
        ['Data Retention','7 years (regulatory)','Storage lifecycle policy audit','Quarterly compliance review'],
        ['Pipeline Availability','99.9% uptime','Infrastructure health checks','Auto-failover; DR drill quarterly'],
      ])}

      <h4 style={{color:C.danger, marginTop:16}}>Failure Modes & Mitigation</h4>
      {table(['Failure Mode','Impact','Mitigation','Recovery Time'], [
        ['Core banking system unavailable','No data extraction','Retry with backoff; process previous day data; alert ops','< 30 min with retry'],
        ['Schema drift (source system upgrade)','Pipeline failure / data corruption','Schema registry validation; auto-alert; manual review','< 2 hours'],
        ['Data volume spike (3x normal)','SLA breach','Auto-scaling Spark executors; priority queue for critical jobs','< 1 hour'],
        ['Kafka broker failure','CDC lag increase','3-node cluster (2 replicas); auto-failover','< 5 min (automatic)'],
        ['Reconciliation break spike','Operational risk','Auto-escalation; increased matching tolerance review','Same day resolution'],
        ['Network partition (DC split)','Data inconsistency','Quorum-based writes; reconciliation on recovery','< 15 min'],
      ])}
    </div>)}
  </div>);
}

function renderFlowchart() {
  return (<div>
    {sectionTitle('EOD Batch Processing Flowchart')}

    {card('End-of-Day (EOD) Processing Flow', <div>
      <p style={{color:C.muted, marginBottom:12}}>This flowchart represents the complete EOD batch processing cycle for a banking institution, typically triggered at 10 PM after branch closure and online transaction cutoff.</p>
      {pre(`
+=============================================================================+
|                   EOD BATCH PROCESSING FLOWCHART                             |
+=============================================================================+

                          +------------------+
                          |  TRIGGER EOD     |
                          |  (Scheduler:     |
                          |   10:00 PM IST)  |
                          +--------+---------+
                                   |
                          +--------v---------+
                          | PRE-CHECK:       |
                          | - Branch closed? |
                          | - Online cutoff? |
                          | - Disk space OK? |
                          | - Dependencies?  |
                          +--------+---------+
                                   |
                              +----v----+
                              | Checks  |----NO----+
                              | Pass?   |          |
                              +----+----+          v
                                   |         +----------+
                                  YES        | ALERT    |
                                   |         | OPS TEAM |
                                   |         | (Manual  |
                                   v         | override)|
                          +--------+---------+----------+
                          | LOCK TRANSACTION |
                          | POSTING          |
                          | (No new entries  |
                          |  to CBS)         |
                          +--------+---------+
                                   |
                          +--------v---------+
                          | EXTRACT DAY'S    |
                          | TRANSACTIONS     |
                          | - All accounts   |
                          | - All channels   |
                          | - Reversal pairs |
                          +--------+---------+
                                   |
                          +--------v---------+
                          | VALIDATE DATA    |
                          | QUALITY          |
                          | - Null checks    |
                          | - Range checks   |
                          | - Referential    |
                          |   integrity      |
                          | - Dedup check    |
                          +--------+---------+
                                   |
                              +----v----+
                              |Quality  |---FAIL---+
                              |  OK?    |          |
                              +----+----+          v
                                   |         +-----------+
                                  YES        | ROUTE TO  |
                                   |         | DEAD      |
                                   |         | LETTER Q  |
                                   |         | (Continue |
                                   |         |  valid    |
                                   v         |  records) |
                    +--------------+---------+-----------+
                    |              |
          +---------v------+  +---v-----------+
          | INTEREST       |  | FEE POSTING   |
          | CALCULATION    |  | - SMS charges |
          | - Savings      |  | - Cheque book |
          |   (daily)      |  | - Debit card  |
          | - Current      |  | - Locker rent |
          |   (quarterly)  |  | - Service tax |
          | - Loans (EMI)  |  +---+-----------+
          | - FD accrual   |      |
          +---------+------+      |
                    |             |
                    +------+------+
                           |
                  +--------v---------+
                  | GL AGGREGATION   |
                  | - Sum all debits |
                  | - Sum all credits|
                  | - Profit center  |
                  |   allocation     |
                  | - Sub-ledger to  |
                  |   GL posting     |
                  +--------+---------+
                           |
                  +--------v---------+
                  | TRIAL BALANCE    |
                  | VALIDATION       |
                  | Debit = Credit?  |
                  +--------+---------+
                           |
                      +----v----+
                      |Balanced?|---NO---+
                      +----+----+        |
                           |             v
                          YES      +----------+
                           |       | CRITICAL |
                           |       | ALERT!   |
                           |       | Stop EOD |
                           |       | Manual   |
                           v       | Review   |
                  +--------+-------+----------+
                  | RUN                       |
                  | RECONCILIATION            |
                  | - Nostro/Vostro           |
                  | - ATM switch vs CBS       |
                  | - Card settlement         |
                  | - UPI settlement          |
                  +--------+---------+--------+
                           |
                      +----v----+
                      | Recon   |---BREAKS--+
                      |Balanced?|           |
                      +----+----+           v
                           |          +----------+
                          YES         | LOG      |
                           |          | BREAKS   |
                           |          | Queue for|
                           v          | next-day |
                  +--------+---------+----------+
                  | GENERATE REPORTS  |
                  | - EOD summary     |
                  | - Exception report|
                  | - Recon report    |
                  | - GL trial balance|
                  | - Regulatory      |
                  |   returns (if due)|
                  +--------+---------+
                           |
                  +--------v---------+
                  | ARCHIVE SOURCE   |
                  | FILES            |
                  | - Move to cold   |
                  |   storage        |
                  | - Update catalog |
                  +--------+---------+
                           |
                  +--------v---------+
                  | UNLOCK           |
                  | TRANSACTION      |
                  | POSTING          |
                  | (BOD ready)      |
                  +--------+---------+
                           |
                  +--------v---------+
                  | SEND             |
                  | NOTIFICATIONS    |
                  | - Email: EOD     |
                  |   summary to mgmt|
                  | - SMS: Critical  |
                  |   alerts         |
                  | - Dashboard:     |
                  |   Update status  |
                  | - PagerDuty:     |
                  |   Clear incident |
                  +------------------+
                           |
                      +----v----+
                      |   END   |
                      | EOD     |
                      | COMPLETE|
                      +---------+
`)}
    </div>)}

    {card('BOD (Beginning-of-Day) Processing Flow', pre(`
+=============================================================================+
|                   BOD PROCESSING FLOWCHART (Summary)                         |
+=============================================================================+

  START BOD (6:00 AM IST)
       |
       v
  [Refresh Forex Rates from RBI] --> [Update Rate Tables in CBS]
       |
       v
  [Refresh Interest Rates] --> [PLR/MCLR/Base Rate from Treasury]
       |
       v
  [Reset Daily Limits] --> [Debit Card, Net Banking, UPI, IMPS limits]
       |
       v
  [Process FD Maturities] --> [Auto-renew / Credit proceeds]
       |
       v
  [Execute Standing Instructions] --> [SIs, SIPs, EMI debits]
       |                                    |
       |                              +-----v------+
       |                              |Insufficient|---> Retry Queue
       |                              |Balance?    |     (10AM, 2PM, 4PM)
       |                              +-----+------+
       |                                    |
       v                                   YES (sufficient)
  [Dormancy Check] --> Flag inactive accounts (no txn > 24 months)
       |
       v
  [Generate BOD Reports] --> Branch readiness, rate summary
       |
       v
  [Open for Business] --> Unlock channels, enable transactions
       |
       v
  END BOD
`))}
  </div>);
}

function renderSequenceDiagram() {
  return (<div>
    {sectionTitle('Sequence Diagrams')}

    {card('EOD Batch Processing - Full Sequence', <div>
      <p style={{color:C.muted, marginBottom:12}}>Interaction between all system components during End-of-Day batch processing. Shows the orchestrated flow with checkpoints and error handling.</p>
      {pre(`
+=============================================================================+
|              EOD BATCH PROCESSING SEQUENCE DIAGRAM                           |
+=============================================================================+

  Scheduler    Airflow     Core Banking   Data Quality  Spark       Data         Recon        Report       Ops
  (Cron)       Orchestrator  (Finacle)      Engine     Processor   Warehouse    Engine       Generator    Team
    |              |             |             |           |           |            |            |           |
    |--trigger---->|             |             |           |           |            |            |           |
    | (10PM IST)   |             |             |           |           |            |            |           |
    |              |--lock_txns->|             |           |           |            |            |           |
    |              |             |--ack------->|           |           |            |            |           |
    |              |             |             |           |           |            |            |           |
    |              |--extract--->|             |           |           |            |            |           |
    |              |  (JDBC/CDC) |             |           |           |            |            |           |
    |              |<--50M rows--|             |           |           |            |            |           |
    |              |             |             |           |           |            |            |           |
    |              |--validate------------------>|         |           |            |            |           |
    |              |             |             |           |           |            |            |           |
    |              |             |    +--------+---------+ |           |            |            |           |
    |              |             |    | Validate:        | |           |            |            |           |
    |              |             |    | - Null checks    | |           |            |            |           |
    |              |             |    | - Range checks   | |           |            |            |           |
    |              |             |    | - Referential    | |           |            |            |           |
    |              |             |    | - Dedup          | |           |            |            |           |
    |              |             |    +--------+---------+ |           |            |            |           |
    |              |             |             |           |           |            |            |           |
    |              |<--quality_report----------|           |           |            |            |           |
    |              |  (pass: 99.97%)          |           |           |            |            |           |
    |              |  (fail: 0.03% -> DLQ)    |           |           |            |            |           |
    |              |             |             |           |           |            |            |           |
    |              |--calc_interest----------------------->|           |            |            |           |
    |              |             |             |  +--------+---------+ |            |            |           |
    |              |             |             |  | Spark Job:       | |            |            |           |
    |              |             |             |  | - Read balances  | |            |            |           |
    |              |             |             |  | - Apply rates    | |            |            |           |
    |              |             |             |  | - Calc daily     | |            |            |           |
    |              |             |             |  |   interest       | |            |            |           |
    |              |             |             |  | - Post accrual   | |            |            |           |
    |              |             |             |  +--------+---------+ |            |            |           |
    |              |<--interest_done--------------------------|        |            |            |           |
    |              |             |             |           |           |            |            |           |
    |              |--post_fees------------------------------>|        |            |            |           |
    |              |<--fees_done-------------------------------|        |            |            |           |
    |              |             |             |           |           |            |            |           |
    |              |--gl_aggregate---------------------------->|        |            |            |           |
    |              |             |             |           |  +--------+---------+  |            |           |
    |              |             |             |           |  | Sum debits       |  |            |           |
    |              |             |             |           |  | Sum credits      |  |            |           |
    |              |             |             |           |  | Verify: D = C    |  |            |           |
    |              |             |             |           |  +--------+---------+  |            |           |
    |              |<--gl_balanced-----------------------------|        |            |            |           |
    |              |             |             |           |           |            |            |           |
    |              |--load_warehouse------------------------------------->|         |            |           |
    |              |             |             |           |           |  |         |            |           |
    |              |             |             |           |           |  +------+  |            |           |
    |              |             |             |           |           |  |Bronze|  |            |           |
    |              |             |             |           |           |  |Silver|  |            |           |
    |              |             |             |           |           |  | Gold |  |            |           |
    |              |             |             |           |           |  +------+  |            |           |
    |              |<--load_complete---------------------------------------|        |            |           |
    |              |             |             |           |           |            |            |           |
    |              |--run_reconciliation------------------------------------------------>|      |           |
    |              |             |             |           |           |            |     |      |           |
    |              |             |             |           |           |  +---------+-----+---+  |           |
    |              |             |             |           |           |  | Match algorithms: |  |           |
    |              |             |             |           |           |  | - Nostro/Vostro   |  |           |
    |              |             |             |           |           |  | - ATM switch      |  |           |
    |              |             |             |           |           |  | - Card settlement |  |           |
    |              |             |             |           |           |  | - UPI settlement  |  |           |
    |              |             |             |           |           |  +---------+---------+  |           |
    |              |<--recon_results----------------------------------------------------|       |           |
    |              |  (matched: 99.95%, breaks: 150)       |           |            |            |           |
    |              |             |             |           |           |            |            |           |
    |              |--generate_reports---------------------------------------------------------------->|    |
    |              |             |             |           |           |            |            |     |    |
    |              |             |             |           |           |            |     +------+----+|    |
    |              |             |             |           |           |            |     | EOD Summary|    |
    |              |             |             |           |           |            |     | Break Rpt  |    |
    |              |             |             |           |           |            |     | Trial Bal  |    |
    |              |             |             |           |           |            |     | Reg Returns|    |
    |              |             |             |           |           |            |     +------+-----+    |
    |              |<--reports_ready-----------------------------------------------------------------|     |
    |              |             |             |           |           |            |            |           |
    |              |--unlock_txns->|           |           |           |            |            |           |
    |              |             |--ack------->|           |           |            |            |           |
    |              |             |             |           |           |            |            |           |
    |              |--notify-------------------------------------------------------------------------------->|
    |              |             |             |           |           |            |            |  (Email + |
    |              |             |             |           |           |            |            |   SMS +   |
    |              |             |             |           |           |            |            |  PagerDuty|
    |              |             |             |           |           |            |            |   clear)  |
    |              |             |             |           |           |            |            |           |
    | EOD COMPLETE |             |             |           |           |            |            |           |
    | Duration:    |             |             |           |           |            |            |           |
    | 3hr 15min    |             |             |           |           |            |            |           |
    | SLA: MET     |             |             |           |           |            |            |           |
`)}
    </div>)}

    {card('Reconciliation Engine - Matching Sequence', <div>
      <p style={{color:C.muted, marginBottom:12}}>Detailed sequence showing how the Reconciliation Engine performs multi-pass matching for nostro reconciliation.</p>
      {pre(`
+=============================================================================+
|              RECONCILIATION MATCHING SEQUENCE                                |
+=============================================================================+

  Recon         Source A       Source B       Exact         Fuzzy        Threshold    Break
  Controller    Loader         Loader        Matcher       Matcher      Matcher      Manager
    |              |              |             |             |             |            |
    |--load------->|              |             |             |             |            |
    | (CBS nostro  |              |             |             |             |            |
    |  extract)    |              |             |             |             |            |
    |<--10,000 rows|              |             |             |             |            |
    |              |              |             |             |             |            |
    |--load---------------------->|             |             |             |            |
    | (MT940 stmt  |              |             |             |             |            |
    |  from corr.  |              |             |             |             |            |
    |  bank)       |              |             |             |             |            |
    |<--9,850 rows----------------|             |             |             |            |
    |              |              |             |             |             |            |
    |==== PASS 1: EXACT MATCH ============================>|             |             |
    |  Key: (txn_ref, value_date, amount, currency)        |             |             |
    |<--matched: 9,200 (93.4%) ----------------------------|             |             |
    |   unmatched_A: 800                                   |             |             |
    |   unmatched_B: 650                                   |             |             |
    |              |              |             |             |             |            |
    |==== PASS 2: FUZZY MATCH (on unmatched) ==============================>|          |
    |  Key: Levenshtein(description) < 3, same amount      |             |             |
    |<--matched: 400 (additional) ----------------------------------------------|       |
    |   unmatched_A: 400                                   |             |             |
    |   unmatched_B: 250                                   |             |             |
    |              |              |             |             |             |            |
    |==== PASS 3: THRESHOLD MATCH (on remaining) ====================================>|
    |  Key: amount within +/- 0.01, date within +/- 2 days |             |             |
    |<--matched: 180 (additional) ----------------------------------------------------|
    |   unmatched_A: 220 (BREAKS)                          |             |             |
    |   unmatched_B: 70  (BREAKS)                          |             |             |
    |              |              |             |             |             |            |
    |--log_breaks------------------------------------------------------------------>|
    |              |              |             |             |             |  +--------+-------+
    |              |              |             |             |             |  | Categorize:    |
    |              |              |             |             |             |  | - Timing (150) |
    |              |              |             |             |             |  | - Amount (80)  |
    |              |              |             |             |             |  | - Missing (60) |
    |              |              |             |             |             |  +--------+-------+
    |<--break_report---------------------------------------------------------------|
    |              |              |             |             |             |            |
    | FINAL RESULT:                                                                    |
    | Total Matched: 9,780 / 10,000 = 97.8%                                           |
    | Breaks: 290 (auto-aged, escalation if > 3 days)                                  |
`)}
    </div>)}

    {card('CDC (Change Data Capture) Real-Time Flow', pre(`
+=============================================================================+
|              CDC REAL-TIME PROCESSING SEQUENCE                               |
+=============================================================================+

  Finacle     Debezium     Schema       Kafka        Flink        Data         Alert
  (Oracle)    Connector    Registry     Broker       Processor    Warehouse    Service
    |             |            |           |            |            |            |
    |--txn_insert->|           |           |            |            |            |
    | (redo log)  |            |           |            |            |            |
    |             |--validate-->|           |            |            |            |
    |             |  (schema)  |           |            |            |            |
    |             |<--schema_ok-|           |            |            |            |
    |             |            |           |            |            |            |
    |             |--produce-------------->|            |            |            |
    |             | (cbs.accounts.txn)     |            |            |            |
    |             |            |           |            |            |            |
    |             |            |  +--------v---------+  |            |            |
    |             |            |  | Topic:           |  |            |            |
    |             |            |  | cbs.GAM.changes  |  |            |            |
    |             |            |  | Partition: acct# |  |            |            |
    |             |            |  | Retention: 7 days|  |            |            |
    |             |            |  +--------+---------+  |            |            |
    |             |            |           |            |            |            |
    |             |            |           |--consume-->|            |            |
    |             |            |           |           |            |            |
    |             |            |           |  +--------+---------+  |            |
    |             |            |           |  | Process:         |  |            |
    |             |            |           |  | - Enrich         |  |            |
    |             |            |           |  | - Transform      |  |            |
    |             |            |           |  | - Check fraud    |  |            |
    |             |            |           |  |   rules          |  |            |
    |             |            |           |  +--------+---------+  |            |
    |             |            |           |            |            |            |
    |             |            |           |            |--upsert--->|            |
    |             |            |           |            | (Silver)   |            |
    |             |            |           |            |            |            |
    |             |            |           |            |--alert (if fraud rule)-->|
    |             |            |           |            |            |   (SMS +   |
    |             |            |           |            |            |    block)  |
    | Latency: < 5 seconds end-to-end                               |            |
`))}
  </div>);
}

/* ========== MAIN COMPONENT ========== */

export default function DataPipelineArch() {
  const [activeTab, setActiveTab] = useState('architecture');

  const renderContent = () => {
    switch(activeTab) {
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
    <div style={{ minHeight:'100vh', background:`linear-gradient(135deg, ${C.bgFrom} 0%, ${C.bgTo} 100%)`, color:C.text, fontFamily:'Segoe UI, Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ padding:'28px 32px 0', borderBottom:`1px solid ${C.border}` }}>
        <h1 style={{ color:C.header, margin:'0 0 4px 0', fontSize:28 }}>Data Pipeline, ETL, Batch Processing & Reconciliation Testing</h1>
        <p style={{ color:C.muted, margin:'0 0 18px 0', fontSize:15 }}>Architecture documentation for banking data pipeline QA testing -- EOD/BOD processing, reconciliation engines, data quality validation, and regulatory reporting pipelines.</p>

        {/* Tab Bar */}
        <div style={{ display:'flex', overflowX:'auto', gap:4, paddingBottom:0, scrollbarWidth:'thin' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding:'10px 20px',
                background: activeTab===tab.key ? C.accent : 'transparent',
                color: activeTab===tab.key ? '#000' : C.text,
                border: activeTab===tab.key ? 'none' : `1px solid ${C.border}`,
                borderBottom: activeTab===tab.key ? `2px solid ${C.accent}` : 'none',
                borderRadius:'8px 8px 0 0',
                cursor:'pointer',
                fontWeight: activeTab===tab.key ? 700 : 400,
                fontSize:13,
                whiteSpace:'nowrap',
                transition:'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:'28px 32px', maxWidth:1400, margin:'0 auto' }}>
        {renderContent()}
      </div>
    </div>
  );
}

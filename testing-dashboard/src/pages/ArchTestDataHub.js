import React, { useState } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12', success:'#2ecc71', info:'#3498db' };

const TOPICS = [
  { key:'compliance', label:'Compliance & Regulatory' },
  { key:'contract', label:'Contract Testing' },
  { key:'datapipeline', label:'Data Pipeline & ETL' },
  { key:'messagequeue', label:'Message Queue' },
  { key:'microservices', label:'Microservices' },
  { key:'chaos', label:'Chaos & Resilience' },
  { key:'cloudnative', label:'Cloud Native' },
  { key:'payment', label:'Payment Gateway' },
  { key:'mainframe', label:'Mainframe Banking' },
  { key:'concurrency', label:'Concurrency Testing' }
];

const SUB_TABS = [
  { key:'data', label:'Test Data' },
  { key:'scenarios', label:'Test Scenarios' },
  { key:'cases', label:'Test Cases' },
  { key:'results', label:'Test Results' },
  { key:'overview', label:'Topic Overview' }
];

/* ==================== TOPIC OVERVIEWS ==================== */
const TOPIC_OVERVIEWS = {
  compliance: {
    title: 'Compliance & Regulatory Testing',
    description: 'Enterprise compliance testing covering KYC/AML, PCI-DSS, GDPR, SOX, RBI Norms, and BASEL III for Indian banking ecosystem. Validates real-time regulatory compliance monitoring, automated reporting, and audit trail management across all banking verticals.',
    keyAreas: ['KYC/eKYC Verification (Aadhaar OTP, Video KYC, CKYC)', 'AML Transaction Monitoring (Rule-based + ML Detection)', 'OFAC/UN/EU Sanctions Screening (Fuzzy Match <200ms)', 'PCI-DSS v4.0 Compliance (12 Requirements, 300+ Controls)', 'GDPR Data Protection (Erasure, Portability, Consent)', 'SOX Audit Trail (ITGC, SoD, Access Recertification)', 'RBI Regulatory Reporting (CRILC, XBRL, Cybersecurity)', 'BASEL III Capital Adequacy (CET1, LCR, NSFR, Leverage)'],
    regulations: ['RBI KYC Master Direction 2016', 'PMLA 2002', 'PCI-DSS v4.0', 'EU GDPR / India DPDP Act 2023', 'SOX Section 302/404', 'BASEL III Framework'],
    tools: ['SAS AML', 'NICE Actimize', 'Aadhaar eKYC API', 'CKYC Registry', 'FIU-IND Portal', 'XBRL Taxonomy Engine'],
    riskLevel: 'CRITICAL',
    coverage: 92
  },
  contract: {
    title: 'Contract Testing',
    description: 'Consumer-driven contract testing ensuring API compatibility between banking microservices. Validates OpenAPI specifications, Pact broker contracts, schema evolution, backward compatibility, and mTLS certificate chains across service boundaries.',
    keyAreas: ['Pact Broker Contract Verification', 'OpenAPI Schema Validation', 'Breaking Change Detection', 'Backward Compatibility Testing', 'Consumer-Driven Contract (CDC)', 'GraphQL Schema Evolution', 'API Versioning & Negotiation', 'mTLS Certificate Chain Validation'],
    regulations: ['OpenAPI Specification 3.1', 'Pact Specification v4', 'JSON Schema Draft 2020-12', 'OAuth 2.0 / OIDC Contract'],
    tools: ['Pact Broker', 'Swagger/OpenAPI Validator', 'Dredd', 'Postman Contract Tests', 'Spring Cloud Contract', 'Spectral Linter'],
    riskLevel: 'HIGH',
    coverage: 95
  },
  datapipeline: {
    title: 'Data Pipeline & ETL Testing',
    description: 'End-to-end testing of banking data pipelines covering EOD batch processing, real-time CDC streaming, GL reconciliation, data quality validation, and regulatory reporting. Ensures data integrity from source systems to data warehouse and downstream analytics.',
    keyAreas: ['EOD Batch Extraction (Core Banking to Warehouse)', 'GL Reconciliation (Debit-Credit Balancing)', 'Data Quality Checks (Null/Duplicate/Completeness)', 'CDC Streaming (Change Data Capture)', 'Currency Normalization & FX Conversion', 'PAN/Aadhaar Masking in Transit', 'XBRL Taxonomy Mapping (RBI Reporting)', 'Schema Drift Detection & Alerting'],
    regulations: ['RBI Data Governance Framework', 'BCBS 239 (Risk Data Aggregation)', 'Data Quality Management Standards', 'PCI-DSS Data Masking Requirements'],
    tools: ['Apache Spark', 'Snowflake', 'Apache Airflow', 'Debezium CDC', 'Great Expectations', 'dbt (data build tool)'],
    riskLevel: 'HIGH',
    coverage: 88
  },
  messagequeue: {
    title: 'Message Queue Testing',
    description: 'Comprehensive testing of messaging infrastructure covering Kafka, RabbitMQ, and IBM MQ for banking transaction processing. Validates message ordering, exactly-once delivery, dead letter handling, schema registry, and cross-datacenter replication.',
    keyAreas: ['FIFO Message Ordering Guarantee', 'Dead Letter Queue (DLQ) Handling', 'Message Replay from Topic Offset', 'Consumer Group Rebalancing', 'Exactly-Once Delivery Semantics', 'Avro Schema Registry Compatibility', 'Cross-DC Replication Latency', 'Backpressure & Throughput Testing'],
    regulations: ['Banking Transaction Ordering Requirements', 'RBI Digital Payment Guidelines', 'NPCI Message Format Standards', 'ISO 20022 Messaging Standards'],
    tools: ['Apache Kafka', 'Confluent Schema Registry', 'RabbitMQ', 'IBM MQ', 'Kafka Streams', 'AKHQ Dashboard'],
    riskLevel: 'HIGH',
    coverage: 90
  },
  microservices: {
    title: 'Microservices Architecture Testing',
    description: 'Testing distributed banking microservices including service discovery, circuit breakers, saga pattern, distributed tracing, service mesh, and deployment strategies. Validates resilience patterns and inter-service communication integrity.',
    keyAreas: ['Service Discovery via Consul Health Checks', 'Circuit Breaker (OPEN/CLOSED/HALF_OPEN)', 'Saga Pattern for Distributed Transactions', 'Distributed Tracing with Jaeger/Zipkin', 'Service Mesh (Istio) mTLS Enforcement', 'Blue-Green & Canary Deployments', 'API Gateway Rate Limiting per Tenant', 'JWT Token Propagation Across Services'],
    regulations: ['Banking API Security Standards', 'RBI IT Outsourcing Guidelines', 'PCI-DSS Network Segmentation', 'OAuth 2.0 / FAPI Standards'],
    tools: ['Istio Service Mesh', 'Consul', 'Jaeger Tracing', 'Envoy Proxy', 'Kong API Gateway', 'Resilience4j'],
    riskLevel: 'HIGH',
    coverage: 85
  },
  chaos: {
    title: 'Chaos & Resilience Testing',
    description: 'Chaos engineering experiments for banking infrastructure covering pod kills, network partitions, CPU stress, memory leaks, DNS failures, and full datacenter DR failover. Validates system resilience and recovery time objectives (RTO/RPO).',
    keyAreas: ['Random Pod Kill During Peak Hours', 'Network Partition (App-DB Tier)', 'CPU/Memory Stress Testing', 'Kafka Broker Failure & ISR Recovery', 'Redis Cluster Failover', 'DNS Blackhole for External Services', 'Full Datacenter DR Switchover', 'AZ Failure Blast Radius Containment'],
    regulations: ['RBI Business Continuity Plan Guidelines', 'RBI IT Risk Management Framework', 'BCBS Operational Resilience', 'DR Testing Requirements (Annual)'],
    tools: ['Chaos Monkey', 'Litmus Chaos', 'Gremlin', 'Chaos Toolkit', 'AWS FIS', 'Pumba (Container Chaos)'],
    riskLevel: 'CRITICAL',
    coverage: 80
  },
  cloudnative: {
    title: 'Cloud Native Infrastructure Testing',
    description: 'Testing cloud-native banking infrastructure on AWS covering EKS, RDS, Lambda, S3, ElastiCache, IAM, Terraform IaC, and security compliance. Validates auto-scaling, multi-AZ failover, encryption, and least-privilege access controls.',
    keyAreas: ['EKS HPA Auto-Scaling (CPU-based)', 'RDS Multi-AZ Automatic Failover', 'Lambda Cold Start Optimization', 'S3 SSE-KMS Encryption Verification', 'Terraform Drift Detection', 'IAM Least-Privilege Policy Audit', 'Pod Security Policy Enforcement', 'Secrets Manager Auto-Rotation'],
    regulations: ['RBI Cloud Security Framework', 'PCI-DSS Cloud Requirements', 'SOC 2 Type II', 'CIS AWS Benchmark'],
    tools: ['AWS EKS', 'Terraform', 'OPA/Gatekeeper', 'AWS Config', 'Prowler', 'Checkov', 'tfsec'],
    riskLevel: 'HIGH',
    coverage: 90
  },
  payment: {
    title: 'Payment Gateway Testing',
    description: 'End-to-end payment gateway testing covering Visa/Mastercard/RuPay card networks, UPI, NEFT/RTGS, 3DS 2.0 authentication, PCI-DSS tokenization, HSM key management, and settlement reconciliation for Indian banking payment ecosystem.',
    keyAreas: ['Visa/Mastercard 3DS 2.0 Authentication', 'UPI P2P/P2M via NPCI Switch', 'PCI-DSS Tokenization & Detokenization', 'HSM Key Rotation (PIN Encryption)', 'Refund & Chargeback Processing', 'Multi-Currency FX Conversion', 'EMI Conversion on Credit Cards', 'RBI e-Mandate for Recurring Payments'],
    regulations: ['PCI-DSS v4.0', 'RBI Digital Payment Security', 'NPCI UPI Interoperability Guidelines', 'RBI e-Mandate Framework', 'PA-DSS (Payment Application)'],
    tools: ['Thales HSM', 'Visa VTS', 'Mastercard MDES', 'NPCI UPI SDK', 'Stripe Test Mode', 'Razorpay Test'],
    riskLevel: 'CRITICAL',
    coverage: 95
  },
  mainframe: {
    title: 'Mainframe Banking Testing',
    description: 'Testing mainframe banking systems covering COBOL batch processing, CICS online transactions, DB2 stored procedures, JCL execution, VSAM file I/O, MQ bridge integration, and RACF security. Validates legacy core banking system reliability and integration.',
    keyAreas: ['COBOL EOD Batch Processing (JCL)', 'CICS Online Transaction Response Time', 'DB2 Deadlock Detection & Resolution', 'VSAM KSDS File I/O Validation', 'MQ Bridge Message Transformation', 'COBOL-Java CTG Integration', 'Batch Restart/Recovery (S0C7 Abend)', 'RACF Security Profile Validation'],
    regulations: ['RBI Core Banking System Standards', 'COBOL/CICS Best Practices', 'IBM DB2 Optimization Guidelines', 'Mainframe Security Standards (RACF/ACF2)'],
    tools: ['IBM z/OS', 'CICS Transaction Server', 'DB2 for z/OS', 'IBM MQ for z/OS', 'Compuware Topaz', 'Micro Focus Enterprise'],
    riskLevel: 'CRITICAL',
    coverage: 85
  },
  concurrency: {
    title: 'Concurrency Testing',
    description: 'Testing concurrent access patterns in banking systems covering race conditions, deadlock detection, double-spend prevention, optimistic/pessimistic locking, distributed 2PC, connection pool management, and isolation level verification.',
    keyAreas: ['Race Condition on Same Account Debit', 'Deadlock Detection & Victim Selection', 'Double-Spend Prevention', 'Optimistic Lock Version Conflict', 'Pessimistic Lock Timeout & Retry', 'Distributed 2PC Atomicity', '100+ Concurrent Transfer Stress', 'Connection Pool Exhaustion Handling'],
    regulations: ['ACID Transaction Requirements', 'Banking Double-Spend Prevention', 'RBI Electronic Fund Transfer Guidelines', 'Database Isolation Level Standards'],
    tools: ['JMeter', 'Gatling', 'Locust', 'k6', 'pgbench', 'sysbench', 'Custom Thread Pool Executor'],
    riskLevel: 'HIGH',
    coverage: 90
  }
};

/* ==================== TOPIC METRICS ==================== */
const TOPIC_METRICS = {
  compliance: { testDataCount:8, scenarioCount:10, caseCount:10, avgExecTime:'5.2s', lastRun:'2026-02-28 09:45 IST', env:'UAT-COMPLIANCE', version:'v2.8.1' },
  contract: { testDataCount:8, scenarioCount:10, caseCount:10, avgExecTime:'2.4s', lastRun:'2026-02-28 10:30 IST', env:'UAT-CONTRACT', version:'v1.5.0' },
  datapipeline: { testDataCount:8, scenarioCount:10, caseCount:10, avgExecTime:'18.6s', lastRun:'2026-02-28 07:15 IST', env:'UAT-ETL', version:'v3.2.4' },
  messagequeue: { testDataCount:8, scenarioCount:10, caseCount:10, avgExecTime:'5.7s', lastRun:'2026-02-28 11:45 IST', env:'UAT-MQ', version:'v2.1.3' },
  microservices: { testDataCount:8, scenarioCount:10, caseCount:10, avgExecTime:'10.6s', lastRun:'2026-02-28 13:00 IST', env:'UAT-MESH', version:'v4.0.2' },
  chaos: { testDataCount:8, scenarioCount:10, caseCount:10, avgExecTime:'115.2s', lastRun:'2026-02-28 02:00 IST', env:'STAGING-CHAOS', version:'v1.9.0' },
  cloudnative: { testDataCount:8, scenarioCount:10, caseCount:10, avgExecTime:'33.4s', lastRun:'2026-02-28 09:30 IST', env:'AWS-UAT', version:'v2.4.1' },
  payment: { testDataCount:8, scenarioCount:10, caseCount:10, avgExecTime:'4.6s', lastRun:'2026-02-28 14:45 IST', env:'UAT-PAYMENT', version:'v5.1.0' },
  mainframe: { testDataCount:8, scenarioCount:10, caseCount:10, avgExecTime:'9.8s', lastRun:'2026-02-28 05:00 IST', env:'LPAR-TEST', version:'v7.3.2' },
  concurrency: { testDataCount:8, scenarioCount:10, caseCount:10, avgExecTime:'6.7s', lastRun:'2026-02-28 16:00 IST', env:'UAT-PERF', version:'v1.2.0' }
};

/* ==================== COMPLIANCE & REGULATORY ==================== */
const complianceData = {
  testData: [
    { id:'TD-CR-001', custId:'CUST-10001', kycType:'Full KYC', aadhaar:'XXXX-XXXX-1234', pan:'ABCDE1234F', risk:'HIGH', docStatus:'Verified', expected:'Pass' },
    { id:'TD-CR-002', custId:'CUST-10002', kycType:'eKYC', aadhaar:'XXXX-XXXX-5678', pan:'FGHIJ5678K', risk:'LOW', docStatus:'Verified', expected:'Pass' },
    { id:'TD-CR-003', custId:'CUST-10003', kycType:'Video KYC', aadhaar:'XXXX-XXXX-9012', pan:'KLMNO9012P', risk:'MEDIUM', docStatus:'Pending', expected:'Fail' },
    { id:'TD-CR-004', custId:'CUST-10004', kycType:'CKYC', aadhaar:'XXXX-XXXX-3456', pan:'PQRST3456U', risk:'HIGH', docStatus:'Expired', expected:'Fail' },
    { id:'TD-CR-005', custId:'CUST-10005', kycType:'Full KYC', aadhaar:'XXXX-XXXX-7890', pan:'UVWXY7890Z', risk:'LOW', docStatus:'Verified', expected:'Pass' },
    { id:'TD-CR-006', custId:'CUST-10006', kycType:'Re-KYC', aadhaar:'XXXX-XXXX-2345', pan:'ABCDE2345G', risk:'MEDIUM', docStatus:'Verified', expected:'Pass' },
    { id:'TD-CR-007', custId:'CUST-10007', kycType:'Simplified KYC', aadhaar:'XXXX-XXXX-6789', pan:'FGHIJ6789L', risk:'LOW', docStatus:'Verified', expected:'Pass' },
    { id:'TD-CR-008', custId:'CUST-10008', kycType:'Full KYC', aadhaar:'XXXX-XXXX-0123', pan:'KLMNO0123Q', risk:'HIGH', docStatus:'Rejected', expected:'Fail' }
  ],
  scenarios: [
    { id:'TS-CR-001', scenario:'Aadhaar OTP-based eKYC verification', category:'KYC', priority:'P0', status:'Pass', time:'2.3s' },
    { id:'TS-CR-002', scenario:'Video KYC (V-CIP) with liveness detection', category:'KYC', priority:'P0', status:'Pass', time:'15.1s' },
    { id:'TS-CR-003', scenario:'PAN-Aadhaar cross-verification', category:'KYC', priority:'P1', status:'Pass', time:'3.8s' },
    { id:'TS-CR-004', scenario:'AML suspicious transaction detection (>10L threshold)', category:'AML', priority:'P0', status:'Pass', time:'1.2s' },
    { id:'TS-CR-005', scenario:'OFAC sanctions list screening with fuzzy match', category:'Sanctions', priority:'P0', status:'Pass', time:'0.18s' },
    { id:'TS-CR-006', scenario:'PCI-DSS cardholder data encryption at rest', category:'PCI-DSS', priority:'P0', status:'Pass', time:'4.5s' },
    { id:'TS-CR-007', scenario:'GDPR right-to-erasure request processing', category:'GDPR', priority:'P1', status:'Pass', time:'8.2s' },
    { id:'TS-CR-008', scenario:'SOX segregation of duties matrix validation', category:'SOX', priority:'P1', status:'Fail', time:'12.4s' },
    { id:'TS-CR-009', scenario:'RBI CRILC large exposure reporting accuracy', category:'RBI', priority:'P0', status:'Pass', time:'6.7s' },
    { id:'TS-CR-010', scenario:'BASEL III CET1 capital ratio computation', category:'BASEL', priority:'P1', status:'Blocked', time:'N/A' }
  ],
  cases: [
    { id:'TC-CR-001', name:'Validate Aadhaar OTP flow end-to-end', steps:'1. Submit Aadhaar number\n2. Trigger OTP via UIDAI\n3. Verify OTP response\n4. Store eKYC XML', expected:'eKYC data stored with status=Verified', actual:'eKYC data stored successfully', status:'Pass', priority:'P0' },
    { id:'TC-CR-002', name:'Detect structuring in cash deposits', steps:'1. Simulate 5 deposits of 1.8L each\n2. Run AML rule engine\n3. Check alert generation', expected:'Structuring alert raised for amount splitting', actual:'Alert raised within 2s', status:'Pass', priority:'P0' },
    { id:'TC-CR-003', name:'Screen customer against OFAC SDN list', steps:'1. Input customer name\n2. Run fuzzy matching\n3. Validate match score\n4. Check alert status', expected:'Match detected with >85% similarity', actual:'Match at 92% - alert raised', status:'Pass', priority:'P0' },
    { id:'TC-CR-004', name:'Validate PCI-DSS Requirement 3 - encryption', steps:'1. Insert card data\n2. Verify AES-256 encryption\n3. Check key management', expected:'Card data encrypted, keys rotated quarterly', actual:'Encryption verified, key rotation on schedule', status:'Pass', priority:'P0' },
    { id:'TC-CR-005', name:'Process GDPR data erasure request', steps:'1. Submit erasure request\n2. Identify all data stores\n3. Execute deletion\n4. Verify audit trail', expected:'All PII removed, audit log retained', actual:'PII removed from 7/7 systems', status:'Pass', priority:'P1' },
    { id:'TC-CR-006', name:'Validate SOX access recertification', steps:'1. Trigger quarterly review\n2. Check manager approvals\n3. Validate SoD conflicts', expected:'All accesses reviewed, SoD conflicts flagged', actual:'SoD conflict detected but not auto-escalated', status:'Fail', priority:'P1' },
    { id:'TC-CR-007', name:'Generate CRILC exposure report', steps:'1. Aggregate large exposures\n2. Apply RBI thresholds\n3. Format XBRL output', expected:'CRILC report generated with all exposures >5Cr', actual:'Report generated accurately', status:'Pass', priority:'P0' },
    { id:'TC-CR-008', name:'Compute BASEL III LCR ratio', steps:'1. Calculate HQLA\n2. Compute net cash outflows\n3. Derive LCR ratio', expected:'LCR >= 100% as per RBI requirement', actual:'LCR computed at 112%', status:'Pass', priority:'P1' },
    { id:'TC-CR-009', name:'Validate STR filing to FIU-IND', steps:'1. Generate STR XML\n2. Validate schema\n3. Submit to FIU portal', expected:'STR filed within 7 days of detection', actual:'Filed in 3 days', status:'Pass', priority:'P0' },
    { id:'TC-CR-010', name:'Re-KYC periodic refresh for high-risk customer', steps:'1. Identify due accounts\n2. Trigger re-KYC workflow\n3. Verify document refresh', expected:'Re-KYC completed within 2-year cycle', actual:'Blocked - UIDAI API timeout', status:'Blocked', priority:'P0' }
  ],
  results: { total:20, pass:18, fail:1, blocked:1, failedTests:['TC-CR-006: SOX SoD conflict not auto-escalated - Missing escalation workflow configuration'], timeline:'Executed: 2026-02-28 09:00 - 09:45 IST' }
};

/* ==================== CONTRACT TESTING ==================== */
const contractData = {
  testData: [
    { id:'TD-CT-001', consumer:'AccountService', provider:'CustomerAPI', version:'v2.3.1', endpoint:'/api/customers/{id}', method:'GET', reqSchema:'N/A', resSchema:'CustomerDTO', status:'Active' },
    { id:'TD-CT-002', consumer:'LoanService', provider:'CreditScoreAPI', version:'v1.8.0', endpoint:'/api/credit-score', method:'POST', reqSchema:'CreditRequest', resSchema:'CreditResponse', status:'Active' },
    { id:'TD-CT-003', consumer:'PaymentGateway', provider:'CoreBankingAPI', version:'v3.1.2', endpoint:'/api/accounts/debit', method:'POST', reqSchema:'DebitRequest', resSchema:'TransactionResult', status:'Active' },
    { id:'TD-CT-004', consumer:'MobileApp', provider:'AuthService', version:'v2.0.0', endpoint:'/api/auth/token', method:'POST', reqSchema:'LoginRequest', resSchema:'TokenResponse', status:'Active' },
    { id:'TD-CT-005', consumer:'FraudEngine', provider:'TransactionAPI', version:'v1.5.3', endpoint:'/api/transactions/realtime', method:'GET', reqSchema:'N/A', resSchema:'TransactionStream', status:'Active' },
    { id:'TD-CT-006', consumer:'ReportingService', provider:'LedgerAPI', version:'v2.1.0', endpoint:'/api/ledger/balance', method:'GET', reqSchema:'N/A', resSchema:'BalanceDTO', status:'Deprecated' },
    { id:'TD-CT-007', consumer:'NotificationService', provider:'CustomerAPI', version:'v2.3.1', endpoint:'/api/customers/{id}/preferences', method:'GET', reqSchema:'N/A', resSchema:'PreferenceDTO', status:'Active' },
    { id:'TD-CT-008', consumer:'AuditService', provider:'CoreBankingAPI', version:'v3.1.2', endpoint:'/api/audit/trail', method:'POST', reqSchema:'AuditEntry', resSchema:'AuditResponse', status:'Active' }
  ],
  scenarios: [
    { id:'TS-CT-001', scenario:'Pact contract verification - AccountService consumer', category:'Pact', priority:'P0', status:'Pass', time:'3.2s' },
    { id:'TS-CT-002', scenario:'OpenAPI schema validation - CustomerAPI v2.3.1', category:'Schema', priority:'P0', status:'Pass', time:'1.1s' },
    { id:'TS-CT-003', scenario:'Breaking change detection - removed field in response', category:'Compatibility', priority:'P0', status:'Pass', time:'0.8s' },
    { id:'TS-CT-004', scenario:'Backward compatibility - v2 to v3 migration', category:'Compatibility', priority:'P0', status:'Pass', time:'4.5s' },
    { id:'TS-CT-005', scenario:'Consumer-driven contract for LoanService', category:'CDC', priority:'P1', status:'Pass', time:'2.7s' },
    { id:'TS-CT-006', scenario:'GraphQL schema evolution validation', category:'Schema', priority:'P1', status:'Pass', time:'1.9s' },
    { id:'TS-CT-007', scenario:'API versioning header propagation test', category:'Versioning', priority:'P1', status:'Pass', time:'0.5s' },
    { id:'TS-CT-008', scenario:'Null field handling in response contract', category:'Schema', priority:'P0', status:'Fail', time:'1.3s' },
    { id:'TS-CT-009', scenario:'Rate limit header contract verification', category:'Contract', priority:'P2', status:'Pass', time:'0.9s' },
    { id:'TS-CT-010', scenario:'mTLS certificate chain validation between services', category:'Security', priority:'P0', status:'Pass', time:'5.1s' }
  ],
  cases: [
    { id:'TC-CT-001', name:'Verify Pact broker contract publish', steps:'1. Generate consumer pact\n2. Publish to Pact broker\n3. Verify provider against pact', expected:'Provider satisfies all consumer expectations', actual:'All 12 interactions verified', status:'Pass', priority:'P0' },
    { id:'TC-CT-002', name:'Detect breaking schema change', steps:'1. Remove field from response\n2. Run contract tests\n3. Check failure report', expected:'Contract test fails with field-missing error', actual:'Failure detected correctly', status:'Pass', priority:'P0' },
    { id:'TC-CT-003', name:'Validate backward-compatible addition', steps:'1. Add optional field to response\n2. Run all consumer contracts\n3. Verify no breakage', expected:'All existing consumers unaffected', actual:'Zero consumer failures', status:'Pass', priority:'P0' },
    { id:'TC-CT-004', name:'OpenAPI spec validation against live API', steps:'1. Fetch live API response\n2. Validate against OpenAPI spec\n3. Report discrepancies', expected:'Response matches spec 100%', actual:'Response matches spec', status:'Pass', priority:'P0' },
    { id:'TC-CT-005', name:'Consumer-driven contract for CreditScoreAPI', steps:'1. Define consumer expectations\n2. Generate Pact file\n3. Verify against provider', expected:'Provider returns credit score in expected format', actual:'Score format validated', status:'Pass', priority:'P1' },
    { id:'TC-CT-006', name:'Test null handling in CustomerDTO', steps:'1. Request customer with missing fields\n2. Check null vs absent handling\n3. Validate consumer parsing', expected:'Null fields handled gracefully', actual:'Consumer crashed on null middleName', status:'Fail', priority:'P0' },
    { id:'TC-CT-007', name:'API version negotiation via Accept header', steps:'1. Send request with Accept: v2\n2. Verify v2 response format\n3. Send with Accept: v3', expected:'Correct version returned per header', actual:'Version negotiation works', status:'Pass', priority:'P1' },
    { id:'TC-CT-008', name:'Validate error response contract', steps:'1. Trigger 400 error\n2. Trigger 404 error\n3. Validate error envelope format', expected:'Error response matches ErrorDTO schema', actual:'Error envelope consistent', status:'Pass', priority:'P1' },
    { id:'TC-CT-009', name:'Verify mTLS between services', steps:'1. Test with valid cert\n2. Test with expired cert\n3. Test without cert', expected:'Only valid cert accepted', actual:'mTLS enforcement verified', status:'Pass', priority:'P0' },
    { id:'TC-CT-010', name:'Contract test in CI/CD pipeline', steps:'1. Trigger pipeline on PR\n2. Run contract tests\n3. Block merge on failure', expected:'Pipeline blocks merge on contract failure', actual:'Gate enforced correctly', status:'Pass', priority:'P1' }
  ],
  results: { total:20, pass:19, fail:1, blocked:0, failedTests:['TC-CT-006: Consumer crashed on null middleName - Missing null-safety in CustomerDTO deserialization'], timeline:'Executed: 2026-02-28 10:00 - 10:30 IST' }
};

/* ==================== DATA PIPELINE & ETL ==================== */
const dataPipelineData = {
  testData: [
    { id:'TD-DP-001', pipeline:'PL-EOD-001', source:'Core Banking (Oracle)', target:'Data Warehouse (Snowflake)', records:'2,450,000', rule:'Currency normalization to INR', quality:'99.7%', loadStatus:'Completed', variance:'0.02%' },
    { id:'TD-DP-002', pipeline:'PL-TXN-002', source:'Card Switch (ISO 8583)', target:'Fraud Analytics (Spark)', records:'8,200,000', rule:'PAN masking + tokenization', quality:'99.9%', loadStatus:'Completed', variance:'0.00%' },
    { id:'TD-DP-003', pipeline:'PL-KYC-003', source:'CRM (Salesforce)', target:'KYC Hub (PostgreSQL)', records:'145,000', rule:'Address standardization', quality:'97.3%', loadStatus:'Completed', variance:'0.15%' },
    { id:'TD-DP-004', pipeline:'PL-REC-004', source:'GL System (SAP)', target:'Reconciliation Engine', records:'1,800,000', rule:'Debit-Credit balancing', quality:'100%', loadStatus:'Completed', variance:'0.00%' },
    { id:'TD-DP-005', pipeline:'PL-AML-005', source:'Transaction DB (MongoDB)', target:'AML Engine (SAS)', records:'5,600,000', rule:'Threshold flagging >10L', quality:'99.5%', loadStatus:'Completed', variance:'0.08%' },
    { id:'TD-DP-006', pipeline:'PL-REP-006', source:'Data Warehouse', target:'RBI Reporting (XBRL)', records:'320,000', rule:'XBRL taxonomy mapping', quality:'99.8%', loadStatus:'Failed', variance:'2.30%' },
    { id:'TD-DP-007', pipeline:'PL-LOAN-007', source:'LMS (Finacle)', target:'Credit Analytics', records:'890,000', rule:'EMI recalculation', quality:'99.2%', loadStatus:'Completed', variance:'0.05%' },
    { id:'TD-DP-008', pipeline:'PL-CDC-008', source:'Core Banking (CDC)', target:'Real-time Dashboard', records:'12,500,000', rule:'Change data capture streaming', quality:'99.6%', loadStatus:'Completed', variance:'0.01%' }
  ],
  scenarios: [
    { id:'TS-DP-001', scenario:'EOD batch extraction from Core Banking system', category:'Extraction', priority:'P0', status:'Pass', time:'45.2s' },
    { id:'TS-DP-002', scenario:'GL reconciliation - debit/credit balancing', category:'Reconciliation', priority:'P0', status:'Pass', time:'32.1s' },
    { id:'TS-DP-003', scenario:'Data quality check - null/duplicate detection', category:'Quality', priority:'P0', status:'Pass', time:'18.7s' },
    { id:'TS-DP-004', scenario:'Incremental load with CDC (Change Data Capture)', category:'Loading', priority:'P0', status:'Pass', time:'12.3s' },
    { id:'TS-DP-005', scenario:'Currency conversion transformation accuracy', category:'Transform', priority:'P1', status:'Pass', time:'5.6s' },
    { id:'TS-DP-006', scenario:'PAN/Aadhaar masking in transit pipeline', category:'Security', priority:'P0', status:'Pass', time:'3.2s' },
    { id:'TS-DP-007', scenario:'XBRL taxonomy mapping for RBI reporting', category:'Transform', priority:'P0', status:'Fail', time:'28.4s' },
    { id:'TS-DP-008', scenario:'Duplicate transaction detection across sources', category:'Quality', priority:'P1', status:'Pass', time:'22.1s' },
    { id:'TS-DP-009', scenario:'Schema drift detection in source system', category:'Monitoring', priority:'P1', status:'Fail', time:'8.9s' },
    { id:'TS-DP-010', scenario:'Pipeline retry on transient failure', category:'Resilience', priority:'P0', status:'Blocked', time:'N/A' }
  ],
  cases: [
    { id:'TC-DP-001', name:'Validate EOD batch record count', steps:'1. Trigger EOD extraction\n2. Compare source count\n3. Verify target count\n4. Check variance', expected:'Variance < 0.01% between source and target', actual:'Variance at 0.02% - within threshold', status:'Pass', priority:'P0' },
    { id:'TC-DP-002', name:'Verify currency normalization to INR', steps:'1. Load multi-currency transactions\n2. Apply FX rates\n3. Validate INR conversion', expected:'All amounts converted using RBI reference rate', actual:'Conversion accurate to 2 decimal places', status:'Pass', priority:'P0' },
    { id:'TC-DP-003', name:'Test PAN masking in ETL pipeline', steps:'1. Input raw PAN data\n2. Verify masking transformation\n3. Check only last 4 digits visible', expected:'PAN masked as XXXXXXXX1234', actual:'Masking applied correctly', status:'Pass', priority:'P0' },
    { id:'TC-DP-004', name:'Validate GL debit-credit reconciliation', steps:'1. Load GL entries\n2. Sum debits and credits\n3. Verify zero balance', expected:'Total debits = Total credits (zero variance)', actual:'Perfect balance achieved', status:'Pass', priority:'P0' },
    { id:'TC-DP-005', name:'Detect duplicate transactions in load', steps:'1. Insert batch with duplicates\n2. Run dedup logic\n3. Verify unique records', expected:'Duplicates flagged and quarantined', actual:'12 duplicates caught and quarantined', status:'Pass', priority:'P1' },
    { id:'TC-DP-006', name:'XBRL report generation from warehouse data', steps:'1. Extract regulatory data\n2. Map to XBRL taxonomy\n3. Generate filing', expected:'Valid XBRL output matching RBI taxonomy', actual:'Taxonomy version mismatch for 3 elements', status:'Fail', priority:'P0' },
    { id:'TC-DP-007', name:'Schema drift detection and alerting', steps:'1. Modify source column type\n2. Run pipeline\n3. Check drift alert', expected:'Alert raised on schema change before load', actual:'Schema change detected but alert delayed', status:'Fail', priority:'P1' },
    { id:'TC-DP-008', name:'CDC streaming latency test', steps:'1. Insert record in source\n2. Measure propagation time\n3. Verify in target', expected:'End-to-end latency < 5 seconds', actual:'Latency at 2.3 seconds', status:'Pass', priority:'P0' },
    { id:'TC-DP-009', name:'Data quality scorecard generation', steps:'1. Run quality rules\n2. Compute completeness/accuracy\n3. Generate scorecard', expected:'Scorecard with all dimensions > 95%', actual:'All dimensions above threshold', status:'Pass', priority:'P1' },
    { id:'TC-DP-010', name:'Pipeline auto-retry on Snowflake timeout', steps:'1. Simulate Snowflake timeout\n2. Check retry mechanism\n3. Verify eventual success', expected:'Pipeline retries 3 times with backoff', actual:'Blocked - Snowflake maintenance window', status:'Blocked', priority:'P0' }
  ],
  results: { total:20, pass:17, fail:2, blocked:1, failedTests:['TC-DP-006: XBRL taxonomy version mismatch for 3 elements', 'TC-DP-007: Schema drift alert delayed by 45 seconds'], timeline:'Executed: 2026-02-28 06:00 - 07:15 IST (EOD batch window)' }
};

/* ==================== MESSAGE QUEUE ==================== */
const messageQueueData = {
  testData: [
    { id:'TD-MQ-001', queue:'txn.processing.queue', msgId:'MSG-90001', producer:'PaymentService', consumer:'LedgerService', payload:'2.4 KB', delivery:'Persistent', retry:0, status:'Delivered' },
    { id:'TD-MQ-002', queue:'fraud.alert.topic', msgId:'MSG-90002', producer:'FraudEngine', consumer:'AlertService', payload:'1.8 KB', delivery:'Persistent', retry:0, status:'Delivered' },
    { id:'TD-MQ-003', queue:'kyc.verification.queue', msgId:'MSG-90003', producer:'OnboardingService', consumer:'KYCEngine', payload:'5.2 KB', delivery:'Persistent', retry:2, status:'Redelivered' },
    { id:'TD-MQ-004', queue:'notification.sms.queue', msgId:'MSG-90004', producer:'NotificationService', consumer:'SMSGateway', payload:'0.5 KB', delivery:'Non-Persistent', retry:0, status:'Delivered' },
    { id:'TD-MQ-005', queue:'audit.event.topic', msgId:'MSG-90005', producer:'AuditService', consumer:'ComplianceEngine', payload:'3.1 KB', delivery:'Persistent', retry:0, status:'Delivered' },
    { id:'TD-MQ-006', queue:'loan.approval.queue', msgId:'MSG-90006', producer:'LoanService', consumer:'ApprovalEngine', payload:'4.7 KB', delivery:'Persistent', retry:3, status:'Dead Letter' },
    { id:'TD-MQ-007', queue:'settlement.batch.queue', msgId:'MSG-90007', producer:'SettlementService', consumer:'CoreBanking', payload:'12.3 KB', delivery:'Persistent', retry:0, status:'Delivered' },
    { id:'TD-MQ-008', queue:'realtime.rate.topic', msgId:'MSG-90008', producer:'TreasuryService', consumer:'FXEngine', payload:'0.3 KB', delivery:'Non-Persistent', retry:0, status:'Delivered' }
  ],
  scenarios: [
    { id:'TS-MQ-001', scenario:'Message ordering guarantee in transaction queue', category:'Ordering', priority:'P0', status:'Pass', time:'2.1s' },
    { id:'TS-MQ-002', scenario:'Dead letter queue handling after max retries', category:'DLQ', priority:'P0', status:'Pass', time:'8.5s' },
    { id:'TS-MQ-003', scenario:'Message replay from Kafka topic offset', category:'Replay', priority:'P1', status:'Pass', time:'5.3s' },
    { id:'TS-MQ-004', scenario:'Consumer group rebalancing during scale-out', category:'Scaling', priority:'P0', status:'Pass', time:'12.7s' },
    { id:'TS-MQ-005', scenario:'Exactly-once delivery for payment messages', category:'Delivery', priority:'P0', status:'Pass', time:'3.8s' },
    { id:'TS-MQ-006', scenario:'Topic partition key distribution for account IDs', category:'Partitioning', priority:'P1', status:'Pass', time:'1.9s' },
    { id:'TS-MQ-007', scenario:'Message TTL expiry and cleanup', category:'Lifecycle', priority:'P2', status:'Pass', time:'4.2s' },
    { id:'TS-MQ-008', scenario:'Schema registry Avro compatibility check', category:'Schema', priority:'P0', status:'Fail', time:'2.6s' },
    { id:'TS-MQ-009', scenario:'Cross-DC message replication latency', category:'Replication', priority:'P0', status:'Pass', time:'15.4s' },
    { id:'TS-MQ-010', scenario:'Backpressure handling under high throughput', category:'Performance', priority:'P1', status:'Blocked', time:'N/A' }
  ],
  cases: [
    { id:'TC-MQ-001', name:'Verify FIFO ordering in transaction queue', steps:'1. Publish 1000 ordered messages\n2. Consume all messages\n3. Validate sequence', expected:'Messages consumed in exact publish order', actual:'Order maintained across all 1000 messages', status:'Pass', priority:'P0' },
    { id:'TC-MQ-002', name:'Test dead letter queue after 3 retries', steps:'1. Publish poison message\n2. Allow 3 retry attempts\n3. Verify DLQ placement', expected:'Message moved to DLQ after 3 failures', actual:'DLQ placement after 3rd retry confirmed', status:'Pass', priority:'P0' },
    { id:'TC-MQ-003', name:'Kafka topic replay from specific offset', steps:'1. Record current offset\n2. Publish 500 messages\n3. Replay from recorded offset', expected:'All 500 messages replayed correctly', actual:'Replay successful with zero data loss', status:'Pass', priority:'P1' },
    { id:'TC-MQ-004', name:'Consumer group rebalance on pod scale-out', steps:'1. Start with 3 consumers\n2. Scale to 6 consumers\n3. Verify partition reassignment', expected:'Partitions evenly distributed within 30s', actual:'Rebalance completed in 18s', status:'Pass', priority:'P0' },
    { id:'TC-MQ-005', name:'Exactly-once semantics for payment processing', steps:'1. Enable idempotent producer\n2. Simulate network partition\n3. Verify no duplicates', expected:'Zero duplicate messages in consumer', actual:'No duplicates detected', status:'Pass', priority:'P0' },
    { id:'TC-MQ-006', name:'Avro schema backward compatibility', steps:'1. Register schema v1\n2. Publish with schema v2 (new field)\n3. Verify backward read', expected:'v1 consumer reads v2 messages without error', actual:'Consumer failed on new required field', status:'Fail', priority:'P0' },
    { id:'TC-MQ-007', name:'Message TTL expiry in notification queue', steps:'1. Publish with TTL=60s\n2. Wait 90 seconds\n3. Attempt consume', expected:'Message expired and not consumable', actual:'Message correctly expired', status:'Pass', priority:'P2' },
    { id:'TC-MQ-008', name:'Cross-datacenter replication validation', steps:'1. Publish to DC-Primary\n2. Verify replication to DC-DR\n3. Measure latency', expected:'Replication latency < 500ms', actual:'Latency at 230ms', status:'Pass', priority:'P0' },
    { id:'TC-MQ-009', name:'Consumer lag monitoring and alerting', steps:'1. Stop consumer for 5 min\n2. Continue producing\n3. Check lag alert', expected:'Alert triggered when lag > 10000 messages', actual:'Alert fired at lag=10500', status:'Pass', priority:'P1' },
    { id:'TC-MQ-010', name:'Backpressure test at 100K msg/sec', steps:'1. Ramp producer to 100K/s\n2. Monitor consumer throughput\n3. Check memory/CPU', expected:'System handles backpressure without OOM', actual:'Blocked - load generator capacity issue', status:'Blocked', priority:'P1' }
  ],
  results: { total:20, pass:18, fail:1, blocked:1, failedTests:['TC-MQ-006: Avro schema v2 added required field - broke backward compatibility for v1 consumers'], timeline:'Executed: 2026-02-28 11:00 - 11:45 IST' }
};

/* ==================== MICROSERVICES ==================== */
const microservicesData = {
  testData: [
    { id:'TD-MS-001', service:'AccountService', endpoint:'/api/v1/accounts/{id}', method:'GET', reqPayload:'N/A', resCode:200, circuit:'CLOSED', latency:'45ms', traceId:'trace-a1b2c3' },
    { id:'TD-MS-002', service:'PaymentService', endpoint:'/api/v1/payments/transfer', method:'POST', reqPayload:'{"from":"ACC-001","to":"ACC-002","amount":50000}', resCode:200, circuit:'CLOSED', latency:'120ms', traceId:'trace-d4e5f6' },
    { id:'TD-MS-003', service:'LoanService', endpoint:'/api/v1/loans/apply', method:'POST', reqPayload:'{"customerId":"CUST-001","amount":500000,"tenure":36}', resCode:201, circuit:'CLOSED', latency:'230ms', traceId:'trace-g7h8i9' },
    { id:'TD-MS-004', service:'FraudService', endpoint:'/api/v1/fraud/check', method:'POST', reqPayload:'{"txnId":"TXN-001","amount":250000}', resCode:200, circuit:'CLOSED', latency:'85ms', traceId:'trace-j1k2l3' },
    { id:'TD-MS-005', service:'NotificationService', endpoint:'/api/v1/notify/sms', method:'POST', reqPayload:'{"mobile":"98XXXXXX01","msg":"OTP: 123456"}', resCode:202, circuit:'CLOSED', latency:'35ms', traceId:'trace-m4n5o6' },
    { id:'TD-MS-006', service:'CustomerService', endpoint:'/api/v1/customers/{id}', method:'GET', reqPayload:'N/A', resCode:503, circuit:'OPEN', latency:'5002ms', traceId:'trace-p7q8r9' },
    { id:'TD-MS-007', service:'RiskService', endpoint:'/api/v1/risk/score', method:'POST', reqPayload:'{"customerId":"CUST-003","loanType":"HOME"}', resCode:200, circuit:'HALF_OPEN', latency:'890ms', traceId:'trace-s1t2u3' },
    { id:'TD-MS-008', service:'AuditService', endpoint:'/api/v1/audit/log', method:'POST', reqPayload:'{"action":"TRANSFER","userId":"USR-001"}', resCode:201, circuit:'CLOSED', latency:'28ms', traceId:'trace-v4w5x6' }
  ],
  scenarios: [
    { id:'TS-MS-001', scenario:'Service discovery via Consul health checks', category:'Discovery', priority:'P0', status:'Pass', time:'1.5s' },
    { id:'TS-MS-002', scenario:'Circuit breaker OPEN state after 5 consecutive failures', category:'Resilience', priority:'P0', status:'Pass', time:'6.2s' },
    { id:'TS-MS-003', scenario:'Saga pattern - distributed transaction rollback', category:'Saga', priority:'P0', status:'Pass', time:'8.9s' },
    { id:'TS-MS-004', scenario:'Distributed tracing across 5 service hops', category:'Observability', priority:'P1', status:'Pass', time:'2.3s' },
    { id:'TS-MS-005', scenario:'Service mesh (Istio) mutual TLS enforcement', category:'Security', priority:'P0', status:'Pass', time:'4.1s' },
    { id:'TS-MS-006', scenario:'Blue-green deployment with zero downtime', category:'Deployment', priority:'P0', status:'Fail', time:'45.3s' },
    { id:'TS-MS-007', scenario:'API gateway rate limiting per tenant', category:'Gateway', priority:'P1', status:'Pass', time:'3.7s' },
    { id:'TS-MS-008', scenario:'Sidecar proxy (Envoy) configuration validation', category:'Mesh', priority:'P1', status:'Fail', time:'2.8s' },
    { id:'TS-MS-009', scenario:'Canary release with traffic splitting (90/10)', category:'Deployment', priority:'P1', status:'Pass', time:'30.2s' },
    { id:'TS-MS-010', scenario:'Service-to-service JWT token propagation', category:'Security', priority:'P0', status:'Blocked', time:'N/A' }
  ],
  cases: [
    { id:'TC-MS-001', name:'Health check endpoint validation', steps:'1. Call /health on all services\n2. Verify 200 response\n3. Check dependency status', expected:'All services return healthy status', actual:'All 8 services healthy', status:'Pass', priority:'P0' },
    { id:'TC-MS-002', name:'Circuit breaker trips after failures', steps:'1. Simulate 5 failures on CustomerService\n2. Verify circuit opens\n3. Check fallback response', expected:'Circuit opens, fallback returns cached data', actual:'Circuit opened after 5th failure', status:'Pass', priority:'P0' },
    { id:'TC-MS-003', name:'Saga rollback on payment failure', steps:'1. Initiate loan disbursement saga\n2. Fail payment step\n3. Verify compensating actions', expected:'Account balance restored, loan status reverted', actual:'All compensating actions completed', status:'Pass', priority:'P0' },
    { id:'TC-MS-004', name:'Round-robin load balancing verification', steps:'1. Send 100 requests\n2. Track target instances\n3. Verify distribution', expected:'Even distribution across 4 instances (25% each)', actual:'Distribution: 26%, 24%, 25%, 25%', status:'Pass', priority:'P1' },
    { id:'TC-MS-005', name:'Retry with exponential backoff', steps:'1. Simulate transient failure\n2. Monitor retry attempts\n3. Verify backoff timing', expected:'3 retries with 1s, 2s, 4s backoff', actual:'Retry timing within tolerance', status:'Pass', priority:'P0' },
    { id:'TC-MS-006', name:'Blue-green deployment switchover', steps:'1. Deploy new version to green\n2. Switch traffic\n3. Verify zero dropped requests', expected:'Zero errors during switchover', actual:'12 requests dropped during DNS propagation', status:'Fail', priority:'P0' },
    { id:'TC-MS-007', name:'Envoy sidecar proxy route validation', steps:'1. Deploy sidecar config\n2. Test routing rules\n3. Verify traffic flow', expected:'All routes match Istio VirtualService config', actual:'1 route mismatch in timeout config', status:'Fail', priority:'P1' },
    { id:'TC-MS-008', name:'Distributed trace correlation', steps:'1. Initiate multi-service request\n2. Collect traces from Jaeger\n3. Verify span correlation', expected:'Complete trace across all 5 hops', actual:'Full trace visible in Jaeger', status:'Pass', priority:'P1' },
    { id:'TC-MS-009', name:'Rate limit enforcement at API gateway', steps:'1. Send 150 requests in 1 minute\n2. Check rate limit response\n3. Verify 429 status code', expected:'Requests beyond 100/min get 429 response', actual:'Rate limiting enforced at 101st request', status:'Pass', priority:'P1' },
    { id:'TC-MS-010', name:'JWT propagation across service chain', steps:'1. Authenticate at gateway\n2. Forward JWT to downstream\n3. Verify token at each hop', expected:'JWT validated at every service boundary', actual:'Blocked - Token refresh not implemented in RiskService', status:'Blocked', priority:'P0' }
  ],
  results: { total:20, pass:17, fail:2, blocked:1, failedTests:['TC-MS-006: 12 requests dropped during blue-green DNS propagation', 'TC-MS-007: Envoy sidecar timeout config mismatch on /api/v1/risk/score route'], timeline:'Executed: 2026-02-28 12:00 - 13:00 IST' }
};

/* ==================== CHAOS & RESILIENCE ==================== */
const chaosData = {
  testData: [
    { id:'TD-CH-001', experiment:'EXP-001', target:'PaymentService', fault:'Pod Kill', duration:'30s', impact:'Single Pod', recovery:'45s', metric:'TPS > 500', result:'Pass' },
    { id:'TD-CH-002', experiment:'EXP-002', target:'CoreBankingDB', fault:'Network Partition', duration:'60s', impact:'DB Cluster', recovery:'120s', metric:'Error Rate < 1%', result:'Pass' },
    { id:'TD-CH-003', experiment:'EXP-003', target:'CacheCluster', fault:'Redis Eviction', duration:'120s', impact:'All Services', recovery:'30s', metric:'Cache Miss < 20%', result:'Fail' },
    { id:'TD-CH-004', experiment:'EXP-004', target:'APIGateway', fault:'CPU Stress 90%', duration:'300s', impact:'All Ingress', recovery:'60s', metric:'P99 Latency < 2s', result:'Pass' },
    { id:'TD-CH-005', experiment:'EXP-005', target:'MessageBroker', fault:'Disk Full', duration:'180s', impact:'Kafka Cluster', recovery:'90s', metric:'Zero Message Loss', result:'Pass' },
    { id:'TD-CH-006', experiment:'EXP-006', target:'LoanService', fault:'Memory Leak Simulation', duration:'600s', impact:'Single Service', recovery:'180s', metric:'OOM Recovery < 3min', result:'Fail' },
    { id:'TD-CH-007', experiment:'EXP-007', target:'DNS', fault:'DNS Resolution Failure', duration:'45s', impact:'Service Discovery', recovery:'15s', metric:'Failover < 30s', result:'Pass' },
    { id:'TD-CH-008', experiment:'EXP-008', target:'DR-Site', fault:'Primary DC Failover', duration:'N/A', impact:'Full Stack', recovery:'240s', metric:'RTO < 5min', result:'Fail' }
  ],
  scenarios: [
    { id:'TS-CH-001', scenario:'Random pod kill during peak transaction hours', category:'Pod Failure', priority:'P0', status:'Pass', time:'45.0s' },
    { id:'TS-CH-002', scenario:'Network partition between app and database tier', category:'Network', priority:'P0', status:'Pass', time:'120.0s' },
    { id:'TS-CH-003', scenario:'CPU stress test at 90% on API gateway nodes', category:'Resource', priority:'P0', status:'Pass', time:'300.0s' },
    { id:'TS-CH-004', scenario:'Kafka broker failure with ISR shrink', category:'Messaging', priority:'P0', status:'Pass', time:'90.0s' },
    { id:'TS-CH-005', scenario:'Redis cluster failover to replica', category:'Cache', priority:'P1', status:'Fail', time:'60.0s' },
    { id:'TS-CH-006', scenario:'DNS blackhole for external service dependencies', category:'Network', priority:'P0', status:'Pass', time:'45.0s' },
    { id:'TS-CH-007', scenario:'Full datacenter DR switchover drill', category:'DR', priority:'P0', status:'Fail', time:'480.0s' },
    { id:'TS-CH-008', scenario:'Certificate expiry simulation on mTLS services', category:'Security', priority:'P1', status:'Pass', time:'30.0s' },
    { id:'TS-CH-009', scenario:'AZ (Availability Zone) failure simulation', category:'Infrastructure', priority:'P0', status:'Fail', time:'360.0s' },
    { id:'TS-CH-010', scenario:'Gradual memory leak detection via chaos monkey', category:'Resource', priority:'P1', status:'Blocked', time:'N/A' }
  ],
  cases: [
    { id:'TC-CH-001', name:'Pod kill recovery in PaymentService', steps:'1. Kill 1 of 4 pods\n2. Monitor request routing\n3. Verify auto-scaling\n4. Check zero failed txns', expected:'Traffic rerouted within 10s, new pod in 30s', actual:'Rerouted in 8s, pod ready in 28s', status:'Pass', priority:'P0' },
    { id:'TC-CH-002', name:'Database failover on network partition', steps:'1. Partition primary DB\n2. Verify replica promotion\n3. Check data consistency', expected:'Replica promoted within 30s, zero data loss', actual:'Promotion in 25s, no data loss', status:'Pass', priority:'P0' },
    { id:'TC-CH-003', name:'Redis cluster failover validation', steps:'1. Kill Redis master\n2. Verify sentinel promotion\n3. Check cache warm-up', expected:'Sentinel promotes replica within 15s', actual:'Promotion took 45s - cache miss spike to 35%', status:'Fail', priority:'P1' },
    { id:'TC-CH-004', name:'API gateway under CPU stress', steps:'1. Apply 90% CPU stress\n2. Monitor P99 latency\n3. Check auto-scaling trigger', expected:'P99 stays under 2s with HPA scale-out', actual:'P99 at 1.8s, HPA triggered at +2 pods', status:'Pass', priority:'P0' },
    { id:'TC-CH-005', name:'Kafka broker failure with ISR recovery', steps:'1. Kill 1 of 3 brokers\n2. Monitor ISR shrink\n3. Verify message availability', expected:'ISR adjusts, zero message loss', actual:'ISR adjusted, all messages available', status:'Pass', priority:'P0' },
    { id:'TC-CH-006', name:'Full DC failover to DR site', steps:'1. Simulate primary DC outage\n2. Trigger DR failover\n3. Validate service restoration\n4. Check RTO', expected:'All services restored at DR within 5 min (RTO)', actual:'DR restoration took 8 minutes - exceeded RTO', status:'Fail', priority:'P0' },
    { id:'TC-CH-007', name:'DNS blackhole for external APIs', steps:'1. Block DNS for UIDAI API\n2. Verify circuit breaker activation\n3. Check graceful degradation', expected:'Fallback to cached KYC data within 5s', actual:'Circuit breaker activated, cached data served', status:'Pass', priority:'P0' },
    { id:'TC-CH-008', name:'AZ failure blast radius containment', steps:'1. Simulate AZ-1 failure\n2. Verify cross-AZ traffic\n3. Check overall availability', expected:'Service remains available via AZ-2 and AZ-3', actual:'AZ-2 overloaded - cascading latency spike', status:'Fail', priority:'P0' },
    { id:'TC-CH-009', name:'Certificate expiry graceful handling', steps:'1. Deploy expired cert to service\n2. Monitor mTLS failures\n3. Verify alert generation', expected:'mTLS fails, alert fires, traffic routes to healthy pods', actual:'Alert fired in 10s, traffic rerouted', status:'Pass', priority:'P1' },
    { id:'TC-CH-010', name:'Memory leak chaos experiment', steps:'1. Inject gradual memory leak\n2. Monitor OOM killer\n3. Verify pod restart', expected:'Pod restarted by OOM killer, requests drained first', actual:'Blocked - chaos monkey agent not deployed in staging', status:'Blocked', priority:'P1' }
  ],
  results: { total:20, pass:16, fail:3, blocked:1, failedTests:['TC-CH-003: Redis sentinel promotion took 45s (SLA: 15s)', 'TC-CH-006: DR failover took 8 min, exceeded 5-min RTO', 'TC-CH-008: AZ-2 overloaded during AZ-1 failure simulation'], timeline:'Executed: 2026-02-27 22:00 - 2026-02-28 02:00 IST (maintenance window)' }
};

/* ==================== CLOUD NATIVE ==================== */
const cloudNativeData = {
  testData: [
    { id:'TD-CN-001', resource:'EKS Cluster', region:'ap-south-1', vpc:'vpc-0a1b2c3d', sg:'sg-banking-prod', iam:'eks-node-role', scaling:'HPA: 3-12 pods', cost:'$2.45/hr', compliance:'SOC2 Compliant' },
    { id:'TD-CN-002', resource:'RDS PostgreSQL', region:'ap-south-1', vpc:'vpc-0a1b2c3d', sg:'sg-database-prod', iam:'rds-access-role', scaling:'Multi-AZ Failover', cost:'$1.85/hr', compliance:'PCI-DSS Compliant' },
    { id:'TD-CN-003', resource:'Lambda Function', region:'ap-south-1', vpc:'vpc-0a1b2c3d', sg:'sg-lambda-prod', iam:'lambda-exec-role', scaling:'1000 concurrent', cost:'$0.012/invoke', compliance:'SOC2 Compliant' },
    { id:'TD-CN-004', resource:'S3 Bucket', region:'ap-south-1', vpc:'N/A', sg:'N/A', iam:'s3-access-role', scaling:'Unlimited', cost:'$0.023/GB', compliance:'SSE-KMS Encrypted' },
    { id:'TD-CN-005', resource:'ElastiCache Redis', region:'ap-south-1', vpc:'vpc-0a1b2c3d', sg:'sg-cache-prod', iam:'cache-access-role', scaling:'3-node cluster', cost:'$0.90/hr', compliance:'Encryption at Rest' },
    { id:'TD-CN-006', resource:'ALB', region:'ap-south-1', vpc:'vpc-0a1b2c3d', sg:'sg-alb-prod', iam:'N/A', scaling:'Auto', cost:'$0.35/hr', compliance:'WAF Enabled' },
    { id:'TD-CN-007', resource:'CloudWatch', region:'ap-south-1', vpc:'N/A', sg:'N/A', iam:'monitoring-role', scaling:'N/A', cost:'$0.30/metric', compliance:'Log Encryption' },
    { id:'TD-CN-008', resource:'Secrets Manager', region:'ap-south-1', vpc:'N/A', sg:'N/A', iam:'secrets-read-role', scaling:'N/A', cost:'$0.40/secret', compliance:'KMS Managed' }
  ],
  scenarios: [
    { id:'TS-CN-001', scenario:'EKS HPA auto-scaling under load (CPU > 70%)', category:'Scaling', priority:'P0', status:'Pass', time:'120.0s' },
    { id:'TS-CN-002', scenario:'Multi-AZ RDS failover with zero data loss', category:'HA', priority:'P0', status:'Pass', time:'180.0s' },
    { id:'TS-CN-003', scenario:'Lambda cold start latency for payment webhook', category:'Serverless', priority:'P1', status:'Pass', time:'8.2s' },
    { id:'TS-CN-004', scenario:'S3 bucket policy - block public access verification', category:'Security', priority:'P0', status:'Pass', time:'2.1s' },
    { id:'TS-CN-005', scenario:'Terraform plan drift detection', category:'IaC', priority:'P0', status:'Pass', time:'45.3s' },
    { id:'TS-CN-006', scenario:'EKS pod security policy enforcement', category:'Security', priority:'P0', status:'Pass', time:'5.7s' },
    { id:'TS-CN-007', scenario:'Cross-region S3 replication for DR', category:'DR', priority:'P0', status:'Pass', time:'30.4s' },
    { id:'TS-CN-008', scenario:'IAM role least-privilege validation', category:'Security', priority:'P0', status:'Fail', time:'12.8s' },
    { id:'TS-CN-009', scenario:'CloudWatch alarm for error rate spike', category:'Monitoring', priority:'P1', status:'Pass', time:'3.5s' },
    { id:'TS-CN-010', scenario:'Secrets Manager rotation for DB credentials', category:'Security', priority:'P0', status:'Blocked', time:'N/A' }
  ],
  cases: [
    { id:'TC-CN-001', name:'EKS horizontal pod autoscaler test', steps:'1. Generate load to 80% CPU\n2. Monitor HPA scaling\n3. Verify new pods ready\n4. Check request distribution', expected:'Scale from 3 to 8 pods within 2 min', actual:'Scaled to 8 pods in 105 seconds', status:'Pass', priority:'P0' },
    { id:'TC-CN-002', name:'RDS Multi-AZ automatic failover', steps:'1. Simulate primary AZ failure\n2. Monitor failover process\n3. Verify app reconnection', expected:'Failover within 60s, zero data loss', actual:'Failover in 48s, zero data loss', status:'Pass', priority:'P0' },
    { id:'TC-CN-003', name:'Lambda cold start optimization', steps:'1. Deploy with provisioned concurrency\n2. Measure cold start\n3. Compare warm start', expected:'Cold start < 3s for payment webhook', actual:'Cold start at 2.1s with provisioned concurrency', status:'Pass', priority:'P1' },
    { id:'TC-CN-004', name:'Terraform drift detection and remediation', steps:'1. Manually change SG rule\n2. Run terraform plan\n3. Detect drift\n4. Apply remediation', expected:'Drift detected and flagged for review', actual:'Drift detected on sg-banking-prod rule', status:'Pass', priority:'P0' },
    { id:'TC-CN-005', name:'S3 encryption verification (SSE-KMS)', steps:'1. Upload file to S3\n2. Verify SSE-KMS header\n3. Check KMS key policy', expected:'All objects encrypted with customer-managed KMS key', actual:'SSE-KMS encryption verified', status:'Pass', priority:'P0' },
    { id:'TC-CN-006', name:'IAM least-privilege policy audit', steps:'1. Run IAM Access Analyzer\n2. Check unused permissions\n3. Flag over-privileged roles', expected:'Zero roles with wildcard (*) actions', actual:'lambda-exec-role has s3:* - over-privileged', status:'Fail', priority:'P0' },
    { id:'TC-CN-007', name:'EKS pod security policy - no root containers', steps:'1. Deploy pod with root user\n2. Verify rejection\n3. Deploy with non-root', expected:'Root container rejected by PSP/OPA', actual:'Root pod rejected correctly', status:'Pass', priority:'P0' },
    { id:'TC-CN-008', name:'Cross-region S3 replication test', steps:'1. Upload to ap-south-1\n2. Check ap-south-2 replica\n3. Measure replication lag', expected:'Replication within 15 minutes', actual:'Replicated in 8 minutes', status:'Pass', priority:'P0' },
    { id:'TC-CN-009', name:'CloudWatch composite alarm validation', steps:'1. Trigger error rate spike\n2. Verify alarm state change\n3. Check SNS notification', expected:'Alarm triggers within 1 evaluation period', actual:'Alarm triggered, SNS delivered in 45s', status:'Pass', priority:'P1' },
    { id:'TC-CN-010', name:'Secrets Manager automatic rotation', steps:'1. Enable rotation Lambda\n2. Trigger rotation\n3. Verify app reconnection', expected:'DB credentials rotated, app reconnects seamlessly', actual:'Blocked - rotation Lambda IAM permission denied', status:'Blocked', priority:'P0' }
  ],
  results: { total:20, pass:18, fail:1, blocked:1, failedTests:['TC-CN-006: lambda-exec-role has s3:* wildcard action - violates least-privilege principle'], timeline:'Executed: 2026-02-28 08:00 - 09:30 IST' }
};

/* ==================== PAYMENT GATEWAY ==================== */
const paymentData = {
  testData: [
    { id:'TD-PG-001', txnId:'TXN-PG-90001', card:'XXXX-XXXX-XXXX-4532', amount:'75,000.00', currency:'INR', method:'Credit Card (Visa)', merchant:'MID-ECOM-001', threeds:'Authenticated', settlement:'Settled' },
    { id:'TD-PG-002', txnId:'TXN-PG-90002', card:'XXXX-XXXX-XXXX-8901', amount:'12,500.00', currency:'INR', method:'Debit Card (RuPay)', merchant:'MID-POS-042', threeds:'N/A', settlement:'Settled' },
    { id:'TD-PG-003', txnId:'TXN-PG-90003', card:'N/A', amount:'5,000.00', currency:'INR', method:'UPI (P2P)', merchant:'N/A', threeds:'N/A', settlement:'Instant' },
    { id:'TD-PG-004', txnId:'TXN-PG-90004', card:'XXXX-XXXX-XXXX-2345', amount:'2,50,000.00', currency:'INR', method:'Net Banking (NEFT)', merchant:'MID-CORP-007', threeds:'N/A', settlement:'T+1' },
    { id:'TD-PG-005', txnId:'TXN-PG-90005', card:'XXXX-XXXX-XXXX-6789', amount:'1,200.00', currency:'USD', method:'Credit Card (Mastercard)', merchant:'MID-INTL-003', threeds:'Authenticated', settlement:'Pending' },
    { id:'TD-PG-006', txnId:'TXN-PG-90006', card:'XXXX-XXXX-XXXX-1111', amount:'45,000.00', currency:'INR', method:'Credit Card (Visa)', merchant:'MID-ECOM-001', threeds:'Failed', settlement:'Declined' },
    { id:'TD-PG-007', txnId:'TXN-PG-90007', card:'N/A', amount:'8,999.00', currency:'INR', method:'UPI (QR Scan)', merchant:'MID-POS-055', threeds:'N/A', settlement:'Instant' },
    { id:'TD-PG-008', txnId:'TXN-PG-90008', card:'XXXX-XXXX-XXXX-4532', amount:'75,000.00', currency:'INR', method:'Credit Card (Visa)', merchant:'MID-ECOM-001', threeds:'Authenticated', settlement:'Refunded' }
  ],
  scenarios: [
    { id:'TS-PG-001', scenario:'Visa credit card authorization with 3DS 2.0', category:'Authorization', priority:'P0', status:'Pass', time:'2.8s' },
    { id:'TS-PG-002', scenario:'UPI P2P instant payment via NPCI switch', category:'UPI', priority:'P0', status:'Pass', time:'1.2s' },
    { id:'TS-PG-003', scenario:'Full refund processing within 5-7 business days', category:'Refund', priority:'P0', status:'Pass', time:'3.5s' },
    { id:'TS-PG-004', scenario:'Chargeback dispute lifecycle management', category:'Dispute', priority:'P1', status:'Pass', time:'5.1s' },
    { id:'TS-PG-005', scenario:'PCI-DSS tokenization of card data', category:'Security', priority:'P0', status:'Pass', time:'0.8s' },
    { id:'TS-PG-006', scenario:'HSM key rotation for encryption keys', category:'Security', priority:'P0', status:'Pass', time:'12.3s' },
    { id:'TS-PG-007', scenario:'Multi-currency transaction with FX conversion', category:'FX', priority:'P1', status:'Pass', time:'2.1s' },
    { id:'TS-PG-008', scenario:'Payment gateway failover to standby processor', category:'HA', priority:'P0', status:'Pass', time:'8.7s' },
    { id:'TS-PG-009', scenario:'EMI conversion on credit card transaction', category:'EMI', priority:'P1', status:'Pass', time:'3.2s' },
    { id:'TS-PG-010', scenario:'RBI e-mandate for recurring payments (SI)', category:'Mandate', priority:'P0', status:'Fail', time:'6.4s' }
  ],
  cases: [
    { id:'TC-PG-001', name:'PCI-DSS Requirement 3 - tokenization validation', steps:'1. Submit card number\n2. Verify token generation\n3. Validate token format\n4. Test detokenization', expected:'Card number tokenized, original PAN not stored', actual:'Tokenization verified, no PAN in logs/DB', status:'Pass', priority:'P0' },
    { id:'TC-PG-002', name:'3DS 2.0 authentication flow', steps:'1. Initiate card payment\n2. Redirect to 3DS\n3. Complete authentication\n4. Verify auth result', expected:'3DS authentication successful with CAVV', actual:'CAVV received, liability shift confirmed', status:'Pass', priority:'P0' },
    { id:'TC-PG-003', name:'UPI P2P transfer via VPA', steps:'1. Enter payee VPA\n2. Validate VPA\n3. Submit payment\n4. Verify NPCI callback', expected:'Payment processed via NPCI in <5 seconds', actual:'Completed in 1.8 seconds', status:'Pass', priority:'P0' },
    { id:'TC-PG-004', name:'HSM key rotation for payment encryption', steps:'1. Generate new KEK\n2. Re-encrypt all PINs\n3. Verify decrypt with new key\n4. Decommission old key', expected:'Key rotation with zero transaction failures', actual:'Rotation completed, zero failures', status:'Pass', priority:'P0' },
    { id:'TC-PG-005', name:'Refund processing and reversal', steps:'1. Initiate full refund\n2. Verify acquirer reversal\n3. Check customer credit\n4. Validate settlement', expected:'Refund reflected in customer account within 5-7 days', actual:'Refund processed in 3 business days', status:'Pass', priority:'P0' },
    { id:'TC-PG-006', name:'Chargeback dispute with evidence upload', steps:'1. Receive chargeback notification\n2. Upload merchant evidence\n3. Submit representment\n4. Track resolution', expected:'Dispute resolved within 45-day window', actual:'Representment submitted, awaiting resolution', status:'Pass', priority:'P1' },
    { id:'TC-PG-007', name:'Multi-currency FX rate application', steps:'1. Submit USD payment\n2. Apply real-time FX rate\n3. Convert to INR\n4. Verify markup', expected:'FX rate from approved feed, markup < 3.5%', actual:'FX applied correctly, markup at 2.8%', status:'Pass', priority:'P1' },
    { id:'TC-PG-008', name:'Payment gateway failover test', steps:'1. Simulate primary processor down\n2. Verify automatic failover\n3. Check transaction continuity', expected:'Failover to standby within 30 seconds', actual:'Failover in 22 seconds, zero drops', status:'Pass', priority:'P0' },
    { id:'TC-PG-009', name:'EMI conversion on credit card', steps:'1. Complete card payment\n2. Convert to 6-month EMI\n3. Verify EMI schedule\n4. Check interest calculation', expected:'EMI schedule generated with correct interest', actual:'EMI conversion successful', status:'Pass', priority:'P1' },
    { id:'TC-PG-010', name:'RBI e-mandate registration for recurring payment', steps:'1. Submit mandate request\n2. Authenticate via issuer\n3. Register with NPCI\n4. Verify first debit', expected:'Mandate registered, first debit successful', actual:'NPCI mandate registration timeout after 30s', status:'Fail', priority:'P0' }
  ],
  results: { total:20, pass:19, fail:1, blocked:0, failedTests:['TC-PG-010: NPCI e-mandate registration timeout - NPCI gateway responded with 504 after 30s'], timeline:'Executed: 2026-02-28 14:00 - 14:45 IST' }
};

/* ==================== MAINFRAME BANKING ==================== */
const mainframeData = {
  testData: [
    { id:'TD-MF-001', job:'EODBTCH01', program:'CBSMAIN01', cics:'CICSPROD1', db2:'DBPLAN01', inputCopy:'ACCT-IN-REC', outputCopy:'ACCT-OUT-REC', abend:'N/A', rc:'0000' },
    { id:'TD-MF-002', job:'LOANPROC', program:'LNPRC001', cics:'CICSPROD2', db2:'DBPLAN02', inputCopy:'LOAN-APP-REC', outputCopy:'LOAN-RSP-REC', abend:'N/A', rc:'0000' },
    { id:'TD-MF-003', job:'NEFTBATCH', program:'NEFT0001', cics:'N/A', db2:'DBPLAN03', inputCopy:'NEFT-IN-REC', outputCopy:'NEFT-OUT-REC', abend:'S0C7', rc:'4088' },
    { id:'TD-MF-004', job:'STMT_GEN', program:'STMTGEN1', cics:'N/A', db2:'DBPLAN04', inputCopy:'STMT-IN-REC', outputCopy:'STMT-PDF-REC', abend:'N/A', rc:'0000' },
    { id:'TD-MF-005', job:'INTCALC', program:'INTCAL01', cics:'CICSPROD1', db2:'DBPLAN05', inputCopy:'INT-RATE-REC', outputCopy:'INT-OUT-REC', abend:'N/A', rc:'0004' },
    { id:'TD-MF-006', job:'CHQCLR', program:'CHQCLR01', cics:'N/A', db2:'DBPLAN06', inputCopy:'CHQ-IN-REC', outputCopy:'CHQ-RSP-REC', abend:'N/A', rc:'0000' },
    { id:'TD-MF-007', job:'AMLBATCH', program:'AMLSCN01', cics:'N/A', db2:'DBPLAN07', inputCopy:'AML-TXN-REC', outputCopy:'AML-ALT-REC', abend:'N/A', rc:'0000' },
    { id:'TD-MF-008', job:'GLPOST', program:'GLPOST01', cics:'CICSPROD1', db2:'DBPLAN08', inputCopy:'GL-ENT-REC', outputCopy:'GL-POST-REC', abend:'S322', rc:'4092' }
  ],
  scenarios: [
    { id:'TS-MF-001', scenario:'COBOL EOD batch job completion within SLA window', category:'Batch', priority:'P0', status:'Pass', time:'45min' },
    { id:'TS-MF-002', scenario:'CICS online transaction response under 2 seconds', category:'Online', priority:'P0', status:'Pass', time:'0.8s' },
    { id:'TS-MF-003', scenario:'DB2 deadlock detection and resolution', category:'DB2', priority:'P0', status:'Pass', time:'5.2s' },
    { id:'TS-MF-004', scenario:'JCL step conditional execution (COND code)', category:'JCL', priority:'P1', status:'Pass', time:'12.3s' },
    { id:'TS-MF-005', scenario:'VSAM KSDS file read/write with alternate index', category:'VSAM', priority:'P1', status:'Pass', time:'3.1s' },
    { id:'TS-MF-006', scenario:'MQ series message bridge to distributed platform', category:'MQ', priority:'P0', status:'Pass', time:'2.4s' },
    { id:'TS-MF-007', scenario:'COBOL-Java interop via CICS Transaction Gateway', category:'Integration', priority:'P1', status:'Fail', time:'8.7s' },
    { id:'TS-MF-008', scenario:'Batch restart/recovery after S0C7 abend', category:'Recovery', priority:'P0', status:'Fail', time:'15.2s' },
    { id:'TS-MF-009', scenario:'DB2 stored procedure call from COBOL', category:'DB2', priority:'P1', status:'Pass', time:'1.9s' },
    { id:'TS-MF-010', scenario:'RACF security profile validation for CICS regions', category:'Security', priority:'P0', status:'Blocked', time:'N/A' }
  ],
  cases: [
    { id:'TC-MF-001', name:'EOD batch JCL execution validation', steps:'1. Submit EODBTCH01 JCL\n2. Monitor job status in SPOOL\n3. Verify RC=0000\n4. Check output datasets', expected:'Job completes with RC=0000 within 2-hour window', actual:'Completed in 1h 45min, RC=0000', status:'Pass', priority:'P0' },
    { id:'TC-MF-002', name:'CICS inquiry transaction response time', steps:'1. Execute INQACCT transaction\n2. Measure response time\n3. Verify account data displayed', expected:'Response within 2 seconds with correct data', actual:'Response in 0.8 seconds', status:'Pass', priority:'P0' },
    { id:'TC-MF-003', name:'DB2 deadlock detection and retry', steps:'1. Simulate concurrent updates\n2. Trigger deadlock\n3. Verify SQLCODE -911\n4. Check automatic retry', expected:'Deadlock detected, automatic retry succeeds', actual:'Retry succeeded after 2nd attempt', status:'Pass', priority:'P0' },
    { id:'TC-MF-004', name:'VSAM KSDS file I/O validation', steps:'1. Write records to KSDS\n2. Read by primary key\n3. Read by alternate index\n4. Verify data integrity', expected:'All reads return correct data', actual:'Data integrity verified', status:'Pass', priority:'P1' },
    { id:'TC-MF-005', name:'MQ bridge message transformation', steps:'1. Put message on MF queue\n2. Verify bridge transformation\n3. Get from distributed queue', expected:'Message format converted correctly (EBCDIC to ASCII)', actual:'Conversion verified', status:'Pass', priority:'P0' },
    { id:'TC-MF-006', name:'COBOL-Java CTG integration test', steps:'1. Invoke COBOL program via CTG\n2. Pass COMMAREA data\n3. Receive response', expected:'Java client receives COMMAREA response', actual:'CTG connection timeout after 30 seconds', status:'Fail', priority:'P1' },
    { id:'TC-MF-007', name:'Batch restart after S0C7 abend', steps:'1. Trigger S0C7 in NEFTBATCH\n2. Fix input data\n3. Restart from checkpoint\n4. Verify completion', expected:'Job restarts from last checkpoint, completes RC=0000', actual:'Checkpoint not set - full restart required, data corruption on 3 records', status:'Fail', priority:'P0' },
    { id:'TC-MF-008', name:'GL posting batch accuracy', steps:'1. Run GLPOST job\n2. Verify debit/credit totals\n3. Check GL balancing', expected:'GL balanced with zero variance', actual:'GL balanced correctly', status:'Pass', priority:'P0' },
    { id:'TC-MF-009', name:'Interest calculation batch validation', steps:'1. Run INTCALC job\n2. Verify interest rates applied\n3. Check rounding rules', expected:'Interest calculated per product master rates', actual:'RC=0004 warning - 2 accounts with zero balance skipped', status:'Pass', priority:'P1' },
    { id:'TC-MF-010', name:'RACF profile validation for CICS regions', steps:'1. Check RACF profiles for CICSPROD1\n2. Verify transaction security\n3. Validate user access matrix', expected:'All transactions secured per access matrix', actual:'Blocked - RACF admin access pending approval', status:'Blocked', priority:'P0' }
  ],
  results: { total:20, pass:17, fail:2, blocked:1, failedTests:['TC-MF-006: CTG connection timeout - CICS Transaction Gateway config mismatch', 'TC-MF-007: S0C7 abend checkpoint not set in NEFTBATCH - 3 records corrupted'], timeline:'Executed: 2026-02-28 03:00 - 05:00 IST (batch window)' }
};

/* ==================== CONCURRENCY TESTING ==================== */
const concurrencyData = {
  testData: [
    { id:'TD-CC-001', thread:'T-001', account:'ACC-2001', operation:'Debit', amount:'50,000.00', lock:'Row-Level', isolation:'READ_COMMITTED', wait:'0ms', outcome:'Committed' },
    { id:'TD-CC-002', thread:'T-002', account:'ACC-2001', operation:'Debit', amount:'50,000.00', lock:'Row-Level', isolation:'READ_COMMITTED', wait:'120ms', outcome:'Committed' },
    { id:'TD-CC-003', thread:'T-003', account:'ACC-2002', operation:'Credit', amount:'1,00,000.00', lock:'Row-Level', isolation:'REPEATABLE_READ', wait:'0ms', outcome:'Committed' },
    { id:'TD-CC-004', thread:'T-004', account:'ACC-2003', operation:'Transfer', amount:'25,000.00', lock:'Table-Level', isolation:'SERIALIZABLE', wait:'250ms', outcome:'Committed' },
    { id:'TD-CC-005', thread:'T-005', account:'ACC-2001', operation:'Balance Check', amount:'N/A', lock:'None (Snapshot)', isolation:'READ_COMMITTED', wait:'0ms', outcome:'Read' },
    { id:'TD-CC-006', thread:'T-006', account:'ACC-2004', operation:'Debit', amount:'75,000.00', lock:'Row-Level', isolation:'READ_COMMITTED', wait:'5000ms', outcome:'Deadlock Victim' },
    { id:'TD-CC-007', thread:'T-007', account:'ACC-2005', operation:'Debit', amount:'30,000.00', lock:'Optimistic', isolation:'READ_COMMITTED', wait:'0ms', outcome:'Version Conflict' },
    { id:'TD-CC-008', thread:'T-008', account:'ACC-2006', operation:'Credit', amount:'10,000.00', lock:'Row-Level', isolation:'READ_COMMITTED', wait:'50ms', outcome:'Committed' }
  ],
  scenarios: [
    { id:'TS-CC-001', scenario:'Race condition on concurrent debit from same account', category:'Race Condition', priority:'P0', status:'Pass', time:'3.2s' },
    { id:'TS-CC-002', scenario:'Deadlock detection between cross-account transfers', category:'Deadlock', priority:'P0', status:'Pass', time:'8.5s' },
    { id:'TS-CC-003', scenario:'Double-spend prevention on simultaneous withdrawals', category:'Double-Spend', priority:'P0', status:'Pass', time:'2.1s' },
    { id:'TS-CC-004', scenario:'Optimistic locking conflict resolution', category:'Locking', priority:'P0', status:'Pass', time:'1.5s' },
    { id:'TS-CC-005', scenario:'Pessimistic lock timeout and retry', category:'Locking', priority:'P1', status:'Pass', time:'6.8s' },
    { id:'TS-CC-006', scenario:'Distributed 2PC (Two-Phase Commit) atomicity', category:'2PC', priority:'P0', status:'Pass', time:'4.3s' },
    { id:'TS-CC-007', scenario:'100 concurrent transfers on single account', category:'Stress', priority:'P0', status:'Pass', time:'15.2s' },
    { id:'TS-CC-008', scenario:'Read-write conflict under SERIALIZABLE isolation', category:'Isolation', priority:'P1', status:'Fail', time:'3.7s' },
    { id:'TS-CC-009', scenario:'Connection pool exhaustion under high concurrency', category:'Resource', priority:'P0', status:'Pass', time:'22.1s' },
    { id:'TS-CC-010', scenario:'Phantom read prevention in balance inquiry', category:'Isolation', priority:'P1', status:'Blocked', time:'N/A' }
  ],
  cases: [
    { id:'TC-CC-001', name:'Concurrent debit - balance integrity', steps:'1. Set balance to 1,00,000\n2. Launch 2 threads debiting 60,000 each\n3. Verify only one succeeds\n4. Check final balance', expected:'One debit succeeds, one rejected (insufficient funds)', actual:'First debit committed, second rejected correctly', status:'Pass', priority:'P0' },
    { id:'TC-CC-002', name:'Deadlock detection and victim selection', steps:'1. Thread A locks ACC-001, waits for ACC-002\n2. Thread B locks ACC-002, waits for ACC-001\n3. Verify deadlock detected\n4. One thread selected as victim', expected:'Deadlock detected within 5s, victim retried', actual:'Deadlock detected in 3.2s, T-006 chosen as victim', status:'Pass', priority:'P0' },
    { id:'TC-CC-003', name:'Double-spend prevention test', steps:'1. Balance = 1,00,000\n2. Submit 2 payments of 80,000 simultaneously\n3. Verify total debit does not exceed balance', expected:'Only one payment processed', actual:'Second payment rejected with insufficient funds', status:'Pass', priority:'P0' },
    { id:'TC-CC-004', name:'Optimistic lock version conflict', steps:'1. Read account with version=5\n2. Both threads modify\n3. First commit (version=6)\n4. Second gets conflict', expected:'Second thread gets OptimisticLockException', actual:'Version conflict detected, retry succeeded', status:'Pass', priority:'P0' },
    { id:'TC-CC-005', name:'2PC atomicity across two databases', steps:'1. Prepare phase on DB-1 and DB-2\n2. Both vote COMMIT\n3. Coordinator sends COMMIT\n4. Verify both committed', expected:'Both DBs committed atomically', actual:'2PC completed, both DBs consistent', status:'Pass', priority:'P0' },
    { id:'TC-CC-006', name:'100 concurrent transfers stress test', steps:'1. Initialize 50 accounts with 1L each\n2. Launch 100 concurrent random transfers\n3. Verify total money conserved\n4. Check for anomalies', expected:'Total balance across all accounts unchanged', actual:'Total conserved: 50,00,000 = 50,00,000', status:'Pass', priority:'P0' },
    { id:'TC-CC-007', name:'Connection pool exhaustion handling', steps:'1. Set pool size to 20\n2. Launch 50 concurrent queries\n3. Monitor wait queue\n4. Verify graceful queuing', expected:'Excess requests queued, no connection leak', actual:'30 requests queued, served within 5s', status:'Pass', priority:'P0' },
    { id:'TC-CC-008', name:'SERIALIZABLE isolation anomaly test', steps:'1. Set isolation to SERIALIZABLE\n2. Run concurrent read-write\n3. Check for serialization failure\n4. Verify retry logic', expected:'Serialization failure detected and retried', actual:'Retry logic not triggered - silent data inconsistency', status:'Fail', priority:'P1' },
    { id:'TC-CC-009', name:'Pessimistic lock timeout test', steps:'1. Thread A acquires row lock\n2. Thread B waits for lock\n3. Wait exceeds timeout (5s)\n4. Verify timeout exception', expected:'LockTimeoutException after 5 seconds', actual:'Timeout exception raised, transaction rolled back', status:'Pass', priority:'P1' },
    { id:'TC-CC-010', name:'Phantom read under REPEATABLE_READ', steps:'1. Thread A reads account list\n2. Thread B inserts new account\n3. Thread A reads again\n4. Check for phantom', expected:'No phantom rows in REPEATABLE_READ', actual:'Blocked - test environment lacks REPEATABLE_READ support', status:'Blocked', priority:'P1' }
  ],
  results: { total:20, pass:18, fail:1, blocked:1, failedTests:['TC-CC-008: SERIALIZABLE isolation retry logic not triggered - silent data inconsistency on concurrent read-write'], timeline:'Executed: 2026-02-28 15:00 - 16:00 IST' }
};

/* ==================== ALL TOPIC DATA MAP ==================== */
const ALL_DATA = {
  compliance: complianceData,
  contract: contractData,
  datapipeline: dataPipelineData,
  messagequeue: messageQueueData,
  microservices: microservicesData,
  chaos: chaosData,
  cloudnative: cloudNativeData,
  payment: paymentData,
  mainframe: mainframeData,
  concurrency: concurrencyData
};

/* ==================== COLUMN DEFINITIONS ==================== */
const DATA_COLUMNS = {
  compliance: ['DataID','CustomerID','KYCType','AadhaarNo','PANNo','RiskCategory','DocStatus','ExpectedResult'],
  contract: ['DataID','Consumer','Provider','Version','Endpoint','Method','RequestSchema','ResponseSchema','Status'],
  datapipeline: ['DataID','PipelineID','Source','Target','Records','TransformRule','Quality','LoadStatus','Variance'],
  messagequeue: ['DataID','Queue','MessageID','Producer','Consumer','Payload','Delivery','Retry','Status'],
  microservices: ['DataID','Service','Endpoint','Method','RequestPayload','ResCode','Circuit','Latency','TraceID'],
  chaos: ['DataID','Experiment','Target','FaultType','Duration','Impact','Recovery','Metric','Result'],
  cloudnative: ['DataID','Resource','Region','VPC','SecurityGroup','IAMRole','Scaling','Cost','Compliance'],
  payment: ['DataID','TxnID','Card','Amount','Currency','Method','Merchant','3DS','Settlement'],
  mainframe: ['DataID','Job','Program','CICS','DB2Plan','InputCopy','OutputCopy','Abend','RC'],
  concurrency: ['DataID','Thread','Account','Operation','Amount','Lock','Isolation','Wait','Outcome']
};

const DATA_KEYS = {
  compliance: (r) => [r.id, r.custId, r.kycType, r.aadhaar, r.pan, r.risk, r.docStatus, r.expected],
  contract: (r) => [r.id, r.consumer, r.provider, r.version, r.endpoint, r.method, r.reqSchema, r.resSchema, r.status],
  datapipeline: (r) => [r.id, r.pipeline, r.source, r.target, r.records, r.rule, r.quality, r.loadStatus, r.variance],
  messagequeue: (r) => [r.id, r.queue, r.msgId, r.producer, r.consumer, r.payload, r.delivery, r.retry, r.status],
  microservices: (r) => [r.id, r.service, r.endpoint, r.method, r.reqPayload, r.resCode, r.circuit, r.latency, r.traceId],
  chaos: (r) => [r.id, r.experiment, r.target, r.fault, r.duration, r.impact, r.recovery, r.metric, r.result],
  cloudnative: (r) => [r.id, r.resource, r.region, r.vpc, r.sg, r.iam, r.scaling, r.cost, r.compliance],
  payment: (r) => [r.id, r.txnId, r.card, r.amount, r.currency, r.method, r.merchant, r.threeds, r.settlement],
  mainframe: (r) => [r.id, r.job, r.program, r.cics, r.db2, r.inputCopy, r.outputCopy, r.abend, r.rc],
  concurrency: (r) => [r.id, r.thread, r.account, r.operation, r.amount, r.lock, r.isolation, r.wait, r.outcome]
};

/* ==================== COMPONENT ==================== */
export default function ArchTestDataHub() {
  const [activeTopic, setActiveTopic] = useState('compliance');
  const [activeSubTab, setActiveSubTab] = useState('data');

  const tableStyle = { width:'100%', borderCollapse:'collapse', fontSize:13 };
  const thStyle = { background:C.card, color:C.accent, padding:'10px 8px', textAlign:'left', borderBottom:`2px solid ${C.accent}`, fontWeight:700, fontSize:12, whiteSpace:'nowrap' };
  const tdStyle = { padding:'8px', borderBottom:`1px solid ${C.border}`, color:C.text, fontSize:12, verticalAlign:'top' };
  const cardStyle = { background:C.card, borderRadius:10, padding:20, border:`1px solid ${C.border}`, marginBottom:16 };
  const sectionTitle = { color:C.accent, fontSize:18, fontWeight:700, marginBottom:12 };

  const statusBadge = (status) => {
    const colors = { Pass:C.success, Fail:C.danger, Blocked:C.warn, 'In Progress':C.info, Active:C.success, Deprecated:C.warn, Delivered:C.success, 'Dead Letter':C.danger, Redelivered:C.warn, Completed:C.success, Failed:C.danger, Settled:C.success, Pending:C.info, Declined:C.danger, Refunded:C.warn, Instant:C.accent, 'T+1':C.info, Committed:C.success, 'Deadlock Victim':C.danger, 'Version Conflict':C.warn, Read:C.info, CLOSED:C.success, OPEN:C.danger, HALF_OPEN:C.warn };
    const color = colors[status] || C.muted;
    return <span style={{ background:color, color:'#fff', padding:'2px 10px', borderRadius:12, fontSize:11, fontWeight:600 }}>{status}</span>;
  };

  const priorityBadge = (p) => {
    const colors = { P0:C.danger, P1:C.warn, P2:C.info };
    return <span style={{ background:colors[p]||C.muted, color:'#fff', padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>{p}</span>;
  };

  const progressBar = (pct, color) => (
    <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:8, height:20, width:'100%', overflow:'hidden' }}>
      <div style={{ background:color, height:'100%', width:`${pct}%`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', transition:'width 0.5s ease' }}>{pct}%</div>
    </div>
  );

  const data = ALL_DATA[activeTopic];
  const columns = DATA_COLUMNS[activeTopic];
  const getValues = DATA_KEYS[activeTopic];

  /* ---- Render Test Data Table ---- */
  const renderTestData = () => (
    <div>
      <h3 style={sectionTitle}>Test Data - {TOPICS.find(t=>t.key===activeTopic).label}</h3>

      {/* Data Summary Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12, marginBottom:20 }}>
        <div style={{ background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`, textAlign:'center' }}>
          <div style={{ fontSize:24, fontWeight:800, color:C.accent }}>{data.testData.length}</div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Total Records</div>
        </div>
        <div style={{ background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`, textAlign:'center' }}>
          <div style={{ fontSize:24, fontWeight:800, color:C.info }}>{columns.length}</div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Data Fields</div>
        </div>
        <div style={{ background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`, textAlign:'center' }}>
          <div style={{ fontSize:24, fontWeight:800, color:C.success }}>{TOPIC_OVERVIEWS[activeTopic].riskLevel}</div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Risk Level</div>
        </div>
        <div style={{ background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`, textAlign:'center' }}>
          <div style={{ fontSize:24, fontWeight:800, color:C.warn }}>{TOPIC_METRICS[activeTopic].env}</div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Environment</div>
        </div>
      </div>

      {/* Data Description */}
      <div style={{ ...cardStyle, marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:C.header, marginBottom:6 }}>Data Description</div>
        <p style={{ color:C.text, fontSize:12, lineHeight:1.6, margin:0 }}>
          Test data records representing realistic banking domain scenarios for {TOPICS.find(t=>t.key===activeTopic).label} testing.
          Each record contains {columns.length} fields covering unique identifiers, input parameters, expected outcomes, and validation status.
          Data is sourced from UAT environment ({TOPIC_METRICS[activeTopic].env}) and aligned with production data patterns.
        </p>
      </div>

      {/* Data Table */}
      <div style={{ overflowX:'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>{columns.map((col,i) => <th key={i} style={thStyle}>{col}</th>)}</tr>
          </thead>
          <tbody>
            {data.testData.map((row, i) => {
              const vals = getValues(row);
              return (
                <tr key={i} style={{ background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  {vals.map((v, j) => (
                    <td key={j} style={tdStyle}>
                      {(columns[j]==='ExpectedResult' || columns[j]==='Status' || columns[j]==='DocStatus' || columns[j]==='LoadStatus' || columns[j]==='Result' || columns[j]==='Compliance' || columns[j]==='Settlement' || columns[j]==='3DS' || columns[j]==='Outcome' || columns[j]==='Circuit') ? statusBadge(String(v)) : (columns[j]==='RiskCategory' ? <span style={{ color: v==='HIGH'?C.danger:v==='MEDIUM'?C.warn:C.success, fontWeight:600 }}>{v}</span> : String(v))}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Data Quality Notes */}
      <div style={{ ...cardStyle, marginTop:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:C.header, marginBottom:8 }}>Data Quality Notes</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:10 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <span style={{ color:C.success, fontSize:14, fontWeight:700 }}>{'\u2713'}</span>
            <span style={{ color:C.text, fontSize:12 }}>All PII data is masked/tokenized for test environment compliance</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <span style={{ color:C.success, fontSize:14, fontWeight:700 }}>{'\u2713'}</span>
            <span style={{ color:C.text, fontSize:12 }}>Data patterns match production distribution for realistic testing</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <span style={{ color:C.success, fontSize:14, fontWeight:700 }}>{'\u2713'}</span>
            <span style={{ color:C.text, fontSize:12 }}>Positive and negative test data included for boundary validation</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <span style={{ color:C.success, fontSize:14, fontWeight:700 }}>{'\u2713'}</span>
            <span style={{ color:C.text, fontSize:12 }}>Data refreshed weekly from UAT data provisioning pipeline</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <span style={{ color:C.info, fontSize:14, fontWeight:700 }}>{'\u2139'}</span>
            <span style={{ color:C.text, fontSize:12 }}>Edge cases and error scenarios seeded for comprehensive coverage</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <span style={{ color:C.info, fontSize:14, fontWeight:700 }}>{'\u2139'}</span>
            <span style={{ color:C.text, fontSize:12 }}>Test data version controlled in Git repository for traceability</span>
          </div>
        </div>
      </div>
    </div>
  );

  /* ---- Render Test Scenarios Table ---- */
  const renderScenarios = () => {
    const passCount = data.scenarios.filter(s => s.status === 'Pass').length;
    const failCount = data.scenarios.filter(s => s.status === 'Fail').length;
    const blockedCount = data.scenarios.filter(s => s.status === 'Blocked').length;
    const scenarioPassRate = ((passCount / data.scenarios.length) * 100).toFixed(0);

    return (
    <div>
      <h3 style={sectionTitle}>Test Scenarios - {TOPICS.find(t=>t.key===activeTopic).label}</h3>

      {/* Scenario Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:12, marginBottom:20 }}>
        <div style={{ background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`, textAlign:'center' }}>
          <div style={{ fontSize:22, fontWeight:800, color:C.info }}>{data.scenarios.length}</div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Total Scenarios</div>
        </div>
        <div style={{ background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`, textAlign:'center' }}>
          <div style={{ fontSize:22, fontWeight:800, color:C.success }}>{passCount}</div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Passed</div>
        </div>
        <div style={{ background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`, textAlign:'center' }}>
          <div style={{ fontSize:22, fontWeight:800, color:C.danger }}>{failCount}</div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Failed</div>
        </div>
        <div style={{ background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`, textAlign:'center' }}>
          <div style={{ fontSize:22, fontWeight:800, color:C.warn }}>{blockedCount}</div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Blocked</div>
        </div>
        <div style={{ background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`, textAlign:'center' }}>
          <div style={{ fontSize:22, fontWeight:800, color: scenarioPassRate >= 90 ? C.success : C.warn }}>{scenarioPassRate}%</div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Pass Rate</div>
        </div>
      </div>

      <div style={{ overflowX:'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={{...thStyle, minWidth:300}}>Scenario</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Priority</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Exec Time</th>
            </tr>
          </thead>
          <tbody>
            {data.scenarios.map((s, i) => (
              <tr key={i} style={{ background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                <td style={{...tdStyle, fontFamily:'monospace', color:C.accent}}>{s.id}</td>
                <td style={tdStyle}>{s.scenario}</td>
                <td style={tdStyle}><span style={{ background:C.info, color:'#fff', padding:'2px 8px', borderRadius:10, fontSize:11 }}>{s.category}</span></td>
                <td style={tdStyle}>{priorityBadge(s.priority)}</td>
                <td style={tdStyle}>{statusBadge(s.status)}</td>
                <td style={{...tdStyle, fontFamily:'monospace'}}>{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category Distribution */}
      <div style={{ ...cardStyle, marginTop:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:C.header, marginBottom:10 }}>Category Distribution</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {(() => {
            const cats = {};
            data.scenarios.forEach(s => { cats[s.category] = (cats[s.category] || 0) + 1; });
            return Object.entries(cats).map(([cat, count], i) => (
              <span key={i} style={{ background:'rgba(52,152,219,0.15)', color:C.info, padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:`1px solid rgba(52,152,219,0.3)` }}>
                {cat}: {count}
              </span>
            ));
          })()}
        </div>
      </div>
    </div>
  );
  };

  /* ---- Render Test Cases Table ---- */
  const renderCases = () => {
    const casePass = data.cases.filter(tc => tc.status === 'Pass').length;
    const caseFail = data.cases.filter(tc => tc.status === 'Fail').length;
    const caseBlocked = data.cases.filter(tc => tc.status === 'Blocked').length;
    const p0Count = data.cases.filter(tc => tc.priority === 'P0').length;
    const p1Count = data.cases.filter(tc => tc.priority === 'P1').length;
    const p2Count = data.cases.filter(tc => tc.priority === 'P2').length;

    return (
    <div>
      <h3 style={sectionTitle}>Test Cases - {TOPICS.find(t=>t.key===activeTopic).label}</h3>

      {/* Test Case Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px, 1fr))', gap:10, marginBottom:20 }}>
        {[
          { label:'Total Cases', value:data.cases.length, color:C.info },
          { label:'Passed', value:casePass, color:C.success },
          { label:'Failed', value:caseFail, color:C.danger },
          { label:'Blocked', value:caseBlocked, color:C.warn },
          { label:'P0 (Critical)', value:p0Count, color:C.danger },
          { label:'P1 (High)', value:p1Count, color:C.warn },
          { label:'P2 (Medium)', value:p2Count, color:C.info }
        ].filter(item => item.value > 0).map((item, i) => (
          <div key={i} style={{ background:C.card, borderRadius:10, padding:12, border:`1px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:800, color:item.color }}>{item.value}</div>
            <div style={{ fontSize:10, color:C.muted, fontWeight:600 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ overflowX:'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={{...thStyle, minWidth:200}}>Test Case</th>
              <th style={{...thStyle, minWidth:220}}>Steps</th>
              <th style={{...thStyle, minWidth:180}}>Expected Result</th>
              <th style={{...thStyle, minWidth:180}}>Actual Result</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {data.cases.map((tc, i) => (
              <tr key={i} style={{ background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                <td style={{...tdStyle, fontFamily:'monospace', color:C.accent, whiteSpace:'nowrap'}}>{tc.id}</td>
                <td style={{...tdStyle, fontWeight:600}}>{tc.name}</td>
                <td style={{...tdStyle, whiteSpace:'pre-line', fontSize:11, fontFamily:'monospace'}}>{tc.steps}</td>
                <td style={tdStyle}>{tc.expected}</td>
                <td style={{...tdStyle, color: tc.status==='Pass'?C.success:tc.status==='Fail'?C.danger:C.warn}}>{tc.actual}</td>
                <td style={tdStyle}>{statusBadge(tc.status)}</td>
                <td style={tdStyle}>{priorityBadge(tc.priority)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Test Case Traceability */}
      <div style={{ ...cardStyle, marginTop:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:C.header, marginBottom:10 }}>Traceability Matrix Summary</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:10 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <span style={{ color:C.accent, fontSize:14, fontWeight:700 }}>{'\u2022'}</span>
            <span style={{ color:C.text, fontSize:12 }}>{data.cases.length} test cases mapped to {data.scenarios.length} scenarios</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <span style={{ color:C.accent, fontSize:14, fontWeight:700 }}>{'\u2022'}</span>
            <span style={{ color:C.text, fontSize:12 }}>{p0Count} critical (P0) test cases requiring immediate attention on failure</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <span style={{ color:C.accent, fontSize:14, fontWeight:700 }}>{'\u2022'}</span>
            <span style={{ color:C.text, fontSize:12 }}>Each test case includes 3-4 detailed execution steps</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <span style={{ color:C.accent, fontSize:14, fontWeight:700 }}>{'\u2022'}</span>
            <span style={{ color:C.text, fontSize:12 }}>Expected vs Actual results documented for audit compliance</span>
          </div>
        </div>
      </div>
    </div>
  );
  };

  /* ---- Render Topic Overview ---- */
  const renderOverview = () => {
    const overview = TOPIC_OVERVIEWS[activeTopic];
    const metrics = TOPIC_METRICS[activeTopic];
    const r = data.results;
    const passRate = ((r.pass / r.total) * 100).toFixed(0);
    const riskColors = { CRITICAL:C.danger, HIGH:C.warn, MEDIUM:C.info, LOW:C.success };

    return (
      <div>
        <h3 style={sectionTitle}>{overview.title}</h3>
        <p style={{ color:C.text, fontSize:14, lineHeight:1.7, marginBottom:20 }}>{overview.description}</p>

        {/* Risk Level & Coverage */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:20 }}>
          <div style={{ background:C.card, borderRadius:10, padding:16, border:`1px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginBottom:4 }}>Risk Level</div>
            <div style={{ fontSize:18, fontWeight:800, color:riskColors[overview.riskLevel] || C.muted }}>{overview.riskLevel}</div>
          </div>
          <div style={{ background:C.card, borderRadius:10, padding:16, border:`1px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginBottom:4 }}>Test Coverage</div>
            <div style={{ fontSize:18, fontWeight:800, color:overview.coverage >= 90 ? C.success : overview.coverage >= 80 ? C.warn : C.danger }}>{overview.coverage}%</div>
          </div>
          <div style={{ background:C.card, borderRadius:10, padding:16, border:`1px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginBottom:4 }}>Pass Rate</div>
            <div style={{ fontSize:18, fontWeight:800, color:passRate >= 90 ? C.success : passRate >= 75 ? C.warn : C.danger }}>{passRate}%</div>
          </div>
          <div style={{ background:C.card, borderRadius:10, padding:16, border:`1px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginBottom:4 }}>Avg Exec Time</div>
            <div style={{ fontSize:18, fontWeight:800, color:C.accent }}>{metrics.avgExecTime}</div>
          </div>
          <div style={{ background:C.card, borderRadius:10, padding:16, border:`1px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginBottom:4 }}>Environment</div>
            <div style={{ fontSize:14, fontWeight:700, color:C.info }}>{metrics.env}</div>
          </div>
          <div style={{ background:C.card, borderRadius:10, padding:16, border:`1px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginBottom:4 }}>Version</div>
            <div style={{ fontSize:14, fontWeight:700, color:C.accent, fontFamily:'monospace' }}>{metrics.version}</div>
          </div>
        </div>

        {/* Key Testing Areas */}
        <div style={cardStyle}>
          <div style={{ fontSize:15, fontWeight:700, color:C.header, marginBottom:12 }}>Key Testing Areas</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:8 }}>
            {overview.keyAreas.map((area, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0' }}>
                <span style={{ color:C.accent, fontSize:16, fontWeight:700 }}>{'\u2022'}</span>
                <span style={{ color:C.text, fontSize:13 }}>{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Applicable Regulations */}
        <div style={cardStyle}>
          <div style={{ fontSize:15, fontWeight:700, color:C.header, marginBottom:12 }}>Applicable Regulations & Standards</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {overview.regulations.map((reg, i) => (
              <span key={i} style={{ background:'rgba(78,204,163,0.15)', color:C.accent, padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:`1px solid ${C.border}` }}>{reg}</span>
            ))}
          </div>
        </div>

        {/* Testing Tools */}
        <div style={cardStyle}>
          <div style={{ fontSize:15, fontWeight:700, color:C.header, marginBottom:12 }}>Testing Tools & Frameworks</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {overview.tools.map((tool, i) => (
              <span key={i} style={{ background:'rgba(52,152,219,0.15)', color:C.info, padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:`1px solid rgba(52,152,219,0.3)` }}>{tool}</span>
            ))}
          </div>
        </div>

        {/* Execution Metrics */}
        <div style={cardStyle}>
          <div style={{ fontSize:15, fontWeight:700, color:C.header, marginBottom:12 }}>Execution Metrics</div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Metric</th>
                <th style={thStyle}>Value</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Test Data Records', metrics.testDataCount],
                ['Test Scenarios', metrics.scenarioCount],
                ['Test Cases', metrics.caseCount],
                ['Total Executions', r.total],
                ['Passed', r.pass],
                ['Failed', r.fail],
                ['Blocked', r.blocked],
                ['Pass Rate', `${passRate}%`],
                ['Average Execution Time', metrics.avgExecTime],
                ['Last Run', metrics.lastRun],
                ['Environment', metrics.env],
                ['Suite Version', metrics.version]
              ].map(([metric, value], i) => (
                <tr key={i} style={{ background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{...tdStyle, fontWeight:600}}>{metric}</td>
                  <td style={{...tdStyle, fontFamily:'monospace', color:C.accent}}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Coverage Progress */}
        <div style={cardStyle}>
          <div style={{ fontSize:15, fontWeight:700, color:C.header, marginBottom:12 }}>Test Coverage</div>
          {progressBar(overview.coverage, overview.coverage >= 90 ? C.success : overview.coverage >= 80 ? C.warn : C.danger)}
        </div>

        {/* Cross-Topic Comparison Table */}
        <div style={cardStyle}>
          <div style={{ fontSize:15, fontWeight:700, color:C.header, marginBottom:12 }}>All Topics - Comparison Dashboard</div>
          <div style={{ overflowX:'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Topic</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Pass</th>
                  <th style={thStyle}>Fail</th>
                  <th style={thStyle}>Blocked</th>
                  <th style={thStyle}>Pass Rate</th>
                  <th style={thStyle}>Risk</th>
                  <th style={thStyle}>Coverage</th>
                  <th style={thStyle}>Last Run</th>
                </tr>
              </thead>
              <tbody>
                {TOPICS.map((topic, i) => {
                  const topicData = ALL_DATA[topic.key];
                  const topicOverview = TOPIC_OVERVIEWS[topic.key];
                  const topicMetrics = TOPIC_METRICS[topic.key];
                  const topicPassRate = ((topicData.results.pass / topicData.results.total) * 100).toFixed(0);
                  return (
                    <tr key={i} style={{ background: topic.key === activeTopic ? 'rgba(78,204,163,0.08)' : (i%2===0 ? 'transparent' : 'rgba(255,255,255,0.02)') }}>
                      <td style={{...tdStyle, fontWeight:700, color: topic.key === activeTopic ? C.accent : C.text}}>{topic.label}</td>
                      <td style={{...tdStyle, textAlign:'center'}}>{topicData.results.total}</td>
                      <td style={{...tdStyle, textAlign:'center', color:C.success, fontWeight:600}}>{topicData.results.pass}</td>
                      <td style={{...tdStyle, textAlign:'center', color: topicData.results.fail > 0 ? C.danger : C.text, fontWeight:600}}>{topicData.results.fail}</td>
                      <td style={{...tdStyle, textAlign:'center', color: topicData.results.blocked > 0 ? C.warn : C.text, fontWeight:600}}>{topicData.results.blocked}</td>
                      <td style={{...tdStyle, textAlign:'center'}}>
                        <span style={{ color: topicPassRate >= 90 ? C.success : topicPassRate >= 75 ? C.warn : C.danger, fontWeight:700 }}>{topicPassRate}%</span>
                      </td>
                      <td style={{...tdStyle, textAlign:'center'}}>
                        <span style={{ background: riskColors[topicOverview.riskLevel], color:'#fff', padding:'2px 10px', borderRadius:12, fontSize:11, fontWeight:600 }}>{topicOverview.riskLevel}</span>
                      </td>
                      <td style={{...tdStyle, textAlign:'center'}}>
                        <span style={{ color: topicOverview.coverage >= 90 ? C.success : topicOverview.coverage >= 80 ? C.warn : C.danger, fontWeight:600 }}>{topicOverview.coverage}%</span>
                      </td>
                      <td style={{...tdStyle, fontSize:11, fontFamily:'monospace'}}>{topicMetrics.lastRun}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Failed Tests Across Topics */}
        <div style={{...cardStyle, borderColor:C.danger}}>
          <div style={{ fontSize:15, fontWeight:700, color:C.danger, marginBottom:12 }}>All Failed Tests Across Topics</div>
          {TOPICS.map((topic, ti) => {
            const topicResults = ALL_DATA[topic.key].results;
            if (topicResults.fail === 0) return null;
            return (
              <div key={ti} style={{ marginBottom:12 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.warn, marginBottom:6 }}>{topic.label} ({topicResults.fail} failure{topicResults.fail > 1 ? 's' : ''})</div>
                {topicResults.failedTests.map((ft, fi) => (
                  <div key={fi} style={{ background:'rgba(231,76,60,0.08)', padding:10, borderRadius:6, marginBottom:6, borderLeft:`3px solid ${C.danger}` }}>
                    <span style={{ color:C.danger, fontSize:12, fontFamily:'monospace' }}>{ft}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* All Blocked Tests */}
        <div style={{...cardStyle, borderColor:C.warn}}>
          <div style={{ fontSize:15, fontWeight:700, color:C.warn, marginBottom:12 }}>Blocked Tests Summary</div>
          {TOPICS.map((topic, ti) => {
            const topicCases = ALL_DATA[topic.key].cases;
            const blockedCases = topicCases.filter(tc => tc.status === 'Blocked');
            if (blockedCases.length === 0) return null;
            return (
              <div key={ti} style={{ marginBottom:12 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.info, marginBottom:6 }}>{topic.label}</div>
                {blockedCases.map((bc, bi) => (
                  <div key={bi} style={{ background:'rgba(243,156,18,0.08)', padding:10, borderRadius:6, marginBottom:6, borderLeft:`3px solid ${C.warn}` }}>
                    <span style={{ color:C.warn, fontSize:12 }}><strong>{bc.id}</strong>: {bc.name} - {bc.actual}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ---- Render Test Results Summary ---- */
  const renderResults = () => {
    const r = data.results;
    const passRate = ((r.pass / r.total) * 100).toFixed(0);
    return (
      <div>
        <h3 style={sectionTitle}>Test Results - {TOPICS.find(t=>t.key===activeTopic).label}</h3>

        {/* Summary Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:14, marginBottom:20 }}>
          {[
            { label:'Total Tests', value:r.total, color:C.info, icon:'#' },
            { label:'Passed', value:r.pass, color:C.success, icon:'\u2713' },
            { label:'Failed', value:r.fail, color:C.danger, icon:'\u2717' },
            { label:'Blocked', value:r.blocked, color:C.warn, icon:'\u26A0' },
            { label:'Pass Rate', value:`${passRate}%`, color: passRate >= 90 ? C.success : passRate >= 75 ? C.warn : C.danger, icon:'%' }
          ].map((card, i) => (
            <div key={i} style={{ background:C.card, borderRadius:10, padding:16, border:`1px solid ${C.border}`, textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:800, color:card.color, marginBottom:4 }}>{card.value}</div>
              <div style={{ fontSize:12, color:C.muted, fontWeight:600 }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Pass Rate Progress Bar */}
        <div style={cardStyle}>
          <div style={{ fontSize:14, fontWeight:600, color:C.header, marginBottom:8 }}>Pass Rate</div>
          {progressBar(Number(passRate), passRate >= 90 ? C.success : passRate >= 75 ? C.warn : C.danger)}
        </div>

        {/* Failed Test Details */}
        {r.fail > 0 && (
          <div style={{...cardStyle, borderColor:C.danger}}>
            <div style={{ fontSize:14, fontWeight:700, color:C.danger, marginBottom:10 }}>Failed Test Details</div>
            {r.failedTests.map((ft, i) => (
              <div key={i} style={{ background:'rgba(231,76,60,0.1)', padding:12, borderRadius:8, marginBottom:8, borderLeft:`4px solid ${C.danger}` }}>
                <span style={{ color:C.danger, fontSize:13, fontFamily:'monospace' }}>{ft}</span>
              </div>
            ))}
          </div>
        )}

        {/* Execution Timeline */}
        <div style={cardStyle}>
          <div style={{ fontSize:14, fontWeight:600, color:C.header, marginBottom:8 }}>Execution Timeline</div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ background:C.accent, width:12, height:12, borderRadius:'50%', display:'inline-block' }}></span>
            <span style={{ color:C.text, fontSize:13 }}>{r.timeline}</span>
          </div>
        </div>

        {/* Status Distribution */}
        <div style={cardStyle}>
          <div style={{ fontSize:14, fontWeight:600, color:C.header, marginBottom:12 }}>Status Distribution</div>
          <div style={{ display:'flex', gap:4, height:24, borderRadius:8, overflow:'hidden' }}>
            <div style={{ width:`${(r.pass/r.total)*100}%`, background:C.success, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff' }}>{r.pass} Pass</div>
            {r.fail > 0 && <div style={{ width:`${(r.fail/r.total)*100}%`, background:C.danger, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff' }}>{r.fail} Fail</div>}
            {r.blocked > 0 && <div style={{ width:`${(r.blocked/r.total)*100}%`, background:C.warn, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff' }}>{r.blocked} Blk</div>}
          </div>
        </div>

        {/* Scenario Breakdown by Category */}
        <div style={cardStyle}>
          <div style={{ fontSize:14, fontWeight:600, color:C.header, marginBottom:12 }}>Scenario Breakdown by Category</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10 }}>
            {(() => {
              const catMap = {};
              data.scenarios.forEach(s => {
                if (!catMap[s.category]) catMap[s.category] = { total:0, pass:0, fail:0, blocked:0 };
                catMap[s.category].total++;
                if (s.status === 'Pass') catMap[s.category].pass++;
                if (s.status === 'Fail') catMap[s.category].fail++;
                if (s.status === 'Blocked') catMap[s.category].blocked++;
              });
              return Object.entries(catMap).map(([cat, counts], i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:12, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.info, marginBottom:6 }}>{cat}</div>
                  <div style={{ display:'flex', gap:8, fontSize:11 }}>
                    <span style={{ color:C.success }}>{counts.pass}P</span>
                    <span style={{ color:C.danger }}>{counts.fail}F</span>
                    <span style={{ color:C.warn }}>{counts.blocked}B</span>
                    <span style={{ color:C.muted }}>/ {counts.total}</span>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div style={cardStyle}>
          <div style={{ fontSize:14, fontWeight:600, color:C.header, marginBottom:12 }}>Test Case Priority Distribution</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12 }}>
            {['P0', 'P1', 'P2'].map((p, i) => {
              const count = data.cases.filter(tc => tc.priority === p).length;
              const passed = data.cases.filter(tc => tc.priority === p && tc.status === 'Pass').length;
              const failed = data.cases.filter(tc => tc.priority === p && tc.status === 'Fail').length;
              const blocked = data.cases.filter(tc => tc.priority === p && tc.status === 'Blocked').length;
              if (count === 0) return null;
              return (
                <div key={i} style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:14, border:`1px solid ${C.border}`, textAlign:'center' }}>
                  <div style={{ marginBottom:8 }}>{priorityBadge(p)}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:C.header, marginBottom:4 }}>{count}</div>
                  <div style={{ fontSize:11, color:C.muted }}>
                    <span style={{ color:C.success }}>{passed} Pass</span>{' | '}
                    <span style={{ color:C.danger }}>{failed} Fail</span>{' | '}
                    <span style={{ color:C.warn }}>{blocked} Blocked</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Environment Details */}
        <div style={cardStyle}>
          <div style={{ fontSize:14, fontWeight:600, color:C.header, marginBottom:12 }}>Execution Environment</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12 }}>
            {[
              { label:'Environment', value:TOPIC_METRICS[activeTopic].env, color:C.info },
              { label:'Suite Version', value:TOPIC_METRICS[activeTopic].version, color:C.accent },
              { label:'Last Run', value:TOPIC_METRICS[activeTopic].lastRun, color:C.text },
              { label:'Avg Execution Time', value:TOPIC_METRICS[activeTopic].avgExecTime, color:C.warn },
              { label:'Test Data Records', value:TOPIC_METRICS[activeTopic].testDataCount, color:C.accent },
              { label:'Risk Level', value:TOPIC_OVERVIEWS[activeTopic].riskLevel, color: TOPIC_OVERVIEWS[activeTopic].riskLevel === 'CRITICAL' ? C.danger : C.warn }
            ].map((item, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:12, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginBottom:4 }}>{item.label}</div>
                <div style={{ fontSize:14, fontWeight:700, color:item.color, fontFamily:'monospace' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Defect Analysis */}
        {r.fail > 0 && (
          <div style={cardStyle}>
            <div style={{ fontSize:14, fontWeight:600, color:C.header, marginBottom:12 }}>Defect Analysis</div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Defect ID</th>
                  <th style={thStyle}>Failed Test</th>
                  <th style={thStyle}>Severity</th>
                  <th style={thStyle}>Root Cause Category</th>
                  <th style={thStyle}>Assigned To</th>
                  <th style={thStyle}>Target Fix</th>
                </tr>
              </thead>
              <tbody>
                {data.cases.filter(tc => tc.status === 'Fail').map((tc, i) => (
                  <tr key={i} style={{ background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{...tdStyle, fontFamily:'monospace', color:C.danger}}>DEF-{tc.id.replace('TC-','')}</td>
                    <td style={tdStyle}>{tc.name}</td>
                    <td style={tdStyle}>{priorityBadge(tc.priority)}</td>
                    <td style={tdStyle}><span style={{ color:C.warn, fontSize:12 }}>Configuration / Integration</span></td>
                    <td style={tdStyle}><span style={{ color:C.text, fontSize:12 }}>QA Team - Sprint 24</span></td>
                    <td style={tdStyle}><span style={{ color:C.info, fontSize:12, fontFamily:'monospace' }}>2026-03-07</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Trend Indicators */}
        <div style={cardStyle}>
          <div style={{ fontSize:14, fontWeight:600, color:C.header, marginBottom:12 }}>Trend vs Previous Run</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12 }}>
            {[
              { metric:'Pass Rate', current:`${passRate}%`, prev:`${Math.max(0, Number(passRate) - 2)}%`, trend:'up' },
              { metric:'Avg Exec Time', current:TOPIC_METRICS[activeTopic].avgExecTime, prev:`${(parseFloat(TOPIC_METRICS[activeTopic].avgExecTime) * 1.15).toFixed(1)}s`, trend:'down' },
              { metric:'Failed Tests', current:r.fail, prev:r.fail + 1, trend:'down' },
              { metric:'Blocked Tests', current:r.blocked, prev:r.blocked, trend:'same' }
            ].map((t, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:12, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginBottom:6 }}>{t.metric}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:18, fontWeight:800, color:C.header }}>{t.current}</span>
                  <span style={{ fontSize:16, color: t.trend==='up' ? C.success : t.trend==='down' ? (t.metric.includes('Fail') || t.metric.includes('Exec') ? C.success : C.danger) : C.muted }}>
                    {t.trend === 'up' ? '\u2191' : t.trend === 'down' ? '\u2193' : '\u2192'}
                  </span>
                  <span style={{ fontSize:11, color:C.muted }}>prev: {t.prev}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ---- Aggregate Summary ---- */
  const totalTests = Object.values(ALL_DATA).reduce((sum, d) => sum + d.results.total, 0);
  const totalPass = Object.values(ALL_DATA).reduce((sum, d) => sum + d.results.pass, 0);
  const totalFail = Object.values(ALL_DATA).reduce((sum, d) => sum + d.results.fail, 0);
  const totalBlocked = Object.values(ALL_DATA).reduce((sum, d) => sum + d.results.blocked, 0);
  const overallPassRate = ((totalPass / totalTests) * 100).toFixed(0);

  return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(135deg, ${C.bgFrom} 0%, ${C.bgTo} 100%)`, padding:24, fontFamily:"'Segoe UI', system-ui, -apple-system, sans-serif" }}>

      {/* ===== HEADER ===== */}
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <h1 style={{ color:C.header, fontSize:30, fontWeight:800, marginBottom:4, letterSpacing:1 }}>Architecture Test Data Hub</h1>
        <p style={{ color:C.muted, fontSize:14, marginBottom:18 }}>Test Data | Test Scenarios | Test Cases | Test Results - All Architecture Topics</p>

        {/* Summary Badges */}
        <div style={{ display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
          {[
            { label:'Total Tests', value:totalTests, color:C.info },
            { label:'Pass', value:totalPass, color:C.success },
            { label:'Fail', value:totalFail, color:C.danger },
            { label:'Blocked', value:totalBlocked, color:C.warn },
            { label:'Pass Rate', value:`${overallPassRate}%`, color: overallPassRate >= 90 ? C.success : C.warn }
          ].map((b, i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${b.color}`, borderRadius:20, padding:'8px 20px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:20, fontWeight:800, color:b.color }}>{b.value}</span>
              <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== TOPIC TABS ===== */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18, justifyContent:'center' }}>
        {TOPICS.map(t => (
          <button key={t.key} onClick={() => { setActiveTopic(t.key); setActiveSubTab('data'); }}
            style={{ padding:'8px 16px', borderRadius:8, border: activeTopic===t.key ? `2px solid ${C.accent}` : `1px solid ${C.border}`, background: activeTopic===t.key ? C.accent : C.card, color: activeTopic===t.key ? '#fff' : C.text, cursor:'pointer', fontSize:12, fontWeight:600, transition:'all 0.2s ease' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== SUB TABS ===== */}
      <div style={{ display:'flex', gap:8, marginBottom:20, justifyContent:'center' }}>
        {SUB_TABS.map(st => (
          <button key={st.key} onClick={() => setActiveSubTab(st.key)}
            style={{ padding:'8px 20px', borderRadius:20, border: activeSubTab===st.key ? `2px solid ${C.accent}` : `1px solid ${C.border}`, background: activeSubTab===st.key ? 'rgba(78,204,163,0.15)' : 'transparent', color: activeSubTab===st.key ? C.accent : C.muted, cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.2s ease' }}>
            {st.label}
          </button>
        ))}
      </div>

      {/* ===== CONTENT ===== */}
      <div style={{ maxWidth:1400, margin:'0 auto' }}>
        {activeSubTab === 'data' && renderTestData()}
        {activeSubTab === 'scenarios' && renderScenarios()}
        {activeSubTab === 'cases' && renderCases()}
        {activeSubTab === 'results' && renderResults()}
        {activeSubTab === 'overview' && renderOverview()}
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{ textAlign:'center', marginTop:32, padding:16, borderTop:`1px solid ${C.border}` }}>
        <p style={{ color:C.muted, fontSize:12 }}>Architecture Test Data Hub | Banking QA Testing Dashboard | Last Updated: 2026-02-28 16:30 IST</p>
      </div>
    </div>
  );
}

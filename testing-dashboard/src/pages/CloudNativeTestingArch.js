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

export default function CloudNativeTestingArch() {
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
      <h2 style={sectionTitle}>Cloud Native Banking Platform Architecture</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Multi-region cloud native architecture for Indian banking ecosystem deployed on AWS (Primary) and Azure (DR). Leverages EKS for container orchestration, Lambda for serverless workloads, and comprehensive security with WAF, Shield, GuardDuty, and KMS. Designed for RBI cloud guidelines compliance with India-only data residency.
      </p>

      <pre style={preStyle}>{`
+============================================================================================+
|               CLOUD NATIVE BANKING PLATFORM - MULTI-REGION ARCHITECTURE                     |
|                           AWS (Primary) + Azure (DR)                                        |
+============================================================================================+

  REGION A (ap-south-1 Mumbai) - PRIMARY
  =======================================

  +----------------------------------------------------------------------------------------+
  |  VPC: 10.0.0.0/16  (Banking-Production-VPC)                                            |
  |                                                                                         |
  |  PUBLIC SUBNET (10.0.1.0/24)                                                            |
  |  +------------------------------------------------------------------------------------+ |
  |  |  +----------------+    +----------------+    +------------------+                   | |
  |  |  | CloudFront     |    | AWS WAF        |    | Application      |                   | |
  |  |  | (CDN + Edge)   |--->| (SQL Injection |    | Load Balancer    |                   | |
  |  |  | - Static Assets|    |  XSS, Bot Mgmt)|-->| (ALB)            |                   | |
  |  |  | - API Cache    |    | - Rate Limiting|    | - Path Routing   |                   | |
  |  |  | - Geo Restrict |    | - IP Allowlist |    | - TLS Terminate  |                   | |
  |  |  +----------------+    +----------------+    | - Health Checks  |                   | |
  |  |                                              +--------+---------+                   | |
  |  +------------------------------------------------------------------------------------+ |
  |                                                          |                              |
  |  PRIVATE SUBNET (10.0.2.0/24) - Application Tier                                       |
  |  +------------------------------------------------------------------------------------+ |
  |  |  EKS CLUSTER (v1.29) - Banking Microservices                                       | |
  |  |  +---------------+  +---------------+  +---------------+  +------------------+     | |
  |  |  | Namespace:     |  | Namespace:    |  | Namespace:    |  | Namespace:       |     | |
  |  |  | accounts       |  | payments      |  | loans         |  | platform         |     | |
  |  |  |                |  |               |  |               |  |                  |     | |
  |  |  | +------------+ |  | +-----------+ |  | +-----------+ |  | +--------------+ |     | |
  |  |  | | Account    | |  | | NEFT/RTGS | |  | | Loan      | |  | | Auth Service | |     | |
  |  |  | | Service    | |  | | Service   | |  | | Originate | |  | | (OAuth2/JWT) | |     | |
  |  |  | | (3 pods)   | |  | | (5 pods)  | |  | | (3 pods)  | |  | +--------------+ |     | |
  |  |  | +------------+ |  | +-----------+ |  | +-----------+ |  | +--------------+ |     | |
  |  |  | +------------+ |  | +-----------+ |  | +-----------+ |  | | API Gateway  | |     | |
  |  |  | | KYC        | |  | | UPI       | |  | | Loan      | |  | | (Kong/Istio) | |     | |
  |  |  | | Service    | |  | | Service   | |  | | Approval  | |  | +--------------+ |     | |
  |  |  | | (2 pods)   | |  | | (8 pods)  | |  | | (2 pods)  | |  | +--------------+ |     | |
  |  |  | +------------+ |  | +-----------+ |  | +-----------+ |  | | Config Svc   | |     | |
  |  |  | +------------+ |  | +-----------+ |  | +-----------+ |  | | (Consul)     | |     | |
  |  |  | | Statement  | |  | | Card      | |  | | EMI       | |  | +--------------+ |     | |
  |  |  | | Service    | |  | | Service   | |  | | Calculator| |  |                  |     | |
  |  |  | | (2 pods)   | |  | | (4 pods)  | |  | | (2 pods)  | |  |                  |     | |
  |  |  | +------------+ |  | +-----------+ |  | +-----------+ |  |                  |     | |
  |  |  +---------------+  +---------------+  +---------------+  +------------------+     | |
  |  |                                                                                     | |
  |  |  ISTIO SERVICE MESH (mTLS, Traffic Management, Observability)                       | |
  |  |  KARPENTER (Node Auto-Provisioning) | HPA (Pod Auto-Scaling)                        | |
  |  +------------------------------------------------------------------------------------+ |
  |                                                                                         |
  |  DATA SUBNET (10.0.3.0/24) - Database Tier                                             |
  |  +------------------------------------------------------------------------------------+ |
  |  |  +----------------+    +----------------+    +------------------+                   | |
  |  |  | RDS PostgreSQL |    | ElastiCache    |    | Amazon S3        |                   | |
  |  |  | (Multi-AZ)     |    | (Redis Cluster)|    | (Encrypted)      |                   | |
  |  |  | - Primary + RR |    | - Session Store|    | - Documents      |                   | |
  |  |  | - Auto Failover|    | - API Cache    |    | - Statements     |                   | |
  |  |  | - Encrypted    |    | - Rate Limit   |    | - Audit Logs     |                   | |
  |  |  | - Point-in-Time|    | - Pub/Sub      |    | - Backups        |                   | |
  |  |  +----------------+    +----------------+    | - Cross-Region   |                   | |
  |  |                                              |   Replication    |                   | |
  |  |  +----------------+    +----------------+    +------------------+                   | |
  |  |  | Amazon MSK     |    | OpenSearch     |                                           | |
  |  |  | (Kafka)        |    | (Logs/Search)  |                                           | |
  |  |  | - Event Stream |    | - Txn Search   |                                           | |
  |  |  | - Audit Events |    | - Audit Index  |                                           | |
  |  |  +----------------+    +----------------+                                           | |
  |  +------------------------------------------------------------------------------------+ |
  +----------------------------------------------------------------------------------------+

  SERVERLESS LAYER
  ================
  +----------------------------------------------------------------------------------------+
  |  +--------------------+  +--------------------+  +------------------------+             |
  |  | Lambda Functions   |  | Step Functions     |  | API Gateway            |             |
  |  | - PDF Generation   |  | - Loan Approval    |  | - REST APIs (v1/v2)    |             |
  |  | - SMS/Email Notify |  |   Workflow          |  | - WebSocket (Realtime) |             |
  |  | - Reconciliation   |  | - KYC Verification |  | - Rate Limiting        |             |
  |  | - Report Scheduler |  | - Account Closure  |  | - API Key Auth         |             |
  |  | - S3 Event Trigger |  | - Dispute Resolution|  | - WAF Integration     |             |
  |  +--------------------+  +--------------------+  +------------------------+             |
  +----------------------------------------------------------------------------------------+

  SECURITY & OBSERVABILITY
  ========================
  +-------------------+  +------------------+  +------------------+  +------------------+
  | IAM + STS         |  | KMS              |  | CloudWatch       |  | X-Ray            |
  | - IRSA (Pod IAM)  |  | - CMK for RDS    |  | - Metrics        |  | - Distributed    |
  | - Role Chaining   |  | - CMK for S3     |  | - Alarms         |  |   Tracing        |
  | - Least Privilege |  | - CMK for Lambda |  | - Log Groups     |  | - Service Map    |
  +-------------------+  | - Key Rotation   |  | - Dashboards     |  | - Latency        |
                          +------------------+  +------------------+  +------------------+
  +-------------------+  +------------------+  +------------------+
  | GuardDuty         |  | Security Hub     |  | AWS Shield Adv   |
  | - Threat Detect   |  | - CIS Benchmark  |  | - DDoS Protect   |
  | - Anomaly Alert   |  | - PCI-DSS Checks |  | - Cost Protect   |
  | - DNS Monitoring   |  | - Custom Stds    |  | - Response Team  |
  +-------------------+  +------------------+  +------------------+


  REGION B (Central India) - DISASTER RECOVERY
  =============================================

  +----------------------------------------------------------------------------------------+
  |  Azure AKS (DR Cluster)  |  Azure Cosmos DB (Geo-Replicated)  |  Azure Blob (DR Copy)  |
  |  - Warm Standby Pods     |  - Multi-Region Writes             |  - S3 Cross-Region     |
  |  - Auto-Failover via     |  - Automatic Failover              |    Replication Mirror   |
  |    Route53 Health Check  |  - RPO < 5 minutes                 |  - Lifecycle Policies   |
  |  - RTO < 15 minutes      |  - RTO < 15 minutes                |                         |
  +----------------------------------------------------------------------------------------+

  DNS & TRAFFIC MANAGEMENT
  ========================
  +-------------------+  +------------------+  +------------------+
  | Route 53          |  | Global Acceler.  |  | Transit Gateway  |
  | - Health Checks   |  | - Anycast IPs    |  | - VPC Peering    |
  | - Failover Policy |  | - TCP/UDP Opt    |  | - Cross-Region   |
  | - Geo Routing     |  | - DDoS Resilient |  | - PrivateLink    |
  +-------------------+  +------------------+  +------------------+
`}</pre>

      <h3 style={sectionTitle}>Module Overview</h3>
      <div style={gridStyle}>
        {[
          { title:'EKS Cluster (Kubernetes)', desc:'Managed Kubernetes cluster running banking microservices across namespaces (accounts, payments, loans, platform). Istio service mesh for mTLS, traffic management, and canary deployments. Karpenter for intelligent node provisioning.', reg:'Container Orchestration', color:C.accent },
          { title:'Serverless (Lambda + Step Functions)', desc:'Event-driven serverless compute for PDF generation, notifications, reconciliation, and complex workflows like loan approval state machines. Zero server management with pay-per-invocation pricing.', reg:'Serverless Computing', color:C.info },
          { title:'Multi-AZ Data Layer', desc:'RDS PostgreSQL Multi-AZ with automated failover, ElastiCache Redis cluster for sub-millisecond caching, S3 with cross-region replication for documents, MSK (Kafka) for event streaming.', reg:'Managed Data Services', color:C.success },
          { title:'Security Stack', desc:'Defense-in-depth: WAF (SQL injection, XSS), Shield Advanced (DDoS), GuardDuty (threat detection), Security Hub (compliance), KMS (encryption), IAM IRSA (pod-level IAM roles).', reg:'Cloud Security', color:C.danger },
          { title:'Observability Platform', desc:'CloudWatch metrics/alarms/dashboards, X-Ray distributed tracing, OpenSearch for log analytics, Prometheus + Grafana for K8s metrics. Full end-to-end transaction visibility.', reg:'Monitoring & Logging', color:C.warn },
          { title:'CI/CD Pipeline', desc:'GitHub Actions for CI, ArgoCD for GitOps-based continuous deployment to EKS. Canary releases via Istio traffic splitting. Automated rollback on error rate threshold breach.', reg:'DevOps & GitOps', color:C.accent },
          { title:'Multi-Region DR', desc:'Primary on AWS Mumbai (ap-south-1), DR on Azure Central India. Route53 health checks with automatic failover. RPO < 5 minutes, RTO < 15 minutes. Cross-region S3 replication.', reg:'Disaster Recovery', color:C.danger },
          { title:'IaC & Compliance', desc:'Terraform for all infrastructure provisioning. OPA/Gatekeeper for policy enforcement. RBI cloud guidelines compliance with India-only data residency. SOC2 Type II audited.', reg:'Infrastructure as Code', color:C.info }
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
        Cloud Native Migration and Deployment Strategy for Banking Platform - Business Requirements covering AWS/Azure multi-region deployment, Kubernetes orchestration, serverless computing, and RBI cloud compliance.
      </p>

      <h3 style={subTitle}>Objectives</h3>
      <div style={cardStyle}>
        <ul style={{ color:C.text, lineHeight:2, paddingLeft:20 }}>
          <li>Reduce infrastructure costs by <strong style={{ color:C.accent }}>40%</strong> through right-sizing, auto-scaling, and serverless adoption</li>
          <li>Enable <strong style={{ color:C.accent }}>auto-scaling for peak banking hours</strong> (salary days, quarter-end) handling 10x normal traffic within 3 minutes</li>
          <li>Achieve <strong style={{ color:C.accent }}>99.99% availability</strong> with multi-region active-passive deployment (AWS + Azure)</li>
          <li>Meet <strong style={{ color:C.danger }}>RBI Cloud Framework Guidelines</strong> with India-only data residency and approved cloud service providers</li>
          <li>Implement multi-region DR with <strong style={{ color:C.danger }}>RPO &lt; 5 minutes</strong> and <strong style={{ color:C.danger }}>RTO &lt; 15 minutes</strong></li>
          <li>Achieve <strong style={{ color:C.info }}>PCI-DSS compliance</strong> in cloud environment with network segmentation, encryption, and access controls</li>
          <li>Obtain <strong style={{ color:C.info }}>SOC2 Type II</strong> certification for cloud infrastructure and operations</li>
          <li>Implement <strong style={{ color:C.accent }}>Infrastructure as Code (IaC)</strong> for 100% reproducible, auditable infrastructure provisioning</li>
        </ul>
      </div>

      <h3 style={sectionTitle}>Scope by Domain</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Domain</th>
            <th style={thStyle}>Scope Areas</th>
            <th style={thStyle}>Key Requirements</th>
            <th style={thStyle}>Success Criteria</th>
          </tr>
        </thead>
        <tbody>
          {[
            { reg:'Container Orchestration (EKS)', scope:'Kubernetes cluster management, namespace isolation, pod auto-scaling (HPA/VPA), node provisioning (Karpenter), service mesh (Istio), network policies, pod security standards', controls:'Multi-namespace banking workloads, Istio mTLS, Karpenter auto-provisioning, PodDisruptionBudgets, resource quotas per namespace', freq:'Zero-downtime deployments, < 3 min scale-out' },
            { reg:'Serverless (Lambda/Step Functions)', scope:'Event-driven PDF generation, notification dispatch, reconciliation jobs, loan approval workflows, S3 event triggers, scheduled reports', controls:'Cold start < 500ms, reserved concurrency for critical functions, Step Functions for multi-step workflows, DLQ for failed invocations', freq:'< 100ms P99 for warm invocations' },
            { reg:'Data Services (RDS/ElastiCache/S3)', scope:'Multi-AZ RDS PostgreSQL, Redis cluster for caching, S3 for document storage, MSK for event streaming, OpenSearch for log analytics', controls:'Automated failover < 60s, point-in-time recovery, cross-region replication, encryption at rest (KMS), backup retention 35 days', freq:'RPO < 5 min, RTO < 15 min' },
            { reg:'Security & Compliance', scope:'WAF rules, Shield DDoS protection, GuardDuty threat detection, Security Hub compliance checks, KMS key management, IAM IRSA, VPC security groups, NACLs', controls:'CIS Benchmark compliance, PCI-DSS automated checks, RBI cloud guidelines, SOC2 controls, secrets management (Vault/ESO)', freq:'Continuous monitoring, quarterly compliance scan' },
            { reg:'CI/CD & GitOps', scope:'GitHub Actions CI pipelines, ArgoCD GitOps deployment, Helm chart management, container image scanning (Trivy), canary releases, automated rollback', controls:'Image vulnerability scan before deploy, OPA policy gate, canary traffic split (5/25/50/100%), error rate rollback trigger', freq:'Multiple deploys per day, < 10 min pipeline' },
            { reg:'Observability', scope:'CloudWatch metrics/alarms, X-Ray distributed tracing, Prometheus/Grafana dashboards, OpenSearch log aggregation, alerting (PagerDuty/SNS)', controls:'P99 latency tracking, error rate alerting, resource utilization dashboards, distributed trace correlation, log retention 90 days', freq:'Real-time monitoring, 1-min alarm granularity' },
            { reg:'Disaster Recovery', scope:'Multi-region failover (AWS Mumbai + Azure Central India), Route53 health checks, S3 cross-region replication, database geo-replication', controls:'Automated failover on health check failure, warm standby in DR region, quarterly DR drill, data consistency validation post-failover', freq:'DR drill quarterly, RPO < 5 min, RTO < 15 min' }
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
          { title:'Auto-Scale Response Time', value:'< 3 min', desc:'EKS cluster must scale from baseline to 10x capacity within 3 minutes during peak banking hours (salary days, quarter-end). Karpenter node provisioning + HPA pod scaling.', color:C.danger },
          { title:'Disaster Recovery RPO', value:'< 5 min', desc:'Recovery Point Objective for cross-region failover. Maximum 5 minutes of data loss acceptable. Achieved via RDS Multi-AZ, S3 cross-region replication, MSK mirroring.', color:C.warn },
          { title:'Disaster Recovery RTO', value:'< 15 min', desc:'Recovery Time Objective for full service restoration in DR region. Route53 health check failover + warm standby EKS cluster in Azure Central India.', color:C.info },
          { title:'Infrastructure Cost Reduction', value:'40%', desc:'Target 40% reduction from on-premise costs through right-sizing, Spot instances for non-critical workloads, serverless for event-driven tasks, and reserved instances for baseline.', color:C.success },
          { title:'Deployment Frequency', value:'Multiple/Day', desc:'Enable multiple production deployments per day with zero downtime. ArgoCD GitOps with canary releases via Istio. Automated rollback on error rate > 1%.', color:C.accent },
          { title:'Data Residency', value:'India Only', desc:'All banking data must reside within India per RBI cloud guidelines. AWS Mumbai (ap-south-1) primary, Azure Central India DR. No data egress outside Indian geography.', color:C.danger }
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
        High-level cloud native architecture showing AWS primary infrastructure, Azure DR, Kubernetes cluster topology, networking, and security layers for banking platform.
      </p>

      <pre style={preStyle}>{`
+=============================================================================+
|              HIGH-LEVEL CLOUD NATIVE ARCHITECTURE                            |
+=============================================================================+

   AWS PRIMARY (ap-south-1 Mumbai)
   ================================

   +-----------------------------------------------------------------------+
   |  VPC: Banking-Production (10.0.0.0/16)                                |
   |                                                                        |
   |  Internet Gateway --> CloudFront --> WAF --> ALB                       |
   |                                                                        |
   |  +------------------------------------------------------------------+ |
   |  |  EKS CLUSTER (v1.29, Managed Node Groups + Karpenter)            | |
   |  |                                                                    | |
   |  |  Node Pool: System (m6i.xlarge x3) - CoreDNS, Kube-Proxy         | |
   |  |  Node Pool: Banking (m6i.2xlarge) - Karpenter Provisioned         | |
   |  |  Node Pool: Batch (c6i.4xlarge, Spot) - Reconciliation Jobs       | |
   |  |                                                                    | |
   |  |  Namespaces:                                                       | |
   |  |  +-------------+  +-------------+  +-------------+  +----------+ | |
   |  |  | accounts    |  | payments    |  | loans       |  | platform | | |
   |  |  | - Account   |  | - NEFT/RTGS |  | - Originate |  | - Auth   | | |
   |  |  | - KYC       |  | - UPI       |  | - Approval  |  | - Config | | |
   |  |  | - Statement |  | - Card      |  | - EMI       |  | - API GW | | |
   |  |  | - Profile   |  | - IMPS      |  | - Disburse  |  | - Audit  | | |
   |  |  +-------------+  +-------------+  +-------------+  +----------+ | |
   |  |                                                                    | |
   |  |  Service Mesh: Istio (mTLS, VirtualService, DestinationRule)      | |
   |  |  Ingress: AWS ALB Ingress Controller                              | |
   |  |  Secrets: External Secrets Operator --> AWS Secrets Manager        | |
   |  +------------------------------------------------------------------+ |
   |                                                                        |
   |  +------------------------------------------------------------------+ |
   |  |  DATA TIER                                                        | |
   |  |  RDS PostgreSQL 15 (Multi-AZ, db.r6g.xlarge)                     | |
   |  |  ElastiCache Redis 7 (Cluster Mode, 3 shards)                    | |
   |  |  Amazon S3 (Versioned, SSE-KMS, Cross-Region Repl.)              | |
   |  |  Amazon MSK (Kafka 3.5, 3 brokers, Multi-AZ)                     | |
   |  |  Amazon OpenSearch (3-node, UltraWarm for logs)                   | |
   |  +------------------------------------------------------------------+ |
   +-----------------------------------------------------------------------+

   SERVERLESS FUNCTIONS
   ====================
   +---------+  +----------+  +-----------+  +------------+  +-----------+
   | Lambda  |  | Lambda   |  | Lambda    |  | Lambda     |  | Lambda    |
   | PDF Gen |  | SMS/Push |  | Reconcile |  | Report Gen |  | S3 Trigger|
   | 512MB   |  | 256MB    |  | 1024MB    |  | 2048MB     |  | 256MB     |
   | 30s TO  |  | 10s TO   |  | 5min TO   |  | 5min TO    |  | 60s TO    |
   +---------+  +----------+  +-----------+  +------------+  +-----------+

   STEP FUNCTIONS (State Machines)
   ===============================
   +-----------------------------------+    +----------------------------+
   | Loan Approval Workflow            |    | Account Closure Workflow    |
   | Credit Check --> Underwriting --> |    | Validation --> Settlement   |
   | Approval --> Disbursement         |    | --> Closure --> Archive     |
   +-----------------------------------+    +----------------------------+

   NETWORKING
   ==========
   +-------------------+    +-------------------+    +-------------------+
   | VPC Peering       |    | Transit Gateway   |    | PrivateLink       |
   | (Dev <-> Prod)    |    | (Cross-Region)    |    | (AWS Services)    |
   |                   |    | (AWS <-> Azure    |    | - S3 Endpoint     |
   |                   |    |  via VPN)         |    | - RDS Endpoint    |
   |                   |    |                   |    | - STS Endpoint    |
   +-------------------+    +-------------------+    +-------------------+

   SECURITY LAYER
   ==============
   +----------------+  +----------------+  +----------------+  +----------+
   | AWS WAF v2     |  | Shield Adv     |  | GuardDuty      |  | Sec Hub  |
   | - OWASP Top 10 |  | - L3/L4 DDoS  |  | - Threat Intel |  | - CIS    |
   | - Rate Limit   |  | - L7 DDoS     |  | - DNS Anomaly  |  | - PCI    |
   | - Bot Control  |  | - Cost Protect |  | - Crypto Mining|  | - Custom |
   | - Geo Block    |  | - SRT Access   |  | - Recon Detect |  | - Alerts |
   +----------------+  +----------------+  +----------------+  +----------+


   AZURE DR (Central India)
   ========================
   +-----------------------------------------------------------------------+
   |  AKS Cluster (Warm Standby)  |  Cosmos DB (Geo-Replicated)           |
   |  - Same namespace structure   |  - Strong consistency                 |
   |  - Scaled down (min replicas) |  - Auto failover                     |
   |  - ArgoCD synced              |  - India-only regions                 |
   |                               |                                       |
   |  Azure Blob (DR Copy)        |  Azure Functions (Standby)            |
   |  - S3 Mirror via replication  |  - Same logic as Lambda              |
   |  - Lifecycle management       |  - Activated on failover             |
   +-----------------------------------------------------------------------+
`}</pre>
    </div>
  );

  const renderLLD = () => (
    <div>
      <h2 style={sectionTitle}>Low-Level Design (LLD)</h2>

      <h3 style={subTitle}>Kubernetes Manifests</h3>
      <pre style={preStyle}>{`
  KUBERNETES DEPLOYMENT MANIFEST
  ==============================

  # Deployment: Payment Service
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: payment-service
    namespace: payments
    labels:
      app: payment-service
      version: v2.1.0
  spec:
    replicas: 5
    selector:
      matchLabels:
        app: payment-service
    strategy:
      type: RollingUpdate
      rollingUpdate:
        maxSurge: 1
        maxUnavailable: 0
    template:
      metadata:
        labels:
          app: payment-service
          version: v2.1.0
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/port: "8080"
          prometheus.io/path: "/metrics"
      spec:
        serviceAccountName: payment-service-sa
        securityContext:
          runAsNonRoot: true
          runAsUser: 1000
          fsGroup: 2000
          seccompProfile:
            type: RuntimeDefault
        containers:
        - name: payment-service
          image: 123456789.dkr.ecr.ap-south-1.amazonaws.com/payment-service:v2.1.0
          ports:
          - containerPort: 8080
            protocol: TCP
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "1000m"
              memory: "1Gi"
          env:
          - name: DB_HOST
            valueFrom:
              secretKeyRef:
                name: payment-db-secret
                key: host
          - name: REDIS_URL
            valueFrom:
              configMapKeyRef:
                name: payment-config
                key: redis-url
          livenessProbe:
            httpGet:
              path: /health/live
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 10
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
          startupProbe:
            httpGet:
              path: /health/startup
              port: 8080
            failureThreshold: 30
            periodSeconds: 2

  ---
  # HorizontalPodAutoscaler
  apiVersion: autoscaling/v2
  kind: HorizontalPodAutoscaler
  metadata:
    name: payment-service-hpa
    namespace: payments
  spec:
    scaleTargetRef:
      apiVersion: apps/v1
      kind: Deployment
      name: payment-service
    minReplicas: 5
    maxReplicas: 50
    metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "1000"
    behavior:
      scaleUp:
        stabilizationWindowSeconds: 30
        policies:
        - type: Percent
          value: 100
          periodSeconds: 60
      scaleDown:
        stabilizationWindowSeconds: 300
        policies:
        - type: Percent
          value: 10
          periodSeconds: 60

  ---
  # PodDisruptionBudget
  apiVersion: policy/v1
  kind: PodDisruptionBudget
  metadata:
    name: payment-service-pdb
    namespace: payments
  spec:
    minAvailable: 3
    selector:
      matchLabels:
        app: payment-service

  ---
  # NetworkPolicy
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: payment-service-netpol
    namespace: payments
  spec:
    podSelector:
      matchLabels:
        app: payment-service
    policyTypes:
    - Ingress
    - Egress
    ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: platform
        podSelector:
          matchLabels:
            app: api-gateway
      ports:
      - protocol: TCP
        port: 8080
    egress:
    - to:
      - namespaceSelector:
          matchLabels:
            name: payments
      ports:
      - protocol: TCP
        port: 5432
    - to:
      - namespaceSelector:
          matchLabels:
            name: payments
      ports:
      - protocol: TCP
        port: 6379
`}</pre>

      <h3 style={sectionTitle}>Terraform Module</h3>
      <pre style={preStyle}>{`
  TERRAFORM EKS MODULE
  =====================

  # modules/eks/main.tf
  module "eks" {
    source  = "terraform-aws-modules/eks/aws"
    version = "~> 19.0"

    cluster_name    = "banking-prod-eks"
    cluster_version = "1.29"

    vpc_id     = module.vpc.vpc_id
    subnet_ids = module.vpc.private_subnets

    cluster_endpoint_public_access  = false
    cluster_endpoint_private_access = true

    cluster_addons = {
      coredns    = { most_recent = true }
      kube-proxy = { most_recent = true }
      vpc-cni    = { most_recent = true }
    }

    eks_managed_node_groups = {
      system = {
        instance_types = ["m6i.xlarge"]
        min_size       = 3
        max_size       = 5
        desired_size   = 3
        labels = { "node-role" = "system" }
        taints = []
      }
    }

    cluster_encryption_config = {
      provider_key_arn = aws_kms_key.eks.arn
      resources        = ["secrets"]
    }

    enable_irsa = true
    tags = local.common_tags
  }

  # Karpenter Provisioner
  resource "kubectl_manifest" "karpenter_provisioner" {
    yaml_body = <<-YAML
    apiVersion: karpenter.sh/v1beta1
    kind: NodePool
    metadata:
      name: banking-workloads
    spec:
      template:
        spec:
          requirements:
          - key: "karpenter.sh/capacity-type"
            operator: In
            values: ["on-demand"]
          - key: "node.kubernetes.io/instance-type"
            operator: In
            values: ["m6i.xlarge", "m6i.2xlarge", "m6i.4xlarge"]
          - key: "topology.kubernetes.io/zone"
            operator: In
            values: ["ap-south-1a", "ap-south-1b"]
      limits:
        cpu: "200"
        memory: "400Gi"
      disruption:
        consolidationPolicy: WhenUnderutilized
        expireAfter: 720h
    YAML
  }

  # RDS PostgreSQL
  module "rds" {
    source  = "terraform-aws-modules/rds/aws"
    version = "~> 6.0"

    identifier = "banking-prod-db"
    engine     = "postgres"
    engine_version = "15.4"
    instance_class = "db.r6g.xlarge"

    allocated_storage     = 500
    max_allocated_storage = 2000
    storage_encrypted     = true
    kms_key_id           = aws_kms_key.rds.arn

    multi_az = true
    db_subnet_group_name = module.vpc.database_subnet_group_name
    vpc_security_group_ids = [aws_security_group.rds.id]

    backup_retention_period = 35
    deletion_protection     = true

    performance_insights_enabled = true
    monitoring_interval         = 60
    monitoring_role_arn         = aws_iam_role.rds_monitoring.arn

    parameters = [
      { name = "shared_preload_libraries", value = "pg_stat_statements" },
      { name = "log_min_duration_statement", value = "1000" }
    ]

    tags = local.common_tags
  }
`}</pre>

      <h3 style={sectionTitle}>Istio VirtualService & Helm Values</h3>
      <pre style={preStyle}>{`
  ISTIO VIRTUAL SERVICE (Canary Release)
  =======================================

  apiVersion: networking.istio.io/v1beta1
  kind: VirtualService
  metadata:
    name: payment-service-vs
    namespace: payments
  spec:
    hosts:
    - payment-service
    http:
    - match:
      - headers:
          x-canary:
            exact: "true"
      route:
      - destination:
          host: payment-service
          subset: canary
        weight: 100
    - route:
      - destination:
          host: payment-service
          subset: stable
        weight: 95
      - destination:
          host: payment-service
          subset: canary
        weight: 5

  ---
  # Istio DestinationRule
  apiVersion: networking.istio.io/v1beta1
  kind: DestinationRule
  metadata:
    name: payment-service-dr
    namespace: payments
  spec:
    host: payment-service
    trafficPolicy:
      connectionPool:
        tcp:
          maxConnections: 100
        http:
          h2UpgradePolicy: DEFAULT
          http1MaxPendingRequests: 100
          http2MaxRequests: 1000
      outlierDetection:
        consecutive5xxErrors: 5
        interval: 30s
        baseEjectionTime: 60s
    subsets:
    - name: stable
      labels:
        version: v2.0.0
    - name: canary
      labels:
        version: v2.1.0

  ---
  # Prometheus ServiceMonitor
  apiVersion: monitoring.coreos.com/v1
  kind: ServiceMonitor
  metadata:
    name: payment-service-monitor
    namespace: payments
  spec:
    selector:
      matchLabels:
        app: payment-service
    endpoints:
    - port: http
      path: /metrics
      interval: 15s

  ---
  # ArgoCD ApplicationSet
  apiVersion: argoproj.io/v1alpha1
  kind: ApplicationSet
  metadata:
    name: banking-services
    namespace: argocd
  spec:
    generators:
    - git:
        repoURL: https://github.com/bank/k8s-manifests.git
        revision: main
        directories:
        - path: "services/*"
    template:
      metadata:
        name: "{{path.basename}}"
      spec:
        project: banking-prod
        source:
          repoURL: https://github.com/bank/k8s-manifests.git
          targetRevision: main
          path: "{{path}}"
        destination:
          server: https://kubernetes.default.svc
          namespace: "{{path.basename}}"
        syncPolicy:
          automated:
            prune: true
            selfHeal: true
          syncOptions:
          - CreateNamespace=true

  ---
  # External Secrets Operator
  apiVersion: external-secrets.io/v1beta1
  kind: ExternalSecret
  metadata:
    name: payment-db-secret
    namespace: payments
  spec:
    refreshInterval: 1h
    secretStoreRef:
      name: aws-secrets-manager
      kind: ClusterSecretStore
    target:
      name: payment-db-secret
    data:
    - secretKey: host
      remoteRef:
        key: banking/prod/payment-db
        property: host
    - secretKey: password
      remoteRef:
        key: banking/prod/payment-db
        property: password

  ---
  # ResourceQuota per Namespace
  apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: payments-quota
    namespace: payments
  spec:
    hard:
      requests.cpu: "20"
      requests.memory: "40Gi"
      limits.cpu: "40"
      limits.memory: "80Gi"
      pods: "100"
      services: "20"
`}</pre>
    </div>
  );

  const renderScenarios = () => (
    <div>
      <h2 style={sectionTitle}>Cloud Native Testing Scenarios</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 comprehensive test scenarios covering Kubernetes orchestration, serverless computing, cloud security, disaster recovery, and infrastructure compliance for banking platform on AWS/Azure.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width:50 }}>#</th>
            <th style={thStyle}>Scenario</th>
            <th style={thStyle}>Cloud Service</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Expected Outcome</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id:'S01', title:'K8s Pod Auto-Scaling on Salary Day', reg:'EKS/HPA', desc:'Simulate salary day traffic spike (10x normal). Payment service pods must scale from 5 to 50 replicas within 3 minutes. HPA triggers on CPU > 70% and custom metric (requests/sec > 1000).', outcome:'HPA scales pods from 5 to 50. Karpenter provisions 8 new m6i.2xlarge nodes. P99 latency remains < 500ms during scale-out. No 5xx errors during scaling.' },
            { id:'S02', title:'EKS Node Scaling via Karpenter', reg:'EKS/Karpenter', desc:'Karpenter provisions new nodes when pending pods detected. Validate instance type selection (m6i.xlarge/2xlarge), AZ distribution, and node readiness time. Simulate node capacity exhaustion scenario.', outcome:'New nodes provisioned within 90 seconds. Pods scheduled within 30 seconds of node ready. Correct instance type selected based on pod resource requests. Even AZ distribution.' },
            { id:'S03', title:'Lambda Cold Start for PDF Generation', reg:'Lambda', desc:'Invoke PDF generation Lambda after 15-minute idle period. Measure cold start latency including VPC ENI attachment, runtime initialization, and function execution. Validate PDF output correctness.', outcome:'Cold start < 3 seconds (with VPC). Warm invocation < 200ms. PDF generated correctly with all banking data. CloudWatch logs capture execution metrics.' },
            { id:'S04', title:'Multi-AZ RDS Failover', reg:'RDS', desc:'Trigger RDS Multi-AZ failover by rebooting primary instance with failover option. Measure failover time, connection disruption, and application recovery. Validate data consistency post-failover.', outcome:'Failover completes within 60 seconds. Application reconnects automatically via connection pooling. Zero data loss. Read replicas re-sync within 5 minutes.' },
            { id:'S05', title:'S3 Cross-Region Replication', reg:'S3', desc:'Upload 1000 banking documents to S3 primary bucket (Mumbai). Validate cross-region replication to DR bucket (Azure Blob via connector). Verify encryption, metadata preservation, and replication lag.', outcome:'All 1000 objects replicated within 15 minutes. SSE-KMS encryption maintained. Metadata and tags preserved. Replication metrics visible in CloudWatch.' },
            { id:'S06', title:'CloudFront Cache Invalidation', reg:'CloudFront', desc:'Deploy new version of banking portal frontend. Invalidate CloudFront cache for all static assets. Validate edge locations serve new content. Measure invalidation propagation time globally.', outcome:'Cache invalidation propagates to all edge locations within 5 minutes. New assets served with correct Cache-Control headers. No stale content served post-invalidation.' },
            { id:'S07', title:'WAF SQL Injection Block', reg:'WAF', desc:'Send SQL injection payloads to banking API endpoints via ALB. WAF rules must detect and block: UNION SELECT, OR 1=1, DROP TABLE, and encoded variants. Validate legitimate requests pass through.', outcome:'All SQL injection attempts blocked with 403 response. WAF logs capture blocked requests with rule ID. Legitimate banking API requests unaffected. Zero false positives on test suite.' },
            { id:'S08', title:'KMS Key Rotation', reg:'KMS', desc:'Trigger automatic KMS CMK rotation for RDS encryption key. Validate that existing encrypted data remains accessible, new writes use new key material, and key rotation is logged in CloudTrail.', outcome:'Key rotation completes without downtime. Existing data decryptable with rotated key. New writes encrypted with new key material. CloudTrail logs key rotation event.' },
            { id:'S09', title:'Secrets Rotation (Vault/ESO)', reg:'ESO/Vault', desc:'Rotate database password in AWS Secrets Manager. External Secrets Operator syncs new secret to K8s. Application pods detect secret change and re-establish database connections without restart.', outcome:'Secret rotated in Secrets Manager. ESO syncs to K8s Secret within refreshInterval (1h configurable, test with 1m). Pods reconnect with new credentials. Zero downtime.' },
            { id:'S10', title:'Rolling Update Zero-Downtime', reg:'EKS', desc:'Deploy new version of account-service (v2.0 to v2.1) using rolling update strategy. maxSurge=1, maxUnavailable=0. Validate zero 5xx errors during rollout. ReadinessProbe must pass before traffic shifts.', outcome:'Rolling update completes in < 5 minutes. Zero 5xx errors during rollout. Old pods drained gracefully. New pods pass readiness probe before receiving traffic. Rollback possible within 30 seconds.' },
            { id:'S11', title:'Canary Release via Istio', reg:'Istio', desc:'Deploy payment-service canary (v2.1.0) alongside stable (v2.0.0). Route 5% traffic to canary. Monitor error rate and latency. If error rate > 1%, automated rollback triggers. If healthy, promote to 25/50/100%.', outcome:'5% traffic routed to canary. Istio metrics show canary performance. Automated promotion to 100% after 30-min observation with < 0.5% error rate. Rollback tested successfully on injected failure.' },
            { id:'S12', title:'HPA Tuning for Banking Workload', reg:'EKS/HPA', desc:'Configure HPA with multiple metrics (CPU, memory, custom RPS). Tune stabilization windows: scaleUp 30s, scaleDown 300s. Validate that HPA does not oscillate (flap) during gradual load increase.', outcome:'HPA scales smoothly without oscillation. ScaleUp responds within 30 seconds. ScaleDown waits 5 minutes after load decrease. Custom metric (RPS) drives scaling correctly.' },
            { id:'S13', title:'PDB During Node Drain', reg:'EKS/PDB', desc:'Drain a node running 3 payment-service pods. PodDisruptionBudget requires minAvailable=3 (of 5 total). Validate that only pods above PDB minimum are evicted. Node drain completes without service disruption.', outcome:'Node drain respects PDB. Maximum 2 pods evicted simultaneously. Service maintains 3 available pods at all times. Drain completes after replacement pods are ready on other nodes.' },
            { id:'S14', title:'Network Policy Isolation', reg:'EKS/NetworkPolicy', desc:'Validate that payment namespace pods can only receive traffic from platform namespace (api-gateway). Attempt direct access from loans namespace to payment pods. Verify egress restrictions to database only.', outcome:'Cross-namespace traffic from loans to payments blocked. Only api-gateway in platform namespace can reach payment pods. Egress limited to RDS and Redis endpoints. NetworkPolicy audit logs captured.' },
            { id:'S15', title:'EKS Cluster Upgrade (1.28 to 1.29)', reg:'EKS', desc:'Upgrade EKS cluster from 1.28 to 1.29. Validate control plane upgrade, managed node group rolling update, addon compatibility (CoreDNS, kube-proxy, vpc-cni), and zero application downtime during upgrade.', outcome:'Control plane upgrades in < 30 minutes. Node groups roll with PDB respect. All addons compatible and healthy. Zero application downtime. API deprecation warnings resolved.' },
            { id:'S16', title:'Terraform Drift Detection', reg:'Terraform', desc:'Introduce manual change to security group (add unauthorized ingress rule via console). Run terraform plan to detect drift. Validate drift is reported accurately. Run terraform apply to remediate drift.', outcome:'Terraform plan detects unauthorized security group change. Drift report shows exact diff. Terraform apply removes unauthorized rule and restores desired state. CloudTrail shows manual change actor.' },
            { id:'S17', title:'Lambda Concurrency Burst', reg:'Lambda', desc:'Send 1000 concurrent invocations to notification Lambda. Validate reserved concurrency (100) is respected. Excess invocations receive 429 throttle response. DLQ captures failed invocations for retry.', outcome:'100 concurrent executions honored. 900 invocations throttled (429). Throttled events routed to DLQ (SQS). DLQ consumer retries with exponential backoff. All 1000 notifications eventually delivered.' },
            { id:'S18', title:'Step Functions Timeout Handling', reg:'Step Functions', desc:'Trigger loan approval workflow with external service timeout. Credit check step exceeds 30-second timeout. Validate Step Functions catches TimeoutError, transitions to error handler, and notifies operations.', outcome:'Step Functions detects timeout after 30 seconds. Error handler state executes. Loan application status updated to PENDING_REVIEW. SNS notification sent to operations team. Workflow can be retried.' },
            { id:'S19', title:'Multi-Region Failover (Route53)', reg:'Route53/DR', desc:'Simulate primary region failure by failing Route53 health check. Validate automatic DNS failover to Azure DR region. Measure failover time, data consistency, and service restoration in DR.', outcome:'Route53 detects health check failure within 30 seconds. DNS failover to Azure within 60 seconds. Total RTO < 15 minutes. Data consistent to RPO < 5 minutes. DR services handle full traffic.' },
            { id:'S20', title:'Container Image Vulnerability Scan (Trivy)', reg:'Trivy/ECR', desc:'Push new container image to ECR. Trivy scans for CVEs (Critical, High, Medium). Images with Critical CVEs are blocked from deployment via OPA admission controller. Scan results published to Security Hub.', outcome:'Trivy scan completes in < 2 minutes. Critical CVE detected (test image with known vuln). OPA blocks deployment admission. Security Hub receives finding. Dev team notified via Slack webhook.' }
          ].map((s, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:700, textAlign:'center' }}>{s.id}</td>
              <td style={{ ...tdStyle, fontWeight:600, color:C.header, minWidth:200 }}>{s.title}</td>
              <td style={{ ...tdStyle, textAlign:'center' }}>{badge(
                s.reg.includes('Lambda') ? C.warn : s.reg.includes('RDS') ? C.info : s.reg.includes('WAF') ? C.danger : s.reg.includes('S3') ? C.success : s.reg.includes('Istio') ? C.info : s.reg.includes('DR') || s.reg.includes('Route53') ? C.danger : s.reg.includes('Terraform') ? C.warn : s.reg.includes('Trivy') ? C.danger : C.accent,
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
      <h2 style={sectionTitle}>Cloud Native Test Cases</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        20 detailed test cases covering infrastructure, security, performance, disaster recovery, and compliance testing for cloud native banking platform.
      </p>
      <div style={{ overflowX:'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, minWidth:80 }}>TC-ID</th>
              <th style={{ ...thStyle, minWidth:180 }}>Title</th>
              <th style={{ ...thStyle, minWidth:100 }}>Cloud Service</th>
              <th style={{ ...thStyle, minWidth:90 }}>Test Type</th>
              <th style={{ ...thStyle, minWidth:250 }}>Steps</th>
              <th style={{ ...thStyle, minWidth:200 }}>Expected Result</th>
              <th style={{ ...thStyle, minWidth:60 }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id:'TC-CN-001', title:'EKS Pod HPA Scale-Out', svc:'EKS / HPA', type:'Performance', steps:'1. Deploy payment-service with HPA (min=5, max=50)\n2. Run k6 load test ramping to 10000 RPS\n3. Monitor HPA scaling decisions\n4. Verify Karpenter provisions nodes\n5. Check P99 latency during scale-out\n6. Validate all requests served (no 5xx)', result:'Pods scale to 50 within 3 min. Nodes provisioned by Karpenter. P99 < 500ms. Zero 5xx errors during scale event.', pri:'P0' },
              { id:'TC-CN-002', title:'RDS Multi-AZ Failover', svc:'RDS PostgreSQL', type:'DR', steps:'1. Record current primary AZ\n2. Trigger failover (reboot with failover)\n3. Measure failover duration\n4. Verify app reconnects automatically\n5. Run data consistency check\n6. Validate read replicas re-sync', result:'Failover < 60s. App reconnects via PgBouncer. Zero data loss confirmed. Replicas synced within 5 min.', pri:'P0' },
              { id:'TC-CN-003', title:'Lambda Cold Start Measurement', svc:'Lambda', type:'Performance', steps:'1. Ensure Lambda has not been invoked for 15 min\n2. Invoke PDF generation function\n3. Measure cold start duration (init + exec)\n4. Invoke again immediately (warm)\n5. Compare cold vs warm latency\n6. Verify PDF output correctness', result:'Cold start < 3s (VPC-attached). Warm < 200ms. PDF contains correct banking data. CloudWatch metrics captured.', pri:'P0' },
              { id:'TC-CN-004', title:'WAF SQL Injection Protection', svc:'AWS WAF', type:'Security', steps:'1. Send UNION SELECT payload to /api/v1/accounts\n2. Send OR 1=1 payload to login endpoint\n3. Send URL-encoded injection attempt\n4. Send legitimate API request\n5. Check WAF logs for blocked requests\n6. Verify zero false positives', result:'All injection attempts blocked (403). Legitimate requests pass (200). WAF logs show rule match details. Zero false positives.', pri:'P0' },
              { id:'TC-CN-005', title:'Istio Canary Deployment', svc:'Istio / EKS', type:'Infrastructure', steps:'1. Deploy canary (v2.1) alongside stable (v2.0)\n2. Configure 5% traffic split\n3. Monitor canary error rate via Kiali\n4. Inject fault in canary\n5. Verify auto-rollback triggers\n6. Remove fault and promote to 100%', result:'5% traffic to canary confirmed. Error injection triggers rollback in < 2 min. Clean canary promoted to 100% successfully.', pri:'P0' },
              { id:'TC-CN-006', title:'S3 Cross-Region Replication', svc:'S3', type:'DR', steps:'1. Upload 1000 test documents to Mumbai bucket\n2. Verify SSE-KMS encryption on source\n3. Wait for replication to DR bucket\n4. Validate object count and checksums\n5. Verify encryption in DR bucket\n6. Check replication metrics', result:'All 1000 objects replicated within 15 min. Checksums match. KMS encryption maintained. Replication lag metrics in CloudWatch.', pri:'P0' },
              { id:'TC-CN-007', title:'Network Policy Enforcement', svc:'EKS / Calico', type:'Security', steps:'1. Deploy NetworkPolicy for payments namespace\n2. Attempt access from loans namespace\n3. Attempt access from platform namespace (allowed)\n4. Verify egress to RDS only\n5. Attempt egress to internet (blocked)\n6. Audit policy violation logs', result:'Cross-namespace access blocked from loans. Allowed from platform/api-gateway. Egress limited to RDS/Redis. Internet egress blocked.', pri:'P0' },
              { id:'TC-CN-008', title:'KMS Key Rotation', svc:'KMS', type:'Security', steps:'1. Enable auto-rotation for RDS CMK\n2. Trigger manual rotation\n3. Verify existing data still decryptable\n4. Insert new data and verify encryption\n5. Check CloudTrail for rotation event\n6. Validate key policy unchanged', result:'Rotation completes without downtime. Existing data accessible. New data uses new key material. CloudTrail event logged.', pri:'P0' },
              { id:'TC-CN-009', title:'Terraform Drift Detection', svc:'Terraform', type:'Compliance', steps:'1. Manually add SG rule via AWS Console\n2. Run terraform plan\n3. Verify drift detected in output\n4. Run terraform apply to remediate\n5. Confirm unauthorized rule removed\n6. Check CloudTrail for manual change', result:'Terraform detects SG drift accurately. Apply removes unauthorized rule. CloudTrail identifies who made manual change.', pri:'P0' },
              { id:'TC-CN-010', title:'Container Image Scan (Trivy)', svc:'Trivy / ECR', type:'Security', steps:'1. Build image with known vulnerable base\n2. Push to ECR\n3. Trivy scan triggers automatically\n4. Verify Critical CVE detected\n5. Attempt deployment (OPA blocks)\n6. Fix vulnerability and redeploy', result:'Trivy detects Critical CVE. OPA admission webhook blocks deployment. Security Hub finding created. Fixed image deploys successfully.', pri:'P0' },
              { id:'TC-CN-011', title:'GuardDuty Threat Detection', svc:'GuardDuty', type:'Security', steps:'1. Simulate port scan from EKS pod\n2. Simulate DNS exfiltration attempt\n3. Simulate crypto-mining pattern\n4. Check GuardDuty findings\n5. Verify SNS alert notification\n6. Validate auto-remediation Lambda', result:'GuardDuty generates findings for all 3 simulations. SNS alerts sent within 5 min. Auto-remediation isolates offending pod.', pri:'P1' },
              { id:'TC-CN-012', title:'Step Functions Loan Workflow', svc:'Step Functions', type:'Infrastructure', steps:'1. Submit loan application event\n2. Credit check step executes\n3. Underwriting step processes\n4. Approval decision made\n5. Disbursement step triggers\n6. Validate state machine execution', result:'All steps execute in order. State transitions logged. Timeout handling works. Failed step retries 3 times. Final state: DISBURSED.', pri:'P0' },
              { id:'TC-CN-013', title:'ElastiCache Redis Failover', svc:'ElastiCache', type:'DR', steps:'1. Identify current primary node\n2. Trigger failover test\n3. Measure failover duration\n4. Verify app reconnects\n5. Check session data preserved\n6. Validate cluster health', result:'Redis failover < 30s. App reconnects automatically. Session data preserved (AOF persistence). Cluster returns to healthy state.', pri:'P1' },
              { id:'TC-CN-014', title:'Rolling Update Zero Downtime', svc:'EKS', type:'Infrastructure', steps:'1. Deploy v2.0 of account-service\n2. Trigger rolling update to v2.1\n3. Monitor with continuous health check\n4. Verify maxUnavailable=0 honored\n5. Check readiness probe gating\n6. Count total errors during rollout', result:'Zero 5xx errors during rollout. Old pods drain gracefully (30s grace). New pods serve traffic only after readiness. Rollout < 5 min.', pri:'P0' },
              { id:'TC-CN-015', title:'PDB Enforcement During Drain', svc:'EKS / PDB', type:'Infrastructure', steps:'1. Set PDB minAvailable=3 for payment-svc\n2. Cordone and drain a node\n3. Verify drain respects PDB\n4. Check pod scheduling on other nodes\n5. Validate service availability\n6. Uncordon node after test', result:'Drain pauses when PDB would be violated. Max 2 pods evicted at once. Service maintains 3 available pods. Drain completes after rescheduling.', pri:'P1' },
              { id:'TC-CN-016', title:'EKS Cluster Upgrade', svc:'EKS', type:'Infrastructure', steps:'1. Backup cluster state (Velero)\n2. Upgrade control plane 1.28 to 1.29\n3. Upgrade managed node groups\n4. Verify addon compatibility\n5. Run full integration test suite\n6. Validate API deprecations handled', result:'Control plane upgrade < 30 min. Node group rolling update with PDB. All addons healthy. Zero app downtime. Tests pass.', pri:'P1' },
              { id:'TC-CN-017', title:'Route53 Multi-Region Failover', svc:'Route53', type:'DR', steps:'1. Verify primary health check passing\n2. Simulate primary failure (stop ALB)\n3. Route53 detects failure\n4. DNS failover to Azure DR\n5. Validate DR serves traffic\n6. Restore primary and failback', result:'Health check fails within 30s. DNS failover within 60s. DR handles full traffic. Total RTO < 15 min. Failback smooth.', pri:'P0' },
              { id:'TC-CN-018', title:'Secrets Rotation via ESO', svc:'ESO / Secrets Mgr', type:'Security', steps:'1. Rotate DB password in Secrets Manager\n2. ESO detects change (refreshInterval)\n3. K8s Secret updated automatically\n4. App pods reconnect with new creds\n5. Verify zero downtime\n6. Audit rotation in CloudTrail', result:'ESO syncs new secret within refresh interval. Pods reconnect without restart. Zero failed DB queries. CloudTrail audit complete.', pri:'P0' },
              { id:'TC-CN-019', title:'CloudWatch Alarm Triggering', svc:'CloudWatch', type:'Performance', steps:'1. Configure alarm: P99 > 1s for 3 periods\n2. Inject latency into payment service\n3. Verify alarm triggers\n4. Check SNS notification sent\n5. Verify PagerDuty incident created\n6. Clear latency and confirm alarm resolves', result:'Alarm triggers after 3 consecutive breaches (3 min). SNS notification < 30s. PagerDuty incident auto-created. Alarm resolves when latency drops.', pri:'P1' },
              { id:'TC-CN-020', title:'X-Ray Distributed Tracing', svc:'X-Ray', type:'Performance', steps:'1. Send request through full stack\n2. Verify trace spans: ALB -> EKS -> Service -> RDS\n3. Check trace propagation across services\n4. Identify bottleneck service\n5. Validate trace sampling rate\n6. Check X-Ray service map accuracy', result:'End-to-end trace captured with all spans. Trace ID propagated across 4 services. Bottleneck identified (>100ms). Service map shows correct topology.', pri:'P1' }
            ].map((tc, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
                <td style={{ ...tdStyle, color:C.accent, fontWeight:700, fontSize:12 }}>{tc.id}</td>
                <td style={{ ...tdStyle, fontWeight:600, color:C.header, fontSize:12 }}>{tc.title}</td>
                <td style={{ ...tdStyle, fontSize:11 }}>{badge(
                  tc.svc.includes('WAF') || tc.svc.includes('Trivy') || tc.svc.includes('Guard') || tc.svc.includes('KMS') || tc.svc.includes('ESO') ? C.danger : tc.svc.includes('Lambda') || tc.svc.includes('Terraform') || tc.svc.includes('Step') ? C.warn : tc.svc.includes('RDS') || tc.svc.includes('S3') || tc.svc.includes('Elasti') || tc.svc.includes('Route53') ? C.info : tc.svc.includes('CloudWatch') || tc.svc.includes('X-Ray') ? C.success : C.accent,
                  tc.svc
                )}</td>
                <td style={{ ...tdStyle, textAlign:'center', fontSize:11 }}>{badge(
                  tc.type === 'Security' ? C.danger : tc.type === 'DR' ? C.warn : tc.type === 'Performance' ? C.info : tc.type === 'Compliance' ? C.success : C.accent,
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
      <h2 style={sectionTitle}>C4 Model - Cloud Native Banking Platform</h2>

      <h3 style={subTitle}>Level 1: System Context</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                C4 MODEL - LEVEL 1: SYSTEM CONTEXT                        |
  +=========================================================================+

                         +-------------------+
                         |    Bank Customers  |
                         | (Retail/Corp/NRI)  |
                         +--------+----------+
                                  |
                         Mobile / Internet Banking
                                  |
                                  v
  +----------------+    +========================+    +-------------------+
  |  Regulators    |    |                        |    | External Systems  |
  |  - RBI         |<-->|  CLOUD NATIVE BANKING  |<-->|                   |
  |  - SEBI        |    |  PLATFORM (AWS/Azure)  |    | - NPCI (UPI)      |
  |  - IRDAI       |    |                        |    | - RBI (NEFT/RTGS) |
  +----------------+    | Microservices on EKS   |    | - SWIFT Network   |
                        | Serverless Functions   |    | - Card Networks   |
  +----------------+    | Multi-Region DR        |    |   (Visa/MC/RuPay) |
  |  DevOps Team   |<-->|                        |    | - UIDAI (KYC)     |
  |  - GitHub      |    +========================+    | - Credit Bureaus  |
  |  - ArgoCD      |               ^                  +-------------------+
  |  - Terraform   |               |
  +----------------+    +----------+----------+
                        |  Cloud Providers     |
                        |  - AWS (Primary)     |
                        |  - Azure (DR)        |
                        +---------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 2: Container Diagram</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                C4 MODEL - LEVEL 2: CONTAINERS                            |
  +=========================================================================+

  +-------------------------------------------------------------------------+
  |                    CLOUD NATIVE BANKING PLATFORM                         |
  |                                                                          |
  |  +------------------+  +------------------+  +---------------------+    |
  |  | Account Service  |  | Payment Service  |  | Loan Service        |    |
  |  | [EKS/Java]       |  | [EKS/Java]       |  | [EKS/Java]          |    |
  |  |                  |  |                  |  |                     |    |
  |  | - Account CRUD   |  | - NEFT/RTGS      |  | - Origination       |    |
  |  | - KYC workflow   |  | - UPI/IMPS       |  | - Approval engine   |    |
  |  | - Statements     |  | - Card processing|  | - EMI calculator    |    |
  |  | - Profile mgmt   |  | - Reconciliation |  | - Disbursement      |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------+  +---------------------+    |
  |  | Auth Service     |  | Notification Svc |  | Report Service      |    |
  |  | [EKS/Go]         |  | [Lambda/Python]  |  | [Lambda/Python]     |    |
  |  |                  |  |                  |  |                     |    |
  |  | - OAuth2/OIDC    |  | - SMS dispatch   |  | - PDF generation    |    |
  |  | - JWT tokens     |  | - Email dispatch |  | - Statement gen     |    |
  |  | - MFA            |  | - Push notify    |  | - Regulatory report |    |
  |  | - Session mgmt   |  | - Event-driven   |  | - Scheduled batch   |    |
  |  +------------------+  +------------------+  +---------------------+    |
  |                                                                          |
  |  +------------------+  +------------------------------------------+    |
  |  | API Gateway      |  | Workflow Engine                           |    |
  |  | [Kong/Istio]     |  | [Step Functions]                         |    |
  |  |                  |  |                                           |    |
  |  | - Rate limiting  |  | - Loan approval state machine            |    |
  |  | - Auth injection |  | - KYC verification workflow              |    |
  |  | - Request route  |  | - Account closure orchestration          |    |
  |  | - TLS terminate  |  | - Dispute resolution workflow            |    |
  |  +------------------+  +------------------------------------------+    |
  |                                                                          |
  |  +------------------------------------------------------------------+  |
  |  | Data Layer                                                        |  |
  |  | RDS PostgreSQL (OLTP)  | ElastiCache Redis (Cache/Session)       |  |
  |  | Amazon S3 (Documents)  | Amazon MSK Kafka (Event Streaming)      |  |
  |  | OpenSearch (Logs/Search)| DynamoDB (Config/Feature Flags)        |  |
  |  +------------------------------------------------------------------+  |
  +-------------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 3: Component Diagram (Payment Service)</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                C4 MODEL - LEVEL 3: COMPONENTS                            |
  +=========================================================================+

  Payment Service [Container] - Component Breakdown:

  +------------------------------------------------------------------+
  |                                                                    |
  |  +------------------+     +-------------------+                    |
  |  | PaymentController|---->| PaymentService     |                    |
  |  | - REST endpoints |     | - Business logic   |                    |
  |  | - Input validate |     | - Fee calculation  |                    |
  |  | - Auth check     |     | - Limit validation |                    |
  |  +------------------+     +--------+-----------+                    |
  |                                     |                               |
  |  +------------------+              v                               |
  |  | TransactionRepo  |     +-------------------+                    |
  |  | - CRUD ops       |<----| PaymentOrchestrator|                    |
  |  | - Query builder  |     | - NEFT flow        |                    |
  |  | - Pagination     |     | - RTGS flow        |                    |
  |  +------------------+     | - UPI flow         |                    |
  |                            | - Card flow        |                    |
  |  +------------------+     +--------+----------+                    |
  |  | NotificationPub  |              |                               |
  |  | - Kafka producer |              v                               |
  |  | - Event publish  |     +-------------------+                    |
  |  | - DLQ handling   |     | ReconciliationSvc  |                    |
  |  +------------------+     | - Settlement match |                    |
  |                            | - Exception handle |                    |
  |  +------------------+     | - Report generate  |                    |
  |  | ExternalGateway  |     +-------------------+                    |
  |  | - NPCI adapter   |                                              |
  |  | - SWIFT adapter  |                                              |
  |  | - Card network   |                                              |
  |  | - Retry + CB     |                                              |
  |  +------------------+                                              |
  +------------------------------------------------------------------+
`}</pre>

      <h3 style={sectionTitle}>Level 4: Code (Key Classes)</h3>
      <pre style={preStyle}>{`
  +=========================================================================+
  |                C4 MODEL - LEVEL 4: CODE                                  |
  +=========================================================================+

  class PaymentOrchestrator:
      def __init__(self, transaction_repo, notification_pub, external_gw, cache):
          self.repo = transaction_repo
          self.notifier = notification_pub
          self.gateway = external_gw
          self.cache = cache

      def process_neft(self, payment: NEFTPayment) -> TransactionResult:
          # Idempotency check
          existing = self.cache.get(f"idem:{payment.idempotency_key}")
          if existing:
              return existing

          # Validate limits
          self._validate_daily_limit(payment.source_account, payment.amount)

          # Create transaction record
          txn = self.repo.create(payment, status="INITIATED")

          # Submit to RBI NEFT system
          result = self.gateway.submit_neft(txn)
          txn = self.repo.update_status(txn.id, result.status)

          # Publish event for notification
          self.notifier.publish("payment.completed", txn.to_event())

          # Cache for idempotency (TTL 24h)
          self.cache.set(f"idem:{payment.idempotency_key}", txn, ttl=86400)
          return txn

  class KarpenterScaler:
      def __init__(self, k8s_client, metrics_client, config):
          self.k8s = k8s_client
          self.metrics = metrics_client
          self.config = config

      def evaluate_scaling(self) -> ScalingDecision:
          pending_pods = self.k8s.get_pending_pods()
          if not pending_pods:
              return ScalingDecision(action="NONE")

          required_resources = self._calculate_resources(pending_pods)
          instance_type = self._select_instance_type(required_resources)
          az = self._select_az_for_balance()

          return ScalingDecision(
              action="PROVISION",
              instance_type=instance_type,
              availability_zone=az,
              count=self._calculate_node_count(required_resources, instance_type)
          )

  class CanaryDeployment:
      def __init__(self, istio_client, metrics_client, config):
          self.istio = istio_client
          self.metrics = metrics_client
          self.error_threshold = config.CANARY_ERROR_THRESHOLD  # 0.01 (1%)

      def promote_canary(self, service: str, stages: list) -> DeployResult:
          for weight in stages:  # [5, 25, 50, 100]
              self.istio.set_traffic_split(service, canary_weight=weight)
              # Observe for configured duration
              metrics = self.metrics.observe(service, duration="5m")
              if metrics.error_rate > self.error_threshold:
                  self.istio.rollback(service)
                  return DeployResult(status="ROLLED_BACK", stage=weight)
          return DeployResult(status="PROMOTED", stage=100)
`}</pre>
    </div>
  );

  const renderTechStack = () => (
    <div>
      <h2 style={sectionTitle}>Technology Stack</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        Comprehensive technology stack for cloud native banking platform across AWS, Azure, Kubernetes, IaC, security, monitoring, and testing domains.
      </p>
      <div style={gridStyle}>
        {[
          { cat:'AWS Services', items:[
            { name:'Amazon EKS', desc:'Managed Kubernetes service for container orchestration', use:'Banking microservices orchestration (accounts, payments, loans)' },
            { name:'AWS Lambda', desc:'Serverless compute for event-driven functions', use:'PDF generation, notifications, reconciliation, S3 triggers' },
            { name:'Amazon RDS (PostgreSQL)', desc:'Managed relational database with Multi-AZ', use:'Primary OLTP database for banking transactions' },
            { name:'Amazon S3', desc:'Object storage with cross-region replication', use:'Document storage, statements, audit logs, backups' },
            { name:'Amazon SQS / MSK', desc:'Message queuing and Kafka-managed streaming', use:'Event streaming, async processing, DLQ for failures' },
            { name:'Amazon CloudFront', desc:'Global CDN for static assets and API caching', use:'Banking portal CDN, API response caching at edge' },
            { name:'AWS WAF + Shield', desc:'Web application firewall and DDoS protection', use:'SQL injection/XSS blocking, L3/L4/L7 DDoS mitigation' },
            { name:'AWS KMS + Secrets Manager', desc:'Key management and secrets rotation', use:'CMK for encryption at rest, automated secrets rotation' },
            { name:'Amazon GuardDuty', desc:'Intelligent threat detection service', use:'Threat detection, DNS anomaly, crypto-mining alerts' }
          ], color:C.accent },
          { cat:'Azure Services (DR)', items:[
            { name:'Azure AKS', desc:'Managed Kubernetes for disaster recovery cluster', use:'Warm standby cluster mirroring EKS configuration' },
            { name:'Azure Functions', desc:'Serverless compute for DR Lambda equivalents', use:'Standby functions activated during regional failover' },
            { name:'Azure Cosmos DB', desc:'Globally distributed database with multi-region writes', use:'Geo-replicated data store for cross-region consistency' }
          ], color:C.info },
          { cat:'Kubernetes Ecosystem', items:[
            { name:'Helm', desc:'Kubernetes package manager for chart-based deployments', use:'Standardized deployment packaging for all banking services' },
            { name:'ArgoCD', desc:'GitOps continuous deployment tool for Kubernetes', use:'Declarative GitOps deployment from Git to EKS/AKS' },
            { name:'Karpenter', desc:'Kubernetes node auto-provisioner by AWS', use:'Intelligent node provisioning for banking workload scaling' },
            { name:'Istio', desc:'Service mesh for traffic management, security, observability', use:'mTLS, canary deployments, circuit breaking, tracing' }
          ], color:C.success },
          { cat:'Infrastructure as Code', items:[
            { name:'Terraform', desc:'Multi-cloud infrastructure provisioning tool', use:'AWS/Azure infrastructure provisioning, state management, drift detection' },
            { name:'Pulumi', desc:'IaC using programming languages (Python, Go, TypeScript)', use:'Complex infrastructure logic, testing, multi-stack orchestration' }
          ], color:C.warn },
          { cat:'Security Tools', items:[
            { name:'Trivy', desc:'Container image and filesystem vulnerability scanner', use:'CI/CD image scanning, CVE detection, admission control' },
            { name:'Falco', desc:'Runtime security monitoring for Kubernetes', use:'Detect anomalous container behavior, syscall monitoring' },
            { name:'OPA / Gatekeeper', desc:'Policy engine for Kubernetes admission control', use:'Enforce pod security, image allowlist, resource limits' },
            { name:'HashiCorp Vault', desc:'Secrets management and encryption as a service', use:'Dynamic secrets, PKI certificates, encryption key management' }
          ], color:C.danger },
          { cat:'Monitoring & Observability', items:[
            { name:'Prometheus + Grafana', desc:'Metrics collection and visualization platform', use:'K8s metrics, custom dashboards, alerting rules' },
            { name:'Amazon CloudWatch', desc:'AWS-native monitoring, logging, and alerting', use:'AWS service metrics, log groups, composite alarms' },
            { name:'AWS X-Ray', desc:'Distributed tracing for microservices', use:'End-to-end request tracing, service map, latency analysis' }
          ], color:C.accent },
          { cat:'Testing Tools', items:[
            { name:'Terratest', desc:'Go library for testing Terraform infrastructure code', use:'Automated IaC testing, plan validation, drift testing' },
            { name:'k6', desc:'Modern load testing tool for performance validation', use:'API load testing, scalability testing, stress testing' },
            { name:'Chaos Toolkit', desc:'Chaos engineering framework for resilience testing', use:'Failure injection, DR drills, recovery validation' },
            { name:'LocalStack', desc:'Local AWS cloud emulator for development', use:'Local development and testing without AWS costs' }
          ], color:C.info }
        ].map((cat, i) => (
          <div key={i} style={{ ...cardStyle, gridColumn: 'span 1' }}>
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
          { title:'ADR-001: EKS over ECS for Container Orchestration', decision:'Use Amazon EKS (Kubernetes) instead of Amazon ECS (Fargate/EC2) for banking microservices.', rationale:'EKS provides Kubernetes-native features: Helm charts, Istio service mesh, Karpenter auto-provisioning, NetworkPolicy, and OPA/Gatekeeper. Avoids vendor lock-in with portable K8s manifests. Banking team has Kubernetes expertise. Multi-cloud DR with Azure AKS uses same manifests.', tradeoff:'Higher operational complexity vs ECS. EKS control plane cost ($0.10/hr). Steeper learning curve for K8s RBAC, networking. ECS Fargate would be simpler for serverless containers but lacks Istio/NetworkPolicy support.', color:C.accent },
          { title:'ADR-002: Terraform over CloudFormation for IaC', decision:'Use Terraform (with S3 backend) instead of AWS CloudFormation for infrastructure provisioning.', rationale:'Terraform supports multi-cloud (AWS primary + Azure DR) with single tool. HCL is more readable than CloudFormation YAML/JSON. Terraform has superior drift detection, state management, and module ecosystem. Team can manage AWS and Azure from unified workflow.', tradeoff:'No native AWS support (CloudFormation integrates deeper with AWS services). State file management complexity (S3 + DynamoDB locking). Terraform provider updates may lag behind new AWS features. CloudFormation has native rollback; Terraform does not.', color:C.warn },
          { title:'ADR-003: ArgoCD over FluxCD for GitOps', decision:'Use ArgoCD for GitOps-based continuous deployment to EKS clusters.', rationale:'ArgoCD provides a web UI for deployment visualization, application health monitoring, and manual sync/rollback. Supports ApplicationSet for multi-cluster deployment (EKS + AKS DR). Better ecosystem for Helm chart rendering and Kustomize overlays. Active community and CNCF graduated project.', tradeoff:'ArgoCD runs as a controller in-cluster (resource overhead). Flux is more lightweight and git-native. ArgoCD UI may encourage manual interventions vs pure GitOps. Need to secure ArgoCD dashboard access (SSO integration required).', color:C.info },
          { title:'ADR-004: Karpenter over Cluster Autoscaler', decision:'Use Karpenter instead of Kubernetes Cluster Autoscaler for node provisioning.', rationale:'Karpenter provisions nodes in seconds (vs minutes for CA). Selects optimal instance types based on pod requirements. Supports consolidation (bin-packing) to reduce costs. Native AWS integration for Spot instance handling. Better for bursty banking workloads (salary days).', tradeoff:'AWS-specific (not available on Azure AKS for DR cluster). Newer project with evolving API. Requires careful NodePool configuration to prevent over-provisioning. Cluster Autoscaler is more mature and cloud-agnostic.', color:C.success },
          { title:'ADR-005: Multi-Cloud DR (AWS+Azure) over Single-Cloud Multi-Region', decision:'Use Azure Central India as DR region instead of AWS ap-south-2 (Hyderabad).', rationale:'Multi-cloud DR protects against AWS-wide outages (rare but catastrophic for banking). RBI guidelines recommend avoiding single cloud provider dependency. Azure Central India provides India data residency compliance. Demonstrates regulatory commitment to business continuity.', tradeoff:'Significantly higher operational complexity (two cloud platforms). K8s manifest portability challenges (EKS vs AKS differences). Data replication across clouds is slower than within AWS. Team needs expertise in both AWS and Azure. Higher DR costs.', color:C.danger },
          { title:'ADR-006: RBI Cloud Compliance Architecture', decision:'Implement India-only data residency with approved cloud providers and mandatory security controls per RBI Cloud Framework.', rationale:'RBI mandates that all banking data must reside within India. Cloud providers must be on RBI approved list. Encryption with bank-managed keys (BYOK). Audit trails for all cloud operations. Regular VAPT and compliance assessments. Board-approved cloud policy required.', tradeoff:'Limits region choices to ap-south-1 (Mumbai) and India-based Azure regions. BYOK adds key management complexity. Compliance documentation overhead. Regular RBI reporting on cloud usage. May limit use of some global-only AWS services.', color:C.accent }
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

      <h3 style={sectionTitle}>Cloud Provider Comparison for Banking</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Criteria</th>
            <th style={thStyle}>AWS (Primary)</th>
            <th style={thStyle}>Azure (DR)</th>
            <th style={thStyle}>GCP (Evaluated)</th>
          </tr>
        </thead>
        <tbody>
          {[
            { criteria:'India Data Residency', aws:'Mumbai (ap-south-1), Hyderabad (ap-south-2)', azure:'Central India, South India, West India', gcp:'Mumbai (asia-south1), Delhi (asia-south2)' },
            { criteria:'RBI Approved', aws:'Yes - on RBI approved list', azure:'Yes - on RBI approved list', gcp:'Yes - on RBI approved list' },
            { criteria:'Managed Kubernetes', aws:'EKS (mature, IRSA, Karpenter)', azure:'AKS (mature, AAD integration)', gcp:'GKE (most advanced, Autopilot)' },
            { criteria:'Serverless', aws:'Lambda (mature, extensive triggers)', azure:'Functions (good, Durable Functions)', gcp:'Cloud Functions (good, Cloud Run)' },
            { criteria:'Managed Database', aws:'RDS Multi-AZ, Aurora (excellent)', azure:'Cosmos DB (global), SQL MI', gcp:'Cloud SQL, Spanner (global)' },
            { criteria:'Security Services', aws:'WAF, Shield, GuardDuty, Security Hub', azure:'WAF, DDoS Protect, Sentinel', gcp:'Cloud Armor, SCC, Chronicle' },
            { criteria:'Banking Adoption (India)', aws:'Highest - most Indian banks on AWS', azure:'Growing - strong enterprise presence', gcp:'Lower - niche banking adoption' },
            { criteria:'Cost (Estimated)', aws:'Baseline (normalized)', azure:'+10-15% vs AWS for similar setup', gcp:'+5-10% vs AWS, better sustained discount' }
          ].map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(78,204,163,0.05)' }}>
              <td style={{ ...tdStyle, color:C.accent, fontWeight:600, fontSize:13 }}>{r.criteria}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.aws}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.azure}</td>
              <td style={{ ...tdStyle, fontSize:13 }}>{r.gcp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFlowchart = () => (
    <div>
      <h2 style={sectionTitle}>Cloud Infrastructure Deployment Flowchart</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        End-to-end infrastructure deployment flow from Terraform provisioning through production readiness validation.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |       CLOUD INFRASTRUCTURE DEPLOYMENT - DETAILED FLOWCHART              |
  +=========================================================================+

                        +---------------------+
                        |  Terraform Init      |
                        |  - Backend (S3)      |
                        |  - Provider lock     |
                        |  - Module download   |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Terraform Plan      |
                        |  - Diff calculation  |
                        |  - Cost estimation   |
                        |  - Policy check (OPA)|
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Terraform Apply     |
                        |  - VPC + Subnets     |
                        |  - Security Groups   |
                        |  - NAT Gateway       |
                        |  - VPC Endpoints     |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  EKS Cluster Create  |
                        |  - Control plane     |
                        |  - Managed node group|
                        |  - IRSA config       |
                        |  - Encryption (KMS)  |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Install Istio       |
                        |  - istioctl install  |
                        |  - mTLS STRICT mode  |
                        |  - Ingress gateway   |
                        |  - Kiali dashboard   |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Deploy via ArgoCD   |
                        |  - ApplicationSet    |
                        |  - Helm charts       |
                        |  - Namespace creation|
                        |  - Secret sync (ESO) |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Configure HPA + PDB |
                        |  - HPA per service   |
                        |  - PDB minAvailable  |
                        |  - ResourceQuota     |
                        |  - LimitRange        |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Setup Monitoring    |
                        |  - Prometheus stack  |
                        |  - Grafana dashboards|
                        |  - CloudWatch alarms |
                        |  - X-Ray tracing     |
                        |  - PagerDuty integ   |
                        +----------+----------+
                                   |
                                   v
                        +---------------------+
                        |  Run Smoke Tests     |
                        |  - Health endpoints  |
                        |  - DB connectivity   |
                        |  - Cache connectivity|
                        |  - External API reach|
                        |  - mTLS validation   |
                        +----------+----------+
                                   |
                          +--------+--------+
                          |                 |
                          v                 v
                   +----------+      +----------+
                   | PASS     |      | FAIL     |
                   +----+-----+      +----+-----+
                        |                 |
                        |                 v
                        |          +------------+
                        |          | Rollback   |
                        |          | Alert Team |
                        |          | Fix & Retry|
                        |          +------------+
                        v
                +---------------------+
                |  Configure WAF       |
                |  - OWASP Core Rules  |
                |  - Rate Limiting     |
                |  - Geo Blocking      |
                |  - Bot Control       |
                +----------+----------+
                           |
                           v
                +---------------------+
                |  Setup CloudFront    |
                |  - Origin (ALB)      |
                |  - SSL Certificate   |
                |  - Cache Behaviors   |
                |  - Edge Functions    |
                +----------+----------+
                           |
                           v
                +---------------------+
                |  DNS Configuration   |
                |  - Route53 Records   |
                |  - Health Checks     |
                |  - Failover Routing  |
                |  - Certificate (ACM) |
                +----------+----------+
                           |
                           v
                +---------------------+
                |  Final Health Check  |
                |  - End-to-end flow   |
                |  - Performance test  |
                |  - Security scan     |
                |  - Compliance check  |
                +----------+----------+
                           |
                           v
                +---------------------+
                |  PRODUCTION READY    |
                |  - Green light       |
                |  - Monitoring active |
                |  - Alerts configured |
                |  - DR tested         |
                |  - Runbook published |
                +---------------------+
`}</pre>
    </div>
  );

  const renderSequenceDiagram = () => (
    <div>
      <h2 style={sectionTitle}>Sequence Diagram - CI/CD Deployment with Canary Release</h2>
      <p style={{ color:C.text, marginBottom:16, lineHeight:1.7 }}>
        End-to-end deployment flow showing developer commit through GitHub Actions CI, ArgoCD GitOps sync, EKS deployment with Istio canary release, and automated rollback on failure.
      </p>
      <pre style={preStyle}>{`
  +=========================================================================+
  |   SEQUENCE DIAGRAM: CI/CD DEPLOYMENT WITH CANARY & ROLLBACK             |
  +=========================================================================+

  Developer   GitHub      GitHub      ECR         ArgoCD      EKS         Istio       Banking    RDS         CloudWatch
              (Repo)      Actions     (Registry)              Cluster     (Mesh)      Pod        (Database)  (Monitor)
  |           |           |           |           |           |           |           |          |           |
  |  1. Push  |           |           |           |           |           |           |          |           |
  |  commit   |           |           |           |           |           |           |          |           |
  |---------->|           |           |           |           |           |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           | 2. Trigger|           |           |           |           |           |          |           |
  |           |    CI     |           |           |           |           |           |          |           |
  |           |---------->|           |           |           |           |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           | 3. Lint   |           |           |           |           |          |           |
  |           |           |    + Test |           |           |           |           |          |           |
  |           |           |    + SAST |           |           |           |           |          |           |
  |           |           |    (ruff, |           |           |           |           |          |           |
  |           |           |     pytest|           |           |           |           |          |           |
  |           |           |     bandit|           |           |           |           |          |           |
  |           |           |    )      |           |           |           |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           | 4. Build  |           |           |           |           |          |           |
  |           |           |    Docker |           |           |           |           |          |           |
  |           |           |    Image  |           |           |           |           |          |           |
  |           |           |---------->|           |           |           |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           | 5. Trivy  |           |           |           |           |          |           |
  |           |           |    Scan   |           |           |           |           |          |           |
  |           |           |    Image  |           |           |           |           |          |           |
  |           |           |---------->|           |           |           |           |          |           |
  |           |           |<----------|           |           |           |           |          |           |
  |           |           | (No Critical CVE)     |           |           |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           | 6. Push   |           |           |           |           |          |           |
  |           |           |    Image  |           |           |           |           |          |           |
  |           |           |---------->|           |           |           |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           | 7. Update |           |           |           |           |          |           |
  |           |           |    K8s    |           |           |           |           |          |           |
  |           |           |    manifests          |           |           |           |          |           |
  |           |           |---------->|           |           |           |           |          |           |
  |           |<----------|-----------|           |           |           |           |          |           |
  |           | (Git commit with new image tag)   |           |           |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           | 8. Detect |           |           |          |           |
  |           |           |           |           |    Git    |           |           |          |           |
  |           |           |           |           |    change |           |           |          |           |
  |           |           |           |           |<----------|           |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           | 9. Sync   |           |           |          |           |
  |           |           |           |           |    Apply  |           |           |          |           |
  |           |           |           |           |    manifests          |           |          |           |
  |           |           |           |           |---------->|           |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           |           | 10. Create|           |          |           |
  |           |           |           |           |           |     Canary|           |          |           |
  |           |           |           |           |           |     Pods  |           |          |           |
  |           |           |           |           |           |     (v2.1)|           |          |           |
  |           |           |           |           |           |---------->|           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           |           |           | 11. Route |          |           |
  |           |           |           |           |           |           |     5%    |          |           |
  |           |           |           |           |           |           |     traffic          |           |
  |           |           |           |           |           |           |     to    |          |           |
  |           |           |           |           |           |           |     canary|          |           |
  |           |           |           |           |           |           |---------->|          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           |           |           |           | 12. Serve|           |
  |           |           |           |           |           |           |           |    banking           |
  |           |           |           |           |           |           |           |    request           |
  |           |           |           |           |           |           |           |--------->|           |
  |           |           |           |           |           |           |           |<---------|           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           |           |           |           | 13. Emit |           |
  |           |           |           |           |           |           |           |    metrics           |
  |           |           |           |           |           |           |           |----------|---------->|
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           |           |           | 14. Check |          |           |
  |           |           |           |           |           |           |     error |          |           |
  |           |           |           |           |           |           |     rate  |          |           |
  |           |           |           |           |           |           |<----------|----------|           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |  [IF ERROR RATE < 1% - PROMOTE]  |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           |           |           | 15. Shift |          |           |
  |           |           |           |           |           |           |     to    |          |           |
  |           |           |           |           |           |           |     25%   |          |           |
  |           |           |           |           |           |           |     then  |          |           |
  |           |           |           |           |           |           |     50%   |          |           |
  |           |           |           |           |           |           |     then  |          |           |
  |           |           |           |           |           |           |     100%  |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           |           | 16. Scale |           |          |           |
  |           |           |           |           |           |     down  |           |          |           |
  |           |           |           |           |           |     stable|           |          |           |
  |           |           |           |           |           |     (v2.0)|           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           | 17. Sync  |           |           |          |           |
  |           |           |           |           |     status|           |           |          |           |
  |           |           |           |           |     HEALTHY           |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |  [IF ERROR RATE > 1% - ROLLBACK] |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           |           |           | 18. Route |          |           |
  |           |           |           |           |           |           |     100%  |          |           |
  |           |           |           |           |           |           |     back  |          |           |
  |           |           |           |           |           |           |     to    |          |           |
  |           |           |           |           |           |           |     stable|          |           |
  |           |           |           |           |           |           |     (v2.0)|          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           |           | 19. Delete|           |          |           |
  |           |           |           |           |           |     canary|           |          |           |
  |           |           |           |           |           |     pods  |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           | 20. Sync  |           |           |          |           |
  |           |           |           |           |     status|           |           |          |           |
  |           |           |           |           |     DEGRADED          |           |          |           |
  |           |           |           |           |     (rollback)        |           |          |           |
  |           |           |           |           |           |           |           |          |           |
  |           |           |           |           |           |           |           |          | 21. Alert |
  |           |           |           |           |           |           |           |          |    trigger|
  |           |           |           |           |           |           |           |          |---------->|
  |           |           |           |           |           |           |           |          |           |
  |  22.      |           |           |           |           |           |           |          |           |
  |  Notify   |           |           |           |           |           |           |          |           |
  |  (Slack/  |           |           |           |           |           |           |          |           |
  |   PagerDuty)          |           |           |           |           |           |          |           |
  |<..........|...........|...........|...........|...........|...........|...........|..........|...........|
  |           |           |           |           |           |           |           |          |           |


  LEGEND:
  ------>  Synchronous call
  <------  Synchronous response
  <......  Asynchronous notification
  [IF...]  Conditional branch
  ESO      External Secrets Operator
  ECR      Elastic Container Registry
  HPA      Horizontal Pod Autoscaler
`}</pre>

      <h3 style={sectionTitle}>Key Interaction Summary</h3>
      <div style={gridStyle}>
        {[
          { step:'Steps 1-3', title:'CI Pipeline (Build & Test)', desc:'Developer pushes code to GitHub. GitHub Actions triggers CI: lint (ruff), test (pytest), SAST (bandit). All quality gates must pass before image build.', color:C.accent },
          { step:'Steps 4-6', title:'Image Build & Security Scan', desc:'Docker image built, Trivy scans for CVEs. Critical vulnerabilities block the pipeline. Clean image pushed to ECR with immutable tag.', color:C.info },
          { step:'Steps 7-9', title:'GitOps Sync (ArgoCD)', desc:'CI updates K8s manifests with new image tag. ArgoCD detects Git change and syncs manifests to EKS cluster. Declarative desired state applied.', color:C.success },
          { step:'Steps 10-14', title:'Canary Deployment', desc:'New version deployed as canary alongside stable. Istio routes 5% traffic to canary. CloudWatch monitors error rate and latency metrics for canary pods.', color:C.warn },
          { step:'Steps 15-17', title:'Progressive Promotion', desc:'If error rate < 1% after observation period, traffic progressively shifted: 5% -> 25% -> 50% -> 100%. Old stable pods scaled down. ArgoCD reports HEALTHY.', color:C.accent },
          { step:'Steps 18-22', title:'Automated Rollback', desc:'If error rate exceeds 1%, Istio routes 100% traffic back to stable (v2.0). Canary pods deleted. CloudWatch alarm triggers. Team notified via Slack/PagerDuty.', color:C.danger }
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
            Cloud Native Testing Architecture
          </h1>
          <p style={{ color:C.muted, fontSize:15, lineHeight:1.6 }}>
            AWS/Azure | EKS/Kubernetes | Serverless | Containers | Multi-Region DR - Banking QA Testing Dashboard
          </p>
          <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
            {badge(C.accent, 'AWS EKS')}{badge(C.info, 'Azure AKS')}{badge(C.warn, 'Lambda')}{badge(C.success, 'Terraform')}{badge(C.danger, 'Istio')}{badge(C.accent, 'ArgoCD')}{badge(C.info, 'Karpenter')}{badge(C.warn, 'Multi-Region DR')}
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
          Cloud Native Testing Architecture | Banking QA Dashboard | AWS | EKS | Lambda | Terraform | Istio | ArgoCD | Multi-Region DR
        </div>
      </div>
    </div>
  );
}

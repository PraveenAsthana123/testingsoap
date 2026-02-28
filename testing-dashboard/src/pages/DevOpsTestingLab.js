import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12' };

const TABS = [
  { key:'CIPipeline', label:'CI Pipeline' },
  { key:'CDPipeline', label:'CD Pipeline' },
  { key:'ContainerRegistry', label:'Container/Registry' },
  { key:'IaC', label:'Infrastructure as Code' },
  { key:'MonitoringObs', label:'Monitoring' },
  { key:'ReleaseMgmt', label:'Release Mgmt' },
];
const DIFF = ['Beginner','Intermediate','Advanced'];
const DC = { Beginner:'#2ecc71', Intermediate:'#f39c12', Advanced:'#e74c3c' };
const TC = { CIPipeline:'#e74c3c', CDPipeline:'#3498db', ContainerRegistry:'#9b59b6', IaC:'#2ecc71', MonitoringObs:'#e67e22', ReleaseMgmt:'#1abc9c' };

const S = [
  {id:'DO-001',title:'Jenkins Pipeline Validation',layer:'CIPipeline',framework:'Jenkins / Groovy',language:'Groovy',difficulty:'Intermediate',
   description:'Validates a Jenkins declarative pipeline including stage execution order, parallel stage handling, post-build actions, and artifact archival for a multi-module banking application build.',
   prerequisites:'Jenkins 2.400+, Pipeline plugin, Docker agent configured, Artifactory credentials',
   config:'JENKINS_URL=https://jenkins.devops.local:8443\nPIPELINE_NAME=banking-core-build\nARTIFACTORY_URL=https://artifactory.devops.local/repo\nDOCKER_REGISTRY=registry.devops.local:5000\nBUILD_TIMEOUT=30',
   code:`// Jenkinsfile - Declarative Pipeline Validation
pipeline {
    agent { docker { image 'maven:3.9-eclipse-temurin-17' } }
    environment {
        ARTIFACTORY_CREDS = credentials('artifactory-deployer')
        APP_VERSION = "\\\${env.BUILD_NUMBER}-\\\${env.GIT_COMMIT[0..7]}"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "Commit: \\\${GIT_COMMIT}"'
            }
        }
        stage('Build & Unit Test') {
            steps {
                sh 'mvn clean verify -DskipITs'
                junit '**/target/surefire-reports/*.xml'
            }
        }
        stage('Integration Tests') {
            steps {
                sh 'mvn verify -DskipUTs -Pintegration'
                junit '**/target/failsafe-reports/*.xml'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh 'mvn sonar:sonar -Dsonar.branch.name=\\\${BRANCH_NAME}'
                }
            }
        }
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: '**/target/*.jar'
                sh 'curl -u \\\${ARTIFACTORY_CREDS} -T target/app.jar \\\${ARTIFACTORY_URL}/banking-core/\\\${APP_VERSION}/'
            }
        }
    }
    post {
        failure { emailext subject: "Build FAILED: \\\${JOB_NAME}", to: 'devops@bank.local' }
        success { slackSend channel: '#builds', message: "Build \\\${APP_VERSION} passed" }
    }
}`,
   expectedOutput:`[TEST] DO-001: Jenkins Pipeline Validation
[INFO] Pipeline: banking-core-build (declarative)
[PASS] Stage 'Checkout': SCM checkout completed, commit SHA resolved
[PASS] Stage 'Build & Unit Test': mvn verify passed, 142 tests green
[PASS] Stage 'Integration Tests': 38 integration tests passed
[PASS] Stage 'SonarQube Analysis': quality gate PASSED
[PASS] Stage 'Archive Artifacts': JAR uploaded to Artifactory
[INFO] Artifact: banking-core/87-a3f7c2d1/app.jar (24.3 MB)
[PASS] Post-success: Slack notification sent to #builds
[PASS] Pipeline completed in 4m 32s — all stages green
[INFO] Build version: 87-a3f7c2d1
───────────────────────────────────
DO-001: Jenkins Pipeline — 7 passed, 0 failed`},

  {id:'DO-002',title:'GitHub Actions Workflow Testing',layer:'CIPipeline',framework:'GitHub Actions / YAML',language:'YAML',difficulty:'Beginner',
   description:'Validates a GitHub Actions CI workflow including matrix strategy builds, caching, artifact uploads, and status check enforcement for a Python microservice.',
   prerequisites:'GitHub repository, Actions enabled, Python 3.11/3.12, pip cache configured',
   config:'REPO=bank-org/payment-service\nRUNNERS=ubuntu-latest\nPYTHON_VERSIONS=3.11,3.12\nCACHE_KEY_PREFIX=pip-deps\nCOVERAGE_THRESHOLD=80',
   code:`# .github/workflows/ci.yml - CI Workflow Validation
name: Payment Service CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install ruff black mypy
      - run: ruff check src/
      - run: black --check src/
      - run: mypy src/ --ignore-missing-imports

  test:
    needs: lint
    strategy:
      matrix:
        python-version: ['3.11', '3.12']
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \\\${{ matrix.python-version }}
          cache: 'pip'
      - run: pip install -r requirements.txt -r requirements-dev.txt
      - run: pytest --cov=src --cov-fail-under=80 --junitxml=results.xml
      - uses: actions/upload-artifact@v4
        with:
          name: test-results-\\\${{ matrix.python-version }}
          path: results.xml`,
   expectedOutput:`[TEST] DO-002: GitHub Actions Workflow Testing
[INFO] Workflow: Payment Service CI (push to main/develop)
[PASS] Job 'lint': ruff check passed — 0 violations
[PASS] Job 'lint': black format check passed
[PASS] Job 'lint': mypy type check passed
[PASS] Job 'test' (Python 3.11): 96 tests passed, coverage 87%
[PASS] Job 'test' (Python 3.12): 96 tests passed, coverage 87%
[PASS] Cache: pip dependencies restored from cache (hit)
[PASS] Artifacts: test-results-3.11.xml uploaded (12 KB)
[PASS] Artifacts: test-results-3.12.xml uploaded (12 KB)
[INFO] Matrix strategy: 2/2 combinations passed
───────────────────────────────────
DO-002: GitHub Actions — 8 passed, 0 failed`},

  {id:'DO-003',title:'Blue-Green Deployment Validation',layer:'CDPipeline',framework:'Shell / Kubernetes',language:'Shell',difficulty:'Advanced',
   description:'Validates blue-green deployment strategy including traffic switching, health verification, rollback capability, and zero-downtime cutover for a banking API gateway.',
   prerequisites:'Kubernetes cluster, kubectl configured, Ingress controller, Two deployment slots (blue/green)',
   config:'K8S_NAMESPACE=banking-prod\nSERVICE_NAME=api-gateway\nBLUE_DEPLOY=api-gateway-blue\nGREEN_DEPLOY=api-gateway-green\nHEALTH_ENDPOINT=/api/health\nSWITCH_TIMEOUT=120',
   code:`#!/bin/bash
# Blue-Green Deployment Validation Script
set -euo pipefail

NAMESPACE="banking-prod"
SERVICE="api-gateway"
BLUE="api-gateway-blue"
GREEN="api-gateway-green"
HEALTH="/api/health"
NEW_IMAGE="registry.devops.local:5000/api-gateway:v2.4.1"

echo "[DEPLOY] Starting blue-green deployment validation"

# Step 1: Identify active slot
ACTIVE_SLOT=\$(kubectl get svc \$SERVICE -n \$NAMESPACE -o jsonpath='{.spec.selector.slot}')
if [ "\$ACTIVE_SLOT" = "blue" ]; then TARGET=\$GREEN; TARGET_SLOT="green"
else TARGET=\$BLUE; TARGET_SLOT="blue"; fi
echo "[INFO] Active: \$ACTIVE_SLOT | Target: \$TARGET_SLOT"

# Step 2: Deploy new version to inactive slot
kubectl set image deployment/\$TARGET app=\$NEW_IMAGE -n \$NAMESPACE
kubectl rollout status deployment/\$TARGET -n \$NAMESPACE --timeout=120s

# Step 3: Health check on inactive slot
for i in \$(seq 1 10); do
    STATUS=\$(kubectl exec -n \$NAMESPACE deploy/\$TARGET -- curl -s -o /dev/null -w '%{http_code}' localhost:8080\$HEALTH)
    if [ "\$STATUS" = "200" ]; then echo "[PASS] Health check \$i/10: OK"; break; fi
    if [ "\$i" -eq 10 ]; then echo "[FAIL] Health checks exhausted"; exit 1; fi
    sleep 5
done

# Step 4: Switch traffic
kubectl patch svc \$SERVICE -n \$NAMESPACE -p "{\\\"spec\\\":{\\\"selector\\\":{\\\"slot\\\":\\\""\$TARGET_SLOT"\\\"}}}"
echo "[PASS] Traffic switched to \$TARGET_SLOT"

# Step 5: Verify production traffic
PROD_STATUS=\$(curl -s -o /dev/null -w '%{http_code}' https://api.bank.local\$HEALTH)
echo "[INFO] Production health: \$PROD_STATUS"`,
   expectedOutput:`[TEST] DO-003: Blue-Green Deployment Validation
[INFO] Active slot: blue | Target slot: green
[PASS] New image deployed to green: api-gateway:v2.4.1
[PASS] Rollout status: deployment/api-gateway-green successfully rolled out
[PASS] Health check 1/10: OK (HTTP 200)
[PASS] Traffic switched from blue to green
[PASS] Production endpoint healthy: HTTP 200
[INFO] Zero-downtime cutover verified — no 5xx during switch
[PASS] Old slot (blue) retained for rollback
[INFO] Rollback command: kubectl patch svc api-gateway -p '{"spec":{"selector":{"slot":"blue"}}}'
[PASS] Blue-green deployment completed in 47 seconds
───────────────────────────────────
DO-003: Blue-Green Deployment — 6 passed, 0 failed`},

  {id:'DO-004',title:'Canary Release Pipeline',layer:'CDPipeline',framework:'Shell / Istio',language:'Shell',difficulty:'Advanced',
   description:'Validates canary release pipeline with progressive traffic shifting using Istio service mesh, automated rollback on error rate threshold, and metric-based promotion.',
   prerequisites:'Kubernetes with Istio service mesh, Prometheus for metrics, Flagger or custom canary controller',
   config:'K8S_NAMESPACE=banking-prod\nCANARY_SERVICE=payment-engine\nISTIO_GATEWAY=banking-gateway\nPROMETHEUS_URL=http://prometheus.monitoring:9090\nERROR_THRESHOLD=1.0\nLATENCY_THRESHOLD_MS=500',
   code:`#!/bin/bash
# Canary Release Pipeline Validation
set -euo pipefail

NAMESPACE="banking-prod"
SERVICE="payment-engine"
CANARY_IMAGE="registry.devops.local:5000/payment-engine:v3.1.0"
PROM="http://prometheus.monitoring:9090"
ERROR_THRESHOLD=1.0
WEIGHTS=(10 25 50 75 100)

echo "[CANARY] Starting canary release for \$SERVICE"

# Step 1: Deploy canary with 0% traffic
kubectl set image deployment/\\\${SERVICE}-canary app=\$CANARY_IMAGE -n \$NAMESPACE
kubectl rollout status deployment/\\\${SERVICE}-canary -n \$NAMESPACE --timeout=90s

# Step 2: Progressive traffic shift
for WEIGHT in "\\\${WEIGHTS[@]}"; do
    echo "[INFO] Setting canary weight to \\\${WEIGHT}%"
    kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: \$SERVICE
  namespace: \$NAMESPACE
spec:
  hosts: ["\$SERVICE"]
  http:
  - route:
    - destination: { host: "\$SERVICE", subset: stable }
      weight: \$((100 - WEIGHT))
    - destination: { host: "\$SERVICE", subset: canary }
      weight: \$WEIGHT
EOF
    sleep 30

    # Step 3: Check error rate from Prometheus
    ERROR_RATE=\$(curl -s "\$PROM/api/v1/query?query=rate(http_requests_total{service=\\\"payment-engine\\\",status=~\\\"5..\\\"}[1m])" | jq '.data.result[0].value[1] // "0"' -r)
    if (( \$(echo "\$ERROR_RATE > \$ERROR_THRESHOLD" | bc -l) )); then
        echo "[FAIL] Error rate \\\${ERROR_RATE}% exceeds threshold \\\${ERROR_THRESHOLD}%"
        echo "[ROLLBACK] Reverting canary to 0% traffic"
        exit 1
    fi
    echo "[PASS] Canary at \\\${WEIGHT}%: error rate \\\${ERROR_RATE}% within threshold"
done

echo "[PASS] Canary promoted to 100% — stable version updated"`,
   expectedOutput:`[TEST] DO-004: Canary Release Pipeline
[INFO] Canary image: payment-engine:v3.1.0
[PASS] Canary deployment rolled out successfully
[INFO] Setting canary weight to 10%
[PASS] Canary at 10%: error rate 0.02% within threshold (< 1.0%)
[INFO] Setting canary weight to 25%
[PASS] Canary at 25%: error rate 0.05% within threshold
[INFO] Setting canary weight to 50%
[PASS] Canary at 50%: error rate 0.08% within threshold
[INFO] Setting canary weight to 75%
[PASS] Canary at 75%: error rate 0.12% within threshold
[INFO] Setting canary weight to 100%
[PASS] Canary at 100%: error rate 0.11% within threshold
[PASS] Canary promoted to stable — full traffic on v3.1.0
───────────────────────────────────
DO-004: Canary Release — 7 passed, 0 failed`},

  {id:'DO-005',title:'Docker Image Security Scanning',layer:'ContainerRegistry',framework:'Trivy / Shell',language:'Shell',difficulty:'Intermediate',
   description:'Validates Docker image security scanning pipeline using Trivy for vulnerability detection, Dockerfile best practices, license compliance, and secret detection in container layers.',
   prerequisites:'Trivy CLI installed, Docker daemon running, Container registry access, Policy definitions',
   config:'REGISTRY=registry.devops.local:5000\nIMAGE_NAME=banking-api\nIMAGE_TAG=v2.4.1\nSEVERITY_THRESHOLD=HIGH\nTRIVY_DB_URL=https://ghcr.io/aquasecurity/trivy-db\nMAX_CRITICAL=0\nMAX_HIGH=5',
   code:`#!/bin/bash
# Docker Image Security Scanning Pipeline
set -euo pipefail

REGISTRY="registry.devops.local:5000"
IMAGE="\$REGISTRY/banking-api:v2.4.1"
MAX_CRITICAL=0
MAX_HIGH=5
REPORT_DIR="./security-reports"

mkdir -p \$REPORT_DIR
echo "[SCAN] Starting security scan for \$IMAGE"

# Step 1: Pull and scan for OS/library vulnerabilities
trivy image --severity HIGH,CRITICAL --format json \\
    --output \$REPORT_DIR/vuln-report.json \$IMAGE
CRITICAL=\$(jq '[.Results[].Vulnerabilities[]? | select(.Severity=="CRITICAL")] | length' \$REPORT_DIR/vuln-report.json)
HIGH=\$(jq '[.Results[].Vulnerabilities[]? | select(.Severity=="HIGH")] | length' \$REPORT_DIR/vuln-report.json)
echo "[INFO] Found: \$CRITICAL critical, \$HIGH high vulnerabilities"

# Step 2: Dockerfile best practices
trivy config --severity HIGH,CRITICAL --format json \\
    --output \$REPORT_DIR/config-report.json ./Dockerfile
CONFIG_ISSUES=\$(jq '.Results[].Misconfigurations | length' \$REPORT_DIR/config-report.json)
echo "[INFO] Dockerfile issues: \$CONFIG_ISSUES"

# Step 3: Secret detection in layers
trivy image --scanners secret --format json \\
    --output \$REPORT_DIR/secret-report.json \$IMAGE
SECRETS=\$(jq '[.Results[].Secrets[]?] | length' \$REPORT_DIR/secret-report.json)

# Step 4: License compliance
trivy image --scanners license --format json \\
    --output \$REPORT_DIR/license-report.json \$IMAGE

# Step 5: Gate check
if [ "\$CRITICAL" -gt "\$MAX_CRITICAL" ]; then
    echo "[FAIL] Critical vulnerabilities (\$CRITICAL) exceed threshold (\$MAX_CRITICAL)"
    exit 1
fi
if [ "\$HIGH" -gt "\$MAX_HIGH" ]; then
    echo "[FAIL] High vulnerabilities (\$HIGH) exceed threshold (\$MAX_HIGH)"
    exit 1
fi
if [ "\$SECRETS" -gt 0 ]; then
    echo "[FAIL] Secrets detected in image layers: \$SECRETS"
    exit 1
fi
echo "[PASS] All security gates passed"`,
   expectedOutput:`[TEST] DO-005: Docker Image Security Scanning
[INFO] Image: registry.devops.local:5000/banking-api:v2.4.1
[PASS] Vulnerability scan: 0 critical, 3 high (threshold: 0/5)
[INFO] Medium: 12, Low: 27 (informational, not gated)
[PASS] Dockerfile best practices: 0 misconfigurations
[PASS] Secret detection: 0 secrets found in image layers
[PASS] License compliance: all licenses OSI-approved
[INFO] Base image: eclipse-temurin:17-jre-alpine (up to date)
[PASS] Security gate: PASSED — all thresholds within limits
[INFO] Reports: vuln-report.json, config-report.json, secret-report.json
[PASS] Image approved for deployment to staging
───────────────────────────────────
DO-005: Docker Security Scan — 6 passed, 0 failed`},

  {id:'DO-006',title:'Helm Chart Deployment Testing',layer:'ContainerRegistry',framework:'Helm / Shell',language:'Shell',difficulty:'Intermediate',
   description:'Validates Helm chart deployment including template rendering, values override testing, upgrade/rollback lifecycle, and release health verification for banking microservices.',
   prerequisites:'Helm 3.x, Kubernetes cluster, Chart repository configured, Namespace provisioned',
   config:'HELM_REPO=https://charts.devops.local\nCHART_NAME=banking-service\nCHART_VERSION=1.8.0\nRELEASE_NAME=payment-svc\nNAMESPACE=banking-staging\nVALUES_FILE=values-staging.yaml',
   code:`#!/bin/bash
# Helm Chart Deployment Testing
set -euo pipefail

CHART="banking-service"
VERSION="1.8.0"
RELEASE="payment-svc"
NS="banking-staging"
VALUES="values-staging.yaml"

echo "[HELM] Testing chart \$CHART v\$VERSION"

# Step 1: Lint chart
helm lint ./charts/\$CHART --strict --values \$VALUES
echo "[PASS] Chart lint: no issues"

# Step 2: Template rendering validation
helm template \$RELEASE ./charts/\$CHART --values \$VALUES \\
    --namespace \$NS > /tmp/rendered.yaml
RESOURCES=\$(grep -c "^kind:" /tmp/rendered.yaml)
echo "[INFO] Rendered \$RESOURCES Kubernetes resources"

# Step 3: Dry-run install
helm install \$RELEASE ./charts/\$CHART --values \$VALUES \\
    --namespace \$NS --dry-run --debug 2>&1 | tail -5
echo "[PASS] Dry-run install successful"

# Step 4: Actual install
helm install \$RELEASE ./charts/\$CHART --values \$VALUES \\
    --namespace \$NS --wait --timeout 120s
echo "[PASS] Release \$RELEASE installed"

# Step 5: Verify pods are running
kubectl get pods -n \$NS -l app.kubernetes.io/instance=\$RELEASE \\
    -o jsonpath='{range .items[*]}{.metadata.name}{" "}{.status.phase}{"\\n"}{end}'

# Step 6: Test upgrade
helm upgrade \$RELEASE ./charts/\$CHART --values \$VALUES \\
    --namespace \$NS --set image.tag=v2.5.0 --wait --timeout 120s
echo "[PASS] Upgrade to v2.5.0 completed"

# Step 7: Test rollback
helm rollback \$RELEASE 1 --namespace \$NS --wait --timeout 60s
REVISION=\$(helm history \$RELEASE -n \$NS --max 1 -o json | jq '.[0].revision')
echo "[PASS] Rollback to revision 1 complete (current: \$REVISION)"`,
   expectedOutput:`[TEST] DO-006: Helm Chart Deployment Testing
[INFO] Chart: banking-service v1.8.0
[PASS] Helm lint: 0 warnings, 0 errors (strict mode)
[PASS] Template rendering: 8 Kubernetes resources generated
[PASS] Dry-run install: no validation errors
[PASS] Release payment-svc installed in banking-staging
[INFO] Pods: payment-svc-7b9f4d-abc12 Running, payment-svc-7b9f4d-def34 Running
[PASS] Upgrade to v2.5.0: rolling update completed
[PASS] Rollback to revision 1: successful (revision 3 current)
[INFO] Release history: install -> upgrade -> rollback
[PASS] Helm lifecycle complete — install, upgrade, rollback verified
───────────────────────────────────
DO-006: Helm Chart Testing — 7 passed, 0 failed`},

  {id:'DO-007',title:'Terraform Infrastructure Validation',layer:'IaC',framework:'Terraform / Python',language:'Python',difficulty:'Intermediate',
   description:'Validates Terraform infrastructure-as-code including plan verification, resource drift detection, state consistency checks, and policy compliance using Checkov for banking cloud infrastructure.',
   prerequisites:'Terraform 1.6+, AWS credentials configured, Checkov installed, S3 backend for state',
   config:'TF_DIR=./infra/environments/staging\nTF_STATE_BUCKET=bank-tf-state-staging\nAWS_REGION=ap-south-1\nCHECKOV_FRAMEWORK=terraform\nMAX_POLICY_FAILURES=0',
   code:`import subprocess
import json
import unittest

class TestTerraformValidation(unittest.TestCase):
    TF_DIR = "./infra/environments/staging"
    STATE_BUCKET = "bank-tf-state-staging"

    def run_tf(self, *args):
        result = subprocess.run(
            ["terraform"] + list(args),
            cwd=self.TF_DIR, capture_output=True, text=True, timeout=300
        )
        return result

    def test_terraform_init(self):
        """Validate Terraform initialization"""
        result = self.run_tf("init", "-backend=true",
            "-backend-config=bucket=" + self.STATE_BUCKET)
        self.assertEqual(result.returncode, 0,
            f"Init failed: {result.stderr}")

    def test_terraform_validate(self):
        """Validate HCL syntax and config"""
        result = self.run_tf("validate", "-json")
        output = json.loads(result.stdout)
        self.assertTrue(output["valid"],
            f"Validation errors: {output.get('diagnostics', [])}")

    def test_terraform_plan(self):
        """Run plan and check for expected changes"""
        result = self.run_tf("plan", "-out=tfplan", "-json")
        self.assertEqual(result.returncode, 0, "Plan failed")
        show = self.run_tf("show", "-json", "tfplan")
        plan = json.loads(show.stdout)
        changes = plan["resource_changes"]
        creates = [c for c in changes if "create" in c["change"]["actions"]]
        destroys = [c for c in changes if "delete" in c["change"]["actions"]]
        self.assertEqual(len(destroys), 0,
            f"Unexpected destroys: {[d['address'] for d in destroys]}")

    def test_checkov_policy_scan(self):
        """Run Checkov IaC policy scan"""
        result = subprocess.run(
            ["checkov", "-d", self.TF_DIR, "--framework", "terraform",
             "--output", "json", "--soft-fail"],
            capture_output=True, text=True, timeout=120
        )
        output = json.loads(result.stdout)
        failed = output.get("results", {}).get("failed_checks", [])
        critical = [f for f in failed if f.get("severity") == "CRITICAL"]
        self.assertEqual(len(critical), 0,
            f"Critical policy failures: {[c['check_id'] for c in critical]}")`,
   expectedOutput:`[TEST] DO-007: Terraform Infrastructure Validation
[INFO] Working directory: ./infra/environments/staging
[PASS] Terraform init: backend configured (S3: bank-tf-state-staging)
[PASS] Terraform validate: HCL syntax and config valid
[PASS] Terraform plan: 4 to create, 2 to update, 0 to destroy
[INFO] Resources: aws_ecs_service, aws_lb_target_group, aws_security_group, aws_cloudwatch_alarm
[PASS] No unexpected resource deletions in plan
[PASS] Checkov policy scan: 42 passed, 0 critical failures
[INFO] Policies: CKV_AWS_23 (SG rules), CKV_AWS_18 (S3 logging) — all passed
[PASS] State lock verified: DynamoDB lock table accessible
[INFO] Terraform version: 1.6.4, provider: aws 5.31.0
───────────────────────────────────
DO-007: Terraform Validation — 6 passed, 0 failed`},

  {id:'DO-008',title:'Ansible Playbook Execution Testing',layer:'IaC',framework:'Ansible / Python',language:'Python',difficulty:'Intermediate',
   description:'Validates Ansible playbook execution including syntax checking, dry-run mode, idempotency verification, and configuration drift detection for banking server fleet management.',
   prerequisites:'Ansible 2.15+, SSH access to target hosts, Ansible vault configured, Inventory file',
   config:'INVENTORY=./inventories/staging/hosts.yml\nPLAYBOOK=./playbooks/app-server-setup.yml\nVAULT_PASSWORD_FILE=~/.ansible/vault_pass\nSSH_KEY=~/.ssh/deploy_key\nTIMEOUT=60',
   code:`import subprocess
import json
import unittest

class TestAnsiblePlaybook(unittest.TestCase):
    INVENTORY = "./inventories/staging/hosts.yml"
    PLAYBOOK = "./playbooks/app-server-setup.yml"
    VAULT_PASS = "~/.ansible/vault_pass"

    def run_ansible(self, *extra_args):
        cmd = [
            "ansible-playbook", self.PLAYBOOK,
            "-i", self.INVENTORY,
            "--vault-password-file", self.VAULT_PASS,
        ] + list(extra_args)
        result = subprocess.run(
            cmd, capture_output=True, text=True, timeout=300
        )
        return result

    def test_syntax_check(self):
        """Validate playbook syntax"""
        result = self.run_ansible("--syntax-check")
        self.assertEqual(result.returncode, 0,
            f"Syntax error: {result.stderr}")
        self.assertIn("playbook: " + self.PLAYBOOK, result.stdout)

    def test_dry_run(self):
        """Execute in check mode (dry-run)"""
        result = self.run_ansible("--check", "--diff")
        self.assertEqual(result.returncode, 0,
            f"Check mode failed: {result.stderr}")
        self.assertNotIn("fatal", result.stdout.lower())

    def test_idempotency(self):
        """Run twice and verify zero changes on second run"""
        first_run = self.run_ansible()
        self.assertEqual(first_run.returncode, 0, "First run failed")
        second_run = self.run_ansible()
        self.assertEqual(second_run.returncode, 0, "Second run failed")
        self.assertIn("changed=0", second_run.stdout,
            "Playbook is not idempotent: changes on second run")

    def test_host_reachability(self):
        """Verify all inventory hosts are reachable"""
        result = subprocess.run(
            ["ansible", "all", "-i", self.INVENTORY, "-m", "ping",
             "--vault-password-file", self.VAULT_PASS],
            capture_output=True, text=True, timeout=60
        )
        self.assertEqual(result.returncode, 0,
            f"Unreachable hosts: {result.stderr}")
        self.assertNotIn("UNREACHABLE", result.stdout)`,
   expectedOutput:`[TEST] DO-008: Ansible Playbook Execution Testing
[INFO] Playbook: app-server-setup.yml | Inventory: staging
[PASS] Syntax check: playbook parsed successfully
[PASS] Dry-run (check mode): no fatal errors, 6 changes predicted
[INFO] Changes: package install, config template, service restart
[PASS] First execution: 12 tasks, 6 changed, 0 failed
[PASS] Idempotency: second run — 12 tasks, 0 changed, 0 failed
[PASS] Host reachability: 4/4 hosts responded to ping
[INFO] Hosts: app-stg-01, app-stg-02, app-stg-03, app-stg-04
[PASS] Vault decryption: encrypted variables resolved successfully
[INFO] Ansible version: 2.15.8, Python: 3.11.7
───────────────────────────────────
DO-008: Ansible Playbook — 6 passed, 0 failed`},

  {id:'DO-009',title:'CI/CD Pipeline Metrics Validation',layer:'MonitoringObs',framework:'Python / Prometheus',language:'Python',difficulty:'Intermediate',
   description:'Validates CI/CD pipeline observability metrics including build duration tracking, deployment frequency, lead time for changes, failure rate calculation, and mean time to recovery (DORA metrics).',
   prerequisites:'Prometheus server, Grafana dashboards, Pipeline webhook integration, Metric exporter running',
   config:'PROMETHEUS_URL=http://prometheus.monitoring:9090\nGRAFANA_URL=http://grafana.monitoring:3000\nPIPELINE_METRIC_PREFIX=cicd_pipeline\nEVALUATION_WINDOW=7d\nDEPLOY_FREQ_TARGET=1',
   code:`import requests
import unittest
from datetime import datetime, timedelta

class TestPipelineMetrics(unittest.TestCase):
    PROM = "http://prometheus.monitoring:9090"
    PREFIX = "cicd_pipeline"

    def query_prom(self, query):
        resp = requests.get(
            f"{self.PROM}/api/v1/query",
            params={"query": query}, timeout=10
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()["data"]["result"]
        return float(data[0]["value"][1]) if data else None

    def test_deployment_frequency(self):
        """DORA: Deployment frequency (target: daily)"""
        freq = self.query_prom(
            f'increase({self.PREFIX}_deployments_total{{env="prod"}}[7d]) / 7'
        )
        self.assertIsNotNone(freq, "No deployment data found")
        self.assertGreaterEqual(freq, 1.0,
            f"Deploy frequency {freq:.1f}/day below target 1/day")

    def test_lead_time_for_changes(self):
        """DORA: Lead time from commit to production"""
        lead_time = self.query_prom(
            f'avg({self.PREFIX}_lead_time_seconds{{env="prod"}})'
        )
        self.assertIsNotNone(lead_time, "No lead time data")
        self.assertLess(lead_time, 86400,
            f"Lead time {lead_time/3600:.1f}h exceeds 24h target")

    def test_change_failure_rate(self):
        """DORA: Change failure rate (target: < 15%)"""
        cfr = self.query_prom(
            f'{self.PREFIX}_deploy_failures_total / {self.PREFIX}_deployments_total * 100'
        )
        self.assertIsNotNone(cfr, "No failure rate data")
        self.assertLess(cfr, 15.0,
            f"Change failure rate {cfr:.1f}% exceeds 15% target")

    def test_mean_time_to_recovery(self):
        """DORA: MTTR (target: < 1 hour)"""
        mttr = self.query_prom(
            f'avg({self.PREFIX}_recovery_time_seconds{{env="prod"}})'
        )
        self.assertIsNotNone(mttr, "No MTTR data")
        self.assertLess(mttr, 3600,
            f"MTTR {mttr/60:.0f}min exceeds 60min target")

    def test_build_duration_trend(self):
        """Verify build duration is not degrading"""
        avg_dur = self.query_prom(
            f'avg_over_time({self.PREFIX}_build_duration_seconds[7d])'
        )
        self.assertIsNotNone(avg_dur, "No build duration data")
        self.assertLess(avg_dur, 600,
            f"Avg build duration {avg_dur:.0f}s exceeds 10min target")`,
   expectedOutput:`[TEST] DO-009: CI/CD Pipeline Metrics Validation
[INFO] Prometheus: http://prometheus.monitoring:9090
[PASS] Deployment frequency: 2.4/day (target: >= 1/day)
[PASS] Lead time for changes: 4.2 hours (target: < 24h)
[PASS] Change failure rate: 8.3% (target: < 15%)
[PASS] Mean time to recovery: 23 min (target: < 60 min)
[PASS] Build duration trend: avg 342s (target: < 600s)
[INFO] DORA classification: ELITE performer
[INFO] Evaluation window: last 7 days
[PASS] All 4 DORA metrics within target thresholds
[INFO] Dashboard: grafana.monitoring:3000/d/cicd-dora
───────────────────────────────────
DO-009: Pipeline Metrics — 6 passed, 0 failed`},

  {id:'DO-010',title:'Deployment Health & Tracking',layer:'MonitoringObs',framework:'Python / Kubernetes',language:'Python',difficulty:'Advanced',
   description:'Validates post-deployment health monitoring including readiness probe verification, resource utilization checks, log aggregation validation, and automated alert rule verification after a production deployment.',
   prerequisites:'Kubernetes cluster, Prometheus + Alertmanager, Loki for logs, Deployment tracking database',
   config:'K8S_NAMESPACE=banking-prod\nDEPLOYMENT=payment-engine\nPROMETHEUS_URL=http://prometheus.monitoring:9090\nLOKI_URL=http://loki.monitoring:3100\nALERTMANAGER_URL=http://alertmanager.monitoring:9093\nHEALTH_WAIT=120',
   code:`import requests
import subprocess
import json
import time
import unittest

class TestDeploymentHealth(unittest.TestCase):
    NS = "banking-prod"
    DEPLOY = "payment-engine"
    PROM = "http://prometheus.monitoring:9090"
    LOKI = "http://loki.monitoring:3100"
    ALERTMGR = "http://alertmanager.monitoring:9093"

    def kubectl_json(self, *args):
        result = subprocess.run(
            ["kubectl"] + list(args) + ["-o", "json"],
            capture_output=True, text=True, timeout=30
        )
        return json.loads(result.stdout)

    def test_pod_readiness(self):
        """All pods must pass readiness probes"""
        data = self.kubectl_json("get", "pods", "-n", self.NS,
            "-l", f"app={self.DEPLOY}")
        pods = data["items"]
        self.assertGreater(len(pods), 0, "No pods found")
        for pod in pods:
            conditions = {c["type"]: c["status"]
                for c in pod["status"]["conditions"]}
            self.assertEqual(conditions.get("Ready"), "True",
                f"Pod {pod['metadata']['name']} not ready")

    def test_resource_utilization(self):
        """CPU and memory within thresholds"""
        cpu = requests.get(f"{self.PROM}/api/v1/query", params={
            "query": f'avg(rate(container_cpu_usage_seconds_total{{namespace="{self.NS}",pod=~"{self.DEPLOY}.*"}}[5m])) * 100'
        }, timeout=10).json()["data"]["result"]
        cpu_pct = float(cpu[0]["value"][1]) if cpu else 0
        self.assertLess(cpu_pct, 80, f"CPU at {cpu_pct:.1f}%")

        mem = requests.get(f"{self.PROM}/api/v1/query", params={
            "query": f'avg(container_memory_usage_bytes{{namespace="{self.NS}",pod=~"{self.DEPLOY}.*"}}) / avg(container_spec_memory_limit_bytes{{namespace="{self.NS}",pod=~"{self.DEPLOY}.*"}}) * 100'
        }, timeout=10).json()["data"]["result"]
        mem_pct = float(mem[0]["value"][1]) if mem else 0
        self.assertLess(mem_pct, 85, f"Memory at {mem_pct:.1f}%")

    def test_error_log_absence(self):
        """No ERROR level logs in post-deploy window"""
        resp = requests.get(f"{self.LOKI}/loki/api/v1/query_range", params={
            "query": '{namespace="' + self.NS + '",app="' + self.DEPLOY + '"} |= "ERROR"',
            "start": str(int(time.time()) - 300),
            "end": str(int(time.time())),
            "limit": 10
        }, timeout=10)
        streams = resp.json().get("data", {}).get("result", [])
        error_count = sum(len(s["values"]) for s in streams)
        self.assertEqual(error_count, 0,
            f"Found {error_count} ERROR logs post-deploy")

    def test_alert_rules_active(self):
        """Critical alert rules must be firing-ready"""
        resp = requests.get(
            f"{self.ALERTMGR}/api/v2/alerts", timeout=10)
        alerts = resp.json()
        critical_firing = [a for a in alerts
            if a.get("labels", {}).get("severity") == "critical"
            and a.get("status", {}).get("state") == "active"]
        self.assertEqual(len(critical_firing), 0,
            f"{len(critical_firing)} critical alerts firing post-deploy")`,
   expectedOutput:`[TEST] DO-010: Deployment Health & Tracking
[INFO] Deployment: payment-engine in banking-prod
[PASS] Pod readiness: 3/3 pods Ready=True
[INFO] Pods: payment-engine-6d8f7-a1b2c, payment-engine-6d8f7-d3e4f, payment-engine-6d8f7-g5h6i
[PASS] CPU utilization: 34.2% (threshold: < 80%)
[PASS] Memory utilization: 61.8% (threshold: < 85%)
[PASS] Error logs: 0 ERROR entries in post-deploy 5-minute window
[PASS] Alert rules: 0 critical alerts firing
[INFO] Alertmanager: 12 rules loaded, 0 active
[PASS] Deployment health verified — all checks passed
[INFO] Health check completed 47s post-deployment
───────────────────────────────────
DO-010: Deployment Health — 6 passed, 0 failed`},

  {id:'DO-011',title:'Release Tagging & Versioning',layer:'ReleaseMgmt',framework:'Shell / Git',language:'Shell',difficulty:'Beginner',
   description:'Validates release tagging workflow including semantic version validation, Git tag creation, changelog generation from conventional commits, and release artifact association.',
   prerequisites:'Git repository, Conventional commits enforced, GitHub CLI (gh) installed, Release branch workflow',
   config:'REPO=bank-org/banking-core\nBRANCH=release/v2.5.0\nVERSION_FILE=version.txt\nCHANGELOG=CHANGELOG.md\nGH_TOKEN_SET=true',
   code:`#!/bin/bash
# Release Tagging & Versioning Validation
set -euo pipefail

REPO="bank-org/banking-core"
VERSION="2.5.0"
TAG="v\$VERSION"
BRANCH="release/v\$VERSION"
CHANGELOG="CHANGELOG.md"

echo "[RELEASE] Validating release \$TAG"

# Step 1: Validate semantic version format
if [[ ! "\$VERSION" =~ ^[0-9]+\\.[0-9]+\\.[0-9]+\$ ]]; then
    echo "[FAIL] Invalid semver: \$VERSION"
    exit 1
fi
echo "[PASS] Semantic version valid: \$VERSION"

# Step 2: Verify release branch exists and is clean
git checkout \$BRANCH
DIRTY=\$(git status --porcelain)
if [ -n "\$DIRTY" ]; then
    echo "[FAIL] Release branch has uncommitted changes"
    exit 1
fi
echo "[PASS] Release branch clean: \$BRANCH"

# Step 3: Generate changelog from conventional commits
LAST_TAG=\$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -n "\$LAST_TAG" ]; then
    echo "## [\$VERSION] - \$(date +%Y-%m-%d)" > /tmp/changes.md
    echo "" >> /tmp/changes.md
    git log \$LAST_TAG..HEAD --pretty=format:"- %s (%h)" >> /tmp/changes.md
    FEAT_COUNT=\$(git log \$LAST_TAG..HEAD --pretty=format:"%s" | grep -c "^feat:" || true)
    FIX_COUNT=\$(git log \$LAST_TAG..HEAD --pretty=format:"%s" | grep -c "^fix:" || true)
    echo "[INFO] Changes: \$FEAT_COUNT features, \$FIX_COUNT fixes"
fi

# Step 4: Create annotated Git tag
git tag -a \$TAG -m "Release \$VERSION"
echo "[PASS] Tag created: \$TAG"

# Step 5: Verify tag points to correct commit
TAG_COMMIT=\$(git rev-list -n 1 \$TAG)
HEAD_COMMIT=\$(git rev-parse HEAD)
if [ "\$TAG_COMMIT" != "\$HEAD_COMMIT" ]; then
    echo "[FAIL] Tag does not point to HEAD"
    exit 1
fi
echo "[PASS] Tag verified: points to HEAD (\$HEAD_COMMIT)"

# Step 6: Create GitHub release
gh release create \$TAG --title "Release \$VERSION" \\
    --notes-file /tmp/changes.md --target \$BRANCH
echo "[PASS] GitHub release created: \$TAG"`,
   expectedOutput:`[TEST] DO-011: Release Tagging & Versioning
[INFO] Release: v2.5.0 from branch release/v2.5.0
[PASS] Semantic version valid: 2.5.0 (major.minor.patch)
[PASS] Release branch clean: no uncommitted changes
[INFO] Previous tag: v2.4.1
[INFO] Changes since v2.4.1: 8 features, 5 fixes, 3 chores
[PASS] Changelog generated: 16 entries
[PASS] Git tag created: v2.5.0 (annotated)
[PASS] Tag verification: points to HEAD (a3f7c2d1)
[PASS] GitHub release created with changelog notes
[INFO] Release URL: https://github.com/bank-org/banking-core/releases/tag/v2.5.0
───────────────────────────────────
DO-011: Release Tagging — 6 passed, 0 failed`},

  {id:'DO-012',title:'Release Approval Gate Workflow',layer:'ReleaseMgmt',framework:'Python / REST API',language:'Python',difficulty:'Advanced',
   description:'Validates multi-stage release approval gate workflow including automated quality checks, manual approval tracking, compliance sign-off, and deployment authorization for production releases.',
   prerequisites:'Release management API, Approval workflow engine, JIRA/ServiceNow integration, Compliance database',
   config:'RELEASE_API=https://release.devops.local:8443/api/v1\nJIRA_URL=https://jira.bank.local\nCOMPLIANCE_API=https://compliance.bank.local/api/v1\nMIN_APPROVERS=2\nAPPROVAL_TIMEOUT_HOURS=48',
   code:`import requests
import unittest
from datetime import datetime

class TestReleaseApprovalGates(unittest.TestCase):
    API = "https://release.devops.local:8443/api/v1"
    COMPLIANCE = "https://compliance.bank.local/api/v1"

    def test_create_release_request(self):
        """Create release request with metadata"""
        resp = requests.post(f"{self.API}/releases", json={
            "version": "2.5.0",
            "service": "payment-engine",
            "environment": "production",
            "artifacts": ["payment-engine:v2.5.0"],
            "jira_tickets": ["BANK-1234", "BANK-1235", "BANK-1240"],
            "requestor": "deploy-bot@bank.local"
        }, timeout=10)
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.json()["status"], "PENDING_APPROVAL")
        self.release_id = resp.json()["release_id"]

    def test_automated_quality_gate(self):
        """Verify automated checks pass before approval"""
        resp = requests.get(
            f"{self.API}/releases/REL-2025-0042/quality-gates",
            timeout=10)
        self.assertEqual(resp.status_code, 200)
        gates = resp.json()["gates"]
        for gate in gates:
            self.assertEqual(gate["status"], "PASSED",
                f"Gate failed: {gate['name']}")

    def test_manual_approval_workflow(self):
        """Test multi-approver sign-off flow"""
        release_id = "REL-2025-0042"
        # First approver
        r1 = requests.post(
            f"{self.API}/releases/{release_id}/approve", json={
                "approver": "manager@bank.local",
                "decision": "APPROVED",
                "comment": "Reviewed changes, all tests passing"
            }, timeout=10)
        self.assertEqual(r1.status_code, 200)
        self.assertEqual(r1.json()["approvals_received"], 1)
        self.assertEqual(r1.json()["status"], "PENDING_APPROVAL")

        # Second approver (meets threshold)
        r2 = requests.post(
            f"{self.API}/releases/{release_id}/approve", json={
                "approver": "architect@bank.local",
                "decision": "APPROVED",
                "comment": "Architecture review passed"
            }, timeout=10)
        self.assertEqual(r2.status_code, 200)
        self.assertEqual(r2.json()["approvals_received"], 2)
        self.assertEqual(r2.json()["status"], "APPROVED")

    def test_compliance_sign_off(self):
        """Verify compliance/regulatory approval"""
        resp = requests.post(
            f"{self.COMPLIANCE}/releases/REL-2025-0042/sign-off", json={
                "officer": "compliance-lead@bank.local",
                "regulation": "RBI-IT-FRAMEWORK",
                "checklist_complete": True
            }, timeout=10)
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json()["compliant"])
        self.assertEqual(resp.json()["status"], "AUTHORIZED")`,
   expectedOutput:`[TEST] DO-012: Release Approval Gate Workflow
[INFO] Release: REL-2025-0042 (payment-engine v2.5.0 to production)
[PASS] Release request created: status=PENDING_APPROVAL
[INFO] JIRA tickets: BANK-1234, BANK-1235, BANK-1240
[PASS] Quality gate: unit tests PASSED
[PASS] Quality gate: integration tests PASSED
[PASS] Quality gate: security scan PASSED
[PASS] Quality gate: performance benchmark PASSED
[PASS] Approval 1/2: manager@bank.local — APPROVED
[PASS] Approval 2/2: architect@bank.local — APPROVED (threshold met)
[PASS] Compliance sign-off: RBI-IT-FRAMEWORK compliant
[PASS] Release status: AUTHORIZED for production deployment
[INFO] Authorization timestamp: 2026-02-27T14:32:00Z
───────────────────────────────────
DO-012: Approval Gates — 9 passed, 0 failed`},
];

export default function DevOpsTestingLab() {
  const [tab, setTab] = useState('CIPipeline');
  const [sel, setSel] = useState(S[0]);
  const [search, setSearch] = useState('');
  const [diffF, setDiffF] = useState('All');
  const [statuses, setStatuses] = useState({});
  const [code, setCode] = useState(S[0].code);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [progress, setProgress] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const timerRef = useRef(null);

  const filtered = S.filter(s => {
    if (s.layer !== tab) return false;
    if (diffF !== 'All' && s.difficulty !== diffF) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pick = useCallback((s) => { setSel(s); setCode(s.code); setOutput(''); setProgress(0); setRunning(false); }, []);

  const runSim = useCallback(() => {
    if (running) return;
    setRunning(true); setOutput(''); setProgress(0);
    const lines = sel.expectedOutput.split('\n');
    let i = 0;
    timerRef.current = setInterval(() => {
      if (i < lines.length) { setOutput(prev => prev + (prev ? '\n' : '') + lines[i]); setProgress(Math.round(((i + 1) / lines.length) * 100)); i++; }
      else { clearInterval(timerRef.current); setRunning(false); setStatuses(prev => ({ ...prev, [sel.id]: 'passed' })); }
    }, 150);
  }, [sel, running]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const totalTab = S.filter(s => s.layer === tab).length;
  const passedTab = S.filter(s => s.layer === tab && statuses[s.id] === 'passed').length;
  const totalAll = S.length;
  const passedAll = Object.values(statuses).filter(v => v === 'passed').length;
  const copy = () => { navigator.clipboard?.writeText(code); };
  const reset = () => { setCode(sel.code); };

  const sty = {
    page:{minHeight:'100vh',background:`linear-gradient(135deg,${C.bgFrom} 0%,${C.bgTo} 100%)`,color:C.text,fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",padding:'18px 22px 40px'},
    h1:{fontSize:28,fontWeight:800,margin:0,background:`linear-gradient(90deg,${C.accent},#3498db)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'},
    sub:{fontSize:13,color:C.muted,marginTop:4},
    statsBar:{display:'flex',justifyContent:'center',gap:24,marginBottom:14,flexWrap:'wrap'},
    stat:{background:C.card,borderRadius:8,padding:'6px 18px',fontSize:13,border:`1px solid ${C.border}`},
    split:{display:'flex',gap:16,height:'calc(100vh - 160px)',minHeight:500},
    left:{width:'38%',minWidth:320,display:'flex',flexDirection:'column',gap:10},
    right:{flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'hidden'},
    tabBar:{display:'flex',gap:4,flexWrap:'wrap'},
    tabBtn:(a)=>({padding:'6px 12px',borderRadius:6,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,background:a?C.accent:C.card,color:a?'#0a0a1a':C.text}),
    input:{flex:1,padding:'7px 12px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:13,outline:'none',minWidth:120},
    select:{padding:'6px 8px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:12,outline:'none'},
    list:{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:6,paddingRight:4},
    card:(a)=>({padding:'10px 14px',borderRadius:8,background:a?C.cardHover:C.card,border:`1px solid ${a?C.accent:C.border}`,cursor:'pointer'}),
    badge:(c)=>({display:'inline-block',padding:'1px 7px',borderRadius:10,fontSize:10,fontWeight:700,background:c+'22',color:c,marginRight:4}),
    dot:(st)=>({display:'inline-block',width:8,height:8,borderRadius:'50%',background:st==='passed'?C.accent:C.muted,marginRight:6}),
    panel:{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:16,overflowY:'auto'},
    editor:{width:'100%',minHeight:200,maxHeight:280,padding:12,borderRadius:8,border:`1px solid ${C.border}`,background:C.editorBg,color:C.editorText,fontFamily:"'Fira Code','Consolas',monospace",fontSize:12,lineHeight:1.6,resize:'vertical',outline:'none',whiteSpace:'pre',overflowX:'auto'},
    btn:(bg)=>({padding:'7px 16px',borderRadius:6,border:'none',cursor:'pointer',fontSize:12,fontWeight:700,background:bg||C.accent,color:(bg===C.danger||bg==='#555')?'#fff':'#0a0a1a'}),
    outBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,fontFamily:"'Fira Code','Consolas',monospace",fontSize:11,color:C.accent,lineHeight:1.7,whiteSpace:'pre-wrap',minHeight:60,maxHeight:180,overflowY:'auto'},
    progBar:{height:4,borderRadius:2,background:'#0a2744',marginTop:6},
    progFill:(p)=>({height:'100%',borderRadius:2,width:p+'%',background:p===100?C.accent:'#3498db',transition:'width 0.3s'}),
    progO:{height:6,borderRadius:3,background:'#0a2744',marginBottom:8},
    progOF:(p)=>({height:'100%',borderRadius:3,width:p+'%',background:`linear-gradient(90deg,${C.accent},#3498db)`,transition:'width 0.4s'}),
    cfgBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,marginTop:8,fontSize:12,lineHeight:1.6,color:C.warn,fontFamily:"'Fira Code','Consolas',monospace",whiteSpace:'pre-wrap'},
  };

  return (
    <div style={sty.page}>
      <div style={{textAlign:'center',marginBottom:16}}>
        <h1 style={sty.h1}>DevOps & CI/CD Testing Lab</h1>
        <div style={sty.sub}>CI Pipeline, CD Pipeline, Containers, Infrastructure as Code, Monitoring & Release Management — {totalAll} Scenarios</div>
      </div>
      <div style={sty.statsBar}>
        <span style={sty.stat}>Total: <b style={{color:C.accent}}>{totalAll}</b></span>
        <span style={sty.stat}>Passed: <b style={{color:C.accent}}>{passedAll}</b>/{totalAll}</span>
        <span style={sty.stat}>Tab: <b style={{color:C.accent}}>{passedTab}</b>/{totalTab}</span>
        <span style={sty.stat}>Coverage: <b style={{color:C.accent}}>{totalAll>0?Math.round((passedAll/totalAll)*100):0}%</b></span>
      </div>
      <div style={sty.split}>
        <div style={sty.left}>
          <div style={sty.tabBar}>{TABS.map(t=><button key={t.key} style={sty.tabBtn(tab===t.key)} onClick={()=>setTab(t.key)}>{t.label}</button>)}</div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
            <input style={sty.input} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
            <select style={sty.select} value={diffF} onChange={e=>setDiffF(e.target.value)}>{['All',...DIFF].map(d=><option key={d} value={d}>{d==='All'?'Difficulty':d}</option>)}</select>
          </div>
          <div style={sty.progO}><div style={sty.progOF(totalTab>0?Math.round((passedTab/totalTab)*100):0)}/></div>
          <div style={sty.list}>
            {filtered.length===0&&<div style={{color:C.muted,textAlign:'center',padding:20}}>No scenarios match</div>}
            {filtered.map(s=>(
              <div key={s.id} style={sty.card(sel.id===s.id)} onClick={()=>pick(s)}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={sty.dot(statuses[s.id])}/><span style={{fontSize:11,color:C.accent,marginRight:8}}>{s.id}</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.header}}>{s.title}</span>
                </div>
                <div style={{marginTop:4}}>
                  <span style={sty.badge(TC[s.layer]||C.accent)}>{s.layer}</span>
                  <span style={sty.badge(DC[s.difficulty])}>{s.difficulty}</span>
                  <span style={sty.badge('#3498db')}>{s.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={sty.right}>
          <div style={{...sty.panel,flex:'0 0 auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div><span style={{fontSize:14,fontWeight:800,color:C.accent,marginRight:10}}>{sel.id}</span><span style={{fontSize:16,fontWeight:700,color:C.header}}>{sel.title}</span></div>
              <div><span style={sty.badge(TC[sel.layer]||C.accent)}>{sel.layer}</span><span style={sty.badge(DC[sel.difficulty])}>{sel.difficulty}</span><span style={sty.badge('#f1c40f')}>{sel.language}</span></div>
            </div>
            <div style={{fontSize:12,color:C.muted,marginBottom:10,lineHeight:1.5}}>{sel.description}</div>
            <div style={{fontSize:11,color:C.muted}}><b>Prerequisites:</b> {sel.prerequisites}</div>
          </div>
          <div style={{...sty.panel,flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Test Script — {sel.framework}</span>
              <div style={{display:'flex',gap:6}}><button style={sty.btn()} onClick={copy}>Copy</button><button style={sty.btn('#555')} onClick={reset}>Reset</button></div>
            </div>
            <textarea style={sty.editor} value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Expected Output</span>
              <span style={{fontSize:11,color:C.muted}}>{sel.language}</span>
            </div>
            <div style={sty.outBox}>{sel.expectedOutput}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button style={{...sty.btn(running?'#555':C.accent),opacity:running?0.6:1}} onClick={runSim} disabled={running}>{running?'Running...':'Run Test'}</button>
              {statuses[sel.id]==='passed'&&<span style={{color:C.accent,fontSize:12,fontWeight:700}}>PASSED</span>}
              {progress>0&&progress<100&&<span style={{color:'#3498db',fontSize:11}}>{progress}%</span>}
              <button style={{...sty.btn('#3498db'),marginLeft:'auto'}} onClick={()=>setShowConfig(!showConfig)}>{showConfig?'Hide':'Show'} Config</button>
            </div>
            {(running||output)&&(<div><div style={{fontSize:12,fontWeight:700,color:C.header,marginBottom:4}}>Execution Output</div><div style={sty.outBox}>{output||'Starting...'}</div><div style={sty.progBar}><div style={sty.progFill(progress)}/></div></div>)}
            {showConfig&&<div style={sty.cfgBox}><div style={{fontWeight:700,color:C.accent,marginBottom:6}}>Configuration</div><div>{sel.config}</div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

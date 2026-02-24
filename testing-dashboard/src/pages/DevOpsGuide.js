import React, { useState } from 'react';

/* ===================================================================
   DevOps Complete Guide
   Tabs: DevOps Lifecycle | Registry & Artifacts | CI Flow | CD Flow |
         Continuous Testing | Monitoring | Code Review | Operations Checklist
   =================================================================== */

const TABS = [
  { id: 'lifecycle', label: 'DevOps Lifecycle' },
  { id: 'registry', label: 'Registry & Artifacts' },
  { id: 'ci', label: 'CI Flow' },
  { id: 'cd', label: 'CD Flow' },
  { id: 'testing', label: 'Continuous Testing' },
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'codereview', label: 'Code Review' },
  { id: 'checklist', label: 'Operations Checklist' },
];

/* ── Lifecycle Data ── */

const LIFECYCLE_PHASES = [
  {
    name: 'Plan', icon: 'P', color: '#3b82f6',
    description: 'Define requirements, create user stories, plan sprints, and prioritize backlog items.',
    tools: ['Jira', 'Azure Boards', 'Trello', 'Confluence', 'Notion'],
    activities: ['Requirement gathering', 'Sprint planning', 'Backlog grooming', 'Roadmap creation', 'Risk assessment'],
    artifacts: ['Product backlog', 'Sprint backlog', 'User stories', 'Acceptance criteria', 'Architecture docs'],
    metrics: ['Velocity', 'Sprint burndown', 'Lead time', 'Cycle time'],
  },
  {
    name: 'Code', icon: 'C', color: '#6366f1',
    description: 'Write application code, create branches, follow coding standards, and conduct peer reviews.',
    tools: ['VS Code', 'IntelliJ', 'Git', 'GitHub', 'GitLab'],
    activities: ['Feature development', 'Branch management', 'Code review', 'Pair programming', 'Refactoring'],
    artifacts: ['Source code', 'Pull requests', 'Code review comments', 'Branch policies'],
    metrics: ['Commit frequency', 'PR merge time', 'Code churn', 'Review turnaround'],
  },
  {
    name: 'Build', icon: 'B', color: '#8b5cf6',
    description: 'Compile source code, resolve dependencies, run linters, and produce deployable artifacts.',
    tools: ['Maven', 'Gradle', 'npm', 'webpack', 'Docker'],
    activities: ['Compilation', 'Dependency resolution', 'Linting', 'Static analysis', 'Artifact packaging'],
    artifacts: ['JAR/WAR files', 'Docker images', 'npm packages', 'Build logs', 'SBOM'],
    metrics: ['Build time', 'Build success rate', 'Artifact size', 'Dependency count'],
  },
  {
    name: 'Test', icon: 'T', color: '#a855f7',
    description: 'Execute automated tests at multiple levels to validate code quality and functionality.',
    tools: ['JUnit', 'pytest', 'Selenium', 'Cypress', 'SonarQube'],
    activities: ['Unit testing', 'Integration testing', 'E2E testing', 'Security scanning', 'Performance testing'],
    artifacts: ['Test reports', 'Coverage reports', 'Security scan results', 'Performance benchmarks'],
    metrics: ['Code coverage', 'Test pass rate', 'Defect escape rate', 'Mean time to detect'],
  },
  {
    name: 'Release', icon: 'R', color: '#ec4899',
    description: 'Package tested code for deployment, tag versions, and generate release notes.',
    tools: ['GitHub Releases', 'Semantic Versioning', 'Helm', 'Terraform', 'Ansible'],
    activities: ['Version tagging', 'Release notes generation', 'Changelog update', 'Approval gates', 'Artifact promotion'],
    artifacts: ['Release tags', 'Changelogs', 'Deployment manifests', 'Helm charts', 'Release notes'],
    metrics: ['Release frequency', 'Release size', 'Rollback rate', 'Time to release'],
  },
  {
    name: 'Deploy', icon: 'D', color: '#f43f5e',
    description: 'Push artifacts to target environments using automated deployment strategies.',
    tools: ['Kubernetes', 'ArgoCD', 'AWS CodeDeploy', 'Terraform', 'Ansible'],
    activities: ['Infrastructure provisioning', 'Application deployment', 'Configuration management', 'Smoke testing', 'Traffic shifting'],
    artifacts: ['Deployment logs', 'Infrastructure state', 'Config maps', 'Secrets', 'Health check results'],
    metrics: ['Deployment frequency', 'Deployment duration', 'MTTR', 'Change failure rate'],
  },
  {
    name: 'Operate', icon: 'O', color: '#f97316',
    description: 'Manage infrastructure, handle incidents, scale resources, and ensure reliability.',
    tools: ['Kubernetes', 'Terraform', 'PagerDuty', 'Ansible', 'AWS/GCP/Azure'],
    activities: ['Incident management', 'Capacity planning', 'Auto-scaling', 'Disaster recovery', 'Security patching'],
    artifacts: ['Runbooks', 'Incident reports', 'Capacity plans', 'SLA reports', 'Post-mortems'],
    metrics: ['Uptime (SLA)', 'MTTR', 'MTTF', 'Incident count', 'Cost efficiency'],
  },
  {
    name: 'Monitor', icon: 'M', color: '#22c55e',
    description: 'Observe system health, collect metrics, aggregate logs, and set up alerting.',
    tools: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog', 'New Relic'],
    activities: ['Metric collection', 'Log aggregation', 'Distributed tracing', 'Alerting', 'Dashboard creation'],
    artifacts: ['Dashboards', 'Alert rules', 'SLI/SLO definitions', 'Trace data', 'Anomaly reports'],
    metrics: ['P99 latency', 'Error rate', 'Throughput', 'Alert noise ratio', 'MTTD'],
  },
];

/* ── Registry Data ── */

const REGISTRIES = [
  {
    type: 'Code Registry', icon: '{;}', color: '#3b82f6', bg: '#eff6ff',
    purpose: 'Version control and collaboration hub for source code. Stores complete project history, enables branching, pull requests, and team collaboration workflows.',
    tools: ['GitHub', 'GitLab', 'Bitbucket', 'Azure Repos', 'AWS CodeCommit'],
    pipelineFit: 'Starting point of every CI/CD pipeline. Webhooks trigger builds on push/PR events. Branch protection rules enforce quality gates.',
    storageFormat: 'Git objects (blobs, trees, commits). Files stored as content-addressable SHA-1 hashes in .git directory.',
    versioning: 'Branches for parallel development, tags for releases (v1.0.0). Semantic versioning with git tags. Commit SHA for exact snapshots.',
  },
  {
    type: 'Container Registry', icon: 'D', color: '#6366f1', bg: '#eef2ff',
    purpose: 'Store and distribute Docker/OCI container images. Provides image scanning, access control, and layer caching for efficient distribution.',
    tools: ['Docker Hub', 'Amazon ECR', 'Google GCR', 'Azure ACR', 'GitHub GHCR', 'Harbor'],
    pipelineFit: 'CI builds Docker images and pushes to registry. CD pulls images from registry to deploy to target environments. Image tags match release versions.',
    storageFormat: 'OCI image manifests with layered filesystem. Each layer is a tar.gz of filesystem changes. Manifests reference layers by SHA256 digest.',
    versioning: 'Tags (latest, v1.2.3, sha-abc123). Immutable digests (sha256:...) for exact reproducibility. Multi-arch manifests for cross-platform support.',
  },
  {
    type: 'Artifact Registry', icon: 'A', color: '#8b5cf6', bg: '#f5f3ff',
    purpose: 'Universal repository for build outputs. Stores compiled binaries, packages, and any build artifact with metadata and dependency information.',
    tools: ['JFrog Artifactory', 'Sonatype Nexus', 'Azure Artifacts', 'AWS CodeArtifact', 'GitHub Packages'],
    pipelineFit: 'CI publishes build artifacts after successful tests. CD fetches approved artifacts for deployment. Promotion workflow moves artifacts through stages (dev -> staging -> prod).',
    storageFormat: 'Format-specific: JAR/WAR (Java), wheels/sdist (Python), tarballs, ZIP archives. Metadata in repository-specific format (pom.xml, package.json).',
    versioning: 'Semantic versioning (1.2.3), snapshot versions for dev (1.2.3-SNAPSHOT), build metadata (+build.123). Retention policies auto-clean old versions.',
  },
  {
    type: 'Package Registry', icon: 'Pk', color: '#ec4899', bg: '#fdf2f8',
    purpose: 'Host and distribute language-specific libraries and frameworks. Enables dependency management with version resolution and vulnerability scanning.',
    tools: ['npm Registry', 'PyPI', 'Maven Central', 'NuGet Gallery', 'RubyGems', 'crates.io'],
    pipelineFit: 'CI installs dependencies from package registries during build. Private packages published here for internal reuse. Lock files ensure reproducible builds across environments.',
    storageFormat: 'Language-specific: .tgz (npm), .whl/.tar.gz (PyPI), .jar (Maven), .nupkg (NuGet). Each includes manifest (package.json, setup.py, pom.xml).',
    versioning: 'Semantic versioning with range specifiers (^1.2.0, ~1.2.0, >=1.2,<2.0). Lock files pin exact versions. Deprecation flags for outdated versions.',
  },
  {
    type: 'Helm Chart Registry', icon: 'H', color: '#22c55e', bg: '#f0fdf4',
    purpose: 'Store and share Kubernetes application packages (Helm charts). Charts bundle K8s manifests with templating for configurable deployments.',
    tools: ['Artifact Hub', 'ChartMuseum', 'Harbor', 'OCI Registries', 'AWS ECR (OCI)', 'GCR (OCI)'],
    pipelineFit: 'CI packages Helm charts and pushes to registry. CD uses helm install/upgrade to deploy applications. Values files customize per environment (dev, staging, prod).',
    storageFormat: 'Chart.yaml (metadata), values.yaml (defaults), templates/ directory (K8s manifests with Go templating). Packaged as .tgz archives.',
    versioning: 'Chart version (chart packaging version) + App version (application version). Both follow semver. index.yaml catalogs all available chart versions.',
  },
];

/* ── CI Steps Data ── */

const CI_STEPS = [
  { label: 'Developer Push', icon: '1', color: '#3b82f6', desc: 'Developer pushes code to the remote repository branch. This triggers the entire CI pipeline via configured webhooks.' },
  { label: 'Webhook Trigger', icon: '2', color: '#4f46e5', desc: 'Repository webhook notifies the CI server about the new commit. The CI server queues a new pipeline run for the branch.' },
  { label: 'Fetch Code', icon: '3', color: '#6366f1', desc: 'CI runner clones the repository and checks out the specific commit SHA. Caches dependencies from previous runs if available.' },
  { label: 'Install Dependencies', icon: '4', color: '#7c3aed', desc: 'Install project dependencies using lock files (package-lock.json, requirements.lock) for reproducible builds.' },
  { label: 'Lint Code', icon: '5', color: '#8b5cf6', desc: 'Run static analysis tools (ESLint, ruff, pylint) to catch style violations, unused imports, and common errors early.' },
  { label: 'Run Unit Tests', icon: '6', color: '#a855f7', desc: 'Execute unit tests in isolation. These test individual functions/methods with mocked dependencies. Target: < 2 minutes.' },
  { label: 'Run Integration Tests', icon: '7', color: '#c026d3', desc: 'Test interactions between components with real databases and services. Uses test containers or in-memory databases.' },
  { label: 'Code Coverage Check', icon: '8', color: '#d946ef', desc: 'Measure test coverage percentage. Enforce minimum threshold (typically 80%). Block merge if coverage drops below gate.' },
  { label: 'Security Scan', icon: '9', color: '#ec4899', desc: 'Run SAST (Bandit, Semgrep), dependency audit (npm audit, pip-audit), and secret detection (detect-secrets, trufflehog).' },
  { label: 'Build Artifact', icon: '10', color: '#f43f5e', desc: 'Compile source code and package into deployable artifact: Docker image, JAR file, npm package, or binary executable.' },
  { label: 'Push to Registry', icon: '11', color: '#f97316', desc: 'Push the built artifact to the appropriate registry (Docker Hub, ECR, Artifactory) with version tags and build metadata.' },
  { label: 'Notify Team', icon: '12', color: '#22c55e', desc: 'Send notifications via Slack, email, or Teams about build status. Include links to logs, coverage reports, and artifacts.' },
];

const CI_TOOLS = [
  { name: 'GitHub Actions', hosting: 'Cloud (GitHub)', config: 'YAML (.github/workflows/)', pricing: 'Free tier + paid', ecosystem: 'Excellent', learningCurve: 'Low', bestFor: 'GitHub-hosted projects' },
  { name: 'Jenkins', hosting: 'Self-hosted', config: 'Jenkinsfile (Groovy)', pricing: 'Free (OSS)', ecosystem: 'Largest plugin library', learningCurve: 'High', bestFor: 'Enterprise, complex pipelines' },
  { name: 'GitLab CI', hosting: 'Cloud / Self-hosted', config: 'YAML (.gitlab-ci.yml)', pricing: 'Free tier + paid', ecosystem: 'Built-in DevOps platform', learningCurve: 'Medium', bestFor: 'GitLab-hosted projects' },
  { name: 'CircleCI', hosting: 'Cloud / Self-hosted', config: 'YAML (.circleci/config.yml)', pricing: 'Free tier + paid', ecosystem: 'Good orb marketplace', learningCurve: 'Low', bestFor: 'Fast builds, Docker-native' },
  { name: 'Azure Pipelines', hosting: 'Cloud (Azure)', config: 'YAML (azure-pipelines.yml)', pricing: 'Free tier + paid', ecosystem: 'Azure integration', learningCurve: 'Medium', bestFor: 'Azure/Microsoft stack' },
  { name: 'Travis CI', hosting: 'Cloud', config: 'YAML (.travis.yml)', pricing: 'Free for OSS', ecosystem: 'Moderate', learningCurve: 'Low', bestFor: 'Open source projects' },
];

/* ── CD Data ── */

const CD_STEPS = [
  { label: 'Artifact Ready', icon: 'AR', color: '#3b82f6', desc: 'CI pipeline has produced a tested, scanned, and versioned artifact. It is stored in the artifact registry awaiting deployment.' },
  { label: 'Pull from Registry', icon: 'PR', color: '#6366f1', desc: 'CD pipeline fetches the approved artifact version from the registry. Validates checksum and signature integrity before proceeding.' },
  { label: 'Deploy to Staging', icon: 'DS', color: '#8b5cf6', desc: 'Deploy the artifact to the staging environment which mirrors production. Apply environment-specific configurations and secrets.' },
  { label: 'Run Smoke Tests', icon: 'ST', color: '#a855f7', desc: 'Execute critical path tests against staging: health checks, core API endpoints, authentication flow, and key user journeys.' },
  { label: 'Manual Approval', icon: 'MA', color: '#f59e0b', desc: 'Optional gate requiring human approval before production deployment. Reviewer checks staging environment and test results.' },
  { label: 'Deploy to Production', icon: 'DP', color: '#ef4444', desc: 'Deploy the approved artifact to production using the configured strategy (blue-green, canary, or rolling update).' },
  { label: 'Health Check', icon: 'HC', color: '#22c55e', desc: 'Verify the new deployment is healthy: HTTP 200 on /health, metrics within thresholds, no spike in error rates or latency.' },
  { label: 'Rollback if Failed', icon: 'RB', color: '#dc2626', desc: 'If health checks fail, automatically roll back to the previous stable version. Alert the on-call team and create an incident.' },
];

const DEPLOYMENT_STRATEGIES = [
  {
    name: 'Blue-Green', color: '#3b82f6',
    description: 'Maintain two identical production environments (Blue and Green). Deploy to the idle environment, run validations, then switch all traffic at once.',
    pros: ['Zero downtime', 'Instant rollback (switch back)', 'Full environment testing before live', 'No mixed versions'],
    cons: ['Double infrastructure cost', 'Database migrations complex', 'Session handling during switch', 'State synchronization'],
    useCase: 'Critical applications requiring zero-downtime with instant rollback capability.',
  },
  {
    name: 'Canary', color: '#f59e0b',
    description: 'Gradually roll out the new version to a small subset of users first, then increase traffic percentage as confidence grows.',
    pros: ['Low risk exposure', 'Real user validation', 'Gradual confidence building', 'Easy rollback'],
    cons: ['Complex traffic routing', 'Longer rollout time', 'Need good observability', 'API compatibility required'],
    useCase: 'Large-scale applications where you need real-user validation before full rollout.',
  },
  {
    name: 'Rolling Update', color: '#22c55e',
    description: 'Replace application instances one at a time (or in batches). Each batch is health-checked before proceeding to the next.',
    pros: ['No extra infrastructure', 'Kubernetes native', 'Gradual rollout', 'Resource efficient'],
    cons: ['Mixed versions during rollout', 'Slower rollback', 'Must support N-1 compatibility', 'Partial deployment state'],
    useCase: 'Standard Kubernetes deployments and stateless microservices.',
  },
  {
    name: 'A/B Testing', color: '#8b5cf6',
    description: 'Route specific user segments to different versions based on feature flags, user attributes, or random assignment.',
    pros: ['Data-driven decisions', 'Feature validation', 'User segment targeting', 'Business metric comparison'],
    cons: ['Complex routing logic', 'Need feature flag system', 'Statistical significance needed', 'Multiple versions in prod'],
    useCase: 'Product experiments, UI changes, and business feature validation.',
  },
];

/* ── Testing Data ── */

const TESTING_STAGES = [
  {
    stage: 'Pre-commit', color: '#3b82f6',
    tests: ['Linting (ESLint, ruff)', 'Formatting (Prettier, Black)', 'Type checking (TypeScript, mypy)', 'Unit tests (affected files only)', 'Secret detection (detect-secrets)'],
    tools: ['pre-commit hooks', 'Husky', 'lint-staged'],
    duration: '< 30 seconds',
    failureAction: 'Block commit. Developer fixes locally before retrying.',
  },
  {
    stage: 'Pre-merge (PR)', color: '#6366f1',
    tests: ['Full unit test suite', 'Integration tests', 'Code coverage gate (80%+)', 'SAST security scan', 'Dependency vulnerability check', 'API contract tests'],
    tools: ['GitHub Actions', 'Jenkins', 'SonarQube', 'Snyk'],
    duration: '5 - 15 minutes',
    failureAction: 'Block PR merge. Developer fixes and re-pushes.',
  },
  {
    stage: 'Post-merge', color: '#8b5cf6',
    tests: ['Full regression suite', 'Cross-browser tests', 'Performance benchmarks', 'Database migration tests', 'Container image scan'],
    tools: ['Selenium Grid', 'k6', 'Trivy', 'OWASP ZAP'],
    duration: '15 - 30 minutes',
    failureAction: 'Alert team. May revert merge if critical failure detected.',
  },
  {
    stage: 'Pre-deploy (Staging)', color: '#f59e0b',
    tests: ['Smoke tests on staging', 'E2E user journey tests', 'Load testing', 'Chaos engineering probes', 'Security penetration tests'],
    tools: ['Cypress', 'Playwright', 'Locust', 'Chaos Monkey', 'Burp Suite'],
    duration: '30 - 60 minutes',
    failureAction: 'Block deployment to production. Fix and re-deploy to staging.',
  },
  {
    stage: 'Post-deploy (Production)', color: '#ef4444',
    tests: ['Health checks (/health endpoint)', 'Synthetic monitoring', 'Canary analysis', 'Error rate monitoring', 'Latency threshold checks'],
    tools: ['Datadog Synthetics', 'Prometheus', 'PagerDuty', 'Grafana alerts'],
    duration: '5 - 15 minutes (continuous)',
    failureAction: 'Auto-rollback if error rate exceeds threshold. Page on-call team.',
  },
  {
    stage: 'Production (Ongoing)', color: '#22c55e',
    tests: ['Real user monitoring (RUM)', 'SLO compliance checks', 'Scheduled security scans', 'Dependency update alerts', 'Compliance audits'],
    tools: ['New Relic', 'Datadog', 'Dependabot', 'Renovate', 'AWS Inspector'],
    duration: 'Continuous',
    failureAction: 'Create ticket for remediation. Escalate if SLO breached.',
  },
];

/* ── Monitoring Data ── */

const MONITORING_TOOLS = [
  { name: 'Prometheus', category: 'Metrics', type: 'Open Source', strength: 'Pull-based metrics, PromQL, alerting rules', bestFor: 'Kubernetes metrics collection and alerting' },
  { name: 'Grafana', category: 'Visualization', type: 'Open Source', strength: 'Beautiful dashboards, multi-source, alerting', bestFor: 'Dashboard creation and metric visualization' },
  { name: 'ELK Stack', category: 'Logs', type: 'Open Source', strength: 'Full-text search, log aggregation, Kibana UI', bestFor: 'Centralized log management and analysis' },
  { name: 'Datadog', category: 'Full Platform', type: 'SaaS', strength: 'APM + logs + metrics + synthetics, AI-based alerts', bestFor: 'All-in-one observability for cloud-native apps' },
  { name: 'New Relic', category: 'APM', type: 'SaaS', strength: 'Deep app performance insights, distributed tracing', bestFor: 'Application performance monitoring and tracing' },
  { name: 'PagerDuty', category: 'Incident Mgmt', type: 'SaaS', strength: 'On-call scheduling, escalation policies, automation', bestFor: 'Incident alerting and on-call management' },
  { name: 'Jaeger', category: 'Tracing', type: 'Open Source', strength: 'Distributed tracing, service dependency analysis', bestFor: 'Microservices request tracing and debugging' },
  { name: 'Loki', category: 'Logs', type: 'Open Source', strength: 'Like Prometheus but for logs, label-based querying', bestFor: 'Cost-effective log aggregation with Grafana' },
];

/* ── Code Review Data ── */

const REVIEW_STEPS = [
  { label: 'Submit PR', icon: 'PR', color: '#3b82f6', desc: 'Developer creates a pull request with description, linked issues, and checklist. Assigns reviewers based on CODEOWNERS file.' },
  { label: 'Auto Checks', icon: 'AC', color: '#6366f1', desc: 'CI pipeline runs automatically: linting, tests, coverage, security scans. Status checks must pass before human review.' },
  { label: 'Assign Reviewer', icon: 'AR', color: '#8b5cf6', desc: 'Auto-assigned via CODEOWNERS or manually selected. Load balancing across team members. At least 1-2 reviewers required.' },
  { label: 'Review Code', icon: 'RC', color: '#f59e0b', desc: 'Reviewer examines changes: logic correctness, security, performance, test coverage, coding standards, and documentation.' },
  { label: 'Request Changes', icon: 'CH', color: '#ef4444', desc: 'If issues found, reviewer requests changes with specific inline comments. Developer addresses each comment and re-pushes.' },
  { label: 'Approve', icon: 'OK', color: '#22c55e', desc: 'All reviewers approve. Required approvals threshold met. All automated checks green. PR is ready to merge.' },
  { label: 'Merge', icon: 'MG', color: '#10b981', desc: 'PR is merged to target branch (squash, rebase, or merge commit). Branch is auto-deleted. CD pipeline triggers deployment.' },
];

const REJECTION_REASONS = [
  { reason: 'Security Vulnerability', severity: 'Critical', example: 'SQL injection via f-string: f"SELECT * FROM users WHERE id={user_id}"', fix: 'Use parameterized queries: cursor.execute("SELECT * FROM users WHERE id=?", (user_id,))' },
  { reason: 'No Test Coverage', severity: 'High', example: 'New endpoint /api/payments added with zero unit tests', fix: 'Add unit tests for happy path, error cases, and edge cases. Minimum 80% coverage on new code.' },
  { reason: 'Breaks API Contract', severity: 'Critical', example: 'Renamed response field from "user_name" to "username" without versioning', fix: 'Add new field alongside old one with deprecation notice. Create v2 endpoint if breaking change needed.' },
  { reason: 'Performance Regression', severity: 'High', example: 'N+1 query: fetching 100 orders then querying each order\'s items individually', fix: 'Use JOIN query or batch fetch: SELECT * FROM items WHERE order_id IN (?, ?, ...)' },
  { reason: 'Hardcoded Secrets', severity: 'Critical', example: 'API_KEY = "sk-1234567890abcdef" directly in source code', fix: 'Move to environment variable. Use .env file locally, secrets manager in production.' },
  { reason: 'Missing Error Handling', severity: 'High', example: 'bare except: pass that silently swallows all exceptions', fix: 'Catch specific exceptions, log the error, and either re-raise or return appropriate error response.' },
  { reason: 'Code Duplication', severity: 'Medium', example: 'Same validation logic copy-pasted in 4 different routers', fix: 'Extract to shared utility function in core/utils.py or create a Pydantic validator.' },
  { reason: 'Missing Input Validation', severity: 'High', example: 'Accepting user-provided file path without sanitization: open(user_path)', fix: 'Validate with Path.resolve() + startswith() check. Use allowlist for extensions.' },
  { reason: 'Inconsistent Naming', severity: 'Low', example: 'Mix of camelCase and snake_case: getUserData() alongside get_user_data()', fix: 'Follow language convention: snake_case for Python, camelCase for JavaScript. Apply linter rules.' },
  { reason: 'Missing Documentation', severity: 'Medium', example: 'Complex algorithm with no docstring, comments, or explanation of business logic', fix: 'Add docstring explaining what, why, parameters, return value, and any side effects.' },
];

/* ── Operations Checklist Data ── */

const CHECKLIST_SECTIONS = [
  {
    section: 'Infrastructure Setup', color: '#3b82f6', icon: 'IS',
    items: [
      { text: 'Version control repository initialized with .gitignore', priority: 'P0' },
      { text: 'Branch protection rules configured (main, develop)', priority: 'P0' },
      { text: 'Environment variables documented in .env.template', priority: 'P0' },
      { text: 'Docker/container configuration created and tested', priority: 'P0' },
      { text: 'Database provisioned with WAL mode and indexes', priority: 'P1' },
      { text: 'SSL/TLS certificates configured for all environments', priority: 'P1' },
      { text: 'DNS and load balancer configured with health checks', priority: 'P1' },
      { text: 'Secrets management solution deployed (Vault, AWS Secrets Manager)', priority: 'P1' },
    ],
  },
  {
    section: 'CI Pipeline', color: '#6366f1', icon: 'CI',
    items: [
      { text: 'CI pipeline configuration file created and version-controlled', priority: 'P0' },
      { text: 'Linting step configured (ruff, ESLint, Prettier)', priority: 'P0' },
      { text: 'Unit test step with minimum 80% coverage gate', priority: 'P0' },
      { text: 'Integration test step with test database', priority: 'P0' },
      { text: 'Security scanning step (SAST + dependency audit)', priority: 'P0' },
      { text: 'Docker image build and push to registry', priority: 'P1' },
      { text: 'Artifact versioning with semantic versioning', priority: 'P1' },
      { text: 'Build notifications configured (Slack, Teams, email)', priority: 'P2' },
      { text: 'Pipeline caching for dependencies (node_modules, pip cache)', priority: 'P2' },
      { text: 'Matrix builds for multiple environments/versions', priority: 'P2' },
    ],
  },
  {
    section: 'CD Pipeline', color: '#8b5cf6', icon: 'CD',
    items: [
      { text: 'Staging environment mirrors production configuration', priority: 'P0' },
      { text: 'Automated deployment to staging on merge to develop', priority: 'P0' },
      { text: 'Smoke tests run after staging deployment', priority: 'P0' },
      { text: 'Manual approval gate before production deployment', priority: 'P0' },
      { text: 'Deployment strategy configured (blue-green, canary, rolling)', priority: 'P1' },
      { text: 'Automated rollback on health check failure', priority: 'P1' },
      { text: 'Database migration runs safely before app deployment', priority: 'P1' },
      { text: 'Post-deployment verification tests automated', priority: 'P2' },
    ],
  },
  {
    section: 'Monitoring', color: '#f59e0b', icon: 'MO',
    items: [
      { text: 'Application health endpoint (/health) returning JSON status', priority: 'P0' },
      { text: 'Structured logging (JSON format) with correlation IDs', priority: 'P0' },
      { text: 'Metrics collection (CPU, memory, request rate, error rate)', priority: 'P0' },
      { text: 'Alerting rules for critical thresholds (5xx rate, latency P99)', priority: 'P1' },
      { text: 'Dashboard with key business and operational metrics', priority: 'P1' },
      { text: 'Distributed tracing for microservices request flow', priority: 'P2' },
    ],
  },
  {
    section: 'Security', color: '#ef4444', icon: 'SE',
    items: [
      { text: 'HTTPS enforced on all endpoints (HSTS header)', priority: 'P0' },
      { text: 'Security headers configured (CSP, X-Frame-Options, etc.)', priority: 'P0' },
      { text: 'Authentication and authorization on admin endpoints', priority: 'P0' },
      { text: 'Input validation on all user-facing endpoints', priority: 'P0' },
      { text: 'Secrets encrypted at rest and in transit', priority: 'P0' },
      { text: 'Rate limiting on API endpoints', priority: 'P1' },
      { text: 'CORS configured with restricted origin list', priority: 'P1' },
      { text: 'Regular dependency vulnerability scanning (Dependabot, Snyk)', priority: 'P1' },
    ],
  },
  {
    section: 'Documentation', color: '#22c55e', icon: 'DC',
    items: [
      { text: 'README with setup instructions and architecture overview', priority: 'P0' },
      { text: 'API documentation auto-generated (Swagger/OpenAPI)', priority: 'P0' },
      { text: 'Runbook for common operational procedures', priority: 'P1' },
      { text: 'Architecture decision records (ADRs) for major choices', priority: 'P2' },
      { text: 'Onboarding guide for new team members', priority: 'P2' },
    ],
  },
];

/* =================================================================== */
/*  Component                                                          */
/* =================================================================== */

export default function DevOpsGuide() {
  const [activeTab, setActiveTab] = useState('lifecycle');
  const [expandedPhases, setExpandedPhases] = useState({});
  const [completedCISteps, setCompletedCISteps] = useState({});
  const [checklistState, setChecklistState] = useState({});
  const [expandedRegistries, setExpandedRegistries] = useState({});
  const [expandedStrategies, setExpandedStrategies] = useState({});
  const [expandedStages, setExpandedStages] = useState({});
  const [expandedReviewSteps, setExpandedReviewSteps] = useState({});

  const togglePhase = (idx) => setExpandedPhases((p) => ({ ...p, [idx]: !p[idx] }));
  const toggleCIStep = (idx) => setCompletedCISteps((p) => ({ ...p, [idx]: !p[idx] }));
  const toggleChecklist = (section, idx) => {
    const key = `${section}-${idx}`;
    setChecklistState((p) => ({ ...p, [key]: !p[key] }));
  };
  const toggleRegistry = (idx) => setExpandedRegistries((p) => ({ ...p, [idx]: !p[idx] }));
  const toggleStrategy = (idx) => setExpandedStrategies((p) => ({ ...p, [idx]: !p[idx] }));
  const toggleStage = (idx) => setExpandedStages((p) => ({ ...p, [idx]: !p[idx] }));
  const toggleReviewStep = (idx) => setExpandedReviewSteps((p) => ({ ...p, [idx]: !p[idx] }));

  /* ── Computed ── */
  const ciCompleted = Object.values(completedCISteps).filter(Boolean).length;
  const ciPercent = Math.round((ciCompleted / CI_STEPS.length) * 100);

  const totalChecklistItems = CHECKLIST_SECTIONS.reduce((s, sec) => s + sec.items.length, 0);
  const completedChecklistItems = Object.values(checklistState).filter(Boolean).length;
  const checklistPercent = Math.round((completedChecklistItems / totalChecklistItems) * 100);

  /* ── Styles ── */
  const styles = {
    page: { background: '#ffffff', minHeight: '100vh', padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1e293b' },
    header: { marginBottom: 24 },
    title: { fontSize: 28, fontWeight: 700, margin: 0, color: '#0f172a' },
    subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
    tabBar: { display: 'flex', gap: 0, borderBottom: '2px solid #e2e8f0', marginBottom: 24, overflowX: 'auto', whiteSpace: 'nowrap' },
    tab: (active) => ({
      padding: '10px 18px', cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
      color: active ? '#3b82f6' : '#64748b', borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
      marginBottom: -2, transition: 'all 0.2s', background: 'none', border: 'none', borderBottomWidth: 2, borderBottomStyle: 'solid',
      borderBottomColor: active ? '#3b82f6' : 'transparent',
    }),
    card: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    sectionTitle: { fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#0f172a' },
    badge: (color) => ({
      display: 'inline-block', padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
      background: color + '15', color: color, border: `1px solid ${color}30`,
    }),
    priorityBadge: (priority) => {
      const colors = { P0: '#ef4444', P1: '#f59e0b', P2: '#3b82f6' };
      const c = colors[priority] || '#64748b';
      return { display: 'inline-block', padding: '1px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: c + '15', color: c, marginLeft: 8 };
    },
    flowContainer: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, justifyContent: 'center', padding: '24px 0' },
    flowNode: (color) => ({
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    }),
    flowCircle: (color) => ({
      width: 72, height: 72, borderRadius: '50%', background: color + '15', border: `3px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: color,
      cursor: 'pointer', transition: 'all 0.2s',
    }),
    flowLabel: { fontSize: 12, fontWeight: 600, color: '#334155', textAlign: 'center' },
    arrow: { fontSize: 22, color: '#94a3b8', fontWeight: 700 },
    expandCard: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 12, transition: 'all 0.3s' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
    th: { textAlign: 'left', padding: '10px 12px', background: '#f1f5f9', fontWeight: 600, fontSize: 12, color: '#475569', borderBottom: '2px solid #e2e8f0' },
    td: { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', color: '#334155' },
    progressBar: (percent, color) => ({
      width: '100%', height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', position: 'relative',
    }),
    progressFill: (percent, color) => ({
      width: `${percent}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s ease',
    }),
    tag: (color) => ({
      display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500,
      background: color + '12', color: color, marginRight: 6, marginBottom: 4,
    }),
    checkbox: { width: 18, height: 18, cursor: 'pointer', accentColor: '#3b82f6' },
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 16 },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 },
    gaugeContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
    pillarCard: (color) => ({
      background: color + '08', border: `2px solid ${color}30`, borderRadius: 12, padding: 20, textAlign: 'center',
    }),
    stepLine: { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20, position: 'relative' },
    stepDot: (color) => ({
      width: 36, height: 36, borderRadius: '50%', background: color, color: '#fff', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
    }),
    connector: { position: 'absolute', left: 17, top: 36, width: 2, height: 'calc(100% - 16px)', background: '#e2e8f0' },
    scoreCircle: (percent, color) => ({
      width: 120, height: 120, borderRadius: '50%', border: `6px solid ${color}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: color + '08', margin: '0 auto',
    }),
    pyramidContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '24px 0' },
  };

  /* ── Tab: DevOps Lifecycle ── */
  const renderLifecycle = () => (
    <div>
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>DevOps Infinite Loop</h3>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Click any phase to expand details. The DevOps lifecycle is a continuous loop where monitoring feeds back into planning.</p>
        <div style={styles.flowContainer}>
          {LIFECYCLE_PHASES.map((phase, i) => (
            <React.Fragment key={phase.name}>
              <div style={styles.flowNode(phase.color)}>
                <div style={{ ...styles.flowCircle(phase.color), background: expandedPhases[i] ? phase.color : phase.color + '15', color: expandedPhases[i] ? '#fff' : phase.color }}
                  onClick={() => togglePhase(i)} title={`Click to ${expandedPhases[i] ? 'collapse' : 'expand'} ${phase.name}`}>
                  {phase.icon}
                </div>
                <span style={styles.flowLabel}>{phase.name}</span>
              </div>
              {i < LIFECYCLE_PHASES.length - 1 && <span style={styles.arrow}>&rarr;</span>}
              {i === LIFECYCLE_PHASES.length - 1 && <span style={{ ...styles.arrow, color: '#22c55e' }}>&orarr;</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {LIFECYCLE_PHASES.map((phase, i) => expandedPhases[i] && (
        <div key={phase.name} style={{ ...styles.expandCard, borderLeft: `4px solid ${phase.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ ...styles.stepDot(phase.color) }}>{phase.icon}</div>
            <div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{phase.name} Phase</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{phase.description}</p>
            </div>
          </div>
          <div style={styles.grid2}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Tools</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {phase.tools.map((t) => <span key={t} style={styles.tag(phase.color)}>{t}</span>)}
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginTop: 12, marginBottom: 6 }}>Key Activities</p>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: '#334155' }}>
                {phase.activities.map((a) => <li key={a} style={{ marginBottom: 2 }}>{a}</li>)}
              </ul>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Output Artifacts</p>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: '#334155' }}>
                {phase.artifacts.map((a) => <li key={a} style={{ marginBottom: 2 }}>{a}</li>)}
              </ul>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginTop: 12, marginBottom: 6 }}>Key Metrics</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {phase.metrics.map((m) => <span key={m} style={styles.badge(phase.color)}>{m}</span>)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  /* ── Tab: Registry & Artifacts ── */
  const renderRegistry = () => (
    <div>
      <div style={{ ...styles.card, background: '#f8fafc', marginBottom: 24 }}>
        <h3 style={styles.sectionTitle}>Registry Types in DevOps Pipeline</h3>
        <p style={{ fontSize: 13, color: '#64748b' }}>Registries are centralized storage systems that hold different types of artifacts throughout the software delivery lifecycle. Click any card to expand full details.</p>
      </div>
      <div style={styles.grid2}>
        {REGISTRIES.map((reg, i) => (
          <div key={reg.type} style={{ ...styles.card, borderTop: `3px solid ${reg.color}`, cursor: 'pointer', background: expandedRegistries[i] ? reg.bg : '#fff' }}
            onClick={() => toggleRegistry(i)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: reg.color + '15', border: `2px solid ${reg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: reg.color }}>
                {reg.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{reg.type}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                  {reg.tools.map((t) => <span key={t} style={styles.tag(reg.color)}>{t}</span>)}
                </div>
              </div>
              <span style={{ fontSize: 18, color: '#94a3b8', transform: expandedRegistries[i] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>&#9660;</span>
            </div>
            {expandedRegistries[i] && (
              <div style={{ fontSize: 13, color: '#334155', borderTop: '1px solid #e2e8f0', paddingTop: 12, marginTop: 8 }}>
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 600, color: '#475569', marginBottom: 4, fontSize: 12 }}>Purpose</p>
                  <p style={{ margin: 0 }}>{reg.purpose}</p>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 600, color: '#475569', marginBottom: 4, fontSize: 12 }}>Pipeline Integration</p>
                  <p style={{ margin: 0 }}>{reg.pipelineFit}</p>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 600, color: '#475569', marginBottom: 4, fontSize: 12 }}>Storage Format</p>
                  <p style={{ margin: 0 }}>{reg.storageFormat}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: '#475569', marginBottom: 4, fontSize: 12 }}>Versioning Strategy</p>
                  <p style={{ margin: 0 }}>{reg.versioning}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Tab: CI Flow ── */
  const renderCI = () => (
    <div>
      {/* Score Tracker */}
      <div style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={styles.scoreCircle(ciPercent, '#3b82f6')}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6' }}>{ciPercent}%</span>
          <span style={{ fontSize: 10, color: '#64748b' }}>Complete</span>
        </div>
        <div style={{ flex: 1, minWidth: 250 }}>
          <h3 style={{ ...styles.sectionTitle, marginBottom: 8 }}>CI Pipeline Progress</h3>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Track your understanding of each CI step. Click the step numbers to mark as completed. {ciCompleted} of {CI_STEPS.length} steps understood.</p>
          <div style={styles.progressBar(ciPercent, '#3b82f6')}>
            <div style={styles.progressFill(ciPercent, '#3b82f6')} />
          </div>
        </div>
      </div>

      {/* Flow diagram */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>CI Pipeline Flow</h3>
        <div style={styles.flowContainer}>
          {CI_STEPS.map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={styles.flowNode(step.color)}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: completedCISteps[i] ? step.color : step.color + '15',
                  border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: completedCISteps[i] ? '#fff' : step.color,
                  cursor: 'pointer', transition: 'all 0.2s',
                }} onClick={() => toggleCIStep(i)} title={`Mark ${step.label} as ${completedCISteps[i] ? 'incomplete' : 'complete'}`}>
                  {completedCISteps[i] ? '\u2713' : step.icon}
                </div>
                <span style={{ ...styles.flowLabel, fontSize: 10, maxWidth: 70 }}>{step.label}</span>
              </div>
              {i < CI_STEPS.length - 1 && <span style={{ ...styles.arrow, fontSize: 16 }}>&rarr;</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Details */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Step-by-Step Breakdown</h3>
        {CI_STEPS.map((step, i) => (
          <div key={step.label} style={styles.stepLine}>
            {i < CI_STEPS.length - 1 && <div style={styles.connector} />}
            <div style={{ ...styles.stepDot(step.color), cursor: 'pointer' }} onClick={() => toggleCIStep(i)}>
              {completedCISteps[i] ? '\u2713' : step.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{step.label}</span>
                {completedCISteps[i] && <span style={styles.badge('#22c55e')}>Understood</span>}
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tools Comparison */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>CI Tools Comparison</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tool</th>
                <th style={styles.th}>Hosting</th>
                <th style={styles.th}>Config Format</th>
                <th style={styles.th}>Pricing</th>
                <th style={styles.th}>Ecosystem</th>
                <th style={styles.th}>Learning Curve</th>
                <th style={styles.th}>Best For</th>
              </tr>
            </thead>
            <tbody>
              {CI_TOOLS.map((tool) => (
                <tr key={tool.name}>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{tool.name}</td>
                  <td style={styles.td}>{tool.hosting}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 12 }}>{tool.config}</td>
                  <td style={styles.td}>{tool.pricing}</td>
                  <td style={styles.td}>{tool.ecosystem}</td>
                  <td style={styles.td}>
                    <span style={styles.badge(tool.learningCurve === 'Low' ? '#22c55e' : tool.learningCurve === 'Medium' ? '#f59e0b' : '#ef4444')}>
                      {tool.learningCurve}
                    </span>
                  </td>
                  <td style={styles.td}>{tool.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ── Tab: CD Flow ── */
  const renderCD = () => (
    <div>
      {/* CD Flow Diagram */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>CD Pipeline Flow</h3>
        <div style={styles.flowContainer}>
          {CD_STEPS.map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={styles.flowNode(step.color)}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: step.color + '15',
                  border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: step.color,
                }}>
                  {step.icon}
                </div>
                <span style={{ ...styles.flowLabel, fontSize: 11, maxWidth: 80 }}>{step.label}</span>
              </div>
              {i < CD_STEPS.length - 1 && <span style={{ ...styles.arrow, fontSize: 18 }}>&rarr;</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* CD Step Details */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Pipeline Steps Explained</h3>
        {CD_STEPS.map((step, i) => (
          <div key={step.label} style={styles.stepLine}>
            {i < CD_STEPS.length - 1 && <div style={styles.connector} />}
            <div style={styles.stepDot(step.color)}>{step.icon}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: 4 }}>{step.label}</span>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Deployment Strategies */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Deployment Strategies</h3>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Click a strategy card to view detailed pros, cons, and visual explanation.</p>
      </div>

      <div style={styles.grid2}>
        {DEPLOYMENT_STRATEGIES.map((strat, i) => (
          <div key={strat.name} style={{ ...styles.card, borderTop: `3px solid ${strat.color}`, cursor: 'pointer' }}
            onClick={() => toggleStrategy(i)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: strat.color }}>{strat.name}</h4>
              <span style={{ fontSize: 18, color: '#94a3b8', transform: expandedStrategies[i] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>&#9660;</span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0, marginBottom: expandedStrategies[i] ? 12 : 0 }}>{strat.description}</p>

            {expandedStrategies[i] && (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, marginTop: 8 }}>
                {/* Strategy Visual */}
                {strat.name === 'Blue-Green' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 80, height: 50, borderRadius: 8, background: '#3b82f620', border: '2px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#3b82f6', fontSize: 14 }}>Blue v1</div>
                      <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>LIVE</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 20 }}>&harr;</span>
                      <span style={{ fontSize: 10, color: '#64748b' }}>Switch</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 80, height: 50, borderRadius: 8, background: '#22c55e20', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#22c55e', fontSize: 14 }}>Green v2</div>
                      <span style={{ fontSize: 10, color: '#64748b' }}>IDLE</span>
                    </div>
                  </div>
                )}
                {strat.name === 'Canary' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                    {['1%', '10%', '50%', '100%'].map((pct, j) => (
                      <React.Fragment key={pct}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ width: 56, height: 40, borderRadius: 6, background: '#f59e0b20', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#f59e0b', fontSize: 12 }}>{pct}</div>
                          <span style={{ fontSize: 9, color: '#64748b' }}>Stage {j + 1}</span>
                        </div>
                        {j < 3 && <span style={{ fontSize: 14, color: '#94a3b8' }}>&rarr;</span>}
                      </React.Fragment>
                    ))}
                  </div>
                )}
                {strat.name === 'Rolling Update' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                    {[1, 2, 3, 4, 5].map((inst) => (
                      <div key={inst} style={{ textAlign: 'center' }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 8,
                          background: inst <= 2 ? '#22c55e20' : '#94a3b815',
                          border: `2px solid ${inst <= 2 ? '#22c55e' : '#94a3b8'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                          color: inst <= 2 ? '#22c55e' : '#94a3b8', fontSize: 11,
                        }}>
                          {inst <= 2 ? 'v2' : 'v1'}
                        </div>
                        <span style={{ fontSize: 9, color: '#64748b' }}>Inst {inst}</span>
                      </div>
                    ))}
                  </div>
                )}
                {strat.name === 'A/B Testing' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 70, height: 40, borderRadius: 6, background: '#8b5cf620', border: '2px solid #8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#8b5cf6', fontSize: 12 }}>Group A</div>
                      <span style={{ fontSize: 9, color: '#64748b' }}>Feature ON</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ padding: '4px 12px', background: '#e2e8f0', borderRadius: 12, fontSize: 11, color: '#475569' }}>Router</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 70, height: 40, borderRadius: 6, background: '#94a3b815', border: '2px solid #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#94a3b8', fontSize: 12 }}>Group B</div>
                      <span style={{ fontSize: 9, color: '#64748b' }}>Feature OFF</span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#22c55e', fontSize: 12, marginBottom: 6 }}>Advantages</p>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#334155' }}>
                      {strat.pros.map((p) => <li key={p} style={{ marginBottom: 3 }}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: '#ef4444', fontSize: 12, marginBottom: 6 }}>Disadvantages</p>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#334155' }}>
                      {strat.cons.map((c) => <li key={c} style={{ marginBottom: 3 }}>{c}</li>)}
                    </ul>
                  </div>
                </div>
                <div style={{ marginTop: 12, padding: '8px 12px', background: strat.color + '10', borderRadius: 6, fontSize: 12, color: '#334155' }}>
                  <strong>Best Use Case:</strong> {strat.useCase}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Tab: Continuous Testing ── */
  const renderTesting = () => (
    <div>
      {/* Testing Pyramid */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Testing Pyramid</h3>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>The testing pyramid shows the ideal distribution of test types. More fast, cheap unit tests at the bottom; fewer slow, expensive E2E tests at the top.</p>
        <div style={styles.pyramidContainer}>
          {/* E2E - top, narrowest */}
          <div style={{ width: 160, height: 56, background: '#ef444420', border: '2px solid #ef4444', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#ef4444' }}>E2E Tests</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>10% - Slow, Expensive</span>
          </div>
          {/* Integration - middle */}
          <div style={{ width: 300, height: 56, background: '#f59e0b20', border: '2px solid #f59e0b', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#f59e0b' }}>Integration Tests</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>30% - Moderate Speed & Cost</span>
          </div>
          {/* Unit - bottom, widest */}
          <div style={{ width: 460, height: 56, background: '#22c55e20', border: '2px solid #22c55e', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#22c55e' }}>Unit Tests</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>60% - Fast, Cheap, Isolated</span>
          </div>
        </div>
      </div>

      {/* Testing Stages Pipeline */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Testing Stages in Pipeline</h3>
        <div style={styles.flowContainer}>
          {TESTING_STAGES.map((stage, i) => (
            <React.Fragment key={stage.stage}>
              <div style={styles.flowNode(stage.color)}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: expandedStages[i] ? stage.color : stage.color + '15',
                  border: `2px solid ${stage.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: expandedStages[i] ? '#fff' : stage.color,
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', padding: 4,
                }} onClick={() => toggleStage(i)}>
                  {i + 1}
                </div>
                <span style={{ ...styles.flowLabel, fontSize: 10, maxWidth: 80 }}>{stage.stage}</span>
              </div>
              {i < TESTING_STAGES.length - 1 && <span style={{ ...styles.arrow, fontSize: 16 }}>&rarr;</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Stage Details */}
      {TESTING_STAGES.map((stage, i) => expandedStages[i] && (
        <div key={stage.stage} style={{ ...styles.expandCard, borderLeft: `4px solid ${stage.color}` }}>
          <h4 style={{ margin: 0, marginBottom: 12, fontSize: 16, fontWeight: 600, color: stage.color }}>{stage.stage}</h4>
          <div style={styles.grid2}>
            <div>
              <p style={{ fontWeight: 600, color: '#475569', fontSize: 12, marginBottom: 6 }}>Tests Executed</p>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: '#334155' }}>
                {stage.tests.map((t) => <li key={t} style={{ marginBottom: 3 }}>{t}</li>)}
              </ul>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#475569', fontSize: 12, marginBottom: 6 }}>Tools</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                {stage.tools.map((t) => <span key={t} style={styles.tag(stage.color)}>{t}</span>)}
              </div>
              <p style={{ fontWeight: 600, color: '#475569', fontSize: 12, marginBottom: 4 }}>Target Duration</p>
              <p style={{ margin: 0, fontSize: 13, color: '#334155', marginBottom: 8 }}>{stage.duration}</p>
              <p style={{ fontWeight: 600, color: '#475569', fontSize: 12, marginBottom: 4 }}>On Failure</p>
              <p style={{ margin: 0, fontSize: 13, color: '#ef4444' }}>{stage.failureAction}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Quick reference card for all stages */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Testing Stages Quick Reference</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Stage</th>
                <th style={styles.th}>Duration Target</th>
                <th style={styles.th}>Primary Tools</th>
                <th style={styles.th}>Failure Action</th>
              </tr>
            </thead>
            <tbody>
              {TESTING_STAGES.map((stage) => (
                <tr key={stage.stage}>
                  <td style={{ ...styles.td, fontWeight: 600 }}>
                    <span style={{ ...styles.badge(stage.color), marginRight: 8 }}>{stage.stage}</span>
                  </td>
                  <td style={styles.td}>{stage.duration}</td>
                  <td style={styles.td}>{stage.tools.join(', ')}</td>
                  <td style={{ ...styles.td, fontSize: 12, color: '#ef4444' }}>{stage.failureAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ── Tab: Monitoring ── */
  const renderMonitoring = () => {
    const cpuValue = 67;
    const memoryValue = 54;
    const requestRate = 1247;
    const errorRate = 2.3;
    const responseTime = 142;
    const activeAlerts = 3;

    const GaugeCircle = ({ label, value, max, unit, color }) => {
      const pct = Math.round((value / max) * 100);
      const circumference = 2 * Math.PI * 42;
      const dashOffset = circumference - (pct / 100) * circumference;
      return (
        <div style={styles.gaugeContainer}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
            <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>{value}</text>
            <text x="50" y="62" textAnchor="middle" fontSize="10" fill="#64748b">{unit}</text>
          </svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{label}</span>
        </div>
      );
    };

    const MetricBar = ({ label, value, max, unit, color }) => {
      const pct = Math.min(Math.round((value / max) * 100), 100);
      return (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: color }}>{value} {unit}</span>
          </div>
          <div style={styles.progressBar(pct, color)}>
            <div style={styles.progressFill(pct, color)} />
          </div>
        </div>
      );
    };

    return (
      <div>
        {/* Three Pillars */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Three Pillars of Observability</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={styles.pillarCard('#3b82f6')}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>&#128196;</div>
              <h4 style={{ margin: 0, marginBottom: 8, color: '#3b82f6', fontSize: 16 }}>Logs</h4>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Timestamped records of discrete events. Structured JSON logs with correlation IDs enable search, filtering, and root cause analysis.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginTop: 8 }}>
                {['ELK Stack', 'Loki', 'CloudWatch'].map((t) => <span key={t} style={styles.tag('#3b82f6')}>{t}</span>)}
              </div>
            </div>
            <div style={styles.pillarCard('#f59e0b')}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>&#128200;</div>
              <h4 style={{ margin: 0, marginBottom: 8, color: '#f59e0b', fontSize: 16 }}>Metrics</h4>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Numerical measurements aggregated over time. CPU, memory, request rates, error rates, latency percentiles (P50, P95, P99).</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginTop: 8 }}>
                {['Prometheus', 'Grafana', 'Datadog'].map((t) => <span key={t} style={styles.tag('#f59e0b')}>{t}</span>)}
              </div>
            </div>
            <div style={styles.pillarCard('#8b5cf6')}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>&#128279;</div>
              <h4 style={{ margin: 0, marginBottom: 8, color: '#8b5cf6', fontSize: 16 }}>Traces</h4>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Follow a request's journey across services. Distributed tracing shows latency breakdown, bottlenecks, and service dependencies.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginTop: 8 }}>
                {['Jaeger', 'Zipkin', 'OpenTelemetry'].map((t) => <span key={t} style={styles.tag('#8b5cf6')}>{t}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Operations Dashboard (Mockup)</h3>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24, padding: 20, background: '#f8fafc', borderRadius: 8 }}>
            <GaugeCircle label="CPU Usage" value={cpuValue} max={100} unit="%" color="#3b82f6" />
            <GaugeCircle label="Memory" value={memoryValue} max={100} unit="%" color="#8b5cf6" />
            <div style={{ ...styles.gaugeContainer, justifyContent: 'center' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', border: `4px solid ${activeAlerts > 0 ? '#ef4444' : '#22c55e'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: activeAlerts > 0 ? '#fef2f2' : '#f0fdf4' }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: activeAlerts > 0 ? '#ef4444' : '#22c55e' }}>{activeAlerts}</span>
                <span style={{ fontSize: 9, color: '#64748b' }}>Active</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Alerts</span>
            </div>
          </div>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <MetricBar label="Request Rate" value={requestRate} max={5000} unit="req/min" color="#3b82f6" />
            <MetricBar label="Error Rate" value={errorRate} max={10} unit="%" color="#ef4444" />
            <MetricBar label="Response Time (P99)" value={responseTime} max={500} unit="ms" color="#f59e0b" />
          </div>
        </div>

        {/* Tools Comparison */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Monitoring Tools Comparison</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Tool</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Key Strength</th>
                  <th style={styles.th}>Best For</th>
                </tr>
              </thead>
              <tbody>
                {MONITORING_TOOLS.map((tool) => (
                  <tr key={tool.name}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{tool.name}</td>
                    <td style={styles.td}><span style={styles.badge(tool.type === 'SaaS' ? '#f59e0b' : '#22c55e')}>{tool.category}</span></td>
                    <td style={styles.td}><span style={styles.badge(tool.type === 'SaaS' ? '#8b5cf6' : '#3b82f6')}>{tool.type}</span></td>
                    <td style={styles.td}>{tool.strength}</td>
                    <td style={styles.td}>{tool.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ── Tab: Code Review ── */
  const renderCodeReview = () => (
    <div>
      {/* Review Workflow */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Code Review Workflow</h3>
        <div style={styles.flowContainer}>
          {REVIEW_STEPS.map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={styles.flowNode(step.color)}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: expandedReviewSteps[i] ? step.color : step.color + '15',
                  border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: expandedReviewSteps[i] ? '#fff' : step.color,
                  cursor: 'pointer', transition: 'all 0.2s',
                }} onClick={() => toggleReviewStep(i)}>
                  {step.icon}
                </div>
                <span style={{ ...styles.flowLabel, fontSize: 10, maxWidth: 70 }}>{step.label}</span>
              </div>
              {i < REVIEW_STEPS.length - 1 && <span style={{ ...styles.arrow, fontSize: 16 }}>&rarr;</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Review Step Details */}
      {REVIEW_STEPS.map((step, i) => expandedReviewSteps[i] && (
        <div key={step.label} style={{ ...styles.expandCard, borderLeft: `4px solid ${step.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={styles.stepDot(step.color)}>{step.icon}</div>
            <div>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{step.label}</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', marginTop: 4 }}>{step.desc}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Rejection Reasons */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Top 10 Code Rejection Reasons</h3>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Common reasons PRs get rejected during code review, with examples and the correct fix.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: 30 }}>#</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Severity</th>
                <th style={styles.th}>Bad Example</th>
                <th style={styles.th}>Correct Fix</th>
              </tr>
            </thead>
            <tbody>
              {REJECTION_REASONS.map((r, i) => (
                <tr key={r.reason}>
                  <td style={{ ...styles.td, fontWeight: 700, color: '#94a3b8' }}>{i + 1}</td>
                  <td style={{ ...styles.td, fontWeight: 600, minWidth: 140 }}>{r.reason}</td>
                  <td style={styles.td}>
                    <span style={styles.badge(r.severity === 'Critical' ? '#ef4444' : r.severity === 'High' ? '#f59e0b' : r.severity === 'Medium' ? '#3b82f6' : '#22c55e')}>
                      {r.severity}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 11, color: '#ef4444', maxWidth: 300, wordBreak: 'break-word' }}>{r.example}</td>
                  <td style={{ ...styles.td, fontSize: 12, color: '#22c55e', maxWidth: 300, wordBreak: 'break-word' }}>{r.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Correction Workflow */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Code Correction Workflow</h3>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>When a PR is rejected, follow this correction workflow to address all review feedback systematically.</p>
        <div style={styles.flowContainer}>
          {[
            { label: 'Rejection', color: '#ef4444', icon: 'X' },
            { label: 'Fix Issues', color: '#f59e0b', icon: 'FI' },
            { label: 'Re-push', color: '#8b5cf6', icon: 'RP' },
            { label: 'Re-review', color: '#6366f1', icon: 'RR' },
            { label: 'Approve', color: '#22c55e', icon: 'OK' },
            { label: 'Merge', color: '#10b981', icon: 'MG' },
          ].map((step, i, arr) => (
            <React.Fragment key={step.label}>
              <div style={styles.flowNode(step.color)}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', background: step.color + '15',
                  border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: step.color,
                }}>
                  {step.icon}
                </div>
                <span style={{ ...styles.flowLabel, fontSize: 11 }}>{step.label}</span>
              </div>
              {i < arr.length - 1 && <span style={{ ...styles.arrow, fontSize: 16 }}>&rarr;</span>}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12, marginTop: 16 }}>
          <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8, borderLeft: '3px solid #ef4444' }}>
            <p style={{ fontWeight: 600, fontSize: 13, color: '#ef4444', margin: 0, marginBottom: 4 }}>1. Understand Feedback</p>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Read all reviewer comments carefully. Ask clarifying questions if needed.</p>
          </div>
          <div style={{ padding: 12, background: '#fffbeb', borderRadius: 8, borderLeft: '3px solid #f59e0b' }}>
            <p style={{ fontWeight: 600, fontSize: 13, color: '#f59e0b', margin: 0, marginBottom: 4 }}>2. Address Each Comment</p>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Fix each issue individually. Reply to each comment explaining the change made.</p>
          </div>
          <div style={{ padding: 12, background: '#f5f3ff', borderRadius: 8, borderLeft: '3px solid #8b5cf6' }}>
            <p style={{ fontWeight: 600, fontSize: 13, color: '#8b5cf6', margin: 0, marginBottom: 4 }}>3. Run Tests Locally</p>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Ensure all tests pass before pushing. Check linting and coverage thresholds.</p>
          </div>
          <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8, borderLeft: '3px solid #22c55e' }}>
            <p style={{ fontWeight: 600, fontSize: 13, color: '#22c55e', margin: 0, marginBottom: 4 }}>4. Request Re-review</p>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Push fixes, re-request review. Summarize changes made in a PR comment.</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Tab: Operations Checklist ── */
  const renderChecklist = () => (
    <div>
      {/* Overall Score */}
      <div style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={styles.scoreCircle(checklistPercent, checklistPercent >= 80 ? '#22c55e' : checklistPercent >= 50 ? '#f59e0b' : '#ef4444')}>
          <span style={{ fontSize: 28, fontWeight: 700, color: checklistPercent >= 80 ? '#22c55e' : checklistPercent >= 50 ? '#f59e0b' : '#ef4444' }}>
            {checklistPercent}%
          </span>
          <span style={{ fontSize: 10, color: '#64748b' }}>Complete</span>
        </div>
        <div style={{ flex: 1, minWidth: 250 }}>
          <h3 style={{ ...styles.sectionTitle, marginBottom: 8 }}>Operations Readiness Score</h3>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
            {completedChecklistItems} of {totalChecklistItems} items completed. Check off each item as your team completes it.
          </p>
          <div style={styles.progressBar(checklistPercent, checklistPercent >= 80 ? '#22c55e' : checklistPercent >= 50 ? '#f59e0b' : '#ef4444')}>
            <div style={styles.progressFill(checklistPercent, checklistPercent >= 80 ? '#22c55e' : checklistPercent >= 50 ? '#f59e0b' : '#ef4444')} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12 }}>
            <span style={{ color: '#ef4444' }}>0-49%: Not Ready</span>
            <span style={{ color: '#f59e0b' }}>50-79%: In Progress</span>
            <span style={{ color: '#22c55e' }}>80-100%: Production Ready</span>
          </div>
        </div>
      </div>

      {/* Section Checklists */}
      {CHECKLIST_SECTIONS.map((sec) => {
        const secCompleted = sec.items.filter((_, idx) => checklistState[`${sec.section}-${idx}`]).length;
        const secPercent = Math.round((secCompleted / sec.items.length) * 100);
        return (
          <div key={sec.section} style={{ ...styles.card, borderLeft: `4px solid ${sec.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: sec.color + '15', border: `2px solid ${sec.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: sec.color }}>
                  {sec.icon}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{sec.section}</h4>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{secCompleted} / {sec.items.length} completed</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, ...styles.progressBar(secPercent, sec.color) }}>
                  <div style={styles.progressFill(secPercent, sec.color)} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: sec.color, minWidth: 32 }}>{secPercent}%</span>
              </div>
            </div>
            {sec.items.map((item, idx) => {
              const key = `${sec.section}-${idx}`;
              const checked = checklistState[key];
              return (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', marginBottom: 4,
                  background: checked ? '#f0fdf4' : '#fff', borderRadius: 6, border: `1px solid ${checked ? '#22c55e30' : '#f1f5f9'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                }} onClick={() => toggleChecklist(sec.section, idx)}>
                  <input type="checkbox" checked={!!checked} readOnly style={styles.checkbox} />
                  <span style={{ flex: 1, fontSize: 13, color: checked ? '#22c55e' : '#334155', textDecoration: checked ? 'line-through' : 'none', transition: 'all 0.2s' }}>
                    {item.text}
                  </span>
                  <span style={styles.priorityBadge(item.priority)}>{item.priority}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  /* ── Render active tab ── */
  const renderContent = () => {
    switch (activeTab) {
      case 'lifecycle': return renderLifecycle();
      case 'registry': return renderRegistry();
      case 'ci': return renderCI();
      case 'cd': return renderCD();
      case 'testing': return renderTesting();
      case 'monitoring': return renderMonitoring();
      case 'codereview': return renderCodeReview();
      case 'checklist': return renderChecklist();
      default: return null;
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>DevOps Complete Guide</h1>
        <p style={styles.subtitle}>Comprehensive DevOps flow with interactive components to understand and learn every phase of the software delivery lifecycle.</p>
      </div>
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <button key={tab.id} style={styles.tab(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
}

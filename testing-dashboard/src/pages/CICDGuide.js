import React, { useState } from 'react';

/* ===================================================================
   CI/CD Operations Guide
   Tabs: Pipeline Overview | Branch Strategy | Code Review |
         Testing Operations | Deployment | Tools Comparison
   =================================================================== */

const TABS = [
  { id: 'pipeline', label: 'Pipeline Overview' },
  { id: 'branching', label: 'Branch Strategy' },
  { id: 'codereview', label: 'Code Review' },
  { id: 'testing', label: 'Testing Operations' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'tools', label: 'Tools Comparison' },
];

/* ── Mock Data ── */

const PIPELINE_RUNS = [
  { id: '#1247', branch: 'feature/payment-gateway', status: 'pass', duration: '4m 32s', triggeredBy: 'Rajesh K.', date: '2026-02-24 09:15' },
  { id: '#1246', branch: 'fix/login-validation', status: 'pass', duration: '3m 18s', triggeredBy: 'Priya S.', date: '2026-02-24 08:42' },
  { id: '#1245', branch: 'feature/report-export', status: 'fail', duration: '5m 01s', triggeredBy: 'Deepa M.', date: '2026-02-23 17:30' },
  { id: '#1244', branch: 'develop', status: 'pass', duration: '6m 12s', triggeredBy: 'Auto Merge', date: '2026-02-23 16:05' },
  { id: '#1243', branch: 'hotfix/db-timeout', status: 'pass', duration: '2m 48s', triggeredBy: 'Arun V.', date: '2026-02-23 14:22' },
  { id: '#1242', branch: 'feature/user-profile', status: 'fail', duration: '4m 55s', triggeredBy: 'Kavitha R.', date: '2026-02-23 11:10' },
  { id: '#1241', branch: 'release/v2.3.0', status: 'pass', duration: '7m 30s', triggeredBy: 'Release Bot', date: '2026-02-22 20:00' },
  { id: '#1240', branch: 'feature/notifications', status: 'pass', duration: '3m 44s', triggeredBy: 'Suresh P.', date: '2026-02-22 15:38' },
];

const PIPELINE_STEPS = [
  { label: 'Code Commit', icon: 'C', color: '#3b82f6' },
  { label: 'Lint & Format', icon: 'L', color: '#6366f1' },
  { label: 'Unit Tests', icon: 'U', color: '#8b5cf6' },
  { label: 'Integration Tests', icon: 'I', color: '#a855f7' },
  { label: 'Security Scan', icon: 'S', color: '#d946ef' },
  { label: 'Build', icon: 'B', color: '#ec4899' },
  { label: 'Staging Deploy', icon: 'D', color: '#f43f5e' },
  { label: 'Smoke Test', icon: 'T', color: '#ef4444' },
  { label: 'Prod Deploy', icon: 'P', color: '#f97316' },
  { label: 'Monitor', icon: 'M', color: '#22c55e' },
];

const BRANCH_RULES = [
  { branch: 'main', protected: 'Yes', requiresPR: 'Yes', requiresReview: '2 approvers', autoDeploy: 'Production' },
  { branch: 'develop', protected: 'Yes', requiresPR: 'Yes', requiresReview: '1 approver', autoDeploy: 'Staging' },
  { branch: 'feature/*', protected: 'No', requiresPR: 'Yes to develop', requiresReview: '1 approver', autoDeploy: 'Preview' },
  { branch: 'fix/*', protected: 'No', requiresPR: 'Yes to develop', requiresReview: '1 approver', autoDeploy: 'Preview' },
  { branch: 'release/*', protected: 'No', requiresPR: 'Yes to main', requiresReview: '2 approvers', autoDeploy: 'Staging' },
  { branch: 'hotfix/*', protected: 'No', requiresPR: 'Yes to main', requiresReview: '2 approvers', autoDeploy: 'Production' },
];

const REVIEW_CHECKLIST = {
  Functionality: [
    'Business logic is correct and matches requirements',
    'Edge cases are handled (null, empty, boundary values)',
    'Error handling covers all failure paths',
    'No regression in existing functionality',
  ],
  Security: [
    'No secrets, passwords, or API keys in code',
    'Input validation on all user-facing endpoints',
    'SQL queries use parameterized placeholders (no f-strings)',
    'Authentication and authorization checks in place',
    'CORS configured with restricted origins (no wildcard)',
  ],
  'Code Quality': [
    'Naming conventions are consistent and descriptive',
    'No duplicated code (DRY principle applied)',
    'Single responsibility: functions/classes do one thing',
    'Clean imports (no unused, properly ordered)',
  ],
  Testing: [
    'Unit tests added for new functionality',
    'Integration tests cover cross-module flows',
    'Edge cases and error paths are tested',
    'Coverage remains above 80% threshold',
  ],
  Documentation: [
    'API documentation updated (if endpoints changed)',
    'README updated for new setup steps',
    'CHANGELOG entry added for user-facing changes',
    'Inline comments explain non-obvious logic',
  ],
};

const TESTING_PHASES = [
  { phase: 'Unit', type: 'Unit Testing', tool: 'Jest, Pytest', who: 'Developer', when: 'Every commit', deliverable: 'Test report' },
  { phase: 'Integration', type: 'API Testing', tool: 'SoapUI, Postman', who: 'QA', when: 'Every PR', deliverable: 'Test results' },
  { phase: 'Functional', type: 'Manual Testing', tool: 'Dashboard, Browser', who: 'QA', when: 'Sprint cycle', deliverable: 'Test execution report' },
  { phase: 'Regression', type: 'Automated Regression', tool: 'Selenium, Cypress', who: 'QA', when: 'Pre-release', deliverable: 'Regression report' },
  { phase: 'Performance', type: 'Load Testing', tool: 'JMeter, k6', who: 'QA / DevOps', when: 'Pre-release', deliverable: 'Performance report' },
  { phase: 'Security', type: 'Security Testing', tool: 'OWASP ZAP, Burp', who: 'Security QA', when: 'Monthly', deliverable: 'Security audit' },
  { phase: 'Smoke', type: 'Smoke Testing', tool: 'SoapUI, curl', who: 'QA', when: 'Post-deploy', deliverable: 'Smoke test report' },
  { phase: 'UAT', type: 'User Acceptance', tool: 'Manual', who: 'Business', when: 'Pre-release', deliverable: 'Sign-off' },
  { phase: 'E2E', type: 'End-to-End', tool: 'Cypress, Playwright', who: 'QA', when: 'Weekly', deliverable: 'E2E report' },
];

const ENV_COMPARISON = [
  { aspect: 'URL', dev: 'localhost:3000', staging: 'staging.app.com', prod: 'app.com' },
  { aspect: 'Database', dev: 'SQLite (local)', staging: 'SQLite (server)', prod: 'PostgreSQL' },
  { aspect: 'Auth', dev: 'Disabled', staging: 'API Key', prod: 'OAuth2 + MFA' },
  { aspect: 'Logging', dev: 'Debug', staging: 'Info', prod: 'Warn + Error' },
  { aspect: 'Monitoring', dev: 'None', staging: 'Basic', prod: 'Full (APM)' },
  { aspect: 'SSL/TLS', dev: 'No', staging: 'Self-signed', prod: 'CA Certificate' },
  { aspect: 'Rate Limiting', dev: 'Off', staging: '1000 req/min', prod: '100 req/min' },
  { aspect: 'Backups', dev: 'None', staging: 'Daily', prod: 'Hourly + WAL' },
];

const TOOLS_DATA = {
  'API Testing': [
    { name: 'SoapUI', type: 'Open Source', features: 'SOAP + REST, JDBC, Groovy scripting, data-driven tests', bestFor: 'Enterprise SOAP/REST testing', integration: 'Jenkins, Maven, CI/CD' },
    { name: 'Postman', type: 'Freemium', features: 'REST API, collections, environments, mock servers', bestFor: 'REST API development & testing', integration: 'Newman CLI, Jenkins, GitHub Actions' },
    { name: 'Insomnia', type: 'Freemium', features: 'REST, GraphQL, gRPC, environment management', bestFor: 'GraphQL & REST debugging', integration: 'Git sync, CLI' },
    { name: 'Bruno', type: 'Open Source', features: 'Git-friendly, offline-first, Bru markup language', bestFor: 'Version-controlled API testing', integration: 'Git, CLI' },
    { name: 'Hoppscotch', type: 'Open Source', features: 'Web-based, REST/GraphQL/WebSocket, lightweight', bestFor: 'Quick API testing in browser', integration: 'CLI, self-hosted' },
  ],
  'CI/CD': [
    { name: 'GitHub Actions', type: 'Free (public)', features: 'YAML workflows, matrix builds, marketplace actions', bestFor: 'GitHub-hosted projects', integration: 'GitHub ecosystem, Docker, AWS/GCP/Azure' },
    { name: 'Jenkins', type: 'Open Source', features: 'Pipeline-as-code, 1800+ plugins, distributed builds', bestFor: 'Self-hosted enterprise CI/CD', integration: 'Everything (largest plugin ecosystem)' },
    { name: 'GitLab CI', type: 'Free tier', features: 'Built-in CI/CD, Auto DevOps, container registry', bestFor: 'GitLab-hosted projects', integration: 'GitLab ecosystem, Kubernetes' },
    { name: 'CircleCI', type: 'Freemium', features: 'Docker-first, parallelism, orbs (reusable config)', bestFor: 'Fast parallel builds', integration: 'GitHub, Bitbucket, Docker' },
    { name: 'Travis CI', type: 'Free (OSS)', features: 'Simple YAML config, multi-language support', bestFor: 'Open source projects', integration: 'GitHub, Heroku, AWS' },
  ],
  'Code Quality': [
    { name: 'SonarQube', type: 'Open Source', features: 'Static analysis, quality gates, tech debt tracking', bestFor: 'Enterprise code quality management', integration: 'Jenkins, GitHub, GitLab, Azure DevOps' },
    { name: 'CodeClimate', type: 'Freemium', features: 'Maintainability score, test coverage, duplication', bestFor: 'Automated code review', integration: 'GitHub, GitLab, Bitbucket' },
    { name: 'Codacy', type: 'Free (OSS)', features: 'Auto code review, security patterns, coverage', bestFor: 'Multi-language projects', integration: 'GitHub, GitLab, Bitbucket' },
    { name: 'ESLint', type: 'Open Source', features: 'JS/TS linting, auto-fix, plugin ecosystem', bestFor: 'JavaScript/TypeScript projects', integration: 'All editors, CI/CD pipelines' },
    { name: 'Semgrep', type: 'Open Source', features: 'Custom rules, security patterns, SAST', bestFor: 'Security-focused static analysis', integration: 'GitHub Actions, GitLab, CLI' },
  ],
  Performance: [
    { name: 'JMeter', type: 'Open Source', features: 'HTTP/SOAP/JDBC/LDAP, distributed testing, GUI', bestFor: 'Enterprise load testing', integration: 'Jenkins, Maven, CI/CD' },
    { name: 'k6', type: 'Open Source', features: 'JavaScript scripting, cloud execution, thresholds', bestFor: 'Developer-friendly load testing', integration: 'Grafana, GitHub Actions, Docker' },
    { name: 'Gatling', type: 'Open Source', features: 'Scala DSL, real-time reports, high performance', bestFor: 'High-concurrency simulations', integration: 'Jenkins, Maven, sbt' },
    { name: 'Locust', type: 'Open Source', features: 'Python scripting, distributed, web UI', bestFor: 'Python-based load testing', integration: 'Docker, CI/CD, Python ecosystem' },
    { name: 'Artillery', type: 'Open Source', features: 'YAML config, HTTP/WebSocket/Socket.io, cloud', bestFor: 'Microservices load testing', integration: 'GitHub Actions, Docker, AWS' },
  ],
  Security: [
    { name: 'OWASP ZAP', type: 'Open Source', features: 'Active/passive scan, spider, fuzzer, API scan', bestFor: 'Web application security testing', integration: 'Jenkins, GitHub Actions, Docker' },
    { name: 'Burp Suite', type: 'Paid', features: 'Interceptor proxy, scanner, intruder, repeater', bestFor: 'Professional penetration testing', integration: 'CI/CD (Enterprise), Jira' },
    { name: 'Nikto', type: 'Open Source', features: 'Web server scanner, 6700+ checks, SSL testing', bestFor: 'Quick web server audits', integration: 'CLI, scripting' },
    { name: 'Snyk', type: 'Freemium', features: 'Dependency scanning, container scanning, IaC', bestFor: 'Supply chain security', integration: 'GitHub, npm, Docker, IDE plugins' },
    { name: 'Trivy', type: 'Open Source', features: 'Container/filesystem/git scanning, SBOM', bestFor: 'Container image scanning', integration: 'GitHub Actions, GitLab, Docker' },
  ],
  'Test Management': [
    { name: 'TestRail', type: 'Paid', features: 'Test plans, runs, milestones, dashboards, API', bestFor: 'Enterprise test management', integration: 'Jira, Jenkins, Selenium, Cypress' },
    { name: 'Zephyr', type: 'Paid', features: 'Jira-native, test cycles, traceability, reports', bestFor: 'Jira-integrated test management', integration: 'Jira, Confluence, Jenkins' },
    { name: 'qTest', type: 'Paid', features: 'Test design, execution, defect tracking, analytics', bestFor: 'Large QA teams', integration: 'Jira, Jenkins, Selenium, Rally' },
    { name: 'Xray', type: 'Paid', features: 'Jira add-on, BDD support, test environments', bestFor: 'Agile teams using Jira', integration: 'Jira, Jenkins, Cucumber, Robot Framework' },
    { name: 'This Dashboard', type: 'Open Source', features: 'Test cases, execution, defects, reports, SQL editor', bestFor: 'Banking QA operations', integration: 'SoapUI, SQLite, REST APIs' },
  ],
};

/* ── Styles ── */

const s = {
  page: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '24px 32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#1e293b',
  },
  header: {
    marginBottom: '28px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0,
  },
  tabBar: {
    display: 'flex',
    gap: '4px',
    borderBottom: '2px solid #e2e8f0',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },
  tab: (active) => ({
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: active ? '600' : '500',
    color: active ? '#2563eb' : '#64748b',
    backgroundColor: active ? '#eff6ff' : 'transparent',
    border: 'none',
    borderBottom: active ? '3px solid #2563eb' : '3px solid transparent',
    cursor: 'pointer',
    borderRadius: '6px 6px 0 0',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  }),
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 16px 0',
    paddingBottom: '8px',
    borderBottom: '2px solid #e2e8f0',
  },
  subTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e40af',
    margin: '24px 0 12px 0',
  },
  /* Pipeline flow */
  pipelineFlow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    overflowX: 'auto',
    padding: '24px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    marginBottom: '28px',
  },
  pipelineStep: (color) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '90px',
    flexShrink: 0,
  }),
  pipelineCircle: (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: color,
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '18px',
    boxShadow: `0 2px 8px ${color}44`,
  }),
  pipelineLabel: {
    marginTop: '8px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    maxWidth: '80px',
  },
  pipelineArrow: {
    fontSize: '20px',
    color: '#94a3b8',
    flexShrink: 0,
    margin: '0 2px',
    marginBottom: '20px',
  },
  /* Cards */
  cardRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  card: (borderColor) => ({
    backgroundColor: '#ffffff',
    border: `1px solid #e2e8f0`,
    borderLeft: `4px solid ${borderColor}`,
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  }),
  cardValue: (color) => ({
    fontSize: '28px',
    fontWeight: '700',
    color: color,
    margin: '0',
  }),
  cardLabel: {
    fontSize: '13px',
    color: '#64748b',
    margin: '4px 0 0 0',
    fontWeight: '500',
  },
  /* Tables */
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#f1f5f9',
    padding: '12px 14px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#334155',
    borderBottom: '2px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '10px 14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#475569',
    verticalAlign: 'top',
  },
  /* Badges */
  badge: (bg, color) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    backgroundColor: bg,
    color: color,
  }),
  /* Branch diagram */
  branchDiagram: {
    padding: '32px 24px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
    overflowX: 'auto',
  },
  branchRow: (color, indent) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0',
    paddingLeft: `${indent}px`,
    position: 'relative',
  }),
  branchLine: (color) => ({
    width: '100%',
    height: '4px',
    backgroundColor: color,
    borderRadius: '2px',
    position: 'relative',
  }),
  branchDot: (color) => ({
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    backgroundColor: color,
    border: '3px solid #ffffff',
    boxShadow: `0 0 0 2px ${color}`,
    flexShrink: 0,
  }),
  branchLabel: (color) => ({
    fontSize: '13px',
    fontWeight: '600',
    color: color,
    minWidth: '110px',
    flexShrink: 0,
  }),
  branchDesc: {
    fontSize: '12px',
    color: '#64748b',
    marginLeft: '12px',
    fontStyle: 'italic',
  },
  /* Flow steps */
  flowContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0',
    padding: '16px 8px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    marginBottom: '20px',
  },
  flowStep: (bg) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: bg,
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  }),
  flowArrow: {
    fontSize: '16px',
    color: '#94a3b8',
    margin: '0 4px',
    flexShrink: 0,
  },
  /* Checklist */
  checklistGroup: {
    marginBottom: '20px',
  },
  checklistCategory: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e40af',
    margin: '0 0 8px 0',
    padding: '6px 12px',
    backgroundColor: '#eff6ff',
    borderRadius: '6px',
    display: 'inline-block',
  },
  checkItem: {
    padding: '6px 0 6px 24px',
    fontSize: '13px',
    color: '#334155',
    position: 'relative',
    lineHeight: '1.5',
  },
  checkMark: {
    position: 'absolute',
    left: '4px',
    top: '8px',
    color: '#22c55e',
    fontWeight: '700',
    fontSize: '13px',
  },
  /* Code block */
  codeBlock: {
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    padding: '16px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace',
    lineHeight: '1.6',
    overflowX: 'auto',
    marginBottom: '16px',
    whiteSpace: 'pre',
  },
  codeLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: '6px',
  },
  /* Deploy phase */
  deployPhase: (color) => ({
    marginBottom: '20px',
    padding: '16px 20px',
    borderRadius: '10px',
    border: `1px solid ${color}33`,
    backgroundColor: `${color}08`,
    borderLeft: `4px solid ${color}`,
  }),
  deployPhaseTitle: (color) => ({
    fontSize: '15px',
    fontWeight: '700',
    color: color,
    margin: '0 0 10px 0',
  }),
  /* Info box */
  infoBox: (bg, border) => ({
    backgroundColor: bg,
    border: `1px solid ${border}`,
    borderRadius: '8px',
    padding: '14px 18px',
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#334155',
    marginBottom: '16px',
  }),
  /* Cloud options */
  cloudGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  cloudCard: (color) => ({
    padding: '16px',
    borderRadius: '10px',
    border: `1px solid ${color}33`,
    backgroundColor: `${color}08`,
    textAlign: 'center',
  }),
  cloudName: (color) => ({
    fontSize: '15px',
    fontWeight: '700',
    color: color,
    margin: '0 0 4px 0',
  }),
  cloudService: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  /* Lint rules */
  ruleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  ruleCard: (borderColor) => ({
    padding: '16px',
    borderRadius: '10px',
    border: `1px solid #e2e8f0`,
    borderTop: `3px solid ${borderColor}`,
    backgroundColor: '#ffffff',
  }),
  ruleCardTitle: (color) => ({
    fontSize: '14px',
    fontWeight: '700',
    color: color,
    margin: '0 0 10px 0',
  }),
  ruleItem: {
    fontSize: '12px',
    color: '#475569',
    padding: '3px 0',
    fontFamily: '"Fira Code", monospace',
  },
  /* Deployment checklist */
  deployChecklist: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  deployCheckCard: (color) => ({
    padding: '16px 20px',
    borderRadius: '10px',
    border: `1px solid ${color}33`,
    backgroundColor: `${color}06`,
    borderTop: `3px solid ${color}`,
  }),
  deployCheckTitle: (color) => ({
    fontSize: '14px',
    fontWeight: '700',
    color: color,
    margin: '0 0 10px 0',
  }),
  deployCheckItem: {
    fontSize: '12px',
    color: '#475569',
    padding: '4px 0 4px 18px',
    position: 'relative',
    lineHeight: '1.5',
  },
};

/* ── Helper Components ── */

function StatusBadge({ status }) {
  const isPass = status === 'pass';
  return (
    <span style={s.badge(isPass ? '#dcfce7' : '#fef2f2', isPass ? '#166534' : '#991b1b')}>
      {isPass ? 'PASSED' : 'FAILED'}
    </span>
  );
}

function TypeBadge({ type }) {
  const map = {
    'Open Source': { bg: '#dcfce7', color: '#166534' },
    'Free (public)': { bg: '#dcfce7', color: '#166534' },
    'Free (OSS)': { bg: '#dcfce7', color: '#166534' },
    Freemium: { bg: '#eff6ff', color: '#1e40af' },
    'Free tier': { bg: '#eff6ff', color: '#1e40af' },
    Paid: { bg: '#fef3c7', color: '#92400e' },
  };
  const { bg, color } = map[type] || { bg: '#f1f5f9', color: '#475569' };
  return <span style={s.badge(bg, color)}>{type}</span>;
}

/* ── Tab Content Components ── */

function PipelineOverview() {
  return (
    <div>
      {/* Pipeline Flow */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>CI/CD Pipeline Flow</h2>
        <div style={s.pipelineFlow}>
          {PIPELINE_STEPS.map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={s.pipelineStep(step.color)}>
                <div style={s.pipelineCircle(step.color)}>{step.icon}</div>
                <div style={s.pipelineLabel}>{step.label}</div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div style={s.pipelineArrow}>&#10140;</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Status Cards */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Pipeline Status</h2>
        <div style={s.cardRow}>
          <div style={s.card('#3b82f6')}>
            <p style={s.cardValue('#3b82f6')}>1,247</p>
            <p style={s.cardLabel}>Total Pipelines</p>
          </div>
          <div style={s.card('#22c55e')}>
            <p style={s.cardValue('#22c55e')}>1,089</p>
            <p style={s.cardLabel}>Successful (87.3%)</p>
          </div>
          <div style={s.card('#ef4444')}>
            <p style={s.cardValue('#ef4444')}>158</p>
            <p style={s.cardLabel}>Failed (12.7%)</p>
          </div>
          <div style={s.card('#f59e0b')}>
            <p style={s.cardValue('#f59e0b')}>4m 22s</p>
            <p style={s.cardLabel}>Average Build Time</p>
          </div>
        </div>
      </div>

      {/* Recent Runs */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Recent Pipeline Runs</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Run #</th>
                <th style={s.th}>Branch</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Duration</th>
                <th style={s.th}>Triggered By</th>
                <th style={s.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {PIPELINE_RUNS.map((run) => (
                <tr key={run.id} style={{ backgroundColor: run.status === 'fail' ? '#fef2f2' : 'transparent' }}>
                  <td style={{ ...s.td, fontWeight: '600', color: '#1e40af' }}>{run.id}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace', fontSize: '12px' }}>{run.branch}</td>
                  <td style={s.td}><StatusBadge status={run.status} /></td>
                  <td style={s.td}>{run.duration}</td>
                  <td style={s.td}>{run.triggeredBy}</td>
                  <td style={{ ...s.td, color: '#64748b', fontSize: '12px' }}>{run.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BranchStrategy() {
  const branches = [
    { name: 'main', color: '#ef4444', desc: 'Production-ready, protected. Only release/hotfix merges.', indent: 0, dots: [0, 100] },
    { name: 'hotfix/*', color: '#f97316', desc: 'Emergency fixes branched from main, merged back to main + develop.', indent: 20 },
    { name: 'release/*', color: '#a855f7', desc: 'Release preparation. Final testing before production.', indent: 20 },
    { name: 'develop', color: '#3b82f6', desc: 'Integration branch. All features merge here first.', indent: 0, dots: [0, 100] },
    { name: 'feature/*', color: '#22c55e', desc: 'New features branched from develop, merged back via PR.', indent: 40 },
    { name: 'fix/*', color: '#eab308', desc: 'Bug fix branches from develop for non-critical issues.', indent: 40 },
  ];

  return (
    <div>
      {/* Visual Diagram */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Git Branching Model</h2>
        <div style={s.branchDiagram}>
          {branches.map((b, i) => (
            <div key={b.name} style={{ marginBottom: '16px', paddingLeft: `${b.indent}px` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={s.branchLabel(b.color)}>{b.name}</span>
                <div style={{ flex: 1, position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
                  <div style={s.branchLine(b.color)} />
                  <div style={{ position: 'absolute', left: '10px', ...s.branchDot(b.color).position ? {} : {} }}>
                    <div style={s.branchDot(b.color)} />
                  </div>
                  <div style={{ position: 'absolute', left: '30%' }}>
                    <div style={s.branchDot(b.color)} />
                  </div>
                  {(b.name === 'main' || b.name === 'develop') && (
                    <div style={{ position: 'absolute', left: '60%' }}>
                      <div style={s.branchDot(b.color)} />
                    </div>
                  )}
                  {(b.name === 'main' || b.name === 'develop') && (
                    <div style={{ position: 'absolute', right: '10px' }}>
                      <div style={s.branchDot(b.color)} />
                    </div>
                  )}
                </div>
              </div>
              <div style={{ ...s.branchDesc, paddingLeft: '122px' }}>{b.desc}</div>
            </div>
          ))}

          {/* Legend */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {branches.map((b) => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '24px', height: '4px', backgroundColor: b.color, borderRadius: '2px' }} />
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Merge Flow */}
      <div style={s.section}>
        <h3 style={s.subTitle}>Merge Flow</h3>
        <div style={s.flowContainer}>
          {['feature/*', 'PR to develop', 'develop', 'release/*', 'PR to main', 'main', 'Tag & Deploy'].map((step, i) => (
            <React.Fragment key={step}>
              <div style={s.flowStep(i < 2 ? '#22c55e' : i < 4 ? '#3b82f6' : i < 6 ? '#a855f7' : '#ef4444')}>{step}</div>
              {i < 6 && <span style={s.flowArrow}>&#10140;</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Rules Table */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Branch Protection Rules</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Branch</th>
                <th style={s.th}>Protected</th>
                <th style={s.th}>Requires PR</th>
                <th style={s.th}>Requires Review</th>
                <th style={s.th}>Auto Deploy</th>
              </tr>
            </thead>
            <tbody>
              {BRANCH_RULES.map((r) => (
                <tr key={r.branch}>
                  <td style={{ ...s.td, fontFamily: 'monospace', fontWeight: '600', color: '#1e40af' }}>{r.branch}</td>
                  <td style={s.td}>
                    <span style={s.badge(r.protected === 'Yes' ? '#dcfce7' : '#f1f5f9', r.protected === 'Yes' ? '#166534' : '#64748b')}>
                      {r.protected}
                    </span>
                  </td>
                  <td style={s.td}>{r.requiresPR}</td>
                  <td style={s.td}>{r.requiresReview}</td>
                  <td style={s.td}>
                    <span style={s.badge(
                      r.autoDeploy === 'Production' ? '#fef2f2' : r.autoDeploy === 'Staging' ? '#eff6ff' : '#f0fdf4',
                      r.autoDeploy === 'Production' ? '#991b1b' : r.autoDeploy === 'Staging' ? '#1e40af' : '#166534'
                    )}>
                      {r.autoDeploy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Naming Convention */}
      <div style={s.section}>
        <h3 style={s.subTitle}>Branch Naming Convention</h3>
        <div style={s.infoBox('#eff6ff', '#bfdbfe')}>
          <strong>Format:</strong> <code style={{ backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>type/ticket-short-description</code>
          <br /><br />
          <strong>Examples:</strong><br />
          <code>feature/BANK-123-payment-gateway</code> | <code>fix/BANK-456-login-timeout</code> | <code>hotfix/BANK-789-db-crash</code> | <code>release/v2.3.0</code>
        </div>
      </div>
    </div>
  );
}

function CodeReview() {
  return (
    <div>
      {/* Review Workflow */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Code Review Workflow</h2>
        <div style={s.flowContainer}>
          {[
            { label: 'Developer Submits PR', bg: '#3b82f6' },
            { label: 'Auto Lint Check', bg: '#6366f1' },
            { label: 'Auto Test Run', bg: '#8b5cf6' },
            { label: 'Reviewer Assigned', bg: '#a855f7' },
            { label: 'Code Review', bg: '#d946ef' },
            { label: 'Changes / Approve', bg: '#ec4899' },
            { label: 'Merge', bg: '#22c55e' },
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={s.flowStep(step.bg)}>{step.label}</div>
              {i < 6 && <span style={s.flowArrow}>&#10140;</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Review Checklist */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Code Review Checklist (20 Items)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {Object.entries(REVIEW_CHECKLIST).map(([category, items]) => (
            <div key={category} style={s.checklistGroup}>
              <div style={s.checklistCategory}>{category}</div>
              {items.map((item, i) => (
                <div key={i} style={s.checkItem}>
                  <span style={s.checkMark}>&#10003;</span>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Lint Rules */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Lint Rules & Quality Gates</h2>
        <div style={s.ruleGrid}>
          <div style={s.ruleCard('#f59e0b')}>
            <h4 style={s.ruleCardTitle('#b45309')}>ESLint Rules</h4>
            {['no-unused-vars: error', 'no-console: warn', 'eqeqeq: error (always)', 'curly: error (all)', 'no-eval: error', 'no-implicit-globals: error', 'prefer-const: error', 'no-var: error'].map((r) => (
              <div key={r} style={s.ruleItem}>{r}</div>
            ))}
          </div>
          <div style={s.ruleCard('#3b82f6')}>
            <h4 style={s.ruleCardTitle('#1e40af')}>Prettier Config</h4>
            {['semi: true', 'singleQuote: true', 'tabWidth: 2', 'printWidth: 120', 'trailingComma: "es5"', 'bracketSpacing: true', 'arrowParens: "always"', 'endOfLine: "lf"'].map((r) => (
              <div key={r} style={s.ruleItem}>{r}</div>
            ))}
          </div>
          <div style={s.ruleCard('#a855f7')}>
            <h4 style={s.ruleCardTitle('#7c3aed')}>SonarQube Quality Gates</h4>
            {['Bugs: 0 (no new bugs)', 'Vulnerabilities: 0', 'Code Smells: < 10', 'Coverage: > 80%', 'Duplications: < 3%', 'Security Hotspots: reviewed', 'Maintainability Rating: A', 'Reliability Rating: A'].map((r) => (
              <div key={r} style={s.ruleItem}>{r}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Ruff + Black (Python) */}
      <div style={s.section}>
        <h3 style={s.subTitle}>Python Linting (Ruff + Black + mypy)</h3>
        <div style={s.codeBlock}>
{`# pyproject.toml
[tool.ruff]
target-version = "py311"
line-length = 120
[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP", "S", "B", "A", "C4", "SIM"]

[tool.black]
line-length = 120

[tool.mypy]
python_version = "3.11"
warn_return_any = true
disallow_untyped_defs = true`}
        </div>
      </div>
    </div>
  );
}

function TestingOperations() {
  const dailyOps = [
    { label: 'Morning Standup', bg: '#3b82f6' },
    { label: 'Pick Test Cases', bg: '#6366f1' },
    { label: 'Prepare Test Data', bg: '#8b5cf6' },
    { label: 'Execute Tests', bg: '#a855f7' },
    { label: 'Log Results', bg: '#d946ef' },
    { label: 'Report Defects', bg: '#ef4444' },
    { label: 'Update Dashboard', bg: '#f59e0b' },
    { label: 'EOD Report', bg: '#22c55e' },
  ];

  return (
    <div>
      {/* Testing Types Table */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Testing Types & Responsibilities</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Phase</th>
                <th style={s.th}>Testing Type</th>
                <th style={s.th}>Tool</th>
                <th style={s.th}>Who</th>
                <th style={s.th}>When</th>
                <th style={s.th}>Deliverable</th>
              </tr>
            </thead>
            <tbody>
              {TESTING_PHASES.map((t, i) => (
                <tr key={t.phase} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ ...s.td, fontWeight: '600' }}>
                    <span style={s.badge('#eff6ff', '#1e40af')}>{t.phase}</span>
                  </td>
                  <td style={{ ...s.td, fontWeight: '500' }}>{t.type}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace', fontSize: '12px', color: '#7c3aed' }}>{t.tool}</td>
                  <td style={s.td}>{t.who}</td>
                  <td style={s.td}>{t.when}</td>
                  <td style={s.td}>{t.deliverable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Operations Flow */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Tester Daily Operations</h2>
        <div style={s.flowContainer}>
          {dailyOps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={s.flowStep(step.bg)}>{step.label}</div>
              {i < dailyOps.length - 1 && <span style={s.flowArrow}>&#10140;</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Test Automation Pyramid */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Test Automation Pyramid</h2>
        <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {[
            { label: 'E2E / UI Tests', width: '180px', bg: '#ef4444', count: '~10%' },
            { label: 'Integration / API Tests', width: '280px', bg: '#f59e0b', count: '~30%' },
            { label: 'Unit Tests', width: '400px', bg: '#22c55e', count: '~60%' },
          ].map((level) => (
            <div key={level.label} style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              <div style={{
                width: level.width,
                padding: '12px 16px',
                backgroundColor: level.bg,
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '13px',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span>{level.label}</span>
                <span style={{ fontSize: '11px', opacity: 0.9 }}>{level.count}</span>
              </div>
            </div>
          ))}
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', marginBottom: 0 }}>
            More unit tests at the base, fewer E2E tests at the top. Fast feedback at the bottom, high confidence at the top.
          </p>
        </div>
      </div>

      {/* Test Metrics */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Key Testing Metrics</h2>
        <div style={s.cardRow}>
          <div style={s.card('#22c55e')}>
            <p style={s.cardValue('#22c55e')}>94.2%</p>
            <p style={s.cardLabel}>Test Pass Rate</p>
          </div>
          <div style={s.card('#3b82f6')}>
            <p style={s.cardValue('#3b82f6')}>87.5%</p>
            <p style={s.cardLabel}>Code Coverage</p>
          </div>
          <div style={s.card('#ef4444')}>
            <p style={s.cardValue('#ef4444')}>12</p>
            <p style={s.cardLabel}>Open Defects</p>
          </div>
          <div style={s.card('#f59e0b')}>
            <p style={s.cardValue('#f59e0b')}>2.3 days</p>
            <p style={s.cardLabel}>Avg Defect Resolution</p>
          </div>
        </div>
      </div>

      {/* Test Environment Setup */}
      <div style={s.section}>
        <h3 style={s.subTitle}>Test Data Preparation Checklist</h3>
        <div style={s.infoBox('#f0fdf4', '#bbf7d0')}>
          <strong>Before executing any test:</strong><br />
          1. Verify test environment is accessible and database is seeded<br />
          2. Confirm API endpoints are responding (health check)<br />
          3. Prepare test data: valid inputs, boundary values, invalid inputs<br />
          4. Set up test accounts with appropriate roles (admin, user, guest)<br />
          5. Clear previous test artifacts and reset state if needed<br />
          6. Verify external service mocks are configured (if applicable)<br />
          7. Document the test data set used for traceability
        </div>
      </div>
    </div>
  );
}

function Deployment() {
  return (
    <div>
      {/* Deployment Pipeline Phases */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Deployment Pipeline</h2>

        <div style={s.deployPhase('#3b82f6')}>
          <h4 style={s.deployPhaseTitle('#1e40af')}>Development</h4>
          <div style={s.flowContainer}>
            {['Local Dev', 'Feature Branch', 'PR Created', 'Code Review', 'Merge to Develop'].map((step, i) => (
              <React.Fragment key={step}>
                <div style={s.flowStep('#3b82f6')}>{step}</div>
                {i < 4 && <span style={s.flowArrow}>&#10140;</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={s.deployPhase('#f59e0b')}>
          <h4 style={s.deployPhaseTitle('#b45309')}>Staging</h4>
          <div style={s.flowContainer}>
            {['Develop Branch', 'Auto Build', 'Auto Test', 'Deploy Staging', 'Smoke Test'].map((step, i) => (
              <React.Fragment key={step}>
                <div style={s.flowStep('#f59e0b')}>{step}</div>
                {i < 4 && <span style={s.flowArrow}>&#10140;</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={s.deployPhase('#22c55e')}>
          <h4 style={s.deployPhaseTitle('#166534')}>Production</h4>
          <div style={s.flowContainer}>
            {['Release Branch', 'Final Review', 'Deploy Production', 'Health Check', 'Monitor'].map((step, i) => (
              <React.Fragment key={step}>
                <div style={s.flowStep('#22c55e')}>{step}</div>
                {i < 4 && <span style={s.flowArrow}>&#10140;</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Environment Comparison */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Environment Comparison</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Aspect</th>
                <th style={{ ...s.th, backgroundColor: '#eff6ff' }}>Development</th>
                <th style={{ ...s.th, backgroundColor: '#fffbeb' }}>Staging</th>
                <th style={{ ...s.th, backgroundColor: '#f0fdf4' }}>Production</th>
              </tr>
            </thead>
            <tbody>
              {ENV_COMPARISON.map((r, i) => (
                <tr key={r.aspect} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ ...s.td, fontWeight: '600', color: '#0f172a' }}>{r.aspect}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace', fontSize: '12px' }}>{r.dev}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace', fontSize: '12px' }}>{r.staging}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace', fontSize: '12px', fontWeight: '500' }}>{r.prod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployment Checklist */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Deployment Checklist</h2>
        <div style={s.deployChecklist}>
          <div style={s.deployCheckCard('#f59e0b')}>
            <h4 style={s.deployCheckTitle('#b45309')}>Pre-Deploy</h4>
            {[
              'Backup current database',
              'Freeze feature merges',
              'Notify stakeholders',
              'Review migration scripts',
              'Verify rollback plan',
              'Check disk space & resources',
            ].map((item) => (
              <div key={item} style={s.deployCheckItem}>
                <span style={{ position: 'absolute', left: '2px', color: '#f59e0b' }}>&#9679;</span>
                {item}
              </div>
            ))}
          </div>
          <div style={s.deployCheckCard('#3b82f6')}>
            <h4 style={s.deployCheckTitle('#1e40af')}>Deploy</h4>
            {[
              'Pull latest code / image',
              'Run database migrations',
              'Build application',
              'Deploy to target environment',
              'Verify service is running',
              'Check application logs',
            ].map((item) => (
              <div key={item} style={s.deployCheckItem}>
                <span style={{ position: 'absolute', left: '2px', color: '#3b82f6' }}>&#9679;</span>
                {item}
              </div>
            ))}
          </div>
          <div style={s.deployCheckCard('#22c55e')}>
            <h4 style={s.deployCheckTitle('#166534')}>Post-Deploy</h4>
            {[
              'Run smoke tests',
              'Monitor error rates (15 min)',
              'Verify key user flows',
              'Check performance metrics',
              'Notify team: deploy complete',
              'Update deployment log',
            ].map((item) => (
              <div key={item} style={s.deployCheckItem}>
                <span style={{ position: 'absolute', left: '2px', color: '#22c55e' }}>&#9679;</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Docker Commands */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Docker Deployment</h2>
        <div style={s.codeLabel}>Build and start all services</div>
        <div style={s.codeBlock}>
{`# Build and start all containers in detached mode
docker compose up --build -d

# View live logs
docker compose logs -f

# Stop and remove all containers
docker compose down

# Rebuild a specific service
docker compose up --build -d backend

# Check container health
docker compose ps

# Execute command in running container
docker compose exec backend python -m pytest --cov=backend`}
        </div>

        <div style={s.codeLabel}>Dockerfile example (non-root, healthcheck)</div>
        <div style={s.codeBlock}>
{`FROM python:3.11-slim

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/

# Switch to non-root user
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \\
  CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]`}
        </div>
      </div>

      {/* Cloud Deployment Options */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Cloud Deployment Options</h2>
        <div style={s.cloudGrid}>
          <div style={s.cloudCard('#f97316')}>
            <p style={s.cloudName('#ea580c')}>AWS</p>
            <p style={s.cloudService}>ECS / EC2 / Lambda</p>
          </div>
          <div style={s.cloudCard('#3b82f6')}>
            <p style={s.cloudName('#2563eb')}>Azure</p>
            <p style={s.cloudService}>App Service / AKS</p>
          </div>
          <div style={s.cloudCard('#ef4444')}>
            <p style={s.cloudName('#dc2626')}>GCP</p>
            <p style={s.cloudService}>Cloud Run / GKE</p>
          </div>
          <div style={s.cloudCard('#a855f7')}>
            <p style={s.cloudName('#9333ea')}>Heroku</p>
            <p style={s.cloudService}>Container / Dynos</p>
          </div>
          <div style={s.cloudCard('#0ea5e9')}>
            <p style={s.cloudName('#0284c7')}>Railway</p>
            <p style={s.cloudService}>Auto Deploy from Git</p>
          </div>
          <div style={s.cloudCard('#22c55e')}>
            <p style={s.cloudName('#16a34a')}>Render</p>
            <p style={s.cloudService}>Web Service / Cron</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolsComparison() {
  const categoryColors = {
    'API Testing': '#3b82f6',
    'CI/CD': '#8b5cf6',
    'Code Quality': '#f59e0b',
    Performance: '#ef4444',
    Security: '#d946ef',
    'Test Management': '#22c55e',
  };

  return (
    <div>
      {Object.entries(TOOLS_DATA).map(([category, tools]) => (
        <div key={category} style={s.section}>
          <h2 style={{ ...s.sectionTitle, borderBottomColor: categoryColors[category] || '#e2e8f0' }}>
            <span style={{ color: categoryColors[category] || '#0f172a' }}>{category}</span> Tools
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={{ ...s.th, minWidth: '120px' }}>Tool</th>
                  <th style={{ ...s.th, minWidth: '100px' }}>Type</th>
                  <th style={{ ...s.th, minWidth: '250px' }}>Key Features</th>
                  <th style={{ ...s.th, minWidth: '180px' }}>Best For</th>
                  <th style={{ ...s.th, minWidth: '200px' }}>Integration</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool, i) => (
                  <tr key={tool.name} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ ...s.td, fontWeight: '600', color: categoryColors[category] || '#1e40af' }}>
                      {tool.name}
                    </td>
                    <td style={s.td}><TypeBadge type={tool.type} /></td>
                    <td style={{ ...s.td, fontSize: '12px', lineHeight: '1.5' }}>{tool.features}</td>
                    <td style={{ ...s.td, fontSize: '12px' }}>{tool.bestFor}</td>
                    <td style={{ ...s.td, fontSize: '12px', color: '#64748b' }}>{tool.integration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Selection Guide */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Tool Selection Guide</h2>
        <div style={s.infoBox('#f5f3ff', '#ddd6fe')}>
          <strong>How to choose the right tool:</strong><br /><br />
          <strong>1. Team Size:</strong> Small teams (1-5) benefit from simple tools like Bruno, k6, GitHub Actions. Enterprise teams need Jenkins, SonarQube, TestRail.<br />
          <strong>2. Budget:</strong> Start with open-source (SoapUI, JMeter, OWASP ZAP), upgrade to paid when ROI is clear.<br />
          <strong>3. Tech Stack:</strong> Match tools to your stack -- Pytest for Python, Jest for JS, Cypress for React/Vue.<br />
          <strong>4. Integration:</strong> Ensure tools integrate with your CI/CD pipeline and issue tracker.<br />
          <strong>5. Learning Curve:</strong> Consider team expertise. Postman is easier to adopt than SoapUI for REST-only testing.
        </div>
      </div>

      {/* Recommended Stack */}
      <div style={s.section}>
        <h3 style={s.subTitle}>Recommended Stack for This Project</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            { category: 'API Testing', tool: 'SoapUI + Postman', reason: 'SOAP + REST coverage', color: '#3b82f6' },
            { category: 'CI/CD', tool: 'GitHub Actions', reason: 'Free, GitHub-native', color: '#8b5cf6' },
            { category: 'Code Quality', tool: 'Ruff + ESLint + SonarQube', reason: 'Python + JS + Gates', color: '#f59e0b' },
            { category: 'Performance', tool: 'k6', reason: 'Developer-friendly, scriptable', color: '#ef4444' },
            { category: 'Security', tool: 'OWASP ZAP + Snyk', reason: 'App scan + dependency scan', color: '#d946ef' },
            { category: 'Test Management', tool: 'This Dashboard', reason: 'Custom-built, integrated', color: '#22c55e' },
          ].map((rec) => (
            <div key={rec.category} style={{
              padding: '16px',
              borderRadius: '10px',
              border: `1px solid ${rec.color}33`,
              borderLeft: `4px solid ${rec.color}`,
              backgroundColor: '#ffffff',
            }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{rec.category}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: rec.color, margin: '4px 0' }}>{rec.tool}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{rec.reason}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */

export default function CICDGuide() {
  const [activeTab, setActiveTab] = useState('pipeline');

  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline':
        return <PipelineOverview />;
      case 'branching':
        return <BranchStrategy />;
      case 'codereview':
        return <CodeReview />;
      case 'testing':
        return <TestingOperations />;
      case 'deployment':
        return <Deployment />;
      case 'tools':
        return <ToolsComparison />;
      default:
        return <PipelineOverview />;
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>CI/CD Operations Guide</h1>
        <p style={s.subtitle}>
          Branching strategy, code review process, testing operations, deployment pipeline, and tooling reference
        </p>
      </div>

      <div style={s.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={s.tab(activeTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}

import React, { useState } from 'react';

const TABS = [
  'Bug Lifecycle',
  'JIRA Workflows',
  'Test Management',
  'Sprint Planning',
  'Dashboards & Reports',
  'Best Practices'
];

const BUG_LIFECYCLE_STATES = [
  { state: 'New / Open', color: '#3b82f6', desc: 'Tester logs a new defect with steps to reproduce, expected vs actual result, severity, priority, screenshots/logs' },
  { state: 'Assigned', color: '#8b5cf6', desc: 'Team lead / PM assigns the bug to a developer. Developer acknowledges the assignment.' },
  { state: 'In Progress', color: '#f59e0b', desc: 'Developer is actively working on the fix. Status updated in daily standup.' },
  { state: 'Fixed / Ready for QA', color: '#06b6d4', desc: 'Developer completes the fix, adds fix details in comments, moves to QA for verification.' },
  { state: 'Retest / Verification', color: '#a855f7', desc: 'QA tester retests the bug with original steps. Verifies fix in the same environment.' },
  { state: 'Verified / Closed', color: '#22c55e', desc: 'Bug is confirmed fixed. QA closes the ticket with verification notes.' },
  { state: 'Reopened', color: '#ef4444', desc: 'Bug still exists or regressed. QA reopens with new evidence. Goes back to developer.' },
  { state: 'Deferred', color: '#94a3b8', desc: 'Bug is valid but will be fixed in a future release. Documented with reason.' },
  { state: 'Rejected / Not a Bug', color: '#6b7280', desc: 'Developer determines it\'s working as designed. PM validates the decision.' },
  { state: 'Duplicate', color: '#78716c', desc: 'Bug already reported. Linked to original ticket and closed as duplicate.' }
];

const BUG_FIELDS = [
  { field: 'Summary', example: '[Module] Brief description of the defect', required: true },
  { field: 'Description', example: 'Detailed description with context', required: true },
  { field: 'Steps to Reproduce', example: '1. Login as customer\n2. Navigate to Fund Transfer\n3. Enter amount > balance\n4. Click Submit', required: true },
  { field: 'Expected Result', example: 'Error message: "Insufficient balance"', required: true },
  { field: 'Actual Result', example: 'Application crashes with 500 Internal Server Error', required: true },
  { field: 'Environment', example: 'Chrome 120, Windows 11, Staging (staging.bank.com)', required: true },
  { field: 'Severity', example: 'Critical / Major / Minor / Trivial', required: true },
  { field: 'Priority', example: 'P1 (Blocker) / P2 (High) / P3 (Medium) / P4 (Low)', required: true },
  { field: 'Assignee', example: 'Developer name or team', required: false },
  { field: 'Component', example: 'Fund Transfer / Accounts / Loans / Cards', required: true },
  { field: 'Sprint', example: 'Sprint 24 - Release 4.2', required: false },
  { field: 'Labels', example: 'regression, production-bug, security', required: false },
  { field: 'Affects Version', example: 'v4.1.0', required: false },
  { field: 'Fix Version', example: 'v4.2.0', required: false },
  { field: 'Attachments', example: 'Screenshots, logs, HAR files, video recordings', required: true },
  { field: 'Linked Issues', example: 'Related test case TC-045, blocks STORY-123', required: false }
];

const SEVERITY_MATRIX = [
  { severity: 'Blocker', priority: 'P1', color: '#dc2626', examples: ['Application crash on login', 'Payment processing failure', 'Data corruption', 'Security vulnerability (SQL injection)'], sla: '4 hours' },
  { severity: 'Critical', priority: 'P2', color: '#ea580c', examples: ['Incorrect balance calculation', 'Fund transfer to wrong account', 'OTP not received', 'Session not expiring'], sla: '24 hours' },
  { severity: 'Major', priority: 'P3', color: '#f59e0b', examples: ['Search not returning results', 'Export generating wrong format', 'Pagination broken', 'Sorting not working'], sla: '3 days' },
  { severity: 'Minor', priority: 'P4', color: '#3b82f6', examples: ['UI alignment issues', 'Spelling mistakes', 'Tooltip missing', 'Date format inconsistency'], sla: '1 sprint' },
  { severity: 'Trivial', priority: 'P5', color: '#94a3b8', examples: ['Color shade slightly off', 'Font size preference', 'Cosmetic spacing', 'Enhancement suggestion'], sla: 'Backlog' }
];

const JIRA_WORKFLOWS = [
  {
    name: 'Defect Workflow',
    flow: 'Open → Assigned → In Progress → Fixed → Retest → Closed',
    transitions: [
      { from: 'Open', to: 'Assigned', trigger: 'Team lead assigns to developer' },
      { from: 'Assigned', to: 'In Progress', trigger: 'Developer starts working' },
      { from: 'In Progress', to: 'Fixed', trigger: 'Developer completes fix' },
      { from: 'Fixed', to: 'Retest', trigger: 'QA picks up for verification' },
      { from: 'Retest', to: 'Closed', trigger: 'Bug verified as fixed' },
      { from: 'Retest', to: 'Reopened', trigger: 'Bug still exists' },
      { from: 'Reopened', to: 'In Progress', trigger: 'Developer reworks' },
      { from: 'Open', to: 'Rejected', trigger: 'Not a bug / By design' },
      { from: 'Open', to: 'Deferred', trigger: 'Postponed to future release' },
      { from: 'Open', to: 'Duplicate', trigger: 'Already reported' }
    ]
  },
  {
    name: 'User Story Workflow',
    flow: 'To Do → In Dev → Code Review → In QA → UAT → Done',
    transitions: [
      { from: 'To Do', to: 'In Development', trigger: 'Developer picks from sprint backlog' },
      { from: 'In Development', to: 'Code Review', trigger: 'PR created' },
      { from: 'Code Review', to: 'In QA', trigger: 'PR merged, deployed to QA env' },
      { from: 'In QA', to: 'UAT', trigger: 'QA testing passed' },
      { from: 'In QA', to: 'In Development', trigger: 'Bugs found, sent back' },
      { from: 'UAT', to: 'Done', trigger: 'Business approved' },
      { from: 'UAT', to: 'In QA', trigger: 'UAT issues found' }
    ]
  },
  {
    name: 'Test Case Workflow',
    flow: 'Draft → Review → Approved → In Execution → Pass/Fail',
    transitions: [
      { from: 'Draft', to: 'Review', trigger: 'Tester completes test case writing' },
      { from: 'Review', to: 'Approved', trigger: 'QA Lead reviews and approves' },
      { from: 'Review', to: 'Draft', trigger: 'Changes requested' },
      { from: 'Approved', to: 'In Execution', trigger: 'Test cycle started' },
      { from: 'In Execution', to: 'Pass', trigger: 'All steps verified' },
      { from: 'In Execution', to: 'Fail', trigger: 'Defect found, bug raised' },
      { from: 'Fail', to: 'In Execution', trigger: 'Retest after bug fix' }
    ]
  }
];

const JIRA_QUERIES = [
  { name: 'My Open Bugs', jql: 'assignee = currentUser() AND type = Bug AND status != Closed ORDER BY priority DESC' },
  { name: 'Sprint Bugs', jql: 'sprint in openSprints() AND type = Bug ORDER BY priority DESC, created ASC' },
  { name: 'Critical Bugs This Week', jql: 'type = Bug AND priority in (Highest, High) AND created >= startOfWeek() ORDER BY created DESC' },
  { name: 'Unassigned Bugs', jql: 'type = Bug AND assignee is EMPTY AND status = Open ORDER BY priority DESC' },
  { name: 'Reopened Bugs', jql: 'type = Bug AND status = Reopened ORDER BY updated DESC' },
  { name: 'Bugs by Module', jql: 'type = Bug AND component = "Fund Transfer" AND status != Closed ORDER BY priority' },
  { name: 'Regression Bugs', jql: 'type = Bug AND labels = regression AND fixVersion = "v4.2.0" ORDER BY created DESC' },
  { name: 'Bugs Without Attachments', jql: 'type = Bug AND attachments is EMPTY AND status = Open' },
  { name: 'Bugs Aging > 7 Days', jql: 'type = Bug AND status not in (Closed, Resolved) AND created <= "-7d" ORDER BY created ASC' },
  { name: 'Test Cases Not Run', jql: 'type = "Test Case" AND status = "Not Executed" AND sprint in openSprints()' },
  { name: 'Stories Ready for QA', jql: 'type = Story AND status = "In QA" AND sprint in openSprints() ORDER BY priority DESC' },
  { name: 'UAT Pending', jql: 'type = Story AND status = "UAT" AND fixVersion = "v4.2.0" ORDER BY priority DESC' }
];

const TEST_MGMT_TOOLS = [
  { tool: 'Zephyr for JIRA', desc: 'Native JIRA integration, test cycles, execution tracking, traceability matrix', pros: 'Tight JIRA integration, real-time sync', cons: 'Can be slow with large test suites' },
  { tool: 'Xray for JIRA', desc: 'Test management inside JIRA, supports BDD/Cucumber, CI/CD integration', pros: 'Cucumber integration, REST API, great reporting', cons: 'Learning curve for advanced features' },
  { tool: 'TestRail', desc: 'Standalone test management with JIRA integration, milestone tracking', pros: 'Excellent UI, powerful reporting, API support', cons: 'Separate tool, extra cost' },
  { tool: 'qTest', desc: 'Enterprise test management, requirements traceability, Selenium integration', pros: 'Enterprise features, automation integration', cons: 'Complex setup, higher cost' },
  { tool: 'JIRA + Custom Fields', desc: 'Use JIRA issues as test cases with custom fields for steps, expected results', pros: 'No extra tool, native JIRA', cons: 'Limited test execution tracking' }
];

const SPRINT_CEREMONIES = [
  { ceremony: 'Sprint Planning', qa_role: 'Review stories for testability, estimate QA effort, identify test data needs, flag missing acceptance criteria', timing: 'Day 1 of sprint', duration: '2-4 hours' },
  { ceremony: 'Daily Standup', qa_role: 'Report testing progress, blockers, environment issues, bug status updates', timing: 'Daily', duration: '15 minutes' },
  { ceremony: 'Backlog Grooming', qa_role: 'Review upcoming stories, ask clarification questions, suggest test scenarios, identify edge cases', timing: 'Mid-sprint', duration: '1-2 hours' },
  { ceremony: 'Sprint Review / Demo', qa_role: 'Demo tested features, present test metrics, show defect trends, highlight risk areas', timing: 'Last day', duration: '1-2 hours' },
  { ceremony: 'Sprint Retrospective', qa_role: 'Share testing challenges, process improvement ideas, tool suggestions, collaboration feedback', timing: 'After review', duration: '1-1.5 hours' },
  { ceremony: 'Bug Triage', qa_role: 'Present new bugs with evidence, recommend severity/priority, help with reproduction steps', timing: '2-3x per week', duration: '30-60 minutes' }
];

const DASHBOARD_WIDGETS = [
  'Burndown Chart — Track remaining work vs ideal burndown line',
  'Bug Open vs Closed — Daily trend of bugs opened vs resolved',
  'Test Execution Progress — Pie chart: Pass/Fail/Not Run/Blocked',
  'Defect Density by Module — Bar chart showing bugs per component',
  'Sprint Velocity — Story points completed per sprint (last 6 sprints)',
  'Bug Aging Report — How long bugs stay open (avg resolution time)',
  'Reopened Bug Trend — Track quality of fixes over time',
  'Environment Availability — Uptime of QA/Staging/UAT environments',
  'Test Coverage Matrix — Stories vs Test Cases mapping',
  'Release Readiness — Checklist of release criteria met/unmet'
];

const BEST_PRACTICES = [
  { title: 'Bug Reporting', items: ['Always attach screenshots/videos', 'Include exact steps to reproduce', 'Mention environment details', 'Link related test case', 'Use consistent naming: [Module] - Brief Description', 'Include API response codes and payloads for API bugs', 'Add console errors for frontend bugs'] },
  { title: 'Test Planning', items: ['Write test cases during sprint grooming', 'Map test cases to user stories (traceability)', 'Define entry/exit criteria before sprint starts', 'Identify test data requirements upfront', 'Plan regression scope for each release'] },
  { title: 'Communication', items: ['Tag developers in bug comments for quick resolution', 'Use @mentions for urgent blockers', 'Add watchers for stakeholder visibility', 'Update bug status promptly', 'Document workarounds in comments'] },
  { title: 'Metrics & Reporting', items: ['Track defect injection rate (bugs found per story)', 'Monitor bug escape rate (production bugs vs QA bugs)', 'Report test execution coverage weekly', 'Share sprint quality metrics in retrospective', 'Maintain running defect backlog report'] }
];

export default function JiraWorkflow() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});
  const [copiedJql, setCopiedJql] = useState(null);

  const toggle = (key) => setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));

  const copyJql = (jql, idx) => {
    navigator.clipboard.writeText(jql);
    setCopiedJql(idx);
    setTimeout(() => setCopiedJql(null), 2000);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 0: // Bug Lifecycle
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Defect / Bug Lifecycle</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              {BUG_LIFECYCLE_STATES.map((s, i) => (
                <React.Fragment key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: s.color, color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {s.state}
                    </span>
                  </div>
                  {i < BUG_LIFECYCLE_STATES.length - 1 && <span style={{ color: '#94a3b8', fontSize: 18 }}>{'\u2192'}</span>}
                </React.Fragment>
              ))}
            </div>

            {BUG_LIFECYCLE_STATES.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, padding: '12px 16px', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: `4px solid ${s.color}` }}>
                <span style={{ background: s.color, color: '#fff', padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', height: 'fit-content' }}>{s.state}</span>
                <span style={{ fontSize: 14, color: '#475569' }}>{s.desc}</span>
              </div>
            ))}

            <h3 style={{ margin: '24px 0 16px' }}>Bug Report Fields</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Field</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Example</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Required</th>
                </tr>
              </thead>
              <tbody>
                {BUG_FIELDS.map((f, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 14px', fontWeight: 600 }}>{f.field}</td>
                    <td style={{ padding: '8px 14px', color: '#64748b', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}>{f.example}</td>
                    <td style={{ padding: '8px 14px', textAlign: 'center' }}>
                      {f.required ? <span style={{ color: '#dc2626', fontWeight: 700 }}>Yes</span> : <span style={{ color: '#94a3b8' }}>Optional</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ margin: '24px 0 16px' }}>Severity vs Priority Matrix</h3>
            {SEVERITY_MATRIX.map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 10, borderLeft: `4px solid ${s.color}`, padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ background: s.color, color: '#fff', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{s.severity}</span>
                  <span style={{ background: '#1e293b', color: '#fff', padding: '3px 8px', borderRadius: 4, fontSize: 11 }}>{s.priority}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>SLA: {s.sla}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {s.examples.map((ex, j) => (
                    <span key={j} style={{ background: '#f8fafc', padding: '4px 10px', borderRadius: 4, fontSize: 12, color: '#475569', border: '1px solid #e2e8f0' }}>{ex}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 1: // JIRA Workflows
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>JIRA Workflows for Banking QA</h3>
            {JIRA_WORKFLOWS.map((wf, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', background: '#f0f4ff', borderBottom: '1px solid #e2e8f0' }}>
                  <strong style={{ fontSize: 16 }}>{wf.name}</strong>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    {wf.flow.split(' → ').map((step, j, arr) => (
                      <React.Fragment key={j}>
                        <span style={{ background: '#4f46e5', color: '#fff', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{step}</span>
                        {j < arr.length - 1 && <span style={{ color: '#94a3b8' }}>{'\u2192'}</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '12px 18px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>From</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>{'\u2192'}</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>To</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Trigger</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wf.transitions.map((t, j) => (
                        <tr key={j} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '6px 12px', fontWeight: 600 }}>{t.from}</td>
                          <td style={{ padding: '6px 12px', textAlign: 'center', color: '#94a3b8' }}>{'\u2192'}</td>
                          <td style={{ padding: '6px 12px', fontWeight: 600 }}>{t.to}</td>
                          <td style={{ padding: '6px 12px', color: '#64748b', fontSize: 12 }}>{t.trigger}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <h3 style={{ margin: '20px 0 12px' }}>Useful JQL Queries</h3>
            {JIRA_QUERIES.map((q, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 8 }}>
                <div>
                  <strong style={{ fontSize: 13 }}>{q.name}</strong>
                  <div style={{ fontFamily: 'monospace', fontSize: 11.5, color: '#4f46e5', marginTop: 4, wordBreak: 'break-all' }}>{q.jql}</div>
                </div>
                <button
                  onClick={() => copyJql(q.jql, i)}
                  style={{ padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: 4, background: copiedJql === i ? '#22c55e' : '#f8fafc', color: copiedJql === i ? '#fff' : '#475569', cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap' }}
                >
                  {copiedJql === i ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        );

      case 2: // Test Management
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Test Management in JIRA</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
              {TEST_MGMT_TOOLS.map((t, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16 }}>
                  <strong style={{ fontSize: 15, color: '#1e293b' }}>{t.tool}</strong>
                  <p style={{ color: '#64748b', fontSize: 13, margin: '8px 0' }}>{t.desc}</p>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                    <div><span style={{ color: '#22c55e', fontWeight: 600 }}>+</span> {t.pros}</div>
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>-</span> {t.cons}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ marginBottom: 12 }}>Traceability Matrix (Requirement → Test Case → Defect)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Requirement</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>User Story</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Test Cases</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Defects</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { req: 'REQ-001', story: 'US-101: Customer Login', tc: 'TC-001 to TC-005', status: 'Pass', defects: 'BUG-012' },
                  { req: 'REQ-002', story: 'US-102: Fund Transfer', tc: 'TC-006 to TC-015', status: 'Fail', defects: 'BUG-015, BUG-018' },
                  { req: 'REQ-003', story: 'US-103: Bill Payment', tc: 'TC-016 to TC-022', status: 'Pass', defects: '-' },
                  { req: 'REQ-004', story: 'US-104: Loan Application', tc: 'TC-023 to TC-028', status: 'In Progress', defects: 'BUG-020' },
                  { req: 'REQ-005', story: 'US-105: Card Management', tc: 'TC-029 to TC-035', status: 'Not Run', defects: '-' },
                  { req: 'REQ-006', story: 'US-106: Account Statement', tc: 'TC-036 to TC-040', status: 'Pass', defects: '-' },
                  { req: 'REQ-007', story: 'US-107: Security (OTP/2FA)', tc: 'TC-041 to TC-050', status: 'Fail', defects: 'BUG-025' }
                ].map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 600, color: '#4f46e5' }}>{r.req}</td>
                    <td style={{ padding: '8px 12px' }}>{r.story}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12 }}>{r.tc}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                        background: r.status === 'Pass' ? '#dcfce7' : r.status === 'Fail' ? '#fef2f2' : r.status === 'In Progress' ? '#fef3c7' : '#f1f5f9',
                        color: r.status === 'Pass' ? '#166534' : r.status === 'Fail' ? '#dc2626' : r.status === 'In Progress' ? '#92400e' : '#64748b'
                      }}>{r.status}</span>
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12, color: r.defects === '-' ? '#94a3b8' : '#dc2626' }}>{r.defects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 3: // Sprint Planning
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>QA Role in Agile Sprint Ceremonies</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 16, marginBottom: 24 }}>
              {SPRINT_CEREMONIES.map((c, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <strong style={{ fontSize: 15, color: '#1e293b' }}>{c.ceremony}</strong>
                    <span style={{ fontSize: 11, color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>{c.duration}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#4f46e5', marginBottom: 8 }}>{c.timing}</div>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>{c.qa_role}</p>
                </div>
              ))}
            </div>

            <h3 style={{ marginBottom: 12 }}>Sprint QA Timeline</h3>
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 20 }}>
              <pre style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, color: '#334155', margin: 0, overflowX: 'auto' }}>
{`Sprint Day 1-2:    [Planning] Review stories → Write test cases → Identify test data
Sprint Day 3-5:    [Dev Phase] Prepare test environment → Review PRs → Execute smoke tests
Sprint Day 6-8:    [QA Phase] Execute test cases → Log defects → API testing → DB validation
Sprint Day 9:      [Regression] Run regression suite → Verify bug fixes → Update reports
Sprint Day 10:     [UAT + Demo] Support UAT → Demo tested features → Sprint retrospective

Daily Activities:
  ├── Standup: Report progress + blockers (5 min)
  ├── Execution: Run test cases (4-5 hours)
  ├── Bug Triage: Review & prioritize bugs (30 min)
  ├── Documentation: Update test results (30 min)
  └── Collaboration: Dev discussions, clarifications (1 hour)`}
              </pre>
            </div>
          </div>
        );

      case 4: // Dashboards
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>JIRA Dashboard Widgets for QA</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12, marginBottom: 24 }}>
              {DASHBOARD_WIDGETS.map((w, i) => {
                const [title, desc] = w.split(' — ');
                return (
                  <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ background: '#4f46e5', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                    <div>
                      <strong style={{ fontSize: 13 }}>{title}</strong>
                      {desc && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{desc}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 style={{ marginBottom: 12 }}>Sample QA Metrics Report</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              {[
                { label: 'Total Test Cases', value: '350', color: '#4f46e5' },
                { label: 'Executed', value: '280 (80%)', color: '#22c55e' },
                { label: 'Passed', value: '245 (87.5%)', color: '#16a34a' },
                { label: 'Failed', value: '25 (8.9%)', color: '#dc2626' },
                { label: 'Blocked', value: '10 (3.6%)', color: '#f59e0b' },
                { label: 'Open Bugs', value: '18', color: '#ef4444' },
                { label: 'Bug Fix Rate', value: '85%', color: '#06b6d4' },
                { label: 'Reopen Rate', value: '12%', color: '#a855f7' }
              ].map((m, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16, textAlign: 'center', borderTop: `3px solid ${m.color}` }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5: // Best Practices
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>JIRA Best Practices for QA Testers</h3>
            {BEST_PRACTICES.map((bp, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12, overflow: 'hidden' }}>
                <div onClick={() => toggle(`bp-${i}`)} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: expandedItems[`bp-${i}`] ? '#f0f4ff' : '#fff' }}>
                  <strong>{bp.title}</strong>
                  <span style={{ color: '#94a3b8' }}>{expandedItems[`bp-${i}`] ? '\u25B2' : '\u25BC'}</span>
                </div>
                {expandedItems[`bp-${i}`] && (
                  <div style={{ padding: '0 18px 14px', borderTop: '1px solid #e2e8f0' }}>
                    <ul style={{ margin: '10px 0', paddingLeft: 20 }}>
                      {bp.items.map((item, j) => (
                        <li key={j} style={{ marginBottom: 6, fontSize: 14, color: '#475569' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>JIRA Workflow & Bug Lifecycle</h2>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
          Complete guide to JIRA bug tracking, defect lifecycle, sprint ceremonies, JQL queries, and QA best practices
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20, borderBottom: '2px solid #e2e8f0', paddingBottom: 12 }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: activeTab === i ? '#4f46e5' : '#f1f5f9',
              color: activeTab === i ? '#fff' : '#475569'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}

import React, { useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Data: All checklist sections with steps, priorities, and default state
// ---------------------------------------------------------------------------

const SECTIONS_DATA = [
  {
    id: 'frontend-ui',
    title: 'Frontend UI Testing',
    icon: '\uD83D\uDDA5\uFE0F',
    color: '#3b82f6',
    steps: [
      { text: 'Set up test environment (browser, device lab)', priority: 'P0' },
      { text: 'Review UI mockups and acceptance criteria', priority: 'P0' },
      { text: 'Test all form validations (input, select, checkbox, radio)', priority: 'P0' },
      { text: 'Test responsive design (mobile, tablet, desktop)', priority: 'P1' },
      { text: 'Test keyboard navigation and tab order', priority: 'P1' },
      { text: 'Test color contrast (WCAG AA 4.5:1)', priority: 'P1' },
      { text: 'Test error states and empty states', priority: 'P0' },
      { text: 'Test loading states and skeleton screens', priority: 'P1' },
      { text: 'Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)', priority: 'P1' },
      { text: 'Test internationalization (if applicable)', priority: 'P2' },
      { text: 'Take screenshots of all states', priority: 'P2' },
      { text: 'Log UI defects with screenshots', priority: 'P0' },
    ],
  },
  {
    id: 'backend-api',
    title: 'Backend API Testing',
    icon: '\uD83D\uDD0C',
    color: '#8b5cf6',
    steps: [
      { text: 'Review API documentation / Swagger', priority: 'P0' },
      { text: 'Set up SoapUI / Postman collection', priority: 'P0' },
      { text: 'Test all GET endpoints (200 OK, response schema)', priority: 'P0' },
      { text: 'Test all POST endpoints (201 Created, validation)', priority: 'P0' },
      { text: 'Test all PUT/PATCH endpoints (200 OK, partial update)', priority: 'P0' },
      { text: 'Test all DELETE endpoints (204 No Content, cascade)', priority: 'P0' },
      { text: 'Test authentication (valid token, expired token, no token)', priority: 'P0' },
      { text: 'Test authorization (role-based access)', priority: 'P0' },
      { text: 'Test input validation (required fields, types, ranges)', priority: 'P0' },
      { text: 'Test error responses (400, 401, 403, 404, 500)', priority: 'P0' },
      { text: 'Test pagination (offset, limit, total count)', priority: 'P1' },
      { text: 'Test filtering and sorting', priority: 'P1' },
      { text: 'Test rate limiting (429 Too Many Requests)', priority: 'P1' },
      { text: 'Test CORS headers', priority: 'P1' },
      { text: 'Document all test results', priority: 'P0' },
    ],
  },
  {
    id: 'load-testing',
    title: 'Load Testing',
    icon: '\uD83D\uDCC8',
    color: '#f59e0b',
    steps: [
      { text: 'Identify critical endpoints to test', priority: 'P0' },
      { text: 'Define load test scenarios (normal, peak, stress)', priority: 'P0' },
      { text: 'Set up load testing tool (k6, JMeter, Locust)', priority: 'P0' },
      { text: 'Configure virtual users and ramp-up', priority: 'P1' },
      { text: 'Run baseline test (10 users)', priority: 'P0' },
      { text: 'Run load test (100 users)', priority: 'P0' },
      { text: 'Run stress test (500+ users)', priority: 'P1' },
      { text: 'Analyze results and document findings', priority: 'P0' },
    ],
  },
  {
    id: 'performance',
    title: 'Performance Testing',
    icon: '\u26A1',
    color: '#10b981',
    steps: [
      { text: 'Measure page load time (FCP, LCP, TTI)', priority: 'P0' },
      { text: 'Test API response times under normal load', priority: 'P0' },
      { text: 'Test database query performance', priority: 'P0' },
      { text: 'Check memory usage and leaks', priority: 'P1' },
      { text: 'Test with large datasets (1000+ records)', priority: 'P1' },
      { text: 'Verify caching (HTTP cache, DB query cache)', priority: 'P1' },
      { text: 'Check bundle size and asset optimization', priority: 'P2' },
      { text: 'Test under slow network (3G simulation)', priority: 'P1' },
      { text: 'Profile CPU usage during peak operations', priority: 'P2' },
      { text: 'Generate performance report', priority: 'P0' },
    ],
  },
  {
    id: 'security',
    title: 'Security Testing',
    icon: '\uD83D\uDD12',
    color: '#ef4444',
    steps: [
      { text: 'Test SQL injection on all input fields', priority: 'P0' },
      { text: 'Test XSS on all text inputs', priority: 'P0' },
      { text: 'Test CSRF protection', priority: 'P0' },
      { text: 'Verify authentication bypass attempts fail', priority: 'P0' },
      { text: 'Test authorization - access other user\'s data', priority: 'P0' },
      { text: 'Check PII masking in API responses', priority: 'P0' },
      { text: 'Verify passwords are hashed (not plain text)', priority: 'P0' },
      { text: 'Test session management (expiry, invalidation)', priority: 'P1' },
      { text: 'Check security headers (CSP, HSTS, X-Frame-Options)', priority: 'P1' },
      { text: 'Run vulnerability scan (OWASP ZAP)', priority: 'P0' },
    ],
  },
  {
    id: 'database',
    title: 'Database Testing',
    icon: '\uD83D\uDDC4\uFE0F',
    color: '#6366f1',
    steps: [
      { text: 'Verify schema matches documentation', priority: 'P0' },
      { text: 'Test all CRUD operations', priority: 'P0' },
      { text: 'Verify foreign key constraints', priority: 'P0' },
      { text: 'Test null handling and defaults', priority: 'P1' },
      { text: 'Verify indexes exist on query columns', priority: 'P1' },
      { text: 'Test concurrent access (WAL mode)', priority: 'P1' },
      { text: 'Test data integrity after transactions', priority: 'P0' },
      { text: 'Verify migration scripts run cleanly', priority: 'P0' },
    ],
  },
  {
    id: 'accessibility',
    title: 'Web Accessibility Testing',
    icon: '\u267F',
    color: '#0891b2',
    steps: [
      { text: 'Run automated a11y scan (axe, Lighthouse)', priority: 'P0' },
      { text: 'Test keyboard-only navigation', priority: 'P0' },
      { text: 'Test with screen reader (NVDA/VoiceOver)', priority: 'P0' },
      { text: 'Verify all images have alt text', priority: 'P0' },
      { text: 'Check color contrast ratios (4.5:1 minimum)', priority: 'P0' },
      { text: 'Test focus indicators visible', priority: 'P1' },
      { text: 'Verify form labels and ARIA attributes', priority: 'P1' },
      { text: 'Test skip navigation link', priority: 'P2' },
      { text: 'Verify heading hierarchy (h1 > h2 > h3)', priority: 'P1' },
      { text: 'Test error announcements for screen readers', priority: 'P1' },
    ],
  },
  {
    id: 'integration',
    title: 'Integration Testing',
    icon: '\uD83D\uDD17',
    color: '#d946ef',
    steps: [
      { text: 'Test end-to-end registration flow', priority: 'P0' },
      { text: 'Test login -> dashboard -> transaction flow', priority: 'P0' },
      { text: 'Test fund transfer complete cycle', priority: 'P0' },
      { text: 'Test bill payment complete cycle', priority: 'P0' },
      { text: 'Test loan application complete cycle', priority: 'P1' },
      { text: 'Test SoapUI JDBC integration with database', priority: 'P1' },
      { text: 'Test API -> Database consistency', priority: 'P0' },
      { text: 'Test notification delivery after transactions', priority: 'P1' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Priority badge configuration
// ---------------------------------------------------------------------------

const PRIORITY_CONFIG = {
  P0: { label: 'P0 Critical', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  P1: { label: 'P1 High', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  P2: { label: 'P2 Medium', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
};

// ---------------------------------------------------------------------------
// Status options
// ---------------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started', color: '#9ca3af' },
  { value: 'in_progress', label: 'In Progress', color: '#3b82f6' },
  { value: 'done', label: 'Done', color: '#22c55e' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildInitialState() {
  const state = {};
  SECTIONS_DATA.forEach((section) => {
    state[section.id] = section.steps.map(() => ({
      checked: false,
      status: 'not_started',
      notes: '',
    }));
  });
  return state;
}

function getProgressColor(pct) {
  if (pct >= 80) return '#22c55e';
  if (pct >= 50) return '#f59e0b';
  return '#ef4444';
}

// ---------------------------------------------------------------------------
// Component: ProgressBar
// ---------------------------------------------------------------------------

function ProgressBar({ completed, total, height = 8, showLabel = true }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const color = getProgressColor(pct);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
      <div
        style={{
          flex: 1,
          height,
          backgroundColor: '#f3f4f6',
          borderRadius: height / 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: height / 2,
            transition: 'width 0.3s ease, background-color 0.3s ease',
          }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: 13, fontWeight: 600, color, minWidth: 42, textAlign: 'right' }}>
          {pct}%
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component: PriorityBadge
// ---------------------------------------------------------------------------

function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.P2;
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 11,
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: 9999,
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
      }}
    >
      {cfg.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component: StatusSelector
// ---------------------------------------------------------------------------

function StatusSelector({ value, onChange }) {
  const current = STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: '3px 8px',
        borderRadius: 6,
        border: `1.5px solid ${current.color}`,
        color: current.color,
        backgroundColor: '#fff',
        cursor: 'pointer',
        outline: 'none',
        appearance: 'auto',
      }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Component: ChecklistStep
// ---------------------------------------------------------------------------

function ChecklistStep({ index, step, state, onToggle, onStatusChange, onNotesChange }) {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 16px',
        borderBottom: '1px solid #f3f4f6',
        backgroundColor: state.checked ? '#f0fdf4' : '#fff',
        transition: 'background-color 0.2s ease',
      }}
    >
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Step number */}
        <span
          style={{
            minWidth: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: state.checked ? '#22c55e' : '#e5e7eb',
            color: state.checked ? '#fff' : '#6b7280',
            fontSize: 12,
            fontWeight: 700,
            transition: 'all 0.2s ease',
          }}
        >
          {state.checked ? '\u2713' : index + 1}
        </span>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={state.checked}
          onChange={onToggle}
          style={{
            width: 18,
            height: 18,
            cursor: 'pointer',
            accentColor: '#22c55e',
            flexShrink: 0,
          }}
        />

        {/* Step text */}
        <span
          style={{
            flex: 1,
            fontSize: 14,
            color: state.checked ? '#6b7280' : '#1f2937',
            textDecoration: state.checked ? 'line-through' : 'none',
            lineHeight: 1.4,
            transition: 'color 0.2s ease',
          }}
        >
          {step.text}
        </span>

        {/* Priority badge */}
        <PriorityBadge priority={step.priority} />

        {/* Status selector */}
        <StatusSelector value={state.status} onChange={onStatusChange} />

        {/* Notes toggle */}
        <button
          onClick={() => setNotesOpen(!notesOpen)}
          title={notesOpen ? 'Hide notes' : 'Add notes'}
          style={{
            background: 'none',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: 13,
            color: state.notes ? '#3b82f6' : '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            whiteSpace: 'nowrap',
            transition: 'color 0.2s ease',
          }}
        >
          {state.notes ? '\uD83D\uDCDD' : '\u270F\uFE0F'} Notes
        </button>
      </div>

      {/* Notes area (expandable) */}
      {notesOpen && (
        <div style={{ marginTop: 8, marginLeft: 68 }}>
          <textarea
            value={state.notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add notes, observations, or defect references..."
            rows={2}
            style={{
              width: '100%',
              fontSize: 13,
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              resize: 'vertical',
              fontFamily: 'inherit',
              outline: 'none',
              lineHeight: 1.5,
              backgroundColor: '#fafafa',
            }}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function TestingChecklist() {
  const [checklistState, setChecklistState] = useState(buildInitialState);

  // -- Computed totals --
  const computeTotals = useCallback(() => {
    let totalSteps = 0;
    let completedSteps = 0;
    SECTIONS_DATA.forEach((section) => {
      const sectionState = checklistState[section.id] || [];
      totalSteps += sectionState.length;
      completedSteps += sectionState.filter((s) => s.checked).length;
    });
    return { totalSteps, completedSteps };
  }, [checklistState]);

  const { totalSteps, completedSteps } = computeTotals();
  const overallPct = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  // -- Handlers --
  const handleStepToggle = useCallback((sectionId, stepIdx) => {
    setChecklistState((prev) => {
      const next = { ...prev };
      const steps = [...next[sectionId]];
      const newChecked = !steps[stepIdx].checked;
      steps[stepIdx] = {
        ...steps[stepIdx],
        checked: newChecked,
        status: newChecked ? 'done' : 'not_started',
      };
      next[sectionId] = steps;
      return next;
    });
  }, []);

  const handleStepStatusChange = useCallback((sectionId, stepIdx, status) => {
    setChecklistState((prev) => {
      const next = { ...prev };
      const steps = [...next[sectionId]];
      steps[stepIdx] = {
        ...steps[stepIdx],
        status,
        checked: status === 'done',
      };
      next[sectionId] = steps;
      return next;
    });
  }, []);

  const handleStepNotesChange = useCallback((sectionId, stepIdx, notes) => {
    setChecklistState((prev) => {
      const next = { ...prev };
      const steps = [...next[sectionId]];
      steps[stepIdx] = { ...steps[stepIdx], notes };
      next[sectionId] = steps;
      return next;
    });
  }, []);

  const handleResetAll = useCallback(() => {
    if (window.confirm('Reset all checklist progress? This cannot be undone.')) {
      setChecklistState(buildInitialState());
    }
  }, []);

  const handleExpandAll = useCallback(() => {
    // This is handled at the section level; we use a shared state
    setAllExpanded((prev) => !prev);
  }, []);

  const [allExpanded, setAllExpanded] = useState(false);

  // -- Section stats for the summary grid --
  const sectionStats = SECTIONS_DATA.map((section) => {
    const sectionState = checklistState[section.id] || [];
    const done = sectionState.filter((s) => s.checked).length;
    const total = sectionState.length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { id: section.id, title: section.title, icon: section.icon, color: section.color, done, total, pct };
  });

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1100, margin: '0 auto', backgroundColor: '#fff', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
          Testing Checklist / Sequence Setup
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
          Step-by-step setup sequences for each type of testing. Track progress, add notes, and ensure complete coverage.
        </p>
      </div>

      {/* Overall Score Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: 14,
          padding: '28px 32px',
          marginBottom: 28,
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Testing Readiness
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.1 }}>
              <span style={{ color: getProgressColor(overallPct) }}>{completedSteps}</span>
              <span style={{ color: '#64748b', fontSize: 24 }}> / {totalSteps}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginLeft: 10 }}>
                steps completed
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: `conic-gradient(${getProgressColor(overallPct)} ${overallPct * 3.6}deg, #475569 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <span style={{ fontSize: 22, fontWeight: 900, color: getProgressColor(overallPct) }}>
                  {overallPct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginTop: 20 }}>
          <div style={{ height: 10, backgroundColor: '#475569', borderRadius: 5, overflow: 'hidden' }}>
            <div
              style={{
                width: `${overallPct}%`,
                height: '100%',
                backgroundColor: getProgressColor(overallPct),
                borderRadius: 5,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Section Summary Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12,
          marginBottom: 28,
        }}
      >
        {sectionStats.map((s) => (
          <div
            key={s.id}
            style={{
              padding: '14px 16px',
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              backgroundColor: '#fff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', flex: 1 }}>{s.title}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: getProgressColor(s.pct) }}>{s.pct}%</span>
            </div>
            <ProgressBar completed={s.done} total={s.total} height={5} showLabel={false} />
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
              {s.done}/{s.total} completed
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <button
          onClick={handleExpandAll}
          style={{
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            backgroundColor: '#fff',
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </button>
        <button
          onClick={handleResetAll}
          style={{
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            border: '1px solid #fecaca',
            borderRadius: 8,
            backgroundColor: '#fff',
            color: '#dc2626',
            cursor: 'pointer',
          }}
        >
          Reset All
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: '#9ca3af' }}>
          {completedSteps} of {totalSteps} total steps done
        </span>
      </div>

      {/* Checklist Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SECTIONS_DATA.map((section) => (
          <ChecklistSectionWrapper
            key={section.id}
            section={section}
            stepsState={checklistState[section.id] || []}
            onStepToggle={handleStepToggle}
            onStepStatusChange={handleStepStatusChange}
            onStepNotesChange={handleStepNotesChange}
            forceExpanded={allExpanded}
          />
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 0 16px', color: '#9ca3af', fontSize: 12 }}>
        Testing Checklist - Track your QA readiness across all testing types
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wrapper to support forceExpanded from parent
// ---------------------------------------------------------------------------

function ChecklistSectionWrapper({ section, stepsState, onStepToggle, onStepStatusChange, onStepNotesChange, forceExpanded }) {
  const [localExpanded, setLocalExpanded] = useState(false);
  const expanded = forceExpanded || localExpanded;

  const completed = stepsState.filter((s) => s.checked).length;
  const total = stepsState.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div
        onClick={() => setLocalExpanded(!localExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 20px',
          cursor: 'pointer',
          userSelect: 'none',
          borderBottom: expanded ? '1px solid #e5e7eb' : 'none',
        }}
      >
        <span
          style={{
            fontSize: 14,
            color: '#6b7280',
            transition: 'transform 0.2s ease',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}
        >
          \u25B6
        </span>

        <span style={{ fontSize: 22 }}>{section.icon}</span>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{section.title}</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '2px 10px',
                borderRadius: 9999,
                backgroundColor: section.color + '18',
                color: section.color,
              }}
            >
              {completed}/{total} steps
            </span>
          </div>
          <ProgressBar completed={completed} total={total} height={6} showLabel={false} />
        </div>

        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: getProgressColor(pct),
            minWidth: 54,
            textAlign: 'right',
          }}
        >
          {pct}%
        </span>
      </div>

      {/* Steps */}
      {expanded && (
        <div>
          {section.steps.map((step, idx) => (
            <ChecklistStep
              key={idx}
              index={idx}
              step={step}
              state={stepsState[idx]}
              onToggle={() => onStepToggle(section.id, idx)}
              onStatusChange={(val) => onStepStatusChange(section.id, idx, val)}
              onNotesChange={(val) => onStepNotesChange(section.id, idx, val)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

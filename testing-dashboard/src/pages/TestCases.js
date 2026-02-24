import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3001';

const MODULES = [
  'Registration',
  'Authentication',
  'Accounts',
  'Transfers',
  'Bill Payment',
  'Loans',
  'Cards',
  'Security',
];

const STATUSES = ['all', 'pass', 'fail', 'blocked', 'not_run', 'in_progress', 'skipped'];

const PRIORITIES = ['all', 'critical', 'high', 'medium', 'low'];

const STATUS_COLORS = {
  pass: '#22c55e',
  fail: '#ef4444',
  blocked: '#f59e0b',
  not_run: '#6b7280',
  in_progress: '#3b82f6',
  skipped: '#8b5cf6',
};

const STATUS_LABELS = {
  pass: 'Pass',
  fail: 'Fail',
  blocked: 'Blocked',
  not_run: 'Not Run',
  in_progress: 'In Progress',
  skipped: 'Skipped',
};

const PRIORITY_COLORS = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#ca8a04',
  low: '#16a34a',
};

function formatTestSteps(stepsText) {
  if (!stepsText) return [];
  return stepsText.split('\n').filter((s) => s.trim());
}

function formatTestData(dataText) {
  if (!dataText) return null;
  try {
    return JSON.parse(dataText);
  } catch {
    return dataText;
  }
}

function TestCases() {
  const [testCases, setTestCases] = useState([]);
  const [testSuites, setTestSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  // Filters
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchTestCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (moduleFilter) params.append('module', moduleFilter);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter && priorityFilter !== 'all') params.append('priority', priorityFilter);

      const queryString = params.toString();
      const url = `${API_BASE}/api/test-cases${queryString ? '?' + queryString : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch test cases`);
      const data = await response.json();
      setTestCases(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [moduleFilter, statusFilter, priorityFilter]);

  const fetchTestSuites = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/test-suites`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch test suites`);
      const data = await response.json();
      setTestSuites(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchTestSuites();
  }, [fetchTestSuites]);

  useEffect(() => {
    fetchTestCases();
  }, [fetchTestCases]);

  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const totalSuiteCases = testSuites.reduce((sum, s) => sum + (s.total_cases || 0), 0);
  const totalSuitePassed = testSuites.reduce((sum, s) => sum + (s.passed || 0), 0);
  const totalSuiteFailed = testSuites.reduce((sum, s) => sum + (s.failed || 0), 0);
  const totalSuiteNotRun = testSuites.reduce((sum, s) => sum + (s.not_run || 0), 0);
  const passRate = totalSuiteCases > 0 ? ((totalSuitePassed / totalSuiteCases) * 100).toFixed(1) : 0;

  return (
    <div className="test-cases-page">
      <h2 className="page-title">Test Cases</h2>

      {/* Suite Summary Cards */}
      <div className="suite-summary-container">
        <div className="suite-summary-card suite-card-total">
          <div className="suite-card-number">{totalSuiteCases}</div>
          <div className="suite-card-label">Total Cases</div>
        </div>
        <div className="suite-summary-card suite-card-passed">
          <div className="suite-card-number">{totalSuitePassed}</div>
          <div className="suite-card-label">Passed</div>
        </div>
        <div className="suite-summary-card suite-card-failed">
          <div className="suite-card-number">{totalSuiteFailed}</div>
          <div className="suite-card-label">Failed</div>
        </div>
        <div className="suite-summary-card suite-card-notrun">
          <div className="suite-card-number">{totalSuiteNotRun}</div>
          <div className="suite-card-label">Not Run</div>
        </div>
        <div className="suite-summary-card suite-card-rate">
          <div className="suite-card-number">{passRate}%</div>
          <div className="suite-card-label">Pass Rate</div>
        </div>
      </div>

      {/* Individual Suite Breakdown */}
      <div className="suite-breakdown">
        <h3 className="section-subtitle">Test Suites</h3>
        <div className="suite-grid">
          {testSuites.map((suite) => (
            <div key={suite.id} className="suite-card">
              <div className="suite-card-header">
                <span className="suite-name">{suite.name}</span>
                <span className="suite-module-tag">{suite.module}</span>
              </div>
              <div className="suite-card-body">
                <div className="suite-stat">
                  <span className="suite-stat-label">Total:</span>
                  <span className="suite-stat-value">{suite.total_cases}</span>
                </div>
                <div className="suite-stat">
                  <span className="suite-stat-label">Passed:</span>
                  <span className="suite-stat-value" style={{ color: '#22c55e' }}>{suite.passed}</span>
                </div>
                <div className="suite-stat">
                  <span className="suite-stat-label">Failed:</span>
                  <span className="suite-stat-value" style={{ color: '#ef4444' }}>{suite.failed}</span>
                </div>
                <div className="suite-stat">
                  <span className="suite-stat-label">Not Run:</span>
                  <span className="suite-stat-value" style={{ color: '#6b7280' }}>{suite.not_run}</span>
                </div>
              </div>
              {suite.total_cases > 0 && (
                <div className="suite-progress-bar">
                  <div
                    className="suite-progress-fill suite-progress-pass"
                    style={{ width: `${(suite.passed / suite.total_cases) * 100}%` }}
                  />
                  <div
                    className="suite-progress-fill suite-progress-fail"
                    style={{ width: `${(suite.failed / suite.total_cases) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="tc-filters">
        <h3 className="section-subtitle">Filter Test Cases</h3>
        <div className="tc-filter-row">
          <div className="tc-filter-group">
            <label className="tc-filter-label">Module</label>
            <select
              className="tc-filter-select"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="">All Modules</option>
              {MODULES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="tc-filter-group">
            <label className="tc-filter-label">Status</label>
            <select
              className="tc-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s === 'all' ? 'All Statuses' : STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="tc-filter-group">
            <label className="tc-filter-label">Priority</label>
            <select
              className="tc-filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p === 'all' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button className="tc-filter-reset" onClick={() => { setModuleFilter(''); setStatusFilter('all'); setPriorityFilter('all'); }}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="tc-error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="tc-loading">
          <div className="tc-spinner" />
          Loading test cases...
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="tc-results-count">
          Showing {testCases.length} test case{testCases.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Test Cases Table */}
      {!loading && testCases.length > 0 && (
        <div className="tc-table-container">
          <table className="tc-table">
            <thead>
              <tr>
                <th>TC ID</th>
                <th>Title</th>
                <th>Module</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {testCases.map((tc) => (
                <React.Fragment key={tc.id}>
                  <tr
                    className={`tc-row ${expandedRow === tc.id ? 'tc-row-expanded' : ''}`}
                    onClick={() => handleRowClick(tc.id)}
                  >
                    <td className="tc-cell-id">{tc.test_case_id}</td>
                    <td className="tc-cell-title">{tc.title}</td>
                    <td>{tc.module}</td>
                    <td>
                      <span className="tc-category-tag">{tc.category}</span>
                    </td>
                    <td>
                      <span
                        className="tc-priority-badge"
                        style={{ backgroundColor: PRIORITY_COLORS[tc.priority] || '#6b7280' }}
                      >
                        {tc.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className="tc-status-badge"
                        style={{ backgroundColor: STATUS_COLORS[tc.status] || '#6b7280' }}
                      >
                        {STATUS_LABELS[tc.status] || tc.status}
                      </span>
                    </td>
                    <td>{tc.assigned_to || '-'}</td>
                  </tr>
                  {expandedRow === tc.id && (
                    <tr className="tc-expanded-row">
                      <td colSpan={7}>
                        <div className="tc-expanded-content">
                          {/* Preconditions */}
                          <div className="tc-detail-section">
                            <h4 className="tc-detail-heading">Preconditions</h4>
                            <p className="tc-detail-text">{tc.preconditions || 'None specified'}</p>
                          </div>

                          {/* Test Steps */}
                          <div className="tc-detail-section">
                            <h4 className="tc-detail-heading">Test Steps</h4>
                            <ol className="tc-steps-list">
                              {formatTestSteps(tc.test_steps).map((step, idx) => {
                                const cleanStep = step.replace(/^\d+\.\s*/, '');
                                return (
                                  <li key={idx} className="tc-step-item">{cleanStep}</li>
                                );
                              })}
                            </ol>
                          </div>

                          {/* Test Data */}
                          <div className="tc-detail-section">
                            <h4 className="tc-detail-heading">Test Data</h4>
                            {(() => {
                              const data = formatTestData(tc.test_data);
                              if (!data) return <p className="tc-detail-text">No test data</p>;
                              if (typeof data === 'string') return <p className="tc-detail-text">{data}</p>;
                              return (
                                <pre className="tc-json-block">{JSON.stringify(data, null, 2)}</pre>
                              );
                            })()}
                          </div>

                          {/* Expected vs Actual */}
                          <div className="tc-detail-columns">
                            <div className="tc-detail-section tc-detail-half">
                              <h4 className="tc-detail-heading">Expected Result</h4>
                              <p className="tc-detail-text">{tc.expected_result || '-'}</p>
                            </div>
                            <div className="tc-detail-section tc-detail-half">
                              <h4 className="tc-detail-heading">Actual Result</h4>
                              <p className="tc-detail-text">{tc.actual_result || 'Not executed yet'}</p>
                            </div>
                          </div>

                          {/* Execution Info */}
                          <div className="tc-detail-columns">
                            <div className="tc-detail-section tc-detail-half">
                              <h4 className="tc-detail-heading">Execution Time</h4>
                              <p className="tc-detail-text">
                                {tc.execution_time_ms != null ? `${tc.execution_time_ms} ms` : 'Not executed'}
                              </p>
                            </div>
                            <div className="tc-detail-section tc-detail-half">
                              <h4 className="tc-detail-heading">Executed At</h4>
                              <p className="tc-detail-text">
                                {tc.executed_at || 'Not executed'}
                              </p>
                            </div>
                          </div>

                          {/* Notes */}
                          {tc.notes && (
                            <div className="tc-detail-section">
                              <h4 className="tc-detail-heading">Notes</h4>
                              <p className="tc-detail-text">{tc.notes}</p>
                            </div>
                          )}

                          {/* Meta */}
                          <div className="tc-detail-meta">
                            <span>Environment: <strong>{tc.environment || 'N/A'}</strong></span>
                            <span>Created: <strong>{tc.created_at || 'N/A'}</strong></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && testCases.length === 0 && (
        <div className="tc-empty-state">
          No test cases found matching the selected filters.
        </div>
      )}

      <style>{`
        .test-cases-page {
          padding: 0;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1.25rem 0;
        }

        /* Suite Summary Cards */
        .suite-summary-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .suite-summary-card {
          flex: 1;
          min-width: 140px;
          background: #fff;
          border-radius: 10px;
          padding: 1.25rem 1rem;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-top: 4px solid #e2e8f0;
        }

        .suite-card-total { border-top-color: #3b82f6; }
        .suite-card-passed { border-top-color: #22c55e; }
        .suite-card-failed { border-top-color: #ef4444; }
        .suite-card-notrun { border-top-color: #6b7280; }
        .suite-card-rate { border-top-color: #8b5cf6; }

        .suite-card-number {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }

        .suite-card-label {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Suite Breakdown */
        .suite-breakdown {
          margin-bottom: 1.5rem;
        }

        .section-subtitle {
          font-size: 1.1rem;
          font-weight: 600;
          color: #334155;
          margin: 0 0 0.75rem 0;
        }

        .suite-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .suite-card {
          background: #fff;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
        }

        .suite-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .suite-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.95rem;
        }

        .suite-module-tag {
          background: #eff6ff;
          color: #2563eb;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .suite-card-body {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .suite-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .suite-stat-label {
          font-size: 0.7rem;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .suite-stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
        }

        .suite-progress-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          display: flex;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .suite-progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .suite-progress-pass { background: #22c55e; }
        .suite-progress-fail { background: #ef4444; }

        /* Filters */
        .tc-filters {
          background: #fff;
          border-radius: 8px;
          padding: 1rem 1.25rem;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
        }

        .tc-filter-row {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .tc-filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 160px;
        }

        .tc-filter-label {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .tc-filter-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.9rem;
          background: #fff;
          color: #1e293b;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
        }

        .tc-filter-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
        }

        .tc-filter-reset {
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          color: #475569;
          font-weight: 500;
          transition: background 0.2s;
        }

        .tc-filter-reset:hover {
          background: #e2e8f0;
        }

        /* Error / Loading / Empty */
        .tc-error-message {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .tc-loading {
          text-align: center;
          padding: 3rem 0;
          color: #64748b;
          font-size: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .tc-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: tc-spin 0.8s linear infinite;
        }

        @keyframes tc-spin {
          to { transform: rotate(360deg); }
        }

        .tc-results-count {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 0.75rem;
        }

        .tc-empty-state {
          text-align: center;
          padding: 3rem 0;
          color: #94a3b8;
          font-size: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px dashed #e2e8f0;
        }

        /* Table */
        .tc-table-container {
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
        }

        .tc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
          background: #fff;
        }

        .tc-table thead th {
          background: #f8fafc;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #475569;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        .tc-table tbody td {
          padding: 0.65rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        .tc-row {
          cursor: pointer;
          transition: background 0.15s;
        }

        .tc-row:hover {
          background: #f8fafc;
        }

        .tc-row-expanded {
          background: #eff6ff;
        }

        .tc-cell-id {
          font-family: 'Courier New', Courier, monospace;
          font-weight: 600;
          color: #2563eb;
          white-space: nowrap;
        }

        .tc-cell-title {
          max-width: 320px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tc-category-tag {
          background: #f1f5f9;
          color: #475569;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .tc-status-badge,
        .tc-priority-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 12px;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          white-space: nowrap;
        }

        /* Expanded Row */
        .tc-expanded-row td {
          padding: 0;
          background: #f8fafc;
        }

        .tc-expanded-content {
          padding: 1.25rem 1.5rem;
          border-top: 2px solid #3b82f6;
        }

        .tc-detail-section {
          margin-bottom: 1rem;
        }

        .tc-detail-heading {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.4rem 0;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .tc-detail-text {
          color: #475569;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }

        .tc-steps-list {
          padding-left: 1.25rem;
          margin: 0;
        }

        .tc-step-item {
          color: #475569;
          font-size: 0.88rem;
          line-height: 1.6;
          padding: 2px 0;
        }

        .tc-json-block {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 6px;
          font-size: 0.82rem;
          overflow-x: auto;
          margin: 0;
          font-family: 'Courier New', Courier, monospace;
          line-height: 1.5;
        }

        .tc-detail-columns {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .tc-detail-half {
          flex: 1;
          min-width: 250px;
        }

        .tc-detail-meta {
          display: flex;
          gap: 2rem;
          font-size: 0.82rem;
          color: #64748b;
          padding-top: 0.75rem;
          border-top: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .tc-detail-meta strong {
          color: #334155;
        }
      `}</style>
    </div>
  );
}

export default TestCases;

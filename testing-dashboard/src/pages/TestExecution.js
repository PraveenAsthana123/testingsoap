import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3001';

const STATUS_OPTIONS = [
  { value: 'pass', label: 'Pass' },
  { value: 'fail', label: 'Fail' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'skipped', label: 'Skipped' },
];

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

function formatTestSteps(stepsText) {
  if (!stepsText) return [];
  return stepsText
    .split('\n')
    .filter((s) => s.trim())
    .map((step) => step.replace(/^\d+\.\s*/, ''));
}

function formatTestData(dataText) {
  if (!dataText) return null;
  try {
    return JSON.parse(dataText);
  } catch {
    return dataText;
  }
}

function TestExecution() {
  const [testCases, setTestCases] = useState([]);
  const [selectedTcId, setSelectedTcId] = useState('');
  const [selectedTc, setSelectedTc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Execution form state
  const [actualResult, setActualResult] = useState('');
  const [execStatus, setExecStatus] = useState('pass');
  const [notes, setNotes] = useState('');
  const [executionTime, setExecutionTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Step checklist
  const [checkedSteps, setCheckedSteps] = useState({});

  // Execution history
  const [history, setHistory] = useState([]);

  // Show all or only not_run
  const [showAll, setShowAll] = useState(false);

  const fetchTestCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = showAll
        ? `${API_BASE}/api/test-cases`
        : `${API_BASE}/api/test-cases?status=not_run`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch test cases`);
      const data = await response.json();
      setTestCases(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showAll]);

  useEffect(() => {
    fetchTestCases();
  }, [fetchTestCases]);

  // When a test case is selected
  useEffect(() => {
    if (!selectedTcId) {
      setSelectedTc(null);
      return;
    }
    const tc = testCases.find((t) => String(t.id) === String(selectedTcId));
    setSelectedTc(tc || null);
    setActualResult('');
    setExecStatus('pass');
    setNotes('');
    setExecutionTime('');
    setCheckedSteps({});
    setSubmitMessage(null);
  }, [selectedTcId, testCases]);

  const handleStepToggle = (idx) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTc) return;

    setSubmitting(true);
    setSubmitMessage(null);

    const payload = {
      status: execStatus,
      actual_result: actualResult,
      notes: notes,
      execution_time_ms: executionTime ? parseInt(executionTime, 10) : null,
    };

    try {
      const response = await fetch(`${API_BASE}/api/test-cases/${selectedTc.id}/execute`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `HTTP ${response.status}: Execution update failed`);
      }

      const updatedTc = await response.json();

      setSubmitMessage({
        type: 'success',
        text: `Test case ${updatedTc.test_case_id} updated to "${STATUS_LABELS[updatedTc.status]}".`,
      });

      // Add to history
      setHistory((prev) => [
        {
          id: updatedTc.id,
          test_case_id: updatedTc.test_case_id,
          title: updatedTc.title,
          module: updatedTc.module,
          status: updatedTc.status,
          execution_time_ms: updatedTc.execution_time_ms,
          executed_at: updatedTc.executed_at,
          actual_result: updatedTc.actual_result,
        },
        ...prev,
      ]);

      // Refresh test cases list
      await fetchTestCases();

      // Clear form
      setSelectedTcId('');
      setSelectedTc(null);
      setActualResult('');
      setExecStatus('pass');
      setNotes('');
      setExecutionTime('');
      setCheckedSteps({});
    } catch (err) {
      setSubmitMessage({
        type: 'error',
        text: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const steps = selectedTc ? formatTestSteps(selectedTc.test_steps) : [];
  const testData = selectedTc ? formatTestData(selectedTc.test_data) : null;
  const allStepsChecked = steps.length > 0 && steps.every((_, idx) => checkedSteps[idx]);

  return (
    <div className="te-page">
      <h2 className="te-page-title">Manual Test Execution</h2>

      {/* Toggle: not_run only vs all */}
      <div className="te-mode-toggle">
        <label className="te-toggle-label">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => {
              setShowAll(e.target.checked);
              setSelectedTcId('');
            }}
            className="te-toggle-checkbox"
          />
          Show all test cases (including previously executed)
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="te-error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="te-loading">
          <div className="te-spinner" />
          Loading test cases...
        </div>
      )}

      {/* Test Case Selector */}
      {!loading && (
        <div className="te-selector-section">
          <h3 className="te-section-title">Select Test Case</h3>
          <select
            className="te-select-tc"
            value={selectedTcId}
            onChange={(e) => setSelectedTcId(e.target.value)}
          >
            <option value="">-- Choose a test case --</option>
            {testCases.map((tc) => (
              <option key={tc.id} value={tc.id}>
                {tc.test_case_id} - {tc.title} [{tc.module}] ({STATUS_LABELS[tc.status] || tc.status})
              </option>
            ))}
          </select>
          {!loading && testCases.length === 0 && (
            <p className="te-no-cases">No test cases available{showAll ? '' : ' with status "Not Run"'}.</p>
          )}
        </div>
      )}

      {/* Selected Test Case Details */}
      {selectedTc && (
        <div className="te-tc-details">
          <div className="te-tc-header">
            <div className="te-tc-header-left">
              <span className="te-tc-id">{selectedTc.test_case_id}</span>
              <span
                className="te-tc-status-badge"
                style={{ backgroundColor: STATUS_COLORS[selectedTc.status] || '#6b7280' }}
              >
                {STATUS_LABELS[selectedTc.status] || selectedTc.status}
              </span>
            </div>
            <span className="te-tc-module-tag">{selectedTc.module}</span>
          </div>
          <h3 className="te-tc-title">{selectedTc.title}</h3>

          {/* Preconditions */}
          <div className="te-detail-block">
            <h4 className="te-detail-label">Preconditions</h4>
            <p className="te-detail-value">{selectedTc.preconditions || 'None specified'}</p>
          </div>

          {/* Test Steps Checklist */}
          <div className="te-detail-block">
            <h4 className="te-detail-label">
              Test Steps
              {steps.length > 0 && (
                <span className="te-step-counter">
                  {Object.values(checkedSteps).filter(Boolean).length} / {steps.length} completed
                </span>
              )}
            </h4>
            <div className="te-steps-checklist">
              {steps.map((step, idx) => (
                <label key={idx} className={`te-step-item ${checkedSteps[idx] ? 'te-step-done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={!!checkedSteps[idx]}
                    onChange={() => handleStepToggle(idx)}
                    className="te-step-checkbox"
                  />
                  <span className="te-step-number">{idx + 1}.</span>
                  <span className="te-step-text">{step}</span>
                </label>
              ))}
            </div>
            {allStepsChecked && steps.length > 0 && (
              <div className="te-all-steps-done">All steps completed</div>
            )}
          </div>

          {/* Test Data */}
          <div className="te-detail-block">
            <h4 className="te-detail-label">Test Data</h4>
            {testData ? (
              typeof testData === 'string' ? (
                <p className="te-detail-value">{testData}</p>
              ) : (
                <pre className="te-json-block">{JSON.stringify(testData, null, 2)}</pre>
              )
            ) : (
              <p className="te-detail-value te-detail-muted">No test data</p>
            )}
          </div>

          {/* Expected Result */}
          <div className="te-detail-block">
            <h4 className="te-detail-label">Expected Result</h4>
            <p className="te-detail-value">{selectedTc.expected_result}</p>
          </div>

          {/* Execution Form */}
          <form className="te-exec-form" onSubmit={handleSubmit}>
            <h4 className="te-form-title">Record Execution Result</h4>

            <div className="te-form-grid">
              <div className="te-form-group te-form-full">
                <label className="te-form-label" htmlFor="te-actual-result">
                  Actual Result <span className="te-required">*</span>
                </label>
                <textarea
                  id="te-actual-result"
                  className="te-textarea"
                  rows={4}
                  value={actualResult}
                  onChange={(e) => setActualResult(e.target.value)}
                  placeholder="Describe the actual outcome observed during testing..."
                  required
                />
              </div>

              <div className="te-form-group">
                <label className="te-form-label" htmlFor="te-exec-status">
                  Status <span className="te-required">*</span>
                </label>
                <div className="te-status-options">
                  {STATUS_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`te-status-option ${execStatus === opt.value ? 'te-status-option-selected' : ''}`}
                      style={{
                        borderColor: execStatus === opt.value ? STATUS_COLORS[opt.value] : '#cbd5e1',
                        backgroundColor: execStatus === opt.value ? STATUS_COLORS[opt.value] + '15' : '#fff',
                      }}
                    >
                      <input
                        type="radio"
                        name="exec-status"
                        value={opt.value}
                        checked={execStatus === opt.value}
                        onChange={(e) => setExecStatus(e.target.value)}
                        className="te-status-radio"
                      />
                      <span
                        className="te-status-dot"
                        style={{ backgroundColor: STATUS_COLORS[opt.value] }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="te-form-group">
                <label className="te-form-label" htmlFor="te-exec-time">
                  Execution Time (ms)
                </label>
                <input
                  id="te-exec-time"
                  type="number"
                  className="te-input"
                  value={executionTime}
                  onChange={(e) => setExecutionTime(e.target.value)}
                  placeholder="e.g. 2500"
                  min="0"
                />
              </div>

              <div className="te-form-group te-form-full">
                <label className="te-form-label" htmlFor="te-notes">
                  Notes
                </label>
                <textarea
                  id="te-notes"
                  className="te-textarea"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes, observations, defect references..."
                />
              </div>
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div className={`te-submit-message te-submit-${submitMessage.type}`}>
                {submitMessage.text}
              </div>
            )}

            <div className="te-form-actions">
              <button
                type="submit"
                className="te-submit-btn"
                disabled={submitting || !actualResult.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit Execution Result'}
              </button>
              <button
                type="button"
                className="te-reset-btn"
                onClick={() => {
                  setActualResult('');
                  setExecStatus('pass');
                  setNotes('');
                  setExecutionTime('');
                  setCheckedSteps({});
                  setSubmitMessage(null);
                }}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Execution History */}
      {history.length > 0 && (
        <div className="te-history-section">
          <h3 className="te-section-title">Recently Executed ({history.length})</h3>
          <div className="te-history-list">
            {history.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="te-history-card">
                <div className="te-history-header">
                  <span className="te-history-id">{item.test_case_id}</span>
                  <span
                    className="te-history-status"
                    style={{ backgroundColor: STATUS_COLORS[item.status] || '#6b7280' }}
                  >
                    {STATUS_LABELS[item.status] || item.status}
                  </span>
                </div>
                <div className="te-history-title">{item.title}</div>
                <div className="te-history-meta">
                  <span>Module: {item.module}</span>
                  {item.execution_time_ms != null && <span>Time: {item.execution_time_ms}ms</span>}
                  {item.executed_at && <span>At: {item.executed_at}</span>}
                </div>
                {item.actual_result && (
                  <div className="te-history-result">
                    <strong>Result:</strong> {item.actual_result}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .te-page {
          padding: 0;
        }

        .te-page-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        /* Mode Toggle */
        .te-mode-toggle {
          margin-bottom: 1rem;
        }

        .te-toggle-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: #475569;
        }

        .te-toggle-checkbox {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #3b82f6;
        }

        /* Error / Loading */
        .te-error-message {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .te-loading {
          text-align: center;
          padding: 3rem 0;
          color: #64748b;
          font-size: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .te-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: te-spin 0.8s linear infinite;
        }

        @keyframes te-spin {
          to { transform: rotate(360deg); }
        }

        /* Selector */
        .te-selector-section {
          margin-bottom: 1.25rem;
        }

        .te-section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #334155;
          margin: 0 0 0.75rem 0;
        }

        .te-select-tc {
          width: 100%;
          max-width: 700px;
          padding: 0.6rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.9rem;
          background: #fff;
          color: #1e293b;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
        }

        .te-select-tc:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
        }

        .te-no-cases {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        /* TC Details */
        .te-tc-details {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .te-tc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .te-tc-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .te-tc-id {
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.95rem;
          font-weight: 700;
          color: #2563eb;
        }

        .te-tc-status-badge {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 12px;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .te-tc-module-tag {
          background: #eff6ff;
          color: #2563eb;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .te-tc-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1.25rem 0;
        }

        .te-detail-block {
          margin-bottom: 1.25rem;
        }

        .te-detail-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.35rem 0;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .te-detail-value {
          color: #475569;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }

        .te-detail-muted {
          color: #94a3b8;
          font-style: italic;
        }

        /* Steps Checklist */
        .te-step-counter {
          font-size: 0.75rem;
          font-weight: 500;
          color: #64748b;
          text-transform: none;
          letter-spacing: 0;
        }

        .te-steps-checklist {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .te-step-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s;
          font-size: 0.88rem;
          color: #334155;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
        }

        .te-step-item:hover {
          background: #eff6ff;
        }

        .te-step-done {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .te-step-done .te-step-text {
          text-decoration: line-through;
          color: #94a3b8;
        }

        .te-step-checkbox {
          margin-top: 2px;
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #22c55e;
          flex-shrink: 0;
        }

        .te-step-number {
          font-weight: 600;
          color: #64748b;
          min-width: 22px;
          flex-shrink: 0;
        }

        .te-step-text {
          flex: 1;
          line-height: 1.4;
        }

        .te-all-steps-done {
          margin-top: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #f0fdf4;
          color: #166534;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid #bbf7d0;
        }

        /* JSON Block */
        .te-json-block {
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

        /* Execution Form */
        .te-exec-form {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.25rem;
          margin-top: 1.5rem;
        }

        .te-form-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .te-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .te-form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .te-form-full {
          grid-column: 1 / -1;
        }

        .te-form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .te-required {
          color: #ef4444;
        }

        .te-textarea {
          padding: 0.6rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.9rem;
          font-family: inherit;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
          color: #1e293b;
          background: #fff;
        }

        .te-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
        }

        .te-input {
          padding: 0.6rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
          color: #1e293b;
          background: #fff;
        }

        .te-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
        }

        /* Status Options */
        .te-status-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .te-status-option {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.5rem 0.85rem;
          border: 2px solid #cbd5e1;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 500;
          color: #334155;
          transition: all 0.2s;
          user-select: none;
        }

        .te-status-option:hover {
          border-color: #94a3b8;
        }

        .te-status-option-selected {
          font-weight: 600;
        }

        .te-status-radio {
          display: none;
        }

        .te-status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Submit Message */
        .te-submit-message {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .te-submit-success {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .te-submit-error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        /* Form Actions */
        .te-form-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }

        .te-submit-btn {
          padding: 0.65rem 1.5rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .te-submit-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .te-submit-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }

        .te-reset-btn {
          padding: 0.65rem 1.25rem;
          background: #fff;
          color: #475569;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .te-reset-btn:hover {
          background: #f1f5f9;
        }

        /* Execution History */
        .te-history-section {
          margin-top: 2rem;
        }

        .te-history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .te-history-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem 1.25rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }

        .te-history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.35rem;
        }

        .te-history-id {
          font-family: 'Courier New', Courier, monospace;
          font-weight: 700;
          color: #2563eb;
          font-size: 0.9rem;
        }

        .te-history-status {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 12px;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .te-history-title {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.95rem;
          margin-bottom: 0.4rem;
        }

        .te-history-meta {
          display: flex;
          gap: 1.5rem;
          font-size: 0.8rem;
          color: #64748b;
          flex-wrap: wrap;
        }

        .te-history-result {
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: #475569;
          background: #f8fafc;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          border-left: 3px solid #3b82f6;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .te-form-grid {
            grid-template-columns: 1fr;
          }

          .te-status-options {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default TestExecution;

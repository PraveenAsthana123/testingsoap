import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001';

function Reports() {
  const [testCases, setTestCases] = useState([]);
  const [testRuns, setTestRuns] = useState([]);
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [tcRes, trRes, dRes] = await Promise.all([
          fetch(`${API_BASE}/api/test-cases`),
          fetch(`${API_BASE}/api/test-runs`),
          fetch(`${API_BASE}/api/defects`),
        ]);
        if (!tcRes.ok || !trRes.ok || !dRes.ok) {
          throw new Error('Failed to fetch report data');
        }
        const [tcData, trData, dData] = await Promise.all([
          tcRes.json(),
          trRes.json(),
          dRes.json(),
        ]);
        setTestCases(tcData);
        setTestRuns(trData);
        setDefects(dData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <span style={styles.errorIcon}>!</span>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.retryBtn} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  // --- Compute summary stats ---
  const total = testCases.length;
  const passed = testCases.filter(tc => tc.status === 'pass').length;
  const failed = testCases.filter(tc => tc.status === 'fail').length;
  const blocked = testCases.filter(tc => tc.status === 'blocked').length;
  const notRun = testCases.filter(tc => tc.status === 'not_run').length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
  const failRate = total > 0 ? ((failed / total) * 100).toFixed(1) : '0.0';

  // --- Module-wise breakdown ---
  const modules = [...new Set(testCases.map(tc => tc.module))].sort();
  const moduleData = modules.map(mod => {
    const cases = testCases.filter(tc => tc.module === mod);
    const mPassed = cases.filter(tc => tc.status === 'pass').length;
    const mFailed = cases.filter(tc => tc.status === 'fail').length;
    const mBlocked = cases.filter(tc => tc.status === 'blocked').length;
    const mNotRun = cases.filter(tc => tc.status === 'not_run').length;
    const mTotal = cases.length;
    const mPassRate = mTotal > 0 ? ((mPassed / mTotal) * 100).toFixed(1) : '0.0';
    return { module: mod, total: mTotal, passed: mPassed, failed: mFailed, blocked: mBlocked, notRun: mNotRun, passRate: mPassRate };
  });

  // --- Priority-wise breakdown ---
  const priorities = ['critical', 'high', 'medium', 'low'];
  const priorityData = priorities
    .map(pri => {
      const cases = testCases.filter(tc => tc.priority === pri);
      if (cases.length === 0) return null;
      const pPassed = cases.filter(tc => tc.status === 'pass').length;
      const pFailed = cases.filter(tc => tc.status === 'fail').length;
      const pBlocked = cases.filter(tc => tc.status === 'blocked').length;
      const pNotRun = cases.filter(tc => tc.status === 'not_run').length;
      return { priority: pri, total: cases.length, passed: pPassed, failed: pFailed, blocked: pBlocked, notRun: pNotRun };
    })
    .filter(Boolean);

  // --- Defect summary ---
  const totalDefects = defects.length;
  const defectsBySeverity = {};
  defects.forEach(d => {
    defectsBySeverity[d.severity] = (defectsBySeverity[d.severity] || 0) + 1;
  });
  const defectsByStatus = {};
  defects.forEach(d => {
    defectsByStatus[d.status] = (defectsByStatus[d.status] || 0) + 1;
  });

  // --- Progress bar percentages ---
  const passPercent = total > 0 ? (passed / total) * 100 : 0;
  const failPercent = total > 0 ? (failed / total) * 100 : 0;
  const blockedPercent = total > 0 ? (blocked / total) * 100 : 0;
  const notRunPercent = total > 0 ? (notRun / total) * 100 : 0;

  const priorityColors = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#d97706',
    low: '#65a30d',
  };

  const severityColors = {
    blocker: '#7f1d1d',
    critical: '#dc2626',
    major: '#ea580c',
    minor: '#eab308',
    trivial: '#9ca3af',
  };

  const statusColors = {
    open: '#dc2626',
    in_progress: '#2563eb',
    fixed: '#16a34a',
    verified: '#7c3aed',
    closed: '#6b7280',
    reopened: '#ea580c',
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Test Reports</h2>
        <button style={styles.exportBtn} onClick={() => alert('Export functionality coming soon')}>
          Export Report (PDF)
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.summaryCard, borderLeft: '4px solid #2563eb' }}>
          <div style={styles.cardLabel}>Total Test Cases</div>
          <div style={styles.cardValue}>{total}</div>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: '4px solid #16a34a' }}>
          <div style={styles.cardLabel}>Pass Rate</div>
          <div style={{ ...styles.cardValue, color: '#16a34a' }}>{passRate}%</div>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: '4px solid #dc2626' }}>
          <div style={styles.cardLabel}>Fail Rate</div>
          <div style={{ ...styles.cardValue, color: '#dc2626' }}>{failRate}%</div>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: '4px solid #7c3aed' }}>
          <div style={styles.cardLabel}>Modules Covered</div>
          <div style={styles.cardValue}>{modules.length}</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Overall Test Execution Progress</h3>
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            {passPercent > 0 && (
              <div
                style={{ ...styles.progressSegment, width: `${passPercent}%`, backgroundColor: '#16a34a' }}
                title={`Passed: ${passed} (${passPercent.toFixed(1)}%)`}
              />
            )}
            {failPercent > 0 && (
              <div
                style={{ ...styles.progressSegment, width: `${failPercent}%`, backgroundColor: '#dc2626' }}
                title={`Failed: ${failed} (${failPercent.toFixed(1)}%)`}
              />
            )}
            {blockedPercent > 0 && (
              <div
                style={{ ...styles.progressSegment, width: `${blockedPercent}%`, backgroundColor: '#ea580c' }}
                title={`Blocked: ${blocked} (${blockedPercent.toFixed(1)}%)`}
              />
            )}
            {notRunPercent > 0 && (
              <div
                style={{ ...styles.progressSegment, width: `${notRunPercent}%`, backgroundColor: '#9ca3af' }}
                title={`Not Run: ${notRun} (${notRunPercent.toFixed(1)}%)`}
              />
            )}
          </div>
          <div style={styles.progressLegend}>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: '#16a34a' }} /> Passed: {passed}
            </span>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: '#dc2626' }} /> Failed: {failed}
            </span>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: '#ea580c' }} /> Blocked: {blocked}
            </span>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendDot, backgroundColor: '#9ca3af' }} /> Not Run: {notRun}
            </span>
          </div>
        </div>
      </div>

      {/* Module-wise Breakdown */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Module-wise Breakdown</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Module</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Total</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Passed</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Failed</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Blocked</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Not Run</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Pass %</th>
                <th style={{ ...styles.th, minWidth: '200px' }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {moduleData.map((mod, idx) => {
                const mPassPct = mod.total > 0 ? (mod.passed / mod.total) * 100 : 0;
                const mFailPct = mod.total > 0 ? (mod.failed / mod.total) * 100 : 0;
                const mBlockPct = mod.total > 0 ? (mod.blocked / mod.total) * 100 : 0;
                const mNrPct = mod.total > 0 ? (mod.notRun / mod.total) * 100 : 0;
                return (
                  <tr key={mod.module} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.td}>
                      <strong>{mod.module}</strong>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>{mod.total}</td>
                    <td style={{ ...styles.td, textAlign: 'center', color: '#16a34a', fontWeight: 600 }}>{mod.passed}</td>
                    <td style={{ ...styles.td, textAlign: 'center', color: '#dc2626', fontWeight: 600 }}>{mod.failed}</td>
                    <td style={{ ...styles.td, textAlign: 'center', color: '#ea580c', fontWeight: 600 }}>{mod.blocked}</td>
                    <td style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>{mod.notRun}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span
                        style={{
                          ...styles.passRateBadge,
                          backgroundColor: parseFloat(mod.passRate) >= 80 ? '#dcfce7' : parseFloat(mod.passRate) >= 50 ? '#fef9c3' : '#fee2e2',
                          color: parseFloat(mod.passRate) >= 80 ? '#166534' : parseFloat(mod.passRate) >= 50 ? '#854d0e' : '#991b1b',
                        }}
                      >
                        {mod.passRate}%
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.miniProgressBar}>
                        {mPassPct > 0 && <div style={{ ...styles.miniSegment, width: `${mPassPct}%`, backgroundColor: '#16a34a' }} />}
                        {mFailPct > 0 && <div style={{ ...styles.miniSegment, width: `${mFailPct}%`, backgroundColor: '#dc2626' }} />}
                        {mBlockPct > 0 && <div style={{ ...styles.miniSegment, width: `${mBlockPct}%`, backgroundColor: '#ea580c' }} />}
                        {mNrPct > 0 && <div style={{ ...styles.miniSegment, width: `${mNrPct}%`, backgroundColor: '#d1d5db' }} />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Priority-wise Breakdown */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Priority-wise Breakdown</h3>
        <div style={styles.priorityGrid}>
          {priorityData.map(pri => {
            const priPassPct = pri.total > 0 ? (pri.passed / pri.total) * 100 : 0;
            const priFailPct = pri.total > 0 ? (pri.failed / pri.total) * 100 : 0;
            return (
              <div key={pri.priority} style={{ ...styles.priorityCard, borderTop: `4px solid ${priorityColors[pri.priority] || '#6b7280'}` }}>
                <div style={styles.priorityHeader}>
                  <span style={{ ...styles.priorityBadge, backgroundColor: priorityColors[pri.priority] || '#6b7280' }}>
                    {pri.priority.toUpperCase()}
                  </span>
                  <span style={styles.priorityTotal}>{pri.total} cases</span>
                </div>
                <div style={styles.priorityStats}>
                  <div style={styles.priorityStat}>
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '20px' }}>{pri.passed}</span>
                    <span style={styles.priorityStatLabel}>Passed</span>
                  </div>
                  <div style={styles.priorityStat}>
                    <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '20px' }}>{pri.failed}</span>
                    <span style={styles.priorityStatLabel}>Failed</span>
                  </div>
                  <div style={styles.priorityStat}>
                    <span style={{ color: '#ea580c', fontWeight: 700, fontSize: '20px' }}>{pri.blocked}</span>
                    <span style={styles.priorityStatLabel}>Blocked</span>
                  </div>
                  <div style={styles.priorityStat}>
                    <span style={{ color: '#6b7280', fontWeight: 700, fontSize: '20px' }}>{pri.notRun}</span>
                    <span style={styles.priorityStatLabel}>Not Run</span>
                  </div>
                </div>
                <div style={styles.miniProgressBar}>
                  {priPassPct > 0 && <div style={{ ...styles.miniSegment, width: `${priPassPct}%`, backgroundColor: '#16a34a' }} />}
                  {priFailPct > 0 && <div style={{ ...styles.miniSegment, width: `${priFailPct}%`, backgroundColor: '#dc2626' }} />}
                  {pri.blocked > 0 && (
                    <div style={{ ...styles.miniSegment, width: `${(pri.blocked / pri.total) * 100}%`, backgroundColor: '#ea580c' }} />
                  )}
                  {pri.notRun > 0 && (
                    <div style={{ ...styles.miniSegment, width: `${(pri.notRun / pri.total) * 100}%`, backgroundColor: '#d1d5db' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Run History */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Test Run History</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Run Name</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Date</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Environment</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Total</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Passed</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Failed</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Blocked</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Skipped</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {testRuns.map((run, idx) => (
                <tr key={run.id} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>
                    <strong>{run.run_name}</strong>
                    {run.notes && <div style={styles.runNotes}>{run.notes}</div>}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {new Date(run.run_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <span style={styles.envBadge}>{run.environment}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: 600 }}>{run.total_cases}</td>
                  <td style={{ ...styles.td, textAlign: 'center', color: '#16a34a', fontWeight: 600 }}>{run.passed}</td>
                  <td style={{ ...styles.td, textAlign: 'center', color: '#dc2626', fontWeight: 600 }}>{run.failed}</td>
                  <td style={{ ...styles.td, textAlign: 'center', color: '#ea580c', fontWeight: 600 }}>{run.blocked}</td>
                  <td style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>{run.skipped}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <span
                      style={{
                        ...styles.runStatusBadge,
                        backgroundColor: run.status === 'completed' ? '#dcfce7' : run.status === 'in_progress' ? '#dbeafe' : '#f3f4f6',
                        color: run.status === 'completed' ? '#166534' : run.status === 'in_progress' ? '#1e40af' : '#374151',
                      }}
                    >
                      {run.status === 'in_progress' ? 'In Progress' : run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Defect Summary */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Defect Summary</h3>
        <div style={styles.defectSummaryGrid}>
          {/* Total Defects Card */}
          <div style={{ ...styles.defectCard, borderLeft: '4px solid #7c3aed' }}>
            <div style={styles.cardLabel}>Total Defects</div>
            <div style={{ ...styles.cardValue, color: '#7c3aed' }}>{totalDefects}</div>
          </div>

          {/* By Severity */}
          <div style={{ ...styles.defectCard, borderLeft: '4px solid #ea580c' }}>
            <div style={styles.cardLabel}>By Severity</div>
            <div style={styles.defectBreakdown}>
              {Object.entries(defectsBySeverity)
                .sort((a, b) => {
                  const order = { blocker: 0, critical: 1, major: 2, minor: 3, trivial: 4 };
                  return (order[a[0]] ?? 5) - (order[b[0]] ?? 5);
                })
                .map(([sev, count]) => (
                  <div key={sev} style={styles.defectBreakdownRow}>
                    <span style={{ ...styles.severityDot, backgroundColor: severityColors[sev] || '#6b7280' }} />
                    <span style={styles.defectBreakdownLabel}>{sev.charAt(0).toUpperCase() + sev.slice(1)}</span>
                    <span style={styles.defectBreakdownCount}>{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* By Status */}
          <div style={{ ...styles.defectCard, borderLeft: '4px solid #2563eb' }}>
            <div style={styles.cardLabel}>By Status</div>
            <div style={styles.defectBreakdown}>
              {Object.entries(defectsByStatus).map(([stat, count]) => (
                <div key={stat} style={styles.defectBreakdownRow}>
                  <span style={{ ...styles.severityDot, backgroundColor: statusColors[stat] || '#6b7280' }} />
                  <span style={styles.defectBreakdownLabel}>
                    {stat === 'in_progress' ? 'In Progress' : stat.charAt(0).toUpperCase() + stat.slice(1)}
                  </span>
                  <span style={styles.defectBreakdownCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Defect Severity Distribution Bar */}
        {totalDefects > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={styles.defectDistLabel}>Severity Distribution</div>
            <div style={styles.progressBar}>
              {['blocker', 'critical', 'major', 'minor', 'trivial'].map(sev => {
                const count = defectsBySeverity[sev] || 0;
                if (count === 0) return null;
                const pct = (count / totalDefects) * 100;
                return (
                  <div
                    key={sev}
                    style={{ ...styles.progressSegment, width: `${pct}%`, backgroundColor: severityColors[sev] }}
                    title={`${sev}: ${count} (${pct.toFixed(1)}%)`}
                  />
                );
              })}
            </div>
            <div style={styles.progressLegend}>
              {['blocker', 'critical', 'major', 'minor', 'trivial']
                .filter(sev => defectsBySeverity[sev])
                .map(sev => (
                  <span key={sev} style={styles.legendItem}>
                    <span style={{ ...styles.legendDot, backgroundColor: severityColors[sev] }} />
                    {sev.charAt(0).toUpperCase() + sev.slice(1)}: {defectsBySeverity[sev]}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  // Loading & Error
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '14px',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '12px',
  },
  errorIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc2626',
    fontSize: '16px',
  },
  retryBtn: {
    padding: '8px 20px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },

  // Page Header
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  exportBtn: {
    padding: '10px 20px',
    backgroundColor: '#1e40af',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'background-color 0.2s',
  },

  // Summary Cards
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: 500,
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#111827',
  },

  // Sections
  section: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#111827',
    margin: '0 0 16px 0',
    paddingBottom: '12px',
    borderBottom: '2px solid #e5e7eb',
  },

  // Progress Bar
  progressContainer: {
    marginBottom: '8px',
  },
  progressBar: {
    display: 'flex',
    height: '28px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  progressSegment: {
    height: '100%',
    transition: 'width 0.5s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    color: '#fff',
    fontWeight: 600,
  },
  progressLegend: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#374151',
  },
  legendDot: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },

  // Table
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    padding: '12px 14px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#374151',
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 14px',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle',
  },
  trEven: {
    backgroundColor: '#fff',
  },
  trOdd: {
    backgroundColor: '#f9fafb',
  },

  // Module progress
  miniProgressBar: {
    display: 'flex',
    height: '10px',
    borderRadius: '5px',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    marginTop: '4px',
  },
  miniSegment: {
    height: '100%',
    transition: 'width 0.4s ease',
  },
  passRateBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 600,
  },

  // Priority Cards
  priorityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  priorityCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '18px',
  },
  priorityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  priorityBadge: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  priorityTotal: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: 500,
  },
  priorityStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '12px',
  },
  priorityStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  priorityStatLabel: {
    fontSize: '11px',
    color: '#6b7280',
    fontWeight: 500,
  },

  // Test Run History
  runNotes: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
    fontStyle: 'italic',
  },
  envBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '12px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    fontSize: '12px',
    fontWeight: 500,
  },
  runStatusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
  },

  // Defect Summary
  defectSummaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  defectCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '18px',
  },
  defectBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  defectBreakdownRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  severityDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  defectBreakdownLabel: {
    fontSize: '13px',
    color: '#374151',
    flex: 1,
  },
  defectBreakdownCount: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#111827',
  },
  defectDistLabel: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '6px',
    fontWeight: 500,
  },
};

// Inject CSS keyframes for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.querySelector('[data-reports-styles]')) {
  styleSheet.setAttribute('data-reports-styles', 'true');
  document.head.appendChild(styleSheet);
}

export default Reports;

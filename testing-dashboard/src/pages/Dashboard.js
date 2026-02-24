import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001/api';

/**
 * Format a number as Indian currency (INR with lakh/crore grouping).
 * Example: 1234567.89 => "12,34,567.89"
 */
function formatIndianCurrency(amount) {
  if (amount === null || amount === undefined) return '0.00';
  const num = Number(amount);
  if (isNaN(num)) return '0.00';

  const [intPart, decPart] = Math.abs(num).toFixed(2).split('.');
  const sign = num < 0 ? '-' : '';

  // Indian grouping: last 3 digits, then groups of 2
  let formatted = '';
  if (intPart.length <= 3) {
    formatted = intPart;
  } else {
    const last3 = intPart.slice(-3);
    const remaining = intPart.slice(0, -3);
    const groups = [];
    let i = remaining.length;
    while (i > 0) {
      const start = Math.max(0, i - 2);
      groups.unshift(remaining.slice(start, i));
      i = start;
    }
    formatted = groups.join(',') + ',' + last3;
  }

  return sign + formatted + '.' + decPart;
}

/**
 * Format large numbers with commas for display.
 */
function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-IN');
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      setLoading(true);
      setError(null);

      try {
        const [statsRes, testsRes] = await Promise.all([
          fetch(`${API_BASE}/dashboard/stats`, { signal: AbortSignal.timeout(10000) }),
          fetch(`${API_BASE}/test-cases?limit=10`, { signal: AbortSignal.timeout(10000) }),
        ]);

        if (!statsRes.ok) {
          throw new Error(`Stats API returned ${statsRes.status}`);
        }

        const statsData = await statsRes.json();
        const testsData = testsRes.ok ? await testsRes.json() : [];

        if (isMounted) {
          setStats(statsData);
          // Show most recently executed tests (those with an executed_at timestamp)
          const executed = (Array.isArray(testsData) ? testsData : [])
            .filter(t => t.executed_at)
            .sort((a, b) => new Date(b.executed_at) - new Date(a.executed_at))
            .slice(0, 8);
          setRecentTests(executed);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch dashboard data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <span className="error-state-icon">!</span>
        <div>
          <strong>Failed to load dashboard</strong>
          <p className="mt-1 text-sm">{error}</p>
          <button className="btn btn-outline btn-sm mt-2" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Compute test totals
  const totalTests = stats.totalTestCases || 0;
  const passed = stats.passedTests || 0;
  const failed = stats.failedTests || 0;
  const blocked = stats.blockedTests || 0;
  const notRun = stats.notRunTests || 0;
  const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : '0.0';

  // Stat cards configuration - Row 1: Business Data
  const businessCards = [
    {
      label: 'Customers',
      value: formatNumber(stats.customers),
      color: 'blue',
      icon: '\uD83D\uDC64',
    },
    {
      label: 'Accounts',
      value: formatNumber(stats.accounts),
      color: 'purple',
      icon: '\uD83C\uDFE6',
    },
    {
      label: 'Transactions',
      value: formatNumber(stats.transactions),
      color: 'blue',
      icon: '\uD83D\uDCB3',
    },
    {
      label: 'Total Balance',
      value: '\u20B9 ' + formatIndianCurrency(stats.totalBalance),
      color: 'green',
      icon: '\uD83D\uDCB0',
    },
  ];

  // Stat cards configuration - Row 2: Testing Metrics
  const testingCards = [
    {
      label: 'Total Tests',
      value: formatNumber(totalTests),
      color: 'blue',
      icon: '\uD83D\uDCCB',
    },
    {
      label: 'Passed',
      value: formatNumber(passed),
      color: 'green',
      subtext: `${passRate}% pass rate`,
      icon: '\u2705',
    },
    {
      label: 'Failed',
      value: formatNumber(failed),
      color: 'red',
      icon: '\u274C',
    },
    {
      label: 'Blocked',
      value: formatNumber(blocked),
      color: 'orange',
      icon: '\u26A0\uFE0F',
    },
    {
      label: 'Not Run',
      value: formatNumber(notRun),
      color: 'gray',
      icon: '\u23F8\uFE0F',
    },
    {
      label: 'Open Defects',
      value: formatNumber(stats.openDefects),
      color: 'red',
      icon: '\uD83D\uDC1B',
    },
  ];

  // Bar chart data
  const maxBarValue = Math.max(passed, failed, blocked, notRun, 1);
  const barData = [
    { label: 'Passed', count: passed, cssClass: 'pass', color: 'var(--pass-color)' },
    { label: 'Failed', count: failed, cssClass: 'fail', color: 'var(--fail-color)' },
    { label: 'Blocked', count: blocked, cssClass: 'blocked', color: 'var(--blocked-color)' },
    { label: 'Not Run', count: notRun, cssClass: 'not_run', color: 'var(--not-run-color)' },
  ];

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="page-subtitle">Banking QA Testing Overview</p>
      </div>

      {/* Row 1: Business Data Stats */}
      <div className="dashboard-section">
        <div className="dashboard-section-title">
          <span className="section-icon">{'\uD83C\uDFE6'}</span>
          Business Data Summary
        </div>
        <div className="stats-grid">
          {businessCards.map((card) => (
            <div key={card.label} className={`stat-card ${card.color}`}>
              <div className="stat-label">{card.icon} {card.label}</div>
              <div className="stat-value">{card.value}</div>
              {card.subtext && <div className="stat-subtext">{card.subtext}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Testing Metrics Stats */}
      <div className="dashboard-section">
        <div className="dashboard-section-title">
          <span className="section-icon">{'\uD83E\uDDEA'}</span>
          Testing Metrics
        </div>
        <div className="stats-grid">
          {testingCards.map((card) => (
            <div key={card.label} className={`stat-card ${card.color}`}>
              <div className="stat-label">{card.icon} {card.label}</div>
              <div className="stat-value">{card.value}</div>
              {card.subtext && <div className="stat-subtext">{card.subtext}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Charts + Recent Results side by side */}
      <div className="grid-2">
        {/* Test Status Distribution (CSS Bar Chart) */}
        <div className="card dashboard-section">
          <div className="card-header">
            <h3>Test Status Distribution</h3>
            <span className="badge info">{totalTests} total</span>
          </div>
          <div className="card-body">
            {/* Stacked progress bar summary */}
            <div className="progress-stacked mb-4">
              {totalTests > 0 && (
                <>
                  {passed > 0 && (
                    <div
                      className="progress-segment"
                      style={{
                        width: `${(passed / totalTests) * 100}%`,
                        background: 'var(--pass-color)',
                      }}
                      title={`Passed: ${passed}`}
                    />
                  )}
                  {failed > 0 && (
                    <div
                      className="progress-segment"
                      style={{
                        width: `${(failed / totalTests) * 100}%`,
                        background: 'var(--fail-color)',
                      }}
                      title={`Failed: ${failed}`}
                    />
                  )}
                  {blocked > 0 && (
                    <div
                      className="progress-segment"
                      style={{
                        width: `${(blocked / totalTests) * 100}%`,
                        background: 'var(--blocked-color)',
                      }}
                      title={`Blocked: ${blocked}`}
                    />
                  )}
                  {notRun > 0 && (
                    <div
                      className="progress-segment"
                      style={{
                        width: `${(notRun / totalTests) * 100}%`,
                        background: 'var(--not-run-color)',
                      }}
                      title={`Not Run: ${notRun}`}
                    />
                  )}
                </>
              )}
            </div>

            {/* Individual bars */}
            <div className="test-status-bars">
              {barData.map((bar) => (
                <div key={bar.label} className="status-bar-row">
                  <span className="status-bar-label">{bar.label}</span>
                  <div className="status-bar-track">
                    <div
                      className={`status-bar-fill ${bar.cssClass}`}
                      style={{ width: `${maxBarValue > 0 ? (bar.count / maxBarValue) * 100 : 0}%` }}
                    >
                      {bar.count > 0 && totalTests > 0 && (
                        <span>{((bar.count / totalTests) * 100).toFixed(0)}%</span>
                      )}
                    </div>
                  </div>
                  <span className="status-bar-count">{bar.count}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="chart-legend mt-3">
              <div className="legend-item">
                <span className="legend-dot pass"></span>
                <span>Passed ({passed})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot fail"></span>
                <span>Failed ({failed})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot blocked"></span>
                <span>Blocked ({blocked})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot not_run"></span>
                <span>Not Run ({notRun})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Test Executions */}
        <div className="card dashboard-section">
          <div className="card-header">
            <h3>Recent Test Executions</h3>
            <span className="text-sm text-muted">Last {recentTests.length} runs</span>
          </div>
          <div className="card-body p-0">
            {recentTests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">{'\uD83E\uDDEA'}</div>
                <div className="empty-state-text">No test executions yet</div>
                <div className="empty-state-subtext">
                  Execute test cases from the Manual Testing page
                </div>
              </div>
            ) : (
              <div className="recent-executions">
                {recentTests.map((test) => (
                  <div key={test.id} className="execution-item">
                    <span className="execution-id">
                      {test.test_case_id || `TC-${test.id}`}
                    </span>
                    <span className="execution-title" title={test.title}>
                      {test.title}
                    </span>
                    <span className={`badge ${test.status}`}>
                      {test.status ? test.status.replace('_', ' ') : 'unknown'}
                    </span>
                    <span className="execution-time">
                      {test.executed_at
                        ? new Date(test.executed_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Pass Rate Progress */}
      <div className="dashboard-section mt-4">
        <div className="card">
          <div className="card-header">
            <h3>Overall Pass Rate</h3>
            <span className="font-bold" style={{ color: Number(passRate) >= 80 ? 'var(--pass-color)' : Number(passRate) >= 50 ? 'var(--blocked-color)' : 'var(--fail-color)' }}>
              {passRate}%
            </span>
          </div>
          <div className="card-body">
            <div className="progress-labeled">
              <div className="progress-info">
                <span className="progress-label">
                  {passed} of {totalTests} test cases passed
                </span>
                <span className="progress-percent">{passRate}%</span>
              </div>
              <div className="progress-bar-container" style={{ height: '12px' }}>
                <div
                  className={`progress-bar ${Number(passRate) >= 80 ? 'green' : Number(passRate) >= 50 ? 'orange' : 'red'}`}
                  style={{ width: `${passRate}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-muted mt-2">
              Target: 80% pass rate | Open defects: {formatNumber(stats.openDefects)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

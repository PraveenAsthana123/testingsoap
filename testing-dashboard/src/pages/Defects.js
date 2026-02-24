import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001';

function Defects() {
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchDefects = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/defects`);
        if (!res.ok) {
          throw new Error('Failed to fetch defects');
        }
        const data = await res.json();
        setDefects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDefects();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading defects...</p>
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

  // --- Summary counts ---
  const totalDefects = defects.length;
  const openCount = defects.filter(d => d.status === 'open').length;
  const inProgressCount = defects.filter(d => d.status === 'in_progress').length;
  const fixedCount = defects.filter(d => d.status === 'fixed').length;
  const verifiedCount = defects.filter(d => d.status === 'verified').length;
  const closedCount = defects.filter(d => d.status === 'closed').length;

  // --- Severity distribution ---
  const severityOrder = ['blocker', 'critical', 'major', 'minor', 'trivial'];
  const severityCounts = {};
  defects.forEach(d => {
    severityCounts[d.severity] = (severityCounts[d.severity] || 0) + 1;
  });

  // --- Filtering ---
  const filteredDefects = defects.filter(d => {
    if (filterSeverity !== 'all' && d.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    return true;
  });

  // --- Distinct values for filter dropdowns ---
  const distinctSeverities = [...new Set(defects.map(d => d.severity))];
  const distinctStatuses = [...new Set(defects.map(d => d.status))];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const severityBadgeStyle = (severity) => {
    const colorMap = {
      blocker: { bg: '#7f1d1d', text: '#fff' },
      critical: { bg: '#dc2626', text: '#fff' },
      major: { bg: '#ea580c', text: '#fff' },
      minor: { bg: '#eab308', text: '#1c1917' },
      trivial: { bg: '#9ca3af', text: '#fff' },
    };
    const colors = colorMap[severity] || { bg: '#6b7280', text: '#fff' };
    return {
      ...styles.badge,
      backgroundColor: colors.bg,
      color: colors.text,
    };
  };

  const statusBadgeStyle = (status) => {
    const colorMap = {
      open: { bg: '#fee2e2', text: '#991b1b' },
      in_progress: { bg: '#dbeafe', text: '#1e40af' },
      fixed: { bg: '#dcfce7', text: '#166534' },
      verified: { bg: '#ede9fe', text: '#5b21b6' },
      closed: { bg: '#f3f4f6', text: '#374151' },
      reopened: { bg: '#fff7ed', text: '#9a3412' },
    };
    const colors = colorMap[status] || { bg: '#f3f4f6', text: '#374151' };
    return {
      ...styles.badge,
      backgroundColor: colors.bg,
      color: colors.text,
    };
  };

  const formatStatus = (status) => {
    if (status === 'in_progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const summaryCards = [
    { label: 'Total', value: totalDefects, color: '#7c3aed', bgColor: '#ede9fe' },
    { label: 'Open', value: openCount, color: '#dc2626', bgColor: '#fee2e2' },
    { label: 'In Progress', value: inProgressCount, color: '#2563eb', bgColor: '#dbeafe' },
    { label: 'Fixed', value: fixedCount, color: '#16a34a', bgColor: '#dcfce7' },
    { label: 'Verified', value: verifiedCount, color: '#7c3aed', bgColor: '#f3e8ff' },
    { label: 'Closed', value: closedCount, color: '#6b7280', bgColor: '#f3f4f6' },
  ];

  const severityColors = {
    blocker: '#7f1d1d',
    critical: '#dc2626',
    major: '#ea580c',
    minor: '#eab308',
    trivial: '#9ca3af',
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Defects / Bug Tracker</h2>
        <span style={styles.totalBadge}>{totalDefects} total defects</span>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {summaryCards.map(card => (
          <div
            key={card.label}
            style={{
              ...styles.summaryCard,
              borderLeft: `4px solid ${card.color}`,
              cursor: card.label !== 'Total' ? 'pointer' : 'default',
            }}
            onClick={() => {
              if (card.label === 'Total') {
                setFilterStatus('all');
              } else if (card.label === 'In Progress') {
                setFilterStatus(filterStatus === 'in_progress' ? 'all' : 'in_progress');
              } else {
                const statusKey = card.label.toLowerCase();
                setFilterStatus(filterStatus === statusKey ? 'all' : statusKey);
              }
            }}
          >
            <div style={styles.cardLabel}>{card.label}</div>
            <div style={{ ...styles.cardValue, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Severity Distribution Bar */}
      {totalDefects > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Severity Distribution</h3>
          <div style={styles.distributionBar}>
            {severityOrder.map(sev => {
              const count = severityCounts[sev] || 0;
              if (count === 0) return null;
              const pct = (count / totalDefects) * 100;
              return (
                <div
                  key={sev}
                  style={{
                    ...styles.distributionSegment,
                    width: `${pct}%`,
                    backgroundColor: severityColors[sev],
                  }}
                  title={`${sev.charAt(0).toUpperCase() + sev.slice(1)}: ${count} (${pct.toFixed(1)}%)`}
                >
                  {pct >= 10 && (
                    <span style={styles.segmentLabel}>
                      {sev.charAt(0).toUpperCase() + sev.slice(1)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={styles.distributionLegend}>
            {severityOrder
              .filter(sev => severityCounts[sev])
              .map(sev => (
                <span key={sev} style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, backgroundColor: severityColors[sev] }} />
                  {sev.charAt(0).toUpperCase() + sev.slice(1)}: {severityCounts[sev]}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filterRow}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Severity:</label>
          <select
            style={styles.filterSelect}
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="all">All Severities</option>
            {distinctSeverities.map(sev => (
              <option key={sev} value={sev}>
                {sev.charAt(0).toUpperCase() + sev.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Status:</label>
          <select
            style={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {distinctStatuses.map(stat => (
              <option key={stat} value={stat}>{formatStatus(stat)}</option>
            ))}
          </select>
        </div>
        <div style={styles.filterCount}>
          Showing {filteredDefects.length} of {totalDefects} defects
        </div>
      </div>

      {/* Defects Table */}
      <div style={styles.section}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: '100px' }}>Defect ID</th>
                <th style={styles.th}>Title</th>
                <th style={{ ...styles.th, width: '110px' }}>Linked TC</th>
                <th style={{ ...styles.th, width: '100px', textAlign: 'center' }}>Severity</th>
                <th style={{ ...styles.th, width: '110px', textAlign: 'center' }}>Status</th>
                <th style={{ ...styles.th, width: '110px' }}>Assigned To</th>
                <th style={{ ...styles.th, width: '110px' }}>Reported By</th>
                <th style={{ ...styles.th, width: '110px' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredDefects.length === 0 && (
                <tr>
                  <td colSpan="8" style={styles.emptyRow}>
                    No defects match the current filters.
                  </td>
                </tr>
              )}
              {filteredDefects.map((defect, idx) => {
                const isExpanded = expandedId === defect.id;
                return (
                  <React.Fragment key={defect.id}>
                    <tr
                      style={{
                        ...(idx % 2 === 0 ? styles.trEven : styles.trOdd),
                        cursor: 'pointer',
                        transition: 'background-color 0.15s',
                      }}
                      onClick={() => toggleExpand(defect.id)}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eef2ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#fff' : '#f9fafb'; }}
                    >
                      <td style={styles.td}>
                        <span style={styles.defectIdCell}>
                          <span style={{ ...styles.expandArrow, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                            &#9654;
                          </span>
                          <strong style={{ color: '#1e40af' }}>{defect.defect_id}</strong>
                        </span>
                      </td>
                      <td style={styles.td}>{defect.title}</td>
                      <td style={styles.td}>
                        {defect.tc_code ? (
                          <span style={styles.tcLink}>{defect.tc_code}</span>
                        ) : (
                          <span style={styles.noLink}>-</span>
                        )}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={severityBadgeStyle(defect.severity)}>
                          {defect.severity.charAt(0).toUpperCase() + defect.severity.slice(1)}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={statusBadgeStyle(defect.status)}>
                          {formatStatus(defect.status)}
                        </span>
                      </td>
                      <td style={styles.td}>{defect.assigned_to || '-'}</td>
                      <td style={styles.td}>{defect.reported_by}</td>
                      <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>{formatDate(defect.created_at)}</td>
                    </tr>
                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr style={{ backgroundColor: '#f0f4ff' }}>
                        <td colSpan="8" style={styles.expandedCell}>
                          <div style={styles.expandedContent}>
                            <div style={styles.expandedSection}>
                              <h4 style={styles.expandedLabel}>Description</h4>
                              <p style={styles.expandedText}>{defect.description}</p>
                            </div>
                            {defect.tc_code && (
                              <div style={styles.expandedSection}>
                                <h4 style={styles.expandedLabel}>Linked Test Case</h4>
                                <div style={styles.linkedTcCard}>
                                  <div style={styles.linkedTcRow}>
                                    <span style={styles.linkedTcKey}>Test Case ID:</span>
                                    <span style={styles.linkedTcValue}>{defect.tc_code}</span>
                                  </div>
                                  <div style={styles.linkedTcRow}>
                                    <span style={styles.linkedTcKey}>Title:</span>
                                    <span style={styles.linkedTcValue}>{defect.tc_title || '-'}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div style={styles.expandedMeta}>
                              <div style={styles.metaItem}>
                                <span style={styles.metaLabel}>Severity:</span>
                                <span style={severityBadgeStyle(defect.severity)}>
                                  {defect.severity.charAt(0).toUpperCase() + defect.severity.slice(1)}
                                </span>
                              </div>
                              <div style={styles.metaItem}>
                                <span style={styles.metaLabel}>Status:</span>
                                <span style={statusBadgeStyle(defect.status)}>
                                  {formatStatus(defect.status)}
                                </span>
                              </div>
                              <div style={styles.metaItem}>
                                <span style={styles.metaLabel}>Assigned To:</span>
                                <span>{defect.assigned_to || 'Unassigned'}</span>
                              </div>
                              <div style={styles.metaItem}>
                                <span style={styles.metaLabel}>Reported By:</span>
                                <span>{defect.reported_by}</span>
                              </div>
                              <div style={styles.metaItem}>
                                <span style={styles.metaLabel}>Created:</span>
                                <span>{formatDate(defect.created_at)}</span>
                              </div>
                              <div style={styles.metaItem}>
                                <span style={styles.metaLabel}>Updated:</span>
                                <span>{formatDate(defect.updated_at)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
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
  totalBadge: {
    padding: '6px 16px',
    borderRadius: '20px',
    backgroundColor: '#ede9fe',
    color: '#5b21b6',
    fontSize: '14px',
    fontWeight: 600,
  },

  // Summary Cards
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '14px',
    marginBottom: '24px',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '18px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  cardLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: 500,
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 700,
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
    fontSize: '16px',
    fontWeight: 600,
    color: '#111827',
    margin: '0 0 14px 0',
    paddingBottom: '10px',
    borderBottom: '2px solid #e5e7eb',
  },

  // Distribution Bar
  distributionBar: {
    display: 'flex',
    height: '32px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  distributionSegment: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.5s ease',
    position: 'relative',
  },
  segmentLabel: {
    fontSize: '11px',
    color: '#fff',
    fontWeight: 600,
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  },
  distributionLegend: {
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

  // Filters
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
  },
  filterSelect: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '13px',
    color: '#374151',
    backgroundColor: '#fff',
    cursor: 'pointer',
    outline: 'none',
  },
  filterCount: {
    fontSize: '13px',
    color: '#6b7280',
    marginLeft: 'auto',
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
  emptyRow: {
    padding: '40px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
    fontStyle: 'italic',
  },

  // Badges
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },

  // Defect ID cell
  defectIdCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  expandArrow: {
    fontSize: '10px',
    color: '#6b7280',
    transition: 'transform 0.2s',
    display: 'inline-block',
  },
  tcLink: {
    color: '#2563eb',
    fontWeight: 500,
    fontSize: '13px',
  },
  noLink: {
    color: '#9ca3af',
  },

  // Expanded Row
  expandedCell: {
    padding: '0',
    borderBottom: '2px solid #c7d2fe',
  },
  expandedContent: {
    padding: '20px 24px',
  },
  expandedSection: {
    marginBottom: '16px',
  },
  expandedLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    margin: '0 0 6px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  expandedText: {
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.6',
    margin: 0,
    padding: '10px 14px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  linkedTcCard: {
    backgroundColor: '#fff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    padding: '12px 14px',
  },
  linkedTcRow: {
    display: 'flex',
    gap: '10px',
    padding: '4px 0',
  },
  linkedTcKey: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#6b7280',
    minWidth: '100px',
  },
  linkedTcValue: {
    fontSize: '13px',
    color: '#111827',
  },
  expandedMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '12px 14px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
  },
  metaLabel: {
    fontWeight: 600,
    color: '#6b7280',
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
if (!document.querySelector('[data-defects-styles]')) {
  styleSheet.setAttribute('data-defects-styles', 'true');
  document.head.appendChild(styleSheet);
}

export default Defects;

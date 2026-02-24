import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3001';

function OperationFlow() {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTestCase, setFilterTestCase] = useState('all');
  const [testCases, setTestCases] = useState([]);
  const [expandedOps, setExpandedOps] = useState({});
  const [expandedSection, setExpandedSection] = useState({});

  const fetchOperations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/operation-flow`);
      if (!response.ok) {
        throw new Error(`Failed to fetch operations: ${response.status}`);
      }
      const data = await response.json();
      const ops = data.operations || data.flows || data || [];
      setOperations(Array.isArray(ops) ? ops : []);

      const uniqueTestCases = [
        ...new Set(
          (Array.isArray(ops) ? ops : [])
            .map((op) => op.test_case || op.testCase || op.test_case_name || '')
            .filter(Boolean)
        ),
      ];
      setTestCases(uniqueTestCases);
    } catch (err) {
      setError(err.message);
      setOperations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  const toggleExpand = (index) => {
    setExpandedOps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSection = (index, section) => {
    const key = `${index}-${section}`;
    setExpandedSection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredOps = operations.filter((op) => {
    if (filterTestCase === 'all') return true;
    return (op.test_case || op.testCase || op.test_case_name || '') === filterTestCase;
  });

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'success' || s === 'passed' || s === 'pass') {
      return { label: 'SUCCESS', style: styles.badgeSuccess };
    }
    if (s === 'failure' || s === 'failed' || s === 'fail') {
      return { label: 'FAILURE', style: styles.badgeFailure };
    }
    if (s === 'error') {
      return { label: 'ERROR', style: styles.badgeError };
    }
    if (s === 'pending' || s === 'running') {
      return { label: s.toUpperCase(), style: styles.badgePending };
    }
    return { label: (status || 'UNKNOWN').toUpperCase(), style: styles.badgeUnknown };
  };

  const getMethodBadge = (method) => {
    const m = (method || '').toUpperCase();
    const colorMap = {
      GET: { backgroundColor: '#238636', color: '#ffffff' },
      POST: { backgroundColor: '#1f6feb', color: '#ffffff' },
      PUT: { backgroundColor: '#d29922', color: '#0d1117' },
      PATCH: { backgroundColor: '#a371f7', color: '#ffffff' },
      DELETE: { backgroundColor: '#f85149', color: '#ffffff' },
    };
    return colorMap[m] || { backgroundColor: '#484f58', color: '#ffffff' };
  };

  const getResponseCodeStyle = (code) => {
    const c = parseInt(code, 10);
    if (c >= 200 && c < 300) return styles.codeGreen;
    if (c >= 300 && c < 400) return styles.codeBlue;
    if (c >= 400 && c < 500) return styles.codeOrange;
    if (c >= 500) return styles.codeRed;
    return styles.codeDefault;
  };

  const formatJson = (data) => {
    if (!data) return 'N/A';
    if (typeof data === 'string') {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    try {
      const date = new Date(ts);
      return date.toLocaleString();
    } catch {
      return ts;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Operation Flow</h2>
          <span style={styles.subtitle}>
            API operation timeline and request/response analysis
          </span>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.refreshBtn} onClick={fetchOperations} title="Refresh">
            &#8635; Refresh
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filter by Test Case:</label>
          <select
            style={styles.filterSelect}
            value={filterTestCase}
            onChange={(e) => setFilterTestCase(e.target.value)}
          >
            <option value="all">All Test Cases ({operations.length})</option>
            {testCases.map((tc, i) => (
              <option key={i} value={tc}>
                {tc}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.filterStats}>
          <span style={styles.statBadge}>
            {filteredOps.length} operation{filteredOps.length !== 1 ? 's' : ''}
          </span>
          {filteredOps.length > 0 && (
            <>
              <span style={{ ...styles.statBadge, ...styles.statSuccess }}>
                {filteredOps.filter(
                  (op) => ['success', 'passed', 'pass'].includes((op.status || '').toLowerCase())
                ).length}{' '}
                passed
              </span>
              <span style={{ ...styles.statBadge, ...styles.statFail }}>
                {filteredOps.filter(
                  (op) =>
                    ['failure', 'failed', 'fail', 'error'].includes((op.status || '').toLowerCase())
                ).length}{' '}
                failed
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
            <span style={styles.loadingText}>Loading operations...</span>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <div style={styles.errorIconLarge}>&#9888;</div>
            <div style={styles.errorTitle}>Failed to load operations</div>
            <div style={styles.errorMessage}>{error}</div>
            <button style={styles.retryBtn} onClick={fetchOperations}>
              Retry
            </button>
          </div>
        ) : filteredOps.length === 0 ? (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIcon}>&#128269;</div>
            <div style={styles.emptyTitle}>No operations found</div>
            <div style={styles.emptyMessage}>
              {filterTestCase !== 'all'
                ? 'No operations match the selected test case filter.'
                : 'Run some test cases to see operation flows here.'}
            </div>
          </div>
        ) : (
          <div style={styles.timeline}>
            {/* Timeline line */}
            <div style={styles.timelineLine} />

            {filteredOps.map((op, idx) => {
              const isExpanded = expandedOps[idx] || false;
              const statusBadge = getStatusBadge(op.status);
              const methodStyle = getMethodBadge(op.request_type || op.method || op.requestType);
              const responseCodeStyle = getResponseCodeStyle(
                op.response_code || op.responseCode || op.status_code || op.statusCode
              );
              const reqKey = `${idx}-request`;
              const resKey = `${idx}-response`;
              const isReqExpanded = expandedSection[reqKey] || false;
              const isResExpanded = expandedSection[resKey] || false;

              return (
                <div key={idx} style={styles.timelineItem}>
                  {/* Timeline node */}
                  <div style={styles.timelineNode}>
                    <div
                      style={{
                        ...styles.timelineDot,
                        backgroundColor:
                          statusBadge.label === 'SUCCESS'
                            ? '#3fb950'
                            : statusBadge.label === 'FAILURE'
                            ? '#f85149'
                            : statusBadge.label === 'ERROR'
                            ? '#da3633'
                            : '#d29922',
                      }}
                    />
                    <div style={styles.timelineStep}>{idx + 1}</div>
                  </div>

                  {/* Operation card */}
                  <div
                    style={{
                      ...styles.operationCard,
                      borderLeftColor:
                        statusBadge.label === 'SUCCESS'
                          ? '#3fb950'
                          : statusBadge.label === 'FAILURE'
                          ? '#f85149'
                          : statusBadge.label === 'ERROR'
                          ? '#da3633'
                          : '#d29922',
                    }}
                  >
                    {/* Card header - always visible */}
                    <div
                      style={styles.cardHeader}
                      onClick={() => toggleExpand(idx)}
                    >
                      <div style={styles.cardHeaderLeft}>
                        <span style={styles.expandIcon}>
                          {isExpanded ? '\u25BC' : '\u25B6'}
                        </span>
                        <span
                          style={{
                            ...styles.methodBadge,
                            ...methodStyle,
                          }}
                        >
                          {(op.request_type || op.method || op.requestType || 'GET').toUpperCase()}
                        </span>
                        <span style={styles.operationName}>
                          {op.operation_name || op.operationName || op.name || op.operation || `Operation ${idx + 1}`}
                        </span>
                      </div>
                      <div style={styles.cardHeaderRight}>
                        <span style={{ ...styles.responseCode, ...responseCodeStyle }}>
                          {op.response_code || op.responseCode || op.status_code || op.statusCode || 'N/A'}
                        </span>
                        {(op.duration || op.duration_ms) && (
                          <span style={styles.durationBadge}>
                            {op.duration || op.duration_ms}
                            {typeof (op.duration || op.duration_ms) === 'number' ? ' ms' : ''}
                          </span>
                        )}
                        <span style={{ ...styles.statusBadge, ...statusBadge.style }}>
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>

                    {/* Card summary row */}
                    <div style={styles.cardSummary}>
                      <span style={styles.endpoint}>
                        {op.endpoint || op.url || op.path || 'N/A'}
                      </span>
                      {(op.test_case || op.testCase || op.test_case_name) && (
                        <span style={styles.testCaseTag}>
                          {op.test_case || op.testCase || op.test_case_name}
                        </span>
                      )}
                      <span style={styles.timestamp}>
                        {formatTimestamp(op.timestamp || op.created_at || op.createdAt)}
                      </span>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div style={styles.cardDetail}>
                        {/* Request Payload */}
                        <div style={styles.payloadSection}>
                          <div
                            style={styles.payloadHeader}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSection(idx, 'request');
                            }}
                          >
                            <span style={styles.payloadToggle}>
                              {isReqExpanded ? '\u25BC' : '\u25B6'}
                            </span>
                            <span style={styles.payloadLabel}>Request Payload</span>
                            <span style={styles.payloadHint}>
                              {isReqExpanded ? 'Click to collapse' : 'Click to expand'}
                            </span>
                          </div>
                          {isReqExpanded && (
                            <pre style={styles.jsonBlock}>
                              {formatJson(
                                op.request_payload ||
                                  op.requestPayload ||
                                  op.request_body ||
                                  op.requestBody ||
                                  op.request
                              )}
                            </pre>
                          )}
                        </div>

                        {/* Response Payload */}
                        <div style={styles.payloadSection}>
                          <div
                            style={styles.payloadHeader}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSection(idx, 'response');
                            }}
                          >
                            <span style={styles.payloadToggle}>
                              {isResExpanded ? '\u25BC' : '\u25B6'}
                            </span>
                            <span style={styles.payloadLabel}>Response Payload</span>
                            <span style={styles.payloadHint}>
                              {isResExpanded ? 'Click to collapse' : 'Click to expand'}
                            </span>
                          </div>
                          {isResExpanded && (
                            <pre style={styles.jsonBlock}>
                              {formatJson(
                                op.response_payload ||
                                  op.responsePayload ||
                                  op.response_body ||
                                  op.responseBody ||
                                  op.response
                              )}
                            </pre>
                          )}
                        </div>

                        {/* Detail metadata row */}
                        <div style={styles.metadataRow}>
                          <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Operation</span>
                            <span style={styles.metaValue}>
                              {op.operation_name || op.operationName || op.name || op.operation || 'N/A'}
                            </span>
                          </div>
                          <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Method</span>
                            <span style={styles.metaValue}>
                              {(op.request_type || op.method || op.requestType || 'N/A').toUpperCase()}
                            </span>
                          </div>
                          <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Endpoint</span>
                            <span style={styles.metaValue}>
                              {op.endpoint || op.url || op.path || 'N/A'}
                            </span>
                          </div>
                          <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Response Code</span>
                            <span style={{ ...styles.metaValue, ...responseCodeStyle }}>
                              {op.response_code || op.responseCode || op.status_code || op.statusCode || 'N/A'}
                            </span>
                          </div>
                          <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Duration</span>
                            <span style={styles.metaValue}>
                              {op.duration || op.duration_ms
                                ? `${op.duration || op.duration_ms}${typeof (op.duration || op.duration_ms) === 'number' ? ' ms' : ''}`
                                : 'N/A'}
                            </span>
                          </div>
                          <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Timestamp</span>
                            <span style={styles.metaValue}>
                              {formatTimestamp(op.timestamp || op.created_at || op.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #21262d',
    backgroundColor: '#161b22',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#f0f6fc',
  },
  subtitle: {
    fontSize: '13px',
    color: '#8b949e',
  },
  headerRight: {
    display: 'flex',
    gap: '8px',
  },
  refreshBtn: {
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: 500,
    border: '1px solid #30363d',
    borderRadius: '6px',
    backgroundColor: '#21262d',
    color: '#c9d1d9',
    cursor: 'pointer',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    borderBottom: '1px solid #21262d',
    backgroundColor: '#161b22',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filterLabel: {
    fontSize: '13px',
    color: '#8b949e',
    fontWeight: 500,
  },
  filterSelect: {
    padding: '6px 12px',
    fontSize: '13px',
    border: '1px solid #30363d',
    borderRadius: '6px',
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '200px',
  },
  filterStats: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  statBadge: {
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: '#21262d',
    color: '#8b949e',
    fontWeight: 500,
  },
  statSuccess: {
    backgroundColor: 'rgba(63, 185, 80, 0.15)',
    color: '#3fb950',
  },
  statFail: {
    backgroundColor: 'rgba(248, 81, 73, 0.15)',
    color: '#f85149',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '16px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #30363d',
    borderTop: '3px solid #58a6ff',
    borderRadius: '50%',
    animation: 'opFlowSpin 0.8s linear infinite',
  },
  loadingText: {
    fontSize: '14px',
    color: '#8b949e',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '12px',
  },
  errorIconLarge: {
    fontSize: '48px',
    color: '#f85149',
  },
  errorTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#f0f6fc',
  },
  errorMessage: {
    fontSize: '14px',
    color: '#8b949e',
    maxWidth: '400px',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: '8px',
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: 500,
    border: '1px solid #30363d',
    borderRadius: '6px',
    backgroundColor: '#21262d',
    color: '#c9d1d9',
    cursor: 'pointer',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '12px',
  },
  emptyIcon: {
    fontSize: '48px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#8b949e',
  },
  emptyMessage: {
    fontSize: '14px',
    color: '#484f58',
  },
  timeline: {
    position: 'relative',
    paddingLeft: '60px',
  },
  timelineLine: {
    position: 'absolute',
    left: '29px',
    top: '0',
    bottom: '0',
    width: '2px',
    backgroundColor: '#21262d',
  },
  timelineItem: {
    position: 'relative',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'flex-start',
  },
  timelineNode: {
    position: 'absolute',
    left: '-60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '58px',
    gap: '4px',
  },
  timelineDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid #0d1117',
    zIndex: 1,
  },
  timelineStep: {
    fontSize: '10px',
    color: '#484f58',
    fontWeight: 600,
  },
  operationCard: {
    flex: 1,
    backgroundColor: '#161b22',
    border: '1px solid #21262d',
    borderLeft: '3px solid #30363d',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    gap: '12px',
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: 0,
  },
  expandIcon: {
    fontSize: '10px',
    color: '#8b949e',
    width: '14px',
    flexShrink: 0,
  },
  methodBadge: {
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    flexShrink: 0,
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
  },
  operationName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#f0f6fc',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cardHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  responseCode: {
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
  },
  codeGreen: {
    backgroundColor: 'rgba(63, 185, 80, 0.15)',
    color: '#3fb950',
  },
  codeBlue: {
    backgroundColor: 'rgba(31, 111, 235, 0.15)',
    color: '#58a6ff',
  },
  codeOrange: {
    backgroundColor: 'rgba(210, 153, 34, 0.15)',
    color: '#d29922',
  },
  codeRed: {
    backgroundColor: 'rgba(248, 81, 73, 0.15)',
    color: '#f85149',
  },
  codeDefault: {
    backgroundColor: '#21262d',
    color: '#8b949e',
  },
  durationBadge: {
    fontSize: '12px',
    color: '#8b949e',
    backgroundColor: '#21262d',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  statusBadge: {
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
  badgeSuccess: {
    backgroundColor: 'rgba(63, 185, 80, 0.15)',
    color: '#3fb950',
  },
  badgeFailure: {
    backgroundColor: 'rgba(248, 81, 73, 0.15)',
    color: '#f85149',
  },
  badgeError: {
    backgroundColor: 'rgba(218, 54, 51, 0.2)',
    color: '#da3633',
  },
  badgePending: {
    backgroundColor: 'rgba(210, 153, 34, 0.15)',
    color: '#d29922',
  },
  badgeUnknown: {
    backgroundColor: '#21262d',
    color: '#8b949e',
  },
  cardSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 16px 10px',
    fontSize: '12px',
    borderBottom: '1px solid #21262d',
  },
  endpoint: {
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
    color: '#8b949e',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  testCaseTag: {
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(31, 111, 235, 0.15)',
    color: '#58a6ff',
    fontSize: '11px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  timestamp: {
    color: '#484f58',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  cardDetail: {
    backgroundColor: '#0d1117',
    borderTop: '1px solid #21262d',
  },
  payloadSection: {
    borderBottom: '1px solid #21262d',
  },
  payloadHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  payloadToggle: {
    fontSize: '10px',
    color: '#8b949e',
    width: '14px',
  },
  payloadLabel: {
    fontWeight: 600,
    color: '#c9d1d9',
  },
  payloadHint: {
    marginLeft: 'auto',
    fontSize: '11px',
    color: '#484f58',
  },
  jsonBlock: {
    margin: 0,
    padding: '12px 16px 12px 38px',
    backgroundColor: '#161b22',
    borderTop: '1px solid #21262d',
    fontSize: '12px',
    lineHeight: '1.5',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
    color: '#e6edf3',
    overflow: 'auto',
    maxHeight: '300px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  metadataRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1px',
    backgroundColor: '#21262d',
    borderTop: '1px solid #21262d',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '10px 16px',
    backgroundColor: '#0d1117',
  },
  metaLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metaValue: {
    fontSize: '13px',
    color: '#c9d1d9',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
    wordBreak: 'break-all',
  },
};

// Inject keyframe animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes opFlowSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.querySelector('[data-op-flow-styles]')) {
  styleSheet.setAttribute('data-op-flow-styles', 'true');
  document.head.appendChild(styleSheet);
}

export default OperationFlow;

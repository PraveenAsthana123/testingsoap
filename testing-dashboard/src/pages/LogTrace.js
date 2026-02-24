import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3001';

const TABS = [
  { key: 'audit', label: 'Audit Log', endpoint: '/api/audit-log' },
  { key: 'operation', label: 'Operation Log', endpoint: '/api/operation-flow' },
  { key: 'session', label: 'Session Log', endpoint: '/api/sessions' },
  { key: 'notification', label: 'Notifications', endpoint: '/api/notifications' },
];

const ACTION_TYPES = ['All', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'TRANSFER', 'PAYMENT'];
const OPERATION_STATUSES = ['All', 'success', 'failure', 'error', 'pending'];
const NOTIFICATION_TYPES = ['All', 'info', 'warning', 'error', 'success', 'alert', 'reminder'];

function LogTrace() {
  const [activeTab, setActiveTab] = useState('audit');
  const [data, setData] = useState({ audit: [], operation: [], session: [], notification: [] });
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterAction, setFilterAction] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const fetchTabData = useCallback(async (tabKey) => {
    const tab = TABS.find((t) => t.key === tabKey);
    if (!tab) return;

    setLoading((prev) => ({ ...prev, [tabKey]: true }));
    setError((prev) => ({ ...prev, [tabKey]: null }));

    try {
      const response = await fetch(`${API_BASE}${tab.endpoint}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch ${tab.label}`);
      }
      const result = await response.json();
      const rows = Array.isArray(result)
        ? result
        : result.operations || result.flows || result.sessions || result.notifications || result.data || [];
      setData((prev) => ({ ...prev, [tabKey]: Array.isArray(rows) ? rows : [] }));
    } catch (err) {
      setError((prev) => ({ ...prev, [tabKey]: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [tabKey]: false }));
    }
  }, []);

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  const formatTimestamp = (ts) => {
    if (!ts) return '--';
    try {
      return new Date(ts).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  const maskToken = (token) => {
    if (!token) return '--';
    if (token.length <= 8) return '****';
    return token.substring(0, 4) + '****' + token.substring(token.length - 4);
  };

  const getResponseCodeStyle = (code) => {
    const c = parseInt(code, 10);
    if (c >= 200 && c < 300) return { backgroundColor: '#dcfce7', color: '#15803d' };
    if (c >= 300 && c < 400) return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
    if (c >= 400 && c < 500) return { backgroundColor: '#fef3c7', color: '#92400e' };
    if (c >= 500) return { backgroundColor: '#fee2e2', color: '#b91c1c' };
    return { backgroundColor: '#f1f5f9', color: '#64748b' };
  };

  const getTypeBadgeStyle = (type) => {
    const t = (type || '').toLowerCase();
    const map = {
      info: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
      warning: { backgroundColor: '#fef3c7', color: '#92400e' },
      error: { backgroundColor: '#fee2e2', color: '#b91c1c' },
      success: { backgroundColor: '#dcfce7', color: '#15803d' },
      alert: { backgroundColor: '#fce7f3', color: '#9d174d' },
      reminder: { backgroundColor: '#e0e7ff', color: '#3730a3' },
    };
    return map[t] || { backgroundColor: '#f1f5f9', color: '#64748b' };
  };

  const filterByDate = (rows) => {
    if (!dateFrom && !dateTo) return rows;
    return rows.filter((row) => {
      const ts = row.timestamp || row.created_at || row.login_time || row.createdAt;
      if (!ts) return true;
      const rowDate = new Date(ts);
      if (dateFrom && rowDate < new Date(dateFrom)) return false;
      if (dateTo) {
        const toEnd = new Date(dateTo);
        toEnd.setHours(23, 59, 59, 999);
        if (rowDate > toEnd) return false;
      }
      return true;
    });
  };

  const filterBySearch = (rows) => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some(
        (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      )
    );
  };

  const handleExport = () => {
    alert('Export functionality will be available in a future update.');
  };

  const getFilteredData = () => {
    let rows = data[activeTab] || [];
    rows = filterBySearch(rows);
    rows = filterByDate(rows);

    if (activeTab === 'audit' && filterAction !== 'All') {
      rows = rows.filter(
        (r) => (r.action || '').toUpperCase() === filterAction.toUpperCase()
      );
    }
    if (activeTab === 'operation' && filterStatus !== 'All') {
      rows = rows.filter(
        (r) => (r.status || '').toLowerCase() === filterStatus.toLowerCase()
      );
    }
    if (activeTab === 'notification' && filterType !== 'All') {
      rows = rows.filter(
        (r) => (r.type || '').toLowerCase() === filterType.toLowerCase()
      );
    }

    return rows;
  };

  const filteredRows = getFilteredData();

  const renderAuditTable = (rows) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Customer Name</th>
          <th style={styles.th}>Action</th>
          <th style={styles.th}>Entity Type</th>
          <th style={styles.th}>Entity ID</th>
          <th style={styles.th}>Details</th>
          <th style={styles.th}>IP Address</th>
          <th style={styles.th}>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
            <td style={styles.td}>{row.customer_name || row.customerName || '--'}</td>
            <td style={styles.td}>
              <span style={styles.actionBadge}>
                {(row.action || '--').toUpperCase()}
              </span>
            </td>
            <td style={styles.td}>{row.entity_type || row.entityType || '--'}</td>
            <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>
              {row.entity_id || row.entityId || '--'}
            </td>
            <td style={{ ...styles.td, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {row.details || row.description || '--'}
            </td>
            <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>
              {row.ip_address || row.ipAddress || row.ip || '--'}
            </td>
            <td style={{ ...styles.td, whiteSpace: 'nowrap', fontSize: '12px' }}>
              {formatTimestamp(row.timestamp || row.created_at || row.createdAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderOperationTable = (rows) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Operation</th>
          <th style={styles.th}>Method</th>
          <th style={styles.th}>Endpoint</th>
          <th style={styles.th}>Response Code</th>
          <th style={styles.th}>Duration</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const code = row.response_code || row.responseCode || row.status_code || row.statusCode;
          const codeStyle = getResponseCodeStyle(code);
          const status = (row.status || '').toLowerCase();
          const isSuccess = ['success', 'passed', 'pass'].includes(status);
          const isFail = ['failure', 'failed', 'fail', 'error'].includes(status);

          return (
            <tr key={idx} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
              <td style={styles.td}>
                {row.operation_name || row.operationName || row.name || row.operation || '--'}
              </td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.methodBadge,
                    ...getMethodColor(row.request_type || row.method || row.requestType),
                  }}
                >
                  {(row.request_type || row.method || row.requestType || '--').toUpperCase()}
                </span>
              </td>
              <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row.endpoint || row.url || row.path || '--'}
              </td>
              <td style={styles.td}>
                <span style={{ ...styles.codeBadge, ...codeStyle }}>
                  {code || '--'}
                </span>
              </td>
              <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>
                {row.duration || row.duration_ms
                  ? `${row.duration || row.duration_ms}${typeof (row.duration || row.duration_ms) === 'number' ? ' ms' : ''}`
                  : '--'}
              </td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.statusPill,
                    backgroundColor: isSuccess ? '#dcfce7' : isFail ? '#fee2e2' : '#f1f5f9',
                    color: isSuccess ? '#15803d' : isFail ? '#b91c1c' : '#64748b',
                  }}
                >
                  {(row.status || '--').toUpperCase()}
                </span>
              </td>
              <td style={{ ...styles.td, whiteSpace: 'nowrap', fontSize: '12px' }}>
                {formatTimestamp(row.timestamp || row.created_at || row.createdAt)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderSessionTable = (rows) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Customer</th>
          <th style={styles.th}>Session Token</th>
          <th style={styles.th}>IP Address</th>
          <th style={styles.th}>User Agent</th>
          <th style={styles.th}>Login Time</th>
          <th style={styles.th}>Logout Time</th>
          <th style={styles.th}>Active</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const isActive =
            row.is_active === true ||
            row.is_active === 1 ||
            row.isActive === true ||
            row.active === true ||
            row.status === 'active';

          return (
            <tr key={idx} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
              <td style={styles.td}>
                {row.customer_name || row.customerName || row.customer || row.username || '--'}
              </td>
              <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>
                {maskToken(row.session_token || row.sessionToken || row.token)}
              </td>
              <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>
                {row.ip_address || row.ipAddress || row.ip || '--'}
              </td>
              <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>
                {row.user_agent || row.userAgent || '--'}
              </td>
              <td style={{ ...styles.td, whiteSpace: 'nowrap', fontSize: '12px' }}>
                {formatTimestamp(row.login_time || row.loginTime || row.login_at || row.created_at)}
              </td>
              <td style={{ ...styles.td, whiteSpace: 'nowrap', fontSize: '12px' }}>
                {row.logout_time || row.logoutTime || row.logout_at
                  ? formatTimestamp(row.logout_time || row.logoutTime || row.logout_at)
                  : '--'}
              </td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.activeBadge,
                    backgroundColor: isActive ? '#dcfce7' : '#f1f5f9',
                    color: isActive ? '#15803d' : '#94a3b8',
                  }}
                >
                  {isActive ? 'Active' : 'Expired'}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderNotificationTable = (rows) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Customer</th>
          <th style={styles.th}>Title</th>
          <th style={styles.th}>Message</th>
          <th style={styles.th}>Type</th>
          <th style={styles.th}>Read</th>
          <th style={styles.th}>Created At</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const isRead =
            row.is_read === true ||
            row.is_read === 1 ||
            row.isRead === true ||
            row.read === true;
          const typeStyle = getTypeBadgeStyle(row.type);

          return (
            <tr key={idx} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
              <td style={styles.td}>
                {row.customer_name || row.customerName || row.customer || '--'}
              </td>
              <td style={{ ...styles.td, fontWeight: 600, color: '#1e293b' }}>
                {row.title || '--'}
              </td>
              <td style={{ ...styles.td, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row.message || row.body || '--'}
              </td>
              <td style={styles.td}>
                <span style={{ ...styles.typeBadge, ...typeStyle }}>
                  {(row.type || '--').toUpperCase()}
                </span>
              </td>
              <td style={styles.td}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isRead ? '#94a3b8' : '#3b82f6',
                  }}
                  title={isRead ? 'Read' : 'Unread'}
                />
              </td>
              <td style={{ ...styles.td, whiteSpace: 'nowrap', fontSize: '12px' }}>
                {formatTimestamp(row.created_at || row.createdAt || row.timestamp)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderTable = () => {
    if (loading[activeTab]) {
      return (
        <div style={styles.loadingState}>
          <div style={styles.spinner} />
          <span>Loading {TABS.find((t) => t.key === activeTab)?.label}...</span>
        </div>
      );
    }

    if (error[activeTab]) {
      return (
        <div style={styles.errorState}>
          <strong>Error:</strong> {error[activeTab]}
          <button style={styles.retryBtn} onClick={() => fetchTabData(activeTab)}>
            Retry
          </button>
        </div>
      );
    }

    if (filteredRows.length === 0) {
      return (
        <div style={styles.emptyState}>
          No records found
          {search || dateFrom || dateTo ? ' matching the current filters.' : '.'}
        </div>
      );
    }

    switch (activeTab) {
      case 'audit':
        return renderAuditTable(filteredRows);
      case 'operation':
        return renderOperationTable(filteredRows);
      case 'session':
        return renderSessionTable(filteredRows);
      case 'notification':
        return renderNotificationTable(filteredRows);
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <h2 style={styles.title}>Log & Trace</h2>
        <p style={styles.subtitle}>Audit trail, operation logs, sessions, and notifications</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSearch('');
              setFilterAction('All');
              setFilterStatus('All');
              setFilterType('All');
            }}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.key ? styles.tabButtonActive : {}),
            }}
          >
            {tab.label}
            {data[tab.key]?.length > 0 && (
              <span style={styles.tabCount}>{data[tab.key].length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterRow}>
          <input
            type="text"
            placeholder="Search across all columns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />

          {activeTab === 'audit' && (
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              style={styles.filterSelect}
            >
              {ACTION_TYPES.map((a) => (
                <option key={a} value={a}>
                  {a === 'All' ? 'All Actions' : a}
                </option>
              ))}
            </select>
          )}

          {activeTab === 'operation' && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={styles.filterSelect}
            >
              {OPERATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          )}

          {activeTab === 'notification' && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={styles.filterSelect}
            >
              {NOTIFICATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          )}

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={styles.dateInput}
            title="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={styles.dateInput}
            title="To date"
          />

          <button style={styles.exportBtn} onClick={handleExport}>
            Export
          </button>
        </div>
      </div>

      {/* Row Count */}
      {!loading[activeTab] && !error[activeTab] && (
        <div style={styles.rowCount}>
          Showing {filteredRows.length} of {(data[activeTab] || []).length} record
          {(data[activeTab] || []).length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Table Container */}
      <div style={styles.tableContainer}>{renderTable()}</div>
    </div>
  );
}

function getMethodColor(method) {
  const m = (method || '').toUpperCase();
  const map = {
    GET: { backgroundColor: '#dcfce7', color: '#15803d' },
    POST: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
    PUT: { backgroundColor: '#fef3c7', color: '#92400e' },
    PATCH: { backgroundColor: '#e0e7ff', color: '#3730a3' },
    DELETE: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  };
  return map[m] || { backgroundColor: '#f1f5f9', color: '#64748b' };
}

const styles = {
  container: {
    padding: '0',
    backgroundColor: '#ffffff',
    minHeight: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  pageHeader: {
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '22px',
    fontWeight: 700,
    color: '#1e293b',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#64748b',
  },
  tabBar: {
    display: 'flex',
    gap: '4px',
    borderBottom: '2px solid #e2e8f0',
    marginBottom: '16px',
  },
  tabButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#64748b',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '-2px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabButtonActive: {
    color: '#2563eb',
    borderBottomColor: '#2563eb',
    fontWeight: 600,
  },
  tabCount: {
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: '#e2e8f0',
    color: '#475569',
    padding: '1px 7px',
    borderRadius: '10px',
  },
  filterBar: {
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '12px',
  },
  filterRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchInput: {
    padding: '8px 14px',
    fontSize: '13px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none',
    flex: '1',
    minWidth: '200px',
    backgroundColor: '#ffffff',
    color: '#1e293b',
  },
  filterSelect: {
    padding: '8px 12px',
    fontSize: '13px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    cursor: 'pointer',
    minWidth: '140px',
  },
  dateInput: {
    padding: '7px 10px',
    fontSize: '13px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    cursor: 'pointer',
  },
  exportBtn: {
    padding: '8px 18px',
    fontSize: '13px',
    fontWeight: 600,
    border: '1px solid #2563eb',
    borderRadius: '6px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  rowCount: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '10px',
    fontWeight: 500,
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    backgroundColor: '#ffffff',
  },
  th: {
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#475569',
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '9px 14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
    fontSize: '13px',
  },
  trEven: {
    backgroundColor: '#ffffff',
  },
  trOdd: {
    backgroundColor: '#f8fafc',
  },
  actionBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    letterSpacing: '0.3px',
  },
  methodBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.3px',
  },
  codeBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'monospace',
  },
  statusPill: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
  activeBadge: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
  },
  typeBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.3px',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '12px',
    color: '#64748b',
    fontSize: '14px',
  },
  spinner: {
    width: '28px',
    height: '28px',
    border: '3px solid #e2e8f0',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'logTraceSpin 0.8s linear infinite',
  },
  errorState: {
    padding: '20px 24px',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: '8px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  retryBtn: {
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: 500,
    border: '1px solid #fecaca',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#b91c1c',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
    fontSize: '14px',
  },
};

// Inject keyframe animation for spinner
const logTraceStyleSheet = document.createElement('style');
logTraceStyleSheet.textContent = `
  @keyframes logTraceSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.querySelector('[data-log-trace-styles]')) {
  logTraceStyleSheet.setAttribute('data-log-trace-styles', 'true');
  document.head.appendChild(logTraceStyleSheet);
}

export default LogTrace;

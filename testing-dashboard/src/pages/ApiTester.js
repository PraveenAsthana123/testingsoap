import React, { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:3001';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

const METHOD_COLORS = {
  GET: '#61affe',
  POST: '#49cc90',
  PUT: '#fca130',
  DELETE: '#f93e3e',
  PATCH: '#50e3c2',
};

const PRESETS = [
  { method: 'GET', path: '/api/customers', label: 'List all customers', body: '' },
  { method: 'GET', path: '/api/accounts', label: 'List all accounts', body: '' },
  { method: 'GET', path: '/api/transactions', label: 'List transactions', body: '' },
  { method: 'GET', path: '/api/loans', label: 'List loans', body: '' },
  { method: 'GET', path: '/api/cards', label: 'List cards', body: '' },
  { method: 'GET', path: '/api/bill-payments', label: 'List bill payments', body: '' },
  { method: 'GET', path: '/api/test-cases', label: 'List test cases', body: '' },
  { method: 'GET', path: '/api/test-suites', label: 'List test suites', body: '' },
  { method: 'GET', path: '/api/defects', label: 'List defects', body: '' },
  { method: 'GET', path: '/api/dashboard/stats', label: 'Dashboard stats', body: '' },
  { method: 'GET', path: '/api/schema', label: 'Database schema', body: '' },
  { method: 'GET', path: '/api/audit-log', label: 'Audit log', body: '' },
  { method: 'GET', path: '/api/operation-flow', label: 'Operation flow', body: '' },
  { method: 'GET', path: '/api/notifications', label: 'Notifications', body: '' },
  { method: 'GET', path: '/api/sessions', label: 'Login sessions', body: '' },
  {
    method: 'POST',
    path: '/api/sql/execute',
    label: 'Execute SQL',
    body: JSON.stringify({ query: 'SELECT * FROM customers LIMIT 5' }, null, 2),
  },
  {
    method: 'PUT',
    path: '/api/test-cases/1/execute',
    label: 'Execute test case',
    body: JSON.stringify({ status: 'passed', notes: 'All assertions passed' }, null, 2),
  },
];

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function getStatusColor(status) {
  if (status >= 200 && status < 300) return '#49cc90';
  if (status >= 300 && status < 400) return '#61affe';
  if (status >= 400 && status < 500) return '#fca130';
  if (status >= 500) return '#f93e3e';
  return '#8b949e';
}

function ApiTester() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState(API_BASE + '/api/');
  const [headers, setHeaders] = useState([
    { key: 'Content-Type', value: 'application/json', enabled: true },
  ]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [responseHeadersOpen, setResponseHeadersOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index, field, value) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: value };
    setHeaders(updated);
  };

  const toggleHeader = (index) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setHeaders(updated);
  };

  const formatBody = () => {
    try {
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed, null, 2));
    } catch {
      // Body is not valid JSON, leave as-is
    }
  };

  const loadPreset = (preset) => {
    setMethod(preset.method);
    setUrl(API_BASE + preset.path);
    setBody(preset.body);
    setResponse(null);
  };

  const loadHistoryItem = (item) => {
    setMethod(item.method);
    setUrl(item.url);
    setBody(item.body || '');
    setHeaders(item.headers || [{ key: 'Content-Type', value: 'application/json', enabled: true }]);
    setResponse(item.response);
  };

  const sendRequest = useCallback(async () => {
    setLoading(true);
    setResponse(null);

    const startTime = performance.now();

    const reqHeaders = {};
    headers.forEach((h) => {
      if (h.enabled && h.key.trim()) {
        reqHeaders[h.key.trim()] = h.value;
      }
    });

    const fetchOptions = {
      method,
      headers: reqHeaders,
    };

    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      fetchOptions.body = body;
    }

    try {
      const res = await fetch(url, fetchOptions);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const responseHeaders = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseBody;
      let responseSize = 0;
      const contentType = res.headers.get('content-type') || '';

      const rawText = await res.text();
      responseSize = new Blob([rawText]).size;

      if (contentType.includes('application/json')) {
        try {
          responseBody = JSON.parse(rawText);
        } catch {
          responseBody = rawText;
        }
      } else {
        responseBody = rawText;
      }

      const result = {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        duration,
        size: responseSize,
      };

      setResponse(result);

      setHistory((prev) => {
        const entry = {
          method,
          url,
          body,
          headers: [...headers],
          status: res.status,
          duration,
          timestamp: new Date().toLocaleTimeString(),
          response: result,
        };
        return [entry, ...prev].slice(0, 10);
      });
    } catch (err) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const result = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        body: { error: err.message, hint: 'Is the backend server running at ' + url + '?' },
        duration,
        size: 0,
      };

      setResponse(result);

      setHistory((prev) => {
        const entry = {
          method,
          url,
          body,
          headers: [...headers],
          status: 0,
          duration,
          timestamp: new Date().toLocaleTimeString(),
          response: result,
        };
        return [entry, ...prev].slice(0, 10);
      });
    } finally {
      setLoading(false);
    }
  }, [method, url, headers, body]);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      sendRequest();
    }
  };

  const showBody = ['POST', 'PUT', 'PATCH'].includes(method);

  return (
    <div style={styles.container} onKeyDown={handleKeyDown}>
      <div style={styles.layout}>
        {/* Sidebar - Presets */}
        <div style={{ ...styles.sidebar, ...(sidebarCollapsed ? styles.sidebarCollapsed : {}) }}>
          <div style={styles.sidebarHeader}>
            {!sidebarCollapsed && <span style={styles.sidebarTitle}>API Presets</span>}
            <button
              style={styles.collapseBtn}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? '\u25B6' : '\u25C0'}
            </button>
          </div>
          {!sidebarCollapsed && (
            <div style={styles.presetList}>
              {PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  style={styles.presetItem}
                  onClick={() => loadPreset(preset)}
                  title={preset.method + ' ' + preset.path}
                >
                  <span
                    style={{
                      ...styles.methodBadgeSmall,
                      backgroundColor: METHOD_COLORS[preset.method] + '20',
                      color: METHOD_COLORS[preset.method],
                    }}
                  >
                    {preset.method}
                  </span>
                  <span style={styles.presetLabel}>{preset.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>API Tester</h2>
            <span style={styles.subtitle}>Test your banking API endpoints</span>
            <span style={styles.shortcutHint}>Ctrl+Enter to send</span>
          </div>

          {/* Request Builder */}
          <div style={styles.requestSection}>
            {/* URL Bar */}
            <div style={styles.urlBar}>
              <select
                style={{
                  ...styles.methodSelect,
                  backgroundColor: METHOD_COLORS[method] + '18',
                  color: METHOD_COLORS[method],
                  borderColor: METHOD_COLORS[method] + '40',
                }}
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                style={styles.urlInput}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter request URL"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    sendRequest();
                  }
                }}
              />
              <button
                style={{
                  ...styles.sendBtn,
                  opacity: loading ? 0.7 : 1,
                }}
                onClick={sendRequest}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>

            {/* Headers */}
            <div style={styles.sectionBlock}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>Headers</span>
                <button style={styles.addBtn} onClick={addHeader}>
                  + Add Header
                </button>
              </div>
              <div style={styles.headersList}>
                {headers.map((h, idx) => (
                  <div key={idx} style={styles.headerRow}>
                    <input
                      type="checkbox"
                      checked={h.enabled}
                      onChange={() => toggleHeader(idx)}
                      style={styles.headerCheckbox}
                    />
                    <input
                      style={{
                        ...styles.headerInput,
                        opacity: h.enabled ? 1 : 0.5,
                      }}
                      type="text"
                      value={h.key}
                      onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                      placeholder="Header name"
                    />
                    <input
                      style={{
                        ...styles.headerInput,
                        flex: 2,
                        opacity: h.enabled ? 1 : 0.5,
                      }}
                      type="text"
                      value={h.value}
                      onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                      placeholder="Value"
                    />
                    <button
                      style={styles.removeBtn}
                      onClick={() => removeHeader(idx)}
                      title="Remove header"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Body */}
            {showBody && (
              <div style={styles.sectionBlock}>
                <div style={styles.sectionHeader}>
                  <span style={styles.sectionTitle}>Request Body</span>
                  <button style={styles.addBtn} onClick={formatBody}>
                    Format JSON
                  </button>
                </div>
                <textarea
                  style={styles.bodyTextarea}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  spellCheck={false}
                />
              </div>
            )}
          </div>

          {/* Response Panel */}
          <div style={styles.responseSection}>
            <div style={styles.responseTitleBar}>
              <span style={styles.sectionTitle}>Response</span>
              {response && (
                <div style={styles.responseMetaRow}>
                  {/* Status Badge */}
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(response.status) + '18',
                      color: getStatusColor(response.status),
                      borderColor: getStatusColor(response.status) + '40',
                    }}
                  >
                    {response.status === 0
                      ? 'ERR'
                      : response.status + ' ' + response.statusText}
                  </span>
                  {/* Duration */}
                  <span style={styles.metaItem}>{response.duration} ms</span>
                  {/* Size */}
                  <span style={styles.metaItem}>{formatBytes(response.size)}</span>
                </div>
              )}
            </div>

            {loading && (
              <div style={styles.loadingArea}>
                <div style={styles.spinner} />
                <span>Sending request...</span>
              </div>
            )}

            {!response && !loading && (
              <div style={styles.emptyResponse}>
                <div style={styles.emptyIcon}>&#9889;</div>
                <div style={styles.emptyText}>Send a request to see the response</div>
                <div style={styles.emptySubtext}>
                  Select a preset from the sidebar or build your own request
                </div>
              </div>
            )}

            {response && !loading && (
              <div style={styles.responseContent}>
                {/* Response Headers (collapsible) */}
                <div style={styles.responseHeadersBlock}>
                  <div
                    style={styles.responseHeadersToggle}
                    onClick={() => setResponseHeadersOpen(!responseHeadersOpen)}
                  >
                    <span>
                      {responseHeadersOpen ? '\u25BC' : '\u25B6'} Response Headers (
                      {Object.keys(response.headers).length})
                    </span>
                  </div>
                  {responseHeadersOpen && (
                    <div style={styles.responseHeadersList}>
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} style={styles.responseHeaderItem}>
                          <span style={styles.responseHeaderKey}>{key}:</span>
                          <span style={styles.responseHeaderValue}>{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Response Body */}
                <div style={styles.responseBodyBlock}>
                  <pre style={styles.responseBodyPre}>
                    {typeof response.body === 'object'
                      ? JSON.stringify(response.body, null, 2)
                      : response.body}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Request History */}
          {history.length > 0 && (
            <div style={styles.historySection}>
              <div style={styles.historyHeader}>
                <span style={styles.sectionTitle}>Request History</span>
                <button
                  style={styles.clearHistoryBtn}
                  onClick={() => setHistory([])}
                >
                  Clear
                </button>
              </div>
              <div style={styles.historyList}>
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    style={styles.historyItem}
                    onClick={() => loadHistoryItem(item)}
                    title="Click to reload this request"
                  >
                    <span
                      style={{
                        ...styles.historyMethodBadge,
                        backgroundColor: METHOD_COLORS[item.method] + '20',
                        color: METHOD_COLORS[item.method],
                      }}
                    >
                      {item.method}
                    </span>
                    <span style={styles.historyUrl}>
                      {item.url.replace(API_BASE, '')}
                    </span>
                    <span
                      style={{
                        ...styles.historyStatus,
                        color: getStatusColor(item.status),
                      }}
                    >
                      {item.status === 0 ? 'ERR' : item.status}
                    </span>
                    <span style={styles.historyDuration}>{item.duration} ms</span>
                    <span style={styles.historyTime}>{item.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
    backgroundColor: '#ffffff',
    color: '#1e1e1e',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  layout: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },

  /* Sidebar */
  sidebar: {
    width: '280px',
    minWidth: '280px',
    borderRight: '1px solid #e0e0e0',
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'width 0.2s, min-width 0.2s',
  },
  sidebarCollapsed: {
    width: '44px',
    minWidth: '44px',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 12px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  sidebarTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  collapseBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: '4px',
  },
  presetList: {
    flex: 1,
    overflowY: 'auto',
    padding: '4px 0',
  },
  presetItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '13px',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.15s',
  },
  methodBadgeSmall: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '3px',
    minWidth: '38px',
    textAlign: 'center',
    letterSpacing: '0.3px',
    fontFamily: 'monospace',
  },
  presetLabel: {
    flex: 1,
    color: '#444',
    fontSize: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  /* Main Content */
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },

  /* Header */
  header: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    padding: '16px 24px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fff',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: '13px',
    color: '#888',
  },
  shortcutHint: {
    marginLeft: 'auto',
    fontSize: '11px',
    color: '#999',
    backgroundColor: '#f0f0f0',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },

  /* Request Section */
  requestSection: {
    padding: '16px 24px',
    borderBottom: '1px solid #e0e0e0',
  },

  /* URL Bar */
  urlBar: {
    display: 'flex',
    gap: '0',
    marginBottom: '16px',
    border: '2px solid #d0d0d0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  methodSelect: {
    padding: '10px 12px',
    fontSize: '14px',
    fontWeight: 700,
    border: 'none',
    borderRight: '2px solid #d0d0d0',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    minWidth: '90px',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  urlInput: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '14px',
    border: 'none',
    outline: 'none',
    backgroundColor: '#fff',
    color: '#1e1e1e',
    fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
  },
  sendBtn: {
    padding: '10px 28px',
    fontSize: '14px',
    fontWeight: 700,
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
    letterSpacing: '0.3px',
    transition: 'opacity 0.15s, background-color 0.15s',
  },

  /* Section Blocks */
  sectionBlock: {
    marginBottom: '16px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  addBtn: {
    padding: '4px 10px',
    fontSize: '12px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    backgroundColor: '#f8f8f8',
    color: '#555',
    cursor: 'pointer',
  },

  /* Headers */
  headersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  headerCheckbox: {
    cursor: 'pointer',
    accentColor: '#2563eb',
  },
  headerInput: {
    flex: 1,
    padding: '6px 10px',
    fontSize: '13px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#333',
    outline: 'none',
    fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
  },
  removeBtn: {
    padding: '4px 8px',
    fontSize: '13px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#cc3333',
    cursor: 'pointer',
    fontWeight: 600,
    lineHeight: 1,
  },

  /* Body Textarea */
  bodyTextarea: {
    width: '100%',
    minHeight: '120px',
    padding: '12px 14px',
    fontSize: '13px',
    fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fafafa',
    color: '#1e1e1e',
    outline: 'none',
    resize: 'vertical',
    lineHeight: '1.5',
    tabSize: 2,
    boxSizing: 'border-box',
  },

  /* Response Section */
  responseSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid #e0e0e0',
    minHeight: '200px',
  },
  responseTitleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  responseMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusBadge: {
    display: 'inline-block',
    fontSize: '13px',
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: '4px',
    border: '1px solid',
    fontFamily: 'monospace',
  },
  metaItem: {
    fontSize: '12px',
    color: '#777',
    backgroundColor: '#f0f0f0',
    padding: '3px 8px',
    borderRadius: '4px',
  },

  /* Loading */
  loadingArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '48px',
    color: '#888',
    fontSize: '14px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid #e0e0e0',
    borderTop: '3px solid #2563eb',
    borderRadius: '50%',
    animation: 'api-tester-spin 0.8s linear infinite',
  },

  /* Empty Response */
  emptyResponse: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 20px',
    color: '#bbb',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '12px',
    opacity: 0.4,
  },
  emptyText: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#999',
    marginBottom: '6px',
  },
  emptySubtext: {
    fontSize: '13px',
    color: '#bbb',
  },

  /* Response Content */
  responseContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },

  /* Response Headers */
  responseHeadersBlock: {
    borderBottom: '1px solid #eee',
  },
  responseHeadersToggle: {
    padding: '8px 24px',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#666',
    backgroundColor: '#fdfdfd',
    userSelect: 'none',
  },
  responseHeadersList: {
    padding: '0 24px 12px 24px',
    backgroundColor: '#fdfdfd',
  },
  responseHeaderItem: {
    display: 'flex',
    gap: '8px',
    padding: '2px 0',
    fontSize: '12px',
    fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
  },
  responseHeaderKey: {
    color: '#7c3aed',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  responseHeaderValue: {
    color: '#555',
    wordBreak: 'break-all',
  },

  /* Response Body */
  responseBodyBlock: {
    flex: 1,
    overflow: 'auto',
    padding: '0',
  },
  responseBodyPre: {
    margin: 0,
    padding: '16px 24px',
    fontSize: '13px',
    fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
    lineHeight: '1.5',
    backgroundColor: '#1e1e2e',
    color: '#cdd6f4',
    minHeight: '100px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowX: 'auto',
  },

  /* History Section */
  historySection: {
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#fafafa',
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 24px',
    borderBottom: '1px solid #e0e0e0',
  },
  clearHistoryBtn: {
    padding: '3px 10px',
    fontSize: '11px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#888',
    cursor: 'pointer',
  },
  historyList: {
    maxHeight: '160px',
    overflowY: 'auto',
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '7px 24px',
    cursor: 'pointer',
    fontSize: '12px',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.15s',
  },
  historyMethodBadge: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '3px',
    minWidth: '38px',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  historyUrl: {
    flex: 1,
    color: '#444',
    fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  historyStatus: {
    fontWeight: 700,
    fontSize: '12px',
    fontFamily: 'monospace',
    minWidth: '32px',
    textAlign: 'center',
  },
  historyDuration: {
    color: '#999',
    fontSize: '11px',
    minWidth: '50px',
    textAlign: 'right',
  },
  historyTime: {
    color: '#bbb',
    fontSize: '11px',
    minWidth: '70px',
    textAlign: 'right',
  },
};

// Inject keyframe animation for spinner
const apiTesterStyleSheet = document.createElement('style');
apiTesterStyleSheet.textContent = `
  @keyframes api-tester-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .api-tester-preset-item:hover {
    background-color: #f0f0f0;
  }
  .api-tester-history-item:hover {
    background-color: #f0f0f0;
  }
`;
if (!document.querySelector('[data-api-tester-styles]')) {
  apiTesterStyleSheet.setAttribute('data-api-tester-styles', 'true');
  document.head.appendChild(apiTesterStyleSheet);
}

export default ApiTester;

import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3001';

const SAMPLE_QUERIES = [
  {
    label: 'List all customers',
    query: 'SELECT * FROM customers;',
  },
  {
    label: 'Active savings accounts with balance > 100000',
    query: `SELECT a.account_id, a.account_number, a.account_type, a.balance, a.status,
       c.first_name, c.last_name, c.email
FROM accounts a
JOIN customers c ON a.customer_id = c.customer_id
WHERE a.account_type = 'savings' AND a.status = 'active' AND a.balance > 100000
ORDER BY a.balance DESC;`,
  },
  {
    label: 'Total balance by account type',
    query: `SELECT account_type,
       COUNT(*) AS account_count,
       SUM(balance) AS total_balance,
       AVG(balance) AS avg_balance,
       MIN(balance) AS min_balance,
       MAX(balance) AS max_balance
FROM accounts
GROUP BY account_type
ORDER BY total_balance DESC;`,
  },
  {
    label: 'Transactions in last 30 days',
    query: `SELECT t.transaction_id, t.transaction_type, t.amount, t.status,
       t.transaction_date, t.description,
       a.account_number, c.first_name || ' ' || c.last_name AS customer_name
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
JOIN customers c ON a.customer_id = c.customer_id
WHERE t.transaction_date >= date('now', '-30 days')
ORDER BY t.transaction_date DESC;`,
  },
  {
    label: 'Customers with multiple accounts',
    query: `SELECT c.customer_id, c.first_name, c.last_name, c.email,
       COUNT(a.account_id) AS account_count,
       SUM(a.balance) AS total_balance
FROM customers c
JOIN accounts a ON c.customer_id = a.customer_id
GROUP BY c.customer_id
HAVING COUNT(a.account_id) > 1
ORDER BY account_count DESC;`,
  },
  {
    label: 'Top 5 highest balance accounts',
    query: `SELECT a.account_id, a.account_number, a.account_type, a.balance,
       c.first_name || ' ' || c.last_name AS customer_name
FROM accounts a
JOIN customers c ON a.customer_id = c.customer_id
ORDER BY a.balance DESC
LIMIT 5;`,
  },
  {
    label: 'Pending transactions',
    query: `SELECT t.transaction_id, t.transaction_type, t.amount,
       t.transaction_date, t.description,
       a.account_number, c.first_name || ' ' || c.last_name AS customer_name
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
JOIN customers c ON a.customer_id = c.customer_id
WHERE t.status = 'pending'
ORDER BY t.transaction_date DESC;`,
  },
  {
    label: 'Loan EMI schedule',
    query: `SELECT l.loan_id, l.loan_type, l.principal_amount, l.interest_rate,
       l.emi_amount, l.tenure_months, l.status,
       c.first_name || ' ' || c.last_name AS customer_name,
       a.account_number
FROM loans l
JOIN customers c ON l.customer_id = c.customer_id
JOIN accounts a ON l.account_id = a.account_id
ORDER BY l.start_date DESC;`,
  },
  {
    label: 'Monthly transaction summary',
    query: `SELECT strftime('%Y-%m', transaction_date) AS month,
       transaction_type,
       COUNT(*) AS tx_count,
       SUM(amount) AS total_amount,
       AVG(amount) AS avg_amount
FROM transactions
GROUP BY strftime('%Y-%m', transaction_date), transaction_type
ORDER BY month DESC, transaction_type;`,
  },
  {
    label: 'Inactive accounts',
    query: `SELECT a.account_id, a.account_number, a.account_type, a.balance,
       a.status, a.created_at,
       c.first_name || ' ' || c.last_name AS customer_name
FROM accounts a
JOIN customers c ON a.customer_id = c.customer_id
WHERE a.status = 'inactive' OR a.status = 'dormant'
ORDER BY a.created_at;`,
  },
  {
    label: 'Account statement for customer',
    query: `SELECT t.transaction_date, t.transaction_type, t.description,
       CASE WHEN t.transaction_type IN ('credit', 'deposit') THEN t.amount ELSE 0 END AS credit,
       CASE WHEN t.transaction_type IN ('debit', 'withdrawal') THEN t.amount ELSE 0 END AS debit,
       t.status, a.account_number
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
JOIN customers c ON a.customer_id = c.customer_id
WHERE c.customer_id = 1
ORDER BY t.transaction_date DESC;`,
  },
  {
    label: 'Revenue from fees',
    query: `SELECT transaction_type,
       COUNT(*) AS fee_count,
       SUM(amount) AS total_fees,
       AVG(amount) AS avg_fee
FROM transactions
WHERE transaction_type IN ('fee', 'charge', 'penalty', 'service_charge')
GROUP BY transaction_type
ORDER BY total_fees DESC;`,
  },
  {
    label: 'Overdue bills / payments',
    query: `SELECT b.bill_id, b.bill_type, b.amount, b.due_date, b.status,
       c.first_name || ' ' || c.last_name AS customer_name,
       julianday('now') - julianday(b.due_date) AS days_overdue
FROM bills b
JOIN customers c ON b.customer_id = c.customer_id
WHERE b.status = 'overdue' OR (b.status = 'pending' AND b.due_date < date('now'))
ORDER BY days_overdue DESC;`,
  },
  {
    label: 'Customer search by name',
    query: `SELECT customer_id, first_name, last_name, email, phone, address, status, created_at
FROM customers
WHERE first_name LIKE '%John%' OR last_name LIKE '%John%'
ORDER BY last_name, first_name;`,
  },
  {
    label: 'Transaction volume by type',
    query: `SELECT transaction_type,
       COUNT(*) AS transaction_count,
       SUM(amount) AS total_volume,
       ROUND(AVG(amount), 2) AS avg_amount,
       MIN(amount) AS min_amount,
       MAX(amount) AS max_amount
FROM transactions
GROUP BY transaction_type
ORDER BY transaction_count DESC;`,
  },
  {
    label: 'Account opening trend',
    query: `SELECT strftime('%Y-%m', created_at) AS month,
       account_type,
       COUNT(*) AS accounts_opened
FROM accounts
GROUP BY strftime('%Y-%m', created_at), account_type
ORDER BY month DESC;`,
  },
  {
    label: 'Cross-account transfers',
    query: `SELECT t1.transaction_id AS debit_tx_id,
       t1.amount,
       a1.account_number AS from_account,
       a2.account_number AS to_account,
       c1.first_name || ' ' || c1.last_name AS sender,
       c2.first_name || ' ' || c2.last_name AS receiver,
       t1.transaction_date
FROM transactions t1
JOIN transactions t2 ON t1.reference_id = t2.reference_id AND t1.transaction_id != t2.transaction_id
JOIN accounts a1 ON t1.account_id = a1.account_id
JOIN accounts a2 ON t2.account_id = a2.account_id
JOIN customers c1 ON a1.customer_id = c1.customer_id
JOIN customers c2 ON a2.customer_id = c2.customer_id
WHERE t1.transaction_type = 'debit'
ORDER BY t1.transaction_date DESC;`,
  },
  {
    label: 'Card usage statistics',
    query: `SELECT c.card_type,
       COUNT(*) AS total_cards,
       SUM(CASE WHEN c.status = 'active' THEN 1 ELSE 0 END) AS active_cards,
       SUM(CASE WHEN c.status = 'blocked' THEN 1 ELSE 0 END) AS blocked_cards,
       AVG(c.credit_limit) AS avg_credit_limit
FROM cards c
GROUP BY c.card_type
ORDER BY total_cards DESC;`,
  },
  {
    label: 'Audit trail for customer',
    query: `SELECT al.audit_id, al.action, al.table_name, al.record_id,
       al.old_value, al.new_value, al.performed_by, al.created_at
FROM audit_log al
WHERE al.customer_id = 1
ORDER BY al.created_at DESC
LIMIT 50;`,
  },
  {
    label: 'Database schema overview',
    query: `SELECT name AS table_name, type
FROM sqlite_master
WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
ORDER BY name;`,
  },
  {
    label: 'All table row counts',
    query: `SELECT 'customers' AS table_name, COUNT(*) AS row_count FROM customers
UNION ALL SELECT 'accounts', COUNT(*) FROM accounts
UNION ALL SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL SELECT 'loans', COUNT(*) FROM loans
UNION ALL SELECT 'cards', COUNT(*) FROM cards
UNION ALL SELECT 'bills', COUNT(*) FROM bills
UNION ALL SELECT 'audit_log', COUNT(*) FROM audit_log;`,
  },
  {
    label: 'Customer account summary',
    query: `SELECT c.customer_id, c.first_name || ' ' || c.last_name AS name,
       COUNT(DISTINCT a.account_id) AS accounts,
       COALESCE(SUM(a.balance), 0) AS total_balance,
       COUNT(DISTINCT l.loan_id) AS active_loans,
       COUNT(DISTINCT cd.card_id) AS cards
FROM customers c
LEFT JOIN accounts a ON c.customer_id = a.customer_id
LEFT JOIN loans l ON c.customer_id = l.customer_id
LEFT JOIN cards cd ON a.account_id = cd.account_id
GROUP BY c.customer_id
ORDER BY total_balance DESC;`,
  },
];

function SqlEditor() {
  const [query, setQuery] = useState('SELECT * FROM customers;');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schema, setSchema] = useState([]);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaSidebarOpen, setSchemaSidebarOpen] = useState(true);
  const [expandedTable, setExpandedTable] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  const fetchSchema = useCallback(async () => {
    setSchemaLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/schema`);
      if (!response.ok) {
        throw new Error(`Schema fetch failed: ${response.status}`);
      }
      const data = await response.json();
      setSchema(data.tables || data || []);
    } catch (err) {
      setSchema([]);
    } finally {
      setSchemaLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  const executeQuery = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Please enter a SQL query.');
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE}/api/sql/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmedQuery }),
      });
      const data = await response.json();

      if (data.success === false || data.error) {
        setError(data.error || 'Query execution failed.');
        setResults(null);
      } else {
        setResults(data);
        setError(null);
        setQueryHistory((prev) => {
          const next = [
            { query: trimmedQuery, timestamp: new Date().toLocaleTimeString(), rowCount: data.rowCount },
            ...prev,
          ];
          return next.slice(0, 20);
        });
      }
    } catch (err) {
      setError(`Connection error: ${err.message}`);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeQuery();
    }
  };

  const handleSampleSelect = (e) => {
    const idx = e.target.value;
    if (idx === '') return;
    setQuery(SAMPLE_QUERIES[parseInt(idx, 10)].query);
    e.target.value = '';
  };

  const clearEditor = () => {
    setQuery('');
    setResults(null);
    setError(null);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>SQL Editor</h2>
          <span style={styles.subtitle}>Execute queries against the banking database</span>
        </div>
        <div style={styles.headerRight}>
          <button
            style={styles.schemaToggle}
            onClick={() => setSchemaSidebarOpen(!schemaSidebarOpen)}
          >
            {schemaSidebarOpen ? 'Hide Schema' : 'Show Schema'}
          </button>
        </div>
      </div>

      <div style={styles.body}>
        {/* Schema Sidebar */}
        {schemaSidebarOpen && (
          <div style={styles.schemaSidebar}>
            <div style={styles.schemaHeader}>
              <span style={styles.schemaTitle}>Database Schema</span>
              <button style={styles.refreshBtn} onClick={fetchSchema} title="Refresh schema">
                &#8635;
              </button>
            </div>
            <div style={styles.schemaContent}>
              {schemaLoading ? (
                <div style={styles.schemaLoading}>Loading schema...</div>
              ) : schema.length === 0 ? (
                <div style={styles.schemaEmpty}>No schema info available. Make sure the backend is running.</div>
              ) : (
                schema.map((table, idx) => (
                  <div key={idx} style={styles.schemaTable}>
                    <div
                      style={styles.schemaTableName}
                      onClick={() => setExpandedTable(expandedTable === idx ? null : idx)}
                    >
                      <span style={styles.schemaTableIcon}>
                        {expandedTable === idx ? '\u25BC' : '\u25B6'}
                      </span>
                      <span style={styles.schemaTableLabel}>{table.name || table.table_name}</span>
                      {(table.rowCount !== undefined || table.row_count !== undefined) && (
                        <span style={styles.schemaRowCount}>
                          {table.rowCount ?? table.row_count} rows
                        </span>
                      )}
                    </div>
                    {expandedTable === idx && (table.columns || []).length > 0 && (
                      <div style={styles.schemaColumns}>
                        {table.columns.map((col, cIdx) => (
                          <div key={cIdx} style={styles.schemaColumn}>
                            <span style={styles.schemaColName}>{col.name || col.column_name}</span>
                            <span style={styles.schemaColType}>{col.type || col.data_type || ''}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div style={styles.mainArea}>
          {/* Toolbar */}
          <div style={styles.toolbar}>
            <button
              style={{ ...styles.btn, ...styles.btnRun }}
              onClick={executeQuery}
              disabled={loading}
            >
              {loading ? 'Running...' : '\u25B6 Run Query'}
            </button>
            <button style={{ ...styles.btn, ...styles.btnClear }} onClick={clearEditor}>
              Clear
            </button>
            <select style={styles.sampleSelect} onChange={handleSampleSelect} defaultValue="">
              <option value="" disabled>
                Sample Queries ({SAMPLE_QUERIES.length})
              </option>
              {SAMPLE_QUERIES.map((sq, idx) => (
                <option key={idx} value={idx}>
                  {sq.label}
                </option>
              ))}
            </select>
            <span style={styles.shortcutHint}>Ctrl+Enter to run</span>
          </div>

          {/* Query Editor */}
          <div style={styles.editorContainer}>
            <div style={styles.lineNumbers}>
              {query.split('\n').map((_, i) => (
                <div key={i} style={styles.lineNumber}>
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              style={styles.textarea}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your SQL query here..."
              spellCheck={false}
            />
          </div>

          {/* Results Area */}
          <div style={styles.resultsArea}>
            {/* Status Bar */}
            {(results || error) && (
              <div style={styles.statusBar}>
                {error ? (
                  <div style={styles.errorStatus}>
                    <span style={styles.errorIcon}>&#10006;</span>
                    <span>{error}</span>
                  </div>
                ) : results ? (
                  <div style={styles.successStatus}>
                    <span style={styles.successIcon}>&#10004;</span>
                    <span>
                      {results.rowCount !== undefined ? `${results.rowCount} row(s) returned` : 'Query executed'}
                    </span>
                    {results.duration_ms !== undefined && (
                      <span style={styles.duration}>{results.duration_ms} ms</span>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={styles.loadingOverlay}>
                <div style={styles.spinner} />
                <span>Executing query...</span>
              </div>
            )}

            {/* Results Table */}
            {results && results.columns && results.rows && (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th, ...styles.rowNumTh }}>#</th>
                      {results.columns.map((col, i) => (
                        <th key={i} style={styles.th}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={results.columns.length + 1}
                          style={styles.emptyRow}
                        >
                          No rows returned
                        </td>
                      </tr>
                    ) : (
                      results.rows.map((row, rIdx) => (
                        <tr key={rIdx} style={rIdx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                          <td style={{ ...styles.td, ...styles.rowNumTd }}>{rIdx + 1}</td>
                          {results.columns.map((col, cIdx) => (
                            <td key={cIdx} style={styles.td}>
                              {row[col] === null || row[col] === undefined ? (
                                <span style={styles.nullValue}>NULL</span>
                              ) : (
                                String(row[col])
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* No results yet */}
            {!results && !error && !loading && (
              <div style={styles.placeholder}>
                <div style={styles.placeholderIcon}>&#128451;</div>
                <div style={styles.placeholderText}>
                  Run a query to see results here
                </div>
                <div style={styles.placeholderSubtext}>
                  Select a sample query from the dropdown or write your own
                </div>
              </div>
            )}
          </div>

          {/* Query History */}
          {queryHistory.length > 0 && (
            <div style={styles.historySection}>
              <div style={styles.historyTitle}>Recent Queries</div>
              <div style={styles.historyList}>
                {queryHistory.map((h, i) => (
                  <div
                    key={i}
                    style={styles.historyItem}
                    onClick={() => setQuery(h.query)}
                    title="Click to load this query"
                  >
                    <span style={styles.historyTime}>{h.timestamp}</span>
                    <span style={styles.historyQuery}>
                      {h.query.length > 80 ? h.query.substring(0, 80) + '...' : h.query}
                    </span>
                    {h.rowCount !== undefined && (
                      <span style={styles.historyRows}>{h.rowCount} rows</span>
                    )}
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
  schemaToggle: {
    padding: '6px 14px',
    fontSize: '13px',
    border: '1px solid #30363d',
    borderRadius: '6px',
    backgroundColor: '#21262d',
    color: '#c9d1d9',
    cursor: 'pointer',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  schemaSidebar: {
    width: '260px',
    minWidth: '260px',
    borderRight: '1px solid #21262d',
    backgroundColor: '#0d1117',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  schemaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #21262d',
    backgroundColor: '#161b22',
  },
  schemaTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#f0f6fc',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  refreshBtn: {
    background: 'none',
    border: 'none',
    color: '#8b949e',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  schemaContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
  },
  schemaLoading: {
    padding: '20px 16px',
    color: '#8b949e',
    fontSize: '13px',
    textAlign: 'center',
  },
  schemaEmpty: {
    padding: '20px 16px',
    color: '#8b949e',
    fontSize: '13px',
    textAlign: 'center',
  },
  schemaTable: {
    borderBottom: '1px solid #21262d',
  },
  schemaTableName: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#58a6ff',
    fontWeight: 500,
    transition: 'background-color 0.15s',
  },
  schemaTableIcon: {
    fontSize: '10px',
    color: '#8b949e',
    width: '12px',
  },
  schemaTableLabel: {
    flex: 1,
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
  },
  schemaRowCount: {
    fontSize: '11px',
    color: '#8b949e',
    backgroundColor: '#21262d',
    padding: '2px 6px',
    borderRadius: '10px',
  },
  schemaColumns: {
    padding: '4px 16px 8px 36px',
    backgroundColor: '#161b22',
  },
  schemaColumn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3px 0',
    fontSize: '12px',
  },
  schemaColName: {
    color: '#c9d1d9',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
  },
  schemaColType: {
    color: '#8b949e',
    fontSize: '11px',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
    backgroundColor: '#21262d',
    padding: '1px 6px',
    borderRadius: '4px',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderBottom: '1px solid #21262d',
    backgroundColor: '#161b22',
  },
  btn: {
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: 500,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'opacity 0.15s',
  },
  btnRun: {
    backgroundColor: '#238636',
    color: '#ffffff',
  },
  btnClear: {
    backgroundColor: '#21262d',
    color: '#c9d1d9',
    border: '1px solid #30363d',
  },
  sampleSelect: {
    padding: '7px 12px',
    fontSize: '13px',
    border: '1px solid #30363d',
    borderRadius: '6px',
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
    maxWidth: '320px',
    cursor: 'pointer',
    outline: 'none',
  },
  shortcutHint: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#8b949e',
    backgroundColor: '#21262d',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #30363d',
  },
  editorContainer: {
    display: 'flex',
    minHeight: '180px',
    maxHeight: '280px',
    borderBottom: '1px solid #21262d',
    backgroundColor: '#0d1117',
  },
  lineNumbers: {
    padding: '12px 0',
    width: '44px',
    minWidth: '44px',
    backgroundColor: '#161b22',
    borderRight: '1px solid #21262d',
    textAlign: 'right',
    userSelect: 'none',
    overflowY: 'hidden',
  },
  lineNumber: {
    padding: '0 8px',
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#484f58',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
  },
  textarea: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '13px',
    lineHeight: '1.6',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
    backgroundColor: '#0d1117',
    color: '#e6edf3',
    border: 'none',
    outline: 'none',
    resize: 'none',
    overflow: 'auto',
    tabSize: 2,
  },
  resultsArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  statusBar: {
    padding: '8px 16px',
    borderBottom: '1px solid #21262d',
    backgroundColor: '#161b22',
    fontSize: '13px',
  },
  errorStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#f85149',
  },
  errorIcon: {
    fontSize: '14px',
  },
  successStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#3fb950',
  },
  successIcon: {
    fontSize: '14px',
  },
  duration: {
    marginLeft: 'auto',
    color: '#8b949e',
    fontSize: '12px',
    backgroundColor: '#21262d',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  loadingOverlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '40px',
    color: '#8b949e',
    fontSize: '14px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #30363d',
    borderTop: '2px solid #58a6ff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  tableWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    position: 'sticky',
    top: 0,
    padding: '8px 12px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#8b949e',
    backgroundColor: '#161b22',
    borderBottom: '2px solid #21262d',
    whiteSpace: 'nowrap',
  },
  rowNumTh: {
    width: '48px',
    textAlign: 'center',
    color: '#484f58',
  },
  td: {
    padding: '6px 12px',
    borderBottom: '1px solid #21262d',
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '#c9d1d9',
  },
  rowNumTd: {
    textAlign: 'center',
    color: '#484f58',
    fontSize: '12px',
  },
  evenRow: {
    backgroundColor: '#0d1117',
  },
  oddRow: {
    backgroundColor: '#161b22',
  },
  nullValue: {
    color: '#484f58',
    fontStyle: 'italic',
  },
  emptyRow: {
    textAlign: 'center',
    padding: '24px',
    color: '#8b949e',
    fontStyle: 'italic',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: '#484f58',
  },
  placeholderIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  placeholderText: {
    fontSize: '16px',
    fontWeight: 500,
    marginBottom: '8px',
    color: '#8b949e',
  },
  placeholderSubtext: {
    fontSize: '13px',
    color: '#484f58',
  },
  historySection: {
    borderTop: '1px solid #21262d',
    backgroundColor: '#161b22',
    maxHeight: '140px',
    overflow: 'hidden',
  },
  historyTitle: {
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #21262d',
  },
  historyList: {
    overflowY: 'auto',
    maxHeight: '110px',
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 16px',
    cursor: 'pointer',
    fontSize: '12px',
    borderBottom: '1px solid #21262d',
    transition: 'background-color 0.15s',
  },
  historyTime: {
    color: '#8b949e',
    minWidth: '70px',
  },
  historyQuery: {
    flex: 1,
    color: '#c9d1d9',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  historyRows: {
    color: '#8b949e',
    backgroundColor: '#21262d',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '11px',
  },
};

// Inject keyframe animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.querySelector('[data-sql-editor-styles]')) {
  styleSheet.setAttribute('data-sql-editor-styles', 'true');
  document.head.appendChild(styleSheet);
}

export default SqlEditor;

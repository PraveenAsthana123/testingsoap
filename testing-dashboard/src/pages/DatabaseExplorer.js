import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3001';

// ============================================================
// ER DIAGRAM DATA: Tables, columns, keys, and relationships
// ============================================================
const ER_TABLES = [
  {
    name: 'customers',
    category: 'primary',
    columns: [
      { name: 'id', pk: true },
      { name: 'customer_id', key: true },
      { name: 'first_name' },
      { name: 'last_name' },
      { name: 'email' },
      { name: 'phone' },
      { name: 'address' },
      { name: 'status' },
      { name: 'created_at' },
    ],
  },
  {
    name: 'accounts',
    category: 'primary',
    columns: [
      { name: 'id', pk: true },
      { name: 'account_id', key: true },
      { name: 'customer_id', fk: 'customers' },
      { name: 'account_number' },
      { name: 'account_type' },
      { name: 'balance' },
      { name: 'status' },
      { name: 'created_at' },
    ],
  },
  {
    name: 'transactions',
    category: 'primary',
    columns: [
      { name: 'id', pk: true },
      { name: 'transaction_id', key: true },
      { name: 'account_id', fk: 'accounts' },
      { name: 'transaction_type' },
      { name: 'amount' },
      { name: 'status' },
      { name: 'description' },
      { name: 'reference_id' },
      { name: 'transaction_date' },
    ],
  },
  {
    name: 'bill_payments',
    category: 'secondary',
    columns: [
      { name: 'id', pk: true },
      { name: 'bill_id', key: true },
      { name: 'customer_id', fk: 'customers' },
      { name: 'bill_type' },
      { name: 'amount' },
      { name: 'due_date' },
      { name: 'status' },
    ],
  },
  {
    name: 'beneficiaries',
    category: 'secondary',
    columns: [
      { name: 'id', pk: true },
      { name: 'customer_id', fk: 'customers' },
      { name: 'beneficiary_name' },
      { name: 'account_number' },
      { name: 'bank_name' },
      { name: 'ifsc_code' },
    ],
  },
  {
    name: 'loans',
    category: 'primary',
    columns: [
      { name: 'id', pk: true },
      { name: 'loan_id', key: true },
      { name: 'customer_id', fk: 'customers' },
      { name: 'account_id', fk: 'accounts' },
      { name: 'loan_type' },
      { name: 'principal_amount' },
      { name: 'interest_rate' },
      { name: 'emi_amount' },
      { name: 'tenure_months' },
      { name: 'status' },
    ],
  },
  {
    name: 'cards',
    category: 'primary',
    columns: [
      { name: 'id', pk: true },
      { name: 'card_id', key: true },
      { name: 'account_id', fk: 'accounts' },
      { name: 'card_type' },
      { name: 'card_number' },
      { name: 'expiry_date' },
      { name: 'credit_limit' },
      { name: 'status' },
    ],
  },
  {
    name: 'login_sessions',
    category: 'secondary',
    columns: [
      { name: 'id', pk: true },
      { name: 'customer_id', fk: 'customers' },
      { name: 'session_token' },
      { name: 'ip_address' },
      { name: 'login_at' },
      { name: 'logout_at' },
      { name: 'status' },
    ],
  },
  {
    name: 'notifications',
    category: 'secondary',
    columns: [
      { name: 'id', pk: true },
      { name: 'customer_id', fk: 'customers' },
      { name: 'type' },
      { name: 'message' },
      { name: 'is_read' },
      { name: 'created_at' },
    ],
  },
  {
    name: 'audit_log',
    category: 'logging',
    columns: [
      { name: 'id', pk: true },
      { name: 'customer_id', fk: 'customers' },
      { name: 'action' },
      { name: 'table_name' },
      { name: 'record_id' },
      { name: 'old_value' },
      { name: 'new_value' },
      { name: 'performed_by' },
      { name: 'created_at' },
    ],
  },
  {
    name: 'test_suites',
    category: 'logging',
    columns: [
      { name: 'id', pk: true },
      { name: 'name' },
      { name: 'description' },
      { name: 'module' },
      { name: 'status' },
      { name: 'created_at' },
    ],
  },
  {
    name: 'test_cases',
    category: 'logging',
    columns: [
      { name: 'id', pk: true },
      { name: 'test_case_id' },
      { name: 'suite_id', fk: 'test_suites' },
      { name: 'title' },
      { name: 'priority' },
      { name: 'status' },
    ],
  },
  {
    name: 'test_runs',
    category: 'logging',
    columns: [
      { name: 'id', pk: true },
      { name: 'suite_id', fk: 'test_suites' },
      { name: 'run_date' },
      { name: 'total_cases' },
      { name: 'passed' },
      { name: 'failed' },
      { name: 'status' },
    ],
  },
  {
    name: 'test_execution_log',
    category: 'logging',
    columns: [
      { name: 'id', pk: true },
      { name: 'run_id', fk: 'test_runs' },
      { name: 'test_case_id', fk: 'test_cases' },
      { name: 'status' },
      { name: 'actual_result' },
      { name: 'executed_at' },
    ],
  },
  {
    name: 'operation_flow_log',
    category: 'logging',
    columns: [
      { name: 'id', pk: true },
      { name: 'operation' },
      { name: 'module' },
      { name: 'status' },
      { name: 'request_data' },
      { name: 'response_data' },
      { name: 'created_at' },
    ],
  },
  {
    name: 'defects',
    category: 'logging',
    columns: [
      { name: 'id', pk: true },
      { name: 'test_case_id', fk: 'test_cases' },
      { name: 'title' },
      { name: 'severity' },
      { name: 'status' },
      { name: 'description' },
      { name: 'created_at' },
    ],
  },
];

// FK relationships for drawing arrows: [source_table, target_table, fk_column]
const FK_RELATIONSHIPS = [
  { from: 'accounts', to: 'customers', label: 'customer_id' },
  { from: 'transactions', to: 'accounts', label: 'account_id' },
  { from: 'bill_payments', to: 'customers', label: 'customer_id' },
  { from: 'beneficiaries', to: 'customers', label: 'customer_id' },
  { from: 'loans', to: 'customers', label: 'customer_id' },
  { from: 'loans', to: 'accounts', label: 'account_id' },
  { from: 'cards', to: 'accounts', label: 'account_id' },
  { from: 'login_sessions', to: 'customers', label: 'customer_id' },
  { from: 'notifications', to: 'customers', label: 'customer_id' },
  { from: 'audit_log', to: 'customers', label: 'customer_id' },
  { from: 'test_cases', to: 'test_suites', label: 'suite_id' },
  { from: 'test_runs', to: 'test_suites', label: 'suite_id' },
  { from: 'test_execution_log', to: 'test_runs', label: 'run_id' },
  { from: 'test_execution_log', to: 'test_cases', label: 'test_case_id' },
  { from: 'defects', to: 'test_cases', label: 'test_case_id' },
];

const CATEGORY_COLORS = {
  primary: { border: '#3b82f6', bg: '#eff6ff', header: '#2563eb', headerText: '#ffffff', label: 'Primary' },
  secondary: { border: '#22c55e', bg: '#f0fdf4', header: '#16a34a', headerText: '#ffffff', label: 'Secondary' },
  logging: { border: '#9ca3af', bg: '#f9fafb', header: '#6b7280', headerText: '#ffffff', label: 'Logging' },
};

// ============================================================
// COMPONENT: ER Diagram Table Box
// ============================================================
function ERTableBox({ table, isHighlighted, onHover, onLeave }) {
  const cat = CATEGORY_COLORS[table.category] || CATEGORY_COLORS.logging;
  return (
    <div
      style={{
        border: `2px solid ${isHighlighted ? '#f59e0b' : cat.border}`,
        borderRadius: '8px',
        backgroundColor: isHighlighted ? '#fffbeb' : cat.bg,
        minWidth: '200px',
        maxWidth: '240px',
        boxShadow: isHighlighted
          ? '0 0 0 3px rgba(245, 158, 11, 0.3), 0 4px 12px rgba(0,0,0,0.15)'
          : '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        fontSize: '12px',
      }}
      onMouseEnter={() => onHover(table.name)}
      onMouseLeave={onLeave}
    >
      <div
        style={{
          backgroundColor: isHighlighted ? '#f59e0b' : cat.header,
          color: cat.headerText,
          padding: '6px 10px',
          fontWeight: 700,
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ opacity: 0.7, fontSize: '10px' }}>
          {table.category === 'primary' ? 'PRI' : table.category === 'secondary' ? 'SEC' : 'LOG'}
        </span>
        {table.name}
      </div>
      <div style={{ padding: '4px 0' }}>
        {table.columns.map((col, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 10px',
              borderBottom: idx < table.columns.length - 1 ? '1px solid #e5e7eb' : 'none',
              backgroundColor: col.pk ? 'rgba(59, 130, 246, 0.06)' : 'transparent',
            }}
          >
            {col.pk && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#dc2626',
                  backgroundColor: '#fef2f2',
                  padding: '0 4px',
                  borderRadius: '3px',
                  border: '1px solid #fecaca',
                }}
              >
                PK
              </span>
            )}
            {col.fk && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#7c3aed',
                  backgroundColor: '#f5f3ff',
                  padding: '0 4px',
                  borderRadius: '3px',
                  border: '1px solid #ddd6fe',
                }}
              >
                FK
              </span>
            )}
            {!col.pk && !col.fk && <span style={{ width: '22px' }} />}
            <span style={{ color: '#1f2937', fontFamily: 'monospace', fontSize: '11px' }}>
              {col.name}
            </span>
            {col.fk && (
              <span style={{ marginLeft: 'auto', color: '#9ca3af', fontSize: '9px', fontStyle: 'italic' }}>
                -&gt; {col.fk}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Schema Diagram Section
// ============================================================
function SchemaDiagram() {
  const [hoveredTable, setHoveredTable] = useState(null);
  const [diagramCollapsed, setDiagramCollapsed] = useState(false);

  const relatedTables = new Set();
  if (hoveredTable) {
    relatedTables.add(hoveredTable);
    FK_RELATIONSHIPS.forEach((rel) => {
      if (rel.from === hoveredTable) relatedTables.add(rel.to);
      if (rel.to === hoveredTable) relatedTables.add(rel.from);
    });
  }

  const isHighlighted = (name) => hoveredTable && relatedTables.has(name);

  const primaryTables = ER_TABLES.filter((t) => t.category === 'primary');
  const secondaryTables = ER_TABLES.filter((t) => t.category === 'secondary');
  const loggingTables = ER_TABLES.filter((t) => t.category === 'logging');

  // Group FK relationships for the textual relationship display
  const hoveredRelationships = hoveredTable
    ? FK_RELATIONSHIPS.filter((r) => r.from === hoveredTable || r.to === hoveredTable)
    : [];

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', margin: '0 0 20px 0' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 20px',
          borderBottom: diagramCollapsed ? 'none' : '1px solid #e5e7eb',
          cursor: 'pointer',
          backgroundColor: '#f8fafc',
          borderRadius: diagramCollapsed ? '10px' : '10px 10px 0 0',
        }}
        onClick={() => setDiagramCollapsed(!diagramCollapsed)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px', color: '#6366f1' }}>{diagramCollapsed ? '\u25B6' : '\u25BC'}</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
            Entity Relationship Diagram
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {ER_TABLES.length} tables, {FK_RELATIONSHIPS.length} relationships
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  backgroundColor: val.header,
                  display: 'inline-block',
                }}
              />
              <span style={{ color: '#64748b' }}>{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {!diagramCollapsed && (
        <div style={{ padding: '20px', overflowX: 'auto' }}>
          {/* Relationship info on hover */}
          {hoveredTable && hoveredRelationships.length > 0 && (
            <div
              style={{
                marginBottom: '16px',
                padding: '10px 16px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#92400e',
              }}
            >
              <strong>Relationships for {hoveredTable}:</strong>
              {hoveredRelationships.map((r, i) => (
                <span key={i} style={{ marginLeft: '12px' }}>
                  {r.from}
                  <span style={{ color: '#d97706', fontWeight: 700 }}> --[{r.label}]--&gt; </span>
                  {r.to}
                </span>
              ))}
            </div>
          )}

          {/* Primary Tables Row */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
              Core Banking Tables
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'flex-start' }}>
              {primaryTables.map((t) => (
                <ERTableBox
                  key={t.name}
                  table={t}
                  isHighlighted={isHighlighted(t.name)}
                  onHover={setHoveredTable}
                  onLeave={() => setHoveredTable(null)}
                />
              ))}
            </div>
          </div>

          {/* Relationship Lines (textual) */}
          <div
            style={{
              margin: '16px 0',
              padding: '12px 16px',
              backgroundColor: '#f1f5f9',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#475569',
              lineHeight: '1.8',
              overflowX: 'auto',
              whiteSpace: 'pre',
            }}
          >
            {`  customers --(1:N)--> accounts --(1:N)--> transactions
  customers --(1:N)--> loans     (loans also --> accounts)
  customers --(1:N)--> bill_payments, beneficiaries, login_sessions, notifications, audit_log
  accounts  --(1:N)--> cards
  test_suites --(1:N)--> test_cases, test_runs
  test_runs   --(1:N)--> test_execution_log
  test_cases  --(1:N)--> test_execution_log, defects`}
          </div>

          {/* Secondary Tables Row */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
              Secondary / Junction Tables
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'flex-start' }}>
              {secondaryTables.map((t) => (
                <ERTableBox
                  key={t.name}
                  table={t}
                  isHighlighted={isHighlighted(t.name)}
                  onHover={setHoveredTable}
                  onLeave={() => setHoveredTable(null)}
                />
              ))}
            </div>
          </div>

          {/* Logging Tables Row */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
              Logging / Testing Tables
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'flex-start' }}>
              {loggingTables.map((t) => (
                <ERTableBox
                  key={t.name}
                  table={t}
                  isHighlighted={isHighlighted(t.name)}
                  onHover={setHoveredTable}
                  onLeave={() => setHoveredTable(null)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT: Database Explorer
// ============================================================
export default function DatabaseExplorer() {
  const [schema, setSchema] = useState([]);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaError, setSchemaError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(null);
  const [tableFilter, setTableFilter] = useState('');

  // Fetch schema on mount
  const fetchSchema = useCallback(async () => {
    setSchemaLoading(true);
    setSchemaError(null);
    try {
      const response = await fetch(`${API_BASE}/api/schema`);
      if (!response.ok) {
        throw new Error(`Schema fetch failed: ${response.status}`);
      }
      const data = await response.json();
      setSchema(data.tables || data || []);
    } catch (err) {
      setSchemaError(err.message);
      setSchema([]);
    } finally {
      setSchemaLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  // Fetch preview data when table is selected
  const fetchPreview = useCallback(async (tableName) => {
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewData(null);
    try {
      const response = await fetch(`${API_BASE}/api/sql/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `SELECT * FROM ${tableName} LIMIT 50` }),
      });
      const data = await response.json();
      if (data.success === false || data.error) {
        setPreviewError(data.error || 'Failed to fetch preview data.');
      } else {
        setPreviewData(data);
      }
    } catch (err) {
      setPreviewError(`Connection error: ${err.message}`);
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    fetchPreview(table.name);
  };

  // Execute custom query
  const executeQuery = async () => {
    const trimmed = sqlQuery.trim();
    if (!trimmed) {
      setQueryError('Please enter a SQL query.');
      return;
    }
    setQueryLoading(true);
    setQueryError(null);
    setQueryResults(null);
    try {
      const response = await fetch(`${API_BASE}/api/sql/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await response.json();
      if (data.success === false || data.error) {
        setQueryError(data.error || 'Query execution failed.');
      } else {
        setQueryResults(data);
      }
    } catch (err) {
      setQueryError(`Connection error: ${err.message}`);
    } finally {
      setQueryLoading(false);
    }
  };

  const handleQueryKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeQuery();
    }
  };

  // Generate preset queries
  const presetQueries = schema.map((t) => ({
    label: `SELECT * FROM ${t.name} LIMIT 20`,
    table: t.name,
  }));

  const filteredSchema = tableFilter
    ? schema.filter((t) => t.name.toLowerCase().includes(tableFilter.toLowerCase()))
    : schema;

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={styles.pageTitle}>Database Explorer</h2>
          <p style={styles.pageSubtitle}>
            Explore the banking database schema, browse table data, and run custom queries
          </p>
        </div>
        <div style={styles.headerStats}>
          <div style={styles.statBadge}>
            <span style={styles.statValue}>{schema.length}</span>
            <span style={styles.statLabel}>Tables</span>
          </div>
          <div style={styles.statBadge}>
            <span style={styles.statValue}>{FK_RELATIONSHIPS.length}</span>
            <span style={styles.statLabel}>Relationships</span>
          </div>
          <div style={styles.statBadge}>
            <span style={styles.statValue}>
              {schema.reduce((sum, t) => sum + (t.rowCount ?? t.row_count ?? 0), 0).toLocaleString()}
            </span>
            <span style={styles.statLabel}>Total Rows</span>
          </div>
        </div>
      </div>

      {/* Section 1: ER Diagram */}
      <SchemaDiagram />

      {/* Section 2: Table Browser */}
      <div style={styles.browserSection}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Table Browser</h3>
          <button style={styles.refreshBtn} onClick={fetchSchema} title="Refresh schema">
            &#8635; Refresh Schema
          </button>
        </div>

        {schemaLoading && (
          <div style={styles.loadingMsg}>Loading schema...</div>
        )}
        {schemaError && (
          <div style={styles.errorMsg}>Error: {schemaError}</div>
        )}

        {!schemaLoading && !schemaError && (
          <div style={styles.browserBody}>
            {/* Left Panel: Table List */}
            <div style={styles.tableListPanel}>
              <div style={styles.tableListHeader}>
                <input
                  type="text"
                  placeholder="Filter tables..."
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  style={styles.filterInput}
                />
              </div>
              <div style={styles.tableListScroll}>
                {filteredSchema.length === 0 ? (
                  <div style={styles.emptyList}>No tables found</div>
                ) : (
                  filteredSchema.map((table, idx) => {
                    const isActive = selectedTable && selectedTable.name === table.name;
                    // Determine category for color coding
                    const erDef = ER_TABLES.find((e) => e.name === table.name);
                    const cat = erDef ? erDef.category : 'logging';
                    const catColor = CATEGORY_COLORS[cat];
                    return (
                      <div
                        key={idx}
                        style={{
                          ...styles.tableListItem,
                          backgroundColor: isActive ? '#eff6ff' : idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                          borderLeft: `3px solid ${isActive ? '#3b82f6' : catColor.border}`,
                        }}
                        onClick={() => handleTableSelect(table)}
                      >
                        <div style={styles.tableListName}>{table.name}</div>
                        <div style={styles.tableListMeta}>
                          <span style={{
                            ...styles.rowCountBadge,
                            backgroundColor: catColor.bg,
                            color: catColor.header,
                            border: `1px solid ${catColor.border}`,
                          }}>
                            {(table.rowCount ?? table.row_count ?? 0).toLocaleString()} rows
                          </span>
                          <span style={{
                            ...styles.colCountBadge,
                            backgroundColor: '#f1f5f9',
                            color: '#64748b',
                          }}>
                            {(table.columns || []).length} cols
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Panel: Table Details + Preview */}
            <div style={styles.tableDetailPanel}>
              {!selectedTable ? (
                <div style={styles.noSelection}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>&#128450;</div>
                  <div style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>
                    Select a table from the left panel to view its schema and data
                  </div>
                </div>
              ) : (
                <div>
                  {/* Table Name Header */}
                  <div style={styles.detailHeader}>
                    <h4 style={styles.detailTitle}>{selectedTable.name}</h4>
                    <span style={styles.detailRowCount}>
                      {(selectedTable.rowCount ?? selectedTable.row_count ?? 0).toLocaleString()} rows
                    </span>
                  </div>

                  {/* Column Details */}
                  <div style={styles.columnTableWrap}>
                    <table style={styles.columnTable}>
                      <thead>
                        <tr>
                          <th style={styles.colTh}>#</th>
                          <th style={styles.colTh}>Column Name</th>
                          <th style={styles.colTh}>Type</th>
                          <th style={styles.colTh}>PK</th>
                          <th style={styles.colTh}>Nullable</th>
                          <th style={styles.colTh}>Default Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedTable.columns || []).map((col, idx) => (
                          <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                            <td style={styles.colTd}>{col.cid !== undefined ? col.cid : idx}</td>
                            <td style={{ ...styles.colTd, fontWeight: col.pk ? 600 : 400, fontFamily: 'monospace', fontSize: '12px' }}>
                              {col.name || col.column_name}
                              {col.pk ? (
                                <span style={styles.pkBadgeInline}>PK</span>
                              ) : null}
                            </td>
                            <td style={{ ...styles.colTd, fontFamily: 'monospace', fontSize: '12px', color: '#6366f1' }}>
                              {col.type || col.data_type || 'TEXT'}
                            </td>
                            <td style={styles.colTd}>
                              {col.pk ? (
                                <span style={styles.yesIndicator}>YES</span>
                              ) : (
                                <span style={styles.noIndicator}>--</span>
                              )}
                            </td>
                            <td style={styles.colTd}>
                              {col.notnull ? (
                                <span style={styles.notNullBadge}>NOT NULL</span>
                              ) : (
                                <span style={styles.nullableBadge}>NULLABLE</span>
                              )}
                            </td>
                            <td style={{ ...styles.colTd, fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>
                              {col.dflt_value !== null && col.dflt_value !== undefined ? String(col.dflt_value) : '--'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Data Preview */}
                  <div style={styles.previewSection}>
                    <div style={styles.previewHeader}>
                      <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                        Data Preview (first 50 rows)
                      </span>
                      {previewData && (
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          {previewData.rowCount} row(s) returned
                          {previewData.duration_ms !== undefined && ` in ${previewData.duration_ms}ms`}
                        </span>
                      )}
                    </div>
                    {previewLoading && (
                      <div style={styles.loadingMsg}>Loading preview data...</div>
                    )}
                    {previewError && (
                      <div style={styles.errorMsg}>{previewError}</div>
                    )}
                    {previewData && previewData.columns && previewData.rows && (
                      <div style={styles.previewTableWrap}>
                        <table style={styles.dataTable}>
                          <thead>
                            <tr>
                              <th style={styles.dataTh}>#</th>
                              {previewData.columns.map((col, i) => (
                                <th key={i} style={styles.dataTh}>{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.rows.length === 0 ? (
                              <tr>
                                <td colSpan={previewData.columns.length + 1} style={styles.emptyRow}>
                                  No data in this table
                                </td>
                              </tr>
                            ) : (
                              previewData.rows.map((row, rIdx) => (
                                <tr key={rIdx} style={{ backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                                  <td style={{ ...styles.dataTd, color: '#94a3b8', textAlign: 'center', fontSize: '11px' }}>
                                    {rIdx + 1}
                                  </td>
                                  {previewData.columns.map((col, cIdx) => (
                                    <td key={cIdx} style={styles.dataTd}>
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
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Quick Query Editor */}
      <div style={styles.querySection}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Quick Query Editor</h3>
          <span style={styles.shortcutHint}>Ctrl+Enter to run</span>
        </div>

        <div style={styles.queryBody}>
          {/* Preset Queries */}
          <div style={styles.presetRow}>
            <label style={styles.presetLabel}>Preset Queries:</label>
            <select
              style={styles.presetSelect}
              onChange={(e) => {
                if (e.target.value) {
                  setSqlQuery(e.target.value);
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>
                -- Select a table query ({presetQueries.length}) --
              </option>
              {presetQueries.map((pq, idx) => (
                <option key={idx} value={pq.label}>
                  {pq.table}
                </option>
              ))}
            </select>
            {selectedTable && (
              <button
                style={styles.quickSelectBtn}
                onClick={() => setSqlQuery(`SELECT * FROM ${selectedTable.name} LIMIT 20`)}
              >
                Query: {selectedTable.name}
              </button>
            )}
          </div>

          {/* SQL Textarea */}
          <div style={styles.sqlEditorWrap}>
            <textarea
              style={styles.sqlTextarea}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              onKeyDown={handleQueryKeyDown}
              placeholder="Enter your SQL query here... (e.g., SELECT * FROM customers LIMIT 20)"
              spellCheck={false}
              rows={5}
            />
          </div>

          {/* Action Buttons */}
          <div style={styles.queryActions}>
            <button
              style={styles.runBtn}
              onClick={executeQuery}
              disabled={queryLoading}
            >
              {queryLoading ? 'Running...' : '\u25B6 Run Query'}
            </button>
            <button
              style={styles.clearBtn}
              onClick={() => {
                setSqlQuery('');
                setQueryResults(null);
                setQueryError(null);
              }}
            >
              Clear
            </button>
          </div>

          {/* Query Results */}
          {queryLoading && (
            <div style={styles.loadingMsg}>Executing query...</div>
          )}
          {queryError && (
            <div style={styles.errorMsg}>{queryError}</div>
          )}
          {queryResults && queryResults.columns && queryResults.rows && (
            <div>
              <div style={styles.queryResultInfo}>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>
                  &#10004; {queryResults.rowCount} row(s) returned
                </span>
                {queryResults.duration_ms !== undefined && (
                  <span style={{ color: '#64748b', fontSize: '12px' }}>
                    in {queryResults.duration_ms}ms
                  </span>
                )}
              </div>
              <div style={styles.queryResultTableWrap}>
                <table style={styles.dataTable}>
                  <thead>
                    <tr>
                      <th style={styles.dataTh}>#</th>
                      {queryResults.columns.map((col, i) => (
                        <th key={i} style={styles.dataTh}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResults.rows.length === 0 ? (
                      <tr>
                        <td colSpan={queryResults.columns.length + 1} style={styles.emptyRow}>
                          No rows returned
                        </td>
                      </tr>
                    ) : (
                      queryResults.rows.map((row, rIdx) => (
                        <tr key={rIdx} style={{ backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                          <td style={{ ...styles.dataTd, color: '#94a3b8', textAlign: 'center', fontSize: '11px' }}>
                            {rIdx + 1}
                          </td>
                          {queryResults.columns.map((col, cIdx) => (
                            <td key={cIdx} style={styles.dataTd}>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles = {
  container: {
    padding: '20px 24px',
    backgroundColor: '#ffffff',
    minHeight: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1e293b',
  },

  // Page Header
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e2e8f0',
  },
  pageTitle: {
    margin: '0 0 4px 0',
    fontSize: '22px',
    fontWeight: 700,
    color: '#0f172a',
  },
  pageSubtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#64748b',
  },
  headerStats: {
    display: 'flex',
    gap: '12px',
  },
  statBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    minWidth: '80px',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: '10px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '2px',
  },

  // Section common
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb',
    borderRadius: '10px 10px 0 0',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#1e293b',
  },
  refreshBtn: {
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: 500,
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
  },

  // Table Browser Section
  browserSection: {
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  browserBody: {
    display: 'flex',
    minHeight: '500px',
  },

  // Left panel - table list
  tableListPanel: {
    width: '280px',
    minWidth: '280px',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fafafa',
  },
  tableListHeader: {
    padding: '10px 12px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f1f5f9',
  },
  filterInput: {
    width: '100%',
    padding: '7px 10px',
    fontSize: '13px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    boxSizing: 'border-box',
  },
  tableListScroll: {
    flex: 1,
    overflowY: 'auto',
  },
  emptyList: {
    padding: '24px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '13px',
  },
  tableListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    borderBottom: '1px solid #f1f5f9',
  },
  tableListName: {
    fontWeight: 500,
    fontSize: '13px',
    color: '#1e293b',
    fontFamily: 'monospace',
  },
  tableListMeta: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  rowCountBadge: {
    fontSize: '10px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '10px',
  },
  colCountBadge: {
    fontSize: '10px',
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },

  // Right panel - table details
  tableDetailPanel: {
    flex: 1,
    overflow: 'auto',
    padding: '0',
  },
  noSelection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '40px',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#f0f9ff',
    borderBottom: '1px solid #bae6fd',
  },
  detailTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#0369a1',
    fontFamily: 'monospace',
  },
  detailRowCount: {
    fontSize: '12px',
    color: '#0284c7',
    backgroundColor: '#e0f2fe',
    padding: '4px 12px',
    borderRadius: '12px',
    fontWeight: 600,
  },

  // Column details table
  columnTableWrap: {
    padding: '16px 20px',
    overflowX: 'auto',
  },
  columnTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
  },
  colTh: {
    padding: '8px 12px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    borderBottom: '2px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  colTd: {
    padding: '6px 12px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
    fontSize: '13px',
  },
  pkBadgeInline: {
    marginLeft: '6px',
    fontSize: '9px',
    fontWeight: 700,
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    padding: '1px 5px',
    borderRadius: '3px',
    border: '1px solid #fecaca',
    verticalAlign: 'middle',
  },
  yesIndicator: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  noIndicator: {
    fontSize: '11px',
    color: '#cbd5e1',
  },
  notNullBadge: {
    fontSize: '10px',
    fontWeight: 600,
    color: '#b45309',
    backgroundColor: '#fffbeb',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid #fde68a',
  },
  nullableBadge: {
    fontSize: '10px',
    color: '#94a3b8',
  },

  // Data Preview
  previewSection: {
    borderTop: '1px solid #e5e7eb',
    margin: '0',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb',
  },
  previewTableWrap: {
    maxHeight: '360px',
    overflowY: 'auto',
    overflowX: 'auto',
  },

  // Data table (shared for preview + query results)
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
  },
  dataTh: {
    position: 'sticky',
    top: 0,
    padding: '8px 10px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    borderBottom: '2px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  dataTd: {
    padding: '5px 10px',
    borderBottom: '1px solid #f1f5f9',
    maxWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '#334155',
    fontSize: '12px',
  },
  nullValue: {
    color: '#cbd5e1',
    fontStyle: 'italic',
    fontSize: '11px',
  },
  emptyRow: {
    textAlign: 'center',
    padding: '24px',
    color: '#94a3b8',
    fontStyle: 'italic',
    fontSize: '13px',
  },

  // Quick Query Section
  querySection: {
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  queryBody: {
    padding: '16px 20px',
  },
  presetRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  presetLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
  },
  presetSelect: {
    padding: '7px 12px',
    fontSize: '13px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '260px',
  },
  quickSelectBtn: {
    padding: '7px 14px',
    fontSize: '12px',
    fontWeight: 500,
    border: '1px solid #93c5fd',
    borderRadius: '6px',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    cursor: 'pointer',
  },
  sqlEditorWrap: {
    marginBottom: '12px',
  },
  sqlTextarea: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '13px',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#fafafa',
    color: '#1e293b',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    lineHeight: '1.6',
    boxSizing: 'border-box',
    tabSize: 2,
  },
  queryActions: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  runBtn: {
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer',
  },
  clearBtn: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 500,
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#64748b',
    cursor: 'pointer',
  },
  queryResultInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
    marginBottom: '8px',
    fontSize: '13px',
  },
  queryResultTableWrap: {
    maxHeight: '400px',
    overflowY: 'auto',
    overflowX: 'auto',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
  },

  // Shared messages
  loadingMsg: {
    padding: '20px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '13px',
  },
  errorMsg: {
    padding: '12px 16px',
    margin: '8px 0',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    color: '#dc2626',
    fontSize: '13px',
  },
  shortcutHint: {
    fontSize: '11px',
    color: '#94a3b8',
    backgroundColor: '#f1f5f9',
    padding: '4px 10px',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
  },
};

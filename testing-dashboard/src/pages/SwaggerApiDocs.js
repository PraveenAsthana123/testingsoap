import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001';

const API_ENDPOINTS = [
  {
    category: 'Dashboard',
    endpoints: [
      { method: 'GET', path: '/api/dashboard/stats', desc: 'Get dashboard statistics including counts and totals', response: '{"customers":10,"accounts":16,"transactions":30,...}' }
    ]
  },
  {
    category: 'Customers',
    endpoints: [
      { method: 'GET', path: '/api/customers', desc: 'List all customers', response: '[{"id":1,"first_name":"Rajesh","last_name":"Kumar",...}]' },
      { method: 'GET', path: '/api/customers/:id', desc: 'Get customer by ID', response: '{"id":1,"first_name":"Rajesh","last_name":"Kumar","email":"rajesh.kumar@email.com",...}' }
    ]
  },
  {
    category: 'Accounts',
    endpoints: [
      { method: 'GET', path: '/api/accounts', desc: 'List all accounts with customer names', response: '[{"id":1,"account_number":"ACC-SAV-001","account_type":"savings","balance":150000.00,...}]' },
      { method: 'GET', path: '/api/accounts/:id', desc: 'Get account by ID with customer name', response: '{"id":1,"account_number":"ACC-SAV-001","customer_name":"Rajesh Kumar",...}' }
    ]
  },
  {
    category: 'Transactions',
    endpoints: [
      { method: 'GET', path: '/api/transactions', desc: 'List all transactions with account numbers', response: '[{"id":1,"type":"transfer","amount":25000.00,"from_account_number":"ACC-SAV-001",...}]' }
    ]
  },
  {
    category: 'Loans',
    endpoints: [
      { method: 'GET', path: '/api/loans', desc: 'List all loans with customer names', response: '[{"id":1,"loan_type":"home","amount":5000000.00,"interest_rate":8.5,...}]' }
    ]
  },
  {
    category: 'Cards',
    endpoints: [
      { method: 'GET', path: '/api/cards', desc: 'List all cards with customer names', response: '[{"id":1,"card_type":"debit","card_number":"****1234","status":"active",...}]' }
    ]
  },
  {
    category: 'Bill Payments',
    endpoints: [
      { method: 'GET', path: '/api/bill-payments', desc: 'List all bill payments', response: '[{"id":1,"biller_name":"Electricity Board","amount":2500.00,...}]' }
    ]
  },
  {
    category: 'Test Management',
    endpoints: [
      { method: 'GET', path: '/api/test-suites', desc: 'List test suites with counts', response: '[{"id":1,"name":"Registration Tests","total_cases":5,"passed":4,...}]' },
      { method: 'GET', path: '/api/test-cases', desc: 'List test cases (filterable by module, status, category, priority)', response: '[{"id":1,"test_case_id":"TC-001","title":"Valid Registration",...}]', params: 'module, status, category, priority' },
      { method: 'GET', path: '/api/test-cases/:id', desc: 'Get single test case by ID', response: '{"id":1,"test_case_id":"TC-001","title":"Valid Registration","steps":"..."}' },
      { method: 'PUT', path: '/api/test-cases/:id/execute', desc: 'Execute a test case (update status, result)', response: '{"id":1,"status":"pass","actual_result":"...","executed_at":"..."}', body: '{"status":"pass","actual_result":"Registration successful","notes":"Verified","execution_time_ms":1500}' },
      { method: 'GET', path: '/api/test-runs', desc: 'List all test runs', response: '[{"id":1,"run_name":"Sprint 24 Run","run_date":"2024-01-15",...}]' }
    ]
  },
  {
    category: 'Monitoring',
    endpoints: [
      { method: 'GET', path: '/api/operation-flow', desc: 'Operation flow log (filterable by test_case_id)', response: '[{"id":1,"operation":"API_CALL","endpoint":"/api/customers",...}]', params: 'test_case_id' },
      { method: 'GET', path: '/api/defects', desc: 'List all defects with linked test cases', response: '[{"id":1,"title":"Login fails with special chars","severity":"critical",...}]' },
      { method: 'GET', path: '/api/audit-log', desc: 'Audit trail with customer names', response: '[{"id":1,"action":"LOGIN","customer_name":"Rajesh Kumar",...}]' },
      { method: 'GET', path: '/api/notifications', desc: 'Customer notifications', response: '[{"id":1,"type":"transaction","message":"...","customer_name":"...",...}]' },
      { method: 'GET', path: '/api/sessions', desc: 'Login sessions with customer names', response: '[{"id":1,"customer_name":"Rajesh Kumar","ip_address":"192.168.1.10",...}]' }
    ]
  },
  {
    category: 'Tools',
    endpoints: [
      { method: 'POST', path: '/api/sql/execute', desc: 'Execute SQL query (SELECT, INSERT, UPDATE, DELETE)', response: '{"success":true,"type":"query","rows":[...],"rowCount":10,"columns":["id","name"],"duration_ms":5}', body: '{"query":"SELECT * FROM customers LIMIT 5"}' },
      { method: 'GET', path: '/api/schema', desc: 'Database schema info (tables, columns, row counts)', response: '[{"name":"customers","columns":[{"name":"id","type":"INTEGER",...}],"rowCount":10}]' }
    ]
  }
];

const HTTP_STATUS_CODES = [
  { code: 200, name: 'OK', desc: 'Request successful', when: 'GET successful, PUT update successful' },
  { code: 201, name: 'Created', desc: 'Resource created successfully', when: 'POST creating new record' },
  { code: 204, name: 'No Content', desc: 'Success with no response body', when: 'DELETE successful' },
  { code: 400, name: 'Bad Request', desc: 'Invalid request payload', when: 'Malformed JSON, missing required fields, invalid SQL' },
  { code: 401, name: 'Unauthorized', desc: 'Authentication required', when: 'Missing or invalid API key/token' },
  { code: 403, name: 'Forbidden', desc: 'Insufficient permissions', when: 'Valid token but no access to resource' },
  { code: 404, name: 'Not Found', desc: 'Resource does not exist', when: 'Invalid ID, non-existent endpoint' },
  { code: 405, name: 'Method Not Allowed', desc: 'HTTP method not supported', when: 'POST to a GET-only endpoint' },
  { code: 409, name: 'Conflict', desc: 'Resource conflict', when: 'Duplicate key, version mismatch' },
  { code: 422, name: 'Unprocessable Entity', desc: 'Validation error', when: 'Valid JSON but failed business rules' },
  { code: 429, name: 'Too Many Requests', desc: 'Rate limit exceeded', when: 'Exceeded API call quota' },
  { code: 500, name: 'Internal Server Error', desc: 'Server-side error', when: 'Unhandled exception, DB connection failure' },
  { code: 502, name: 'Bad Gateway', desc: 'Upstream server error', when: 'Backend service unreachable' },
  { code: 503, name: 'Service Unavailable', desc: 'Server temporarily unavailable', when: 'Maintenance mode, overloaded' }
];

const SWAGGER_FEATURES = [
  { feature: 'Interactive Documentation', desc: 'Try API calls directly from browser. Fill parameters, send requests, see responses live.' },
  { feature: 'Schema Validation', desc: 'Define request/response models with JSON Schema. Auto-validates payloads against schema.' },
  { feature: 'Code Generation', desc: 'Generate client SDKs in 40+ languages. Server stubs for quick prototyping.' },
  { feature: 'Authentication', desc: 'Configure API keys, OAuth2, JWT. Test authenticated endpoints from UI.' },
  { feature: 'API Versioning', desc: 'Document multiple API versions side-by-side. Track breaking changes.' },
  { feature: 'Mock Server', desc: 'Generate mock responses from schema. Test frontend without backend.' }
];

const POSTMAN_VS_SWAGGER = [
  { feature: 'Primary Purpose', postman: 'API testing & collaboration', swagger: 'API documentation & design', soapui: 'SOAP/REST testing & automation' },
  { feature: 'Test Automation', postman: 'Newman CLI, Collection Runner', swagger: 'Code generation, contract testing', soapui: 'Test suites, Groovy scripting' },
  { feature: 'Documentation', postman: 'Published docs from collections', swagger: 'OpenAPI spec → interactive UI', soapui: 'WSDL/WADL based docs' },
  { feature: 'Mock Server', postman: 'Built-in mock server', swagger: 'Prism, Stoplight', soapui: 'MockService (SOAP/REST)' },
  { feature: 'CI/CD Integration', postman: 'Newman + GitHub Actions', swagger: 'Codegen + contract tests', soapui: 'Maven plugin, CLI runner' },
  { feature: 'Team Collaboration', postman: 'Workspaces, shared collections', swagger: 'SwaggerHub, Git-based', soapui: 'Shared project files' },
  { feature: 'SOAP Support', postman: 'Limited (raw XML)', swagger: 'No (REST only)', soapui: 'Full WSDL support' },
  { feature: 'Best For', postman: 'Manual API testing, quick prototyping', swagger: 'API-first design, documentation', soapui: 'Enterprise SOAP testing, complex scenarios' }
];

export default function SwaggerApiDocs() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedEndpoints, setExpandedEndpoints] = useState({});
  const [liveData, setLiveData] = useState({});
  const [loadingEndpoint, setLoadingEndpoint] = useState(null);

  const TABS = ['API Reference', 'Live API Explorer', 'HTTP Status Codes', 'Swagger/OpenAPI', 'Tool Comparison'];

  const toggle = (key) => setExpandedEndpoints(prev => ({ ...prev, [key]: !prev[key] }));

  const tryEndpoint = async (path) => {
    const actualPath = path.replace(':id', '1');
    setLoadingEndpoint(actualPath);
    try {
      const res = await fetch(`${API_BASE}${actualPath}`);
      const data = await res.json();
      setLiveData(prev => ({ ...prev, [path]: { status: res.status, data, time: new Date().toISOString() } }));
    } catch (err) {
      setLiveData(prev => ({ ...prev, [path]: { status: 'Error', data: { error: err.message }, time: new Date().toISOString() } }));
    }
    setLoadingEndpoint(null);
  };

  const methodColors = { GET: '#22c55e', POST: '#3b82f6', PUT: '#f59e0b', DELETE: '#dc2626', PATCH: '#8b5cf6' };

  const renderTab = () => {
    switch (activeTab) {
      case 0: // API Reference
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Banking API Reference</h3>
            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 6, marginBottom: 16, fontSize: 13 }}>
              <strong>Base URL:</strong> <code style={{ background: '#1e293b', color: '#22c55e', padding: '2px 8px', borderRadius: 4 }}>{API_BASE}</code>
              <span style={{ marginLeft: 16, color: '#64748b' }}>Format: JSON | Auth: None (development)</span>
            </div>

            {API_ENDPOINTS.map((cat, ci) => (
              <div key={ci} style={{ marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 15, color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: 6 }}>{cat.category}</h4>
                {cat.endpoints.map((ep, ei) => {
                  const key = `${ci}-${ei}`;
                  const isOpen = expandedEndpoints[key];
                  return (
                    <div key={key} style={{ background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 8, overflow: 'hidden' }}>
                      <div
                        onClick={() => toggle(key)}
                        style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                      >
                        <span style={{ background: methodColors[ep.method], color: '#fff', padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, minWidth: 45, textAlign: 'center' }}>{ep.method}</span>
                        <code style={{ fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{ep.path}</code>
                        <span style={{ fontSize: 12, color: '#64748b', flex: 1 }}>{ep.desc}</span>
                        <span style={{ color: '#94a3b8', fontSize: 14 }}>{isOpen ? '\u25B2' : '\u25BC'}</span>
                      </div>
                      {isOpen && (
                        <div style={{ padding: '0 14px 14px', borderTop: '1px solid #f1f5f9' }}>
                          {ep.params && (
                            <div style={{ margin: '10px 0' }}>
                              <strong style={{ fontSize: 12, color: '#64748b' }}>Query Parameters:</strong>
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                                {ep.params.split(', ').map((p, pi) => (
                                  <span key={pi} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}>{p}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {ep.body && (
                            <div style={{ margin: '10px 0' }}>
                              <strong style={{ fontSize: 12, color: '#64748b' }}>Request Body:</strong>
                              <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 12, borderRadius: 6, fontSize: 11, margin: '4px 0', overflowX: 'auto' }}>
                                {JSON.stringify(JSON.parse(ep.body), null, 2)}
                              </pre>
                            </div>
                          )}
                          <div style={{ margin: '10px 0' }}>
                            <strong style={{ fontSize: 12, color: '#64748b' }}>Example Response:</strong>
                            <pre style={{ background: '#0f172a', color: '#38bdf8', padding: 12, borderRadius: 6, fontSize: 11, margin: '4px 0', overflowX: 'auto' }}>
                              {ep.response}
                            </pre>
                          </div>
                          {ep.method === 'GET' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); tryEndpoint(ep.path); }}
                              disabled={loadingEndpoint === ep.path.replace(':id', '1')}
                              style={{ padding: '6px 14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                            >
                              {loadingEndpoint === ep.path.replace(':id', '1') ? 'Loading...' : 'Try it!'}
                            </button>
                          )}
                          {liveData[ep.path] && (
                            <div style={{ marginTop: 10 }}>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: liveData[ep.path].status === 200 ? '#22c55e' : '#dc2626' }}>
                                  Status: {liveData[ep.path].status}
                                </span>
                                <span style={{ fontSize: 10, color: '#94a3b8' }}>{liveData[ep.path].time}</span>
                              </div>
                              <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 12, borderRadius: 6, fontSize: 11, maxHeight: 200, overflow: 'auto' }}>
                                {JSON.stringify(liveData[ep.path].data, null, 2).substring(0, 2000)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );

      case 1: // Live Explorer
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Live API Explorer — Try All Endpoints</h3>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>Click "Fetch" to get live data from the running backend server.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 12 }}>
              {API_ENDPOINTS.flatMap(cat => cat.endpoints).filter(ep => ep.method === 'GET').map((ep, i) => {
                const actualPath = ep.path.replace(':id', '1');
                return (
                  <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ background: '#22c55e', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>GET</span>
                      <code style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{ep.path}</code>
                      <button
                        onClick={() => tryEndpoint(ep.path)}
                        disabled={loadingEndpoint === actualPath}
                        style={{ padding: '4px 12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                      >
                        {loadingEndpoint === actualPath ? '...' : 'Fetch'}
                      </button>
                    </div>
                    {liveData[ep.path] && (
                      <pre style={{ padding: 12, fontSize: 10, maxHeight: 150, overflow: 'auto', margin: 0, background: '#f8fafc', color: '#334155' }}>
                        {JSON.stringify(liveData[ep.path].data, null, 2).substring(0, 1000)}
                        {JSON.stringify(liveData[ep.path].data, null, 2).length > 1000 ? '\n... (truncated)' : ''}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 2: // HTTP Status Codes
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>HTTP Status Codes Reference</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', width: 80 }}>Code</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', width: 160 }}>Name</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Description</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>When in Banking API</th>
                </tr>
              </thead>
              <tbody>
                {HTTP_STATUS_CODES.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 4, fontWeight: 700, fontSize: 13,
                        background: s.code < 300 ? '#dcfce7' : s.code < 400 ? '#e0f2fe' : s.code < 500 ? '#fef3c7' : '#fef2f2',
                        color: s.code < 300 ? '#166534' : s.code < 400 ? '#0369a1' : s.code < 500 ? '#92400e' : '#dc2626'
                      }}>{s.code}</span>
                    </td>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: '8px 12px', color: '#64748b' }}>{s.desc}</td>
                    <td style={{ padding: '8px 12px', color: '#475569', fontSize: 12 }}>{s.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 3: // Swagger/OpenAPI
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Swagger / OpenAPI Specification</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12, marginBottom: 24 }}>
              {SWAGGER_FEATURES.map((f, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16 }}>
                  <strong style={{ fontSize: 14, color: '#1e293b' }}>{f.feature}</strong>
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <h4 style={{ marginBottom: 12 }}>OpenAPI 3.0 Spec Example (Banking API)</h4>
            <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 18, borderRadius: 8, fontSize: 12, lineHeight: 1.5, overflowX: 'auto' }}>
{`openapi: 3.0.3
info:
  title: Banking QA Testing API
  description: REST API for Banking QA Testing Dashboard
  version: 1.0.0
  contact:
    name: QA Team
    email: qa@banking.com

servers:
  - url: http://localhost:3001
    description: Development server

paths:
  /api/customers:
    get:
      summary: List all customers
      tags: [Customers]
      responses:
        '200':
          description: List of customers
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Customer'

  /api/customers/{id}:
    get:
      summary: Get customer by ID
      tags: [Customers]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Customer details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Customer'
        '404':
          description: Customer not found

  /api/test-cases:
    get:
      summary: List test cases with filters
      tags: [Test Management]
      parameters:
        - name: module
          in: query
          schema:
            type: string
            enum: [registration, authentication, accounts, transfers,
                   bill_payment, loans, cards, security]
        - name: status
          in: query
          schema:
            type: string
            enum: [pass, fail, blocked, not_run]
        - name: priority
          in: query
          schema:
            type: string
            enum: [P0, P1, P2, P3]
      responses:
        '200':
          description: Filtered list of test cases

  /api/sql/execute:
    post:
      summary: Execute SQL query
      tags: [Tools]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [query]
              properties:
                query:
                  type: string
                  example: "SELECT * FROM customers LIMIT 5"
      responses:
        '200':
          description: Query results
        '400':
          description: SQL execution failed

components:
  schemas:
    Customer:
      type: object
      properties:
        id:
          type: integer
        first_name:
          type: string
        last_name:
          type: string
        email:
          type: string
          format: email
        phone:
          type: string
        date_of_birth:
          type: string
          format: date
        address:
          type: string
        city:
          type: string
        state:
          type: string
        pan_number:
          type: string
        aadhaar_number:
          type: string
        created_at:
          type: string
          format: date-time`}
            </pre>
          </div>
        );

      case 4: // Comparison
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Postman vs Swagger vs SoapUI</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Feature</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Postman</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Swagger</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>SoapUI</th>
                </tr>
              </thead>
              <tbody>
                {POSTMAN_VS_SWAGGER.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{r.feature}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: '#475569' }}>{r.postman}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: '#475569' }}>{r.swagger}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: '#475569' }}>{r.soapui}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ margin: '24px 0 12px' }}>When to Use Which Tool</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              {[
                { tool: 'Postman', color: '#f97316', scenarios: ['Quick API exploration & debugging', 'Manual API testing in sprints', 'API automation with Newman CLI', 'Team collaboration & shared collections', 'Environment-based testing (dev/staging/prod)'] },
                { tool: 'Swagger/OpenAPI', color: '#22c55e', scenarios: ['API-first design approach', 'Auto-generating interactive documentation', 'Contract testing (consumer-driven)', 'Client SDK code generation', 'API governance & versioning'] },
                { tool: 'SoapUI', color: '#3b82f6', scenarios: ['SOAP web service testing (WSDL)', 'Complex multi-step test scenarios', 'Data-driven testing with Groovy', 'Enterprise API testing with JDBC', 'Mock services for development'] }
              ].map((t, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: t.color, color: '#fff', fontWeight: 700, fontSize: 15 }}>{t.tool}</div>
                  <ul style={{ margin: 0, padding: '12px 18px 12px 30px' }}>
                    {t.scenarios.map((s, j) => <li key={j} style={{ marginBottom: 6, fontSize: 13, color: '#475569' }}>{s}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>API Documentation & Swagger</h2>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
          Complete API reference with live explorer, HTTP status codes, OpenAPI spec, and tool comparison (Postman vs Swagger vs SoapUI)
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20, borderBottom: '2px solid #e2e8f0', paddingBottom: 12 }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: activeTab === i ? '#4f46e5' : '#f1f5f9',
              color: activeTab === i ? '#fff' : '#475569'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}

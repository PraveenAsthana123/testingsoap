const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DB_PATH = path.join(__dirname, '..', 'database', 'banking.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');

// ========================================
// DASHBOARD STATS
// ========================================
app.get('/api/dashboard/stats', (req, res) => {
  const customers = db.prepare('SELECT COUNT(*) as count FROM customers').get();
  const accounts = db.prepare('SELECT COUNT(*) as count FROM accounts').get();
  const transactions = db.prepare('SELECT COUNT(*) as count FROM transactions').get();
  const totalTestCases = db.prepare('SELECT COUNT(*) as count FROM test_cases').get();
  const passedTests = db.prepare("SELECT COUNT(*) as count FROM test_cases WHERE status='pass'").get();
  const failedTests = db.prepare("SELECT COUNT(*) as count FROM test_cases WHERE status='fail'").get();
  const blockedTests = db.prepare("SELECT COUNT(*) as count FROM test_cases WHERE status='blocked'").get();
  const notRunTests = db.prepare("SELECT COUNT(*) as count FROM test_cases WHERE status='not_run'").get();
  const openDefects = db.prepare("SELECT COUNT(*) as count FROM defects WHERE status IN ('open','in_progress','reopened')").get();
  const totalBalance = db.prepare("SELECT SUM(balance) as total FROM accounts WHERE status='active'").get();

  res.json({
    customers: customers.count,
    accounts: accounts.count,
    transactions: transactions.count,
    totalTestCases: totalTestCases.count,
    passedTests: passedTests.count,
    failedTests: failedTests.count,
    blockedTests: blockedTests.count,
    notRunTests: notRunTests.count,
    openDefects: openDefects.count,
    totalBalance: totalBalance.total
  });
});

// ========================================
// CUSTOMERS
// ========================================
app.get('/api/customers', (req, res) => {
  const rows = db.prepare('SELECT * FROM customers ORDER BY id').all();
  res.json(rows);
});

app.get('/api/customers/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Customer not found' });
  res.json(row);
});

// ========================================
// ACCOUNTS
// ========================================
app.get('/api/accounts', (req, res) => {
  const rows = db.prepare(`
    SELECT a.*, c.first_name || ' ' || c.last_name as customer_name
    FROM accounts a JOIN customers c ON a.customer_id = c.id
    ORDER BY a.id
  `).all();
  res.json(rows);
});

app.get('/api/accounts/:id', (req, res) => {
  const row = db.prepare(`
    SELECT a.*, c.first_name || ' ' || c.last_name as customer_name
    FROM accounts a JOIN customers c ON a.customer_id = c.id
    WHERE a.id = ?
  `).get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Account not found' });
  res.json(row);
});

// ========================================
// TRANSACTIONS
// ========================================
app.get('/api/transactions', (req, res) => {
  const rows = db.prepare(`
    SELECT t.*,
      fa.account_number as from_account_number,
      ta.account_number as to_account_number
    FROM transactions t
    LEFT JOIN accounts fa ON t.from_account_id = fa.id
    LEFT JOIN accounts ta ON t.to_account_id = ta.id
    ORDER BY t.created_at DESC
  `).all();
  res.json(rows);
});

// ========================================
// LOANS
// ========================================
app.get('/api/loans', (req, res) => {
  const rows = db.prepare(`
    SELECT l.*, c.first_name || ' ' || c.last_name as customer_name
    FROM loans l JOIN customers c ON l.customer_id = c.id
    ORDER BY l.id
  `).all();
  res.json(rows);
});

// ========================================
// CARDS
// ========================================
app.get('/api/cards', (req, res) => {
  const rows = db.prepare(`
    SELECT cr.*, c.first_name || ' ' || c.last_name as customer_name
    FROM cards cr JOIN customers c ON cr.customer_id = c.id
    ORDER BY cr.id
  `).all();
  res.json(rows);
});

// ========================================
// BILL PAYMENTS
// ========================================
app.get('/api/bill-payments', (req, res) => {
  const rows = db.prepare(`
    SELECT bp.*, c.first_name || ' ' || c.last_name as customer_name
    FROM bill_payments bp JOIN customers c ON bp.customer_id = c.id
    ORDER BY bp.payment_date DESC
  `).all();
  res.json(rows);
});

// ========================================
// TEST SUITES
// ========================================
app.get('/api/test-suites', (req, res) => {
  const rows = db.prepare(`
    SELECT ts.*,
      (SELECT COUNT(*) FROM test_cases tc WHERE tc.test_suite_id = ts.id) as total_cases,
      (SELECT COUNT(*) FROM test_cases tc WHERE tc.test_suite_id = ts.id AND tc.status='pass') as passed,
      (SELECT COUNT(*) FROM test_cases tc WHERE tc.test_suite_id = ts.id AND tc.status='fail') as failed,
      (SELECT COUNT(*) FROM test_cases tc WHERE tc.test_suite_id = ts.id AND tc.status='not_run') as not_run
    FROM test_suites ts ORDER BY ts.id
  `).all();
  res.json(rows);
});

// ========================================
// TEST CASES
// ========================================
app.get('/api/test-cases', (req, res) => {
  const { module, status, category, priority } = req.query;
  let sql = 'SELECT * FROM test_cases WHERE 1=1';
  const params = [];
  if (module) { sql += ' AND module = ?'; params.push(module); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (priority) { sql += ' AND priority = ?'; params.push(priority); }
  sql += ' ORDER BY id';
  const rows = db.prepare(sql).all(...params);
  res.json(rows);
});

app.get('/api/test-cases/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM test_cases WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Test case not found' });
  res.json(row);
});

app.put('/api/test-cases/:id/execute', (req, res) => {
  const { status, actual_result, notes, execution_time_ms } = req.body;
  const stmt = db.prepare(`
    UPDATE test_cases
    SET status = ?, actual_result = ?, notes = ?, execution_time_ms = ?, executed_at = datetime('now')
    WHERE id = ?
  `);
  stmt.run(status, actual_result, notes, execution_time_ms, req.params.id);
  const updated = db.prepare('SELECT * FROM test_cases WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// ========================================
// TEST RUNS
// ========================================
app.get('/api/test-runs', (req, res) => {
  const rows = db.prepare('SELECT * FROM test_runs ORDER BY run_date DESC').all();
  res.json(rows);
});

// ========================================
// OPERATION FLOW LOG
// ========================================
app.get('/api/operation-flow', (req, res) => {
  const { test_case_id } = req.query;
  let sql = `
    SELECT ofl.*, tc.test_case_id as tc_code, tc.title as tc_title
    FROM operation_flow_log ofl
    LEFT JOIN test_cases tc ON ofl.test_case_id = tc.id
  `;
  const params = [];
  if (test_case_id) { sql += ' WHERE ofl.test_case_id = ?'; params.push(test_case_id); }
  sql += ' ORDER BY ofl.timestamp DESC';
  const rows = db.prepare(sql).all(...params);
  res.json(rows);
});

// ========================================
// DEFECTS
// ========================================
app.get('/api/defects', (req, res) => {
  const rows = db.prepare(`
    SELECT d.*, tc.test_case_id as tc_code, tc.title as tc_title
    FROM defects d
    LEFT JOIN test_cases tc ON d.test_case_id = tc.id
    ORDER BY d.created_at DESC
  `).all();
  res.json(rows);
});

// ========================================
// AUDIT LOG
// ========================================
app.get('/api/audit-log', (req, res) => {
  const rows = db.prepare(`
    SELECT al.*, c.first_name || ' ' || c.last_name as customer_name
    FROM audit_log al
    LEFT JOIN customers c ON al.customer_id = c.id
    ORDER BY al.created_at DESC
  `).all();
  res.json(rows);
});

// ========================================
// SQL EDITOR - Execute queries
// ========================================
app.post('/api/sql/execute', (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) {
    return res.status(400).json({ detail: 'Query is required' });
  }

  const trimmed = query.trim().toUpperCase();
  const isSelect = trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA') || trimmed.startsWith('EXPLAIN');

  try {
    const startTime = Date.now();
    if (isSelect) {
      const rows = db.prepare(query).all();
      const duration = Date.now() - startTime;
      res.json({
        success: true,
        type: 'query',
        rows: rows,
        rowCount: rows.length,
        columns: rows.length > 0 ? Object.keys(rows[0]) : [],
        duration_ms: duration
      });
    } else {
      const result = db.prepare(query).run();
      const duration = Date.now() - startTime;
      res.json({
        success: true,
        type: 'statement',
        changes: result.changes,
        lastInsertRowid: result.lastInsertRowid,
        duration_ms: duration
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
      detail: 'SQL execution failed'
    });
  }
});

// ========================================
// DATABASE SCHEMA INFO
// ========================================
app.get('/api/schema', (req, res) => {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
  const schema = tables.map(t => {
    const columns = db.prepare(`PRAGMA table_info('${t.name}')`).all();
    const rowCount = db.prepare(`SELECT COUNT(*) as count FROM "${t.name}"`).get();
    return { name: t.name, columns, rowCount: rowCount.count };
  });
  res.json(schema);
});

// ========================================
// NOTIFICATIONS
// ========================================
app.get('/api/notifications', (req, res) => {
  const rows = db.prepare(`
    SELECT n.*, c.first_name || ' ' || c.last_name as customer_name
    FROM notifications n JOIN customers c ON n.customer_id = c.id
    ORDER BY n.created_at DESC
  `).all();
  res.json(rows);
});

// ========================================
// LOGIN SESSIONS
// ========================================
app.get('/api/sessions', (req, res) => {
  const rows = db.prepare(`
    SELECT ls.*, c.first_name || ' ' || c.last_name as customer_name
    FROM login_sessions ls JOIN customers c ON ls.customer_id = c.id
    ORDER BY ls.login_at DESC
  `).all();
  res.json(rows);
});

// ========================================
// AUTOMATION TEST EXECUTION TRACKING
// ========================================

// Create automation tracking tables
db.exec(`
  CREATE TABLE IF NOT EXISTS automation_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id TEXT UNIQUE NOT NULL,
    suite_name TEXT NOT NULL,
    profile TEXT DEFAULT 'default',
    browser TEXT DEFAULT 'chrome',
    environment TEXT DEFAULT 'QA',
    status TEXT DEFAULT 'running',
    total_tests INTEGER DEFAULT 0,
    passed INTEGER DEFAULT 0,
    failed INTEGER DEFAULT 0,
    skipped INTEGER DEFAULT 0,
    pass_rate REAL DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    started_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    triggered_by TEXT DEFAULT 'manual',
    report_path TEXT
  );

  CREATE TABLE IF NOT EXISTS automation_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id TEXT NOT NULL,
    scenario_name TEXT NOT NULL,
    feature TEXT NOT NULL,
    tags TEXT,
    status TEXT NOT NULL,
    duration_ms INTEGER DEFAULT 0,
    error_message TEXT,
    screenshot_path TEXT,
    step_details TEXT,
    executed_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (run_id) REFERENCES automation_runs(run_id)
  );

  CREATE INDEX IF NOT EXISTS idx_auto_runs_status ON automation_runs(status);
  CREATE INDEX IF NOT EXISTS idx_auto_runs_date ON automation_runs(started_at);
  CREATE INDEX IF NOT EXISTS idx_auto_results_run ON automation_results(run_id);
  CREATE INDEX IF NOT EXISTS idx_auto_results_status ON automation_results(status);
`);

// Get all automation runs
app.get('/api/automation/runs', (req, res) => {
  const { status, profile, limit } = req.query;
  let sql = 'SELECT * FROM automation_runs WHERE 1=1';
  const params = [];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (profile) { sql += ' AND profile = ?'; params.push(profile); }
  sql += ' ORDER BY started_at DESC';
  if (limit) { sql += ' LIMIT ?'; params.push(parseInt(limit)); }
  const rows = db.prepare(sql).all(...params);
  res.json(rows);
});

// Get single automation run
app.get('/api/automation/runs/:runId', (req, res) => {
  const run = db.prepare('SELECT * FROM automation_runs WHERE run_id = ?').get(req.params.runId);
  if (!run) return res.status(404).json({ detail: 'Run not found' });
  const results = db.prepare('SELECT * FROM automation_results WHERE run_id = ? ORDER BY executed_at').all(req.params.runId);
  res.json({ ...run, results });
});

// Create new automation run
app.post('/api/automation/runs', (req, res) => {
  const { suite_name, profile, browser, environment, triggered_by } = req.body;
  const run_id = 'RUN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  db.prepare(`
    INSERT INTO automation_runs (run_id, suite_name, profile, browser, environment, triggered_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(run_id, suite_name, profile || 'default', browser || 'chrome', environment || 'QA', triggered_by || 'dashboard');
  const run = db.prepare('SELECT * FROM automation_runs WHERE run_id = ?').get(run_id);
  res.status(201).json(run);
});

// Update automation run (complete it)
app.put('/api/automation/runs/:runId', (req, res) => {
  const { status, total_tests, passed, failed, skipped, duration_ms, report_path } = req.body;
  const pass_rate = total_tests > 0 ? (passed / total_tests * 100) : 0;
  db.prepare(`
    UPDATE automation_runs
    SET status = ?, total_tests = ?, passed = ?, failed = ?, skipped = ?,
        pass_rate = ?, duration_ms = ?, completed_at = datetime('now'), report_path = ?
    WHERE run_id = ?
  `).run(status, total_tests, passed, failed, skipped, pass_rate, duration_ms, report_path, req.params.runId);
  const run = db.prepare('SELECT * FROM automation_runs WHERE run_id = ?').get(req.params.runId);
  res.json(run);
});

// Add test result to a run
app.post('/api/automation/runs/:runId/results', (req, res) => {
  const { scenario_name, feature, tags, status, duration_ms, error_message, screenshot_path, step_details } = req.body;
  db.prepare(`
    INSERT INTO automation_results (run_id, scenario_name, feature, tags, status, duration_ms, error_message, screenshot_path, step_details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.params.runId, scenario_name, feature, tags, status, duration_ms || 0, error_message, screenshot_path, step_details);

  // Update run counts
  const counts = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) as passed,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
      SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) as skipped
    FROM automation_results WHERE run_id = ?
  `).get(req.params.runId);

  db.prepare(`
    UPDATE automation_runs SET total_tests = ?, passed = ?, failed = ?, skipped = ?,
    pass_rate = CASE WHEN ? > 0 THEN (CAST(? AS REAL) / ? * 100) ELSE 0 END
    WHERE run_id = ?
  `).run(counts.total, counts.passed, counts.failed, counts.skipped,
         counts.total, counts.passed, counts.total, req.params.runId);

  res.status(201).json({ message: 'Result added' });
});

// Get automation stats (dashboard summary)
app.get('/api/automation/stats', (req, res) => {
  const totalRuns = db.prepare('SELECT COUNT(*) as count FROM automation_runs').get();
  const lastRun = db.prepare('SELECT * FROM automation_runs ORDER BY started_at DESC LIMIT 1').get();
  const avgPassRate = db.prepare('SELECT AVG(pass_rate) as avg FROM automation_runs WHERE status = ?').get('completed');
  const totalScenarios = db.prepare('SELECT COUNT(*) as count FROM automation_results').get();
  const passedScenarios = db.prepare("SELECT COUNT(*) as count FROM automation_results WHERE status = 'passed'").get();
  const failedScenarios = db.prepare("SELECT COUNT(*) as count FROM automation_results WHERE status = 'failed'").get();

  const runsByProfile = db.prepare(`
    SELECT profile, COUNT(*) as count, AVG(pass_rate) as avg_pass_rate
    FROM automation_runs WHERE status = 'completed'
    GROUP BY profile
  `).all();

  const recentRuns = db.prepare(`
    SELECT run_id, suite_name, profile, status, total_tests, passed, failed, pass_rate,
           duration_ms, started_at, completed_at
    FROM automation_runs ORDER BY started_at DESC LIMIT 10
  `).all();

  res.json({
    totalRuns: totalRuns.count,
    lastRun,
    avgPassRate: avgPassRate ? avgPassRate.avg : 0,
    totalScenarios: totalScenarios.count,
    passedScenarios: passedScenarios.count,
    failedScenarios: failedScenarios.count,
    runsByProfile,
    recentRuns
  });
});

// Delete automation run
app.delete('/api/automation/runs/:runId', (req, res) => {
  db.prepare('DELETE FROM automation_results WHERE run_id = ?').run(req.params.runId);
  db.prepare('DELETE FROM automation_runs WHERE run_id = ?').run(req.params.runId);
  res.json({ message: 'Run deleted' });
});

// ========================================
// HEALTH CHECK
// ========================================
app.get('/api/health', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

// ========================================
// REPORTS SUMMARY
// ========================================
app.get('/api/reports/summary', (req, res) => {
  const testStats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pass' THEN 1 ELSE 0 END) as passed,
      SUM(CASE WHEN status = 'fail' THEN 1 ELSE 0 END) as failed,
      SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) as blocked,
      SUM(CASE WHEN status = 'not_run' THEN 1 ELSE 0 END) as not_run
    FROM test_cases
  `).get();

  const defectStats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count,
      SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_count
    FROM defects
  `).get();

  const autoStats = db.prepare(`
    SELECT COUNT(*) as total_runs, AVG(pass_rate) as avg_pass_rate
    FROM automation_runs WHERE status = 'completed'
  `).get();

  res.json({
    testCases: testStats,
    defects: defectStats,
    automation: autoStats
  });
});

// ========================================
// SERVE REACT STATIC BUILD (Production)
// ========================================
const fs = require('fs');
const REACT_BUILD_PATH = path.join(__dirname, '..', 'testing-dashboard', 'build');

if (fs.existsSync(REACT_BUILD_PATH)) {
  // Serve static files from the React build directory
  app.use(express.static(REACT_BUILD_PATH));

  // Catch-all route: serve index.html for any non-API route (SPA routing)
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(REACT_BUILD_PATH, 'index.html'));
    } else {
      next();
    }
  });

  console.log(`Serving React build from: ${REACT_BUILD_PATH}`);
}

app.listen(PORT, () => {
  console.log(`Banking Test API running on http://localhost:${PORT}`);
  console.log(`Database: ${DB_PATH}`);
});

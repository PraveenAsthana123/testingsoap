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

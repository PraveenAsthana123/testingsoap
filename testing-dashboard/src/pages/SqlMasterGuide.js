import React, { useState, useCallback } from 'react';

// ─── STYLES ───────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '24px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#e0e0e0',
  },
  header: {
    textAlign: 'center',
    marginBottom: 28,
  },
  h1: {
    fontSize: 32,
    color: '#ffffff',
    margin: 0,
    letterSpacing: 1,
  },
  subtitle: {
    color: '#4ecca3',
    fontSize: 15,
    marginTop: 6,
  },
  badge: {
    display: 'inline-block',
    background: '#4ecca3',
    color: '#0a0a1a',
    borderRadius: 12,
    padding: '2px 10px',
    fontSize: 12,
    fontWeight: 700,
    marginLeft: 8,
    verticalAlign: 'middle',
  },
  tabBar: {
    display: 'flex',
    gap: 6,
    overflowX: 'auto',
    paddingBottom: 8,
    marginBottom: 20,
    borderBottom: '1px solid rgba(78,204,163,0.3)',
  },
  tab: (active) => ({
    padding: '10px 18px',
    background: active ? '#4ecca3' : 'transparent',
    color: active ? '#0a0a1a' : '#e0e0e0',
    border: active ? 'none' : '1px solid rgba(78,204,163,0.3)',
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    fontWeight: active ? 700 : 400,
    fontSize: 13,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  }),
  card: {
    background: '#0f3460',
    border: '1px solid rgba(78,204,163,0.3)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#4ecca3',
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 6,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  cardDesc: {
    color: '#b0b0b0',
    fontSize: 13,
    marginBottom: 12,
  },
  codeWrap: {
    position: 'relative',
    background: '#0a0a1a',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    overflowX: 'auto',
  },
  code: {
    fontFamily: "'Fira Code', 'Consolas', monospace",
    fontSize: 13,
    color: '#4ecca3',
    whiteSpace: 'pre',
    lineHeight: 1.6,
  },
  copyBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'rgba(78,204,163,0.15)',
    color: '#4ecca3',
    border: '1px solid rgba(78,204,163,0.4)',
    borderRadius: 6,
    padding: '4px 12px',
    fontSize: 11,
    cursor: 'pointer',
  },
  expandBtn: {
    background: 'none',
    border: 'none',
    color: '#4ecca3',
    cursor: 'pointer',
    fontSize: 18,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
  },
  sectionDesc: {
    color: '#b0b0b0',
    fontSize: 14,
    marginBottom: 18,
  },
};

// ─── CODE BLOCK with copy ─────────────────────────────────
function CodeBlock({ sql }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(sql).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [sql]);
  return (
    <div style={S.codeWrap}>
      <button style={S.copyBtn} onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>
      <pre style={{ margin: 0 }}><code style={S.code}>{sql}</code></pre>
    </div>
  );
}

// ─── EXPANDABLE CARD ──────────────────────────────────────
function ExCard({ title, desc, sql, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen !== false);
  return (
    <div style={S.card}>
      <div style={S.cardTitle} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span style={S.expandBtn}>{open ? '\u25B2' : '\u25BC'}</span>
      </div>
      {open && (
        <>
          {desc && <div style={S.cardDesc}>{desc}</div>}
          <CodeBlock sql={sql} />
        </>
      )}
    </div>
  );
}

// ─── TAB DATA ────────────────────────────────────────────
const TABS = [
  { id: 0, label: 'Basic Queries & SELECT' },
  { id: 1, label: 'All Types of JOINs' },
  { id: 2, label: 'Aggregates & GROUP BY' },
  { id: 3, label: 'Subqueries & CTEs' },
  { id: 4, label: 'Stored Procedures' },
  { id: 5, label: 'Functions' },
  { id: 6, label: 'SQL Jobs & Scheduling' },
  { id: 7, label: 'Window Functions' },
  { id: 8, label: 'Triggers & Indexes' },
  { id: 9, label: 'Performance Tuning' },
];

// ═══════════════════════════════════════════════════════════
// TAB 0 : BASIC QUERIES
// ═══════════════════════════════════════════════════════════
const tab0 = [
  {
    title: '1. Active Savings Accounts with High Balance',
    desc: 'SELECT with WHERE, AND, ORDER BY to find high-value savings accounts.',
    sql: `-- Find all active savings accounts with balance > 10000
SELECT account_id,
       customer_name,
       balance,
       account_type,
       branch_code
FROM accounts
WHERE account_type = 'SAVINGS'
  AND status       = 'ACTIVE'
  AND balance      > 10000
ORDER BY balance DESC;`,
  },
  {
    title: '2. Customer Search with LIKE & OR',
    desc: 'Pattern matching for customer lookup by name or email.',
    sql: `-- Search customers by partial name or email domain
SELECT customer_id, first_name, last_name, email, phone
FROM customers
WHERE (first_name LIKE 'Ram%' OR last_name LIKE '%Kumar%')
   OR email LIKE '%@icicibank.com'
ORDER BY last_name, first_name;`,
  },
  {
    title: '3. Transactions in a Date Range with BETWEEN',
    desc: 'BETWEEN operator for date-range filtering on transactions.',
    sql: `-- Fetch transactions for Q1 2025
SELECT transaction_id, account_id, amount,
       transaction_type, txn_date, status
FROM transactions
WHERE txn_date BETWEEN '2025-01-01' AND '2025-03-31'
  AND status = 'SUCCESS'
ORDER BY txn_date DESC
LIMIT 500 OFFSET 0;`,
  },
  {
    title: '4. Customers Missing KYC Documents (IS NULL)',
    desc: 'LEFT JOIN + IS NULL pattern to find missing related records.',
    sql: `-- Customers who have NOT submitted KYC documents
SELECT c.customer_id, c.first_name, c.last_name, c.email
FROM customers c
LEFT JOIN kyc_documents k ON c.customer_id = k.customer_id
WHERE k.document_id IS NULL
ORDER BY c.customer_id;`,
  },
  {
    title: '5. Account Types with IN Clause',
    desc: 'IN operator to filter specific account types.',
    sql: `-- Fetch only current, savings, and salary accounts
SELECT account_id, customer_id, account_type,
       balance, opened_date, branch_code
FROM accounts
WHERE account_type IN ('CURRENT', 'SAVINGS', 'SALARY')
  AND status = 'ACTIVE'
ORDER BY account_type, balance DESC;`,
  },
  {
    title: '6. Transaction Risk Category with CASE WHEN',
    desc: 'CASE expression to classify transactions by amount.',
    sql: `-- Classify transactions into risk categories
SELECT transaction_id,
       account_id,
       amount,
       transaction_type,
       CASE
         WHEN amount > 500000 THEN 'CRITICAL'
         WHEN amount > 100000 THEN 'HIGH'
         WHEN amount >  50000 THEN 'MEDIUM'
         WHEN amount >  10000 THEN 'LOW'
         ELSE 'STANDARD'
       END AS risk_category,
       CASE
         WHEN transaction_type = 'WIRE' AND amount > 200000
           THEN 'AML_REVIEW_REQUIRED'
         ELSE 'AUTO_APPROVED'
       END AS compliance_flag
FROM transactions
WHERE txn_date >= '2025-01-01'
ORDER BY amount DESC;`,
  },
  {
    title: '7. DISTINCT Account Types per Branch',
    desc: 'DISTINCT to list unique combinations.',
    sql: `-- Unique account types offered at each branch
SELECT DISTINCT branch_code, account_type
FROM accounts
WHERE status = 'ACTIVE'
ORDER BY branch_code, account_type;`,
  },
  {
    title: '8. Aliases and Calculated Columns',
    desc: 'Column aliases and computed fields for loan analysis.',
    sql: `-- Loan summary with computed EMI and total payable
SELECT l.loan_id,
       c.first_name || ' ' || c.last_name AS customer_name,
       l.loan_amount                       AS principal,
       l.interest_rate                     AS rate_pct,
       l.tenure_months                     AS tenure,
       ROUND(l.loan_amount * l.interest_rate / 100 / 12, 2) AS monthly_interest,
       ROUND(l.loan_amount / l.tenure_months, 2)            AS principal_emi,
       l.loan_amount + (l.loan_amount * l.interest_rate * l.tenure_months / 100 / 12)
                                           AS total_payable
FROM loans l
JOIN customers c ON l.customer_id = c.customer_id
WHERE l.status = 'ACTIVE'
ORDER BY total_payable DESC;`,
  },
  {
    title: '9. NOT Operator & Negative Filters',
    desc: 'Excluding specific records with NOT, <>, and NOT IN.',
    sql: `-- Accounts that are NOT closed and NOT dormant
SELECT account_id, customer_id, balance, status, last_txn_date
FROM accounts
WHERE status NOT IN ('CLOSED', 'DORMANT', 'FROZEN')
  AND balance <> 0
  AND account_type <> 'INTERNAL'
ORDER BY last_txn_date DESC
LIMIT 100;`,
  },
  {
    title: '10. Pagination with LIMIT and OFFSET',
    desc: 'Paginated customer listing for API endpoints.',
    sql: `-- Page 3 of customers (50 per page)
SELECT customer_id, first_name, last_name,
       email, phone, created_at
FROM customers
WHERE status = 'ACTIVE'
ORDER BY created_at DESC
LIMIT 50 OFFSET 100;

-- Count total for pagination metadata
SELECT COUNT(*) AS total_customers
FROM customers
WHERE status = 'ACTIVE';`,
  },
];

// ═══════════════════════════════════════════════════════════
// TAB 1 : ALL TYPES OF JOINs
// ═══════════════════════════════════════════════════════════
const tab1 = [
  {
    title: '1. INNER JOIN - Customers with Accounts',
    desc: 'Returns only rows that match in both tables.',
    sql: `-- INNER JOIN: Only matching records
--   +----------+     +----------+
--   |Customers |     | Accounts |
--   |   +------+-----+------+  |
--   |   |  MATCH      MATCH |  |
--   |   +------+-----+------+  |
--   +----------+     +----------+

SELECT c.customer_id,
       c.first_name || ' ' || c.last_name AS name,
       a.account_id,
       a.account_type,
       a.balance
FROM customers c
INNER JOIN accounts a ON c.customer_id = a.customer_id
WHERE a.status = 'ACTIVE'
ORDER BY a.balance DESC;`,
  },
  {
    title: '2. LEFT JOIN - All Customers (with or without Loans)',
    desc: 'All left-table rows, NULLs where right-table has no match.',
    sql: `-- LEFT JOIN: All customers + loans (NULL if no loan)
--   +----------+     +----------+
--   |##########|     |  Loans   |
--   |#####+----+-----+----+    |
--   |#####|MATCH      MATCH    |
--   |#####+----+-----+----+    |
--   +----------+     +----------+
--   (All left rows kept, right NULLs filled)

SELECT c.customer_id,
       c.first_name,
       c.last_name,
       l.loan_id,
       l.loan_type,
       COALESCE(l.outstanding_balance, 0) AS outstanding
FROM customers c
LEFT JOIN loans l ON c.customer_id = l.customer_id
ORDER BY outstanding DESC;`,
  },
  {
    title: '3. RIGHT JOIN - All Accounts with Optional Nominees',
    desc: 'All right-table rows, NULLs where left has no match.',
    sql: `-- RIGHT JOIN: All accounts + nominee if exists
--   +----------+     +----------+
--   | Nominees |     |##########|
--   |    +-----+-----+#####    |
--   |    |MATCH       #####    |
--   |    +-----+-----+#####    |
--   +----------+     +----------+
--   (All right rows kept)

SELECT n.nominee_name,
       n.relationship,
       a.account_id,
       a.account_type,
       a.balance
FROM nominees n
RIGHT JOIN accounts a ON n.account_id = a.account_id
ORDER BY a.account_id;`,
  },
  {
    title: '4. FULL OUTER JOIN - Customers and Accounts (All Records)',
    desc: 'All rows from both tables, NULLs where unmatched.',
    sql: `-- FULL OUTER JOIN: All customers + all accounts
--   +----------+     +----------+
--   |##########|     |##########|
--   |#####+----+-----+----+####|
--   |#####|MATCH      MATCH####|
--   |#####+----+-----+----+####|
--   +----------+     +----------+
--   (Everything from both sides)

SELECT COALESCE(c.customer_id, a.customer_id) AS cust_id,
       c.first_name,
       a.account_id,
       a.account_type,
       a.balance
FROM customers c
FULL OUTER JOIN accounts a ON c.customer_id = a.customer_id
ORDER BY cust_id;`,
  },
  {
    title: '5. CROSS JOIN - Products x Branches Matrix',
    desc: 'Cartesian product: every product paired with every branch.',
    sql: `-- CROSS JOIN: All products x All branches
--   Products: {Savings, Current, FD}
--   Branches: {Mumbai, Delhi, Chennai}
--   Result:   3 x 3 = 9 rows

SELECT p.product_name,
       b.branch_name,
       b.branch_code,
       p.interest_rate,
       p.min_balance
FROM products p
CROSS JOIN branches b
ORDER BY p.product_name, b.branch_name;`,
  },
  {
    title: '6. SELF JOIN - Employee Reporting Hierarchy',
    desc: 'Join a table to itself for hierarchical data.',
    sql: `-- SELF JOIN: Employee + Manager hierarchy
--   Employee Table joined to itself:
--     emp.manager_id  --->  mgr.employee_id

SELECT e.employee_id,
       e.full_name      AS employee_name,
       e.designation,
       m.full_name      AS manager_name,
       m.designation     AS manager_title,
       e.branch_code
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id
ORDER BY m.full_name, e.full_name;`,
  },
  {
    title: '7. SELF JOIN - Customer Referral Chain',
    desc: 'Track who referred whom using self-referencing foreign key.',
    sql: `-- SELF JOIN: Referral chain in banking
SELECT c.customer_id,
       c.first_name || ' ' || c.last_name AS customer,
       r.first_name || ' ' || r.last_name AS referred_by,
       c.account_opened_date
FROM customers c
LEFT JOIN customers r ON c.referred_by_id = r.customer_id
WHERE c.referred_by_id IS NOT NULL
ORDER BY c.account_opened_date DESC;`,
  },
  {
    title: '8. Multiple JOINs - Customer Full Portfolio',
    desc: 'Chain several JOINs to build a comprehensive customer view.',
    sql: `-- Multiple JOINs: Full customer portfolio
SELECT c.customer_id,
       c.first_name || ' ' || c.last_name AS name,
       a.account_id,
       a.account_type,
       a.balance,
       l.loan_id,
       l.loan_type,
       l.outstanding_balance,
       fd.fd_number,
       fd.deposit_amount,
       fd.maturity_date,
       b.branch_name
FROM customers c
LEFT JOIN accounts a       ON c.customer_id = a.customer_id
LEFT JOIN loans l          ON c.customer_id = l.customer_id
LEFT JOIN fixed_deposits fd ON c.customer_id = fd.customer_id
LEFT JOIN branches b       ON a.branch_id   = b.branch_id
WHERE c.status = 'ACTIVE'
ORDER BY c.customer_id;`,
  },
  {
    title: '9. NATURAL JOIN - Matching on Common Column Names',
    desc: 'Implicit join on identically-named columns (use with caution).',
    sql: `-- NATURAL JOIN: Joins on all same-named columns
-- Use cautiously - may join on unintended columns

SELECT customer_id, first_name, account_id,
       account_type, balance
FROM customers
NATURAL JOIN accounts
WHERE balance > 5000
ORDER BY balance DESC;

-- Equivalent explicit version (preferred):
SELECT c.customer_id, c.first_name, a.account_id,
       a.account_type, a.balance
FROM customers c
JOIN accounts a ON c.customer_id = a.customer_id
WHERE a.balance > 5000;`,
  },
];

// ═══════════════════════════════════════════════════════════
// TAB 2 : AGGREGATES & GROUP BY
// ═══════════════════════════════════════════════════════════
const tab2 = [
  {
    title: '1. Branch-wise Deposit Summary',
    desc: 'COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING.',
    sql: `-- Branch-wise deposit summary
SELECT b.branch_name,
       COUNT(a.account_id)    AS total_accounts,
       SUM(a.balance)         AS total_deposits,
       ROUND(AVG(a.balance),2) AS avg_balance,
       MIN(a.balance)         AS min_balance,
       MAX(a.balance)         AS highest_balance
FROM accounts a
JOIN branches b ON a.branch_id = b.branch_id
WHERE a.status = 'ACTIVE'
GROUP BY b.branch_name
HAVING SUM(a.balance) > 1000000
ORDER BY total_deposits DESC;`,
  },
  {
    title: '2. Monthly Transaction Volume',
    desc: 'Date-based aggregation for transaction analytics.',
    sql: `-- Monthly transaction volume and value
SELECT EXTRACT(YEAR FROM txn_date)  AS txn_year,
       EXTRACT(MONTH FROM txn_date) AS txn_month,
       transaction_type,
       COUNT(*)                     AS txn_count,
       SUM(amount)                  AS total_amount,
       ROUND(AVG(amount), 2)       AS avg_amount
FROM transactions
WHERE txn_date >= '2024-01-01'
  AND status = 'SUCCESS'
GROUP BY EXTRACT(YEAR FROM txn_date),
         EXTRACT(MONTH FROM txn_date),
         transaction_type
ORDER BY txn_year, txn_month, transaction_type;`,
  },
  {
    title: '3. ROLLUP - Hierarchical Totals',
    desc: 'ROLLUP generates sub-totals and grand total rows.',
    sql: `-- ROLLUP: Branch > Account Type > Subtotals > Grand Total
SELECT b.branch_name,
       a.account_type,
       COUNT(*)        AS num_accounts,
       SUM(a.balance)  AS total_balance
FROM accounts a
JOIN branches b ON a.branch_id = b.branch_id
GROUP BY ROLLUP(b.branch_name, a.account_type)
ORDER BY b.branch_name, a.account_type;

-- Result includes:
-- (branch, type)  -> detail rows
-- (branch, NULL)  -> subtotal per branch
-- (NULL,   NULL)  -> grand total`,
  },
  {
    title: '4. CUBE - Multi-Dimensional Analysis',
    desc: 'CUBE generates subtotals for every combination of grouped columns.',
    sql: `-- CUBE: Every combination of branch and product
SELECT b.branch_name,
       p.product_name,
       COUNT(a.account_id)    AS accounts,
       SUM(a.balance)         AS total_balance
FROM accounts a
JOIN branches b  ON a.branch_id  = b.branch_id
JOIN products p  ON a.product_id = p.product_id
GROUP BY CUBE(b.branch_name, p.product_name)
ORDER BY b.branch_name, p.product_name;`,
  },
  {
    title: '5. GROUPING SETS - Custom Aggregation',
    desc: 'Specify exact grouping combinations you need.',
    sql: `-- GROUPING SETS: Only specific aggregation levels
SELECT b.branch_name,
       a.account_type,
       EXTRACT(YEAR FROM a.opened_date) AS open_year,
       COUNT(*)       AS account_count,
       SUM(a.balance) AS total_balance
FROM accounts a
JOIN branches b ON a.branch_id = b.branch_id
GROUP BY GROUPING SETS (
  (b.branch_name, a.account_type),
  (b.branch_name, EXTRACT(YEAR FROM a.opened_date)),
  (b.branch_name),
  ()
)
ORDER BY b.branch_name;`,
  },
  {
    title: '6. Loan Default Rate by Product',
    desc: 'Conditional aggregation for calculating rates and percentages.',
    sql: `-- Loan default rate by product type
SELECT loan_type,
       COUNT(*)                          AS total_loans,
       SUM(CASE WHEN status = 'DEFAULT'
           THEN 1 ELSE 0 END)           AS defaulted,
       SUM(CASE WHEN status = 'ACTIVE'
           THEN 1 ELSE 0 END)           AS active,
       ROUND(
         SUM(CASE WHEN status = 'DEFAULT' THEN 1 ELSE 0 END) * 100.0
         / COUNT(*), 2
       )                                 AS default_rate_pct,
       SUM(CASE WHEN status = 'DEFAULT'
           THEN outstanding_balance ELSE 0 END) AS npa_amount
FROM loans
GROUP BY loan_type
ORDER BY default_rate_pct DESC;`,
  },
  {
    title: '7. Customer Segment by Balance Tier',
    desc: 'Aggregate customers into balance tiers for segmentation.',
    sql: `-- Customer segmentation by total balance tier
SELECT
  CASE
    WHEN total_bal >= 1000000 THEN 'PLATINUM'
    WHEN total_bal >=  500000 THEN 'GOLD'
    WHEN total_bal >=  100000 THEN 'SILVER'
    ELSE 'STANDARD'
  END AS segment,
  COUNT(*)                    AS customer_count,
  SUM(total_bal)              AS segment_balance,
  ROUND(AVG(total_bal), 2)   AS avg_balance
FROM (
  SELECT customer_id, SUM(balance) AS total_bal
  FROM accounts
  WHERE status = 'ACTIVE'
  GROUP BY customer_id
) cust_totals
GROUP BY
  CASE
    WHEN total_bal >= 1000000 THEN 'PLATINUM'
    WHEN total_bal >=  500000 THEN 'GOLD'
    WHEN total_bal >=  100000 THEN 'SILVER'
    ELSE 'STANDARD'
  END
ORDER BY segment_balance DESC;`,
  },
  {
    title: '8. Daily Cash Flow Analysis',
    desc: 'Aggregate credits and debits to compute net cash flow per day.',
    sql: `-- Daily cash flow: credits - debits = net flow
SELECT txn_date,
       SUM(CASE WHEN transaction_type = 'CREDIT'
           THEN amount ELSE 0 END)    AS total_credits,
       SUM(CASE WHEN transaction_type = 'DEBIT'
           THEN amount ELSE 0 END)    AS total_debits,
       SUM(CASE WHEN transaction_type = 'CREDIT'
           THEN amount ELSE -amount END) AS net_flow,
       COUNT(*)                        AS txn_count
FROM transactions
WHERE txn_date BETWEEN '2025-01-01' AND '2025-01-31'
  AND status = 'SUCCESS'
GROUP BY txn_date
ORDER BY txn_date;`,
  },
];

// ═══════════════════════════════════════════════════════════
// TAB 3 : SUBQUERIES & CTEs
// ═══════════════════════════════════════════════════════════
const tab3 = [
  {
    title: '1. Scalar Subquery - Above-Average Balance',
    desc: 'Subquery returns a single value used in the WHERE clause.',
    sql: `-- Accounts with balance above the overall average
SELECT a.account_id,
       c.first_name || ' ' || c.last_name AS customer,
       a.balance,
       a.account_type
FROM accounts a
JOIN customers c ON a.customer_id = c.customer_id
WHERE a.balance > (SELECT AVG(balance) FROM accounts WHERE status = 'ACTIVE')
ORDER BY a.balance DESC;`,
  },
  {
    title: '2. Correlated Subquery - Latest Transaction per Account',
    desc: 'Subquery references the outer query for each row.',
    sql: `-- Latest transaction for each account (correlated)
SELECT t.transaction_id,
       t.account_id,
       t.amount,
       t.txn_date,
       t.transaction_type
FROM transactions t
WHERE t.txn_date = (
  SELECT MAX(t2.txn_date)
  FROM transactions t2
  WHERE t2.account_id = t.account_id
)
ORDER BY t.account_id;`,
  },
  {
    title: '3. EXISTS - Customers Who Made Transactions This Month',
    desc: 'EXISTS checks whether the subquery returns any rows.',
    sql: `-- Active customers who transacted this month
SELECT c.customer_id, c.first_name, c.last_name, c.email
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM transactions t
  JOIN accounts a ON t.account_id = a.account_id
  WHERE a.customer_id = c.customer_id
    AND t.txn_date >= DATE_TRUNC('month', CURRENT_DATE)
)
ORDER BY c.last_name;`,
  },
  {
    title: '4. NOT EXISTS - Dormant Accounts (No Transactions in 6 Months)',
    desc: 'NOT EXISTS to find accounts with no recent activity.',
    sql: `-- Accounts with NO transactions in the last 6 months
SELECT a.account_id, a.account_type, a.balance,
       c.first_name || ' ' || c.last_name AS customer
FROM accounts a
JOIN customers c ON a.customer_id = c.customer_id
WHERE a.status = 'ACTIVE'
  AND NOT EXISTS (
    SELECT 1
    FROM transactions t
    WHERE t.account_id = a.account_id
      AND t.txn_date >= CURRENT_DATE - INTERVAL '6 months'
  )
ORDER BY a.balance DESC;`,
  },
  {
    title: '5. IN with Subquery - Branches with High-Value Customers',
    desc: 'Filter using a list generated by a subquery.',
    sql: `-- Branches that have at least one customer with balance > 1M
SELECT branch_id, branch_name, city, region
FROM branches
WHERE branch_id IN (
  SELECT DISTINCT a.branch_id
  FROM accounts a
  WHERE a.balance > 1000000
    AND a.status = 'ACTIVE'
)
ORDER BY branch_name;`,
  },
  {
    title: '6. CTE - Monthly Spending Report',
    desc: 'WITH clause for readable, reusable query blocks.',
    sql: `-- CTE: Monthly spending by customer
WITH monthly_spending AS (
  SELECT a.customer_id,
         EXTRACT(MONTH FROM t.txn_date) AS month,
         SUM(t.amount)                  AS total_spent,
         COUNT(*)                       AS txn_count
  FROM transactions t
  JOIN accounts a ON t.account_id = a.account_id
  WHERE t.transaction_type = 'DEBIT'
    AND t.txn_date >= '2025-01-01'
  GROUP BY a.customer_id, EXTRACT(MONTH FROM t.txn_date)
),
customer_avg AS (
  SELECT customer_id,
         ROUND(AVG(total_spent), 2) AS avg_monthly_spend
  FROM monthly_spending
  GROUP BY customer_id
)
SELECT c.first_name || ' ' || c.last_name AS customer,
       ms.month,
       ms.total_spent,
       ca.avg_monthly_spend,
       CASE WHEN ms.total_spent > ca.avg_monthly_spend * 1.5
            THEN 'ABOVE_NORMAL' ELSE 'NORMAL' END AS flag
FROM monthly_spending ms
JOIN customer_avg ca ON ms.customer_id = ca.customer_id
JOIN customers c     ON ms.customer_id = c.customer_id
ORDER BY c.last_name, ms.month;`,
  },
  {
    title: '7. Recursive CTE - Employee Hierarchy Tree',
    desc: 'Recursive WITH for traversing hierarchical (tree) data.',
    sql: `-- Recursive CTE: Full org chart from CEO down
WITH RECURSIVE org_chart AS (
  -- Anchor: top-level (no manager)
  SELECT employee_id, full_name, designation,
         manager_id, 1 AS level,
         full_name AS path
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive: employees reporting to someone above
  SELECT e.employee_id, e.full_name, e.designation,
         e.manager_id, o.level + 1,
         o.path || ' > ' || e.full_name
  FROM employees e
  JOIN org_chart o ON e.manager_id = o.employee_id
)
SELECT level,
       REPEAT('  ', level - 1) || full_name AS tree_name,
       designation,
       path
FROM org_chart
ORDER BY path;`,
  },
  {
    title: '8. CTE + Subquery - Top 3 Customers per Branch',
    desc: 'Combining CTEs with ranking subqueries for top-N per group.',
    sql: `-- Top 3 customers by balance in each branch
WITH ranked AS (
  SELECT a.branch_id,
         c.customer_id,
         c.first_name || ' ' || c.last_name AS name,
         SUM(a.balance)   AS total_balance,
         ROW_NUMBER() OVER (
           PARTITION BY a.branch_id
           ORDER BY SUM(a.balance) DESC
         ) AS rank_in_branch
  FROM accounts a
  JOIN customers c ON a.customer_id = c.customer_id
  WHERE a.status = 'ACTIVE'
  GROUP BY a.branch_id, c.customer_id, c.first_name, c.last_name
)
SELECT b.branch_name,
       r.name,
       r.total_balance,
       r.rank_in_branch
FROM ranked r
JOIN branches b ON r.branch_id = b.branch_id
WHERE r.rank_in_branch <= 3
ORDER BY b.branch_name, r.rank_in_branch;`,
  },
  {
    title: '9. Subquery in SELECT - Running Comparison',
    desc: 'Inline subquery to compare each row against an aggregate.',
    sql: `-- Each account balance vs branch average
SELECT a.account_id,
       a.balance,
       b.branch_name,
       (SELECT ROUND(AVG(a2.balance), 2)
        FROM accounts a2
        WHERE a2.branch_id = a.branch_id
          AND a2.status = 'ACTIVE') AS branch_avg,
       ROUND(a.balance - (
         SELECT AVG(a2.balance)
         FROM accounts a2
         WHERE a2.branch_id = a.branch_id
           AND a2.status = 'ACTIVE'
       ), 2) AS diff_from_avg
FROM accounts a
JOIN branches b ON a.branch_id = b.branch_id
WHERE a.status = 'ACTIVE'
ORDER BY diff_from_avg DESC;`,
  },
];

// ═══════════════════════════════════════════════════════════
// TAB 4 : STORED PROCEDURES
// ═══════════════════════════════════════════════════════════
const tab4 = [
  {
    title: '1. Fund Transfer Stored Procedure',
    desc: 'Complete inter-account fund transfer with validation, audit, and rollback.',
    sql: `CREATE PROCEDURE sp_fund_transfer(
  @from_account  VARCHAR(20),
  @to_account    VARCHAR(20),
  @amount        DECIMAL(15,2),
  @initiated_by  VARCHAR(50),
  @transfer_ref  VARCHAR(50) OUTPUT
)
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRY
    BEGIN TRANSACTION;

    -- 1. Validate source account exists and is active
    DECLARE @src_balance DECIMAL(15,2), @src_status VARCHAR(20);
    SELECT @src_balance = balance, @src_status = status
    FROM accounts WHERE account_id = @from_account;

    IF @src_balance IS NULL
      THROW 50001, 'Source account not found', 1;
    IF @src_status <> 'ACTIVE'
      THROW 50002, 'Source account is not active', 1;
    IF @src_balance < @amount
      THROW 50003, 'Insufficient balance', 1;
    IF @amount <= 0
      THROW 50004, 'Transfer amount must be positive', 1;

    -- 2. Validate destination account
    IF NOT EXISTS (SELECT 1 FROM accounts
                   WHERE account_id = @to_account AND status = 'ACTIVE')
      THROW 50005, 'Destination account not found or inactive', 1;

    -- 3. Debit source account
    UPDATE accounts
    SET balance = balance - @amount,
        last_txn_date = GETDATE()
    WHERE account_id = @from_account;

    -- 4. Credit destination account
    UPDATE accounts
    SET balance = balance + @amount,
        last_txn_date = GETDATE()
    WHERE account_id = @to_account;

    -- 5. Generate unique reference
    SET @transfer_ref = 'TXN' + FORMAT(GETDATE(), 'yyyyMMddHHmmss')
                        + RIGHT(NEWID(), 4);

    -- 6. Log both legs of the transaction
    INSERT INTO transactions
      (account_id, transaction_type, amount, ref_no,
       txn_date, status, description)
    VALUES
      (@from_account, 'DEBIT',  @amount, @transfer_ref,
       GETDATE(), 'SUCCESS', 'Transfer to ' + @to_account),
      (@to_account,   'CREDIT', @amount, @transfer_ref,
       GETDATE(), 'SUCCESS', 'Transfer from ' + @from_account);

    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    INSERT INTO transaction_errors(error_msg, error_date, initiated_by)
    VALUES(ERROR_MESSAGE(), GETDATE(), @initiated_by);
    THROW;
  END CATCH
END;`,
  },
  {
    title: '2. Calculate Daily Interest',
    desc: 'Computes and credits daily interest for all savings accounts.',
    sql: `CREATE PROCEDURE sp_calculate_daily_interest
  @account_type VARCHAR(20) = 'SAVINGS',
  @run_date     DATE = NULL
AS
BEGIN
  SET NOCOUNT ON;
  IF @run_date IS NULL SET @run_date = CAST(GETDATE() AS DATE);

  BEGIN TRY
    BEGIN TRANSACTION;

    -- Interest = balance * annual_rate / 365
    UPDATE a
    SET a.accrued_interest = a.accrued_interest
        + ROUND(a.balance * p.interest_rate / 100.0 / 365, 2)
    FROM accounts a
    JOIN products p ON a.product_id = p.product_id
    WHERE a.account_type = @account_type
      AND a.status = 'ACTIVE'
      AND a.balance > 0;

    -- Log the run
    INSERT INTO interest_runs(run_date, account_type, status)
    VALUES(@run_date, @account_type, 'COMPLETED');

    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    INSERT INTO interest_runs(run_date, account_type, status, error_msg)
    VALUES(@run_date, @account_type, 'FAILED', ERROR_MESSAGE());
    THROW;
  END CATCH
END;`,
  },
  {
    title: '3. Close Account Procedure',
    desc: 'Account closure with balance settlement and audit trail.',
    sql: `CREATE PROCEDURE sp_close_account
  @account_id    VARCHAR(20),
  @closed_by     VARCHAR(50),
  @reason        VARCHAR(200),
  @settlement_account VARCHAR(20) = NULL
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRY
    BEGIN TRANSACTION;

    DECLARE @balance DECIMAL(15,2);
    SELECT @balance = balance FROM accounts
    WHERE account_id = @account_id AND status = 'ACTIVE';

    IF @balance IS NULL
      THROW 50010, 'Account not found or already closed', 1;

    -- Transfer remaining balance if > 0
    IF @balance > 0
    BEGIN
      IF @settlement_account IS NULL
        THROW 50011, 'Settlement account required for non-zero balance', 1;

      UPDATE accounts SET balance = balance + @balance
      WHERE account_id = @settlement_account;

      INSERT INTO transactions
        (account_id, transaction_type, amount, txn_date, status, description)
      VALUES
        (@account_id, 'DEBIT', @balance, GETDATE(), 'SUCCESS',
         'Account closure - balance transferred to ' + @settlement_account);
    END

    -- Mark account as closed
    UPDATE accounts
    SET status = 'CLOSED', balance = 0,
        closed_date = GETDATE(), closed_by = @closed_by
    WHERE account_id = @account_id;

    -- Audit entry
    INSERT INTO audit_trail(table_name, record_id, operation,
                            changed_by, changed_at, details)
    VALUES('accounts', @account_id, 'CLOSE',
           @closed_by, GETDATE(), @reason);

    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
  END CATCH
END;`,
  },
  {
    title: '4. Generate Monthly Statement',
    desc: 'Produces a monthly account statement with opening/closing balance.',
    sql: `CREATE PROCEDURE sp_generate_statement
  @account_id VARCHAR(20),
  @month      INT,
  @year       INT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @start_date DATE = DATEFROMPARTS(@year, @month, 1);
  DECLARE @end_date   DATE = EOMONTH(@start_date);

  -- Opening balance: balance at start of month
  DECLARE @opening DECIMAL(15,2);
  SELECT @opening = COALESCE(
    (SELECT TOP 1 running_balance
     FROM transaction_ledger
     WHERE account_id = @account_id
       AND txn_date < @start_date
     ORDER BY txn_date DESC, transaction_id DESC),
    (SELECT balance FROM accounts WHERE account_id = @account_id)
  );

  -- Transaction list
  SELECT ROW_NUMBER() OVER (ORDER BY txn_date) AS sl_no,
         txn_date,
         description,
         ref_no,
         CASE WHEN transaction_type = 'CREDIT'
              THEN amount ELSE NULL END        AS credit,
         CASE WHEN transaction_type = 'DEBIT'
              THEN amount ELSE NULL END        AS debit,
         running_balance
  FROM transaction_ledger
  WHERE account_id = @account_id
    AND txn_date BETWEEN @start_date AND @end_date
  ORDER BY txn_date, transaction_id;

  -- Summary
  SELECT @opening AS opening_balance,
         SUM(CASE WHEN transaction_type = 'CREDIT'
             THEN amount ELSE 0 END) AS total_credits,
         SUM(CASE WHEN transaction_type = 'DEBIT'
             THEN amount ELSE 0 END) AS total_debits,
         @opening
           + SUM(CASE WHEN transaction_type = 'CREDIT'
                 THEN amount ELSE -amount END) AS closing_balance,
         COUNT(*)                       AS total_transactions
  FROM transaction_ledger
  WHERE account_id = @account_id
    AND txn_date BETWEEN @start_date AND @end_date;
END;`,
  },
  {
    title: '5. KYC Verification Procedure',
    desc: 'KYC document validation and customer status update.',
    sql: `CREATE PROCEDURE sp_verify_kyc
  @customer_id   INT,
  @document_type VARCHAR(30),  -- 'AADHAAR','PAN','PASSPORT','VOTER_ID'
  @document_no   VARCHAR(50),
  @verified_by   VARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRY
    BEGIN TRANSACTION;

    -- Check if document already exists
    IF EXISTS (SELECT 1 FROM kyc_documents
               WHERE customer_id = @customer_id
                 AND document_type = @document_type)
    BEGIN
      UPDATE kyc_documents
      SET document_number = @document_no,
          verification_status = 'VERIFIED',
          verified_by = @verified_by,
          verified_date = GETDATE()
      WHERE customer_id = @customer_id
        AND document_type = @document_type;
    END
    ELSE
    BEGIN
      INSERT INTO kyc_documents
        (customer_id, document_type, document_number,
         verification_status, verified_by, verified_date)
      VALUES
        (@customer_id, @document_type, @document_no,
         'VERIFIED', @verified_by, GETDATE());
    END

    -- Check if all required docs are verified
    DECLARE @verified_count INT;
    SELECT @verified_count = COUNT(*)
    FROM kyc_documents
    WHERE customer_id = @customer_id
      AND verification_status = 'VERIFIED';

    -- If at least PAN + AADHAAR verified, mark KYC complete
    IF @verified_count >= 2
      UPDATE customers
      SET kyc_status = 'COMPLETE', kyc_date = GETDATE()
      WHERE customer_id = @customer_id;

    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
  END CATCH
END;`,
  },
  {
    title: '6. Loan EMI Calculation Procedure',
    desc: 'Calculate EMI schedule using reducing balance method.',
    sql: `CREATE PROCEDURE sp_loan_emi_schedule
  @loan_id INT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @principal DECIMAL(15,2), @rate DECIMAL(5,4),
          @tenure INT, @emi DECIMAL(15,2);

  SELECT @principal = loan_amount,
         @rate = interest_rate / 100.0 / 12,  -- monthly rate
         @tenure = tenure_months
  FROM loans WHERE loan_id = @loan_id;

  IF @principal IS NULL
    THROW 50020, 'Loan not found', 1;

  -- EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  SET @emi = ROUND(
    @principal * @rate * POWER(1 + @rate, @tenure)
    / (POWER(1 + @rate, @tenure) - 1), 2
  );

  -- Generate schedule
  ;WITH emi_schedule AS (
    SELECT 1 AS installment,
           @emi AS emi_amount,
           ROUND(@principal * @rate, 2)          AS interest_part,
           ROUND(@emi - @principal * @rate, 2)   AS principal_part,
           ROUND(@principal - (@emi - @principal * @rate), 2) AS remaining
    UNION ALL
    SELECT installment + 1,
           @emi,
           ROUND(remaining * @rate, 2),
           ROUND(@emi - remaining * @rate, 2),
           ROUND(remaining - (@emi - remaining * @rate), 2)
    FROM emi_schedule
    WHERE installment < @tenure
  )
  SELECT installment,
         emi_amount,
         interest_part,
         principal_part,
         remaining AS outstanding_principal
  FROM emi_schedule
  OPTION (MAXRECURSION 600);
END;`,
  },
  {
    title: '7. Bulk Transaction Processing with Cursor',
    desc: 'Process pending transactions one by one using a cursor.',
    sql: `CREATE PROCEDURE sp_process_pending_transactions
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @txn_id INT, @acct VARCHAR(20),
          @amount DECIMAL(15,2), @type VARCHAR(10);
  DECLARE @processed INT = 0, @failed INT = 0;

  DECLARE txn_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT transaction_id, account_id, amount, transaction_type
    FROM transactions
    WHERE status = 'PENDING'
    ORDER BY txn_date;

  OPEN txn_cursor;
  FETCH NEXT FROM txn_cursor INTO @txn_id, @acct, @amount, @type;

  WHILE @@FETCH_STATUS = 0
  BEGIN
    BEGIN TRY
      BEGIN TRANSACTION;

      IF @type = 'DEBIT'
        UPDATE accounts SET balance = balance - @amount
        WHERE account_id = @acct AND balance >= @amount;
      ELSE
        UPDATE accounts SET balance = balance + @amount
        WHERE account_id = @acct;

      IF @@ROWCOUNT = 0
        THROW 50030, 'Update failed or insufficient balance', 1;

      UPDATE transactions SET status = 'SUCCESS' WHERE transaction_id = @txn_id;
      SET @processed += 1;

      COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
      IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
      UPDATE transactions SET status = 'FAILED',
             error_message = ERROR_MESSAGE()
      WHERE transaction_id = @txn_id;
      SET @failed += 1;
    END CATCH

    FETCH NEXT FROM txn_cursor INTO @txn_id, @acct, @amount, @type;
  END

  CLOSE txn_cursor;
  DEALLOCATE txn_cursor;

  SELECT @processed AS processed_count, @failed AS failed_count;
END;`,
  },
];

// ═══════════════════════════════════════════════════════════
// TAB 5 : FUNCTIONS
// ═══════════════════════════════════════════════════════════
const tab5 = [
  {
    title: '1. Scalar Function - Compound Interest Calculator',
    desc: 'Calculate compound interest given principal, rate, and tenure.',
    sql: `CREATE FUNCTION fn_compound_interest(
  @principal         DECIMAL(15,2),
  @annual_rate       DECIMAL(5,2),
  @years             INT,
  @compounds_per_yr  INT = 4  -- quarterly by default
)
RETURNS DECIMAL(15,2)
AS
BEGIN
  RETURN ROUND(
    @principal * POWER(
      (1 + @annual_rate / 100.0 / @compounds_per_yr),
      @compounds_per_yr * @years
    ), 2
  );
END;

-- Usage:
SELECT dbo.fn_compound_interest(100000, 7.5, 5, 4) AS maturity_amount;
-- Returns: 144,994.83`,
  },
  {
    title: '2. Scalar Function - Mask PAN / Card Number',
    desc: 'Security function to mask sensitive card numbers for display.',
    sql: `CREATE FUNCTION fn_mask_card(@card_number VARCHAR(19))
RETURNS VARCHAR(19)
AS
BEGIN
  IF LEN(@card_number) < 8
    RETURN '****';
  RETURN LEFT(@card_number, 4)
       + REPLICATE('*', LEN(@card_number) - 8)
       + RIGHT(@card_number, 4);
END;

-- Usage:
SELECT dbo.fn_mask_card('4532015112830366') AS masked;
-- Returns: 4532********0366

-- Mask Aadhaar number
CREATE FUNCTION fn_mask_aadhaar(@aadhaar VARCHAR(12))
RETURNS VARCHAR(12)
AS
BEGIN
  RETURN 'XXXX-XXXX-' + RIGHT(@aadhaar, 4);
END;

-- Usage:
SELECT dbo.fn_mask_aadhaar('987654321098') AS masked;
-- Returns: XXXX-XXXX-1098`,
  },
  {
    title: '3. Scalar Function - Loan Eligibility Check',
    desc: 'Determine if customer qualifies for a loan based on income and obligations.',
    sql: `CREATE FUNCTION fn_loan_eligibility(
  @monthly_income    DECIMAL(15,2),
  @existing_emi      DECIMAL(15,2),
  @requested_emi     DECIMAL(15,2),
  @credit_score      INT
)
RETURNS VARCHAR(50)
AS
BEGIN
  DECLARE @foir DECIMAL(5,2);  -- Fixed Obligation to Income Ratio
  SET @foir = (@existing_emi + @requested_emi) / @monthly_income * 100;

  IF @credit_score < 650
    RETURN 'REJECTED - Low credit score';
  IF @foir > 60
    RETURN 'REJECTED - FOIR exceeds 60%';
  IF @foir > 50
    RETURN 'CONDITIONAL - High FOIR (' + CAST(@foir AS VARCHAR) + '%)';
  RETURN 'ELIGIBLE - FOIR: ' + CAST(@foir AS VARCHAR) + '%';
END;

-- Usage:
SELECT dbo.fn_loan_eligibility(80000, 15000, 20000, 720);
-- Returns: ELIGIBLE - FOIR: 43.75%`,
  },
  {
    title: '4. Table-Valued Function - Customer Portfolio',
    desc: 'Inline TVF returning all products held by a customer.',
    sql: `CREATE FUNCTION fn_customer_portfolio(@customer_id INT)
RETURNS TABLE
AS
RETURN (
  SELECT 'ACCOUNT'  AS product_type,
         a.account_id     AS product_id,
         a.account_type   AS product_name,
         a.balance         AS value,
         a.status,
         a.opened_date     AS start_date,
         NULL              AS end_date
  FROM accounts a
  WHERE a.customer_id = @customer_id

  UNION ALL

  SELECT 'LOAN',
         CAST(l.loan_id AS VARCHAR),
         l.loan_type,
         l.outstanding_balance,
         l.status,
         l.disbursed_date,
         l.maturity_date
  FROM loans l
  WHERE l.customer_id = @customer_id

  UNION ALL

  SELECT 'FIXED_DEPOSIT',
         fd.fd_number,
         'FD - ' + CAST(fd.tenure_months AS VARCHAR) + ' months',
         fd.deposit_amount,
         fd.status,
         fd.booked_date,
         fd.maturity_date
  FROM fixed_deposits fd
  WHERE fd.customer_id = @customer_id
);

-- Usage:
SELECT * FROM fn_customer_portfolio(1001) ORDER BY product_type;`,
  },
  {
    title: '5. Scalar Function - Format Indian Currency',
    desc: 'Format a number in Indian numbering system (lakhs, crores).',
    sql: `CREATE FUNCTION fn_format_inr(@amount DECIMAL(18,2))
RETURNS VARCHAR(30)
AS
BEGIN
  DECLARE @result VARCHAR(30);
  DECLARE @int_part BIGINT = CAST(@amount AS BIGINT);
  DECLARE @dec_part VARCHAR(3) = RIGHT(CAST(@amount * 100 AS BIGINT), 2);

  IF @int_part < 1000
    SET @result = CAST(@int_part AS VARCHAR);
  ELSE IF @int_part < 100000
    SET @result = CAST(@int_part / 1000 AS VARCHAR)
               + ',' + RIGHT('000' + CAST(@int_part % 1000 AS VARCHAR), 3);
  ELSE IF @int_part < 10000000
    SET @result = CAST(@int_part / 100000 AS VARCHAR)
               + ',' + RIGHT('00' + CAST((@int_part % 100000)/1000 AS VARCHAR), 2)
               + ',' + RIGHT('000' + CAST(@int_part % 1000 AS VARCHAR), 3);
  ELSE
    SET @result = CAST(@int_part / 10000000 AS VARCHAR)
               + ',' + RIGHT('00' + CAST((@int_part%10000000)/100000 AS VARCHAR), 2)
               + ',' + RIGHT('00' + CAST((@int_part%100000)/1000 AS VARCHAR), 2)
               + ',' + RIGHT('000' + CAST(@int_part % 1000 AS VARCHAR), 3);

  RETURN 'Rs. ' + @result + '.' + @dec_part;
END;

-- Usage:
SELECT dbo.fn_format_inr(1234567.89);
-- Returns: Rs. 12,34,567.89`,
  },
  {
    title: '6. Table-Valued Function - Branch Performance Report',
    desc: 'Multi-column report for branch-level KPIs.',
    sql: `CREATE FUNCTION fn_branch_performance(@branch_id INT, @as_of DATE)
RETURNS TABLE
AS
RETURN (
  SELECT b.branch_name,
         b.city,
         (SELECT COUNT(*) FROM accounts
          WHERE branch_id = @branch_id AND status = 'ACTIVE')
           AS active_accounts,
         (SELECT SUM(balance) FROM accounts
          WHERE branch_id = @branch_id AND status = 'ACTIVE')
           AS total_deposits,
         (SELECT COUNT(*) FROM loans
          WHERE branch_id = @branch_id AND status = 'ACTIVE')
           AS active_loans,
         (SELECT SUM(outstanding_balance) FROM loans
          WHERE branch_id = @branch_id AND status = 'ACTIVE')
           AS total_outstanding,
         (SELECT SUM(outstanding_balance) FROM loans
          WHERE branch_id = @branch_id AND status = 'DEFAULT')
           AS npa_amount,
         (SELECT COUNT(DISTINCT customer_id) FROM accounts
          WHERE branch_id = @branch_id AND opened_date >= @as_of - 30)
           AS new_customers_30d
  FROM branches b
  WHERE b.branch_id = @branch_id
);

-- Usage:
SELECT * FROM fn_branch_performance(101, '2025-06-15');`,
  },
  {
    title: '7. Scalar Function - Calculate Age from DOB',
    desc: 'Common utility: precise age calculation for KYC and eligibility.',
    sql: `CREATE FUNCTION fn_calculate_age(@dob DATE)
RETURNS INT
AS
BEGIN
  RETURN DATEDIFF(YEAR, @dob, GETDATE())
       - CASE WHEN DATEADD(YEAR,
                DATEDIFF(YEAR, @dob, GETDATE()), @dob) > GETDATE()
              THEN 1 ELSE 0 END;
END;

-- Usage: Check if customer is eligible (age >= 18)
SELECT customer_id, first_name, date_of_birth,
       dbo.fn_calculate_age(date_of_birth) AS age,
       CASE WHEN dbo.fn_calculate_age(date_of_birth) >= 18
            THEN 'ELIGIBLE' ELSE 'MINOR' END AS status
FROM customers;`,
  },
  {
    title: '8. Scalar Function - IFSC Code Validator',
    desc: 'Validate Indian bank IFSC code format.',
    sql: `CREATE FUNCTION fn_validate_ifsc(@ifsc VARCHAR(11))
RETURNS VARCHAR(20)
AS
BEGIN
  -- IFSC format: 4 alpha + 0 + 6 alphanumeric
  -- Example: SBIN0001234, HDFC0002345
  IF LEN(@ifsc) <> 11
    RETURN 'INVALID_LENGTH';
  IF @ifsc NOT LIKE '[A-Z][A-Z][A-Z][A-Z]0[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]'
    RETURN 'INVALID_FORMAT';
  IF LEFT(@ifsc, 4) NOT IN (
    SELECT bank_code FROM bank_master WHERE status = 'ACTIVE'
  )
    RETURN 'UNKNOWN_BANK';
  RETURN 'VALID';
END;

-- Usage:
SELECT dbo.fn_validate_ifsc('SBIN0001234') AS result;
-- Returns: VALID`,
  },
];

// ═══════════════════════════════════════════════════════════
// TAB 6 : SQL JOBS & SCHEDULING
// ═══════════════════════════════════════════════════════════
const tab6 = [
  {
    title: '1. Daily Interest Calculation Job',
    desc: 'Scheduled nightly job to compute and accrue daily interest.',
    sql: `-- Create SQL Agent Job: Daily Interest Calculation
EXEC msdb.dbo.sp_add_job
  @job_name = N'Daily_Interest_Calculation',
  @enabled = 1,
  @description = N'Calculate daily interest for all savings accounts';

-- Step 1: Calculate interest
EXEC msdb.dbo.sp_add_jobstep
  @job_name   = N'Daily_Interest_Calculation',
  @step_name  = N'Calculate_Savings_Interest',
  @subsystem  = N'TSQL',
  @command    = N'EXEC sp_calculate_daily_interest @account_type = ''SAVINGS''',
  @on_success_action = 3;  -- Go to next step

-- Step 2: Calculate for Current accounts
EXEC msdb.dbo.sp_add_jobstep
  @job_name   = N'Daily_Interest_Calculation',
  @step_name  = N'Calculate_Current_Interest',
  @subsystem  = N'TSQL',
  @command    = N'EXEC sp_calculate_daily_interest @account_type = ''CURRENT''',
  @on_success_action = 3;

-- Step 3: Log completion
EXEC msdb.dbo.sp_add_jobstep
  @job_name   = N'Daily_Interest_Calculation',
  @step_name  = N'Log_Completion',
  @subsystem  = N'TSQL',
  @command    = N'INSERT INTO job_log(job_name, status, run_date)
                  VALUES(''Daily_Interest_Calculation'', ''SUCCESS'', GETDATE())';

-- Schedule: Daily at 11:00 PM
EXEC msdb.dbo.sp_add_schedule
  @schedule_name   = N'Daily_EOD_2300',
  @freq_type       = 4,       -- Daily
  @active_start_time = 230000; -- 23:00:00

EXEC msdb.dbo.sp_attach_schedule
  @job_name      = N'Daily_Interest_Calculation',
  @schedule_name = N'Daily_EOD_2300';`,
  },
  {
    title: '2. End-of-Day (EOD) Processing Job',
    desc: 'Multi-step EOD batch processing for the banking core system.',
    sql: `-- EOD Processing Job with multiple steps
EXEC msdb.dbo.sp_add_job
  @job_name = N'EOD_Processing',
  @description = N'End-of-day batch: reconciliation, interest, reports';

-- Step 1: Process pending transactions
EXEC msdb.dbo.sp_add_jobstep
  @job_name  = N'EOD_Processing',
  @step_name = N'Process_Pending_Txns',
  @command   = N'EXEC sp_process_pending_transactions',
  @on_success_action = 3,
  @on_fail_action = 2;  -- Quit with failure

-- Step 2: Reconcile GL accounts
EXEC msdb.dbo.sp_add_jobstep
  @job_name  = N'EOD_Processing',
  @step_name = N'GL_Reconciliation',
  @command   = N'EXEC sp_gl_reconciliation @run_date = NULL',
  @on_success_action = 3;

-- Step 3: Generate daily reports
EXEC msdb.dbo.sp_add_jobstep
  @job_name  = N'EOD_Processing',
  @step_name = N'Generate_Reports',
  @command   = N'EXEC sp_generate_daily_reports',
  @on_success_action = 1;  -- Quit with success

-- Schedule: Daily at 11:30 PM (after interest job)
EXEC msdb.dbo.sp_add_schedule
  @schedule_name     = N'Daily_EOD_2330',
  @freq_type         = 4,
  @active_start_time = 233000;

EXEC msdb.dbo.sp_attach_schedule
  @job_name = N'EOD_Processing', @schedule_name = N'Daily_EOD_2330';

-- Add notification on failure
EXEC msdb.dbo.sp_add_notification
  @job_name         = N'EOD_Processing',
  @operator_name    = N'DBA_Team',
  @notification_type = 1;  -- Email`,
  },
  {
    title: '3. Monthly Statement Generation Job',
    desc: 'Generate and store account statements on the 1st of every month.',
    sql: `-- Monthly Statement Generation
EXEC msdb.dbo.sp_add_job
  @job_name = N'Monthly_Statement_Generation',
  @description = N'Generate statements for all active accounts';

EXEC msdb.dbo.sp_add_jobstep
  @job_name  = N'Monthly_Statement_Generation',
  @step_name = N'Generate_Statements',
  @subsystem = N'TSQL',
  @command   = N'
DECLARE @prev_month INT = MONTH(DATEADD(MONTH, -1, GETDATE()));
DECLARE @prev_year  INT = YEAR(DATEADD(MONTH, -1, GETDATE()));

DECLARE @acct VARCHAR(20);
DECLARE acct_cur CURSOR FOR
  SELECT account_id FROM accounts WHERE status = ''ACTIVE'';

OPEN acct_cur;
FETCH NEXT FROM acct_cur INTO @acct;
WHILE @@FETCH_STATUS = 0
BEGIN
  EXEC sp_generate_statement @acct, @prev_month, @prev_year;
  FETCH NEXT FROM acct_cur INTO @acct;
END
CLOSE acct_cur;
DEALLOCATE acct_cur;
';

-- Schedule: 1st of every month at 2:00 AM
EXEC msdb.dbo.sp_add_schedule
  @schedule_name     = N'Monthly_1st_0200',
  @freq_type         = 16,     -- Monthly
  @freq_interval     = 1,      -- Day 1
  @active_start_time = 020000; -- 02:00

EXEC msdb.dbo.sp_attach_schedule
  @job_name = N'Monthly_Statement_Generation',
  @schedule_name = N'Monthly_1st_0200';`,
  },
  {
    title: '4. AML Suspicious Transaction Scan Job',
    desc: 'Scan transactions for anti-money-laundering red flags.',
    sql: `-- AML Suspicious Transaction Scan (Daily)
EXEC msdb.dbo.sp_add_job
  @job_name = N'AML_Suspicious_Txn_Scan',
  @description = N'Flag suspicious transactions for AML compliance';

EXEC msdb.dbo.sp_add_jobstep
  @job_name  = N'AML_Suspicious_Txn_Scan',
  @step_name = N'Scan_High_Value',
  @command   = N'
-- Flag 1: Single high-value transactions
INSERT INTO aml_alerts(alert_type, account_id, amount, txn_date, created_at)
SELECT ''HIGH_VALUE'', account_id, amount, txn_date, GETDATE()
FROM transactions
WHERE amount > 1000000
  AND txn_date = CAST(GETDATE()-1 AS DATE)
  AND transaction_id NOT IN (SELECT transaction_id FROM aml_alerts);

-- Flag 2: Structuring (multiple txns just under 500K)
INSERT INTO aml_alerts(alert_type, account_id, amount, txn_date, created_at)
SELECT ''STRUCTURING'', account_id, SUM(amount), CAST(GETDATE()-1 AS DATE), GETDATE()
FROM transactions
WHERE amount BETWEEN 450000 AND 499999
  AND txn_date = CAST(GETDATE()-1 AS DATE)
GROUP BY account_id
HAVING COUNT(*) >= 3;

-- Flag 3: Rapid movement (in and out same day)
INSERT INTO aml_alerts(alert_type, account_id, amount, txn_date, created_at)
SELECT ''RAPID_MOVEMENT'', t1.account_id, t1.amount,
       CAST(GETDATE()-1 AS DATE), GETDATE()
FROM transactions t1
JOIN transactions t2 ON t1.account_id = t2.account_id
  AND t1.transaction_type = ''CREDIT'' AND t2.transaction_type = ''DEBIT''
  AND ABS(t1.amount - t2.amount) < 1000
  AND t1.txn_date = t2.txn_date
  AND DATEDIFF(HOUR, t1.txn_date, t2.txn_date) < 4
WHERE t1.txn_date = CAST(GETDATE()-1 AS DATE);
',
  @on_success_action = 1;

EXEC msdb.dbo.sp_add_schedule
  @schedule_name = N'Daily_0600', @freq_type = 4,
  @active_start_time = 060000;

EXEC msdb.dbo.sp_attach_schedule
  @job_name = N'AML_Suspicious_Txn_Scan',
  @schedule_name = N'Daily_0600';`,
  },
  {
    title: '5. Data Archival Job',
    desc: 'Move old transactions to archive table and purge audit logs.',
    sql: `-- Data Archival Job (Monthly)
EXEC msdb.dbo.sp_add_job
  @job_name = N'Data_Archival',
  @description = N'Archive old transactions and purge expired audit logs';

EXEC msdb.dbo.sp_add_jobstep
  @job_name  = N'Data_Archival',
  @step_name = N'Archive_Old_Transactions',
  @command   = N'
-- Move transactions older than 2 years to archive
INSERT INTO transactions_archive
SELECT * FROM transactions
WHERE txn_date < DATEADD(YEAR, -2, GETDATE())
  AND status IN (''SUCCESS'', ''FAILED'');

DELETE FROM transactions
WHERE txn_date < DATEADD(YEAR, -2, GETDATE())
  AND status IN (''SUCCESS'', ''FAILED'');

-- Purge audit logs older than 90 days
DELETE FROM audit_trail
WHERE changed_at < DATEADD(DAY, -90, GETDATE());

-- Update statistics after large deletes
UPDATE STATISTICS transactions;
UPDATE STATISTICS audit_trail;
',
  @on_success_action = 1;

EXEC msdb.dbo.sp_add_schedule
  @schedule_name = N'Monthly_15th_0100',
  @freq_type = 16, @freq_interval = 15,
  @active_start_time = 010000;

EXEC msdb.dbo.sp_attach_schedule
  @job_name = N'Data_Archival',
  @schedule_name = N'Monthly_15th_0100';`,
  },
  {
    title: '6. Account Dormancy Check Job',
    desc: 'Weekly scan to flag accounts with no activity.',
    sql: `-- Account Dormancy Check (Weekly)
EXEC msdb.dbo.sp_add_job
  @job_name = N'Account_Dormancy_Check',
  @description = N'Flag accounts inactive for 12+ months as DORMANT';

EXEC msdb.dbo.sp_add_jobstep
  @job_name  = N'Account_Dormancy_Check',
  @step_name = N'Flag_Dormant_Accounts',
  @command   = N'
-- Identify accounts with no transactions in 12 months
UPDATE a
SET a.status = ''DORMANT'',
    a.dormant_since = GETDATE()
FROM accounts a
WHERE a.status = ''ACTIVE''
  AND NOT EXISTS (
    SELECT 1 FROM transactions t
    WHERE t.account_id = a.account_id
      AND t.txn_date >= DATEADD(MONTH, -12, GETDATE())
  )
  AND a.opened_date < DATEADD(MONTH, -12, GETDATE());

-- Notify relationship managers
INSERT INTO notifications(recipient_id, message, created_at)
SELECT rm.employee_id,
       ''Account '' + a.account_id + '' marked DORMANT'',
       GETDATE()
FROM accounts a
JOIN branches b ON a.branch_id = b.branch_id
JOIN employees rm ON b.rm_id = rm.employee_id
WHERE a.status = ''DORMANT''
  AND a.dormant_since = CAST(GETDATE() AS DATE);
';

-- Schedule: Every Sunday at 6:00 AM
EXEC msdb.dbo.sp_add_schedule
  @schedule_name = N'Weekly_Sun_0600',
  @freq_type = 8, @freq_interval = 1,
  @active_start_time = 060000;

EXEC msdb.dbo.sp_attach_schedule
  @job_name = N'Account_Dormancy_Check',
  @schedule_name = N'Weekly_Sun_0600';`,
  },
];

// ═══════════════════════════════════════════════════════════
// TAB 7 : WINDOW FUNCTIONS
// ═══════════════════════════════════════════════════════════
const tab7 = [
  {
    title: '1. Running Balance - Account Statement',
    desc: 'SUM() OVER with ROWS UNBOUNDED PRECEDING for cumulative totals.',
    sql: `-- Running balance for account statement
SELECT txn_date,
       description,
       ref_no,
       CASE WHEN transaction_type = 'CREDIT'
            THEN amount ELSE 0 END       AS credit,
       CASE WHEN transaction_type = 'DEBIT'
            THEN amount ELSE 0 END       AS debit,
       SUM(CASE WHEN transaction_type = 'CREDIT'
                THEN amount ELSE -amount END)
         OVER (ORDER BY txn_date, transaction_id
               ROWS UNBOUNDED PRECEDING)  AS running_balance
FROM transactions
WHERE account_id = 'ACC001'
  AND txn_date BETWEEN '2025-01-01' AND '2025-01-31'
ORDER BY txn_date, transaction_id;`,
  },
  {
    title: '2. RANK, DENSE_RANK, ROW_NUMBER - Customer Ranking',
    desc: 'Three ranking functions compared side-by-side.',
    sql: `-- Compare ranking functions for customer balances
SELECT customer_id,
       customer_name,
       total_balance,
       branch_id,
       ROW_NUMBER() OVER (ORDER BY total_balance DESC) AS row_num,
       RANK()       OVER (ORDER BY total_balance DESC) AS rank_val,
       DENSE_RANK() OVER (ORDER BY total_balance DESC) AS dense_rank_val,
       -- Rank within branch
       ROW_NUMBER() OVER (
         PARTITION BY branch_id
         ORDER BY total_balance DESC
       ) AS branch_rank
FROM customer_balances
WHERE total_balance > 0
ORDER BY total_balance DESC;

-- ROW_NUMBER: 1,2,3,4,5   (always unique)
-- RANK:       1,2,2,4,5   (gaps after ties)
-- DENSE_RANK: 1,2,2,3,4   (no gaps after ties)`,
  },
  {
    title: '3. LAG / LEAD - Month-over-Month Growth',
    desc: 'Access previous/next row values for trend analysis.',
    sql: `-- Month-over-month deposit growth with LAG
SELECT report_month,
       total_deposits,
       LAG(total_deposits, 1) OVER (ORDER BY report_month)
         AS prev_month_deposits,
       total_deposits - LAG(total_deposits, 1) OVER (ORDER BY report_month)
         AS absolute_change,
       ROUND(
         (total_deposits - LAG(total_deposits, 1) OVER (ORDER BY report_month))
         * 100.0
         / LAG(total_deposits, 1) OVER (ORDER BY report_month),
       2) AS growth_pct,
       LEAD(total_deposits, 1) OVER (ORDER BY report_month)
         AS next_month_deposits
FROM monthly_branch_deposits
WHERE branch_id = 101
ORDER BY report_month;`,
  },
  {
    title: '4. NTILE - Customer Percentile Buckets',
    desc: 'Divide customers into equal-sized groups (quartiles, deciles).',
    sql: `-- Divide customers into quartiles by total balance
SELECT customer_id,
       customer_name,
       total_balance,
       NTILE(4) OVER (ORDER BY total_balance DESC) AS quartile,
       NTILE(10) OVER (ORDER BY total_balance DESC) AS decile,
       PERCENT_RANK() OVER (ORDER BY total_balance) AS pct_rank,
       CUME_DIST()    OVER (ORDER BY total_balance) AS cume_dist
FROM customer_balances
ORDER BY total_balance DESC;

-- Quartile 1 = Top 25% (highest balances)
-- Quartile 4 = Bottom 25% (lowest balances)`,
  },
  {
    title: '5. FIRST_VALUE / LAST_VALUE - Extremes in a Partition',
    desc: 'Retrieve first or last values within a window frame.',
    sql: `-- First and last transaction of each day per account
SELECT account_id,
       txn_date,
       transaction_id,
       amount,
       transaction_type,
       FIRST_VALUE(amount) OVER (
         PARTITION BY account_id, CAST(txn_date AS DATE)
         ORDER BY txn_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS first_txn_amount,
       LAST_VALUE(amount) OVER (
         PARTITION BY account_id, CAST(txn_date AS DATE)
         ORDER BY txn_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_txn_amount
FROM transactions
WHERE account_id = 'ACC001'
ORDER BY txn_date;`,
  },
  {
    title: '6. Moving Average - 7-Day Transaction Average',
    desc: 'Sliding window for smoothed trend lines.',
    sql: `-- 7-day moving average of daily transaction volume
SELECT txn_date,
       daily_amount,
       daily_count,
       ROUND(AVG(daily_amount) OVER (
         ORDER BY txn_date
         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ), 2) AS moving_avg_7d,
       ROUND(AVG(daily_amount) OVER (
         ORDER BY txn_date
         ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
       ), 2) AS moving_avg_30d,
       SUM(daily_count) OVER (
         ORDER BY txn_date
         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS txn_count_7d
FROM (
  SELECT CAST(txn_date AS DATE) AS txn_date,
         SUM(amount) AS daily_amount,
         COUNT(*)    AS daily_count
  FROM transactions
  WHERE status = 'SUCCESS'
  GROUP BY CAST(txn_date AS DATE)
) daily
ORDER BY txn_date;`,
  },
  {
    title: '7. PIVOT - Monthly Balance by Account Type',
    desc: 'Transform rows into columns for cross-tab reporting.',
    sql: `-- PIVOT: Monthly totals by account type (columns)
SELECT *
FROM (
  SELECT MONTH(txn_date)   AS txn_month,
         account_type,
         amount
  FROM transactions t
  JOIN accounts a ON t.account_id = a.account_id
  WHERE YEAR(txn_date) = 2025
) src
PIVOT (
  SUM(amount)
  FOR account_type IN ([SAVINGS], [CURRENT], [SALARY], [FD])
) pvt
ORDER BY txn_month;

-- UNPIVOT: Convert columns back to rows
SELECT txn_month, account_type, total_amount
FROM (
  SELECT txn_month, [SAVINGS], [CURRENT], [SALARY], [FD]
  FROM pivoted_report
) src
UNPIVOT (
  total_amount FOR account_type IN ([SAVINGS], [CURRENT], [SALARY], [FD])
) unpvt;`,
  },
  {
    title: '8. Gap Detection - Missing Sequence Numbers',
    desc: 'Use LAG to detect gaps in transaction reference sequences.',
    sql: `-- Detect missing cheque numbers / transaction sequences
SELECT ref_no,
       LAG(ref_no) OVER (ORDER BY ref_no)  AS prev_ref,
       ref_no - LAG(ref_no) OVER (ORDER BY ref_no) AS gap_size,
       CASE
         WHEN ref_no - LAG(ref_no) OVER (ORDER BY ref_no) > 1
         THEN 'GAP DETECTED'
         ELSE 'OK'
       END AS status
FROM cheque_transactions
WHERE account_id = 'ACC001'
  AND YEAR(txn_date) = 2025
ORDER BY ref_no;`,
  },
  {
    title: '9. Cumulative Distribution - Loan Portfolio Analysis',
    desc: 'CUME_DIST and PERCENT_RANK for loan concentration risk.',
    sql: `-- Loan portfolio concentration analysis
SELECT loan_id,
       customer_name,
       outstanding_balance,
       SUM(outstanding_balance) OVER (
         ORDER BY outstanding_balance DESC
         ROWS UNBOUNDED PRECEDING
       ) AS cumulative_exposure,
       ROUND(
         SUM(outstanding_balance) OVER (
           ORDER BY outstanding_balance DESC
           ROWS UNBOUNDED PRECEDING
         ) * 100.0 / SUM(outstanding_balance) OVER (), 2
       ) AS cumulative_pct,
       PERCENT_RANK() OVER (ORDER BY outstanding_balance DESC) AS pct_rank
FROM loans
WHERE status = 'ACTIVE'
ORDER BY outstanding_balance DESC;`,
  },
  {
    title: '10. Windowed COUNT - Transaction Frequency Analysis',
    desc: 'Count events in rolling windows per customer.',
    sql: `-- Transactions per customer in the last 30 days (rolling)
SELECT customer_id,
       txn_date,
       amount,
       COUNT(*) OVER (
         PARTITION BY customer_id
         ORDER BY txn_date
         RANGE BETWEEN INTERVAL '30' DAY PRECEDING AND CURRENT ROW
       ) AS txn_count_30d,
       SUM(amount) OVER (
         PARTITION BY customer_id
         ORDER BY txn_date
         RANGE BETWEEN INTERVAL '30' DAY PRECEDING AND CURRENT ROW
       ) AS total_30d,
       CASE
         WHEN COUNT(*) OVER (
           PARTITION BY customer_id
           ORDER BY txn_date
           RANGE BETWEEN INTERVAL '30' DAY PRECEDING AND CURRENT ROW
         ) > 50 THEN 'HIGH_FREQUENCY'
         ELSE 'NORMAL'
       END AS frequency_flag
FROM customer_transactions
ORDER BY customer_id, txn_date;`,
  },
];

// ═══════════════════════════════════════════════════════════
// TAB 8 : TRIGGERS & INDEXES
// ═══════════════════════════════════════════════════════════
const tab8 = [
  {
    title: '1. Audit Trail Trigger (AFTER UPDATE)',
    desc: 'Log every change to the accounts table with old and new values.',
    sql: `-- Audit trail: capture all account changes
CREATE TRIGGER trg_account_audit
ON accounts
AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  INSERT INTO audit_trail(
    table_name, record_id, operation,
    old_values, new_values,
    changed_by, changed_at
  )
  SELECT
    'accounts',
    i.account_id,
    'UPDATE',
    (SELECT d.balance AS old_balance, d.status AS old_status,
            d.account_type AS old_type
     FROM deleted d2 WHERE d2.account_id = d.account_id
     FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
    (SELECT i.balance AS new_balance, i.status AS new_status,
            i.account_type AS new_type
     FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
    SYSTEM_USER,
    GETDATE()
  FROM inserted i
  JOIN deleted d ON i.account_id = d.account_id
  WHERE i.balance <> d.balance
     OR i.status <> d.status;
END;`,
  },
  {
    title: '2. Prevent Negative Balance Trigger (INSTEAD OF)',
    desc: 'Block any update that would make an account balance negative.',
    sql: `-- Prevent negative balance on debit operations
CREATE TRIGGER trg_prevent_negative_balance
ON accounts
INSTEAD OF UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  -- Check for any row that would go negative
  IF EXISTS (
    SELECT 1 FROM inserted i
    WHERE i.balance < 0
  )
  BEGIN
    -- Reject only the bad rows, allow the rest
    RAISERROR('Account balance cannot be negative.', 16, 1);
    RETURN;
  END

  -- Apply the update (all rows are valid)
  UPDATE a
  SET a.balance      = i.balance,
      a.status       = i.status,
      a.account_type = i.account_type,
      a.last_txn_date = i.last_txn_date
  FROM accounts a
  JOIN inserted i ON a.account_id = i.account_id;
END;`,
  },
  {
    title: '3. Transaction Insert Trigger - AML Flagging',
    desc: 'Automatically flag high-value transactions for AML review.',
    sql: `-- Auto-flag transactions over threshold for AML
CREATE TRIGGER trg_aml_flag_insert
ON transactions
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  -- Flag transactions over 10 lakh (1,000,000)
  INSERT INTO aml_alerts(
    transaction_id, account_id, alert_type,
    amount, txn_date, status, created_at
  )
  SELECT i.transaction_id, i.account_id, 'HIGH_VALUE',
         i.amount, i.txn_date, 'PENDING', GETDATE()
  FROM inserted i
  WHERE i.amount >= 1000000;

  -- Flag cash transactions over 50,000 (CTR reporting)
  INSERT INTO ctr_reports(
    transaction_id, account_id, amount,
    txn_date, report_status
  )
  SELECT i.transaction_id, i.account_id, i.amount,
         i.txn_date, 'PENDING'
  FROM inserted i
  WHERE i.amount >= 50000
    AND i.transaction_type IN ('CASH_DEPOSIT', 'CASH_WITHDRAWAL');
END;`,
  },
  {
    title: '4. Loan Status Change Trigger',
    desc: 'Track loan status transitions and notify relevant teams.',
    sql: `-- Log loan status transitions (NPA tracking)
CREATE TRIGGER trg_loan_status_change
ON loans
AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  -- Only fire when status changes
  IF NOT UPDATE(status) RETURN;

  INSERT INTO loan_status_history(
    loan_id, old_status, new_status,
    changed_at, changed_by
  )
  SELECT i.loan_id, d.status, i.status,
         GETDATE(), SYSTEM_USER
  FROM inserted i
  JOIN deleted d ON i.loan_id = d.loan_id
  WHERE i.status <> d.status;

  -- Alert when loan becomes NPA/DEFAULT
  INSERT INTO notifications(
    recipient_role, subject, message, created_at
  )
  SELECT 'RISK_TEAM',
         'Loan ' + CAST(i.loan_id AS VARCHAR) + ' marked as ' + i.status,
         'Customer: ' + CAST(i.customer_id AS VARCHAR)
           + ', Outstanding: ' + CAST(i.outstanding_balance AS VARCHAR),
         GETDATE()
  FROM inserted i
  JOIN deleted d ON i.loan_id = d.loan_id
  WHERE i.status IN ('DEFAULT', 'NPA', 'WRITTEN_OFF')
    AND d.status NOT IN ('DEFAULT', 'NPA', 'WRITTEN_OFF');
END;`,
  },
  {
    title: '5. DELETE Trigger - Soft Delete Enforcement',
    desc: 'Prevent hard deletes on critical tables; convert to soft delete.',
    sql: `-- Prevent hard deletion of customer records
CREATE TRIGGER trg_customer_no_delete
ON customers
INSTEAD OF DELETE
AS
BEGIN
  SET NOCOUNT ON;

  -- Soft delete: set status to DELETED instead of removing
  UPDATE c
  SET c.status = 'DELETED',
      c.deleted_at = GETDATE(),
      c.deleted_by = SYSTEM_USER
  FROM customers c
  JOIN deleted d ON c.customer_id = d.customer_id;

  -- Log the soft deletion
  INSERT INTO audit_trail(table_name, record_id, operation,
                          old_values, changed_by, changed_at)
  SELECT 'customers', d.customer_id, 'SOFT_DELETE',
         (SELECT * FROM deleted d2
          WHERE d2.customer_id = d.customer_id
          FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
         SYSTEM_USER, GETDATE()
  FROM deleted d;

  PRINT 'Hard delete prevented. Records soft-deleted instead.';
END;`,
  },
  {
    title: '6. Clustered vs Non-Clustered Indexes',
    desc: 'Core banking index strategy for optimal query performance.',
    sql: `-- ═══ CLUSTERED INDEX (one per table, defines physical order) ═══
-- Primary key usually gets the clustered index automatically
CREATE CLUSTERED INDEX IX_transactions_txn_date
ON transactions(txn_date, transaction_id);
-- Optimizes: date-range scans, which are the most common query

-- ═══ NON-CLUSTERED INDEXES ═══
-- Accounts: search by customer, status, type
CREATE NONCLUSTERED INDEX IX_accounts_customer_id
ON accounts(customer_id)
INCLUDE (account_type, balance, status);

CREATE NONCLUSTERED INDEX IX_accounts_status_type
ON accounts(status, account_type)
INCLUDE (balance, branch_id);

-- Transactions: search by account, date, status
CREATE NONCLUSTERED INDEX IX_txn_account_date
ON transactions(account_id, txn_date DESC)
INCLUDE (amount, transaction_type, status);

CREATE NONCLUSTERED INDEX IX_txn_status
ON transactions(status)
WHERE status = 'PENDING';  -- Filtered index

-- Loans: search by customer, status, type
CREATE NONCLUSTERED INDEX IX_loans_customer
ON loans(customer_id, status)
INCLUDE (loan_type, outstanding_balance);

CREATE NONCLUSTERED INDEX IX_loans_maturity
ON loans(maturity_date)
WHERE status = 'ACTIVE';`,
  },
  {
    title: '7. Composite and Covering Indexes',
    desc: 'Multi-column indexes designed for specific query patterns.',
    sql: `-- Composite index: column order matters!
-- Rule: most selective column first, or follow query pattern

-- Query: WHERE branch_id = ? AND account_type = ? AND status = 'ACTIVE'
CREATE INDEX IX_accounts_branch_type_status
ON accounts(branch_id, account_type, status)
INCLUDE (balance, customer_id, opened_date);
-- This is a COVERING INDEX: all columns the query needs
-- are in the index, so no table lookup (bookmark) needed.

-- Query: WHERE txn_date >= ? AND txn_date < ? AND amount > ?
CREATE INDEX IX_txn_date_amount
ON transactions(txn_date, amount)
INCLUDE (account_id, transaction_type, status, ref_no);

-- Query: WHERE customer_id = ? ORDER BY txn_date DESC
CREATE INDEX IX_txn_customer_date
ON transactions(account_id, txn_date DESC)
INCLUDE (amount, transaction_type, description);

-- Verify index usage with execution plan
SET STATISTICS IO ON;
SELECT account_id, balance FROM accounts
WHERE branch_id = 101 AND account_type = 'SAVINGS' AND status = 'ACTIVE';
SET STATISTICS IO OFF;
-- Look for "Index Seek" (good) vs "Index Scan" or "Table Scan" (bad)`,
  },
  {
    title: '8. Index Maintenance and Monitoring',
    desc: 'Rebuild, reorganize, and monitor index health.',
    sql: `-- Check index fragmentation
SELECT OBJECT_NAME(ips.object_id) AS table_name,
       i.name                      AS index_name,
       ips.avg_fragmentation_in_percent,
       ips.page_count,
       ips.index_type_desc
FROM sys.dm_db_index_physical_stats(
  DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
JOIN sys.indexes i
  ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE ips.avg_fragmentation_in_percent > 10
  AND ips.page_count > 1000
ORDER BY ips.avg_fragmentation_in_percent DESC;

-- Rebuild heavily fragmented indexes (> 30%)
ALTER INDEX IX_txn_account_date ON transactions REBUILD
  WITH (ONLINE = ON, SORT_IN_TEMPDB = ON);

-- Reorganize moderately fragmented (10-30%)
ALTER INDEX IX_accounts_customer_id ON accounts REORGANIZE;

-- Find unused indexes (wasting write performance)
SELECT OBJECT_NAME(s.object_id) AS table_name,
       i.name AS index_name,
       s.user_seeks, s.user_scans, s.user_lookups,
       s.user_updates,  -- writes (cost of maintaining index)
       s.last_user_seek, s.last_user_scan
FROM sys.dm_db_index_usage_stats s
JOIN sys.indexes i ON s.object_id = i.object_id AND s.index_id = i.index_id
WHERE OBJECTPROPERTY(s.object_id, 'IsUserTable') = 1
  AND s.user_seeks = 0 AND s.user_scans = 0
  AND s.user_updates > 100
ORDER BY s.user_updates DESC;`,
  },
];

// ═══════════════════════════════════════════════════════════
// TAB 9 : PERFORMANCE TUNING & OPTIMIZATION
// ═══════════════════════════════════════════════════════════
const tab9 = [
  {
    title: '1. SARGable Predicates - Date Filtering',
    desc: 'BEFORE: Non-sargable function on column prevents index use. AFTER: Range predicate enables index seek.',
    sql: `-- BEFORE (SLOW): Function on column = full table scan
SELECT * FROM transactions
WHERE YEAR(txn_date) = 2024 AND MONTH(txn_date) = 6;
-- The YEAR() function prevents the index on txn_date from being used.

-- AFTER (FAST): Range predicate = index seek
SELECT * FROM transactions
WHERE txn_date >= '2024-06-01'
  AND txn_date <  '2024-07-01';
-- Direct range comparison uses the index efficiently.

-- Another common mistake:
-- SLOW:  WHERE CAST(txn_date AS DATE) = '2024-06-15'
-- FAST:  WHERE txn_date >= '2024-06-15'
--          AND txn_date <  '2024-06-16'`,
  },
  {
    title: '2. Avoid SELECT * - Column Pruning',
    desc: 'Select only needed columns to reduce I/O and enable covering index usage.',
    sql: `-- BEFORE (SLOW): SELECT * fetches all columns
-- Reads every column even if you only need 3
-- Cannot use covering indexes
SELECT * FROM transactions
WHERE account_id = 'ACC001';

-- AFTER (FAST): Select only what you need
-- Can be served entirely from a covering index
SELECT transaction_id, amount, txn_date, transaction_type
FROM transactions
WHERE account_id = 'ACC001';

-- Covering index for this query:
CREATE INDEX IX_txn_acct_covering
ON transactions(account_id)
INCLUDE (transaction_id, amount, txn_date, transaction_type);
-- With this index, the query never touches the base table.`,
  },
  {
    title: '3. N+1 Query Anti-Pattern',
    desc: 'Replace loops of individual queries with a single batch JOIN.',
    sql: `-- BEFORE (SLOW): N+1 pattern - one query per customer
-- Application code does:
--   customers = SELECT * FROM customers WHERE status = 'ACTIVE'
--   FOR EACH customer:
--     accounts = SELECT * FROM accounts WHERE customer_id = ?
-- This executes N+1 separate queries!

-- AFTER (FAST): Single batch query with JOIN
SELECT c.customer_id,
       c.first_name || ' ' || c.last_name AS name,
       STRING_AGG(
         a.account_type || ':' || CAST(a.balance AS VARCHAR),
         ', '
       ) AS accounts_summary,
       COUNT(a.account_id) AS account_count,
       SUM(a.balance) AS total_balance
FROM customers c
LEFT JOIN accounts a ON c.customer_id = a.customer_id
WHERE c.status = 'ACTIVE'
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY total_balance DESC;

-- One query instead of thousands!`,
  },
  {
    title: '4. EXISTS vs IN for Subqueries',
    desc: 'EXISTS short-circuits and is faster for large subquery results.',
    sql: `-- BEFORE (SLOWER for large subquery results): IN
SELECT c.customer_id, c.first_name
FROM customers c
WHERE c.customer_id IN (
  SELECT DISTINCT a.customer_id
  FROM accounts a
  WHERE a.balance > 100000
);
-- IN materializes the entire subquery result set first.

-- AFTER (FASTER): EXISTS short-circuits on first match
SELECT c.customer_id, c.first_name
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM accounts a
  WHERE a.customer_id = c.customer_id
    AND a.balance > 100000
);
-- EXISTS stops scanning as soon as it finds ONE matching row.

-- For NOT IN vs NOT EXISTS:
-- NOT EXISTS is almost always better because
-- NOT IN has NULL-handling pitfalls:
-- If subquery returns ANY NULL, NOT IN returns no rows!`,
  },
  {
    title: '5. Temp Tables vs Table Variables vs CTEs',
    desc: 'Choose the right temporary storage for intermediate results.',
    sql: `-- ═══ TEMP TABLE: Best for large intermediate results ═══
-- Has statistics, indexes, can be reused
CREATE TABLE #high_value_customers (
  customer_id INT PRIMARY KEY,
  total_balance DECIMAL(15,2)
);
INSERT INTO #high_value_customers
SELECT customer_id, SUM(balance)
FROM accounts WHERE status = 'ACTIVE'
GROUP BY customer_id HAVING SUM(balance) > 500000;

-- Can add indexes to temp tables
CREATE INDEX IX_temp_balance ON #high_value_customers(total_balance);

SELECT h.*, c.first_name, c.last_name
FROM #high_value_customers h
JOIN customers c ON h.customer_id = c.customer_id;
DROP TABLE #high_value_customers;

-- ═══ TABLE VARIABLE: Best for small sets (< 1000 rows) ═══
-- No statistics, limited optimization, faster for small data
DECLARE @branches TABLE (branch_id INT, branch_name VARCHAR(100));
INSERT INTO @branches VALUES (101, 'Mumbai Main'), (102, 'Delhi Central');

-- ═══ CTE: Best for readability, single-use intermediate step ═══
-- Not materialized (re-evaluated each reference)
WITH active_balances AS (
  SELECT customer_id, SUM(balance) AS total
  FROM accounts WHERE status = 'ACTIVE'
  GROUP BY customer_id
)
SELECT * FROM active_balances WHERE total > 500000;`,
  },
  {
    title: '6. Table Partitioning for Large Transaction Tables',
    desc: 'Partition by date for efficient range scans and archival.',
    sql: `-- Partition function: split by year
CREATE PARTITION FUNCTION pf_txn_date (DATE)
AS RANGE RIGHT FOR VALUES (
  '2020-01-01', '2021-01-01', '2022-01-01',
  '2023-01-01', '2024-01-01', '2025-01-01'
);

-- Partition scheme: map to filegroups
CREATE PARTITION SCHEME ps_txn_date
AS PARTITION pf_txn_date
TO (fg_2019, fg_2020, fg_2021, fg_2022, fg_2023, fg_2024, fg_2025, fg_future);

-- Create table on partition scheme
CREATE TABLE transactions_partitioned (
  transaction_id BIGINT IDENTITY PRIMARY KEY,
  account_id     VARCHAR(20) NOT NULL,
  amount         DECIMAL(15,2) NOT NULL,
  txn_date       DATE NOT NULL,
  transaction_type VARCHAR(20),
  status         VARCHAR(20)
) ON ps_txn_date(txn_date);

-- Benefits:
-- 1. Partition elimination: queries on 2024 only scan 2024 partition
-- 2. Easy archival: SWITCH PARTITION to archive table (instant)
-- 3. Parallel scans across partitions
-- 4. Partition-level index rebuilds

-- Archive old partition (instant operation):
ALTER TABLE transactions_partitioned
SWITCH PARTITION 2 TO transactions_archive PARTITION 2;`,
  },
  {
    title: '7. Query Execution Plan Analysis',
    desc: 'Read execution plans to identify bottlenecks.',
    sql: `-- Enable actual execution plan
SET STATISTICS IO ON;
SET STATISTICS TIME ON;

-- Example query to analyze
SELECT c.customer_id, c.first_name,
       SUM(a.balance) AS total_balance
FROM customers c
JOIN accounts a ON c.customer_id = a.customer_id
WHERE c.status = 'ACTIVE'
  AND a.account_type = 'SAVINGS'
GROUP BY c.customer_id, c.first_name
HAVING SUM(a.balance) > 100000
ORDER BY total_balance DESC;

-- What to look for in the plan:
-- 1. TABLE SCAN      -> Missing index (bad)
-- 2. INDEX SCAN      -> Index exists but not optimal
-- 3. INDEX SEEK      -> Index used efficiently (good)
-- 4. KEY LOOKUP      -> Need a covering index
-- 5. HASH JOIN       -> Large unsorted data (check memory grants)
-- 6. NESTED LOOP     -> Good for small outer table + indexed inner
-- 7. SORT            -> Expensive; can sometimes add index to avoid
-- 8. High ESTIMATED ROWS vs ACTUAL ROWS -> stale statistics

-- Update statistics when estimates are off:
UPDATE STATISTICS customers WITH FULLSCAN;
UPDATE STATISTICS accounts WITH FULLSCAN;

SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;`,
  },
  {
    title: '8. Avoiding Implicit Conversions',
    desc: 'Data type mismatches cause hidden full scans.',
    sql: `-- BEFORE (SLOW): Implicit conversion kills index
-- account_id column is VARCHAR(20), but parameter is INT
SELECT * FROM accounts WHERE account_id = 12345;
-- SQL Server converts EVERY row's account_id to INT for comparison
-- Result: full table/index scan

-- AFTER (FAST): Match data types exactly
SELECT * FROM accounts WHERE account_id = '12345';
-- Direct comparison, index seek possible

-- Another common mistake with Unicode:
-- SLOW (if column is VARCHAR):
SELECT * FROM customers WHERE first_name = N'Ravi';
-- N prefix = NVARCHAR, forces conversion of entire column

-- FAST:
SELECT * FROM customers WHERE first_name = 'Ravi';

-- Check for implicit conversions in your queries:
SELECT
  qs.execution_count,
  qs.total_worker_time,
  SUBSTRING(st.text, 1, 200) AS query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
WHERE st.text LIKE '%CONVERT_IMPLICIT%'
ORDER BY qs.total_worker_time DESC;`,
  },
  {
    title: '9. Batch Processing for Large Updates',
    desc: 'Process large data changes in batches to avoid log bloat and blocking.',
    sql: `-- BEFORE (DANGEROUS): Update millions of rows in one transaction
-- Locks the entire table, fills transaction log, blocks all users
UPDATE transactions SET status = 'ARCHIVED'
WHERE txn_date < '2022-01-01';

-- AFTER (SAFE): Process in batches of 10,000
DECLARE @batch_size INT = 10000;
DECLARE @rows_affected INT = 1;

WHILE @rows_affected > 0
BEGIN
  UPDATE TOP (@batch_size) transactions
  SET status = 'ARCHIVED'
  WHERE txn_date < '2022-01-01'
    AND status <> 'ARCHIVED';

  SET @rows_affected = @@ROWCOUNT;

  -- Brief pause to let other queries through
  WAITFOR DELAY '00:00:01';

  -- Optional: checkpoint to keep log small
  CHECKPOINT;
END

-- For large DELETEs, same pattern:
WHILE 1 = 1
BEGIN
  DELETE TOP (10000)
  FROM audit_trail
  WHERE changed_at < DATEADD(DAY, -90, GETDATE());

  IF @@ROWCOUNT = 0 BREAK;
  WAITFOR DELAY '00:00:00.500';
END`,
  },
  {
    title: '10. Parameterized Queries vs Ad-Hoc SQL',
    desc: 'Reuse execution plans with parameterization; avoid SQL injection.',
    sql: `-- BEFORE (BAD): Ad-hoc SQL - new plan compiled every time
-- Also vulnerable to SQL injection!
DECLARE @sql NVARCHAR(500);
SET @sql = 'SELECT * FROM accounts WHERE customer_id = '
         + CAST(@cust_id AS VARCHAR);
EXEC(@sql);

-- AFTER (GOOD): Parameterized query - plan reuse + safe
EXEC sp_executesql
  N'SELECT account_id, account_type, balance
    FROM accounts
    WHERE customer_id = @customer_id
      AND status = @status',
  N'@customer_id INT, @status VARCHAR(20)',
  @customer_id = @cust_id,
  @status = 'ACTIVE';

-- Or use stored procedures (always parameterized):
CREATE PROCEDURE sp_get_customer_accounts
  @customer_id INT,
  @status VARCHAR(20) = 'ACTIVE'
AS
BEGIN
  SELECT account_id, account_type, balance
  FROM accounts
  WHERE customer_id = @customer_id
    AND status = @status;
END;

-- Check plan cache for single-use ad-hoc queries:
SELECT TOP 20
  cp.usecounts,
  cp.size_in_bytes / 1024 AS size_kb,
  LEFT(st.text, 200) AS query_text
FROM sys.dm_exec_cached_plans cp
CROSS APPLY sys.dm_exec_sql_text(cp.plan_handle) st
WHERE cp.cacheobjtype = 'Compiled Plan'
  AND cp.usecounts = 1
ORDER BY cp.size_in_bytes DESC;`,
  },
];

// ═══════════════════════════════════════════════════════════
// TAB CONTENT MAP
// ═══════════════════════════════════════════════════════════
const TAB_DATA = [
  { title: 'Basic Queries & SELECT', desc: 'Foundation SQL queries for banking data retrieval: WHERE, LIKE, CASE, ORDER BY, pagination', items: tab0 },
  { title: 'All Types of JOINs', desc: 'Every JOIN type with ASCII diagrams: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF, NATURAL', items: tab1 },
  { title: 'Aggregate Functions & GROUP BY', desc: 'Banking analytics with COUNT, SUM, AVG, ROLLUP, CUBE, GROUPING SETS', items: tab2 },
  { title: 'Subqueries & CTEs', desc: 'Scalar, correlated, EXISTS, NOT EXISTS, recursive CTEs for hierarchies', items: tab3 },
  { title: 'Stored Procedures', desc: 'Complete banking procedures: fund transfer, interest, KYC, statements, EMI', items: tab4 },
  { title: 'Functions (Scalar & Table-Valued)', desc: 'Interest calculators, masking, eligibility, portfolio, formatting functions', items: tab5 },
  { title: 'SQL Jobs & Scheduling', desc: 'Automated banking jobs: EOD processing, AML scans, archival, dormancy checks', items: tab6 },
  { title: 'Window Functions & Advanced', desc: 'ROW_NUMBER, RANK, LAG/LEAD, running totals, PIVOT, moving averages', items: tab7 },
  { title: 'Triggers & Indexes', desc: 'Audit triggers, validation triggers, clustered/non-clustered/covering indexes', items: tab8 },
  { title: 'Performance Tuning', desc: 'SARGability, execution plans, partitioning, batch processing, plan reuse', items: tab9 },
];

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
const SqlMasterGuide = () => {
  const [activeTab, setActiveTab] = useState(0);
  const totalExamples = TAB_DATA.reduce((sum, t) => sum + t.items.length, 0);
  const currentData = TAB_DATA[activeTab];

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.h1}>
          SQL Master Guide for Banking Database Testing
          <span style={S.badge}>{totalExamples} Examples</span>
        </h1>
        <div style={S.subtitle}>
          Comprehensive SQL reference covering queries, joins, procedures, functions, jobs, window functions, triggers, indexes, and performance tuning
        </div>
      </div>

      {/* Tab Bar */}
      <div style={S.tabBar}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            style={S.tab(activeTab === i)}
            onClick={() => setActiveTab(i)}
          >
            {t.label}
            <span style={{
              ...S.badge,
              background: activeTab === i ? '#0a0a1a' : '#4ecca3',
              color: activeTab === i ? '#4ecca3' : '#0a0a1a',
              marginLeft: 6,
              fontSize: 10,
            }}>
              {TAB_DATA[i].items.length}
            </span>
          </button>
        ))}
      </div>

      {/* Section Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={S.sectionTitle}>{currentData.title}</div>
        <div style={S.sectionDesc}>{currentData.desc}</div>
      </div>

      {/* Cards */}
      {currentData.items.map((item, idx) => (
        <ExCard
          key={activeTab + '-' + idx}
          title={item.title}
          desc={item.desc}
          sql={item.sql}
          defaultOpen={idx < 3}
        />
      ))}
    </div>
  );
};

export default SqlMasterGuide;

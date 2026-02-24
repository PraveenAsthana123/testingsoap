import React, { useState } from 'react';

const CATEGORIES = [
  { id: 'ui', label: 'UI Challenges', icon: '\uD83D\uDDA5\uFE0F', color: '#3b82f6' },
  { id: 'api', label: 'API Challenges', icon: '\uD83D\uDD0C', color: '#8b5cf6' },
  { id: 'db', label: 'Database Challenges', icon: '\uD83D\uDDC4\uFE0F', color: '#f59e0b' },
  { id: 'security', label: 'Security Challenges', icon: '\uD83D\uDD12', color: '#ef4444' },
  { id: 'performance', label: 'Performance Challenges', icon: '\u26A1', color: '#10b981' },
];

const CHALLENGES = [
  // --- UI Challenges ---
  {
    id: 1,
    category: 'ui',
    title: 'Form Validation: Account Registration',
    difficulty: 'Easy',
    description: 'Test the account registration form with various valid and invalid inputs to ensure all validation rules are enforced correctly.',
    expectedBehavior: 'Form should reject invalid inputs with clear error messages, accept valid inputs, and submit only when all fields pass validation.',
    edgeCases: [
      'Empty form submission -- all required field errors should appear simultaneously',
      'Name field with special characters: O\'Brien, Muller-Schmidt, Jose Maria',
      'Email with unusual but valid formats: user+tag@domain.co.uk',
      'Phone number with country codes: +91-9876543210, (555) 123-4567',
      'Password with unicode characters, emojis, or 100+ character length',
      'Copy-paste into fields (bypassing character-by-character validation)',
      'Tab order and keyboard-only navigation through the form',
    ],
    tips: 'Test both client-side and server-side validation. Disable JavaScript to verify server-side catches invalid data. Test with browser autofill enabled.',
  },
  {
    id: 2,
    category: 'ui',
    title: 'Date Picker: Transaction Date Range',
    difficulty: 'Medium',
    description: 'Test the date range picker used for filtering transaction history with boundary dates and special calendar scenarios.',
    expectedBehavior: 'Date picker should handle all valid date ranges, prevent invalid selections, and correctly display transactions for the selected period.',
    edgeCases: [
      'Leap year: February 29 selection and range spanning Feb 28-Mar 1',
      'End-of-month boundaries: Jan 31 to Feb 28 (non-leap) / Feb 29 (leap)',
      'Year boundary: December 31 to January 1 range',
      'Same start and end date (single day view)',
      'End date before start date (should be prevented or auto-corrected)',
      'Very large ranges: 5 years of transactions (performance test)',
      'Future dates: should be disabled or show empty results',
      'Timezone differences: user in different timezone than server',
    ],
    tips: 'Manually set system clock to test date boundaries. Verify the API query uses inclusive start and exclusive end (or both inclusive) consistently.',
  },
  {
    id: 3,
    category: 'ui',
    title: 'Pagination: Transaction List',
    difficulty: 'Medium',
    description: 'Test pagination controls on the transaction history page, ensuring correct data display and navigation across pages.',
    expectedBehavior: 'Pages should load correct data slices, navigation controls should be accurate, and edge cases should be handled gracefully.',
    edgeCases: [
      'First page: "Previous" button should be disabled',
      'Last page: "Next" button should be disabled, partial page shows correct count',
      'Exact multiple: 100 records with page size 10 -- page 10 has exactly 10 items, no page 11',
      'Single record total -- only page 1, no navigation needed',
      'Zero records -- empty state message, no pagination controls',
      'Page size change mid-navigation: switch from 10 to 50 per page',
      'URL manipulation: manually set page=9999 in query string',
      'Data changes between page loads: new transaction added while browsing',
    ],
    tips: 'Test both the UI controls and the underlying API calls. Verify offset/limit parameters in network requests match displayed page.',
  },
  {
    id: 4,
    category: 'ui',
    title: 'Concurrent Edits: Account Details',
    difficulty: 'Hard',
    description: 'Test what happens when two users simultaneously edit the same account details in separate browser sessions.',
    expectedBehavior: 'The system should detect the conflict and either prevent the second save with a clear message or implement optimistic/pessimistic locking.',
    edgeCases: [
      'User A and User B both open the edit form for the same account',
      'User A saves changes, then User B saves different changes (stale data overwrite)',
      'User A edits field X, User B edits field Y on the same record (non-conflicting)',
      'One user deletes the record while another is editing it',
      'Session timeout during edit -- form submission after session expires',
      'Network disconnect during save -- auto-retry behavior',
      'Browser back button after successful save -- should not re-submit',
    ],
    tips: 'Use two browser windows or incognito sessions. Check for ETags or version fields in API requests that enable conflict detection.',
  },
  {
    id: 5,
    category: 'ui',
    title: 'Browser Compatibility: Core Banking Screens',
    difficulty: 'Medium',
    description: 'Verify that core banking screens render and function correctly across different browsers, devices, and screen sizes.',
    expectedBehavior: 'All features should work consistently across Chrome, Firefox, Safari, and Edge. Responsive layout should adapt to mobile and tablet screens.',
    edgeCases: [
      'Chrome vs Firefox: CSS flexbox/grid rendering differences',
      'Safari: date input type rendering, autofill behavior differences',
      'Mobile viewport: touch events vs click events, virtual keyboard impact on layout',
      'Screen reader compatibility: ARIA labels, focus management, announcements',
      'Zoom to 200%: layout should not break, text should remain readable',
      'Print stylesheet: transaction receipt or statement should print cleanly',
      'Slow network (3G throttle): loading states, timeout handling',
    ],
    tips: 'Use BrowserStack or similar for cross-browser testing. Test with actual devices when possible, not just emulators. Check WCAG 2.1 AA compliance.',
  },
  // --- API Challenges ---
  {
    id: 6,
    category: 'api',
    title: 'Rate Limiting: Login API',
    difficulty: 'Medium',
    description: 'Verify that the login API properly rate-limits requests to prevent brute-force attacks on customer accounts.',
    expectedBehavior: 'After N failed attempts (e.g., 5), the API should return 429 Too Many Requests with a Retry-After header. Account should be temporarily locked.',
    edgeCases: [
      'Exactly at the limit: 5th request succeeds, 6th is blocked',
      'Rate limit reset: verify the lockout expires after the configured duration',
      'Distributed attempts: same account from different IPs (should still lock by account)',
      'Same IP, different accounts (should not cross-contaminate rate limits)',
      'Successful login between failed attempts: does it reset the counter?',
      'Rate limit headers: X-RateLimit-Remaining, X-RateLimit-Reset present in every response',
      'Concurrent requests hitting the limit simultaneously',
    ],
    tips: 'Use SoapUI load test to generate rapid requests. Verify both IP-based and account-based rate limiting. Check that rate limit state persists across server restarts.',
  },
  {
    id: 7,
    category: 'api',
    title: 'Timeout Handling: External Payment Gateway',
    difficulty: 'Hard',
    description: 'Test how the fund transfer API behaves when the external payment gateway is slow or unresponsive.',
    expectedBehavior: 'The API should have a configurable timeout, return a clear error after timeout, and leave the transaction in a consistent state (not partially completed).',
    edgeCases: [
      'Gateway responds after exactly the timeout threshold (race condition)',
      'Gateway accepts the request but never sends a response (hanging connection)',
      'Gateway returns response after client has timed out (orphaned transaction)',
      'Retry behavior: does the system auto-retry? If so, is the retry idempotent?',
      'Partial failure: debit succeeds but credit times out (split-brain)',
      'Cascading timeouts: multiple services in the chain each have their own timeout',
      'Circuit breaker activation after repeated timeouts',
    ],
    tips: 'Use SoapUI mock service with a deliberate delay to simulate slow gateways. Test with delays of 1s, 5s, 30s, 60s. Verify transaction status in the database after each scenario.',
  },
  {
    id: 8,
    category: 'api',
    title: 'Large Payloads: Bulk Transaction Import',
    difficulty: 'Hard',
    description: 'Test the bulk transaction import API with varying payload sizes, from small batches to extremely large files.',
    expectedBehavior: 'The API should accept payloads up to the configured limit, reject oversized payloads with 413 status, and process large batches without memory issues.',
    edgeCases: [
      'Empty array: POST with {"transactions": []} -- should return 400 or process with zero count',
      'Single transaction in bulk format -- should work as if individual POST',
      'Exactly at size limit (e.g., 10MB payload)',
      'Just over size limit: 10MB + 1 byte',
      'Very large number of small transactions: 100,000 records of 100 bytes each',
      'Few very large transactions: 10 records with huge description fields',
      'Malformed JSON at position 50,000 (middle of large payload)',
      'Network interruption during large upload -- partial processing?',
    ],
    tips: 'Generate test payloads programmatically with Groovy scripts. Monitor server memory and CPU during large uploads. Verify all-or-nothing processing (transactions should not be partially committed).',
  },
  {
    id: 9,
    category: 'api',
    title: 'Concurrent Requests: Balance Inquiry',
    difficulty: 'Medium',
    description: 'Verify that concurrent balance inquiry requests for the same account return consistent data without errors.',
    expectedBehavior: 'All concurrent requests should return the same balance value. No requests should fail due to concurrency. Read operations should not block each other.',
    edgeCases: [
      '50 simultaneous GET requests for the same account balance',
      'Balance inquiry during an active transfer (read during write)',
      'Cache consistency: if balance is cached, does it reflect the latest transaction?',
      'Different isolation levels: read committed vs repeatable read behavior',
      'Long-running query blocking balance reads (resource contention)',
      'Connection pool exhaustion under high concurrency',
    ],
    tips: 'Use SoapUI load test with 50 threads and 0 delay. Compare all response values -- they should be identical. Monitor database connection pool usage.',
  },
  {
    id: 10,
    category: 'api',
    title: 'Idempotency: Fund Transfer API',
    difficulty: 'Hard',
    description: 'Verify that the fund transfer API correctly handles duplicate requests using idempotency keys to prevent double transfers.',
    expectedBehavior: 'First request with an idempotency key creates the transfer. Subsequent requests with the same key return the original response without creating a duplicate transfer.',
    edgeCases: [
      'Same idempotency key, same payload -- should return cached 201 response',
      'Same idempotency key, different payload -- should return 409 Conflict or original response',
      'No idempotency key provided -- each request creates a new transfer',
      'Idempotency key expiration: retry after 24 hours with same key',
      'Concurrent requests with same idempotency key (race condition)',
      'Very long idempotency key (UUID vs arbitrary string)',
      'Idempotency key after a failed transfer -- should allow retry',
    ],
    tips: 'Send the same transfer request twice in quick succession. Verify the account balance changes only once. Check the idempotency key storage mechanism (header: X-Idempotency-Key).',
  },
  {
    id: 11,
    category: 'api',
    title: 'Error Response Consistency',
    difficulty: 'Easy',
    description: 'Verify that all API endpoints return errors in a consistent JSON envelope format, regardless of the error type.',
    expectedBehavior: 'Every error response should follow the format: {"detail": "message", "error_code": "CODE", "correlation_id": "uuid"}. Never return HTML error pages or plain text.',
    edgeCases: [
      '404 for non-existent endpoint -- should return JSON, not HTML',
      '405 Method Not Allowed -- JSON envelope with allowed methods',
      '415 Unsupported Media Type -- send XML to a JSON-only endpoint',
      '500 Internal Server Error -- should not leak stack traces',
      'Malformed JSON in request body -- 400 with clear parsing error',
      'Missing required fields -- 422 with field-level error details',
      'Authorization errors -- 401/403 with consistent format',
    ],
    tips: 'Test every endpoint with deliberately wrong inputs. Verify correlation_id is present and matches the X-Correlation-ID response header. Ensure no stack traces in any error response.',
  },
  // --- Database Challenges ---
  {
    id: 12,
    category: 'db',
    title: 'SQL Injection: Account Search',
    difficulty: 'Hard',
    description: 'Test the account search functionality for SQL injection vulnerabilities by attempting to inject malicious SQL through all input fields.',
    expectedBehavior: 'All SQL injection attempts should be safely handled by parameterized queries. The application should never execute injected SQL.',
    edgeCases: [
      'Classic injection: \' OR 1=1 -- in account number field',
      'UNION-based: \' UNION SELECT password FROM users --',
      'Blind injection: \' AND (SELECT COUNT(*) FROM accounts) > 0 --',
      'Time-based blind: \' AND (SELECT CASE WHEN 1=1 THEN randomblob(100000000) END) --',
      'Stacked queries: \'; DROP TABLE accounts; --',
      'Second-order injection: store payload in name field, triggered when name is used in another query',
      'Integer field injection: account_id = 1 OR 1=1',
      'JSON field injection: {"name": "\' OR \'1\'=\'1"}',
    ],
    tips: 'Verify parameterized queries in the repository layer. Use sqlmap for automated testing. Check application logs for any SQL errors that might reveal injection points.',
  },
  {
    id: 13,
    category: 'db',
    title: 'Deadlocks: Simultaneous Transfers',
    difficulty: 'Hard',
    description: 'Create a deadlock scenario with two fund transfers that lock resources in opposite orders, then verify the system recovers gracefully.',
    expectedBehavior: 'The database should detect the deadlock and abort one transaction. The application should retry the aborted transaction or return a clear error.',
    edgeCases: [
      'Transfer A: Account 1001 -> Account 1002 (locks 1001 first)',
      'Transfer B: Account 1002 -> Account 1001 (locks 1002 first, causing deadlock)',
      'Three-way circular dependency: A->B, B->C, C->A simultaneously',
      'Deadlock with mixed operations: transfer + account update on same record',
      'Retry logic: does the application retry after deadlock detection?',
      'Deadlock frequency under sustained load (stability over time)',
      'SQLite specific: BUSY timeout behavior with WAL mode',
    ],
    tips: 'Use SoapUI load test to create the concurrent scenario. For SQLite, use PRAGMA busy_timeout=5000. Monitor for SQLITE_BUSY errors in application logs.',
  },
  {
    id: 14,
    category: 'db',
    title: 'Data Integrity: Referential Constraints',
    difficulty: 'Medium',
    description: 'Verify that foreign key constraints are enforced correctly when creating, updating, and deleting records across related tables.',
    expectedBehavior: 'The database should prevent orphaned records, enforce cascading deletes/updates where configured, and reject invalid foreign key references.',
    edgeCases: [
      'Create transaction with non-existent account_id (should fail)',
      'Delete account that has associated transactions (cascade vs restrict)',
      'Update account_id on an account that is referenced by transactions',
      'Insert with NULL foreign key where NOT NULL constraint exists',
      'Bulk insert with mix of valid and invalid foreign keys',
      'SQLite: PRAGMA foreign_keys = ON must be set per connection',
      'Check constraint: negative balance, negative amount, future created_at',
    ],
    tips: 'Verify PRAGMA foreign_keys = ON is set in the application. Test via both API (indirect) and direct JDBC queries. Check that error messages clearly indicate the constraint violation.',
  },
  {
    id: 15,
    category: 'db',
    title: 'Null Handling: Optional Fields',
    difficulty: 'Easy',
    description: 'Test how the application handles NULL values in optional database columns, ensuring correct storage, retrieval, and display.',
    expectedBehavior: 'NULL values should be stored correctly, returned as null in JSON responses, and displayed as empty or "N/A" in the UI -- never as the string "null".',
    edgeCases: [
      'POST with missing optional field (should store as NULL)',
      'POST with explicit null value: {"middleName": null}',
      'POST with empty string: {"middleName": ""} vs NULL',
      'PATCH with null to clear a previously set value',
      'Sorting by nullable column: NULLs first or last?',
      'Filtering: WHERE column IS NULL vs WHERE column = ""',
      'Aggregation: AVG(amount) when some amounts are NULL',
      'Display: NULL date should show "N/A", not "1970-01-01" or "null"',
    ],
    tips: 'Test with JDBC steps to verify actual database values. Compare API response representation of NULL vs empty string. Check that frontend handles null gracefully.',
  },
  {
    id: 16,
    category: 'db',
    title: 'Unicode Data: International Customer Names',
    difficulty: 'Medium',
    description: 'Verify that the system correctly stores, retrieves, and displays customer names and addresses containing Unicode characters from various languages.',
    expectedBehavior: 'All Unicode characters should be stored without corruption, retrieved correctly in API responses, and displayed properly in the UI.',
    edgeCases: [
      'Chinese characters: \u738B\u5C0F\u660E (Wang Xiaoming)',
      'Arabic (RTL text): \u0645\u062D\u0645\u062F (Muhammad)',
      'Japanese mixed: \u7530\u4E2D\u592A\u90CE (Tanaka Taro)',
      'Emoji in notes field: "Payment received \uD83D\uDCB0\uD83D\uDC4D"',
      'Accented European: Muller with umlaut, Francois with cedilla',
      'Very long Unicode strings: 500 Chinese characters',
      'Mixed scripts: "John \u7530\u4E2D (Tanaka)"',
      'SQL operations on Unicode: LIKE, ORDER BY, UPPER/LOWER',
      'Export to CSV/PDF: Unicode character preservation',
    ],
    tips: 'Set database encoding to UTF-8. Test with Content-Type: application/json; charset=utf-8. Verify JDBC connection string includes encoding parameter if needed.',
  },
  // --- Security Challenges ---
  {
    id: 17,
    category: 'security',
    title: 'Authentication Bypass: Token Manipulation',
    difficulty: 'Hard',
    description: 'Attempt to bypass authentication by manipulating JWT tokens, session cookies, or API keys to access unauthorized resources.',
    expectedBehavior: 'All manipulated tokens should be rejected with 401 Unauthorized. No authenticated endpoints should be accessible without valid credentials.',
    edgeCases: [
      'Expired token: change exp claim to a past timestamp',
      'Modified payload: change user_id or role in the token body',
      'Algorithm confusion: change alg from RS256 to HS256 (or none)',
      'Missing token: no Authorization header at all',
      'Empty token: Authorization: Bearer (empty string)',
      'Malformed token: Authorization: Bearer not.a.real.token',
      'Token from a different environment (staging token on production)',
      'Revoked token: valid format but explicitly invalidated',
      'Replay attack: reuse a previously valid but now rotated token',
    ],
    tips: 'Use jwt.io to decode and modify tokens. Test every authenticated endpoint with each attack vector. Verify that token validation happens on every request, not just login.',
  },
  {
    id: 18,
    category: 'security',
    title: 'Session Hijacking: Cookie Theft Simulation',
    difficulty: 'Hard',
    description: 'Test session security by simulating scenarios where an attacker obtains a valid session cookie or token.',
    expectedBehavior: 'Sessions should be bound to the original client (IP, user-agent fingerprint). Stolen sessions should be detectable and invalidatable.',
    edgeCases: [
      'Copy session cookie to a different browser (different user-agent)',
      'Use session cookie from a different IP address',
      'Access session after user explicitly logs out (should be invalidated)',
      'Session fixation: set a known session ID before authentication',
      'Concurrent sessions: same user logged in from multiple devices',
      'Session timeout: verify session expires after inactivity period',
      'Cookie attributes: Secure, HttpOnly, SameSite=Strict flags',
    ],
    tips: 'Use browser developer tools to extract and replay cookies. Verify Set-Cookie headers include security attributes. Test that logout actually invalidates the server-side session.',
  },
  {
    id: 19,
    category: 'security',
    title: 'CSRF: Fund Transfer Form',
    difficulty: 'Hard',
    description: 'Test whether the fund transfer endpoint is vulnerable to Cross-Site Request Forgery attacks.',
    expectedBehavior: 'All state-changing operations should require a CSRF token. Requests without or with invalid CSRF tokens should be rejected with 403.',
    edgeCases: [
      'Submit transfer form without CSRF token (should be rejected)',
      'Submit with an expired CSRF token',
      'Submit with a CSRF token from a different session',
      'Submit with a manually crafted CSRF token',
      'Test from a different origin (Origin header mismatch)',
      'Same-site request vs cross-site request behavior',
      'API endpoints: do they use CSRF tokens or rely on CORS?',
    ],
    tips: 'Create a simple HTML page that auto-submits a form to the transfer endpoint. If the transfer succeeds without a CSRF token, the endpoint is vulnerable. For APIs using JWT, CSRF is less relevant (no cookies).',
  },
  {
    id: 20,
    category: 'security',
    title: 'XSS: Customer Name Display',
    difficulty: 'Medium',
    description: 'Test for Cross-Site Scripting vulnerabilities in fields that display user-supplied data, such as customer names, transaction descriptions, and notes.',
    expectedBehavior: 'All user input should be properly escaped or sanitized before rendering in the UI. No script execution should be possible.',
    edgeCases: [
      'Script tag: <script>alert("XSS")</script> in name field',
      'Event handler: <img src=x onerror=alert("XSS")>',
      'SVG injection: <svg onload=alert("XSS")>',
      'Encoded payloads: %3Cscript%3Ealert(1)%3C/script%3E in URL params',
      'DOM-based XSS: JavaScript in URL fragment (#<script>)',
      'Stored XSS: payload saved to DB, executed when admin views the record',
      'Template injection: {{constructor.constructor("alert(1)")()}}',
      'Content-Type sniffing: response without X-Content-Type-Options: nosniff',
    ],
    tips: 'Test both reflected (in URL) and stored (in database) XSS. Verify Content-Security-Policy header prevents inline script execution. Check that React auto-escapes output (but watch for dangerouslySetInnerHTML).',
  },
  {
    id: 21,
    category: 'security',
    title: 'Privilege Escalation: Role-Based Access',
    difficulty: 'Hard',
    description: 'Test whether a regular user can access admin-only endpoints or perform actions beyond their role permissions.',
    expectedBehavior: 'All endpoints should enforce role-based access control. Regular users should receive 403 Forbidden when accessing admin resources.',
    edgeCases: [
      'Regular user accessing /api/admin/users (should get 403)',
      'Modifying own role: PUT /api/users/self with {"role": "admin"}',
      'Accessing another user\'s account details by guessing account IDs (IDOR)',
      'Horizontal privilege: User A accessing User B\'s transactions',
      'Vertical privilege: Teller role accessing manager-only operations',
      'Parameter tampering: changing account_id in transfer request to another user\'s account',
      'Deleted user\'s token: can it still access resources?',
      'Role change during active session: demote user, verify immediate effect',
    ],
    tips: 'Create test accounts with different roles. Try every endpoint with each role. Use Insecure Direct Object Reference (IDOR) testing: change IDs in URLs and request bodies.',
  },
  // --- Performance Challenges ---
  {
    id: 22,
    category: 'performance',
    title: 'Load Testing: Transaction Processing',
    difficulty: 'Hard',
    description: 'Verify system behavior under expected and peak load conditions for the transaction processing API.',
    expectedBehavior: 'System should handle the expected concurrent user load (e.g., 100 users) with p95 response time under 2 seconds and zero data errors.',
    edgeCases: [
      'Baseline: 10 concurrent users, measure response times',
      'Expected load: 100 concurrent users for 10 minutes (steady state)',
      'Peak load: 500 concurrent users for 5 minutes (month-end simulation)',
      'Spike test: jump from 10 to 200 users instantly',
      'Soak test: 50 users for 4 hours (memory leak detection)',
      'Ramp-up: 0 to 100 users over 10 minutes (gradual increase)',
      'Mixed workload: 70% reads (balance inquiry) + 30% writes (transfers)',
      'Large response payload: list all transactions for high-volume account',
    ],
    tips: 'Use SoapUI LoadTest or dedicated tools (k6, Locust, JMeter). Monitor: response time (p50, p95, p99), error rate, throughput (TPS), server CPU/memory. Set SLA assertions.',
  },
  {
    id: 23,
    category: 'performance',
    title: 'Memory Leaks: Long-Running Operations',
    difficulty: 'Hard',
    description: 'Test for memory leaks in long-running API operations like report generation, batch processing, and continuous polling.',
    expectedBehavior: 'Memory usage should remain stable over time. After processing is complete, memory should be released back to the pool.',
    edgeCases: [
      'Generate large reports repeatedly: memory should not grow unboundedly',
      'Streaming large datasets: verify generators release memory as data is consumed',
      'Database connection leaks: connections not returned to pool after errors',
      'File handle leaks: temp files not cleaned up after processing',
      'Event listener accumulation: WebSocket connections never cleaned up',
      'Cache without eviction: unbounded cache growing over time',
      'Circular references preventing garbage collection',
    ],
    tips: 'Monitor /proc/PID/status (VmRSS) over time. Run soak tests for 2-4 hours. Compare memory before and after 10,000 requests. Check for unclosed database connections in finally blocks.',
  },
  {
    id: 24,
    category: 'performance',
    title: 'Slow Queries: Report Generation',
    difficulty: 'Medium',
    description: 'Identify and test slow database queries in the report generation module that may cause timeouts or poor user experience.',
    expectedBehavior: 'All reports should generate within 5 seconds. Queries should use indexes and avoid full table scans on tables with more than 1000 rows.',
    edgeCases: [
      'Monthly statement for an account with 50,000 transactions',
      'Cross-account summary report aggregating all customer data',
      'Date range queries without index on created_at column',
      'JOIN across 4+ tables with large row counts',
      'LIKE query with leading wildcard: LIKE "%search_term"',
      'ORDER BY on non-indexed column with LIMIT/OFFSET pagination',
      'Subquery in WHERE clause executed for every row (N+1 problem)',
      'COUNT(*) on entire table vs COUNT with WHERE clause',
    ],
    tips: 'Use EXPLAIN QUERY PLAN to analyze SQLite query execution. Add missing indexes. Test with realistic data volumes (not just 10 test rows). Set database timeouts.',
  },
  {
    id: 25,
    category: 'performance',
    title: 'Connection Pooling: Database Connections',
    difficulty: 'Medium',
    description: 'Test database connection pool behavior under various load conditions to ensure connections are properly managed.',
    expectedBehavior: 'Connection pool should maintain configured min/max connections, properly release connections after use, and handle exhaustion gracefully.',
    edgeCases: [
      'Pool exhaustion: more concurrent requests than max pool size',
      'Connection timeout: what happens when waiting for a connection exceeds timeout?',
      'Connection leak: request handler errors without releasing connection',
      'Stale connections: long-idle connections that the DB has dropped',
      'Pool warm-up: first N requests are slower while pool initializes',
      'Graceful degradation: pool full returns 503 instead of hanging indefinitely',
      'Connection validation: pool tests connections before handing them out',
    ],
    tips: 'For SQLite: verify WAL mode and busy_timeout are set. Monitor active connections. Simulate pool exhaustion by adding artificial delays in request handlers.',
  },
  {
    id: 26,
    category: 'api',
    title: 'API Versioning: Backward Compatibility',
    difficulty: 'Medium',
    description: 'Verify that API versioning works correctly and older clients can still use previous API versions without breaking.',
    expectedBehavior: 'V1 endpoints should continue to work after V2 is deployed. Response formats should match the requested version. Deprecated endpoints should return appropriate warnings.',
    edgeCases: [
      'Request /api/v1/accounts and /api/v2/accounts -- both should work',
      'V2 adds new required field -- V1 should not require it',
      'V1 client sends request to V2 endpoint (missing new fields)',
      'No version in URL: /api/accounts -- should route to latest or return 404?',
      'Deprecation header: Sunset: date, Deprecation: true',
      'Breaking change in V2: field renamed -- V1 response still uses old name',
      'Content negotiation: Accept: application/vnd.bank.v1+json',
    ],
    tips: 'Maintain a collection of V1 test requests and run them against V2 deployment. Verify backward compatibility is not broken. Check for deprecation headers.',
  },
  {
    id: 27,
    category: 'db',
    title: 'Data Migration: Schema Changes',
    difficulty: 'Hard',
    description: 'Test database migration scripts that modify the schema, ensuring data integrity is preserved and no data is lost during the migration.',
    expectedBehavior: 'All existing data should be preserved after migration. New columns should have correct default values. Indexes should be created on new columns.',
    edgeCases: [
      'Migration adds a NOT NULL column -- existing rows need default values',
      'Column type change: VARCHAR to INTEGER (data conversion)',
      'Table rename: verify all foreign keys and queries are updated',
      'Index creation on large table: performance impact during migration',
      'Rollback scenario: can the migration be reversed safely?',
      'Migration on a database with active connections',
      'Migration order: out-of-order execution (002 before 001)',
      'Idempotent migration: running the same migration twice should not error',
    ],
    tips: 'Always backup the database before testing migrations. Verify data counts before and after. Run SELECT queries to spot-check data integrity. Test with production-sized datasets.',
  },
];

const DIFFICULTY_COLORS = {
  Easy: { bg: '#dcfce7', color: '#166534', border: '#86efac' },
  Medium: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
  Hard: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: '0 0 20px 0',
    lineHeight: '1.6',
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  statCard: (color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#fff',
    border: `1px solid ${color}30`,
    borderLeft: `4px solid ${color}`,
    borderRadius: '10px',
    padding: '12px 18px',
    minWidth: '140px',
  }),
  statIcon: {
    fontSize: '20px',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: (color) => ({
    fontSize: '22px',
    fontWeight: '700',
    color,
    margin: 0,
    lineHeight: 1,
  }),
  statLabel: {
    fontSize: '11px',
    color: '#6b7280',
    margin: '2px 0 0 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    marginRight: '4px',
  },
  filterBtn: (active, color) => ({
    padding: '7px 16px',
    borderRadius: '20px',
    border: active ? `2px solid ${color}` : '1px solid #d1d5db',
    background: active ? `${color}15` : '#fff',
    color: active ? color : '#374151',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: active ? '600' : '400',
    transition: 'all 0.15s',
  }),
  difficultyFilter: (active, diff) => {
    const c = DIFFICULTY_COLORS[diff];
    return {
      padding: '5px 14px',
      borderRadius: '20px',
      border: active ? `2px solid ${c.border}` : `1px solid #d1d5db`,
      background: active ? c.bg : '#fff',
      color: active ? c.color : '#374151',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: active ? '600' : '400',
    };
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(520px, 1fr))',
    gap: '16px',
  },
  card: (borderColor) => ({
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderLeft: `4px solid ${borderColor}`,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s',
  }),
  cardHeader: {
    padding: '16px 18px 12px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  cardTopRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  cardTitle: {
    flex: 1,
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  diffBadge: (diff) => {
    const c = DIFFICULTY_COLORS[diff];
    return {
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      flexShrink: 0,
    };
  },
  catBadge: (color) => ({
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    background: `${color}15`,
    color: color,
    border: `1px solid ${color}40`,
    flexShrink: 0,
  }),
  cardDesc: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.5',
    margin: 0,
  },
  chevron: (open) => ({
    fontSize: '16px',
    color: '#94a3b8',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s',
    flexShrink: 0,
  }),
  cardBody: {
    padding: '0 18px 18px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '14px 0 8px 0',
  },
  expectedBox: {
    padding: '12px 14px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#166534',
    lineHeight: '1.5',
  },
  edgeCaseList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  edgeCaseItem: {
    padding: '6px 0 6px 20px',
    position: 'relative',
    fontSize: '13px',
    color: '#334155',
    lineHeight: '1.5',
  },
  edgeCaseBullet: {
    position: 'absolute',
    left: 0,
    top: '11px',
    width: '6px',
    height: '6px',
    background: '#f59e0b',
    borderRadius: '50%',
  },
  tipsBox: {
    padding: '12px 14px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#1e40af',
    lineHeight: '1.5',
  },
  completedBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: '600',
    background: '#dcfce7',
    color: '#166534',
    border: '1px solid #86efac',
    marginLeft: '6px',
    cursor: 'pointer',
  },
  incompleteBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: '600',
    background: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    marginLeft: '6px',
    cursor: 'pointer',
  },
};

function Challenges() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [completedIds, setCompletedIds] = useState(new Set());

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCompleted = (id, e) => {
    e.stopPropagation();
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = CHALLENGES.filter((c) => {
    if (activeCategory !== 'all' && c.category !== activeCategory) return false;
    if (activeDifficulty !== 'all' && c.difficulty !== activeDifficulty) return false;
    return true;
  });

  const getCategoryColor = (catId) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.color : '#6b7280';
  };

  const getCategoryLabel = (catId) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.label : catId;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Testing Challenges & Edge Cases</h1>
        <p style={styles.subtitle}>
          {CHALLENGES.length} challenges across {CATEGORIES.length} categories.
          Expand each challenge to see expected behavior, edge cases to test, and practical tips.
          Mark challenges as completed to track your progress.
        </p>
      </div>

      <div style={styles.statsRow}>
        {CATEGORIES.map((cat) => {
          const count = CHALLENGES.filter((c) => c.category === cat.id).length;
          const done = CHALLENGES.filter((c) => c.category === cat.id && completedIds.has(c.id)).length;
          return (
            <div key={cat.id} style={styles.statCard(cat.color)}>
              <span style={styles.statIcon}>{cat.icon}</span>
              <div style={styles.statInfo}>
                <p style={styles.statValue(cat.color)}>{done}/{count}</p>
                <p style={styles.statLabel}>{cat.label.replace(' Challenges', '')}</p>
              </div>
            </div>
          );
        })}
        <div style={styles.statCard('#10b981')}>
          <span style={styles.statIcon}>&#9989;</span>
          <div style={styles.statInfo}>
            <p style={styles.statValue('#10b981')}>{completedIds.size}/{CHALLENGES.length}</p>
            <p style={styles.statLabel}>Total Done</p>
          </div>
        </div>
      </div>

      <div style={styles.filterRow}>
        <span style={styles.filterLabel}>Category:</span>
        <button
          style={styles.filterBtn(activeCategory === 'all', '#6b7280')}
          onClick={() => setActiveCategory('all')}
        >
          All ({CHALLENGES.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            style={styles.filterBtn(activeCategory === cat.id, cat.color)}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.icon} {cat.label.replace(' Challenges', '')} ({CHALLENGES.filter((c) => c.category === cat.id).length})
          </button>
        ))}
      </div>

      <div style={{ ...styles.filterRow, marginBottom: '24px' }}>
        <span style={styles.filterLabel}>Difficulty:</span>
        <button
          style={styles.difficultyFilter(activeDifficulty === 'all', 'Medium')}
          onClick={() => setActiveDifficulty('all')}
        >
          All
        </button>
        {['Easy', 'Medium', 'Hard'].map((d) => (
          <button
            key={d}
            style={styles.difficultyFilter(activeDifficulty === d, d)}
            onClick={() => setActiveDifficulty(d)}
          >
            {d} ({CHALLENGES.filter((c) => c.difficulty === d).length})
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filtered.map((challenge) => {
          const isExpanded = expandedIds.has(challenge.id);
          const isDone = completedIds.has(challenge.id);
          const borderColor = getCategoryColor(challenge.category);

          return (
            <div key={challenge.id} style={styles.card(borderColor)}>
              <div style={styles.cardHeader} onClick={() => toggleExpand(challenge.id)}>
                <div style={styles.cardTopRow}>
                  <h3 style={styles.cardTitle}>
                    {challenge.title}
                    <span
                      style={isDone ? styles.completedBadge : styles.incompleteBadge}
                      onClick={(e) => toggleCompleted(challenge.id, e)}
                    >
                      {isDone ? 'Done' : 'Todo'}
                    </span>
                  </h3>
                  <span style={styles.catBadge(borderColor)}>
                    {getCategoryLabel(challenge.category).replace(' Challenges', '')}
                  </span>
                  <span style={styles.diffBadge(challenge.difficulty)}>
                    {challenge.difficulty}
                  </span>
                  <span style={styles.chevron(isExpanded)}>&#9662;</span>
                </div>
                <p style={styles.cardDesc}>{challenge.description}</p>
              </div>

              {isExpanded && (
                <div style={styles.cardBody}>
                  <p style={styles.sectionLabel}>Expected Behavior</p>
                  <div style={styles.expectedBox}>
                    {challenge.expectedBehavior}
                  </div>

                  <p style={styles.sectionLabel}>Edge Cases to Test ({challenge.edgeCases.length})</p>
                  <ul style={styles.edgeCaseList}>
                    {challenge.edgeCases.map((ec, idx) => (
                      <li key={idx} style={styles.edgeCaseItem}>
                        <span style={styles.edgeCaseBullet} />
                        {ec}
                      </li>
                    ))}
                  </ul>

                  <p style={styles.sectionLabel}>Tips</p>
                  <div style={styles.tipsBox}>
                    {challenge.tips}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>No challenges match the current filters.</p>
          <p style={{ fontSize: '14px', margin: 0 }}>Try selecting a different category or difficulty level.</p>
        </div>
      )}
    </div>
  );
}

export default Challenges;

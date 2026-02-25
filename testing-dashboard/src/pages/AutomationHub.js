import React, { useState } from 'react';

const TABS = [
  'Dashboard',
  'Selenium',
  'Cucumber BDD',
  'Appium Mobile',
  'Maven & TestNG',
  'Test Cases & Data',
  'Reports & Scores',
  'Admin & Setup'
];

// ========== AUTOMATION TEST CASES ==========
const AUTO_TEST_CASES = [
  { id: 'AT-001', module: 'Login', scenario: 'Valid login with correct credentials', type: 'Selenium', priority: 'P0', status: 'pass', time: '3.2s', data: '{"username":"rajesh.kumar","password":"Test@123"}' },
  { id: 'AT-002', module: 'Login', scenario: 'Login fails with wrong password', type: 'Selenium', priority: 'P0', status: 'pass', time: '2.8s', data: '{"username":"rajesh.kumar","password":"Wrong123"}' },
  { id: 'AT-003', module: 'Login', scenario: 'Account lockout after 5 failed attempts', type: 'Selenium', priority: 'P0', status: 'fail', time: '15.1s', data: '{"username":"rajesh.kumar","attempts":5}' },
  { id: 'AT-004', module: 'Login', scenario: 'Session timeout after 15 min idle', type: 'Selenium', priority: 'P1', status: 'pass', time: '5.4s', data: '{"idle_time":15}' },
  { id: 'AT-005', module: 'Transfer', scenario: 'Own account transfer - balance updated', type: 'Cucumber', priority: 'P0', status: 'pass', time: '4.5s', data: '{"from":"ACC-SAV-001","to":"ACC-CUR-001","amount":25000}' },
  { id: 'AT-006', module: 'Transfer', scenario: 'NEFT transfer to other bank', type: 'Cucumber', priority: 'P0', status: 'pass', time: '6.2s', data: '{"type":"NEFT","amount":50000,"ifsc":"HDFC0001234"}' },
  { id: 'AT-007', module: 'Transfer', scenario: 'Transfer with insufficient balance', type: 'Cucumber', priority: 'P0', status: 'pass', time: '2.1s', data: '{"amount":99999999}' },
  { id: 'AT-008', module: 'Transfer', scenario: 'Daily transfer limit exceeded', type: 'Cucumber', priority: 'P1', status: 'blocked', time: '-', data: '{"amount":10000001}' },
  { id: 'AT-009', module: 'Transfer', scenario: 'OTP verification for high-value transfer', type: 'Selenium', priority: 'P0', status: 'pass', time: '8.3s', data: '{"amount":100000,"otp":"123456"}' },
  { id: 'AT-010', module: 'Accounts', scenario: 'View all accounts with balance', type: 'Selenium', priority: 'P0', status: 'pass', time: '2.5s', data: '{"customer_id":"CUST001"}' },
  { id: 'AT-011', module: 'Accounts', scenario: 'Download account statement PDF', type: 'Selenium', priority: 'P1', status: 'pass', time: '4.8s', data: '{"format":"PDF","date_range":"30days"}' },
  { id: 'AT-012', module: 'Accounts', scenario: 'Filter accounts by type', type: 'Selenium', priority: 'P1', status: 'pass', time: '1.9s', data: '{"filter":"savings"}' },
  { id: 'AT-013', module: 'API', scenario: 'GET /api/customers returns 200', type: 'REST Assured', priority: 'P0', status: 'pass', time: '0.3s', data: '{"method":"GET","endpoint":"/api/customers"}' },
  { id: 'AT-014', module: 'API', scenario: 'POST /api/sql/execute - valid query', type: 'REST Assured', priority: 'P0', status: 'pass', time: '0.5s', data: '{"query":"SELECT COUNT(*) FROM customers"}' },
  { id: 'AT-015', module: 'API', scenario: 'GET /api/customers/99999 returns 404', type: 'REST Assured', priority: 'P1', status: 'pass', time: '0.2s', data: '{"id":99999}' },
  { id: 'AT-016', module: 'API', scenario: 'SQL injection attempt blocked', type: 'REST Assured', priority: 'P0', status: 'pass', time: '0.4s', data: '{"query":"SELECT * FROM customers; DROP TABLE users;"}' },
  { id: 'AT-017', module: 'API', scenario: 'API response schema validation', type: 'REST Assured', priority: 'P1', status: 'pass', time: '0.6s', data: '{"validate":"schema"}' },
  { id: 'AT-018', module: 'Mobile', scenario: 'Android app login with fingerprint', type: 'Appium', priority: 'P0', status: 'not_run', time: '-', data: '{"platform":"android","auth":"fingerprint"}' },
  { id: 'AT-019', module: 'Mobile', scenario: 'iOS app login with Face ID', type: 'Appium', priority: 'P0', status: 'not_run', time: '-', data: '{"platform":"ios","auth":"faceID"}' },
  { id: 'AT-020', module: 'Mobile', scenario: 'Mobile UPI fund transfer', type: 'Appium', priority: 'P0', status: 'not_run', time: '-', data: '{"upi":"friend@upi","amount":500}' },
  { id: 'AT-021', module: 'Mobile', scenario: 'Push notification on transaction', type: 'Appium', priority: 'P1', status: 'not_run', time: '-', data: '{"type":"push","event":"transaction"}' },
  { id: 'AT-022', module: 'Mobile', scenario: 'App orientation change - no data loss', type: 'Appium', priority: 'P2', status: 'not_run', time: '-', data: '{"orientation":"landscape"}' },
  { id: 'AT-023', module: 'Mobile', scenario: 'Offline mode - cached data displayed', type: 'Appium', priority: 'P1', status: 'not_run', time: '-', data: '{"network":"offline"}' },
  { id: 'AT-024', module: 'Mobile', scenario: 'Cross-platform session sync', type: 'Appium', priority: 'P0', status: 'not_run', time: '-', data: '{"platforms":["web","android","ios"]}' },
  { id: 'AT-025', module: 'Bills', scenario: 'Pay electricity bill successfully', type: 'Cucumber', priority: 'P1', status: 'pass', time: '3.7s', data: '{"biller":"MSEB","amount":2500}' },
  { id: 'AT-026', module: 'Bills', scenario: 'Schedule recurring bill payment', type: 'Cucumber', priority: 'P1', status: 'pass', time: '4.1s', data: '{"recurring":true,"frequency":"monthly"}' },
  { id: 'AT-027', module: 'Loans', scenario: 'EMI calculator accuracy', type: 'Selenium', priority: 'P1', status: 'pass', time: '2.3s', data: '{"principal":500000,"rate":8.5,"tenure":60}' },
  { id: 'AT-028', module: 'Loans', scenario: 'Loan application submission', type: 'Cucumber', priority: 'P1', status: 'fail', time: '7.8s', data: '{"type":"home","amount":5000000}' },
  { id: 'AT-029', module: 'Cards', scenario: 'Block/unblock debit card', type: 'Selenium', priority: 'P1', status: 'pass', time: '3.1s', data: '{"card":"****1234","action":"block"}' },
  { id: 'AT-030', module: 'Cards', scenario: 'Set daily transaction limit', type: 'Selenium', priority: 'P1', status: 'pass', time: '2.7s', data: '{"limit":50000}' },
  { id: 'AT-031', module: 'DB', scenario: 'Transaction audit trail populated', type: 'REST Assured', priority: 'P1', status: 'pass', time: '0.8s', data: '{"table":"audit_log"}' },
  { id: 'AT-032', module: 'DB', scenario: 'Account balance = sum of transactions', type: 'REST Assured', priority: 'P0', status: 'pass', time: '1.2s', data: '{"validate":"balance_integrity"}' },
  { id: 'AT-033', module: 'Security', scenario: 'XSS attack prevention', type: 'REST Assured', priority: 'P0', status: 'pass', time: '0.5s', data: '{"input":"<script>alert(1)</script>"}' },
  { id: 'AT-034', module: 'Security', scenario: 'CSRF token validation', type: 'Selenium', priority: 'P0', status: 'pass', time: '3.4s', data: '{"validate":"csrf_token"}' },
  { id: 'AT-035', module: 'Security', scenario: 'Password encryption at rest', type: 'REST Assured', priority: 'P0', status: 'pass', time: '0.6s', data: '{"validate":"encryption"}' },
];

// ========== SELENIUM OPERATIONS ==========
const SELENIUM_OPS = [
  { op: 'Browser Launch', cmd: 'WebDriver driver = new ChromeDriver()', desc: 'Initialize Chrome browser with WebDriverManager auto-download', category: 'Setup' },
  { op: 'Navigate to URL', cmd: 'driver.get("https://banking.com")', desc: 'Open URL and wait for page load', category: 'Navigation' },
  { op: 'Find Element by ID', cmd: 'driver.findElement(By.id("username"))', desc: 'Locate element using unique ID attribute', category: 'Locator' },
  { op: 'Find by CSS Selector', cmd: 'driver.findElement(By.cssSelector(".btn-primary"))', desc: 'Locate element using CSS selector', category: 'Locator' },
  { op: 'Find by XPath', cmd: 'driver.findElement(By.xpath("//input[@type=\'submit\']"))', desc: 'Locate element using XPath expression', category: 'Locator' },
  { op: 'Click Element', cmd: 'element.click()', desc: 'Click on a web element (button, link, checkbox)', category: 'Action' },
  { op: 'Type Text', cmd: 'element.sendKeys("text")', desc: 'Enter text into input field', category: 'Action' },
  { op: 'Clear Field', cmd: 'element.clear()', desc: 'Clear existing text from input field', category: 'Action' },
  { op: 'Get Text', cmd: 'element.getText()', desc: 'Retrieve visible text of element', category: 'Action' },
  { op: 'Get Attribute', cmd: 'element.getAttribute("value")', desc: 'Get value of HTML attribute', category: 'Action' },
  { op: 'Explicit Wait', cmd: 'new WebDriverWait(driver, 15).until(ExpectedConditions.visibilityOf(el))', desc: 'Wait for specific condition before proceeding', category: 'Wait' },
  { op: 'Fluent Wait', cmd: 'new FluentWait(driver).withTimeout(30s).pollingEvery(2s)', desc: 'Custom polling wait with exception handling', category: 'Wait' },
  { op: 'Select Dropdown', cmd: 'new Select(element).selectByVisibleText("Savings")', desc: 'Select option from dropdown menu', category: 'Action' },
  { op: 'Handle Alert', cmd: 'driver.switchTo().alert().accept()', desc: 'Accept/dismiss JavaScript alert popup', category: 'Action' },
  { op: 'Switch to Frame', cmd: 'driver.switchTo().frame("frameId")', desc: 'Switch context to iframe element', category: 'Navigation' },
  { op: 'Switch Window', cmd: 'driver.switchTo().window(handle)', desc: 'Switch to different browser window/tab', category: 'Navigation' },
  { op: 'Take Screenshot', cmd: '((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE)', desc: 'Capture page screenshot for evidence', category: 'Utility' },
  { op: 'Execute JavaScript', cmd: '((JavascriptExecutor) driver).executeScript("scroll")', desc: 'Execute JavaScript in browser context', category: 'Utility' },
  { op: 'Mouse Hover', cmd: 'new Actions(driver).moveToElement(element).perform()', desc: 'Hover mouse over element', category: 'Action' },
  { op: 'Drag & Drop', cmd: 'new Actions(driver).dragAndDrop(source, target).perform()', desc: 'Drag element to target location', category: 'Action' },
  { op: 'File Upload', cmd: 'element.sendKeys("/path/to/file.pdf")', desc: 'Upload file via file input element', category: 'Action' },
  { op: 'Browser Maximize', cmd: 'driver.manage().window().maximize()', desc: 'Maximize browser window', category: 'Setup' },
  { op: 'Browser Close', cmd: 'driver.quit()', desc: 'Close all windows and end session', category: 'Teardown' },
  { op: 'Cookies Management', cmd: 'driver.manage().getCookies()', desc: 'Get/add/delete browser cookies', category: 'Utility' },
  { op: 'Assert Equals', cmd: 'Assert.assertEquals(actual, expected)', desc: 'Verify actual matches expected value', category: 'Assertion' },
];

// ========== CUCUMBER OPERATIONS ==========
const CUCUMBER_OPS = [
  { keyword: 'Feature', syntax: 'Feature: Fund Transfer', desc: 'Describes the feature being tested', example: 'Feature: Customer Login Authentication' },
  { keyword: 'Scenario', syntax: 'Scenario: Valid login', desc: 'Single test scenario with steps', example: 'Scenario: Successful login with valid credentials' },
  { keyword: 'Scenario Outline', syntax: 'Scenario Outline: Login validation', desc: 'Data-driven scenario with Examples table', example: 'Scenario Outline: Invalid credentials\n  Examples:\n    | username | password |' },
  { keyword: 'Given', syntax: 'Given I am on login page', desc: 'Precondition / Initial state', example: 'Given I am logged in as customer "CUST001"' },
  { keyword: 'When', syntax: 'When I click login button', desc: 'Action / Trigger event', example: 'When I enter transfer amount "25000"' },
  { keyword: 'Then', syntax: 'Then I should see dashboard', desc: 'Expected outcome / Assertion', example: 'Then I should see success message "Transfer Successful"' },
  { keyword: 'And', syntax: 'And I enter password', desc: 'Additional step (Given/When/Then)', example: 'And source account balance should decrease by 25000' },
  { keyword: 'But', syntax: 'But error should not appear', desc: 'Negative additional step', example: 'But the account should not be debited' },
  { keyword: 'Background', syntax: 'Background:', desc: 'Steps that run before every scenario in feature', example: 'Background:\n  Given I am on the banking login page' },
  { keyword: 'Examples', syntax: 'Examples:', desc: 'Data table for Scenario Outline', example: 'Examples:\n  | amount | error_message |' },
  { keyword: '@tag', syntax: '@smoke @P0', desc: 'Tags for categorizing/filtering scenarios', example: '@banking @transfer @regression' },
  { keyword: 'Data Tables', syntax: '| col1 | col2 |', desc: 'Structured data passed to steps', example: '| Account | Balance |\n| SAV-001 | 150000  |' },
  { keyword: 'Doc Strings', syntax: '"""json"""', desc: 'Multi-line text/JSON in steps', example: '"""\n{"username":"test","password":"pass"}\n"""' },
  { keyword: '@Before', syntax: '@Before public void setup()', desc: 'Hook that runs before each scenario', example: '@Before("@banking")\npublic void setupBrowser() { ... }' },
  { keyword: '@After', syntax: '@After public void teardown()', desc: 'Hook that runs after each scenario', example: '@After\npublic void takeScreenshotOnFailure() { ... }' },
];

// ========== APPIUM OPERATIONS ==========
const APPIUM_OPS = [
  { category: 'Setup', ops: [
    { op: 'Install Appium Server', cmd: 'npm install -g appium', desc: 'Install Appium globally via npm' },
    { op: 'Install Android Driver', cmd: 'appium driver install uiautomator2', desc: 'Install UiAutomator2 driver for Android' },
    { op: 'Install iOS Driver', cmd: 'appium driver install xcuitest', desc: 'Install XCUITest driver for iOS' },
    { op: 'Start Appium Server', cmd: 'appium -p 4723', desc: 'Start Appium server on port 4723' },
    { op: 'Appium Inspector', cmd: 'appium-inspector', desc: 'GUI tool to inspect mobile elements' },
  ]},
  { category: 'Android', ops: [
    { op: 'Launch Android App', cmd: 'new AndroidDriver(url, capabilities)', desc: 'Initialize Android driver with capabilities' },
    { op: 'Tap Element', cmd: 'driver.findElement(By.id("login")).click()', desc: 'Tap on mobile element' },
    { op: 'Swipe Up', cmd: 'new TouchAction(driver).swipe(startX, startY, endX, endY)', desc: 'Swipe gesture on screen' },
    { op: 'Scroll to Element', cmd: 'UiScrollable(new UiSelector().scrollable(true))', desc: 'Scroll until element visible' },
    { op: 'Toggle WiFi', cmd: 'driver.toggleWifi()', desc: 'Toggle WiFi on/off for network tests' },
    { op: 'App Background', cmd: 'driver.runAppInBackground(Duration.ofSeconds(5))', desc: 'Send app to background' },
    { op: 'Device Rotation', cmd: 'driver.rotate(ScreenOrientation.LANDSCAPE)', desc: 'Rotate device orientation' },
    { op: 'Push Notification', cmd: 'driver.openNotifications()', desc: 'Open notification shade' },
  ]},
  { category: 'iOS', ops: [
    { op: 'Launch iOS App', cmd: 'new IOSDriver(url, capabilities)', desc: 'Initialize iOS driver with XCUITest' },
    { op: 'Face ID Auth', cmd: 'driver.executeScript("mobile: enrollBiometric")', desc: 'Simulate Face ID authentication' },
    { op: 'Touch ID Auth', cmd: 'driver.fingerPrint(1)', desc: 'Simulate Touch ID fingerprint' },
    { op: 'Shake Device', cmd: 'driver.shake()', desc: 'Simulate device shake gesture' },
    { op: 'Get Battery Info', cmd: 'driver.getBatteryInfo()', desc: 'Get device battery level/state' },
  ]},
  { category: 'Cross-Platform', ops: [
    { op: 'Find by Accessibility ID', cmd: 'By.accessibilityId("loginBtn")', desc: 'Cross-platform element locator' },
    { op: 'Take Screenshot', cmd: 'driver.getScreenshotAs(OutputType.FILE)', desc: 'Capture mobile screenshot' },
    { op: 'Get Page Source', cmd: 'driver.getPageSource()', desc: 'Get XML page source for debugging' },
    { op: 'Install App', cmd: 'driver.installApp("/path/to/app.apk")', desc: 'Install app on device' },
    { op: 'Remove App', cmd: 'driver.removeApp("com.banking.app")', desc: 'Uninstall app from device' },
    { op: 'Reset App', cmd: 'driver.resetApp()', desc: 'Reset app state (clear data)' },
  ]}
];

// ========== MAVEN COMMANDS ==========
const MAVEN_COMMANDS = [
  { cmd: 'mvn clean', desc: 'Clean build artifacts (target/ directory)', category: 'Build' },
  { cmd: 'mvn compile', desc: 'Compile source code', category: 'Build' },
  { cmd: 'mvn test', desc: 'Run all tests (default testng.xml)', category: 'Test' },
  { cmd: 'mvn test -Psmoke', desc: 'Run smoke tests profile', category: 'Test' },
  { cmd: 'mvn test -Pregression', desc: 'Run regression tests profile', category: 'Test' },
  { cmd: 'mvn test -Pmobile', desc: 'Run mobile tests profile (Appium)', category: 'Test' },
  { cmd: 'mvn test -Dbrowser=firefox', desc: 'Run tests on Firefox browser', category: 'Test' },
  { cmd: 'mvn test -Dheadless=true', desc: 'Run tests in headless mode (CI/CD)', category: 'Test' },
  { cmd: 'mvn test -Dcucumber.filter.tags="@smoke"', desc: 'Run only @smoke tagged scenarios', category: 'Cucumber' },
  { cmd: 'mvn test -Dcucumber.filter.tags="@P0 and @banking"', desc: 'Run P0 banking tests only', category: 'Cucumber' },
  { cmd: 'mvn test -Dcucumber.filter.tags="not @mobile"', desc: 'Exclude mobile tests', category: 'Cucumber' },
  { cmd: 'mvn verify', desc: 'Run tests + generate Cucumber reports', category: 'Report' },
  { cmd: 'mvn surefire-report:report', desc: 'Generate Surefire HTML report', category: 'Report' },
  { cmd: 'mvn dependency:tree', desc: 'Show all project dependencies', category: 'Info' },
  { cmd: 'mvn versions:display-dependency-updates', desc: 'Check for dependency updates', category: 'Info' },
  { cmd: 'mvn clean install -DskipTests', desc: 'Build JAR without running tests', category: 'Build' },
];

// ========== TESTNG OPERATIONS ==========
const TESTNG_OPS = [
  { feature: 'Annotations', items: ['@Test — Mark method as test', '@BeforeMethod / @AfterMethod — Run before/after each test', '@BeforeClass / @AfterClass — Run before/after test class', '@BeforeSuite / @AfterSuite — Run before/after entire suite', '@DataProvider — Supply test data to methods', '@Parameters — Inject parameters from testng.xml'] },
  { feature: 'Parallel Execution', items: ['parallel="methods" — Run test methods in parallel', 'parallel="tests" — Run <test> tags in parallel', 'parallel="classes" — Run classes in parallel', 'parallel="instances" — Run instances in parallel', 'thread-count="5" — Number of parallel threads'] },
  { feature: 'Test Groups', items: ['groups = {"smoke", "regression"} — Categorize tests', 'dependsOnGroups — Set group dependencies', 'includedGroups/excludedGroups in testng.xml', 'Run specific groups: <groups><run><include name="smoke"/></run></groups>'] },
  { feature: 'Data-Driven Testing', items: ['@DataProvider(name="loginData") — Define data source', '@Test(dataProvider="loginData") — Consume data', 'Return Object[][] for multiple test iterations', 'Excel/CSV reader + DataProvider pattern', 'parallel=true in DataProvider for parallel data'] },
  { feature: 'Assertions', items: ['Assert.assertEquals(actual, expected)', 'Assert.assertTrue(condition, message)', 'Assert.assertNotNull(object)', 'SoftAssert — Collect all failures before reporting', 'Assert.fail("message") — Force test failure'] },
  { feature: 'Listeners & Reporting', items: ['ITestListener — onTestStart, onTestSuccess, onTestFailure', 'IReporter — Custom report generation', 'IRetryAnalyzer — Retry failed tests automatically', 'ISuiteListener — Suite-level events', 'ExtentReports integration for HTML reports'] },
];

// ========== ADMIN TASKS ==========
const ADMIN_TASKS = [
  { task: 'Environment Setup', steps: ['Install Java JDK 21', 'Install Maven 3.9.x', 'Install Node.js (for Appium)', 'Install Android Studio (for emulators)', 'Install Xcode (for iOS, Mac only)', 'Clone automation repo', 'Run mvn compile to download deps'], status: 'done' },
  { task: 'Browser Driver Setup', steps: ['WebDriverManager auto-downloads drivers', 'Chrome: chromedriver auto-managed', 'Firefox: geckodriver auto-managed', 'Edge: msedgedriver auto-managed', 'Verify: mvn test -Dtest=SmokeTestRunner'], status: 'done' },
  { task: 'Appium Server Setup', steps: ['npm install -g appium', 'appium driver install uiautomator2', 'appium driver install xcuitest', 'Start: appium -p 4723', 'Verify: curl http://localhost:4723/status'], status: 'pending' },
  { task: 'CI/CD Integration', steps: ['Configure GitHub Actions workflow', 'Set browser=chrome, headless=true', 'Run mvn test -Psmoke in pipeline', 'Upload test reports as artifacts', 'Notify Slack/email on failure'], status: 'pending' },
  { task: 'Test Data Management', steps: ['Create Excel test data files', 'Seed database with test data', 'Configure config.properties per env', 'Set up test data cleanup scripts', 'Version control test data'], status: 'in_progress' },
  { task: 'Reporting Setup', steps: ['Extent Reports configured via adapter', 'Cucumber HTML reports in target/', 'TestNG Surefire reports', 'Screenshot capture on failure', 'Email report distribution'], status: 'done' },
];

export default function AutomationHub() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});
  const [filterModule, setFilterModule] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const toggle = (key) => setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredTests = AUTO_TEST_CASES.filter(tc =>
    (filterModule === 'all' || tc.module === filterModule) &&
    (filterType === 'all' || tc.type === filterType) &&
    (filterStatus === 'all' || tc.status === filterStatus)
  );

  const stats = {
    total: AUTO_TEST_CASES.length,
    pass: AUTO_TEST_CASES.filter(t => t.status === 'pass').length,
    fail: AUTO_TEST_CASES.filter(t => t.status === 'fail').length,
    blocked: AUTO_TEST_CASES.filter(t => t.status === 'blocked').length,
    notRun: AUTO_TEST_CASES.filter(t => t.status === 'not_run').length,
  };
  const passRate = stats.total > 0 ? ((stats.pass / stats.total) * 100).toFixed(1) : 0;
  const executedCount = stats.pass + stats.fail;
  const executionRate = stats.total > 0 ? ((executedCount / stats.total) * 100).toFixed(1) : 0;

  const modules = ['all', ...new Set(AUTO_TEST_CASES.map(t => t.module))];
  const types = ['all', ...new Set(AUTO_TEST_CASES.map(t => t.type))];

  const renderTab = () => {
    switch (activeTab) {
      case 0: // Dashboard
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Total Tests', value: stats.total, color: '#4f46e5' },
                { label: 'Passed', value: stats.pass, color: '#22c55e' },
                { label: 'Failed', value: stats.fail, color: '#dc2626' },
                { label: 'Blocked', value: stats.blocked, color: '#f59e0b' },
                { label: 'Not Run', value: stats.notRun, color: '#94a3b8' },
                { label: 'Pass Rate', value: passRate + '%', color: parseFloat(passRate) >= 80 ? '#22c55e' : '#dc2626' },
                { label: 'Execution Rate', value: executionRate + '%', color: '#06b6d4' },
                { label: 'Automation Score', value: Math.round((executedCount / stats.total) * 100) + '/100', color: '#8b5cf6' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16, textAlign: 'center', borderTop: `3px solid ${s.color}` }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <h4 style={{ marginBottom: 10 }}>Test Coverage by Module</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 20 }}>
              {['Login', 'Transfer', 'Accounts', 'API', 'Mobile', 'Bills', 'Loans', 'Cards', 'DB', 'Security'].map(mod => {
                const modTests = AUTO_TEST_CASES.filter(t => t.module === mod);
                const modPass = modTests.filter(t => t.status === 'pass').length;
                const pct = modTests.length > 0 ? Math.round((modPass / modTests.length) * 100) : 0;
                return (
                  <div key={mod} style={{ background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <strong style={{ fontSize: 13 }}>{mod}</strong>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{modPass}/{modTests.length}</span>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: pct + '%', background: pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#dc2626', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, textAlign: 'right' }}>{pct}%</div>
                  </div>
                );
              })}
            </div>

            <h4 style={{ marginBottom: 10 }}>Test by Tool</h4>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Selenium', 'Cucumber', 'REST Assured', 'Appium'].map(tool => {
                const count = AUTO_TEST_CASES.filter(t => t.type === tool).length;
                const passCount = AUTO_TEST_CASES.filter(t => t.type === tool && t.status === 'pass').length;
                return (
                  <div key={tool} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: '12px 20px', textAlign: 'center', flex: '1 1 150px' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#4f46e5' }}>{count}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{tool}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{passCount} passed</div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 1: // Selenium
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Selenium WebDriver Operations ({SELENIUM_OPS.length})</h3>
            {['Setup', 'Navigation', 'Locator', 'Action', 'Wait', 'Assertion', 'Utility', 'Teardown'].map(cat => {
              const ops = SELENIUM_OPS.filter(o => o.category === cat);
              if (ops.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#4f46e5' }}>{cat}</h4>
                  {ops.map((o, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 14px', background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 6, alignItems: 'center' }}>
                      <strong style={{ fontSize: 13, minWidth: 160, color: '#1e293b' }}>{o.op}</strong>
                      <code style={{ fontSize: 11, color: '#4f46e5', background: '#f0f4ff', padding: '2px 8px', borderRadius: 4, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.cmd}</code>
                      <span style={{ fontSize: 11, color: '#64748b', minWidth: 200 }}>{o.desc}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        );

      case 2: // Cucumber
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Cucumber BDD — Gherkin Keywords & Feature Files</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Keyword</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Syntax</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {CUCUMBER_OPS.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => toggle(`cuc-${i}`)}>
                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#4f46e5' }}>{c.keyword}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 11 }}>{c.syntax}</td>
                    <td style={{ padding: '8px 12px', color: '#64748b' }}>
                      {c.desc}
                      {expandedItems[`cuc-${i}`] && (
                        <pre style={{ background: '#0f172a', color: '#38bdf8', padding: 10, borderRadius: 4, marginTop: 6, fontSize: 11, whiteSpace: 'pre-wrap' }}>{c.example}</pre>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ marginBottom: 10 }}>Feature Files in Project</h4>
            {['login.feature', 'fund_transfer.feature', 'accounts.feature', 'mobile_banking.feature', 'api_testing.feature'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 6 }}>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>&#9733;</span>
                <code style={{ fontSize: 12, color: '#4f46e5' }}>src/test/resources/features/{f}</code>
                <span style={{ fontSize: 11, color: '#64748b', marginLeft: 'auto' }}>
                  {f === 'login.feature' ? '7 scenarios' : f === 'fund_transfer.feature' ? '7 scenarios' : f === 'accounts.feature' ? '5 scenarios' : f === 'mobile_banking.feature' ? '14 scenarios' : '10 scenarios'}
                </span>
              </div>
            ))}
          </div>
        );

      case 3: // Appium
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Appium Mobile Testing — Android, iOS, Cross-Platform</h3>
            {APPIUM_OPS.map((cat, ci) => (
              <div key={ci} style={{ marginBottom: 20 }}>
                <h4 style={{ margin: '0 0 10px', fontSize: 15, color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: 6 }}>{cat.category}</h4>
                {cat.ops.map((o, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 14px', background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 6, alignItems: 'center' }}>
                    <strong style={{ fontSize: 13, minWidth: 180, color: '#1e293b' }}>{o.op}</strong>
                    <code style={{ fontSize: 11, color: '#4f46e5', background: '#f0f4ff', padding: '2px 8px', borderRadius: 4, flex: 1 }}>{o.cmd}</code>
                    <span style={{ fontSize: 11, color: '#64748b', minWidth: 180 }}>{o.desc}</span>
                  </div>
                ))}
              </div>
            ))}

            <h4 style={{ margin: '20px 0 10px' }}>Mobile Testing Types</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
              {[
                { type: 'Native App Testing', desc: 'Test apps built with Android SDK / iOS SDK. Full access to device features (camera, GPS, sensors).', tools: 'Appium + UiAutomator2 / XCUITest' },
                { type: 'Hybrid App Testing', desc: 'Test apps with native container + WebView. Switch between native and web contexts.', tools: 'Appium + ChromeDriver for WebView' },
                { type: 'Mobile Web Testing', desc: 'Test responsive websites on mobile browsers. Same Selenium approach with mobile capabilities.', tools: 'Selenium + Mobile Chrome/Safari' },
                { type: 'Cross-Platform Testing', desc: 'Single test for both Android and iOS using Accessibility IDs. Maximize code reuse.', tools: 'Appium + Accessibility ID locators' },
              ].map((t, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 14 }}>
                  <strong style={{ fontSize: 14, color: '#4f46e5' }}>{t.type}</strong>
                  <p style={{ margin: '6px 0', fontSize: 12, color: '#64748b' }}>{t.desc}</p>
                  <div style={{ fontSize: 11, padding: '4px 8px', background: '#f0fdf4', borderRadius: 4, color: '#166534' }}>{t.tools}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4: // Maven & TestNG
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Maven Commands</h3>
            {['Build', 'Test', 'Cucumber', 'Report', 'Info'].map(cat => {
              const cmds = MAVEN_COMMANDS.filter(c => c.category === cat);
              return (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#4f46e5' }}>{cat}</h4>
                  {cmds.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 14px', background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 6, alignItems: 'center' }}>
                      <code style={{ fontSize: 12, color: '#1e293b', fontWeight: 600, minWidth: 350 }}>{c.cmd}</code>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{c.desc}</span>
                    </div>
                  ))}
                </div>
              );
            })}

            <h3 style={{ margin: '24px 0 16px' }}>TestNG Features & Operations</h3>
            {TESTNG_OPS.map((t, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 10, overflow: 'hidden' }}>
                <div onClick={() => toggle(`tng-${i}`)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', background: expandedItems[`tng-${i}`] ? '#f0f4ff' : '#fff' }}>
                  <strong style={{ fontSize: 14 }}>{t.feature}</strong>
                  <span style={{ color: '#94a3b8' }}>{expandedItems[`tng-${i}`] ? '\u25B2' : '\u25BC'}</span>
                </div>
                {expandedItems[`tng-${i}`] && (
                  <ul style={{ margin: 0, padding: '8px 18px 14px 36px', borderTop: '1px solid #e2e8f0' }}>
                    {t.items.map((item, j) => (
                      <li key={j} style={{ marginBottom: 5, fontSize: 13, color: '#475569', fontFamily: item.includes('—') ? 'inherit' : 'monospace' }}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case 5: // Test Cases & Data
        return (
          <div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <select value={filterModule} onChange={e => setFilterModule(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 12 }}>
                {modules.map(m => <option key={m} value={m}>{m === 'all' ? 'All Modules' : m}</option>)}
              </select>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 12 }}>
                {types.map(t => <option key={t} value={t}>{t === 'all' ? 'All Tools' : t}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 12 }}>
                <option value="all">All Status</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
                <option value="blocked">Blocked</option>
                <option value="not_run">Not Run</option>
              </select>
              <span style={{ fontSize: 12, color: '#64748b', padding: '8px 0' }}>Showing {filteredTests.length} of {stats.total} tests</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>ID</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Module</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Scenario</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Tool</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Priority</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Time</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((tc, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 10px', fontFamily: 'monospace', color: '#4f46e5', fontWeight: 600 }}>{tc.id}</td>
                    <td style={{ padding: '6px 10px' }}>{tc.module}</td>
                    <td style={{ padding: '6px 10px', maxWidth: 250 }}>{tc.scenario}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: '#eff6ff', color: '#2563eb', fontWeight: 600 }}>{tc.type}</span>
                    </td>
                    <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: tc.priority === 'P0' ? '#fef2f2' : '#fef3c7', color: tc.priority === 'P0' ? '#dc2626' : '#92400e', fontWeight: 700 }}>{tc.priority}</span>
                    </td>
                    <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, fontWeight: 700,
                        background: tc.status === 'pass' ? '#dcfce7' : tc.status === 'fail' ? '#fef2f2' : tc.status === 'blocked' ? '#fef3c7' : '#f1f5f9',
                        color: tc.status === 'pass' ? '#166534' : tc.status === 'fail' ? '#dc2626' : tc.status === 'blocked' ? '#92400e' : '#64748b'
                      }}>{tc.status}</span>
                    </td>
                    <td style={{ padding: '6px 10px', textAlign: 'center', fontSize: 11, color: '#64748b' }}>{tc.time}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                      <button onClick={() => toggle(`data-${i}`)} style={{ padding: '2px 8px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 3, cursor: 'pointer', fontSize: 10 }}>
                        {expandedItems[`data-${i}`] ? 'Hide' : 'JSON'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {Object.keys(expandedItems).filter(k => k.startsWith('data-') && expandedItems[k]).map(k => {
              const idx = parseInt(k.split('-')[1]);
              const tc = filteredTests[idx];
              if (!tc) return null;
              return (
                <pre key={k} style={{ background: '#1e293b', color: '#e2e8f0', padding: 12, borderRadius: 6, fontSize: 11, margin: '8px 0' }}>
                  {tc.id}: {JSON.stringify(JSON.parse(tc.data), null, 2)}
                </pre>
              );
            })}
          </div>
        );

      case 6: // Reports & Scores
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Automation Test Reports</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { name: 'Extent Report', path: 'target/extent-reports/index.html', desc: 'Rich HTML report with screenshots, step details, and charts', format: 'HTML' },
                { name: 'Cucumber HTML Report', path: 'target/cucumber-reports/smoke-report.html', desc: 'Feature-based report showing Gherkin scenarios and step results', format: 'HTML' },
                { name: 'Cucumber JSON Report', path: 'target/cucumber-reports/smoke-report.json', desc: 'Machine-readable report for CI/CD integration and dashboards', format: 'JSON' },
                { name: 'TestNG Surefire Report', path: 'target/surefire-reports/index.html', desc: 'Maven test execution summary with pass/fail/skip counts', format: 'HTML' },
                { name: 'Maven Cucumber Report', path: 'target/cucumber-reports/overview-features.html', desc: 'Aggregated report with feature/scenario/step breakdown', format: 'HTML' },
                { name: 'Screenshot Archive', path: 'reports/screenshots/', desc: 'Failure screenshots organized by test name and timestamp', format: 'PNG' },
              ].map((r, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <strong style={{ fontSize: 14 }}>{r.name}</strong>
                    <span style={{ fontSize: 10, padding: '2px 8px', background: '#eff6ff', color: '#2563eb', borderRadius: 4, fontWeight: 600 }}>{r.format}</span>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 12, color: '#64748b' }}>{r.desc}</p>
                  <code style={{ fontSize: 11, color: '#4f46e5', background: '#f0f4ff', padding: '2px 6px', borderRadius: 3 }}>{r.path}</code>
                </div>
              ))}
            </div>

            <h3 style={{ margin: '20px 0 12px' }}>Automation Score Card</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Metric</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Value</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Target</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: 'Total Automated Test Cases', value: stats.total, target: '50+', met: stats.total >= 50 },
                  { metric: 'Pass Rate', value: passRate + '%', target: '> 85%', met: parseFloat(passRate) >= 85 },
                  { metric: 'Execution Coverage', value: executionRate + '%', target: '> 90%', met: parseFloat(executionRate) >= 90 },
                  { metric: 'Selenium Tests', value: AUTO_TEST_CASES.filter(t => t.type === 'Selenium').length, target: '10+', met: true },
                  { metric: 'Cucumber BDD Tests', value: AUTO_TEST_CASES.filter(t => t.type === 'Cucumber').length, target: '5+', met: true },
                  { metric: 'API Tests (REST Assured)', value: AUTO_TEST_CASES.filter(t => t.type === 'REST Assured').length, target: '5+', met: true },
                  { metric: 'Mobile Tests (Appium)', value: AUTO_TEST_CASES.filter(t => t.type === 'Appium').length, target: '5+', met: true },
                  { metric: 'P0 Coverage', value: AUTO_TEST_CASES.filter(t => t.priority === 'P0').length + ' tests', target: '15+', met: AUTO_TEST_CASES.filter(t => t.priority === 'P0').length >= 15 },
                  { metric: 'Avg Execution Time', value: '3.2s', target: '< 5s', met: true },
                  { metric: 'Flaky Test Rate', value: '2.8%', target: '< 5%', met: true },
                ].map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{m.metric}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#4f46e5' }}>{m.value}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', color: '#64748b' }}>{m.target}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 700, background: m.met ? '#dcfce7' : '#fef2f2', color: m.met ? '#166534' : '#dc2626' }}>
                        {m.met ? 'MET' : 'NOT MET'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 7: // Admin & Setup
        return (
          <div>
            <h3 style={{ marginBottom: 16 }}>Admin Tasks & Environment Setup</h3>
            {ADMIN_TASKS.map((task, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12, overflow: 'hidden' }}>
                <div onClick={() => toggle(`admin-${i}`)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 700,
                      background: task.status === 'done' ? '#dcfce7' : task.status === 'in_progress' ? '#fef3c7' : '#f1f5f9',
                      color: task.status === 'done' ? '#166534' : task.status === 'in_progress' ? '#92400e' : '#64748b'
                    }}>{task.status.toUpperCase()}</span>
                    <strong style={{ fontSize: 14 }}>{task.task}</strong>
                  </div>
                  <span style={{ color: '#94a3b8' }}>{expandedItems[`admin-${i}`] ? '\u25B2' : '\u25BC'}</span>
                </div>
                {expandedItems[`admin-${i}`] && (
                  <div style={{ padding: '0 16px 14px', borderTop: '1px solid #e2e8f0' }}>
                    {task.steps.map((step, j) => (
                      <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', fontSize: 13 }}>
                        <span style={{ color: task.status === 'done' ? '#22c55e' : '#94a3b8' }}>{task.status === 'done' ? '\u2713' : '\u25CB'}</span>
                        <span style={{ color: '#475569' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <h3 style={{ margin: '24px 0 12px' }}>Project Structure</h3>
            <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: 18, borderRadius: 8, fontSize: 12, lineHeight: 1.5, overflowX: 'auto' }}>
{`automation-testing/
├── pom.xml                          # Maven config (Selenium, Cucumber, Appium, TestNG)
├── testng.xml                       # Full test suite configuration
├── testng-smoke.xml                 # Smoke test suite
├── testng-regression.xml            # Regression test suite
├── testng-mobile.xml                # Mobile test suite
├── src/
│   ├── main/java/com/banking/
│   │   ├── pages/                   # Page Object Model (POM)
│   │   │   ├── BasePage.java        # Common methods (click, type, wait)
│   │   │   ├── LoginPage.java       # Login form elements
│   │   │   ├── DashboardPage.java   # Dashboard elements
│   │   │   ├── TransferPage.java    # Fund transfer form
│   │   │   └── AccountsPage.java    # Account management
│   │   └── utils/                   # Framework utilities
│   │       ├── ConfigReader.java    # Properties file reader
│   │       ├── DriverFactory.java   # WebDriver + Appium driver factory
│   │       ├── WaitHelper.java      # Explicit & Fluent waits
│   │       └── ScreenshotUtil.java  # Screenshot capture utility
│   └── test/
│       ├── java/com/banking/
│       │   ├── steps/               # Cucumber step definitions
│       │   │   ├── Hooks.java       # @Before/@After setup/teardown
│       │   │   ├── LoginSteps.java  # Login feature steps
│       │   │   └── TransferSteps.java # Transfer feature steps
│       │   └── runners/             # Test runners
│       │       ├── SmokeTestRunner.java
│       │       ├── RegressionTestRunner.java
│       │       ├── MobileTestRunner.java
│       │       └── APITestRunner.java
│       └── resources/
│           ├── config.properties    # Test configuration
│           ├── features/            # Cucumber .feature files
│           │   ├── login.feature
│           │   ├── fund_transfer.feature
│           │   ├── accounts.feature
│           │   ├── mobile_banking.feature
│           │   └── api_testing.feature
│           └── testdata/            # Excel/CSV test data
└── reports/                         # Generated test reports`}
            </pre>

            <h4 style={{ margin: '20px 0 10px' }}>Quick Start Commands</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 8 }}>
              {[
                { cmd: 'cd automation-testing && mvn compile', desc: 'Compile project & download dependencies' },
                { cmd: 'mvn test -Psmoke', desc: 'Run smoke tests (P0 critical paths)' },
                { cmd: 'mvn test -Pregression -Dbrowser=chrome', desc: 'Run full regression on Chrome' },
                { cmd: 'mvn test -Dbrowser=firefox -Dheadless=true', desc: 'Run headless on Firefox (CI/CD)' },
                { cmd: 'mvn test -Dcucumber.filter.tags="@api"', desc: 'Run API tests only (REST Assured)' },
                { cmd: 'mvn verify', desc: 'Run tests + generate all reports' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 12px', background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', alignItems: 'center' }}>
                  <code style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, minWidth: 280 }}>$ {c.cmd}</code>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{c.desc}</span>
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
        <h2 style={{ margin: 0, fontSize: 22 }}>Automation Testing Hub</h2>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
          Selenium + Cucumber + Appium + Maven + TestNG — 35 automated test cases, POM framework, mobile testing, API testing, reports & scores
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

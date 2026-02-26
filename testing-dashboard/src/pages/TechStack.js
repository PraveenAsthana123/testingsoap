import React, { useState } from 'react';

const TECH_CATEGORIES = [
  {
    category: 'Frontend',
    color: '#3b82f6',
    items: [
      { name: 'React 18', version: '18.x', purpose: 'Single Page Application (SPA) UI framework', status: 'active', docs: 'https://react.dev' },
      { name: 'JavaScript (ES6+)', version: 'ES2022', purpose: 'Core programming language for frontend', status: 'active', docs: 'https://developer.mozilla.org' },
      { name: 'CSS3', version: '3', purpose: 'Styling and responsive design', status: 'active', docs: 'https://developer.mozilla.org/CSS' },
      { name: 'React Scripts', version: '5.x', purpose: 'Create React App build toolchain', status: 'active', docs: 'https://create-react-app.dev' },
      { name: 'HTML5', version: '5', purpose: 'Page structure and semantic markup', status: 'active', docs: 'https://developer.mozilla.org/HTML' },
    ]
  },
  {
    category: 'Backend',
    color: '#22c55e',
    items: [
      { name: 'Node.js', version: '18+', purpose: 'Server-side JavaScript runtime', status: 'active', docs: 'https://nodejs.org' },
      { name: 'Express.js', version: '4.x', purpose: 'REST API web framework', status: 'active', docs: 'https://expressjs.com' },
      { name: 'better-sqlite3', version: '9.x', purpose: 'SQLite database driver (sync, fast)', status: 'active', docs: 'https://github.com/WiseLibs/better-sqlite3' },
      { name: 'CORS middleware', version: '2.x', purpose: 'Cross-Origin Resource Sharing for API', status: 'active', docs: 'https://npmjs.com/package/cors' },
    ]
  },
  {
    category: 'Database',
    color: '#8b5cf6',
    items: [
      { name: 'SQLite3', version: '3.x', purpose: 'Embedded relational database (zero config)', status: 'active', docs: 'https://sqlite.org' },
      { name: 'WAL Mode', version: '-', purpose: 'Write-Ahead Logging for concurrent reads', status: 'active', docs: 'https://sqlite.org/wal.html' },
      { name: 'SQL', version: 'ANSI', purpose: 'Database query language', status: 'active', docs: 'https://sqlite.org/lang.html' },
    ]
  },
  {
    category: 'Automation Testing',
    color: '#f59e0b',
    items: [
      { name: 'Java (OpenJDK)', version: '21', purpose: 'Core automation programming language', status: 'active', docs: 'https://openjdk.org' },
      { name: 'Selenium WebDriver', version: '4.15.0', purpose: 'Browser automation for UI testing', status: 'active', docs: 'https://selenium.dev' },
      { name: 'Cucumber', version: '7.14.1', purpose: 'BDD framework with Gherkin syntax', status: 'active', docs: 'https://cucumber.io' },
      { name: 'Appium', version: '9.0.0', purpose: 'Mobile app testing (Android + iOS)', status: 'active', docs: 'https://appium.io' },
      { name: 'TestNG', version: '7.8.0', purpose: 'Test runner with parallel execution', status: 'active', docs: 'https://testng.org' },
      { name: 'REST Assured', version: '5.4.0', purpose: 'API testing framework for REST services', status: 'active', docs: 'https://rest-assured.io' },
      { name: 'Apache Maven', version: '3.9.6', purpose: 'Build tool and dependency management', status: 'active', docs: 'https://maven.apache.org' },
      { name: 'WebDriverManager', version: '5.6.2', purpose: 'Auto-download browser drivers', status: 'active', docs: 'https://bonigarcia.dev/webdrivermanager' },
      { name: 'Extent Reports', version: '5.1.1', purpose: 'Rich HTML test reporting with screenshots', status: 'active', docs: 'https://extentreports.com' },
      { name: 'Apache POI', version: '5.2.5', purpose: 'Excel test data reading/writing', status: 'active', docs: 'https://poi.apache.org' },
      { name: 'Log4j2', version: '2.22.0', purpose: 'Structured logging framework', status: 'active', docs: 'https://logging.apache.org/log4j' },
      { name: 'Gson', version: '2.10.1', purpose: 'JSON processing for test data', status: 'active', docs: 'https://github.com/google/gson' },
    ]
  },
  {
    category: 'Mobile Testing',
    color: '#ec4899',
    items: [
      { name: 'Appium Server', version: '2.x', purpose: 'Mobile automation server', status: 'active', docs: 'https://appium.io' },
      { name: 'UiAutomator2', version: 'latest', purpose: 'Android native automation driver', status: 'active', docs: 'https://github.com/appium/appium-uiautomator2-driver' },
      { name: 'XCUITest', version: 'latest', purpose: 'iOS native automation driver', status: 'active', docs: 'https://github.com/appium/appium-xcuitest-driver' },
      { name: 'Android SDK', version: '34', purpose: 'Android development and emulator', status: 'setup_needed', docs: 'https://developer.android.com' },
      { name: 'Xcode', version: '15+', purpose: 'iOS development and simulator (macOS)', status: 'setup_needed', docs: 'https://developer.apple.com/xcode' },
    ]
  },
  {
    category: 'API Testing',
    color: '#06b6d4',
    items: [
      { name: 'SoapUI', version: '5.7.2', purpose: 'SOAP/REST API testing tool', status: 'active', docs: 'https://soapui.org' },
      { name: 'REST Assured', version: '5.4.0', purpose: 'Java API testing library', status: 'active', docs: 'https://rest-assured.io' },
      { name: 'Postman', version: 'latest', purpose: 'API development and manual testing', status: 'optional', docs: 'https://postman.com' },
      { name: 'Swagger/OpenAPI', version: '3.0', purpose: 'API documentation specification', status: 'active', docs: 'https://swagger.io' },
    ]
  },
  {
    category: 'CI/CD & DevOps',
    color: '#dc2626',
    items: [
      { name: 'GitHub Actions', version: '-', purpose: 'CI/CD pipeline automation', status: 'active', docs: 'https://github.com/features/actions' },
      { name: 'Git', version: '2.x', purpose: 'Version control system', status: 'active', docs: 'https://git-scm.com' },
      { name: 'GitHub', version: '-', purpose: 'Code repository and collaboration', status: 'active', docs: 'https://github.com' },
      { name: 'Docker', version: 'latest', purpose: 'Container for test execution', status: 'optional', docs: 'https://docker.com' },
      { name: 'Selenium Grid', version: '4.x', purpose: 'Parallel cross-browser testing', status: 'optional', docs: 'https://selenium.dev/documentation/grid' },
    ]
  },
  {
    category: 'Test Management',
    color: '#78716c',
    items: [
      { name: 'JIRA', version: 'Cloud', purpose: 'Bug tracking and sprint management', status: 'reference', docs: 'https://atlassian.com/jira' },
      { name: 'TestRail', version: '-', purpose: 'Test case management platform', status: 'reference', docs: 'https://testrail.com' },
      { name: 'Zephyr', version: '-', purpose: 'Test management for JIRA', status: 'reference', docs: 'https://smartbear.com/test-management/zephyr' },
      { name: 'Cucumber Reports', version: '7.x', purpose: 'BDD test report generation', status: 'active', docs: 'https://reports.cucumber.io' },
    ]
  },
];

const ARCHITECTURE = {
  frontend: { port: 3000, tech: 'React 18 SPA', features: ['31 pages', 'Sidebar navigation', 'Live API integration', 'Responsive design'] },
  backend: { port: 3001, tech: 'Express.js REST API', features: ['30+ API endpoints', 'SQL query engine', 'Automation tracking', 'Health monitoring'] },
  database: { port: '-', tech: 'SQLite3 (WAL mode)', features: ['15+ tables', 'Indexed queries', 'Test data seeded', 'Automation results'] },
  automation: { port: '-', tech: 'Maven + Java 21', features: ['43 Cucumber scenarios', '9 page objects', '6 step definitions', '4 test runners'] },
};

export default function TechStack() {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedCat, setExpandedCat] = useState({});

  const toggleCat = (cat) => setExpandedCat(prev => ({ ...prev, [cat]: !prev[cat] }));

  const totalTech = TECH_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);
  const activeTech = TECH_CATEGORIES.reduce((sum, c) => sum + c.items.filter(i => i.status === 'active').length, 0);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Technology Stack</h2>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
          Full-stack Banking QA platform — {totalTech} technologies across {TECH_CATEGORIES.length} categories
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: '2px solid #e2e8f0', paddingBottom: 12 }}>
        {['overview', 'architecture', 'dependencies', 'versions'].map(tab => (
          <button key={tab} onClick={() => setActiveSection(tab)}
            style={{ padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
              background: activeSection === tab ? '#4f46e5' : '#f1f5f9', color: activeSection === tab ? '#fff' : '#475569' }}>
            {tab}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 24 }}>
            {[
              { label: 'Total Technologies', value: totalTech, color: '#4f46e5' },
              { label: 'Active', value: activeTech, color: '#22c55e' },
              { label: 'Categories', value: TECH_CATEGORIES.length, color: '#06b6d4' },
              { label: 'Languages', value: '3', color: '#f59e0b' },
              { label: 'Frameworks', value: '8', color: '#8b5cf6' },
              { label: 'Dashboard Pages', value: '33', color: '#ec4899' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 14, textAlign: 'center', borderTop: `3px solid ${s.color}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {TECH_CATEGORIES.map((cat, ci) => (
            <div key={ci} style={{ marginBottom: 16 }}>
              <div onClick={() => toggleCat(cat.category)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', borderLeft: `4px solid ${cat.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <strong style={{ fontSize: 15 }}>{cat.category}</strong>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: cat.color + '15', color: cat.color, fontWeight: 600 }}>{cat.items.length} tools</span>
                </div>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>{expandedCat[cat.category] ? '\u25B2' : '\u25BC'}</span>
              </div>
              {(expandedCat[cat.category] !== false) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8, marginTop: 8 }}>
                  {cat.items.map((item, i) => (
                    <div key={i} style={{ background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 13, color: '#1e293b' }}>{item.name}</strong>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, fontWeight: 600,
                          background: item.status === 'active' ? '#dcfce7' : item.status === 'optional' ? '#fef3c7' : item.status === 'setup_needed' ? '#fef2f2' : '#f1f5f9',
                          color: item.status === 'active' ? '#166534' : item.status === 'optional' ? '#92400e' : item.status === 'setup_needed' ? '#dc2626' : '#64748b'
                        }}>{item.status.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{item.purpose}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <code style={{ fontSize: 10, color: '#4f46e5', background: '#f0f4ff', padding: '1px 6px', borderRadius: 3 }}>v{item.version}</code>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === 'architecture' && (
        <div>
          <h3 style={{ marginBottom: 16 }}>System Architecture</h3>
          <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: 20, borderRadius: 8, fontSize: 12, lineHeight: 1.6, overflowX: 'auto' }}>
{`
 ┌──────────────────────────────────────────────────────────────────────┐
 │                        QA TESTER / BROWSER                          │
 └─────────────────────────────┬────────────────────────────────────────┘
                               │ HTTP
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
 ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
 │  React Frontend │ │  Express.js API │ │   Automation    │
 │   (Port 3000)   │ │   (Port 3001)   │ │   Framework     │
 │                 │ │                 │ │                 │
 │  33 Pages       │ │  30+ Endpoints  │ │  Maven + Java   │
 │  Sidebar Nav    │ │  SQL Engine     │ │  Selenium 4     │
 │  Live Charts    │ │  Health Monitor │ │  Cucumber BDD   │
 │  API Client     │ │  Auto Tracking  │ │  Appium Mobile  │
 │                 │ │                 │ │  REST Assured   │
 └─────────────────┘ └───────┬─────────┘ └───────┬─────────┘
                             │                    │
                             ▼                    ▼
                    ┌─────────────────┐  ┌─────────────────┐
                    │  SQLite (WAL)   │  │  Test Reports   │
                    │                 │  │                 │
                    │  15+ Tables     │  │  Extent HTML    │
                    │  Customers      │  │  Cucumber JSON  │
                    │  Accounts       │  │  Surefire XML   │
                    │  Transactions   │  │  Screenshots    │
                    │  Test Cases     │  │  Logs           │
                    │  Defects        │  │                 │
                    │  Auto Runs      │  │                 │
                    └─────────────────┘  └─────────────────┘

 ┌──────────────────────────────────────────────────────────────────────┐
 │                          CI/CD PIPELINE                              │
 │  GitHub Actions → Build → Smoke Tests → API Tests → Regression      │
 └──────────────────────────────────────────────────────────────────────┘
`}
          </pre>

          <h3 style={{ margin: '24px 0 12px' }}>Component Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
            {Object.entries(ARCHITECTURE).map(([key, val]) => (
              <div key={key} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ fontSize: 15, textTransform: 'capitalize' }}>{key}</strong>
                  {val.port !== '-' && <code style={{ fontSize: 11, padding: '2px 8px', background: '#dcfce7', borderRadius: 4, color: '#166534' }}>:{val.port}</code>}
                </div>
                <div style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600, marginBottom: 8 }}>{val.tech}</div>
                {val.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, color: '#64748b', padding: '2px 0' }}>
                    <span style={{ color: '#22c55e' }}>{'✓'}</span> {f}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <h3 style={{ margin: '24px 0 12px' }}>API Endpoints Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { group: 'Dashboard', endpoints: ['GET /api/dashboard/stats'], count: 1 },
              { group: 'Customers', endpoints: ['GET /api/customers', 'GET /api/customers/:id'], count: 2 },
              { group: 'Accounts', endpoints: ['GET /api/accounts', 'GET /api/accounts/:id'], count: 2 },
              { group: 'Transactions', endpoints: ['GET /api/transactions'], count: 1 },
              { group: 'Test Cases', endpoints: ['GET /api/test-cases', 'PUT /api/test-cases/:id/execute'], count: 3 },
              { group: 'Defects', endpoints: ['GET /api/defects'], count: 1 },
              { group: 'SQL Engine', endpoints: ['POST /api/sql/execute'], count: 1 },
              { group: 'Schema', endpoints: ['GET /api/schema'], count: 1 },
              { group: 'Automation', endpoints: ['GET/POST /api/automation/runs', 'GET /api/automation/stats'], count: 7 },
              { group: 'Health', endpoints: ['GET /api/health'], count: 1 },
              { group: 'Reports', endpoints: ['GET /api/reports/summary'], count: 1 },
              { group: 'Others', endpoints: ['Loans, Cards, Bills, Sessions, Audit'], count: 6 },
            ].map((g, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', padding: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: 12 }}>{g.group}</strong>
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: '#eff6ff', color: '#2563eb', fontWeight: 600 }}>{g.count}</span>
                </div>
                {g.endpoints.map((ep, j) => (
                  <div key={j} style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace', padding: '1px 0' }}>{ep}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'dependencies' && (
        <div>
          <h3 style={{ marginBottom: 16 }}>Dependency Map</h3>

          <h4 style={{ margin: '16px 0 8px', color: '#3b82f6' }}>Frontend (package.json)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Package</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Purpose</th>
                <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {[
                { pkg: 'react', purpose: 'UI component library', type: 'core' },
                { pkg: 'react-dom', purpose: 'DOM rendering', type: 'core' },
                { pkg: 'react-scripts', purpose: 'Build toolchain (webpack, babel)', type: 'dev' },
              ].map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px 12px', fontFamily: 'monospace', color: '#4f46e5', fontWeight: 600 }}>{d.pkg}</td>
                  <td style={{ padding: '6px 12px', color: '#64748b' }}>{d.purpose}</td>
                  <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: d.type === 'core' ? '#dcfce7' : '#fef3c7', color: d.type === 'core' ? '#166534' : '#92400e', fontWeight: 600 }}>{d.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 style={{ margin: '16px 0 8px', color: '#22c55e' }}>Backend (package.json)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Package</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Purpose</th>
                <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {[
                { pkg: 'express', purpose: 'Web framework for REST API', type: 'core' },
                { pkg: 'better-sqlite3', purpose: 'SQLite database driver', type: 'core' },
                { pkg: 'cors', purpose: 'Cross-origin request handling', type: 'core' },
              ].map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px 12px', fontFamily: 'monospace', color: '#22c55e', fontWeight: 600 }}>{d.pkg}</td>
                  <td style={{ padding: '6px 12px', color: '#64748b' }}>{d.purpose}</td>
                  <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: '#dcfce7', color: '#166534', fontWeight: 600 }}>{d.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 style={{ margin: '16px 0 8px', color: '#f59e0b' }}>Automation (pom.xml — Maven Dependencies)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>GroupId : ArtifactId</th>
                <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Version</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dep: 'org.seleniumhq.selenium:selenium-java', ver: '4.15.0', purpose: 'Browser automation' },
                { dep: 'io.github.bonigarcia:webdrivermanager', ver: '5.6.2', purpose: 'Auto driver download' },
                { dep: 'io.cucumber:cucumber-java', ver: '7.14.1', purpose: 'BDD step definitions' },
                { dep: 'io.cucumber:cucumber-testng', ver: '7.14.1', purpose: 'Cucumber + TestNG integration' },
                { dep: 'io.cucumber:cucumber-picocontainer', ver: '7.14.1', purpose: 'Dependency injection for steps' },
                { dep: 'io.appium:java-client', ver: '9.0.0', purpose: 'Mobile testing (Android + iOS)' },
                { dep: 'org.testng:testng', ver: '7.8.0', purpose: 'Test runner framework' },
                { dep: 'io.rest-assured:rest-assured', ver: '5.4.0', purpose: 'REST API testing' },
                { dep: 'com.aventstack:extentreports', ver: '5.1.1', purpose: 'HTML test reports' },
                { dep: 'tech.grasshopper:extentreports-cucumber7-adapter', ver: '1.14.0', purpose: 'Cucumber + Extent bridge' },
                { dep: 'org.apache.poi:poi-ooxml', ver: '5.2.5', purpose: 'Excel file operations' },
                { dep: 'org.apache.logging.log4j:log4j-core', ver: '2.22.0', purpose: 'Structured logging' },
                { dep: 'com.google.code.gson:gson', ver: '2.10.1', purpose: 'JSON processing' },
                { dep: 'org.projectlombok:lombok', ver: '1.18.30', purpose: 'Boilerplate reduction' },
              ].map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px 12px', fontFamily: 'monospace', fontSize: 11, color: '#1e293b' }}>{d.dep}</td>
                  <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                    <code style={{ fontSize: 10, padding: '2px 6px', background: '#f0f4ff', borderRadius: 3, color: '#4f46e5' }}>{d.ver}</code>
                  </td>
                  <td style={{ padding: '6px 12px', color: '#64748b' }}>{d.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'versions' && (
        <div>
          <h3 style={{ marginBottom: 16 }}>Version Matrix</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Technology</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Version</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Category</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {TECH_CATEGORIES.flatMap(cat =>
                cat.items.map((item, i) => (
                  <tr key={`${cat.category}-${i}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 12px', fontWeight: 600 }}>{item.name}</td>
                    <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                      <code style={{ fontSize: 11, color: '#4f46e5' }}>{item.version}</code>
                    </td>
                    <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: cat.color + '15', color: cat.color, fontWeight: 600 }}>{cat.category}</span>
                    </td>
                    <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, fontWeight: 600,
                        background: item.status === 'active' ? '#dcfce7' : item.status === 'optional' ? '#fef3c7' : item.status === 'setup_needed' ? '#fef2f2' : '#f1f5f9',
                        color: item.status === 'active' ? '#166534' : item.status === 'optional' ? '#92400e' : item.status === 'setup_needed' ? '#dc2626' : '#64748b'
                      }}>{item.status.replace('_', ' ')}</span>
                    </td>
                    <td style={{ padding: '6px 12px', color: '#64748b', fontSize: 11 }}>{item.purpose}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

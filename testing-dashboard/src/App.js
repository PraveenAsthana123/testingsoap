import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import TestCases from './pages/TestCases';
import TestExecution from './pages/TestExecution';
import SqlEditor from './pages/SqlEditor';
import OperationFlow from './pages/OperationFlow';
import Reports from './pages/Reports';
import Defects from './pages/Defects';
import BankingModules from './pages/BankingModules';
import Documentation from './pages/Documentation';
import InterviewPrep from './pages/InterviewPrep';
import SoapUIGuide from './pages/SoapUIGuide';
import Challenges from './pages/Challenges';
import DatabaseExplorer from './pages/DatabaseExplorer';
import ProcessFlow from './pages/ProcessFlow';
import ApiTester from './pages/ApiTester';
import Healthcheck from './pages/Healthcheck';
import LogTrace from './pages/LogTrace';
import JsonTestData from './pages/JsonTestData';
import BankingKnowledge from './pages/BankingKnowledge';
import SecurityScenarios from './pages/SecurityScenarios';
import CICDGuide from './pages/CICDGuide';
import DevOpsGuide from './pages/DevOpsGuide';
import FrontendTesting from './pages/FrontendTesting';
import PerformanceTesting from './pages/PerformanceTesting';
import TestingChecklist from './pages/TestingChecklist';
import SeleniumCucumber from './pages/SeleniumCucumber';
import JiraWorkflow from './pages/JiraWorkflow';
import AgileUAT from './pages/AgileUAT';
import RegressionTesting from './pages/RegressionTesting';
import SwaggerApiDocs from './pages/SwaggerApiDocs';
import AutomationHub from './pages/AutomationHub';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '\u{1F4CA}', section: 'Main' },
  { id: 'healthcheck', label: 'System Health', icon: '\u{1F49A}', section: 'Main' },
  { id: 'test-cases', label: 'Test Cases', icon: '\u{1F4CB}', section: 'Testing' },
  { id: 'test-execution', label: 'Manual Testing', icon: '\u25B6\uFE0F', section: 'Testing' },
  { id: 'frontend-testing', label: 'Frontend Testing', icon: '\u{1F5A5}', section: 'Testing' },
  { id: 'performance-testing', label: 'Performance & Load', icon: '\u{23F1}', section: 'Testing' },
  { id: 'defects', label: 'Defects / Bugs', icon: '\u{1F41B}', section: 'Testing' },
  { id: 'reports', label: 'Reports', icon: '\u{1F4C8}', section: 'Testing' },
  { id: 'json-test-data', label: 'JSON Test Data', icon: '\u{1F4E6}', section: 'Testing' },
  { id: 'regression-testing', label: 'Regression Testing', icon: '\u{1F501}', section: 'Testing' },
  { id: 'testing-checklist', label: 'Testing Checklist', icon: '\u2705', section: 'Testing' },
  { id: 'operation-flow', label: 'Operation Flow', icon: '\u{1F504}', section: 'Monitoring' },
  { id: 'log-trace', label: 'Log & Trace', icon: '\u{1F4DC}', section: 'Monitoring' },
  { id: 'api-tester', label: 'API Tester', icon: '\u{1F680}', section: 'Tools' },
  { id: 'sql-editor', label: 'SQL Editor', icon: '\u{1F4BE}', section: 'Tools' },
  { id: 'db-explorer', label: 'Database Explorer', icon: '\u{1F5C4}', section: 'Tools' },
  { id: 'soapui-guide', label: 'SoapUI Guide', icon: '\u{1F9EA}', section: 'Tools' },
  { id: 'swagger-api-docs', label: 'API Documentation', icon: '\u{1F4C4}', section: 'Tools' },
  { id: 'banking-modules', label: 'Banking Modules', icon: '\u{1F3E6}', section: 'Business' },
  { id: 'banking-knowledge', label: 'Banking Knowledge', icon: '\u{1F4B0}', section: 'Business' },
  { id: 'process-flow', label: 'Process Flow', icon: '\u{1F500}', section: 'Business' },
  { id: 'security-scenarios', label: 'Security & AML', icon: '\u{1F512}', section: 'Business' },
  { id: 'devops-guide', label: 'DevOps Guide', icon: '\u{1F528}', section: 'DevOps' },
  { id: 'cicd-guide', label: 'CI/CD Pipeline', icon: '\u{2699}', section: 'DevOps' },
  { id: 'automation-hub', label: 'Automation Hub', icon: '\u{1F3AF}', section: 'Automation' },
  { id: 'selenium-cucumber', label: 'Selenium & Cucumber', icon: '\u{1F916}', section: 'Automation' },
  { id: 'agile-uat', label: 'Agile & UAT', icon: '\u{1F3C3}', section: 'Automation' },
  { id: 'jira-workflow', label: 'JIRA & Bug Lifecycle', icon: '\u{1F4CC}', section: 'Automation' },
  { id: 'challenges', label: 'Challenges & Edge Cases', icon: '\u26A1', section: 'Learning' },
  { id: 'interview-prep', label: 'Interview Q&A (30)', icon: '\u{1F3AF}', section: 'Learning' },
  { id: 'documentation', label: 'Documentation', icon: '\u{1F4D6}', section: 'Reference' },
];

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sections = [...new Set(MENU_ITEMS.map(m => m.section))];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'test-cases': return <TestCases />;
      case 'test-execution': return <TestExecution />;
      case 'defects': return <Defects />;
      case 'reports': return <Reports />;
      case 'operation-flow': return <OperationFlow />;
      case 'sql-editor': return <SqlEditor />;
      case 'db-explorer': return <DatabaseExplorer />;
      case 'banking-modules': return <BankingModules />;
      case 'process-flow': return <ProcessFlow />;
      case 'api-tester': return <ApiTester />;
      case 'healthcheck': return <Healthcheck />;
      case 'log-trace': return <LogTrace />;
      case 'json-test-data': return <JsonTestData />;
      case 'banking-knowledge': return <BankingKnowledge />;
      case 'security-scenarios': return <SecurityScenarios />;
      case 'cicd-guide': return <CICDGuide />;
      case 'devops-guide': return <DevOpsGuide />;
      case 'frontend-testing': return <FrontendTesting />;
      case 'performance-testing': return <PerformanceTesting />;
      case 'testing-checklist': return <TestingChecklist />;
      case 'regression-testing': return <RegressionTesting />;
      case 'automation-hub': return <AutomationHub />;
      case 'selenium-cucumber': return <SeleniumCucumber />;
      case 'jira-workflow': return <JiraWorkflow />;
      case 'agile-uat': return <AgileUAT />;
      case 'swagger-api-docs': return <SwaggerApiDocs />;
      case 'soapui-guide': return <SoapUIGuide />;
      case 'challenges': return <Challenges />;
      case 'interview-prep': return <InterviewPrep />;
      case 'documentation': return <Documentation />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? '\u2630' : '\u2715'}
        </button>
        <h1>Banking QA Testing Dashboard</h1>
        <div className="header-right">
          <span className="tech-badge">React</span>
          <span className="tech-badge">SQLite</span>
          <span className="tech-badge">SoapUI</span>
          <span className="tech-badge">REST API</span>
        </div>
      </header>
      <div className="app-body">
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          {sections.map(section => (
            <div key={section} className="sidebar-section">
              {!sidebarCollapsed && <div className="sidebar-section-title">{section}</div>}
              {MENU_ITEMS.filter(m => m.section === section).map(item => (
                <button
                  key={item.id}
                  className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                  title={item.label}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="sidebar-label">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </aside>
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;

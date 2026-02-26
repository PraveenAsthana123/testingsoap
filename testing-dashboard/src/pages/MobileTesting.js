import React, { useState } from 'react';

const TABS = ['Dashboard', 'Android', 'iOS (Apple)', 'Windows Mobile', 'Web App Testing', 'Test Scenarios', 'Test Data & Results'];

// ========== MOBILE TEST SCENARIOS ==========
const ANDROID_SCENARIOS = [
  { id: 'AND-001', category: 'Login', scenario: 'Login with fingerprint authentication', priority: 'P0', status: 'pass', device: 'Pixel 7', os: 'Android 14', time: '3.2s' },
  { id: 'AND-002', category: 'Login', scenario: 'Login with PIN code (4-digit)', priority: 'P0', status: 'pass', device: 'Samsung S23', os: 'Android 13', time: '2.1s' },
  { id: 'AND-003', category: 'Login', scenario: 'Login with pattern lock', priority: 'P1', status: 'pass', device: 'OnePlus 12', os: 'Android 14', time: '2.8s' },
  { id: 'AND-004', category: 'Login', scenario: 'Biometric re-authentication after background', priority: 'P0', status: 'pass', device: 'Pixel 7', os: 'Android 14', time: '1.5s' },
  { id: 'AND-005', category: 'Transfer', scenario: 'UPI fund transfer (Google Pay style)', priority: 'P0', status: 'pass', device: 'Samsung S23', os: 'Android 13', time: '5.4s' },
  { id: 'AND-006', category: 'Transfer', scenario: 'QR code scan and pay', priority: 'P0', status: 'fail', device: 'Redmi Note 13', os: 'Android 13', time: '8.1s' },
  { id: 'AND-007', category: 'Transfer', scenario: 'NEFT/RTGS transfer from mobile', priority: 'P1', status: 'pass', device: 'Pixel 7', os: 'Android 14', time: '6.2s' },
  { id: 'AND-008', category: 'Accounts', scenario: 'View account balance widget', priority: 'P0', status: 'pass', device: 'Samsung S23', os: 'Android 13', time: '1.8s' },
  { id: 'AND-009', category: 'Accounts', scenario: 'Mini statement (last 10 transactions)', priority: 'P1', status: 'pass', device: 'OnePlus 12', os: 'Android 14', time: '2.3s' },
  { id: 'AND-010', category: 'Accounts', scenario: 'Download statement as PDF', priority: 'P1', status: 'pass', device: 'Pixel 7', os: 'Android 14', time: '4.5s' },
  { id: 'AND-011', category: 'Bills', scenario: 'Electricity bill payment', priority: 'P1', status: 'pass', device: 'Samsung S23', os: 'Android 13', time: '3.7s' },
  { id: 'AND-012', category: 'Bills', scenario: 'Mobile recharge', priority: 'P1', status: 'pass', device: 'Redmi Note 13', os: 'Android 13', time: '2.9s' },
  { id: 'AND-013', category: 'Notification', scenario: 'Push notification on credit/debit', priority: 'P0', status: 'pass', device: 'Pixel 7', os: 'Android 14', time: '1.2s' },
  { id: 'AND-014', category: 'Notification', scenario: 'OTP auto-read from SMS', priority: 'P0', status: 'not_run', device: 'Samsung S23', os: 'Android 13', time: '-' },
  { id: 'AND-015', category: 'Device', scenario: 'App behavior on orientation change', priority: 'P2', status: 'pass', device: 'Pixel 7', os: 'Android 14', time: '1.1s' },
  { id: 'AND-016', category: 'Device', scenario: 'App behavior on low memory', priority: 'P2', status: 'pass', device: 'Redmi Note 13', os: 'Android 13', time: '3.5s' },
  { id: 'AND-017', category: 'Network', scenario: 'Offline mode — cached data display', priority: 'P1', status: 'pass', device: 'Samsung S23', os: 'Android 13', time: '2.0s' },
  { id: 'AND-018', category: 'Network', scenario: 'WiFi to mobile data switch', priority: 'P1', status: 'pass', device: 'OnePlus 12', os: 'Android 14', time: '1.8s' },
  { id: 'AND-019', category: 'Security', scenario: 'SSL pinning verification', priority: 'P0', status: 'pass', device: 'Pixel 7', os: 'Android 14', time: '2.5s' },
  { id: 'AND-020', category: 'Security', scenario: 'Root detection and app exit', priority: 'P0', status: 'pass', device: 'Emulator', os: 'Android 14', time: '1.3s' },
];

const IOS_SCENARIOS = [
  { id: 'IOS-001', category: 'Login', scenario: 'Login with Face ID', priority: 'P0', status: 'pass', device: 'iPhone 15 Pro', os: 'iOS 17', time: '2.8s' },
  { id: 'IOS-002', category: 'Login', scenario: 'Login with Touch ID (iPad)', priority: 'P0', status: 'pass', device: 'iPad Pro', os: 'iPadOS 17', time: '2.5s' },
  { id: 'IOS-003', category: 'Login', scenario: 'Keychain auto-fill credentials', priority: 'P1', status: 'pass', device: 'iPhone 15', os: 'iOS 17', time: '1.9s' },
  { id: 'IOS-004', category: 'Transfer', scenario: 'Apple Pay integration for transfers', priority: 'P0', status: 'not_run', device: 'iPhone 15 Pro', os: 'iOS 17', time: '-' },
  { id: 'IOS-005', category: 'Transfer', scenario: 'UPI transfer via iOS app', priority: 'P0', status: 'pass', device: 'iPhone 15', os: 'iOS 17', time: '5.1s' },
  { id: 'IOS-006', category: 'Accounts', scenario: 'Widget on home screen (balance)', priority: 'P1', status: 'pass', device: 'iPhone 15 Pro', os: 'iOS 17', time: '1.5s' },
  { id: 'IOS-007', category: 'Accounts', scenario: 'Siri shortcut — check balance', priority: 'P2', status: 'not_run', device: 'iPhone 15', os: 'iOS 17', time: '-' },
  { id: 'IOS-008', category: 'Accounts', scenario: 'Share statement via AirDrop', priority: 'P2', status: 'pass', device: 'iPhone 15 Pro', os: 'iOS 17', time: '3.2s' },
  { id: 'IOS-009', category: 'Notification', scenario: 'Rich push notification with actions', priority: 'P0', status: 'pass', device: 'iPhone 15', os: 'iOS 17', time: '1.3s' },
  { id: 'IOS-010', category: 'Notification', scenario: 'Critical alert for fraud detection', priority: 'P0', status: 'pass', device: 'iPhone 15 Pro', os: 'iOS 17', time: '1.1s' },
  { id: 'IOS-011', category: 'Device', scenario: 'Universal app (iPhone + iPad)', priority: 'P1', status: 'pass', device: 'iPad Pro', os: 'iPadOS 17', time: '2.0s' },
  { id: 'IOS-012', category: 'Device', scenario: 'Dark mode UI compatibility', priority: 'P1', status: 'pass', device: 'iPhone 15', os: 'iOS 17', time: '1.7s' },
  { id: 'IOS-013', category: 'Device', scenario: 'Dynamic Type (accessibility font)', priority: 'P2', status: 'pass', device: 'iPhone 15 Pro', os: 'iOS 17', time: '1.4s' },
  { id: 'IOS-014', category: 'Security', scenario: 'App Transport Security (ATS)', priority: 'P0', status: 'pass', device: 'iPhone 15', os: 'iOS 17', time: '2.1s' },
  { id: 'IOS-015', category: 'Security', scenario: 'Jailbreak detection and block', priority: 'P0', status: 'pass', device: 'Simulator', os: 'iOS 17', time: '1.0s' },
];

const WINDOWS_SCENARIOS = [
  { id: 'WIN-001', category: 'Login', scenario: 'Windows Hello (fingerprint/face)', priority: 'P0', status: 'not_run', device: 'Surface Pro 9', os: 'Windows 11', time: '-' },
  { id: 'WIN-002', category: 'Login', scenario: 'PIN login on Windows tablet', priority: 'P0', status: 'not_run', device: 'Surface Go 3', os: 'Windows 11', time: '-' },
  { id: 'WIN-003', category: 'UI', scenario: 'Touch interface on Surface tablet', priority: 'P1', status: 'not_run', device: 'Surface Pro 9', os: 'Windows 11', time: '-' },
  { id: 'WIN-004', category: 'UI', scenario: 'Responsive layout in Edge mobile', priority: 'P1', status: 'not_run', device: 'Surface Duo', os: 'Android 12L', time: '-' },
  { id: 'WIN-005', category: 'PWA', scenario: 'Install as Progressive Web App', priority: 'P1', status: 'not_run', device: 'Surface Pro 9', os: 'Windows 11', time: '-' },
  { id: 'WIN-006', category: 'PWA', scenario: 'Offline PWA functionality', priority: 'P2', status: 'not_run', device: 'Surface Go 3', os: 'Windows 11', time: '-' },
  { id: 'WIN-007', category: 'Notification', scenario: 'Windows notification center', priority: 'P2', status: 'not_run', device: 'Surface Pro 9', os: 'Windows 11', time: '-' },
  { id: 'WIN-008', category: 'Pen', scenario: 'Surface Pen signature capture', priority: 'P2', status: 'not_run', device: 'Surface Pro 9', os: 'Windows 11', time: '-' },
];

const WEBAPP_SCENARIOS = [
  { id: 'WEB-001', category: 'Responsive', scenario: 'Dashboard renders on mobile viewport (375px)', priority: 'P0', status: 'pass', device: 'Chrome Mobile', os: 'Any', time: '1.5s' },
  { id: 'WEB-002', category: 'Responsive', scenario: 'Sidebar collapses to hamburger on mobile', priority: 'P0', status: 'pass', device: 'Safari Mobile', os: 'iOS', time: '1.2s' },
  { id: 'WEB-003', category: 'Responsive', scenario: 'Tables scroll horizontally on small screens', priority: 'P1', status: 'pass', device: 'Chrome Mobile', os: 'Android', time: '1.0s' },
  { id: 'WEB-004', category: 'Responsive', scenario: 'Forms usable with touch keyboard', priority: 'P1', status: 'pass', device: 'Safari Mobile', os: 'iOS', time: '2.1s' },
  { id: 'WEB-005', category: 'Browser', scenario: 'Chrome mobile — all features work', priority: 'P0', status: 'pass', device: 'Chrome 120', os: 'Android', time: '3.5s' },
  { id: 'WEB-006', category: 'Browser', scenario: 'Safari mobile — all features work', priority: 'P0', status: 'pass', device: 'Safari 17', os: 'iOS', time: '3.8s' },
  { id: 'WEB-007', category: 'Browser', scenario: 'Firefox mobile — all features work', priority: 'P1', status: 'pass', device: 'Firefox 120', os: 'Android', time: '4.0s' },
  { id: 'WEB-008', category: 'Browser', scenario: 'Samsung Internet browser', priority: 'P2', status: 'pass', device: 'Samsung Int.', os: 'Android', time: '3.2s' },
  { id: 'WEB-009', category: 'Touch', scenario: 'Touch gestures (swipe, pinch, tap)', priority: 'P1', status: 'pass', device: 'Chrome Mobile', os: 'Any', time: '2.5s' },
  { id: 'WEB-010', category: 'Touch', scenario: 'Long press context menu', priority: 'P2', status: 'pass', device: 'Safari Mobile', os: 'iOS', time: '1.8s' },
  { id: 'WEB-011', category: 'Performance', scenario: 'First Contentful Paint < 2s on 4G', priority: 'P0', status: 'pass', device: 'Lighthouse', os: 'Any', time: '1.8s' },
  { id: 'WEB-012', category: 'Performance', scenario: 'Time to Interactive < 3s on 4G', priority: 'P0', status: 'pass', device: 'Lighthouse', os: 'Any', time: '2.5s' },
];

const TEST_DATA = [
  { id: 'TD-001', type: 'Login', data: { username: 'rajesh.kumar', password: 'Test@123', pin: '1234', biometric: 'fingerprint' } },
  { id: 'TD-002', type: 'Transfer', data: { from: 'ACC-SAV-001', to: 'ACC-CUR-001', amount: 25000, upi: 'friend@upi', ifsc: 'HDFC0001234' } },
  { id: 'TD-003', type: 'Bill Payment', data: { biller: 'Electricity-MSEB', consumer: '123456789', amount: 2500, scheduled: false } },
  { id: 'TD-004', type: 'Card', data: { card_number: '****1234', pin: '5678', limit: 50000, action: 'block' } },
  { id: 'TD-005', type: 'Negative', data: { username: "admin' OR 1=1--", amount: -500, pin: '', otp: '000000' } },
  { id: 'TD-006', type: 'Boundary', data: { amount_zero: 0, amount_max: 10000001, pin_short: '12', pin_long: '12345678' } },
  { id: 'TD-007', type: 'Device', data: { android_device: 'Pixel 7', ios_device: 'iPhone 15 Pro', orientation: 'landscape', battery: '5%' } },
  { id: 'TD-008', type: 'Network', data: { wifi: true, mobile_data: '4G', airplane: true, vpn: 'corporate' } },
];

const statusColor = (s) => s === 'pass' ? '#22c55e' : s === 'fail' ? '#dc2626' : s === 'not_run' ? '#94a3b8' : '#f59e0b';
const statusBg = (s) => s === 'pass' ? '#dcfce7' : s === 'fail' ? '#fef2f2' : s === 'not_run' ? '#f1f5f9' : '#fef3c7';

const ScenarioTable = ({ scenarios, platformColor }) => {
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...new Set(scenarios.map(s => s.category))];
  const filtered = filter === 'all' ? scenarios : scenarios.filter(s => s.category === filter);
  const passed = scenarios.filter(s => s.status === 'pass').length;
  const failed = scenarios.filter(s => s.status === 'fail').length;
  const notRun = scenarios.filter(s => s.status === 'not_run').length;

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: 12 }}>
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#64748b' }}>Total: {scenarios.length}</span>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 3, background: '#dcfce7', color: '#166534', fontWeight: 600 }}>Pass: {passed}</span>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 3, background: '#fef2f2', color: '#dc2626', fontWeight: 600 }}>Fail: {failed}</span>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 3, background: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>Not Run: {notRun}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left: Scenario List */}
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#64748b' }}>Test Scenarios</h4>
          <div style={{ maxHeight: 500, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            {filtered.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 12px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <code style={{ fontSize: 10, color: platformColor, fontWeight: 700, minWidth: 60 }}>{s.id}</code>
                <span style={{ fontSize: 11, flex: 1 }}>{s.scenario}</span>
                <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: statusBg(s.status), color: statusColor(s.status), fontWeight: 700 }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Right: Mobile UI Preview */}
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#64748b' }}>Mobile UI Preview</h4>
          <div style={{ width: 280, margin: '0 auto', background: '#1e293b', borderRadius: 24, padding: '40px 12px 20px', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
            {/* Phone notch */}
            <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 80, height: 20, background: '#0f172a', borderRadius: 10 }} />
            {/* Screen */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 12, minHeight: 380 }}>
              <div style={{ background: platformColor, padding: '10px 12px', borderRadius: 8, marginBottom: 10, color: '#fff', fontSize: 13, fontWeight: 700 }}>
                Banking App
              </div>
              <div style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 11, display: 'flex', justifyContent: 'space-between' }}>
                <span>Account Balance</span>
                <strong>{'₹'}1,50,000.00</strong>
              </div>
              <div style={{ marginTop: 10, fontSize: 10, color: '#64748b' }}>Quick Actions</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6 }}>
                {['Transfer', 'Pay Bills', 'QR Scan', 'Statement'].map(a => (
                  <div key={a} style={{ background: '#f1f5f9', padding: '8px 6px', borderRadius: 6, textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#475569' }}>{a}</div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 10, color: '#64748b' }}>Recent Transactions</div>
              {['Electricity Bill -2,500', 'Salary +85,000', 'UPI Transfer -500'].map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f8fafc', fontSize: 10 }}>
                  <span>{t.split(' ')[0] + ' ' + t.split(' ')[1]}</span>
                  <span style={{ color: t.includes('+') ? '#22c55e' : '#dc2626', fontWeight: 600 }}>{t.split(' ').pop()}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                {['Home', 'Accounts', 'Transfer', 'More'].map(tab => (
                  <div key={tab} style={{ fontSize: 9, textAlign: 'center', color: tab === 'Home' ? platformColor : '#94a3b8', fontWeight: tab === 'Home' ? 700 : 400 }}>{tab}</div>
                ))}
              </div>
            </div>
            {/* Home indicator */}
            <div style={{ width: 100, height: 4, background: '#475569', borderRadius: 2, margin: '12px auto 0' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MobileTesting() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedData, setExpandedData] = useState({});

  const toggleData = (key) => setExpandedData(prev => ({ ...prev, [key]: !prev[key] }));

  const allScenarios = [...ANDROID_SCENARIOS, ...IOS_SCENARIOS, ...WINDOWS_SCENARIOS, ...WEBAPP_SCENARIOS];
  const totalPass = allScenarios.filter(s => s.status === 'pass').length;
  const totalFail = allScenarios.filter(s => s.status === 'fail').length;
  const totalNotRun = allScenarios.filter(s => s.status === 'not_run').length;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Mobile & Web App Testing</h2>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
          Android + iOS + Windows + Web App — {allScenarios.length} test scenarios across 4 platforms
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20, borderBottom: '2px solid #e2e8f0', paddingBottom: 12 }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            style={{ padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: activeTab === i ? '#4f46e5' : '#f1f5f9', color: activeTab === i ? '#fff' : '#475569' }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
            {[
              { label: 'Total Scenarios', value: allScenarios.length, color: '#4f46e5' },
              { label: 'Passed', value: totalPass, color: '#22c55e' },
              { label: 'Failed', value: totalFail, color: '#dc2626' },
              { label: 'Not Run', value: totalNotRun, color: '#94a3b8' },
              { label: 'Android', value: ANDROID_SCENARIOS.length, color: '#22c55e' },
              { label: 'iOS', value: IOS_SCENARIOS.length, color: '#3b82f6' },
              { label: 'Windows', value: WINDOWS_SCENARIOS.length, color: '#06b6d4' },
              { label: 'Web App', value: WEBAPP_SCENARIOS.length, color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 14, textAlign: 'center', borderTop: `3px solid ${s.color}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <h4 style={{ marginBottom: 10 }}>Platform Coverage</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {[
              { platform: 'Android', scenarios: ANDROID_SCENARIOS, color: '#22c55e', devices: ['Pixel 7', 'Samsung S23', 'OnePlus 12', 'Redmi Note 13'] },
              { platform: 'iOS (Apple)', scenarios: IOS_SCENARIOS, color: '#3b82f6', devices: ['iPhone 15 Pro', 'iPhone 15', 'iPad Pro'] },
              { platform: 'Windows Mobile', scenarios: WINDOWS_SCENARIOS, color: '#06b6d4', devices: ['Surface Pro 9', 'Surface Go 3', 'Surface Duo'] },
              { platform: 'Web App', scenarios: WEBAPP_SCENARIOS, color: '#f59e0b', devices: ['Chrome Mobile', 'Safari Mobile', 'Firefox', 'Samsung Internet'] },
            ].map((p, i) => {
              const pass = p.scenarios.filter(s => s.status === 'pass').length;
              const pct = p.scenarios.length > 0 ? Math.round((pass / p.scenarios.length) * 100) : 0;
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 14, borderLeft: `4px solid ${p.color}` }}>
                  <strong style={{ fontSize: 14 }}>{p.platform}</strong>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{pass}/{p.scenarios.length} passed</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#dc2626' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: pct + '%', background: pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#dc2626', borderRadius: 3 }} />
                  </div>
                  <div style={{ marginTop: 8, fontSize: 10, color: '#94a3b8' }}>
                    Devices: {p.devices.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 1 && <ScenarioTable scenarios={ANDROID_SCENARIOS} platformColor="#22c55e" />}
      {activeTab === 2 && <ScenarioTable scenarios={IOS_SCENARIOS} platformColor="#3b82f6" />}
      {activeTab === 3 && <ScenarioTable scenarios={WINDOWS_SCENARIOS} platformColor="#06b6d4" />}
      {activeTab === 4 && <ScenarioTable scenarios={WEBAPP_SCENARIOS} platformColor="#f59e0b" />}

      {activeTab === 5 && (
        <div>
          <h3 style={{ marginBottom: 16 }}>All Mobile Testing Use Cases</h3>
          {[
            { category: 'Functional Testing', usecases: [
              'App install/uninstall/update', 'Login with biometrics (fingerprint, Face ID, iris)', 'Session timeout and re-authentication',
              'Fund transfer (own account, NEFT, RTGS, IMPS, UPI)', 'Bill payment and recharge', 'Account statement and mini statement',
              'Card management (block, unblock, set limits)', 'QR code scan and pay', 'Beneficiary management',
              'Cheque book request', 'Fixed deposit creation', 'Loan EMI payment', 'Standing instructions setup',
            ]},
            { category: 'UI/UX Testing', usecases: [
              'Screen layout on different screen sizes', 'Orientation change (portrait to landscape)', 'Dark mode compatibility',
              'Font scaling and Dynamic Type', 'Touch target sizes (min 44px)', 'Keyboard interaction and auto-fill',
              'Gesture support (swipe, pinch, long press)', 'Loading indicators and skeleton screens', 'Error messages and empty states',
              'Navigation flow and back button behavior', 'Accessibility (VoiceOver, TalkBack)', 'RTL language support',
            ]},
            { category: 'Performance Testing', usecases: [
              'App launch time (cold start < 3s)', 'Screen transition time (< 300ms)', 'Memory usage under load',
              'Battery drain during active use', 'CPU usage during operations', 'Network bandwidth consumption',
              'Scroll performance (60fps)', 'Image loading and caching', 'Database query response time', 'Background sync efficiency',
            ]},
            { category: 'Network Testing', usecases: [
              'WiFi to mobile data handover', 'Airplane mode behavior', 'Slow network (2G/3G) simulation',
              'No network (offline mode)', 'Network timeout handling', 'API retry on failure',
              'Download resume after disconnect', 'VPN connectivity', 'Proxy settings handling', 'DNS resolution failure',
            ]},
            { category: 'Security Testing', usecases: [
              'SSL/TLS certificate pinning', 'Root/jailbreak detection', 'Data encryption at rest',
              'Secure keystore for credentials', 'Anti-tampering checks', 'Reverse engineering protection (obfuscation)',
              'Session hijacking prevention', 'Man-in-the-middle attack prevention', 'Clipboard data clearing',
              'Screenshot/screen recording prevention in sensitive screens', 'Biometric spoofing protection',
            ]},
            { category: 'Device-Specific Testing', usecases: [
              'Camera permission for QR scan', 'SMS permission for OTP auto-read', 'Contacts permission for beneficiary',
              'Location permission for branch finder', 'Storage permission for statement download',
              'Push notification delivery', 'Background app refresh', 'App behavior on incoming call',
              'App behavior on low storage', 'Multi-window / split screen mode', 'Foldable device support',
            ]},
            { category: 'Compatibility Testing', usecases: [
              'Android 12, 13, 14 compatibility', 'iOS 16, 17 compatibility', 'Different screen densities (hdpi, xhdpi, xxhdpi)',
              'Samsung, Pixel, OnePlus, Xiaomi OEM skins', 'Tablet vs phone layout', 'Wear OS companion app',
              'Chrome, Safari, Firefox mobile browsers', 'In-app browser / WebView behavior', 'Custom ROM behavior',
            ]},
          ].map((cat, ci) => (
            <div key={ci} style={{ marginBottom: 16 }}>
              <div onClick={() => toggleData(`cat-${ci}`)}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <strong style={{ fontSize: 13, color: '#1e293b' }}>{cat.category}</strong>
                <span style={{ fontSize: 11, color: '#64748b' }}>{cat.usecases.length} use cases {expandedData[`cat-${ci}`] !== false ? '\u25B2' : '\u25BC'}</span>
              </div>
              {expandedData[`cat-${ci}`] !== false && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 4, marginTop: 4 }}>
                  {cat.usecases.map((uc, ui) => (
                    <div key={ui} style={{ display: 'flex', gap: 6, padding: '5px 12px', fontSize: 12, color: '#475569', background: '#fff', borderRadius: 4, border: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#22c55e', fontWeight: 700 }}>{'✓'}</span> {uc}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 6 && (
        <div>
          <h3 style={{ marginBottom: 16 }}>Test Data & Results</h3>

          <h4 style={{ marginBottom: 8 }}>Test Data Sets</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 10, marginBottom: 24 }}>
            {TEST_DATA.map((td, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <code style={{ fontSize: 11, color: '#4f46e5', fontWeight: 700 }}>{td.id}</code>
                  <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 3, background: '#eff6ff', color: '#2563eb', fontWeight: 600 }}>{td.type}</span>
                </div>
                <pre style={{ fontSize: 10, background: '#0f172a', color: '#38bdf8', padding: 8, borderRadius: 4, margin: 0, overflowX: 'auto' }}>
                  {JSON.stringify(td.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>

          <h4 style={{ marginBottom: 8 }}>Consolidated Test Results</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Platform</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Total</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Pass</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Fail</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Not Run</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Android', scenarios: ANDROID_SCENARIOS, color: '#22c55e' },
                { name: 'iOS (Apple)', scenarios: IOS_SCENARIOS, color: '#3b82f6' },
                { name: 'Windows Mobile', scenarios: WINDOWS_SCENARIOS, color: '#06b6d4' },
                { name: 'Web App', scenarios: WEBAPP_SCENARIOS, color: '#f59e0b' },
              ].map((p, i) => {
                const pass = p.scenarios.filter(s => s.status === 'pass').length;
                const fail = p.scenarios.filter(s => s.status === 'fail').length;
                const nr = p.scenarios.filter(s => s.status === 'not_run').length;
                const rate = p.scenarios.length > 0 ? ((pass / p.scenarios.length) * 100).toFixed(1) : 0;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600 }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: p.color, marginRight: 6 }} />
                      {p.name}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600 }}>{p.scenarios.length}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#22c55e', fontWeight: 600 }}>{pass}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: fail > 0 ? '#dc2626' : '#64748b', fontWeight: 600 }}>{fail}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#94a3b8' }}>{nr}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: parseFloat(rate) >= 80 ? '#22c55e' : '#dc2626' }}>{rate}%</td>
                  </tr>
                );
              })}
              <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                <td style={{ padding: '8px 10px' }}>TOTAL</td>
                <td style={{ padding: '8px 10px', textAlign: 'center' }}>{allScenarios.length}</td>
                <td style={{ padding: '8px 10px', textAlign: 'center', color: '#22c55e' }}>{totalPass}</td>
                <td style={{ padding: '8px 10px', textAlign: 'center', color: '#dc2626' }}>{totalFail}</td>
                <td style={{ padding: '8px 10px', textAlign: 'center', color: '#94a3b8' }}>{totalNotRun}</td>
                <td style={{ padding: '8px 10px', textAlign: 'center', color: '#4f46e5' }}>{((totalPass / allScenarios.length) * 100).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

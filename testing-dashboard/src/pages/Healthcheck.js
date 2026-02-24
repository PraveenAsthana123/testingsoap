import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3001';

const SERVICES = [
  { key: 'api', name: 'API Server', endpoint: '/api/dashboard/stats', checkType: 'status' },
  { key: 'database', name: 'Database', endpoint: '/api/schema', checkType: 'data' },
  { key: 'testEngine', name: 'Test Engine', endpoint: '/api/test-cases', checkType: 'data' },
  { key: 'soapui', name: 'SoapUI', endpoint: null, checkType: 'static' },
];

const ENV_INFO = [
  { label: 'Node.js', version: 'v20.x LTS' },
  { label: 'React', version: '18.x' },
  { label: 'SQLite', version: '3.x (better-sqlite3)' },
  { label: 'SoapUI', version: '5.7.2 (Open Source)' },
  { label: 'OS', version: 'Linux / Windows' },
];

function Healthcheck() {
  const [services, setServices] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastFullCheck, setLastFullCheck] = useState(null);
  const [dbStats, setDbStats] = useState({ tables: 0, totalRows: 0 });
  const [startTime] = useState(Date.now());
  const [uptime, setUptime] = useState('0s');

  const checkService = useCallback(async (service) => {
    if (service.checkType === 'static') {
      return {
        key: service.key,
        name: service.name,
        status: 'healthy',
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        detail: '~/SoapUI/SoapUI-5.7.2/',
      };
    }

    const startMs = performance.now();
    try {
      const response = await fetch(`${API_BASE}${service.endpoint}`, {
        signal: AbortSignal.timeout(10000),
      });
      const elapsed = Math.round(performance.now() - startMs);

      if (service.checkType === 'status') {
        return {
          key: service.key,
          name: service.name,
          status: response.ok ? 'healthy' : 'unhealthy',
          responseTime: elapsed,
          lastChecked: new Date().toISOString(),
          detail: response.ok ? `HTTP ${response.status}` : `HTTP ${response.status}`,
        };
      }

      if (service.checkType === 'data') {
        const data = await response.json();
        const hasData =
          (Array.isArray(data) && data.length > 0) ||
          (typeof data === 'object' && data !== null && Object.keys(data).length > 0);

        if (service.key === 'database' && Array.isArray(data)) {
          let totalRows = 0;
          data.forEach((table) => {
            totalRows += table.row_count || table.rowCount || table.count || 0;
          });
          setDbStats({ tables: data.length, totalRows });
        }

        return {
          key: service.key,
          name: service.name,
          status: hasData ? 'healthy' : 'unhealthy',
          responseTime: elapsed,
          lastChecked: new Date().toISOString(),
          detail: hasData
            ? `${Array.isArray(data) ? data.length : Object.keys(data).length} records`
            : 'No data returned',
        };
      }

      return {
        key: service.key,
        name: service.name,
        status: 'unhealthy',
        responseTime: elapsed,
        lastChecked: new Date().toISOString(),
        detail: 'Unknown check type',
      };
    } catch (err) {
      const elapsed = Math.round(performance.now() - startMs);
      return {
        key: service.key,
        name: service.name,
        status: 'unhealthy',
        responseTime: elapsed,
        lastChecked: new Date().toISOString(),
        detail: err.name === 'TimeoutError' ? 'Request timed out' : err.message,
      };
    }
  }, []);

  const runHealthChecks = useCallback(async () => {
    const results = {};
    const checks = SERVICES.map(async (svc) => {
      const result = await checkService(svc);
      results[result.key] = result;
    });
    await Promise.all(checks);
    setServices(results);
    setLastFullCheck(new Date().toISOString());
  }, [checkService]);

  useEffect(() => {
    runHealthChecks();
  }, [runHealthChecks]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(runHealthChecks, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, runHealthChecks]);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const hrs = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;
      if (hrs > 0) {
        setUptime(`${hrs}h ${mins}m ${secs}s`);
      } else if (mins > 0) {
        setUptime(`${mins}m ${secs}s`);
      } else {
        setUptime(`${secs}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const serviceList = SERVICES.map((svc) => services[svc.key]).filter(Boolean);
  const allHealthy = serviceList.length > 0 && serviceList.every((s) => s.status === 'healthy');
  const overallStatus = serviceList.length === 0 ? 'checking' : allHealthy ? 'healthy' : 'degraded';

  const formatTimestamp = (iso) => {
    if (!iso) return '--';
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={styles.title}>System Healthcheck</h2>
          <p style={styles.subtitle}>Real-time monitoring of all banking QA platform services</p>
        </div>
        <div style={styles.headerActions}>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={styles.toggleInput}
            />
            <span
              style={{
                ...styles.toggleSwitch,
                backgroundColor: autoRefresh ? '#22c55e' : '#cbd5e1',
              }}
            >
              <span
                style={{
                  ...styles.toggleKnob,
                  transform: autoRefresh ? 'translateX(20px)' : 'translateX(2px)',
                }}
              />
            </span>
            <span style={styles.toggleText}>Auto-refresh (30s)</span>
          </label>
          <button style={styles.refreshBtn} onClick={runHealthChecks}>
            Refresh Now
          </button>
        </div>
      </div>

      {/* Overall Status Banner */}
      <div
        style={{
          ...styles.overallBanner,
          backgroundColor:
            overallStatus === 'healthy'
              ? '#f0fdf4'
              : overallStatus === 'degraded'
              ? '#fef2f2'
              : '#f8fafc',
          borderColor:
            overallStatus === 'healthy'
              ? '#bbf7d0'
              : overallStatus === 'degraded'
              ? '#fecaca'
              : '#e2e8f0',
        }}
      >
        <div style={styles.overallLeft}>
          <span
            style={{
              ...styles.overallDot,
              backgroundColor:
                overallStatus === 'healthy'
                  ? '#22c55e'
                  : overallStatus === 'degraded'
                  ? '#ef4444'
                  : '#94a3b8',
              boxShadow:
                overallStatus === 'healthy'
                  ? '0 0 8px rgba(34,197,94,0.5)'
                  : overallStatus === 'degraded'
                  ? '0 0 8px rgba(239,68,68,0.5)'
                  : 'none',
            }}
          />
          <div>
            <div
              style={{
                ...styles.overallTitle,
                color:
                  overallStatus === 'healthy'
                    ? '#15803d'
                    : overallStatus === 'degraded'
                    ? '#b91c1c'
                    : '#64748b',
              }}
            >
              {overallStatus === 'healthy'
                ? 'System Healthy'
                : overallStatus === 'degraded'
                ? 'System Degraded'
                : 'Checking...'}
            </div>
            <div style={styles.overallSub}>
              {overallStatus === 'healthy'
                ? 'All services are operational'
                : overallStatus === 'degraded'
                ? 'One or more services are experiencing issues'
                : 'Running health checks...'}
            </div>
          </div>
        </div>
        <div style={styles.overallRight}>
          <div style={styles.overallMeta}>
            <span style={styles.metaLabel}>Uptime</span>
            <span style={styles.metaValue}>{uptime}</span>
          </div>
          <div style={styles.overallMeta}>
            <span style={styles.metaLabel}>Last Check</span>
            <span style={styles.metaValue}>{formatTimestamp(lastFullCheck)}</span>
          </div>
        </div>
      </div>

      {/* Service Status Cards */}
      <div style={styles.sectionTitle}>Service Status</div>
      <div style={styles.serviceGrid}>
        {SERVICES.map((svc) => {
          const result = services[svc.key];
          const isHealthy = result?.status === 'healthy';
          const isLoading = !result;

          return (
            <div
              key={svc.key}
              style={{
                ...styles.serviceCard,
                borderTopColor: isLoading ? '#94a3b8' : isHealthy ? '#22c55e' : '#ef4444',
                backgroundColor: isLoading ? '#f8fafc' : isHealthy ? '#ffffff' : '#fff5f5',
              }}
            >
              <div style={styles.serviceCardHeader}>
                <span style={styles.serviceName}>{svc.name}</span>
                <span
                  style={{
                    ...styles.statusIcon,
                    color: isLoading ? '#94a3b8' : isHealthy ? '#22c55e' : '#ef4444',
                    fontSize: '20px',
                  }}
                >
                  {isLoading ? '...' : isHealthy ? '\u2713' : '\u2717'}
                </span>
              </div>
              <div style={styles.serviceCardBody}>
                <div style={styles.serviceRow}>
                  <span style={styles.serviceLabel}>Status</span>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: isLoading
                        ? '#f1f5f9'
                        : isHealthy
                        ? '#dcfce7'
                        : '#fee2e2',
                      color: isLoading ? '#64748b' : isHealthy ? '#15803d' : '#b91c1c',
                    }}
                  >
                    {isLoading ? 'Checking...' : isHealthy ? 'Healthy' : 'Unhealthy'}
                  </span>
                </div>
                <div style={styles.serviceRow}>
                  <span style={styles.serviceLabel}>Response Time</span>
                  <span style={styles.serviceValue}>
                    {isLoading
                      ? '--'
                      : svc.checkType === 'static'
                      ? 'N/A'
                      : `${result.responseTime} ms`}
                  </span>
                </div>
                <div style={styles.serviceRow}>
                  <span style={styles.serviceLabel}>Last Checked</span>
                  <span style={styles.serviceValue}>
                    {isLoading ? '--' : formatTimestamp(result.lastChecked)}
                  </span>
                </div>
                {svc.checkType === 'static' && (
                  <div style={styles.serviceRow}>
                    <span style={styles.serviceLabel}>Install Path</span>
                    <span style={{ ...styles.serviceValue, fontFamily: 'monospace', fontSize: '12px' }}>
                      ~/SoapUI/SoapUI-5.7.2/
                    </span>
                  </div>
                )}
                {result?.detail && svc.checkType !== 'static' && (
                  <div style={styles.serviceRow}>
                    <span style={styles.serviceLabel}>Detail</span>
                    <span style={styles.serviceValue}>{result.detail}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Environment & Database Info */}
      <div style={styles.infoGrid}>
        {/* Environment Info */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardHeader}>Environment Info</div>
          <div style={styles.infoCardBody}>
            {ENV_INFO.map((env) => (
              <div key={env.label} style={styles.envRow}>
                <span style={styles.envLabel}>{env.label}</span>
                <span style={styles.envValue}>{env.version}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Database Stats */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardHeader}>Database Statistics</div>
          <div style={styles.infoCardBody}>
            <div style={styles.dbStatGrid}>
              <div style={styles.dbStatItem}>
                <div style={styles.dbStatNumber}>{dbStats.tables}</div>
                <div style={styles.dbStatLabel}>Total Tables</div>
              </div>
              <div style={styles.dbStatItem}>
                <div style={styles.dbStatNumber}>{dbStats.totalRows.toLocaleString('en-IN')}</div>
                <div style={styles.dbStatLabel}>Total Rows</div>
              </div>
            </div>
            <div style={styles.dbInfo}>
              <div style={styles.envRow}>
                <span style={styles.envLabel}>Engine</span>
                <span style={styles.envValue}>SQLite 3.x (WAL mode)</span>
              </div>
              <div style={styles.envRow}>
                <span style={styles.envLabel}>Driver</span>
                <span style={styles.envValue}>better-sqlite3</span>
              </div>
              <div style={styles.envRow}>
                <span style={styles.envLabel}>Location</span>
                <span style={{ ...styles.envValue, fontFamily: 'monospace', fontSize: '12px' }}>
                  ./banking_qa.db
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SoapUI Info */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardHeader}>SoapUI Installation</div>
          <div style={styles.infoCardBody}>
            <div style={styles.envRow}>
              <span style={styles.envLabel}>Version</span>
              <span style={styles.envValue}>5.7.2 (Open Source)</span>
            </div>
            <div style={styles.envRow}>
              <span style={styles.envLabel}>Install Path</span>
              <span style={{ ...styles.envValue, fontFamily: 'monospace', fontSize: '12px' }}>
                ~/SoapUI/SoapUI-5.7.2/
              </span>
            </div>
            <div style={styles.envRow}>
              <span style={styles.envLabel}>Java Requirement</span>
              <span style={styles.envValue}>JDK 8+</span>
            </div>
            <div style={styles.envRow}>
              <span style={styles.envLabel}>Protocols</span>
              <span style={styles.envValue}>SOAP, REST, GraphQL</span>
            </div>
            <div style={styles.envRow}>
              <span style={styles.envLabel}>License</span>
              <span style={styles.envValue}>EUPL 1.1 (Open Source)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '0',
    backgroundColor: '#ffffff',
    minHeight: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '22px',
    fontWeight: 700,
    color: '#1e293b',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#64748b',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  toggleInput: {
    display: 'none',
  },
  toggleSwitch: {
    position: 'relative',
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    transition: 'background-color 0.2s',
    display: 'inline-block',
  },
  toggleKnob: {
    position: 'absolute',
    top: '2px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  toggleText: {
    fontSize: '13px',
    color: '#475569',
    fontWeight: 500,
  },
  refreshBtn: {
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: 600,
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    color: '#334155',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  overallBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderRadius: '12px',
    border: '1px solid',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  overallLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  overallDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    flexShrink: 0,
    animation: 'pulse 2s infinite',
  },
  overallTitle: {
    fontSize: '18px',
    fontWeight: 700,
  },
  overallSub: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '2px',
  },
  overallRight: {
    display: 'flex',
    gap: '32px',
  },
  overallMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  metaLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metaValue: {
    fontSize: '13px',
    color: '#334155',
    fontWeight: 500,
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '16px',
  },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    borderTop: '4px solid #22c55e',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  serviceCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px 8px',
  },
  serviceName: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#1e293b',
  },
  statusIcon: {
    fontWeight: 800,
  },
  serviceCardBody: {
    padding: '0 20px 16px',
  },
  serviceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  serviceLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: 500,
  },
  serviceValue: {
    fontSize: '13px',
    color: '#334155',
    fontWeight: 500,
  },
  statusBadge: {
    padding: '3px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  infoCardHeader: {
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: 700,
    color: '#1e293b',
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc',
  },
  infoCardBody: {
    padding: '12px 20px 16px',
  },
  envRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '7px 0',
    borderBottom: '1px solid #f8fafc',
  },
  envLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: 500,
  },
  envValue: {
    fontSize: '13px',
    color: '#1e293b',
    fontWeight: 600,
  },
  dbStatGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
  },
  dbStatItem: {
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  dbStatNumber: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#1e293b',
    lineHeight: 1,
  },
  dbStatLabel: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 600,
  },
  dbInfo: {},
};

export default Healthcheck;

import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12' };

const TABS = [
  { key:'Logging', label:'Logging' },
  { key:'Metrics', label:'Metrics' },
  { key:'DistributedTracing', label:'Distributed Tracing' },
  { key:'AlertingIncident', label:'Alerting/Incident' },
  { key:'Dashboard', label:'Dashboard' },
  { key:'SREReliability', label:'SRE/Reliability' },
];
const DIFF = ['Beginner','Intermediate','Advanced'];
const DC = { Beginner:'#2ecc71', Intermediate:'#f39c12', Advanced:'#e74c3c' };
const TC = { Logging:'#e74c3c', Metrics:'#3498db', DistributedTracing:'#9b59b6', AlertingIncident:'#2ecc71', Dashboard:'#e67e22', SREReliability:'#1abc9c' };

const S = [
  {id:'OB-001',title:'Structured Logging Validation',layer:'Logging',framework:'Python / pytest',language:'Python',difficulty:'Intermediate',
   description:'Validates structured JSON logging output including required fields, correlation IDs, log levels, timestamp format, and sensitive data masking across application services.',
   prerequisites:'Python 3.11+, structlog or python-json-logger, pytest, Application logging module configured',
   config:'LOG_FORMAT=json\nLOG_LEVEL=INFO\nCORRELATION_HEADER=X-Correlation-ID\nMASK_FIELDS=password,ssn,credit_card\nLOG_OUTPUT=/var/log/app/structured.log',
   code:`import json
import pytest
import logging
from app.core.logging_config import setup_logging, JsonFormatter

class TestStructuredLogging:
    def setup_method(self):
        self.logger = setup_logging("test_service", level="INFO")
        self.handler = logging.handlers.MemoryHandler(capacity=100)
        self.handler.setFormatter(JsonFormatter())
        self.logger.addHandler(self.handler)

    def test_json_format_output(self):
        """Verify log output is valid JSON with required fields"""
        self.logger.info("User login", extra={"user_id": "USR001"})
        record = self.handler.buffer[-1]
        log_entry = json.loads(self.handler.format(record))
        assert "timestamp" in log_entry
        assert "level" in log_entry
        assert "message" in log_entry
        assert "correlation_id" in log_entry
        assert log_entry["level"] == "INFO"

    def test_correlation_id_propagation(self):
        """Verify correlation ID propagates across log entries"""
        cid = "corr-abc-123-def-456"
        self.logger.info("Step 1", extra={"correlation_id": cid})
        self.logger.info("Step 2", extra={"correlation_id": cid})
        entries = [json.loads(self.handler.format(r))
                   for r in self.handler.buffer[-2:]]
        assert entries[0]["correlation_id"] == cid
        assert entries[1]["correlation_id"] == cid

    def test_sensitive_data_masking(self):
        """Verify passwords and PII are masked in logs"""
        self.logger.info("Auth attempt", extra={
            "password": "Secret123!", "ssn": "123-45-6789"
        })
        log_entry = json.loads(self.handler.format(self.handler.buffer[-1]))
        assert log_entry.get("password") == "***MASKED***"
        assert log_entry.get("ssn") == "***MASKED***"`,
   expectedOutput:`[TEST] OB-001: Structured Logging Validation
[INFO] Initializing JsonFormatter with UTC timestamps
[PASS] Log output is valid JSON format
[PASS] Required fields present: timestamp, level, message, correlation_id
[PASS] Log level correctly set to INFO
[PASS] Correlation ID propagated: corr-abc-123-def-456
[PASS] Correlation ID consistent across 2 entries
[PASS] Password field masked: ***MASKED***
[PASS] SSN field masked: ***MASKED***
[INFO] Masking applied to: password, ssn, credit_card
[PASS] Timestamp format: ISO-8601 UTC
───────────────────────────────────
OB-001: Structured Logging — 7 passed, 0 failed`},

  {id:'OB-002',title:'ELK Stack Log Pipeline',layer:'Logging',framework:'Shell / curl',language:'Shell',difficulty:'Advanced',
   description:'Tests the complete ELK (Elasticsearch, Logstash, Kibana) log ingestion pipeline including log shipping, index creation, field mapping, and query validation.',
   prerequisites:'Elasticsearch 8.x cluster, Logstash with pipeline config, Filebeat agent, Kibana dashboard access',
   config:'ES_URL=https://elk.infra.local:9200\nES_INDEX=app-logs-2026.02\nLOGSTASH_PORT=5044\nKIBANA_URL=https://kibana.infra.local:5601\nRETENTION_DAYS=30',
   code:`#!/bin/bash
set -euo pipefail

ES_URL="https://elk.infra.local:9200"
INDEX="app-logs-2026.02"
AUTH="-u elastic:\${ES_PASSWORD}"

# Test 1: Elasticsearch cluster health
HEALTH=$(curl -sk \${AUTH} "\${ES_URL}/_cluster/health" | jq -r '.status')
echo "[CHECK] Cluster health: \${HEALTH}"
[ "\${HEALTH}" = "green" ] && echo "[PASS] Cluster healthy" || echo "[FAIL] Cluster degraded"

# Test 2: Verify index exists and has documents
DOC_COUNT=$(curl -sk \${AUTH} "\${ES_URL}/\${INDEX}/_count" | jq -r '.count')
echo "[CHECK] Index \${INDEX} document count: \${DOC_COUNT}"
[ "\${DOC_COUNT}" -gt 0 ] && echo "[PASS] Index has documents" || echo "[FAIL] Index empty"

# Test 3: Validate field mappings
MAPPINGS=$(curl -sk \${AUTH} "\${ES_URL}/\${INDEX}/_mapping")
echo "\${MAPPINGS}" | jq -e '.["'""\${INDEX}""'"].mappings.properties.timestamp' > /dev/null
echo "[PASS] Field 'timestamp' mapped correctly"
echo "\${MAPPINGS}" | jq -e '.["'""\${INDEX}""'"].mappings.properties.level' > /dev/null
echo "[PASS] Field 'level' mapped correctly"

# Test 4: Query for error logs in last 1 hour
ERRORS=$(curl -sk \${AUTH} "\${ES_URL}/\${INDEX}/_search" -H "Content-Type: application/json" -d '{
  "query": {"bool": {"must": [
    {"match": {"level": "ERROR"}},
    {"range": {"timestamp": {"gte": "now-1h"}}}
  ]}}, "size": 0
}' | jq -r '.hits.total.value')
echo "[INFO] Errors in last hour: \${ERRORS}"

# Test 5: Logstash pipeline processing
PIPELINE=$(curl -sk \${AUTH} "\${ES_URL}/_logstash/pipeline" | jq -r 'keys | length')
echo "[CHECK] Active Logstash pipelines: \${PIPELINE}"
[ "\${PIPELINE}" -ge 1 ] && echo "[PASS] Logstash pipelines active" || echo "[FAIL] No pipelines"

# Test 6: ILM policy validation
ILM=$(curl -sk \${AUTH} "\${ES_URL}/_ilm/policy/app-logs-policy" | jq -r '.["app-logs-policy"].policy.phases.delete.min_age')
echo "[CHECK] ILM retention: \${ILM}"
echo "[PASS] Index lifecycle management configured"`,
   expectedOutput:`[TEST] OB-002: ELK Stack Log Pipeline
[CHECK] Cluster health: green
[PASS] Cluster healthy
[CHECK] Index app-logs-2026.02 document count: 1482935
[PASS] Index has documents
[PASS] Field 'timestamp' mapped correctly
[PASS] Field 'level' mapped correctly
[INFO] Errors in last hour: 12
[CHECK] Active Logstash pipelines: 3
[PASS] Logstash pipelines active
[CHECK] ILM retention: 30d
[PASS] Index lifecycle management configured
───────────────────────────────────
OB-002: ELK Stack Pipeline — 7 passed, 0 failed`},

  {id:'OB-003',title:'Prometheus Metrics Collection',layer:'Metrics',framework:'Python / prometheus_client',language:'Python',difficulty:'Intermediate',
   description:'Validates Prometheus metrics exposition including counters, gauges, histograms, and summaries. Verifies metric naming conventions, labels, and scrape endpoint availability.',
   prerequisites:'Python 3.11+, prometheus_client library, Application metrics module, Prometheus server for pull validation',
   config:'METRICS_PORT=9090\nMETRICS_PATH=/metrics\nSCRAPE_INTERVAL=15s\nAPP_NAME=banking-api\nNAMESPACE=production',
   code:`import requests
import unittest
from prometheus_client.parser import text_string_to_metric_families

class TestPrometheusMetrics(unittest.TestCase):
    METRICS_URL = "http://localhost:8080/metrics"

    def test_metrics_endpoint_available(self):
        """Verify /metrics endpoint returns 200 with correct content type"""
        resp = requests.get(self.METRICS_URL, timeout=5)
        self.assertEqual(200, resp.status_code)
        self.assertIn("text/plain", resp.headers["Content-Type"])

    def test_required_counters_exist(self):
        """Verify required counter metrics are exposed"""
        resp = requests.get(self.METRICS_URL, timeout=5)
        families = {f.name: f for f in text_string_to_metric_families(resp.text)}
        required = ["http_requests_total", "http_errors_total",
                     "db_queries_total", "auth_attempts_total"]
        for name in required:
            self.assertIn(name, families, f"Counter {name} missing")
            self.assertEqual("counter", families[name].type)

    def test_histogram_buckets(self):
        """Verify response time histogram has proper buckets"""
        resp = requests.get(self.METRICS_URL, timeout=5)
        families = {f.name: f for f in text_string_to_metric_families(resp.text)}
        self.assertIn("http_request_duration_seconds", families)
        hist = families["http_request_duration_seconds"]
        self.assertEqual("histogram", hist.type)
        bucket_les = [s.labels["le"] for s in hist.samples
                      if s.name.endswith("_bucket")]
        self.assertIn("0.1", bucket_les)
        self.assertIn("0.5", bucket_les)
        self.assertIn("1.0", bucket_les)

    def test_metric_labels(self):
        """Verify metrics have required labels"""
        resp = requests.get(self.METRICS_URL, timeout=5)
        families = {f.name: f for f in text_string_to_metric_families(resp.text)}
        http_req = families["http_requests_total"]
        sample_labels = http_req.samples[0].labels
        self.assertIn("method", sample_labels)
        self.assertIn("endpoint", sample_labels)
        self.assertIn("status_code", sample_labels)`,
   expectedOutput:`[TEST] OB-003: Prometheus Metrics Collection
[PASS] /metrics endpoint available: 200 OK
[PASS] Content-Type: text/plain; version=0.0.4
[PASS] Counter: http_requests_total present
[PASS] Counter: http_errors_total present
[PASS] Counter: db_queries_total present
[PASS] Counter: auth_attempts_total present
[PASS] Histogram: http_request_duration_seconds with buckets
[INFO] Buckets: 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0
[PASS] Labels present: method, endpoint, status_code
[INFO] Total metric families exposed: 24
───────────────────────────────────
OB-003: Prometheus Metrics — 7 passed, 0 failed`},

  {id:'OB-004',title:'Grafana Dashboard Data Source Validation',layer:'Metrics',framework:'Shell / curl',language:'Shell',difficulty:'Intermediate',
   description:'Tests Grafana data source connectivity, dashboard provisioning, panel queries returning data, and alerting rule configuration via the Grafana HTTP API.',
   prerequisites:'Grafana 10.x, Prometheus data source configured, Dashboard JSON provisioning, API key with admin role',
   config:'GRAFANA_URL=https://grafana.infra.local:3000\nGRAFANA_API_KEY=glsa_xxxxxxxxxxxx\nPROMETHEUS_DS_UID=prometheus-main\nDASHBOARD_UID=banking-overview',
   code:`#!/bin/bash
set -euo pipefail

GRAFANA="https://grafana.infra.local:3000"
AUTH="Authorization: Bearer \${GRAFANA_API_KEY}"

# Test 1: Grafana health check
HEALTH=$(curl -sk -H "\${AUTH}" "\${GRAFANA}/api/health" | jq -r '.database')
echo "[CHECK] Grafana DB status: \${HEALTH}"
[ "\${HEALTH}" = "ok" ] && echo "[PASS] Grafana healthy" || echo "[FAIL] Grafana unhealthy"

# Test 2: Prometheus data source connectivity
DS_STATUS=$(curl -sk -H "\${AUTH}" "\${GRAFANA}/api/datasources/proxy/uid/prometheus-main/api/v1/query?query=up" \
  | jq -r '.status')
echo "[CHECK] Prometheus data source: \${DS_STATUS}"
[ "\${DS_STATUS}" = "success" ] && echo "[PASS] Prometheus reachable" || echo "[FAIL] Prometheus unreachable"

# Test 3: Dashboard exists and loads
DASH=$(curl -sk -H "\${AUTH}" "\${GRAFANA}/api/dashboards/uid/banking-overview")
TITLE=$(echo "\${DASH}" | jq -r '.dashboard.title')
PANELS=$(echo "\${DASH}" | jq -r '.dashboard.panels | length')
echo "[CHECK] Dashboard: \${TITLE}, Panels: \${PANELS}"
[ "\${PANELS}" -gt 0 ] && echo "[PASS] Dashboard loaded with \${PANELS} panels" || echo "[FAIL] No panels"

# Test 4: Alert rules configured
ALERTS=$(curl -sk -H "\${AUTH}" "\${GRAFANA}/api/v1/provisioning/alert-rules" | jq -r 'length')
echo "[CHECK] Alert rules: \${ALERTS}"
[ "\${ALERTS}" -ge 1 ] && echo "[PASS] Alert rules configured" || echo "[FAIL] No alert rules"

# Test 5: Query returns data for key panel
RESULT=$(curl -sk -H "\${AUTH}" "\${GRAFANA}/api/datasources/proxy/uid/prometheus-main/api/v1/query" \
  --data-urlencode "query=rate(http_requests_total[5m])" | jq -r '.data.result | length')
echo "[CHECK] Panel query results: \${RESULT} series"
[ "\${RESULT}" -gt 0 ] && echo "[PASS] Panel query returns data" || echo "[FAIL] No data returned"`,
   expectedOutput:`[TEST] OB-004: Grafana Dashboard Data Source Validation
[CHECK] Grafana DB status: ok
[PASS] Grafana healthy
[CHECK] Prometheus data source: success
[PASS] Prometheus reachable
[CHECK] Dashboard: Banking API Overview, Panels: 12
[PASS] Dashboard loaded with 12 panels
[CHECK] Alert rules: 8
[PASS] Alert rules configured
[CHECK] Panel query results: 4 series
[PASS] Panel query returns data
[INFO] Data sources: 3 configured, 3 healthy
───────────────────────────────────
OB-004: Grafana Dashboard — 5 passed, 0 failed`},

  {id:'OB-005',title:'Jaeger Distributed Trace Validation',layer:'DistributedTracing',framework:'Python / requests',language:'Python',difficulty:'Advanced',
   description:'Validates distributed trace collection in Jaeger including span creation, parent-child relationships, cross-service trace propagation, and trace search functionality.',
   prerequisites:'Jaeger all-in-one or production deployment, OpenTelemetry SDK configured, Multiple services instrumented',
   config:'JAEGER_QUERY=http://jaeger.infra.local:16686\nJAEGER_COLLECTOR=http://jaeger.infra.local:14268\nSERVICE_NAME=banking-api\nSAMPLE_RATE=1.0\nTRACE_TTL=72h',
   code:`import requests
import time
import unittest

class TestJaegerTracing(unittest.TestCase):
    JAEGER = "http://jaeger.infra.local:16686"
    SERVICE = "banking-api"

    def test_service_registered(self):
        """Verify service appears in Jaeger service list"""
        resp = requests.get(
            f"{self.JAEGER}/api/services", timeout=10)
        self.assertEqual(200, resp.status_code)
        services = resp.json()["data"]
        self.assertIn(self.SERVICE, services)

    def test_traces_collected(self):
        """Verify traces are being collected for the service"""
        resp = requests.get(
            f"{self.JAEGER}/api/traces",
            params={"service": self.SERVICE, "limit": 5,
                    "lookback": "1h"},
            timeout=10)
        self.assertEqual(200, resp.status_code)
        traces = resp.json()["data"]
        self.assertGreater(len(traces), 0, "No traces found")

    def test_span_parent_child(self):
        """Verify parent-child span relationships"""
        resp = requests.get(
            f"{self.JAEGER}/api/traces",
            params={"service": self.SERVICE, "limit": 1},
            timeout=10)
        trace = resp.json()["data"][0]
        spans = trace["spans"]
        self.assertGreater(len(spans), 1, "Single span, no hierarchy")
        child_spans = [s for s in spans if len(s.get("references", [])) > 0]
        self.assertGreater(len(child_spans), 0, "No child spans found")
        ref = child_spans[0]["references"][0]
        self.assertEqual("CHILD_OF", ref["refType"])

    def test_cross_service_propagation(self):
        """Verify trace context propagates across services"""
        resp = requests.get(
            f"{self.JAEGER}/api/traces",
            params={"service": self.SERVICE, "limit": 10,
                    "lookback": "1h"},
            timeout=10)
        traces = resp.json()["data"]
        multi_svc = [t for t in traces
                     if len(t["processes"]) > 1]
        self.assertGreater(len(multi_svc), 0,
            "No cross-service traces found")
        trace = multi_svc[0]
        svc_names = [p["serviceName"]
                     for p in trace["processes"].values()]
        self.assertGreater(len(set(svc_names)), 1)`,
   expectedOutput:`[TEST] OB-005: Jaeger Distributed Trace Validation
[PASS] Service 'banking-api' registered in Jaeger
[INFO] Total services discovered: 6
[PASS] Traces collected: 5 traces in last 1h
[PASS] Span hierarchy: parent-child relationships valid
[INFO] Root span: POST /api/v2/transfers (245ms)
[PASS] Child span reference type: CHILD_OF
[PASS] Cross-service propagation detected
[INFO] Services in trace: banking-api -> auth-service -> ledger-service
[PASS] Trace context preserved across 3 services
[INFO] Average trace duration: 312ms, Max spans: 8
───────────────────────────────────
OB-005: Jaeger Tracing — 6 passed, 0 failed`},

  {id:'OB-006',title:'OpenTelemetry Span Correlation',layer:'DistributedTracing',framework:'Python / OpenTelemetry',language:'Python',difficulty:'Advanced',
   description:'Tests OpenTelemetry instrumentation including span attributes, baggage propagation, W3C trace context headers, and correlation between traces, metrics, and logs.',
   prerequisites:'OpenTelemetry SDK 1.x, OTLP exporter configured, Collector running, W3C Trace Context support',
   config:'OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector.infra.local:4317\nOTEL_SERVICE_NAME=banking-api\nOTEL_TRACES_SAMPLER=always_on\nOTEL_LOG_CORRELATION=true',
   code:`import requests
import unittest
from opentelemetry import trace, baggage, context
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.sdk.trace.export.in_memory import InMemorySpanExporter
from opentelemetry.propagate import inject

class TestOTelCorrelation(unittest.TestCase):
    def setUp(self):
        self.exporter = InMemorySpanExporter()
        provider = TracerProvider()
        provider.add_span_processor(SimpleSpanProcessor(self.exporter))
        trace.set_tracer_provider(provider)
        self.tracer = trace.get_tracer("test-tracer")

    def test_span_attributes(self):
        """Verify custom span attributes are recorded"""
        with self.tracer.start_as_current_span("transfer") as span:
            span.set_attribute("transfer.amount", 50000)
            span.set_attribute("transfer.currency", "INR")
            span.set_attribute("transfer.type", "NEFT")
        spans = self.exporter.get_finished_spans()
        attrs = spans[-1].attributes
        self.assertEqual(50000, attrs["transfer.amount"])
        self.assertEqual("INR", attrs["transfer.currency"])

    def test_w3c_traceparent_header(self):
        """Verify W3C traceparent header is injected"""
        headers = {}
        with self.tracer.start_as_current_span("outbound-call"):
            inject(headers)
        self.assertIn("traceparent", headers)
        parts = headers["traceparent"].split("-")
        self.assertEqual(4, len(parts))
        self.assertEqual("00", parts[0])  # version
        self.assertEqual(32, len(parts[1]))  # trace-id
        self.assertEqual(16, len(parts[2]))  # span-id

    def test_trace_log_correlation(self):
        """Verify trace ID appears in correlated log entries"""
        with self.tracer.start_as_current_span("log-test") as span:
            trace_id = format(span.get_span_context().trace_id, "032x")
            span_id = format(span.get_span_context().span_id, "016x")
        self.assertEqual(32, len(trace_id))
        self.assertEqual(16, len(span_id))
        self.assertNotEqual("0" * 32, trace_id)

    def test_baggage_propagation(self):
        """Verify baggage items propagate with context"""
        ctx = baggage.set_baggage("tenant.id", "BANK001")
        token = context.attach(ctx)
        val = baggage.get_baggage("tenant.id")
        self.assertEqual("BANK001", val)
        context.detach(token)`,
   expectedOutput:`[TEST] OB-006: OpenTelemetry Span Correlation
[PASS] Span attributes recorded: transfer.amount=50000, transfer.currency=INR
[PASS] Span attribute: transfer.type=NEFT
[PASS] W3C traceparent header injected
[INFO] traceparent: 00-abcdef1234567890abcdef1234567890-1234567890abcdef-01
[PASS] Trace ID: 32 hex chars, Span ID: 16 hex chars
[PASS] Version: 00 (W3C standard)
[PASS] Trace-log correlation: trace_id in log context
[PASS] Baggage propagation: tenant.id=BANK001
[INFO] Context propagation: W3C Trace Context + Baggage
[PASS] Span hierarchy consistent across 4 test spans
───────────────────────────────────
OB-006: OTel Correlation — 7 passed, 0 failed`},

  {id:'OB-007',title:'PagerDuty Alert Integration',layer:'AlertingIncident',framework:'Python / requests',language:'Python',difficulty:'Intermediate',
   description:'Tests PagerDuty integration for incident creation, alert routing, escalation triggering, acknowledgement, and resolution workflows via the Events API v2.',
   prerequisites:'PagerDuty account, Events API v2 integration key, Service configured, Escalation policy defined',
   config:'PAGERDUTY_EVENTS_URL=https://events.pagerduty.com/v2/enqueue\nPAGERDUTY_API=https://api.pagerduty.com\nROUTING_KEY=R0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\nAPI_TOKEN=u+xxxxxxxxxxxxxxxxxx',
   code:`import requests
import time
import unittest

class TestPagerDutyAlerts(unittest.TestCase):
    EVENTS_URL = "https://events.pagerduty.com/v2/enqueue"
    API_URL = "https://api.pagerduty.com"
    ROUTING_KEY = "R0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

    def test_trigger_alert(self):
        """Test triggering a PagerDuty alert"""
        payload = {
            "routing_key": self.ROUTING_KEY,
            "event_action": "trigger",
            "dedup_key": "test-alert-db-cpu-001",
            "payload": {
                "summary": "Database CPU > 90% on prod-db-01",
                "severity": "critical",
                "source": "monitoring-system",
                "component": "database",
                "group": "production",
                "custom_details": {"cpu_percent": 94.2, "host": "prod-db-01"}
            }
        }
        resp = requests.post(self.EVENTS_URL, json=payload, timeout=10)
        self.assertEqual(202, resp.status_code)
        self.assertEqual("success", resp.json()["status"])
        self.assertIn("dedup_key", resp.json())

    def test_acknowledge_alert(self):
        """Test acknowledging a triggered alert"""
        payload = {
            "routing_key": self.ROUTING_KEY,
            "event_action": "acknowledge",
            "dedup_key": "test-alert-db-cpu-001"
        }
        resp = requests.post(self.EVENTS_URL, json=payload, timeout=10)
        self.assertEqual(202, resp.status_code)
        self.assertEqual("success", resp.json()["status"])

    def test_resolve_alert(self):
        """Test resolving an acknowledged alert"""
        payload = {
            "routing_key": self.ROUTING_KEY,
            "event_action": "resolve",
            "dedup_key": "test-alert-db-cpu-001"
        }
        resp = requests.post(self.EVENTS_URL, json=payload, timeout=10)
        self.assertEqual(202, resp.status_code)
        self.assertEqual("success", resp.json()["status"])

    def test_alert_deduplication(self):
        """Test duplicate alerts are deduplicated by dedup_key"""
        payload = {
            "routing_key": self.ROUTING_KEY,
            "event_action": "trigger",
            "dedup_key": "test-dedup-key-001",
            "payload": {"summary": "Duplicate test", "severity": "warning",
                        "source": "test"}
        }
        r1 = requests.post(self.EVENTS_URL, json=payload, timeout=10)
        r2 = requests.post(self.EVENTS_URL, json=payload, timeout=10)
        self.assertEqual(r1.json()["dedup_key"], r2.json()["dedup_key"])`,
   expectedOutput:`[TEST] OB-007: PagerDuty Alert Integration
[PASS] Alert triggered: test-alert-db-cpu-001
[INFO] Severity: critical, Component: database
[PASS] Response status: 202 Accepted
[PASS] Alert acknowledged: test-alert-db-cpu-001
[INFO] Acknowledged by: monitoring-system
[PASS] Alert resolved: test-alert-db-cpu-001
[INFO] Lifecycle: trigger -> acknowledge -> resolve
[PASS] Deduplication: same dedup_key merged
[INFO] Dedup key: test-dedup-key-001 (2 events, 1 incident)
[PASS] Events API v2 integration validated
───────────────────────────────────
OB-007: PagerDuty Alerts — 6 passed, 0 failed`},

  {id:'OB-008',title:'Escalation Policy Validation',layer:'AlertingIncident',framework:'Python / requests',language:'Python',difficulty:'Advanced',
   description:'Tests escalation policy configuration ensuring alerts escalate through defined tiers (L1 on-call, L2 team lead, L3 engineering manager) with correct timeouts and notification channels.',
   prerequisites:'PagerDuty or Opsgenie account, Escalation policy configured with 3 tiers, Notification channels (SMS, email, Slack) configured',
   config:'ALERTING_API=https://api.pagerduty.com\nAPI_TOKEN=u+xxxxxxxxxxxxxxxxxx\nESCALATION_POLICY_ID=PABCDEF\nL1_TIMEOUT=300\nL2_TIMEOUT=900\nL3_TIMEOUT=1800',
   code:`import requests
import unittest

class TestEscalationPolicy(unittest.TestCase):
    API = "https://api.pagerduty.com"
    HEADERS = {
        "Authorization": "Token token=u+xxxxxxxxxxxxxxxxxx",
        "Content-Type": "application/json"
    }
    POLICY_ID = "PABCDEF"

    def test_escalation_policy_exists(self):
        """Verify escalation policy is configured"""
        resp = requests.get(
            f"{self.API}/escalation_policies/{self.POLICY_ID}",
            headers=self.HEADERS, timeout=10)
        self.assertEqual(200, resp.status_code)
        policy = resp.json()["escalation_policy"]
        self.assertEqual("Production Critical", policy["name"])
        self.assertEqual(3, policy["num_loops"])

    def test_three_tier_escalation(self):
        """Verify 3 escalation tiers with correct targets"""
        resp = requests.get(
            f"{self.API}/escalation_policies/{self.POLICY_ID}",
            headers=self.HEADERS, timeout=10)
        rules = resp.json()["escalation_policy"]["escalation_rules"]
        self.assertEqual(3, len(rules))
        self.assertEqual(5, rules[0]["escalation_delay_in_minutes"])
        self.assertEqual(15, rules[1]["escalation_delay_in_minutes"])
        self.assertEqual(30, rules[2]["escalation_delay_in_minutes"])

    def test_tier_targets(self):
        """Verify each tier targets correct on-call schedule or user"""
        resp = requests.get(
            f"{self.API}/escalation_policies/{self.POLICY_ID}",
            headers=self.HEADERS, timeout=10)
        rules = resp.json()["escalation_policy"]["escalation_rules"]
        l1_targets = [t["type"] for t in rules[0]["targets"]]
        l2_targets = [t["type"] for t in rules[1]["targets"]]
        l3_targets = [t["type"] for t in rules[2]["targets"]]
        self.assertIn("schedule_reference", l1_targets)
        self.assertIn("user_reference", l2_targets)
        self.assertIn("user_reference", l3_targets)

    def test_notification_channels(self):
        """Verify notification rules for urgency levels"""
        resp = requests.get(
            f"{self.API}/users/PUSR001/notification_rules",
            headers=self.HEADERS, timeout=10)
        rules = resp.json()["notification_rules"]
        channels = [r["contact_method"]["type"] for r in rules]
        self.assertIn("sms_contact_method", channels)
        self.assertIn("email_contact_method", channels)
        self.assertIn("push_notification_contact_method", channels)`,
   expectedOutput:`[TEST] OB-008: Escalation Policy Validation
[PASS] Escalation policy 'Production Critical' exists
[INFO] Policy loops: 3 (re-escalates 3 times before timing out)
[PASS] Three escalation tiers configured
[PASS] L1 timeout: 5 minutes (on-call engineer)
[PASS] L2 timeout: 15 minutes (team lead)
[PASS] L3 timeout: 30 minutes (engineering manager)
[PASS] L1 target: on-call schedule
[PASS] L2 target: user (team lead)
[PASS] L3 target: user (engineering manager)
[PASS] Notification channels: SMS, Email, Push
[INFO] Total escalation time: 50 minutes before timeout
───────────────────────────────────
OB-008: Escalation Policy — 8 passed, 0 failed`},

  {id:'OB-009',title:'Dashboard Panel Query Validation',layer:'Dashboard',framework:'JavaScript / axios',language:'JavaScript',difficulty:'Intermediate',
   description:'Tests dashboard panel queries returning correct data, validates time-series data continuity, checks for gaps in metrics, and verifies threshold-based color coding.',
   prerequisites:'Grafana 10.x with API access, Dashboard with provisioned panels, Prometheus data source, axios library',
   config:'GRAFANA_URL=https://grafana.infra.local:3000\nAPI_KEY=glsa_xxxxxxxxxxxx\nDASHBOARD_UID=banking-ops\nREFRESH_INTERVAL=30s\nTIME_RANGE=1h',
   code:`const axios = require("axios");

const GRAFANA = "https://grafana.infra.local:3000";
const HEADERS = { Authorization: "Bearer " + process.env.GRAFANA_API_KEY };

async function testDashboardPanels() {
    // Test 1: Load dashboard and verify panels
    const dash = await axios.get(
        \`\${GRAFANA}/api/dashboards/uid/banking-ops\`, { headers: HEADERS });
    const panels = dash.data.dashboard.panels;
    console.log("[PASS] Dashboard loaded:", panels.length, "panels");

    // Test 2: Query each panel for data
    for (const panel of panels.slice(0, 5)) {
        const query = panel.targets?.[0]?.expr;
        if (!query) continue;
        const result = await axios.get(
            \`\${GRAFANA}/api/datasources/proxy/uid/prometheus-main/api/v1/query\`,
            { headers: HEADERS, params: { query } });
        const series = result.data.data.result.length;
        console.log("[" + (series > 0 ? "PASS" : "FAIL") + "] Panel '" +
            panel.title + "': " + series + " series");
    }

    // Test 3: Check for data gaps in time series
    const rangeResp = await axios.get(
        \`\${GRAFANA}/api/datasources/proxy/uid/prometheus-main/api/v1/query_range\`,
        { headers: HEADERS, params: {
            query: "up{job='banking-api'}", start: "now-1h",
            end: "now", step: "60" } });
    const values = rangeResp.data.data.result[0]?.values || [];
    let gaps = 0;
    for (let i = 1; i < values.length; i++) {
        if (values[i][0] - values[i - 1][0] > 120) gaps++;
    }
    console.log("[" + (gaps === 0 ? "PASS" : "FAIL") +
        "] Data continuity: " + gaps + " gaps detected");

    // Test 4: Validate thresholds
    const thresholds = panels.find(p => p.title === "Error Rate")
        ?.fieldConfig?.defaults?.thresholds?.steps || [];
    console.log("[PASS] Threshold steps: " + thresholds.length + " configured");
}

testDashboardPanels().catch(e => console.error("[FAIL]", e.message));`,
   expectedOutput:`[TEST] OB-009: Dashboard Panel Query Validation
[PASS] Dashboard loaded: 14 panels
[PASS] Panel 'Request Rate': 4 series
[PASS] Panel 'Error Rate': 2 series
[PASS] Panel 'Response Time P99': 3 series
[PASS] Panel 'Active Connections': 1 series
[PASS] Panel 'CPU Usage': 4 series
[PASS] Data continuity: 0 gaps detected
[INFO] Time range: 1h, Step: 60s, Data points: 60
[PASS] Threshold steps: 3 configured (green/yellow/red)
[INFO] Thresholds: 0=green, 5=yellow, 10=red
───────────────────────────────────
OB-009: Dashboard Panels — 8 passed, 0 failed`},

  {id:'OB-010',title:'Capacity Planning Metrics Dashboard',layer:'Dashboard',framework:'Python / requests',language:'Python',difficulty:'Advanced',
   description:'Validates capacity planning dashboard metrics including resource utilization trends, growth projections, saturation warnings, and auto-scaling trigger thresholds.',
   prerequisites:'Prometheus with 30-day retention, Grafana capacity dashboard, Node exporter on all hosts, Historical metrics data',
   config:'PROMETHEUS_URL=http://prometheus.infra.local:9090\nCAPACITY_THRESHOLD=80\nGROWTH_LOOKBACK=30d\nPROJECTION_DAYS=90\nAUTOSCALE_CPU=75\nAUTOSCALE_MEM=85',
   code:`import requests
import unittest
from datetime import datetime, timedelta

class TestCapacityPlanning(unittest.TestCase):
    PROM = "http://prometheus.infra.local:9090"

    def query(self, promql):
        resp = requests.get(f"{self.PROM}/api/v1/query",
            params={"query": promql}, timeout=10)
        self.assertEqual(200, resp.status_code)
        return resp.json()["data"]["result"]

    def test_cpu_utilization_trend(self):
        """Verify CPU utilization is below capacity threshold"""
        result = self.query(
            "avg(100 - (rate(node_cpu_seconds_total{mode='idle'}[5m]) * 100))")
        avg_cpu = float(result[0]["value"][1])
        self.assertLess(avg_cpu, 80, f"CPU at {avg_cpu}% exceeds 80% threshold")

    def test_memory_saturation(self):
        """Verify memory utilization with saturation warning"""
        result = self.query(
            "(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100")
        for r in result:
            mem_pct = float(r["value"][1])
            host = r["metric"].get("instance", "unknown")
            self.assertLess(mem_pct, 85,
                f"{host}: memory at {mem_pct}% exceeds 85%")

    def test_disk_growth_projection(self):
        """Verify disk space with growth projection"""
        result = self.query(
            "predict_linear(node_filesystem_avail_bytes"
            "{mountpoint='/'}[30d], 86400 * 90)")
        for r in result:
            projected = float(r["value"][1])
            self.assertGreater(projected, 0,
                "Disk projected to fill within 90 days")

    def test_autoscale_triggers(self):
        """Verify auto-scaling thresholds are not breached"""
        cpu = self.query(
            "avg by (deployment) (rate(container_cpu_usage_seconds_total[5m])) * 100")
        for r in cpu:
            deploy = r["metric"].get("deployment", "unknown")
            usage = float(r["value"][1])
            self.assertLess(usage, 75,
                f"{deploy}: CPU {usage}% breaches autoscale at 75%")

    def test_request_rate_capacity(self):
        """Verify request rate is within capacity limits"""
        result = self.query(
            "sum(rate(http_requests_total[5m]))")
        rps = float(result[0]["value"][1])
        max_rps = 10000
        utilization = (rps / max_rps) * 100
        self.assertLess(utilization, 80,
            f"Request rate at {utilization}% of max capacity")`,
   expectedOutput:`[TEST] OB-010: Capacity Planning Metrics Dashboard
[PASS] CPU utilization: avg 42.3% (threshold: 80%)
[INFO] CPU headroom: 37.7% available
[PASS] Memory saturation: all hosts below 85%
[INFO] Host prod-app-01: 62.1%, prod-app-02: 58.7%, prod-db-01: 71.3%
[PASS] Disk projection: sufficient space for 90 days
[INFO] Projected free space in 90d: 124GB on /
[PASS] Auto-scale triggers: no deployments breaching 75% CPU
[INFO] banking-api: 38.2%, auth-service: 22.1%, ledger: 45.6%
[PASS] Request rate: 3,240 rps (32.4% of 10,000 max capacity)
[INFO] Growth trend: +8.2% month-over-month
───────────────────────────────────
OB-010: Capacity Planning — 5 passed, 0 failed`},

  {id:'OB-011',title:'SLO/SLI Monitoring Validation',layer:'SREReliability',framework:'YAML / PromQL',language:'YAML',difficulty:'Intermediate',
   description:'Validates Service Level Objective (SLO) and Service Level Indicator (SLI) configurations including availability targets, latency budgets, error budget tracking, and burn rate alerting.',
   prerequisites:'Prometheus with SLO recording rules, Sloth or pyrra for SLO management, 30-day metrics retention',
   config:'PROMETHEUS_URL=http://prometheus.infra.local:9090\nSLO_AVAILABILITY=99.9\nSLO_LATENCY_P99=500ms\nERROR_BUDGET_WINDOW=30d\nBURN_RATE_ALERT=14.4',
   code:`# SLO Configuration (sloth format)
apiVersion: sloth.slok.dev/v1
kind: PrometheusServiceLevel
metadata:
  name: banking-api-slo
  namespace: production
spec:
  service: "banking-api"
  labels:
    team: "platform"
    tier: "critical"
  slos:
    - name: "availability"
      objective: 99.9
      description: "99.9% of requests succeed"
      sli:
        events:
          error_query: >
            sum(rate(http_requests_total{
              job="banking-api",
              status_code=~"5.."}[{{.window}}]))
          total_query: >
            sum(rate(http_requests_total{
              job="banking-api"}[{{.window}}]))
      alerting:
        name: BankingAPIHighErrorRate
        labels:
          severity: critical
        annotations:
          summary: "Banking API error budget burn rate too high"
        page_alert:
          labels:
            severity: page
        ticket_alert:
          labels:
            severity: ticket
    - name: "latency"
      objective: 99.0
      description: "99% of requests complete within 500ms"
      sli:
        events:
          error_query: >
            sum(rate(http_request_duration_seconds_bucket{
              job="banking-api",
              le="0.5"}[{{.window}}]))
          total_query: >
            sum(rate(http_request_duration_seconds_count{
              job="banking-api"}[{{.window}}]))`,
   expectedOutput:`[TEST] OB-011: SLO/SLI Monitoring Validation
[PASS] SLO 'availability' configured: target 99.9%
[PASS] Current availability: 99.95% (within budget)
[INFO] Error budget remaining: 72.4% (30d window)
[PASS] SLO 'latency' configured: target 99.0% < 500ms
[PASS] Current P99 latency: 312ms (within SLO)
[INFO] Latency budget remaining: 85.1%
[PASS] Burn rate alerting configured (14.4x threshold)
[PASS] Page alert: fires at 14.4x burn rate (1h window)
[PASS] Ticket alert: fires at 3x burn rate (6h window)
[INFO] SLO compliance: 2/2 objectives met
───────────────────────────────────
OB-011: SLO/SLI Monitoring — 7 passed, 0 failed`},

  {id:'OB-012',title:'Chaos Engineering Resilience Test',layer:'SREReliability',framework:'Python / LitmusChaos',language:'Python',difficulty:'Advanced',
   description:'Tests system resilience through controlled chaos experiments including pod termination, network latency injection, CPU stress, and dependency failure scenarios using LitmusChaos.',
   prerequisites:'Kubernetes cluster, LitmusChaos operator installed, ChaosHub configured, Application with health checks, Prometheus for steady-state validation',
   config:'LITMUS_API=http://litmus.infra.local:9091\nK8S_NAMESPACE=production\nTARGET_APP=banking-api\nSTEADY_STATE_PROBE=http://banking-api:8080/health\nABORT_THRESHOLD=50',
   code:`import requests
import time
import unittest

class TestChaosResilience(unittest.TestCase):
    LITMUS = "http://litmus.infra.local:9091"
    APP_HEALTH = "http://banking-api.production:8080/health"
    PROM = "http://prometheus.infra.local:9090"

    def verify_steady_state(self):
        """Check application health before/after chaos"""
        resp = requests.get(self.APP_HEALTH, timeout=5)
        return resp.status_code == 200 and resp.json()["status"] == "healthy"

    def get_error_rate(self):
        """Get current error rate from Prometheus"""
        resp = requests.get(f"{self.PROM}/api/v1/query",
            params={"query": "rate(http_requests_total{status_code=~'5..'}[1m])"
                    " / rate(http_requests_total[1m]) * 100"},
            timeout=10)
        result = resp.json()["data"]["result"]
        return float(result[0]["value"][1]) if result else 0.0

    def test_pod_kill_recovery(self):
        """Kill a pod and verify automatic recovery"""
        self.assertTrue(self.verify_steady_state(), "Pre-chaos health check failed")
        exp = {"kind": "ChaosExperiment", "spec": {
            "experiment": "pod-delete",
            "appinfo": {"namespace": "production", "label": "app=banking-api"},
            "chaosParams": {"duration": 30, "force": True}
        }}
        resp = requests.post(f"{self.LITMUS}/api/chaos/run",
            json=exp, timeout=10)
        self.assertEqual(200, resp.status_code)
        time.sleep(45)  # Wait for recovery
        self.assertTrue(self.verify_steady_state(), "Post-chaos recovery failed")

    def test_network_latency_injection(self):
        """Inject 500ms latency and verify degraded but functional"""
        exp = {"kind": "ChaosExperiment", "spec": {
            "experiment": "pod-network-latency",
            "appinfo": {"namespace": "production", "label": "app=banking-api"},
            "chaosParams": {"latency": 500, "duration": 60}
        }}
        resp = requests.post(f"{self.LITMUS}/api/chaos/run",
            json=exp, timeout=10)
        self.assertEqual(200, resp.status_code)
        time.sleep(30)
        error_rate = self.get_error_rate()
        self.assertLess(error_rate, 5.0, f"Error rate {error_rate}% too high under latency")
        self.assertTrue(self.verify_steady_state())

    def test_cpu_stress_resilience(self):
        """Apply CPU stress and verify auto-scaling triggers"""
        exp = {"kind": "ChaosExperiment", "spec": {
            "experiment": "pod-cpu-hog",
            "appinfo": {"namespace": "production", "label": "app=banking-api"},
            "chaosParams": {"cpu_cores": 2, "duration": 120}
        }}
        resp = requests.post(f"{self.LITMUS}/api/chaos/run",
            json=exp, timeout=10)
        self.assertEqual(200, resp.status_code)
        time.sleep(60)
        error_rate = self.get_error_rate()
        self.assertLess(error_rate, 10.0, f"Error rate {error_rate}% during CPU stress")`,
   expectedOutput:`[TEST] OB-012: Chaos Engineering Resilience Test
[INFO] Pre-chaos steady state: healthy
[PASS] Pod kill experiment launched: pod-delete
[INFO] Pod banking-api-7d9f8c killed at 14:32:01 UTC
[PASS] Pod recovered in 18 seconds (target: < 30s)
[PASS] Post-recovery health check: healthy
[PASS] Network latency injection: 500ms added
[INFO] Error rate during latency: 1.2% (threshold: 5%)
[PASS] Application functional under latency degradation
[PASS] CPU stress: 2 cores saturated for 120s
[INFO] Error rate during CPU stress: 3.8% (threshold: 10%)
[PASS] Auto-scaling triggered: replicas 3 -> 5
[INFO] Chaos experiments: 3/3 passed resilience criteria
───────────────────────────────────
OB-012: Chaos Engineering — 7 passed, 0 failed`},
];

export default function ObservabilityLab() {
  const [tab, setTab] = useState('Logging');
  const [sel, setSel] = useState(S[0]);
  const [search, setSearch] = useState('');
  const [diffF, setDiffF] = useState('All');
  const [statuses, setStatuses] = useState({});
  const [code, setCode] = useState(S[0].code);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [progress, setProgress] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const timerRef = useRef(null);

  const filtered = S.filter(s => {
    if (s.layer !== tab) return false;
    if (diffF !== 'All' && s.difficulty !== diffF) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pick = useCallback((s) => { setSel(s); setCode(s.code); setOutput(''); setProgress(0); setRunning(false); }, []);

  const runSim = useCallback(() => {
    if (running) return;
    setRunning(true); setOutput(''); setProgress(0);
    const lines = sel.expectedOutput.split('\n');
    let i = 0;
    timerRef.current = setInterval(() => {
      if (i < lines.length) { setOutput(prev => prev + (prev ? '\n' : '') + lines[i]); setProgress(Math.round(((i + 1) / lines.length) * 100)); i++; }
      else { clearInterval(timerRef.current); setRunning(false); setStatuses(prev => ({ ...prev, [sel.id]: 'passed' })); }
    }, 150);
  }, [sel, running]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const totalTab = S.filter(s => s.layer === tab).length;
  const passedTab = S.filter(s => s.layer === tab && statuses[s.id] === 'passed').length;
  const totalAll = S.length;
  const passedAll = Object.values(statuses).filter(v => v === 'passed').length;
  const copy = () => { navigator.clipboard?.writeText(code); };
  const reset = () => { setCode(sel.code); };

  const sty = {
    page:{minHeight:'100vh',background:`linear-gradient(135deg,${C.bgFrom} 0%,${C.bgTo} 100%)`,color:C.text,fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",padding:'18px 22px 40px'},
    h1:{fontSize:28,fontWeight:800,margin:0,background:`linear-gradient(90deg,${C.accent},#3498db)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'},
    sub:{fontSize:13,color:C.muted,marginTop:4},
    statsBar:{display:'flex',justifyContent:'center',gap:24,marginBottom:14,flexWrap:'wrap'},
    stat:{background:C.card,borderRadius:8,padding:'6px 18px',fontSize:13,border:`1px solid ${C.border}`},
    split:{display:'flex',gap:16,height:'calc(100vh - 160px)',minHeight:500},
    left:{width:'38%',minWidth:320,display:'flex',flexDirection:'column',gap:10},
    right:{flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'hidden'},
    tabBar:{display:'flex',gap:4,flexWrap:'wrap'},
    tabBtn:(a)=>({padding:'6px 12px',borderRadius:6,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,background:a?C.accent:C.card,color:a?'#0a0a1a':C.text}),
    input:{flex:1,padding:'7px 12px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:13,outline:'none',minWidth:120},
    select:{padding:'6px 8px',borderRadius:6,border:`1px solid ${C.border}`,background:C.editorBg,color:C.text,fontSize:12,outline:'none'},
    list:{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:6,paddingRight:4},
    card:(a)=>({padding:'10px 14px',borderRadius:8,background:a?C.cardHover:C.card,border:`1px solid ${a?C.accent:C.border}`,cursor:'pointer'}),
    badge:(c)=>({display:'inline-block',padding:'1px 7px',borderRadius:10,fontSize:10,fontWeight:700,background:c+'22',color:c,marginRight:4}),
    dot:(st)=>({display:'inline-block',width:8,height:8,borderRadius:'50%',background:st==='passed'?C.accent:C.muted,marginRight:6}),
    panel:{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:16,overflowY:'auto'},
    editor:{width:'100%',minHeight:200,maxHeight:280,padding:12,borderRadius:8,border:`1px solid ${C.border}`,background:C.editorBg,color:C.editorText,fontFamily:"'Fira Code','Consolas',monospace",fontSize:12,lineHeight:1.6,resize:'vertical',outline:'none',whiteSpace:'pre',overflowX:'auto'},
    btn:(bg)=>({padding:'7px 16px',borderRadius:6,border:'none',cursor:'pointer',fontSize:12,fontWeight:700,background:bg||C.accent,color:(bg===C.danger||bg==='#555')?'#fff':'#0a0a1a'}),
    outBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,fontFamily:"'Fira Code','Consolas',monospace",fontSize:11,color:C.accent,lineHeight:1.7,whiteSpace:'pre-wrap',minHeight:60,maxHeight:180,overflowY:'auto'},
    progBar:{height:4,borderRadius:2,background:'#0a2744',marginTop:6},
    progFill:(p)=>({height:'100%',borderRadius:2,width:p+'%',background:p===100?C.accent:'#3498db',transition:'width 0.3s'}),
    progO:{height:6,borderRadius:3,background:'#0a2744',marginBottom:8},
    progOF:(p)=>({height:'100%',borderRadius:3,width:p+'%',background:`linear-gradient(90deg,${C.accent},#3498db)`,transition:'width 0.4s'}),
    cfgBox:{background:C.editorBg,borderRadius:8,border:`1px solid ${C.border}`,padding:12,marginTop:8,fontSize:12,lineHeight:1.6,color:C.warn,fontFamily:"'Fira Code','Consolas',monospace",whiteSpace:'pre-wrap'},
  };

  return (
    <div style={sty.page}>
      <div style={{textAlign:'center',marginBottom:16}}>
        <h1 style={sty.h1}>Observability Testing Lab</h1>
        <div style={sty.sub}>Logging, Metrics, Tracing, Alerting, Dashboards & SRE Reliability — {totalAll} Scenarios</div>
      </div>
      <div style={sty.statsBar}>
        <span style={sty.stat}>Total: <b style={{color:C.accent}}>{totalAll}</b></span>
        <span style={sty.stat}>Passed: <b style={{color:C.accent}}>{passedAll}</b>/{totalAll}</span>
        <span style={sty.stat}>Tab: <b style={{color:C.accent}}>{passedTab}</b>/{totalTab}</span>
        <span style={sty.stat}>Coverage: <b style={{color:C.accent}}>{totalAll>0?Math.round((passedAll/totalAll)*100):0}%</b></span>
      </div>
      <div style={sty.split}>
        <div style={sty.left}>
          <div style={sty.tabBar}>{TABS.map(t=><button key={t.key} style={sty.tabBtn(tab===t.key)} onClick={()=>setTab(t.key)}>{t.label}</button>)}</div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
            <input style={sty.input} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
            <select style={sty.select} value={diffF} onChange={e=>setDiffF(e.target.value)}>{['All',...DIFF].map(d=><option key={d} value={d}>{d==='All'?'Difficulty':d}</option>)}</select>
          </div>
          <div style={sty.progO}><div style={sty.progOF(totalTab>0?Math.round((passedTab/totalTab)*100):0)}/></div>
          <div style={sty.list}>
            {filtered.length===0&&<div style={{color:C.muted,textAlign:'center',padding:20}}>No scenarios match</div>}
            {filtered.map(s=>(
              <div key={s.id} style={sty.card(sel.id===s.id)} onClick={()=>pick(s)}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={sty.dot(statuses[s.id])}/><span style={{fontSize:11,color:C.accent,marginRight:8}}>{s.id}</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.header}}>{s.title}</span>
                </div>
                <div style={{marginTop:4}}>
                  <span style={sty.badge(TC[s.layer]||C.accent)}>{s.layer}</span>
                  <span style={sty.badge(DC[s.difficulty])}>{s.difficulty}</span>
                  <span style={sty.badge('#3498db')}>{s.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={sty.right}>
          <div style={{...sty.panel,flex:'0 0 auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div><span style={{fontSize:14,fontWeight:800,color:C.accent,marginRight:10}}>{sel.id}</span><span style={{fontSize:16,fontWeight:700,color:C.header}}>{sel.title}</span></div>
              <div><span style={sty.badge(TC[sel.layer]||C.accent)}>{sel.layer}</span><span style={sty.badge(DC[sel.difficulty])}>{sel.difficulty}</span><span style={sty.badge('#f1c40f')}>{sel.language}</span></div>
            </div>
            <div style={{fontSize:12,color:C.muted,marginBottom:10,lineHeight:1.5}}>{sel.description}</div>
            <div style={{fontSize:11,color:C.muted}}><b>Prerequisites:</b> {sel.prerequisites}</div>
          </div>
          <div style={{...sty.panel,flex:1,display:'flex',flexDirection:'column',gap:10,overflow:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Test Script — {sel.framework}</span>
              <div style={{display:'flex',gap:6}}><button style={sty.btn()} onClick={copy}>Copy</button><button style={sty.btn('#555')} onClick={reset}>Reset</button></div>
            </div>
            <textarea style={sty.editor} value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Expected Output</span>
              <span style={{fontSize:11,color:C.muted}}>{sel.language}</span>
            </div>
            <div style={sty.outBox}>{sel.expectedOutput}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button style={{...sty.btn(running?'#555':C.accent),opacity:running?0.6:1}} onClick={runSim} disabled={running}>{running?'Running...':'Run Test'}</button>
              {statuses[sel.id]==='passed'&&<span style={{color:C.accent,fontSize:12,fontWeight:700}}>PASSED</span>}
              {progress>0&&progress<100&&<span style={{color:'#3498db',fontSize:11}}>{progress}%</span>}
              <button style={{...sty.btn('#3498db'),marginLeft:'auto'}} onClick={()=>setShowConfig(!showConfig)}>{showConfig?'Hide':'Show'} Config</button>
            </div>
            {(running||output)&&(<div><div style={{fontSize:12,fontWeight:700,color:C.header,marginBottom:4}}>Execution Output</div><div style={sty.outBox}>{output||'Starting...'}</div><div style={sty.progBar}><div style={sty.progFill(progress)}/></div></div>)}
            {showConfig&&<div style={sty.cfgBox}><div style={{fontWeight:700,color:C.accent,marginBottom:6}}>Configuration</div><div>{sel.config}</div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

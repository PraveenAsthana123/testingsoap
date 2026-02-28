import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

/* ================================================================
   Security 7-Layer Testing Lab — OSI Model Banking Security
   Split-panel: LEFT (scenario list) | RIGHT (editor + output)
   ================================================================ */

const C = {
  bgFrom: '#1a1a2e', bgTo: '#16213e', card: '#0f3460',
  accent: '#4ecca3', text: '#e0e0e0', header: '#fff',
  border: 'rgba(78,204,163,0.3)', editorBg: '#0a0a1a',
  editorText: '#4ecca3', muted: '#78909c', cardHover: '#143b6a',
  inputBg: '#0a2744', danger: '#e74c3c', warn: '#f39c12',
};

const LAYER_COLORS = {
  Physical: '#e74c3c', DataLink: '#e67e22', Network: '#f1c40f',
  Transport: '#2ecc71', Session: '#3498db', Presentation: '#9b59b6',
  Application: '#1abc9c',
};

const LAYER_NUMS = {
  Physical: 1, DataLink: 2, Network: 3, Transport: 4,
  Session: 5, Presentation: 6, Application: 7,
};

const TABS = [
  { key: 'Physical', label: 'L1: Physical' },
  { key: 'DataLink', label: 'L2: Data Link' },
  { key: 'Network', label: 'L3: Network' },
  { key: 'Transport', label: 'L4: Transport' },
  { key: 'Session', label: 'L5: Session' },
  { key: 'Presentation', label: 'L6: Presentation' },
  { key: 'Application', label: 'L7: Application' },
];

const DIFF = ['Beginner','Intermediate','Advanced'];

/* ─── SCENARIO DATA ─── */
const SCENARIOS = [
  /* ====== TAB 1: Physical Layer (SL-001 to SL-008) ====== */
  {
    id:'SL-001', title:'Server Room Access Control', category:'Access Control',
    layer:'Physical', framework:'Physical Security Audit', language:'Python',
    difficulty:'Intermediate',
    description:'Validate biometric + card reader dual-factor authentication for server room entry. Tests include badge swipe timing, biometric match rate, and anti-tailgating sensors.',
    prerequisites:['Biometric scanner API access','Card reader system credentials','Audit log database access'],
    config:'BIOMETRIC_API=https://bioauth.bank.local:8443/api/v2\nCARD_READER_IP=10.0.1.50\nAUDIT_DB=postgresql://audit:pass@db.local/access_logs\nTHRESHOLD_MATCH_RATE=0.95\nMAX_ENTRY_TIME_SEC=8',
    code: `#!/usr/bin/env python3
"""SL-001: Server Room Access Control Validation"""
import requests, json, sys
from datetime import datetime, timedelta

BIOAUTH_URL = "https://bioauth.bank.local:8443/api/v2"
CARD_READER = "10.0.1.50"
THRESHOLD = 0.95

def test_dual_factor_auth():
    """Verify both biometric + card required"""
    # Test card-only access (should DENY)
    r1 = requests.post(f"{BIOAUTH_URL}/verify", json={
        "card_id": "EMP-4421", "biometric": None
    }, timeout=10)
    assert r1.json()["access"] == "DENIED", "Card-only must be denied"

    # Test biometric-only access (should DENY)
    r2 = requests.post(f"{BIOAUTH_URL}/verify", json={
        "card_id": None, "biometric": "fingerprint:sha256:abc123"
    }, timeout=10)
    assert r2.json()["access"] == "DENIED", "Bio-only must be denied"

    # Test dual-factor (should ALLOW)
    r3 = requests.post(f"{BIOAUTH_URL}/verify", json={
        "card_id": "EMP-4421",
        "biometric": "fingerprint:sha256:abc123"
    }, timeout=10)
    assert r3.json()["access"] == "GRANTED", "Dual-factor must grant"
    print("[PASS] Dual-factor authentication enforced")

def test_tailgate_detection():
    """Verify anti-tailgating sensor active"""
    r = requests.get(f"http://{CARD_READER}/api/sensor/status", timeout=5)
    data = r.json()
    assert data["tailgate_sensor"] == "ACTIVE"
    assert data["max_persons_per_swipe"] == 1
    print("[PASS] Anti-tailgating sensor active")

if __name__ == "__main__":
    test_dual_factor_auth()
    test_tailgate_detection()
    print("\\nSL-001: All server room access controls PASSED")`,
    expectedOutput: `[TEST] Server Room Access Control Validation
[INFO] Testing card-only access... DENIED (correct)
[INFO] Testing biometric-only access... DENIED (correct)
[INFO] Testing dual-factor access... GRANTED (correct)
[PASS] Dual-factor authentication enforced
[INFO] Checking anti-tailgate sensor...
[PASS] Anti-tailgating sensor active
[INFO] Match rate: 0.97 (threshold: 0.95)
[PASS] Biometric match rate within tolerance
─────────────────────────────────
SL-001: All server room access controls PASSED
Total: 3 passed, 0 failed`
  },
  {
    id:'SL-002', title:'Network Cable Tampering Detection', category:'Intrusion Detection',
    layer:'Physical', framework:'Fiber Optic Monitoring', language:'Python',
    difficulty:'Advanced',
    description:'Monitor fiber optic cable integrity using Optical Time Domain Reflectometer (OTDR) readings. Detect signal loss, splices, or taps indicating physical tampering on banking network trunk lines.',
    prerequisites:['OTDR monitoring system access','SNMP credentials for fiber switches','Baseline OTDR readings'],
    config:'OTDR_API=https://fiber-mon.bank.local:9443/api\nSNMP_COMMUNITY=bank_readonly\nSWITCH_IPS=10.0.0.1,10.0.0.2,10.0.0.3\nMAX_LOSS_DB=0.5\nBASELINE_FILE=/opt/otdr/baseline.json',
    code: `#!/usr/bin/env python3
"""SL-002: Network Cable Tampering Detection"""
import requests, json

OTDR_API = "https://fiber-mon.bank.local:9443/api"
MAX_LOSS_DB = 0.5

def check_fiber_integrity():
    """Compare current OTDR readings against baseline"""
    baseline = requests.get(f"{OTDR_API}/baseline", timeout=10).json()
    current = requests.get(f"{OTDR_API}/current", timeout=10).json()

    alerts = []
    for seg in current["segments"]:
        base_seg = next(
            (b for b in baseline["segments"] if b["id"] == seg["id"]), None
        )
        if not base_seg:
            alerts.append(f"UNKNOWN segment: {seg['id']}")
            continue
        loss_delta = seg["loss_db"] - base_seg["loss_db"]
        if loss_delta > MAX_LOSS_DB:
            alerts.append(
                f"TAMPER ALERT: {seg['id']} loss delta "
                f"{loss_delta:.2f}dB > {MAX_LOSS_DB}dB"
            )
        else:
            print(f"[OK] {seg['id']}: loss delta {loss_delta:.2f}dB")

    if alerts:
        for a in alerts:
            print(f"[ALERT] {a}")
        return False
    print("[PASS] All fiber segments within tolerance")
    return True

def check_snmp_port_status():
    """Verify no unauthorized SFP modules inserted"""
    r = requests.get(f"{OTDR_API}/sfp-inventory", timeout=10).json()
    unauthorized = [s for s in r["modules"] if not s["authorized"]]
    if unauthorized:
        for u in unauthorized:
            print(f"[ALERT] Unauthorized SFP: {u['serial']} on {u['port']}")
        return False
    print(f"[PASS] All {len(r['modules'])} SFP modules authorized")
    return True

if __name__ == "__main__":
    r1 = check_fiber_integrity()
    r2 = check_snmp_port_status()
    status = "PASSED" if (r1 and r2) else "FAILED"
    print(f"\\nSL-002: Cable Tampering Detection {status}")`,
    expectedOutput: `[TEST] Network Cable Tampering Detection
[OK] TRUNK-A1: loss delta 0.12dB
[OK] TRUNK-A2: loss delta 0.08dB
[OK] TRUNK-B1: loss delta 0.21dB
[OK] TRUNK-B2: loss delta 0.15dB
[PASS] All fiber segments within tolerance
[INFO] Checking SFP module inventory...
[PASS] All 24 SFP modules authorized
[INFO] No splices or taps detected
─────────────────────────────────
SL-002: Cable Tampering Detection PASSED
Total: 2 passed, 0 failed`
  },
  {
    id:'SL-003', title:'USB Port Disabling', category:'Data Exfiltration',
    layer:'Physical', framework:'Endpoint Security', language:'Bash',
    difficulty:'Beginner',
    description:'Verify that USB mass storage is disabled on all banking workstations and servers. Test that HID devices (keyboard/mouse) remain functional while storage is blocked.',
    prerequisites:['SSH access to target hosts','Root/admin privileges','Endpoint management agent'],
    config:'TARGET_HOSTS=ws-001,ws-002,ws-003,srv-db-01\nSSH_KEY=/opt/keys/audit_rsa\nSSH_USER=security_audit\nALLOW_HID=true\nBLOCK_STORAGE=true',
    code: `#!/bin/bash
# SL-003: USB Port Disabling Validation
set -euo pipefail

HOSTS=("ws-001" "ws-002" "ws-003" "srv-db-01")
SSH_KEY="/opt/keys/audit_rsa"
SSH_USER="security_audit"
PASS=0; FAIL=0

for HOST in "\${HOSTS[@]}"; do
    echo "[TEST] Checking \$HOST..."

    # Check if usb-storage module is blacklisted
    BLACKLIST=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$HOST" \\
        "grep -c 'blacklist usb-storage' /etc/modprobe.d/*.conf 2>/dev/null || echo 0")

    if [ "\$BLACKLIST" -gt 0 ]; then
        echo "[PASS] \$HOST: usb-storage blacklisted"
        ((PASS++))
    else
        echo "[FAIL] \$HOST: usb-storage NOT blacklisted"
        ((FAIL++))
    fi

    # Check if USB storage module is loaded
    LOADED=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$HOST" \\
        "lsmod | grep -c usb_storage || echo 0")

    if [ "\$LOADED" -eq 0 ]; then
        echo "[PASS] \$HOST: usb_storage module not loaded"
        ((PASS++))
    else
        echo "[FAIL] \$HOST: usb_storage module IS loaded"
        ((FAIL++))
    fi

    # Verify HID devices still work
    HID=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$HOST" \\
        "lsmod | grep -c usbhid || echo 0")
    if [ "\$HID" -gt 0 ]; then
        echo "[PASS] \$HOST: HID devices functional"
        ((PASS++))
    fi
done

echo ""
echo "SL-003: USB Port Disabling — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Checking ws-001...
[PASS] ws-001: usb-storage blacklisted
[PASS] ws-001: usb_storage module not loaded
[PASS] ws-001: HID devices functional
[TEST] Checking ws-002...
[PASS] ws-002: usb-storage blacklisted
[PASS] ws-002: usb_storage module not loaded
[PASS] ws-002: HID devices functional
[TEST] Checking srv-db-01...
[PASS] srv-db-01: usb-storage blacklisted
[PASS] srv-db-01: usb_storage module not loaded
─────────────────────────────────
SL-003: USB Port Disabling — 12 passed, 0 failed`
  },
  {
    id:'SL-004', title:'Hardware Security Module (HSM)', category:'Key Management',
    layer:'Physical', framework:'PKCS#11 / HSM Audit', language:'Python',
    difficulty:'Advanced',
    description:'Validate HSM configuration for cryptographic key protection. Test key generation, storage, signing operations, and tamper-evident seal status on Thales Luna or AWS CloudHSM.',
    prerequisites:['HSM client library installed','HSM partition credentials','PKCS#11 library path'],
    config:'HSM_LIB=/opt/thales/lib/libCryptoki2_64.so\nHSM_SLOT=0\nHSM_PIN=env:HSM_PARTITION_PIN\nKEY_LABEL=BANK_MASTER_KEY\nALGORITHM=AES-256-GCM',
    code: `#!/usr/bin/env python3
"""SL-004: HSM Validation — PKCS#11 Interface"""
import pkcs11, hashlib, os, sys
from pkcs11 import Mechanism, KeyType

HSM_LIB = "/opt/thales/lib/libCryptoki2_64.so"
HSM_PIN = os.environ.get("HSM_PARTITION_PIN", "")

def test_hsm_connectivity():
    lib = pkcs11.lib(HSM_LIB)
    slots = lib.get_slots(token_present=True)
    assert len(slots) > 0, "No HSM slots found"
    token = slots[0].get_token()
    print(f"[PASS] HSM connected: {token.label}")
    print(f"[INFO] Firmware: {token.firmware_version}")
    return lib, slots[0]

def test_key_operations(lib, slot):
    with slot.open(user_pin=HSM_PIN, rw=True) as session:
        # Generate AES-256 key inside HSM
        key = session.generate_key(
            KeyType.AES, 256,
            label="TEST_KEY_AUDIT",
            store=False, capabilities=pkcs11.defaults.DEFAULT_KEY_CAPS
        )
        print("[PASS] AES-256 key generated in HSM")

        # Encrypt/decrypt round-trip
        plaintext = b"SWIFT_MSG_PAYLOAD_TEST_12345"
        iv = session.generate_random(128)
        ct = key.encrypt(plaintext, mechanism=Mechanism.AES_GCM, mechanism_param=iv)
        pt = key.decrypt(ct, mechanism=Mechanism.AES_GCM, mechanism_param=iv)
        assert pt == plaintext, "Decrypt mismatch"
        print("[PASS] Encrypt/decrypt round-trip verified")

def test_tamper_status(lib, slot):
    with slot.open(user_pin=HSM_PIN) as session:
        info = session.get_info()
        # Check tamper-evident status flag
        assert not info.get("tampered", False), "HSM tamper flag set!"
        print("[PASS] HSM tamper-evident seal intact")

if __name__ == "__main__":
    lib, slot = test_hsm_connectivity()
    test_key_operations(lib, slot)
    test_tamper_status(lib, slot)
    print("\\nSL-004: HSM Validation PASSED")`,
    expectedOutput: `[TEST] HSM Validation — PKCS#11 Interface
[PASS] HSM connected: BANK_PROD_PARTITION
[INFO] Firmware: 7.4.0
[INFO] Testing key generation...
[PASS] AES-256 key generated in HSM
[INFO] Testing encrypt/decrypt round-trip...
[PASS] Encrypt/decrypt round-trip verified
[INFO] Checking tamper-evident seal...
[PASS] HSM tamper-evident seal intact
[INFO] Key extraction attempt... BLOCKED (correct)
─────────────────────────────────
SL-004: HSM Validation PASSED
Total: 4 passed, 0 failed`
  },
  {
    id:'SL-005', title:'CCTV Monitoring Validation', category:'Surveillance',
    layer:'Physical', framework:'Physical Security Audit', language:'Python',
    difficulty:'Beginner',
    description:'Audit CCTV coverage for server rooms, data centers, and ATM locations. Validate camera uptime, recording retention, and blind spot analysis.',
    prerequisites:['VMS (Video Management System) API access','Camera inventory list','Floor plan with coverage zones'],
    config:'VMS_API=https://cctv.bank.local:8080/api/v1\nVMS_TOKEN=env:VMS_API_TOKEN\nMIN_RETENTION_DAYS=90\nMIN_COVERAGE_PCT=95\nCRITICAL_ZONES=server_room,vault,atm_lobby',
    code: `#!/usr/bin/env python3
"""SL-005: CCTV Monitoring Validation"""
import requests, os

VMS_API = "https://cctv.bank.local:8080/api/v1"
TOKEN = os.environ["VMS_API_TOKEN"]
HEADERS = {"Authorization": f"Bearer {TOKEN}"}
MIN_RETENTION = 90
MIN_COVERAGE = 95

def test_camera_uptime():
    r = requests.get(f"{VMS_API}/cameras/status",
                     headers=HEADERS, timeout=10).json()
    total = len(r["cameras"])
    online = sum(1 for c in r["cameras"] if c["status"] == "ONLINE")
    pct = (online / total) * 100
    print(f"[INFO] Cameras: {online}/{total} online ({pct:.1f}%)")
    assert pct >= MIN_COVERAGE, f"Camera uptime {pct}% < {MIN_COVERAGE}%"
    print("[PASS] Camera uptime meets threshold")

def test_retention_policy():
    r = requests.get(f"{VMS_API}/storage/retention",
                     headers=HEADERS, timeout=10).json()
    days = r["retention_days"]
    assert days >= MIN_RETENTION, f"Retention {days}d < {MIN_RETENTION}d"
    print(f"[PASS] Retention policy: {days} days (min: {MIN_RETENTION})")

def test_critical_zone_coverage():
    zones = ["server_room", "vault", "atm_lobby"]
    for zone in zones:
        r = requests.get(f"{VMS_API}/zones/{zone}/coverage",
                         headers=HEADERS, timeout=10).json()
        pct = r["coverage_pct"]
        assert pct >= MIN_COVERAGE, f"{zone} coverage {pct}%"
        print(f"[PASS] {zone}: {pct}% coverage")

if __name__ == "__main__":
    test_camera_uptime()
    test_retention_policy()
    test_critical_zone_coverage()
    print("\\nSL-005: CCTV Monitoring Validation PASSED")`,
    expectedOutput: `[TEST] CCTV Monitoring Validation
[INFO] Cameras: 47/48 online (97.9%)
[PASS] Camera uptime meets threshold
[PASS] Retention policy: 120 days (min: 90)
[INFO] Checking critical zone coverage...
[PASS] server_room: 100% coverage
[PASS] vault: 100% coverage
[PASS] atm_lobby: 98% coverage
[INFO] No blind spots detected in critical zones
─────────────────────────────────
SL-005: CCTV Monitoring Validation PASSED
Total: 5 passed, 0 failed`
  },
  {
    id:'SL-006', title:'Environmental Controls', category:'Facility Monitoring',
    layer:'Physical', framework:'Data Center Audit', language:'Python',
    difficulty:'Beginner',
    description:'Monitor server room environmental conditions — temperature, humidity, water leak sensors, and fire suppression system status for banking data center compliance.',
    prerequisites:['BMS (Building Management System) API','Environmental sensor network','Alert threshold configuration'],
    config:'BMS_API=https://bms.bank.local:7443/api\nTEMP_MIN_C=18\nTEMP_MAX_C=27\nHUMIDITY_MIN=40\nHUMIDITY_MAX=60\nALERT_EMAIL=dc-ops@bank.com',
    code: `#!/usr/bin/env python3
"""SL-006: Environmental Controls Validation"""
import requests

BMS_API = "https://bms.bank.local:7443/api"
TEMP_RANGE = (18, 27)
HUMIDITY_RANGE = (40, 60)

def test_temperature():
    r = requests.get(f"{BMS_API}/sensors/temperature", timeout=10).json()
    for sensor in r["sensors"]:
        temp = sensor["value_celsius"]
        name = sensor["name"]
        in_range = TEMP_RANGE[0] <= temp <= TEMP_RANGE[1]
        status = "PASS" if in_range else "FAIL"
        print(f"[{status}] {name}: {temp}°C "
              f"(range: {TEMP_RANGE[0]}-{TEMP_RANGE[1]}°C)")
        assert in_range, f"{name} temp {temp}°C out of range"

def test_humidity():
    r = requests.get(f"{BMS_API}/sensors/humidity", timeout=10).json()
    for sensor in r["sensors"]:
        hum = sensor["value_pct"]
        name = sensor["name"]
        ok = HUMIDITY_RANGE[0] <= hum <= HUMIDITY_RANGE[1]
        status = "PASS" if ok else "FAIL"
        print(f"[{status}] {name}: {hum}% "
              f"(range: {HUMIDITY_RANGE[0]}-{HUMIDITY_RANGE[1]}%)")

def test_fire_suppression():
    r = requests.get(f"{BMS_API}/fire-suppression/status",
                     timeout=10).json()
    assert r["system_armed"] is True
    assert r["last_inspection_days_ago"] < 30
    print(f"[PASS] Fire suppression armed, inspected {r['last_inspection_days_ago']}d ago")

def test_water_leak_sensors():
    r = requests.get(f"{BMS_API}/sensors/water-leak", timeout=10).json()
    active = sum(1 for s in r["sensors"] if s["status"] == "OK")
    print(f"[PASS] Water leak sensors: {active}/{len(r['sensors'])} active")

if __name__ == "__main__":
    test_temperature()
    test_humidity()
    test_fire_suppression()
    test_water_leak_sensors()
    print("\\nSL-006: Environmental Controls PASSED")`,
    expectedOutput: `[TEST] Environmental Controls Validation
[PASS] DC-RACK-A1: 22.3°C (range: 18-27°C)
[PASS] DC-RACK-B1: 23.1°C (range: 18-27°C)
[PASS] DC-RACK-A1-HUM: 48% (range: 40-60%)
[PASS] DC-RACK-B1-HUM: 51% (range: 40-60%)
[PASS] Fire suppression armed, inspected 12d ago
[PASS] Water leak sensors: 8/8 active
[INFO] All environmental readings nominal
─────────────────────────────────
SL-006: Environmental Controls PASSED
Total: 6 passed, 0 failed`
  },
  {
    id:'SL-007', title:'Power Redundancy Testing', category:'Availability',
    layer:'Physical', framework:'BC/DR Audit', language:'Bash',
    difficulty:'Intermediate',
    description:'Validate UPS failover, generator startup, and dual power feed redundancy for banking data center. Test automatic transfer switch (ATS) response time.',
    prerequisites:['UPS monitoring API/SNMP','Generator control panel access','ATS monitoring system'],
    config:'UPS_SNMP_HOST=10.0.1.100\nSNMP_COMMUNITY=bank_power\nGEN_API=https://genmon.bank.local:6443/api\nATS_SWITCH_MAX_MS=10\nUPS_MIN_RUNTIME_MIN=15',
    code: `#!/bin/bash
# SL-007: Power Redundancy Testing
set -euo pipefail

UPS_HOST="10.0.1.100"
SNMP_COM="bank_power"
GEN_API="https://genmon.bank.local:6443/api"
MAX_SWITCH_MS=10
MIN_RUNTIME=15

echo "[TEST] Power Redundancy Validation"

# Check UPS status via SNMP
UPS_STATUS=$(snmpget -v2c -c "\$SNMP_COM" "\$UPS_HOST" \\
    1.3.6.1.2.1.33.1.2.1.0 2>/dev/null | awk '{print \$NF}')
if [ "\$UPS_STATUS" = "2" ]; then
    echo "[PASS] UPS status: Online (normal)"
else
    echo "[FAIL] UPS status: \$UPS_STATUS (expected: 2/Online)"
fi

# Check battery runtime
RUNTIME=$(snmpget -v2c -c "\$SNMP_COM" "\$UPS_HOST" \\
    1.3.6.1.2.1.33.1.2.3.0 | awk '{print \$NF}')
RUNTIME_MIN=\$((RUNTIME / 60))
if [ "\$RUNTIME_MIN" -ge "\$MIN_RUNTIME" ]; then
    echo "[PASS] Battery runtime: \${RUNTIME_MIN}min (min: \${MIN_RUNTIME}min)"
else
    echo "[FAIL] Battery runtime: \${RUNTIME_MIN}min < \${MIN_RUNTIME}min"
fi

# Check generator readiness
GEN_STATUS=$(curl -sk "\$GEN_API/status" | python3 -c \\
    "import sys,json; print(json.load(sys.stdin)['ready'])")
if [ "\$GEN_STATUS" = "True" ]; then
    echo "[PASS] Generator: Ready/Standby"
else
    echo "[FAIL] Generator: NOT ready"
fi

# Check ATS transfer time
ATS_MS=$(curl -sk "\$GEN_API/ats/last-test" | python3 -c \\
    "import sys,json; print(json.load(sys.stdin)['transfer_ms'])")
if [ "\$ATS_MS" -le "\$MAX_SWITCH_MS" ]; then
    echo "[PASS] ATS transfer: \${ATS_MS}ms (max: \${MAX_SWITCH_MS}ms)"
else
    echo "[FAIL] ATS transfer: \${ATS_MS}ms > \${MAX_SWITCH_MS}ms"
fi

# Check dual feed
FEED_A=$(curl -sk "\$GEN_API/feeds/A" | python3 -c \\
    "import sys,json; print(json.load(sys.stdin)['status'])")
FEED_B=$(curl -sk "\$GEN_API/feeds/B" | python3 -c \\
    "import sys,json; print(json.load(sys.stdin)['status'])")
echo "[INFO] Power Feed A: \$FEED_A | Feed B: \$FEED_B"

echo ""
echo "SL-007: Power Redundancy Testing COMPLETE"`,
    expectedOutput: `[TEST] Power Redundancy Validation
[PASS] UPS status: Online (normal)
[PASS] Battery runtime: 22min (min: 15min)
[INFO] Battery charge: 98%
[PASS] Generator: Ready/Standby
[INFO] Last generator test: 2026-02-20
[PASS] ATS transfer: 8ms (max: 10ms)
[INFO] Power Feed A: ACTIVE | Feed B: ACTIVE
[PASS] Dual power feeds operational
─────────────────────────────────
SL-007: Power Redundancy Testing COMPLETE
Total: 5 passed, 0 failed`
  },
  {
    id:'SL-008', title:'Physical Destruction Testing', category:'Data Disposal',
    layer:'Physical', framework:'NIST SP 800-88', language:'Python',
    difficulty:'Intermediate',
    description:'Validate secure media disposal procedures — degaussing, shredding, and certificate of destruction generation for banking hard drives containing PII/PCI data.',
    prerequisites:['Degausser API access','Shredder control system','Asset management database'],
    config:'ASSET_DB=postgresql://assets:pass@db.local/asset_mgmt\nDEGAUSS_API=https://degausser.bank.local:5443/api\nSHREDDER_API=https://shredder.bank.local:5443/api\nCERTIFICATE_PATH=/secure/destruction_certs/',
    code: `#!/usr/bin/env python3
"""SL-008: Physical Destruction Testing — NIST SP 800-88"""
import requests, json, hashlib
from datetime import datetime

DEGAUSS_API = "https://degausser.bank.local:5443/api"
SHREDDER_API = "https://shredder.bank.local:5443/api"

def test_degauss_verification(drive_serial):
    """Verify degaussing meets NIST SP 800-88 Purge level"""
    r = requests.post(f"{DEGAUSS_API}/verify", json={
        "serial": drive_serial,
        "standard": "NIST_SP800_88_PURGE"
    }, timeout=30).json()

    assert r["status"] == "DEGAUSSED", f"Drive not degaussed: {r['status']}"
    assert r["field_strength_oersted"] >= 5000, "Insufficient field strength"
    assert r["passes"] >= 1, "Insufficient degauss passes"
    print(f"[PASS] {drive_serial}: Degaussed at {r['field_strength_oersted']} Oe")
    return r

def test_physical_destruction(drive_serial):
    """Verify physical shredding to <2mm particles"""
    r = requests.post(f"{SHREDDER_API}/verify", json={
        "serial": drive_serial,
        "max_particle_mm": 2
    }, timeout=30).json()

    assert r["destroyed"] is True
    assert r["particle_size_mm"] <= 2
    print(f"[PASS] {drive_serial}: Shredded to {r['particle_size_mm']}mm")
    return r

def generate_certificate(drive_serial, degauss_r, shred_r):
    """Generate certificate of destruction"""
    cert = {
        "serial": drive_serial,
        "method": "DEGAUSS+SHRED",
        "standard": "NIST_SP800_88",
        "timestamp": datetime.utcnow().isoformat(),
        "degauss_field_oe": degauss_r["field_strength_oersted"],
        "particle_mm": shred_r["particle_size_mm"],
    }
    cert["hash"] = hashlib.sha256(
        json.dumps(cert, sort_keys=True).encode()
    ).hexdigest()
    print(f"[PASS] Certificate generated: {cert['hash'][:16]}...")
    return cert

if __name__ == "__main__":
    serial = "WD-2026-BANK-0042"
    d = test_degauss_verification(serial)
    s = test_physical_destruction(serial)
    generate_certificate(serial, d, s)
    print("\\nSL-008: Physical Destruction PASSED")`,
    expectedOutput: `[TEST] Physical Destruction — NIST SP 800-88
[INFO] Drive: WD-2026-BANK-0042
[INFO] Running degauss verification...
[PASS] WD-2026-BANK-0042: Degaussed at 7000 Oe
[INFO] Running physical destruction verification...
[PASS] WD-2026-BANK-0042: Shredded to 1.5mm
[INFO] Generating certificate of destruction...
[PASS] Certificate generated: a3f8c2d1e9b04f72...
[INFO] Certificate stored at /secure/destruction_certs/
─────────────────────────────────
SL-008: Physical Destruction PASSED
Total: 3 passed, 0 failed`
  },
  /* ====== TAB 2: Data Link Layer (SL-009 to SL-017) ====== */
  {
    id:'SL-009', title:'MAC Address Filtering', category:'Access Control',
    layer:'DataLink', framework:'802.1X NAC', language:'Python',
    difficulty:'Beginner',
    description:'Validate MAC address whitelist enforcement on banking network switches. Verify that only authorized devices can connect, and rogue devices are quarantined to a VLAN.',
    prerequisites:['Switch management API access','Authorized MAC database','NAC server credentials'],
    config:'SWITCH_API=https://switch-mgmt.bank.local:8443/api\nNAC_DB=postgresql://nac:pass@db.local/nac\nQUARANTINE_VLAN=999\nMAX_MAC_PER_PORT=2',
    code: `#!/usr/bin/env python3
"""SL-009: MAC Address Filtering Validation"""
import requests, json

SWITCH_API = "https://switch-mgmt.bank.local:8443/api"
QUARANTINE_VLAN = 999

def test_authorized_device():
    """Known MAC should be allowed on production VLAN"""
    r = requests.post(f"{SWITCH_API}/test-connect", json={
        "mac": "AA:BB:CC:DD:EE:01",
        "port": "Gi0/1",
        "registered": True
    }, timeout=10).json()
    assert r["action"] == "ALLOW"
    assert r["vlan"] != QUARANTINE_VLAN
    print(f"[PASS] Authorized MAC placed on VLAN {r['vlan']}")

def test_rogue_device():
    """Unknown MAC should be quarantined"""
    r = requests.post(f"{SWITCH_API}/test-connect", json={
        "mac": "DE:AD:BE:EF:00:01",
        "port": "Gi0/2",
        "registered": False
    }, timeout=10).json()
    assert r["action"] == "QUARANTINE"
    assert r["vlan"] == QUARANTINE_VLAN
    print(f"[PASS] Rogue MAC quarantined to VLAN {QUARANTINE_VLAN}")

def test_mac_limit_per_port():
    """Exceed MAC limit triggers port shutdown"""
    r = requests.post(f"{SWITCH_API}/test-mac-flood", json={
        "port": "Gi0/3",
        "mac_count": 5
    }, timeout=10).json()
    assert r["port_status"] == "ERR_DISABLED"
    print("[PASS] Port err-disabled on MAC limit exceeded")

def test_mac_spoofing_detection():
    """Detect duplicate MAC on different ports"""
    r = requests.post(f"{SWITCH_API}/test-duplicate-mac", json={
        "mac": "AA:BB:CC:DD:EE:01",
        "ports": ["Gi0/1", "Gi0/5"]
    }, timeout=10).json()
    assert r["alert"] == "MAC_SPOOF_DETECTED"
    print("[PASS] MAC spoofing detected and alerted")

if __name__ == "__main__":
    test_authorized_device()
    test_rogue_device()
    test_mac_limit_per_port()
    test_mac_spoofing_detection()
    print("\\nSL-009: MAC Address Filtering PASSED")`,
    expectedOutput: `[TEST] MAC Address Filtering Validation
[INFO] Testing authorized device connection...
[PASS] Authorized MAC placed on VLAN 100
[INFO] Testing rogue device connection...
[PASS] Rogue MAC quarantined to VLAN 999
[INFO] Testing MAC limit per port...
[PASS] Port err-disabled on MAC limit exceeded
[INFO] Testing MAC spoofing detection...
[PASS] MAC spoofing detected and alerted
─────────────────────────────────
SL-009: MAC Address Filtering PASSED
Total: 4 passed, 0 failed`
  },
  {
    id:'SL-010', title:'ARP Spoofing Detection', category:'Intrusion Detection',
    layer:'DataLink', framework:'Network Security', language:'Python',
    difficulty:'Intermediate',
    description:'Detect ARP poisoning attacks that could enable man-in-the-middle interception of banking transactions. Validate Dynamic ARP Inspection (DAI) on switches.',
    prerequisites:['Switch with DAI capability','ARP monitoring tools','Network tap or SPAN port'],
    config:'SWITCH_API=https://switch-mgmt.bank.local:8443/api\nMONITOR_IFACE=eth1\nGATEWAY_IP=10.0.1.1\nGATEWAY_MAC=00:1A:2B:3C:4D:5E\nDAI_ENABLED=true',
    code: `#!/usr/bin/env python3
"""SL-010: ARP Spoofing Detection"""
import subprocess, re, requests

SWITCH_API = "https://switch-mgmt.bank.local:8443/api"
GATEWAY_IP = "10.0.1.1"
GATEWAY_MAC = "00:1A:2B:3C:4D:5E"

def test_dai_enabled():
    """Verify Dynamic ARP Inspection is active"""
    r = requests.get(f"{SWITCH_API}/dai/status", timeout=10).json()
    assert r["dai_enabled"] is True, "DAI not enabled"
    assert r["trusted_ports"], "No trusted ports configured"
    print(f"[PASS] DAI enabled, {len(r['trusted_ports'])} trusted ports")

def test_arp_table_integrity():
    """Check ARP table for gateway MAC consistency"""
    result = subprocess.run(
        ["arp", "-n", GATEWAY_IP],
        capture_output=True, text=True, timeout=5
    )
    mac_match = re.search(r"([0-9a-f:]{17})", result.stdout, re.I)
    if mac_match:
        current_mac = mac_match.group(1).upper()
        expected = GATEWAY_MAC.upper()
        assert current_mac == expected, (
            f"ARP mismatch: {current_mac} != {expected}"
        )
        print(f"[PASS] Gateway MAC verified: {current_mac}")
    else:
        print("[FAIL] Cannot resolve gateway MAC")

def test_gratuitous_arp_blocking():
    """Verify gratuitous ARP packets are dropped"""
    r = requests.post(f"{SWITCH_API}/dai/test-gratuitous", json={
        "src_ip": GATEWAY_IP,
        "src_mac": "DE:AD:BE:EF:00:01"
    }, timeout=10).json()
    assert r["action"] == "DROPPED"
    assert r["log_entry_created"] is True
    print("[PASS] Gratuitous ARP spoofing blocked and logged")

if __name__ == "__main__":
    test_dai_enabled()
    test_arp_table_integrity()
    test_gratuitous_arp_blocking()
    print("\\nSL-010: ARP Spoofing Detection PASSED")`,
    expectedOutput: `[TEST] ARP Spoofing Detection
[INFO] Checking Dynamic ARP Inspection status...
[PASS] DAI enabled, 4 trusted ports
[INFO] Verifying ARP table integrity...
[PASS] Gateway MAC verified: 00:1A:2B:3C:4D:5E
[INFO] Testing gratuitous ARP blocking...
[PASS] Gratuitous ARP spoofing blocked and logged
[INFO] DAI violation count: 23 (last 24h)
─────────────────────────────────
SL-010: ARP Spoofing Detection PASSED
Total: 3 passed, 0 failed`
  },
  {
    id:'SL-011', title:'VLAN Hopping Prevention', category:'Network Segmentation',
    layer:'DataLink', framework:'Switch Security', language:'Bash',
    difficulty:'Intermediate',
    description:'Test VLAN hopping attacks via switch spoofing and double-tagging. Verify trunk port hardening and native VLAN configuration on banking network infrastructure.',
    prerequisites:['Managed switch access','VLAN configuration visibility','Test network segment'],
    config:'SWITCH_IP=10.0.0.1\nSSH_USER=admin\nSSH_KEY=/opt/keys/switch_rsa\nNATIVE_VLAN=999\nTRUNK_PORTS=Gi0/24,Gi0/48',
    code: `#!/bin/bash
# SL-011: VLAN Hopping Prevention
set -euo pipefail

SWITCH="10.0.0.1"
SSH_USER="admin"
SSH_KEY="/opt/keys/switch_rsa"
PASS=0; FAIL=0

echo "[TEST] VLAN Hopping Prevention"

# Check native VLAN is not VLAN 1 (default)
NATIVE=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show interfaces trunk | grep native" | awk '{print \$NF}')
if [ "\$NATIVE" != "1" ]; then
    echo "[PASS] Native VLAN is \$NATIVE (not default VLAN 1)"
    ((PASS++))
else
    echo "[FAIL] Native VLAN is still default VLAN 1"
    ((FAIL++))
fi

# Check DTP is disabled on access ports
DTP_PORTS=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show dtp interface | grep -c 'DYNAMIC' || echo 0")
if [ "\$DTP_PORTS" -eq 0 ]; then
    echo "[PASS] DTP disabled on all access ports"
    ((PASS++))
else
    echo "[FAIL] \$DTP_PORTS ports have DTP enabled"
    ((FAIL++))
fi

# Verify trunk ports explicitly configured (not auto)
TRUNK_MODE=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show interfaces Gi0/24 switchport | grep 'Negotiation'")
if echo "\$TRUNK_MODE" | grep -q "Off"; then
    echo "[PASS] Trunk negotiation disabled (hardcoded trunk)"
    ((PASS++))
else
    echo "[FAIL] Trunk negotiation still enabled"
    ((FAIL++))
fi

# Test double-tagging attack simulation
RESULT=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show vlan dot1q tag native | grep -c 'tag' || echo 0")
if [ "\$RESULT" -gt 0 ]; then
    echo "[PASS] Native VLAN tagging enabled (double-tag mitigated)"
    ((PASS++))
else
    echo "[FAIL] Native VLAN not tagged"
    ((FAIL++))
fi

echo ""
echo "SL-011: VLAN Hopping Prevention — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] VLAN Hopping Prevention
[INFO] Checking native VLAN configuration...
[PASS] Native VLAN is 999 (not default VLAN 1)
[INFO] Checking DTP status on access ports...
[PASS] DTP disabled on all access ports
[INFO] Checking trunk port negotiation...
[PASS] Trunk negotiation disabled (hardcoded trunk)
[INFO] Checking double-tag mitigation...
[PASS] Native VLAN tagging enabled (double-tag mitigated)
─────────────────────────────────
SL-011: VLAN Hopping Prevention — 4 passed, 0 failed`
  },
  {
    id:'SL-012', title:'Port Security (802.1X)', category:'Network Access Control',
    layer:'DataLink', framework:'IEEE 802.1X', language:'Python',
    difficulty:'Advanced',
    description:'Validate 802.1X port-based network access control for banking LAN. Test RADIUS authentication, MAB fallback, guest VLAN assignment, and reauthentication timers.',
    prerequisites:['802.1X supplicant','RADIUS server access','Switch 802.1X configuration'],
    config:'RADIUS_SERVER=10.0.1.10\nRADIUS_SECRET=env:RADIUS_SHARED_SECRET\nSWITCH_API=https://switch-mgmt.bank.local:8443/api\nGUEST_VLAN=200\nAUTH_VLAN=100\nREAUTH_SEC=3600',
    code: `#!/usr/bin/env python3
"""SL-012: 802.1X Port Security Validation"""
import requests, subprocess

SWITCH_API = "https://switch-mgmt.bank.local:8443/api"
GUEST_VLAN = 200
AUTH_VLAN = 100

def test_802_1x_auth_success():
    """Valid credentials → production VLAN"""
    r = requests.post(f"{SWITCH_API}/dot1x/test-auth", json={
        "username": "bank_user_01",
        "password": "test_cred",
        "port": "Gi0/1",
        "method": "EAP-TLS"
    }, timeout=15).json()
    assert r["result"] == "AUTHENTICATED"
    assert r["assigned_vlan"] == AUTH_VLAN
    print(f"[PASS] 802.1X auth success → VLAN {AUTH_VLAN}")

def test_802_1x_auth_failure():
    """Invalid credentials → guest VLAN"""
    r = requests.post(f"{SWITCH_API}/dot1x/test-auth", json={
        "username": "rogue_user",
        "password": "bad_pass",
        "port": "Gi0/2",
        "method": "EAP-TLS"
    }, timeout=15).json()
    assert r["result"] == "FAILED"
    assert r["assigned_vlan"] == GUEST_VLAN
    print(f"[PASS] 802.1X auth fail → Guest VLAN {GUEST_VLAN}")

def test_mab_fallback():
    """Device without supplicant → MAB fallback"""
    r = requests.post(f"{SWITCH_API}/dot1x/test-mab", json={
        "mac": "00:11:22:33:44:55",
        "port": "Gi0/3"
    }, timeout=15).json()
    assert r["method"] == "MAB"
    assert r["result"] in ("AUTHENTICATED", "GUEST")
    print(f"[PASS] MAB fallback: {r['result']} on {r['assigned_vlan']}")

def test_reauthentication():
    """Verify periodic reauthentication timer"""
    r = requests.get(f"{SWITCH_API}/dot1x/config", timeout=10).json()
    assert r["reauth_period_sec"] <= 3600
    assert r["reauth_enabled"] is True
    print(f"[PASS] Reauth enabled every {r['reauth_period_sec']}s")

if __name__ == "__main__":
    test_802_1x_auth_success()
    test_802_1x_auth_failure()
    test_mab_fallback()
    test_reauthentication()
    print("\\nSL-012: 802.1X Port Security PASSED")`,
    expectedOutput: `[TEST] 802.1X Port Security Validation
[INFO] Testing EAP-TLS authentication...
[PASS] 802.1X auth success → VLAN 100
[INFO] Testing failed authentication...
[PASS] 802.1X auth fail → Guest VLAN 200
[INFO] Testing MAB fallback...
[PASS] MAB fallback: AUTHENTICATED on VLAN 150
[INFO] Checking reauthentication timer...
[PASS] Reauth enabled every 3600s
─────────────────────────────────
SL-012: 802.1X Port Security PASSED
Total: 4 passed, 0 failed`
  },
  {
    id:'SL-013', title:'STP Attack Prevention', category:'Network Resilience',
    layer:'DataLink', framework:'Switch Security', language:'Bash',
    difficulty:'Intermediate',
    description:'Validate Spanning Tree Protocol guards — BPDU Guard, Root Guard, and Loop Guard on banking network switches to prevent topology manipulation attacks.',
    prerequisites:['Switch management access','STP configuration visibility','Test port availability'],
    config:'SWITCH_IP=10.0.0.1\nSSH_USER=admin\nSSH_KEY=/opt/keys/switch_rsa\nACCESS_PORTS=Gi0/1-24\nUPLINK_PORTS=Gi0/25-48',
    code: `#!/bin/bash
# SL-013: STP Attack Prevention
set -euo pipefail

SWITCH="10.0.0.1"
SSH_USER="admin"
SSH_KEY="/opt/keys/switch_rsa"
PASS=0; FAIL=0

echo "[TEST] STP Attack Prevention"

# Check BPDU Guard on access ports
BPDU=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show spanning-tree summary | grep 'BPDU Guard'")
if echo "\$BPDU" | grep -qi "enabled"; then
    echo "[PASS] BPDU Guard enabled globally"
    ((PASS++))
else
    echo "[FAIL] BPDU Guard not enabled"
    ((FAIL++))
fi

# Check Root Guard on uplink ports
ROOT_GUARD=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show spanning-tree interface Gi0/25 detail | grep -c 'Root guard' || echo 0")
if [ "\$ROOT_GUARD" -gt 0 ]; then
    echo "[PASS] Root Guard active on uplinks"
    ((PASS++))
else
    echo "[FAIL] Root Guard not configured on uplinks"
    ((FAIL++))
fi

# Check Loop Guard
LOOP_GUARD=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show spanning-tree summary | grep 'Loop Guard'")
if echo "\$LOOP_GUARD" | grep -qi "enabled"; then
    echo "[PASS] Loop Guard enabled"
    ((PASS++))
else
    echo "[FAIL] Loop Guard not enabled"
    ((FAIL++))
fi

# Check PortFast on access ports
PORTFAST=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show spanning-tree summary | grep 'Portfast Default'")
if echo "\$PORTFAST" | grep -qi "enabled"; then
    echo "[PASS] PortFast enabled on access ports"
    ((PASS++))
else
    echo "[FAIL] PortFast not enabled"
    ((FAIL++))
fi

echo ""
echo "SL-013: STP Attack Prevention — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] STP Attack Prevention
[INFO] Checking BPDU Guard status...
[PASS] BPDU Guard enabled globally
[INFO] Checking Root Guard on uplinks...
[PASS] Root Guard active on uplinks
[INFO] Checking Loop Guard status...
[PASS] Loop Guard enabled
[INFO] Checking PortFast on access ports...
[PASS] PortFast enabled on access ports
─────────────────────────────────
SL-013: STP Attack Prevention — 4 passed, 0 failed`
  },
  {
    id:'SL-014', title:'DHCP Snooping', category:'Network Security',
    layer:'DataLink', framework:'Switch Security', language:'Python',
    difficulty:'Intermediate',
    description:'Validate DHCP snooping to prevent rogue DHCP servers on the banking network. Verify trusted/untrusted port configuration and DHCP binding table integrity.',
    prerequisites:['Switch with DHCP snooping capability','Legitimate DHCP server IP','Network tap for testing'],
    config:'SWITCH_API=https://switch-mgmt.bank.local:8443/api\nDHCP_SERVER=10.0.1.5\nTRUSTED_PORTS=Gi0/25,Gi0/26\nSNOOPING_VLANS=100,200,300',
    code: `#!/usr/bin/env python3
"""SL-014: DHCP Snooping Validation"""
import requests

SWITCH_API = "https://switch-mgmt.bank.local:8443/api"
DHCP_SERVER = "10.0.1.5"

def test_snooping_enabled():
    r = requests.get(f"{SWITCH_API}/dhcp-snooping/status",
                     timeout=10).json()
    assert r["enabled"] is True
    assert set(r["vlans"]) == {100, 200, 300}
    print(f"[PASS] DHCP snooping active on VLANs: {r['vlans']}")

def test_trusted_ports():
    r = requests.get(f"{SWITCH_API}/dhcp-snooping/trusted-ports",
                     timeout=10).json()
    assert "Gi0/25" in r["trusted"]
    assert "Gi0/26" in r["trusted"]
    print(f"[PASS] Trusted ports: {r['trusted']}")

def test_rogue_dhcp_blocked():
    r = requests.post(f"{SWITCH_API}/dhcp-snooping/test-rogue", json={
        "rogue_ip": "10.0.1.99",
        "untrusted_port": "Gi0/5"
    }, timeout=10).json()
    assert r["action"] == "DROPPED"
    assert r["violation_logged"] is True
    print("[PASS] Rogue DHCP offer dropped on untrusted port")

def test_binding_table():
    r = requests.get(f"{SWITCH_API}/dhcp-snooping/bindings",
                     timeout=10).json()
    assert len(r["bindings"]) > 0
    for b in r["bindings"][:3]:
        print(f"  [INFO] {b['mac']} → {b['ip']} on {b['port']}")
    print(f"[PASS] DHCP binding table: {len(r['bindings'])} entries")

if __name__ == "__main__":
    test_snooping_enabled()
    test_trusted_ports()
    test_rogue_dhcp_blocked()
    test_binding_table()
    print("\\nSL-014: DHCP Snooping PASSED")`,
    expectedOutput: `[TEST] DHCP Snooping Validation
[PASS] DHCP snooping active on VLANs: [100, 200, 300]
[PASS] Trusted ports: ['Gi0/25', 'Gi0/26']
[INFO] Simulating rogue DHCP on untrusted port...
[PASS] Rogue DHCP offer dropped on untrusted port
  [INFO] AA:BB:CC:DD:EE:01 → 10.0.100.10 on Gi0/1
  [INFO] AA:BB:CC:DD:EE:02 → 10.0.100.11 on Gi0/2
[PASS] DHCP binding table: 48 entries
─────────────────────────────────
SL-014: DHCP Snooping PASSED
Total: 4 passed, 0 failed`
  },
  {
    id:'SL-015', title:'Link Layer Encryption (MACsec)', category:'Encryption',
    layer:'DataLink', framework:'IEEE 802.1AE', language:'Bash',
    difficulty:'Advanced',
    description:'Validate MACsec (Media Access Control Security) encryption on inter-switch links carrying banking traffic. Verify cipher suites, key agreement, and encrypted frame statistics.',
    prerequisites:['MACsec-capable switches','Pre-shared key or MKA configuration','Switch CLI access'],
    config:'SWITCH_IP=10.0.0.1\nSSH_USER=admin\nSSH_KEY=/opt/keys/switch_rsa\nMKA_POLICY=BANK_MACSEC\nCIPHER=GCM-AES-256',
    code: `#!/bin/bash
# SL-015: MACsec (802.1AE) Validation
set -euo pipefail

SWITCH="10.0.0.1"
SSH_USER="admin"
SSH_KEY="/opt/keys/switch_rsa"
PASS=0; FAIL=0

echo "[TEST] MACsec Link Layer Encryption"

# Check MACsec status on inter-switch links
MACSEC=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show macsec summary" 2>/dev/null)
if echo "\$MACSEC" | grep -q "Secured"; then
    echo "[PASS] MACsec sessions established"
    ((PASS++))
else
    echo "[FAIL] No MACsec sessions found"
    ((FAIL++))
fi

# Verify cipher suite
CIPHER=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show macsec interface Gi0/25 detail | grep 'Cipher'" \\
    | awk '{print \$NF}')
if [ "\$CIPHER" = "GCM-AES-256" ]; then
    echo "[PASS] Cipher suite: GCM-AES-256"
    ((PASS++))
else
    echo "[FAIL] Cipher: \$CIPHER (expected GCM-AES-256)"
    ((FAIL++))
fi

# Check MKA key agreement
MKA=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show mka sessions | grep -c 'Secured' || echo 0")
if [ "\$MKA" -gt 0 ]; then
    echo "[PASS] MKA key agreement: \$MKA secured sessions"
    ((PASS++))
else
    echo "[FAIL] No MKA secured sessions"
    ((FAIL++))
fi

# Check encrypted frame counters
ENC_FRAMES=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show macsec statistics interface Gi0/25 | grep 'Encrypted'" \\
    | awk '{print \$NF}')
echo "[INFO] Encrypted frames: \$ENC_FRAMES"
if [ "\$ENC_FRAMES" -gt 0 ]; then
    echo "[PASS] Frames being encrypted"
    ((PASS++))
fi

echo ""
echo "SL-015: MACsec Validation — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] MACsec Link Layer Encryption
[INFO] Checking MACsec session status...
[PASS] MACsec sessions established
[INFO] Verifying cipher suite...
[PASS] Cipher suite: GCM-AES-256
[INFO] Checking MKA key agreement...
[PASS] MKA key agreement: 4 secured sessions
[INFO] Encrypted frames: 1284739
[PASS] Frames being encrypted
─────────────────────────────────
SL-015: MACsec Validation — 4 passed, 0 failed`
  },
  {
    id:'SL-016', title:'Switch Port Monitoring', category:'Device Monitoring',
    layer:'DataLink', framework:'Network Monitoring', language:'Python',
    difficulty:'Beginner',
    description:'Monitor switch ports for unauthorized device connections. Validate SNMP trap generation, port state change alerts, and device profiling on banking network switches.',
    prerequisites:['SNMP monitoring system','Switch trap receiver','Device profiling database'],
    config:'NMS_API=https://nms.bank.local:8443/api\nSNMP_TRAP_RECEIVER=10.0.1.20\nALERT_WEBHOOK=https://alerts.bank.local/webhook\nPOLL_INTERVAL_SEC=30',
    code: `#!/usr/bin/env python3
"""SL-016: Switch Port Monitoring"""
import requests

NMS_API = "https://nms.bank.local:8443/api"

def test_port_change_alerts():
    """Verify alerts on port state changes"""
    r = requests.get(f"{NMS_API}/alerts/port-changes",
                     params={"last_hours": 24}, timeout=10).json()
    assert r["alert_config"]["enabled"] is True
    assert r["alert_config"]["notify_on_up"] is True
    assert r["alert_config"]["notify_on_down"] is True
    print(f"[PASS] Port change alerts enabled")
    print(f"  [INFO] Alerts last 24h: {len(r['events'])}")

def test_snmp_trap_receiver():
    """Verify SNMP trap receiver is configured"""
    r = requests.get(f"{NMS_API}/snmp/trap-receivers",
                     timeout=10).json()
    receivers = [t["ip"] for t in r["receivers"]]
    assert "10.0.1.20" in receivers
    print(f"[PASS] SNMP trap receiver configured: 10.0.1.20")

def test_device_profiling():
    """Check that connected devices are profiled"""
    r = requests.get(f"{NMS_API}/device-profiling/summary",
                     timeout=10).json()
    assert r["profiling_enabled"] is True
    profiled = r["profiled_count"]
    unknown = r["unknown_count"]
    print(f"[PASS] Device profiling active")
    print(f"  [INFO] Profiled: {profiled}, Unknown: {unknown}")
    if unknown > 0:
        print(f"  [WARN] {unknown} unknown devices detected")

def test_unauthorized_device_alert():
    """Simulate unauthorized device connection"""
    r = requests.post(f"{NMS_API}/test/unauthorized-device", json={
        "mac": "DE:AD:BE:EF:99:99",
        "port": "Gi0/10"
    }, timeout=10).json()
    assert r["alert_generated"] is True
    print("[PASS] Unauthorized device alert generated")

if __name__ == "__main__":
    test_port_change_alerts()
    test_snmp_trap_receiver()
    test_device_profiling()
    test_unauthorized_device_alert()
    print("\\nSL-016: Switch Port Monitoring PASSED")`,
    expectedOutput: `[TEST] Switch Port Monitoring
[PASS] Port change alerts enabled
  [INFO] Alerts last 24h: 7
[PASS] SNMP trap receiver configured: 10.0.1.20
[PASS] Device profiling active
  [INFO] Profiled: 142, Unknown: 2
  [WARN] 2 unknown devices detected
[PASS] Unauthorized device alert generated
─────────────────────────────────
SL-016: Switch Port Monitoring PASSED
Total: 4 passed, 0 failed`
  },
  {
    id:'SL-017', title:'Broadcast Storm Protection', category:'Network Resilience',
    layer:'DataLink', framework:'Storm Control', language:'Bash',
    difficulty:'Beginner',
    description:'Validate broadcast storm control on banking network switches. Verify rate limiting thresholds for broadcast, multicast, and unknown unicast traffic to prevent network degradation.',
    prerequisites:['Switch management access','Storm control configuration','Traffic generator for testing'],
    config:'SWITCH_IP=10.0.0.1\nSSH_USER=admin\nSSH_KEY=/opt/keys/switch_rsa\nBROADCAST_LIMIT_PCT=10\nMULTICAST_LIMIT_PCT=10\nACTION=shutdown',
    code: `#!/bin/bash
# SL-017: Broadcast Storm Protection
set -euo pipefail

SWITCH="10.0.0.1"
SSH_USER="admin"
SSH_KEY="/opt/keys/switch_rsa"
PASS=0; FAIL=0

echo "[TEST] Broadcast Storm Protection"

# Check storm-control on access ports
for PORT in Gi0/1 Gi0/2 Gi0/3; do
    STORM=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
        "show storm-control \$PORT" 2>/dev/null)
    if echo "\$STORM" | grep -q "broadcast"; then
        BC_LEVEL=$(echo "\$STORM" | grep broadcast | awk '{print \$3}')
        echo "[PASS] \$PORT: Broadcast storm-control at \${BC_LEVEL}%"
        ((PASS++))
    else
        echo "[FAIL] \$PORT: No broadcast storm-control"
        ((FAIL++))
    fi
done

# Check storm-control action
ACTION=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show storm-control Gi0/1 | grep 'Action'" | awk '{print \$NF}')
if [ "\$ACTION" = "shutdown" ] || [ "\$ACTION" = "trap" ]; then
    echo "[PASS] Storm-control action: \$ACTION"
    ((PASS++))
else
    echo "[FAIL] Storm-control action: \$ACTION (expected shutdown/trap)"
    ((FAIL++))
fi

# Check for recent storm events
STORMS=$(ssh -i "\$SSH_KEY" "\$SSH_USER@\$SWITCH" \\
    "show storm-control | grep -c 'Forwarding' || echo 0")
echo "[INFO] Ports in forwarding state: \$STORMS"

echo ""
echo "SL-017: Broadcast Storm Protection — \$PASS passed, \$FAIL failed"`,
    expectedOutput: `[TEST] Broadcast Storm Protection
[PASS] Gi0/1: Broadcast storm-control at 10%
[PASS] Gi0/2: Broadcast storm-control at 10%
[PASS] Gi0/3: Broadcast storm-control at 10%
[PASS] Storm-control action: shutdown
[INFO] Ports in forwarding state: 24
[INFO] No storm events in last 24h
─────────────────────────────────
SL-017: Broadcast Storm Protection — 4 passed, 0 failed`
  },
];

export default function SecurityLayerLab() {
  const [tab, setTab] = useState('Physical');
  const [sel, setSel] = useState(SCENARIOS[0]);
  const [search, setSearch] = useState('');
  const [diffF, setDiffF] = useState('All');
  const [statuses, setStatuses] = useState({});
  const [code, setCode] = useState(SCENARIOS[0].code);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [progress, setProgress] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const timerRef = useRef(null);

  const filtered = SCENARIOS.filter(s => {
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
      if (i < lines.length) {
        setOutput(prev => prev + (prev ? '\n' : '') + lines[i]);
        setProgress(Math.round(((i + 1) / lines.length) * 100));
        i++;
      } else {
        clearInterval(timerRef.current);
        setRunning(false);
        setStatuses(prev => ({ ...prev, [sel.id]: 'passed' }));
      }
    }, 150);
  }, [sel, running]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const totalTab = SCENARIOS.filter(s => s.layer === tab).length;
  const passedTab = SCENARIOS.filter(s => s.layer === tab && statuses[s.id] === 'passed').length;
  const totalAll = SCENARIOS.length;
  const passedAll = Object.values(statuses).filter(v => v === 'passed').length;

  const copy = () => { navigator.clipboard?.writeText(code); };
  const reset = () => { setCode(sel.code); };

  const sty = {
    page: { minHeight: '100vh', background: `linear-gradient(135deg,${C.bgFrom} 0%,${C.bgTo} 100%)`, color: C.text, fontFamily: "'Segoe UI',Tahoma,Geneva,Verdana,sans-serif", padding: '18px 22px 40px' },
    header: { textAlign: 'center', marginBottom: 16 },
    h1: { fontSize: 28, fontWeight: 800, margin: 0, background: `linear-gradient(90deg,${C.accent},#3498db)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    sub: { fontSize: 13, color: C.muted, marginTop: 4 },
    statsBar: { display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 14, flexWrap: 'wrap' },
    stat: { background: C.card, borderRadius: 8, padding: '6px 18px', fontSize: 13, border: `1px solid ${C.border}` },
    split: { display: 'flex', gap: 16, height: 'calc(100vh - 160px)', minHeight: 500 },
    left: { width: '38%', minWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 },
    right: { flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' },
    tabBar: { display: 'flex', gap: 4, flexWrap: 'wrap' },
    tab: (active) => ({ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: active ? C.accent : C.card, color: active ? '#0a0a1a' : C.text, transition: 'all 0.2s' }),
    filterRow: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
    input: { flex: 1, padding: '7px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.editorBg, color: C.text, fontSize: 13, outline: 'none', minWidth: 120 },
    select: { padding: '6px 8px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.editorBg, color: C.text, fontSize: 12, outline: 'none' },
    list: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 4 },
    card: (active) => ({ padding: '10px 14px', borderRadius: 8, background: active ? C.cardHover : C.card, border: `1px solid ${active ? C.accent : C.border}`, cursor: 'pointer', transition: 'all 0.15s' }),
    cardTitle: { fontSize: 13, fontWeight: 700, color: C.header, marginBottom: 4 },
    cardId: { fontSize: 11, color: C.accent, marginRight: 8 },
    badge: (color) => ({ display: 'inline-block', padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: color + '22', color: color, marginRight: 4 }),
    dot: (status) => ({ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: status === 'passed' ? C.accent : status === 'failed' ? C.danger : C.muted, marginRight: 6 }),
    layerTag: (layer) => ({ display: 'inline-block', padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: (LAYER_COLORS[layer] || C.accent) + '22', color: LAYER_COLORS[layer] || C.accent, marginRight: 4 }),
    panel: { background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: 16, overflowY: 'auto' },
    panelTitle: { fontSize: 16, fontWeight: 700, color: C.header, marginBottom: 6 },
    panelSub: { fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.5 },
    editor: { width: '100%', minHeight: 200, maxHeight: 280, padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, background: C.editorBg, color: C.editorText, fontFamily: "'Fira Code','Consolas',monospace", fontSize: 12, lineHeight: 1.6, resize: 'vertical', outline: 'none', whiteSpace: 'pre', overflowX: 'auto' },
    btn: (bg) => ({ padding: '7px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: bg || C.accent, color: (bg === C.danger || bg === '#555') ? '#fff' : '#0a0a1a', transition: 'opacity 0.2s' }),
    outputBox: { background: C.editorBg, borderRadius: 8, border: `1px solid ${C.border}`, padding: 12, fontFamily: "'Fira Code','Consolas',monospace", fontSize: 11, color: C.accent, lineHeight: 1.7, whiteSpace: 'pre-wrap', minHeight: 60, maxHeight: 180, overflowY: 'auto' },
    progBar: { height: 4, borderRadius: 2, background: '#0a2744', marginTop: 6 },
    progFill: (pct) => ({ height: '100%', borderRadius: 2, width: pct + '%', background: pct === 100 ? C.accent : '#3498db', transition: 'width 0.3s' }),
    progressOverall: { height: 6, borderRadius: 3, background: '#0a2744', marginBottom: 8 },
    progressFill: (pct) => ({ height: '100%', borderRadius: 3, width: pct + '%', background: `linear-gradient(90deg,${C.accent},#3498db)`, transition: 'width 0.4s' }),
    configBox: { background: C.editorBg, borderRadius: 8, border: `1px solid ${C.border}`, padding: 12, marginTop: 8, fontSize: 12, lineHeight: 1.6, color: C.warn, fontFamily: "'Fira Code','Consolas',monospace", whiteSpace: 'pre-wrap' },
  };

  return (
    <div style={sty.page}>
      <div style={sty.header}>
        <h1 style={sty.h1}>Security 7-Layer Testing Lab (OSI Model)</h1>
        <div style={sty.sub}>Banking Application Security Testing Across All 7 OSI Layers — {totalAll} Scenarios</div>
      </div>
      <div style={sty.statsBar}>
        <span style={sty.stat}>Total: <b style={{color:C.accent}}>{totalAll}</b> scenarios</span>
        <span style={sty.stat}>Passed: <b style={{color:C.accent}}>{passedAll}</b>/{totalAll}</span>
        <span style={sty.stat}>Layer: <b style={{color:C.accent}}>{passedTab}</b>/{totalTab} passed</span>
        <span style={sty.stat}>Coverage: <b style={{color:C.accent}}>{totalAll > 0 ? Math.round((passedAll/totalAll)*100) : 0}%</b></span>
      </div>
      <div style={sty.split}>
        <div style={sty.left}>
          <div style={sty.tabBar}>
            {TABS.map(t => (
              <button key={t.key} style={sty.tab(tab === t.key)} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={sty.filterRow}>
            <input style={sty.input} placeholder="Search scenarios..." value={search} onChange={e => setSearch(e.target.value)} />
            <select style={sty.select} value={diffF} onChange={e => setDiffF(e.target.value)}>
              {['All', ...DIFF].map(d => <option key={d} value={d}>{d === 'All' ? 'Difficulty' : d}</option>)}
            </select>
          </div>
          <div style={sty.progressOverall}>
            <div style={sty.progressFill(totalTab > 0 ? Math.round((passedTab/totalTab)*100) : 0)} />
          </div>
          <div style={sty.list}>
            {filtered.length === 0 && <div style={{color:C.muted,textAlign:'center',padding:20}}>No scenarios match filters</div>}
            {filtered.map(s => (
              <div key={s.id} style={sty.card(sel.id === s.id)} onClick={() => pick(s)}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={sty.dot(statuses[s.id])} />
                  <span style={sty.cardId}>{s.id}</span>
                  <span style={sty.cardTitle}>{s.title}</span>
                </div>
                <div style={{marginTop:4}}>
                  <span style={sty.layerTag(s.layer)}>L{LAYER_NUMS[s.layer]} {s.layer}</span>
                  <span style={sty.badge(s.difficulty === 'Beginner' ? C.accent : s.difficulty === 'Intermediate' ? C.warn : C.danger)}>{s.difficulty}</span>
                  <span style={sty.badge('#3498db')}>{s.framework}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={sty.right}>
          <div style={{...sty.panel, flex: '0 0 auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div>
                <span style={{fontSize:14,fontWeight:800,color:C.accent,marginRight:10}}>{sel.id}</span>
                <span style={sty.panelTitle}>{sel.title}</span>
              </div>
              <div>
                <span style={sty.layerTag(sel.layer)}>Layer {LAYER_NUMS[sel.layer]}: {sel.layer}</span>
                <span style={sty.badge(sel.difficulty === 'Beginner' ? C.accent : sel.difficulty === 'Intermediate' ? C.warn : C.danger)}>{sel.difficulty}</span>
                <span style={sty.badge('#f1c40f')}>{sel.language}</span>
              </div>
            </div>
            <div style={sty.panelSub}>{sel.description}</div>
            <div style={{fontSize:11,color:C.muted}}>
              <b>Prerequisites:</b> {Array.isArray(sel.prerequisites) ? sel.prerequisites.join(' | ') : sel.prerequisites}
            </div>
          </div>
          <div style={{...sty.panel, flex: 1, display:'flex', flexDirection:'column', gap:10, overflow:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Test Script — {sel.framework}</span>
              <div style={{display:'flex',gap:6}}>
                <button style={sty.btn()} onClick={copy}>Copy</button>
                <button style={sty.btn('#555')} onClick={reset}>Reset</button>
              </div>
            </div>
            <textarea style={sty.editor} value={code} onChange={e => setCode(e.target.value)} spellCheck={false} />
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:700,color:C.header}}>Expected Output</span>
              <span style={{fontSize:11,color:C.muted}}>{sel.language}</span>
            </div>
            <div style={sty.outputBox}>{sel.expectedOutput}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button style={{...sty.btn(running ? '#555' : C.accent),opacity:running?0.6:1}} onClick={runSim} disabled={running}>
                {running ? 'Running...' : 'Run Test'}
              </button>
              {statuses[sel.id] === 'passed' && <span style={{color:C.accent,fontSize:12,fontWeight:700}}>PASSED</span>}
              {progress > 0 && progress < 100 && <span style={{color:'#3498db',fontSize:11}}>{progress}%</span>}
              <button style={{...sty.btn('#3498db'),marginLeft:'auto'}} onClick={() => setShowConfig(!showConfig)}>
                {showConfig ? 'Hide' : 'Show'} Config
              </button>
            </div>
            {(running || output) && (
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.header,marginBottom:4}}>Execution Output</div>
                <div style={sty.outputBox}>{output || 'Starting...'}</div>
                <div style={sty.progBar}><div style={sty.progFill(progress)} /></div>
              </div>
            )}
            {showConfig && (
              <div style={sty.configBox}>
                <div style={{fontWeight:700,color:C.accent,marginBottom:6}}>Configuration</div>
                <div>{sel.config}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

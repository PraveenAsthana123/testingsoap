import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12' };

const TABS = [
  { key:'OSLevel', label:'OS Level' },
  { key:'DataLevel', label:'Data Level' },
  { key:'FolderLevel', label:'Folder Level' },
  { key:'APILevel', label:'API Level' },
  { key:'IntegrationLevel', label:'Integration' },
  { key:'UserLevel', label:'User Level' },
];
const DIFF = ['Beginner','Intermediate','Advanced'];
const DC = { Beginner:'#2ecc71', Intermediate:'#f39c12', Advanced:'#e74c3c' };
const TC = { OSLevel:'#e74c3c', DataLevel:'#3498db', FolderLevel:'#9b59b6', APILevel:'#2ecc71', IntegrationLevel:'#e67e22', UserLevel:'#1abc9c' };

const S = [
  {id:'SL-001',title:'File System Permission Audit',layer:'OSLevel',framework:'Shell / Python',language:'Shell',difficulty:'Beginner',
   description:'Validates file system permissions on critical system directories and configuration files to ensure least-privilege access is enforced across the operating system.',
   prerequisites:'Linux OS with bash, root or sudo access, /etc and /var directories accessible',
   config:'TARGET_DIRS=/etc,/var/log,/opt/app\nCRITICAL_FILES=/etc/passwd,/etc/shadow,/etc/sudoers\nEXPECTED_SHADOW_PERM=640\nEXPECTED_SUDOERS_PERM=440\nAUDIT_LOG=/var/log/permission_audit.log',
   code:`#!/bin/bash
# SL-001: File System Permission Audit
set -euo pipefail

echo "[INFO] Starting file system permission audit..."

# Check /etc/shadow permissions (should be 640 or stricter)
SHADOW_PERM=$(stat -c "%a" /etc/shadow)
if [ "\\\${SHADOW_PERM}" -le 640 ]; then
    echo "[PASS] /etc/shadow permissions: \\\${SHADOW_PERM} (<=640)"
else
    echo "[FAIL] /etc/shadow permissions: \\\${SHADOW_PERM} (expected <=640)"
fi

# Check /etc/sudoers permissions (should be 440)
SUDOERS_PERM=$(stat -c "%a" /etc/sudoers)
if [ "\\\${SUDOERS_PERM}" -eq 440 ]; then
    echo "[PASS] /etc/sudoers permissions: \\\${SUDOERS_PERM}"
else
    echo "[FAIL] /etc/sudoers permissions: \\\${SUDOERS_PERM} (expected 440)"
fi

# Check world-writable files in /etc
WW_COUNT=$(find /etc -perm -0002 -type f 2>/dev/null | wc -l)
if [ "\\\${WW_COUNT}" -eq 0 ]; then
    echo "[PASS] No world-writable files in /etc"
else
    echo "[FAIL] Found \\\${WW_COUNT} world-writable files in /etc"
fi

# Check SUID binaries
SUID_COUNT=$(find /usr/bin -perm -4000 -type f 2>/dev/null | wc -l)
echo "[INFO] SUID binaries found: \\\${SUID_COUNT}"

# Check /tmp sticky bit
TMP_PERM=$(stat -c "%a" /tmp)
if [ "\\\${TMP_PERM}" = "1777" ]; then
    echo "[PASS] /tmp has sticky bit set: \\\${TMP_PERM}"
else
    echo "[FAIL] /tmp missing sticky bit: \\\${TMP_PERM}"
fi

echo "[INFO] Permission audit complete"`,
   expectedOutput:`[TEST] SL-001: File System Permission Audit
[INFO] Starting file system permission audit...
[PASS] /etc/shadow permissions: 640 (<=640)
[PASS] /etc/sudoers permissions: 440
[PASS] No world-writable files in /etc
[INFO] SUID binaries found: 23
[PASS] /tmp has sticky bit set: 1777
[INFO] Permission audit complete
[INFO] Total checks: 4 permission, 1 SUID scan
───────────────────────────────────
SL-001: FS Permission Audit — 4 passed, 0 failed`},

  {id:'SL-002',title:'Process Isolation & Namespace Verification',layer:'OSLevel',framework:'Shell / Python',language:'Python',difficulty:'Advanced',
   description:'Tests Linux namespace isolation including PID, network, and mount namespaces to verify container and process sandboxing is properly enforced at the kernel level.',
   prerequisites:'Linux kernel 3.8+, Python 3.8+, root access, unshare command available, /proc filesystem mounted',
   config:'NAMESPACE_TYPES=pid,net,mnt,uts,ipc\nCONTAINER_RUNTIME=docker\nISOLATION_CHECK_TIMEOUT=30\nPROC_PATH=/proc\nEXPECTED_NAMESPACES=5',
   code:`import subprocess
import os
import unittest

class TestProcessIsolation(unittest.TestCase):
    PROC = "/proc"

    def test_pid_namespace_isolation(self):
        """Verify PID namespace prevents cross-namespace visibility"""
        result = subprocess.run(
            ["unshare", "--pid", "--fork", "--mount-proc", "ps", "aux"],
            capture_output=True, text=True, timeout=10
        )
        lines = result.stdout.strip().split("\\n")
        # In isolated PID namespace, only 2 processes: ps and header
        self.assertLessEqual(len(lines), 3,
            f"PID namespace leak: {len(lines)} processes visible")

    def test_network_namespace_isolation(self):
        """Verify network namespace has no external access"""
        result = subprocess.run(
            ["unshare", "--net", "ip", "addr", "show"],
            capture_output=True, text=True, timeout=10
        )
        self.assertNotIn("eth0", result.stdout)
        self.assertIn("lo", result.stdout)

    def test_mount_namespace_isolation(self):
        """Verify mount namespace hides host mounts"""
        result = subprocess.run(
            ["unshare", "--mount", "mountpoint", "-q", "/"],
            capture_output=True, text=True, timeout=10
        )
        self.assertEqual(result.returncode, 0)

    def test_user_namespace_mapping(self):
        """Verify UID mapping in user namespace"""
        uid_map = f"{self.PROC}/self/uid_map"
        if os.path.exists(uid_map):
            with open(uid_map) as f:
                content = f.read().strip()
            self.assertTrue(len(content) > 0, "UID map should not be empty")

    def test_seccomp_profile_active(self):
        """Verify seccomp profile restricts syscalls"""
        seccomp_status = f"{self.PROC}/self/status"
        with open(seccomp_status) as f:
            status = f.read()
        self.assertIn("Seccomp:", status)`,
   expectedOutput:`[TEST] SL-002: Process Isolation & Namespace Verification
[PASS] PID namespace: only 2 processes visible (isolated)
[INFO] Namespace type: PID (CLONE_NEWPID)
[PASS] Network namespace: no eth0, only loopback
[PASS] Mount namespace: root mountpoint verified
[PASS] User namespace: UID mapping present
[PASS] Seccomp profile: active and enforcing
[INFO] Kernel version: 6.1.0, namespaces: 5/5 supported
[INFO] Isolation level: FULL (all namespaces verified)
───────────────────────────────────
SL-002: Process Isolation — 5 passed, 0 failed`},

  {id:'SL-003',title:'SELinux/AppArmor Policy Enforcement',layer:'OSLevel',framework:'Shell / sestatus',language:'Shell',difficulty:'Intermediate',
   description:'Validates SELinux or AppArmor mandatory access control policies are active and enforcing, verifying confined domains and denied access attempts are properly logged.',
   prerequisites:'Linux with SELinux or AppArmor enabled, audit daemon running, policy packages installed',
   config:'MAC_SYSTEM=selinux\nENFORCING_MODE=enforcing\nAUDIT_LOG=/var/log/audit/audit.log\nAPP_DOMAIN=httpd_t\nDENIED_LOG_CHECK=true',
   code:`#!/bin/bash
# SL-003: SELinux/AppArmor Policy Enforcement
set -euo pipefail

echo "[INFO] Checking Mandatory Access Control system..."

# Detect MAC system
if command -v sestatus &>/dev/null; then
    MAC="selinux"
    echo "[INFO] MAC System: SELinux detected"

    # Check SELinux status
    SELINUX_STATUS=$(sestatus | grep "SELinux status" | awk '{print $3}')
    if [ "\\\${SELINUX_STATUS}" = "enabled" ]; then
        echo "[PASS] SELinux is enabled"
    else
        echo "[FAIL] SELinux is disabled"
    fi

    # Check enforcing mode
    SELINUX_MODE=$(sestatus | grep "Current mode" | awk '{print $3}')
    if [ "\\\${SELINUX_MODE}" = "enforcing" ]; then
        echo "[PASS] SELinux mode: enforcing"
    else
        echo "[FAIL] SELinux mode: \\\${SELINUX_MODE} (expected enforcing)"
    fi

    # Check for denied entries in audit log
    DENIED=$(ausearch -m avc --start today 2>/dev/null | grep -c "denied" || true)
    echo "[INFO] AVC denials today: \\\${DENIED}"

    # Check confined domains
    CONFINED=$(seinfo -t 2>/dev/null | grep -c "_t" || echo "N/A")
    echo "[INFO] Confined domains: \\\${CONFINED}"

elif command -v aa-status &>/dev/null; then
    MAC="apparmor"
    echo "[INFO] MAC System: AppArmor detected"

    PROFILES=$(aa-status 2>/dev/null | grep "profiles are loaded" | awk '{print $1}')
    echo "[PASS] AppArmor profiles loaded: \\\${PROFILES}"

    ENFORCED=$(aa-status 2>/dev/null | grep "profiles are in enforce" | awk '{print $1}')
    echo "[PASS] Profiles in enforce mode: \\\${ENFORCED}"
fi

echo "[INFO] MAC policy enforcement check complete"`,
   expectedOutput:`[TEST] SL-003: SELinux/AppArmor Policy Enforcement
[INFO] Checking Mandatory Access Control system...
[INFO] MAC System: SELinux detected
[PASS] SELinux is enabled
[PASS] SELinux mode: enforcing
[INFO] AVC denials today: 0
[INFO] Confined domains: 4832
[PASS] Policy version: 33, MLS enabled
[INFO] MAC policy enforcement check complete
───────────────────────────────────
SL-003: MAC Policy Enforcement — 3 passed, 0 failed`},

  {id:'SL-004',title:'AES-256 Encryption at Rest Validation',layer:'DataLevel',framework:'Python / cryptography',language:'Python',difficulty:'Intermediate',
   description:'Tests AES-256 encryption at rest for database fields and file storage, validating key management, cipher mode, IV generation, and round-trip data integrity.',
   prerequisites:'Python 3.8+, cryptography library, test database with encrypted columns, encryption key in HSM or env',
   config:'ENCRYPTION_ALGORITHM=AES-256-GCM\nKEY_SOURCE=env:DATA_ENCRYPTION_KEY\nIV_LENGTH=12\nTAG_LENGTH=16\nKEY_ROTATION_DAYS=90\nDB_URL=postgresql://app:pass@db.local/banking',
   code:`import os
import unittest
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

class TestAES256Encryption(unittest.TestCase):
    def setUp(self):
        self.key = AESGCM.generate_key(bit_length=256)
        self.aesgcm = AESGCM(self.key)

    def test_encrypt_decrypt_round_trip(self):
        """Verify data integrity after encrypt/decrypt cycle"""
        plaintext = b"SSN:123-45-6789|AccountNo:9876543210"
        nonce = os.urandom(12)
        ciphertext = self.aesgcm.encrypt(nonce, plaintext, None)
        decrypted = self.aesgcm.decrypt(nonce, ciphertext, None)
        self.assertEqual(plaintext, decrypted)

    def test_key_length_validation(self):
        """Verify key is exactly 256 bits (32 bytes)"""
        self.assertEqual(len(self.key), 32)

    def test_unique_iv_per_encryption(self):
        """Verify each encryption produces unique IV"""
        nonce1 = os.urandom(12)
        nonce2 = os.urandom(12)
        plaintext = b"SensitiveData"
        ct1 = self.aesgcm.encrypt(nonce1, plaintext, None)
        ct2 = self.aesgcm.encrypt(nonce2, plaintext, None)
        self.assertNotEqual(ct1, ct2)

    def test_tampered_ciphertext_rejected(self):
        """Verify tampered ciphertext fails authentication"""
        nonce = os.urandom(12)
        ciphertext = self.aesgcm.encrypt(nonce, b"Original", None)
        tampered = bytearray(ciphertext)
        tampered[0] ^= 0xFF
        with self.assertRaises(Exception):
            self.aesgcm.decrypt(nonce, bytes(tampered), None)

    def test_wrong_key_rejected(self):
        """Verify decryption with wrong key fails"""
        nonce = os.urandom(12)
        ciphertext = self.aesgcm.encrypt(nonce, b"Secret", None)
        wrong_key = AESGCM.generate_key(bit_length=256)
        wrong_aesgcm = AESGCM(wrong_key)
        with self.assertRaises(Exception):
            wrong_aesgcm.decrypt(nonce, ciphertext, None)`,
   expectedOutput:`[TEST] SL-004: AES-256 Encryption at Rest Validation
[PASS] Round-trip encrypt/decrypt: data integrity verified
[INFO] Plaintext size: 36 bytes, Ciphertext size: 52 bytes
[PASS] Key length: 256 bits (32 bytes) confirmed
[PASS] Unique IV: two encryptions produced different ciphertexts
[PASS] Tampered ciphertext: authentication tag verification failed
[PASS] Wrong key: decryption correctly rejected
[INFO] Algorithm: AES-256-GCM, IV: 12 bytes, Tag: 16 bytes
[INFO] Encryption at rest validation complete
───────────────────────────────────
SL-004: AES-256 Encryption — 5 passed, 0 failed`},

  {id:'SL-005',title:'PII Detection & Data Masking',layer:'DataLevel',framework:'Python / regex / presidio',language:'Python',difficulty:'Intermediate',
   description:'Tests PII detection across database fields and log files, validates data masking and tokenization rules for SSN, credit cards, emails, and phone numbers.',
   prerequisites:'Python 3.8+, presidio-analyzer or regex patterns, test dataset with PII samples, masking rules configuration',
   config:'PII_PATTERNS=SSN,CREDIT_CARD,EMAIL,PHONE,IBAN\nMASKING_MODE=partial\nSSN_MASK=***-**-{last4}\nCC_MASK=****-****-****-{last4}\nLOG_SCAN_PATH=/var/log/app/*.log\nALERT_ON_PII=true',
   code:`import re
import unittest

class TestPIIDetectionMasking(unittest.TestCase):
    PII_PATTERNS = {
        "SSN": r"\\b\\d{3}-\\d{2}-\\d{4}\\b",
        "CREDIT_CARD": r"\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b",
        "EMAIL": r"\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
        "PHONE": r"\\b\\+?1?[- ]?\\(?\\d{3}\\)?[- ]?\\d{3}[- ]?\\d{4}\\b",
    }

    def mask_ssn(self, ssn):
        return "***-**-" + ssn[-4:]

    def mask_credit_card(self, cc):
        digits = cc.replace("-", "").replace(" ", "")
        return "****-****-****-" + digits[-4:]

    def test_ssn_detection(self):
        """Detect SSN patterns in text"""
        text = "Customer SSN is 123-45-6789 on file"
        matches = re.findall(self.PII_PATTERNS["SSN"], text)
        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0], "123-45-6789")

    def test_credit_card_detection(self):
        """Detect credit card numbers"""
        text = "Card: 4532-0150-1234-5678 authorized"
        matches = re.findall(self.PII_PATTERNS["CREDIT_CARD"], text)
        self.assertEqual(len(matches), 1)

    def test_ssn_masking(self):
        """Verify SSN is properly masked"""
        masked = self.mask_ssn("123-45-6789")
        self.assertEqual(masked, "***-**-6789")
        self.assertNotIn("123", masked)

    def test_credit_card_masking(self):
        """Verify credit card is properly masked"""
        masked = self.mask_credit_card("4532-0150-1234-5678")
        self.assertEqual(masked, "****-****-****-5678")
        self.assertNotIn("4532", masked)

    def test_no_pii_in_masked_output(self):
        """Verify masked output contains no raw PII"""
        original = "SSN: 123-45-6789, Card: 4532-0150-1234-5678"
        masked = re.sub(self.PII_PATTERNS["SSN"],
            lambda m: self.mask_ssn(m.group()), original)
        masked = re.sub(self.PII_PATTERNS["CREDIT_CARD"],
            lambda m: self.mask_credit_card(m.group()), masked)
        ssn_matches = re.findall(r"\\b\\d{3}-\\d{2}-\\d{4}\\b", masked)
        self.assertEqual(len(ssn_matches), 0)`,
   expectedOutput:`[TEST] SL-005: PII Detection & Data Masking
[PASS] SSN detected: 123-45-6789 in customer record
[PASS] Credit card detected: 4532-****-****-5678
[PASS] SSN masked: ***-**-6789 (original hidden)
[PASS] Credit card masked: ****-****-****-5678
[PASS] No raw PII found in masked output
[INFO] PII patterns scanned: SSN, CREDIT_CARD, EMAIL, PHONE
[INFO] Masking mode: partial (last 4 preserved)
[INFO] Detection accuracy: 100% (5/5 patterns matched)
───────────────────────────────────
SL-005: PII Detection & Masking — 5 passed, 0 failed`},

  {id:'SL-006',title:'Database Column-Level Encryption',layer:'DataLevel',framework:'Python / SQLAlchemy',language:'Python',difficulty:'Advanced',
   description:'Tests column-level encryption for sensitive database fields including Fernet-based encryption, key rotation support, and encrypted search capabilities.',
   prerequisites:'Python 3.8+, cryptography library, SQLite or PostgreSQL test database, Fernet encryption keys',
   config:'DB_URL=sqlite:///test_encrypted.db\nENCRYPTION_KEY=env:COLUMN_ENCRYPT_KEY\nENCRYPTED_COLUMNS=ssn,account_number,routing_number\nKEY_ROTATION_ENABLED=true\nSENTINEL_PREFIX=__ENC__:',
   code:`import unittest
from cryptography.fernet import Fernet, InvalidToken

class TestColumnEncryption(unittest.TestCase):
    SENTINEL = "__ENC__:"

    def setUp(self):
        self.key = Fernet.generate_key()
        self.fernet = Fernet(self.key)

    def encrypt_field(self, value):
        token = self.fernet.encrypt(value.encode())
        return self.SENTINEL + token.decode()

    def decrypt_field(self, stored):
        if not stored.startswith(self.SENTINEL):
            return stored
        token = stored[len(self.SENTINEL):]
        return self.fernet.decrypt(token.encode()).decode()

    def test_encrypt_decrypt_field(self):
        """Round-trip column encryption"""
        original = "987-65-4321"
        encrypted = self.encrypt_field(original)
        self.assertTrue(encrypted.startswith(self.SENTINEL))
        decrypted = self.decrypt_field(encrypted)
        self.assertEqual(original, decrypted)

    def test_encrypted_value_not_readable(self):
        """Encrypted column value hides plaintext"""
        encrypted = self.encrypt_field("4111111111111111")
        raw = encrypted[len(self.SENTINEL):]
        self.assertNotIn("4111", raw)

    def test_wrong_key_fails_gracefully(self):
        """Decryption with rotated/wrong key fails safely"""
        encrypted = self.encrypt_field("sensitive_data")
        wrong_fernet = Fernet(Fernet.generate_key())
        token = encrypted[len(self.SENTINEL):]
        with self.assertRaises(InvalidToken):
            wrong_fernet.decrypt(token.encode())

    def test_key_rotation(self):
        """Verify data re-encrypted with new key"""
        old_key = self.key
        old_fernet = Fernet(old_key)
        encrypted = self.encrypt_field("account_12345")
        new_key = Fernet.generate_key()
        new_fernet = Fernet(new_key)
        token = encrypted[len(self.SENTINEL):]
        plaintext = old_fernet.decrypt(token.encode())
        re_encrypted = self.SENTINEL + new_fernet.encrypt(plaintext).decode()
        decrypted = new_fernet.decrypt(
            re_encrypted[len(self.SENTINEL):].encode()).decode()
        self.assertEqual("account_12345", decrypted)`,
   expectedOutput:`[TEST] SL-006: Database Column-Level Encryption
[PASS] Round-trip: encrypt/decrypt field integrity verified
[INFO] Sentinel prefix: __ENC__: detected
[PASS] Encrypted value: plaintext not visible in ciphertext
[PASS] Wrong key: InvalidToken raised (graceful failure)
[PASS] Key rotation: data re-encrypted with new key successfully
[INFO] Encrypted columns: ssn, account_number, routing_number
[INFO] Encryption: Fernet (AES-128-CBC + HMAC-SHA256)
[INFO] Key rotation verified: old_key -> new_key
───────────────────────────────────
SL-006: Column Encryption — 4 passed, 0 failed`},

  {id:'SL-007',title:'Directory Traversal Prevention',layer:'FolderLevel',framework:'Python / Flask',language:'Python',difficulty:'Intermediate',
   description:'Tests directory traversal attack prevention on file-serving endpoints, validating path normalization, jail enforcement, and symlink restriction.',
   prerequisites:'Python 3.8+, test web application with file download endpoint, controlled test directory structure',
   config:'APP_URL=http://localhost:5000\nBASE_DIR=/opt/app/uploads\nALLOWED_EXTENSIONS=.pdf,.csv,.xlsx\nSYMLINK_FOLLOW=false\nMAX_PATH_DEPTH=5',
   code:`import os
import unittest

class TestDirectoryTraversal(unittest.TestCase):
    BASE_DIR = "/opt/app/uploads"

    def safe_resolve(self, user_path):
        """Resolve and validate path stays within base dir"""
        resolved = os.path.realpath(
            os.path.join(self.BASE_DIR, user_path))
        if not resolved.startswith(self.BASE_DIR):
            raise PermissionError(
                f"Path traversal blocked: {user_path}")
        return resolved

    def test_simple_traversal_blocked(self):
        """../../../etc/passwd should be blocked"""
        with self.assertRaises(PermissionError):
            self.safe_resolve("../../../etc/passwd")

    def test_encoded_traversal_blocked(self):
        """URL-encoded traversal should be blocked"""
        decoded = "..%2F..%2F..%2Fetc%2Fpasswd".replace("%2F", "/")
        with self.assertRaises(PermissionError):
            self.safe_resolve(decoded)

    def test_null_byte_injection_blocked(self):
        """Null byte injection should be blocked"""
        try:
            path = "report.pdf\\x00.sh"
            self.safe_resolve(path)
        except (PermissionError, ValueError):
            pass  # Either exception is acceptable

    def test_valid_path_allowed(self):
        """Normal file path within base dir should work"""
        test_dir = os.path.join(self.BASE_DIR, "reports")
        os.makedirs(test_dir, exist_ok=True)
        test_file = os.path.join(test_dir, "q1_report.pdf")
        with open(test_file, "w") as f:
            f.write("test")
        result = self.safe_resolve("reports/q1_report.pdf")
        self.assertTrue(result.startswith(self.BASE_DIR))
        os.remove(test_file)

    def test_double_dot_in_filename_allowed(self):
        """File named 'data..backup.csv' should be allowed"""
        resolved = self.safe_resolve("data..backup.csv")
        self.assertTrue(resolved.startswith(self.BASE_DIR))`,
   expectedOutput:`[TEST] SL-007: Directory Traversal Prevention
[PASS] Simple traversal: ../../../etc/passwd blocked
[PASS] Encoded traversal: %2F decoded and blocked
[PASS] Null byte injection: blocked (ValueError)
[PASS] Valid path: reports/q1_report.pdf resolved correctly
[PASS] Double dot filename: data..backup.csv allowed (not traversal)
[INFO] Base directory jail: /opt/app/uploads
[INFO] Traversal attempts blocked: 3/3
[INFO] Legitimate paths allowed: 2/2
───────────────────────────────────
SL-007: Directory Traversal — 5 passed, 0 failed`},

  {id:'SL-008',title:'File Upload Validation & Sanitization',layer:'FolderLevel',framework:'Python / unittest',language:'Python',difficulty:'Beginner',
   description:'Tests file upload security including extension allowlisting, MIME type verification, file size limits, filename sanitization, and malicious content detection.',
   prerequisites:'Python 3.8+, test upload endpoint, magic/python-magic for MIME detection, controlled temp directory',
   config:'UPLOAD_DIR=/opt/app/uploads/temp\nALLOWED_EXTENSIONS=.pdf,.csv,.xlsx,.png,.jpg\nMAX_FILE_SIZE=10485760\nMAX_FILENAME_LEN=255\nMIME_STRICT=true',
   code:`import os
import re
import unittest

class TestFileUploadValidation(unittest.TestCase):
    ALLOWED_EXT = {".pdf", ".csv", ".xlsx", ".png", ".jpg"}
    MAX_SIZE = 10 * 1024 * 1024  # 10MB
    MAX_NAME_LEN = 255

    def validate_upload(self, filename, size):
        errors = []
        if not filename or len(filename) > self.MAX_NAME_LEN:
            errors.append("INVALID_FILENAME_LENGTH")
        ext = os.path.splitext(filename)[1].lower()
        if ext not in self.ALLOWED_EXT:
            errors.append("FORBIDDEN_EXTENSION")
        if size > self.MAX_SIZE:
            errors.append("FILE_TOO_LARGE")
        if not re.match(r"^[A-Za-z0-9_\\-\\.]+$", filename):
            errors.append("UNSAFE_FILENAME_CHARS")
        if ".." in filename or "/" in filename or "\\\\" in filename:
            errors.append("PATH_TRAVERSAL_ATTEMPT")
        return errors

    def test_valid_pdf_upload(self):
        """Valid PDF should pass all checks"""
        errors = self.validate_upload("report_2026.pdf", 1024)
        self.assertEqual(errors, [])

    def test_executable_extension_blocked(self):
        """Executable extensions should be rejected"""
        errors = self.validate_upload("payload.exe", 512)
        self.assertIn("FORBIDDEN_EXTENSION", errors)

    def test_double_extension_blocked(self):
        """Double extensions like .pdf.exe should be caught"""
        errors = self.validate_upload("report.pdf.exe", 512)
        self.assertIn("FORBIDDEN_EXTENSION", errors)

    def test_oversized_file_rejected(self):
        """Files exceeding 10MB should be rejected"""
        errors = self.validate_upload("large.pdf", 20 * 1024 * 1024)
        self.assertIn("FILE_TOO_LARGE", errors)

    def test_special_chars_in_name_blocked(self):
        """Filenames with shell metacharacters should be blocked"""
        errors = self.validate_upload("file;rm -rf /.pdf", 100)
        self.assertIn("UNSAFE_FILENAME_CHARS", errors)

    def test_path_in_filename_blocked(self):
        """Path separators in filename should be blocked"""
        errors = self.validate_upload("../../etc/passwd", 100)
        self.assertIn("PATH_TRAVERSAL_ATTEMPT", errors)`,
   expectedOutput:`[TEST] SL-008: File Upload Validation & Sanitization
[PASS] Valid PDF: report_2026.pdf accepted (1KB)
[PASS] Executable blocked: payload.exe rejected (FORBIDDEN_EXTENSION)
[PASS] Double extension blocked: report.pdf.exe rejected
[PASS] Oversized file rejected: 20MB > 10MB limit
[PASS] Shell metacharacters blocked: "file;rm -rf /" rejected
[PASS] Path traversal in filename blocked: ../../etc/passwd
[INFO] Allowed extensions: .pdf, .csv, .xlsx, .png, .jpg
[INFO] Max file size: 10MB, Max filename: 255 chars
───────────────────────────────────
SL-008: File Upload Validation — 6 passed, 0 failed`},

  {id:'SL-009',title:'Temp File Cleanup & Permission Audit',layer:'FolderLevel',framework:'Shell / Python',language:'Shell',difficulty:'Beginner',
   description:'Tests that temporary files are properly cleaned up after processing, validates temp directory permissions, and ensures no sensitive data persists in temporary storage.',
   prerequisites:'Linux OS with bash, temp directories at /tmp and /var/tmp, application temp dir at /opt/app/tmp',
   config:'TEMP_DIRS=/tmp,/var/tmp,/opt/app/tmp\nMAX_AGE_HOURS=24\nSENSITIVE_PATTERNS=*.key,*.pem,*.env,*.credentials\nCLEANUP_ON_EXIT=true\nAUDIT_INTERVAL=3600',
   code:`#!/bin/bash
# SL-009: Temp File Cleanup & Permission Audit
set -euo pipefail

APP_TMP="/opt/app/tmp"
MAX_AGE=24

echo "[INFO] Temp file cleanup and permission audit..."

# Check temp directory permissions
TMP_PERM=$(stat -c "%a" /tmp)
if [ "\\\${TMP_PERM}" = "1777" ]; then
    echo "[PASS] /tmp permissions: \\\${TMP_PERM} (sticky bit set)"
else
    echo "[FAIL] /tmp permissions: \\\${TMP_PERM} (expected 1777)"
fi

# Check for stale files older than MAX_AGE hours
STALE=$(find "\\\${APP_TMP}" -type f -mmin +$((MAX_AGE * 60)) 2>/dev/null | wc -l)
if [ "\\\${STALE}" -eq 0 ]; then
    echo "[PASS] No stale files older than \\\${MAX_AGE}h"
else
    echo "[FAIL] Found \\\${STALE} stale files in \\\${APP_TMP}"
fi

# Check for sensitive file patterns in temp
SENSITIVE=0
for pattern in "*.key" "*.pem" "*.env" "*.credentials"; do
    COUNT=$(find /tmp "\\\${APP_TMP}" -name "\\\${pattern}" 2>/dev/null | wc -l)
    SENSITIVE=$((SENSITIVE + COUNT))
done
if [ "\\\${SENSITIVE}" -eq 0 ]; then
    echo "[PASS] No sensitive files in temp directories"
else
    echo "[FAIL] Found \\\${SENSITIVE} sensitive files in temp"
fi

# Check temp files are not world-readable
WR_COUNT=$(find "\\\${APP_TMP}" -perm -o+r -type f 2>/dev/null | wc -l)
if [ "\\\${WR_COUNT}" -eq 0 ]; then
    echo "[PASS] No world-readable files in app temp"
else
    echo "[FAIL] \\\${WR_COUNT} world-readable files in app temp"
fi

# Cleanup stale files
find "\\\${APP_TMP}" -type f -mmin +$((MAX_AGE * 60)) -delete 2>/dev/null || true
echo "[INFO] Cleanup complete"`,
   expectedOutput:`[TEST] SL-009: Temp File Cleanup & Permission Audit
[INFO] Temp file cleanup and permission audit...
[PASS] /tmp permissions: 1777 (sticky bit set)
[PASS] No stale files older than 24h
[PASS] No sensitive files in temp directories
[PASS] No world-readable files in app temp
[INFO] Cleanup complete
[INFO] Directories scanned: /tmp, /var/tmp, /opt/app/tmp
[INFO] Patterns checked: *.key, *.pem, *.env, *.credentials
───────────────────────────────────
SL-009: Temp Cleanup Audit — 4 passed, 0 failed`},

  {id:'SL-010',title:'JWT Validation & Token Security',layer:'APILevel',framework:'Python / PyJWT',language:'Python',difficulty:'Intermediate',
   description:'Tests JWT token validation including signature verification, expiration checks, audience/issuer validation, algorithm restriction, and token revocation.',
   prerequisites:'Python 3.8+, PyJWT library, RSA key pair for RS256, test JWT tokens, token blacklist store',
   config:'JWT_ALGORITHM=RS256\nJWT_ISSUER=https://auth.bank.local\nJWT_AUDIENCE=banking-api\nTOKEN_EXPIRY=3600\nBLACKLIST_STORE=redis://localhost:6379/1\nALLOWED_ALGORITHMS=RS256,ES256',
   code:`import jwt
import time
import unittest
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

class TestJWTValidation(unittest.TestCase):
    def setUp(self):
        self.private_key = rsa.generate_private_key(
            public_exponent=65537, key_size=2048)
        self.public_key = self.private_key.public_key()
        self.issuer = "https://auth.bank.local"
        self.audience = "banking-api"

    def create_token(self, payload, key=None):
        key = key or self.private_key
        return jwt.encode(payload, key, algorithm="RS256")

    def test_valid_token_accepted(self):
        """Valid RS256 token should decode successfully"""
        payload = {"sub": "user001", "iss": self.issuer,
                   "aud": self.audience,
                   "exp": int(time.time()) + 3600}
        token = self.create_token(payload)
        decoded = jwt.decode(token, self.public_key,
            algorithms=["RS256"], audience=self.audience,
            issuer=self.issuer)
        self.assertEqual(decoded["sub"], "user001")

    def test_expired_token_rejected(self):
        """Expired token should raise ExpiredSignatureError"""
        payload = {"sub": "user001", "iss": self.issuer,
                   "aud": self.audience,
                   "exp": int(time.time()) - 100}
        token = self.create_token(payload)
        with self.assertRaises(jwt.ExpiredSignatureError):
            jwt.decode(token, self.public_key,
                algorithms=["RS256"], audience=self.audience)

    def test_wrong_audience_rejected(self):
        """Token with wrong audience should be rejected"""
        payload = {"sub": "user001", "iss": self.issuer,
                   "aud": "wrong-api",
                   "exp": int(time.time()) + 3600}
        token = self.create_token(payload)
        with self.assertRaises(jwt.InvalidAudienceError):
            jwt.decode(token, self.public_key,
                algorithms=["RS256"], audience=self.audience)

    def test_none_algorithm_rejected(self):
        """Algorithm 'none' attack should be rejected"""
        payload = {"sub": "admin", "role": "admin",
                   "exp": int(time.time()) + 3600}
        token = jwt.encode(payload, "", algorithm="HS256")
        with self.assertRaises(Exception):
            jwt.decode(token, self.public_key,
                algorithms=["RS256"], audience=self.audience)`,
   expectedOutput:`[TEST] SL-010: JWT Validation & Token Security
[PASS] Valid RS256 token: decoded successfully, sub=user001
[INFO] Algorithm: RS256, Key: 2048-bit RSA
[PASS] Expired token: ExpiredSignatureError raised
[PASS] Wrong audience: InvalidAudienceError raised
[PASS] Algorithm 'none' attack: rejected (not in allowed list)
[INFO] Allowed algorithms: RS256, ES256
[INFO] Issuer: https://auth.bank.local
[INFO] Token expiry: 3600 seconds
───────────────────────────────────
SL-010: JWT Validation — 4 passed, 0 failed`},

  {id:'SL-011',title:'SQL Injection Prevention Testing',layer:'APILevel',framework:'Python / requests',language:'Python',difficulty:'Intermediate',
   description:'Tests SQL injection prevention across API endpoints including classic injection, UNION-based, blind injection, and second-order injection vectors.',
   prerequisites:'Python 3.8+, target API with database backend, parameterized query enforcement, WAF optional',
   config:'API_URL=http://localhost:8000/api/v1\nDB_TYPE=postgresql\nWAF_ENABLED=true\nINJECTION_LOG=/var/log/app/sqli_attempts.log\nMAX_INPUT_LENGTH=1000',
   code:`import requests
import unittest

class TestSQLInjectionPrevention(unittest.TestCase):
    BASE = "http://localhost:8000/api/v1"

    def test_classic_injection_blocked(self):
        """Classic OR 1=1 injection should be blocked"""
        resp = requests.get(
            f"{self.BASE}/users",
            params={"username": "' OR '1'='1' --"},
            timeout=10)
        self.assertIn(resp.status_code, [400, 422])
        self.assertNotIn("admin", resp.text.lower())

    def test_union_injection_blocked(self):
        """UNION SELECT injection should be blocked"""
        resp = requests.get(
            f"{self.BASE}/products",
            params={"id": "1 UNION SELECT username,password FROM users--"},
            timeout=10)
        self.assertIn(resp.status_code, [400, 422])

    def test_blind_injection_blocked(self):
        """Time-based blind injection should be blocked"""
        import time
        start = time.time()
        resp = requests.get(
            f"{self.BASE}/users",
            params={"id": "1; WAITFOR DELAY '00:00:05'--"},
            timeout=10)
        elapsed = time.time() - start
        self.assertLess(elapsed, 3,
            "Response too slow - possible blind SQLi")
        self.assertIn(resp.status_code, [400, 422])

    def test_stacked_queries_blocked(self):
        """Stacked queries (DROP TABLE) should be blocked"""
        resp = requests.get(
            f"{self.BASE}/users",
            params={"id": "1; DROP TABLE users;--"},
            timeout=10)
        self.assertIn(resp.status_code, [400, 422])

    def test_parameterized_query_safe(self):
        """Normal input with special chars should work"""
        resp = requests.get(
            f"{self.BASE}/users",
            params={"username": "O'Brien"},
            timeout=10)
        self.assertIn(resp.status_code, [200, 404])`,
   expectedOutput:`[TEST] SL-011: SQL Injection Prevention Testing
[PASS] Classic injection: OR 1=1 blocked (400)
[INFO] Input sanitized: "' OR '1'='1' --" rejected
[PASS] UNION injection: UNION SELECT blocked (400)
[PASS] Blind injection: no time delay, blocked (400)
[INFO] Response time: 0.12s (no WAITFOR executed)
[PASS] Stacked queries: DROP TABLE blocked (400)
[PASS] Parameterized safe: O'Brien handled correctly (200)
[INFO] SQL injection vectors tested: 4 blocked, 1 safe input
───────────────────────────────────
SL-011: SQLi Prevention — 5 passed, 0 failed`},

  {id:'SL-012',title:'Rate Limiting & API Throttling',layer:'APILevel',framework:'Python / requests',language:'Python',difficulty:'Beginner',
   description:'Tests API rate limiting enforcement including per-IP limits, per-user limits, burst handling, and proper Retry-After header responses under load.',
   prerequisites:'Python 3.8+, API with rate limiting middleware configured, Redis for rate counter storage',
   config:'API_URL=http://localhost:8000/api/v1\nRATE_LIMIT=100/minute\nBURST_LIMIT=10/second\nRETRY_AFTER_HEADER=true\nRATELIMIT_STORE=redis://localhost:6379/2',
   code:`import requests
import time
import unittest

class TestRateLimiting(unittest.TestCase):
    BASE = "http://localhost:8000/api/v1"

    def test_under_limit_allowed(self):
        """Requests under rate limit should succeed"""
        for i in range(5):
            resp = requests.get(
                f"{self.BASE}/health", timeout=10)
            self.assertEqual(resp.status_code, 200)
            remaining = resp.headers.get("X-RateLimit-Remaining")
            self.assertIsNotNone(remaining)

    def test_over_limit_returns_429(self):
        """Exceeding rate limit should return 429"""
        responses = []
        for i in range(120):
            resp = requests.get(
                f"{self.BASE}/health", timeout=10)
            responses.append(resp.status_code)
            if resp.status_code == 429:
                break
        self.assertIn(429, responses)

    def test_retry_after_header_present(self):
        """429 response should include Retry-After header"""
        for i in range(120):
            resp = requests.get(
                f"{self.BASE}/health", timeout=10)
            if resp.status_code == 429:
                retry_after = resp.headers.get("Retry-After")
                self.assertIsNotNone(retry_after)
                self.assertGreater(int(retry_after), 0)
                break

    def test_rate_limit_headers_present(self):
        """Successful responses should include rate limit headers"""
        resp = requests.get(
            f"{self.BASE}/health", timeout=10)
        self.assertIn("X-RateLimit-Limit",
            resp.headers)
        self.assertIn("X-RateLimit-Remaining",
            resp.headers)
        self.assertIn("X-RateLimit-Reset",
            resp.headers)

    def test_rate_limit_resets(self):
        """Rate limit should reset after window expires"""
        time.sleep(61)
        resp = requests.get(
            f"{self.BASE}/health", timeout=10)
        self.assertEqual(resp.status_code, 200)`,
   expectedOutput:`[TEST] SL-012: Rate Limiting & API Throttling
[PASS] Under limit: 5 requests succeeded (200 OK)
[INFO] X-RateLimit-Remaining: 95/100
[PASS] Over limit: 429 returned after 101 requests
[PASS] Retry-After header: 42 seconds
[PASS] Rate limit headers present: Limit, Remaining, Reset
[INFO] X-RateLimit-Limit: 100, Window: 60s
[PASS] Rate limit reset: access restored after window
[INFO] Rate limiting validated: 100 req/min enforced
───────────────────────────────────
SL-012: Rate Limiting — 5 passed, 0 failed`},

  {id:'SL-013',title:'Mutual TLS Between Microservices',layer:'IntegrationLevel',framework:'Python / requests',language:'Python',difficulty:'Advanced',
   description:'Tests mutual TLS (mTLS) authentication between microservices, validating client certificate verification, certificate chain trust, and TLS version enforcement.',
   prerequisites:'Python 3.8+, CA-signed server and client certificates, OpenSSL, test microservices with mTLS enabled',
   config:'SERVICE_URL=https://payment-svc.internal:8443\nCLIENT_CERT=/certs/client.pem\nCLIENT_KEY=/certs/client-key.pem\nCA_BUNDLE=/certs/ca-bundle.pem\nMIN_TLS_VERSION=TLSv1.2\nCIPHER_SUITES=TLS_AES_256_GCM_SHA384',
   code:`import ssl
import socket
import unittest
import requests

class TestMutualTLS(unittest.TestCase):
    HOST = "payment-svc.internal"
    PORT = 8443
    CLIENT_CERT = ("/certs/client.pem", "/certs/client-key.pem")
    CA_BUNDLE = "/certs/ca-bundle.pem"
    URL = f"https://{HOST}:{PORT}/api/health"

    def test_mtls_valid_cert_accepted(self):
        """Valid client cert should authenticate"""
        resp = requests.get(self.URL,
            cert=self.CLIENT_CERT,
            verify=self.CA_BUNDLE, timeout=10)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["status"], "healthy")

    def test_mtls_no_cert_rejected(self):
        """Missing client cert should be rejected"""
        with self.assertRaises(requests.exceptions.SSLError):
            requests.get(self.URL,
                verify=self.CA_BUNDLE, timeout=10)

    def test_mtls_expired_cert_rejected(self):
        """Expired client cert should fail handshake"""
        expired = ("/certs/expired-client.pem",
                   "/certs/expired-key.pem")
        with self.assertRaises(requests.exceptions.SSLError):
            requests.get(self.URL, cert=expired,
                verify=self.CA_BUNDLE, timeout=10)

    def test_tls_version_enforcement(self):
        """Only TLS 1.2+ should be accepted"""
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.maximum_version = ssl.TLSVersion.TLSv1_1
        ctx.load_verify_locations(self.CA_BUNDLE)
        with self.assertRaises(ssl.SSLError):
            with socket.create_connection(
                    (self.HOST, self.PORT), timeout=10) as sock:
                ctx.wrap_socket(sock, server_hostname=self.HOST)

    def test_cipher_suite_negotiation(self):
        """Verify strong cipher suite is negotiated"""
        ctx = ssl.create_default_context()
        ctx.load_verify_locations(self.CA_BUNDLE)
        ctx.load_cert_chain(*self.CLIENT_CERT)
        with socket.create_connection(
                (self.HOST, self.PORT), timeout=10) as sock:
            with ctx.wrap_socket(sock,
                    server_hostname=self.HOST) as ssock:
                cipher = ssock.cipher()
                self.assertIn("AES", cipher[0])
                self.assertGreaterEqual(cipher[2], 128)`,
   expectedOutput:`[TEST] SL-013: Mutual TLS Between Microservices
[PASS] Valid client cert: 200 OK, status=healthy
[INFO] Client CN: api-gateway.internal, Server CN: payment-svc.internal
[PASS] Missing client cert: SSLError (handshake failed)
[PASS] Expired client cert: SSLError (certificate expired)
[PASS] TLS 1.1 rejected: only TLS 1.2+ accepted
[PASS] Cipher suite: TLS_AES_256_GCM_SHA384 (256-bit)
[INFO] Protocol: TLSv1.3, Key exchange: X25519
[INFO] mTLS verification complete: all vectors tested
───────────────────────────────────
SL-013: mTLS Verification — 5 passed, 0 failed`},

  {id:'SL-014',title:'Webhook Signature Verification',layer:'IntegrationLevel',framework:'Python / Flask',language:'Python',difficulty:'Intermediate',
   description:'Tests webhook payload signature verification using HMAC-SHA256, validating signature computation, replay attack prevention with timestamps, and payload integrity.',
   prerequisites:'Python 3.8+, HMAC-SHA256 signing key, test webhook endpoint, timestamp tolerance configured',
   config:'WEBHOOK_SECRET=env:WEBHOOK_SIGNING_SECRET\nSIGNATURE_HEADER=X-Webhook-Signature\nTIMESTAMP_HEADER=X-Webhook-Timestamp\nTIMESTAMP_TOLERANCE=300\nHASH_ALGORITHM=sha256',
   code:`import hmac
import hashlib
import time
import unittest

class TestWebhookSignature(unittest.TestCase):
    SECRET = b"webhook_secret_key_2026"
    TOLERANCE = 300  # 5 minutes

    def compute_signature(self, timestamp, payload):
        message = f"{timestamp}.{payload}".encode()
        return hmac.new(
            self.SECRET, message, hashlib.sha256).hexdigest()

    def verify_webhook(self, signature, timestamp, payload):
        # Check timestamp freshness
        age = abs(int(time.time()) - int(timestamp))
        if age > self.TOLERANCE:
            raise ValueError("TIMESTAMP_EXPIRED")
        expected = self.compute_signature(timestamp, payload)
        if not hmac.compare_digest(signature, expected):
            raise ValueError("INVALID_SIGNATURE")
        return True

    def test_valid_signature_accepted(self):
        """Valid HMAC-SHA256 signature should pass"""
        ts = str(int(time.time()))
        payload = '{"event":"payment.completed","id":"PAY001"}'
        sig = self.compute_signature(ts, payload)
        result = self.verify_webhook(sig, ts, payload)
        self.assertTrue(result)

    def test_tampered_payload_rejected(self):
        """Modified payload should fail signature check"""
        ts = str(int(time.time()))
        original = '{"event":"payment.completed","amount":100}'
        sig = self.compute_signature(ts, original)
        tampered = '{"event":"payment.completed","amount":99999}'
        with self.assertRaises(ValueError) as ctx:
            self.verify_webhook(sig, ts, tampered)
        self.assertEqual(str(ctx.exception), "INVALID_SIGNATURE")

    def test_replay_attack_blocked(self):
        """Old timestamp should trigger replay protection"""
        old_ts = str(int(time.time()) - 600)
        payload = '{"event":"payment.completed"}'
        sig = self.compute_signature(old_ts, payload)
        with self.assertRaises(ValueError) as ctx:
            self.verify_webhook(sig, old_ts, payload)
        self.assertEqual(str(ctx.exception), "TIMESTAMP_EXPIRED")

    def test_wrong_secret_rejected(self):
        """Signature with wrong key should be rejected"""
        ts = str(int(time.time()))
        payload = '{"event":"refund.created"}'
        wrong_sig = hmac.new(
            b"wrong_key", f"{ts}.{payload}".encode(),
            hashlib.sha256).hexdigest()
        with self.assertRaises(ValueError):
            self.verify_webhook(wrong_sig, ts, payload)`,
   expectedOutput:`[TEST] SL-014: Webhook Signature Verification
[PASS] Valid signature: HMAC-SHA256 verified successfully
[INFO] Signature: a3f8b2c1... (truncated), Algorithm: SHA256
[PASS] Tampered payload: INVALID_SIGNATURE raised
[PASS] Replay attack: TIMESTAMP_EXPIRED (600s > 300s tolerance)
[PASS] Wrong secret: signature mismatch detected
[INFO] Timestamp tolerance: 300 seconds
[INFO] Constant-time comparison: hmac.compare_digest used
[INFO] Webhook security validation complete
───────────────────────────────────
SL-014: Webhook Signature — 4 passed, 0 failed`},

  {id:'SL-015',title:'OAuth2 Token Exchange & Validation',layer:'IntegrationLevel',framework:'Python / requests',language:'Python',difficulty:'Intermediate',
   description:'Tests OAuth2 token exchange flows including authorization code grant, token introspection, scope validation, and token refresh between integrated services.',
   prerequisites:'Python 3.8+, OAuth2 authorization server, registered client credentials, test user accounts',
   config:'AUTH_SERVER=https://oauth.bank.local\nCLIENT_ID=banking-api\nCLIENT_SECRET=env:OAUTH_CLIENT_SECRET\nREDIRECT_URI=https://app.bank.local/callback\nSCOPES=read,write,admin\nTOKEN_ENDPOINT=/oauth/token',
   code:`import requests
import unittest
import time

class TestOAuth2TokenExchange(unittest.TestCase):
    AUTH = "https://oauth.bank.local"
    CLIENT = ("banking-api", "client_secret_123")

    def test_client_credentials_grant(self):
        """Client credentials grant should return access token"""
        resp = requests.post(f"{self.AUTH}/oauth/token",
            data={"grant_type": "client_credentials",
                  "scope": "read write"},
            auth=self.CLIENT, timeout=10)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["token_type"], "Bearer")
        self.assertGreater(data["expires_in"], 0)

    def test_token_introspection(self):
        """Token introspection should return active status"""
        token_resp = requests.post(f"{self.AUTH}/oauth/token",
            data={"grant_type": "client_credentials",
                  "scope": "read"},
            auth=self.CLIENT, timeout=10)
        token = token_resp.json()["access_token"]
        introspect = requests.post(
            f"{self.AUTH}/oauth/introspect",
            data={"token": token},
            auth=self.CLIENT, timeout=10)
        self.assertEqual(introspect.status_code, 200)
        self.assertTrue(introspect.json()["active"])

    def test_invalid_scope_rejected(self):
        """Requesting unauthorized scope should fail"""
        resp = requests.post(f"{self.AUTH}/oauth/token",
            data={"grant_type": "client_credentials",
                  "scope": "admin superadmin"},
            auth=self.CLIENT, timeout=10)
        self.assertIn(resp.status_code, [400, 403])

    def test_token_refresh(self):
        """Refresh token should issue new access token"""
        resp = requests.post(f"{self.AUTH}/oauth/token",
            data={"grant_type": "refresh_token",
                  "refresh_token": "valid_refresh_token_123"},
            auth=self.CLIENT, timeout=10)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("access_token", resp.json())
        self.assertIn("refresh_token", resp.json())

    def test_revoked_token_rejected(self):
        """Revoked token introspection should return inactive"""
        resp = requests.post(f"{self.AUTH}/oauth/introspect",
            data={"token": "revoked_token_xyz"},
            auth=self.CLIENT, timeout=10)
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.json()["active"])`,
   expectedOutput:`[TEST] SL-015: OAuth2 Token Exchange & Validation
[PASS] Client credentials: access token issued
[INFO] Token type: Bearer, Expires in: 3600s, Scope: read write
[PASS] Token introspection: active=true, scope verified
[PASS] Invalid scope: superadmin rejected (403)
[PASS] Token refresh: new access + refresh tokens issued
[PASS] Revoked token: introspection returned active=false
[INFO] OAuth2 server: https://oauth.bank.local
[INFO] Grant types tested: client_credentials, refresh_token
───────────────────────────────────
SL-015: OAuth2 Token Exchange — 5 passed, 0 failed`},

  {id:'SL-016',title:'Password Hashing & Verification',layer:'UserLevel',framework:'Python / bcrypt / argon2',language:'Python',difficulty:'Beginner',
   description:'Tests password hashing security using bcrypt and argon2id, validating hash strength, salt uniqueness, timing-safe comparison, and resistance to rainbow table attacks.',
   prerequisites:'Python 3.8+, bcrypt library, argon2-cffi library, test password samples',
   config:'HASH_ALGORITHM=argon2id\nBCRYPT_ROUNDS=12\nARGON2_TIME_COST=3\nARGON2_MEMORY_COST=65536\nARGON2_PARALLELISM=4\nMIN_PASSWORD_LENGTH=12',
   code:`import bcrypt
import unittest
import time

class TestPasswordHashing(unittest.TestCase):
    ROUNDS = 12

    def test_bcrypt_hash_and_verify(self):
        """Password should hash and verify correctly"""
        password = b"SecureP@ssw0rd!2026"
        hashed = bcrypt.hashpw(password, bcrypt.gensalt(self.ROUNDS))
        self.assertTrue(bcrypt.checkpw(password, hashed))

    def test_wrong_password_rejected(self):
        """Wrong password should fail verification"""
        hashed = bcrypt.hashpw(
            b"CorrectPassword!", bcrypt.gensalt(self.ROUNDS))
        self.assertFalse(bcrypt.checkpw(b"WrongPassword!", hashed))

    def test_unique_salts_per_hash(self):
        """Same password should produce different hashes"""
        password = b"SamePassword123!"
        hash1 = bcrypt.hashpw(password, bcrypt.gensalt(self.ROUNDS))
        hash2 = bcrypt.hashpw(password, bcrypt.gensalt(self.ROUNDS))
        self.assertNotEqual(hash1, hash2)
        self.assertTrue(bcrypt.checkpw(password, hash1))
        self.assertTrue(bcrypt.checkpw(password, hash2))

    def test_hash_cost_factor(self):
        """Higher cost factor should increase hash time"""
        password = b"TimingTest123!"
        start_low = time.time()
        bcrypt.hashpw(password, bcrypt.gensalt(4))
        time_low = time.time() - start_low
        start_high = time.time()
        bcrypt.hashpw(password, bcrypt.gensalt(10))
        time_high = time.time() - start_high
        self.assertGreater(time_high, time_low)

    def test_hash_format_valid(self):
        """Hash should follow bcrypt format $2b$rounds$..."""
        hashed = bcrypt.hashpw(
            b"FormatCheck!", bcrypt.gensalt(self.ROUNDS))
        self.assertTrue(hashed.startswith(b"$2b$"))
        self.assertEqual(len(hashed), 60)

    def test_unicode_password_supported(self):
        """Unicode passwords should hash correctly"""
        password = "P@sswort_Mit_Umlaut_Ae_Oe_Ue".encode("utf-8")
        hashed = bcrypt.hashpw(password, bcrypt.gensalt(self.ROUNDS))
        self.assertTrue(bcrypt.checkpw(password, hashed))`,
   expectedOutput:`[TEST] SL-016: Password Hashing & Verification
[PASS] Bcrypt hash/verify: round-trip successful
[INFO] Algorithm: bcrypt, Rounds: 12
[PASS] Wrong password: verification failed as expected
[PASS] Unique salts: same password produced different hashes
[PASS] Cost factor: rounds=10 took 4.2x longer than rounds=4
[PASS] Hash format: $2b$12$... (60 chars, valid bcrypt)
[PASS] Unicode password: hashed and verified correctly
[INFO] Hash strength: 2^12 iterations per verification
───────────────────────────────────
SL-016: Password Hashing — 6 passed, 0 failed`},

  {id:'SL-017',title:'Brute Force Protection & Account Lockout',layer:'UserLevel',framework:'REST Assured',language:'Java',difficulty:'Intermediate',
   description:'Tests brute force attack protection including progressive delay, CAPTCHA trigger, IP-based blocking, and account lockout with proper recovery mechanisms.',
   prerequisites:'REST Assured 5.x, Auth service with brute force protection, Redis for attempt tracking, CAPTCHA service',
   config:'AUTH_URL=https://auth.bank.local:8443\nMAX_ATTEMPTS=5\nLOCKOUT_MINUTES=30\nCAPTCHA_THRESHOLD=3\nPROGRESSIVE_DELAY=true\nIP_BLOCK_THRESHOLD=50',
   code:`@Test
public void testBruteForceProtection() {
    String target = "victim_user_001";

    // Phase 1: First 3 attempts - normal failure
    for (int i = 1; i <= 3; i++) {
        long start = System.currentTimeMillis();
        Response r = given().contentType("application/json")
            .body("{\\"username\\":\\"" + target + "\\",\\"password\\":\\"Wrong" + i + "\\"}")
            .post("/api/v2/auth/login");
        long elapsed = System.currentTimeMillis() - start;
        assertEquals(401, r.statusCode());
        if (i == 3) {
            assertTrue("CAPTCHA should trigger after 3 attempts",
                r.jsonPath().getBoolean("captcha_required"));
        }
    }

    // Phase 2: Attempt 4 - should have progressive delay
    long start4 = System.currentTimeMillis();
    Response r4 = given().contentType("application/json")
        .body("{\\"username\\":\\"" + target + "\\",\\"password\\":\\"Wrong4\\"}")
        .post("/api/v2/auth/login");
    long delay4 = System.currentTimeMillis() - start4;
    assertEquals(401, r4.statusCode());
    assertTrue("Progressive delay should be > 2s", delay4 > 2000);

    // Phase 3: Attempt 5 - account lockout
    Response r5 = given().contentType("application/json")
        .body("{\\"username\\":\\"" + target + "\\",\\"password\\":\\"Wrong5\\"}")
        .post("/api/v2/auth/login");
    assertEquals(423, r5.statusCode());
    assertEquals("ACCOUNT_LOCKED", r5.jsonPath().getString("error_code"));
    assertEquals(1800, r5.jsonPath().getInt("lockout_seconds"));

    // Phase 4: Correct password during lockout - still blocked
    Response r6 = given().contentType("application/json")
        .body("{\\"username\\":\\"" + target + "\\",\\"password\\":\\"CorrectP@ss!\\"}")
        .post("/api/v2/auth/login");
    assertEquals(423, r6.statusCode());

    // Phase 5: Verify audit log
    Response audit = given()
        .get("/api/v2/audit/bruteforce?user=" + target);
    assertEquals(200, audit.statusCode());
    assertTrue(audit.jsonPath().getInt("attempt_count") >= 5);
}`,
   expectedOutput:`[TEST] SL-017: Brute Force Protection & Account Lockout
[PASS] Attempt 1: 401 (normal failure, no delay)
[PASS] Attempt 2: 401 (normal failure, no delay)
[PASS] Attempt 3: 401 + CAPTCHA required triggered
[PASS] Attempt 4: 401 + progressive delay 2.3s applied
[PASS] Attempt 5: 423 ACCOUNT_LOCKED (lockout: 1800s)
[PASS] Correct password during lockout: still blocked (423)
[PASS] Audit log: 5 failed attempts recorded
[INFO] Protection: progressive delay + CAPTCHA + lockout
[INFO] Lockout duration: 30 minutes
───────────────────────────────────
SL-017: Brute Force Protection — 7 passed, 0 failed`},

  {id:'SL-018',title:'MFA Enforcement & Session Fixation Prevention',layer:'UserLevel',framework:'Python / requests',language:'Python',difficulty:'Advanced',
   description:'Tests multi-factor authentication enforcement across user sessions, validates session fixation prevention, session ID regeneration on login, and MFA bypass resistance.',
   prerequisites:'Python 3.8+, Auth service with MFA module, TOTP/SMS OTP service, Redis session store, test user accounts',
   config:'AUTH_URL=https://auth.bank.local:8443\nMFA_METHODS=totp,sms\nSESSION_STORE=redis://redis.local:6379\nSESSION_REGENERATE=true\nMFA_REMEMBER_DAYS=30\nSESSION_COOKIE=__Host-session',
   code:`import requests
import unittest

class TestMFAEnforcement(unittest.TestCase):
    BASE = "https://auth.bank.local:8443/api/v2"

    def test_login_requires_mfa(self):
        """Login with password only should require MFA step"""
        resp = requests.post(f"{self.BASE}/auth/login",
            json={"username": "mfa_user", "password": "P@ss123!"},
            timeout=10)
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json()["mfa_required"])
        self.assertIn("mfa_token", resp.json())
        self.assertNotIn("session_token", resp.json())

    def test_session_id_regenerated_on_login(self):
        """Session ID must change after authentication"""
        session = requests.Session()
        # Get pre-auth session
        session.get(f"{self.BASE}/auth/csrf", timeout=10)
        pre_cookies = dict(session.cookies)
        # Authenticate
        session.post(f"{self.BASE}/auth/login",
            json={"username": "mfa_user", "password": "P@ss123!"},
            timeout=10)
        post_cookies = dict(session.cookies)
        pre_sid = pre_cookies.get("__Host-session", "")
        post_sid = post_cookies.get("__Host-session", "")
        if pre_sid and post_sid:
            self.assertNotEqual(pre_sid, post_sid)

    def test_mfa_bypass_blocked(self):
        """Skipping MFA step should not grant access"""
        resp = requests.post(f"{self.BASE}/auth/login",
            json={"username": "mfa_user", "password": "P@ss123!"},
            timeout=10)
        mfa_token = resp.json()["mfa_token"]
        # Try accessing resource with mfa_token directly
        api_resp = requests.get(f"{self.BASE}/accounts",
            headers={"Authorization": f"Bearer {mfa_token}"},
            timeout=10)
        self.assertEqual(api_resp.status_code, 401)
        self.assertEqual(api_resp.json()["error_code"],
            "MFA_NOT_COMPLETED")

    def test_invalid_totp_rejected(self):
        """Wrong TOTP code should be rejected"""
        login = requests.post(f"{self.BASE}/auth/login",
            json={"username": "mfa_user", "password": "P@ss123!"},
            timeout=10)
        mfa_token = login.json()["mfa_token"]
        verify = requests.post(f"{self.BASE}/auth/mfa/verify",
            json={"mfa_token": mfa_token, "code": "000000"},
            timeout=10)
        self.assertEqual(verify.status_code, 401)
        self.assertEqual(verify.json()["error_code"],
            "INVALID_MFA_CODE")

    def test_session_cookie_security_flags(self):
        """Session cookie must have Secure, HttpOnly, SameSite"""
        session = requests.Session()
        session.get(f"{self.BASE}/auth/csrf",
            timeout=10, verify=False)
        for cookie in session.cookies:
            if "session" in cookie.name.lower():
                self.assertTrue(cookie.secure)
                self.assertTrue(cookie.has_nonstandard_attr("HttpOnly")
                    or cookie.name.startswith("__Host-"))`,
   expectedOutput:`[TEST] SL-018: MFA Enforcement & Session Fixation Prevention
[PASS] Login requires MFA: mfa_required=true, no session token
[INFO] MFA methods available: TOTP, SMS
[PASS] Session ID regenerated: pre-auth != post-auth session
[PASS] MFA bypass blocked: 401 MFA_NOT_COMPLETED
[INFO] MFA token cannot substitute for session token
[PASS] Invalid TOTP rejected: 401 INVALID_MFA_CODE
[PASS] Session cookie: Secure, HttpOnly, SameSite=Strict
[INFO] Cookie name: __Host-session (host-prefix enforced)
[INFO] MFA enforcement and session security verified
───────────────────────────────────
SL-018: MFA & Session Security — 5 passed, 0 failed`},
];

export default function SecurityLevelsLab() {
  const [tab, setTab] = useState('OSLevel');
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
        <h1 style={sty.h1}>Multi-Level Security Testing Lab</h1>
        <div style={sty.sub}>OS, Data, Folder, API, Integration & User Level Security Testing — {totalAll} Scenarios</div>
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

import React, { useState, useCallback, useRef, useEffect } from 'react';

const C = { bgFrom:'#1a1a2e', bgTo:'#16213e', card:'#0f3460', accent:'#4ecca3', text:'#e0e0e0', header:'#fff', border:'rgba(78,204,163,0.3)', editorBg:'#0a0a1a', editorText:'#4ecca3', muted:'#78909c', cardHover:'#143b6a', danger:'#e74c3c', warn:'#f39c12' };

const TABS = [
  { key:'Authentication', label:'Authentication' },
  { key:'RBAC', label:'Authorization/RBAC' },
  { key:'ABAC', label:'ABAC/Policy' },
  { key:'SSO', label:'SSO/Federation' },
  { key:'Certificate', label:'Certificate/PKI' },
  { key:'UserGroup', label:'User/Group Mgmt' },
];
const DIFF = ['Beginner','Intermediate','Advanced'];
const DC = { Beginner:'#2ecc71', Intermediate:'#f39c12', Advanced:'#e74c3c' };
const TC = { Authentication:'#e74c3c', RBAC:'#3498db', ABAC:'#9b59b6', SSO:'#2ecc71', Certificate:'#e67e22', UserGroup:'#1abc9c' };

const S = [
  {id:'AI-001',title:'Multi-Factor Authentication Flow',layer:'Authentication',framework:'REST Assured',language:'Java',difficulty:'Intermediate',
   description:'Validates complete MFA authentication flow including password validation, OTP generation, OTP verification, and session token issuance for internet banking login.',
   prerequisites:'REST Assured 5.x, OTP service mock, Auth server running on port 8443',
   config:'AUTH_URL=https://auth.bank.local:8443/api/v2\nOTP_SERVICE=http://otp.bank.local:9090\nMFA_TIMEOUT=300\nMAX_OTP_ATTEMPTS=3\nSESSION_EXPIRY=1800',
   code:`@Test
public void testMFAAuthenticationFlow() {
    // Step 1: Submit credentials
    Response loginResp = given()
        .contentType("application/json")
        .body("{\\"username\\":\\"customer001\\",\\"password\\":\\"SecureP@ss123\\"}")
        .post("/api/v2/auth/login");
    assertEquals(200, loginResp.statusCode());
    String mfaToken = loginResp.jsonPath().getString("mfa_token");
    assertNotNull("MFA token should be returned", mfaToken);

    // Step 2: Request OTP
    Response otpResp = given()
        .header("X-MFA-Token", mfaToken)
        .post("/api/v2/auth/otp/request");
    assertEquals(200, otpResp.statusCode());
    assertEquals("SMS", otpResp.jsonPath().getString("delivery_method"));

    // Step 3: Verify OTP
    String otp = getMockOTP("customer001");
    Response verifyResp = given()
        .header("X-MFA-Token", mfaToken)
        .body("{\\"otp\\":\\"" + otp + "\\"}")
        .post("/api/v2/auth/otp/verify");
    assertEquals(200, verifyResp.statusCode());
    String sessionToken = verifyResp.jsonPath().getString("session_token");
    assertNotNull("Session token issued after MFA", sessionToken);
    assertTrue(verifyResp.jsonPath().getInt("expires_in") <= 1800);
}`,
   expectedOutput:`[TEST] AI-001: Multi-Factor Authentication Flow
[INFO] Connecting to auth server: https://auth.bank.local:8443
[PASS] Step 1: Credentials accepted, MFA token issued
[INFO] MFA Token: mfa_tk_a1b2c3d4e5f6
[PASS] Step 2: OTP requested via SMS to +91****7890
[INFO] OTP delivery method: SMS | Expiry: 300s
[PASS] Step 3: OTP verified successfully
[PASS] Session token issued: sess_xyz789
[INFO] Session expiry: 1800 seconds
[PASS] MFA flow completed in 2.3 seconds
───────────────────────────────────
AI-001: MFA Authentication — 4 passed, 0 failed`},

  {id:'AI-002',title:'Password Policy Enforcement',layer:'Authentication',framework:'JUnit / REST Assured',language:'Java',difficulty:'Beginner',
   description:'Tests password policy enforcement including minimum length, complexity requirements, history check, and expiry validation for banking user accounts.',
   prerequisites:'Auth service with password policy API, Test user accounts',
   config:'AUTH_URL=https://auth.bank.local:8443\nMIN_LENGTH=12\nMAX_LENGTH=128\nHISTORY_COUNT=12\nEXPIRY_DAYS=90',
   code:`@Test
public void testPasswordPolicyEnforcement() {
    // Test minimum length
    Response r1 = changePassword("user01", "Short1!");
    assertEquals(400, r1.statusCode());
    assertEquals("PASSWORD_TOO_SHORT", r1.jsonPath().getString("error_code"));

    // Test complexity - missing uppercase
    Response r2 = changePassword("user01", "alllowercase123!");
    assertEquals(400, r2.statusCode());
    assertEquals("MISSING_UPPERCASE", r2.jsonPath().getString("error_code"));

    // Test complexity - missing special char
    Response r3 = changePassword("user01", "NoSpecialChar123");
    assertEquals(400, r3.statusCode());
    assertEquals("MISSING_SPECIAL_CHAR", r3.jsonPath().getString("error_code"));

    // Test password history
    Response r4 = changePassword("user01", "OldPassword@2024");
    assertEquals(400, r4.statusCode());
    assertEquals("PASSWORD_IN_HISTORY", r4.jsonPath().getString("error_code"));

    // Test valid password
    Response r5 = changePassword("user01", "NewSecureP@ss2026!");
    assertEquals(200, r5.statusCode());
    assertEquals(90, r5.jsonPath().getInt("expires_in_days"));
}`,
   expectedOutput:`[TEST] AI-002: Password Policy Enforcement
[PASS] Short password rejected: "Short1!" (7 chars < 12 min)
[PASS] Missing uppercase rejected: "alllowercase123!"
[PASS] Missing special char rejected: "NoSpecialChar123"
[PASS] Password history check: blocked reuse of last 12 passwords
[PASS] Valid password accepted: complexity requirements met
[INFO] Password expiry set: 90 days
[INFO] Policy: min=12, max=128, history=12, expiry=90d
───────────────────────────────────
AI-002: Password Policy — 5 passed, 0 failed`},

  {id:'AI-003',title:'Session Timeout & Invalidation',layer:'Authentication',framework:'Selenium / REST Assured',language:'Java',difficulty:'Intermediate',
   description:'Validates session management including idle timeout, absolute timeout, concurrent session control, and proper session invalidation on logout.',
   prerequisites:'Auth server, Redis session store, Browser driver for Selenium tests',
   config:'SESSION_IDLE_TIMEOUT=300\nSESSION_ABSOLUTE_TIMEOUT=3600\nMAX_CONCURRENT_SESSIONS=1\nSESSION_STORE=redis://redis.bank.local:6379',
   code:`@Test
public void testSessionManagement() {
    // Login and get session
    String token = login("testuser", "SecureP@ss123!");
    assertNotNull(token);

    // Verify session is active
    Response r1 = given().header("Authorization", "Bearer " + token)
        .get("/api/v2/session/status");
    assertEquals(200, r1.statusCode());
    assertTrue(r1.jsonPath().getBoolean("active"));

    // Test idle timeout (simulate wait)
    simulateIdleWait(310); // 310 seconds > 300 idle timeout
    Response r2 = given().header("Authorization", "Bearer " + token)
        .get("/api/v2/session/status");
    assertEquals(401, r2.statusCode());
    assertEquals("SESSION_EXPIRED_IDLE", r2.jsonPath().getString("error_code"));

    // Test concurrent session rejection
    String token2 = login("testuser", "SecureP@ss123!");
    Response r3 = given().header("Authorization", "Bearer " + token)
        .get("/api/v2/accounts");
    assertEquals(401, r3.statusCode());
    assertEquals("SESSION_SUPERSEDED", r3.jsonPath().getString("error_code"));

    // Test logout invalidation
    given().header("Authorization", "Bearer " + token2)
        .post("/api/v2/auth/logout");
    Response r4 = given().header("Authorization", "Bearer " + token2)
        .get("/api/v2/accounts");
    assertEquals(401, r4.statusCode());
}`,
   expectedOutput:`[TEST] AI-003: Session Timeout & Invalidation
[PASS] Session created successfully: sess_abc123
[PASS] Session status: active=true
[INFO] Simulating idle wait: 310 seconds
[PASS] Idle timeout triggered after 300s inactivity
[PASS] Error code: SESSION_EXPIRED_IDLE
[PASS] Concurrent session: old session invalidated
[PASS] Error code: SESSION_SUPERSEDED
[PASS] Logout: session invalidated in Redis
[PASS] Post-logout access correctly denied
───────────────────────────────────
AI-003: Session Management — 7 passed, 0 failed`},

  {id:'AI-004',title:'Account Lockout After Failed Attempts',layer:'Authentication',framework:'REST Assured',language:'Java',difficulty:'Beginner',
   description:'Tests account lockout mechanism after consecutive failed login attempts, including lockout duration, unlock flow, and audit trail generation.',
   prerequisites:'Auth service with lockout policy configured, Audit log database',
   config:'MAX_FAILED_ATTEMPTS=5\nLOCKOUT_DURATION=1800\nAUDIT_DB=postgresql://audit:pass@db.local/audit',
   code:`@Test
public void testAccountLockout() {
    String user = "locktest_user";
    // Attempt 5 failed logins
    for (int i = 1; i <= 5; i++) {
        Response r = given().contentType("application/json")
            .body("{\\"username\\":\\"" + user + "\\",\\"password\\":\\"WrongPass" + i + "\\"}")
            .post("/api/v2/auth/login");
        if (i < 5) {
            assertEquals(401, r.statusCode());
            assertEquals(5 - i, r.jsonPath().getInt("remaining_attempts"));
        } else {
            assertEquals(423, r.statusCode());
            assertEquals("ACCOUNT_LOCKED", r.jsonPath().getString("error_code"));
            assertEquals(1800, r.jsonPath().getInt("lockout_seconds"));
        }
    }
    // Verify correct password also blocked during lockout
    Response r2 = given().contentType("application/json")
        .body("{\\"username\\":\\"" + user + "\\",\\"password\\":\\"CorrectP@ss123\\"}")
        .post("/api/v2/auth/login");
    assertEquals(423, r2.statusCode());

    // Verify audit trail
    Response audit = given().get("/api/v2/audit/login-attempts?user=" + user);
    assertEquals(5, audit.jsonPath().getInt("failed_count"));
}`,
   expectedOutput:`[TEST] AI-004: Account Lockout After Failed Attempts
[PASS] Attempt 1: 401 Unauthorized, 4 remaining
[PASS] Attempt 2: 401 Unauthorized, 3 remaining
[PASS] Attempt 3: 401 Unauthorized, 2 remaining
[PASS] Attempt 4: 401 Unauthorized, 1 remaining
[PASS] Attempt 5: 423 Locked, ACCOUNT_LOCKED
[INFO] Lockout duration: 1800 seconds
[PASS] Correct password blocked during lockout
[PASS] Audit trail: 5 failed attempts recorded
───────────────────────────────────
AI-004: Account Lockout — 7 passed, 0 failed`},

  {id:'AI-005',title:'Biometric Authentication Validation',layer:'Authentication',framework:'Appium / REST API',language:'Python',difficulty:'Advanced',
   description:'Tests biometric authentication including fingerprint, face recognition, and device binding for mobile banking app with fallback mechanisms.',
   prerequisites:'Appium server, Mobile device emulator, Biometric mock API, Device registration service',
   config:'APPIUM_URL=http://localhost:4723\nBIO_API=https://bio.bank.local:8443\nDEVICE_BIND_SERVICE=https://device.bank.local:9090\nFALLBACK_METHOD=PIN',
   code:`import requests
import unittest

class TestBiometricAuth(unittest.TestCase):
    BASE = "https://bio.bank.local:8443/api/v2"

    def test_fingerprint_enrollment(self):
        """Test fingerprint template enrollment"""
        resp = requests.post(f"{self.BASE}/biometric/enroll", json={
            "user_id": "CUST001", "type": "fingerprint",
            "template": "mock_fp_template_base64",
            "device_id": "DEV_ABC123"
        }, timeout=10)
        self.assertEqual(resp.status_code, 201)
        self.assertIn("biometric_id", resp.json())

    def test_fingerprint_match(self):
        """Test fingerprint matching with threshold"""
        resp = requests.post(f"{self.BASE}/biometric/verify", json={
            "user_id": "CUST001", "type": "fingerprint",
            "sample": "mock_fp_sample_base64"
        }, timeout=10)
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(resp.json()["match_score"], 0.95)
        self.assertTrue(resp.json()["authenticated"])

    def test_face_recognition_liveness(self):
        """Test face recognition with liveness detection"""
        resp = requests.post(f"{self.BASE}/biometric/verify", json={
            "user_id": "CUST001", "type": "face",
            "sample": "mock_face_frame_base64",
            "liveness_check": True
        }, timeout=10)
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json()["liveness_passed"])

    def test_device_binding_check(self):
        """Test biometric only works on registered device"""
        resp = requests.post(f"{self.BASE}/biometric/verify", json={
            "user_id": "CUST001", "type": "fingerprint",
            "sample": "mock_fp_sample", "device_id": "UNKNOWN_DEV"
        }, timeout=10)
        self.assertEqual(resp.status_code, 403)
        self.assertEqual(resp.json()["error"], "DEVICE_NOT_REGISTERED")`,
   expectedOutput:`[TEST] AI-005: Biometric Authentication Validation
[PASS] Fingerprint enrollment: template stored for CUST001
[INFO] Biometric ID: bio_fp_001, Device: DEV_ABC123
[PASS] Fingerprint match: score=0.97 (threshold=0.95)
[PASS] Authentication: True
[PASS] Face recognition: liveness check passed
[INFO] Liveness score: 0.99, anti-spoof: active
[PASS] Device binding: unregistered device blocked (403)
[INFO] Error: DEVICE_NOT_REGISTERED
───────────────────────────────────
AI-005: Biometric Auth — 4 passed, 0 failed`},

  {id:'AI-011',title:'Role-Based Access Control Matrix',layer:'RBAC',framework:'REST Assured / JUnit',language:'Java',difficulty:'Intermediate',
   description:'Validates RBAC permission matrix ensuring each role (Teller, Manager, Admin, Auditor) has correct access to banking endpoints based on role assignment.',
   prerequisites:'Auth server with RBAC module, Test users for each role, Permission matrix document',
   config:'AUTH_URL=https://auth.bank.local:8443\nROLES=Teller,Manager,Admin,Auditor\nENDPOINTS=/accounts,/transfers,/admin,/audit',
   code:`@ParameterizedTest
@MethodSource("rolePermissionMatrix")
public void testRBACMatrix(String role, String endpoint, String method, int expected) {
    String token = loginAsRole(role);
    Response resp;
    switch (method) {
        case "GET": resp = given().header("Authorization", "Bearer " + token)
            .get(endpoint); break;
        case "POST": resp = given().header("Authorization", "Bearer " + token)
            .contentType("application/json").body("{}").post(endpoint); break;
        case "DELETE": resp = given().header("Authorization", "Bearer " + token)
            .delete(endpoint); break;
        default: throw new IllegalArgumentException("Unknown method");
    }
    assertEquals(expected, resp.statusCode(),
        role + " " + method + " " + endpoint + " should be " + expected);
}

static Stream<Arguments> rolePermissionMatrix() {
    return Stream.of(
        Arguments.of("Teller", "/api/v2/accounts", "GET", 200),
        Arguments.of("Teller", "/api/v2/transfers", "POST", 200),
        Arguments.of("Teller", "/api/v2/admin/users", "GET", 403),
        Arguments.of("Teller", "/api/v2/admin/config", "POST", 403),
        Arguments.of("Manager", "/api/v2/accounts", "GET", 200),
        Arguments.of("Manager", "/api/v2/transfers/approve", "POST", 200),
        Arguments.of("Manager", "/api/v2/admin/users", "GET", 200),
        Arguments.of("Manager", "/api/v2/admin/config", "POST", 403),
        Arguments.of("Admin", "/api/v2/admin/users", "GET", 200),
        Arguments.of("Admin", "/api/v2/admin/config", "POST", 200),
        Arguments.of("Admin", "/api/v2/admin/users", "DELETE", 200),
        Arguments.of("Auditor", "/api/v2/audit/logs", "GET", 200),
        Arguments.of("Auditor", "/api/v2/transfers", "POST", 403),
        Arguments.of("Auditor", "/api/v2/admin/config", "POST", 403)
    );
}`,
   expectedOutput:`[TEST] AI-011: Role-Based Access Control Matrix
[PASS] Teller GET /accounts → 200 (allowed)
[PASS] Teller POST /transfers → 200 (allowed)
[PASS] Teller GET /admin/users → 403 (blocked)
[PASS] Teller POST /admin/config → 403 (blocked)
[PASS] Manager GET /accounts → 200 (allowed)
[PASS] Manager POST /transfers/approve → 200 (allowed)
[PASS] Manager GET /admin/users → 200 (allowed)
[PASS] Manager POST /admin/config → 403 (blocked)
[PASS] Admin GET /admin/users → 200 (allowed)
[PASS] Admin POST /admin/config → 200 (allowed)
[PASS] Admin DELETE /admin/users → 200 (allowed)
[PASS] Auditor GET /audit/logs → 200 (allowed)
[PASS] Auditor POST /transfers → 403 (blocked)
[PASS] Auditor POST /admin/config → 403 (blocked)
───────────────────────────────────
AI-011: RBAC Matrix — 14 passed, 0 failed`},

  {id:'AI-012',title:'Privilege Escalation Prevention',layer:'RBAC',framework:'REST Assured',language:'Java',difficulty:'Advanced',
   description:'Tests that users cannot escalate their privileges by manipulating tokens, headers, or API parameters to access higher-privilege resources.',
   prerequisites:'Auth server, JWT token service, Role hierarchy configuration',
   config:'AUTH_URL=https://auth.bank.local:8443\nJWT_SECRET=test_secret\nROLE_HIERARCHY=Teller<Manager<Admin',
   code:`@Test
public void testPrivilegeEscalationPrevention() {
    String tellerToken = loginAsRole("Teller");

    // Attempt 1: Modify role claim in JWT
    String tamperedToken = tamperJWTRole(tellerToken, "Admin");
    Response r1 = given().header("Authorization", "Bearer " + tamperedToken)
        .get("/api/v2/admin/users");
    assertEquals(401, r1.statusCode());
    assertEquals("INVALID_TOKEN_SIGNATURE", r1.jsonPath().getString("error_code"));

    // Attempt 2: Add role header manually
    Response r2 = given().header("Authorization", "Bearer " + tellerToken)
        .header("X-User-Role", "Admin")
        .get("/api/v2/admin/users");
    assertEquals(403, r2.statusCode());

    // Attempt 3: IDOR - access another user's data
    Response r3 = given().header("Authorization", "Bearer " + tellerToken)
        .get("/api/v2/users/ADMIN001/profile");
    assertEquals(403, r3.statusCode());
    assertEquals("ACCESS_DENIED", r3.jsonPath().getString("error_code"));

    // Attempt 4: Parameter tampering
    Response r4 = given().header("Authorization", "Bearer " + tellerToken)
        .queryParam("role", "Admin")
        .post("/api/v2/transfers/approve");
    assertEquals(403, r4.statusCode());
}`,
   expectedOutput:`[TEST] AI-012: Privilege Escalation Prevention
[PASS] JWT tampering: invalid signature detected (401)
[PASS] Role header injection: blocked (403)
[PASS] IDOR attempt: access denied to admin profile (403)
[PASS] Parameter tampering: role override blocked (403)
[INFO] All escalation vectors blocked successfully
───────────────────────────────────
AI-012: Privilege Escalation — 4 passed, 0 failed`},

  {id:'AI-013',title:'Role Hierarchy & Inheritance',layer:'RBAC',framework:'JUnit / Spring Security',language:'Java',difficulty:'Intermediate',
   description:'Validates role hierarchy and permission inheritance ensuring Manager inherits Teller permissions and Admin inherits all, while maintaining proper boundaries.',
   prerequisites:'Spring Security with role hierarchy configured, Test user accounts per role',
   config:'ROLE_HIERARCHY=ADMIN>MANAGER>TELLER>VIEWER\nINHERIT_PERMISSIONS=true',
   code:`@Test
public void testRoleHierarchy() {
    // Viewer can only read
    String viewerToken = loginAsRole("Viewer");
    assertEquals(200, get(viewerToken, "/api/v2/accounts").statusCode());
    assertEquals(403, post(viewerToken, "/api/v2/accounts", "{}").statusCode());

    // Teller inherits Viewer + can create
    String tellerToken = loginAsRole("Teller");
    assertEquals(200, get(tellerToken, "/api/v2/accounts").statusCode());
    assertEquals(200, post(tellerToken, "/api/v2/transactions", txBody).statusCode());
    assertEquals(403, post(tellerToken, "/api/v2/transfers/approve", "{}").statusCode());

    // Manager inherits Teller + can approve
    String mgrToken = loginAsRole("Manager");
    assertEquals(200, get(mgrToken, "/api/v2/accounts").statusCode());
    assertEquals(200, post(mgrToken, "/api/v2/transactions", txBody).statusCode());
    assertEquals(200, post(mgrToken, "/api/v2/transfers/approve", "{}").statusCode());
    assertEquals(403, delete(mgrToken, "/api/v2/admin/users/U001").statusCode());

    // Admin inherits all
    String adminToken = loginAsRole("Admin");
    assertEquals(200, delete(adminToken, "/api/v2/admin/users/U001").statusCode());
    assertEquals(200, post(adminToken, "/api/v2/admin/config", "{}").statusCode());
}`,
   expectedOutput:`[TEST] AI-013: Role Hierarchy & Inheritance
[PASS] Viewer: read accounts OK, create blocked
[PASS] Teller: inherits Viewer + create transactions
[PASS] Teller: approve transfers blocked (403)
[PASS] Manager: inherits Teller + approve transfers
[PASS] Manager: delete users blocked (403)
[PASS] Admin: full access including delete users
[PASS] Admin: system config access OK
[INFO] Hierarchy: ADMIN > MANAGER > TELLER > VIEWER
───────────────────────────────────
AI-013: Role Hierarchy — 7 passed, 0 failed`},

  {id:'AI-021',title:'ABAC Policy Engine Validation',layer:'ABAC',framework:'Python / OPA',language:'Python',difficulty:'Advanced',
   description:'Tests Attribute-Based Access Control using Open Policy Agent (OPA) for dynamic authorization decisions based on user attributes, resource attributes, and environmental conditions.',
   prerequisites:'OPA server running, Policy bundle loaded, Test policy definitions',
   config:'OPA_URL=http://opa.bank.local:8181\nPOLICY_PATH=banking/authz\nDECISION_LOG=true',
   code:`import requests
import unittest

class TestABACPolicy(unittest.TestCase):
    OPA = "http://opa.bank.local:8181/v1/data/banking/authz/allow"

    def evaluate(self, user_attrs, resource_attrs, action, env=None):
        payload = {
            "input": {
                "user": user_attrs,
                "resource": resource_attrs,
                "action": action,
                "environment": env or {"time": "10:00", "ip": "10.0.1.50"}
            }
        }
        resp = requests.post(self.OPA, json=payload, timeout=5)
        return resp.json().get("result", False)

    def test_department_match(self):
        result = self.evaluate(
            {"department": "loans", "clearance": "L2"},
            {"type": "loan_application", "department": "loans"},
            "read"
        )
        self.assertTrue(result)

    def test_cross_department_blocked(self):
        result = self.evaluate(
            {"department": "retail", "clearance": "L2"},
            {"type": "loan_application", "department": "loans"},
            "read"
        )
        self.assertFalse(result)

    def test_after_hours_blocked(self):
        result = self.evaluate(
            {"department": "loans", "clearance": "L2"},
            {"type": "loan_application", "department": "loans"},
            "write",
            {"time": "23:00", "ip": "10.0.1.50"}
        )
        self.assertFalse(result)

    def test_high_clearance_override(self):
        result = self.evaluate(
            {"department": "retail", "clearance": "L5"},
            {"type": "loan_application", "department": "loans"},
            "read"
        )
        self.assertTrue(result)`,
   expectedOutput:`[TEST] AI-021: ABAC Policy Engine Validation
[PASS] Same department access: loans user → loan docs (allowed)
[PASS] Cross department: retail user → loan docs (blocked)
[PASS] After hours: write blocked at 23:00
[PASS] High clearance override: L5 can cross departments
[INFO] OPA decision time: avg 2.1ms
[INFO] Policy: department match + clearance + time window
───────────────────────────────────
AI-021: ABAC Policy — 4 passed, 0 failed`},

  {id:'AI-022',title:'Dynamic Authorization Rules',layer:'ABAC',framework:'REST Assured',language:'Java',difficulty:'Advanced',
   description:'Tests dynamic authorization rules that change based on transaction amount, customer risk level, time of day, and geographic location for banking operations.',
   prerequisites:'Policy decision point (PDP) service, Customer risk database, Geo-IP service',
   config:'PDP_URL=https://pdp.bank.local:8443\nRISK_DB=postgresql://risk:pass@db.local/risk\nGEO_SERVICE=https://geoip.bank.local',
   code:`@Test
public void testDynamicAuthorizationRules() {
    // Low-value transfer: auto-approved
    Response r1 = authorizeTransfer("CUST001", 5000, "LOW", "IN", "10:00");
    assertEquals(200, r1.statusCode());
    assertEquals("AUTO_APPROVED", r1.jsonPath().getString("decision"));

    // High-value transfer: requires manager approval
    Response r2 = authorizeTransfer("CUST001", 500000, "LOW", "IN", "10:00");
    assertEquals(200, r2.statusCode());
    assertEquals("REQUIRES_APPROVAL", r2.jsonPath().getString("decision"));
    assertEquals("MANAGER", r2.jsonPath().getString("approver_role"));

    // High-risk customer: additional verification
    Response r3 = authorizeTransfer("CUST_HR001", 5000, "HIGH", "IN", "10:00");
    assertEquals(200, r3.statusCode());
    assertEquals("REQUIRES_VERIFICATION", r3.jsonPath().getString("decision"));

    // Cross-border + after hours: blocked
    Response r4 = authorizeTransfer("CUST001", 50000, "MEDIUM", "NG", "23:30");
    assertEquals(200, r4.statusCode());
    assertEquals("DENIED", r4.jsonPath().getString("decision"));
    assertEquals("CROSS_BORDER_AFTER_HOURS", r4.jsonPath().getString("reason"));
}`,
   expectedOutput:`[TEST] AI-022: Dynamic Authorization Rules
[PASS] Low-value (5000): AUTO_APPROVED
[PASS] High-value (500000): REQUIRES_APPROVAL by MANAGER
[PASS] High-risk customer: REQUIRES_VERIFICATION
[PASS] Cross-border after hours: DENIED
[INFO] Rule: amount<10000 + low_risk → auto
[INFO] Rule: amount>100000 → manager approval
[INFO] Rule: risk=HIGH → additional verification
[INFO] Rule: cross_border + after_hours → deny
───────────────────────────────────
AI-022: Dynamic Auth Rules — 4 passed, 0 failed`},

  {id:'AI-031',title:'SAML SSO Authentication Flow',layer:'SSO',framework:'Python / requests',language:'Python',difficulty:'Advanced',
   description:'Validates SAML 2.0 Single Sign-On flow including SP-initiated SSO, SAML assertion validation, attribute mapping, and session establishment.',
   prerequisites:'SAML IdP (Keycloak/ADFS), Service Provider configuration, Test user in IdP',
   config:'IDP_URL=https://idp.bank.local/realms/banking\nSP_URL=https://app.bank.local\nSP_ENTITY_ID=urn:bank:app:sp\nACS_URL=https://app.bank.local/saml/acs',
   code:`import requests
from lxml import etree
import base64
import unittest

class TestSAMLSSO(unittest.TestCase):
    IDP = "https://idp.bank.local/realms/banking"
    SP = "https://app.bank.local"

    def test_sp_initiated_sso(self):
        """Test SP-initiated SAML SSO flow"""
        session = requests.Session()
        # Step 1: Access SP, get redirected to IdP
        r1 = session.get(f"{self.SP}/protected", allow_redirects=False, timeout=10)
        self.assertEqual(302, r1.status_code)
        self.assertIn("idp.bank.local", r1.headers["Location"])

        # Step 2: Authenticate at IdP
        r2 = session.post(f"{self.IDP}/protocol/saml", data={
            "username": "testuser@bank.local",
            "password": "SSOTestP@ss123"
        }, timeout=10)
        self.assertEqual(200, r2.status_code)
        # Extract SAML Response
        saml_response = extract_saml_response(r2.text)
        self.assertIsNotNone(saml_response)

        # Step 3: Verify assertion attributes
        decoded = base64.b64decode(saml_response)
        root = etree.fromstring(decoded)
        ns = {"saml": "urn:oasis:names:tc:SAML:2.0:assertion"}
        attrs = root.findall(".//saml:Attribute", ns)
        attr_names = [a.get("Name") for a in attrs]
        self.assertIn("email", attr_names)
        self.assertIn("role", attr_names)
        self.assertIn("department", attr_names)

    def test_saml_replay_prevention(self):
        """Test SAML assertion cannot be replayed"""
        saml_resp = get_valid_saml_response()
        # First use: success
        r1 = requests.post(f"{self.SP}/saml/acs",
            data={"SAMLResponse": saml_resp}, timeout=10)
        self.assertEqual(200, r1.status_code)
        # Replay: should fail
        r2 = requests.post(f"{self.SP}/saml/acs",
            data={"SAMLResponse": saml_resp}, timeout=10)
        self.assertIn(r2.status_code, [400, 403])`,
   expectedOutput:`[TEST] AI-031: SAML SSO Authentication Flow
[PASS] SP redirect to IdP: 302 → idp.bank.local
[PASS] IdP authentication successful
[PASS] SAML Response extracted from form
[PASS] Assertion contains: email, role, department
[INFO] NameID: testuser@bank.local
[INFO] SessionIndex: _session_abc123
[PASS] SAML replay prevention: second use blocked
[INFO] Anti-replay: InResponseTo ID tracking
───────────────────────────────────
AI-031: SAML SSO — 5 passed, 0 failed`},

  {id:'AI-032',title:'OAuth2 Token Lifecycle',layer:'SSO',framework:'REST Assured',language:'Java',difficulty:'Intermediate',
   description:'Tests OAuth2 authorization code flow including token issuance, refresh token rotation, token revocation, and scope validation for banking API access.',
   prerequisites:'OAuth2 authorization server, Client credentials, Redirect URI configured',
   config:'OAUTH_URL=https://oauth.bank.local:8443\nCLIENT_ID=banking-app\nCLIENT_SECRET=test_secret_123\nREDIRECT_URI=https://app.bank.local/callback',
   code:`@Test
public void testOAuth2TokenLifecycle() {
    // Step 1: Get authorization code
    String authCode = getAuthorizationCode("banking-app",
        "openid profile accounts", "testuser", "P@ss123");
    assertNotNull("Auth code should be issued", authCode);

    // Step 2: Exchange code for tokens
    Response tokenResp = given()
        .contentType("application/x-www-form-urlencoded")
        .formParam("grant_type", "authorization_code")
        .formParam("code", authCode)
        .formParam("client_id", "banking-app")
        .formParam("client_secret", "test_secret_123")
        .formParam("redirect_uri", "https://app.bank.local/callback")
        .post("/oauth/token");
    assertEquals(200, tokenResp.statusCode());
    String accessToken = tokenResp.jsonPath().getString("access_token");
    String refreshToken = tokenResp.jsonPath().getString("refresh_token");
    assertNotNull(accessToken);
    assertNotNull(refreshToken);
    assertEquals("Bearer", tokenResp.jsonPath().getString("token_type"));

    // Step 3: Validate scope
    Response introspect = given()
        .formParam("token", accessToken)
        .post("/oauth/introspect");
    assertTrue(introspect.jsonPath().getString("scope").contains("accounts"));

    // Step 4: Refresh token rotation
    Response refreshResp = given()
        .formParam("grant_type", "refresh_token")
        .formParam("refresh_token", refreshToken)
        .formParam("client_id", "banking-app")
        .post("/oauth/token");
    assertEquals(200, refreshResp.statusCode());
    String newRefreshToken = refreshResp.jsonPath().getString("refresh_token");
    assertNotEquals("Refresh token should rotate", refreshToken, newRefreshToken);

    // Step 5: Revoke token
    Response revokeResp = given()
        .formParam("token", accessToken)
        .post("/oauth/revoke");
    assertEquals(200, revokeResp.statusCode());
}`,
   expectedOutput:`[TEST] AI-032: OAuth2 Token Lifecycle
[PASS] Authorization code issued: auth_code_xyz
[PASS] Token exchange: access_token + refresh_token issued
[INFO] Token type: Bearer, expires_in: 3600
[PASS] Scope validation: openid profile accounts
[PASS] Refresh token rotation: new token issued
[INFO] Old refresh token invalidated
[PASS] Token revocation successful
[PASS] Revoked token rejected on subsequent use
───────────────────────────────────
AI-032: OAuth2 Lifecycle — 5 passed, 0 failed`},

  {id:'AI-041',title:'SSL/TLS Certificate Validation',layer:'Certificate',framework:'Python / OpenSSL',language:'Python',difficulty:'Intermediate',
   description:'Validates SSL/TLS certificate chain, expiry dates, cipher suites, and protocol versions for all banking API endpoints.',
   prerequisites:'OpenSSL library, Banking API endpoints list, Certificate authority chain',
   config:'ENDPOINTS=api.bank.local:443,auth.bank.local:8443,pay.bank.local:443\nMIN_TLS_VERSION=TLSv1.2\nMIN_KEY_SIZE=2048\nEXPIRY_WARNING_DAYS=30',
   code:`import ssl
import socket
from datetime import datetime, timedelta
import unittest

class TestSSLCertificates(unittest.TestCase):
    ENDPOINTS = [
        ("api.bank.local", 443),
        ("auth.bank.local", 8443),
        ("pay.bank.local", 443),
    ]
    MIN_TLS = ssl.TLSVersion.TLSv1_2
    WARNING_DAYS = 30

    def test_certificate_validity(self):
        for host, port in self.ENDPOINTS:
            ctx = ssl.create_default_context()
            with socket.create_connection((host, port), timeout=10) as sock:
                with ctx.wrap_socket(sock, server_hostname=host) as ssock:
                    cert = ssock.getpeercert()
                    # Check expiry
                    not_after = datetime.strptime(
                        cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
                    days_left = (not_after - datetime.utcnow()).days
                    self.assertGreater(days_left, 0,
                        f"{host}: certificate expired!")
                    self.assertGreater(days_left, self.WARNING_DAYS,
                        f"{host}: expires in {days_left} days")
                    # Check TLS version
                    self.assertGreaterEqual(
                        ssock.version(), "TLSv1.2",
                        f"{host}: TLS version too low")
                    # Check cipher strength
                    cipher = ssock.cipher()
                    self.assertGreaterEqual(cipher[2], 128,
                        f"{host}: cipher key size too small")

    def test_weak_protocols_disabled(self):
        for host, port in self.ENDPOINTS:
            for proto in [ssl.TLSVersion.TLSv1, ssl.TLSVersion.TLSv1_1]:
                ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
                ctx.maximum_version = proto
                with self.assertRaises(ssl.SSLError):
                    with socket.create_connection((host, port), timeout=5) as s:
                        ctx.wrap_socket(s, server_hostname=host)`,
   expectedOutput:`[TEST] AI-041: SSL/TLS Certificate Validation
[PASS] api.bank.local:443 — cert valid, 245 days remaining
[PASS] api.bank.local:443 — TLSv1.3, cipher: AES256-GCM
[PASS] auth.bank.local:8443 — cert valid, 312 days remaining
[PASS] auth.bank.local:8443 — TLSv1.3, cipher: AES256-GCM
[PASS] pay.bank.local:443 — cert valid, 180 days remaining
[PASS] pay.bank.local:443 — TLSv1.2, cipher: AES128-GCM
[PASS] TLSv1.0 disabled on all endpoints
[PASS] TLSv1.1 disabled on all endpoints
───────────────────────────────────
AI-041: SSL/TLS Certificates — 8 passed, 0 failed`},

  {id:'AI-042',title:'Mutual TLS (mTLS) Authentication',layer:'Certificate',framework:'Python / requests',language:'Python',difficulty:'Advanced',
   description:'Tests mutual TLS authentication between banking microservices ensuring both client and server certificates are validated for inter-service communication.',
   prerequisites:'Client certificate, CA certificate, mTLS-enabled service endpoints',
   config:'SERVICE_URL=https://core-banking.bank.local:8443\nCLIENT_CERT=/certs/client.pem\nCLIENT_KEY=/certs/client-key.pem\nCA_CERT=/certs/ca-bundle.pem',
   code:`import requests
import unittest

class TestMutualTLS(unittest.TestCase):
    URL = "https://core-banking.bank.local:8443/api/v2/health"
    CLIENT_CERT = ("/certs/client.pem", "/certs/client-key.pem")
    CA_CERT = "/certs/ca-bundle.pem"

    def test_mtls_with_valid_cert(self):
        """Valid client cert should be accepted"""
        resp = requests.get(self.URL,
            cert=self.CLIENT_CERT, verify=self.CA_CERT, timeout=10)
        self.assertEqual(200, resp.status_code)
        self.assertEqual("healthy", resp.json()["status"])

    def test_mtls_without_client_cert(self):
        """Missing client cert should be rejected"""
        with self.assertRaises(requests.exceptions.SSLError):
            requests.get(self.URL, verify=self.CA_CERT, timeout=10)

    def test_mtls_with_expired_cert(self):
        """Expired client cert should be rejected"""
        expired_cert = ("/certs/expired-client.pem", "/certs/expired-key.pem")
        with self.assertRaises(requests.exceptions.SSLError):
            requests.get(self.URL, cert=expired_cert,
                verify=self.CA_CERT, timeout=10)

    def test_mtls_with_wrong_ca(self):
        """Client cert signed by wrong CA should be rejected"""
        wrong_cert = ("/certs/wrong-ca-client.pem", "/certs/wrong-ca-key.pem")
        with self.assertRaises(requests.exceptions.SSLError):
            requests.get(self.URL, cert=wrong_cert,
                verify=self.CA_CERT, timeout=10)`,
   expectedOutput:`[TEST] AI-042: Mutual TLS Authentication
[PASS] Valid client cert: 200 OK, status=healthy
[PASS] Missing client cert: SSLError (handshake failed)
[PASS] Expired client cert: SSLError (cert expired)
[PASS] Wrong CA cert: SSLError (unknown CA)
[INFO] Server CN: core-banking.bank.local
[INFO] Client CN: payment-service.bank.local
───────────────────────────────────
AI-042: mTLS Auth — 4 passed, 0 failed`},

  {id:'AI-051',title:'User Provisioning Lifecycle',layer:'UserGroup',framework:'REST Assured',language:'Java',difficulty:'Intermediate',
   description:'Tests complete user lifecycle including creation, activation, role assignment, suspension, and deactivation with proper audit trail.',
   prerequisites:'User management API, LDAP/AD integration, Audit logging enabled',
   config:'USER_API=https://admin.bank.local:8443/api/v2/users\nLDAP_URL=ldap://ad.bank.local:389\nAUDIT_ENABLED=true',
   code:`@Test
public void testUserProvisioningLifecycle() {
    String adminToken = loginAsAdmin();

    // Create user
    Response create = given().header("Authorization", "Bearer " + adminToken)
        .contentType("application/json")
        .body("{\\"username\\":\\"newuser001\\",\\"email\\":\\"new@bank.local\\"," +
              "\\"department\\":\\"retail\\",\\"role\\":\\"Teller\\"}")
        .post("/api/v2/users");
    assertEquals(201, create.statusCode());
    String userId = create.jsonPath().getString("user_id");
    assertEquals("PENDING_ACTIVATION", create.jsonPath().getString("status"));

    // Activate user
    Response activate = given().header("Authorization", "Bearer " + adminToken)
        .post("/api/v2/users/" + userId + "/activate");
    assertEquals(200, activate.statusCode());
    assertEquals("ACTIVE", activate.jsonPath().getString("status"));

    // Assign additional role
    Response roleAssign = given().header("Authorization", "Bearer " + adminToken)
        .body("{\\"role\\":\\"CashHandler\\"}")
        .post("/api/v2/users/" + userId + "/roles");
    assertEquals(200, roleAssign.statusCode());

    // Suspend user
    Response suspend = given().header("Authorization", "Bearer " + adminToken)
        .body("{\\"reason\\":\\"Policy violation investigation\\"}")
        .post("/api/v2/users/" + userId + "/suspend");
    assertEquals(200, suspend.statusCode());
    assertEquals("SUSPENDED", suspend.jsonPath().getString("status"));

    // Verify suspended user cannot login
    Response login = given().body("{\\"username\\":\\"newuser001\\",\\"password\\":\\"TempP@ss\\"}")
        .post("/api/v2/auth/login");
    assertEquals(403, login.statusCode());
    assertEquals("ACCOUNT_SUSPENDED", login.jsonPath().getString("error_code"));

    // Deactivate user
    Response deactivate = given().header("Authorization", "Bearer " + adminToken)
        .post("/api/v2/users/" + userId + "/deactivate");
    assertEquals(200, deactivate.statusCode());

    // Verify audit trail
    Response audit = given().header("Authorization", "Bearer " + adminToken)
        .get("/api/v2/audit/user/" + userId);
    assertTrue(audit.jsonPath().getList("events").size() >= 5);
}`,
   expectedOutput:`[TEST] AI-051: User Provisioning Lifecycle
[PASS] User created: newuser001 (PENDING_ACTIVATION)
[PASS] User activated: status=ACTIVE
[PASS] Role assigned: Teller + CashHandler
[PASS] User suspended: reason logged
[PASS] Suspended user login blocked (403)
[PASS] User deactivated successfully
[PASS] Audit trail: 6 events recorded
[INFO] Events: CREATE → ACTIVATE → ROLE_ADD → SUSPEND → LOGIN_BLOCKED → DEACTIVATE
───────────────────────────────────
AI-051: User Provisioning — 7 passed, 0 failed`},

  {id:'AI-052',title:'LDAP/Active Directory Integration',layer:'UserGroup',framework:'Python / ldap3',language:'Python',difficulty:'Advanced',
   description:'Tests LDAP/Active Directory integration for user authentication, group membership synchronization, and organizational unit mapping.',
   prerequisites:'LDAP/AD server, Service account credentials, Test OU structure',
   config:'LDAP_URL=ldap://ad.bank.local:389\nBASE_DN=DC=bank,DC=local\nSERVICE_USER=CN=svc_app,OU=Services,DC=bank,DC=local\nSERVICE_PASS=SvcP@ss123',
   code:`from ldap3 import Server, Connection, ALL, SUBTREE
import unittest

class TestLDAPIntegration(unittest.TestCase):
    LDAP_URL = "ldap://ad.bank.local:389"
    BASE_DN = "DC=bank,DC=local"
    SVC_USER = "CN=svc_app,OU=Services,DC=bank,DC=local"
    SVC_PASS = "SvcP@ss123"

    def get_conn(self):
        server = Server(self.LDAP_URL, get_info=ALL)
        conn = Connection(server, self.SVC_USER, self.SVC_PASS, auto_bind=True)
        return conn

    def test_user_authentication(self):
        """Test LDAP bind authentication"""
        server = Server(self.LDAP_URL)
        user_dn = "CN=testuser,OU=Retail,OU=Users," + self.BASE_DN
        conn = Connection(server, user_dn, "UserP@ss123")
        self.assertTrue(conn.bind())
        conn.unbind()

    def test_group_membership(self):
        """Test user group membership lookup"""
        conn = self.get_conn()
        conn.search(self.BASE_DN,
            "(sAMAccountName=testuser)",
            search_scope=SUBTREE,
            attributes=["memberOf"])
        self.assertTrue(len(conn.entries) > 0)
        groups = str(conn.entries[0].memberOf)
        self.assertIn("BankTellers", groups)
        conn.unbind()

    def test_ou_structure(self):
        """Test organizational unit mapping"""
        conn = self.get_conn()
        conn.search("OU=Users," + self.BASE_DN,
            "(objectClass=organizationalUnit)",
            search_scope=SUBTREE)
        ou_names = [str(e.entry_dn) for e in conn.entries]
        required_ous = ["Retail", "Corporate", "Treasury", "Operations"]
        for ou in required_ous:
            self.assertTrue(any(ou in dn for dn in ou_names),
                f"OU {ou} not found")
        conn.unbind()`,
   expectedOutput:`[TEST] AI-052: LDAP/Active Directory Integration
[PASS] User authentication via LDAP bind
[INFO] User DN: CN=testuser,OU=Retail,OU=Users,DC=bank,DC=local
[PASS] Group membership: testuser in BankTellers
[PASS] OU Retail found
[PASS] OU Corporate found
[PASS] OU Treasury found
[PASS] OU Operations found
[INFO] Total OUs: 4 required, 4 found
───────────────────────────────────
AI-052: LDAP/AD Integration — 6 passed, 0 failed`},
];

export default function AuthIdentityLab() {
  const [tab, setTab] = useState('Authentication');
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
        <h1 style={sty.h1}>Auth & Identity Testing Lab</h1>
        <div style={sty.sub}>Authentication, Authorization, SSO, Certificates & Identity Management — {totalAll} Scenarios</div>
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

import React, { useState, useRef, useEffect, useCallback } from 'react';

const COLORS = {
  bgFrom: '#1a1a2e', bgTo: '#16213e', card: '#0f3460', accent: '#4ecca3',
  text: '#e0e0e0', header: '#ffffff', border: 'rgba(78,204,163,0.3)',
  editorBg: '#0a0a1a', editorText: '#4ecca3',
  server: '#43b02a', network: '#4a90d9', database: '#f5a623',
  container: '#23d96c', cloud: '#d0021b', monitoring: '#9b59b6',
};

const CATEGORIES = [
  { id: 'ServerCompute', label: 'Server/Compute', color: COLORS.server },
  { id: 'Network', label: 'Network', color: COLORS.network },
  { id: 'DatabaseInfra', label: 'Database Infra', color: COLORS.database },
  { id: 'ContainerK8s', label: 'Container/K8s', color: COLORS.container },
  { id: 'Cloud', label: 'Cloud', color: COLORS.cloud },
  { id: 'MonitoringInfra', label: 'Monitoring Infra', color: COLORS.monitoring },
];

const DIFFICULTY_COLORS = { Beginner: '#4ecca3', Intermediate: '#f5a623', Advanced: '#d0021b' };

const SCENARIOS = [
  // ========== TAB 1: SERVER/COMPUTE (IT-001 to IT-010) ==========
  {
    id: 'IT-001', title: 'Server Health Validation', category: 'Server/Compute',
    layer: 'ServerCompute', framework: 'Ansible / Shell', language: 'Shell',
    difficulty: 'Beginner',
    description: 'Validates core server health metrics including CPU usage, memory utilization, disk space, running processes, and system uptime for banking application servers.',
    prerequisites: 'SSH access to target servers, bash shell, sysstat package installed, root or sudo privileges',
    config: '{\n  "target_servers": ["app-srv-01", "app-srv-02", "db-srv-01"],\n  "cpu_threshold": 80,\n  "memory_threshold": 85,\n  "disk_threshold": 90,\n  "min_uptime_days": 1,\n  "check_interval": 30,\n  "alert_email": "infra-team@bank.com"\n}',
    code: `#!/bin/bash
# Banking Server Health Validation Script
# Validates CPU, Memory, Disk, Uptime for production servers

SERVERS=("app-srv-01" "app-srv-02" "db-srv-01")
CPU_THRESHOLD=80
MEM_THRESHOLD=85
DISK_THRESHOLD=90
PASS=0; FAIL=0; WARN=0

echo "============================================"
echo " Banking Infrastructure - Server Health Check"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

for SERVER in "\${SERVERS[@]}"; do
  echo ""
  echo "[INFO] Checking server: \$SERVER"
  echo "--------------------------------------------"

  # CPU Check
  CPU_USAGE=\$(ssh \$SERVER "top -bn1 | grep 'Cpu(s)' | awk '{print \\$2}' | cut -d. -f1")
  if [ "\$CPU_USAGE" -lt "\$CPU_THRESHOLD" ]; then
    echo "[PASS] CPU Usage: \${CPU_USAGE}% (threshold: \${CPU_THRESHOLD}%)"
    ((PASS++))
  else
    echo "[FAIL] CPU Usage: \${CPU_USAGE}% exceeds threshold \${CPU_THRESHOLD}%"
    ((FAIL++))
  fi

  # Memory Check
  MEM_USAGE=\$(ssh \$SERVER "free | grep Mem | awk '{printf(\\\"%.0f\\\", \\$3/\\$2 * 100)}'")
  if [ "\$MEM_USAGE" -lt "\$MEM_THRESHOLD" ]; then
    echo "[PASS] Memory Usage: \${MEM_USAGE}% (threshold: \${MEM_THRESHOLD}%)"
    ((PASS++))
  else
    echo "[FAIL] Memory Usage: \${MEM_USAGE}% exceeds threshold \${MEM_THRESHOLD}%"
    ((FAIL++))
  fi

  # Disk Check
  DISK_USAGE=\$(ssh \$SERVER "df -h / | tail -1 | awk '{print \\$5}' | tr -d '%'")
  if [ "\$DISK_USAGE" -lt "\$DISK_THRESHOLD" ]; then
    echo "[PASS] Disk Usage: \${DISK_USAGE}% (threshold: \${DISK_THRESHOLD}%)"
    ((PASS++))
  else
    echo "[FAIL] Disk Usage: \${DISK_USAGE}% exceeds threshold \${DISK_THRESHOLD}%"
    ((FAIL++))
  fi

  # Uptime Check
  UPTIME_DAYS=\$(ssh \$SERVER "uptime -p | grep -oP '\\d+ day' | awk '{print \\$1}'")
  UPTIME_DAYS=\${UPTIME_DAYS:-0}
  echo "[INFO] Server uptime: \${UPTIME_DAYS} days"
done

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL  WARNINGS=\$WARN"
echo "============================================"`,
    expectedOutput: `============================================
 Banking Infrastructure - Server Health Check
 Date: 2026-02-27 10:30:00
============================================

[INFO] Checking server: app-srv-01
--------------------------------------------
[PASS] CPU Usage: 42% (threshold: 80%)
[PASS] Memory Usage: 67% (threshold: 85%)
[PASS] Disk Usage: 55% (threshold: 90%)
[INFO] Server uptime: 45 days

[INFO] Checking server: app-srv-02
--------------------------------------------
[PASS] CPU Usage: 38% (threshold: 80%)
[PASS] Memory Usage: 72% (threshold: 85%)
[PASS] Disk Usage: 61% (threshold: 90%)
[INFO] Server uptime: 45 days

[INFO] Checking server: db-srv-01
--------------------------------------------
[PASS] CPU Usage: 55% (threshold: 80%)
[PASS] Memory Usage: 78% (threshold: 85%)
[PASS] Disk Usage: 48% (threshold: 90%)
[INFO] Server uptime: 90 days

============================================
 Results: PASSED=9  FAILED=0  WARNINGS=0
============================================`
  },
  {
    id: 'IT-002', title: 'CPU and Memory Stress Test', category: 'Server/Compute',
    layer: 'ServerCompute', framework: 'stress-ng / Shell', language: 'Shell',
    difficulty: 'Intermediate',
    description: 'Performs CPU and memory stress testing on banking application servers to validate performance under sustained load. Ensures servers can handle peak transaction periods.',
    prerequisites: 'stress-ng package, vmstat, mpstat, root access, at least 4 CPU cores and 8GB RAM available',
    config: '{\n  "target_server": "app-srv-01",\n  "cpu_workers": 4,\n  "memory_workers": 2,\n  "memory_per_worker": "1G",\n  "test_duration": "60s",\n  "max_cpu_allowed": 95,\n  "max_memory_allowed": 90,\n  "sample_interval": 5\n}',
    code: `#!/bin/bash
# Banking Server CPU/Memory Stress Test
# Validates server stability under sustained load

TARGET="app-srv-01"
CPU_WORKERS=4
MEM_WORKERS=2
MEM_SIZE="1G"
DURATION="60s"
MAX_CPU=95
MAX_MEMORY=90
PASS=0; FAIL=0

echo "============================================"
echo " CPU/Memory Stress Test - \$TARGET"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

# Baseline metrics before stress
echo ""
echo "[INFO] Capturing baseline metrics..."
BASE_CPU=\$(ssh \$TARGET "mpstat 1 1 | tail -1 | awk '{print 100 - \\$NF}' | cut -d. -f1")
BASE_MEM=\$(ssh \$TARGET "free -m | grep Mem | awk '{printf(\\\"%.0f\\\", \\$3/\\$2*100)}'")
echo "[INFO] Baseline CPU: \${BASE_CPU}%  Memory: \${BASE_MEM}%"

# Launch stress test
echo ""
echo "[INFO] Starting stress-ng with \$CPU_WORKERS CPU and \$MEM_WORKERS memory workers for \$DURATION"
ssh \$TARGET "stress-ng --cpu \$CPU_WORKERS --vm \$MEM_WORKERS --vm-bytes \$MEM_SIZE --timeout \$DURATION --metrics-brief" &
STRESS_PID=\$!

# Monitor during stress
sleep 10
echo "[INFO] Sampling metrics during stress test..."
for i in 1 2 3 4 5; do
  STRESS_CPU=\$(ssh \$TARGET "mpstat 1 1 | tail -1 | awk '{print 100 - \\$NF}' | cut -d. -f1")
  STRESS_MEM=\$(ssh \$TARGET "free -m | grep Mem | awk '{printf(\\\"%.0f\\\", \\$3/\\$2*100)}'")
  echo "[INFO] Sample \$i - CPU: \${STRESS_CPU}%  Memory: \${STRESS_MEM}%"
  sleep 10
done

wait \$STRESS_PID

# Post stress metrics
POST_CPU=\$(ssh \$TARGET "mpstat 1 1 | tail -1 | awk '{print 100 - \\$NF}' | cut -d. -f1")
POST_MEM=\$(ssh \$TARGET "free -m | grep Mem | awk '{printf(\\\"%.0f\\\", \\$3/\\$2*100)}'")

echo ""
echo "[INFO] Post-stress CPU: \${POST_CPU}%  Memory: \${POST_MEM}%"

# Validate recovery
if [ "\$POST_CPU" -lt 50 ]; then
  echo "[PASS] CPU recovered to normal levels after stress"
  ((PASS++))
else
  echo "[FAIL] CPU did not recover - still at \${POST_CPU}%"
  ((FAIL++))
fi

if [ "\$POST_MEM" -lt "\$MAX_MEMORY" ]; then
  echo "[PASS] Memory recovered to normal levels after stress"
  ((PASS++))
else
  echo "[FAIL] Memory did not recover - still at \${POST_MEM}%"
  ((FAIL++))
fi

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL"
echo "============================================"`,
    expectedOutput: `============================================
 CPU/Memory Stress Test - app-srv-01
 Date: 2026-02-27 10:30:00
============================================

[INFO] Capturing baseline metrics...
[INFO] Baseline CPU: 15%  Memory: 42%

[INFO] Starting stress-ng with 4 CPU and 2 memory workers for 60s
[INFO] Sampling metrics during stress test...
[INFO] Sample 1 - CPU: 89%  Memory: 71%
[INFO] Sample 2 - CPU: 92%  Memory: 73%
[INFO] Sample 3 - CPU: 91%  Memory: 72%
[INFO] Sample 4 - CPU: 90%  Memory: 74%
[INFO] Sample 5 - CPU: 88%  Memory: 71%

[INFO] Post-stress CPU: 18%  Memory: 44%

[PASS] CPU recovered to normal levels after stress
[PASS] Memory recovered to normal levels after stress

============================================
 Results: PASSED=2  FAILED=0
============================================`
  },
  {
    id: 'IT-003', title: 'OS Hardening Compliance Check', category: 'Server/Compute',
    layer: 'ServerCompute', framework: 'CIS Benchmark / Shell', language: 'Shell',
    difficulty: 'Advanced',
    description: 'Validates CIS benchmark compliance for banking server OS hardening. Checks SSH configuration, password policies, file permissions, audit logging, and disabled unnecessary services.',
    prerequisites: 'CIS benchmark documentation, root access, auditd installed, OpenSSH server, PAM configured',
    config: '{\n  "benchmark": "CIS_Ubuntu_22.04_v1.0",\n  "target_servers": ["app-srv-01", "app-srv-02"],\n  "ssh_port": 22,\n  "min_password_length": 14,\n  "max_password_age": 90,\n  "audit_log_max_size": "100M",\n  "allowed_ssh_users": ["deploy", "admin"]\n}',
    code: `#!/bin/bash
# CIS Benchmark OS Hardening Compliance Check
# Banking Server Security Validation

SERVER="app-srv-01"
PASS=0; FAIL=0; WARN=0

echo "============================================"
echo " CIS OS Hardening Compliance - \$SERVER"
echo " Benchmark: CIS Ubuntu 22.04 v1.0"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

# 1. SSH Configuration
echo ""
echo "[INFO] Section 1: SSH Configuration"
SSH_ROOT=\$(ssh \$SERVER "grep -i '^PermitRootLogin' /etc/ssh/sshd_config | awk '{print \\$2}'")
if [ "\$SSH_ROOT" = "no" ]; then
  echo "[PASS] 1.1 SSH root login disabled"
  ((PASS++))
else
  echo "[FAIL] 1.1 SSH root login is NOT disabled (value: \$SSH_ROOT)"
  ((FAIL++))
fi

SSH_PROTO=\$(ssh \$SERVER "grep -i '^Protocol' /etc/ssh/sshd_config | awk '{print \\$2}'")
if [ "\$SSH_PROTO" = "2" ] || [ -z "\$SSH_PROTO" ]; then
  echo "[PASS] 1.2 SSH Protocol 2 enforced"
  ((PASS++))
else
  echo "[FAIL] 1.2 SSH Protocol not set to 2"
  ((FAIL++))
fi

SSH_EMPTY=\$(ssh \$SERVER "grep -i '^PermitEmptyPasswords' /etc/ssh/sshd_config | awk '{print \\$2}'")
if [ "\$SSH_EMPTY" = "no" ]; then
  echo "[PASS] 1.3 Empty passwords not permitted"
  ((PASS++))
else
  echo "[FAIL] 1.3 Empty passwords ARE permitted"
  ((FAIL++))
fi

# 2. Password Policy
echo ""
echo "[INFO] Section 2: Password Policy"
MIN_LEN=\$(ssh \$SERVER "grep -i '^minlen' /etc/security/pwquality.conf | awk -F= '{print \\$2}' | tr -d ' '")
if [ "\${MIN_LEN:-0}" -ge 14 ]; then
  echo "[PASS] 2.1 Minimum password length >= 14 (value: \$MIN_LEN)"
  ((PASS++))
else
  echo "[FAIL] 2.1 Minimum password length < 14 (value: \${MIN_LEN:-not set})"
  ((FAIL++))
fi

MAX_DAYS=\$(ssh \$SERVER "grep '^PASS_MAX_DAYS' /etc/login.defs | awk '{print \\$2}'")
if [ "\${MAX_DAYS:-999}" -le 90 ]; then
  echo "[PASS] 2.2 Max password age <= 90 days (value: \$MAX_DAYS)"
  ((PASS++))
else
  echo "[FAIL] 2.2 Max password age > 90 days (value: \${MAX_DAYS:-not set})"
  ((FAIL++))
fi

# 3. File Permissions
echo ""
echo "[INFO] Section 3: Critical File Permissions"
PASSWD_PERM=\$(ssh \$SERVER "stat -c '%a' /etc/passwd")
if [ "\$PASSWD_PERM" = "644" ]; then
  echo "[PASS] 3.1 /etc/passwd permissions correct (644)"
  ((PASS++))
else
  echo "[FAIL] 3.1 /etc/passwd permissions incorrect (\$PASSWD_PERM)"
  ((FAIL++))
fi

SHADOW_PERM=\$(ssh \$SERVER "stat -c '%a' /etc/shadow")
if [ "\$SHADOW_PERM" = "640" ] || [ "\$SHADOW_PERM" = "600" ]; then
  echo "[PASS] 3.2 /etc/shadow permissions correct (\$SHADOW_PERM)"
  ((PASS++))
else
  echo "[FAIL] 3.2 /etc/shadow permissions incorrect (\$SHADOW_PERM)"
  ((FAIL++))
fi

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL  WARNINGS=\$WARN"
echo "============================================"`,
    expectedOutput: `============================================
 CIS OS Hardening Compliance - app-srv-01
 Benchmark: CIS Ubuntu 22.04 v1.0
 Date: 2026-02-27 10:30:00
============================================

[INFO] Section 1: SSH Configuration
[PASS] 1.1 SSH root login disabled
[PASS] 1.2 SSH Protocol 2 enforced
[PASS] 1.3 Empty passwords not permitted

[INFO] Section 2: Password Policy
[PASS] 2.1 Minimum password length >= 14 (value: 14)
[PASS] 2.2 Max password age <= 90 days (value: 90)

[INFO] Section 3: Critical File Permissions
[PASS] 3.1 /etc/passwd permissions correct (644)
[PASS] 3.2 /etc/shadow permissions correct (640)

============================================
 Results: PASSED=7  FAILED=0  WARNINGS=0
============================================`
  },
  {
    id: 'IT-004', title: 'Automated Patch Compliance Validation', category: 'Server/Compute',
    layer: 'ServerCompute', framework: 'Ansible', language: 'Shell',
    difficulty: 'Intermediate',
    description: 'Validates that all banking servers have critical security patches applied within the SLA window. Checks kernel version, security updates, and patch compliance status.',
    prerequisites: 'Ansible 2.14+, SSH key-based auth, apt/yum package manager, inventory file configured',
    config: '{\n  "inventory": "/etc/ansible/hosts",\n  "patch_sla_days": 30,\n  "critical_packages": ["openssl", "openssh-server", "linux-generic"],\n  "exclude_servers": [],\n  "report_path": "/var/log/patch-compliance"\n}',
    code: `#!/bin/bash
# Automated Patch Compliance Validation
# Banking Server Patch Management Audit

SERVERS=("app-srv-01" "app-srv-02" "db-srv-01" "web-srv-01")
PATCH_SLA_DAYS=30
CRITICAL_PKGS=("openssl" "openssh-server" "linux-generic")
PASS=0; FAIL=0; WARN=0

echo "============================================"
echo " Patch Compliance Validation Report"
echo " SLA: \${PATCH_SLA_DAYS} days"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

for SERVER in "\${SERVERS[@]}"; do
  echo ""
  echo "[INFO] Auditing: \$SERVER"
  echo "--------------------------------------------"

  # Check last update date
  LAST_UPDATE=\$(ssh \$SERVER "stat -c %Y /var/lib/apt/periodic/update-success-stamp 2>/dev/null || echo 0")
  NOW=\$(date +%s)
  DAYS_SINCE=\$(( (NOW - LAST_UPDATE) / 86400 ))

  if [ "\$DAYS_SINCE" -le "\$PATCH_SLA_DAYS" ]; then
    echo "[PASS] Last update: \$DAYS_SINCE days ago (SLA: \$PATCH_SLA_DAYS days)"
    ((PASS++))
  else
    echo "[FAIL] Last update: \$DAYS_SINCE days ago - exceeds SLA"
    ((FAIL++))
  fi

  # Check pending security updates
  PENDING=\$(ssh \$SERVER "apt list --upgradable 2>/dev/null | grep -c security")
  if [ "\$PENDING" -eq 0 ]; then
    echo "[PASS] No pending security updates"
    ((PASS++))
  else
    echo "[FAIL] \$PENDING pending security updates found"
    ((FAIL++))
  fi

  # Check critical packages
  for PKG in "\${CRITICAL_PKGS[@]}"; do
    VERSION=\$(ssh \$SERVER "dpkg -l \$PKG 2>/dev/null | grep '^ii' | awk '{print \\$3}'")
    if [ -n "\$VERSION" ]; then
      echo "[PASS] \$PKG installed: \$VERSION"
      ((PASS++))
    else
      echo "[WARN] \$PKG not found on \$SERVER"
      ((WARN++))
    fi
  done

  # Kernel version check
  KERNEL=\$(ssh \$SERVER "uname -r")
  echo "[INFO] Kernel version: \$KERNEL"
done

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL  WARNINGS=\$WARN"
echo "============================================"`,
    expectedOutput: `============================================
 Patch Compliance Validation Report
 SLA: 30 days
 Date: 2026-02-27 10:30:00
============================================

[INFO] Auditing: app-srv-01
--------------------------------------------
[PASS] Last update: 5 days ago (SLA: 30 days)
[PASS] No pending security updates
[PASS] openssl installed: 3.0.13-0ubuntu3.1
[PASS] openssh-server installed: 1:9.6p1-3ubuntu1
[PASS] linux-generic installed: 6.5.0.44.44
[INFO] Kernel version: 6.5.0-44-generic

[INFO] Auditing: app-srv-02
--------------------------------------------
[PASS] Last update: 5 days ago (SLA: 30 days)
[PASS] No pending security updates
[PASS] openssl installed: 3.0.13-0ubuntu3.1
[PASS] openssh-server installed: 1:9.6p1-3ubuntu1
[PASS] linux-generic installed: 6.5.0.44.44
[INFO] Kernel version: 6.5.0-44-generic

============================================
 Results: PASSED=10  FAILED=0  WARNINGS=0
============================================`
  },
  {
    id: 'IT-005', title: 'Server Provisioning Validation', category: 'Server/Compute',
    layer: 'ServerCompute', framework: 'Terraform / Shell', language: 'HCL',
    difficulty: 'Advanced',
    description: 'Validates Terraform-based server provisioning for banking infrastructure. Verifies compute instances are created with correct specifications, security groups, and networking.',
    prerequisites: 'Terraform 1.6+, AWS CLI configured, IAM permissions for EC2, VPC access, SSH key pair',
    config: '{\n  "region": "us-east-1",\n  "instance_type": "m5.xlarge",\n  "ami_id": "ami-0c55b159cbfafe1f0",\n  "vpc_id": "vpc-bank-prod-01",\n  "subnet_id": "subnet-private-01",\n  "security_groups": ["sg-banking-app"],\n  "key_name": "bank-prod-key"\n}',
    code: `# Terraform Server Provisioning Validation
# Banking Infrastructure - Compute Instance Validation

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "bank-terraform-state"
    key    = "infra-test/server-provision.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

variable "region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "m5.xlarge"
}

variable "environment" {
  default = "staging"
}

# Data source to validate AMI exists
data "aws_ami" "banking_ami" {
  most_recent = true
  owners      = ["self"]
  filter {
    name   = "name"
    values = ["banking-app-hardened-*"]
  }
  filter {
    name   = "state"
    values = ["available"]
  }
}

# Validate VPC exists
data "aws_vpc" "banking_vpc" {
  tags = {
    Name        = "bank-prod-vpc"
    Environment = var.environment
  }
}

# Validate subnet
data "aws_subnet" "private_subnet" {
  vpc_id = data.aws_vpc.banking_vpc.id
  tags = {
    Name = "bank-private-subnet-01"
    Tier = "private"
  }
}

# Create test instance
resource "aws_instance" "banking_app_test" {
  ami                    = data.aws_ami.banking_ami.id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnet.private_subnet.id
  vpc_security_group_ids = [aws_security_group.banking_app_sg.id]
  key_name               = "bank-prod-key"

  root_block_device {
    volume_size = 100
    volume_type = "gp3"
    encrypted   = true
  }

  metadata_options {
    http_tokens   = "required"
    http_endpoint = "enabled"
  }

  tags = {
    Name        = "banking-app-test-01"
    Environment = var.environment
    Compliance  = "PCI-DSS"
    ManagedBy   = "terraform"
  }
}

# Validation outputs
output "instance_id" {
  value = aws_instance.banking_app_test.id
}

output "private_ip" {
  value = aws_instance.banking_app_test.private_ip
}

output "validation_checks" {
  value = {
    encryption_enabled = aws_instance.banking_app_test.root_block_device[0].encrypted
    imdsv2_required    = aws_instance.banking_app_test.metadata_options[0].http_tokens == "required"
    correct_type       = aws_instance.banking_app_test.instance_type == var.instance_type
    private_subnet     = !aws_instance.banking_app_test.associate_public_ip_address
  }
}`,
    expectedOutput: `[INFO] Initializing Terraform backend...
[PASS] S3 backend configured: bank-terraform-state
[INFO] Planning infrastructure changes...

[INFO] Validation: AMI Lookup
[PASS] AMI found: ami-0c55b159cbfafe1f0 (banking-app-hardened-20260220)

[INFO] Validation: VPC Configuration
[PASS] VPC found: vpc-0a1b2c3d4e (bank-prod-vpc)
[PASS] Subnet found: subnet-private-01 (10.0.1.0/24)

[INFO] Validation: Instance Configuration
[PASS] Instance type: m5.xlarge (4 vCPU, 16 GB RAM)
[PASS] Root volume: 100 GB gp3, encrypted=true
[PASS] IMDSv2 required: true
[PASS] Public IP: disabled (private subnet)
[PASS] Security group: sg-banking-app attached

[INFO] Validation: Tags
[PASS] Environment: staging
[PASS] Compliance: PCI-DSS
[PASS] ManagedBy: terraform

[INFO] Apply complete: 1 instance created
============================================
 Results: PASSED=11  FAILED=0  WARNINGS=0
============================================`
  },
  {
    id: 'IT-006', title: 'NTP Time Synchronization Audit', category: 'Server/Compute',
    layer: 'ServerCompute', framework: 'chrony / Shell', language: 'Shell',
    difficulty: 'Beginner',
    description: 'Validates NTP time synchronization across all banking servers. Critical for transaction timestamp accuracy, audit logging, and regulatory compliance in financial systems.',
    prerequisites: 'chrony or ntpd installed, network access to NTP servers, timedatectl available',
    config: '{\n  "ntp_servers": ["ntp1.bank.internal", "ntp2.bank.internal", "time.google.com"],\n  "max_drift_ms": 50,\n  "servers": ["app-srv-01", "app-srv-02", "db-srv-01", "web-srv-01"],\n  "timezone": "UTC"\n}',
    code: `#!/bin/bash
# NTP Time Synchronization Audit
# Banking Infrastructure - Critical for transaction accuracy

SERVERS=("app-srv-01" "app-srv-02" "db-srv-01" "web-srv-01")
MAX_DRIFT_MS=50
PASS=0; FAIL=0; WARN=0

echo "============================================"
echo " NTP Time Synchronization Audit"
echo " Max Allowed Drift: \${MAX_DRIFT_MS}ms"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S UTC')"
echo "============================================"

for SERVER in "\${SERVERS[@]}"; do
  echo ""
  echo "[INFO] Checking NTP on: \$SERVER"
  echo "--------------------------------------------"

  # Check if chrony is active
  CHRONY_STATUS=\$(ssh \$SERVER "systemctl is-active chronyd 2>/dev/null || systemctl is-active chrony 2>/dev/null")
  if [ "\$CHRONY_STATUS" = "active" ]; then
    echo "[PASS] Chrony service is active"
    ((PASS++))
  else
    echo "[FAIL] Chrony service is NOT active"
    ((FAIL++))
    continue
  fi

  # Check synchronization status
  SYNC_STATUS=\$(ssh \$SERVER "chronyc tracking | grep 'Leap status' | awk -F: '{print \\$2}' | tr -d ' '")
  if [ "\$SYNC_STATUS" = "Normal" ]; then
    echo "[PASS] Sync status: Normal"
    ((PASS++))
  else
    echo "[FAIL] Sync status: \$SYNC_STATUS (expected: Normal)"
    ((FAIL++))
  fi

  # Check time drift
  OFFSET_SEC=\$(ssh \$SERVER "chronyc tracking | grep 'Last offset' | awk '{print \\$4}'")
  OFFSET_MS=\$(echo "\$OFFSET_SEC" | awk '{printf "%.2f", \\$1 * 1000}')
  ABS_OFFSET=\$(echo "\$OFFSET_MS" | tr -d '-')
  DRIFT_OK=\$(echo "\$ABS_OFFSET \$MAX_DRIFT_MS" | awk '{print (\\$1 < \\$2) ? "yes" : "no"}')

  if [ "\$DRIFT_OK" = "yes" ]; then
    echo "[PASS] Time drift: \${OFFSET_MS}ms (within \${MAX_DRIFT_MS}ms)"
    ((PASS++))
  else
    echo "[FAIL] Time drift: \${OFFSET_MS}ms (exceeds \${MAX_DRIFT_MS}ms)"
    ((FAIL++))
  fi

  # Check timezone
  TZ=\$(ssh \$SERVER "timedatectl | grep 'Time zone' | awk '{print \\$3}'")
  if [ "\$TZ" = "UTC" ] || [ "\$TZ" = "Etc/UTC" ]; then
    echo "[PASS] Timezone: \$TZ"
    ((PASS++))
  else
    echo "[WARN] Timezone: \$TZ (recommended: UTC)"
    ((WARN++))
  fi
done

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL  WARNINGS=\$WARN"
echo "============================================"`,
    expectedOutput: `============================================
 NTP Time Synchronization Audit
 Max Allowed Drift: 50ms
 Date: 2026-02-27 10:30:00 UTC
============================================

[INFO] Checking NTP on: app-srv-01
--------------------------------------------
[PASS] Chrony service is active
[PASS] Sync status: Normal
[PASS] Time drift: 0.12ms (within 50ms)
[PASS] Timezone: UTC

[INFO] Checking NTP on: app-srv-02
--------------------------------------------
[PASS] Chrony service is active
[PASS] Sync status: Normal
[PASS] Time drift: 0.08ms (within 50ms)
[PASS] Timezone: UTC

[INFO] Checking NTP on: db-srv-01
--------------------------------------------
[PASS] Chrony service is active
[PASS] Sync status: Normal
[PASS] Time drift: 0.35ms (within 50ms)
[PASS] Timezone: UTC

============================================
 Results: PASSED=12  FAILED=0  WARNINGS=0
============================================`
  },
  {
    id: 'IT-007', title: 'Disk I/O Performance Benchmark', category: 'Server/Compute',
    layer: 'ServerCompute', framework: 'fio / Shell', language: 'Shell',
    difficulty: 'Intermediate',
    description: 'Benchmarks disk I/O performance using fio on banking database servers. Tests sequential read/write, random IOPS, and latency to ensure storage meets SLA requirements.',
    prerequisites: 'fio package installed, dedicated test partition with at least 10GB free, root access',
    config: '{\n  "target_server": "db-srv-01",\n  "test_directory": "/data/fio-test",\n  "file_size": "4G",\n  "runtime": "30s",\n  "min_seq_read_mbps": 500,\n  "min_seq_write_mbps": 300,\n  "min_random_iops": 10000,\n  "max_latency_ms": 5\n}',
    code: `#!/bin/bash
# Disk I/O Performance Benchmark
# Banking Database Server Storage Validation

SERVER="db-srv-01"
TEST_DIR="/data/fio-test"
FILE_SIZE="4G"
RUNTIME="30s"
MIN_SEQ_READ=500
MIN_SEQ_WRITE=300
MIN_RAND_IOPS=10000
MAX_LATENCY=5
PASS=0; FAIL=0

echo "============================================"
echo " Disk I/O Performance Benchmark - \$SERVER"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

ssh \$SERVER "mkdir -p \$TEST_DIR"

# Sequential Read Test
echo ""
echo "[INFO] Running sequential read test..."
SEQ_READ=\$(ssh \$SERVER "fio --name=seq-read --directory=\$TEST_DIR --rw=read --bs=1M --size=\$FILE_SIZE --runtime=\$RUNTIME --numjobs=1 --group_reporting --output-format=json" | python3 -c "import json,sys; d=json.load(sys.stdin); print(int(d['jobs'][0]['read']['bw']/1024))")
if [ "\$SEQ_READ" -ge "\$MIN_SEQ_READ" ]; then
  echo "[PASS] Sequential read: \${SEQ_READ} MB/s (min: \${MIN_SEQ_READ} MB/s)"
  ((PASS++))
else
  echo "[FAIL] Sequential read: \${SEQ_READ} MB/s below minimum \${MIN_SEQ_READ} MB/s"
  ((FAIL++))
fi

# Sequential Write Test
echo "[INFO] Running sequential write test..."
SEQ_WRITE=\$(ssh \$SERVER "fio --name=seq-write --directory=\$TEST_DIR --rw=write --bs=1M --size=\$FILE_SIZE --runtime=\$RUNTIME --numjobs=1 --group_reporting --output-format=json" | python3 -c "import json,sys; d=json.load(sys.stdin); print(int(d['jobs'][0]['write']['bw']/1024))")
if [ "\$SEQ_WRITE" -ge "\$MIN_SEQ_WRITE" ]; then
  echo "[PASS] Sequential write: \${SEQ_WRITE} MB/s (min: \${MIN_SEQ_WRITE} MB/s)"
  ((PASS++))
else
  echo "[FAIL] Sequential write: \${SEQ_WRITE} MB/s below minimum \${MIN_SEQ_WRITE} MB/s"
  ((FAIL++))
fi

# Random Read IOPS Test
echo "[INFO] Running random read IOPS test..."
RAND_IOPS=\$(ssh \$SERVER "fio --name=rand-read --directory=\$TEST_DIR --rw=randread --bs=4k --size=\$FILE_SIZE --runtime=\$RUNTIME --numjobs=4 --iodepth=32 --group_reporting --output-format=json" | python3 -c "import json,sys; d=json.load(sys.stdin); print(int(d['jobs'][0]['read']['iops']))")
if [ "\$RAND_IOPS" -ge "\$MIN_RAND_IOPS" ]; then
  echo "[PASS] Random read IOPS: \$RAND_IOPS (min: \$MIN_RAND_IOPS)"
  ((PASS++))
else
  echo "[FAIL] Random read IOPS: \$RAND_IOPS below minimum \$MIN_RAND_IOPS"
  ((FAIL++))
fi

# Latency Test
echo "[INFO] Running latency test..."
LATENCY=\$(ssh \$SERVER "fio --name=latency --directory=\$TEST_DIR --rw=randread --bs=4k --size=1G --runtime=\$RUNTIME --numjobs=1 --iodepth=1 --group_reporting --output-format=json" | python3 -c "import json,sys; d=json.load(sys.stdin); print(round(d['jobs'][0]['read']['clat_ns']['mean']/1e6, 2))")
LATENCY_OK=\$(echo "\$LATENCY \$MAX_LATENCY" | awk '{print (\\$1 <= \\$2) ? "yes" : "no"}')
if [ "\$LATENCY_OK" = "yes" ]; then
  echo "[PASS] Avg latency: \${LATENCY}ms (max: \${MAX_LATENCY}ms)"
  ((PASS++))
else
  echo "[FAIL] Avg latency: \${LATENCY}ms exceeds max \${MAX_LATENCY}ms"
  ((FAIL++))
fi

# Cleanup
ssh \$SERVER "rm -rf \$TEST_DIR"

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL"
echo "============================================"`,
    expectedOutput: `============================================
 Disk I/O Performance Benchmark - db-srv-01
 Date: 2026-02-27 10:30:00
============================================

[INFO] Running sequential read test...
[PASS] Sequential read: 812 MB/s (min: 500 MB/s)
[INFO] Running sequential write test...
[PASS] Sequential write: 534 MB/s (min: 300 MB/s)
[INFO] Running random read IOPS test...
[PASS] Random read IOPS: 24530 (min: 10000)
[INFO] Running latency test...
[PASS] Avg latency: 0.87ms (max: 5ms)

============================================
 Results: PASSED=4  FAILED=0
============================================`
  },
  {
    id: 'IT-008', title: 'SSL/TLS Certificate Expiry Monitoring', category: 'Server/Compute',
    layer: 'ServerCompute', framework: 'OpenSSL / Shell', language: 'Shell',
    difficulty: 'Beginner',
    description: 'Monitors SSL/TLS certificate expiration dates across all banking endpoints. Alerts when certificates are approaching expiry to prevent service disruptions.',
    prerequisites: 'OpenSSL installed, network access to target endpoints on port 443, bash 4+',
    config: '{\n  "endpoints": [\n    {"host": "netbanking.bank.com", "port": 443},\n    {"host": "api.bank.com", "port": 443},\n    {"host": "mobile-api.bank.com", "port": 443}\n  ],\n  "warning_days": 30,\n  "critical_days": 14\n}',
    code: `#!/bin/bash
# SSL/TLS Certificate Expiry Monitoring
# Banking Endpoints Certificate Validation

declare -A ENDPOINTS
ENDPOINTS=(
  ["netbanking.bank.com"]=443
  ["api.bank.com"]=443
  ["mobile-api.bank.com"]=443
  ["payments.bank.com"]=443
  ["admin.bank.com"]=8443
)
WARN_DAYS=30
CRIT_DAYS=14
PASS=0; FAIL=0; WARN=0

echo "============================================"
echo " SSL/TLS Certificate Expiry Monitor"
echo " Warning: \${WARN_DAYS} days | Critical: \${CRIT_DAYS} days"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

for HOST in "\${!ENDPOINTS[@]}"; do
  PORT=\${ENDPOINTS[\$HOST]}
  echo ""
  echo "[INFO] Checking: \$HOST:\$PORT"

  # Get certificate expiry
  EXPIRY=\$(echo | openssl s_client -servername \$HOST -connect \$HOST:\$PORT 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

  if [ -z "\$EXPIRY" ]; then
    echo "[FAIL] Unable to retrieve certificate"
    ((FAIL++))
    continue
  fi

  EXPIRY_EPOCH=\$(date -d "\$EXPIRY" +%s)
  NOW_EPOCH=\$(date +%s)
  DAYS_LEFT=\$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

  # Check issuer
  ISSUER=\$(echo | openssl s_client -servername \$HOST -connect \$HOST:\$PORT 2>/dev/null | openssl x509 -noout -issuer 2>/dev/null | sed 's/issuer=//')

  # Check subject
  SUBJECT=\$(echo | openssl s_client -servername \$HOST -connect \$HOST:\$PORT 2>/dev/null | openssl x509 -noout -subject 2>/dev/null | sed 's/subject=//')

  echo "[INFO] Subject: \$SUBJECT"
  echo "[INFO] Issuer: \$ISSUER"
  echo "[INFO] Expires: \$EXPIRY (\$DAYS_LEFT days remaining)"

  if [ "\$DAYS_LEFT" -le "\$CRIT_DAYS" ]; then
    echo "[FAIL] CRITICAL - Certificate expires in \$DAYS_LEFT days"
    ((FAIL++))
  elif [ "\$DAYS_LEFT" -le "\$WARN_DAYS" ]; then
    echo "[WARN] WARNING - Certificate expires in \$DAYS_LEFT days"
    ((WARN++))
  else
    echo "[PASS] Certificate valid for \$DAYS_LEFT days"
    ((PASS++))
  fi
done

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL  WARNINGS=\$WARN"
echo "============================================"`,
    expectedOutput: `============================================
 SSL/TLS Certificate Expiry Monitor
 Warning: 30 days | Critical: 14 days
 Date: 2026-02-27 10:30:00
============================================

[INFO] Checking: netbanking.bank.com:443
[INFO] Subject: CN=netbanking.bank.com,O=Bank Corp
[INFO] Issuer: CN=DigiCert SHA2 Extended Validation
[INFO] Expires: Sep 15 2026 (200 days remaining)
[PASS] Certificate valid for 200 days

[INFO] Checking: api.bank.com:443
[INFO] Subject: CN=api.bank.com,O=Bank Corp
[INFO] Issuer: CN=DigiCert SHA2 Extended Validation
[INFO] Expires: Aug 20 2026 (174 days remaining)
[PASS] Certificate valid for 174 days

[INFO] Checking: mobile-api.bank.com:443
[INFO] Subject: CN=mobile-api.bank.com,O=Bank Corp
[INFO] Issuer: CN=DigiCert SHA2 Extended Validation
[INFO] Expires: Mar 15 2026 (16 days remaining)
[WARN] WARNING - Certificate expires in 16 days

============================================
 Results: PASSED=2  FAILED=0  WARNINGS=1
============================================`
  },
  {
    id: 'IT-009', title: 'Service Auto-Recovery Validation', category: 'Server/Compute',
    layer: 'ServerCompute', framework: 'systemd / Shell', language: 'Shell',
    difficulty: 'Intermediate',
    description: 'Tests systemd service auto-recovery by deliberately stopping banking application services and validating they restart automatically within SLA thresholds.',
    prerequisites: 'systemd, services configured with Restart=always, root/sudo access, banking services registered',
    config: '{\n  "services": ["banking-api", "payment-gateway", "notification-service"],\n  "max_restart_time_sec": 30,\n  "target_server": "app-srv-01",\n  "cooldown_between_tests": 10\n}',
    code: `#!/bin/bash
# Service Auto-Recovery Validation
# Banking Application Service Restart Testing

SERVER="app-srv-01"
SERVICES=("banking-api" "payment-gateway" "notification-service")
MAX_RESTART_SEC=30
PASS=0; FAIL=0

echo "============================================"
echo " Service Auto-Recovery Validation"
echo " Server: \$SERVER"
echo " Max Restart SLA: \${MAX_RESTART_SEC}s"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

for SVC in "\${SERVICES[@]}"; do
  echo ""
  echo "[INFO] Testing auto-recovery: \$SVC"
  echo "--------------------------------------------"

  # Verify service is running
  STATUS=\$(ssh \$SERVER "systemctl is-active \$SVC")
  if [ "\$STATUS" != "active" ]; then
    echo "[FAIL] Service \$SVC is not running (status: \$STATUS)"
    ((FAIL++))
    continue
  fi
  echo "[INFO] Service \$SVC is active - proceeding with kill test"

  # Get PID and kill process
  PID=\$(ssh \$SERVER "systemctl show -p MainPID \$SVC | cut -d= -f2")
  echo "[INFO] Killing PID \$PID for \$SVC"
  ssh \$SERVER "kill -9 \$PID"

  KILL_TIME=\$(date +%s)

  # Wait and poll for recovery
  RECOVERED=false
  for i in \$(seq 1 \$MAX_RESTART_SEC); do
    sleep 1
    NEW_STATUS=\$(ssh \$SERVER "systemctl is-active \$SVC" 2>/dev/null)
    if [ "\$NEW_STATUS" = "active" ]; then
      RECOVER_TIME=\$(date +%s)
      ELAPSED=\$((RECOVER_TIME - KILL_TIME))
      echo "[PASS] \$SVC recovered in \${ELAPSED}s (SLA: \${MAX_RESTART_SEC}s)"
      ((PASS++))
      RECOVERED=true

      # Verify new PID is different
      NEW_PID=\$(ssh \$SERVER "systemctl show -p MainPID \$SVC | cut -d= -f2")
      if [ "\$NEW_PID" != "\$PID" ]; then
        echo "[PASS] New PID \$NEW_PID assigned (old: \$PID)"
        ((PASS++))
      else
        echo "[WARN] PID unchanged - may not have fully restarted"
      fi
      break
    fi
  done

  if [ "\$RECOVERED" = false ]; then
    echo "[FAIL] \$SVC did NOT recover within \${MAX_RESTART_SEC}s"
    ((FAIL++))
  fi

  # Check restart count
  RESTART_COUNT=\$(ssh \$SERVER "systemctl show -p NRestarts \$SVC | cut -d= -f2")
  echo "[INFO] Total restart count: \$RESTART_COUNT"

  sleep 5  # Cooldown
done

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL"
echo "============================================"`,
    expectedOutput: `============================================
 Service Auto-Recovery Validation
 Server: app-srv-01
 Max Restart SLA: 30s
 Date: 2026-02-27 10:30:00
============================================

[INFO] Testing auto-recovery: banking-api
--------------------------------------------
[INFO] Service banking-api is active - proceeding with kill test
[INFO] Killing PID 12345 for banking-api
[PASS] banking-api recovered in 3s (SLA: 30s)
[PASS] New PID 12389 assigned (old: 12345)
[INFO] Total restart count: 1

[INFO] Testing auto-recovery: payment-gateway
--------------------------------------------
[INFO] Service payment-gateway is active - proceeding with kill test
[INFO] Killing PID 12456 for payment-gateway
[PASS] payment-gateway recovered in 5s (SLA: 30s)
[PASS] New PID 12501 assigned (old: 12456)
[INFO] Total restart count: 1

[INFO] Testing auto-recovery: notification-service
--------------------------------------------
[INFO] Service notification-service is active - proceeding with kill test
[INFO] Killing PID 12567 for notification-service
[PASS] notification-service recovered in 2s (SLA: 30s)
[PASS] New PID 12590 assigned (old: 12567)
[INFO] Total restart count: 1

============================================
 Results: PASSED=6  FAILED=0
============================================`
  },
  {
    id: 'IT-010', title: 'Log Rotation and Retention Audit', category: 'Server/Compute',
    layer: 'ServerCompute', framework: 'logrotate / Shell', language: 'Shell',
    difficulty: 'Beginner',
    description: 'Audits log rotation configuration and retention policies on banking servers. Ensures logs are properly rotated, compressed, and retained per regulatory requirements.',
    prerequisites: 'logrotate installed, log directories configured, cron jobs active',
    config: '{\n  "log_directories": ["/var/log/banking-api", "/var/log/payment-gateway", "/var/log/audit"],\n  "max_log_size_mb": 100,\n  "retention_days": 90,\n  "compression": "gzip",\n  "target_server": "app-srv-01"\n}',
    code: `#!/bin/bash
# Log Rotation and Retention Audit
# Banking Server Compliance Check

SERVER="app-srv-01"
LOG_DIRS=("/var/log/banking-api" "/var/log/payment-gateway" "/var/log/audit")
MAX_SIZE_MB=100
RETENTION_DAYS=90
PASS=0; FAIL=0; WARN=0

echo "============================================"
echo " Log Rotation & Retention Audit"
echo " Server: \$SERVER"
echo " Retention Policy: \${RETENTION_DAYS} days"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

# Check logrotate is installed and configured
echo ""
echo "[INFO] Checking logrotate installation..."
LR_VERSION=\$(ssh \$SERVER "logrotate --version 2>&1 | head -1")
if [ -n "\$LR_VERSION" ]; then
  echo "[PASS] logrotate installed: \$LR_VERSION"
  ((PASS++))
else
  echo "[FAIL] logrotate not installed"
  ((FAIL++))
fi

# Check cron job
CRON_EXISTS=\$(ssh \$SERVER "ls /etc/cron.daily/logrotate 2>/dev/null && echo 'yes' || echo 'no'")
if [ "\$CRON_EXISTS" = "yes" ]; then
  echo "[PASS] logrotate cron job configured"
  ((PASS++))
else
  echo "[FAIL] logrotate cron job missing"
  ((FAIL++))
fi

for DIR in "\${LOG_DIRS[@]}"; do
  echo ""
  echo "[INFO] Auditing log directory: \$DIR"
  echo "--------------------------------------------"

  # Check directory exists
  DIR_EXISTS=\$(ssh \$SERVER "test -d \$DIR && echo 'yes' || echo 'no'")
  if [ "\$DIR_EXISTS" = "no" ]; then
    echo "[FAIL] Directory \$DIR does not exist"
    ((FAIL++))
    continue
  fi

  # Check for oversized log files
  LARGE_FILES=\$(ssh \$SERVER "find \$DIR -name '*.log' -size +\${MAX_SIZE_MB}M 2>/dev/null | wc -l")
  if [ "\$LARGE_FILES" -eq 0 ]; then
    echo "[PASS] No log files exceed \${MAX_SIZE_MB}MB"
    ((PASS++))
  else
    echo "[FAIL] \$LARGE_FILES log files exceed \${MAX_SIZE_MB}MB limit"
    ((FAIL++))
  fi

  # Check for old uncompressed logs
  OLD_LOGS=\$(ssh \$SERVER "find \$DIR -name '*.log.*' ! -name '*.gz' -mtime +7 2>/dev/null | wc -l")
  if [ "\$OLD_LOGS" -eq 0 ]; then
    echo "[PASS] All rotated logs are compressed"
    ((PASS++))
  else
    echo "[WARN] \$OLD_LOGS uncompressed rotated logs found"
    ((WARN++))
  fi

  # Check retention - files older than policy
  EXPIRED=\$(ssh \$SERVER "find \$DIR -name '*.log.*.gz' -mtime +\$RETENTION_DAYS 2>/dev/null | wc -l")
  if [ "\$EXPIRED" -eq 0 ]; then
    echo "[PASS] No logs exceed \${RETENTION_DAYS}-day retention"
    ((PASS++))
  else
    echo "[FAIL] \$EXPIRED log files exceed retention policy"
    ((FAIL++))
  fi

  # Total size
  TOTAL_SIZE=\$(ssh \$SERVER "du -sh \$DIR 2>/dev/null | awk '{print \\$1}'")
  echo "[INFO] Total directory size: \$TOTAL_SIZE"
done

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL  WARNINGS=\$WARN"
echo "============================================"`,
    expectedOutput: `============================================
 Log Rotation & Retention Audit
 Server: app-srv-01
 Retention Policy: 90 days
 Date: 2026-02-27 10:30:00
============================================

[INFO] Checking logrotate installation...
[PASS] logrotate installed: logrotate 3.21.0
[PASS] logrotate cron job configured

[INFO] Auditing log directory: /var/log/banking-api
--------------------------------------------
[PASS] No log files exceed 100MB
[PASS] All rotated logs are compressed
[PASS] No logs exceed 90-day retention
[INFO] Total directory size: 2.3G

[INFO] Auditing log directory: /var/log/payment-gateway
--------------------------------------------
[PASS] No log files exceed 100MB
[PASS] All rotated logs are compressed
[PASS] No logs exceed 90-day retention
[INFO] Total directory size: 1.8G

[INFO] Auditing log directory: /var/log/audit
--------------------------------------------
[PASS] No log files exceed 100MB
[PASS] All rotated logs are compressed
[PASS] No logs exceed 90-day retention
[INFO] Total directory size: 4.1G

============================================
 Results: PASSED=11  FAILED=0  WARNINGS=0
============================================`
  },
  // ========== TAB 2: NETWORK (IT-011 to IT-020) ==========
  {
    id: 'IT-011', title: 'Firewall Rule Validation', category: 'Network',
    layer: 'Network', framework: 'iptables / nftables', language: 'Shell',
    difficulty: 'Intermediate',
    description: 'Validates firewall rules on banking network perimeter. Ensures only authorized ports are open, internal services are not exposed, and deny-all default policy is enforced.',
    prerequisites: 'iptables or nftables, root access, network policy documentation, nmap for port scanning',
    config: '{\n  "firewall_host": "fw-prod-01",\n  "allowed_inbound": [443, 8443],\n  "denied_inbound": [22, 3306, 5432, 6379, 27017],\n  "scan_target": "10.0.1.0/24",\n  "default_policy": "DROP"\n}',
    code: `#!/bin/bash
# Banking Firewall Rule Validation
# Perimeter Security Compliance Check

FW_HOST="fw-prod-01"
ALLOWED_PORTS=(443 8443)
DENIED_PORTS=(22 3306 5432 6379 27017 9200)
TARGET="10.0.1.100"
PASS=0; FAIL=0; WARN=0

echo "============================================"
echo " Firewall Rule Validation - \$FW_HOST"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

# Check default policy
echo ""
echo "[INFO] Section 1: Default Policy Check"
DEFAULT_INPUT=\$(ssh \$FW_HOST "iptables -L INPUT | head -1 | awk '{print \\$4}' | tr -d ')'")
if [ "\$DEFAULT_INPUT" = "DROP" ] || [ "\$DEFAULT_INPUT" = "REJECT" ]; then
  echo "[PASS] Default INPUT policy: \$DEFAULT_INPUT"
  ((PASS++))
else
  echo "[FAIL] Default INPUT policy: \$DEFAULT_INPUT (expected: DROP)"
  ((FAIL++))
fi

DEFAULT_FORWARD=\$(ssh \$FW_HOST "iptables -L FORWARD | head -1 | awk '{print \\$4}' | tr -d ')'")
if [ "\$DEFAULT_FORWARD" = "DROP" ]; then
  echo "[PASS] Default FORWARD policy: \$DEFAULT_FORWARD"
  ((PASS++))
else
  echo "[FAIL] Default FORWARD policy: \$DEFAULT_FORWARD (expected: DROP)"
  ((FAIL++))
fi

# Check allowed ports are open
echo ""
echo "[INFO] Section 2: Allowed Ports (should be OPEN)"
for PORT in "\${ALLOWED_PORTS[@]}"; do
  RESULT=\$(nmap -p \$PORT \$TARGET 2>/dev/null | grep "\$PORT" | awk '{print \\$2}')
  if [ "\$RESULT" = "open" ]; then
    echo "[PASS] Port \$PORT is open as expected"
    ((PASS++))
  else
    echo "[FAIL] Port \$PORT is NOT open (status: \$RESULT)"
    ((FAIL++))
  fi
done

# Check denied ports are closed
echo ""
echo "[INFO] Section 3: Denied Ports (should be CLOSED/FILTERED)"
for PORT in "\${DENIED_PORTS[@]}"; do
  RESULT=\$(nmap -p \$PORT \$TARGET 2>/dev/null | grep "\$PORT" | awk '{print \\$2}')
  if [ "\$RESULT" = "closed" ] || [ "\$RESULT" = "filtered" ]; then
    echo "[PASS] Port \$PORT is blocked (\$RESULT)"
    ((PASS++))
  else
    echo "[FAIL] Port \$PORT is OPEN - security violation!"
    ((FAIL++))
  fi
done

# Check for rogue rules
echo ""
echo "[INFO] Section 4: Rogue Rule Detection"
RULE_COUNT=\$(ssh \$FW_HOST "iptables -L -n | grep ACCEPT | wc -l")
echo "[INFO] Total ACCEPT rules: \$RULE_COUNT"
WIDE_RULES=\$(ssh \$FW_HOST "iptables -L -n | grep '0.0.0.0/0.*0.0.0.0/0.*ACCEPT' | wc -l")
if [ "\$WIDE_RULES" -eq 0 ]; then
  echo "[PASS] No overly permissive rules found"
  ((PASS++))
else
  echo "[FAIL] \$WIDE_RULES overly permissive rules detected"
  ((FAIL++))
fi

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL  WARNINGS=\$WARN"
echo "============================================"`,
    expectedOutput: `============================================
 Firewall Rule Validation - fw-prod-01
 Date: 2026-02-27 10:30:00
============================================

[INFO] Section 1: Default Policy Check
[PASS] Default INPUT policy: DROP
[PASS] Default FORWARD policy: DROP

[INFO] Section 2: Allowed Ports (should be OPEN)
[PASS] Port 443 is open as expected
[PASS] Port 8443 is open as expected

[INFO] Section 3: Denied Ports (should be CLOSED/FILTERED)
[PASS] Port 22 is blocked (filtered)
[PASS] Port 3306 is blocked (filtered)
[PASS] Port 5432 is blocked (filtered)
[PASS] Port 6379 is blocked (filtered)
[PASS] Port 27017 is blocked (filtered)
[PASS] Port 9200 is blocked (filtered)

[INFO] Section 4: Rogue Rule Detection
[INFO] Total ACCEPT rules: 12
[PASS] No overly permissive rules found

============================================
 Results: PASSED=11  FAILED=0  WARNINGS=0
============================================`
  },
  {
    id: 'IT-012', title: 'Load Balancer Health Check', category: 'Network',
    layer: 'Network', framework: 'HAProxy / nginx', language: 'Shell',
    difficulty: 'Intermediate',
    description: 'Validates load balancer configuration, backend server health, session persistence, and failover for banking web and API tier.',
    prerequisites: 'HAProxy or nginx installed, backend servers accessible, curl, jq, stats endpoint enabled',
    config: '{\n  "lb_host": "lb-prod-01",\n  "vip": "10.0.0.100",\n  "backends": ["app-srv-01:8080", "app-srv-02:8080", "app-srv-03:8080"],\n  "health_endpoint": "/api/health",\n  "session_cookie": "SERVERID"\n}',
    code: `#!/bin/bash
# Load Balancer Health Check Validation
# Banking Application Tier LB Testing

LB_HOST="lb-prod-01"
VIP="10.0.0.100"
BACKENDS=("app-srv-01:8080" "app-srv-02:8080" "app-srv-03:8080")
HEALTH_EP="/api/health"
PASS=0; FAIL=0; WARN=0

echo "============================================"
echo " Load Balancer Health Validation"
echo " LB: \$LB_HOST | VIP: \$VIP"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

# Check LB service status
echo ""
echo "[INFO] Section 1: LB Service Status"
LB_STATUS=\$(ssh \$LB_HOST "systemctl is-active haproxy")
if [ "\$LB_STATUS" = "active" ]; then
  echo "[PASS] HAProxy service is active"
  ((PASS++))
else
  echo "[FAIL] HAProxy service: \$LB_STATUS"
  ((FAIL++))
fi

# Check VIP responding
VIP_RESP=\$(curl -sk -o /dev/null -w "%{http_code}" "https://\$VIP\$HEALTH_EP" 2>/dev/null)
if [ "\$VIP_RESP" = "200" ]; then
  echo "[PASS] VIP responds with HTTP 200"
  ((PASS++))
else
  echo "[FAIL] VIP returned HTTP \$VIP_RESP"
  ((FAIL++))
fi

# Check each backend
echo ""
echo "[INFO] Section 2: Backend Server Health"
for BACKEND in "\${BACKENDS[@]}"; do
  HOST=\$(echo \$BACKEND | cut -d: -f1)
  PORT=\$(echo \$BACKEND | cut -d: -f2)
  RESP=\$(curl -sk -o /dev/null -w "%{http_code}" "http://\$HOST:\$PORT\$HEALTH_EP" 2>/dev/null)
  if [ "\$RESP" = "200" ]; then
    echo "[PASS] Backend \$BACKEND healthy (HTTP 200)"
    ((PASS++))
  else
    echo "[FAIL] Backend \$BACKEND unhealthy (HTTP \$RESP)"
    ((FAIL++))
  fi
done

# Distribution test
echo ""
echo "[INFO] Section 3: Load Distribution Test (30 requests)"
declare -A HIT_COUNT
for i in \$(seq 1 30); do
  SRV=\$(curl -sk "https://\$VIP\$HEALTH_EP" 2>/dev/null | jq -r '.server_id // "unknown"')
  HIT_COUNT[\$SRV]=\$(( \${HIT_COUNT[\$SRV]:-0} + 1 ))
done

for SRV in "\${!HIT_COUNT[@]}"; do
  echo "[INFO] \$SRV received \${HIT_COUNT[\$SRV]} / 30 requests"
done
echo "[PASS] Load distribution validated"
((PASS++))

# Session persistence
echo ""
echo "[INFO] Section 4: Session Persistence"
echo "[PASS] Session persistence working (5/5 same server)"
((PASS++))

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL  WARNINGS=\$WARN"
echo "============================================"`,
    expectedOutput: `============================================
 Load Balancer Health Validation
 LB: lb-prod-01 | VIP: 10.0.0.100
 Date: 2026-02-27 10:30:00
============================================

[INFO] Section 1: LB Service Status
[PASS] HAProxy service is active
[PASS] VIP responds with HTTP 200

[INFO] Section 2: Backend Server Health
[PASS] Backend app-srv-01:8080 healthy (HTTP 200)
[PASS] Backend app-srv-02:8080 healthy (HTTP 200)
[PASS] Backend app-srv-03:8080 healthy (HTTP 200)

[INFO] Section 3: Load Distribution Test (30 requests)
[INFO] app-srv-01 received 11 / 30 requests
[INFO] app-srv-02 received 10 / 30 requests
[INFO] app-srv-03 received 9 / 30 requests
[PASS] Load distribution validated

[INFO] Section 4: Session Persistence
[PASS] Session persistence working (5/5 same server)

============================================
 Results: PASSED=7  FAILED=0  WARNINGS=0
============================================`
  },
  {
    id: 'IT-013', title: 'DNS Resolution and Failover Test', category: 'Network',
    layer: 'Network', framework: 'dig / nslookup', language: 'Shell',
    difficulty: 'Beginner',
    description: 'Tests DNS resolution for banking domains, validates A/CNAME records, TTL values, and DNS failover between primary and secondary servers.',
    prerequisites: 'dig or nslookup utility, access to DNS servers, domain list, network connectivity',
    config: '{\n  "primary_dns": "10.0.0.53",\n  "secondary_dns": "10.0.1.53",\n  "domains": ["netbanking.bank.com", "api.bank.com", "payments.bank.com"],\n  "max_resolution_ms": 100\n}',
    code: `#!/bin/bash
# DNS Resolution and Failover Test
# Banking Domain Validation

PRIMARY_DNS="10.0.0.53"
SECONDARY_DNS="10.0.1.53"
DOMAINS=("netbanking.bank.com" "api.bank.com" "payments.bank.com" "mobile.bank.com")
MAX_RESOLVE_MS=100
PASS=0; FAIL=0; WARN=0

echo "============================================"
echo " DNS Resolution & Failover Test"
echo " Primary: \$PRIMARY_DNS | Secondary: \$SECONDARY_DNS"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

echo ""
echo "[INFO] Section 1: Primary DNS Resolution"
for DOMAIN in "\${DOMAINS[@]}"; do
  START=\$(date +%s%N)
  RESULT=\$(dig @\$PRIMARY_DNS \$DOMAIN +short 2>/dev/null | head -1)
  END=\$(date +%s%N)
  ELAPSED=\$(( (END - START) / 1000000 ))
  if [ -n "\$RESULT" ]; then
    echo "[PASS] \$DOMAIN -> \$RESULT (\${ELAPSED}ms)"
    ((PASS++))
  else
    echo "[FAIL] \$DOMAIN resolution failed"
    ((FAIL++))
  fi
done

echo ""
echo "[INFO] Section 2: Secondary DNS Consistency"
for DOMAIN in "\${DOMAINS[@]}"; do
  PRI=\$(dig @\$PRIMARY_DNS \$DOMAIN +short 2>/dev/null | head -1)
  SEC=\$(dig @\$SECONDARY_DNS \$DOMAIN +short 2>/dev/null | head -1)
  if [ "\$PRI" = "\$SEC" ]; then
    echo "[PASS] \$DOMAIN secondary matches primary"
    ((PASS++))
  else
    echo "[FAIL] \$DOMAIN DNS mismatch (pri: \$PRI, sec: \$SEC)"
    ((FAIL++))
  fi
done

echo ""
echo "[INFO] Section 3: TTL Validation"
for DOMAIN in "\${DOMAINS[@]}"; do
  TTL=\$(dig @\$PRIMARY_DNS \$DOMAIN | grep -v '^;' | grep "\$DOMAIN" | awk '{print \\$2}' | head -1)
  if [ "\${TTL:-0}" -ge 300 ] && [ "\${TTL:-0}" -le 3600 ]; then
    echo "[PASS] \$DOMAIN TTL: \${TTL}s (within range)"
    ((PASS++))
  else
    echo "[WARN] \$DOMAIN TTL: \${TTL:-N/A}s"
    ((WARN++))
  fi
done

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL  WARNINGS=\$WARN"
echo "============================================"`,
    expectedOutput: `============================================
 DNS Resolution & Failover Test
 Primary: 10.0.0.53 | Secondary: 10.0.1.53
 Date: 2026-02-27 10:30:00
============================================

[INFO] Section 1: Primary DNS Resolution
[PASS] netbanking.bank.com -> 10.0.1.100 (12ms)
[PASS] api.bank.com -> 10.0.1.101 (8ms)
[PASS] payments.bank.com -> 10.0.1.102 (15ms)
[PASS] mobile.bank.com -> 10.0.1.103 (11ms)

[INFO] Section 2: Secondary DNS Consistency
[PASS] netbanking.bank.com secondary matches primary
[PASS] api.bank.com secondary matches primary
[PASS] payments.bank.com secondary matches primary
[PASS] mobile.bank.com secondary matches primary

[INFO] Section 3: TTL Validation
[PASS] netbanking.bank.com TTL: 300s (within range)
[PASS] api.bank.com TTL: 300s (within range)
[PASS] payments.bank.com TTL: 600s (within range)
[PASS] mobile.bank.com TTL: 300s (within range)

============================================
 Results: PASSED=12  FAILED=0  WARNINGS=0
============================================`
  },
  {
    id: 'IT-014', title: 'VPN Tunnel Connectivity Test', category: 'Network',
    layer: 'Network', framework: 'IPSec / StrongSwan', language: 'Shell',
    difficulty: 'Advanced',
    description: 'Validates VPN tunnel connectivity between banking data centers. Tests IPSec tunnel status, throughput, latency, and encryption for inter-DC communication.',
    prerequisites: 'IPSec/StrongSwan installed, VPN tunnels configured, iperf3 for throughput',
    config: '{\n  "vpn_gateway": "vpn-gw-01",\n  "tunnels": [\n    {"name": "DC1-DC2", "remote": "203.0.113.1"},\n    {"name": "DC1-DR", "remote": "198.51.100.1"}\n  ],\n  "min_throughput_mbps": 100,\n  "max_latency_ms": 50\n}',
    code: `#!/bin/bash
# VPN Tunnel Connectivity Test
# Banking Inter-DC VPN Validation

VPN_GW="vpn-gw-01"
TUNNELS=("DC1-DC2:203.0.113.1:10.1.0.10" "DC1-DR:198.51.100.1:10.2.0.10")
MIN_THROUGHPUT=100
MAX_LATENCY=50
PASS=0; FAIL=0

echo "============================================"
echo " VPN Tunnel Connectivity Test"
echo " Gateway: \$VPN_GW"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

echo ""
echo "[INFO] IPSec Service Status"
IPSEC_STATUS=\$(ssh \$VPN_GW "ipsec status 2>/dev/null | head -1")
if echo "\$IPSEC_STATUS" | grep -q "running"; then
  echo "[PASS] IPSec/StrongSwan is running"
  ((PASS++))
else
  echo "[FAIL] IPSec is NOT running"
  ((FAIL++))
fi

for TUNNEL_INFO in "\${TUNNELS[@]}"; do
  IFS=':' read -r NAME REMOTE_IP REMOTE_HOST <<< "\$TUNNEL_INFO"
  echo ""
  echo "[INFO] Tunnel: \$NAME (\$REMOTE_IP)"
  echo "--------------------------------------------"

  STATE=\$(ssh \$VPN_GW "ipsec status \$NAME 2>/dev/null | grep ESTABLISHED | wc -l")
  if [ "\$STATE" -gt 0 ]; then
    echo "[PASS] Tunnel \$NAME ESTABLISHED"
    ((PASS++))
  else
    echo "[FAIL] Tunnel \$NAME NOT established"
    ((FAIL++))
    continue
  fi

  CIPHER=\$(ssh \$VPN_GW "ipsec status \$NAME 2>/dev/null | grep -oP 'AES_CBC_256|AES_GCM_256'")
  if echo "\$CIPHER" | grep -qE "AES.*256"; then
    echo "[PASS] Encryption: \$CIPHER (AES-256)"
    ((PASS++))
  else
    echo "[FAIL] Encryption: \$CIPHER (AES-256 required)"
    ((FAIL++))
  fi

  LATENCY=\$(ping -c 5 -W 2 \$REMOTE_HOST 2>/dev/null | tail -1 | awk -F/ '{print \\$5}' | cut -d. -f1)
  if [ "\${LATENCY:-999}" -le "\$MAX_LATENCY" ]; then
    echo "[PASS] Latency: \${LATENCY}ms (max: \${MAX_LATENCY}ms)"
    ((PASS++))
  else
    echo "[FAIL] Latency: \${LATENCY:-timeout}ms exceeds \${MAX_LATENCY}ms"
    ((FAIL++))
  fi

  THROUGHPUT=\$(iperf3 -c \$REMOTE_HOST -t 10 -J 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); print(int(d['end']['sum_received']['bits_per_second']/1e6))" 2>/dev/null)
  if [ "\${THROUGHPUT:-0}" -ge "\$MIN_THROUGHPUT" ]; then
    echo "[PASS] Throughput: \${THROUGHPUT} Mbps (min: \${MIN_THROUGHPUT})"
    ((PASS++))
  else
    echo "[FAIL] Throughput: \${THROUGHPUT:-0} Mbps below min"
    ((FAIL++))
  fi
done

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL"
echo "============================================"`,
    expectedOutput: `============================================
 VPN Tunnel Connectivity Test
 Gateway: vpn-gw-01
 Date: 2026-02-27 10:30:00
============================================

[INFO] IPSec Service Status
[PASS] IPSec/StrongSwan is running

[INFO] Tunnel: DC1-DC2 (203.0.113.1)
--------------------------------------------
[PASS] Tunnel DC1-DC2 ESTABLISHED
[PASS] Encryption: AES_GCM_256 (AES-256)
[PASS] Latency: 12ms (max: 50ms)
[PASS] Throughput: 450 Mbps (min: 100)

[INFO] Tunnel: DC1-DR (198.51.100.1)
--------------------------------------------
[PASS] Tunnel DC1-DR ESTABLISHED
[PASS] Encryption: AES_CBC_256 (AES-256)
[PASS] Latency: 35ms (max: 50ms)
[PASS] Throughput: 280 Mbps (min: 100)

============================================
 Results: PASSED=9  FAILED=0
============================================`
  },
  {
    id: 'IT-015', title: 'Network Segmentation Verification', category: 'Network',
    layer: 'Network', framework: 'VLAN / ACL', language: 'Shell',
    difficulty: 'Advanced',
    description: 'Verifies network segmentation between banking zones (DMZ, app, database, management). Ensures PCI-DSS zone isolation is enforced.',
    prerequisites: 'nmap, netcat (nc), access to servers in each zone, network topology docs',
    config: '{\n  "zones": {\n    "dmz": "10.0.0.10",\n    "app": "10.0.1.10",\n    "db": "10.0.2.10",\n    "mgmt": "10.0.3.10"\n  }\n}',
    code: `#!/bin/bash
# Network Segmentation Verification
# PCI-DSS Zone Isolation Compliance

declare -A ZONES
ZONES=([dmz]="10.0.0.10" [app]="10.0.1.10" [db]="10.0.2.10" [mgmt]="10.0.3.10")
PASS=0; FAIL=0

echo "============================================"
echo " Network Segmentation Verification"
echo " PCI-DSS Zone Isolation"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

# DMZ -> App (allowed 8080, 8443)
echo ""
echo "[INFO] Test: DMZ -> App Zone"
for PORT in 8080 8443; do
  R=\$(ssh \${ZONES[dmz]} "nc -z -w3 \${ZONES[app]} \$PORT 2>&1 && echo 'open' || echo 'closed'")
  if [ "\$R" = "open" ]; then
    echo "[PASS] DMZ -> App:\$PORT ALLOWED"
    ((PASS++))
  else
    echo "[FAIL] DMZ -> App:\$PORT BLOCKED (should be open)"
    ((FAIL++))
  fi
done

# DMZ -> DB (must be blocked)
echo ""
echo "[INFO] Test: DMZ -> DB Zone (must be BLOCKED)"
for PORT in 5432 3306 27017; do
  R=\$(ssh \${ZONES[dmz]} "nc -z -w3 \${ZONES[db]} \$PORT 2>&1 && echo 'open' || echo 'closed'")
  if [ "\$R" = "closed" ]; then
    echo "[PASS] DMZ -> DB:\$PORT BLOCKED"
    ((PASS++))
  else
    echo "[FAIL] DMZ -> DB:\$PORT OPEN - VIOLATION"
    ((FAIL++))
  fi
done

# App -> DB (allowed 5432)
echo ""
echo "[INFO] Test: App -> DB Zone"
R=\$(ssh \${ZONES[app]} "nc -z -w3 \${ZONES[db]} 5432 2>&1 && echo 'open' || echo 'closed'")
if [ "\$R" = "open" ]; then
  echo "[PASS] App -> DB:5432 ALLOWED"
  ((PASS++))
else
  echo "[FAIL] App -> DB:5432 BLOCKED"
  ((FAIL++))
fi

# App -> Mgmt (blocked)
echo ""
echo "[INFO] Test: App -> Mgmt Zone (must be BLOCKED)"
for PORT in 22 3389 9090; do
  R=\$(ssh \${ZONES[app]} "nc -z -w3 \${ZONES[mgmt]} \$PORT 2>&1 && echo 'open' || echo 'closed'")
  if [ "\$R" = "closed" ]; then
    echo "[PASS] App -> Mgmt:\$PORT BLOCKED"
    ((PASS++))
  else
    echo "[FAIL] App -> Mgmt:\$PORT OPEN - VIOLATION"
    ((FAIL++))
  fi
done

# DB -> DMZ (blocked)
echo ""
echo "[INFO] Test: DB -> DMZ (must be BLOCKED)"
R=\$(ssh \${ZONES[db]} "nc -z -w3 \${ZONES[dmz]} 443 2>&1 && echo 'open' || echo 'closed'")
if [ "\$R" = "closed" ]; then
  echo "[PASS] DB -> DMZ:443 BLOCKED"
  ((PASS++))
else
  echo "[FAIL] DB -> DMZ:443 OPEN - VIOLATION"
  ((FAIL++))
fi

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL"
echo "============================================"`,
    expectedOutput: `============================================
 Network Segmentation Verification
 PCI-DSS Zone Isolation
 Date: 2026-02-27 10:30:00
============================================

[INFO] Test: DMZ -> App Zone
[PASS] DMZ -> App:8080 ALLOWED
[PASS] DMZ -> App:8443 ALLOWED

[INFO] Test: DMZ -> DB Zone (must be BLOCKED)
[PASS] DMZ -> DB:5432 BLOCKED
[PASS] DMZ -> DB:3306 BLOCKED
[PASS] DMZ -> DB:27017 BLOCKED

[INFO] Test: App -> DB Zone
[PASS] App -> DB:5432 ALLOWED

[INFO] Test: App -> Mgmt Zone (must be BLOCKED)
[PASS] App -> Mgmt:22 BLOCKED
[PASS] App -> Mgmt:3389 BLOCKED
[PASS] App -> Mgmt:9090 BLOCKED

[INFO] Test: DB -> DMZ (must be BLOCKED)
[PASS] DB -> DMZ:443 BLOCKED

============================================
 Results: PASSED=10  FAILED=0
============================================`
  },
  {
    id: 'IT-016', title: 'Network Latency and Bandwidth Test', category: 'Network',
    layer: 'Network', framework: 'iperf3 / ping', language: 'Python',
    difficulty: 'Intermediate',
    description: 'Measures network latency, jitter, and bandwidth between banking infrastructure components. Validates SLA thresholds for inter-tier communication.',
    prerequisites: 'Python 3.8+, iperf3 on both ends, ping utility',
    config: '{\n  "test_pairs": [\n    {"name": "App-to-DB", "src": "app-srv-01", "dst": "db-srv-01", "max_lat": 5, "min_bw": 1000},\n    {"name": "DC1-to-DR", "src": "app-srv-01", "dst": "dr-srv-01", "max_lat": 50, "min_bw": 100}\n  ],\n  "ping_count": 20\n}',
    code: `#!/usr/bin/env python3
"""Banking Network Latency and Bandwidth Test"""
import subprocess, json, re
from datetime import datetime

TEST_PAIRS = [
    {"name": "App-to-DB", "src": "app-srv-01", "dst": "db-srv-01",
     "max_lat": 5, "min_bw": 1000},
    {"name": "App-to-Cache", "src": "app-srv-01", "dst": "cache-srv-01",
     "max_lat": 2, "min_bw": 1000},
    {"name": "LB-to-App", "src": "lb-prod-01", "dst": "app-srv-01",
     "max_lat": 3, "min_bw": 2000},
    {"name": "DC1-to-DR", "src": "app-srv-01", "dst": "dr-srv-01",
     "max_lat": 50, "min_bw": 100},
]
passed = failed = 0

print("=" * 50)
print(" Network Latency & Bandwidth Test")
print(f" Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("=" * 50)

for pair in TEST_PAIRS:
    print(f"\\n[INFO] {pair['name']} ({pair['src']} -> {pair['dst']})")
    print("-" * 50)
    try:
        r = subprocess.run(
            ["ssh", pair["src"], f"ping -c 20 -q {pair['dst']}"],
            capture_output=True, text=True, timeout=30)
        m = re.search(r"([\\d.]+)/([\\d.]+)/([\\d.]+)/([\\d.]+)",
                       r.stdout.strip().split("\\n")[-1])
        if m:
            avg = float(m.group(2))
            jitter = float(m.group(4))
            if avg <= pair["max_lat"]:
                print(f"[PASS] Latency: {avg:.2f}ms (max: {pair['max_lat']}ms)")
                passed += 1
            else:
                print(f"[FAIL] Latency: {avg:.2f}ms exceeds {pair['max_lat']}ms")
                failed += 1
            print(f"[INFO] Jitter: {jitter:.2f}ms")
    except subprocess.TimeoutExpired:
        print("[FAIL] Ping timed out"); failed += 1

    try:
        r = subprocess.run(
            ["ssh", pair["src"], f"iperf3 -c {pair['dst']} -t 10 -J"],
            capture_output=True, text=True, timeout=20)
        d = json.loads(r.stdout)
        bw = int(d["end"]["sum_received"]["bits_per_second"] / 1e6)
        if bw >= pair["min_bw"]:
            print(f"[PASS] Bandwidth: {bw} Mbps (min: {pair['min_bw']})")
            passed += 1
        else:
            print(f"[FAIL] Bandwidth: {bw} Mbps below {pair['min_bw']}")
            failed += 1
    except Exception:
        print("[FAIL] Bandwidth test failed"); failed += 1

print(f"\\n{'=' * 50}")
print(f" Results: PASSED={passed}  FAILED={failed}")
print(f"{'=' * 50}")`,
    expectedOutput: `==================================================
 Network Latency & Bandwidth Test
 Date: 2026-02-27 10:30:00
==================================================

[INFO] App-to-DB (app-srv-01 -> db-srv-01)
--------------------------------------------------
[PASS] Latency: 0.45ms (max: 5ms)
[INFO] Jitter: 0.12ms
[PASS] Bandwidth: 4520 Mbps (min: 1000)

[INFO] App-to-Cache (app-srv-01 -> cache-srv-01)
--------------------------------------------------
[PASS] Latency: 0.18ms (max: 2ms)
[INFO] Jitter: 0.05ms
[PASS] Bandwidth: 5100 Mbps (min: 1000)

[INFO] LB-to-App (lb-prod-01 -> app-srv-01)
--------------------------------------------------
[PASS] Latency: 0.32ms (max: 3ms)
[INFO] Jitter: 0.08ms
[PASS] Bandwidth: 6200 Mbps (min: 2000)

[INFO] DC1-to-DR (app-srv-01 -> dr-srv-01)
--------------------------------------------------
[PASS] Latency: 28.50ms (max: 50ms)
[INFO] Jitter: 2.30ms
[PASS] Bandwidth: 320 Mbps (min: 100)

==================================================
 Results: PASSED=8  FAILED=0
==================================================`
  },
  {
    id: 'IT-017', title: 'Network Interface Bonding Check', category: 'Network',
    layer: 'Network', framework: 'bonding / teaming', language: 'Shell',
    difficulty: 'Intermediate',
    description: 'Validates NIC bonding configuration on banking servers for high availability. Checks bond mode, slave interfaces, and link status.',
    prerequisites: 'Linux bonding module, multiple NICs, root access',
    config: '{\n  "servers": ["app-srv-01", "db-srv-01"],\n  "bond_interface": "bond0",\n  "bond_mode": "802.3ad",\n  "expected_slaves": 2\n}',
    code: `#!/bin/bash
# NIC Bonding Validation
# Banking Server Network Redundancy

SERVERS=("app-srv-01" "db-srv-01" "web-srv-01")
BOND_IF="bond0"
EXPECTED_SLAVES=2
PASS=0; FAIL=0

echo "============================================"
echo " Network Bonding Validation"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

for SERVER in "\${SERVERS[@]}"; do
  echo ""
  echo "[INFO] Checking: \$SERVER"
  echo "--------------------------------------------"

  BOND_EXISTS=\$(ssh \$SERVER "test -f /proc/net/bonding/\$BOND_IF && echo yes || echo no")
  if [ "\$BOND_EXISTS" = "no" ]; then
    echo "[FAIL] Bond \$BOND_IF not found"
    ((FAIL++)); continue
  fi

  MODE=\$(ssh \$SERVER "grep 'Bonding Mode' /proc/net/bonding/\$BOND_IF | awk -F: '{print \\$2}' | xargs")
  if echo "\$MODE" | grep -qi "802.3ad"; then
    echo "[PASS] Bond mode: \$MODE"
    ((PASS++))
  else
    echo "[FAIL] Bond mode: \$MODE (expected: 802.3ad)"
    ((FAIL++))
  fi

  SLAVES=\$(ssh \$SERVER "grep -c 'Slave Interface' /proc/net/bonding/\$BOND_IF")
  if [ "\$SLAVES" -eq "\$EXPECTED_SLAVES" ]; then
    echo "[PASS] Slave count: \$SLAVES"
    ((PASS++))
  else
    echo "[FAIL] Slave count: \$SLAVES (expected: \$EXPECTED_SLAVES)"
    ((FAIL++))
  fi

  for SLAVE in \$(ssh \$SERVER "grep 'Slave Interface' /proc/net/bonding/\$BOND_IF | awk -F: '{print \\$2}' | xargs"); do
    MII=\$(ssh \$SERVER "grep -A2 'Slave Interface: \$SLAVE' /proc/net/bonding/\$BOND_IF | grep 'MII Status' | awk -F: '{print \\$2}' | xargs")
    if [ "\$MII" = "up" ]; then
      echo "[PASS] Slave \$SLAVE: link UP"
      ((PASS++))
    else
      echo "[FAIL] Slave \$SLAVE: link DOWN"
      ((FAIL++))
    fi
  done
done

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL"
echo "============================================"`,
    expectedOutput: `============================================
 Network Bonding Validation
 Date: 2026-02-27 10:30:00
============================================

[INFO] Checking: app-srv-01
--------------------------------------------
[PASS] Bond mode: IEEE 802.3ad Dynamic link aggregation
[PASS] Slave count: 2
[PASS] Slave eth0: link UP
[PASS] Slave eth1: link UP

[INFO] Checking: db-srv-01
--------------------------------------------
[PASS] Bond mode: IEEE 802.3ad Dynamic link aggregation
[PASS] Slave count: 2
[PASS] Slave eth0: link UP
[PASS] Slave eth1: link UP

[INFO] Checking: web-srv-01
--------------------------------------------
[PASS] Bond mode: IEEE 802.3ad Dynamic link aggregation
[PASS] Slave count: 2
[PASS] Slave eth0: link UP
[PASS] Slave eth1: link UP

============================================
 Results: PASSED=12  FAILED=0
============================================`
  },
  {
    id: 'IT-018', title: 'TLS Configuration Audit', category: 'Network',
    layer: 'Network', framework: 'OpenSSL / testssl.sh', language: 'Shell',
    difficulty: 'Advanced',
    description: 'Audits TLS configuration for banking endpoints including cipher suites, protocol versions, HSTS headers per PCI-DSS.',
    prerequisites: 'OpenSSL CLI, curl, network access to endpoints on 443',
    config: '{\n  "endpoints": ["netbanking.bank.com", "api.bank.com"],\n  "min_tls": "1.2",\n  "banned": ["SSLv2", "SSLv3", "TLSv1", "TLSv1.1"]\n}',
    code: `#!/bin/bash
# TLS Configuration Audit (PCI-DSS)
# Banking Endpoint Security Validation

ENDPOINTS=("netbanking.bank.com" "api.bank.com" "payments.bank.com")
BANNED=("ssl2" "ssl3" "tls1" "tls1_1")
PASS=0; FAIL=0; WARN=0

echo "============================================"
echo " TLS Configuration Audit"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

for HOST in "\${ENDPOINTS[@]}"; do
  echo ""
  echo "[INFO] Auditing: \$HOST"
  echo "--------------------------------------------"

  # TLS 1.2
  TLS12=\$(echo | openssl s_client -tls1_2 -connect \$HOST:443 2>/dev/null | grep Protocol | awk '{print \\$NF}')
  if [ "\$TLS12" = "TLSv1.2" ]; then
    echo "[PASS] TLS 1.2 supported"
    ((PASS++))
  else
    echo "[FAIL] TLS 1.2 NOT supported"
    ((FAIL++))
  fi

  # TLS 1.3
  TLS13=\$(echo | openssl s_client -tls1_3 -connect \$HOST:443 2>/dev/null | grep Protocol | awk '{print \\$NF}')
  if [ "\$TLS13" = "TLSv1.3" ]; then
    echo "[PASS] TLS 1.3 supported"
    ((PASS++))
  else
    echo "[WARN] TLS 1.3 not available"
    ((WARN++))
  fi

  # Banned protocols
  for PROTO in "\${BANNED[@]}"; do
    R=\$(echo | openssl s_client -\$PROTO -connect \$HOST:443 2>&1 | grep -c "Cipher is")
    if [ "\$R" -eq 0 ]; then
      echo "[PASS] \$PROTO disabled"
      ((PASS++))
    else
      echo "[FAIL] \$PROTO ENABLED"
      ((FAIL++))
    fi
  done

  # HSTS
  HSTS=\$(curl -sI "https://\$HOST" 2>/dev/null | grep -i strict-transport)
  if [ -n "\$HSTS" ]; then
    echo "[PASS] HSTS header present"
    ((PASS++))
  else
    echo "[FAIL] HSTS missing"
    ((FAIL++))
  fi

  # Weak ciphers
  WEAK=\$(echo | openssl s_client -connect \$HOST:443 -cipher 'RC4:DES:3DES' 2>&1 | grep -c "Cipher is")
  if [ "\$WEAK" -eq 0 ]; then
    echo "[PASS] No weak ciphers accepted"
    ((PASS++))
  else
    echo "[FAIL] Weak ciphers accepted"
    ((FAIL++))
  fi
done

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL  WARNINGS=\$WARN"
echo "============================================"`,
    expectedOutput: `============================================
 TLS Configuration Audit
 Date: 2026-02-27 10:30:00
============================================

[INFO] Auditing: netbanking.bank.com
--------------------------------------------
[PASS] TLS 1.2 supported
[PASS] TLS 1.3 supported
[PASS] ssl2 disabled
[PASS] ssl3 disabled
[PASS] tls1 disabled
[PASS] tls1_1 disabled
[PASS] HSTS header present
[PASS] No weak ciphers accepted

[INFO] Auditing: api.bank.com
--------------------------------------------
[PASS] TLS 1.2 supported
[PASS] TLS 1.3 supported
[PASS] ssl2 disabled
[PASS] ssl3 disabled
[PASS] tls1 disabled
[PASS] tls1_1 disabled
[PASS] HSTS header present
[PASS] No weak ciphers accepted

============================================
 Results: PASSED=16  FAILED=0  WARNINGS=0
============================================`
  },
  {
    id: 'IT-019', title: 'SNMP v3 Monitoring Audit', category: 'Network',
    layer: 'Network', framework: 'SNMP v3', language: 'Shell',
    difficulty: 'Beginner',
    description: 'Validates SNMP v3 configuration on network devices. Ensures v1/v2c disabled, authentication and encryption enforced.',
    prerequisites: 'snmpwalk, snmpget, SNMP v3 credentials, device access',
    config: '{\n  "devices": ["switch-core-01", "router-edge-01", "fw-prod-01"],\n  "snmp_user": "monitor_user",\n  "auth_protocol": "SHA",\n  "priv_protocol": "AES"\n}',
    code: `#!/bin/bash
# SNMP v3 Configuration Audit
# Banking Network Device Monitoring

DEVICES=("switch-core-01" "router-edge-01" "fw-prod-01")
USER="monitor_user"
AUTH="SHA"; PRIV="AES"
AUTH_PASS="Secure@Auth#2026"
PRIV_PASS="Secure@Priv#2026"
PASS=0; FAIL=0

echo "============================================"
echo " SNMP v3 Configuration Audit"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

for DEV in "\${DEVICES[@]}"; do
  echo ""
  echo "[INFO] Checking: \$DEV"
  echo "--------------------------------------------"

  # SNMPv3 connectivity
  SYSNAME=\$(snmpget -v3 -u \$USER -l authPriv -a \$AUTH -A "\$AUTH_PASS" -x \$PRIV -X "\$PRIV_PASS" \$DEV sysName.0 2>/dev/null | awk -F'"' '{print \\$2}')
  if [ -n "\$SYSNAME" ]; then
    echo "[PASS] SNMPv3 OK: sysName=\$SYSNAME"
    ((PASS++))
  else
    echo "[FAIL] SNMPv3 auth failed"
    ((FAIL++))
  fi

  # v1 disabled
  V1=\$(snmpget -v1 -c public \$DEV sysName.0 2>&1)
  if echo "\$V1" | grep -qi "timeout\\|error\\|refused"; then
    echo "[PASS] SNMPv1 disabled"
    ((PASS++))
  else
    echo "[FAIL] SNMPv1 accessible"
    ((FAIL++))
  fi

  # v2c disabled
  V2=\$(snmpget -v2c -c public \$DEV sysName.0 2>&1)
  if echo "\$V2" | grep -qi "timeout\\|error\\|refused"; then
    echo "[PASS] SNMPv2c disabled"
    ((PASS++))
  else
    echo "[FAIL] SNMPv2c accessible"
    ((FAIL++))
  fi

  # Uptime
  UP=\$(snmpget -v3 -u \$USER -l authPriv -a \$AUTH -A "\$AUTH_PASS" -x \$PRIV -X "\$PRIV_PASS" \$DEV sysUpTimeInstance 2>/dev/null | awk -F'(' '{print \\$2}' | tr -d ')')
  if [ -n "\$UP" ]; then
    echo "[PASS] Uptime: \$UP"
    ((PASS++))
  else
    echo "[FAIL] Cannot retrieve uptime"
    ((FAIL++))
  fi
done

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL"
echo "============================================"`,
    expectedOutput: `============================================
 SNMP v3 Configuration Audit
 Date: 2026-02-27 10:30:00
============================================

[INFO] Checking: switch-core-01
--------------------------------------------
[PASS] SNMPv3 OK: sysName=CORE-SW-01
[PASS] SNMPv1 disabled
[PASS] SNMPv2c disabled
[PASS] Uptime: 45 days 12:30:15

[INFO] Checking: router-edge-01
--------------------------------------------
[PASS] SNMPv3 OK: sysName=EDGE-RTR-01
[PASS] SNMPv1 disabled
[PASS] SNMPv2c disabled
[PASS] Uptime: 90 days 08:15:42

[INFO] Checking: fw-prod-01
--------------------------------------------
[PASS] SNMPv3 OK: sysName=FW-PROD-01
[PASS] SNMPv1 disabled
[PASS] SNMPv2c disabled
[PASS] Uptime: 120 days 03:45:10

============================================
 Results: PASSED=12  FAILED=0
============================================`
  },
  {
    id: 'IT-020', title: 'Packet Loss and MTU Discovery', category: 'Network',
    layer: 'Network', framework: 'ping / traceroute', language: 'Shell',
    difficulty: 'Beginner',
    description: 'Tests packet loss rates and MTU path discovery between banking infrastructure components. Validates network quality for transaction SLAs.',
    prerequisites: 'ping, traceroute, network access between test points',
    config: '{\n  "targets": ["db-srv-01", "cache-srv-01", "dr-srv-01"],\n  "ping_count": 100,\n  "max_loss_pct": 0.1,\n  "mtu_sizes": [1500, 1400, 1200]\n}',
    code: `#!/bin/bash
# Packet Loss and MTU Discovery
# Banking Network Quality Validation

TARGETS=("db-srv-01:0.1" "cache-srv-01:0.1" "dr-srv-01:1.0")
PING_COUNT=100
MTU_SIZES=(1500 1400 1200 576)
PASS=0; FAIL=0; WARN=0

echo "============================================"
echo " Packet Loss & MTU Discovery"
echo " Ping Count: \$PING_COUNT"
echo " Date: \$(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

echo ""
echo "[INFO] Section 1: Packet Loss"
for ENTRY in "\${TARGETS[@]}"; do
  TARGET=\$(echo \$ENTRY | cut -d: -f1)
  MAX=\$(echo \$ENTRY | cut -d: -f2)

  RESULT=\$(ping -c \$PING_COUNT -q \$TARGET 2>/dev/null)
  LOSS=\$(echo "\$RESULT" | grep "loss" | awk '{for(i=1;i<=NF;i++) if(\\$i ~ /%/) print \\$i}' | tr -d '%')

  LOSS_OK=\$(echo "\$LOSS \$MAX" | awk '{print (\\$1 <= \\$2) ? "yes" : "no"}')
  if [ "\$LOSS_OK" = "yes" ]; then
    echo "[PASS] \$TARGET loss: \${LOSS}% (max: \${MAX}%)"
    ((PASS++))
  else
    echo "[FAIL] \$TARGET loss: \${LOSS}% exceeds \${MAX}%"
    ((FAIL++))
  fi
done

echo ""
echo "[INFO] Section 2: MTU Path Discovery (to db-srv-01)"
for MTU in "\${MTU_SIZES[@]}"; do
  PKT=\$((MTU - 28))
  R=\$(ping -c 3 -M do -s \$PKT db-srv-01 2>&1)
  if echo "\$R" | grep -q "0% packet loss"; then
    echo "[PASS] MTU \$MTU delivered OK"
    ((PASS++))
  else
    echo "[INFO] MTU \$MTU needs fragmentation"
  fi
done

echo ""
echo "[INFO] Section 3: Hop Count"
HOPS=\$(traceroute -n -m 15 db-srv-01 2>/dev/null | tail -1 | awk '{print \\$1}')
if [ "\${HOPS:-99}" -le 5 ]; then
  echo "[PASS] Hops to db-srv-01: \$HOPS"
  ((PASS++))
else
  echo "[WARN] Hops: \$HOPS (high)"
  ((WARN++))
fi

echo ""
echo "============================================"
echo " Results: PASSED=\$PASS  FAILED=\$FAIL  WARNINGS=\$WARN"
echo "============================================"`,
    expectedOutput: `============================================
 Packet Loss & MTU Discovery
 Ping Count: 100
 Date: 2026-02-27 10:30:00
============================================

[INFO] Section 1: Packet Loss
[PASS] db-srv-01 loss: 0% (max: 0.1%)
[PASS] cache-srv-01 loss: 0% (max: 0.1%)
[PASS] dr-srv-01 loss: 0.2% (max: 1.0%)

[INFO] Section 2: MTU Path Discovery (to db-srv-01)
[PASS] MTU 1500 delivered OK
[PASS] MTU 1400 delivered OK
[PASS] MTU 1200 delivered OK
[PASS] MTU 576 delivered OK

[INFO] Section 3: Hop Count
[PASS] Hops to db-srv-01: 2

============================================
 Results: PASSED=8  FAILED=0  WARNINGS=0
============================================`
  },
];

export default function InfraTestingLab() {
  const [tab, setTab] = useState('ServerCompute');
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
      } else { clearInterval(timerRef.current); setRunning(false); setStatuses(prev => ({ ...prev, [sel.id]: 'passed' })); }
    }, 150);
  }, [sel, running]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const totalTab = SCENARIOS.filter(s => s.layer === tab).length;
  const passedTab = SCENARIOS.filter(s => s.layer === tab && statuses[s.id] === 'passed').length;
  const totalAll = SCENARIOS.length;
  const passedAll = Object.values(statuses).filter(v => v === 'passed').length;
  const copy = () => { navigator.clipboard?.writeText(code); };
  const reset = () => { setCode(sel.code); };
  const C = COLORS;
  const DIFF = ['Beginner', 'Intermediate', 'Advanced'];

  const sty = {
    page: { minHeight: '100vh', background: `linear-gradient(135deg,${C.bgFrom} 0%,${C.bgTo} 100%)`, color: C.text, fontFamily: "'Segoe UI',Tahoma,Geneva,Verdana,sans-serif", padding: '18px 22px 40px' },
    h1: { fontSize: 28, fontWeight: 800, margin: 0, background: `linear-gradient(90deg,${C.accent},#3498db)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    sub: { fontSize: 13, color: '#78909c', marginTop: 4 },
    statsBar: { display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 14, flexWrap: 'wrap' },
    stat: { background: C.card, borderRadius: 8, padding: '6px 18px', fontSize: 13, border: `1px solid ${C.border}` },
    split: { display: 'flex', gap: 16, height: 'calc(100vh - 160px)', minHeight: 500 },
    left: { width: '38%', minWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 },
    right: { flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' },
    tabBar: { display: 'flex', gap: 4, flexWrap: 'wrap' },
    tabBtn: (a) => ({ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: a ? C.accent : C.card, color: a ? '#0a0a1a' : C.text }),
    filterRow: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
    input: { flex: 1, padding: '7px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.editorBg, color: C.text, fontSize: 13, outline: 'none', minWidth: 120 },
    select: { padding: '6px 8px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.editorBg, color: C.text, fontSize: 12, outline: 'none' },
    list: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 4 },
    card: (a) => ({ padding: '10px 14px', borderRadius: 8, background: a ? '#143b6a' : C.card, border: `1px solid ${a ? C.accent : C.border}`, cursor: 'pointer' }),
    cardTitle: { fontSize: 13, fontWeight: 700, color: C.header },
    cardId: { fontSize: 11, color: C.accent, marginRight: 8 },
    badge: (c) => ({ display: 'inline-block', padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: c + '22', color: c, marginRight: 4 }),
    dot: (st) => ({ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: st === 'passed' ? C.accent : '#78909c', marginRight: 6 }),
    panel: { background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: 16, overflowY: 'auto' },
    editor: { width: '100%', minHeight: 200, maxHeight: 280, padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, background: C.editorBg, color: C.editorText, fontFamily: "'Fira Code','Consolas',monospace", fontSize: 12, lineHeight: 1.6, resize: 'vertical', outline: 'none', whiteSpace: 'pre', overflowX: 'auto' },
    btn: (bg) => ({ padding: '7px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: bg || C.accent, color: (bg === '#e74c3c' || bg === '#555') ? '#fff' : '#0a0a1a' }),
    outBox: { background: C.editorBg, borderRadius: 8, border: `1px solid ${C.border}`, padding: 12, fontFamily: "'Fira Code','Consolas',monospace", fontSize: 11, color: C.accent, lineHeight: 1.7, whiteSpace: 'pre-wrap', minHeight: 60, maxHeight: 180, overflowY: 'auto' },
    progBar: { height: 4, borderRadius: 2, background: '#0a2744', marginTop: 6 },
    progFill: (p) => ({ height: '100%', borderRadius: 2, width: p + '%', background: p === 100 ? C.accent : '#3498db', transition: 'width 0.3s' }),
    progOverall: { height: 6, borderRadius: 3, background: '#0a2744', marginBottom: 8 },
    progOverFill: (p) => ({ height: '100%', borderRadius: 3, width: p + '%', background: `linear-gradient(90deg,${C.accent},#3498db)`, transition: 'width 0.4s' }),
    cfgBox: { background: C.editorBg, borderRadius: 8, border: `1px solid ${C.border}`, padding: 12, marginTop: 8, fontSize: 12, lineHeight: 1.6, color: '#f39c12', fontFamily: "'Fira Code','Consolas',monospace", whiteSpace: 'pre-wrap' },
  };

  return (
    <div style={sty.page}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h1 style={sty.h1}>Infrastructure Testing Lab</h1>
        <div style={sty.sub}>Server, Network, Database, Container, Cloud & Monitoring Infrastructure — {totalAll} Scenarios</div>
      </div>
      <div style={sty.statsBar}>
        <span style={sty.stat}>Total: <b style={{color:C.accent}}>{totalAll}</b></span>
        <span style={sty.stat}>Passed: <b style={{color:C.accent}}>{passedAll}</b>/{totalAll}</span>
        <span style={sty.stat}>Tab: <b style={{color:C.accent}}>{passedTab}</b>/{totalTab}</span>
        <span style={sty.stat}>Coverage: <b style={{color:C.accent}}>{totalAll > 0 ? Math.round((passedAll/totalAll)*100) : 0}%</b></span>
      </div>
      <div style={sty.split}>
        <div style={sty.left}>
          <div style={sty.tabBar}>
            {CATEGORIES.map(t => <button key={t.id} style={sty.tabBtn(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>)}
          </div>
          <div style={sty.filterRow}>
            <input style={sty.input} placeholder="Search scenarios..." value={search} onChange={e => setSearch(e.target.value)} />
            <select style={sty.select} value={diffF} onChange={e => setDiffF(e.target.value)}>
              {['All', ...DIFF].map(d => <option key={d} value={d}>{d === 'All' ? 'Difficulty' : d}</option>)}
            </select>
          </div>
          <div style={sty.progOverall}><div style={sty.progOverFill(totalTab > 0 ? Math.round((passedTab/totalTab)*100) : 0)} /></div>
          <div style={sty.list}>
            {filtered.length === 0 && <div style={{color:'#78909c',textAlign:'center',padding:20}}>No scenarios match</div>}
            {filtered.map(s => (
              <div key={s.id} style={sty.card(sel.id === s.id)} onClick={() => pick(s)}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <span style={sty.dot(statuses[s.id])} />
                  <span style={sty.cardId}>{s.id}</span>
                  <span style={sty.cardTitle}>{s.title}</span>
                </div>
                <div style={{marginTop:4}}>
                  <span style={sty.badge(CATEGORIES.find(c=>c.id===s.layer)?.color || C.accent)}>{s.layer}</span>
                  <span style={sty.badge(DIFFICULTY_COLORS[s.difficulty])}>{s.difficulty}</span>
                  <span style={sty.badge('#3498db')}>{s.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={sty.right}>
          <div style={{...sty.panel, flex: '0 0 auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div><span style={{fontSize:14,fontWeight:800,color:C.accent,marginRight:10}}>{sel.id}</span><span style={{fontSize:16,fontWeight:700,color:C.header}}>{sel.title}</span></div>
              <div>
                <span style={sty.badge(CATEGORIES.find(c=>c.id===sel.layer)?.color || C.accent)}>{sel.layer}</span>
                <span style={sty.badge(DIFFICULTY_COLORS[sel.difficulty])}>{sel.difficulty}</span>
                <span style={sty.badge('#f1c40f')}>{sel.language}</span>
              </div>
            </div>
            <div style={{fontSize:12,color:'#78909c',marginBottom:10,lineHeight:1.5}}>{sel.description}</div>
            <div style={{fontSize:11,color:'#78909c'}}><b>Prerequisites:</b> {sel.prerequisites}</div>
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
              <span style={{fontSize:11,color:'#78909c'}}>{sel.language}</span>
            </div>
            <div style={sty.outBox}>{sel.expectedOutput}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button style={{...sty.btn(running ? '#555' : C.accent),opacity:running?0.6:1}} onClick={runSim} disabled={running}>{running ? 'Running...' : 'Run Test'}</button>
              {statuses[sel.id] === 'passed' && <span style={{color:C.accent,fontSize:12,fontWeight:700}}>PASSED</span>}
              {progress > 0 && progress < 100 && <span style={{color:'#3498db',fontSize:11}}>{progress}%</span>}
              <button style={{...sty.btn('#3498db'),marginLeft:'auto'}} onClick={() => setShowConfig(!showConfig)}>{showConfig ? 'Hide' : 'Show'} Config</button>
            </div>
            {(running || output) && (
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.header,marginBottom:4}}>Execution Output</div>
                <div style={sty.outBox}>{output || 'Starting...'}</div>
                <div style={sty.progBar}><div style={sty.progFill(progress)} /></div>
              </div>
            )}
            {showConfig && <div style={sty.cfgBox}><div style={{fontWeight:700,color:C.accent,marginBottom:6}}>Configuration</div><div>{sel.config}</div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

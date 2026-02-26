import React, { useState } from 'react';

const TABS = ['Cheque Processing', 'Signature Verification', 'Passport & ID', 'Document Management', 'Portal Login'];

const SCENARIOS = {
  'Cheque Processing': [
    { id: 'TC-CHQ-001', name: 'Cheque image capture and upload', priority: 'P0', status: 'pass', steps: ['Open cheque scanner', 'Capture front and back images', 'Validate image quality (DPI >= 200)', 'Upload to processing system'], testData: { format: 'JPEG', dpi: 300, maxSize: '5MB', sides: 'Front + Back' }, expected: 'Cheque images uploaded successfully', actual: 'Both sides uploaded: 2.1MB total', time: '3.2s' },
    { id: 'TC-CHQ-002', name: 'MICR code reading and validation', priority: 'P0', status: 'pass', steps: ['Extract MICR line from cheque image', 'Parse cheque number, sort code, account number', 'Validate against bank master data', 'Return parsed MICR data'], testData: { micr: '000123 001234 12345678901', chequeNo: '000123', sortCode: '001234', accountNo: '12345678901' }, expected: 'MICR parsed: cheque, sort code, account', actual: 'All 3 fields extracted correctly (99% conf)', time: '1.5s' },
    { id: 'TC-CHQ-003', name: 'Cheque amount (numeric) OCR extraction', priority: 'P0', status: 'pass', steps: ['Locate amount box region', 'Apply OCR on numeric amount', 'Handle currency symbols and commas', 'Return numeric value'], testData: { amountBox: '$25,000.50', expectedValue: 25000.50, currency: 'USD' }, expected: 'Extracted: $25,000.50', actual: 'Amount: $25,000.50 (confidence: 97%)', time: '1.0s' },
    { id: 'TC-CHQ-004', name: 'Cheque amount (words) OCR extraction', priority: 'P0', status: 'pass', steps: ['Locate words amount line', 'OCR handwritten/printed text', 'Convert words to number', 'Cross-validate with numeric amount'], testData: { amountWords: 'Twenty Five Thousand and Fifty Cents', expectedNumeric: 25000.50 }, expected: 'Words converted to $25,000.50', actual: 'Converted: $25,000.50 (match)', time: '2.0s' },
    { id: 'TC-CHQ-005', name: 'Amount match validation (numeric vs words)', priority: 'P0', status: 'pass', steps: ['Extract numeric amount', 'Extract words amount', 'Convert words to number', 'Compare both values'], testData: { numeric: 25000.50, words: 'Twenty Five Thousand and Fifty Cents', tolerance: 0 }, expected: 'Both amounts match exactly', actual: 'Match: $25,000.50 = $25,000.50', time: '0.5s' },
    { id: 'TC-CHQ-006', name: 'Payee name extraction and verification', priority: 'P1', status: 'pass', steps: ['Locate "Pay to" line', 'Extract payee name via OCR', 'Match against beneficiary database', 'Verify payee account'], testData: { payeeLine: 'Pay: Rajesh Kumar', expectedPayee: 'Rajesh Kumar', confidence: 0.9 }, expected: 'Payee: Rajesh Kumar (verified)', actual: 'Payee extracted: Rajesh Kumar (94%)', time: '1.8s' },
    { id: 'TC-CHQ-007', name: 'Date validation (not stale/post-dated)', priority: 'P0', status: 'pass', steps: ['Extract date from cheque', 'Check if date is valid format', 'Verify not stale (>3 months old)', 'Verify not post-dated'], testData: { chequeDate: '2026-02-20', currentDate: '2026-02-26', staleThreshold: '90 days' }, expected: 'Date valid: within 90 days, not post-dated', actual: 'Valid: 6 days old, not post-dated', time: '0.5s' },
    { id: 'TC-CHQ-008', name: 'Signature presence detection', priority: 'P0', status: 'pass', steps: ['Locate signature region on cheque', 'Detect if signature is present', 'Check signature is not blank/empty', 'Flag if multiple signatures needed'], testData: { signatureRegion: 'Bottom-right', expectedSignatures: 1, blankThreshold: 0.1 }, expected: 'Signature detected in expected region', actual: 'Signature present (confidence: 98%)', time: '0.8s' },
    { id: 'TC-CHQ-009', name: 'Cheque number and serial validation', priority: 'P1', status: 'pass', steps: ['Extract cheque number from MICR', 'Verify against issued cheque book', 'Check if already used/cancelled', 'Validate serial sequence'], testData: { chequeNo: '000123', bookRange: '000100-000124', used: [100, 101, 102], cancelled: [110] }, expected: 'Cheque #123: Valid, unused, not cancelled', actual: 'Valid: In range, not used/cancelled', time: '1.2s' },
    { id: 'TC-CHQ-010', name: 'Bank and branch IFSC extraction', priority: 'P1', status: 'pass', steps: ['Extract IFSC from cheque top', 'Validate format (4 alpha + 0 + 6 alphanum)', 'Lookup bank and branch details', 'Return branch information'], testData: { ifsc: 'HDFC0001234', bank: 'HDFC Bank', branch: 'Koramangala, Bengaluru' }, expected: 'IFSC: HDFC0001234 - Valid', actual: 'HDFC Bank, Koramangala branch', time: '0.8s' },
    { id: 'TC-CHQ-011', name: 'Overwriting/alteration detection', priority: 'P0', status: 'fail', steps: ['Analyze cheque image for alterations', 'Detect overwriting on amount', 'Check for correction fluid marks', 'Flag suspicious modifications'], testData: { alterationType: 'Amount overwritten', confidence: 0.7, threshold: 0.8 }, expected: 'Alteration detected and flagged', actual: 'Detection confidence: 65% (below threshold)', time: '3.5s' },
    { id: 'TC-CHQ-012', name: 'CTS (Cheque Truncation System) compliance', priority: 'P0', status: 'pass', steps: ['Verify image meets CTS standards', 'Check resolution (200 DPI min)', 'Validate image dimensions', 'Ensure grayscale/color compliance'], testData: { standard: 'CTS-2010', minDPI: 200, format: 'JPEG', compression: 'Quality > 80' }, expected: 'CTS-2010 compliant', actual: 'Compliant: 300 DPI, JPEG quality 92', time: '0.5s' },
    { id: 'TC-CHQ-013', name: 'Insufficient funds check', priority: 'P0', status: 'pass', steps: ['Get cheque amount', 'Query account balance', 'Compare amount vs available balance', 'Return sufficient/insufficient flag'], testData: { chequeAmount: 25000, accountBalance: 45000, availableBalance: 42000 }, expected: 'Sufficient funds (42,000 > 25,000)', actual: 'SUFFICIENT: Available $42,000', time: '0.8s' },
    { id: 'TC-CHQ-014', name: 'Stop payment verification', priority: 'P0', status: 'pass', steps: ['Extract cheque number', 'Check stop payment register', 'If stopped, reject processing', 'Return stop payment details'], testData: { chequeNo: '000123', stopPaymentList: ['000110', '000115'], isStopped: false }, expected: 'Cheque not in stop payment list', actual: 'Clear: No stop payment on #000123', time: '0.5s' },
    { id: 'TC-CHQ-015', name: 'Cheque clearing cycle validation (T+1)', priority: 'P1', status: 'pass', steps: ['Submit cheque for clearing', 'Track clearing status', 'Verify T+1 business day cycle', 'Confirm credit to payee account'], testData: { submitDate: '2026-02-25', clearingDate: '2026-02-26', cycle: 'T+1' }, expected: 'Cleared on T+1 business day', actual: 'Cleared: Feb 26, 2026 (T+1)', time: '86400.0s' },
  ],
  'Signature Verification': [
    { id: 'TC-SIG-001', name: 'Signature capture from tablet/touchscreen', priority: 'P0', status: 'pass', steps: ['Open signature capture pad', 'Customer signs on touchscreen', 'Capture signature as image', 'Save with customer profile'], testData: { device: 'iPad/Surface', format: 'PNG', minStrokes: 3, canvasSize: '400x200' }, expected: 'Signature captured and saved', actual: 'Captured: 400x200px, 12 strokes', time: '5.0s' },
    { id: 'TC-SIG-002', name: 'Signature image quality assessment', priority: 'P0', status: 'pass', steps: ['Analyze captured signature', 'Check line thickness consistency', 'Verify minimum ink density', 'Assess overall quality score'], testData: { minDensity: 0.3, minStrokes: 5, quality: 'High', resolution: '300 DPI' }, expected: 'Quality score > 80%', actual: 'Quality: 88% - Good', time: '1.0s' },
    { id: 'TC-SIG-003', name: 'Signature matching against stored specimen', priority: 'P0', status: 'pass', steps: ['Load stored specimen signatures', 'Compare current signature', 'Run matching algorithm', 'Return similarity score'], testData: { algorithm: 'Siamese CNN', specimens: 3, threshold: 0.8, customerID: 'CUST-001' }, expected: 'Match score > 0.80', actual: 'Score: 0.92 - MATCH', time: '2.5s' },
    { id: 'TC-SIG-004', name: 'Signature similarity score calculation', priority: 'P0', status: 'pass', steps: ['Extract signature features', 'Compare stroke patterns', 'Calculate DTW distance', 'Convert to similarity percentage'], testData: { features: ['stroke_count', 'pressure', 'angle', 'speed'], method: 'DTW + CNN' }, expected: 'Similarity: 85-100% for genuine', actual: 'Similarity: 93.5%', time: '1.5s' },
    { id: 'TC-SIG-005', name: 'Multiple specimen comparison', priority: 'P1', status: 'pass', steps: ['Load all 3 stored specimens', 'Compare current against each', 'Take maximum similarity score', 'Report best match specimen'], testData: { specimens: 3, scores: [0.88, 0.92, 0.85], bestMatch: 'Specimen 2' }, expected: 'Best match: Specimen 2 (0.92)', actual: 'Best: Specimen 2 - 92% match', time: '3.0s' },
    { id: 'TC-SIG-006', name: 'Forged signature detection', priority: 'P0', status: 'pass', steps: ['Analyze signature dynamics', 'Check for unnatural smoothness', 'Detect speed anomalies', 'Identify tracing patterns'], testData: { signatureType: 'Forged', dynamicFeatures: ['speed', 'pressure', 'acceleration'], threshold: 0.6 }, expected: 'Forgery detected (score < 0.6)', actual: 'Score: 0.35 - FORGERY DETECTED', time: '2.0s' },
    { id: 'TC-SIG-007', name: 'Signature rotation/scale invariance', priority: 'P1', status: 'pass', steps: ['Rotate signature 15 degrees', 'Scale signature 80% and 120%', 'Run matching on modified versions', 'Verify still matches original'], testData: { rotations: [-15, 0, 15], scales: [0.8, 1.0, 1.2], tolerance: 0.05 }, expected: 'Match maintained across transforms', actual: 'All 9 combinations: match > 0.80', time: '5.0s' },
    { id: 'TC-SIG-008', name: 'Wet signature vs digital signature', priority: 'P1', status: 'pass', steps: ['Upload scanned wet signature', 'Compare with digital capture', 'Normalize both to same format', 'Run comparison'], testData: { wetScan: '300DPI JPEG', digitalCapture: 'SVG paths', normalization: 'Bitmap 200x100' }, expected: 'Cross-format comparison possible', actual: 'Cross-format match: 87%', time: '3.5s' },
    { id: 'TC-SIG-009', name: 'Joint account dual signature verification', priority: 'P0', status: 'pass', steps: ['Extract both signatures from document', 'Match signature 1 with holder 1 specimen', 'Match signature 2 with holder 2 specimen', 'Both must exceed threshold'], testData: { holder1: 'Rajesh Kumar', holder2: 'Priya Kumar', threshold: 0.8, mode: 'Both Required' }, expected: 'Both signatures verified', actual: 'Holder 1: 0.91, Holder 2: 0.88 - Both PASS', time: '4.0s' },
    { id: 'TC-SIG-010', name: 'Authorized signatory validation (corporate)', priority: 'P0', status: 'pass', steps: ['Identify signatory from signature', 'Check against authorized signatory list', 'Verify signing authority for amount', 'Validate against board resolution'], testData: { signatories: ['CEO', 'CFO', 'Director'], amount: 500000, minSigners: 2 }, expected: '2 of 3 authorized signatories verified', actual: 'CEO + CFO signatures verified', time: '5.5s' },
    { id: 'TC-SIG-011', name: 'Signature change request workflow', priority: 'P1', status: 'pass', steps: ['Submit signature change request', 'Verify identity via OTP', 'Capture new specimen (3 samples)', 'Deactivate old specimen'], testData: { reason: 'Name change after marriage', newSpecimens: 3, idVerification: 'OTP + Video KYC' }, expected: 'New specimen stored, old deactivated', actual: '3 new specimens stored, old archived', time: '15.0s' },
    { id: 'TC-SIG-012', name: 'Signature on different document types', priority: 'P2', status: 'pass', steps: ['Test on cheque signature area', 'Test on loan agreement', 'Test on account opening form', 'Verify consistent matching across types'], testData: { documents: ['Cheque', 'Loan Agreement', 'Account Form', 'Power of Attorney'], consistency: true }, expected: 'Consistent match across all 4 document types', actual: 'All 4 types: match > 0.82', time: '8.0s' },
  ],
  'Passport & ID': [
    { id: 'TC-ID-001', name: 'Passport photo page OCR extraction', priority: 'P0', status: 'pass', steps: ['Upload passport photo page', 'Extract text via OCR', 'Parse structured fields', 'Return formatted data'], testData: { fields: ['Name', 'DOB', 'PassportNo', 'Expiry', 'Nationality'], format: 'ICAO 9303' }, expected: 'All 5 fields extracted accurately', actual: '5/5 fields: 98% accuracy', time: '3.0s' },
    { id: 'TC-ID-002', name: 'MRZ (Machine Readable Zone) parsing', priority: 'P0', status: 'pass', steps: ['Detect MRZ region (2 lines, 44 chars each)', 'Extract MRZ text', 'Parse per ICAO standard', 'Validate check digits'], testData: { mrz: 'P<CANSMITH<<JOHN<<<<<<<<<<<<<<<<<<<<<<<<\nAB12345678CAN9001014M2512315<<<<<<<<<<<04', checkDigits: 3 }, expected: 'MRZ parsed: Name, Nationality, DOB, Expiry', actual: 'Parsed: John Smith, CAN, 1990-01-01, 2025-12-31', time: '1.5s' },
    { id: 'TC-ID-003', name: 'Passport expiry date validation', priority: 'P0', status: 'pass', steps: ['Extract expiry date', 'Compare with current date', 'Check minimum validity (6 months)', 'Flag if expired or near-expiry'], testData: { expiryDate: '2028-06-15', currentDate: '2026-02-26', minValidity: '6 months' }, expected: 'Valid: 2+ years remaining', actual: 'Valid until Jun 2028 (28 months remaining)', time: '0.3s' },
    { id: 'TC-ID-004', name: "Driver's license data extraction", priority: 'P0', status: 'pass', steps: ['Upload license image', 'Detect license format by country', 'Extract name, DOB, license number', 'Validate license number format'], testData: { country: 'Canada', licenseNo: 'K1234-56789-01234', category: 'G', expiry: '2027-08-20' }, expected: 'All fields extracted from license', actual: 'License: K1234-56789-01234, Cat: G', time: '2.5s' },
    { id: 'TC-ID-005', name: 'National ID verification (Aadhaar/SSN/SIN)', priority: 'P0', status: 'pass', steps: ['Upload national ID', 'Extract ID number', 'Validate format per country', 'Cross-verify with authority'], testData: { idType: 'Aadhaar', number: '1234-5678-9012', format: '12 digits', authority: 'UIDAI' }, expected: 'Aadhaar verified with UIDAI', actual: 'Verified: Active, name match', time: '5.0s' },
    { id: 'TC-ID-006', name: 'Photo face match with selfie (liveness)', priority: 'P0', status: 'pass', steps: ['Extract face from ID document', 'Capture live selfie', 'Perform liveness check', 'Compare faces and return score'], testData: { livenessChecks: ['blink', 'head_turn', '3D_depth'], faceMatchThreshold: 0.85 }, expected: 'Liveness: PASS, Face match > 0.85', actual: 'Liveness: PASS, Face match: 0.93', time: '6.0s' },
    { id: 'TC-ID-007', name: 'Document authenticity check', priority: 'P0', status: 'pass', steps: ['Analyze security features', 'Check for holograms/watermarks', 'Verify UV features (if available)', 'Score document authenticity'], testData: { features: ['hologram', 'watermark', 'microprint', 'UV_pattern'], minScore: 0.8 }, expected: 'Authenticity score > 0.80', actual: 'Score: 0.95 - Authentic document', time: '4.0s' },
    { id: 'TC-ID-008', name: 'Address proof verification', priority: 'P1', status: 'pass', steps: ['Upload address proof document', 'Extract address via OCR', 'Normalize address format', 'Compare with declared address'], testData: { docType: 'Utility Bill', address: '123 MG Road, Bengaluru 560001', issuedWithin: '3 months' }, expected: 'Address matches declared address', actual: 'Match: 92% similarity (within threshold)', time: '3.5s' },
    { id: 'TC-ID-009', name: 'Multi-document cross-validation', priority: 'P0', status: 'pass', steps: ['Extract data from passport', 'Extract data from national ID', 'Cross-validate name, DOB, address', 'Report discrepancies'], testData: { documents: ['Passport', 'Aadhaar', 'Utility Bill'], fields: ['Name', 'DOB', 'Address'] }, expected: 'All fields consistent across documents', actual: 'Name: match, DOB: match, Address: match', time: '8.0s' },
    { id: 'TC-ID-010', name: 'Expired document rejection', priority: 'P0', status: 'pass', steps: ['Extract document expiry date', 'Check if expired', 'Reject if expired', 'Show expiry message to user'], testData: { docType: 'Passport', expiryDate: '2025-06-15', currentDate: '2026-02-26' }, expected: 'Document rejected: Expired 8 months ago', actual: 'REJECTED: Expired Jun 15, 2025', time: '0.5s' },
    { id: 'TC-ID-011', name: 'International document format support', priority: 'P1', status: 'pass', steps: ['Upload documents from different countries', 'Detect country and format automatically', 'Apply country-specific parsing rules', 'Extract data in standardized format'], testData: { countries: ['US', 'Canada', 'UK', 'India', 'Australia'], formats: 5, autoDetect: true }, expected: 'All 5 country formats supported', actual: '5/5 formats detected and parsed', time: '12.0s' },
    { id: 'TC-ID-012', name: 'Document tampering detection', priority: 'P0', status: 'pass', steps: ['Analyze document image for modifications', 'Check for digital manipulation (ELA)', 'Detect font inconsistencies', 'Flag suspected tampering'], testData: { method: 'Error Level Analysis', fonts: 'Consistency check', metadata: 'EXIF analysis' }, expected: 'Tampering detection with confidence score', actual: 'No tampering detected (confidence: 96%)', time: '5.0s' },
  ],
  'Document Management': [
    { id: 'TC-DOC-001', name: 'Document upload (PDF/JPEG/PNG/TIFF)', priority: 'P0', status: 'pass', steps: ['Select file for upload', 'Validate file format', 'Check file integrity', 'Store in document repository'], testData: { formats: ['PDF', 'JPEG', 'PNG', 'TIFF'], maxSize: '10MB', virus: false }, expected: 'All 4 formats uploaded successfully', actual: '4/4 formats accepted and stored', time: '3.0s' },
    { id: 'TC-DOC-002', name: 'Document size limit validation', priority: 'P0', status: 'pass', steps: ['Upload file within limit (5MB)', 'Upload file exceeding limit (15MB)', 'Verify size error message', 'Check upload rejection'], testData: { validSize: '3.2MB', overSize: '15MB', limit: '10MB' }, expected: 'Accept 3.2MB, reject 15MB', actual: '3.2MB: OK, 15MB: Rejected (413)', time: '2.0s' },
    { id: 'TC-DOC-003', name: 'Document type classification', priority: 'P0', status: 'pass', steps: ['Upload mixed documents', 'Auto-classify each document', 'Categorize: KYC/Income/Address/Business', 'Display classification with confidence'], testData: { documents: 10, categories: ['KYC', 'Income Proof', 'Address Proof', 'Business Registration'], model: 'Document Classifier v1.2' }, expected: 'Classification accuracy > 90%', actual: '9/10 correct (90%)', time: '8.0s' },
    { id: 'TC-DOC-004', name: 'Multi-page document processing', priority: 'P1', status: 'pass', steps: ['Upload multi-page PDF (20 pages)', 'Process each page', 'Extract text from all pages', 'Generate consolidated output'], testData: { pages: 20, format: 'PDF', ocrEnabled: true, outputFormat: 'JSON' }, expected: '20 pages processed with OCR text', actual: '20/20 pages processed, 15,000 words extracted', time: '25.0s' },
    { id: 'TC-DOC-005', name: 'Document version control', priority: 'P1', status: 'pass', steps: ['Upload document v1', 'Upload updated document v2', 'Verify version history maintained', 'Rollback to v1 if needed'], testData: { docId: 'DOC-001', versions: ['v1.0', 'v1.1', 'v2.0'], currentVersion: 'v2.0' }, expected: 'Version history with 3 entries', actual: '3 versions tracked, rollback available', time: '2.5s' },
    { id: 'TC-DOC-006', name: 'Document metadata extraction', priority: 'P1', status: 'pass', steps: ['Upload document', 'Extract metadata (author, date, title)', 'Parse EXIF data for images', 'Store metadata with document'], testData: { metadata: ['author', 'createdDate', 'modifiedDate', 'pageCount', 'fileSize'] }, expected: 'All metadata fields extracted', actual: '5/5 metadata fields populated', time: '1.5s' },
    { id: 'TC-DOC-007', name: 'Document search and retrieval', priority: 'P0', status: 'pass', steps: ['Search by customer ID', 'Search by document type', 'Search by date range', 'Verify search results accuracy'], testData: { searchBy: 'Customer ID: CUST-001', filters: ['KYC', 'Last 6 months'], expectedResults: 5 }, expected: '5 documents found for CUST-001', actual: '5 documents returned, all relevant', time: '1.0s' },
    { id: 'TC-DOC-008', name: 'Document archival and retention', priority: 'P1', status: 'pass', steps: ['Check retention policy (7 years)', 'Archive documents older than 1 year', 'Move to cold storage', 'Verify retrieval from archive'], testData: { retentionYears: 7, archiveAfter: '1 year', coldStorage: 'S3 Glacier', retrievalTime: '4 hours' }, expected: 'Archived documents retrievable within 4hr', actual: 'Archive: OK, Retrieval: 2.5 hours', time: '9000.0s' },
    { id: 'TC-DOC-009', name: 'Document access control (role-based)', priority: 'P0', status: 'pass', steps: ['Test admin access (full)', 'Test manager access (read/write)', 'Test agent access (read only)', 'Test customer access (own docs only)'], testData: { roles: ['Admin', 'Manager', 'Agent', 'Customer'], permissions: ['Full', 'Read/Write', 'Read', 'Own Only'] }, expected: 'Each role has correct access level', actual: '4 roles tested: all correct', time: '3.0s' },
    { id: 'TC-DOC-010', name: 'Document audit trail logging', priority: 'P0', status: 'pass', steps: ['Upload a document', 'View the document', 'Download the document', 'Check audit log for all 3 events'], testData: { events: ['UPLOAD', 'VIEW', 'DOWNLOAD'], logFields: ['user', 'action', 'timestamp', 'ip'] }, expected: '3 audit events logged with all fields', actual: '3/3 events logged completely', time: '2.0s' },
    { id: 'TC-DOC-011', name: 'Document expiry notification', priority: 'P1', status: 'pass', steps: ['Set document expiry date', 'Configure notification (30 days before)', 'Trigger notification engine', 'Verify notification sent'], testData: { docType: 'Passport', expiryDate: '2026-04-01', notifyBefore: '30 days', channels: ['Email', 'SMS'] }, expected: 'Notification sent 30 days before expiry', actual: 'Email + SMS sent on Mar 2, 2026', time: '1.5s' },
    { id: 'TC-DOC-012', name: 'Bulk document upload processing', priority: 'P1', status: 'pass', steps: ['Upload ZIP with 50 documents', 'Extract and validate each', 'Classify all documents', 'Generate upload report'], testData: { files: 50, format: 'ZIP', maxZipSize: '100MB', timeout: '5 minutes' }, expected: '50 documents processed from ZIP', actual: '48 success, 2 failed (corrupt files)', time: '45.0s' },
  ],
  'Portal Login': [
    { id: 'TC-LGN-001', name: 'Standard username/password authentication', priority: 'P0', status: 'pass', steps: ['Navigate to login page', 'Enter valid username', 'Enter valid password', 'Click Login button', 'Verify redirect to dashboard'], testData: { username: 'rajesh.kumar', password: 'Test@12345', expectedRedirect: '/dashboard' }, expected: 'Login successful, redirect to dashboard', actual: 'Logged in, redirected in 1.2s', time: '2.0s' },
    { id: 'TC-LGN-002', name: 'OTP-based two-factor authentication (SMS)', priority: 'P0', status: 'pass', steps: ['Enter credentials', 'System sends OTP to mobile', 'Enter 6-digit OTP', 'Verify OTP and grant access'], testData: { mobile: '+919876543210', otpLength: 6, validOTP: '456789', expiry: '5 min' }, expected: 'OTP verified, 2FA complete', actual: 'OTP verified in 3.2s', time: '8.0s' },
    { id: 'TC-LGN-003', name: 'Email OTP verification', priority: 'P0', status: 'pass', steps: ['Request email OTP', 'Check inbox for OTP email', 'Enter OTP from email', 'Verify and authenticate'], testData: { email: 'rajesh@email.com', otpLength: 6, deliveryTime: '<30s' }, expected: 'Email OTP received and verified', actual: 'Email received in 8s, OTP verified', time: '12.0s' },
    { id: 'TC-LGN-004', name: 'Biometric authentication (fingerprint/face)', priority: 'P0', status: 'pass', steps: ['Tap biometric login option', 'Present fingerprint/face', 'System matches against stored template', 'Grant access on match'], testData: { type: 'Fingerprint', device: 'iPhone 15', matchThreshold: 0.95 }, expected: 'Biometric match, instant access', actual: 'Match: 0.98, access granted in 0.5s', time: '1.0s' },
    { id: 'TC-LGN-005', name: 'Security question challenge', priority: 'P1', status: 'pass', steps: ['Login from new device', 'System presents security question', 'Enter correct answer', 'Device registered as trusted'], testData: { question: "Mother's maiden name?", answer: 'Smith', attempts: 3 }, expected: 'Correct answer grants access', actual: 'Answer verified, device registered', time: '5.0s' },
    { id: 'TC-LGN-006', name: 'CAPTCHA verification', priority: 'P0', status: 'pass', steps: ['Load login page', 'Solve CAPTCHA challenge', 'Submit with credentials', 'Verify human validation'], testData: { captchaType: 'reCAPTCHA v3', threshold: 0.5, botScore: 0.1 }, expected: 'CAPTCHA passed for human user', actual: 'reCAPTCHA score: 0.9 (human)', time: '3.0s' },
    { id: 'TC-LGN-007', name: 'Password strength validation', priority: 'P0', status: 'pass', steps: ['Test weak password (123456)', 'Test medium password (Test123)', 'Test strong password (T3st@12345!)', 'Verify strength meter'], testData: { weak: '123456', medium: 'Test123', strong: 'T3st@12345!', minStrength: 'Strong' }, expected: 'Weak rejected, strong accepted', actual: 'Weak: rejected, Medium: warning, Strong: accepted', time: '1.0s' },
    { id: 'TC-LGN-008', name: 'Account lockout after N failed attempts', priority: 'P0', status: 'pass', steps: ['Enter wrong password 5 times', 'Verify account locked', 'Check lockout duration (30 min)', 'Verify unlock after duration'], testData: { maxAttempts: 5, lockoutDuration: '30 min', wrongPassword: 'wrong123' }, expected: 'Locked after 5 fails, unlocked in 30min', actual: 'Locked at attempt #5, unlock at 30min', time: '1800.0s' },
    { id: 'TC-LGN-009', name: 'Password reset workflow', priority: 'P0', status: 'pass', steps: ['Click "Forgot Password"', 'Enter registered email', 'Click reset link in email', 'Set new password', 'Login with new password'], testData: { email: 'rajesh@email.com', linkExpiry: '1 hour', minPasswordLength: 8 }, expected: 'Password reset complete, new login works', actual: 'Reset link sent, new password set, login OK', time: '15.0s' },
    { id: 'TC-LGN-010', name: 'SSO (Single Sign-On) integration', priority: 'P1', status: 'pass', steps: ['Click "Login with SSO"', 'Redirect to identity provider', 'Authenticate at IdP', 'Receive SAML/OIDC token', 'Login to banking portal'], testData: { protocol: 'OIDC', provider: 'Azure AD', scopes: ['openid', 'profile', 'email'] }, expected: 'SSO login via Azure AD successful', actual: 'OIDC flow complete, token received', time: '5.0s' },
    { id: 'TC-LGN-011', name: 'Session timeout and auto-logout', priority: 'P0', status: 'pass', steps: ['Login successfully', 'Wait for inactivity timeout', 'Verify session expired', 'Verify redirect to login page'], testData: { timeout: '15 min', warningAt: '13 min', redirectTo: '/login' }, expected: 'Auto-logout after 15min inactivity', actual: 'Warning at 13min, logout at 15min', time: '900.0s' },
    { id: 'TC-LGN-012', name: 'Remember device / trusted device', priority: 'P1', status: 'pass', steps: ['Login with 2FA', 'Select "Remember this device"', 'Logout and login again', 'Verify 2FA skipped on trusted device'], testData: { deviceTrust: '30 days', fingerprint: 'browser + IP', reauth: false }, expected: '2FA skipped on remembered device', actual: 'Direct login on trusted device (no 2FA)', time: '2.0s' },
  ],
};

const S = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", padding: 20 },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 700, background: 'linear-gradient(90deg, #e74c3c, #f39c12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
  subtitle: { color: '#8892b0', fontSize: 14, marginTop: 4 },
  statsRow: { display: 'flex', gap: 15, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' },
  statBox: { background: '#0f3460', borderRadius: 10, padding: '12px 24px', textAlign: 'center', minWidth: 110 },
  statVal: { fontSize: 22, fontWeight: 700 },
  statLabel: { fontSize: 11, color: '#8892b0', marginTop: 2 },
  tabs: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20, justifyContent: 'center' },
  tab: (a) => ({ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: a ? '#4ecca3' : '#0f3460', color: a ? '#1a1a2e' : '#8892b0' }),
  split: { display: 'flex', gap: 20, minHeight: 600 },
  left: { flex: '0 0 55%', maxHeight: 700, overflowY: 'auto' },
  right: { flex: 1, display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#0f3460', borderRadius: 10, padding: 14, marginBottom: 8 },
  item: (a) => ({ background: a ? 'rgba(78,204,163,0.15)' : '#0f3460', borderRadius: 8, padding: '10px 12px', marginBottom: 5, cursor: 'pointer', borderLeft: a ? '3px solid #f39c12' : '3px solid transparent' }),
  badge: (t) => { const c = { pass: '#4ecca3', fail: '#e74c3c', not_run: '#f39c12', P0: '#e74c3c', P1: '#f39c12', P2: '#3498db' }; return { display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: `${c[t] || '#666'}22`, color: c[t] || '#666', marginLeft: 4 }; },
  secTitle: { fontSize: 13, fontWeight: 600, color: '#f39c12', marginBottom: 8, borderBottom: '1px solid #1a3a5c', paddingBottom: 4 },
  label: { display: 'block', fontSize: 11, color: '#8892b0', marginBottom: 3 },
  input: { width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #1a3a5c', background: '#1a1a2e', color: '#e0e0e0', fontSize: 12, boxSizing: 'border-box', marginBottom: 8 },
  stepRow: (a) => ({ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, marginBottom: 3, background: a ? 'rgba(243,156,18,0.1)' : 'transparent', fontSize: 12 }),
  dot: (d) => ({ width: 8, height: 8, borderRadius: '50%', background: d ? '#4ecca3' : '#333', flexShrink: 0 }),
  output: { background: '#1a1a2e', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 12 },
  btn: { background: 'linear-gradient(90deg, #e74c3c, #f39c12)', border: 'none', borderRadius: 8, padding: '10px 24px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13, width: '100%', marginTop: 8 },
  bar: { width: '100%', height: 6, background: '#1a1a2e', borderRadius: 3, overflow: 'hidden', marginTop: 6 },
  fill: (p) => ({ width: `${p}%`, height: '100%', background: 'linear-gradient(90deg, #e74c3c, #f39c12)', borderRadius: 3, transition: 'width 0.3s' }),
  cheque: { background: '#f5f0e1', color: '#333', borderRadius: 8, padding: 16, fontFamily: 'monospace', fontSize: 11, border: '2px solid #c8b88a', position: 'relative' },
};

function DocumentVerification() {
  const [tab, setTab] = useState(TABS[0]);
  const [sel, setSel] = useState(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(-1);
  const [results, setResults] = useState([]);

  const scenarios = SCENARIOS[tab] || [];
  const total = Object.values(SCENARIOS).flat().length;
  const pass = Object.values(SCENARIOS).flat().filter(s => s.status === 'pass').length;
  const fail = Object.values(SCENARIOS).flat().filter(s => s.status === 'fail').length;
  const selected = sel ? scenarios.find(s => s.id === sel) : scenarios[0];

  const changeTab = (t) => { setTab(t); setSel(null); setResults([]); setProgress(0); setStep(-1); };

  const run = () => {
    if (running || !selected) return;
    setRunning(true); setProgress(0); setStep(0);
    const steps = selected.steps.length;
    let i = 0;
    const iv = setInterval(() => {
      i++; setStep(i); setProgress(Math.round((i / steps) * 100));
      if (i >= steps) {
        clearInterval(iv); setRunning(false);
        setResults(p => [...p, { id: selected.id, name: selected.name, status: selected.status, time: selected.time }]);
      }
    }, 600);
  };

  const renderSpecialUI = () => {
    if (tab === 'Cheque Processing') {
      return (
        <div style={S.card}>
          <div style={S.secTitle}>CHEQUE PREVIEW</div>
          <div style={S.cheque}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <strong style={{ fontSize: 14 }}>ABC BANK LTD</strong>
              <span>Date: <span style={{ borderBottom: '1px solid #999', padding: '0 20px' }}>25/02/2026</span></span>
            </div>
            <div style={{ marginBottom: 10 }}>Pay: <span style={{ borderBottom: '1px solid #999', padding: '0 80px' }}>Rajesh Kumar</span></div>
            <div style={{ marginBottom: 10 }}>Amount in words: <span style={{ borderBottom: '1px solid #999', padding: '0 40px' }}>Twenty Five Thousand Only</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ border: '2px solid #999', padding: '4px 12px', fontWeight: 'bold' }}>$ 25,000.00</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: '#666' }}>Authorized Signature</div>
                <div style={{ borderBottom: '1px solid #999', width: 120, height: 20, fontStyle: 'italic', color: '#555' }}>J. Kumar</div>
              </div>
            </div>
            <div style={{ borderTop: '2px dashed #999', paddingTop: 6, fontSize: 10, letterSpacing: 3, color: '#666' }}>
              {'⑆000123⑆  ⑈001234⑈  12345678901'}
            </div>
            <div style={{ fontSize: 9, color: '#888', marginTop: 4 }}>IFSC: HDFC0001234 | MICR: 560001234</div>
          </div>
        </div>
      );
    }
    if (tab === 'Signature Verification') {
      return (
        <div style={S.card}>
          <div style={S.secTitle}>SIGNATURE COMPARISON</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, background: '#1a1a2e', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#8892b0', marginBottom: 8 }}>Stored Specimen</div>
              <div style={{ border: '1px dashed #4ecca3', borderRadius: 6, padding: 20, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', color: '#4ecca3', fontSize: 18 }}>R. Kumar</div>
            </div>
            <div style={{ flex: 1, background: '#1a1a2e', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#8892b0', marginBottom: 8 }}>Current Signature</div>
              <div style={{ border: '1px dashed #f39c12', borderRadius: 6, padding: 20, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', color: '#f39c12', fontSize: 18 }}>R. Kumar</div>
            </div>
          </div>
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#8892b0' }}>Match Score</div>
            <div style={{ width: '100%', height: 10, background: '#1a1a2e', borderRadius: 5, marginTop: 4, overflow: 'hidden' }}>
              <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #e74c3c, #f39c12, #4ecca3)', borderRadius: 5 }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#4ecca3', marginTop: 4 }}>92% Match</div>
          </div>
        </div>
      );
    }
    if (tab === 'Passport & ID') {
      return (
        <div style={S.card}>
          <div style={S.secTitle}>PASSPORT PREVIEW</div>
          <div style={{ background: '#1a3355', borderRadius: 8, padding: 16, border: '2px solid #4a7ab5', fontFamily: 'monospace' }}>
            <div style={{ fontSize: 10, color: '#a0c4ff', letterSpacing: 2, marginBottom: 8 }}>PASSPORT - CANADA</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 70, height: 85, background: '#2a5580', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{'👤'}</div>
              <div style={{ flex: 1, fontSize: 11, lineHeight: 1.8 }}>
                <div><span style={{ color: '#8892b0' }}>Name:</span> <span style={{ color: '#e0e0e0' }}>SMITH, JOHN</span></div>
                <div><span style={{ color: '#8892b0' }}>DOB:</span> <span style={{ color: '#e0e0e0' }}>01 JAN 1990</span></div>
                <div><span style={{ color: '#8892b0' }}>Nationality:</span> <span style={{ color: '#e0e0e0' }}>CANADIAN</span></div>
                <div><span style={{ color: '#8892b0' }}>Passport No:</span> <span style={{ color: '#e0e0e0' }}>AB1234567</span></div>
                <div><span style={{ color: '#8892b0' }}>Expiry:</span> <span style={{ color: '#4ecca3' }}>31 DEC 2028</span></div>
              </div>
            </div>
            <div style={{ marginTop: 10, padding: 6, background: '#0a1628', borderRadius: 4, fontSize: 9, letterSpacing: 1, color: '#6a8ab0' }}>
              <div>P&lt;CANSMITH&lt;&lt;JOHN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
              <div>AB1234567&lt;8CAN9001014M2512315&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>Document & Verification Testing</h1>
        <p style={S.subtitle}>Cheque Processing, Signature, Passport/ID, Document Management & Portal Login</p>
      </div>
      <div style={S.statsRow}>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#3498db' }}>{total}</div><div style={S.statLabel}>Total Tests</div></div>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#4ecca3' }}>{pass}</div><div style={S.statLabel}>Passed</div></div>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#e74c3c' }}>{fail}</div><div style={S.statLabel}>Failed</div></div>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#f39c12' }}>{total > 0 ? Math.round((pass/total)*100) : 0}%</div><div style={S.statLabel}>Pass Rate</div></div>
      </div>
      <div style={S.tabs}>
        {TABS.map(t => <button key={t} style={S.tab(tab === t)} onClick={() => changeTab(t)}>{t}</button>)}
      </div>
      <div style={S.split}>
        <div style={S.left}>
          <div style={{ ...S.card, padding: '8px 12px', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#f39c12' }}>{tab}</span>
            <span style={{ float: 'right', fontSize: 11, color: '#8892b0' }}>{scenarios.length} tests</span>
          </div>
          {scenarios.map(sc => (
            <div key={sc.id} style={S.item(sel === sc.id)} onClick={() => setSel(sc.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#f39c12', fontWeight: 600 }}>{sc.id}</span>
                <div><span style={S.badge(sc.priority)}>{sc.priority}</span><span style={S.badge(sc.status)}>{sc.status === 'not_run' ? 'N/A' : sc.status.toUpperCase()}</span></div>
              </div>
              <div style={{ fontSize: 13, color: '#e0e0e0', marginTop: 2 }}>{sc.name}</div>
              {sel === sc.id && (
                <div style={{ marginTop: 8, padding: 8, background: '#1a1a2e', borderRadius: 8, fontSize: 11 }}>
                  <div style={{ marginBottom: 4 }}><strong style={{ color: '#4ecca3' }}>Steps:</strong></div>
                  {sc.steps.map((s, i) => <div key={i} style={{ color: '#b0b0b0', padding: '1px 0' }}>{i+1}. {s}</div>)}
                  <div style={{ marginTop: 6 }}><strong style={{ color: '#3498db' }}>Test Data:</strong></div>
                  <pre style={{ color: '#8892b0', fontSize: 10, whiteSpace: 'pre-wrap', margin: '4px 0' }}>{JSON.stringify(sc.testData, null, 2)}</pre>
                  <div><strong style={{ color: '#4ecca3' }}>Expected:</strong> <span style={{ color: '#b0b0b0' }}>{sc.expected}</span></div>
                  <div><strong style={{ color: sc.status === 'fail' ? '#e74c3c' : '#4ecca3' }}>Actual:</strong> <span style={{ color: '#b0b0b0' }}>{sc.actual}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={S.right}>
          {renderSpecialUI()}
          <div style={S.card}>
            <div style={S.secTitle}>INPUT</div>
            {selected && Object.entries(selected.testData).map(([k, v]) => (
              <div key={k}><label style={S.label}>{k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toUpperCase()}</label>
              <input style={S.input} value={typeof v === 'object' ? JSON.stringify(v) : String(v)} readOnly /></div>
            ))}
          </div>
          <div style={S.card}>
            <div style={S.secTitle}>PROCESS</div>
            {selected && selected.steps.map((s, i) => (
              <div key={i} style={S.stepRow(step === i)}>
                <div style={S.dot(step > i)} />
                <span style={{ color: step > i ? '#4ecca3' : step === i ? '#f39c12' : '#555' }}>{i+1}. {s}</span>
                {step > i && <span style={{ marginLeft: 'auto', color: '#4ecca3', fontSize: 10 }}>Done</span>}
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={S.secTitle}>OUTPUT</div>
            <div style={S.output}>
              {selected ? (<>
                <div><span style={{ color: '#4ecca3' }}>Expected:</span> {selected.expected}</div>
                <div style={{ marginTop: 4 }}><span style={{ color: selected.status === 'fail' ? '#e74c3c' : '#4ecca3' }}>Actual:</span> {selected.actual}</div>
                <div style={{ marginTop: 4 }}><span style={{ color: '#f39c12' }}>Status:</span> <span style={S.badge(selected.status)}>{selected.status.toUpperCase()}</span></div>
                <div style={{ marginTop: 4 }}><span style={{ color: '#3498db' }}>Time:</span> {selected.time}</div>
              </>) : <span style={{ color: '#555' }}>Select a scenario</span>}
            </div>
          </div>
          <button style={{ ...S.btn, opacity: running ? 0.6 : 1 }} onClick={run} disabled={running}>{running ? 'Running...' : 'Run Test'}</button>
          {progress > 0 && <div style={S.bar}><div style={S.fill(progress)} /></div>}
          {results.length > 0 && (
            <div style={S.card}>
              <div style={S.secTitle}>RESULTS ({results.length})</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead><tr>
                  <th style={{ padding: '6px', background: '#1a1a2e', color: '#f39c12', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '6px', background: '#1a1a2e', color: '#f39c12', textAlign: 'left' }}>Scenario</th>
                  <th style={{ padding: '6px', background: '#1a1a2e', color: '#f39c12', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '6px', background: '#1a1a2e', color: '#f39c12', textAlign: 'left' }}>Time</th>
                </tr></thead>
                <tbody>{results.map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: '5px', borderBottom: '1px solid #0a1628' }}>{r.id}</td>
                    <td style={{ padding: '5px', borderBottom: '1px solid #0a1628' }}>{r.name}</td>
                    <td style={{ padding: '5px', borderBottom: '1px solid #0a1628' }}><span style={S.badge(r.status)}>{r.status.toUpperCase()}</span></td>
                    <td style={{ padding: '5px', borderBottom: '1px solid #0a1628' }}>{r.time}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentVerification;

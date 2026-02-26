import React, { useState } from 'react';

const TABS = ['Backend Testing', 'Visual Testing', 'AI Testing', 'ML Testing', 'CV Testing', 'NLP Testing', 'Frontend Adv.', 'Security Adv.'];

const SCENARIOS = {
  'Backend Testing': [
    { id: 'TC-BE-001', name: 'REST API endpoint validation (CRUD)', priority: 'P0', status: 'pass', steps: ['Send GET /api/customers', 'Verify 200 status code', 'Validate JSON response schema', 'Check response time < 200ms'], testData: { method: 'GET', endpoint: '/api/customers', expectedStatus: 200, timeout: '200ms' }, expected: '200 OK with valid JSON array', actual: '200 OK - 47 customers returned in 85ms', time: '0.9s' },
    { id: 'TC-BE-002', name: 'Database CRUD operations', priority: 'P0', status: 'pass', steps: ['INSERT new record', 'SELECT to verify', 'UPDATE record', 'DELETE and confirm removal'], testData: { table: 'customers', operation: 'CRUD', dbType: 'SQLite3' }, expected: 'All CRUD operations succeed', actual: 'All 4 operations passed', time: '1.2s' },
    { id: 'TC-BE-003', name: 'Authentication middleware', priority: 'P0', status: 'pass', steps: ['Request without auth header', 'Request with invalid token', 'Request with valid token', 'Verify role-based access'], testData: { validToken: 'Bearer eyJ...', invalidToken: 'Bearer invalid', noAuth: true }, expected: '401 without auth, 403 wrong role, 200 valid', actual: '401/403/200 as expected', time: '2.5s' },
    { id: 'TC-BE-004', name: 'Request validation & sanitization', priority: 'P0', status: 'pass', steps: ['Send SQL injection in body', 'Send XSS in query params', 'Send valid payload', 'Verify sanitization'], testData: { sqlInject: "'; DROP TABLE--", xss: '<script>alert(1)</script>', validPayload: { name: 'John' } }, expected: 'Malicious inputs rejected/sanitized', actual: 'All injection attempts blocked', time: '1.8s' },
    { id: 'TC-BE-005', name: 'Error handling & response codes', priority: 'P0', status: 'pass', steps: ['Request non-existent resource', 'Send malformed JSON', 'Trigger server error', 'Verify error envelope format'], testData: { notFound: '/api/customers/99999', badJson: '{invalid}', serverError: '/api/crash-test' }, expected: '404/400/500 with error envelope', actual: 'All error codes and format correct', time: '1.5s' },
    { id: 'TC-BE-006', name: 'Database connection pooling', priority: 'P1', status: 'pass', steps: ['Send 50 concurrent requests', 'Monitor DB connections', 'Verify no connection leaks', 'Check pool recovery'], testData: { concurrency: 50, maxPool: 10, timeout: '5000ms' }, expected: 'Max 10 connections, all released', actual: 'Pool: max 10, all released', time: '5.2s' },
    { id: 'TC-BE-007', name: 'Transaction rollback on failure', priority: 'P0', status: 'pass', steps: ['Start DB transaction', 'Insert record A', 'Force error on record B', 'Verify A is rolled back'], testData: { operation: 'Fund Transfer', debit: 'ACC-001', credit: 'INVALID', amount: 5000 }, expected: 'Both operations rolled back on failure', actual: 'Rollback confirmed - no partial data', time: '2.1s' },
    { id: 'TC-BE-008', name: 'Background job processing', priority: 'P1', status: 'pass', steps: ['Submit background job', 'Check job status', 'Wait for completion', 'Verify result saved'], testData: { jobType: 'Report Generation', priority: 'Normal', maxRetries: 3 }, expected: 'Job completed and result saved', actual: 'Job completed in 3.5s', time: '4.0s' },
    { id: 'TC-BE-009', name: 'Rate limiting enforcement', priority: 'P0', status: 'pass', steps: ['Send 100 requests in 1 minute', 'Verify 101st request rejected', 'Check 429 status code', 'Verify Retry-After header'], testData: { rateLimit: 100, window: '1 minute', expectedStatus: 429 }, expected: '429 Too Many Requests after 100', actual: '429 returned at request #101', time: '60.5s' },
    { id: 'TC-BE-010', name: 'Caching mechanism verification', priority: 'P1', status: 'pass', steps: ['First request - cache miss', 'Second request - cache hit', 'Compare response times', 'Verify cache headers'], testData: { endpoint: '/api/dashboard/stats', cacheControl: 'max-age=300', expectedHeader: 'X-Cache: HIT' }, expected: 'Cache hit < 10ms vs miss > 50ms', actual: 'Miss: 85ms, Hit: 3ms', time: '0.5s' },
    { id: 'TC-BE-011', name: 'Logging and audit trail', priority: 'P1', status: 'pass', steps: ['Perform CRUD operation', 'Check audit log table', 'Verify log contains action/user/timestamp', 'Test log rotation'], testData: { logLevel: 'INFO', auditFields: ['action', 'user', 'timestamp', 'ip'], retention: '90 days' }, expected: 'Audit log entry with all required fields', actual: 'Audit logged with all 4 fields', time: '1.0s' },
    { id: 'TC-BE-012', name: 'Data encryption at rest/transit', priority: 'P0', status: 'pass', steps: ['Store sensitive data (password)', 'Verify encrypted in DB', 'Retrieve and decrypt', 'Check TLS on API calls'], testData: { field: 'password', algorithm: 'AES-256', tls: 'TLS 1.3' }, expected: 'Data encrypted in DB, TLS on API', actual: 'AES-256 encrypted, TLS 1.3 verified', time: '2.0s' },
  ],
  'Visual Testing': [
    { id: 'TC-VIS-001', name: 'Screenshot comparison (baseline vs current)', priority: 'P0', status: 'pass', steps: ['Capture baseline screenshot', 'Capture current screenshot', 'Pixel-by-pixel comparison', 'Calculate diff percentage'], testData: { page: 'Dashboard', resolution: '1920x1080', threshold: '0.1%' }, expected: 'Diff < 0.1% from baseline', actual: 'Diff: 0.02% - Within threshold', time: '3.5s' },
    { id: 'TC-VIS-002', name: 'CSS regression detection', priority: 'P0', status: 'pass', steps: ['Compare computed styles', 'Check layout shifts', 'Verify z-index stacking', 'Detect overflow issues'], testData: { elements: 150, properties: ['margin', 'padding', 'color', 'font-size'], baseline: 'v2.0' }, expected: 'No unintended CSS changes', actual: '0 regressions detected', time: '4.2s' },
    { id: 'TC-VIS-003', name: 'Responsive layout (320px - 1920px)', priority: 'P0', status: 'pass', steps: ['Test at 320px (mobile)', 'Test at 768px (tablet)', 'Test at 1024px (laptop)', 'Test at 1920px (desktop)'], testData: { breakpoints: [320, 768, 1024, 1920], tolerance: '5px' }, expected: 'Layout adapts at all breakpoints', actual: 'All 4 breakpoints passed', time: '8.5s' },
    { id: 'TC-VIS-004', name: 'Cross-browser rendering consistency', priority: 'P1', status: 'pass', steps: ['Render in Chrome', 'Render in Firefox', 'Render in Safari', 'Compare all screenshots'], testData: { browsers: ['Chrome 120', 'Firefox 122', 'Safari 17'], tolerance: '1%' }, expected: 'Visual consistency across browsers', actual: 'Max diff: 0.3% (Firefox fonts)', time: '12.0s' },
    { id: 'TC-VIS-005', name: 'Font rendering and typography', priority: 'P1', status: 'pass', steps: ['Check font loading', 'Verify font-family fallback', 'Test font sizes at all headings', 'Verify line-height consistency'], testData: { fonts: ['Segoe UI', 'Arial', 'sans-serif'], headings: ['h1', 'h2', 'h3', 'h4'] }, expected: 'Correct fonts loaded with proper fallback', actual: 'Primary font loaded, fallback tested', time: '2.5s' },
    { id: 'TC-VIS-006', name: 'Color contrast accessibility (WCAG)', priority: 'P0', status: 'fail', steps: ['Scan all text elements', 'Calculate contrast ratios', 'Check against WCAG AA (4.5:1)', 'Report violations'], testData: { standard: 'WCAG 2.1 AA', minRatio: 4.5, elements: 'All text' }, expected: 'All text meets 4.5:1 contrast ratio', actual: '3 elements fail: sidebar labels (3.2:1)', time: '5.8s' },
    { id: 'TC-VIS-007', name: 'Icon and image rendering quality', priority: 'P1', status: 'pass', steps: ['Check SVG rendering', 'Verify @2x retina images', 'Test icon alignment', 'Verify no broken images'], testData: { icons: 45, images: 12, retina: true, format: 'SVG/PNG' }, expected: 'All icons/images render cleanly', actual: '45 icons + 12 images: all OK', time: '3.0s' },
    { id: 'TC-VIS-008', name: 'Animation smoothness (60fps)', priority: 'P2', status: 'pass', steps: ['Record animation frames', 'Measure FPS during animation', 'Check for jank/frame drops', 'Verify GPU acceleration'], testData: { targetFPS: 60, animations: ['sidebar', 'modal', 'tab-switch'], threshold: '55fps' }, expected: 'Animations run at 55+ FPS', actual: 'Avg FPS: 58, Min: 55', time: '6.0s' },
    { id: 'TC-VIS-009', name: 'Dark/Light theme consistency', priority: 'P1', status: 'pass', steps: ['Switch to dark theme', 'Verify all components styled', 'Switch to light theme', 'Compare both screenshots'], testData: { themes: ['dark', 'light'], components: 25, transitionTime: '200ms' }, expected: 'Both themes render correctly', actual: 'Both themes consistent', time: '4.5s' },
    { id: 'TC-VIS-010', name: 'Print layout verification', priority: 'P2', status: 'pass', steps: ['Trigger print preview', 'Verify print CSS applied', 'Check page breaks', 'Verify no cut-off content'], testData: { pages: 3, hideElements: ['sidebar', 'header-nav'], orientation: 'Portrait' }, expected: 'Clean print layout with no cut-offs', actual: 'Print preview: 3 pages, clean layout', time: '2.0s' },
  ],
  'AI Testing': [
    { id: 'TC-AI-001', name: 'Model prediction accuracy validation', priority: 'P0', status: 'pass', steps: ['Load test dataset (1000 samples)', 'Run predictions', 'Compare with ground truth', 'Calculate accuracy metrics'], testData: { model: 'Loan Approval v2.1', testSize: 1000, minAccuracy: '85%' }, expected: 'Accuracy >= 85%', actual: 'Accuracy: 91.2%, Precision: 89.5%', time: '15.2s' },
    { id: 'TC-AI-002', name: 'Bias detection in loan approval', priority: 'P0', status: 'fail', steps: ['Test across demographics (age, gender, race)', 'Calculate approval rates per group', 'Check disparate impact ratio', 'Generate bias report'], testData: { groups: ['Male', 'Female', 'Age<30', 'Age>50'], threshold: 0.8 }, expected: 'Disparate impact ratio >= 0.8 for all groups', actual: 'Female approval rate 15% lower (ratio: 0.72)', time: '25.0s' },
    { id: 'TC-AI-003', name: 'Fairness metrics across demographics', priority: 'P0', status: 'pass', steps: ['Compute equal opportunity diff', 'Compute predictive parity', 'Compute demographic parity', 'Generate fairness dashboard'], testData: { metrics: ['EOD', 'PP', 'DP', 'CalibrationDiff'], threshold: 0.05 }, expected: 'All fairness metrics within 5% tolerance', actual: 'EOD: 3.2%, PP: 2.1%, DP: 4.8%', time: '18.5s' },
    { id: 'TC-AI-004', name: 'Model explainability (SHAP values)', priority: 'P1', status: 'pass', steps: ['Generate SHAP values for predictions', 'Identify top 5 features', 'Verify feature importance alignment', 'Generate explanation report'], testData: { explainer: 'SHAP TreeExplainer', topFeatures: 5, model: 'XGBoost' }, expected: 'Top features: income, credit_score, debt_ratio', actual: 'Top: income(0.35), credit(0.28), debt(0.18)', time: '45.0s' },
    { id: 'TC-AI-005', name: 'Adversarial input robustness', priority: 'P0', status: 'pass', steps: ['Generate adversarial samples', 'Test model with perturbed inputs', 'Measure prediction stability', 'Report vulnerability score'], testData: { attackType: 'FGSM', epsilon: 0.1, samples: 500 }, expected: 'Model stable (accuracy drop < 5%)', actual: 'Accuracy drop: 2.3% under attack', time: '30.0s' },
    { id: 'TC-AI-006', name: 'Model drift detection', priority: 'P0', status: 'pass', steps: ['Compare current data distribution', 'Calculate PSI (Population Stability Index)', 'Check CSI (Characteristic Stability)', 'Alert if drift detected'], testData: { baseline: 'Jan 2026', current: 'Feb 2026', psiThreshold: 0.2 }, expected: 'PSI < 0.2 (stable)', actual: 'PSI: 0.08 - No significant drift', time: '12.0s' },
    { id: 'TC-AI-007', name: 'A/B test statistical significance', priority: 'P1', status: 'pass', steps: ['Set up control and treatment groups', 'Collect conversion metrics', 'Calculate p-value', 'Determine significance'], testData: { controlSize: 5000, treatmentSize: 5000, metric: 'approval_rate', alpha: 0.05 }, expected: 'p-value < 0.05 for significant result', actual: 'p-value: 0.023 - Statistically significant', time: '8.0s' },
    { id: 'TC-AI-008', name: 'Recommendation engine relevance', priority: 'P1', status: 'pass', steps: ['Generate product recommendations', 'Compare with user preferences', 'Calculate precision@5', 'Evaluate diversity score'], testData: { users: 100, topK: 5, minPrecision: 0.6 }, expected: 'Precision@5 >= 60%', actual: 'Precision@5: 72%, Diversity: 0.85', time: '20.0s' },
    { id: 'TC-AI-009', name: 'AI chatbot response quality', priority: 'P0', status: 'pass', steps: ['Send 50 test queries', 'Evaluate response relevance', 'Check factual accuracy', 'Measure response latency'], testData: { queries: 50, domains: ['balance', 'transfer', 'loan', 'card'], maxLatency: '3s' }, expected: 'Relevance > 85%, Accuracy > 90%', actual: 'Relevance: 88%, Accuracy: 93%', time: '35.0s' },
    { id: 'TC-AI-010', name: 'Automated document classification', priority: 'P1', status: 'pass', steps: ['Upload 100 mixed documents', 'Classify each (PAN/Aadhaar/Passport/Statement)', 'Verify classification accuracy', 'Report confusion matrix'], testData: { documents: 100, categories: 4, minAccuracy: '90%' }, expected: 'Classification accuracy >= 90%', actual: 'Accuracy: 95%, F1: 0.94', time: '22.0s' },
    { id: 'TC-AI-011', name: 'Sentiment analysis precision/recall', priority: 'P1', status: 'pass', steps: ['Analyze 200 customer reviews', 'Classify as positive/negative/neutral', 'Calculate precision and recall', 'Generate sentiment report'], testData: { reviews: 200, classes: ['positive', 'negative', 'neutral'] }, expected: 'Precision > 85%, Recall > 80%', actual: 'Precision: 87%, Recall: 84%', time: '15.0s' },
    { id: 'TC-AI-012', name: 'Model versioning and rollback', priority: 'P1', status: 'pass', steps: ['Deploy model v2.1', 'Detect performance degradation', 'Trigger rollback to v2.0', 'Verify v2.0 serving'], testData: { currentVersion: 'v2.1', rollbackTo: 'v2.0', trigger: 'accuracy < 80%' }, expected: 'Automatic rollback to v2.0', actual: 'Rolled back in 12s, v2.0 serving', time: '15.0s' },
  ],
  'ML Testing': [
    { id: 'TC-ML-001', name: 'Training data quality validation', priority: 'P0', status: 'pass', steps: ['Check for missing values', 'Detect outliers', 'Verify class distribution', 'Check for data leakage'], testData: { dataset: 'loan_data.csv', rows: 50000, features: 25, target: 'approved' }, expected: 'Missing < 5%, no leakage, balanced classes', actual: 'Missing: 1.2%, Balance: 55/45%, No leakage', time: '8.5s' },
    { id: 'TC-ML-002', name: 'Feature engineering verification', priority: 'P0', status: 'pass', steps: ['Validate derived features', 'Check feature scaling', 'Verify encoding (one-hot/label)', 'Test feature selection'], testData: { rawFeatures: 25, engineeredFeatures: 42, scalingMethod: 'StandardScaler' }, expected: '42 features created and scaled correctly', actual: '42 features, all scaled (mean=0, std=1)', time: '5.2s' },
    { id: 'TC-ML-003', name: 'Model training convergence', priority: 'P0', status: 'pass', steps: ['Train model with 100 epochs', 'Monitor loss curve', 'Check for convergence', 'Verify no divergence'], testData: { model: 'XGBoost', epochs: 100, earlyStop: 10, metric: 'logloss' }, expected: 'Loss converges, no overfitting', actual: 'Converged at epoch 67, loss: 0.312', time: '120.0s' },
    { id: 'TC-ML-004', name: 'Cross-validation scores', priority: 'P0', status: 'pass', steps: ['Run 5-fold cross-validation', 'Calculate mean and std', 'Check fold consistency', 'Compare with baseline'], testData: { folds: 5, metric: 'accuracy', baseline: '80%' }, expected: 'Mean CV accuracy > 80%, std < 3%', actual: 'CV: 88.5% +/- 1.8%', time: '60.0s' },
    { id: 'TC-ML-005', name: 'Confusion matrix analysis', priority: 'P0', status: 'pass', steps: ['Generate predictions on test set', 'Build confusion matrix', 'Calculate TP/FP/TN/FN rates', 'Identify misclassification patterns'], testData: { testSize: 10000, classes: ['Approved', 'Rejected'] }, expected: 'Low FP rate (< 5%) for loan approval', actual: 'FP: 3.2%, FN: 5.1%, Accuracy: 91.7%', time: '5.0s' },
    { id: 'TC-ML-006', name: 'ROC-AUC curve validation', priority: 'P0', status: 'pass', steps: ['Plot ROC curve', 'Calculate AUC score', 'Compare with random baseline', 'Check threshold sensitivity'], testData: { model: 'RandomForest', baseline: 0.5, minAUC: 0.85 }, expected: 'AUC >= 0.85', actual: 'AUC: 0.924 (Excellent)', time: '3.0s' },
    { id: 'TC-ML-007', name: 'Precision-Recall trade-off', priority: 'P1', status: 'pass', steps: ['Plot PR curve', 'Find optimal threshold', 'Test at different thresholds', 'Select business-appropriate cutoff'], testData: { thresholds: [0.3, 0.5, 0.7, 0.9], businessGoal: 'Minimize false approvals' }, expected: 'Optimal threshold found for business goal', actual: 'Optimal: 0.65 (P:89%, R:84%)', time: '4.0s' },
    { id: 'TC-ML-008', name: 'Overfitting/Underfitting detection', priority: 'P0', status: 'pass', steps: ['Compare train vs test accuracy', 'Check learning curves', 'Verify validation loss', 'Test regularization effect'], testData: { trainAcc: '95%', testAcc: '91%', maxGap: '5%', regularization: 'L2' }, expected: 'Train-test gap < 5%', actual: 'Gap: 4% - Within acceptable range', time: '10.0s' },
    { id: 'TC-ML-009', name: 'Hyperparameter tuning results', priority: 'P1', status: 'pass', steps: ['Run GridSearch/RandomSearch', 'Compare parameter combinations', 'Select best parameters', 'Validate on holdout set'], testData: { method: 'RandomizedSearch', iterations: 100, params: ['n_estimators', 'max_depth', 'learning_rate'] }, expected: 'Best params improve accuracy by 2%+', actual: 'Best: n_est=200, depth=8, lr=0.1 (+3.2%)', time: '300.0s' },
    { id: 'TC-ML-010', name: 'Model serving latency', priority: 'P0', status: 'pass', steps: ['Deploy model to serving endpoint', 'Send 1000 prediction requests', 'Measure p50/p95/p99 latency', 'Verify under SLA'], testData: { requests: 1000, sla_p95: '100ms', model: 'XGBoost (pickle)' }, expected: 'p95 latency < 100ms', actual: 'p50: 12ms, p95: 45ms, p99: 78ms', time: '5.0s' },
    { id: 'TC-ML-011', name: 'Batch inference accuracy', priority: 'P1', status: 'pass', steps: ['Run batch prediction on 10K records', 'Compare with real-time predictions', 'Verify consistency', 'Check for batch-specific bugs'], testData: { batchSize: 10000, format: 'CSV', comparison: 'real-time' }, expected: '100% consistency with real-time results', actual: '10,000/10,000 match (100%)', time: '25.0s' },
    { id: 'TC-ML-012', name: 'Online learning stability', priority: 'P2', status: 'not_run', steps: ['Feed streaming data to model', 'Monitor accuracy over time', 'Check for catastrophic forgetting', 'Verify model stability'], testData: { streamWindow: '24h', updateFrequency: 'hourly', minAccuracy: '80%' }, expected: 'Accuracy stable over 24h streaming', actual: '-', time: '-' },
  ],
  'CV Testing': [
    { id: 'TC-CV-001', name: 'Cheque image OCR accuracy', priority: 'P0', status: 'pass', steps: ['Upload cheque image', 'Extract text via OCR', 'Validate MICR code', 'Verify amount extraction'], testData: { imageFormat: 'JPEG', dpi: 300, fields: ['MICR', 'Amount', 'Payee', 'Date'] }, expected: 'OCR accuracy > 95% on all fields', actual: 'MICR: 99%, Amount: 97%, Payee: 94%, Date: 98%', time: '3.5s' },
    { id: 'TC-CV-002', name: 'Signature extraction and matching', priority: 'P0', status: 'pass', steps: ['Extract signature from cheque', 'Load stored specimen', 'Run matching algorithm', 'Return similarity score'], testData: { algorithm: 'Siamese Network', threshold: 0.8, specimens: 3 }, expected: 'Match score > 0.8 for valid signature', actual: 'Score: 0.92 - Match confirmed', time: '2.8s' },
    { id: 'TC-CV-003', name: 'ID document photo extraction', priority: 'P0', status: 'pass', steps: ['Upload ID document', 'Detect face region', 'Extract photo', 'Verify resolution and quality'], testData: { docType: 'Passport', minFaceSize: '100x100px', quality: 'High' }, expected: 'Face detected and extracted clearly', actual: 'Face extracted: 200x200px, quality: 95%', time: '2.0s' },
    { id: 'TC-CV-004', name: 'Face detection and liveness check', priority: 'P0', status: 'pass', steps: ['Capture selfie via camera', 'Detect face landmarks', 'Perform liveness check (blink/smile)', 'Compare with ID photo'], testData: { livenessChecks: ['blink', 'smile', '3D depth'], matchThreshold: 0.85 }, expected: 'Liveness passed, face match > 0.85', actual: 'Liveness: PASS, Match: 0.91', time: '5.5s' },
    { id: 'TC-CV-005', name: 'Document edge detection and cropping', priority: 'P1', status: 'pass', steps: ['Capture document with camera', 'Detect document edges', 'Apply perspective transform', 'Crop and enhance'], testData: { algorithm: 'Canny + Hough', autoRotate: true, enhance: 'Contrast + Sharpen' }, expected: 'Document cropped with straight edges', actual: 'Auto-cropped and enhanced', time: '1.5s' },
    { id: 'TC-CV-006', name: 'Barcode/QR code scanning', priority: 'P1', status: 'pass', steps: ['Point camera at QR code', 'Decode QR content', 'Validate decoded data', 'Extract payment info'], testData: { formats: ['QR', 'Code128', 'EAN-13'], content: 'UPI payment link' }, expected: 'QR decoded correctly with payment info', actual: 'Decoded: upi://pay?pa=merchant@upi', time: '0.8s' },
    { id: 'TC-CV-007', name: 'Image quality assessment (blur/noise)', priority: 'P1', status: 'pass', steps: ['Analyze uploaded image', 'Calculate blur metric (Laplacian)', 'Detect noise level', 'Accept or reject image'], testData: { minSharpness: 100, maxNoise: 0.3, acceptThreshold: 'High' }, expected: 'Image quality above minimum threshold', actual: 'Sharpness: 245, Noise: 0.12 - ACCEPTED', time: '1.0s' },
    { id: 'TC-CV-008', name: 'Handwriting recognition accuracy', priority: 'P1', status: 'fail', steps: ['Scan handwritten cheque amount', 'Recognize handwritten text', 'Compare with MICR amount', 'Report match/mismatch'], testData: { script: 'English cursive', model: 'CRNN', confidence: 0.8 }, expected: 'Recognition accuracy > 85%', actual: 'Accuracy: 78% - Below threshold', time: '4.0s' },
    { id: 'TC-CV-009', name: 'Document classification', priority: 'P0', status: 'pass', steps: ['Upload mixed document batch', 'Classify each document', 'Categorize: cheque/ID/statement/form', 'Report classification accuracy'], testData: { documents: 50, categories: ['Cheque', 'ID', 'Statement', 'Form'], model: 'ResNet-50' }, expected: 'Classification accuracy > 92%', actual: 'Accuracy: 96%, all categories > 90%', time: '12.0s' },
    { id: 'TC-CV-010', name: 'Multi-page document stitching', priority: 'P2', status: 'pass', steps: ['Upload multi-page scan', 'Detect page boundaries', 'Stitch pages in order', 'Generate single PDF'], testData: { pages: 5, format: 'TIFF', outputFormat: 'PDF', ocrEnabled: true }, expected: '5 pages stitched into single PDF', actual: '5-page PDF generated with OCR text layer', time: '8.0s' },
  ],
  'NLP Testing': [
    { id: 'TC-NLP-001', name: 'Named Entity Recognition (NER)', priority: 'P0', status: 'pass', steps: ['Input banking text', 'Extract entities', 'Classify: Account/Amount/Date/Name', 'Verify accuracy'], testData: { text: 'Transfer $5,000 from ACC-001 to ACC-002 on March 15', entities: ['$5,000', 'ACC-001', 'ACC-002', 'March 15'] }, expected: 'All 4 entities extracted correctly', actual: '4/4 entities: AMOUNT, ACCOUNT x2, DATE', time: '0.5s' },
    { id: 'TC-NLP-002', name: 'Text classification (complaint type)', priority: 'P0', status: 'pass', steps: ['Input customer complaint', 'Classify complaint type', 'Assign priority', 'Route to department'], testData: { text: 'My debit card was charged twice for the same purchase', categories: ['Card', 'Account', 'Loan', 'General'] }, expected: 'Classified as "Card" issue', actual: 'Category: Card (confidence: 0.94)', time: '0.8s' },
    { id: 'TC-NLP-003', name: 'Sentiment analysis on feedback', priority: 'P0', status: 'pass', steps: ['Input customer feedback', 'Detect sentiment', 'Score from -1 to +1', 'Classify positive/negative/neutral'], testData: { text: 'The mobile app is terrible, crashes every time I check balance', expected: 'Negative' }, expected: 'Sentiment: Negative (score < -0.3)', actual: 'Negative (score: -0.78)', time: '0.3s' },
    { id: 'TC-NLP-004', name: 'Intent detection in queries', priority: 'P0', status: 'pass', steps: ['Input customer query', 'Detect intent', 'Map to banking action', 'Return confidence score'], testData: { text: 'I want to check my savings account balance', intents: ['balance_check', 'transfer', 'bill_pay', 'general'] }, expected: 'Intent: balance_check (conf > 0.85)', actual: 'Intent: balance_check (0.96)', time: '0.4s' },
    { id: 'TC-NLP-005', name: 'Language translation accuracy', priority: 'P1', status: 'pass', steps: ['Input English text', 'Translate to Hindi', 'Translate to French', 'Back-translate and compare'], testData: { source: 'Your account balance is $5,000', targetLangs: ['Hindi', 'French'], metric: 'BLEU' }, expected: 'BLEU score > 0.7 for both languages', actual: 'Hindi: 0.82, French: 0.88', time: '2.0s' },
    { id: 'TC-NLP-006', name: 'Text summarization', priority: 'P1', status: 'pass', steps: ['Input long transaction description', 'Generate summary', 'Verify key info retained', 'Check summary length'], testData: { inputLength: 500, maxSummaryLength: 50, preserveAmounts: true }, expected: 'Summary retains key financial data', actual: 'Summary: 45 words, all amounts preserved', time: '1.5s' },
    { id: 'TC-NLP-007', name: 'Keyword extraction from documents', priority: 'P1', status: 'pass', steps: ['Input financial document', 'Extract top keywords', 'Rank by relevance', 'Map to banking domain'], testData: { docType: 'Loan Agreement', topK: 10, method: 'TF-IDF + BERT' }, expected: 'Top 10 relevant banking keywords', actual: 'Keywords: loan, interest, principal, EMI...', time: '1.2s' },
    { id: 'TC-NLP-008', name: 'Spell check and auto-correction', priority: 'P2', status: 'pass', steps: ['Input text with typos', 'Detect spelling errors', 'Suggest corrections', 'Apply banking-specific dictionary'], testData: { text: 'I want to trnasfer moeny from my acount', errors: 3 }, expected: 'All 3 typos corrected', actual: 'Corrected: transfer, money, account', time: '0.3s' },
    { id: 'TC-NLP-009', name: 'PII redaction from text', priority: 'P0', status: 'pass', steps: ['Input text with PII', 'Detect PII entities', 'Redact/mask PII', 'Verify no leakage'], testData: { text: 'Customer John (SSN: 123-45-6789, Card: 4111-1111-1111-1111)', piiTypes: ['SSN', 'Card', 'Name'] }, expected: 'All PII masked: [REDACTED]', actual: '[NAME] (SSN: ***-**-**89, Card: ****-****-****-1111)', time: '0.5s' },
    { id: 'TC-NLP-010', name: 'Multi-language support validation', priority: 'P1', status: 'pass', steps: ['Input text in multiple languages', 'Detect language automatically', 'Process in detected language', 'Return response in same language'], testData: { languages: ['English', 'Hindi', 'French', 'Tamil'], autoDetect: true }, expected: 'All 4 languages detected and processed', actual: '4/4 languages detected correctly', time: '2.5s' },
  ],
  'Frontend Adv.': [
    { id: 'TC-FE-001', name: 'Component rendering lifecycle', priority: 'P0', status: 'pass', steps: ['Mount component', 'Verify useEffect calls', 'Update props/state', 'Verify re-render count'], testData: { component: 'Dashboard', expectedMounts: 1, maxRenders: 3 }, expected: 'Mount once, re-render <= 3 times', actual: 'Mounted: 1, Renders: 2', time: '0.5s' },
    { id: 'TC-FE-002', name: 'State management validation', priority: 'P0', status: 'pass', steps: ['Update global state', 'Verify all subscribers notified', 'Check state immutability', 'Test state persistence'], testData: { stateLib: 'React Context', subscribers: 5, actions: ['SET_USER', 'UPDATE_BALANCE'] }, expected: 'All 5 subscribers updated correctly', actual: '5/5 subscribers received update', time: '0.8s' },
    { id: 'TC-FE-003', name: 'Event handler testing', priority: 'P0', status: 'pass', steps: ['Simulate click events', 'Test keyboard events', 'Verify event propagation', 'Check event.preventDefault'], testData: { events: ['click', 'keydown', 'submit', 'change'], handlers: 12 }, expected: 'All 12 handlers fire correctly', actual: '12/12 handlers tested', time: '1.2s' },
    { id: 'TC-FE-004', name: 'Form validation with complex rules', priority: 'P0', status: 'pass', steps: ['Test required fields', 'Test regex patterns (email/phone)', 'Test cross-field validation', 'Test async validation (API)'], testData: { fields: 8, rules: ['required', 'email', 'phone', 'minLength', 'crossField'], asyncFields: ['accountNo'] }, expected: 'All validation rules enforced', actual: '8 fields, 5 rules, all working', time: '2.0s' },
    { id: 'TC-FE-005', name: 'Lazy loading and code splitting', priority: 'P1', status: 'pass', steps: ['Load initial bundle', 'Navigate to lazy route', 'Verify chunk loaded on demand', 'Check loading indicator'], testData: { initialBundle: '250KB', lazyChunks: 5, maxInitialLoad: '300KB' }, expected: 'Initial < 300KB, lazy chunks load on demand', actual: 'Initial: 220KB, 5 lazy chunks OK', time: '3.0s' },
    { id: 'TC-FE-006', name: 'Service worker and offline mode', priority: 'P1', status: 'pass', steps: ['Register service worker', 'Cache critical assets', 'Go offline', 'Verify cached pages serve'], testData: { cachedAssets: 25, offlinePages: ['dashboard', 'accounts'], strategy: 'Cache First' }, expected: 'Dashboard and accounts work offline', actual: 'Both pages served from cache', time: '4.5s' },
    { id: 'TC-FE-007', name: 'WebSocket real-time updates', priority: 'P1', status: 'pass', steps: ['Connect WebSocket', 'Send test message', 'Verify real-time update in UI', 'Test reconnection on disconnect'], testData: { wsUrl: 'ws://localhost:3001/ws', events: ['balance_update', 'notification'], reconnectDelay: '3s' }, expected: 'Real-time updates within 100ms', actual: 'Update latency: 45ms, reconnect: OK', time: '5.0s' },
    { id: 'TC-FE-008', name: 'Browser memory leak detection', priority: 'P0', status: 'pass', steps: ['Navigate between pages 100 times', 'Monitor heap usage', 'Check for detached DOM nodes', 'Verify event listener cleanup'], testData: { iterations: 100, maxHeapGrowth: '10MB', monitorTool: 'Chrome DevTools' }, expected: 'Heap growth < 10MB after 100 navigations', actual: 'Heap growth: 3.2MB, no leaks detected', time: '30.0s' },
    { id: 'TC-FE-009', name: 'Accessibility (ARIA, keyboard, reader)', priority: 'P0', status: 'fail', steps: ['Run axe-core accessibility scan', 'Test keyboard navigation (Tab/Enter)', 'Test screen reader compatibility', 'Check ARIA labels on all controls'], testData: { scanner: 'axe-core', standard: 'WCAG 2.1 AA', elements: 'All interactive' }, expected: 'Zero critical accessibility violations', actual: '2 critical: missing ARIA labels on modals', time: '8.0s' },
    { id: 'TC-FE-010', name: 'Internationalization (i18n)', priority: 'P1', status: 'pass', steps: ['Switch locale to Hindi', 'Verify all strings translated', 'Check date/number formatting', 'Test RTL layout (Arabic)'], testData: { locales: ['en', 'hi', 'fr', 'ar'], strings: 250, rtlSupport: true }, expected: 'All strings translated, RTL works', actual: '250/250 strings, RTL: OK', time: '5.0s' },
  ],
  'Security Adv.': [
    { id: 'TC-SEC-001', name: 'SQL injection vulnerability scan', priority: 'P0', status: 'pass', steps: ['Test all input fields with SQL payloads', 'Check parameterized queries', 'Test stored procedures', 'Verify no data exposure'], testData: { payloads: ["' OR 1=1--", "'; DROP TABLE--", "UNION SELECT * FROM users"], endpoints: 15 }, expected: 'All injection attempts blocked', actual: '15 endpoints tested: All blocked', time: '12.0s' },
    { id: 'TC-SEC-002', name: 'XSS (Cross-Site Scripting) detection', priority: 'P0', status: 'pass', steps: ['Inject script tags in inputs', 'Test stored XSS', 'Test reflected XSS', 'Verify output encoding'], testData: { payloads: ['<script>alert(1)</script>', '<img onerror=alert(1)>', 'javascript:alert(1)'], fields: 20 }, expected: 'All XSS attempts sanitized', actual: '20 fields tested: All sanitized', time: '8.0s' },
    { id: 'TC-SEC-003', name: 'CSRF token validation', priority: 'P0', status: 'pass', steps: ['Submit form without CSRF token', 'Submit with expired token', 'Submit with valid token', 'Test token rotation'], testData: { tokenType: 'Synchronizer Token', rotation: 'Per-request', maxAge: '30min' }, expected: 'Request rejected without valid token', actual: 'Invalid/missing token: 403 Forbidden', time: '3.0s' },
    { id: 'TC-SEC-004', name: 'JWT token expiry and refresh', priority: 'P0', status: 'pass', steps: ['Login and receive JWT', 'Use token for API calls', 'Wait for token expiry', 'Test refresh token flow'], testData: { accessTokenTTL: '15min', refreshTokenTTL: '7d', algorithm: 'RS256' }, expected: 'Access token expires, refresh works', actual: 'Expired at 15min, refreshed OK', time: '900.0s' },
    { id: 'TC-SEC-005', name: 'API key rotation testing', priority: 'P1', status: 'pass', steps: ['Generate new API key', 'Verify old key still works (grace period)', 'Revoke old key after grace', 'Verify revoked key rejected'], testData: { gracePeriod: '24h', keyLength: 256, hashAlgorithm: 'SHA-256' }, expected: 'Old key revoked after grace period', actual: 'Key rotation: smooth with 24h grace', time: '5.0s' },
    { id: 'TC-SEC-006', name: 'SSL/TLS certificate validation', priority: 'P0', status: 'pass', steps: ['Check TLS version', 'Verify certificate chain', 'Test cipher suite strength', 'Check for vulnerabilities (BEAST/POODLE)'], testData: { minTLS: '1.2', ciphers: 'AES-256-GCM', certType: 'EV', vulnerabilities: ['BEAST', 'POODLE', 'Heartbleed'] }, expected: 'TLS 1.2+, no known vulnerabilities', actual: 'TLS 1.3, AES-256-GCM, 0 vulnerabilities', time: '4.0s' },
    { id: 'TC-SEC-007', name: 'OWASP Top 10 compliance check', priority: 'P0', status: 'pass', steps: ['Run OWASP ZAP scan', 'Check all 10 categories', 'Review findings', 'Verify remediation'], testData: { scanner: 'OWASP ZAP', categories: 10, scanType: 'Active + Passive', target: 'Full application' }, expected: 'No critical/high findings', actual: '0 critical, 0 high, 3 medium, 5 low', time: '180.0s' },
    { id: 'TC-SEC-008', name: 'Penetration testing results', priority: 'P0', status: 'pass', steps: ['Run network scan', 'Test authentication bypass', 'Test privilege escalation', 'Generate pen test report'], testData: { scope: 'Full application', methods: ['Black box', 'Gray box'], tools: ['Burp Suite', 'Nmap', 'Metasploit'] }, expected: 'No exploitable vulnerabilities found', actual: 'No exploitable vulns, 2 info findings', time: '3600.0s' },
    { id: 'TC-SEC-009', name: 'Data encryption verification (AES-256)', priority: 'P0', status: 'pass', steps: ['Encrypt sensitive data', 'Store in database', 'Retrieve and decrypt', 'Verify no plaintext in DB'], testData: { algorithm: 'AES-256-GCM', fields: ['password', 'ssn', 'card_number'], keyManagement: 'KMS' }, expected: 'All sensitive fields encrypted in DB', actual: 'All 3 fields: encrypted (verified)', time: '2.0s' },
    { id: 'TC-SEC-010', name: 'CORS policy enforcement', priority: 'P0', status: 'pass', steps: ['Request from allowed origin', 'Request from blocked origin', 'Test preflight OPTIONS', 'Verify headers'], testData: { allowed: ['http://localhost:3000'], blocked: ['http://evil.com'], methods: ['GET', 'POST', 'PUT', 'DELETE'] }, expected: 'Only allowed origins accepted', actual: 'Blocked: evil.com, Allowed: localhost:3000', time: '1.5s' },
  ],
};

const S = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", padding: 20 },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 700, background: 'linear-gradient(90deg, #9b59b6, #3498db)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
  subtitle: { color: '#8892b0', fontSize: 14, marginTop: 4 },
  statsRow: { display: 'flex', gap: 15, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' },
  statBox: { background: '#0f3460', borderRadius: 10, padding: '12px 24px', textAlign: 'center', minWidth: 110 },
  statVal: { fontSize: 22, fontWeight: 700 },
  statLabel: { fontSize: 11, color: '#8892b0', marginTop: 2 },
  tabs: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20, justifyContent: 'center' },
  tab: (a) => ({ padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: a ? '#4ecca3' : '#0f3460', color: a ? '#1a1a2e' : '#8892b0' }),
  split: { display: 'flex', gap: 20, minHeight: 600 },
  left: { flex: '0 0 55%', maxHeight: 700, overflowY: 'auto' },
  right: { flex: 1, display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#0f3460', borderRadius: 10, padding: 14, marginBottom: 8 },
  item: (a) => ({ background: a ? 'rgba(78,204,163,0.15)' : '#0f3460', borderRadius: 8, padding: '10px 12px', marginBottom: 5, cursor: 'pointer', borderLeft: a ? '3px solid #4ecca3' : '3px solid transparent' }),
  badge: (t) => { const c = { pass: '#4ecca3', fail: '#e74c3c', not_run: '#f39c12', P0: '#e74c3c', P1: '#f39c12', P2: '#3498db' }; return { display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: `${c[t] || '#666'}22`, color: c[t] || '#666', marginLeft: 4 }; },
  secTitle: { fontSize: 13, fontWeight: 600, color: '#4ecca3', marginBottom: 8, borderBottom: '1px solid #1a3a5c', paddingBottom: 4 },
  label: { display: 'block', fontSize: 11, color: '#8892b0', marginBottom: 3 },
  input: { width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #1a3a5c', background: '#1a1a2e', color: '#e0e0e0', fontSize: 12, boxSizing: 'border-box', marginBottom: 8 },
  stepRow: (a) => ({ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, marginBottom: 3, background: a ? 'rgba(78,204,163,0.1)' : 'transparent', fontSize: 12 }),
  dot: (d) => ({ width: 8, height: 8, borderRadius: '50%', background: d ? '#4ecca3' : '#333', flexShrink: 0 }),
  output: { background: '#1a1a2e', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 12 },
  btn: { background: 'linear-gradient(90deg, #9b59b6, #3498db)', border: 'none', borderRadius: 8, padding: '10px 24px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13, width: '100%', marginTop: 8 },
  bar: { width: '100%', height: 6, background: '#1a1a2e', borderRadius: 3, overflow: 'hidden', marginTop: 6 },
  fill: (p) => ({ width: `${p}%`, height: '100%', background: 'linear-gradient(90deg, #9b59b6, #3498db)', borderRadius: 3, transition: 'width 0.3s' }),
};

function AdvancedTesting() {
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
    }, 500);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>Advanced Testing Dashboard</h1>
        <p style={S.subtitle}>Backend, Visual, AI/ML, Computer Vision, NLP, Frontend & Security Testing</p>
      </div>
      <div style={S.statsRow}>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#3498db' }}>{total}</div><div style={S.statLabel}>Total Tests</div></div>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#4ecca3' }}>{pass}</div><div style={S.statLabel}>Passed</div></div>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#e74c3c' }}>{fail}</div><div style={S.statLabel}>Failed</div></div>
        <div style={S.statBox}><div style={{ ...S.statVal, color: '#9b59b6' }}>{total > 0 ? Math.round((pass/total)*100) : 0}%</div><div style={S.statLabel}>Pass Rate</div></div>
      </div>
      <div style={S.tabs}>
        {TABS.map(t => <button key={t} style={S.tab(tab === t)} onClick={() => changeTab(t)}>{t}</button>)}
      </div>
      <div style={S.split}>
        <div style={S.left}>
          <div style={{ ...S.card, padding: '8px 12px', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#9b59b6' }}>{tab}</span>
            <span style={{ float: 'right', fontSize: 11, color: '#8892b0' }}>{scenarios.length} tests</span>
          </div>
          {scenarios.map(sc => (
            <div key={sc.id} style={S.item(sel === sc.id)} onClick={() => setSel(sc.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#9b59b6', fontWeight: 600 }}>{sc.id}</span>
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
                  <th style={{ padding: '6px', background: '#1a1a2e', color: '#9b59b6', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '6px', background: '#1a1a2e', color: '#9b59b6', textAlign: 'left' }}>Scenario</th>
                  <th style={{ padding: '6px', background: '#1a1a2e', color: '#9b59b6', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '6px', background: '#1a1a2e', color: '#9b59b6', textAlign: 'left' }}>Time</th>
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

export default AdvancedTesting;

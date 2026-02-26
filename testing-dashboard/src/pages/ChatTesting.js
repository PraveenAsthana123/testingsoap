import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// =============================================================================
// DATA: Test Scenarios organized by categories
// =============================================================================

const TEST_SCENARIOS = [
  {
    category: 'Customer Support Chat',
    icon: '\u{1F4AC}',
    color: '#3498db',
    scenarios: [
      {
        id: 'TC-CHAT-001', name: 'Greeting and welcome message', priority: 'P0', status: 'Pass',
        steps: ['1. Open chat widget', '2. Verify bot greeting appears', '3. Check welcome message content', '4. Verify quick-reply buttons shown'],
        testData: 'New session, no prior history',
        expected: 'Bot displays "Welcome to ABC Bank! How can I help you today?" within 2 seconds with quick-reply options.',
        actual: 'Welcome message displayed in 1.2s with 4 quick-reply buttons: Balance, Transfer, Support, More.',
        executionTime: '1.2s',
      },
      {
        id: 'TC-CHAT-002', name: 'Account balance inquiry via chat', priority: 'P0', status: 'Pass',
        steps: ['1. Send "Check my balance"', '2. Bot asks for account number', '3. Enter account number', '4. Bot asks for OTP', '5. Enter OTP', '6. Verify balance displayed'],
        testData: 'Account: 1234567890, OTP: 456789',
        expected: 'Bot authenticates user and displays current balance with last transaction.',
        actual: 'Balance $12,450.50 shown correctly. Last txn: -$250.00 on 2026-02-20.',
        executionTime: '3.8s',
      },
      {
        id: 'TC-CHAT-003', name: 'Transaction status check', priority: 'P0', status: 'Pass',
        steps: ['1. Send "Check transaction status"', '2. Bot asks for transaction reference', '3. Enter reference number', '4. Verify status displayed'],
        testData: 'Txn Ref: TXN2026022512345',
        expected: 'Bot displays transaction status with details (amount, date, beneficiary, status).',
        actual: 'Transaction status: Completed. Amount: $500.00, Date: 2026-02-25, To: John Doe.',
        executionTime: '2.1s',
      },
      {
        id: 'TC-CHAT-004', name: 'Branch/ATM locator request', priority: 'P1', status: 'Pass',
        steps: ['1. Send "Find nearest ATM"', '2. Bot asks for location/pin code', '3. Enter pin code', '4. Verify ATM list displayed'],
        testData: 'Pin Code: 560001 (Bangalore)',
        expected: 'Bot displays list of nearest ATMs with address, distance, and working hours.',
        actual: '5 ATMs found within 2km. Closest: MG Road Branch, 0.3km, 24/7.',
        executionTime: '2.5s',
      },
      {
        id: 'TC-CHAT-005', name: 'Interest rate inquiry', priority: 'P1', status: 'Pass',
        steps: ['1. Send "What are your interest rates?"', '2. Bot asks for product type', '3. Select "Savings Account"', '4. Verify rate information'],
        testData: 'Product: Savings Account',
        expected: 'Bot shows current interest rates for selected product with terms.',
        actual: 'Savings Account: 3.5% p.a. for balance up to $10,000, 4.0% for above.',
        executionTime: '1.8s',
      },
      {
        id: 'TC-CHAT-006', name: 'Loan eligibility check', priority: 'P1', status: 'Pass',
        steps: ['1. Send "Am I eligible for a loan?"', '2. Bot collects income, employment, credit score', '3. Submit details', '4. Verify eligibility result'],
        testData: 'Income: $5000/month, Employment: Salaried, Credit Score: 750',
        expected: 'Bot calculates and displays loan eligibility with max amount and rate.',
        actual: 'Eligible for Personal Loan up to $50,000 at 8.5% p.a. for 5 years.',
        executionTime: '4.2s',
      },
      {
        id: 'TC-CHAT-007', name: 'Card block request via chat', priority: 'P0', status: 'Pass',
        steps: ['1. Send "Block my card"', '2. Bot asks for card last 4 digits', '3. Enter digits', '4. Bot asks for confirmation', '5. Confirm blocking', '6. Verify card blocked'],
        testData: 'Card: ****7890, Reason: Lost',
        expected: 'Bot blocks card immediately and provides reference number.',
        actual: 'Card blocked. Reference: BLK-2026-0225-001. Replacement card will be sent in 5 business days.',
        executionTime: '3.5s',
      },
      {
        id: 'TC-CHAT-008', name: 'Complaint registration', priority: 'P1', status: 'Fail',
        steps: ['1. Send "I want to file a complaint"', '2. Bot asks for complaint category', '3. Select category and describe issue', '4. Bot registers complaint', '5. Verify complaint ID generated'],
        testData: 'Category: ATM Issue, Description: ATM ate my card',
        expected: 'Bot registers complaint and provides complaint tracking ID within 3 seconds.',
        actual: 'Complaint registered but tracking ID not displayed. Error in reference generation.',
        executionTime: '5.1s',
      },
      {
        id: 'TC-CHAT-009', name: 'Fund transfer assistance', priority: 'P0', status: 'Pass',
        steps: ['1. Send "Transfer money"', '2. Bot asks for beneficiary and amount', '3. Enter details', '4. Bot shows summary', '5. Confirm transfer', '6. Verify success'],
        testData: 'To: John Doe (ACC: 9876543210), Amount: $500',
        expected: 'Bot processes transfer and shows confirmation with transaction ID.',
        actual: 'Transfer successful. TXN ID: TXN2026022567890. Amount: $500.00 to John Doe.',
        executionTime: '6.2s',
      },
      {
        id: 'TC-CHAT-010', name: 'Chat session timeout handling', priority: 'P1', status: 'Pass',
        steps: ['1. Start chat session', '2. Wait for 5 minutes without activity', '3. Verify timeout warning', '4. Wait 1 more minute', '5. Verify session ended'],
        testData: 'Timeout: 5 minutes idle',
        expected: 'Bot warns at 5 min, ends session at 6 min with option to reconnect.',
        actual: 'Warning shown at 5:00. Session ended at 6:00. "Start new chat" button displayed.',
        executionTime: '6m 5s',
      },
    ],
  },
  {
    category: 'Chatbot AI Testing',
    icon: '\u{1F916}',
    color: '#9b59b6',
    scenarios: [
      {
        id: 'TC-AI-001', name: 'Natural language understanding (NLU)', priority: 'P0', status: 'Pass',
        steps: ['1. Send "I wanna see how much money I got"', '2. Verify bot understands intent as balance inquiry', '3. Bot initiates balance check flow'],
        testData: 'Colloquial: "I wanna see how much money I got"',
        expected: 'Bot correctly maps informal language to "check balance" intent.',
        actual: 'Intent detected: check_balance (confidence: 0.94). Balance flow initiated.',
        executionTime: '1.5s',
      },
      {
        id: 'TC-AI-002', name: 'Intent classification accuracy', priority: 'P0', status: 'Pass',
        steps: ['1. Send 50 test utterances covering all intents', '2. Record classified intents', '3. Compare with expected intents', '4. Calculate accuracy'],
        testData: '50 utterances across 12 intents (balance, transfer, loan, card, complaint, etc.)',
        expected: 'Intent classification accuracy >= 90% across all categories.',
        actual: 'Overall accuracy: 94%. Lowest: loan_inquiry at 88%, Highest: greeting at 100%.',
        executionTime: '45.2s',
      },
      {
        id: 'TC-AI-003', name: 'Entity extraction (account numbers, amounts)', priority: 'P0', status: 'Pass',
        steps: ['1. Send "Transfer $500 to account 9876543210"', '2. Verify amount extracted: 500', '3. Verify account extracted: 9876543210', '4. Verify currency: USD'],
        testData: '"Transfer $500 to account 9876543210"',
        expected: 'Bot extracts: amount=500, currency=USD, account=9876543210.',
        actual: 'Entities: {amount: 500, currency: "USD", account: "9876543210"}. All correct.',
        executionTime: '1.1s',
      },
      {
        id: 'TC-AI-004', name: 'Multi-turn conversation handling', priority: 'P0', status: 'Pass',
        steps: ['1. Start loan inquiry', '2. Provide income', '3. Provide employment type', '4. Provide credit score', '5. Verify all data collected across turns'],
        testData: 'Turn 1: "Loan inquiry", Turn 2: "$5000", Turn 3: "Salaried", Turn 4: "750"',
        expected: 'Bot maintains conversation state across 4+ turns without data loss.',
        actual: 'All 4 turns processed. Slot filling: income=$5000, employment=salaried, credit_score=750.',
        executionTime: '8.3s',
      },
      {
        id: 'TC-AI-005', name: 'Context retention across messages', priority: 'P0', status: 'Fail',
        steps: ['1. Ask about savings account rates', '2. Then ask "What about fixed deposit?"', '3. Verify bot understands "what about" refers to rates', '4. Check context preserved'],
        testData: 'Turn 1: "Savings account interest rate", Turn 2: "What about fixed deposit?"',
        expected: 'Bot infers Turn 2 is asking about FD interest rates (context from Turn 1).',
        actual: 'Bot lost context. Responded with generic FD info instead of FD interest rates.',
        executionTime: '2.8s',
      },
      {
        id: 'TC-AI-006', name: 'Fallback response for unknown queries', priority: 'P1', status: 'Pass',
        steps: ['1. Send "What is the weather today?"', '2. Verify fallback response', '3. Check handoff option offered'],
        testData: '"What is the weather today?" (out of domain)',
        expected: 'Bot responds with fallback: "I can help with banking queries. Would you like to speak to an agent?"',
        actual: 'Fallback triggered. Message: "I specialize in banking. Let me connect you to an agent for other queries."',
        executionTime: '1.0s',
      },
      {
        id: 'TC-AI-007', name: 'Sentiment analysis detection', priority: 'P1', status: 'Pass',
        steps: ['1. Send angry message: "This is terrible service! Fix my issue NOW!"', '2. Verify sentiment detected as negative', '3. Check empathetic response triggered'],
        testData: '"This is terrible service! Fix my issue NOW!"',
        expected: 'Bot detects negative sentiment and responds empathetically with escalation offer.',
        actual: 'Sentiment: negative (score: -0.85). Response: "I understand your frustration. Let me escalate this to a senior representative."',
        executionTime: '1.3s',
      },
      {
        id: 'TC-AI-008', name: 'Language switching (English/Hindi/French)', priority: 'P1', status: 'Pending',
        steps: ['1. Start in English', '2. Switch to Hindi: "Mera balance kitna hai?"', '3. Verify response in Hindi', '4. Switch to French', '5. Verify language detection'],
        testData: 'EN: "Check balance", HI: "Mera balance kitna hai?", FR: "Quel est mon solde?"',
        expected: 'Bot detects language and responds in same language for all 3.',
        actual: 'Pending - Hindi and French language models not yet deployed.',
        executionTime: '-',
      },
      {
        id: 'TC-AI-009', name: 'Spelling error tolerance', priority: 'P1', status: 'Pass',
        steps: ['1. Send "chek my balanse"', '2. Verify bot understands despite typos', '3. Send "transferr money"', '4. Verify intent detected'],
        testData: '"chek my balanse", "transferr money", "blok my card"',
        expected: 'Bot correctly identifies intent despite spelling errors (fuzzy matching).',
        actual: 'All 3 misspelled inputs correctly classified: balance, transfer, card_block.',
        executionTime: '2.1s',
      },
      {
        id: 'TC-AI-010', name: 'Abbreviation understanding (txn, a/c, bal)', priority: 'P1', status: 'Pass',
        steps: ['1. Send "chk bal of my a/c"', '2. Verify abbreviations expanded', '3. Send "txn status pls"', '4. Verify intent'],
        testData: '"chk bal of my a/c", "txn status pls", "stmt for prev mnth"',
        expected: 'Bot expands abbreviations: txn=transaction, a/c=account, bal=balance, stmt=statement.',
        actual: 'All abbreviations correctly expanded and intents classified.',
        executionTime: '1.7s',
      },
    ],
  },
  {
    category: 'Security & Compliance Chat',
    icon: '\u{1F512}',
    color: '#e74c3c',
    scenarios: [
      {
        id: 'TC-SEC-001', name: 'PII masking in chat logs', priority: 'P0', status: 'Pass',
        steps: ['1. Send account number in chat', '2. Check chat log storage', '3. Verify account number is masked', '4. Verify other PII masked (SSN, email)'],
        testData: 'Account: 1234567890, SSN: 123-45-6789, Email: user@bank.com',
        expected: 'All PII masked in logs: XXXX7890, XXX-XX-6789, u***@bank.com.',
        actual: 'PII masking verified. Account: XXXX7890, SSN: XXX-XX-6789, Email: u***@bank.com.',
        executionTime: '2.0s',
      },
      {
        id: 'TC-SEC-002', name: 'Authentication before sensitive info', priority: 'P0', status: 'Pass',
        steps: ['1. Request balance without authentication', '2. Verify bot asks for auth', '3. Complete authentication', '4. Verify sensitive info shown only after auth'],
        testData: 'Unauthenticated user requests balance',
        expected: 'Bot requires OTP/PIN verification before showing any account data.',
        actual: 'Authentication gate triggered. Balance only shown after OTP verification.',
        executionTime: '4.5s',
      },
      {
        id: 'TC-SEC-003', name: 'Session encryption verification', priority: 'P0', status: 'Pass',
        steps: ['1. Start chat session', '2. Capture network traffic', '3. Verify TLS 1.3 encryption', '4. Verify WebSocket messages encrypted'],
        testData: 'Network capture via Wireshark/DevTools',
        expected: 'All chat messages encrypted in transit (TLS 1.3, WSS protocol).',
        actual: 'TLS 1.3 confirmed. WebSocket upgrade over HTTPS. No plaintext leakage.',
        executionTime: '3.2s',
      },
      {
        id: 'TC-SEC-004', name: 'Chat transcript audit logging', priority: 'P0', status: 'Pass',
        steps: ['1. Complete a chat session', '2. Check audit log database', '3. Verify session recorded', '4. Verify timestamp, user ID, agent ID logged'],
        testData: 'Complete chat session with 10 messages',
        expected: 'Full transcript in audit log with timestamps, user ID, and session metadata.',
        actual: 'Audit log contains all 10 messages with ISO timestamps, user_id, session_id, ip_address.',
        executionTime: '1.8s',
      },
      {
        id: 'TC-SEC-005', name: 'GDPR data retention compliance', priority: 'P0', status: 'Pass',
        steps: ['1. Check data retention policy config', '2. Verify chat logs older than 90 days auto-purged', '3. Test "delete my data" request', '4. Verify data erasure'],
        testData: 'Chat logs from 91 days ago, GDPR deletion request',
        expected: 'Logs >90 days auto-purged. User data deletion completes within 24 hours.',
        actual: 'Auto-purge confirmed for 91-day logs. Deletion request completed in 2 hours.',
        executionTime: '5.0s',
      },
      {
        id: 'TC-SEC-006', name: 'Sensitive data redaction', priority: 'P0', status: 'Fail',
        steps: ['1. Agent sends message containing card number', '2. Verify card number redacted in display', '3. Check redaction in stored transcript', '4. Verify regex patterns cover all card formats'],
        testData: 'Card: 4111-1111-1111-1111, CVV: 123',
        expected: 'Card number redacted to 4111-XXXX-XXXX-1111, CVV completely hidden.',
        actual: 'Card number redacted but CVV "123" visible in transcript. Regex pattern missing for standalone 3-digit CVV.',
        executionTime: '2.3s',
      },
      {
        id: 'TC-SEC-007', name: 'OTP verification via chat', priority: 'P0', status: 'Pass',
        steps: ['1. Trigger OTP for sensitive operation', '2. Enter correct OTP', '3. Verify access granted', '4. Enter wrong OTP 3 times', '5. Verify account locked'],
        testData: 'Correct OTP: 456789, Wrong OTP: 000000 (3 attempts)',
        expected: 'Correct OTP grants access. 3 wrong attempts lock account with notification.',
        actual: 'Correct OTP: access granted. 3 failures: account locked, SMS notification sent.',
        executionTime: '8.5s',
      },
      {
        id: 'TC-SEC-008', name: 'Fraud alert notification in chat', priority: 'P0', status: 'Pass',
        steps: ['1. Trigger suspicious transaction', '2. Verify fraud alert appears in chat', '3. User confirms/denies transaction', '4. Verify appropriate action taken'],
        testData: 'Unusual transaction: $5000 from new IP in different country',
        expected: 'Fraud alert pushed to chat within 30 seconds with confirm/deny buttons.',
        actual: 'Alert pushed in 12 seconds. User denied -> transaction blocked, card temporarily frozen.',
        executionTime: '15.2s',
      },
    ],
  },
  {
    category: 'Chat UI/UX Testing',
    icon: '\u{1F3A8}',
    color: '#f39c12',
    scenarios: [
      {
        id: 'TC-UX-001', name: 'Message send/receive animation', priority: 'P1', status: 'Pass',
        steps: ['1. Send a message', '2. Verify send animation (slide up)', '3. Receive bot response', '4. Verify receive animation (fade in)', '5. Check smooth scrolling'],
        testData: 'Send 5 rapid messages',
        expected: 'Smooth slide-up animation on send, fade-in on receive, auto-scroll to latest.',
        actual: 'Animations smooth at 60fps. Auto-scroll working. No jank on rapid messages.',
        executionTime: '3.0s',
      },
      {
        id: 'TC-UX-002', name: 'Typing indicator display', priority: 'P1', status: 'Pass',
        steps: ['1. Send message to bot', '2. Verify typing indicator appears', '3. Check animation (three dots)', '4. Verify indicator disappears when response arrives'],
        testData: 'Any message to bot',
        expected: 'Three-dot typing indicator shown while bot processes, disappears on response.',
        actual: 'Typing indicator shown for 1.5s average. Smooth dot animation. Disappears on response.',
        executionTime: '2.2s',
      },
      {
        id: 'TC-UX-003', name: 'Emoji and rich text support', priority: 'P2', status: 'Pass',
        steps: ['1. Send message with emojis', '2. Send bold/italic text', '3. Send message with link', '4. Verify all render correctly'],
        testData: 'Emojis: \u{1F600}\u{1F44D}\u{2764}\uFE0F, Bold: **text**, Link: https://bank.com',
        expected: 'Emojis render natively, markdown parsed, links clickable.',
        actual: 'All emojis rendered. Bold/italic styled. Links open in new tab.',
        executionTime: '1.5s',
      },
      {
        id: 'TC-UX-004', name: 'File/image attachment', priority: 'P1', status: 'Fail',
        steps: ['1. Click attachment button', '2. Select a PDF file', '3. Verify upload progress', '4. Verify file preview shown', '5. Test image attachment'],
        testData: 'PDF: statement.pdf (2MB), Image: cheque.jpg (1MB)',
        expected: 'Upload progress shown, file/image preview displayed, download link provided.',
        actual: 'PDF upload works but image preview not rendering. Thumbnail generation fails for HEIC format.',
        executionTime: '4.8s',
      },
      {
        id: 'TC-UX-005', name: 'Chat history scroll/pagination', priority: 'P1', status: 'Pass',
        steps: ['1. Load chat with 500+ messages', '2. Scroll to top', '3. Verify older messages load', '4. Check scroll performance', '5. Verify no duplicate messages'],
        testData: 'Chat history: 500 messages',
        expected: 'Infinite scroll loads 50 messages at a time, smooth performance, no duplicates.',
        actual: 'Pagination working. 50 messages per batch. Scroll smooth. No duplicates detected.',
        executionTime: '2.8s',
      },
      {
        id: 'TC-UX-006', name: 'Responsive design (mobile/desktop)', priority: 'P0', status: 'Pass',
        steps: ['1. Open chat on desktop (1920px)', '2. Resize to tablet (768px)', '3. Resize to mobile (375px)', '4. Verify layout adapts at each breakpoint'],
        testData: 'Viewports: 1920px, 768px, 375px',
        expected: 'Chat adapts to all viewports. Full-screen on mobile, widget on desktop.',
        actual: 'Desktop: widget mode. Tablet: side panel. Mobile: full screen. All functional.',
        executionTime: '5.5s',
      },
      {
        id: 'TC-UX-007', name: 'Accessibility (screen reader)', priority: 'P1', status: 'Pending',
        steps: ['1. Enable VoiceOver/NVDA', '2. Navigate chat with keyboard', '3. Verify ARIA labels', '4. Check focus management', '5. Verify message announcements'],
        testData: 'Screen reader: NVDA 2024.1',
        expected: 'All elements labeled, keyboard navigable, new messages announced.',
        actual: 'Pending - Accessibility audit scheduled for Sprint 12.',
        executionTime: '-',
      },
      {
        id: 'TC-UX-008', name: 'Dark/Light mode toggle', priority: 'P2', status: 'Pass',
        steps: ['1. Open chat in light mode', '2. Toggle to dark mode', '3. Verify all elements themed', '4. Check contrast ratios', '5. Verify preference persisted'],
        testData: 'Light mode -> Dark mode toggle',
        expected: 'All chat elements switch theme. WCAG AA contrast maintained. Preference saved.',
        actual: 'Theme toggle works. All elements styled. Contrast ratios pass AA. Saved to localStorage.',
        executionTime: '1.2s',
      },
    ],
  },
  {
    category: 'Integration Chat Testing',
    icon: '\u{1F517}',
    color: '#1abc9c',
    scenarios: [
      {
        id: 'TC-INT-001', name: 'Chat -> CRM ticket creation', priority: 'P0', status: 'Pass',
        steps: ['1. Escalate issue in chat', '2. Bot creates CRM ticket', '3. Verify ticket ID returned', '4. Check ticket in CRM system', '5. Verify chat transcript attached'],
        testData: 'Issue: "Card not working at ATM for 3 days"',
        expected: 'CRM ticket created with chat transcript, priority auto-assigned.',
        actual: 'Ticket CRM-2026-4521 created. Transcript attached. Priority: High (auto-classified).',
        executionTime: '3.5s',
      },
      {
        id: 'TC-INT-002', name: 'Chat -> Email escalation', priority: 'P1', status: 'Pass',
        steps: ['1. Request email follow-up in chat', '2. Bot collects email address', '3. Verify email sent', '4. Check email content matches chat summary'],
        testData: 'Email: customer@email.com, Issue: Loan inquiry follow-up',
        expected: 'Email sent within 5 minutes with chat summary and next steps.',
        actual: 'Email delivered in 2 minutes. Contains chat summary, agent name, reference number.',
        executionTime: '2m 15s',
      },
      {
        id: 'TC-INT-003', name: 'Chat -> Agent handoff', priority: 'P0', status: 'Pass',
        steps: ['1. Request live agent in chat', '2. Bot queues user', '3. Verify queue position shown', '4. Agent connects', '5. Verify chat history transferred'],
        testData: 'Queue: 3rd in line, Wait: ~2 minutes',
        expected: 'Seamless handoff to agent with full chat history visible to agent.',
        actual: 'Queue position shown. Agent connected in 1:45. Full history visible to agent.',
        executionTime: '1m 50s',
      },
      {
        id: 'TC-INT-004', name: 'Chat -> Transaction initiation', priority: 'P0', status: 'Pass',
        steps: ['1. Request fund transfer via chat', '2. Bot collects details', '3. Transaction initiated via API', '4. Verify transaction in core banking', '5. Check confirmation in chat'],
        testData: 'Transfer: $500 to ACC 9876543210',
        expected: 'Transaction processed via core banking API, confirmation shown in chat.',
        actual: 'API call to /api/v1/transfers successful. TXN ID: TXN-2026-0225-789.',
        executionTime: '5.8s',
      },
      {
        id: 'TC-INT-005', name: 'Chat -> Document sharing', priority: 'P1', status: 'Pending',
        steps: ['1. Request statement in chat', '2. Bot generates PDF statement', '3. Document shared as download link', '4. Verify link expiry (24 hours)', '5. Check document encryption'],
        testData: 'Statement: Last 3 months, Format: PDF',
        expected: 'Encrypted PDF generated with expiring download link (24h).',
        actual: 'Pending - Document generation service integration in progress.',
        executionTime: '-',
      },
      {
        id: 'TC-INT-006', name: 'Webhook notification on chat events', priority: 'P1', status: 'Pass',
        steps: ['1. Configure webhook endpoint', '2. Start chat session', '3. Verify webhook fires on session_start', '4. Send message', '5. Verify webhook fires on message_sent', '6. End session', '7. Verify session_end webhook'],
        testData: 'Webhook URL: https://hooks.bank.com/chat-events',
        expected: 'Webhooks fire for: session_start, message_sent, message_received, session_end.',
        actual: 'All 4 event types firing correctly. Average webhook latency: 120ms.',
        executionTime: '8.2s',
      },
      {
        id: 'TC-INT-007', name: 'Chat analytics data push', priority: 'P2', status: 'Pass',
        steps: ['1. Complete chat session', '2. Check analytics pipeline', '3. Verify session metrics pushed', '4. Check response time tracking', '5. Verify CSAT score recorded'],
        testData: 'Session: 10 messages, Duration: 5 min, CSAT: 4/5',
        expected: 'Analytics dashboard shows session duration, message count, CSAT, and resolution status.',
        actual: 'All metrics pushed to analytics. Dashboard updated within 30 seconds.',
        executionTime: '3.0s',
      },
      {
        id: 'TC-INT-008', name: 'Chat -> Voice call escalation', priority: 'P1', status: 'Fail',
        steps: ['1. Request voice call in chat', '2. Bot initiates WebRTC connection', '3. Verify call connects', '4. Check audio quality', '5. Verify chat transcript shared with voice agent'],
        testData: 'WebRTC call from chat widget',
        expected: 'Seamless transition from chat to voice call with context preserved.',
        actual: 'WebRTC connection fails intermittently (30% failure rate). Audio codec negotiation timeout.',
        executionTime: '12.5s',
      },
    ],
  },
];

// =============================================================================
// DATA: Pre-scripted conversations for each scenario
// =============================================================================

const DEFAULT_CONVERSATION = [
  { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
  { sender: 'user', text: 'I want to check my account balance', time: '10:00 AM' },
  { sender: 'bot', text: 'Sure! Please provide your account number for verification.', time: '10:00 AM' },
  { sender: 'user', text: '1234567890', time: '10:01 AM' },
  { sender: 'bot', text: 'For security, please enter the OTP sent to your registered mobile.', time: '10:01 AM' },
  { sender: 'user', text: '456789', time: '10:01 AM' },
  { sender: 'bot', text: 'Your account balance is $12,450.50. Savings Account - XXXX7890. Last transaction: -$250.00 on 2026-02-20.', time: '10:02 AM' },
];

const SCENARIO_CONVERSATIONS = {
  'TC-CHAT-001': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'bot', text: 'You can ask me about:\n- Account Balance\n- Fund Transfer\n- Card Services\n- Loans & Deposits\n\nOr type your question below!', time: '10:00 AM' },
  ],
  'TC-CHAT-002': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'I want to check my account balance', time: '10:00 AM' },
    { sender: 'bot', text: 'Sure! Please provide your account number for verification.', time: '10:00 AM' },
    { sender: 'user', text: '1234567890', time: '10:01 AM' },
    { sender: 'bot', text: 'For security, please enter the OTP sent to your registered mobile.', time: '10:01 AM' },
    { sender: 'user', text: '456789', time: '10:01 AM' },
    { sender: 'bot', text: 'Your account balance is $12,450.50. Savings Account - XXXX7890. Last transaction: -$250.00 on 2026-02-20.', time: '10:02 AM' },
  ],
  'TC-CHAT-003': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Check my transaction status', time: '10:00 AM' },
    { sender: 'bot', text: 'Please provide your transaction reference number.', time: '10:00 AM' },
    { sender: 'user', text: 'TXN2026022512345', time: '10:01 AM' },
    { sender: 'bot', text: 'Transaction Details:\n- Reference: TXN2026022512345\n- Amount: $500.00\n- To: John Doe\n- Date: 2026-02-25\n- Status: Completed\n\nIs there anything else I can help with?', time: '10:01 AM' },
  ],
  'TC-CHAT-004': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Find nearest ATM', time: '10:00 AM' },
    { sender: 'bot', text: 'I can help you find the nearest ATM. Please share your pin code or allow location access.', time: '10:00 AM' },
    { sender: 'user', text: '560001', time: '10:01 AM' },
    { sender: 'bot', text: 'ATMs near 560001 (Bangalore):\n\n1. MG Road Branch - 0.3 km (24/7)\n2. Brigade Road ATM - 0.8 km (24/7)\n3. Residency Road - 1.2 km (6AM-11PM)\n4. Cubbon Park Branch - 1.5 km (24/7)\n5. Lavelle Road ATM - 1.9 km (24/7)', time: '10:01 AM' },
  ],
  'TC-CHAT-005': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'What are your interest rates?', time: '10:00 AM' },
    { sender: 'bot', text: 'Which product would you like to know rates for?\n\n1. Savings Account\n2. Fixed Deposit\n3. Home Loan\n4. Personal Loan\n5. Car Loan', time: '10:00 AM' },
    { sender: 'user', text: 'Savings Account', time: '10:01 AM' },
    { sender: 'bot', text: 'Savings Account Interest Rates:\n\n- Balance up to $10,000: 3.5% p.a.\n- Balance $10,001 - $100,000: 4.0% p.a.\n- Balance above $100,000: 4.5% p.a.\n\nInterest credited quarterly. Effective from Jan 2026.', time: '10:01 AM' },
  ],
  'TC-CHAT-006': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Am I eligible for a loan?', time: '10:00 AM' },
    { sender: 'bot', text: 'I can check your loan eligibility. What is your monthly income?', time: '10:00 AM' },
    { sender: 'user', text: '$5000 per month', time: '10:01 AM' },
    { sender: 'bot', text: 'Are you salaried or self-employed?', time: '10:01 AM' },
    { sender: 'user', text: 'Salaried', time: '10:01 AM' },
    { sender: 'bot', text: 'What is your credit score? (You can check at creditbureau.com)', time: '10:01 AM' },
    { sender: 'user', text: '750', time: '10:02 AM' },
    { sender: 'bot', text: 'Great news! You are eligible for:\n\n- Personal Loan: Up to $50,000 at 8.5% p.a.\n- Home Loan: Up to $300,000 at 6.8% p.a.\n- Car Loan: Up to $40,000 at 7.2% p.a.\n\nWould you like to apply for any of these?', time: '10:02 AM' },
  ],
  'TC-CHAT-007': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'I need to block my card immediately', time: '10:00 AM' },
    { sender: 'bot', text: 'I understand the urgency. Please provide the last 4 digits of your card.', time: '10:00 AM' },
    { sender: 'user', text: '7890', time: '10:00 AM' },
    { sender: 'bot', text: 'Card ending ****7890 found. Reason for blocking?\n\n1. Lost\n2. Stolen\n3. Suspicious transaction\n4. Damaged', time: '10:00 AM' },
    { sender: 'user', text: 'Lost', time: '10:01 AM' },
    { sender: 'bot', text: 'Card ****7890 has been BLOCKED immediately.\n\nReference: BLK-2026-0225-001\nReplacement card will be sent to your registered address within 5 business days.\n\nIf you find your card, you can request unblocking via this chat or by calling 1800-XXX-XXXX.', time: '10:01 AM' },
  ],
  'TC-CHAT-008': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'I want to file a complaint', time: '10:00 AM' },
    { sender: 'bot', text: 'I am sorry to hear that. Please select the complaint category:\n\n1. ATM Issue\n2. Transaction Problem\n3. Card Issue\n4. Service Quality\n5. Other', time: '10:00 AM' },
    { sender: 'user', text: 'ATM Issue', time: '10:01 AM' },
    { sender: 'bot', text: 'Please describe your issue in detail.', time: '10:01 AM' },
    { sender: 'user', text: 'The ATM at MG Road ate my card yesterday. I was trying to withdraw $200 and the machine froze.', time: '10:01 AM' },
    { sender: 'bot', text: 'Your complaint has been registered.\n\nCategory: ATM Issue\nDescription: Card retained by ATM at MG Road\n\nError: Unable to generate tracking ID. Please contact our helpline at 1800-XXX-XXXX for your reference number.\n\nWe apologize for the inconvenience.', time: '10:02 AM' },
  ],
  'TC-CHAT-009': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'I want to transfer money', time: '10:00 AM' },
    { sender: 'bot', text: 'Sure! Who would you like to transfer to? Please provide the beneficiary name and account number.', time: '10:00 AM' },
    { sender: 'user', text: 'John Doe, Account: 9876543210', time: '10:01 AM' },
    { sender: 'bot', text: 'How much would you like to transfer?', time: '10:01 AM' },
    { sender: 'user', text: '$500', time: '10:01 AM' },
    { sender: 'bot', text: 'Transfer Summary:\n- To: John Doe (9876543210)\n- Amount: $500.00\n- From: Your Savings (XXXX7890)\n\nPlease confirm (Yes/No)', time: '10:01 AM' },
    { sender: 'user', text: 'Yes', time: '10:02 AM' },
    { sender: 'bot', text: 'Transfer successful!\n\nTXN ID: TXN2026022567890\nAmount: $500.00\nTo: John Doe\nNew Balance: $11,950.50\n\nA confirmation SMS has been sent to your registered mobile.', time: '10:02 AM' },
  ],
  'TC-CHAT-010': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Hello', time: '10:00 AM' },
    { sender: 'bot', text: 'Hi there! How can I assist you today?', time: '10:00 AM' },
    { sender: 'bot', text: '[5 minutes of inactivity...]\n\nAre you still there? This session will end in 1 minute due to inactivity.', time: '10:05 AM' },
    { sender: 'bot', text: 'Session ended due to inactivity.\n\nThank you for chatting with ABC Bank. If you need further assistance, please start a new chat.\n\n[Start New Chat]', time: '10:06 AM' },
  ],
  'TC-AI-001': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'I wanna see how much money I got', time: '10:00 AM' },
    { sender: 'bot', text: '[NLU Debug: Intent=check_balance, Confidence=0.94]\n\nI can help you check your account balance! Please provide your account number.', time: '10:00 AM' },
    { sender: 'user', text: 'yo can u also tell me bout my last few buys', time: '10:01 AM' },
    { sender: 'bot', text: '[NLU Debug: Intent=transaction_history, Confidence=0.91]\n\nSure! I will show your recent transactions after verification. Please enter your account number.', time: '10:01 AM' },
  ],
  'TC-AI-002': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'bot', text: '[Intent Classification Test Suite - 50 Utterances]\n\nRunning...', time: '10:00 AM' },
    { sender: 'user', text: 'Testing: "Show me my balance" -> check_balance', time: '10:00 AM' },
    { sender: 'bot', text: 'Classified: check_balance (0.97) CORRECT', time: '10:00 AM' },
    { sender: 'user', text: 'Testing: "Send money to mom" -> fund_transfer', time: '10:00 AM' },
    { sender: 'bot', text: 'Classified: fund_transfer (0.93) CORRECT', time: '10:00 AM' },
    { sender: 'user', text: 'Testing: "Can I get a home loan" -> loan_inquiry', time: '10:01 AM' },
    { sender: 'bot', text: 'Classified: loan_inquiry (0.88) CORRECT\n\n---\nOverall Results: 47/50 correct (94%)\nLowest: loan_inquiry (88%)\nHighest: greeting (100%)', time: '10:01 AM' },
  ],
  'TC-AI-003': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Transfer $500 to account 9876543210', time: '10:00 AM' },
    { sender: 'bot', text: '[Entity Extraction]\n- Amount: $500 (USD)\n- Account: 9876543210\n- Action: transfer\n\nI will transfer $500.00 to account 9876543210. Please confirm.', time: '10:00 AM' },
    { sender: 'user', text: 'Actually make it 750 rupees to a/c 1122334455', time: '10:01 AM' },
    { sender: 'bot', text: '[Entity Extraction - Updated]\n- Amount: 750 (INR)\n- Account: 1122334455\n- Action: transfer\n\nUpdated: Transferring INR 750 to account 1122334455. Confirm?', time: '10:01 AM' },
  ],
  'TC-AI-004': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'I want to check loan eligibility', time: '10:00 AM' },
    { sender: 'bot', text: '[Turn 1/4 - Slot: loan_type] What type of loan? Personal, Home, or Car?', time: '10:00 AM' },
    { sender: 'user', text: 'Personal loan', time: '10:01 AM' },
    { sender: 'bot', text: '[Turn 2/4 - Slot: income] What is your monthly income?', time: '10:01 AM' },
    { sender: 'user', text: '$5000', time: '10:01 AM' },
    { sender: 'bot', text: '[Turn 3/4 - Slot: employment] Are you salaried or self-employed?', time: '10:01 AM' },
    { sender: 'user', text: 'Salaried', time: '10:02 AM' },
    { sender: 'bot', text: '[Turn 4/4 - Slot: credit_score] What is your credit score?', time: '10:02 AM' },
    { sender: 'user', text: '750', time: '10:02 AM' },
    { sender: 'bot', text: '[All slots filled]\n- loan_type: personal\n- income: 5000\n- employment: salaried\n- credit_score: 750\n\nEligible for Personal Loan up to $50,000 at 8.5% p.a.', time: '10:02 AM' },
  ],
  'TC-AI-005': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'What is the savings account interest rate?', time: '10:00 AM' },
    { sender: 'bot', text: 'Savings Account rates:\n- Up to $10K: 3.5% p.a.\n- $10K-$100K: 4.0% p.a.\n- Above $100K: 4.5% p.a.', time: '10:00 AM' },
    { sender: 'user', text: 'What about fixed deposit?', time: '10:01 AM' },
    { sender: 'bot', text: '[Context Lost - Expected: FD interest rates]\n\nFixed Deposit is a safe investment option where you deposit a lump sum for a fixed period.\n\nWould you like to open a Fixed Deposit?\n\n[BUG: Should have shown FD interest rates based on context from previous turn]', time: '10:01 AM' },
  ],
  'TC-AI-006': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'What is the weather today?', time: '10:00 AM' },
    { sender: 'bot', text: 'I specialize in banking services and may not have information about the weather. I can help you with:\n\n- Account inquiries\n- Fund transfers\n- Loan information\n- Card services\n\nWould you like to speak to a live agent for other queries?', time: '10:00 AM' },
    { sender: 'user', text: 'Can you order pizza for me?', time: '10:01 AM' },
    { sender: 'bot', text: 'I am afraid I cannot help with food orders. I am your banking assistant!\n\nLet me connect you to a live agent if you need non-banking assistance. Would you like that?', time: '10:01 AM' },
  ],
  'TC-AI-007': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'This is terrible service! I have been waiting for my card replacement for 2 weeks! Fix this NOW!', time: '10:00 AM' },
    { sender: 'bot', text: '[Sentiment: NEGATIVE (-0.85)]\n\nI sincerely apologize for the delay and understand your frustration. Card replacements should not take more than 5 business days.\n\nLet me escalate this to our senior team immediately. Can you provide your card reference number?', time: '10:00 AM' },
    { sender: 'user', text: 'BLK-2026-0210-042. This is really annoying.', time: '10:01 AM' },
    { sender: 'bot', text: '[Sentiment: NEGATIVE (-0.62)]\n\nI have flagged reference BLK-2026-0210-042 as urgent. A supervisor will call you within 2 hours.\n\nIs there a preferred time for the callback?', time: '10:01 AM' },
  ],
  'TC-AI-008': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Mera balance kitna hai?', time: '10:00 AM' },
    { sender: 'bot', text: '[Language Detected: Hindi]\n[Status: Hindi model not deployed]\n\nI detected you are writing in Hindi. Unfortunately, Hindi language support is not yet available.\n\nPlease continue in English, or I can connect you to a Hindi-speaking agent.\n\n[Pending: Hindi/French language models deployment]', time: '10:01 AM' },
  ],
  'TC-AI-009': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'chek my balanse', time: '10:00 AM' },
    { sender: 'bot', text: '[Spell Correction: "chek" -> "check", "balanse" -> "balance"]\n[Intent: check_balance (0.92)]\n\nI can help you check your balance! Please provide your account number.', time: '10:00 AM' },
    { sender: 'user', text: 'transferr money to frend', time: '10:01 AM' },
    { sender: 'bot', text: '[Spell Correction: "transferr" -> "transfer", "frend" -> "friend"]\n[Intent: fund_transfer (0.89)]\n\nSure! Please provide your friend\'s account number and the amount to transfer.', time: '10:01 AM' },
  ],
  'TC-AI-010': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'chk bal of my a/c', time: '10:00 AM' },
    { sender: 'bot', text: '[Abbreviation Expansion: "chk" -> "check", "bal" -> "balance", "a/c" -> "account"]\n[Intent: check_balance (0.95)]\n\nI can help you check your account balance! Please provide your account number.', time: '10:00 AM' },
    { sender: 'user', text: 'txn status pls', time: '10:01 AM' },
    { sender: 'bot', text: '[Abbreviation Expansion: "txn" -> "transaction", "pls" -> "please"]\n[Intent: transaction_status (0.93)]\n\nPlease provide your transaction reference number.', time: '10:01 AM' },
  ],
  'TC-SEC-001': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Check balance for account 1234567890', time: '10:00 AM' },
    { sender: 'bot', text: 'Processing your request for account XXXX7890...\n\n[PII Masking Log]\n- Input: "1234567890" -> Stored as: "XXXX7890"\n- Chat log entry: Account XXXX7890 queried\n- Full number NOT stored in transcript', time: '10:00 AM' },
    { sender: 'user', text: 'My SSN is 123-45-6789 and email user@bank.com', time: '10:01 AM' },
    { sender: 'bot', text: '[PII Detection & Masking]\n- SSN detected: 123-45-6789 -> XXX-XX-6789\n- Email detected: user@bank.com -> u***@bank.com\n\nPlease avoid sharing sensitive information like SSN in chat. Your data has been automatically masked for security.', time: '10:01 AM' },
  ],
  'TC-SEC-002': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Show me my account balance', time: '10:00 AM' },
    { sender: 'bot', text: '[Authentication Required]\n\nTo access account information, I need to verify your identity.\n\nPlease provide your registered mobile number to receive an OTP.', time: '10:00 AM' },
    { sender: 'user', text: '+1-555-0123', time: '10:01 AM' },
    { sender: 'bot', text: 'OTP sent to +1-XXX-0123. Please enter the 6-digit code.', time: '10:01 AM' },
    { sender: 'user', text: '456789', time: '10:01 AM' },
    { sender: 'bot', text: '[Authentication: SUCCESS]\n\nYour Savings Account (XXXX7890): $12,450.50\nYour Current Account (XXXX3456): $8,230.00\n\nTotal: $20,680.50', time: '10:02 AM' },
  ],
  'TC-SEC-003': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'bot', text: '[Session Security Check]\n\n- Protocol: WSS (WebSocket Secure)\n- TLS Version: 1.3\n- Cipher: TLS_AES_256_GCM_SHA384\n- Certificate: Valid (expires 2027-01-15)\n- HSTS: Enabled\n- CSP: Strict', time: '10:00 AM' },
    { sender: 'user', text: 'Is this chat secure?', time: '10:00 AM' },
    { sender: 'bot', text: 'Yes, this chat is fully encrypted!\n\n- All messages are encrypted in transit using TLS 1.3\n- WebSocket connection is secured (WSS)\n- No plaintext data transmitted\n- Session tokens rotate every 15 minutes\n\nYou can safely share account details for verification.', time: '10:01 AM' },
  ],
  'TC-SEC-004': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Check my balance', time: '10:00 AM' },
    { sender: 'bot', text: '[Audit Log Entry Created]\n\n- Session ID: SESS-2026-0225-A1B2C3\n- User ID: USR-78901\n- Timestamp: 2026-02-25T10:00:00Z\n- Action: balance_inquiry\n- IP: 192.168.1.xxx\n- Device: Chrome 120 / Windows 11\n\nAll interactions are logged for compliance and security auditing.', time: '10:00 AM' },
  ],
  'TC-SEC-005': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Delete all my chat history', time: '10:00 AM' },
    { sender: 'bot', text: '[GDPR Data Request]\n\nI can process your data deletion request. Under GDPR Article 17, you have the right to erasure.\n\nThis will delete:\n- All chat transcripts\n- Session metadata\n- Analytics data linked to your account\n\nRetention policy: Data auto-purged after 90 days.\n\nConfirm deletion? (Yes/No)', time: '10:00 AM' },
    { sender: 'user', text: 'Yes', time: '10:01 AM' },
    { sender: 'bot', text: 'Data deletion request submitted.\n\nRequest ID: GDPR-DEL-2026-0225-001\nEstimated completion: Within 24 hours\nConfirmation email will be sent to your registered address.\n\nNote: Regulatory data (7-year retention) is exempt from this deletion.', time: '10:01 AM' },
  ],
  'TC-SEC-006': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'My card number is 4111-1111-1111-1111 and CVV is 123', time: '10:00 AM' },
    { sender: 'bot', text: '[Data Redaction Engine]\n- Card number: 4111-XXXX-XXXX-1111 (redacted)\n- CVV: 123 (BUG: NOT REDACTED - standalone 3-digit pattern not caught)\n\nPlease never share your full card number or CVV in chat!\n\nI have masked your card number. However, your CVV was not automatically redacted due to a pattern matching gap.\n\n[DEFECT LOGGED: CVV regex pattern needs update]', time: '10:01 AM' },
  ],
  'TC-SEC-007': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'I want to transfer $1000', time: '10:00 AM' },
    { sender: 'bot', text: 'For this transaction, OTP verification is required. Sending OTP to your registered mobile...', time: '10:00 AM' },
    { sender: 'bot', text: 'OTP sent! Please enter the 6-digit code.', time: '10:00 AM' },
    { sender: 'user', text: '000000', time: '10:01 AM' },
    { sender: 'bot', text: 'Invalid OTP. 2 attempts remaining.', time: '10:01 AM' },
    { sender: 'user', text: '000000', time: '10:01 AM' },
    { sender: 'bot', text: 'Invalid OTP. 1 attempt remaining.', time: '10:01 AM' },
    { sender: 'user', text: '000000', time: '10:02 AM' },
    { sender: 'bot', text: 'Account LOCKED due to 3 failed OTP attempts.\n\nFor security, your account has been temporarily locked. You will receive an SMS notification.\n\nTo unlock, please visit your nearest branch with valid ID or call 1800-XXX-XXXX.', time: '10:02 AM' },
  ],
  'TC-SEC-008': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'bot', text: '[FRAUD ALERT - URGENT]\n\nSuspicious transaction detected on your account!\n\nAmount: $5,000.00\nMerchant: Unknown (Lagos, Nigeria)\nTime: 2026-02-25 09:58:00 UTC\nIP: 41.203.xxx.xxx (Unusual location)\n\nDid you authorize this transaction?', time: '10:00 AM' },
    { sender: 'user', text: 'No! I did not make that transaction!', time: '10:00 AM' },
    { sender: 'bot', text: 'Transaction BLOCKED immediately.\n\nActions taken:\n1. Transaction reversed\n2. Card temporarily frozen\n3. Fraud case opened: FRD-2026-0225-001\n4. SMS alert sent to registered mobile\n5. Email notification sent\n\nA fraud specialist will contact you within 1 hour. Your account is now secure.', time: '10:01 AM' },
  ],
  'TC-UX-001': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Testing message animations', time: '10:00 AM' },
    { sender: 'bot', text: '[Animation Test]\n\n- Send animation: slide-up (300ms ease-out)\n- Receive animation: fade-in (250ms ease-in)\n- Auto-scroll: smooth scroll to bottom\n- FPS: 60fps maintained\n\nAll message animations rendering correctly.', time: '10:00 AM' },
  ],
  'TC-UX-002': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Hello', time: '10:00 AM' },
    { sender: 'bot', text: '[Typing Indicator Test]\n\nTyping indicator displayed for 1.5 seconds with three-dot animation.\nIndicator disappeared when this response arrived.\n\nTest Result: PASS', time: '10:01 AM' },
  ],
  'TC-UX-003': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Testing emojis: \u{1F600} \u{1F44D} \u{2764}\uFE0F \u{1F3E6} \u{1F4B0}', time: '10:00 AM' },
    { sender: 'bot', text: 'Emoji rendering test:\n- Smiley: \u{1F600} PASS\n- Thumbs up: \u{1F44D} PASS\n- Heart: \u{2764}\uFE0F PASS\n- Bank: \u{1F3E6} PASS\n- Money: \u{1F4B0} PASS\n\nRich text: **Bold** and *Italic* supported.\nLinks: https://bank.com renders as clickable link.', time: '10:00 AM' },
  ],
  'TC-UX-004': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'I want to upload a document', time: '10:00 AM' },
    { sender: 'bot', text: 'Please use the attachment button to upload your document.\n\nSupported formats: PDF, JPG, PNG\nMax size: 5MB', time: '10:00 AM' },
    { sender: 'user', text: '[Attached: statement.pdf (2MB)]', time: '10:01 AM' },
    { sender: 'bot', text: 'PDF uploaded successfully! Preview available.\n\n[Attached: cheque.jpg (1MB)]\n[BUG: Image preview not rendering - HEIC format thumbnail generation failed]\n\nDefect: Image preview broken for HEIC format.', time: '10:01 AM' },
  ],
  'TC-UX-005': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'bot', text: '[Chat History Pagination Test]\n\nLoaded 500 messages in 10 batches of 50.\nScroll to top triggers lazy loading.\nNo duplicate messages detected.\nPerformance: Smooth at 60fps.\n\nResult: PASS', time: '10:00 AM' },
  ],
  'TC-UX-006': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'bot', text: '[Responsive Design Test]\n\nDesktop (1920px): Widget mode - bottom right\nTablet (768px): Side panel - 40% width\nMobile (375px): Full screen overlay\n\nAll breakpoints: Functional, readable, usable.\nResult: PASS', time: '10:00 AM' },
  ],
  'TC-UX-007': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'bot', text: '[Accessibility Audit - PENDING]\n\nScheduled for Sprint 12.\n\nPlanned checks:\n- ARIA labels on all elements\n- Keyboard navigation (Tab, Enter, Escape)\n- Screen reader announcements\n- Focus management\n- Color contrast (WCAG AA)', time: '10:00 AM' },
  ],
  'TC-UX-008': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Switch to dark mode', time: '10:00 AM' },
    { sender: 'bot', text: '[Theme Toggle Test]\n\nLight Mode -> Dark Mode:\n- Background: #FFFFFF -> #1A1A2E\n- Text: #333333 -> #E0E0E0\n- Bubbles: Updated\n- Contrast: WCAG AA PASS\n- Preference saved to localStorage\n\nResult: PASS', time: '10:00 AM' },
  ],
  'TC-INT-001': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'My card has not been working at ATMs for 3 days. I need help!', time: '10:00 AM' },
    { sender: 'bot', text: 'I am sorry about the inconvenience. Let me create a support ticket for you.\n\n[Creating CRM Ticket...]\n\nTicket Created!\n- ID: CRM-2026-4521\n- Priority: High (auto-classified based on duration)\n- Category: Card/ATM Issue\n- Chat transcript: Attached\n- Assigned to: Card Support Team\n\nA representative will contact you within 4 hours.', time: '10:01 AM' },
  ],
  'TC-INT-002': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Can you send me an email summary of this conversation?', time: '10:00 AM' },
    { sender: 'bot', text: 'Sure! What email address should I send the summary to?', time: '10:00 AM' },
    { sender: 'user', text: 'customer@email.com', time: '10:01 AM' },
    { sender: 'bot', text: 'Email summary sent to customer@email.com\n\nContents:\n- Chat transcript\n- Reference numbers discussed\n- Next steps summary\n- Agent name and contact\n\nDelivery time: 2 minutes', time: '10:01 AM' },
  ],
  'TC-INT-003': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'I want to talk to a real person', time: '10:00 AM' },
    { sender: 'bot', text: 'Connecting you to a live agent...\n\nYou are #3 in queue.\nEstimated wait: ~2 minutes.\n\nYour chat history will be shared with the agent for context.', time: '10:00 AM' },
    { sender: 'bot', text: '[Queue position: #2] Please wait...', time: '10:01 AM' },
    { sender: 'bot', text: '[Queue position: #1] Almost there...', time: '10:01 AM' },
    { sender: 'bot', text: 'Agent Priya M. has joined the chat!\n\n[Chat history transferred]', time: '10:02 AM' },
    { sender: 'bot', text: 'Hi! I am Priya from ABC Bank support. I can see your previous messages. How can I help further?', time: '10:02 AM' },
  ],
  'TC-INT-004': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'Transfer $500 to John Doe', time: '10:00 AM' },
    { sender: 'bot', text: '[Initiating Transaction via Core Banking API]\n\nAPI Call: POST /api/v1/transfers\nPayload: {amount: 500, currency: "USD", beneficiary: "John Doe"}\n\n...Processing...', time: '10:00 AM' },
    { sender: 'bot', text: 'Transaction Complete!\n\nAPI Response: 201 Created\nTXN ID: TXN-2026-0225-789\nAmount: $500.00\nTo: John Doe\nStatus: Success\n\nCore banking system updated.', time: '10:01 AM' },
  ],
  'TC-INT-005': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'I need my last 3 months statement', time: '10:00 AM' },
    { sender: 'bot', text: '[Document Generation - PENDING]\n\nThe document sharing service integration is currently in progress.\n\nPlanned flow:\n1. Generate encrypted PDF\n2. Create expiring download link (24h)\n3. Share in chat\n4. Send copy via email\n\nExpected deployment: Sprint 13', time: '10:01 AM' },
  ],
  'TC-INT-006': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'bot', text: '[Webhook Test - Chat Events]\n\nEvent 1: session_start -> POST https://hooks.bank.com/chat-events\nResponse: 200 OK (85ms)\n\nEvent 2: message_sent -> POST https://hooks.bank.com/chat-events\nResponse: 200 OK (120ms)\n\nEvent 3: message_received -> POST https://hooks.bank.com/chat-events\nResponse: 200 OK (95ms)', time: '10:00 AM' },
    { sender: 'user', text: 'Test message for webhook', time: '10:00 AM' },
    { sender: 'bot', text: 'Event 4: session_end -> POST https://hooks.bank.com/chat-events\nResponse: 200 OK (110ms)\n\nAll webhooks firing correctly. Avg latency: 102ms.', time: '10:01 AM' },
  ],
  'TC-INT-007': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'bot', text: '[Analytics Pipeline Test]\n\nSession metrics pushed:\n- Session ID: SESS-2026-0225-A1B2C3\n- Duration: 5 min 23 sec\n- Messages: 10 (5 user, 5 bot)\n- Resolution: Resolved\n- CSAT Score: 4/5\n- First Response Time: 1.2s\n- Avg Response Time: 2.1s\n\nDashboard updated within 30 seconds.', time: '10:00 AM' },
  ],
  'TC-INT-008': [
    { sender: 'bot', text: 'Welcome to ABC Bank! How can I help you today?', time: '10:00 AM' },
    { sender: 'user', text: 'I want to talk to someone on the phone', time: '10:00 AM' },
    { sender: 'bot', text: 'Initiating voice call via WebRTC...\n\n[WebRTC Connection Attempt]\n- ICE Candidate Gathering: OK\n- STUN Server: OK\n- TURN Server: OK\n- Audio Codec Negotiation: FAILED (timeout after 5s)\n\n[ERROR] Voice call connection failed.\nRetrying... (Attempt 2/3)\n\n[ERROR] Connection failed again.\n\n[BUG: 30% failure rate on audio codec negotiation. Timeout too aggressive for TURN relay.]', time: '10:01 AM' },
    { sender: 'bot', text: 'I apologize, but I am unable to establish a voice call at the moment.\n\nAlternative: Please call us directly at 1800-XXX-XXXX.\nYour reference number: REF-2026-0225-VC01', time: '10:01 AM' },
  ],
};

// =============================================================================
// DATA: Test Results for bottom summary table
// =============================================================================

const TEST_RESULTS_DATA = [
  { id: 'TC-CHAT-001', input: 'New session open', expected: 'Welcome message in <2s', actual: 'Displayed in 1.2s', status: 'Pass', time: '1.2s' },
  { id: 'TC-CHAT-002', input: 'A/C: 1234567890, OTP: 456789', expected: 'Balance displayed', actual: 'Balance: $12,450.50', status: 'Pass', time: '3.8s' },
  { id: 'TC-CHAT-003', input: 'Ref: TXN2026022512345', expected: 'Txn details shown', actual: 'Status: Completed, $500', status: 'Pass', time: '2.1s' },
  { id: 'TC-CHAT-008', input: 'Category: ATM Issue', expected: 'Complaint ID generated', actual: 'ID not generated (BUG)', status: 'Fail', time: '5.1s' },
  { id: 'TC-AI-005', input: 'Context: rates -> "what about FD?"', expected: 'FD interest rates', actual: 'Generic FD info (context lost)', status: 'Fail', time: '2.8s' },
  { id: 'TC-AI-008', input: '"Mera balance kitna hai?"', expected: 'Hindi response', actual: 'Hindi model not deployed', status: 'Pending', time: '-' },
  { id: 'TC-SEC-006', input: 'Card: 4111-..., CVV: 123', expected: 'Both redacted', actual: 'CVV not redacted', status: 'Fail', time: '2.3s' },
  { id: 'TC-UX-004', input: 'HEIC image upload', expected: 'Image preview shown', actual: 'Thumbnail gen failed', status: 'Fail', time: '4.8s' },
  { id: 'TC-UX-007', input: 'NVDA screen reader', expected: 'All ARIA labels present', actual: 'Pending (Sprint 12)', status: 'Pending', time: '-' },
  { id: 'TC-INT-005', input: 'Request 3-month statement', expected: 'PDF with download link', actual: 'Integration pending', status: 'Pending', time: '-' },
  { id: 'TC-INT-008', input: 'WebRTC voice call', expected: 'Call connects', actual: '30% failure rate', status: 'Fail', time: '12.5s' },
  { id: 'TC-SEC-007', input: '3 wrong OTPs', expected: 'Account locked', actual: 'Locked + SMS sent', status: 'Pass', time: '8.5s' },
  { id: 'TC-INT-001', input: 'Card issue escalation', expected: 'CRM ticket created', actual: 'CRM-2026-4521 created', status: 'Pass', time: '3.5s' },
  { id: 'TC-AI-002', input: '50 test utterances', expected: '>= 90% accuracy', actual: '94% accuracy', status: 'Pass', time: '45.2s' },
  { id: 'TC-UX-006', input: '1920px, 768px, 375px', expected: 'Responsive layout', actual: 'All breakpoints pass', status: 'Pass', time: '5.5s' },
];

// =============================================================================
// BOT RESPONSE SIMULATOR
// =============================================================================

const BOT_RESPONSES = {
  'balance': 'Sure! Please provide your account number to check your balance.',
  'transfer': 'I can help you with a fund transfer. Please provide the beneficiary account number and amount.',
  'loan': 'I can check your loan eligibility. What type of loan are you interested in? (Personal/Home/Car)',
  'card': 'I can help with card services. Would you like to:\n1. Block card\n2. Request new card\n3. Check card status',
  'complaint': 'I am sorry to hear that. Please describe your issue and I will create a support ticket.',
  'atm': 'I can help you find the nearest ATM/branch. Please share your pin code or city.',
  'hello': 'Hello! Welcome to ABC Bank. I can help you with balance inquiries, transfers, loans, card services, and more. What would you like to do?',
  'hi': 'Hi there! How can I assist you today? You can ask about your account, transfers, loans, or any banking query.',
  'help': 'Here is what I can help with:\n- Account balance & statements\n- Fund transfers\n- Loan eligibility\n- Card block/unblock\n- Branch/ATM locator\n- Complaint registration\n\nJust type your request!',
  'thank': 'You are welcome! Is there anything else I can help you with?',
  'bye': 'Thank you for banking with ABC Bank! Have a great day. Goodbye!',
  'otp': 'I have sent an OTP to your registered mobile number ending in XXX0123. Please enter the 6-digit code.',
  'statement': 'I can generate your account statement. For which period would you like the statement?\n1. Last 1 month\n2. Last 3 months\n3. Last 6 months\n4. Custom date range',
};

function getBotResponse(message) {
  const lower = message.toLowerCase();
  for (const [keyword, response] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(keyword)) {
      return response;
    }
  }
  return 'I understand you need help. Could you please provide more details about your banking query? I can assist with accounts, transfers, loans, cards, and more.';
}

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12;
  return `${hours}:${minutes} ${ampm}`;
}

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
    padding: '24px',
    background: 'rgba(15, 52, 96, 0.6)',
    borderRadius: '16px',
    border: '1px solid rgba(78, 204, 163, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#4ecca3',
    margin: '0 0 8px 0',
    letterSpacing: '0.5px',
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#8899aa',
    margin: 0,
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginTop: '16px',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
  },
  statDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
    display: 'inline-block',
  }),
  mainLayout: {
    display: 'flex',
    gap: '20px',
    marginBottom: '24px',
    minHeight: '650px',
  },
  leftPanel: {
    flex: '1 1 50%',
    background: 'rgba(15, 52, 96, 0.4)',
    borderRadius: '16px',
    border: '1px solid rgba(78, 204, 163, 0.15)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  leftPanelHeader: {
    padding: '16px 20px',
    background: 'rgba(15, 52, 96, 0.8)',
    borderBottom: '1px solid rgba(78, 204, 163, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  leftPanelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4ecca3',
    margin: 0,
  },
  searchInput: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(78, 204, 163, 0.3)',
    background: 'rgba(26, 26, 46, 0.8)',
    color: '#e0e0e0',
    fontSize: '12px',
    outline: 'none',
    width: '200px',
  },
  scenarioList: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px',
  },
  categoryHeader: (color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    marginBottom: '6px',
    marginTop: '8px',
    borderRadius: '10px',
    background: `linear-gradient(135deg, ${color}22, ${color}11)`,
    border: `1px solid ${color}44`,
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s ease',
  }),
  categoryTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  categoryCount: (color) => ({
    fontSize: '11px',
    background: `${color}33`,
    color: color,
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: '600',
  }),
  scenarioItem: (isSelected, status) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    marginBottom: '4px',
    marginLeft: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    background: isSelected ? 'rgba(78, 204, 163, 0.15)' : 'rgba(26, 26, 46, 0.3)',
    border: isSelected ? '1px solid rgba(78, 204, 163, 0.4)' : '1px solid transparent',
    transition: 'all 0.2s ease',
    fontSize: '12px',
  }),
  scenarioId: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#3498db',
    fontFamily: 'monospace',
    minWidth: '85px',
  },
  scenarioName: {
    flex: 1,
    color: '#d0d0d0',
    fontSize: '12px',
  },
  priorityBadge: (priority) => {
    const colors = { P0: '#e74c3c', P1: '#f39c12', P2: '#3498db' };
    return {
      fontSize: '9px',
      fontWeight: '700',
      padding: '2px 6px',
      borderRadius: '4px',
      background: `${colors[priority] || '#666'}33`,
      color: colors[priority] || '#666',
      border: `1px solid ${colors[priority] || '#666'}55`,
    };
  },
  statusBadge: (status) => {
    const colors = { Pass: '#4ecca3', Fail: '#e74c3c', Pending: '#f39c12' };
    return {
      fontSize: '9px',
      fontWeight: '700',
      padding: '2px 8px',
      borderRadius: '4px',
      background: `${colors[status] || '#666'}22`,
      color: colors[status] || '#666',
      border: `1px solid ${colors[status] || '#666'}44`,
    };
  },
  expandedDetails: {
    marginLeft: '12px',
    marginBottom: '8px',
    padding: '12px 16px',
    background: 'rgba(26, 26, 46, 0.5)',
    borderRadius: '8px',
    border: '1px solid rgba(78, 204, 163, 0.1)',
    fontSize: '11px',
    lineHeight: '1.6',
  },
  detailLabel: {
    color: '#4ecca3',
    fontWeight: '600',
    fontSize: '11px',
    marginTop: '8px',
    marginBottom: '4px',
  },
  detailText: {
    color: '#b0b0b0',
    fontSize: '11px',
    whiteSpace: 'pre-wrap',
    marginBottom: '4px',
    paddingLeft: '8px',
  },
  // Right panel - Chat UI
  rightPanel: {
    flex: '1 1 50%',
    background: 'rgba(15, 52, 96, 0.4)',
    borderRadius: '16px',
    border: '1px solid rgba(78, 204, 163, 0.15)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeader: {
    padding: '14px 20px',
    background: 'linear-gradient(135deg, rgba(15, 52, 96, 0.9), rgba(26, 26, 46, 0.9))',
    borderBottom: '1px solid rgba(78, 204, 163, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  },
  chatAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4ecca3, #3498db)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
  },
  chatHeaderStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#4ecca3',
    marginTop: '2px',
  },
  onlineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#4ecca3',
    animation: 'pulse 2s infinite',
  },
  chatScenarioLabel: {
    fontSize: '10px',
    background: 'rgba(52, 152, 219, 0.2)',
    color: '#3498db',
    padding: '3px 10px',
    borderRadius: '12px',
    border: '1px solid rgba(52, 152, 219, 0.3)',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: 'rgba(26, 26, 46, 0.3)',
  },
  messageRow: (isUser) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    alignItems: 'flex-end',
    gap: '8px',
  }),
  messageBubble: (isUser) => ({
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
    background: isUser
      ? 'linear-gradient(135deg, #4ecca3, #3dbb91)'
      : 'linear-gradient(135deg, #2c3e50, #34495e)',
    color: isUser ? '#0a1628' : '#e0e0e0',
    fontSize: '13px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  }),
  messageTime: (isUser) => ({
    fontSize: '9px',
    color: '#6c7a89',
    marginTop: '4px',
    textAlign: isUser ? 'right' : 'left',
  }),
  smallAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4ecca3, #3498db)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#fff',
    fontWeight: '700',
    flexShrink: 0,
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
  },
  typingDots: {
    display: 'flex',
    gap: '4px',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 4px',
    background: 'linear-gradient(135deg, #2c3e50, #34495e)',
  },
  typingDot: (delay) => ({
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#4ecca3',
    animation: `typingBounce 1.4s infinite ease-in-out`,
    animationDelay: `${delay}s`,
  }),
  chatInputArea: {
    padding: '12px 16px',
    background: 'rgba(26, 26, 46, 0.9)',
    borderTop: '1px solid rgba(78, 204, 163, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  chatInput: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '24px',
    border: '1px solid rgba(78, 204, 163, 0.3)',
    background: 'rgba(15, 52, 96, 0.5)',
    color: '#e0e0e0',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  chatButton: (color) => ({
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    border: 'none',
    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    flexShrink: 0,
    boxShadow: `0 2px 8px ${color}44`,
  }),
  iconButton: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    border: '1px solid rgba(78, 204, 163, 0.2)',
    background: 'transparent',
    color: '#8899aa',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  // Bottom section
  bottomSection: {
    background: 'rgba(15, 52, 96, 0.4)',
    borderRadius: '16px',
    border: '1px solid rgba(78, 204, 163, 0.15)',
    overflow: 'hidden',
  },
  bottomHeader: {
    padding: '16px 20px',
    background: 'rgba(15, 52, 96, 0.8)',
    borderBottom: '1px solid rgba(78, 204, 163, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4ecca3',
    margin: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: '#4ecca3',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: 'rgba(26, 26, 46, 0.5)',
    borderBottom: '1px solid rgba(78, 204, 163, 0.15)',
  },
  td: {
    padding: '10px 14px',
    fontSize: '12px',
    color: '#b0b0b0',
    borderBottom: '1px solid rgba(78, 204, 163, 0.08)',
  },
  tdMono: {
    padding: '10px 14px',
    fontSize: '11px',
    color: '#3498db',
    fontFamily: 'monospace',
    fontWeight: '600',
    borderBottom: '1px solid rgba(78, 204, 163, 0.08)',
  },
};

// =============================================================================
// KEYFRAMES STYLE TAG
// =============================================================================

const keyframesCSS = `
@keyframes typingBounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.chat-scrollbar::-webkit-scrollbar { width: 6px; }
.chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
.chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(78,204,163,0.3); border-radius: 3px; }
.chat-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(78,204,163,0.5); }
.scenario-item:hover { background: rgba(78,204,163,0.08) !important; }
.chat-input-focus:focus { border-color: #4ecca3 !important; box-shadow: 0 0 0 2px rgba(78,204,163,0.15); }
.send-btn:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(78,204,163,0.4); }
.icon-btn:hover { color: #4ecca3 !important; border-color: rgba(78,204,163,0.4) !important; background: rgba(78,204,163,0.1) !important; }
.category-hdr:hover { filter: brightness(1.15); }
.msg-animate { animation: fadeIn 0.3s ease-out; }
`;

// =============================================================================
// COMPONENT
// =============================================================================

function ChatTesting() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [expandedScenario, setExpandedScenario] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(DEFAULT_CONVERSATION);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Compute summary stats
  const summaryStats = useMemo(() => {
    let total = 0, passed = 0, failed = 0, pending = 0;
    TEST_SCENARIOS.forEach(cat => {
      cat.scenarios.forEach(sc => {
        total++;
        if (sc.status === 'Pass') passed++;
        else if (sc.status === 'Fail') failed++;
        else pending++;
      });
    });
    return { total, passed, failed, pending };
  }, []);

  // Filter scenarios
  const filteredScenarios = useMemo(() => {
    if (!searchQuery.trim()) return TEST_SCENARIOS;
    const q = searchQuery.toLowerCase();
    return TEST_SCENARIOS.map(cat => ({
      ...cat,
      scenarios: cat.scenarios.filter(
        sc => sc.id.toLowerCase().includes(q) || sc.name.toLowerCase().includes(q)
      ),
    })).filter(cat => cat.scenarios.length > 0);
  }, [searchQuery]);

  // Toggle category collapse
  const toggleCategory = useCallback((catName) => {
    setCollapsedCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  }, []);

  // Select scenario and load conversation
  const handleSelectScenario = useCallback((scenario) => {
    setSelectedScenario(scenario.id);
    const conversation = SCENARIO_CONVERSATIONS[scenario.id] || DEFAULT_CONVERSATION;
    setMessages(conversation);
    setIsTyping(false);
    setShowEmojiPicker(false);
  }, []);

  // Toggle expanded details
  const toggleExpanded = useCallback((scenarioId, e) => {
    e.stopPropagation();
    setExpandedScenario(prev => prev === scenarioId ? null : scenarioId);
  }, []);

  // Send message
  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    const time = getCurrentTime();
    const userMsg = { sender: 'user', text, time };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setShowEmojiPicker(false);

    // Simulate bot response after delay
    setTimeout(() => {
      const botText = getBotResponse(text);
      const botTime = getCurrentTime();
      setMessages(prev => [...prev, { sender: 'bot', text: botText, time: botTime }]);
      setIsTyping(false);
    }, 1500);
  }, [inputText]);

  // Handle Enter key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Emoji insertion
  const emojis = ['\u{1F600}', '\u{1F44D}', '\u{1F44E}', '\u{2764}\uFE0F', '\u{1F622}', '\u{1F621}', '\u{1F914}', '\u{1F389}', '\u{1F4B0}', '\u{1F3E6}', '\u{1F512}', '\u{2705}', '\u{274C}', '\u{26A0}\uFE0F', '\u{1F4DE}'];
  const handleEmojiClick = useCallback((emoji) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  }, []);

  // Active scenario name for chat header
  const activeScenarioName = useMemo(() => {
    if (!selectedScenario) return null;
    for (const cat of TEST_SCENARIOS) {
      const found = cat.scenarios.find(s => s.id === selectedScenario);
      if (found) return `${found.id}: ${found.name}`;
    }
    return null;
  }, [selectedScenario]);

  return (
    <div style={styles.pageContainer}>
      <style>{keyframesCSS}</style>

      {/* ===== HEADER ===== */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Chat UI Testing - Banking QA Dashboard</h1>
        <p style={styles.headerSubtitle}>
          Comprehensive test coverage for chatbot, live agent chat, security, UI/UX, and integration scenarios
        </p>
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <span style={styles.statDot('#3498db')} />
            <span style={{ color: '#3498db' }}>Total: {summaryStats.total}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statDot('#4ecca3')} />
            <span style={{ color: '#4ecca3' }}>Passed: {summaryStats.passed}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statDot('#e74c3c')} />
            <span style={{ color: '#e74c3c' }}>Failed: {summaryStats.failed}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statDot('#f39c12')} />
            <span style={{ color: '#f39c12' }}>Pending: {summaryStats.pending}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statDot('#9b59b6')} />
            <span style={{ color: '#9b59b6' }}>
              Pass Rate: {((summaryStats.passed / summaryStats.total) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* ===== MAIN SPLIT LAYOUT ===== */}
      <div style={styles.mainLayout}>

        {/* ----- LEFT PANEL: Test Scenarios ----- */}
        <div style={styles.leftPanel}>
          <div style={styles.leftPanelHeader}>
            <h3 style={styles.leftPanelTitle}>Test Scenarios ({summaryStats.total})</h3>
            <input
              style={styles.searchInput}
              className="chat-input-focus"
              type="text"
              placeholder="Search scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={styles.scenarioList} className="chat-scrollbar">
            {filteredScenarios.map((cat) => {
              const isCollapsed = collapsedCategories[cat.category];
              const catPassed = cat.scenarios.filter(s => s.status === 'Pass').length;
              const catFailed = cat.scenarios.filter(s => s.status === 'Fail').length;
              const catPending = cat.scenarios.filter(s => s.status === 'Pending').length;
              return (
                <div key={cat.category}>
                  <div
                    style={styles.categoryHeader(cat.color)}
                    className="category-hdr"
                    onClick={() => toggleCategory(cat.category)}
                  >
                    <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                    <span style={styles.categoryTitle}>{cat.category}</span>
                    <span style={styles.categoryCount(cat.color)}>
                      {cat.scenarios.length}
                    </span>
                    <span style={{ fontSize: '10px', color: '#4ecca3' }}>
                      {catPassed}P
                    </span>
                    <span style={{ fontSize: '10px', color: '#e74c3c' }}>
                      {catFailed}F
                    </span>
                    <span style={{ fontSize: '10px', color: '#f39c12' }}>
                      {catPending}W
                    </span>
                    <span style={{ color: '#8899aa', fontSize: '12px', transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                      {'\u25BC'}
                    </span>
                  </div>
                  {!isCollapsed && cat.scenarios.map((sc) => (
                    <React.Fragment key={sc.id}>
                      <div
                        style={styles.scenarioItem(selectedScenario === sc.id, sc.status)}
                        className="scenario-item"
                        onClick={() => handleSelectScenario(sc)}
                      >
                        <span style={styles.scenarioId}>{sc.id}</span>
                        <span style={styles.scenarioName}>{sc.name}</span>
                        <span style={styles.priorityBadge(sc.priority)}>{sc.priority}</span>
                        <span style={styles.statusBadge(sc.status)}>{sc.status}</span>
                        <span
                          style={{ color: '#8899aa', fontSize: '14px', cursor: 'pointer', padding: '0 4px' }}
                          onClick={(e) => toggleExpanded(sc.id, e)}
                          title="Toggle details"
                        >
                          {expandedScenario === sc.id ? '\u25B2' : '\u25BC'}
                        </span>
                      </div>
                      {expandedScenario === sc.id && (
                        <div style={styles.expandedDetails} className="msg-animate">
                          <div style={styles.detailLabel}>Steps:</div>
                          {sc.steps.map((step, i) => (
                            <div key={i} style={styles.detailText}>{step}</div>
                          ))}
                          <div style={styles.detailLabel}>Test Data:</div>
                          <div style={styles.detailText}>{sc.testData}</div>
                          <div style={styles.detailLabel}>Expected Result:</div>
                          <div style={styles.detailText}>{sc.expected}</div>
                          <div style={styles.detailLabel}>Actual Result:</div>
                          <div style={{
                            ...styles.detailText,
                            color: sc.status === 'Fail' ? '#e74c3c' : sc.status === 'Pending' ? '#f39c12' : '#4ecca3',
                          }}>
                            {sc.actual}
                          </div>
                          <div style={styles.detailLabel}>Execution Time:</div>
                          <div style={styles.detailText}>{sc.executionTime}</div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* ----- RIGHT PANEL: Chat UI Simulator ----- */}
        <div style={styles.rightPanel}>
          {/* Chat Header */}
          <div style={styles.chatHeader}>
            <div style={styles.chatAvatar}>BA</div>
            <div style={styles.chatHeaderInfo}>
              <div style={styles.chatHeaderName}>Banking Assistant</div>
              <div style={styles.chatHeaderStatus}>
                <span style={styles.onlineDot} />
                Online
              </div>
            </div>
            {activeScenarioName && (
              <span style={styles.chatScenarioLabel}>{activeScenarioName}</span>
            )}
          </div>

          {/* Chat Messages */}
          <div style={styles.chatMessages} className="chat-scrollbar" ref={chatContainerRef}>
            {messages.map((msg, idx) => (
              <div key={idx} style={styles.messageRow(msg.sender === 'user')} className="msg-animate">
                {msg.sender === 'bot' && (
                  <div style={styles.smallAvatar}>B</div>
                )}
                <div>
                  <div style={styles.messageBubble(msg.sender === 'user')}>
                    {msg.text}
                  </div>
                  <div style={styles.messageTime(msg.sender === 'user')}>{msg.time}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={styles.typingIndicator} className="msg-animate">
                <div style={styles.smallAvatar}>B</div>
                <div style={styles.typingDots}>
                  <div style={styles.typingDot(0)} />
                  <div style={styles.typingDot(0.2)} />
                  <div style={styles.typingDot(0.4)} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div style={{
              padding: '8px 16px',
              background: 'rgba(26, 26, 46, 0.95)',
              borderTop: '1px solid rgba(78, 204, 163, 0.2)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }} className="msg-animate">
              {emojis.map((emoji, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '22px',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => handleEmojiClick(emoji)}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(78,204,163,0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}

          {/* Chat Input */}
          <div style={styles.chatInputArea}>
            <button
              style={styles.iconButton}
              className="icon-btn"
              title="Attach file"
              onClick={() => alert('File attachment dialog would open here.')}
            >
              {'\u{1F4CE}'}
            </button>
            <button
              style={{
                ...styles.iconButton,
                ...(showEmojiPicker ? { color: '#4ecca3', borderColor: 'rgba(78,204,163,0.4)', background: 'rgba(78,204,163,0.1)' } : {}),
              }}
              className="icon-btn"
              title="Emojis"
              onClick={() => setShowEmojiPicker(prev => !prev)}
            >
              {'\u{1F60A}'}
            </button>
            <input
              style={styles.chatInput}
              className="chat-input-focus"
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              style={styles.chatButton('#4ecca3')}
              className="send-btn"
              title="Send"
              onClick={handleSend}
            >
              {'\u27A4'}
            </button>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM SECTION: Test Results Summary ===== */}
      <div style={styles.bottomSection}>
        <div style={styles.bottomHeader}>
          <h3 style={styles.bottomTitle}>Test Results Summary</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#4ecca3' }}>
              {summaryStats.passed}/{summaryStats.total} Passed
            </span>
            <span style={{ fontSize: '12px', color: '#e74c3c' }}>
              {summaryStats.failed} Failed
            </span>
            <span style={{ fontSize: '12px', color: '#f39c12' }}>
              {summaryStats.pending} Pending
            </span>
            {/* Progress bar */}
            <div style={{
              width: '200px',
              height: '8px',
              borderRadius: '4px',
              background: 'rgba(26, 26, 46, 0.8)',
              overflow: 'hidden',
              display: 'flex',
            }}>
              <div style={{
                width: `${(summaryStats.passed / summaryStats.total) * 100}%`,
                background: '#4ecca3',
                transition: 'width 0.5s ease',
              }} />
              <div style={{
                width: `${(summaryStats.failed / summaryStats.total) * 100}%`,
                background: '#e74c3c',
                transition: 'width 0.5s ease',
              }} />
              <div style={{
                width: `${(summaryStats.pending / summaryStats.total) * 100}%`,
                background: '#f39c12',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Test Case ID</th>
                <th style={styles.th}>Input Data</th>
                <th style={styles.th}>Expected Output</th>
                <th style={styles.th}>Actual Output</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Exec Time</th>
              </tr>
            </thead>
            <tbody>
              {TEST_RESULTS_DATA.map((row) => (
                <tr
                  key={row.id}
                  style={{ transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(78,204,163,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={styles.tdMono}>{row.id}</td>
                  <td style={styles.td}>{row.input}</td>
                  <td style={styles.td}>{row.expected}</td>
                  <td style={{
                    ...styles.td,
                    color: row.status === 'Fail' ? '#e74c3c' : row.status === 'Pending' ? '#f39c12' : '#4ecca3',
                  }}>
                    {row.actual}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(row.status)}>{row.status}</span>
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px' }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ChatTesting;

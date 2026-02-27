import React, { useState, useRef, useCallback, useEffect } from 'react';

const CATEGORIES = [
  'Customer Operations',
  'Account Management',
  'Transactions',
  'Loans & Credit',
  'Cards & Payments',
  'Compliance & KYC'
];

const mkUC = (id, title, priority, category, description, preconditions, actor, testData, steps, api) => ({
  id: `UC-${String(id).padStart(3,'0')}`,
  title, priority, category, description, preconditions, actor,
  testData: JSON.stringify(testData, null, 2),
  steps: steps.map((s, i) => ({ num: i+1, action: s[0], expected: s[1], status: 'Not Run' })),
  api
});

const USE_CASES = [
  mkUC(1,'New Customer Registration (Individual)','P1','Customer Operations',
    'Register a new individual customer with KYC details, personal information, and initial account setup. Validates PAN, Aadhaar, and creates CIF number.',
    ['Branch user logged in','KYC documents available','Customer not existing in system'],
    'Teller',
    {firstName:"Rajesh",lastName:"Kumar",dateOfBirth:"1990-05-15",gender:"Male",panNumber:"ABCPK1234M",aadhaarNumber:"1234-5678-9012",email:"rajesh.kumar@email.com",mobile:"+91-9876543210",address:{line1:"42 MG Road",city:"Mumbai",state:"Maharashtra",pincode:"400001"},accountType:"SAVINGS",initialDeposit:10000,nomineeDetails:{name:"Priya Kumar",relationship:"Spouse",percentage:100}},
    [['Navigate to Customer Registration page','Registration form loads with all mandatory fields highlighted'],['Enter personal details: name, DOB, gender','Fields accept valid input, age validation passes (18+)'],['Enter PAN ABCPK1234M and Aadhaar 1234-5678-9012','PAN format validated, Aadhaar checksum verified'],['Upload KYC documents (ID proof, address proof)','Documents uploaded successfully with size < 5MB'],['Submit registration form','CIF number generated, welcome SMS/email sent, status 201']],
    {endpoint:'/api/v1/customers',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{customerId:"CIF-2026-000001",status:"ACTIVE",message:"Customer registered successfully"}}
  ),
  mkUC(2,'Corporate Customer Onboarding','P1','Customer Operations',
    'Onboard a corporate entity with authorized signatories, business documents, and compliance checks. Includes CIN verification and board resolution upload.',
    ['Relationship manager assigned','Business documents verified','Board resolution obtained'],
    'Manager',
    {companyName:"TechVista Solutions Pvt Ltd",cinNumber:"U72200MH2020PTC345678",panNumber:"AABCT1234A",gstNumber:"27AABCT1234A1Z5",dateOfIncorporation:"2020-03-15",registeredAddress:{line1:"Tower B, Mindspace",city:"Hyderabad",state:"Telangana",pincode:"500081"},authorizedSignatories:[{name:"Anita Sharma",designation:"Director",panNumber:"BCDPS5678K",mobile:"+91-9988776655"}],annualTurnover:50000000,businessType:"IT Services",accountType:"CURRENT"},
    [['Navigate to Corporate Onboarding module','Corporate registration form displayed with entity type selector'],['Enter company details: name, CIN, PAN, GST','CIN format validated against MCA database'],['Add authorized signatories with KYC details','Signatory details captured, PAN verification initiated'],['Upload board resolution and MOA/AOA documents','Documents accepted, compliance checklist updated'],['Submit for approval workflow','Application submitted to compliance team, reference number generated']],
    {endpoint:'/api/v1/customers/corporate',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{customerId:"CIF-CORP-2026-000001",status:"PENDING_APPROVAL",approvalWorkflowId:"WF-2026-001",message:"Corporate onboarding initiated"}}
  ),
  mkUC(3,'Customer Profile Update','P2','Customer Operations',
    'Update existing customer profile information including address, contact details, and employment information with audit trail maintenance.',
    ['Customer CIF exists','Customer authenticated','Maker-checker workflow enabled'],
    'Customer',
    {customerId:"CIF-2026-000001",updates:{email:"rajesh.kumar.new@email.com",mobile:"+91-9876543211",address:{line1:"15 Park Street",city:"Kolkata",state:"West Bengal",pincode:"700016"},employmentDetails:{employer:"Infosys Ltd",designation:"Senior Engineer",annualIncome:1500000}},reason:"Address change due to relocation",supportingDocId:"DOC-2026-0042"},
    [['Search customer by CIF ID','Customer profile loaded with current details'],['Click Edit Profile button','Fields become editable, change tracking enabled'],['Update address and contact information','Changes highlighted in yellow, old values shown for comparison'],['Upload supporting document for address change','Document linked to change request'],['Submit changes for checker approval','Change request created, pending approval notification sent']],
    {endpoint:'/api/v1/customers/CIF-2026-000001',method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{customerId:"CIF-2026-000001",changeRequestId:"CR-2026-0015",status:"PENDING_APPROVAL",message:"Profile update submitted for approval"}}
  ),
  mkUC(4,'Customer Search by Multiple Criteria','P2','Customer Operations',
    'Search for customers using various combinations of criteria including name, account number, phone, PAN, and Aadhaar with fuzzy matching support.',
    ['User has search permission','Database indexed on search fields','Minimum 2 characters for name search'],
    'Teller',
    {searchCriteria:{name:"Rajesh",mobile:"+91-987",panNumber:"",aadhaarLast4:"9012",accountNumber:"",dateOfBirthRange:{from:"1989-01-01",to:"1991-12-31"}},pagination:{page:1,size:20},sortBy:"relevanceScore",sortOrder:"DESC"},
    [['Navigate to Customer Search page','Search form displayed with multiple criteria fields'],['Enter partial name "Rajesh" and last 4 Aadhaar digits "9012"','Search fields populated, search button enabled'],['Click Search','Results displayed with relevance score, matching fields highlighted'],['Apply date of birth range filter','Results filtered, pagination updated'],['Click on customer record to view full profile','Customer detail page opens with complete information']],
    {endpoint:'/api/v1/customers/search',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{results:[{customerId:"CIF-2026-000001",name:"Rajesh Kumar",relevanceScore:0.95}],totalResults:3,page:1,size:20}}
  ),
  mkUC(5,'Customer Deduplication Check','P1','Customer Operations',
    'Identify potential duplicate customer records using fuzzy matching on name, PAN, Aadhaar, mobile, and date of birth before creating new CIF.',
    ['New customer data entered','Dedup engine configured','Match threshold set to 80%'],
    'System',
    {candidateData:{firstName:"Rajesh",lastName:"Kumar",dateOfBirth:"1990-05-15",panNumber:"ABCPK1234M",mobile:"+91-9876543210",aadhaarNumber:"1234-5678-9012"},matchThreshold:80,maxResults:10,matchFields:["panNumber","aadhaarNumber","mobile","name_dob_combo"]},
    [['Trigger dedup check with candidate customer data','Dedup engine processes matching rules'],['System checks PAN number against existing records','Exact match on PAN found or not found'],['System checks Aadhaar against existing records','Aadhaar match results returned with confidence score'],['Review potential duplicates list with match scores','Duplicate candidates displayed with match percentage'],['Confirm as new customer or link to existing CIF','Decision recorded in audit trail']],
    {endpoint:'/api/v1/customers/dedup-check',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{duplicatesFound:true,matches:[{customerId:"CIF-2026-000001",matchScore:92,matchedFields:["panNumber","mobile"]}],recommendation:"REVIEW_REQUIRED"}}
  ),
  mkUC(6,'Customer Merge (Duplicate Resolution)','P1','Customer Operations',
    'Merge two confirmed duplicate customer records, consolidating accounts, transactions, and relationships under a single surviving CIF.',
    ['Duplicate confirmed by operations','Both CIFs identified','Approval from branch manager obtained'],
    'Manager',
    {survivingCif:"CIF-2026-000001",mergingCif:"CIF-2026-000089",mergeStrategy:"KEEP_SURVIVING",accountConsolidation:true,transactionHistory:"MERGE_ALL",communicationPreference:"SURVIVING",approvalId:"APR-2026-0034",reason:"Duplicate account created during migration"},
    [['Identify surviving and merging CIF records','Both customer profiles displayed side by side'],['Select data retention strategy for each field','Merge preview generated showing final state'],['Consolidate accounts under surviving CIF','All accounts re-linked, old CIF marked as merged'],['Migrate transaction history','Complete transaction history preserved under surviving CIF'],['Generate merge audit report','Merge report created with before/after snapshot']],
    {endpoint:'/api/v1/customers/merge',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{survivingCif:"CIF-2026-000001",status:"MERGED",accountsMigrated:3,transactionsMigrated:142,mergeReportId:"MR-2026-0012"}}
  ),
  mkUC(7,'Customer Relationship Mapping','P2','Customer Operations',
    'Map and manage relationships between customers including family connections, business associations, and guarantor links for holistic customer view.',
    ['Both customers exist in system','Relationship type defined','User has relationship management permission'],
    'Teller',
    {primaryCustomerId:"CIF-2026-000001",relationships:[{relatedCustomerId:"CIF-2026-000045",relationshipType:"SPOUSE",bidirectional:true},{relatedCustomerId:"CIF-2026-000078",relationshipType:"GUARANTOR",bidirectional:false}],householdId:"HH-2026-0023",groupExposureTracking:true},
    [['Navigate to Customer Relationship module','Relationship graph view loaded for primary customer'],['Click Add Relationship button','Relationship form displayed with type dropdown'],['Search and select related customer','Related customer found and linked'],['Define relationship type and directionality','Relationship type set with correct direction'],['Save and view updated relationship map','Graph updated showing all connections with relationship labels']],
    {endpoint:'/api/v1/customers/CIF-2026-000001/relationships',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{relationshipId:"REL-2026-0034",status:"ACTIVE",householdId:"HH-2026-0023",message:"Relationship mapped successfully"}}
  ),
  mkUC(8,'Customer Segment Classification','P3','Customer Operations',
    'Classify customers into segments based on AUM, transaction patterns, product holdings, and engagement metrics for targeted service delivery.',
    ['Customer data available','Segmentation rules configured','Monthly AUM calculated'],
    'System',
    {customerId:"CIF-2026-000001",segmentationCriteria:{totalAUM:2500000,monthlyTransactions:45,productCount:4,digitalEngagementScore:78,vintageMonths:36,avgMonthlyBalance:150000},currentSegment:"GOLD",reassessmentDate:"2026-03-01"},
    [['Trigger segment classification for customer','Segmentation engine processes customer data'],['Evaluate AUM against segment thresholds','AUM band identified (Silver/Gold/Platinum/HNI)'],['Calculate digital engagement score','Score computed from login frequency and transaction mix'],['Apply product holding multiplier','Cross-sell score adjusted based on product count'],['Assign final segment and update CRM','Customer segment updated with effective date']],
    {endpoint:'/api/v1/customers/CIF-2026-000001/segment',method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{customerId:"CIF-2026-000001",previousSegment:"GOLD",newSegment:"PLATINUM",effectiveDate:"2026-03-01",reason:"AUM threshold crossed"}}
  ),
  mkUC(9,'Customer Communication Preference Update','P3','Customer Operations',
    'Update customer communication preferences for email, SMS, WhatsApp, and push notifications across different communication categories.',
    ['Customer authenticated','Communication channels verified','Regulatory opt-in compliance met'],
    'Customer',
    {customerId:"CIF-2026-000001",preferences:{email:{marketing:false,transactional:true,statements:true,alerts:true},sms:{marketing:false,transactional:true,otp:true},whatsapp:{enabled:true,transactional:true,marketing:false},pushNotification:{enabled:true,allCategories:true}},preferredLanguage:"en",quietHours:{start:"22:00",end:"07:00"},dndRegistered:false},
    [['Navigate to Communication Preferences page','Current preferences displayed with toggle switches'],['Toggle email marketing to OFF','Marketing opt-out recorded with timestamp'],['Enable WhatsApp transactional notifications','WhatsApp channel activated after number verification'],['Set quiet hours from 10 PM to 7 AM','Quiet hours applied to non-critical notifications'],['Save all preference changes','Preferences updated, confirmation sent on preferred channel']],
    {endpoint:'/api/v1/customers/CIF-2026-000001/preferences',method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{customerId:"CIF-2026-000001",preferencesUpdated:true,effectiveFrom:"2026-02-26T10:30:00Z",confirmationSent:true}}
  ),
  mkUC(10,'Customer Account Closure Request','P1','Customer Operations',
    'Process customer request to close all accounts and terminate banking relationship with final settlement, pending transaction clearance, and regulatory holds check.',
    ['Customer identity verified','No pending loans or liens','All cheques cleared'],
    'Manager',
    {customerId:"CIF-2026-000001",closureType:"FULL_RELATIONSHIP",reason:"Relocating abroad",accounts:["ACC-2026-SA-001","ACC-2026-FD-001"],settlementMode:"CHEQUE",settlementAddress:{line1:"42 MG Road",city:"Mumbai",state:"Maharashtra",pincode:"400001"},feedbackRating:3,feedbackComment:"Good service but high charges"},
    [['Initiate account closure request','Closure eligibility check performed on all accounts'],['Verify no pending obligations (loans, liens, holds)','System confirms no outstanding obligations'],['Calculate final settlement amount including accrued interest','Settlement amount computed with interest up to date'],['Process closure for each account sequentially','Accounts closed one by one, balances consolidated'],['Generate closure certificate and final statement','Closure certificate issued, relationship marked as CLOSED']],
    {endpoint:'/api/v1/customers/CIF-2026-000001/close',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{closureRequestId:"CLR-2026-0008",status:"PROCESSING",settlementAmount:125430.50,estimatedCompletionDate:"2026-03-05",message:"Closure request initiated"}}
  ),
  mkUC(11,'Open Savings Account','P1','Account Management',
    'Open a new savings account for existing customer with initial deposit, cheque book option, debit card issuance, and internet/mobile banking activation.',
    ['Customer CIF exists','KYC verified','Minimum deposit amount met'],
    'Teller',
    {customerId:"CIF-2026-000001",accountType:"SAVINGS",subType:"REGULAR",currency:"INR",initialDeposit:10000,branchCode:"HDFC0001234",chequeBookRequired:true,debitCardRequired:true,internetBanking:true,mobileBanking:true,sweepInFD:false,autoSweepThreshold:100000},
    [['Select existing customer CIF','Customer details pre-populated in account opening form'],['Choose Savings Account type and subtype','Account product features displayed with charges'],['Enter initial deposit amount Rs 10000','Amount validated against minimum balance requirement'],['Select add-on services (cheque book, debit card, net banking)','Add-on services queued for activation'],['Submit account opening request','Account number generated, passbook printed, welcome kit initiated']],
    {endpoint:'/api/v1/accounts',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{accountNumber:"ACC-2026-SA-001",ifscCode:"HDFC0001234",status:"ACTIVE",message:"Savings account opened successfully"}}
  ),
  mkUC(12,'Open Current Account','P1','Account Management',
    'Open a current account for business/corporate customer with overdraft facility setup, multi-signatory authorization, and cash management services.',
    ['Business KYC completed','Trade license verified','Minimum balance commitment signed'],
    'Manager',
    {customerId:"CIF-CORP-2026-000001",accountType:"CURRENT",subType:"BUSINESS_PREMIUM",currency:"INR",initialDeposit:100000,branchCode:"HDFC0001234",overdraftFacility:true,overdraftLimit:500000,signatoryMode:"ANY_TWO",signatories:["SIG-001","SIG-002","SIG-003"],cashManagement:true,bulkTransactionEnabled:true},
    [['Select corporate customer CIF','Corporate entity details loaded with authorized signatories'],['Choose Current Account product variant','Business Premium features and charges displayed'],['Configure signatory authorization rules','Any-two signatory mode configured'],['Set up overdraft facility with limit Rs 5L','Overdraft sanctioned subject to documentation'],['Submit with initial deposit of Rs 1L','Current account activated with OD facility']],
    {endpoint:'/api/v1/accounts',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{accountNumber:"ACC-2026-CA-001",ifscCode:"HDFC0001234",overdraftEnabled:true,status:"ACTIVE",message:"Current account opened"}}
  ),
  mkUC(13,'Open Fixed Deposit','P1','Account Management',
    'Book a new fixed deposit with tenure selection, interest payout frequency, auto-renewal preferences, and nominee details.',
    ['Savings/Current account exists','Sufficient balance for FD amount','FD rates fetched from treasury'],
    'Customer',
    {customerId:"CIF-2026-000001",sourceAccount:"ACC-2026-SA-001",fdAmount:500000,tenure:{years:1,months:6,days:0},interestPayoutMode:"QUARTERLY",interestCreditAccount:"ACC-2026-SA-001",autoRenewal:true,renewalTenure:{years:1,months:0,days:0},seniorCitizen:false,nominee:{name:"Priya Kumar",relationship:"Spouse"}},
    [['Navigate to Fixed Deposit booking page','FD booking form loaded with current interest rates'],['Enter FD amount Rs 5,00,000','Amount validated against source account balance'],['Select tenure of 1 year 6 months','Interest rate displayed: 7.25% p.a. for selected tenure'],['Choose quarterly interest payout','Payout schedule generated with estimated amounts'],['Confirm FD booking','FD receipt generated, source account debited']],
    {endpoint:'/api/v1/accounts/fixed-deposit',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{fdAccountNumber:"FD-2026-000001",principalAmount:500000,interestRate:7.25,maturityDate:"2027-08-26",maturityAmount:555625,status:"ACTIVE"}}
  ),
  mkUC(14,'Open Recurring Deposit','P2','Account Management',
    'Set up a recurring deposit with monthly installment auto-debit, tenure selection, and maturity instructions.',
    ['Savings account exists for auto-debit','Standing instruction capability','Minimum RD amount Rs 500'],
    'Customer',
    {customerId:"CIF-2026-000001",sourceAccount:"ACC-2026-SA-001",monthlyInstallment:5000,tenure:{months:24},debitDate:5,interestRate:6.75,maturityInstruction:"CREDIT_TO_SAVINGS",autoDebit:true,startDate:"2026-03-05"},
    [['Navigate to Recurring Deposit page','RD form displayed with current interest rates'],['Enter monthly installment amount Rs 5000','Amount validated above minimum threshold'],['Select tenure of 24 months','Maturity date and estimated maturity amount calculated'],['Set auto-debit date as 5th of each month','Standing instruction configured on source account'],['Confirm RD opening','RD account created, first installment debited on start date']],
    {endpoint:'/api/v1/accounts/recurring-deposit',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{rdAccountNumber:"RD-2026-000001",monthlyAmount:5000,interestRate:6.75,maturityDate:"2028-03-05",estimatedMaturityAmount:131400,status:"ACTIVE"}}
  ),
  mkUC(15,'Account Balance Inquiry','P1','Account Management',
    'Retrieve real-time account balance including available balance, unclear balance, lien amount, and hold amount for any account type.',
    ['Account exists','Customer authenticated','Account not dormant'],
    'Customer',
    {accountNumber:"ACC-2026-SA-001",includeSubAccounts:true,includeHolds:true,includeUnclearedFunds:true,currency:"INR"},
    [['Enter account number or select from linked accounts','Account selected, basic info displayed'],['Request balance inquiry','API call initiated to core banking'],['Display ledger balance','Ledger balance shown: Rs 2,45,000.00'],['Show available balance with holds breakdown','Available: Rs 2,35,000, Hold: Rs 10,000 shown separately'],['Show last 5 transactions summary','Recent transactions listed below balance display']],
    {endpoint:'/api/v1/accounts/ACC-2026-SA-001/balance',method:'GET',headers:{'Authorization':'Bearer {{token}}'},responseStatus:200,response:{accountNumber:"ACC-2026-SA-001",ledgerBalance:245000,availableBalance:235000,holdAmount:10000,unclearedFunds:0,currency:"INR",asOf:"2026-02-26T10:00:00Z"}}
  ),
  mkUC(16,'Account Statement Generation','P2','Account Management',
    'Generate account statement for a specified date range in multiple formats (PDF, CSV, MT940) with transaction categorization.',
    ['Account exists','Statement period within allowed range (max 1 year)','Statement not already generated for same period'],
    'Customer',
    {accountNumber:"ACC-2026-SA-001",fromDate:"2026-01-01",toDate:"2026-02-26",format:"PDF",includeCategories:true,includeSummary:true,password:"PROTECTED",deliveryMode:"EMAIL",emailId:"rajesh.kumar@email.com"},
    [['Navigate to Account Statement page','Statement request form displayed'],['Select account and date range','Date range validated (within 1 year)'],['Choose PDF format with password protection','Format selected, password encryption enabled'],['Select email delivery mode','Email address pre-filled from profile'],['Generate statement','Statement generated, emailed, download link provided']],
    {endpoint:'/api/v1/accounts/ACC-2026-SA-001/statement',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{statementId:"STMT-2026-0042",format:"PDF",fromDate:"2026-01-01",toDate:"2026-02-26",transactionCount:87,downloadUrl:"/api/v1/statements/STMT-2026-0042/download",expiresAt:"2026-02-27T10:00:00Z"}}
  ),
  mkUC(17,'Account Freeze/Unfreeze','P1','Account Management',
    'Freeze or unfreeze a customer account based on court order, regulatory directive, or fraud investigation with proper authorization and audit trail.',
    ['Account exists and is active','Authorized by compliance officer','Court order/directive document uploaded'],
    'Manager',
    {accountNumber:"ACC-2026-SA-001",action:"FREEZE",freezeType:"DEBIT_FREEZE",reason:"Court order reference CO/2026/MUM/1234",directiveType:"COURT_ORDER",directiveReference:"CO/2026/MUM/1234",effectiveDate:"2026-02-26",documentId:"DOC-2026-LEGAL-001",authorizedBy:"EMP-MGR-001",remarks:"Freeze as per court directive dated 25-Feb-2026"},
    [['Navigate to Account Operations module','Account freeze/unfreeze options displayed'],['Search account by number','Account details loaded with current status: ACTIVE'],['Select Debit Freeze action','Freeze configuration form displayed'],['Enter court order reference and upload document','Legal document linked to freeze request'],['Submit freeze request with manager authorization','Account frozen, audit log created, customer notified']],
    {endpoint:'/api/v1/accounts/ACC-2026-SA-001/freeze',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{accountNumber:"ACC-2026-SA-001",freezeStatus:"DEBIT_FROZEN",freezeId:"FRZ-2026-0003",effectiveFrom:"2026-02-26T00:00:00Z",message:"Account debit freeze applied"}}
  ),
  mkUC(18,'Joint Account Holder Addition','P2','Account Management',
    'Add a new joint holder to an existing account with operating instructions update and signature mandate change.',
    ['Account exists','New holder KYC completed','Consent from all existing holders obtained'],
    'Teller',
    {accountNumber:"ACC-2026-SA-001",newJointHolder:{customerId:"CIF-2026-000045",name:"Priya Kumar",relationship:"Spouse",panNumber:"DEFPK5678N"},operatingInstruction:"EITHER_OR_SURVIVOR",signatureMandate:"SINGLE",consentDocumentId:"DOC-2026-CONSENT-001"},
    [['Navigate to Joint Account Management','Joint holder management form displayed'],['Enter existing account number','Account loaded showing current holders'],['Search and select new joint holder by CIF','New holder details populated after CIF search'],['Set operating instructions to Either or Survivor','Operating mode updated in account mandate'],['Submit with consent document','Joint holder added, new mandate effective immediately']],
    {endpoint:'/api/v1/accounts/ACC-2026-SA-001/joint-holders',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{accountNumber:"ACC-2026-SA-001",totalHolders:2,operatingInstruction:"EITHER_OR_SURVIVOR",mandateUpdateId:"MND-2026-0015",status:"UPDATED"}}
  ),
  mkUC(19,'Nominee Registration/Update','P2','Account Management',
    'Register or update nominee details for an account with percentage allocation, minor nominee guardian details, and nominee address.',
    ['Account exists','Customer authenticated','Maximum 2 nominees allowed'],
    'Customer',
    {accountNumber:"ACC-2026-SA-001",nominees:[{name:"Priya Kumar",relationship:"Spouse",dateOfBirth:"1992-08-20",percentage:60,address:{line1:"42 MG Road",city:"Mumbai",pincode:"400001"}},{name:"Arjun Kumar",relationship:"Son",dateOfBirth:"2018-11-10",percentage:40,guardian:{name:"Priya Kumar",relationship:"Mother"},isMinor:true}]},
    [['Navigate to Nominee Management page','Current nominee details displayed'],['Click Update Nominee button','Nominee edit form activated'],['Enter first nominee: Priya Kumar (Spouse) - 60%','Nominee 1 details saved with percentage allocation'],['Enter second nominee: Arjun Kumar (Son - Minor) - 40% with guardian','Minor nominee accepted with guardian details'],['Submit nominee update','Nominees registered, confirmation letter generated']],
    {endpoint:'/api/v1/accounts/ACC-2026-SA-001/nominees',method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{accountNumber:"ACC-2026-SA-001",nomineesRegistered:2,totalAllocation:100,registrationId:"NOM-2026-0028",status:"REGISTERED"}}
  ),
  mkUC(20,'Account Dormancy Reactivation','P2','Account Management',
    'Reactivate a dormant account by verifying customer identity, updating KYC if expired, and processing minimum transaction.',
    ['Account is in DORMANT status','Customer visits branch with ID','KYC re-verification may be needed'],
    'Teller',
    {accountNumber:"ACC-2026-SA-001",customerId:"CIF-2026-000001",reactivationMode:"BRANCH_VISIT",identityVerification:{documentType:"PAN",documentNumber:"ABCPK1234M",verified:true},kycStatus:"VALID",reactivationTransaction:{type:"CASH_DEPOSIT",amount:1000},reason:"Customer returned from abroad"},
    [['Search dormant account by number','Account found with DORMANT status, dormancy date shown'],['Verify customer identity with PAN card','Identity matched with system records'],['Check KYC status validity','KYC valid, no re-verification needed'],['Process minimum reactivation deposit of Rs 1000','Cash deposit processed successfully'],['Reactivate account','Account status changed to ACTIVE, services restored']],
    {endpoint:'/api/v1/accounts/ACC-2026-SA-001/reactivate',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{accountNumber:"ACC-2026-SA-001",previousStatus:"DORMANT",currentStatus:"ACTIVE",reactivationDate:"2026-02-26",dormancyPeriodDays:456,message:"Account reactivated successfully"}}
  ),
  mkUC(21,'Internal Fund Transfer (Same Bank)','P1','Transactions',
    'Transfer funds between two accounts within the same bank with real-time balance update, daily/per-transaction limits check, and beneficiary validation.',
    ['Source account has sufficient balance','Beneficiary account exists in same bank','Transfer within daily limit'],
    'Customer',
    {sourceAccount:"ACC-2026-SA-001",destinationAccount:"ACC-2026-SA-045",amount:25000,currency:"INR",purpose:"Family maintenance",remarks:"Monthly transfer to spouse",transferMode:"IMMEDIATE",debitNarration:"TRF to Priya",creditNarration:"TRF from Rajesh"},
    [['Navigate to Fund Transfer page','Transfer form with source account pre-selected'],['Enter destination account number','Beneficiary name displayed for confirmation: Priya Kumar'],['Enter transfer amount Rs 25,000','Amount validated against available balance and daily limit'],['Add purpose and remarks','Transfer details completed'],['Confirm and execute transfer','Transfer successful, both accounts updated, SMS sent to both parties']],
    {endpoint:'/api/v1/transactions/transfer/internal',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}','X-Idempotency-Key':'{{uuid}}'},responseStatus:200,response:{transactionId:"TXN-2026-INT-000001",status:"SUCCESS",amount:25000,sourceBalance:220000,timestamp:"2026-02-26T10:15:00Z"}}
  ),
  mkUC(22,'NEFT Transfer','P1','Transactions',
    'Process NEFT transfer to other bank account with IFSC validation, beneficiary registration, and batch settlement processing.',
    ['Source account active','Beneficiary registered','NEFT window open (8 AM - 7 PM)'],
    'Customer',
    {sourceAccount:"ACC-2026-SA-001",beneficiary:{accountNumber:"50100012345678",name:"Suresh Patel",ifscCode:"SBIN0001234",bankName:"State Bank of India",accountType:"SAVINGS"},amount:50000,purpose:"P2P",remarks:"Loan repayment",scheduledDate:null},
    [['Navigate to NEFT Transfer page','NEFT form loaded with registered beneficiaries list'],['Select or add beneficiary with IFSC SBIN0001234','IFSC validated, bank/branch details auto-populated'],['Enter amount Rs 50,000','Amount within NEFT limits, charges displayed: Rs 5 + GST'],['Review transfer details','Confirmation screen with all details and charges'],['Authorize with OTP','NEFT submitted to clearing, UTR number generated']],
    {endpoint:'/api/v1/transactions/transfer/neft',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}','X-Idempotency-Key':'{{uuid}}'},responseStatus:202,response:{transactionId:"TXN-2026-NEFT-000001",utrNumber:"HDFC26058N000001",status:"SUBMITTED",expectedSettlement:"2026-02-26T14:00:00Z",charges:5.90}}
  ),
  mkUC(23,'RTGS Transfer (High Value)','P1','Transactions',
    'Process RTGS transfer for high-value payments (minimum Rs 2 lakh) with real-time gross settlement and immediate confirmation.',
    ['Amount >= Rs 2,00,000','Source account has sufficient balance','RTGS window active','Beneficiary registered'],
    'Customer',
    {sourceAccount:"ACC-2026-CA-001",beneficiary:{accountNumber:"91020034567890",name:"ABC Enterprises Pvt Ltd",ifscCode:"ICIC0001234",bankName:"ICICI Bank",accountType:"CURRENT"},amount:1500000,purpose:"BUSINESS",remarks:"Invoice INV-2026-0345 payment",senderToReceiverInfo:"Payment against invoice dated 20-Feb-2026"},
    [['Navigate to RTGS Transfer page','RTGS form with minimum amount validation (Rs 2L)'],['Select beneficiary ABC Enterprises','Beneficiary details loaded with IFSC validation'],['Enter amount Rs 15,00,000','Amount validated, RTGS charges computed: Rs 25 + GST'],['Review high-value transfer details','Double confirmation required for amount > 10L'],['Authorize with OTP and transaction password','RTGS processed, real-time confirmation received']],
    {endpoint:'/api/v1/transactions/transfer/rtgs',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}','X-Idempotency-Key':'{{uuid}}'},responseStatus:200,response:{transactionId:"TXN-2026-RTGS-000001",utrNumber:"HDFC26058R000001",status:"SETTLED",settlementTime:"2026-02-26T10:20:15Z",charges:29.50}}
  ),
  mkUC(24,'IMPS Instant Transfer','P1','Transactions',
    'Process instant money transfer via IMPS available 24x7 with mobile number/MMID or account/IFSC with real-time confirmation.',
    ['Source account active','IMPS registration done','Daily IMPS limit not exceeded'],
    'Customer',
    {sourceAccount:"ACC-2026-SA-001",transferMode:"ACCOUNT_IFSC",beneficiary:{accountNumber:"00112233445566",name:"Vikram Singh",ifscCode:"UTIB0001234"},amount:15000,purpose:"PERSONAL",remarks:"Birthday gift",mpin:"****"},
    [['Navigate to IMPS Transfer page','IMPS form with 24x7 availability indicator'],['Select transfer mode: Account + IFSC','Account/IFSC input fields displayed'],['Enter beneficiary details and amount Rs 15,000','Amount within IMPS limit (Rs 5L), charges: Rs 5'],['Review instant transfer details','Transfer summary with estimated completion: Instant'],['Authorize with MPIN','Transfer completed instantly, confirmation SMS sent']],
    {endpoint:'/api/v1/transactions/transfer/imps',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}','X-Idempotency-Key':'{{uuid}}'},responseStatus:200,response:{transactionId:"TXN-2026-IMPS-000001",rrn:"605812345678",status:"SUCCESS",completedAt:"2026-02-26T10:25:03Z",charges:5.00}}
  ),
  mkUC(25,'UPI Payment','P1','Transactions',
    'Process UPI payment using VPA (Virtual Payment Address) with collect request, pay request, and QR code payment support.',
    ['UPI ID registered','PSP handle active','Amount within UPI limit (Rs 1L)'],
    'Customer',
    {payerVpa:"rajesh.kumar@hdfc",payeeVpa:"shop.billing@icici",amount:3500,currency:"INR",purpose:"PURCHASE",remarks:"Grocery payment",transactionType:"PAY",deviceFingerprint:"abc123def456",location:{lat:19.076,lng:72.877}},
    [['Open UPI payment screen','UPI payment interface with pay/collect options'],['Enter payee VPA: shop.billing@icici','VPA validated, payee name displayed: "Shop Mart"'],['Enter amount Rs 3,500','Amount within UPI transaction limit'],['Review payment details','Payment summary with payee verification'],['Authorize with UPI PIN','Payment processed instantly, transaction receipt generated']],
    {endpoint:'/api/v1/transactions/upi/pay',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}','X-Idempotency-Key':'{{uuid}}'},responseStatus:200,response:{transactionId:"TXN-2026-UPI-000001",upiTxnId:"UPI260226105030001",status:"SUCCESS",payeeName:"Shop Mart",completedAt:"2026-02-26T10:50:30Z"}}
  ),
  mkUC(26,'Standing Instruction Setup','P2','Transactions',
    'Set up recurring standing instruction for automatic fund transfers with frequency, amount, and validity period configuration.',
    ['Source account active','Beneficiary registered','Start date in future'],
    'Customer',
    {sourceAccount:"ACC-2026-SA-001",destinationAccount:"ACC-2026-SA-045",amount:15000,frequency:"MONTHLY",debitDate:1,startDate:"2026-03-01",endDate:"2027-02-01",purpose:"Rent payment",failureAction:"RETRY_NEXT_DAY",maxRetries:3,notifyOnExecution:true,notifyOnFailure:true},
    [['Navigate to Standing Instructions page','SI management dashboard with active/inactive SIs'],['Click Create New Standing Instruction','SI setup form displayed'],['Enter source, destination, amount Rs 15,000, monthly frequency','SI details configured with debit date 1st of each month'],['Set validity period: March 2026 to February 2027','12 executions planned, schedule preview shown'],['Activate standing instruction','SI created and scheduled, confirmation sent']],
    {endpoint:'/api/v1/transactions/standing-instructions',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{siId:"SI-2026-000001",status:"ACTIVE",nextExecution:"2026-03-01",totalExecutions:12,amount:15000,frequency:"MONTHLY"}}
  ),
  mkUC(27,'Bulk Salary Upload','P1','Transactions',
    'Process bulk salary disbursement by uploading salary file with validation, duplicate check, and batch processing with detailed status tracking.',
    ['Corporate account active','Salary file in approved format','Sufficient balance for total payout'],
    'Manager',
    {corporateAccount:"ACC-2026-CA-001",batchReference:"SAL-FEB-2026",paymentDate:"2026-02-28",totalRecords:150,totalAmount:7500000,fileFormat:"CSV",salaryRecords:[{employeeId:"EMP-001",accountNumber:"ACC-2026-SA-001",name:"Rajesh Kumar",amount:85000,narration:"Salary Feb 2026"},{employeeId:"EMP-002",accountNumber:"ACC-2026-SA-045",name:"Priya Kumar",amount:65000,narration:"Salary Feb 2026"}],deduplicationCheck:true},
    [['Navigate to Bulk Payment module','Salary upload interface displayed'],['Upload salary CSV file with 150 records','File parsed, format validated, 150 records found'],['System validates all account numbers and checksums','148 records valid, 2 accounts not found - flagged'],['Review batch summary: Rs 75L across 148 valid records','Batch summary displayed with invalid records highlighted'],['Authorize bulk payment with dual authorization','Batch submitted for processing, status tracking enabled']],
    {endpoint:'/api/v1/transactions/bulk/salary',method:'POST',headers:{'Content-Type':'multipart/form-data','Authorization':'Bearer {{token}}'},responseStatus:202,response:{batchId:"BATCH-SAL-2026-0015",status:"PROCESSING",totalRecords:150,validRecords:148,invalidRecords:2,totalAmount:7380000,estimatedCompletion:"2026-02-28T08:00:00Z"}}
  ),
  mkUC(28,'Foreign Currency Remittance','P1','Transactions',
    'Process outward foreign currency remittance with SWIFT transfer, purpose code validation, FEMA compliance, and exchange rate locking.',
    ['Customer has forex-enabled account','LRS limit not breached','Purpose code valid under FEMA','Beneficiary bank SWIFT code valid'],
    'Teller',
    {sourceAccount:"ACC-2026-SA-001",remittanceType:"OUTWARD",beneficiary:{name:"John Smith",accountNumber:"GB29NWBK60161331926819",swiftCode:"NWBKGB2L",bankName:"NatWest Bank",country:"United Kingdom",address:"250 Bishopsgate, London"},amount:{value:5000,currency:"USD"},purposeCode:"S0305",purposeDescription:"Education fees",exchangeRate:83.25,inrEquivalent:416250,lrsDeclaration:true,a2FormRequired:true},
    [['Navigate to Foreign Remittance module','Outward remittance form with purpose code dropdown'],['Enter beneficiary SWIFT details','SWIFT code validated: NatWest Bank, London confirmed'],['Enter amount USD 5,000 with purpose code S0305','Exchange rate fetched: 1 USD = 83.25 INR, total INR 4,16,250'],['Complete FEMA declaration and A2 form','LRS utilization checked: within $250,000 annual limit'],['Submit remittance request','Remittance queued for SWIFT processing, reference number generated']],
    {endpoint:'/api/v1/transactions/remittance/outward',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:202,response:{remittanceId:"REM-2026-OUT-000001",swiftReference:"HDFC26058OUT001",status:"PROCESSING",exchangeRate:83.25,debitAmount:416250,charges:750,gst:135,totalDebit:417135}}
  ),
  mkUC(29,'Cash Deposit at Branch','P2','Transactions',
    'Process over-the-counter cash deposit with denomination tracking, PAN requirement for amounts above Rs 50,000, and CTR generation for large transactions.',
    ['Branch operations active','Cash counter open','Customer account verified'],
    'Teller',
    {accountNumber:"ACC-2026-SA-001",depositAmount:75000,currency:"INR",denominations:{"2000":10,"500":80,"200":50,"100":50},depositorName:"Rajesh Kumar",depositorPan:"ABCPK1234M",remarks:"Business receipts deposit",ctrRequired:true,source:"BUSINESS_INCOME"},
    [['Customer presents cash at teller counter','Teller opens cash deposit screen'],['Enter account number and verify customer','Account holder name displayed for verification'],['Count cash and enter denomination details','Total computed: Rs 75,000 (matches physical count)'],['Enter PAN (mandatory for > Rs 50,000)','PAN validated against customer records'],['Process deposit and generate receipt','Cash credited, receipt printed, CTR flagged for compliance']],
    {endpoint:'/api/v1/transactions/cash/deposit',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{transactionId:"TXN-2026-CASH-000001",accountNumber:"ACC-2026-SA-001",amountDeposited:75000,newBalance:295000,ctrGenerated:true,receiptNumber:"RCP-2026-0456"}}
  ),
  mkUC(30,'Cheque Book Request & Processing','P2','Transactions',
    'Process cheque book request with leaf count selection, dispatch tracking, and cheque series allocation from inventory.',
    ['Account is cheque-enabled','No pending cheque book request','Account in good standing'],
    'Customer',
    {accountNumber:"ACC-2026-SA-001",leafCount:25,chequeType:"CTS_2010",deliveryMode:"BRANCH_PICKUP",branchCode:"HDFC0001234",urgentRequest:false,currentLastChequeNumber:"000075"},
    [['Navigate to Service Requests page','Cheque book request option displayed'],['Select cheque book request for account','Cheque book options: 25/50/100 leaves displayed'],['Choose 25-leaf CTS-2010 compliant cheque book','Request configured with branch pickup delivery'],['Submit cheque book request','Request ID generated, estimated delivery: 5-7 business days'],['Track cheque book dispatch status','Status updated: Printed → Dispatched → Available for pickup']],
    {endpoint:'/api/v1/accounts/ACC-2026-SA-001/cheque-book',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{requestId:"CHQ-REQ-2026-0089",chequeSeriesStart:"000076",chequeSeriesEnd:"000100",leafCount:25,estimatedDelivery:"2026-03-05",status:"PROCESSING"}}
  ),
  mkUC(31,'Personal Loan Application','P1','Loans & Credit',
    'Process personal loan application with income verification, credit score check, EMI affordability analysis, and automated approval workflow.',
    ['Customer KYC valid','Employment verified','Age between 21-60','Minimum income Rs 25,000/month'],
    'Customer',
    {customerId:"CIF-2026-000001",loanType:"PERSONAL",requestedAmount:500000,tenure:36,purpose:"HOME_RENOVATION",employmentType:"SALARIED",employer:"Infosys Ltd",monthlyIncome:125000,existingEMIs:15000,coApplicant:null,disbursementAccount:"ACC-2026-SA-001",insuranceOptIn:true},
    [['Customer initiates personal loan application online','Loan application form with eligibility calculator'],['Enter loan amount Rs 5L, tenure 36 months, purpose','EMI calculated: Rs 17,658 @ 12.5% p.a., FOIR: 26%'],['System fetches credit score from CIBIL','Credit score: 756 (Good), eligible for processing'],['Upload income documents (salary slips, Form 16)','Documents uploaded, OCR extracts income details'],['Submit application for automated decisioning','Loan approved conditionally, sanction letter generated']],
    {endpoint:'/api/v1/loans/personal/apply',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{applicationId:"LOAN-PL-2026-000001",status:"CONDITIONALLY_APPROVED",sanctionedAmount:500000,interestRate:12.5,emi:17658,tenure:36,processingFee:5000}}
  ),
  mkUC(32,'Home Loan Application','P1','Loans & Credit',
    'Process home loan application with property valuation, legal verification, title search, and multi-stage approval for large-ticket lending.',
    ['Property identified','Income documents ready','Property papers available','Co-applicant details (if applicable)'],
    'Customer',
    {customerId:"CIF-2026-000001",loanType:"HOME_LOAN",requestedAmount:5000000,tenure:240,purpose:"PURCHASE",propertyDetails:{type:"APARTMENT",address:"Lodha Palava, Dombivli East",area:1200,unit:"SQFT",estimatedValue:6500000,builder:"Lodha Group",projectApproved:true,reraNumber:"P51700028765"},coApplicant:{customerId:"CIF-2026-000045",name:"Priya Kumar",relationship:"SPOUSE",monthlyIncome:85000},monthlyIncome:125000,disbursementMode:"TRANCHE"},
    [['Customer applies for home loan Rs 50L for 20 years','Home loan application wizard initiated'],['Enter property details: Lodha Palava, 1200 sqft apartment','Property builder approved, RERA registered'],['Add co-applicant Priya Kumar with income details','Combined income Rs 2.1L, eligible for Rs 50L'],['System initiates credit check, property valuation, legal verification','All checks passed, property valued at Rs 65L, LTV 77%'],['Loan sanctioned with tranche disbursement plan','Sanction letter issued, 3-stage disbursement schedule created']],
    {endpoint:'/api/v1/loans/home/apply',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{applicationId:"LOAN-HL-2026-000001",status:"SANCTIONED",sanctionedAmount:5000000,interestRate:8.75,emi:44986,tenure:240,ltvRatio:76.92,disbursementSchedule:"TRANCHE"}}
  ),
  mkUC(33,'Vehicle Loan Processing','P2','Loans & Credit',
    'Process vehicle loan for new/used vehicle with dealer tie-up integration, vehicle valuation, hypothecation, and RTO charge estimation.',
    ['Customer eligible','Vehicle identified','Dealer registered with bank','Insurance arranged'],
    'Customer',
    {customerId:"CIF-2026-000001",loanType:"VEHICLE",vehicleType:"NEW_CAR",vehicleDetails:{make:"Hyundai",model:"Creta",variant:"SX(O) 1.5 Turbo DCT",year:2026,exShowroomPrice:1800000,onRoadPrice:2100000,color:"Titan Grey",vin:"MALC381CPNM000001"},dealerCode:"DLR-HYD-0045",requestedAmount:1600000,tenure:60,insuranceAmount:45000,downPayment:500000},
    [['Navigate to Vehicle Loan application','Vehicle loan form with dealer selection'],['Select dealer and enter vehicle details: Hyundai Creta 2026','Vehicle details auto-fetched from dealer system, on-road: Rs 21L'],['Enter loan amount Rs 16L with down payment Rs 5L','LTV: 76%, within 85% threshold, tenure 60 months'],['System processes credit check and income verification','Approved at 9.25% p.a., EMI: Rs 33,284'],['Sanction loan with hypothecation instructions for RTO','Loan sanctioned, disbursement to dealer account scheduled']],
    {endpoint:'/api/v1/loans/vehicle/apply',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{applicationId:"LOAN-VL-2026-000001",status:"SANCTIONED",sanctionedAmount:1600000,interestRate:9.25,emi:33284,tenure:60,hypothecationRTO:"MH-04"}}
  ),
  mkUC(34,'Credit Score Check','P1','Loans & Credit',
    'Fetch customer credit score from CIBIL, Experian, and CRIF bureaus with detailed credit report analysis and score factors.',
    ['Customer PAN available','Bureau connectivity active','Customer consent obtained'],
    'System',
    {customerId:"CIF-2026-000001",panNumber:"ABCPK1234M",bureaus:["CIBIL","EXPERIAN","CRIF"],consentId:"CONSENT-2026-0089",purpose:"LOAN_APPLICATION",includeDetailedReport:true},
    [['Initiate credit score fetch with customer consent','Bureau inquiry request submitted to all 3 bureaus'],['CIBIL returns score: 756 out of 900','Score classified as GOOD (750-799 range)'],['Experian returns score: 742','Cross-bureau average computed'],['Analyze credit report: accounts, inquiries, defaults','No defaults, 5 active accounts, 2 hard inquiries in last 6 months'],['Generate consolidated credit assessment report','Report generated with score factors and recommendations']],
    {endpoint:'/api/v1/loans/credit-score',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{customerId:"CIF-2026-000001",scores:{CIBIL:756,EXPERIAN:742,CRIF:738},averageScore:745,classification:"GOOD",activeAccounts:5,defaults:0,hardInquiries:2,reportId:"CR-2026-000042"}}
  ),
  mkUC(35,'Loan EMI Calculation','P2','Loans & Credit',
    'Calculate EMI for various loan products with flexible tenure, interest rate comparison, amortization schedule, and prepayment impact analysis.',
    ['Loan amount entered','Interest rate available','Tenure within allowed range'],
    'Customer',
    {loanAmount:1000000,interestRate:10.5,tenure:60,loanType:"PERSONAL",processingFee:1.5,insurancePremium:5000,prepaymentAmount:100000,prepaymentMonth:12,emiStartDate:"2026-04-01"},
    [['Open EMI Calculator tool','Calculator interface with loan type selector'],['Enter loan amount Rs 10L, rate 10.5%, tenure 60 months','EMI computed: Rs 21,494'],['View amortization schedule','Month-by-month principal/interest breakup displayed'],['Simulate prepayment of Rs 1L after 12 months','Revised tenure: 48 months, interest saved: Rs 62,340'],['Compare with different tenures and rates','Comparison table: 36/48/60/72 month options displayed']],
    {endpoint:'/api/v1/loans/emi-calculator',method:'POST',headers:{'Content-Type':'application/json'},responseStatus:200,response:{emi:21494,totalInterest:289640,totalPayment:1289640,effectiveRate:10.5,amortizationSchedule:"60 entries",prepaymentSavings:62340,revisedTenure:48}}
  ),
  mkUC(36,'Loan Disbursement','P1','Loans & Credit',
    'Process loan disbursement after all conditions met including document execution, insurance activation, and fund transfer to designated account.',
    ['Loan sanctioned','All documents executed','Insurance activated','Pre-disbursement conditions met'],
    'Manager',
    {applicationId:"LOAN-PL-2026-000001",disbursementAccount:"ACC-2026-SA-001",disbursementAmount:495000,processingFeeDeducted:5000,insurancePremiumDeducted:0,disbursementMode:"ACCOUNT_CREDIT",documentationComplete:true,insuranceActivated:true,pdcCollected:true,nachMandate:"NACH-2026-0034"},
    [['Verify all pre-disbursement conditions','Checklist: Documents complete, insurance active, NACH set'],['Calculate net disbursement after fee deduction','Sanctioned: Rs 5L, Processing fee: Rs 5K, Net: Rs 4,95,000'],['Initiate disbursement to savings account','Fund transfer initiated to ACC-2026-SA-001'],['Generate loan account and repayment schedule','Loan account LN-2026-PL-001 created, EMI schedule set'],['Send disbursement confirmation and first EMI details','SMS/email sent with loan details and first EMI date']],
    {endpoint:'/api/v1/loans/LOAN-PL-2026-000001/disburse',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{loanAccountNumber:"LN-2026-PL-001",disbursedAmount:495000,firstEMIDate:"2026-04-01",emiAmount:17658,repaymentAccount:"ACC-2026-SA-001",status:"DISBURSED"}}
  ),
  mkUC(37,'Loan Prepayment/Foreclosure','P2','Loans & Credit',
    'Process partial prepayment or full foreclosure of a loan with penalty calculation, revised schedule generation, and NOC issuance.',
    ['Loan is active','Minimum tenure completed for foreclosure','Prepayment amount available'],
    'Customer',
    {loanAccountNumber:"LN-2026-PL-001",prepaymentType:"PARTIAL",prepaymentAmount:200000,sourceAccount:"ACC-2026-SA-001",requestDate:"2026-06-15",adjustmentPreference:"REDUCE_TENURE",foreClosurePenaltyWaiver:false},
    [['Navigate to Loan Prepayment module','Prepayment options displayed for active loan'],['Select partial prepayment of Rs 2L','Outstanding principal and prepayment impact calculated'],['Choose tenure reduction over EMI reduction','Revised tenure: 22 months (from 33), EMI unchanged'],['Review penalty charges: 2% on prepaid amount = Rs 4,000','Penalty computed as per loan agreement terms'],['Confirm prepayment','Principal reduced, revised schedule generated, confirmation sent']],
    {endpoint:'/api/v1/loans/LN-2026-PL-001/prepay',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{loanAccountNumber:"LN-2026-PL-001",prepaidAmount:200000,penaltyCharged:4000,totalDeducted:204000,revisedOutstanding:285000,revisedTenure:22,revisedEMI:17658,status:"PREPAYMENT_PROCESSED"}}
  ),
  mkUC(38,'Loan Restructuring','P1','Loans & Credit',
    'Restructure an existing loan by modifying tenure, interest rate, or EMI amount for customers facing financial difficulty with regulatory compliance.',
    ['Customer has demonstrated financial hardship','Loan is not NPA','Restructuring policy applicable','RBI guidelines met'],
    'Manager',
    {loanAccountNumber:"LN-2026-PL-001",restructureType:"TENURE_EXTENSION",currentTenure:36,newTenure:48,currentEMI:17658,reason:"JOB_LOSS",moratoriumPeriod:3,moratoriumStartDate:"2026-03-01",supportingDocuments:["DOC-2026-TERM-001"],approvalLevel:"REGIONAL_MANAGER"},
    [['Customer requests loan restructuring due to job loss','Restructuring eligibility check initiated'],['Evaluate loan account: not NPA, EMI overdue by 30 days','Eligible for restructuring under hardship policy'],['Propose restructuring: extend tenure by 12 months + 3-month moratorium','New EMI calculated: Rs 14,200, moratorium interest capitalized'],['Upload supporting documents and submit for approval','Sent to Regional Manager for approval'],['Restructuring approved and implemented','Revised repayment schedule effective post-moratorium']],
    {endpoint:'/api/v1/loans/LN-2026-PL-001/restructure',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{loanAccountNumber:"LN-2026-PL-001",status:"RESTRUCTURED",newTenure:48,newEMI:14200,moratoriumEnd:"2026-06-01",firstRevisedEMI:"2026-07-01",restructureId:"RST-2026-0008"}}
  ),
  mkUC(39,'Loan Default & Recovery','P1','Loans & Credit',
    'Handle loan default classification (SMA/NPA), initiate recovery process with demand notices, and manage resolution through OTS or legal action.',
    ['EMI overdue beyond 90 days','Account classified as NPA','Recovery team assigned','Legal notice prepared'],
    'Manager',
    {loanAccountNumber:"LN-2026-PL-002",defaultDays:95,outstandingAmount:380000,overdueAmount:53000,npaDate:"2026-02-01",recoveryAction:"DEMAND_NOTICE",demandNotice:{type:"FIRST_NOTICE",issueDate:"2026-02-26",responseDeadline:"2026-03-12"},otsOffer:null,legalAction:false,assignedRecoveryAgent:"RA-2026-005"},
    [['System identifies loan as NPA (90+ days overdue)','Loan classified as NPA, reported to CIBIL'],['Generate and send demand notice to borrower','First demand notice issued with 14-day response deadline'],['Record recovery agent assignment','Agent RA-2026-005 assigned for follow-up'],['Track borrower response and recovery actions','Timeline of all communication and actions logged'],['Initiate OTS negotiation or escalate to legal','OTS offer template prepared based on outstanding amount']],
    {endpoint:'/api/v1/loans/LN-2026-PL-002/recovery',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{loanAccountNumber:"LN-2026-PL-002",npaClassification:"SUBSTANDARD",demandNoticeId:"DN-2026-0034",responseDeadline:"2026-03-12",recoveryAgentId:"RA-2026-005",status:"RECOVERY_INITIATED"}}
  ),
  mkUC(40,'Loan Balance Transfer','P2','Loans & Credit',
    'Process loan balance transfer from another bank with takeover amount calculation, lien marking on existing loan, and new loan account creation.',
    ['Customer has active loan with other bank','Our rate is lower','Customer creditworthy','Other bank NOC obtainable'],
    'Customer',
    {customerId:"CIF-2026-000001",existingLoan:{bankName:"ICICI Bank",loanAccountNumber:"ICICI-PL-12345",outstandingAmount:450000,currentRate:14.5,remainingTenure:24,emiAmount:22000},proposedLoan:{amount:450000,rate:10.5,tenure:24,emiAmount:20800},balanceTransferFee:2500,topUpAmount:50000,topUpRequired:true},
    [['Customer initiates balance transfer request','BT eligibility check: rate differential > 2%, savings computed'],['Fetch foreclosure amount from existing bank','Existing bank confirms outstanding: Rs 4,50,000 + foreclosure: Rs 9,000'],['Process new loan at 10.5% for 24 months','New EMI: Rs 20,800 (savings: Rs 1,200/month)'],['Disburse to existing bank for loan closure + top-up to customer','Rs 4,59,000 to ICICI (closure), Rs 50,000 top-up to customer account'],['Existing loan closed, new loan account activated','BT complete, total savings over tenure: Rs 28,800']],
    {endpoint:'/api/v1/loans/balance-transfer',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{newLoanAccount:"LN-2026-BT-001",disbursedToBank:459000,topUpDisbursed:50000,newRate:10.5,newEMI:20800,monthlySavings:1200,totalSavings:28800,status:"BALANCE_TRANSFERRED"}}
  ),
  mkUC(41,'Credit Card Application','P1','Cards & Payments',
    'Process credit card application with income assessment, credit limit determination, card variant selection, and instant virtual card issuance.',
    ['Customer KYC valid','Income documents available','Credit score above 650','No existing defaults'],
    'Customer',
    {customerId:"CIF-2026-000001",cardVariant:"REGALIA_GOLD",requestedLimit:300000,employmentType:"SALARIED",annualIncome:1500000,existingCards:1,existingCardLimit:100000,addOnCard:false,deliveryAddress:{line1:"42 MG Road",city:"Mumbai",state:"Maharashtra",pincode:"400001"},virtualCardRequired:true},
    [['Customer applies for Regalia Gold credit card','Application form with card variant comparison'],['System verifies income and employment','Annual income Rs 15L qualifies for Regalia Gold'],['Credit bureau check: Score 756, clean history','Approved limit: Rs 3L based on income and score'],['Instant virtual card issued on mobile app','16-digit virtual card number generated for immediate use'],['Physical card dispatched via registered post','Card printed, dispatched, expected delivery: 7-10 days']],
    {endpoint:'/api/v1/cards/credit/apply',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{applicationId:"CC-APP-2026-000001",cardNumber:"****-****-****-4532",cardVariant:"REGALIA_GOLD",approvedLimit:300000,virtualCardIssued:true,physicalCardETA:"2026-03-08",status:"APPROVED"}}
  ),
  mkUC(42,'Debit Card Issuance','P1','Cards & Payments',
    'Issue new debit card linked to savings/current account with card type selection, daily limit configuration, and international usage activation.',
    ['Account active','No existing card or replacement request','KYC valid'],
    'Teller',
    {accountNumber:"ACC-2026-SA-001",cardType:"PLATINUM_DEBIT",nameOnCard:"RAJESH KUMAR",dailyATMLimit:50000,dailyPOSLimit:200000,internationalUsage:true,contactless:true,deliveryMode:"BRANCH_PICKUP",branchCode:"HDFC0001234"},
    [['Initiate debit card issuance for savings account','Card issuance form with type selection'],['Select Platinum Debit card variant','Card features and annual fee displayed: Rs 500 + GST'],['Configure daily limits: ATM Rs 50K, POS Rs 2L','Limits set within maximum allowed for card type'],['Enable international usage and contactless payments','International and contactless flags activated'],['Submit card issuance request','Card queued for printing, PIN mailer initiated separately']],
    {endpoint:'/api/v1/cards/debit/issue',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{cardNumber:"****-****-****-7891",cardType:"PLATINUM_DEBIT",linkedAccount:"ACC-2026-SA-001",status:"ISSUED",pinMailerDispatched:true,estimatedDelivery:"2026-03-05"}}
  ),
  mkUC(43,'Card Activation','P1','Cards & Payments',
    'Activate a newly received debit or credit card through multiple channels (IVR, net banking, mobile app, SMS) with PIN generation.',
    ['Card received by customer','Card status is ISSUED (not yet ACTIVE)','Customer identity verified'],
    'Customer',
    {cardNumber:"****-****-****-4532",activationChannel:"MOBILE_APP",last4Digits:"4532",expiryMonth:"02",expiryYear:"2028",cvvEntered:true,dateOfBirth:"1990-05-15",setPIN:true,newPIN:"****",confirmPIN:"****"},
    [['Customer opens card activation in mobile app','Card activation wizard displayed'],['Enter last 4 digits and expiry date for verification','Card details matched with bank records'],['Enter CVV from back of card','CVV validated, identity confirmed'],['Set new 4-digit ATM PIN','PIN set securely, encrypted in transit'],['Card activated successfully','Card status: ACTIVE, ready for transactions at ATM/POS/online']],
    {endpoint:'/api/v1/cards/activate',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{cardNumber:"****-****-****-4532",status:"ACTIVE",activatedAt:"2026-02-26T11:30:00Z",activationChannel:"MOBILE_APP",message:"Card activated successfully"}}
  ),
  mkUC(44,'Card PIN Change','P2','Cards & Payments',
    'Change card ATM PIN through secure channels with current PIN validation and OTP-based verification.',
    ['Card is active','Customer authenticated','Current PIN known or OTP verified'],
    'Customer',
    {cardNumber:"****-****-****-4532",changeMethod:"THROUGH_APP",currentPIN:"****",newPIN:"****",confirmNewPIN:"****",otpVerified:true,otpChannel:"SMS",deviceId:"DEV-MOB-2026-001"},
    [['Navigate to Card PIN Change in mobile app','PIN change form displayed with security instructions'],['Enter current 4-digit PIN','Current PIN validated against encrypted store'],['Enter new 4-digit PIN (not sequential, not repeated digits)','New PIN passes complexity validation'],['Confirm new PIN by re-entering','PINs match, change request initiated'],['OTP verification for additional security','OTP verified, PIN changed successfully across all channels']],
    {endpoint:'/api/v1/cards/pin/change',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{cardNumber:"****-****-****-4532",pinChanged:true,changedAt:"2026-02-26T11:45:00Z",effectiveImmediately:true,message:"PIN changed successfully"}}
  ),
  mkUC(45,'Card Block/Unblock','P1','Cards & Payments',
    'Temporarily block or permanently block a lost/stolen card with instant effect across all channels and optional replacement card issuance.',
    ['Card exists in system','Customer authenticated','Block reason provided'],
    'Customer',
    {cardNumber:"****-****-****-4532",action:"TEMPORARY_BLOCK",reason:"SUSPECTED_FRAUD",blockAllChannels:true,channels:["ATM","POS","ONLINE","CONTACTLESS"],lastKnownTransaction:{date:"2026-02-25",amount:5000,merchant:"Unknown Merchant"},replacementRequired:false,reportToPolice:false},
    [['Customer requests card block via mobile app','Immediate block option displayed with reason selection'],['Select Temporary Block with reason: Suspected Fraud','Block type and reason captured'],['System instantly blocks card across all channels','Card blocked at switch level within 2 seconds'],['Last 5 transactions displayed for review','Customer reviews and flags unauthorized transaction'],['Block confirmation sent via SMS and email','Block reference number generated for future reference']],
    {endpoint:'/api/v1/cards/block',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{cardNumber:"****-****-****-4532",blockStatus:"TEMPORARILY_BLOCKED",blockedAt:"2026-02-26T12:00:00Z",blockReference:"BLK-2026-0089",allChannelsBlocked:true,message:"Card blocked successfully"}}
  ),
  mkUC(46,'Card Limit Modification','P2','Cards & Payments',
    'Modify card transaction limits including daily ATM withdrawal, POS purchase, online transaction, and international spending limits.',
    ['Card is active','Customer authenticated','Requested limits within allowed range'],
    'Customer',
    {cardNumber:"****-****-****-4532",limitChanges:{dailyATM:{current:50000,requested:100000},dailyPOS:{current:200000,requested:300000},dailyOnline:{current:100000,requested:200000},internationalDaily:{current:50000,requested:100000},perTransactionMax:{current:100000,requested:200000}},effectiveFrom:"IMMEDIATE",temporaryOverride:false},
    [['Navigate to Card Limit Management','Current limits displayed for all channels'],['Select limits to modify: ATM, POS, Online','Modification form with current and max allowed values'],['Request ATM limit increase to Rs 1L','Within maximum allowed (Rs 2L), change accepted'],['Request POS limit increase to Rs 3L','Within maximum for Platinum card, accepted'],['Submit all limit changes','All limits updated immediately, confirmation sent']],
    {endpoint:'/api/v1/cards/limits',method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{cardNumber:"****-****-****-4532",updatedLimits:{dailyATM:100000,dailyPOS:300000,dailyOnline:200000,internationalDaily:100000},effectiveFrom:"2026-02-26T12:15:00Z",status:"UPDATED"}}
  ),
  mkUC(47,'Bill Payment (Utility/Telecom)','P2','Cards & Payments',
    'Process utility bill payment (electricity, water, gas, telecom) through BBPS with biller search, bill fetch, and payment confirmation.',
    ['Biller registered on BBPS','Customer has payment source','Bill amount available'],
    'Customer',
    {billerId:"BSES-DEL-001",billerName:"BSES Rajdhani",billerCategory:"ELECTRICITY",consumerNumber:"1234567890",billAmount:4500,paymentSource:{type:"SAVINGS_ACCOUNT",accountNumber:"ACC-2026-SA-001"},paymentMode:"IMMEDIATE",scheduleDate:null,autopaySetup:false},
    [['Navigate to Bill Payments section','BBPS biller categories displayed'],['Select Electricity > BSES Rajdhani','Biller selected, consumer number input shown'],['Enter consumer number and fetch bill','Bill fetched: Rs 4,500, due date: 05-Mar-2026'],['Select payment from savings account','Payment source confirmed, sufficient balance available'],['Pay bill and get instant confirmation','Bill paid, BBPS transaction ID generated, receipt available']],
    {endpoint:'/api/v1/payments/bills',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}','X-Idempotency-Key':'{{uuid}}'},responseStatus:200,response:{transactionId:"BILL-2026-000042",bbpsRefNumber:"BBPS260226120001",billerName:"BSES Rajdhani",amountPaid:4500,paymentDate:"2026-02-26",status:"SUCCESS"}}
  ),
  mkUC(48,'EMI Conversion on Credit Card','P2','Cards & Payments',
    'Convert a credit card transaction into EMI with tenure selection, interest rate display, and processing fee calculation.',
    ['Transaction eligible for EMI conversion','Minimum amount Rs 2,500','Transaction within 30 days'],
    'Customer',
    {cardNumber:"****-****-****-4532",transactionId:"CC-TXN-2026-0456",transactionAmount:50000,merchantName:"Croma Electronics",transactionDate:"2026-02-20",emiTenure:6,emiInterest:14,processingFee:500,foreclosureAllowed:true},
    [['View recent credit card transactions eligible for EMI','List of transactions > Rs 2,500 from last 30 days displayed'],['Select transaction: Rs 50,000 at Croma Electronics','EMI options displayed: 3/6/9/12 month tenures'],['Choose 6-month tenure at 14% p.a.','EMI: Rs 8,695/month, total interest: Rs 2,170, processing: Rs 500'],['Review total cost of EMI conversion','Total payable: Rs 52,670, savings vs revolving: Rs 4,330'],['Confirm EMI conversion','Transaction converted, next credit card bill shows EMI installment']],
    {endpoint:'/api/v1/cards/credit/emi-convert',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{emiId:"EMI-CC-2026-0034",monthlyEMI:8695,tenure:6,totalInterest:2170,processingFee:500,firstEMIDate:"2026-03-15",status:"CONVERTED"}}
  ),
  mkUC(49,'Reward Points Redemption','P3','Cards & Payments',
    'Redeem accumulated credit card reward points for cashback, merchandise, air miles, or gift vouchers with real-time points balance check.',
    ['Card has sufficient reward points','Redemption catalog active','Minimum points threshold met'],
    'Customer',
    {cardNumber:"****-****-****-4532",currentPoints:15000,redemptionType:"CASHBACK",redemptionDetails:{cashbackAmount:1500,creditToStatement:true},alternativeOptions:[{type:"AMAZON_VOUCHER",value:1750,pointsRequired:15000},{type:"AIR_MILES",value:3000,pointsRequired:15000}]},
    [['Navigate to Rewards section in credit card module','Points balance displayed: 15,000 points'],['Browse redemption catalog: Cashback, Vouchers, Miles','Options with point-to-value conversion shown'],['Select cashback redemption: 15,000 pts = Rs 1,500','Cashback amount calculated at 10 pts = Re 1'],['Confirm cashback credit to next statement','Cashback scheduled for next billing cycle'],['Points deducted, redemption confirmation generated','Points balance updated to 0, redemption receipt issued']],
    {endpoint:'/api/v1/cards/credit/rewards/redeem',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{redemptionId:"RWD-2026-0089",pointsRedeemed:15000,redemptionType:"CASHBACK",value:1500,creditDate:"2026-03-15",remainingPoints:0,status:"REDEEMED"}}
  ),
  mkUC(50,'Card Dispute/Chargeback','P1','Cards & Payments',
    'Raise dispute for unauthorized or incorrect card transaction with chargeback initiation, provisional credit, and resolution tracking.',
    ['Transaction in question identified','Within 120 days of transaction','Card holder authenticated'],
    'Customer',
    {cardNumber:"****-****-****-4532",disputedTransaction:{transactionId:"CC-TXN-2026-0500",date:"2026-02-15",amount:12000,merchantName:"Unknown Online Store",merchantCategory:"ECOMMERCE",country:"US"},disputeType:"UNAUTHORIZED",description:"Did not make this transaction, card was in my possession",provisionalCreditRequested:true,supportingDocuments:["DOC-2026-DISP-001"]},
    [['Navigate to Transaction Dispute page','Recent transactions listed with dispute option'],['Select unauthorized transaction of Rs 12,000','Transaction details displayed with merchant info'],['Select dispute reason: Unauthorized Transaction','Dispute form pre-filled with transaction details'],['Provide description and upload supporting documents','Dispute details captured, FIR not required for < Rs 25,000'],['Submit dispute, provisional credit issued','Dispute raised, provisional credit of Rs 12,000 within 48 hours, resolution: 45-90 days']],
    {endpoint:'/api/v1/cards/dispute',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{disputeId:"DSP-2026-000015",disputeType:"UNAUTHORIZED",amount:12000,provisionalCreditDate:"2026-02-28",expectedResolution:"2026-05-26",status:"UNDER_INVESTIGATION"}}
  ),
  mkUC(51,'KYC Document Upload','P1','Compliance & KYC',
    'Upload and verify KYC documents including identity proof, address proof, and photograph with OCR extraction and document quality validation.',
    ['Customer CIF exists','Supported document types defined','File size limit: 5MB per document'],
    'Teller',
    {customerId:"CIF-2026-000001",documents:[{type:"PAN_CARD",file:"pan_card.jpg",fileSize:"1.2MB",ocrExtract:{panNumber:"ABCPK1234M",name:"RAJESH KUMAR"}},{type:"AADHAAR_CARD",file:"aadhaar_front.jpg",fileSize:"0.8MB",ocrExtract:{aadhaarNumber:"1234-5678-9012",name:"Rajesh Kumar"}},{type:"PASSPORT_PHOTO",file:"photo.jpg",fileSize:"0.3MB"}],verificationMode:"AUTOMATED",rejectIfBlurry:true},
    [['Navigate to KYC Document Upload module','Document upload interface with drag-and-drop support'],['Upload PAN card image (front)','OCR extracts PAN: ABCPK1234M, Name: RAJESH KUMAR'],['Upload Aadhaar card image (front and back)','OCR extracts Aadhaar number, address verified'],['Upload passport-size photograph','Photo quality validated: resolution OK, face detected'],['Submit all documents for verification','Documents queued for verification, KYC status: IN_PROGRESS']],
    {endpoint:'/api/v1/kyc/documents/upload',method:'POST',headers:{'Content-Type':'multipart/form-data','Authorization':'Bearer {{token}}'},responseStatus:201,response:{kycRequestId:"KYC-2026-000042",documentsUploaded:3,ocrStatus:"COMPLETED",verificationStatus:"IN_PROGRESS",estimatedCompletion:"2026-02-27T10:00:00Z"}}
  ),
  mkUC(52,'Aadhaar/PAN Verification','P1','Compliance & KYC',
    'Real-time verification of Aadhaar and PAN against UIDAI and NSDL databases with name matching and demographic validation.',
    ['Customer consent obtained','UIDAI/NSDL API connectivity active','Valid Aadhaar/PAN format'],
    'System',
    {customerId:"CIF-2026-000001",aadhaarVerification:{aadhaarNumber:"1234-5678-9012",nameToMatch:"Rajesh Kumar",consentId:"CONSENT-2026-AA-001",otp:"******"},panVerification:{panNumber:"ABCPK1234M",nameToMatch:"RAJESH KUMAR",dateOfBirth:"1990-05-15"},crossVerify:true},
    [['Initiate Aadhaar verification via UIDAI API','OTP sent to Aadhaar-linked mobile number'],['Customer enters Aadhaar OTP for authentication','OTP verified, demographic data fetched from UIDAI'],['Name matching: Customer name vs Aadhaar name','Name match score: 95% (above 80% threshold)'],['Initiate PAN verification via NSDL API','PAN status: ACTIVE, name matched with database'],['Cross-verify Aadhaar-PAN linkage','Aadhaar-PAN linked confirmed, compliance requirement met']],
    {endpoint:'/api/v1/kyc/verify',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{customerId:"CIF-2026-000001",aadhaarVerified:true,aadhaarNameMatch:95,panVerified:true,panStatus:"ACTIVE",panAadhaarLinked:true,verificationId:"VRF-2026-000089"}}
  ),
  mkUC(53,'Video KYC Process','P1','Compliance & KYC',
    'Conduct video-based KYC verification with live face matching, document display, geo-location capture, and recording for audit compliance.',
    ['Customer has smartphone with camera','Internet bandwidth sufficient','VKYC agent available','RBI VKYC guidelines configured'],
    'Customer',
    {customerId:"CIF-2026-000001",scheduledSlot:"2026-02-26T14:00:00Z",agentId:"VKYC-AGENT-005",verificationSteps:["FACE_MATCH","DOCUMENT_DISPLAY","LIVELINESS_CHECK","GEO_LOCATION","RANDOM_QUESTION"],documentsToShow:["PAN_CARD","AADHAAR_CARD"],expectedDuration:10,recordingEnabled:true,consentForRecording:true},
    [['Customer joins VKYC session at scheduled time','Video call connected with VKYC agent'],['Agent verifies live face against photo on file','Face match confidence: 97%, liveness check passed'],['Customer displays PAN card to camera','PAN details captured from video, OCR validated'],['Customer displays Aadhaar card to camera','Aadhaar details captured, cross-referenced with submitted documents'],['Agent asks random verification question and completes VKYC','VKYC completed, recording saved, KYC status updated to VERIFIED']],
    {endpoint:'/api/v1/kyc/video/complete',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{vkycSessionId:"VKYC-2026-000034",status:"COMPLETED",faceMatchScore:97,livenessCheck:true,agentVerdict:"APPROVED",recordingId:"REC-2026-VKYC-034",kycStatus:"VERIFIED"}}
  ),
  mkUC(54,'AML Transaction Screening','P1','Compliance & KYC',
    'Screen transactions against AML rules engine for suspicious patterns including structuring, rapid movement, high-risk country transfers, and unusual amounts.',
    ['Transaction data available','AML rules engine configured','Screening thresholds set','Alert routing configured'],
    'System',
    {transactionId:"TXN-2026-INT-000042",customerId:"CIF-2026-000001",transactionDetails:{type:"OUTWARD_REMITTANCE",amount:480000,currency:"USD",destination:"CAYMAN_ISLANDS",beneficiary:"Offshore Trading Corp"},screeningRules:["HIGH_RISK_COUNTRY","AMOUNT_THRESHOLD","VELOCITY_CHECK","PEP_CHECK","SANCTIONS_CHECK"],riskThreshold:"MEDIUM"},
    [['Transaction submitted for AML screening','AML engine receives transaction for real-time screening'],['Check against high-risk country list','ALERT: Cayman Islands is high-risk jurisdiction'],['Check amount against reporting threshold','Amount $480K triggers enhanced due diligence threshold'],['Run velocity check: frequency and volume analysis','3 international transfers in 7 days flagged'],['Generate AML alert for compliance review','HIGH risk alert generated, transaction held for manual review']],
    {endpoint:'/api/v1/compliance/aml/screen',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{screeningId:"AML-SCR-2026-000042",riskScore:85,riskLevel:"HIGH",alertsTriggered:["HIGH_RISK_COUNTRY","AMOUNT_THRESHOLD","VELOCITY"],action:"HOLD_FOR_REVIEW",reviewDeadline:"2026-02-27T10:00:00Z",assignedTo:"COMPLIANCE-TEAM-A"}}
  ),
  mkUC(55,'Suspicious Transaction Report (STR)','P1','Compliance & KYC',
    'File Suspicious Transaction Report with FIU-IND for transactions flagged by AML screening with complete transaction trail and reason narrative.',
    ['AML alert confirmed as suspicious','Investigation completed','Compliance officer authorized','FIU-IND portal credentials valid'],
    'Manager',
    {alertId:"AML-SCR-2026-000042",customerId:"CIF-2026-000001",reportType:"STR",suspiciousTransactions:[{transactionId:"TXN-2026-INT-000042",amount:480000,currency:"USD",date:"2026-02-20"},{transactionId:"TXN-2026-INT-000038",amount:490000,currency:"USD",date:"2026-02-15"}],reasonCode:"STRUCTURING_SUSPECTED",narrative:"Multiple high-value international transfers to high-risk jurisdiction within short period suggesting potential layering",filingDate:"2026-02-26",filedBy:"CO-2026-001"},
    [['Compliance officer reviews AML alert details','Full transaction trail displayed with customer profile'],['Compile suspicious transactions into STR package','Two related transactions identified totaling $970K'],['Draft STR narrative with reason codes','Structured narrative: suspected layering through high-risk jurisdiction'],['Submit STR to FIU-IND portal','STR filed electronically, FIU acknowledgment received'],['Update internal records and flag customer for enhanced monitoring','Customer risk category upgraded, enhanced monitoring activated']],
    {endpoint:'/api/v1/compliance/str/file',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:201,response:{strId:"STR-2026-000008",fiuAcknowledgment:"FIU-ACK-2026-02-26-0042",filingStatus:"ACCEPTED",transactionsReported:2,totalAmount:970000,customerRiskUpgraded:true}}
  ),
  mkUC(56,'FATCA Declaration','P2','Compliance & KYC',
    'Capture Foreign Account Tax Compliance Act declaration from customer for US tax reporting obligations and information exchange.',
    ['Customer account active','Annual FATCA review due','Customer has potential US indicia'],
    'Customer',
    {customerId:"CIF-2026-000001",declarationType:"ANNUAL_REVIEW",usPersonStatus:false,usIndicia:{usPhoneNumber:false,usBirthPlace:false,usAddress:false,usGreenCard:false,usPowerOfAttorney:false,standingInstructionToUS:false},declarationDate:"2026-02-26",selfCertification:true,w9Form:null,w8BenForm:{completed:true,formId:"W8BEN-2026-0089"},taxResidency:[{country:"INDIA",tin:"ABCPK1234M"}]},
    [['Navigate to FATCA Declaration module','FATCA self-certification form displayed'],['Answer US indicia questions (all NO)','No US indicia identified, low FATCA risk'],['Declare tax residency: India with PAN as TIN','Tax residency captured with identification number'],['Submit W-8BEN form for non-US person','W-8BEN form uploaded and linked to customer profile'],['Complete FATCA declaration','Declaration saved, next review scheduled for Feb 2027']],
    {endpoint:'/api/v1/compliance/fatca/declare',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{declarationId:"FATCA-2026-000042",customerId:"CIF-2026-000001",usPersonStatus:false,fatcaCompliant:true,nextReviewDate:"2027-02-26",w8BenStatus:"VALID",status:"DECLARED"}}
  ),
  mkUC(57,'PEP Screening','P1','Compliance & KYC',
    'Screen customer against Politically Exposed Persons database with relationship mapping, risk scoring, and enhanced due diligence triggers.',
    ['Customer data available','PEP database updated','Screening rules configured','Fuzzy matching enabled'],
    'System',
    {customerId:"CIF-2026-000001",screeningData:{fullName:"Rajesh Kumar",dateOfBirth:"1990-05-15",nationality:"INDIAN",occupation:"Senior Engineer",employer:"Infosys Ltd"},screeningDatabases:["WORLD_CHECK","DOW_JONES","INTERNAL_PEP_LIST"],fuzzyMatchThreshold:85,includeRelatives:true,includeAssociates:true},
    [['Submit customer data for PEP screening','Screening request sent to 3 databases simultaneously'],['World-Check returns 0 exact matches, 2 fuzzy matches','Fuzzy matches reviewed: score 62% and 58% (below 85% threshold)'],['Dow Jones returns 0 matches','No PEP association found in Dow Jones database'],['Internal PEP list returns 0 matches','No hits against internal politically exposed persons list'],['Generate PEP screening clearance report','Customer cleared, no PEP association, low risk assigned']],
    {endpoint:'/api/v1/compliance/pep/screen',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{screeningId:"PEP-SCR-2026-000042",customerId:"CIF-2026-000001",pepStatus:"NOT_PEP",exactMatches:0,fuzzyMatches:2,maxFuzzyScore:62,clearanceStatus:"CLEARED",screeningDate:"2026-02-26",nextScreeningDue:"2027-02-26"}}
  ),
  mkUC(58,'Sanctions List Check','P1','Compliance & KYC',
    'Screen customer and transaction parties against OFAC, UN, EU, and India MHA sanctions lists with real-time blocking for positive matches.',
    ['Sanctions lists updated daily','Customer/beneficiary data available','Real-time screening enabled'],
    'System',
    {screeningType:"CUSTOMER",entityData:{name:"Rajesh Kumar",nationality:"INDIAN",dateOfBirth:"1990-05-15",passportNumber:"P1234567"},sanctionsLists:["OFAC_SDN","UN_CONSOLIDATED","EU_SANCTIONS","INDIA_MHA","UK_HMT"],matchThreshold:90,blockOnMatch:true},
    [['Submit entity data for sanctions screening','Real-time screening initiated across 5 sanctions lists'],['OFAC SDN list check: 0 matches','No match found in US OFAC Specially Designated Nationals list'],['UN Consolidated list check: 0 matches','No match in United Nations sanctions list'],['EU and India MHA list check: 0 matches each','Clean against EU sanctions and India MHA DTAA list'],['Generate sanctions clearance certificate','All clear, no sanctions matches, transaction may proceed']],
    {endpoint:'/api/v1/compliance/sanctions/check',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{screeningId:"SAN-SCR-2026-000042",entityName:"Rajesh Kumar",sanctionStatus:"CLEAR",listsChecked:5,matchesFound:0,action:"PROCEED",clearanceValidUntil:"2026-02-27T10:00:00Z"}}
  ),
  mkUC(59,'Risk Category Assignment','P1','Compliance & KYC',
    'Assign or reassess customer risk category based on KYC profile, transaction patterns, geography, product usage, and compliance history.',
    ['Customer profile complete','Transaction history available','Risk scoring model configured','Periodic review due'],
    'System',
    {customerId:"CIF-2026-000001",riskFactors:{kycStatus:"VERIFIED",pepStatus:"NOT_PEP",sanctionsStatus:"CLEAR",occupation:"SALARIED",incomeSource:"EMPLOYMENT",geography:"LOW_RISK",productComplexity:"STANDARD",transactionVolume:"MODERATE",internationalActivity:false,adverseMedia:false},currentRiskCategory:"LOW",reviewType:"PERIODIC_ANNUAL",overrideAllowed:true},
    [['Initiate risk assessment for customer','Risk scoring model loaded with current customer data'],['Evaluate KYC and compliance factors: all clean','KYC score: 90/100, compliance score: 95/100'],['Evaluate transaction behavior factors','Transaction score: 80/100 (moderate volume, domestic only)'],['Calculate composite risk score','Composite score: 88/100 = LOW RISK category'],['Assign risk category and set next review date','Risk: LOW maintained, EDD not required, next review: Feb 2027']],
    {endpoint:'/api/v1/compliance/risk/assess',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{customerId:"CIF-2026-000001",previousRisk:"LOW",assignedRisk:"LOW",compositeScore:88,eddRequired:false,nextReviewDate:"2027-02-26",assessmentId:"RISK-2026-000042"}}
  ),
  mkUC(60,'Regulatory Report Generation','P2','Compliance & KYC',
    'Generate regulatory reports including CTR, STR summary, FATCA report, and RBI returns with automated data compilation and submission tracking.',
    ['Reporting period data available','Report templates configured','Submission portal credentials valid','Compliance officer authorized'],
    'Manager',
    {reportType:"CTR_MONTHLY",reportingPeriod:{from:"2026-02-01",to:"2026-02-28"},reportParameters:{includeAllBranches:true,thresholdAmount:1000000,currency:"INR",includeStructuredTransactions:true},outputFormat:"XML",submissionPortal:"FIU_GOAML",generatedBy:"CO-2026-001"},
    [['Navigate to Regulatory Reports module','Report type selection with calendar period picker'],['Select CTR Monthly Report for February 2026','Report parameters displayed with configurable thresholds'],['System compiles all cash transactions > Rs 10L','Data extracted: 234 CTR-eligible transactions found'],['Generate XML report in FIU goAML format','Report generated with 234 records, file size: 2.3MB'],['Submit to FIU-IND portal and archive locally','Report submitted, acknowledgment received, archived with reference']],
    {endpoint:'/api/v1/compliance/reports/generate',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer {{token}}'},responseStatus:200,response:{reportId:"REG-RPT-2026-FEB-CTR",reportType:"CTR_MONTHLY",period:"Feb-2026",transactionsIncluded:234,fileFormat:"XML",submissionStatus:"SUBMITTED",fiuAcknowledgment:"FIU-ACK-RPT-2026-0028",archivedAt:"/reports/2026/02/CTR_FEB2026.xml"}}
  )
];

const STATUS_COLORS = {
  'Not Started': '#666',
  'In Progress': '#f0a500',
  'Passed': '#4ecca3',
  'Failed': '#e74c3c'
};

const PRIORITY_COLORS = { P1: '#e74c3c', P2: '#f0a500', P3: '#3498db' };

const UseCaseEditor = () => {
  const [activeCategory, setActiveCategory] = useState('Customer Operations');
  const [selectedUC, setSelectedUC] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ucStatuses, setUcStatuses] = useState(() => {
    const m = {};
    USE_CASES.forEach(uc => { m[uc.id] = 'Not Started'; });
    return m;
  });
  const [editedTestData, setEditedTestData] = useState({});
  const [editedSteps, setEditedSteps] = useState({});
  const [jsonValid, setJsonValid] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [runResult, setRunResult] = useState(null);
  const [showDefect, setShowDefect] = useState(false);
  const [defectSeverity, setDefectSeverity] = useState('Major');
  const [dividerPos, setDividerPos] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setDividerPos(Math.min(Math.max(pct, 20), 70));
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const getTestData = (uc) => editedTestData[uc.id] !== undefined ? editedTestData[uc.id] : uc.testData;
  const getSteps = (uc) => editedSteps[uc.id] !== undefined ? editedSteps[uc.id] : uc.steps.map(s => ({...s}));

  const filteredUCs = USE_CASES.filter(uc => {
    if (uc.category !== activeCategory) return false;
    if (statusFilter !== 'All' && ucStatuses[uc.id] !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return uc.id.toLowerCase().includes(term) || uc.title.toLowerCase().includes(term);
    }
    return true;
  });

  const totalTested = Object.values(ucStatuses).filter(s => s === 'Passed' || s === 'Failed').length;

  const validateJSON = () => {
    if (!selectedUC) return;
    try { JSON.parse(getTestData(selectedUC)); setJsonValid(true); } catch { setJsonValid(false); }
  };

  const resetTestData = () => {
    if (!selectedUC) return;
    const copy = {...editedTestData};
    delete copy[selectedUC.id];
    setEditedTestData(copy);
    setJsonValid(null);
  };

  const updateStep = (idx, field, value) => {
    if (!selectedUC) return;
    const steps = getSteps(selectedUC).map(s => ({...s}));
    steps[idx] = {...steps[idx], [field]: value};
    setEditedSteps({...editedSteps, [selectedUC.id]: steps});
  };

  const addStep = () => {
    if (!selectedUC) return;
    const steps = getSteps(selectedUC).map(s => ({...s}));
    steps.push({num: steps.length+1, action:'New action', expected:'Expected result', status:'Not Run'});
    setEditedSteps({...editedSteps, [selectedUC.id]: steps});
  };

  const removeStep = (idx) => {
    if (!selectedUC) return;
    let steps = getSteps(selectedUC).filter((_,i) => i !== idx);
    steps = steps.map((s,i) => ({...s, num: i+1}));
    setEditedSteps({...editedSteps, [selectedUC.id]: steps});
  };

  const runTest = () => {
    if (!selectedUC || isRunning) return;
    setIsRunning(true);
    setRunProgress(0);
    setRunResult(null);
    setShowDefect(false);
    const startTime = new Date();
    const steps = getSteps(selectedUC).map(s => ({...s}));
    let i = 0;
    const interval = setInterval(() => {
      i++;
      const pct = Math.min((i / (steps.length * 2)) * 100, 100);
      setRunProgress(pct);
      if (i <= steps.length) {
        const passed = Math.random() > 0.15;
        steps[i-1] = {...steps[i-1], status: passed ? 'Pass' : 'Fail'};
        setEditedSteps(prev => ({...prev, [selectedUC.id]: [...steps]}));
      }
      if (i >= steps.length * 2) {
        clearInterval(interval);
        const endTime = new Date();
        const hasFail = steps.some(s => s.status === 'Fail');
        const status = hasFail ? 'Failed' : 'Passed';
        setRunResult({startTime: startTime.toISOString(), endTime: endTime.toISOString(), duration: ((endTime - startTime)/1000).toFixed(1)+'s', status});
        setUcStatuses(prev => ({...prev, [selectedUC.id]: status === 'Passed' ? 'Passed' : 'Failed'}));
        setIsRunning(false);
      }
    }, 400);
  };

  const markAs = (status) => {
    if (!selectedUC) return;
    setUcStatuses(prev => ({...prev, [selectedUC.id]: status}));
    if (runResult) setRunResult({...runResult, status});
  };

  const exportResults = () => {
    const data = USE_CASES.map(uc => ({
      id: uc.id, title: uc.title, category: uc.category, priority: uc.priority,
      status: ucStatuses[uc.id],
      steps: getSteps(uc),
      testData: getTestData(uc)
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'test-results.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const copyRequest = () => {
    if (!selectedUC) return;
    const api = selectedUC.api;
    const req = `${api.method} ${api.endpoint}\n${JSON.stringify(api.headers,null,2)}\n\n${getTestData(selectedUC)}`;
    navigator.clipboard.writeText(req).catch(() => {});
  };

  const S = {
    container: {display:'flex',flexDirection:'column',height:'100vh',background:'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',color:'#e0e0e0',fontFamily:'-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif',overflow:'hidden'},
    topBar: {display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px',borderBottom:'1px solid rgba(78,204,163,0.3)',background:'rgba(15,52,96,0.6)',backdropFilter:'blur(10px)',flexShrink:0},
    topTitle: {fontSize:'20px',fontWeight:700,color:'#fff',margin:0},
    topRight: {display:'flex',alignItems:'center',gap:'12px'},
    progressWrap: {display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#aaa'},
    progressBar: {width:'160px',height:'8px',background:'#1a1a2e',borderRadius:'4px',overflow:'hidden'},
    progressFill: {height:'100%',background:'linear-gradient(90deg,#4ecca3,#38b58b)',borderRadius:'4px',transition:'width 0.3s'},
    exportBtn: {padding:'8px 16px',background:'#4ecca3',color:'#0a0a1a',border:'none',borderRadius:'6px',fontSize:'13px',fontWeight:600,cursor:'pointer'},
    body: {display:'flex',flex:1,overflow:'hidden',position:'relative'},
    leftPanel: {display:'flex',flexDirection:'column',overflow:'hidden',borderRight:'none'},
    searchBox: {padding:'10px 14px',borderBottom:'1px solid rgba(78,204,163,0.2)'},
    searchInput: {width:'100%',padding:'8px 12px',background:'#0a0a1a',border:'1px solid rgba(78,204,163,0.3)',borderRadius:'6px',color:'#e0e0e0',fontSize:'13px',outline:'none',boxSizing:'border-box'},
    filterRow: {display:'flex',gap:'6px',padding:'8px 14px',borderBottom:'1px solid rgba(78,204,163,0.2)',flexWrap:'wrap'},
    filterBtn: (active) => ({padding:'4px 10px',borderRadius:'12px',border:'1px solid rgba(78,204,163,0.3)',background:active?'#4ecca3':'transparent',color:active?'#0a0a1a':'#aaa',fontSize:'11px',cursor:'pointer',fontWeight:active?600:400}),
    tabs: {display:'flex',flexWrap:'wrap',gap:'4px',padding:'10px 14px',borderBottom:'1px solid rgba(78,204,163,0.2)'},
    tab: (active) => ({padding:'6px 10px',borderRadius:'6px',border:'1px solid '+(active?'#4ecca3':'rgba(78,204,163,0.2)'),background:active?'rgba(78,204,163,0.15)':'transparent',color:active?'#4ecca3':'#aaa',fontSize:'11px',cursor:'pointer',fontWeight:active?600:400,whiteSpace:'nowrap'}),
    ucList: {flex:1,overflowY:'auto',padding:'8px'},
    ucCard: (sel) => ({padding:'12px',marginBottom:'6px',background:sel?'rgba(78,204,163,0.12)':'rgba(15,52,96,0.5)',border:'1px solid '+(sel?'#4ecca3':'rgba(78,204,163,0.15)'),borderRadius:'8px',cursor:'pointer',transition:'all 0.2s'}),
    ucId: {fontSize:'11px',color:'#4ecca3',fontWeight:600},
    ucTitle: {fontSize:'13px',color:'#fff',margin:'4px 0 6px',fontWeight:500},
    ucMeta: {display:'flex',gap:'8px',alignItems:'center'},
    badge: (color) => ({padding:'2px 8px',borderRadius:'10px',fontSize:'10px',fontWeight:600,background:color+'22',color:color,border:'1px solid '+color+'44'}),
    divider: {width:'6px',cursor:'col-resize',background:'rgba(78,204,163,0.2)',flexShrink:0,transition:'background 0.2s'},
    rightPanel: {display:'flex',flexDirection:'column',overflow:'hidden',background:'rgba(10,10,26,0.3)'},
    rightScroll: {flex:1,overflowY:'auto',padding:'20px'},
    emptyRight: {display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'#666',fontSize:'16px'},
    section: {marginBottom:'24px'},
    sectionTitle: {fontSize:'16px',fontWeight:700,color:'#4ecca3',marginBottom:'12px',display:'flex',alignItems:'center',gap:'8px'},
    detailGrid: {display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'},
    detailItem: {padding:'10px',background:'rgba(15,52,96,0.5)',borderRadius:'6px',border:'1px solid rgba(78,204,163,0.15)'},
    detailLabel: {fontSize:'11px',color:'#888',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.5px'},
    detailValue: {fontSize:'14px',color:'#fff'},
    preList: {margin:'8px 0 0',paddingLeft:'20px',fontSize:'13px',lineHeight:'1.8',color:'#ccc'},
    editorWrap: {position:'relative'},
    editor: {width:'100%',minHeight:'200px',padding:'14px',background:'#0a0a1a',border:'1px solid rgba(78,204,163,0.3)',borderRadius:'6px',color:'#4ecca3',fontFamily:'Fira Code,Consolas,monospace',fontSize:'12px',lineHeight:'1.6',resize:'vertical',outline:'none',boxSizing:'border-box'},
    editorBtns: {display:'flex',gap:'8px',marginTop:'8px'},
    btn: (bg) => ({padding:'6px 14px',background:bg||'#4ecca3',color:bg==='transparent'?'#4ecca3':'#0a0a1a',border:'1px solid #4ecca3',borderRadius:'6px',fontSize:'12px',fontWeight:600,cursor:'pointer'}),
    jsonIndicator: (ok) => ({display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',background:ok?'#4ecca3':'#e74c3c',marginLeft:'8px'}),
    stepsTable: {width:'100%',borderCollapse:'collapse'},
    stTh: {textAlign:'left',padding:'8px 10px',background:'rgba(15,52,96,0.8)',color:'#4ecca3',fontSize:'11px',textTransform:'uppercase',borderBottom:'1px solid rgba(78,204,163,0.3)'},
    stTd: {padding:'8px 10px',borderBottom:'1px solid rgba(78,204,163,0.1)',fontSize:'12px',verticalAlign:'top'},
    stInput: {width:'100%',padding:'4px 6px',background:'#0a0a1a',border:'1px solid rgba(78,204,163,0.2)',borderRadius:'4px',color:'#e0e0e0',fontSize:'12px',outline:'none',boxSizing:'border-box'},
    stSelect: {padding:'4px 6px',background:'#0a0a1a',border:'1px solid rgba(78,204,163,0.2)',borderRadius:'4px',color:'#e0e0e0',fontSize:'11px',outline:'none'},
    removeBtn: {padding:'2px 8px',background:'#e74c3c22',color:'#e74c3c',border:'1px solid #e74c3c44',borderRadius:'4px',fontSize:'11px',cursor:'pointer'},
    apiBlock: {padding:'14px',background:'#0a0a1a',borderRadius:'6px',border:'1px solid rgba(78,204,163,0.2)',marginBottom:'10px'},
    apiMethod: (m) => ({display:'inline-block',padding:'3px 8px',borderRadius:'4px',fontSize:'11px',fontWeight:700,marginRight:'8px',background:m==='GET'?'#3498db33':m==='POST'?'#4ecca333':m==='PUT'?'#f0a50033':m==='PATCH'?'#9b59b633':'#e74c3c33',color:m==='GET'?'#3498db':m==='POST'?'#4ecca3':m==='PUT'?'#f0a500':m==='PATCH'?'#9b59b6':'#e74c3c'}),
    codeBlock: {padding:'12px',background:'#050510',borderRadius:'4px',fontFamily:'Fira Code,Consolas,monospace',fontSize:'11px',color:'#4ecca3',overflowX:'auto',whiteSpace:'pre-wrap',marginTop:'8px',maxHeight:'200px',overflowY:'auto'},
    execPanel: {padding:'16px',background:'rgba(15,52,96,0.4)',borderRadius:'8px',border:'1px solid rgba(78,204,163,0.2)'},
    progressBarLg: {width:'100%',height:'12px',background:'#1a1a2e',borderRadius:'6px',overflow:'hidden',margin:'12px 0'},
    progressFillLg: (pct, fail) => ({width:pct+'%',height:'100%',background:fail?'linear-gradient(90deg,#e74c3c,#c0392b)':'linear-gradient(90deg,#4ecca3,#38b58b)',borderRadius:'6px',transition:'width 0.3s'}),
    resultCard: (pass) => ({padding:'14px',background:pass?'rgba(78,204,163,0.1)':'rgba(231,76,60,0.1)',border:'1px solid '+(pass?'rgba(78,204,163,0.4)':'rgba(231,76,60,0.4)'),borderRadius:'8px',marginTop:'12px'}),
    resultGrid: {display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'10px'},
    resultItem: {textAlign:'center'},
    resultLabel: {fontSize:'11px',color:'#888'},
    resultValue: (color) => ({fontSize:'16px',fontWeight:700,color:color||'#fff'}),
    btnRow: {display:'flex',gap:'8px',marginTop:'10px'},
    defectForm: {padding:'16px',background:'rgba(15,52,96,0.5)',borderRadius:'8px',border:'1px solid rgba(231,76,60,0.3)',marginTop:'16px'},
    defectField: {marginBottom:'12px'},
    defectLabel: {fontSize:'12px',color:'#aaa',marginBottom:'4px',display:'block'},
    defectInput: {width:'100%',padding:'8px',background:'#0a0a1a',border:'1px solid rgba(78,204,163,0.2)',borderRadius:'4px',color:'#e0e0e0',fontSize:'12px',outline:'none',boxSizing:'border-box'},
    defectTextarea: {width:'100%',minHeight:'80px',padding:'8px',background:'#0a0a1a',border:'1px solid rgba(78,204,163,0.2)',borderRadius:'4px',color:'#e0e0e0',fontSize:'12px',outline:'none',fontFamily:'inherit',resize:'vertical',boxSizing:'border-box'},
  };

  const currentSteps = selectedUC ? getSteps(selectedUC) : [];
  const currentTestData = selectedUC ? getTestData(selectedUC) : '';

  return (
    <div style={S.container} ref={containerRef}>
      {/* TOP BAR */}
      <div style={S.topBar}>
        <h1 style={S.topTitle}>Banking Use Case Testing Editor</h1>
        <div style={S.topRight}>
          <div style={S.progressWrap}>
            <span>{totalTested}/60 tested</span>
            <div style={S.progressBar}>
              <div style={{...S.progressFill, width: (totalTested/60*100)+'%'}} />
            </div>
            <span>{Math.round(totalTested/60*100)}%</span>
          </div>
          <button style={S.exportBtn} onClick={exportResults}>Export JSON</button>
        </div>
      </div>

      {/* BODY */}
      <div style={S.body}>
        {/* LEFT PANEL */}
        <div style={{...S.leftPanel, width: dividerPos+'%'}}>
          <div style={S.searchBox}>
            <input style={S.searchInput} placeholder="Search use cases by ID or title..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
          </div>
          <div style={S.filterRow}>
            {['All','Not Started','In Progress','Passed','Failed'].map(f => (
              <button key={f} style={S.filterBtn(statusFilter===f)} onClick={()=>setStatusFilter(f)}>{f}</button>
            ))}
          </div>
          <div style={S.tabs}>
            {CATEGORIES.map(cat => (
              <button key={cat} style={S.tab(activeCategory===cat)} onClick={()=>setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>
          <div style={S.ucList}>
            {filteredUCs.length === 0 && <div style={{textAlign:'center',color:'#666',padding:'20px',fontSize:'13px'}}>No use cases match your filters</div>}
            {filteredUCs.map(uc => (
              <div key={uc.id} style={S.ucCard(selectedUC?.id === uc.id)} onClick={()=>{setSelectedUC(uc);setJsonValid(null);setRunResult(null);setShowDefect(false);setRunProgress(0);}}>
                <div style={S.ucId}>{uc.id}</div>
                <div style={S.ucTitle}>{uc.title}</div>
                <div style={S.ucMeta}>
                  <span style={S.badge(PRIORITY_COLORS[uc.priority])}>{uc.priority}</span>
                  <span style={S.badge(STATUS_COLORS[ucStatuses[uc.id]])}>{ucStatuses[uc.id]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{...S.divider, background: isDragging ? '#4ecca3' : S.divider.background}} onMouseDown={handleMouseDown} />

        {/* RIGHT PANEL */}
        <div style={{...S.rightPanel, width: (100-dividerPos)+'%'}}>
          {!selectedUC ? (
            <div style={S.emptyRight}>Select a use case from the left panel to begin</div>
          ) : (
            <div style={S.rightScroll}>
              {/* SECTION 1: Details */}
              <div style={S.section}>
                <div style={S.sectionTitle}>
                  <span style={{fontSize:'18px'}}>&#9776;</span> Use Case Details
                </div>
                <div style={S.detailGrid}>
                  <div style={S.detailItem}><div style={S.detailLabel}>ID</div><div style={S.detailValue}>{selectedUC.id}</div></div>
                  <div style={S.detailItem}><div style={S.detailLabel}>Title</div><div style={S.detailValue}>{selectedUC.title}</div></div>
                  <div style={S.detailItem}><div style={S.detailLabel}>Priority</div><div style={{...S.detailValue,color:PRIORITY_COLORS[selectedUC.priority]}}>{selectedUC.priority}</div></div>
                  <div style={S.detailItem}><div style={S.detailLabel}>Module</div><div style={S.detailValue}>{selectedUC.category}</div></div>
                  <div style={S.detailItem}><div style={S.detailLabel}>Actor</div><div style={S.detailValue}>{selectedUC.actor}</div></div>
                  <div style={S.detailItem}><div style={S.detailLabel}>Status</div><div style={{...S.detailValue,color:STATUS_COLORS[ucStatuses[selectedUC.id]]}}>{ucStatuses[selectedUC.id]}</div></div>
                </div>
                <div style={{...S.detailItem,marginTop:'10px'}}>
                  <div style={S.detailLabel}>Description</div>
                  <div style={{...S.detailValue,fontSize:'13px',lineHeight:'1.6'}}>{selectedUC.description}</div>
                </div>
                <div style={{...S.detailItem,marginTop:'10px'}}>
                  <div style={S.detailLabel}>Preconditions</div>
                  <ul style={S.preList}>{selectedUC.preconditions.map((p,i)=><li key={i}>{p}</li>)}</ul>
                </div>
              </div>

              {/* SECTION 2: Test Data Editor */}
              <div style={S.section}>
                <div style={S.sectionTitle}>
                  <span style={{fontSize:'18px'}}>&#123;&#125;</span> Test Data Editor
                  {jsonValid !== null && <span style={S.jsonIndicator(jsonValid)} title={jsonValid?'Valid JSON':'Invalid JSON'} />}
                </div>
                <div style={S.editorWrap}>
                  <textarea
                    style={S.editor}
                    value={currentTestData}
                    onChange={e => setEditedTestData({...editedTestData, [selectedUC.id]: e.target.value})}
                    spellCheck={false}
                  />
                </div>
                <div style={S.editorBtns}>
                  <button style={S.btn('#4ecca3')} onClick={validateJSON}>Validate JSON</button>
                  <button style={S.btn('transparent')} onClick={resetTestData}>Reset to Default</button>
                </div>
              </div>

              {/* SECTION 3: Test Steps */}
              <div style={S.section}>
                <div style={S.sectionTitle}>
                  <span style={{fontSize:'18px'}}>&#9745;</span> Test Steps
                </div>
                <div style={{overflowX:'auto'}}>
                  <table style={S.stepsTable}>
                    <thead>
                      <tr>
                        <th style={{...S.stTh,width:'40px'}}>#</th>
                        <th style={S.stTh}>Action</th>
                        <th style={S.stTh}>Expected Result</th>
                        <th style={{...S.stTh,width:'100px'}}>Status</th>
                        <th style={{...S.stTh,width:'60px'}}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSteps.map((step, idx) => (
                        <tr key={idx}>
                          <td style={{...S.stTd,color:'#4ecca3',fontWeight:600}}>{step.num}</td>
                          <td style={S.stTd}>
                            <input style={S.stInput} value={step.action} onChange={e=>updateStep(idx,'action',e.target.value)} />
                          </td>
                          <td style={S.stTd}>
                            <input style={S.stInput} value={step.expected} onChange={e=>updateStep(idx,'expected',e.target.value)} />
                          </td>
                          <td style={S.stTd}>
                            <select style={S.stSelect} value={step.status} onChange={e=>updateStep(idx,'status',e.target.value)}>
                              <option value="Not Run">Not Run</option>
                              <option value="Pass">Pass</option>
                              <option value="Fail">Fail</option>
                              <option value="Skip">Skip</option>
                            </select>
                          </td>
                          <td style={S.stTd}>
                            <button style={S.removeBtn} onClick={()=>removeStep(idx)}>X</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{marginTop:'8px'}}>
                  <button style={S.btn('#4ecca3')} onClick={addStep}>+ Add Step</button>
                </div>
              </div>

              {/* SECTION 4: API Request/Response */}
              <div style={S.section}>
                <div style={S.sectionTitle}>
                  <span style={{fontSize:'18px'}}>&#8644;</span> Expected API Request / Response
                </div>
                <div style={S.apiBlock}>
                  <div style={{marginBottom:'8px'}}>
                    <span style={S.apiMethod(selectedUC.api.method)}>{selectedUC.api.method}</span>
                    <span style={{color:'#fff',fontFamily:'monospace',fontSize:'13px'}}>{selectedUC.api.endpoint}</span>
                  </div>
                  <div style={{fontSize:'11px',color:'#888',marginBottom:'4px'}}>Headers:</div>
                  <div style={S.codeBlock}>{JSON.stringify(selectedUC.api.headers, null, 2)}</div>
                  <div style={{fontSize:'11px',color:'#888',marginTop:'12px',marginBottom:'4px'}}>Request Body:</div>
                  <div style={S.codeBlock}>{currentTestData}</div>
                  <div style={{fontSize:'11px',color:'#888',marginTop:'12px',marginBottom:'4px'}}>Expected Response ({selectedUC.api.responseStatus}):</div>
                  <div style={S.codeBlock}>{JSON.stringify(selectedUC.api.response, null, 2)}</div>
                </div>
                <button style={S.btn('#4ecca3')} onClick={copyRequest}>Copy Request</button>
              </div>

              {/* SECTION 5: Execution Panel */}
              <div style={S.section}>
                <div style={S.sectionTitle}>
                  <span style={{fontSize:'18px'}}>&#9654;</span> Execution Panel
                </div>
                <div style={S.execPanel}>
                  <button
                    style={{...S.btn(isRunning?'#666':'#4ecca3'),cursor:isRunning?'not-allowed':'pointer',fontSize:'14px',padding:'10px 24px'}}
                    onClick={runTest}
                    disabled={isRunning}
                  >
                    {isRunning ? 'Running...' : 'Run Test'}
                  </button>
                  {(isRunning || runResult) && (
                    <div style={S.progressBarLg}>
                      <div style={S.progressFillLg(runProgress, runResult?.status === 'Failed')} />
                    </div>
                  )}
                  {runResult && (
                    <div style={S.resultCard(runResult.status === 'Passed')}>
                      <div style={S.resultGrid}>
                        <div style={S.resultItem}>
                          <div style={S.resultLabel}>Start Time</div>
                          <div style={S.resultValue()}>{new Date(runResult.startTime).toLocaleTimeString()}</div>
                        </div>
                        <div style={S.resultItem}>
                          <div style={S.resultLabel}>End Time</div>
                          <div style={S.resultValue()}>{new Date(runResult.endTime).toLocaleTimeString()}</div>
                        </div>
                        <div style={S.resultItem}>
                          <div style={S.resultLabel}>Duration</div>
                          <div style={S.resultValue()}>{runResult.duration}</div>
                        </div>
                        <div style={S.resultItem}>
                          <div style={S.resultLabel}>Status</div>
                          <div style={S.resultValue(runResult.status==='Passed'?'#4ecca3':'#e74c3c')}>{runResult.status}</div>
                        </div>
                      </div>
                      <div style={{fontSize:'12px',color:'#aaa',marginBottom:'8px'}}>
                        Steps passed: {currentSteps.filter(s=>s.status==='Pass').length}/{currentSteps.length}
                        {currentSteps.some(s=>s.status==='Fail') && (
                          <span style={{color:'#e74c3c',marginLeft:'12px'}}>
                            Failed steps: {currentSteps.filter(s=>s.status==='Fail').map(s=>'#'+s.num).join(', ')}
                          </span>
                        )}
                      </div>
                      <div style={S.btnRow}>
                        <button style={S.btn('#4ecca3')} onClick={()=>markAs('Passed')}>Mark as Passed</button>
                        <button style={S.btn('#e74c3c')} onClick={()=>markAs('Failed')}>Mark as Failed</button>
                        {runResult.status === 'Failed' && (
                          <button style={S.btn('#f0a500')} onClick={()=>setShowDefect(true)}>Log Defect</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 6: Defect Template */}
              {showDefect && (
                <div style={S.section}>
                  <div style={S.sectionTitle}>
                    <span style={{fontSize:'18px',color:'#e74c3c'}}>&#9888;</span> Defect Report
                  </div>
                  <div style={S.defectForm}>
                    <div style={S.defectField}>
                      <label style={S.defectLabel}>Title</label>
                      <input style={S.defectInput} defaultValue={`${selectedUC.id} - ${selectedUC.title} - Failed`} />
                    </div>
                    <div style={S.defectField}>
                      <label style={S.defectLabel}>Severity</label>
                      <select style={{...S.defectInput,cursor:'pointer'}} value={defectSeverity} onChange={e=>setDefectSeverity(e.target.value)}>
                        <option value="Critical">Critical</option>
                        <option value="Major">Major</option>
                        <option value="Minor">Minor</option>
                        <option value="Trivial">Trivial</option>
                      </select>
                    </div>
                    <div style={S.defectField}>
                      <label style={S.defectLabel}>Steps to Reproduce</label>
                      <textarea style={S.defectTextarea} defaultValue={currentSteps.map(s => `${s.num}. ${s.action} -> Expected: ${s.expected} [${s.status}]`).join('\n')} />
                    </div>
                    <div style={S.defectField}>
                      <label style={S.defectLabel}>Expected Result</label>
                      <textarea style={S.defectTextarea} defaultValue={`All test steps should pass. API should return ${selectedUC.api.responseStatus} with expected response body.`} />
                    </div>
                    <div style={S.defectField}>
                      <label style={S.defectLabel}>Actual Result</label>
                      <textarea style={S.defectTextarea} defaultValue={`Test failed at step(s): ${currentSteps.filter(s=>s.status==='Fail').map(s=>'#'+s.num).join(', ')}. See execution logs for details.`} />
                    </div>
                    <div style={S.defectField}>
                      <label style={S.defectLabel}>Environment</label>
                      <input style={S.defectInput} defaultValue="UAT | Banking Core v2.1 | API Gateway v3.0 | Database: Oracle 19c" />
                    </div>
                    <div style={S.defectField}>
                      <label style={S.defectLabel}>Attachments</label>
                      <div style={{padding:'20px',border:'2px dashed rgba(78,204,163,0.3)',borderRadius:'6px',textAlign:'center',color:'#666',fontSize:'12px'}}>
                        Drag and drop files here or click to browse
                      </div>
                    </div>
                    <div style={S.btnRow}>
                      <button style={S.btn('#e74c3c')}>Submit Defect</button>
                      <button style={S.btn('transparent')} onClick={()=>setShowDefect(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UseCaseEditor;

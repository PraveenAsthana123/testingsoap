import React, { useState, useCallback } from 'react';

// ==================== DATA: Tab 1 - REST API CRUD Testing ====================
const restCrudScenarios = [
  {
    id: 'API-001', method: 'POST', severity: 'Critical',
    endpoint: '/api/customers',
    title: 'Create New Customer with Full KYC Data',
    description: 'Create a new banking customer with complete Know Your Customer (KYC) documentation including identity verification, address proof, and PAN details. This is the entry point for customer onboarding.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      'X-Request-ID': 'req-20260226-001',
      'X-Branch-Code': 'BR001'
    },
    requestBody: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      dateOfBirth: '1990-05-15',
      gender: 'Male',
      email: 'rajesh.kumar@example.com',
      mobile: '+919876543210',
      panNumber: 'ABCPK1234F',
      aadhaarNumber: '1234-5678-9012',
      address: {
        line1: '42, MG Road',
        line2: 'Near City Mall',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'IN'
      },
      kycDocuments: [
        { type: 'PAN_CARD', number: 'ABCPK1234F', verified: true },
        { type: 'AADHAAR', number: '123456789012', verified: true }
      ],
      occupation: 'Software Engineer',
      annualIncome: 1200000,
      sourceOfFunds: 'SALARY'
    },
    expectedResponse: {
      statusCode: 201,
      body: {
        customerId: 'CUS-2026-00001',
        status: 'ACTIVE',
        kycStatus: 'VERIFIED',
        createdAt: '2026-02-26T10:30:00Z',
        message: 'Customer created successfully'
      }
    },
    validationPoints: [
      'Response status code is 201 Created',
      'customerId follows format CUS-YYYY-NNNNN',
      'kycStatus is VERIFIED when all documents provided',
      'createdAt timestamp is in ISO 8601 UTC format',
      'Response includes Location header with resource URI'
    ]
  },
  {
    id: 'API-002', method: 'GET', severity: 'Critical',
    endpoint: '/api/customers/{id}',
    title: 'Retrieve Customer Details by ID',
    description: 'Fetch complete customer profile including KYC status, linked accounts, and contact information. Sensitive fields like Aadhaar should be masked.',
    requestHeaders: {
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      'Accept': 'application/json',
      'X-Request-ID': 'req-20260226-002'
    },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        customerId: 'CUS-2026-00001',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@example.com',
        mobile: '+91******3210',
        panNumber: 'ABCPK****F',
        aadhaarNumber: 'XXXX-XXXX-9012',
        kycStatus: 'VERIFIED',
        accounts: [
          { accountId: 'ACC-SAV-00001', type: 'SAVINGS', status: 'ACTIVE' }
        ],
        createdAt: '2026-02-26T10:30:00Z'
      }
    },
    validationPoints: [
      'Response status code is 200 OK',
      'Aadhaar number is masked (XXXX-XXXX-9012)',
      'PAN number is partially masked',
      'Mobile number is masked except last 4 digits',
      'Linked accounts array is populated'
    ]
  },
  {
    id: 'API-003', method: 'PUT', severity: 'High',
    endpoint: '/api/customers/{id}',
    title: 'Update Customer Address and Phone',
    description: 'Update customer contact details including residential address and mobile number. Triggers re-verification workflow for address changes.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      'X-Request-ID': 'req-20260226-003',
      'If-Match': '"v2-etag-abc123"'
    },
    requestBody: {
      mobile: '+919876543211',
      address: {
        line1: '101, Brigade Road',
        line2: 'Apt 5B',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560025',
        country: 'IN'
      },
      addressProof: {
        type: 'UTILITY_BILL',
        documentId: 'DOC-2026-789'
      }
    },
    expectedResponse: {
      statusCode: 200,
      body: {
        customerId: 'CUS-2026-00001',
        message: 'Customer details updated successfully',
        addressVerificationStatus: 'PENDING_REVERIFICATION',
        updatedAt: '2026-02-26T11:00:00Z',
        version: 'v3-etag-def456'
      }
    },
    validationPoints: [
      'Response status code is 200 OK',
      'Address verification status changes to PENDING_REVERIFICATION',
      'ETag version is incremented in response',
      'updatedAt reflects current timestamp',
      'Audit trail entry created for address change'
    ]
  },
  {
    id: 'API-004', method: 'DELETE', severity: 'Critical',
    endpoint: '/api/customers/{id}',
    title: 'Soft Delete Customer (Deactivate)',
    description: 'Deactivate a customer account. This is a soft delete - customer data is retained for regulatory compliance but all accounts are frozen.',
    requestHeaders: {
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      'X-Request-ID': 'req-20260226-004',
      'X-Reason-Code': 'CUSTOMER_REQUEST'
    },
    requestBody: {
      reason: 'Customer requested account closure',
      closureType: 'VOLUNTARY',
      finalSettlement: true
    },
    expectedResponse: {
      statusCode: 200,
      body: {
        customerId: 'CUS-2026-00001',
        status: 'DEACTIVATED',
        deactivatedAt: '2026-02-26T12:00:00Z',
        dataRetentionUntil: '2033-02-26T12:00:00Z',
        message: 'Customer deactivated successfully. Data retained per regulatory requirements.'
      }
    },
    validationPoints: [
      'Response status code is 200 (not 204 since body returned)',
      'Status changes to DEACTIVATED (not hard deleted)',
      'Data retention period is 7 years from deactivation',
      'All linked accounts are frozen automatically',
      'Subsequent GET returns 404 for deactivated customer'
    ]
  },
  {
    id: 'API-005', method: 'POST', severity: 'Critical',
    endpoint: '/api/accounts',
    title: 'Open New Savings/Current Account',
    description: 'Open a new bank account linked to an existing customer. Validates minimum balance requirements and generates a unique account number.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      'X-Request-ID': 'req-20260226-005',
      'X-Idempotency-Key': 'idem-acc-20260226-001'
    },
    requestBody: {
      customerId: 'CUS-2026-00001',
      accountType: 'SAVINGS',
      currency: 'INR',
      branchCode: 'BR001',
      initialDeposit: 10000.00,
      nomineeDetails: {
        name: 'Priya Kumar',
        relationship: 'SPOUSE',
        mobile: '+919876543299'
      },
      preferences: {
        eStatement: true,
        smsAlerts: true,
        debitCard: true
      }
    },
    expectedResponse: {
      statusCode: 201,
      body: {
        accountId: 'ACC-SAV-00001',
        accountNumber: '1234567890123456',
        ifscCode: 'BANK0BR001',
        accountType: 'SAVINGS',
        balance: 10000.00,
        status: 'ACTIVE',
        createdAt: '2026-02-26T10:45:00Z',
        debitCardStatus: 'REQUESTED'
      }
    },
    validationPoints: [
      'Response status code is 201 Created',
      'Account number is 16 digits',
      'IFSC code follows format BANK0 + branch code',
      'Initial balance matches deposit amount',
      'Debit card request is triggered if preference set'
    ]
  },
  {
    id: 'API-006', method: 'GET', severity: 'Critical',
    endpoint: '/api/accounts/{id}/balance',
    title: 'Check Account Balance',
    description: 'Retrieve real-time account balance including available balance, lien amount, and last transaction details.',
    requestHeaders: {
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      'Accept': 'application/json',
      'X-Request-ID': 'req-20260226-006'
    },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        accountId: 'ACC-SAV-00001',
        accountNumber: '1234567890123456',
        currency: 'INR',
        currentBalance: 85000.50,
        availableBalance: 80000.50,
        lienAmount: 5000.00,
        unclearedFunds: 0.00,
        lastTransactionDate: '2026-02-25T14:30:00Z',
        lastTransactionAmount: -2500.00,
        asOf: '2026-02-26T10:50:00Z'
      }
    },
    validationPoints: [
      'Available balance = current balance - lien amount',
      'Currency code is valid ISO 4217',
      'Balance amounts have exactly 2 decimal places',
      'asOf timestamp reflects real-time query time',
      'Response time is under 200ms SLA'
    ]
  },
  {
    id: 'API-007', method: 'POST', severity: 'Critical',
    endpoint: '/api/transactions/transfer',
    title: 'Fund Transfer Between Accounts',
    description: 'Initiate a fund transfer between two accounts. Validates sufficient balance, daily limits, and beneficiary details before processing.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      'X-Request-ID': 'req-20260226-007',
      'X-Idempotency-Key': 'idem-txn-20260226-001',
      'X-Transaction-PIN': 'encrypted:AES256:...'
    },
    requestBody: {
      fromAccount: 'ACC-SAV-00001',
      toAccount: 'ACC-SAV-00099',
      amount: 25000.00,
      currency: 'INR',
      transferType: 'IMPS',
      remarks: 'Rent payment February 2026',
      beneficiary: {
        name: 'Amit Sharma',
        accountNumber: '9876543210123456',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank'
      }
    },
    expectedResponse: {
      statusCode: 200,
      body: {
        transactionId: 'TXN-2026-0226-00001',
        status: 'SUCCESS',
        debitedAmount: 25000.00,
        creditedAmount: 25000.00,
        charges: 0.00,
        gst: 0.00,
        referenceNumber: 'IMPS-26022600001',
        timestamp: '2026-02-26T11:00:00Z',
        updatedBalance: 60000.50
      }
    },
    validationPoints: [
      'Transaction ID is unique and follows naming convention',
      'Debited amount matches requested amount',
      'Sender balance is reduced by transfer amount + charges',
      'IMPS reference number is generated',
      'Idempotency key prevents duplicate transfers on retry'
    ]
  },
  {
    id: 'API-008', method: 'GET', severity: 'High',
    endpoint: '/api/transactions?accountId=ACC-SAV-00001&from=2026-01-01&to=2026-02-26',
    title: 'Transaction History with Date Range',
    description: 'Retrieve paginated transaction history for an account within a specified date range. Supports filtering by transaction type and amount range.',
    requestHeaders: {
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      'Accept': 'application/json',
      'X-Request-ID': 'req-20260226-008'
    },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        accountId: 'ACC-SAV-00001',
        totalTransactions: 47,
        page: 1,
        pageSize: 20,
        totalPages: 3,
        transactions: [
          {
            transactionId: 'TXN-2026-0226-00001',
            date: '2026-02-26T11:00:00Z',
            type: 'DEBIT',
            description: 'IMPS Transfer - Rent payment',
            amount: -25000.00,
            balance: 60000.50,
            referenceNumber: 'IMPS-26022600001'
          },
          {
            transactionId: 'TXN-2026-0225-00015',
            date: '2026-02-25T09:00:00Z',
            type: 'CREDIT',
            description: 'Salary Credit - ABC Corp',
            amount: 85000.00,
            balance: 85000.50,
            referenceNumber: 'NEFT-25022600012'
          }
        ]
      }
    },
    validationPoints: [
      'Transactions are sorted by date descending (newest first)',
      'Pagination metadata is correct (totalPages = ceil(total/pageSize))',
      'Date range filter is inclusive of from and to dates',
      'DEBIT amounts are negative, CREDIT amounts are positive',
      'Running balance is consistent across transactions'
    ]
  },
  {
    id: 'API-009', method: 'PATCH', severity: 'High',
    endpoint: '/api/accounts/{id}/status',
    title: 'Freeze/Unfreeze Account',
    description: 'Change account operational status. Freeze blocks all debit transactions while allowing credits. Used for fraud prevention or legal holds.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      'X-Request-ID': 'req-20260226-009',
      'X-Approver-ID': 'EMP-MGR-001'
    },
    requestBody: {
      status: 'FROZEN',
      reason: 'Suspected fraudulent activity',
      freezeType: 'DEBIT_FREEZE',
      effectiveFrom: '2026-02-26T12:00:00Z',
      referenceTicket: 'FRAUD-2026-00123'
    },
    expectedResponse: {
      statusCode: 200,
      body: {
        accountId: 'ACC-SAV-00001',
        previousStatus: 'ACTIVE',
        currentStatus: 'FROZEN',
        freezeType: 'DEBIT_FREEZE',
        frozenAt: '2026-02-26T12:00:00Z',
        frozenBy: 'EMP-MGR-001',
        message: 'Account frozen. Only credit transactions permitted.'
      }
    },
    validationPoints: [
      'Status transitions follow valid state machine (ACTIVE -> FROZEN)',
      'Freeze type correctly restricts only debit operations',
      'Approver ID is recorded in audit log',
      'SMS/Email notification triggered to account holder',
      'Subsequent debit attempts return 403 with freeze reason'
    ]
  },
  {
    id: 'API-010', method: 'POST', severity: 'Critical',
    endpoint: '/api/loans/apply',
    title: 'Submit Loan Application',
    description: 'Submit a new loan application with financial details. Triggers automated credit scoring, document verification, and eligibility assessment.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      'X-Request-ID': 'req-20260226-010',
      'X-Idempotency-Key': 'idem-loan-20260226-001'
    },
    requestBody: {
      customerId: 'CUS-2026-00001',
      loanType: 'PERSONAL_LOAN',
      requestedAmount: 500000.00,
      tenure: 36,
      purpose: 'Home Renovation',
      employment: {
        type: 'SALARIED',
        employer: 'ABC Tech Pvt Ltd',
        monthlyIncome: 100000,
        yearsOfExperience: 8
      },
      existingLoans: [
        { type: 'HOME_LOAN', emi: 25000, remainingTenure: 120 }
      ],
      collateral: null
    },
    expectedResponse: {
      statusCode: 201,
      body: {
        applicationId: 'LOAN-2026-00001',
        status: 'UNDER_REVIEW',
        creditScore: 742,
        eligibleAmount: 450000.00,
        offeredInterestRate: 10.5,
        estimatedEMI: 14637.00,
        processingFee: 4500.00,
        nextStep: 'DOCUMENT_UPLOAD',
        expiresAt: '2026-03-28T23:59:59Z'
      }
    },
    validationPoints: [
      'Application ID follows LOAN-YYYY-NNNNN format',
      'Credit score is fetched and populated automatically',
      'Eligible amount considers existing EMI obligations',
      'EMI calculation matches standard reducing balance formula',
      'Application expires in 30 days if documents not uploaded'
    ]
  }
];


// ==================== DATA: Tab 2 - SOAP API Testing ====================
const soapScenarios = [
  {
    id: 'SOAP-001', method: 'POST', severity: 'Critical',
    endpoint: 'https://banking.example.com/ws/AccountService?wsdl',
    title: 'GetAccountBalance SOAP Request/Response',
    description: 'SOAP web service call to retrieve account balance using the AccountService WSDL. Uses WS-Security UsernameToken for authentication.',
    soapAction: 'http://banking.example.com/GetAccountBalance',
    requestHeaders: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://banking.example.com/GetAccountBalance',
      'X-Request-ID': 'soap-req-001'
    },
    requestBody: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:acc="http://banking.example.com/AccountService">
  <soapenv:Header>
    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
      <wsse:UsernameToken>
        <wsse:Username>BankAPIUser</wsse:Username>
        <wsse:Password Type="PasswordDigest">a1b2c3d4e5f6...</wsse:Password>
        <wsse:Nonce>dGVzdE5vbmNl</wsse:Nonce>
        <wsu:Created xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">2026-02-26T10:00:00Z</wsu:Created>
      </wsse:UsernameToken>
    </wsse:Security>
  </soapenv:Header>
  <soapenv:Body>
    <acc:GetAccountBalanceRequest>
      <acc:AccountNumber>1234567890123456</acc:AccountNumber>
      <acc:BranchCode>BR001</acc:BranchCode>
    </acc:GetAccountBalanceRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
    expectedResponse: {
      statusCode: 200,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <GetAccountBalanceResponse xmlns="http://banking.example.com/AccountService">
      <Status>SUCCESS</Status>
      <AccountNumber>1234567890123456</AccountNumber>
      <CurrentBalance>85000.50</CurrentBalance>
      <AvailableBalance>80000.50</AvailableBalance>
      <Currency>INR</Currency>
      <LienAmount>5000.00</LienAmount>
      <AsOfTimestamp>2026-02-26T10:00:05Z</AsOfTimestamp>
    </GetAccountBalanceResponse>
  </soapenv:Body>
</soapenv:Envelope>`
    },
    validationPoints: [
      'XPath //Status = "SUCCESS"',
      'XPath //CurrentBalance is numeric with 2 decimal places',
      'AvailableBalance = CurrentBalance - LienAmount',
      'WS-Security header is validated (PasswordDigest)',
      'Response time under 500ms for balance inquiry'
    ]
  },
  {
    id: 'SOAP-002', method: 'POST', severity: 'Critical',
    endpoint: 'https://banking.example.com/ws/TransferService?wsdl',
    title: 'FundTransfer SOAP Operation',
    description: 'SOAP service for initiating fund transfers between accounts. Supports NEFT, RTGS, and IMPS modes with WS-Security and WS-Addressing.',
    soapAction: 'http://banking.example.com/FundTransfer',
    requestHeaders: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://banking.example.com/FundTransfer'
    },
    requestBody: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:txn="http://banking.example.com/TransferService">
  <soapenv:Header>
    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
      <wsse:UsernameToken>
        <wsse:Username>TransferUser</wsse:Username>
        <wsse:Password Type="PasswordDigest">x9y8z7w6v5...</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </soapenv:Header>
  <soapenv:Body>
    <txn:FundTransferRequest>
      <txn:DebitAccount>1234567890123456</txn:DebitAccount>
      <txn:CreditAccount>9876543210123456</txn:CreditAccount>
      <txn:Amount>25000.00</txn:Amount>
      <txn:Currency>INR</txn:Currency>
      <txn:TransferMode>IMPS</txn:TransferMode>
      <txn:Remarks>Rent Payment Feb 2026</txn:Remarks>
      <txn:BeneficiaryName>Amit Sharma</txn:BeneficiaryName>
      <txn:BeneficiaryIFSC>HDFC0001234</txn:BeneficiaryIFSC>
    </txn:FundTransferRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
    expectedResponse: {
      statusCode: 200,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <FundTransferResponse xmlns="http://banking.example.com/TransferService">
      <Status>SUCCESS</Status>
      <TransactionId>TXN-IMPS-2026022600001</TransactionId>
      <ReferenceNumber>IMPS226022600001</ReferenceNumber>
      <DebitedAmount>25000.00</DebitedAmount>
      <TransferCharges>0.00</TransferCharges>
      <GST>0.00</GST>
      <Timestamp>2026-02-26T11:00:00Z</Timestamp>
    </FundTransferResponse>
  </soapenv:Body>
</soapenv:Envelope>`
    },
    validationPoints: [
      'XPath //Status = "SUCCESS"',
      'TransactionId contains transfer mode prefix',
      'DebitedAmount matches requested amount',
      'IMPS transfers processed within 30 seconds',
      'Fault envelope returned for insufficient balance'
    ]
  },
  {
    id: 'SOAP-003', method: 'POST', severity: 'High',
    endpoint: 'https://banking.example.com/ws/CustomerService?wsdl',
    title: 'GetCustomerProfile SOAP Call',
    description: 'Retrieve complete customer profile via SOAP service including personal details, linked accounts, KYC status, and communication preferences.',
    soapAction: 'http://banking.example.com/GetCustomerProfile',
    requestHeaders: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://banking.example.com/GetCustomerProfile'
    },
    requestBody: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:cust="http://banking.example.com/CustomerService">
  <soapenv:Header>
    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
      <wsse:UsernameToken>
        <wsse:Username>CustServiceUser</wsse:Username>
        <wsse:Password Type="PasswordDigest">m3n4o5p6...</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </soapenv:Header>
  <soapenv:Body>
    <cust:GetCustomerProfileRequest>
      <cust:CustomerId>CUS-2026-00001</cust:CustomerId>
      <cust:IncludeAccounts>true</cust:IncludeAccounts>
      <cust:IncludeKYC>true</cust:IncludeKYC>
    </cust:GetCustomerProfileRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
    expectedResponse: {
      statusCode: 200,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <GetCustomerProfileResponse xmlns="http://banking.example.com/CustomerService">
      <Status>SUCCESS</Status>
      <Customer>
        <CustomerId>CUS-2026-00001</CustomerId>
        <Name>Rajesh Kumar</Name>
        <Email>rajesh.kumar@example.com</Email>
        <Mobile>+91XXXXXX3210</Mobile>
        <KYCStatus>VERIFIED</KYCStatus>
        <Accounts>
          <Account>
            <AccountNumber>1234567890123456</AccountNumber>
            <Type>SAVINGS</Type>
            <Status>ACTIVE</Status>
          </Account>
        </Accounts>
      </Customer>
    </GetCustomerProfileResponse>
  </soapenv:Body>
</soapenv:Envelope>`
    },
    validationPoints: [
      'XPath //Customer/CustomerId matches request',
      'Mobile number is masked in response',
      'KYCStatus returns valid enum value',
      'Accounts node populated when IncludeAccounts=true',
      'SOAP Fault returned for invalid CustomerId'
    ]
  },
  {
    id: 'SOAP-004', method: 'POST', severity: 'High',
    endpoint: 'https://banking.example.com/ws/DepositService?wsdl',
    title: 'CreateFixedDeposit SOAP Request',
    description: 'Create a new Fixed Deposit by debiting from savings account. Calculates maturity amount based on tenure and applicable interest rate.',
    soapAction: 'http://banking.example.com/CreateFixedDeposit',
    requestHeaders: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://banking.example.com/CreateFixedDeposit'
    },
    requestBody: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:dep="http://banking.example.com/DepositService">
  <soapenv:Body>
    <dep:CreateFixedDepositRequest>
      <dep:CustomerId>CUS-2026-00001</dep:CustomerId>
      <dep:SourceAccount>1234567890123456</dep:SourceAccount>
      <dep:Amount>100000.00</dep:Amount>
      <dep:TenureMonths>12</dep:TenureMonths>
      <dep:InterestPayoutMode>ON_MATURITY</dep:InterestPayoutMode>
      <dep:AutoRenew>true</dep:AutoRenew>
      <dep:NomineeName>Priya Kumar</dep:NomineeName>
    </dep:CreateFixedDepositRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
    expectedResponse: {
      statusCode: 200,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <CreateFixedDepositResponse xmlns="http://banking.example.com/DepositService">
      <Status>SUCCESS</Status>
      <FDNumber>FD-2026-00001</FDNumber>
      <Principal>100000.00</Principal>
      <InterestRate>7.10</InterestRate>
      <MaturityDate>2027-02-26</MaturityDate>
      <MaturityAmount>107100.00</MaturityAmount>
      <CreatedAt>2026-02-26T12:00:00Z</CreatedAt>
    </CreateFixedDepositResponse>
  </soapenv:Body>
</soapenv:Envelope>`
    },
    validationPoints: [
      'FD number generated in sequential format',
      'Interest rate matches current slab for tenure',
      'Maturity amount = Principal + (Principal * Rate * Tenure/12) / 100',
      'Source account debited by FD amount',
      'Auto-renewal flag stored correctly'
    ]
  },
  {
    id: 'SOAP-005', method: 'POST', severity: 'High',
    endpoint: 'https://banking.example.com/ws/LoanService?wsdl',
    title: 'LoanEMICalculation SOAP Service',
    description: 'Calculate EMI for a loan based on principal, interest rate, and tenure. Returns detailed amortization schedule for the first 3 months.',
    soapAction: 'http://banking.example.com/CalculateEMI',
    requestHeaders: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://banking.example.com/CalculateEMI'
    },
    requestBody: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:loan="http://banking.example.com/LoanService">
  <soapenv:Body>
    <loan:CalculateEMIRequest>
      <loan:PrincipalAmount>500000.00</loan:PrincipalAmount>
      <loan:AnnualInterestRate>10.5</loan:AnnualInterestRate>
      <loan:TenureMonths>36</loan:TenureMonths>
      <loan:LoanType>PERSONAL_LOAN</loan:LoanType>
    </loan:CalculateEMIRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
    expectedResponse: {
      statusCode: 200,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <CalculateEMIResponse xmlns="http://banking.example.com/LoanService">
      <Status>SUCCESS</Status>
      <MonthlyEMI>16237.00</MonthlyEMI>
      <TotalInterest>84532.00</TotalInterest>
      <TotalPayable>584532.00</TotalPayable>
      <AmortizationPreview>
        <Month number="1">
          <EMI>16237.00</EMI>
          <Principal>11987.00</Principal>
          <Interest>4250.00</Interest>
          <Outstanding>488013.00</Outstanding>
        </Month>
        <Month number="2">
          <EMI>16237.00</EMI>
          <Principal>12089.00</Principal>
          <Interest>4148.00</Interest>
          <Outstanding>475924.00</Outstanding>
        </Month>
      </AmortizationPreview>
    </CalculateEMIResponse>
  </soapenv:Body>
</soapenv:Envelope>`
    },
    validationPoints: [
      'EMI calculated using reducing balance formula',
      'TotalPayable = (EMI * TenureMonths)',
      'TotalInterest = TotalPayable - PrincipalAmount',
      'Monthly interest component decreases over time',
      'Monthly principal component increases over time'
    ]
  },
  {
    id: 'SOAP-006', method: 'POST', severity: 'High',
    endpoint: 'https://banking.example.com/ws/TransactionService?wsdl',
    title: 'GetTransactionHistory SOAP with Date Filters',
    description: 'Retrieve transaction history for a given account within a date range via SOAP. Supports pagination and transaction type filtering.',
    soapAction: 'http://banking.example.com/GetTransactionHistory',
    requestHeaders: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://banking.example.com/GetTransactionHistory'
    },
    requestBody: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:txn="http://banking.example.com/TransactionService">
  <soapenv:Body>
    <txn:GetTransactionHistoryRequest>
      <txn:AccountNumber>1234567890123456</txn:AccountNumber>
      <txn:FromDate>2026-01-01</txn:FromDate>
      <txn:ToDate>2026-02-26</txn:ToDate>
      <txn:TransactionType>ALL</txn:TransactionType>
      <txn:PageNumber>1</txn:PageNumber>
      <txn:PageSize>10</txn:PageSize>
    </txn:GetTransactionHistoryRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
    expectedResponse: {
      statusCode: 200,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <GetTransactionHistoryResponse xmlns="http://banking.example.com/TransactionService">
      <Status>SUCCESS</Status>
      <TotalRecords>47</TotalRecords>
      <PageNumber>1</PageNumber>
      <TotalPages>5</TotalPages>
      <Transactions>
        <Transaction>
          <TransactionId>TXN-2026-0226-00001</TransactionId>
          <Date>2026-02-26</Date>
          <Type>DEBIT</Type>
          <Amount>25000.00</Amount>
          <Description>IMPS Transfer - Rent</Description>
          <Balance>60000.50</Balance>
        </Transaction>
      </Transactions>
    </GetTransactionHistoryResponse>
  </soapenv:Body>
</soapenv:Envelope>`
    },
    validationPoints: [
      'XPath //TotalRecords returns correct count',
      'Transactions within date range only',
      'Pagination metadata is accurate',
      'Transactions sorted by date descending',
      'SOAP Fault for invalid date range (from > to)'
    ]
  },
  {
    id: 'SOAP-007', method: 'POST', severity: 'Medium',
    endpoint: 'https://banking.example.com/ws/ValidationService?wsdl',
    title: 'ValidateIFSC SOAP Service',
    description: 'Validate IFSC code and retrieve associated bank branch details. Used for beneficiary validation before fund transfers.',
    soapAction: 'http://banking.example.com/ValidateIFSC',
    requestHeaders: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://banking.example.com/ValidateIFSC'
    },
    requestBody: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:val="http://banking.example.com/ValidationService">
  <soapenv:Body>
    <val:ValidateIFSCRequest>
      <val:IFSCCode>HDFC0001234</val:IFSCCode>
    </val:ValidateIFSCRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
    expectedResponse: {
      statusCode: 200,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <ValidateIFSCResponse xmlns="http://banking.example.com/ValidationService">
      <Status>VALID</Status>
      <BankName>HDFC Bank</BankName>
      <BranchName>MG Road Branch</BranchName>
      <City>Bangalore</City>
      <State>Karnataka</State>
      <MICR>560240002</MICR>
      <NEFT>true</NEFT>
      <RTGS>true</RTGS>
      <IMPS>true</IMPS>
    </ValidateIFSCResponse>
  </soapenv:Body>
</soapenv:Envelope>`
    },
    validationPoints: [
      'IFSC format validated (4 chars bank + 0 + 6 chars branch)',
      'Branch details populated for valid IFSC',
      'Payment mode availability flags returned',
      'SOAP Fault with code INVALID_IFSC for bad codes',
      'Response cached for repeated lookups (performance)'
    ]
  },
  {
    id: 'SOAP-008', method: 'POST', severity: 'High',
    endpoint: 'https://banking.example.com/ws/CreditService?wsdl',
    title: 'CheckCreditScore SOAP Operation',
    description: 'Fetch credit score from bureau via SOAP service. Returns CIBIL score, score factors, and credit summary for loan eligibility assessment.',
    soapAction: 'http://banking.example.com/CheckCreditScore',
    requestHeaders: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://banking.example.com/CheckCreditScore'
    },
    requestBody: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:cred="http://banking.example.com/CreditService">
  <soapenv:Body>
    <cred:CheckCreditScoreRequest>
      <cred:PANNumber>ABCPK1234F</cred:PANNumber>
      <cred:FullName>Rajesh Kumar</cred:FullName>
      <cred:DateOfBirth>1990-05-15</cred:DateOfBirth>
      <cred:Purpose>PERSONAL_LOAN</cred:Purpose>
    </cred:CheckCreditScoreRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
    expectedResponse: {
      statusCode: 200,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <CheckCreditScoreResponse xmlns="http://banking.example.com/CreditService">
      <Status>SUCCESS</Status>
      <CreditScore>742</CreditScore>
      <ScoreRange>300-900</ScoreRange>
      <Rating>GOOD</Rating>
      <Factors>
        <Factor>Timely repayment history (positive)</Factor>
        <Factor>High credit utilization ratio (negative)</Factor>
        <Factor>Long credit history (positive)</Factor>
      </Factors>
      <ActiveLoans>2</ActiveLoans>
      <TotalOutstanding>1500000.00</TotalOutstanding>
      <ReportDate>2026-02-26</ReportDate>
    </CheckCreditScoreResponse>
  </soapenv:Body>
</soapenv:Envelope>`
    },
    validationPoints: [
      'Credit score within valid range 300-900',
      'Rating maps correctly to score (>750=Excellent, >700=Good)',
      'Score factors array is populated',
      'PAN number validated before bureau call',
      'Response cached for 30 days per RBI guidelines'
    ]
  },
  {
    id: 'SOAP-009', method: 'POST', severity: 'High',
    endpoint: 'https://banking.example.com/ws/StatementService?wsdl',
    title: 'GenerateAccountStatement SOAP Request',
    description: 'Generate and retrieve account statement in PDF/XML format for a specified period. Used for regulatory compliance and customer requests.',
    soapAction: 'http://banking.example.com/GenerateStatement',
    requestHeaders: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://banking.example.com/GenerateStatement'
    },
    requestBody: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:stmt="http://banking.example.com/StatementService">
  <soapenv:Body>
    <stmt:GenerateStatementRequest>
      <stmt:AccountNumber>1234567890123456</stmt:AccountNumber>
      <stmt:FromDate>2026-01-01</stmt:FromDate>
      <stmt:ToDate>2026-02-26</stmt:ToDate>
      <stmt:Format>PDF</stmt:Format>
      <stmt:IncludeSummary>true</stmt:IncludeSummary>
    </stmt:GenerateStatementRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
    expectedResponse: {
      statusCode: 200,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <GenerateStatementResponse xmlns="http://banking.example.com/StatementService">
      <Status>SUCCESS</Status>
      <StatementId>STMT-2026-00001</StatementId>
      <Format>PDF</Format>
      <FileSize>245678</FileSize>
      <DownloadURL>https://banking.example.com/statements/STMT-2026-00001.pdf</DownloadURL>
      <Summary>
        <OpeningBalance>15000.50</OpeningBalance>
        <TotalCredits>170000.00</TotalCredits>
        <TotalDebits>100000.00</TotalDebits>
        <ClosingBalance>85000.50</ClosingBalance>
        <TransactionCount>47</TransactionCount>
      </Summary>
      <GeneratedAt>2026-02-26T13:00:00Z</GeneratedAt>
    </GenerateStatementResponse>
  </soapenv:Body>
</soapenv:Envelope>`
    },
    validationPoints: [
      'ClosingBalance = OpeningBalance + TotalCredits - TotalDebits',
      'Download URL is valid and accessible',
      'PDF is password-protected for security',
      'Statement period matches requested date range',
      'Transaction count matches actual records'
    ]
  },
  {
    id: 'SOAP-010', method: 'POST', severity: 'High',
    endpoint: 'https://banking.example.com/ws/KYCService?wsdl',
    title: 'UpdateKYCDetails SOAP Operation',
    description: 'Update customer KYC information via SOAP service. Supports document re-submission and address verification triggers.',
    soapAction: 'http://banking.example.com/UpdateKYC',
    requestHeaders: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://banking.example.com/UpdateKYC'
    },
    requestBody: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:kyc="http://banking.example.com/KYCService">
  <soapenv:Body>
    <kyc:UpdateKYCRequest>
      <kyc:CustomerId>CUS-2026-00001</kyc:CustomerId>
      <kyc:Documents>
        <kyc:Document>
          <kyc:Type>ADDRESS_PROOF</kyc:Type>
          <kyc:SubType>UTILITY_BILL</kyc:SubType>
          <kyc:Number>ELEC-2026-78901</kyc:Number>
          <kyc:IssuedDate>2026-01-15</kyc:IssuedDate>
          <kyc:Base64Content>JVBERi0xLjQK...</kyc:Base64Content>
        </kyc:Document>
      </kyc:Documents>
      <kyc:UpdatedAddress>
        <kyc:Line1>101, Brigade Road</kyc:Line1>
        <kyc:City>Bangalore</kyc:City>
        <kyc:State>Karnataka</kyc:State>
        <kyc:Pincode>560025</kyc:Pincode>
      </kyc:UpdatedAddress>
    </kyc:UpdateKYCRequest>
  </soapenv:Body>
</soapenv:Envelope>`,
    expectedResponse: {
      statusCode: 200,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <UpdateKYCResponse xmlns="http://banking.example.com/KYCService">
      <Status>SUCCESS</Status>
      <KYCRequestId>KYC-UPD-2026-00001</KYCRequestId>
      <VerificationStatus>PENDING</VerificationStatus>
      <EstimatedCompletion>2026-03-05T00:00:00Z</EstimatedCompletion>
      <Message>KYC update submitted. Address verification in progress.</Message>
    </UpdateKYCResponse>
  </soapenv:Body>
</soapenv:Envelope>`
    },
    validationPoints: [
      'KYC request ID generated for tracking',
      'Verification status set to PENDING on submission',
      'Base64 document content validated and stored',
      'Address change triggers re-verification workflow',
      'Estimated completion within 7 business days'
    ]
  }
];


// ==================== DATA: Tab 3 - Authentication & Authorization ====================
const authScenarios = [
  {
    id: 'AUTH-001', method: 'POST', severity: 'Critical',
    endpoint: '/oauth/token',
    title: 'OAuth 2.0 Token Generation - Client Credentials',
    description: 'Generate access token using client_credentials grant for server-to-server API communication. Used by internal services and batch processes.',
    requestHeaders: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic Y2xpZW50X2lkOmNsaWVudF9zZWNyZXQ='
    },
    requestBody: {
      grant_type: 'client_credentials',
      scope: 'read:accounts write:transactions',
      audience: 'https://api.banking.example.com'
    },
    expectedResponse: {
      statusCode: 200,
      body: {
        access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguYmFua2luZy5jb20iLCJzdWIiOiJjbGllbnRfaWQiLCJhdWQiOiJodHRwczovL2FwaS5iYW5raW5nLmNvbSIsImV4cCI6MTc3MjA4MzYwMCwic2NvcGUiOiJyZWFkOmFjY291bnRzIHdyaXRlOnRyYW5zYWN0aW9ucyJ9...',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read:accounts write:transactions'
      }
    },
    validationPoints: [
      'Access token is a valid JWT with RS256 signature',
      'Token expires_in is exactly 3600 seconds',
      'Granted scopes match requested scopes',
      'Token payload contains iss, sub, aud, exp claims',
      'Invalid client credentials return 401'
    ]
  },
  {
    id: 'AUTH-002', method: 'POST', severity: 'Critical',
    endpoint: '/oauth/token',
    title: 'OAuth 2.0 Authorization Code Flow',
    description: 'Exchange authorization code for access and refresh tokens. Used for customer-facing mobile and web applications after user consent.',
    requestHeaders: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    requestBody: {
      grant_type: 'authorization_code',
      code: 'auth_code_abc123def456',
      redirect_uri: 'https://app.banking.com/callback',
      client_id: 'mobile_app_client',
      client_secret: 'secret_xyz789',
      code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'
    },
    expectedResponse: {
      statusCode: 200,
      body: {
        access_token: 'eyJhbGciOiJSUzI1NiJ9.eyJ1c2VyIjoiQ1VTLTIwMjYtMDAwMDEiLCJyb2xlIjoiQ1VTVE9NRVIifQ...',
        refresh_token: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...',
        token_type: 'Bearer',
        expires_in: 900,
        refresh_expires_in: 86400,
        scope: 'read:own_accounts write:own_transactions'
      }
    },
    validationPoints: [
      'Access token expires in 15 minutes (900s) for user tokens',
      'Refresh token provided with longer expiry (24h)',
      'PKCE code_verifier validated against code_challenge',
      'Reusing same auth code returns 400 invalid_grant',
      'Scope is limited to customer own resources'
    ]
  },
  {
    id: 'AUTH-003', method: 'GET', severity: 'Critical',
    endpoint: '/api/accounts/ACC-SAV-00001/balance',
    title: 'JWT Token Validation - Valid Token',
    description: 'Access protected endpoint with a valid JWT token. Verifies token signature, expiry, and claims before granting access.',
    requestHeaders: {
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguYmFua2luZy5jb20iLCJzdWIiOiJDVVMtMjAyNi0wMDAwMSIsInJvbGUiOiJDVVNUT01FUiIsImV4cCI6MTc3MjA4NzIwMH0.valid_signature',
      'Accept': 'application/json'
    },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        accountId: 'ACC-SAV-00001',
        currentBalance: 85000.50,
        availableBalance: 80000.50
      }
    },
    validationPoints: [
      'Valid token returns 200 with account data',
      'Token issuer matches expected auth server',
      'Token subject matches the account owner',
      'Response includes X-RateLimit-Remaining header',
      'Token validated against public key from JWKS endpoint'
    ]
  },
  {
    id: 'AUTH-004', method: 'GET', severity: 'Critical',
    endpoint: '/api/accounts/ACC-SAV-00001/balance',
    title: 'JWT Token Validation - Expired Token',
    description: 'Attempt to access protected endpoint with an expired JWT token. System should return 401 with clear error message and token refresh guidance.',
    requestHeaders: {
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2NzI1MzE2MDAsInN1YiI6IkNVUy0yMDI2LTAwMDAxIn0.expired_sig',
      'Accept': 'application/json'
    },
    requestBody: null,
    expectedResponse: {
      statusCode: 401,
      body: {
        detail: 'Access token has expired',
        error_code: 'TOKEN_EXPIRED',
        hint: 'Use refresh token to obtain a new access token',
        correlation_id: 'corr-auth-004'
      }
    },
    validationPoints: [
      'Response status is 401 Unauthorized',
      'Error code specifically identifies TOKEN_EXPIRED',
      'WWW-Authenticate header includes error=invalid_token',
      'Response body suggests token refresh',
      'No account data leaked in error response'
    ]
  },
  {
    id: 'AUTH-005', method: 'GET', severity: 'Critical',
    endpoint: '/api/accounts/ACC-SAV-00001/balance',
    title: 'JWT Token Validation - Tampered Token',
    description: 'Attempt access with a JWT token that has been modified (payload tampered). Signature verification should fail.',
    requestHeaders: {
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJBRE1JTiIsInJvbGUiOiJTVVBFUl9BRE1JTiJ9.original_sig_for_different_payload',
      'Accept': 'application/json'
    },
    requestBody: null,
    expectedResponse: {
      statusCode: 401,
      body: {
        detail: 'Invalid token signature',
        error_code: 'INVALID_TOKEN',
        correlation_id: 'corr-auth-005'
      }
    },
    validationPoints: [
      'Tampered token is rejected with 401',
      'Error identifies signature validation failure',
      'Security event logged with alert level HIGH',
      'IP address recorded for security monitoring',
      'Rate limiting applied after 3 invalid token attempts'
    ]
  },
  {
    id: 'AUTH-006', method: 'GET', severity: 'High',
    endpoint: '/api/v1/admin/users',
    title: 'API Key Authentication',
    description: 'Access admin endpoint using API key header. Tests both valid and invalid API key scenarios for server-to-server authentication.',
    requestHeaders: {
      'X-API-Key': 'api-key-sample-abc123def456ghi789',
      'Accept': 'application/json'
    },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        users: [
          { userId: 'USR-001', role: 'ADMIN', status: 'ACTIVE' }
        ],
        total: 15
      }
    },
    validationPoints: [
      'Valid API key returns 200 with data',
      'Invalid API key returns 401 with INVALID_API_KEY error',
      'Missing X-API-Key header returns 401',
      'API key permissions checked (read-only key cannot write)',
      'API key usage logged for audit trail'
    ]
  },
  {
    id: 'AUTH-007', method: 'POST', severity: 'Critical',
    endpoint: '/oauth/token',
    title: 'Token Refresh Flow',
    description: 'Exchange a valid refresh token for new access and refresh tokens. Old refresh token should be invalidated (rotation).',
    requestHeaders: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    requestBody: {
      grant_type: 'refresh_token',
      refresh_token: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...',
      client_id: 'mobile_app_client',
      client_secret: 'secret_xyz789'
    },
    expectedResponse: {
      statusCode: 200,
      body: {
        access_token: 'eyJhbGciOiJSUzI1NiJ9.new_access_token_payload...',
        refresh_token: 'bmV3X3JlZnJlc2hfdG9rZW4...',
        token_type: 'Bearer',
        expires_in: 900
      }
    },
    validationPoints: [
      'New access token issued with fresh expiry',
      'New refresh token issued (token rotation)',
      'Old refresh token is invalidated after use',
      'Reusing old refresh token revokes all tokens (security)',
      'Refresh token family tracked for leak detection'
    ]
  },
  {
    id: 'AUTH-008', method: 'POST', severity: 'Critical',
    endpoint: '/api/transactions/transfer',
    title: 'Role-Based Access Control (RBAC)',
    description: 'Test role-based permissions. A CUSTOMER role should be able to transfer from own accounts but not access admin endpoints. TELLER can initiate on behalf.',
    requestHeaders: {
      'Authorization': 'Bearer eyJ...role:CUSTOMER...',
      'Content-Type': 'application/json'
    },
    requestBody: {
      fromAccount: 'ACC-SAV-00001',
      toAccount: 'ACC-SAV-00099',
      amount: 5000.00
    },
    expectedResponse: {
      statusCode: 200,
      body: {
        transactionId: 'TXN-2026-0226-00005',
        status: 'SUCCESS',
        message: 'Transfer completed'
      }
    },
    validationPoints: [
      'CUSTOMER role: can transfer from own accounts (200)',
      'CUSTOMER role: cannot access /api/admin/* (403)',
      'TELLER role: can initiate transfer on behalf of customer',
      'ADMIN role: full access to all endpoints',
      'Role escalation attempt (modifying JWT role claim) returns 401'
    ]
  },
  {
    id: 'AUTH-009', method: 'GET', severity: 'High',
    endpoint: '/api/accounts/ACC-SAV-00001/balance',
    title: 'Scope-Based Authorization',
    description: 'Test OAuth scope restrictions. Token with read:accounts scope can view balance but token with only write:transactions scope cannot.',
    requestHeaders: {
      'Authorization': 'Bearer eyJ...scope:write:transactions...',
      'Accept': 'application/json'
    },
    requestBody: null,
    expectedResponse: {
      statusCode: 403,
      body: {
        detail: 'Insufficient scope. Required: read:accounts',
        error_code: 'INSUFFICIENT_SCOPE',
        required_scope: 'read:accounts',
        granted_scope: 'write:transactions',
        correlation_id: 'corr-auth-009'
      }
    },
    validationPoints: [
      'Token with read:accounts scope can read balance (200)',
      'Token with only write:transactions scope gets 403',
      'Error response specifies required vs granted scopes',
      'WWW-Authenticate header includes scope parameter',
      'Scope check happens after authentication (not before)'
    ]
  },
  {
    id: 'AUTH-010', method: 'GET', severity: 'Critical',
    endpoint: '/api/customers/CUS-TENANT-B-001',
    title: 'Cross-Tenant Data Isolation',
    description: 'Verify that Tenant A user cannot access Tenant B customer data. Multi-tenancy isolation is critical for white-label banking platforms.',
    requestHeaders: {
      'Authorization': 'Bearer eyJ...tenant:TENANT_A...',
      'X-Tenant-ID': 'TENANT_A',
      'Accept': 'application/json'
    },
    requestBody: null,
    expectedResponse: {
      statusCode: 404,
      body: {
        detail: 'Customer not found',
        error_code: 'NOT_FOUND',
        correlation_id: 'corr-auth-010'
      }
    },
    validationPoints: [
      'Tenant A token cannot see Tenant B resources (404, not 403)',
      'Response does not reveal resource existence (404 not 403)',
      'Tenant ID in JWT must match X-Tenant-ID header',
      'Database queries automatically filtered by tenant_id',
      'Cross-tenant access attempt logged as security event'
    ]
  }
];

// ==================== DATA: Tab 4 - Validation & Schema Testing ====================
const validationScenarios = [
  {
    id: 'VAL-001', method: 'POST', severity: 'High',
    endpoint: '/api/customers',
    title: 'Required Field Validation - Missing Customer Name',
    description: 'Submit customer creation request with required fields missing. API should return detailed validation errors for each missing field.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_token'
    },
    requestBody: {
      email: 'test@example.com',
      mobile: '+919876543210'
    },
    expectedResponse: {
      statusCode: 400,
      body: {
        detail: 'Validation failed',
        error_code: 'VALIDATION_ERROR',
        errors: [
          { field: 'firstName', message: 'First name is required', code: 'REQUIRED' },
          { field: 'lastName', message: 'Last name is required', code: 'REQUIRED' },
          { field: 'dateOfBirth', message: 'Date of birth is required', code: 'REQUIRED' },
          { field: 'panNumber', message: 'PAN number is required for KYC', code: 'REQUIRED' }
        ]
      }
    },
    validationPoints: [
      'Response lists ALL missing required fields (not just first)',
      'Each error has field name, message, and error code',
      'Status code is 400 Bad Request',
      'Optional fields missing do not trigger errors',
      'Error messages are user-friendly and specific'
    ]
  },
  {
    id: 'VAL-002', method: 'POST', severity: 'High',
    endpoint: '/api/transactions/transfer',
    title: 'Data Type Validation - String in Amount Field',
    description: 'Submit transfer request with invalid data types. Amount field receives string instead of number, testing type coercion behavior.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_token'
    },
    requestBody: {
      fromAccount: 'ACC-SAV-00001',
      toAccount: 'ACC-SAV-00099',
      amount: 'five thousand',
      currency: 123
    },
    expectedResponse: {
      statusCode: 400,
      body: {
        detail: 'Validation failed',
        error_code: 'VALIDATION_ERROR',
        errors: [
          { field: 'amount', message: 'Amount must be a positive number', code: 'INVALID_TYPE' },
          { field: 'currency', message: 'Currency must be a string (ISO 4217)', code: 'INVALID_TYPE' }
        ]
      }
    },
    validationPoints: [
      'String value in numeric field returns INVALID_TYPE error',
      'Numeric value in string field returns INVALID_TYPE error',
      'Negative amount returns INVALID_RANGE error',
      'Zero amount returns INVALID_RANGE error',
      'Scientific notation (1e5) handling tested'
    ]
  },
  {
    id: 'VAL-003', method: 'POST', severity: 'Medium',
    endpoint: '/api/accounts',
    title: 'Field Length Validation - Account Number Exceeds Max',
    description: 'Submit data with field values exceeding maximum allowed length. Tests boundary conditions for string fields.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_token'
    },
    requestBody: {
      customerId: 'CUS-2026-00001',
      accountType: 'SAVINGS',
      branchCode: 'BR001-THIS-IS-WAY-TOO-LONG-FOR-BRANCH-CODE',
      initialDeposit: 10000,
      nomineeDetails: {
        name: 'A'.repeat(256),
        relationship: 'SPOUSE'
      }
    },
    expectedResponse: {
      statusCode: 400,
      body: {
        detail: 'Validation failed',
        error_code: 'VALIDATION_ERROR',
        errors: [
          { field: 'branchCode', message: 'Branch code must not exceed 10 characters', code: 'MAX_LENGTH' },
          { field: 'nomineeDetails.name', message: 'Nominee name must not exceed 100 characters', code: 'MAX_LENGTH' }
        ]
      }
    },
    validationPoints: [
      'Fields exceeding max length return MAX_LENGTH error',
      'Nested field paths shown correctly (nomineeDetails.name)',
      'Minimum length also validated (e.g., name >= 2 chars)',
      'Unicode characters count correctly in length check',
      'Empty string vs null handled differently'
    ]
  },
  {
    id: 'VAL-004', method: 'POST', severity: 'High',
    endpoint: '/api/customers',
    title: 'Format Validation - Invalid PAN, Email, IFSC',
    description: 'Submit customer data with incorrectly formatted fields. Tests regex-based format validation for Indian banking identifiers.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_token'
    },
    requestBody: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      dateOfBirth: '1990-05-15',
      email: 'not-a-valid-email',
      mobile: '12345',
      panNumber: 'INVALID_PAN',
      address: { pincode: 'ABCDEF' }
    },
    expectedResponse: {
      statusCode: 400,
      body: {
        detail: 'Validation failed',
        error_code: 'VALIDATION_ERROR',
        errors: [
          { field: 'email', message: 'Invalid email format', code: 'INVALID_FORMAT' },
          { field: 'mobile', message: 'Mobile must be in format +91XXXXXXXXXX', code: 'INVALID_FORMAT' },
          { field: 'panNumber', message: 'PAN must match format ABCPX1234X', code: 'INVALID_FORMAT' },
          { field: 'address.pincode', message: 'Pincode must be 6 digits', code: 'INVALID_FORMAT' }
        ]
      }
    },
    validationPoints: [
      'PAN format: 5 uppercase + 4 digits + 1 uppercase',
      'Email validated against RFC 5322 standard',
      'Mobile: country code + 10 digits',
      'Pincode: exactly 6 digits',
      'IFSC: 4 alpha + 0 + 6 alphanumeric'
    ]
  },
  {
    id: 'VAL-005', method: 'POST', severity: 'Medium',
    endpoint: '/api/accounts',
    title: 'Enum Validation - Invalid Account Type',
    description: 'Submit account creation with invalid enum values. Tests that only predefined values are accepted for enumerated fields.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_token'
    },
    requestBody: {
      customerId: 'CUS-2026-00001',
      accountType: 'BITCOIN_WALLET',
      currency: 'BTC'
    },
    expectedResponse: {
      statusCode: 400,
      body: {
        detail: 'Validation failed',
        error_code: 'VALIDATION_ERROR',
        errors: [
          { field: 'accountType', message: 'Invalid account type. Allowed: SAVINGS, CURRENT, SALARY, NRE, NRO, FD, RD', code: 'INVALID_ENUM' },
          { field: 'currency', message: 'Invalid currency. Allowed: INR, USD, EUR, GBP', code: 'INVALID_ENUM' }
        ]
      }
    },
    validationPoints: [
      'Invalid enum values list all allowed options in error',
      'Case-sensitive enum validation (savings vs SAVINGS)',
      'Null value for required enum returns REQUIRED not INVALID_ENUM',
      'Empty string returns INVALID_ENUM error',
      'Enum values defined in API spec match validation'
    ]
  },
  {
    id: 'VAL-006', method: 'GET', severity: 'Medium',
    endpoint: '/api/transactions?accountId=ACC-SAV-00001&from=2026-13-45&to=2025-01-01',
    title: 'Date Format and Range Validation',
    description: 'Submit requests with invalid date formats and logically incorrect date ranges. Tests both format and business logic validation.',
    requestHeaders: {
      'Authorization': 'Bearer valid_token',
      'Accept': 'application/json'
    },
    requestBody: null,
    expectedResponse: {
      statusCode: 400,
      body: {
        detail: 'Validation failed',
        error_code: 'VALIDATION_ERROR',
        errors: [
          { field: 'from', message: 'Invalid date format. Expected: YYYY-MM-DD', code: 'INVALID_FORMAT' },
          { field: 'dateRange', message: 'From date must be before to date', code: 'INVALID_RANGE' }
        ]
      }
    },
    validationPoints: [
      'Invalid date (month 13) returns INVALID_FORMAT',
      'From date after to date returns INVALID_RANGE',
      'Future dates rejected for transaction history',
      'Date range exceeding 1 year returns MAX_RANGE error',
      'ISO 8601 format enforced (YYYY-MM-DD)'
    ]
  },
  {
    id: 'VAL-007', method: 'POST', severity: 'Critical',
    endpoint: '/api/transactions/transfer',
    title: 'Numeric Range Validation - Amount Exceeds Daily Limit',
    description: 'Submit transfer with amount exceeding configured daily transaction limit. Tests business rule validation on numeric ranges.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_token'
    },
    requestBody: {
      fromAccount: 'ACC-SAV-00001',
      toAccount: 'ACC-SAV-00099',
      amount: 15000000.00,
      transferType: 'IMPS'
    },
    expectedResponse: {
      statusCode: 400,
      body: {
        detail: 'Transfer amount exceeds daily limit',
        error_code: 'LIMIT_EXCEEDED',
        currentDailyUsage: 25000.00,
        dailyLimit: 500000.00,
        remainingLimit: 475000.00,
        requestedAmount: 15000000.00
      }
    },
    validationPoints: [
      'Amount > daily limit returns LIMIT_EXCEEDED (not generic error)',
      'Response includes current usage and remaining limit',
      'IMPS limit (Rs 5 lakh) different from RTGS (Rs 2 lakh min)',
      'Per-transaction limit and daily cumulative limit both checked',
      'Amount with more than 2 decimal places rounded or rejected'
    ]
  },
  {
    id: 'VAL-008', method: 'POST', severity: 'High',
    endpoint: '/api/customers',
    title: 'JSON Schema Contract Validation',
    description: 'Validate that the API request body conforms to the published JSON Schema contract. Tests structural compliance with API specification.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_token'
    },
    requestBody: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      unknownField: 'should be rejected',
      address: {
        line1: '42 MG Road',
        city: 'Bangalore',
        extraNested: { illegal: true }
      }
    },
    expectedResponse: {
      statusCode: 400,
      body: {
        detail: 'Request body does not match API schema',
        error_code: 'SCHEMA_VIOLATION',
        errors: [
          { path: '$.unknownField', message: 'Additional property not allowed', code: 'ADDITIONAL_PROPERTY' },
          { path: '$.address.extraNested', message: 'Additional property not allowed', code: 'ADDITIONAL_PROPERTY' }
        ]
      }
    },
    validationPoints: [
      'Unknown top-level fields rejected if additionalProperties: false',
      'Nested unknown fields also rejected',
      'JSON path notation used in error locations',
      'Schema version referenced in error response',
      'Required nested objects validated recursively'
    ]
  },
  {
    id: 'VAL-009', method: 'GET', severity: 'High',
    endpoint: '/api/accounts/ACC-SAV-00001',
    title: 'Response Schema Validation',
    description: 'Validate that API responses conform to the documented schema. All required fields must be present with correct types.',
    requestHeaders: {
      'Authorization': 'Bearer valid_token',
      'Accept': 'application/json'
    },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        accountId: 'ACC-SAV-00001',
        accountNumber: '1234567890123456',
        accountType: 'SAVINGS',
        currency: 'INR',
        balance: 85000.50,
        status: 'ACTIVE',
        createdAt: '2026-01-15T10:00:00Z',
        _links: {
          self: '/api/accounts/ACC-SAV-00001',
          transactions: '/api/accounts/ACC-SAV-00001/transactions',
          balance: '/api/accounts/ACC-SAV-00001/balance'
        }
      }
    },
    validationPoints: [
      'All fields in OpenAPI spec are present in response',
      'Field types match spec (string, number, boolean)',
      'Date fields in ISO 8601 format',
      'Enum fields contain only defined values',
      'HATEOAS links present for resource navigation'
    ]
  },
  {
    id: 'VAL-010', method: 'POST', severity: 'Medium',
    endpoint: '/api/transactions/transfer',
    title: 'Content-Type Header Validation',
    description: 'Send request with incorrect or missing Content-Type header. API should reject non-JSON content types for JSON endpoints.',
    requestHeaders: {
      'Content-Type': 'text/plain',
      'Authorization': 'Bearer valid_token'
    },
    requestBody: 'This is plain text not JSON',
    expectedResponse: {
      statusCode: 415,
      body: {
        detail: 'Unsupported media type. Expected: application/json',
        error_code: 'UNSUPPORTED_MEDIA_TYPE'
      }
    },
    validationPoints: [
      'text/plain Content-Type returns 415',
      'application/xml returns 415 for JSON-only endpoints',
      'Missing Content-Type header returns 415',
      'application/json with charset=utf-8 is accepted',
      'multipart/form-data only accepted on upload endpoints'
    ]
  }
];


// ==================== DATA: Tab 5 - Error Handling & Negative Testing ====================
const errorScenarios = [
  {
    id: 'ERR-001', method: 'POST', severity: 'High',
    endpoint: '/api/transactions/transfer',
    title: '400 Bad Request - Malformed JSON Body',
    description: 'Send request with invalid JSON syntax (missing quotes, trailing commas, unclosed brackets). API should return clear parse error.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: '{ fromAccount: ACC-SAV-00001, amount: 5000, }  // INVALID JSON',
    expectedResponse: {
      statusCode: 400,
      body: { detail: 'Malformed JSON in request body', error_code: 'MALFORMED_REQUEST', correlation_id: 'corr-err-001' }
    },
    validationPoints: [
      'Malformed JSON returns 400 (not 500 server error)',
      'Error message indicates JSON parse failure',
      'Correlation ID present for debugging',
      'No stack trace leaked in response',
      'Empty request body also returns 400'
    ]
  },
  {
    id: 'ERR-002', method: 'GET', severity: 'Critical',
    endpoint: '/api/accounts/ACC-SAV-00001/balance',
    title: '401 Unauthorized - Missing/Invalid Token',
    description: 'Access protected endpoint without authentication token or with invalid token format. Tests authentication gate.',
    requestHeaders: { 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 401,
      body: { detail: 'Authentication required', error_code: 'UNAUTHORIZED', correlation_id: 'corr-err-002' }
    },
    validationPoints: [
      'Missing Authorization header returns 401',
      'Malformed token (not JWT format) returns 401',
      'WWW-Authenticate: Bearer header present in response',
      'No resource data leaked in 401 response',
      'Consistent 401 format across all protected endpoints'
    ]
  },
  {
    id: 'ERR-003', method: 'DELETE', severity: 'Critical',
    endpoint: '/api/v1/admin/users/USR-001',
    title: '403 Forbidden - Insufficient Permissions',
    description: 'Authenticated user with CUSTOMER role attempts admin-only operation. Tests authorization layer separate from authentication.',
    requestHeaders: { 'Authorization': 'Bearer eyJ...role:CUSTOMER...', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 403,
      body: { detail: 'You do not have permission to perform this action', error_code: 'FORBIDDEN', required_role: 'ADMIN', correlation_id: 'corr-err-003' }
    },
    validationPoints: [
      'Authenticated but unauthorized returns 403 (not 401)',
      'Error specifies required permission/role',
      'Forbidden action logged as security event',
      'Response does not reveal resource existence',
      '403 distinct from 401 (authn vs authz)'
    ]
  },
  {
    id: 'ERR-004', method: 'GET', severity: 'High',
    endpoint: '/api/customers/CUS-9999-99999',
    title: '404 Not Found - Non-existent Resource',
    description: 'Request a customer/account that does not exist in the system. Tests resource lookup failure handling.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 404,
      body: { detail: 'Customer not found', error_code: 'NOT_FOUND', resource: 'Customer', identifier: 'CUS-9999-99999', correlation_id: 'corr-err-004' }
    },
    validationPoints: [
      'Non-existent resource returns 404',
      'Error identifies resource type and ID',
      'Same 404 for unauthorized access (no info leak)',
      'Deleted/deactivated resources also return 404',
      'Response does not reveal valid ID patterns'
    ]
  },
  {
    id: 'ERR-005', method: 'POST', severity: 'Medium',
    endpoint: '/api/accounts/ACC-SAV-00001/balance',
    title: '405 Method Not Allowed - Wrong HTTP Method',
    description: 'Send POST request to a GET-only endpoint. Tests HTTP method routing and Allow header in response.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: { balance: 999999 },
    expectedResponse: {
      statusCode: 405,
      body: { detail: 'Method POST not allowed on this endpoint', error_code: 'METHOD_NOT_ALLOWED' }
    },
    validationPoints: [
      'Wrong HTTP method returns 405',
      'Allow header lists permitted methods (GET, HEAD)',
      'Response body explains which methods are allowed',
      'PUT on POST-only endpoint also returns 405',
      'OPTIONS request returns allowed methods (CORS preflight)'
    ]
  },
  {
    id: 'ERR-006', method: 'POST', severity: 'High',
    endpoint: '/api/accounts',
    title: '409 Conflict - Duplicate Resource Creation',
    description: 'Attempt to create a duplicate account with same customer and type when one already exists. Tests idempotency and conflict detection.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_token',
      'X-Idempotency-Key': 'idem-duplicate-001'
    },
    requestBody: { customerId: 'CUS-2026-00001', accountType: 'SAVINGS', branchCode: 'BR001' },
    expectedResponse: {
      statusCode: 409,
      body: {
        detail: 'Customer already has an active SAVINGS account at this branch',
        error_code: 'CONFLICT',
        existingResource: '/api/accounts/ACC-SAV-00001',
        correlation_id: 'corr-err-006'
      }
    },
    validationPoints: [
      'Duplicate creation returns 409 Conflict',
      'Response references existing resource URI',
      'Idempotency key with same request returns original 201 (not 409)',
      'Idempotency key with different body returns 422',
      'Conflict check is atomic (race condition safe)'
    ]
  },
  {
    id: 'ERR-007', method: 'POST', severity: 'Medium',
    endpoint: '/api/documents/upload',
    title: '413 Payload Too Large - Oversized File Upload',
    description: 'Upload a document exceeding the maximum file size limit. Tests request body size enforcement.',
    requestHeaders: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer valid_token'
    },
    requestBody: '(Binary file data > 10MB)',
    expectedResponse: {
      statusCode: 413,
      body: {
        detail: 'Request payload too large. Maximum size: 10MB',
        error_code: 'PAYLOAD_TOO_LARGE',
        maxSize: '10MB',
        actualSize: '25MB'
      }
    },
    validationPoints: [
      'Files > 10MB rejected with 413',
      'Error shows max allowed and actual size',
      'Connection closed promptly (not after full upload)',
      'Valid file types: PDF, JPG, PNG only',
      'Empty file upload returns 400 (not 413)'
    ]
  },
  {
    id: 'ERR-008', method: 'POST', severity: 'Critical',
    endpoint: '/api/transactions/transfer',
    title: '422 Unprocessable Entity - Insufficient Balance',
    description: 'Submit a valid transfer request but with amount exceeding available balance. Tests business rule validation distinct from input validation.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: {
      fromAccount: 'ACC-SAV-00001',
      toAccount: 'ACC-SAV-00099',
      amount: 9999999.00,
      transferType: 'IMPS'
    },
    expectedResponse: {
      statusCode: 422,
      body: {
        detail: 'Insufficient balance for this transaction',
        error_code: 'INSUFFICIENT_BALANCE',
        availableBalance: 80000.50,
        requestedAmount: 9999999.00,
        shortfall: 9919998.50,
        correlation_id: 'corr-err-008'
      }
    },
    validationPoints: [
      'Business rule violation returns 422 (not 400)',
      'Available balance and shortfall amounts shown',
      'Frozen account transfer returns different error (ACCOUNT_FROZEN)',
      'Minimum balance requirement checked',
      'Transaction not partially processed (atomic)'
    ]
  },
  {
    id: 'ERR-009', method: 'POST', severity: 'High',
    endpoint: '/api/transactions/transfer',
    title: '429 Too Many Requests - Rate Limit Exceeded',
    description: 'Exceed API rate limit by sending requests above threshold. Tests rate limiting implementation and Retry-After guidance.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: { fromAccount: 'ACC-SAV-00001', toAccount: 'ACC-SAV-00099', amount: 100.00 },
    expectedResponse: {
      statusCode: 429,
      body: {
        detail: 'Rate limit exceeded. Please retry after 60 seconds.',
        error_code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: 60,
        limit: 100,
        remaining: 0,
        resetAt: '2026-02-26T12:01:00Z'
      }
    },
    validationPoints: [
      'Rate limit exceeded returns 429 with Retry-After header',
      'X-RateLimit-Limit, X-RateLimit-Remaining headers present',
      'Rate limit is per-client (API key or IP)',
      'Different rate limits for different endpoint tiers',
      'Rate limit resets after window expires'
    ]
  },
  {
    id: 'ERR-010', method: 'POST', severity: 'Critical',
    endpoint: '/api/transactions/transfer',
    title: '500/502/503 Server Error Handling',
    description: 'Test API behavior during server errors, gateway timeouts, and service unavailability. Tests graceful degradation and error reporting.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: { fromAccount: 'ACC-SAV-00001', toAccount: 'ACC-SAV-00099', amount: 1000.00 },
    expectedResponse: {
      statusCode: 503,
      body: {
        detail: 'Service temporarily unavailable. Please retry.',
        error_code: 'SERVICE_UNAVAILABLE',
        retryAfter: 30,
        correlation_id: 'corr-err-010',
        statusPage: 'https://status.banking.example.com'
      }
    },
    validationPoints: [
      '500: Internal error - no stack trace or internal details leaked',
      '502: Bad Gateway - upstream service failure, includes Retry-After',
      '503: Service Unavailable - maintenance mode, includes status page URL',
      'All 5xx errors include correlation_id for debugging',
      'Client retry strategy: exponential backoff with jitter'
    ]
  }
];


// ==================== DATA: Tab 6 - Integration Testing ====================
const integrationScenarios = [
  {
    id: 'INT-001', method: 'POST', severity: 'Critical',
    endpoint: 'Multi-Step: /api/customers -> /api/kyc -> /api/accounts',
    title: 'End-to-End Customer Onboarding Flow',
    description: 'Complete customer onboarding: create customer profile, submit KYC documents, verify identity, and open first bank account. Tests cross-service orchestration.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer admin_token', 'X-Correlation-ID': 'onboard-flow-001' },
    requestBody: {
      step1_createCustomer: { endpoint: 'POST /api/customers', body: { firstName: 'Neha', lastName: 'Patel', panNumber: 'BCDPN5678G', mobile: '+919876501234' } },
      step2_submitKYC: { endpoint: 'POST /api/kyc/CUS-2026-00002/documents', body: { documents: [{ type: 'PAN_CARD', file: 'pan_scan.pdf' }, { type: 'AADHAAR', file: 'aadhaar_scan.pdf' }] } },
      step3_verifyKYC: { endpoint: 'POST /api/kyc/CUS-2026-00002/verify', body: { verificationMethod: 'EKYC_AADHAAR' } },
      step4_openAccount: { endpoint: 'POST /api/accounts', body: { customerId: 'CUS-2026-00002', accountType: 'SAVINGS', initialDeposit: 5000.00 } }
    },
    expectedResponse: {
      statusCode: 201,
      body: {
        customerId: 'CUS-2026-00002',
        kycStatus: 'VERIFIED',
        accountId: 'ACC-SAV-00002',
        accountNumber: '2345678901234567',
        onboardingComplete: true,
        totalSteps: 4,
        completedSteps: 4
      }
    },
    validationPoints: [
      'Each step returns success before next step begins',
      'KYC must be VERIFIED before account opening allowed',
      'Correlation ID propagated across all 4 API calls',
      'Partial failure at step 3 does not create orphan account',
      'Idempotent retry of entire flow does not create duplicates'
    ]
  },
  {
    id: 'INT-002', method: 'POST', severity: 'Critical',
    endpoint: 'Multi-Step: /api/validate -> /api/debit -> /api/credit -> /api/notify',
    title: 'Fund Transfer Workflow (Debit-Credit-Notify)',
    description: 'Complete fund transfer: validate accounts, check balance, debit source, credit destination, send notifications. Tests transaction atomicity.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token', 'X-Correlation-ID': 'transfer-flow-001' },
    requestBody: {
      step1_validate: { endpoint: 'POST /api/transactions/validate', body: { from: 'ACC-SAV-00001', to: 'ACC-SAV-00099', amount: 10000.00 } },
      step2_debit: { endpoint: 'POST /api/transactions/debit', body: { account: 'ACC-SAV-00001', amount: 10000.00, txnRef: 'TXN-REF-001' } },
      step3_credit: { endpoint: 'POST /api/transactions/credit', body: { account: 'ACC-SAV-00099', amount: 10000.00, txnRef: 'TXN-REF-001' } },
      step4_notify: { endpoint: 'POST /api/notifications', body: { type: 'TRANSFER_COMPLETE', recipients: ['sender', 'receiver'] } }
    },
    expectedResponse: {
      statusCode: 200,
      body: { transactionId: 'TXN-2026-0226-00010', status: 'COMPLETED', debitConfirmed: true, creditConfirmed: true, notificationsSent: 2 }
    },
    validationPoints: [
      'If credit fails after debit, debit is reversed (saga pattern)',
      'Both accounts updated atomically (no partial transfer)',
      'SMS and email notifications sent to both parties',
      'Duplicate transfer detection via idempotency key',
      'Transfer audit trail complete with all 4 steps logged'
    ]
  },
  {
    id: 'INT-003', method: 'POST', severity: 'Critical',
    endpoint: 'Multi-Step: /api/loans/apply -> /api/credit-check -> /api/loans/approve -> /api/loans/disburse',
    title: 'Loan Application Pipeline',
    description: 'Full loan lifecycle: submit application, run credit check, generate offer, approve, and disburse to account. Tests async workflow with multiple services.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token', 'X-Correlation-ID': 'loan-flow-001' },
    requestBody: {
      step1_apply: { endpoint: 'POST /api/loans/apply', body: { customerId: 'CUS-2026-00001', loanType: 'PERSONAL', amount: 300000, tenure: 24 } },
      step2_creditCheck: { endpoint: 'POST /api/loans/LOAN-2026-00002/credit-check', body: { panNumber: 'ABCPK1234F', consent: true } },
      step3_approve: { endpoint: 'POST /api/loans/LOAN-2026-00002/approve', body: { approverEmployeeId: 'EMP-MGR-001', conditions: [] } },
      step4_disburse: { endpoint: 'POST /api/loans/LOAN-2026-00002/disburse', body: { targetAccount: 'ACC-SAV-00001', disbursementDate: '2026-02-27' } }
    },
    expectedResponse: {
      statusCode: 200,
      body: { loanId: 'LOAN-2026-00002', status: 'DISBURSED', disbursedAmount: 295500.00, processingFeeDeducted: 4500.00, emiStartDate: '2026-04-01', emiAmount: 13876.00 }
    },
    validationPoints: [
      'Credit score below 600 automatically rejects application',
      'Processing fee deducted from disbursement amount',
      'EMI schedule created with correct dates and amounts',
      'Loan account linked to customer profile',
      'Rejection at any step provides clear reason code'
    ]
  },
  {
    id: 'INT-004', method: 'POST', severity: 'High',
    endpoint: 'Multi-Step: /api/billers/search -> /api/bills/validate -> /api/bills/pay -> /api/bills/receipt',
    title: 'Bill Payment Integration',
    description: 'End-to-end bill payment: search for biller, validate bill details, execute payment, and generate receipt. Tests third-party biller integration.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token', 'X-Correlation-ID': 'bill-flow-001' },
    requestBody: {
      step1_search: { endpoint: 'GET /api/billers?category=ELECTRICITY&state=KA', body: null },
      step2_validate: { endpoint: 'POST /api/bills/validate', body: { billerId: 'BESCOM-KA', consumerNumber: 'KA-BNG-12345' } },
      step3_pay: { endpoint: 'POST /api/bills/pay', body: { billerId: 'BESCOM-KA', consumerNumber: 'KA-BNG-12345', amount: 2450.00, debitAccount: 'ACC-SAV-00001' } },
      step4_receipt: { endpoint: 'GET /api/bills/payments/BILL-PAY-001/receipt', body: null }
    },
    expectedResponse: {
      statusCode: 200,
      body: { paymentId: 'BILL-PAY-001', billerName: 'BESCOM Karnataka', amount: 2450.00, status: 'PAID', receiptNumber: 'RCPT-2026-00001', paidAt: '2026-02-26T14:00:00Z' }
    },
    validationPoints: [
      'Biller search returns active billers in specified region',
      'Bill validation fetches outstanding amount from biller',
      'Payment amount matches validated bill amount',
      'Receipt downloadable as PDF with payment details',
      'Failed biller connection returns graceful error (not 500)'
    ]
  },
  {
    id: 'INT-005', method: 'POST', severity: 'High',
    endpoint: 'Multi-Step: /api/cards/request -> /api/cards/verify -> /api/cards/generate -> /api/cards/activate',
    title: 'Card Issuance Flow',
    description: 'Complete debit/credit card issuance: request card, verify eligibility, generate card details, and activate. Tests card management system integration.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token', 'X-Correlation-ID': 'card-flow-001' },
    requestBody: {
      step1_request: { endpoint: 'POST /api/cards/request', body: { customerId: 'CUS-2026-00001', cardType: 'DEBIT', linkedAccount: 'ACC-SAV-00001', variant: 'PLATINUM' } },
      step2_verify: { endpoint: 'POST /api/cards/CARD-REQ-001/verify', body: { identityVerified: true, addressVerified: true } },
      step3_generate: { endpoint: 'POST /api/cards/CARD-REQ-001/generate', body: { deliveryMode: 'COURIER', deliveryAddress: 'registered_address' } },
      step4_activate: { endpoint: 'POST /api/cards/CARD-2026-00001/activate', body: { otp: '123456', pin: 'encrypted:AES256:...' } }
    },
    expectedResponse: {
      statusCode: 200,
      body: { cardId: 'CARD-2026-00001', maskedNumber: 'XXXX-XXXX-XXXX-4567', cardType: 'DEBIT', variant: 'PLATINUM', status: 'ACTIVE', validThru: '02/29', activatedAt: '2026-02-26T15:00:00Z' }
    },
    validationPoints: [
      'Card number is masked in all API responses',
      'PIN is encrypted in transit and at rest',
      'OTP verification required before activation',
      'Card linked to correct account',
      'Duplicate activation attempt returns 409'
    ]
  },
  {
    id: 'INT-006', method: 'POST', severity: 'High',
    endpoint: 'Multi-Step: /api/standing-instructions/create -> /api/standing-instructions/schedule -> /api/standing-instructions/execute',
    title: 'Standing Instruction Setup and Execution',
    description: 'Create recurring payment instruction, schedule execution dates, and verify automatic execution. Tests scheduler and payment engine integration.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token', 'X-Correlation-ID': 'si-flow-001' },
    requestBody: {
      step1_create: { endpoint: 'POST /api/standing-instructions', body: { customerId: 'CUS-2026-00001', debitAccount: 'ACC-SAV-00001', beneficiary: 'ACC-SAV-00099', amount: 15000.00, frequency: 'MONTHLY', startDate: '2026-03-01', endDate: '2027-02-28', purpose: 'Rent' } },
      step2_schedule: { endpoint: 'GET /api/standing-instructions/SI-2026-00001/schedule', body: null },
      step3_execute: { endpoint: 'POST /api/standing-instructions/SI-2026-00001/execute', body: { executionDate: '2026-03-01' } }
    },
    expectedResponse: {
      statusCode: 200,
      body: { siId: 'SI-2026-00001', status: 'ACTIVE', nextExecutionDate: '2026-04-01', totalScheduled: 12, executedCount: 1, lastExecutionStatus: 'SUCCESS' }
    },
    validationPoints: [
      'SI schedule has correct number of execution dates',
      'Insufficient balance on execution date marked as FAILED',
      'Retry mechanism for failed executions',
      'Customer notified before and after each execution',
      'SI auto-deactivates after end date'
    ]
  },
  {
    id: 'INT-007', method: 'POST', severity: 'Critical',
    endpoint: 'Multi-Step: NEFT/RTGS/IMPS Gateway Integration',
    title: 'Interbank Transfer (NEFT/RTGS/IMPS Flow)',
    description: 'Interbank fund transfer through payment gateway. Tests integration with RBI payment systems including NEFT batch processing and RTGS real-time settlement.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token', 'X-Correlation-ID': 'interbank-flow-001' },
    requestBody: {
      step1_validateBeneficiary: { endpoint: 'POST /api/beneficiaries/validate', body: { accountNumber: '9876543210123456', ifscCode: 'SBIN0001234', name: 'Vikram Singh' } },
      step2_initiateTransfer: { endpoint: 'POST /api/transactions/interbank', body: { from: 'ACC-SAV-00001', toAccountNumber: '9876543210123456', toIFSC: 'SBIN0001234', amount: 50000.00, mode: 'NEFT', purpose: 'P2P' } },
      step3_trackStatus: { endpoint: 'GET /api/transactions/TXN-NEFT-001/status', body: null }
    },
    expectedResponse: {
      statusCode: 200,
      body: { transactionId: 'TXN-NEFT-001', mode: 'NEFT', status: 'SETTLED', utrNumber: 'NEFT226022600001', settledAt: '2026-02-26T16:30:00Z', batchId: 'NEFT-BATCH-1630' }
    },
    validationPoints: [
      'NEFT processed in next available batch (30-min window)',
      'RTGS settles in real-time (within 30 minutes)',
      'IMPS settles instantly (within 30 seconds)',
      'UTR number generated for interbank tracking',
      'Beneficiary name mismatch triggers warning (not block)'
    ]
  },
  {
    id: 'INT-008', method: 'POST', severity: 'High',
    endpoint: 'Multi-Step: /api/accounts/close-request -> /api/accounts/settle -> /api/accounts/close',
    title: 'Account Closure Workflow',
    description: 'Complete account closure: initiate request, settle outstanding amounts (FDs, loans, standing instructions), transfer remaining balance, and close.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token', 'X-Correlation-ID': 'closure-flow-001' },
    requestBody: {
      step1_request: { endpoint: 'POST /api/accounts/ACC-SAV-00002/close-request', body: { reason: 'CUSTOMER_REQUEST', transferRemainingTo: 'ACC-SAV-00001' } },
      step2_settle: { endpoint: 'POST /api/accounts/ACC-SAV-00002/settle', body: { breakFDs: true, cancelSIs: true, waivePenalty: false } },
      step3_close: { endpoint: 'POST /api/accounts/ACC-SAV-00002/close', body: { confirmationCode: 'CLOSE-CONF-001', customerSignature: true } }
    },
    expectedResponse: {
      statusCode: 200,
      body: { accountId: 'ACC-SAV-00002', status: 'CLOSED', closedAt: '2026-02-26T17:00:00Z', settledAmount: 15000.00, transferredTo: 'ACC-SAV-00001', closureCertificate: 'CERT-CLOSE-2026-00001' }
    },
    validationPoints: [
      'All linked FDs premature closed with penalty deducted',
      'Standing instructions cancelled before closure',
      'Remaining balance transferred to designated account',
      'Closure certificate generated with reference number',
      'Account cannot be reopened once closed (returns 410 Gone)'
    ]
  },
  {
    id: 'INT-009', method: 'POST', severity: 'High',
    endpoint: 'Multi-Step: /api/deposits/validate -> /api/accounts/debit -> /api/deposits/create',
    title: 'Fixed Deposit Creation from Savings',
    description: 'Create FD by debiting savings account: validate FD parameters, debit savings, create FD, and issue certificate. Tests deposit management integration.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token', 'X-Correlation-ID': 'fd-flow-001' },
    requestBody: {
      step1_validate: { endpoint: 'POST /api/deposits/validate', body: { amount: 100000.00, tenure: 365, type: 'FIXED_DEPOSIT' } },
      step2_debit: { endpoint: 'POST /api/accounts/ACC-SAV-00001/debit', body: { amount: 100000.00, purpose: 'FD_CREATION', reference: 'FD-REF-001' } },
      step3_create: { endpoint: 'POST /api/deposits/fixed', body: { customerId: 'CUS-2026-00001', sourceAccount: 'ACC-SAV-00001', principal: 100000.00, tenureDays: 365, interestPayout: 'ON_MATURITY', autoRenew: true } }
    },
    expectedResponse: {
      statusCode: 201,
      body: { fdId: 'FD-2026-00001', principal: 100000.00, interestRate: 7.10, maturityDate: '2027-02-26', maturityAmount: 107100.00, certificateNumber: 'FD-CERT-2026-00001' }
    },
    validationPoints: [
      'Savings account debited before FD created',
      'If FD creation fails, savings debit is reversed',
      'Interest rate matches published slab for tenure',
      'FD certificate generated with unique number',
      'Minimum FD amount (Rs 1000) validated'
    ]
  },
  {
    id: 'INT-010', method: 'POST', severity: 'Critical',
    endpoint: 'Multi-Step: /api/remittance/beneficiary -> /api/remittance/compliance -> /api/remittance/forex -> /api/remittance/transfer',
    title: 'Cross-Border Remittance',
    description: 'International money transfer: add beneficiary, run compliance checks (OFAC/sanctions), get forex rate, and execute transfer. Tests multi-system integration.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token', 'X-Correlation-ID': 'remittance-flow-001' },
    requestBody: {
      step1_beneficiary: { endpoint: 'POST /api/remittance/beneficiary', body: { name: 'John Smith', country: 'US', bankName: 'Chase Bank', swiftCode: 'CHASUS33', accountNumber: '000123456789', purpose: 'FAMILY_MAINTENANCE' } },
      step2_compliance: { endpoint: 'POST /api/remittance/compliance-check', body: { beneficiaryId: 'BEN-INT-001', amount: 100000.00, currency: 'USD', senderPAN: 'ABCPK1234F' } },
      step3_forex: { endpoint: 'GET /api/forex/rate?from=INR&to=USD&amount=100000', body: null },
      step4_transfer: { endpoint: 'POST /api/remittance/transfer', body: { beneficiaryId: 'BEN-INT-001', sendAmount: 8400000.00, sendCurrency: 'INR', receiveAmount: 100000.00, receiveCurrency: 'USD', forexRate: 84.00 } }
    },
    expectedResponse: {
      statusCode: 200,
      body: { remittanceId: 'REM-2026-00001', status: 'PROCESSING', sentAmount: 8400000.00, sentCurrency: 'INR', receiveAmount: 100000.00, receiveCurrency: 'USD', forexRate: 84.00, charges: 500.00, estimatedArrival: '2026-03-01', swiftReference: 'SWIFT-REF-2026-00001' }
    },
    validationPoints: [
      'OFAC/sanctions screening passes before transfer',
      'LRS limit checked (USD 250,000 per financial year)',
      'Forex rate locked for 30 seconds during confirmation',
      'SWIFT reference generated for international tracking',
      'Form A2 auto-generated for regulatory compliance'
    ]
  }
];


// ==================== DATA: Tab 7 - Performance & Load Testing ====================
const performanceScenarios = [
  {
    id: 'PERF-001', method: 'GET', severity: 'Critical',
    endpoint: '/api/accounts/{id}/balance',
    title: 'Single Endpoint Response Time (Balance Check < 200ms)',
    description: 'Measure response time for the most frequently called API - balance inquiry. Must meet 200ms SLA under normal load for P95 percentile.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        sla: { p50: '< 50ms', p95: '< 200ms', p99: '< 500ms' },
        testConfig: { duration: '5 minutes', virtualUsers: 1, rampUp: 'none' },
        metrics: { avgResponseTime: '45ms', p50: '38ms', p95: '125ms', p99: '310ms', throughput: '150 req/s', errorRate: '0.0%' },
        k6Script: 'import http from "k6/http"; import { check, sleep } from "k6"; export default function() { const res = http.get("https://api.banking.com/api/accounts/ACC-SAV-00001/balance", { headers: { Authorization: "Bearer token" } }); check(res, { "status 200": (r) => r.status === 200, "response time < 200ms": (r) => r.timings.duration < 200 }); sleep(1); }'
      }
    },
    validationPoints: [
      'P50 response time under 50ms',
      'P95 response time under 200ms (SLA)',
      'P99 response time under 500ms',
      'Zero errors during baseline test',
      'Response time consistent across repeated runs'
    ]
  },
  {
    id: 'PERF-002', method: 'GET', severity: 'Critical',
    endpoint: '/api/accounts/{id}/balance',
    title: 'Concurrent User Load (1000 Simultaneous Balance Checks)',
    description: 'Simulate 1000 concurrent users checking balance simultaneously. Tests connection pooling, thread management, and database performance under load.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        testConfig: { duration: '10 minutes', peakUsers: 1000, rampUp: '2 minutes', steadyState: '6 minutes', rampDown: '2 minutes' },
        metrics: { avgResponseTime: '180ms', p95: '450ms', p99: '980ms', throughput: '2500 req/s', errorRate: '0.1%', concurrentConnections: 1000 },
        k6Script: 'import http from "k6/http"; export const options = { stages: [ { duration: "2m", target: 1000 }, { duration: "6m", target: 1000 }, { duration: "2m", target: 0 } ], thresholds: { http_req_duration: ["p(95)<500"], http_req_failed: ["rate<0.01"] } };'
      }
    },
    validationPoints: [
      'P95 stays under 500ms with 1000 concurrent users',
      'Error rate below 1% at peak load',
      'No connection pool exhaustion errors',
      'Database connections properly released after use',
      'Graceful degradation (no cascading failures)'
    ]
  },
  {
    id: 'PERF-003', method: 'POST', severity: 'Critical',
    endpoint: '/api/transactions/transfer',
    title: 'Bulk Transaction Processing (10,000 Transfers/Minute)',
    description: 'Process high volume of fund transfers to test throughput capacity. Simulates salary day or batch processing scenarios.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: { fromAccount: 'ACC-BULK-SENDER', toAccount: 'ACC-SAV-{random}', amount: 5000.00, transferType: 'NEFT' },
    expectedResponse: {
      statusCode: 200,
      body: {
        testConfig: { targetThroughput: '10000 txn/min', duration: '15 minutes', batchSize: 100 },
        metrics: { actualThroughput: '9850 txn/min', avgProcessingTime: '95ms', successRate: '99.8%', failedTransactions: 30, duplicatesDetected: 0, totalProcessed: 147750 },
        jmeterConfig: 'Thread Group: 200 threads, Ramp-up: 60s, Loop: infinite, Duration: 900s, Throughput Timer: 167 req/s'
      }
    },
    validationPoints: [
      'Achieved throughput >= 9500 txn/min (95% of target)',
      'Success rate above 99.5%',
      'No duplicate transactions from retry logic',
      'Database deadlocks below 0.01%',
      'Transaction ordering maintained (FIFO within account)'
    ]
  },
  {
    id: 'PERF-004', method: 'POST', severity: 'High',
    endpoint: '/api/transactions/transfer',
    title: 'API Rate Limiting Validation (100 req/min per client)',
    description: 'Verify rate limiting works correctly by exceeding the configured threshold. Tests that rate limit headers are accurate and reset properly.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: { fromAccount: 'ACC-SAV-00001', toAccount: 'ACC-SAV-00099', amount: 100.00 },
    expectedResponse: {
      statusCode: 429,
      body: {
        testConfig: { requestRate: '120 req/min', duration: '3 minutes', expectedThrottled: 60 },
        metrics: { totalRequests: 360, successfulRequests: 300, throttledRequests: 60, avgResponseBefore429: '85ms', rateLimitHeaders: { 'X-RateLimit-Limit': 100, 'X-RateLimit-Remaining': 0, 'X-RateLimit-Reset': '2026-02-26T12:01:00Z' } }
      }
    },
    validationPoints: [
      'Requests 1-100 succeed with 200 status',
      'Requests 101+ return 429 Too Many Requests',
      'Retry-After header present in 429 responses',
      'Rate limit resets at window boundary',
      'Different API keys have independent rate limits'
    ]
  },
  {
    id: 'PERF-005', method: 'GET', severity: 'High',
    endpoint: '/api/transactions?accountId=ACC-SAV-00001&from=2025-02-26&to=2026-02-26',
    title: 'Database-Heavy Query Performance (1-Year Transaction History)',
    description: 'Fetch transaction history spanning one full year. Tests database query optimization, indexing, and pagination performance for large result sets.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        testConfig: { dateRange: '365 days', estimatedRecords: 5000, pageSize: 50, totalPages: 100 },
        metrics: { firstPageTime: '180ms', lastPageTime: '220ms', avgPageTime: '195ms', totalRecords: 4823, dbQueryTime: '45ms', serializationTime: '15ms' }
      }
    },
    validationPoints: [
      'First page loads under 200ms despite large dataset',
      'Pagination performance consistent across pages',
      'Database index on (account_id, created_at) used',
      'EXPLAIN plan shows index scan, not full table scan',
      'Memory usage stable (streaming, not loading all records)'
    ]
  },
  {
    id: 'PERF-006', method: 'GET', severity: 'Medium',
    endpoint: '/api/accounts/{id}/statement?format=pdf&from=2026-01-01&to=2026-02-26',
    title: 'File Generation and Download Performance',
    description: 'Test PDF statement generation performance including data aggregation, PDF rendering, and file download. Tests CPU-intensive and I/O operations.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/pdf' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        testConfig: { concurrentGenerations: 50, statementPeriod: '2 months', avgTransactions: 100 },
        metrics: { avgGenerationTime: '2.5s', p95GenerationTime: '5s', avgFileSize: '250KB', maxFileSize: '1.2MB', concurrentCPUUsage: '75%', memoryUsage: '1.2GB' }
      }
    },
    validationPoints: [
      'PDF generation completes within 5 seconds (P95)',
      'Concurrent generation does not crash server',
      'Generated PDF is valid and properly formatted',
      'Large statements (1000+ transactions) handled gracefully',
      'Temp files cleaned up after download completes'
    ]
  },
  {
    id: 'PERF-007', method: 'GET', severity: 'High',
    endpoint: '/api/accounts/{id}/balance',
    title: 'Connection Pooling and Timeout Behavior',
    description: 'Test database connection pool under stress. Verify connection timeouts, pool exhaustion handling, and connection recycling behavior.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        testConfig: { maxPoolSize: 50, minPoolSize: 10, connectionTimeout: '5s', idleTimeout: '300s', testDuration: '10 minutes' },
        metrics: { peakConnections: 48, connectionWaits: 15, timeoutErrors: 0, avgAcquireTime: '2ms', maxAcquireTime: '4800ms', connectionsRecycled: 120 }
      }
    },
    validationPoints: [
      'Pool size never exceeds configured maximum',
      'Connection acquire timeout returns 503 (not hang)',
      'Idle connections recycled after timeout',
      'Leaked connections detected and reclaimed',
      'Pool metrics exposed via /api/health/pool endpoint'
    ]
  },
  {
    id: 'PERF-008', method: 'POST', severity: 'Critical',
    endpoint: '/api/transactions/batch',
    title: 'Peak Load Simulation (Salary Day / Month-End Batch)',
    description: 'Simulate peak banking load: salary credits, EMI debits, bill payments, and balance checks all occurring simultaneously on month-end.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: { batchType: 'SALARY_CREDITS', employerAccount: 'ACC-CORP-001', count: 5000, totalAmount: 50000000.00 },
    expectedResponse: {
      statusCode: 200,
      body: {
        testConfig: { scenario: 'Month-end peak', duration: '30 minutes', load: {
          salaryCreditThreads: 100, emiDebitThreads: 50, billPaymentThreads: 30, balanceCheckThreads: 200, totalVirtualUsers: 380
        }},
        metrics: { totalTransactions: 250000, successRate: '99.95%', avgResponseTime: '220ms', p99ResponseTime: '1200ms', peakThroughput: '8500 txn/min', cpuPeak: '85%', memoryPeak: '3.2GB', dbConnectionPeak: 48 }
      }
    },
    validationPoints: [
      'System handles 8000+ txn/min at peak',
      'Success rate above 99.9% during peak',
      'P99 response time under 2 seconds',
      'No data corruption under concurrent load',
      'System recovers gracefully after peak subsides'
    ]
  }
];


// ==================== DATA: Tab 8 - Security Testing ====================
const securityScenarios = [
  {
    id: 'SEC-001', method: 'GET', severity: 'Critical',
    endpoint: "/api/customers?name=' OR 1=1 --",
    title: 'SQL Injection in Query Parameters',
    description: "Test SQL injection vulnerability by injecting malicious SQL in query parameters. Banking APIs must use parameterized queries exclusively.",
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 400,
      body: { detail: 'Invalid characters in search parameter', error_code: 'INVALID_INPUT', correlation_id: 'corr-sec-001' }
    },
    validationPoints: [
      'SQL injection payload does not execute (returns 400, not 200 with all data)',
      'Parameterized queries used (no string concatenation)',
      'Special characters sanitized/rejected in input',
      'Database error messages never exposed to client',
      'OWASP Reference: A03:2021 - Injection'
    ]
  },
  {
    id: 'SEC-002', method: 'POST', severity: 'Critical',
    endpoint: '/api/customers',
    title: 'XSS in Request Body Fields',
    description: 'Inject JavaScript in request body fields to test for stored XSS. Input should be sanitized before storage and output encoding applied on retrieval.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: {
      firstName: '<script>alert("xss")</script>',
      lastName: '<img src=x onerror=alert(1)>',
      email: 'test@example.com',
      address: { line1: '<iframe src="evil.com"></iframe>' }
    },
    expectedResponse: {
      statusCode: 400,
      body: { detail: 'Input contains potentially unsafe content', error_code: 'UNSAFE_INPUT', sanitizedFields: ['firstName', 'lastName', 'address.line1'] }
    },
    validationPoints: [
      'HTML/script tags stripped or rejected in input',
      'Stored data does not contain executable scripts',
      'Output encoding applied (< becomes &lt;)',
      'Content-Security-Policy header prevents inline scripts',
      'OWASP Reference: A03:2021 - Injection (XSS)'
    ]
  },
  {
    id: 'SEC-003', method: 'GET', severity: 'Critical',
    endpoint: '/api/accounts/ACC-SAV-99999/balance',
    title: 'IDOR - Accessing Another Customer Account',
    description: "Insecure Direct Object Reference: Customer A tries to access Customer B's account by guessing/changing the account ID in URL.",
    requestHeaders: { 'Authorization': 'Bearer eyJ...sub:CUS-2026-00001...', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 404,
      body: { detail: 'Account not found', error_code: 'NOT_FOUND', correlation_id: 'corr-sec-003' }
    },
    validationPoints: [
      'Returns 404 (not 403) to avoid revealing account existence',
      'Server-side ownership check: token.sub must own the account',
      'Sequential/guessable IDs should be avoided (use UUIDs)',
      'Access attempt logged as security event',
      'OWASP Reference: A01:2021 - Broken Access Control'
    ]
  },
  {
    id: 'SEC-004', method: 'GET', severity: 'Critical',
    endpoint: '/api/accounts/ACC-SAV-00001/transactions',
    title: 'BOLA - Broken Object-Level Authorization',
    description: 'Test that API enforces object-level authorization. User with valid token for their own account should not access transactions of unlinked accounts.',
    requestHeaders: { 'Authorization': 'Bearer eyJ...sub:CUS-2026-00002...', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 404,
      body: { detail: 'Account not found', error_code: 'NOT_FOUND' }
    },
    validationPoints: [
      'Authorization checked at object level, not just endpoint level',
      'User CUS-00002 cannot view CUS-00001 transactions',
      'API Gateway + service both enforce ownership',
      'Batch endpoints also check per-object authorization',
      'OWASP API Top 10: API1 - Broken Object Level Authorization'
    ]
  },
  {
    id: 'SEC-005', method: 'POST', severity: 'Critical',
    endpoint: '/api/customers/CUS-2026-00001',
    title: 'Mass Assignment - Role Escalation via Request Body',
    description: 'Attempt to add admin role or modify protected fields by including unauthorized fields in the request body. Tests property-level authorization.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer eyJ...role:CUSTOMER...' },
    requestBody: {
      firstName: 'Rajesh',
      role: 'ADMIN',
      isVerified: true,
      creditLimit: 9999999,
      kycStatus: 'VERIFIED',
      internalNotes: 'Hacked via mass assignment'
    },
    expectedResponse: {
      statusCode: 200,
      body: { customerId: 'CUS-2026-00001', firstName: 'Rajesh', message: 'Only allowed fields updated. Protected fields ignored.' }
    },
    validationPoints: [
      'role field ignored (not updated to ADMIN)',
      'isVerified, creditLimit, kycStatus unchanged',
      'Only whitelisted fields accepted for update',
      'Server-side DTO/schema strips unknown fields',
      'OWASP API Top 10: API6 - Mass Assignment'
    ]
  },
  {
    id: 'SEC-006', method: 'POST', severity: 'Critical',
    endpoint: '/api/transactions/transfer',
    title: 'Parameter Tampering (Amount Modification in Transit)',
    description: 'Test integrity of transfer request. Verify that request signing or checksum prevents amount modification between client and server.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_token',
      'X-Request-Signature': 'HMAC-SHA256:tampered_signature_here'
    },
    requestBody: { fromAccount: 'ACC-SAV-00001', toAccount: 'ACC-SAV-00099', amount: 999999.00, originalAmount: 100.00 },
    expectedResponse: {
      statusCode: 400,
      body: { detail: 'Request signature validation failed', error_code: 'SIGNATURE_MISMATCH', correlation_id: 'corr-sec-006' }
    },
    validationPoints: [
      'HMAC signature mismatch detected and rejected',
      'Amount field validated against signed request hash',
      'TLS enforced (no HTTP allowed for financial APIs)',
      'Request replay detected via timestamp + nonce',
      'Tampering attempt logged with full request details'
    ]
  },
  {
    id: 'SEC-007', method: 'GET', severity: 'High',
    endpoint: '/api/accounts/ACC-SAV-00001/balance',
    title: 'CORS Misconfiguration Test',
    description: 'Test Cross-Origin Resource Sharing configuration. Verify that only whitelisted origins can access the API and credentials are not shared with wildcards.',
    requestHeaders: { 'Origin': 'https://evil-site.com', 'Authorization': 'Bearer valid_token' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: { note: 'Response returned but CORS headers restrict browser access' }
    },
    validationPoints: [
      'Access-Control-Allow-Origin does NOT contain * (wildcard)',
      'Only whitelisted origins (banking.com, app.banking.com) allowed',
      'Access-Control-Allow-Credentials: true only with specific origin',
      'Preflight OPTIONS request returns correct CORS headers',
      'Evil origin request lacks Access-Control-Allow-Origin in response'
    ]
  },
  {
    id: 'SEC-008', method: 'GET', severity: 'Critical',
    endpoint: '/api/health/tls',
    title: 'SSL/TLS Version and Cipher Validation',
    description: 'Verify that the API enforces modern TLS versions and strong cipher suites. Reject deprecated protocols (SSL 3.0, TLS 1.0, TLS 1.1).',
    requestHeaders: { 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        tlsConfig: { minimumVersion: 'TLS 1.2', preferredVersion: 'TLS 1.3', hsts: 'max-age=31536000; includeSubDomains; preload', cipherSuites: ['TLS_AES_256_GCM_SHA384', 'TLS_CHACHA20_POLY1305_SHA256', 'TLS_AES_128_GCM_SHA256'] }
      }
    },
    validationPoints: [
      'TLS 1.0 and 1.1 connections refused',
      'SSL 3.0 completely disabled',
      'TLS 1.2 minimum, TLS 1.3 preferred',
      'Weak ciphers (RC4, DES, 3DES) disabled',
      'HSTS header present with minimum 1-year max-age'
    ]
  },
  {
    id: 'SEC-009', method: 'GET', severity: 'Critical',
    endpoint: '/api/customers/CUS-2026-00001',
    title: 'Sensitive Data Exposure in API Responses',
    description: 'Verify that sensitive data (full PAN, Aadhaar, passwords, internal IDs) is properly masked or excluded from API responses.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        customerId: 'CUS-2026-00001',
        panNumber: 'ABCPK****F',
        aadhaarNumber: 'XXXX-XXXX-9012',
        mobile: '+91******3210',
        email: 'r****@example.com',
        _internal_id: 'MUST NOT BE PRESENT',
        password_hash: 'MUST NOT BE PRESENT',
        encryption_key: 'MUST NOT BE PRESENT'
      }
    },
    validationPoints: [
      'PAN number shows only first 5 and last character',
      'Aadhaar masked except last 4 digits',
      'Password hash NEVER present in any response',
      'Internal database IDs not exposed externally',
      'API keys and encryption keys never in responses'
    ]
  },
  {
    id: 'SEC-010', method: 'GET', severity: 'High',
    endpoint: '/api/accounts/ACC-SAV-00001 through ACC-SAV-99999',
    title: 'API Enumeration Attack (Sequential Account Discovery)',
    description: 'Attempt to discover valid accounts by iterating through sequential IDs. Tests rate limiting and detection of enumeration patterns.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 429,
      body: { detail: 'Suspicious activity detected. Access temporarily blocked.', error_code: 'SUSPICIOUS_ACTIVITY', blockDuration: '15 minutes' }
    },
    validationPoints: [
      'Rapid sequential ID requests trigger rate limit',
      'After 10 failed lookups in 1 minute, IP blocked temporarily',
      'Use UUIDs instead of sequential IDs where possible',
      'Enumeration pattern detected and alerted to security team',
      'Response timing consistent (no timing-based enumeration)'
    ]
  }
];

// ==================== DATA: Tab 9 - Contract & Versioning Testing ====================
const contractScenarios = [
  {
    id: 'CTR-001', method: 'GET', severity: 'Critical',
    endpoint: '/api/v1/accounts/{id} vs /api/v2/accounts/{id}',
    title: 'API Version Backward Compatibility (v1 vs v2)',
    description: 'Verify that v2 API is backward compatible with v1 consumers. Existing fields must not be removed or have type changes. New fields may be added.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json', 'API-Version': 'v1' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        v1Response: { accountId: 'ACC-SAV-00001', accountNumber: '1234567890123456', balance: 85000.50, status: 'ACTIVE' },
        v2Response: { accountId: 'ACC-SAV-00001', accountNumber: '1234567890123456', balance: 85000.50, status: 'ACTIVE', currency: 'INR', interestRate: 3.5, _links: { self: '/api/v2/accounts/ACC-SAV-00001' } },
        compatibility: 'v2 is a SUPERSET of v1 (backward compatible)'
      }
    },
    validationPoints: [
      'All v1 fields present in v2 with same types',
      'No field removed in v2 that existed in v1',
      'No field type changed (string to number, etc.)',
      'New v2 fields are optional (v1 consumers ignore them)',
      'v1 endpoint still operational during v2 rollout'
    ]
  },
  {
    id: 'CTR-002', method: 'GET', severity: 'High',
    endpoint: '/api/v2/accounts/{id}',
    title: 'Deprecated Field Handling',
    description: 'Test that deprecated fields are still returned with correct values but marked with deprecation notice. Consumers should migrate to replacement fields.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        accountId: 'ACC-SAV-00001',
        balance: 85000.50,
        accountBalance: 85000.50,
        _deprecated: ['accountBalance: Use "balance" field instead. Removal planned for v3.'],
        _sunset: 'accountBalance field sunset date: 2026-12-31'
      }
    },
    validationPoints: [
      'Deprecated field still returned with correct value',
      'Deprecation-Warning header present in response',
      'Sunset header indicates removal date',
      'Both old and new field names return same value',
      'API documentation marks field as deprecated'
    ]
  },
  {
    id: 'CTR-003', method: 'POST', severity: 'Medium',
    endpoint: '/api/v2/customers',
    title: 'New Field Addition (Forward Compatibility)',
    description: 'Test that adding new fields in v2 does not break v1 consumers. V1 consumers should ignore unknown fields gracefully.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      preferredLanguage: 'hi',
      communicationPreferences: { email: true, sms: true, push: true }
    },
    expectedResponse: {
      statusCode: 201,
      body: {
        customerId: 'CUS-2026-00003',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        preferredLanguage: 'hi',
        communicationPreferences: { email: true, sms: true, push: true }
      }
    },
    validationPoints: [
      'New fields accepted and stored in v2',
      'v1 POST without new fields still works (fields optional)',
      'v1 GET response does not include new v2 fields',
      'v2 GET response includes new fields',
      'Default values applied for new fields when not provided'
    ]
  },
  {
    id: 'CTR-004', method: 'GET', severity: 'Medium',
    endpoint: '/api/v1/accounts/ACC-SAV-00001',
    title: 'Content Negotiation (JSON vs XML)',
    description: 'Test that API respects Accept header for response format. JSON is primary, XML support may be provided for legacy SOAP consumers.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/xml' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: `<?xml version="1.0"?>
<Account>
  <AccountId>ACC-SAV-00001</AccountId>
  <Balance>85000.50</Balance>
  <Status>ACTIVE</Status>
</Account>`
    },
    validationPoints: [
      'Accept: application/json returns JSON (default)',
      'Accept: application/xml returns valid XML',
      'Accept: text/html returns 406 Not Acceptable',
      'No Accept header defaults to JSON',
      'Content-Type header matches response format'
    ]
  },
  {
    id: 'CTR-005', method: 'GET', severity: 'Medium',
    endpoint: '/api/v2/accounts/ACC-SAV-00001',
    title: 'HATEOAS Link Validation',
    description: 'Verify that REST responses include hypermedia links for resource navigation. Links should be valid and consistent across the API.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        accountId: 'ACC-SAV-00001',
        balance: 85000.50,
        _links: {
          self: { href: '/api/v2/accounts/ACC-SAV-00001', method: 'GET' },
          balance: { href: '/api/v2/accounts/ACC-SAV-00001/balance', method: 'GET' },
          transactions: { href: '/api/v2/accounts/ACC-SAV-00001/transactions', method: 'GET' },
          transfer: { href: '/api/v2/transactions/transfer', method: 'POST' },
          customer: { href: '/api/v2/customers/CUS-2026-00001', method: 'GET' }
        }
      }
    },
    validationPoints: [
      'All _links hrefs are valid and reachable',
      'self link points to current resource',
      'Related resource links are contextually correct',
      'HTTP methods specified for each link',
      'Links use relative paths (not hardcoded domain)'
    ]
  },
  {
    id: 'CTR-006', method: 'GET', severity: 'High',
    endpoint: '/api/v1/transactions?accountId=ACC-SAV-00001&offset=0&limit=20',
    title: 'Pagination Contract (Offset/Limit and Cursor-Based)',
    description: 'Verify pagination contract consistency. Test both offset-based and cursor-based pagination modes for transaction listing.',
    requestHeaders: { 'Authorization': 'Bearer valid_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        offsetBased: { items: ['...20 items...'], total: 150, offset: 0, limit: 20, hasMore: true, _links: { next: '/api/v1/transactions?offset=20&limit=20', prev: null } },
        cursorBased: { items: ['...20 items...'], cursor: 'eyJpZCI6MTIzfQ==', hasMore: true, _links: { next: '/api/v1/transactions?cursor=eyJpZCI6MTIzfQ==&limit=20' } }
      }
    },
    validationPoints: [
      'offset=0, limit=20 returns first 20 records',
      'total count is accurate and consistent',
      'hasMore=false when on last page',
      'Cursor-based: no duplicate or missing records between pages',
      'Invalid offset/limit returns 400 (not empty result)'
    ]
  },
  {
    id: 'CTR-007', method: 'GET', severity: 'High',
    endpoint: '/api/v1/openapi.json',
    title: 'OpenAPI/Swagger Spec Validation',
    description: 'Validate that the published OpenAPI specification is accurate, complete, and matches actual API behavior. Tests spec-to-implementation consistency.',
    requestHeaders: { 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        openapi: '3.1.0',
        info: { title: 'Banking API', version: '1.0.0' },
        paths: { '/api/v1/accounts/{id}': { get: { summary: 'Get account details', responses: { '200': {}, '401': {}, '404': {} } } } }
      }
    },
    validationPoints: [
      'OpenAPI spec validates against JSON Schema (no errors)',
      'Every implemented endpoint documented in spec',
      'Request/response schemas match actual payloads',
      'Error responses (4xx, 5xx) documented for each endpoint',
      'Authentication schemes correctly specified'
    ]
  },
  {
    id: 'CTR-008', method: 'POST', severity: 'Medium',
    endpoint: '/api/graphql',
    title: 'GraphQL Schema Validation',
    description: 'Validate GraphQL schema introspection, query depth limiting, and type validation. Tests both query and mutation operations for banking data.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: {
      query: '{ account(id: "ACC-SAV-00001") { accountId balance transactions(first: 5) { transactionId amount date } } }'
    },
    expectedResponse: {
      statusCode: 200,
      body: {
        data: {
          account: {
            accountId: 'ACC-SAV-00001',
            balance: 85000.50,
            transactions: [
              { transactionId: 'TXN-001', amount: -25000.00, date: '2026-02-26' }
            ]
          }
        }
      }
    },
    validationPoints: [
      'GraphQL introspection disabled in production',
      'Query depth limited to 5 levels (prevent DoS)',
      'Query cost/complexity analysis enforced',
      'N+1 queries resolved with DataLoader',
      'Mutations require write scopes in token'
    ]
  }
];


// ==================== DATA: Tab 10 - Monitoring & Observability Testing ====================
const monitoringScenarios = [
  {
    id: 'MON-001', method: 'GET', severity: 'Critical',
    endpoint: '/api/health',
    title: 'Health Check Endpoint',
    description: 'Verify the health check endpoint returns system status including database connectivity, external service availability, and disk space.',
    requestHeaders: { 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        status: 'UP',
        timestamp: '2026-02-26T10:00:00Z',
        version: '1.5.0',
        uptime: '15d 4h 30m',
        checks: {
          database: { status: 'UP', responseTime: '5ms' },
          redis: { status: 'UP', responseTime: '2ms' },
          externalPaymentGateway: { status: 'UP', responseTime: '120ms' },
          diskSpace: { status: 'UP', freeSpace: '45GB', threshold: '10GB' }
        }
      }
    },
    validationPoints: [
      'Returns 200 when all components healthy',
      'Returns 503 when any critical component down',
      'Response time under 500ms (includes dependency checks)',
      'No authentication required for health endpoint',
      'Includes application version for deployment verification'
    ]
  },
  {
    id: 'MON-002', method: 'GET', severity: 'Critical',
    endpoint: '/api/health/ready and /api/health/live',
    title: 'Readiness and Liveness Probes',
    description: 'Kubernetes-style health probes. Liveness checks if process is alive. Readiness checks if service can accept traffic (dependencies ready).',
    requestHeaders: { 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        livenessProbe: { endpoint: '/api/health/live', response: { status: 'UP' }, purpose: 'Process is running, restart not needed' },
        readinessProbe: { endpoint: '/api/health/ready', response: { status: 'READY', database: 'connected', cache: 'connected', migrations: 'applied' }, purpose: 'Can accept traffic, all dependencies ready' },
        kubernetesConfig: { livenessProbe: { httpGet: { path: '/api/health/live', port: 8000 }, initialDelaySeconds: 10, periodSeconds: 15 }, readinessProbe: { httpGet: { path: '/api/health/ready', port: 8000 }, initialDelaySeconds: 5, periodSeconds: 10 } }
      }
    },
    validationPoints: [
      'Liveness: returns 200 if process running (minimal check)',
      'Readiness: returns 200 only when all dependencies connected',
      'Readiness: returns 503 during startup (before DB connected)',
      'Readiness: returns 503 during graceful shutdown',
      'Both probes respond within 1 second'
    ]
  },
  {
    id: 'MON-003', method: 'POST', severity: 'High',
    endpoint: '/api/transactions/transfer',
    title: 'Correlation ID Propagation Across Services',
    description: 'Verify that correlation ID (trace ID) propagates through all microservices in a request chain. Essential for distributed debugging.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_token',
      'X-Correlation-ID': 'corr-trace-20260226-001',
      'X-Request-ID': 'req-20260226-001'
    },
    requestBody: { fromAccount: 'ACC-SAV-00001', toAccount: 'ACC-SAV-00099', amount: 1000.00 },
    expectedResponse: {
      statusCode: 200,
      body: {
        transactionId: 'TXN-2026-0226-00020',
        correlationTrace: {
          apiGateway: { correlationId: 'corr-trace-20260226-001', timestamp: '2026-02-26T10:00:00.000Z' },
          accountService: { correlationId: 'corr-trace-20260226-001', timestamp: '2026-02-26T10:00:00.050Z' },
          transactionService: { correlationId: 'corr-trace-20260226-001', timestamp: '2026-02-26T10:00:00.100Z' },
          notificationService: { correlationId: 'corr-trace-20260226-001', timestamp: '2026-02-26T10:00:00.200Z' }
        }
      }
    },
    validationPoints: [
      'Same correlation ID appears in all service logs',
      'X-Correlation-ID returned in response headers',
      'Auto-generated if client does not provide one',
      'Correlation ID format is UUID v4',
      'Searchable in centralized logging (ELK/Splunk)'
    ]
  },
  {
    id: 'MON-004', method: 'POST', severity: 'High',
    endpoint: '/api/transactions/transfer',
    title: 'Request/Response Logging Validation',
    description: 'Verify that API requests and responses are properly logged with required fields for audit and debugging. Sensitive data must be masked in logs.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJtoken...',
      'X-Correlation-ID': 'corr-log-001'
    },
    requestBody: { fromAccount: 'ACC-SAV-00001', toAccount: 'ACC-SAV-00099', amount: 5000.00 },
    expectedResponse: {
      statusCode: 200,
      body: {
        expectedLogEntry: {
          timestamp: '2026-02-26T10:00:00.000Z',
          level: 'INFO',
          correlationId: 'corr-log-001',
          method: 'POST',
          path: '/api/transactions/transfer',
          statusCode: 200,
          responseTimeMs: 125,
          clientIP: '192.168.1.100',
          userAgent: 'BankingApp/2.0',
          userId: 'CUS-2026-00001',
          requestBody: { fromAccount: 'ACC-***-00001', toAccount: 'ACC-***-00099', amount: '***' },
          sensitiveFieldsMasked: ['Authorization header', 'amount', 'account numbers partially']
        }
      }
    },
    validationPoints: [
      'Request timestamp in ISO 8601 UTC format',
      'Authorization header value NOT logged (masked)',
      'Account numbers partially masked in logs',
      'Transaction amounts masked or excluded from logs',
      'Response time recorded in milliseconds'
    ]
  },
  {
    id: 'MON-005', method: 'GET', severity: 'Critical',
    endpoint: '/api/metrics/error-rates',
    title: 'Error Rate Monitoring (4xx/5xx Threshold Alerts)',
    description: 'Verify error rate monitoring is in place with appropriate alerting thresholds. 4xx rate above 5% or any 5xx triggers alert.',
    requestHeaders: { 'Authorization': 'Bearer admin_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        period: 'last_5_minutes',
        totalRequests: 15000,
        successRate: '98.5%',
        errorBreakdown: {
          '4xx': { count: 180, rate: '1.2%', threshold: '5%', status: 'OK', topErrors: [{ code: 400, count: 80 }, { code: 401, count: 50 }, { code: 404, count: 50 }] },
          '5xx': { count: 45, rate: '0.3%', threshold: '0.1%', status: 'ALERT', topErrors: [{ code: 500, count: 30 }, { code: 503, count: 15 }] }
        },
        alerts: [{ severity: 'HIGH', message: '5xx error rate 0.3% exceeds threshold 0.1%', triggeredAt: '2026-02-26T10:05:00Z' }]
      }
    },
    validationPoints: [
      '4xx rate under 5% marked as OK',
      '5xx rate above 0.1% triggers HIGH severity alert',
      'Error breakdown shows top error codes',
      'Alert notification sent (PagerDuty/Slack/email)',
      'Metrics available via Prometheus /metrics endpoint'
    ]
  },
  {
    id: 'MON-006', method: 'GET', severity: 'High',
    endpoint: '/api/metrics/latency',
    title: 'Latency Percentile Monitoring (P50, P95, P99)',
    description: 'Monitor API response time percentiles. P95 exceeding SLA triggers alert. Tracks latency trends for capacity planning.',
    requestHeaders: { 'Authorization': 'Bearer admin_token', 'Accept': 'application/json' },
    requestBody: null,
    expectedResponse: {
      statusCode: 200,
      body: {
        period: 'last_15_minutes',
        endpoints: {
          'GET /api/accounts/{id}/balance': { p50: '35ms', p95: '120ms', p99: '350ms', sla: '200ms', status: 'OK' },
          'POST /api/transactions/transfer': { p50: '85ms', p95: '250ms', p99: '800ms', sla: '500ms', status: 'OK' },
          'GET /api/transactions': { p50: '150ms', p95: '520ms', p99: '1200ms', sla: '500ms', status: 'BREACHED' }
        },
        alerts: [{ endpoint: 'GET /api/transactions', message: 'P95 latency 520ms exceeds 500ms SLA', severity: 'MEDIUM' }]
      }
    },
    validationPoints: [
      'P50 (median) below 100ms for simple queries',
      'P95 within SLA for each endpoint',
      'P99 under 2x the SLA threshold',
      'SLA breach triggers alert with endpoint details',
      'Latency histogram available in Grafana dashboard'
    ]
  },
  {
    id: 'MON-007', method: 'POST', severity: 'Critical',
    endpoint: '/api/transactions/transfer (with payment service down)',
    title: 'Circuit Breaker Testing (Dependency Failure Fallback)',
    description: 'Test circuit breaker behavior when downstream payment service fails. Circuit should open after threshold failures and return fast-fail response.',
    requestHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer valid_token' },
    requestBody: { fromAccount: 'ACC-SAV-00001', toAccount: 'ACC-SAV-00099', amount: 1000.00, transferType: 'NEFT' },
    expectedResponse: {
      statusCode: 503,
      body: {
        detail: 'Payment service temporarily unavailable. Circuit breaker is OPEN.',
        error_code: 'CIRCUIT_OPEN',
        circuitBreaker: {
          state: 'OPEN',
          failureCount: 15,
          failureThreshold: 10,
          lastFailure: '2026-02-26T10:04:55Z',
          resetTimeout: '30s',
          nextRetryAt: '2026-02-26T10:05:25Z'
        },
        retryAfter: 30,
        correlation_id: 'corr-mon-007'
      }
    },
    validationPoints: [
      'Circuit CLOSED: requests flow normally to downstream',
      'After 10 failures in 1 minute: circuit OPENS',
      'Circuit OPEN: returns 503 immediately (no downstream call)',
      'After 30s timeout: circuit HALF-OPEN (allows 1 test request)',
      'Successful test request: circuit CLOSES, normal flow resumes'
    ]
  },
  {
    id: 'MON-008', method: 'POST', severity: 'High',
    endpoint: '/api/transactions/transfer',
    title: 'Distributed Tracing Validation (OpenTelemetry)',
    description: 'Verify distributed tracing spans are correctly generated and propagated. Each service hop creates a child span with timing and metadata.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer valid_token',
      'traceparent': '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
      'tracestate': 'banking=true'
    },
    requestBody: { fromAccount: 'ACC-SAV-00001', toAccount: 'ACC-SAV-00099', amount: 500.00 },
    expectedResponse: {
      statusCode: 200,
      body: {
        transactionId: 'TXN-2026-0226-00025',
        traceInfo: {
          traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
          spans: [
            { spanId: 'span-001', service: 'api-gateway', operation: 'POST /transfer', duration: '250ms', status: 'OK' },
            { spanId: 'span-002', service: 'account-service', operation: 'validateBalance', duration: '30ms', status: 'OK', parentSpan: 'span-001' },
            { spanId: 'span-003', service: 'transaction-service', operation: 'executeTransfer', duration: '150ms', status: 'OK', parentSpan: 'span-001' },
            { spanId: 'span-004', service: 'notification-service', operation: 'sendSMS', duration: '45ms', status: 'OK', parentSpan: 'span-003' }
          ],
          totalDuration: '250ms',
          spanCount: 4
        }
      }
    },
    validationPoints: [
      'W3C traceparent header propagated to all services',
      'Each service creates a child span with correct parent',
      'Span timing accurate (child durations sum <= parent)',
      'Error spans marked with error status and exception details',
      'Traces visible in Jaeger/Zipkin/Tempo UI'
    ]
  }
];


// ==================== TAB CONFIGURATION ====================
const TABS = [
  { id: 'rest-crud', label: 'REST API CRUD', icon: 'R', data: restCrudScenarios },
  { id: 'soap', label: 'SOAP API', icon: 'S', data: soapScenarios },
  { id: 'auth', label: 'Auth & AuthZ', icon: 'A', data: authScenarios },
  { id: 'validation', label: 'Validation & Schema', icon: 'V', data: validationScenarios },
  { id: 'errors', label: 'Error Handling', icon: 'E', data: errorScenarios },
  { id: 'integration', label: 'Integration', icon: 'I', data: integrationScenarios },
  { id: 'performance', label: 'Performance', icon: 'P', data: performanceScenarios },
  { id: 'security', label: 'Security', icon: 'X', data: securityScenarios },
  { id: 'contract', label: 'Contract & Version', icon: 'C', data: contractScenarios },
  { id: 'monitoring', label: 'Monitoring', icon: 'M', data: monitoringScenarios }
];

// ==================== METHOD COLORS ====================
const METHOD_COLORS = {
  GET: '#3498db',
  POST: '#27ae60',
  PUT: '#e67e22',
  PATCH: '#9b59b6',
  DELETE: '#e74c3c'
};

// ==================== SEVERITY COLORS ====================
const SEVERITY_COLORS = {
  Critical: '#e74c3c',
  High: '#e67e22',
  Medium: '#f1c40f'
};

// ==================== STYLES ====================
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '24px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#e0e0e0'
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 8px 0',
    letterSpacing: '0.5px'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#4ecca3',
    margin: 0
  },
  tabBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '20px',
    background: 'rgba(15, 52, 96, 0.5)',
    borderRadius: '12px',
    padding: '8px'
  },
  tab: {
    padding: '10px 16px',
    border: '1px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    background: 'transparent',
    color: '#a0a0a0',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap'
  },
  tabActive: {
    background: '#4ecca3',
    color: '#0a0a1a',
    fontWeight: '700',
    border: '1px solid #4ecca3'
  },
  tabIcon: {
    width: '22px',
    height: '22px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
    background: 'rgba(78,204,163,0.2)',
    color: '#4ecca3'
  },
  tabIconActive: {
    background: '#0a0a1a',
    color: '#4ecca3'
  },
  statsBar: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '16px',
    padding: '14px 20px',
    background: 'rgba(15, 52, 96, 0.6)',
    borderRadius: '10px',
    border: '1px solid rgba(78,204,163,0.2)',
    alignItems: 'center'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem'
  },
  statLabel: {
    color: '#a0a0a0'
  },
  statValue: {
    color: '#ffffff',
    fontWeight: '600'
  },
  controlsBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px'
  },
  controlBtn: {
    padding: '8px 16px',
    background: 'rgba(78,204,163,0.15)',
    border: '1px solid rgba(78,204,163,0.3)',
    borderRadius: '6px',
    color: '#4ecca3',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  scenarioCard: {
    background: '#0f3460',
    borderRadius: '10px',
    marginBottom: '12px',
    border: '1px solid rgba(78,204,163,0.3)',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    cursor: 'pointer',
    flexWrap: 'wrap'
  },
  scenarioId: {
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    color: '#4ecca3',
    fontWeight: '700',
    minWidth: '75px'
  },
  methodBadge: {
    padding: '3px 10px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#ffffff',
    minWidth: '55px',
    textAlign: 'center',
    letterSpacing: '0.5px'
  },
  scenarioTitle: {
    flex: 1,
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#ffffff',
    minWidth: '200px'
  },
  severityBadge: {
    padding: '3px 10px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  expandIcon: {
    color: '#4ecca3',
    fontSize: '1.2rem',
    fontWeight: '700',
    transition: 'transform 0.2s ease',
    minWidth: '20px',
    textAlign: 'center'
  },
  cardBody: {
    padding: '0 20px 20px 20px',
    borderTop: '1px solid rgba(78,204,163,0.15)'
  },
  sectionTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#4ecca3',
    marginTop: '16px',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  description: {
    fontSize: '0.9rem',
    color: '#c0c0c0',
    lineHeight: '1.6',
    marginBottom: '4px'
  },
  endpointUrl: {
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    color: '#4ecca3',
    background: '#0a0a1a',
    padding: '8px 14px',
    borderRadius: '6px',
    marginBottom: '4px',
    overflowX: 'auto',
    whiteSpace: 'nowrap'
  },
  codeBlock: {
    position: 'relative',
    background: '#0a0a1a',
    borderRadius: '8px',
    padding: '14px',
    fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
    fontSize: '0.8rem',
    color: '#4ecca3',
    overflowX: 'auto',
    lineHeight: '1.5',
    border: '1px solid rgba(78,204,163,0.15)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  copyBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    padding: '4px 10px',
    background: 'rgba(78,204,163,0.2)',
    border: '1px solid rgba(78,204,163,0.3)',
    borderRadius: '4px',
    color: '#4ecca3',
    cursor: 'pointer',
    fontSize: '0.7rem',
    fontWeight: '600'
  },
  validationList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  validationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '5px 0',
    fontSize: '0.85rem',
    color: '#c0c0c0',
    lineHeight: '1.5'
  },
  checkMark: {
    color: '#4ecca3',
    fontWeight: '700',
    minWidth: '16px',
    marginTop: '2px'
  },
  totalStats: {
    textAlign: 'center',
    padding: '20px',
    marginTop: '24px',
    background: 'rgba(15, 52, 96, 0.6)',
    borderRadius: '10px',
    border: '1px solid rgba(78,204,163,0.2)'
  }
};

// ==================== HELPER COMPONENTS ====================
const CodeBlockComponent = ({ content, label }) => {
  const [copied, setCopied] = React.useState(false);
  const textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(textContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [textContent]);

  return (
    <div style={{ marginBottom: '12px' }}>
      {label && <div style={styles.sectionTitle}>{label}</div>}
      <div style={styles.codeBlock}>
        <button style={styles.copyBtn} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
        {textContent}
      </div>
    </div>
  );
};

const ScenarioCard = ({ scenario, isExpanded, onToggle }) => {
  const methodColor = METHOD_COLORS[scenario.method] || '#95a5a6';
  const severityColor = SEVERITY_COLORS[scenario.severity] || '#95a5a6';

  return (
    <div style={styles.scenarioCard}>
      <div style={styles.cardHeader} onClick={onToggle}>
        <span style={styles.scenarioId}>{scenario.id}</span>
        <span style={{ ...styles.methodBadge, background: methodColor }}>{scenario.method}</span>
        <span style={styles.scenarioTitle}>{scenario.title}</span>
        <span style={{ ...styles.severityBadge, background: severityColor }}>{scenario.severity}</span>
        <span style={{ ...styles.expandIcon, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          &#9654;
        </span>
      </div>
      {isExpanded && (
        <div style={styles.cardBody}>
          <div style={styles.sectionTitle}>Description</div>
          <p style={styles.description}>{scenario.description}</p>

          <div style={styles.sectionTitle}>Endpoint</div>
          <div style={styles.endpointUrl}>{scenario.method} {scenario.endpoint}</div>

          {scenario.soapAction && (
            <>
              <div style={styles.sectionTitle}>SOAPAction</div>
              <div style={styles.endpointUrl}>{scenario.soapAction}</div>
            </>
          )}

          <CodeBlockComponent content={scenario.requestHeaders} label="Request Headers" />

          {scenario.requestBody && (
            <CodeBlockComponent content={scenario.requestBody} label="Request Body" />
          )}

          {scenario.expectedResponse && (
            <>
              <div style={styles.sectionTitle}>
                Expected Response (Status: {scenario.expectedResponse.statusCode})
              </div>
              <div style={styles.codeBlock}>
                <button style={styles.copyBtn} onClick={() => {
                  const text = typeof scenario.expectedResponse.body === 'string'
                    ? scenario.expectedResponse.body
                    : JSON.stringify(scenario.expectedResponse.body, null, 2);
                  navigator.clipboard.writeText(text).catch(() => {});
                }}>Copy</button>
                {typeof scenario.expectedResponse.body === 'string'
                  ? scenario.expectedResponse.body
                  : JSON.stringify(scenario.expectedResponse.body, null, 2)}
              </div>
            </>
          )}

          <div style={styles.sectionTitle}>Validation Points</div>
          <ul style={styles.validationList}>
            {scenario.validationPoints.map((point, idx) => (
              <li key={idx} style={styles.validationItem}>
                <span style={styles.checkMark}>&#10003;</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


// ==================== MAIN COMPONENT ====================
const ApiTestingScenarios = () => {
  const [activeTab, setActiveTab] = useState('rest-crud');
  const [expandedCards, setExpandedCards] = useState({});

  const currentTab = TABS.find(t => t.id === activeTab) || TABS[0];
  const currentScenarios = currentTab.data;

  const toggleCard = useCallback((scenarioId) => {
    setExpandedCards(prev => ({
      ...prev,
      [scenarioId]: !prev[scenarioId]
    }));
  }, []);

  const expandAll = useCallback(() => {
    const newState = {};
    currentScenarios.forEach(s => { newState[s.id] = true; });
    setExpandedCards(prev => ({ ...prev, ...newState }));
  }, [currentScenarios]);

  const collapseAll = useCallback(() => {
    const newState = {};
    currentScenarios.forEach(s => { newState[s.id] = false; });
    setExpandedCards(prev => ({ ...prev, ...newState }));
  }, [currentScenarios]);

  // Compute stats
  const methodCounts = {};
  const severityCounts = {};
  currentScenarios.forEach(s => {
    methodCounts[s.method] = (methodCounts[s.method] || 0) + 1;
    severityCounts[s.severity] = (severityCounts[s.severity] || 0) + 1;
  });

  const totalAllScenarios = TABS.reduce((sum, tab) => sum + tab.data.length, 0);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Banking API Testing Scenarios</h1>
        <p style={styles.subtitle}>
          Comprehensive API Test Suite -- {totalAllScenarios} Scenarios Across {TABS.length} Categories
        </p>
      </div>

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                ...(isActive ? styles.tabActive : {})
              }}
            >
              <span style={{
                ...styles.tabIcon,
                ...(isActive ? styles.tabIconActive : {})
              }}>
                {tab.icon}
              </span>
              {tab.label}
              <span style={{
                fontSize: '0.7rem',
                background: isActive ? '#0a0a1a' : 'rgba(78,204,163,0.15)',
                color: '#4ecca3',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: '700'
              }}>
                {tab.data.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Total Scenarios:</span>
          <span style={styles.statValue}>{currentScenarios.length}</span>
        </div>
        <span style={{ color: 'rgba(78,204,163,0.3)' }}>|</span>
        {Object.entries(methodCounts).map(([method, count]) => (
          <div key={method} style={styles.statItem}>
            <span style={{
              ...styles.methodBadge,
              background: METHOD_COLORS[method] || '#95a5a6',
              fontSize: '0.65rem',
              padding: '2px 6px'
            }}>
              {method}
            </span>
            <span style={styles.statValue}>{count}</span>
          </div>
        ))}
        <span style={{ color: 'rgba(78,204,163,0.3)' }}>|</span>
        {Object.entries(severityCounts).map(([severity, count]) => (
          <div key={severity} style={styles.statItem}>
            <span style={{
              ...styles.severityBadge,
              background: SEVERITY_COLORS[severity] || '#95a5a6',
              fontSize: '0.65rem',
              padding: '2px 6px'
            }}>
              {severity}
            </span>
            <span style={styles.statValue}>{count}</span>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div style={styles.controlsBar}>
        <button style={styles.controlBtn} onClick={expandAll}>
          Expand All
        </button>
        <button style={styles.controlBtn} onClick={collapseAll}>
          Collapse All
        </button>
      </div>

      {/* Scenario Cards */}
      {currentScenarios.map(scenario => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          isExpanded={!!expandedCards[scenario.id]}
          onToggle={() => toggleCard(scenario.id)}
        />
      ))}

      {/* Footer Stats */}
      <div style={styles.totalStats}>
        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
          Complete Banking API Test Coverage
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <div key={tab.id} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#4ecca3' }}>{tab.data.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#a0a0a0' }}>{tab.label}</div>
            </div>
          ))}
          <div style={{ textAlign: 'center', borderLeft: '2px solid rgba(78,204,163,0.3)', paddingLeft: '32px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ffffff' }}>{totalAllScenarios}</div>
            <div style={{ fontSize: '0.85rem', color: '#4ecca3', fontWeight: '600' }}>Total Scenarios</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestingScenarios;

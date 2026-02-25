@banking @transfer @regression
Feature: Fund Transfer Between Accounts
  As a banking customer
  I want to transfer funds between accounts
  So that I can manage my money

  Background:
    Given I am logged in as customer "CUST001"
    And I navigate to the "Fund Transfer" page

  @positive @P0 @smoke
  Scenario: Successful own account transfer
    When I select source account "ACC-SAV-001"
    And I select destination account "ACC-CUR-001"
    And I enter transfer amount "25000"
    And I enter remarks "Monthly savings transfer"
    And I click "Transfer" button
    And I confirm the transfer
    Then I should see success message "Transfer Successful"
    And source account balance should decrease by 25000
    And destination account balance should increase by 25000
    And a transaction reference number should be generated

  @positive @P0
  Scenario: NEFT transfer to other bank
    When I select source account "ACC-SAV-001"
    And I select transfer type "NEFT"
    And I enter beneficiary account "1234567890"
    And I enter beneficiary IFSC "HDFC0001234"
    And I enter transfer amount "50000"
    And I click "Transfer" button
    And I verify OTP "123456"
    Then I should see success message "NEFT Transfer Initiated"
    And transaction status should be "Processing"

  @negative @P0
  Scenario: Transfer with insufficient balance
    When I select source account "ACC-SAV-001"
    And I select destination account "ACC-CUR-001"
    And I enter transfer amount "99999999"
    And I click "Transfer" button
    Then I should see error "Insufficient balance"

  @boundary @P1
  Scenario Outline: Transfer amount validation
    When I enter transfer amount "<amount>"
    And I click "Transfer" button
    Then I should see error "<error_message>"

    Examples:
      | amount     | error_message                     |
      | 0          | Amount must be greater than zero  |
      | -500       | Invalid amount                    |
      | abc        | Please enter a valid number       |
      | 10000001   | Exceeds daily transfer limit      |
      | 0.001      | Minimum transfer amount is ₹1     |

  @security @P0
  Scenario: OTP required for high-value transfer
    When I select source account "ACC-SAV-001"
    And I enter transfer amount "100000"
    And I click "Transfer" button
    Then OTP verification screen should be displayed
    And OTP should be sent to registered mobile

  @negative @P1
  Scenario: Transfer to blocked account
    When I select destination account "ACC-BLOCKED-001"
    And I enter transfer amount "1000"
    And I click "Transfer" button
    Then I should see error "Destination account is blocked"

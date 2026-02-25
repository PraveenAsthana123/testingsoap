@banking @accounts @regression
Feature: Account Management
  As a banking customer
  I want to view and manage my accounts
  So that I can track my finances

  Background:
    Given I am logged in as customer "CUST001"

  @positive @P0 @smoke
  Scenario: View all accounts
    When I navigate to the "Accounts" page
    Then I should see a list of my accounts
    And each account should display account number, type, balance, and status

  @positive @P1
  Scenario: View account details
    When I navigate to the "Accounts" page
    And I click on account "ACC-SAV-001"
    Then I should see account details including:
      | Field          | Value          |
      | Account Number | ACC-SAV-001    |
      | Account Type   | Savings        |
      | Status         | Active         |
      | Branch         | Mumbai Main    |

  @positive @P1
  Scenario: View account statement
    When I navigate to account "ACC-SAV-001" statement
    And I select date range "2024-01-01" to "2024-01-31"
    Then I should see transactions within the date range
    And opening balance and closing balance should be displayed
    And I should be able to download the statement as PDF

  @positive @P1
  Scenario: Filter accounts by type
    When I navigate to the "Accounts" page
    And I filter by account type "Savings"
    Then only savings accounts should be displayed

  @positive @P1
  Scenario: Search account by number
    When I navigate to the "Accounts" page
    And I search for "ACC-SAV-001"
    Then only matching accounts should be displayed

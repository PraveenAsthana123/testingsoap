@banking @authentication @smoke
Feature: Banking Login Authentication
  As a banking customer
  I want to securely login to my account
  So that I can access banking services

  Background:
    Given I am on the banking login page

  @positive @P0
  Scenario: Successful login with valid credentials
    When I enter username "rajesh.kumar"
    And I enter password "Test@123"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see welcome message containing "Rajesh"

  @negative @P0
  Scenario: Login fails with wrong password
    When I enter username "rajesh.kumar"
    And I enter password "WrongPass123"
    And I click the login button
    Then I should see error message "Invalid username or password"
    And I should remain on the login page

  @negative @P1
  Scenario: Login fails with empty credentials
    When I click the login button
    Then I should see error message "Username is required"

  @negative @P1
  Scenario Outline: Login with invalid credentials
    When I enter username "<username>"
    And I enter password "<password>"
    And I click the login button
    Then I should see error message "<error_message>"

    Examples:
      | username       | password    | error_message                  |
      | invalid_user   | Test@123    | Invalid username or password   |
      | rajesh.kumar   |             | Password is required           |
      |                | Test@123    | Username is required           |
      | admin' OR 1=1  | password    | Invalid username or password   |

  @security @P0
  Scenario: Account lockout after 5 failed attempts
    When I enter wrong password 5 times for user "rajesh.kumar"
    Then the account should be locked
    And I should see error message "Account locked. Contact support."

  @security @P1
  Scenario: Session timeout after inactivity
    Given I am logged in as "rajesh.kumar"
    When I remain idle for 15 minutes
    Then I should be redirected to the login page
    And I should see message "Session expired"

@api @rest-assured @regression
Feature: Banking REST API Testing
  As a QA tester
  I want to validate all banking API endpoints
  So that the backend services work correctly

  @api @smoke @P0
  Scenario: Get all customers API
    When I send GET request to "/api/customers"
    Then the response status code should be 200
    And the response should contain a list of customers
    And each customer should have id, first_name, last_name, email

  @api @smoke @P0
  Scenario: Get dashboard stats API
    When I send GET request to "/api/dashboard/stats"
    Then the response status code should be 200
    And the response should contain "customers" count
    And the response should contain "accounts" count
    And the response should contain "transactions" count

  @api @P0
  Scenario: Get customer by ID
    When I send GET request to "/api/customers/1"
    Then the response status code should be 200
    And the response "first_name" should be "Rajesh"
    And the response "last_name" should be "Kumar"

  @api @negative @P1
  Scenario: Get non-existent customer
    When I send GET request to "/api/customers/99999"
    Then the response status code should be 404
    And the response should contain "detail" as "Customer not found"

  @api @P0
  Scenario: Execute SQL query via API
    When I send POST request to "/api/sql/execute" with body:
      | query | SELECT COUNT(*) as count FROM customers |
    Then the response status code should be 200
    And the response "success" should be true
    And the response "type" should be "query"

  @api @negative @P1
  Scenario: Execute invalid SQL query
    When I send POST request to "/api/sql/execute" with body:
      | query | SELECT * FROM non_existent_table |
    Then the response status code should be 400
    And the response "success" should be false

  @api @P1
  Scenario: Get all accounts with customer names
    When I send GET request to "/api/accounts"
    Then the response status code should be 200
    And each account should have "customer_name" field
    And each account should have "balance" as a number

  @api @P1
  Scenario: Filter test cases by module
    When I send GET request to "/api/test-cases?module=authentication"
    Then the response status code should be 200
    And all test cases should have module "authentication"

  @api @P1
  Scenario: Execute test case via API
    When I send PUT request to "/api/test-cases/1/execute" with body:
      | status          | pass                    |
      | actual_result   | Registration successful |
      | notes           | Verified via automation |
      | execution_time_ms | 1500                  |
    Then the response status code should be 200
    And the response "status" should be "pass"

  @api @P0
  Scenario: Get database schema
    When I send GET request to "/api/schema"
    Then the response status code should be 200
    And the response should contain table "customers"
    And the response should contain table "accounts"
    And the response should contain table "transactions"

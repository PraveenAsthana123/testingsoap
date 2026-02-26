package com.banking.steps;

import com.banking.utils.ConfigReader;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.datatable.DataTable;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.testng.Assert;

import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;

/**
 * Step Definitions for REST API Testing
 * Uses REST Assured for HTTP calls against the banking backend
 */
public class APISteps {
    private Response response;
    private RequestSpecification request;
    private String baseUrl;

    private void setupBaseUrl() {
        baseUrl = ConfigReader.getApiBaseUrl();
        RestAssured.baseURI = baseUrl;
    }

    // ========== When Steps ==========

    @When("I send GET request to {string}")
    public void iSendGetRequest(String endpoint) {
        setupBaseUrl();
        request = given()
                .header("Content-Type", "application/json")
                .header("Accept", "application/json");
        response = request.get(endpoint);
        System.out.println("GET " + endpoint + " => Status: " + response.getStatusCode());
    }

    @When("I send POST request to {string} with body:")
    public void iSendPostRequestWithBody(String endpoint, DataTable dataTable) {
        setupBaseUrl();
        Map<String, String> body = dataTable.asMap(String.class, String.class);

        request = given()
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .body(body);
        response = request.post(endpoint);
        System.out.println("POST " + endpoint + " => Status: " + response.getStatusCode());
    }

    @When("I send PUT request to {string} with body:")
    public void iSendPutRequestWithBody(String endpoint, DataTable dataTable) {
        setupBaseUrl();
        Map<String, String> body = dataTable.asMap(String.class, String.class);

        request = given()
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .body(body);
        response = request.put(endpoint);
        System.out.println("PUT " + endpoint + " => Status: " + response.getStatusCode());
    }

    @When("I send DELETE request to {string}")
    public void iSendDeleteRequest(String endpoint) {
        setupBaseUrl();
        request = given()
                .header("Content-Type", "application/json");
        response = request.delete(endpoint);
        System.out.println("DELETE " + endpoint + " => Status: " + response.getStatusCode());
    }

    // ========== Then Steps ==========

    @Then("the response status code should be {int}")
    public void theResponseStatusCodeShouldBe(int expectedStatus) {
        int actualStatus = response.getStatusCode();
        Assert.assertEquals(actualStatus, expectedStatus,
                "Expected status " + expectedStatus + " but got " + actualStatus +
                "\nResponse body: " + response.getBody().asString());
    }

    @Then("the response should contain a list of customers")
    public void theResponseShouldContainCustomerList() {
        List<?> customers = response.jsonPath().getList("$");
        Assert.assertNotNull(customers, "Response should contain customer list");
        Assert.assertTrue(customers.size() > 0, "Customer list should not be empty");
        System.out.println("Found " + customers.size() + " customers");
    }

    @And("each customer should have id, first_name, last_name, email")
    public void eachCustomerShouldHaveRequiredFields() {
        List<Map<String, Object>> customers = response.jsonPath().getList("$");
        for (Map<String, Object> customer : customers) {
            Assert.assertNotNull(customer.get("id"), "Customer should have id");
            Assert.assertNotNull(customer.get("first_name"), "Customer should have first_name");
            Assert.assertNotNull(customer.get("last_name"), "Customer should have last_name");
            Assert.assertNotNull(customer.get("email"), "Customer should have email");
        }
    }

    @And("the response should contain {string} count")
    public void theResponseShouldContainCount(String field) {
        Object value = response.jsonPath().get(field);
        Assert.assertNotNull(value, "Response should contain '" + field + "' count");
        System.out.println(field + " count: " + value);
    }

    @And("the response {string} should be {string}")
    public void theResponseFieldShouldBe(String field, String expectedValue) {
        String actualValue = response.jsonPath().getString(field);
        Assert.assertEquals(actualValue, expectedValue,
                "Field '" + field + "' mismatch");
    }

    @And("the response {string} should be true")
    public void theResponseFieldShouldBeTrue(String field) {
        Boolean value = response.jsonPath().getBoolean(field);
        Assert.assertTrue(value, "Field '" + field + "' should be true");
    }

    @And("the response {string} should be false")
    public void theResponseFieldShouldBeFalse(String field) {
        Boolean value = response.jsonPath().getBoolean(field);
        Assert.assertFalse(value, "Field '" + field + "' should be false");
    }

    @And("the response should contain {string} as {string}")
    public void theResponseShouldContainFieldAs(String field, String expectedValue) {
        String actualValue = response.jsonPath().getString(field);
        Assert.assertEquals(actualValue, expectedValue,
                "Field '" + field + "' should be '" + expectedValue + "'");
    }

    @And("each account should have {string} field")
    public void eachAccountShouldHaveField(String fieldName) {
        List<Map<String, Object>> accounts = response.jsonPath().getList("$");
        Assert.assertNotNull(accounts, "Accounts list should not be null");
        for (Map<String, Object> account : accounts) {
            Assert.assertTrue(account.containsKey(fieldName),
                    "Account should have '" + fieldName + "' field");
        }
    }

    @And("each account should have {string} as a number")
    public void eachAccountShouldHaveFieldAsNumber(String fieldName) {
        List<Map<String, Object>> accounts = response.jsonPath().getList("$");
        for (Map<String, Object> account : accounts) {
            Object value = account.get(fieldName);
            Assert.assertNotNull(value, "'" + fieldName + "' should not be null");
            Assert.assertTrue(value instanceof Number,
                    "'" + fieldName + "' should be a number, got: " + value.getClass());
        }
    }

    @And("all test cases should have module {string}")
    public void allTestCasesShouldHaveModule(String expectedModule) {
        List<Map<String, Object>> testCases = response.jsonPath().getList("$");
        for (Map<String, Object> tc : testCases) {
            String module = (String) tc.get("module");
            Assert.assertEquals(module.toLowerCase(), expectedModule.toLowerCase(),
                    "Test case module mismatch");
        }
    }

    @And("the response should contain table {string}")
    public void theResponseShouldContainTable(String tableName) {
        String responseBody = response.getBody().asString();
        Assert.assertTrue(responseBody.contains(tableName),
                "Schema should contain table '" + tableName + "'");
    }

    // ========== Helper Methods ==========

    public Response getLastResponse() {
        return response;
    }

    public int getResponseStatusCode() {
        return response.getStatusCode();
    }

    public String getResponseBody() {
        return response.getBody().asString();
    }
}

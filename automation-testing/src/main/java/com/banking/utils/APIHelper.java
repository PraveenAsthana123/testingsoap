package com.banking.utils;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import java.util.Map;

import static io.restassured.RestAssured.given;

/**
 * API Helper - Wrapper for REST Assured operations
 * Centralized API testing utility with common methods
 */
public class APIHelper {
    private static String baseUrl;

    static {
        baseUrl = ConfigReader.getApiBaseUrl();
        RestAssured.baseURI = baseUrl;
    }

    // ========== GET Requests ==========

    public static Response get(String endpoint) {
        return given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .get(endpoint);
    }

    public static Response get(String endpoint, Map<String, String> queryParams) {
        RequestSpecification request = given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON);
        queryParams.forEach(request::queryParam);
        return request.get(endpoint);
    }

    public static Response getWithAuth(String endpoint, String authToken) {
        return given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .header("Authorization", "Bearer " + authToken)
                .get(endpoint);
    }

    // ========== POST Requests ==========

    public static Response post(String endpoint, Object body) {
        return given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(body)
                .post(endpoint);
    }

    public static Response post(String endpoint, String jsonBody) {
        return given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(jsonBody)
                .post(endpoint);
    }

    // ========== PUT Requests ==========

    public static Response put(String endpoint, Object body) {
        return given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(body)
                .put(endpoint);
    }

    // ========== DELETE Requests ==========

    public static Response delete(String endpoint) {
        return given()
                .contentType(ContentType.JSON)
                .delete(endpoint);
    }

    // ========== PATCH Requests ==========

    public static Response patch(String endpoint, Object body) {
        return given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(body)
                .patch(endpoint);
    }

    // ========== Validation Helpers ==========

    public static void assertStatusCode(Response response, int expectedStatus) {
        response.then().statusCode(expectedStatus);
    }

    public static void assertContentType(Response response, String contentType) {
        response.then().contentType(contentType);
    }

    public static <T> T extractField(Response response, String jsonPath, Class<T> type) {
        return response.jsonPath().getObject(jsonPath, type);
    }

    public static String getResponseBody(Response response) {
        return response.getBody().asString();
    }

    public static long getResponseTime(Response response) {
        return response.getTime();
    }

    // ========== Schema Validation ==========

    public static void validateResponseTime(Response response, long maxMillis) {
        long responseTime = response.getTime();
        if (responseTime > maxMillis) {
            throw new AssertionError(
                    "Response time " + responseTime + "ms exceeded max " + maxMillis + "ms");
        }
    }

    // ========== Health Check ==========

    public static boolean isServiceUp() {
        try {
            Response response = get("/api/health");
            return response.getStatusCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }

    public static Response getHealth() {
        return get("/api/health");
    }
}

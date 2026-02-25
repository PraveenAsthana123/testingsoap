@mobile @appium @banking
Feature: Mobile Banking Application Testing
  As a mobile banking user
  I want to access banking services on my phone
  So that I can bank on the go

  # ========== Native Android Tests ==========

  @android @native @P0
  Scenario: Mobile app login with fingerprint
    Given I launch the banking mobile app on Android
    When I tap on "Login with Fingerprint"
    And I authenticate with fingerprint
    Then I should see the mobile dashboard
    And my account summary should be displayed

  @android @native @P0
  Scenario: Quick balance check on mobile
    Given I am logged in on the mobile app
    When I tap on "Check Balance"
    And I authenticate with PIN "1234"
    Then I should see my account balance
    And the balance should match the web portal

  @android @native @P1
  Scenario: Mobile fund transfer via UPI
    Given I am logged in on the mobile app
    When I tap on "Send Money"
    And I enter UPI ID "friend@upi"
    And I enter amount "500"
    And I enter PIN "1234"
    Then I should see "Payment Successful"
    And I should receive a payment confirmation SMS

  @android @native @P1
  Scenario: Mobile bill payment
    Given I am logged in on the mobile app
    When I tap on "Pay Bills"
    And I select biller "Electricity - MSEB"
    And I enter consumer number "123456789"
    And I tap "Fetch Bill"
    Then the outstanding amount should be displayed
    When I tap "Pay Now"
    And I authenticate with PIN "1234"
    Then I should see "Payment Successful"

  @android @native @P1
  Scenario: Mobile app push notification
    Given I am logged in on the mobile app
    When a transaction occurs on my account
    Then I should receive a push notification
    And the notification should contain transaction details

  # ========== iOS Tests ==========

  @ios @native @P0
  Scenario: iOS app login with Face ID
    Given I launch the banking mobile app on iOS
    When I tap on "Login with Face ID"
    And I authenticate with Face ID
    Then I should see the mobile dashboard

  @ios @native @P1
  Scenario: iOS app account statement
    Given I am logged in on the iOS app
    When I navigate to "Accounts" tab
    And I tap on my savings account
    And I tap "View Statement"
    Then I should see recent transactions
    And I should be able to share the statement

  # ========== Cross-Platform Tests ==========

  @cross-platform @P0
  Scenario: Session sync between web and mobile
    Given I am logged in on the web portal
    And I am logged in on the mobile app
    When I perform a transfer on the web portal
    Then the transaction should appear on the mobile app
    And the balance should be updated on both platforms

  @cross-platform @P1
  Scenario: Responsive web on mobile browser
    Given I open the banking website on mobile Chrome
    When I login with valid credentials
    Then the dashboard should be mobile-responsive
    And all navigation menus should be accessible via hamburger menu
    And touch interactions should work correctly

  # ========== Mobile-Specific Tests ==========

  @mobile @P1
  Scenario: App behavior on network change
    Given I am logged in on the mobile app
    When I switch from WiFi to mobile data
    Then the app should maintain the session
    And a network change notification should appear

  @mobile @P1
  Scenario: App behavior on low battery
    Given I am logged in on the mobile app
    When the device battery is below 15%
    Then the app should show battery warning
    And non-critical features should be disabled

  @mobile @P2
  Scenario: App orientation change
    Given I am on the mobile dashboard
    When I rotate the device to landscape
    Then the UI should adapt to landscape mode
    And no data should be lost during rotation

  @mobile @P1
  Scenario: Offline mode functionality
    Given I am logged in on the mobile app
    When I go offline (airplane mode)
    Then I should see cached account summary
    And transfer functionality should be disabled
    And I should see "No internet connection" message

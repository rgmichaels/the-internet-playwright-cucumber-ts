@feature @smoke @regression @feature_form_auth @feature_form_authentication
Feature: Form Authentication

  Scenario: Form Authentication - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Form Authentication" example
    Then the Form Authentication page should load
    And I exercise the Form Authentication page

  Scenario: Form Authentication - invalid login shows dismissible error
    Given I open the Form Authentication page
    Then an invalid login should show a dismissible error

  Scenario: Form Authentication - unauthenticated secure-area access is rejected
    Given I open the secure area without signing in
    Then access should be rejected with an authentication-required error

  Scenario: Form Authentication - logout invalidates the authenticated session
    Given I open the Form Authentication page
    When I sign in and log out of the secure area
    And I revisit the secure area after logging out
    Then access should be rejected with an authentication-required error

  Scenario: Form Authentication - Footer shows Elemental Selenium attribution and link
    Given I open the Form Authentication page
    Then the global footer should be valid

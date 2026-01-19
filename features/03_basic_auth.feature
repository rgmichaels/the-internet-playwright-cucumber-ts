@feature @regression @feature_basic_auth @auth_admin
Feature: Basic Auth

  Scenario: Basic Auth - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Basic Auth" example
    Then the "Basic Auth" page should load
    And I exercise the "Basic Auth" page

  Scenario: Basic Auth - Footer shows Elemental Selenium attribution and link
    Given I open the "Basic Auth" page
    Then the global footer should be valid

  Scenario: User is denied access when no credentials are provided
    When I request the basic auth page
    Then access should be denied
    And the page should indicate the user is not authorized

@auth_success
  Scenario: Congratulations message is shown when valid credentials are provided
    When I request the basic auth page with valid credentials
    Then the congratulations message should be displayed


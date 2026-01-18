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


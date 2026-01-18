@feature @regression @feature_forgot_password
Feature: Forgot Password

  Scenario: Forgot Password - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Forgot Password" example
    Then the "Forgot Password" page should load
    And I exercise the "Forgot Password" page

  Scenario: Forgot Password - Footer shows Elemental Selenium attribution and link
    Given I open the "Forgot Password" page
    Then the global footer should be valid


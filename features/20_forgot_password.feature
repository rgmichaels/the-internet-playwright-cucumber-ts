@feature @regression @feature_forgot_password
Feature: Forgot Password

  @smoke @page-load
  Scenario: Forgot Password - recovery form loads with stable controls
    Given I am on the home page
    When I open the "Forgot Password" example
    Then the Forgot Password page should load

  Scenario: Forgot Password - submits a recovery request
    Given I open the Forgot Password page
    Then I exercise the Forgot Password page

  Scenario: Forgot Password - Footer shows Elemental Selenium attribution and link
    Given I open the Forgot Password page
    Then the global footer should be valid

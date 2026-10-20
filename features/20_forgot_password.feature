@feature @regression @feature_forgot_password
Feature: Forgot Password

  @smoke @page-load
  Scenario: Forgot Password - recovery form loads with stable controls
    Given I am on the home page
    When I open the "Forgot Password" example
    Then the Forgot Password page should load

  Scenario: Forgot Password - successful recovery uses POST and confirms delivery
    Given I open the Forgot Password page
    Then submitting a Forgot Password recovery request should confirm delivery

  Scenario: Forgot Password - Footer shows Elemental Selenium attribution and link
    Given I open the Forgot Password page
    Then the global footer should be valid

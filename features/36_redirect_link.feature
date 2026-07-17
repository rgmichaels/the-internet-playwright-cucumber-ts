@feature @regression @feature_redirect_link
Feature: Redirect Link

  Scenario: Redirect Link returns HTTP 302 and reaches the documented destination
    Given I am on the home page
    When I open the "Redirect Link" example
    Then the Redirect Link page should load
    And the redirect should return HTTP 302 and land on the Status Codes page

  Scenario: Redirect Link - Footer shows Elemental Selenium attribution and link
    Given I open the Redirect Link page
    Then the global footer should be valid

Scenario: Redirect Link - redirector page explains redirect behavior
  Given I open the Redirect Link page
  Then the Redirect Link page should load
  And the redirect explanation text should be displayed

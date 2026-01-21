@feature @regression @feature_status_codes
Feature: Status Codes

  Scenario: Status Codes page explains each HTTP status code
    Given I am on the home page
    When I open the "Status Codes" example
    Then the Status Codes page should load
    And each status code link should show the correct explanation


  Scenario: Status Codes page show paragraph of text
    Given I open the Status Codes page
    Then the Status Codes page should show a paragraph of text

  Scenario: Status Codes page shows Elemental Selenium attribution in the footer
    Given I open the Status Codes page
    Then the global footer should be valid
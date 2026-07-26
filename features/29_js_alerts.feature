@feature @smoke @regression @feature_js_alerts
Feature: JavaScript Alerts

  Scenario: JavaScript Alerts - accepted dialogs expose the documented contract
    Given I am on the home page
    When I open the "JavaScript Alerts" example
    Then the JavaScript Alerts page should load
    And I verify the accepted JavaScript Alerts dialog contracts

  Scenario: JavaScript Alerts - Footer shows Elemental Selenium attribution and link
    Given I open the JavaScript Alerts page
    Then the global footer should be valid

  Scenario: JavaScript Alerts - cancelled dialogs expose the documented contract
    Given I open the JavaScript Alerts page
    Then the JavaScript Alerts page should load
    And I verify the cancelled JavaScript Alerts dialog contracts

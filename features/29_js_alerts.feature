@feature @smoke @regression @feature_js_alerts
Feature: JavaScript Alerts

  Scenario: JavaScript Alerts - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "JavaScript Alerts" example
    Then the "JavaScript Alerts" page should load
    And I exercise the "JavaScript Alerts" page

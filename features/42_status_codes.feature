@feature @regression @feature_status_codes
Feature: Status Codes

  Scenario: Status Codes - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Status Codes" example
    Then the "Status Codes" page should load
    And I exercise the "Status Codes" page

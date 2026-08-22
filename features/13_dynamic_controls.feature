@feature @smoke @regression @feature_dynamic_controls
Feature: Dynamic Controls

  Scenario: Dynamic Controls - checkbox completes one remove and restore transition
    Given I am on the home page
    When I open the "Dynamic Controls" example
    Then the Dynamic Controls page should load
    And removing and restoring the dynamic checkbox should complete once per action

  Scenario: Dynamic Controls - entered input value survives the disable transition
    Given I open the Dynamic Controls page
    When I enable the dynamic input and enter "customer reference 42"
    Then disabling the dynamic input should preserve "customer reference 42"

  Scenario: Dynamic Controls - Footer shows Elemental Selenium attribution and link
    Given I open the Dynamic Controls page
    Then the global footer should be valid

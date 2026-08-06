@feature @smoke @regression @feature_dynamic_controls
Feature: Dynamic Controls

  Scenario: Dynamic Controls - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Dynamic Controls" example
    Then the Dynamic Controls page should load
    And I exercise the Dynamic Controls page

  Scenario: Dynamic Controls - entered input value survives the disable transition
    Given I open the Dynamic Controls page
    When I enable the dynamic input and enter "customer reference 42"
    Then disabling the dynamic input should preserve "customer reference 42"

  Scenario: Dynamic Controls - Footer shows Elemental Selenium attribution and link
    Given I open the Dynamic Controls page
    Then the global footer should be valid

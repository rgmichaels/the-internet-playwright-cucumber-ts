@feature @smoke @regression @feature_dynamic_controls
Feature: Dynamic Controls

  Scenario: Dynamic Controls - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Dynamic Controls" example
    Then the Dynamic Controls page should load
    And I exercise the Dynamic Controls page

  Scenario: Dynamic Controls - Footer shows Elemental Selenium attribution and link
    Given I open the Dynamic Controls page
    Then the global footer should be valid


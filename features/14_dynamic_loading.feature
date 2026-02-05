@feature @smoke @regression @feature_dynamic_loading
Feature: Dynamic Loading

  Scenario: Dynamic Loading - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Dynamic Loading" example
    Then the Dynamic Loading page should load
    And I exercise the Dynamic Loading page

  Scenario: Dynamic Loading - Example 2 shows loader then content
    Given I open the Dynamic Loading page
    Then Dynamic Loading Example 2 should show the loader then content

  Scenario: Dynamic Loading - Footer shows Elemental Selenium attribution and link
    Given I open the Dynamic Loading page
    Then the global footer should be valid

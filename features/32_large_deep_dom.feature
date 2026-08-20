@feature @regression @feature_large_deep_dom
Feature: Large & Deep DOM

  Scenario: Large & Deep DOM - preserves the complete nested and tabular data topology
    Given I am on the home page
    When I open the "Large & Deep DOM" example
    Then the Large & Deep DOM page should load
    And the Large & Deep DOM page should expose all nested tiers and grid coordinates

  Scenario: Large & Deep DOM - Footer shows Elemental Selenium attribution and link
    Given I open the Large & Deep DOM page
    Then the global footer should be valid

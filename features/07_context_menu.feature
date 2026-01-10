@feature @regression @feature_context_menu
Feature: Context Menu

  Scenario: Context Menu - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Context Menu" example
    Then the "Context Menu" page should load
    And I exercise the "Context Menu" page

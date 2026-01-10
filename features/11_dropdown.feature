@feature @smoke @regression @feature_dropdown
Feature: Dropdown

  Scenario: Dropdown - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Dropdown" example
    Then the "Dropdown" page should load
    And I exercise the "Dropdown" page

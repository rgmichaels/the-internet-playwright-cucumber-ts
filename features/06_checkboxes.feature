@feature @regression @feature_checkboxes
Feature: Checkboxes

  Scenario: Checkboxes - each control toggles independently and restores its original state
    Given I am on the home page
    When I open the "Checkboxes" example
    Then the Checkboxes page should load
    And each checkbox should toggle independently and restore its original state

  Scenario: Checkboxes - Footer shows Elemental Selenium attribution and link
    Given I open the Checkboxes page
    Then the global footer should be valid

@feature @regression @feature_drag_and_drop
Feature: Drag and Drop

  Scenario: Drag and Drop - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Drag and Drop" example
    Then the Drag and Drop page should load
    And I exercise the Drag and Drop page

  Scenario: Drag and Drop - Footer shows Elemental Selenium attribution and link
    Given I open the Drag and Drop page
    Then the global footer should be valid


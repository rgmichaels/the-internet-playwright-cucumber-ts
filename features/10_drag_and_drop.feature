@feature @regression @feature_drag_and_drop
Feature: Drag and Drop

  Scenario: Drag and Drop - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Drag and Drop" example
    Then the "Drag and Drop" page should load
    And I exercise the "Drag and Drop" page

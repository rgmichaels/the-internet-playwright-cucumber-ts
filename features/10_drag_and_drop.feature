@feature @regression @feature_drag_and_drop
Feature: Drag and Drop

  Scenario: Drag and Drop - swaps the tiles and restores their original order
    Given I am on the home page
    When I open the "Drag and Drop" example
    Then the Drag and Drop page should load
    And dragging the tiles twice should restore their original order

  Scenario: Drag and Drop - Footer shows Elemental Selenium attribution and link
    Given I open the Drag and Drop page
    Then the global footer should be valid

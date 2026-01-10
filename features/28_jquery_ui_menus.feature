@feature @regression @feature_jquery_ui_menus
Feature: JQuery UI Menus

  Scenario: JQuery UI Menus - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "JQuery UI Menus" example
    Then the "JQuery UI Menus" page should load
    And I exercise the "JQuery UI Menus" page

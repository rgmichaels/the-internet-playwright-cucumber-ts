@feature @regression @feature_jquery_ui_menus
Feature: JQuery UI Menus

  Scenario: JQuery UI Menus - CSV download exposes the expected artifact
    Given I am on the home page
    When I open the "JQuery UI Menus" example
    Then the JQuery UI Menus page should load
    And downloading CSV from the JQuery UI Menus page returns the expected artifact

  Scenario: JQuery UI Menus - Footer shows Elemental Selenium attribution and link
    Given I open the JQuery UI Menus page
    Then the global footer should be valid

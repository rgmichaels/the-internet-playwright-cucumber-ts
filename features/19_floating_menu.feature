@feature @regression @feature_floating_menu
Feature: Floating Menu

  Scenario: Floating Menu - remains reachable while content scrolls
    Given I am on the home page
    When I open the "Floating Menu" example
    Then the Floating Menu page should load
    And the Floating Menu should remain in the viewport while the content scrolls

  Scenario: Floating Menu - Footer shows Elemental Selenium attribution and link
    Given I open the Floating Menu page
    Then the global footer should be valid

  Scenario: Floating Menu - complete paragraph content is visible
    Given I open the Floating Menu page
    Then at least three visible paragraphs of text should be present in the main content

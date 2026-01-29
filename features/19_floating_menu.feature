@feature @regression @feature_floating_menu
Feature: Floating Menu

  Scenario: Floating Menu - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Floating Menu" example
    Then the Floating Menu page should load
    And I exercise the Floating Menu page

  Scenario: Floating Menu - Footer shows Elemental Selenium attribution and link
    Given I open the Floating Menu page
    Then the global footer should be valid

  Scenario: Floating Menu - At least one Paragraph of text is present on the page 
    Given I open the Floating Menu page
    Then at least one Paragraph of text should be present on the page
    

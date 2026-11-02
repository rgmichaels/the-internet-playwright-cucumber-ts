@feature @regression @feature_context_menu
Feature: Context Menu

  Scenario: Context Menu - right-click emits and accepts the documented alert
    Given I am on the home page
    When I open the "Context Menu" example
    Then the Context Menu page should load
    And I exercise the Context Menu page

  Scenario: Context Menu - dismissed alert can be triggered again
    Given I open the Context Menu page
    Then dismissing the Context Menu alert should preserve the dialog lifecycle

  Scenario: Context Menu - Page text appears properly
    Given I open the Context Menu page
    Then the page should display header and content

  Scenario: Context Menu - Footer shows Elemental Selenium attribution and link
    Given I open the Context Menu page
    Then the global footer should be valid

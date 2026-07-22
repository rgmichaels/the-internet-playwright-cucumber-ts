@feature @smoke @regression @feature_multiple_windows
Feature: Multiple Windows

  Scenario: Multiple Windows - popup lifecycle preserves the original window
    Given I am on the home page
    When I open the "Multiple Windows" example
    Then the Multiple Windows page should load
    And the popup should close without replacing the original Multiple Windows page

  Scenario: Multiple Windows - Footer shows Elemental Selenium attribution and link
    Given I open the Multiple Windows page
    Then the global footer should be valid

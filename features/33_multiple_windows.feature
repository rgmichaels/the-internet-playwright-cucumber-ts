@feature @smoke @regression @feature_multiple_windows
Feature: Multiple Windows

  Scenario: Multiple Windows - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Multiple Windows" example
    Then the "Multiple Windows" page should load
    And I exercise the "Multiple Windows" page

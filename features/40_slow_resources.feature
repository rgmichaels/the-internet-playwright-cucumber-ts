@feature @regression @feature_slow_resources
Feature: Slow Resources

  Scenario: Slow Resources - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Slow Resources" example
    Then the "Slow Resources" page should load
    And I exercise the "Slow Resources" page

  Scenario: Slow Resources - Footer shows Elemental Selenium attribution and link
    Given I open the "Slow Resources" page
    Then the global footer should be valid


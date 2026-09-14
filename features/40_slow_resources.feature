@feature @regression @feature_slow_resources
Feature: Slow Resources

  Scenario: Slow Resources - delayed external request preserves content through load completion
    Given I am on the home page
    When I open the "Slow Resources" example
    Then the Slow Resources page should load
    And the Slow Resources page should remain usable while its external request is pending and finish loading after it completes

  Scenario: Slow Resources - Footer shows Elemental Selenium attribution and link
    Given I open the Slow Resources page
    Then the global footer should be valid

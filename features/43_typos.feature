@feature @regression @feature_typos
Feature: Typos

  Scenario: Typos - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Typos" example
    Then the "Typos" page should load
    And I exercise the "Typos" page

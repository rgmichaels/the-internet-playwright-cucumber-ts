@feature @regression @feature_hovers
Feature: Hovers

  Scenario: Hovers - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Hovers" example
    Then the Hovers page should load
    And I exercise the Hovers page

  Scenario: Hovers - Footer shows Elemental Selenium attribution and link
    Given I open the Hovers page
    Then the global footer should be valid


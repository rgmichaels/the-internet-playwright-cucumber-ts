@feature @regression @feature_inputs
Feature: Inputs

  Scenario: Inputs - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Inputs" example
    Then the "Inputs" page should load
    And I exercise the "Inputs" page

  Scenario: Inputs - Footer shows Elemental Selenium attribution and link
    Given I open the "Inputs" page
    Then the global footer should be valid


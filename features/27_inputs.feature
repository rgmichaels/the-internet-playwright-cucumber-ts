@feature @regression @feature_inputs
Feature: Inputs

  Scenario: Inputs - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Inputs" example
    Then the "Inputs" page should load
    And I exercise the "Inputs" page

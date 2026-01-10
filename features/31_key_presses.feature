@feature @smoke @regression @feature_key_presses
Feature: Key Presses

  Scenario: Key Presses - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Key Presses" example
    Then the "Key Presses" page should load
    And I exercise the "Key Presses" page

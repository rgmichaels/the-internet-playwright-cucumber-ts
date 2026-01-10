@feature @regression @feature_large_deep_dom
Feature: Large & Deep DOM

  Scenario: Large & Deep DOM - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Large & Deep DOM" example
    Then the "Large & Deep DOM" page should load
    And I exercise the "Large & Deep DOM" page

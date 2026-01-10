@feature @smoke @regression @feature_ab_testing
Feature: A/B Testing

  Scenario: A/B Testing - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "A/B Testing" example
    Then the "A/B Testing" page should load
    And I exercise the "A/B Testing" page

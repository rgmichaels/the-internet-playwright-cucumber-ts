@feature @smoke @regression @feature_ab_testing
Feature: A/B Testing

  Scenario: A/B Testing - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "A/B Testing" example
    Then the "A/B Testing" page should load
    And I exercise the "A/B Testing" page

  Scenario: A/B Testing - asserts text presence
    Given I am on the A/B Testing page
    Then I should see the A/B testing description text

  Scenario: Footer shows Elemental Selenium attribution and link
  Given I am on the A/B Testing page
  Then the global footer should be valid
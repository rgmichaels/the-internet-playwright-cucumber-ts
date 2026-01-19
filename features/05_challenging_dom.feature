@feature @regression @feature_challenging_dom
Feature: Challenging DOM

  Scenario: Challenging DOM - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Challenging DOM" example
    Then the Challenging DOM page should load
    And I exercise the Challenging DOM page

  Scenario: Challenging DOM - Footer shows Elemental Selenium attribution and link
    Given I open the Challenging DOM page
    Then the global footer should be valid


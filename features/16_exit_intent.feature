@feature @regression @feature_exit_intent
Feature: Exit Intent

  Scenario: Exit Intent - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Exit Intent" example
    Then the "Exit Intent" page should load
    And I exercise the "Exit Intent" page

  Scenario: Exit Intent - Footer shows Elemental Selenium attribution and link
    Given I open the "Exit Intent" page
    Then the global footer should be valid


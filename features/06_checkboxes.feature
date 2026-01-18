@feature @regression @feature_checkboxes
Feature: Checkboxes

  Scenario: Checkboxes - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Checkboxes" example
    Then the "Checkboxes" page should load
    And I exercise the "Checkboxes" page

  Scenario: Checkboxes - Footer shows Elemental Selenium attribution and link
    Given I open the "Checkboxes" page
    Then the global footer should be valid


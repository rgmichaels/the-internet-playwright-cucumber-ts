@feature @regression @feature_shadow_dom
Feature: Shadow DOM

  Scenario: Shadow DOM - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Shadow DOM" example
    Then the "Shadow DOM" page should load
    And I exercise the "Shadow DOM" page

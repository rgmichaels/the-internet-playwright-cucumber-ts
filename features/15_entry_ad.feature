@feature @regression @feature_entry_ad
Feature: Entry Ad

  Scenario: Entry Ad - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Entry Ad" example
    Then the "Entry Ad" page should load
    And I exercise the "Entry Ad" page

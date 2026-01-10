@feature @regression @feature_shifting_content
Feature: Shifting Content

  Scenario: Shifting Content - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Shifting Content" example
    Then the "Shifting Content" page should load
    And I exercise the "Shifting Content" page

@feature @regression @feature_nested_frames
Feature: Nested Frames

  Scenario: Nested Frames - preserves exact frame topology and content boundaries
    Given I am on the home page
    When I open the "Nested Frames" example
    Then the Nested Frames page should load
    And the nested frame hierarchy should match the documented regions

  Scenario: Nested Frames direct URL load shows frameset
    Given I open the Nested Frames page
    Then the Nested Frames page should load

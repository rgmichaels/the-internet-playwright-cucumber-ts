@feature @regression @feature_nested_frames
Feature: Nested Frames

  Scenario: Nested Frames - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Nested Frames" example
    Then the Nested Frames page should load
    And I exercise the Nested Frames page



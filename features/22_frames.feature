@feature @regression @feature_frames
Feature: Frames

  Scenario: Frames - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Frames" example
    Then the "Frames" page should load
    And I exercise the "Frames" page

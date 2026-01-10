@feature @regression @feature_horizontal_slider
Feature: Horizontal Slider

  Scenario: Horizontal Slider - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Horizontal Slider" example
    Then the "Horizontal Slider" page should load
    And I exercise the "Horizontal Slider" page

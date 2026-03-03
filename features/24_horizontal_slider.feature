@feature @regression @feature_horizontal_slider
Feature: Horizontal Slider

  Scenario: Horizontal Slider - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Horizontal Slider" example
    Then the Horizontal Slider page should load
    And I exercise the Horizontal Slider page

  Scenario: Horizontal Slider - Footer shows Elemental Selenium attribution and link
    Given I open the Horizontal Slider page
    Then the global footer should be valid

  Scenario: Horizontal Slider updates displayed value at maximum
    Given I open the Horizontal Slider page
    When I move the Horizontal Slider to the maximum value
    Then the Horizontal Slider displayed value should be "5"

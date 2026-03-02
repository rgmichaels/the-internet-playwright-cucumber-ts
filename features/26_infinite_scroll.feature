@feature @regression @feature_infinite_scroll
Feature: Infinite Scroll

  Scenario: Infinite Scroll - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Infinite Scroll" example
    Then the Infinite Scroll page should load
    And I exercise the Infinite Scroll page

  Scenario: Infinite Scroll - adds new content after scrolling
    Given I open the Infinite Scroll page
    When I scroll down on the Infinite Scroll page
    Then the Infinite Scroll page should append more content blocks

  Scenario: Infinite Scroll - Footer shows Elemental Selenium attribution and link
    Given I open the Infinite Scroll page
    Then the global footer should be valid

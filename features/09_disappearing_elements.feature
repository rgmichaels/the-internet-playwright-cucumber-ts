@feature @regression @feature_disappearing_elements
Feature: Disappearing Elements

  Scenario: Disappearing Elements - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Disappearing Elements" example
    Then the Disappearing Elements page should load
    And I exercise the Disappearing Elements page

  Scenario: Disappearing Elements - Footer shows Elemental Selenium attribution and link
    Given I open the Disappearing Elements page
    Then the global footer should be valid


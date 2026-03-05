@feature @smoke @regression @feature_dropdown
Feature: Dropdown

  Scenario: Dropdown - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Dropdown" example
    Then the Dropdown page should load
    And I exercise the Dropdown page

  Scenario: Dropdown - can switch between both options and reset to default
    Given I open the Dropdown page
    Then I can switch between all Dropdown options

  Scenario: Dropdown - Footer shows Elemental Selenium attribution and link
    Given I open the Dropdown page
    Then the global footer should be valid

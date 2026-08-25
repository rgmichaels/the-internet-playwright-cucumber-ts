@feature @regression @feature_challenging_dom
Feature: Challenging DOM

  Scenario: Challenging DOM - volatile buttons preserve the table contract
    Given I am on the home page
    When I open the "Challenging DOM" example
    Then the Challenging DOM page should load
    And every Challenging DOM button should reload with fresh IDs while the table contract remains intact

  Scenario: Challenging DOM - Verifies header and text on page
    Given I open the Challenging DOM page
    Then the Challenging DOM page should show the proper header and text

  Scenario: Challenging DOM - Footer shows Elemental Selenium attribution and link
    Given I open the Challenging DOM page
    Then the global footer should be valid

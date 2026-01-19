@feature @smoke @regression @feature_add_remove_elements
Feature: Add/Remove Elements

  Scenario: Add/Remove Elements - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Add/Remove Elements" example
    Then the Add/Remove Elements page should load
    And I exercise the Add/Remove Elements page

  Scenario: Add/Remove Elements - Footer shows Elemental Selenium attribution and link
    Given I open the Add/Remove Elements page
    Then the global footer should be valid
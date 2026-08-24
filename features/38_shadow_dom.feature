@feature @regression @feature_shadow_dom
Feature: Shadow DOM

  Scenario: Shadow DOM - each host renders its assigned content
    Given I am on the home page
    When I open the "Shadow DOM" example
    Then the Shadow DOM page should load
    And each Shadow DOM host should render its assigned content and styles

  Scenario: Shadow DOM - Footer shows Elemental Selenium attribution and link
    Given I open the Shadow DOM page
    Then the global footer should be valid


@feature @regression @feature_dynamic_content
Feature: Dynamic Content

  Scenario: Dynamic Content - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Dynamic Content" example
    Then the Dynamic Content page should load
    And I exercise the Dynamic Content page

  Scenario: Dynamic Content - Footer shows Elemental Selenium attribution and link
    Given I open the Dynamic Content page
    Then the global footer should be valid

  Scenario: Dynamic Content - static mode preserves only the documented rows
    Given I open the Dynamic Content page
    When I enable static mode on the Dynamic Content page
    Then the first two Dynamic Content rows should stay static while the third row changes on refresh

@feature @regression @feature_redirect_link
Feature: Redirect Link

  Scenario: Redirect Link - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Redirect Link" example
    Then the "Redirect Link" page should load
    And I exercise the "Redirect Link" page

  Scenario: Redirect Link - Footer shows Elemental Selenium attribution and link
    Given I open the "Redirect Link" page
    Then the global footer should be valid


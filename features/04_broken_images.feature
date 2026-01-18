@feature @regression @feature_broken_images
Feature: Broken Images

  Scenario: Broken Images - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Broken Images" example
    Then the "Broken Images" page should load
    And I exercise the "Broken Images" page

  Scenario: Broken Images - Footer shows Elemental Selenium attribution and link
    Given I open the "Broken Images" page
    Then the global footer should be valid


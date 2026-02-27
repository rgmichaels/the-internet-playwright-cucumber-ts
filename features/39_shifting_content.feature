@feature @regression @feature_shifting_content
Feature: Shifting Content

  Scenario: Shifting Content - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Shifting Content" example
    Then the Shifting Content page should load
    And I exercise the Shifting Content page

  Scenario: Shifting Content - Footer shows Elemental Selenium attribution and link
    Given I open the Shifting Content page
    Then the global footer should be valid

  Scenario: Shifting Content - image example shows expected content
    Given I open the Shifting Content page
    When I open the Shifting Content image example
    Then the Shifting Content image example should show the image and description

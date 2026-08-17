@feature @regression @feature_broken_images
Feature: Broken Images

  Scenario: Broken Images - page text appears
    Given I open the Broken Images page
    Then the Broken Images page text "Broken Images" should appear

  Scenario: Broken Images - exposes broken examples and a loaded control image
    Given I am on the home page
    When I open the "Broken Images" example
    Then the Broken Images page should load
    And I should see two broken images and one loaded control image

  Scenario: Broken Images - Footer shows Elemental Selenium attribution and link
    Given I open the Broken Images page
    Then the global footer should be valid

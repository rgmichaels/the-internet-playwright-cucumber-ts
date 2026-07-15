@feature @regression @feature_file_download
Feature: File Download

  Scenario: File Download - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "File Download" example
    Then the File Download page should load
    And I exercise the File Download page

  Scenario: File Download - Footer shows Elemental Selenium attribution and link
    Given I open the File Download page
    Then the global footer should be valid

  Scenario: File Download - Available link text matches downloaded filename
    Given I open the File Download page
    Then an available file link should download with the same filename

@feature @regression @feature_file_download
Feature: File Download

  Scenario: File Download - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "File Download" example
    Then the "File Download" page should load
    And I exercise the "File Download" page

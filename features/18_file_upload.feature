@feature @smoke @regression @feature_file_upload
Feature: File Upload

  Scenario: File Upload - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "File Upload" example
    Then the "File Upload" page should load
    And I exercise the "File Upload" page

  Scenario: File Upload - Footer shows Elemental Selenium attribution and link
    Given I open the "File Upload" page
    Then the global footer should be valid


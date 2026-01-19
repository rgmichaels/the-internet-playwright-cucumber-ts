@feature @regression @feature_secure_file_download @auth_admin
Feature: Secure File Download

  Scenario: Secure File Download - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Secure File Download" example
    Then the Secure File Download page should load
    And I exercise the Secure File Download page

  Scenario: Secure File Download - Footer shows Elemental Selenium attribution and link
    Given I open the Secure File Download page
    Then the global footer should be valid


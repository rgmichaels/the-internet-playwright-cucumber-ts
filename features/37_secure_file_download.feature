@feature @regression @feature_secure_file_download
Feature: Secure File Download

  @auth_admin
  Scenario: Secure File Download - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Secure File Download" example
    Then the Secure File Download page should load
    And I exercise the Secure File Download page

  @auth_admin
  Scenario: Secure File Download - Footer shows Elemental Selenium attribution and link
    Given I open the Secure File Download page
    Then the global footer should be valid

  Scenario: Secure File Download - unauthenticated access is denied
    When I request the Secure File Download page without credentials
    Then Secure File Download access should be denied
    And the Secure File Download page should indicate the user is not authorized

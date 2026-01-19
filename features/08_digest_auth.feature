@feature @regression @feature_digest_auth @auth_admin
Feature: Digest Authentication

  Scenario: Digest Authentication - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Digest Authentication" example
    Then the Digest Authentication page should load
    And I exercise the Digest Authentication page

  Scenario: Digest Authentication - Footer shows Elemental Selenium attribution and link
    Given I open the Digest Authentication page
    Then the global footer should be valid


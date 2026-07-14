@feature @regression @feature_digest_auth
Feature: Digest Authentication

  @auth_admin
  Scenario: Digest Authentication - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Digest Authentication" example
    Then the Digest Authentication page should load
    And I exercise the Digest Authentication page

  @auth_admin
  Scenario: Digest Authentication - Footer shows Elemental Selenium attribution and link
    Given I open the Digest Authentication page
    Then the global footer should be valid

  Scenario: User is denied access to digest authentication without credentials
    When I open the Digest Authentication page without credentials
    Then the digest authentication request should be unauthorized
    And the response should include a Digest authentication challenge

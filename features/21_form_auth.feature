@feature @smoke @regression @feature_form_auth @feature_form_authentication
Feature: Form Authentication

  Scenario: Form Authentication - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Form Authentication" example
    Then the "Form Authentication" page should load
    And I exercise the "Form Authentication" page

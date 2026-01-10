@feature @regression @feature_geolocation @geo
Feature: Geolocation

  Scenario: Geolocation - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Geolocation" example
    Then the "Geolocation" page should load
    And I exercise the "Geolocation" page

@feature @regression @feature_geolocation
Feature: Geolocation

  @geo
  Scenario: Geolocation - reports the configured browser coordinates
    Given I am on the home page
    When I open the "Geolocation" example
    Then the Geolocation page should load
    When I request my location on the Geolocation page
    Then the Geolocation page should report the configured coordinates

  Scenario: Geolocation page shows the proper header and text
    Given I open the Geolocation page
    Then the Geolocation page should show the proper header and text

  Scenario: Geolocation - denied permission protects coordinate privacy
    Given I open the Geolocation page
    When I request my location on the Geolocation page
    Then the Geolocation page should not expose coordinates without permission

  Scenario: Geolocation - Footer shows Elemental Selenium attribution and link
    Given I open the Geolocation page
    Then the global footer should be valid

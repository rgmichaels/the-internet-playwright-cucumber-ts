@feature @smoke @regression @feature_home_page
Feature: Home Page

  Scenario: Home page source includes a populated title tag
    Given I am on the home page
    Then the home page should have a populated title tag

  Scenario: Example navigation retries one transient server error
    Given I am on the home page
    And the "JavaScript Alerts" example initially returns a transient server error
    When I open the "JavaScript Alerts" example
    Then the JavaScript Alerts page should load
    And the transient server error should be retried once

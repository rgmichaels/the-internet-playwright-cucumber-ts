@feature @regression @feature_js_onload_error
Feature: JavaScript onload event error

  Scenario: JavaScript onload event error - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "JavaScript onload event error" example
    Then the "JavaScript onload event error" page should load
    And I exercise the "JavaScript onload event error" page

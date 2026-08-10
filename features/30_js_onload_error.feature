@feature @regression @feature_js_onload_error
Feature: JavaScript onload event error

  Scenario: JavaScript onload event error - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "JavaScript onload event error" example
    Then the JavaScript onload event error page should load
    And I exercise the JavaScript onload event error page

  Scenario: JavaScript onload event error emits the documented runtime exception
    When I open the JavaScript onload event error page while observing runtime errors
    Then exactly one documented JavaScript onload error should be emitted
    And the JavaScript onload event error page should load


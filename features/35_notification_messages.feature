@feature @regression @feature_notification_messages
Feature: Notification Messages

  Scenario: Notification Messages - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Notification Messages" example
    Then the "Notification Messages" page should load
    And I exercise the "Notification Messages" page

  Scenario: Notification Messages - Footer shows Elemental Selenium attribution and link
    Given I open the "Notification Messages" page
    Then the global footer should be valid


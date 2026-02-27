@feature @regression @feature_notification_messages
Feature: Notification Messages

  Scenario: Notification Messages - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Notification Messages" example
    Then the Notification Messages page should load
    And I exercise the Notification Messages page

  Scenario: Notification Messages - flash message is valid and dismissible
    Given I open the Notification Messages page
    Then the Notification Messages flash should be one of the expected variants
    And the Notification Messages flash can be dismissed

  Scenario: Notification Messages - Footer shows Elemental Selenium attribution and link
    Given I open the Notification Messages page
    Then the global footer should be valid

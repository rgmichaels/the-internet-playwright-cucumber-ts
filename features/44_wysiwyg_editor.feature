@feature @regression @feature_wysiwyg_editor
Feature: WYSIWYG Editor

  Scenario: WYSIWYG Editor - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "WYSIWYG Editor" example
    Then the "WYSIWYG Editor" page should load
    And I exercise the "WYSIWYG Editor" page

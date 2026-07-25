@feature @regression @feature_wysiwyg_editor
Feature: WYSIWYG Editor

  Scenario: WYSIWYG Editor - matches its available editing state
    Given I am on the home page
    When I open the "WYSIWYG Editor" example
    Then the WYSIWYG Editor page should load
    And the WYSIWYG Editor should match its available editing state

  Scenario: WYSIWYG Editor - Footer shows Elemental Selenium attribution and link
    Given I open the WYSIWYG Editor page
    Then the global footer should be valid

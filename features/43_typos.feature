@feature @regression @feature_typos
Feature: Typos

  Scenario: Typos - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Typos" example
    Then the Typos page should load
    And I exercise the Typos page

  @smoke @about
  Scenario: Typos - Assert most of the text on the page
    Given I am on the typos page
    Then I should see the following text:
      | This example demonstrates a typo being introduced. |
      | Sometimes you'll see a typo, other times you |

  Scenario: Typos - Footer shows Elemental Selenium attribution and link
    Given I open the Typos page
    Then the global footer should be valid

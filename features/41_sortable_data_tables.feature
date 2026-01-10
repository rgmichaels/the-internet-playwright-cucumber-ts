@feature @regression @feature_sortable_data_tables
Feature: Sortable Data Tables

  Scenario: Sortable Data Tables - loads, asserts, and exercises behavior
    Given I am on the home page
    When I open the "Sortable Data Tables" example
    Then the "Sortable Data Tables" page should load
    And I exercise the "Sortable Data Tables" page

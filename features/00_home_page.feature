@feature @smoke @regression @feature_home_page
Feature: Home Page

  Scenario: Home page source includes a populated title tag
    Given I am on the home page
    Then the home page should have a populated title tag

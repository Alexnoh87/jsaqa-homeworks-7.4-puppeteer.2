Feature: Booking ticket

Scenario: Should booking one ticket
        Given user is on "/index.php" page
        When user select 3 day and movie
        And select and book 8 row and 1 seat
        Then user received confirmation

Scenario: Should booking two ticket
        Given user is on "/index.php" page
        When user select 3 day and movie
        And select and book 8 row and 3,4 seats
        Then user received confirmation

Scenario: Should booking two tickets
        Given user is on "/index.php" page
        When user select 3 day and movie
        And select and book with QR code 4 row and 7 seat 
        And user is on "/index.php" page
        When user select 3 day and movie
        And user selects the occupied 4 row and 7 seat
        Then Book button is not active
        
        

        
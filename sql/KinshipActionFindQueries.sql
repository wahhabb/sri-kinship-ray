##############################################################################
-- Queries to display data from KinshipAction tables                                  -
--                                                                           -
-- Numbers refer to use cases for traceability                               -
--                                                                           -
-- This is NOT meant to be run straight through as a script.                 -
-- Use these queries as templates for queries submitted through the website. -
--                                                                           -
##############################################################################

-- -----------------------
-- 
-- 2.1 Find events
-- 
-- -----------------------

-- 2.1.1 - Find Events

-- 2.1.1.a Search for events by issue

-- just get event name
SELECT EventName FROM eventissue
 WHERE IssueName = 'Land' ;

-- get event name and additional details
SELECT kevent.Name, kevent.Description
  FROM kevent INNER JOIN eventissue ON kevent.Name = eventissue.EventName
 WHERE eventissue.IssueName = 'Land' ;
 
 SELECT kevent.Name, kevent.Description
   FROM kevent, eventissue
  WHERE kevent.Name = eventissue.EventName
    AND eventissue.IssueName = 'Land' ;
 
 
-- 2.1.1.b Search for events by country
-- Need to join with kgroup table for country

-- get event name
-- using inner join
SELECT distinct kevent.Name, kevent.Location
  FROM groupevent
       INNER JOIN kevent ON kevent.Name = groupevent.EventName
       INNER JOIN kgroup ON kgroup.Name = groupevent.GroupName
 WHERE kgroup.Country = 'Canada' ;

-- using Where clause only, not inner join ; same results as above
SELECT distinct kevent.Name, kevent.Location
  FROM kevent, kgroup, groupevent
 WHERE kgroup.Country = 'Canada'
   AND kgroup.Name = groupevent.GroupName
   AND kevent.Name = groupevent.EventName ;



-- 2.1.1.c Search for events by state
-- Need to join with kgroup table for state

-- get event name
SELECT distinct kevent.Name, kevent.Location
  FROM groupevent
       INNER JOIN kevent ON kevent.Name = groupevent.EventName
       INNER JOIN kgroup ON kgroup.Name = groupevent.GroupName
 WHERE kgroup.StateProvince = 'BC' ;


SELECT distinct kevent.Name, kevent.Location
  FROM kevent, kgroup, groupevent
 WHERE kgroup.StateProvince = 'BC'
   AND kgroup.Name = groupevent.GroupName
   AND kevent.Name = groupevent.EventName ;



-- 2.1.1.d Search for events by city
-- Need to join with kgroup table for city

-- get event name
SELECT distinct kevent.Name, kevent.Location
  FROM groupevent
       INNER JOIN kevent ON kevent.Name = groupevent.EventName
       INNER JOIN kgroup ON kgroup.Name = groupevent.GroupName
 WHERE kgroup.City = 'Nelson' ;


SELECT distinct kevent.Name, kevent.Location
  FROM kevent, kgroup, groupevent
 WHERE kgroup.City = 'Nelson'
   AND kgroup.Name = groupevent.GroupName
   AND kevent.Name = groupevent.EventName ;


-- 2.1.1.e Search for events by date range
-- We need only look at kevent table

SELECT Name, Begin, End from kevent
 WHERE Begin >= '2021-03-01'
   AND End < '2021-04-01' ;

SELECT Name, Begin, End from kevent
 WHERE Begin >= '2021-04-01'
   AND End < '2021-04-10' ;


-- 2.1.1.f Search for events by action group

-- To get event name only, we just look at groupevent ;
SELECT EventName
  FROM groupevent
 Where GroupName = 'Org1' ;
 
-- To get event name and other data, we need to join with kgroup table 
SELECT distinct Name, RegistrationLink
  FROM kevent INNER JOIN groupevent ON groupevent.groupname = 'Org1' ;




-- 2.2.2 - Sort Events



-- 2.2.3 - View Specific event.

-- Show event data
SELECT * FROM kevent
 WHERE kevent.Name = 'Event3' ;

-- Show groups that sponsor a specific event
SELECT groupevent.GroupName
  FROM kevent INNER JOIN groupevent
    ON groupevent.EventName = kevent.Name
 WHERE kevent.Name = 'Event3' ;

-- This gives the same results as the inner join query above
SELECT groupevent.GroupName FROM kevent, groupevent
 WHERE kevent.Name = 'Event3'
   AND groupevent.EventName = kevent.Name ;


-- Show issues that a specific event is focused on
SELECT eventissue.IssueName
  FROM kevent INNER JOIN eventissue
    ON eventissue.EventName = kevent.Name
 WHERE kevent.Name = "Event3" ;
 
SELECT eventissue.IssueName
  FROM eventissue, kevent
 WHERE eventissue.EventName = kevent.Name
   AND kevent.Name = "Event3" ;


-- -----------------------
-- 
-- 2.1 Find action groups
-- 
-- -----------------------

-- 2.2.1.a - Find Action Groups by name

SELECT Name, Description 
  FROM kgroup
 WHERE Name LIKE 'Org%' ;

-- 2.2.1.b Find all groups interested in a certain issue 

-- Just the group name
SELECT GroupName from groupissue
 WHERE issueName = 'Air' ;

-- group name and other fields
SELECT Name, Description FROM kgroup
 INNER JOIN groupissue ON kgroup.Name = groupissue.GroupName
 WHERE groupissue.issueName = 'Air' ;

SELECT kgroup.Name, kgroup.Description
  FROM kgroup, groupissue
 WHERE kgroup.Name = groupissue.GroupName
   AND groupissue.issueName = 'Air' ;


-- 2.2.1.c Find all groups in a country 

SELECT Name, Description
  FROM kgroup
 WHERE Country = 'USA' ;


-- 2.2.1.d Find all groups in a state/province

SELECT Name, Description
  FROM kgroup
 WHERE StateProvince = 'WA' ;
 

-- 2.2.1.e Find all groups in a city 

SELECT Name, Description
  FROM kgroup
 WHERE City = 'Seattle' ;
 
-- 2.2.1.f Find all groups that sponsor a specific event 

SELECT kgroup.Name, kgroup.Description
  FROM kgroup, groupevent
 WHERE kgroup.Name = groupevent.GroupName
   AND groupevent.EventName = "Eating S'Mores" ;

SELECT kgroup.Name, kgroup.Description
  FROM kgroup INNER JOIN groupevent ON kgroup.Name = groupevent.GroupName
 WHERE groupevent.EventName = "Eating S'Mores" ;

-- 2.2.2 - Sort Action Groups

-- 2.2.3 - View Specific Action Group

SELECT *
  FROM kgroup 
 WHERE Name='Org1';

-- Find all issues that a group is interested in for display with the group details

-- Just the issue name
SELECT issueName from groupissue 
 WHERE GroupName = 'Org1' ;

-- issue name and description from join with groupissue table
SELECT Name, Description FROM issue
 INNER JOIN groupissue ON issue.Name = groupissue.issueName
 WHERE groupissue.GroupName = 'Org1' ;




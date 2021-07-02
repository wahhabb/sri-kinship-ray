##############################################################################
-- Queries to populate KinshipAction tables                                  -
--                                                                           -
-- Numbers refer to use cases for traceability                               -
--                                                                           -
-- You can run this straight through as a script to populate test data       -
-- Use these queries as templates for queries submitted through the website. -
--                                                                           -
##############################################################################

-- -----------------------
-- 
-- 2.5 Maintain issues
-- 
-- Note - In order to assign issues to action groups and events
-- you have to populate the issue table first
-- 
-- -----------------------


-- 2.5.1 - Create issue

INSERT INTO issue (Name, Description, OriginatorName, OriginatorEmail, OriginatorPhone, ApprovalStatus, StatusReason)
VALUES ('Ageism','','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Air','air quality','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Animal protection','animal welfare, cruelty, vegetarianism, etc.','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Elections','','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Feminism','','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Heterosexism','','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Immigration','','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Indigenous','Welfare and rights of indigenous, native and first nations people','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Islamophobia','','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Land','Legal and economic constraints on land use','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('LGBTQAA+','','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Other','','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Permaculture','Care for the earth, care for the people, share the surplus','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Religious persecution','','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Sustainable farming','','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Trans rights','','System','bmeacham@bmeacham.com','512-470-4606','Approved',''),
('Water','','System','bmeacham@bmeacham.com','512-470-4606','Approved','') ,
('Climate change','','System','bmeacham@bmeacham.com','512-470-4606','Approved','') ,
('Homelessness','','System','bmeacham@bmeacham.com','512-470-4606','Approved','')
;


-- 2.5.2 - Update issue

UPDATE issue 
   SET Description = "Discrimination against both old and young. Any discrimination on the basis of age."
   WHERE Name = 'Ageism';


-- 2.5.3 - Delete issue

-- DELETE FROM issue
-- WHERE Name = 'Ageism' ;


-- --------------------------
-- 
-- 2.4 Maintain action groups
-- 
-- --------------------------

-- 2.4.1 - Create action group

INSERT INTO kgroup VALUES (
'Org1',
'The first organization',
'https://xyzzy.com/',
'We are doing everything all at once',
'We need lots of stuff',
'Local',
'Wakil David Matthews',
'drmatthewsusa@gmail.com',
'+1 123-456-7890',
'Yes',
'101 Main Street',
'',
'Seattle',
'WA',
'98101',
'USA',
'System',
'bmeacham@bmeacham.com',
'512-470-4606',
'Approved',
''
);

INSERT INTO kgroup VALUES (
'Org2',
'The first organization',
'https://xyzzy.com/',
'We do it all day long',
'Chairs, tables, dishes, silverware',
'Local',
'Wakil David Matthews',
'drmatthewsusa@gmail.com',
'+1 123-456-7890',
'Yes',
'102 Main Street',
'',
'Seattle',
'WA',
'98101',
'USA',
'System',
'bmeacham@bmeacham.com',
'512-470-4606',
'Approved',
''
);

INSERT INTO kgroup VALUES (
'Org3',
'The third organization',
'https://xyzzy.com/',
'',
'',
'Regional',
'Sir Real',
'SirReal@null.com',
'+1 123-456-7890',
'Yes',
'',
'',
'',
'',
'',
'',
'System',
'bmeacham@bmeacham.com',
'512-470-4606',
'Approved',
''
);

-- 2.4.2 - Update action group

UPDATE kgroup 
   SET Description = "The second organization"
   WHERE Name = "Org2";


-- 2.4.3 - Delete action group

-- DELETE FROM kgroup 
--   WHERE Name = "Org3";



-- -----------------------------------------------------
-- 
-- Maintain groupissue
-- 
-- 2.4.1 - Create action group
-- This assigns issues to an action group as part of the 
-- process of creating the action group
-- 
-- -----------------------------------------------------

INSERT INTO groupissue (GroupName, issueName) VALUES
 ('Org1','Air') ,
 ('Org1','Elections')
;

INSERT INTO groupissue (GroupName, issueName) VALUES
 ('Org2','Air') ,
 ('Org2','Elections') ,
 ('Org2','Other')
;

INSERT INTO groupissue (GroupName, issueName) VALUES
 ('Org3','Permaculture') ,
 ('Org3','Sustainable Farming')
;

-- Update groupissue
-- Don't update the table as such. Delete and add rows as needed.

-- Delete from groupissue

-- DELETE FROM groupissue
--  WHERE Groupname = 'Org3' ;



-- -----------------------------------------------------
-- 
-- 2.3 Maintain events
-- 
-- Note - In order to assign action groups to events you
-- have to populate the event table first
-- 
-- -----------------------------------------------------


-- 2.3.1 - Create Event

INSERT INTO kevent VALUES (
"Eating S'Mores",  # Note - if value contains single quote, use double quotes around it.
'Just a fun group activity involving graham crackers, marshmallows, chocolate and heat',
'2021-03-01 13:00:00',
'2021-03-01 15:00:00',
'PST' ,
'',
'',
'Chuckee Cheese',
'chuckee@null.org',
'999-123-4567',
'No',
'http://null.com/smores',
'At the picnic area in Waldorf Park, Bellingham',
'', # Address1
'', # Address2
'', # City
'', # StateProvince
'', # PostalCode
'', # Country
'In-person',
'System',
'bmeacham@bmeacham.com',
'512-470-4606',
'Approved',
''
) ;

INSERT INTO kevent VALUES (
"Pacific Climate Warriors",
'We invite you to join us at the events and activities 350.org is involved in at Bonn, or contact us for more information and media materials related to these events.',
'2021-04-02 20:00:00',
'2021-04-02 22:00:00',
'PST' ,
'',
'',
'Wahhab Baldwin',
'wahhabb@gmail.com',
'+1 (206) 973-6751',
'Yes',
'https://pcs2017.org/en/evening-panels/',
'CAMPO Campusmensa Poppelsdorf',
'', # Address1
'', # Address2
'', # City
'', # StateProvince
'', # PostalCode
'', # Country
'Hybrid',
'System',
'bmeacham@bmeacham.com',
'512-470-4606',
'Approved',
''
);


INSERT INTO kevent VALUES (
'Event3',
'We invite you to join us.',
'2021-04-02 20:00:00',
'2021-04-02 22:00:00',
'PST' ,
'',
'',
'Wahhab Baldwin',
'wahhabb@gmail.com',
'+1 (206) 973-6751',
'Yes',
'https://us02web.zoom.us/j/84620810012?pwd=MEtVWVdwaDU3eFpoQVA0NnMzQTMrZz09',
'' ,
'', # Address1
'', # Address2
'', # City
'', # StateProvince
'', # PostalCode
'', # Country
'Online',
'System',
'bmeacham@bmeacham.com',
'512-470-4606',
'Approved',
''
);

INSERT INTO kevent VALUES (
'Event4',
'A big fat event that repeats',
'2021-04-02 20:00:00',
'2021-04-02 22:00:00',
'PST' ,
'Every other week' ,
'Yes' ,
'Wahhab Baldwin',
'wahhabb@gmail.com',
'+1 (206) 973-6751',
'Yes',
'https://us02web.zoom.us/j/84620810012?pwd=MEtVWVdwaDU3eFpoQVA0NnMzQTMrZz09',
'' ,
'', # Address1
'', # Address2
'', # City
'', # StateProvince
'', # PostalCode
'', # Country
'Online',
'System',
'bmeacham@bmeacham.com',
'512-470-4606',
'Approved',
''
);


-- 2.3.2 - Update events

UPDATE kevent SET End = '2021-04-02 22:30:00' 
 WHERE Name = 'Event3' ;

-- 2.3.3 - Delete events

-- DELETE FROM kevent
--  WHERE Name = 'Event3' ;


-- ---------------------------------------------------
-- 
-- Maintain groupevent
-- 
-- 2.3.1 - Create Event
-- This assigns action groups to events as part of the 
-- process of creating the event
-- 
-- ---------------------------------------------------

INSERT INTO groupevent (GroupName,EventName,PrimaryGroup) VALUES (
'Org1',
"Eating S'Mores",
'Yes'
) ;

INSERT INTO groupevent (GroupName,EventName,PrimaryGroup) VALUES (
'Org3',
"Eating S'Mores",
'No'
) ;

INSERT INTO groupevent (GroupName,EventName,PrimaryGroup) VALUES (
'Org2',
"Pacific Climate Warriors" ,
NUll
) ;

INSERT INTO groupevent (GroupName,EventName) VALUES (
'Org2',
"Event3"
) ;

INSERT INTO groupevent (GroupName,EventName) VALUES (
'Org1',
"Event3"
) ;

INSERT INTO groupevent (GroupName,EventName) VALUES (
'Org1',
"Event4"
) ;


-- Update groupevent
-- Don't update the table as such. Delete and add rows as needed.

-- Delete from groupevent

-- DELETE FROM groupevent
--  WHERE Groupname = 'Org3' ;


-- ---------------------------------------------------
-- 
-- Maintain eventissue
-- 
-- 2.3.1 - Create Event
-- This assigns issues to events as part of the 
-- process of creating the event
-- 
-- ---------------------------------------------------

INSERT INTO eventissue (EventName,issueName) VALUES (
"Eating S'Mores",
'Elections'
) ;

INSERT INTO eventissue (EventName,issueName) VALUES (
"Eating S'Mores",
'Feminism'
) ;

INSERT INTO eventissue (EventName,issueName) VALUES (
"Pacific Climate Warriors",
'Climate Change'
) ;

INSERT INTO eventissue (EventName,issueName) VALUES (
'Event3',
'Indigenous'
) ;

INSERT INTO eventissue (EventName,issueName) VALUES (
'Event3',
'Land'
) ;

INSERT INTO eventissue (EventName,issueName) VALUES (
'Event4',
'Land'
) ;


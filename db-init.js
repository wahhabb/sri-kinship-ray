const { credentials } = require("./config");
const mysql = require("mysql2/promise");
var conn;
const auth = credentials.mysql;
const createScript = `
DROP TABLE IF EXISTS GroupEvent ;

DROP TABLE IF EXISTS GroupIssue ;

DROP TABLE IF EXISTS EventIssue ;

DROP TABLE IF EXISTS KGroup ;

DROP TABLE IF EXISTS KEvent ;

DROP TABLE IF EXISTS Issue ;


# Create tables
# Create the child tables (the ones that have foreign keys)
# after the parent tables


CREATE TABLE KGroup (
Name   VARCHAR(255) NOT NULL ,
Description   VARCHAR(255) ,
Website   VARCHAR(255) ,
MissionStatement   TEXT ,
ResourcesNeeded   TEXT ,
OrgType   ENUM('Local', 'State-Province', 'Regional', 'National', 'International') ,
ContactPerson   VARCHAR(255) ,
ContactEmail   VARCHAR(255) ,
ContactPhone   VARCHAR(255) ,
TextOK   ENUM('Yes', 'No') ,
Address1   VARCHAR(255) ,
Address2   VARCHAR(255) ,
City   VARCHAR(255) ,
StateProvince   VARCHAR(255) ,
PostalCode   VARCHAR(255) ,
Country   VARCHAR(255) ,
Latitude   DECIMAL(10,7) ,
Longitude   DECIMAL(10,7) ,
PRIMARY KEY (Name)
) Engine=InnoDB ;



CREATE TABLE KEvent (
Name   VARCHAR(255) NOT NULL ,
Description   VARCHAR(255) ,
Begin   DATETIME ,
End   DATETIME ,
UTC_Offset   TINYINT ,
Zone   CHAR(5) ,
ContactPerson   VARCHAR(255) ,
ContactEmail   VARCHAR(255) ,
ContactPhone   VARCHAR(255) ,
TextOK   ENUM('Yes', 'No') ,
RegistrationLink   VARCHAR(255) ,
Location   VARCHAR(255) ,
Type   ENUM('In-person', 'Online', 'Hybrid') ,
Latitude   DECIMAL(10,7) ,
Longitude   DECIMAL(10,7) ,
PRIMARY KEY (Name)
) Engine=InnoDB ;


CREATE TABLE Issue (
Name   VARCHAR(255) NOT NULL ,
Description   VARCHAR(255) ,
PRIMARY KEY (Name)
) Engine=InnoDB ;



CREATE TABLE GroupEvent (
GroupName   VARCHAR(255) NOT NULL ,
EventName   VARCHAR(255) NOT NULL ,
PRIMARY KEY (GroupName, EventName) ,
FOREIGN KEY (GroupName) REFERENCES KGroup (Name)
	ON DELETE CASCADE
	ON UPDATE CASCADE ,
FOREIGN KEY (EventName) REFERENCES KEvent (Name) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
) Engine=InnoDB ;



CREATE TABLE GroupIssue (
GroupName   VARCHAR(255) NOT NULL ,
IssueName   VARCHAR(255) NOT NULL ,
PRIMARY KEY (GroupName, IssueName) ,
CONSTRAINT GroupName_fk
FOREIGN KEY (GroupName) REFERENCES KGroup (Name)
	ON DELETE CASCADE
	ON UPDATE CASCADE ,
CONSTRAINT IssueName_fk
FOREIGN KEY (IssueName) REFERENCES Issue (Name) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
) Engine=InnoDB ;


CREATE TABLE EventIssue (
EventName   VARCHAR(255) NOT NULL ,
IssueName   VARCHAR(255) NOT NULL ,
PRIMARY KEY (EventName, IssueName) ,
CONSTRAINT EventName_fk
FOREIGN KEY (EventName) REFERENCES KEvent (Name)
	ON DELETE CASCADE
	ON UPDATE CASCADE ,
CONSTRAINT IssueName1_fk
FOREIGN KEY (IssueName) REFERENCES Issue (Name) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
) Engine=InnoDB ;


INSERT INTO Issue (Name, Description)
  VALUES ('Ageism',''),
  ('Air','air quality'),
  ('Animal protection','animal welfare, cruelty, vegetarianism, etc.'),
  ('Elections',''),
  ('Feminism',''),
  ('Heterosexism',''),
  ('Immigration',''),
  ('Indigenous','Welfare and rights of indigenous, native and first nations people'),
  ('Islamophobia',''),
  ('Land','Political and economic constraints on land use'),
  ('LGBTQAA+',''),
  ('Other',''),
  ('Peace', 'Anti-war, pro-peace')
  ('Permaculture','Care for the earth, care for the people, share the surplus'),
  ('Religious persecution',''),
  ('Sustainable farming',''),
  ('Trans rights',''),
  ('Water','') ,
  ('Climate change','')
  ;
  
  
  -- 2.5.2 - Update issue
  
  UPDATE Issue 
     SET Description = "Discrimination against both old and young. Any discrimination on the basis of age."
     WHERE Name = 'Ageism';
  
  
  -- 2.5.3 - Delete issue
  
  DELETE FROM Issue
   WHERE Name = 'Ageism' ;
  
  
  -- --------------------------
  -- 
  -- 2.4 Maintain action groups
  -- 
  -- --------------------------
  
  
  -- 2.4.1 - Create action group
  
  INSERT INTO KGroup VALUES (
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
  47.493816 ,
  -122.306862
  );
  
  INSERT INTO KGroup VALUES (
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
  0,
  0
  );
  
  INSERT INTO KGroup VALUES (
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
  30.149748 ,
  -97.814468
  );
  
  -- 2.4.2 - Update action group
  
  UPDATE KGroup 
     SET Description = "The second organization"
     WHERE Name = "Org2";


INSERT INTO GroupIssue (GroupName, IssueName) VALUES
 ('Org1','Air') ,
 ('Org1','Elections')
;

INSERT INTO GroupIssue (GroupName, IssueName) VALUES
 ('Org2','Air') ,
 ('Org2','Elections') ,
 ('Org2','Other')
;

INSERT INTO GroupIssue (GroupName, IssueName) VALUES
 ('Org3','Permaculture') ,
 ('Org3','Sustainable Farming')
;

-- Update GroupIssue
-- Don't update the table as such. Delete and add rows as needed.

-- Delete from GroupIssue

DELETE FROM GroupIssue
 WHERE Groupname = 'Org3' ;



-- -----------------------------------------------------
-- 
-- 2.3 Maintain events
-- 
-- Note - In order to assign action groups to events you
-- have to populate the event table first
-- 
-- -----------------------------------------------------


-- 2.3.1 - Create Event

INSERT INTO KEvent VALUES (
"Eating S'Mores",  # Note - if value contains single quote, use double quotes around it.
'Just a fun group activity involving graham crackers, marshmallows, chocolate and heat',
'2021-03-01 13:00:00',
'2021-03-01 15:00:00',
-7 ,
'PST' ,
'Chuckee Cheese',
'chuckee@null.org',
'999-123-4567',
'No',
'http://null.com/smores',
'At the picnic area in Waldorf Park, Bellingham',
'In-person',
'',
''
) ;

INSERT INTO KEvent VALUES (
"Pacific Climate Warriors at the First People's Climate Summit Evening Panel",
'We invite you to join us at the events and activities 350.org is involved in at Bonn, or contact us for more information and media materials related to these events.',
'2021-04-02 20:00:00',
'2021-04-02 22:00:00',
-7 ,
'PST' ,'Wahhab Baldwin',
'wahhabb@gmail.com',
'+1 (206) 973-6751',
'Yes',
'https://pcs2017.org/en/evening-panels/',
'CAMPO Campusmensa Poppelsdorf',
'Hybrid',
47.493816 ,
-122.306862
);


INSERT INTO KEvent VALUES (
'Event3',
'We invite you to join us.',
'2021-04-02 20:00:00',
'2021-04-02 22:00:00',
-5 ,
'PST' ,
'Wahhab Baldwin',
'wahhabb@gmail.com',
'+1 (206) 973-6751',
'Yes',
'',
'https://us02web.zoom.us/j/84620810012?pwd=MEtVWVdwaDU3eFpoQVA0NnMzQTMrZz09',
'Online',
30.149748 ,
-97.814468
);
`.split(";");

async function do_init() {
  try {
    const conn = await mysql.createConnection(auth);
    console.log("creating database schema");
    createScript.forEach(async (q) => {
      if (q.trim().length)
        try {
          await conn.query(q);
          console.log("Success on " + q);
        } catch (err) {
          console.log("Fail on " + q);
        }
    });
    conn.end();
  } catch (err) {
    console.log("ERROR: could not run all queries");
    console.log(err.message);
  }
}
do_init();

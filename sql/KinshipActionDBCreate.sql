###################################################
#                                                 #
# Script to create KinshipAction database tables  #
#                                                 #
# You can run this straight through to create     #
# the database and all its tables or you can run  #
# specific pieces as needed.                      #
#                                                 #
# Version 3 - changes approved in review 20210318 #
#                                                 #
###################################################

# Create database and switch to using it

DROP DATABASE IF EXISTS KinshipAction ;

CREATE DATABASE KinshipAction ;

USE KinshipAction ;


# First drop tables if they exist to start clean
# Drop the tables that have foreign keys first

DROP TABLE IF EXISTS groupevent ;

DROP TABLE IF EXISTS groupissue ;

DROP TABLE IF EXISTS eventissue ;

DROP TABLE IF EXISTS kgroup ;

DROP TABLE IF EXISTS kevent ;

DROP TABLE IF EXISTS issue ;


# Create tables
# Create the child tables (the ones that have foreign keys)
# after the parent tables


CREATE TABLE kgroup (
Name   VARCHAR(255) NOT NULL ,
Description   VARCHAR(255) NOT NULL ,
Website   VARCHAR(255) ,
MissionStatement   TEXT ,
ResourcesNeeded   TEXT ,
OrgType   ENUM('Local', 'State-Province', 'Regional', 'National', 'International') ,
ContactPerson   VARCHAR(255) ,
ContactEmail   VARCHAR(255) NOT NULL ,
ContactPhone   VARCHAR(255) ,
TextOK   ENUM('Yes', 'No') ,
Address1   VARCHAR(255) ,
Address2   VARCHAR(255) ,
City   VARCHAR(255) ,
StateProvince   VARCHAR(255) ,
PostalCode   VARCHAR(255) ,
Country   VARCHAR(255) ,
-- OriginatorName   VARCHAR(255) NOT NULL ,
OriginatorEmail   VARCHAR(255) NOT NULL ,
-- OriginatorPhone   VARCHAR(255) NOT NULL ,
-- ApprovalStatus   ENUM('Pending', 'Approved', 'Rejected') NOT NULL ,
-- StatusReason   VARCHAR(255) ,
PRIMARY KEY (Name)
) Engine=InnoDB ;



CREATE TABLE kevent (
Name   VARCHAR(255) NOT NULL ,
Description   VARCHAR(255) ,
GroupName VARCHAR(255) ,
Begin   DATETIME NOT NULL ,
End   DATETIME ,
-- Zone changed
Zone   VARCHAR(255) NOT NULL ,
DateTimeDescription VARCHAR(255) ,
Repeats ENUM('Yes', 'No') ,
ContactPerson   VARCHAR(255) ,
ContactEmail   VARCHAR(255) ,
ContactPhone   VARCHAR(255) ,
TextOK   ENUM('Yes', 'No') ,
RegistrationLink   VARCHAR(255) ,
Location   VARCHAR(255) ,
Address1   VARCHAR(255) ,
Address2   VARCHAR(255) ,
City   VARCHAR(255) ,
StateProvince   VARCHAR(255) ,
PostalCode   VARCHAR(255) ,
Country   VARCHAR(255) ,
Type   ENUM('In-person', 'Online', 'Hybrid') ,
-- OriginatorName   VARCHAR(255) NOT NULL ,
OriginatorEmail   VARCHAR(255) NOT NULL ,
-- OriginatorPhone   VARCHAR(255) NOT NULL ,
-- ApprovalStatus   ENUM('Pending', 'Approved', 'Rejected') NOT NULL ,
-- StatusReason   VARCHAR(255) ,
PRIMARY KEY (Name)
) Engine=InnoDB ;


CREATE TABLE issue (
Name   VARCHAR(255) NOT NULL ,
Description   VARCHAR(255) ,
-- OriginatorName   VARCHAR(255) NOT NULL ,
OriginatorEmail   VARCHAR(255) NOT NULL ,
-- OriginatorPhone   VARCHAR(255) NOT NULL ,
-- ApprovalStatus   ENUM('Pending', 'Approved', 'Rejected') NOT NULL ,
-- StatusReason   VARCHAR(255) ,
PRIMARY KEY (Name)
) Engine=InnoDB ;



CREATE TABLE groupevent (
GroupName   VARCHAR(255) NOT NULL ,
EventName   VARCHAR(255) NOT NULL ,
PrimaryGroup ENUM ('Yes','No') ,
PRIMARY KEY (GroupName, EventName) ,
CONSTRAINT GroupName_fk
FOREIGN KEY (GroupName) REFERENCES kgroup (Name)
	ON DELETE CASCADE
	ON UPDATE CASCADE ,
CONSTRAINT EventName_fk
FOREIGN KEY (EventName) REFERENCES kevent (Name) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
) Engine=InnoDB ;



CREATE TABLE groupissue (
GroupName   VARCHAR(255) NOT NULL ,
IssueName   VARCHAR(255) NOT NULL ,
PRIMARY KEY (GroupName, IssueName) ,
CONSTRAINT GroupName_fk1
FOREIGN KEY (GroupName) REFERENCES kgroup (Name)
	ON DELETE CASCADE
	ON UPDATE CASCADE ,
CONSTRAINT IssueName_fk1
FOREIGN KEY (IssueName) REFERENCES issue (Name) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
) Engine=InnoDB ;


CREATE TABLE eventissue (
EventName   VARCHAR(255) NOT NULL ,
IssueName   VARCHAR(255) NOT NULL ,
PRIMARY KEY (EventName, IssueName) ,
CONSTRAINT EventName_fk2
FOREIGN KEY (EventName) REFERENCES kevent (Name)
	ON DELETE CASCADE
	ON UPDATE CASCADE ,
CONSTRAINT IssueName_fk2
FOREIGN KEY (IssueName) REFERENCES issue (Name) 
	ON DELETE CASCADE
	ON UPDATE CASCADE
) Engine=InnoDB ;

CREATE TABLE users (
	Email VARCHAR(255) NOT NULL ,
	Name VARCHAR(255) ,
	Confirmed ENUM ('Yes', 'No', 'Admin'),
PRIMARY KEY (Email)
) Engine=InnoDB ;


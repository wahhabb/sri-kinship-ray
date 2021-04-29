const { Pool } = require("pg");
const _ = require("lodash");

const { credentials } = require("./config");
const mysql = require("mysql2/promise");

const auth = credentials.mysql;

const pool = mysql.createPool(auth);
const issueNames = [];
const groupNames = [];

module.exports = {
  getKGroups: async (all, searchIssues, text, groupname, forUser, sort) => {
    var results;
    try {
      var sql;
      if (searchIssues && searchIssues.length) {
        sql = `SELECT * FROM kgroup gr INNER JOIN groupissue gi 
          ON gr.Name = gi.GroupName
          WHERE IssueName IN ('${searchIssues.join("', '")}') GROUP BY gr.Name`;
      } else if (text) {
        sql = "SELECT * FROM kgroup WHERE TRUE";
        if (text.pName)
          sql += " AND name LIKE " + pool.escape(text.pName + "%");
        if (text.pDescription)
          sql +=
            " AND description LIKE " + pool.escape(text.pDescription + "%");
        if (text.pCity)
          sql += " AND city LIKE " + pool.escape(text.pCity + "%");
        if (text.pGroupName)
          sql += " AND groupName LIKE " + pool.escape(text.pGroupName + "%");
        if (text.pStateProvince)
          sql +=
            " AND stateProvince LIKE " + pool.escape(text.pStateProvince + "%");
        if (text.pCountry)
          sql += " AND country LIKE " + pool.escape(text.pCountry + "%");
        sql = sql.split("'*").join("'%");
      } else if (groupname) {
        sql = "SELECT * FROM kgroup WHERE name = " + pool.escape(groupname);
      } else if (forUser) {
        sql =
          "SELECT * FROM kgroup WHERE OriginatorEmail = " +
          pool.escape(forUser);
      } else {
        // all
        sql = `SELECT * FROM kgroup`;
      }
      if (sort === "name") sql += " ORDER BY Name";
      else if (sort === "place")
        sql += " ORDER BY Country, StateProvince, City";
      results = await pool.query(sql);
    } catch (err) {
      console.error("Error in getKGroups: ", err);
      throw err;
    }
    const kgroups = results[0].map((row) => {
      const kgroup = _.mapKeys(row, (v, k) => _.camelCase(k));
      return kgroup;
    });
    return kgroups;
  },

  getGroupNames: async (params, user) => {
    // Note: groupNames list is updated if one is added or edited.
    if (groupNames.length === 0) {
      var results;
      try {
        results = await pool.query("SELECT Name FROM kgroup ORDER BY Name");
      } catch (err) {
        console.error("Error in getGroupNames: ", err);
        throw err;
      }
      results[0].forEach((group) => {
        groupNames.push(group.Name);
      });
    }
    return groupNames;
  },

  insertKGroup: async (params, user) => {
    const Name = params.pName;
    const Description = params.pDescription;
    const Website = params.pWebsite ? params.pWebsite : null;
    const MissionStatement = params.pMissionStatement
      ? params.pMissionStatement
      : null;
    const ResourcesNeeded = params.pResourcesNeeded
      ? params.pResourcesNeeded
      : null;
    const OrgType = params.pOrgType ? params.pOrgType : null;
    const ContactPerson = params.pContactPerson ? params.pContactPerson : null;
    const ContactEmail = params.pContactEmail ? params.pContactEmail : null;
    const ContactPhone = params.pContactPhone ? params.pContactPhone : null;
    const TextOK = params.pTextOK ? params.pTextOK : null;
    const Address1 = params.pAddress1 ? params.pAddress1 : null;
    const Address2 = params.pAddress2 ? params.pAddress2 : null;
    const City = params.pCity ? params.pCity : null;
    const StateProvince = params.pStateProvince ? params.pStateProvince : null;
    const PostalCode = params.pPostalCode ? params.pPostalCode : null;
    const Country = params.pCountry ? params.pCountry : null;
    const OriginatorEmail = user;
    try {
      await pool.query("INSERT INTO kgroup SET ?", {
        Name,
        Description,
        Website,
        MissionStatement,
        ResourcesNeeded,
        OrgType,
        ContactPerson,
        ContactEmail,
        ContactPhone,
        TextOK,
        Address1,
        Address2,
        City,
        StateProvince,
        PostalCode,
        Country,
        OriginatorEmail,
      });
      groupNames.push(Name);
      groupNames.sort();
    } catch (err) {
      if (err.code !== "ER_DUP_ENTRY") console.error(err);
      throw err;
    }
  },

  getGroupIssues: async (kgroups) => {
    for (const kgroup of kgroups) {
      kgroup.issues = [];
      const sql2 =
        "SELECT IssueName FROM groupissue WHERE GroupName = " +
        pool.escape(kgroup.name);
      var results;
      try {
        results = await pool.query(sql2);
      } catch (err) {
        console.error("Error in getGroupIssues: ", err);
        throw err;
      }
      results[0].forEach((issue) => {
        kgroup.issues.push(issue.IssueName);
      });
    }
    return 0;
  },

  updateKGroup: async (body) => {
    var results;
    const updates = {
      Name: body.pName,
      Description: body.pDescription,
      Website: body.pWebsite,
      MissionStatement: body.pMissionStatement,
      ResourcesNeeded: body.pResourcesNeeded,
      OrgType: body.pOrgType,
      ContactPerson: body.pContactPerson,
      ContactEmail: body.pContactEmail,
      ContactPhone: body.pContactPhone,
      TextOK: body.pTextOK,
      Address1: body.pAddress1,
      Address2: body.pAddress2,
      City: body.pCity,
      StateProvince: body.pStateProvince,
      PostalCode: body.pPostalCode,
      Country: body.country,
    };
    try {
      results = await pool.query("UPDATE kgroup SET ? WHERE Name = ?", [
        updates,
        body.pOriginalName,
      ]);
      if (body.pName != body.pOriginalName) {
        // Update groupNames on name change
        _.remove(groupNames, (name) => name === body.pOriginalName);
        groupNames.push(body.pName);
        groupNames.sort();
      }
    } catch (err) {
      console.error("Error in updateKGroup: ", err);
      throw err;
    }
  },

  getEventIssues: async (kevents) => {
    for (const kevent of kevents) {
      kevent.issues = [];
      var results;
      try {
        const sql2 =
          "SELECT IssueName FROM eventissue WHERE EventName = " +
          pool.escape(kevent.name);
        results = await pool.query(sql2);
      } catch (err) {
        console.error("Error in getGroupIssues: ", err);
        throw err;
      }
      results[0].forEach((issue) => {
        kevent.issues.push(issue.IssueName);
      });
    }
    return 0;
  },

  getIssueNames: async () => {
    // TODO: Update issueNames if one is added or edited. use Dirty flag.
    if (issueNames.length === 0) {
      var results;
      try {
        results = await pool.query("SELECT Name FROM issue");
      } catch (err) {
        console.error("Error in getIssueNames: ", err);
        throw err;
      }
      results[0].forEach((issue) => {
        issueNames.push(issue.Name);
      });
    }
    return issueNames;
  },

  getKEvents: async (all, searchIssues, text, eventname, forUser, sort) => {
    var results;
    try {
      var sql;
      if (searchIssues.length) {
        sql = `SELECT * FROM kevent ev INNER JOIN eventissue ie 
          ON ev.Name = ie.EventName
          WHERE IssueName IN ('${searchIssues.join("', '")}') GROUP BY ev.Name`;
      } else if (text) {
        sql = "SELECT * FROM kevent WHERE TRUE";
        if (text.pName)
          sql += " AND name LIKE " + pool.escape(text.pName + "%");
        if (text.pDescription)
          sql +=
            " AND description LIKE " + pool.escape(text.pDescription + "%");
        if (text.pGroupName)
          sql += " AND groupName LIKE " + pool.escape(text.pGroupName + "%");
        if (text.pCity) sql += " AND city LIKE " + pool.escape(text.pCity);
        if (text.pStateProvince)
          sql += " AND stateProvince LIKE " + pool.escape(text.pStateProvince);
        if (text.pCountry)
          sql += " AND country LIKE " + pool.escape(text.pCountry + "%");
        sql = sql.split("'*").join("'%");
      } else if (eventname) {
        sql = "SELECT * FROM kevent WHERE name = " + pool.escape(eventname);
      } else if (forUser) {
        sql =
          "SELECT * FROM kevent WHERE OriginatorEmail = " +
          pool.escape(forUser);
      } else {
        // all
        sql = `SELECT * FROM kevent`;
      }
      if (sort === "name") sql += " ORDER BY Name";
      else if (sort === "group") sql += " ORDER BY GroupName";
      else if (sort === "begin") sql += " ORDER BY Begin";
      else if (sort === "group") sql += " ORDER BY End";
      results = await pool.query(sql);
      console.log(sql);
    } catch (err) {
      console.log(sql);
      console.error("Error in getKEvents: ", err);
      throw err;
    }
    const kevents = results[0].map((row) => {
      const kevent = _.mapKeys(row, (v, k) => _.camelCase(k));
      return kevent;
    });
    return kevents;
  },

  deleteKEvent: async (name) => {
    try {
      await pool.query("DELETE FROM kevent WHERE Name = ?", [name]);
      await pool.query("DELETE FROM eventissue WHERE EventName = ?", [name]);
    } catch (err) {
      console.error("Error in deleteKEvent: ", err);
      throw err;
    }
  },

  deleteKGroup: async (name) => {
    try {
      await pool.query("DELETE FROM kgroup WHERE Name = ?", [name]);
      await pool.query("DELETE FROM groupissue WHERE GroupName = ?", [name]);
    } catch (err) {
      console.error("Error in deleteKGroup: ", err);
      throw err;
    }
  },

  insertGroupIssue: async (groupName, issueName) => {
    try {
      await pool.query(
        "INSERT INTO groupissue (GroupName, IssueName) VALUES (?, ?)",
        [groupName, issueName]
      );
    } catch (err) {
      console.error("Error in insertGroupIssue: ", err);
      throw err;
    }
  },

  clearGroupIssues: async (groupName) => {
    try {
      await pool.query("DELETE FROM groupissue where GroupName = ?", groupName);
    } catch (err) {
      console.error("Error in clearGroupIssues: ", err);
      throw err;
    }
  },

  insertKEvent: async (params, user) => {
    const Name = params.pName ? params.pName : null;
    const Description = params.pDescription ? params.pDescription : null;
    const GroupName = params.pGroup ? params.pGroup : null;
    const Begin = new Date(params.pBeginDate + " " + params.pBeginTime);
    const End = new Date(params.pEndDate + " " + params.pEndTime);
    const ContactPerson = params.pContactPerson ? params.pContactPerson : null;
    const ContactEmail = params.pContactEmail ? params.pContactEmail : null;
    const ContactPhone = params.pContactPhone ? params.pContactPhone : null;
    const TextOK = params.pTextOK ? params.pTextOK : null;
    const RegistrationLink = params.pRegistrationLink
      ? params.pRegistrationLink
      : null;
    const Location = params.pLocation ? params.pLocation : null;

    // TODO: Use local time!!!
    // console.log("*" + params.pBeginDate + "*" + params.pBeginTime + "*");
    // console.log("Begin:", Begin);
    // console.log("End:", End);

    const Address1 = params.pAddress1 ? params.pAddress1 : null;
    const Address2 = params.pAddress2 ? params.pAddress2 : null;
    const City = params.pCity ? params.pCity : null;
    const StateProvince = params.pStateProvince ? params.pStateProvince : null;
    const PostalCode = params.pPostalCode ? params.pPostalCode : null;
    const Country = params.pCountry ? params.pCountry : null;
    const Type = params.pType ? params.pType : null;
    const OriginatorEmail = user;
    try {
      await pool.query("INSERT INTO kevent SET ?", {
        Name,
        Description,
        GroupName,
        Begin,
        End,
        ContactPerson,
        ContactEmail,
        ContactPhone,
        TextOK,
        RegistrationLink,
        Address1,
        Address2,
        City,
        StateProvince,
        PostalCode,
        Country,
        Type,
        OriginatorEmail,
      });
    } catch (err) {
      console.error("Error in insertKEvent: ", err);
      if (err.code !== "ER_DUP_ENTRY") {
        console.log("query is: ", query.sql);
        console.error("Error in insertKEvent: ", err);
      }
      throw err;
    }
  },

  updateKEvent: async (body) => {
    var results;
    const Begin = new Date(body.pBeginDate + " " + body.pBeginTime);
    const End = new Date(body.pEndDate + " " + body.pEndTime);
    // TODO: Validate Begin and End dates
    const updates = {
      Name: body.pName,
      Description: body.pDescription,
      GroupName: body.pGroupName,
      Begin: Begin,
      End: End,
      ContactPerson: body.pContactPerson,
      ContactEmail: body.pContactEmail,
      ContactPhone: body.pContactPhone,
      TextOK: body.pTextOK,
      RegistrationLink: body.pRegistrationLink,
      Address1: body.pAddress1,
      Address2: body.pAddress2,
      City: body.pCity,
      StateProvince: body.pStateProvince,
      PostalCode: body.pPostalCode,
      Country: body.pCountry,
      Type: body.pType,
    };
    try {
      results = await pool.query("UPDATE kevent SET ? WHERE Name = ?", [
        updates,
        body.pOriginalName,
      ]);
    } catch (err) {
      console.error("Error in updateKEvent: ", err);
      throw err;
    }
  },

  insertEventIssue: async (eventName, issueName) => {
    try {
      await pool.query(
        "INSERT INTO eventissue (EventName, IssueName) VALUES (?, ?)",
        [eventName, issueName]
      );
    } catch (err) {
      console.error("Error in insertEventIssue: ", err);
      throw err;
    }
  },

  clearEventIssues: async (eventName) => {
    try {
      await pool.query("DELETE FROM eventissue WHERE EventName = ?", eventName);
    } catch (err) {
      console.error("Error in clearEventIssues: ", err);
      throw err;
    }
  },

  insertUser: async (user, name) => {
    var sql;
    try {
      await pool.query("DELETE FROM users WHERE  Email = ?", user);
      sql = pool.format("INSERT INTO users VALUES (?, ?, 'No')", [user, name]);
      await pool.query(sql);
    } catch (err) {
      console.error("Error in insertUser: ", sql, err);
      throw err;
    }
  },

  verifyUser: async (email) => {
    var sql;
    try {
      const results = await pool.query("SELECT * FROM users WHERE  Email = ?", [
        email,
      ]);
      sql = pool.format("UPDATE users SET Confirmed = 'Yes' where Email = ?", [
        email,
      ]);
      await pool.query(sql);
      return results;
    } catch (err) {
      console.error("Error in verifyUser: ", sql, err);
      throw err;
    }
  },

  checkUser: async (email) => {
    var sql;
    try {
      const results = await pool.query("SELECT * FROM users WHERE  Email = ?", [
        email,
      ]);
      return results;
    } catch (err) {
      console.error("Error in checkUser: ", sql, err);
      throw err;
    }
  },
};

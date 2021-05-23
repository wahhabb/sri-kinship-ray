const { forEach } = require("lodash");
const { getIssues, getGroupNames } = require("../db");
const db = require("../db");
const nodemailer = require("nodemailer");

const mapIssueNames = async (res) => {
  var issueNames;
  try {
    issueNames = await db.getIssueNames();
  } catch (err) {
    console.error("Error in mapIssueNames: getIssueNames failed", err);
    throw err;
  }
  return issueNames.map((name) => {
    return {
      name: name,
      deblankName: name.replace(/ /g, "^^"),
    };
  });
};

exports.api = {};

exports.home = (req, res) => res.render("home");

exports.login = (req, res) => res.render("login");

exports.doLogin = async (req, res) => {
  if (req.body.pName) {
    // New user is signing up
    if (!req.body.pUser) {
      // TODO: Validate email address better
      const context = {
        failMessages: ["Please enter a valid email address"],
        pName: req.body.pName,
      };
      res.render("login", context);
    }
    try {
      await db.insertUser(req.body.pUser, req.body.pName);
      let transporter = nodemailer.createTransport({
        host: "mi3-ss58.a2hosting.com",
        port: 465,
        secure: true,
        auth: {
          user: "do-not-reply@sri-kinship-ray.org",
          pass: "nOWiStHEtIME11:11",
        },
      });
      let info = await transporter.sendMail({
        from: "do-not-reply@sri-kinship-ray.org",
        to: req.body.pUser,
        subject: "Verify your email",

        // TODO: Obscure the parameter
        html:
          'Please click <a href="https://sri-kinship-ray.org/v3rf7q?email=' +
          req.body.pUser +
          '">this link</a> to complete your sign up for the Sufi Ruhaniat Order Kinship Ray ' +
          "website. If you did not intend to sign up, just ignore this email.",
      });
      res.render("confirm");
    } catch (err) {
      console.error("Error in doLogin 1", err);
      res.render("500");
    }
  } else {
    // User is logging in
    const email = req.body.pUser;
    results = await db.checkUser(email.toLowerCase());
    if (!results[0].length) {
      const context = {
        failMessages: ["Email not found. Please correct or sign up below."],
        email: email,
      };
      res.render("login", context);
    } else if (results[0][0].Confirmed === "No") {
      const context = {
        failMessages: [
          "Email has not been verified. Please click on the link in your verification email or sign up again below.",
        ],
        email: email,
      };
      res.render("login", context);
    } else {
      res.cookie("sriuser", email, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        sameSite: true,
      });
      // TODO: Create success message, forward to referrer (if any)
      const context = {
        name: results[0][0].Name,
        email: email,
      };
      // TODO: Not working on site
      // req.session.name = context.name;
      // req.session.email = email;
      res.render("loggedin");
    }
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const email = req.query.email;
    results = await db.verifyUser(email);
    const context = {
      name: results[0][0].Name,
      email: email,
    };
    res.cookie("sriuser", email, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      sameSite: true,
    });
    res.render("confirmed", context);
  } catch (err) {
    console.error("Error in verifyEmail", err);
    res.render("500");
  }
};

exports.resAntiRacism = (req, res) => res.render("antiracism");

exports.addKGroup = async (req, res) => {
  // Check for logged-in user
  if (req.cookies.sriuser) {
    try {
      const context = {
        issueNames: await mapIssueNames(),
      };
      res.render("addkgroup", context);
    } catch (err) {
      console.error("Error in addKGroup", err);
      res.render("500");
    }
  } else {
    res.redirect("login");
  }
};

exports.doAddKGroup = async (req, res) => {
  try {
    await db.insertKGroup(req.body, req.cookies.sriuser);
    for (const key in req.body) {
      if (key[0] !== "p")
        await db.insertGroupIssue(req.body.pName, req.body[key]);
    }
    // Need to redisplay page with success message and fields cleared
    var context = {
      issueNames: await mapIssueNames(res),
      successMessage: true,
    };
    res.render("addkgroup", context);
  } catch (err) {
    if (err.code !== "ER_DUP_ENTRY") {
      // On failure not duplicate entry, give 500 error
      console.error("doAddKGroup: Insert failed on KGroup", err);
      res.render("500");
    }
    // Need to redisplay page with error message
    failMessages = [
      "An entry with this name already exists. Please change your entry or \
        edit the existing one.",
    ];
    context = {
      failMessages: failMessages,
      issueNames: await mapIssueNames(res),
      redisplay: req.body,
    };
    context.issueNames.forEach((n) => {
      if (req.body[n.deblankName]) n["checked"] = true;
    });
    res.render("addkgroup", context);
  }
};

exports.selectKGroup = async (req, res) => {
  // Check for logged-in user
  var user;
  if (req.cookies.sriuser) {
    try {
      user = req.cookies.sriuser.toLowerCase();
      results = await db.checkUser(user);
      const confirmed = results[0][0].Confirmed;
      var all = false;
      var forUser = null;
      if (confirmed === "Admin") {
        all = true;
      } else {
        forUser = user;
      }
      const kgroups = await db.getKGroups(all, false, false, null, forUser);

      await db.getGroupIssues(kgroups);
      const context = {
        success: req.body.pName,
        kgroups: kgroups.map((kgroup) => {
          return {
            name: kgroup.name,
            description: kgroup.description,
          };
        }),
      };
      res.render("kgroupselect", context);
    } catch (err) {
      console.error("Error in selectKGroup", err);
      res.render("500");
    }
  } else {
    res.redirect("login");
  }
};

const mapKGroups = (kgroups) => {
  return kgroups.map((kgroup) => {
    return {
      name: kgroup.name,
      description: kgroup.description,
      website: kgroup.website,
      missionStatement: kgroup.missionStatement,
      resourcesNeeded: kgroup.resourcesNeeded,
      orgType: kgroup.orgType,
      contactPerson: kgroup.contactPerson,
      contactEmail: kgroup.contactEmail,
      contactPhone: kgroup.contactPhone,
      textOK: kgroup.textOk,
      address1: kgroup.address1,
      address2: kgroup.address2,
      city: kgroup.city,
      stateProvince: kgroup.stateProvince,
      postalCode: kgroup.postalCode,
      country: kgroup.country,
      issues: kgroup.issues,
    };
  });
};

const mapKEvents = (kevents) => {
  return kevents.map((kevent) => {
    return {
      name: kevent.name,
      description: kevent.description,
      groupName: kevent.groupName,
      begin: kevent.begin.toLocaleString(),
      end: kevent.end.toLocaleString(),
      utcOffset: kevent.uTCOffset,
      zone: kevent.zone,
      contactPerson: kevent.contactPerson,
      contactEmail: kevent.contactEmail,
      contactPhone: kevent.contactPhone,
      textOK: kevent.textOk,
      registrationLink: kevent.registrationLink,
      address1: kevent.address1,
      address2: kevent.address2,
      city: kevent.city,
      stateProvince: kevent.stateProvince,
      postalCode: kevent.postalCode,
      country: kevent.country,
      type: kevent.type,
      issues: kevent.issues,
    };
  });
};

exports.editKGroup = async (req, res) => {
  // Check for logged-in user
  if (req.cookies.sriuser) {
    if (req.body.editgroup) {
      if (req.body.deletegroup) {
        // delete entry
        try {
          const name = req.body.deletegroup;
          await db.deleteKGroup(name);
          this.selectKGroup(req, res);
          return;
        } catch {
          console.error("Error in editKGroup on delete", err);
          res.render("500");
          return;
        }
      }
      try {
        const kgroups = await db.getKGroups(
          false,
          [],
          false,
          req.body.editgroup
        );
        await db.getGroupIssues(kgroups);
        var context = {
          editgroup: true,
          issueNames: await mapIssueNames(res),
          kgroup: mapKGroups(kgroups)[0],
        };
        context.issueNames.forEach((n) => {
          if (context.kgroup.issues.includes(n.name)) n["checked"] = true;
        });
        res.render("addkgroup", context);
      } catch (err) {
        console.error("Error in editKGroup", err);
        res.render("500");
      }
    } else {
      try {
        await db.updateKGroup(req.body);
        await db.clearGroupIssues(req.body.pOriginalName);
        for (const key in req.body) {
          if (key[0] !== "p")
            await db.insertGroupIssue(req.body.pName, req.body[key]);
        }
        this.selectKGroup(req, res);
      } catch (err) {
        console.error("Error in editKGroup", err);
        res.render("500");
      }
    }
  } else {
    res.redirect("login");
  }
};

exports.getGroupCriteria = async (req, res) => {
  try {
    const context = {
      issueNames: await mapIssueNames(res),
      gettingCriteria: true,
    };
    res.render("kgroups", context);
  } catch (err) {
    console.error("Error in getGroupCriteria", err);
    res.render("500");
  }
};

exports.listKGroups = async (req, res) => {
  try {
    const searchIssues = [];
    const all = req.body.pshow === "all";
    const sort = req.body.psort;
    const page = req.body.ppage ? parseInt(req.body.ppage) : 0;
    if (req.body.pshow === "issue") {
      for (const key in req.body) {
        if (key[0] !== "p") searchIssues.push(req.body[key]);
      }
    }
    var text = req.body.pshow === "text";
    if (text) {
      text = {
        pName: req.body.pName,
        pDescription: req.body.pDescription,
        pGroupName: req.body.pGroupName,
        pCity: req.body.pCity,
        pStateProvince: req.body.pStateProvince,
        pCountry: req.body.pCountry,
      };
    }
    const kgroups = await db.getKGroups(
      all,
      searchIssues,
      text,
      page,
      sort,
      null,
      null
    );
    var length = 0;
    for (let num of kgroups) {
      ++length;
    }
    await db.getGroupIssues(kgroups);
    const context = {
      pshow: req.body.pshow,
      psort: sort,
      issueNames: await mapIssueNames(res),
      pName: req.body.pName,
      pDescription: req.body.pDescription,
      pCity: req.body.pCity,
      pStateProvince: req.body.pStateProvince,
      pCountry: req.body.pCountry,
      kgroups: mapKGroups(kgroups),
      prevpage: false,
      page: page,
      showpage: page + 1,
      morePages: length === db.entriesPerPage + 1,
      maxEntries: db.entriesPerPage,
    };
    context.issueNames.forEach((n) => {
      if (req.body[n.deblankName]) n["checked"] = true;
    });
    res.render("kgroups", context);
  } catch (err) {
    console.error("Error in listKGroups", err);
    res.render("500");
  }
};

exports.getEventCriteria = async (req, res) => {
  try {
    const context = {
      issueNames: await mapIssueNames(res),
      gettingCriteria: true,
    };
    res.render("kevents", context);
  } catch (err) {
    console.error("Error in getEventCriteria", err);
    res.render("500");
  }
};

exports.listKEvents = async (req, res) => {
  try {
    const searchIssues = [];
    const all = req.body.pshow === "all";
    const sort = req.body.psort;
    const page = req.body.ppage ? parseInt(req.body.ppage) : 0;
    if (req.body.pshow === "issue") {
      for (const key in req.body) {
        if (key[0] !== "p") searchIssues.push(req.body[key]);
      }
    }
    var text = req.body.pshow === "text";
    if (text) {
      text = {
        pName: req.body.pName,
        pDescription: req.body.pDescription,
        pGroupName: req.body.pGroupName,
        pCity: req.body.pCity,
        pStateProvince: req.body.pStateProvince,
        pCountry: req.body.pCountry,
      };
    }
    const group = req.body.group;
    const kevents = await db.getKEvents(
      all,
      searchIssues,
      text,
      page,
      sort,
      null,
      null
    );
    await db.getEventIssues(kevents);
    var length = 0;
    for (let num of kevents) {
      ++length;
    }
    const context = {
      pshow: req.body.pshow,
      psort: sort,
      issueNames: await mapIssueNames(res),
      pName: req.body.pName,
      pDescription: req.body.pDescription,
      pGroupName: req.body.pGroupName,
      pCity: req.body.pCity,
      pStateProvince: req.body.pStateProvince,
      pCountry: req.body.pCountry,
      kevents: mapKEvents(kevents),
      prevpage: false,
      page: page,
      showpage: page + 1,
      morePages: length === db.entriesPerPage + 1,
      maxEntries: db.entriesPerPage,
    };
    context.issueNames.forEach((n) => {
      if (req.body[n.deblankName]) n["checked"] = true;
    });
    res.render("kevents", context);
  } catch (err) {
    console.error("Error in listKEvents", err);
    res.render("500");
  }
};

exports.addKEvent = async (req, res) => {
  try {
    const context = {
      issueNames: await mapIssueNames(res),
      groupNames: await getGroupNames(),
    };
    res.render("addkevent", context);
  } catch (err) {
    console.error("Error in addKEvent", err);
    res.render("500");
  }
};

exports.doAddKEvent = async (req, res) => {
  // Check for logged-in user
  if (req.cookies.sriuser) {
    try {
      await db.insertKEvent(req.body, req.cookies.sriuser);
      for (const key in req.body) {
        if (key[0] !== "p")
          await db.insertEventIssue(req.body.pName, req.body[key]);
      }
      // Need to redisplay page with success message and fields cleared
      var context = {
        issueNames: await mapIssueNames(res),
        successMessage: true,
      };
      res.render("addkevent", context);
    } catch (err) {
      // Need to redisplay page with error message
      if (err.code !== "ER_DUP_ENTRY") {
        // On failure not duplicate entry, give 500 error
        console.error("doAddKEvent: Insert failed on KEvent");
        res.render("500");
      } else {
        // Need to redisplay page with error message
        failMessages = [
          "An entry with this name already exists. Please change your entry or \
      edit the existing one.",
        ];
        context = {
          failMessages: failMessages,
          issueNames: await mapIssueNames(res),
          redisplay: req.body,
        };
        context.issueNames.forEach((n) => {
          if (req.body[n.deblankName]) n["checked"] = true;
        });
        res.render("addkevent", context);
      }
    }
  } else {
    res.redirect("login");
  }
};

exports.selectKEvent = async (req, res) => {
  // Check for logged-in user
  if (req.cookies.sriuser) {
    try {
      const user = req.cookies.sriuser.toLowerCase();
      results = await db.checkUser(user);
      const confirmed = results[0][0].Confirmed;
      var all = false;
      var forUser = null;
      if (confirmed === "Admin") {
        all = true;
      } else {
        forUser = user;
      }
      const kevents = await db.getKEvents(
        all,
        false,
        false,
        0,
        null,
        null,
        forUser
      );

      await db.getEventIssues(kevents);
      const context = {
        success: req.body.pName,
        kevents: kevents.map((kevent) => {
          return {
            name: kevent.name,
            description: kevent.description,
          };
        }),
      };
      res.render("keventselect", context);
    } catch (err) {
      console.error("Error in selectKEvent", err);
      res.render("500");
    }
  } else {
    res.redirect("login");
  }
};

exports.editKEvent = async (req, res) => {
  // Check for logged-in user
  if (req.cookies.sriuser) {
    if (req.body.editevent) {
      if (req.body.deleteevent) {
        // delete entry
        try {
          const name = req.body.deleteevent;
          await db.deleteKEvent(name);
          this.selectKEvent(req, res);
          return;
        } catch {
          console.error("Error in editKEvent on delete", err);
          res.render("500");
          return;
        }
      }
      try {
        const kevents = await db.getKEvents(
          false,
          [],
          false,
          0,
          null,
          req.body.editevent
        );
        await db.getEventIssues(kevents);
        var context = {
          editevent: true,
          issueNames: await mapIssueNames(res),
          kevent: mapKEvents(kevents)[0],
          groupNames: await getGroupNames(),
        };
        const begin = kevents[0].begin;
        const end = kevents[0].end;
        context.kevent.beginDate = begin.toISOString().split("T")[0];
        context.kevent.endDate = end.toISOString().split("T")[0];
        context.kevent.beginTime = begin.toTimeString().split(" ")[0];
        context.kevent.endTime = end.toTimeString().split(" ")[0];

        context.issueNames.forEach((n) => {
          if (context.kevent.issues.includes(n.name)) n["checked"] = true;
        });
        res.render("addkevent", context);
      } catch (err) {
        console.error("Error in editKEvent", err);
        res.render("500");
      }
    } else {
      try {
        await db.updateKEvent(req.body);
        await db.clearEventIssues(req.body.pOriginalName);
        for (const key in req.body) {
          if (key[0] !== "p")
            await db.insertEventIssue(req.body.pName, req.body[key]);
        }
        this.selectKEvent(req, res);
      } catch (err) {
        console.error("Error in editKEvent", err);
        res.render("500");
      }
    }
  } else {
    res.redirect("login");
  }
};

exports.notFound = (req, res) => res.render("404");

// Express recognizes the error handler by way of its four
// argumetns, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render("500");
/* eslint-enable no-unused-vars */

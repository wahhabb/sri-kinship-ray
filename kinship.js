const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const multiparty = require("multiparty");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const RedisStore = require("connect-redis")(expressSession);
// const weatherMiddlware = require("./lib/middleware/weather");

const handlers = require("./lib/handlers");

const { credentials } = require("./config");

const app = express();

// configure Handlebars view engine
app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main",
    helpers: {
      section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
      ifeq: function (item1, item2, options) {
        if (item1 == item2) return options.fn(this);
        return "";
      },
    },
  })
);
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.enable("trust proxy");

app.use(cookieParser(credentials.cookieSecret));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
    store: new RedisStore({
      // url: credentials.redis[app.get("env")].url,
      url: credentials.redis.url,
    }),
  })
);

const port = process.env.PORT || 3000;

app.use(function (request, response, next) {
  if (
    (process.env.NODE_ENV == "development" ||
      process.env.NODE_ENV == "production") &&
    !request.secure
  ) {
    return response.redirect("https://" + request.headers.host + request.url);
  }
  next();
});
app.use(express.static(__dirname + "/public"));

app.get("/", handlers.home);

app.get("/login", handlers.login);
app.post("/login", handlers.doLogin);

app.get("/v3rf7q", handlers.verifyEmail);

app.get("/group-list", handlers.getGroupCriteria);
app.post("/group-list", handlers.listKGroups);

app.get("/group-add", handlers.addKGroup);
app.post("/group-add", handlers.doAddKGroup);

app.get("/group-edit", handlers.selectKGroup);
app.post("/group-edit", handlers.editKGroup);

app.get("/event-list", handlers.getEventCriteria);
app.post("/event-list", handlers.listKEvents);

app.get("/event-add", handlers.addKEvent);
app.post("/event-add", handlers.doAddKEvent);

app.get("/event-edit", handlers.selectKEvent);
app.post("/event-edit", handlers.editKEvent);

app.get("/resources-antiracism", handlers.resAntiRacism);

app.use(handlers.notFound);
app.use(handlers.serverError);

const server = app.listen(0, () => {
  console.log(
    `Express started on http://localhost:${server.address().port}` +
      "; press Ctrl-C to terminate."
  );
});

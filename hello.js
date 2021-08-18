const contentSecurityPolicy = require("helmet-csp");  
const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const multiparty = require("multiparty");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const RedisStore = require("connect-redis")(expressSession);

const handlers = require("./lib/handlers");
// const weatherMiddlware = require("./lib/middleware/weather");

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
      //   deblank: function (name, options) {
      //     console.log("deblanking");
      //     return str_replace(" ", "^^", options.fn(this));
      //   },
      // },
    },
  })
);

app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.use(express.static(__dirname + "/public"));

app.use(
  contentSecurityPolicy({
    useDefaults: true,
    directives: {
      frameAncestors: ["self", "https://ruhaniat.org"]
    }
  })
);

app.get("/", handlers.home);

app.get("/hello/", (req, res) => {
  res.send("Hello World!");
});

app.use(handlers.notFound);
app.use(handlers.serverError);

app.listen(port, () => {
  console.log(
    `Express started on http://localhost:${port}` +
      "; press Ctrl-C to terminate."
  );
});

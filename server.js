require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit("pronto");
  })
  .catch((err) => console.error("Erro ao se conectar no Mongo:", err));

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const helmet = require("helmet");
const csurf = require("csurf");

const routes = require("./routes");
const path = require("path");
const {
  middlewareGlobal,
  checkCsfrError,
  csrfMiddleware,
} = require("./src/middlewares/midlleware");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionOptions = session({
  secret: "extremamente:Secreto",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash());

app.use(csurf());
app.use(middlewareGlobal);

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "public")));
app.use(checkCsfrError);
app.use(csrfMiddleware);
app.use(helmet());
app.use(routes);

app.on("pronto", () => {
  app.listen(3000, () => {
    console.log("servidor: http://localhost:3000");
  });
});

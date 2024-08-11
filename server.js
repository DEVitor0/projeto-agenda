require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    console.log("conexão estabelecida com o mongo");
    app.emit("pronto");
  })
  .catch((err) => console.error("Erro ao se conectar no Mongo:", err));

const routes = require("./routes");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "public")));
app.use(routes);

app.on("pronto", () => {
  app.listen(3000, () => {
    console.log("servidor: http://localhost:3000");
  });
});

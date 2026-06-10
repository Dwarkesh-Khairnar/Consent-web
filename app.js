const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const authRoutes = require("./routes/auth");
const consentRoutes = require("./routes/consent");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/consentManager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/node_modules',express.static(path.join(__dirname, "node_modules")));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/auth", authRoutes);
app.use("/consent", consentRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(3001, () => {
  console.log("Server started on http://localhost:3001");
});

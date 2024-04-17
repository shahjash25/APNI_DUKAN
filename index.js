const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const signup=require('./controllers/signup.js');
const generateBill=require('./controllers/billgenerate.js');
const Bill = require("./models/bill");
const User = require("./models/user");
const Item = require("./models/item");
const Sales = require("./models/sales");
const billgenerate = require("./controllers/billgenerate.js");
const saleStats=require('./controllers/saleStatistics.js');
const itemStatistics=require('./controllers/itemStats.js');
const addItems = require("./controllers/addItems.js");
const updateItems = require("./controllers/updateItems.js");
mongoose.connect("mongodb://127.0.0.1:27017/supermarketcollege", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  secret: "ApniDukhan",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/dashboard");
  }
);

app.get("/logout", async (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/login");
  });
});

app.get("/signup", (req, res) => {
  res.render("register");
});

app.post("/signup", signup);

app.get("/profile", async (req, res) => {
  res.render("profile");
});

app.get("/about", async (req, res) => {
  res.render("about");
});

app.get("/dashboard", async (req, res) => {
  res.render("welcome");
});

app.get("/additem", async (req, res) => {
 
  res.send(res.locals.currentUser.user_type);
});

app.get("/sales-statistics", saleStats);

app.post("/itemsales", itemStatistics);

app.get("/bill", async (req, res) => {
  const items = await Item.find({});
     res.render("bill", { items });
});

app.post("/generate-bill",billgenerate );

app.get("/print-bill", (req, res) => {
  res.render("print_bill");
});

app.get("/inventory", async (req, res) => {
  
  const allDetails = await Item.find({});
  res.render("inventory", { details: allDetails });
});

app.post("/add", addItems);

app.post("/updateItems", updateItems);

app.listen(8080, () => {
  console.log("Listening on port 8080!!..");
});

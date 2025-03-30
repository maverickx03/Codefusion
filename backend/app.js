"use client"

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var fetch = require("node-fetch");





var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

console.log(app);


app.use("/", indexRouter);
app.use("/users", usersRouter);

// Run Code Route using Judge0 API
app.post("/runCode", async (req, res) => {
  try {
    const { language, code, input } = req.body;

    const languageMap = {
      C: 50,
      Cpp: 54,
      js: 63,
      python: 71,
    };

    const language_id = languageMap[language];
    if (!language_id) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const response = await fetch("https://judge029.p.rapidapi.com/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "judge029.p.rapidapi.com",
        "x-rapidapi-key": "3708298537mshb541a05c1693f01p1e320ejsn56f2ff9fb48c",
      },
      body: JSON.stringify({
        source_code: Buffer.from(code).toString("base64"),
        language_id: language_id,
        stdin: input ? Buffer.from(input).toString("base64") : "",
        expected_output: null,
        base64_encoded: true,
        wait: true,
      }),
    });

    const data = await response.json();

    if (data.status && data.status.id !== 3) {
      return res.status(400).json({ error: data.status.description });
    }

    res.json({
      output: data.stdout ? Buffer.from(data.stdout, "base64").toString("utf-8") : "",
      error: data.stderr ? Buffer.from(data.stderr, "base64").toString("utf-8") : "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});




module.exports = app;

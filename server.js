const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const authRouter = require("./auth/auth-router.js");
const usersRouter = require("./users/users-router.js");

const server = express();

// configure express-session middleware "Session Configuration"
const sessionOptions = {
  name: "sessionname", // default is connect.sid
  secret: process.env.COOKIE_SECRET || "keep it secret keep it safe!", // For Encryption
  cookie: {
    maxAge: 1000 * 64 * 60 * 24 * 1, // Milliseconds * Seconds * Minutes * Hours * Days
    secure: process.env.COOKIE_SECURE || false // in production should be true, false for devlopment - only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: process.env.SAVEUNINITIALIZED || true // in production should be false, true for devlopment, because GDPR LAW!
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ challenge: "Web Auth I Module Challenge!", session: req.session });
});

module.exports = server;

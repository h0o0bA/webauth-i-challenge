const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");

const UsersDb = require("./users/users-model.js");
const auth = require("./auth/auth-middleware.js");

const server = express();

server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
  res.send("<h2>Web Auth I Module Challenge!</h2>");
});

server.post("/api/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  UsersDb.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  UsersDb.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// protect /api/users so only clients that provide valid credentials can see the list of users
// read the username and password from the headers instead of the body (can't send a body on a GET request)
server.get("/api/users", auth, (req, res) => {
  UsersDb.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = server;

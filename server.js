const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");

const UsersDb = require("./users/users-model.js");

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

module.exports = server;

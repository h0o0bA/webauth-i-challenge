const bcrypt = require("bcryptjs"); /// <<<<<< install it and require it

const UsersDb = require("../users/users-model.js");

module.exports = auth;

function auth(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    UsersDb.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "Invalid Credentials!" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(400).json({ message: "Please provide a valid credentials!" });
  }
}

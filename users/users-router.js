const router = require("express").Router();

const UsersDb = require("./users-model.js");
const auth = require("../auth/auth-middleware.js");

// protect /api/users so only clients that provide valid credentials can see the list of users
// read the username and password from the headers instead of the body (can't send a body on a GET request)
router.get("/", auth, (req, res) => {
  UsersDb.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;

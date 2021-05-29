var express = require('express');
var router = express.Router();
const User = require("../models/users");
const crypto = require("crypto");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup", (req, res, next) => {
  User.findOne({username: req.body.username})
  .then(user => {
    if(user) {
      const err = new Error(`User ${req.body.username} already exists!`);
      err.status = 403;
      return next(err);
    } else {
      const salt = crypto.randomBytes(32).toString("base64");
      crypto.pbkdf2(req.body.password, salt, 100, 32, "sha1", (err, derivedKey) => {
        if(!err) {
          console.log("Create Salt:",salt);
          User.create({
            username: req.body.username,
            salt: salt,
            password: derivedKey
          })
          .then(user => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({status: "Registration Successful"})
          })
          .catch(err => next(err));
        } else {
          const err = new Error(`Server-side encription error`);
          err.status = 500;
          next(err);
        }
      });
    }
  })
  .catch(err => next(err));
});

router.post("/login", (req, res, next) => {
  if(!req.session.user) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
      const err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    const auth = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
    const username = auth[0];
    const password = auth[1];
    console.log("Basic Pass:", password);

    User.findOne({username: username})
    .then(user => {
      if (user) {
        crypto.pbkdf2(password, user.salt, 100, 32, "sha1", (err, derivedKey) => {
          if(!err) {
            if (user.password !== derivedKey.toString()) {
              console.log("Login Salt:",user.salt);
              console.log("DB Pass:", user.password);
              console.log("Submitted Pass:", derivedKey.toString());
              const err = new Error("Your password in incorrect");
              err.status = 401;
              return next(err);
            } else if (user.username === username && user.password === derivedKey.toString() && user.admin) {
              req.session.user = "admin";
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/plain");
              res.end("You are authenticated as an admin");
            } else if (user.username === username && user.password === derivedKey.toString()) {
              req.session.user = "authenticated";
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/plain");
              res.end("You are authenticated");
            }
          } else {
            const err = new Error(`Server-side encription error`);
            err.status = 500;
            next(err);
          }
        });
      } else {
        const err = new Error(`User ${username} does not exist!`);
        err.status = 401;
        return next(err);
      } 
    })
    .catch(err => next(err));
  } else {
    res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already logged in');
  }
})

router.get('/logout', (req, res, next) => {
  if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
  } else {
      const err = new Error('You are not logged in');
      err.status = 401;
      return next(err);
  }
});

module.exports = router;

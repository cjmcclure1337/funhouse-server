const express = require("express");
const Friend = require("../models/friends");
const authenticate = require("../authenticate");

const friendRouter = express.Router();

friendRouter.route("/")
    .get((req, res, next) => {
        Friend.find()
        .then(friends => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(friends);
        })
        .catch(err => next(err));
    })
    .post(authenticate.verifyAdmin, (req, res, next) => {
        Friend.create(req.body)
        .then(friend => {
            console.log("Friend Added: ", friend);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(friend);
        })
        .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end("PUT operations not supported on /friends")
    })
    .delete(authenticate.verifyAdmin, (req, res, next) => {
        Friend.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
        })
        .catch(err => next(err));
    })

friendRouter.route("/:friendId")
.get((req, res, next) => {
    Friend.findById(req.params.friendId)
    .then(friend => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(friend);
    })
    .catch(err => next(err));
})
    .post((req, res) => {
        res.statusCode = 403;
        res.end("POST operations not supported on /friends for individual friends")
    })
    .put(authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end("PUT operations not supported on /friends")
    })
    .delete(authenticate.verifyAdmin, (req, res, next) => {
        Friend.findByIdAndDelete(req.params.friendId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
        })
        .catch(err => next(err));
    });

module.exports = friendRouter;
const express = require("express");
const Pot = require("../models/pots");
const authenticate = require("../authenticate");

const potRouter = express.Router();

potRouter.route("/")
    .get((req, res, next) => {
        Pot.find()
        .then(pots => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(pots);
        })
        .catch(err => next(err));
    })
    .post(authenticate.verifyAdmin, (req, res, next) => {
        Pot.create(req.body)
        .then(pot => {
            console.log("Pot Added: ", pot);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(pot);
        })
        .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end("PUT operations not supported on /pots")
    })
    .delete(authenticate.verifyAdmin, (req, res, next) => {
        Pot.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
        })
        .catch(err => next(err));
    })

potRouter.route("/:potId")
    .get((req, res, next) => {
        Pot.findById(req.params.potId)
        .then(pot => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(pot);
        })
        .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end("POST operations not supported on /pots for individual pots")
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end("PUT operations not supported on /pots")
    })
    .delete(authenticate.verifyAdmin, (req, res, next) => {
        Pot.findByIdAndDelete(req.params.potId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
        })
        .catch(err => next(err));
    });

module.exports = potRouter;
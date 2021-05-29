const express = require("express");
const Art = require("../models/art");
const authenticate = require("../authenticate");

const artRouter = express.Router();

artRouter.route("/")
    .get((req, res, next) => {
        Art.find()
        .then(art => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(art);
        })
        .catch(err => next(err));
    })
    .post(authenticate.verifyAdmin, (req, res, next) => {
        Art.create(req.body)
        .then(art => {
            console.log("Art Added: ", art);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(art);
        })
        .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end("PUT operations not supported on /art")
    })
    .delete(authenticate.verifyAdmin, (req, res, next) => {
        Art.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
        })
        .catch(err => next(err));
    })

artRouter.route("/:artId")
.get((req, res, next) => {
    Art.findById(req.params.artId)
    .then(art => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(art);
    })
    .catch(err => next(err));
})
    .post((req, res) => {
        res.statusCode = 403;
        res.end("POST operations not supported on /art for individual art pieces")
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end("PUT operations not supported on /art")
    })
    .delete(authenticate.verifyAdmin, (req, res, next) => {
        Art.findByIdAndDelete(req.params.artId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
        })
        .catch(err => next(err));
    });

module.exports = artRouter;
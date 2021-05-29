//const User = require("./models/users");

const User = require("./models/users");

exports.verifyAdmin = (req, res, next) => {
    if(!req.session.user) {
        const err = new Error('You are not authenticated');
        err.status = 401;
        return next(err);
    } else {
        User.findOne()
        if (req.session.user === "admin") {
            return next();
        } else {
            const err = new Error("You are not authenticated");
            res.setHeader("WWW-Authenticate", "Basic");
            err.status = 401;
            return next(err);
        }
    }
}
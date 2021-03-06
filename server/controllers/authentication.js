var mongoose = require("mongoose");
var passport = require("passport");
var md5 = require("md5");
var User = mongoose.model("User");
var shortid = require("shortid");

function sendJSONresponse(res, status, message) {
    res.status(status).json(message);
}

module.exports.login = function (req, res) {
    if (!req.body.username || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            sendJSONresponse(res, 404, err);
            return;
        }
        if (user) {
            var token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token": token
            });
        } else {
            sendJSONresponse(res, 401, info);
        }
    })(req, res);
};


module.exports.loginAnonymous = function (req, res) {
    var user = new User();
    user.username = shortid.generate();
    var password = shortid.generate();
    user.image = "images/male" + (Math.floor(Math.random() * 5) + 1) + ".png";
    user.gender = 'male';
    user.generateHash(password);
    user.save(function (err) {
        if (err) {
            console.error(err);
            sendJSONresponse(res, 404, err);
        } else {
            var expiry = new Date();
            //set the expiry to be 30 minutes
            expiry.setDate(expiry.getTime() + 1000 * 30 * 60);
            var token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token": token
            });
        }
    });
};


module.exports.signup = function (req, res) {
    if (!req.body.username || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    var user = new User();
    var temp = req.body.username.trim();
    user.gender = req.body.gender;

    if (temp.indexOf("@") !== -1) {
        var email = temp;
        var hash = md5(email);
        user.username = email.substring(0, email.indexOf("@"));
        user.image = "https://www.gravatar.com/avatar/" + hash;
    }
    else {
        user.username = temp;
        if (user.gender === "male") {
            user.image = "images/male" + (Math.floor(Math.random() * 5) + 1) + ".png";
        } else if (user.gender === "female") {
            user.image = "images/female" + (Math.floor(Math.random() * 5) + 1) + ".png";
        }

    }
    user.generateHash(req.body.password);
    user.save(function (err) {
        var token;
        if (err) {
            sendJSONresponse(res, 404, err);
        } else {
            token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token": token
            });
        }
    });
};

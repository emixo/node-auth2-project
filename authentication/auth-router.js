const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

const router = require("express").Router();

const Users = require("../users/users-model.js");
const {isValid} = require("../users/usersServices.js");
const constants = require("../config/constants.js");

router.post("/register", (req, res) => {
    const credentials = req.body;
    if (isValid(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;
        const hash = bcryptjs.hashSync(credentials.password, rounds);
        credentials.password = hash;

        Users.add(credentials)
            .then(user => {
                res.status(201).json({ data: user });
            })
            .catch(err => {
                res.status(500).json({ message: err.message });
            });
    } else {
        res.status(400).json({
            message: "please use a password thats alphanumeric",
        });
    }
});

router.post("/login", (req, res) => {
    const {username, password} = req.body;

    if (isValid(req.body)) {
        Users.findBy({username: username})
            .then(([user]) => {
                console.log("user", user);
                if (user && bcryptjs.compareSync(password, user.password)) {
                    const token = createToken(user);

                    res.status(200).json({ token, message: "Hey there!" });
                } else {
                    res.status(401).json({ message: "Invalid credentials" });
                }
            })
            .catch(err => {
                res.status(500).json({ message: err.message });
            });
    } else {
        res.status(400).json({
            message: "Please use a password thats alphanumeric",
        });
    }
});

function createToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role,
    };
    const secret = constants.jwtSecret;
    const options = {
        expiresIn: "1d",
    };
    return jwt.sign(payload, secret, options);
}

module.exports = router;
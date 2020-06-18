const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRouter = require("../authentication/auth-router.js");
const usersRouter = require("../users/users-router.js");

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());


server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up and running" });
});

module.exports = server;
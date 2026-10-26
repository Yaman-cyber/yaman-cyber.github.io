const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("config");
const winston = require("winston");
const crypto = require("node:crypto");
const docbot = require("../services/agent/docbot.service");

module.exports = function (server) {
  const io = new Server(server, { cors: { origin: "*" } });

  // same JWT as the REST API
  io.use((socket, next) => {
    try {
      socket.user = jwt.verify(socket.handshake.auth.token, config.get("jwtPrivatekey"));
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("docbot:ask", async ({ question, threadId }, reply) => {
      socket.emit("docbot:status", { step: "thinking" });
      try {
        reply(await docbot.ask({ question, userId: socket.user._id, threadId: threadId || crypto.randomUUID() }));
      } catch (err) {
        winston.error(err.message, err);
        reply({ status: "error", message: "Something went wrong" });
      }
    });
  });
};

// ---------- in your frontend ----------
// import { io } from "socket.io-client";
// const socket = io("http://localhost:3000", { auth: { token } });
// socket.on("docbot:status", s => showSpinner(s.step));
// socket.emit("docbot:ask", { question: "What is the refund window?" }, result => render(result));

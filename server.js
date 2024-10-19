const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  let msg;

  io.on("connection", (socket) => {
    msg = {
      id: socket.id,
      is_notification: true,
      text: "a user joined the chat",
    };
    io.emit("receiveMessage", msg);

    socket.on("sendMessage", (text) => {
      msg = {
        id: socket.id,
        is_notification: false,
        text: text,
      };
      io.emit("receiveMessage", msg);
    });

    socket.on("disconnect", () => {
      console.log("a user disconnected", socket.id);

      msg = {
        id: socket.id,
        is_notification: true,
        text: "a user leaving the chat",
      };

      io.emit("receiveMessage", notif);
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});

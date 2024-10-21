import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

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

  io.on("connection", (socket) => {
    socket.on("sendMessage", async (data) => {
      await fetch(`http://localhost:3000/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: data.message, userId: data.userId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ERROR! status ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const msg = {
            id: data.id,
            is_notification: false,
            text: data.message,
            date: data.timestamp,
            username: data.username,
          };
          io.emit("receiveMessage", msg);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});

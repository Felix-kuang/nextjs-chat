import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const messages = await prisma.chat.findMany({
        orderBy: {
          timestamp: "asc",
        },
      });
      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end("Method ${req.method} Not Allowed");
  }
}

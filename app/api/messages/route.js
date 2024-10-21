import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const messages = await prisma.chat.findMany({
      include: {
        user: true,
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    // Transform the fetched data into the desired structure
    const transformedMessages = messages.map((msg) => ({
      is_notification: false, // Default to false, or adjust based on logic
      text: msg.message,
      date: msg.timestamp,
      username: msg.user.username,
    }));

    return new Response(
      JSON.stringify({
        status: 200,
        message: "Message Fetched Successfully",
        data: transformedMessages,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch messages" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const { message,userId } = await req.json(); // Parses incoming JSON
    
    // console.log("Message:", message, "User ID:", userId); // Log to check

    if (!message || !userId) {
      return new Response("Please provide the message and user id", {
        status: 400,
      });
    }

    const newMessage = await prisma.chat.create({
      data: {
        message: message,
        userId: userId, // Assuming userId is passed in the body
      },
      include: {
        user: true,
      },
    });

    return new Response(
      JSON.stringify({
        status: 200,
        message: "Message Input Successfully",
        data: newMessage,
        id: newMessage.id, // Return the ID of the new message
        message: newMessage.message,
        timestamp: newMessage.timestamp,
        username: newMessage.user.username, // Return the usernames
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to input messages" }), {
      status: 500,
    });
  }
}

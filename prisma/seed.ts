// seed.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialUserData = [
  { username: "alice", password:"1" },
  { username: "bob", password:"1" },
  { username: "charlie", password:"1" },
  { username: "dave", password:"1" },
];

const initialChatData = [
  { message: "Hello everyone!", userId: 1 },
  { message: "Hi Alice!", userId: 2 },
  { message: "How are you?", userId: 3 },
  { message: "Let’s chat!", userId: 4 },
];

const seed = async () => {
  await prisma.user.deleteMany();
  await prisma.chat.deleteMany();

  for (const userData of initialUserData) {
    await prisma.user.create({
      data: userData,
    });
  }

  for (const chatData of initialChatData) {
    await prisma.chat.create({
      data: chatData,
    });
  }
};

seed();

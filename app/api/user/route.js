import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    let user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await prisma.user.create({
        data: { username, password: hashedPassword },
      });

      return new Response(
        JSON.stringify({
          status: 201, // 201 Created
          message: "User created successfully!",
          data: user,
        }),
        { status: 201 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          status: 401,
          message: "Incorrect Password!",
        }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({
        status: 200,
        message: "Login Success!",
        data: user,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        status: 500,
        message: `Error: ${error.message}`,
      }),
      { status: 500 }
    );
  }
}

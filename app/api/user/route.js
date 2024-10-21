import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username } = await req.json();
    let user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { username },
      });
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
    return new Response(`Error: ${error}`);
  }
}

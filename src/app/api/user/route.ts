import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const user = await currentUser();
  if (!user || !user.id) return new Response("", { status: 400 });

  const fetchedUser = await prisma.users.findUniqueOrThrow({
    where: { clerk_id: user.id },
  });

  return NextResponse.json({ user: fetchedUser });
}

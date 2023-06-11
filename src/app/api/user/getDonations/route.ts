import { currentUser } from "@clerk/nextjs";
import prisma from "../../../../../prisma";
import { NextResponse } from "next/server";
import { bi2n } from "@/lib/util";
import { UserDonationSet } from "@/lib/types";

export async function GET() {
  const user = await currentUser();
  if (!user || !user.id) return new Response("", { status: 400 });

  const prismaRes = await prisma.donations.findMany({
    where: {
      user_id: user.id,
    },
    include: {
      track: true,
    },
  });

  const donations = {
    clerkId: user.id,
    linkedSongs: prismaRes.map((d) => ({
      songId: bi2n(d.track_id),
      totalDonation: d.amount,
    })),
  } as UserDonationSet;

  return NextResponse.json({ donations });
}

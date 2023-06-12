import { UserDonations } from "./../../../../lib/types";
import { currentUser } from "@clerk/nextjs";
import prisma from "../../../../../prisma";
import { NextResponse } from "next/server";
import { bi2n } from "@/lib/util";

export async function GET() {
  const user = await currentUser();
  if (!user || !user.id) return new Response("", { status: 400 });

  const prismaRes = await prisma.donations_v2.findMany({
    where: {
      user_id: user.id,
    },
    include: {
      track: true,
    },
  });

  const linkedSongs: { [songId: number]: number } = {};
  prismaRes.forEach((d) => {
    linkedSongs[bi2n(d.track_id)!] = d.amount;
  });

  const donations = {
    clerkId: user.id,
    linkedSongs,
  } as UserDonations;

  return NextResponse.json({ donations });
}

// export async function GET() {
//   const user = await currentUser();
//   if (!user || !user.id) return new Response("", { status: 400 });

//   const prismaRes = await prisma.donations.findMany({
//     where: {
//       user_id: user.id,
//     },
//     include: {
//       track: true,
//     },
//   });

//   const linkedSongs: { [songId: number]: number } = {};
//   prismaRes.forEach((d) => {
//     linkedSongs[bi2n(d.track_id)!] = d.amount;
//   });

//   const donations = {
//     clerkId: user.id,
//     linkedSongs,
//   } as UserDonations;

//   return NextResponse.json({ donations });
// }

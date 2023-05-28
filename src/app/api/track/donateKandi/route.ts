import { MAX_KANDI_DONATION } from "@/lib/constants";
import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  donationAmount: number;
  trackId: number;
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  const data: RequestBody = await request.json();
  const { donationAmount, trackId } = data;

  const user = await currentUser();
  const userId = user?.id;

  if (!donationAmount || !trackId || !userId) {
    return new Response(JSON.stringify({ error: "Invalid body parameters" }), {
      status: 400,
    });
  }

  if (donationAmount < 0 || donationAmount > MAX_KANDI_DONATION) {
    return new Response(JSON.stringify({ error: "Kandi not in range" }), {
      status: 400,
    });
  }

  const curUser = await prisma.users.findUniqueOrThrow({
    where: { clerk_id: userId },
  });
  if (curUser.kandi_balance <= 0)
    return NextResponse.json({ outOfKandi: true });

  const alreadyDonated = await prisma.donations.findUnique({
    where: { user_id_track_id: { user_id: userId, track_id: trackId } },
  });

  let additionalKandi = 0;
  let previousAmount = 0;
  if (alreadyDonated) {
    previousAmount = alreadyDonated.amount;
    additionalKandi = Math.min(
      donationAmount,
      5 - previousAmount,
      curUser.kandi_balance
    );
    if (additionalKandi > 0) {
      await prisma.$transaction([
        prisma.donations.update({
          where: { user_id_track_id: { user_id: userId, track_id: trackId } },
          data: { amount: previousAmount + additionalKandi },
        }),
        prisma.users.update({
          where: { clerk_id: userId },
          data: { kandi_balance: { decrement: additionalKandi } },
        }),
      ]);
    }
  } else {
    previousAmount = 0;
    additionalKandi = Math.min(
      donationAmount,
      MAX_KANDI_DONATION,
      curUser.kandi_balance
    );
    await prisma.$transaction([
      prisma.donations.create({
        data: {
          user_id: userId,
          track_id: trackId,
          amount: additionalKandi,
        },
      }),
      prisma.users.update({
        where: { clerk_id: userId },
        data: { kandi_balance: { decrement: additionalKandi } },
      }),
    ]);
  }

  return NextResponse.json({
    previousAmount,
    newAmount: previousAmount + additionalKandi,
    additionalKandi,
    remainingKandi: curUser.kandi_balance - additionalKandi,
    capExceeded: additionalKandi === 0,
  });
}

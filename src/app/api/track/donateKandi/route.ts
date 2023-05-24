import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const MAX_KANDI_DONATION = 5;

interface RequestBody {
  donationAmount: number;
  userId: string; // this should really just be parsed server-side...
  trackId: number;
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  const data: RequestBody = await request.json();
  const { donationAmount, userId, trackId } = data;

  if (!donationAmount || !userId || !trackId) {
    return new Response(JSON.stringify({ error: "Invalid body parameters" }), {
      status: 400,
    });
  }

  if (donationAmount < 0 || donationAmount > MAX_KANDI_DONATION) {
    return new Response(JSON.stringify({ error: "Kandi not in range" }), {
      status: 400,
    });
  }

  const alreadyDonated = await prisma.donations.findUnique({
    where: { user_id_track_id: { user_id: userId, track_id: trackId } },
  });

  let additionalKandi = 0;
  let previousAmount = 0;
  if (alreadyDonated) {
    previousAmount = alreadyDonated.amount;
    additionalKandi = Math.min(donationAmount, 5 - previousAmount);
    if (additionalKandi > 0) {
      await prisma.donations.update({
        where: { user_id_track_id: { user_id: userId, track_id: trackId } },
        data: { amount: previousAmount + additionalKandi },
      });
    }
  } else {
    previousAmount = 0;
    additionalKandi = Math.min(donationAmount, MAX_KANDI_DONATION); // the clamp is technically unnecessary...
    await prisma.donations.create({
      data: {
        user_id: userId,
        track_id: trackId,
        amount: additionalKandi,
      },
    });
  }

  // return how much kandi was ACTUALLY added
  return NextResponse.json({
    previousAmount,
    newAmount: previousAmount + additionalKandi,
    additionalKandi,
    capExceeded: additionalKandi === 0,
  });
}

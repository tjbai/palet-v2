import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

const prisma = new PrismaClient();
const DEFAULT_STARTING_KANDI = 100;

export async function POST(request: Request) {
  try {
    const rawbody = await request.text();
    console.log("inbound request: ", rawbody);
    const headers = Object.fromEntries(request.headers.entries());
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string);
    let event: WebhookEvent | null = null;

    try {
      event = wh.verify(rawbody, headers) as WebhookEvent;
    } catch (_) {
      return new Response(JSON.stringify({ error: "Webhook not verified" }), {
        status: 400,
      });
    }

    switch (event.type) {
      case "user.created": {
        const { id: clerk_id, first_name, last_name, created_at } = event.data;
        await prisma.users.create({
          data: {
            clerk_id,
            first_name,
            last_name,
            created_at: new Date(created_at),
            kandi_balance: DEFAULT_STARTING_KANDI,
          },
        });
        return NextResponse.json({
          clerk_id,
          first_name,
          last_name,
          created_at,
        });
      }

      case "user.updated": {
        const { id: clerk_id, first_name, last_name, created_at } = event.data;
        await prisma.users.update({
          where: {
            clerk_id,
          },
          data: {
            first_name,
            last_name,
            created_at: new Date(created_at),
          },
        });
        return NextResponse.json({
          clerk_id,
          first_name,
          last_name,
          created_at,
        });
      }

      case "user.deleted": {
        const { id: clerk_id } = event.data;
        await prisma.users.delete({ where: { clerk_id } });
        return NextResponse.json({ clerk_id });
      }
    }
  } catch (e) {
    if (e instanceof TypeError)
      console.log("Headers parsing TypeError, works fine but annoying");
    else throw e;
  }
}

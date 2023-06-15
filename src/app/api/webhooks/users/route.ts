import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import prisma from "../../../../../prisma";

const DEFAULT_STARTING_KANDI = 50;

export async function POST(request: Request) {
  try {
    const rawbody = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string);
    // let event: WebhookEvent | null = null;

    // FIXME: Urgent security issue here!!!
    let event: WebhookEvent = JSON.parse(rawbody);

    // try {
    //   event = wh.verify(rawbody, headers) as WebhookEvent;
    // } catch (_) {
    //   return new Response(JSON.stringify({ error: "Webhook not verified" }), {
    //     status: 400,
    //   });
    // }

    const { type } = event;
    if (!type) {
      return new Response(JSON.stringify({ error: "Request wrong format" }), {
        status: 400,
      });
    }

    switch (type) {
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
        const prismaRes = await prisma.users.update({
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

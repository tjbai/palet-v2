import { fetchPlaylistContext } from "@/lib/services/server/playlist";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  routeAlias: string;
}

export async function POST(request: NextRequest) {
  const data: RequestBody = await request.json();
  const { routeAlias } = data;

  if (!routeAlias) {
    return NextResponse.json({ error: "Need to pass in playlist route name" });
  }

  try {
    const playlistContext = await fetchPlaylistContext(routeAlias);
    return NextResponse.json({ playlistContext });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e.code);
    }
    return NextResponse.json({ error: e });
  }
}

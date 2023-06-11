import { fetchPlaylistPreviews } from "@/lib/services/server/playlist";
import { NextResponse } from "next/server";

export async function GET() {
  const playlistPreviews = await fetchPlaylistPreviews();
  return NextResponse.json({ playlistPreviews });
}

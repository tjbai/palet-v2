import { fetchPlaylistPreviews } from "@/lib/services/serverPlaylist";
import { NextResponse } from "next/server";

export async function GET() {
  const playlistPreviews = await fetchPlaylistPreviews();
  return NextResponse.json({ playlistPreviews });
}

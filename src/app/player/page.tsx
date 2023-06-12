import BelowNowPlayingError from "@/components/Common/BelowNowPlayingError";
import PlayerController from "@/components/Player/PlayerController";
import { fetchPlaylistContext } from "@/lib/services/server/playlist";
import { PlaylistContext } from "@/lib/types";
import prisma from "../../../prisma";

export const revalidate = 60; // revalidate ISR every minute

// Enables ISR
export async function generateStaticParams() {
  const playlists = await prisma.static_playlists_v2.findMany();
  const playlistNames = playlists.map((playlist) => ({
    playlistName: playlist.route_alias,
  }));
  return playlistNames;
}

interface FetchReturnObject {
  playlistContext?: PlaylistContext | null;
  error?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { type, crate } = searchParams;

  try {
    const playlistContext = await fetchPlaylistContext(crate as string);
    return (
      <PlayerController
        playlistContext={playlistContext!}
        type={type}
        crate={crate}
      />
    );
  } catch (error) {
    return <BelowNowPlayingError error={JSON.stringify(error)} />;
  }
}

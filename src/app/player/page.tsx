import BelowNowPlayingError from "@/components/Common/BelowNowPlayingError";
import PlayerController, {
  SearchParam,
} from "@/components/Player/PlayerController";
import { PlaylistContext } from "@/lib/types";
import { bi2n } from "@/lib/util";
import { Prisma } from "@prisma/client";
import prisma from "../../../prisma";
import getPlaylistContext from "@/lib/services/getPlaylistContext";

export const revalidate = 60; // revalidate ISR every minute

// Enables ISR
// export async function generateStaticParams() {
//   const playlists = await prisma.static_playlists.findMany();
//   const playlistNames = playlists.map((playlist) => ({
//     playlistName: playlist.route_alias,
//   }));
//   return playlistNames;
// }

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
    const playlistContext = await getPlaylistContext(crate as string);
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

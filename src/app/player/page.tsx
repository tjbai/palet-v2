import BelowNowPlayingError from "@/components/Common/BelowNowPlayingError";
import PlayerController, {
  SearchParam,
} from "@/components/Player/PlayerController";
import { PlaylistContext } from "@/lib/types";
import { bi2n } from "@/lib/util";
import { Prisma } from "@prisma/client";
import prisma from "../../../prisma";

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

async function fetchPlaylist(
  routeAlias: SearchParam
): Promise<FetchReturnObject> {
  if (!routeAlias) {
    return { playlistContext: null };
  }

  try {
    const prismaRes = await prisma.static_playlists.findUniqueOrThrow({
      where: {
        route_alias: routeAlias as string,
      },
      include: {
        playlists_tracks: {
          include: {
            static_tracks: true,
          },
        },
      },
    });

    const responseObject = {
      id: bi2n(prismaRes?.id),
      name: prismaRes?.name,
      index: -1,
      imageUrl: prismaRes?.cdn_image_url,
      originUrl: prismaRes?.origin_url,
      songs: prismaRes?.playlists_tracks.map((pt) => ({
        id: bi2n(pt.static_tracks.id),
        name: pt.static_tracks.name,
        artists: pt.static_tracks.artists,
        cdnPath: pt.static_tracks.cdn_path,
        durationMs: bi2n(pt.static_tracks.duration_ms),
        kandiCount: bi2n(pt.static_tracks.kandi_count),
        originUrl: pt.static_tracks.origin_url,
      })),
      routeAlias: prismaRes.route_alias,
    } as PlaylistContext;

    return { playlistContext: responseObject };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("prisma error code: ", e.code);
    } else console.error(e);
    return { error: e as string };
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { type, crate } = searchParams;
  const { playlistContext, error } = await fetchPlaylist(crate);

  if (error) return <BelowNowPlayingError error={JSON.stringify(error)} />;

  return (
    <PlayerController
      playlistContext={playlistContext!}
      type={type}
      crate={crate}
    />
  );
}

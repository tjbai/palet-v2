import BelowNowPlayingError from "@/components/Common/BelowNowPlayingError";
import PlayerController from "@/components/Player/PlayerController";
import { PlaylistContext } from "@/lib/types";
import { bi2n } from "@/lib/util";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  playlistContext?: PlaylistContext;
  error?: string;
}

async function fetchPlaylist(routeAlias: string): Promise<FetchReturnObject> {
  try {
    const prismaRes = await prisma.static_playlists.findUniqueOrThrow({
      where: {
        route_alias: routeAlias, // typescript seems to take issue with this line...
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
      index: -1, // don't know if this is smart, but solves duplication issue
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
  params,
  searchParams,
}: {
  params: { playlistName: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { playlistName } = params;
  const { playlistContext, error } = await fetchPlaylist(playlistName);
  const typeSearchParam = searchParams?.type;

  if (error) return <BelowNowPlayingError error={error} />;

  return (
    <PlayerController
      playlistContext={playlistContext!}
      typeSearchParam={typeSearchParam}
    />
  );
}

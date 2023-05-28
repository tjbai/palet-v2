import BelowNowPlayingWrapper from "@/components/Player/BelowNowPlayingWrapper";
import PlayerController from "@/components/Player/PlayerController";
import styleConstants from "@/lib/chakra/styleConstants";
import { PlaylistContext } from "@/lib/types";
import { bi2n } from "@/lib/util";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const revalidate = 60; // revalidate every minute

// Enables ISR
export async function generateStaticParams() {
  const playlists = await prisma.static_playlists.findMany();
  const playlistNames = playlists.map((playlist) => ({
    playlistName: playlist.route_alias,
  }));
  return playlistNames;
}

async function fetchPlaylist(
  routeAlias: string
): Promise<PlaylistContext | null> {
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
      index: 0, // don't know if this is smart, but solves duplication issue
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

    console.log("response: ", responseObject);

    return responseObject;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("prisma error code: ", e.code);
    } else console.error(e);

    return null;
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
  const playlistContext = await fetchPlaylist(playlistName);
  const typeSearchParam = searchParams?.type;

  if (!playlistContext)
    return (
      <div
        style={{ display: "flex", height: "100vh", border: "1px solid green" }}
      >
        <h1
          style={{
            position: "relative",
            top: `${
              styleConstants.headerHeight + styleConstants.nowPlayingHeight
            }px`,
            border: "1px solid red",
          }}
        >
          Error fetching
        </h1>
      </div>
    );

  return (
    <PlayerController
      playlistContext={playlistContext}
      typeSearchParam={typeSearchParam}
    />
  );
}

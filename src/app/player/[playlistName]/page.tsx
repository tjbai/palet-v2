import PlayerController from "@/components/Player/PlayerController";
import { PlaylistContext } from "@/lib/types";
import { bi2n } from "@/lib/util";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* 
NOTE 3: Good template for future prisma api's

NOTE 2: This is just a copy of the /player route's fetch function
but matches to the "route alias" path param in the url.

NOTE: This is the only place we use the supabase API clientside.
We're gonna want to get rid of this and just make an endpoint for this...
*/
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
    } as PlaylistContext;

    return responseObject;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e.code);
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
  const playlistContext = await fetchPlaylist(params.playlistName);
  const typeSearchParam = searchParams?.type;

  if (!playlistContext) return <h1>Error fetching</h1>;

  return (
    <PlayerController
      playlistContext={playlistContext}
      typeSearchParam={typeSearchParam}
    />
  );
}

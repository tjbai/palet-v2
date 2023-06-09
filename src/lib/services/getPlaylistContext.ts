import TrackListController from "@/components/Player/Player0/HorizontalTrackList";
import prisma from "../../../prisma";
import { PlaylistContext } from "../types";
import { bi2n, fisherYates } from "../util";

export default function getPlaylistContext(
  routeAlias: string
): Promise<PlaylistContext> {
  return new Promise(async (resolve, reject) => {
    try {
      const prismaRes = await prisma.static_playlists.findUniqueOrThrow({
        where: {
          route_alias: routeAlias,
        },
        include: {
          playlists_tracks: {
            include: {
              static_tracks: true,
            },
          },
        },
      });

      const shuffle = fisherYates(prismaRes?.playlists_tracks.length);

      const playlistContext = {
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
        shuffledOrder: shuffle,
        shuffledIndex: shuffle.indexOf(0),
      } as PlaylistContext;

      resolve(playlistContext);
    } catch (error) {
      reject(error);
    }
  });
}

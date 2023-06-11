import prisma from "../../../../prisma";
import { PlaylistContext, PlaylistPreview } from "../../types";
import { fisherYates, bi2n } from "../../util";

export const fetchPlaylistContext = (
  routeAlias: string | null
): Promise<PlaylistContext | null> => {
  return new Promise(async (resolve, reject) => {
    if (!routeAlias) resolve(null);

    try {
      const prismaRes = await prisma.static_playlists.findUniqueOrThrow({
        where: {
          route_alias: routeAlias!,
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
      console.error(error);
      reject(error);
    }
  });
};

export const fetchPlaylistPreviews = async () => {
  const playlists = await prisma.static_playlists.findMany({
    include: {
      playlists_tracks: {
        include: {
          static_tracks: {
            select: {
              kandi_count: true,
              duration_ms: true,
            },
          },
        },
      },
    },
  });

  const playlistPreviews: PlaylistPreview[] = playlists.map((p) => ({
    id: bi2n(p.id),
    name: p.name,
    imageUrl: p.cdn_image_url,
    originUrl: p.origin_url,
    routeAlias: p.route_alias,
    trackCount: p.track_count,
    description: p.description,
    kandiCount: p.playlists_tracks.reduce(
      (sum, pt) => sum + (bi2n(pt.static_tracks?.kandi_count) || 0),
      0
    ),
    totalDuration: p.playlists_tracks.reduce(
      (sum, pt) => sum + (bi2n(pt.static_tracks?.duration_ms) || 0),
      0
    ),
  }));

  return playlistPreviews;
};

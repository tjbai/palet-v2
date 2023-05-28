import Discovery from "@/components/Discovery";
import { PlaylistPreview } from "@/lib/types";
import { bi2n } from "@/lib/util";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchPlaylists(): Promise<PlaylistPreview[]> {
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
}

export default async function Page({}: {}) {
  const playlistPreviews = await fetchPlaylists();
  return <Discovery playlistPreviews={playlistPreviews} />;
}

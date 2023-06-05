import { PlaylistContext, PlaylistPreview } from "@/lib/types";
import { bi2n, convertBigInts } from "@/lib/util";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma";

interface RequestBody {
  routeAlias: string;
}

export async function GET(request: NextRequest) {
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

  return NextResponse.json({ playlistPreviews });
}

// export async function POST(request: NextRequest) {
//   const data: RequestBody = await request.json();
//   const { routeAlias } = data;

//   if (!routeAlias) {
//     return NextResponse.json({ error: "Need to pass in playlist route name" });
//   }

//   try {
//     const prismaRes = await prisma.static_playlists.findUniqueOrThrow({
//       where: {
//         route_alias: routeAlias, // typescript seems to take issue with this line...
//       },
//       include: {
//         playlists_tracks: {
//           include: {
//             static_tracks: true,
//           },
//         },
//       },
//     });

//     const responseObject = {
//       id: bi2n(prismaRes?.id),
//       name: prismaRes?.name,
//       index: -1,
//       imageUrl: prismaRes?.cdn_image_url,
//       originUrl: prismaRes?.origin_url,
//       songs: prismaRes?.playlists_tracks.map((pt) => ({
//         id: bi2n(pt.static_tracks.id),
//         name: pt.static_tracks.name,
//         artists: pt.static_tracks.artists,
//         cdnPath: pt.static_tracks.cdn_path,
//         durationMs: bi2n(pt.static_tracks.duration_ms),
//         kandiCount: bi2n(pt.static_tracks.kandi_count),
//         originUrl: pt.static_tracks.origin_url,
//       })),
//     } as PlaylistContext;

//     return NextResponse.json({
//       playlistContext: convertBigInts(responseObject),
//     });
//   } catch (e) {
//     if (e instanceof Prisma.PrismaClientKnownRequestError) {
//       console.log(e.code);
//     }
//     return NextResponse.json({ error: e });
//   }
// }

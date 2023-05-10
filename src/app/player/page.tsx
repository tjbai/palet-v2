import Player1 from "@/components/Player/Player1";
import Player2 from "@/components/Player/Player2";
import { PlaylistContext } from "@/lib/hooks/usePlayerState";
import { supabase } from "@/lib/sb/supabaseClient";
import { Database } from "@/types/supabase";

async function fetchRootPlaylist() {
  const { data, error } = await supabase
    .from("static_playlists")
    .select("id, name, cdn_image_url, origin_url, static_tracks(*)");

  if (error) {
    console.error(error);
    return null;
  }

  const playlist = data[0];
  return {
    id: playlist.id,
    name: playlist.name,
    originUrl: playlist.origin_url,
    imageUrl: playlist.cdn_image_url,
    index: -1,
    songs: (
      playlist.static_tracks as Database["public"]["Tables"]["static_tracks"]["Row"][]
    )?.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists,
      cdnPath: track.cdn_path,
      durationMs: track.duration_ms,
      kandiCount: track.kandi_count,
      originUrl: track.origin_url,
    })),
  } as PlaylistContext;
}

/*
Fetches playlist metadata and context here.
When user interacts in the client component, it updates the context provider.
*/
export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const playlistContext = await fetchRootPlaylist();
  const playerType = searchParams?.type;

  if (!playlistContext) return <h1>Error fetching</h1>;

  if (!playerType || playerType === "1" || Array.isArray(playerType)) {
    return <Player1 playlistContext={playlistContext} />;
  } else if (playerType === "2") {
    return <Player2 playlistContext={playlistContext} />;
  }
}

// async function fetchRootPlaylist() {
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   return {
//     id: "",
//     index: 0,
//     name: "RA Live: Moxie B2B Bradley Zero @ Waterworks 2022",
//     songs: [
//       { id: 0, title: "Passionfruit", artists: ["Drake"] },
//       { id: 1, title: "I Don't Know How to Love", artists: ["The Drums"] },
//       {
//         id: 2,
//         title: "Marienela (Que Pasa)",
//         artists: ["HUGEL", "Merk & Kremont", "Lirico En La Casa"],
//       },
//       { id: 3, title: "COULD BE WRONG", artists: ["LOSTBOYJAY"] },
//       { id: 4, title: "Profite - Kazy Lambist Remix", artists: ["Moi Je"] },
//       { id: 5, title: "Lovers Rock", artists: ["TV Girl"] },
//       {
//         id: 6,
//         title: `You're in My System - Dennis Quin Vocal Remix`,
//         artists: [
//           "Kerri Chandler",
//           "Jerome Syndeham",
//           "Troy Denari",
//           "Dennis Quin",
//         ],
//       },
//       {
//         id: 7,
//         title: "4EVA (feat. Pharrell Williams)",
//         artists: ["KAYTRAMINE", "Amine", "KAYTRANADA", "Pharrell Williams"],
//       },
//       { id: 8, title: "DOGTOOTH", artists: ["Tyler the Creator"] },
//       { id: 9, title: "I Feel Fantastic", artists: ["Riovaz"] },
//     ],
//     coverUrl: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/sohopalet.jpeg`,
//   } as PlaylistContext;
// }

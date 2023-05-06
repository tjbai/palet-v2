import Player1 from "@/components/Player/Player1";
import Player2 from "@/components/Player/Player2";
import { PlaylistContext } from "@/lib/hooks/usePlayerState";

async function fetchRootPlaylist() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: "",
    index: 0,
    name: "RA Live: Moxie B2B Bradley Zero @ Waterworks 2022",
    songs: [
      { id: 0, title: "Passionfruit", artists: ["Drake"] },
      { id: 1, title: "I Don't Know How to Love", artists: ["The Drums"] },
      {
        id: 2,
        title: "Marienela (Que Pasa)",
        artists: ["HUGEL", "Merk & Kremont", "Lirico En La Casa"],
      },
      { id: 3, title: "COULD BE WRONG", artists: ["LOSTBOYJAY"] },
      { id: 4, title: "Profite - Kazy Lambist Remix", artists: ["Moi Je"] },
      { id: 5, title: "Lovers Rock", artists: ["TV Girl"] },
      {
        id: 6,
        title: `You're in My System - Dennis Quin Vocal Remix`,
        artists: [
          "Kerri Chandler",
          "Jerome Syndeham",
          "Troy Denari",
          "Dennis Quin",
        ],
      },
      {
        id: 7,
        title: "4EVA (feat. Pharrell Williams)",
        artists: ["KAYTRAMINE", "Amine", "KAYTRANADA", "Pharrell Williams"],
      },
      { id: 8, title: "DOGTOOTH", artists: ["Tyler the Creator"] },
      { id: 9, title: "I Feel Fantastic", artists: ["Riovaz"] },
    ],
    coverUrl: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/sohopalet.jpeg`,
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
  const type = searchParams?.type;

  if (!type || type === "1" || Array.isArray(type)) {
    return <Player1 playlistContext={playlistContext} />;
  } else if (type === "2") {
    return <Player2 playlistContext={playlistContext} />;
  }
}

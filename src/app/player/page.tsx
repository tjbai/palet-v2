import Player1 from "@/components/Player/Player1";
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
    ],
  } as PlaylistContext;
}

/*
Fetches playlist metadata and context here.
When user interacts in the client component, it updates the context provider.
*/
export default async function Page() {
  const playlistContext = await fetchRootPlaylist(); // TODO: Avoid prop drilling
  return <Player1 playlistContext={playlistContext} />;
}

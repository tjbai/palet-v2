import Player1 from "@/components/Player/Player1";
import { usePlayer } from "@/components/Providers/PlayerProvider";

async function fetchRootPlaylist() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: "",
    index: 0,
    songs: [
      { id: 0, title: "Passionfruit" },
      { id: 1, title: "I Don't Know How to Love" },
      { id: 2, title: "Erase Me - Main" },
      { id: 3, title: "COULD BE WRONG" },
      { id: 4, title: "Profite - Kazy Lambist Remix" },
    ],
  };
}

/*
Fetches playlist metadata and context here.
When user interacts in the client component, it updates the context provider.
*/
export default async function Page() {
  const playlistContext = await fetchRootPlaylist();
  return <Player1 />;
}

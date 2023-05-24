import PlayerController from "@/components/Player/PlayerController";
import { PlaylistContext } from "@/lib/hooks/usePlayerState";
import axios from "axios";
import { headers } from "next/dist/client/components/headers";

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
  const headersList = headers();
  const url = headersList.get("x-url") || "";
  const base = new URL(url).origin;

  const { data } = await axios.post(`${base}/api/playlist`, {
    routeAlias,
  });
  const { playlistContext, error } = data;

  if (error) {
    console.log("error fetch playlistcontext: ", error);
    return null;
  }
  return playlistContext;
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

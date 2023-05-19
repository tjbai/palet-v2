import PlayerController from "@/components/Player/PlayerController";
import { PlaylistContext } from "@/lib/hooks/usePlayerState";
import { supabase } from "@/lib/sb/supabaseClient";
import { Database } from "@/types/supabase";

/* 
NOTE 2: This is just a copy of the /player route's fetch function
but matches to the "route alias" path param in the url.

NOTE: This is the only place we use the supabase API clientside.
We're gonna want to get rid of this and just make an endpoint for this...
*/
async function fetchPlaylist(name: string): Promise<PlaylistContext | null> {
  const { data, error } = await supabase
    .from("static_playlists")
    .select("id, name, cdn_image_url, origin_url, static_tracks(*)")
    .eq("route_alias", name);

  if (error || !data.length) {
    console.error(error);
    return null;
  }

  const playlist = data[0];
  console.log(playlist);
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

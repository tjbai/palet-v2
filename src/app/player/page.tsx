import PlayerController from "@/components/Player/PlayerController";
import { PlaylistContext } from "@/lib/hooks/usePlayerState";
import { supabase } from "@/lib/sb/supabaseClient";
import { Database } from "@/types/supabase";

/* 
NOTE: This is the only place we use the supabase API clientside.
We're gonna want to get rid of this and just make an endpoint for this...
*/
async function fetchRootPlaylist() {
  const { data, error } = await supabase
    .from("static_playlists")
    .select("id, name, cdn_image_url, origin_url, static_tracks(*)")
    .eq("name", "soho");

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
  const typeSearchParam = searchParams?.type;

  if (!playlistContext) return <h1>Error fetching</h1>;

  return (
    <PlayerController
      playlistContext={playlistContext}
      typeSearchParam={typeSearchParam}
    />
  );
}

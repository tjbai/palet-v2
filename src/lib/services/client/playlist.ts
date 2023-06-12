import { SearchParam } from "@/components/Player/PlayerController";
import axios from "axios";
import { QueryFunctionContext } from "react-query";
import { PlaylistPreview } from "../../types";

export const fetchPlaylistSongs = async ({
  queryKey,
}: QueryFunctionContext<SearchParam[], any>) => {
  const [_, routeAlias] = queryKey;

  if (!routeAlias) return null;

  const { data } = await axios.post("/api/track/getForPlaylist", {
    routeAlias,
  });

  if (data.error) return null;
  return data.playlistContext.playlistContext; // this is fked chill
};

export const fetchPlaylistPreviews = async () => {
  const { data } = await axios.get("/api/playlist");
  const res = data.playlistPreviews as PlaylistPreview[];
  res.sort((a, b) => b.kandiCount - a.kandiCount);
  return res;
};

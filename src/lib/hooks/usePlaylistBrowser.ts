import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "react-query";
import { BROWSE_PLAYLIST_CONTEXT_QUERY } from "../constants";

export default function usePlaylistBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const browse = (routeAlias: string) => {
    const type = searchParams.get("type");
    const newUrl = type
      ? `/player?crate=${routeAlias}&type=${type}`
      : `/player?crate=${routeAlias}`;
    router.push(newUrl);
    queryClient.invalidateQueries(BROWSE_PLAYLIST_CONTEXT_QUERY);
  };

  return { browse };
}

import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "react-query";

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
    queryClient.invalidateQueries("browsePlaylistContext");
  };

  return { browse };
}

import BelowNowPlayingError from "@/components/Common/BelowNowPlayingError";
import PlayerController from "@/components/Player/PlayerController";
import { fetchPlaylistContext } from "@/lib/services/server/playlist";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { type, crate } = searchParams;

  try {
    const { playlistContext, error } = await fetchPlaylistContext(
      crate as string
    );

    if (error) {
      return <BelowNowPlayingError error={error} />;
    }

    return (
      <PlayerController
        playlistContext={playlistContext!}
        type={type}
        crate={crate}
      />
    );
  } catch (error) {
    return <BelowNowPlayingError error={JSON.stringify(error)} />;
  }
}

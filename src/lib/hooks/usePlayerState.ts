import { useEffect, useState } from "react";

/* Fetching entire playlists should go into this interface */
export interface PlaylistContext {
  id: string | number | undefined;
  name: string;
  index: number;
  imageUrl?: string;
  originUrl: string;
  songs: NowPlaying[];
}

export interface NowPlaying {
  id: string | number;
  name: string;
  artists: string[];
  cdnPath: string;
  durationMs: number;
  kandiCount: number;
  originUrl: string;
}

export default function usePlayerState() {
  const [playlistContext, setPlaylistContext] =
    useState<PlaylistContext | null>(null);
  const [currentTrack, setCurrentTrack] = useState<NowPlaying | null>(null);
  const [playerSrc, setPlayerSrc] = useState<string>();
  const [playing, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!localStorage.getItem("lastListeningTo")) return;
    const lastTrack = JSON.parse(localStorage.getItem("lastListeningTo")!);

    // TODO: Make this propagate between loads (need to change how playlistContext is passed down)
  }, []);

  useEffect(() => {
    if (!playlistContext || playlistContext.index === -1) return;
    setCurrentTrack(playlistContext.songs[playlistContext.index]);
    setPlayerSrc(
      `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${
        playlistContext.songs[playlistContext.index].cdnPath
      }`
    );
    if (currentTrack) {
      localStorage.setItem("lastListeningTo", JSON.stringify(currentTrack));
    } else localStorage.removeItem("lastListeningTo");
  }, [playlistContext]);

  const nextSong = () => {
    if (!playlistContext || playlistContext.index === -1) return;
    setPlaylistContext({
      ...playlistContext,
      index: (playlistContext.index + 1) % playlistContext.songs.length,
    });
  };

  const prevSong = () => {
    if (!playlistContext || playlistContext.index === -1) return;
    if (playlistContext.index === 0) return;
    setPlaylistContext({
      ...playlistContext,
      index: playlistContext.index - 1,
    });
  };

  const selectSong = (name: string) => {
    if (!playlistContext || currentTrack?.name === name) return;
    const i = playlistContext.songs.findIndex((song) => song.name === name);
    if (i === null || i === undefined) return;
    setPlaylistContext({ ...playlistContext, index: i });
    setPlaying(true);
  };

  const toggle = () => {
    if (!playlistContext) return;
    if (playlistContext.index === -1) {
      setPlaylistContext({ ...playlistContext, index: 0 });
      setPlaying(true);
    } else setPlaying((p) => !p);
  };

  return {
    playlistContext,
    setPlaylistContext,
    currentTrack,
    setCurrentTrack,
    nextSong,
    prevSong,
    selectSong,
    playerSrc,
    playing,
    setPlaying,
    toggle,
  };
}

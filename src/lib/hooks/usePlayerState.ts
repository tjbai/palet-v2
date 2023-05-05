import { useEffect, useState } from "react";

/* Fetching entire playlists should go into this interface */
export interface PlaylistContext {
  id: string | number;
  name?: string;
  index: number;
  songs: NowPlaying[];
}

export interface NowPlaying {
  id: string | number;
  title: string;
  artists: string[];
}

export default function usePlayerState() {
  const [playlistContext, setPlaylistContext] =
    useState<PlaylistContext | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  useEffect(() => {
    if (!playlistContext) return;
    setNowPlaying(playlistContext.songs[playlistContext.index]);
  }, [playlistContext]);

  const nextSong = () => {
    if (!playlistContext) return;
    setPlaylistContext({
      ...playlistContext,
      index: (playlistContext.index + 1) % playlistContext.songs.length,
    });
  };

  const prevSong = () => {
    if (!playlistContext) return;
    if (playlistContext.index === 0) return;
    setPlaylistContext({
      ...playlistContext,
      index: playlistContext.index - 1,
    });
  };

  return {
    playlistContext,
    setPlaylistContext,
    nowPlaying,
    setNowPlaying,
    nextSong,
    prevSong,
  };
}

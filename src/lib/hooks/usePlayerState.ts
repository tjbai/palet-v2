import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { PlaylistContext, NowPlaying } from "../types";
import WaveSurfer from "wavesurfer.js";

export default function usePlayerState() {
  const [playlistContext, setPlaylistContext] =
    useState<PlaylistContext | null>(null);
  const [currentTrack, setCurrentTrack] = useState<NowPlaying | null>(null);
  const [playerSrc, setPlayerSrc] = useState<string>();
  const [playing, setPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const updatePlayerState = async () => {
      if (!playlistContext || playlistContext.index === -1) return;

      // Load source for current track
      const newTrack = playlistContext.songs[playlistContext.index];
      setCurrentTrack(newTrack);

      setLoading(true);
      const { data } = await axios.post("/api/track/generatePresignedUrl", {
        audioFilePath: newTrack.cdnPath,
      });
      const { signedUrl, error } = data;
      if (error) alert(error);
      else setPlayerSrc(signedUrl);
      setPlayerSrc(newTrack.cdnPath);
      setLoading(false);

      localStorage.setItem("lastSong", newTrack.name);
    };
    updatePlayerState();
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
    loading,
  };
}

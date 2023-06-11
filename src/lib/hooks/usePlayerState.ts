import axios from "axios";
import { useEffect, useState } from "react";
import { NowPlaying, PlayerQueryParams, PlaylistContext } from "../types";
import useQueryParams from "./useQueryParams";

const MODE_LOWER_BOUND = 0;
const MODE_UPPER_BOUND = 2;

export default function usePlayerState() {
  const [playlistContext, setPlaylistContext] =
    useState<PlaylistContext | null>(null);
  const [browsePlaylistContext, setBrowsePlaylistContext] =
    useState<PlaylistContext | null>(null);
  const [currentTrack, setCurrentTrack] = useState<NowPlaying | null>(null);
  const [playerSrc, setPlayerSrc] = useState<string>();
  const [playing, setPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [playerDisplayMode, setPlayerDisplayMode] = useState(0);
  const [shuffled, setShuffled] = useState(false);
  const { queryParams, setQueryParams } = useQueryParams<PlayerQueryParams>();

  useEffect(() => {
    const updatePlayerState = async () => {
      if (!playlistContext || playlistContext.index === -1) return;

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
    if (shuffled) {
      const newShuffledIndex =
        (playlistContext.shuffledIndex + 1) % playlistContext.songs.length;
      const newSongIndex = playlistContext.shuffledOrder[newShuffledIndex];
      setPlaylistContext({
        ...playlistContext,
        index: newSongIndex,
        shuffledIndex: newShuffledIndex,
      });
    } else {
      const newSongIndex =
        (playlistContext.index + 1) % playlistContext.songs.length;
      const newShuffledIndex =
        playlistContext.shuffledOrder.indexOf(newSongIndex);
      setPlaylistContext({
        ...playlistContext,
        index: newSongIndex,
        shuffledIndex: newShuffledIndex,
      });
    }
  };

  const prevSong = () => {
    if (!playlistContext || playlistContext.index === -1) return;
    if (playlistContext.index === 0 && !shuffled) return;
    if (shuffled) {
      const newShuffledIndex =
        playlistContext.shuffledIndex === 0
          ? playlistContext.songs.length - 1
          : playlistContext.shuffledIndex - 1;
      const newSongIndex = playlistContext.shuffledOrder[newShuffledIndex];
      setPlaylistContext({
        ...playlistContext,
        index: newSongIndex,
        shuffledIndex: newShuffledIndex,
      });
    } else {
      const newSongIndex = playlistContext.index - 1;
      const newShuffledIndex =
        playlistContext.shuffledOrder.indexOf(newSongIndex);
      setPlaylistContext({
        ...playlistContext,
        index: newSongIndex,
        shuffledIndex: newShuffledIndex,
      });
    }
  };

  const selectSong = (name: string) => {
    if (browsePlaylistContext !== playlistContext) {
      if (!browsePlaylistContext || currentTrack?.name === name) return;
      const i = browsePlaylistContext.songs.findIndex(
        (song) => song.name === name
      );
      if (i === null || i === undefined) return;
      const shuffledIndex = browsePlaylistContext.shuffledOrder.indexOf(i);
      setPlaylistContext({ ...browsePlaylistContext, index: i, shuffledIndex });
    } else {
      if (!playlistContext || currentTrack?.name === name) return;
      const i = playlistContext.songs.findIndex((song) => song.name === name);
      if (i === null || i === undefined) return;
      const shuffledIndex = playlistContext.shuffledOrder.indexOf(i);
      setPlaylistContext({ ...playlistContext, index: i, shuffledIndex });
    }
    setPlaying(true);
  };

  const toggle = () => {
    if (browsePlaylistContext && !playlistContext) {
      setPlaylistContext({ ...browsePlaylistContext, index: 0 });
      setPlaying(true);
    } else if (!playlistContext) {
      return;
    } else if (playlistContext.index === -1) {
      setPlaylistContext({ ...playlistContext, index: 0 });
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  const toggleShuffle = () => {
    setShuffled((p) => !p);
  };

  /* Honestly, this section probably doesn't belong here */

  const setMode = (mode: number) => {
    setQueryParams({ type: mode, crate: queryParams.crate });
    setPlayerDisplayMode(mode);
  };

  const prevMode = () => {
    setPlayerDisplayMode((prevMode) => {
      const newMode =
        prevMode === MODE_LOWER_BOUND ? MODE_UPPER_BOUND : prevMode - 1;
      setQueryParams({ type: newMode, crate: queryParams.crate });
      return newMode;
    });
  };

  const nextMode = () => {
    setPlayerDisplayMode((prevMode) => {
      const newMode =
        prevMode === MODE_UPPER_BOUND ? MODE_LOWER_BOUND : prevMode + 1;
      setQueryParams({ type: newMode, crate: queryParams.crate });
      return newMode;
    });
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
    browsePlaylistContext,
    setBrowsePlaylistContext,
    setMode,
    nextMode,
    prevMode,
    playerDisplayMode,
    toggleShuffle,
    shuffled,
  };
}

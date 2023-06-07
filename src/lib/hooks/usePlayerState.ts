import axios from "axios";
import router, { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NowPlaying, PlaylistContext } from "../types";

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
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log(playerDisplayMode);
  }, [playerDisplayMode]);

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
    if (browsePlaylistContext !== playlistContext) {
      if (!browsePlaylistContext || currentTrack?.name === name) return;
      const i = browsePlaylistContext.songs.findIndex(
        (song) => song.name === name
      );
      if (i === null || i === undefined) return;
      setPlaylistContext({ ...browsePlaylistContext, index: i });
    } else {
      if (!playlistContext || currentTrack?.name === name) return;
      const i = playlistContext.songs.findIndex((song) => song.name === name);
      if (i === null || i === undefined) return;
      setPlaylistContext({ ...playlistContext, index: i });
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

  /* Honestly, this section probably doesn't belong here */

  const setMode = (mode: number) => {
    const crate = searchParams.get("crate");
    const newUrl = crate
      ? `/player?crate=${crate}&type=${mode}`
      : `/player?type=${mode}`;
    router.push(newUrl);
    setPlayerDisplayMode(mode);
  };

  const prevMode = () => {
    setPlayerDisplayMode((prevMode) => {
      const newMode =
        prevMode === MODE_LOWER_BOUND ? MODE_UPPER_BOUND : prevMode - 1;
      setMode(newMode);
      return newMode;
    });
  };

  const nextMode = () => {
    setPlayerDisplayMode((prevMode) => {
      const newMode =
        prevMode === MODE_UPPER_BOUND ? MODE_LOWER_BOUND : prevMode + 1;
      setMode(newMode);
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
    nextMode,
    prevMode,
    playerDisplayMode,
    setMode,
  };
}

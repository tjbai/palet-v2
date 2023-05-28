"use client";

import usePlayerState from "@/lib/hooks/usePlayerState";
import { PlaylistContext, NowPlaying } from "@/lib/types";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";

interface PlayerContext {
  playlistContext: PlaylistContext | null;
  setPlaylistContext: Dispatch<SetStateAction<PlaylistContext | null>>;
  currentTrack: NowPlaying | null;
  nextSong: () => void;
  prevSong: () => void;
  selectSong: (name: string) => void;
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  playTime: number;
  playerLoading: boolean;
}

const playerContext = createContext({} as PlayerContext);

export default function PlayerProvider(props: { children: ReactNode }) {
  const [hasWindow, setHasWindow] = useState(false);
  const [playTime, setPlaytime] = useState(0);
  const [player, setPlayer] = useState<JSX.Element | null>(null);
  const playerRef = useRef<ReactPlayer>(null);

  const {
    playlistContext,
    setPlaylistContext,
    currentTrack,
    nextSong,
    prevSong,
    selectSong,
    playerSrc,
    playing,
    setPlaying,
    toggle,
    loading: playerLoading,
  } = usePlayerState();

  useEffect(() => {
    if (typeof window !== undefined) setHasWindow(true);
  }, []);

  useEffect(() => {
    if (!playerSrc) setPlayer(null);
    else {
      const newPlayer = (
        <ReactPlayer
          ref={playerRef}
          url={playerSrc}
          playing={playing}
          onEnded={nextSong}
          onProgress={handleProgress}
        />
      );
      console.log("making new player");
      setPlayer(newPlayer);
    }
  }, [playerSrc, playing]);

  const handleProgress = (progress: OnProgressProps) => {
    const { playedSeconds } = progress;
    setPlaytime(playedSeconds);
  };

  return (
    <playerContext.Provider
      value={{
        playlistContext,
        setPlaylistContext,
        currentTrack,
        nextSong,
        prevSong,
        selectSong,
        playing,
        setPlaying,
        toggle,
        playTime,
        playerLoading,
      }}
    >
      {hasWindow ? <div style={{ display: "none" }}>{player}</div> : null}
      {props.children}
    </playerContext.Provider>
  );
}

const usePlayer = () => useContext(playerContext);
export { usePlayer };

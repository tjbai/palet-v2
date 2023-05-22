"use client";

import usePlayerState, {
  NowPlaying,
  PlaylistContext,
} from "@/lib/hooks/usePlayerState";
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
}

const playerContext = createContext({} as PlayerContext);

export default function PlayerProvider(props: { children: ReactNode }) {
  const [hasWindow, setHasWindow] = useState(false);
  const [playTime, setPlaytime] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (typeof window !== undefined) setHasWindow(true);
  }, []);

  const handleProgress = (progress: OnProgressProps) => {
    const { playedSeconds } = progress;
    setPlaytime(playedSeconds);
  };

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
  } = usePlayerState();

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
      }}
    >
      {hasWindow ? (
        <div style={{ display: "none" }}>
          <ReactPlayer
            ref={playerRef}
            url={playerSrc}
            playing={playing}
            onEnded={nextSong}
            onProgress={handleProgress}
          />
        </div>
      ) : null}
      {props.children}
    </playerContext.Provider>
  );
}

const usePlayer = () => useContext(playerContext);
export { usePlayer };

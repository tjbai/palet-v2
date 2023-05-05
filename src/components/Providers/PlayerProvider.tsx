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

interface PlayerContext {
  playlistContext: PlaylistContext | null;
  setPlaylistContext: Dispatch<SetStateAction<PlaylistContext | null>>;
  nowPlaying: NowPlaying | null;
  setNowPlaying: Dispatch<SetStateAction<NowPlaying | null>>;
  nextSong: () => void;
  prevSong: () => void;
}

const playerContext = createContext({} as PlayerContext);

export default function PlayerProvider(props: { children: ReactNode }) {
  const [hasWindow, setHasWindow] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (typeof window !== undefined) setHasWindow(true);
  }, []);

  const {
    playlistContext,
    setPlaylistContext,
    nowPlaying,
    setNowPlaying,
    nextSong,
    prevSong,
  } = usePlayerState();

  return (
    <playerContext.Provider
      value={{
        playlistContext,
        setPlaylistContext,
        nowPlaying,
        setNowPlaying,
        nextSong,
        prevSong,
      }}
    >
      {hasWindow ? (
        <div style={{ display: "none" }}>
          <ReactPlayer ref={playerRef} />
        </div>
      ) : null}
      {props.children}
    </playerContext.Provider>
  );
}

const usePlayer = () => useContext(playerContext);
export { usePlayer };

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
  currentTrack: NowPlaying | null;
  nextSong: () => void;
  prevSong: () => void;
  selectSong: (name: string, givenContext: PlaylistContext) => void;
  playing: boolean;
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
    currentTrack,
    nextSong,
    prevSong,
    selectSong,
    playerSrc,
    playing,
  } = usePlayerState();

  return (
    <playerContext.Provider
      value={{
        playlistContext,
        currentTrack,
        nextSong,
        prevSong,
        selectSong,
        playing,
      }}
    >
      {hasWindow ? (
        <div style={{ display: "none" }}>
          <ReactPlayer
            ref={playerRef}
            url={playerSrc}
            playing={playing}
            onEnded={nextSong}
          />
        </div>
      ) : null}
      {props.children}
    </playerContext.Provider>
  );
}

const usePlayer = () => useContext(playerContext);
export { usePlayer };

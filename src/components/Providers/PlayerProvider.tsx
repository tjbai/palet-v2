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
}

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
  const [playlistContext, setPlaylistContext] =
    useState<PlaylistContext | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (typeof window !== undefined) setHasWindow(true);
  }, []);

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

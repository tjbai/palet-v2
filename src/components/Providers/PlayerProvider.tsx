import { ReactNode, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

// TODO: (at some distant point in the future) Refactor everything out into a hook
export default function PlayerProvider(props: { children: ReactNode }) {
  const [hasWindow, setHasWindow] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (typeof window !== undefined) setHasWindow(true);
  }, []);

  return (
    <>
      {hasWindow ? (
        <div style={{ display: "none" }}>
          <ReactPlayer ref={playerRef} />
        </div>
      ) : null}
      {props.children}
    </>
  );
}

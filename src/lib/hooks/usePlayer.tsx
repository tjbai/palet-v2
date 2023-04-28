import { useState } from "react";

const useReactPlayer = () => {
  const [playing, setPlaying] = useState(false);

  const play = () => setPlaying(true);

  const pause = () => setPlaying(false);

  const toggle = () => setPlaying((p) => !p);

  return { playing, setPlaying, play, pause, toggle };
};

export default useReactPlayer;

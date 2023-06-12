"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePlayer } from "./PlayerProvider";

interface ModalContext {
  joinModal: boolean;
  setJoinModal: Dispatch<SetStateAction<boolean>>;
  discoverModal: boolean;
  setDiscoverModal: Dispatch<SetStateAction<boolean>>;
}

const modalContext = createContext({} as ModalContext);

export const useModal = () => useContext(modalContext);

export default function ModalProvider(props: { children: ReactNode }) {
  const { browsePlaylistContext, playlistContext } = usePlayer();
  const [joinModal, setJoinModal] = useState(false);
  const [discoverModal, setDiscoverModal] = useState(false);

  useEffect(() => {
    if (!browsePlaylistContext && !playlistContext) setDiscoverModal(true);
    else setDiscoverModal(false);
  }, [browsePlaylistContext, playlistContext]);

  return (
    <modalContext.Provider
      value={{ joinModal, setJoinModal, discoverModal, setDiscoverModal }}
    >
      {props.children}
    </modalContext.Provider>
  );
}

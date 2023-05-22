"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface ModalContext {
  joinModal: boolean;
  setJoinModal: (value: boolean) => void;
}

const modalContext = createContext({} as ModalContext);

export default function ModalProvider(props: { children: ReactNode }) {
  const [joinModal, setJoinModal] = useState(false);

  return (
    <modalContext.Provider value={{ joinModal, setJoinModal }}>
      {props.children}
    </modalContext.Provider>
  );
}

const useModal = () => useContext(modalContext);
export { useModal };

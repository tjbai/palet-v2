"use client";

import useStickyBackground, {
  BackgroundImage,
  BackgroundType,
  Gradient,
} from "@/lib/hooks/useStickyBackground";
import { ReactNode, createContext, useContext } from "react";

interface GlobalStyles {
  gradient: Gradient;
  backgroundImage: BackgroundImage;
  setBackground: (bg: BackgroundType) => void;
}

const globalStyleContext = createContext({} as GlobalStyles);

export default function StyleProvider(props: { children: ReactNode }) {
  const { setBackground, gradient, backgroundImage } = useStickyBackground();

  return (
    <globalStyleContext.Provider
      value={{
        gradient,
        backgroundImage,
        setBackground,
      }}
    >
      {props.children}
    </globalStyleContext.Provider>
  );
}

const useStyles = () => useContext(globalStyleContext);
export { useStyles };

import { usePathname } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface GlobalStyles {
  gradient: Gradient;
  setGradient: Dispatch<SetStateAction<Gradient>>;
  backgroundImage: BackgroundImage;
  setBackgroundImage: Dispatch<SetStateAction<BackgroundImage>>;
}

export type Gradient = {
  position: "bottom" | "top";
  intensity: number;
};
export type BackgroundImage =
  | "images/landing-bg-v2.jpg"
  | "images/player-bg-1.jpg";

const globalStyleContext = createContext({} as GlobalStyles);

export default function StyleProvider(props: { children: ReactNode }) {
  const [gradient, setGradient] = useState<Gradient>({
    position: "bottom",
    intensity: 20,
  });
  const [backgroundImage, setBackgroundImage] = useState<BackgroundImage>(
    "images/landing-bg-v2.jpg"
  );

  return (
    <globalStyleContext.Provider
      value={{
        gradient,
        setGradient,
        backgroundImage,
        setBackgroundImage,
      }}
    >
      {props.children}
    </globalStyleContext.Provider>
  );
}

const useStyles = () => useContext(globalStyleContext);
export { useStyles };

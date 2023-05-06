import useStickyBackground, {
  BackgroundImage,
  BackgroundType,
  Gradient,
} from "@/lib/hooks/useStickyBackground";
import { ReactNode, createContext, useContext } from "react";

interface GlobalStyles {
  gradient: Gradient;
  // setGradient: Dispatch<SetStateAction<Gradient>>;
  backgroundImage: BackgroundImage;
  // setBackgroundImage: Dispatch<SetStateAction<BackgroundImage>>;
  setBackground: (bg: BackgroundType) => void;
}

const globalStyleContext = createContext({} as GlobalStyles);

export default function StyleProvider(props: { children: ReactNode }) {
  // const [gradient, setGradient] = useState<Gradient>({
  //   position: "bottom",
  //   intensity: 20,
  //   exists: true,
  // });
  // const [backgroundImage, setBackgroundImage] = useState<BackgroundImage>(
  //   "images/landing-bg-v2.jpg"
  // );

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

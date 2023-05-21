import { useEffect, useState } from "react";

export type Gradient = {
  exists: boolean;
  position: "bottom" | "top" | null;
  intensity: number;
};

export type BackgroundImage =
  | "/images/landing-bg-v2.avif"
  | "/images/player-bg-1.avif"
  | "";

export type BackgroundType = "landing" | "about" | "player1" | "player2";

const DEFAULT_GRADIENT = {
  exists: true,
  position: "bottom",
  intensity: 20,
} as Gradient;
const DEFAULT_BACKGROUND = "" as BackgroundImage;

/*
Note: This is a really hacky way to get certain backgrounds to persist on different pages.
FIXME: Create a BackgroundController that does all this server-side
 */
export default function useStickyBackground() {
  const [gradient, setGradient] = useState<Gradient>(DEFAULT_GRADIENT);
  const [backgroundImage, setBackgroundImage] =
    useState<BackgroundImage>(DEFAULT_BACKGROUND);

  useEffect(() => {
    /* Load background and gradient presets from localStorage */
    setGradient(
      localStorage.getItem("gradient")
        ? JSON.parse(localStorage.getItem("gradient")!)
        : {
            position: "bottom",
            intensity: 20,
            exists: true,
          }
    );
    setBackgroundImage(
      localStorage.getItem("backgroundImage")
        ? JSON.parse(localStorage.getItem("backgroundImage")!)
        : "images/landing-bg-v2.jpg"
    );
  }, []);

  const setBackground = (bgType: BackgroundType) => {
    let newGrad: Gradient, newBg: BackgroundImage;
    if (bgType === "landing") {
      newGrad = { position: "bottom", intensity: 20, exists: true };
      newBg = "/images/landing-bg-v2.avif";
    } else if (bgType === "about") {
      newGrad = { position: "top", intensity: 20, exists: true };
      newBg = "/images/landing-bg-v2.avif";
    } else if (bgType === "player1") {
      newGrad = { position: "top", intensity: 70, exists: true };
      newBg = "/images/player-bg-1.avif";
    } else {
      newGrad = DEFAULT_GRADIENT;
      newBg = DEFAULT_BACKGROUND;
    }

    setGradient(newGrad);
    setBackgroundImage(newBg);
    localStorage.setItem("gradient", JSON.stringify(newGrad));
    localStorage.setItem("backgroundImage", JSON.stringify(newBg));
  };

  return { setBackground, gradient, backgroundImage };
}

import { useState } from "react";

export type Gradient = {
  exists: boolean;
  position: "bottom" | "top";
  intensity: number;
};

export type BackgroundImage =
  | "/images/landing-bg-v2.avif"
  | "/images/player-bg-1.avif"
  | "";

export type BackgroundType = "landing" | "about" | "player1" | "player2";

export default function useStickyBackground() {
  const [gradient, setGradient] = useState<Gradient>(
    localStorage.getItem("gradient")
      ? JSON.parse(localStorage.getItem("gradient")!)
      : {
          position: "bottom",
          intensity: 20,
          exists: true,
        }
  );
  const [backgroundImage, setBackgroundImage] = useState<BackgroundImage>(
    localStorage.getItem("backgroundImage")
      ? JSON.parse(localStorage.getItem("backgroundImage")!)
      : "images/landing-bg-v2.jpg"
  );

  // TODO: Make this all happen server-side
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
    }
    // Case: player2
    else {
      newGrad = { ...gradient, exists: false };
      newBg = "";
    }

    setGradient(newGrad);
    setBackgroundImage(newBg);
    localStorage.setItem("gradient", JSON.stringify(newGrad));
    localStorage.setItem("backgroundImage", JSON.stringify(newBg));
  };

  return { setBackground, gradient, backgroundImage };
}

import { createContext, ReactNode, useContext, useState } from "react";

interface GlobalStyles {
  gradientPosition: "bottom" | "top";
  setGradientPosition: (position: "bottom" | "top") => void;
}

const globalStyleContext = createContext({} as GlobalStyles);

export default function StyleProvider(props: { children: ReactNode }) {
  const [gradientPosition, setGradientPosition] = useState<"bottom" | "top">(
    "bottom"
  );

  return (
    <globalStyleContext.Provider
      value={{ gradientPosition, setGradientPosition }}
    >
      {props.children}
    </globalStyleContext.Provider>
  );
}

const useStyles = () => useContext(globalStyleContext);
export { useStyles };

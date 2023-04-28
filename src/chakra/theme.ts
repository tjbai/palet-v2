import { extendTheme } from "@chakra-ui/react";
import { Archivo } from "next/font/google";

import Button from "./Button";

const archivo = Archivo({ subsets: ["latin"] });

const theme = extendTheme({
  components: {
    Button,
  },
  colors: {
    hl: "#f97470",
  },
  fonts: {
    body: archivo.style.fontFamily,
  },
  textStyles: {},
});

export default theme;

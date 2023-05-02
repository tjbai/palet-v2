import { extendTheme } from "@chakra-ui/react";
import "@fontsource/inconsolata";
import "@fontsource/archivo";

import Button from "./Button";

const theme = extendTheme({
  components: {
    Button,
  },
  colors: {
    hl: "#f97470",
  },
  fonts: {
    body: `'Archivo', sans-serif`,
    bodyalt: `'Inconsolata', monospace`,
  },
  textStyles: {},
});

export default theme;

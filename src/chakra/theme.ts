import { extendTheme } from "@chakra-ui/react";

import "@fontsource/inconsolata";
import "@fontsource/archivo";
import "@fontsource/arimo";

import Button from "./Button";

const theme = extendTheme({
  components: {
    Button,
  },
  colors: {
    hl: "#f97470",
  },
  fonts: {
    body: `'Arimo', sans-serif`,
    bodyalt: `'Inconsolata', monospace`,
  },
  textStyles: {},
});

export default theme;

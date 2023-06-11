import { extendTheme } from "@chakra-ui/react";

import "@fontsource/inconsolata";
import "@fontsource/arimo";
import "@fontsource/share-tech-mono";

import Button from "./Button";
import Modal from "./Modal";

const theme = extendTheme({
  components: {
    Button,
    Modal,
  },
  colors: {
    hl: "#f97470",
    bright_pink: "#FD0089",
    bg: "#f0eded",
    orange: "#E96034",
    purple: "#A463FF",
    dark_purple: "#7e4ac7",
    green: "#00ED95",
  },
  fonts: {
    body: `'Arimo', sans-serif`,
    bodyalt: `'Inconsolata', monospace`,
    tech: `'Share Tech Mono', sans-serif`,
  },
  textStyles: {},
});

export default theme;

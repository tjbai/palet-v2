import { defineStyleConfig } from "@chakra-ui/react";

const Modal = defineStyleConfig({
  sizes: {
    sizable: {
      dialog: { maxW: "40%", w: "40%", maxH: "70%", borderRadius: "0px" },
    },
  },
});

export default Modal;

import { defineStyleConfig } from "@chakra-ui/react";

const Button = defineStyleConfig({
  variants: {
    base: {
      borderRadius: "50px",
      border: "1px solid",
      borderColor: "black",
      transition: "0.5s",
      _hover: {
        color: "white",
        borderColor: "white",
      },
    },
  },
});

export default Button;

import { defineStyleConfig, transition } from "@chakra-ui/react";

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
    tactile: {
      boxShadow:
        "5.28932px 5.28932px 10.5786px #C9D9E8, -5.28932px -5.28932px 10.5786px #f7f7f7",

      _hover: {
        boxShadow:
          "8px 8px 12px #C9D9E8, -5.28932px -5.28932px 10.5786px #f7f7f7",
        transition: "0.3s ease-in-out",
      },
      _active: {
        transform: "scale(0.95)",
        transition: "transform 0.3s",
        boxShadow:
          "5.28932px 5.28932px 10.5786px #C9D9E8, -5.28932px -5.28932px 10.5786px #f7f7f7",
      },
    },
  },
});

export default Button;

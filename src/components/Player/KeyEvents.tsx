import useKandi from "@/lib/hooks/useKandi";
import { Flex, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import Kandi from "../Common/Kandi";
import { usePlayer } from "../Providers/PlayerProvider";
import { BiToggleLeft } from "react-icons/bi";

export default function KeyEvents() {
  const { handleDonation } = useKandi();
  const { prevMode, nextMode, toggle, toggleShuffle } = usePlayer();
  const toast = useToast();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleDonation();

        toast({
          position: "bottom-right",
          duration: 1000,
          description: "Received donation request!",
          containerStyle: {
            padding: "0px",
            width: "fit-content",
            alignItems: "flex-end",
            display: "flex",
            justifyContent: "flex-end",
          },
          render: () => (
            <Flex fontSize="30px">
              <Kandi size={40} />
            </Flex>
          ),
        });
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        prevMode();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        nextMode();
      } else if (e.code === "KeyP") {
        e.preventDefault();
        toggle();
      } else if (e.code === "KeyS") {
        e.preventDefault();
        toggleShuffle();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return null;
}

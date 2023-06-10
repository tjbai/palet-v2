import { searchParamToPlayerState } from "@/lib/util";
import { Flex, useToast } from "@chakra-ui/react";
import { type } from "os";
import { useEffect } from "react";
import Kandi from "../Common/Kandi";
import useKandi from "@/lib/hooks/useKandi";
import { usePlayer } from "../Providers/PlayerProvider";

export default function KeyEvents() {
  const { handleDonation } = useKandi();
  const { prevMode, nextMode } = usePlayer();
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
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return null;
}

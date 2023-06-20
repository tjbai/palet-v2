import { Flex } from "@chakra-ui/react";
import PlayingMode from "./PlayingMode";
import { useModal } from "@/components/Providers/ModalProvider";
import DiscoverMode from "./DiscoverMode";

export default function VerticalTrackDisplay() {
  const { discoverModal, setDiscoverModal } = useModal();

  return (
    <Flex
      h="100%"
      flex={2}
      mr={{ base: "0px", md: "10px" }}
      borderRadius="15px"
      bg="black"
      fontFamily="tech"
      maxW={{ base: "100%", md: "40%" }}
      direction="column"
      overflow="hidden"
      pt="5px"
      pl="15px"
      boxShadow="inset -5px -5px 20px rgba(255,255,255,0.4)"
      position="relative"
    >
      {discoverModal ? <DiscoverMode /> : <PlayingMode />}
    </Flex>
  );
}

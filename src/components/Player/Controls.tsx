import { HStack } from "@chakra-ui/react";
import {
  RiSkipBackFill,
  RiPauseFill,
  RiPlayFill,
  RiSkipForwardFill,
} from "react-icons/ri";
import { usePlayer } from "../Providers/PlayerProvider";
import ClickIcon from "../Util/ClickIcon";

export default function Controls() {
  const { nextSong, prevSong, playing, toggle } = usePlayer();

  return (
    <HStack zIndex={5} fontSize={{ base: "30px" }} spacing={{ base: 5, md: 3 }}>
      <ClickIcon as={RiSkipBackFill} onClick={prevSong} />
      <ClickIcon as={playing ? RiPauseFill : RiPlayFill} onClick={toggle} />
      <ClickIcon as={RiSkipForwardFill} onClick={nextSong} />
    </HStack>
  );
}

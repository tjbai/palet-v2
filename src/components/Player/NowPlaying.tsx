"use client";

import { Flex, HStack, Text } from "@chakra-ui/react";
import { RiSkipBackFill, RiSkipForwardFill } from "react-icons/ri";
import { usePlayer } from "../Providers/PlayerProvider";
import { useStyles } from "../Providers/StyleProvider";
import ClickIcon from "../Util/ClickIcon";
import { artistsToString, msToTime } from "@/lib/util";

export default function NowPlaying() {
  const { gradient } = useStyles();
  const { currentTrack } = usePlayer();

  return (
    <Flex
      w="calc(100vw - 50px)"
      borderY="1px solid"
      h={{ base: "45px", md: "60px" }}
      top="70px"
      position="fixed"
      align="center"
      justify="space-between"
      bg={gradient.exists ? "transparent" : "bg"}
      color={
        gradient.position === "top" || !gradient.exists ? "black" : "white"
      }
      borderColor={
        gradient.position === "top" || !gradient.exists ? "black" : "white"
      }
      transition="color 2s ease-in-out"
      fontSize={{ base: "12px", md: "17px" }}
      zIndex={10}
    >
      <Text fontWeight="bold">
        NOW PLAYING: {currentTrack?.name}
        {currentTrack?.artists
          ? " by " + artistsToString(currentTrack?.artists)
          : ""}
        {currentTrack?.durationMs
          ? " (" + msToTime(currentTrack?.durationMs) + ")"
          : ""}
      </Text>
      <Controls />
    </Flex>
  );
}

function Controls() {
  const { nextSong, prevSong } = usePlayer();
  return (
    <HStack zIndex={20} onClick={() => console.log("yo")}>
      <ClickIcon as={RiSkipBackFill} onClick={prevSong} />
      <ClickIcon />
      <ClickIcon as={RiSkipForwardFill} onClick={nextSong} />
    </HStack>
  );
}

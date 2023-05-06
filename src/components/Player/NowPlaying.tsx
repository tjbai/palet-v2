"use client";

import artistsToString from "@/lib/funcs/artistsToString";
import { Flex, HStack, Text } from "@chakra-ui/react";
import { RiSkipBackFill, RiSkipForwardFill } from "react-icons/ri";
import { usePlayer } from "../Providers/PlayerProvider";
import { useStyles } from "../Providers/StyleProvider";
import ClickIcon from "../Util/ClickIcon";

export default function NowPlaying() {
  const { gradient } = useStyles();
  const { nowPlaying } = usePlayer();

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
    >
      <Text fontWeight="bold">
        NOW PLAYING: {nowPlaying?.title}
        {nowPlaying?.artists
          ? " by " + artistsToString(nowPlaying?.artists)
          : ""}
      </Text>
      <Controls />
    </Flex>
  );
}

function Controls() {
  const { nextSong, prevSong } = usePlayer();
  return (
    <HStack>
      <ClickIcon as={RiSkipBackFill} onClick={prevSong} />
      <ClickIcon />
      <ClickIcon as={RiSkipForwardFill} onClick={nextSong} />
    </HStack>
  );
}

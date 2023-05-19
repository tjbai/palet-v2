"use client";

import { Box, Flex, HStack, Highlight, Text } from "@chakra-ui/react";
import {
  RiSkipBackFill,
  RiSkipForwardFill,
  RiPlayFill,
  RiPauseFill,
} from "react-icons/ri";
import { usePlayer } from "../Providers/PlayerProvider";
import { useStyles } from "../Providers/StyleProvider";
import ClickIcon from "../Util/ClickIcon";
import { artistsToString, msToTime } from "@/lib/util";
import { useEffect, useState } from "react";
import { progress } from "framer-motion";
import { FaToggleOff } from "react-icons/fa";

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
      <CurrentTrackDisplay />
      <Controls />
      <TimestampIndicator />
    </Flex>
  );
}

function CurrentTrackDisplay() {
  const { playlistContext, currentTrack, toggle } = usePlayer();

  if (!playlistContext?.name) {
    return <h1>Error...</h1>;
  } else if (playlistContext?.index !== -1) {
    return (
      <Text fontWeight="bold">
        <Highlight
          query={playlistContext?.name}
          styles={{
            border: "1px solid black",
            px: "2",
            py: "1",
            borderRadius: "20px",
          }}
        >
          {"Now Playing: " +
            currentTrack?.name! +
            " by " +
            artistsToString(currentTrack?.artists) +
            " (" +
            msToTime(currentTrack?.durationMs) +
            ") from " +
            playlistContext?.name}
        </Highlight>
      </Text>
    );
  } else {
    return (
      <Text fontWeight="bold" _hover={{ cursor: "pointer" }} onClick={toggle}>
        <Highlight
          query={playlistContext?.name}
          styles={{
            border: "1px solid black",
            px: "2",
            py: "1",
            borderRadius: "20px",
          }}
        >
          {"Start listening to " + playlistContext?.name}
        </Highlight>
      </Text>
    );
  }
}

function Controls() {
  const { nextSong, prevSong, playing, toggle } = usePlayer();

  return (
    <HStack zIndex={20}>
      <ClickIcon as={RiSkipBackFill} onClick={prevSong} />
      <ClickIcon as={playing ? RiPauseFill : RiPlayFill} onClick={toggle} />
      <ClickIcon as={RiSkipForwardFill} onClick={nextSong} />
    </HStack>
  );
}

// FIXME: this shi doesn't really work
// this is some of the worst code ive written in my life
function TimestampIndicator() {
  const { playing, currentTrack, toggle } = usePlayer();
  const [offset, setOffset] = useState(0);
  const [prevTrack, setPrevTrack] = useState<any>(null);
  const [intervalId, setIntervalId] = useState<any>();

  // TODO: i have no idea what i'm doing
  useEffect(() => {
    if (!intervalId) return;
    return () => clearInterval(intervalId);
  }, [intervalId]);

  useEffect(() => {
    if (playing) {
      setOffset(0);
      clearInterval(intervalId);
      startAnimation();
    }
  }, [currentTrack]);

  useEffect(() => {
    if (playing) startAnimation();
    else clearInterval(intervalId);
  }, [playing]);

  const startAnimation = () => {
    const PERCEIVED_DELAY = 750;
    const startOffset = currentTrack === prevTrack ? offset : 0;
    const startTime = Date.now();
    const id = setInterval(() => {
      console.log(id);
      const elapsed = Date.now() - startTime;
      const progress = elapsed / currentTrack?.durationMs!; // percentage crossage
      const additionalOffset = progress * (window.innerWidth - 50);
      setOffset(
        Math.min(startOffset + additionalOffset, window.innerWidth - 50)
      );
      setPrevTrack(currentTrack);
      if (progress >= 1) {
        setOffset(0);
        clearInterval(id);
      }
    }, 1000);
    setIntervalId(id);
  };

  if (!currentTrack) return null;

  return (
    <Box
      position="absolute"
      transform={`translateX(${offset}px)`}
      transition="1s linear transform"
      top={{ base: "40px", md: "52.5px" }}
      w={{ base: "7px", md: "10px" }}
      h={{ base: "7px", md: "10px" }}
      bg="black"
      borderRadius="100%"
    />
  );
}

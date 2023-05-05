"use client";

import { usePlayer } from "@/components/Providers/PlayerProvider";
import { useStyles } from "@/components/Providers/StyleProvider";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Player1() {
  const { setBackgroundImage, setGradient } = useStyles();
  const { nowPlaying } = usePlayer();

  useEffect(() => {
    setBackgroundImage("images/player-bg-1.jpg");
    setGradient({ position: "top", intensity: 70 });
  }, []);

  return (
    <Flex position="relative" top="50px" h="100vh" pt="1.5vw">
      <Flex
        w="100%"
        borderY="1px solid black"
        h="60px"
        position="fixed"
        align="center"
      >
        <Text fontWeight="bold">NOW PLAYING: {nowPlaying?.title}</Text>
      </Flex>
    </Flex>
  );
}

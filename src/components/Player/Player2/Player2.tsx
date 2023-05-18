"use client";

import { usePlayer } from "@/components/Providers/PlayerProvider";
import { useStyles } from "@/components/Providers/StyleProvider";
import { NowPlaying, PlaylistContext } from "@/lib/hooks/usePlayerState";
import { Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Player2({
  playlistContext,
}: {
  playlistContext: PlaylistContext;
}) {
  const { setBackground } = useStyles();
  const { currentTrack } = usePlayer();

  useEffect(() => setBackground("player2"), []);

  useEffect(() => {
    if (!currentTrack) return;

    const timeout = setTimeout(() => {
      const element = document.getElementById(`${currentTrack.id}`);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  }, [currentTrack]);

  return (
    <Flex
      position="relative"
      top="130px"
      overflowY="scroll"
      zIndex={3}
      border="1px solid red"
    >
      <Flex flex={1} direction="row" zIndex={-1} h="calc(100vh - 130px)">
        <Flex
          flex={1}
          direction="column"
          h={{ base: "calc(100vh - 115px)", md: "calc(100vh - 130px)" }}
        >
          <Flex
            position="relative"
            direction="column"
            overflowY="scroll"
            h="calc(100vh - 130px)"
            border="1px solid red"
            _hover={{ cursor: "pointer" }}
          >
            {playlistContext.songs.map((song, index) => (
              <ScrollPiece
                key={song.id}
                song={song}
                index={index}
                playlistContext={playlistContext}
              />
            ))}
          </Flex>
        </Flex>
        <Flex
          flex={1}
          align="flex-start"
          h="calc(100vh - 130px)"
          overflowY="scroll"
          display={{ base: "none", md: "flex" }}
        >
          <Image
            src={playlistContext.imageUrl}
            alt="Album Cover"
            objectFit="contain"
            m={0}
            _hover={{ cursor: "pointer" }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

function ScrollPiece({
  song,
  index,
  playlistContext,
}: {
  song: NowPlaying;
  index: number;
  playlistContext: PlaylistContext;
}) {
  const { currentTrack, selectSong } = usePlayer();
  const [selected, setSelected] = useState(currentTrack?.id === song.id);

  useEffect(() => {
    setSelected(currentTrack?.id === song.id);
  }, [currentTrack]);

  return (
    <Flex
      id={`${song.id}`}
      borderBottom="1px solid black"
      pb="10px"
      w={{ base: "100%", md: "90%" }}
      mb="10px"
      _hover={{ cursor: "pointer" }}
      onClick={() => selectSong(song.name)}
      color={selected ? "bright_pink" : "black"}
      pt={index ? "0px" : "10px"}
    >
      <Text fontSize="45px" lineHeight="45px">
        {song.name}
      </Text>
    </Flex>
  );
}

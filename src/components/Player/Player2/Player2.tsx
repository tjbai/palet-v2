"use client";

import { usePlayer } from "@/components/Providers/PlayerProvider";
import { useStyles } from "@/components/Providers/StyleProvider";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BelowNowPlayingWrapper from "../BelowNowPlayingWrapper";
import { PlaylistContext, NowPlaying } from "@/lib/types";
import styleConstants from "@/lib/chakra/styleConstants";

export default function Player2({
  playlistContext,
}: {
  playlistContext: PlaylistContext | null;
}) {
  const { setBackground } = useStyles();
  const { currentTrack } = usePlayer();

  useEffect(() => setBackground("player2"), []);

  useEffect(() => {
    if (!currentTrack) return;

    const timeout = setTimeout(() => {
      const element = document.getElementById(`song-${currentTrack.id}`);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 250);

    return () => clearTimeout(timeout);
  }, [currentTrack]);

  return (
    <BelowNowPlayingWrapper height={100} padding={0}>
      <Flex
        w="calc(100vw - 50px)"
        direction={{ base: "column-reverse", md: "row" }}
      >
        <Flex
          flex={1}
          direction="column"
          overflowY="scroll"
          h="calc(100vh - 130px)"
        >
          {playlistContext?.songs.map((song, index) => (
            <ScrollPiece key={song.id} song={song} index={index} />
          ))}
        </Flex>
        <Flex
          flex={1}
          display={{ base: "none", md: "flex" }}
          overflowY="scroll"
          align="flex-start"
        >
          {playlistContext?.imageUrl ? (
            <Image
              src={playlistContext?.imageUrl}
              alt="Playlist Cover"
              objectFit="contain"
              m={0}
              pt="10px"
            />
          ) : playlistContext ? (
            <ReplacementCover />
          ) : null}
        </Flex>
      </Flex>
    </BelowNowPlayingWrapper>
  );
}

function ScrollPiece({ song, index }: { song: NowPlaying; index: number }) {
  const { currentTrack, selectSong } = usePlayer();
  const [selected, setSelected] = useState(currentTrack?.id === song.id);

  useEffect(() => {
    setSelected(currentTrack?.id === song.id);
  }, [currentTrack]);

  if (index === 0) {
    return (
      <Flex
        id={`${song.id}`}
        borderBottom="1px solid black"
        mb={{ base: "5px", md: "10px" }}
        pb={{ base: "5px", md: "10px" }}
        pt={{ base: "5px", md: "10px" }}
        w={{ base: "100%", md: "90%" }}
        _hover={{ cursor: "pointer" }}
        onClick={() => selectSong(song.name)}
        color={selected ? "bright_pink" : "black"}
      >
        <Text fontSize={{ base: "30px", md: "45px" }} lineHeight="45px">
          {song.name}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      id={`${song.id}`}
      borderBottom="1px solid black"
      mb={{ base: "5px", md: "10px" }}
      pb={{ base: "5px", md: "10px" }}
      w={{ base: "100%", md: "90%" }}
      _hover={{ cursor: "pointer" }}
      onClick={() => selectSong(song.name)}
      color={selected ? "bright_pink" : "black"}
    >
      <Box position="relative" top="-200px" id={`song-${song.id}`} />
      <Text fontSize={{ base: "30px", md: "45px" }} lineHeight="45px">
        {song.name}
      </Text>
    </Flex>
  );
}

function ReplacementCover() {
  return (
    <Flex
      flex={1}
      align="center"
      justify="center"
      h="calc(100vh - 130px)"
      pt="10px"
    >
      This playlist is still waiting for a cover
    </Flex>
  );
}

"use client";

import { usePlayer } from "@/components/Providers/PlayerProvider";
import { useStyles } from "@/components/Providers/StyleProvider";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BelowNowPlayingWrapper from "../BelowNowPlayingWrapper";
import { PlaylistContext, NowPlaying } from "@/lib/types";

export default function Player1({
  playlistContext,
}: {
  playlistContext: PlaylistContext;
}) {
  const { setBackground } = useStyles();
  const { currentTrack } = usePlayer();

  useEffect(() => setBackground("player1"), []);

  useEffect(() => {
    if (!currentTrack) return;

    const timeout = setTimeout(() => {
      const element = document.getElementById(`song-${currentTrack.id}`);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 250);

    return () => clearTimeout(timeout);
  }, [currentTrack]);

  return (
    <BelowNowPlayingWrapper height={100} padding={15}>
      {playlistContext.songs.map((song: NowPlaying, index: number) => (
        <ScrollPiece key={song.id} song={song} index={index} />
      ))}
    </BelowNowPlayingWrapper>
  );
}

function ScrollPiece({ song, index }: { song: NowPlaying; index: number }) {
  const { currentTrack, selectSong } = usePlayer();
  const [selected, setSelected] = useState(currentTrack?.id === song.id);

  useEffect(() => {
    setSelected(currentTrack?.id === song.id);
  }, [currentTrack]);

  return (
    <Flex
      id={`${song.id}`}
      fontStyle="italic"
      fontSize={{ base: "40px", sm: "70px", md: "100px", lg: "150px" }}
      lineHeight={{ base: "40px", sm: "65px", md: "90px", lg: "135px" }}
      _hover={{ cursor: "pointer" }}
      onClick={() => {
        selectSong(song.name);
      }}
      borderBottom="1px solid black"
      w="calc(100vw - 50px)"
      mb="15px"
      pb="15px"
      opacity={selected ? 1 : 0.5}
      zIndex={10}
    >
      <Box position="relative" top="-200px" id={`song-${song.id}`} />
      <Text
        className={
          selected ? "player1-reactive-selected" : "player1-reactive-unselected"
        }
      >
        {song.name}
      </Text>
    </Flex>
  );
}

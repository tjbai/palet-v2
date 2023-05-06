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
  const { nowPlaying } = usePlayer();

  useEffect(() => setBackground("player2"), []);

  useEffect(() => {
    if (!nowPlaying) return;

    const timeout = setTimeout(() => {
      const element = document.getElementById(`${nowPlaying.id}`);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  }, [nowPlaying]);

  console.log(playlistContext);

  return (
    <Flex position="relative" top="130px" overflowY="scroll" zIndex={10}>
      <Flex flex={1} direction="row" zIndex={-1} h="calc(100vh - 130px)">
        <Flex
          flex={1}
          direction="column"
          h={{ base: "calc(100vh - 115px)", md: "calc(100vh - 130px)" }}
        >
          <Flex
            position="fixed"
            fontWeight="bold"
            fontSize={{ base: "12px", md: "17px" }}
            h={{ base: "30px", md: "50px" }}
            w={{ base: "calc(100vw - 50px", md: "calc(50vw - 50px)" }}
            align="center"
            backgroundColor="bg"
            zIndex={2}
            m={0}
          >
            {playlistContext.name}
          </Flex>
          <Flex
            position="relative"
            top="50px"
            direction="column"
            overflowY="scroll"
            h="calc(100vh - 180px)"
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
            src={playlistContext.coverUrl}
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
  const { nowPlaying, setPlaylistContext } = usePlayer();
  const [selected, setSelected] = useState(nowPlaying?.id === song.id);

  useEffect(() => {
    setSelected(nowPlaying?.id === song.id);
  }, [nowPlaying]);

  const selectSong = () => {
    setPlaylistContext({ ...playlistContext, index });
  };

  return (
    <Flex
      id={`${song.id}`}
      borderBottom="1px solid black"
      pb="10px"
      w={{ base: "100%", md: "90%" }}
      mb="10px"
      _hover={{ cursor: "pointer" }}
      onClick={selectSong}
      color={selected ? "bright_pink" : "black"}
      pt={index ? "0px" : "10px"}
    >
      <Text fontSize="45px" lineHeight="45px">
        {song.title}
      </Text>
    </Flex>
  );
}

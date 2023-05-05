"use client";

import { usePlayer } from "@/components/Providers/PlayerProvider";
import { useStyles } from "@/components/Providers/StyleProvider";
import ClickIcon from "@/components/Util/ClickIcon";
import artistsToString from "@/lib/funcs/artistsToString";
import { PlaylistContext, NowPlaying } from "@/lib/hooks/usePlayerState";
import { Flex, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RiSkipForwardFill, RiSkipBackFill } from "react-icons/ri";

export default function Player1({
  playlistContext,
}: {
  playlistContext: PlaylistContext;
}) {
  const { setBackgroundImage, setGradient, gradient } = useStyles();
  const { nowPlaying } = usePlayer();

  useEffect(() => {
    setBackgroundImage("images/player-bg-1.jpg");
    setGradient({ position: "top", intensity: 70 });
  }, []);

  useEffect(() => {
    if (!nowPlaying) return;
    const element = document.getElementById(`${nowPlaying.id}`);
    element?.scrollIntoView({ behavior: "smooth" });
  }, [nowPlaying]);

  return (
    <Flex position="relative" h="80vh">
      <Flex
        w="calc(100vw - 50px)"
        borderY="1px solid"
        h="60px"
        top="70px"
        position="fixed"
        align="center"
        justify="space-between"
        color={gradient.position === "top" ? "black" : "white"}
        borderColor={gradient.position === "top" ? "black" : "white"}
        transition="color 2s ease-in-out"
      >
        <Text fontWeight="bold">
          NOW PLAYING: {nowPlaying?.title}
          {nowPlaying?.artists
            ? " by " + artistsToString(nowPlaying?.artists)
            : ""}
        </Text>
        <Controls />
      </Flex>
      <Flex
        position="relative"
        top="130px"
        direction="column"
        overflowX="scroll"
        pt="15px"
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
      fontStyle="italic"
      fontSize="150px"
      lineHeight="135px"
      _hover={{ cursor: "pointer" }}
      onClick={selectSong}
      borderBottom="1px solid black"
      w="100%"
      mb="15px"
      pb="15px"
      opacity={selected ? 1 : 0.5}
    >
      <text
        className={
          selected ? "player1-reactive-selected" : "player1-reactive-unselected"
        }
      >
        {song.title}
      </text>
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

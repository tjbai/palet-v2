"use client";

import { usePlayer } from "@/components/Providers/PlayerProvider";
import { useStyles } from "@/components/Providers/StyleProvider";
import { MAX_KANDI_DONATION, USER_DONATIONS_QUERY } from "@/lib/constants";
import useKandi from "@/lib/hooks/useKandi";
import { NowPlaying, PlaylistContext, UserDonations } from "@/lib/types";
import { Box, Flex, Text, border } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import BelowNowPlayingWrapper from "../BelowNowPlayingWrapper";
import { usePlayerController } from "../PlayerController";
import { px } from "framer-motion";
import styleConstants from "@/lib/chakra/styleConstants";

export default function Player1({
  playlistContext,
}: {
  playlistContext: PlaylistContext | null;
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
    <Flex
      h="calc(100vh - 120px)"
      top="120px"
      position="absolute"
      flex={1}
      direction="column"
      overflowY="scroll"
    >
      {playlistContext?.songs.map((song: NowPlaying, index: number) => (
        <ScrollPiece key={song.id} song={song} index={index} />
      ))}
    </Flex>
    // <BelowNowPlayingWrapper height={100} padding={15}>

    // </BelowNowPlayingWrapper>
  );
}

function ScrollPiece({ song, index }: { song: NowPlaying; index: number }) {
  const { currentTrack, selectSong } = usePlayer();
  const [selected, setSelected] = useState(currentTrack?.id === song.id);
  const { userDonations } = usePlayerController();

  const [highlightThreshold, setHighlightThreshold] = useState(
    userDonations?.linkedSongs[song.id] ?? 0
  );

  useEffect(() => {
    setSelected(currentTrack?.id === song.id);
  }, [currentTrack]);

  useEffect(() => {
    setHighlightThreshold(userDonations?.linkedSongs[song.id] ?? 0);
  }, [userDonations]);

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
      position="relative"
    >
      <Flex flex={1} maxW={selected ? "80%" : "100%"}>
        <Box position="relative" top="-100px" id={`song-${song.id}`} />
        <Text
          className={
            selected
              ? "player1-reactive-selected"
              : "player1-reactive-unselected"
          }
        >
          {song.name}
        </Text>
      </Flex>

      {selected && userDonations ? (
        <Flex
          position="absolute"
          right="5%"
          align="center"
          justify="center"
          top="50%"
          transform="translateY(-50%)"
        >
          {Array.from({ length: MAX_KANDI_DONATION }).map((_, index) => (
            <KandiBarPiece
              key={index}
              setHighlightThreshold={setHighlightThreshold}
              highlightThreshold={highlightThreshold}
              baseline={userDonations?.linkedSongs[song.id] ?? 0}
              index={index + 1}
              songId={song.id}
            />
          ))}
        </Flex>
      ) : null}
    </Flex>
  );
}

const COLORS = ["#e96034", "#e46044", "#d56170", "#be62b4", "#a463ff"];

function KandiBarPiece({
  setHighlightThreshold,
  highlightThreshold,
  baseline,
  index,
  songId,
}: {
  setHighlightThreshold: Dispatch<SetStateAction<number>>;
  highlightThreshold: number;
  baseline: number;
  index: number;
  songId: number;
}) {
  const { sendDonation } = useKandi();
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    if (index > baseline) setHighlightThreshold(index);
  };
  const handleMouseLeave = () => setHighlightThreshold(baseline);

  const donateKandiMutation = useMutation(sendDonation, {
    onMutate: async (amount: number) => {
      await queryClient.cancelQueries(USER_DONATIONS_QUERY);

      // save this for rollback
      const previousUserDonations =
        queryClient.getQueryData(USER_DONATIONS_QUERY);

      // generate optimistic update
      queryClient.setQueryData(
        USER_DONATIONS_QUERY,
        (old: UserDonations | undefined) => {
          if (old) {
            return {
              ...old,
              linkedSongs: {
                ...old.linkedSongs,
                [songId]: baseline + amount,
              },
            };
          } else return {} as UserDonations; // this really shouldn't ever happen????
        }
      );

      // local state optimistic update too
      setHighlightThreshold(baseline + amount);

      return { previousUserDonations };
    },

    onError(error, variables, context) {
      queryClient.setQueryData(
        USER_DONATIONS_QUERY,
        context?.previousUserDonations
      );
      setHighlightThreshold(baseline);
    },
  });

  return (
    <Flex
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (index < highlightThreshold) return;
        donateKandiMutation.mutate(index - baseline);
      }}
      color={index <= highlightThreshold ? "white" : "black"}
      bg={index <= highlightThreshold ? COLORS[index - 1] : "transparent"}
      border="1px solid"
      borderColor={"black"}
      borderLeftRadius={index === 1 ? "2vw" : "0px"}
      borderRightRadius={index === 5 ? "2vw" : "0px"}
      p="0.5vw"
      px="0.75vw"
      fontSize="5vw"
      lineHeight="5vw"
      fontStyle="normal"
    >
      {index}
    </Flex>
  );
}

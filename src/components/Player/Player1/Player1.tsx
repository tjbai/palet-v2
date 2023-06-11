"use client";

import { usePlayer } from "@/components/Providers/PlayerProvider";
import { useStyles } from "@/components/Providers/StyleProvider";
import { Box, Flex, Text, color } from "@chakra-ui/react";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import BelowNowPlayingWrapper from "../BelowNowPlayingWrapper";
import { PlaylistContext, NowPlaying, UserDonations } from "@/lib/types";
import { isArrayLiteralExpression } from "typescript";
import { MAX_KANDI_DONATION, USER_DONATIONS_QUERY } from "@/lib/constants";
import { usePlayerController } from "../PlayerController";
import useKandi from "@/lib/hooks/useKandi";
import { QueryClient, useMutation, useQueryClient } from "react-query";

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
    <BelowNowPlayingWrapper height={100} padding={15}>
      {playlistContext?.songs.map((song: NowPlaying, index: number) => (
        <ScrollPiece key={song.id} song={song} index={index} />
      ))}
    </BelowNowPlayingWrapper>
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
      <Box position="relative" top="-200px" id={`song-${song.id}`} />
      <Text
        className={
          selected ? "player1-reactive-selected" : "player1-reactive-unselected"
        }
      >
        {song.name}
      </Text>

      {selected && userDonations ? (
        <Flex position="absolute" bottom="0px" right="0px">
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

    onSettled: () => {
      queryClient.invalidateQueries(USER_DONATIONS_QUERY);
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
    >
      {index}
    </Flex>
  );
}

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
  const [baselineThreshold, setBaselineThreshold] = useState(
    userDonations?.linkedSongs[song.id] ?? 0
  );
  const [highlightThreshold, setHighlightThreshold] = useState(
    userDonations?.linkedSongs[song.id] ?? 0
  );

  useEffect(() => {
    setSelected(currentTrack?.id === song.id);
  }, [currentTrack]);

  useEffect(() => {
    setBaselineThreshold(userDonations?.linkedSongs[song.id] ?? 0);
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

      {/* {selected && userDonations ? (
        <Flex position="absolute" bottom="0px" right="0px">
          {Array.from({ length: MAX_KANDI_DONATION }).map((_, index) => (
            <KandiBarPiece
              key={index}
              setBaselineThreshold={setBaselineThreshold}
              baselineThreshold={userDonations?.linkedSongs[song.id] ?? 0}
              index={index + 1}
              color={index + 1 <= baselineThreshold ? "white" : "black"}
              songId={song.id}
            />
          ))}
        </Flex>
      ) : null} */}
    </Flex>
  );
}

function KandiBarPiece({
  setBaselineThreshold,
  baselineThreshold,
  index,
  color,
  songId,
}: {
  setBaselineThreshold: Dispatch<SetStateAction<number>>;
  baselineThreshold: number;
  index: number;
  color: string;
  songId: number;
}) {
  const { sendDonation } = useKandi();
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    if (index > baselineThreshold) {
      setBaselineThreshold(index);
    }
  };
  const handleMouseLeave = () => setBaselineThreshold(baselineThreshold);

  const mockSendDonation = async (amount: number) => {
    setTimeout(() => {
      console.log(`just attempted to donate ${amount}`);
    }, 2000);
  };

  const donateKandiMutation = useMutation(mockSendDonation, {
    onMutate: async (amount) => {
      await queryClient.cancelQueries(USER_DONATIONS_QUERY);

      console.log(`just canceled queries for new donation of amount ${amount}`);

      // save this for rollback
      const previousUserDonations =
        queryClient.getQueryData(USER_DONATIONS_QUERY);
      const previousBaselineThreshold = baselineThreshold;

      // generate optimistic update
      queryClient.setQueryData(
        USER_DONATIONS_QUERY,
        (old: UserDonations | undefined) => {
          if (old) {
            return {
              ...old,
              linkedSongs: {
                ...old.linkedSongs,
                [songId]: baselineThreshold + amount,
              },
            };
          } else return {} as UserDonations; // this really shouldn't ever happen????
        }
      );

      // local state optimistic update too
      setBaselineThreshold((p: number) => p + amount);

      console.log("just finished changes");

      return { previousUserDonations, previousBaselineThreshold };
    },

    onError(error, variables, context) {
      console.log("just rolled back");

      queryClient.setQueryData(
        USER_DONATIONS_QUERY,
        context?.previousUserDonations
      );
      setBaselineThreshold(context?.previousBaselineThreshold!);
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
        if (index <= baselineThreshold) return;
        donateKandiMutation.mutate(index - baselineThreshold);
      }}
      color={color}
    >
      {index}
    </Flex>
  );
}
